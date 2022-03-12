var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a, prop, b2[prop]);
    }
  return a;
};
import * as React from "react";
import React__default, { useContext, createElement, Fragment, createContext, forwardRef, useRef, useLayoutEffect, Children, isValidElement, cloneElement, useImperativeHandle, useEffect, useReducer, useCallback, useMemo, useState } from "react";
function sheetForTag$1(tag) {
  if (tag.sheet) {
    return tag.sheet;
  }
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i];
    }
  }
}
function createStyleElement$1(options) {
  var tag = document.createElement("style");
  tag.setAttribute("data-emotion", options.key);
  if (options.nonce !== void 0) {
    tag.setAttribute("nonce", options.nonce);
  }
  tag.appendChild(document.createTextNode(""));
  tag.setAttribute("data-s", "");
  return tag;
}
var StyleSheet$1 = /* @__PURE__ */ function() {
  function StyleSheet2(options) {
    var _this = this;
    this._insertTag = function(tag) {
      var before;
      if (_this.tags.length === 0) {
        if (_this.insertionPoint) {
          before = _this.insertionPoint.nextSibling;
        } else if (_this.prepend) {
          before = _this.container.firstChild;
        } else {
          before = _this.before;
        }
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }
      _this.container.insertBefore(tag, before);
      _this.tags.push(tag);
    };
    this.isSpeedy = options.speedy === void 0 ? true : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce;
    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.insertionPoint = options.insertionPoint;
    this.before = null;
  }
  var _proto = StyleSheet2.prototype;
  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };
  _proto.insert = function insert(rule) {
    if (this.ctr % (this.isSpeedy ? 65e3 : 1) === 0) {
      this._insertTag(createStyleElement$1(this));
    }
    var tag = this.tags[this.tags.length - 1];
    if (this.isSpeedy) {
      var sheet = sheetForTag$1(tag);
      try {
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e2) {
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }
    this.ctr++;
  };
  _proto.flush = function flush() {
    this.tags.forEach(function(tag) {
      return tag.parentNode && tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;
  };
  return StyleSheet2;
}();
var MS = "-ms-";
var MOZ = "-moz-";
var WEBKIT = "-webkit-";
var COMMENT = "comm";
var RULESET = "rule";
var DECLARATION = "decl";
var IMPORT = "@import";
var KEYFRAMES = "@keyframes";
var abs = Math.abs;
var from = String.fromCharCode;
var assign = Object.assign;
function hash(value, length2) {
  return (((length2 << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3);
}
function trim(value) {
  return value.trim();
}
function match(value, pattern) {
  return (value = pattern.exec(value)) ? value[0] : value;
}
function replace(value, pattern, replacement) {
  return value.replace(pattern, replacement);
}
function indexof(value, search) {
  return value.indexOf(search);
}
function charat(value, index) {
  return value.charCodeAt(index) | 0;
}
function substr(value, begin, end) {
  return value.slice(begin, end);
}
function strlen(value) {
  return value.length;
}
function sizeof(value) {
  return value.length;
}
function append(value, array) {
  return array.push(value), value;
}
function combine(array, callback) {
  return array.map(callback).join("");
}
var line = 1;
var column = 1;
var length = 0;
var position$1 = 0;
var character = 0;
var characters = "";
function node(value, root2, parent, type, props, children, length2) {
  return { value, root: root2, parent, type, props, children, line, column, length: length2, return: "" };
}
function copy(root2, props) {
  return assign(node("", null, null, "", null, null, 0), root2, { length: -root2.length }, props);
}
function char() {
  return character;
}
function prev() {
  character = position$1 > 0 ? charat(characters, --position$1) : 0;
  if (column--, character === 10)
    column = 1, line--;
  return character;
}
function next() {
  character = position$1 < length ? charat(characters, position$1++) : 0;
  if (column++, character === 10)
    column = 1, line++;
  return character;
}
function peek() {
  return charat(characters, position$1);
}
function caret() {
  return position$1;
}
function slice(begin, end) {
  return substr(characters, begin, end);
}
function token(type) {
  switch (type) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function alloc(value) {
  return line = column = 1, length = strlen(characters = value), position$1 = 0, [];
}
function dealloc(value) {
  return characters = "", value;
}
function delimit(type) {
  return trim(slice(position$1 - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
function whitespace(type) {
  while (character = peek())
    if (character < 33)
      next();
    else
      break;
  return token(type) > 2 || token(character) > 3 ? "" : " ";
}
function escaping(index, count) {
  while (--count && next())
    if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
      break;
  return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
function delimiter(type) {
  while (next())
    switch (character) {
      case type:
        return position$1;
      case 34:
      case 39:
        if (type !== 34 && type !== 39)
          delimiter(character);
        break;
      case 40:
        if (type === 41)
          delimiter(type);
        break;
      case 92:
        next();
        break;
    }
  return position$1;
}
function commenter(type, index) {
  while (next())
    if (type + character === 47 + 10)
      break;
    else if (type + character === 42 + 42 && peek() === 47)
      break;
  return "/*" + slice(index, position$1 - 1) + "*" + from(type === 47 ? type : next());
}
function identifier(index) {
  while (!token(peek()))
    next();
  return slice(index, position$1);
}
function compile(value) {
  return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
function parse(value, root2, parent, rule, rules, rulesets, pseudo, points, declarations) {
  var index = 0;
  var offset = 0;
  var length2 = pseudo;
  var atrule = 0;
  var property = 0;
  var previous = 0;
  var variable = 1;
  var scanning = 1;
  var ampersand = 1;
  var character2 = 0;
  var type = "";
  var props = rules;
  var children = rulesets;
  var reference = rule;
  var characters2 = type;
  while (scanning)
    switch (previous = character2, character2 = next()) {
      case 40:
        if (previous != 108 && characters2.charCodeAt(length2 - 1) == 58) {
          if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f") != -1)
            ampersand = -1;
          break;
        }
      case 34:
      case 39:
      case 91:
        characters2 += delimit(character2);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        characters2 += whitespace(previous);
        break;
      case 92:
        characters2 += escaping(caret() - 1, 7);
        continue;
      case 47:
        switch (peek()) {
          case 42:
          case 47:
            append(comment(commenter(next(), caret()), root2, parent), declarations);
            break;
          default:
            characters2 += "/";
        }
        break;
      case 123 * variable:
        points[index++] = strlen(characters2) * ampersand;
      case 125 * variable:
      case 59:
      case 0:
        switch (character2) {
          case 0:
          case 125:
            scanning = 0;
          case 59 + offset:
            if (property > 0 && strlen(characters2) - length2)
              append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2), declarations);
            break;
          case 59:
            characters2 += ";";
          default:
            append(reference = ruleset(characters2, root2, parent, index, offset, rules, points, type, props = [], children = [], length2), rulesets);
            if (character2 === 123)
              if (offset === 0)
                parse(characters2, root2, reference, reference, props, rulesets, length2, points, children);
              else
                switch (atrule) {
                  case 100:
                  case 109:
                  case 115:
                    parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2), children), rules, children, length2, points, rule ? props : children);
                    break;
                  default:
                    parse(characters2, reference, reference, reference, [""], children, 0, points, children);
                }
        }
        index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
        break;
      case 58:
        length2 = 1 + strlen(characters2), property = previous;
      default:
        if (variable < 1) {
          if (character2 == 123)
            --variable;
          else if (character2 == 125 && variable++ == 0 && prev() == 125)
            continue;
        }
        switch (characters2 += from(character2), character2 * variable) {
          case 38:
            ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
            break;
          case 44:
            points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
            break;
          case 64:
            if (peek() === 45)
              characters2 += delimit(next());
            atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
            break;
          case 45:
            if (previous === 45 && strlen(characters2) == 2)
              variable = 0;
        }
    }
  return rulesets;
}
function ruleset(value, root2, parent, index, offset, rules, points, type, props, children, length2) {
  var post = offset - 1;
  var rule = offset === 0 ? rules : [""];
  var size = sizeof(rule);
  for (var i = 0, j = 0, k2 = 0; i < index; ++i)
    for (var x = 0, y2 = substr(value, post + 1, post = abs(j = points[i])), z2 = value; x < size; ++x)
      if (z2 = trim(j > 0 ? rule[x] + " " + y2 : replace(y2, /&\f/g, rule[x])))
        props[k2++] = z2;
  return node(value, root2, parent, offset === 0 ? RULESET : type, props, children, length2);
}
function comment(value, root2, parent) {
  return node(value, root2, parent, COMMENT, from(char()), substr(value, 2, -2), 0);
}
function declaration(value, root2, parent, length2) {
  return node(value, root2, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2);
}
function prefix(value, length2) {
  switch (hash(value, length2)) {
    case 5103:
      return WEBKIT + "print-" + value + value;
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return WEBKIT + value + value;
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return WEBKIT + value + MOZ + value + MS + value + value;
    case 6828:
    case 4268:
      return WEBKIT + value + MS + value + value;
    case 6165:
      return WEBKIT + value + MS + "flex-" + value + value;
    case 5187:
      return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
    case 5443:
      return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/, "") + value;
    case 4675:
      return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/, "") + value;
    case 5548:
      return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
    case 5292:
      return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
    case 6060:
      return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
    case 4554:
      return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
    case 6187:
      return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
    case 5495:
    case 3959:
      return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
    case 4968:
      return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (strlen(value) - 1 - length2 > 6)
        switch (charat(value, length2 + 1)) {
          case 109:
            if (charat(value, length2 + 4) !== 45)
              break;
          case 102:
            return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length2 + 3) == 108 ? "$3" : "$2-$3")) + value;
          case 115:
            return ~indexof(value, "stretch") ? prefix(replace(value, "stretch", "fill-available"), length2) + value : value;
        }
      break;
    case 4949:
      if (charat(value, length2 + 1) !== 115)
        break;
    case 6444:
      switch (charat(value, strlen(value) - 3 - (~indexof(value, "!important") && 10))) {
        case 107:
          return replace(value, ":", ":" + WEBKIT) + value;
        case 101:
          return replace(value, /(.+:)([^;!]+)(;|!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
      }
      break;
    case 5936:
      switch (charat(value, length2 + 11)) {
        case 114:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
        case 108:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
        case 45:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
      }
      return WEBKIT + value + MS + value + value;
  }
  return value;
}
function serialize(children, callback) {
  var output = "";
  var length2 = sizeof(children);
  for (var i = 0; i < length2; i++)
    output += callback(children[i], i, children, callback) || "";
  return output;
}
function stringify(element, index, children, callback) {
  switch (element.type) {
    case IMPORT:
    case DECLARATION:
      return element.return = element.return || element.value;
    case COMMENT:
      return "";
    case KEYFRAMES:
      return element.return = element.value + "{" + serialize(element.children, callback) + "}";
    case RULESET:
      element.value = element.props.join(",");
  }
  return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}
function middleware(collection) {
  var length2 = sizeof(collection);
  return function(element, index, children, callback) {
    var output = "";
    for (var i = 0; i < length2; i++)
      output += collection[i](element, index, children, callback) || "";
    return output;
  };
}
function rulesheet(callback) {
  return function(element) {
    if (!element.root) {
      if (element = element.return)
        callback(element);
    }
  };
}
function prefixer(element, index, children, callback) {
  if (element.length > -1) {
    if (!element.return)
      switch (element.type) {
        case DECLARATION:
          element.return = prefix(element.value, element.length);
          break;
        case KEYFRAMES:
          return serialize([copy(element, { value: replace(element.value, "@", "@" + WEBKIT) })], callback);
        case RULESET:
          if (element.length)
            return combine(element.props, function(value) {
              switch (match(value, /(::plac\w+|:read-\w+)/)) {
                case ":read-only":
                case ":read-write":
                  return serialize([copy(element, { props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")] })], callback);
                case "::placeholder":
                  return serialize([
                    copy(element, { props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")] }),
                    copy(element, { props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")] }),
                    copy(element, { props: [replace(value, /:(plac\w+)/, MS + "input-$1")] })
                  ], callback);
              }
              return "";
            });
      }
  }
}
function memoize$4(fn) {
  var cache = /* @__PURE__ */ Object.create(null);
  return function(arg) {
    if (cache[arg] === void 0)
      cache[arg] = fn(arg);
    return cache[arg];
  };
}
var identifierWithPointTracking = function identifierWithPointTracking2(begin, points, index) {
  var previous = 0;
  var character2 = 0;
  while (true) {
    previous = character2;
    character2 = peek();
    if (previous === 38 && character2 === 12) {
      points[index] = 1;
    }
    if (token(character2)) {
      break;
    }
    next();
  }
  return slice(begin, position$1);
};
var toRules = function toRules2(parsed, points) {
  var index = -1;
  var character2 = 44;
  do {
    switch (token(character2)) {
      case 0:
        if (character2 === 38 && peek() === 12) {
          points[index] = 1;
        }
        parsed[index] += identifierWithPointTracking(position$1 - 1, points, index);
        break;
      case 2:
        parsed[index] += delimit(character2);
        break;
      case 4:
        if (character2 === 44) {
          parsed[++index] = peek() === 58 ? "&\f" : "";
          points[index] = parsed[index].length;
          break;
        }
      default:
        parsed[index] += from(character2);
    }
  } while (character2 = next());
  return parsed;
};
var getRules = function getRules2(value, points) {
  return dealloc(toRules(alloc(value), points));
};
var fixedElements = /* @__PURE__ */ new WeakMap();
var compat = function compat2(element) {
  if (element.type !== "rule" || !element.parent || element.length < 1) {
    return;
  }
  var value = element.value, parent = element.parent;
  var isImplicitRule = element.column === parent.column && element.line === parent.line;
  while (parent.type !== "rule") {
    parent = parent.parent;
    if (!parent)
      return;
  }
  if (element.props.length === 1 && value.charCodeAt(0) !== 58 && !fixedElements.get(parent)) {
    return;
  }
  if (isImplicitRule) {
    return;
  }
  fixedElements.set(element, true);
  var points = [];
  var rules = getRules(value, points);
  var parentRules = parent.props;
  for (var i = 0, k2 = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k2++) {
      element.props[k2] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
    }
  }
};
var removeLabel = function removeLabel2(element) {
  if (element.type === "decl") {
    var value = element.value;
    if (value.charCodeAt(0) === 108 && value.charCodeAt(2) === 98) {
      element["return"] = "";
      element.value = "";
    }
  }
};
var defaultStylisPlugins = [prefixer];
var createCache = function createCache2(options) {
  var key = options.key;
  if (key === "css") {
    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])");
    Array.prototype.forEach.call(ssrStyles, function(node2) {
      var dataEmotionAttribute = node2.getAttribute("data-emotion");
      if (dataEmotionAttribute.indexOf(" ") === -1) {
        return;
      }
      document.head.appendChild(node2);
      node2.setAttribute("data-s", "");
    });
  }
  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;
  var inserted = {};
  var container;
  var nodesToHydrate = [];
  {
    container = options.container || document.head;
    Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="' + key + ' "]'), function(node2) {
      var attrib = node2.getAttribute("data-emotion").split(" ");
      for (var i = 1; i < attrib.length; i++) {
        inserted[attrib[i]] = true;
      }
      nodesToHydrate.push(node2);
    });
  }
  var _insert;
  var omnipresentPlugins = [compat, removeLabel];
  {
    var currentSheet;
    var finalizingPlugins = [stringify, rulesheet(function(rule) {
      currentSheet.insert(rule);
    })];
    var serializer = middleware(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));
    var stylis = function stylis2(styles2) {
      return serialize(compile(styles2), serializer);
    };
    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet;
      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);
      if (shouldCache) {
        cache.inserted[serialized.name] = true;
      }
    };
  }
  var cache = {
    key,
    sheet: new StyleSheet$1({
      key,
      container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend,
      insertionPoint: options.insertionPoint
    }),
    nonce: options.nonce,
    inserted,
    registered: {},
    insert: _insert
  };
  cache.sheet.hydrate(nodesToHydrate);
  return cache;
};
function _extends$1() {
  _extends$1 = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getAugmentedNamespace(n2) {
  if (n2.__esModule)
    return n2;
  var a = Object.defineProperty({}, "__esModule", { value: true });
  Object.keys(n2).forEach(function(k2) {
    var d2 = Object.getOwnPropertyDescriptor(n2, k2);
    Object.defineProperty(a, k2, d2.get ? d2 : {
      enumerable: true,
      get: function() {
        return n2[k2];
      }
    });
  });
  return a;
}
var reactIs$1 = { exports: {} };
var reactIs_production_min$1 = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b$1 = typeof Symbol === "function" && Symbol.for, c$1 = b$1 ? Symbol.for("react.element") : 60103, d$1 = b$1 ? Symbol.for("react.portal") : 60106, e$1 = b$1 ? Symbol.for("react.fragment") : 60107, f$2 = b$1 ? Symbol.for("react.strict_mode") : 60108, g$2 = b$1 ? Symbol.for("react.profiler") : 60114, h$2 = b$1 ? Symbol.for("react.provider") : 60109, k$1 = b$1 ? Symbol.for("react.context") : 60110, l$1 = b$1 ? Symbol.for("react.async_mode") : 60111, m$2 = b$1 ? Symbol.for("react.concurrent_mode") : 60111, n$2 = b$1 ? Symbol.for("react.forward_ref") : 60112, p$2 = b$1 ? Symbol.for("react.suspense") : 60113, q$2 = b$1 ? Symbol.for("react.suspense_list") : 60120, r$1 = b$1 ? Symbol.for("react.memo") : 60115, t = b$1 ? Symbol.for("react.lazy") : 60116, v$1 = b$1 ? Symbol.for("react.block") : 60121, w$1 = b$1 ? Symbol.for("react.fundamental") : 60117, x$1 = b$1 ? Symbol.for("react.responder") : 60118, y$1 = b$1 ? Symbol.for("react.scope") : 60119;
function z$1(a) {
  if (typeof a === "object" && a !== null) {
    var u2 = a.$$typeof;
    switch (u2) {
      case c$1:
        switch (a = a.type, a) {
          case l$1:
          case m$2:
          case e$1:
          case g$2:
          case f$2:
          case p$2:
            return a;
          default:
            switch (a = a && a.$$typeof, a) {
              case k$1:
              case n$2:
              case t:
              case r$1:
              case h$2:
                return a;
              default:
                return u2;
            }
        }
      case d$1:
        return u2;
    }
  }
}
function A$1(a) {
  return z$1(a) === m$2;
}
reactIs_production_min$1.AsyncMode = l$1;
reactIs_production_min$1.ConcurrentMode = m$2;
reactIs_production_min$1.ContextConsumer = k$1;
reactIs_production_min$1.ContextProvider = h$2;
reactIs_production_min$1.Element = c$1;
reactIs_production_min$1.ForwardRef = n$2;
reactIs_production_min$1.Fragment = e$1;
reactIs_production_min$1.Lazy = t;
reactIs_production_min$1.Memo = r$1;
reactIs_production_min$1.Portal = d$1;
reactIs_production_min$1.Profiler = g$2;
reactIs_production_min$1.StrictMode = f$2;
reactIs_production_min$1.Suspense = p$2;
reactIs_production_min$1.isAsyncMode = function(a) {
  return A$1(a) || z$1(a) === l$1;
};
reactIs_production_min$1.isConcurrentMode = A$1;
reactIs_production_min$1.isContextConsumer = function(a) {
  return z$1(a) === k$1;
};
reactIs_production_min$1.isContextProvider = function(a) {
  return z$1(a) === h$2;
};
reactIs_production_min$1.isElement = function(a) {
  return typeof a === "object" && a !== null && a.$$typeof === c$1;
};
reactIs_production_min$1.isForwardRef = function(a) {
  return z$1(a) === n$2;
};
reactIs_production_min$1.isFragment = function(a) {
  return z$1(a) === e$1;
};
reactIs_production_min$1.isLazy = function(a) {
  return z$1(a) === t;
};
reactIs_production_min$1.isMemo = function(a) {
  return z$1(a) === r$1;
};
reactIs_production_min$1.isPortal = function(a) {
  return z$1(a) === d$1;
};
reactIs_production_min$1.isProfiler = function(a) {
  return z$1(a) === g$2;
};
reactIs_production_min$1.isStrictMode = function(a) {
  return z$1(a) === f$2;
};
reactIs_production_min$1.isSuspense = function(a) {
  return z$1(a) === p$2;
};
reactIs_production_min$1.isValidElementType = function(a) {
  return typeof a === "string" || typeof a === "function" || a === e$1 || a === m$2 || a === g$2 || a === f$2 || a === p$2 || a === q$2 || typeof a === "object" && a !== null && (a.$$typeof === t || a.$$typeof === r$1 || a.$$typeof === h$2 || a.$$typeof === k$1 || a.$$typeof === n$2 || a.$$typeof === w$1 || a.$$typeof === x$1 || a.$$typeof === y$1 || a.$$typeof === v$1);
};
reactIs_production_min$1.typeOf = z$1;
{
  reactIs$1.exports = reactIs_production_min$1;
}
var reactIs = reactIs$1.exports;
var FORWARD_REF_STATICS = {
  "$$typeof": true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  "$$typeof": true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
var isBrowser$1 = true;
function getRegisteredStyles$1(registered, registeredStyles, classNames) {
  var rawClassName = "";
  classNames.split(" ").forEach(function(className) {
    if (registered[className] !== void 0) {
      registeredStyles.push(registered[className] + ";");
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var insertStyles$1 = function insertStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;
  if ((isStringTag === false || isBrowser$1 === false) && cache.registered[className] === void 0) {
    cache.registered[className] = serialized.styles;
  }
  if (cache.inserted[serialized.name] === void 0) {
    var current = serialized;
    do {
      cache.insert(serialized === current ? "." + className : "", current, cache.sheet, true);
      current = current.next;
    } while (current !== void 0);
  }
};
function murmur2(str) {
  var h2 = 0;
  var k2, i = 0, len = str.length;
  for (; len >= 4; ++i, len -= 4) {
    k2 = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
    k2 = (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16);
    k2 ^= k2 >>> 24;
    h2 = (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16) ^ (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
  }
  switch (len) {
    case 3:
      h2 ^= (str.charCodeAt(i + 2) & 255) << 16;
    case 2:
      h2 ^= (str.charCodeAt(i + 1) & 255) << 8;
    case 1:
      h2 ^= str.charCodeAt(i) & 255;
      h2 = (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
  }
  h2 ^= h2 >>> 13;
  h2 = (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
  return ((h2 ^ h2 >>> 15) >>> 0).toString(36);
}
var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};
var hyphenateRegex$1 = /[A-Z]|^ms/g;
var animationRegex$1 = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
var isCustomProperty$1 = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};
var isProcessableValue$1 = function isProcessableValue(value) {
  return value != null && typeof value !== "boolean";
};
var processStyleName$1 = /* @__PURE__ */ memoize$4(function(styleName) {
  return isCustomProperty$1(styleName) ? styleName : styleName.replace(hyphenateRegex$1, "-$&").toLowerCase();
});
var processStyleValue$1 = function processStyleValue(key, value) {
  switch (key) {
    case "animation":
    case "animationName": {
      if (typeof value === "string") {
        return value.replace(animationRegex$1, function(match2, p1, p2) {
          cursor$1 = {
            name: p1,
            styles: p2,
            next: cursor$1
          };
          return p1;
        });
      }
    }
  }
  if (unitlessKeys[key] !== 1 && !isCustomProperty$1(key) && typeof value === "number" && value !== 0) {
    return value + "px";
  }
  return value;
};
function handleInterpolation$1(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return "";
  }
  if (interpolation.__emotion_styles !== void 0) {
    return interpolation;
  }
  switch (typeof interpolation) {
    case "boolean": {
      return "";
    }
    case "object": {
      if (interpolation.anim === 1) {
        cursor$1 = {
          name: interpolation.name,
          styles: interpolation.styles,
          next: cursor$1
        };
        return interpolation.name;
      }
      if (interpolation.styles !== void 0) {
        var next2 = interpolation.next;
        if (next2 !== void 0) {
          while (next2 !== void 0) {
            cursor$1 = {
              name: next2.name,
              styles: next2.styles,
              next: cursor$1
            };
            next2 = next2.next;
          }
        }
        var styles2 = interpolation.styles + ";";
        return styles2;
      }
      return createStringFromObject$1(mergedProps, registered, interpolation);
    }
    case "function": {
      if (mergedProps !== void 0) {
        var previousCursor = cursor$1;
        var result = interpolation(mergedProps);
        cursor$1 = previousCursor;
        return handleInterpolation$1(mergedProps, registered, result);
      }
      break;
    }
  }
  if (registered == null) {
    return interpolation;
  }
  var cached = registered[interpolation];
  return cached !== void 0 ? cached : interpolation;
}
function createStringFromObject$1(mergedProps, registered, obj) {
  var string = "";
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation$1(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];
      if (typeof value !== "object") {
        if (registered != null && registered[value] !== void 0) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue$1(value)) {
          string += processStyleName$1(_key) + ":" + processStyleValue$1(_key, value) + ";";
        }
      } else {
        if (_key === "NO_COMPONENT_SELECTOR" && false) {
          throw new Error("Component selectors can only be used in conjunction with @emotion/babel-plugin.");
        }
        if (Array.isArray(value) && typeof value[0] === "string" && (registered == null || registered[value[0]] === void 0)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue$1(value[_i])) {
              string += processStyleName$1(_key) + ":" + processStyleValue$1(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation$1(mergedProps, registered, value);
          switch (_key) {
            case "animation":
            case "animationName": {
              string += processStyleName$1(_key) + ":" + interpolated + ";";
              break;
            }
            default: {
              string += _key + "{" + interpolated + "}";
            }
          }
        }
      }
    }
  }
  return string;
}
var labelPattern$1 = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var cursor$1;
var serializeStyles$1 = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && args[0].styles !== void 0) {
    return args[0];
  }
  var stringMode = true;
  var styles2 = "";
  cursor$1 = void 0;
  var strings = args[0];
  if (strings == null || strings.raw === void 0) {
    stringMode = false;
    styles2 += handleInterpolation$1(mergedProps, registered, strings);
  } else {
    styles2 += strings[0];
  }
  for (var i = 1; i < args.length; i++) {
    styles2 += handleInterpolation$1(mergedProps, registered, args[i]);
    if (stringMode) {
      styles2 += strings[i];
    }
  }
  labelPattern$1.lastIndex = 0;
  var identifierName = "";
  var match2;
  while ((match2 = labelPattern$1.exec(styles2)) !== null) {
    identifierName += "-" + match2[1];
  }
  var name = murmur2(styles2) + identifierName;
  return {
    name,
    styles: styles2,
    next: cursor$1
  };
};
var hasOwnProperty$g = {}.hasOwnProperty;
var EmotionCacheContext = /* @__PURE__ */ createContext(typeof HTMLElement !== "undefined" ? /* @__PURE__ */ createCache({
  key: "css"
}) : null);
EmotionCacheContext.Provider;
var withEmotionCache = function withEmotionCache2(func) {
  return /* @__PURE__ */ forwardRef(function(props, ref) {
    var cache = useContext(EmotionCacheContext);
    return func(props, cache, ref);
  });
};
var ThemeContext$2 = /* @__PURE__ */ createContext({});
var typePropName = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__";
var createEmotionProps = function createEmotionProps2(type, props) {
  var newProps = {};
  for (var key in props) {
    if (hasOwnProperty$g.call(props, key)) {
      newProps[key] = props[key];
    }
  }
  newProps[typePropName] = type;
  return newProps;
};
var Noop$1 = function Noop() {
  return null;
};
var Emotion = /* @__PURE__ */ withEmotionCache(function(props, cache, ref) {
  var cssProp = props.css;
  if (typeof cssProp === "string" && cache.registered[cssProp] !== void 0) {
    cssProp = cache.registered[cssProp];
  }
  var type = props[typePropName];
  var registeredStyles = [cssProp];
  var className = "";
  if (typeof props.className === "string") {
    className = getRegisteredStyles$1(cache.registered, registeredStyles, props.className);
  } else if (props.className != null) {
    className = props.className + " ";
  }
  var serialized = serializeStyles$1(registeredStyles, void 0, useContext(ThemeContext$2));
  insertStyles$1(cache, serialized, typeof type === "string");
  className += cache.key + "-" + serialized.name;
  var newProps = {};
  for (var key in props) {
    if (hasOwnProperty$g.call(props, key) && key !== "css" && key !== typePropName && true) {
      newProps[key] = props[key];
    }
  }
  newProps.ref = ref;
  newProps.className = className;
  var ele = /* @__PURE__ */ createElement(type, newProps);
  var possiblyStyleElement = /* @__PURE__ */ createElement(Noop$1, null);
  return /* @__PURE__ */ createElement(Fragment, null, possiblyStyleElement, ele);
});
function sheetForTag(tag) {
  if (tag.sheet) {
    return tag.sheet;
  }
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i];
    }
  }
}
function createStyleElement(options) {
  var tag = document.createElement("style");
  tag.setAttribute("data-emotion", options.key);
  if (options.nonce !== void 0) {
    tag.setAttribute("nonce", options.nonce);
  }
  tag.appendChild(document.createTextNode(""));
  tag.setAttribute("data-s", "");
  return tag;
}
var StyleSheet = /* @__PURE__ */ function() {
  function StyleSheet2(options) {
    var _this = this;
    this._insertTag = function(tag) {
      var before;
      if (_this.tags.length === 0) {
        if (_this.insertionPoint) {
          before = _this.insertionPoint.nextSibling;
        } else if (_this.prepend) {
          before = _this.container.firstChild;
        } else {
          before = _this.before;
        }
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }
      _this.container.insertBefore(tag, before);
      _this.tags.push(tag);
    };
    this.isSpeedy = options.speedy === void 0 ? true : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce;
    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.insertionPoint = options.insertionPoint;
    this.before = null;
  }
  var _proto = StyleSheet2.prototype;
  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };
  _proto.insert = function insert(rule) {
    if (this.ctr % (this.isSpeedy ? 65e3 : 1) === 0) {
      this._insertTag(createStyleElement(this));
    }
    var tag = this.tags[this.tags.length - 1];
    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);
      try {
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e2) {
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }
    this.ctr++;
  };
  _proto.flush = function flush() {
    this.tags.forEach(function(tag) {
      return tag.parentNode && tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;
  };
  return StyleSheet2;
}();
var jsx = function jsx2(type, props) {
  var args = arguments;
  if (props == null || !hasOwnProperty$g.call(props, "css")) {
    return createElement.apply(void 0, args);
  }
  var argsLength = args.length;
  var createElementArgArray = new Array(argsLength);
  createElementArgArray[0] = Emotion;
  createElementArgArray[1] = createEmotionProps(type, props);
  for (var i = 2; i < argsLength; i++) {
    createElementArgArray[i] = args[i];
  }
  return createElement.apply(null, createElementArgArray);
};
var Global = /* @__PURE__ */ withEmotionCache(function(props, cache) {
  var styles2 = props.styles;
  var serialized = serializeStyles$1([styles2], void 0, useContext(ThemeContext$2));
  var sheetRef = useRef();
  useLayoutEffect(function() {
    var key = cache.key + "-global";
    var sheet = new StyleSheet({
      key,
      nonce: cache.sheet.nonce,
      container: cache.sheet.container,
      speedy: cache.sheet.isSpeedy
    });
    var rehydrating = false;
    var node2 = document.querySelector('style[data-emotion="' + key + " " + serialized.name + '"]');
    if (cache.sheet.tags.length) {
      sheet.before = cache.sheet.tags[0];
    }
    if (node2 !== null) {
      rehydrating = true;
      node2.setAttribute("data-emotion", key);
      sheet.hydrate([node2]);
    }
    sheetRef.current = [sheet, rehydrating];
    return function() {
      sheet.flush();
    };
  }, [cache]);
  useLayoutEffect(function() {
    var sheetRefCurrent = sheetRef.current;
    var sheet = sheetRefCurrent[0], rehydrating = sheetRefCurrent[1];
    if (rehydrating) {
      sheetRefCurrent[1] = false;
      return;
    }
    if (serialized.next !== void 0) {
      insertStyles$1(cache, serialized.next, true);
    }
    if (sheet.tags.length) {
      var element = sheet.tags[sheet.tags.length - 1].nextElementSibling;
      sheet.before = element;
      sheet.flush();
    }
    cache.insert("", serialized, sheet, false);
  }, [cache, serialized.name]);
  return null;
});
function css() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return serializeStyles$1(args);
}
var keyframes = function keyframes2() {
  var insertable = css.apply(void 0, arguments);
  var name = "animation-" + insertable.name;
  return {
    name,
    styles: "@keyframes " + name + "{" + insertable.styles + "}",
    anim: 1,
    toString: function toString2() {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    }
  };
};
const common = {
  black: "#000",
  white: "#fff"
};
var common$1 = common;
const red = {
  50: "#ffebee",
  100: "#ffcdd2",
  200: "#ef9a9a",
  300: "#e57373",
  400: "#ef5350",
  500: "#f44336",
  600: "#e53935",
  700: "#d32f2f",
  800: "#c62828",
  900: "#b71c1c",
  A100: "#ff8a80",
  A200: "#ff5252",
  A400: "#ff1744",
  A700: "#d50000"
};
var red$1 = red;
const purple = {
  50: "#f3e5f5",
  100: "#e1bee7",
  200: "#ce93d8",
  300: "#ba68c8",
  400: "#ab47bc",
  500: "#9c27b0",
  600: "#8e24aa",
  700: "#7b1fa2",
  800: "#6a1b9a",
  900: "#4a148c",
  A100: "#ea80fc",
  A200: "#e040fb",
  A400: "#d500f9",
  A700: "#aa00ff"
};
var purple$1 = purple;
const blue = {
  50: "#e3f2fd",
  100: "#bbdefb",
  200: "#90caf9",
  300: "#64b5f6",
  400: "#42a5f5",
  500: "#2196f3",
  600: "#1e88e5",
  700: "#1976d2",
  800: "#1565c0",
  900: "#0d47a1",
  A100: "#82b1ff",
  A200: "#448aff",
  A400: "#2979ff",
  A700: "#2962ff"
};
var blue$1 = blue;
const lightBlue = {
  50: "#e1f5fe",
  100: "#b3e5fc",
  200: "#81d4fa",
  300: "#4fc3f7",
  400: "#29b6f6",
  500: "#03a9f4",
  600: "#039be5",
  700: "#0288d1",
  800: "#0277bd",
  900: "#01579b",
  A100: "#80d8ff",
  A200: "#40c4ff",
  A400: "#00b0ff",
  A700: "#0091ea"
};
var lightBlue$1 = lightBlue;
const green = {
  50: "#e8f5e9",
  100: "#c8e6c9",
  200: "#a5d6a7",
  300: "#81c784",
  400: "#66bb6a",
  500: "#4caf50",
  600: "#43a047",
  700: "#388e3c",
  800: "#2e7d32",
  900: "#1b5e20",
  A100: "#b9f6ca",
  A200: "#69f0ae",
  A400: "#00e676",
  A700: "#00c853"
};
var green$1 = green;
const orange = {
  50: "#fff3e0",
  100: "#ffe0b2",
  200: "#ffcc80",
  300: "#ffb74d",
  400: "#ffa726",
  500: "#ff9800",
  600: "#fb8c00",
  700: "#f57c00",
  800: "#ef6c00",
  900: "#e65100",
  A100: "#ffd180",
  A200: "#ffab40",
  A400: "#ff9100",
  A700: "#ff6d00"
};
var orange$1 = orange;
const grey = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#e0e0e0",
  400: "#bdbdbd",
  500: "#9e9e9e",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
  A100: "#f5f5f5",
  A200: "#eeeeee",
  A400: "#bdbdbd",
  A700: "#616161"
};
var grey$1 = grey;
function _objectWithoutPropertiesLoose$1(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
var isPropValid = /* @__PURE__ */ memoize$4(function(prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
});
var isBrowser = true;
function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = "";
  classNames.split(" ").forEach(function(className) {
    if (registered[className] !== void 0) {
      registeredStyles.push(registered[className] + ";");
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var insertStyles2 = function insertStyles3(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;
  if ((isStringTag === false || isBrowser === false) && cache.registered[className] === void 0) {
    cache.registered[className] = serialized.styles;
  }
  if (cache.inserted[serialized.name] === void 0) {
    var current = serialized;
    do {
      cache.insert(serialized === current ? "." + className : "", current, cache.sheet, true);
      current = current.next;
    } while (current !== void 0);
  }
};
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
var isCustomProperty2 = function isCustomProperty3(property) {
  return property.charCodeAt(1) === 45;
};
var isProcessableValue2 = function isProcessableValue3(value) {
  return value != null && typeof value !== "boolean";
};
var processStyleName = /* @__PURE__ */ memoize$4(function(styleName) {
  return isCustomProperty2(styleName) ? styleName : styleName.replace(hyphenateRegex, "-$&").toLowerCase();
});
var processStyleValue2 = function processStyleValue3(key, value) {
  switch (key) {
    case "animation":
    case "animationName": {
      if (typeof value === "string") {
        return value.replace(animationRegex, function(match2, p1, p2) {
          cursor = {
            name: p1,
            styles: p2,
            next: cursor
          };
          return p1;
        });
      }
    }
  }
  if (unitlessKeys[key] !== 1 && !isCustomProperty2(key) && typeof value === "number" && value !== 0) {
    return value + "px";
  }
  return value;
};
function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return "";
  }
  if (interpolation.__emotion_styles !== void 0) {
    return interpolation;
  }
  switch (typeof interpolation) {
    case "boolean": {
      return "";
    }
    case "object": {
      if (interpolation.anim === 1) {
        cursor = {
          name: interpolation.name,
          styles: interpolation.styles,
          next: cursor
        };
        return interpolation.name;
      }
      if (interpolation.styles !== void 0) {
        var next2 = interpolation.next;
        if (next2 !== void 0) {
          while (next2 !== void 0) {
            cursor = {
              name: next2.name,
              styles: next2.styles,
              next: cursor
            };
            next2 = next2.next;
          }
        }
        var styles2 = interpolation.styles + ";";
        return styles2;
      }
      return createStringFromObject(mergedProps, registered, interpolation);
    }
    case "function": {
      if (mergedProps !== void 0) {
        var previousCursor = cursor;
        var result = interpolation(mergedProps);
        cursor = previousCursor;
        return handleInterpolation(mergedProps, registered, result);
      }
      break;
    }
  }
  if (registered == null) {
    return interpolation;
  }
  var cached = registered[interpolation];
  return cached !== void 0 ? cached : interpolation;
}
function createStringFromObject(mergedProps, registered, obj) {
  var string = "";
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];
      if (typeof value !== "object") {
        if (registered != null && registered[value] !== void 0) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue2(value)) {
          string += processStyleName(_key) + ":" + processStyleValue2(_key, value) + ";";
        }
      } else {
        if (_key === "NO_COMPONENT_SELECTOR" && false) {
          throw new Error("Component selectors can only be used in conjunction with @emotion/babel-plugin.");
        }
        if (Array.isArray(value) && typeof value[0] === "string" && (registered == null || registered[value[0]] === void 0)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue2(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue2(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);
          switch (_key) {
            case "animation":
            case "animationName": {
              string += processStyleName(_key) + ":" + interpolated + ";";
              break;
            }
            default: {
              string += _key + "{" + interpolated + "}";
            }
          }
        }
      }
    }
  }
  return string;
}
var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var cursor;
var serializeStyles2 = function serializeStyles3(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && args[0].styles !== void 0) {
    return args[0];
  }
  var stringMode = true;
  var styles2 = "";
  cursor = void 0;
  var strings = args[0];
  if (strings == null || strings.raw === void 0) {
    stringMode = false;
    styles2 += handleInterpolation(mergedProps, registered, strings);
  } else {
    styles2 += strings[0];
  }
  for (var i = 1; i < args.length; i++) {
    styles2 += handleInterpolation(mergedProps, registered, args[i]);
    if (stringMode) {
      styles2 += strings[i];
    }
  }
  labelPattern.lastIndex = 0;
  var identifierName = "";
  var match2;
  while ((match2 = labelPattern.exec(styles2)) !== null) {
    identifierName += "-" + match2[1];
  }
  var name = murmur2(styles2) + identifierName;
  return {
    name,
    styles: styles2,
    next: cursor
  };
};
var testOmitPropsOnStringTag = isPropValid;
var testOmitPropsOnComponent = function testOmitPropsOnComponent2(key) {
  return key !== "theme";
};
var getDefaultShouldForwardProp = function getDefaultShouldForwardProp2(tag) {
  return typeof tag === "string" && tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
};
var composeShouldForwardProps = function composeShouldForwardProps2(tag, options, isReal) {
  var shouldForwardProp2;
  if (options) {
    var optionsShouldForwardProp = options.shouldForwardProp;
    shouldForwardProp2 = tag.__emotion_forwardProp && optionsShouldForwardProp ? function(propName) {
      return tag.__emotion_forwardProp(propName) && optionsShouldForwardProp(propName);
    } : optionsShouldForwardProp;
  }
  if (typeof shouldForwardProp2 !== "function" && isReal) {
    shouldForwardProp2 = tag.__emotion_forwardProp;
  }
  return shouldForwardProp2;
};
var Noop2 = function Noop3() {
  return null;
};
var createStyled$1 = function createStyled(tag, options) {
  var isReal = tag.__emotion_real === tag;
  var baseTag = isReal && tag.__emotion_base || tag;
  var identifierName;
  var targetClassName;
  if (options !== void 0) {
    identifierName = options.label;
    targetClassName = options.target;
  }
  var shouldForwardProp2 = composeShouldForwardProps(tag, options, isReal);
  var defaultShouldForwardProp = shouldForwardProp2 || getDefaultShouldForwardProp(baseTag);
  var shouldUseAs = !defaultShouldForwardProp("as");
  return function() {
    var args = arguments;
    var styles2 = isReal && tag.__emotion_styles !== void 0 ? tag.__emotion_styles.slice(0) : [];
    if (identifierName !== void 0) {
      styles2.push("label:" + identifierName + ";");
    }
    if (args[0] == null || args[0].raw === void 0) {
      styles2.push.apply(styles2, args);
    } else {
      styles2.push(args[0][0]);
      var len = args.length;
      var i = 1;
      for (; i < len; i++) {
        styles2.push(args[i], args[0][i]);
      }
    }
    var Styled = withEmotionCache(function(props, cache, ref) {
      var finalTag = shouldUseAs && props.as || baseTag;
      var className = "";
      var classInterpolations = [];
      var mergedProps = props;
      if (props.theme == null) {
        mergedProps = {};
        for (var key in props) {
          mergedProps[key] = props[key];
        }
        mergedProps.theme = useContext(ThemeContext$2);
      }
      if (typeof props.className === "string") {
        className = getRegisteredStyles(cache.registered, classInterpolations, props.className);
      } else if (props.className != null) {
        className = props.className + " ";
      }
      var serialized = serializeStyles2(styles2.concat(classInterpolations), cache.registered, mergedProps);
      insertStyles2(cache, serialized, typeof finalTag === "string");
      className += cache.key + "-" + serialized.name;
      if (targetClassName !== void 0) {
        className += " " + targetClassName;
      }
      var finalShouldForwardProp = shouldUseAs && shouldForwardProp2 === void 0 ? getDefaultShouldForwardProp(finalTag) : defaultShouldForwardProp;
      var newProps = {};
      for (var _key in props) {
        if (shouldUseAs && _key === "as")
          continue;
        if (finalShouldForwardProp(_key)) {
          newProps[_key] = props[_key];
        }
      }
      newProps.className = className;
      newProps.ref = ref;
      var ele = /* @__PURE__ */ createElement(finalTag, newProps);
      var possiblyStyleElement = /* @__PURE__ */ createElement(Noop2, null);
      return /* @__PURE__ */ createElement(Fragment, null, possiblyStyleElement, ele);
    });
    Styled.displayName = identifierName !== void 0 ? identifierName : "Styled(" + (typeof baseTag === "string" ? baseTag : baseTag.displayName || baseTag.name || "Component") + ")";
    Styled.defaultProps = tag.defaultProps;
    Styled.__emotion_real = Styled;
    Styled.__emotion_base = baseTag;
    Styled.__emotion_styles = styles2;
    Styled.__emotion_forwardProp = shouldForwardProp2;
    Object.defineProperty(Styled, "toString", {
      value: function value() {
        if (targetClassName === void 0 && false) {
          return "NO_COMPONENT_SELECTOR";
        }
        return "." + targetClassName;
      }
    });
    Styled.withComponent = function(nextTag, nextOptions) {
      return createStyled(nextTag, _extends$1({}, options, nextOptions, {
        shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
      })).apply(void 0, styles2);
    };
    return Styled;
  };
};
var tags = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "circle",
  "clipPath",
  "defs",
  "ellipse",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "mask",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "svg",
  "text",
  "tspan"
];
var newStyled = createStyled$1.bind();
tags.forEach(function(tagName) {
  newStyled[tagName] = newStyled(tagName);
});
var emStyled = newStyled;
var ReactPropTypesSecret$1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;
var ReactPropTypesSecret = ReactPropTypesSecret_1;
function emptyFunction() {
}
function emptyFunctionWithReset() {
}
emptyFunctionWithReset.resetWarningCache = emptyFunction;
var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      return;
    }
    var err = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
    err.name = "Invariant Violation";
    throw err;
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,
    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,
    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};
{
  factoryWithThrowingShims();
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty$f = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
  if (val === null || val === void 0) {
    throw new TypeError("Object.assign cannot be called with null or undefined");
  }
  return Object(val);
}
function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    }
    var test1 = new String("abc");
    test1[5] = "de";
    if (Object.getOwnPropertyNames(test1)[0] === "5") {
      return false;
    }
    var test2 = {};
    for (var i = 0; i < 10; i++) {
      test2["_" + String.fromCharCode(i)] = i;
    }
    var order2 = Object.getOwnPropertyNames(test2).map(function(n2) {
      return test2[n2];
    });
    if (order2.join("") !== "0123456789") {
      return false;
    }
    var test3 = {};
    "abcdefghijklmnopqrst".split("").forEach(function(letter) {
      test3[letter] = letter;
    });
    if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}
