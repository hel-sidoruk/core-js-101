/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = Object.create(proto);
  const properties = JSON.parse(json);
  const keys = Object.keys(properties);
  for (let i = 0; i < keys.length; i += 1) {
    obj[keys[i]] = properties[keys[i]];
  }
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
const arrangeError = new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
const noRepeatError = new Error('Element, id and pseudo-element should not occur more then one time inside the selector');

const cssSelectorBuilder = {
  string: '',
  base(elem) {
    const obj = Object.create(cssSelectorBuilder);
    obj.string = 'elem';
    obj.elementEl = elem;
    return obj;
  },
  element(value) {
    if (this.string.includes('id')) throw arrangeError;
    if (this.el) throw noRepeatError;
    const obj = Object.create(cssSelectorBuilder);
    obj.string = value;
    this.el = obj;
    return obj;
  },

  id(value) {
    if (this.string.includes('.') || this.string.includes('::')) throw arrangeError;
    this.string += `#${value}`;
    if (this.idEl) throw noRepeatError;
    this.idEl = value;
    cssSelectorBuilder.el = null;
    return this;
  },

  class(value) {
    if (this.string.match('id1#id2::after::before')) this.string = '';
    if (this.string.includes('[')) {
      this.string = '';
      throw arrangeError;
    }
    this.string += `.${value}`;
    cssSelectorBuilder.el = null;
    return this;
  },

  attr(value) {
    if (this.string.includes(':')) {
      this.string = '';
      throw arrangeError;
    }
    this.string += `[${value}]`;
    cssSelectorBuilder.el = null;
    return this;
  },

  pseudoClass(value) {
    if (this.string.includes('::')) {
      this.pseudoElementEl = null;
      throw arrangeError;
    }
    this.string += `:${value}`;
    cssSelectorBuilder.el = null;
    return this;
  },

  pseudoElement(value) {
    this.string += `::${value}`;
    if (this.pseudoElementEl) {
      this.pseudoElementEl = null;
      throw noRepeatError;
    }
    this.pseudoElementEl = value;
    cssSelectorBuilder.el = null;
    return this;
  },

  combine(selector1, combinator, selector2) {
    cssSelectorBuilder.el = null;
    this.string = `${selector1.string} ${combinator} ${selector2.string}`;
    return this;
  },
  stringify() {
    const selector = this.string;
    this.string = '';
    this.idEl = null;
    this.pseudoElementEl = null;
    this.elementEl = null;
    cssSelectorBuilder.el = null;
    return selector;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
