/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

// UNUSED EXPORTS: JoyDialog

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/zepto.js
//     Zepto.js
//     (c) 2010-2017 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
    document = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div'),
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
    isArray = Array.isArray ||
      function(object){ return object instanceof Array }

  zepto.matches = function(element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false
    var matchesSelector = element.matches || element.webkitMatchesSelector ||
                          element.mozMatchesSelector || element.oMatchesSelector ||
                          element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }

  function likeArray(obj) {
    var length = !!obj && 'length' in obj && obj.length,
      type = $.type(obj)

    return 'function' != type && !isWindow(obj) && (
      'array' == type || length === 0 ||
        (typeof length == 'number' && length > 0 && (length - 1) in obj)
    )
  }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  function Z(dom, selector) {
    var i, len = dom ? dom.length : 0
    for (i = 0; i < len; i++) this[i] = dom[i]
    this.length = len
    this.selector = selector || ''
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overridden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
      if (!(name in containers)) name = '*'

      container = containers[name]
      container.innerHTML = '' + html
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }

    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }

    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. This method can be overridden in plugins.
  zepto.Z = function(dom, selector) {
    return new Z(dom, selector)
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overridden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overridden in plugins.
  zepto.init = function(selector, context) {
    var dom
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim()
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, just return it
    else if (zepto.isZ(selector)) return selector
    else {
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overridden in plugins.
  zepto.qsa = function(element, selector){
    var found,
        maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly)
    return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
      slice.call(
        isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      )
  }

  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = document.documentElement.contains ?
    function(parent, node) {
      return parent !== node && parent.contains(node)
    } :
    function(parent, node) {
      while (node && (node = node.parentNode))
        if (node === parent) return true
      return false
    }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className || '',
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          +value + "" == value ? +value :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.isNumeric = function(val) {
    var num = Number(val), type = typeof val
    return val != null && type != 'boolean' &&
      (type != 'string' || val.length) &&
      !isNaN(num) && isFinite(num) || false
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }
  $.noop = function() {}

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    constructor: zepto.Z,
    length: 0,

    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    splice: emptyArray.splice,
    indexOf: emptyArray.indexOf,
    concat: function(){
      var i, value, args = []
      for (i = 0; i < arguments.length; i++) {
        value = arguments[i]
        args[i] = zepto.isZ(value) ? value.toArray() : value
      }
      return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
    },

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      // don't use "interactive" on IE <= 10 (it can fired premature)
      if (document.readyState === "complete" ||
          (document.readyState !== "loading" && !document.documentElement.doScroll))
        setTimeout(function(){ callback($) }, 0)
      else {
        var handler = function() {
          document.removeEventListener("DOMContentLoaded", handler, false)
          window.removeEventListener("load", handler, false)
          callback($)
        }
        document.addEventListener("DOMContentLoaded", handler, false)
        window.addEventListener("load", handler, false)
      }
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return typeof selector == 'string' ? this.length > 0 && zepto.matches(this[0], selector) : 
          selector && this.selector == selector.selector
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (!selector) result = $()
      else if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var nodes = [], collection = typeof selector == 'object' && $(selector)
      this.each(function(_, node){
        while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
          node = node !== context && !isDocument(node) && node.parentNode
        if (node && nodes.indexOf(node) < 0) nodes.push(node)
      })
      return $(nodes)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return 0 in arguments ?
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        }) :
        (0 in this ? this[0].innerHTML : null)
    },
    text: function(text){
      return 0 in arguments ?
        this.each(function(idx){
          var newText = funcArg(this, text, idx, this.textContent)
          this.textContent = newText == null ? '' : ''+newText
        }) :
        (0 in this ? this.pluck('textContent').join("") : null)
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && !(1 in arguments)) ?
        (0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
        setAttribute(this, attribute)
      }, this)})
    },
    prop: function(name, value){
      name = propMap[name] || name
      return (typeof name == 'string' && !(1 in arguments)) ?
        (this[0] && this[0][name]) :
        this.each(function(idx){
          if (isObject(name)) for (key in name) this[propMap[key] || key] = name[key]
          else this[name] = funcArg(this, value, idx, this[name])
        })
    },
    removeProp: function(name){
      name = propMap[name] || name
      return this.each(function(){ delete this[name] })
    },
    data: function(name, value){
      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

      var data = (1 in arguments) ?
        this.attr(attrName, value) :
        this.attr(attrName)

      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      if (0 in arguments) {
        if (value == null) value = ""
        return this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        })
      } else {
        return this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
           this[0].value)
      }
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (!this.length) return null
      if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0]))
        return {top: 0, left: 0}
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2) {
        var element = this[0]
        if (typeof property == 'string') {
          if (!element) return
          return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
        } else if (isArray(property)) {
          if (!element) return
          var props = {}
          var computedStyle = getComputedStyle(element, '')
          $.each(property, function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (!name) return false
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      if (!name) return this
      return this.each(function(idx){
        if (!('className' in this)) return
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (!('className' in this)) return
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      if (!name) return this
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    scrollLeft: function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            var arr = []
            argType = type(arg)
            if (argType == "array") {
              arg.forEach(function(el) {
                if (el.nodeType !== undefined) return arr.push(el)
                else if ($.zepto.isZ(el)) return arr = arr.concat(el.get())
                arr = arr.concat(zepto.fragment(el))
              })
              return arr
            }
            return argType == "object" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        var parentInDocument = $.contains(document.documentElement, parent)

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          parent.insertBefore(node, target)
          if (parentInDocument) traverseNode(node, function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src){
              var target = el.ownerDocument ? el.ownerDocument.defaultView : window
              target['eval'].call(target, el.innerHTML)
            }
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

// If `$` is not yet defined, point it to `Zepto`
// window.Zepto = Zepto
// window.$ === undefined && (window.$ = Zepto)
/* harmony default export */ var zepto = (Zepto);

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/assets.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

function zepto_assets($){
  var cache = [], timeout

  $.fn.remove = function(){
    return this.each(function(){
      if(this.parentNode){
        if(this.tagName === 'IMG'){
          cache.push(this)
          this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
          if (timeout) clearTimeout(timeout)
          timeout = setTimeout(function(){ cache = [] }, 60000)
        }
        this.parentNode.removeChild(this)
      }
    })
  }
}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/callbacks.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
function zepto_callback($){
  // Create a collection of callbacks to be fired in a sequence, with configurable behaviour
  // Option flags:
  //   - once: Callbacks fired at most one time.
  //   - memory: Remember the most recent context and arguments
  //   - stopOnFalse: Cease iterating over callback list
  //   - unique: Permit adding at most one instance of the same callback
  $.Callbacks = function(options) {
    options = $.extend({}, options)

    var memory, // Last fire value (for non-forgettable lists)
        fired,  // Flag to know if list was already fired
        firing, // Flag to know if list is currently firing
        firingStart, // First callback to fire (used internally by add and fireWith)
        firingLength, // End of the loop when firing
        firingIndex, // Index of currently firing callback (modified by remove if needed)
        list = [], // Actual callback list
        stack = !options.once && [], // Stack of fire calls for repeatable lists
        fire = function(data) {
          memory = options.memory && data
          fired = true
          firingIndex = firingStart || 0
          firingStart = 0
          firingLength = list.length
          firing = true
          for ( ; list && firingIndex < firingLength ; ++firingIndex ) {
            if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
              memory = false
              break
            }
          }
          firing = false
          if (list) {
            if (stack) stack.length && fire(stack.shift())
            else if (memory) list.length = 0
            else Callbacks.disable()
          }
        },

        Callbacks = {
          add: function() {
            if (list) {
              var start = list.length,
                  add = function(args) {
                    $.each(args, function(_, arg){
                      if (typeof arg === "function") {
                        if (!options.unique || !Callbacks.has(arg)) list.push(arg)
                      }
                      else if (arg && arg.length && typeof arg !== 'string') add(arg)
                    })
                  }
              add(arguments)
              if (firing) firingLength = list.length
              else if (memory) {
                firingStart = start
                fire(memory)
              }
            }
            return this
          },
          remove: function() {
            if (list) {
              $.each(arguments, function(_, arg){
                var index
                while ((index = $.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1)
                  // Handle firing indexes
                  if (firing) {
                    if (index <= firingLength) --firingLength
                    if (index <= firingIndex) --firingIndex
                  }
                }
              })
            }
            return this
          },
          has: function(fn) {
            return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
          },
          empty: function() {
            firingLength = list.length = 0
            return this
          },
          disable: function() {
            list = stack = memory = undefined
            return this
          },
          disabled: function() {
            return !list
          },
          lock: function() {
            stack = undefined
            if (!memory) Callbacks.disable()
            return this
          },
          locked: function() {
            return !stack
          },
          fireWith: function(context, args) {
            if (list && (!fired || stack)) {
              args = args || []
              args = [context, args.slice ? args.slice() : args]
              if (firing) stack.push(args)
              else fire(args)
            }
            return this
          },
          fire: function() {
            return Callbacks.fireWith(this, arguments)
          },
          fired: function() {
            return !!fired
          }
        }

    return Callbacks
  }
}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/data.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

// The following code is heavily inspired by jQuery's $.fn.data()
function zepto_data($){
  var data = {}, dataAttr = $.fn.data, camelize = $.camelCase,
    exp = $.expando = 'Zepto' + (+new Date()), emptyArray = []

  // Get value from node:
  // 1. first try key as given,
  // 2. then try camelized key,
  // 3. fall back to reading "data-*" attribute.
  function getData(node, name) {
    var id = node[exp], store = id && data[id]
    if (name === undefined) return store || setData(node)
    else {
      if (store) {
        if (name in store) return store[name]
        var camelName = camelize(name)
        if (camelName in store) return store[camelName]
      }
      return dataAttr.call($(node), name)
    }
  }

  // Store value under camelized key on node
  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++$.uuid),
      store = data[id] || (data[id] = attributeData(node))
    if (name !== undefined) store[camelize(name)] = value
    return store
  }

  // Read all "data-*" attributes from a node
  function attributeData(node) {
    var store = {}
    $.each(node.attributes || emptyArray, function(i, attr){
      if (attr.name.indexOf('data-') == 0)
        store[camelize(attr.name.replace('data-', ''))] =
          $.zepto.deserializeValue(attr.value)
    })
    return store
  }

  $.fn.data = function(name, value) {
    return value === undefined ?
      // set multiple values via object
      $.isPlainObject(name) ?
        this.each(function(i, node){
          $.each(name, function(key, value){ setData(node, key, value) })
        }) :
        // get value from first element
        (0 in this ? getData(this[0], name) : undefined) :
      // set value on all elements
      this.each(function(){ setData(this, name, value) })
  }

  $.data = function(elem, name, value) {
    return $(elem).data(name, value)
  }

  $.hasData = function(elem) {
    var id = elem[exp], store = id && data[id]
    return store ? !$.isEmptyObject(store) : false
  }

  $.fn.removeData = function(names) {
    if (typeof names == 'string') names = names.split(/\s+/)
    return this.each(function(){
      var id = this[exp], store = id && data[id]
      if (store) $.each(names || store, function(key){
        delete store[names ? camelize(this) : key]
      })
    })
  }

  // Generate extended `remove` and `empty` functions
  ;['remove', 'empty'].forEach(function(methodName){
    var origFn = $.fn[methodName]
    $.fn[methodName] = function() {
      var elements = this.find('*')
      if (methodName === 'remove') elements = elements.add(this)
      elements.removeData()
      return origFn.call(this)
    }
  })
}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/deferred.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
//
//     Some code (c) 2005, 2013 jQuery Foundation, Inc. and other contributors
function zepto_deferred($){
  var slice = Array.prototype.slice

  function Deferred(func) {
    var tuples = [
          // action, add listener, listener list, final state
          [ "resolve", "done", $.Callbacks({once:1, memory:1}), "resolved" ],
          [ "reject", "fail", $.Callbacks({once:1, memory:1}), "rejected" ],
          [ "notify", "progress", $.Callbacks({memory:1}) ]
        ],
        state = "pending",
        promise = {
          state: function() {
            return state
          },
          always: function() {
            deferred.done(arguments).fail(arguments)
            return this
          },
          then: function(/* fnDone [, fnFailed [, fnProgress]] */) {
            var fns = arguments
            return Deferred(function(defer){
              $.each(tuples, function(i, tuple){
                var fn = $.isFunction(fns[i]) && fns[i]
                deferred[tuple[1]](function(){
                  var returned = fn && fn.apply(this, arguments)
                  if (returned && $.isFunction(returned.promise)) {
                    returned.promise()
                      .done(defer.resolve)
                      .fail(defer.reject)
                      .progress(defer.notify)
                  } else {
                    var context = this === promise ? defer.promise() : this,
                        values = fn ? [returned] : arguments
                    defer[tuple[0] + "With"](context, values)
                  }
                })
              })
              fns = null
            }).promise()
          },

          promise: function(obj) {
            return obj != null ? $.extend( obj, promise ) : promise
          }
        },
        deferred = {}

    $.each(tuples, function(i, tuple){
      var list = tuple[2],
          stateString = tuple[3]

      promise[tuple[1]] = list.add

      if (stateString) {
        list.add(function(){
          state = stateString
        }, tuples[i^1][2].disable, tuples[2][2].lock)
      }

      deferred[tuple[0]] = function(){
        deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments)
        return this
      }
      deferred[tuple[0] + "With"] = list.fireWith
    })

    promise.promise(deferred)
    if (func) func.call(deferred, deferred)
    return deferred
  }

  $.when = function(sub) {
    var resolveValues = slice.call(arguments),
        len = resolveValues.length,
        i = 0,
        remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
        deferred = remain === 1 ? sub : Deferred(),
        progressValues, progressContexts, resolveContexts,
        updateFn = function(i, ctx, val){
          return function(value){
            ctx[i] = this
            val[i] = arguments.length > 1 ? slice.call(arguments) : value
            if (val === progressValues) {
              deferred.notifyWith(ctx, val)
            } else if (!(--remain)) {
              deferred.resolveWith(ctx, val)
            }
          }
        }

    if (len > 1) {
      progressValues = new Array(len)
      progressContexts = new Array(len)
      resolveContexts = new Array(len)
      for ( ; i < len; ++i ) {
        if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
          resolveValues[i].promise()
            .done(updateFn(i, resolveContexts, resolveValues))
            .fail(deferred.reject)
            .progress(updateFn(i, progressContexts, progressValues))
        } else {
          --remain
        }
      }
    }
    if (!remain) deferred.resolveWith(resolveContexts, resolveValues)
    return deferred.promise()
  }

  $.Deferred = Deferred
}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/detect.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
function zepto_detect($){
  function detect(ua, platform){
    var os = this.os = {}, browser = this.browser = {},
      webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
      android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
      osx = !!ua.match(/\(Macintosh\; Intel /),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      win = /Win\d{2}|Windows/.test(platform),
      wp = ua.match(/Windows Phone ([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
      bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
      rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
      playbook = ua.match(/PlayBook/),
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
      firefox = ua.match(/Firefox\/([\d.]+)/),
      firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
      ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
      webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
      safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
    if (wp) os.wp = true, os.version = wp[1]
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (bb10) os.bb10 = true, os.version = bb10[2]
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
    if (playbook) browser.playbook = true
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) browser.chrome = true, browser.version = chrome[1]
    if (firefox) browser.firefox = true, browser.version = firefox[1]
    if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
    if (ie) browser.ie = true, browser.version = ie[1]
    if (safari && (osx || os.ios || win)) {
      browser.safari = true
      if (!os.ios) browser.version = safari[1]
    }
    if (webview) browser.webview = true

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
      (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
    os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
      (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
      (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
  }

  detect.call($, navigator.userAgent, navigator.platform)
  // make available to unit tests
  $.__detect = detect

}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/event.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
function zepto_event($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      try {
        event.timeStamp || (event.timeStamp = Date.now())
      } catch (ignored) { }

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (callback === undefined || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // handle focus(), blur() by calling them directly
      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
      // items in the collection might not be DOM elements
      else if ('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return (0 in arguments) ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/fx_methods.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

function zepto_fx_methods($, undefined){
  var document = window.document,
    origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle

  function anim(el, speed, opacity, scale, callback) {
    if (typeof speed == 'function' && !callback) callback = speed, speed = undefined
    var props = { opacity: opacity }
    if (scale) {
      props.scale = scale
      el.css($.fx.cssPrefix + 'transform-origin', '0 0')
    }
    return el.animate(props, speed, null, callback)
  }

  function hide(el, speed, scale, callback) {
    return anim(el, speed, 0, scale, function(){
      origHide.call($(this))
      callback && callback.call(this)
    })
  }

  $.fn.show = function(speed, callback) {
    origShow.call(this)
    if (speed === undefined) speed = 0
    else this.css('opacity', 0)
    return anim(this, speed, 1, '1,1', callback)
  }

  $.fn.hide = function(speed, callback) {
    if (speed === undefined) return origHide.call(this)
    else return hide(this, speed, '0,0', callback)
  }

  $.fn.toggle = function(speed, callback) {
    if (speed === undefined || typeof speed == 'boolean')
      return origToggle.call(this, speed)
    else return this.each(function(){
      var el = $(this)
      el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback)
    })
  }

  $.fn.fadeTo = function(speed, opacity, callback) {
    return anim(this, speed, opacity, null, callback)
  }

  $.fn.fadeIn = function(speed, callback) {
    var target = this.css('opacity')
    if (target > 0) this.css('opacity', 0)
    else target = 1
    return origShow.call(this).fadeTo(speed, target, callback)
  }

  $.fn.fadeOut = function(speed, callback) {
    return hide(this, speed, null, callback)
  }

  $.fn.fadeToggle = function(speed, callback) {
    return this.each(function(){
      var el = $(this)
      el[
        (el.css('opacity') == 0 || el.css('display') == 'none') ? 'fadeIn' : 'fadeOut'
      ](speed, callback)
    })
  }

}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/fx.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

function zepto_fx($, undefined){
  var prefix = '', eventPrefix,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
    testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty, transitionDuration, transitionTiming, transitionDelay,
    animationName, animationDuration, animationTiming, animationDelay,
    cssReset = {}

  function dasherize(str) { return str.replace(/([A-Z])/g, '-$1').toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

  if (testEl.style.transform === undefined) $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + vendor.toLowerCase() + '-'
      eventPrefix = event
      return false
    }
  })

  transform = prefix + 'transform'
  cssReset[transitionProperty = prefix + 'transition-property'] =
  cssReset[transitionDuration = prefix + 'transition-duration'] =
  cssReset[transitionDelay    = prefix + 'transition-delay'] =
  cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
  cssReset[animationName      = prefix + 'animation-name'] =
  cssReset[animationDuration  = prefix + 'animation-duration'] =
  cssReset[animationDelay     = prefix + 'animation-delay'] =
  cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function(properties, duration, ease, callback, delay){
    if ($.isFunction(duration))
      callback = duration, ease = undefined, duration = undefined
    if ($.isFunction(ease))
      callback = ease, ease = undefined
    if ($.isPlainObject(duration))
      ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
    if (duration) duration = (typeof duration == 'number' ? duration :
                    ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
    if (delay) delay = parseFloat(delay) / 1000
    return this.anim(properties, duration, ease, callback, delay)
  }

  $.fn.anim = function(properties, duration, ease, callback, delay){
    var key, cssValues = {}, cssProperties, transforms = '',
        that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
        fired = false

    if (duration === undefined) duration = $.fx.speeds._default / 1000
    if (delay === undefined) delay = 0
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssValues[animationName] = properties
      cssValues[animationDuration] = duration + 's'
      cssValues[animationDelay] = delay + 's'
      cssValues[animationTiming] = (ease || 'linear')
      endEvent = $.fx.animationEnd
    } else {
      cssProperties = []
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
      if (duration > 0 && typeof properties === 'object') {
        cssValues[transitionProperty] = cssProperties.join(', ')
        cssValues[transitionDuration] = duration + 's'
        cssValues[transitionDelay] = delay + 's'
        cssValues[transitionTiming] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, wrappedCallback)
      } else
        $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

      fired = true
      $(this).css(cssReset)
      callback && callback.call(this)
    }
    if (duration > 0){
      this.bind(endEvent, wrappedCallback)
      // transitionEnd is not always firing on older Android phones
      // so make sure it gets fired
      setTimeout(function(){
        if (fired) return
        wrappedCallback.call(that)
      }, ((duration + delay) * 1000) + 25)
    }

    // trigger page reflow so new elements can animate
    this.size() && this.get(0).clientLeft

    this.css(cssValues)

    if (duration <= 0) setTimeout(function() {
      that.each(function(){ wrappedCallback.call(this) })
    }, 0)

    return this
  }

  testEl = null
}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/gesture.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
function zepto_gesture($){
  if ($.os.ios) {
    var gesture = {}, gestureTimeout

    function parentIfText(node){
      return 'tagName' in node ? node : node.parentNode
    }

    $(document).bind('gesturestart', function(e){
      var now = Date.now(), delta = now - (gesture.last || now)
      gesture.target = parentIfText(e.target)
      gestureTimeout && clearTimeout(gestureTimeout)
      gesture.e1 = e.scale
      gesture.last = now
    }).bind('gesturechange', function(e){
      gesture.e2 = e.scale
    }).bind('gestureend', function(e){
      if (gesture.e2 > 0) {
        Math.abs(gesture.e1 - gesture.e2) != 0 && $(gesture.target).trigger('pinch') &&
          $(gesture.target).trigger('pinch' + (gesture.e1 - gesture.e2 > 0 ? 'In' : 'Out'))
        gesture.e1 = gesture.e2 = gesture.last = 0
      } else if ('last' in gesture) {
        gesture = {}
      }
    })

    ;['pinch', 'pinchIn', 'pinchOut'].forEach(function(m){
      $.fn[m] = function(callback){ return this.bind(m, callback) }
    })
  }
}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/ie.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

function zepto_ie(){
  // getComputedStyle shouldn't freak out when called
  // without a valid element as argument
  try {
    getComputedStyle(undefined)
  } catch(e) {
    var nativeGetComputedStyle = getComputedStyle
    window.getComputedStyle = function(element, pseudoElement){
      try {
        return nativeGetComputedStyle(element, pseudoElement)
      } catch(e) {
        return null
      }
    }
  }
}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/selector.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
function zepto_selector($){
  var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches

  function visible(elem){
    elem = $(elem)
    return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
  }

  // Implements a subset from:
  // http://api.jquery.com/category/selectors/jquery-selector-extensions/
  //
  // Each filter function receives the current index, all nodes in the
  // considered set, and a value if there were parentheses. The value
  // of `this` is the node currently being considered. The function returns the
  // resulting node(s), null, or undefined.
  //
  // Complex selectors are not supported:
  //   li:has(label:contains("foo")) + li:has(label:contains("bar"))
  //   ul.inner:first > li
  var filters = $.expr[':'] = {
    visible:  function(){ if (visible(this)) return this },
    hidden:   function(){ if (!visible(this)) return this },
    selected: function(){ if (this.selected) return this },
    checked:  function(){ if (this.checked) return this },
    parent:   function(){ return this.parentNode },
    first:    function(idx){ if (idx === 0) return this },
    last:     function(idx, nodes){ if (idx === nodes.length - 1) return this },
    eq:       function(idx, _, value){ if (idx === value) return this },
    contains: function(idx, _, text){ if ($(this).text().indexOf(text) > -1) return this },
    has:      function(idx, _, sel){ if (zepto.qsa(this, sel).length) return this }
  }

  var filterRe = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),
      childRe  = /^\s*>/,
      classTag = 'Zepto' + (+new Date())

  function process(sel, fn) {
    // quote the hash in `a[href^=#]` expression
    sel = sel.replace(/=#\]/g, '="#"]')
    var filter, arg, match = filterRe.exec(sel)
    if (match && match[2] in filters) {
      filter = filters[match[2]], arg = match[3]
      sel = match[1]
      if (arg) {
        var num = Number(arg)
        if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '')
        else arg = num
      }
    }
    return fn(sel, filter, arg)
  }

  zepto.qsa = function(node, selector) {
    return process(selector, function(sel, filter, arg){
      try {
        var taggedParent
        if (!sel && filter) sel = '*'
        else if (childRe.test(sel))
          // support "> *" child queries by tagging the parent node with a
          // unique class and prepending that classname onto the selector
          taggedParent = $(node).addClass(classTag), sel = '.'+classTag+' '+sel

        var nodes = oldQsa(node, sel)
      } catch(e) {
        console.error('error performing selector: %o', selector)
        throw e
      } finally {
        if (taggedParent) taggedParent.removeClass(classTag)
      }
      return !filter ? nodes :
        zepto.uniq($.map(nodes, function(n, i){ return filter.call(n, i, nodes, arg) }))
    })
  }

  zepto.matches = function(node, selector){
    return process(selector, function(sel, filter, arg){
      return (!sel || oldMatches(node, sel)) &&
        (!filter || filter.call(node, null, arg) === node)
    })
  }
}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/stack.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
function zepto_stack($){
  $.fn.end = function(){
    return this.prevObject || $()
  }

  $.fn.andSelf = function(){
    return this.add(this.prevObject || $())
  }

  'filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings'.split(',').forEach(function(property){
    var fn = $.fn[property]
    $.fn[property] = function(){
      var ret = fn.apply(this, arguments)
      ret.prevObject = this
      return ret
    }
  })
}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/src/touch.js
//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
function zepto_touch($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
    longTapDelay = 750,
    gesture,
    down, up, move,
    eventMap,
    initialized = false

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
      Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  function isPrimaryTouch(event){
    return (event.pointerType == 'touch' ||
      event.pointerType == event.MSPOINTER_TYPE_TOUCH)
      && event.isPrimary
  }

  function isPointerEventType(e, type){
    return (e.type == 'pointer'+type ||
      e.type.toLowerCase() == 'mspointer'+type)
  }

  // helper function for tests, so they check for different APIs
  function unregisterTouchEvents(){
    if (!initialized) return
    $(document).off(eventMap.down, down)
      .off(eventMap.up, up)
      .off(eventMap.move, move)
      .off(eventMap.cancel, cancelAll)
    $(window).off('scroll', cancelAll)
    cancelAll()
    initialized = false
  }

  function setup(__eventMap){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

    unregisterTouchEvents()

    eventMap = (__eventMap && ('down' in __eventMap)) ? __eventMap :
      ('ontouchstart' in document ?
      { 'down': 'touchstart', 'up': 'touchend',
        'move': 'touchmove', 'cancel': 'touchcancel' } :
      'onpointerdown' in document ?
      { 'down': 'pointerdown', 'up': 'pointerup',
        'move': 'pointermove', 'cancel': 'pointercancel' } :
       'onmspointerdown' in document ?
      { 'down': 'MSPointerDown', 'up': 'MSPointerUp',
        'move': 'MSPointerMove', 'cancel': 'MSPointerCancel' } : false)

    // No API availables for touch events
    if (!eventMap) return

    if ('MSGesture' in window) {
      gesture = new MSGesture()
      gesture.target = document.body

      $(document)
        .bind('MSGestureEnd', function(e){
          var swipeDirectionFromVelocity =
            e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null
          if (swipeDirectionFromVelocity) {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
          }
        })
    }

    down = function(e){
      if((_isPointerType = isPointerEventType(e, 'down')) &&
        !isPrimaryTouch(e)) return
      firstTouch = _isPointerType ? e : e.touches[0]
      if (e.touches && e.touches.length === 1 && touch.x2) {
        // Clear out touch movement data if we have it sticking around
        // This can occur if touchcancel doesn't fire due to preventDefault, etc.
        touch.x2 = undefined
        touch.y2 = undefined
      }
      now = Date.now()
      delta = now - (touch.last || now)
      touch.el = $('tagName' in firstTouch.target ?
        firstTouch.target : firstTouch.target.parentNode)
      touchTimeout && clearTimeout(touchTimeout)
      touch.x1 = firstTouch.pageX
      touch.y1 = firstTouch.pageY
      if (delta > 0 && delta <= 250) touch.isDoubleTap = true
      touch.last = now
      longTapTimeout = setTimeout(longTap, longTapDelay)
      // adds the current touch contact for IE gesture recognition
      if (gesture && _isPointerType) gesture.addPointer(e.pointerId)
    }

    move = function(e){
      if((_isPointerType = isPointerEventType(e, 'move')) &&
        !isPrimaryTouch(e)) return
      firstTouch = _isPointerType ? e : e.touches[0]
      cancelLongTap()
      touch.x2 = firstTouch.pageX
      touch.y2 = firstTouch.pageY

      deltaX += Math.abs(touch.x1 - touch.x2)
      deltaY += Math.abs(touch.y1 - touch.y2)
    }

    up = function(e){
      if((_isPointerType = isPointerEventType(e, 'up')) &&
        !isPrimaryTouch(e)) return
      cancelLongTap()

      // swipe
      if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
          (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

        swipeTimeout = setTimeout(function() {
          if (touch.el){
            touch.el.trigger('swipe')
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
          }
          touch = {}
        }, 0)

      // normal tap
      else if ('last' in touch)
        // don't fire tap when delta position changed by more than 30 pixels,
        // for instance when moving to a point and back to origin
        if (deltaX < 30 && deltaY < 30) {
          // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
          // ('tap' fires before 'scroll')
          tapTimeout = setTimeout(function() {

            // trigger universal 'tap' with the option to cancelTouch()
            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
            var event = $.Event('tap')
            event.cancelTouch = cancelAll
            // [by paper] fix -> "TypeError: 'undefined' is not an object (evaluating 'touch.el.trigger'), when double tap
            if (touch.el) touch.el.trigger(event)

            // trigger double tap immediately
            if (touch.isDoubleTap) {
              if (touch.el) touch.el.trigger('doubleTap')
              touch = {}
            }

            // trigger single tap after 250ms of inactivity
            else {
              touchTimeout = setTimeout(function(){
                touchTimeout = null
                if (touch.el) touch.el.trigger('singleTap')
                touch = {}
              }, 250)
            }
          }, 0)
        } else {
          touch = {}
        }
        deltaX = deltaY = 0
    }

    $(document).on(eventMap.up, up)
      .on(eventMap.down, down)
      .on(eventMap.move, move)

    // when the browser window loses focus,
    // for example when a modal dialog is shown,
    // cancel all ongoing events
    $(document).on(eventMap.cancel, cancelAll)

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll)

    initialized = true
  }

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
    'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
  })

  $.touch = { setup: setup }

  $(document).ready(setup)
}

;// CONCATENATED MODULE: ./node_modules/joyconn-zepto/index.js














function init($){
    zepto_assets($)
    zepto_callback($)
    zepto_data($)
    zepto_deferred($)
    zepto_detect($)
    zepto_event($)
    zepto_fx_methods($)
    zepto_fx($)
    zepto_gesture($)
    zepto_ie($)
    zepto_selector($)
    zepto_stack($)
    zepto_touch($)
    return $;
}
var  joyconn_zepto_zepto  = init(zepto)



;// CONCATENATED MODULE: ./src/js/util.js
/**----------------------------
  *  私有方法
  ----------------------------*/
/** 
 * 移动端相关数据 =>> clientUtil 对象
 * 是否是安卓  : isAndroid
 * 是否是IOS   : isIOS
 * 是否是微信浏览器   : isWXBrowser
 * 是否是微信小程序   : isWXMiniApp
 * 是否是支付宝客户端   : isAlipayclient
 * 是否是移动端: isMobile
 * 设备平台    : platform [ ios 或 android ]
 * 事件类型    : tapEvent [ tapEvent 或 click ]
 * 系统版本号  : version [ 如: ios 9.1 或 andriod 6.0 ]
 * 是否支持 touch 事件: isSupportTouch
 */
function clientUtil(window) {
  var UA = window.navigator.userAgent,
    isAndroid = /android|adr/gi.test(UA),
    isIOS = /iphone|ipod|ipad/gi.test(UA) && !isAndroid,
    isWXBrowser = /micromessenger|wechat/gi.test(UA),
    isWXMiniApp = /miniprogram/gi.test(UA),
    isAlipayclient = /alipayclient/gi.test(UA),
    isMobile = isAndroid || isIOS || isWXBrowser || isWXMiniApp || isAlipayclient,
    platform = isIOS ? 'ios' :
      (isAndroid ? 'android' :
        (isWXBrowser ? 'wxBrowser' :
          (isWXMiniApp ? 'wxMiniApp' :
            (isAlipayclient ? 'alipayclient' : 'default')))),
    isSupportTouch = "ontouchend" in document ? true : false,
    animation = getSupportAnimation()  ;

  // var reg = isIOS ? (/os [\d._]*/gi):(/android [\d._]*/gi),
  //     verinfo = UA.match(reg),
  //     version = (verinfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");

  return {
    isIOS: isIOS,
    isAndroid: isAndroid,
    isWXBrowser: isWXBrowser,
    isWXMiniApp: isWXMiniApp,
    isAlipayclient: isAlipayclient,
    isMobile: isMobile,
    platform: platform,
    // version: parseFloat(version),
    isSupportTouch: isSupportTouch,
    tapEvent: isMobile && isSupportTouch ? 'tap' : 'click',
    animation:animation
  };
}

function ObjectAssign(target) {
  var index,source,key;
  if (typeof Object.assign == 'function') {
    for ( index = 1; index < arguments.length; index++) {
       source = arguments[index];
      if (source != null) {
        Object.assign(target, source);
      }
    }
  } else {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    target = Object(target);
    for ( index = 1; index < arguments.length; index++) {
       source = arguments[index];
      if (source != null) {
        for (key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
  }
  return target;
}

function getSupportAnimation() {
  var animation = false;
  // var  animationstring = 'animation';
  // var  keyframeprefix = '';
  var  domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
  // var  pfx = '';
  var  elm = document.createElement('div');

  if (elm.style.animationName !== undefined) { animation = true; }

  if (animation === false) {
    for (var i = 0; i < domPrefixes.length; i++) {
      if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
        // pfx = domPrefixes[i];
        // animationstring = pfx + 'Animation';
        // keyframeprefix = '-' + pfx.toLowerCase() + '-';
        animation = true;
        break;
      }
    }
  }
  return animation;
}

;// CONCATENATED MODULE: ./src/js/core.js
/**
 * dialog  v2.1.0
 * @date  2018-04-12
 * @author  eric
 * @home  https://github.com/sufangyu/dialog2
 * @bugs  https://github.com/sufangyu/dialog2/issues
 * Licensed under MIT
 */






var clientObject = clientUtil(window);
/**
 * 插件默认值
 */
var dialog_defaults = {
    type: 'alert',   // 弹窗的类型 [ alert: 确定; confirm: 确定/取消; toast: 状态提示; notice: 提示信息 ]
    style: 'default', // alert 与 confirm 弹窗的风格 [ default: 根据访问设备平台; ios: ios 风格; android: MD design 风格 ]
    titleShow: true,      // 是否显示标题
    titleText: '提示',    // 标题文字
    bodyNoScroll: false,     // body内容不可以滚动
    closeBtnShow: false,     // 是否显示关闭按钮
    content: '',        // 弹窗提示内容, 值可以是 HTML 内容
    contentScroll: true,      // alert 与 confirm 弹窗提示内容是否限制最大高度, 使其可以滚动
    dialogClass: '',        // 弹窗自定义 class
    autoClose: 0,         // 弹窗自动关闭的延迟时间(毫秒)。0: 不自动关闭; 大于0: 自动关闭弹窗的延迟时间
    overlayShow: true,      // 是否显示遮罩层
    overlayClose: false,     // 是否可以点击遮罩层关闭弹窗
    width:'auto',// 宽度 自动auto、100px
    height:'auto',// 高度 自动auto、100px

    buttonStyle: 'side',   // 按钮排版样式 [ side: 并排; stacked: 堆叠 ]
    buttonTextConfirm: '确定',   // 确定按钮文字
    buttonTextCancel: '取消',   // 取消按钮文字
    buttonClassConfirm: '',       // 确定按钮自定义 class
    buttonClassCancel: '',       // 取消按钮自定义 class
    buttons: [],       // confirm 弹窗自定义按钮组, 会覆盖"确定"与"取消"按钮; 单个 button 对象可设置 name [ 名称 ]、class [ 自定义class ]、callback [ 点击执行的函数 ]

    infoIcon: '',        // toast 与 notice 弹窗的提示图标, 值为图标的路径。不设置=不显示
    infoIconColor: '',        // toast 与 notice 弹窗的提示图标, 值为图标的路径。不设置=不显示
    infoText: '',        // toast 与 notice 弹窗的提示文字, 会覆盖 content 的设置
    infoColor: '',// toast 与 notice 弹窗的文字颜色,默认:#fff
    infoBgColor: '',// toast 与 notice 弹窗的背景颜色,默认:rgba(0, 0, 0, 0.8);
    position: 'center',  // notice 弹窗的位置, [top:'顶部', center: 居中; bottom: 底部 ]

    onClickConfirmBtn: function () { },  // “确定”按钮的回调函数
    onClickCancelBtn: function () { },  // “取消”按钮的回调函数
    onBeforeShow: function () { },  // 弹窗显示前的回调函数
    onShow: function () { },  // 弹窗显示后的回调函数
    onBeforeClosed: function () { },  // 弹窗关闭前的回调函数
    onClosed: function () { }   // 弹窗关闭后的回调函数
};
/**
         * 弹窗构造函数
         * @param {json obj}  options   弹窗配置项
         */
function Dialog(options) {
    // var defaultOptions = JSON.parse(JSON.stringify(dialog_defaults))
    this.userOptions=options;
    this.taping=false;//点击事件防止重复触发
    this.settings = ObjectAssign( {}, dialog_defaults, options);
}
Dialog.prototype = {
    /**
     * 初始化弹窗
     */
    _init: function () {
        var self = this;

        // console.log('初始化弹窗');

        clearTimeout(self.autoCloseTimer);

        self.isHided = false;                   // 是否已经隐藏
        self.tapBug = self._hasTapBug();        // 是否有点透 BUG
        self.platform = clientObject.platform;    // 访问设备平台
        self.dislogStyle = self.settings.style === 'default' ? (clientObject.isMobile ? "default" : "pc") : self.settings.style;    // 弹窗风格, 默认自动判断平台; 否则, 为指定平台


        // 创建弹窗显示时, 禁止 body 内容滚动的样式并且添加到 head
        if (joyconn_zepto_zepto('#dialog-body-no-scroll').length === 0) {
            var styleContent = '.body-no-scroll { position: absolute; overflow: hidden; width: 100%; }';
            joyconn_zepto_zepto('head').append('<style id="dialog-body-no-scroll">' + styleContent + '</style>');
        }

        self._renderDOM();
        self._bindEvents();
    },

    /**
     * 渲染弹窗 DOM 结构
     */
    _renderDOM: function () {
        var self = this;

        self.settings.onBeforeShow();
        self._createDialogDOM(self.settings.type);
        self.settings.onShow();
        self._setNoticeContentMargin();
    },

    /**
     * 绑定弹窗相关事件
     */
    _bindEvents: function () {
        var self = this;

        // 确定按钮关闭弹窗
        self.jdz_confirmBtn.on(clientObject.tapEvent, function () {
            // ev.preventDefault();
            if(self._canEval()){
                var callback = self.settings.onClickConfirmBtn();
                if (callback || callback === undefined) {
                    self.closeDialog();
                }
            }
            
        })
        .on('touchend', function (ev) {
            ev.preventDefault();
        });
        function cancelCloseDialog() {
            var callback = self.settings.onClickCancelBtn();
            if (callback || callback === undefined) {
                self.closeDialog();
            }
        }
        // 取消按钮关闭弹窗
        self.jdz_cancelBtn.on(clientObject.tapEvent, function () {
            cancelCloseDialog();
        })
        .on('touchend', function (ev) {
            ev.preventDefault();
        });

        // 关闭按钮关闭弹窗
        self.jdz_closeBtn.on(clientObject.tapEvent, function () {
            cancelCloseDialog()
        })
        .on('touchend', function (ev) {
            ev.preventDefault();
        });

        // 遮罩层关闭弹窗
        if (self.settings.overlayClose) {
            joyconn_zepto_zepto(document).on(clientObject.tapEvent, '.dialog-overlay', function () {
                cancelCloseDialog()
            });
        }

        // 自动关闭弹窗
        if (self.settings.autoClose > 0) {
            // console.log(self.settings.autoClose / 1000 + '秒后, 自动关闭弹窗');
            self._autoClose();
        }

        // 删除弹窗和 tap 点透 BUG 遮罩层, 在隐藏弹窗的动画结束后执行
        joyconn_zepto_zepto(document).on('webkitAnimationEnd MSAnimationEnd animationend', '.dialog-content', function () {
            if (self.isHided) {
                self.removeDialog();

                if (self.tapBug) {
                    self._removeTapOverlayer();
                }
            }
        });

        // 为自定义按钮组绑定回调函数
        if (self.settings.buttons.length) {
            joyconn_zepto_zepto.each(self.settings.buttons, function (index, item) {
                self.jdz_dialogContentFt.children('button').eq(index).on(clientObject.tapEvent, function (ev) {
                    ev.preventDefault();
                    if(self._canEval()){
                        var callback = item.callback();
                        if (callback || callback === undefined) {
                            self.closeDialog();
                        }
                    }
                   
                });
            });
        }

        // 如果弹窗有最大高度设置项, 在窗口大小改变时, 重新设置弹窗最大高度
        joyconn_zepto_zepto(window).on("onorientationchange" in window ? "orientationchange" : "resize", function () {
            if (self.settings.contentScroll) {
                setTimeout(function () {
                    self._resetDialog();
                }, 200);
            }
        });


        // 阻止 body 内容滑动
        joyconn_zepto_zepto(document).on('touchmove', function (e) {
            if (self.jdz_dialog.find(joyconn_zepto_zepto(e.target)).length) {
                return false;
            } else {
                return true;
            }
        });

        // 弹窗有最大高度设置项, 设置提示内容滑动
        if (self.settings.contentScroll) {
            self._contentScrollEvent();
        }


        // // 安卓风格的点击水波纹
        // if (self.dislogStyle === 'android') {
        //     JDZepto('.dialog-content-ft > .dialog-btn').ripple();
        // }

    },
    /**
     * 按钮是否可以执行 （防止tap重复触发）
     */
    _canEval:function(){ 
        var self = this;
        if(!self.taping){            
            // alert(self.taping)
            self.taping=true
            setTimeout(function(){self.taping=false},200)
            return true
        }
        return false
    },
    /**
     * 根据弹窗类型, 创建弹窗 DOM 结构
     * @param {string}  dialogType   弹窗类型
     */
    _createDialogDOM: function (dialogType) {
        var self = this;

        self.jdz_dialog = joyconn_zepto_zepto('<div class="JoyDialog dialog-open ' + self.settings.dialogClass + '" data-style="' + self.dislogStyle + '"></div>');
        self.jdz_dialogOverlay = joyconn_zepto_zepto('<div class="dialog-overlay"></div>');
        self.jdz_dialogContent = joyconn_zepto_zepto('<div class="dialog-content"></div>');
        self.jdz_dialogTitle = joyconn_zepto_zepto('<div class="dialog-content-hd"><h3 class="dialog-content-title">' + self.settings.titleText + '</h3></div>');
        self.jdz_dialogContentFt = joyconn_zepto_zepto('<div class="dialog-content-ft"></div>');
        self.jdz_dialogContentBd = joyconn_zepto_zepto('<div class="dialog-content-bd"></div>');
        self.jdz_closeBtn = joyconn_zepto_zepto('<div class="dialog-btn-close"><span>close</span></div>');
        self.jdz_confirmBtn = joyconn_zepto_zepto('<button class="dialog-btn dialog-btn-confirm ' + self.settings.buttonClassConfirm + '">' + self.settings.buttonTextConfirm + '</button>');
        self.jdz_cancelBtn = joyconn_zepto_zepto('<button class="dialog-btn dialog-btn-cancel ' + self.settings.buttonClassCancel + '">' + self.settings.buttonTextCancel + '</button>');
        if(self.settings.width&&self.settings.width!='auto'){
            self.jdz_dialogContent.width(self.settings.width);
        }
        if(self.settings.height&&self.settings.height!='auto'){
            self.jdz_dialogContent.height(self.settings.height);
        }
        switch (dialogType) {
            case 'alert':
                self._createDialogAlertTypeDOM(self, dialogType);
                break;
            case 'toast':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_error':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_warning':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_info':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_success':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_question':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_busy':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_wind':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'loading':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'notice':
                self._createDialogNoticeTypeDOM(self, dialogType);
                break;
            case 'notice_error':
                self._createDialogNoticeTypeDOM(self, dialogType);
                break;
            case 'notice_warning':
                self._createDialogNoticeTypeDOM(self, dialogType);
                break;
            case 'notice_info':
                self._createDialogNoticeTypeDOM(self, dialogType);
                break;
            case 'notice_success':
                self._createDialogNoticeTypeDOM(self, dialogType);
                break;
            default:
                // console.log('running default');
                break;
        }
    },
    //alert型显示
    _createDialogAlertTypeDOM:function(self, alertType){
        // 添加 alert 类型弹窗标识
        self.jdz_dialog.addClass('dialog-modal');
        switch (alertType) {
            case 'alert_error':                
                break;
        }
        // 显示遮罩层
        if (self.settings.overlayShow) {
            self.jdz_dialog.append(self.jdz_dialogOverlay);
        }
        // 显示标题
        if (self.settings.titleShow) {
            self.jdz_dialogContent.append(self.jdz_dialogTitle);
        }
        // 显示关闭按钮
        if (self.settings.closeBtnShow) {
            self.jdz_dialogTitle.append(self.jdz_closeBtn);
        }
        if (self.settings.buttons.length) {
            var buttonGroupHtml = '';
            joyconn_zepto_zepto.each(self.settings.buttons, function (index, item) {
                buttonGroupHtml += '<button class="dialog-btn ' + item.class + '">' + item.name + '</button>';

            });
            self.jdz_dialogContentFt.append(buttonGroupHtml).addClass(self.settings.buttonStyle);
        }
        if (self.settings.buttonTextCancel) {
            self.jdz_dialogContentFt.append(self.jdz_cancelBtn).addClass(self.settings.buttonStyle);
        }
        if (self.settings.buttonTextConfirm) {
            self.jdz_dialogContentFt.append(self.jdz_confirmBtn).addClass(self.settings.buttonStyle);
        }

        self.jdz_dialogContentBd.append(self.settings.content);
        self.jdz_dialogContent.append(self.jdz_dialogContentBd).append(self.jdz_dialogContentFt);
        self.jdz_dialog.append(self.jdz_dialogContent);
        joyconn_zepto_zepto('body').append(self.jdz_dialog);

        if (self.settings.bodyNoScroll) {
            joyconn_zepto_zepto('body').addClass('body-no-scroll');
        }

        // 设置弹窗提示内容最大高度
        if (self.settings.contentScroll) {
            self._setDialogContentHeight();
        }

    },
    //toast型显示
    _createDialogToastTypeDOM:function(self, toastType) {
        // 添加 toast 类型弹窗标识
        self.jdz_dialog.addClass('dialog-toast');

        //自动关闭
        if (self.userOptions.autoClose!=0 && !self.settings.autoClose) {
            self.settings.autoClose=2000;
        }
        // 显示遮罩层
        if (self.settings.overlayShow) {
            self.jdz_dialog.append(self.jdz_dialogOverlay);
        }

        // 弹窗内容 HTML, 默认为 content; 如果设置 icon 与 text, 则覆盖 content 的设置

        var toastContentHtmlStr = ''
        if (self.settings.content) {
            toastContentHtmlStr = self.settings.content
        } else {
            var iconfontValue = "";
            var color = "#fff", infoBgColor = "rgba(0, 0, 0, 0.8);", infoColor = "fff";
            switch (toastType) {
                case 'toast_error':
                    iconfontValue = "JDialog-icon-failure_toast";
                    color = "#d81e06";
                    break;
                case 'toast_warning':
                    iconfontValue = "JDialog-icon-alert_toast";
                    color = "#f4ea2a";
                    break;
                case 'toast_info':
                    iconfontValue = "JDialog-icon-info";
                    color = "#1296db";
                    break;
                case 'toast_success':
                    iconfontValue = "JDialog-icon-success_toast";
                    color = "#58b20f";
                    break;
                case 'toast_question':
                    iconfontValue = "JDialog-icon-question";
                    color = "#13227a";
                    break;
                case 'toast_busy':
                    iconfontValue = "JDialog-icon-busy_toast";
                    color = "#d81e06";
                    break;
                case 'toast_wind':
                    iconfontValue = "JDialog-icon-windcontrol";
                    color = "#d81e06";
                    console.info("wind")
                    break;
                case 'loading':
                    iconfontValue = "JDialog-icon-loading JoyDialog-loading-route-animation";
                    color = "#1296db";
                    console.info("loading")
                    break;
                default:
                    break;
            }
            if (self.settings.infoColor) {
                infoColor = self.settings.infoColor;
            }
            if (self.settings.infoBgColor) {
                infoBgColor = self.settings.infoBgColor;
            }
            if (self.settings.infoIconColor) {
                color = self.settings.infoIconColor;
            }
            if (iconfontValue !== "") {
                toastContentHtmlStr += '<div><i class="info-icon JDialog-icon ' + iconfontValue + '" style="color:' + color + ';display: inline-block;"  ></i></div>';
            } else if (self.settings.infoIcon !== '') {
                toastContentHtmlStr += '<img class="info-icon" src="' + self.settings.infoIcon + '" />';
            }
            if (self.settings.infoText !== '') {
                toastContentHtmlStr += '<span class="info-text"  style="color:' + infoColor + ';">' + self.settings.infoText + '</span>';
            }
        }
        var toastContentHtml = joyconn_zepto_zepto(toastContentHtmlStr);
        self.jdz_dialogContentBd.append(toastContentHtml);
        self.jdz_dialogContent.append(self.jdz_dialogContentBd);
        self.jdz_dialog.append(self.jdz_dialogContent);
        self.jdz_dialogContent.css("background-color", infoBgColor)
        joyconn_zepto_zepto('body').append(self.jdz_dialog);

        if (self.settings.bodyNoScroll) {
            joyconn_zepto_zepto('body').addClass('body-no-scroll');
        }
    },
    //notice型显示
    _createDialogNoticeTypeDOM:function(self, noticeType) {
        // 添加 toast 类型弹窗标识
        self.jdz_dialog.addClass('dialog-notice');
        // if(typeof self.userOptions.overlayShow == 'undefined'){
        //     self.settings.overlayShow=false;
        // }
        //自动关闭        
        if (self.userOptions.autoClose!=0 && !self.settings.autoClose) {
            self.settings.autoClose=2000;
        }
        // 底部显示的 toast
        if (self.settings.position === 'bottom') {
            self.jdz_dialog.addClass('dialog-notice-bottom');
        } else if (self.settings.position === 'center') {            
            self.jdz_dialog.addClass('dialog-notice-center');
        }else {
            self.jdz_dialog.addClass('dialog-notice-top');
        }

        // 显示遮罩层
        if (self.settings.overlayShow) {
            self.jdz_dialog.append(self.jdz_dialogOverlay);
        }


        var toastContentHtmlStr = ''
        if (self.settings.content) {
            toastContentHtmlStr = self.settings.content
        } else {
            var iconfontValue = "";
            var color = "#fff", infoBgColor = "rgba(0, 0, 0, 0.8);", infoColor = "fff";

            switch (noticeType) {
                case 'notice_error':
                    iconfontValue = "JDialog-icon-failure_toast";
                    color = "#d81e06";
                    infoColor = "#d81e06";
                    infoBgColor = "rgba(255, 130, 106, 0.6);";
                    break;
                case 'notice_warning':
                    iconfontValue = "JDialog-icon-alert_toast";
                    color = "#DAA520";
                    infoColor = "#DAA520";
                    infoBgColor = "rgba(238,232,170, 0.6);";
                    break;
                case 'notice_info':
                    iconfontValue = "JDialog-icon-info";
                    color = "#4682B4";
                    infoColor = "#4682B4";
                    infoBgColor = "rgba(175,238,238, 0.6);";
                    break;
                case 'notice_success':
                    iconfontValue = "JDialog-icon-success_toast";
                    color = "#58b20f";
                    infoColor = "#58b20f";
                    infoBgColor = "rgba(148, 248, 85, 0.6);";
                    break;
            }
            if (self.settings.infoColor) {
                infoColor = self.settings.infoColor;
            }
            if (self.settings.infoBgColor) {
                infoBgColor = self.settings.infoBgColor;
            }
            if (self.settings.infoIconColor) {
                color = self.settings.infoIconColor;
            }

            if (iconfontValue !== "") {
                toastContentHtmlStr += '<i class="info-icon JDialog-icon ' + iconfontValue + '" style="color:' + color + ';display: inline-block;"  ></i>';
            } else if (self.settings.infoIcon !== '') {
                toastContentHtmlStr += '<img class="info-icon" src="' + self.settings.infoIcon + '" />';
            }
            if (self.settings.infoText !== '') {
                toastContentHtmlStr += '<span class="info-text"  style="color:' + infoColor + ';">' + self.settings.infoText + '</span>';
            }
        }

        // 弹窗内容 HTML, 默认为 content; 如果设置 icon 与 text, 则覆盖 content 的设置
        var noticeContentHtml = joyconn_zepto_zepto(toastContentHtmlStr);

        self.jdz_dialogContentBd.append(noticeContentHtml);
        self.jdz_dialogContent.append(self.jdz_dialogContentBd);
        self.jdz_dialog.append(self.jdz_dialogContent);
        self.jdz_dialogContent.css("background-color", infoBgColor)
        joyconn_zepto_zepto('body').append(self.jdz_dialog);

        if (self.settings.bodyNoScroll) {
            joyconn_zepto_zepto('body').addClass('body-no-scroll');
        }
    },
    /**
     * 设置弹窗内容最大高度
     * 延迟执行, 避免获取相关尺寸不正确
     */
    _setDialogContentHeight: function () {
        var self = this;

        setTimeout(function () {
            var dialogDefaultContentHeight = self.jdz_dialogContentBd.height();
            var dialogContentMaxHeight = self._getDialogContentMaxHeight();

            self.jdz_dialogContentBd.css({
                'max-height': dialogContentMaxHeight,
            }).addClass('content-scroll');

            // 提示内容大于最大高度时, 添加底部按钮顶部边框线标识 class; 反之, 删除
            if (dialogDefaultContentHeight > dialogContentMaxHeight) {
                self.jdz_dialogContentFt.addClass('dialog-content-ft-border');
            } else {
                self.jdz_dialogContentFt.removeClass('dialog-content-ft-border');
            }

        }, 80);
    },
    /**
     * notice 弹出多个调整位置
     */
    _setNoticeContentMargin:function(){
        var positions=['top','center','bottom'];
        var height = 0;
        var win_height = joyconn_zepto_zepto(window).height();
        var total_height = 0;
        var max_width = 0;
        joyconn_zepto_zepto.each(positions,function(i,p){
            height=0;
            total_height = 0;
            max_width = 0;
            var notice_dialogs=joyconn_zepto_zepto('.dialog-notice-'+p);
            if(notice_dialogs.length>0){
                joyconn_zepto_zepto.each(notice_dialogs,function(j,d){
                    total_height += joyconn_zepto_zepto(d).find('.dialog-content').height() + (j==0?0:10);
                    max_width = joyconn_zepto_zepto(d).find('.dialog-content').width() > max_width? joyconn_zepto_zepto(d).find('.dialog-content').width() :max_width;
                })
                if(p=="center"){
                    console.info("total_height",total_height)
                }
                joyconn_zepto_zepto.each(notice_dialogs,function(j,d){
                    if(p=='top'){
                        joyconn_zepto_zepto(d).find('.dialog-content').css('top',height+'px;')
                    }else if(p=='bottom'){
                        joyconn_zepto_zepto(d).find('.dialog-content').css('bottom',height+'px;')
                    }else if(p=='center'){
                        joyconn_zepto_zepto(d).find('.dialog-content').css('top', ((win_height-total_height)/2 + height)+'px;')
                    }
                    // JDZepto(d).find('.dialog-content').width(max_width)//统一宽度，这个在IE下存在换行的bug。先搁置
                    height += joyconn_zepto_zepto(d).find('.dialog-content').height() + 10;
                })
               
            }
        })
    },
    /**
     * 获取弹窗内容最大高度
     * @return height
     */
    _getDialogContentMaxHeight: function () {
        var self = this;
        var winHeight = joyconn_zepto_zepto(window).height(),
            dialogContentHdHeight = self.jdz_dialogTitle.height(),
            dialogContentFtHeight = self.jdz_dialogContentFt.height(),
            dialogContentBdHeight = winHeight - dialogContentHdHeight - dialogContentFtHeight - 60;

        // 最大高度取偶数
        dialogContentBdHeight = dialogContentBdHeight % 2 === 0 ? dialogContentBdHeight : dialogContentBdHeight - 1;
        return dialogContentBdHeight;
    },

    /**
     * 重置弹窗, 在窗口大小发生变化时触发 
     */
    _resetDialog: function () {
        var self = this;
        self._setDialogContentHeight();
    },

    /**
     * 有最大高度弹窗的提示内容滑动
     */
    _contentScrollEvent: function () {

        var isTouchDown = false;
        var touchStartTime = 0;
        // 初始位置
        var position = {
            x: 0,
            y: 0,
            top: 0,
            left: 0
        };

        // 监听滑动相关事件
        joyconn_zepto_zepto(document)
            .on('touchstart mousedown', '.content-scroll', function (ev) {
                var touch = ev.changedTouches ? ev.changedTouches[0] : ev;
                touchStartTime=new Date().getTime()
                isTouchDown = true;
                position.x = touch.clientX;
                position.y = touch.clientY;
                position.top = joyconn_zepto_zepto(this).scrollTop();
                position.left = joyconn_zepto_zepto(this).scrollLeft();
                // return false;
            })
            .on('touchmove mousemove', '.content-scroll', function (ev) {
                var touch = ev.changedTouches ? ev.changedTouches[0] : ev;

                if (!isTouchDown) {
                    // 未按下
                    return false;
                } else {
                    // 要滑动的距离 = 已经滑动的距离 - (当前坐标 - 按下坐标)
                    var moveTop = position.top - (touch.clientY - position.y);
                    var moveLeft = position.left - (touch.clientX - position.x);

                    joyconn_zepto_zepto(this).scrollTop(moveTop).scrollLeft(moveLeft);
                }
            })
            .on('touchend mouseup', '.content-scroll', function (ev) {
                
                var touchEndTime=new Date().getTime()
                if(touchEndTime-touchStartTime<200){

                }else{
                    ev.preventDefault();
                }
                isTouchDown = false;
            });

    },

    /**
     * 自动关闭弹窗
     */
    _autoClose: function () {
        var self = this;

        self.autoCloseTimer = setTimeout(function () {
            self.closeDialog();
        }, self.settings.autoClose);
    },
  /**
     * 改变弹窗大小
     */
    resizeDialog: function (width,height) {
        var self = this;
        if(width&&width!='auto'){
            self.jdz_dialogContent.width(width);
        }else{
            self.jdz_dialogContent.style.removeProperty('width')

        }
        if(height&&height!='auto'){
            self.jdz_dialogContent.height(height);
        }else{
            self.jdz_dialogContent.style.removeProperty('height')
        }
       
    },
    /**
     * 关闭弹窗
     */
    closeDialog: function () {
        var self = this;

        self.isHided = true;
        self.settings.onBeforeClosed();
        self.jdz_dialog.addClass('dialog-close').removeClass('dialog-open');
        if(!clientObject.animation){
            //兼容IE9
            self.removeDialog();    
            console.info('ie9');
        }
        if (self.tapBug) {
            self._appendTapOverlayer();
        }
    },

    /**
     * 删除弹窗
     * @public method
     */
    removeDialog: function () {
        var self = this;
        if(joyconn_zepto_zepto(self.jdz_dialog).length==0){
                return;
        }
        self.jdz_dialogContent.html('');
        self.jdz_dialog.remove();
        self.isHided = false;
        self.settings.onClosed();
        // 重新初始化默认配置
        self.settings = dialog_defaults;

        if (self.settings.bodyNoScroll) {
            joyconn_zepto_zepto('body').removeClass('body-no-scroll');
        }
        
        self._setNoticeContentMargin();
    },

    /**
     * 更改 toast 和 notice 类型弹窗内容 
     * @public method
     * @param {string}  content          弹窗内容, 可以是HTML
     * @param {string}  infoIcon         弹窗提示图标
     * @param {string}  infoText         弹窗提示文字
     * @param {int}     autoClose        自动关闭的延迟时间
     * @param {fn}      onBeforeClosed   关闭前回调函数
     * @param {fn}      onClosed         关闭后回调函数
     */
    update: function (settings) {
        var self = this;

        clearTimeout(self.autoCloseTimer);

        // 设置默认值，并且指向给对象的默认值
        self.settings = ObjectAssign({},dialog_defaults, settings);
        console.info(self.settings)
        // 通过 content 更改弹窗内容
        if (self.settings.content !== '') {
            self.jdz_dialogContentBd.html('');
            self.jdz_dialogContentBd.append(self.settings.content);
        }

        // 通过设置 infoIcon 与 infoText 更改弹窗内容, 会覆盖 content 的设置
        var jdz_infoIcon = self.jdz_dialogContentBd.find('.info-icon');
        var jdz_infoText = self.jdz_dialogContentBd.find('.info-text');
        jdz_infoIcon.attr({ 'src': self.settings.infoIcon });
        jdz_infoText.html(self.settings.infoText);

        // 重新为更改后的 DOM 元素绑定事件
        self._bindEvents();        
        self._setNoticeContentMargin();
    },
    

    /**
     * 是否有点透 BUG 
     * 条件: 安卓手机并且版本号小于4.4
     * @return Boolean
     */
    _hasTapBug: function () {
        return false;// clientObject.isAndroid && (clientObject.version < 4.4);
    },

    /**
     * 添加点透遮罩层, 解决点透 BUG
     */
    _appendTapOverlayer: function () {
        var self = this;

        self.jdz_tapBugOverlayer = joyconn_zepto_zepto('.solve-tap-bug');

        if (!self.jdz_tapBugOverlayer.length) {
            self.jdz_tapBugOverlayer = joyconn_zepto_zepto('<div class="solve-tap-bug" style="margin:0;padding:0;border:0;background:rgba(0,0,0,0);-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;height:100%;position:fixed;top:0;left:0;"></div>');
            joyconn_zepto_zepto('body').append(self.jdz_tapBugOverlayer);
        }
    },

    /**
     * 删除点透遮罩层, 延迟执行的时间大于移动端的 click 触发时间
     */
    _removeTapOverlayer: function () {
        var self = this;

        setTimeout(function () {
            self.jdz_tapBugOverlayer.remove();
        }, 350);
    }
};
function dialogFunc(options) {

    var obj = new Dialog(options);
    obj._init();
    obj.close = function () {
        obj.closeDialog();
    }
    return obj;
}
;// CONCATENATED MODULE: ./src/js/dialog.js



var loading_dia={
    counter:0,
    dia:null
};
JoyDialog.showLoading=function(){
    if(loading_dia.counter<0){
        loading_dia.counter=0;
    }
    loading_dia.counter++;
    if(!loading_dia.dia){
        var jdia=JoyDialog({
            type : 'loading',
            infoText: '',
            autoClose:0
        });
        loading_dia.dia = jdia;
    }
}
JoyDialog.hideLoading=function(){
    loading_dia.counter--;
    if(loading_dia.dia&&loading_dia.counter<=0){
        loading_dia.dia.close();
        loading_dia.dia = null;        
    }
}
JoyDialog.clientObject=JSON.parse(JSON.stringify(clientUtil(window)));
function JoyDialog(options){
   return dialogFunc(options)
}
window.JoyDialog=JoyDialog
;// CONCATENATED MODULE: ./index.js

/******/ })()
;
//# sourceMappingURL=JoyDialog.js.map