shouldUseNative() ? Object.assign : function(target, source) {
  var from2;
  var to = toObject(target);
  var symbols;
  for (var s = 1; s < arguments.length; s++) {
    from2 = Object(arguments[s]);
    for (var key in from2) {
      if (hasOwnProperty$f.call(from2, key)) {
        to[key] = from2[key];
      }
    }
    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from2);
      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from2, symbols[i])) {
          to[symbols[i]] = from2[symbols[i]];
        }
      }
    }
  }
  return to;
};
/** @license React v17.0.2
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f$1 = React__default, g$1 = 60103;
reactJsxRuntime_production_min.Fragment = 60107;
if (typeof Symbol === "function" && Symbol.for) {
  var h$1 = Symbol.for;
  g$1 = h$1("react.element");
  reactJsxRuntime_production_min.Fragment = h$1("react.fragment");
}
var m$1 = f$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n$1 = Object.prototype.hasOwnProperty, p$1 = { key: true, ref: true, __self: true, __source: true };
function q$1(c2, a, k2) {
  var b2, d2 = {}, e2 = null, l2 = null;
  k2 !== void 0 && (e2 = "" + k2);
  a.key !== void 0 && (e2 = "" + a.key);
  a.ref !== void 0 && (l2 = a.ref);
  for (b2 in a)
    n$1.call(a, b2) && !p$1.hasOwnProperty(b2) && (d2[b2] = a[b2]);
  if (c2 && c2.defaultProps)
    for (b2 in a = c2.defaultProps, a)
      d2[b2] === void 0 && (d2[b2] = a[b2]);
  return { $$typeof: g$1, type: c2, key: e2, ref: l2, props: d2, _owner: m$1.current };
}
reactJsxRuntime_production_min.jsx = q$1;
reactJsxRuntime_production_min.jsxs = q$1;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
function isEmpty$2(obj) {
  return obj === void 0 || obj === null || Object.keys(obj).length === 0;
}
function GlobalStyles$1(props) {
  const {
    styles: styles2,
    defaultTheme: defaultTheme2 = {}
  } = props;
  const globalStyles = typeof styles2 === "function" ? (themeInput) => styles2(isEmpty$2(themeInput) ? defaultTheme2 : themeInput) : styles2;
  return /* @__PURE__ */ jsxRuntime.exports.jsx(Global, {
    styles: globalStyles
  });
}
/** @license MUI v5.2.6
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function styled$2(tag, options) {
  const stylesFactory = emStyled(tag, options);
  return stylesFactory;
}
function isPlainObject$1(item) {
  return item !== null && typeof item === "object" && item.constructor === Object;
}
function deepmerge$1(target, source, options = {
  clone: true
}) {
  const output = options.clone ? _extends$1({}, target) : target;
  if (isPlainObject$1(target) && isPlainObject$1(source)) {
    Object.keys(source).forEach((key) => {
      if (key === "__proto__") {
        return;
      }
      if (isPlainObject$1(source[key]) && key in target && isPlainObject$1(target[key])) {
        output[key] = deepmerge$1(target[key], source[key], options);
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}
function formatMuiErrorMessage(code) {
  let url = "https://mui.com/production-error/?code=" + code;
  for (let i = 1; i < arguments.length; i += 1) {
    url += "&args[]=" + encodeURIComponent(arguments[i]);
  }
  return "Minified MUI error #" + code + "; visit " + url + " for the full message.";
}
var reactIs_production_min = {};
/** @license React v17.0.2
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b = 60103, c = 60106, d = 60107, e = 60108, f = 60114, g = 60109, h = 60110, k = 60112, l = 60113, m = 60120, n = 60115, p = 60116, q = 60121, r = 60122, u = 60117, v = 60129, w = 60131;
if (typeof Symbol === "function" && Symbol.for) {
  var x = Symbol.for;
  b = x("react.element");
  c = x("react.portal");
  d = x("react.fragment");
  e = x("react.strict_mode");
  f = x("react.profiler");
  g = x("react.provider");
  h = x("react.context");
  k = x("react.forward_ref");
  l = x("react.suspense");
  m = x("react.suspense_list");
  n = x("react.memo");
  p = x("react.lazy");
  q = x("react.block");
  r = x("react.server.block");
  u = x("react.fundamental");
  v = x("react.debug_trace_mode");
  w = x("react.legacy_hidden");
}
function y(a) {
  if (typeof a === "object" && a !== null) {
    var t2 = a.$$typeof;
    switch (t2) {
      case b:
        switch (a = a.type, a) {
          case d:
          case f:
          case e:
          case l:
          case m:
            return a;
          default:
            switch (a = a && a.$$typeof, a) {
              case h:
              case k:
              case p:
              case n:
              case g:
                return a;
              default:
                return t2;
            }
        }
      case c:
        return t2;
    }
  }
}
var z = g, A = b, B = k, C = d, D = p, E = n, F = c, G = f, H = e, I = l;
reactIs_production_min.ContextConsumer = h;
reactIs_production_min.ContextProvider = z;
reactIs_production_min.Element = A;
reactIs_production_min.ForwardRef = B;
reactIs_production_min.Fragment = C;
reactIs_production_min.Lazy = D;
reactIs_production_min.Memo = E;
reactIs_production_min.Portal = F;
reactIs_production_min.Profiler = G;
reactIs_production_min.StrictMode = H;
reactIs_production_min.Suspense = I;
reactIs_production_min.isAsyncMode = function() {
  return false;
};
reactIs_production_min.isConcurrentMode = function() {
  return false;
};
reactIs_production_min.isContextConsumer = function(a) {
  return y(a) === h;
};
reactIs_production_min.isContextProvider = function(a) {
  return y(a) === g;
};
reactIs_production_min.isElement = function(a) {
  return typeof a === "object" && a !== null && a.$$typeof === b;
};
reactIs_production_min.isForwardRef = function(a) {
  return y(a) === k;
};
reactIs_production_min.isFragment = function(a) {
  return y(a) === d;
};
reactIs_production_min.isLazy = function(a) {
  return y(a) === p;
};
reactIs_production_min.isMemo = function(a) {
  return y(a) === n;
};
reactIs_production_min.isPortal = function(a) {
  return y(a) === c;
};
reactIs_production_min.isProfiler = function(a) {
  return y(a) === f;
};
reactIs_production_min.isStrictMode = function(a) {
  return y(a) === e;
};
reactIs_production_min.isSuspense = function(a) {
  return y(a) === l;
};
reactIs_production_min.isValidElementType = function(a) {
  return typeof a === "string" || typeof a === "function" || a === d || a === f || a === v || a === e || a === l || a === m || a === w || typeof a === "object" && a !== null && (a.$$typeof === p || a.$$typeof === n || a.$$typeof === g || a.$$typeof === h || a.$$typeof === k || a.$$typeof === u || a.$$typeof === q || a[0] === r) ? true : false;
};
reactIs_production_min.typeOf = y;
function capitalize(string) {
  if (typeof string !== "string") {
    throw new Error(formatMuiErrorMessage(7));
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function createChainedFunction(...funcs) {
  return funcs.reduce((acc, func) => {
    if (func == null) {
      return acc;
    }
    return function chainedFunction(...args) {
      acc.apply(this, args);
      func.apply(this, args);
    };
  }, () => {
  });
}
function debounce(func, wait = 166) {
  let timeout;
  function debounced(...args) {
    const later = () => {
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }
  debounced.clear = () => {
    clearTimeout(timeout);
  };
  return debounced;
}
function deprecatedPropType(validator, reason) {
  {
    return () => null;
  }
}
function isMuiElement(element, muiNames) {
  return /* @__PURE__ */ React.isValidElement(element) && muiNames.indexOf(element.type.muiName) !== -1;
}
function ownerDocument(node2) {
  return node2 && node2.ownerDocument || document;
}
function ownerWindow(node2) {
  const doc = ownerDocument(node2);
  return doc.defaultView || window;
}
function requirePropFactory(componentNameInError, Component) {
  {
    return () => null;
  }
}
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
const useEnhancedEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
var useEnhancedEffect$1 = useEnhancedEffect;
let globalId = 0;
function useId(idOverride) {
  const [defaultId, setDefaultId] = React.useState(idOverride);
  const id = idOverride || defaultId;
  React.useEffect(() => {
    if (defaultId == null) {
      globalId += 1;
      setDefaultId(`mui-${globalId}`);
    }
  }, [defaultId]);
  return id;
}
function unsupportedProp(props, propName, componentName, location, propFullName) {
  {
    return null;
  }
}
function useControlled({
  controlled,
  default: defaultProp,
  name,
  state = "value"
}) {
  const {
    current: isControlled
  } = React.useRef(controlled !== void 0);
  const [valueState, setValue] = React.useState(defaultProp);
  const value = isControlled ? controlled : valueState;
  const setValueIfUncontrolled = React.useCallback((newValue) => {
    if (!isControlled) {
      setValue(newValue);
    }
  }, []);
  return [value, setValueIfUncontrolled];
}
function useEventCallback$1(fn) {
  const ref = React.useRef(fn);
  useEnhancedEffect$1(() => {
    ref.current = fn;
  });
  return React.useCallback((...args) => (0, ref.current)(...args), []);
}
function useForkRef(refA, refB) {
  return React.useMemo(() => {
    if (refA == null && refB == null) {
      return null;
    }
    return (refValue) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}
let hadKeyboardEvent = true;
let hadFocusVisibleRecently = false;
let hadFocusVisibleRecentlyTimeout;
const inputTypesWhitelist = {
  text: true,
  search: true,
  url: true,
  tel: true,
  email: true,
  password: true,
  number: true,
  date: true,
  month: true,
  week: true,
  time: true,
  datetime: true,
  "datetime-local": true
};
function focusTriggersKeyboardModality(node2) {
  const {
    type,
    tagName
  } = node2;
  if (tagName === "INPUT" && inputTypesWhitelist[type] && !node2.readOnly) {
    return true;
  }
  if (tagName === "TEXTAREA" && !node2.readOnly) {
    return true;
  }
  if (node2.isContentEditable) {
    return true;
  }
  return false;
}
function handleKeyDown(event) {
  if (event.metaKey || event.altKey || event.ctrlKey) {
    return;
  }
  hadKeyboardEvent = true;
}
function handlePointerDown() {
  hadKeyboardEvent = false;
}
function handleVisibilityChange() {
  if (this.visibilityState === "hidden") {
    if (hadFocusVisibleRecently) {
      hadKeyboardEvent = true;
    }
  }
}
function prepare(doc) {
  doc.addEventListener("keydown", handleKeyDown, true);
  doc.addEventListener("mousedown", handlePointerDown, true);
  doc.addEventListener("pointerdown", handlePointerDown, true);
  doc.addEventListener("touchstart", handlePointerDown, true);
  doc.addEventListener("visibilitychange", handleVisibilityChange, true);
}
function isFocusVisible(event) {
  const {
    target
  } = event;
  try {
    return target.matches(":focus-visible");
  } catch (error) {
  }
  return hadKeyboardEvent || focusTriggersKeyboardModality(target);
}
function useIsFocusVisible() {
  const ref = React.useCallback((node2) => {
    if (node2 != null) {
      prepare(node2.ownerDocument);
    }
  }, []);
  const isFocusVisibleRef = React.useRef(false);
  function handleBlurVisible() {
    if (isFocusVisibleRef.current) {
      hadFocusVisibleRecently = true;
      window.clearTimeout(hadFocusVisibleRecentlyTimeout);
      hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
        hadFocusVisibleRecently = false;
      }, 100);
      isFocusVisibleRef.current = false;
      return true;
    }
    return false;
  }
  function handleFocusVisible(event) {
    if (isFocusVisible(event)) {
      isFocusVisibleRef.current = true;
      return true;
    }
    return false;
  }
  return {
    isFocusVisibleRef,
    onFocus: handleFocusVisible,
    onBlur: handleBlurVisible,
    ref
  };
}
let cachedType;
function detectScrollType() {
  if (cachedType) {
    return cachedType;
  }
  const dummy = document.createElement("div");
  const container = document.createElement("div");
  container.style.width = "10px";
  container.style.height = "1px";
  dummy.appendChild(container);
  dummy.dir = "rtl";
  dummy.style.fontSize = "14px";
  dummy.style.width = "4px";
  dummy.style.height = "1px";
  dummy.style.position = "absolute";
  dummy.style.top = "-1000px";
  dummy.style.overflow = "scroll";
  document.body.appendChild(dummy);
  cachedType = "reverse";
  if (dummy.scrollLeft > 0) {
    cachedType = "default";
  } else {
    dummy.scrollLeft = 1;
    if (dummy.scrollLeft === 0) {
      cachedType = "negative";
    }
  }
  document.body.removeChild(dummy);
  return cachedType;
}
function getNormalizedScrollLeft(element, direction) {
  const scrollLeft = element.scrollLeft;
  if (direction !== "rtl") {
    return scrollLeft;
  }
  const type = detectScrollType();
  switch (type) {
    case "negative":
      return element.scrollWidth - element.clientWidth + scrollLeft;
    case "reverse":
      return element.scrollWidth - element.clientWidth - scrollLeft;
    default:
      return scrollLeft;
  }
}
function resolveProps(defaultProps2, props) {
  const output = _extends$1({}, props);
  Object.keys(defaultProps2).forEach((propName) => {
    if (output[propName] === void 0) {
      output[propName] = defaultProps2[propName];
    }
  });
  return output;
}
function merge(acc, item) {
  if (!item) {
    return acc;
  }
  return deepmerge$1(acc, item, {
    clone: false
  });
}
const values$1 = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536
};
const defaultBreakpoints = {
  keys: ["xs", "sm", "md", "lg", "xl"],
  up: (key) => `@media (min-width:${values$1[key]}px)`
};
function handleBreakpoints(props, propValue, styleFromPropValue) {
  const theme = props.theme || {};
  if (Array.isArray(propValue)) {
    const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
    return propValue.reduce((acc, item, index) => {
      acc[themeBreakpoints.up(themeBreakpoints.keys[index])] = styleFromPropValue(propValue[index]);
      return acc;
    }, {});
  }
  if (typeof propValue === "object") {
    const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
    return Object.keys(propValue).reduce((acc, breakpoint) => {
      if (Object.keys(themeBreakpoints.values || values$1).indexOf(breakpoint) !== -1) {
        const mediaKey = themeBreakpoints.up(breakpoint);
        acc[mediaKey] = styleFromPropValue(propValue[breakpoint], breakpoint);
      } else {
        const cssKey = breakpoint;
        acc[cssKey] = propValue[cssKey];
      }
      return acc;
    }, {});
  }
  const output = styleFromPropValue(propValue);
  return output;
}
function createEmptyBreakpointObject(breakpointsInput = {}) {
  var _breakpointsInput$key;
  const breakpointsInOrder = breakpointsInput == null ? void 0 : (_breakpointsInput$key = breakpointsInput.keys) == null ? void 0 : _breakpointsInput$key.reduce((acc, key) => {
    const breakpointStyleKey = breakpointsInput.up(key);
    acc[breakpointStyleKey] = {};
    return acc;
  }, {});
  return breakpointsInOrder || {};
}
function removeUnusedBreakpoints(breakpointKeys, style2) {
  return breakpointKeys.reduce((acc, key) => {
    const breakpointOutput = acc[key];
    const isBreakpointUnused = !breakpointOutput || Object.keys(breakpointOutput).length === 0;
    if (isBreakpointUnused) {
      delete acc[key];
    }
    return acc;
  }, style2);
}
function getPath(obj, path) {
  if (!path || typeof path !== "string") {
    return null;
  }
  return path.split(".").reduce((acc, item) => acc && acc[item] ? acc[item] : null, obj);
}
function getValue$4(themeMapping, transform2, propValueFinal, userValue = propValueFinal) {
  let value;
  if (typeof themeMapping === "function") {
    value = themeMapping(propValueFinal);
  } else if (Array.isArray(themeMapping)) {
    value = themeMapping[propValueFinal] || userValue;
  } else {
    value = getPath(themeMapping, propValueFinal) || userValue;
  }
  if (transform2) {
    value = transform2(value);
  }
  return value;
}
function style$1(options) {
  const {
    prop,
    cssProperty = options.prop,
    themeKey,
    transform: transform2
  } = options;
  const fn = (props) => {
    if (props[prop] == null) {
      return null;
    }
    const propValue = props[prop];
    const theme = props.theme;
    const themeMapping = getPath(theme, themeKey) || {};
    const styleFromPropValue = (propValueFinal) => {
      let value = getValue$4(themeMapping, transform2, propValueFinal);
      if (propValueFinal === value && typeof propValueFinal === "string") {
        value = getValue$4(themeMapping, transform2, `${prop}${propValueFinal === "default" ? "" : capitalize(propValueFinal)}`, propValueFinal);
      }
      if (cssProperty === false) {
        return value;
      }
      return {
        [cssProperty]: value
      };
    };
    return handleBreakpoints(props, propValue, styleFromPropValue);
  };
  fn.propTypes = {};
  fn.filterProps = [prop];
  return fn;
}
function compose(...styles2) {
  const handlers = styles2.reduce((acc, style2) => {
    style2.filterProps.forEach((prop) => {
      acc[prop] = style2;
    });
    return acc;
  }, {});
  const fn = (props) => {
    return Object.keys(props).reduce((acc, prop) => {
      if (handlers[prop]) {
        return merge(acc, handlers[prop](props));
      }
      return acc;
    }, {});
  };
  fn.propTypes = {};
  fn.filterProps = styles2.reduce((acc, style2) => acc.concat(style2.filterProps), []);
  return fn;
}
function memoize$3(fn) {
  const cache = {};
  return (arg) => {
    if (cache[arg] === void 0) {
      cache[arg] = fn(arg);
    }
    return cache[arg];
  };
}
const properties = {
  m: "margin",
  p: "padding"
};
const directions = {
  t: "Top",
  r: "Right",
  b: "Bottom",
  l: "Left",
  x: ["Left", "Right"],
  y: ["Top", "Bottom"]
};
const aliases = {
  marginX: "mx",
  marginY: "my",
  paddingX: "px",
  paddingY: "py"
};
const getCssProperties = memoize$3((prop) => {
  if (prop.length > 2) {
    if (aliases[prop]) {
      prop = aliases[prop];
    } else {
      return [prop];
    }
  }
  const [a, b2] = prop.split("");
  const property = properties[a];
  const direction = directions[b2] || "";
  return Array.isArray(direction) ? direction.map((dir) => property + dir) : [property + direction];
});
const marginKeys = ["m", "mt", "mr", "mb", "ml", "mx", "my", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "marginX", "marginY", "marginInline", "marginInlineStart", "marginInlineEnd", "marginBlock", "marginBlockStart", "marginBlockEnd"];
const paddingKeys = ["p", "pt", "pr", "pb", "pl", "px", "py", "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "paddingX", "paddingY", "paddingInline", "paddingInlineStart", "paddingInlineEnd", "paddingBlock", "paddingBlockStart", "paddingBlockEnd"];
const spacingKeys = [...marginKeys, ...paddingKeys];
function createUnaryUnit(theme, themeKey, defaultValue, propName) {
  const themeSpacing = getPath(theme, themeKey) || defaultValue;
  if (typeof themeSpacing === "number") {
    return (abs2) => {
      if (typeof abs2 === "string") {
        return abs2;
      }
      return themeSpacing * abs2;
    };
  }
  if (Array.isArray(themeSpacing)) {
    return (abs2) => {
      if (typeof abs2 === "string") {
        return abs2;
      }
      return themeSpacing[abs2];
    };
  }
  if (typeof themeSpacing === "function") {
    return themeSpacing;
  }
  return () => void 0;
}
function createUnarySpacing(theme) {
  return createUnaryUnit(theme, "spacing", 8);
}
function getValue$3(transformer, propValue) {
  if (typeof propValue === "string" || propValue == null) {
    return propValue;
  }
  const abs2 = Math.abs(propValue);
  const transformed = transformer(abs2);
  if (propValue >= 0) {
    return transformed;
  }
  if (typeof transformed === "number") {
    return -transformed;
  }
  return `-${transformed}`;
}
function getStyleFromPropValue(cssProperties, transformer) {
  return (propValue) => cssProperties.reduce((acc, cssProperty) => {
    acc[cssProperty] = getValue$3(transformer, propValue);
    return acc;
  }, {});
}
function resolveCssProperty(props, keys2, prop, transformer) {
  if (keys2.indexOf(prop) === -1) {
    return null;
  }
  const cssProperties = getCssProperties(prop);
  const styleFromPropValue = getStyleFromPropValue(cssProperties, transformer);
  const propValue = props[prop];
  return handleBreakpoints(props, propValue, styleFromPropValue);
}
function style(props, keys2) {
  const transformer = createUnarySpacing(props.theme);
  return Object.keys(props).map((prop) => resolveCssProperty(props, keys2, prop, transformer)).reduce(merge, {});
}
function spacing(props) {
  return style(props, spacingKeys);
}
spacing.propTypes = {};
spacing.filterProps = spacingKeys;
function getBorder(value) {
  if (typeof value !== "number") {
    return value;
  }
  return `${value}px solid`;
}
const border = style$1({
  prop: "border",
  themeKey: "borders",
  transform: getBorder
});
const borderTop = style$1({
  prop: "borderTop",
  themeKey: "borders",
  transform: getBorder
});
const borderRight = style$1({
  prop: "borderRight",
  themeKey: "borders",
  transform: getBorder
});
const borderBottom = style$1({
  prop: "borderBottom",
  themeKey: "borders",
  transform: getBorder
});
const borderLeft = style$1({
  prop: "borderLeft",
  themeKey: "borders",
  transform: getBorder
});
const borderColor = style$1({
  prop: "borderColor",
  themeKey: "palette"
});
const borderTopColor = style$1({
  prop: "borderTopColor",
  themeKey: "palette"
});
const borderRightColor = style$1({
  prop: "borderRightColor",
  themeKey: "palette"
});
const borderBottomColor = style$1({
  prop: "borderBottomColor",
  themeKey: "palette"
});
const borderLeftColor = style$1({
  prop: "borderLeftColor",
  themeKey: "palette"
});
const borderRadius = (props) => {
  if (props.borderRadius !== void 0 && props.borderRadius !== null) {
    const transformer = createUnaryUnit(props.theme, "shape.borderRadius", 4);
    const styleFromPropValue = (propValue) => ({
      borderRadius: getValue$3(transformer, propValue)
    });
    return handleBreakpoints(props, props.borderRadius, styleFromPropValue);
  }
  return null;
};
borderRadius.propTypes = {};
borderRadius.filterProps = ["borderRadius"];
const borders = compose(border, borderTop, borderRight, borderBottom, borderLeft, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderRadius);
var borders$1 = borders;
const displayPrint = style$1({
  prop: "displayPrint",
  cssProperty: false,
  transform: (value) => ({
    "@media print": {
      display: value
    }
  })
});
const displayRaw = style$1({
  prop: "display"
});
const overflow = style$1({
  prop: "overflow"
});
const textOverflow = style$1({
  prop: "textOverflow"
});
const visibility = style$1({
  prop: "visibility"
});
const whiteSpace = style$1({
  prop: "whiteSpace"
});
var display = compose(displayPrint, displayRaw, overflow, textOverflow, visibility, whiteSpace);
const flexBasis = style$1({
  prop: "flexBasis"
});
const flexDirection = style$1({
  prop: "flexDirection"
});
const flexWrap = style$1({
  prop: "flexWrap"
});
const justifyContent = style$1({
  prop: "justifyContent"
});
const alignItems = style$1({
  prop: "alignItems"
});
const alignContent = style$1({
  prop: "alignContent"
});
const order = style$1({
  prop: "order"
});
const flex = style$1({
  prop: "flex"
});
const flexGrow = style$1({
  prop: "flexGrow"
});
const flexShrink = style$1({
  prop: "flexShrink"
});
const alignSelf = style$1({
  prop: "alignSelf"
});
const justifyItems = style$1({
  prop: "justifyItems"
});
const justifySelf = style$1({
  prop: "justifySelf"
});
const flexbox = compose(flexBasis, flexDirection, flexWrap, justifyContent, alignItems, alignContent, order, flex, flexGrow, flexShrink, alignSelf, justifyItems, justifySelf);
var flexbox$1 = flexbox;
const gap = (props) => {
  if (props.gap !== void 0 && props.gap !== null) {
    const transformer = createUnaryUnit(props.theme, "spacing", 8);
    const styleFromPropValue = (propValue) => ({
      gap: getValue$3(transformer, propValue)
    });
    return handleBreakpoints(props, props.gap, styleFromPropValue);
  }
  return null;
};
gap.propTypes = {};
gap.filterProps = ["gap"];
const columnGap = (props) => {
  if (props.columnGap !== void 0 && props.columnGap !== null) {
    const transformer = createUnaryUnit(props.theme, "spacing", 8);
    const styleFromPropValue = (propValue) => ({
      columnGap: getValue$3(transformer, propValue)
    });
    return handleBreakpoints(props, props.columnGap, styleFromPropValue);
  }
  return null;
};
columnGap.propTypes = {};
columnGap.filterProps = ["columnGap"];
const rowGap = (props) => {
  if (props.rowGap !== void 0 && props.rowGap !== null) {
    const transformer = createUnaryUnit(props.theme, "spacing", 8);
    const styleFromPropValue = (propValue) => ({
      rowGap: getValue$3(transformer, propValue)
    });
    return handleBreakpoints(props, props.rowGap, styleFromPropValue);
  }
  return null;
};
rowGap.propTypes = {};
rowGap.filterProps = ["rowGap"];
const gridColumn = style$1({
  prop: "gridColumn"
});
const gridRow = style$1({
  prop: "gridRow"
});
const gridAutoFlow = style$1({
  prop: "gridAutoFlow"
});
const gridAutoColumns = style$1({
  prop: "gridAutoColumns"
});
const gridAutoRows = style$1({
  prop: "gridAutoRows"
});
const gridTemplateColumns = style$1({
  prop: "gridTemplateColumns"
});
const gridTemplateRows = style$1({
  prop: "gridTemplateRows"
});
const gridTemplateAreas = style$1({
  prop: "gridTemplateAreas"
});
const gridArea = style$1({
  prop: "gridArea"
});
const grid = compose(gap, columnGap, rowGap, gridColumn, gridRow, gridAutoFlow, gridAutoColumns, gridAutoRows, gridTemplateColumns, gridTemplateRows, gridTemplateAreas, gridArea);
var grid$1 = grid;
const color = style$1({
  prop: "color",
  themeKey: "palette"
});
const bgcolor = style$1({
  prop: "bgcolor",
  cssProperty: "backgroundColor",
  themeKey: "palette"
});
const backgroundColor = style$1({
  prop: "backgroundColor",
  themeKey: "palette"
});
const palette = compose(color, bgcolor, backgroundColor);
var palette$1 = palette;
const position = style$1({
  prop: "position"
});
const zIndex$2 = style$1({
  prop: "zIndex",
  themeKey: "zIndex"
});
const top = style$1({
  prop: "top"
});
const right = style$1({
  prop: "right"
});
const bottom = style$1({
  prop: "bottom"
});
const left = style$1({
  prop: "left"
});
var positions = compose(position, zIndex$2, top, right, bottom, left);
const boxShadow = style$1({
  prop: "boxShadow",
  themeKey: "shadows"
});
var shadows$2 = boxShadow;
function transform(value) {
  return value <= 1 && value !== 0 ? `${value * 100}%` : value;
}
const width = style$1({
  prop: "width",
  transform
});
const maxWidth = (props) => {
  if (props.maxWidth !== void 0 && props.maxWidth !== null) {
    const styleFromPropValue = (propValue) => {
      var _props$theme, _props$theme$breakpoi, _props$theme$breakpoi2;
      const breakpoint = ((_props$theme = props.theme) == null ? void 0 : (_props$theme$breakpoi = _props$theme.breakpoints) == null ? void 0 : (_props$theme$breakpoi2 = _props$theme$breakpoi.values) == null ? void 0 : _props$theme$breakpoi2[propValue]) || values$1[propValue];
      return {
        maxWidth: breakpoint || transform(propValue)
      };
    };
    return handleBreakpoints(props, props.maxWidth, styleFromPropValue);
  }
  return null;
};
maxWidth.filterProps = ["maxWidth"];
const minWidth = style$1({
  prop: "minWidth",
  transform
});
const height = style$1({
  prop: "height",
  transform
});
const maxHeight = style$1({
  prop: "maxHeight",
  transform
});
const minHeight = style$1({
  prop: "minHeight",
  transform
});
style$1({
  prop: "size",
  cssProperty: "width",
  transform
});
style$1({
  prop: "size",
  cssProperty: "height",
  transform
});
const boxSizing = style$1({
  prop: "boxSizing"
});
const sizing = compose(width, maxWidth, minWidth, height, maxHeight, minHeight, boxSizing);
var sizing$1 = sizing;
const fontFamily = style$1({
  prop: "fontFamily",
  themeKey: "typography"
});
const fontSize = style$1({
  prop: "fontSize",
  themeKey: "typography"
});
const fontStyle = style$1({
  prop: "fontStyle",
  themeKey: "typography"
});
const fontWeight = style$1({
  prop: "fontWeight",
  themeKey: "typography"
});
const letterSpacing = style$1({
  prop: "letterSpacing"
});
const lineHeight = style$1({
  prop: "lineHeight"
});
const textAlign = style$1({
  prop: "textAlign"
});
const typographyVariant = style$1({
  prop: "typography",
  cssProperty: false,
  themeKey: "typography"
});
const typography = compose(typographyVariant, fontFamily, fontSize, fontStyle, fontWeight, letterSpacing, lineHeight, textAlign);
var typography$1 = typography;
const filterPropsMapping = {
  borders: borders$1.filterProps,
  display: display.filterProps,
  flexbox: flexbox$1.filterProps,
  grid: grid$1.filterProps,
  positions: positions.filterProps,
  palette: palette$1.filterProps,
  shadows: shadows$2.filterProps,
  sizing: sizing$1.filterProps,
  spacing: spacing.filterProps,
  typography: typography$1.filterProps
};
const styleFunctionMapping = {
  borders: borders$1,
  display,
  flexbox: flexbox$1,
  grid: grid$1,
  positions,
  palette: palette$1,
  shadows: shadows$2,
  sizing: sizing$1,
  spacing,
  typography: typography$1
};
const propToStyleFunction = Object.keys(filterPropsMapping).reduce((acc, styleFnName) => {
  filterPropsMapping[styleFnName].forEach((propName) => {
    acc[propName] = styleFunctionMapping[styleFnName];
  });
  return acc;
}, {});
function getThemeValue(prop, value, theme) {
  const inputProps = {
    [prop]: value,
    theme
  };
  const styleFunction = propToStyleFunction[prop];
  return styleFunction ? styleFunction(inputProps) : {
    [prop]: value
  };
}
function objectsHaveSameKeys(...objects) {
  const allKeys = objects.reduce((keys2, object) => keys2.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every((object) => union.size === Object.keys(object).length);
}
function callIfFn(maybeFn, arg) {
  return typeof maybeFn === "function" ? maybeFn(arg) : maybeFn;
}
function styleFunctionSx(props) {
  const {
    sx,
    theme = {}
  } = props || {};
  if (!sx) {
    return null;
  }
  function traverse(sxInput) {
    let sxObject = sxInput;
    if (typeof sxInput === "function") {
      sxObject = sxInput(theme);
    } else if (typeof sxInput !== "object") {
      return sxInput;
    }
    const emptyBreakpoints = createEmptyBreakpointObject(theme.breakpoints);
    const breakpointsKeys = Object.keys(emptyBreakpoints);
    let css2 = emptyBreakpoints;
    Object.keys(sxObject).forEach((styleKey) => {
      const value = callIfFn(sxObject[styleKey], theme);
      if (value !== null && value !== void 0) {
        if (typeof value === "object") {
          if (propToStyleFunction[styleKey]) {
            css2 = merge(css2, getThemeValue(styleKey, value, theme));
          } else {
            const breakpointsValues = handleBreakpoints({
              theme
            }, value, (x) => ({
              [styleKey]: x
            }));
            if (objectsHaveSameKeys(breakpointsValues, value)) {
              css2[styleKey] = styleFunctionSx({
                sx: value,
                theme
              });
            } else {
              css2 = merge(css2, breakpointsValues);
            }
          }
        } else {
          css2 = merge(css2, getThemeValue(styleKey, value, theme));
        }
      }
    });
    return removeUnusedBreakpoints(breakpointsKeys, css2);
  }
  return Array.isArray(sx) ? sx.map(traverse) : traverse(sx);
}
styleFunctionSx.filterProps = ["sx"];
const _excluded$m = ["sx"];
const splitProps = (props) => {
  const result = {
    systemProps: {},
    otherProps: {}
  };
  Object.keys(props).forEach((prop) => {
    if (propToStyleFunction[prop]) {
      result.systemProps[prop] = props[prop];
    } else {
      result.otherProps[prop] = props[prop];
    }
  });
  return result;
};
function extendSxProp(props) {
  const {
    sx: inSx
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$m);
  const {
    systemProps,
    otherProps
  } = splitProps(other);
  let finalSx;
  if (Array.isArray(inSx)) {
    finalSx = [systemProps, ...inSx];
  } else if (typeof inSx === "function") {
    finalSx = (...args) => {
      const result = inSx(...args);
      if (!isPlainObject$1(result)) {
        return systemProps;
      }
      return _extends$1({}, systemProps, result);
    };
  } else {
    finalSx = _extends$1({}, systemProps, inSx);
  }
  return _extends$1({}, otherProps, {
    sx: finalSx
  });
}
function toVal(mix) {
  var k2, y2, str = "";
  if (typeof mix === "string" || typeof mix === "number") {
    str += mix;
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      for (k2 = 0; k2 < mix.length; k2++) {
        if (mix[k2]) {
          if (y2 = toVal(mix[k2])) {
            str && (str += " ");
            str += y2;
          }
        }
      }
    } else {
      for (k2 in mix) {
        if (mix[k2]) {
          str && (str += " ");
          str += k2;
        }
      }
    }
  }
  return str;
}
function clsx() {
  var i = 0, tmp, x, str = "";
  while (i < arguments.length) {
    if (tmp = arguments[i++]) {
      if (x = toVal(tmp)) {
        str && (str += " ");
        str += x;
      }
    }
  }
  return str;
}
const _excluded$l = ["values", "unit", "step"];
function createBreakpoints(breakpoints) {
  const {
    values: values2 = {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    },
    unit = "px",
    step = 5
  } = breakpoints, other = _objectWithoutPropertiesLoose$1(breakpoints, _excluded$l);
  const keys2 = Object.keys(values2);
  function up(key) {
    const value = typeof values2[key] === "number" ? values2[key] : key;
    return `@media (min-width:${value}${unit})`;
  }
  function down(key) {
    const value = typeof values2[key] === "number" ? values2[key] : key;
    return `@media (max-width:${value - step / 100}${unit})`;
  }
  function between(start, end) {
    const endIndex = keys2.indexOf(end);
    return `@media (min-width:${typeof values2[start] === "number" ? values2[start] : start}${unit}) and (max-width:${(endIndex !== -1 && typeof values2[keys2[endIndex]] === "number" ? values2[keys2[endIndex]] : end) - step / 100}${unit})`;
  }
  function only(key) {
    if (keys2.indexOf(key) + 1 < keys2.length) {
      return between(key, keys2[keys2.indexOf(key) + 1]);
    }
    return up(key);
  }
  function not(key) {
    const keyIndex = keys2.indexOf(key);
    if (keyIndex === 0) {
      return up(keys2[1]);
    }
    if (keyIndex === keys2.length - 1) {
      return down(keys2[keyIndex]);
    }
    return between(key, keys2[keys2.indexOf(key) + 1]).replace("@media", "@media not all and");
  }
  return _extends$1({
    keys: keys2,
    values: values2,
    up,
    down,
    between,
    only,
    not,
    unit
  }, other);
}
const shape = {
  borderRadius: 4
};
var shape$1 = shape;
function createSpacing(spacingInput = 8) {
  if (spacingInput.mui) {
    return spacingInput;
  }
  const transform2 = createUnarySpacing({
    spacing: spacingInput
  });
  const spacing2 = (...argsInput) => {
    const args = argsInput.length === 0 ? [1] : argsInput;
    return args.map((argument) => {
      const output = transform2(argument);
      return typeof output === "number" ? `${output}px` : output;
    }).join(" ");
  };
  spacing2.mui = true;
  return spacing2;
}
const _excluded$k = ["breakpoints", "palette", "spacing", "shape"];
function createTheme$1(options = {}, ...args) {
  const {
    breakpoints: breakpointsInput = {},
    palette: paletteInput = {},
    spacing: spacingInput,
    shape: shapeInput = {}
  } = options, other = _objectWithoutPropertiesLoose$1(options, _excluded$k);
  const breakpoints = createBreakpoints(breakpointsInput);
  const spacing2 = createSpacing(spacingInput);
  let muiTheme = deepmerge$1({
    breakpoints,
    direction: "ltr",
    components: {},
    palette: _extends$1({
      mode: "light"
    }, paletteInput),
    spacing: spacing2,
    shape: _extends$1({}, shape$1, shapeInput)
  }, other);
  muiTheme = args.reduce((acc, argument) => deepmerge$1(acc, argument), muiTheme);
  return muiTheme;
}
const ThemeContext = /* @__PURE__ */ React.createContext(null);
var ThemeContext$1 = ThemeContext;
function useTheme$3() {
  const theme = React.useContext(ThemeContext$1);
  return theme;
}
const hasSymbol = typeof Symbol === "function" && Symbol.for;
var nested = hasSymbol ? Symbol.for("mui.nested") : "__THEME_NESTED__";
function mergeOuterLocalTheme(outerTheme, localTheme) {
  if (typeof localTheme === "function") {
    const mergedTheme = localTheme(outerTheme);
    return mergedTheme;
  }
  return _extends$1({}, outerTheme, localTheme);
}
function ThemeProvider$1(props) {
  const {
    children,
    theme: localTheme
  } = props;
  const outerTheme = useTheme$3();
  const theme = React.useMemo(() => {
    const output = outerTheme === null ? localTheme : mergeOuterLocalTheme(outerTheme, localTheme);
    if (output != null) {
      output[nested] = outerTheme !== null;
    }
    return output;
  }, [localTheme, outerTheme]);
  return /* @__PURE__ */ jsxRuntime.exports.jsx(ThemeContext$1.Provider, {
    value: theme,
    children
  });
}
function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function useTheme$2(defaultTheme2 = null) {
  const contextTheme = useTheme$3();
  return !contextTheme || isObjectEmpty(contextTheme) ? defaultTheme2 : contextTheme;
}
const systemDefaultTheme$1 = createTheme$1();
function useTheme$1(defaultTheme2 = systemDefaultTheme$1) {
  return useTheme$2(defaultTheme2);
}
const _excluded$j = ["className", "component"];
function createBox(options = {}) {
  const {
    defaultTheme: defaultTheme2,
    defaultClassName = "MuiBox-root",
    generateClassName
  } = options;
  const BoxRoot = styled$2("div")(styleFunctionSx);
  const Box2 = /* @__PURE__ */ React.forwardRef(function Box3(inProps, ref) {
    const theme = useTheme$1(defaultTheme2);
    const _extendSxProp = extendSxProp(inProps), {
      className,
      component = "div"
    } = _extendSxProp, other = _objectWithoutPropertiesLoose$1(_extendSxProp, _excluded$j);
    return /* @__PURE__ */ jsxRuntime.exports.jsx(BoxRoot, _extends$1({
      as: component,
      ref,
      className: clsx(className, generateClassName ? generateClassName(defaultClassName) : defaultClassName),
      theme
    }, other));
  });
  return Box2;
}
const _excluded$i = ["variant"];
function isEmpty$1(string) {
  return string.length === 0;
}
function propsToClassKey(props) {
  const {
    variant
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$i);
  let classKey = variant || "";
  Object.keys(other).sort().forEach((key) => {
    if (key === "color") {
      classKey += isEmpty$1(classKey) ? props[key] : capitalize(props[key]);
    } else {
      classKey += `${isEmpty$1(classKey) ? key : capitalize(key)}${capitalize(props[key].toString())}`;
    }
  });
  return classKey;
}
const _excluded$h = ["name", "slot", "skipVariantsResolver", "skipSx", "overridesResolver"], _excluded2 = ["theme"], _excluded3 = ["theme"];
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
const getStyleOverrides = (name, theme) => {
  if (theme.components && theme.components[name] && theme.components[name].styleOverrides) {
    return theme.components[name].styleOverrides;
  }
  return null;
};
const getVariantStyles = (name, theme) => {
  let variants = [];
  if (theme && theme.components && theme.components[name] && theme.components[name].variants) {
    variants = theme.components[name].variants;
  }
  const variantsStyles = {};
  variants.forEach((definition) => {
    const key = propsToClassKey(definition.props);
    variantsStyles[key] = definition.style;
  });
  return variantsStyles;
};
const variantsResolver = (props, styles2, theme, name) => {
  var _theme$components, _theme$components$nam;
  const {
    ownerState = {}
  } = props;
  const variantsStyles = [];
  const themeVariants = theme == null ? void 0 : (_theme$components = theme.components) == null ? void 0 : (_theme$components$nam = _theme$components[name]) == null ? void 0 : _theme$components$nam.variants;
  if (themeVariants) {
    themeVariants.forEach((themeVariant) => {
      let isMatch = true;
      Object.keys(themeVariant.props).forEach((key) => {
        if (ownerState[key] !== themeVariant.props[key] && props[key] !== themeVariant.props[key]) {
          isMatch = false;
        }
      });
      if (isMatch) {
        variantsStyles.push(styles2[propsToClassKey(themeVariant.props)]);
      }
    });
  }
  return variantsStyles;
};
function shouldForwardProp(prop) {
  return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
}
const systemDefaultTheme = createTheme$1();
function createStyled2(input = {}) {
  const {
    defaultTheme: defaultTheme2 = systemDefaultTheme,
    rootShouldForwardProp: rootShouldForwardProp2 = shouldForwardProp,
    slotShouldForwardProp = shouldForwardProp
  } = input;
  return (tag, inputOptions = {}) => {
    const {
      name: componentName,
      slot: componentSlot,
      skipVariantsResolver: inputSkipVariantsResolver,
      skipSx: inputSkipSx,
      overridesResolver
    } = inputOptions, options = _objectWithoutPropertiesLoose$1(inputOptions, _excluded$h);
    const skipVariantsResolver = inputSkipVariantsResolver !== void 0 ? inputSkipVariantsResolver : componentSlot && componentSlot !== "Root" || false;
    const skipSx = inputSkipSx || false;
    let label;
    let shouldForwardPropOption = shouldForwardProp;
    if (componentSlot === "Root") {
      shouldForwardPropOption = rootShouldForwardProp2;
    } else if (componentSlot) {
      shouldForwardPropOption = slotShouldForwardProp;
    }
    const defaultStyledResolver = styled$2(tag, _extends$1({
      shouldForwardProp: shouldForwardPropOption,
      label
    }, options));
    const muiStyledResolver = (styleArg, ...expressions) => {
      const expressionsWithDefaultTheme = expressions ? expressions.map((stylesArg) => {
        return typeof stylesArg === "function" && stylesArg.__emotion_real !== stylesArg ? (_ref) => {
          let {
            theme: themeInput
          } = _ref, other = _objectWithoutPropertiesLoose$1(_ref, _excluded2);
          return stylesArg(_extends$1({
            theme: isEmpty(themeInput) ? defaultTheme2 : themeInput
          }, other));
        } : stylesArg;
      }) : [];
      let transformedStyleArg = styleArg;
      if (componentName && overridesResolver) {
        expressionsWithDefaultTheme.push((props) => {
          const theme = isEmpty(props.theme) ? defaultTheme2 : props.theme;
          const styleOverrides = getStyleOverrides(componentName, theme);
          if (styleOverrides) {
            return overridesResolver(props, styleOverrides);
          }
          return null;
        });
      }
      if (componentName && !skipVariantsResolver) {
        expressionsWithDefaultTheme.push((props) => {
          const theme = isEmpty(props.theme) ? defaultTheme2 : props.theme;
          return variantsResolver(props, getVariantStyles(componentName, theme), theme, componentName);
        });
      }
      if (!skipSx) {
        expressionsWithDefaultTheme.push((props) => {
          const theme = isEmpty(props.theme) ? defaultTheme2 : props.theme;
          return styleFunctionSx(_extends$1({}, props, {
            theme
          }));
        });
      }
      const numOfCustomFnsApplied = expressionsWithDefaultTheme.length - expressions.length;
      if (Array.isArray(styleArg) && numOfCustomFnsApplied > 0) {
        const placeholders = new Array(numOfCustomFnsApplied).fill("");
        transformedStyleArg = [...styleArg, ...placeholders];
        transformedStyleArg.raw = [...styleArg.raw, ...placeholders];
      } else if (typeof styleArg === "function") {
        transformedStyleArg = (_ref2) => {
          let {
            theme: themeInput
          } = _ref2, other = _objectWithoutPropertiesLoose$1(_ref2, _excluded3);
          return styleArg(_extends$1({
            theme: isEmpty(themeInput) ? defaultTheme2 : themeInput
          }, other));
        };
      }
      const Component = defaultStyledResolver(transformedStyleArg, ...expressionsWithDefaultTheme);
      return Component;
    };
    return muiStyledResolver;
  };
}
function getThemeProps(params) {
  const {
    theme,
    name,
    props
  } = params;
  if (!theme || !theme.components || !theme.components[name] || !theme.components[name].defaultProps) {
    return props;
  }
  return resolveProps(theme.components[name].defaultProps, props);
}
function useThemeProps$1({
  props,
  name,
  defaultTheme: defaultTheme2
}) {
  const theme = useTheme$1(defaultTheme2);
  const mergedProps = getThemeProps({
    theme,
    name,
    props
  });
  return mergedProps;
}
function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(min, value), max);
}
function hexToRgb(color2) {
  color2 = color2.substr(1);
  const re = new RegExp(`.{1,${color2.length >= 6 ? 2 : 1}}`, "g");
  let colors = color2.match(re);
  if (colors && colors[0].length === 1) {
    colors = colors.map((n2) => n2 + n2);
  }
  return colors ? `rgb${colors.length === 4 ? "a" : ""}(${colors.map((n2, index) => {
    return index < 3 ? parseInt(n2, 16) : Math.round(parseInt(n2, 16) / 255 * 1e3) / 1e3;
  }).join(", ")})` : "";
}
function decomposeColor(color2) {
  if (color2.type) {
    return color2;
  }
  if (color2.charAt(0) === "#") {
    return decomposeColor(hexToRgb(color2));
  }
  const marker = color2.indexOf("(");
  const type = color2.substring(0, marker);
  if (["rgb", "rgba", "hsl", "hsla", "color"].indexOf(type) === -1) {
    throw new Error(formatMuiErrorMessage(9, color2));
  }
  let values2 = color2.substring(marker + 1, color2.length - 1);
  let colorSpace;
  if (type === "color") {
    values2 = values2.split(" ");
    colorSpace = values2.shift();
    if (values2.length === 4 && values2[3].charAt(0) === "/") {
      values2[3] = values2[3].substr(1);
    }
    if (["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].indexOf(colorSpace) === -1) {
      throw new Error(formatMuiErrorMessage(10, colorSpace));
    }
  } else {
    values2 = values2.split(",");
  }
  values2 = values2.map((value) => parseFloat(value));
  return {
    type,
    values: values2,
    colorSpace
  };
}
function recomposeColor(color2) {
  const {
    type,
    colorSpace
  } = color2;
  let {
    values: values2
  } = color2;
  if (type.indexOf("rgb") !== -1) {
    values2 = values2.map((n2, i) => i < 3 ? parseInt(n2, 10) : n2);
  } else if (type.indexOf("hsl") !== -1) {
    values2[1] = `${values2[1]}%`;
    values2[2] = `${values2[2]}%`;
  }
  if (type.indexOf("color") !== -1) {
    values2 = `${colorSpace} ${values2.join(" ")}`;
  } else {
    values2 = `${values2.join(", ")}`;
  }
  return `${type}(${values2})`;
}
function hslToRgb(color2) {
  color2 = decomposeColor(color2);
  const {
    values: values2
  } = color2;
  const h2 = values2[0];
  const s = values2[1] / 100;
  const l2 = values2[2] / 100;
  const a = s * Math.min(l2, 1 - l2);
  const f2 = (n2, k2 = (n2 + h2 / 30) % 12) => l2 - a * Math.max(Math.min(k2 - 3, 9 - k2, 1), -1);
  let type = "rgb";
  const rgb = [Math.round(f2(0) * 255), Math.round(f2(8) * 255), Math.round(f2(4) * 255)];
  if (color2.type === "hsla") {
    type += "a";
    rgb.push(values2[3]);
  }
  return recomposeColor({
    type,
    values: rgb
  });
}
function getLuminance(color2) {
  color2 = decomposeColor(color2);
  let rgb = color2.type === "hsl" ? decomposeColor(hslToRgb(color2)).values : color2.values;
  rgb = rgb.map((val) => {
    if (color2.type !== "color") {
      val /= 255;
    }
    return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
  });
  return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3));
}
function getContrastRatio(foreground, background) {
  const lumA = getLuminance(foreground);
  const lumB = getLuminance(background);
  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}
function alpha(color2, value) {
  color2 = decomposeColor(color2);
  value = clamp(value);
  if (color2.type === "rgb" || color2.type === "hsl") {
    color2.type += "a";
  }
  if (color2.type === "color") {
    color2.values[3] = `/${value}`;
  } else {
    color2.values[3] = value;
  }
  return recomposeColor(color2);
}
function darken(color2, coefficient) {
  color2 = decomposeColor(color2);
  coefficient = clamp(coefficient);
  if (color2.type.indexOf("hsl") !== -1) {
    color2.values[2] *= 1 - coefficient;
  } else if (color2.type.indexOf("rgb") !== -1 || color2.type.indexOf("color") !== -1) {
    for (let i = 0; i < 3; i += 1) {
      color2.values[i] *= 1 - coefficient;
    }
  }
  return recomposeColor(color2);
}
function lighten(color2, coefficient) {
  color2 = decomposeColor(color2);
  coefficient = clamp(coefficient);
  if (color2.type.indexOf("hsl") !== -1) {
    color2.values[2] += (100 - color2.values[2]) * coefficient;
  } else if (color2.type.indexOf("rgb") !== -1) {
    for (let i = 0; i < 3; i += 1) {
      color2.values[i] += (255 - color2.values[i]) * coefficient;
    }
  } else if (color2.type.indexOf("color") !== -1) {
    for (let i = 0; i < 3; i += 1) {
      color2.values[i] += (1 - color2.values[i]) * coefficient;
    }
  }
  return recomposeColor(color2);
}
function InnerThemeProvider(props) {
  const theme = useTheme$1();
  return /* @__PURE__ */ jsxRuntime.exports.jsx(ThemeContext$2.Provider, {
    value: typeof theme === "object" ? theme : {},
    children: props.children
  });
}
function ThemeProvider(props) {
  const {
    children,
    theme: localTheme
  } = props;
  return /* @__PURE__ */ jsxRuntime.exports.jsx(ThemeProvider$1, {
    theme: localTheme,
    children: /* @__PURE__ */ jsxRuntime.exports.jsx(InnerThemeProvider, {
      children
    })
  });
}
function isHostComponent(element) {
  return typeof element === "string";
}
function composeClasses(slots, getUtilityClass, classes) {
  const output = {};
  Object.keys(slots).forEach((slot) => {
    output[slot] = slots[slot].reduce((acc, key) => {
      if (key) {
        if (classes && classes[key]) {
          acc.push(classes[key]);
        }
        acc.push(getUtilityClass(key));
      }
      return acc;
    }, []).join(" ");
  });
  return output;
}
const defaultGenerator = (componentName) => componentName;
const createClassNameGenerator = () => {
  let generate = defaultGenerator;
  return {
    configure(generator) {
      generate = generator;
    },
    generate(componentName) {
      return generate(componentName);
    },
    reset() {
      generate = defaultGenerator;
    }
  };
};
const ClassNameGenerator = createClassNameGenerator();
var ClassNameGenerator$1 = ClassNameGenerator;
const globalStateClassesMapping = {
  active: "Mui-active",
  checked: "Mui-checked",
  completed: "Mui-completed",
  disabled: "Mui-disabled",
  error: "Mui-error",
  expanded: "Mui-expanded",
  focused: "Mui-focused",
  focusVisible: "Mui-focusVisible",
  required: "Mui-required",
  selected: "Mui-selected"
};
function generateUtilityClass(componentName, slot) {
  const globalStateClass = globalStateClassesMapping[slot];
  return globalStateClass || `${ClassNameGenerator$1.generate(componentName)}-${slot}`;
}
function generateUtilityClasses(componentName, slots) {
  const result = {};
  slots.forEach((slot) => {
    result[slot] = generateUtilityClass(componentName, slot);
  });
  return result;
}
const _excluded$g = ["onChange", "maxRows", "minRows", "style", "value"];
function getStyleValue(computedStyle, property) {
  return parseInt(computedStyle[property], 10) || 0;
}
const styles$1 = {
  shadow: {
    visibility: "hidden",
    position: "absolute",
    overflow: "hidden",
    height: 0,
    top: 0,
    left: 0,
    transform: "translateZ(0)"
  }
};
const TextareaAutosize = /* @__PURE__ */ React.forwardRef(function TextareaAutosize2(props, ref) {
  const {
    onChange,
    maxRows,
    minRows = 1,
    style: style2,
    value
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$g);
  const {
    current: isControlled
  } = React.useRef(value != null);
  const inputRef = React.useRef(null);
  const handleRef = useForkRef(ref, inputRef);
  const shadowRef = React.useRef(null);
  const renders = React.useRef(0);
  const [state, setState] = React.useState({});
  const syncHeight = React.useCallback(() => {
    const input = inputRef.current;
    const containerWindow = ownerWindow(input);
    const computedStyle = containerWindow.getComputedStyle(input);
    if (computedStyle.width === "0px") {
      return;
    }
    const inputShallow = shadowRef.current;
    inputShallow.style.width = computedStyle.width;
    inputShallow.value = input.value || props.placeholder || "x";
    if (inputShallow.value.slice(-1) === "\n") {
      inputShallow.value += " ";
    }
    const boxSizing2 = computedStyle["box-sizing"];
    const padding = getStyleValue(computedStyle, "padding-bottom") + getStyleValue(computedStyle, "padding-top");
    const border2 = getStyleValue(computedStyle, "border-bottom-width") + getStyleValue(computedStyle, "border-top-width");
    const innerHeight = inputShallow.scrollHeight;
    inputShallow.value = "x";
    const singleRowHeight = inputShallow.scrollHeight;
    let outerHeight = innerHeight;
    if (minRows) {
      outerHeight = Math.max(Number(minRows) * singleRowHeight, outerHeight);
    }
    if (maxRows) {
      outerHeight = Math.min(Number(maxRows) * singleRowHeight, outerHeight);
    }
    outerHeight = Math.max(outerHeight, singleRowHeight);
    const outerHeightStyle = outerHeight + (boxSizing2 === "border-box" ? padding + border2 : 0);
    const overflow2 = Math.abs(outerHeight - innerHeight) <= 1;
    setState((prevState) => {
      if (renders.current < 20 && (outerHeightStyle > 0 && Math.abs((prevState.outerHeightStyle || 0) - outerHeightStyle) > 1 || prevState.overflow !== overflow2)) {
        renders.current += 1;
        return {
          overflow: overflow2,
          outerHeightStyle
        };
      }
      return prevState;
    });
  }, [maxRows, minRows, props.placeholder]);
  React.useEffect(() => {
    const handleResize = debounce(() => {
      renders.current = 0;
      syncHeight();
    });
    const containerWindow = ownerWindow(inputRef.current);
    containerWindow.addEventListener("resize", handleResize);
    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(inputRef.current);
    }
    return () => {
      handleResize.clear();
      containerWindow.removeEventListener("resize", handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [syncHeight]);
  useEnhancedEffect$1(() => {
    syncHeight();
  });
  React.useEffect(() => {
    renders.current = 0;
  }, [value]);
  const handleChange = (event) => {
    renders.current = 0;
    if (!isControlled) {
      syncHeight();
    }
    if (onChange) {
      onChange(event);
    }
  };
  return /* @__PURE__ */ jsxRuntime.exports.jsxs(React.Fragment, {
    children: [/* @__PURE__ */ jsxRuntime.exports.jsx("textarea", _extends$1({
      value,
      onChange: handleChange,
      ref: handleRef,
      rows: minRows,
      style: _extends$1({
        height: state.outerHeightStyle,
        overflow: state.overflow ? "hidden" : null
      }, style2)
    }, other)), /* @__PURE__ */ jsxRuntime.exports.jsx("textarea", {
      "aria-hidden": true,
      className: props.className,
      readOnly: true,
      ref: shadowRef,
      tabIndex: -1,
      style: _extends$1({}, styles$1.shadow, style2, {
        padding: 0
      })
    })]
  });
});
var TextareaAutosize$1 = TextareaAutosize;
function createMixins(breakpoints, spacing2, mixins) {
  return _extends$1({
    toolbar: {
      minHeight: 56,
      [`${breakpoints.up("xs")} and (orientation: landscape)`]: {
        minHeight: 48
      },
      [breakpoints.up("sm")]: {
        minHeight: 64
      }
    }
  }, mixins);
}
const _excluded$f = ["mode", "contrastThreshold", "tonalOffset"];
const light = {
  text: {
    primary: "rgba(0, 0, 0, 0.87)",
    secondary: "rgba(0, 0, 0, 0.6)",
    disabled: "rgba(0, 0, 0, 0.38)"
  },
  divider: "rgba(0, 0, 0, 0.12)",
  background: {
    paper: common$1.white,
    default: common$1.white
  },
  action: {
    active: "rgba(0, 0, 0, 0.54)",
    hover: "rgba(0, 0, 0, 0.04)",
    hoverOpacity: 0.04,
    selected: "rgba(0, 0, 0, 0.08)",
    selectedOpacity: 0.08,
    disabled: "rgba(0, 0, 0, 0.26)",
    disabledBackground: "rgba(0, 0, 0, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(0, 0, 0, 0.12)",
    focusOpacity: 0.12,
    activatedOpacity: 0.12
  }
};
const dark = {
  text: {
    primary: common$1.white,
    secondary: "rgba(255, 255, 255, 0.7)",
    disabled: "rgba(255, 255, 255, 0.5)",
    icon: "rgba(255, 255, 255, 0.5)"
  },
  divider: "rgba(255, 255, 255, 0.12)",
  background: {
    paper: "#121212",
    default: "#121212"
  },
  action: {
    active: common$1.white,
    hover: "rgba(255, 255, 255, 0.08)",
    hoverOpacity: 0.08,
    selected: "rgba(255, 255, 255, 0.16)",
    selectedOpacity: 0.16,
    disabled: "rgba(255, 255, 255, 0.3)",
    disabledBackground: "rgba(255, 255, 255, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(255, 255, 255, 0.12)",
    focusOpacity: 0.12,
    activatedOpacity: 0.24
  }
};
function addLightOrDark(intent, direction, shade, tonalOffset) {
  const tonalOffsetLight = tonalOffset.light || tonalOffset;
  const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5;
  if (!intent[direction]) {
    if (intent.hasOwnProperty(shade)) {
      intent[direction] = intent[shade];
    } else if (direction === "light") {
      intent.light = lighten(intent.main, tonalOffsetLight);
    } else if (direction === "dark") {
      intent.dark = darken(intent.main, tonalOffsetDark);
    }
  }
}
function getDefaultPrimary(mode = "light") {
  if (mode === "dark") {
    return {
      main: blue$1[200],
      light: blue$1[50],
      dark: blue$1[400]
    };
  }
  return {
    main: blue$1[700],
    light: blue$1[400],
    dark: blue$1[800]
  };
}
function getDefaultSecondary(mode = "light") {
  if (mode === "dark") {
    return {
      main: purple$1[200],
      light: purple$1[50],
      dark: purple$1[400]
    };
  }
  return {
    main: purple$1[500],
    light: purple$1[300],
    dark: purple$1[700]
  };
}
function getDefaultError(mode = "light") {
  if (mode === "dark") {
    return {
      main: red$1[500],
      light: red$1[300],
      dark: red$1[700]
    };
  }
  return {
    main: red$1[700],
    light: red$1[400],
    dark: red$1[800]
  };
}
function getDefaultInfo(mode = "light") {
  if (mode === "dark") {
    return {
      main: lightBlue$1[400],
      light: lightBlue$1[300],
      dark: lightBlue$1[700]
    };
  }
  return {
    main: lightBlue$1[700],
    light: lightBlue$1[500],
    dark: lightBlue$1[900]
  };
}
function getDefaultSuccess(mode = "light") {
  if (mode === "dark") {
    return {
      main: green$1[400],
      light: green$1[300],
      dark: green$1[700]
    };
  }
  return {
    main: green$1[800],
    light: green$1[500],
    dark: green$1[900]
  };
}
function getDefaultWarning(mode = "light") {
  if (mode === "dark") {
    return {
      main: orange$1[400],
      light: orange$1[300],
      dark: orange$1[700]
    };
  }
  return {
    main: "#ed6c02",
    light: orange$1[500],
    dark: orange$1[900]
  };
}
function createPalette(palette2) {
  const {
    mode = "light",
    contrastThreshold = 3,
    tonalOffset = 0.2
  } = palette2, other = _objectWithoutPropertiesLoose$1(palette2, _excluded$f);
  const primary = palette2.primary || getDefaultPrimary(mode);
  const secondary = palette2.secondary || getDefaultSecondary(mode);
  const error = palette2.error || getDefaultError(mode);
  const info = palette2.info || getDefaultInfo(mode);
  const success = palette2.success || getDefaultSuccess(mode);
  const warning2 = palette2.warning || getDefaultWarning(mode);
  function getContrastText(background) {
    const contrastText = getContrastRatio(background, dark.text.primary) >= contrastThreshold ? dark.text.primary : light.text.primary;
    return contrastText;
  }
  const augmentColor = ({
    color: color2,
    name,
    mainShade = 500,
    lightShade = 300,
    darkShade = 700
  }) => {
    color2 = _extends$1({}, color2);
    if (!color2.main && color2[mainShade]) {
      color2.main = color2[mainShade];
    }
    if (!color2.hasOwnProperty("main")) {
      throw new Error(formatMuiErrorMessage(11, name ? ` (${name})` : "", mainShade));
    }
    if (typeof color2.main !== "string") {
      throw new Error(formatMuiErrorMessage(12, name ? ` (${name})` : "", JSON.stringify(color2.main)));
    }
    addLightOrDark(color2, "light", lightShade, tonalOffset);
    addLightOrDark(color2, "dark", darkShade, tonalOffset);
    if (!color2.contrastText) {
      color2.contrastText = getContrastText(color2.main);
    }
    return color2;
  };
  const modes = {
    dark,
    light
  };
  const paletteOutput = deepmerge$1(_extends$1({
    common: common$1,
    mode,
    primary: augmentColor({
      color: primary,
      name: "primary"
    }),
    secondary: augmentColor({
      color: secondary,
      name: "secondary",
      mainShade: "A400",
      lightShade: "A200",
      darkShade: "A700"
    }),
    error: augmentColor({
      color: error,
      name: "error"
    }),
    warning: augmentColor({
      color: warning2,
      name: "warning"
    }),
    info: augmentColor({
      color: info,
      name: "info"
    }),
    success: augmentColor({
      color: success,
      name: "success"
    }),
    grey: grey$1,
    contrastThreshold,
    getContrastText,
    augmentColor,
    tonalOffset
  }, modes[mode]), other);
  return paletteOutput;
}
const _excluded$e = ["fontFamily", "fontSize", "fontWeightLight", "fontWeightRegular", "fontWeightMedium", "fontWeightBold", "htmlFontSize", "allVariants", "pxToRem"];
function round(value) {
  return Math.round(value * 1e5) / 1e5;
}
const caseAllCaps = {
  textTransform: "uppercase"
};
const defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
function createTypography(palette2, typography2) {
  const _ref = typeof typography2 === "function" ? typography2(palette2) : typography2, {
    fontFamily: fontFamily2 = defaultFontFamily,
    fontSize: fontSize2 = 14,
    fontWeightLight = 300,
    fontWeightRegular = 400,
    fontWeightMedium = 500,
    fontWeightBold = 700,
    htmlFontSize = 16,
    allVariants,
    pxToRem: pxToRem2
  } = _ref, other = _objectWithoutPropertiesLoose$1(_ref, _excluded$e);
  const coef = fontSize2 / 14;
  const pxToRem = pxToRem2 || ((size) => `${size / htmlFontSize * coef}rem`);
  const buildVariant = (fontWeight2, size, lineHeight2, letterSpacing2, casing) => _extends$1({
    fontFamily: fontFamily2,
    fontWeight: fontWeight2,
    fontSize: pxToRem(size),
    lineHeight: lineHeight2
  }, fontFamily2 === defaultFontFamily ? {
    letterSpacing: `${round(letterSpacing2 / size)}em`
  } : {}, casing, allVariants);
  const variants = {
    h1: buildVariant(fontWeightLight, 96, 1.167, -1.5),
    h2: buildVariant(fontWeightLight, 60, 1.2, -0.5),
    h3: buildVariant(fontWeightRegular, 48, 1.167, 0),
    h4: buildVariant(fontWeightRegular, 34, 1.235, 0.25),
    h5: buildVariant(fontWeightRegular, 24, 1.334, 0),
    h6: buildVariant(fontWeightMedium, 20, 1.6, 0.15),
    subtitle1: buildVariant(fontWeightRegular, 16, 1.75, 0.15),
    subtitle2: buildVariant(fontWeightMedium, 14, 1.57, 0.1),
    body1: buildVariant(fontWeightRegular, 16, 1.5, 0.15),
    body2: buildVariant(fontWeightRegular, 14, 1.43, 0.15),
    button: buildVariant(fontWeightMedium, 14, 1.75, 0.4, caseAllCaps),
    caption: buildVariant(fontWeightRegular, 12, 1.66, 0.4),
    overline: buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps)
  };
  return deepmerge$1(_extends$1({
    htmlFontSize,
    pxToRem,
    fontFamily: fontFamily2,
    fontSize: fontSize2,
    fontWeightLight,
    fontWeightRegular,
    fontWeightMedium,
    fontWeightBold
  }, variants), other, {
    clone: false
  });
}
const shadowKeyUmbraOpacity = 0.2;
const shadowKeyPenumbraOpacity = 0.14;
const shadowAmbientShadowOpacity = 0.12;
function createShadow(...px) {
  return [`${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`, `${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`, `${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`].join(",");
}
const shadows = ["none", createShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), createShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), createShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)];
var shadows$1 = shadows;
const _excluded$d = ["duration", "easing", "delay"];
const easing = {
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
};
const duration = {
  shortest: 150,
  shorter: 200,
  short: 250,
  standard: 300,
  complex: 375,
  enteringScreen: 225,
  leavingScreen: 195
};
function formatMs(milliseconds) {
  return `${Math.round(milliseconds)}ms`;
}
function getAutoHeightDuration(height2) {
  if (!height2) {
    return 0;
  }
  const constant = height2 / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}
function createTransitions(inputTransitions) {
  const mergedEasing = _extends$1({}, easing, inputTransitions.easing);
  const mergedDuration = _extends$1({}, duration, inputTransitions.duration);
  const create = (props = ["all"], options = {}) => {
    const {
      duration: durationOption = mergedDuration.standard,
      easing: easingOption = mergedEasing.easeInOut,
      delay = 0
    } = options;
    _objectWithoutPropertiesLoose$1(options, _excluded$d);
    return (Array.isArray(props) ? props : [props]).map((animatedProp) => `${animatedProp} ${typeof durationOption === "string" ? durationOption : formatMs(durationOption)} ${easingOption} ${typeof delay === "string" ? delay : formatMs(delay)}`).join(",");
  };
  return _extends$1({
    getAutoHeightDuration,
    create
  }, inputTransitions, {
    easing: mergedEasing,
    duration: mergedDuration
  });
}
const zIndex = {
  mobileStepper: 1e3,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500
};
var zIndex$1 = zIndex;
const _excluded$c = ["breakpoints", "mixins", "spacing", "palette", "transitions", "typography", "shape"];
function createTheme(options = {}, ...args) {
  const {
    mixins: mixinsInput = {},
    palette: paletteInput = {},
    transitions: transitionsInput = {},
    typography: typographyInput = {}
  } = options, other = _objectWithoutPropertiesLoose$1(options, _excluded$c);
  const palette2 = createPalette(paletteInput);
  const systemTheme = createTheme$1(options);
  let muiTheme = deepmerge$1(systemTheme, {
    mixins: createMixins(systemTheme.breakpoints, systemTheme.spacing, mixinsInput),
    palette: palette2,
    shadows: shadows$1.slice(),
    typography: createTypography(palette2, typographyInput),
    transitions: createTransitions(transitionsInput),
    zIndex: _extends$1({}, zIndex$1)
  });
  muiTheme = deepmerge$1(muiTheme, other);
  muiTheme = args.reduce((acc, argument) => deepmerge$1(acc, argument), muiTheme);
  return muiTheme;
}
const defaultTheme$1 = createTheme();
var defaultTheme$2 = defaultTheme$1;
function useTheme() {
  const theme = useTheme$1(defaultTheme$2);
  return theme;
}
function useThemeProps({
  props,
  name
}) {
  return useThemeProps$1({
    props,
    name,
    defaultTheme: defaultTheme$2
  });
}
const rootShouldForwardProp = (prop) => shouldForwardProp(prop) && prop !== "classes";
const styled = createStyled2({
  defaultTheme: defaultTheme$2,
  rootShouldForwardProp
});
var styled$1 = styled;
function getSvgIconUtilityClass(slot) {
  return generateUtilityClass("MuiSvgIcon", slot);
}
generateUtilityClasses("MuiSvgIcon", ["root", "colorPrimary", "colorSecondary", "colorAction", "colorError", "colorDisabled", "fontSizeInherit", "fontSizeSmall", "fontSizeMedium", "fontSizeLarge"]);
const _excluded$b = ["children", "className", "color", "component", "fontSize", "htmlColor", "titleAccess", "viewBox"];
const useUtilityClasses$9 = (ownerState) => {
  const {
    color: color2,
    fontSize: fontSize2,
    classes
  } = ownerState;
  const slots = {
    root: ["root", color2 !== "inherit" && `color${capitalize(color2)}`, `fontSize${capitalize(fontSize2)}`]
  };
  return composeClasses(slots, getSvgIconUtilityClass, classes);
};
const SvgIconRoot = styled$1("svg", {
  name: "MuiSvgIcon",
  slot: "Root",
  overridesResolver: (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.root, ownerState.color !== "inherit" && styles2[`color${capitalize(ownerState.color)}`], styles2[`fontSize${capitalize(ownerState.fontSize)}`]];
  }
})(({
  theme,
  ownerState
}) => {
  var _theme$palette$ownerS, _theme$palette$ownerS2;
  return {
    userSelect: "none",
    width: "1em",
    height: "1em",
    display: "inline-block",
    fill: "currentColor",
    flexShrink: 0,
    transition: theme.transitions.create("fill", {
      duration: theme.transitions.duration.shorter
    }),
    fontSize: {
      inherit: "inherit",
      small: theme.typography.pxToRem(20),
      medium: theme.typography.pxToRem(24),
      large: theme.typography.pxToRem(35)
    }[ownerState.fontSize],
    color: (_theme$palette$ownerS = (_theme$palette$ownerS2 = theme.palette[ownerState.color]) == null ? void 0 : _theme$palette$ownerS2.main) != null ? _theme$palette$ownerS : {
      action: theme.palette.action.active,
      disabled: theme.palette.action.disabled,
      inherit: void 0
    }[ownerState.color]
  };
});
const SvgIcon = /* @__PURE__ */ React.forwardRef(function SvgIcon2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiSvgIcon"
  });
  const {
    children,
    className,
    color: color2 = "inherit",
    component = "svg",
    fontSize: fontSize2 = "medium",
    htmlColor,
    titleAccess,
    viewBox = "0 0 24 24"
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$b);
  const ownerState = _extends$1({}, props, {
    color: color2,
    component,
    fontSize: fontSize2,
    viewBox
  });
  const classes = useUtilityClasses$9(ownerState);
  return /* @__PURE__ */ jsxRuntime.exports.jsxs(SvgIconRoot, _extends$1({
    as: component,
    className: clsx(classes.root, className),
    ownerState,
    focusable: "false",
    viewBox,
    color: htmlColor,
    "aria-hidden": titleAccess ? void 0 : true,
    role: titleAccess ? "img" : void 0,
    ref
  }, other, {
    children: [children, titleAccess ? /* @__PURE__ */ jsxRuntime.exports.jsx("title", {
      children: titleAccess
    }) : null]
  }));
});
SvgIcon.muiName = "SvgIcon";
var SvgIcon$1 = SvgIcon;
function createSvgIcon$1(path, displayName) {
  const Component = (props, ref) => /* @__PURE__ */ jsxRuntime.exports.jsx(SvgIcon$1, _extends$1({
    "data-testid": `${displayName}Icon`,
    ref
  }, props, {
    children: path
  }));
  Component.muiName = SvgIcon$1.muiName;
  return /* @__PURE__ */ React.memo(/* @__PURE__ */ React.forwardRef(Component));
}
var utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  capitalize,
  createChainedFunction,
  createSvgIcon: createSvgIcon$1,
  debounce,
  deprecatedPropType,
  isMuiElement,
  ownerDocument,
  ownerWindow,
  requirePropFactory,
  setRef,
  unstable_useEnhancedEffect: useEnhancedEffect$1,
  unstable_useId: useId,
  unsupportedProp,
  useControlled,
  useEventCallback: useEventCallback$1,
  useForkRef,
  useIsFocusVisible,
  unstable_ClassNameGenerator: ClassNameGenerator$1
}, Symbol.toStringTag, { value: "Module" }));
function _setPrototypeOf(o, p2) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p3) {
    o2.__proto__ = p3;
    return o2;
  };
  return _setPrototypeOf(o, p2);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
var TransitionGroupContext = React__default.createContext(null);
function _assertThisInitialized(self2) {
  if (self2 === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self2;
}
function getChildMapping(children, mapFn) {
  var mapper = function mapper2(child) {
    return mapFn && isValidElement(child) ? mapFn(child) : child;
  };
  var result = /* @__PURE__ */ Object.create(null);
  if (children)
    Children.map(children, function(c2) {
      return c2;
    }).forEach(function(child) {
      result[child.key] = mapper(child);
    });
  return result;
}
function mergeChildMappings(prev2, next2) {
  prev2 = prev2 || {};
  next2 = next2 || {};
  function getValueForKey(key) {
    return key in next2 ? next2[key] : prev2[key];
  }
  var nextKeysPending = /* @__PURE__ */ Object.create(null);
  var pendingKeys = [];
  for (var prevKey in prev2) {
    if (prevKey in next2) {
      if (pendingKeys.length) {
        nextKeysPending[prevKey] = pendingKeys;
        pendingKeys = [];
      }
    } else {
      pendingKeys.push(prevKey);
    }
  }
  var i;
  var childMapping = {};
  for (var nextKey in next2) {
    if (nextKeysPending[nextKey]) {
      for (i = 0; i < nextKeysPending[nextKey].length; i++) {
        var pendingNextKey = nextKeysPending[nextKey][i];
        childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
      }
    }
    childMapping[nextKey] = getValueForKey(nextKey);
  }
  for (i = 0; i < pendingKeys.length; i++) {
    childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
  }
  return childMapping;
}
function getProp(child, prop, props) {
  return props[prop] != null ? props[prop] : child.props[prop];
}
function getInitialChildMapping(props, onExited) {
  return getChildMapping(props.children, function(child) {
    return cloneElement(child, {
      onExited: onExited.bind(null, child),
      in: true,
      appear: getProp(child, "appear", props),
      enter: getProp(child, "enter", props),
      exit: getProp(child, "exit", props)
    });
  });
}
function getNextChildMapping(nextProps, prevChildMapping, onExited) {
  var nextChildMapping = getChildMapping(nextProps.children);
  var children = mergeChildMappings(prevChildMapping, nextChildMapping);
  Object.keys(children).forEach(function(key) {
    var child = children[key];
    if (!isValidElement(child))
      return;
    var hasPrev = key in prevChildMapping;
    var hasNext = key in nextChildMapping;
    var prevChild = prevChildMapping[key];
    var isLeaving = isValidElement(prevChild) && !prevChild.props.in;
    if (hasNext && (!hasPrev || isLeaving)) {
      children[key] = cloneElement(child, {
        onExited: onExited.bind(null, child),
        in: true,
        exit: getProp(child, "exit", nextProps),
        enter: getProp(child, "enter", nextProps)
      });
    } else if (!hasNext && hasPrev && !isLeaving) {
      children[key] = cloneElement(child, {
        in: false
      });
    } else if (hasNext && hasPrev && isValidElement(prevChild)) {
      children[key] = cloneElement(child, {
        onExited: onExited.bind(null, child),
        in: prevChild.props.in,
        exit: getProp(child, "exit", nextProps),
        enter: getProp(child, "enter", nextProps)
      });
    }
  });
  return children;
}
var values = Object.values || function(obj) {
  return Object.keys(obj).map(function(k2) {
    return obj[k2];
  });
};
var defaultProps = {
  component: "div",
  childFactory: function childFactory(child) {
    return child;
  }
};
var TransitionGroup = /* @__PURE__ */ function(_React$Component) {
  _inheritsLoose(TransitionGroup2, _React$Component);
  function TransitionGroup2(props, context) {
    var _this;
    _this = _React$Component.call(this, props, context) || this;
    var handleExited = _this.handleExited.bind(_assertThisInitialized(_this));
    _this.state = {
      contextValue: {
        isMounting: true
      },
      handleExited,
      firstRender: true
    };
    return _this;
  }
  var _proto = TransitionGroup2.prototype;
  _proto.componentDidMount = function componentDidMount() {
    this.mounted = true;
    this.setState({
      contextValue: {
        isMounting: false
      }
    });
  };
  _proto.componentWillUnmount = function componentWillUnmount() {
    this.mounted = false;
  };
  TransitionGroup2.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, _ref) {
    var prevChildMapping = _ref.children, handleExited = _ref.handleExited, firstRender = _ref.firstRender;
    return {
      children: firstRender ? getInitialChildMapping(nextProps, handleExited) : getNextChildMapping(nextProps, prevChildMapping, handleExited),
      firstRender: false
    };
  };
  _proto.handleExited = function handleExited(child, node2) {
    var currentChildMapping = getChildMapping(this.props.children);
    if (child.key in currentChildMapping)
      return;
    if (child.props.onExited) {
      child.props.onExited(node2);
    }
    if (this.mounted) {
      this.setState(function(state) {
        var children = _extends$1({}, state.children);
        delete children[child.key];
        return {
          children
        };
      });
    }
  };
  _proto.render = function render() {
    var _this$props = this.props, Component = _this$props.component, childFactory2 = _this$props.childFactory, props = _objectWithoutPropertiesLoose$1(_this$props, ["component", "childFactory"]);
    var contextValue = this.state.contextValue;
    var children = values(this.state.children).map(childFactory2);
    delete props.appear;
    delete props.enter;
    delete props.exit;
    if (Component === null) {
      return /* @__PURE__ */ React__default.createElement(TransitionGroupContext.Provider, {
        value: contextValue
      }, children);
    }
    return /* @__PURE__ */ React__default.createElement(TransitionGroupContext.Provider, {
      value: contextValue
    }, /* @__PURE__ */ React__default.createElement(Component, props, children));
  };
  return TransitionGroup2;
}(React__default.Component);
TransitionGroup.propTypes = {};
TransitionGroup.defaultProps = defaultProps;
var TransitionGroup$1 = TransitionGroup;
function getPaperUtilityClass(slot) {
  return generateUtilityClass("MuiPaper", slot);
}
generateUtilityClasses("MuiPaper", ["root", "rounded", "outlined", "elevation", "elevation0", "elevation1", "elevation2", "elevation3", "elevation4", "elevation5", "elevation6", "elevation7", "elevation8", "elevation9", "elevation10", "elevation11", "elevation12", "elevation13", "elevation14", "elevation15", "elevation16", "elevation17", "elevation18", "elevation19", "elevation20", "elevation21", "elevation22", "elevation23", "elevation24"]);
const _excluded$a = ["className", "component", "elevation", "square", "variant"];
const getOverlayAlpha = (elevation) => {
  let alphaValue;
  if (elevation < 1) {
    alphaValue = 5.11916 * elevation ** 2;
  } else {
    alphaValue = 4.5 * Math.log(elevation + 1) + 2;
  }
  return (alphaValue / 100).toFixed(2);
};
const useUtilityClasses$8 = (ownerState) => {
  const {
    square,
    elevation,
    variant,
    classes
  } = ownerState;
  const slots = {
    root: ["root", variant, !square && "rounded", variant === "elevation" && `elevation${elevation}`]
  };
  return composeClasses(slots, getPaperUtilityClass, classes);
};
const PaperRoot = styled$1("div", {
  name: "MuiPaper",
  slot: "Root",
  overridesResolver: (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.root, styles2[ownerState.variant], !ownerState.square && styles2.rounded, ownerState.variant === "elevation" && styles2[`elevation${ownerState.elevation}`]];
  }
})(({
  theme,
  ownerState
}) => _extends$1({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: theme.transitions.create("box-shadow")
}, !ownerState.square && {
  borderRadius: theme.shape.borderRadius
}, ownerState.variant === "outlined" && {
  border: `1px solid ${theme.palette.divider}`
}, ownerState.variant === "elevation" && _extends$1({
  boxShadow: theme.shadows[ownerState.elevation]
}, theme.palette.mode === "dark" && {
  backgroundImage: `linear-gradient(${alpha("#fff", getOverlayAlpha(ownerState.elevation))}, ${alpha("#fff", getOverlayAlpha(ownerState.elevation))})`
})));
const Paper = /* @__PURE__ */ React.forwardRef(function Paper2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiPaper"
  });
  const {
    className,
    component = "div",
    elevation = 1,
    square = false,
    variant = "elevation"
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$a);
  const ownerState = _extends$1({}, props, {
    component,
    elevation,
    square,
    variant
  });
  const classes = useUtilityClasses$8(ownerState);
  return /* @__PURE__ */ jsxRuntime.exports.jsx(PaperRoot, _extends$1({
    as: component,
    ownerState,
    className: clsx(classes.root, className),
    ref
  }, other));
});
var Paper$1 = Paper;
function Ripple(props) {
  const {
    className,
    classes,
    pulsate = false,
    rippleX,
    rippleY,
    rippleSize,
    in: inProp,
    onExited,
    timeout
  } = props;
  const [leaving, setLeaving] = React.useState(false);
  const rippleClassName = clsx(className, classes.ripple, classes.rippleVisible, pulsate && classes.ripplePulsate);
  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX
  };
  const childClassName = clsx(classes.child, leaving && classes.childLeaving, pulsate && classes.childPulsate);
  if (!inProp && !leaving) {
    setLeaving(true);
  }
  React.useEffect(() => {
    if (!inProp && onExited != null) {
      const timeoutId = setTimeout(onExited, timeout);
      return () => {
        clearTimeout(timeoutId);
      };
    }
    return void 0;
  }, [onExited, inProp, timeout]);
  return /* @__PURE__ */ jsxRuntime.exports.jsx("span", {
    className: rippleClassName,
    style: rippleStyles,
    children: /* @__PURE__ */ jsxRuntime.exports.jsx("span", {
      className: childClassName
    })
  });
}
const touchRippleClasses = generateUtilityClasses("MuiTouchRipple", ["root", "ripple", "rippleVisible", "ripplePulsate", "child", "childLeaving", "childPulsate"]);
var touchRippleClasses$1 = touchRippleClasses;
const _excluded$9 = ["center", "classes", "className"];
let _ = (t2) => t2, _t, _t2, _t3, _t4;
const DURATION = 550;
const DELAY_RIPPLE = 80;
const enterKeyframe = keyframes(_t || (_t = _`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`));
const exitKeyframe = keyframes(_t2 || (_t2 = _`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`));
const pulsateKeyframe = keyframes(_t3 || (_t3 = _`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`));
const TouchRippleRoot = styled$1("span", {
  name: "MuiTouchRipple",
  slot: "Root",
  skipSx: true
})({
  overflow: "hidden",
  pointerEvents: "none",
  position: "absolute",
  zIndex: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  borderRadius: "inherit"
});
const TouchRippleRipple = styled$1(Ripple, {
  name: "MuiTouchRipple",
  slot: "Ripple"
})(_t4 || (_t4 = _`
  opacity: 0;
  position: absolute;

  &.${0} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  &.${0} {
    animation-duration: ${0}ms;
  }

  & .${0} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${0} {
    opacity: 0;
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  & .${0} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${0};
    animation-duration: 2500ms;
    animation-timing-function: ${0};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`), touchRippleClasses$1.rippleVisible, enterKeyframe, DURATION, ({
  theme
}) => theme.transitions.easing.easeInOut, touchRippleClasses$1.ripplePulsate, ({
  theme
}) => theme.transitions.duration.shorter, touchRippleClasses$1.child, touchRippleClasses$1.childLeaving, exitKeyframe, DURATION, ({
  theme
}) => theme.transitions.easing.easeInOut, touchRippleClasses$1.childPulsate, pulsateKeyframe, ({
  theme
}) => theme.transitions.easing.easeInOut);
const TouchRipple = /* @__PURE__ */ React.forwardRef(function TouchRipple2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiTouchRipple"
  });
  const {
    center: centerProp = false,
    classes = {},
    className
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$9);
  const [ripples, setRipples] = React.useState([]);
  const nextKey = React.useRef(0);
  const rippleCallback = React.useRef(null);
  React.useEffect(() => {
    if (rippleCallback.current) {
      rippleCallback.current();
      rippleCallback.current = null;
    }
  }, [ripples]);
  const ignoringMouseDown = React.useRef(false);
  const startTimer = React.useRef(null);
  const startTimerCommit = React.useRef(null);
  const container = React.useRef(null);
  React.useEffect(() => {
    return () => {
      clearTimeout(startTimer.current);
    };
  }, []);
  const startCommit = React.useCallback((params) => {
    const {
      pulsate: pulsate2,
      rippleX,
      rippleY,
      rippleSize,
      cb
    } = params;
    setRipples((oldRipples) => [...oldRipples, /* @__PURE__ */ jsxRuntime.exports.jsx(TouchRippleRipple, {
      classes: {
        ripple: clsx(classes.ripple, touchRippleClasses$1.ripple),
        rippleVisible: clsx(classes.rippleVisible, touchRippleClasses$1.rippleVisible),
        ripplePulsate: clsx(classes.ripplePulsate, touchRippleClasses$1.ripplePulsate),
        child: clsx(classes.child, touchRippleClasses$1.child),
        childLeaving: clsx(classes.childLeaving, touchRippleClasses$1.childLeaving),
        childPulsate: clsx(classes.childPulsate, touchRippleClasses$1.childPulsate)
      },
      timeout: DURATION,
      pulsate: pulsate2,
      rippleX,
      rippleY,
      rippleSize
    }, nextKey.current)]);
    nextKey.current += 1;
    rippleCallback.current = cb;
  }, [classes]);
  const start = React.useCallback((event = {}, options = {}, cb) => {
    const {
      pulsate: pulsate2 = false,
      center = centerProp || options.pulsate,
      fakeElement = false
    } = options;
    if (event.type === "mousedown" && ignoringMouseDown.current) {
      ignoringMouseDown.current = false;
      return;
    }
    if (event.type === "touchstart") {
      ignoringMouseDown.current = true;
    }
    const element = fakeElement ? null : container.current;
    const rect = element ? element.getBoundingClientRect() : {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    };
    let rippleX;
    let rippleY;
    let rippleSize;
    if (center || event.clientX === 0 && event.clientY === 0 || !event.clientX && !event.touches) {
      rippleX = Math.round(rect.width / 2);
      rippleY = Math.round(rect.height / 2);
    } else {
      const {
        clientX,
        clientY
      } = event.touches ? event.touches[0] : event;
      rippleX = Math.round(clientX - rect.left);
      rippleY = Math.round(clientY - rect.top);
    }
    if (center) {
      rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);
      if (rippleSize % 2 === 0) {
        rippleSize += 1;
      }
    } else {
      const sizeX = Math.max(Math.abs((element ? element.clientWidth : 0) - rippleX), rippleX) * 2 + 2;
      const sizeY = Math.max(Math.abs((element ? element.clientHeight : 0) - rippleY), rippleY) * 2 + 2;
      rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
    }
    if (event.touches) {
      if (startTimerCommit.current === null) {
        startTimerCommit.current = () => {
          startCommit({
            pulsate: pulsate2,
            rippleX,
            rippleY,
            rippleSize,
            cb
          });
        };
        startTimer.current = setTimeout(() => {
          if (startTimerCommit.current) {
            startTimerCommit.current();
            startTimerCommit.current = null;
          }
        }, DELAY_RIPPLE);
      }
    } else {
      startCommit({
        pulsate: pulsate2,
        rippleX,
        rippleY,
        rippleSize,
        cb
      });
    }
  }, [centerProp, startCommit]);
  const pulsate = React.useCallback(() => {
    start({}, {
      pulsate: true
    });
  }, [start]);
  const stop = React.useCallback((event, cb) => {
    clearTimeout(startTimer.current);
    if (event.type === "touchend" && startTimerCommit.current) {
      startTimerCommit.current();
      startTimerCommit.current = null;
      startTimer.current = setTimeout(() => {
        stop(event, cb);
      });
      return;
    }
    startTimerCommit.current = null;
    setRipples((oldRipples) => {
      if (oldRipples.length > 0) {
        return oldRipples.slice(1);
      }
      return oldRipples;
    });
    rippleCallback.current = cb;
  }, []);
  React.useImperativeHandle(ref, () => ({
    pulsate,
    start,
    stop
  }), [pulsate, start, stop]);
  return /* @__PURE__ */ jsxRuntime.exports.jsx(TouchRippleRoot, _extends$1({
    className: clsx(classes.root, touchRippleClasses$1.root, className),
    ref: container
  }, other, {
    children: /* @__PURE__ */ jsxRuntime.exports.jsx(TransitionGroup$1, {
      component: null,
      exit: true,
      children: ripples
    })
  }));
});
var TouchRipple$1 = TouchRipple;
function getButtonBaseUtilityClass(slot) {
  return generateUtilityClass("MuiButtonBase", slot);
}
const buttonBaseClasses = generateUtilityClasses("MuiButtonBase", ["root", "disabled", "focusVisible"]);
var buttonBaseClasses$1 = buttonBaseClasses;
const _excluded$8 = ["action", "centerRipple", "children", "className", "component", "disabled", "disableRipple", "disableTouchRipple", "focusRipple", "focusVisibleClassName", "LinkComponent", "onBlur", "onClick", "onContextMenu", "onDragLeave", "onFocus", "onFocusVisible", "onKeyDown", "onKeyUp", "onMouseDown", "onMouseLeave", "onMouseUp", "onTouchEnd", "onTouchMove", "onTouchStart", "tabIndex", "TouchRippleProps", "type"];
const useUtilityClasses$7 = (ownerState) => {
  const {
    disabled,
    focusVisible,
    focusVisibleClassName,
    classes
  } = ownerState;
  const slots = {
    root: ["root", disabled && "disabled", focusVisible && "focusVisible"]
  };
  const composedClasses = composeClasses(slots, getButtonBaseUtilityClass, classes);
  if (focusVisible && focusVisibleClassName) {
    composedClasses.root += ` ${focusVisibleClassName}`;
  }
  return composedClasses;
};
const ButtonBaseRoot = styled$1("button", {
  name: "MuiButtonBase",
  slot: "Root",
  overridesResolver: (props, styles2) => styles2.root
})({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  boxSizing: "border-box",
  WebkitTapHighlightColor: "transparent",
  backgroundColor: "transparent",
  outline: 0,
  border: 0,
  margin: 0,
  borderRadius: 0,
  padding: 0,
  cursor: "pointer",
  userSelect: "none",
  verticalAlign: "middle",
  MozAppearance: "none",
  WebkitAppearance: "none",
  textDecoration: "none",
  color: "inherit",
  "&::-moz-focus-inner": {
    borderStyle: "none"
  },
  [`&.${buttonBaseClasses$1.disabled}`]: {
    pointerEvents: "none",
    cursor: "default"
  },
  "@media print": {
    colorAdjust: "exact"
  }
});
const ButtonBase = /* @__PURE__ */ React.forwardRef(function ButtonBase2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiButtonBase"
  });
  const {
    action,
    centerRipple = false,
    children,
    className,
    component = "button",
    disabled = false,
    disableRipple = false,
    disableTouchRipple = false,
    focusRipple = false,
    LinkComponent = "a",
    onBlur,
    onClick,
    onContextMenu,
    onDragLeave,
    onFocus,
    onFocusVisible,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    tabIndex = 0,
    TouchRippleProps,
    type
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$8);
  const buttonRef = React.useRef(null);
  const rippleRef = React.useRef(null);
  const {
    isFocusVisibleRef,
    onFocus: handleFocusVisible,
    onBlur: handleBlurVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();
  const [focusVisible, setFocusVisible] = React.useState(false);
  if (disabled && focusVisible) {
    setFocusVisible(false);
  }
  React.useImperativeHandle(action, () => ({
    focusVisible: () => {
      setFocusVisible(true);
      buttonRef.current.focus();
    }
  }), []);
  React.useEffect(() => {
    if (focusVisible && focusRipple && !disableRipple) {
      rippleRef.current.pulsate();
    }
  }, [disableRipple, focusRipple, focusVisible]);
  function useRippleHandler(rippleAction, eventCallback, skipRippleAction = disableTouchRipple) {
    return useEventCallback$1((event) => {
      if (eventCallback) {
        eventCallback(event);
      }
      const ignore = skipRippleAction;
      if (!ignore && rippleRef.current) {
        rippleRef.current[rippleAction](event);
      }
      return true;
    });
  }
  const handleMouseDown = useRippleHandler("start", onMouseDown);
  const handleContextMenu = useRippleHandler("stop", onContextMenu);
  const handleDragLeave = useRippleHandler("stop", onDragLeave);
  const handleMouseUp = useRippleHandler("stop", onMouseUp);
  const handleMouseLeave = useRippleHandler("stop", (event) => {
    if (focusVisible) {
      event.preventDefault();
    }
    if (onMouseLeave) {
      onMouseLeave(event);
    }
  });
  const handleTouchStart = useRippleHandler("start", onTouchStart);
  const handleTouchEnd = useRippleHandler("stop", onTouchEnd);
  const handleTouchMove = useRippleHandler("stop", onTouchMove);
  const handleBlur = useRippleHandler("stop", (event) => {
    handleBlurVisible(event);
    if (isFocusVisibleRef.current === false) {
      setFocusVisible(false);
    }
    if (onBlur) {
      onBlur(event);
    }
  }, false);
  const handleFocus = useEventCallback$1((event) => {
    if (!buttonRef.current) {
      buttonRef.current = event.currentTarget;
    }
    handleFocusVisible(event);
    if (isFocusVisibleRef.current === true) {
      setFocusVisible(true);
      if (onFocusVisible) {
        onFocusVisible(event);
      }
    }
    if (onFocus) {
      onFocus(event);
    }
  });
  const isNonNativeButton = () => {
    const button = buttonRef.current;
    return component && component !== "button" && !(button.tagName === "A" && button.href);
  };
  const keydownRef = React.useRef(false);
  const handleKeyDown2 = useEventCallback$1((event) => {
    if (focusRipple && !keydownRef.current && focusVisible && rippleRef.current && event.key === " ") {
      keydownRef.current = true;
      rippleRef.current.stop(event, () => {
        rippleRef.current.start(event);
      });
    }
    if (event.target === event.currentTarget && isNonNativeButton() && event.key === " ") {
      event.preventDefault();
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
    if (event.target === event.currentTarget && isNonNativeButton() && event.key === "Enter" && !disabled) {
      event.preventDefault();
      if (onClick) {
        onClick(event);
      }
    }
  });
  const handleKeyUp = useEventCallback$1((event) => {
    if (focusRipple && event.key === " " && rippleRef.current && focusVisible && !event.defaultPrevented) {
      keydownRef.current = false;
      rippleRef.current.stop(event, () => {
        rippleRef.current.pulsate(event);
      });
    }
    if (onKeyUp) {
      onKeyUp(event);
    }
    if (onClick && event.target === event.currentTarget && isNonNativeButton() && event.key === " " && !event.defaultPrevented) {
      onClick(event);
    }
  });
  let ComponentProp = component;
  if (ComponentProp === "button" && (other.href || other.to)) {
    ComponentProp = LinkComponent;
  }
  const buttonProps = {};
  if (ComponentProp === "button") {
    buttonProps.type = type === void 0 ? "button" : type;
    buttonProps.disabled = disabled;
  } else {
    if (!other.href && !other.to) {
      buttonProps.role = "button";
    }
    if (disabled) {
      buttonProps["aria-disabled"] = disabled;
    }
  }
  const handleOwnRef = useForkRef(focusVisibleRef, buttonRef);
  const handleRef = useForkRef(ref, handleOwnRef);
  const [mountedState, setMountedState] = React.useState(false);
  React.useEffect(() => {
    setMountedState(true);
  }, []);
  const enableTouchRipple = mountedState && !disableRipple && !disabled;
  const ownerState = _extends$1({}, props, {
    centerRipple,
    component,
    disabled,
    disableRipple,
    disableTouchRipple,
    focusRipple,
    tabIndex,
    focusVisible
  });
  const classes = useUtilityClasses$7(ownerState);
  return /* @__PURE__ */ jsxRuntime.exports.jsxs(ButtonBaseRoot, _extends$1({
    as: ComponentProp,
    className: clsx(classes.root, className),
    ownerState,
    onBlur: handleBlur,
    onClick,
    onContextMenu: handleContextMenu,
    onFocus: handleFocus,
    onKeyDown: handleKeyDown2,
    onKeyUp: handleKeyUp,
    onMouseDown: handleMouseDown,
    onMouseLeave: handleMouseLeave,
    onMouseUp: handleMouseUp,
    onDragLeave: handleDragLeave,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    onTouchStart: handleTouchStart,
    ref: handleRef,
    tabIndex: disabled ? -1 : tabIndex,
    type
  }, buttonProps, other, {
    children: [children, enableTouchRipple ? /* @__PURE__ */ jsxRuntime.exports.jsx(TouchRipple$1, _extends$1({
      ref: rippleRef,
      center: centerRipple
    }, TouchRippleProps)) : null]
  }));
});
var ButtonBase$1 = ButtonBase;
function getTypographyUtilityClass(slot) {
  return generateUtilityClass("MuiTypography", slot);
}
generateUtilityClasses("MuiTypography", ["root", "h1", "h2", "h3", "h4", "h5", "h6", "subtitle1", "subtitle2", "body1", "body2", "inherit", "button", "caption", "overline", "alignLeft", "alignRight", "alignCenter", "alignJustify", "noWrap", "gutterBottom", "paragraph"]);
const _excluded$7 = ["align", "className", "component", "gutterBottom", "noWrap", "paragraph", "variant", "variantMapping"];
const useUtilityClasses$6 = (ownerState) => {
  const {
    align,
    gutterBottom,
    noWrap,
    paragraph,
    variant,
    classes
  } = ownerState;
  const slots = {
    root: ["root", variant, ownerState.align !== "inherit" && `align${capitalize(align)}`, gutterBottom && "gutterBottom", noWrap && "noWrap", paragraph && "paragraph"]
  };
  return composeClasses(slots, getTypographyUtilityClass, classes);
};
const TypographyRoot = styled$1("span", {
  name: "MuiTypography",
  slot: "Root",
  overridesResolver: (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.root, ownerState.variant && styles2[ownerState.variant], ownerState.align !== "inherit" && styles2[`align${capitalize(ownerState.align)}`], ownerState.noWrap && styles2.noWrap, ownerState.gutterBottom && styles2.gutterBottom, ownerState.paragraph && styles2.paragraph];
  }
})(({
  theme,
  ownerState
}) => _extends$1({
  margin: 0
}, ownerState.variant && theme.typography[ownerState.variant], ownerState.align !== "inherit" && {
  textAlign: ownerState.align
}, ownerState.noWrap && {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
}, ownerState.gutterBottom && {
  marginBottom: "0.35em"
}, ownerState.paragraph && {
  marginBottom: 16
}));
const defaultVariantMapping = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  subtitle1: "h6",
  subtitle2: "h6",
  body1: "p",
  body2: "p",
  inherit: "p"
};
const colorTransformations = {
  primary: "primary.main",
  textPrimary: "text.primary",
  secondary: "secondary.main",
  textSecondary: "text.secondary",
  error: "error.main"
};
const transformDeprecatedColors = (color2) => {
  return colorTransformations[color2] || color2;
};
const Typography = /* @__PURE__ */ React.forwardRef(function Typography2(inProps, ref) {
  const themeProps = useThemeProps({
    props: inProps,
    name: "MuiTypography"
  });
  const color2 = transformDeprecatedColors(themeProps.color);
  const props = extendSxProp(_extends$1({}, themeProps, {
    color: color2
  }));
  const {
    align = "inherit",
    className,
    component,
    gutterBottom = false,
    noWrap = false,
    paragraph = false,
    variant = "body1",
    variantMapping = defaultVariantMapping
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$7);
  const ownerState = _extends$1({}, props, {
    align,
    color: color2,
    className,
    component,
    gutterBottom,
    noWrap,
    paragraph,
    variant,
    variantMapping
  });
  const Component = component || (paragraph ? "p" : variantMapping[variant] || defaultVariantMapping[variant]) || "span";
  const classes = useUtilityClasses$6(ownerState);
  return /* @__PURE__ */ jsxRuntime.exports.jsx(TypographyRoot, _extends$1({
    as: Component,
    ref,
    ownerState,
    className: clsx(classes.root, className)
  }, other));
});
var Typography$1 = Typography;
function getAppBarUtilityClass(slot) {
  return generateUtilityClass("MuiAppBar", slot);
}
generateUtilityClasses("MuiAppBar", ["root", "positionFixed", "positionAbsolute", "positionSticky", "positionStatic", "positionRelative", "colorDefault", "colorPrimary", "colorSecondary", "colorInherit", "colorTransparent"]);
const _excluded$6 = ["className", "color", "enableColorOnDark", "position"];
const useUtilityClasses$5 = (ownerState) => {
  const {
    color: color2,
    position: position2,
    classes
  } = ownerState;
  const slots = {
    root: ["root", `color${capitalize(color2)}`, `position${capitalize(position2)}`]
  };
  return composeClasses(slots, getAppBarUtilityClass, classes);
};
const AppBarRoot = styled$1(Paper$1, {
  name: "MuiAppBar",
  slot: "Root",
  overridesResolver: (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.root, styles2[`position${capitalize(ownerState.position)}`], styles2[`color${capitalize(ownerState.color)}`]];
  }
})(({
  theme,
  ownerState
}) => {
  const backgroundColorDefault = theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900];
  return _extends$1({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    boxSizing: "border-box",
    flexShrink: 0
  }, ownerState.position === "fixed" && {
    position: "fixed",
    zIndex: theme.zIndex.appBar,
    top: 0,
    left: "auto",
    right: 0,
    "@media print": {
      position: "absolute"
    }
  }, ownerState.position === "absolute" && {
    position: "absolute",
    zIndex: theme.zIndex.appBar,
    top: 0,
    left: "auto",
    right: 0
  }, ownerState.position === "sticky" && {
    position: "sticky",
    zIndex: theme.zIndex.appBar,
    top: 0,
    left: "auto",
    right: 0
  }, ownerState.position === "static" && {
    position: "static"
  }, ownerState.position === "relative" && {
    position: "relative"
  }, ownerState.color === "default" && {
    backgroundColor: backgroundColorDefault,
    color: theme.palette.getContrastText(backgroundColorDefault)
  }, ownerState.color && ownerState.color !== "default" && ownerState.color !== "inherit" && ownerState.color !== "transparent" && {
    backgroundColor: theme.palette[ownerState.color].main,
    color: theme.palette[ownerState.color].contrastText
  }, ownerState.color === "inherit" && {
    color: "inherit"
  }, theme.palette.mode === "dark" && !ownerState.enableColorOnDark && {
    backgroundColor: null,
    color: null
  }, ownerState.color === "transparent" && _extends$1({
    backgroundColor: "transparent",
    color: "inherit"
  }, theme.palette.mode === "dark" && {
    backgroundImage: "none"
  }));
});
const AppBar = /* @__PURE__ */ React.forwardRef(function AppBar2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiAppBar"
  });
  const {
    className,
    color: color2 = "primary",
    enableColorOnDark = false,
    position: position2 = "fixed"
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$6);
  const ownerState = _extends$1({}, props, {
    color: color2,
    position: position2,
    enableColorOnDark
  });
  const classes = useUtilityClasses$5(ownerState);
  return /* @__PURE__ */ jsxRuntime.exports.jsx(AppBarRoot, _extends$1({
    square: true,
    component: "header",
    ownerState,
    elevation: 4,
    className: clsx(classes.root, className, position2 === "fixed" && "mui-fixed"),
    ref
  }, other));
});
var AppBar$1 = AppBar;
function getInputBaseUtilityClass(slot) {
  return generateUtilityClass("MuiInputBase", slot);
}
const inputBaseClasses = generateUtilityClasses("MuiInputBase", ["root", "formControl", "focused", "disabled", "adornedStart", "adornedEnd", "error", "sizeSmall", "multiline", "colorSecondary", "fullWidth", "hiddenLabel", "input", "inputSizeSmall", "inputMultiline", "inputTypeSearch", "inputAdornedStart", "inputAdornedEnd", "inputHiddenLabel"]);
var inputBaseClasses$1 = inputBaseClasses;
const defaultTheme = createTheme();
const Box = createBox({
  defaultTheme,
  defaultClassName: "MuiBox-root",
  generateClassName: ClassNameGenerator$1.generate
});
var Box$1 = Box;
const FormControlContext = /* @__PURE__ */ React.createContext();
var FormControlContext$1 = FormControlContext;
function useFormControl() {
  return React.useContext(FormControlContext$1);
}
function GlobalStyles(props) {
  return /* @__PURE__ */ jsxRuntime.exports.jsx(GlobalStyles$1, _extends$1({}, props, {
    defaultTheme: defaultTheme$2
  }));
}
function formControlState({
  props,
  states,
  muiFormControl
}) {
  return states.reduce((acc, state) => {
    acc[state] = props[state];
    if (muiFormControl) {
      if (typeof props[state] === "undefined") {
        acc[state] = muiFormControl[state];
      }
    }
    return acc;
  }, {});
}
function hasValue(value) {
  return value != null && !(Array.isArray(value) && value.length === 0);
}
function isFilled(obj, SSR = false) {
  return obj && (hasValue(obj.value) && obj.value !== "" || SSR && hasValue(obj.defaultValue) && obj.defaultValue !== "");
}
const _excluded$5 = ["aria-describedby", "autoComplete", "autoFocus", "className", "color", "components", "componentsProps", "defaultValue", "disabled", "disableInjectingGlobalStyles", "endAdornment", "error", "fullWidth", "id", "inputComponent", "inputProps", "inputRef", "margin", "maxRows", "minRows", "multiline", "name", "onBlur", "onChange", "onClick", "onFocus", "onKeyDown", "onKeyUp", "placeholder", "readOnly", "renderSuffix", "rows", "size", "startAdornment", "type", "value"];
const rootOverridesResolver = (props, styles2) => {
  const {
    ownerState
  } = props;
  return [styles2.root, ownerState.formControl && styles2.formControl, ownerState.startAdornment && styles2.adornedStart, ownerState.endAdornment && styles2.adornedEnd, ownerState.error && styles2.error, ownerState.size === "small" && styles2.sizeSmall, ownerState.multiline && styles2.multiline, ownerState.color && styles2[`color${capitalize(ownerState.color)}`], ownerState.fullWidth && styles2.fullWidth, ownerState.hiddenLabel && styles2.hiddenLabel];
};
const inputOverridesResolver = (props, styles2) => {
  const {
    ownerState
  } = props;
  return [styles2.input, ownerState.size === "small" && styles2.inputSizeSmall, ownerState.multiline && styles2.inputMultiline, ownerState.type === "search" && styles2.inputTypeSearch, ownerState.startAdornment && styles2.inputAdornedStart, ownerState.endAdornment && styles2.inputAdornedEnd, ownerState.hiddenLabel && styles2.inputHiddenLabel];
};
const useUtilityClasses$4 = (ownerState) => {
  const {
    classes,
    color: color2,
    disabled,
    error,
    endAdornment,
    focused,
    formControl,
    fullWidth,
    hiddenLabel,
    multiline,
    size,
    startAdornment,
    type
  } = ownerState;
  const slots = {
    root: ["root", `color${capitalize(color2)}`, disabled && "disabled", error && "error", fullWidth && "fullWidth", focused && "focused", formControl && "formControl", size === "small" && "sizeSmall", multiline && "multiline", startAdornment && "adornedStart", endAdornment && "adornedEnd", hiddenLabel && "hiddenLabel"],
    input: ["input", disabled && "disabled", type === "search" && "inputTypeSearch", multiline && "inputMultiline", size === "small" && "inputSizeSmall", hiddenLabel && "inputHiddenLabel", startAdornment && "inputAdornedStart", endAdornment && "inputAdornedEnd"]
  };
  return composeClasses(slots, getInputBaseUtilityClass, classes);
};
const InputBaseRoot = styled$1("div", {
  name: "MuiInputBase",
  slot: "Root",
  overridesResolver: rootOverridesResolver
})(({
  theme,
  ownerState
}) => _extends$1({}, theme.typography.body1, {
  color: theme.palette.text.primary,
  lineHeight: "1.4375em",
  boxSizing: "border-box",
  position: "relative",
  cursor: "text",
  display: "inline-flex",
  alignItems: "center",
  [`&.${inputBaseClasses$1.disabled}`]: {
    color: theme.palette.text.disabled,
    cursor: "default"
  }
}, ownerState.multiline && _extends$1({
  padding: "4px 0 5px"
}, ownerState.size === "small" && {
  paddingTop: 1
}), ownerState.fullWidth && {
  width: "100%"
}));
const InputBaseComponent = styled$1("input", {
  name: "MuiInputBase",
  slot: "Input",
  overridesResolver: inputOverridesResolver
})(({
  theme,
  ownerState
}) => {
  const light2 = theme.palette.mode === "light";
  const placeholder = {
    color: "currentColor",
    opacity: light2 ? 0.42 : 0.5,
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shorter
    })
  };
  const placeholderHidden = {
    opacity: "0 !important"
  };
  const placeholderVisible = {
    opacity: light2 ? 0.42 : 0.5
  };
  return _extends$1({
    font: "inherit",
    letterSpacing: "inherit",
    color: "currentColor",
    padding: "4px 0 5px",
    border: 0,
    boxSizing: "content-box",
    background: "none",
    height: "1.4375em",
    margin: 0,
    WebkitTapHighlightColor: "transparent",
    display: "block",
    minWidth: 0,
    width: "100%",
    animationName: "mui-auto-fill-cancel",
    animationDuration: "10ms",
    "&::-webkit-input-placeholder": placeholder,
    "&::-moz-placeholder": placeholder,
    "&:-ms-input-placeholder": placeholder,
    "&::-ms-input-placeholder": placeholder,
    "&:focus": {
      outline: 0
    },
    "&:invalid": {
      boxShadow: "none"
    },
    "&::-webkit-search-decoration": {
      WebkitAppearance: "none"
    },
    [`label[data-shrink=false] + .${inputBaseClasses$1.formControl} &`]: {
      "&::-webkit-input-placeholder": placeholderHidden,
      "&::-moz-placeholder": placeholderHidden,
      "&:-ms-input-placeholder": placeholderHidden,
      "&::-ms-input-placeholder": placeholderHidden,
      "&:focus::-webkit-input-placeholder": placeholderVisible,
      "&:focus::-moz-placeholder": placeholderVisible,
      "&:focus:-ms-input-placeholder": placeholderVisible,
      "&:focus::-ms-input-placeholder": placeholderVisible
    },
    [`&.${inputBaseClasses$1.disabled}`]: {
      opacity: 1,
      WebkitTextFillColor: theme.palette.text.disabled
    },
    "&:-webkit-autofill": {
      animationDuration: "5000s",
      animationName: "mui-auto-fill"
    }
  }, ownerState.size === "small" && {
    paddingTop: 1
  }, ownerState.multiline && {
    height: "auto",
    resize: "none",
    padding: 0,
    paddingTop: 0
  }, ownerState.type === "search" && {
    MozAppearance: "textfield"
  });
});
const inputGlobalStyles = /* @__PURE__ */ jsxRuntime.exports.jsx(GlobalStyles, {
  styles: {
    "@keyframes mui-auto-fill": {
      from: {
        display: "block"
      }
    },
    "@keyframes mui-auto-fill-cancel": {
      from: {
        display: "block"
      }
    }
  }
});
const InputBase = /* @__PURE__ */ React.forwardRef(function InputBase2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiInputBase"
  });
  const {
    "aria-describedby": ariaDescribedby,
    autoComplete,
    autoFocus,
    className,
    components = {},
    componentsProps = {},
    defaultValue,
    disabled,
    disableInjectingGlobalStyles,
    endAdornment,
    fullWidth = false,
    id,
    inputComponent = "input",
    inputProps: inputPropsProp = {},
    inputRef: inputRefProp,
    maxRows,
    minRows,
    multiline = false,
    name,
    onBlur,
    onChange,
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    placeholder,
    readOnly,
    renderSuffix,
    rows,
    startAdornment,
    type = "text",
    value: valueProp
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$5);
  const value = inputPropsProp.value != null ? inputPropsProp.value : valueProp;
  const {
    current: isControlled
  } = React.useRef(value != null);
  const inputRef = React.useRef();
  const handleInputRefWarning = React.useCallback((instance) => {
  }, []);
  const handleInputPropsRefProp = useForkRef(inputPropsProp.ref, handleInputRefWarning);
  const handleInputRefProp = useForkRef(inputRefProp, handleInputPropsRefProp);
  const handleInputRef = useForkRef(inputRef, handleInputRefProp);
  const [focused, setFocused] = React.useState(false);
  const muiFormControl = useFormControl();
  const fcs = formControlState({
    props,
    muiFormControl,
    states: ["color", "disabled", "error", "hiddenLabel", "size", "required", "filled"]
  });
  fcs.focused = muiFormControl ? muiFormControl.focused : focused;
  React.useEffect(() => {
    if (!muiFormControl && disabled && focused) {
      setFocused(false);
      if (onBlur) {
        onBlur();
      }
    }
  }, [muiFormControl, disabled, focused, onBlur]);
  const onFilled = muiFormControl && muiFormControl.onFilled;
  const onEmpty = muiFormControl && muiFormControl.onEmpty;
  const checkDirty = React.useCallback((obj) => {
    if (isFilled(obj)) {
      if (onFilled) {
        onFilled();
      }
    } else if (onEmpty) {
      onEmpty();
    }
  }, [onFilled, onEmpty]);
  useEnhancedEffect$1(() => {
    if (isControlled) {
      checkDirty({
        value
      });
    }
  }, [value, checkDirty, isControlled]);
  const handleFocus = (event) => {
    if (fcs.disabled) {
      event.stopPropagation();
      return;
    }
    if (onFocus) {
      onFocus(event);
    }
    if (inputPropsProp.onFocus) {
      inputPropsProp.onFocus(event);
    }
    if (muiFormControl && muiFormControl.onFocus) {
      muiFormControl.onFocus(event);
    } else {
      setFocused(true);
    }
  };
  const handleBlur = (event) => {
    if (onBlur) {
      onBlur(event);
    }
    if (inputPropsProp.onBlur) {
      inputPropsProp.onBlur(event);
    }
    if (muiFormControl && muiFormControl.onBlur) {
      muiFormControl.onBlur(event);
    } else {
      setFocused(false);
    }
  };
  const handleChange = (event, ...args) => {
    if (!isControlled) {
      const element = event.target || inputRef.current;
      if (element == null) {
        throw new Error(formatMuiErrorMessage(1));
      }
      checkDirty({
        value: element.value
      });
    }
    if (inputPropsProp.onChange) {
      inputPropsProp.onChange(event, ...args);
    }
    if (onChange) {
      onChange(event, ...args);
    }
  };
  React.useEffect(() => {
    checkDirty(inputRef.current);
  }, []);
  const handleClick = (event) => {
    if (inputRef.current && event.currentTarget === event.target) {
      inputRef.current.focus();
    }
    if (onClick) {
      onClick(event);
    }
  };
  let InputComponent = inputComponent;
  let inputProps = inputPropsProp;
  if (multiline && InputComponent === "input") {
    if (rows) {
      inputProps = _extends$1({
        type: void 0,
        minRows: rows,
        maxRows: rows
      }, inputProps);
    } else {
      inputProps = _extends$1({
        type: void 0,
        maxRows,
        minRows
      }, inputProps);
    }
    InputComponent = TextareaAutosize$1;
  }
  const handleAutoFill = (event) => {
    checkDirty(event.animationName === "mui-auto-fill-cancel" ? inputRef.current : {
      value: "x"
    });
  };
  React.useEffect(() => {
    if (muiFormControl) {
      muiFormControl.setAdornedStart(Boolean(startAdornment));
    }
  }, [muiFormControl, startAdornment]);
  const ownerState = _extends$1({}, props, {
    color: fcs.color || "primary",
    disabled: fcs.disabled,
    endAdornment,
    error: fcs.error,
    focused: fcs.focused,
    formControl: muiFormControl,
    fullWidth,
    hiddenLabel: fcs.hiddenLabel,
    multiline,
    size: fcs.size,
    startAdornment,
    type
  });
  const classes = useUtilityClasses$4(ownerState);
  const Root = components.Root || InputBaseRoot;
  const rootProps = componentsProps.root || {};
  const Input = components.Input || InputBaseComponent;
  inputProps = _extends$1({}, inputProps, componentsProps.input);
  return /* @__PURE__ */ jsxRuntime.exports.jsxs(React.Fragment, {
    children: [!disableInjectingGlobalStyles && inputGlobalStyles, /* @__PURE__ */ jsxRuntime.exports.jsxs(Root, _extends$1({}, rootProps, !isHostComponent(Root) && {
      ownerState: _extends$1({}, ownerState, rootProps.ownerState)
    }, {
      ref,
      onClick: handleClick
    }, other, {
      className: clsx(classes.root, rootProps.className, className),
      children: [startAdornment, /* @__PURE__ */ jsxRuntime.exports.jsx(FormControlContext$1.Provider, {
        value: null,
        children: /* @__PURE__ */ jsxRuntime.exports.jsx(Input, _extends$1({
          ownerState,
          "aria-invalid": fcs.error,
          "aria-describedby": ariaDescribedby,
          autoComplete,
          autoFocus,
          defaultValue,
          disabled: fcs.disabled,
          id,
          onAnimationStart: handleAutoFill,
          name,
          placeholder,
          readOnly,
          required: fcs.required,
          rows,
          value,
          onKeyDown,
          onKeyUp,
          type
        }, inputProps, !isHostComponent(Input) && {
          as: InputComponent,
          ownerState: _extends$1({}, ownerState, inputProps.ownerState)
        }, {
          ref: handleInputRef,
          className: clsx(classes.input, inputProps.className),
          onBlur: handleBlur,
          onChange: handleChange,
          onFocus: handleFocus
        }))
      }), endAdornment, renderSuffix ? renderSuffix(_extends$1({}, fcs, {
        startAdornment
      })) : null]
    }))]
  });
});
var MuiInputBase = InputBase;
function getTabUtilityClass(slot) {
  return generateUtilityClass("MuiTab", slot);
}
const tabClasses = generateUtilityClasses("MuiTab", ["root", "labelIcon", "textColorInherit", "textColorPrimary", "textColorSecondary", "selected", "disabled", "fullWidth", "wrapped", "iconWrapper"]);
var tabClasses$1 = tabClasses;
const _excluded$4 = ["className", "disabled", "disableFocusRipple", "fullWidth", "icon", "iconPosition", "indicator", "label", "onChange", "onClick", "onFocus", "selected", "selectionFollowsFocus", "textColor", "value", "wrapped"];
const useUtilityClasses$3 = (ownerState) => {
  const {
    classes,
    textColor,
    fullWidth,
    wrapped,
    icon,
    label,
    selected,
    disabled
  } = ownerState;
  const slots = {
    root: ["root", icon && label && "labelIcon", `textColor${capitalize(textColor)}`, fullWidth && "fullWidth", wrapped && "wrapped", selected && "selected", disabled && "disabled"],
    iconWrapper: ["iconWrapper"]
  };
  return composeClasses(slots, getTabUtilityClass, classes);
};
const TabRoot = styled$1(ButtonBase$1, {
  name: "MuiTab",
  slot: "Root",
  overridesResolver: (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.root, ownerState.label && ownerState.icon && styles2.labelIcon, styles2[`textColor${capitalize(ownerState.textColor)}`], ownerState.fullWidth && styles2.fullWidth, ownerState.wrapped && styles2.wrapped];
  }
})(({
  theme,
  ownerState
}) => _extends$1({}, theme.typography.button, {
  maxWidth: 360,
  minWidth: 90,
  position: "relative",
  minHeight: 48,
  flexShrink: 0,
  padding: "12px 16px",
  overflow: "hidden",
  whiteSpace: "normal",
  textAlign: "center"
}, ownerState.label && {
  flexDirection: ownerState.iconPosition === "top" || ownerState.iconPosition === "bottom" ? "column" : "row"
}, {
  lineHeight: 1.25
}, ownerState.icon && ownerState.label && {
  minHeight: 72,
  paddingTop: 9,
  paddingBottom: 9,
  [`& > .${tabClasses$1.iconWrapper}`]: _extends$1({}, ownerState.iconPosition === "top" && {
    marginBottom: 6
  }, ownerState.iconPosition === "bottom" && {
    marginTop: 6
  }, ownerState.iconPosition === "start" && {
    marginRight: theme.spacing(1)
  }, ownerState.iconPosition === "end" && {
    marginLeft: theme.spacing(1)
  })
}, ownerState.textColor === "inherit" && {
  color: "inherit",
  opacity: 0.6,
  [`&.${tabClasses$1.selected}`]: {
    opacity: 1
  },
  [`&.${tabClasses$1.disabled}`]: {
    opacity: theme.palette.action.disabledOpacity
  }
}, ownerState.textColor === "primary" && {
  color: theme.palette.text.secondary,
  [`&.${tabClasses$1.selected}`]: {
    color: theme.palette.primary.main
  },
  [`&.${tabClasses$1.disabled}`]: {
    color: theme.palette.text.disabled
  }
}, ownerState.textColor === "secondary" && {
  color: theme.palette.text.secondary,
  [`&.${tabClasses$1.selected}`]: {
    color: theme.palette.secondary.main
  },
  [`&.${tabClasses$1.disabled}`]: {
    color: theme.palette.text.disabled
  }
}, ownerState.fullWidth && {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: 0,
  maxWidth: "none"
}, ownerState.wrapped && {
  fontSize: theme.typography.pxToRem(12)
}));
const Tab = /* @__PURE__ */ React.forwardRef(function Tab2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiTab"
  });
  const {
    className,
    disabled = false,
    disableFocusRipple = false,
    fullWidth,
    icon: iconProp,
    iconPosition = "top",
    indicator,
    label,
    onChange,
    onClick,
    onFocus,
    selected,
    selectionFollowsFocus,
    textColor = "inherit",
    value,
    wrapped = false
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$4);
  const ownerState = _extends$1({}, props, {
    disabled,
    disableFocusRipple,
    selected,
    icon: !!iconProp,
    iconPosition,
    label: !!label,
    fullWidth,
    textColor,
    wrapped
  });
  const classes = useUtilityClasses$3(ownerState);
  const icon = iconProp && label && /* @__PURE__ */ React.isValidElement(iconProp) ? /* @__PURE__ */ React.cloneElement(iconProp, {
    className: clsx(classes.iconWrapper, iconProp.props.className)
  }) : iconProp;
  const handleClick = (event) => {
    if (!selected && onChange) {
      onChange(event, value);
    }
    if (onClick) {
      onClick(event);
    }
  };
  const handleFocus = (event) => {
    if (selectionFollowsFocus && !selected && onChange) {
      onChange(event, value);
    }
    if (onFocus) {
      onFocus(event);
    }
  };
  return /* @__PURE__ */ jsxRuntime.exports.jsxs(TabRoot, _extends$1({
    focusRipple: !disableFocusRipple,
    className: clsx(classes.root, className),
    ref,
    role: "tab",
    "aria-selected": selected,
    disabled,
    onClick: handleClick,
    onFocus: handleFocus,
    ownerState,
    tabIndex: selected ? 0 : -1
  }, other, {
    children: [iconPosition === "top" || iconPosition === "start" ? /* @__PURE__ */ jsxRuntime.exports.jsxs(React.Fragment, {
      children: [icon, label]
    }) : /* @__PURE__ */ jsxRuntime.exports.jsxs(React.Fragment, {
      children: [label, icon]
    }), indicator]
  }));
});
var Tab$1 = Tab;
function getToolbarUtilityClass(slot) {
  return generateUtilityClass("MuiToolbar", slot);
}
generateUtilityClasses("MuiToolbar", ["root", "gutters", "regular", "dense"]);
const _excluded$3 = ["className", "component", "disableGutters", "variant"];
const useUtilityClasses$2 = (ownerState) => {
  const {
    classes,
    disableGutters,
    variant
  } = ownerState;
  const slots = {
    root: ["root", !disableGutters && "gutters", variant]
  };
  return composeClasses(slots, getToolbarUtilityClass, classes);
};
const ToolbarRoot = styled$1("div", {
  name: "MuiToolbar",
  slot: "Root",
  overridesResolver: (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.root, !ownerState.disableGutters && styles2.gutters, styles2[ownerState.variant]];
  }
})(({
  theme,
  ownerState
}) => _extends$1({
  position: "relative",
  display: "flex",
  alignItems: "center"
}, !ownerState.disableGutters && {
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}, ownerState.variant === "dense" && {
  minHeight: 48
}), ({
  theme,
  ownerState
}) => ownerState.variant === "regular" && theme.mixins.toolbar);
const Toolbar = /* @__PURE__ */ React.forwardRef(function Toolbar2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiToolbar"
  });
  const {
    className,
    component = "div",
    disableGutters = false,
    variant = "regular"
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$3);
  const ownerState = _extends$1({}, props, {
    component,
    disableGutters,
    variant
  });
  const classes = useUtilityClasses$2(ownerState);
  return /* @__PURE__ */ jsxRuntime.exports.jsx(ToolbarRoot, _extends$1({
    as: component,
    className: clsx(classes.root, className),
    ref,
    ownerState
  }, other));
});
var Toolbar$1 = Toolbar;
var KeyboardArrowLeft = createSvgIcon$1(/* @__PURE__ */ jsxRuntime.exports.jsx("path", {
  d: "M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"
}), "KeyboardArrowLeft");
var KeyboardArrowRight = createSvgIcon$1(/* @__PURE__ */ jsxRuntime.exports.jsx("path", {
  d: "M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"
}), "KeyboardArrowRight");
function easeInOutSin(time) {
  return (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2;
}
function animate(property, element, to, options = {}, cb = () => {
}) {
  const {
    ease = easeInOutSin,
    duration: duration2 = 300
  } = options;
  let start = null;
  const from2 = element[property];
  let cancelled = false;
  const cancel = () => {
    cancelled = true;
  };
  const step = (timestamp) => {
    if (cancelled) {
      cb(new Error("Animation cancelled"));
      return;
    }
    if (start === null) {
      start = timestamp;
    }
    const time = Math.min(1, (timestamp - start) / duration2);
    element[property] = ease(time) * (to - from2) + from2;
    if (time >= 1) {
      requestAnimationFrame(() => {
        cb(null);
      });
      return;
    }
    requestAnimationFrame(step);
  };
  if (from2 === to) {
    cb(new Error("Element already at target position"));
    return cancel;
  }
  requestAnimationFrame(step);
  return cancel;
}
const _excluded$2 = ["onChange"];
const styles = {
  width: 99,
  height: 99,
  position: "absolute",
  top: -9999,
  overflow: "scroll"
};
function ScrollbarSize(props) {
  const {
    onChange
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$2);
  const scrollbarHeight = React.useRef();
  const nodeRef = React.useRef(null);
  const setMeasurements = () => {
    scrollbarHeight.current = nodeRef.current.offsetHeight - nodeRef.current.clientHeight;
  };
  React.useEffect(() => {
    const handleResize = debounce(() => {
      const prevHeight = scrollbarHeight.current;
      setMeasurements();
      if (prevHeight !== scrollbarHeight.current) {
        onChange(scrollbarHeight.current);
      }
    });
    const containerWindow = ownerWindow(nodeRef.current);
    containerWindow.addEventListener("resize", handleResize);
    return () => {
      handleResize.clear();
      containerWindow.removeEventListener("resize", handleResize);
    };
  }, [onChange]);
  React.useEffect(() => {
    setMeasurements();
    onChange(scrollbarHeight.current);
  }, [onChange]);
  return /* @__PURE__ */ jsxRuntime.exports.jsx("div", _extends$1({
    style: styles,
    ref: nodeRef
  }, other));
}
function getTabScrollButtonUtilityClass(slot) {
  return generateUtilityClass("MuiTabScrollButton", slot);
}
const tabScrollButtonClasses = generateUtilityClasses("MuiTabScrollButton", ["root", "vertical", "horizontal", "disabled"]);
var tabScrollButtonClasses$1 = tabScrollButtonClasses;
var _KeyboardArrowLeft, _KeyboardArrowRight;
const _excluded$1 = ["className", "direction", "orientation", "disabled"];
const useUtilityClasses$1 = (ownerState) => {
  const {
    classes,
    orientation,
    disabled
  } = ownerState;
  const slots = {
    root: ["root", orientation, disabled && "disabled"]
  };
  return composeClasses(slots, getTabScrollButtonUtilityClass, classes);
};
const TabScrollButtonRoot = styled$1(ButtonBase$1, {
  name: "MuiTabScrollButton",
  slot: "Root",
  overridesResolver: (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.root, ownerState.orientation && styles2[ownerState.orientation]];
  }
})(({
  ownerState
}) => _extends$1({
  width: 40,
  flexShrink: 0,
  opacity: 0.8,
  [`&.${tabScrollButtonClasses$1.disabled}`]: {
    opacity: 0
  }
}, ownerState.orientation === "vertical" && {
  width: "100%",
  height: 40,
  "& svg": {
    transform: `rotate(${ownerState.isRtl ? -90 : 90}deg)`
  }
}));
const TabScrollButton = /* @__PURE__ */ React.forwardRef(function TabScrollButton2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiTabScrollButton"
  });
  const {
    className,
    direction
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded$1);
  const theme = useTheme();
  const isRtl = theme.direction === "rtl";
  const ownerState = _extends$1({
    isRtl
  }, props);
  const classes = useUtilityClasses$1(ownerState);
  return /* @__PURE__ */ jsxRuntime.exports.jsx(TabScrollButtonRoot, _extends$1({
    component: "div",
    className: clsx(classes.root, className),
    ref,
    role: null,
    ownerState,
    tabIndex: null
  }, other, {
    children: direction === "left" ? _KeyboardArrowLeft || (_KeyboardArrowLeft = /* @__PURE__ */ jsxRuntime.exports.jsx(KeyboardArrowLeft, {
      fontSize: "small"
    })) : _KeyboardArrowRight || (_KeyboardArrowRight = /* @__PURE__ */ jsxRuntime.exports.jsx(KeyboardArrowRight, {
      fontSize: "small"
    }))
  }));
});
var TabScrollButton$1 = TabScrollButton;
function getTabsUtilityClass(slot) {
  return generateUtilityClass("MuiTabs", slot);
}
const tabsClasses = generateUtilityClasses("MuiTabs", ["root", "vertical", "flexContainer", "flexContainerVertical", "centered", "scroller", "fixed", "scrollableX", "scrollableY", "hideScrollbar", "scrollButtons", "scrollButtonsHideMobile", "indicator"]);
var tabsClasses$1 = tabsClasses;
const _excluded = ["aria-label", "aria-labelledby", "action", "centered", "children", "className", "component", "allowScrollButtonsMobile", "indicatorColor", "onChange", "orientation", "ScrollButtonComponent", "scrollButtons", "selectionFollowsFocus", "TabIndicatorProps", "TabScrollButtonProps", "textColor", "value", "variant", "visibleScrollbar"];
const nextItem = (list, item) => {
  if (list === item) {
    return list.firstChild;
  }
  if (item && item.nextElementSibling) {
    return item.nextElementSibling;
  }
  return list.firstChild;
};
const previousItem = (list, item) => {
  if (list === item) {
    return list.lastChild;
  }
  if (item && item.previousElementSibling) {
    return item.previousElementSibling;
  }
  return list.lastChild;
};
const moveFocus = (list, currentFocus, traversalFunction) => {
  let wrappedOnce = false;
  let nextFocus = traversalFunction(list, currentFocus);
  while (nextFocus) {
    if (nextFocus === list.firstChild) {
      if (wrappedOnce) {
        return;
      }
      wrappedOnce = true;
    }
    const nextFocusDisabled = nextFocus.disabled || nextFocus.getAttribute("aria-disabled") === "true";
    if (!nextFocus.hasAttribute("tabindex") || nextFocusDisabled) {
      nextFocus = traversalFunction(list, nextFocus);
    } else {
      nextFocus.focus();
      return;
    }
  }
};
const useUtilityClasses = (ownerState) => {
  const {
    vertical,
    fixed,
    hideScrollbar,
    scrollableX,
    scrollableY,
    centered,
    scrollButtonsHideMobile,
    classes
  } = ownerState;
  const slots = {
    root: ["root", vertical && "vertical"],
    scroller: ["scroller", fixed && "fixed", hideScrollbar && "hideScrollbar", scrollableX && "scrollableX", scrollableY && "scrollableY"],
    flexContainer: ["flexContainer", vertical && "flexContainerVertical", centered && "centered"],
    indicator: ["indicator"],
    scrollButtons: ["scrollButtons", scrollButtonsHideMobile && "scrollButtonsHideMobile"],
    scrollableX: [scrollableX && "scrollableX"],
    hideScrollbar: [hideScrollbar && "hideScrollbar"]
  };
  return composeClasses(slots, getTabsUtilityClass, classes);
};
const TabsRoot = styled$1("div", {
  name: "MuiTabs",
  slot: "Root",
  overridesResolver: (props, styles2) => {
    const {
      ownerState
    } = props;
    return [{
      [`& .${tabsClasses$1.scrollButtons}`]: styles2.scrollButtons
    }, {
      [`& .${tabsClasses$1.scrollButtons}`]: ownerState.scrollButtonsHideMobile && styles2.scrollButtonsHideMobile
    }, styles2.root, ownerState.vertical && styles2.vertical];
  }
})(({
  ownerState,
  theme
}) => _extends$1({
  overflow: "hidden",
  minHeight: 48,
  WebkitOverflowScrolling: "touch",
  display: "flex"
}, ownerState.vertical && {
  flexDirection: "column"
}, ownerState.scrollButtonsHideMobile && {
  [`& .${tabsClasses$1.scrollButtons}`]: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  }
}));
const TabsScroller = styled$1("div", {
  name: "MuiTabs",
  slot: "Scroller",
  overridesResolver: (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.scroller, ownerState.fixed && styles2.fixed, ownerState.hideScrollbar && styles2.hideScrollbar, ownerState.scrollableX && styles2.scrollableX, ownerState.scrollableY && styles2.scrollableY];
  }
})(({
  ownerState
}) => _extends$1({
  position: "relative",
  display: "inline-block",
  flex: "1 1 auto",
  whiteSpace: "nowrap"
}, ownerState.fixed && {
  overflowX: "hidden",
  width: "100%"
}, ownerState.hideScrollbar && {
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none"
  }
}, ownerState.scrollableX && {
  overflowX: "auto",
  overflowY: "hidden"
}, ownerState.scrollableY && {
  overflowY: "auto",
  overflowX: "hidden"
}));
const FlexContainer = styled$1("div", {
  name: "MuiTabs",
  slot: "FlexContainer",
  overridesResolver: (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.flexContainer, ownerState.vertical && styles2.flexContainerVertical, ownerState.centered && styles2.centered];
  }
})(({
  ownerState
}) => _extends$1({
  display: "flex"
}, ownerState.vertical && {
  flexDirection: "column"
}, ownerState.centered && {
  justifyContent: "center"
}));
const TabsIndicator = styled$1("span", {
  name: "MuiTabs",
  slot: "Indicator",
  overridesResolver: (props, styles2) => styles2.indicator
})(({
  ownerState,
  theme
}) => _extends$1({
  position: "absolute",
  height: 2,
  bottom: 0,
  width: "100%",
  transition: theme.transitions.create()
}, ownerState.indicatorColor === "primary" && {
  backgroundColor: theme.palette.primary.main
}, ownerState.indicatorColor === "secondary" && {
  backgroundColor: theme.palette.secondary.main
}, ownerState.vertical && {
  height: "100%",
  width: 2,
  right: 0
}));
const TabsScrollbarSize = styled$1(ScrollbarSize, {
  name: "MuiTabs",
  slot: "ScrollbarSize"
})({
  overflowX: "auto",
  overflowY: "hidden",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none"
  }
});
const defaultIndicatorStyle = {};
const Tabs = /* @__PURE__ */ React.forwardRef(function Tabs2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiTabs"
  });
  const theme = useTheme();
  const isRtl = theme.direction === "rtl";
  const {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    action,
    centered = false,
    children: childrenProp,
    className,
    component = "div",
    allowScrollButtonsMobile = false,
    indicatorColor = "primary",
    onChange,
    orientation = "horizontal",
    ScrollButtonComponent = TabScrollButton$1,
    scrollButtons = "auto",
    selectionFollowsFocus,
    TabIndicatorProps = {},
    TabScrollButtonProps = {},
    textColor = "primary",
    value,
    variant = "standard",
    visibleScrollbar = false
  } = props, other = _objectWithoutPropertiesLoose$1(props, _excluded);
  const scrollable = variant === "scrollable";
  const vertical = orientation === "vertical";
  const scrollStart = vertical ? "scrollTop" : "scrollLeft";
  const start = vertical ? "top" : "left";
  const end = vertical ? "bottom" : "right";
  const clientSize = vertical ? "clientHeight" : "clientWidth";
  const size = vertical ? "height" : "width";
  const ownerState = _extends$1({}, props, {
    component,
    allowScrollButtonsMobile,
    indicatorColor,
    orientation,
    vertical,
    scrollButtons,
    textColor,
    variant,
    visibleScrollbar,
    fixed: !scrollable,
    hideScrollbar: scrollable && !visibleScrollbar,
    scrollableX: scrollable && !vertical,
    scrollableY: scrollable && vertical,
    centered: centered && !scrollable,
    scrollButtonsHideMobile: !allowScrollButtonsMobile
  });
  const classes = useUtilityClasses(ownerState);
  const [mounted, setMounted] = React.useState(false);
  const [indicatorStyle, setIndicatorStyle] = React.useState(defaultIndicatorStyle);
  const [displayScroll, setDisplayScroll] = React.useState({
    start: false,
    end: false
  });
  const [scrollerStyle, setScrollerStyle] = React.useState({
    overflow: "hidden",
    scrollbarWidth: 0
  });
  const valueToIndex = /* @__PURE__ */ new Map();
  const tabsRef = React.useRef(null);
  const tabListRef = React.useRef(null);
  const getTabsMeta = () => {
    const tabsNode = tabsRef.current;
    let tabsMeta;
    if (tabsNode) {
      const rect = tabsNode.getBoundingClientRect();
      tabsMeta = {
        clientWidth: tabsNode.clientWidth,
        scrollLeft: tabsNode.scrollLeft,
        scrollTop: tabsNode.scrollTop,
        scrollLeftNormalized: getNormalizedScrollLeft(tabsNode, theme.direction),
        scrollWidth: tabsNode.scrollWidth,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      };
    }
    let tabMeta;
    if (tabsNode && value !== false) {
      const children2 = tabListRef.current.children;
      if (children2.length > 0) {
        const tab = children2[valueToIndex.get(value)];
        tabMeta = tab ? tab.getBoundingClientRect() : null;
      }
    }
    return {
      tabsMeta,
      tabMeta
    };
  };
  const updateIndicatorState = useEventCallback$1(() => {
    const {
      tabsMeta,
      tabMeta
    } = getTabsMeta();
    let startValue = 0;
    let startIndicator;
    if (vertical) {
      startIndicator = "top";
      if (tabMeta && tabsMeta) {
        startValue = tabMeta.top - tabsMeta.top + tabsMeta.scrollTop;
      }
    } else {
      startIndicator = isRtl ? "right" : "left";
      if (tabMeta && tabsMeta) {
        const correction = isRtl ? tabsMeta.scrollLeftNormalized + tabsMeta.clientWidth - tabsMeta.scrollWidth : tabsMeta.scrollLeft;
        startValue = (isRtl ? -1 : 1) * (tabMeta[startIndicator] - tabsMeta[startIndicator] + correction);
      }
    }
    const newIndicatorStyle = {
      [startIndicator]: startValue,
      [size]: tabMeta ? tabMeta[size] : 0
    };
    if (isNaN(indicatorStyle[startIndicator]) || isNaN(indicatorStyle[size])) {
      setIndicatorStyle(newIndicatorStyle);
    } else {
      const dStart = Math.abs(indicatorStyle[startIndicator] - newIndicatorStyle[startIndicator]);
      const dSize = Math.abs(indicatorStyle[size] - newIndicatorStyle[size]);
      if (dStart >= 1 || dSize >= 1) {
        setIndicatorStyle(newIndicatorStyle);
      }
    }
  });
  const scroll = (scrollValue, {
    animation = true
  } = {}) => {
    if (animation) {
      animate(scrollStart, tabsRef.current, scrollValue, {
        duration: theme.transitions.duration.standard
      });
    } else {
      tabsRef.current[scrollStart] = scrollValue;
    }
  };
  const moveTabsScroll = (delta) => {
    let scrollValue = tabsRef.current[scrollStart];
    if (vertical) {
      scrollValue += delta;
    } else {
      scrollValue += delta * (isRtl ? -1 : 1);
      scrollValue *= isRtl && detectScrollType() === "reverse" ? -1 : 1;
    }
    scroll(scrollValue);
  };
  const getScrollSize = () => {
    const containerSize = tabsRef.current[clientSize];
    let totalSize = 0;
    const children2 = Array.from(tabListRef.current.children);
    for (let i = 0; i < children2.length; i += 1) {
      const tab = children2[i];
      if (totalSize + tab[clientSize] > containerSize) {
        break;
      }
      totalSize += tab[clientSize];
    }
    return totalSize;
  };
  const handleStartScrollClick = () => {
    moveTabsScroll(-1 * getScrollSize());
  };
  const handleEndScrollClick = () => {
    moveTabsScroll(getScrollSize());
  };
  const handleScrollbarSizeChange = React.useCallback((scrollbarWidth) => {
    setScrollerStyle({
      overflow: null,
      scrollbarWidth
    });
  }, []);
  const getConditionalElements = () => {
    const conditionalElements2 = {};
    conditionalElements2.scrollbarSizeListener = scrollable ? /* @__PURE__ */ jsxRuntime.exports.jsx(TabsScrollbarSize, {
      onChange: handleScrollbarSizeChange,
      className: clsx(classes.scrollableX, classes.hideScrollbar)
    }) : null;
    const scrollButtonsActive = displayScroll.start || displayScroll.end;
    const showScrollButtons = scrollable && (scrollButtons === "auto" && scrollButtonsActive || scrollButtons === true);
    conditionalElements2.scrollButtonStart = showScrollButtons ? /* @__PURE__ */ jsxRuntime.exports.jsx(ScrollButtonComponent, _extends$1({
      orientation,
      direction: isRtl ? "right" : "left",
      onClick: handleStartScrollClick,
      disabled: !displayScroll.start
    }, TabScrollButtonProps, {
      className: clsx(classes.scrollButtons, TabScrollButtonProps.className)
    })) : null;
    conditionalElements2.scrollButtonEnd = showScrollButtons ? /* @__PURE__ */ jsxRuntime.exports.jsx(ScrollButtonComponent, _extends$1({
      orientation,
      direction: isRtl ? "left" : "right",
      onClick: handleEndScrollClick,
      disabled: !displayScroll.end
    }, TabScrollButtonProps, {
      className: clsx(classes.scrollButtons, TabScrollButtonProps.className)
    })) : null;
    return conditionalElements2;
  };
  const scrollSelectedIntoView = useEventCallback$1((animation) => {
    const {
      tabsMeta,
      tabMeta
    } = getTabsMeta();
    if (!tabMeta || !tabsMeta) {
      return;
    }
    if (tabMeta[start] < tabsMeta[start]) {
      const nextScrollStart = tabsMeta[scrollStart] + (tabMeta[start] - tabsMeta[start]);
      scroll(nextScrollStart, {
        animation
      });
    } else if (tabMeta[end] > tabsMeta[end]) {
      const nextScrollStart = tabsMeta[scrollStart] + (tabMeta[end] - tabsMeta[end]);
      scroll(nextScrollStart, {
        animation
      });
    }
  });
  const updateScrollButtonState = useEventCallback$1(() => {
    if (scrollable && scrollButtons !== false) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollWidth,
        clientWidth
      } = tabsRef.current;
      let showStartScroll;
      let showEndScroll;
      if (vertical) {
        showStartScroll = scrollTop > 1;
        showEndScroll = scrollTop < scrollHeight - clientHeight - 1;
      } else {
        const scrollLeft = getNormalizedScrollLeft(tabsRef.current, theme.direction);
        showStartScroll = isRtl ? scrollLeft < scrollWidth - clientWidth - 1 : scrollLeft > 1;
        showEndScroll = !isRtl ? scrollLeft < scrollWidth - clientWidth - 1 : scrollLeft > 1;
      }
      if (showStartScroll !== displayScroll.start || showEndScroll !== displayScroll.end) {
        setDisplayScroll({
          start: showStartScroll,
          end: showEndScroll
        });
      }
    }
  });
  React.useEffect(() => {
    const handleResize = debounce(() => {
      updateIndicatorState();
      updateScrollButtonState();
    });
    const win = ownerWindow(tabsRef.current);
    win.addEventListener("resize", handleResize);
    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(handleResize);
      Array.from(tabListRef.current.children).forEach((child) => {
        resizeObserver.observe(child);
      });
    }
    return () => {
      handleResize.clear();
      win.removeEventListener("resize", handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateIndicatorState, updateScrollButtonState]);
  const handleTabsScroll = React.useMemo(() => debounce(() => {
    updateScrollButtonState();
  }), [updateScrollButtonState]);
  React.useEffect(() => {
    return () => {
      handleTabsScroll.clear();
    };
  }, [handleTabsScroll]);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  React.useEffect(() => {
    updateIndicatorState();
    updateScrollButtonState();
  });
  React.useEffect(() => {
    scrollSelectedIntoView(defaultIndicatorStyle !== indicatorStyle);
  }, [scrollSelectedIntoView, indicatorStyle]);
  React.useImperativeHandle(action, () => ({
    updateIndicator: updateIndicatorState,
    updateScrollButtons: updateScrollButtonState
  }), [updateIndicatorState, updateScrollButtonState]);
  const indicator = /* @__PURE__ */ jsxRuntime.exports.jsx(TabsIndicator, _extends$1({}, TabIndicatorProps, {
    className: clsx(classes.indicator, TabIndicatorProps.className),
    ownerState,
    style: _extends$1({}, indicatorStyle, TabIndicatorProps.style)
  }));
  let childIndex = 0;
  const children = React.Children.map(childrenProp, (child) => {
    if (!/* @__PURE__ */ React.isValidElement(child)) {
      return null;
    }
    const childValue = child.props.value === void 0 ? childIndex : child.props.value;
    valueToIndex.set(childValue, childIndex);
    const selected = childValue === value;
    childIndex += 1;
    return /* @__PURE__ */ React.cloneElement(child, _extends$1({
      fullWidth: variant === "fullWidth",
      indicator: selected && !mounted && indicator,
      selected,
      selectionFollowsFocus,
      onChange,
      textColor,
      value: childValue
    }, childIndex === 1 && value === false && !child.props.tabIndex ? {
      tabIndex: 0
    } : {}));
  });
  const handleKeyDown2 = (event) => {
    const list = tabListRef.current;
    const currentFocus = ownerDocument(list).activeElement;
    const role = currentFocus.getAttribute("role");
    if (role !== "tab") {
      return;
    }
    let previousItemKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    let nextItemKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    if (orientation === "horizontal" && isRtl) {
      previousItemKey = "ArrowRight";
      nextItemKey = "ArrowLeft";
    }
    switch (event.key) {
      case previousItemKey:
        event.preventDefault();
        moveFocus(list, currentFocus, previousItem);
        break;
      case nextItemKey:
        event.preventDefault();
        moveFocus(list, currentFocus, nextItem);
        break;
      case "Home":
        event.preventDefault();
        moveFocus(list, null, nextItem);
        break;
      case "End":
        event.preventDefault();
        moveFocus(list, null, previousItem);
        break;
    }
  };
  const conditionalElements = getConditionalElements();
  return /* @__PURE__ */ jsxRuntime.exports.jsxs(TabsRoot, _extends$1({
    className: clsx(classes.root, className),
    ownerState,
    ref,
    as: component
  }, other, {
    children: [conditionalElements.scrollButtonStart, conditionalElements.scrollbarSizeListener, /* @__PURE__ */ jsxRuntime.exports.jsxs(TabsScroller, {
      className: classes.scroller,
      ownerState,
      style: {
        overflow: scrollerStyle.overflow,
        [vertical ? `margin${isRtl ? "Left" : "Right"}` : "marginBottom"]: visibleScrollbar ? void 0 : -scrollerStyle.scrollbarWidth
      },
      ref: tabsRef,
      onScroll: handleTabsScroll,
      children: [/* @__PURE__ */ jsxRuntime.exports.jsx(FlexContainer, {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-orientation": orientation === "vertical" ? "vertical" : null,
        className: classes.flexContainer,
        ownerState,
        onKeyDown: handleKeyDown2,
        ref: tabListRef,
        role: "tablist",
        children
      }), mounted && indicator]
    }), conditionalElements.scrollButtonEnd]
  }));
});
var Tabs$1 = Tabs;
var Search$1 = {};
var interopRequireDefault = { exports: {} };
(function(module2) {
  function _interopRequireDefault2(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }
  module2.exports = _interopRequireDefault2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
})(interopRequireDefault);
var createSvgIcon = {};
var require$$0 = /* @__PURE__ */ getAugmentedNamespace(utils);
(function(exports2) {
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  Object.defineProperty(exports2, "default", {
    enumerable: true,
    get: function() {
      return _utils.createSvgIcon;
    }
  });
  var _utils = require$$0;
})(createSvgIcon);
var _interopRequireDefault = interopRequireDefault.exports;
Object.defineProperty(Search$1, "__esModule", {
  value: true
});
var default_1 = Search$1.default = void 0;
var _createSvgIcon = _interopRequireDefault(createSvgIcon);
var _jsxRuntime = jsxRuntime.exports;
var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ (0, _jsxRuntime.jsx)("path", {
  d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
}), "Search");
default_1 = Search$1.default = _default;
const Search = styled$1("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto"
  }
}));
const SearchIconWrapper = styled$1("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}));
const StyledInputBase = styled$1(MuiInputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch"
    }
  }
}));
const ConfigrAppBar = (props) => {
  var _a;
  console.log("Rendering appbar. searchValue=" + props.searchValue);
  return /* @__PURE__ */ jsx(Box$1, {
    sx: { flexGrow: 1 }
  }, /* @__PURE__ */ jsx(AppBar$1, {
    position: "static"
  }, /* @__PURE__ */ jsx(Toolbar$1, null, /* @__PURE__ */ jsx(Typography$1, {
    variant: "h6",
    noWrap: true,
    component: "div",
    sx: { display: { xs: "none", sm: "block" } }
  }, props.label), /* @__PURE__ */ jsx(Search, null, /* @__PURE__ */ jsx(SearchIconWrapper, null, /* @__PURE__ */ jsx(default_1, null)), /* @__PURE__ */ jsx(StyledInputBase, {
    value: (_a = props.searchValue) != null ? _a : "",
    placeholder: "Search\u2026",
    inputProps: { "aria-label": "search" },
    onChange: (event) => props.setSearchString(event.target.value)
  })))));
};
var freeGlobal$3 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal$3;
var freeGlobal$2 = _freeGlobal;
var freeSelf$1 = typeof self == "object" && self && self.Object === Object && self;
var root$5 = freeGlobal$2 || freeSelf$1 || Function("return this")();
var _root = root$5;
var root$4 = _root;
var Symbol$6 = root$4.Symbol;
var _Symbol = Symbol$6;
var Symbol$5 = _Symbol;
var objectProto$i = Object.prototype;
var hasOwnProperty$e = objectProto$i.hasOwnProperty;
var nativeObjectToString$3 = objectProto$i.toString;
var symToStringTag$3 = Symbol$5 ? Symbol$5.toStringTag : void 0;
function getRawTag$2(value) {
  var isOwn = hasOwnProperty$e.call(value, symToStringTag$3), tag = value[symToStringTag$3];
  try {
    value[symToStringTag$3] = void 0;
    var unmasked = true;
  } catch (e2) {
  }
  var result = nativeObjectToString$3.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$3] = tag;
    } else {
      delete value[symToStringTag$3];
    }
  }
  return result;
}
var _getRawTag = getRawTag$2;
var objectProto$h = Object.prototype;
var nativeObjectToString$2 = objectProto$h.toString;
function objectToString$2(value) {
  return nativeObjectToString$2.call(value);
}
var _objectToString = objectToString$2;
var Symbol$4 = _Symbol, getRawTag$1 = _getRawTag, objectToString$1 = _objectToString;
var nullTag$1 = "[object Null]", undefinedTag$1 = "[object Undefined]";
var symToStringTag$2 = Symbol$4 ? Symbol$4.toStringTag : void 0;
function baseGetTag$2(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag$1 : nullTag$1;
  }
  return symToStringTag$2 && symToStringTag$2 in Object(value) ? getRawTag$1(value) : objectToString$1(value);
}
var _baseGetTag = baseGetTag$2;
function isObject$4(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_1 = isObject$4;
var baseGetTag$1 = _baseGetTag, isObject$3 = isObject_1;
var asyncTag$1 = "[object AsyncFunction]", funcTag$3 = "[object Function]", genTag$2 = "[object GeneratorFunction]", proxyTag$1 = "[object Proxy]";
function isFunction$3(value) {
  if (!isObject$3(value)) {
    return false;
  }
  var tag = baseGetTag$1(value);
  return tag == funcTag$3 || tag == genTag$2 || tag == asyncTag$1 || tag == proxyTag$1;
}
var isFunction_1 = isFunction$3;
var root$3 = _root;
var coreJsData$3 = root$3["__core-js_shared__"];
var _coreJsData = coreJsData$3;
var coreJsData$2 = _coreJsData;
var maskSrcKey$1 = function() {
  var uid = /[^.]+$/.exec(coreJsData$2 && coreJsData$2.keys && coreJsData$2.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked$2(func) {
  return !!maskSrcKey$1 && maskSrcKey$1 in func;
}
var _isMasked = isMasked$2;
var funcProto$4 = Function.prototype;
var funcToString$4 = funcProto$4.toString;
function toSource$2(func) {
  if (func != null) {
    try {
      return funcToString$4.call(func);
    } catch (e2) {
    }
    try {
      return func + "";
    } catch (e2) {
    }
  }
  return "";
}
var _toSource = toSource$2;
var isFunction$2 = isFunction_1, isMasked$1 = _isMasked, isObject$2 = isObject_1, toSource$1 = _toSource;
var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor$1 = /^\[object .+?Constructor\]$/;
var funcProto$3 = Function.prototype, objectProto$g = Object.prototype;
var funcToString$3 = funcProto$3.toString;
var hasOwnProperty$d = objectProto$g.hasOwnProperty;
var reIsNative$1 = RegExp("^" + funcToString$3.call(hasOwnProperty$d).replace(reRegExpChar$1, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
function baseIsNative$2(value) {
  if (!isObject$2(value) || isMasked$1(value)) {
    return false;
  }
  var pattern = isFunction$2(value) ? reIsNative$1 : reIsHostCtor$1;
  return pattern.test(toSource$1(value));
}
var _baseIsNative = baseIsNative$2;
function getValue$2(object, key) {
  return object == null ? void 0 : object[key];
}
var _getValue = getValue$2;
var baseIsNative$1 = _baseIsNative, getValue$1 = _getValue;
function getNative$3(object, key) {
  var value = getValue$1(object, key);
  return baseIsNative$1(value) ? value : void 0;
}
var _getNative = getNative$3;
var getNative$2 = _getNative;
var nativeCreate$6 = getNative$2(Object, "create");
var _nativeCreate = nativeCreate$6;
var nativeCreate$5 = _nativeCreate;
function hashClear$2() {
  this.__data__ = nativeCreate$5 ? nativeCreate$5(null) : {};
  this.size = 0;
}
var _hashClear = hashClear$2;
function hashDelete$2(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var _hashDelete = hashDelete$2;
var nativeCreate$4 = _nativeCreate;
var HASH_UNDEFINED$3 = "__lodash_hash_undefined__";
var objectProto$f = Object.prototype;
var hasOwnProperty$c = objectProto$f.hasOwnProperty;
function hashGet$2(key) {
  var data = this.__data__;
  if (nativeCreate$4) {
    var result = data[key];
    return result === HASH_UNDEFINED$3 ? void 0 : result;
  }
  return hasOwnProperty$c.call(data, key) ? data[key] : void 0;
}
var _hashGet = hashGet$2;
var nativeCreate$3 = _nativeCreate;
var objectProto$e = Object.prototype;
var hasOwnProperty$b = objectProto$e.hasOwnProperty;
function hashHas$2(key) {
  var data = this.__data__;
  return nativeCreate$3 ? data[key] !== void 0 : hasOwnProperty$b.call(data, key);
}
var _hashHas = hashHas$2;
var nativeCreate$2 = _nativeCreate;
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
function hashSet$2(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate$2 && value === void 0 ? HASH_UNDEFINED$2 : value;
  return this;
}
var _hashSet = hashSet$2;
var hashClear$1 = _hashClear, hashDelete$1 = _hashDelete, hashGet$1 = _hashGet, hashHas$1 = _hashHas, hashSet$1 = _hashSet;
function Hash$2(entries) {
  var index = -1, length2 = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length2) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash$2.prototype.clear = hashClear$1;
Hash$2.prototype["delete"] = hashDelete$1;
Hash$2.prototype.get = hashGet$1;
Hash$2.prototype.has = hashHas$1;
Hash$2.prototype.set = hashSet$1;
var _Hash = Hash$2;
function listCacheClear$2() {
  this.__data__ = [];
  this.size = 0;
}
var _listCacheClear = listCacheClear$2;
function eq$2(value, other) {
  return value === other || value !== value && other !== other;
}
var eq_1 = eq$2;
var eq$1 = eq_1;
function assocIndexOf$5(array, key) {
  var length2 = array.length;
  while (length2--) {
    if (eq$1(array[length2][0], key)) {
      return length2;
    }
  }
  return -1;
}
var _assocIndexOf = assocIndexOf$5;
var assocIndexOf$4 = _assocIndexOf;
var arrayProto$1 = Array.prototype;
var splice$1 = arrayProto$1.splice;
function listCacheDelete$2(key) {
  var data = this.__data__, index = assocIndexOf$4(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice$1.call(data, index, 1);
  }
  --this.size;
  return true;
}
var _listCacheDelete = listCacheDelete$2;
var assocIndexOf$3 = _assocIndexOf;
function listCacheGet$2(key) {
  var data = this.__data__, index = assocIndexOf$3(data, key);
  return index < 0 ? void 0 : data[index][1];
}
var _listCacheGet = listCacheGet$2;
var assocIndexOf$2 = _assocIndexOf;
function listCacheHas$2(key) {
  return assocIndexOf$2(this.__data__, key) > -1;
}
var _listCacheHas = listCacheHas$2;
var assocIndexOf$1 = _assocIndexOf;
function listCacheSet$2(key, value) {
  var data = this.__data__, index = assocIndexOf$1(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
var _listCacheSet = listCacheSet$2;
var listCacheClear$1 = _listCacheClear, listCacheDelete$1 = _listCacheDelete, listCacheGet$1 = _listCacheGet, listCacheHas$1 = _listCacheHas, listCacheSet$1 = _listCacheSet;
function ListCache$2(entries) {
  var index = -1, length2 = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length2) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache$2.prototype.clear = listCacheClear$1;
ListCache$2.prototype["delete"] = listCacheDelete$1;
ListCache$2.prototype.get = listCacheGet$1;
ListCache$2.prototype.has = listCacheHas$1;
ListCache$2.prototype.set = listCacheSet$1;
var _ListCache = ListCache$2;
var getNative$1 = _getNative, root$2 = _root;
var Map$4 = getNative$1(root$2, "Map");
var _Map = Map$4;
var Hash$1 = _Hash, ListCache$1 = _ListCache, Map$3 = _Map;
function mapCacheClear$2() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash$1(),
    "map": new (Map$3 || ListCache$1)(),
    "string": new Hash$1()
  };
}
var _mapCacheClear = mapCacheClear$2;
function isKeyable$2(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
var _isKeyable = isKeyable$2;
var isKeyable$1 = _isKeyable;
function getMapData$5(map, key) {
  var data = map.__data__;
  return isKeyable$1(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
var _getMapData = getMapData$5;
var getMapData$4 = _getMapData;
function mapCacheDelete$2(key) {
  var result = getMapData$4(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
var _mapCacheDelete = mapCacheDelete$2;
var getMapData$3 = _getMapData;
function mapCacheGet$2(key) {
  return getMapData$3(this, key).get(key);
}
var _mapCacheGet = mapCacheGet$2;
var getMapData$2 = _getMapData;
function mapCacheHas$2(key) {
  return getMapData$2(this, key).has(key);
}
var _mapCacheHas = mapCacheHas$2;
var getMapData$1 = _getMapData;
function mapCacheSet$2(key, value) {
  var data = getMapData$1(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
var _mapCacheSet = mapCacheSet$2;
var mapCacheClear$1 = _mapCacheClear, mapCacheDelete$1 = _mapCacheDelete, mapCacheGet$1 = _mapCacheGet, mapCacheHas$1 = _mapCacheHas, mapCacheSet$1 = _mapCacheSet;
function MapCache$2(entries) {
  var index = -1, length2 = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length2) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache$2.prototype.clear = mapCacheClear$1;
MapCache$2.prototype["delete"] = mapCacheDelete$1;
MapCache$2.prototype.get = mapCacheGet$1;
MapCache$2.prototype.has = mapCacheHas$1;
MapCache$2.prototype.set = mapCacheSet$1;
var _MapCache = MapCache$2;
var MapCache$1 = _MapCache;
var FUNC_ERROR_TEXT$1 = "Expected a function";
function memoize$2(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize$2.Cache || MapCache$1)();
  return memoized;
}
memoize$2.Cache = MapCache$1;
var memoize_1 = memoize$2;
var memoize$1 = memoize_1;
var MAX_MEMOIZE_SIZE$1 = 500;
function memoizeCapped$2(func) {
  var result = memoize$1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE$1) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}
var _memoizeCapped = memoizeCapped$2;
var memoizeCapped$1 = _memoizeCapped;
var rePropName$1 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar$1 = /\\(\\)?/g;
memoizeCapped$1(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46) {
    result.push("");
  }
  string.replace(rePropName$1, function(match2, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar$1, "$1") : number || match2);
  });
  return result;
});
var Symbol$3 = _Symbol;
var symbolProto$2 = Symbol$3 ? Symbol$3.prototype : void 0;
symbolProto$2 ? symbolProto$2.toString : void 0;
var isArray$2 = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;
var hasElementType = typeof Element !== "undefined";
function equal(a, b2) {
  if (a === b2)
    return true;
  if (a && b2 && typeof a == "object" && typeof b2 == "object") {
    var arrA = isArray$2(a), arrB = isArray$2(b2), i, length2, key;
    if (arrA && arrB) {
      length2 = a.length;
      if (length2 != b2.length)
        return false;
      for (i = length2; i-- !== 0; )
        if (!equal(a[i], b2[i]))
          return false;
      return true;
    }
    if (arrA != arrB)
      return false;
    var dateA = a instanceof Date, dateB = b2 instanceof Date;
    if (dateA != dateB)
      return false;
    if (dateA && dateB)
      return a.getTime() == b2.getTime();
    var regexpA = a instanceof RegExp, regexpB = b2 instanceof RegExp;
    if (regexpA != regexpB)
      return false;
    if (regexpA && regexpB)
      return a.toString() == b2.toString();
    var keys2 = keyList(a);
    length2 = keys2.length;
    if (length2 !== keyList(b2).length)
      return false;
    for (i = length2; i-- !== 0; )
      if (!hasProp.call(b2, keys2[i]))
        return false;
    if (hasElementType && a instanceof Element && b2 instanceof Element)
      return a === b2;
    for (i = length2; i-- !== 0; ) {
      key = keys2[i];
      if (key === "_owner" && a.$$typeof) {
        continue;
      } else {
        if (!equal(a[key], b2[key]))
          return false;
      }
    }
    return true;
  }
  return a !== a && b2 !== b2;
}
var reactFastCompare = function exportedEqual(a, b2) {
  try {
    return equal(a, b2);
  } catch (error) {
    if (error.message && error.message.match(/stack|recursion/i) || error.number === -2146828260) {
      console.warn("Warning: react-fast-compare does not handle circular references.", error.name, error.message);
      return false;
    }
    throw error;
  }
};
var isMergeableObject = function isMergeableObject2(value) {
  return isNonNullObject(value) && !isSpecial(value);
};
function isNonNullObject(value) {
  return !!value && typeof value === "object";
}
function isSpecial(value) {
  var stringValue = Object.prototype.toString.call(value);
  return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
}
var canUseSymbol = typeof Symbol === "function" && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for("react.element") : 60103;
function isReactElement(value) {
  return value.$$typeof === REACT_ELEMENT_TYPE;
}
function emptyTarget(val) {
  return Array.isArray(val) ? [] : {};
}
function cloneUnlessOtherwiseSpecified(value, options) {
  return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
}
function defaultArrayMerge(target, source, options) {
  return target.concat(source).map(function(element) {
    return cloneUnlessOtherwiseSpecified(element, options);
  });
}
function mergeObject(target, source, options) {
  var destination = {};
  if (options.isMergeableObject(target)) {
    Object.keys(target).forEach(function(key) {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    });
  }
  Object.keys(source).forEach(function(key) {
    if (!options.isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    } else {
      destination[key] = deepmerge(target[key], source[key], options);
    }
  });
  return destination;
}
function deepmerge(target, source, options) {
  options = options || {};
  options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  options.isMergeableObject = options.isMergeableObject || isMergeableObject;
  var sourceIsArray = Array.isArray(source);
  var targetIsArray = Array.isArray(target);
  var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, options);
  } else if (sourceIsArray) {
    return options.arrayMerge(target, source, options);
  } else {
    return mergeObject(target, source, options);
  }
}
deepmerge.all = function deepmergeAll(array, options) {
  if (!Array.isArray(array)) {
    throw new Error("first argument should be an array");
  }
  return array.reduce(function(prev2, next2) {
    return deepmerge(prev2, next2, options);
  }, {});
};
var deepmerge_1 = deepmerge;
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal$1 = freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal$1 || freeSelf || Function("return this")();
var root$1 = root;
var Symbol$1 = root$1.Symbol;
var Symbol$2 = Symbol$1;
var objectProto$d = Object.prototype;
var hasOwnProperty$a = objectProto$d.hasOwnProperty;
var nativeObjectToString$1 = objectProto$d.toString;
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$a.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e2) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto$c = Object.prototype;
var nativeObjectToString = objectProto$c.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function overArg(func, transform2) {
  return function(arg) {
    return func(transform2(arg));
  };
}
var getPrototype = overArg(Object.getPrototypeOf, Object);
var getPrototype$1 = getPrototype;
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var objectTag$3 = "[object Object]";
var funcProto$2 = Function.prototype, objectProto$b = Object.prototype;
var funcToString$2 = funcProto$2.toString;
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
var objectCtorString = funcToString$2.call(Object);
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) {
    return false;
  }
  var proto = getPrototype$1(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$9.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString$2.call(Ctor) == objectCtorString;
}
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
function assocIndexOf(array, key) {
  var length2 = array.length;
  while (length2--) {
    if (eq(array[length2][0], key)) {
      return length2;
    }
  }
  return -1;
}
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  return index < 0 ? void 0 : data[index][1];
}
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
function ListCache(entries) {
  var index = -1, length2 = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length2) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
function stackGet(key) {
  return this.__data__.get(key);
}
function stackHas(key) {
  return this.__data__.has(key);
}
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction$1(value) {
  if (!isObject$1(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}
var coreJsData = root$1["__core-js_shared__"];
var coreJsData$1 = coreJsData;
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var funcProto$1 = Function.prototype;
var funcToString$1 = funcProto$1.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e2) {
    }
    try {
      return func + "";
    } catch (e2) {
    }
  }
  return "";
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto = Function.prototype, objectProto$a = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty$8).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
function baseIsNative(value) {
  if (!isObject$1(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
var Map$1 = getNative(root$1, "Map");
var Map$2 = Map$1;
var nativeCreate = getNative(Object, "create");
var nativeCreate$1 = nativeCreate;
function hashClear() {
  this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
  this.size = 0;
}
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
var objectProto$9 = Object.prototype;
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate$1) {
    var result = data[key];
    return result === HASH_UNDEFINED$1 ? void 0 : result;
  }
  return hasOwnProperty$7.call(data, key) ? data[key] : void 0;
}
var objectProto$8 = Object.prototype;
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate$1 ? data[key] !== void 0 : hasOwnProperty$6.call(data, key);
}
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate$1 && value === void 0 ? HASH_UNDEFINED : value;
  return this;
}
function Hash(entries) {
  var index = -1, length2 = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length2) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map$2 || ListCache)(),
    "string": new Hash()
  };
}
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
function mapCacheDelete(key) {
  var result = getMapData(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
function mapCacheSet(key, value) {
  var data = getMapData(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
function MapCache(entries) {
  var index = -1, length2 = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length2) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map$2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}
Stack.prototype.clear = stackClear;
Stack.prototype["delete"] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
function arrayEach(array, iteratee) {
  var index = -1, length2 = array == null ? 0 : array.length;
  while (++index < length2) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
var defineProperty = function() {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e2) {
  }
}();
var defineProperty$1 = defineProperty;
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty$1) {
    defineProperty$1(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
var objectProto$7 = Object.prototype;
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$5.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1, length2 = props.length;
  while (++index < length2) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}
function baseTimes(n2, iteratee) {
  var index = -1, result = Array(n2);
  while (++index < n2) {
    result[index] = iteratee(index);
  }
  return result;
}
var argsTag$2 = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$2;
}
var objectProto$6 = Object.prototype;
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;
var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;
var isArguments = baseIsArguments(function() {
  return arguments;
}()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$4.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
};
var isArguments$1 = isArguments;
var isArray = Array.isArray;
var isArray$1 = isArray;
function stubFalse() {
  return false;
}
var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
var Buffer$1 = moduleExports$2 ? root$1.Buffer : void 0;
var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse;
var isBuffer$1 = isBuffer;
var MAX_SAFE_INTEGER$1 = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length2) {
  var type = typeof value;
  length2 = length2 == null ? MAX_SAFE_INTEGER$1 : length2;
  return !!length2 && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length2);
}
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", errorTag$1 = "[object Error]", funcTag$1 = "[object Function]", mapTag$4 = "[object Map]", numberTag$2 = "[object Number]", objectTag$2 = "[object Object]", regexpTag$2 = "[object RegExp]", setTag$4 = "[object Set]", stringTag$2 = "[object String]", weakMapTag$2 = "[object WeakMap]";
var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$3 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag$2] = typedArrayTags[boolTag$2] = typedArrayTags[dataViewTag$3] = typedArrayTags[dateTag$2] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$4] = typedArrayTags[numberTag$2] = typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$2] = typedArrayTags[setTag$4] = typedArrayTags[stringTag$2] = typedArrayTags[weakMapTag$2] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
var freeProcess = moduleExports$1 && freeGlobal$1.process;
var nodeUtil = function() {
  try {
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e2) {
  }
}();
var nodeUtil$1 = nodeUtil;
var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
var isTypedArray$1 = isTypedArray;
var objectProto$5 = Object.prototype;
var hasOwnProperty$3 = objectProto$5.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray$1(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$1(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length2 = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$3.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length2)))) {
      result.push(key);
    }
  }
  return result;
}
var objectProto$4 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$4;
  return value === proto;
}
var nativeKeys = overArg(Object.keys, Object);
var nativeKeys$1 = nativeKeys;
var objectProto$3 = Object.prototype;
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys$1(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$2.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction$1(value);
}
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var objectProto$2 = Object.prototype;
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject$1(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty$1.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer2 = moduleExports ? root$1.Buffer : void 0, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length2 = buffer.length, result = allocUnsafe ? allocUnsafe(length2) : new buffer.constructor(length2);
  buffer.copy(result);
  return result;
}
function copyArray(source, array) {
  var index = -1, length2 = source.length;
  array || (array = Array(length2));
  while (++index < length2) {
    array[index] = source[index];
  }
  return array;
}
function arrayFilter(array, predicate) {
  var index = -1, length2 = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length2) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
function stubArray() {
  return [];
}
var objectProto$1 = Object.prototype;
var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols$1 ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};
var getSymbols$1 = getSymbols;
function copySymbols(source, object) {
  return copyObject(source, getSymbols$1(source), object);
}
function arrayPush(array, values2) {
  var index = -1, length2 = values2.length, offset = array.length;
  while (++index < length2) {
    array[offset + index] = values2[index];
  }
  return array;
}
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols$1(object));
    object = getPrototype$1(object);
  }
  return result;
};
var getSymbolsIn$1 = getSymbolsIn;
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn$1(source), object);
}
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
}
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols$1);
}
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn$1);
}
var DataView = getNative(root$1, "DataView");
var DataView$1 = DataView;
var Promise$1 = getNative(root$1, "Promise");
var Promise$2 = Promise$1;
var Set$1 = getNative(root$1, "Set");
var Set$2 = Set$1;
var WeakMap$1 = getNative(root$1, "WeakMap");
var WeakMap$2 = WeakMap$1;
var mapTag$3 = "[object Map]", objectTag$1 = "[object Object]", promiseTag = "[object Promise]", setTag$3 = "[object Set]", weakMapTag$1 = "[object WeakMap]";
var dataViewTag$2 = "[object DataView]";
var dataViewCtorString = toSource(DataView$1), mapCtorString = toSource(Map$2), promiseCtorString = toSource(Promise$2), setCtorString = toSource(Set$2), weakMapCtorString = toSource(WeakMap$2);
var getTag = baseGetTag;
if (DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != dataViewTag$2 || Map$2 && getTag(new Map$2()) != mapTag$3 || Promise$2 && getTag(Promise$2.resolve()) != promiseTag || Set$2 && getTag(new Set$2()) != setTag$3 || WeakMap$2 && getTag(new WeakMap$2()) != weakMapTag$1) {
  getTag = function(value) {
    var result = baseGetTag(value), Ctor = result == objectTag$1 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$2;
        case mapCtorString:
          return mapTag$3;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$3;
        case weakMapCtorString:
          return weakMapTag$1;
      }
    }
    return result;
  };
}
var getTag$1 = getTag;
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function initCloneArray(array) {
  var length2 = array.length, result = new array.constructor(length2);
  if (length2 && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
var Uint8Array2 = root$1.Uint8Array;
var Uint8Array$1 = Uint8Array2;
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
  return result;
}
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
var reFlags = /\w*$/;
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}
var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : void 0;
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", mapTag$2 = "[object Map]", numberTag$1 = "[object Number]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", symbolTag$2 = "[object Symbol]";
var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$1:
      return cloneArrayBuffer(object);
    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);
    case dataViewTag$1:
      return cloneDataView(object, isDeep);
    case float32Tag$1:
    case float64Tag$1:
    case int8Tag$1:
    case int16Tag$1:
    case int32Tag$1:
    case uint8Tag$1:
    case uint8ClampedTag$1:
    case uint16Tag$1:
    case uint32Tag$1:
      return cloneTypedArray(object, isDeep);
    case mapTag$2:
      return new Ctor();
    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);
    case regexpTag$1:
      return cloneRegExp(object);
    case setTag$2:
      return new Ctor();
    case symbolTag$2:
      return cloneSymbol(object);
  }
}
var objectCreate = Object.create;
var baseCreate = function() {
  function object() {
  }
  return function(proto) {
    if (!isObject$1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
}();
var baseCreate$1 = baseCreate;
function initCloneObject(object) {
  return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate$1(getPrototype$1(object)) : {};
}
var mapTag$1 = "[object Map]";
function baseIsMap(value) {
  return isObjectLike(value) && getTag$1(value) == mapTag$1;
}
var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap;
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
var isMap$1 = isMap;
var setTag$1 = "[object Set]";
function baseIsSet(value) {
  return isObjectLike(value) && getTag$1(value) == setTag$1;
}
var nodeIsSet = nodeUtil$1 && nodeUtil$1.isSet;
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
var isSet$1 = isSet;
var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG$1 = 4;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag$1 = "[object Symbol]", weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG$1;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== void 0) {
    return result;
  }
  if (!isObject$1(value)) {
    return value;
  }
  var isArr = isArray$1(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag$1(value), isFunc = tag == funcTag || tag == genTag;
    if (isBuffer$1(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  stack || (stack = new Stack());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if (isSet$1(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap$1(value)) {
    value.forEach(function(subValue, key2) {
      result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
  }
  var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
  var props = isArr ? void 0 : keysFunc(value);
  arrayEach(props || value, function(subValue, key2) {
    if (props) {
      key2 = subValue;
      subValue = value[key2];
    }
    assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
  });
  return result;
}
var CLONE_SYMBOLS_FLAG = 4;
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}
function arrayMap(array, iteratee) {
  var index = -1, length2 = array == null ? 0 : array.length, result = Array(length2);
  while (++index < length2) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
var FUNC_ERROR_TEXT = "Expected a function";
function memoize(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}
memoize.Cache = MapCache;
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46) {
    result.push("");
  }
  string.replace(rePropName, function(match2, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match2);
  });
  return result;
});
var stringToPath$1 = stringToPath;
var INFINITY$1 = 1 / 0;
function toKey(value) {
  if (typeof value == "string" || isSymbol(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
}
var INFINITY = 1 / 0;
var symbolProto = Symbol$2 ? Symbol$2.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray$1(value)) {
    return arrayMap(value, baseToString) + "";
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
function toString(value) {
  return value == null ? "" : baseToString(value);
}
function toPath(value) {
  if (isArray$1(value)) {
    return arrayMap(value, toKey);
  }
  return isSymbol(value) ? [value] : copyArray(stringToPath$1(toString(value)));
}
var isProduction = true;
function warning(condition, message) {
  if (!isProduction) {
    if (condition) {
      return;
    }
    var text = "Warning: " + message;
    if (typeof console !== "undefined") {
      console.warn(text);
    }
    try {
      throw Error(text);
    } catch (x) {
    }
  }
}
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
var isFunction = function isFunction2(obj) {
  return typeof obj === "function";
};
var isObject = function isObject2(obj) {
  return obj !== null && typeof obj === "object";
};
var isInteger = function isInteger2(obj) {
  return String(Math.floor(Number(obj))) === obj;
};
var isString = function isString2(obj) {
  return Object.prototype.toString.call(obj) === "[object String]";
};
var isEmptyChildren = function isEmptyChildren2(children) {
  return Children.count(children) === 0;
};
var isPromise = function isPromise2(value) {
  return isObject(value) && isFunction(value.then);
};
function getIn(obj, key, def, p2) {
  if (p2 === void 0) {
    p2 = 0;
  }
  var path = toPath(key);
  while (obj && p2 < path.length) {
    obj = obj[path[p2++]];
  }
  return obj === void 0 ? def : obj;
}
function setIn(obj, path, value) {
  var res = clone(obj);
  var resVal = res;
  var i = 0;
  var pathArray = toPath(path);
  for (; i < pathArray.length - 1; i++) {
    var currentPath = pathArray[i];
    var currentObj = getIn(obj, pathArray.slice(0, i + 1));
    if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
      resVal = resVal[currentPath] = clone(currentObj);
    } else {
      var nextPath = pathArray[i + 1];
      resVal = resVal[currentPath] = isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
    }
  }
  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj;
  }
  if (value === void 0) {
    delete resVal[pathArray[i]];
  } else {
    resVal[pathArray[i]] = value;
  }
  if (i === 0 && value === void 0) {
    delete res[pathArray[i]];
  }
  return res;
}
function setNestedObjectValues(object, value, visited, response) {
  if (visited === void 0) {
    visited = /* @__PURE__ */ new WeakMap();
  }
  if (response === void 0) {
    response = {};
  }
  for (var _i = 0, _Object$keys = Object.keys(object); _i < _Object$keys.length; _i++) {
    var k2 = _Object$keys[_i];
    var val = object[k2];
    if (isObject(val)) {
      if (!visited.get(val)) {
        visited.set(val, true);
        response[k2] = Array.isArray(val) ? [] : {};
        setNestedObjectValues(val, value, visited, response[k2]);
      }
    } else {
      response[k2] = value;
    }
  }
  return response;
}
var FormikContext = /* @__PURE__ */ createContext(void 0);
FormikContext.displayName = "FormikContext";
var FormikProvider = FormikContext.Provider;
FormikContext.Consumer;
function useFormikContext() {
  var formik = useContext(FormikContext);
  !!!formik ? warning(false) : void 0;
  return formik;
}
function formikReducer(state, msg) {
  switch (msg.type) {
    case "SET_VALUES":
      return _extends({}, state, {
        values: msg.payload
      });
    case "SET_TOUCHED":
      return _extends({}, state, {
        touched: msg.payload
      });
    case "SET_ERRORS":
      if (reactFastCompare(state.errors, msg.payload)) {
        return state;
      }
      return _extends({}, state, {
        errors: msg.payload
      });
    case "SET_STATUS":
      return _extends({}, state, {
        status: msg.payload
      });
    case "SET_ISSUBMITTING":
      return _extends({}, state, {
        isSubmitting: msg.payload
      });
    case "SET_ISVALIDATING":
      return _extends({}, state, {
        isValidating: msg.payload
      });
    case "SET_FIELD_VALUE":
      return _extends({}, state, {
        values: setIn(state.values, msg.payload.field, msg.payload.value)
      });
    case "SET_FIELD_TOUCHED":
      return _extends({}, state, {
        touched: setIn(state.touched, msg.payload.field, msg.payload.value)
      });
    case "SET_FIELD_ERROR":
      return _extends({}, state, {
        errors: setIn(state.errors, msg.payload.field, msg.payload.value)
      });
    case "RESET_FORM":
      return _extends({}, state, msg.payload);
    case "SET_FORMIK_STATE":
      return msg.payload(state);
    case "SUBMIT_ATTEMPT":
      return _extends({}, state, {
        touched: setNestedObjectValues(state.values, true),
        isSubmitting: true,
        submitCount: state.submitCount + 1
      });
    case "SUBMIT_FAILURE":
      return _extends({}, state, {
        isSubmitting: false
      });
    case "SUBMIT_SUCCESS":
      return _extends({}, state, {
        isSubmitting: false
      });
    default:
      return state;
  }
}
var emptyErrors = {};
var emptyTouched = {};
function useFormik(_ref) {
  var _ref$validateOnChange = _ref.validateOnChange, validateOnChange = _ref$validateOnChange === void 0 ? true : _ref$validateOnChange, _ref$validateOnBlur = _ref.validateOnBlur, validateOnBlur = _ref$validateOnBlur === void 0 ? true : _ref$validateOnBlur, _ref$validateOnMount = _ref.validateOnMount, validateOnMount = _ref$validateOnMount === void 0 ? false : _ref$validateOnMount, isInitialValid = _ref.isInitialValid, _ref$enableReinitiali = _ref.enableReinitialize, enableReinitialize = _ref$enableReinitiali === void 0 ? false : _ref$enableReinitiali, onSubmit = _ref.onSubmit, rest = _objectWithoutPropertiesLoose(_ref, ["validateOnChange", "validateOnBlur", "validateOnMount", "isInitialValid", "enableReinitialize", "onSubmit"]);
  var props = _extends({
    validateOnChange,
    validateOnBlur,
    validateOnMount,
    onSubmit
  }, rest);
  var initialValues = useRef(props.initialValues);
  var initialErrors = useRef(props.initialErrors || emptyErrors);
  var initialTouched = useRef(props.initialTouched || emptyTouched);
  var initialStatus = useRef(props.initialStatus);
  var isMounted = useRef(false);
  var fieldRegistry = useRef({});
  useEffect(function() {
    isMounted.current = true;
    return function() {
      isMounted.current = false;
    };
  }, []);
  var _React$useReducer = useReducer(formikReducer, {
    values: props.initialValues,
    errors: props.initialErrors || emptyErrors,
    touched: props.initialTouched || emptyTouched,
    status: props.initialStatus,
    isSubmitting: false,
    isValidating: false,
    submitCount: 0
  }), state = _React$useReducer[0], dispatch = _React$useReducer[1];
  var runValidateHandler = useCallback(function(values2, field) {
    return new Promise(function(resolve, reject) {
      var maybePromisedErrors = props.validate(values2, field);
      if (maybePromisedErrors == null) {
        resolve(emptyErrors);
      } else if (isPromise(maybePromisedErrors)) {
        maybePromisedErrors.then(function(errors) {
          resolve(errors || emptyErrors);
        }, function(actualException) {
          reject(actualException);
        });
      } else {
        resolve(maybePromisedErrors);
      }
    });
  }, [props.validate]);
  var runValidationSchema = useCallback(function(values2, field) {
    var validationSchema = props.validationSchema;
    var schema = isFunction(validationSchema) ? validationSchema(field) : validationSchema;
    var promise = field && schema.validateAt ? schema.validateAt(field, values2) : validateYupSchema(values2, schema);
    return new Promise(function(resolve, reject) {
      promise.then(function() {
        resolve(emptyErrors);
      }, function(err) {
        if (err.name === "ValidationError") {
          resolve(yupToFormErrors(err));
        } else {
          reject(err);
        }
      });
    });
  }, [props.validationSchema]);
  var runSingleFieldLevelValidation = useCallback(function(field, value) {
    return new Promise(function(resolve) {
      return resolve(fieldRegistry.current[field].validate(value));
    });
  }, []);
  var runFieldLevelValidations = useCallback(function(values2) {
    var fieldKeysWithValidation = Object.keys(fieldRegistry.current).filter(function(f2) {
      return isFunction(fieldRegistry.current[f2].validate);
    });
    var fieldValidations = fieldKeysWithValidation.length > 0 ? fieldKeysWithValidation.map(function(f2) {
      return runSingleFieldLevelValidation(f2, getIn(values2, f2));
    }) : [Promise.resolve("DO_NOT_DELETE_YOU_WILL_BE_FIRED")];
    return Promise.all(fieldValidations).then(function(fieldErrorsList) {
      return fieldErrorsList.reduce(function(prev2, curr, index) {
        if (curr === "DO_NOT_DELETE_YOU_WILL_BE_FIRED") {
          return prev2;
        }
        if (curr) {
          prev2 = setIn(prev2, fieldKeysWithValidation[index], curr);
        }
        return prev2;
      }, {});
    });
  }, [runSingleFieldLevelValidation]);
  var runAllValidations = useCallback(function(values2) {
    return Promise.all([runFieldLevelValidations(values2), props.validationSchema ? runValidationSchema(values2) : {}, props.validate ? runValidateHandler(values2) : {}]).then(function(_ref2) {
      var fieldErrors = _ref2[0], schemaErrors = _ref2[1], validateErrors = _ref2[2];
      var combinedErrors = deepmerge_1.all([fieldErrors, schemaErrors, validateErrors], {
        arrayMerge
      });
      return combinedErrors;
    });
  }, [props.validate, props.validationSchema, runFieldLevelValidations, runValidateHandler, runValidationSchema]);
  var validateFormWithHighPriority = useEventCallback(function(values2) {
    if (values2 === void 0) {
      values2 = state.values;
    }
    dispatch({
      type: "SET_ISVALIDATING",
      payload: true
    });
    return runAllValidations(values2).then(function(combinedErrors) {
      if (!!isMounted.current) {
        dispatch({
          type: "SET_ISVALIDATING",
          payload: false
        });
        dispatch({
          type: "SET_ERRORS",
          payload: combinedErrors
        });
      }
      return combinedErrors;
    });
  });
  useEffect(function() {
    if (validateOnMount && isMounted.current === true && reactFastCompare(initialValues.current, props.initialValues)) {
      validateFormWithHighPriority(initialValues.current);
    }
  }, [validateOnMount, validateFormWithHighPriority]);
  var resetForm = useCallback(function(nextState) {
    var values2 = nextState && nextState.values ? nextState.values : initialValues.current;
    var errors = nextState && nextState.errors ? nextState.errors : initialErrors.current ? initialErrors.current : props.initialErrors || {};
    var touched = nextState && nextState.touched ? nextState.touched : initialTouched.current ? initialTouched.current : props.initialTouched || {};
    var status = nextState && nextState.status ? nextState.status : initialStatus.current ? initialStatus.current : props.initialStatus;
    initialValues.current = values2;
    initialErrors.current = errors;
    initialTouched.current = touched;
    initialStatus.current = status;
    var dispatchFn = function dispatchFn2() {
      dispatch({
        type: "RESET_FORM",
        payload: {
          isSubmitting: !!nextState && !!nextState.isSubmitting,
          errors,
          touched,
          status,
          values: values2,
          isValidating: !!nextState && !!nextState.isValidating,
          submitCount: !!nextState && !!nextState.submitCount && typeof nextState.submitCount === "number" ? nextState.submitCount : 0
        }
      });
    };
    if (props.onReset) {
      var maybePromisedOnReset = props.onReset(state.values, imperativeMethods);
      if (isPromise(maybePromisedOnReset)) {
        maybePromisedOnReset.then(dispatchFn);
      } else {
        dispatchFn();
      }
    } else {
      dispatchFn();
    }
  }, [props.initialErrors, props.initialStatus, props.initialTouched]);
  useEffect(function() {
    if (isMounted.current === true && !reactFastCompare(initialValues.current, props.initialValues)) {
      if (enableReinitialize) {
        initialValues.current = props.initialValues;
        resetForm();
      }
      if (validateOnMount) {
        validateFormWithHighPriority(initialValues.current);
      }
    }
  }, [enableReinitialize, props.initialValues, resetForm, validateOnMount, validateFormWithHighPriority]);
  useEffect(function() {
    if (enableReinitialize && isMounted.current === true && !reactFastCompare(initialErrors.current, props.initialErrors)) {
      initialErrors.current = props.initialErrors || emptyErrors;
      dispatch({
        type: "SET_ERRORS",
        payload: props.initialErrors || emptyErrors
      });
    }
  }, [enableReinitialize, props.initialErrors]);
  useEffect(function() {
    if (enableReinitialize && isMounted.current === true && !reactFastCompare(initialTouched.current, props.initialTouched)) {
      initialTouched.current = props.initialTouched || emptyTouched;
      dispatch({
        type: "SET_TOUCHED",
        payload: props.initialTouched || emptyTouched
      });
    }
  }, [enableReinitialize, props.initialTouched]);
  useEffect(function() {
    if (enableReinitialize && isMounted.current === true && !reactFastCompare(initialStatus.current, props.initialStatus)) {
      initialStatus.current = props.initialStatus;
      dispatch({
        type: "SET_STATUS",
        payload: props.initialStatus
      });
    }
  }, [enableReinitialize, props.initialStatus, props.initialTouched]);
  var validateField = useEventCallback(function(name) {
    if (fieldRegistry.current[name] && isFunction(fieldRegistry.current[name].validate)) {
      var value = getIn(state.values, name);
      var maybePromise = fieldRegistry.current[name].validate(value);
      if (isPromise(maybePromise)) {
        dispatch({
          type: "SET_ISVALIDATING",
          payload: true
        });
        return maybePromise.then(function(x) {
          return x;
        }).then(function(error) {
          dispatch({
            type: "SET_FIELD_ERROR",
            payload: {
              field: name,
              value: error
            }
          });
          dispatch({
            type: "SET_ISVALIDATING",
            payload: false
          });
        });
      } else {
        dispatch({
          type: "SET_FIELD_ERROR",
          payload: {
            field: name,
            value: maybePromise
          }
        });
        return Promise.resolve(maybePromise);
      }
    } else if (props.validationSchema) {
      dispatch({
        type: "SET_ISVALIDATING",
        payload: true
      });
      return runValidationSchema(state.values, name).then(function(x) {
        return x;
      }).then(function(error) {
        dispatch({
          type: "SET_FIELD_ERROR",
          payload: {
            field: name,
            value: error[name]
          }
        });
        dispatch({
          type: "SET_ISVALIDATING",
          payload: false
        });
      });
    }
    return Promise.resolve();
  });
  var registerField = useCallback(function(name, _ref3) {
    var validate = _ref3.validate;
    fieldRegistry.current[name] = {
      validate
    };
  }, []);
  var unregisterField = useCallback(function(name) {
    delete fieldRegistry.current[name];
  }, []);
  var setTouched = useEventCallback(function(touched, shouldValidate) {
    dispatch({
      type: "SET_TOUCHED",
      payload: touched
    });
    var willValidate = shouldValidate === void 0 ? validateOnBlur : shouldValidate;
    return willValidate ? validateFormWithHighPriority(state.values) : Promise.resolve();
  });
  var setErrors = useCallback(function(errors) {
    dispatch({
      type: "SET_ERRORS",
      payload: errors
    });
  }, []);
  var setValues = useEventCallback(function(values2, shouldValidate) {
    var resolvedValues = isFunction(values2) ? values2(state.values) : values2;
    dispatch({
      type: "SET_VALUES",
      payload: resolvedValues
    });
    var willValidate = shouldValidate === void 0 ? validateOnChange : shouldValidate;
    return willValidate ? validateFormWithHighPriority(resolvedValues) : Promise.resolve();
  });
  var setFieldError = useCallback(function(field, value) {
    dispatch({
      type: "SET_FIELD_ERROR",
      payload: {
        field,
        value
      }
    });
  }, []);
  var setFieldValue = useEventCallback(function(field, value, shouldValidate) {
    dispatch({
      type: "SET_FIELD_VALUE",
      payload: {
        field,
        value
      }
    });
    var willValidate = shouldValidate === void 0 ? validateOnChange : shouldValidate;
    return willValidate ? validateFormWithHighPriority(setIn(state.values, field, value)) : Promise.resolve();
  });
  var executeChange = useCallback(function(eventOrTextValue, maybePath) {
    var field = maybePath;
    var val = eventOrTextValue;
    var parsed;
    if (!isString(eventOrTextValue)) {
      if (eventOrTextValue.persist) {
        eventOrTextValue.persist();
      }
      var target = eventOrTextValue.target ? eventOrTextValue.target : eventOrTextValue.currentTarget;
      var type = target.type, name = target.name, id = target.id, value = target.value, checked = target.checked, outerHTML = target.outerHTML, options = target.options, multiple = target.multiple;
      field = maybePath ? maybePath : name ? name : id;
      if (!field && false) {
        warnAboutMissingIdentifier({
          htmlContent: outerHTML,
          documentationAnchorLink: "handlechange-e-reactchangeeventany--void",
          handlerName: "handleChange"
        });
      }
      val = /number|range/.test(type) ? (parsed = parseFloat(value), isNaN(parsed) ? "" : parsed) : /checkbox/.test(type) ? getValueForCheckbox(getIn(state.values, field), checked, value) : options && multiple ? getSelectedValues(options) : value;
    }
    if (field) {
      setFieldValue(field, val);
    }
  }, [setFieldValue, state.values]);
  var handleChange = useEventCallback(function(eventOrPath) {
    if (isString(eventOrPath)) {
      return function(event) {
        return executeChange(event, eventOrPath);
      };
    } else {
      executeChange(eventOrPath);
    }
  });
  var setFieldTouched = useEventCallback(function(field, touched, shouldValidate) {
    if (touched === void 0) {
      touched = true;
    }
    dispatch({
      type: "SET_FIELD_TOUCHED",
      payload: {
        field,
        value: touched
      }
    });
    var willValidate = shouldValidate === void 0 ? validateOnBlur : shouldValidate;
    return willValidate ? validateFormWithHighPriority(state.values) : Promise.resolve();
  });
  var executeBlur = useCallback(function(e2, path) {
    if (e2.persist) {
      e2.persist();
    }
    var _e$target = e2.target, name = _e$target.name, id = _e$target.id, outerHTML = _e$target.outerHTML;
    var field = path ? path : name ? name : id;
    if (!field && false) {
      warnAboutMissingIdentifier({
        htmlContent: outerHTML,
        documentationAnchorLink: "handleblur-e-any--void",
        handlerName: "handleBlur"
      });
    }
    setFieldTouched(field, true);
  }, [setFieldTouched]);
  var handleBlur = useEventCallback(function(eventOrString) {
    if (isString(eventOrString)) {
      return function(event) {
        return executeBlur(event, eventOrString);
      };
    } else {
      executeBlur(eventOrString);
    }
  });
  var setFormikState = useCallback(function(stateOrCb) {
    if (isFunction(stateOrCb)) {
      dispatch({
        type: "SET_FORMIK_STATE",
        payload: stateOrCb
      });
    } else {
      dispatch({
        type: "SET_FORMIK_STATE",
        payload: function payload() {
          return stateOrCb;
        }
      });
    }
  }, []);
  var setStatus = useCallback(function(status) {
    dispatch({
      type: "SET_STATUS",
      payload: status
    });
  }, []);
  var setSubmitting = useCallback(function(isSubmitting) {
    dispatch({
      type: "SET_ISSUBMITTING",
      payload: isSubmitting
    });
  }, []);
  var submitForm = useEventCallback(function() {
    dispatch({
      type: "SUBMIT_ATTEMPT"
    });
    return validateFormWithHighPriority().then(function(combinedErrors) {
      var isInstanceOfError = combinedErrors instanceof Error;
      var isActuallyValid = !isInstanceOfError && Object.keys(combinedErrors).length === 0;
      if (isActuallyValid) {
        var promiseOrUndefined;
        try {
          promiseOrUndefined = executeSubmit();
          if (promiseOrUndefined === void 0) {
            return;
          }
        } catch (error) {
          throw error;
        }
        return Promise.resolve(promiseOrUndefined).then(function(result) {
          if (!!isMounted.current) {
            dispatch({
              type: "SUBMIT_SUCCESS"
            });
          }
          return result;
        })["catch"](function(_errors) {
          if (!!isMounted.current) {
            dispatch({
              type: "SUBMIT_FAILURE"
            });
            throw _errors;
          }
        });
      } else if (!!isMounted.current) {
        dispatch({
          type: "SUBMIT_FAILURE"
        });
        if (isInstanceOfError) {
          throw combinedErrors;
        }
      }
      return;
    });
  });
  var handleSubmit = useEventCallback(function(e2) {
    if (e2 && e2.preventDefault && isFunction(e2.preventDefault)) {
      e2.preventDefault();
    }
    if (e2 && e2.stopPropagation && isFunction(e2.stopPropagation)) {
      e2.stopPropagation();
    }
    submitForm()["catch"](function(reason) {
      console.warn("Warning: An unhandled error was caught from submitForm()", reason);
    });
  });
  var imperativeMethods = {
    resetForm,
    validateForm: validateFormWithHighPriority,
    validateField,
    setErrors,
    setFieldError,
    setFieldTouched,
    setFieldValue,
    setStatus,
    setSubmitting,
    setTouched,
    setValues,
    setFormikState,
    submitForm
  };
  var executeSubmit = useEventCallback(function() {
    return onSubmit(state.values, imperativeMethods);
  });
  var handleReset = useEventCallback(function(e2) {
    if (e2 && e2.preventDefault && isFunction(e2.preventDefault)) {
      e2.preventDefault();
    }
    if (e2 && e2.stopPropagation && isFunction(e2.stopPropagation)) {
      e2.stopPropagation();
    }
    resetForm();
  });
  var getFieldMeta = useCallback(function(name) {
    return {
      value: getIn(state.values, name),
      error: getIn(state.errors, name),
      touched: !!getIn(state.touched, name),
      initialValue: getIn(initialValues.current, name),
      initialTouched: !!getIn(initialTouched.current, name),
      initialError: getIn(initialErrors.current, name)
    };
  }, [state.errors, state.touched, state.values]);
  var getFieldHelpers = useCallback(function(name) {
    return {
      setValue: function setValue(value, shouldValidate) {
        return setFieldValue(name, value, shouldValidate);
      },
      setTouched: function setTouched2(value, shouldValidate) {
        return setFieldTouched(name, value, shouldValidate);
      },
      setError: function setError(value) {
        return setFieldError(name, value);
      }
    };
  }, [setFieldValue, setFieldTouched, setFieldError]);
  var getFieldProps = useCallback(function(nameOrOptions) {
    var isAnObject = isObject(nameOrOptions);
    var name = isAnObject ? nameOrOptions.name : nameOrOptions;
    var valueState = getIn(state.values, name);
    var field = {
      name,
      value: valueState,
      onChange: handleChange,
      onBlur: handleBlur
    };
    if (isAnObject) {
      var type = nameOrOptions.type, valueProp = nameOrOptions.value, is = nameOrOptions.as, multiple = nameOrOptions.multiple;
      if (type === "checkbox") {
        if (valueProp === void 0) {
          field.checked = !!valueState;
        } else {
          field.checked = !!(Array.isArray(valueState) && ~valueState.indexOf(valueProp));
          field.value = valueProp;
        }
      } else if (type === "radio") {
        field.checked = valueState === valueProp;
        field.value = valueProp;
      } else if (is === "select" && multiple) {
        field.value = field.value || [];
        field.multiple = true;
      }
    }
    return field;
  }, [handleBlur, handleChange, state.values]);
  var dirty = useMemo(function() {
    return !reactFastCompare(initialValues.current, state.values);
  }, [initialValues.current, state.values]);
  var isValid = useMemo(function() {
    return typeof isInitialValid !== "undefined" ? dirty ? state.errors && Object.keys(state.errors).length === 0 : isInitialValid !== false && isFunction(isInitialValid) ? isInitialValid(props) : isInitialValid : state.errors && Object.keys(state.errors).length === 0;
  }, [isInitialValid, dirty, state.errors, props]);
  var ctx = _extends({}, state, {
    initialValues: initialValues.current,
    initialErrors: initialErrors.current,
    initialTouched: initialTouched.current,
    initialStatus: initialStatus.current,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    resetForm,
    setErrors,
    setFormikState,
    setFieldTouched,
    setFieldValue,
    setFieldError,
    setStatus,
    setSubmitting,
    setTouched,
    setValues,
    submitForm,
    validateForm: validateFormWithHighPriority,
    validateField,
    isValid,
    dirty,
    unregisterField,
    registerField,
    getFieldProps,
    getFieldMeta,
    getFieldHelpers,
    validateOnBlur,
    validateOnChange,
    validateOnMount
  });
  return ctx;
}
function Formik(props) {
  var formikbag = useFormik(props);
  var component = props.component, children = props.children, render = props.render, innerRef = props.innerRef;
  useImperativeHandle(innerRef, function() {
    return formikbag;
  });
  return createElement(FormikProvider, {
    value: formikbag
  }, component ? createElement(component, formikbag) : render ? render(formikbag) : children ? isFunction(children) ? children(formikbag) : !isEmptyChildren(children) ? Children.only(children) : null : null);
}
function warnAboutMissingIdentifier(_ref4) {
  var htmlContent = _ref4.htmlContent, documentationAnchorLink = _ref4.documentationAnchorLink, handlerName = _ref4.handlerName;
  console.warn("Warning: Formik called `" + handlerName + "`, but you forgot to pass an `id` or `name` attribute to your input:\n    " + htmlContent + "\n    Formik cannot determine which value to update. For more info see https://formik.org/docs/api/formik#" + documentationAnchorLink + "\n  ");
}
function yupToFormErrors(yupError) {
  var errors = {};
  if (yupError.inner) {
    if (yupError.inner.length === 0) {
      return setIn(errors, yupError.path, yupError.message);
    }
    for (var _iterator = yupError.inner, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ; ) {
      var _ref5;
      if (_isArray) {
        if (_i >= _iterator.length)
          break;
        _ref5 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done)
          break;
        _ref5 = _i.value;
      }
      var err = _ref5;
      if (!getIn(errors, err.path)) {
        errors = setIn(errors, err.path, err.message);
      }
    }
  }
  return errors;
}
function validateYupSchema(values2, schema, sync, context) {
  if (sync === void 0) {
    sync = false;
  }
  if (context === void 0) {
    context = {};
  }
  var validateData = prepareDataForValidation(values2);
  return schema[sync ? "validateSync" : "validate"](validateData, {
    abortEarly: false,
    context
  });
}
function prepareDataForValidation(values2) {
  var data = Array.isArray(values2) ? [] : {};
  for (var k2 in values2) {
    if (Object.prototype.hasOwnProperty.call(values2, k2)) {
      var key = String(k2);
      if (Array.isArray(values2[key]) === true) {
        data[key] = values2[key].map(function(value) {
          if (Array.isArray(value) === true || isPlainObject(value)) {
            return prepareDataForValidation(value);
          } else {
            return value !== "" ? value : void 0;
          }
        });
      } else if (isPlainObject(values2[key])) {
        data[key] = prepareDataForValidation(values2[key]);
      } else {
        data[key] = values2[key] !== "" ? values2[key] : void 0;
      }
    }
  }
  return data;
}
function arrayMerge(target, source, options) {
  var destination = target.slice();
  source.forEach(function merge2(e2, i) {
    if (typeof destination[i] === "undefined") {
      var cloneRequested = options.clone !== false;
      var shouldClone = cloneRequested && options.isMergeableObject(e2);
      destination[i] = shouldClone ? deepmerge_1(Array.isArray(e2) ? [] : {}, e2, options) : e2;
    } else if (options.isMergeableObject(e2)) {
      destination[i] = deepmerge_1(target[i], e2, options);
    } else if (target.indexOf(e2) === -1) {
      destination.push(e2);
    }
  });
  return destination;
}
function getSelectedValues(options) {
  return Array.from(options).filter(function(el) {
    return el.selected;
  }).map(function(el) {
    return el.value;
  });
}
function getValueForCheckbox(currentValue, checked, valueProp) {
  if (typeof currentValue === "boolean") {
    return Boolean(checked);
  }
  var currentArrayOfValues = [];
  var isValueInArray = false;
  var index = -1;
  if (!Array.isArray(currentValue)) {
    if (!valueProp || valueProp == "true" || valueProp == "false") {
      return Boolean(checked);
    }
  } else {
    currentArrayOfValues = currentValue;
    index = currentValue.indexOf(valueProp);
    isValueInArray = index >= 0;
  }
  if (checked && valueProp && !isValueInArray) {
    return currentArrayOfValues.concat(valueProp);
  }
  if (!isValueInArray) {
    return currentArrayOfValues;
  }
  return currentArrayOfValues.slice(0, index).concat(currentArrayOfValues.slice(index + 1));
}
var useIsomorphicLayoutEffect = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined" ? useLayoutEffect : useEffect;
function useEventCallback(fn) {
  var ref = useRef(fn);
  useIsomorphicLayoutEffect(function() {
    ref.current = fn;
  });
  return useCallback(function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return ref.current.apply(void 0, args);
  }, []);
}
var Form = /* @__PURE__ */ forwardRef(function(props, ref) {
  var action = props.action, rest = _objectWithoutPropertiesLoose(props, ["action"]);
  var _action = action != null ? action : "#";
  var _useFormikContext = useFormikContext(), handleReset = _useFormikContext.handleReset, handleSubmit = _useFormikContext.handleSubmit;
  return createElement("form", Object.assign({
    onSubmit: handleSubmit,
    ref,
    onReset: handleReset,
    action: _action
  }, rest));
});
Form.displayName = "Form";
var mark = { exports: {} };
/*!***************************************************
* mark.js v8.11.1
* https://markjs.io/
* Copyright (c) 2014–2018, Julian Kühnel
* Released under the MIT license https://git.io/vwTVl
*****************************************************/
(function(module2, exports2) {
  (function(global2, factory) {
    module2.exports = factory();
  })(commonjsGlobal, function() {
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var classCallCheck = function(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };
    var createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    var _extends2 = Object.assign || function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    var DOMIterator = function() {
      function DOMIterator2(ctx) {
        var iframes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        var exclude = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
        var iframesTimeout = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 5e3;
        classCallCheck(this, DOMIterator2);
        this.ctx = ctx;
        this.iframes = iframes;
        this.exclude = exclude;
        this.iframesTimeout = iframesTimeout;
      }
      createClass(DOMIterator2, [{
        key: "getContexts",
        value: function getContexts() {
          var ctx = void 0, filteredCtx = [];
          if (typeof this.ctx === "undefined" || !this.ctx) {
            ctx = [];
          } else if (NodeList.prototype.isPrototypeOf(this.ctx)) {
            ctx = Array.prototype.slice.call(this.ctx);
          } else if (Array.isArray(this.ctx)) {
            ctx = this.ctx;
          } else if (typeof this.ctx === "string") {
            ctx = Array.prototype.slice.call(document.querySelectorAll(this.ctx));
          } else {
            ctx = [this.ctx];
          }
          ctx.forEach(function(ctx2) {
            var isDescendant = filteredCtx.filter(function(contexts) {
              return contexts.contains(ctx2);
            }).length > 0;
            if (filteredCtx.indexOf(ctx2) === -1 && !isDescendant) {
              filteredCtx.push(ctx2);
            }
          });
          return filteredCtx;
        }
      }, {
        key: "getIframeContents",
        value: function getIframeContents(ifr, successFn) {
          var errorFn = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function() {
          };
          var doc = void 0;
          try {
            var ifrWin = ifr.contentWindow;
            doc = ifrWin.document;
            if (!ifrWin || !doc) {
              throw new Error("iframe inaccessible");
            }
          } catch (e2) {
            errorFn();
          }
          if (doc) {
            successFn(doc);
          }
        }
      }, {
        key: "isIframeBlank",
        value: function isIframeBlank(ifr) {
          var bl = "about:blank", src = ifr.getAttribute("src").trim(), href = ifr.contentWindow.location.href;
          return href === bl && src !== bl && src;
        }
      }, {
        key: "observeIframeLoad",
        value: function observeIframeLoad(ifr, successFn, errorFn) {
          var _this = this;
          var called = false, tout = null;
          var listener = function listener2() {
            if (called) {
              return;
            }
            called = true;
            clearTimeout(tout);
            try {
              if (!_this.isIframeBlank(ifr)) {
                ifr.removeEventListener("load", listener2);
                _this.getIframeContents(ifr, successFn, errorFn);
              }
            } catch (e2) {
              errorFn();
            }
          };
          ifr.addEventListener("load", listener);
          tout = setTimeout(listener, this.iframesTimeout);
        }
      }, {
        key: "onIframeReady",
        value: function onIframeReady(ifr, successFn, errorFn) {
          try {
            if (ifr.contentWindow.document.readyState === "complete") {
              if (this.isIframeBlank(ifr)) {
                this.observeIframeLoad(ifr, successFn, errorFn);
              } else {
                this.getIframeContents(ifr, successFn, errorFn);
              }
            } else {
              this.observeIframeLoad(ifr, successFn, errorFn);
            }
          } catch (e2) {
            errorFn();
          }
        }
      }, {
        key: "waitForIframes",
        value: function waitForIframes(ctx, done) {
          var _this2 = this;
          var eachCalled = 0;
          this.forEachIframe(ctx, function() {
            return true;
          }, function(ifr) {
            eachCalled++;
            _this2.waitForIframes(ifr.querySelector("html"), function() {
              if (!--eachCalled) {
                done();
              }
            });
          }, function(handled) {
            if (!handled) {
              done();
            }
          });
        }
      }, {
        key: "forEachIframe",
        value: function forEachIframe(ctx, filter, each) {
          var _this3 = this;
          var end = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : function() {
          };
          var ifr = ctx.querySelectorAll("iframe"), open = ifr.length, handled = 0;
          ifr = Array.prototype.slice.call(ifr);
          var checkEnd = function checkEnd2() {
            if (--open <= 0) {
              end(handled);
            }
          };
          if (!open) {
            checkEnd();
          }
          ifr.forEach(function(ifr2) {
            if (DOMIterator2.matches(ifr2, _this3.exclude)) {
              checkEnd();
            } else {
              _this3.onIframeReady(ifr2, function(con) {
                if (filter(ifr2)) {
                  handled++;
                  each(con);
                }
                checkEnd();
              }, checkEnd);
            }
          });
        }
      }, {
        key: "createIterator",
        value: function createIterator(ctx, whatToShow, filter) {
          return document.createNodeIterator(ctx, whatToShow, filter, false);
        }
      }, {
        key: "createInstanceOnIframe",
        value: function createInstanceOnIframe(contents) {
          return new DOMIterator2(contents.querySelector("html"), this.iframes);
        }
      }, {
        key: "compareNodeIframe",
        value: function compareNodeIframe(node2, prevNode, ifr) {
          var compCurr = node2.compareDocumentPosition(ifr), prev2 = Node.DOCUMENT_POSITION_PRECEDING;
          if (compCurr & prev2) {
            if (prevNode !== null) {
              var compPrev = prevNode.compareDocumentPosition(ifr), after = Node.DOCUMENT_POSITION_FOLLOWING;
              if (compPrev & after) {
                return true;
              }
            } else {
              return true;
            }
          }
          return false;
        }
      }, {
        key: "getIteratorNode",
        value: function getIteratorNode(itr) {
          var prevNode = itr.previousNode();
          var node2 = void 0;
          if (prevNode === null) {
            node2 = itr.nextNode();
          } else {
            node2 = itr.nextNode() && itr.nextNode();
          }
          return {
            prevNode,
            node: node2
          };
        }
      }, {
        key: "checkIframeFilter",
        value: function checkIframeFilter(node2, prevNode, currIfr, ifr) {
          var key = false, handled = false;
          ifr.forEach(function(ifrDict, i) {
            if (ifrDict.val === currIfr) {
              key = i;
              handled = ifrDict.handled;
            }
          });
          if (this.compareNodeIframe(node2, prevNode, currIfr)) {
            if (key === false && !handled) {
              ifr.push({
                val: currIfr,
                handled: true
              });
            } else if (key !== false && !handled) {
              ifr[key].handled = true;
            }
            return true;
          }
          if (key === false) {
            ifr.push({
              val: currIfr,
              handled: false
            });
          }
          return false;
        }
      }, {
        key: "handleOpenIframes",
        value: function handleOpenIframes(ifr, whatToShow, eCb, fCb) {
          var _this4 = this;
          ifr.forEach(function(ifrDict) {
            if (!ifrDict.handled) {
              _this4.getIframeContents(ifrDict.val, function(con) {
                _this4.createInstanceOnIframe(con).forEachNode(whatToShow, eCb, fCb);
              });
            }
          });
        }
      }, {
        key: "iterateThroughNodes",
        value: function iterateThroughNodes(whatToShow, ctx, eachCb, filterCb, doneCb) {
          var _this5 = this;
          var itr = this.createIterator(ctx, whatToShow, filterCb);
          var ifr = [], elements = [], node2 = void 0, prevNode = void 0, retrieveNodes = function retrieveNodes2() {
            var _getIteratorNode = _this5.getIteratorNode(itr);
            prevNode = _getIteratorNode.prevNode;
            node2 = _getIteratorNode.node;
            return node2;
          };
          while (retrieveNodes()) {
            if (this.iframes) {
              this.forEachIframe(ctx, function(currIfr) {
                return _this5.checkIframeFilter(node2, prevNode, currIfr, ifr);
              }, function(con) {
                _this5.createInstanceOnIframe(con).forEachNode(whatToShow, function(ifrNode) {
                  return elements.push(ifrNode);
                }, filterCb);
              });
            }
            elements.push(node2);
          }
          elements.forEach(function(node3) {
            eachCb(node3);
          });
          if (this.iframes) {
            this.handleOpenIframes(ifr, whatToShow, eachCb, filterCb);
          }
          doneCb();
        }
      }, {
        key: "forEachNode",
        value: function forEachNode(whatToShow, each, filter) {
          var _this6 = this;
          var done = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : function() {
          };
          var contexts = this.getContexts();
          var open = contexts.length;
          if (!open) {
            done();
          }
          contexts.forEach(function(ctx) {
            var ready = function ready2() {
              _this6.iterateThroughNodes(whatToShow, ctx, each, filter, function() {
                if (--open <= 0) {
                  done();
                }
              });
            };
            if (_this6.iframes) {
              _this6.waitForIframes(ctx, ready);
            } else {
              ready();
            }
          });
        }
      }], [{
        key: "matches",
        value: function matches(element, selector) {
          var selectors = typeof selector === "string" ? [selector] : selector, fn = element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector;
          if (fn) {
            var match2 = false;
            selectors.every(function(sel) {
              if (fn.call(element, sel)) {
                match2 = true;
                return false;
              }
              return true;
            });
            return match2;
          } else {
            return false;
          }
        }
      }]);
      return DOMIterator2;
    }();
    var Mark$1 = function() {
      function Mark3(ctx) {
        classCallCheck(this, Mark3);
        this.ctx = ctx;
        this.ie = false;
        var ua = window.navigator.userAgent;
        if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) {
          this.ie = true;
        }
      }
      createClass(Mark3, [{
        key: "log",
        value: function log(msg) {
          var level = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "debug";
          var log2 = this.opt.log;
          if (!this.opt.debug) {
            return;
          }
          if ((typeof log2 === "undefined" ? "undefined" : _typeof(log2)) === "object" && typeof log2[level] === "function") {
            log2[level]("mark.js: " + msg);
          }
        }
      }, {
        key: "escapeStr",
        value: function escapeStr(str) {
          return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
      }, {
        key: "createRegExp",
        value: function createRegExp(str) {
          if (this.opt.wildcards !== "disabled") {
            str = this.setupWildcardsRegExp(str);
          }
          str = this.escapeStr(str);
          if (Object.keys(this.opt.synonyms).length) {
            str = this.createSynonymsRegExp(str);
          }
          if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
            str = this.setupIgnoreJoinersRegExp(str);
          }
          if (this.opt.diacritics) {
            str = this.createDiacriticsRegExp(str);
          }
          str = this.createMergedBlanksRegExp(str);
          if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
            str = this.createJoinersRegExp(str);
          }
          if (this.opt.wildcards !== "disabled") {
            str = this.createWildcardsRegExp(str);
          }
          str = this.createAccuracyRegExp(str);
          return str;
        }
      }, {
        key: "createSynonymsRegExp",
        value: function createSynonymsRegExp(str) {
          var syn = this.opt.synonyms, sens = this.opt.caseSensitive ? "" : "i", joinerPlaceholder = this.opt.ignoreJoiners || this.opt.ignorePunctuation.length ? "\0" : "";
          for (var index in syn) {
            if (syn.hasOwnProperty(index)) {
              var value = syn[index], k1 = this.opt.wildcards !== "disabled" ? this.setupWildcardsRegExp(index) : this.escapeStr(index), k2 = this.opt.wildcards !== "disabled" ? this.setupWildcardsRegExp(value) : this.escapeStr(value);
              if (k1 !== "" && k2 !== "") {
                str = str.replace(new RegExp("(" + this.escapeStr(k1) + "|" + this.escapeStr(k2) + ")", "gm" + sens), joinerPlaceholder + ("(" + this.processSynomyms(k1) + "|") + (this.processSynomyms(k2) + ")") + joinerPlaceholder);
              }
            }
          }
          return str;
        }
      }, {
        key: "processSynomyms",
        value: function processSynomyms(str) {
          if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
            str = this.setupIgnoreJoinersRegExp(str);
          }
          return str;
        }
      }, {
        key: "setupWildcardsRegExp",
        value: function setupWildcardsRegExp(str) {
          str = str.replace(/(?:\\)*\?/g, function(val) {
            return val.charAt(0) === "\\" ? "?" : "";
          });
          return str.replace(/(?:\\)*\*/g, function(val) {
            return val.charAt(0) === "\\" ? "*" : "";
          });
        }
      }, {
        key: "createWildcardsRegExp",
        value: function createWildcardsRegExp(str) {
          var spaces = this.opt.wildcards === "withSpaces";
          return str.replace(/\u0001/g, spaces ? "[\\S\\s]?" : "\\S?").replace(/\u0002/g, spaces ? "[\\S\\s]*?" : "\\S*");
        }
      }, {
        key: "setupIgnoreJoinersRegExp",
        value: function setupIgnoreJoinersRegExp(str) {
          return str.replace(/[^(|)\\]/g, function(val, indx, original) {
            var nextChar = original.charAt(indx + 1);
            if (/[(|)\\]/.test(nextChar) || nextChar === "") {
              return val;
            } else {
              return val + "\0";
            }
          });
        }
      }, {
        key: "createJoinersRegExp",
        value: function createJoinersRegExp(str) {
          var joiner = [];
          var ignorePunctuation = this.opt.ignorePunctuation;
          if (Array.isArray(ignorePunctuation) && ignorePunctuation.length) {
            joiner.push(this.escapeStr(ignorePunctuation.join("")));
          }
          if (this.opt.ignoreJoiners) {
            joiner.push("\\u00ad\\u200b\\u200c\\u200d");
          }
          return joiner.length ? str.split(/\u0000+/).join("[" + joiner.join("") + "]*") : str;
        }
      }, {
        key: "createDiacriticsRegExp",
        value: function createDiacriticsRegExp(str) {
          var sens = this.opt.caseSensitive ? "" : "i", dct = this.opt.caseSensitive ? ["a\xE0\xE1\u1EA3\xE3\u1EA1\u0103\u1EB1\u1EAF\u1EB3\u1EB5\u1EB7\xE2\u1EA7\u1EA5\u1EA9\u1EAB\u1EAD\xE4\xE5\u0101\u0105", "A\xC0\xC1\u1EA2\xC3\u1EA0\u0102\u1EB0\u1EAE\u1EB2\u1EB4\u1EB6\xC2\u1EA6\u1EA4\u1EA8\u1EAA\u1EAC\xC4\xC5\u0100\u0104", "c\xE7\u0107\u010D", "C\xC7\u0106\u010C", "d\u0111\u010F", "D\u0110\u010E", "e\xE8\xE9\u1EBB\u1EBD\u1EB9\xEA\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7\xEB\u011B\u0113\u0119", "E\xC8\xC9\u1EBA\u1EBC\u1EB8\xCA\u1EC0\u1EBE\u1EC2\u1EC4\u1EC6\xCB\u011A\u0112\u0118", "i\xEC\xED\u1EC9\u0129\u1ECB\xEE\xEF\u012B", "I\xCC\xCD\u1EC8\u0128\u1ECA\xCE\xCF\u012A", "l\u0142", "L\u0141", "n\xF1\u0148\u0144", "N\xD1\u0147\u0143", "o\xF2\xF3\u1ECF\xF5\u1ECD\xF4\u1ED3\u1ED1\u1ED5\u1ED7\u1ED9\u01A1\u1EDF\u1EE1\u1EDB\u1EDD\u1EE3\xF6\xF8\u014D", "O\xD2\xD3\u1ECE\xD5\u1ECC\xD4\u1ED2\u1ED0\u1ED4\u1ED6\u1ED8\u01A0\u1EDE\u1EE0\u1EDA\u1EDC\u1EE2\xD6\xD8\u014C", "r\u0159", "R\u0158", "s\u0161\u015B\u0219\u015F", "S\u0160\u015A\u0218\u015E", "t\u0165\u021B\u0163", "T\u0164\u021A\u0162", "u\xF9\xFA\u1EE7\u0169\u1EE5\u01B0\u1EEB\u1EE9\u1EED\u1EEF\u1EF1\xFB\xFC\u016F\u016B", "U\xD9\xDA\u1EE6\u0168\u1EE4\u01AF\u1EEA\u1EE8\u1EEC\u1EEE\u1EF0\xDB\xDC\u016E\u016A", "y\xFD\u1EF3\u1EF7\u1EF9\u1EF5\xFF", "Y\xDD\u1EF2\u1EF6\u1EF8\u1EF4\u0178", "z\u017E\u017C\u017A", "Z\u017D\u017B\u0179"] : ["a\xE0\xE1\u1EA3\xE3\u1EA1\u0103\u1EB1\u1EAF\u1EB3\u1EB5\u1EB7\xE2\u1EA7\u1EA5\u1EA9\u1EAB\u1EAD\xE4\xE5\u0101\u0105A\xC0\xC1\u1EA2\xC3\u1EA0\u0102\u1EB0\u1EAE\u1EB2\u1EB4\u1EB6\xC2\u1EA6\u1EA4\u1EA8\u1EAA\u1EAC\xC4\xC5\u0100\u0104", "c\xE7\u0107\u010DC\xC7\u0106\u010C", "d\u0111\u010FD\u0110\u010E", "e\xE8\xE9\u1EBB\u1EBD\u1EB9\xEA\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7\xEB\u011B\u0113\u0119E\xC8\xC9\u1EBA\u1EBC\u1EB8\xCA\u1EC0\u1EBE\u1EC2\u1EC4\u1EC6\xCB\u011A\u0112\u0118", "i\xEC\xED\u1EC9\u0129\u1ECB\xEE\xEF\u012BI\xCC\xCD\u1EC8\u0128\u1ECA\xCE\xCF\u012A", "l\u0142L\u0141", "n\xF1\u0148\u0144N\xD1\u0147\u0143", "o\xF2\xF3\u1ECF\xF5\u1ECD\xF4\u1ED3\u1ED1\u1ED5\u1ED7\u1ED9\u01A1\u1EDF\u1EE1\u1EDB\u1EDD\u1EE3\xF6\xF8\u014DO\xD2\xD3\u1ECE\xD5\u1ECC\xD4\u1ED2\u1ED0\u1ED4\u1ED6\u1ED8\u01A0\u1EDE\u1EE0\u1EDA\u1EDC\u1EE2\xD6\xD8\u014C", "r\u0159R\u0158", "s\u0161\u015B\u0219\u015FS\u0160\u015A\u0218\u015E", "t\u0165\u021B\u0163T\u0164\u021A\u0162", "u\xF9\xFA\u1EE7\u0169\u1EE5\u01B0\u1EEB\u1EE9\u1EED\u1EEF\u1EF1\xFB\xFC\u016F\u016BU\xD9\xDA\u1EE6\u0168\u1EE4\u01AF\u1EEA\u1EE8\u1EEC\u1EEE\u1EF0\xDB\xDC\u016E\u016A", "y\xFD\u1EF3\u1EF7\u1EF9\u1EF5\xFFY\xDD\u1EF2\u1EF6\u1EF8\u1EF4\u0178", "z\u017E\u017C\u017AZ\u017D\u017B\u0179"];
          var handled = [];
          str.split("").forEach(function(ch) {
            dct.every(function(dct2) {
              if (dct2.indexOf(ch) !== -1) {
                if (handled.indexOf(dct2) > -1) {
                  return false;
                }
                str = str.replace(new RegExp("[" + dct2 + "]", "gm" + sens), "[" + dct2 + "]");
                handled.push(dct2);
              }
              return true;
            });
          });
          return str;
        }
      }, {
        key: "createMergedBlanksRegExp",
        value: function createMergedBlanksRegExp(str) {
          return str.replace(/[\s]+/gmi, "[\\s]+");
        }
      }, {
        key: "createAccuracyRegExp",
        value: function createAccuracyRegExp(str) {
          var _this = this;
          var chars = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~\xA1\xBF";
          var acc = this.opt.accuracy, val = typeof acc === "string" ? acc : acc.value, ls = typeof acc === "string" ? [] : acc.limiters, lsJoin = "";
          ls.forEach(function(limiter) {
            lsJoin += "|" + _this.escapeStr(limiter);
          });
          switch (val) {
            case "partially":
            default:
              return "()(" + str + ")";
            case "complementary":
              lsJoin = "\\s" + (lsJoin ? lsJoin : this.escapeStr(chars));
              return "()([^" + lsJoin + "]*" + str + "[^" + lsJoin + "]*)";
            case "exactly":
              return "(^|\\s" + lsJoin + ")(" + str + ")(?=$|\\s" + lsJoin + ")";
          }
        }
      }, {
        key: "getSeparatedKeywords",
        value: function getSeparatedKeywords(sv) {
          var _this2 = this;
          var stack = [];
          sv.forEach(function(kw) {
            if (!_this2.opt.separateWordSearch) {
              if (kw.trim() && stack.indexOf(kw) === -1) {
                stack.push(kw);
              }
            } else {
              kw.split(" ").forEach(function(kwSplitted) {
                if (kwSplitted.trim() && stack.indexOf(kwSplitted) === -1) {
                  stack.push(kwSplitted);
                }
              });
            }
          });
          return {
            "keywords": stack.sort(function(a, b2) {
              return b2.length - a.length;
            }),
            "length": stack.length
          };
        }
      }, {
        key: "isNumeric",
        value: function isNumeric(value) {
          return Number(parseFloat(value)) == value;
        }
      }, {
        key: "checkRanges",
        value: function checkRanges(array) {
          var _this3 = this;
          if (!Array.isArray(array) || Object.prototype.toString.call(array[0]) !== "[object Object]") {
            this.log("markRanges() will only accept an array of objects");
            this.opt.noMatch(array);
            return [];
          }
          var stack = [];
          var last = 0;
          array.sort(function(a, b2) {
            return a.start - b2.start;
          }).forEach(function(item) {
            var _callNoMatchOnInvalid = _this3.callNoMatchOnInvalidRanges(item, last), start = _callNoMatchOnInvalid.start, end = _callNoMatchOnInvalid.end, valid = _callNoMatchOnInvalid.valid;
            if (valid) {
              item.start = start;
              item.length = end - start;
              stack.push(item);
              last = end;
            }
          });
          return stack;
        }
      }, {
        key: "callNoMatchOnInvalidRanges",
        value: function callNoMatchOnInvalidRanges(range, last) {
          var start = void 0, end = void 0, valid = false;
          if (range && typeof range.start !== "undefined") {
            start = parseInt(range.start, 10);
            end = start + parseInt(range.length, 10);
            if (this.isNumeric(range.start) && this.isNumeric(range.length) && end - last > 0 && end - start > 0) {
              valid = true;
            } else {
              this.log("Ignoring invalid or overlapping range: " + ("" + JSON.stringify(range)));
              this.opt.noMatch(range);
            }
          } else {
            this.log("Ignoring invalid range: " + JSON.stringify(range));
            this.opt.noMatch(range);
          }
          return {
            start,
            end,
            valid
          };
        }
      }, {
        key: "checkWhitespaceRanges",
        value: function checkWhitespaceRanges(range, originalLength, string) {
          var end = void 0, valid = true, max = string.length, offset = originalLength - max, start = parseInt(range.start, 10) - offset;
          start = start > max ? max : start;
          end = start + parseInt(range.length, 10);
          if (end > max) {
            end = max;
            this.log("End range automatically set to the max value of " + max);
          }
          if (start < 0 || end - start < 0 || start > max || end > max) {
            valid = false;
            this.log("Invalid range: " + JSON.stringify(range));
            this.opt.noMatch(range);
          } else if (string.substring(start, end).replace(/\s+/g, "") === "") {
            valid = false;
            this.log("Skipping whitespace only range: " + JSON.stringify(range));
            this.opt.noMatch(range);
          }
          return {
            start,
            end,
            valid
          };
        }
      }, {
        key: "getTextNodes",
        value: function getTextNodes(cb) {
          var _this4 = this;
          var val = "", nodes = [];
          this.iterator.forEachNode(NodeFilter.SHOW_TEXT, function(node2) {
            nodes.push({
              start: val.length,
              end: (val += node2.textContent).length,
              node: node2
            });
          }, function(node2) {
            if (_this4.matchesExclude(node2.parentNode)) {
              return NodeFilter.FILTER_REJECT;
            } else {
              return NodeFilter.FILTER_ACCEPT;
            }
          }, function() {
            cb({
              value: val,
              nodes
            });
          });
        }
      }, {
        key: "matchesExclude",
        value: function matchesExclude(el) {
          return DOMIterator.matches(el, this.opt.exclude.concat(["script", "style", "title", "head", "html"]));
        }
      }, {
        key: "wrapRangeInTextNode",
        value: function wrapRangeInTextNode(node2, start, end) {
          var hEl = !this.opt.element ? "mark" : this.opt.element, startNode = node2.splitText(start), ret = startNode.splitText(end - start);
          var repl = document.createElement(hEl);
          repl.setAttribute("data-markjs", "true");
          if (this.opt.className) {
            repl.setAttribute("class", this.opt.className);
          }
          repl.textContent = startNode.textContent;
          startNode.parentNode.replaceChild(repl, startNode);
          return ret;
        }
      }, {
        key: "wrapRangeInMappedTextNode",
        value: function wrapRangeInMappedTextNode(dict, start, end, filterCb, eachCb) {
          var _this5 = this;
          dict.nodes.every(function(n2, i) {
            var sibl = dict.nodes[i + 1];
            if (typeof sibl === "undefined" || sibl.start > start) {
              if (!filterCb(n2.node)) {
                return false;
              }
              var s = start - n2.start, e2 = (end > n2.end ? n2.end : end) - n2.start, startStr = dict.value.substr(0, n2.start), endStr = dict.value.substr(e2 + n2.start);
              n2.node = _this5.wrapRangeInTextNode(n2.node, s, e2);
              dict.value = startStr + endStr;
              dict.nodes.forEach(function(k2, j) {
                if (j >= i) {
                  if (dict.nodes[j].start > 0 && j !== i) {
                    dict.nodes[j].start -= e2;
                  }
                  dict.nodes[j].end -= e2;
                }
              });
              end -= e2;
              eachCb(n2.node.previousSibling, n2.start);
              if (end > n2.end) {
                start = n2.end;
              } else {
                return false;
              }
            }
            return true;
          });
        }
      }, {
        key: "wrapMatches",
        value: function wrapMatches(regex, ignoreGroups, filterCb, eachCb, endCb) {
          var _this6 = this;
          var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
          this.getTextNodes(function(dict) {
            dict.nodes.forEach(function(node2) {
              node2 = node2.node;
              var match2 = void 0;
              while ((match2 = regex.exec(node2.textContent)) !== null && match2[matchIdx] !== "") {
                if (!filterCb(match2[matchIdx], node2)) {
                  continue;
                }
                var pos = match2.index;
                if (matchIdx !== 0) {
                  for (var i = 1; i < matchIdx; i++) {
                    pos += match2[i].length;
                  }
                }
                node2 = _this6.wrapRangeInTextNode(node2, pos, pos + match2[matchIdx].length);
                eachCb(node2.previousSibling);
                regex.lastIndex = 0;
              }
            });
            endCb();
          });
        }
      }, {
        key: "wrapMatchesAcrossElements",
        value: function wrapMatchesAcrossElements(regex, ignoreGroups, filterCb, eachCb, endCb) {
          var _this7 = this;
          var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
          this.getTextNodes(function(dict) {
            var match2 = void 0;
            while ((match2 = regex.exec(dict.value)) !== null && match2[matchIdx] !== "") {
              var start = match2.index;
              if (matchIdx !== 0) {
                for (var i = 1; i < matchIdx; i++) {
                  start += match2[i].length;
                }
              }
              var end = start + match2[matchIdx].length;
              _this7.wrapRangeInMappedTextNode(dict, start, end, function(node2) {
                return filterCb(match2[matchIdx], node2);
              }, function(node2, lastIndex) {
                regex.lastIndex = lastIndex;
                eachCb(node2);
              });
            }
            endCb();
          });
        }
      }, {
        key: "wrapRangeFromIndex",
        value: function wrapRangeFromIndex(ranges, filterCb, eachCb, endCb) {
          var _this8 = this;
          this.getTextNodes(function(dict) {
            var originalLength = dict.value.length;
            ranges.forEach(function(range, counter) {
              var _checkWhitespaceRange = _this8.checkWhitespaceRanges(range, originalLength, dict.value), start = _checkWhitespaceRange.start, end = _checkWhitespaceRange.end, valid = _checkWhitespaceRange.valid;
              if (valid) {
                _this8.wrapRangeInMappedTextNode(dict, start, end, function(node2) {
                  return filterCb(node2, range, dict.value.substring(start, end), counter);
                }, function(node2) {
                  eachCb(node2, range);
                });
              }
            });
            endCb();
          });
        }
      }, {
        key: "unwrapMatches",
        value: function unwrapMatches(node2) {
          var parent = node2.parentNode;
          var docFrag = document.createDocumentFragment();
          while (node2.firstChild) {
            docFrag.appendChild(node2.removeChild(node2.firstChild));
          }
          parent.replaceChild(docFrag, node2);
          if (!this.ie) {
            parent.normalize();
          } else {
            this.normalizeTextNode(parent);
          }
        }
      }, {
        key: "normalizeTextNode",
        value: function normalizeTextNode(node2) {
          if (!node2) {
            return;
          }
          if (node2.nodeType === 3) {
            while (node2.nextSibling && node2.nextSibling.nodeType === 3) {
              node2.nodeValue += node2.nextSibling.nodeValue;
              node2.parentNode.removeChild(node2.nextSibling);
            }
          } else {
            this.normalizeTextNode(node2.firstChild);
          }
          this.normalizeTextNode(node2.nextSibling);
        }
      }, {
        key: "markRegExp",
        value: function markRegExp(regexp, opt) {
          var _this9 = this;
          this.opt = opt;
          this.log('Searching with expression "' + regexp + '"');
          var totalMatches = 0, fn = "wrapMatches";
          var eachCb = function eachCb2(element) {
            totalMatches++;
            _this9.opt.each(element);
          };
          if (this.opt.acrossElements) {
            fn = "wrapMatchesAcrossElements";
          }
          this[fn](regexp, this.opt.ignoreGroups, function(match2, node2) {
            return _this9.opt.filter(node2, match2, totalMatches);
          }, eachCb, function() {
            if (totalMatches === 0) {
              _this9.opt.noMatch(regexp);
            }
            _this9.opt.done(totalMatches);
          });
        }
      }, {
        key: "mark",
        value: function mark2(sv, opt) {
          var _this10 = this;
          this.opt = opt;
          var totalMatches = 0, fn = "wrapMatches";
          var _getSeparatedKeywords = this.getSeparatedKeywords(typeof sv === "string" ? [sv] : sv), kwArr = _getSeparatedKeywords.keywords, kwArrLen = _getSeparatedKeywords.length, sens = this.opt.caseSensitive ? "" : "i", handler = function handler2(kw) {
            var regex = new RegExp(_this10.createRegExp(kw), "gm" + sens), matches = 0;
            _this10.log('Searching with expression "' + regex + '"');
            _this10[fn](regex, 1, function(term, node2) {
              return _this10.opt.filter(node2, kw, totalMatches, matches);
            }, function(element) {
              matches++;
              totalMatches++;
              _this10.opt.each(element);
            }, function() {
              if (matches === 0) {
                _this10.opt.noMatch(kw);
              }
              if (kwArr[kwArrLen - 1] === kw) {
                _this10.opt.done(totalMatches);
              } else {
                handler2(kwArr[kwArr.indexOf(kw) + 1]);
              }
            });
          };
          if (this.opt.acrossElements) {
            fn = "wrapMatchesAcrossElements";
          }
          if (kwArrLen === 0) {
            this.opt.done(totalMatches);
          } else {
            handler(kwArr[0]);
          }
        }
      }, {
        key: "markRanges",
        value: function markRanges(rawRanges, opt) {
          var _this11 = this;
          this.opt = opt;
          var totalMatches = 0, ranges = this.checkRanges(rawRanges);
          if (ranges && ranges.length) {
            this.log("Starting to mark with the following ranges: " + JSON.stringify(ranges));
            this.wrapRangeFromIndex(ranges, function(node2, range, match2, counter) {
              return _this11.opt.filter(node2, range, match2, counter);
            }, function(element, range) {
              totalMatches++;
              _this11.opt.each(element, range);
            }, function() {
              _this11.opt.done(totalMatches);
            });
          } else {
            this.opt.done(totalMatches);
          }
        }
      }, {
        key: "unmark",
        value: function unmark(opt) {
          var _this12 = this;
          this.opt = opt;
          var sel = this.opt.element ? this.opt.element : "*";
          sel += "[data-markjs]";
          if (this.opt.className) {
            sel += "." + this.opt.className;
          }
          this.log('Removal selector "' + sel + '"');
          this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT, function(node2) {
            _this12.unwrapMatches(node2);
          }, function(node2) {
            var matchesSel = DOMIterator.matches(node2, sel), matchesExclude = _this12.matchesExclude(node2);
            if (!matchesSel || matchesExclude) {
              return NodeFilter.FILTER_REJECT;
            } else {
              return NodeFilter.FILTER_ACCEPT;
            }
          }, this.opt.done);
        }
      }, {
        key: "opt",
        set: function set$$1(val) {
          this._opt = _extends2({}, {
            "element": "",
            "className": "",
            "exclude": [],
            "iframes": false,
            "iframesTimeout": 5e3,
            "separateWordSearch": true,
            "diacritics": true,
            "synonyms": {},
            "accuracy": "partially",
            "acrossElements": false,
            "caseSensitive": false,
            "ignoreJoiners": false,
            "ignoreGroups": 0,
            "ignorePunctuation": [],
            "wildcards": "disabled",
            "each": function each() {
            },
            "noMatch": function noMatch() {
            },
            "filter": function filter() {
              return true;
            },
            "done": function done() {
            },
            "debug": false,
            "log": window.console
          }, val);
        },
        get: function get$$1() {
          return this._opt;
        }
      }, {
        key: "iterator",
        get: function get$$1() {
          return new DOMIterator(this.ctx, this.opt.iframes, this.opt.exclude, this.opt.iframesTimeout);
        }
      }]);
      return Mark3;
    }();
    function Mark2(ctx) {
      var _this = this;
      var instance = new Mark$1(ctx);
      this.mark = function(sv, opt) {
        instance.mark(sv, opt);
        return _this;
      };
      this.markRegExp = function(sv, opt) {
        instance.markRegExp(sv, opt);
        return _this;
      };
      this.markRanges = function(sv, opt) {
        instance.markRanges(sv, opt);
        return _this;
      };
      this.unmark = function(opt) {
        instance.unmark(opt);
        return _this;
      };
      return this;
    }
    return Mark2;
  });
})(mark);
var Mark = mark.exports;
const HighlightSearchTerms = (props) => {
  const [markInstance, setMarkInstance] = useState();
  const highlightRoot = useRef(null);
  React__default.useEffect(() => {
    if (highlightRoot.current) {
      setMarkInstance(new Mark(highlightRoot.current));
    }
  }, [highlightRoot.current]);
  useEffect(() => {
    if (markInstance)
      markInstance.unmark({
        done: () => {
          if (props.searchString)
            markInstance.mark(props.searchString);
        }
      });
  }, [props.searchString, props.focussedSubPagePath]);
  return /* @__PURE__ */ jsx("div", {
    ref: highlightRoot
  }, props.children);
};
const SearchContext = React__default.createContext({
  searchString: "",
  searchRegEx: null,
  setSearchString: (searchString) => {
  }
});
const SearchContextProvider = (props) => {
  const defaultSearch = "";
  const [searchString, setSearchString] = useState(defaultSearch);
  const handleSet = (value) => {
    if (!value || !value.trim()) {
      setSearchString(null);
    } else {
      setSearchString(value);
    }
  };
  return /* @__PURE__ */ jsx(SearchContext.Provider, {
    value: {
      searchString,
      searchRegEx: searchString ? new RegExp(searchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi") : null,
      setSearchString: handleSet
    }
  }, props.children);
};
const FocusPageContext = React__default.createContext({
  focussedSubPagePath: "",
  setFocussedSubPagePath: (p2) => {
  }
});
const ContentPane = (props) => {
  const [focussedSubPagePath, setFocussedSubPagePath] = useState("");
  return /* @__PURE__ */ jsx(FocusPageContext.Provider, {
    value: {
      focussedSubPagePath,
      setFocussedSubPagePath
    }
  }, /* @__PURE__ */ jsx(Formik, {
    initialValues: props.initialValues,
    onSubmit: (values2) => {
    }
  }, ({
    values: values2,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  }) => {
    if (props.setValueGetter)
      props.setValueGetter(() => {
        return values2;
      });
    if (props.setValueOnRender)
      props.setValueOnRender(() => {
        return values2;
      });
    return /* @__PURE__ */ jsx("form", {
      onSubmit: handleSubmit,
      css: css`
                flex-grow: 1;
              `
    }, /* @__PURE__ */ jsx(VisibleGroups, {
      currentGroup: props.currentGroupIndex,
      focussedSubPagePath
    }, props.children));
  }));
};
const VisibleGroups = (props) => {
  return /* @__PURE__ */ jsx(SearchContext.Consumer, null, ({ searchString }) => {
    return /* @__PURE__ */ jsx("div", {
      id: "groups",
      css: css`
              width: 600px;
              //overflow-y: scroll; //allows us to scroll the groups without
              //scrolling the heading tabs
              overflow-y: auto;
            `
    }, searchString ? /* @__PURE__ */ jsx(HighlightSearchTerms, {
      searchString,
      focussedSubPagePath: props.focussedSubPagePath
    }, props.children) : React__default.Children.toArray(props.children).filter((c2, index) => index === props.currentGroup));
  });
};
const defaultConfigrTheme = {
  typography: {
    fontFamily: [
      "system-ui",
      '"Segoe UI"',
      "Roboto",
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    h2: {
      fontSize: "20px",
      fontWeight: "600"
    },
    h3: {
      fontSize: "14px",
      fontWeight: "600"
    },
    h4: {
      fontSize: "14px",
      fontWeight: "600"
    },
    caption: {
      fontSize: "12px",
      lineHeight: "14px",
      marginTop: "4px"
    }
  },
  components: {
    MuiSelect: {
      styleOverrides: { select: { fontSize: "14px" } }
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "rgb(234, 234, 234)" } }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: "14px",
          fontWeight: "600"
        }
      }
    }
  }
};
const ConfigrPane = (props) => {
  const [currentGroup, setcurrentGroup] = useState(0);
  const mergedTheme = createTheme(__spreadValues(__spreadValues({}, defaultConfigrTheme), props.themeOverrides));
  return /* @__PURE__ */ jsx(ThemeProvider, {
    theme: mergedTheme
  }, /* @__PURE__ */ jsx(SearchContextProvider, null, /* @__PURE__ */ jsx(SearchContext.Consumer, null, ({ searchString, setSearchString }) => {
    return /* @__PURE__ */ jsx(React__default.Fragment, null, /* @__PURE__ */ jsx(ConfigrAppBar, {
      label: props.label,
      searchValue: searchString,
      setSearchString: (s) => {
        if (searchString !== s) {
          setSearchString(s);
          setcurrentGroup(s ? void 0 : 0);
        }
      }
    }), /* @__PURE__ */ jsx("div", {
      css: css`
                    background-color: #f8f9fa;
                    height: 100%;
                    display: flex;
                    padding-right: 20px;

                    .MuiTab-wrapper {
                      text-align: left;
                      align-items: start;
                    }
                  `
    }, /* @__PURE__ */ jsx(GroupChooser, {
      currentGroup,
      setCurrentGroupIndex: setcurrentGroup
    }, props.children), /* @__PURE__ */ jsx(ContentPane, __spreadValues({
      currentGroupIndex: currentGroup
    }, props))));
  })));
};
const GroupChooser = (props) => {
  const groupLinks = useMemo(() => {
    return React__default.Children.map(props.children, (g2) => /* @__PURE__ */ jsx(Tab$1, {
      key: g2.props.label,
      label: g2.props.label,
      css: css`
          font-weight: 500;
          align-items: start;
          text-transform: unset;
          color: black;
          font-weight: 500;
          font-size: 13px;
        `
    }));
  }, [props.children]);
  return /* @__PURE__ */ jsx(SearchContext.Consumer, null, ({ searchString, setSearchString }) => {
    return /* @__PURE__ */ jsx(Tabs$1, {
      value: props.currentGroup === void 0 ? false : props.currentGroup,
      onChange: (event, index) => {
        if (searchString) {
          console.log("clearing search from onchange from tab");
          setSearchString("");
        }
        props.setCurrentGroupIndex(index);
      },
      centered: false,
      orientation: "vertical",
      css: css`
              min-width: 150px;
              padding-left: 12px;
              .MuiTabs-indicator {
                display: none;
              }
              .Mui-selected {
                font-weight: bold;
              }
            `
    }, groupLinks);
  });
};
export { ConfigrPane };
