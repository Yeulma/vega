(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-dsv'), require('topojson-client'), require('d3-array'), require('d3-format'), require('d3-time'), require('d3-time-format'), require('d3-shape'), require('d3-path'), require('d3-scale'), require('d3-interpolate'), require('d3-geo'), require('d3-color'), require('d3-force'), require('d3-hierarchy'), require('d3-delaunay'), require('d3-timer')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-dsv', 'topojson-client', 'd3-array', 'd3-format', 'd3-time', 'd3-time-format', 'd3-shape', 'd3-path', 'd3-scale', 'd3-interpolate', 'd3-geo', 'd3-color', 'd3-force', 'd3-hierarchy', 'd3-delaunay', 'd3-timer'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.vega = {}, global.d3, global.topojson, global.d3, global.d3, global.d3, global.d3, global.d3, global.d3, global.d3, global.d3, global.d3, global.d3, global.d3, global.d3, global.d3, global.d3));
})(this, (function (exports, d3Dsv, topojsonClient, d3Array, d3Format, d3Time, d3TimeFormat, d3Shape, d3Path, $$1, $$1$1, d3Geo, d3Color, d3Force, d3Hierarchy, d3Delaunay, d3Timer) { 'use strict';

  function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n.default = e;
    return Object.freeze(n);
  }

  var $__namespace = /*#__PURE__*/_interopNamespaceDefault($$1);
  var $$1__namespace = /*#__PURE__*/_interopNamespaceDefault($$1$1);

  function accessor(fn, fields, name) {
    fn.fields = fields || [];
    fn.fname = name;
    return fn;
  }
  function accessorName(fn) {
    return fn == null ? null : fn.fname;
  }
  function accessorFields(fn) {
    return fn == null ? null : fn.fields;
  }
  function getter(path) {
    return path.length === 1 ? get1(path[0]) : getN(path);
  }
  var get1 = function get1(field) {
    return function (obj) {
      return obj[field];
    };
  };
  var getN = function getN(path) {
    var len = path.length;
    return function (obj) {
      for (var i = 0; i < len; ++i) {
        obj = obj[path[i]];
      }
      return obj;
    };
  };
  function error(message) {
    throw Error(message);
  }
  function splitAccessPath(p) {
    var path = [],
      n = p.length;
    var q = null,
      b = 0,
      s = '',
      i,
      j,
      c;
    p = p + '';
    function push() {
      path.push(s + p.substring(i, j));
      s = '';
      i = j + 1;
    }
    for (i = j = 0; j < n; ++j) {
      c = p[j];
      if (c === '\\') {
        s += p.substring(i, j++);
        i = j;
      } else if (c === q) {
        push();
        q = null;
        b = -1;
      } else if (q) {
        continue;
      } else if (i === b && c === '"') {
        i = j + 1;
        q = c;
      } else if (i === b && c === "'") {
        i = j + 1;
        q = c;
      } else if (c === '.' && !b) {
        if (j > i) {
          push();
        } else {
          i = j + 1;
        }
      } else if (c === '[') {
        if (j > i) push();
        b = i = j + 1;
      } else if (c === ']') {
        if (!b) error('Access path missing open bracket: ' + p);
        if (b > 0) push();
        b = 0;
        i = j + 1;
      }
    }
    if (b) error('Access path missing closing bracket: ' + p);
    if (q) error('Access path missing closing quote: ' + p);
    if (j > i) {
      j++;
      push();
    }
    return path;
  }
  function field$1(field, name, opt) {
    var path = splitAccessPath(field);
    field = path.length === 1 ? path[0] : field;
    return accessor((opt && opt.get || getter)(path), [field], name || field);
  }
  var id = field$1('id');
  var identity = accessor(function (_) {
    return _;
  }, [], 'identity');
  var zero$1 = accessor(function () {
    return 0;
  }, [], 'zero');
  var one$1 = accessor(function () {
    return 1;
  }, [], 'one');
  var truthy = accessor(function () {
    return true;
  }, [], 'true');
  var falsy = accessor(function () {
    return false;
  }, [], 'false');
  function log$1$1(method, level, input) {
    var args = [level].concat([].slice.call(input));
    console[method].apply(console, args); // eslint-disable-line no-console
  }

  var None$2 = 0;
  var Error$1 = 1;
  var Warn = 2;
  var Info = 3;
  var Debug = 4;
  function logger(_, method) {
    var handler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : log$1$1;
    var _level = _ || None$2;
    return {
      level: function level(_) {
        if (arguments.length) {
          _level = +_;
          return this;
        } else {
          return _level;
        }
      },
      error: function error() {
        if (_level >= Error$1) handler(method || 'error', 'ERROR', arguments);
        return this;
      },
      warn: function warn() {
        if (_level >= Warn) handler(method || 'warn', 'WARN', arguments);
        return this;
      },
      info: function info() {
        if (_level >= Info) handler(method || 'log', 'INFO', arguments);
        return this;
      },
      debug: function debug() {
        if (_level >= Debug) handler(method || 'log', 'DEBUG', arguments);
        return this;
      }
    };
  }
  var isArray = Array.isArray;
  function isObject(_) {
    return _ === Object(_);
  }
  var isLegalKey = function isLegalKey(key) {
    return key !== '__proto__';
  };
  function mergeConfig() {
    for (var _len = arguments.length, configs = new Array(_len), _key = 0; _key < _len; _key++) {
      configs[_key] = arguments[_key];
    }
    return configs.reduce(function (out, source) {
      for (var _key2 in source) {
        if (_key2 === 'signals') {
          // for signals, we merge the signals arrays
          // source signals take precedence over
          // existing signals with the same name
          out.signals = mergeNamed(out.signals, source.signals);
        } else {
          // otherwise, merge objects subject to recursion constraints
          // for legend block, recurse for the layout entry only
          // for style block, recurse for all properties
          // otherwise, no recursion: objects overwrite, no merging
          var r = _key2 === 'legend' ? {
            layout: 1
          } : _key2 === 'style' ? true : null;
          writeConfig(out, _key2, source[_key2], r);
        }
      }
      return out;
    }, {});
  }
  function writeConfig(output, key, value, recurse) {
    if (!isLegalKey(key)) return;
    var k, o;
    if (isObject(value) && !isArray(value)) {
      o = isObject(output[key]) ? output[key] : output[key] = {};
      for (k in value) {
        if (recurse && (recurse === true || recurse[k])) {
          writeConfig(o, k, value[k]);
        } else if (isLegalKey(k)) {
          o[k] = value[k];
        }
      }
    } else {
      output[key] = value;
    }
  }
  function mergeNamed(a, b) {
    if (a == null) return b;
    var map = {},
      out = [];
    function add(_) {
      if (!map[_.name]) {
        map[_.name] = 1;
        out.push(_);
      }
    }
    b.forEach(add);
    a.forEach(add);
    return out;
  }
  function peek$1(array) {
    return array[array.length - 1];
  }
  function toNumber(_) {
    return _ == null || _ === '' ? null : +_;
  }
  var exp$1 = function exp(sign) {
    return function (x) {
      return sign * Math.exp(x);
    };
  };
  var log$2 = function log(sign) {
    return function (x) {
      return Math.log(sign * x);
    };
  };
  var symlog = function symlog(c) {
    return function (x) {
      return Math.sign(x) * Math.log1p(Math.abs(x / c));
    };
  };
  var symexp = function symexp(c) {
    return function (x) {
      return Math.sign(x) * Math.expm1(Math.abs(x)) * c;
    };
  };
  var pow$1 = function pow(exponent) {
    return function (x) {
      return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
    };
  };
  function pan(domain, delta, lift, ground) {
    var d0 = lift(domain[0]),
      d1 = lift(peek$1(domain)),
      dd = (d1 - d0) * delta;
    return [ground(d0 - dd), ground(d1 - dd)];
  }
  function panLinear(domain, delta) {
    return pan(domain, delta, toNumber, identity);
  }
  function panLog(domain, delta) {
    var sign = Math.sign(domain[0]);
    return pan(domain, delta, log$2(sign), exp$1(sign));
  }
  function panPow(domain, delta, exponent) {
    return pan(domain, delta, pow$1(exponent), pow$1(1 / exponent));
  }
  function panSymlog(domain, delta, constant) {
    return pan(domain, delta, symlog(constant), symexp(constant));
  }
  function zoom(domain, anchor, scale, lift, ground) {
    var d0 = lift(domain[0]),
      d1 = lift(peek$1(domain)),
      da = anchor != null ? lift(anchor) : (d0 + d1) / 2;
    return [ground(da + (d0 - da) * scale), ground(da + (d1 - da) * scale)];
  }
  function zoomLinear(domain, anchor, scale) {
    return zoom(domain, anchor, scale, toNumber, identity);
  }
  function zoomLog(domain, anchor, scale) {
    var sign = Math.sign(domain[0]);
    return zoom(domain, anchor, scale, log$2(sign), exp$1(sign));
  }
  function zoomPow(domain, anchor, scale, exponent) {
    return zoom(domain, anchor, scale, pow$1(exponent), pow$1(1 / exponent));
  }
  function zoomSymlog(domain, anchor, scale, constant) {
    return zoom(domain, anchor, scale, symlog(constant), symexp(constant));
  }
  function quarter(date) {
    return 1 + ~~(new Date(date).getMonth() / 3);
  }
  function utcquarter(date) {
    return 1 + ~~(new Date(date).getUTCMonth() / 3);
  }
  function array$2(_) {
    return _ != null ? isArray(_) ? _ : [_] : [];
  }

  /**
   * Span-preserving range clamp. If the span of the input range is less
   * than (max - min) and an endpoint exceeds either the min or max value,
   * the range is translated such that the span is preserved and one
   * endpoint touches the boundary of the min/max range.
   * If the span exceeds (max - min), the range [min, max] is returned.
   */
  function clampRange(range, min, max) {
    var lo = range[0],
      hi = range[1],
      span;
    if (hi < lo) {
      span = hi;
      hi = lo;
      lo = span;
    }
    span = hi - lo;
    return span >= max - min ? [min, max] : [lo = Math.min(Math.max(lo, min), max - span), lo + span];
  }
  function isFunction(_) {
    return typeof _ === 'function';
  }
  var DESCENDING = 'descending';
  function compare$1(fields, orders, opt) {
    opt = opt || {};
    orders = array$2(orders) || [];
    var ord = [],
      get = [],
      fmap = {},
      gen = opt.comparator || comparator;
    array$2(fields).forEach(function (f, i) {
      if (f == null) return;
      ord.push(orders[i] === DESCENDING ? -1 : 1);
      get.push(f = isFunction(f) ? f : field$1(f, null, opt));
      (accessorFields(f) || []).forEach(function (_) {
        return fmap[_] = 1;
      });
    });
    return get.length === 0 ? null : accessor(gen(get, ord), Object.keys(fmap));
  }
  var ascending$1 = function ascending(u, v) {
    return (u < v || u == null) && v != null ? -1 : (u > v || v == null) && u != null ? 1 : (v = v instanceof Date ? +v : v, u = u instanceof Date ? +u : u) !== u && v === v ? -1 : v !== v && u === u ? 1 : 0;
  };
  var comparator = function comparator(fields, orders) {
    return fields.length === 1 ? compare1(fields[0], orders[0]) : compareN(fields, orders, fields.length);
  };
  var compare1 = function compare1(field, order) {
    return function (a, b) {
      return ascending$1(field(a), field(b)) * order;
    };
  };
  var compareN = function compareN(fields, orders, n) {
    orders.push(0); // pad zero for convenient lookup
    return function (a, b) {
      var f,
        c = 0,
        i = -1;
      while (c === 0 && ++i < n) {
        f = fields[i];
        c = ascending$1(f(a), f(b));
      }
      return c * orders[i];
    };
  };
  function constant$1(_) {
    return isFunction(_) ? _ : function () {
      return _;
    };
  }
  function debounce(delay, handler) {
    var tid;
    return function (e) {
      if (tid) clearTimeout(tid);
      tid = setTimeout(function () {
        return handler(e), tid = null;
      }, delay);
    };
  }
  function extend(_) {
    for (var x, k, i = 1, len = arguments.length; i < len; ++i) {
      x = arguments[i];
      for (k in x) {
        _[k] = x[k];
      }
    }
    return _;
  }

  /**
   * Return an array with minimum and maximum values, in the
   * form [min, max]. Ignores null, undefined, and NaN values.
   */
  function extent(array, f) {
    var i = 0,
      n,
      v,
      min,
      max;
    if (array && (n = array.length)) {
      if (f == null) {
        // find first valid value
        for (v = array[i]; i < n && (v == null || v !== v); v = array[++i]);
        min = max = v;

        // visit all other values
        for (; i < n; ++i) {
          v = array[i];
          // skip null/undefined; NaN will fail all comparisons
          if (v != null) {
            if (v < min) min = v;
            if (v > max) max = v;
          }
        }
      } else {
        // find first valid value
        for (v = f(array[i]); i < n && (v == null || v !== v); v = f(array[++i]));
        min = max = v;

        // visit all other values
        for (; i < n; ++i) {
          v = f(array[i]);
          // skip null/undefined; NaN will fail all comparisons
          if (v != null) {
            if (v < min) min = v;
            if (v > max) max = v;
          }
        }
      }
    }
    return [min, max];
  }
  function extentIndex(array, f) {
    var n = array.length;
    var i = -1,
      a,
      b,
      c,
      u,
      v;
    if (f == null) {
      while (++i < n) {
        b = array[i];
        if (b != null && b >= b) {
          a = c = b;
          break;
        }
      }
      if (i === n) return [-1, -1];
      u = v = i;
      while (++i < n) {
        b = array[i];
        if (b != null) {
          if (a > b) {
            a = b;
            u = i;
          }
          if (c < b) {
            c = b;
            v = i;
          }
        }
      }
    } else {
      while (++i < n) {
        b = f(array[i], i, array);
        if (b != null && b >= b) {
          a = c = b;
          break;
        }
      }
      if (i === n) return [-1, -1];
      u = v = i;
      while (++i < n) {
        b = f(array[i], i, array);
        if (b != null) {
          if (a > b) {
            a = b;
            u = i;
          }
          if (c < b) {
            c = b;
            v = i;
          }
        }
      }
    }
    return [u, v];
  }
  var hop = Object.prototype.hasOwnProperty;
  function _has(object, property) {
    return hop.call(object, property);
  }
  var NULL = {};
  function fastmap(input) {
    var obj = {},
      _test;
    function has$1(key) {
      return _has(obj, key) && obj[key] !== NULL;
    }
    var map = {
      size: 0,
      empty: 0,
      object: obj,
      has: has$1,
      get: function get(key) {
        return has$1(key) ? obj[key] : undefined;
      },
      set: function set(key, value) {
        if (!has$1(key)) {
          ++map.size;
          if (obj[key] === NULL) --map.empty;
        }
        obj[key] = value;
        return this;
      },
      delete: function _delete(key) {
        if (has$1(key)) {
          --map.size;
          ++map.empty;
          obj[key] = NULL;
        }
        return this;
      },
      clear: function clear() {
        map.size = map.empty = 0;
        map.object = obj = {};
      },
      test: function test(_) {
        if (arguments.length) {
          _test = _;
          return map;
        } else {
          return _test;
        }
      },
      clean: function clean() {
        var next = {};
        var size = 0;
        for (var _key3 in obj) {
          var value = obj[_key3];
          if (value !== NULL && (!_test || !_test(value))) {
            next[_key3] = value;
            ++size;
          }
        }
        map.size = size;
        map.empty = 0;
        map.object = obj = next;
      }
    };
    if (input) Object.keys(input).forEach(function (key) {
      map.set(key, input[key]);
    });
    return map;
  }
  function flush(range, value, threshold, left, right, center) {
    if (!threshold && threshold !== 0) return center;
    var t = +threshold;
    var a = range[0],
      b = peek$1(range),
      l;

    // swap endpoints if range is reversed
    if (b < a) {
      l = a;
      a = b;
      b = l;
    }

    // compare value to endpoints
    l = Math.abs(value - a);
    var r = Math.abs(b - value);

    // adjust if value is within threshold distance of endpoint
    return l < r && l <= t ? left : r <= t ? right : center;
  }
  function inherits(child, parent, members) {
    var proto = child.prototype = Object.create(parent.prototype);
    Object.defineProperty(proto, 'constructor', {
      value: child,
      writable: true,
      enumerable: true,
      configurable: true
    });
    return extend(proto, members);
  }

  /**
   * Predicate that returns true if the value lies within the span
   * of the given range. The left and right flags control the use
   * of inclusive (true) or exclusive (false) comparisons.
   */
  function inrange(value, range, left, right) {
    var r0 = range[0],
      r1 = range[range.length - 1],
      t;
    if (r0 > r1) {
      t = r0;
      r0 = r1;
      r1 = t;
    }
    left = left === undefined || left;
    right = right === undefined || right;
    return (left ? r0 <= value : r0 < value) && (right ? value <= r1 : value < r1);
  }
  function isBoolean$1(_) {
    return typeof _ === 'boolean';
  }
  function isDate$1(_) {
    return Object.prototype.toString.call(_) === '[object Date]';
  }
  function isIterable(_) {
    return _ && isFunction(_[Symbol.iterator]);
  }
  function isNumber$1(_) {
    return typeof _ === 'number';
  }
  function isRegExp(_) {
    return Object.prototype.toString.call(_) === '[object RegExp]';
  }
  function isString(_) {
    return typeof _ === 'string';
  }
  function key$1(fields, flat, opt) {
    if (fields) {
      fields = flat ? array$2(fields).map(function (f) {
        return f.replace(/\\(.)/g, '$1');
      }) : array$2(fields);
    }
    var len = fields && fields.length,
      gen = opt && opt.get || getter,
      map = function map(f) {
        return gen(flat ? [f] : splitAccessPath(f));
      };
    var fn;
    if (!len) {
      fn = function fn() {
        return '';
      };
    } else if (len === 1) {
      var get = map(fields[0]);
      fn = function fn(_) {
        return '' + get(_);
      };
    } else {
      var _get = fields.map(map);
      fn = function fn(_) {
        var s = '' + _get[0](_),
          i = 0;
        while (++i < len) s += '|' + _get[i](_);
        return s;
      };
    }
    return accessor(fn, fields, 'key');
  }
  function lerp(array, frac) {
    var lo = array[0],
      hi = peek$1(array),
      f = +frac;
    return !f ? lo : f === 1 ? hi : lo + f * (hi - lo);
  }
  var DEFAULT_MAX_SIZE = 10000;

  // adapted from https://github.com/dominictarr/hashlru/ (MIT License)
  function lruCache(maxsize) {
    maxsize = +maxsize || DEFAULT_MAX_SIZE;
    var curr, prev, size;
    var clear = function clear() {
      curr = {};
      prev = {};
      size = 0;
    };
    var update = function update(key, value) {
      if (++size > maxsize) {
        prev = curr;
        curr = {};
        size = 1;
      }
      return curr[key] = value;
    };
    clear();
    return {
      clear: clear,
      has: function has(key) {
        return _has(curr, key) || _has(prev, key);
      },
      get: function get(key) {
        return _has(curr, key) ? curr[key] : _has(prev, key) ? update(key, prev[key]) : undefined;
      },
      set: function set(key, value) {
        return _has(curr, key) ? curr[key] = value : update(key, value);
      }
    };
  }
  function merge$2(compare, array0, array1, output) {
    var n0 = array0.length,
      n1 = array1.length;
    if (!n1) return array0;
    if (!n0) return array1;
    var merged = output || new array0.constructor(n0 + n1);
    var i0 = 0,
      i1 = 0,
      i = 0;
    for (; i0 < n0 && i1 < n1; ++i) {
      merged[i] = compare(array0[i0], array1[i1]) > 0 ? array1[i1++] : array0[i0++];
    }
    for (; i0 < n0; ++i0, ++i) {
      merged[i] = array0[i0];
    }
    for (; i1 < n1; ++i1, ++i) {
      merged[i] = array1[i1];
    }
    return merged;
  }
  function repeat(str, reps) {
    var s = '';
    while (--reps >= 0) s += str;
    return s;
  }
  function pad(str, length, padchar, align) {
    var c = padchar || ' ',
      s = str + '',
      n = length - s.length;
    return n <= 0 ? s : align === 'left' ? repeat(c, n) + s : align === 'center' ? repeat(c, ~~(n / 2)) + s + repeat(c, Math.ceil(n / 2)) : s + repeat(c, n);
  }

  /**
   * Return the numerical span of an array: the difference between
   * the last and first values.
   */
  function span(array) {
    return array && peek$1(array) - array[0] || 0;
  }
  function $(x) {
    return isArray(x) ? '[' + x.map($) + ']' : isObject(x) || isString(x) ?
    // Output valid JSON and JS source strings.
    // See http://timelessrepo.com/json-isnt-a-javascript-subset
    JSON.stringify(x).replace("\u2028", "\\u2028").replace("\u2029", "\\u2029") : x;
  }
  function toBoolean(_) {
    return _ == null || _ === '' ? null : !_ || _ === 'false' || _ === '0' ? false : !!_;
  }
  var defaultParser = function defaultParser(_) {
    return isNumber$1(_) ? _ : isDate$1(_) ? _ : Date.parse(_);
  };
  function toDate(_, parser) {
    parser = parser || defaultParser;
    return _ == null || _ === '' ? null : parser(_);
  }
  function toString(_) {
    return _ == null || _ === '' ? null : _ + '';
  }
  function toSet(_) {
    var s = {},
      n = _.length;
    for (var i = 0; i < n; ++i) s[_[i]] = true;
    return s;
  }
  function truncate$1(str, length, align, ellipsis) {
    var e = ellipsis != null ? ellipsis : "\u2026",
      s = str + '',
      n = s.length,
      l = Math.max(0, length - e.length);
    return n <= length ? s : align === 'left' ? e + s.slice(n - l) : align === 'center' ? s.slice(0, Math.ceil(l / 2)) + e + s.slice(n - ~~(l / 2)) : s.slice(0, l) + e;
  }
  function visitArray(array, filter, visitor) {
    if (array) {
      if (filter) {
        var n = array.length;
        for (var i = 0; i < n; ++i) {
          var t = filter(array[i]);
          if (t) visitor(t, i, array);
        }
      } else {
        array.forEach(visitor);
      }
    }
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return exports;
    };
    var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      defineProperty = Object.defineProperty || function (obj, key, desc) {
        obj[key] = desc.value;
      },
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define(obj, key, value) {
      return Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), obj[key];
    }
    try {
      define({}, "");
    } catch (err) {
      define = function (obj, key, value) {
        return obj[key] = value;
      };
    }
    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
      return defineProperty(generator, "_invoke", {
        value: makeInvokeMethod(innerFn, self, context)
      }), generator;
    }
    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }
    exports.wrap = wrap;
    var ContinueSentinel = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });
    var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if ("throw" !== record.type) {
          var result = record.arg,
            value = result.value;
          return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          }) : PromiseImpl.resolve(value).then(function (unwrapped) {
            result.value = unwrapped, resolve(result);
          }, function (error) {
            return invoke("throw", error, resolve, reject);
          });
        }
        reject(record.arg);
      }
      var previousPromise;
      defineProperty(this, "_invoke", {
        value: function (method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");
        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }
        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);
          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }
          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }
    function maybeInvokeDelegate(delegate, context) {
      var methodName = context.method,
        method = delegate.iterator[methodName];
      if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
      var record = tryCatch(method, delegate.iterator, context.arg);
      if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
      var info = record.arg;
      return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
    }
    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };
      1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal", delete record.arg, entry.completion = record;
    }
    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) return iteratorMethod.call(iterable);
        if ("function" == typeof iterable.next) return iterable;
        if (!isNaN(iterable.length)) {
          var i = -1,
            next = function next() {
              for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
              return next.value = undefined, next.done = !0, next;
            };
          return next.next = next;
        }
      }
      return {
        next: doneResult
      };
    }
    function doneResult() {
      return {
        value: undefined,
        done: !0
      };
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), defineProperty(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
    }, exports.mark = function (genFun) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
    }, exports.awrap = function (arg) {
      return {
        __await: arg
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
      return this;
    }), define(Gp, "toString", function () {
      return "[object Generator]";
    }), exports.keys = function (val) {
      var object = Object(val),
        keys = [];
      for (var key in object) keys.push(key);
      return keys.reverse(), function next() {
        for (; keys.length;) {
          var key = keys.pop();
          if (key in object) return next.value = key, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, exports.values = values, Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      },
      stop: function () {
        this.done = !0;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type) throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
            record = entry.completion;
          if ("root" === entry.tryLoc) return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            } else {
              if (!hasFinally) throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
      },
      complete: function (record, afterLoc) {
        if ("throw" === record.type) throw record.arg;
        return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
        }
      },
      catch: function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        return this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
      }
    }, exports;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var _defaultSpecifiers, _localGet, _localInv, _utcGet, _utcInv, _timeIntervals, _utcIntervals;
  var YEAR = 'year';
  var QUARTER = 'quarter';
  var MONTH = 'month';
  var WEEK = 'week';
  var DATE = 'date';
  var DAY = 'day';
  var DAYOFYEAR = 'dayofyear';
  var HOURS = 'hours';
  var MINUTES = 'minutes';
  var SECONDS = 'seconds';
  var MILLISECONDS = 'milliseconds';
  var TIME_UNITS = [YEAR, QUARTER, MONTH, WEEK, DATE, DAY, DAYOFYEAR, HOURS, MINUTES, SECONDS, MILLISECONDS];
  var UNITS = TIME_UNITS.reduce(function (o, u, i) {
    return o[u] = 1 + i, o;
  }, {});
  function timeUnits(units) {
    var u = array$2(units).slice(),
      m = {};

    // check validity
    if (!u.length) error('Missing time unit.');
    u.forEach(function (unit) {
      if (_has(UNITS, unit)) {
        m[unit] = 1;
      } else {
        error("Invalid time unit: ".concat(unit, "."));
      }
    });
    var numTypes = (m[WEEK] || m[DAY] ? 1 : 0) + (m[QUARTER] || m[MONTH] || m[DATE] ? 1 : 0) + (m[DAYOFYEAR] ? 1 : 0);
    if (numTypes > 1) {
      error("Incompatible time units: ".concat(units));
    }

    // ensure proper sort order
    u.sort(function (a, b) {
      return UNITS[a] - UNITS[b];
    });
    return u;
  }
  var defaultSpecifiers = (_defaultSpecifiers = {}, _defineProperty(_defaultSpecifiers, YEAR, '%Y '), _defineProperty(_defaultSpecifiers, QUARTER, 'Q%q '), _defineProperty(_defaultSpecifiers, MONTH, '%b '), _defineProperty(_defaultSpecifiers, DATE, '%d '), _defineProperty(_defaultSpecifiers, WEEK, 'W%U '), _defineProperty(_defaultSpecifiers, DAY, '%a '), _defineProperty(_defaultSpecifiers, DAYOFYEAR, '%j '), _defineProperty(_defaultSpecifiers, HOURS, '%H:00'), _defineProperty(_defaultSpecifiers, MINUTES, '00:%M'), _defineProperty(_defaultSpecifiers, SECONDS, ':%S'), _defineProperty(_defaultSpecifiers, MILLISECONDS, '.%L'), _defineProperty(_defaultSpecifiers, "".concat(YEAR, "-").concat(MONTH), '%Y-%m '), _defineProperty(_defaultSpecifiers, "".concat(YEAR, "-").concat(MONTH, "-").concat(DATE), '%Y-%m-%d '), _defineProperty(_defaultSpecifiers, "".concat(HOURS, "-").concat(MINUTES), '%H:%M'), _defaultSpecifiers);
  function timeUnitSpecifier(units, specifiers) {
    var s = extend({}, defaultSpecifiers, specifiers),
      u = timeUnits(units),
      n = u.length;
    var fmt = '',
      start = 0,
      end,
      key;
    for (start = 0; start < n;) {
      for (end = u.length; end > start; --end) {
        key = u.slice(start, end).join('-');
        if (s[key] != null) {
          fmt += s[key];
          start = end;
          break;
        }
      }
    }
    return fmt.trim();
  }
  var t0 = new Date();
  function localYear(y) {
    t0.setFullYear(y);
    t0.setMonth(0);
    t0.setDate(1);
    t0.setHours(0, 0, 0, 0);
    return t0;
  }
  function dayofyear(d) {
    return localDayOfYear(new Date(d));
  }
  function week(d) {
    return localWeekNum(new Date(d));
  }
  function localDayOfYear(d) {
    return d3Time.timeDay.count(localYear(d.getFullYear()) - 1, d);
  }
  function localWeekNum(d) {
    return d3Time.timeWeek.count(localYear(d.getFullYear()) - 1, d);
  }
  function localFirst(y) {
    return localYear(y).getDay();
  }
  function localDate(y, m, d, H, M, S, L) {
    if (0 <= y && y < 100) {
      var date = new Date(-1, m, d, H, M, S, L);
      date.setFullYear(y);
      return date;
    }
    return new Date(y, m, d, H, M, S, L);
  }
  function utcdayofyear(d) {
    return utcDayOfYear(new Date(d));
  }
  function utcweek(d) {
    return utcWeekNum(new Date(d));
  }
  function utcDayOfYear(d) {
    var y = Date.UTC(d.getUTCFullYear(), 0, 1);
    return d3Time.utcDay.count(y - 1, d);
  }
  function utcWeekNum(d) {
    var y = Date.UTC(d.getUTCFullYear(), 0, 1);
    return d3Time.utcWeek.count(y - 1, d);
  }
  function utcFirst(y) {
    t0.setTime(Date.UTC(y, 0, 1));
    return t0.getUTCDay();
  }
  function utcDate(y, m, d, H, M, S, L) {
    if (0 <= y && y < 100) {
      var date = new Date(Date.UTC(-1, m, d, H, M, S, L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(y, m, d, H, M, S, L));
  }
  function floor(units, step, get, inv, newDate) {
    var s = step || 1,
      b = peek$1(units),
      _ = function _(unit, p, key) {
        key = key || unit;
        return getUnit(get[key], inv[key], unit === b && s, p);
      };
    var t = new Date(),
      u = toSet(units),
      y = u[YEAR] ? _(YEAR) : constant$1(2012),
      m = u[MONTH] ? _(MONTH) : u[QUARTER] ? _(QUARTER) : zero$1,
      d = u[WEEK] && u[DAY] ? _(DAY, 1, WEEK + DAY) : u[WEEK] ? _(WEEK, 1) : u[DAY] ? _(DAY, 1) : u[DATE] ? _(DATE, 1) : u[DAYOFYEAR] ? _(DAYOFYEAR, 1) : one$1,
      H = u[HOURS] ? _(HOURS) : zero$1,
      M = u[MINUTES] ? _(MINUTES) : zero$1,
      S = u[SECONDS] ? _(SECONDS) : zero$1,
      L = u[MILLISECONDS] ? _(MILLISECONDS) : zero$1;
    return function (v) {
      t.setTime(+v);
      var year = y(t);
      return newDate(year, m(t), d(t, year), H(t), M(t), S(t), L(t));
    };
  }
  function getUnit(f, inv, step, phase) {
    var u = step <= 1 ? f : phase ? function (d, y) {
      return phase + step * Math.floor((f(d, y) - phase) / step);
    } : function (d, y) {
      return step * Math.floor(f(d, y) / step);
    };
    return inv ? function (d, y) {
      return inv(u(d, y), y);
    } : u;
  }

  // returns the day of the year based on week number, day of week,
  // and the day of the week for the first day of the year
  function weekday(week, day, firstDay) {
    return day + week * 7 - (firstDay + 6) % 7;
  }

  // -- LOCAL TIME --

  var localGet = (_localGet = {}, _defineProperty(_localGet, YEAR, function (d) {
    return d.getFullYear();
  }), _defineProperty(_localGet, QUARTER, function (d) {
    return Math.floor(d.getMonth() / 3);
  }), _defineProperty(_localGet, MONTH, function (d) {
    return d.getMonth();
  }), _defineProperty(_localGet, DATE, function (d) {
    return d.getDate();
  }), _defineProperty(_localGet, HOURS, function (d) {
    return d.getHours();
  }), _defineProperty(_localGet, MINUTES, function (d) {
    return d.getMinutes();
  }), _defineProperty(_localGet, SECONDS, function (d) {
    return d.getSeconds();
  }), _defineProperty(_localGet, MILLISECONDS, function (d) {
    return d.getMilliseconds();
  }), _defineProperty(_localGet, DAYOFYEAR, function (d) {
    return localDayOfYear(d);
  }), _defineProperty(_localGet, WEEK, function (d) {
    return localWeekNum(d);
  }), _defineProperty(_localGet, WEEK + DAY, function (d, y) {
    return weekday(localWeekNum(d), d.getDay(), localFirst(y));
  }), _defineProperty(_localGet, DAY, function (d, y) {
    return weekday(1, d.getDay(), localFirst(y));
  }), _localGet);
  var localInv = (_localInv = {}, _defineProperty(_localInv, QUARTER, function (q) {
    return 3 * q;
  }), _defineProperty(_localInv, WEEK, function (w, y) {
    return weekday(w, 0, localFirst(y));
  }), _localInv);
  function timeFloor(units, step) {
    return floor(units, step || 1, localGet, localInv, localDate);
  }

  // -- UTC TIME --

  var utcGet = (_utcGet = {}, _defineProperty(_utcGet, YEAR, function (d) {
    return d.getUTCFullYear();
  }), _defineProperty(_utcGet, QUARTER, function (d) {
    return Math.floor(d.getUTCMonth() / 3);
  }), _defineProperty(_utcGet, MONTH, function (d) {
    return d.getUTCMonth();
  }), _defineProperty(_utcGet, DATE, function (d) {
    return d.getUTCDate();
  }), _defineProperty(_utcGet, HOURS, function (d) {
    return d.getUTCHours();
  }), _defineProperty(_utcGet, MINUTES, function (d) {
    return d.getUTCMinutes();
  }), _defineProperty(_utcGet, SECONDS, function (d) {
    return d.getUTCSeconds();
  }), _defineProperty(_utcGet, MILLISECONDS, function (d) {
    return d.getUTCMilliseconds();
  }), _defineProperty(_utcGet, DAYOFYEAR, function (d) {
    return utcDayOfYear(d);
  }), _defineProperty(_utcGet, WEEK, function (d) {
    return utcWeekNum(d);
  }), _defineProperty(_utcGet, DAY, function (d, y) {
    return weekday(1, d.getUTCDay(), utcFirst(y));
  }), _defineProperty(_utcGet, WEEK + DAY, function (d, y) {
    return weekday(utcWeekNum(d), d.getUTCDay(), utcFirst(y));
  }), _utcGet);
  var utcInv = (_utcInv = {}, _defineProperty(_utcInv, QUARTER, function (q) {
    return 3 * q;
  }), _defineProperty(_utcInv, WEEK, function (w, y) {
    return weekday(w, 0, utcFirst(y));
  }), _utcInv);
  function utcFloor(units, step) {
    return floor(units, step || 1, utcGet, utcInv, utcDate);
  }
  var timeIntervals = (_timeIntervals = {}, _defineProperty(_timeIntervals, YEAR, d3Time.timeYear), _defineProperty(_timeIntervals, QUARTER, d3Time.timeMonth.every(3)), _defineProperty(_timeIntervals, MONTH, d3Time.timeMonth), _defineProperty(_timeIntervals, WEEK, d3Time.timeWeek), _defineProperty(_timeIntervals, DATE, d3Time.timeDay), _defineProperty(_timeIntervals, DAY, d3Time.timeDay), _defineProperty(_timeIntervals, DAYOFYEAR, d3Time.timeDay), _defineProperty(_timeIntervals, HOURS, d3Time.timeHour), _defineProperty(_timeIntervals, MINUTES, d3Time.timeMinute), _defineProperty(_timeIntervals, SECONDS, d3Time.timeSecond), _defineProperty(_timeIntervals, MILLISECONDS, d3Time.timeMillisecond), _timeIntervals);
  var utcIntervals = (_utcIntervals = {}, _defineProperty(_utcIntervals, YEAR, d3Time.utcYear), _defineProperty(_utcIntervals, QUARTER, d3Time.utcMonth.every(3)), _defineProperty(_utcIntervals, MONTH, d3Time.utcMonth), _defineProperty(_utcIntervals, WEEK, d3Time.utcWeek), _defineProperty(_utcIntervals, DATE, d3Time.utcDay), _defineProperty(_utcIntervals, DAY, d3Time.utcDay), _defineProperty(_utcIntervals, DAYOFYEAR, d3Time.utcDay), _defineProperty(_utcIntervals, HOURS, d3Time.utcHour), _defineProperty(_utcIntervals, MINUTES, d3Time.utcMinute), _defineProperty(_utcIntervals, SECONDS, d3Time.utcSecond), _defineProperty(_utcIntervals, MILLISECONDS, d3Time.utcMillisecond), _utcIntervals);
  function timeInterval(unit) {
    return timeIntervals[unit];
  }
  function utcInterval(unit) {
    return utcIntervals[unit];
  }
  function offset$3(ival, date, step) {
    return ival ? ival.offset(date, step) : undefined;
  }
  function timeOffset(unit, date, step) {
    return offset$3(timeInterval(unit), date, step);
  }
  function utcOffset(unit, date, step) {
    return offset$3(utcInterval(unit), date, step);
  }
  function sequence$1(ival, start, stop, step) {
    return ival ? ival.range(start, stop, step) : undefined;
  }
  function timeSequence(unit, start, stop, step) {
    return sequence$1(timeInterval(unit), start, stop, step);
  }
  function utcSequence(unit, start, stop, step) {
    return sequence$1(utcInterval(unit), start, stop, step);
  }
  var durationSecond = 1000,
    durationMinute = durationSecond * 60,
    durationHour = durationMinute * 60,
    durationDay = durationHour * 24,
    durationWeek = durationDay * 7,
    durationMonth = durationDay * 30,
    durationYear = durationDay * 365;
  var Milli = [YEAR, MONTH, DATE, HOURS, MINUTES, SECONDS, MILLISECONDS],
    Seconds = Milli.slice(0, -1),
    Minutes = Seconds.slice(0, -1),
    Hours = Minutes.slice(0, -1),
    Day = Hours.slice(0, -1),
    Week = [YEAR, WEEK],
    Month = [YEAR, MONTH],
    Year = [YEAR];
  var intervals = [[Seconds, 1, durationSecond], [Seconds, 5, 5 * durationSecond], [Seconds, 15, 15 * durationSecond], [Seconds, 30, 30 * durationSecond], [Minutes, 1, durationMinute], [Minutes, 5, 5 * durationMinute], [Minutes, 15, 15 * durationMinute], [Minutes, 30, 30 * durationMinute], [Hours, 1, durationHour], [Hours, 3, 3 * durationHour], [Hours, 6, 6 * durationHour], [Hours, 12, 12 * durationHour], [Day, 1, durationDay], [Week, 1, durationWeek], [Month, 1, durationMonth], [Month, 3, 3 * durationMonth], [Year, 1, durationYear]];
  function bin$1(opt) {
    var ext = opt.extent,
      max = opt.maxbins || 40,
      target = Math.abs(span(ext)) / max;
    var i = d3Array.bisector(function (i) {
        return i[2];
      }).right(intervals, target),
      units,
      step;
    if (i === intervals.length) {
      units = Year, step = d3Array.tickStep(ext[0] / durationYear, ext[1] / durationYear, max);
    } else if (i) {
      i = intervals[target / intervals[i - 1][2] < intervals[i][2] / target ? i - 1 : i];
      units = i[0];
      step = i[1];
    } else {
      units = Milli;
      step = Math.max(d3Array.tickStep(ext[0], ext[1], max), 1);
    }
    return {
      units: units,
      step: step
    };
  }

  function memoize(method) {
    var cache = {};
    return function (spec) {
      return cache[spec] || (cache[spec] = method(spec));
    };
  }
  function trimZeroes(numberFormat, decimalChar) {
    return function (x) {
      var str = numberFormat(x),
        dec = str.indexOf(decimalChar);
      if (dec < 0) return str;
      var idx = rightmostDigit(str, dec);
      var end = idx < str.length ? str.slice(idx) : '';
      while (--idx > dec) if (str[idx] !== '0') {
        ++idx;
        break;
      }
      return str.slice(0, idx) + end;
    };
  }
  function rightmostDigit(str, dec) {
    var i = str.lastIndexOf('e'),
      c;
    if (i > 0) return i;
    for (i = str.length; --i > dec;) {
      c = str.charCodeAt(i);
      if (c >= 48 && c <= 57) return i + 1; // is digit
    }
  }

  function numberLocale(locale) {
    var format = memoize(locale.format),
      formatPrefix = locale.formatPrefix;
    return {
      format: format,
      formatPrefix: formatPrefix,
      formatFloat: function formatFloat(spec) {
        var s = d3Format.formatSpecifier(spec || ',');
        if (s.precision == null) {
          s.precision = 12;
          switch (s.type) {
            case '%':
              s.precision -= 2;
              break;
            case 'e':
              s.precision -= 1;
              break;
          }
          return trimZeroes(format(s),
          // number format
          format('.1f')(1)[1] // decimal point character
          );
        } else {
          return format(s);
        }
      },
      formatSpan: function formatSpan(start, stop, count, specifier) {
        specifier = d3Format.formatSpecifier(specifier == null ? ',f' : specifier);
        var step = d3Array.tickStep(start, stop, count),
          value = Math.max(Math.abs(start), Math.abs(stop));
        var precision;
        if (specifier.precision == null) {
          switch (specifier.type) {
            case 's':
              {
                if (!isNaN(precision = d3Format.precisionPrefix(step, value))) {
                  specifier.precision = precision;
                }
                return formatPrefix(specifier, value);
              }
            case '':
            case 'e':
            case 'g':
            case 'p':
            case 'r':
              {
                if (!isNaN(precision = d3Format.precisionRound(step, value))) {
                  specifier.precision = precision - (specifier.type === 'e');
                }
                break;
              }
            case 'f':
            case '%':
              {
                if (!isNaN(precision = d3Format.precisionFixed(step))) {
                  specifier.precision = precision - (specifier.type === '%') * 2;
                }
                break;
              }
          }
        }
        return format(specifier);
      }
    };
  }
  var defaultNumberLocale;
  resetNumberFormatDefaultLocale();
  function resetNumberFormatDefaultLocale() {
    return defaultNumberLocale = numberLocale({
      format: d3Format.format,
      formatPrefix: d3Format.formatPrefix
    });
  }
  function numberFormatLocale(definition) {
    return numberLocale(d3Format.formatLocale(definition));
  }
  function numberFormatDefaultLocale(definition) {
    return arguments.length ? defaultNumberLocale = numberFormatLocale(definition) : defaultNumberLocale;
  }
  function timeMultiFormat(format, interval, spec) {
    spec = spec || {};
    if (!isObject(spec)) {
      error("Invalid time multi-format specifier: ".concat(spec));
    }
    var second = interval(SECONDS),
      minute = interval(MINUTES),
      hour = interval(HOURS),
      day = interval(DATE),
      week = interval(WEEK),
      month = interval(MONTH),
      quarter = interval(QUARTER),
      year = interval(YEAR),
      L = format(spec[MILLISECONDS] || '.%L'),
      S = format(spec[SECONDS] || ':%S'),
      M = format(spec[MINUTES] || '%I:%M'),
      H = format(spec[HOURS] || '%I %p'),
      d = format(spec[DATE] || spec[DAY] || '%a %d'),
      w = format(spec[WEEK] || '%b %d'),
      m = format(spec[MONTH] || '%B'),
      q = format(spec[QUARTER] || '%B'),
      y = format(spec[YEAR] || '%Y');
    return function (date) {
      return (second(date) < date ? L : minute(date) < date ? S : hour(date) < date ? M : day(date) < date ? H : month(date) < date ? week(date) < date ? d : w : year(date) < date ? quarter(date) < date ? m : q : y)(date);
    };
  }
  function timeLocale(locale) {
    var _timeFormat = memoize(locale.format),
      _utcFormat = memoize(locale.utcFormat);
    return {
      timeFormat: function timeFormat(spec) {
        return isString(spec) ? _timeFormat(spec) : timeMultiFormat(_timeFormat, timeInterval, spec);
      },
      utcFormat: function utcFormat(spec) {
        return isString(spec) ? _utcFormat(spec) : timeMultiFormat(_utcFormat, utcInterval, spec);
      },
      timeParse: memoize(locale.parse),
      utcParse: memoize(locale.utcParse)
    };
  }
  var defaultTimeLocale;
  resetTimeFormatDefaultLocale();
  function resetTimeFormatDefaultLocale() {
    return defaultTimeLocale = timeLocale({
      format: d3TimeFormat.timeFormat,
      parse: d3TimeFormat.timeParse,
      utcFormat: d3TimeFormat.utcFormat,
      utcParse: d3TimeFormat.utcParse
    });
  }
  function timeFormatLocale(definition) {
    return timeLocale(d3TimeFormat.timeFormatLocale(definition));
  }
  function timeFormatDefaultLocale(definition) {
    return arguments.length ? defaultTimeLocale = timeFormatLocale(definition) : defaultTimeLocale;
  }
  var createLocale = function createLocale(number, time) {
    return extend({}, number, time);
  };
  function locale(numberSpec, timeSpec) {
    var number = numberSpec ? numberFormatLocale(numberSpec) : numberFormatDefaultLocale();
    var time = timeSpec ? timeFormatLocale(timeSpec) : timeFormatDefaultLocale();
    return createLocale(number, time);
  }
  function defaultLocale(numberSpec, timeSpec) {
    var args = arguments.length;
    if (args && args !== 2) {
      error('defaultLocale expects either zero or two arguments.');
    }
    return args ? createLocale(numberFormatDefaultLocale(numberSpec), timeFormatDefaultLocale(timeSpec)) : createLocale(numberFormatDefaultLocale(), timeFormatDefaultLocale());
  }
  function resetDefaultLocale() {
    resetNumberFormatDefaultLocale();
    resetTimeFormatDefaultLocale();
    return defaultLocale();
  }

  // Matches absolute URLs with optional protocol
  //   https://...    file://...    //...
  var protocol_re = /^(data:|([A-Za-z]+:)?\/\/)/;

  // Matches allowed URIs. From https://github.com/cure53/DOMPurify/blob/master/src/regexp.js with added file://
  var allowed_re = /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|file|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i; // eslint-disable-line no-useless-escape
  var whitespace_re = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g; // eslint-disable-line no-control-regex

  // Special treatment in node.js for the file: protocol
  var fileProtocol = 'file://';

  /**
   * Factory for a loader constructor that provides methods for requesting
   * files from either the network or disk, and for sanitizing request URIs.
   * @param {function} fetch - The Fetch API for HTTP network requests.
   *   If null or undefined, HTTP loading will be disabled.
   * @param {object} fs - The file system interface for file loading.
   *   If null or undefined, local file loading will be disabled.
   * @return {function} A loader constructor with the following signature:
   *   param {object} [options] - Optional default loading options to use.
   *   return {object} - A new loader instance.
   */
  function loaderFactory(fetch, fs) {
    return function (options) {
      return {
        options: options || {},
        sanitize: sanitize,
        load: load$1,
        fileAccess: !!fs,
        file: fileLoader(fs),
        http: httpLoader(fetch)
      };
    };
  }

  /**
   * Load an external resource, typically either from the web or from the local
   * filesystem. This function uses {@link sanitize} to first sanitize the uri,
   * then calls either {@link http} (for web requests) or {@link file} (for
   * filesystem loading).
   * @param {string} uri - The resource indicator (e.g., URL or filename).
   * @param {object} [options] - Optional loading options. These options will
   *   override any existing default options.
   * @return {Promise} - A promise that resolves to the loaded content.
   */
  function load$1(_x, _x2) {
    return _load.apply(this, arguments);
  }
  /**
   * URI sanitizer function.
   * @param {string} uri - The uri (url or filename) to check.
   * @param {object} options - An options hash.
   * @return {Promise} - A promise that resolves to an object containing
   *  sanitized uri data, or rejects it the input uri is deemed invalid.
   *  The properties of the resolved object are assumed to be
   *  valid attributes for an HTML 'a' tag. The sanitized uri *must* be
   *  provided by the 'href' property of the returned object.
   */
  function _load() {
    _load = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(uri, options) {
      var opt, url;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return this.sanitize(uri, options);
          case 2:
            opt = _context2.sent;
            url = opt.href;
            return _context2.abrupt("return", opt.localFile ? this.file(url) : this.http(url, options));
          case 5:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    return _load.apply(this, arguments);
  }
  function sanitize(_x3, _x4) {
    return _sanitize.apply(this, arguments);
  }
  /**
   * File system loader factory.
   * @param {object} fs - The file system interface.
   * @return {function} - A file loader with the following signature:
   *   param {string} filename - The file system path to load.
   *   param {string} filename - The file system path to load.
   *   return {Promise} A promise that resolves to the file contents.
   */
  function _sanitize() {
    _sanitize = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(uri, options) {
      var fileAccess, result, isFile, loadFile, base, isAllowed, hasProtocol;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            options = extend({}, this.options, options);
            fileAccess = this.fileAccess, result = {
              href: null
            };
            isAllowed = allowed_re.test(uri.replace(whitespace_re, ''));
            if (uri == null || typeof uri !== 'string' || !isAllowed) {
              error('Sanitize failure, invalid URI: ' + $(uri));
            }
            hasProtocol = protocol_re.test(uri); // if relative url (no protocol/host), prepend baseURL
            if ((base = options.baseURL) && !hasProtocol) {
              // Ensure that there is a slash between the baseURL (e.g. hostname) and url
              if (!uri.startsWith('/') && !base.endsWith('/')) {
                uri = '/' + uri;
              }
              uri = base + uri;
            }

            // should we load from file system?
            loadFile = (isFile = uri.startsWith(fileProtocol)) || options.mode === 'file' || options.mode !== 'http' && !hasProtocol && fileAccess;
            if (isFile) {
              // strip file protocol
              uri = uri.slice(fileProtocol.length);
            } else if (uri.startsWith('//')) {
              if (options.defaultProtocol === 'file') {
                // if is file, strip protocol and set loadFile flag
                uri = uri.slice(2);
                loadFile = true;
              } else {
                // if relative protocol (starts with '//'), prepend default protocol
                uri = (options.defaultProtocol || 'http') + ':' + uri;
              }
            }

            // set non-enumerable mode flag to indicate local file load
            Object.defineProperty(result, 'localFile', {
              value: !!loadFile
            });

            // set uri
            result.href = uri;

            // set default result target, if specified
            if (options.target) {
              result.target = options.target + '';
            }

            // set default result rel, if specified (#1542)
            if (options.rel) {
              result.rel = options.rel + '';
            }

            // provide control over cross-origin image handling (#2238)
            // https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
            if (options.context === 'image' && options.crossOrigin) {
              result.crossOrigin = options.crossOrigin + '';
            }

            // return
            return _context3.abrupt("return", result);
          case 14:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));
    return _sanitize.apply(this, arguments);
  }
  function fileLoader(fs) {
    return fs ? function (filename) {
      return new Promise(function (accept, reject) {
        fs.readFile(filename, function (error, data) {
          if (error) reject(error);else accept(data);
        });
      });
    } : fileReject;
  }

  /**
   * Default file system loader that simply rejects.
   */
  function fileReject() {
    return _fileReject.apply(this, arguments);
  }
  /**
   * HTTP request handler factory.
   * @param {function} fetch - The Fetch API method.
   * @return {function} - An http loader with the following signature:
   *   param {string} url - The url to request.
   *   param {object} options - An options hash.
   *   return {Promise} - A promise that resolves to the file contents.
   */
  function _fileReject() {
    _fileReject = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            error('No file system access.');
          case 1:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return _fileReject.apply(this, arguments);
  }
  function httpLoader(fetch) {
    return fetch ? /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(url, options) {
        var opt, type, response;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              opt = extend({}, this.options.http, options);
              type = options && options.response;
              _context.next = 4;
              return fetch(url, opt);
            case 4:
              response = _context.sent;
              return _context.abrupt("return", !response.ok ? error(response.status + '' + response.statusText) : isFunction(response[type]) ? response[type]() : response.text());
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      return function (_x5, _x6) {
        return _ref.apply(this, arguments);
      };
    }() : httpReject;
  }

  /**
   * Default http request handler that simply rejects.
   */
  function httpReject() {
    return _httpReject.apply(this, arguments);
  }
  function _httpReject() {
    _httpReject = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            error('No HTTP fetch method available.');
          case 1:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return _httpReject.apply(this, arguments);
  }
  var isValid = function isValid(_) {
    return _ != null && _ === _;
  };
  var isBoolean = function isBoolean(_) {
    return _ === 'true' || _ === 'false' || _ === true || _ === false;
  };
  var isDate = function isDate(_) {
    return !Number.isNaN(Date.parse(_));
  };
  var isNumber = function isNumber(_) {
    return !Number.isNaN(+_) && !(_ instanceof Date);
  };
  var isInteger = function isInteger(_) {
    return isNumber(_) && Number.isInteger(+_);
  };
  var typeParsers = {
    boolean: toBoolean,
    integer: toNumber,
    number: toNumber,
    date: toDate,
    string: toString,
    unknown: identity
  };
  var typeTests = [isBoolean, isInteger, isNumber, isDate];
  var typeList = ['boolean', 'integer', 'number', 'date'];
  function inferType(values, field) {
    if (!values || !values.length) return 'unknown';
    var n = values.length,
      m = typeTests.length,
      a = typeTests.map(function (_, i) {
        return i + 1;
      });
    for (var i = 0, t = 0, j, value; i < n; ++i) {
      value = field ? values[i][field] : values[i];
      for (j = 0; j < m; ++j) {
        if (a[j] && isValid(value) && !typeTests[j](value)) {
          a[j] = 0;
          ++t;
          if (t === typeTests.length) return 'string';
        }
      }
    }
    return typeList[a.reduce(function (u, v) {
      return u === 0 ? v : u;
    }, 0) - 1];
  }
  function inferTypes(data, fields) {
    return fields.reduce(function (types, field) {
      types[field] = inferType(data, field);
      return types;
    }, {});
  }
  function delimitedFormat(delimiter) {
    var parse = function parse(data, format) {
      var delim = {
        delimiter: delimiter
      };
      return dsv(data, format ? extend(format, delim) : delim);
    };
    parse.responseType = 'text';
    return parse;
  }
  function dsv(data, format) {
    if (format.header) {
      data = format.header.map($).join(format.delimiter) + '\n' + data;
    }
    return d3Dsv.dsvFormat(format.delimiter).parse(data + '');
  }
  dsv.responseType = 'text';
  function isBuffer(_) {
    return typeof Buffer === 'function' && isFunction(Buffer.isBuffer) ? Buffer.isBuffer(_) : false;
  }
  function json(data, format) {
    var prop = format && format.property ? field$1(format.property) : identity;
    return isObject(data) && !isBuffer(data) ? parseJSON(prop(data), format) : prop(JSON.parse(data));
  }
  json.responseType = 'json';
  function parseJSON(data, format) {
    if (!isArray(data) && isIterable(data)) {
      data = _toConsumableArray(data);
    }
    return format && format.copy ? JSON.parse(JSON.stringify(data)) : data;
  }
  var filters = {
    interior: function interior(a, b) {
      return a !== b;
    },
    exterior: function exterior(a, b) {
      return a === b;
    }
  };
  function topojson(data, format) {
    var method, object, property, filter;
    data = json(data, format);
    if (format && format.feature) {
      method = topojsonClient.feature;
      property = format.feature;
    } else if (format && format.mesh) {
      method = topojsonClient.mesh;
      property = format.mesh;
      filter = filters[format.filter];
    } else {
      error('Missing TopoJSON feature or mesh parameter.');
    }
    object = (object = data.objects[property]) ? method(data, object, filter) : error('Invalid TopoJSON object: ' + property);
    return object && object.features || [object];
  }
  topojson.responseType = 'json';
  var format$2 = {
    dsv: dsv,
    csv: delimitedFormat(','),
    tsv: delimitedFormat('\t'),
    json: json,
    topojson: topojson
  };
  function formats$1(name, reader) {
    if (arguments.length > 1) {
      format$2[name] = reader;
      return this;
    } else {
      return _has(format$2, name) ? format$2[name] : null;
    }
  }
  function responseType(type) {
    var f = formats$1(type);
    return f && f.responseType || 'text';
  }
  function read(data, schema, timeParser, utcParser) {
    schema = schema || {};
    var reader = formats$1(schema.type || 'json');
    if (!reader) error('Unknown data format type: ' + schema.type);
    data = reader(data, schema);
    if (schema.parse) parse$6(data, schema.parse, timeParser, utcParser);
    if (_has(data, 'columns')) delete data.columns;
    return data;
  }
  function parse$6(data, types, timeParser, utcParser) {
    if (!data.length) return; // early exit for empty data

    var locale = timeFormatDefaultLocale();
    timeParser = timeParser || locale.timeParse;
    utcParser = utcParser || locale.utcParse;
    var fields = data.columns || Object.keys(data[0]),
      datum,
      field,
      i,
      j,
      n,
      m;
    if (types === 'auto') types = inferTypes(data, fields);
    fields = Object.keys(types);
    var parsers = fields.map(function (field) {
      var type = types[field];
      var parts, pattern;
      if (type && (type.startsWith('date:') || type.startsWith('utc:'))) {
        parts = type.split(/:(.+)?/, 2); // split on first :
        pattern = parts[1];
        if (pattern[0] === '\'' && pattern[pattern.length - 1] === '\'' || pattern[0] === '"' && pattern[pattern.length - 1] === '"') {
          pattern = pattern.slice(1, -1);
        }
        var _parse = parts[0] === 'utc' ? utcParser : timeParser;
        return _parse(pattern);
      }
      if (!typeParsers[type]) {
        throw Error('Illegal format pattern: ' + field + ':' + type);
      }
      return typeParsers[type];
    });
    for (i = 0, n = data.length, m = fields.length; i < n; ++i) {
      datum = data[i];
      for (j = 0; j < m; ++j) {
        field = fields[j];
        datum[field] = parsers[j](datum[field]);
      }
    }
  }
  var loader = loaderFactory(typeof fetch !== 'undefined' && fetch,
  // use built-in fetch API
  null // no file system access
  );

  function UniqueList(idFunc) {
    var $ = idFunc || identity,
      list = [],
      ids = {};
    list.add = function (_) {
      var id = $(_);
      if (!ids[id]) {
        ids[id] = 1;
        list.push(_);
      }
      return list;
    };
    list.remove = function (_) {
      var id = $(_);
      if (ids[id]) {
        ids[id] = 0;
        var idx = list.indexOf(_);
        if (idx >= 0) list.splice(idx, 1);
      }
      return list;
    };
    return list;
  }

  /**
   * Invoke and await a potentially async callback function. If
   * an error occurs, trap it and route to Dataflow.error.
   * @param {Dataflow} df - The dataflow instance
   * @param {function} callback - A callback function to invoke
   *   and then await. The dataflow will be passed as the single
   *   argument to the function.
   */
  function asyncCallback(_x, _x2) {
    return _asyncCallback.apply(this, arguments);
  }
  function _asyncCallback() {
    _asyncCallback = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(df, callback) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return callback(df);
          case 3:
            _context.next = 8;
            break;
          case 5:
            _context.prev = 5;
            _context.t0 = _context["catch"](0);
            df.error(_context.t0);
          case 8:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 5]]);
    }));
    return _asyncCallback.apply(this, arguments);
  }
  var TUPLE_ID_KEY = Symbol('vega_id');
  var TUPLE_ID = 1;

  /**
   * Checks if an input value is a registered tuple.
   * @param {*} t - The value to check.
   * @return {boolean} True if the input is a tuple, false otherwise.
   */
  function isTuple(t) {
    return !!(t && tupleid(t));
  }

  /**
   * Returns the id of a tuple.
   * @param {object} t - The input tuple.
   * @return {*} the tuple id.
   */
  function tupleid(t) {
    return t[TUPLE_ID_KEY];
  }

  /**
   * Sets the id of a tuple.
   * @param {object} t - The input tuple.
   * @param {*} id - The id value to set.
   * @return {object} the input tuple.
   */
  function setid(t, id) {
    t[TUPLE_ID_KEY] = id;
    return t;
  }

  /**
   * Ingest an object or value as a data tuple.
   * If the input value is an object, an id field will be added to it. For
   * efficiency, the input object is modified directly. A copy is not made.
   * If the input value is a literal, it will be wrapped in a new object
   * instance, with the value accessible as the 'data' property.
   * @param datum - The value to ingest.
   * @return {object} The ingested data tuple.
   */
  function ingest$1(datum) {
    var t = datum === Object(datum) ? datum : {
      data: datum
    };
    return tupleid(t) ? t : setid(t, TUPLE_ID++);
  }

  /**
   * Given a source tuple, return a derived copy.
   * @param {object} t - The source tuple.
   * @return {object} The derived tuple.
   */
  function derive(t) {
    return rederive(t, ingest$1({}));
  }

  /**
   * Rederive a derived tuple by copying values from the source tuple.
   * @param {object} t - The source tuple.
   * @param {object} d - The derived tuple.
   * @return {object} The derived tuple.
   */
  function rederive(t, d) {
    for (var k in t) d[k] = t[k];
    return d;
  }

  /**
   * Replace an existing tuple with a new tuple.
   * @param {object} t - The existing data tuple.
   * @param {object} d - The new tuple that replaces the old.
   * @return {object} The new tuple.
   */
  function replace$1(t, d) {
    return setid(d, tupleid(t));
  }

  /**
   * Generate an augmented comparator function that provides stable
   * sorting by tuple id when the given comparator produces ties.
   * @param {function} cmp - The comparator to augment.
   * @param {function} [f] - Optional tuple accessor function.
   * @return {function} An augmented comparator function.
   */
  function stableCompare(cmp, f) {
    return !cmp ? null : f ? function (a, b) {
      return cmp(a, b) || tupleid(f(a)) - tupleid(f(b));
    } : function (a, b) {
      return cmp(a, b) || tupleid(a) - tupleid(b);
    };
  }
  function isChangeSet(v) {
    return v && v.constructor === changeset;
  }
  function changeset() {
    var add = [],
      // insert tuples
      rem = [],
      // remove tuples
      mod = [],
      // modify tuples
      remp = [],
      // remove by predicate
      modp = []; // modify by predicate
    var _clean = null,
      _reflow = false;
    return {
      constructor: changeset,
      insert: function insert(t) {
        var d = array$2(t),
          n = d.length;
        for (var i = 0; i < n; ++i) add.push(d[i]);
        return this;
      },
      remove: function remove(t) {
        var a = isFunction(t) ? remp : rem,
          d = array$2(t),
          n = d.length;
        for (var i = 0; i < n; ++i) a.push(d[i]);
        return this;
      },
      modify: function modify(t, field, value) {
        var m = {
          field: field,
          value: constant$1(value)
        };
        if (isFunction(t)) {
          m.filter = t;
          modp.push(m);
        } else {
          m.tuple = t;
          mod.push(m);
        }
        return this;
      },
      encode: function encode(t, set) {
        if (isFunction(t)) modp.push({
          filter: t,
          field: set
        });else mod.push({
          tuple: t,
          field: set
        });
        return this;
      },
      clean: function clean(value) {
        _clean = value;
        return this;
      },
      reflow: function reflow() {
        _reflow = true;
        return this;
      },
      pulse: function pulse(_pulse, tuples) {
        var cur = {},
          out = {};
        var i, n, m, f, t, id;

        // build lookup table of current tuples
        for (i = 0, n = tuples.length; i < n; ++i) {
          cur[tupleid(tuples[i])] = 1;
        }

        // process individual tuples to remove
        for (i = 0, n = rem.length; i < n; ++i) {
          t = rem[i];
          cur[tupleid(t)] = -1;
        }

        // process predicate-based removals
        for (i = 0, n = remp.length; i < n; ++i) {
          f = remp[i];
          tuples.forEach(function (t) {
            if (f(t)) cur[tupleid(t)] = -1;
          });
        }

        // process all add tuples
        for (i = 0, n = add.length; i < n; ++i) {
          t = add[i];
          id = tupleid(t);
          if (cur[id]) {
            // tuple already resides in dataset
            // if flagged for both add and remove, cancel
            cur[id] = 1;
          } else {
            // tuple does not reside in dataset, add
            _pulse.add.push(ingest$1(add[i]));
          }
        }

        // populate pulse rem list
        for (i = 0, n = tuples.length; i < n; ++i) {
          t = tuples[i];
          if (cur[tupleid(t)] < 0) _pulse.rem.push(t);
        }

        // modify helper method
        function modify(t, f, v) {
          if (v) {
            t[f] = v(t);
          } else {
            _pulse.encode = f;
          }
          if (!_reflow) out[tupleid(t)] = t;
        }

        // process individual tuples to modify
        for (i = 0, n = mod.length; i < n; ++i) {
          m = mod[i];
          t = m.tuple;
          f = m.field;
          id = cur[tupleid(t)];
          if (id > 0) {
            modify(t, f, m.value);
            _pulse.modifies(f);
          }
        }

        // process predicate-based modifications
        for (i = 0, n = modp.length; i < n; ++i) {
          m = modp[i];
          f = m.filter;
          tuples.forEach(function (t) {
            if (f(t) && cur[tupleid(t)] > 0) {
              modify(t, m.field, m.value);
            }
          });
          _pulse.modifies(m.field);
        }

        // upon reflow request, populate mod with all non-removed tuples
        // otherwise, populate mod with modified tuples only
        if (_reflow) {
          _pulse.mod = rem.length || remp.length ? tuples.filter(function (t) {
            return cur[tupleid(t)] > 0;
          }) : tuples.slice();
        } else {
          for (id in out) _pulse.mod.push(out[id]);
        }

        // set pulse garbage collection request
        if (_clean || _clean == null && (rem.length || remp.length)) {
          _pulse.clean(true);
        }
        return _pulse;
      }
    };
  }
  var CACHE = '_:mod:_';

  /**
   * Hash that tracks modifications to assigned values.
   * Callers *must* use the set method to update values.
   */
  function Parameters() {
    Object.defineProperty(this, CACHE, {
      writable: true,
      value: {}
    });
  }
  Parameters.prototype = {
    /**
     * Set a parameter value. If the parameter value changes, the parameter
     * will be recorded as modified.
     * @param {string} name - The parameter name.
     * @param {number} index - The index into an array-value parameter. Ignored if
     *   the argument is undefined, null or less than zero.
     * @param {*} value - The parameter value to set.
     * @param {boolean} [force=false] - If true, records the parameter as modified
     *   even if the value is unchanged.
     * @return {Parameters} - This parameter object.
     */
    set: function set(name, index, value, force) {
      var o = this,
        v = o[name],
        mod = o[CACHE];
      if (index != null && index >= 0) {
        if (v[index] !== value || force) {
          v[index] = value;
          mod[index + ':' + name] = -1;
          mod[name] = -1;
        }
      } else if (v !== value || force) {
        o[name] = value;
        mod[name] = isArray(value) ? 1 + value.length : -1;
      }
      return o;
    },
    /**
     * Tests if one or more parameters has been modified. If invoked with no
     * arguments, returns true if any parameter value has changed. If the first
     * argument is array, returns trues if any parameter name in the array has
     * changed. Otherwise, tests if the given name and optional array index has
     * changed.
     * @param {string} name - The parameter name to test.
     * @param {number} [index=undefined] - The parameter array index to test.
     * @return {boolean} - Returns true if a queried parameter was modified.
     */
    modified: function modified(name, index) {
      var mod = this[CACHE];
      if (!arguments.length) {
        for (var k in mod) {
          if (mod[k]) return true;
        }
        return false;
      } else if (isArray(name)) {
        for (var _k = 0; _k < name.length; ++_k) {
          if (mod[name[_k]]) return true;
        }
        return false;
      }
      return index != null && index >= 0 ? index + 1 < mod[name] || !!mod[index + ':' + name] : !!mod[name];
    },
    /**
     * Clears the modification records. After calling this method,
     * all parameters are considered unmodified.
     */
    clear: function clear() {
      this[CACHE] = {};
      return this;
    }
  };
  var OP_ID = 0;
  var PULSE = 'pulse',
    NO_PARAMS = new Parameters();

  // Boolean Flags
  var SKIP$1$1 = 1,
    MODIFIED = 2;

  /**
   * An Operator is a processing node in a dataflow graph.
   * Each operator stores a value and an optional value update function.
   * Operators can accept a hash of named parameters. Parameter values can
   * either be direct (JavaScript literals, arrays, objects) or indirect
   * (other operators whose values will be pulled dynamically). Operators
   * included as parameters will have this operator added as a dependency.
   * @constructor
   * @param {*} [init] - The initial value for this operator.
   * @param {function(object, Pulse)} [update] - An update function. Upon
   *   evaluation of this operator, the update function will be invoked and the
   *   return value will be used as the new value of this operator.
   * @param {object} [params] - The parameters for this operator.
   * @param {boolean} [react=true] - Flag indicating if this operator should
   *   listen for changes to upstream operators included as parameters.
   * @see parameters
   */
  function Operator(init, update, params, react) {
    this.id = ++OP_ID;
    this.value = init;
    this.stamp = -1;
    this.rank = -1;
    this.qrank = -1;
    this.flags = 0;
    if (update) {
      this._update = update;
    }
    if (params) this.parameters(params, react);
  }
  function flag(bit) {
    return function (state) {
      var f = this.flags;
      if (arguments.length === 0) return !!(f & bit);
      this.flags = state ? f | bit : f & ~bit;
      return this;
    };
  }
  Operator.prototype = {
    /**
     * Returns a list of target operators dependent on this operator.
     * If this list does not exist, it is created and then returned.
     * @return {UniqueList}
     */
    targets: function targets() {
      return this._targets || (this._targets = UniqueList(id));
    },
    /**
     * Sets the value of this operator.
     * @param {*} value - the value to set.
     * @return {Number} Returns 1 if the operator value has changed
     *   according to strict equality, returns 0 otherwise.
     */
    set: function set(value) {
      if (this.value !== value) {
        this.value = value;
        return 1;
      } else {
        return 0;
      }
    },
    /**
     * Indicates that operator evaluation should be skipped on the next pulse.
     * This operator will still propagate incoming pulses, but its update function
     * will not be invoked. The skip flag is reset after every pulse, so calling
     * this method will affect processing of the next pulse only.
     */
    skip: flag(SKIP$1$1),
    /**
     * Indicates that this operator's value has been modified on its most recent
     * pulse. Normally modification is checked via strict equality; however, in
     * some cases it is more efficient to update the internal state of an object.
     * In those cases, the modified flag can be used to trigger propagation. Once
     * set, the modification flag persists across pulses until unset. The flag can
     * be used with the last timestamp to test if a modification is recent.
     */
    modified: flag(MODIFIED),
    /**
     * Sets the parameters for this operator. The parameter values are analyzed for
     * operator instances. If found, this operator will be added as a dependency
     * of the parameterizing operator. Operator values are dynamically marshalled
     * from each operator parameter prior to evaluation. If a parameter value is
     * an array, the array will also be searched for Operator instances. However,
     * the search does not recurse into sub-arrays or object properties.
     * @param {object} params - A hash of operator parameters.
     * @param {boolean} [react=true] - A flag indicating if this operator should
     *   automatically update (react) when parameter values change. In other words,
     *   this flag determines if the operator registers itself as a listener on
     *   any upstream operators included in the parameters.
     * @param {boolean} [initonly=false] - A flag indicating if this operator
     *   should calculate an update only upon its initial evaluation, then
     *   deregister dependencies and suppress all future update invocations.
     * @return {Operator[]} - An array of upstream dependencies.
     */
    parameters: function parameters(params, react, initonly) {
      var _this = this;
      react = react !== false;
      var argval = this._argval = this._argval || new Parameters(),
        argops = this._argops = this._argops || [],
        deps = [];
      var name, value, n, i;
      var add = function add(name, index, value) {
        if (value instanceof Operator) {
          if (value !== _this) {
            if (react) value.targets().add(_this);
            deps.push(value);
          }
          argops.push({
            op: value,
            name: name,
            index: index
          });
        } else {
          argval.set(name, index, value);
        }
      };
      for (name in params) {
        value = params[name];
        if (name === PULSE) {
          array$2(value).forEach(function (op) {
            if (!(op instanceof Operator)) {
              error('Pulse parameters must be operator instances.');
            } else if (op !== _this) {
              op.targets().add(_this);
              deps.push(op);
            }
          });
          this.source = value;
        } else if (isArray(value)) {
          argval.set(name, -1, Array(n = value.length));
          for (i = 0; i < n; ++i) add(name, i, value[i]);
        } else {
          add(name, -1, value);
        }
      }
      this.marshall().clear(); // initialize values
      if (initonly) argops.initonly = true;
      return deps;
    },
    /**
     * Internal method for marshalling parameter values.
     * Visits each operator dependency to pull the latest value.
     * @return {Parameters} A Parameters object to pass to the update function.
     */
    marshall: function marshall(stamp) {
      var argval = this._argval || NO_PARAMS,
        argops = this._argops;
      var item, i, op, mod;
      if (argops) {
        var n = argops.length;
        for (i = 0; i < n; ++i) {
          item = argops[i];
          op = item.op;
          mod = op.modified() && op.stamp === stamp;
          argval.set(item.name, item.index, op.value, mod);
        }
        if (argops.initonly) {
          for (i = 0; i < n; ++i) {
            item = argops[i];
            item.op.targets().remove(this);
          }
          this._argops = null;
          this._update = null;
        }
      }
      return argval;
    },
    /**
     * Detach this operator from the dataflow.
     * Unregisters listeners on upstream dependencies.
     */
    detach: function detach() {
      var argops = this._argops;
      var i, n, item, op;
      if (argops) {
        for (i = 0, n = argops.length; i < n; ++i) {
          item = argops[i];
          op = item.op;
          if (op._targets) {
            op._targets.remove(this);
          }
        }
      }

      // remove references to the source and pulse object,
      // if present, to prevent memory leaks of old data.
      this.pulse = null;
      this.source = null;
    },
    /**
     * Delegate method to perform operator processing.
     * Subclasses can override this method to perform custom processing.
     * By default, it marshalls parameters and calls the update function
     * if that function is defined. If the update function does not
     * change the operator value then StopPropagation is returned.
     * If no update function is defined, this method does nothing.
     * @param {Pulse} pulse - the current dataflow pulse.
     * @return The output pulse or StopPropagation. A falsy return value
     *   (including undefined) will let the input pulse pass through.
     */
    evaluate: function evaluate(pulse) {
      var update = this._update;
      if (update) {
        var params = this.marshall(pulse.stamp),
          v = update.call(this, params, pulse);
        params.clear();
        if (v !== this.value) {
          this.value = v;
        } else if (!this.modified()) {
          return pulse.StopPropagation;
        }
      }
    },
    /**
     * Run this operator for the current pulse. If this operator has already
     * been run at (or after) the pulse timestamp, returns StopPropagation.
     * Internally, this method calls {@link evaluate} to perform processing.
     * If {@link evaluate} returns a falsy value, the input pulse is returned.
     * This method should NOT be overridden, instead overrride {@link evaluate}.
     * @param {Pulse} pulse - the current dataflow pulse.
     * @return the output pulse for this operator (or StopPropagation)
     */
    run: function run(pulse) {
      if (pulse.stamp < this.stamp) return pulse.StopPropagation;
      var rv;
      if (this.skip()) {
        this.skip(false);
        rv = 0;
      } else {
        rv = this.evaluate(pulse);
      }
      return this.pulse = rv || pulse;
    }
  };

  /**
   * Add an operator to the dataflow graph. This function accepts a
   * variety of input argument types. The basic signature supports an
   * initial value, update function and parameters. If the first parameter
   * is an Operator instance, it will be added directly. If it is a
   * constructor for an Operator subclass, a new instance will be instantiated.
   * Otherwise, if the first parameter is a function instance, it will be used
   * as the update function and a null initial value is assumed.
   * @param {*} init - One of: the operator to add, the initial value of
   *   the operator, an operator class to instantiate, or an update function.
   * @param {function} [update] - The operator update function.
   * @param {object} [params] - The operator parameters.
   * @param {boolean} [react=true] - Flag indicating if this operator should
   *   listen for changes to upstream operators included as parameters.
   * @return {Operator} - The added operator.
   */
  function add$2(init, update, params, react) {
    var shift = 1,
      op;
    if (init instanceof Operator) {
      op = init;
    } else if (init && init.prototype instanceof Operator) {
      op = new init();
    } else if (isFunction(init)) {
      op = new Operator(null, init);
    } else {
      shift = 0;
      op = new Operator(init, update);
    }
    this.rank(op);
    if (shift) {
      react = params;
      params = update;
    }
    if (params) this.connect(op, op.parameters(params, react));
    this.touch(op);
    return op;
  }

  /**
   * Connect a target operator as a dependent of source operators.
   * If necessary, this method will rerank the target operator and its
   * dependents to ensure propagation proceeds in a topologically sorted order.
   * @param {Operator} target - The target operator.
   * @param {Array<Operator>} - The source operators that should propagate
   *   to the target operator.
   */
  function connect(target, sources) {
    var targetRank = target.rank,
      n = sources.length;
    for (var i = 0; i < n; ++i) {
      if (targetRank < sources[i].rank) {
        this.rerank(target);
        return;
      }
    }
  }
  var STREAM_ID = 0;

  /**
   * Models an event stream.
   * @constructor
   * @param {function(Object, number): boolean} [filter] - Filter predicate.
   *   Events pass through when truthy, events are suppressed when falsy.
   * @param {function(Object): *} [apply] - Applied to input events to produce
   *   new event values.
   * @param {function(Object)} [receive] - Event callback function to invoke
   *   upon receipt of a new event. Use to override standard event processing.
   */
  function EventStream(filter, apply, receive) {
    this.id = ++STREAM_ID;
    this.value = null;
    if (receive) this.receive = receive;
    if (filter) this._filter = filter;
    if (apply) this._apply = apply;
  }

  /**
   * Creates a new event stream instance with the provided
   * (optional) filter, apply and receive functions.
   * @param {function(Object, number): boolean} [filter] - Filter predicate.
   *   Events pass through when truthy, events are suppressed when falsy.
   * @param {function(Object): *} [apply] - Applied to input events to produce
   *   new event values.
   * @see EventStream
   */
  function stream(filter, apply, receive) {
    return new EventStream(filter, apply, receive);
  }
  EventStream.prototype = {
    _filter: truthy,
    _apply: identity,
    targets: function targets() {
      return this._targets || (this._targets = UniqueList(id));
    },
    consume: function consume(_) {
      if (!arguments.length) return !!this._consume;
      this._consume = !!_;
      return this;
    },
    receive: function receive(evt) {
      if (this._filter(evt)) {
        var val = this.value = this._apply(evt),
          trg = this._targets,
          n = trg ? trg.length : 0;
        for (var i = 0; i < n; ++i) trg[i].receive(val);
        if (this._consume) {
          evt.preventDefault();
          evt.stopPropagation();
        }
      }
    },
    filter: function filter(_filter) {
      var s = stream(_filter);
      this.targets().add(s);
      return s;
    },
    apply: function apply(_apply) {
      var s = stream(null, _apply);
      this.targets().add(s);
      return s;
    },
    merge: function merge() {
      var s = stream();
      this.targets().add(s);
      for (var i = 0, n = arguments.length; i < n; ++i) {
        arguments[i].targets().add(s);
      }
      return s;
    },
    throttle: function throttle(pause) {
      var t = -1;
      return this.filter(function () {
        var now = Date.now();
        if (now - t > pause) {
          t = now;
          return 1;
        } else {
          return 0;
        }
      });
    },
    debounce: function debounce$1(delay) {
      var s = stream();
      this.targets().add(stream(null, null, debounce(delay, function (e) {
        var df = e.dataflow;
        s.receive(e);
        if (df && df.run) df.run();
      })));
      return s;
    },
    between: function between(a, b) {
      var active = false;
      a.targets().add(stream(null, null, function () {
        return active = true;
      }));
      b.targets().add(stream(null, null, function () {
        return active = false;
      }));
      return this.filter(function () {
        return active;
      });
    },
    detach: function detach() {
      // ensures compatibility with operators (#2753)
      // remove references to other streams and filter functions that may
      // be bound to subcontexts that need to be garbage collected.
      this._filter = truthy;
      this._targets = null;
    }
  };

  /**
   * Create a new event stream from an event source.
   * @param {object} source - The event source to monitor. The input must
   *  support the addEventListener method.
   * @param {string} type - The event type.
   * @param {function(object): boolean} [filter] - Event filter function.
   * @param {function(object): *} [apply] - Event application function.
   *   If provided, this function will be invoked and the result will be
   *   used as the downstream event value.
   * @return {EventStream}
   */
  function events$1(source, type, filter, apply) {
    var df = this,
      s = stream(filter, apply),
      send = function send(e) {
        e.dataflow = df;
        try {
          s.receive(e);
        } catch (error) {
          df.error(error);
        } finally {
          df.run();
        }
      };
    var sources;
    if (typeof source === 'string' && typeof document !== 'undefined') {
      sources = document.querySelectorAll(source);
    } else {
      sources = array$2(source);
    }
    var n = sources.length;
    for (var i = 0; i < n; ++i) {
      sources[i].addEventListener(type, send);
    }
    return s;
  }
  function parse$5(data, format) {
    var locale = this.locale();
    return read(data, format, locale.timeParse, locale.utcParse);
  }

  /**
   * Ingests new data into the dataflow. First parses the data using the
   * vega-loader read method, then pulses a changeset to the target operator.
   * @param {Operator} target - The Operator to target with ingested data,
   *   typically a Collect transform instance.
   * @param {*} data - The input data, prior to parsing. For JSON this may
   *   be a string or an object. For CSV, TSV, etc should be a string.
   * @param {object} format - The data format description for parsing
   *   loaded data. This object is passed to the vega-loader read method.
   * @returns {Dataflow}
   */
  function ingest(target, data, format) {
    data = this.parse(data, format);
    return this.pulse(target, this.changeset().insert(data));
  }

  /**
   * Request data from an external source, parse it, and return a Promise.
   * @param {string} url - The URL from which to load the data. This string
   *   is passed to the vega-loader load method.
   * @param {object} [format] - The data format description for parsing
   *   loaded data. This object is passed to the vega-loader read method.
   * @return {Promise} A Promise that resolves upon completion of the request.
   *   The resolved object contains the following properties:
   *   - data: an array of parsed data (or null upon error)
   *   - status: a code for success (0), load fail (-1), or parse fail (-2)
   */
  function request(_x3, _x4) {
    return _request.apply(this, arguments);
  }
  function _request() {
    _request = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(url, format) {
      var df, status, data;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            df = this;
            status = 0;
            _context2.prev = 2;
            _context2.next = 5;
            return df.loader().load(url, {
              context: 'dataflow',
              response: responseType(format && format.type)
            });
          case 5:
            data = _context2.sent;
            try {
              data = df.parse(data, format);
            } catch (err) {
              status = -2;
              df.warn('Data ingestion failed', url, err);
            }
            _context2.next = 13;
            break;
          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](2);
            status = -1;
            df.warn('Loading failed', url, _context2.t0);
          case 13:
            return _context2.abrupt("return", {
              data: data,
              status: status
            });
          case 14:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this, [[2, 9]]);
    }));
    return _request.apply(this, arguments);
  }
  function preload(_x5, _x6, _x7) {
    return _preload.apply(this, arguments);
  }
  function _preload() {
    _preload = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(target, url, format) {
      var df, pending, res;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            df = this, pending = df._pending || loadPending(df);
            pending.requests += 1;
            _context3.next = 4;
            return df.request(url, format);
          case 4:
            res = _context3.sent;
            df.pulse(target, df.changeset().remove(truthy).insert(res.data || []));
            pending.done();
            return _context3.abrupt("return", res);
          case 8:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));
    return _preload.apply(this, arguments);
  }
  function loadPending(df) {
    var accept;
    var pending = new Promise(function (a) {
      return accept = a;
    });
    pending.requests = 0;
    pending.done = function () {
      if (--pending.requests === 0) {
        df._pending = null;
        accept(df);
      }
    };
    return df._pending = pending;
  }
  var SKIP$2 = {
    skip: true
  };

  /**
   * Perform operator updates in response to events. Applies an
   * update function to compute a new operator value. If the update function
   * returns a {@link ChangeSet}, the operator will be pulsed with those tuple
   * changes. Otherwise, the operator value will be updated to the return value.
   * @param {EventStream|Operator} source - The event source to react to.
   *   This argument can be either an EventStream or an Operator.
   * @param {Operator|function(object):Operator} target - The operator to update.
   *   This argument can either be an Operator instance or (if the source
   *   argument is an EventStream), a function that accepts an event object as
   *   input and returns an Operator to target.
   * @param {function(Parameters,Event): *} [update] - Optional update function
   *   to compute the new operator value, or a literal value to set. Update
   *   functions expect to receive a parameter object and event as arguments.
   *   This function can either return a new operator value or (if the source
   *   argument is an EventStream) a {@link ChangeSet} instance to pulse
   *   the target operator with tuple changes.
   * @param {object} [params] - The update function parameters.
   * @param {object} [options] - Additional options hash. If not overridden,
   *   updated operators will be skipped by default.
   * @param {boolean} [options.skip] - If true, the operator will
   *  be skipped: it will not be evaluated, but its dependents will be.
   * @param {boolean} [options.force] - If true, the operator will
   *   be re-evaluated even if its value has not changed.
   * @return {Dataflow}
   */
  function on(source, target, update, params, options) {
    var fn = source instanceof Operator ? onOperator : onStream;
    fn(this, source, target, update, params, options);
    return this;
  }
  function onStream(df, stream, target, update, params, options) {
    var opt = extend({}, options, SKIP$2);
    var func, op;
    if (!isFunction(target)) target = constant$1(target);
    if (update === undefined) {
      func = function func(e) {
        return df.touch(target(e));
      };
    } else if (isFunction(update)) {
      op = new Operator(null, update, params, false);
      func = function func(e) {
        op.evaluate(e);
        var t = target(e),
          v = op.value;
        isChangeSet(v) ? df.pulse(t, v, options) : df.update(t, v, opt);
      };
    } else {
      func = function func(e) {
        return df.update(target(e), update, opt);
      };
    }
    stream.apply(func);
  }
  function onOperator(df, source, target, update, params, options) {
    if (update === undefined) {
      source.targets().add(target);
    } else {
      var opt = options || {},
        op = new Operator(null, updater(target, update), params, false);
      op.modified(opt.force);
      op.rank = source.rank; // immediately follow source
      source.targets().add(op); // add dependency

      if (target) {
        op.skip(true); // skip first invocation
        op.value = target.value; // initialize value
        op.targets().add(target); // chain dependencies
        df.connect(target, [op]); // rerank as needed, #1672
      }
    }
  }

  function updater(target, update) {
    update = isFunction(update) ? update : constant$1(update);
    return target ? function (_, pulse) {
      var value = update(_, pulse);
      if (!target.skip()) {
        target.skip(value !== this.value).value = value;
      }
      return value;
    } : update;
  }

  /**
   * Assigns a rank to an operator. Ranks are assigned in increasing order
   * by incrementing an internal rank counter.
   * @param {Operator} op - The operator to assign a rank.
   */
  function rank(op) {
    op.rank = ++this._rank;
  }

  /**
   * Re-ranks an operator and all downstream target dependencies. This
   * is necessary when upstream dependencies of higher rank are added to
   * a target operator.
   * @param {Operator} op - The operator to re-rank.
   */
  function rerank(op) {
    var queue = [op];
    var cur, list, i;
    while (queue.length) {
      this.rank(cur = queue.pop());
      if (list = cur._targets) {
        for (i = list.length; --i >= 0;) {
          queue.push(cur = list[i]);
          if (cur === op) error('Cycle detected in dataflow graph.');
        }
      }
    }
  }

  /**
   * Sentinel value indicating pulse propagation should stop.
   */
  var StopPropagation = {};

  // Pulse visit type flags
  var ADD = 1 << 0,
    REM = 1 << 1,
    MOD$1 = 1 << 2,
    ADD_REM = ADD | REM,
    ADD_MOD = ADD | MOD$1,
    ALL = ADD | REM | MOD$1,
    REFLOW = 1 << 3,
    SOURCE = 1 << 4,
    NO_SOURCE = 1 << 5,
    NO_FIELDS = 1 << 6;

  /**
   * A Pulse enables inter-operator communication during a run of the
   * dataflow graph. In addition to the current timestamp, a pulse may also
   * contain a change-set of added, removed or modified data tuples, as well as
   * a pointer to a full backing data source. Tuple change sets may not
   * be fully materialized; for example, to prevent needless array creation
   * a change set may include larger arrays and corresponding filter functions.
   * The pulse provides a {@link visit} method to enable proper and efficient
   * iteration over requested data tuples.
   *
   * In addition, each pulse can track modification flags for data tuple fields.
   * Responsible transform operators should call the {@link modifies} method to
   * indicate changes to data fields. The {@link modified} method enables
   * querying of this modification state.
   *
   * @constructor
   * @param {Dataflow} dataflow - The backing dataflow instance.
   * @param {number} stamp - The current propagation timestamp.
   * @param {string} [encode] - An optional encoding set name, which is then
   *   accessible as Pulse.encode. Operators can respond to (or ignore) this
   *   setting as appropriate. This parameter can be used in conjunction with
   *   the Encode transform in the vega-encode module.
   */
  function Pulse(dataflow, stamp, encode) {
    this.dataflow = dataflow;
    this.stamp = stamp == null ? -1 : stamp;
    this.add = [];
    this.rem = [];
    this.mod = [];
    this.fields = null;
    this.encode = encode || null;
  }
  function _materialize(data, filter) {
    var out = [];
    visitArray(data, filter, function (_) {
      return out.push(_);
    });
    return out;
  }
  function filter$1(pulse, flags) {
    var map = {};
    pulse.visit(flags, function (t) {
      map[tupleid(t)] = 1;
    });
    return function (t) {
      return map[tupleid(t)] ? null : t;
    };
  }
  function addFilter(a, b) {
    return a ? function (t, i) {
      return a(t, i) && b(t, i);
    } : b;
  }
  Pulse.prototype = {
    /**
     * Sentinel value indicating pulse propagation should stop.
     */
    StopPropagation: StopPropagation,
    /**
     * Boolean flag indicating ADD (added) tuples.
     */
    ADD: ADD,
    /**
     * Boolean flag indicating REM (removed) tuples.
     */
    REM: REM,
    /**
     * Boolean flag indicating MOD (modified) tuples.
     */
    MOD: MOD$1,
    /**
     * Boolean flag indicating ADD (added) and REM (removed) tuples.
     */
    ADD_REM: ADD_REM,
    /**
     * Boolean flag indicating ADD (added) and MOD (modified) tuples.
     */
    ADD_MOD: ADD_MOD,
    /**
     * Boolean flag indicating ADD, REM and MOD tuples.
     */
    ALL: ALL,
    /**
     * Boolean flag indicating all tuples in a data source
     * except for the ADD, REM and MOD tuples.
     */
    REFLOW: REFLOW,
    /**
     * Boolean flag indicating a 'pass-through' to a
     * backing data source, ignoring ADD, REM and MOD tuples.
     */
    SOURCE: SOURCE,
    /**
     * Boolean flag indicating that source data should be
     * suppressed when creating a forked pulse.
     */
    NO_SOURCE: NO_SOURCE,
    /**
     * Boolean flag indicating that field modifications should be
     * suppressed when creating a forked pulse.
     */
    NO_FIELDS: NO_FIELDS,
    /**
     * Creates a new pulse based on the values of this pulse.
     * The dataflow, time stamp and field modification values are copied over.
     * By default, new empty ADD, REM and MOD arrays are created.
     * @param {number} flags - Integer of boolean flags indicating which (if any)
     *   tuple arrays should be copied to the new pulse. The supported flag values
     *   are ADD, REM and MOD. Array references are copied directly: new array
     *   instances are not created.
     * @return {Pulse} - The forked pulse instance.
     * @see init
     */
    fork: function fork(flags) {
      return new Pulse(this.dataflow).init(this, flags);
    },
    /**
     * Creates a copy of this pulse with new materialized array
     * instances for the ADD, REM, MOD, and SOURCE arrays.
     * The dataflow, time stamp and field modification values are copied over.
     * @return {Pulse} - The cloned pulse instance.
     * @see init
     */
    clone: function clone() {
      var p = this.fork(ALL);
      p.add = p.add.slice();
      p.rem = p.rem.slice();
      p.mod = p.mod.slice();
      if (p.source) p.source = p.source.slice();
      return p.materialize(ALL | SOURCE);
    },
    /**
     * Returns a pulse that adds all tuples from a backing source. This is
     * useful for cases where operators are added to a dataflow after an
     * upstream data pipeline has already been processed, ensuring that
     * new operators can observe all tuples within a stream.
     * @return {Pulse} - A pulse instance with all source tuples included
     *   in the add array. If the current pulse already has all source
     *   tuples in its add array, it is returned directly. If the current
     *   pulse does not have a backing source, it is returned directly.
     */
    addAll: function addAll() {
      var p = this;
      var reuse = !p.source || p.add === p.rem // special case for indexed set (e.g., crossfilter)
      || !p.rem.length && p.source.length === p.add.length;
      if (reuse) {
        return p;
      } else {
        p = new Pulse(this.dataflow).init(this);
        p.add = p.source;
        p.rem = []; // new operators can ignore rem #2769
        return p;
      }
    },
    /**
     * Initialize this pulse based on the values of another pulse. This method
     * is used internally by {@link fork} to initialize a new forked tuple.
     * The dataflow, time stamp and field modification values are copied over.
     * By default, new empty ADD, REM and MOD arrays are created.
     * @param {Pulse} src - The source pulse to copy from.
     * @param {number} flags - Integer of boolean flags indicating which (if any)
     *   tuple arrays should be copied to the new pulse. The supported flag values
     *   are ADD, REM and MOD. Array references are copied directly: new array
     *   instances are not created. By default, source data arrays are copied
     *   to the new pulse. Use the NO_SOURCE flag to enforce a null source.
     * @return {Pulse} - Returns this Pulse instance.
     */
    init: function init(src, flags) {
      var p = this;
      p.stamp = src.stamp;
      p.encode = src.encode;
      if (src.fields && !(flags & NO_FIELDS)) {
        p.fields = src.fields;
      }
      if (flags & ADD) {
        p.addF = src.addF;
        p.add = src.add;
      } else {
        p.addF = null;
        p.add = [];
      }
      if (flags & REM) {
        p.remF = src.remF;
        p.rem = src.rem;
      } else {
        p.remF = null;
        p.rem = [];
      }
      if (flags & MOD$1) {
        p.modF = src.modF;
        p.mod = src.mod;
      } else {
        p.modF = null;
        p.mod = [];
      }
      if (flags & NO_SOURCE) {
        p.srcF = null;
        p.source = null;
      } else {
        p.srcF = src.srcF;
        p.source = src.source;
        if (src.cleans) p.cleans = src.cleans;
      }
      return p;
    },
    /**
     * Schedules a function to run after pulse propagation completes.
     * @param {function} func - The function to run.
     */
    runAfter: function runAfter(func) {
      this.dataflow.runAfter(func);
    },
    /**
     * Indicates if tuples have been added, removed or modified.
     * @param {number} [flags] - The tuple types (ADD, REM or MOD) to query.
     *   Defaults to ALL, returning true if any tuple type has changed.
     * @return {boolean} - Returns true if one or more queried tuple types have
     *   changed, false otherwise.
     */
    changed: function changed(flags) {
      var f = flags || ALL;
      return f & ADD && this.add.length || f & REM && this.rem.length || f & MOD$1 && this.mod.length;
    },
    /**
     * Forces a "reflow" of tuple values, such that all tuples in the backing
     * source are added to the MOD set, unless already present in the ADD set.
     * @param {boolean} [fork=false] - If true, returns a forked copy of this
     *   pulse, and invokes reflow on that derived pulse.
     * @return {Pulse} - The reflowed pulse instance.
     */
    reflow: function reflow(fork) {
      if (fork) return this.fork(ALL).reflow();
      var len = this.add.length,
        src = this.source && this.source.length;
      if (src && src !== len) {
        this.mod = this.source;
        if (len) this.filter(MOD$1, filter$1(this, ADD));
      }
      return this;
    },
    /**
     * Get/set metadata to pulse requesting garbage collection
     * to reclaim currently unused resources.
     */
    clean: function clean(value) {
      if (arguments.length) {
        this.cleans = !!value;
        return this;
      } else {
        return this.cleans;
      }
    },
    /**
     * Marks one or more data field names as modified to assist dependency
     * tracking and incremental processing by transform operators.
     * @param {string|Array<string>} _ - The field(s) to mark as modified.
     * @return {Pulse} - This pulse instance.
     */
    modifies: function modifies(_) {
      var hash = this.fields || (this.fields = {});
      if (isArray(_)) {
        _.forEach(function (f) {
          return hash[f] = true;
        });
      } else {
        hash[_] = true;
      }
      return this;
    },
    /**
     * Checks if one or more data fields have been modified during this pulse
     * propagation timestamp.
     * @param {string|Array<string>} _ - The field(s) to check for modified.
     * @param {boolean} nomod - If true, will check the modified flag even if
     *   no mod tuples exist. If false (default), mod tuples must be present.
     * @return {boolean} - Returns true if any of the provided fields has been
     *   marked as modified, false otherwise.
     */
    modified: function modified(_, nomod) {
      var fields = this.fields;
      return !((nomod || this.mod.length) && fields) ? false : !arguments.length ? !!fields : isArray(_) ? _.some(function (f) {
        return fields[f];
      }) : fields[_];
    },
    /**
     * Adds a filter function to one more tuple sets. Filters are applied to
     * backing tuple arrays, to determine the actual set of tuples considered
     * added, removed or modified. They can be used to delay materialization of
     * a tuple set in order to avoid expensive array copies. In addition, the
     * filter functions can serve as value transformers: unlike standard predicate
     * function (which return boolean values), Pulse filters should return the
     * actual tuple value to process. If a tuple set is already filtered, the
     * new filter function will be appended into a conjuntive ('and') query.
     * @param {number} flags - Flags indicating the tuple set(s) to filter.
     * @param {function(*):object} filter - Filter function that will be applied
     *   to the tuple set array, and should return a data tuple if the value
     *   should be included in the tuple set, and falsy (or null) otherwise.
     * @return {Pulse} - Returns this pulse instance.
     */
    filter: function filter(flags, _filter2) {
      var p = this;
      if (flags & ADD) p.addF = addFilter(p.addF, _filter2);
      if (flags & REM) p.remF = addFilter(p.remF, _filter2);
      if (flags & MOD$1) p.modF = addFilter(p.modF, _filter2);
      if (flags & SOURCE) p.srcF = addFilter(p.srcF, _filter2);
      return p;
    },
    /**
     * Materialize one or more tuple sets in this pulse. If the tuple set(s) have
     * a registered filter function, it will be applied and the tuple set(s) will
     * be replaced with materialized tuple arrays.
     * @param {number} flags - Flags indicating the tuple set(s) to materialize.
     * @return {Pulse} - Returns this pulse instance.
     */
    materialize: function materialize(flags) {
      flags = flags || ALL;
      var p = this;
      if (flags & ADD && p.addF) {
        p.add = _materialize(p.add, p.addF);
        p.addF = null;
      }
      if (flags & REM && p.remF) {
        p.rem = _materialize(p.rem, p.remF);
        p.remF = null;
      }
      if (flags & MOD$1 && p.modF) {
        p.mod = _materialize(p.mod, p.modF);
        p.modF = null;
      }
      if (flags & SOURCE && p.srcF) {
        p.source = p.source.filter(p.srcF);
        p.srcF = null;
      }
      return p;
    },
    /**
     * Visit one or more tuple sets in this pulse.
     * @param {number} flags - Flags indicating the tuple set(s) to visit.
     *   Legal values are ADD, REM, MOD and SOURCE (if a backing data source
     *   has been set).
     * @param {function(object):*} - Visitor function invoked per-tuple.
     * @return {Pulse} - Returns this pulse instance.
     */
    visit: function visit(flags, visitor) {
      var p = this,
        v = visitor;
      if (flags & SOURCE) {
        visitArray(p.source, p.srcF, v);
        return p;
      }
      if (flags & ADD) visitArray(p.add, p.addF, v);
      if (flags & REM) visitArray(p.rem, p.remF, v);
      if (flags & MOD$1) visitArray(p.mod, p.modF, v);
      var src = p.source;
      if (flags & REFLOW && src) {
        var sum = p.add.length + p.mod.length;
        if (sum === src.length) ;else if (sum) {
          visitArray(src, filter$1(p, ADD_MOD), v);
        } else {
          // if no add/rem/mod tuples, visit source
          visitArray(src, p.srcF, v);
        }
      }
      return p;
    }
  };

  /**
   * Represents a set of multiple pulses. Used as input for operators
   * that accept multiple pulses at a time. Contained pulses are
   * accessible via the public "pulses" array property. This pulse doe
   * not carry added, removed or modified tuples directly. However,
   * the visit method can be used to traverse all such tuples contained
   * in sub-pulses with a timestamp matching this parent multi-pulse.
   * @constructor
   * @param {Dataflow} dataflow - The backing dataflow instance.
   * @param {number} stamp - The timestamp.
   * @param {Array<Pulse>} pulses - The sub-pulses for this multi-pulse.
   */
  function MultiPulse(dataflow, stamp, pulses, encode) {
    var p = this;
    var c = 0;
    this.dataflow = dataflow;
    this.stamp = stamp;
    this.fields = null;
    this.encode = encode || null;
    this.pulses = pulses;
    var _iterator = _createForOfIteratorHelper(pulses),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _pulse2 = _step.value;
        if (_pulse2.stamp !== stamp) continue;
        if (_pulse2.fields) {
          var hash = p.fields || (p.fields = {});
          for (var f in _pulse2.fields) {
            hash[f] = 1;
          }
        }
        if (_pulse2.changed(p.ADD)) c |= p.ADD;
        if (_pulse2.changed(p.REM)) c |= p.REM;
        if (_pulse2.changed(p.MOD)) c |= p.MOD;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    this.changes = c;
  }
  inherits(MultiPulse, Pulse, {
    /**
     * Creates a new pulse based on the values of this pulse.
     * The dataflow, time stamp and field modification values are copied over.
     * @return {Pulse}
     */
    fork: function fork(flags) {
      var p = new Pulse(this.dataflow).init(this, flags & this.NO_FIELDS);
      if (flags !== undefined) {
        if (flags & p.ADD) this.visit(p.ADD, function (t) {
          return p.add.push(t);
        });
        if (flags & p.REM) this.visit(p.REM, function (t) {
          return p.rem.push(t);
        });
        if (flags & p.MOD) this.visit(p.MOD, function (t) {
          return p.mod.push(t);
        });
      }
      return p;
    },
    changed: function changed(flags) {
      return this.changes & flags;
    },
    modified: function modified(_) {
      var p = this,
        fields = p.fields;
      return !(fields && p.changes & p.MOD) ? 0 : isArray(_) ? _.some(function (f) {
        return fields[f];
      }) : fields[_];
    },
    filter: function filter() {
      error('MultiPulse does not support filtering.');
    },
    materialize: function materialize() {
      error('MultiPulse does not support materialization.');
    },
    visit: function visit(flags, visitor) {
      var p = this,
        pulses = p.pulses,
        n = pulses.length;
      var i = 0;
      if (flags & p.SOURCE) {
        for (; i < n; ++i) {
          pulses[i].visit(flags, visitor);
        }
      } else {
        for (; i < n; ++i) {
          if (pulses[i].stamp === p.stamp) {
            pulses[i].visit(flags, visitor);
          }
        }
      }
      return p;
    }
  });

  /* eslint-disable require-atomic-updates */

  /**
   * Evaluates the dataflow and returns a Promise that resolves when pulse
   * propagation completes. This method will increment the current timestamp
   * and process all updated, pulsed and touched operators. When invoked for
   * the first time, all registered operators will be processed. This method
   * should not be invoked by third-party clients, use {@link runAsync} or
   * {@link run} instead.
   * @param {string} [encode] - The name of an encoding set to invoke during
   *   propagation. This value is added to generated Pulse instances;
   *   operators can then respond to (or ignore) this setting as appropriate.
   *   This parameter can be used in conjunction with the Encode transform in
   *   the vega-encode package.
   * @param {function} [prerun] - An optional callback function to invoke
   *   immediately before dataflow evaluation commences.
   * @param {function} [postrun] - An optional callback function to invoke
   *   after dataflow evaluation completes. The callback will be invoked
   *   after those registered via {@link runAfter}.
   * @return {Promise} - A promise that resolves to this dataflow after
   *   evaluation completes.
   */
  function evaluate(_x8, _x9, _x10) {
    return _evaluate.apply(this, arguments);
  }
  /**
   * Queues dataflow evaluation to run once any other queued evaluations have
   * completed and returns a Promise that resolves when the queued pulse
   * propagation completes. If provided, a callback function will be invoked
   * immediately before evaluation commences. This method will ensure a
   * separate evaluation is invoked for each time it is called.
   * @param {string} [encode] - The name of an encoding set to invoke during
   *   propagation. This value is added to generated Pulse instances;
   *   operators can then respond to (or ignore) this setting as appropriate.
   *   This parameter can be used in conjunction with the Encode transform in
   *   the vega-encode package.
   * @param {function} [prerun] - An optional callback function to invoke
   *   immediately before dataflow evaluation commences.
   * @param {function} [postrun] - An optional callback function to invoke
   *   after dataflow evaluation completes. The callback will be invoked
   *   after those registered via {@link runAfter}.
   * @return {Promise} - A promise that resolves to this dataflow after
   *   evaluation completes.
   */
  function _evaluate() {
    _evaluate = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(encode, prerun, postrun) {
      var df, async, stamp, count, op, next, error, pr, i;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            df = this, async = []; // if the pulse value is set, this is a re-entrant call
            if (!df._pulse) {
              _context4.next = 3;
              break;
            }
            return _context4.abrupt("return", reentrant(df));
          case 3:
            if (!df._pending) {
              _context4.next = 6;
              break;
            }
            _context4.next = 6;
            return df._pending;
          case 6:
            if (!prerun) {
              _context4.next = 9;
              break;
            }
            _context4.next = 9;
            return asyncCallback(df, prerun);
          case 9:
            if (df._touched.length) {
              _context4.next = 12;
              break;
            }
            df.debug('Dataflow invoked, but nothing to do.');
            return _context4.abrupt("return", df);
          case 12:
            // increment timestamp clock
            stamp = ++df._clock; // set the current pulse
            df._pulse = new Pulse(df, stamp, encode);

            // initialize priority queue, reset touched operators
            df._touched.forEach(function (op) {
              return df._enqueue(op, true);
            });
            df._touched = UniqueList(id);
            count = 0;
            _context4.prev = 17;
          case 18:
            if (!(df._heap.size() > 0)) {
              _context4.next = 35;
              break;
            }
            // dequeue operator with highest priority
            op = df._heap.pop();

            // re-queue if rank changed
            if (!(op.rank !== op.qrank)) {
              _context4.next = 23;
              break;
            }
            df._enqueue(op, true);
            return _context4.abrupt("continue", 18);
          case 23:
            // otherwise, evaluate the operator
            next = op.run(df._getPulse(op, encode));
            if (!next.then) {
              _context4.next = 30;
              break;
            }
            _context4.next = 27;
            return next;
          case 27:
            next = _context4.sent;
            _context4.next = 31;
            break;
          case 30:
            if (next.async) {
              // queue parallel asynchronous execution
              async.push(next.async);
              next = StopPropagation;
            }
          case 31:
            // propagate evaluation, enqueue dependent operators
            if (next !== StopPropagation) {
              if (op._targets) op._targets.forEach(function (op) {
                return df._enqueue(op);
              });
            }

            // increment visit counter
            ++count;
            _context4.next = 18;
            break;
          case 35:
            _context4.next = 41;
            break;
          case 37:
            _context4.prev = 37;
            _context4.t0 = _context4["catch"](17);
            df._heap.clear();
            error = _context4.t0;
          case 41:
            // reset pulse map
            df._input = {};
            df._pulse = null;
            df.debug("Pulse ".concat(stamp, ": ").concat(count, " operators"));
            if (error) {
              df._postrun = [];
              df.error(error);
            }

            // invoke callbacks queued via runAfter
            if (!df._postrun.length) {
              _context4.next = 55;
              break;
            }
            pr = df._postrun.sort(function (a, b) {
              return b.priority - a.priority;
            });
            df._postrun = [];
            i = 0;
          case 49:
            if (!(i < pr.length)) {
              _context4.next = 55;
              break;
            }
            _context4.next = 52;
            return asyncCallback(df, pr[i].callback);
          case 52:
            ++i;
            _context4.next = 49;
            break;
          case 55:
            if (!postrun) {
              _context4.next = 58;
              break;
            }
            _context4.next = 58;
            return asyncCallback(df, postrun);
          case 58:
            // handle non-blocking asynchronous callbacks
            if (async.length) {
              Promise.all(async).then(function (cb) {
                return df.runAsync(null, function () {
                  cb.forEach(function (f) {
                    try {
                      f(df);
                    } catch (err) {
                      df.error(err);
                    }
                  });
                });
              });
            }
            return _context4.abrupt("return", df);
          case 60:
          case "end":
            return _context4.stop();
        }
      }, _callee4, this, [[17, 37]]);
    }));
    return _evaluate.apply(this, arguments);
  }
  function runAsync(_x11, _x12, _x13) {
    return _runAsync.apply(this, arguments);
  }
  /**
   * Requests dataflow evaluation and the immediately returns this dataflow
   * instance. If there are pending data loading or other asynchronous
   * operations, the dataflow will evaluate asynchronously after this method
   * has been invoked. To track when dataflow evaluation completes, use the
   * {@link runAsync} method instead. This method will raise an error if
   * invoked while the dataflow is already in the midst of evaluation.
   * @param {string} [encode] - The name of an encoding set to invoke during
   *   propagation. This value is added to generated Pulse instances;
   *   operators can then respond to (or ignore) this setting as appropriate.
   *   This parameter can be used in conjunction with the Encode transform in
   *   the vega-encode module.
   * @param {function} [prerun] - An optional callback function to invoke
   *   immediately before dataflow evaluation commences.
   * @param {function} [postrun] - An optional callback function to invoke
   *   after dataflow evaluation completes. The callback will be invoked
   *   after those registered via {@link runAfter}.
   * @return {Dataflow} - This dataflow instance.
   */
  function _runAsync() {
    _runAsync = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(encode, prerun, postrun) {
      var _this3 = this;
      var clear;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (!this._running) {
              _context5.next = 5;
              break;
            }
            _context5.next = 3;
            return this._running;
          case 3:
            _context5.next = 0;
            break;
          case 5:
            // run dataflow, manage running promise
            clear = function clear() {
              return _this3._running = null;
            };
            (this._running = this.evaluate(encode, prerun, postrun)).then(clear, clear);
            return _context5.abrupt("return", this._running);
          case 8:
          case "end":
            return _context5.stop();
        }
      }, _callee5, this);
    }));
    return _runAsync.apply(this, arguments);
  }
  function run(encode, prerun, postrun) {
    return this._pulse ? reentrant(this) : (this.evaluate(encode, prerun, postrun), this);
  }

  /**
   * Schedules a callback function to be invoked after the current pulse
   * propagation completes. If no propagation is currently occurring,
   * the function is invoked immediately. Callbacks scheduled via runAfter
   * are invoked immediately upon completion of the current cycle, before
   * any request queued via runAsync. This method is primarily intended for
   * internal use. Third-party callers using runAfter to schedule a callback
   * that invokes {@link run} or {@link runAsync} should not use this method,
   * but instead use {@link runAsync} with prerun or postrun arguments.
   * @param {function(Dataflow)} callback - The callback function to run.
   *   The callback will be invoked with this Dataflow instance as its
   *   sole argument.
   * @param {boolean} enqueue - A boolean flag indicating that the
   *   callback should be queued up to run after the next propagation
   *   cycle, suppressing immediate invocation when propagation is not
   *   currently occurring.
   * @param {number} [priority] - A priority value used to sort registered
   *   callbacks to determine execution order. This argument is intended
   *   for internal Vega use only.
   */
  function runAfter(callback, enqueue, priority) {
    if (this._pulse || enqueue) {
      // pulse propagation is currently running, queue to run after
      this._postrun.push({
        priority: priority || 0,
        callback: callback
      });
    } else {
      // pulse propagation already complete, invoke immediately
      try {
        callback(this);
      } catch (err) {
        this.error(err);
      }
    }
  }

  /**
   * Raise an error for re-entrant dataflow evaluation.
   */
  function reentrant(df) {
    df.error('Dataflow already running. Use runAsync() to chain invocations.');
    return df;
  }

  /**
   * Enqueue an operator into the priority queue for evaluation. The operator
   * will be enqueued if it has no registered pulse for the current cycle, or if
   * the force argument is true. Upon enqueue, this method also sets the
   * operator's qrank to the current rank value.
   * @param {Operator} op - The operator to enqueue.
   * @param {boolean} [force] - A flag indicating if the operator should be
   *   forceably added to the queue, even if it has already been previously
   *   enqueued during the current pulse propagation. This is useful when the
   *   dataflow graph is dynamically modified and the operator rank changes.
   */
  function enqueue(op, force) {
    var q = op.stamp < this._clock;
    if (q) op.stamp = this._clock;
    if (q || force) {
      op.qrank = op.rank;
      this._heap.push(op);
    }
  }

  /**
   * Provide a correct pulse for evaluating an operator. If the operator has an
   * explicit source operator, we will try to pull the pulse(s) from it.
   * If there is an array of source operators, we build a multi-pulse.
   * Otherwise, we return a current pulse with correct source data.
   * If the pulse is the pulse map has an explicit target set, we use that.
   * Else if the pulse on the upstream source operator is current, we use that.
   * Else we use the pulse from the pulse map, but copy the source tuple array.
   * @param {Operator} op - The operator for which to get an input pulse.
   * @param {string} [encode] - An (optional) encoding set name with which to
   *   annotate the returned pulse. See {@link run} for more information.
   */
  function getPulse(op, encode) {
    var s = op.source,
      stamp = this._clock;
    return s && isArray(s) ? new MultiPulse(this, stamp, s.map(function (_) {
      return _.pulse;
    }), encode) : this._input[op.id] || singlePulse(this._pulse, s && s.pulse);
  }
  function singlePulse(p, s) {
    if (s && s.stamp === p.stamp) {
      return s;
    }
    p = p.fork();
    if (s && s !== StopPropagation) {
      p.source = s.source;
    }
    return p;
  }
  var NO_OPT = {
    skip: false,
    force: false
  };

  /**
   * Touches an operator, scheduling it to be evaluated. If invoked outside of
   * a pulse propagation, the operator will be evaluated the next time this
   * dataflow is run. If invoked in the midst of pulse propagation, the operator
   * will be queued for evaluation if and only if the operator has not yet been
   * evaluated on the current propagation timestamp.
   * @param {Operator} op - The operator to touch.
   * @param {object} [options] - Additional options hash.
   * @param {boolean} [options.skip] - If true, the operator will
   *   be skipped: it will not be evaluated, but its dependents will be.
   * @return {Dataflow}
   */
  function touch(op, options) {
    var opt = options || NO_OPT;
    if (this._pulse) {
      // if in midst of propagation, add to priority queue
      this._enqueue(op);
    } else {
      // otherwise, queue for next propagation
      this._touched.add(op);
    }
    if (opt.skip) op.skip(true);
    return this;
  }

  /**
   * Updates the value of the given operator.
   * @param {Operator} op - The operator to update.
   * @param {*} value - The value to set.
   * @param {object} [options] - Additional options hash.
   * @param {boolean} [options.force] - If true, the operator will
   *   be re-evaluated even if its value has not changed.
   * @param {boolean} [options.skip] - If true, the operator will
   *   be skipped: it will not be evaluated, but its dependents will be.
   * @return {Dataflow}
   */
  function update$6(op, value, options) {
    var opt = options || NO_OPT;
    if (op.set(value) || opt.force) {
      this.touch(op, opt);
    }
    return this;
  }

  /**
   * Pulses an operator with a changeset of tuples. If invoked outside of
   * a pulse propagation, the pulse will be applied the next time this
   * dataflow is run. If invoked in the midst of pulse propagation, the pulse
   * will be added to the set of active pulses and will be applied if and
   * only if the target operator has not yet been evaluated on the current
   * propagation timestamp.
   * @param {Operator} op - The operator to pulse.
   * @param {ChangeSet} value - The tuple changeset to apply.
   * @param {object} [options] - Additional options hash.
   * @param {boolean} [options.skip] - If true, the operator will
   *   be skipped: it will not be evaluated, but its dependents will be.
   * @return {Dataflow}
   */
  function pulse(op, changeset, options) {
    this.touch(op, options || NO_OPT);
    var p = new Pulse(this, this._clock + (this._pulse ? 0 : 1)),
      t = op.pulse && op.pulse.source || [];
    p.target = op;
    this._input[op.id] = changeset.pulse(p, t);
    return this;
  }
  function Heap(cmp) {
    var nodes = [];
    return {
      clear: function clear() {
        return nodes = [];
      },
      size: function size() {
        return nodes.length;
      },
      peek: function peek() {
        return nodes[0];
      },
      push: function push(x) {
        nodes.push(x);
        return siftdown(nodes, 0, nodes.length - 1, cmp);
      },
      pop: function pop() {
        var last = nodes.pop();
        var item;
        if (nodes.length) {
          item = nodes[0];
          nodes[0] = last;
          siftup(nodes, 0, cmp);
        } else {
          item = last;
        }
        return item;
      }
    };
  }
  function siftdown(array, start, idx, cmp) {
    var parent, pidx;
    var item = array[idx];
    while (idx > start) {
      pidx = idx - 1 >> 1;
      parent = array[pidx];
      if (cmp(item, parent) < 0) {
        array[idx] = parent;
        idx = pidx;
        continue;
      }
      break;
    }
    return array[idx] = item;
  }
  function siftup(array, idx, cmp) {
    var start = idx,
      end = array.length,
      item = array[idx];
    var cidx = (idx << 1) + 1,
      ridx;
    while (cidx < end) {
      ridx = cidx + 1;
      if (ridx < end && cmp(array[cidx], array[ridx]) >= 0) {
        cidx = ridx;
      }
      array[idx] = array[cidx];
      idx = cidx;
      cidx = (idx << 1) + 1;
    }
    array[idx] = item;
    return siftdown(array, start, idx, cmp);
  }

  /**
   * A dataflow graph for reactive processing of data streams.
   * @constructor
   */
  function Dataflow() {
    this.logger(logger());
    this.logLevel(Error$1);
    this._clock = 0;
    this._rank = 0;
    this._locale = defaultLocale();
    try {
      this._loader = loader();
    } catch (e) {
      // do nothing if loader module is unavailable
    }
    this._touched = UniqueList(id);
    this._input = {};
    this._pulse = null;
    this._heap = Heap(function (a, b) {
      return a.qrank - b.qrank;
    });
    this._postrun = [];
  }
  function logMethod(method) {
    return function () {
      return this._log[method].apply(this, arguments);
    };
  }
  Dataflow.prototype = {
    /**
     * The current timestamp of this dataflow. This value reflects the
     * timestamp of the previous dataflow run. The dataflow is initialized
     * with a stamp value of 0. The initial run of the dataflow will have
     * a timestap of 1, and so on. This value will match the
     * {@link Pulse.stamp} property.
     * @return {number} - The current timestamp value.
     */
    stamp: function stamp() {
      return this._clock;
    },
    /**
     * Gets or sets the loader instance to use for data file loading. A
     * loader object must provide a "load" method for loading files and a
     * "sanitize" method for checking URL/filename validity. Both methods
     * should accept a URI and options hash as arguments, and return a Promise
     * that resolves to the loaded file contents (load) or a hash containing
     * sanitized URI data with the sanitized url assigned to the "href" property
     * (sanitize).
     * @param {object} _ - The loader instance to use.
     * @return {object|Dataflow} - If no arguments are provided, returns
     *   the current loader instance. Otherwise returns this Dataflow instance.
     */
    loader: function loader(_) {
      if (arguments.length) {
        this._loader = _;
        return this;
      } else {
        return this._loader;
      }
    },
    /**
     * Gets or sets the locale instance to use for formatting and parsing
     * string values. The locale object should be provided by the
     * vega-format library, and include methods such as format, timeFormat,
     * utcFormat, timeParse, and utcParse.
     * @param {object} _ - The locale instance to use.
     * @return {object|Dataflow} - If no arguments are provided, returns
     *   the current locale instance. Otherwise returns this Dataflow instance.
     */
    locale: function locale(_) {
      if (arguments.length) {
        this._locale = _;
        return this;
      } else {
        return this._locale;
      }
    },
    /**
     * Get or set the logger instance used to log messages. If no arguments are
     * provided, returns the current logger instance. Otherwise, sets the logger
     * and return this Dataflow instance. Provided loggers must support the full
     * API of logger objects generated by the vega-util logger method. Note that
     * by default the log level of the new logger will be used; use the logLevel
     * method to adjust the log level as needed.
     */
    logger: function logger(_logger) {
      if (arguments.length) {
        this._log = _logger;
        return this;
      } else {
        return this._log;
      }
    },
    /**
     * Logs an error message. By default, logged messages are written to console
     * output. The message will only be logged if the current log level is high
     * enough to permit error messages.
     */
    error: logMethod('error'),
    /**
     * Logs a warning message. By default, logged messages are written to console
     * output. The message will only be logged if the current log level is high
     * enough to permit warning messages.
     */
    warn: logMethod('warn'),
    /**
     * Logs a information message. By default, logged messages are written to
     * console output. The message will only be logged if the current log level is
     * high enough to permit information messages.
     */
    info: logMethod('info'),
    /**
     * Logs a debug message. By default, logged messages are written to console
     * output. The message will only be logged if the current log level is high
     * enough to permit debug messages.
     */
    debug: logMethod('debug'),
    /**
     * Get or set the current log level. If an argument is provided, it
     * will be used as the new log level.
     * @param {number} [level] - Should be one of None, Warn, Info
     * @return {number} - The current log level.
     */
    logLevel: logMethod('level'),
    /**
     * Empty entry threshold for garbage cleaning. Map data structures will
     * perform cleaning once the number of empty entries exceeds this value.
     */
    cleanThreshold: 1e4,
    // OPERATOR REGISTRATION
    add: add$2,
    connect: connect,
    rank: rank,
    rerank: rerank,
    // OPERATOR UPDATES
    pulse: pulse,
    touch: touch,
    update: update$6,
    changeset: changeset,
    // DATA LOADING
    ingest: ingest,
    parse: parse$5,
    preload: preload,
    request: request,
    // EVENT HANDLING
    events: events$1,
    on: on,
    // PULSE PROPAGATION
    evaluate: evaluate,
    run: run,
    runAsync: runAsync,
    runAfter: runAfter,
    _enqueue: enqueue,
    _getPulse: getPulse
  };

  /**
   * Abstract class for operators that process data tuples.
   * Subclasses must provide a {@link transform} method for operator processing.
   * @constructor
   * @param {*} [init] - The initial value for this operator.
   * @param {object} [params] - The parameters for this operator.
   * @param {Operator} [source] - The operator from which to receive pulses.
   */
  function Transform(init, params) {
    Operator.call(this, init, null, params);
  }
  inherits(Transform, Operator, {
    /**
     * Overrides {@link Operator.evaluate} for transform operators.
     * Internally, this method calls {@link evaluate} to perform processing.
     * If {@link evaluate} returns a falsy value, the input pulse is returned.
     * This method should NOT be overridden, instead overrride {@link evaluate}.
     * @param {Pulse} pulse - the current dataflow pulse.
     * @return the output pulse for this operator (or StopPropagation)
     */
    run: function run(pulse) {
      var _this2 = this;
      if (pulse.stamp < this.stamp) return pulse.StopPropagation;
      var rv;
      if (this.skip()) {
        this.skip(false);
      } else {
        rv = this.evaluate(pulse);
      }
      rv = rv || pulse;
      if (rv.then) {
        rv = rv.then(function (_) {
          return _this2.pulse = _;
        });
      } else if (rv !== pulse.StopPropagation) {
        this.pulse = rv;
      }
      return rv;
    },
    /**
     * Overrides {@link Operator.evaluate} for transform operators.
     * Marshalls parameter values and then invokes {@link transform}.
     * @param {Pulse} pulse - the current dataflow pulse.
     * @return {Pulse} The output pulse (or StopPropagation). A falsy return
         value (including undefined) will let the input pulse pass through.
    */
    evaluate: function evaluate(pulse) {
      var params = this.marshall(pulse.stamp),
        out = this.transform(params, pulse);
      params.clear();
      return out;
    },
    /**
     * Process incoming pulses.
     * Subclasses should override this method to implement transforms.
     * @param {Parameters} _ - The operator parameter values.
     * @param {Pulse} pulse - The current dataflow pulse.
     * @return {Pulse} The output pulse (or StopPropagation). A falsy return
     *   value (including undefined) will let the input pulse pass through.
     */
    transform: function transform() {}
  });
  var transforms = {};
  function definition$1(type) {
    var t = transform$1(type);
    return t && t.Definition || null;
  }
  function transform$1(type) {
    type = type && type.toLowerCase();
    return _has(transforms, type) ? transforms[type] : null;
  }

  var _marked = /*#__PURE__*/_regeneratorRuntime().mark(numbers$1);
  function numbers$1(values, valueof) {
    var _iterator, _step, value, index, _iterator2, _step2, _value;
    return _regeneratorRuntime().wrap(function numbers$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(valueof == null)) {
            _context.next = 21;
            break;
          }
          _iterator = _createForOfIteratorHelper(values);
          _context.prev = 2;
          _iterator.s();
        case 4:
          if ((_step = _iterator.n()).done) {
            _context.next = 11;
            break;
          }
          value = _step.value;
          if (!(value != null && value !== '' && (value = +value) >= value)) {
            _context.next = 9;
            break;
          }
          _context.next = 9;
          return value;
        case 9:
          _context.next = 4;
          break;
        case 11:
          _context.next = 16;
          break;
        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](2);
          _iterator.e(_context.t0);
        case 16:
          _context.prev = 16;
          _iterator.f();
          return _context.finish(16);
        case 19:
          _context.next = 41;
          break;
        case 21:
          index = -1;
          _iterator2 = _createForOfIteratorHelper(values);
          _context.prev = 23;
          _iterator2.s();
        case 25:
          if ((_step2 = _iterator2.n()).done) {
            _context.next = 33;
            break;
          }
          _value = _step2.value;
          _value = valueof(_value, ++index, values);
          if (!(_value != null && _value !== '' && (_value = +_value) >= _value)) {
            _context.next = 31;
            break;
          }
          _context.next = 31;
          return _value;
        case 31:
          _context.next = 25;
          break;
        case 33:
          _context.next = 38;
          break;
        case 35:
          _context.prev = 35;
          _context.t1 = _context["catch"](23);
          _iterator2.e(_context.t1);
        case 38:
          _context.prev = 38;
          _iterator2.f();
          return _context.finish(38);
        case 41:
        case "end":
          return _context.stop();
      }
    }, _marked, null, [[2, 13, 16, 19], [23, 35, 38, 41]]);
  }
  function quantiles(array, p, f) {
    var values = Float64Array.from(numbers$1(array, f));

    // don't depend on return value from typed array sort call
    // protects against undefined sort results in Safari (vega/vega-lite#4964)
    values.sort(d3Array.ascending);
    return p.map(function (_) {
      return d3Array.quantileSorted(values, _);
    });
  }
  function quartiles(array, f) {
    return quantiles(array, [0.25, 0.50, 0.75], f);
  }

  // Scott, D. W. (1992) Multivariate Density Estimation:
  // Theory, Practice, and Visualization. Wiley.
  function estimateBandwidth(array, f) {
    var n = array.length,
      d = d3Array.deviation(array, f),
      q = quartiles(array, f),
      h = (q[2] - q[0]) / 1.34,
      v = Math.min(d, h) || d || Math.abs(q[0]) || 1;
    return 1.06 * v * Math.pow(n, -0.2);
  }
  function bin(_) {
    // determine range
    var maxb = _.maxbins || 20,
      base = _.base || 10,
      logb = Math.log(base),
      div = _.divide || [5, 2];
    var min = _.extent[0],
      max = _.extent[1],
      step,
      level,
      minstep,
      v,
      i,
      n;
    var span = _.span || max - min || Math.abs(min) || 1;
    if (_.step) {
      // if step size is explicitly given, use that
      step = _.step;
    } else if (_.steps) {
      // if provided, limit choice to acceptable step sizes
      v = span / maxb;
      for (i = 0, n = _.steps.length; i < n && _.steps[i] < v; ++i);
      step = _.steps[Math.max(0, i - 1)];
    } else {
      // else use span to determine step size
      level = Math.ceil(Math.log(maxb) / logb);
      minstep = _.minstep || 0;
      step = Math.max(minstep, Math.pow(base, Math.round(Math.log(span) / logb) - level));

      // increase step size if too many bins
      while (Math.ceil(span / step) > maxb) {
        step *= base;
      }

      // decrease step size if allowed
      for (i = 0, n = div.length; i < n; ++i) {
        v = step / div[i];
        if (v >= minstep && span / v <= maxb) step = v;
      }
    }

    // update precision, min and max
    v = Math.log(step);
    var precision = v >= 0 ? 0 : ~~(-v / logb) + 1,
      eps = Math.pow(base, -precision - 1);
    if (_.nice || _.nice === undefined) {
      v = Math.floor(min / step + eps) * step;
      min = min < v ? v - step : v;
      max = Math.ceil(max / step) * step;
    }
    return {
      start: min,
      stop: max === min ? min + step : max,
      step: step
    };
  }
  exports.random = Math.random;
  function setRandom(r) {
    exports.random = r;
  }
  function bootstrapCI(array, samples, alpha, f) {
    if (!array.length) return [undefined, undefined];
    var values = Float64Array.from(numbers$1(array, f)),
      n = values.length,
      m = samples;
    var a, i, j, mu;
    for (j = 0, mu = Array(m); j < m; ++j) {
      for (a = 0, i = 0; i < n; ++i) {
        a += values[~~(exports.random() * n)];
      }
      mu[j] = a / n;
    }
    mu.sort(d3Array.ascending);
    return [d3Array.quantile(mu, alpha / 2), d3Array.quantile(mu, 1 - alpha / 2)];
  }

  // Dot density binning for dot plot construction.
  // Based on Leland Wilkinson, Dot Plots, The American Statistician, 1999.
  // https://www.cs.uic.edu/~wilkinson/Publications/dotplots.pdf
  function dotbin(array, step, smooth, f) {
    f = f || function (_) {
      return _;
    };
    var n = array.length,
      v = new Float64Array(n);
    var i = 0,
      j = 1,
      a = f(array[0]),
      b = a,
      w = a + step,
      x;
    for (; j < n; ++j) {
      x = f(array[j]);
      if (x >= w) {
        b = (a + b) / 2;
        for (; i < j; ++i) v[i] = b;
        w = x + step;
        a = x;
      }
      b = x;
    }
    b = (a + b) / 2;
    for (; i < j; ++i) v[i] = b;
    return smooth ? smoothing(v, step + step / 4) : v;
  }

  // perform smoothing to reduce variance
  // swap points between "adjacent" stacks
  // Wilkinson defines adjacent as within step/4 units
  function smoothing(v, thresh) {
    var n = v.length;
    var a = 0,
      b = 1,
      c,
      d;

    // get left stack
    while (v[a] === v[b]) ++b;
    while (b < n) {
      // get right stack
      c = b + 1;
      while (v[b] === v[c]) ++c;

      // are stacks adjacent?
      // if so, compare sizes and swap as needed
      if (v[b] - v[b - 1] < thresh) {
        d = b + (a + c - b - b >> 1);
        while (d < b) v[d++] = v[b];
        while (d > b) v[d--] = v[a];
      }

      // update left stack indices
      a = b;
      b = c;
    }
    return v;
  }
  function lcg(seed) {
    // Random numbers using a Linear Congruential Generator with seed value
    // Uses glibc values from https://en.wikipedia.org/wiki/Linear_congruential_generator
    return function () {
      seed = (1103515245 * seed + 12345) % 2147483647;
      return seed / 2147483647;
    };
  }
  function integer(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    var a, b, d;
    var dist = {
      min: function min(_) {
        if (arguments.length) {
          a = _ || 0;
          d = b - a;
          return dist;
        } else {
          return a;
        }
      },
      max: function max(_) {
        if (arguments.length) {
          b = _ || 0;
          d = b - a;
          return dist;
        } else {
          return b;
        }
      },
      sample: function sample() {
        return a + Math.floor(d * exports.random());
      },
      pdf: function pdf(x) {
        return x === Math.floor(x) && x >= a && x < b ? 1 / d : 0;
      },
      cdf: function cdf(x) {
        var v = Math.floor(x);
        return v < a ? 0 : v >= b ? 1 : (v - a + 1) / d;
      },
      icdf: function icdf(p) {
        return p >= 0 && p <= 1 ? a - 1 + Math.floor(p * d) : NaN;
      }
    };
    return dist.min(min).max(max);
  }
  var SQRT2PI = Math.sqrt(2 * Math.PI);
  var SQRT2 = Math.SQRT2;
  var nextSample = NaN;
  function sampleNormal(mean, stdev) {
    mean = mean || 0;
    stdev = stdev == null ? 1 : stdev;
    var x = 0,
      y = 0,
      rds,
      c;
    if (nextSample === nextSample) {
      x = nextSample;
      nextSample = NaN;
    } else {
      do {
        x = exports.random() * 2 - 1;
        y = exports.random() * 2 - 1;
        rds = x * x + y * y;
      } while (rds === 0 || rds > 1);
      c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
      x *= c;
      nextSample = y * c;
    }
    return mean + x * stdev;
  }
  function densityNormal(value, mean, stdev) {
    stdev = stdev == null ? 1 : stdev;
    var z = (value - (mean || 0)) / stdev;
    return Math.exp(-0.5 * z * z) / (stdev * SQRT2PI);
  }

  // Approximation from West (2009)
  // Better Approximations to Cumulative Normal Functions
  function cumulativeNormal(value, mean, stdev) {
    mean = mean || 0;
    stdev = stdev == null ? 1 : stdev;
    var z = (value - mean) / stdev,
      Z = Math.abs(z);
    var cd;
    if (Z > 37) {
      cd = 0;
    } else {
      var _exp = Math.exp(-Z * Z / 2);
      var sum;
      if (Z < 7.07106781186547) {
        sum = 3.52624965998911e-02 * Z + 0.700383064443688;
        sum = sum * Z + 6.37396220353165;
        sum = sum * Z + 33.912866078383;
        sum = sum * Z + 112.079291497871;
        sum = sum * Z + 221.213596169931;
        sum = sum * Z + 220.206867912376;
        cd = _exp * sum;
        sum = 8.83883476483184e-02 * Z + 1.75566716318264;
        sum = sum * Z + 16.064177579207;
        sum = sum * Z + 86.7807322029461;
        sum = sum * Z + 296.564248779674;
        sum = sum * Z + 637.333633378831;
        sum = sum * Z + 793.826512519948;
        sum = sum * Z + 440.413735824752;
        cd = cd / sum;
      } else {
        sum = Z + 0.65;
        sum = Z + 4 / sum;
        sum = Z + 3 / sum;
        sum = Z + 2 / sum;
        sum = Z + 1 / sum;
        cd = _exp / sum / 2.506628274631;
      }
    }
    return z > 0 ? 1 - cd : cd;
  }

  // Approximation of Probit function using inverse error function.
  function quantileNormal(p, mean, stdev) {
    if (p < 0 || p > 1) return NaN;
    return (mean || 0) + (stdev == null ? 1 : stdev) * SQRT2 * erfinv(2 * p - 1);
  }

  // Approximate inverse error function. Implementation from "Approximating
  // the erfinv function" by Mike Giles, GPU Computing Gems, volume 2, 2010.
  // Ported from Apache Commons Math, http://www.apache.org/licenses/LICENSE-2.0
  function erfinv(x) {
    // beware that the logarithm argument must be
    // commputed as (1.0 - x) * (1.0 + x),
    // it must NOT be simplified as 1.0 - x * x as this
    // would induce rounding errors near the boundaries +/-1
    var w = -Math.log((1 - x) * (1 + x)),
      p;
    if (w < 6.25) {
      w -= 3.125;
      p = -3.6444120640178196996e-21;
      p = -1.685059138182016589e-19 + p * w;
      p = 1.2858480715256400167e-18 + p * w;
      p = 1.115787767802518096e-17 + p * w;
      p = -1.333171662854620906e-16 + p * w;
      p = 2.0972767875968561637e-17 + p * w;
      p = 6.6376381343583238325e-15 + p * w;
      p = -4.0545662729752068639e-14 + p * w;
      p = -8.1519341976054721522e-14 + p * w;
      p = 2.6335093153082322977e-12 + p * w;
      p = -1.2975133253453532498e-11 + p * w;
      p = -5.4154120542946279317e-11 + p * w;
      p = 1.051212273321532285e-09 + p * w;
      p = -4.1126339803469836976e-09 + p * w;
      p = -2.9070369957882005086e-08 + p * w;
      p = 4.2347877827932403518e-07 + p * w;
      p = -1.3654692000834678645e-06 + p * w;
      p = -1.3882523362786468719e-05 + p * w;
      p = 0.0001867342080340571352 + p * w;
      p = -0.00074070253416626697512 + p * w;
      p = -0.0060336708714301490533 + p * w;
      p = 0.24015818242558961693 + p * w;
      p = 1.6536545626831027356 + p * w;
    } else if (w < 16.0) {
      w = Math.sqrt(w) - 3.25;
      p = 2.2137376921775787049e-09;
      p = 9.0756561938885390979e-08 + p * w;
      p = -2.7517406297064545428e-07 + p * w;
      p = 1.8239629214389227755e-08 + p * w;
      p = 1.5027403968909827627e-06 + p * w;
      p = -4.013867526981545969e-06 + p * w;
      p = 2.9234449089955446044e-06 + p * w;
      p = 1.2475304481671778723e-05 + p * w;
      p = -4.7318229009055733981e-05 + p * w;
      p = 6.8284851459573175448e-05 + p * w;
      p = 2.4031110387097893999e-05 + p * w;
      p = -0.0003550375203628474796 + p * w;
      p = 0.00095328937973738049703 + p * w;
      p = -0.0016882755560235047313 + p * w;
      p = 0.0024914420961078508066 + p * w;
      p = -0.0037512085075692412107 + p * w;
      p = 0.005370914553590063617 + p * w;
      p = 1.0052589676941592334 + p * w;
      p = 3.0838856104922207635 + p * w;
    } else if (Number.isFinite(w)) {
      w = Math.sqrt(w) - 5.0;
      p = -2.7109920616438573243e-11;
      p = -2.5556418169965252055e-10 + p * w;
      p = 1.5076572693500548083e-09 + p * w;
      p = -3.7894654401267369937e-09 + p * w;
      p = 7.6157012080783393804e-09 + p * w;
      p = -1.4960026627149240478e-08 + p * w;
      p = 2.9147953450901080826e-08 + p * w;
      p = -6.7711997758452339498e-08 + p * w;
      p = 2.2900482228026654717e-07 + p * w;
      p = -9.9298272942317002539e-07 + p * w;
      p = 4.5260625972231537039e-06 + p * w;
      p = -1.9681778105531670567e-05 + p * w;
      p = 7.5995277030017761139e-05 + p * w;
      p = -0.00021503011930044477347 + p * w;
      p = -0.00013871931833623122026 + p * w;
      p = 1.0103004648645343977 + p * w;
      p = 4.8499064014085844221 + p * w;
    } else {
      p = Infinity;
    }
    return p * x;
  }
  function gaussian(mean, stdev) {
    var mu, sigma;
    var dist = {
      mean: function mean(_) {
        if (arguments.length) {
          mu = _ || 0;
          return dist;
        } else {
          return mu;
        }
      },
      stdev: function stdev(_) {
        if (arguments.length) {
          sigma = _ == null ? 1 : _;
          return dist;
        } else {
          return sigma;
        }
      },
      sample: function sample() {
        return sampleNormal(mu, sigma);
      },
      pdf: function pdf(value) {
        return densityNormal(value, mu, sigma);
      },
      cdf: function cdf(value) {
        return cumulativeNormal(value, mu, sigma);
      },
      icdf: function icdf(p) {
        return quantileNormal(p, mu, sigma);
      }
    };
    return dist.mean(mean).stdev(stdev);
  }
  function kde(support, _bandwidth) {
    var kernel = gaussian();
    var n = 0;
    var dist = {
      data: function data(_) {
        if (arguments.length) {
          support = _;
          n = _ ? _.length : 0;
          return dist.bandwidth(_bandwidth);
        } else {
          return support;
        }
      },
      bandwidth: function bandwidth(_) {
        if (!arguments.length) return _bandwidth;
        _bandwidth = _;
        if (!_bandwidth && support) _bandwidth = estimateBandwidth(support);
        return dist;
      },
      sample: function sample() {
        return support[~~(exports.random() * n)] + _bandwidth * kernel.sample();
      },
      pdf: function pdf(x) {
        var y = 0,
          i = 0;
        for (; i < n; ++i) {
          y += kernel.pdf((x - support[i]) / _bandwidth);
        }
        return y / _bandwidth / n;
      },
      cdf: function cdf(x) {
        var y = 0,
          i = 0;
        for (; i < n; ++i) {
          y += kernel.cdf((x - support[i]) / _bandwidth);
        }
        return y / n;
      },
      icdf: function icdf() {
        throw Error('KDE icdf not supported.');
      }
    };
    return dist.data(support);
  }
  function sampleLogNormal(mean, stdev) {
    mean = mean || 0;
    stdev = stdev == null ? 1 : stdev;
    return Math.exp(mean + sampleNormal() * stdev);
  }
  function densityLogNormal(value, mean, stdev) {
    if (value <= 0) return 0;
    mean = mean || 0;
    stdev = stdev == null ? 1 : stdev;
    var z = (Math.log(value) - mean) / stdev;
    return Math.exp(-0.5 * z * z) / (stdev * SQRT2PI * value);
  }
  function cumulativeLogNormal(value, mean, stdev) {
    return cumulativeNormal(Math.log(value), mean, stdev);
  }
  function quantileLogNormal(p, mean, stdev) {
    return Math.exp(quantileNormal(p, mean, stdev));
  }
  function lognormal(mean, stdev) {
    var mu, sigma;
    var dist = {
      mean: function mean(_) {
        if (arguments.length) {
          mu = _ || 0;
          return dist;
        } else {
          return mu;
        }
      },
      stdev: function stdev(_) {
        if (arguments.length) {
          sigma = _ == null ? 1 : _;
          return dist;
        } else {
          return sigma;
        }
      },
      sample: function sample() {
        return sampleLogNormal(mu, sigma);
      },
      pdf: function pdf(value) {
        return densityLogNormal(value, mu, sigma);
      },
      cdf: function cdf(value) {
        return cumulativeLogNormal(value, mu, sigma);
      },
      icdf: function icdf(p) {
        return quantileLogNormal(p, mu, sigma);
      }
    };
    return dist.mean(mean).stdev(stdev);
  }
  function mixture$1(dists, _weights) {
    var m = 0,
      w;
    function normalize(x) {
      var w = [];
      var sum = 0,
        i;
      for (i = 0; i < m; ++i) {
        sum += w[i] = x[i] == null ? 1 : +x[i];
      }
      for (i = 0; i < m; ++i) {
        w[i] /= sum;
      }
      return w;
    }
    var dist = {
      weights: function weights(_) {
        if (arguments.length) {
          w = normalize(_weights = _ || []);
          return dist;
        }
        return _weights;
      },
      distributions: function distributions(_) {
        if (arguments.length) {
          if (_) {
            m = _.length;
            dists = _;
          } else {
            m = 0;
            dists = [];
          }
          return dist.weights(_weights);
        }
        return dists;
      },
      sample: function sample() {
        var r = exports.random();
        var d = dists[m - 1],
          v = w[0],
          i = 0;

        // first select distribution
        for (; i < m - 1; v += w[++i]) {
          if (r < v) {
            d = dists[i];
            break;
          }
        }
        // then sample from it
        return d.sample();
      },
      pdf: function pdf(x) {
        var p = 0,
          i = 0;
        for (; i < m; ++i) {
          p += w[i] * dists[i].pdf(x);
        }
        return p;
      },
      cdf: function cdf(x) {
        var p = 0,
          i = 0;
        for (; i < m; ++i) {
          p += w[i] * dists[i].cdf(x);
        }
        return p;
      },
      icdf: function icdf() {
        throw Error('Mixture icdf not supported.');
      }
    };
    return dist.distributions(dists).weights(_weights);
  }
  function sampleUniform(min, max) {
    if (max == null) {
      max = min == null ? 1 : min;
      min = 0;
    }
    return min + (max - min) * exports.random();
  }
  function densityUniform(value, min, max) {
    if (max == null) {
      max = min == null ? 1 : min;
      min = 0;
    }
    return value >= min && value <= max ? 1 / (max - min) : 0;
  }
  function cumulativeUniform(value, min, max) {
    if (max == null) {
      max = min == null ? 1 : min;
      min = 0;
    }
    return value < min ? 0 : value > max ? 1 : (value - min) / (max - min);
  }
  function quantileUniform(p, min, max) {
    if (max == null) {
      max = min == null ? 1 : min;
      min = 0;
    }
    return p >= 0 && p <= 1 ? min + p * (max - min) : NaN;
  }
  function uniform(min, max) {
    var a, b;
    var dist = {
      min: function min(_) {
        if (arguments.length) {
          a = _ || 0;
          return dist;
        } else {
          return a;
        }
      },
      max: function max(_) {
        if (arguments.length) {
          b = _ == null ? 1 : _;
          return dist;
        } else {
          return b;
        }
      },
      sample: function sample() {
        return sampleUniform(a, b);
      },
      pdf: function pdf(value) {
        return densityUniform(value, a, b);
      },
      cdf: function cdf(value) {
        return cumulativeUniform(value, a, b);
      },
      icdf: function icdf(p) {
        return quantileUniform(p, a, b);
      }
    };
    if (max == null) {
      max = min == null ? 1 : min;
      min = 0;
    }
    return dist.min(min).max(max);
  }
  function constant(data, x, y) {
    var mean = 0,
      n = 0;
    var _iterator3 = _createForOfIteratorHelper(data),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var d = _step3.value;
        var val = y(d);
        if (x(d) == null || val == null || isNaN(val)) continue;
        mean += (val - mean) / ++n;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return {
      coef: [mean],
      predict: function predict() {
        return mean;
      },
      rSquared: 0
    };
  }

  // Ordinary Least Squares
  function ols(uX, uY, uXY, uX2) {
    var delta = uX2 - uX * uX,
      slope = Math.abs(delta) < 1e-24 ? 0 : (uXY - uX * uY) / delta,
      intercept = uY - slope * uX;
    return [intercept, slope];
  }
  function points(data, x, y, sort) {
    data = data.filter(function (d) {
      var u = x(d),
        v = y(d);
      return u != null && (u = +u) >= u && v != null && (v = +v) >= v;
    });
    if (sort) {
      data.sort(function (a, b) {
        return x(a) - x(b);
      });
    }
    var n = data.length,
      X = new Float64Array(n),
      Y = new Float64Array(n);

    // extract values, calculate means
    var i = 0,
      ux = 0,
      uy = 0,
      xv,
      yv,
      d;
    var _iterator4 = _createForOfIteratorHelper(data),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        d = _step4.value;
        X[i] = xv = +x(d);
        Y[i] = yv = +y(d);
        ++i;
        ux += (xv - ux) / i;
        uy += (yv - uy) / i;
      }

      // mean center the data
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    for (i = 0; i < n; ++i) {
      X[i] -= ux;
      Y[i] -= uy;
    }
    return [X, Y, ux, uy];
  }
  function visitPoints(data, x, y, callback) {
    var i = -1,
      u,
      v;
    var _iterator5 = _createForOfIteratorHelper(data),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var d = _step5.value;
        u = x(d);
        v = y(d);
        if (u != null && (u = +u) >= u && v != null && (v = +v) >= v) {
          callback(u, v, ++i);
        }
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
  }

  // Adapted from d3-regression by Harry Stevens
  // License: https://github.com/HarryStevens/d3-regression/blob/master/LICENSE
  function rSquared(data, x, y, uY, predict) {
    var SSE = 0,
      SST = 0;
    visitPoints(data, x, y, function (dx, dy) {
      var sse = dy - predict(dx),
        sst = dy - uY;
      SSE += sse * sse;
      SST += sst * sst;
    });
    return 1 - SSE / SST;
  }

  // Adapted from d3-regression by Harry Stevens
  // License: https://github.com/HarryStevens/d3-regression/blob/master/LICENSE
  function linear(data, x, y) {
    var X = 0,
      Y = 0,
      XY = 0,
      X2 = 0,
      n = 0;
    visitPoints(data, x, y, function (dx, dy) {
      ++n;
      X += (dx - X) / n;
      Y += (dy - Y) / n;
      XY += (dx * dy - XY) / n;
      X2 += (dx * dx - X2) / n;
    });
    var coef = ols(X, Y, XY, X2),
      predict = function predict(x) {
        return coef[0] + coef[1] * x;
      };
    return {
      coef: coef,
      predict: predict,
      rSquared: rSquared(data, x, y, Y, predict)
    };
  }

  // Adapted from d3-regression by Harry Stevens
  // License: https://github.com/HarryStevens/d3-regression/blob/master/LICENSE
  function log$1(data, x, y) {
    var X = 0,
      Y = 0,
      XY = 0,
      X2 = 0,
      n = 0;
    visitPoints(data, x, y, function (dx, dy) {
      ++n;
      dx = Math.log(dx);
      X += (dx - X) / n;
      Y += (dy - Y) / n;
      XY += (dx * dy - XY) / n;
      X2 += (dx * dx - X2) / n;
    });
    var coef = ols(X, Y, XY, X2),
      predict = function predict(x) {
        return coef[0] + coef[1] * Math.log(x);
      };
    return {
      coef: coef,
      predict: predict,
      rSquared: rSquared(data, x, y, Y, predict)
    };
  }
  function exp(data, x, y) {
    // eslint-disable-next-line no-unused-vars
    var _points = points(data, x, y),
      _points2 = _slicedToArray(_points, 4),
      xv = _points2[0];
      _points2[1];
      var ux = _points2[2],
      uy = _points2[3];
    var YL = 0,
      XY = 0,
      XYL = 0,
      X2Y = 0,
      n = 0,
      dx,
      ly,
      xy;
    visitPoints(data, x, y, function (_, dy) {
      dx = xv[n++];
      ly = Math.log(dy);
      xy = dx * dy;
      YL += (dy * ly - YL) / n;
      XY += (xy - XY) / n;
      XYL += (xy * ly - XYL) / n;
      X2Y += (dx * xy - X2Y) / n;
    });
    var _ols = ols(XY / uy, YL / uy, XYL / uy, X2Y / uy),
      _ols2 = _slicedToArray(_ols, 2),
      c0 = _ols2[0],
      c1 = _ols2[1],
      predict = function predict(x) {
        return Math.exp(c0 + c1 * (x - ux));
      };
    return {
      coef: [Math.exp(c0 - c1 * ux), c1],
      predict: predict,
      rSquared: rSquared(data, x, y, uy, predict)
    };
  }

  // Adapted from d3-regression by Harry Stevens
  // License: https://github.com/HarryStevens/d3-regression/blob/master/LICENSE
  function pow(data, x, y) {
    var X = 0,
      Y = 0,
      XY = 0,
      X2 = 0,
      YS = 0,
      n = 0;
    visitPoints(data, x, y, function (dx, dy) {
      var lx = Math.log(dx),
        ly = Math.log(dy);
      ++n;
      X += (lx - X) / n;
      Y += (ly - Y) / n;
      XY += (lx * ly - XY) / n;
      X2 += (lx * lx - X2) / n;
      YS += (dy - YS) / n;
    });
    var coef = ols(X, Y, XY, X2),
      predict = function predict(x) {
        return coef[0] * Math.pow(x, coef[1]);
      };
    coef[0] = Math.exp(coef[0]);
    return {
      coef: coef,
      predict: predict,
      rSquared: rSquared(data, x, y, YS, predict)
    };
  }
  function quad(data, x, y) {
    var _points3 = points(data, x, y),
      _points4 = _slicedToArray(_points3, 4),
      xv = _points4[0],
      yv = _points4[1],
      ux = _points4[2],
      uy = _points4[3],
      n = xv.length;
    var X2 = 0,
      X3 = 0,
      X4 = 0,
      XY = 0,
      X2Y = 0,
      i,
      dx,
      dy,
      x2;
    for (i = 0; i < n;) {
      dx = xv[i];
      dy = yv[i++];
      x2 = dx * dx;
      X2 += (x2 - X2) / i;
      X3 += (x2 * dx - X3) / i;
      X4 += (x2 * x2 - X4) / i;
      XY += (dx * dy - XY) / i;
      X2Y += (x2 * dy - X2Y) / i;
    }
    var X2X2 = X4 - X2 * X2,
      d = X2 * X2X2 - X3 * X3,
      a = (X2Y * X2 - XY * X3) / d,
      b = (XY * X2X2 - X2Y * X3) / d,
      c = -a * X2,
      predict = function predict(x) {
        x = x - ux;
        return a * x * x + b * x + c + uy;
      };

    // transform coefficients back from mean-centered space
    return {
      coef: [c - b * ux + a * ux * ux + uy, b - 2 * a * ux, a],
      predict: predict,
      rSquared: rSquared(data, x, y, uy, predict)
    };
  }

  // Adapted from d3-regression by Harry Stevens
  // License: https://github.com/HarryStevens/d3-regression/blob/master/LICENSE
  // ... which was adapted from regression-js by Tom Alexander
  // Source: https://github.com/Tom-Alexander/regression-js/blob/master/src/regression.js#L246
  // License: https://github.com/Tom-Alexander/regression-js/blob/master/LICENSE
  function poly(data, x, y, order) {
    // use more efficient methods for lower orders
    if (order === 0) return constant(data, x, y);
    if (order === 1) return linear(data, x, y);
    if (order === 2) return quad(data, x, y);
    var _points5 = points(data, x, y),
      _points6 = _slicedToArray(_points5, 4),
      xv = _points6[0],
      yv = _points6[1],
      ux = _points6[2],
      uy = _points6[3],
      n = xv.length,
      lhs = [],
      rhs = [],
      k = order + 1;
    var i, j, l, v, c;
    for (i = 0; i < k; ++i) {
      for (l = 0, v = 0; l < n; ++l) {
        v += Math.pow(xv[l], i) * yv[l];
      }
      lhs.push(v);
      c = new Float64Array(k);
      for (j = 0; j < k; ++j) {
        for (l = 0, v = 0; l < n; ++l) {
          v += Math.pow(xv[l], i + j);
        }
        c[j] = v;
      }
      rhs.push(c);
    }
    rhs.push(lhs);
    var coef = gaussianElimination(rhs),
      predict = function predict(x) {
        x -= ux;
        var y = uy + coef[0] + coef[1] * x + coef[2] * x * x;
        for (i = 3; i < k; ++i) y += coef[i] * Math.pow(x, i);
        return y;
      };
    return {
      coef: uncenter(k, coef, -ux, uy),
      predict: predict,
      rSquared: rSquared(data, x, y, uy, predict)
    };
  }
  function uncenter(k, a, x, y) {
    var z = Array(k);
    var i, j, v, c;

    // initialize to zero
    for (i = 0; i < k; ++i) z[i] = 0;

    // polynomial expansion
    for (i = k - 1; i >= 0; --i) {
      v = a[i];
      c = 1;
      z[i] += v;
      for (j = 1; j <= i; ++j) {
        c *= (i + 1 - j) / j; // binomial coefficent
        z[i - j] += v * Math.pow(x, j) * c;
      }
    }

    // bias term
    z[0] += y;
    return z;
  }

  // Given an array for a two-dimensional matrix and the polynomial order,
  // solve A * x = b using Gaussian elimination.
  function gaussianElimination(matrix) {
    var n = matrix.length - 1,
      coef = [];
    var i, j, k, r, t;
    for (i = 0; i < n; ++i) {
      r = i; // max row
      for (j = i + 1; j < n; ++j) {
        if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][r])) {
          r = j;
        }
      }
      for (k = i; k < n + 1; ++k) {
        t = matrix[k][i];
        matrix[k][i] = matrix[k][r];
        matrix[k][r] = t;
      }
      for (j = i + 1; j < n; ++j) {
        for (k = n; k >= i; k--) {
          matrix[k][j] -= matrix[k][i] * matrix[i][j] / matrix[i][i];
        }
      }
    }
    for (j = n - 1; j >= 0; --j) {
      t = 0;
      for (k = j + 1; k < n; ++k) {
        t += matrix[k][j] * coef[k];
      }
      coef[j] = (matrix[n][j] - t) / matrix[j][j];
    }
    return coef;
  }
  var maxiters = 2,
    epsilon$1 = 1e-12;

  // Adapted from science.js by Jason Davies
  // Source: https://github.com/jasondavies/science.js/blob/master/src/stats/loess.js
  // License: https://github.com/jasondavies/science.js/blob/master/LICENSE
  function loess(data, x, y, bandwidth) {
    var _points7 = points(data, x, y, true),
      _points8 = _slicedToArray(_points7, 4),
      xv = _points8[0],
      yv = _points8[1],
      ux = _points8[2],
      uy = _points8[3],
      n = xv.length,
      bw = Math.max(2, ~~(bandwidth * n)),
      yhat = new Float64Array(n),
      residuals = new Float64Array(n),
      robustWeights = new Float64Array(n).fill(1);
    for (var iter = -1; ++iter <= maxiters;) {
      var interval = [0, bw - 1];
      for (var i = 0; i < n; ++i) {
        var dx = xv[i],
          i0 = interval[0],
          i1 = interval[1],
          edge = dx - xv[i0] > xv[i1] - dx ? i0 : i1;
        var W = 0,
          X = 0,
          Y = 0,
          XY = 0,
          X2 = 0;
        var denom = 1 / Math.abs(xv[edge] - dx || 1); // avoid singularity!

        for (var k = i0; k <= i1; ++k) {
          var xk = xv[k],
            yk = yv[k],
            w = tricube(Math.abs(dx - xk) * denom) * robustWeights[k],
            xkw = xk * w;
          W += w;
          X += xkw;
          Y += yk * w;
          XY += yk * xkw;
          X2 += xk * xkw;
        }

        // linear regression fit
        var _ols3 = ols(X / W, Y / W, XY / W, X2 / W),
          _ols4 = _slicedToArray(_ols3, 2),
          a = _ols4[0],
          b = _ols4[1];
        yhat[i] = a + b * dx;
        residuals[i] = Math.abs(yv[i] - yhat[i]);
        updateInterval(xv, i + 1, interval);
      }
      if (iter === maxiters) {
        break;
      }
      var medianResidual = d3Array.median(residuals);
      if (Math.abs(medianResidual) < epsilon$1) break;
      for (var _i = 0, arg, _w; _i < n; ++_i) {
        arg = residuals[_i] / (6 * medianResidual);
        // default to epsilon (rather than zero) for large deviations
        // keeping weights tiny but non-zero prevents singularites
        robustWeights[_i] = arg >= 1 ? epsilon$1 : (_w = 1 - arg * arg) * _w;
      }
    }
    return output$1(xv, yhat, ux, uy);
  }

  // weighting kernel for local regression
  function tricube(x) {
    return (x = 1 - x * x * x) * x * x;
  }

  // advance sliding window interval of nearest neighbors
  function updateInterval(xv, i, interval) {
    var val = xv[i];
    var left = interval[0],
      right = interval[1] + 1;
    if (right >= xv.length) return;

    // step right if distance to new right edge is <= distance to old left edge
    // step when distance is equal to ensure movement over duplicate x values
    while (i > left && xv[right] - val <= val - xv[left]) {
      interval[0] = ++left;
      interval[1] = right;
      ++right;
    }
  }

  // generate smoothed output points
  // average points with repeated x values
  function output$1(xv, yhat, ux, uy) {
    var n = xv.length,
      out = [];
    var i = 0,
      cnt = 0,
      prev = [],
      v;
    for (; i < n; ++i) {
      v = xv[i] + ux;
      if (prev[0] === v) {
        // average output values via online update
        prev[1] += (yhat[i] - prev[1]) / ++cnt;
      } else {
        // add new output point
        cnt = 0;
        prev[1] += uy;
        prev = [v, yhat[i]];
        out.push(prev);
      }
    }
    prev[1] += uy;
    return out;
  }

  // subdivide up to accuracy of 0.5 degrees
  var MIN_RADIANS = 0.5 * Math.PI / 180;

  // Adaptively sample an interpolated function over a domain extent
  function sampleCurve(f, extent, minSteps, maxSteps) {
    minSteps = minSteps || 25;
    maxSteps = Math.max(minSteps, maxSteps || 200);
    var point = function point(x) {
        return [x, f(x)];
      },
      minX = extent[0],
      maxX = extent[1],
      span = maxX - minX,
      stop = span / maxSteps,
      prev = [point(minX)],
      next = [];
    if (minSteps === maxSteps) {
      // no adaptation, sample uniform grid directly and return
      for (var i = 1; i < maxSteps; ++i) {
        prev.push(point(minX + i / minSteps * span));
      }
      prev.push(point(maxX));
      return prev;
    } else {
      // sample minimum points on uniform grid
      // then move on to perform adaptive refinement
      next.push(point(maxX));
      for (var _i2 = minSteps; --_i2 > 0;) {
        next.push(point(minX + _i2 / minSteps * span));
      }
    }
    var p0 = prev[0];
    var p1 = next[next.length - 1];
    var sx = 1 / span;
    var sy = scaleY(p0[1], next);
    while (p1) {
      // midpoint for potential curve subdivision
      var pm = point((p0[0] + p1[0]) / 2);
      var dx = pm[0] - p0[0] >= stop;
      if (dx && angleDelta(p0, pm, p1, sx, sy) > MIN_RADIANS) {
        // maximum resolution has not yet been met, and
        // subdivision midpoint is sufficiently different from endpoint
        // save subdivision, push midpoint onto the visitation stack
        next.push(pm);
      } else {
        // subdivision midpoint sufficiently similar to endpoint
        // skip subdivision, store endpoint, move to next point on the stack
        p0 = p1;
        prev.push(p1);
        next.pop();
      }
      p1 = next[next.length - 1];
    }
    return prev;
  }
  function scaleY(init, points) {
    var ymin = init;
    var ymax = init;
    var n = points.length;
    for (var i = 0; i < n; ++i) {
      var y = points[i][1];
      if (y < ymin) ymin = y;
      if (y > ymax) ymax = y;
    }
    return 1 / (ymax - ymin);
  }
  function angleDelta(p, q, r, sx, sy) {
    var a0 = Math.atan2(sy * (r[1] - p[1]), sx * (r[0] - p[0])),
      a1 = Math.atan2(sy * (q[1] - p[1]), sx * (q[0] - p[0]));
    return Math.abs(a0 - a1);
  }

  function multikey(f) {
    return function (x) {
      var n = f.length;
      var i = 1,
        k = String(f[0](x));
      for (; i < n; ++i) {
        k += '|' + f[i](x);
      }
      return k;
    };
  }
  function groupkey(fields) {
    return !fields || !fields.length ? function () {
      return '';
    } : fields.length === 1 ? fields[0] : multikey(fields);
  }
  function measureName(op, field, as) {
    return as || op + (!field ? '' : '_' + field);
  }
  var noop$1 = function noop() {};
  var base_op = {
    init: noop$1,
    add: noop$1,
    rem: noop$1,
    idx: 0
  };
  var AggregateOps = {
    values: {
      init: function init(m) {
        return m.cell.store = true;
      },
      value: function value(m) {
        return m.cell.data.values();
      },
      idx: -1
    },
    count: {
      value: function value(m) {
        return m.cell.num;
      }
    },
    __count__: {
      value: function value(m) {
        return m.missing + m.valid;
      }
    },
    missing: {
      value: function value(m) {
        return m.missing;
      }
    },
    valid: {
      value: function value(m) {
        return m.valid;
      }
    },
    sum: {
      init: function init(m) {
        return m.sum = 0;
      },
      value: function value(m) {
        return m.sum;
      },
      add: function add(m, v) {
        return m.sum += +v;
      },
      rem: function rem(m, v) {
        return m.sum -= v;
      }
    },
    product: {
      init: function init(m) {
        return m.product = 1;
      },
      value: function value(m) {
        return m.valid ? m.product : undefined;
      },
      add: function add(m, v) {
        return m.product *= v;
      },
      rem: function rem(m, v) {
        return m.product /= v;
      }
    },
    mean: {
      init: function init(m) {
        return m.mean = 0;
      },
      value: function value(m) {
        return m.valid ? m.mean : undefined;
      },
      add: function add(m, v) {
        return m.mean_d = v - m.mean, m.mean += m.mean_d / m.valid;
      },
      rem: function rem(m, v) {
        return m.mean_d = v - m.mean, m.mean -= m.valid ? m.mean_d / m.valid : m.mean;
      }
    },
    average: {
      value: function value(m) {
        return m.valid ? m.mean : undefined;
      },
      req: ['mean'],
      idx: 1
    },
    variance: {
      init: function init(m) {
        return m.dev = 0;
      },
      value: function value(m) {
        return m.valid > 1 ? m.dev / (m.valid - 1) : undefined;
      },
      add: function add(m, v) {
        return m.dev += m.mean_d * (v - m.mean);
      },
      rem: function rem(m, v) {
        return m.dev -= m.mean_d * (v - m.mean);
      },
      req: ['mean'],
      idx: 1
    },
    variancep: {
      value: function value(m) {
        return m.valid > 1 ? m.dev / m.valid : undefined;
      },
      req: ['variance'],
      idx: 2
    },
    stdev: {
      value: function value(m) {
        return m.valid > 1 ? Math.sqrt(m.dev / (m.valid - 1)) : undefined;
      },
      req: ['variance'],
      idx: 2
    },
    stdevp: {
      value: function value(m) {
        return m.valid > 1 ? Math.sqrt(m.dev / m.valid) : undefined;
      },
      req: ['variance'],
      idx: 2
    },
    stderr: {
      value: function value(m) {
        return m.valid > 1 ? Math.sqrt(m.dev / (m.valid * (m.valid - 1))) : undefined;
      },
      req: ['variance'],
      idx: 2
    },
    distinct: {
      value: function value(m) {
        return m.cell.data.distinct(m.get);
      },
      req: ['values'],
      idx: 3
    },
    ci0: {
      value: function value(m) {
        return m.cell.data.ci0(m.get);
      },
      req: ['values'],
      idx: 3
    },
    ci1: {
      value: function value(m) {
        return m.cell.data.ci1(m.get);
      },
      req: ['values'],
      idx: 3
    },
    median: {
      value: function value(m) {
        return m.cell.data.q2(m.get);
      },
      req: ['values'],
      idx: 3
    },
    q1: {
      value: function value(m) {
        return m.cell.data.q1(m.get);
      },
      req: ['values'],
      idx: 3
    },
    q3: {
      value: function value(m) {
        return m.cell.data.q3(m.get);
      },
      req: ['values'],
      idx: 3
    },
    min: {
      init: function init(m) {
        return m.min = undefined;
      },
      value: function value(m) {
        return m.min = Number.isNaN(m.min) ? m.cell.data.min(m.get) : m.min;
      },
      add: function add(m, v) {
        if (v < m.min || m.min === undefined) m.min = v;
      },
      rem: function rem(m, v) {
        if (v <= m.min) m.min = NaN;
      },
      req: ['values'],
      idx: 4
    },
    max: {
      init: function init(m) {
        return m.max = undefined;
      },
      value: function value(m) {
        return m.max = Number.isNaN(m.max) ? m.cell.data.max(m.get) : m.max;
      },
      add: function add(m, v) {
        if (v > m.max || m.max === undefined) m.max = v;
      },
      rem: function rem(m, v) {
        if (v >= m.max) m.max = NaN;
      },
      req: ['values'],
      idx: 4
    },
    argmin: {
      init: function init(m) {
        return m.argmin = undefined;
      },
      value: function value(m) {
        return m.argmin || m.cell.data.argmin(m.get);
      },
      add: function add(m, v, t) {
        if (v < m.min) m.argmin = t;
      },
      rem: function rem(m, v) {
        if (v <= m.min) m.argmin = undefined;
      },
      req: ['min', 'values'],
      idx: 3
    },
    argmax: {
      init: function init(m) {
        return m.argmax = undefined;
      },
      value: function value(m) {
        return m.argmax || m.cell.data.argmax(m.get);
      },
      add: function add(m, v, t) {
        if (v > m.max) m.argmax = t;
      },
      rem: function rem(m, v) {
        if (v >= m.max) m.argmax = undefined;
      },
      req: ['max', 'values'],
      idx: 3
    }
  };
  var ValidAggregateOps = Object.keys(AggregateOps).filter(function (d) {
    return d !== '__count__';
  });
  function measure(key, value) {
    return function (out) {
      return extend({
        name: key,
        out: out || key
      }, base_op, value);
    };
  }
  [].concat(_toConsumableArray(ValidAggregateOps), ['__count__']).forEach(function (key) {
    AggregateOps[key] = measure(key, AggregateOps[key]);
  });
  function createMeasure(op, name) {
    return AggregateOps[op](name);
  }
  function compareIndex(a, b) {
    return a.idx - b.idx;
  }
  function resolve(agg) {
    var map = {};
    agg.forEach(function (a) {
      return map[a.name] = a;
    });
    var getreqs = function getreqs(a) {
      if (!a.req) return;
      a.req.forEach(function (key) {
        if (!map[key]) getreqs(map[key] = AggregateOps[key]());
      });
    };
    agg.forEach(getreqs);
    return Object.values(map).sort(compareIndex);
  }
  function init() {
    var _this = this;
    this.valid = 0;
    this.missing = 0;
    this._ops.forEach(function (op) {
      return op.init(_this);
    });
  }
  function add$1(v, t) {
    var _this2 = this;
    if (v == null || v === '') {
      ++this.missing;
      return;
    }
    if (v !== v) return;
    ++this.valid;
    this._ops.forEach(function (op) {
      return op.add(_this2, v, t);
    });
  }
  function rem(v, t) {
    var _this3 = this;
    if (v == null || v === '') {
      --this.missing;
      return;
    }
    if (v !== v) return;
    --this.valid;
    this._ops.forEach(function (op) {
      return op.rem(_this3, v, t);
    });
  }
  function set$2(t) {
    var _this4 = this;
    this._out.forEach(function (op) {
      return t[op.out] = op.value(_this4);
    });
    return t;
  }
  function compileMeasures(agg, field) {
    var get = field || identity,
      ops = resolve(agg),
      out = agg.slice().sort(compareIndex);
    function ctr(cell) {
      this._ops = ops;
      this._out = out;
      this.cell = cell;
      this.init();
    }
    ctr.prototype.init = init;
    ctr.prototype.add = add$1;
    ctr.prototype.rem = rem;
    ctr.prototype.set = set$2;
    ctr.prototype.get = get;
    ctr.fields = agg.map(function (op) {
      return op.out;
    });
    return ctr;
  }
  function TupleStore(key) {
    this._key = key ? field$1(key) : tupleid;
    this.reset();
  }
  var prototype$1 = TupleStore.prototype;
  prototype$1.reset = function () {
    this._add = [];
    this._rem = [];
    this._ext = null;
    this._get = null;
    this._q = null;
  };
  prototype$1.add = function (v) {
    this._add.push(v);
  };
  prototype$1.rem = function (v) {
    this._rem.push(v);
  };
  prototype$1.values = function () {
    this._get = null;
    if (this._rem.length === 0) return this._add;
    var a = this._add,
      r = this._rem,
      k = this._key,
      n = a.length,
      m = r.length,
      x = Array(n - m),
      map = {};
    var i, j, v;

    // use unique key field to clear removed values
    for (i = 0; i < m; ++i) {
      map[k(r[i])] = 1;
    }
    for (i = 0, j = 0; i < n; ++i) {
      if (map[k(v = a[i])]) {
        map[k(v)] = 0;
      } else {
        x[j++] = v;
      }
    }
    this._rem = [];
    return this._add = x;
  };

  // memoizing statistics methods

  prototype$1.distinct = function (get) {
    var v = this.values(),
      map = {};
    var n = v.length,
      count = 0,
      s;
    while (--n >= 0) {
      s = get(v[n]) + '';
      if (!_has(map, s)) {
        map[s] = 1;
        ++count;
      }
    }
    return count;
  };
  prototype$1.extent = function (get) {
    if (this._get !== get || !this._ext) {
      var v = this.values(),
        i = extentIndex(v, get);
      this._ext = [v[i[0]], v[i[1]]];
      this._get = get;
    }
    return this._ext;
  };
  prototype$1.argmin = function (get) {
    return this.extent(get)[0] || {};
  };
  prototype$1.argmax = function (get) {
    return this.extent(get)[1] || {};
  };
  prototype$1.min = function (get) {
    var m = this.extent(get)[0];
    return m != null ? get(m) : undefined;
  };
  prototype$1.max = function (get) {
    var m = this.extent(get)[1];
    return m != null ? get(m) : undefined;
  };
  prototype$1.quartile = function (get) {
    if (this._get !== get || !this._q) {
      this._q = quartiles(this.values(), get);
      this._get = get;
    }
    return this._q;
  };
  prototype$1.q1 = function (get) {
    return this.quartile(get)[0];
  };
  prototype$1.q2 = function (get) {
    return this.quartile(get)[1];
  };
  prototype$1.q3 = function (get) {
    return this.quartile(get)[2];
  };
  prototype$1.ci = function (get) {
    if (this._get !== get || !this._ci) {
      this._ci = bootstrapCI(this.values(), 1000, 0.05, get);
      this._get = get;
    }
    return this._ci;
  };
  prototype$1.ci0 = function (get) {
    return this.ci(get)[0];
  };
  prototype$1.ci1 = function (get) {
    return this.ci(get)[1];
  };

  /**
   * Group-by aggregation operator.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<function(object): *>} [params.groupby] - An array of accessors to groupby.
   * @param {Array<function(object): *>} [params.fields] - An array of accessors to aggregate.
   * @param {Array<string>} [params.ops] - An array of strings indicating aggregation operations.
   * @param {Array<string>} [params.as] - An array of output field names for aggregated values.
   * @param {boolean} [params.cross=false] - A flag indicating that the full
   *   cross-product of groupby values should be generated, including empty cells.
   *   If true, the drop parameter is ignored and empty cells are retained.
   * @param {boolean} [params.drop=true] - A flag indicating if empty cells should be removed.
   */
  function Aggregate$1(params) {
    Transform.call(this, null, params);
    this._adds = []; // array of added output tuples
    this._mods = []; // array of modified output tuples
    this._alen = 0; // number of active added tuples
    this._mlen = 0; // number of active modified tuples
    this._drop = true; // should empty aggregation cells be removed
    this._cross = false; // produce full cross-product of group-by values

    this._dims = []; // group-by dimension accessors
    this._dnames = []; // group-by dimension names

    this._measures = []; // collection of aggregation monoids
    this._countOnly = false; // flag indicating only count aggregation
    this._counts = null; // collection of count fields
    this._prev = null; // previous aggregation cells

    this._inputs = null; // array of dependent input tuple field names
    this._outputs = null; // array of output tuple field names
  }

  Aggregate$1.Definition = {
    'type': 'Aggregate',
    'metadata': {
      'generates': true,
      'changes': true
    },
    'params': [{
      'name': 'groupby',
      'type': 'field',
      'array': true
    }, {
      'name': 'ops',
      'type': 'enum',
      'array': true,
      'values': ValidAggregateOps
    }, {
      'name': 'fields',
      'type': 'field',
      'null': true,
      'array': true
    }, {
      'name': 'as',
      'type': 'string',
      'null': true,
      'array': true
    }, {
      'name': 'drop',
      'type': 'boolean',
      'default': true
    }, {
      'name': 'cross',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'key',
      'type': 'field'
    }]
  };
  inherits(Aggregate$1, Transform, {
    transform: function transform(_, pulse) {
      var _this5 = this;
      var aggr = this,
        out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
        mod = _.modified();
      aggr.stamp = out.stamp;
      if (aggr.value && (mod || pulse.modified(aggr._inputs, true))) {
        aggr._prev = aggr.value;
        aggr.value = mod ? aggr.init(_) : Object.create(null);
        pulse.visit(pulse.SOURCE, function (t) {
          return aggr.add(t);
        });
      } else {
        aggr.value = aggr.value || aggr.init(_);
        pulse.visit(pulse.REM, function (t) {
          return aggr.rem(t);
        });
        pulse.visit(pulse.ADD, function (t) {
          return aggr.add(t);
        });
      }

      // Indicate output fields and return aggregate tuples.
      out.modifies(aggr._outputs);

      // Should empty cells be dropped?
      aggr._drop = _.drop !== false;

      // If domain cross-product requested, generate empty cells as needed
      // and ensure that empty cells are not dropped
      if (_.cross && aggr._dims.length > 1) {
        aggr._drop = false;
        aggr.cross();
      }
      if (pulse.clean() && aggr._drop) {
        out.clean(true).runAfter(function () {
          return _this5.clean();
        });
      }
      return aggr.changes(out);
    },
    cross: function cross() {
      var aggr = this,
        curr = aggr.value,
        dims = aggr._dnames,
        vals = dims.map(function () {
          return {};
        }),
        n = dims.length;

      // collect all group-by domain values
      function collect(cells) {
        var key, i, t, v;
        for (key in cells) {
          t = cells[key].tuple;
          for (i = 0; i < n; ++i) {
            vals[i][v = t[dims[i]]] = v;
          }
        }
      }
      collect(aggr._prev);
      collect(curr);

      // iterate over key cross-product, create cells as needed
      function generate(base, tuple, index) {
        var name = dims[index],
          v = vals[index++];
        for (var k in v) {
          var _key = base ? base + '|' + k : k;
          tuple[name] = v[k];
          if (index < n) generate(_key, tuple, index);else if (!curr[_key]) aggr.cell(_key, tuple);
        }
      }
      generate('', {}, 0);
    },
    init: function init(_) {
      // initialize input and output fields
      var inputs = this._inputs = [],
        outputs = this._outputs = [],
        inputMap = {};
      function inputVisit(get) {
        var fields = array$2(accessorFields(get)),
          n = fields.length;
        var i = 0,
          f;
        for (; i < n; ++i) {
          if (!inputMap[f = fields[i]]) {
            inputMap[f] = 1;
            inputs.push(f);
          }
        }
      }

      // initialize group-by dimensions
      this._dims = array$2(_.groupby);
      this._dnames = this._dims.map(function (d) {
        var dname = accessorName(d);
        inputVisit(d);
        outputs.push(dname);
        return dname;
      });
      this.cellkey = _.key ? _.key : groupkey(this._dims);

      // initialize aggregate measures
      this._countOnly = true;
      this._counts = [];
      this._measures = [];
      var fields = _.fields || [null],
        ops = _.ops || ['count'],
        as = _.as || [],
        n = fields.length,
        map = {};
      var field, op, m, mname, outname, i;
      if (n !== ops.length) {
        error('Unmatched number of fields and aggregate ops.');
      }
      for (i = 0; i < n; ++i) {
        field = fields[i];
        op = ops[i];
        if (field == null && op !== 'count') {
          error('Null aggregate field specified.');
        }
        mname = accessorName(field);
        outname = measureName(op, mname, as[i]);
        outputs.push(outname);
        if (op === 'count') {
          this._counts.push(outname);
          continue;
        }
        m = map[mname];
        if (!m) {
          inputVisit(field);
          m = map[mname] = [];
          m.field = field;
          this._measures.push(m);
        }
        if (op !== 'count') this._countOnly = false;
        m.push(createMeasure(op, outname));
      }
      this._measures = this._measures.map(function (m) {
        return compileMeasures(m, m.field);
      });
      return Object.create(null); // aggregation cells (this.value)
    },

    // -- Cell Management -----

    cellkey: groupkey(),
    cell: function cell(key, t) {
      var cell = this.value[key];
      if (!cell) {
        cell = this.value[key] = this.newcell(key, t);
        this._adds[this._alen++] = cell;
      } else if (cell.num === 0 && this._drop && cell.stamp < this.stamp) {
        cell.stamp = this.stamp;
        this._adds[this._alen++] = cell;
      } else if (cell.stamp < this.stamp) {
        cell.stamp = this.stamp;
        this._mods[this._mlen++] = cell;
      }
      return cell;
    },
    newcell: function newcell(key, t) {
      var cell = {
        key: key,
        num: 0,
        agg: null,
        tuple: this.newtuple(t, this._prev && this._prev[key]),
        stamp: this.stamp,
        store: false
      };
      if (!this._countOnly) {
        var measures = this._measures,
          n = measures.length;
        cell.agg = Array(n);
        for (var i = 0; i < n; ++i) {
          cell.agg[i] = new measures[i](cell);
        }
      }
      if (cell.store) {
        cell.data = new TupleStore();
      }
      return cell;
    },
    newtuple: function newtuple(t, p) {
      var names = this._dnames,
        dims = this._dims,
        n = dims.length,
        x = {};
      for (var i = 0; i < n; ++i) {
        x[names[i]] = dims[i](t);
      }
      return p ? replace$1(p.tuple, x) : ingest$1(x);
    },
    clean: function clean() {
      var cells = this.value;
      for (var _key2 in cells) {
        if (cells[_key2].num === 0) {
          delete cells[_key2];
        }
      }
    },
    // -- Process Tuples -----
    add: function add(t) {
      var key = this.cellkey(t),
        cell = this.cell(key, t);
      cell.num += 1;
      if (this._countOnly) return;
      if (cell.store) cell.data.add(t);
      var agg = cell.agg;
      for (var i = 0, n = agg.length; i < n; ++i) {
        agg[i].add(agg[i].get(t), t);
      }
    },
    rem: function rem(t) {
      var key = this.cellkey(t),
        cell = this.cell(key, t);
      cell.num -= 1;
      if (this._countOnly) return;
      if (cell.store) cell.data.rem(t);
      var agg = cell.agg;
      for (var i = 0, n = agg.length; i < n; ++i) {
        agg[i].rem(agg[i].get(t), t);
      }
    },
    celltuple: function celltuple(cell) {
      var tuple = cell.tuple,
        counts = this._counts;

      // consolidate stored values
      if (cell.store) {
        cell.data.values();
      }

      // update tuple properties
      for (var i = 0, n = counts.length; i < n; ++i) {
        tuple[counts[i]] = cell.num;
      }
      if (!this._countOnly) {
        var agg = cell.agg;
        for (var _i = 0, _n = agg.length; _i < _n; ++_i) {
          agg[_i].set(tuple);
        }
      }
      return tuple;
    },
    changes: function changes(out) {
      var adds = this._adds,
        mods = this._mods,
        prev = this._prev,
        drop = this._drop,
        add = out.add,
        rem = out.rem,
        mod = out.mod;
      var cell, key, i, n;
      if (prev) for (key in prev) {
        cell = prev[key];
        if (!drop || cell.num) rem.push(cell.tuple);
      }
      for (i = 0, n = this._alen; i < n; ++i) {
        add.push(this.celltuple(adds[i]));
        adds[i] = null; // for garbage collection
      }

      for (i = 0, n = this._mlen; i < n; ++i) {
        cell = mods[i];
        (cell.num === 0 && drop ? rem : mod).push(this.celltuple(cell));
        mods[i] = null; // for garbage collection
      }

      this._alen = this._mlen = 0; // reset list of active cells
      this._prev = null;
      return out;
    }
  });

  // epsilon bias to offset floating point error (#1737)
  var EPSILON$1 = 1e-14;

  /**
   * Generates a binning function for discretizing data.
   * @constructor
   * @param {object} params - The parameters for this operator. The
   *   provided values should be valid options for the {@link bin} function.
   * @param {function(object): *} params.field - The data field to bin.
   */
  function Bin(params) {
    Transform.call(this, null, params);
  }
  Bin.Definition = {
    'type': 'Bin',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'field',
      'type': 'field',
      'required': true
    }, {
      'name': 'interval',
      'type': 'boolean',
      'default': true
    }, {
      'name': 'anchor',
      'type': 'number'
    }, {
      'name': 'maxbins',
      'type': 'number',
      'default': 20
    }, {
      'name': 'base',
      'type': 'number',
      'default': 10
    }, {
      'name': 'divide',
      'type': 'number',
      'array': true,
      'default': [5, 2]
    }, {
      'name': 'extent',
      'type': 'number',
      'array': true,
      'length': 2,
      'required': true
    }, {
      'name': 'span',
      'type': 'number'
    }, {
      'name': 'step',
      'type': 'number'
    }, {
      'name': 'steps',
      'type': 'number',
      'array': true
    }, {
      'name': 'minstep',
      'type': 'number',
      'default': 0
    }, {
      'name': 'nice',
      'type': 'boolean',
      'default': true
    }, {
      'name': 'name',
      'type': 'string'
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': 2,
      'default': ['bin0', 'bin1']
    }]
  };
  inherits(Bin, Transform, {
    transform: function transform(_, pulse) {
      var band = _.interval !== false,
        bins = this._bins(_),
        start = bins.start,
        step = bins.step,
        as = _.as || ['bin0', 'bin1'],
        b0 = as[0],
        b1 = as[1];
      var flag;
      if (_.modified()) {
        pulse = pulse.reflow(true);
        flag = pulse.SOURCE;
      } else {
        flag = pulse.modified(accessorFields(_.field)) ? pulse.ADD_MOD : pulse.ADD;
      }
      pulse.visit(flag, band ? function (t) {
        var v = bins(t);
        // minimum bin value (inclusive)
        t[b0] = v;
        // maximum bin value (exclusive)
        // use convoluted math for better floating point agreement
        // see https://github.com/vega/vega/issues/830
        // infinite values propagate through this formula! #2227
        t[b1] = v == null ? null : start + step * (1 + (v - start) / step);
      } : function (t) {
        return t[b0] = bins(t);
      });
      return pulse.modifies(band ? as : b0);
    },
    _bins: function _bins(_) {
      if (this.value && !_.modified()) {
        return this.value;
      }
      var field = _.field,
        bins = bin(_),
        step = bins.step;
      var start = bins.start,
        stop = start + Math.ceil((bins.stop - start) / step) * step,
        a,
        d;
      if ((a = _.anchor) != null) {
        d = a - (start + step * Math.floor((a - start) / step));
        start += d;
        stop += d;
      }
      var f = function f(t) {
        var v = toNumber(field(t));
        return v == null ? null : v < start ? -Infinity : v > stop ? +Infinity : (v = Math.max(start, Math.min(v, stop - step)), start + step * Math.floor(EPSILON$1 + (v - start) / step));
      };
      f.start = start;
      f.stop = bins.stop;
      f.step = step;
      return this.value = accessor(f, accessorFields(field), _.name || 'bin_' + accessorName(field));
    }
  });
  function SortedList(idFunc, source, input) {
    var $ = idFunc;
    var _data = source || [],
      _add = input || [],
      rem = {},
      cnt = 0;
    return {
      add: function add(t) {
        return _add.push(t);
      },
      remove: function remove(t) {
        return rem[$(t)] = ++cnt;
      },
      size: function size() {
        return _data.length;
      },
      data: function data(compare, resort) {
        if (cnt) {
          _data = _data.filter(function (t) {
            return !rem[$(t)];
          });
          rem = {};
          cnt = 0;
        }
        if (resort && compare) {
          _data.sort(compare);
        }
        if (_add.length) {
          _data = compare ? merge$2(compare, _data, _add.sort(compare)) : _data.concat(_add);
          _add = [];
        }
        return _data;
      }
    };
  }

  /**
   * Collects all data tuples that pass through this operator.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(*,*): number} [params.sort] - An optional
   *   comparator function for additionally sorting the collected tuples.
   */
  function Collect$1(params) {
    Transform.call(this, [], params);
  }
  Collect$1.Definition = {
    'type': 'Collect',
    'metadata': {
      'source': true
    },
    'params': [{
      'name': 'sort',
      'type': 'compare'
    }]
  };
  inherits(Collect$1, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.ALL),
        list = SortedList(tupleid, this.value, out.materialize(out.ADD).add),
        sort = _.sort,
        mod = pulse.changed() || sort && (_.modified('sort') || pulse.modified(sort.fields));
      out.visit(out.REM, list.remove);
      this.modified(mod);
      this.value = out.source = list.data(stableCompare(sort), mod);

      // propagate tree root if defined
      if (pulse.source && pulse.source.root) {
        this.value.root = pulse.source.root;
      }
      return out;
    }
  });

  /**
   * Generates a comparator function.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<string|function>} params.fields - The fields to compare.
   * @param {Array<string>} [params.orders] - The sort orders.
   *   Each entry should be one of "ascending" (default) or "descending".
   */
  function Compare$1(params) {
    Operator.call(this, null, update$5, params);
  }
  inherits(Compare$1, Operator);
  function update$5(_) {
    return this.value && !_.modified() ? this.value : compare$1(_.fields, _.orders);
  }

  /**
   * Count regexp-defined pattern occurrences in a text field.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - An accessor for the text field.
   * @param {string} [params.pattern] - RegExp string defining the text pattern.
   * @param {string} [params.case] - One of 'lower', 'upper' or null (mixed) case.
   * @param {string} [params.stopwords] - RegExp string of words to ignore.
   */
  function CountPattern(params) {
    Transform.call(this, null, params);
  }
  CountPattern.Definition = {
    'type': 'CountPattern',
    'metadata': {
      'generates': true,
      'changes': true
    },
    'params': [{
      'name': 'field',
      'type': 'field',
      'required': true
    }, {
      'name': 'case',
      'type': 'enum',
      'values': ['upper', 'lower', 'mixed'],
      'default': 'mixed'
    }, {
      'name': 'pattern',
      'type': 'string',
      'default': '[\\w"]+'
    }, {
      'name': 'stopwords',
      'type': 'string',
      'default': ''
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': 2,
      'default': ['text', 'count']
    }]
  };
  function tokenize(text, tcase, match) {
    switch (tcase) {
      case 'upper':
        text = text.toUpperCase();
        break;
      case 'lower':
        text = text.toLowerCase();
        break;
    }
    return text.match(match);
  }
  inherits(CountPattern, Transform, {
    transform: function transform(_, pulse) {
      var process = function process(update) {
        return function (tuple) {
          var tokens = tokenize(get(tuple), _.case, match) || [],
            t;
          for (var i = 0, n = tokens.length; i < n; ++i) {
            if (!stop.test(t = tokens[i])) update(t);
          }
        };
      };
      var init = this._parameterCheck(_, pulse),
        counts = this._counts,
        match = this._match,
        stop = this._stop,
        get = _.field,
        as = _.as || ['text', 'count'],
        add = process(function (t) {
          return counts[t] = 1 + (counts[t] || 0);
        }),
        rem = process(function (t) {
          return counts[t] -= 1;
        });
      if (init) {
        pulse.visit(pulse.SOURCE, add);
      } else {
        pulse.visit(pulse.ADD, add);
        pulse.visit(pulse.REM, rem);
      }
      return this._finish(pulse, as); // generate output tuples
    },
    _parameterCheck: function _parameterCheck(_, pulse) {
      var init = false;
      if (_.modified('stopwords') || !this._stop) {
        this._stop = new RegExp('^' + (_.stopwords || '') + '$', 'i');
        init = true;
      }
      if (_.modified('pattern') || !this._match) {
        this._match = new RegExp(_.pattern || '[\\w\']+', 'g');
        init = true;
      }
      if (_.modified('field') || pulse.modified(_.field.fields)) {
        init = true;
      }
      if (init) this._counts = {};
      return init;
    },
    _finish: function _finish(pulse, as) {
      var counts = this._counts,
        tuples = this._tuples || (this._tuples = {}),
        text = as[0],
        count = as[1],
        out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS);
      var w, t, c;
      for (w in counts) {
        t = tuples[w];
        c = counts[w] || 0;
        if (!t && c) {
          tuples[w] = t = ingest$1({});
          t[text] = w;
          t[count] = c;
          out.add.push(t);
        } else if (c === 0) {
          if (t) out.rem.push(t);
          counts[w] = null;
          tuples[w] = null;
        } else if (t[count] !== c) {
          t[count] = c;
          out.mod.push(t);
        }
      }
      return out.modifies(as);
    }
  });

  /**
   * Perform a cross-product of a tuple stream with itself.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object):boolean} [params.filter] - An optional filter
   *   function for selectively including tuples in the cross product.
   * @param {Array<string>} [params.as] - The names of the output fields.
   */
  function Cross(params) {
    Transform.call(this, null, params);
  }
  Cross.Definition = {
    'type': 'Cross',
    'metadata': {
      'generates': true
    },
    'params': [{
      'name': 'filter',
      'type': 'expr'
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': 2,
      'default': ['a', 'b']
    }]
  };
  inherits(Cross, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.NO_SOURCE),
        as = _.as || ['a', 'b'],
        a = as[0],
        b = as[1],
        reset = !this.value || pulse.changed(pulse.ADD_REM) || _.modified('as') || _.modified('filter');
      var data = this.value;
      if (reset) {
        if (data) out.rem = data;
        data = pulse.materialize(pulse.SOURCE).source;
        out.add = this.value = cross(data, a, b, _.filter || truthy);
      } else {
        out.mod = data;
      }
      out.source = this.value;
      return out.modifies(as);
    }
  });
  function cross(input, a, b, filter) {
    var data = [],
      t = {},
      n = input.length,
      i = 0,
      j,
      left;
    for (; i < n; ++i) {
      t[a] = left = input[i];
      for (j = 0; j < n; ++j) {
        t[b] = input[j];
        if (filter(t)) {
          data.push(ingest$1(t));
          t = {};
          t[a] = left;
        }
      }
    }
    return data;
  }
  var Distributions = {
    kde: kde,
    mixture: mixture$1,
    normal: gaussian,
    lognormal: lognormal,
    uniform: uniform
  };
  var DISTRIBUTIONS = 'distributions',
    FUNCTION = 'function',
    FIELD = 'field';

  /**
   * Parse a parameter object for a probability distribution.
   * @param {object} def - The distribution parameter object.
   * @param {function():Array<object>} - A method for requesting
   *   source data. Used for distributions (such as KDE) that
   *   require sample data points. This method will only be
   *   invoked if the 'from' parameter for a target data source
   *   is not provided. Typically this method returns backing
   *   source data for a Pulse object.
   * @return {object} - The output distribution object.
   */
  function parse$4(def, data) {
    var func = def[FUNCTION];
    if (!_has(Distributions, func)) {
      error('Unknown distribution function: ' + func);
    }
    var d = Distributions[func]();
    for (var name in def) {
      // if data field, extract values
      if (name === FIELD) {
        d.data((def.from || data()).map(def[name]));
      }

      // if distribution mixture, recurse to parse each definition
      else if (name === DISTRIBUTIONS) {
        d[name](def[name].map(function (_) {
          return parse$4(_, data);
        }));
      }

      // otherwise, simply set the parameter
      else if (_typeof(d[name]) === FUNCTION) {
        d[name](def[name]);
      }
    }
    return d;
  }

  /**
   * Grid sample points for a probability density. Given a distribution and
   * a sampling extent, will generate points suitable for plotting either
   * PDF (probability density function) or CDF (cumulative distribution
   * function) curves.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {object} params.distribution - The probability distribution. This
   *   is an object parameter dependent on the distribution type.
   * @param {string} [params.method='pdf'] - The distribution method to sample.
   *   One of 'pdf' or 'cdf'.
   * @param {Array<number>} [params.extent] - The [min, max] extent over which
   *   to sample the distribution. This argument is required in most cases, but
   *   can be omitted if the distribution (e.g., 'kde') supports a 'data' method
   *   that returns numerical sample points from which the extent can be deduced.
   * @param {number} [params.minsteps=25] - The minimum number of curve samples
   *   for plotting the density.
   * @param {number} [params.maxsteps=200] - The maximum number of curve samples
   *   for plotting the density.
   * @param {number} [params.steps] - The exact number of curve samples for
   *   plotting the density. If specified, overrides both minsteps and maxsteps
   *   to set an exact number of uniform samples. Useful in conjunction with
   *   a fixed extent to ensure consistent sample points for stacked densities.
   */
  function Density(params) {
    Transform.call(this, null, params);
  }
  var distributions = [{
    'key': {
      'function': 'normal'
    },
    'params': [{
      'name': 'mean',
      'type': 'number',
      'default': 0
    }, {
      'name': 'stdev',
      'type': 'number',
      'default': 1
    }]
  }, {
    'key': {
      'function': 'lognormal'
    },
    'params': [{
      'name': 'mean',
      'type': 'number',
      'default': 0
    }, {
      'name': 'stdev',
      'type': 'number',
      'default': 1
    }]
  }, {
    'key': {
      'function': 'uniform'
    },
    'params': [{
      'name': 'min',
      'type': 'number',
      'default': 0
    }, {
      'name': 'max',
      'type': 'number',
      'default': 1
    }]
  }, {
    'key': {
      'function': 'kde'
    },
    'params': [{
      'name': 'field',
      'type': 'field',
      'required': true
    }, {
      'name': 'from',
      'type': 'data'
    }, {
      'name': 'bandwidth',
      'type': 'number',
      'default': 0
    }]
  }];
  var mixture = {
    'key': {
      'function': 'mixture'
    },
    'params': [{
      'name': 'distributions',
      'type': 'param',
      'array': true,
      'params': distributions
    }, {
      'name': 'weights',
      'type': 'number',
      'array': true
    }]
  };
  Density.Definition = {
    'type': 'Density',
    'metadata': {
      'generates': true
    },
    'params': [{
      'name': 'extent',
      'type': 'number',
      'array': true,
      'length': 2
    }, {
      'name': 'steps',
      'type': 'number'
    }, {
      'name': 'minsteps',
      'type': 'number',
      'default': 25
    }, {
      'name': 'maxsteps',
      'type': 'number',
      'default': 200
    }, {
      'name': 'method',
      'type': 'string',
      'default': 'pdf',
      'values': ['pdf', 'cdf']
    }, {
      'name': 'distribution',
      'type': 'param',
      'params': distributions.concat(mixture)
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'default': ['value', 'density']
    }]
  };
  inherits(Density, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS);
      if (!this.value || pulse.changed() || _.modified()) {
        var dist = parse$4(_.distribution, source$1(pulse)),
          minsteps = _.steps || _.minsteps || 25,
          maxsteps = _.steps || _.maxsteps || 200;
        var method = _.method || 'pdf';
        if (method !== 'pdf' && method !== 'cdf') {
          error('Invalid density method: ' + method);
        }
        if (!_.extent && !dist.data) {
          error('Missing density extent parameter.');
        }
        method = dist[method];
        var as = _.as || ['value', 'density'],
          domain = _.extent || extent(dist.data()),
          values = sampleCurve(method, domain, minsteps, maxsteps).map(function (v) {
            var tuple = {};
            tuple[as[0]] = v[0];
            tuple[as[1]] = v[1];
            return ingest$1(tuple);
          });
        if (this.value) out.rem = this.value;
        this.value = out.add = out.source = values;
      }
      return out;
    }
  });
  function source$1(pulse) {
    return function () {
      return pulse.materialize(pulse.SOURCE).source;
    };
  }

  // use either provided alias or accessor field name
  function fieldNames(fields, as) {
    if (!fields) return null;
    return fields.map(function (f, i) {
      return as[i] || accessorName(f);
    });
  }
  function partition$1$1(data, groupby, field) {
    var groups = [],
      get = function get(f) {
        return f(t);
      };
    var map, i, n, t, k, g;

    // partition data points into groups
    if (groupby == null) {
      groups.push(data.map(field));
    } else {
      for (map = {}, i = 0, n = data.length; i < n; ++i) {
        t = data[i];
        k = groupby.map(get);
        g = map[k];
        if (!g) {
          map[k] = g = [];
          g.dims = k;
          groups.push(g);
        }
        g.push(field(t));
      }
    }
    return groups;
  }
  var Output$5 = 'bin';

  /**
   * Dot density binning for dot plot construction.
   * Based on Leland Wilkinson, Dot Plots, The American Statistician, 1999.
   * https://www.cs.uic.edu/~wilkinson/Publications/dotplots.pdf
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - The value field to bin.
   * @param {Array<function(object): *>} [params.groupby] - An array of accessors to groupby.
   * @param {number} [params.step] - The step size (bin width) within which dots should be
   *   stacked. Defaults to 1/30 of the extent of the data *field*.
   * @param {boolean} [params.smooth=false] - A boolean flag indicating if dot density
   *   stacks should be smoothed to reduce variance.
   */
  function DotBin(params) {
    Transform.call(this, null, params);
  }
  DotBin.Definition = {
    'type': 'DotBin',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'field',
      'type': 'field',
      'required': true
    }, {
      'name': 'groupby',
      'type': 'field',
      'array': true
    }, {
      'name': 'step',
      'type': 'number'
    }, {
      'name': 'smooth',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'as',
      'type': 'string',
      'default': Output$5
    }]
  };
  var autostep = function autostep(data, field) {
    return span(extent(data, field)) / 30;
  };
  inherits(DotBin, Transform, {
    transform: function transform(_, pulse) {
      if (this.value && !(_.modified() || pulse.changed())) {
        return pulse; // early exit
      }

      var source = pulse.materialize(pulse.SOURCE).source,
        groups = partition$1$1(pulse.source, _.groupby, identity),
        smooth = _.smooth || false,
        field = _.field,
        step = _.step || autostep(source, field),
        sort = stableCompare(function (a, b) {
          return field(a) - field(b);
        }),
        as = _.as || Output$5,
        n = groups.length;

      // compute dotplot bins per group
      var min = Infinity,
        max = -Infinity,
        i = 0,
        j;
      for (; i < n; ++i) {
        var g = groups[i].sort(sort);
        j = -1;
        var _iterator = _createForOfIteratorHelper(dotbin(g, step, smooth, field)),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var v = _step.value;
            if (v < min) min = v;
            if (v > max) max = v;
            g[++j][as] = v;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      this.value = {
        start: min,
        stop: max,
        step: step
      };
      return pulse.reflow(true).modifies(as);
    }
  });

  /**
   * Wraps an expression function with access to external parameters.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function} params.expr - The expression function. The
   *  function should accept both a datum and a parameter object.
   *  This operator's value will be a new function that wraps the
   *  expression function with access to this operator's parameters.
   */
  function Expression$1(params) {
    Operator.call(this, null, update$4, params);
    this.modified(true);
  }
  inherits(Expression$1, Operator);
  function update$4(_) {
    var expr = _.expr;
    return this.value && !_.modified('expr') ? this.value : accessor(function (datum) {
      return expr(datum, _);
    }, accessorFields(expr), accessorName(expr));
  }

  /**
   * Computes extents (min/max) for a data field.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - The field over which to compute extends.
   */
  function Extent(params) {
    Transform.call(this, [undefined, undefined], params);
  }
  Extent.Definition = {
    'type': 'Extent',
    'metadata': {},
    'params': [{
      'name': 'field',
      'type': 'field',
      'required': true
    }]
  };
  inherits(Extent, Transform, {
    transform: function transform(_, pulse) {
      var extent = this.value,
        field = _.field,
        mod = pulse.changed() || pulse.modified(field.fields) || _.modified('field');
      var min = extent[0],
        max = extent[1];
      if (mod || min == null) {
        min = +Infinity;
        max = -Infinity;
      }
      pulse.visit(mod ? pulse.SOURCE : pulse.ADD, function (t) {
        var v = toNumber(field(t));
        if (v != null) {
          // NaNs will fail all comparisons!
          if (v < min) min = v;
          if (v > max) max = v;
        }
      });
      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        var name = accessorName(field);
        if (name) name = " for field \"".concat(name, "\"");
        pulse.dataflow.warn("Infinite extent".concat(name, ": [").concat(min, ", ").concat(max, "]"));
        min = max = undefined;
      }
      this.value = [min, max];
    }
  });

  /**
   * Provides a bridge between a parent transform and a target subflow that
   * consumes only a subset of the tuples that pass through the parent.
   * @constructor
   * @param {Pulse} pulse - A pulse to use as the value of this operator.
   * @param {Transform} parent - The parent transform (typically a Facet instance).
   */
  function Subflow(pulse, parent) {
    Operator.call(this, pulse);
    this.parent = parent;
    this.count = 0;
  }
  inherits(Subflow, Operator, {
    /**
     * Routes pulses from this subflow to a target transform.
     * @param {Transform} target - A transform that receives the subflow of tuples.
     */
    connect: function connect(target) {
      this.detachSubflow = target.detachSubflow;
      this.targets().add(target);
      return target.source = this;
    },
    /**
     * Add an 'add' tuple to the subflow pulse.
     * @param {Tuple} t - The tuple being added.
     */
    add: function add(t) {
      this.count += 1;
      this.value.add.push(t);
    },
    /**
     * Add a 'rem' tuple to the subflow pulse.
     * @param {Tuple} t - The tuple being removed.
     */
    rem: function rem(t) {
      this.count -= 1;
      this.value.rem.push(t);
    },
    /**
     * Add a 'mod' tuple to the subflow pulse.
     * @param {Tuple} t - The tuple being modified.
     */
    mod: function mod(t) {
      this.value.mod.push(t);
    },
    /**
     * Re-initialize this operator's pulse value.
     * @param {Pulse} pulse - The pulse to copy from.
     * @see Pulse.init
     */
    init: function init(pulse) {
      this.value.init(pulse, pulse.NO_SOURCE);
    },
    /**
     * Evaluate this operator. This method overrides the
     * default behavior to simply return the contained pulse value.
     * @return {Pulse}
     */
    evaluate: function evaluate() {
      // assert: this.value.stamp === pulse.stamp
      return this.value;
    }
  });

  /**
   * Facets a dataflow into a set of subflows based on a key.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(Dataflow, string): Operator} params.subflow - A function
   *   that generates a subflow of operators and returns its root operator.
   * @param {function(object): *} params.key - The key field to facet by.
   */
  function Facet$1(params) {
    Transform.call(this, {}, params);
    this._keys = fastmap(); // cache previously calculated key values

    // keep track of active subflows, use as targets array for listeners
    // this allows us to limit propagation to only updated subflows
    var a = this._targets = [];
    a.active = 0;
    a.forEach = function (f) {
      for (var i = 0, n = a.active; i < n; ++i) {
        f(a[i], i, a);
      }
    };
  }
  inherits(Facet$1, Transform, {
    activate: function activate(flow) {
      this._targets[this._targets.active++] = flow;
    },
    // parent argument provided by PreFacet subclass
    subflow: function subflow(key, flow, pulse, parent) {
      var flows = this.value;
      var sf = _has(flows, key) && flows[key],
        df,
        p;
      if (!sf) {
        p = parent || (p = this._group[key]) && p.tuple;
        df = pulse.dataflow;
        sf = new Subflow(pulse.fork(pulse.NO_SOURCE), this);
        df.add(sf).connect(flow(df, key, p));
        flows[key] = sf;
        this.activate(sf);
      } else if (sf.value.stamp < pulse.stamp) {
        sf.init(pulse);
        this.activate(sf);
      }
      return sf;
    },
    clean: function clean() {
      var flows = this.value;
      var detached = 0;
      for (var _key3 in flows) {
        if (flows[_key3].count === 0) {
          var detach = flows[_key3].detachSubflow;
          if (detach) detach();
          delete flows[_key3];
          ++detached;
        }
      }

      // remove inactive targets from the active targets array
      if (detached) {
        var active = this._targets.filter(function (sf) {
          return sf && sf.count > 0;
        });
        this.initTargets(active);
      }
    },
    initTargets: function initTargets(act) {
      var a = this._targets,
        n = a.length,
        m = act ? act.length : 0;
      var i = 0;
      for (; i < m; ++i) {
        a[i] = act[i];
      }
      for (; i < n && a[i] != null; ++i) {
        a[i] = null; // ensure old flows can be garbage collected
      }

      a.active = m;
    },
    transform: function transform(_, pulse) {
      var _this6 = this;
      var df = pulse.dataflow,
        key = _.key,
        flow = _.subflow,
        cache = this._keys,
        rekey = _.modified('key'),
        subflow = function subflow(key) {
          return _this6.subflow(key, flow, pulse);
        };
      this._group = _.group || {};
      this.initTargets(); // reset list of active subflows

      pulse.visit(pulse.REM, function (t) {
        var id = tupleid(t),
          k = cache.get(id);
        if (k !== undefined) {
          cache.delete(id);
          subflow(k).rem(t);
        }
      });
      pulse.visit(pulse.ADD, function (t) {
        var k = key(t);
        cache.set(tupleid(t), k);
        subflow(k).add(t);
      });
      if (rekey || pulse.modified(key.fields)) {
        pulse.visit(pulse.MOD, function (t) {
          var id = tupleid(t),
            k0 = cache.get(id),
            k1 = key(t);
          if (k0 === k1) {
            subflow(k1).mod(t);
          } else {
            cache.set(id, k1);
            subflow(k0).rem(t);
            subflow(k1).add(t);
          }
        });
      } else if (pulse.changed(pulse.MOD)) {
        pulse.visit(pulse.MOD, function (t) {
          subflow(cache.get(tupleid(t))).mod(t);
        });
      }
      if (rekey) {
        pulse.visit(pulse.REFLOW, function (t) {
          var id = tupleid(t),
            k0 = cache.get(id),
            k1 = key(t);
          if (k0 !== k1) {
            cache.set(id, k1);
            subflow(k0).rem(t);
            subflow(k1).add(t);
          }
        });
      }
      if (pulse.clean()) {
        df.runAfter(function () {
          _this6.clean();
          cache.clean();
        });
      } else if (cache.empty > df.cleanThreshold) {
        df.runAfter(cache.clean);
      }
      return pulse;
    }
  });

  /**
   * Generates one or more field accessor functions.
   * If the 'name' parameter is an array, an array of field accessors
   * will be created and the 'as' parameter will be ignored.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {string} params.name - The field name(s) to access.
   * @param {string} params.as - The accessor function name.
   */
  function Field$1(params) {
    Operator.call(this, null, update$3, params);
  }
  inherits(Field$1, Operator);
  function update$3(_) {
    return this.value && !_.modified() ? this.value : isArray(_.name) ? array$2(_.name).map(function (f) {
      return field$1(f);
    }) : field$1(_.name, _.as);
  }

  /**
   * Filters data tuples according to a predicate function.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.expr - The predicate expression function
   *   that determines a tuple's filter status. Truthy values pass the filter.
   */
  function Filter(params) {
    Transform.call(this, fastmap(), params);
  }
  Filter.Definition = {
    'type': 'Filter',
    'metadata': {
      'changes': true
    },
    'params': [{
      'name': 'expr',
      'type': 'expr',
      'required': true
    }]
  };
  inherits(Filter, Transform, {
    transform: function transform(_, pulse) {
      var df = pulse.dataflow,
        cache = this.value,
        // cache ids of filtered tuples
        output = pulse.fork(),
        add = output.add,
        rem = output.rem,
        mod = output.mod,
        test = _.expr;
      var isMod = true;
      pulse.visit(pulse.REM, function (t) {
        var id = tupleid(t);
        if (!cache.has(id)) rem.push(t);else cache.delete(id);
      });
      pulse.visit(pulse.ADD, function (t) {
        if (test(t, _)) add.push(t);else cache.set(tupleid(t), 1);
      });
      function revisit(t) {
        var id = tupleid(t),
          b = test(t, _),
          s = cache.get(id);
        if (b && s) {
          cache.delete(id);
          add.push(t);
        } else if (!b && !s) {
          cache.set(id, 1);
          rem.push(t);
        } else if (isMod && b && !s) {
          mod.push(t);
        }
      }
      pulse.visit(pulse.MOD, revisit);
      if (_.modified()) {
        isMod = false;
        pulse.visit(pulse.REFLOW, revisit);
      }
      if (cache.empty > df.cleanThreshold) df.runAfter(cache.clean);
      return output;
    }
  });

  /**
   * Flattens array-typed field values into new data objects.
   * If multiple fields are specified, they are treated as parallel arrays,
   * with output values included for each matching index (or null if missing).
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<function(object): *>} params.fields - An array of field
   *   accessors for the tuple fields that should be flattened.
   * @param {string} [params.index] - Optional output field name for index
   *   value. If unspecified, no index field is included in the output.
   * @param {Array<string>} [params.as] - Output field names for flattened
   *   array fields. Any unspecified fields will use the field name provided
   *   by the fields accessors.
   */
  function Flatten(params) {
    Transform.call(this, [], params);
  }
  Flatten.Definition = {
    'type': 'Flatten',
    'metadata': {
      'generates': true
    },
    'params': [{
      'name': 'fields',
      'type': 'field',
      'array': true,
      'required': true
    }, {
      'name': 'index',
      'type': 'string'
    }, {
      'name': 'as',
      'type': 'string',
      'array': true
    }]
  };
  inherits(Flatten, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.NO_SOURCE),
        fields = _.fields,
        as = fieldNames(fields, _.as || []),
        index = _.index || null,
        m = as.length;

      // remove any previous results
      out.rem = this.value;

      // generate flattened tuples
      pulse.visit(pulse.SOURCE, function (t) {
        var arrays = fields.map(function (f) {
            return f(t);
          }),
          maxlen = arrays.reduce(function (l, a) {
            return Math.max(l, a.length);
          }, 0);
        var i = 0,
          j,
          d,
          v;
        for (; i < maxlen; ++i) {
          d = derive(t);
          for (j = 0; j < m; ++j) {
            d[as[j]] = (v = arrays[j][i]) == null ? null : v;
          }
          if (index) {
            d[index] = i;
          }
          out.add.push(d);
        }
      });
      this.value = out.source = out.add;
      if (index) out.modifies(index);
      return out.modifies(as);
    }
  });

  /**
   * Folds one more tuple fields into multiple tuples in which the field
   * name and values are available under new 'key' and 'value' fields.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.fields - An array of field accessors
   *   for the tuple fields that should be folded.
   * @param {Array<string>} [params.as] - Output field names for folded key
   *   and value fields, defaults to ['key', 'value'].
   */
  function Fold(params) {
    Transform.call(this, [], params);
  }
  Fold.Definition = {
    'type': 'Fold',
    'metadata': {
      'generates': true
    },
    'params': [{
      'name': 'fields',
      'type': 'field',
      'array': true,
      'required': true
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': 2,
      'default': ['key', 'value']
    }]
  };
  inherits(Fold, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.NO_SOURCE),
        fields = _.fields,
        fnames = fields.map(accessorName),
        as = _.as || ['key', 'value'],
        k = as[0],
        v = as[1],
        n = fields.length;
      out.rem = this.value;
      pulse.visit(pulse.SOURCE, function (t) {
        for (var i = 0, d; i < n; ++i) {
          d = derive(t);
          d[k] = fnames[i];
          d[v] = fields[i](t);
          out.add.push(d);
        }
      });
      this.value = out.source = out.add;
      return out.modifies(as);
    }
  });

  /**
   * Invokes a function for each data tuple and saves the results as a new field.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.expr - The formula function to invoke for each tuple.
   * @param {string} params.as - The field name under which to save the result.
   * @param {boolean} [params.initonly=false] - If true, the formula is applied to
   *   added tuples only, and does not update in response to modifications.
   */
  function Formula(params) {
    Transform.call(this, null, params);
  }
  Formula.Definition = {
    'type': 'Formula',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'expr',
      'type': 'expr',
      'required': true
    }, {
      'name': 'as',
      'type': 'string',
      'required': true
    }, {
      'name': 'initonly',
      'type': 'boolean'
    }]
  };
  inherits(Formula, Transform, {
    transform: function transform(_, pulse) {
      var func = _.expr,
        as = _.as,
        mod = _.modified(),
        flag = _.initonly ? pulse.ADD : mod ? pulse.SOURCE : pulse.modified(func.fields) || pulse.modified(as) ? pulse.ADD_MOD : pulse.ADD;
      if (mod) {
        // parameters updated, need to reflow
        pulse = pulse.materialize().reflow(true);
      }
      if (!_.initonly) {
        pulse.modifies(as);
      }
      return pulse.visit(flag, function (t) {
        return t[as] = func(t, _);
      });
    }
  });

  /**
   * Generates data tuples using a provided generator function.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(Parameters): object} params.generator - A tuple generator
   *   function. This function is given the operator parameters as input.
   *   Changes to any additional parameters will not trigger re-calculation
   *   of previously generated tuples. Only future tuples are affected.
   * @param {number} params.size - The number of tuples to produce.
   */
  function Generate(params) {
    Transform.call(this, [], params);
  }
  inherits(Generate, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.ALL),
        gen = _.generator;
      var data = this.value,
        num = _.size - data.length,
        add,
        rem,
        t;
      if (num > 0) {
        // need more tuples, generate and add
        for (add = []; --num >= 0;) {
          add.push(t = ingest$1(gen(_)));
          data.push(t);
        }
        out.add = out.add.length ? out.materialize(out.ADD).add.concat(add) : add;
      } else {
        // need fewer tuples, remove
        rem = data.slice(0, -num);
        out.rem = out.rem.length ? out.materialize(out.REM).rem.concat(rem) : rem;
        data = data.slice(-num);
      }
      out.source = this.value = data;
      return out;
    }
  });
  var Methods$1 = {
    value: 'value',
    median: d3Array.median,
    mean: d3Array.mean,
    min: d3Array.min,
    max: d3Array.max
  };
  var Empty$1 = [];

  /**
   * Impute missing values.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - The value field to impute.
   * @param {Array<function(object): *>} [params.groupby] - An array of
   *   accessors to determine series within which to perform imputation.
   * @param {function(object): *} params.key - An accessor for a key value.
   *   Each key value should be unique within a group. New tuples will be
   *   imputed for any key values that are not found within a group.
   * @param {Array<*>} [params.keyvals] - Optional array of required key
   *   values. New tuples will be imputed for any key values that are not
   *   found within a group. In addition, these values will be automatically
   *   augmented with the key values observed in the input data.
   * @param {string} [method='value'] - The imputation method to use. One of
   *   'value', 'mean', 'median', 'max', 'min'.
   * @param {*} [value=0] - The constant value to use for imputation
   *   when using method 'value'.
   */
  function Impute(params) {
    Transform.call(this, [], params);
  }
  Impute.Definition = {
    'type': 'Impute',
    'metadata': {
      'changes': true
    },
    'params': [{
      'name': 'field',
      'type': 'field',
      'required': true
    }, {
      'name': 'key',
      'type': 'field',
      'required': true
    }, {
      'name': 'keyvals',
      'array': true
    }, {
      'name': 'groupby',
      'type': 'field',
      'array': true
    }, {
      'name': 'method',
      'type': 'enum',
      'default': 'value',
      'values': ['value', 'mean', 'median', 'max', 'min']
    }, {
      'name': 'value',
      'default': 0
    }]
  };
  function getValue(_) {
    var m = _.method || Methods$1.value,
      v;
    if (Methods$1[m] == null) {
      error('Unrecognized imputation method: ' + m);
    } else if (m === Methods$1.value) {
      v = _.value !== undefined ? _.value : 0;
      return function () {
        return v;
      };
    } else {
      return Methods$1[m];
    }
  }
  function getField$1(_) {
    var f = _.field;
    return function (t) {
      return t ? f(t) : NaN;
    };
  }
  inherits(Impute, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.ALL),
        impute = getValue(_),
        field = getField$1(_),
        fName = accessorName(_.field),
        kName = accessorName(_.key),
        gNames = (_.groupby || []).map(accessorName),
        groups = partition$3(pulse.source, _.groupby, _.key, _.keyvals),
        curr = [],
        prev = this.value,
        m = groups.domain.length,
        group,
        value,
        gVals,
        kVal,
        g,
        i,
        j,
        l,
        n,
        t;
      for (g = 0, l = groups.length; g < l; ++g) {
        group = groups[g];
        gVals = group.values;
        value = NaN;

        // add tuples for missing values
        for (j = 0; j < m; ++j) {
          if (group[j] != null) continue;
          kVal = groups.domain[j];
          t = {
            _impute: true
          };
          for (i = 0, n = gVals.length; i < n; ++i) t[gNames[i]] = gVals[i];
          t[kName] = kVal;
          t[fName] = Number.isNaN(value) ? value = impute(group, field) : value;
          curr.push(ingest$1(t));
        }
      }

      // update pulse with imputed tuples
      if (curr.length) out.add = out.materialize(out.ADD).add.concat(curr);
      if (prev.length) out.rem = out.materialize(out.REM).rem.concat(prev);
      this.value = curr;
      return out;
    }
  });
  function partition$3(data, groupby, key, keyvals) {
    var get = function get(f) {
        return f(t);
      },
      groups = [],
      domain = keyvals ? keyvals.slice() : [],
      kMap = {},
      gMap = {},
      gVals,
      gKey,
      group,
      i,
      j,
      k,
      n,
      t;
    domain.forEach(function (k, i) {
      return kMap[k] = i + 1;
    });
    for (i = 0, n = data.length; i < n; ++i) {
      t = data[i];
      k = key(t);
      j = kMap[k] || (kMap[k] = domain.push(k));
      gKey = (gVals = groupby ? groupby.map(get) : Empty$1) + '';
      if (!(group = gMap[gKey])) {
        group = gMap[gKey] = [];
        groups.push(group);
        group.values = gVals;
      }
      group[j - 1] = t;
    }
    groups.domain = domain;
    return groups;
  }

  /**
   * Extend input tuples with aggregate values.
   * Calcuates aggregate values and joins them with the input stream.
   * @constructor
   */
  function JoinAggregate(params) {
    Aggregate$1.call(this, params);
  }
  JoinAggregate.Definition = {
    'type': 'JoinAggregate',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'groupby',
      'type': 'field',
      'array': true
    }, {
      'name': 'fields',
      'type': 'field',
      'null': true,
      'array': true
    }, {
      'name': 'ops',
      'type': 'enum',
      'array': true,
      'values': ValidAggregateOps
    }, {
      'name': 'as',
      'type': 'string',
      'null': true,
      'array': true
    }, {
      'name': 'key',
      'type': 'field'
    }]
  };
  inherits(JoinAggregate, Aggregate$1, {
    transform: function transform(_, pulse) {
      var aggr = this,
        mod = _.modified();
      var cells;

      // process all input tuples to calculate aggregates
      if (aggr.value && (mod || pulse.modified(aggr._inputs, true))) {
        cells = aggr.value = mod ? aggr.init(_) : {};
        pulse.visit(pulse.SOURCE, function (t) {
          return aggr.add(t);
        });
      } else {
        cells = aggr.value = aggr.value || this.init(_);
        pulse.visit(pulse.REM, function (t) {
          return aggr.rem(t);
        });
        pulse.visit(pulse.ADD, function (t) {
          return aggr.add(t);
        });
      }

      // update aggregation cells
      aggr.changes();

      // write aggregate values to input tuples
      pulse.visit(pulse.SOURCE, function (t) {
        extend(t, cells[aggr.cellkey(t)].tuple);
      });
      return pulse.reflow(mod).modifies(this._outputs);
    },
    changes: function changes() {
      var adds = this._adds,
        mods = this._mods;
      var i, n;
      for (i = 0, n = this._alen; i < n; ++i) {
        this.celltuple(adds[i]);
        adds[i] = null; // for garbage collection
      }

      for (i = 0, n = this._mlen; i < n; ++i) {
        this.celltuple(mods[i]);
        mods[i] = null; // for garbage collection
      }

      this._alen = this._mlen = 0; // reset list of active cells
    }
  });

  /**
   * Compute kernel density estimates (KDE) for one or more data groups.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<function(object): *>} [params.groupby] - An array of accessors
   *   to groupby.
   * @param {function(object): *} params.field - An accessor for the data field
   *   to estimate.
   * @param {number} [params.bandwidth=0] - The KDE kernel bandwidth.
   *   If zero or unspecified, the bandwidth is automatically determined.
   * @param {boolean} [params.counts=false] - A boolean flag indicating if the
   *   output values should be probability estimates (false, default) or
   *   smoothed counts (true).
   * @param {string} [params.cumulative=false] - A boolean flag indicating if a
   *   density (false) or cumulative distribution (true) should be generated.
   * @param {Array<number>} [params.extent] - The domain extent over which to
   *   plot the density. If unspecified, the [min, max] data extent is used.
   * @param {string} [params.resolve='independent'] - Indicates how parameters for
   *   multiple densities should be resolved. If "independent" (the default), each
   *   density may have its own domain extent and dynamic number of curve sample
   *   steps. If "shared", the KDE transform will ensure that all densities are
   *   defined over a shared domain and curve steps, enabling stacking.
   * @param {number} [params.minsteps=25] - The minimum number of curve samples
   *   for plotting the density.
   * @param {number} [params.maxsteps=200] - The maximum number of curve samples
   *   for plotting the density.
   * @param {number} [params.steps] - The exact number of curve samples for
   *   plotting the density. If specified, overrides both minsteps and maxsteps
   *   to set an exact number of uniform samples. Useful in conjunction with
   *   a fixed extent to ensure consistent sample points for stacked densities.
   */
  function KDE(params) {
    Transform.call(this, null, params);
  }
  KDE.Definition = {
    'type': 'KDE',
    'metadata': {
      'generates': true
    },
    'params': [{
      'name': 'groupby',
      'type': 'field',
      'array': true
    }, {
      'name': 'field',
      'type': 'field',
      'required': true
    }, {
      'name': 'cumulative',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'counts',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'bandwidth',
      'type': 'number',
      'default': 0
    }, {
      'name': 'extent',
      'type': 'number',
      'array': true,
      'length': 2
    }, {
      'name': 'resolve',
      'type': 'enum',
      'values': ['shared', 'independent'],
      'default': 'independent'
    }, {
      'name': 'steps',
      'type': 'number'
    }, {
      'name': 'minsteps',
      'type': 'number',
      'default': 25
    }, {
      'name': 'maxsteps',
      'type': 'number',
      'default': 200
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'default': ['value', 'density']
    }]
  };
  inherits(KDE, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS);
      if (!this.value || pulse.changed() || _.modified()) {
        var _source = pulse.materialize(pulse.SOURCE).source,
          groups = partition$1$1(_source, _.groupby, _.field),
          names = (_.groupby || []).map(accessorName),
          bandwidth = _.bandwidth,
          method = _.cumulative ? 'cdf' : 'pdf',
          as = _.as || ['value', 'density'],
          values = [];
        var domain = _.extent,
          minsteps = _.steps || _.minsteps || 25,
          maxsteps = _.steps || _.maxsteps || 200;
        if (method !== 'pdf' && method !== 'cdf') {
          error('Invalid density method: ' + method);
        }
        if (_.resolve === 'shared') {
          if (!domain) domain = extent(_source, _.field);
          minsteps = maxsteps = _.steps || maxsteps;
        }
        groups.forEach(function (g) {
          var density = kde(g, bandwidth)[method],
            scale = _.counts ? g.length : 1,
            local = domain || extent(g);
          sampleCurve(density, local, minsteps, maxsteps).forEach(function (v) {
            var t = {};
            for (var i = 0; i < names.length; ++i) {
              t[names[i]] = g.dims[i];
            }
            t[as[0]] = v[0];
            t[as[1]] = v[1] * scale;
            values.push(ingest$1(t));
          });
        });
        if (this.value) out.rem = this.value;
        this.value = out.add = out.source = values;
      }
      return out;
    }
  });

  /**
   * Generates a key function.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<string>} params.fields - The field name(s) for the key function.
   * @param {boolean} params.flat - A boolean flag indicating if the field names
   *  should be treated as flat property names, side-stepping nested field
   *  lookups normally indicated by dot or bracket notation.
   */
  function Key$1(params) {
    Operator.call(this, null, update$2, params);
  }
  inherits(Key$1, Operator);
  function update$2(_) {
    return this.value && !_.modified() ? this.value : key$1(_.fields, _.flat);
  }

  /**
   * Load and parse data from an external source. Marshalls parameter
   * values and then invokes the Dataflow request method.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {string} params.url - The URL to load from.
   * @param {object} params.format - The data format options.
   */
  function Load$1(params) {
    Transform.call(this, [], params);
    this._pending = null;
  }
  inherits(Load$1, Transform, {
    transform: function transform(_, pulse) {
      var _this7 = this;
      var df = pulse.dataflow;
      if (this._pending) {
        // update state and return pulse
        return output(this, pulse, this._pending);
      }
      if (stop(_)) return pulse.StopPropagation;
      if (_.values) {
        // parse and ingest values, return output pulse
        return output(this, pulse, df.parse(_.values, _.format));
      } else if (_.async) {
        // return promise for non-blocking async loading
        var p = df.request(_.url, _.format).then(function (res) {
          _this7._pending = array$2(res.data);
          return function (df) {
            return df.touch(_this7);
          };
        });
        return {
          async: p
        };
      } else {
        // return promise for synchronous loading
        return df.request(_.url, _.format).then(function (res) {
          return output(_this7, pulse, array$2(res.data));
        });
      }
    }
  });
  function stop(_) {
    return _.modified('async') && !(_.modified('values') || _.modified('url') || _.modified('format'));
  }
  function output(op, pulse, data) {
    data.forEach(ingest$1);
    var out = pulse.fork(pulse.NO_FIELDS & pulse.NO_SOURCE);
    out.rem = op.value;
    op.value = out.source = out.add = data;
    op._pending = null;
    if (out.rem.length) out.clean(true);
    return out;
  }

  /**
   * Extend tuples by joining them with values from a lookup table.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Map} params.index - The lookup table map.
   * @param {Array<function(object): *} params.fields - The fields to lookup.
   * @param {Array<string>} params.as - Output field names for each lookup value.
   * @param {*} [params.default] - A default value to use if lookup fails.
   */
  function Lookup(params) {
    Transform.call(this, {}, params);
  }
  Lookup.Definition = {
    'type': 'Lookup',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'index',
      'type': 'index',
      'params': [{
        'name': 'from',
        'type': 'data',
        'required': true
      }, {
        'name': 'key',
        'type': 'field',
        'required': true
      }]
    }, {
      'name': 'values',
      'type': 'field',
      'array': true
    }, {
      'name': 'fields',
      'type': 'field',
      'array': true,
      'required': true
    }, {
      'name': 'as',
      'type': 'string',
      'array': true
    }, {
      'name': 'default',
      'default': null
    }]
  };
  inherits(Lookup, Transform, {
    transform: function transform(_, pulse) {
      var keys = _.fields,
        index = _.index,
        values = _.values,
        defaultValue = _.default == null ? null : _.default,
        reset = _.modified(),
        n = keys.length;
      var flag = reset ? pulse.SOURCE : pulse.ADD,
        out = pulse,
        as = _.as,
        set,
        m,
        mods;
      if (values) {
        m = values.length;
        if (n > 1 && !as) {
          error('Multi-field lookup requires explicit "as" parameter.');
        }
        if (as && as.length !== n * m) {
          error('The "as" parameter has too few output field names.');
        }
        as = as || values.map(accessorName);
        set = function set(t) {
          for (var i = 0, k = 0, j, v; i < n; ++i) {
            v = index.get(keys[i](t));
            if (v == null) for (j = 0; j < m; ++j, ++k) t[as[k]] = defaultValue;else for (j = 0; j < m; ++j, ++k) t[as[k]] = values[j](v);
          }
        };
      } else {
        if (!as) {
          error('Missing output field names.');
        }
        set = function set(t) {
          for (var i = 0, v; i < n; ++i) {
            v = index.get(keys[i](t));
            t[as[i]] = v == null ? defaultValue : v;
          }
        };
      }
      if (reset) {
        out = pulse.reflow(true);
      } else {
        mods = keys.some(function (k) {
          return pulse.modified(k.fields);
        });
        flag |= mods ? pulse.MOD : 0;
      }
      pulse.visit(flag, set);
      return out.modifies(as);
    }
  });

  /**
   * Computes global min/max extents over a collection of extents.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<Array<number>>} params.extents - The input extents.
   */
  function MultiExtent$1(params) {
    Operator.call(this, null, update$1, params);
  }
  inherits(MultiExtent$1, Operator);
  function update$1(_) {
    if (this.value && !_.modified()) {
      return this.value;
    }
    var ext = _.extents,
      n = ext.length;
    var min = +Infinity,
      max = -Infinity,
      i,
      e;
    for (i = 0; i < n; ++i) {
      e = ext[i];
      if (e[0] < min) min = e[0];
      if (e[1] > max) max = e[1];
    }
    return [min, max];
  }

  /**
   * Merge a collection of value arrays.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<Array<*>>} params.values - The input value arrrays.
   */
  function MultiValues$1(params) {
    Operator.call(this, null, update, params);
  }
  inherits(MultiValues$1, Operator);
  function update(_) {
    return this.value && !_.modified() ? this.value : _.values.reduce(function (data, _) {
      return data.concat(_);
    }, []);
  }

  /**
   * Operator whose value is simply its parameter hash. This operator is
   * useful for enabling reactive updates to values of nested objects.
   * @constructor
   * @param {object} params - The parameters for this operator.
   */
  function Params$2(params) {
    Transform.call(this, null, params);
  }
  inherits(Params$2, Transform, {
    transform: function transform(_, pulse) {
      this.modified(_.modified());
      this.value = _;
      return pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS); // do not pass tuples
    }
  });

  /**
   * Aggregate and pivot selected field values to become new fields.
   * This operator is useful to construction cross-tabulations.
   * @constructor
   * @param {Array<function(object): *>} [params.groupby] - An array of accessors
   *  to groupby. These fields act just like groupby fields of an Aggregate transform.
   * @param {function(object): *} params.field - The field to pivot on. The unique
   *  values of this field become new field names in the output stream.
   * @param {function(object): *} params.value - The field to populate pivoted fields.
   *  The aggregate values of this field become the values of the new pivoted fields.
   * @param {string} [params.op] - The aggregation operation for the value field,
   *  applied per cell in the output stream. The default is "sum".
   * @param {number} [params.limit] - An optional parameter indicating the maximum
   *  number of pivoted fields to generate. The pivoted field names are sorted in
   *  ascending order prior to enforcing the limit.
   */
  function Pivot(params) {
    Aggregate$1.call(this, params);
  }
  Pivot.Definition = {
    'type': 'Pivot',
    'metadata': {
      'generates': true,
      'changes': true
    },
    'params': [{
      'name': 'groupby',
      'type': 'field',
      'array': true
    }, {
      'name': 'field',
      'type': 'field',
      'required': true
    }, {
      'name': 'value',
      'type': 'field',
      'required': true
    }, {
      'name': 'op',
      'type': 'enum',
      'values': ValidAggregateOps,
      'default': 'sum'
    }, {
      'name': 'limit',
      'type': 'number',
      'default': 0
    }, {
      'name': 'key',
      'type': 'field'
    }]
  };
  inherits(Pivot, Aggregate$1, {
    _transform: Aggregate$1.prototype.transform,
    transform: function transform(_, pulse) {
      return this._transform(aggregateParams(_, pulse), pulse);
    }
  });

  // Shoehorn a pivot transform into an aggregate transform!
  // First collect all unique pivot field values.
  // Then generate aggregate fields for each output pivot field.
  function aggregateParams(_, pulse) {
    var key = _.field,
      value = _.value,
      op = (_.op === 'count' ? '__count__' : _.op) || 'sum',
      fields = accessorFields(key).concat(accessorFields(value)),
      keys = pivotKeys(key, _.limit || 0, pulse);

    // if data stream content changes, pivot fields may change
    // flag parameter modification to ensure re-initialization
    if (pulse.changed()) _.set('__pivot__', null, null, true);
    return {
      key: _.key,
      groupby: _.groupby,
      ops: keys.map(function () {
        return op;
      }),
      fields: keys.map(function (k) {
        return get$3(k, key, value, fields);
      }),
      as: keys.map(function (k) {
        return k + '';
      }),
      modified: _.modified.bind(_)
    };
  }

  // Generate aggregate field accessor.
  // Output NaN for non-existent values; aggregator will ignore!
  function get$3(k, key, value, fields) {
    return accessor(function (d) {
      return key(d) === k ? value(d) : NaN;
    }, fields, k + '');
  }

  // Collect (and optionally limit) all unique pivot values.
  function pivotKeys(key, limit, pulse) {
    var map = {},
      list = [];
    pulse.visit(pulse.SOURCE, function (t) {
      var k = key(t);
      if (!map[k]) {
        map[k] = 1;
        list.push(k);
      }
    });
    list.sort(ascending$1);
    return limit ? list.slice(0, limit) : list;
  }

  /**
   * Partitions pre-faceted data into tuple subflows.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(Dataflow, string): Operator} params.subflow - A function
   *   that generates a subflow of operators and returns its root operator.
   * @param {function(object): Array<object>} params.field - The field
   *   accessor for an array of subflow tuple objects.
   */
  function PreFacet$1(params) {
    Facet$1.call(this, params);
  }
  inherits(PreFacet$1, Facet$1, {
    transform: function transform(_, pulse) {
      var _this8 = this;
      var flow = _.subflow,
        field = _.field,
        subflow = function subflow(t) {
          return _this8.subflow(tupleid(t), flow, pulse, t);
        };
      if (_.modified('field') || field && pulse.modified(accessorFields(field))) {
        error('PreFacet does not support field modification.');
      }
      this.initTargets(); // reset list of active subflows

      if (field) {
        pulse.visit(pulse.MOD, function (t) {
          var sf = subflow(t);
          field(t).forEach(function (_) {
            return sf.mod(_);
          });
        });
        pulse.visit(pulse.ADD, function (t) {
          var sf = subflow(t);
          field(t).forEach(function (_) {
            return sf.add(ingest$1(_));
          });
        });
        pulse.visit(pulse.REM, function (t) {
          var sf = subflow(t);
          field(t).forEach(function (_) {
            return sf.rem(_);
          });
        });
      } else {
        pulse.visit(pulse.MOD, function (t) {
          return subflow(t).mod(t);
        });
        pulse.visit(pulse.ADD, function (t) {
          return subflow(t).add(t);
        });
        pulse.visit(pulse.REM, function (t) {
          return subflow(t).rem(t);
        });
      }
      if (pulse.clean()) {
        pulse.runAfter(function () {
          return _this8.clean();
        });
      }
      return pulse;
    }
  });

  /**
   * Performs a relational projection, copying selected fields from source
   * tuples to a new set of derived tuples.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<function(object): *} params.fields - The fields to project,
   *   as an array of field accessors. If unspecified, all fields will be
   *   copied with names unchanged.
   * @param {Array<string>} [params.as] - Output field names for each projected
   *   field. Any unspecified fields will use the field name provided by
   *   the field accessor.
   */
  function Project(params) {
    Transform.call(this, null, params);
  }
  Project.Definition = {
    'type': 'Project',
    'metadata': {
      'generates': true,
      'changes': true
    },
    'params': [{
      'name': 'fields',
      'type': 'field',
      'array': true
    }, {
      'name': 'as',
      'type': 'string',
      'null': true,
      'array': true
    }]
  };
  inherits(Project, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.NO_SOURCE),
        fields = _.fields,
        as = fieldNames(_.fields, _.as || []),
        derive = fields ? function (s, t) {
          return project(s, t, fields, as);
        } : rederive;
      var lut;
      if (this.value) {
        lut = this.value;
      } else {
        pulse = pulse.addAll();
        lut = this.value = {};
      }
      pulse.visit(pulse.REM, function (t) {
        var id = tupleid(t);
        out.rem.push(lut[id]);
        lut[id] = null;
      });
      pulse.visit(pulse.ADD, function (t) {
        var dt = derive(t, ingest$1({}));
        lut[tupleid(t)] = dt;
        out.add.push(dt);
      });
      pulse.visit(pulse.MOD, function (t) {
        out.mod.push(derive(t, lut[tupleid(t)]));
      });
      return out;
    }
  });
  function project(s, t, fields, as) {
    for (var i = 0, n = fields.length; i < n; ++i) {
      t[as[i]] = fields[i](s);
    }
    return t;
  }

  /**
   * Proxy the value of another operator as a pure signal value.
   * Ensures no tuples are propagated.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {*} params.value - The value to proxy, becomes the value of this operator.
   */
  function Proxy$1(params) {
    Transform.call(this, null, params);
  }
  inherits(Proxy$1, Transform, {
    transform: function transform(_, pulse) {
      this.value = _.value;
      return _.modified('value') ? pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS) : pulse.StopPropagation;
    }
  });

  /**
   * Generates sample quantile values from an input data stream.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - An accessor for the data field
   *   over which to calculate quantile values.
   * @param {Array<function(object): *>} [params.groupby] - An array of accessors
   *   to groupby.
   * @param {Array<number>} [params.probs] - An array of probabilities in
   *   the range (0, 1) for which to compute quantile values. If not specified,
   *   the *step* parameter will be used.
   * @param {Array<number>} [params.step=0.01] - A probability step size for
   *   sampling quantile values. All values from one-half the step size up to
   *   1 (exclusive) will be sampled. This parameter is only used if the
   *   *quantiles* parameter is not provided.
   */
  function Quantile$1(params) {
    Transform.call(this, null, params);
  }
  Quantile$1.Definition = {
    'type': 'Quantile',
    'metadata': {
      'generates': true,
      'changes': true
    },
    'params': [{
      'name': 'groupby',
      'type': 'field',
      'array': true
    }, {
      'name': 'field',
      'type': 'field',
      'required': true
    }, {
      'name': 'probs',
      'type': 'number',
      'array': true
    }, {
      'name': 'step',
      'type': 'number',
      'default': 0.01
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'default': ['prob', 'value']
    }]
  };
  var EPSILON = 1e-14;
  inherits(Quantile$1, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
        as = _.as || ['prob', 'value'];
      if (this.value && !_.modified() && !pulse.changed()) {
        out.source = this.value;
        return out;
      }
      var source = pulse.materialize(pulse.SOURCE).source,
        groups = partition$1$1(source, _.groupby, _.field),
        names = (_.groupby || []).map(accessorName),
        values = [],
        step = _.step || 0.01,
        p = _.probs || d3Array.range(step / 2, 1 - EPSILON, step),
        n = p.length;
      groups.forEach(function (g) {
        var q = quantiles(g, p);
        for (var i = 0; i < n; ++i) {
          var t = {};
          for (var _i2 = 0; _i2 < names.length; ++_i2) {
            t[names[_i2]] = g.dims[_i2];
          }
          t[as[0]] = p[i];
          t[as[1]] = q[i];
          values.push(ingest$1(t));
        }
      });
      if (this.value) out.rem = this.value;
      this.value = out.add = out.source = values;
      return out;
    }
  });

  /**
   * Relays a data stream between data processing pipelines.
   * If the derive parameter is set, this transform will create derived
   * copies of observed tuples. This provides derived data streams in which
   * modifications to the tuples do not pollute an upstream data source.
   * @param {object} params - The parameters for this operator.
   * @param {number} [params.derive=false] - Boolean flag indicating if
   *   the transform should make derived copies of incoming tuples.
   * @constructor
   */
  function Relay$1(params) {
    Transform.call(this, null, params);
  }
  inherits(Relay$1, Transform, {
    transform: function transform(_, pulse) {
      var out, lut;
      if (this.value) {
        lut = this.value;
      } else {
        out = pulse = pulse.addAll();
        lut = this.value = {};
      }
      if (_.derive) {
        out = pulse.fork(pulse.NO_SOURCE);
        pulse.visit(pulse.REM, function (t) {
          var id = tupleid(t);
          out.rem.push(lut[id]);
          lut[id] = null;
        });
        pulse.visit(pulse.ADD, function (t) {
          var dt = derive(t);
          lut[tupleid(t)] = dt;
          out.add.push(dt);
        });
        pulse.visit(pulse.MOD, function (t) {
          var dt = lut[tupleid(t)];
          for (var k in t) {
            dt[k] = t[k];
            // down stream writes may overwrite re-derived tuples
            // conservatively mark all source fields as modified
            out.modifies(k);
          }
          out.mod.push(dt);
        });
      }
      return out;
    }
  });

  /**
   * Samples tuples passing through this operator.
   * Uses reservoir sampling to maintain a representative sample.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {number} [params.size=1000] - The maximum number of samples.
   */
  function Sample(params) {
    Transform.call(this, [], params);
    this.count = 0;
  }
  Sample.Definition = {
    'type': 'Sample',
    'metadata': {},
    'params': [{
      'name': 'size',
      'type': 'number',
      'default': 1000
    }]
  };
  inherits(Sample, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.NO_SOURCE),
        mod = _.modified('size'),
        num = _.size,
        map = this.value.reduce(function (m, t) {
          return m[tupleid(t)] = 1, m;
        }, {});
      var res = this.value,
        cnt = this.count,
        cap = 0;

      // sample reservoir update function
      function update(t) {
        var p, idx;
        if (res.length < num) {
          res.push(t);
        } else {
          idx = ~~((cnt + 1) * exports.random());
          if (idx < res.length && idx >= cap) {
            p = res[idx];
            if (map[tupleid(p)]) out.rem.push(p); // eviction
            res[idx] = t;
          }
        }
        ++cnt;
      }
      if (pulse.rem.length) {
        // find all tuples that should be removed, add to output
        pulse.visit(pulse.REM, function (t) {
          var id = tupleid(t);
          if (map[id]) {
            map[id] = -1;
            out.rem.push(t);
          }
          --cnt;
        });

        // filter removed tuples out of the sample reservoir
        res = res.filter(function (t) {
          return map[tupleid(t)] !== -1;
        });
      }
      if ((pulse.rem.length || mod) && res.length < num && pulse.source) {
        // replenish sample if backing data source is available
        cap = cnt = res.length;
        pulse.visit(pulse.SOURCE, function (t) {
          // update, but skip previously sampled tuples
          if (!map[tupleid(t)]) update(t);
        });
        cap = -1;
      }
      if (mod && res.length > num) {
        var n = res.length - num;
        for (var i = 0; i < n; ++i) {
          map[tupleid(res[i])] = -1;
          out.rem.push(res[i]);
        }
        res = res.slice(n);
      }
      if (pulse.mod.length) {
        // propagate modified tuples in the sample reservoir
        pulse.visit(pulse.MOD, function (t) {
          if (map[tupleid(t)]) out.mod.push(t);
        });
      }
      if (pulse.add.length) {
        // update sample reservoir
        pulse.visit(pulse.ADD, update);
      }
      if (pulse.add.length || cap < 0) {
        // output newly added tuples
        out.add = res.filter(function (t) {
          return !map[tupleid(t)];
        });
      }
      this.count = cnt;
      this.value = out.source = res;
      return out;
    }
  });

  /**
   * Generates data tuples for a specified sequence range of numbers.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {number} params.start - The first number in the sequence.
   * @param {number} params.stop - The last number (exclusive) in the sequence.
   * @param {number} [params.step=1] - The step size between numbers in the sequence.
   */
  function Sequence(params) {
    Transform.call(this, null, params);
  }
  Sequence.Definition = {
    'type': 'Sequence',
    'metadata': {
      'generates': true,
      'changes': true
    },
    'params': [{
      'name': 'start',
      'type': 'number',
      'required': true
    }, {
      'name': 'stop',
      'type': 'number',
      'required': true
    }, {
      'name': 'step',
      'type': 'number',
      'default': 1
    }, {
      'name': 'as',
      'type': 'string',
      'default': 'data'
    }]
  };
  inherits(Sequence, Transform, {
    transform: function transform(_, pulse) {
      if (this.value && !_.modified()) return;
      var out = pulse.materialize().fork(pulse.MOD),
        as = _.as || 'data';
      out.rem = this.value ? pulse.rem.concat(this.value) : pulse.rem;
      this.value = d3Array.range(_.start, _.stop, _.step || 1).map(function (v) {
        var t = {};
        t[as] = v;
        return ingest$1(t);
      });
      out.add = pulse.add.concat(this.value);
      return out;
    }
  });

  /**
   * Propagates a new pulse without any tuples so long as the input
   * pulse contains some added, removed or modified tuples.
   * @param {object} params - The parameters for this operator.
   * @constructor
   */
  function Sieve$1(params) {
    Transform.call(this, null, params);
    this.modified(true); // always treat as modified
  }

  inherits(Sieve$1, Transform, {
    transform: function transform(_, pulse) {
      this.value = pulse.source;
      return pulse.changed() ? pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS) : pulse.StopPropagation;
    }
  });

  /**
   * Discretize dates to specific time units.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - The data field containing date/time values.
   */
  function TimeUnit(params) {
    Transform.call(this, null, params);
  }
  var OUTPUT = ['unit0', 'unit1'];
  TimeUnit.Definition = {
    'type': 'TimeUnit',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'field',
      'type': 'field',
      'required': true
    }, {
      'name': 'interval',
      'type': 'boolean',
      'default': true
    }, {
      'name': 'units',
      'type': 'enum',
      'values': TIME_UNITS,
      'array': true
    }, {
      'name': 'step',
      'type': 'number',
      'default': 1
    }, {
      'name': 'maxbins',
      'type': 'number',
      'default': 40
    }, {
      'name': 'extent',
      'type': 'date',
      'array': true
    }, {
      'name': 'timezone',
      'type': 'enum',
      'default': 'local',
      'values': ['local', 'utc']
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': 2,
      'default': OUTPUT
    }]
  };
  inherits(TimeUnit, Transform, {
    transform: function transform(_, pulse) {
      var field = _.field,
        band = _.interval !== false,
        utc = _.timezone === 'utc',
        floor = this._floor(_, pulse),
        offset = (utc ? utcInterval : timeInterval)(floor.unit).offset,
        as = _.as || OUTPUT,
        u0 = as[0],
        u1 = as[1],
        step = floor.step;
      var min = floor.start || Infinity,
        max = floor.stop || -Infinity,
        flag = pulse.ADD;
      if (_.modified() || pulse.changed(pulse.REM) || pulse.modified(accessorFields(field))) {
        pulse = pulse.reflow(true);
        flag = pulse.SOURCE;
        min = Infinity;
        max = -Infinity;
      }
      pulse.visit(flag, function (t) {
        var v = field(t);
        var a, b;
        if (v == null) {
          t[u0] = null;
          if (band) t[u1] = null;
        } else {
          t[u0] = a = b = floor(v);
          if (band) t[u1] = b = offset(a, step);
          if (a < min) min = a;
          if (b > max) max = b;
        }
      });
      floor.start = min;
      floor.stop = max;
      return pulse.modifies(band ? as : u0);
    },
    _floor: function _floor(_, pulse) {
      var utc = _.timezone === 'utc';

      // get parameters
      var _ref = _.units ? {
          units: _.units,
          step: _.step || 1
        } : bin$1({
          extent: _.extent || extent(pulse.materialize(pulse.SOURCE).source, _.field),
          maxbins: _.maxbins
        }),
        units = _ref.units,
        step = _ref.step;

      // check / standardize time units
      var tunits = timeUnits(units),
        prev = this.value || {},
        floor = (utc ? utcFloor : timeFloor)(tunits, step);
      floor.unit = peek$1(tunits);
      floor.units = tunits;
      floor.step = step;
      floor.start = prev.start;
      floor.stop = prev.stop;
      return this.value = floor;
    }
  });

  /**
   * An index that maps from unique, string-coerced, field values to tuples.
   * Assumes that the field serves as a unique key with no duplicate values.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - The field accessor to index.
   */
  function TupleIndex(params) {
    Transform.call(this, fastmap(), params);
  }
  inherits(TupleIndex, Transform, {
    transform: function transform(_, pulse) {
      var df = pulse.dataflow,
        field = _.field,
        index = this.value,
        set = function set(t) {
          return index.set(field(t), t);
        };
      var mod = true;
      if (_.modified('field') || pulse.modified(field.fields)) {
        index.clear();
        pulse.visit(pulse.SOURCE, set);
      } else if (pulse.changed()) {
        pulse.visit(pulse.REM, function (t) {
          return index.delete(field(t));
        });
        pulse.visit(pulse.ADD, set);
      } else {
        mod = false;
      }
      this.modified(mod);
      if (index.empty > df.cleanThreshold) df.runAfter(index.clean);
      return pulse.fork();
    }
  });

  /**
   * Extracts an array of values. Assumes the source data has already been
   * reduced as needed (e.g., by an upstream Aggregate transform).
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - The domain field to extract.
   * @param {function(*,*): number} [params.sort] - An optional
   *   comparator function for sorting the values. The comparator will be
   *   applied to backing tuples prior to value extraction.
   */
  function Values$1(params) {
    Transform.call(this, null, params);
  }
  inherits(Values$1, Transform, {
    transform: function transform(_, pulse) {
      var run = !this.value || _.modified('field') || _.modified('sort') || pulse.changed() || _.sort && pulse.modified(_.sort.fields);
      if (run) {
        this.value = (_.sort ? pulse.source.slice().sort(stableCompare(_.sort)) : pulse.source).map(_.field);
      }
    }
  });
  function WindowOp(op, field, param, as) {
    var fn = WindowOps[op](field, param);
    return {
      init: fn.init || zero$1,
      update: function update(w, t) {
        t[as] = fn.next(w);
      }
    };
  }
  var WindowOps = {
    row_number: function row_number() {
      return {
        next: function next(w) {
          return w.index + 1;
        }
      };
    },
    rank: function rank() {
      var rank;
      return {
        init: function init() {
          return rank = 1;
        },
        next: function next(w) {
          var i = w.index,
            data = w.data;
          return i && w.compare(data[i - 1], data[i]) ? rank = i + 1 : rank;
        }
      };
    },
    dense_rank: function dense_rank() {
      var drank;
      return {
        init: function init() {
          return drank = 1;
        },
        next: function next(w) {
          var i = w.index,
            d = w.data;
          return i && w.compare(d[i - 1], d[i]) ? ++drank : drank;
        }
      };
    },
    percent_rank: function percent_rank() {
      var rank = WindowOps.rank(),
        _next = rank.next;
      return {
        init: rank.init,
        next: function next(w) {
          return (_next(w) - 1) / (w.data.length - 1);
        }
      };
    },
    cume_dist: function cume_dist() {
      var cume;
      return {
        init: function init() {
          return cume = 0;
        },
        next: function next(w) {
          var d = w.data,
            c = w.compare;
          var i = w.index;
          if (cume < i) {
            while (i + 1 < d.length && !c(d[i], d[i + 1])) ++i;
            cume = i;
          }
          return (1 + cume) / d.length;
        }
      };
    },
    ntile: function ntile(field, num) {
      num = +num;
      if (!(num > 0)) error('ntile num must be greater than zero.');
      var cume = WindowOps.cume_dist(),
        _next2 = cume.next;
      return {
        init: cume.init,
        next: function next(w) {
          return Math.ceil(num * _next2(w));
        }
      };
    },
    lag: function lag(field, offset) {
      offset = +offset || 1;
      return {
        next: function next(w) {
          var i = w.index - offset;
          return i >= 0 ? field(w.data[i]) : null;
        }
      };
    },
    lead: function lead(field, offset) {
      offset = +offset || 1;
      return {
        next: function next(w) {
          var i = w.index + offset,
            d = w.data;
          return i < d.length ? field(d[i]) : null;
        }
      };
    },
    first_value: function first_value(field) {
      return {
        next: function next(w) {
          return field(w.data[w.i0]);
        }
      };
    },
    last_value: function last_value(field) {
      return {
        next: function next(w) {
          return field(w.data[w.i1 - 1]);
        }
      };
    },
    nth_value: function nth_value(field, nth) {
      nth = +nth;
      if (!(nth > 0)) error('nth_value nth must be greater than zero.');
      return {
        next: function next(w) {
          var i = w.i0 + (nth - 1);
          return i < w.i1 ? field(w.data[i]) : null;
        }
      };
    },
    prev_value: function prev_value(field) {
      var prev;
      return {
        init: function init() {
          return prev = null;
        },
        next: function next(w) {
          var v = field(w.data[w.index]);
          return v != null ? prev = v : prev;
        }
      };
    },
    next_value: function next_value(field) {
      var v, i;
      return {
        init: function init() {
          return v = null, i = -1;
        },
        next: function next(w) {
          var d = w.data;
          return w.index <= i ? v : (i = find$1(field, d, w.index)) < 0 ? (i = d.length, v = null) : v = field(d[i]);
        }
      };
    }
  };
  function find$1(field, data, index) {
    for (var n = data.length; index < n; ++index) {
      var v = field(data[index]);
      if (v != null) return index;
    }
    return -1;
  }
  var ValidWindowOps = Object.keys(WindowOps);
  function WindowState(_) {
    var ops = array$2(_.ops),
      fields = array$2(_.fields),
      params = array$2(_.params),
      as = array$2(_.as),
      outputs = this.outputs = [],
      windows = this.windows = [],
      inputs = {},
      map = {},
      counts = [],
      measures = [];
    var countOnly = true;
    function visitInputs(f) {
      array$2(accessorFields(f)).forEach(function (_) {
        return inputs[_] = 1;
      });
    }
    visitInputs(_.sort);
    ops.forEach(function (op, i) {
      var field = fields[i],
        mname = accessorName(field),
        name = measureName(op, mname, as[i]);
      visitInputs(field);
      outputs.push(name);

      // Window operation
      if (_has(WindowOps, op)) {
        windows.push(WindowOp(op, fields[i], params[i], name));
      }

      // Aggregate operation
      else {
        if (field == null && op !== 'count') {
          error('Null aggregate field specified.');
        }
        if (op === 'count') {
          counts.push(name);
          return;
        }
        countOnly = false;
        var m = map[mname];
        if (!m) {
          m = map[mname] = [];
          m.field = field;
          measures.push(m);
        }
        m.push(createMeasure(op, name));
      }
    });
    if (counts.length || measures.length) {
      this.cell = cell(measures, counts, countOnly);
    }
    this.inputs = Object.keys(inputs);
  }
  var prototype = WindowState.prototype;
  prototype.init = function () {
    this.windows.forEach(function (_) {
      return _.init();
    });
    if (this.cell) this.cell.init();
  };
  prototype.update = function (w, t) {
    var cell = this.cell,
      wind = this.windows,
      data = w.data,
      m = wind && wind.length;
    var j;
    if (cell) {
      for (j = w.p0; j < w.i0; ++j) cell.rem(data[j]);
      for (j = w.p1; j < w.i1; ++j) cell.add(data[j]);
      cell.set(t);
    }
    for (j = 0; j < m; ++j) wind[j].update(w, t);
  };
  function cell(measures, counts, countOnly) {
    measures = measures.map(function (m) {
      return compileMeasures(m, m.field);
    });
    var cell = {
      num: 0,
      agg: null,
      store: false,
      count: counts
    };
    if (!countOnly) {
      var n = measures.length,
        a = cell.agg = Array(n),
        i = 0;
      for (; i < n; ++i) a[i] = new measures[i](cell);
    }
    if (cell.store) {
      var store = cell.data = new TupleStore();
    }
    cell.add = function (t) {
      cell.num += 1;
      if (countOnly) return;
      if (store) store.add(t);
      for (var _i3 = 0; _i3 < n; ++_i3) {
        a[_i3].add(a[_i3].get(t), t);
      }
    };
    cell.rem = function (t) {
      cell.num -= 1;
      if (countOnly) return;
      if (store) store.rem(t);
      for (var _i4 = 0; _i4 < n; ++_i4) {
        a[_i4].rem(a[_i4].get(t), t);
      }
    };
    cell.set = function (t) {
      var i, n;

      // consolidate stored values
      if (store) store.values();

      // update tuple properties
      for (i = 0, n = counts.length; i < n; ++i) t[counts[i]] = cell.num;
      if (!countOnly) for (i = 0, n = a.length; i < n; ++i) a[i].set(t);
    };
    cell.init = function () {
      cell.num = 0;
      if (store) store.reset();
      for (var _i5 = 0; _i5 < n; ++_i5) a[_i5].init();
    };
    return cell;
  }

  /**
   * Perform window calculations and write results to the input stream.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(*,*): number} [params.sort] - A comparator function for sorting tuples within a window.
   * @param {Array<function(object): *>} [params.groupby] - An array of accessors by which to partition tuples into separate windows.
   * @param {Array<string>} params.ops - An array of strings indicating window operations to perform.
   * @param {Array<function(object): *>} [params.fields] - An array of accessors
   *   for data fields to use as inputs to window operations.
   * @param {Array<*>} [params.params] - An array of parameter values for window operations.
   * @param {Array<string>} [params.as] - An array of output field names for window operations.
   * @param {Array<number>} [params.frame] - Window frame definition as two-element array.
   * @param {boolean} [params.ignorePeers=false] - If true, base window frame boundaries on row
   *   number alone, ignoring peers with identical sort values. If false (default),
   *   the window boundaries will be adjusted to include peer values.
   */
  function Window(params) {
    Transform.call(this, {}, params);
    this._mlen = 0;
    this._mods = [];
  }
  Window.Definition = {
    'type': 'Window',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'sort',
      'type': 'compare'
    }, {
      'name': 'groupby',
      'type': 'field',
      'array': true
    }, {
      'name': 'ops',
      'type': 'enum',
      'array': true,
      'values': ValidWindowOps.concat(ValidAggregateOps)
    }, {
      'name': 'params',
      'type': 'number',
      'null': true,
      'array': true
    }, {
      'name': 'fields',
      'type': 'field',
      'null': true,
      'array': true
    }, {
      'name': 'as',
      'type': 'string',
      'null': true,
      'array': true
    }, {
      'name': 'frame',
      'type': 'number',
      'null': true,
      'array': true,
      'length': 2,
      'default': [null, 0]
    }, {
      'name': 'ignorePeers',
      'type': 'boolean',
      'default': false
    }]
  };
  inherits(Window, Transform, {
    transform: function transform(_, pulse) {
      var _this9 = this;
      this.stamp = pulse.stamp;
      var mod = _.modified(),
        cmp = stableCompare(_.sort),
        key = groupkey(_.groupby),
        group = function group(t) {
          return _this9.group(key(t));
        };

      // initialize window state
      var state = this.state;
      if (!state || mod) {
        state = this.state = new WindowState(_);
      }

      // partition input tuples
      if (mod || pulse.modified(state.inputs)) {
        this.value = {};
        pulse.visit(pulse.SOURCE, function (t) {
          return group(t).add(t);
        });
      } else {
        pulse.visit(pulse.REM, function (t) {
          return group(t).remove(t);
        });
        pulse.visit(pulse.ADD, function (t) {
          return group(t).add(t);
        });
      }

      // perform window calculations for each modified partition
      for (var i = 0, n = this._mlen; i < n; ++i) {
        processPartition(this._mods[i], state, cmp, _);
      }
      this._mlen = 0;
      this._mods = [];

      // TODO don't reflow everything?
      return pulse.reflow(mod).modifies(state.outputs);
    },
    group: function group(key) {
      var group = this.value[key];
      if (!group) {
        group = this.value[key] = SortedList(tupleid);
        group.stamp = -1;
      }
      if (group.stamp < this.stamp) {
        group.stamp = this.stamp;
        this._mods[this._mlen++] = group;
      }
      return group;
    }
  });
  function processPartition(list, state, cmp, _) {
    var sort = _.sort,
      range = sort && !_.ignorePeers,
      frame = _.frame || [null, 0],
      data = list.data(cmp),
      // use cmp for stable sort
      n = data.length,
      b = range ? d3Array.bisector(sort) : null,
      w = {
        i0: 0,
        i1: 0,
        p0: 0,
        p1: 0,
        index: 0,
        data: data,
        compare: sort || constant$1(-1)
      };
    state.init();
    for (var i = 0; i < n; ++i) {
      setWindow(w, frame, i, n);
      if (range) adjustRange(w, b);
      state.update(w, data[i]);
    }
  }
  function setWindow(w, f, i, n) {
    w.p0 = w.i0;
    w.p1 = w.i1;
    w.i0 = f[0] == null ? 0 : Math.max(0, i - Math.abs(f[0]));
    w.i1 = f[1] == null ? n : Math.min(n, i + Math.abs(f[1]) + 1);
    w.index = i;
  }

  // if frame type is 'range', adjust window for peer values
  function adjustRange(w, bisect) {
    var r0 = w.i0,
      r1 = w.i1 - 1,
      c = w.compare,
      d = w.data,
      n = d.length - 1;
    if (r0 > 0 && !c(d[r0], d[r0 - 1])) w.i0 = bisect.left(d, d[r0]);
    if (r1 < n && !c(d[r1], d[r1 + 1])) w.i1 = bisect.right(d, d[r1]);
  }

  var tx = /*#__PURE__*/Object.freeze({
    __proto__: null,
    aggregate: Aggregate$1,
    bin: Bin,
    collect: Collect$1,
    compare: Compare$1,
    countpattern: CountPattern,
    cross: Cross,
    density: Density,
    dotbin: DotBin,
    expression: Expression$1,
    extent: Extent,
    facet: Facet$1,
    field: Field$1,
    filter: Filter,
    flatten: Flatten,
    fold: Fold,
    formula: Formula,
    generate: Generate,
    impute: Impute,
    joinaggregate: JoinAggregate,
    kde: KDE,
    key: Key$1,
    load: Load$1,
    lookup: Lookup,
    multiextent: MultiExtent$1,
    multivalues: MultiValues$1,
    params: Params$2,
    pivot: Pivot,
    prefacet: PreFacet$1,
    project: Project,
    proxy: Proxy$1,
    quantile: Quantile$1,
    relay: Relay$1,
    sample: Sample,
    sequence: Sequence,
    sieve: Sieve$1,
    subflow: Subflow,
    timeunit: TimeUnit,
    tupleindex: TupleIndex,
    values: Values$1,
    window: Window
  });

  function domCanvas(w, h) {
    if (typeof document !== 'undefined' && document.createElement) {
      var c = document.createElement('canvas');
      if (c && c.getContext) {
        c.width = w;
        c.height = h;
        return c;
      }
    }
    return null;
  }
  var domImage = function domImage() {
    return typeof Image !== 'undefined' ? Image : null;
  };

  var _symbols, _formats;
  function bandSpace(count, paddingInner, paddingOuter) {
    var space = count - paddingInner + paddingOuter * 2;
    return count ? space > 0 ? space : 1 : 0;
  }
  var Identity = 'identity';
  var Linear = 'linear';
  var Log = 'log';
  var Pow = 'pow';
  var Sqrt = 'sqrt';
  var Symlog = 'symlog';
  var Time = 'time';
  var UTC = 'utc';
  var Sequential = 'sequential';
  var Diverging = 'diverging';
  var Quantile = 'quantile';
  var Quantize = 'quantize';
  var Threshold = 'threshold';
  var Ordinal = 'ordinal';
  var Point = 'point';
  var Band = 'band';
  var BinOrdinal = 'bin-ordinal';

  // categories
  var Continuous = 'continuous';
  var Discrete$1 = 'discrete';
  var Discretizing = 'discretizing';
  var Interpolating = 'interpolating';
  var Temporal = 'temporal';
  function invertRange(scale) {
    return function (_) {
      var lo = _[0],
        hi = _[1],
        t;
      if (hi < lo) {
        t = lo;
        lo = hi;
        hi = t;
      }
      return [scale.invert(lo), scale.invert(hi)];
    };
  }
  function invertRangeExtent(scale) {
    return function (_) {
      var range = scale.range();
      var lo = _[0],
        hi = _[1],
        min = -1,
        max,
        t,
        i,
        n;
      if (hi < lo) {
        t = lo;
        lo = hi;
        hi = t;
      }
      for (i = 0, n = range.length; i < n; ++i) {
        if (range[i] >= lo && range[i] <= hi) {
          if (min < 0) min = i;
          max = i;
        }
      }
      if (min < 0) return undefined;
      lo = scale.invertExtent(range[min]);
      hi = scale.invertExtent(range[max]);
      return [lo[0] === undefined ? lo[1] : lo[0], hi[1] === undefined ? hi[0] : hi[1]];
    };
  }
  function band() {
    var scale = $$1.scaleOrdinal().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range;
    var range$1 = [0, 1],
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;
    delete scale.unknown;
    function rescale() {
      var n = domain().length,
        reverse = range$1[1] < range$1[0],
        stop = range$1[1 - reverse],
        space = bandSpace(n, paddingInner, paddingOuter);
      var start = range$1[reverse - 0];
      step = (stop - start) / (space || 1);
      if (round) {
        step = Math.floor(step);
      }
      start += (stop - start - step * (n - paddingInner)) * align;
      bandwidth = step * (1 - paddingInner);
      if (round) {
        start = Math.round(start);
        bandwidth = Math.round(bandwidth);
      }
      var values = d3Array.range(n).map(function (i) {
        return start + step * i;
      });
      return ordinalRange(reverse ? values.reverse() : values);
    }
    scale.domain = function (_) {
      if (arguments.length) {
        domain(_);
        return rescale();
      } else {
        return domain();
      }
    };
    scale.range = function (_) {
      if (arguments.length) {
        range$1 = [+_[0], +_[1]];
        return rescale();
      } else {
        return range$1.slice();
      }
    };
    scale.rangeRound = function (_) {
      range$1 = [+_[0], +_[1]];
      round = true;
      return rescale();
    };
    scale.bandwidth = function () {
      return bandwidth;
    };
    scale.step = function () {
      return step;
    };
    scale.round = function (_) {
      if (arguments.length) {
        round = !!_;
        return rescale();
      } else {
        return round;
      }
    };
    scale.padding = function (_) {
      if (arguments.length) {
        paddingOuter = Math.max(0, Math.min(1, _));
        paddingInner = paddingOuter;
        return rescale();
      } else {
        return paddingInner;
      }
    };
    scale.paddingInner = function (_) {
      if (arguments.length) {
        paddingInner = Math.max(0, Math.min(1, _));
        return rescale();
      } else {
        return paddingInner;
      }
    };
    scale.paddingOuter = function (_) {
      if (arguments.length) {
        paddingOuter = Math.max(0, Math.min(1, _));
        return rescale();
      } else {
        return paddingOuter;
      }
    };
    scale.align = function (_) {
      if (arguments.length) {
        align = Math.max(0, Math.min(1, _));
        return rescale();
      } else {
        return align;
      }
    };
    scale.invertRange = function (_) {
      // bail if range has null or undefined values
      if (_[0] == null || _[1] == null) return;
      var reverse = range$1[1] < range$1[0],
        values = reverse ? ordinalRange().reverse() : ordinalRange(),
        n = values.length - 1;
      var lo = +_[0],
        hi = +_[1],
        a,
        b,
        t;

      // bail if either range endpoint is invalid
      if (lo !== lo || hi !== hi) return;

      // order range inputs, bail if outside of scale range
      if (hi < lo) {
        t = lo;
        lo = hi;
        hi = t;
      }
      if (hi < values[0] || lo > range$1[1 - reverse]) return;

      // binary search to index into scale range
      a = Math.max(0, d3Array.bisectRight(values, lo) - 1);
      b = lo === hi ? a : d3Array.bisectRight(values, hi) - 1;

      // increment index a if lo is within padding gap
      if (lo - values[a] > bandwidth + 1e-10) ++a;
      if (reverse) {
        // map + swap
        t = a;
        a = n - b;
        b = n - t;
      }
      return a > b ? undefined : domain().slice(a, b + 1);
    };
    scale.invert = function (_) {
      var value = scale.invertRange([_, _]);
      return value ? value[0] : value;
    };
    scale.copy = function () {
      return band().domain(domain()).range(range$1).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
    };
    return rescale();
  }
  function pointish(scale) {
    var copy = scale.copy;
    scale.padding = scale.paddingOuter;
    delete scale.paddingInner;
    scale.copy = function () {
      return pointish(copy());
    };
    return scale;
  }
  function point$1() {
    return pointish(band().paddingInner(1));
  }
  var map = Array.prototype.map;
  function numbers(_) {
    return map.call(_, toNumber);
  }
  var slice$1 = Array.prototype.slice;
  function scaleBinOrdinal() {
    var domain = [],
      range = [];
    function scale(x) {
      return x == null || x !== x ? undefined : range[(d3Array.bisect(domain, x) - 1) % range.length];
    }
    scale.domain = function (_) {
      if (arguments.length) {
        domain = numbers(_);
        return scale;
      } else {
        return domain.slice();
      }
    };
    scale.range = function (_) {
      if (arguments.length) {
        range = slice$1.call(_);
        return scale;
      } else {
        return range.slice();
      }
    };
    scale.tickFormat = function (count, specifier) {
      return $$1.tickFormat(domain[0], peek$1(domain), count == null ? 10 : count, specifier);
    };
    scale.copy = function () {
      return scaleBinOrdinal().domain(scale.domain()).range(scale.range());
    };
    return scale;
  }

  /** Private scale registry: should not be exported */
  var scales = new Map();
  var VEGA_SCALE = Symbol('vega_scale');
  function registerScale(scale) {
    scale[VEGA_SCALE] = true;
    return scale;
  }

  /**
   * Return true if object was created by a constructor from the vega-scale `scale` function.
   */
  function isRegisteredScale(scale) {
    return scale && scale[VEGA_SCALE] === true;
  }

  /**
   * Augment scales with their type and needed inverse methods.
   */
  function create$2(type, constructor, metadata) {
    var ctr = function scale() {
      var s = constructor();
      if (!s.invertRange) {
        s.invertRange = s.invert ? invertRange(s) : s.invertExtent ? invertRangeExtent(s) : undefined;
      }
      s.type = type;
      return registerScale(s);
    };
    ctr.metadata = toSet(array$2(metadata));
    return ctr;
  }

  /**
   * Registry function for adding and accessing scale constructor functions.
   * The *type* argument is a String indicating the name of the scale type.
   *
   * If the *scale* argument is not specified, this method returns the matching scale constructor in the registry, or `null` if not found.
   * If the *scale* argument is provided, it must be a scale constructor function to add to the registry under the given *type* name.
   * The *metadata* argument provides additional information to guide appropriate use of scales within Vega.
   *
   *  *metadata* can be either a string or string array. The valid string values are:
   * - `"continuous"` - the scale is defined over a continuous-valued domain.
   * - `"discrete"` - the scale is defined over a discrete domain and range.
   * - `"discretizing"` - the scale discretizes a continuous domain to a discrete range.
   * - `"interpolating"` - the scale range is defined using a color interpolator.
   * - `"log"` - the scale performs a logarithmic transform of the continuous domain.
   * - `"temporal"` - the scale domain is defined over date-time values.
   */
  function scale$4(type, scale, metadata) {
    if (arguments.length > 1) {
      scales.set(type, create$2(type, scale, metadata));
      return this;
    } else {
      return isValidScaleType(type) ? scales.get(type) : undefined;
    }
  }

  // identity scale
  scale$4(Identity, $__namespace.scaleIdentity);

  // continuous scales
  scale$4(Linear, $__namespace.scaleLinear, Continuous);
  scale$4(Log, $__namespace.scaleLog, [Continuous, Log]);
  scale$4(Pow, $__namespace.scalePow, Continuous);
  scale$4(Sqrt, $__namespace.scaleSqrt, Continuous);
  scale$4(Symlog, $__namespace.scaleSymlog, Continuous);
  scale$4(Time, $__namespace.scaleTime, [Continuous, Temporal]);
  scale$4(UTC, $__namespace.scaleUtc, [Continuous, Temporal]);

  // sequential scales
  scale$4(Sequential, $__namespace.scaleSequential, [Continuous, Interpolating]); // backwards compat
  scale$4("".concat(Sequential, "-").concat(Linear), $__namespace.scaleSequential, [Continuous, Interpolating]);
  scale$4("".concat(Sequential, "-").concat(Log), $__namespace.scaleSequentialLog, [Continuous, Interpolating, Log]);
  scale$4("".concat(Sequential, "-").concat(Pow), $__namespace.scaleSequentialPow, [Continuous, Interpolating]);
  scale$4("".concat(Sequential, "-").concat(Sqrt), $__namespace.scaleSequentialSqrt, [Continuous, Interpolating]);
  scale$4("".concat(Sequential, "-").concat(Symlog), $__namespace.scaleSequentialSymlog, [Continuous, Interpolating]);

  // diverging scales
  scale$4("".concat(Diverging, "-").concat(Linear), $__namespace.scaleDiverging, [Continuous, Interpolating]);
  scale$4("".concat(Diverging, "-").concat(Log), $__namespace.scaleDivergingLog, [Continuous, Interpolating, Log]);
  scale$4("".concat(Diverging, "-").concat(Pow), $__namespace.scaleDivergingPow, [Continuous, Interpolating]);
  scale$4("".concat(Diverging, "-").concat(Sqrt), $__namespace.scaleDivergingSqrt, [Continuous, Interpolating]);
  scale$4("".concat(Diverging, "-").concat(Symlog), $__namespace.scaleDivergingSymlog, [Continuous, Interpolating]);

  // discretizing scales
  scale$4(Quantile, $__namespace.scaleQuantile, [Discretizing, Quantile]);
  scale$4(Quantize, $__namespace.scaleQuantize, Discretizing);
  scale$4(Threshold, $__namespace.scaleThreshold, Discretizing);

  // discrete scales
  scale$4(BinOrdinal, scaleBinOrdinal, [Discrete$1, Discretizing]);
  scale$4(Ordinal, $__namespace.scaleOrdinal, Discrete$1);
  scale$4(Band, band, Discrete$1);
  scale$4(Point, point$1, Discrete$1);
  function isValidScaleType(type) {
    return scales.has(type);
  }
  function hasType(key, type) {
    var s = scales.get(key);
    return s && s.metadata[type];
  }
  function isContinuous(key) {
    return hasType(key, Continuous);
  }
  function isDiscrete(key) {
    return hasType(key, Discrete$1);
  }
  function isDiscretizing(key) {
    return hasType(key, Discretizing);
  }
  function isLogarithmic(key) {
    return hasType(key, Log);
  }
  function isTemporal(key) {
    return hasType(key, Temporal);
  }
  function isInterpolating(key) {
    return hasType(key, Interpolating);
  }
  function isQuantile(key) {
    return hasType(key, Quantile);
  }
  var scaleProps = ['clamp', 'base', 'constant', 'exponent'];
  function interpolateRange(interpolator, range) {
    var start = range[0],
      span = peek$1(range) - start;
    return function (i) {
      return interpolator(start + i * span);
    };
  }
  function interpolateColors(colors, type, gamma) {
    return $$1__namespace.piecewise(interpolate(type || 'rgb', gamma), colors);
  }
  function quantizeInterpolator(interpolator, count) {
    var samples = new Array(count),
      n = count + 1;
    for (var i = 0; i < count;) samples[i] = interpolator(++i / n);
    return samples;
  }
  function scaleFraction(scale$1, min, max) {
    var delta = max - min;
    var i, t, s;
    if (!delta || !Number.isFinite(delta)) {
      return constant$1(0.5);
    } else {
      i = (t = scale$1.type).indexOf('-');
      t = i < 0 ? t : t.slice(i + 1);
      s = scale$4(t)().domain([min, max]).range([0, 1]);
      scaleProps.forEach(function (m) {
        return scale$1[m] ? s[m](scale$1[m]()) : 0;
      });
      return s;
    }
  }
  function interpolate(type, gamma) {
    var interp = $$1__namespace[method(type)];
    return gamma != null && interp && interp.gamma ? interp.gamma(gamma) : interp;
  }
  function method(type) {
    return 'interpolate' + type.toLowerCase().split('-').map(function (s) {
      return s[0].toUpperCase() + s.slice(1);
    }).join('');
  }
  var continuous = {
    blues: 'cfe1f2bed8eca8cee58fc1de74b2d75ba3cf4592c63181bd206fb2125ca40a4a90',
    greens: 'd3eecdc0e6baabdda594d3917bc77d60ba6c46ab5e329a512089430e7735036429',
    greys: 'e2e2e2d4d4d4c4c4c4b1b1b19d9d9d8888887575756262624d4d4d3535351e1e1e',
    oranges: 'fdd8b3fdc998fdb87bfda55efc9244f87f2cf06b18e4580bd14904b93d029f3303',
    purples: 'e2e1efd4d4e8c4c5e0b4b3d6a3a0cc928ec3827cb97566ae684ea25c3696501f8c',
    reds: 'fdc9b4fcb49afc9e80fc8767fa7051f6573fec3f2fdc2a25c81b1db21218970b13',
    blueGreen: 'd5efedc1e8e0a7ddd18bd2be70c6a958ba9144ad77319c5d2089460e7736036429',
    bluePurple: 'ccddecbad0e4a8c2dd9ab0d4919cc98d85be8b6db28a55a6873c99822287730f71',
    greenBlue: 'd3eecec5e8c3b1e1bb9bd8bb82cec269c2ca51b2cd3c9fc7288abd1675b10b60a1',
    orangeRed: 'fddcaffdcf9bfdc18afdad77fb9562f67d53ee6545e24932d32d1ebf130da70403',
    purpleBlue: 'dbdaebc8cee4b1c3de97b7d87bacd15b9fc93a90c01e7fb70b70ab056199045281',
    purpleBlueGreen: 'dbd8eac8cee4b0c3de93b7d872acd1549fc83892bb1c88a3097f8702736b016353',
    purpleRed: 'dcc9e2d3b3d7ce9eccd186c0da6bb2e14da0e23189d91e6fc61159ab07498f023a',
    redPurple: 'fccfccfcbec0faa9b8f98faff571a5ec539ddb3695c41b8aa908808d0179700174',
    yellowGreen: 'e4f4acd1eca0b9e2949ed68880c97c62bb6e47aa5e3297502083440e723b036034',
    yellowOrangeBrown: 'feeaa1fedd84fecc63feb746fca031f68921eb7215db5e0bc54c05ab3d038f3204',
    yellowOrangeRed: 'fee087fed16ffebd59fea849fd903efc7335f9522bee3423de1b20ca0b22af0225',
    blueOrange: '134b852f78b35da2cb9dcae1d2e5eff2f0ebfce0bafbbf74e8932fc5690d994a07',
    brownBlueGreen: '704108a0651ac79548e3c78af3e6c6eef1eac9e9e48ed1c74da79e187a72025147',
    purpleGreen: '5b1667834792a67fb6c9aed3e6d6e8eff0efd9efd5aedda971bb75368e490e5e29',
    purpleOrange: '4114696647968f83b7b9b4d6dadbebf3eeeafce0bafbbf74e8932fc5690d994a07',
    redBlue: '8c0d25bf363adf745ef4ae91fbdbc9f2efeed2e5ef9dcae15da2cb2f78b3134b85',
    redGrey: '8c0d25bf363adf745ef4ae91fcdccbfaf4f1e2e2e2c0c0c0969696646464343434',
    yellowGreenBlue: 'eff9bddbf1b4bde5b594d5b969c5be45b4c22c9ec02182b82163aa23479c1c3185',
    redYellowBlue: 'a50026d4322cf16e43fcac64fedd90faf8c1dcf1ecabd6e875abd04a74b4313695',
    redYellowGreen: 'a50026d4322cf16e43fcac63fedd8df9f7aed7ee8ea4d86e64bc6122964f006837',
    pinkYellowGreen: '8e0152c0267edd72adf0b3d6faddedf5f3efe1f2cab6de8780bb474f9125276419',
    spectral: '9e0142d13c4bf0704afcac63fedd8dfbf8b0e0f3a1a9dda269bda94288b55e4fa2',
    viridis: '440154470e61481a6c482575472f7d443a834144873d4e8a39568c35608d31688e2d708e2a788e27818e23888e21918d1f988b1fa08822a8842ab07f35b77943bf7154c56866cc5d7ad1518fd744a5db36bcdf27d2e21be9e51afde725',
    magma: '0000040404130b0924150e3720114b2c11603b0f704a107957157e651a80721f817f24828c29819a2e80a8327db6377ac43c75d1426fde4968e95462f1605df76f5cfa7f5efc8f65fe9f6dfeaf78febf84fece91fddea0fcedaffcfdbf',
    inferno: '0000040403130c0826170c3b240c4f330a5f420a68500d6c5d126e6b176e781c6d86216b932667a12b62ae305cbb3755c73e4cd24644dd513ae65c30ed6925f3771af8850ffb9506fca50afcb519fac62df6d645f2e661f3f484fcffa4',
    plasma: '0d088723069033059742039d5002a25d01a66a00a87801a88405a7900da49c179ea72198b12a90ba3488c33d80cb4779d35171da5a69e16462e76e5bed7953f2834cf68f44fa9a3dfca636fdb32ffec029fcce25f9dc24f5ea27f0f921',
    cividis: '00205100235800265d002961012b65042e670831690d346b11366c16396d1c3c6e213f6e26426e2c456e31476e374a6e3c4d6e42506e47536d4c566d51586e555b6e5a5e6e5e616e62646f66676f6a6a706e6d717270717573727976737c79747f7c75827f758682768985778c8877908b78938e789691789a94789e9778a19b78a59e77a9a177aea575b2a874b6ab73bbaf71c0b26fc5b66dc9b96acebd68d3c065d8c462ddc85fe2cb5ce7cf58ebd355f0d652f3da4ff7de4cfae249fce647',
    rainbow: '6e40aa883eb1a43db3bf3cafd83fa4ee4395fe4b83ff576eff6659ff7847ff8c38f3a130e2b72fcfcc36bee044aff05b8ff4576ff65b52f6673af27828ea8d1ddfa319d0b81cbecb23abd82f96e03d82e14c6edb5a5dd0664dbf6e40aa',
    sinebow: 'ff4040fc582af47218e78d0bd5a703bfbf00a7d5038de70b72f41858fc2a40ff402afc5818f4720be78d03d5a700bfbf03a7d50b8de71872f42a58fc4040ff582afc7218f48d0be7a703d5bf00bfd503a7e70b8df41872fc2a58ff4040',
    turbo: '23171b32204a3e2a71453493493eae4b49c54a53d7485ee44569ee4074f53c7ff8378af93295f72e9ff42ba9ef28b3e926bce125c5d925cdcf27d5c629dcbc2de3b232e9a738ee9d3ff39347f68950f9805afc7765fd6e70fe667cfd5e88fc5795fb51a1f84badf545b9f140c5ec3cd0e637dae034e4d931ecd12ef4c92bfac029ffb626ffad24ffa223ff9821ff8d1fff821dff771cfd6c1af76118f05616e84b14df4111d5380fcb2f0dc0260ab61f07ac1805a313029b0f00950c00910b00',
    browns: 'eedbbdecca96e9b97ae4a865dc9856d18954c7784cc0673fb85536ad44339f3632',
    tealBlues: 'bce4d89dd3d181c3cb65b3c245a2b9368fae347da0306a932c5985',
    teals: 'bbdfdfa2d4d58ac9c975bcbb61b0af4da5a43799982b8b8c1e7f7f127273006667',
    warmGreys: 'dcd4d0cec5c1c0b8b4b3aaa7a59c9998908c8b827f7e7673726866665c5a59504e',
    goldGreen: 'f4d166d5ca60b6c35c98bb597cb25760a6564b9c533f8f4f33834a257740146c36',
    goldOrange: 'f4d166f8be5cf8aa4cf5983bf3852aef701be2621fd65322c54923b142239e3a26',
    goldRed: 'f4d166f6be59f9aa51fc964ef6834bee734ae56249db5247cf4244c43141b71d3e',
    lightGreyRed: 'efe9e6e1dad7d5cbc8c8bdb9bbaea9cd967ddc7b43e15f19df4011dc000b',
    lightGreyTeal: 'e4eaead6dcddc8ced2b7c2c7a6b4bc64b0bf22a6c32295c11f85be1876bc',
    lightMulti: 'e0f1f2c4e9d0b0de9fd0e181f6e072f6c053f3993ef77440ef4a3c',
    lightOrange: 'f2e7daf7d5baf9c499fab184fa9c73f68967ef7860e8645bde515bd43d5b',
    lightTealBlue: 'e3e9e0c0dccf9aceca7abfc859afc0389fb9328dad2f7ca0276b95255988',
    darkBlue: '3232322d46681a5c930074af008cbf05a7ce25c0dd38daed50f3faffffff',
    darkGold: '3c3c3c584b37725e348c7631ae8b2bcfa424ecc31ef9de30fff184ffffff',
    darkGreen: '3a3a3a215748006f4d048942489e4276b340a6c63dd2d836ffeb2cffffaa',
    darkMulti: '3737371f5287197d8c29a86995ce3fffe800ffffff',
    darkRed: '3434347036339e3c38cc4037e75d1eec8620eeab29f0ce32ffeb2c'
  };
  var discrete = {
    category10: '1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf',
    category20: '1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5',
    category20b: '393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6',
    category20c: '3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9',
    tableau10: '4c78a8f58518e4575672b7b254a24beeca3bb279a2ff9da69d755dbab0ac',
    tableau20: '4c78a89ecae9f58518ffbf7954a24b88d27ab79a20f2cf5b43989483bcb6e45756ff9d9879706ebab0acd67195fcbfd2b279a2d6a5c99e765fd8b5a5',
    accent: '7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666',
    dark2: '1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666',
    paired: 'a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928',
    pastel1: 'fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2',
    pastel2: 'b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc',
    set1: 'e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999',
    set2: '66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3',
    set3: '8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f'
  };
  function colors(palette) {
    var n = palette.length / 6 | 0,
      c = new Array(n);
    for (var i = 0; i < n;) {
      c[i] = '#' + palette.slice(i * 6, ++i * 6);
    }
    return c;
  }
  function apply(_, f) {
    for (var k in _) scheme(k, f(_[k]));
  }
  var schemes = {};
  apply(discrete, colors);
  apply(continuous, function (_) {
    return interpolateColors(colors(_));
  });
  function scheme(name, scheme) {
    name = name && name.toLowerCase();
    if (arguments.length > 1) {
      schemes[name] = scheme;
      return this;
    } else {
      return schemes[name];
    }
  }
  var SymbolLegend = 'symbol';
  var DiscreteLegend = 'discrete';
  var GradientLegend = 'gradient';
  var defaultFormatter = function defaultFormatter(value) {
    return isArray(value) ? value.map(function (v) {
      return String(v);
    }) : String(value);
  };
  var ascending = function ascending(a, b) {
    return a[1] - b[1];
  };
  var descending = function descending(a, b) {
    return b[1] - a[1];
  };

  /**
   * Determine the tick count or interval function.
   * @param {Scale} scale - The scale for which to generate tick values.
   * @param {*} count - The desired tick count or interval specifier.
   * @param {number} minStep - The desired minimum step between tick values.
   * @return {*} - The tick count or interval function.
   */
  function tickCount(scale, count, minStep) {
    var step;
    if (isNumber$1(count)) {
      if (scale.bins) {
        count = Math.max(count, scale.bins.length);
      }
      if (minStep != null) {
        count = Math.min(count, Math.floor(span(scale.domain()) / minStep || 1));
      }
    }
    if (isObject(count)) {
      step = count.step;
      count = count.interval;
    }
    if (isString(count)) {
      count = scale.type === Time ? timeInterval(count) : scale.type == UTC ? utcInterval(count) : error('Only time and utc scales accept interval strings.');
      if (step) count = count.every(step);
    }
    return count;
  }

  /**
   * Filter a set of candidate tick values, ensuring that only tick values
   * that lie within the scale range are included.
   * @param {Scale} scale - The scale for which to generate tick values.
   * @param {Array<*>} ticks - The candidate tick values.
   * @param {*} count - The tick count or interval function.
   * @return {Array<*>} - The filtered tick values.
   */
  function validTicks(scale, ticks, count) {
    var range = scale.range(),
      lo = range[0],
      hi = peek$1(range),
      cmp = ascending;
    if (lo > hi) {
      range = hi;
      hi = lo;
      lo = range;
      cmp = descending;
    }
    lo = Math.floor(lo);
    hi = Math.ceil(hi);

    // filter ticks to valid values within the range
    // additionally sort ticks in range order (#2579)
    ticks = ticks.map(function (v) {
      return [v, scale(v)];
    }).filter(function (_) {
      return lo <= _[1] && _[1] <= hi;
    }).sort(cmp).map(function (_) {
      return _[0];
    });
    if (count > 0 && ticks.length > 1) {
      var endpoints = [ticks[0], peek$1(ticks)];
      while (ticks.length > count && ticks.length >= 3) {
        ticks = ticks.filter(function (_, i) {
          return !(i % 2);
        });
      }
      if (ticks.length < 3) {
        ticks = endpoints;
      }
    }
    return ticks;
  }

  /**
   * Generate tick values for the given scale and approximate tick count or
   * interval value. If the scale has a 'ticks' method, it will be used to
   * generate the ticks, with the count argument passed as a parameter. If the
   * scale lacks a 'ticks' method, the full scale domain will be returned.
   * @param {Scale} scale - The scale for which to generate tick values.
   * @param {*} [count] - The approximate number of desired ticks.
   * @return {Array<*>} - The generated tick values.
   */
  function tickValues(scale, count) {
    return scale.bins ? validTicks(scale, scale.bins) : scale.ticks ? scale.ticks(count) : scale.domain();
  }

  /**
   * Generate a label format function for a scale. If the scale has a
   * 'tickFormat' method, it will be used to generate the formatter, with the
   * count and specifier arguments passed as parameters. If the scale lacks a
   * 'tickFormat' method, the returned formatter performs simple string coercion.
   * If the input scale is a logarithmic scale and the format specifier does not
   * indicate a desired decimal precision, a special variable precision formatter
   * that automatically trims trailing zeroes will be generated.
   * @param {Scale} scale - The scale for which to generate the label formatter.
   * @param {*} [count] - The approximate number of desired ticks.
   * @param {string} [specifier] - The format specifier. Must be a legal d3
   *   specifier string (see https://github.com/d3/d3-format#formatSpecifier) or
   *   time multi-format specifier object.
   * @return {function(*):string} - The generated label formatter.
   */
  function tickFormat(locale, scale, count, specifier, formatType, noSkip) {
    var type = scale.type;
    var format = defaultFormatter;
    if (type === Time || formatType === Time) {
      format = locale.timeFormat(specifier);
    } else if (type === UTC || formatType === UTC) {
      format = locale.utcFormat(specifier);
    } else if (isLogarithmic(type)) {
      var varfmt = locale.formatFloat(specifier);
      if (noSkip || scale.bins) {
        format = varfmt;
      } else {
        var test = tickLog(scale, count, false);
        format = function format(_) {
          return test(_) ? varfmt(_) : '';
        };
      }
    } else if (scale.tickFormat) {
      // if d3 scale has tickFormat, it must be continuous
      var d = scale.domain();
      format = locale.formatSpan(d[0], d[d.length - 1], count, specifier);
    } else if (specifier) {
      format = locale.format(specifier);
    }
    return format;
  }
  function tickLog(scale, count, values) {
    var ticks = tickValues(scale, count),
      base = scale.base(),
      logb = Math.log(base),
      k = Math.max(1, base * count / ticks.length);

    // apply d3-scale's log format filter criteria
    var test = function test(d) {
      var i = d / Math.pow(base, Math.round(Math.log(d) / logb));
      if (i * base < base - 0.5) i *= base;
      return i <= k;
    };
    return values ? ticks.filter(test) : test;
  }
  var symbols$1 = (_symbols = {}, _defineProperty(_symbols, Quantile, 'quantiles'), _defineProperty(_symbols, Quantize, 'thresholds'), _defineProperty(_symbols, Threshold, 'domain'), _symbols);
  var formats = (_formats = {}, _defineProperty(_formats, Quantile, 'quantiles'), _defineProperty(_formats, Quantize, 'domain'), _formats);
  function labelValues(scale, count) {
    return scale.bins ? binValues(scale.bins) : scale.type === Log ? tickLog(scale, count, true) : symbols$1[scale.type] ? thresholdValues(scale[symbols$1[scale.type]]()) : tickValues(scale, count);
  }
  function thresholdFormat(locale, scale, specifier) {
    var _ = scale[formats[scale.type]](),
      n = _.length;
    var d = n > 1 ? _[1] - _[0] : _[0],
      i;
    for (i = 1; i < n; ++i) {
      d = Math.min(d, _[i] - _[i - 1]);
    }

    // tickCount = 3 ticks times 10 for increased resolution
    return locale.formatSpan(0, d, 3 * 10, specifier);
  }
  function thresholdValues(thresholds) {
    var values = [-Infinity].concat(thresholds);
    values.max = +Infinity;
    return values;
  }
  function binValues(bins) {
    var values = bins.slice(0, -1);
    values.max = peek$1(bins);
    return values;
  }
  var isDiscreteRange = function isDiscreteRange(scale) {
    return symbols$1[scale.type] || scale.bins;
  };
  function labelFormat(locale, scale, count, type, specifier, formatType, noSkip) {
    var format = formats[scale.type] && formatType !== Time && formatType !== UTC ? thresholdFormat(locale, scale, specifier) : tickFormat(locale, scale, count, specifier, formatType, noSkip);
    return type === SymbolLegend && isDiscreteRange(scale) ? formatRange(format) : type === DiscreteLegend ? formatDiscrete(format) : formatPoint(format);
  }
  var formatRange = function formatRange(format) {
    return function (value, index, array) {
      var limit = get$2(array[index + 1], get$2(array.max, +Infinity)),
        lo = formatValue$1(value, format),
        hi = formatValue$1(limit, format);
      return lo && hi ? lo + " \u2013 " + hi : hi ? '< ' + hi : "\u2265 " + lo;
    };
  };
  var get$2 = function get(value, dflt) {
    return value != null ? value : dflt;
  };
  var formatDiscrete = function formatDiscrete(format) {
    return function (value, index) {
      return index ? format(value) : null;
    };
  };
  var formatPoint = function formatPoint(format) {
    return function (value) {
      return format(value);
    };
  };
  var formatValue$1 = function formatValue(value, format) {
    return Number.isFinite(value) ? format(value) : null;
  };
  function labelFraction(scale) {
    var domain = scale.domain(),
      count = domain.length - 1;
    var lo = +domain[0],
      hi = +peek$1(domain),
      span = hi - lo;
    if (scale.type === Threshold) {
      var adjust = count ? span / count : 0.1;
      lo -= adjust;
      hi += adjust;
      span = hi - lo;
    }
    return function (value) {
      return (value - lo) / span;
    };
  }
  function format$1(locale, scale, specifier, formatType) {
    var type = formatType || scale.type;

    // replace abbreviated time specifiers to improve screen reader experience
    if (isString(specifier) && isTemporal(type)) {
      specifier = specifier.replace(/%a/g, '%A').replace(/%b/g, '%B');
    }
    return !specifier && type === Time ? locale.timeFormat('%A, %d %B %Y, %X') : !specifier && type === UTC ? locale.utcFormat('%A, %d %B %Y, %X UTC') : labelFormat(locale, scale, 5, null, specifier, formatType, true);
  }
  function domainCaption(locale, scale, opt) {
    opt = opt || {};
    var max = Math.max(3, opt.maxlen || 7),
      fmt = format$1(locale, scale, opt.format, opt.formatType);

    // if scale breaks domain into bins, describe boundaries
    if (isDiscretizing(scale.type)) {
      var v = labelValues(scale).slice(1).map(fmt),
        n = v.length;
      return "".concat(n, " boundar").concat(n === 1 ? 'y' : 'ies', ": ").concat(v.join(', '));
    }

    // if scale domain is discrete, list values
    else if (isDiscrete(scale.type)) {
      var d = scale.domain(),
        _n = d.length,
        _v = _n > max ? d.slice(0, max - 2).map(fmt).join(', ') + ', ending with ' + d.slice(-1).map(fmt) : d.map(fmt).join(', ');
      return "".concat(_n, " value").concat(_n === 1 ? '' : 's', ": ").concat(_v);
    }

    // if scale domain is continuous, describe value range
    else {
      var _d = scale.domain();
      return "values from ".concat(fmt(_d[0]), " to ").concat(fmt(peek$1(_d)));
    }
  }

  var gradient_id = 0;
  function resetSVGGradientId() {
    gradient_id = 0;
  }
  var patternPrefix = 'p_';
  function isGradient(value) {
    return value && value.gradient;
  }
  function gradientRef(g, defs, base) {
    var type = g.gradient;
    var id = g.id,
      prefix = type === 'radial' ? patternPrefix : '';

    // check id, assign default values as needed
    if (!id) {
      id = g.id = 'gradient_' + gradient_id++;
      if (type === 'radial') {
        g.x1 = get$1(g.x1, 0.5);
        g.y1 = get$1(g.y1, 0.5);
        g.r1 = get$1(g.r1, 0);
        g.x2 = get$1(g.x2, 0.5);
        g.y2 = get$1(g.y2, 0.5);
        g.r2 = get$1(g.r2, 0.5);
        prefix = patternPrefix;
      } else {
        g.x1 = get$1(g.x1, 0);
        g.y1 = get$1(g.y1, 0);
        g.x2 = get$1(g.x2, 1);
        g.y2 = get$1(g.y2, 0);
      }
    }

    // register definition
    defs[id] = g;

    // return url reference
    return 'url(' + (base || '') + '#' + prefix + id + ')';
  }
  function get$1(val, def) {
    return val != null ? val : def;
  }
  function Gradient$1(p0, p1) {
    var stops = [],
      gradient;
    return gradient = {
      gradient: 'linear',
      x1: p0 ? p0[0] : 0,
      y1: p0 ? p0[1] : 0,
      x2: p1 ? p1[0] : 1,
      y2: p1 ? p1[1] : 0,
      stops: stops,
      stop: function stop(offset, color) {
        stops.push({
          offset: offset,
          color: color
        });
        return gradient;
      }
    };
  }
  var lookup$4 = {
    'basis': {
      curve: d3Shape.curveBasis
    },
    'basis-closed': {
      curve: d3Shape.curveBasisClosed
    },
    'basis-open': {
      curve: d3Shape.curveBasisOpen
    },
    'bundle': {
      curve: d3Shape.curveBundle,
      tension: 'beta',
      value: 0.85
    },
    'cardinal': {
      curve: d3Shape.curveCardinal,
      tension: 'tension',
      value: 0
    },
    'cardinal-open': {
      curve: d3Shape.curveCardinalOpen,
      tension: 'tension',
      value: 0
    },
    'cardinal-closed': {
      curve: d3Shape.curveCardinalClosed,
      tension: 'tension',
      value: 0
    },
    'catmull-rom': {
      curve: d3Shape.curveCatmullRom,
      tension: 'alpha',
      value: 0.5
    },
    'catmull-rom-closed': {
      curve: d3Shape.curveCatmullRomClosed,
      tension: 'alpha',
      value: 0.5
    },
    'catmull-rom-open': {
      curve: d3Shape.curveCatmullRomOpen,
      tension: 'alpha',
      value: 0.5
    },
    'linear': {
      curve: d3Shape.curveLinear
    },
    'linear-closed': {
      curve: d3Shape.curveLinearClosed
    },
    'monotone': {
      horizontal: d3Shape.curveMonotoneY,
      vertical: d3Shape.curveMonotoneX
    },
    'natural': {
      curve: d3Shape.curveNatural
    },
    'step': {
      curve: d3Shape.curveStep
    },
    'step-after': {
      curve: d3Shape.curveStepAfter
    },
    'step-before': {
      curve: d3Shape.curveStepBefore
    }
  };
  function curves(type, orientation, tension) {
    var entry = _has(lookup$4, type) && lookup$4[type],
      curve = null;
    if (entry) {
      curve = entry.curve || entry[orientation || 'vertical'];
      if (entry.tension && tension != null) {
        curve = curve[entry.tension](tension);
      }
    }
    return curve;
  }
  var paramCounts = {
    m: 2,
    l: 2,
    h: 1,
    v: 1,
    z: 0,
    c: 6,
    s: 4,
    q: 4,
    t: 2,
    a: 7
  };
  var commandPattern = /[mlhvzcsqta]([^mlhvzcsqta]+|$)/gi;
  var numberPattern = /^[+-]?(([0-9]*\.[0-9]+)|([0-9]+\.)|([0-9]+))([eE][+-]?[0-9]+)?/;
  var spacePattern = /^((\s+,?\s*)|(,\s*))/;
  var flagPattern = /^[01]/;
  function parse$3(path) {
    var commands = [];
    var matches = path.match(commandPattern) || [];
    matches.forEach(function (str) {
      var cmd = str[0];
      var type = cmd.toLowerCase();

      // parse parameters
      var paramCount = paramCounts[type];
      var params = parseParams(type, paramCount, str.slice(1).trim());
      var count = params.length;

      // error checking based on parameter count
      if (count < paramCount || count && count % paramCount !== 0) {
        throw Error('Invalid SVG path, incorrect parameter count');
      }

      // register the command
      commands.push([cmd].concat(_toConsumableArray(params.slice(0, paramCount))));

      // exit now if we're done, also handles zero-param 'z'
      if (count === paramCount) {
        return;
      }

      // handle implicit line-to
      if (type === 'm') {
        cmd = cmd === 'M' ? 'L' : 'l';
      }

      // repeat command when given extended param list
      for (var i = paramCount; i < count; i += paramCount) {
        commands.push([cmd].concat(_toConsumableArray(params.slice(i, i + paramCount))));
      }
    });
    return commands;
  }
  function parseParams(type, paramCount, segment) {
    var params = [];
    for (var index = 0; paramCount && index < segment.length;) {
      for (var i = 0; i < paramCount; ++i) {
        var pattern = type === 'a' && (i === 3 || i === 4) ? flagPattern : numberPattern;
        var match = segment.slice(index).match(pattern);
        if (match === null) {
          throw Error('Invalid SVG path, incorrect parameter type');
        }
        index += match[0].length;
        params.push(+match[0]);
        var ws = segment.slice(index).match(spacePattern);
        if (ws !== null) {
          index += ws[0].length;
        }
      }
    }
    return params;
  }
  var DegToRad = Math.PI / 180;
  var Epsilon = 1e-14;
  var HalfPi = Math.PI / 2;
  var Tau = Math.PI * 2;
  var HalfSqrt3 = Math.sqrt(3) / 2;
  var segmentCache = {};
  var bezierCache = {};
  var join$1 = [].join;

  // Copied from Inkscape svgtopdf, thanks!
  function segments(x, y, rx, ry, large, sweep, rotateX, ox, oy) {
    var key = join$1.call(arguments);
    if (segmentCache[key]) {
      return segmentCache[key];
    }
    var th = rotateX * DegToRad;
    var sin_th = Math.sin(th);
    var cos_th = Math.cos(th);
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    var px = cos_th * (ox - x) * 0.5 + sin_th * (oy - y) * 0.5;
    var py = cos_th * (oy - y) * 0.5 - sin_th * (ox - x) * 0.5;
    var pl = px * px / (rx * rx) + py * py / (ry * ry);
    if (pl > 1) {
      pl = Math.sqrt(pl);
      rx *= pl;
      ry *= pl;
    }
    var a00 = cos_th / rx;
    var a01 = sin_th / rx;
    var a10 = -sin_th / ry;
    var a11 = cos_th / ry;
    var x0 = a00 * ox + a01 * oy;
    var y0 = a10 * ox + a11 * oy;
    var x1 = a00 * x + a01 * y;
    var y1 = a10 * x + a11 * y;
    var d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    var sfactor_sq = 1 / d - 0.25;
    if (sfactor_sq < 0) sfactor_sq = 0;
    var sfactor = Math.sqrt(sfactor_sq);
    if (sweep == large) sfactor = -sfactor;
    var xc = 0.5 * (x0 + x1) - sfactor * (y1 - y0);
    var yc = 0.5 * (y0 + y1) + sfactor * (x1 - x0);
    var th0 = Math.atan2(y0 - yc, x0 - xc);
    var th1 = Math.atan2(y1 - yc, x1 - xc);
    var th_arc = th1 - th0;
    if (th_arc < 0 && sweep === 1) {
      th_arc += Tau;
    } else if (th_arc > 0 && sweep === 0) {
      th_arc -= Tau;
    }
    var segs = Math.ceil(Math.abs(th_arc / (HalfPi + 0.001)));
    var result = [];
    for (var i = 0; i < segs; ++i) {
      var th2 = th0 + i * th_arc / segs;
      var th3 = th0 + (i + 1) * th_arc / segs;
      result[i] = [xc, yc, th2, th3, rx, ry, sin_th, cos_th];
    }
    return segmentCache[key] = result;
  }
  function bezier(params) {
    var key = join$1.call(params);
    if (bezierCache[key]) {
      return bezierCache[key];
    }
    var cx = params[0],
      cy = params[1],
      th0 = params[2],
      th1 = params[3],
      rx = params[4],
      ry = params[5],
      sin_th = params[6],
      cos_th = params[7];
    var a00 = cos_th * rx;
    var a01 = -sin_th * ry;
    var a10 = sin_th * rx;
    var a11 = cos_th * ry;
    var cos_th0 = Math.cos(th0);
    var sin_th0 = Math.sin(th0);
    var cos_th1 = Math.cos(th1);
    var sin_th1 = Math.sin(th1);
    var th_half = 0.5 * (th1 - th0);
    var sin_th_h2 = Math.sin(th_half * 0.5);
    var t = 8 / 3 * sin_th_h2 * sin_th_h2 / Math.sin(th_half);
    var x1 = cx + cos_th0 - t * sin_th0;
    var y1 = cy + sin_th0 + t * cos_th0;
    var x3 = cx + cos_th1;
    var y3 = cy + sin_th1;
    var x2 = x3 + t * sin_th1;
    var y2 = y3 - t * cos_th1;
    return bezierCache[key] = [a00 * x1 + a01 * y1, a10 * x1 + a11 * y1, a00 * x2 + a01 * y2, a10 * x2 + a11 * y2, a00 * x3 + a01 * y3, a10 * x3 + a11 * y3];
  }
  var temp = ['l', 0, 0, 0, 0, 0, 0, 0];
  function scale$1$1(current, sX, sY) {
    var c = temp[0] = current[0];
    if (c === 'a' || c === 'A') {
      temp[1] = sX * current[1];
      temp[2] = sY * current[2];
      temp[3] = current[3];
      temp[4] = current[4];
      temp[5] = current[5];
      temp[6] = sX * current[6];
      temp[7] = sY * current[7];
    } else if (c === 'h' || c === 'H') {
      temp[1] = sX * current[1];
    } else if (c === 'v' || c === 'V') {
      temp[1] = sY * current[1];
    } else {
      for (var i = 1, n = current.length; i < n; ++i) {
        temp[i] = (i % 2 == 1 ? sX : sY) * current[i];
      }
    }
    return temp;
  }
  function pathRender(context, path, l, t, sX, sY) {
    var current,
      // current instruction
      previous = null,
      x = 0,
      // current x
      y = 0,
      // current y
      controlX = 0,
      // current control point x
      controlY = 0,
      // current control point y
      tempX,
      tempY,
      tempControlX,
      tempControlY,
      anchorX = 0,
      anchorY = 0;
    if (l == null) l = 0;
    if (t == null) t = 0;
    if (sX == null) sX = 1;
    if (sY == null) sY = sX;
    if (context.beginPath) context.beginPath();
    for (var i = 0, len = path.length; i < len; ++i) {
      current = path[i];
      if (sX !== 1 || sY !== 1) {
        current = scale$1$1(current, sX, sY);
      }
      switch (current[0]) {
        // first letter

        case 'l':
          // lineto, relative
          x += current[1];
          y += current[2];
          context.lineTo(x + l, y + t);
          break;
        case 'L':
          // lineto, absolute
          x = current[1];
          y = current[2];
          context.lineTo(x + l, y + t);
          break;
        case 'h':
          // horizontal lineto, relative
          x += current[1];
          context.lineTo(x + l, y + t);
          break;
        case 'H':
          // horizontal lineto, absolute
          x = current[1];
          context.lineTo(x + l, y + t);
          break;
        case 'v':
          // vertical lineto, relative
          y += current[1];
          context.lineTo(x + l, y + t);
          break;
        case 'V':
          // verical lineto, absolute
          y = current[1];
          context.lineTo(x + l, y + t);
          break;
        case 'm':
          // moveTo, relative
          x += current[1];
          y += current[2];
          anchorX = x;
          anchorY = y;
          context.moveTo(x + l, y + t);
          break;
        case 'M':
          // moveTo, absolute
          x = current[1];
          y = current[2];
          anchorX = x;
          anchorY = y;
          context.moveTo(x + l, y + t);
          break;
        case 'c':
          // bezierCurveTo, relative
          tempX = x + current[5];
          tempY = y + current[6];
          controlX = x + current[3];
          controlY = y + current[4];
          context.bezierCurveTo(x + current[1] + l,
          // x1
          y + current[2] + t,
          // y1
          controlX + l,
          // x2
          controlY + t,
          // y2
          tempX + l, tempY + t);
          x = tempX;
          y = tempY;
          break;
        case 'C':
          // bezierCurveTo, absolute
          x = current[5];
          y = current[6];
          controlX = current[3];
          controlY = current[4];
          context.bezierCurveTo(current[1] + l, current[2] + t, controlX + l, controlY + t, x + l, y + t);
          break;
        case 's':
          // shorthand cubic bezierCurveTo, relative
          // transform to absolute x,y
          tempX = x + current[3];
          tempY = y + current[4];
          // calculate reflection of previous control points
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
          context.bezierCurveTo(controlX + l, controlY + t, x + current[1] + l, y + current[2] + t, tempX + l, tempY + t);

          // set control point to 2nd one of this command
          // the first control point is assumed to be the reflection of
          // the second control point on the previous command relative
          // to the current point.
          controlX = x + current[1];
          controlY = y + current[2];
          x = tempX;
          y = tempY;
          break;
        case 'S':
          // shorthand cubic bezierCurveTo, absolute
          tempX = current[3];
          tempY = current[4];
          // calculate reflection of previous control points
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
          context.bezierCurveTo(controlX + l, controlY + t, current[1] + l, current[2] + t, tempX + l, tempY + t);
          x = tempX;
          y = tempY;
          // set control point to 2nd one of this command
          // the first control point is assumed to be the reflection of
          // the second control point on the previous command relative
          // to the current point.
          controlX = current[1];
          controlY = current[2];
          break;
        case 'q':
          // quadraticCurveTo, relative
          // transform to absolute x,y
          tempX = x + current[3];
          tempY = y + current[4];
          controlX = x + current[1];
          controlY = y + current[2];
          context.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
          x = tempX;
          y = tempY;
          break;
        case 'Q':
          // quadraticCurveTo, absolute
          tempX = current[3];
          tempY = current[4];
          context.quadraticCurveTo(current[1] + l, current[2] + t, tempX + l, tempY + t);
          x = tempX;
          y = tempY;
          controlX = current[1];
          controlY = current[2];
          break;
        case 't':
          // shorthand quadraticCurveTo, relative

          // transform to absolute x,y
          tempX = x + current[1];
          tempY = y + current[2];
          if (previous[0].match(/[QqTt]/) === null) {
            // If there is no previous command or if the previous command was not a Q, q, T or t,
            // assume the control point is coincident with the current point
            controlX = x;
            controlY = y;
          } else if (previous[0] === 't') {
            // calculate reflection of previous control points for t
            controlX = 2 * x - tempControlX;
            controlY = 2 * y - tempControlY;
          } else if (previous[0] === 'q') {
            // calculate reflection of previous control points for q
            controlX = 2 * x - controlX;
            controlY = 2 * y - controlY;
          }
          tempControlX = controlX;
          tempControlY = controlY;
          context.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
          x = tempX;
          y = tempY;
          controlX = x + current[1];
          controlY = y + current[2];
          break;
        case 'T':
          tempX = current[1];
          tempY = current[2];

          // calculate reflection of previous control points
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
          context.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
          x = tempX;
          y = tempY;
          break;
        case 'a':
          drawArc(context, x + l, y + t, [current[1], current[2], current[3], current[4], current[5], current[6] + x + l, current[7] + y + t]);
          x += current[6];
          y += current[7];
          break;
        case 'A':
          drawArc(context, x + l, y + t, [current[1], current[2], current[3], current[4], current[5], current[6] + l, current[7] + t]);
          x = current[6];
          y = current[7];
          break;
        case 'z':
        case 'Z':
          x = anchorX;
          y = anchorY;
          context.closePath();
          break;
      }
      previous = current;
    }
  }
  function drawArc(context, x, y, coords) {
    var seg = segments(coords[5],
    // end x
    coords[6],
    // end y
    coords[0],
    // radius x
    coords[1],
    // radius y
    coords[3],
    // large flag
    coords[4],
    // sweep flag
    coords[2],
    // rotation
    x, y);
    for (var i = 0; i < seg.length; ++i) {
      var bez = bezier(seg[i]);
      context.bezierCurveTo(bez[0], bez[1], bez[2], bez[3], bez[4], bez[5]);
    }
  }
  var Tan30 = 0.5773502691896257;
  var builtins = {
    'circle': {
      draw: function draw(context, size) {
        var r = Math.sqrt(size) / 2;
        context.moveTo(r, 0);
        context.arc(0, 0, r, 0, Tau);
      }
    },
    'cross': {
      draw: function draw(context, size) {
        var r = Math.sqrt(size) / 2,
          s = r / 2.5;
        context.moveTo(-r, -s);
        context.lineTo(-r, s);
        context.lineTo(-s, s);
        context.lineTo(-s, r);
        context.lineTo(s, r);
        context.lineTo(s, s);
        context.lineTo(r, s);
        context.lineTo(r, -s);
        context.lineTo(s, -s);
        context.lineTo(s, -r);
        context.lineTo(-s, -r);
        context.lineTo(-s, -s);
        context.closePath();
      }
    },
    'diamond': {
      draw: function draw(context, size) {
        var r = Math.sqrt(size) / 2;
        context.moveTo(-r, 0);
        context.lineTo(0, -r);
        context.lineTo(r, 0);
        context.lineTo(0, r);
        context.closePath();
      }
    },
    'square': {
      draw: function draw(context, size) {
        var w = Math.sqrt(size),
          x = -w / 2;
        context.rect(x, x, w, w);
      }
    },
    'arrow': {
      draw: function draw(context, size) {
        var r = Math.sqrt(size) / 2,
          s = r / 7,
          t = r / 2.5,
          v = r / 8;
        context.moveTo(-s, r);
        context.lineTo(s, r);
        context.lineTo(s, -v);
        context.lineTo(t, -v);
        context.lineTo(0, -r);
        context.lineTo(-t, -v);
        context.lineTo(-s, -v);
        context.closePath();
      }
    },
    'wedge': {
      draw: function draw(context, size) {
        var r = Math.sqrt(size) / 2,
          h = HalfSqrt3 * r,
          o = h - r * Tan30,
          b = r / 4;
        context.moveTo(0, -h - o);
        context.lineTo(-b, h - o);
        context.lineTo(b, h - o);
        context.closePath();
      }
    },
    'triangle': {
      draw: function draw(context, size) {
        var r = Math.sqrt(size) / 2,
          h = HalfSqrt3 * r,
          o = h - r * Tan30;
        context.moveTo(0, -h - o);
        context.lineTo(-r, h - o);
        context.lineTo(r, h - o);
        context.closePath();
      }
    },
    'triangle-up': {
      draw: function draw(context, size) {
        var r = Math.sqrt(size) / 2,
          h = HalfSqrt3 * r;
        context.moveTo(0, -h);
        context.lineTo(-r, h);
        context.lineTo(r, h);
        context.closePath();
      }
    },
    'triangle-down': {
      draw: function draw(context, size) {
        var r = Math.sqrt(size) / 2,
          h = HalfSqrt3 * r;
        context.moveTo(0, h);
        context.lineTo(-r, -h);
        context.lineTo(r, -h);
        context.closePath();
      }
    },
    'triangle-right': {
      draw: function draw(context, size) {
        var r = Math.sqrt(size) / 2,
          h = HalfSqrt3 * r;
        context.moveTo(h, 0);
        context.lineTo(-h, -r);
        context.lineTo(-h, r);
        context.closePath();
      }
    },
    'triangle-left': {
      draw: function draw(context, size) {
        var r = Math.sqrt(size) / 2,
          h = HalfSqrt3 * r;
        context.moveTo(-h, 0);
        context.lineTo(h, -r);
        context.lineTo(h, r);
        context.closePath();
      }
    },
    'stroke': {
      draw: function draw(context, size) {
        var r = Math.sqrt(size) / 2;
        context.moveTo(-r, 0);
        context.lineTo(r, 0);
      }
    }
  };
  function symbols(_) {
    return _has(builtins, _) ? builtins[_] : customSymbol(_);
  }
  var custom = {};
  function customSymbol(path) {
    if (!_has(custom, path)) {
      var parsed = parse$3(path);
      custom[path] = {
        draw: function draw(context, size) {
          pathRender(context, parsed, 0, 0, Math.sqrt(size) / 2);
        }
      };
    }
    return custom[path];
  }

  // See http://spencermortensen.com/articles/bezier-circle/
  var C = 0.448084975506; // C = 1 - c

  function rectangleX(d) {
    return d.x;
  }
  function rectangleY(d) {
    return d.y;
  }
  function rectangleWidth(d) {
    return d.width;
  }
  function rectangleHeight(d) {
    return d.height;
  }
  function number$3(_) {
    return typeof _ === 'function' ? _ : function () {
      return +_;
    };
  }
  function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }
  function vg_rect() {
    var x = rectangleX,
      y = rectangleY,
      width = rectangleWidth,
      height = rectangleHeight,
      crTL = number$3(0),
      crTR = crTL,
      crBL = crTL,
      crBR = crTL,
      context = null;
    function rectangle(_, x0, y0) {
      var buffer,
        x1 = x0 != null ? x0 : +x.call(this, _),
        y1 = y0 != null ? y0 : +y.call(this, _),
        w = +width.call(this, _),
        h = +height.call(this, _),
        s = Math.min(w, h) / 2,
        tl = clamp(+crTL.call(this, _), 0, s),
        tr = clamp(+crTR.call(this, _), 0, s),
        bl = clamp(+crBL.call(this, _), 0, s),
        br = clamp(+crBR.call(this, _), 0, s);
      if (!context) context = buffer = d3Path.path();
      if (tl <= 0 && tr <= 0 && bl <= 0 && br <= 0) {
        context.rect(x1, y1, w, h);
      } else {
        var x2 = x1 + w,
          y2 = y1 + h;
        context.moveTo(x1 + tl, y1);
        context.lineTo(x2 - tr, y1);
        context.bezierCurveTo(x2 - C * tr, y1, x2, y1 + C * tr, x2, y1 + tr);
        context.lineTo(x2, y2 - br);
        context.bezierCurveTo(x2, y2 - C * br, x2 - C * br, y2, x2 - br, y2);
        context.lineTo(x1 + bl, y2);
        context.bezierCurveTo(x1 + C * bl, y2, x1, y2 - C * bl, x1, y2 - bl);
        context.lineTo(x1, y1 + tl);
        context.bezierCurveTo(x1, y1 + C * tl, x1 + C * tl, y1, x1 + tl, y1);
        context.closePath();
      }
      if (buffer) {
        context = null;
        return buffer + '' || null;
      }
    }
    rectangle.x = function (_) {
      if (arguments.length) {
        x = number$3(_);
        return rectangle;
      } else {
        return x;
      }
    };
    rectangle.y = function (_) {
      if (arguments.length) {
        y = number$3(_);
        return rectangle;
      } else {
        return y;
      }
    };
    rectangle.width = function (_) {
      if (arguments.length) {
        width = number$3(_);
        return rectangle;
      } else {
        return width;
      }
    };
    rectangle.height = function (_) {
      if (arguments.length) {
        height = number$3(_);
        return rectangle;
      } else {
        return height;
      }
    };
    rectangle.cornerRadius = function (tl, tr, br, bl) {
      if (arguments.length) {
        crTL = number$3(tl);
        crTR = tr != null ? number$3(tr) : crTL;
        crBR = br != null ? number$3(br) : crTL;
        crBL = bl != null ? number$3(bl) : crTR;
        return rectangle;
      } else {
        return crTL;
      }
    };
    rectangle.context = function (_) {
      if (arguments.length) {
        context = _ == null ? null : _;
        return rectangle;
      } else {
        return context;
      }
    };
    return rectangle;
  }
  function vg_trail() {
    var x,
      y,
      size,
      defined,
      context = null,
      ready,
      x1,
      y1,
      r1;
    function point(x2, y2, w2) {
      var r2 = w2 / 2;
      if (ready) {
        var ux = y1 - y2,
          uy = x2 - x1;
        if (ux || uy) {
          // get normal vector
          var ud = Math.hypot(ux, uy),
            rx = (ux /= ud) * r1,
            ry = (uy /= ud) * r1,
            t = Math.atan2(uy, ux);

          // draw segment
          context.moveTo(x1 - rx, y1 - ry);
          context.lineTo(x2 - ux * r2, y2 - uy * r2);
          context.arc(x2, y2, r2, t - Math.PI, t);
          context.lineTo(x1 + rx, y1 + ry);
          context.arc(x1, y1, r1, t, t + Math.PI);
        } else {
          context.arc(x2, y2, r2, 0, Tau);
        }
        context.closePath();
      } else {
        ready = 1;
      }
      x1 = x2;
      y1 = y2;
      r1 = r2;
    }
    function trail(data) {
      var i,
        n = data.length,
        d,
        defined0 = false,
        buffer;
      if (context == null) context = buffer = d3Path.path();
      for (i = 0; i <= n; ++i) {
        if (!(i < n && defined(d = data[i], i, data)) === defined0) {
          if (defined0 = !defined0) ready = 0;
        }
        if (defined0) point(+x(d, i, data), +y(d, i, data), +size(d, i, data));
      }
      if (buffer) {
        context = null;
        return buffer + '' || null;
      }
    }
    trail.x = function (_) {
      if (arguments.length) {
        x = _;
        return trail;
      } else {
        return x;
      }
    };
    trail.y = function (_) {
      if (arguments.length) {
        y = _;
        return trail;
      } else {
        return y;
      }
    };
    trail.size = function (_) {
      if (arguments.length) {
        size = _;
        return trail;
      } else {
        return size;
      }
    };
    trail.defined = function (_) {
      if (arguments.length) {
        defined = _;
        return trail;
      } else {
        return defined;
      }
    };
    trail.context = function (_) {
      if (arguments.length) {
        if (_ == null) {
          context = null;
        } else {
          context = _;
        }
        return trail;
      } else {
        return context;
      }
    };
    return trail;
  }
  function value$1(a, b) {
    return a != null ? a : b;
  }
  var x = function x(item) {
      return item.x || 0;
    },
    y = function y(item) {
      return item.y || 0;
    },
    w = function w(item) {
      return item.width || 0;
    },
    h = function h(item) {
      return item.height || 0;
    },
    xw = function xw(item) {
      return (item.x || 0) + (item.width || 0);
    },
    yh = function yh(item) {
      return (item.y || 0) + (item.height || 0);
    },
    sa = function sa(item) {
      return item.startAngle || 0;
    },
    ea = function ea(item) {
      return item.endAngle || 0;
    },
    pa = function pa(item) {
      return item.padAngle || 0;
    },
    ir = function ir(item) {
      return item.innerRadius || 0;
    },
    or = function or(item) {
      return item.outerRadius || 0;
    },
    cr = function cr(item) {
      return item.cornerRadius || 0;
    },
    tl = function tl(item) {
      return value$1(item.cornerRadiusTopLeft, item.cornerRadius) || 0;
    },
    tr = function tr(item) {
      return value$1(item.cornerRadiusTopRight, item.cornerRadius) || 0;
    },
    br = function br(item) {
      return value$1(item.cornerRadiusBottomRight, item.cornerRadius) || 0;
    },
    bl = function bl(item) {
      return value$1(item.cornerRadiusBottomLeft, item.cornerRadius) || 0;
    },
    sz = function sz(item) {
      return value$1(item.size, 64);
    },
    ts = function ts(item) {
      return item.size || 1;
    },
    def = function def(item) {
      return !(item.defined === false);
    },
    type = function type(item) {
      return symbols(item.shape || 'circle');
    };
  var arcShape = d3Shape.arc().startAngle(sa).endAngle(ea).padAngle(pa).innerRadius(ir).outerRadius(or).cornerRadius(cr),
    areavShape = d3Shape.area().x(x).y1(y).y0(yh).defined(def),
    areahShape = d3Shape.area().y(y).x1(x).x0(xw).defined(def),
    lineShape = d3Shape.line().x(x).y(y).defined(def),
    rectShape = vg_rect().x(x).y(y).width(w).height(h).cornerRadius(tl, tr, br, bl),
    symbolShape = d3Shape.symbol().type(type).size(sz),
    trailShape = vg_trail().x(x).y(y).defined(def).size(ts);
  function hasCornerRadius(item) {
    return item.cornerRadius || item.cornerRadiusTopLeft || item.cornerRadiusTopRight || item.cornerRadiusBottomRight || item.cornerRadiusBottomLeft;
  }
  function arc$1(context, item) {
    return arcShape.context(context)(item);
  }
  function area$1(context, items) {
    var item = items[0],
      interp = item.interpolate || 'linear';
    return (item.orient === 'horizontal' ? areahShape : areavShape).curve(curves(interp, item.orient, item.tension)).context(context)(items);
  }
  function line$1(context, items) {
    var item = items[0],
      interp = item.interpolate || 'linear';
    return lineShape.curve(curves(interp, item.orient, item.tension)).context(context)(items);
  }
  function rectangle(context, item, x, y) {
    return rectShape.context(context)(item, x, y);
  }
  function shape$1(context, item) {
    return (item.mark.shape || item.shape).context(context)(item);
  }
  function symbol$1(context, item) {
    return symbolShape.context(context)(item);
  }
  function trail$1(context, items) {
    return trailShape.context(context)(items);
  }
  var clip_id = 1;
  function resetSVGClipId() {
    clip_id = 1;
  }
  function clip$1(renderer, item, size) {
    var clip = item.clip,
      defs = renderer._defs,
      id = item.clip_id || (item.clip_id = 'clip' + clip_id++),
      c = defs.clipping[id] || (defs.clipping[id] = {
        id: id
      });
    if (isFunction(clip)) {
      c.path = clip(null);
    } else if (hasCornerRadius(size)) {
      c.path = rectangle(null, size, 0, 0);
    } else {
      c.width = size.width || 0;
      c.height = size.height || 0;
    }
    return 'url(#' + id + ')';
  }
  function Bounds(b) {
    this.clear();
    if (b) this.union(b);
  }
  Bounds.prototype = {
    clone: function clone() {
      return new Bounds(this);
    },
    clear: function clear() {
      this.x1 = +Number.MAX_VALUE;
      this.y1 = +Number.MAX_VALUE;
      this.x2 = -Number.MAX_VALUE;
      this.y2 = -Number.MAX_VALUE;
      return this;
    },
    empty: function empty() {
      return this.x1 === +Number.MAX_VALUE && this.y1 === +Number.MAX_VALUE && this.x2 === -Number.MAX_VALUE && this.y2 === -Number.MAX_VALUE;
    },
    equals: function equals(b) {
      return this.x1 === b.x1 && this.y1 === b.y1 && this.x2 === b.x2 && this.y2 === b.y2;
    },
    set: function set(x1, y1, x2, y2) {
      if (x2 < x1) {
        this.x2 = x1;
        this.x1 = x2;
      } else {
        this.x1 = x1;
        this.x2 = x2;
      }
      if (y2 < y1) {
        this.y2 = y1;
        this.y1 = y2;
      } else {
        this.y1 = y1;
        this.y2 = y2;
      }
      return this;
    },
    add: function add(x, y) {
      if (x < this.x1) this.x1 = x;
      if (y < this.y1) this.y1 = y;
      if (x > this.x2) this.x2 = x;
      if (y > this.y2) this.y2 = y;
      return this;
    },
    expand: function expand(d) {
      this.x1 -= d;
      this.y1 -= d;
      this.x2 += d;
      this.y2 += d;
      return this;
    },
    round: function round() {
      this.x1 = Math.floor(this.x1);
      this.y1 = Math.floor(this.y1);
      this.x2 = Math.ceil(this.x2);
      this.y2 = Math.ceil(this.y2);
      return this;
    },
    scale: function scale(s) {
      this.x1 *= s;
      this.y1 *= s;
      this.x2 *= s;
      this.y2 *= s;
      return this;
    },
    translate: function translate(dx, dy) {
      this.x1 += dx;
      this.x2 += dx;
      this.y1 += dy;
      this.y2 += dy;
      return this;
    },
    rotate: function rotate(angle, x, y) {
      var p = this.rotatedPoints(angle, x, y);
      return this.clear().add(p[0], p[1]).add(p[2], p[3]).add(p[4], p[5]).add(p[6], p[7]);
    },
    rotatedPoints: function rotatedPoints(angle, x, y) {
      var x1 = this.x1,
        y1 = this.y1,
        x2 = this.x2,
        y2 = this.y2,
        cos = Math.cos(angle),
        sin = Math.sin(angle),
        cx = x - x * cos + y * sin,
        cy = y - x * sin - y * cos;
      return [cos * x1 - sin * y1 + cx, sin * x1 + cos * y1 + cy, cos * x1 - sin * y2 + cx, sin * x1 + cos * y2 + cy, cos * x2 - sin * y1 + cx, sin * x2 + cos * y1 + cy, cos * x2 - sin * y2 + cx, sin * x2 + cos * y2 + cy];
    },
    union: function union(b) {
      if (b.x1 < this.x1) this.x1 = b.x1;
      if (b.y1 < this.y1) this.y1 = b.y1;
      if (b.x2 > this.x2) this.x2 = b.x2;
      if (b.y2 > this.y2) this.y2 = b.y2;
      return this;
    },
    intersect: function intersect(b) {
      if (b.x1 > this.x1) this.x1 = b.x1;
      if (b.y1 > this.y1) this.y1 = b.y1;
      if (b.x2 < this.x2) this.x2 = b.x2;
      if (b.y2 < this.y2) this.y2 = b.y2;
      return this;
    },
    encloses: function encloses(b) {
      return b && this.x1 <= b.x1 && this.x2 >= b.x2 && this.y1 <= b.y1 && this.y2 >= b.y2;
    },
    alignsWith: function alignsWith(b) {
      return b && (this.x1 == b.x1 || this.x2 == b.x2 || this.y1 == b.y1 || this.y2 == b.y2);
    },
    intersects: function intersects(b) {
      return b && !(this.x2 < b.x1 || this.x1 > b.x2 || this.y2 < b.y1 || this.y1 > b.y2);
    },
    contains: function contains(x, y) {
      return !(x < this.x1 || x > this.x2 || y < this.y1 || y > this.y2);
    },
    width: function width() {
      return this.x2 - this.x1;
    },
    height: function height() {
      return this.y2 - this.y1;
    }
  };
  function Item(mark) {
    this.mark = mark;
    this.bounds = this.bounds || new Bounds();
  }
  function GroupItem(mark) {
    Item.call(this, mark);
    this.items = this.items || [];
  }
  inherits(GroupItem, Item);
  function ResourceLoader(customLoader) {
    this._pending = 0;
    this._loader = customLoader || loader();
  }
  function increment(loader) {
    loader._pending += 1;
  }
  function decrement(loader) {
    loader._pending -= 1;
  }
  ResourceLoader.prototype = {
    pending: function pending() {
      return this._pending;
    },
    sanitizeURL: function sanitizeURL(uri) {
      var loader = this;
      increment(loader);
      return loader._loader.sanitize(uri, {
        context: 'href'
      }).then(function (opt) {
        decrement(loader);
        return opt;
      }).catch(function () {
        decrement(loader);
        return null;
      });
    },
    loadImage: function loadImage(uri) {
      var loader = this,
        Image = domImage();
      increment(loader);
      return loader._loader.sanitize(uri, {
        context: 'image'
      }).then(function (opt) {
        var url = opt.href;
        if (!url || !Image) throw {
          url: url
        };
        var img = new Image();

        // set crossOrigin only if cors is defined; empty string sets anonymous mode
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/crossOrigin
        var cors = _has(opt, 'crossOrigin') ? opt.crossOrigin : 'anonymous';
        if (cors != null) img.crossOrigin = cors;

        // attempt to load image resource
        img.onload = function () {
          return decrement(loader);
        };
        img.onerror = function () {
          return decrement(loader);
        };
        img.src = url;
        return img;
      }).catch(function (e) {
        decrement(loader);
        return {
          complete: false,
          width: 0,
          height: 0,
          src: e && e.url || ''
        };
      });
    },
    ready: function ready() {
      var loader = this;
      return new Promise(function (accept) {
        function poll(value) {
          if (!loader.pending()) accept(value);else setTimeout(function () {
            poll(true);
          }, 10);
        }
        poll(false);
      });
    }
  };
  function boundStroke(bounds, item, miter) {
    if (item.stroke && item.opacity !== 0 && item.strokeOpacity !== 0) {
      var sw = item.strokeWidth != null ? +item.strokeWidth : 1;
      bounds.expand(sw + (miter ? miterAdjustment(item, sw) : 0));
    }
    return bounds;
  }
  function miterAdjustment(item, strokeWidth) {
    // TODO: more sophisticated adjustment? Or miter support in boundContext?
    return item.strokeJoin && item.strokeJoin !== 'miter' ? 0 : strokeWidth;
  }
  var circleThreshold = Tau - 1e-8;
  var bounds, lx, ly, rot, ma, mb, mc, md;
  var add = function add(x, y) {
    return bounds.add(x, y);
  };
  var addL = function addL(x, y) {
    return add(lx = x, ly = y);
  };
  var addX = function addX(x) {
    return add(x, bounds.y1);
  };
  var addY = function addY(y) {
    return add(bounds.x1, y);
  };
  var px = function px(x, y) {
    return ma * x + mc * y;
  };
  var py = function py(x, y) {
    return mb * x + md * y;
  };
  var addp = function addp(x, y) {
    return add(px(x, y), py(x, y));
  };
  var addpL = function addpL(x, y) {
    return addL(px(x, y), py(x, y));
  };
  function boundContext(_, deg) {
    bounds = _;
    if (deg) {
      rot = deg * DegToRad;
      ma = md = Math.cos(rot);
      mb = Math.sin(rot);
      mc = -mb;
    } else {
      ma = md = 1;
      rot = mb = mc = 0;
    }
    return context$1;
  }
  var context$1 = {
    beginPath: function beginPath() {},
    closePath: function closePath() {},
    moveTo: addpL,
    lineTo: addpL,
    rect: function rect(x, y, w, h) {
      if (rot) {
        addp(x + w, y);
        addp(x + w, y + h);
        addp(x, y + h);
        addpL(x, y);
      } else {
        add(x + w, y + h);
        addL(x, y);
      }
    },
    quadraticCurveTo: function quadraticCurveTo(x1, y1, x2, y2) {
      var px1 = px(x1, y1),
        py1 = py(x1, y1),
        px2 = px(x2, y2),
        py2 = py(x2, y2);
      quadExtrema(lx, px1, px2, addX);
      quadExtrema(ly, py1, py2, addY);
      addL(px2, py2);
    },
    bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x3, y3) {
      var px1 = px(x1, y1),
        py1 = py(x1, y1),
        px2 = px(x2, y2),
        py2 = py(x2, y2),
        px3 = px(x3, y3),
        py3 = py(x3, y3);
      cubicExtrema(lx, px1, px2, px3, addX);
      cubicExtrema(ly, py1, py2, py3, addY);
      addL(px3, py3);
    },
    arc: function arc(cx, cy, r, sa, ea, ccw) {
      sa += rot;
      ea += rot;

      // store last point on path
      lx = r * Math.cos(ea) + cx;
      ly = r * Math.sin(ea) + cy;
      if (Math.abs(ea - sa) > circleThreshold) {
        // treat as full circle
        add(cx - r, cy - r);
        add(cx + r, cy + r);
      } else {
        var update = function update(a) {
          return add(r * Math.cos(a) + cx, r * Math.sin(a) + cy);
        };
        var s, i;

        // sample end points
        update(sa);
        update(ea);

        // sample interior points aligned with 90 degrees
        if (ea !== sa) {
          sa = sa % Tau;
          if (sa < 0) sa += Tau;
          ea = ea % Tau;
          if (ea < 0) ea += Tau;
          if (ea < sa) {
            ccw = !ccw; // flip direction
            s = sa;
            sa = ea;
            ea = s; // swap end-points
          }

          if (ccw) {
            ea -= Tau;
            s = sa - sa % HalfPi;
            for (i = 0; i < 4 && s > ea; ++i, s -= HalfPi) update(s);
          } else {
            s = sa - sa % HalfPi + HalfPi;
            for (i = 0; i < 4 && s < ea; ++i, s = s + HalfPi) update(s);
          }
        }
      }
    }
  };
  function quadExtrema(x0, x1, x2, cb) {
    var t = (x0 - x1) / (x0 + x2 - 2 * x1);
    if (0 < t && t < 1) cb(x0 + (x1 - x0) * t);
  }
  function cubicExtrema(x0, x1, x2, x3, cb) {
    var a = x3 - x0 + 3 * x1 - 3 * x2,
      b = x0 + x2 - 2 * x1,
      c = x0 - x1;
    var t0 = 0,
      t1 = 0,
      r;

    // solve for parameter t
    if (Math.abs(a) > Epsilon) {
      // quadratic equation
      r = b * b + c * a;
      if (r >= 0) {
        r = Math.sqrt(r);
        t0 = (-b + r) / a;
        t1 = (-b - r) / a;
      }
    } else {
      // linear equation
      t0 = 0.5 * c / b;
    }

    // calculate position
    if (0 < t0 && t0 < 1) cb(cubic(t0, x0, x1, x2, x3));
    if (0 < t1 && t1 < 1) cb(cubic(t1, x0, x1, x2, x3));
  }
  function cubic(t, x0, x1, x2, x3) {
    var s = 1 - t,
      s2 = s * s,
      t2 = t * t;
    return s2 * s * x0 + 3 * s2 * t * x1 + 3 * s * t2 * x2 + t2 * t * x3;
  }
  var context$2 = (context$2 = domCanvas(1, 1)) ? context$2.getContext('2d') : null;
  var b = new Bounds();
  function intersectPath(draw) {
    return function (item, brush) {
      // rely on (inaccurate) bounds intersection if no context
      if (!context$2) return true;

      // add path to offscreen graphics context
      draw(context$2, item);

      // get bounds intersection region
      b.clear().union(item.bounds).intersect(brush).round();
      var x1 = b.x1,
        y1 = b.y1,
        x2 = b.x2,
        y2 = b.y2;

      // iterate over intersection region
      // perform fine grained inclusion test
      for (var _y = y1; _y <= y2; ++_y) {
        for (var _x = x1; _x <= x2; ++_x) {
          if (context$2.isPointInPath(_x, _y)) {
            return true;
          }
        }
      }

      // false if no hits in intersection region
      return false;
    };
  }
  function intersectPoint(item, box) {
    return box.contains(item.x || 0, item.y || 0);
  }
  function intersectRect(item, box) {
    var x = item.x || 0,
      y = item.y || 0,
      w = item.width || 0,
      h = item.height || 0;
    return box.intersects(b.set(x, y, x + w, y + h));
  }
  function intersectRule(item, box) {
    var x = item.x || 0,
      y = item.y || 0,
      x2 = item.x2 != null ? item.x2 : x,
      y2 = item.y2 != null ? item.y2 : y;
    return intersectBoxLine(box, x, y, x2, y2);
  }
  function intersectBoxLine(box, x, y, u, v) {
    var x1 = box.x1,
      y1 = box.y1,
      x2 = box.x2,
      y2 = box.y2,
      dx = u - x,
      dy = v - y;
    var t0 = 0,
      t1 = 1,
      p,
      q,
      r,
      e;
    for (e = 0; e < 4; ++e) {
      if (e === 0) {
        p = -dx;
        q = -(x1 - x);
      }
      if (e === 1) {
        p = dx;
        q = x2 - x;
      }
      if (e === 2) {
        p = -dy;
        q = -(y1 - y);
      }
      if (e === 3) {
        p = dy;
        q = y2 - y;
      }
      if (Math.abs(p) < 1e-10 && q < 0) return false;
      r = q / p;
      if (p < 0) {
        if (r > t1) return false;else if (r > t0) t0 = r;
      } else if (p > 0) {
        if (r < t0) return false;else if (r < t1) t1 = r;
      }
    }
    return true;
  }
  function blend(context, item) {
    context.globalCompositeOperation = item.blend || 'source-over';
  }
  function value$2(value, dflt) {
    return value == null ? dflt : value;
  }
  function addStops(gradient, stops) {
    var n = stops.length;
    for (var i = 0; i < n; ++i) {
      gradient.addColorStop(stops[i].offset, stops[i].color);
    }
    return gradient;
  }
  function gradient$1(context, spec, bounds) {
    var w = bounds.width(),
      h = bounds.height();
    var gradient;
    if (spec.gradient === 'radial') {
      gradient = context.createRadialGradient(bounds.x1 + value$2(spec.x1, 0.5) * w, bounds.y1 + value$2(spec.y1, 0.5) * h, Math.max(w, h) * value$2(spec.r1, 0), bounds.x1 + value$2(spec.x2, 0.5) * w, bounds.y1 + value$2(spec.y2, 0.5) * h, Math.max(w, h) * value$2(spec.r2, 0.5));
    } else {
      // linear gradient
      var x1 = value$2(spec.x1, 0),
        y1 = value$2(spec.y1, 0),
        x2 = value$2(spec.x2, 1),
        y2 = value$2(spec.y2, 0);
      if (x1 === x2 || y1 === y2 || w === h) {
        // axis aligned: use normal gradient
        gradient = context.createLinearGradient(bounds.x1 + x1 * w, bounds.y1 + y1 * h, bounds.x1 + x2 * w, bounds.y1 + y2 * h);
      } else {
        // not axis aligned: render gradient into a pattern (#2365)
        // this allows us to use normalized bounding box coordinates
        var _image = domCanvas(Math.ceil(w), Math.ceil(h)),
          ictx = _image.getContext('2d');
        ictx.scale(w, h);
        ictx.fillStyle = addStops(ictx.createLinearGradient(x1, y1, x2, y2), spec.stops);
        ictx.fillRect(0, 0, w, h);
        return context.createPattern(_image, 'no-repeat');
      }
    }
    return addStops(gradient, spec.stops);
  }
  function color$1(context, item, value) {
    return isGradient(value) ? gradient$1(context, value, item.bounds) : value;
  }
  function fill(context, item, opacity) {
    opacity *= item.fillOpacity == null ? 1 : item.fillOpacity;
    if (opacity > 0) {
      context.globalAlpha = opacity;
      context.fillStyle = color$1(context, item, item.fill);
      return true;
    } else {
      return false;
    }
  }
  var Empty = [];
  function stroke(context, item, opacity) {
    var lw = (lw = item.strokeWidth) != null ? lw : 1;
    if (lw <= 0) return false;
    opacity *= item.strokeOpacity == null ? 1 : item.strokeOpacity;
    if (opacity > 0) {
      context.globalAlpha = opacity;
      context.strokeStyle = color$1(context, item, item.stroke);
      context.lineWidth = lw;
      context.lineCap = item.strokeCap || 'butt';
      context.lineJoin = item.strokeJoin || 'miter';
      context.miterLimit = item.strokeMiterLimit || 10;
      if (context.setLineDash) {
        context.setLineDash(item.strokeDash || Empty);
        context.lineDashOffset = item.strokeDashOffset || 0;
      }
      return true;
    } else {
      return false;
    }
  }
  function compare(a, b) {
    return a.zindex - b.zindex || a.index - b.index;
  }
  function zorder(scene) {
    if (!scene.zdirty) return scene.zitems;
    var items = scene.items,
      output = [],
      item,
      i,
      n;
    for (i = 0, n = items.length; i < n; ++i) {
      item = items[i];
      item.index = i;
      if (item.zindex) output.push(item);
    }
    scene.zdirty = false;
    return scene.zitems = output.sort(compare);
  }
  function visit(scene, visitor) {
    var items = scene.items,
      i,
      n;
    if (!items || !items.length) return;
    var zitems = zorder(scene);
    if (zitems && zitems.length) {
      for (i = 0, n = items.length; i < n; ++i) {
        if (!items[i].zindex) visitor(items[i]);
      }
      items = zitems;
    }
    for (i = 0, n = items.length; i < n; ++i) {
      visitor(items[i]);
    }
  }
  function pickVisit(scene, visitor) {
    var items = scene.items,
      hit,
      i;
    if (!items || !items.length) return null;
    var zitems = zorder(scene);
    if (zitems && zitems.length) items = zitems;
    for (i = items.length; --i >= 0;) {
      if (hit = visitor(items[i])) return hit;
    }
    if (items === zitems) {
      for (items = scene.items, i = items.length; --i >= 0;) {
        if (!items[i].zindex) {
          if (hit = visitor(items[i])) return hit;
        }
      }
    }
    return null;
  }
  function drawAll(path) {
    return function (context, scene, bounds) {
      visit(scene, function (item) {
        if (!bounds || bounds.intersects(item.bounds)) {
          drawPath(path, context, item, item);
        }
      });
    };
  }
  function drawOne(path) {
    return function (context, scene, bounds) {
      if (scene.items.length && (!bounds || bounds.intersects(scene.bounds))) {
        drawPath(path, context, scene.items[0], scene.items);
      }
    };
  }
  function drawPath(path, context, item, items) {
    var opacity = item.opacity == null ? 1 : item.opacity;
    if (opacity === 0) return;
    if (path(context, items)) return;
    blend(context, item);
    if (item.fill && fill(context, item, opacity)) {
      context.fill();
    }
    if (item.stroke && stroke(context, item, opacity)) {
      context.stroke();
    }
  }
  function pick$1(test) {
    test = test || truthy;
    return function (context, scene, x, y, gx, gy) {
      x *= context.pixelRatio;
      y *= context.pixelRatio;
      return pickVisit(scene, function (item) {
        var b = item.bounds;
        // first hit test against bounding box
        if (b && !b.contains(gx, gy) || !b) return;
        // if in bounding box, perform more careful test
        if (test(context, item, x, y, gx, gy)) return item;
      });
    };
  }
  function hitPath(path, filled) {
    return function (context, o, x, y) {
      var item = Array.isArray(o) ? o[0] : o,
        fill = filled == null ? item.fill : filled,
        stroke = item.stroke && context.isPointInStroke,
        lw,
        lc;
      if (stroke) {
        lw = item.strokeWidth;
        lc = item.strokeCap;
        context.lineWidth = lw != null ? lw : 1;
        context.lineCap = lc != null ? lc : 'butt';
      }
      return path(context, o) ? false : fill && context.isPointInPath(x, y) || stroke && context.isPointInStroke(x, y);
    };
  }
  function pickPath(path) {
    return pick$1(hitPath(path));
  }
  function translate$1(x, y) {
    return 'translate(' + x + ',' + y + ')';
  }
  function rotate(a) {
    return 'rotate(' + a + ')';
  }
  function scale$3(scaleX, scaleY) {
    return 'scale(' + scaleX + ',' + scaleY + ')';
  }
  function translateItem(item) {
    return translate$1(item.x || 0, item.y || 0);
  }
  function rotateItem(item) {
    return translate$1(item.x || 0, item.y || 0) + (item.angle ? ' ' + rotate(item.angle) : '');
  }
  function transformItem(item) {
    return translate$1(item.x || 0, item.y || 0) + (item.angle ? ' ' + rotate(item.angle) : '') + (item.scaleX || item.scaleY ? ' ' + scale$3(item.scaleX || 1, item.scaleY || 1) : '');
  }
  function markItemPath(type, shape, isect) {
    function attr(emit, item) {
      emit('transform', rotateItem(item));
      emit('d', shape(null, item));
    }
    function bound(bounds, item) {
      shape(boundContext(bounds, item.angle), item);
      return boundStroke(bounds, item).translate(item.x || 0, item.y || 0);
    }
    function draw(context, item) {
      var x = item.x || 0,
        y = item.y || 0,
        a = item.angle || 0;
      context.translate(x, y);
      if (a) context.rotate(a *= DegToRad);
      context.beginPath();
      shape(context, item);
      if (a) context.rotate(-a);
      context.translate(-x, -y);
    }
    return {
      type: type,
      tag: 'path',
      nested: false,
      attr: attr,
      bound: bound,
      draw: drawAll(draw),
      pick: pickPath(draw),
      isect: isect || intersectPath(draw)
    };
  }
  var arc$2 = markItemPath('arc', arc$1);
  function pickArea(a, p) {
    var v = a[0].orient === 'horizontal' ? p[1] : p[0],
      z = a[0].orient === 'horizontal' ? 'y' : 'x',
      i = a.length,
      min = +Infinity,
      hit,
      d;
    while (--i >= 0) {
      if (a[i].defined === false) continue;
      d = Math.abs(a[i][z] - v);
      if (d < min) {
        min = d;
        hit = a[i];
      }
    }
    return hit;
  }
  function pickLine(a, p) {
    var t = Math.pow(a[0].strokeWidth || 1, 2),
      i = a.length,
      dx,
      dy,
      dd;
    while (--i >= 0) {
      if (a[i].defined === false) continue;
      dx = a[i].x - p[0];
      dy = a[i].y - p[1];
      dd = dx * dx + dy * dy;
      if (dd < t) return a[i];
    }
    return null;
  }
  function pickTrail(a, p) {
    var i = a.length,
      dx,
      dy,
      dd;
    while (--i >= 0) {
      if (a[i].defined === false) continue;
      dx = a[i].x - p[0];
      dy = a[i].y - p[1];
      dd = dx * dx + dy * dy;
      dx = a[i].size || 1;
      if (dd < dx * dx) return a[i];
    }
    return null;
  }
  function markMultiItemPath(type, shape, tip) {
    function attr(emit, item) {
      var items = item.mark.items;
      if (items.length) emit('d', shape(null, items));
    }
    function bound(bounds, mark) {
      var items = mark.items;
      if (items.length === 0) {
        return bounds;
      } else {
        shape(boundContext(bounds), items);
        return boundStroke(bounds, items[0]);
      }
    }
    function draw(context, items) {
      context.beginPath();
      shape(context, items);
    }
    var hit = hitPath(draw);
    function pick(context, scene, x, y, gx, gy) {
      var items = scene.items,
        b = scene.bounds;
      if (!items || !items.length || b && !b.contains(gx, gy)) {
        return null;
      }
      x *= context.pixelRatio;
      y *= context.pixelRatio;
      return hit(context, items, x, y) ? items[0] : null;
    }
    return {
      type: type,
      tag: 'path',
      nested: true,
      attr: attr,
      bound: bound,
      draw: drawOne(draw),
      pick: pick,
      isect: intersectPoint,
      tip: tip
    };
  }
  var area$2 = markMultiItemPath('area', area$1, pickArea);
  function clip$2(context, scene) {
    var clip = scene.clip;
    context.save();
    if (isFunction(clip)) {
      context.beginPath();
      clip(context);
      context.clip();
    } else {
      clipGroup(context, scene.group);
    }
  }
  function clipGroup(context, group) {
    context.beginPath();
    hasCornerRadius(group) ? rectangle(context, group, 0, 0) : context.rect(0, 0, group.width || 0, group.height || 0);
    context.clip();
  }
  function offset$1(item) {
    var sw = value$2(item.strokeWidth, 1);
    return item.strokeOffset != null ? item.strokeOffset : item.stroke && sw > 0.5 && sw < 1.5 ? 0.5 - Math.abs(sw - 1) : 0;
  }
  function attr$5(emit, item) {
    emit('transform', translateItem(item));
  }
  function emitRectangle(emit, item) {
    var off = offset$1(item);
    emit('d', rectangle(null, item, off, off));
  }
  function background$1(emit, item) {
    emit('class', 'background');
    emit('aria-hidden', true);
    emitRectangle(emit, item);
  }
  function foreground(emit, item) {
    emit('class', 'foreground');
    emit('aria-hidden', true);
    if (item.strokeForeground) {
      emitRectangle(emit, item);
    } else {
      emit('d', '');
    }
  }
  function content(emit, item, renderer) {
    var url = item.clip ? clip$1(renderer, item, item) : null;
    emit('clip-path', url);
  }
  function bound$5(bounds, group) {
    if (!group.clip && group.items) {
      var items = group.items,
        m = items.length;
      for (var j = 0; j < m; ++j) {
        bounds.union(items[j].bounds);
      }
    }
    if ((group.clip || group.width || group.height) && !group.noBound) {
      bounds.add(0, 0).add(group.width || 0, group.height || 0);
    }
    boundStroke(bounds, group);
    return bounds.translate(group.x || 0, group.y || 0);
  }
  function rectanglePath(context, group, x, y) {
    var off = offset$1(group);
    context.beginPath();
    rectangle(context, group, (x || 0) + off, (y || 0) + off);
  }
  var hitBackground = hitPath(rectanglePath);
  var hitForeground = hitPath(rectanglePath, false);
  var hitCorner = hitPath(rectanglePath, true);
  function draw$4(context, scene, bounds) {
    var _this = this;
    visit(scene, function (group) {
      var gx = group.x || 0,
        gy = group.y || 0,
        fore = group.strokeForeground,
        opacity = group.opacity == null ? 1 : group.opacity;

      // draw group background
      if ((group.stroke || group.fill) && opacity) {
        rectanglePath(context, group, gx, gy);
        blend(context, group);
        if (group.fill && fill(context, group, opacity)) {
          context.fill();
        }
        if (group.stroke && !fore && stroke(context, group, opacity)) {
          context.stroke();
        }
      }

      // setup graphics context, set clip and bounds
      context.save();
      context.translate(gx, gy);
      if (group.clip) clipGroup(context, group);
      if (bounds) bounds.translate(-gx, -gy);

      // draw group contents
      visit(group, function (item) {
        _this.draw(context, item, bounds);
      });

      // restore graphics context
      if (bounds) bounds.translate(gx, gy);
      context.restore();

      // draw group foreground
      if (fore && group.stroke && opacity) {
        rectanglePath(context, group, gx, gy);
        blend(context, group);
        if (stroke(context, group, opacity)) {
          context.stroke();
        }
      }
    });
  }
  function pick(context, scene, x, y, gx, gy) {
    var _this2 = this;
    if (scene.bounds && !scene.bounds.contains(gx, gy) || !scene.items) {
      return null;
    }
    var cx = x * context.pixelRatio,
      cy = y * context.pixelRatio;
    return pickVisit(scene, function (group) {
      var hit, dx, dy;

      // first hit test bounding box
      var b = group.bounds;
      if (b && !b.contains(gx, gy)) return;

      // passed bounds check, test rectangular clip
      dx = group.x || 0;
      dy = group.y || 0;
      var dw = dx + (group.width || 0),
        dh = dy + (group.height || 0),
        c = group.clip;
      if (c && (gx < dx || gx > dw || gy < dy || gy > dh)) return;

      // adjust coordinate system
      context.save();
      context.translate(dx, dy);
      dx = gx - dx;
      dy = gy - dy;

      // test background for rounded corner clip
      if (c && hasCornerRadius(group) && !hitCorner(context, group, cx, cy)) {
        context.restore();
        return null;
      }
      var fore = group.strokeForeground,
        ix = scene.interactive !== false;

      // hit test against group foreground
      if (ix && fore && group.stroke && hitForeground(context, group, cx, cy)) {
        context.restore();
        return group;
      }

      // hit test against contained marks
      hit = pickVisit(group, function (mark) {
        return pickMark(mark, dx, dy) ? _this2.pick(mark, x, y, dx, dy) : null;
      });

      // hit test against group background
      if (!hit && ix && (group.fill || !fore && group.stroke) && hitBackground(context, group, cx, cy)) {
        hit = group;
      }

      // restore state and return
      context.restore();
      return hit || null;
    });
  }
  function pickMark(mark, x, y) {
    return (mark.interactive !== false || mark.marktype === 'group') && mark.bounds && mark.bounds.contains(x, y);
  }
  var group = {
    type: 'group',
    tag: 'g',
    nested: false,
    attr: attr$5,
    bound: bound$5,
    draw: draw$4,
    pick: pick,
    isect: intersectRect,
    content: content,
    background: background$1,
    foreground: foreground
  };
  var metadata = {
    'xmlns': 'http://www.w3.org/2000/svg',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'version': '1.1'
  };
  function getImage(item, renderer) {
    var image = item.image;
    if (!image || item.url && item.url !== image.url) {
      image = {
        complete: false,
        width: 0,
        height: 0
      };
      renderer.loadImage(item.url).then(function (image) {
        item.image = image;
        item.image.url = item.url;
      });
    }
    return image;
  }
  function imageWidth(item, image) {
    return item.width != null ? item.width : !image || !image.width ? 0 : item.aspect !== false && item.height ? item.height * image.width / image.height : image.width;
  }
  function imageHeight(item, image) {
    return item.height != null ? item.height : !image || !image.height ? 0 : item.aspect !== false && item.width ? item.width * image.height / image.width : image.height;
  }
  function imageXOffset(align, w) {
    return align === 'center' ? w / 2 : align === 'right' ? w : 0;
  }
  function imageYOffset(baseline, h) {
    return baseline === 'middle' ? h / 2 : baseline === 'bottom' ? h : 0;
  }
  function attr$4(emit, item, renderer) {
    var img = getImage(item, renderer),
      w = imageWidth(item, img),
      h = imageHeight(item, img),
      x = (item.x || 0) - imageXOffset(item.align, w),
      y = (item.y || 0) - imageYOffset(item.baseline, h),
      i = !img.src && img.toDataURL ? img.toDataURL() : img.src || '';
    emit('href', i, metadata['xmlns:xlink'], 'xlink:href');
    emit('transform', translate$1(x, y));
    emit('width', w);
    emit('height', h);
    emit('preserveAspectRatio', item.aspect === false ? 'none' : 'xMidYMid');
  }
  function bound$4(bounds, item) {
    var img = item.image,
      w = imageWidth(item, img),
      h = imageHeight(item, img),
      x = (item.x || 0) - imageXOffset(item.align, w),
      y = (item.y || 0) - imageYOffset(item.baseline, h);
    return bounds.set(x, y, x + w, y + h);
  }
  function draw$3(context, scene, bounds) {
    var _this3 = this;
    visit(scene, function (item) {
      if (bounds && !bounds.intersects(item.bounds)) return; // bounds check

      var img = getImage(item, _this3);
      var w = imageWidth(item, img);
      var h = imageHeight(item, img);
      if (w === 0 || h === 0) return; // early exit

      var x = (item.x || 0) - imageXOffset(item.align, w),
        y = (item.y || 0) - imageYOffset(item.baseline, h),
        opacity,
        ar0,
        ar1,
        t;
      if (item.aspect !== false) {
        ar0 = img.width / img.height;
        ar1 = item.width / item.height;
        if (ar0 === ar0 && ar1 === ar1 && ar0 !== ar1) {
          if (ar1 < ar0) {
            t = w / ar0;
            y += (h - t) / 2;
            h = t;
          } else {
            t = h * ar0;
            x += (w - t) / 2;
            w = t;
          }
        }
      }
      if (img.complete || img.toDataURL) {
        blend(context, item);
        context.globalAlpha = (opacity = item.opacity) != null ? opacity : 1;
        context.imageSmoothingEnabled = item.smooth !== false;
        context.drawImage(img, x, y, w, h);
      }
    });
  }
  var image = {
    type: 'image',
    tag: 'image',
    nested: false,
    attr: attr$4,
    bound: bound$4,
    draw: draw$3,
    pick: pick$1(),
    isect: truthy,
    // bounds check is sufficient
    get: getImage,
    xOffset: imageXOffset,
    yOffset: imageYOffset
  };
  var line$2 = markMultiItemPath('line', line$1, pickLine);
  function attr$3(emit, item) {
    var sx = item.scaleX || 1,
      sy = item.scaleY || 1;
    if (sx !== 1 || sy !== 1) {
      emit('vector-effect', 'non-scaling-stroke');
    }
    emit('transform', transformItem(item));
    emit('d', item.path);
  }
  function path$1(context, item) {
    var path = item.path;
    if (path == null) return true;
    var x = item.x || 0,
      y = item.y || 0,
      sx = item.scaleX || 1,
      sy = item.scaleY || 1,
      a = (item.angle || 0) * DegToRad,
      cache = item.pathCache;
    if (!cache || cache.path !== path) {
      (item.pathCache = cache = parse$3(path)).path = path;
    }
    if (a && context.rotate && context.translate) {
      context.translate(x, y);
      context.rotate(a);
      pathRender(context, cache, 0, 0, sx, sy);
      context.rotate(-a);
      context.translate(-x, -y);
    } else {
      pathRender(context, cache, x, y, sx, sy);
    }
  }
  function bound$3(bounds, item) {
    return path$1(boundContext(bounds, item.angle), item) ? bounds.set(0, 0, 0, 0) : boundStroke(bounds, item, true);
  }
  var path$2 = {
    type: 'path',
    tag: 'path',
    nested: false,
    attr: attr$3,
    bound: bound$3,
    draw: drawAll(path$1),
    pick: pickPath(path$1),
    isect: intersectPath(path$1)
  };
  function attr$2(emit, item) {
    emit('d', rectangle(null, item));
  }
  function bound$2(bounds, item) {
    var x, y;
    return boundStroke(bounds.set(x = item.x || 0, y = item.y || 0, x + item.width || 0, y + item.height || 0), item);
  }
  function draw$2(context, item) {
    context.beginPath();
    rectangle(context, item);
  }
  var rect = {
    type: 'rect',
    tag: 'path',
    nested: false,
    attr: attr$2,
    bound: bound$2,
    draw: drawAll(draw$2),
    pick: pickPath(draw$2),
    isect: intersectRect
  };
  function attr$1(emit, item) {
    emit('transform', translateItem(item));
    emit('x2', item.x2 != null ? item.x2 - (item.x || 0) : 0);
    emit('y2', item.y2 != null ? item.y2 - (item.y || 0) : 0);
  }
  function bound$1(bounds, item) {
    var x1, y1;
    return boundStroke(bounds.set(x1 = item.x || 0, y1 = item.y || 0, item.x2 != null ? item.x2 : x1, item.y2 != null ? item.y2 : y1), item);
  }
  function path(context, item, opacity) {
    var x1, y1, x2, y2;
    if (item.stroke && stroke(context, item, opacity)) {
      x1 = item.x || 0;
      y1 = item.y || 0;
      x2 = item.x2 != null ? item.x2 : x1;
      y2 = item.y2 != null ? item.y2 : y1;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      return true;
    }
    return false;
  }
  function draw$1(context, scene, bounds) {
    visit(scene, function (item) {
      if (bounds && !bounds.intersects(item.bounds)) return; // bounds check
      var opacity = item.opacity == null ? 1 : item.opacity;
      if (opacity && path(context, item, opacity)) {
        blend(context, item);
        context.stroke();
      }
    });
  }
  function hit$1(context, item, x, y) {
    if (!context.isPointInStroke) return false;
    return path(context, item, 1) && context.isPointInStroke(x, y);
  }
  var rule$1 = {
    type: 'rule',
    tag: 'line',
    nested: false,
    attr: attr$1,
    bound: bound$1,
    draw: draw$1,
    pick: pick$1(hit$1),
    isect: intersectRule
  };
  var shape = markItemPath('shape', shape$1);
  var symbol = markItemPath('symbol', symbol$1, intersectPoint);

  // memoize text width measurement
  var widthCache = lruCache();
  var textMetrics = {
    height: fontSize,
    measureWidth: measureWidth,
    estimateWidth: estimateWidth,
    width: estimateWidth,
    canvas: useCanvas
  };
  useCanvas(true);
  function useCanvas(use) {
    textMetrics.width = use && context$2 ? measureWidth : estimateWidth;
  }

  // make simple estimate if no canvas is available
  function estimateWidth(item, text) {
    return _estimateWidth(textValue(item, text), fontSize(item));
  }
  function _estimateWidth(text, currentFontHeight) {
    return ~~(0.8 * text.length * currentFontHeight);
  }

  // measure text width if canvas is available
  function measureWidth(item, text) {
    return fontSize(item) <= 0 || !(text = textValue(item, text)) ? 0 : _measureWidth(text, font(item));
  }
  function _measureWidth(text, currentFont) {
    var key = "(".concat(currentFont, ") ").concat(text);
    var width = widthCache.get(key);
    if (width === undefined) {
      context$2.font = currentFont;
      width = context$2.measureText(text).width;
      widthCache.set(key, width);
    }
    return width;
  }
  function fontSize(item) {
    return item.fontSize != null ? +item.fontSize || 0 : 11;
  }
  function lineHeight(item) {
    return item.lineHeight != null ? item.lineHeight : fontSize(item) + 2;
  }
  function lineArray(_) {
    return isArray(_) ? _.length > 1 ? _ : _[0] : _;
  }
  function textLines(item) {
    return lineArray(item.lineBreak && item.text && !isArray(item.text) ? item.text.split(item.lineBreak) : item.text);
  }
  function multiLineOffset(item) {
    var tl = textLines(item);
    return (isArray(tl) ? tl.length - 1 : 0) * lineHeight(item);
  }
  function textValue(item, line) {
    var text = line == null ? '' : (line + '').trim();
    return item.limit > 0 && text.length ? truncate(item, text) : text;
  }
  function widthGetter(item) {
    if (textMetrics.width === measureWidth) {
      // we are using canvas
      var currentFont = font(item);
      return function (text) {
        return _measureWidth(text, currentFont);
      };
    } else {
      // we are relying on estimates
      var currentFontHeight = fontSize(item);
      return function (text) {
        return _estimateWidth(text, currentFontHeight);
      };
    }
  }
  function truncate(item, text) {
    var limit = +item.limit,
      width = widthGetter(item);
    if (width(text) < limit) return text;
    var ellipsis = item.ellipsis || "\u2026",
      rtl = item.dir === 'rtl',
      lo = 0,
      hi = text.length,
      mid;
    limit -= width(ellipsis);
    if (rtl) {
      while (lo < hi) {
        mid = lo + hi >>> 1;
        if (width(text.slice(mid)) > limit) lo = mid + 1;else hi = mid;
      }
      return ellipsis + text.slice(lo);
    } else {
      while (lo < hi) {
        mid = 1 + (lo + hi >>> 1);
        if (width(text.slice(0, mid)) < limit) lo = mid;else hi = mid - 1;
      }
      return text.slice(0, lo) + ellipsis;
    }
  }
  function fontFamily(item, quote) {
    var font = item.font;
    return (quote && font ? String(font).replace(/"/g, '\'') : font) || 'sans-serif';
  }
  function font(item, quote) {
    return '' + (item.fontStyle ? item.fontStyle + ' ' : '') + (item.fontVariant ? item.fontVariant + ' ' : '') + (item.fontWeight ? item.fontWeight + ' ' : '') + fontSize(item) + 'px ' + fontFamily(item, quote);
  }
  function offset$2(item) {
    // perform our own font baseline calculation
    // why? not all browsers support SVG 1.1 'alignment-baseline' :(
    // this also ensures consistent layout across renderers
    var baseline = item.baseline,
      h = fontSize(item);
    return Math.round(baseline === 'top' ? 0.79 * h : baseline === 'middle' ? 0.30 * h : baseline === 'bottom' ? -0.21 * h : baseline === 'line-top' ? 0.29 * h + 0.5 * lineHeight(item) : baseline === 'line-bottom' ? 0.29 * h - 0.5 * lineHeight(item) : 0);
  }
  var textAlign = {
    'left': 'start',
    'center': 'middle',
    'right': 'end'
  };
  var tempBounds$1 = new Bounds();
  function anchorPoint(item) {
    var x = item.x || 0,
      y = item.y || 0,
      r = item.radius || 0,
      t;
    if (r) {
      t = (item.theta || 0) - HalfPi;
      x += r * Math.cos(t);
      y += r * Math.sin(t);
    }
    tempBounds$1.x1 = x;
    tempBounds$1.y1 = y;
    return tempBounds$1;
  }
  function attr(emit, item) {
    var dx = item.dx || 0,
      dy = (item.dy || 0) + offset$2(item),
      p = anchorPoint(item),
      x = p.x1,
      y = p.y1,
      a = item.angle || 0,
      t;
    emit('text-anchor', textAlign[item.align] || 'start');
    if (a) {
      t = translate$1(x, y) + ' ' + rotate(a);
      if (dx || dy) t += ' ' + translate$1(dx, dy);
    } else {
      t = translate$1(x + dx, y + dy);
    }
    emit('transform', t);
  }
  function bound(bounds, item, mode) {
    var h = textMetrics.height(item),
      a = item.align,
      p = anchorPoint(item),
      x = p.x1,
      y = p.y1,
      dx = item.dx || 0,
      dy = (item.dy || 0) + offset$2(item) - Math.round(0.8 * h),
      // use 4/5 offset
      tl = textLines(item),
      w;

    // get dimensions
    if (isArray(tl)) {
      // multi-line text
      h += lineHeight(item) * (tl.length - 1);
      w = tl.reduce(function (w, t) {
        return Math.max(w, textMetrics.width(item, t));
      }, 0);
    } else {
      // single-line text
      w = textMetrics.width(item, tl);
    }

    // horizontal alignment
    if (a === 'center') {
      dx -= w / 2;
    } else if (a === 'right') {
      dx -= w;
    } else ;
    bounds.set(dx += x, dy += y, dx + w, dy + h);
    if (item.angle && !mode) {
      bounds.rotate(item.angle * DegToRad, x, y);
    } else if (mode === 2) {
      return bounds.rotatedPoints(item.angle * DegToRad, x, y);
    }
    return bounds;
  }
  function draw$5(context, scene, bounds) {
    visit(scene, function (item) {
      var opacity = item.opacity == null ? 1 : item.opacity,
        p,
        x,
        y,
        i,
        lh,
        tl,
        str;
      if (bounds && !bounds.intersects(item.bounds) ||
      // bounds check
      opacity === 0 || item.fontSize <= 0 || item.text == null || item.text.length === 0) return;
      context.font = font(item);
      context.textAlign = item.align || 'left';
      p = anchorPoint(item);
      x = p.x1, y = p.y1;
      if (item.angle) {
        context.save();
        context.translate(x, y);
        context.rotate(item.angle * DegToRad);
        x = y = 0; // reset x, y
      }

      x += item.dx || 0;
      y += (item.dy || 0) + offset$2(item);
      tl = textLines(item);
      blend(context, item);
      if (isArray(tl)) {
        lh = lineHeight(item);
        for (i = 0; i < tl.length; ++i) {
          str = textValue(item, tl[i]);
          if (item.fill && fill(context, item, opacity)) {
            context.fillText(str, x, y);
          }
          if (item.stroke && stroke(context, item, opacity)) {
            context.strokeText(str, x, y);
          }
          y += lh;
        }
      } else {
        str = textValue(item, tl);
        if (item.fill && fill(context, item, opacity)) {
          context.fillText(str, x, y);
        }
        if (item.stroke && stroke(context, item, opacity)) {
          context.strokeText(str, x, y);
        }
      }
      if (item.angle) context.restore();
    });
  }
  function hit(context, item, x, y, gx, gy) {
    if (item.fontSize <= 0) return false;
    if (!item.angle) return true; // bounds sufficient if no rotation

    // project point into space of unrotated bounds
    var p = anchorPoint(item),
      ax = p.x1,
      ay = p.y1,
      b = bound(tempBounds$1, item, 1),
      a = -item.angle * DegToRad,
      cos = Math.cos(a),
      sin = Math.sin(a),
      px = cos * gx - sin * gy + (ax - cos * ax + sin * ay),
      py = sin * gx + cos * gy + (ay - sin * ax - cos * ay);
    return b.contains(px, py);
  }
  function intersectText(item, box) {
    var p = bound(tempBounds$1, item, 2);
    return intersectBoxLine(box, p[0], p[1], p[2], p[3]) || intersectBoxLine(box, p[0], p[1], p[4], p[5]) || intersectBoxLine(box, p[4], p[5], p[6], p[7]) || intersectBoxLine(box, p[2], p[3], p[6], p[7]);
  }
  var text = {
    type: 'text',
    tag: 'text',
    nested: false,
    attr: attr,
    bound: bound,
    draw: draw$5,
    pick: pick$1(hit),
    isect: intersectText
  };
  var trail = markMultiItemPath('trail', trail$1, pickTrail);
  var Marks = {
    arc: arc$2,
    area: area$2,
    group: group,
    image: image,
    line: line$2,
    path: path$2,
    rect: rect,
    rule: rule$1,
    shape: shape,
    symbol: symbol,
    text: text,
    trail: trail
  };
  function boundItem$1(item, func, opt) {
    var type = Marks[item.mark.marktype],
      bound = func || type.bound;
    if (type.nested) item = item.mark;
    return bound(item.bounds || (item.bounds = new Bounds()), item, opt);
  }
  var DUMMY = {
    mark: null
  };
  function boundMark(mark, bounds, opt) {
    var type = Marks[mark.marktype],
      bound = type.bound,
      items = mark.items,
      hasItems = items && items.length,
      i,
      n,
      item,
      b;
    if (type.nested) {
      if (hasItems) {
        item = items[0];
      } else {
        // no items, fake it
        DUMMY.mark = mark;
        item = DUMMY;
      }
      b = boundItem$1(item, bound, opt);
      bounds = bounds && bounds.union(b) || b;
      return bounds;
    }
    bounds = bounds || mark.bounds && mark.bounds.clear() || new Bounds();
    if (hasItems) {
      for (i = 0, n = items.length; i < n; ++i) {
        bounds.union(boundItem$1(items[i], bound, opt));
      }
    }
    return mark.bounds = bounds;
  }
  var keys$1 = ['marktype', 'name', 'role', 'interactive', 'clip', 'items', 'zindex', 'x', 'y', 'width', 'height', 'align', 'baseline',
  // layout
  'fill', 'fillOpacity', 'opacity', 'blend',
  // fill
  'stroke', 'strokeOpacity', 'strokeWidth', 'strokeCap',
  // stroke
  'strokeDash', 'strokeDashOffset',
  // stroke dash
  'strokeForeground', 'strokeOffset',
  // group
  'startAngle', 'endAngle', 'innerRadius', 'outerRadius',
  // arc
  'cornerRadius', 'padAngle',
  // arc, rect
  'cornerRadiusTopLeft', 'cornerRadiusTopRight',
  // rect, group
  'cornerRadiusBottomLeft', 'cornerRadiusBottomRight', 'interpolate', 'tension', 'orient', 'defined',
  // area, line
  'url', 'aspect', 'smooth',
  // image
  'path', 'scaleX', 'scaleY',
  // path
  'x2', 'y2',
  // rule
  'size', 'shape',
  // symbol
  'text', 'angle', 'theta', 'radius', 'dir', 'dx', 'dy',
  // text
  'ellipsis', 'limit', 'lineBreak', 'lineHeight', 'font', 'fontSize', 'fontWeight', 'fontStyle', 'fontVariant',
  // font
  'description', 'aria', 'ariaRole', 'ariaRoleDescription' // aria
  ];

  function sceneToJSON(scene, indent) {
    return JSON.stringify(scene, keys$1, indent);
  }
  function sceneFromJSON(json) {
    var scene = typeof json === 'string' ? JSON.parse(json) : json;
    return initialize$1(scene);
  }
  function initialize$1(scene) {
    var type = scene.marktype,
      items = scene.items,
      parent,
      i,
      n;
    if (items) {
      for (i = 0, n = items.length; i < n; ++i) {
        parent = type ? 'mark' : 'group';
        items[i][parent] = scene;
        if (items[i].zindex) items[i][parent].zdirty = true;
        if ('group' === (type || parent)) initialize$1(items[i]);
      }
    }
    if (type) boundMark(scene);
    return scene;
  }
  function Scenegraph(scene) {
    if (arguments.length) {
      this.root = sceneFromJSON(scene);
    } else {
      this.root = createMark({
        marktype: 'group',
        name: 'root',
        role: 'frame'
      });
      this.root.items = [new GroupItem(this.root)];
    }
  }
  Scenegraph.prototype = {
    toJSON: function toJSON(indent) {
      return sceneToJSON(this.root, indent || 0);
    },
    mark: function mark(markdef, group, index) {
      group = group || this.root.items[0];
      var mark = createMark(markdef, group);
      group.items[index] = mark;
      if (mark.zindex) mark.group.zdirty = true;
      return mark;
    }
  };
  function createMark(def, group) {
    var mark = {
      bounds: new Bounds(),
      clip: !!def.clip,
      group: group,
      interactive: def.interactive === false ? false : true,
      items: [],
      marktype: def.marktype,
      name: def.name || undefined,
      role: def.role || undefined,
      zindex: def.zindex || 0
    };

    // add accessibility properties if defined
    if (def.aria != null) {
      mark.aria = def.aria;
    }
    if (def.description) {
      mark.description = def.description;
    }
    return mark;
  }

  // create a new DOM element
  function domCreate(doc, tag, ns) {
    if (!doc && typeof document !== 'undefined' && document.createElement) {
      doc = document;
    }
    return doc ? ns ? doc.createElementNS(ns, tag) : doc.createElement(tag) : null;
  }

  // find first child element with matching tag
  function domFind(el, tag) {
    tag = tag.toLowerCase();
    var nodes = el.childNodes,
      i = 0,
      n = nodes.length;
    for (; i < n; ++i) if (nodes[i].tagName.toLowerCase() === tag) {
      return nodes[i];
    }
  }

  // retrieve child element at given index
  // create & insert if doesn't exist or if tags do not match
  function domChild(el, index, tag, ns) {
    var a = el.childNodes[index],
      b;
    if (!a || a.tagName.toLowerCase() !== tag.toLowerCase()) {
      b = a || null;
      a = domCreate(el.ownerDocument, tag, ns);
      el.insertBefore(a, b);
    }
    return a;
  }

  // remove all child elements at or above the given index
  function domClear(el, index) {
    var nodes = el.childNodes,
      curr = nodes.length;
    while (curr > index) el.removeChild(nodes[--curr]);
    return el;
  }

  // generate css class name for mark
  function cssClass(mark) {
    return 'mark-' + mark.marktype + (mark.role ? ' role-' + mark.role : '') + (mark.name ? ' ' + mark.name : '');
  }
  function point(event, el) {
    var rect = el.getBoundingClientRect();
    return [event.clientX - rect.left - (el.clientLeft || 0), event.clientY - rect.top - (el.clientTop || 0)];
  }
  function resolveItem(item, event, el, origin) {
    var mark = item && item.mark,
      mdef,
      p;
    if (mark && (mdef = Marks[mark.marktype]).tip) {
      p = point(event, el);
      p[0] -= origin[0];
      p[1] -= origin[1];
      while (item = item.mark.group) {
        p[0] -= item.x || 0;
        p[1] -= item.y || 0;
      }
      item = mdef.tip(mark.items, p);
    }
    return item;
  }

  /**
   * Create a new Handler instance.
   * @param {object} [customLoader] - Optional loader instance for
   *   href URL sanitization. If not specified, a standard loader
   *   instance will be generated.
   * @param {function} [customTooltip] - Optional tooltip handler
   *   function for custom tooltip display.
   * @constructor
   */
  function Handler(customLoader, customTooltip) {
    this._active = null;
    this._handlers = {};
    this._loader = customLoader || loader();
    this._tooltip = customTooltip || defaultTooltip$1;
  }

  // The default tooltip display handler.
  // Sets the HTML title attribute on the visualization container.
  function defaultTooltip$1(handler, event, item, value) {
    handler.element().setAttribute('title', value || '');
  }
  Handler.prototype = {
    /**
     * Initialize a new Handler instance.
     * @param {DOMElement} el - The containing DOM element for the display.
     * @param {Array<number>} origin - The origin of the display, in pixels.
     *   The coordinate system will be translated to this point.
     * @param {object} [obj] - Optional context object that should serve as
     *   the "this" context for event callbacks.
     * @return {Handler} - This handler instance.
     */
    initialize: function initialize(el, origin, obj) {
      this._el = el;
      this._obj = obj || null;
      return this.origin(origin);
    },
    /**
     * Returns the parent container element for a visualization.
     * @return {DOMElement} - The containing DOM element.
     */
    element: function element() {
      return this._el;
    },
    /**
     * Returns the scene element (e.g., canvas or SVG) of the visualization
     * Subclasses must override if the first child is not the scene element.
     * @return {DOMElement} - The scene (e.g., canvas or SVG) element.
     */
    canvas: function canvas() {
      return this._el && this._el.firstChild;
    },
    /**
     * Get / set the origin coordinates of the visualization.
     */
    origin: function origin(_origin) {
      if (arguments.length) {
        this._origin = _origin || [0, 0];
        return this;
      } else {
        return this._origin.slice();
      }
    },
    /**
     * Get / set the scenegraph root.
     */
    scene: function scene(_scene) {
      if (!arguments.length) return this._scene;
      this._scene = _scene;
      return this;
    },
    /**
     * Add an event handler. Subclasses should override this method.
     */
    on: function on() {} /*type, handler*/,
    /**
     * Remove an event handler. Subclasses should override this method.
     */
    off: function off() {} /*type, handler*/,
    /**
     * Utility method for finding the array index of an event handler.
     * @param {Array} h - An array of registered event handlers.
     * @param {string} type - The event type.
     * @param {function} handler - The event handler instance to find.
     * @return {number} - The handler's array index or -1 if not registered.
     */
    _handlerIndex: function _handlerIndex(h, type, handler) {
      for (var i = h ? h.length : 0; --i >= 0;) {
        if (h[i].type === type && (!handler || h[i].handler === handler)) {
          return i;
        }
      }
      return -1;
    },
    /**
     * Returns an array with registered event handlers.
     * @param {string} [type] - The event type to query. Any annotations
     *   are ignored; for example, for the argument "click.foo", ".foo" will
     *   be ignored and the method returns all "click" handlers. If type is
     *   null or unspecified, this method returns handlers for all types.
     * @return {Array} - A new array containing all registered event handlers.
     */
    handlers: function handlers(type) {
      var h = this._handlers,
        a = [];
      if (type) {
        a.push.apply(a, _toConsumableArray(h[this.eventName(type)]));
      } else {
        for (var k in h) {
          a.push.apply(a, _toConsumableArray(h[k]));
        }
      }
      return a;
    },
    /**
     * Parses an event name string to return the specific event type.
     * For example, given "click.foo" returns "click"
     * @param {string} name - The input event type string.
     * @return {string} - A string with the event type only.
     */
    eventName: function eventName(name) {
      var i = name.indexOf('.');
      return i < 0 ? name : name.slice(0, i);
    },
    /**
     * Handle hyperlink navigation in response to an item.href value.
     * @param {Event} event - The event triggering hyperlink navigation.
     * @param {Item} item - The scenegraph item.
     * @param {string} href - The URL to navigate to.
     */
    handleHref: function handleHref(event, item, href) {
      this._loader.sanitize(href, {
        context: 'href'
      }).then(function (opt) {
        var e = new MouseEvent(event.type, event),
          a = domCreate(null, 'a');
        for (var name in opt) a.setAttribute(name, opt[name]);
        a.dispatchEvent(e);
      }).catch(function () {/* do nothing */});
    },
    /**
     * Handle tooltip display in response to an item.tooltip value.
     * @param {Event} event - The event triggering tooltip display.
     * @param {Item} item - The scenegraph item.
     * @param {boolean} show - A boolean flag indicating whether
     *   to show or hide a tooltip for the given item.
     */
    handleTooltip: function handleTooltip(event, item, show) {
      if (item && item.tooltip != null) {
        item = resolveItem(item, event, this.canvas(), this._origin);
        var _value = show && item && item.tooltip || null;
        this._tooltip.call(this._obj, this, event, item, _value);
      }
    },
    /**
     * Returns the size of a scenegraph item and its position relative
     * to the viewport.
     * @param {Item} item - The scenegraph item.
     * @return {object} - A bounding box object (compatible with the
     *   DOMRect type) consisting of x, y, width, heigh, top, left,
     *   right, and bottom properties.
     */
    getItemBoundingClientRect: function getItemBoundingClientRect(item) {
      var el = this.canvas();
      if (!el) return;
      var rect = el.getBoundingClientRect(),
        origin = this._origin,
        bounds = item.bounds,
        width = bounds.width(),
        height = bounds.height();
      var x = bounds.x1 + origin[0] + rect.left,
        y = bounds.y1 + origin[1] + rect.top;

      // translate coordinate for each parent group
      while (item.mark && (item = item.mark.group)) {
        x += item.x || 0;
        y += item.y || 0;
      }

      // return DOMRect-compatible bounding box
      return {
        x: x,
        y: y,
        width: width,
        height: height,
        left: x,
        top: y,
        right: x + width,
        bottom: y + height
      };
    }
  };

  /**
   * Create a new Renderer instance.
   * @param {object} [loader] - Optional loader instance for
   *   image and href URL sanitization. If not specified, a
   *   standard loader instance will be generated.
   * @constructor
   */
  function Renderer(loader) {
    this._el = null;
    this._bgcolor = null;
    this._loader = new ResourceLoader(loader);
  }
  Renderer.prototype = {
    /**
     * Initialize a new Renderer instance.
     * @param {DOMElement} el - The containing DOM element for the display.
     * @param {number} width - The coordinate width of the display, in pixels.
     * @param {number} height - The coordinate height of the display, in pixels.
     * @param {Array<number>} origin - The origin of the display, in pixels.
     *   The coordinate system will be translated to this point.
     * @param {number} [scaleFactor=1] - Optional scaleFactor by which to multiply
     *   the width and height to determine the final pixel size.
     * @return {Renderer} - This renderer instance.
     */
    initialize: function initialize(el, width, height, origin, scaleFactor) {
      this._el = el;
      return this.resize(width, height, origin, scaleFactor);
    },
    /**
     * Returns the parent container element for a visualization.
     * @return {DOMElement} - The containing DOM element.
     */
    element: function element() {
      return this._el;
    },
    /**
     * Returns the scene element (e.g., canvas or SVG) of the visualization
     * Subclasses must override if the first child is not the scene element.
     * @return {DOMElement} - The scene (e.g., canvas or SVG) element.
     */
    canvas: function canvas() {
      return this._el && this._el.firstChild;
    },
    /**
     * Get / set the background color.
     */
    background: function background(bgcolor) {
      if (arguments.length === 0) return this._bgcolor;
      this._bgcolor = bgcolor;
      return this;
    },
    /**
     * Resize the display.
     * @param {number} width - The new coordinate width of the display, in pixels.
     * @param {number} height - The new coordinate height of the display, in pixels.
     * @param {Array<number>} origin - The new origin of the display, in pixels.
     *   The coordinate system will be translated to this point.
     * @param {number} [scaleFactor=1] - Optional scaleFactor by which to multiply
     *   the width and height to determine the final pixel size.
     * @return {Renderer} - This renderer instance;
     */
    resize: function resize(width, height, origin, scaleFactor) {
      this._width = width;
      this._height = height;
      this._origin = origin || [0, 0];
      this._scale = scaleFactor || 1;
      return this;
    },
    /**
     * Report a dirty item whose bounds should be redrawn.
     * This base class method does nothing. Subclasses that perform
     * incremental should implement this method.
     * @param {Item} item - The dirty item whose bounds should be redrawn.
     */
    dirty: function dirty() {} /*item*/,
    /**
     * Render an input scenegraph, potentially with a set of dirty items.
     * This method will perform an immediate rendering with available resources.
     * The renderer may also need to perform image loading to perform a complete
     * render. This process can lead to asynchronous re-rendering of the scene
     * after this method returns. To receive notification when rendering is
     * complete, use the renderAsync method instead.
     * @param {object} scene - The root mark of a scenegraph to render.
     * @return {Renderer} - This renderer instance.
     */
    render: function render(scene) {
      var r = this;

      // bind arguments into a render call, and cache it
      // this function may be subsequently called for async redraw
      r._call = function () {
        r._render(scene);
      };

      // invoke the renderer
      r._call();

      // clear the cached call for garbage collection
      // async redraws will stash their own copy
      r._call = null;
      return r;
    },
    /**
     * Internal rendering method. Renderer subclasses should override this
     * method to actually perform rendering.
     * @param {object} scene - The root mark of a scenegraph to render.
     */
    _render: function _render() {
      // subclasses to override
    } /*scene*/,
    /**
     * Asynchronous rendering method. Similar to render, but returns a Promise
     * that resolves when all rendering is completed. Sometimes a renderer must
     * perform image loading to get a complete rendering. The returned
     * Promise will not resolve until this process completes.
     * @param {object} scene - The root mark of a scenegraph to render.
     * @return {Promise} - A Promise that resolves when rendering is complete.
     */
    renderAsync: function renderAsync(scene) {
      var r = this.render(scene);
      return this._ready ? this._ready.then(function () {
        return r;
      }) : Promise.resolve(r);
    },
    /**
     * Internal method for asynchronous resource loading.
     * Proxies method calls to the ImageLoader, and tracks loading
     * progress to invoke a re-render once complete.
     * @param {string} method - The method name to invoke on the ImageLoader.
     * @param {string} uri - The URI for the requested resource.
     * @return {Promise} - A Promise that resolves to the requested resource.
     */
    _load: function _load(method, uri) {
      var r = this,
        p = r._loader[method](uri);
      if (!r._ready) {
        // re-render the scene when loading completes
        var call = r._call;
        r._ready = r._loader.ready().then(function (redraw) {
          if (redraw) call();
          r._ready = null;
        });
      }
      return p;
    },
    /**
     * Sanitize a URL to include as a hyperlink in the rendered scene.
     * This method proxies a call to ImageLoader.sanitizeURL, but also tracks
     * image loading progress and invokes a re-render once complete.
     * @param {string} uri - The URI string to sanitize.
     * @return {Promise} - A Promise that resolves to the sanitized URL.
     */
    sanitizeURL: function sanitizeURL(uri) {
      return this._load('sanitizeURL', uri);
    },
    /**
     * Requests an image to include in the rendered scene.
     * This method proxies a call to ImageLoader.loadImage, but also tracks
     * image loading progress and invokes a re-render once complete.
     * @param {string} uri - The URI string of the image.
     * @return {Promise} - A Promise that resolves to the loaded Image.
     */
    loadImage: function loadImage(uri) {
      return this._load('loadImage', uri);
    }
  };
  var KeyDownEvent = 'keydown';
  var KeyPressEvent = 'keypress';
  var KeyUpEvent = 'keyup';
  var DragEnterEvent = 'dragenter';
  var DragLeaveEvent = 'dragleave';
  var DragOverEvent = 'dragover';
  var MouseDownEvent = 'mousedown';
  var MouseUpEvent = 'mouseup';
  var MouseMoveEvent = 'mousemove';
  var MouseOutEvent = 'mouseout';
  var MouseOverEvent = 'mouseover';
  var ClickEvent = 'click';
  var DoubleClickEvent = 'dblclick';
  var WheelEvent = 'wheel';
  var MouseWheelEvent = 'mousewheel';
  var TouchStartEvent = 'touchstart';
  var TouchMoveEvent = 'touchmove';
  var TouchEndEvent = 'touchend';
  var Events = [KeyDownEvent, KeyPressEvent, KeyUpEvent, DragEnterEvent, DragLeaveEvent, DragOverEvent, MouseDownEvent, MouseUpEvent, MouseMoveEvent, MouseOutEvent, MouseOverEvent, ClickEvent, DoubleClickEvent, WheelEvent, MouseWheelEvent, TouchStartEvent, TouchMoveEvent, TouchEndEvent];
  var TooltipShowEvent = MouseMoveEvent;
  var TooltipHideEvent = MouseOutEvent;
  var HrefEvent = ClickEvent;
  function CanvasHandler(loader, tooltip) {
    Handler.call(this, loader, tooltip);
    this._down = null;
    this._touch = null;
    this._first = true;
    this._events = {};
  }
  var eventBundle = function eventBundle(type) {
    return type === TouchStartEvent || type === TouchMoveEvent || type === TouchEndEvent ? [TouchStartEvent, TouchMoveEvent, TouchEndEvent] : [type];
  };

  // lazily add listeners to the canvas as needed
  function eventListenerCheck(handler, type) {
    eventBundle(type).forEach(function (_) {
      return addEventListener(handler, _);
    });
  }
  function addEventListener(handler, type) {
    var canvas = handler.canvas();
    if (canvas && !handler._events[type]) {
      handler._events[type] = 1;
      canvas.addEventListener(type, handler[type] ? function (evt) {
        return handler[type](evt);
      } : function (evt) {
        return handler.fire(type, evt);
      });
    }
  }
  function move(moveEvent, overEvent, outEvent) {
    return function (evt) {
      var a = this._active,
        p = this.pickEvent(evt);
      if (p === a) {
        // active item and picked item are the same
        this.fire(moveEvent, evt); // fire move
      } else {
        // active item and picked item are different
        if (!a || !a.exit) {
          // fire out for prior active item
          // suppress if active item was removed from scene
          this.fire(outEvent, evt);
        }
        this._active = p; // set new active item
        this.fire(overEvent, evt); // fire over for new active item
        this.fire(moveEvent, evt); // fire move for new active item
      }
    };
  }

  function inactive(type) {
    return function (evt) {
      this.fire(type, evt);
      this._active = null;
    };
  }
  inherits(CanvasHandler, Handler, {
    initialize: function initialize(el, origin, obj) {
      var _this4 = this;
      this._canvas = el && domFind(el, 'canvas');

      // add minimal events required for proper state management
      [ClickEvent, MouseDownEvent, MouseMoveEvent, MouseOutEvent, DragLeaveEvent].forEach(function (type) {
        return eventListenerCheck(_this4, type);
      });
      return Handler.prototype.initialize.call(this, el, origin, obj);
    },
    // return the backing canvas instance
    canvas: function canvas() {
      return this._canvas;
    },
    // retrieve the current canvas context
    context: function context() {
      return this._canvas.getContext('2d');
    },
    // supported events
    events: Events,
    // to keep old versions of firefox happy
    DOMMouseScroll: function DOMMouseScroll(evt) {
      this.fire(MouseWheelEvent, evt);
    },
    mousemove: move(MouseMoveEvent, MouseOverEvent, MouseOutEvent),
    dragover: move(DragOverEvent, DragEnterEvent, DragLeaveEvent),
    mouseout: inactive(MouseOutEvent),
    dragleave: inactive(DragLeaveEvent),
    mousedown: function mousedown(evt) {
      this._down = this._active;
      this.fire(MouseDownEvent, evt);
    },
    click: function click(evt) {
      if (this._down === this._active) {
        this.fire(ClickEvent, evt);
        this._down = null;
      }
    },
    touchstart: function touchstart(evt) {
      this._touch = this.pickEvent(evt.changedTouches[0]);
      if (this._first) {
        this._active = this._touch;
        this._first = false;
      }
      this.fire(TouchStartEvent, evt, true);
    },
    touchmove: function touchmove(evt) {
      this.fire(TouchMoveEvent, evt, true);
    },
    touchend: function touchend(evt) {
      this.fire(TouchEndEvent, evt, true);
      this._touch = null;
    },
    // fire an event
    fire: function fire(type, evt, touch) {
      var a = touch ? this._touch : this._active,
        h = this._handlers[type];

      // set event type relative to scenegraph items
      evt.vegaType = type;

      // handle hyperlinks and tooltips first
      if (type === HrefEvent && a && a.href) {
        this.handleHref(evt, a, a.href);
      } else if (type === TooltipShowEvent || type === TooltipHideEvent) {
        this.handleTooltip(evt, a, type !== TooltipHideEvent);
      }

      // invoke all registered handlers
      if (h) {
        for (var i = 0, len = h.length; i < len; ++i) {
          h[i].handler.call(this._obj, evt, a);
        }
      }
    },
    // add an event handler
    on: function on(type, handler) {
      var name = this.eventName(type),
        h = this._handlers,
        i = this._handlerIndex(h[name], type, handler);
      if (i < 0) {
        eventListenerCheck(this, type);
        (h[name] || (h[name] = [])).push({
          type: type,
          handler: handler
        });
      }
      return this;
    },
    // remove an event handler
    off: function off(type, handler) {
      var name = this.eventName(type),
        h = this._handlers[name],
        i = this._handlerIndex(h, type, handler);
      if (i >= 0) {
        h.splice(i, 1);
      }
      return this;
    },
    pickEvent: function pickEvent(evt) {
      var p = point(evt, this._canvas),
        o = this._origin;
      return this.pick(this._scene, p[0], p[1], p[0] - o[0], p[1] - o[1]);
    },
    // find the scenegraph item at the current mouse position
    // x, y -- the absolute x, y mouse coordinates on the canvas element
    // gx, gy -- the relative coordinates within the current group
    pick: function pick(scene, x, y, gx, gy) {
      var g = this.context(),
        mark = Marks[scene.marktype];
      return mark.pick.call(this, g, scene, x, y, gx, gy);
    }
  });
  function devicePixelRatio() {
    return typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  }
  var pixelRatio = devicePixelRatio();
  function _resize(canvas, width, height, origin, scaleFactor, opt) {
    var inDOM = typeof HTMLElement !== 'undefined' && canvas instanceof HTMLElement && canvas.parentNode != null,
      context = canvas.getContext('2d'),
      ratio = inDOM ? pixelRatio : scaleFactor;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    for (var key in opt) {
      context[key] = opt[key];
    }
    if (inDOM && ratio !== 1) {
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    }
    context.pixelRatio = ratio;
    context.setTransform(ratio, 0, 0, ratio, ratio * origin[0], ratio * origin[1]);
    return canvas;
  }
  function CanvasRenderer(loader) {
    Renderer.call(this, loader);
    this._options = {};
    this._redraw = false;
    this._dirty = new Bounds();
    this._tempb = new Bounds();
  }
  var base$1 = Renderer.prototype;
  var viewBounds = function viewBounds(origin, width, height) {
    return new Bounds().set(0, 0, width, height).translate(-origin[0], -origin[1]);
  };
  function clipToBounds(g, b, origin) {
    // expand bounds by 1 pixel, then round to pixel boundaries
    b.expand(1).round();

    // align to base pixel grid in case of non-integer scaling (#2425)
    if (g.pixelRatio % 1) {
      b.scale(g.pixelRatio).round().scale(1 / g.pixelRatio);
    }

    // to avoid artifacts translate if origin has fractional pixels
    b.translate(-(origin[0] % 1), -(origin[1] % 1));

    // set clip path
    g.beginPath();
    g.rect(b.x1, b.y1, b.width(), b.height());
    g.clip();
    return b;
  }
  inherits(CanvasRenderer, Renderer, {
    initialize: function initialize(el, width, height, origin, scaleFactor, options) {
      this._options = options || {};
      this._canvas = this._options.externalContext ? null : domCanvas(1, 1, this._options.type); // instantiate a small canvas

      if (el && this._canvas) {
        domClear(el, 0).appendChild(this._canvas);
        this._canvas.setAttribute('class', 'marks');
      }

      // this method will invoke resize to size the canvas appropriately
      return base$1.initialize.call(this, el, width, height, origin, scaleFactor);
    },
    resize: function resize(width, height, origin, scaleFactor) {
      base$1.resize.call(this, width, height, origin, scaleFactor);
      if (this._canvas) {
        // configure canvas size and transform
        _resize(this._canvas, this._width, this._height, this._origin, this._scale, this._options.context);
      } else {
        // external context needs to be scaled and positioned to origin
        var ctx = this._options.externalContext;
        if (!ctx) error('CanvasRenderer is missing a valid canvas or context');
        ctx.scale(this._scale, this._scale);
        ctx.translate(this._origin[0], this._origin[1]);
      }
      this._redraw = true;
      return this;
    },
    canvas: function canvas() {
      return this._canvas;
    },
    context: function context() {
      return this._options.externalContext || (this._canvas ? this._canvas.getContext('2d') : null);
    },
    dirty: function dirty(item) {
      var b = this._tempb.clear().union(item.bounds);
      var g = item.mark.group;
      while (g) {
        b.translate(g.x || 0, g.y || 0);
        g = g.mark.group;
      }
      this._dirty.union(b);
    },
    _render: function _render(scene) {
      var g = this.context(),
        o = this._origin,
        w = this._width,
        h = this._height,
        db = this._dirty,
        vb = viewBounds(o, w, h);

      // setup
      g.save();
      var b = this._redraw || db.empty() ? (this._redraw = false, vb.expand(1)) : clipToBounds(g, vb.intersect(db), o);
      this.clear(-o[0], -o[1], w, h);

      // render
      this.draw(g, scene, b);

      // takedown
      g.restore();
      db.clear();
      return this;
    },
    draw: function draw(ctx, scene, bounds) {
      var mark = Marks[scene.marktype];
      if (scene.clip) clip$2(ctx, scene);
      mark.draw.call(this, ctx, scene, bounds);
      if (scene.clip) ctx.restore();
    },
    clear: function clear(x, y, w, h) {
      var opt = this._options,
        g = this.context();
      if (opt.type !== 'pdf' && !opt.externalContext) {
        // calling clear rect voids vector output in pdf mode
        // and could remove external context content (#2615)
        g.clearRect(x, y, w, h);
      }
      if (this._bgcolor != null) {
        g.fillStyle = this._bgcolor;
        g.fillRect(x, y, w, h);
      }
    }
  });
  function SVGHandler(loader, tooltip) {
    Handler.call(this, loader, tooltip);
    var h = this;
    h._hrefHandler = listener(h, function (evt, item) {
      if (item && item.href) h.handleHref(evt, item, item.href);
    });
    h._tooltipHandler = listener(h, function (evt, item) {
      h.handleTooltip(evt, item, evt.type !== TooltipHideEvent);
    });
  }

  // wrap an event listener for the SVG DOM
  var listener = function listener(context, handler) {
    return function (evt) {
      var item = evt.target.__data__;
      item = Array.isArray(item) ? item[0] : item;
      evt.vegaType = evt.type;
      handler.call(context._obj, evt, item);
    };
  };
  inherits(SVGHandler, Handler, {
    initialize: function initialize(el, origin, obj) {
      var svg = this._svg;
      if (svg) {
        svg.removeEventListener(HrefEvent, this._hrefHandler);
        svg.removeEventListener(TooltipShowEvent, this._tooltipHandler);
        svg.removeEventListener(TooltipHideEvent, this._tooltipHandler);
      }
      this._svg = svg = el && domFind(el, 'svg');
      if (svg) {
        svg.addEventListener(HrefEvent, this._hrefHandler);
        svg.addEventListener(TooltipShowEvent, this._tooltipHandler);
        svg.addEventListener(TooltipHideEvent, this._tooltipHandler);
      }
      return Handler.prototype.initialize.call(this, el, origin, obj);
    },
    canvas: function canvas() {
      return this._svg;
    },
    // add an event handler
    on: function on(type, handler) {
      var name = this.eventName(type),
        h = this._handlers,
        i = this._handlerIndex(h[name], type, handler);
      if (i < 0) {
        var _x2 = {
          type: type,
          handler: handler,
          listener: listener(this, handler)
        };
        (h[name] || (h[name] = [])).push(_x2);
        if (this._svg) {
          this._svg.addEventListener(name, _x2.listener);
        }
      }
      return this;
    },
    // remove an event handler
    off: function off(type, handler) {
      var name = this.eventName(type),
        h = this._handlers[name],
        i = this._handlerIndex(h, type, handler);
      if (i >= 0) {
        if (this._svg) {
          this._svg.removeEventListener(name, h[i].listener);
        }
        h.splice(i, 1);
      }
      return this;
    }
  });
  var ARIA_HIDDEN = 'aria-hidden';
  var ARIA_LABEL = 'aria-label';
  var ARIA_ROLE = 'role';
  var ARIA_ROLEDESCRIPTION = 'aria-roledescription';
  var GRAPHICS_OBJECT = 'graphics-object';
  var GRAPHICS_SYMBOL = 'graphics-symbol';
  var bundle = function bundle(role, roledesc, label) {
    var _ref;
    return _ref = {}, _defineProperty(_ref, ARIA_ROLE, role), _defineProperty(_ref, ARIA_ROLEDESCRIPTION, roledesc), _defineProperty(_ref, ARIA_LABEL, label || undefined), _ref;
  };

  // these roles are covered by related roles
  // we can ignore them, no need to generate attributes
  var AriaIgnore = toSet(['axis-domain', 'axis-grid', 'axis-label', 'axis-tick', 'axis-title', 'legend-band', 'legend-entry', 'legend-gradient', 'legend-label', 'legend-title', 'legend-symbol', 'title']);

  // aria attribute generators for guide roles
  var AriaGuides = {
    'axis': {
      desc: 'axis',
      caption: axisCaption
    },
    'legend': {
      desc: 'legend',
      caption: legendCaption
    },
    'title-text': {
      desc: 'title',
      caption: function caption(item) {
        return "Title text '".concat(titleCaption(item), "'");
      }
    },
    'title-subtitle': {
      desc: 'subtitle',
      caption: function caption(item) {
        return "Subtitle text '".concat(titleCaption(item), "'");
      }
    }
  };

  // aria properties generated for mark item encoding channels
  var AriaEncode = {
    ariaRole: ARIA_ROLE,
    ariaRoleDescription: ARIA_ROLEDESCRIPTION,
    description: ARIA_LABEL
  };
  function ariaItemAttributes(emit, item) {
    var hide = item.aria === false;
    emit(ARIA_HIDDEN, hide || undefined);
    if (hide || item.description == null) {
      for (var prop in AriaEncode) {
        emit(AriaEncode[prop], undefined);
      }
    } else {
      var _type = item.mark.marktype;
      emit(ARIA_LABEL, item.description);
      emit(ARIA_ROLE, item.ariaRole || (_type === 'group' ? GRAPHICS_OBJECT : GRAPHICS_SYMBOL));
      emit(ARIA_ROLEDESCRIPTION, item.ariaRoleDescription || "".concat(_type, " mark"));
    }
  }
  function ariaMarkAttributes(mark) {
    return mark.aria === false ? _defineProperty({}, ARIA_HIDDEN, true) : AriaIgnore[mark.role] ? null : AriaGuides[mark.role] ? ariaGuide(mark, AriaGuides[mark.role]) : ariaMark(mark);
  }
  function ariaMark(mark) {
    var type = mark.marktype;
    var recurse = type === 'group' || type === 'text' || mark.items.some(function (_) {
      return _.description != null && _.aria !== false;
    });
    return bundle(recurse ? GRAPHICS_OBJECT : GRAPHICS_SYMBOL, "".concat(type, " mark container"), mark.description);
  }
  function ariaGuide(mark, opt) {
    try {
      var item = mark.items[0],
        caption = opt.caption || function () {
          return '';
        };
      return bundle(opt.role || GRAPHICS_SYMBOL, opt.desc, item.description || caption(item));
    } catch (err) {
      return null;
    }
  }
  function titleCaption(item) {
    return array$2(item.text).join(' ');
  }
  function axisCaption(item) {
    var datum = item.datum,
      orient = item.orient,
      title = datum.title ? extractTitle(item) : null,
      ctx = item.context,
      scale = ctx.scales[datum.scale].value,
      locale = ctx.dataflow.locale(),
      type = scale.type,
      xy = orient === 'left' || orient === 'right' ? 'Y' : 'X';
    return "".concat(xy, "-axis") + (title ? " titled '".concat(title, "'") : '') + " for a ".concat(isDiscrete(type) ? 'discrete' : type, " scale") + " with ".concat(domainCaption(locale, scale, item));
  }
  function legendCaption(item) {
    var datum = item.datum,
      title = datum.title ? extractTitle(item) : null,
      type = "".concat(datum.type || '', " legend").trim(),
      scales = datum.scales,
      props = Object.keys(scales),
      ctx = item.context,
      scale = ctx.scales[scales[props[0]]].value,
      locale = ctx.dataflow.locale();
    return capitalize(type) + (title ? " titled '".concat(title, "'") : '') + " for ".concat(channelCaption(props)) + " with ".concat(domainCaption(locale, scale, item));
  }
  function extractTitle(item) {
    try {
      return array$2(peek$1(item.items).items[0].text).join(' ');
    } catch (err) {
      return null;
    }
  }
  function channelCaption(props) {
    props = props.map(function (p) {
      return p + (p === 'fill' || p === 'stroke' ? ' color' : '');
    });
    return props.length < 2 ? props[0] : props.slice(0, -1).join(', ') + ' and ' + peek$1(props);
  }
  function capitalize(s) {
    return s.length ? s[0].toUpperCase() + s.slice(1) : s;
  }
  var innerText = function innerText(val) {
    return (val + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  var attrText = function attrText(val) {
    return innerText(val).replace(/"/g, '&quot;').replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
  };
  function markup() {
    var buf = '',
      outer = '',
      inner = '';
    var stack = [],
      clear = function clear() {
        return outer = inner = '';
      },
      push = function push(tag) {
        if (outer) {
          buf += "".concat(outer, ">").concat(inner);
          clear();
        }
        stack.push(tag);
      },
      attr = function attr(name, value) {
        if (value != null) outer += " ".concat(name, "=\"").concat(attrText(value), "\"");
        return m;
      },
      m = {
        open: function open(tag) {
          push(tag);
          outer = '<' + tag;
          for (var _len = arguments.length, attrs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            attrs[_key - 1] = arguments[_key];
          }
          for (var _i = 0, _attrs = attrs; _i < _attrs.length; _i++) {
            var set = _attrs[_i];
            for (var key in set) attr(key, set[key]);
          }
          return m;
        },
        close: function close() {
          var tag = stack.pop();
          if (outer) {
            buf += outer + (inner ? ">".concat(inner, "</").concat(tag, ">") : '/>');
          } else {
            buf += "</".concat(tag, ">");
          }
          clear();
          return m;
        },
        attr: attr,
        text: function text(t) {
          return inner += innerText(t), m;
        },
        toString: function toString() {
          return buf;
        }
      };
    return m;
  }
  var serializeXML = function serializeXML(node) {
    return _serialize(markup(), node) + '';
  };
  function _serialize(m, node) {
    m.open(node.tagName);
    if (node.hasAttributes()) {
      var attrs = node.attributes,
        n = attrs.length;
      for (var i = 0; i < n; ++i) {
        m.attr(attrs[i].name, attrs[i].value);
      }
    }
    if (node.hasChildNodes()) {
      var children = node.childNodes;
      var _iterator = _createForOfIteratorHelper(children),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var child = _step.value;
          child.nodeType === 3 // text node
          ? m.text(child.nodeValue) : _serialize(m, child);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return m.close();
  }
  var stylesAttr = {
    fill: 'fill',
    fillOpacity: 'fill-opacity',
    stroke: 'stroke',
    strokeOpacity: 'stroke-opacity',
    strokeWidth: 'stroke-width',
    strokeCap: 'stroke-linecap',
    strokeJoin: 'stroke-linejoin',
    strokeDash: 'stroke-dasharray',
    strokeDashOffset: 'stroke-dashoffset',
    strokeMiterLimit: 'stroke-miterlimit',
    opacity: 'opacity'
  };
  var stylesCss = {
    blend: 'mix-blend-mode'
  };

  // ensure miter limit default is consistent with canvas (#2498)
  var rootAttributes = {
    'fill': 'none',
    'stroke-miterlimit': 10
  };
  var RootIndex = 0,
    xmlns = 'http://www.w3.org/2000/xmlns/',
    svgns = metadata.xmlns;
  function SVGRenderer(loader) {
    Renderer.call(this, loader);
    this._dirtyID = 0;
    this._dirty = [];
    this._svg = null;
    this._root = null;
    this._defs = null;
  }
  var base = Renderer.prototype;
  inherits(SVGRenderer, Renderer, {
    /**
     * Initialize a new SVGRenderer instance.
     * @param {DOMElement} el - The containing DOM element for the display.
     * @param {number} width - The coordinate width of the display, in pixels.
     * @param {number} height - The coordinate height of the display, in pixels.
     * @param {Array<number>} origin - The origin of the display, in pixels.
     *   The coordinate system will be translated to this point.
     * @param {number} [scaleFactor=1] - Optional scaleFactor by which to multiply
     *   the width and height to determine the final pixel size.
     * @return {SVGRenderer} - This renderer instance.
     */
    initialize: function initialize(el, width, height, origin, scaleFactor) {
      // create the svg definitions cache
      this._defs = {};
      this._clearDefs();
      if (el) {
        this._svg = domChild(el, 0, 'svg', svgns);
        this._svg.setAttributeNS(xmlns, 'xmlns', svgns);
        this._svg.setAttributeNS(xmlns, 'xmlns:xlink', metadata['xmlns:xlink']);
        this._svg.setAttribute('version', metadata['version']);
        this._svg.setAttribute('class', 'marks');
        domClear(el, 1);

        // set the svg root group
        this._root = domChild(this._svg, RootIndex, 'g', svgns);
        setAttributes(this._root, rootAttributes);

        // ensure no additional child elements
        domClear(this._svg, RootIndex + 1);
      }

      // set background color if defined
      this.background(this._bgcolor);
      return base.initialize.call(this, el, width, height, origin, scaleFactor);
    },
    /**
     * Get / set the background color.
     */
    background: function background(bgcolor) {
      if (arguments.length && this._svg) {
        this._svg.style.setProperty('background-color', bgcolor);
      }
      return base.background.apply(this, arguments);
    },
    /**
     * Resize the display.
     * @param {number} width - The new coordinate width of the display, in pixels.
     * @param {number} height - The new coordinate height of the display, in pixels.
     * @param {Array<number>} origin - The new origin of the display, in pixels.
     *   The coordinate system will be translated to this point.
     * @param {number} [scaleFactor=1] - Optional scaleFactor by which to multiply
     *   the width and height to determine the final pixel size.
     * @return {SVGRenderer} - This renderer instance;
     */
    resize: function resize(width, height, origin, scaleFactor) {
      base.resize.call(this, width, height, origin, scaleFactor);
      if (this._svg) {
        setAttributes(this._svg, {
          width: this._width * this._scale,
          height: this._height * this._scale,
          viewBox: "0 0 ".concat(this._width, " ").concat(this._height)
        });
        this._root.setAttribute('transform', "translate(".concat(this._origin, ")"));
      }
      this._dirty = [];
      return this;
    },
    /**
     * Returns the SVG element of the visualization.
     * @return {DOMElement} - The SVG element.
     */
    canvas: function canvas() {
      return this._svg;
    },
    /**
     * Returns an SVG text string for the rendered content,
     * or null if this renderer is currently headless.
     */
    svg: function svg() {
      var svg = this._svg,
        bg = this._bgcolor;
      if (!svg) return null;
      var node;
      if (bg) {
        svg.removeAttribute('style');
        node = domChild(svg, RootIndex, 'rect', svgns);
        setAttributes(node, {
          width: this._width,
          height: this._height,
          fill: bg
        });
      }
      var text = serializeXML(svg);
      if (bg) {
        svg.removeChild(node);
        this._svg.style.setProperty('background-color', bg);
      }
      return text;
    },
    /**
     * Internal rendering method.
     * @param {object} scene - The root mark of a scenegraph to render.
     */
    _render: function _render(scene) {
      // perform spot updates and re-render markup
      if (this._dirtyCheck()) {
        if (this._dirtyAll) this._clearDefs();
        this.mark(this._root, scene);
        domClear(this._root, 1);
      }
      this.defs();
      this._dirty = [];
      ++this._dirtyID;
      return this;
    },
    // -- Manage rendering of items marked as dirty --
    /**
     * Flag a mark item as dirty.
     * @param {Item} item - The mark item.
     */
    dirty: function dirty(item) {
      if (item.dirty !== this._dirtyID) {
        item.dirty = this._dirtyID;
        this._dirty.push(item);
      }
    },
    /**
     * Check if a mark item is considered dirty.
     * @param {Item} item - The mark item.
     */
    isDirty: function isDirty(item) {
      return this._dirtyAll || !item._svg || !item._svg.ownerSVGElement || item.dirty === this._dirtyID;
    },
    /**
     * Internal method to check dirty status and, if possible,
     * make targetted updates without a full rendering pass.
     */
    _dirtyCheck: function _dirtyCheck() {
      this._dirtyAll = true;
      var items = this._dirty;
      if (!items.length || !this._dirtyID) return true;
      var id = ++this._dirtyID;
      var item, mark, type, mdef, i, n, o;
      for (i = 0, n = items.length; i < n; ++i) {
        item = items[i];
        mark = item.mark;
        if (mark.marktype !== type) {
          // memoize mark instance lookup
          type = mark.marktype;
          mdef = Marks[type];
        }
        if (mark.zdirty && mark.dirty !== id) {
          this._dirtyAll = false;
          dirtyParents(item, id);
          mark.items.forEach(function (i) {
            i.dirty = id;
          });
        }
        if (mark.zdirty) continue; // handle in standard drawing pass

        if (item.exit) {
          // EXIT
          if (mdef.nested && mark.items.length) {
            // if nested mark with remaining points, update instead
            o = mark.items[0];
            if (o._svg) this._update(mdef, o._svg, o);
          } else if (item._svg) {
            // otherwise remove from DOM
            o = item._svg.parentNode;
            if (o) o.removeChild(item._svg);
          }
          item._svg = null;
          continue;
        }
        item = mdef.nested ? mark.items[0] : item;
        if (item._update === id) continue; // already visited

        if (!item._svg || !item._svg.ownerSVGElement) {
          // ENTER
          this._dirtyAll = false;
          dirtyParents(item, id);
        } else {
          // IN-PLACE UPDATE
          this._update(mdef, item._svg, item);
        }
        item._update = id;
      }
      return !this._dirtyAll;
    },
    // -- Construct & maintain scenegraph to SVG mapping ---
    /**
     * Render a set of mark items.
     * @param {SVGElement} el - The parent element in the SVG tree.
     * @param {object} scene - The mark parent to render.
     * @param {SVGElement} prev - The previous sibling in the SVG tree.
     */
    mark: function mark(el, scene, prev) {
      var _this5 = this;
      if (!this.isDirty(scene)) {
        return scene._svg;
      }
      var svg = this._svg,
        mdef = Marks[scene.marktype],
        events = scene.interactive === false ? 'none' : null,
        isGroup = mdef.tag === 'g';
      var parent = bind$1(scene, el, prev, 'g', svg);
      parent.setAttribute('class', cssClass(scene));

      // apply aria attributes to parent container element
      var aria = ariaMarkAttributes(scene);
      for (var key in aria) setAttribute(parent, key, aria[key]);
      if (!isGroup) {
        setAttribute(parent, 'pointer-events', events);
      }
      setAttribute(parent, 'clip-path', scene.clip ? clip$1(this, scene, scene.group) : null);
      var sibling = null,
        i = 0;
      var process = function process(item) {
        var dirty = _this5.isDirty(item),
          node = bind$1(item, parent, sibling, mdef.tag, svg);
        if (dirty) {
          _this5._update(mdef, node, item);
          if (isGroup) recurse(_this5, node, item);
        }
        sibling = node;
        ++i;
      };
      if (mdef.nested) {
        if (scene.items.length) process(scene.items[0]);
      } else {
        visit(scene, process);
      }
      domClear(parent, i);
      return parent;
    },
    /**
     * Update the attributes of an SVG element for a mark item.
     * @param {object} mdef - The mark definition object
     * @param {SVGElement} el - The SVG element.
     * @param {Item} item - The mark item.
     */
    _update: function _update(mdef, el, item) {
      // set dom element and values cache
      // provides access to emit method
      element$1 = el;
      values = el.__values__;

      // apply aria-specific properties
      ariaItemAttributes(emit, item);

      // apply svg attributes
      mdef.attr(emit, item, this);

      // some marks need special treatment
      var extra = mark_extras[mdef.type];
      if (extra) extra.call(this, mdef, el, item);

      // apply svg style attributes
      // note: element state may have been modified by 'extra' method
      if (element$1) this.style(element$1, item);
    },
    /**
     * Update the presentation attributes of an SVG element for a mark item.
     * @param {SVGElement} el - The SVG element.
     * @param {Item} item - The mark item.
     */
    style: function style(el, item) {
      if (item == null) return;
      for (var prop in stylesAttr) {
        var _value2 = prop === 'font' ? fontFamily(item) : item[prop];
        if (_value2 === values[prop]) continue;
        var name = stylesAttr[prop];
        if (_value2 == null) {
          el.removeAttribute(name);
        } else {
          if (isGradient(_value2)) {
            _value2 = gradientRef(_value2, this._defs.gradient, href());
          }
          el.setAttribute(name, _value2 + '');
        }
        values[prop] = _value2;
      }
      for (var _prop in stylesCss) {
        setStyle(el, stylesCss[_prop], item[_prop]);
      }
    },
    /**
     * Render SVG defs, as needed.
     * Must be called *after* marks have been processed to ensure the
     * collected state is current and accurate.
     */
    defs: function defs() {
      var svg = this._svg,
        defs = this._defs;
      var el = defs.el,
        index = 0;
      for (var id in defs.gradient) {
        if (!el) defs.el = el = domChild(svg, RootIndex + 1, 'defs', svgns);
        index = updateGradient(el, defs.gradient[id], index);
      }
      for (var _id in defs.clipping) {
        if (!el) defs.el = el = domChild(svg, RootIndex + 1, 'defs', svgns);
        index = updateClipping(el, defs.clipping[_id], index);
      }

      // clean-up
      if (el) {
        index === 0 ? (svg.removeChild(el), defs.el = null) : domClear(el, index);
      }
    },
    /**
     * Clear defs caches.
     */
    _clearDefs: function _clearDefs() {
      var def = this._defs;
      def.gradient = {};
      def.clipping = {};
    }
  });

  // mark ancestor chain with a dirty id
  function dirtyParents(item, id) {
    for (; item && item.dirty !== id; item = item.mark.group) {
      item.dirty = id;
      if (item.mark && item.mark.dirty !== id) {
        item.mark.dirty = id;
      } else return;
    }
  }

  // update gradient definitions
  function updateGradient(el, grad, index) {
    var i, n, stop;
    if (grad.gradient === 'radial') {
      // SVG radial gradients automatically transform to normalized bbox
      // coordinates, in a way that is cumbersome to replicate in canvas.
      // We wrap the radial gradient in a pattern element, allowing us to
      // maintain a circular gradient that matches what canvas provides.
      var pt = domChild(el, index++, 'pattern', svgns);
      setAttributes(pt, {
        id: patternPrefix + grad.id,
        viewBox: '0,0,1,1',
        width: '100%',
        height: '100%',
        preserveAspectRatio: 'xMidYMid slice'
      });
      pt = domChild(pt, 0, 'rect', svgns);
      setAttributes(pt, {
        width: 1,
        height: 1,
        fill: "url(".concat(href(), "#").concat(grad.id, ")")
      });
      el = domChild(el, index++, 'radialGradient', svgns);
      setAttributes(el, {
        id: grad.id,
        fx: grad.x1,
        fy: grad.y1,
        fr: grad.r1,
        cx: grad.x2,
        cy: grad.y2,
        r: grad.r2
      });
    } else {
      el = domChild(el, index++, 'linearGradient', svgns);
      setAttributes(el, {
        id: grad.id,
        x1: grad.x1,
        x2: grad.x2,
        y1: grad.y1,
        y2: grad.y2
      });
    }
    for (i = 0, n = grad.stops.length; i < n; ++i) {
      stop = domChild(el, i, 'stop', svgns);
      stop.setAttribute('offset', grad.stops[i].offset);
      stop.setAttribute('stop-color', grad.stops[i].color);
    }
    domClear(el, i);
    return index;
  }

  // update clipping path definitions
  function updateClipping(el, clip, index) {
    var mask;
    el = domChild(el, index, 'clipPath', svgns);
    el.setAttribute('id', clip.id);
    if (clip.path) {
      mask = domChild(el, 0, 'path', svgns);
      mask.setAttribute('d', clip.path);
    } else {
      mask = domChild(el, 0, 'rect', svgns);
      setAttributes(mask, {
        x: 0,
        y: 0,
        width: clip.width,
        height: clip.height
      });
    }
    domClear(el, 1);
    return index + 1;
  }

  // Recursively process group contents.
  function recurse(renderer, el, group) {
    // child 'g' element is second to last among children (path, g, path)
    // other children here are foreground and background path elements
    el = el.lastChild.previousSibling;
    var prev,
      idx = 0;
    visit(group, function (item) {
      prev = renderer.mark(el, item, prev);
      ++idx;
    });

    // remove any extraneous DOM elements
    domClear(el, 1 + idx);
  }

  // Bind a scenegraph item to an SVG DOM element.
  // Create new SVG elements as needed.
  function bind$1(item, el, sibling, tag, svg) {
    var node = item._svg,
      doc;

    // create a new dom node if needed
    if (!node) {
      doc = el.ownerDocument;
      node = domCreate(doc, tag, svgns);
      item._svg = node;
      if (item.mark) {
        node.__data__ = item;
        node.__values__ = {
          fill: 'default'
        };

        // if group, create background, content, and foreground elements
        if (tag === 'g') {
          var bg = domCreate(doc, 'path', svgns);
          node.appendChild(bg);
          bg.__data__ = item;
          var cg = domCreate(doc, 'g', svgns);
          node.appendChild(cg);
          cg.__data__ = item;
          var fg = domCreate(doc, 'path', svgns);
          node.appendChild(fg);
          fg.__data__ = item;
          fg.__values__ = {
            fill: 'default'
          };
        }
      }
    }

    // (re-)insert if (a) not contained in SVG or (b) sibling order has changed
    if (node.ownerSVGElement !== svg || siblingCheck(node, sibling)) {
      el.insertBefore(node, sibling ? sibling.nextSibling : el.firstChild);
    }
    return node;
  }

  // check if two nodes are ordered siblings
  function siblingCheck(node, sibling) {
    return node.parentNode && node.parentNode.childNodes.length > 1 && node.previousSibling != sibling; // treat null/undefined the same
  }

  // -- Set attributes & styles on SVG elements ---

  var element$1 = null,
    // temp var for current SVG element
    values = null; // temp var for current values hash

  // Extra configuration for certain mark types
  var mark_extras = {
    group: function group(mdef, el, item) {
      var fg = element$1 = el.childNodes[2];
      values = fg.__values__;
      mdef.foreground(emit, item, this);
      values = el.__values__; // use parent's values hash
      element$1 = el.childNodes[1];
      mdef.content(emit, item, this);
      var bg = element$1 = el.childNodes[0];
      mdef.background(emit, item, this);
      var value = item.mark.interactive === false ? 'none' : null;
      if (value !== values.events) {
        setAttribute(fg, 'pointer-events', value);
        setAttribute(bg, 'pointer-events', value);
        values.events = value;
      }
      if (item.strokeForeground && item.stroke) {
        var _fill = item.fill;
        setAttribute(fg, 'display', null);

        // set style of background
        this.style(bg, item);
        setAttribute(bg, 'stroke', null);

        // set style of foreground
        if (_fill) item.fill = null;
        values = fg.__values__;
        this.style(fg, item);
        if (_fill) item.fill = _fill;

        // leave element null to prevent downstream styling
        element$1 = null;
      } else {
        // ensure foreground is ignored
        setAttribute(fg, 'display', 'none');
      }
    },
    image: function image(mdef, el, item) {
      if (item.smooth === false) {
        setStyle(el, 'image-rendering', 'optimizeSpeed');
        setStyle(el, 'image-rendering', 'pixelated');
      } else {
        setStyle(el, 'image-rendering', null);
      }
    },
    text: function text(mdef, el, item) {
      var tl = textLines(item);
      var key, value, doc, lh;
      if (isArray(tl)) {
        // multi-line text
        value = tl.map(function (_) {
          return textValue(item, _);
        });
        key = value.join('\n'); // content cache key

        if (key !== values.text) {
          domClear(el, 0);
          doc = el.ownerDocument;
          lh = lineHeight(item);
          value.forEach(function (t, i) {
            var ts = domCreate(doc, 'tspan', svgns);
            ts.__data__ = item; // data binding
            ts.textContent = t;
            if (i) {
              ts.setAttribute('x', 0);
              ts.setAttribute('dy', lh);
            }
            el.appendChild(ts);
          });
          values.text = key;
        }
      } else {
        // single-line text
        value = textValue(item, tl);
        if (value !== values.text) {
          el.textContent = value;
          values.text = value;
        }
      }
      setAttribute(el, 'font-family', fontFamily(item));
      setAttribute(el, 'font-size', fontSize(item) + 'px');
      setAttribute(el, 'font-style', item.fontStyle);
      setAttribute(el, 'font-variant', item.fontVariant);
      setAttribute(el, 'font-weight', item.fontWeight);
    }
  };
  function emit(name, value, ns) {
    // early exit if value is unchanged
    if (value === values[name]) return;

    // use appropriate method given namespace (ns)
    if (ns) {
      setAttributeNS(element$1, name, value, ns);
    } else {
      setAttribute(element$1, name, value);
    }

    // note current value for future comparison
    values[name] = value;
  }
  function setStyle(el, name, value) {
    if (value !== values[name]) {
      if (value == null) {
        el.style.removeProperty(name);
      } else {
        el.style.setProperty(name, value + '');
      }
      values[name] = value;
    }
  }
  function setAttributes(el, attrs) {
    for (var key in attrs) {
      setAttribute(el, key, attrs[key]);
    }
  }
  function setAttribute(el, name, value) {
    if (value != null) {
      // if value is provided, update DOM attribute
      el.setAttribute(name, value);
    } else {
      // else remove DOM attribute
      el.removeAttribute(name);
    }
  }
  function setAttributeNS(el, name, value, ns) {
    if (value != null) {
      // if value is provided, update DOM attribute
      el.setAttributeNS(ns, name, value);
    } else {
      // else remove DOM attribute
      el.removeAttributeNS(ns, name);
    }
  }
  function href() {
    var loc;
    return typeof window === 'undefined' ? '' : (loc = window.location).hash ? loc.href.slice(0, -loc.hash.length) : loc.href;
  }
  function SVGStringRenderer(loader) {
    Renderer.call(this, loader);
    this._text = null;
    this._defs = {
      gradient: {},
      clipping: {}
    };
  }
  inherits(SVGStringRenderer, Renderer, {
    /**
     * Returns the rendered SVG text string,
     * or null if rendering has not yet occurred.
     */
    svg: function svg() {
      return this._text;
    },
    /**
     * Internal rendering method.
     * @param {object} scene - The root mark of a scenegraph to render.
     */
    _render: function _render(scene) {
      var m = markup();

      // svg tag
      m.open('svg', extend({}, metadata, {
        class: 'marks',
        width: this._width * this._scale,
        height: this._height * this._scale,
        viewBox: "0 0 ".concat(this._width, " ").concat(this._height)
      }));

      // background, if defined
      var bg = this._bgcolor;
      if (bg && bg !== 'transparent' && bg !== 'none') {
        m.open('rect', {
          width: this._width,
          height: this._height,
          fill: bg
        }).close();
      }

      // root content group
      m.open('g', rootAttributes, {
        transform: 'translate(' + this._origin + ')'
      });
      this.mark(m, scene);
      m.close(); // </g>

      // defs
      this.defs(m);

      // get SVG text string
      this._text = m.close() + '';
      return this;
    },
    /**
     * Render a set of mark items.
     * @param {object} m - The markup context.
     * @param {object} scene - The mark parent to render.
     */
    mark: function mark(m, scene) {
      var _this6 = this;
      var mdef = Marks[scene.marktype],
        tag = mdef.tag,
        attrList = [ariaItemAttributes, mdef.attr];

      // render opening group tag
      m.open('g', {
        'class': cssClass(scene),
        'clip-path': scene.clip ? clip$1(this, scene, scene.group) : null
      }, ariaMarkAttributes(scene), {
        'pointer-events': tag !== 'g' && scene.interactive === false ? 'none' : null
      });

      // render contained elements
      var process = function process(item) {
        var href = _this6.href(item);
        if (href) m.open('a', href);
        m.open(tag, _this6.attr(scene, item, attrList, tag !== 'g' ? tag : null));
        if (tag === 'text') {
          var _tl = textLines(item);
          if (isArray(_tl)) {
            // multi-line text
            var attrs = {
              x: 0,
              dy: lineHeight(item)
            };
            for (var i = 0; i < _tl.length; ++i) {
              m.open('tspan', i ? attrs : null).text(textValue(item, _tl[i])).close();
            }
          } else {
            // single-line text
            m.text(textValue(item, _tl));
          }
        } else if (tag === 'g') {
          var fore = item.strokeForeground,
            _fill2 = item.fill,
            _stroke = item.stroke;
          if (fore && _stroke) {
            item.stroke = null;
          }
          m.open('path', _this6.attr(scene, item, mdef.background, 'bgrect')).close();

          // recurse for group content
          m.open('g', _this6.attr(scene, item, mdef.content));
          visit(item, function (scene) {
            return _this6.mark(m, scene);
          });
          m.close();
          if (fore && _stroke) {
            if (_fill2) item.fill = null;
            item.stroke = _stroke;
            m.open('path', _this6.attr(scene, item, mdef.foreground, 'bgrect')).close();
            if (_fill2) item.fill = _fill2;
          } else {
            m.open('path', _this6.attr(scene, item, mdef.foreground, 'bgfore')).close();
          }
        }
        m.close(); // </tag>
        if (href) m.close(); // </a>
      };

      if (mdef.nested) {
        if (scene.items && scene.items.length) process(scene.items[0]);
      } else {
        visit(scene, process);
      }

      // render closing group tag
      return m.close(); // </g>
    },
    /**
     * Get href attributes for a hyperlinked mark item.
     * @param {Item} item - The mark item.
     */
    href: function href(item) {
      var _this7 = this;
      var href = item.href;
      var attr;
      if (href) {
        if (attr = this._hrefs && this._hrefs[href]) {
          return attr;
        } else {
          this.sanitizeURL(href).then(function (attr) {
            // rewrite to use xlink namespace
            attr['xlink:href'] = attr.href;
            attr.href = null;
            (_this7._hrefs || (_this7._hrefs = {}))[href] = attr;
          });
        }
      }
      return null;
    },
    /**
     * Get an object of SVG attributes for a mark item.
     * @param {object} scene - The mark parent.
     * @param {Item} item - The mark item.
     * @param {array|function} attrs - One or more attribute emitters.
     * @param {string} tag - The tag being rendered.
     */
    attr: function attr(scene, item, attrs, tag) {
      var _this8 = this;
      var object = {},
        emit = function emit(name, value, ns, prefixed) {
          object[prefixed || name] = value;
        };

      // apply mark specific attributes
      if (Array.isArray(attrs)) {
        attrs.forEach(function (fn) {
          return fn(emit, item, _this8);
        });
      } else {
        attrs(emit, item, this);
      }

      // apply style attributes
      if (tag) {
        style(object, item, scene, tag, this._defs);
      }
      return object;
    },
    /**
     * Render SVG defs, as needed.
     * Must be called *after* marks have been processed to ensure the
     * collected state is current and accurate.
     * @param {object} m - The markup context.
     */
    defs: function defs(m) {
      var gradient = this._defs.gradient,
        clipping = this._defs.clipping,
        count = Object.keys(gradient).length + Object.keys(clipping).length;
      if (count === 0) return; // nothing to do

      m.open('defs');
      for (var id in gradient) {
        var _def = gradient[id],
          stops = _def.stops;
        if (_def.gradient === 'radial') {
          // SVG radial gradients automatically transform to normalized bbox
          // coordinates, in a way that is cumbersome to replicate in canvas.
          // We wrap the radial gradient in a pattern element, allowing us to
          // maintain a circular gradient that matches what canvas provides.

          m.open('pattern', {
            id: patternPrefix + id,
            viewBox: '0,0,1,1',
            width: '100%',
            height: '100%',
            preserveAspectRatio: 'xMidYMid slice'
          });
          m.open('rect', {
            width: '1',
            height: '1',
            fill: 'url(#' + id + ')'
          }).close();
          m.close(); // </pattern>

          m.open('radialGradient', {
            id: id,
            fx: _def.x1,
            fy: _def.y1,
            fr: _def.r1,
            cx: _def.x2,
            cy: _def.y2,
            r: _def.r2
          });
        } else {
          m.open('linearGradient', {
            id: id,
            x1: _def.x1,
            x2: _def.x2,
            y1: _def.y1,
            y2: _def.y2
          });
        }
        for (var i = 0; i < stops.length; ++i) {
          m.open('stop', {
            offset: stops[i].offset,
            'stop-color': stops[i].color
          }).close();
        }
        m.close();
      }
      for (var _id2 in clipping) {
        var _def2 = clipping[_id2];
        m.open('clipPath', {
          id: _id2
        });
        if (_def2.path) {
          m.open('path', {
            d: _def2.path
          }).close();
        } else {
          m.open('rect', {
            x: 0,
            y: 0,
            width: _def2.width,
            height: _def2.height
          }).close();
        }
        m.close();
      }
      m.close();
    }
  });

  // Helper function for attr for style presentation attributes
  function style(s, item, scene, tag, defs) {
    var styleList;
    if (item == null) return s;
    if (tag === 'bgrect' && scene.interactive === false) {
      s['pointer-events'] = 'none';
    }
    if (tag === 'bgfore') {
      if (scene.interactive === false) {
        s['pointer-events'] = 'none';
      }
      s.display = 'none';
      if (item.fill !== null) return s;
    }
    if (tag === 'image' && item.smooth === false) {
      styleList = ['image-rendering: optimizeSpeed;', 'image-rendering: pixelated;'];
    }
    if (tag === 'text') {
      s['font-family'] = fontFamily(item);
      s['font-size'] = fontSize(item) + 'px';
      s['font-style'] = item.fontStyle;
      s['font-variant'] = item.fontVariant;
      s['font-weight'] = item.fontWeight;
    }
    for (var prop in stylesAttr) {
      var _value3 = item[prop];
      var name = stylesAttr[prop];
      if (_value3 === 'transparent' && (name === 'fill' || name === 'stroke')) ;else if (_value3 != null) {
        if (isGradient(_value3)) {
          _value3 = gradientRef(_value3, defs.gradient, '');
        }
        s[name] = _value3;
      }
    }
    for (var _prop2 in stylesCss) {
      var _value4 = item[_prop2];
      if (_value4 != null) {
        styleList = styleList || [];
        styleList.push("".concat(stylesCss[_prop2], ": ").concat(_value4, ";"));
      }
    }
    if (styleList) {
      s.style = styleList.join(' ');
    }
    return s;
  }
  var Canvas = 'canvas';
  var PNG = 'png';
  var SVG = 'svg';
  var None$1 = 'none';
  var RenderType = {
    Canvas: Canvas,
    PNG: PNG,
    SVG: SVG,
    None: None$1
  };
  var modules = {};
  modules[Canvas] = modules[PNG] = {
    renderer: CanvasRenderer,
    headless: CanvasRenderer,
    handler: CanvasHandler
  };
  modules[SVG] = {
    renderer: SVGRenderer,
    headless: SVGStringRenderer,
    handler: SVGHandler
  };
  modules[None$1] = {};
  function renderModule(name, _) {
    name = String(name || '').toLowerCase();
    if (arguments.length > 1) {
      modules[name] = _;
      return this;
    } else {
      return modules[name];
    }
  }
  function intersect$2(scene, bounds, filter) {
    var hits = [],
      // intersection results
      box = new Bounds().union(bounds),
      // defensive copy
      type = scene.marktype;
    return type ? intersectMark(scene, box, filter, hits) : type === 'group' ? intersectGroup(scene, box, filter, hits) : error('Intersect scene must be mark node or group item.');
  }
  function intersectMark(mark, box, filter, hits) {
    if (visitMark(mark, box, filter)) {
      var items = mark.items,
        _type2 = mark.marktype,
        n = items.length;
      var i = 0;
      if (_type2 === 'group') {
        for (; i < n; ++i) {
          intersectGroup(items[i], box, filter, hits);
        }
      } else {
        for (var test = Marks[_type2].isect; i < n; ++i) {
          var item = items[i];
          if (intersectItem(item, box, test)) hits.push(item);
        }
      }
    }
    return hits;
  }
  function visitMark(mark, box, filter) {
    // process if bounds intersect and if
    // (1) mark is a group mark (so we must recurse), or
    // (2) mark is interactive and passes filter
    return mark.bounds && box.intersects(mark.bounds) && (mark.marktype === 'group' || mark.interactive !== false && (!filter || filter(mark)));
  }
  function intersectGroup(group, box, filter, hits) {
    // test intersect against group
    // skip groups by default unless filter says otherwise
    if (filter && filter(group.mark) && intersectItem(group, box, Marks.group.isect)) {
      hits.push(group);
    }

    // recursively test children marks
    // translate box to group coordinate space
    var marks = group.items,
      n = marks && marks.length;
    if (n) {
      var _x3 = group.x || 0,
        _y2 = group.y || 0;
      box.translate(-_x3, -_y2);
      for (var i = 0; i < n; ++i) {
        intersectMark(marks[i], box, filter, hits);
      }
      box.translate(_x3, _y2);
    }
    return hits;
  }
  function intersectItem(item, box, test) {
    // test bounds enclosure, bounds intersection, then detailed test
    var bounds = item.bounds;
    return box.encloses(bounds) || box.intersects(bounds) && test(item, box);
  }
  var clipBounds = new Bounds();
  function boundClip(mark) {
    var clip = mark.clip;
    if (isFunction(clip)) {
      clip(boundContext(clipBounds.clear()));
    } else if (clip) {
      clipBounds.set(0, 0, mark.group.width, mark.group.height);
    } else return;
    mark.bounds.intersect(clipBounds);
  }
  var TOLERANCE = 1e-9;
  function sceneEqual(a, b, key) {
    return a === b ? true : key === 'path' ? pathEqual(a, b) : a instanceof Date && b instanceof Date ? +a === +b : isNumber$1(a) && isNumber$1(b) ? Math.abs(a - b) <= TOLERANCE : !a || !b || !isObject(a) && !isObject(b) ? a == b : objectEqual(a, b);
  }
  function pathEqual(a, b) {
    return sceneEqual(parse$3(a), parse$3(b));
  }
  function objectEqual(a, b) {
    var ka = Object.keys(a),
      kb = Object.keys(b),
      key,
      i;
    if (ka.length !== kb.length) return false;
    ka.sort();
    kb.sort();
    for (i = ka.length - 1; i >= 0; i--) {
      if (ka[i] != kb[i]) return false;
    }
    for (i = ka.length - 1; i >= 0; i--) {
      key = ka[i];
      if (!sceneEqual(a[key], b[key], key)) return false;
    }
    return _typeof(a) === _typeof(b);
  }
  function resetSVGDefIds() {
    resetSVGClipId();
    resetSVGGradientId();
  }

  var Top$1 = 'top';
  var Left$1 = 'left';
  var Right$1 = 'right';
  var Bottom$1 = 'bottom';
  var TopLeft = 'top-left';
  var TopRight = 'top-right';
  var BottomLeft = 'bottom-left';
  var BottomRight = 'bottom-right';
  var Start$1 = 'start';
  var Middle$1 = 'middle';
  var End$1 = 'end';
  var X = 'x';
  var Y = 'y';
  var Group = 'group';
  var AxisRole$1 = 'axis';
  var TitleRole$1 = 'title';
  var FrameRole$1 = 'frame';
  var ScopeRole$1 = 'scope';
  var LegendRole$1 = 'legend';
  var RowHeader = 'row-header';
  var RowFooter = 'row-footer';
  var RowTitle = 'row-title';
  var ColHeader = 'column-header';
  var ColFooter = 'column-footer';
  var ColTitle = 'column-title';
  var Padding$1 = 'padding';
  var Symbols$1 = 'symbol';
  var Fit = 'fit';
  var FitX = 'fit-x';
  var FitY = 'fit-y';
  var Pad = 'pad';
  var None = 'none';
  var All = 'all';
  var Each = 'each';
  var Flush = 'flush';
  var Column = 'column';
  var Row = 'row';

  /**
   * Calculate bounding boxes for scenegraph items.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {object} params.mark - The scenegraph mark instance to bound.
   */
  function Bound$1(params) {
    Transform.call(this, null, params);
  }
  inherits(Bound$1, Transform, {
    transform: function transform(_, pulse) {
      var view = pulse.dataflow,
        mark = _.mark,
        type = mark.marktype,
        entry = Marks[type],
        bound = entry.bound;
      var markBounds = mark.bounds,
        rebound;
      if (entry.nested) {
        // multi-item marks have a single bounds instance
        if (mark.items.length) view.dirty(mark.items[0]);
        markBounds = boundItem(mark, bound);
        mark.items.forEach(function (item) {
          item.bounds.clear().union(markBounds);
        });
      } else if (type === Group || _.modified()) {
        // operator parameters modified -> re-bound all items
        // updates group bounds in response to modified group content
        pulse.visit(pulse.MOD, function (item) {
          return view.dirty(item);
        });
        markBounds.clear();
        mark.items.forEach(function (item) {
          return markBounds.union(boundItem(item, bound));
        });

        // force reflow for axes/legends/titles to propagate any layout changes
        switch (mark.role) {
          case AxisRole$1:
          case LegendRole$1:
          case TitleRole$1:
            pulse.reflow();
        }
      } else {
        // incrementally update bounds, re-bound mark as needed
        rebound = pulse.changed(pulse.REM);
        pulse.visit(pulse.ADD, function (item) {
          markBounds.union(boundItem(item, bound));
        });
        pulse.visit(pulse.MOD, function (item) {
          rebound = rebound || markBounds.alignsWith(item.bounds);
          view.dirty(item);
          markBounds.union(boundItem(item, bound));
        });
        if (rebound) {
          markBounds.clear();
          mark.items.forEach(function (item) {
            return markBounds.union(item.bounds);
          });
        }
      }

      // ensure mark bounds do not exceed any clipping region
      boundClip(mark);
      return pulse.modifies('bounds');
    }
  });
  function boundItem(item, bound, opt) {
    return bound(item.bounds.clear(), item, opt);
  }
  var COUNTER_NAME = ':vega_identifier:';

  /**
   * Adds a unique identifier to all added tuples.
   * This transform creates a new signal that serves as an id counter.
   * As a result, the id counter is shared across all instances of this
   * transform, generating unique ids across multiple data streams. In
   * addition, this signal value can be included in a snapshot of the
   * dataflow state, enabling correct resumption of id allocation.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {string} params.as - The field name for the generated identifier.
   */
  function Identifier$1(params) {
    Transform.call(this, 0, params);
  }
  Identifier$1.Definition = {
    'type': 'Identifier',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'as',
      'type': 'string',
      'required': true
    }]
  };
  inherits(Identifier$1, Transform, {
    transform: function transform(_, pulse) {
      var counter = getCounter(pulse.dataflow),
        as = _.as;
      var id = counter.value;
      pulse.visit(pulse.ADD, function (t) {
        return t[as] = t[as] || ++id;
      });
      counter.set(this.value = id);
      return pulse;
    }
  });
  function getCounter(view) {
    return view._signals[COUNTER_NAME] || (view._signals[COUNTER_NAME] = view.add(0));
  }

  /**
   * Bind scenegraph items to a scenegraph mark instance.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {object} params.markdef - The mark definition for creating the mark.
   *   This is an object of legal scenegraph mark properties which *must* include
   *   the 'marktype' property.
   */
  function Mark$1(params) {
    Transform.call(this, null, params);
  }
  inherits(Mark$1, Transform, {
    transform: function transform(_, pulse) {
      var mark = this.value;

      // acquire mark on first invocation, bind context and group
      if (!mark) {
        mark = pulse.dataflow.scenegraph().mark(_.markdef, lookup$1$1(_), _.index);
        mark.group.context = _.context;
        if (!_.context.group) _.context.group = mark.group;
        mark.source = this.source; // point to upstream collector
        mark.clip = _.clip;
        mark.interactive = _.interactive;
        this.value = mark;
      }

      // initialize entering items
      var Init = mark.marktype === Group ? GroupItem : Item;
      pulse.visit(pulse.ADD, function (item) {
        return Init.call(item, mark);
      });

      // update clipping and/or interactive status
      if (_.modified('clip') || _.modified('interactive')) {
        mark.clip = _.clip;
        mark.interactive = !!_.interactive;
        mark.zdirty = true; // force scenegraph re-eval
        pulse.reflow();
      }

      // bind items array to scenegraph mark
      mark.items = pulse.source;
      return pulse;
    }
  });
  function lookup$1$1(_) {
    var g = _.groups,
      p = _.parent;
    return g && g.size === 1 ? g.get(Object.keys(g.object)[0]) : g && p ? g.lookup(p) : null;
  }

  /**
   * Analyze items for overlap, changing opacity to hide items with
   * overlapping bounding boxes. This transform will preserve at least
   * two items (e.g., first and last) even if overlap persists.
   * @param {object} params - The parameters for this operator.
   * @param {function(*,*): number} [params.sort] - A comparator
   *   function for sorting items.
   * @param {object} [params.method] - The overlap removal method to apply.
   *   One of 'parity' (default, hide every other item until there is no
   *   more overlap) or 'greedy' (sequentially scan and hide and items that
   *   overlap with the last visible item).
   * @param {object} [params.boundScale] - A scale whose range should be used
   *   to bound the items. Items exceeding the bounds of the scale range
   *   will be treated as overlapping. If null or undefined, no bounds check
   *   will be applied.
   * @param {object} [params.boundOrient] - The orientation of the scale
   *   (top, bottom, left, or right) used to bound items. This parameter is
   *   ignored if boundScale is null or undefined.
   * @param {object} [params.boundTolerance] - The tolerance in pixels for
   *   bound inclusion testing (default 1). This specifies by how many pixels
   *   an item's bounds may exceed the scale range bounds and not be culled.
   * @constructor
   */
  function Overlap$1(params) {
    Transform.call(this, null, params);
  }
  var methods = {
    parity: function parity(items) {
      return items.filter(function (item, i) {
        return i % 2 ? item.opacity = 0 : 1;
      });
    },
    greedy: function greedy(items, sep) {
      var a;
      return items.filter(function (b, i) {
        return !i || !intersect$1(a.bounds, b.bounds, sep) ? (a = b, 1) : b.opacity = 0;
      });
    }
  };

  // compute bounding box intersection
  // including padding pixels of separation
  var intersect$1 = function intersect(a, b, sep) {
    return sep > Math.max(b.x1 - a.x2, a.x1 - b.x2, b.y1 - a.y2, a.y1 - b.y2);
  };
  var hasOverlap = function hasOverlap(items, pad) {
    for (var i = 1, n = items.length, a = items[0].bounds, b; i < n; a = b, ++i) {
      if (intersect$1(a, b = items[i].bounds, pad)) return true;
    }
  };
  var hasBounds = function hasBounds(item) {
    var b = item.bounds;
    return b.width() > 1 && b.height() > 1;
  };
  var boundTest = function boundTest(scale, orient, tolerance) {
    var range = scale.range(),
      b = new Bounds();
    if (orient === Top$1 || orient === Bottom$1) {
      b.set(range[0], -Infinity, range[1], +Infinity);
    } else {
      b.set(-Infinity, range[0], +Infinity, range[1]);
    }
    b.expand(tolerance || 1);
    return function (item) {
      return b.encloses(item.bounds);
    };
  };

  // reset all items to be fully opaque
  var reset = function reset(source) {
    source.forEach(function (item) {
      return item.opacity = 1;
    });
    return source;
  };

  // add all tuples to mod, fork pulse if parameters were modified
  // fork prevents cross-stream tuple pollution (e.g., pulse from scale)
  var reflow = function reflow(pulse, _) {
    return pulse.reflow(_.modified()).modifies('opacity');
  };
  inherits(Overlap$1, Transform, {
    transform: function transform(_, pulse) {
      var reduce = methods[_.method] || methods.parity,
        sep = _.separation || 0;
      var source = pulse.materialize(pulse.SOURCE).source,
        items,
        test;
      if (!source || !source.length) return;
      if (!_.method) {
        // early exit if method is falsy
        if (_.modified('method')) {
          reset(source);
          pulse = reflow(pulse, _);
        }
        return pulse;
      }

      // skip labels with no content
      source = source.filter(hasBounds);

      // early exit, nothing to do
      if (!source.length) return;
      if (_.sort) {
        source = source.slice().sort(_.sort);
      }
      items = reset(source);
      pulse = reflow(pulse, _);
      if (items.length >= 3 && hasOverlap(items, sep)) {
        do {
          items = reduce(items, sep);
        } while (items.length >= 3 && hasOverlap(items, sep));
        if (items.length < 3 && !peek$1(source).opacity) {
          if (items.length > 1) peek$1(items).opacity = 0;
          peek$1(source).opacity = 1;
        }
      }
      if (_.boundScale && _.boundTolerance >= 0) {
        test = boundTest(_.boundScale, _.boundOrient, +_.boundTolerance);
        source.forEach(function (item) {
          if (!test(item)) item.opacity = 0;
        });
      }

      // re-calculate mark bounds
      var bounds = items[0].mark.bounds.clear();
      source.forEach(function (item) {
        if (item.opacity) bounds.union(item.bounds);
      });
      return pulse;
    }
  });

  /**
   * Queue modified scenegraph items for rendering.
   * @constructor
   */
  function Render$1(params) {
    Transform.call(this, null, params);
  }
  inherits(Render$1, Transform, {
    transform: function transform(_, pulse) {
      var view = pulse.dataflow;
      pulse.visit(pulse.ALL, function (item) {
        return view.dirty(item);
      });

      // set z-index dirty flag as needed
      if (pulse.fields && pulse.fields['zindex']) {
        var item = pulse.source && pulse.source[0];
        if (item) item.mark.zdirty = true;
      }
    }
  });
  var tempBounds = new Bounds();
  function set$1(item, property, value) {
    return item[property] === value ? 0 : (item[property] = value, 1);
  }
  function isYAxis(mark) {
    var orient = mark.items[0].orient;
    return orient === Left$1 || orient === Right$1;
  }
  function axisIndices(datum) {
    var index = +datum.grid;
    return [datum.ticks ? index++ : -1,
    // ticks index
    datum.labels ? index++ : -1,
    // labels index
    index + +datum.domain // title index
    ];
  }

  function axisLayout(view, axis, width, height) {
    var item = axis.items[0],
      datum = item.datum,
      delta = item.translate != null ? item.translate : 0.5,
      orient = item.orient,
      indices = axisIndices(datum),
      range = item.range,
      offset = item.offset,
      position = item.position,
      minExtent = item.minExtent,
      maxExtent = item.maxExtent,
      title = datum.title && item.items[indices[2]].items[0],
      titlePadding = item.titlePadding,
      bounds = item.bounds,
      dl = title && multiLineOffset(title),
      x = 0,
      y = 0,
      i,
      s;
    tempBounds.clear().union(bounds);
    bounds.clear();
    if ((i = indices[0]) > -1) bounds.union(item.items[i].bounds);
    if ((i = indices[1]) > -1) bounds.union(item.items[i].bounds);

    // position axis group and title
    switch (orient) {
      case Top$1:
        x = position || 0;
        y = -offset;
        s = Math.max(minExtent, Math.min(maxExtent, -bounds.y1));
        bounds.add(0, -s).add(range, 0);
        if (title) axisTitleLayout(view, title, s, titlePadding, dl, 0, -1, bounds);
        break;
      case Left$1:
        x = -offset;
        y = position || 0;
        s = Math.max(minExtent, Math.min(maxExtent, -bounds.x1));
        bounds.add(-s, 0).add(0, range);
        if (title) axisTitleLayout(view, title, s, titlePadding, dl, 1, -1, bounds);
        break;
      case Right$1:
        x = width + offset;
        y = position || 0;
        s = Math.max(minExtent, Math.min(maxExtent, bounds.x2));
        bounds.add(0, 0).add(s, range);
        if (title) axisTitleLayout(view, title, s, titlePadding, dl, 1, 1, bounds);
        break;
      case Bottom$1:
        x = position || 0;
        y = height + offset;
        s = Math.max(minExtent, Math.min(maxExtent, bounds.y2));
        bounds.add(0, 0).add(range, s);
        if (title) axisTitleLayout(view, title, s, titlePadding, 0, 0, 1, bounds);
        break;
      default:
        x = item.x;
        y = item.y;
    }

    // update bounds
    boundStroke(bounds.translate(x, y), item);
    if (set$1(item, 'x', x + delta) | set$1(item, 'y', y + delta)) {
      item.bounds = tempBounds;
      view.dirty(item);
      item.bounds = bounds;
      view.dirty(item);
    }
    return item.mark.bounds.clear().union(bounds);
  }
  function axisTitleLayout(view, title, offset, pad, dl, isYAxis, sign, bounds) {
    var b = title.bounds;
    if (title.auto) {
      var v = sign * (offset + dl + pad);
      var dx = 0,
        dy = 0;
      view.dirty(title);
      isYAxis ? dx = (title.x || 0) - (title.x = v) : dy = (title.y || 0) - (title.y = v);
      title.mark.bounds.clear().union(b.translate(-dx, -dy));
      view.dirty(title);
    }
    bounds.union(b);
  }

  // aggregation functions for grid margin determination
  var min = function min(a, b) {
    return Math.floor(Math.min(a, b));
  };
  var max = function max(a, b) {
    return Math.ceil(Math.max(a, b));
  };
  function gridLayoutGroups(group) {
    var _views$rowheaders, _views$rowfooters, _views$colheaders, _views$colfooters, _views$marks;
    var groups = group.items,
      n = groups.length,
      i = 0,
      mark,
      items;
    var views = {
      marks: [],
      rowheaders: [],
      rowfooters: [],
      colheaders: [],
      colfooters: [],
      rowtitle: null,
      coltitle: null
    };

    // layout axes, gather legends, collect bounds
    for (; i < n; ++i) {
      mark = groups[i];
      items = mark.items;
      if (mark.marktype === Group) {
        switch (mark.role) {
          case AxisRole$1:
          case LegendRole$1:
          case TitleRole$1:
            break;
          case RowHeader:
            (_views$rowheaders = views.rowheaders).push.apply(_views$rowheaders, _toConsumableArray(items));
            break;
          case RowFooter:
            (_views$rowfooters = views.rowfooters).push.apply(_views$rowfooters, _toConsumableArray(items));
            break;
          case ColHeader:
            (_views$colheaders = views.colheaders).push.apply(_views$colheaders, _toConsumableArray(items));
            break;
          case ColFooter:
            (_views$colfooters = views.colfooters).push.apply(_views$colfooters, _toConsumableArray(items));
            break;
          case RowTitle:
            views.rowtitle = items[0];
            break;
          case ColTitle:
            views.coltitle = items[0];
            break;
          default:
            (_views$marks = views.marks).push.apply(_views$marks, _toConsumableArray(items));
        }
      }
    }
    return views;
  }
  function bboxFlush(item) {
    return new Bounds().set(0, 0, item.width || 0, item.height || 0);
  }
  function bboxFull(item) {
    var b = item.bounds.clone();
    return b.empty() ? b.set(0, 0, 0, 0) : b.translate(-(item.x || 0), -(item.y || 0));
  }
  function get(opt, key, d) {
    var v = isObject(opt) ? opt[key] : opt;
    return v != null ? v : d !== undefined ? d : 0;
  }
  function offsetValue$1(v) {
    return v < 0 ? Math.ceil(-v) : 0;
  }
  function gridLayout(view, groups, opt) {
    var dirty = !opt.nodirty,
      bbox = opt.bounds === Flush ? bboxFlush : bboxFull,
      bounds = tempBounds.set(0, 0, 0, 0),
      alignCol = get(opt.align, Column),
      alignRow = get(opt.align, Row),
      padCol = get(opt.padding, Column),
      padRow = get(opt.padding, Row),
      ncols = opt.columns || groups.length,
      nrows = ncols <= 0 ? 1 : Math.ceil(groups.length / ncols),
      n = groups.length,
      xOffset = Array(n),
      xExtent = Array(ncols),
      xMax = 0,
      yOffset = Array(n),
      yExtent = Array(nrows),
      yMax = 0,
      dx = Array(n),
      dy = Array(n),
      boxes = Array(n),
      m,
      i,
      c,
      r,
      b,
      g,
      px,
      py,
      x,
      y,
      offset;
    for (i = 0; i < ncols; ++i) xExtent[i] = 0;
    for (i = 0; i < nrows; ++i) yExtent[i] = 0;

    // determine offsets for each group
    for (i = 0; i < n; ++i) {
      g = groups[i];
      b = boxes[i] = bbox(g);
      g.x = g.x || 0;
      dx[i] = 0;
      g.y = g.y || 0;
      dy[i] = 0;
      c = i % ncols;
      r = ~~(i / ncols);
      xMax = Math.max(xMax, px = Math.ceil(b.x2));
      yMax = Math.max(yMax, py = Math.ceil(b.y2));
      xExtent[c] = Math.max(xExtent[c], px);
      yExtent[r] = Math.max(yExtent[r], py);
      xOffset[i] = padCol + offsetValue$1(b.x1);
      yOffset[i] = padRow + offsetValue$1(b.y1);
      if (dirty) view.dirty(groups[i]);
    }

    // set initial alignment offsets
    for (i = 0; i < n; ++i) {
      if (i % ncols === 0) xOffset[i] = 0;
      if (i < ncols) yOffset[i] = 0;
    }

    // enforce column alignment constraints
    if (alignCol === Each) {
      for (c = 1; c < ncols; ++c) {
        for (offset = 0, i = c; i < n; i += ncols) {
          if (offset < xOffset[i]) offset = xOffset[i];
        }
        for (i = c; i < n; i += ncols) {
          xOffset[i] = offset + xExtent[c - 1];
        }
      }
    } else if (alignCol === All) {
      for (offset = 0, i = 0; i < n; ++i) {
        if (i % ncols && offset < xOffset[i]) offset = xOffset[i];
      }
      for (i = 0; i < n; ++i) {
        if (i % ncols) xOffset[i] = offset + xMax;
      }
    } else {
      for (alignCol = false, c = 1; c < ncols; ++c) {
        for (i = c; i < n; i += ncols) {
          xOffset[i] += xExtent[c - 1];
        }
      }
    }

    // enforce row alignment constraints
    if (alignRow === Each) {
      for (r = 1; r < nrows; ++r) {
        for (offset = 0, i = r * ncols, m = i + ncols; i < m; ++i) {
          if (offset < yOffset[i]) offset = yOffset[i];
        }
        for (i = r * ncols; i < m; ++i) {
          yOffset[i] = offset + yExtent[r - 1];
        }
      }
    } else if (alignRow === All) {
      for (offset = 0, i = ncols; i < n; ++i) {
        if (offset < yOffset[i]) offset = yOffset[i];
      }
      for (i = ncols; i < n; ++i) {
        yOffset[i] = offset + yMax;
      }
    } else {
      for (alignRow = false, r = 1; r < nrows; ++r) {
        for (i = r * ncols, m = i + ncols; i < m; ++i) {
          yOffset[i] += yExtent[r - 1];
        }
      }
    }

    // perform horizontal grid layout
    for (x = 0, i = 0; i < n; ++i) {
      x = xOffset[i] + (i % ncols ? x : 0);
      dx[i] += x - groups[i].x;
    }

    // perform vertical grid layout
    for (c = 0; c < ncols; ++c) {
      for (y = 0, i = c; i < n; i += ncols) {
        y += yOffset[i];
        dy[i] += y - groups[i].y;
      }
    }

    // perform horizontal centering
    if (alignCol && get(opt.center, Column) && nrows > 1) {
      for (i = 0; i < n; ++i) {
        b = alignCol === All ? xMax : xExtent[i % ncols];
        x = b - boxes[i].x2 - groups[i].x - dx[i];
        if (x > 0) dx[i] += x / 2;
      }
    }

    // perform vertical centering
    if (alignRow && get(opt.center, Row) && ncols !== 1) {
      for (i = 0; i < n; ++i) {
        b = alignRow === All ? yMax : yExtent[~~(i / ncols)];
        y = b - boxes[i].y2 - groups[i].y - dy[i];
        if (y > 0) dy[i] += y / 2;
      }
    }

    // position grid relative to anchor
    for (i = 0; i < n; ++i) {
      bounds.union(boxes[i].translate(dx[i], dy[i]));
    }
    x = get(opt.anchor, X);
    y = get(opt.anchor, Y);
    switch (get(opt.anchor, Column)) {
      case End$1:
        x -= bounds.width();
        break;
      case Middle$1:
        x -= bounds.width() / 2;
    }
    switch (get(opt.anchor, Row)) {
      case End$1:
        y -= bounds.height();
        break;
      case Middle$1:
        y -= bounds.height() / 2;
    }
    x = Math.round(x);
    y = Math.round(y);

    // update mark positions, bounds, dirty
    bounds.clear();
    for (i = 0; i < n; ++i) {
      groups[i].mark.bounds.clear();
    }
    for (i = 0; i < n; ++i) {
      g = groups[i];
      g.x += dx[i] += x;
      g.y += dy[i] += y;
      bounds.union(g.mark.bounds.union(g.bounds.translate(dx[i], dy[i])));
      if (dirty) view.dirty(g);
    }
    return bounds;
  }
  function trellisLayout(view, group, opt) {
    var views = gridLayoutGroups(group),
      groups = views.marks,
      bbox = opt.bounds === Flush ? boundFlush : boundFull,
      off = opt.offset,
      ncols = opt.columns || groups.length,
      nrows = ncols <= 0 ? 1 : Math.ceil(groups.length / ncols),
      cells = nrows * ncols,
      x,
      y,
      x2,
      y2,
      anchor,
      band,
      offset;

    // -- initial grid layout
    var bounds = gridLayout(view, groups, opt);
    if (bounds.empty()) bounds.set(0, 0, 0, 0); // empty grid

    // -- layout grid headers and footers --

    // perform row header layout
    if (views.rowheaders) {
      band = get(opt.headerBand, Row, null);
      x = layoutHeaders(view, views.rowheaders, groups, ncols, nrows, -get(off, 'rowHeader'), min, 0, bbox, 'x1', 0, ncols, 1, band);
    }

    // perform column header layout
    if (views.colheaders) {
      band = get(opt.headerBand, Column, null);
      y = layoutHeaders(view, views.colheaders, groups, ncols, ncols, -get(off, 'columnHeader'), min, 1, bbox, 'y1', 0, 1, ncols, band);
    }

    // perform row footer layout
    if (views.rowfooters) {
      band = get(opt.footerBand, Row, null);
      x2 = layoutHeaders(view, views.rowfooters, groups, ncols, nrows, get(off, 'rowFooter'), max, 0, bbox, 'x2', ncols - 1, ncols, 1, band);
    }

    // perform column footer layout
    if (views.colfooters) {
      band = get(opt.footerBand, Column, null);
      y2 = layoutHeaders(view, views.colfooters, groups, ncols, ncols, get(off, 'columnFooter'), max, 1, bbox, 'y2', cells - ncols, 1, ncols, band);
    }

    // perform row title layout
    if (views.rowtitle) {
      anchor = get(opt.titleAnchor, Row);
      offset = get(off, 'rowTitle');
      offset = anchor === End$1 ? x2 + offset : x - offset;
      band = get(opt.titleBand, Row, 0.5);
      layoutTitle(view, views.rowtitle, offset, 0, bounds, band);
    }

    // perform column title layout
    if (views.coltitle) {
      anchor = get(opt.titleAnchor, Column);
      offset = get(off, 'columnTitle');
      offset = anchor === End$1 ? y2 + offset : y - offset;
      band = get(opt.titleBand, Column, 0.5);
      layoutTitle(view, views.coltitle, offset, 1, bounds, band);
    }
  }
  function boundFlush(item, field) {
    return field === 'x1' ? item.x || 0 : field === 'y1' ? item.y || 0 : field === 'x2' ? (item.x || 0) + (item.width || 0) : field === 'y2' ? (item.y || 0) + (item.height || 0) : undefined;
  }
  function boundFull(item, field) {
    return item.bounds[field];
  }
  function layoutHeaders(view, headers, groups, ncols, limit, offset, agg, isX, bound, bf, start, stride, back, band) {
    var n = groups.length,
      init = 0,
      edge = 0,
      i,
      j,
      k,
      m,
      b,
      h,
      g,
      x,
      y;

    // if no groups, early exit and return 0
    if (!n) return init;

    // compute margin
    for (i = start; i < n; i += stride) {
      if (groups[i]) init = agg(init, bound(groups[i], bf));
    }

    // if no headers, return margin calculation
    if (!headers.length) return init;

    // check if number of headers exceeds number of rows or columns
    if (headers.length > limit) {
      view.warn('Grid headers exceed limit: ' + limit);
      headers = headers.slice(0, limit);
    }

    // apply offset
    init += offset;

    // clear mark bounds for all headers
    for (j = 0, m = headers.length; j < m; ++j) {
      view.dirty(headers[j]);
      headers[j].mark.bounds.clear();
    }

    // layout each header
    for (i = start, j = 0, m = headers.length; j < m; ++j, i += stride) {
      h = headers[j];
      b = h.mark.bounds;

      // search for nearest group to align to
      // necessary if table has empty cells
      for (k = i; k >= 0 && (g = groups[k]) == null; k -= back);

      // assign coordinates and update bounds
      if (isX) {
        x = band == null ? g.x : Math.round(g.bounds.x1 + band * g.bounds.width());
        y = init;
      } else {
        x = init;
        y = band == null ? g.y : Math.round(g.bounds.y1 + band * g.bounds.height());
      }
      b.union(h.bounds.translate(x - (h.x || 0), y - (h.y || 0)));
      h.x = x;
      h.y = y;
      view.dirty(h);

      // update current edge of layout bounds
      edge = agg(edge, b[bf]);
    }
    return edge;
  }
  function layoutTitle(view, g, offset, isX, bounds, band) {
    if (!g) return;
    view.dirty(g);

    // compute title coordinates
    var x = offset,
      y = offset;
    isX ? x = Math.round(bounds.x1 + band * bounds.width()) : y = Math.round(bounds.y1 + band * bounds.height());

    // assign coordinates and update bounds
    g.bounds.translate(x - (g.x || 0), y - (g.y || 0));
    g.mark.bounds.clear().union(g.bounds);
    g.x = x;
    g.y = y;

    // queue title for redraw
    view.dirty(g);
  }

  // utility for looking up legend layout configuration
  function lookup$3(config, orient) {
    var opt = config[orient] || {};
    return function (key, d) {
      return opt[key] != null ? opt[key] : config[key] != null ? config[key] : d;
    };
  }

  // if legends specify offset directly, use the maximum specified value
  function offsets(legends, value) {
    var max = -Infinity;
    legends.forEach(function (item) {
      if (item.offset != null) max = Math.max(max, item.offset);
    });
    return max > -Infinity ? max : value;
  }
  function legendParams(g, orient, config, xb, yb, w, h) {
    var _ = lookup$3(config, orient),
      offset = offsets(g, _('offset', 0)),
      anchor = _('anchor', Start$1),
      mult = anchor === End$1 ? 1 : anchor === Middle$1 ? 0.5 : 0;
    var p = {
      align: Each,
      bounds: _('bounds', Flush),
      columns: _('direction') === 'vertical' ? 1 : g.length,
      padding: _('margin', 8),
      center: _('center'),
      nodirty: true
    };
    switch (orient) {
      case Left$1:
        p.anchor = {
          x: Math.floor(xb.x1) - offset,
          column: End$1,
          y: mult * (h || xb.height() + 2 * xb.y1),
          row: anchor
        };
        break;
      case Right$1:
        p.anchor = {
          x: Math.ceil(xb.x2) + offset,
          y: mult * (h || xb.height() + 2 * xb.y1),
          row: anchor
        };
        break;
      case Top$1:
        p.anchor = {
          y: Math.floor(yb.y1) - offset,
          row: End$1,
          x: mult * (w || yb.width() + 2 * yb.x1),
          column: anchor
        };
        break;
      case Bottom$1:
        p.anchor = {
          y: Math.ceil(yb.y2) + offset,
          x: mult * (w || yb.width() + 2 * yb.x1),
          column: anchor
        };
        break;
      case TopLeft:
        p.anchor = {
          x: offset,
          y: offset
        };
        break;
      case TopRight:
        p.anchor = {
          x: w - offset,
          y: offset,
          column: End$1
        };
        break;
      case BottomLeft:
        p.anchor = {
          x: offset,
          y: h - offset,
          row: End$1
        };
        break;
      case BottomRight:
        p.anchor = {
          x: w - offset,
          y: h - offset,
          column: End$1,
          row: End$1
        };
        break;
    }
    return p;
  }
  function legendLayout(view, legend) {
    var item = legend.items[0],
      datum = item.datum,
      orient = item.orient,
      bounds = item.bounds,
      x = item.x,
      y = item.y,
      w,
      h;

    // cache current bounds for later comparison
    item._bounds ? item._bounds.clear().union(bounds) : item._bounds = bounds.clone();
    bounds.clear();

    // adjust legend to accommodate padding and title
    legendGroupLayout(view, item, item.items[0].items[0]);

    // aggregate bounds to determine size, and include origin
    bounds = legendBounds(item, bounds);
    w = 2 * item.padding;
    h = 2 * item.padding;
    if (!bounds.empty()) {
      w = Math.ceil(bounds.width() + w);
      h = Math.ceil(bounds.height() + h);
    }
    if (datum.type === Symbols$1) {
      legendEntryLayout(item.items[0].items[0].items[0].items);
    }
    if (orient !== None) {
      item.x = x = 0;
      item.y = y = 0;
    }
    item.width = w;
    item.height = h;
    boundStroke(bounds.set(x, y, x + w, y + h), item);
    item.mark.bounds.clear().union(bounds);
    return item;
  }
  function legendBounds(item, b) {
    // aggregate item bounds
    item.items.forEach(function (_) {
      return b.union(_.bounds);
    });

    // anchor to legend origin
    b.x1 = item.padding;
    b.y1 = item.padding;
    return b;
  }
  function legendGroupLayout(view, item, entry) {
    var pad = item.padding,
      ex = pad - entry.x,
      ey = pad - entry.y;
    if (!item.datum.title) {
      if (ex || ey) translate(view, entry, ex, ey);
    } else {
      var title = item.items[1].items[0],
        anchor = title.anchor,
        tpad = item.titlePadding || 0,
        tx = pad - title.x,
        ty = pad - title.y;
      switch (title.orient) {
        case Left$1:
          ex += Math.ceil(title.bounds.width()) + tpad;
          break;
        case Right$1:
        case Bottom$1:
          break;
        default:
          ey += title.bounds.height() + tpad;
      }
      if (ex || ey) translate(view, entry, ex, ey);
      switch (title.orient) {
        case Left$1:
          ty += legendTitleOffset(item, entry, title, anchor, 1, 1);
          break;
        case Right$1:
          tx += legendTitleOffset(item, entry, title, End$1, 0, 0) + tpad;
          ty += legendTitleOffset(item, entry, title, anchor, 1, 1);
          break;
        case Bottom$1:
          tx += legendTitleOffset(item, entry, title, anchor, 0, 0);
          ty += legendTitleOffset(item, entry, title, End$1, -1, 0, 1) + tpad;
          break;
        default:
          tx += legendTitleOffset(item, entry, title, anchor, 0, 0);
      }
      if (tx || ty) translate(view, title, tx, ty);

      // translate legend if title pushes into negative coordinates
      if ((tx = Math.round(title.bounds.x1 - pad)) < 0) {
        translate(view, entry, -tx, 0);
        translate(view, title, -tx, 0);
      }
    }
  }
  function legendTitleOffset(item, entry, title, anchor, y, lr, noBar) {
    var grad = item.datum.type !== 'symbol',
      vgrad = title.datum.vgrad,
      e = grad && (lr || !vgrad) && !noBar ? entry.items[0] : entry,
      s = e.bounds[y ? 'y2' : 'x2'] - item.padding,
      u = vgrad && lr ? s : 0,
      v = vgrad && lr ? 0 : s,
      o = y <= 0 ? 0 : multiLineOffset(title);
    return Math.round(anchor === Start$1 ? u : anchor === End$1 ? v - o : 0.5 * (s - o));
  }
  function translate(view, item, dx, dy) {
    item.x += dx;
    item.y += dy;
    item.bounds.translate(dx, dy);
    item.mark.bounds.translate(dx, dy);
    view.dirty(item);
  }
  function legendEntryLayout(entries) {
    // get max widths for each column
    var widths = entries.reduce(function (w, g) {
      w[g.column] = Math.max(g.bounds.x2 - g.x, w[g.column] || 0);
      return w;
    }, {});

    // set dimensions of legend entry groups
    entries.forEach(function (g) {
      g.width = widths[g.column];
      g.height = g.bounds.y2 - g.y;
    });
  }
  function titleLayout(view, mark, width, height, viewBounds) {
    var group = mark.items[0],
      frame = group.frame,
      orient = group.orient,
      anchor = group.anchor,
      offset = group.offset,
      padding = group.padding,
      title = group.items[0].items[0],
      subtitle = group.items[1] && group.items[1].items[0],
      end = orient === Left$1 || orient === Right$1 ? height : width,
      start = 0,
      x = 0,
      y = 0,
      sx = 0,
      sy = 0,
      pos;
    if (frame !== Group) {
      orient === Left$1 ? (start = viewBounds.y2, end = viewBounds.y1) : orient === Right$1 ? (start = viewBounds.y1, end = viewBounds.y2) : (start = viewBounds.x1, end = viewBounds.x2);
    } else if (orient === Left$1) {
      start = height, end = 0;
    }
    pos = anchor === Start$1 ? start : anchor === End$1 ? end : (start + end) / 2;
    if (subtitle && subtitle.text) {
      // position subtitle
      switch (orient) {
        case Top$1:
        case Bottom$1:
          sy = title.bounds.height() + padding;
          break;
        case Left$1:
          sx = title.bounds.width() + padding;
          break;
        case Right$1:
          sx = -title.bounds.width() - padding;
          break;
      }
      tempBounds.clear().union(subtitle.bounds);
      tempBounds.translate(sx - (subtitle.x || 0), sy - (subtitle.y || 0));
      if (set$1(subtitle, 'x', sx) | set$1(subtitle, 'y', sy)) {
        view.dirty(subtitle);
        subtitle.bounds.clear().union(tempBounds);
        subtitle.mark.bounds.clear().union(tempBounds);
        view.dirty(subtitle);
      }
      tempBounds.clear().union(subtitle.bounds);
    } else {
      tempBounds.clear();
    }
    tempBounds.union(title.bounds);

    // position title group
    switch (orient) {
      case Top$1:
        x = pos;
        y = viewBounds.y1 - tempBounds.height() - offset;
        break;
      case Left$1:
        x = viewBounds.x1 - tempBounds.width() - offset;
        y = pos;
        break;
      case Right$1:
        x = viewBounds.x2 + tempBounds.width() + offset;
        y = pos;
        break;
      case Bottom$1:
        x = pos;
        y = viewBounds.y2 + offset;
        break;
      default:
        x = group.x;
        y = group.y;
    }
    if (set$1(group, 'x', x) | set$1(group, 'y', y)) {
      tempBounds.translate(x, y);
      view.dirty(group);
      group.bounds.clear().union(tempBounds);
      mark.bounds.clear().union(tempBounds);
      view.dirty(group);
    }
    return group.bounds;
  }

  /**
   * Layout view elements such as axes and legends.
   * Also performs size adjustments.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {object} params.mark - Scenegraph mark of groups to layout.
   */
  function ViewLayout$1(params) {
    Transform.call(this, null, params);
  }
  inherits(ViewLayout$1, Transform, {
    transform: function transform(_, pulse) {
      var view = pulse.dataflow;
      _.mark.items.forEach(function (group) {
        if (_.layout) trellisLayout(view, group, _.layout);
        layoutGroup(view, group, _);
      });
      return shouldReflow(_.mark.group) ? pulse.reflow() : pulse;
    }
  });
  function shouldReflow(group) {
    // We typically should reflow if layout is invoked (#2568), as child items
    // may have resized and reflow ensures group bounds are re-calculated.
    // However, legend entries have a special exception to avoid instability.
    // For example, if a selected legend symbol gains a stroke on hover,
    // we don't want to re-position subsequent elements in the legend.
    return group && group.mark.role !== 'legend-entry';
  }
  function layoutGroup(view, group, _) {
    var items = group.items,
      width = Math.max(0, group.width || 0),
      height = Math.max(0, group.height || 0),
      viewBounds = new Bounds().set(0, 0, width, height),
      xBounds = viewBounds.clone(),
      yBounds = viewBounds.clone(),
      legends = [],
      title,
      mark,
      orient,
      b,
      i,
      n;

    // layout axes, gather legends, collect bounds
    for (i = 0, n = items.length; i < n; ++i) {
      mark = items[i];
      switch (mark.role) {
        case AxisRole$1:
          b = isYAxis(mark) ? xBounds : yBounds;
          b.union(axisLayout(view, mark, width, height));
          break;
        case TitleRole$1:
          title = mark;
          break;
        case LegendRole$1:
          legends.push(legendLayout(view, mark));
          break;
        case FrameRole$1:
        case ScopeRole$1:
        case RowHeader:
        case RowFooter:
        case RowTitle:
        case ColHeader:
        case ColFooter:
        case ColTitle:
          xBounds.union(mark.bounds);
          yBounds.union(mark.bounds);
          break;
        default:
          viewBounds.union(mark.bounds);
      }
    }

    // layout legends, adjust viewBounds
    if (legends.length) {
      // group legends by orient
      var l = {};
      legends.forEach(function (item) {
        orient = item.orient || Right$1;
        if (orient !== None) (l[orient] || (l[orient] = [])).push(item);
      });

      // perform grid layout for each orient group
      for (var _orient in l) {
        var g = l[_orient];
        gridLayout(view, g, legendParams(g, _orient, _.legends, xBounds, yBounds, width, height));
      }

      // update view bounds
      legends.forEach(function (item) {
        var b = item.bounds;
        if (!b.equals(item._bounds)) {
          item.bounds = item._bounds;
          view.dirty(item); // dirty previous location
          item.bounds = b;
          view.dirty(item);
        }
        if (_.autosize && (_.autosize.type === Fit || _.autosize.type === FitX || _.autosize.type === FitY)) {
          // For autosize fit, incorporate the orthogonal dimension only.
          // Legends that overrun the chart area will then be clipped;
          // otherwise the chart area gets reduced to nothing!
          switch (item.orient) {
            case Left$1:
            case Right$1:
              viewBounds.add(b.x1, 0).add(b.x2, 0);
              break;
            case Top$1:
            case Bottom$1:
              viewBounds.add(0, b.y1).add(0, b.y2);
          }
        } else {
          viewBounds.union(b);
        }
      });
    }

    // combine bounding boxes
    viewBounds.union(xBounds).union(yBounds);

    // layout title, adjust bounds
    if (title) {
      viewBounds.union(titleLayout(view, title, width, height, viewBounds));
    }

    // override aggregated view bounds if content is clipped
    if (group.clip) {
      viewBounds.set(0, 0, group.width || 0, group.height || 0);
    }

    // perform size adjustment
    viewSizeLayout(view, group, viewBounds, _);
  }
  function viewSizeLayout(view, group, viewBounds, _) {
    var auto = _.autosize || {},
      type = auto.type;
    if (view._autosize < 1 || !type) return;
    var viewWidth = view._width,
      viewHeight = view._height,
      width = Math.max(0, group.width || 0),
      left = Math.max(0, Math.ceil(-viewBounds.x1)),
      height = Math.max(0, group.height || 0),
      top = Math.max(0, Math.ceil(-viewBounds.y1));
    var right = Math.max(0, Math.ceil(viewBounds.x2 - width)),
      bottom = Math.max(0, Math.ceil(viewBounds.y2 - height));
    if (auto.contains === Padding$1) {
      var padding = view.padding();
      viewWidth -= padding.left + padding.right;
      viewHeight -= padding.top + padding.bottom;
    }
    if (type === None) {
      left = 0;
      top = 0;
      width = viewWidth;
      height = viewHeight;
    } else if (type === Fit) {
      width = Math.max(0, viewWidth - left - right);
      height = Math.max(0, viewHeight - top - bottom);
    } else if (type === FitX) {
      width = Math.max(0, viewWidth - left - right);
      viewHeight = height + top + bottom;
    } else if (type === FitY) {
      viewWidth = width + left + right;
      height = Math.max(0, viewHeight - top - bottom);
    } else if (type === Pad) {
      viewWidth = width + left + right;
      viewHeight = height + top + bottom;
    }
    view._resizeView(viewWidth, viewHeight, width, height, [left, top], auto.resize);
  }

  var vtx = /*#__PURE__*/Object.freeze({
    __proto__: null,
    bound: Bound$1,
    identifier: Identifier$1,
    mark: Mark$1,
    overlap: Overlap$1,
    render: Render$1,
    viewlayout: ViewLayout$1
  });

  /**
   * Generates axis ticks for visualizing a spatial scale.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Scale} params.scale - The scale to generate ticks for.
   * @param {*} [params.count=10] - The approximate number of ticks, or
   *   desired tick interval, to use.
   * @param {Array<*>} [params.values] - The exact tick values to use.
   *   These must be legal domain values for the provided scale.
   *   If provided, the count argument is ignored.
   * @param {function(*):string} [params.formatSpecifier] - A format specifier
   *   to use in conjunction with scale.tickFormat. Legal values are
   *   any valid d3 4.0 format specifier.
   * @param {function(*):string} [params.format] - The format function to use.
   *   If provided, the formatSpecifier argument is ignored.
   */
  function AxisTicks$1(params) {
    Transform.call(this, null, params);
  }
  inherits(AxisTicks$1, Transform, {
    transform: function transform(_, pulse) {
      if (this.value && !_.modified()) {
        return pulse.StopPropagation;
      }
      var locale = pulse.dataflow.locale(),
        out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
        ticks = this.value,
        scale = _.scale,
        tally = _.count == null ? _.values ? _.values.length : 10 : _.count,
        count = tickCount(scale, tally, _.minstep),
        format = _.format || tickFormat(locale, scale, count, _.formatSpecifier, _.formatType, !!_.values),
        values = _.values ? validTicks(scale, _.values, count) : tickValues(scale, count);
      if (ticks) out.rem = ticks;
      ticks = values.map(function (value, i) {
        return ingest$1({
          index: i / (values.length - 1 || 1),
          value: value,
          label: format(value)
        });
      });
      if (_.extra && ticks.length) {
        // add an extra tick pegged to the initial domain value
        // this is used to generate axes with 'binned' domains
        ticks.push(ingest$1({
          index: -1,
          extra: {
            value: ticks[0].value
          },
          label: ''
        }));
      }
      out.source = ticks;
      out.add = ticks;
      this.value = ticks;
      return out;
    }
  });

  /**
   * Joins a set of data elements against a set of visual items.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): object} [params.item] - An item generator function.
   * @param {function(object): *} [params.key] - The key field associating data and visual items.
   */
  function DataJoin$1(params) {
    Transform.call(this, null, params);
  }
  function defaultItemCreate() {
    return ingest$1({});
  }
  function newMap(key) {
    var map = fastmap().test(function (t) {
      return t.exit;
    });
    map.lookup = function (t) {
      return map.get(key(t));
    };
    return map;
  }
  inherits(DataJoin$1, Transform, {
    transform: function transform(_, pulse) {
      var df = pulse.dataflow,
        out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
        item = _.item || defaultItemCreate,
        key = _.key || tupleid,
        map = this.value;

      // prevent transient (e.g., hover) requests from
      // cascading across marks derived from marks
      if (isArray(out.encode)) {
        out.encode = null;
      }
      if (map && (_.modified('key') || pulse.modified(key))) {
        error('DataJoin does not support modified key function or fields.');
      }
      if (!map) {
        pulse = pulse.addAll();
        this.value = map = newMap(key);
      }
      pulse.visit(pulse.ADD, function (t) {
        var k = key(t);
        var x = map.get(k);
        if (x) {
          if (x.exit) {
            map.empty--;
            out.add.push(x);
          } else {
            out.mod.push(x);
          }
        } else {
          x = item(t);
          map.set(k, x);
          out.add.push(x);
        }
        x.datum = t;
        x.exit = false;
      });
      pulse.visit(pulse.MOD, function (t) {
        var k = key(t),
          x = map.get(k);
        if (x) {
          x.datum = t;
          out.mod.push(x);
        }
      });
      pulse.visit(pulse.REM, function (t) {
        var k = key(t),
          x = map.get(k);
        if (t === x.datum && !x.exit) {
          out.rem.push(x);
          x.exit = true;
          ++map.empty;
        }
      });
      if (pulse.changed(pulse.ADD_MOD)) out.modifies('datum');
      if (pulse.clean() || _.clean && map.empty > df.cleanThreshold) {
        df.runAfter(map.clean);
      }
      return out;
    }
  });

  /**
   * Invokes encoding functions for visual items.
   * @constructor
   * @param {object} params - The parameters to the encoding functions. This
   *   parameter object will be passed through to all invoked encoding functions.
   * @param {object} [params.mod=false] - Flag indicating if tuples in the input
   *   mod set that are unmodified by encoders should be included in the output.
   * @param {object} param.encoders - The encoding functions
   * @param {function(object, object): boolean} [param.encoders.update] - Update encoding set
   * @param {function(object, object): boolean} [param.encoders.enter] - Enter encoding set
   * @param {function(object, object): boolean} [param.encoders.exit] - Exit encoding set
   */
  function Encode$1(params) {
    Transform.call(this, null, params);
  }
  inherits(Encode$1, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.ADD_REM),
        fmod = _.mod || false,
        encoders = _.encoders,
        encode = pulse.encode;

      // if an array, the encode directive includes additional sets
      // that must be defined in order for the primary set to be invoked
      // e.g., only run the update set if the hover set is defined
      if (isArray(encode)) {
        if (out.changed() || encode.every(function (e) {
          return encoders[e];
        })) {
          encode = encode[0];
          out.encode = null; // consume targeted encode directive
        } else {
          return pulse.StopPropagation;
        }
      }

      // marshall encoder functions
      var reenter = encode === 'enter',
        update = encoders.update || falsy,
        enter = encoders.enter || falsy,
        exit = encoders.exit || falsy,
        set = (encode && !reenter ? encoders[encode] : update) || falsy;
      if (pulse.changed(pulse.ADD)) {
        pulse.visit(pulse.ADD, function (t) {
          enter(t, _);
          update(t, _);
        });
        out.modifies(enter.output);
        out.modifies(update.output);
        if (set !== falsy && set !== update) {
          pulse.visit(pulse.ADD, function (t) {
            set(t, _);
          });
          out.modifies(set.output);
        }
      }
      if (pulse.changed(pulse.REM) && exit !== falsy) {
        pulse.visit(pulse.REM, function (t) {
          exit(t, _);
        });
        out.modifies(exit.output);
      }
      if (reenter || set !== falsy) {
        var flag = pulse.MOD | (_.modified() ? pulse.REFLOW : 0);
        if (reenter) {
          pulse.visit(flag, function (t) {
            var mod = enter(t, _) || fmod;
            if (set(t, _) || mod) out.mod.push(t);
          });
          if (out.mod.length) out.modifies(enter.output);
        } else {
          pulse.visit(flag, function (t) {
            if (set(t, _) || fmod) out.mod.push(t);
          });
        }
        if (out.mod.length) out.modifies(set.output);
      }
      return out.changed() ? out : pulse.StopPropagation;
    }
  });

  /**
   * Generates legend entries for visualizing a scale.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Scale} params.scale - The scale to generate items for.
   * @param {*} [params.count=5] - The approximate number of items, or
   *   desired tick interval, to use.
   * @param {*} [params.limit] - The maximum number of entries to
   *   include in a symbol legend.
   * @param {Array<*>} [params.values] - The exact tick values to use.
   *   These must be legal domain values for the provided scale.
   *   If provided, the count argument is ignored.
   * @param {string} [params.formatSpecifier] - A format specifier
   *   to use in conjunction with scale.tickFormat. Legal values are
   *   any valid D3 format specifier string.
   * @param {function(*):string} [params.format] - The format function to use.
   *   If provided, the formatSpecifier argument is ignored.
   */
  function LegendEntries$1(params) {
    Transform.call(this, [], params);
  }
  inherits(LegendEntries$1, Transform, {
    transform: function transform(_, pulse) {
      if (this.value != null && !_.modified()) {
        return pulse.StopPropagation;
      }
      var locale = pulse.dataflow.locale(),
        out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
        items = this.value,
        type = _.type || SymbolLegend,
        scale = _.scale,
        limit = +_.limit,
        count = tickCount(scale, _.count == null ? 5 : _.count, _.minstep),
        lskip = !!_.values || type === SymbolLegend,
        format = _.format || labelFormat(locale, scale, count, type, _.formatSpecifier, _.formatType, lskip),
        values = _.values || labelValues(scale, count),
        domain,
        fraction,
        size,
        offset,
        ellipsis;
      if (items) out.rem = items;
      if (type === SymbolLegend) {
        if (limit && values.length > limit) {
          pulse.dataflow.warn('Symbol legend count exceeds limit, filtering items.');
          items = values.slice(0, limit - 1);
          ellipsis = true;
        } else {
          items = values;
        }
        if (isFunction(size = _.size)) {
          // if first value maps to size zero, remove from list (vega#717)
          if (!_.values && scale(items[0]) === 0) {
            items = items.slice(1);
          }
          // compute size offset for legend entries
          offset = items.reduce(function (max, value) {
            return Math.max(max, size(value, _));
          }, 0);
        } else {
          size = constant$1(offset = size || 8);
        }
        items = items.map(function (value, index) {
          return ingest$1({
            index: index,
            label: format(value, index, items),
            value: value,
            offset: offset,
            size: size(value, _)
          });
        });
        if (ellipsis) {
          ellipsis = values[items.length];
          items.push(ingest$1({
            index: items.length,
            label: "\u2026".concat(values.length - items.length, " entries"),
            value: ellipsis,
            offset: offset,
            size: size(ellipsis, _)
          }));
        }
      } else if (type === GradientLegend) {
        domain = scale.domain(), fraction = scaleFraction(scale, domain[0], peek$1(domain));

        // if automatic label generation produces 2 or fewer values,
        // use the domain end points instead (fixes vega/vega#1364)
        if (values.length < 3 && !_.values && domain[0] !== peek$1(domain)) {
          values = [domain[0], peek$1(domain)];
        }
        items = values.map(function (value, index) {
          return ingest$1({
            index: index,
            label: format(value, index, values),
            value: value,
            perc: fraction(value)
          });
        });
      } else {
        size = values.length - 1;
        fraction = labelFraction(scale);
        items = values.map(function (value, index) {
          return ingest$1({
            index: index,
            label: format(value, index, values),
            value: value,
            perc: index ? fraction(value) : 0,
            perc2: index === size ? 1 : fraction(values[index + 1])
          });
        });
      }
      out.source = items;
      out.add = items;
      this.value = items;
      return out;
    }
  });
  var sourceX = function sourceX(t) {
    return t.source.x;
  };
  var sourceY = function sourceY(t) {
    return t.source.y;
  };
  var targetX = function targetX(t) {
    return t.target.x;
  };
  var targetY = function targetY(t) {
    return t.target.y;
  };

  /**
   * Layout paths linking source and target elements.
   * @constructor
   * @param {object} params - The parameters for this operator.
   */
  function LinkPath(params) {
    Transform.call(this, {}, params);
  }
  LinkPath.Definition = {
    'type': 'LinkPath',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'sourceX',
      'type': 'field',
      'default': 'source.x'
    }, {
      'name': 'sourceY',
      'type': 'field',
      'default': 'source.y'
    }, {
      'name': 'targetX',
      'type': 'field',
      'default': 'target.x'
    }, {
      'name': 'targetY',
      'type': 'field',
      'default': 'target.y'
    }, {
      'name': 'orient',
      'type': 'enum',
      'default': 'vertical',
      'values': ['horizontal', 'vertical', 'radial']
    }, {
      'name': 'shape',
      'type': 'enum',
      'default': 'line',
      'values': ['line', 'arc', 'curve', 'diagonal', 'orthogonal']
    }, {
      'name': 'require',
      'type': 'signal'
    }, {
      'name': 'as',
      'type': 'string',
      'default': 'path'
    }]
  };
  inherits(LinkPath, Transform, {
    transform: function transform(_, pulse) {
      var sx = _.sourceX || sourceX,
        sy = _.sourceY || sourceY,
        tx = _.targetX || targetX,
        ty = _.targetY || targetY,
        as = _.as || 'path',
        orient = _.orient || 'vertical',
        shape = _.shape || 'line',
        path = Paths.get(shape + '-' + orient) || Paths.get(shape);
      if (!path) {
        error('LinkPath unsupported type: ' + _.shape + (_.orient ? '-' + _.orient : ''));
      }
      pulse.visit(pulse.SOURCE, function (t) {
        t[as] = path(sx(t), sy(t), tx(t), ty(t));
      });
      return pulse.reflow(_.modified()).modifies(as);
    }
  });
  var line = function line(sx, sy, tx, ty) {
    return 'M' + sx + ',' + sy + 'L' + tx + ',' + ty;
  };
  var lineR = function lineR(sa, sr, ta, tr) {
    return line(sr * Math.cos(sa), sr * Math.sin(sa), tr * Math.cos(ta), tr * Math.sin(ta));
  };
  var arc = function arc(sx, sy, tx, ty) {
    var dx = tx - sx,
      dy = ty - sy,
      rr = Math.hypot(dx, dy) / 2,
      ra = 180 * Math.atan2(dy, dx) / Math.PI;
    return 'M' + sx + ',' + sy + 'A' + rr + ',' + rr + ' ' + ra + ' 0 1' + ' ' + tx + ',' + ty;
  };
  var arcR = function arcR(sa, sr, ta, tr) {
    return arc(sr * Math.cos(sa), sr * Math.sin(sa), tr * Math.cos(ta), tr * Math.sin(ta));
  };
  var curve = function curve(sx, sy, tx, ty) {
    var dx = tx - sx,
      dy = ty - sy,
      ix = 0.2 * (dx + dy),
      iy = 0.2 * (dy - dx);
    return 'M' + sx + ',' + sy + 'C' + (sx + ix) + ',' + (sy + iy) + ' ' + (tx + iy) + ',' + (ty - ix) + ' ' + tx + ',' + ty;
  };
  var curveR = function curveR(sa, sr, ta, tr) {
    return curve(sr * Math.cos(sa), sr * Math.sin(sa), tr * Math.cos(ta), tr * Math.sin(ta));
  };
  var orthoX = function orthoX(sx, sy, tx, ty) {
    return 'M' + sx + ',' + sy + 'V' + ty + 'H' + tx;
  };
  var orthoY = function orthoY(sx, sy, tx, ty) {
    return 'M' + sx + ',' + sy + 'H' + tx + 'V' + ty;
  };
  var orthoR = function orthoR(sa, sr, ta, tr) {
    var sc = Math.cos(sa),
      ss = Math.sin(sa),
      tc = Math.cos(ta),
      ts = Math.sin(ta),
      sf = Math.abs(ta - sa) > Math.PI ? ta <= sa : ta > sa;
    return 'M' + sr * sc + ',' + sr * ss + 'A' + sr + ',' + sr + ' 0 0,' + (sf ? 1 : 0) + ' ' + sr * tc + ',' + sr * ts + 'L' + tr * tc + ',' + tr * ts;
  };
  var diagonalX = function diagonalX(sx, sy, tx, ty) {
    var m = (sx + tx) / 2;
    return 'M' + sx + ',' + sy + 'C' + m + ',' + sy + ' ' + m + ',' + ty + ' ' + tx + ',' + ty;
  };
  var diagonalY = function diagonalY(sx, sy, tx, ty) {
    var m = (sy + ty) / 2;
    return 'M' + sx + ',' + sy + 'C' + sx + ',' + m + ' ' + tx + ',' + m + ' ' + tx + ',' + ty;
  };
  var diagonalR = function diagonalR(sa, sr, ta, tr) {
    var sc = Math.cos(sa),
      ss = Math.sin(sa),
      tc = Math.cos(ta),
      ts = Math.sin(ta),
      mr = (sr + tr) / 2;
    return 'M' + sr * sc + ',' + sr * ss + 'C' + mr * sc + ',' + mr * ss + ' ' + mr * tc + ',' + mr * ts + ' ' + tr * tc + ',' + tr * ts;
  };
  var Paths = fastmap({
    'line': line,
    'line-radial': lineR,
    'arc': arc,
    'arc-radial': arcR,
    'curve': curve,
    'curve-radial': curveR,
    'orthogonal-horizontal': orthoX,
    'orthogonal-vertical': orthoY,
    'orthogonal-radial': orthoR,
    'diagonal-horizontal': diagonalX,
    'diagonal-vertical': diagonalY,
    'diagonal-radial': diagonalR
  });

  /**
   * Pie and donut chart layout.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - The value field to size pie segments.
   * @param {number} [params.startAngle=0] - The start angle (in radians) of the layout.
   * @param {number} [params.endAngle=2π] - The end angle (in radians) of the layout.
   * @param {boolean} [params.sort] - Boolean flag for sorting sectors by value.
   */
  function Pie(params) {
    Transform.call(this, null, params);
  }
  Pie.Definition = {
    'type': 'Pie',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'field',
      'type': 'field'
    }, {
      'name': 'startAngle',
      'type': 'number',
      'default': 0
    }, {
      'name': 'endAngle',
      'type': 'number',
      'default': 6.283185307179586
    }, {
      'name': 'sort',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': 2,
      'default': ['startAngle', 'endAngle']
    }]
  };
  inherits(Pie, Transform, {
    transform: function transform(_, pulse) {
      var as = _.as || ['startAngle', 'endAngle'],
        startAngle = as[0],
        endAngle = as[1],
        field = _.field || one$1,
        start = _.startAngle || 0,
        stop = _.endAngle != null ? _.endAngle : 2 * Math.PI,
        data = pulse.source,
        values = data.map(field),
        n = values.length,
        a = start,
        k = (stop - start) / d3Array.sum(values),
        index = d3Array.range(n),
        i,
        t,
        v;
      if (_.sort) {
        index.sort(function (a, b) {
          return values[a] - values[b];
        });
      }
      for (i = 0; i < n; ++i) {
        v = values[index[i]];
        t = data[index[i]];
        t[startAngle] = a;
        t[endAngle] = a += v * k;
      }
      this.value = values;
      return pulse.reflow(_.modified()).modifies(as);
    }
  });
  var DEFAULT_COUNT = 5;
  function includeZero(scale) {
    var type = scale.type;
    return !scale.bins && (type === Linear || type === Pow || type === Sqrt);
  }
  function includePad(type) {
    return isContinuous(type) && type !== Sequential;
  }
  var SKIP$1 = toSet(['set', 'modified', 'clear', 'type', 'scheme', 'schemeExtent', 'schemeCount', 'domain', 'domainMin', 'domainMid', 'domainMax', 'domainRaw', 'domainImplicit', 'nice', 'zero', 'bins', 'range', 'rangeStep', 'round', 'reverse', 'interpolate', 'interpolateGamma']);

  /**
   * Maintains a scale function mapping data values to visual channels.
   * @constructor
   * @param {object} params - The parameters for this operator.
   */
  function Scale$1(params) {
    Transform.call(this, null, params);
    this.modified(true); // always treat as modified
  }

  inherits(Scale$1, Transform, {
    transform: function transform(_, pulse) {
      var df = pulse.dataflow,
        scale$1 = this.value,
        key = scaleKey(_);
      if (!scale$1 || key !== scale$1.type) {
        this.value = scale$1 = scale$4(key)();
      }
      for (key in _) if (!SKIP$1[key]) {
        // padding is a scale property for band/point but not others
        if (key === 'padding' && includePad(scale$1.type)) continue;
        // invoke scale property setter, raise warning if not found
        isFunction(scale$1[key]) ? scale$1[key](_[key]) : df.warn('Unsupported scale property: ' + key);
      }
      configureRange(scale$1, _, configureBins(scale$1, _, configureDomain(scale$1, _, df)));
      return pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS);
    }
  });
  function scaleKey(_) {
    var t = _.type,
      d = '',
      n;

    // backwards compatibility pre Vega 5.
    if (t === Sequential) return Sequential + '-' + Linear;
    if (isContinuousColor(_)) {
      n = _.rawDomain ? _.rawDomain.length : _.domain ? _.domain.length + +(_.domainMid != null) : 0;
      d = n === 2 ? Sequential + '-' : n === 3 ? Diverging + '-' : '';
    }
    return (d + t || Linear).toLowerCase();
  }
  function isContinuousColor(_) {
    var t = _.type;
    return isContinuous(t) && t !== Time && t !== UTC && (_.scheme || _.range && _.range.length && _.range.every(isString));
  }
  function configureDomain(scale, _, df) {
    // check raw domain, if provided use that and exit early
    var raw = rawDomain(scale, _.domainRaw, df);
    if (raw > -1) return raw;
    var domain = _.domain,
      type = scale.type,
      zero = _.zero || _.zero === undefined && includeZero(scale),
      n,
      mid;
    if (!domain) return 0;

    // adjust continuous domain for minimum pixel padding
    if (includePad(type) && _.padding && domain[0] !== peek$1(domain)) {
      domain = padDomain(type, domain, _.range, _.padding, _.exponent, _.constant);
    }

    // adjust domain based on zero, min, max settings
    if (zero || _.domainMin != null || _.domainMax != null || _.domainMid != null) {
      n = (domain = domain.slice()).length - 1 || 1;
      if (zero) {
        if (domain[0] > 0) domain[0] = 0;
        if (domain[n] < 0) domain[n] = 0;
      }
      if (_.domainMin != null) domain[0] = _.domainMin;
      if (_.domainMax != null) domain[n] = _.domainMax;
      if (_.domainMid != null) {
        mid = _.domainMid;
        var i = mid > domain[n] ? n + 1 : mid < domain[0] ? 0 : n;
        if (i !== n) df.warn('Scale domainMid exceeds domain min or max.', mid);
        domain.splice(i, 0, mid);
      }
    }

    // set the scale domain
    scale.domain(domainCheck(type, domain, df));

    // if ordinal scale domain is defined, prevent implicit
    // domain construction as side-effect of scale lookup
    if (type === Ordinal) {
      scale.unknown(_.domainImplicit ? $$1.scaleImplicit : undefined);
    }

    // perform 'nice' adjustment as requested
    if (_.nice && scale.nice) {
      scale.nice(_.nice !== true && tickCount(scale, _.nice) || null);
    }

    // return the cardinality of the domain
    return domain.length;
  }
  function rawDomain(scale, raw, df) {
    if (raw) {
      scale.domain(domainCheck(scale.type, raw, df));
      return raw.length;
    } else {
      return -1;
    }
  }
  function padDomain(type, domain, range, pad, exponent, constant) {
    var span = Math.abs(peek$1(range) - range[0]),
      frac = span / (span - 2 * pad),
      d = type === Log ? zoomLog(domain, null, frac) : type === Sqrt ? zoomPow(domain, null, frac, 0.5) : type === Pow ? zoomPow(domain, null, frac, exponent || 1) : type === Symlog ? zoomSymlog(domain, null, frac, constant || 1) : zoomLinear(domain, null, frac);
    domain = domain.slice();
    domain[0] = d[0];
    domain[domain.length - 1] = d[1];
    return domain;
  }
  function domainCheck(type, domain, df) {
    if (isLogarithmic(type)) {
      // sum signs of domain values
      // if all pos or all neg, abs(sum) === domain.length
      var s = Math.abs(domain.reduce(function (s, v) {
        return s + (v < 0 ? -1 : v > 0 ? 1 : 0);
      }, 0));
      if (s !== domain.length) {
        df.warn('Log scale domain includes zero: ' + $(domain));
      }
    }
    return domain;
  }
  function configureBins(scale, _, count) {
    var bins = _.bins;
    if (bins && !isArray(bins)) {
      // generate bin boundary array
      var domain = scale.domain(),
        lo = domain[0],
        hi = peek$1(domain),
        step = bins.step;
      var start = bins.start == null ? lo : bins.start,
        stop = bins.stop == null ? hi : bins.stop;
      if (!step) error('Scale bins parameter missing step property.');
      if (start < lo) start = step * Math.ceil(lo / step);
      if (stop > hi) stop = step * Math.floor(hi / step);
      bins = d3Array.range(start, stop + step / 2, step);
    }
    if (bins) {
      // assign bin boundaries to scale instance
      scale.bins = bins;
    } else if (scale.bins) {
      // no current bins, remove bins if previously set
      delete scale.bins;
    }

    // special handling for bin-ordinal scales
    if (scale.type === BinOrdinal) {
      if (!bins) {
        // the domain specifies the bins
        scale.bins = scale.domain();
      } else if (!_.domain && !_.domainRaw) {
        // the bins specify the domain
        scale.domain(bins);
        count = bins.length;
      }
    }

    // return domain cardinality
    return count;
  }
  function configureRange(scale, _, count) {
    var type = scale.type,
      round = _.round || false,
      range = _.range;

    // if range step specified, calculate full range extent
    if (_.rangeStep != null) {
      range = configureRangeStep(type, _, count);
    }

    // else if a range scheme is defined, use that
    else if (_.scheme) {
      range = configureScheme(type, _, count);
      if (isFunction(range)) {
        if (scale.interpolator) {
          return scale.interpolator(range);
        } else {
          error("Scale type ".concat(type, " does not support interpolating color schemes."));
        }
      }
    }

    // given a range array for an interpolating scale, convert to interpolator
    if (range && isInterpolating(type)) {
      return scale.interpolator(interpolateColors(flip(range, _.reverse), _.interpolate, _.interpolateGamma));
    }

    // configure rounding / interpolation
    if (range && _.interpolate && scale.interpolate) {
      scale.interpolate(interpolate(_.interpolate, _.interpolateGamma));
    } else if (isFunction(scale.round)) {
      scale.round(round);
    } else if (isFunction(scale.rangeRound)) {
      scale.interpolate(round ? $$1$1.interpolateRound : $$1$1.interpolate);
    }
    if (range) scale.range(flip(range, _.reverse));
  }
  function configureRangeStep(type, _, count) {
    if (type !== Band && type !== Point) {
      error('Only band and point scales support rangeStep.');
    }

    // calculate full range based on requested step size and padding
    var outer = (_.paddingOuter != null ? _.paddingOuter : _.padding) || 0,
      inner = type === Point ? 1 : (_.paddingInner != null ? _.paddingInner : _.padding) || 0;
    return [0, _.rangeStep * bandSpace(count, inner, outer)];
  }
  function configureScheme(type, _, count) {
    var extent = _.schemeExtent,
      name,
      scheme$1;
    if (isArray(_.scheme)) {
      scheme$1 = interpolateColors(_.scheme, _.interpolate, _.interpolateGamma);
    } else {
      name = _.scheme.toLowerCase();
      scheme$1 = scheme(name);
      if (!scheme$1) error("Unrecognized scheme name: ".concat(_.scheme));
    }

    // determine size for potential discrete range
    count = type === Threshold ? count + 1 : type === BinOrdinal ? count - 1 : type === Quantile || type === Quantize ? +_.schemeCount || DEFAULT_COUNT : count;

    // adjust and/or quantize scheme as appropriate
    return isInterpolating(type) ? adjustScheme(scheme$1, extent, _.reverse) : isFunction(scheme$1) ? quantizeInterpolator(adjustScheme(scheme$1, extent), count) : type === Ordinal ? scheme$1 : scheme$1.slice(0, count);
  }
  function adjustScheme(scheme, extent, reverse) {
    return isFunction(scheme) && (extent || reverse) ? interpolateRange(scheme, flip(extent || [0, 1], reverse)) : scheme;
  }
  function flip(array, reverse) {
    return reverse ? array.slice().reverse() : array;
  }

  /**
   * Sorts scenegraph items in the pulse source array.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(*,*): number} [params.sort] - A comparator
   *   function for sorting tuples.
   */
  function SortItems$1(params) {
    Transform.call(this, null, params);
  }
  inherits(SortItems$1, Transform, {
    transform: function transform(_, pulse) {
      var mod = _.modified('sort') || pulse.changed(pulse.ADD) || pulse.modified(_.sort.fields) || pulse.modified('datum');
      if (mod) pulse.source.sort(stableCompare(_.sort));
      this.modified(mod);
      return pulse;
    }
  });
  var Zero = 'zero',
    Center$1 = 'center',
    Normalize = 'normalize',
    DefOutput = ['y0', 'y1'];

  /**
   * Stack layout for visualization elements.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - The value field to stack.
   * @param {Array<function(object): *>} [params.groupby] - An array of accessors to groupby.
   * @param {function(object,object): number} [params.sort] - A comparator for stack sorting.
   * @param {string} [offset='zero'] - Stack baseline offset. One of 'zero', 'center', 'normalize'.
   */
  function Stack(params) {
    Transform.call(this, null, params);
  }
  Stack.Definition = {
    'type': 'Stack',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'field',
      'type': 'field'
    }, {
      'name': 'groupby',
      'type': 'field',
      'array': true
    }, {
      'name': 'sort',
      'type': 'compare'
    }, {
      'name': 'offset',
      'type': 'enum',
      'default': Zero,
      'values': [Zero, Center$1, Normalize]
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': 2,
      'default': DefOutput
    }]
  };
  inherits(Stack, Transform, {
    transform: function transform(_, pulse) {
      var as = _.as || DefOutput,
        y0 = as[0],
        y1 = as[1],
        sort = stableCompare(_.sort),
        field = _.field || one$1,
        stack = _.offset === Center$1 ? stackCenter : _.offset === Normalize ? stackNormalize : stackZero,
        groups,
        i,
        n,
        max;

      // partition, sum, and sort the stack groups
      groups = partition$2(pulse.source, _.groupby, sort, field);

      // compute stack layouts per group
      for (i = 0, n = groups.length, max = groups.max; i < n; ++i) {
        stack(groups[i], max, field, y0, y1);
      }
      return pulse.reflow(_.modified()).modifies(as);
    }
  });
  function stackCenter(group, max, field, y0, y1) {
    var last = (max - group.sum) / 2,
      m = group.length,
      j = 0,
      t;
    for (; j < m; ++j) {
      t = group[j];
      t[y0] = last;
      t[y1] = last += Math.abs(field(t));
    }
  }
  function stackNormalize(group, max, field, y0, y1) {
    var scale = 1 / group.sum,
      last = 0,
      m = group.length,
      j = 0,
      v = 0,
      t;
    for (; j < m; ++j) {
      t = group[j];
      t[y0] = last;
      t[y1] = last = scale * (v += Math.abs(field(t)));
    }
  }
  function stackZero(group, max, field, y0, y1) {
    var lastPos = 0,
      lastNeg = 0,
      m = group.length,
      j = 0,
      v,
      t;
    for (; j < m; ++j) {
      t = group[j];
      v = +field(t);
      if (v < 0) {
        t[y0] = lastNeg;
        t[y1] = lastNeg += v;
      } else {
        t[y0] = lastPos;
        t[y1] = lastPos += v;
      }
    }
  }
  function partition$2(data, groupby, sort, field) {
    var groups = [],
      get = function get(f) {
        return f(t);
      },
      map,
      i,
      n,
      m,
      t,
      k,
      g,
      s,
      max;

    // partition data points into stack groups
    if (groupby == null) {
      groups.push(data.slice());
    } else {
      for (map = {}, i = 0, n = data.length; i < n; ++i) {
        t = data[i];
        k = groupby.map(get);
        g = map[k];
        if (!g) {
          map[k] = g = [];
          groups.push(g);
        }
        g.push(t);
      }
    }

    // compute sums of groups, sort groups as needed
    for (k = 0, max = 0, m = groups.length; k < m; ++k) {
      g = groups[k];
      for (i = 0, s = 0, n = g.length; i < n; ++i) {
        s += Math.abs(field(g[i]));
      }
      g.sum = s;
      if (s > max) max = s;
      if (sort) g.sort(sort);
    }
    groups.max = max;
    return groups;
  }

  var encode$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    axisticks: AxisTicks$1,
    datajoin: DataJoin$1,
    encode: Encode$1,
    legendentries: LegendEntries$1,
    linkpath: LinkPath,
    pie: Pie,
    scale: Scale$1,
    sortitems: SortItems$1,
    stack: Stack
  });

  var abs = Math.abs;
  var cos = Math.cos;
  var sin = Math.sin;
  var epsilon = 1e-6;
  var pi = Math.PI;
  var halfPi = pi / 2;
  var sqrt2 = sqrt(2);
  function asin(x) {
    return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
  }
  function sqrt(x) {
    return x > 0 ? Math.sqrt(x) : 0;
  }

  function mollweideBromleyTheta(cp, phi) {
    var cpsinPhi = cp * sin(phi),
      i = 30,
      delta;
    do phi -= delta = (phi + sin(phi) - cpsinPhi) / (1 + cos(phi)); while (abs(delta) > epsilon && --i > 0);
    return phi / 2;
  }
  function mollweideBromleyRaw(cx, cy, cp) {
    function forward(lambda, phi) {
      return [cx * lambda * cos(phi = mollweideBromleyTheta(cp, phi)), cy * sin(phi)];
    }
    forward.invert = function (x, y) {
      return y = asin(y / cy), [x / (cx * cos(y)), asin((2 * y + sin(2 * y)) / cp)];
    };
    return forward;
  }
  var mollweideRaw = mollweideBromleyRaw(sqrt2 / halfPi, sqrt2, pi);
  function geoMollweide () {
    return d3Geo.geoProjection(mollweideRaw).scale(169.529);
  }

  var defaultPath = d3Geo.geoPath();
  var projectionProperties = [
  // standard properties in d3-geo
  'clipAngle', 'clipExtent', 'scale', 'translate', 'center', 'rotate', 'parallels', 'precision', 'reflectX', 'reflectY',
  // extended properties in d3-geo-projections
  'coefficient', 'distance', 'fraction', 'lobes', 'parallel', 'radius', 'ratio', 'spacing', 'tilt'];

  /**
   * Augment projections with their type and a copy method.
   */
  function create$1(type, constructor) {
    return function projection() {
      var p = constructor();
      p.type = type;
      p.path = d3Geo.geoPath().projection(p);
      p.copy = p.copy || function () {
        var c = projection();
        projectionProperties.forEach(function (prop) {
          if (p[prop]) c[prop](p[prop]());
        });
        c.path.pointRadius(p.path.pointRadius());
        return c;
      };
      return registerScale(p);
    };
  }
  function projection(type, proj) {
    if (!type || typeof type !== 'string') {
      throw new Error('Projection type must be a name string.');
    }
    type = type.toLowerCase();
    if (arguments.length > 1) {
      projections[type] = create$1(type, proj);
      return this;
    } else {
      return projections[type] || null;
    }
  }
  function getProjectionPath(proj) {
    return proj && proj.path || defaultPath;
  }
  var projections = {
    // base d3-geo projection types
    albers: d3Geo.geoAlbers,
    albersusa: d3Geo.geoAlbersUsa,
    azimuthalequalarea: d3Geo.geoAzimuthalEqualArea,
    azimuthalequidistant: d3Geo.geoAzimuthalEquidistant,
    conicconformal: d3Geo.geoConicConformal,
    conicequalarea: d3Geo.geoConicEqualArea,
    conicequidistant: d3Geo.geoConicEquidistant,
    equalEarth: d3Geo.geoEqualEarth,
    equirectangular: d3Geo.geoEquirectangular,
    gnomonic: d3Geo.geoGnomonic,
    identity: d3Geo.geoIdentity,
    mercator: d3Geo.geoMercator,
    mollweide: geoMollweide,
    naturalEarth1: d3Geo.geoNaturalEarth1,
    orthographic: d3Geo.geoOrthographic,
    stereographic: d3Geo.geoStereographic,
    transversemercator: d3Geo.geoTransverseMercator
  };
  for (var key in projections) {
    projection(key, projections[key]);
  }

  function noop() {}
  var cases = [[], [[[1.0, 1.5], [0.5, 1.0]]], [[[1.5, 1.0], [1.0, 1.5]]], [[[1.5, 1.0], [0.5, 1.0]]], [[[1.0, 0.5], [1.5, 1.0]]], [[[1.0, 1.5], [0.5, 1.0]], [[1.0, 0.5], [1.5, 1.0]]], [[[1.0, 0.5], [1.0, 1.5]]], [[[1.0, 0.5], [0.5, 1.0]]], [[[0.5, 1.0], [1.0, 0.5]]], [[[1.0, 1.5], [1.0, 0.5]]], [[[0.5, 1.0], [1.0, 0.5]], [[1.5, 1.0], [1.0, 1.5]]], [[[1.5, 1.0], [1.0, 0.5]]], [[[0.5, 1.0], [1.5, 1.0]]], [[[1.0, 1.5], [1.5, 1.0]]], [[[0.5, 1.0], [1.0, 1.5]]], []];

  // Implementation adapted from d3/d3-contour. Thanks!
  function contours() {
    var dx = 1,
      dy = 1,
      smooth = smoothLinear;
    function contours(values, tz) {
      return tz.map(function (value) {
        return contour(values, value);
      });
    }

    // Accumulate, smooth contour rings, assign holes to exterior rings.
    // Based on https://github.com/mbostock/shapefile/blob/v0.6.2/shp/polygon.js
    function contour(values, value) {
      var polygons = [],
        holes = [];
      isorings(values, value, function (ring) {
        smooth(ring, values, value);
        if (area(ring) > 0) polygons.push([ring]);else holes.push(ring);
      });
      holes.forEach(function (hole) {
        for (var i = 0, n = polygons.length, polygon; i < n; ++i) {
          if (contains((polygon = polygons[i])[0], hole) !== -1) {
            polygon.push(hole);
            return;
          }
        }
      });
      return {
        type: 'MultiPolygon',
        value: value,
        coordinates: polygons
      };
    }

    // Marching squares with isolines stitched into rings.
    // Based on https://github.com/topojson/topojson-client/blob/v3.0.0/src/stitch.js
    function isorings(values, value, callback) {
      var fragmentByStart = new Array(),
        fragmentByEnd = new Array(),
        x,
        y,
        t0,
        t1,
        t2,
        t3;

      // Special case for the first row (y = -1, t2 = t3 = 0).
      x = y = -1;
      t1 = values[0] >= value;
      cases[t1 << 1].forEach(stitch);
      while (++x < dx - 1) {
        t0 = t1, t1 = values[x + 1] >= value;
        cases[t0 | t1 << 1].forEach(stitch);
      }
      cases[t1 << 0].forEach(stitch);

      // General case for the intermediate rows.
      while (++y < dy - 1) {
        x = -1;
        t1 = values[y * dx + dx] >= value;
        t2 = values[y * dx] >= value;
        cases[t1 << 1 | t2 << 2].forEach(stitch);
        while (++x < dx - 1) {
          t0 = t1, t1 = values[y * dx + dx + x + 1] >= value;
          t3 = t2, t2 = values[y * dx + x + 1] >= value;
          cases[t0 | t1 << 1 | t2 << 2 | t3 << 3].forEach(stitch);
        }
        cases[t1 | t2 << 3].forEach(stitch);
      }

      // Special case for the last row (y = dy - 1, t0 = t1 = 0).
      x = -1;
      t2 = values[y * dx] >= value;
      cases[t2 << 2].forEach(stitch);
      while (++x < dx - 1) {
        t3 = t2, t2 = values[y * dx + x + 1] >= value;
        cases[t2 << 2 | t3 << 3].forEach(stitch);
      }
      cases[t2 << 3].forEach(stitch);
      function stitch(line) {
        var start = [line[0][0] + x, line[0][1] + y],
          end = [line[1][0] + x, line[1][1] + y],
          startIndex = index(start),
          endIndex = index(end),
          f,
          g;
        if (f = fragmentByEnd[startIndex]) {
          if (g = fragmentByStart[endIndex]) {
            delete fragmentByEnd[f.end];
            delete fragmentByStart[g.start];
            if (f === g) {
              f.ring.push(end);
              callback(f.ring);
            } else {
              fragmentByStart[f.start] = fragmentByEnd[g.end] = {
                start: f.start,
                end: g.end,
                ring: f.ring.concat(g.ring)
              };
            }
          } else {
            delete fragmentByEnd[f.end];
            f.ring.push(end);
            fragmentByEnd[f.end = endIndex] = f;
          }
        } else if (f = fragmentByStart[endIndex]) {
          if (g = fragmentByEnd[startIndex]) {
            delete fragmentByStart[f.start];
            delete fragmentByEnd[g.end];
            if (f === g) {
              f.ring.push(end);
              callback(f.ring);
            } else {
              fragmentByStart[g.start] = fragmentByEnd[f.end] = {
                start: g.start,
                end: f.end,
                ring: g.ring.concat(f.ring)
              };
            }
          } else {
            delete fragmentByStart[f.start];
            f.ring.unshift(start);
            fragmentByStart[f.start = startIndex] = f;
          }
        } else {
          fragmentByStart[startIndex] = fragmentByEnd[endIndex] = {
            start: startIndex,
            end: endIndex,
            ring: [start, end]
          };
        }
      }
    }
    function index(point) {
      return point[0] * 2 + point[1] * (dx + 1) * 4;
    }
    function smoothLinear(ring, values, value) {
      ring.forEach(function (point) {
        var x = point[0],
          y = point[1],
          xt = x | 0,
          yt = y | 0,
          v0,
          v1 = values[yt * dx + xt];
        if (x > 0 && x < dx && xt === x) {
          v0 = values[yt * dx + xt - 1];
          point[0] = x + (value - v0) / (v1 - v0) - 0.5;
        }
        if (y > 0 && y < dy && yt === y) {
          v0 = values[(yt - 1) * dx + xt];
          point[1] = y + (value - v0) / (v1 - v0) - 0.5;
        }
      });
    }
    contours.contour = contour;
    contours.size = function (_) {
      if (!arguments.length) return [dx, dy];
      var _0 = Math.floor(_[0]),
        _1 = Math.floor(_[1]);
      if (!(_0 >= 0 && _1 >= 0)) error('invalid size');
      return dx = _0, dy = _1, contours;
    };
    contours.smooth = function (_) {
      return arguments.length ? (smooth = _ ? smoothLinear : noop, contours) : smooth === smoothLinear;
    };
    return contours;
  }
  function area(ring) {
    var i = 0,
      n = ring.length,
      area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];
    while (++i < n) area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
    return area;
  }
  function contains(ring, hole) {
    var i = -1,
      n = hole.length,
      c;
    while (++i < n) if (c = ringContains(ring, hole[i])) return c;
    return 0;
  }
  function ringContains(ring, point) {
    var x = point[0],
      y = point[1],
      contains = -1;
    for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
      var pi = ring[i],
        xi = pi[0],
        yi = pi[1],
        pj = ring[j],
        xj = pj[0],
        yj = pj[1];
      if (segmentContains(pi, pj, point)) return 0;
      if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) contains = -contains;
    }
    return contains;
  }
  function segmentContains(a, b, c) {
    var i;
    return collinear(a, b, c) && within(a[i = +(a[0] === b[0])], c[i], b[i]);
  }
  function collinear(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) === (c[0] - a[0]) * (b[1] - a[1]);
  }
  function within(p, q, r) {
    return p <= q && q <= r || r <= q && q <= p;
  }
  function quantize(k, nice, zero) {
    return function (values) {
      var ex = extent(values),
        start = zero ? Math.min(ex[0], 0) : ex[0],
        stop = ex[1],
        span = stop - start,
        step = nice ? d3Array.tickStep(start, stop, k) : span / (k + 1);
      return d3Array.range(start + step, stop, step);
    };
  }

  /**
   * Generate isocontours (level sets) based on input raster grid data.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} [params.field] - The field with raster grid
   *   data. If unspecified, the tuple itself is interpreted as a raster grid.
   * @param {Array<number>} [params.thresholds] - Contour threshold array. If
   *   specified, the levels, nice, resolve, and zero parameters are ignored.
   * @param {number} [params.levels] - The desired number of contour levels.
   * @param {boolean} [params.nice] - Boolean flag indicating if the contour
   *   threshold values should be automatically aligned to "nice"
   *   human-friendly values. Setting this flag may cause the number of
   *   thresholds to deviate from the specified levels.
   * @param {string} [params.resolve] - The method for resolving thresholds
   *   across multiple input grids. If 'independent' (the default), threshold
   *   calculation will be performed separately for each grid. If 'shared', a
   *   single set of threshold values will be used for all input grids.
   * @param {boolean} [params.zero] - Boolean flag indicating if the contour
   *   threshold values should include zero.
   * @param {boolean} [params.smooth] - Boolean flag indicating if the contour
   *   polygons should be smoothed using linear interpolation. The default is
   *   true. The parameter is ignored when using density estimation.
   * @param {boolean} [params.scale] - Optional numerical value by which to
   *   scale the output isocontour coordinates. This parameter can be useful
   *   to scale the contours to match a desired output resolution.
   * @param {string} [params.as='contour'] - The output field in which to store
   *   the generated isocontour data (default 'contour').
   */
  function Isocontour(params) {
    Transform.call(this, null, params);
  }
  Isocontour.Definition = {
    'type': 'Isocontour',
    'metadata': {
      'generates': true
    },
    'params': [{
      'name': 'field',
      'type': 'field'
    }, {
      'name': 'thresholds',
      'type': 'number',
      'array': true
    }, {
      'name': 'levels',
      'type': 'number'
    }, {
      'name': 'nice',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'resolve',
      'type': 'enum',
      'values': ['shared', 'independent'],
      'default': 'independent'
    }, {
      'name': 'zero',
      'type': 'boolean',
      'default': true
    }, {
      'name': 'smooth',
      'type': 'boolean',
      'default': true
    }, {
      'name': 'scale',
      'type': 'number',
      'expr': true
    }, {
      'name': 'translate',
      'type': 'number',
      'array': true,
      'expr': true
    }, {
      'name': 'as',
      'type': 'string',
      'null': true,
      'default': 'contour'
    }]
  };
  inherits(Isocontour, Transform, {
    transform: function transform(_, pulse) {
      if (this.value && !pulse.changed() && !_.modified()) {
        return pulse.StopPropagation;
      }
      var out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
        source = pulse.materialize(pulse.SOURCE).source,
        field = _.field || identity,
        contour = contours().smooth(_.smooth !== false),
        tz = _.thresholds || levels(source, field, _),
        as = _.as === null ? null : _.as || 'contour',
        values = [];
      source.forEach(function (t) {
        var grid = field(t);

        // generate contour paths in GeoJSON format
        var paths = contour.size([grid.width, grid.height])(grid.values, isArray(tz) ? tz : tz(grid.values));

        // adjust contour path coordinates as needed
        transformPaths(paths, grid, t, _);

        // ingest; copy source data properties to output
        paths.forEach(function (p) {
          values.push(rederive(t, ingest$1(as != null ? _defineProperty({}, as, p) : p)));
        });
      });
      if (this.value) out.rem = this.value;
      this.value = out.source = out.add = values;
      return out;
    }
  });
  function levels(values, f, _) {
    var q = quantize(_.levels || 10, _.nice, _.zero !== false);
    return _.resolve !== 'shared' ? q : q(values.map(function (t) {
      return d3Array.max(f(t).values);
    }));
  }
  function transformPaths(paths, grid, datum, _) {
    var s = _.scale || grid.scale,
      t = _.translate || grid.translate;
    if (isFunction(s)) s = s(datum, _);
    if (isFunction(t)) t = t(datum, _);
    if ((s === 1 || s == null) && !t) return;
    var sx = (isNumber$1(s) ? s : s[0]) || 1,
      sy = (isNumber$1(s) ? s : s[1]) || 1,
      tx = t && t[0] || 0,
      ty = t && t[1] || 0;
    paths.forEach(_transform(grid, sx, sy, tx, ty));
  }
  function _transform(grid, sx, sy, tx, ty) {
    var x1 = grid.x1 || 0,
      y1 = grid.y1 || 0,
      flip = sx * sy < 0;
    function transformPolygon(coordinates) {
      coordinates.forEach(transformRing);
    }
    function transformRing(coordinates) {
      if (flip) coordinates.reverse(); // maintain winding order
      coordinates.forEach(transformPoint);
    }
    function transformPoint(coordinates) {
      coordinates[0] = (coordinates[0] - x1) * sx + tx;
      coordinates[1] = (coordinates[1] - y1) * sy + ty;
    }
    return function (geometry) {
      geometry.coordinates.forEach(transformPolygon);
      return geometry;
    };
  }
  function radius(bw, data, f) {
    var v = bw >= 0 ? bw : estimateBandwidth(data, f);
    return Math.round((Math.sqrt(4 * v * v + 1) - 1) / 2);
  }
  function number$2(_) {
    return isFunction(_) ? _ : constant$1(+_);
  }

  // Implementation adapted from d3/d3-contour. Thanks!
  function density2D() {
    var x = function x(d) {
        return d[0];
      },
      y = function y(d) {
        return d[1];
      },
      weight = one$1,
      bandwidth = [-1, -1],
      dx = 960,
      dy = 500,
      k = 2; // log2(cellSize)

    function density(data, counts) {
      var rx = radius(bandwidth[0], data, x) >> k,
        // blur x-radius
        ry = radius(bandwidth[1], data, y) >> k,
        // blur y-radius
        ox = rx ? rx + 2 : 0,
        // x-offset padding for blur
        oy = ry ? ry + 2 : 0,
        // y-offset padding for blur
        n = 2 * ox + (dx >> k),
        // grid width
        m = 2 * oy + (dy >> k),
        // grid height
        values0 = new Float32Array(n * m),
        values1 = new Float32Array(n * m);
      var values = values0;
      data.forEach(function (d) {
        var xi = ox + (+x(d) >> k),
          yi = oy + (+y(d) >> k);
        if (xi >= 0 && xi < n && yi >= 0 && yi < m) {
          values0[xi + yi * n] += +weight(d);
        }
      });
      if (rx > 0 && ry > 0) {
        blurX(n, m, values0, values1, rx);
        blurY(n, m, values1, values0, ry);
        blurX(n, m, values0, values1, rx);
        blurY(n, m, values1, values0, ry);
        blurX(n, m, values0, values1, rx);
        blurY(n, m, values1, values0, ry);
      } else if (rx > 0) {
        blurX(n, m, values0, values1, rx);
        blurX(n, m, values1, values0, rx);
        blurX(n, m, values0, values1, rx);
        values = values1;
      } else if (ry > 0) {
        blurY(n, m, values0, values1, ry);
        blurY(n, m, values1, values0, ry);
        blurY(n, m, values0, values1, ry);
        values = values1;
      }

      // scale density estimates
      // density in points per square pixel or probability density
      var s = counts ? Math.pow(2, -2 * k) : 1 / d3Array.sum(values);
      for (var i = 0, sz = n * m; i < sz; ++i) values[i] *= s;
      return {
        values: values,
        scale: 1 << k,
        width: n,
        height: m,
        x1: ox,
        y1: oy,
        x2: ox + (dx >> k),
        y2: oy + (dy >> k)
      };
    }
    density.x = function (_) {
      return arguments.length ? (x = number$2(_), density) : x;
    };
    density.y = function (_) {
      return arguments.length ? (y = number$2(_), density) : y;
    };
    density.weight = function (_) {
      return arguments.length ? (weight = number$2(_), density) : weight;
    };
    density.size = function (_) {
      if (!arguments.length) return [dx, dy];
      var _0 = +_[0],
        _1 = +_[1];
      if (!(_0 >= 0 && _1 >= 0)) error('invalid size');
      return dx = _0, dy = _1, density;
    };
    density.cellSize = function (_) {
      if (!arguments.length) return 1 << k;
      if (!((_ = +_) >= 1)) error('invalid cell size');
      k = Math.floor(Math.log(_) / Math.LN2);
      return density;
    };
    density.bandwidth = function (_) {
      if (!arguments.length) return bandwidth;
      _ = array$2(_);
      if (_.length === 1) _ = [+_[0], +_[0]];
      if (_.length !== 2) error('invalid bandwidth');
      return bandwidth = _, density;
    };
    return density;
  }
  function blurX(n, m, source, target, r) {
    var w = (r << 1) + 1;
    for (var j = 0; j < m; ++j) {
      for (var i = 0, sr = 0; i < n + r; ++i) {
        if (i < n) {
          sr += source[i + j * n];
        }
        if (i >= r) {
          if (i >= w) {
            sr -= source[i - w + j * n];
          }
          target[i - r + j * n] = sr / Math.min(i + 1, n - 1 + w - i, w);
        }
      }
    }
  }
  function blurY(n, m, source, target, r) {
    var w = (r << 1) + 1;
    for (var i = 0; i < n; ++i) {
      for (var j = 0, sr = 0; j < m + r; ++j) {
        if (j < m) {
          sr += source[i + j * n];
        }
        if (j >= r) {
          if (j >= w) {
            sr -= source[i + (j - w) * n];
          }
          target[i + (j - r) * n] = sr / Math.min(j + 1, m - 1 + w - j, w);
        }
      }
    }
  }

  /**
   * Perform 2D kernel-density estimation of point data.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<number>} params.size - The [width, height] extent (in
   *   units of input pixels) over which to perform density estimation.
   * @param {function(object): number} params.x - The x-coordinate accessor.
   * @param {function(object): number} params.y - The y-coordinate accessor.
   * @param {function(object): number} [params.weight] - The weight accessor.
   * @param {Array<function(object): *>} [params.groupby] - An array of accessors
   *   to groupby.
   * @param {number} [params.cellSize] - Contour density calculation cell size.
   *   This parameter determines the level of spatial approximation. For example,
   *   the default value of 4 maps to 2x reductions in both x- and y- dimensions.
   *   A value of 1 will result in an output raster grid whose dimensions exactly
   *   matches the size parameter.
   * @param {Array<number>} [params.bandwidth] - The KDE kernel bandwidths,
   *   in pixels. The input can be a two-element array specifying separate
   *   x and y bandwidths, or a single-element array specifying both. If the
   *   bandwidth is unspecified or less than zero, the bandwidth will be
   *   automatically determined.
   * @param {boolean} [params.counts=false] - A boolean flag indicating if the
   *   output values should be probability estimates (false, default) or
   *   smoothed counts (true).
   * @param {string} [params.as='grid'] - The output field in which to store
   *   the generated raster grid (default 'grid').
   */
  function KDE2D(params) {
    Transform.call(this, null, params);
  }
  KDE2D.Definition = {
    'type': 'KDE2D',
    'metadata': {
      'generates': true
    },
    'params': [{
      'name': 'size',
      'type': 'number',
      'array': true,
      'length': 2,
      'required': true
    }, {
      'name': 'x',
      'type': 'field',
      'required': true
    }, {
      'name': 'y',
      'type': 'field',
      'required': true
    }, {
      'name': 'weight',
      'type': 'field'
    }, {
      'name': 'groupby',
      'type': 'field',
      'array': true
    }, {
      'name': 'cellSize',
      'type': 'number'
    }, {
      'name': 'bandwidth',
      'type': 'number',
      'array': true,
      'length': 2
    }, {
      'name': 'counts',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'as',
      'type': 'string',
      'default': 'grid'
    }]
  };
  var PARAMS = ['x', 'y', 'weight', 'size', 'cellSize', 'bandwidth'];
  function params(obj, _) {
    PARAMS.forEach(function (param) {
      return _[param] != null ? obj[param](_[param]) : 0;
    });
    return obj;
  }
  inherits(KDE2D, Transform, {
    transform: function transform(_, pulse) {
      if (this.value && !pulse.changed() && !_.modified()) return pulse.StopPropagation;
      var out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
        source = pulse.materialize(pulse.SOURCE).source,
        groups = partition$1(source, _.groupby),
        names = (_.groupby || []).map(accessorName),
        kde = params(density2D(), _),
        as = _.as || 'grid',
        values = [];
      function set(t, vals) {
        for (var i = 0; i < names.length; ++i) t[names[i]] = vals[i];
        return t;
      }

      // generate density raster grids
      values = groups.map(function (g) {
        return ingest$1(set(_defineProperty({}, as, kde(g, _.counts)), g.dims));
      });
      if (this.value) out.rem = this.value;
      this.value = out.source = out.add = values;
      return out;
    }
  });
  function partition$1(data, groupby) {
    var groups = [],
      get = function get(f) {
        return f(t);
      },
      map,
      i,
      n,
      t,
      k,
      g;

    // partition data points into groups
    if (groupby == null) {
      groups.push(data);
    } else {
      for (map = {}, i = 0, n = data.length; i < n; ++i) {
        t = data[i];
        k = groupby.map(get);
        g = map[k];
        if (!g) {
          map[k] = g = [];
          g.dims = k;
          groups.push(g);
        }
        g.push(t);
      }
    }
    return groups;
  }

  /**
   * Generate contours based on kernel-density estimation of point data.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<number>} params.size - The dimensions [width, height] over which to compute contours.
   *  If the values parameter is provided, this must be the dimensions of the input data.
   *  If density estimation is performed, this is the output view dimensions in pixels.
   * @param {Array<number>} [params.values] - An array of numeric values representing an
   *  width x height grid of values over which to compute contours. If unspecified, this
   *  transform will instead attempt to compute contours for the kernel density estimate
   *  using values drawn from data tuples in the input pulse.
   * @param {function(object): number} [params.x] - The pixel x-coordinate accessor for density estimation.
   * @param {function(object): number} [params.y] - The pixel y-coordinate accessor for density estimation.
   * @param {function(object): number} [params.weight] - The data point weight accessor for density estimation.
   * @param {number} [params.cellSize] - Contour density calculation cell size.
   * @param {number} [params.bandwidth] - Kernel density estimation bandwidth.
   * @param {Array<number>} [params.thresholds] - Contour threshold array. If
   *   this parameter is set, the count and nice parameters will be ignored.
   * @param {number} [params.count] - The desired number of contours.
   * @param {boolean} [params.nice] - Boolean flag indicating if the contour
   *   threshold values should be automatically aligned to "nice"
   *   human-friendly values. Setting this flag may cause the number of
   *   thresholds to deviate from the specified count.
   * @param {boolean} [params.smooth] - Boolean flag indicating if the contour
   *   polygons should be smoothed using linear interpolation. The default is
   *   true. The parameter is ignored when using density estimation.
   */
  function Contour(params) {
    Transform.call(this, null, params);
  }
  Contour.Definition = {
    'type': 'Contour',
    'metadata': {
      'generates': true
    },
    'params': [{
      'name': 'size',
      'type': 'number',
      'array': true,
      'length': 2,
      'required': true
    }, {
      'name': 'values',
      'type': 'number',
      'array': true
    }, {
      'name': 'x',
      'type': 'field'
    }, {
      'name': 'y',
      'type': 'field'
    }, {
      'name': 'weight',
      'type': 'field'
    }, {
      'name': 'cellSize',
      'type': 'number'
    }, {
      'name': 'bandwidth',
      'type': 'number'
    }, {
      'name': 'count',
      'type': 'number'
    }, {
      'name': 'nice',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'thresholds',
      'type': 'number',
      'array': true
    }, {
      'name': 'smooth',
      'type': 'boolean',
      'default': true
    }]
  };
  inherits(Contour, Transform, {
    transform: function transform(_, pulse) {
      if (this.value && !pulse.changed() && !_.modified()) {
        return pulse.StopPropagation;
      }
      var out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS),
        contour = contours().smooth(_.smooth !== false),
        values = _.values,
        thresh = _.thresholds || quantize(_.count || 10, _.nice, !!values),
        size = _.size,
        grid,
        post;
      if (!values) {
        values = pulse.materialize(pulse.SOURCE).source;
        grid = params(density2D(), _)(values, true);
        post = _transform(grid, grid.scale || 1, grid.scale || 1, 0, 0);
        size = [grid.width, grid.height];
        values = grid.values;
      }
      thresh = isArray(thresh) ? thresh : thresh(values);
      values = contour.size(size)(values, thresh);
      if (post) values.forEach(post);
      if (this.value) out.rem = this.value;
      this.value = out.source = out.add = (values || []).map(ingest$1);
      return out;
    }
  });
  var Feature = 'Feature';
  var FeatureCollection = 'FeatureCollection';
  var MultiPoint = 'MultiPoint';

  /**
   * Consolidate an array of [longitude, latitude] points or GeoJSON features
   * into a combined GeoJSON object. This transform is particularly useful for
   * combining geo data for a Projection's fit argument. The resulting GeoJSON
   * data is available as this transform's value. Input pulses are unchanged.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<function(object): *>} [params.fields] - A two-element array
   *   of field accessors for the longitude and latitude values.
   * @param {function(object): *} params.geojson - A field accessor for
   *   retrieving GeoJSON feature data.
   */
  function GeoJSON(params) {
    Transform.call(this, null, params);
  }
  GeoJSON.Definition = {
    'type': 'GeoJSON',
    'metadata': {},
    'params': [{
      'name': 'fields',
      'type': 'field',
      'array': true,
      'length': 2
    }, {
      'name': 'geojson',
      'type': 'field'
    }]
  };
  inherits(GeoJSON, Transform, {
    transform: function transform(_, pulse) {
      var features = this._features,
        points = this._points,
        fields = _.fields,
        lon = fields && fields[0],
        lat = fields && fields[1],
        geojson = _.geojson || !fields && identity,
        flag = pulse.ADD,
        mod;
      mod = _.modified() || pulse.changed(pulse.REM) || pulse.modified(accessorFields(geojson)) || lon && pulse.modified(accessorFields(lon)) || lat && pulse.modified(accessorFields(lat));
      if (!this.value || mod) {
        flag = pulse.SOURCE;
        this._features = features = [];
        this._points = points = [];
      }
      if (geojson) {
        pulse.visit(flag, function (t) {
          return features.push(geojson(t));
        });
      }
      if (lon && lat) {
        pulse.visit(flag, function (t) {
          var x = lon(t),
            y = lat(t);
          if (x != null && y != null && (x = +x) === x && (y = +y) === y) {
            points.push([x, y]);
          }
        });
        features = features.concat({
          type: Feature,
          geometry: {
            type: MultiPoint,
            coordinates: points
          }
        });
      }
      this.value = {
        type: FeatureCollection,
        features: features
      };
    }
  });

  /**
   * Map GeoJSON data to an SVG path string.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(number, number): *} params.projection - The cartographic
   *   projection to apply.
   * @param {function(object): *} [params.field] - The field with GeoJSON data,
   *   or null if the tuple itself is a GeoJSON feature.
   * @param {string} [params.as='path'] - The output field in which to store
   *   the generated path data (default 'path').
   */
  function GeoPath(params) {
    Transform.call(this, null, params);
  }
  GeoPath.Definition = {
    'type': 'GeoPath',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'projection',
      'type': 'projection'
    }, {
      'name': 'field',
      'type': 'field'
    }, {
      'name': 'pointRadius',
      'type': 'number',
      'expr': true
    }, {
      'name': 'as',
      'type': 'string',
      'default': 'path'
    }]
  };
  inherits(GeoPath, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.ALL),
        path = this.value,
        field = _.field || identity,
        as = _.as || 'path',
        flag = out.SOURCE;
      if (!path || _.modified()) {
        // parameters updated, reset and reflow
        this.value = path = getProjectionPath(_.projection);
        out.materialize().reflow();
      } else {
        flag = field === identity || pulse.modified(field.fields) ? out.ADD_MOD : out.ADD;
      }
      var prev = initPath(path, _.pointRadius);
      out.visit(flag, function (t) {
        return t[as] = path(field(t));
      });
      path.pointRadius(prev);
      return out.modifies(as);
    }
  });
  function initPath(path, pointRadius) {
    var prev = path.pointRadius();
    path.context(null);
    if (pointRadius != null) {
      path.pointRadius(pointRadius);
    }
    return prev;
  }

  /**
   * Geo-code a longitude/latitude point to an x/y coordinate.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(number, number): *} params.projection - The cartographic
   *   projection to apply.
   * @param {Array<function(object): *>} params.fields - A two-element array of
   *   field accessors for the longitude and latitude values.
   * @param {Array<string>} [params.as] - A two-element array of field names
   *   under which to store the result. Defaults to ['x','y'].
   */
  function GeoPoint(params) {
    Transform.call(this, null, params);
  }
  GeoPoint.Definition = {
    'type': 'GeoPoint',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'projection',
      'type': 'projection',
      'required': true
    }, {
      'name': 'fields',
      'type': 'field',
      'array': true,
      'required': true,
      'length': 2
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': 2,
      'default': ['x', 'y']
    }]
  };
  inherits(GeoPoint, Transform, {
    transform: function transform(_, pulse) {
      var proj = _.projection,
        lon = _.fields[0],
        lat = _.fields[1],
        as = _.as || ['x', 'y'],
        x = as[0],
        y = as[1],
        mod;
      function set(t) {
        var xy = proj([lon(t), lat(t)]);
        if (xy) {
          t[x] = xy[0];
          t[y] = xy[1];
        } else {
          t[x] = undefined;
          t[y] = undefined;
        }
      }
      if (_.modified()) {
        // parameters updated, reflow
        pulse = pulse.materialize().reflow(true).visit(pulse.SOURCE, set);
      } else {
        mod = pulse.modified(lon.fields) || pulse.modified(lat.fields);
        pulse.visit(mod ? pulse.ADD_MOD : pulse.ADD, set);
      }
      return pulse.modifies(as);
    }
  });

  /**
   * Annotate items with a geopath shape generator.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(number, number): *} params.projection - The cartographic
   *   projection to apply.
   * @param {function(object): *} [params.field] - The field with GeoJSON data,
   *   or null if the tuple itself is a GeoJSON feature.
   * @param {string} [params.as='shape'] - The output field in which to store
   *   the generated path data (default 'shape').
   */
  function GeoShape(params) {
    Transform.call(this, null, params);
  }
  GeoShape.Definition = {
    'type': 'GeoShape',
    'metadata': {
      'modifies': true,
      'nomod': true
    },
    'params': [{
      'name': 'projection',
      'type': 'projection'
    }, {
      'name': 'field',
      'type': 'field',
      'default': 'datum'
    }, {
      'name': 'pointRadius',
      'type': 'number',
      'expr': true
    }, {
      'name': 'as',
      'type': 'string',
      'default': 'shape'
    }]
  };
  inherits(GeoShape, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.ALL),
        shape = this.value,
        as = _.as || 'shape',
        flag = out.ADD;
      if (!shape || _.modified()) {
        // parameters updated, reset and reflow
        this.value = shape = shapeGenerator(getProjectionPath(_.projection), _.field || field$1('datum'), _.pointRadius);
        out.materialize().reflow();
        flag = out.SOURCE;
      }
      out.visit(flag, function (t) {
        return t[as] = shape;
      });
      return out.modifies(as);
    }
  });
  function shapeGenerator(path, field, pointRadius) {
    var shape = pointRadius == null ? function (_) {
      return path(field(_));
    } : function (_) {
      var prev = path.pointRadius(),
        value = path.pointRadius(pointRadius)(field(_));
      path.pointRadius(prev);
      return value;
    };
    shape.context = function (_) {
      path.context(_);
      return shape;
    };
    return shape;
  }

  /**
   * GeoJSON feature generator for creating graticules.
   * @constructor
   */
  function Graticule(params) {
    Transform.call(this, [], params);
    this.generator = d3Geo.geoGraticule();
  }
  Graticule.Definition = {
    'type': 'Graticule',
    'metadata': {
      'changes': true,
      'generates': true
    },
    'params': [{
      'name': 'extent',
      'type': 'array',
      'array': true,
      'length': 2,
      'content': {
        'type': 'number',
        'array': true,
        'length': 2
      }
    }, {
      'name': 'extentMajor',
      'type': 'array',
      'array': true,
      'length': 2,
      'content': {
        'type': 'number',
        'array': true,
        'length': 2
      }
    }, {
      'name': 'extentMinor',
      'type': 'array',
      'array': true,
      'length': 2,
      'content': {
        'type': 'number',
        'array': true,
        'length': 2
      }
    }, {
      'name': 'step',
      'type': 'number',
      'array': true,
      'length': 2
    }, {
      'name': 'stepMajor',
      'type': 'number',
      'array': true,
      'length': 2,
      'default': [90, 360]
    }, {
      'name': 'stepMinor',
      'type': 'number',
      'array': true,
      'length': 2,
      'default': [10, 10]
    }, {
      'name': 'precision',
      'type': 'number',
      'default': 2.5
    }]
  };
  inherits(Graticule, Transform, {
    transform: function transform(_, pulse) {
      var src = this.value,
        gen = this.generator,
        t;
      if (!src.length || _.modified()) {
        for (var prop in _) {
          if (isFunction(gen[prop])) {
            gen[prop](_[prop]);
          }
        }
      }
      t = gen();
      if (src.length) {
        pulse.mod.push(replace$1(src[0], t));
      } else {
        pulse.add.push(ingest$1(t));
      }
      src[0] = t;
      return pulse;
    }
  });

  /**
   * Render a heatmap image for input raster grid data.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} [params.field] - The field with raster grid
   *   data. If unspecified, the tuple itself is interpreted as a raster grid.
   * @param {string} [params.color] - A constant color value or function for
   *   individual pixel color. If a function, it will be invoked with an input
   *   object that includes $x, $y, $value, and $max fields for the grid.
   * @param {number} [params.opacity] - A constant opacity value or function for
   *   individual pixel opacity. If a function, it will be invoked with an input
   *   object that includes $x, $y, $value, and $max fields for the grid.
   * @param {string} [params.resolve] - The method for resolving maximum values
   *   across multiple input grids. If 'independent' (the default), maximum
   *   calculation will be performed separately for each grid. If 'shared',
   *   a single global maximum will be used for all input grids.
   * @param {string} [params.as='image'] - The output field in which to store
   *   the generated bitmap canvas images (default 'image').
   */
  function Heatmap(params) {
    Transform.call(this, null, params);
  }
  Heatmap.Definition = {
    'type': 'heatmap',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'field',
      'type': 'field'
    }, {
      'name': 'color',
      'type': 'string',
      'expr': true
    }, {
      'name': 'opacity',
      'type': 'number',
      'expr': true
    }, {
      'name': 'resolve',
      'type': 'enum',
      'values': ['shared', 'independent'],
      'default': 'independent'
    }, {
      'name': 'as',
      'type': 'string',
      'default': 'image'
    }]
  };
  inherits(Heatmap, Transform, {
    transform: function transform(_, pulse) {
      if (!pulse.changed() && !_.modified()) {
        return pulse.StopPropagation;
      }
      var source = pulse.materialize(pulse.SOURCE).source,
        shared = _.resolve === 'shared',
        field = _.field || identity,
        opacity = opacity_(_.opacity, _),
        color = color_(_.color, _),
        as = _.as || 'image',
        obj = {
          $x: 0,
          $y: 0,
          $value: 0,
          $max: shared ? d3Array.max(source.map(function (t) {
            return d3Array.max(field(t).values);
          })) : 0
        };
      source.forEach(function (t) {
        var v = field(t);

        // build proxy data object
        var o = extend({}, t, obj);
        // set maximum value if not globally shared
        if (!shared) o.$max = d3Array.max(v.values || []);

        // generate canvas image
        // optimize color/opacity if not pixel-dependent
        t[as] = toCanvas(v, o, color.dep ? color : constant$1(color(o)), opacity.dep ? opacity : constant$1(opacity(o)));
      });
      return pulse.reflow(true).modifies(as);
    }
  });

  // get image color function
  function color_(color, _) {
    var f;
    if (isFunction(color)) {
      f = function f(obj) {
        return d3Color.rgb(color(obj, _));
      };
      f.dep = dependency(color);
    } else {
      // default to mid-grey
      f = constant$1(d3Color.rgb(color || '#888'));
    }
    return f;
  }

  // get image opacity function
  function opacity_(opacity, _) {
    var f;
    if (isFunction(opacity)) {
      f = function f(obj) {
        return opacity(obj, _);
      };
      f.dep = dependency(opacity);
    } else if (opacity) {
      f = constant$1(opacity);
    } else {
      // default to [0, max] opacity gradient
      f = function f(obj) {
        return obj.$value / obj.$max || 0;
      };
      f.dep = true;
    }
    return f;
  }

  // check if function depends on individual pixel data
  function dependency(f) {
    if (!isFunction(f)) return false;
    var set = toSet(accessorFields(f));
    return set.$x || set.$y || set.$value || set.$max;
  }

  // render raster grid to canvas
  function toCanvas(grid, obj, color, opacity) {
    var n = grid.width,
      m = grid.height,
      x1 = grid.x1 || 0,
      y1 = grid.y1 || 0,
      x2 = grid.x2 || n,
      y2 = grid.y2 || m,
      val = grid.values,
      value = val ? function (i) {
        return val[i];
      } : zero$1,
      can = domCanvas(x2 - x1, y2 - y1),
      ctx = can.getContext('2d'),
      img = ctx.getImageData(0, 0, x2 - x1, y2 - y1),
      pix = img.data;
    for (var j = y1, k = 0; j < y2; ++j) {
      obj.$y = j - y1;
      for (var i = x1, r = j * n; i < x2; ++i, k += 4) {
        obj.$x = i - x1;
        obj.$value = value(i + r);
        var v = color(obj);
        pix[k + 0] = v.r;
        pix[k + 1] = v.g;
        pix[k + 2] = v.b;
        pix[k + 3] = ~~(255 * opacity(obj));
      }
    }
    ctx.putImageData(img, 0, 0);
    return can;
  }

  /**
   * Maintains a cartographic projection.
   * @constructor
   * @param {object} params - The parameters for this operator.
   */
  function Projection$1(params) {
    Transform.call(this, null, params);
    this.modified(true); // always treat as modified
  }

  inherits(Projection$1, Transform, {
    transform: function transform(_, pulse) {
      var proj = this.value;
      if (!proj || _.modified('type')) {
        this.value = proj = create(_.type);
        projectionProperties.forEach(function (prop) {
          if (_[prop] != null) set(proj, prop, _[prop]);
        });
      } else {
        projectionProperties.forEach(function (prop) {
          if (_.modified(prop)) set(proj, prop, _[prop]);
        });
      }
      if (_.pointRadius != null) proj.path.pointRadius(_.pointRadius);
      if (_.fit) fit(proj, _);
      return pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS);
    }
  });
  function fit(proj, _) {
    var data = collectGeoJSON(_.fit);
    _.extent ? proj.fitExtent(_.extent, data) : _.size ? proj.fitSize(_.size, data) : 0;
  }
  function create(type) {
    var constructor = projection((type || 'mercator').toLowerCase());
    if (!constructor) error('Unrecognized projection type: ' + type);
    return constructor();
  }
  function set(proj, key, value) {
    if (isFunction(proj[key])) proj[key](value);
  }
  function collectGeoJSON(data) {
    data = array$2(data);
    return data.length === 1 ? data[0] : {
      type: FeatureCollection,
      features: data.reduce(function (a, f) {
        return a.concat(featurize(f));
      }, [])
    };
  }
  function featurize(f) {
    return f.type === FeatureCollection ? f.features : array$2(f).filter(function (d) {
      return d != null;
    }).map(function (d) {
      return d.type === Feature ? d : {
        type: Feature,
        geometry: d
      };
    });
  }

  var geo = /*#__PURE__*/Object.freeze({
    __proto__: null,
    contour: Contour,
    geojson: GeoJSON,
    geopath: GeoPath,
    geopoint: GeoPoint,
    geoshape: GeoShape,
    graticule: Graticule,
    heatmap: Heatmap,
    isocontour: Isocontour,
    kde2d: KDE2D,
    projection: Projection$1
  });

  var ForceMap = {
    center: d3Force.forceCenter,
    collide: d3Force.forceCollide,
    nbody: d3Force.forceManyBody,
    link: d3Force.forceLink,
    x: d3Force.forceX,
    y: d3Force.forceY
  };
  var Forces = 'forces',
    ForceParams = ['alpha', 'alphaMin', 'alphaTarget', 'velocityDecay', 'forces'],
    ForceConfig = ['static', 'iterations'],
    ForceOutput = ['x', 'y', 'vx', 'vy'];

  /**
   * Force simulation layout.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<object>} params.forces - The forces to apply.
   */
  function Force(params) {
    Transform.call(this, null, params);
  }
  Force.Definition = {
    'type': 'Force',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'static',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'restart',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'iterations',
      'type': 'number',
      'default': 300
    }, {
      'name': 'alpha',
      'type': 'number',
      'default': 1
    }, {
      'name': 'alphaMin',
      'type': 'number',
      'default': 0.001
    }, {
      'name': 'alphaTarget',
      'type': 'number',
      'default': 0
    }, {
      'name': 'velocityDecay',
      'type': 'number',
      'default': 0.4
    }, {
      'name': 'forces',
      'type': 'param',
      'array': true,
      'params': [{
        'key': {
          'force': 'center'
        },
        'params': [{
          'name': 'x',
          'type': 'number',
          'default': 0
        }, {
          'name': 'y',
          'type': 'number',
          'default': 0
        }]
      }, {
        'key': {
          'force': 'collide'
        },
        'params': [{
          'name': 'radius',
          'type': 'number',
          'expr': true
        }, {
          'name': 'strength',
          'type': 'number',
          'default': 0.7
        }, {
          'name': 'iterations',
          'type': 'number',
          'default': 1
        }]
      }, {
        'key': {
          'force': 'nbody'
        },
        'params': [{
          'name': 'strength',
          'type': 'number',
          'default': -30,
          'expr': true
        }, {
          'name': 'theta',
          'type': 'number',
          'default': 0.9
        }, {
          'name': 'distanceMin',
          'type': 'number',
          'default': 1
        }, {
          'name': 'distanceMax',
          'type': 'number'
        }]
      }, {
        'key': {
          'force': 'link'
        },
        'params': [{
          'name': 'links',
          'type': 'data'
        }, {
          'name': 'id',
          'type': 'field'
        }, {
          'name': 'distance',
          'type': 'number',
          'default': 30,
          'expr': true
        }, {
          'name': 'strength',
          'type': 'number',
          'expr': true
        }, {
          'name': 'iterations',
          'type': 'number',
          'default': 1
        }]
      }, {
        'key': {
          'force': 'x'
        },
        'params': [{
          'name': 'strength',
          'type': 'number',
          'default': 0.1
        }, {
          'name': 'x',
          'type': 'field'
        }]
      }, {
        'key': {
          'force': 'y'
        },
        'params': [{
          'name': 'strength',
          'type': 'number',
          'default': 0.1
        }, {
          'name': 'y',
          'type': 'field'
        }]
      }]
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'modify': false,
      'default': ForceOutput
    }]
  };
  inherits(Force, Transform, {
    transform: function transform(_, pulse) {
      var sim = this.value,
        change = pulse.changed(pulse.ADD_REM),
        params = _.modified(ForceParams),
        iters = _.iterations || 300;

      // configure simulation
      if (!sim) {
        this.value = sim = simulation(pulse.source, _);
        sim.on('tick', rerun(pulse.dataflow, this));
        if (!_.static) {
          change = true;
          sim.tick(); // ensure we run on init
        }

        pulse.modifies('index');
      } else {
        if (change) {
          pulse.modifies('index');
          sim.nodes(pulse.source);
        }
        if (params || pulse.changed(pulse.MOD)) {
          setup(sim, _, 0, pulse);
        }
      }

      // run simulation
      if (params || change || _.modified(ForceConfig) || pulse.changed() && _.restart) {
        sim.alpha(Math.max(sim.alpha(), _.alpha || 1)).alphaDecay(1 - Math.pow(sim.alphaMin(), 1 / iters));
        if (_.static) {
          for (sim.stop(); --iters >= 0;) sim.tick();
        } else {
          if (sim.stopped()) sim.restart();
          if (!change) return pulse.StopPropagation; // defer to sim ticks
        }
      }

      return this.finish(_, pulse);
    },
    finish: function finish(_, pulse) {
      var dataflow = pulse.dataflow;

      // inspect dependencies, touch link source data
      for (var args = this._argops, j = 0, m = args.length, arg; j < m; ++j) {
        arg = args[j];
        if (arg.name !== Forces || arg.op._argval.force !== 'link') {
          continue;
        }
        for (var ops = arg.op._argops, i = 0, n = ops.length, op; i < n; ++i) {
          if (ops[i].name === 'links' && (op = ops[i].op.source)) {
            dataflow.pulse(op, dataflow.changeset().reflow());
            break;
          }
        }
      }

      // reflow all nodes
      return pulse.reflow(_.modified()).modifies(ForceOutput);
    }
  });
  function rerun(df, op) {
    return function () {
      return df.touch(op).run();
    };
  }
  function simulation(nodes, _) {
    var sim = d3Force.forceSimulation(nodes),
      stop = sim.stop,
      restart = sim.restart;
    var stopped = false;
    sim.stopped = function () {
      return stopped;
    };
    sim.restart = function () {
      return stopped = false, restart();
    };
    sim.stop = function () {
      return stopped = true, stop();
    };
    return setup(sim, _, true).on('end', function () {
      return stopped = true;
    });
  }
  function setup(sim, _, init, pulse) {
    var f = array$2(_.forces),
      i,
      n,
      p,
      name;
    for (i = 0, n = ForceParams.length; i < n; ++i) {
      p = ForceParams[i];
      if (p !== Forces && _.modified(p)) sim[p](_[p]);
    }
    for (i = 0, n = f.length; i < n; ++i) {
      name = Forces + i;
      p = init || _.modified(Forces, i) ? getForce(f[i]) : pulse && modified(f[i], pulse) ? sim.force(name) : null;
      if (p) sim.force(name, p);
    }
    for (n = sim.numForces || 0; i < n; ++i) {
      sim.force(Forces + i, null); // remove
    }

    sim.numForces = f.length;
    return sim;
  }
  function modified(f, pulse) {
    var k, v;
    for (k in f) {
      if (isFunction(v = f[k]) && pulse.modified(accessorFields(v))) return 1;
    }
    return 0;
  }
  function getForce(_) {
    var f, p;
    if (!_has(ForceMap, _.force)) {
      error('Unrecognized force: ' + _.force);
    }
    f = ForceMap[_.force]();
    for (p in _) {
      if (isFunction(f[p])) setForceParam(f[p], _[p], _);
    }
    return f;
  }
  function setForceParam(f, v, _) {
    f(isFunction(v) ? function (d) {
      return v(d, _);
    } : v);
  }

  var force = /*#__PURE__*/Object.freeze({
    __proto__: null,
    force: Force
  });

  // Build lookup table mapping tuple keys to tree node instances
  function lookup$2(tree, key, filter) {
    var map = {};
    tree.each(function (node) {
      var t = node.data;
      if (filter(t)) map[key(t)] = node;
    });
    tree.lookup = map;
    return tree;
  }

  /**
   * Nest tuples into a tree structure, grouped by key values.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<function(object): *>} params.keys - The key fields to nest by, in order.
   * @param {boolean} [params.generate=false] - A boolean flag indicating if
   *   non-leaf nodes generated by this transform should be included in the
   *   output. The default (false) includes only the input data (leaf nodes)
   *   in the data stream.
   */
  function Nest(params) {
    Transform.call(this, null, params);
  }
  Nest.Definition = {
    'type': 'Nest',
    'metadata': {
      'treesource': true,
      'changes': true
    },
    'params': [{
      'name': 'keys',
      'type': 'field',
      'array': true
    }, {
      'name': 'generate',
      'type': 'boolean'
    }]
  };
  var children$1 = function children(n) {
    return n.values;
  };
  inherits(Nest, Transform, {
    transform: function transform(_, pulse) {
      if (!pulse.source) {
        error('Nest transform requires an upstream data source.');
      }
      var gen = _.generate,
        mod = _.modified(),
        out = pulse.clone(),
        tree = this.value;
      if (!tree || mod || pulse.changed()) {
        // collect nodes to remove
        if (tree) {
          tree.each(function (node) {
            if (node.children && isTuple(node.data)) {
              out.rem.push(node.data);
            }
          });
        }

        // generate new tree structure
        this.value = tree = d3Hierarchy.hierarchy({
          values: array$2(_.keys).reduce(function (n, k) {
            n.key(k);
            return n;
          }, nest()).entries(out.source)
        }, children$1);

        // collect nodes to add
        if (gen) {
          tree.each(function (node) {
            if (node.children) {
              node = ingest$1(node.data);
              out.add.push(node);
              out.source.push(node);
            }
          });
        }

        // build lookup table
        lookup$2(tree, tupleid, tupleid);
      }
      out.source.root = tree;
      return out;
    }
  });
  function nest() {
    var keys = [],
      nest = {
        entries: function entries(array) {
          return _entries(apply(array, 0), 0);
        },
        key: function key(d) {
          return keys.push(d), nest;
        }
      };
    function apply(array, depth) {
      if (depth >= keys.length) {
        return array;
      }
      var n = array.length,
        key = keys[depth++],
        valuesByKey = {},
        result = {};
      var i = -1,
        keyValue,
        value,
        values;
      while (++i < n) {
        keyValue = key(value = array[i]) + '';
        if (values = valuesByKey[keyValue]) {
          values.push(value);
        } else {
          valuesByKey[keyValue] = [value];
        }
      }
      for (keyValue in valuesByKey) {
        result[keyValue] = apply(valuesByKey[keyValue], depth);
      }
      return result;
    }
    function _entries(map, depth) {
      if (++depth > keys.length) return map;
      var array = [];
      for (var key in map) {
        array.push({
          key: key,
          values: _entries(map[key], depth)
        });
      }
      return array;
    }
    return nest;
  }

  /**
   * Abstract class for tree layout.
   * @constructor
   * @param {object} params - The parameters for this operator.
   */
  function HierarchyLayout(params) {
    Transform.call(this, null, params);
  }
  var defaultSeparation = function defaultSeparation(a, b) {
    return a.parent === b.parent ? 1 : 2;
  };
  inherits(HierarchyLayout, Transform, {
    transform: function transform(_, pulse) {
      if (!pulse.source || !pulse.source.root) {
        error(this.constructor.name + ' transform requires a backing tree data source.');
      }
      var layout = this.layout(_.method),
        fields = this.fields,
        root = pulse.source.root,
        as = _.as || fields;
      if (_.field) root.sum(_.field);else root.count();
      if (_.sort) root.sort(stableCompare(_.sort, function (d) {
        return d.data;
      }));
      setParams(layout, this.params, _);
      if (layout.separation) {
        layout.separation(_.separation !== false ? defaultSeparation : one$1);
      }
      try {
        this.value = layout(root);
      } catch (err) {
        error(err);
      }
      root.each(function (node) {
        return setFields(node, fields, as);
      });
      return pulse.reflow(_.modified()).modifies(as).modifies('leaf');
    }
  });
  function setParams(layout, params, _) {
    for (var p, i = 0, n = params.length; i < n; ++i) {
      p = params[i];
      if (p in _) layout[p](_[p]);
    }
  }
  function setFields(node, fields, as) {
    var t = node.data,
      n = fields.length - 1;
    for (var i = 0; i < n; ++i) {
      t[as[i]] = node[fields[i]];
    }
    t[as[n]] = node.children ? node.children.length : 0;
  }
  var Output$3 = ['x', 'y', 'r', 'depth', 'children'];

  /**
   * Packed circle tree layout.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - The value field to size nodes.
   */
  function Pack(params) {
    HierarchyLayout.call(this, params);
  }
  Pack.Definition = {
    'type': 'Pack',
    'metadata': {
      'tree': true,
      'modifies': true
    },
    'params': [{
      'name': 'field',
      'type': 'field'
    }, {
      'name': 'sort',
      'type': 'compare'
    }, {
      'name': 'padding',
      'type': 'number',
      'default': 0
    }, {
      'name': 'radius',
      'type': 'field',
      'default': null
    }, {
      'name': 'size',
      'type': 'number',
      'array': true,
      'length': 2
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': Output$3.length,
      'default': Output$3
    }]
  };
  inherits(Pack, HierarchyLayout, {
    layout: d3Hierarchy.pack,
    params: ['radius', 'size', 'padding'],
    fields: Output$3
  });
  var Output$2 = ['x0', 'y0', 'x1', 'y1', 'depth', 'children'];

  /**
   * Partition tree layout.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - The value field to size nodes.
   */
  function Partition(params) {
    HierarchyLayout.call(this, params);
  }
  Partition.Definition = {
    'type': 'Partition',
    'metadata': {
      'tree': true,
      'modifies': true
    },
    'params': [{
      'name': 'field',
      'type': 'field'
    }, {
      'name': 'sort',
      'type': 'compare'
    }, {
      'name': 'padding',
      'type': 'number',
      'default': 0
    }, {
      'name': 'round',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'size',
      'type': 'number',
      'array': true,
      'length': 2
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': Output$2.length,
      'default': Output$2
    }]
  };
  inherits(Partition, HierarchyLayout, {
    layout: d3Hierarchy.partition,
    params: ['size', 'round', 'padding'],
    fields: Output$2
  });

  /**
   * Stratify a collection of tuples into a tree structure based on
   * id and parent id fields.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.key - Unique key field for each tuple.
   * @param {function(object): *} params.parentKey - Field with key for parent tuple.
   */
  function Stratify(params) {
    Transform.call(this, null, params);
  }
  Stratify.Definition = {
    'type': 'Stratify',
    'metadata': {
      'treesource': true
    },
    'params': [{
      'name': 'key',
      'type': 'field',
      'required': true
    }, {
      'name': 'parentKey',
      'type': 'field',
      'required': true
    }]
  };
  inherits(Stratify, Transform, {
    transform: function transform(_, pulse) {
      if (!pulse.source) {
        error('Stratify transform requires an upstream data source.');
      }
      var tree = this.value;
      var mod = _.modified(),
        out = pulse.fork(pulse.ALL).materialize(pulse.SOURCE),
        run = !tree || mod || pulse.changed(pulse.ADD_REM) || pulse.modified(_.key.fields) || pulse.modified(_.parentKey.fields);

      // prevent upstream source pollution
      out.source = out.source.slice();
      if (run) {
        tree = out.source.length ? lookup$2(d3Hierarchy.stratify().id(_.key).parentId(_.parentKey)(out.source), _.key, truthy) : lookup$2(d3Hierarchy.stratify()([{}]), _.key, _.key);
      }
      out.source.root = this.value = tree;
      return out;
    }
  });
  var Layouts = {
    tidy: d3Hierarchy.tree,
    cluster: d3Hierarchy.cluster
  };
  var Output$1$1 = ['x', 'y', 'depth', 'children'];

  /**
   * Tree layout. Depending on the method parameter, performs either
   * Reingold-Tilford 'tidy' layout or dendrogram 'cluster' layout.
   * @constructor
   * @param {object} params - The parameters for this operator.
   */
  function Tree(params) {
    HierarchyLayout.call(this, params);
  }
  Tree.Definition = {
    'type': 'Tree',
    'metadata': {
      'tree': true,
      'modifies': true
    },
    'params': [{
      'name': 'field',
      'type': 'field'
    }, {
      'name': 'sort',
      'type': 'compare'
    }, {
      'name': 'method',
      'type': 'enum',
      'default': 'tidy',
      'values': ['tidy', 'cluster']
    }, {
      'name': 'size',
      'type': 'number',
      'array': true,
      'length': 2
    }, {
      'name': 'nodeSize',
      'type': 'number',
      'array': true,
      'length': 2
    }, {
      'name': 'separation',
      'type': 'boolean',
      'default': true
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': Output$1$1.length,
      'default': Output$1$1
    }]
  };
  inherits(Tree, HierarchyLayout, {
    /**
     * Tree layout generator. Supports both 'tidy' and 'cluster' layouts.
     */
    layout: function layout(method) {
      var m = method || 'tidy';
      if (_has(Layouts, m)) return Layouts[m]();else error('Unrecognized Tree layout method: ' + m);
    },
    params: ['size', 'nodeSize'],
    fields: Output$1$1
  });

  /**
   * Generate tuples representing links between tree nodes.
   * The resulting tuples will contain 'source' and 'target' fields,
   * which point to parent and child node tuples, respectively.
   * @constructor
   * @param {object} params - The parameters for this operator.
   */
  function TreeLinks(params) {
    Transform.call(this, [], params);
  }
  TreeLinks.Definition = {
    'type': 'TreeLinks',
    'metadata': {
      'tree': true,
      'generates': true,
      'changes': true
    },
    'params': []
  };
  inherits(TreeLinks, Transform, {
    transform: function transform(_, pulse) {
      var links = this.value,
        tree = pulse.source && pulse.source.root,
        out = pulse.fork(pulse.NO_SOURCE),
        lut = {};
      if (!tree) error('TreeLinks transform requires a tree data source.');
      if (pulse.changed(pulse.ADD_REM)) {
        // remove previous links
        out.rem = links;

        // build lookup table of valid tuples
        pulse.visit(pulse.SOURCE, function (t) {
          return lut[tupleid(t)] = 1;
        });

        // generate links for all edges incident on valid tuples
        tree.each(function (node) {
          var t = node.data,
            p = node.parent && node.parent.data;
          if (p && lut[tupleid(t)] && lut[tupleid(p)]) {
            out.add.push(ingest$1({
              source: p,
              target: t
            }));
          }
        });
        this.value = out.add;
      } else if (pulse.changed(pulse.MOD)) {
        // build lookup table of modified tuples
        pulse.visit(pulse.MOD, function (t) {
          return lut[tupleid(t)] = 1;
        });

        // gather links incident on modified tuples
        links.forEach(function (link) {
          if (lut[tupleid(link.source)] || lut[tupleid(link.target)]) {
            out.mod.push(link);
          }
        });
      }
      return out;
    }
  });
  var Tiles = {
    binary: d3Hierarchy.treemapBinary,
    dice: d3Hierarchy.treemapDice,
    slice: d3Hierarchy.treemapSlice,
    slicedice: d3Hierarchy.treemapSliceDice,
    squarify: d3Hierarchy.treemapSquarify,
    resquarify: d3Hierarchy.treemapResquarify
  };
  var Output$4 = ['x0', 'y0', 'x1', 'y1', 'depth', 'children'];

  /**
   * Treemap layout.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.field - The value field to size nodes.
   */
  function Treemap(params) {
    HierarchyLayout.call(this, params);
  }
  Treemap.Definition = {
    'type': 'Treemap',
    'metadata': {
      'tree': true,
      'modifies': true
    },
    'params': [{
      'name': 'field',
      'type': 'field'
    }, {
      'name': 'sort',
      'type': 'compare'
    }, {
      'name': 'method',
      'type': 'enum',
      'default': 'squarify',
      'values': ['squarify', 'resquarify', 'binary', 'dice', 'slice', 'slicedice']
    }, {
      'name': 'padding',
      'type': 'number',
      'default': 0
    }, {
      'name': 'paddingInner',
      'type': 'number',
      'default': 0
    }, {
      'name': 'paddingOuter',
      'type': 'number',
      'default': 0
    }, {
      'name': 'paddingTop',
      'type': 'number',
      'default': 0
    }, {
      'name': 'paddingRight',
      'type': 'number',
      'default': 0
    }, {
      'name': 'paddingBottom',
      'type': 'number',
      'default': 0
    }, {
      'name': 'paddingLeft',
      'type': 'number',
      'default': 0
    }, {
      'name': 'ratio',
      'type': 'number',
      'default': 1.618033988749895
    }, {
      'name': 'round',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'size',
      'type': 'number',
      'array': true,
      'length': 2
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': Output$4.length,
      'default': Output$4
    }]
  };
  inherits(Treemap, HierarchyLayout, {
    /**
     * Treemap layout generator. Adds 'method' and 'ratio' parameters
     * to configure the underlying tile method.
     */
    layout: function layout() {
      var x = d3Hierarchy.treemap();
      x.ratio = function (_) {
        var t = x.tile();
        if (t.ratio) x.tile(t.ratio(_));
      };
      x.method = function (_) {
        if (_has(Tiles, _)) x.tile(Tiles[_]);else error('Unrecognized Treemap layout method: ' + _);
      };
      return x;
    },
    params: ['method', 'ratio', 'size', 'round', 'padding', 'paddingInner', 'paddingOuter', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
    fields: Output$4
  });

  var tree = /*#__PURE__*/Object.freeze({
    __proto__: null,
    nest: Nest,
    pack: Pack,
    partition: Partition,
    stratify: Stratify,
    tree: Tree,
    treelinks: TreeLinks,
    treemap: Treemap
  });

  // bit mask for getting first 2 bytes of alpha value
  var ALPHA_MASK = 0xff000000;
  function baseBitmaps($, data) {
    var bitmap = $.bitmap();
    // when there is no base mark but data points are to be avoided
    (data || []).forEach(function (d) {
      return bitmap.set($(d.boundary[0]), $(d.boundary[3]));
    });
    return [bitmap, undefined];
  }
  function markBitmaps($, baseMark, avoidMarks, labelInside, isGroupArea) {
    // create canvas
    var width = $.width,
      height = $.height,
      border = labelInside || isGroupArea,
      context = domCanvas(width, height).getContext('2d'),
      baseMarkContext = domCanvas(width, height).getContext('2d'),
      strokeContext = border && domCanvas(width, height).getContext('2d');

    // render all marks to be avoided into canvas
    avoidMarks.forEach(function (items) {
      return draw(context, items, false);
    });
    draw(baseMarkContext, baseMark, false);
    if (border) {
      draw(strokeContext, baseMark, true);
    }

    // get canvas buffer, create bitmaps
    var buffer = getBuffer(context, width, height),
      baseMarkBuffer = getBuffer(baseMarkContext, width, height),
      strokeBuffer = border && getBuffer(strokeContext, width, height),
      layer1 = $.bitmap(),
      layer2 = border && $.bitmap();

    // populate bitmap layers
    var x, y, u, v, index, alpha, strokeAlpha, baseMarkAlpha;
    for (y = 0; y < height; ++y) {
      for (x = 0; x < width; ++x) {
        index = y * width + x;
        alpha = buffer[index] & ALPHA_MASK;
        baseMarkAlpha = baseMarkBuffer[index] & ALPHA_MASK;
        strokeAlpha = border && strokeBuffer[index] & ALPHA_MASK;
        if (alpha || strokeAlpha || baseMarkAlpha) {
          u = $(x);
          v = $(y);
          if (!isGroupArea && (alpha || baseMarkAlpha)) layer1.set(u, v); // update interior bitmap
          if (border && (alpha || strokeAlpha)) layer2.set(u, v); // update border bitmap
        }
      }
    }

    return [layer1, layer2];
  }
  function getBuffer(context, width, height) {
    return new Uint32Array(context.getImageData(0, 0, width, height).data.buffer);
  }
  function draw(context, items, interior) {
    if (!items.length) return;
    var type = items[0].mark.marktype;
    if (type === 'group') {
      items.forEach(function (group) {
        group.items.forEach(function (mark) {
          return draw(context, mark.items, interior);
        });
      });
    } else {
      Marks[type].draw(context, {
        items: interior ? items.map(prepare) : items
      });
    }
  }

  /**
   * Prepare item before drawing into canvas (setting stroke and opacity)
   * @param {object} source item to be prepared
   * @returns prepared item
   */
  function prepare(source) {
    var item = rederive(source, {});
    if (item.stroke && item.strokeOpacity !== 0 || item.fill && item.fillOpacity !== 0) {
      return _objectSpread2(_objectSpread2({}, item), {}, {
        strokeOpacity: 1,
        stroke: '#000',
        fillOpacity: 0
      });
    }
    return item;
  }
  var DIV = 5,
    // bit shift from x, y index to bit vector array index
    MOD = 31,
    // bit mask for index lookup within a bit vector
    SIZE = 32,
    // individual bit vector size
    RIGHT0 = new Uint32Array(SIZE + 1),
    // left-anchored bit vectors, full -> 0
    RIGHT1 = new Uint32Array(SIZE + 1); // right-anchored bit vectors, 0 -> full

  RIGHT1[0] = 0;
  RIGHT0[0] = ~RIGHT1[0];
  for (var i = 1; i <= SIZE; ++i) {
    RIGHT1[i] = RIGHT1[i - 1] << 1 | 1;
    RIGHT0[i] = ~RIGHT1[i];
  }
  function Bitmap(w, h) {
    var array = new Uint32Array(~~((w * h + SIZE) / SIZE));
    function _set(index, mask) {
      array[index] |= mask;
    }
    function _clear(index, mask) {
      array[index] &= mask;
    }
    return {
      array: array,
      get: function get(x, y) {
        var index = y * w + x;
        return array[index >>> DIV] & 1 << (index & MOD);
      },
      set: function set(x, y) {
        var index = y * w + x;
        _set(index >>> DIV, 1 << (index & MOD));
      },
      clear: function clear(x, y) {
        var index = y * w + x;
        _clear(index >>> DIV, ~(1 << (index & MOD)));
      },
      getRange: function getRange(x, y, x2, y2) {
        var r = y2,
          start,
          end,
          indexStart,
          indexEnd;
        for (; r >= y; --r) {
          start = r * w + x;
          end = r * w + x2;
          indexStart = start >>> DIV;
          indexEnd = end >>> DIV;
          if (indexStart === indexEnd) {
            if (array[indexStart] & RIGHT0[start & MOD] & RIGHT1[(end & MOD) + 1]) {
              return true;
            }
          } else {
            if (array[indexStart] & RIGHT0[start & MOD]) return true;
            if (array[indexEnd] & RIGHT1[(end & MOD) + 1]) return true;
            for (var _i = indexStart + 1; _i < indexEnd; ++_i) {
              if (array[_i]) return true;
            }
          }
        }
        return false;
      },
      setRange: function setRange(x, y, x2, y2) {
        var start, end, indexStart, indexEnd, i;
        for (; y <= y2; ++y) {
          start = y * w + x;
          end = y * w + x2;
          indexStart = start >>> DIV;
          indexEnd = end >>> DIV;
          if (indexStart === indexEnd) {
            _set(indexStart, RIGHT0[start & MOD] & RIGHT1[(end & MOD) + 1]);
          } else {
            _set(indexStart, RIGHT0[start & MOD]);
            _set(indexEnd, RIGHT1[(end & MOD) + 1]);
            for (i = indexStart + 1; i < indexEnd; ++i) _set(i, 0xffffffff);
          }
        }
      },
      clearRange: function clearRange(x, y, x2, y2) {
        var start, end, indexStart, indexEnd, i;
        for (; y <= y2; ++y) {
          start = y * w + x;
          end = y * w + x2;
          indexStart = start >>> DIV;
          indexEnd = end >>> DIV;
          if (indexStart === indexEnd) {
            _clear(indexStart, RIGHT1[start & MOD] | RIGHT0[(end & MOD) + 1]);
          } else {
            _clear(indexStart, RIGHT1[start & MOD]);
            _clear(indexEnd, RIGHT0[(end & MOD) + 1]);
            for (i = indexStart + 1; i < indexEnd; ++i) _clear(i, 0);
          }
        }
      },
      outOfBounds: function outOfBounds(x, y, x2, y2) {
        return x < 0 || y < 0 || y2 >= h || x2 >= w;
      }
    };
  }
  function scaler(width, height, padding) {
    var ratio = Math.max(1, Math.sqrt(width * height / 1e6)),
      w = ~~((width + 2 * padding + ratio) / ratio),
      h = ~~((height + 2 * padding + ratio) / ratio),
      scale = function scale(_) {
        return ~~((_ + padding) / ratio);
      };
    scale.invert = function (_) {
      return _ * ratio - padding;
    };
    scale.bitmap = function () {
      return Bitmap(w, h);
    };
    scale.ratio = ratio;
    scale.padding = padding;
    scale.width = width;
    scale.height = height;
    return scale;
  }
  function placeAreaLabelNaive($, bitmaps, avoidBaseMark, markIndex) {
    var width = $.width,
      height = $.height;

    // try to place a label within an input area mark
    return function (d) {
      var items = d.datum.datum.items[markIndex].items,
        // area points
        n = items.length,
        // number of points
        textHeight = d.datum.fontSize,
        // label width
        textWidth = textMetrics.width(d.datum, d.datum.text); // label height

      var maxAreaWidth = 0,
        x1,
        x2,
        y1,
        y2,
        x,
        y,
        areaWidth;

      // for each area sample point
      for (var _i2 = 0; _i2 < n; ++_i2) {
        x1 = items[_i2].x;
        y1 = items[_i2].y;
        x2 = items[_i2].x2 === undefined ? x1 : items[_i2].x2;
        y2 = items[_i2].y2 === undefined ? y1 : items[_i2].y2;
        x = (x1 + x2) / 2;
        y = (y1 + y2) / 2;
        areaWidth = Math.abs(x2 - x1 + y2 - y1);
        if (areaWidth >= maxAreaWidth) {
          maxAreaWidth = areaWidth;
          d.x = x;
          d.y = y;
        }
      }
      x = textWidth / 2;
      y = textHeight / 2;
      x1 = d.x - x;
      x2 = d.x + x;
      y1 = d.y - y;
      y2 = d.y + y;
      d.align = 'center';
      if (x1 < 0 && x2 <= width) {
        d.align = 'left';
      } else if (0 <= x1 && width < x2) {
        d.align = 'right';
      }
      d.baseline = 'middle';
      if (y1 < 0 && y2 <= height) {
        d.baseline = 'top';
      } else if (0 <= y1 && height < y2) {
        d.baseline = 'bottom';
      }
      return true;
    };
  }
  function outOfBounds(x, y, textWidth, textHeight, width, height) {
    var r = textWidth / 2;
    return x - r < 0 || x + r > width || y - (r = textHeight / 2) < 0 || y + r > height;
  }
  function collision($, x, y, textHeight, textWidth, h, bm0, bm1) {
    var w = textWidth * h / (textHeight * 2),
      x1 = $(x - w),
      x2 = $(x + w),
      y1 = $(y - (h = h / 2)),
      y2 = $(y + h);
    return bm0.outOfBounds(x1, y1, x2, y2) || bm0.getRange(x1, y1, x2, y2) || bm1 && bm1.getRange(x1, y1, x2, y2);
  }
  function placeAreaLabelReducedSearch($, bitmaps, avoidBaseMark, markIndex) {
    var width = $.width,
      height = $.height,
      bm0 = bitmaps[0],
      // where labels have been placed
      bm1 = bitmaps[1]; // area outlines

    function tryLabel(_x, _y, maxSize, textWidth, textHeight) {
      var x = $.invert(_x),
        y = $.invert(_y);
      var lo = maxSize,
        hi = height,
        mid;
      if (!outOfBounds(x, y, textWidth, textHeight, width, height) && !collision($, x, y, textHeight, textWidth, lo, bm0, bm1) && !collision($, x, y, textHeight, textWidth, textHeight, bm0, null)) {
        // if the label fits at the current sample point,
        // perform binary search to find the largest font size that fits
        while (hi - lo >= 1) {
          mid = (lo + hi) / 2;
          if (collision($, x, y, textHeight, textWidth, mid, bm0, bm1)) {
            hi = mid;
          } else {
            lo = mid;
          }
        }
        // place label if current lower bound exceeds prior max font size
        if (lo > maxSize) {
          return [x, y, lo, true];
        }
      }
    }

    // try to place a label within an input area mark
    return function (d) {
      var items = d.datum.datum.items[markIndex].items,
        // area points
        n = items.length,
        // number of points
        textHeight = d.datum.fontSize,
        // label width
        textWidth = textMetrics.width(d.datum, d.datum.text); // label height

      var maxSize = avoidBaseMark ? textHeight : 0,
        labelPlaced = false,
        labelPlaced2 = false,
        maxAreaWidth = 0,
        x1,
        x2,
        y1,
        y2,
        x,
        y,
        _x,
        _y,
        _x1,
        _xMid,
        _x2,
        _y1,
        _yMid,
        _y2,
        areaWidth,
        result,
        swapTmp;

      // for each area sample point
      for (var _i3 = 0; _i3 < n; ++_i3) {
        x1 = items[_i3].x;
        y1 = items[_i3].y;
        x2 = items[_i3].x2 === undefined ? x1 : items[_i3].x2;
        y2 = items[_i3].y2 === undefined ? y1 : items[_i3].y2;
        if (x1 > x2) {
          swapTmp = x1;
          x1 = x2;
          x2 = swapTmp;
        }
        if (y1 > y2) {
          swapTmp = y1;
          y1 = y2;
          y2 = swapTmp;
        }
        _x1 = $(x1);
        _x2 = $(x2);
        _xMid = ~~((_x1 + _x2) / 2);
        _y1 = $(y1);
        _y2 = $(y2);
        _yMid = ~~((_y1 + _y2) / 2);

        // search along the line from mid point between the 2 border to lower border
        for (_x = _xMid; _x >= _x1; --_x) {
          for (_y = _yMid; _y >= _y1; --_y) {
            result = tryLabel(_x, _y, maxSize, textWidth, textHeight);
            if (result) {
              var _result = result;
              var _result2 = _slicedToArray(_result, 4);
              d.x = _result2[0];
              d.y = _result2[1];
              maxSize = _result2[2];
              labelPlaced = _result2[3];
            }
          }
        }

        // search along the line from mid point between the 2 border to upper border
        for (_x = _xMid; _x <= _x2; ++_x) {
          for (_y = _yMid; _y <= _y2; ++_y) {
            result = tryLabel(_x, _y, maxSize, textWidth, textHeight);
            if (result) {
              var _result3 = result;
              var _result4 = _slicedToArray(_result3, 4);
              d.x = _result4[0];
              d.y = _result4[1];
              maxSize = _result4[2];
              labelPlaced = _result4[3];
            }
          }
        }

        // place label at slice center if not placed through other means
        // and if we're not avoiding overlap with other areas
        if (!labelPlaced && !avoidBaseMark) {
          // one span is zero, hence we can add
          areaWidth = Math.abs(x2 - x1 + y2 - y1);
          x = (x1 + x2) / 2;
          y = (y1 + y2) / 2;

          // place label if it fits and improves the max area width
          if (areaWidth >= maxAreaWidth && !outOfBounds(x, y, textWidth, textHeight, width, height) && !collision($, x, y, textHeight, textWidth, textHeight, bm0, null)) {
            maxAreaWidth = areaWidth;
            d.x = x;
            d.y = y;
            labelPlaced2 = true;
          }
        }
      }

      // record current label placement information, update label bitmap
      if (labelPlaced || labelPlaced2) {
        x = textWidth / 2;
        y = textHeight / 2;
        bm0.setRange($(d.x - x), $(d.y - y), $(d.x + x), $(d.y + y));
        d.align = 'center';
        d.baseline = 'middle';
        return true;
      } else {
        return false;
      }
    };
  }

  // pixel direction offsets for flood fill search
  var X_DIR = [-1, -1, 1, 1];
  var Y_DIR = [-1, 1, -1, 1];
  function placeAreaLabelFloodFill($, bitmaps, avoidBaseMark, markIndex) {
    var width = $.width,
      height = $.height,
      bm0 = bitmaps[0],
      // where labels have been placed
      bm1 = bitmaps[1],
      // area outlines
      bm2 = $.bitmap(); // flood-fill visitations

    // try to place a label within an input area mark
    return function (d) {
      var items = d.datum.datum.items[markIndex].items,
        // area points
        n = items.length,
        // number of points
        textHeight = d.datum.fontSize,
        // label width
        textWidth = textMetrics.width(d.datum, d.datum.text),
        // label height
        stack = []; // flood fill stack

      var maxSize = avoidBaseMark ? textHeight : 0,
        labelPlaced = false,
        labelPlaced2 = false,
        maxAreaWidth = 0,
        x1,
        x2,
        y1,
        y2,
        x,
        y,
        _x,
        _y,
        lo,
        hi,
        mid,
        areaWidth;

      // for each area sample point
      for (var _i4 = 0; _i4 < n; ++_i4) {
        x1 = items[_i4].x;
        y1 = items[_i4].y;
        x2 = items[_i4].x2 === undefined ? x1 : items[_i4].x2;
        y2 = items[_i4].y2 === undefined ? y1 : items[_i4].y2;

        // add scaled center point to stack
        stack.push([$((x1 + x2) / 2), $((y1 + y2) / 2)]);

        // perform flood fill, visit points
        while (stack.length) {
          // exit if point already marked
          var _stack$pop = stack.pop();
          var _stack$pop2 = _slicedToArray(_stack$pop, 2);
          _x = _stack$pop2[0];
          _y = _stack$pop2[1];
          if (bm0.get(_x, _y) || bm1.get(_x, _y) || bm2.get(_x, _y)) continue;

          // mark point in flood fill bitmap
          // add search points for all (in bound) directions
          bm2.set(_x, _y);
          for (var j = 0; j < 4; ++j) {
            x = _x + X_DIR[j];
            y = _y + Y_DIR[j];
            if (!bm2.outOfBounds(x, y, x, y)) stack.push([x, y]);
          }

          // unscale point back to x, y space
          x = $.invert(_x);
          y = $.invert(_y);
          lo = maxSize;
          hi = height; // TODO: make this bound smaller

          if (!outOfBounds(x, y, textWidth, textHeight, width, height) && !collision($, x, y, textHeight, textWidth, lo, bm0, bm1) && !collision($, x, y, textHeight, textWidth, textHeight, bm0, null)) {
            // if the label fits at the current sample point,
            // perform binary search to find the largest font size that fits
            while (hi - lo >= 1) {
              mid = (lo + hi) / 2;
              if (collision($, x, y, textHeight, textWidth, mid, bm0, bm1)) {
                hi = mid;
              } else {
                lo = mid;
              }
            }
            // place label if current lower bound exceeds prior max font size
            if (lo > maxSize) {
              d.x = x;
              d.y = y;
              maxSize = lo;
              labelPlaced = true;
            }
          }
        }

        // place label at slice center if not placed through other means
        // and if we're not avoiding overlap with other areas
        if (!labelPlaced && !avoidBaseMark) {
          // one span is zero, hence we can add
          areaWidth = Math.abs(x2 - x1 + y2 - y1);
          x = (x1 + x2) / 2;
          y = (y1 + y2) / 2;

          // place label if it fits and improves the max area width
          if (areaWidth >= maxAreaWidth && !outOfBounds(x, y, textWidth, textHeight, width, height) && !collision($, x, y, textHeight, textWidth, textHeight, bm0, null)) {
            maxAreaWidth = areaWidth;
            d.x = x;
            d.y = y;
            labelPlaced2 = true;
          }
        }
      }

      // record current label placement information, update label bitmap
      if (labelPlaced || labelPlaced2) {
        x = textWidth / 2;
        y = textHeight / 2;
        bm0.setRange($(d.x - x), $(d.y - y), $(d.x + x), $(d.y + y));
        d.align = 'center';
        d.baseline = 'middle';
        return true;
      } else {
        return false;
      }
    };
  }
  var Aligns = ['right', 'center', 'left'],
    Baselines = ['bottom', 'middle', 'top'];
  function placeMarkLabel($, bitmaps, anchors, offsets) {
    var width = $.width,
      height = $.height,
      bm0 = bitmaps[0],
      bm1 = bitmaps[1],
      n = offsets.length;
    return function (d) {
      var _d$textWidth;
      var boundary = d.boundary,
        textHeight = d.datum.fontSize;

      // can not be placed if the mark is not visible in the graph bound
      if (boundary[2] < 0 || boundary[5] < 0 || boundary[0] > width || boundary[3] > height) {
        return false;
      }
      var textWidth = (_d$textWidth = d.textWidth) !== null && _d$textWidth !== void 0 ? _d$textWidth : 0,
        dx,
        dy,
        isInside,
        sizeFactor,
        insideFactor,
        x1,
        x2,
        y1,
        y2,
        xc,
        yc,
        _x1,
        _x2,
        _y1,
        _y2;

      // for each anchor and offset
      for (var _i5 = 0; _i5 < n; ++_i5) {
        dx = (anchors[_i5] & 0x3) - 1;
        dy = (anchors[_i5] >>> 0x2 & 0x3) - 1;
        isInside = dx === 0 && dy === 0 || offsets[_i5] < 0;
        sizeFactor = dx && dy ? Math.SQRT1_2 : 1;
        insideFactor = offsets[_i5] < 0 ? -1 : 1;
        x1 = boundary[1 + dx] + offsets[_i5] * dx * sizeFactor;
        yc = boundary[4 + dy] + insideFactor * textHeight * dy / 2 + offsets[_i5] * dy * sizeFactor;
        y1 = yc - textHeight / 2;
        y2 = yc + textHeight / 2;
        _x1 = $(x1);
        _y1 = $(y1);
        _y2 = $(y2);
        if (!textWidth) {
          // to avoid finding width of text label,
          if (!test(_x1, _x1, _y1, _y2, bm0, bm1, x1, x1, y1, y2, boundary, isInside)) {
            // skip this anchor/offset option if we fail to place a label with 1px width
            continue;
          } else {
            // Otherwise, find the label width
            textWidth = textMetrics.width(d.datum, d.datum.text);
          }
        }
        xc = x1 + insideFactor * textWidth * dx / 2;
        x1 = xc - textWidth / 2;
        x2 = xc + textWidth / 2;
        _x1 = $(x1);
        _x2 = $(x2);
        if (test(_x1, _x2, _y1, _y2, bm0, bm1, x1, x2, y1, y2, boundary, isInside)) {
          // place label if the position is placeable
          d.x = !dx ? xc : dx * insideFactor < 0 ? x2 : x1;
          d.y = !dy ? yc : dy * insideFactor < 0 ? y2 : y1;
          d.align = Aligns[dx * insideFactor + 1];
          d.baseline = Baselines[dy * insideFactor + 1];
          bm0.setRange(_x1, _y1, _x2, _y2);
          return true;
        }
      }
      return false;
    };
  }

  // Test if a label with the given dimensions can be added without overlap
  function test(_x1, _x2, _y1, _y2, bm0, bm1, x1, x2, y1, y2, boundary, isInside) {
    return !(bm0.outOfBounds(_x1, _y1, _x2, _y2) || (isInside && bm1 || bm0).getRange(_x1, _y1, _x2, _y2));
  }

  // 8-bit representation of anchors
  var TOP = 0x0,
    MIDDLE = 0x4,
    BOTTOM = 0x8,
    LEFT = 0x0,
    CENTER = 0x1,
    RIGHT = 0x2;

  // Mapping from text anchor to number representation
  var anchorCode = {
    'top-left': TOP + LEFT,
    'top': TOP + CENTER,
    'top-right': TOP + RIGHT,
    'left': MIDDLE + LEFT,
    'middle': MIDDLE + CENTER,
    'right': MIDDLE + RIGHT,
    'bottom-left': BOTTOM + LEFT,
    'bottom': BOTTOM + CENTER,
    'bottom-right': BOTTOM + RIGHT
  };
  var placeAreaLabel = {
    'naive': placeAreaLabelNaive,
    'reduced-search': placeAreaLabelReducedSearch,
    'floodfill': placeAreaLabelFloodFill
  };
  function labelLayout(texts, size, compare, offset, anchor, avoidMarks, avoidBaseMark, lineAnchor, markIndex, padding, method) {
    // early exit for empty data
    if (!texts.length) return texts;
    var positions = Math.max(offset.length, anchor.length),
      offsets = getOffsets(offset, positions),
      anchors = getAnchors(anchor, positions),
      marktype = markType(texts[0].datum),
      grouptype = marktype === 'group' && texts[0].datum.items[markIndex].marktype,
      isGroupArea = grouptype === 'area',
      boundary = markBoundary(marktype, grouptype, lineAnchor, markIndex),
      infPadding = padding === null || padding === Infinity,
      isNaiveGroupArea = isGroupArea && method === 'naive';
    var maxTextWidth = -1,
      maxTextHeight = -1;

    // prepare text mark data for placing
    var data = texts.map(function (d) {
      var textWidth = infPadding ? textMetrics.width(d, d.text) : undefined;
      maxTextWidth = Math.max(maxTextWidth, textWidth);
      maxTextHeight = Math.max(maxTextHeight, d.fontSize);
      return {
        datum: d,
        opacity: 0,
        x: undefined,
        y: undefined,
        align: undefined,
        baseline: undefined,
        boundary: boundary(d),
        textWidth: textWidth
      };
    });
    padding = padding === null || padding === Infinity ? Math.max(maxTextWidth, maxTextHeight) + Math.max.apply(Math, _toConsumableArray(offset)) : padding;
    var $ = scaler(size[0], size[1], padding);
    var bitmaps;
    if (!isNaiveGroupArea) {
      // sort labels in priority order, if comparator is provided
      if (compare) {
        data.sort(function (a, b) {
          return compare(a.datum, b.datum);
        });
      }

      // flag indicating if label can be placed inside its base mark
      var labelInside = false;
      for (var _i6 = 0; _i6 < anchors.length && !labelInside; ++_i6) {
        // label inside if anchor is at center
        // label inside if offset to be inside the mark bound
        labelInside = anchors[_i6] === 0x5 || offsets[_i6] < 0;
      }

      // extract data information from base mark when base mark is to be avoided
      // base mark is implicitly avoided if it is a group area
      var baseMark = (marktype && avoidBaseMark || isGroupArea) && texts.map(function (d) {
        return d.datum;
      });

      // generate bitmaps for layout calculation
      bitmaps = avoidMarks.length || baseMark ? markBitmaps($, baseMark || [], avoidMarks, labelInside, isGroupArea) : baseBitmaps($, avoidBaseMark && data);
    }

    // generate label placement function
    var place = isGroupArea ? placeAreaLabel[method]($, bitmaps, avoidBaseMark, markIndex) : placeMarkLabel($, bitmaps, anchors, offsets);

    // place all labels
    data.forEach(function (d) {
      return d.opacity = +place(d);
    });
    return data;
  }
  function getOffsets(_, count) {
    var offsets = new Float64Array(count),
      n = _.length;
    for (var _i7 = 0; _i7 < n; ++_i7) offsets[_i7] = _[_i7] || 0;
    for (var _i8 = n; _i8 < count; ++_i8) offsets[_i8] = offsets[n - 1];
    return offsets;
  }
  function getAnchors(_, count) {
    var anchors = new Int8Array(count),
      n = _.length;
    for (var _i9 = 0; _i9 < n; ++_i9) anchors[_i9] |= anchorCode[_[_i9]];
    for (var _i10 = n; _i10 < count; ++_i10) anchors[_i10] = anchors[n - 1];
    return anchors;
  }
  function markType(item) {
    return item && item.mark && item.mark.marktype;
  }

  /**
   * Factory function for function for getting base mark boundary, depending
   * on mark and group type. When mark type is undefined, line or area: boundary
   * is the coordinate of each data point. When base mark is grouped line,
   * boundary is either at the start or end of the line depending on the
   * value of lineAnchor. Otherwise, use bounds of base mark.
   */
  function markBoundary(marktype, grouptype, lineAnchor, markIndex) {
    var xy = function xy(d) {
      return [d.x, d.x, d.x, d.y, d.y, d.y];
    };
    if (!marktype) {
      return xy; // no reactive geometry
    } else if (marktype === 'line' || marktype === 'area') {
      return function (d) {
        return xy(d.datum);
      };
    } else if (grouptype === 'line') {
      return function (d) {
        var items = d.datum.items[markIndex].items;
        return xy(items.length ? items[lineAnchor === 'start' ? 0 : items.length - 1] : {
          x: NaN,
          y: NaN
        });
      };
    } else {
      return function (d) {
        var b = d.datum.bounds;
        return [b.x1, (b.x1 + b.x2) / 2, b.x2, b.y1, (b.y1 + b.y2) / 2, b.y2];
      };
    }
  }
  var Output$1 = ['x', 'y', 'opacity', 'align', 'baseline'];
  var Anchors = ['top-left', 'left', 'bottom-left', 'top', 'bottom', 'top-right', 'right', 'bottom-right'];

  /**
   * Compute text label layout to annotate marks.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<number>} params.size - The size of the layout, provided as a [width, height] array.
   * @param {function(*,*): number} [params.sort] - An optional
   *   comparator function for sorting label data in priority order.
   * @param {Array<string>} [params.anchor] - Label anchor points relative to the base mark bounding box.
   *   The available options are 'top-left', 'left', 'bottom-left', 'top',
   *   'bottom', 'top-right', 'right', 'bottom-right', 'middle'.
   * @param {Array<number>} [params.offset] - Label offsets (in pixels) from the base mark bounding box.
   *   This parameter is parallel to the list of anchor points.
   * @param {number | null} [params.padding=0] - The amount (in pixels) that a label may exceed the layout size.
   *   If this parameter is null, a label may exceed the layout size without any boundary.
   * @param {string} [params.lineAnchor='end'] - For group line mark labels only, indicates the anchor
   *   position for labels. One of 'start' or 'end'.
   * @param {string} [params.markIndex=0] - For group mark labels only, an index indicating
   *   which mark within the group should be labeled.
   * @param {Array<number>} [params.avoidMarks] - A list of additional mark names for which the label
   *   layout should avoid overlap.
   * @param {boolean} [params.avoidBaseMark=true] - Boolean flag indicating if labels should avoid
   *   overlap with the underlying base mark being labeled.
   * @param {string} [params.method='naive'] - For area make labels only, a method for
   *   place labels. One of 'naive', 'reduced-search', or 'floodfill'.
   * @param {Array<string>} [params.as] - The output fields written by the transform.
   *   The default is ['x', 'y', 'opacity', 'align', 'baseline'].
   */
  function Label$1(params) {
    Transform.call(this, null, params);
  }
  Label$1.Definition = {
    type: 'Label',
    metadata: {
      modifies: true
    },
    params: [{
      name: 'size',
      type: 'number',
      array: true,
      length: 2,
      required: true
    }, {
      name: 'sort',
      type: 'compare'
    }, {
      name: 'anchor',
      type: 'string',
      array: true,
      default: Anchors
    }, {
      name: 'offset',
      type: 'number',
      array: true,
      default: [1]
    }, {
      name: 'padding',
      type: 'number',
      default: 0,
      null: true
    }, {
      name: 'lineAnchor',
      type: 'string',
      values: ['start', 'end'],
      default: 'end'
    }, {
      name: 'markIndex',
      type: 'number',
      default: 0
    }, {
      name: 'avoidBaseMark',
      type: 'boolean',
      default: true
    }, {
      name: 'avoidMarks',
      type: 'data',
      array: true
    }, {
      name: 'method',
      type: 'string',
      default: 'naive'
    }, {
      name: 'as',
      type: 'string',
      array: true,
      length: Output$1.length,
      default: Output$1
    }]
  };
  inherits(Label$1, Transform, {
    transform: function transform(_, pulse) {
      function modp(param) {
        var p = _[param];
        return isFunction(p) && pulse.modified(p.fields);
      }
      var mod = _.modified();
      if (!(mod || pulse.changed(pulse.ADD_REM) || modp('sort'))) return;
      if (!_.size || _.size.length !== 2) {
        error('Size parameter should be specified as a [width, height] array.');
      }
      var as = _.as || Output$1;

      // run label layout
      labelLayout(pulse.materialize(pulse.SOURCE).source || [], _.size, _.sort, array$2(_.offset == null ? 1 : _.offset), array$2(_.anchor || Anchors), _.avoidMarks || [], _.avoidBaseMark !== false, _.lineAnchor || 'end', _.markIndex || 0, _.padding === undefined ? 0 : _.padding, _.method || 'naive').forEach(function (l) {
        // write layout results to data stream
        var t = l.datum;
        t[as[0]] = l.x;
        t[as[1]] = l.y;
        t[as[2]] = l.opacity;
        t[as[3]] = l.align;
        t[as[4]] = l.baseline;
      });
      return pulse.reflow(mod).modifies(as);
    }
  });

  var label = /*#__PURE__*/Object.freeze({
    __proto__: null,
    label: Label$1
  });

  function partition(data, groupby) {
    var groups = [],
      get = function get(f) {
        return f(t);
      },
      map,
      i,
      n,
      t,
      k,
      g;

    // partition data points into stack groups
    if (groupby == null) {
      groups.push(data);
    } else {
      for (map = {}, i = 0, n = data.length; i < n; ++i) {
        t = data[i];
        k = groupby.map(get);
        g = map[k];
        if (!g) {
          map[k] = g = [];
          g.dims = k;
          groups.push(g);
        }
        g.push(t);
      }
    }
    return groups;
  }

  /**
   * Compute locally-weighted regression fits for one or more data groups.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.x - An accessor for the predictor data field.
   * @param {function(object): *} params.y - An accessor for the predicted data field.
   * @param {Array<function(object): *>} [params.groupby] - An array of accessors to groupby.
   * @param {number} [params.bandwidth=0.3] - The loess bandwidth.
   */
  function Loess(params) {
    Transform.call(this, null, params);
  }
  Loess.Definition = {
    'type': 'Loess',
    'metadata': {
      'generates': true
    },
    'params': [{
      'name': 'x',
      'type': 'field',
      'required': true
    }, {
      'name': 'y',
      'type': 'field',
      'required': true
    }, {
      'name': 'groupby',
      'type': 'field',
      'array': true
    }, {
      'name': 'bandwidth',
      'type': 'number',
      'default': 0.3
    }, {
      'name': 'as',
      'type': 'string',
      'array': true
    }]
  };
  inherits(Loess, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS);
      if (!this.value || pulse.changed() || _.modified()) {
        var source = pulse.materialize(pulse.SOURCE).source,
          groups = partition(source, _.groupby),
          names = (_.groupby || []).map(accessorName),
          m = names.length,
          as = _.as || [accessorName(_.x), accessorName(_.y)],
          values = [];
        groups.forEach(function (g) {
          loess(g, _.x, _.y, _.bandwidth || 0.3).forEach(function (p) {
            var t = {};
            for (var i = 0; i < m; ++i) {
              t[names[i]] = g.dims[i];
            }
            t[as[0]] = p[0];
            t[as[1]] = p[1];
            values.push(ingest$1(t));
          });
        });
        if (this.value) out.rem = this.value;
        this.value = out.add = out.source = values;
      }
      return out;
    }
  });
  var Methods = {
    constant: constant,
    linear: linear,
    log: log$1,
    exp: exp,
    pow: pow,
    quad: quad,
    poly: poly
  };
  var degreesOfFreedom = function degreesOfFreedom(method, order) {
    return method === 'poly' ? order : method === 'quad' ? 2 : 1;
  };

  /**
   * Compute regression fits for one or more data groups.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {function(object): *} params.x - An accessor for the predictor data field.
   * @param {function(object): *} params.y - An accessor for the predicted data field.
   * @param {string} [params.method='linear'] - The regression method to apply.
   * @param {Array<function(object): *>} [params.groupby] - An array of accessors to groupby.
   * @param {Array<number>} [params.extent] - The domain extent over which to plot the regression line.
   * @param {number} [params.order=3] - The polynomial order. Only applies to the 'poly' method.
   */
  function Regression(params) {
    Transform.call(this, null, params);
  }
  Regression.Definition = {
    'type': 'Regression',
    'metadata': {
      'generates': true
    },
    'params': [{
      'name': 'x',
      'type': 'field',
      'required': true
    }, {
      'name': 'y',
      'type': 'field',
      'required': true
    }, {
      'name': 'groupby',
      'type': 'field',
      'array': true
    }, {
      'name': 'method',
      'type': 'string',
      'default': 'linear',
      'values': Object.keys(Methods)
    }, {
      'name': 'order',
      'type': 'number',
      'default': 3
    }, {
      'name': 'extent',
      'type': 'number',
      'array': true,
      'length': 2
    }, {
      'name': 'params',
      'type': 'boolean',
      'default': false
    }, {
      'name': 'as',
      'type': 'string',
      'array': true
    }]
  };
  inherits(Regression, Transform, {
    transform: function transform(_, pulse) {
      var out = pulse.fork(pulse.NO_SOURCE | pulse.NO_FIELDS);
      if (!this.value || pulse.changed() || _.modified()) {
        var source = pulse.materialize(pulse.SOURCE).source,
          groups = partition(source, _.groupby),
          names = (_.groupby || []).map(accessorName),
          method = _.method || 'linear',
          order = _.order == null ? 3 : _.order,
          dof = degreesOfFreedom(method, order),
          as = _.as || [accessorName(_.x), accessorName(_.y)],
          fit = Methods[method],
          values = [];
        var domain = _.extent;
        if (!_has(Methods, method)) {
          error('Invalid regression method: ' + method);
        }
        if (domain != null) {
          if (method === 'log' && domain[0] <= 0) {
            pulse.dataflow.warn('Ignoring extent with values <= 0 for log regression.');
            domain = null;
          }
        }
        groups.forEach(function (g) {
          var n = g.length;
          if (n <= dof) {
            pulse.dataflow.warn('Skipping regression with more parameters than data points.');
            return;
          }
          var model = fit(g, _.x, _.y, order);
          if (_.params) {
            // if parameter vectors requested return those
            values.push(ingest$1({
              keys: g.dims,
              coef: model.coef,
              rSquared: model.rSquared
            }));
            return;
          }
          var dom = domain || extent(g, _.x),
            add = function add(p) {
              var t = {};
              for (var i = 0; i < names.length; ++i) {
                t[names[i]] = g.dims[i];
              }
              t[as[0]] = p[0];
              t[as[1]] = p[1];
              values.push(ingest$1(t));
            };
          if (method === 'linear' || method === 'constant') {
            // for linear or constant regression we only need the end points
            dom.forEach(function (x) {
              return add([x, model.predict(x)]);
            });
          } else {
            // otherwise return trend line sample points
            sampleCurve(model.predict, dom, 25, 200).forEach(add);
          }
        });
        if (this.value) out.rem = this.value;
        this.value = out.add = out.source = values;
      }
      return out;
    }
  });

  var reg = /*#__PURE__*/Object.freeze({
    __proto__: null,
    loess: Loess,
    regression: Regression
  });

  function Voronoi(params) {
    Transform.call(this, null, params);
  }
  Voronoi.Definition = {
    'type': 'Voronoi',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'x',
      'type': 'field',
      'required': true
    }, {
      'name': 'y',
      'type': 'field',
      'required': true
    }, {
      'name': 'size',
      'type': 'number',
      'array': true,
      'length': 2
    }, {
      'name': 'extent',
      'type': 'array',
      'array': true,
      'length': 2,
      'default': [[-1e5, -1e5], [1e5, 1e5]],
      'content': {
        'type': 'number',
        'array': true,
        'length': 2
      }
    }, {
      'name': 'as',
      'type': 'string',
      'default': 'path'
    }]
  };
  var defaultExtent = [-1e5, -1e5, 1e5, 1e5];
  inherits(Voronoi, Transform, {
    transform: function transform(_, pulse) {
      var as = _.as || 'path',
        data = pulse.source;

      // nothing to do if no data
      if (!data || !data.length) return pulse;

      // configure and construct voronoi diagram
      var s = _.size;
      s = s ? [0, 0, s[0], s[1]] : (s = _.extent) ? [s[0][0], s[0][1], s[1][0], s[1][1]] : defaultExtent;
      var voronoi = this.value = d3Delaunay.Delaunay.from(data, _.x, _.y).voronoi(s);

      // map polygons to paths
      for (var i = 0, n = data.length; i < n; ++i) {
        var polygon = voronoi.cellPolygon(i);
        data[i][as] = polygon ? toPathString(polygon) : null;
      }
      return pulse.reflow(_.modified()).modifies(as);
    }
  });

  // suppress duplicated end point vertices
  function toPathString(p) {
    var x = p[0][0],
      y = p[0][1];
    var n = p.length - 1;
    for (; p[n][0] === x && p[n][1] === y; --n);
    return 'M' + p.slice(0, n + 1).join('L') + 'Z';
  }

  var voronoi = /*#__PURE__*/Object.freeze({
    __proto__: null,
    voronoi: Voronoi
  });

  /*
  Copyright (c) 2013, Jason Davies.
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this
      list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

    * The name Jason Davies may not be used to endorse or promote products
      derived from this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL JASON DAVIES BE LIABLE FOR ANY DIRECT, INDIRECT,
  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
  OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
  ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */

  // Word cloud layout by Jason Davies, https://www.jasondavies.com/wordcloud/
  // Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf

  var cloudRadians = Math.PI / 180,
    cw = 1 << 11 >> 5,
    ch = 1 << 11;
  function cloud() {
    var size = [256, 256],
      text,
      font,
      fontSize,
      fontStyle,
      fontWeight,
      rotate,
      padding,
      spiral = archimedeanSpiral,
      words = [],
      random = Math.random,
      cloud = {};
    cloud.layout = function () {
      var contextAndRatio = getContext(domCanvas()),
        board = zeroArray((size[0] >> 5) * size[1]),
        bounds = null,
        n = words.length,
        i = -1,
        tags = [],
        data = words.map(function (d) {
          return {
            text: text(d),
            font: font(d),
            style: fontStyle(d),
            weight: fontWeight(d),
            rotate: rotate(d),
            size: ~~(fontSize(d) + 1e-14),
            padding: padding(d),
            xoff: 0,
            yoff: 0,
            x1: 0,
            y1: 0,
            x0: 0,
            y0: 0,
            hasText: false,
            sprite: null,
            datum: d
          };
        }).sort(function (a, b) {
          return b.size - a.size;
        });
      while (++i < n) {
        var d = data[i];
        d.x = size[0] * (random() + .5) >> 1;
        d.y = size[1] * (random() + .5) >> 1;
        cloudSprite(contextAndRatio, d, data, i);
        if (d.hasText && place(board, d, bounds)) {
          tags.push(d);
          if (bounds) cloudBounds(bounds, d);else bounds = [{
            x: d.x + d.x0,
            y: d.y + d.y0
          }, {
            x: d.x + d.x1,
            y: d.y + d.y1
          }];
          // Temporary hack
          d.x -= size[0] >> 1;
          d.y -= size[1] >> 1;
        }
      }
      return tags;
    };
    function getContext(canvas) {
      canvas.width = canvas.height = 1;
      var ratio = Math.sqrt(canvas.getContext('2d').getImageData(0, 0, 1, 1).data.length >> 2);
      canvas.width = (cw << 5) / ratio;
      canvas.height = ch / ratio;
      var context = canvas.getContext('2d');
      context.fillStyle = context.strokeStyle = 'red';
      context.textAlign = 'center';
      return {
        context: context,
        ratio: ratio
      };
    }
    function place(board, tag, bounds) {
      var startX = tag.x,
        startY = tag.y,
        maxDelta = Math.hypot(size[0], size[1]),
        s = spiral(size),
        dt = random() < .5 ? 1 : -1,
        t = -dt,
        dxdy,
        dx,
        dy;
      while (dxdy = s(t += dt)) {
        dx = ~~dxdy[0];
        dy = ~~dxdy[1];
        if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxDelta) break;
        tag.x = startX + dx;
        tag.y = startY + dy;
        if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 || tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1]) continue;
        // TODO only check for collisions within current bounds.
        if (!bounds || !cloudCollide(tag, board, size[0])) {
          if (!bounds || collideRects(tag, bounds)) {
            var sprite = tag.sprite,
              w = tag.width >> 5,
              sw = size[0] >> 5,
              lx = tag.x - (w << 4),
              sx = lx & 0x7f,
              msx = 32 - sx,
              h = tag.y1 - tag.y0,
              x = (tag.y + tag.y0) * sw + (lx >> 5),
              last;
            for (var j = 0; j < h; j++) {
              last = 0;
              for (var i = 0; i <= w; i++) {
                board[x + i] |= last << msx | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
              }
              x += sw;
            }
            tag.sprite = null;
            return true;
          }
        }
      }
      return false;
    }
    cloud.words = function (_) {
      if (arguments.length) {
        words = _;
        return cloud;
      } else {
        return words;
      }
    };
    cloud.size = function (_) {
      if (arguments.length) {
        size = [+_[0], +_[1]];
        return cloud;
      } else {
        return size;
      }
    };
    cloud.font = function (_) {
      if (arguments.length) {
        font = functor(_);
        return cloud;
      } else {
        return font;
      }
    };
    cloud.fontStyle = function (_) {
      if (arguments.length) {
        fontStyle = functor(_);
        return cloud;
      } else {
        return fontStyle;
      }
    };
    cloud.fontWeight = function (_) {
      if (arguments.length) {
        fontWeight = functor(_);
        return cloud;
      } else {
        return fontWeight;
      }
    };
    cloud.rotate = function (_) {
      if (arguments.length) {
        rotate = functor(_);
        return cloud;
      } else {
        return rotate;
      }
    };
    cloud.text = function (_) {
      if (arguments.length) {
        text = functor(_);
        return cloud;
      } else {
        return text;
      }
    };
    cloud.spiral = function (_) {
      if (arguments.length) {
        spiral = spirals[_] || _;
        return cloud;
      } else {
        return spiral;
      }
    };
    cloud.fontSize = function (_) {
      if (arguments.length) {
        fontSize = functor(_);
        return cloud;
      } else {
        return fontSize;
      }
    };
    cloud.padding = function (_) {
      if (arguments.length) {
        padding = functor(_);
        return cloud;
      } else {
        return padding;
      }
    };
    cloud.random = function (_) {
      if (arguments.length) {
        random = _;
        return cloud;
      } else {
        return random;
      }
    };
    return cloud;
  }

  // Fetches a monochrome sprite bitmap for the specified text.
  // Load in batches for speed.
  function cloudSprite(contextAndRatio, d, data, di) {
    if (d.sprite) return;
    var c = contextAndRatio.context,
      ratio = contextAndRatio.ratio;
    c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
    var x = 0,
      y = 0,
      maxh = 0,
      n = data.length,
      w,
      w32,
      h,
      i,
      j;
    --di;
    while (++di < n) {
      d = data[di];
      c.save();
      c.font = d.style + ' ' + d.weight + ' ' + ~~((d.size + 1) / ratio) + 'px ' + d.font;
      w = c.measureText(d.text + 'm').width * ratio;
      h = d.size << 1;
      if (d.rotate) {
        var sr = Math.sin(d.rotate * cloudRadians),
          cr = Math.cos(d.rotate * cloudRadians),
          wcr = w * cr,
          wsr = w * sr,
          hcr = h * cr,
          hsr = h * sr;
        w = Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f >> 5 << 5;
        h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
      } else {
        w = w + 0x1f >> 5 << 5;
      }
      if (h > maxh) maxh = h;
      if (x + w >= cw << 5) {
        x = 0;
        y += maxh;
        maxh = 0;
      }
      if (y + h >= ch) break;
      c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
      if (d.rotate) c.rotate(d.rotate * cloudRadians);
      c.fillText(d.text, 0, 0);
      if (d.padding) {
        c.lineWidth = 2 * d.padding;
        c.strokeText(d.text, 0, 0);
      }
      c.restore();
      d.width = w;
      d.height = h;
      d.xoff = x;
      d.yoff = y;
      d.x1 = w >> 1;
      d.y1 = h >> 1;
      d.x0 = -d.x1;
      d.y0 = -d.y1;
      d.hasText = true;
      x += w;
    }
    var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
      sprite = [];
    while (--di >= 0) {
      d = data[di];
      if (!d.hasText) continue;
      w = d.width;
      w32 = w >> 5;
      h = d.y1 - d.y0;
      // Zero the buffer
      for (i = 0; i < h * w32; i++) sprite[i] = 0;
      x = d.xoff;
      if (x == null) return;
      y = d.yoff;
      var seen = 0,
        seenRow = -1;
      for (j = 0; j < h; j++) {
        for (i = 0; i < w; i++) {
          var k = w32 * j + (i >> 5),
            m = pixels[(y + j) * (cw << 5) + (x + i) << 2] ? 1 << 31 - i % 32 : 0;
          sprite[k] |= m;
          seen |= m;
        }
        if (seen) seenRow = j;else {
          d.y0++;
          h--;
          j--;
          y++;
        }
      }
      d.y1 = d.y0 + seenRow;
      d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
    }
  }

  // Use mask-based collision detection.
  function cloudCollide(tag, board, sw) {
    sw >>= 5;
    var sprite = tag.sprite,
      w = tag.width >> 5,
      lx = tag.x - (w << 4),
      sx = lx & 0x7f,
      msx = 32 - sx,
      h = tag.y1 - tag.y0,
      x = (tag.y + tag.y0) * sw + (lx >> 5),
      last;
    for (var j = 0; j < h; j++) {
      last = 0;
      for (var i = 0; i <= w; i++) {
        if ((last << msx | (i < w ? (last = sprite[j * w + i]) >>> sx : 0)) & board[x + i]) return true;
      }
      x += sw;
    }
    return false;
  }
  function cloudBounds(bounds, d) {
    var b0 = bounds[0],
      b1 = bounds[1];
    if (d.x + d.x0 < b0.x) b0.x = d.x + d.x0;
    if (d.y + d.y0 < b0.y) b0.y = d.y + d.y0;
    if (d.x + d.x1 > b1.x) b1.x = d.x + d.x1;
    if (d.y + d.y1 > b1.y) b1.y = d.y + d.y1;
  }
  function collideRects(a, b) {
    return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
  }
  function archimedeanSpiral(size) {
    var e = size[0] / size[1];
    return function (t) {
      return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
    };
  }
  function rectangularSpiral(size) {
    var dy = 4,
      dx = dy * size[0] / size[1],
      x = 0,
      y = 0;
    return function (t) {
      var sign = t < 0 ? -1 : 1;
      // See triangular numbers: T_n = n * (n + 1) / 2.
      switch (Math.sqrt(1 + 4 * sign * t) - sign & 3) {
        case 0:
          x += dx;
          break;
        case 1:
          y += dy;
          break;
        case 2:
          x -= dx;
          break;
        default:
          y -= dy;
          break;
      }
      return [x, y];
    };
  }

  // TODO reuse arrays?
  function zeroArray(n) {
    var a = [],
      i = -1;
    while (++i < n) a[i] = 0;
    return a;
  }
  function functor(d) {
    return typeof d === 'function' ? d : function () {
      return d;
    };
  }
  var spirals = {
    archimedean: archimedeanSpiral,
    rectangular: rectangularSpiral
  };
  var Output = ['x', 'y', 'font', 'fontSize', 'fontStyle', 'fontWeight', 'angle'];
  var Params$1 = ['text', 'font', 'rotate', 'fontSize', 'fontStyle', 'fontWeight'];
  function Wordcloud(params) {
    Transform.call(this, cloud(), params);
  }
  Wordcloud.Definition = {
    'type': 'Wordcloud',
    'metadata': {
      'modifies': true
    },
    'params': [{
      'name': 'size',
      'type': 'number',
      'array': true,
      'length': 2
    }, {
      'name': 'font',
      'type': 'string',
      'expr': true,
      'default': 'sans-serif'
    }, {
      'name': 'fontStyle',
      'type': 'string',
      'expr': true,
      'default': 'normal'
    }, {
      'name': 'fontWeight',
      'type': 'string',
      'expr': true,
      'default': 'normal'
    }, {
      'name': 'fontSize',
      'type': 'number',
      'expr': true,
      'default': 14
    }, {
      'name': 'fontSizeRange',
      'type': 'number',
      'array': 'nullable',
      'default': [10, 50]
    }, {
      'name': 'rotate',
      'type': 'number',
      'expr': true,
      'default': 0
    }, {
      'name': 'text',
      'type': 'field'
    }, {
      'name': 'spiral',
      'type': 'string',
      'values': ['archimedean', 'rectangular']
    }, {
      'name': 'padding',
      'type': 'number',
      'expr': true
    }, {
      'name': 'as',
      'type': 'string',
      'array': true,
      'length': 7,
      'default': Output
    }]
  };
  inherits(Wordcloud, Transform, {
    transform: function transform(_, pulse) {
      if (_.size && !(_.size[0] && _.size[1])) {
        error('Wordcloud size dimensions must be non-zero.');
      }
      function modp(param) {
        var p = _[param];
        return isFunction(p) && pulse.modified(p.fields);
      }
      var mod = _.modified();
      if (!(mod || pulse.changed(pulse.ADD_REM) || Params$1.some(modp))) return;
      var data = pulse.materialize(pulse.SOURCE).source,
        layout = this.value,
        as = _.as || Output;
      var fontSize = _.fontSize || 14,
        range;
      isFunction(fontSize) ? range = _.fontSizeRange : fontSize = constant$1(fontSize);

      // create font size scaling function as needed
      if (range) {
        var fsize = fontSize,
          sizeScale = scale$4('sqrt')().domain(extent(data, fsize)).range(range);
        fontSize = function fontSize(x) {
          return sizeScale(fsize(x));
        };
      }
      data.forEach(function (t) {
        t[as[0]] = NaN;
        t[as[1]] = NaN;
        t[as[3]] = 0;
      });

      // configure layout
      var words = layout.words(data).text(_.text).size(_.size || [500, 500]).padding(_.padding || 1).spiral(_.spiral || 'archimedean').rotate(_.rotate || 0).font(_.font || 'sans-serif').fontStyle(_.fontStyle || 'normal').fontWeight(_.fontWeight || 'normal').fontSize(fontSize).random(exports.random).layout();
      var size = layout.size(),
        dx = size[0] >> 1,
        dy = size[1] >> 1,
        n = words.length;
      for (var i = 0, w, t; i < n; ++i) {
        w = words[i];
        t = w.datum;
        t[as[0]] = w.x + dx;
        t[as[1]] = w.y + dy;
        t[as[2]] = w.font;
        t[as[3]] = w.size;
        t[as[4]] = w.style;
        t[as[5]] = w.weight;
        t[as[6]] = w.rotate;
      }
      return pulse.reflow(mod).modifies(as);
    }
  });

  var wordcloud = /*#__PURE__*/Object.freeze({
    __proto__: null,
    wordcloud: Wordcloud
  });

  var array8 = function array8(n) {
    return new Uint8Array(n);
  };
  var array16 = function array16(n) {
    return new Uint16Array(n);
  };
  var array32 = function array32(n) {
    return new Uint32Array(n);
  };

  /**
   * Maintains CrossFilter state.
   */
  function Bitmaps() {
    var width = 8,
      _data = [],
      _seen = array32(0),
      _curr = array$1(0, width),
      _prev = array$1(0, width);
    return {
      data: function data() {
        return _data;
      },
      seen: function seen() {
        return _seen = lengthen(_seen, _data.length);
      },
      add: function add(array) {
        for (var i = 0, j = _data.length, n = array.length, t; i < n; ++i) {
          t = array[i];
          t._index = j++;
          _data.push(t);
        }
      },
      remove: function remove(num, map) {
        // map: index -> boolean (true => remove)
        var n = _data.length,
          copy = Array(n - num),
          reindex = _data; // reuse old data array for index map
        var t, i, j;

        // seek forward to first removal
        for (i = 0; !map[i] && i < n; ++i) {
          copy[i] = _data[i];
          reindex[i] = i;
        }

        // condense arrays
        for (j = i; i < n; ++i) {
          t = _data[i];
          if (!map[i]) {
            reindex[i] = j;
            _curr[j] = _curr[i];
            _prev[j] = _prev[i];
            copy[j] = t;
            t._index = j++;
          } else {
            reindex[i] = -1;
          }
          _curr[i] = 0; // clear unused bits
        }

        _data = copy;
        return reindex;
      },
      size: function size() {
        return _data.length;
      },
      curr: function curr() {
        return _curr;
      },
      prev: function prev() {
        return _prev;
      },
      reset: function reset(k) {
        return _prev[k] = _curr[k];
      },
      all: function all() {
        return width < 0x101 ? 0xff : width < 0x10001 ? 0xffff : 0xffffffff;
      },
      set: function set(k, one) {
        _curr[k] |= one;
      },
      clear: function clear(k, one) {
        _curr[k] &= ~one;
      },
      resize: function resize(n, m) {
        var k = _curr.length;
        if (n > k || m > width) {
          width = Math.max(m, width);
          _curr = array$1(n, width, _curr);
          _prev = array$1(n, width);
        }
      }
    };
  }
  function lengthen(array, length, copy) {
    if (array.length >= length) return array;
    copy = copy || new array.constructor(length);
    copy.set(array);
    return copy;
  }
  function array$1(n, m, array) {
    var copy = (m < 0x101 ? array8 : m < 0x10001 ? array16 : array32)(n);
    if (array) copy.set(array);
    return copy;
  }
  function Dimension(index, i, query) {
    var bit = 1 << i;
    return {
      one: bit,
      zero: ~bit,
      range: query.slice(),
      bisect: index.bisect,
      index: index.index,
      size: index.size,
      onAdd: function onAdd(added, curr) {
        var dim = this,
          range = dim.bisect(dim.range, added.value),
          idx = added.index,
          lo = range[0],
          hi = range[1],
          n1 = idx.length;
        var i;
        for (i = 0; i < lo; ++i) curr[idx[i]] |= bit;
        for (i = hi; i < n1; ++i) curr[idx[i]] |= bit;
        return dim;
      }
    };
  }

  /**
   * Maintains a list of values, sorted by key.
   */
  function SortedIndex() {
    var _index = array32(0),
      value = [],
      _size = 0;
    function insert(key, data, base) {
      if (!data.length) return [];
      var n0 = _size,
        n1 = data.length,
        addi = array32(n1);
      var addv = Array(n1),
        oldv,
        oldi,
        i;
      for (i = 0; i < n1; ++i) {
        addv[i] = key(data[i]);
        addi[i] = i;
      }
      addv = sort(addv, addi);
      if (n0) {
        oldv = value;
        oldi = _index;
        value = Array(n0 + n1);
        _index = array32(n0 + n1);
        merge$1(base, oldv, oldi, n0, addv, addi, n1, value, _index);
      } else {
        if (base > 0) for (i = 0; i < n1; ++i) {
          addi[i] += base;
        }
        value = addv;
        _index = addi;
      }
      _size = n0 + n1;
      return {
        index: addi,
        value: addv
      };
    }
    function remove(num, map) {
      // map: index -> remove
      var n = _size;
      var idx, i, j;

      // seek forward to first removal
      for (i = 0; !map[_index[i]] && i < n; ++i);

      // condense index and value arrays
      for (j = i; i < n; ++i) {
        if (!map[idx = _index[i]]) {
          _index[j] = idx;
          value[j] = value[i];
          ++j;
        }
      }
      _size = n - num;
    }
    function reindex(map) {
      for (var i = 0, n = _size; i < n; ++i) {
        _index[i] = map[_index[i]];
      }
    }
    function bisect(range, array) {
      var n;
      if (array) {
        n = array.length;
      } else {
        array = value;
        n = _size;
      }
      return [d3Array.bisectLeft(array, range[0], 0, n), d3Array.bisectRight(array, range[1], 0, n)];
    }
    return {
      insert: insert,
      remove: remove,
      bisect: bisect,
      reindex: reindex,
      index: function index() {
        return _index;
      },
      size: function size() {
        return _size;
      }
    };
  }
  function sort(values, index) {
    values.sort.call(index, function (a, b) {
      var x = values[a],
        y = values[b];
      return x < y ? -1 : x > y ? 1 : 0;
    });
    return d3Array.permute(values, index);
  }
  function merge$1(base, value0, index0, n0, value1, index1, n1, value, index) {
    var i0 = 0,
      i1 = 0,
      i;
    for (i = 0; i0 < n0 && i1 < n1; ++i) {
      if (value0[i0] < value1[i1]) {
        value[i] = value0[i0];
        index[i] = index0[i0++];
      } else {
        value[i] = value1[i1];
        index[i] = index1[i1++] + base;
      }
    }
    for (; i0 < n0; ++i0, ++i) {
      value[i] = value0[i0];
      index[i] = index0[i0];
    }
    for (; i1 < n1; ++i1, ++i) {
      value[i] = value1[i1];
      index[i] = index1[i1] + base;
    }
  }

  /**
   * An indexed multi-dimensional filter.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {Array<function(object): *>} params.fields - An array of dimension accessors to filter.
   * @param {Array} params.query - An array of per-dimension range queries.
   */
  function CrossFilter(params) {
    Transform.call(this, Bitmaps(), params);
    this._indices = null;
    this._dims = null;
  }
  CrossFilter.Definition = {
    'type': 'CrossFilter',
    'metadata': {},
    'params': [{
      'name': 'fields',
      'type': 'field',
      'array': true,
      'required': true
    }, {
      'name': 'query',
      'type': 'array',
      'array': true,
      'required': true,
      'content': {
        'type': 'number',
        'array': true,
        'length': 2
      }
    }]
  };
  inherits(CrossFilter, Transform, {
    transform: function transform(_, pulse) {
      if (!this._dims) {
        return this.init(_, pulse);
      } else {
        var init = _.modified('fields') || _.fields.some(function (f) {
          return pulse.modified(f.fields);
        });
        return init ? this.reinit(_, pulse) : this.eval(_, pulse);
      }
    },
    init: function init(_, pulse) {
      var fields = _.fields,
        query = _.query,
        indices = this._indices = {},
        dims = this._dims = [],
        m = query.length;
      var i = 0,
        key,
        index;

      // instantiate indices and dimensions
      for (; i < m; ++i) {
        key = fields[i].fname;
        index = indices[key] || (indices[key] = SortedIndex());
        dims.push(Dimension(index, i, query[i]));
      }
      return this.eval(_, pulse);
    },
    reinit: function reinit(_, pulse) {
      var output = pulse.materialize().fork(),
        fields = _.fields,
        query = _.query,
        indices = this._indices,
        dims = this._dims,
        bits = this.value,
        curr = bits.curr(),
        prev = bits.prev(),
        all = bits.all(),
        out = output.rem = output.add,
        mod = output.mod,
        m = query.length,
        adds = {};
      var add, index, key, mods, remMap, modMap, i, n, f;

      // set prev to current state
      prev.set(curr);

      // if pulse has remove tuples, process them first
      if (pulse.rem.length) {
        remMap = this.remove(_, pulse, output);
      }

      // if pulse has added tuples, add them to state
      if (pulse.add.length) {
        bits.add(pulse.add);
      }

      // if pulse has modified tuples, create an index map
      if (pulse.mod.length) {
        modMap = {};
        for (mods = pulse.mod, i = 0, n = mods.length; i < n; ++i) {
          modMap[mods[i]._index] = 1;
        }
      }

      // re-initialize indices as needed, update curr bitmap
      for (i = 0; i < m; ++i) {
        f = fields[i];
        if (!dims[i] || _.modified('fields', i) || pulse.modified(f.fields)) {
          key = f.fname;
          if (!(add = adds[key])) {
            indices[key] = index = SortedIndex();
            adds[key] = add = index.insert(f, pulse.source, 0);
          }
          dims[i] = Dimension(index, i, query[i]).onAdd(add, curr);
        }
      }

      // visit each tuple
      // if filter state changed, push index to add/rem
      // else if in mod and passes a filter, push index to mod
      for (i = 0, n = bits.data().length; i < n; ++i) {
        if (remMap[i]) {
          // skip if removed tuple
          continue;
        } else if (prev[i] !== curr[i]) {
          // add if state changed
          out.push(i);
        } else if (modMap[i] && curr[i] !== all) {
          // otherwise, pass mods through
          mod.push(i);
        }
      }
      bits.mask = (1 << m) - 1;
      return output;
    },
    eval: function _eval(_, pulse) {
      var output = pulse.materialize().fork(),
        m = this._dims.length;
      var mask = 0;
      if (pulse.rem.length) {
        this.remove(_, pulse, output);
        mask |= (1 << m) - 1;
      }
      if (_.modified('query') && !_.modified('fields')) {
        mask |= this.update(_, pulse, output);
      }
      if (pulse.add.length) {
        this.insert(_, pulse, output);
        mask |= (1 << m) - 1;
      }
      if (pulse.mod.length) {
        this.modify(pulse, output);
        mask |= (1 << m) - 1;
      }
      this.value.mask = mask;
      return output;
    },
    insert: function insert(_, pulse, output) {
      var tuples = pulse.add,
        bits = this.value,
        dims = this._dims,
        indices = this._indices,
        fields = _.fields,
        adds = {},
        out = output.add,
        n = bits.size() + tuples.length,
        m = dims.length;
      var k = bits.size(),
        j,
        key,
        add;

      // resize bitmaps and add tuples as needed
      bits.resize(n, m);
      bits.add(tuples);
      var curr = bits.curr(),
        prev = bits.prev(),
        all = bits.all();

      // add to dimensional indices
      for (j = 0; j < m; ++j) {
        key = fields[j].fname;
        add = adds[key] || (adds[key] = indices[key].insert(fields[j], tuples, k));
        dims[j].onAdd(add, curr);
      }

      // set previous filters, output if passes at least one filter
      for (; k < n; ++k) {
        prev[k] = all;
        if (curr[k] !== all) out.push(k);
      }
    },
    modify: function modify(pulse, output) {
      var out = output.mod,
        bits = this.value,
        curr = bits.curr(),
        all = bits.all(),
        tuples = pulse.mod;
      var i, n, k;
      for (i = 0, n = tuples.length; i < n; ++i) {
        k = tuples[i]._index;
        if (curr[k] !== all) out.push(k);
      }
    },
    remove: function remove(_, pulse, output) {
      var indices = this._indices,
        bits = this.value,
        curr = bits.curr(),
        prev = bits.prev(),
        all = bits.all(),
        map = {},
        out = output.rem,
        tuples = pulse.rem;
      var i, n, k, f;

      // process tuples, output if passes at least one filter
      for (i = 0, n = tuples.length; i < n; ++i) {
        k = tuples[i]._index;
        map[k] = 1; // build index map
        prev[k] = f = curr[k];
        curr[k] = all;
        if (f !== all) out.push(k);
      }

      // remove from dimensional indices
      for (k in indices) {
        indices[k].remove(n, map);
      }
      this.reindex(pulse, n, map);
      return map;
    },
    // reindex filters and indices after propagation completes
    reindex: function reindex(pulse, num, map) {
      var indices = this._indices,
        bits = this.value;
      pulse.runAfter(function () {
        var indexMap = bits.remove(num, map);
        for (var key in indices) indices[key].reindex(indexMap);
      });
    },
    update: function update(_, pulse, output) {
      var dims = this._dims,
        query = _.query,
        stamp = pulse.stamp,
        m = dims.length;
      var mask = 0,
        i,
        q;

      // survey how many queries have changed
      output.filters = 0;
      for (q = 0; q < m; ++q) {
        if (_.modified('query', q)) {
          i = q;
          ++mask;
        }
      }
      if (mask === 1) {
        // only one query changed, use more efficient update
        mask = dims[i].one;
        this.incrementOne(dims[i], query[i], output.add, output.rem);
      } else {
        // multiple queries changed, perform full record keeping
        for (q = 0, mask = 0; q < m; ++q) {
          if (!_.modified('query', q)) continue;
          mask |= dims[q].one;
          this.incrementAll(dims[q], query[q], stamp, output.add);
          output.rem = output.add; // duplicate add/rem for downstream resolve
        }
      }

      return mask;
    },
    incrementAll: function incrementAll(dim, query, stamp, out) {
      var bits = this.value,
        seen = bits.seen(),
        curr = bits.curr(),
        prev = bits.prev(),
        index = dim.index(),
        old = dim.bisect(dim.range),
        range = dim.bisect(query),
        lo1 = range[0],
        hi1 = range[1],
        lo0 = old[0],
        hi0 = old[1],
        one = dim.one;
      var i, j, k;

      // Fast incremental update based on previous lo index.
      if (lo1 < lo0) {
        for (i = lo1, j = Math.min(lo0, hi1); i < j; ++i) {
          k = index[i];
          if (seen[k] !== stamp) {
            prev[k] = curr[k];
            seen[k] = stamp;
            out.push(k);
          }
          curr[k] ^= one;
        }
      } else if (lo1 > lo0) {
        for (i = lo0, j = Math.min(lo1, hi0); i < j; ++i) {
          k = index[i];
          if (seen[k] !== stamp) {
            prev[k] = curr[k];
            seen[k] = stamp;
            out.push(k);
          }
          curr[k] ^= one;
        }
      }

      // Fast incremental update based on previous hi index.
      if (hi1 > hi0) {
        for (i = Math.max(lo1, hi0), j = hi1; i < j; ++i) {
          k = index[i];
          if (seen[k] !== stamp) {
            prev[k] = curr[k];
            seen[k] = stamp;
            out.push(k);
          }
          curr[k] ^= one;
        }
      } else if (hi1 < hi0) {
        for (i = Math.max(lo0, hi1), j = hi0; i < j; ++i) {
          k = index[i];
          if (seen[k] !== stamp) {
            prev[k] = curr[k];
            seen[k] = stamp;
            out.push(k);
          }
          curr[k] ^= one;
        }
      }
      dim.range = query.slice();
    },
    incrementOne: function incrementOne(dim, query, add, rem) {
      var bits = this.value,
        curr = bits.curr(),
        index = dim.index(),
        old = dim.bisect(dim.range),
        range = dim.bisect(query),
        lo1 = range[0],
        hi1 = range[1],
        lo0 = old[0],
        hi0 = old[1],
        one = dim.one;
      var i, j, k;

      // Fast incremental update based on previous lo index.
      if (lo1 < lo0) {
        for (i = lo1, j = Math.min(lo0, hi1); i < j; ++i) {
          k = index[i];
          curr[k] ^= one;
          add.push(k);
        }
      } else if (lo1 > lo0) {
        for (i = lo0, j = Math.min(lo1, hi0); i < j; ++i) {
          k = index[i];
          curr[k] ^= one;
          rem.push(k);
        }
      }

      // Fast incremental update based on previous hi index.
      if (hi1 > hi0) {
        for (i = Math.max(lo1, hi0), j = hi1; i < j; ++i) {
          k = index[i];
          curr[k] ^= one;
          add.push(k);
        }
      } else if (hi1 < hi0) {
        for (i = Math.max(lo0, hi1), j = hi0; i < j; ++i) {
          k = index[i];
          curr[k] ^= one;
          rem.push(k);
        }
      }
      dim.range = query.slice();
    }
  });

  /**
   * Selectively filters tuples by resolving against a filter bitmap.
   * Useful for processing the output of a cross-filter transform.
   * @constructor
   * @param {object} params - The parameters for this operator.
   * @param {object} params.ignore - A bit mask indicating which filters to ignore.
   * @param {object} params.filter - The per-tuple filter bitmaps. Typically this
   *   parameter value is a reference to a {@link CrossFilter} transform.
   */
  function ResolveFilter(params) {
    Transform.call(this, null, params);
  }
  ResolveFilter.Definition = {
    'type': 'ResolveFilter',
    'metadata': {},
    'params': [{
      'name': 'ignore',
      'type': 'number',
      'required': true,
      'description': 'A bit mask indicating which filters to ignore.'
    }, {
      'name': 'filter',
      'type': 'object',
      'required': true,
      'description': 'Per-tuple filter bitmaps from a CrossFilter transform.'
    }]
  };
  inherits(ResolveFilter, Transform, {
    transform: function transform(_, pulse) {
      var ignore = ~(_.ignore || 0),
        // bit mask where zeros -> dims to ignore
        bitmap = _.filter,
        mask = bitmap.mask;

      // exit early if no relevant filter changes
      if ((mask & ignore) === 0) return pulse.StopPropagation;
      var output = pulse.fork(pulse.ALL),
        data = bitmap.data(),
        curr = bitmap.curr(),
        prev = bitmap.prev(),
        pass = function pass(k) {
          return !(curr[k] & ignore) ? data[k] : null;
        };

      // propagate all mod tuples that pass the filter
      output.filter(output.MOD, pass);

      // determine add & rem tuples via filter functions
      // for efficiency, we do *not* populate new arrays,
      // instead we add filter functions applied downstream

      if (!(mask & mask - 1)) {
        // only one filter changed
        output.filter(output.ADD, pass);
        output.filter(output.REM, function (k) {
          return (curr[k] & ignore) === mask ? data[k] : null;
        });
      } else {
        // multiple filters changed
        output.filter(output.ADD, function (k) {
          var c = curr[k] & ignore,
            f = !c && c ^ prev[k] & ignore;
          return f ? data[k] : null;
        });
        output.filter(output.REM, function (k) {
          var c = curr[k] & ignore,
            f = c && !(c ^ (c ^ prev[k] & ignore));
          return f ? data[k] : null;
        });
      }

      // add filter to source data in case of reflow...
      return output.filter(output.SOURCE, function (t) {
        return pass(t._index);
      });
    }
  });

  var xf = /*#__PURE__*/Object.freeze({
    __proto__: null,
    crossfilter: CrossFilter,
    resolvefilter: ResolveFilter
  });

  var version = "5.25.0";

  var RawCode = 'RawCode';
  var Literal = 'Literal';
  var Property = 'Property';
  var Identifier = 'Identifier';
  var ArrayExpression = 'ArrayExpression';
  var BinaryExpression = 'BinaryExpression';
  var CallExpression = 'CallExpression';
  var ConditionalExpression = 'ConditionalExpression';
  var LogicalExpression = 'LogicalExpression';
  var MemberExpression = 'MemberExpression';
  var ObjectExpression = 'ObjectExpression';
  var UnaryExpression = 'UnaryExpression';
  function ASTNode(type) {
    this.type = type;
  }
  ASTNode.prototype.visit = function (visitor) {
    var c, i, n;
    if (visitor(this)) return 1;
    for (c = children(this), i = 0, n = c.length; i < n; ++i) {
      if (c[i].visit(visitor)) return 1;
    }
  };
  function children(node) {
    switch (node.type) {
      case ArrayExpression:
        return node.elements;
      case BinaryExpression:
      case LogicalExpression:
        return [node.left, node.right];
      case CallExpression:
        return [node.callee].concat(node.arguments);
      case ConditionalExpression:
        return [node.test, node.consequent, node.alternate];
      case MemberExpression:
        return [node.object, node.property];
      case ObjectExpression:
        return node.properties;
      case Property:
        return [node.key, node.value];
      case UnaryExpression:
        return [node.argument];
      case Identifier:
      case Literal:
      case RawCode:
      default:
        return [];
    }
  }

  /*
    The following expression parser is based on Esprima (http://esprima.org/).
    Original header comment and license for Esprima is included here:

    Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>
    Copyright (C) 2013 Thaddee Tyl <thaddee.tyl@gmail.com>
    Copyright (C) 2013 Mathias Bynens <mathias@qiwi.be>
    Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
    Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
    Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
    Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
    Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
    Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
    Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
    THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
  var TokenName, source, index, length, lookahead;
  var TokenBooleanLiteral = 1,
    TokenEOF = 2,
    TokenIdentifier = 3,
    TokenKeyword = 4,
    TokenNullLiteral = 5,
    TokenNumericLiteral = 6,
    TokenPunctuator = 7,
    TokenStringLiteral = 8,
    TokenRegularExpression = 9;
  TokenName = {};
  TokenName[TokenBooleanLiteral] = 'Boolean';
  TokenName[TokenEOF] = '<end>';
  TokenName[TokenIdentifier] = 'Identifier';
  TokenName[TokenKeyword] = 'Keyword';
  TokenName[TokenNullLiteral] = 'Null';
  TokenName[TokenNumericLiteral] = 'Numeric';
  TokenName[TokenPunctuator] = 'Punctuator';
  TokenName[TokenStringLiteral] = 'String';
  TokenName[TokenRegularExpression] = 'RegularExpression';
  var SyntaxArrayExpression = 'ArrayExpression',
    SyntaxBinaryExpression = 'BinaryExpression',
    SyntaxCallExpression = 'CallExpression',
    SyntaxConditionalExpression = 'ConditionalExpression',
    SyntaxIdentifier = 'Identifier',
    SyntaxLiteral = 'Literal',
    SyntaxLogicalExpression = 'LogicalExpression',
    SyntaxMemberExpression = 'MemberExpression',
    SyntaxObjectExpression = 'ObjectExpression',
    SyntaxProperty = 'Property',
    SyntaxUnaryExpression = 'UnaryExpression';

  // Error messages should be identical to V8.
  var MessageUnexpectedToken = 'Unexpected token %0',
    MessageUnexpectedNumber = 'Unexpected number',
    MessageUnexpectedString = 'Unexpected string',
    MessageUnexpectedIdentifier = 'Unexpected identifier',
    MessageUnexpectedReserved = 'Unexpected reserved word',
    MessageUnexpectedEOS = 'Unexpected end of input',
    MessageInvalidRegExp = 'Invalid regular expression',
    MessageUnterminatedRegExp = 'Invalid regular expression: missing /',
    MessageStrictOctalLiteral = 'Octal literals are not allowed in strict mode.',
    MessageStrictDuplicateProperty = 'Duplicate data property in object literal not allowed in strict mode';
  var ILLEGAL$1 = 'ILLEGAL',
    DISABLED = 'Disabled.';

  // See also tools/generate-unicode-regex.py.
  var RegexNonAsciiIdentifierStart = new RegExp("[\\xAA\\xB5\\xBA\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u037F\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u052F\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0-\\u08B2\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0980\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F8\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191E\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA69D\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA7AD\\uA7B0\\uA7B1\\uA7F7-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uA9E0-\\uA9E4\\uA9E6-\\uA9EF\\uA9FA-\\uA9FE\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA7E-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uAB30-\\uAB5A\\uAB5C-\\uAB5F\\uAB64\\uAB65\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
    // eslint-disable-next-line no-misleading-character-class
    RegexNonAsciiIdentifierPart = new RegExp("[\\xAA\\xB5\\xBA\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0300-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u037F\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u0483-\\u0487\\u048A-\\u052F\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0610-\\u061A\\u0620-\\u0669\\u066E-\\u06D3\\u06D5-\\u06DC\\u06DF-\\u06E8\\u06EA-\\u06FC\\u06FF\\u0710-\\u074A\\u074D-\\u07B1\\u07C0-\\u07F5\\u07FA\\u0800-\\u082D\\u0840-\\u085B\\u08A0-\\u08B2\\u08E4-\\u0963\\u0966-\\u096F\\u0971-\\u0983\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BC-\\u09C4\\u09C7\\u09C8\\u09CB-\\u09CE\\u09D7\\u09DC\\u09DD\\u09DF-\\u09E3\\u09E6-\\u09F1\\u0A01-\\u0A03\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A3C\\u0A3E-\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A59-\\u0A5C\\u0A5E\\u0A66-\\u0A75\\u0A81-\\u0A83\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABC-\\u0AC5\\u0AC7-\\u0AC9\\u0ACB-\\u0ACD\\u0AD0\\u0AE0-\\u0AE3\\u0AE6-\\u0AEF\\u0B01-\\u0B03\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3C-\\u0B44\\u0B47\\u0B48\\u0B4B-\\u0B4D\\u0B56\\u0B57\\u0B5C\\u0B5D\\u0B5F-\\u0B63\\u0B66-\\u0B6F\\u0B71\\u0B82\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BBE-\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCD\\u0BD0\\u0BD7\\u0BE6-\\u0BEF\\u0C00-\\u0C03\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C39\\u0C3D-\\u0C44\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C58\\u0C59\\u0C60-\\u0C63\\u0C66-\\u0C6F\\u0C81-\\u0C83\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBC-\\u0CC4\\u0CC6-\\u0CC8\\u0CCA-\\u0CCD\\u0CD5\\u0CD6\\u0CDE\\u0CE0-\\u0CE3\\u0CE6-\\u0CEF\\u0CF1\\u0CF2\\u0D01-\\u0D03\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D-\\u0D44\\u0D46-\\u0D48\\u0D4A-\\u0D4E\\u0D57\\u0D60-\\u0D63\\u0D66-\\u0D6F\\u0D7A-\\u0D7F\\u0D82\\u0D83\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0DCA\\u0DCF-\\u0DD4\\u0DD6\\u0DD8-\\u0DDF\\u0DE6-\\u0DEF\\u0DF2\\u0DF3\\u0E01-\\u0E3A\\u0E40-\\u0E4E\\u0E50-\\u0E59\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB9\\u0EBB-\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EC8-\\u0ECD\\u0ED0-\\u0ED9\\u0EDC-\\u0EDF\\u0F00\\u0F18\\u0F19\\u0F20-\\u0F29\\u0F35\\u0F37\\u0F39\\u0F3E-\\u0F47\\u0F49-\\u0F6C\\u0F71-\\u0F84\\u0F86-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u1000-\\u1049\\u1050-\\u109D\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u135D-\\u135F\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F8\\u1700-\\u170C\\u170E-\\u1714\\u1720-\\u1734\\u1740-\\u1753\\u1760-\\u176C\\u176E-\\u1770\\u1772\\u1773\\u1780-\\u17D3\\u17D7\\u17DC\\u17DD\\u17E0-\\u17E9\\u180B-\\u180D\\u1810-\\u1819\\u1820-\\u1877\\u1880-\\u18AA\\u18B0-\\u18F5\\u1900-\\u191E\\u1920-\\u192B\\u1930-\\u193B\\u1946-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19B0-\\u19C9\\u19D0-\\u19D9\\u1A00-\\u1A1B\\u1A20-\\u1A5E\\u1A60-\\u1A7C\\u1A7F-\\u1A89\\u1A90-\\u1A99\\u1AA7\\u1AB0-\\u1ABD\\u1B00-\\u1B4B\\u1B50-\\u1B59\\u1B6B-\\u1B73\\u1B80-\\u1BF3\\u1C00-\\u1C37\\u1C40-\\u1C49\\u1C4D-\\u1C7D\\u1CD0-\\u1CD2\\u1CD4-\\u1CF6\\u1CF8\\u1CF9\\u1D00-\\u1DF5\\u1DFC-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u200C\\u200D\\u203F\\u2040\\u2054\\u2071\\u207F\\u2090-\\u209C\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D7F-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2DE0-\\u2DFF\\u2E2F\\u3005-\\u3007\\u3021-\\u302F\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u3099\\u309A\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA62B\\uA640-\\uA66F\\uA674-\\uA67D\\uA67F-\\uA69D\\uA69F-\\uA6F1\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA7AD\\uA7B0\\uA7B1\\uA7F7-\\uA827\\uA840-\\uA873\\uA880-\\uA8C4\\uA8D0-\\uA8D9\\uA8E0-\\uA8F7\\uA8FB\\uA900-\\uA92D\\uA930-\\uA953\\uA960-\\uA97C\\uA980-\\uA9C0\\uA9CF-\\uA9D9\\uA9E0-\\uA9FE\\uAA00-\\uAA36\\uAA40-\\uAA4D\\uAA50-\\uAA59\\uAA60-\\uAA76\\uAA7A-\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEF\\uAAF2-\\uAAF6\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uAB30-\\uAB5A\\uAB5C-\\uAB5F\\uAB64\\uAB65\\uABC0-\\uABEA\\uABEC\\uABED\\uABF0-\\uABF9\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE00-\\uFE0F\\uFE20-\\uFE2D\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF10-\\uFF19\\uFF21-\\uFF3A\\uFF3F\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]");

  // Ensure the condition is true, otherwise throw an error.
  // This is only to have a better contract semantic, i.e. another safety net
  // to catch a logic error. The condition shall be fulfilled in normal case.
  // Do NOT use this to enforce a certain condition on any user input.

  function assert(condition, message) {
    /* istanbul ignore next */
    if (!condition) {
      throw new Error('ASSERT: ' + message);
    }
  }
  function isDecimalDigit(ch) {
    return ch >= 0x30 && ch <= 0x39; // 0..9
  }

  function isHexDigit(ch) {
    return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
  }
  function isOctalDigit(ch) {
    return '01234567'.indexOf(ch) >= 0;
  }

  // 7.2 White Space

  function isWhiteSpace(ch) {
    return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 || ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0;
  }

  // 7.3 Line Terminators

  function isLineTerminator(ch) {
    return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
  }

  // 7.6 Identifier Names and Identifiers

  function isIdentifierStart(ch) {
    return ch === 0x24 || ch === 0x5F ||
    // $ (dollar) and _ (underscore)
    ch >= 0x41 && ch <= 0x5A ||
    // A..Z
    ch >= 0x61 && ch <= 0x7A ||
    // a..z
    ch === 0x5C ||
    // \ (backslash)
    ch >= 0x80 && RegexNonAsciiIdentifierStart.test(String.fromCharCode(ch));
  }
  function isIdentifierPart(ch) {
    return ch === 0x24 || ch === 0x5F ||
    // $ (dollar) and _ (underscore)
    ch >= 0x41 && ch <= 0x5A ||
    // A..Z
    ch >= 0x61 && ch <= 0x7A ||
    // a..z
    ch >= 0x30 && ch <= 0x39 ||
    // 0..9
    ch === 0x5C ||
    // \ (backslash)
    ch >= 0x80 && RegexNonAsciiIdentifierPart.test(String.fromCharCode(ch));
  }

  // 7.6.1.1 Keywords

  var keywords = {
    'if': 1,
    'in': 1,
    'do': 1,
    'var': 1,
    'for': 1,
    'new': 1,
    'try': 1,
    'let': 1,
    'this': 1,
    'else': 1,
    'case': 1,
    'void': 1,
    'with': 1,
    'enum': 1,
    'while': 1,
    'break': 1,
    'catch': 1,
    'throw': 1,
    'const': 1,
    'yield': 1,
    'class': 1,
    'super': 1,
    'return': 1,
    'typeof': 1,
    'delete': 1,
    'switch': 1,
    'export': 1,
    'import': 1,
    'public': 1,
    'static': 1,
    'default': 1,
    'finally': 1,
    'extends': 1,
    'package': 1,
    'private': 1,
    'function': 1,
    'continue': 1,
    'debugger': 1,
    'interface': 1,
    'protected': 1,
    'instanceof': 1,
    'implements': 1
  };
  function skipComment() {
    while (index < length) {
      var ch = source.charCodeAt(index);
      if (isWhiteSpace(ch) || isLineTerminator(ch)) {
        ++index;
      } else {
        break;
      }
    }
  }
  function scanHexEscape(prefix) {
    var i,
      len,
      ch,
      code = 0;
    len = prefix === 'u' ? 4 : 2;
    for (i = 0; i < len; ++i) {
      if (index < length && isHexDigit(source[index])) {
        ch = source[index++];
        code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
      } else {
        throwError({}, MessageUnexpectedToken, ILLEGAL$1);
      }
    }
    return String.fromCharCode(code);
  }
  function scanUnicodeCodePointEscape() {
    var ch, code, cu1, cu2;
    ch = source[index];
    code = 0;

    // At least, one hex digit is required.
    if (ch === '}') {
      throwError({}, MessageUnexpectedToken, ILLEGAL$1);
    }
    while (index < length) {
      ch = source[index++];
      if (!isHexDigit(ch)) {
        break;
      }
      code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
    }
    if (code > 0x10FFFF || ch !== '}') {
      throwError({}, MessageUnexpectedToken, ILLEGAL$1);
    }

    // UTF-16 Encoding
    if (code <= 0xFFFF) {
      return String.fromCharCode(code);
    }
    cu1 = (code - 0x10000 >> 10) + 0xD800;
    cu2 = (code - 0x10000 & 1023) + 0xDC00;
    return String.fromCharCode(cu1, cu2);
  }
  function getEscapedIdentifier() {
    var ch, id;
    ch = source.charCodeAt(index++);
    id = String.fromCharCode(ch);

    // '\u' (U+005C, U+0075) denotes an escaped character.
    if (ch === 0x5C) {
      if (source.charCodeAt(index) !== 0x75) {
        throwError({}, MessageUnexpectedToken, ILLEGAL$1);
      }
      ++index;
      ch = scanHexEscape('u');
      if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
        throwError({}, MessageUnexpectedToken, ILLEGAL$1);
      }
      id = ch;
    }
    while (index < length) {
      ch = source.charCodeAt(index);
      if (!isIdentifierPart(ch)) {
        break;
      }
      ++index;
      id += String.fromCharCode(ch);

      // '\u' (U+005C, U+0075) denotes an escaped character.
      if (ch === 0x5C) {
        id = id.substr(0, id.length - 1);
        if (source.charCodeAt(index) !== 0x75) {
          throwError({}, MessageUnexpectedToken, ILLEGAL$1);
        }
        ++index;
        ch = scanHexEscape('u');
        if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
          throwError({}, MessageUnexpectedToken, ILLEGAL$1);
        }
        id += ch;
      }
    }
    return id;
  }
  function getIdentifier() {
    var start, ch;
    start = index++;
    while (index < length) {
      ch = source.charCodeAt(index);
      if (ch === 0x5C) {
        // Blackslash (U+005C) marks Unicode escape sequence.
        index = start;
        return getEscapedIdentifier();
      }
      if (isIdentifierPart(ch)) {
        ++index;
      } else {
        break;
      }
    }
    return source.slice(start, index);
  }
  function scanIdentifier() {
    var start, id, type;
    start = index;

    // Backslash (U+005C) starts an escaped character.
    id = source.charCodeAt(index) === 0x5C ? getEscapedIdentifier() : getIdentifier();

    // There is no keyword or literal with only one character.
    // Thus, it must be an identifier.
    if (id.length === 1) {
      type = TokenIdentifier;
    } else if (keywords.hasOwnProperty(id)) {
      // eslint-disable-line no-prototype-builtins
      type = TokenKeyword;
    } else if (id === 'null') {
      type = TokenNullLiteral;
    } else if (id === 'true' || id === 'false') {
      type = TokenBooleanLiteral;
    } else {
      type = TokenIdentifier;
    }
    return {
      type: type,
      value: id,
      start: start,
      end: index
    };
  }

  // 7.7 Punctuators

  function scanPunctuator() {
    var start = index,
      code = source.charCodeAt(index),
      code2,
      ch1 = source[index],
      ch2,
      ch3,
      ch4;
    switch (code) {
      // Check for most common single-character punctuators.
      case 0x2E: // . dot
      case 0x28: // ( open bracket
      case 0x29: // ) close bracket
      case 0x3B: // ; semicolon
      case 0x2C: // , comma
      case 0x7B: // { open curly brace
      case 0x7D: // } close curly brace
      case 0x5B: // [
      case 0x5D: // ]
      case 0x3A: // :
      case 0x3F: // ?
      case 0x7E:
        // ~
        ++index;
        return {
          type: TokenPunctuator,
          value: String.fromCharCode(code),
          start: start,
          end: index
        };
      default:
        code2 = source.charCodeAt(index + 1);

        // '=' (U+003D) marks an assignment or comparison operator.
        if (code2 === 0x3D) {
          switch (code) {
            case 0x2B: // +
            case 0x2D: // -
            case 0x2F: // /
            case 0x3C: // <
            case 0x3E: // >
            case 0x5E: // ^
            case 0x7C: // |
            case 0x25: // %
            case 0x26: // &
            case 0x2A:
              // *
              index += 2;
              return {
                type: TokenPunctuator,
                value: String.fromCharCode(code) + String.fromCharCode(code2),
                start: start,
                end: index
              };
            case 0x21: // !
            case 0x3D:
              // =
              index += 2;

              // !== and ===
              if (source.charCodeAt(index) === 0x3D) {
                ++index;
              }
              return {
                type: TokenPunctuator,
                value: source.slice(start, index),
                start: start,
                end: index
              };
          }
        }
    }

    // 4-character punctuator: >>>=

    ch4 = source.substr(index, 4);
    if (ch4 === '>>>=') {
      index += 4;
      return {
        type: TokenPunctuator,
        value: ch4,
        start: start,
        end: index
      };
    }

    // 3-character punctuators: === !== >>> <<= >>=

    ch3 = ch4.substr(0, 3);
    if (ch3 === '>>>' || ch3 === '<<=' || ch3 === '>>=') {
      index += 3;
      return {
        type: TokenPunctuator,
        value: ch3,
        start: start,
        end: index
      };
    }

    // Other 2-character punctuators: ++ -- << >> && ||
    ch2 = ch3.substr(0, 2);
    if (ch1 === ch2[1] && '+-<>&|'.indexOf(ch1) >= 0 || ch2 === '=>') {
      index += 2;
      return {
        type: TokenPunctuator,
        value: ch2,
        start: start,
        end: index
      };
    }
    if (ch2 === '//') {
      throwError({}, MessageUnexpectedToken, ILLEGAL$1);
    }

    // 1-character punctuators: < > = ! + - * % & | ^ /

    if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
      ++index;
      return {
        type: TokenPunctuator,
        value: ch1,
        start: start,
        end: index
      };
    }
    throwError({}, MessageUnexpectedToken, ILLEGAL$1);
  }

  // 7.8.3 Numeric Literals

  function scanHexLiteral(start) {
    var number = '';
    while (index < length) {
      if (!isHexDigit(source[index])) {
        break;
      }
      number += source[index++];
    }
    if (number.length === 0) {
      throwError({}, MessageUnexpectedToken, ILLEGAL$1);
    }
    if (isIdentifierStart(source.charCodeAt(index))) {
      throwError({}, MessageUnexpectedToken, ILLEGAL$1);
    }
    return {
      type: TokenNumericLiteral,
      value: parseInt('0x' + number, 16),
      start: start,
      end: index
    };
  }
  function scanOctalLiteral(start) {
    var number = '0' + source[index++];
    while (index < length) {
      if (!isOctalDigit(source[index])) {
        break;
      }
      number += source[index++];
    }
    if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
      throwError({}, MessageUnexpectedToken, ILLEGAL$1);
    }
    return {
      type: TokenNumericLiteral,
      value: parseInt(number, 8),
      octal: true,
      start: start,
      end: index
    };
  }
  function scanNumericLiteral() {
    var number, start, ch;
    ch = source[index];
    assert(isDecimalDigit(ch.charCodeAt(0)) || ch === '.', 'Numeric literal must start with a decimal digit or a decimal point');
    start = index;
    number = '';
    if (ch !== '.') {
      number = source[index++];
      ch = source[index];

      // Hex number starts with '0x'.
      // Octal number starts with '0'.
      if (number === '0') {
        if (ch === 'x' || ch === 'X') {
          ++index;
          return scanHexLiteral(start);
        }
        if (isOctalDigit(ch)) {
          return scanOctalLiteral(start);
        }

        // decimal number starts with '0' such as '09' is illegal.
        if (ch && isDecimalDigit(ch.charCodeAt(0))) {
          throwError({}, MessageUnexpectedToken, ILLEGAL$1);
        }
      }
      while (isDecimalDigit(source.charCodeAt(index))) {
        number += source[index++];
      }
      ch = source[index];
    }
    if (ch === '.') {
      number += source[index++];
      while (isDecimalDigit(source.charCodeAt(index))) {
        number += source[index++];
      }
      ch = source[index];
    }
    if (ch === 'e' || ch === 'E') {
      number += source[index++];
      ch = source[index];
      if (ch === '+' || ch === '-') {
        number += source[index++];
      }
      if (isDecimalDigit(source.charCodeAt(index))) {
        while (isDecimalDigit(source.charCodeAt(index))) {
          number += source[index++];
        }
      } else {
        throwError({}, MessageUnexpectedToken, ILLEGAL$1);
      }
    }
    if (isIdentifierStart(source.charCodeAt(index))) {
      throwError({}, MessageUnexpectedToken, ILLEGAL$1);
    }
    return {
      type: TokenNumericLiteral,
      value: parseFloat(number),
      start: start,
      end: index
    };
  }

  // 7.8.4 String Literals

  function scanStringLiteral() {
    var str = '',
      quote,
      start,
      ch,
      code,
      octal = false;
    quote = source[index];
    assert(quote === '\'' || quote === '"', 'String literal must starts with a quote');
    start = index;
    ++index;
    while (index < length) {
      ch = source[index++];
      if (ch === quote) {
        quote = '';
        break;
      } else if (ch === '\\') {
        ch = source[index++];
        if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
          switch (ch) {
            case 'u':
            case 'x':
              if (source[index] === '{') {
                ++index;
                str += scanUnicodeCodePointEscape();
              } else {
                str += scanHexEscape(ch);
              }
              break;
            case 'n':
              str += '\n';
              break;
            case 'r':
              str += '\r';
              break;
            case 't':
              str += '\t';
              break;
            case 'b':
              str += '\b';
              break;
            case 'f':
              str += '\f';
              break;
            case 'v':
              str += '\x0B';
              break;
            default:
              if (isOctalDigit(ch)) {
                code = '01234567'.indexOf(ch);

                // \0 is not octal escape sequence
                if (code !== 0) {
                  octal = true;
                }
                if (index < length && isOctalDigit(source[index])) {
                  octal = true;
                  code = code * 8 + '01234567'.indexOf(source[index++]);

                  // 3 digits are only allowed when string starts
                  // with 0, 1, 2, 3
                  if ('0123'.indexOf(ch) >= 0 && index < length && isOctalDigit(source[index])) {
                    code = code * 8 + '01234567'.indexOf(source[index++]);
                  }
                }
                str += String.fromCharCode(code);
              } else {
                str += ch;
              }
              break;
          }
        } else {
          if (ch === '\r' && source[index] === '\n') {
            ++index;
          }
        }
      } else if (isLineTerminator(ch.charCodeAt(0))) {
        break;
      } else {
        str += ch;
      }
    }
    if (quote !== '') {
      throwError({}, MessageUnexpectedToken, ILLEGAL$1);
    }
    return {
      type: TokenStringLiteral,
      value: str,
      octal: octal,
      start: start,
      end: index
    };
  }
  function testRegExp(pattern, flags) {
    var tmp = pattern;
    if (flags.indexOf('u') >= 0) {
      // Replace each astral symbol and every Unicode code point
      // escape sequence with a single ASCII symbol to avoid throwing on
      // regular expressions that are only valid in combination with the
      // `/u` flag.
      // Note: replacing with the ASCII symbol `x` might cause false
      // negatives in unlikely scenarios. For example, `[\u{61}-b]` is a
      // perfectly valid pattern that is equivalent to `[a-b]`, but it
      // would be replaced by `[x-b]` which throws an error.
      tmp = tmp.replace(/\\u\{([0-9a-fA-F]+)\}/g, function ($0, $1) {
        if (parseInt($1, 16) <= 0x10FFFF) {
          return 'x';
        }
        throwError({}, MessageInvalidRegExp);
      }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, 'x');
    }

    // First, detect invalid regular expressions.
    try {
      new RegExp(tmp);
    } catch (e) {
      throwError({}, MessageInvalidRegExp);
    }

    // Return a regular expression object for this pattern-flag pair, or
    // `null` in case the current environment doesn't support the flags it
    // uses.
    try {
      return new RegExp(pattern, flags);
    } catch (exception) {
      return null;
    }
  }
  function scanRegExpBody() {
    var ch, str, classMarker, terminated, body;
    ch = source[index];
    assert(ch === '/', 'Regular expression literal must start with a slash');
    str = source[index++];
    classMarker = false;
    terminated = false;
    while (index < length) {
      ch = source[index++];
      str += ch;
      if (ch === '\\') {
        ch = source[index++];
        // ECMA-262 7.8.5
        if (isLineTerminator(ch.charCodeAt(0))) {
          throwError({}, MessageUnterminatedRegExp);
        }
        str += ch;
      } else if (isLineTerminator(ch.charCodeAt(0))) {
        throwError({}, MessageUnterminatedRegExp);
      } else if (classMarker) {
        if (ch === ']') {
          classMarker = false;
        }
      } else {
        if (ch === '/') {
          terminated = true;
          break;
        } else if (ch === '[') {
          classMarker = true;
        }
      }
    }
    if (!terminated) {
      throwError({}, MessageUnterminatedRegExp);
    }

    // Exclude leading and trailing slash.
    body = str.substr(1, str.length - 2);
    return {
      value: body,
      literal: str
    };
  }
  function scanRegExpFlags() {
    var ch, str, flags;
    str = '';
    flags = '';
    while (index < length) {
      ch = source[index];
      if (!isIdentifierPart(ch.charCodeAt(0))) {
        break;
      }
      ++index;
      if (ch === '\\' && index < length) {
        throwError({}, MessageUnexpectedToken, ILLEGAL$1);
      } else {
        flags += ch;
        str += ch;
      }
    }
    if (flags.search(/[^gimuy]/g) >= 0) {
      throwError({}, MessageInvalidRegExp, flags);
    }
    return {
      value: flags,
      literal: str
    };
  }
  function scanRegExp() {
    var start, body, flags, value;
    lookahead = null;
    skipComment();
    start = index;
    body = scanRegExpBody();
    flags = scanRegExpFlags();
    value = testRegExp(body.value, flags.value);
    return {
      literal: body.literal + flags.literal,
      value: value,
      regex: {
        pattern: body.value,
        flags: flags.value
      },
      start: start,
      end: index
    };
  }
  function isIdentifierName(token) {
    return token.type === TokenIdentifier || token.type === TokenKeyword || token.type === TokenBooleanLiteral || token.type === TokenNullLiteral;
  }
  function advance() {
    skipComment();
    if (index >= length) {
      return {
        type: TokenEOF,
        start: index,
        end: index
      };
    }
    var ch = source.charCodeAt(index);
    if (isIdentifierStart(ch)) {
      return scanIdentifier();
    }

    // Very common: ( and ) and ;
    if (ch === 0x28 || ch === 0x29 || ch === 0x3B) {
      return scanPunctuator();
    }

    // String literal starts with single quote (U+0027) or double quote (U+0022).
    if (ch === 0x27 || ch === 0x22) {
      return scanStringLiteral();
    }

    // Dot (.) U+002E can also start a floating-point number, hence the need
    // to check the next character.
    if (ch === 0x2E) {
      if (isDecimalDigit(source.charCodeAt(index + 1))) {
        return scanNumericLiteral();
      }
      return scanPunctuator();
    }
    if (isDecimalDigit(ch)) {
      return scanNumericLiteral();
    }
    return scanPunctuator();
  }
  function lex() {
    var token = lookahead;
    index = token.end;
    lookahead = advance();
    index = token.end;
    return token;
  }
  function peek() {
    var pos = index;
    lookahead = advance();
    index = pos;
  }
  function finishArrayExpression(elements) {
    var node = new ASTNode(SyntaxArrayExpression);
    node.elements = elements;
    return node;
  }
  function finishBinaryExpression(operator, left, right) {
    var node = new ASTNode(operator === '||' || operator === '&&' ? SyntaxLogicalExpression : SyntaxBinaryExpression);
    node.operator = operator;
    node.left = left;
    node.right = right;
    return node;
  }
  function finishCallExpression(callee, args) {
    var node = new ASTNode(SyntaxCallExpression);
    node.callee = callee;
    node.arguments = args;
    return node;
  }
  function finishConditionalExpression(test, consequent, alternate) {
    var node = new ASTNode(SyntaxConditionalExpression);
    node.test = test;
    node.consequent = consequent;
    node.alternate = alternate;
    return node;
  }
  function finishIdentifier(name) {
    var node = new ASTNode(SyntaxIdentifier);
    node.name = name;
    return node;
  }
  function finishLiteral(token) {
    var node = new ASTNode(SyntaxLiteral);
    node.value = token.value;
    node.raw = source.slice(token.start, token.end);
    if (token.regex) {
      if (node.raw === '//') {
        node.raw = '/(?:)/';
      }
      node.regex = token.regex;
    }
    return node;
  }
  function finishMemberExpression(accessor, object, property) {
    var node = new ASTNode(SyntaxMemberExpression);
    node.computed = accessor === '[';
    node.object = object;
    node.property = property;
    if (!node.computed) property.member = true;
    return node;
  }
  function finishObjectExpression(properties) {
    var node = new ASTNode(SyntaxObjectExpression);
    node.properties = properties;
    return node;
  }
  function finishProperty(kind, key, value) {
    var node = new ASTNode(SyntaxProperty);
    node.key = key;
    node.value = value;
    node.kind = kind;
    return node;
  }
  function finishUnaryExpression(operator, argument) {
    var node = new ASTNode(SyntaxUnaryExpression);
    node.operator = operator;
    node.argument = argument;
    node.prefix = true;
    return node;
  }

  // Throw an exception

  function throwError(token, messageFormat) {
    var error,
      args = Array.prototype.slice.call(arguments, 2),
      msg = messageFormat.replace(/%(\d)/g, function (whole, index) {
        assert(index < args.length, 'Message reference must be in range');
        return args[index];
      });
    error = new Error(msg);
    error.index = index;
    error.description = msg;
    throw error;
  }

  // Throw an exception because of the token.

  function throwUnexpected(token) {
    if (token.type === TokenEOF) {
      throwError(token, MessageUnexpectedEOS);
    }
    if (token.type === TokenNumericLiteral) {
      throwError(token, MessageUnexpectedNumber);
    }
    if (token.type === TokenStringLiteral) {
      throwError(token, MessageUnexpectedString);
    }
    if (token.type === TokenIdentifier) {
      throwError(token, MessageUnexpectedIdentifier);
    }
    if (token.type === TokenKeyword) {
      throwError(token, MessageUnexpectedReserved);
    }

    // BooleanLiteral, NullLiteral, or Punctuator.
    throwError(token, MessageUnexpectedToken, token.value);
  }

  // Expect the next token to match the specified punctuator.
  // If not, an exception will be thrown.

  function expect(value) {
    var token = lex();
    if (token.type !== TokenPunctuator || token.value !== value) {
      throwUnexpected(token);
    }
  }

  // Return true if the next token matches the specified punctuator.

  function match(value) {
    return lookahead.type === TokenPunctuator && lookahead.value === value;
  }

  // Return true if the next token matches the specified keyword

  function matchKeyword(keyword) {
    return lookahead.type === TokenKeyword && lookahead.value === keyword;
  }

  // 11.1.4 Array Initialiser

  function parseArrayInitialiser() {
    var elements = [];
    index = lookahead.start;
    expect('[');
    while (!match(']')) {
      if (match(',')) {
        lex();
        elements.push(null);
      } else {
        elements.push(parseConditionalExpression());
        if (!match(']')) {
          expect(',');
        }
      }
    }
    lex();
    return finishArrayExpression(elements);
  }

  // 11.1.5 Object Initialiser

  function parseObjectPropertyKey() {
    index = lookahead.start;
    var token = lex();

    // Note: This function is called only from parseObjectProperty(), where
    // EOF and Punctuator tokens are already filtered out.

    if (token.type === TokenStringLiteral || token.type === TokenNumericLiteral) {
      if (token.octal) {
        throwError(token, MessageStrictOctalLiteral);
      }
      return finishLiteral(token);
    }
    return finishIdentifier(token.value);
  }
  function parseObjectProperty() {
    var token, key, id, value;
    index = lookahead.start;
    token = lookahead;
    if (token.type === TokenIdentifier) {
      id = parseObjectPropertyKey();
      expect(':');
      value = parseConditionalExpression();
      return finishProperty('init', id, value);
    }
    if (token.type === TokenEOF || token.type === TokenPunctuator) {
      throwUnexpected(token);
    } else {
      key = parseObjectPropertyKey();
      expect(':');
      value = parseConditionalExpression();
      return finishProperty('init', key, value);
    }
  }
  function parseObjectInitialiser() {
    var properties = [],
      property,
      name,
      key,
      map = {},
      toString = String;
    index = lookahead.start;
    expect('{');
    while (!match('}')) {
      property = parseObjectProperty();
      if (property.key.type === SyntaxIdentifier) {
        name = property.key.name;
      } else {
        name = toString(property.key.value);
      }
      key = '$' + name;
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        throwError({}, MessageStrictDuplicateProperty);
      } else {
        map[key] = true;
      }
      properties.push(property);
      if (!match('}')) {
        expect(',');
      }
    }
    expect('}');
    return finishObjectExpression(properties);
  }

  // 11.1.6 The Grouping Operator

  function parseGroupExpression() {
    expect('(');
    var expr = parseExpression();
    expect(')');
    return expr;
  }

  // 11.1 Primary Expressions

  var legalKeywords = {
    'if': 1
  };
  function parsePrimaryExpression() {
    var type, token, expr;
    if (match('(')) {
      return parseGroupExpression();
    }
    if (match('[')) {
      return parseArrayInitialiser();
    }
    if (match('{')) {
      return parseObjectInitialiser();
    }
    type = lookahead.type;
    index = lookahead.start;
    if (type === TokenIdentifier || legalKeywords[lookahead.value]) {
      expr = finishIdentifier(lex().value);
    } else if (type === TokenStringLiteral || type === TokenNumericLiteral) {
      if (lookahead.octal) {
        throwError(lookahead, MessageStrictOctalLiteral);
      }
      expr = finishLiteral(lex());
    } else if (type === TokenKeyword) {
      throw new Error(DISABLED);
    } else if (type === TokenBooleanLiteral) {
      token = lex();
      token.value = token.value === 'true';
      expr = finishLiteral(token);
    } else if (type === TokenNullLiteral) {
      token = lex();
      token.value = null;
      expr = finishLiteral(token);
    } else if (match('/') || match('/=')) {
      expr = finishLiteral(scanRegExp());
      peek();
    } else {
      throwUnexpected(lex());
    }
    return expr;
  }

  // 11.2 Left-Hand-Side Expressions

  function parseArguments() {
    var args = [];
    expect('(');
    if (!match(')')) {
      while (index < length) {
        args.push(parseConditionalExpression());
        if (match(')')) {
          break;
        }
        expect(',');
      }
    }
    expect(')');
    return args;
  }
  function parseNonComputedProperty() {
    index = lookahead.start;
    var token = lex();
    if (!isIdentifierName(token)) {
      throwUnexpected(token);
    }
    return finishIdentifier(token.value);
  }
  function parseNonComputedMember() {
    expect('.');
    return parseNonComputedProperty();
  }
  function parseComputedMember() {
    expect('[');
    var expr = parseExpression();
    expect(']');
    return expr;
  }
  function parseLeftHandSideExpressionAllowCall() {
    var expr, args, property;
    expr = parsePrimaryExpression();
    for (;;) {
      if (match('.')) {
        property = parseNonComputedMember();
        expr = finishMemberExpression('.', expr, property);
      } else if (match('(')) {
        args = parseArguments();
        expr = finishCallExpression(expr, args);
      } else if (match('[')) {
        property = parseComputedMember();
        expr = finishMemberExpression('[', expr, property);
      } else {
        break;
      }
    }
    return expr;
  }

  // 11.3 Postfix Expressions

  function parsePostfixExpression() {
    var expr = parseLeftHandSideExpressionAllowCall();
    if (lookahead.type === TokenPunctuator) {
      if (match('++') || match('--')) {
        throw new Error(DISABLED);
      }
    }
    return expr;
  }

  // 11.4 Unary Operators

  function parseUnaryExpression() {
    var token, expr;
    if (lookahead.type !== TokenPunctuator && lookahead.type !== TokenKeyword) {
      expr = parsePostfixExpression();
    } else if (match('++') || match('--')) {
      throw new Error(DISABLED);
    } else if (match('+') || match('-') || match('~') || match('!')) {
      token = lex();
      expr = parseUnaryExpression();
      expr = finishUnaryExpression(token.value, expr);
    } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
      throw new Error(DISABLED);
    } else {
      expr = parsePostfixExpression();
    }
    return expr;
  }
  function binaryPrecedence(token) {
    var prec = 0;
    if (token.type !== TokenPunctuator && token.type !== TokenKeyword) {
      return 0;
    }
    switch (token.value) {
      case '||':
        prec = 1;
        break;
      case '&&':
        prec = 2;
        break;
      case '|':
        prec = 3;
        break;
      case '^':
        prec = 4;
        break;
      case '&':
        prec = 5;
        break;
      case '==':
      case '!=':
      case '===':
      case '!==':
        prec = 6;
        break;
      case '<':
      case '>':
      case '<=':
      case '>=':
      case 'instanceof':
      case 'in':
        prec = 7;
        break;
      case '<<':
      case '>>':
      case '>>>':
        prec = 8;
        break;
      case '+':
      case '-':
        prec = 9;
        break;
      case '*':
      case '/':
      case '%':
        prec = 11;
        break;
    }
    return prec;
  }

  // 11.5 Multiplicative Operators
  // 11.6 Additive Operators
  // 11.7 Bitwise Shift Operators
  // 11.8 Relational Operators
  // 11.9 Equality Operators
  // 11.10 Binary Bitwise Operators
  // 11.11 Binary Logical Operators

  function parseBinaryExpression() {
    var marker, markers, expr, token, prec, stack, right, operator, left, i;
    marker = lookahead;
    left = parseUnaryExpression();
    token = lookahead;
    prec = binaryPrecedence(token);
    if (prec === 0) {
      return left;
    }
    token.prec = prec;
    lex();
    markers = [marker, lookahead];
    right = parseUnaryExpression();
    stack = [left, token, right];
    while ((prec = binaryPrecedence(lookahead)) > 0) {
      // Reduce: make a binary expression from the three topmost entries.
      while (stack.length > 2 && prec <= stack[stack.length - 2].prec) {
        right = stack.pop();
        operator = stack.pop().value;
        left = stack.pop();
        markers.pop();
        expr = finishBinaryExpression(operator, left, right);
        stack.push(expr);
      }

      // Shift.
      token = lex();
      token.prec = prec;
      stack.push(token);
      markers.push(lookahead);
      expr = parseUnaryExpression();
      stack.push(expr);
    }

    // Final reduce to clean-up the stack.
    i = stack.length - 1;
    expr = stack[i];
    markers.pop();
    while (i > 1) {
      markers.pop();
      expr = finishBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
      i -= 2;
    }
    return expr;
  }

  // 11.12 Conditional Operator

  function parseConditionalExpression() {
    var expr, consequent, alternate;
    expr = parseBinaryExpression();
    if (match('?')) {
      lex();
      consequent = parseConditionalExpression();
      expect(':');
      alternate = parseConditionalExpression();
      expr = finishConditionalExpression(expr, consequent, alternate);
    }
    return expr;
  }

  // 11.14 Comma Operator

  function parseExpression() {
    var expr = parseConditionalExpression();
    if (match(',')) {
      throw new Error(DISABLED); // no sequence expressions
    }

    return expr;
  }
  function parser$1(code) {
    source = code;
    index = 0;
    length = source.length;
    lookahead = null;
    peek();
    var expr = parseExpression();
    if (lookahead.type !== TokenEOF) {
      throw new Error('Unexpect token after expression.');
    }
    return expr;
  }
  var Constants = {
    NaN: 'NaN',
    E: 'Math.E',
    LN2: 'Math.LN2',
    LN10: 'Math.LN10',
    LOG2E: 'Math.LOG2E',
    LOG10E: 'Math.LOG10E',
    PI: 'Math.PI',
    SQRT1_2: 'Math.SQRT1_2',
    SQRT2: 'Math.SQRT2',
    MIN_VALUE: 'Number.MIN_VALUE',
    MAX_VALUE: 'Number.MAX_VALUE'
  };
  function Functions(codegen) {
    function fncall(name, args, cast, type) {
      var obj = codegen(args[0]);
      if (cast) {
        obj = cast + '(' + obj + ')';
        if (cast.lastIndexOf('new ', 0) === 0) obj = '(' + obj + ')';
      }
      return obj + '.' + name + (type < 0 ? '' : type === 0 ? '()' : '(' + args.slice(1).map(codegen).join(',') + ')');
    }
    function fn(name, cast, type) {
      return function (args) {
        return fncall(name, args, cast, type);
      };
    }
    var DATE = 'new Date',
      STRING = 'String',
      REGEXP = 'RegExp';
    return {
      // MATH functions
      isNaN: 'Number.isNaN',
      isFinite: 'Number.isFinite',
      abs: 'Math.abs',
      acos: 'Math.acos',
      asin: 'Math.asin',
      atan: 'Math.atan',
      atan2: 'Math.atan2',
      ceil: 'Math.ceil',
      cos: 'Math.cos',
      exp: 'Math.exp',
      floor: 'Math.floor',
      hypot: 'Math.hypot',
      log: 'Math.log',
      max: 'Math.max',
      min: 'Math.min',
      pow: 'Math.pow',
      random: 'Math.random',
      round: 'Math.round',
      sin: 'Math.sin',
      sqrt: 'Math.sqrt',
      tan: 'Math.tan',
      clamp: function clamp(args) {
        if (args.length < 3) error('Missing arguments to clamp function.');
        if (args.length > 3) error('Too many arguments to clamp function.');
        var a = args.map(codegen);
        return 'Math.max(' + a[1] + ', Math.min(' + a[2] + ',' + a[0] + '))';
      },
      // DATE functions
      now: 'Date.now',
      utc: 'Date.UTC',
      datetime: DATE,
      date: fn('getDate', DATE, 0),
      day: fn('getDay', DATE, 0),
      year: fn('getFullYear', DATE, 0),
      month: fn('getMonth', DATE, 0),
      hours: fn('getHours', DATE, 0),
      minutes: fn('getMinutes', DATE, 0),
      seconds: fn('getSeconds', DATE, 0),
      milliseconds: fn('getMilliseconds', DATE, 0),
      time: fn('getTime', DATE, 0),
      timezoneoffset: fn('getTimezoneOffset', DATE, 0),
      utcdate: fn('getUTCDate', DATE, 0),
      utcday: fn('getUTCDay', DATE, 0),
      utcyear: fn('getUTCFullYear', DATE, 0),
      utcmonth: fn('getUTCMonth', DATE, 0),
      utchours: fn('getUTCHours', DATE, 0),
      utcminutes: fn('getUTCMinutes', DATE, 0),
      utcseconds: fn('getUTCSeconds', DATE, 0),
      utcmilliseconds: fn('getUTCMilliseconds', DATE, 0),
      // sequence functions
      length: fn('length', null, -1),
      // STRING functions
      parseFloat: 'parseFloat',
      parseInt: 'parseInt',
      upper: fn('toUpperCase', STRING, 0),
      lower: fn('toLowerCase', STRING, 0),
      substring: fn('substring', STRING),
      split: fn('split', STRING),
      trim: fn('trim', STRING, 0),
      // REGEXP functions
      regexp: REGEXP,
      test: fn('test', REGEXP),
      // Control Flow functions
      if: function _if(args) {
        if (args.length < 3) error('Missing arguments to if function.');
        if (args.length > 3) error('Too many arguments to if function.');
        var a = args.map(codegen);
        return '(' + a[0] + '?' + a[1] + ':' + a[2] + ')';
      }
    };
  }
  function stripQuotes(s) {
    var n = s && s.length - 1;
    return n && (s[0] === '"' && s[n] === '"' || s[0] === '\'' && s[n] === '\'') ? s.slice(1, -1) : s;
  }
  function codegen(opt) {
    opt = opt || {};
    var allowed = opt.allowed ? toSet(opt.allowed) : {},
      forbidden = opt.forbidden ? toSet(opt.forbidden) : {},
      constants = opt.constants || Constants,
      functions = (opt.functions || Functions)(visit),
      globalvar = opt.globalvar,
      fieldvar = opt.fieldvar,
      outputGlobal = isFunction(globalvar) ? globalvar : function (id) {
        return "".concat(globalvar, "[\"").concat(id, "\"]");
      };
    var globals = {},
      fields = {},
      memberDepth = 0;
    function visit(ast) {
      if (isString(ast)) return ast;
      var generator = Generators[ast.type];
      if (generator == null) error('Unsupported type: ' + ast.type);
      return generator(ast);
    }
    var Generators = {
      Literal: function Literal(n) {
        return n.raw;
      },
      Identifier: function Identifier(n) {
        var id = n.name;
        if (memberDepth > 0) {
          return id;
        } else if (_has(forbidden, id)) {
          return error('Illegal identifier: ' + id);
        } else if (_has(constants, id)) {
          return constants[id];
        } else if (_has(allowed, id)) {
          return id;
        } else {
          globals[id] = 1;
          return outputGlobal(id);
        }
      },
      MemberExpression: function MemberExpression(n) {
        var d = !n.computed,
          o = visit(n.object);
        if (d) memberDepth += 1;
        var p = visit(n.property);
        if (o === fieldvar) {
          // strip quotes to sanitize field name (#1653)
          fields[stripQuotes(p)] = 1;
        }
        if (d) memberDepth -= 1;
        return o + (d ? '.' + p : '[' + p + ']');
      },
      CallExpression: function CallExpression(n) {
        if (n.callee.type !== 'Identifier') {
          error('Illegal callee type: ' + n.callee.type);
        }
        var callee = n.callee.name,
          args = n.arguments,
          fn = _has(functions, callee) && functions[callee];
        if (!fn) error('Unrecognized function: ' + callee);
        return isFunction(fn) ? fn(args) : fn + '(' + args.map(visit).join(',') + ')';
      },
      ArrayExpression: function ArrayExpression(n) {
        return '[' + n.elements.map(visit).join(',') + ']';
      },
      BinaryExpression: function BinaryExpression(n) {
        return '(' + visit(n.left) + ' ' + n.operator + ' ' + visit(n.right) + ')';
      },
      UnaryExpression: function UnaryExpression(n) {
        return '(' + n.operator + visit(n.argument) + ')';
      },
      ConditionalExpression: function ConditionalExpression(n) {
        return '(' + visit(n.test) + '?' + visit(n.consequent) + ':' + visit(n.alternate) + ')';
      },
      LogicalExpression: function LogicalExpression(n) {
        return '(' + visit(n.left) + n.operator + visit(n.right) + ')';
      },
      ObjectExpression: function ObjectExpression(n) {
        return '{' + n.properties.map(visit).join(',') + '}';
      },
      Property: function Property(n) {
        memberDepth += 1;
        var k = visit(n.key);
        memberDepth -= 1;
        return k + ':' + visit(n.value);
      }
    };
    function codegen(ast) {
      var result = {
        code: visit(ast),
        globals: Object.keys(globals),
        fields: Object.keys(fields)
      };
      globals = {};
      fields = {};
      return result;
    }
    codegen.functions = functions;
    codegen.constants = constants;
    return codegen;
  }

  var _ops;
  var Intersect = 'intersect';
  var Union = 'union';
  var VlMulti = 'vlMulti';
  var VlPoint = 'vlPoint';
  var Or = 'or';
  var And = 'and';
  var SelectionId = '_vgsid_';
  var $selectionId = field$1(SelectionId);
  var TYPE_ENUM = 'E',
    TYPE_RANGE_INC = 'R',
    TYPE_RANGE_EXC = 'R-E',
    TYPE_RANGE_LE = 'R-LE',
    TYPE_RANGE_RE = 'R-RE',
    UNIT_INDEX = 'index:unit';

  // TODO: revisit date coercion?
  function testPoint(datum, entry) {
    var fields = entry.fields,
      values = entry.values,
      n = fields.length,
      i = 0,
      dval,
      f;
    for (; i < n; ++i) {
      f = fields[i];
      f.getter = field$1.getter || field$1(f.field);
      dval = f.getter(datum);
      if (isDate$1(dval)) dval = toNumber(dval);
      if (isDate$1(values[i])) values[i] = toNumber(values[i]);
      if (isDate$1(values[i][0])) values[i] = values[i].map(toNumber);
      if (f.type === TYPE_ENUM) {
        // Enumerated fields can either specify individual values (single/multi selections)
        // or an array of values (interval selections).
        if (isArray(values[i]) ? values[i].indexOf(dval) < 0 : dval !== values[i]) {
          return false;
        }
      } else {
        if (f.type === TYPE_RANGE_INC) {
          if (!inrange(dval, values[i])) return false;
        } else if (f.type === TYPE_RANGE_RE) {
          // Discrete selection of bins test within the range [bin_start, bin_end).
          if (!inrange(dval, values[i], true, false)) return false;
        } else if (f.type === TYPE_RANGE_EXC) {
          // 'R-E'/'R-LE' included for completeness.
          if (!inrange(dval, values[i], false, false)) return false;
        } else if (f.type === TYPE_RANGE_LE) {
          if (!inrange(dval, values[i], false, true)) return false;
        }
      }
    }
    return true;
  }

  /**
   * Tests if a tuple is contained within an interactive selection.
   * @param {string} name - The name of the data set representing the selection.
   *  Tuples in the dataset are of the form
   *  {unit: string, fields: array<fielddef>, values: array<*>}.
   *  Fielddef is of the form
   *  {field: string, channel: string, type: 'E' | 'R'} where
   *  'type' identifies whether tuples in the dataset enumerate
   *  values for the field, or specify a continuous range.
   * @param {object} datum - The tuple to test for inclusion.
   * @param {string} op - The set operation for combining selections.
   *   One of 'intersect' or 'union' (default).
   * @return {boolean} - True if the datum is in the selection, false otherwise.
   */
  function selectionTest(name, datum, op) {
    var data = this.context.data[name],
      entries = data ? data.values.value : [],
      unitIdx = data ? data[UNIT_INDEX] && data[UNIT_INDEX].value : undefined,
      intersect = op === Intersect,
      n = entries.length,
      i = 0,
      entry,
      miss,
      count,
      unit,
      b;
    for (; i < n; ++i) {
      entry = entries[i];
      if (unitIdx && intersect) {
        // multi selections union within the same unit and intersect across units.
        miss = miss || {};
        count = miss[unit = entry.unit] || 0;

        // if we've already matched this unit, skip.
        if (count === -1) continue;
        b = testPoint(datum, entry);
        miss[unit] = b ? -1 : ++count;

        // if we match and there are no other units return true
        // if we've missed against all tuples in this unit return false
        if (b && unitIdx.size === 1) return true;
        if (!b && count === unitIdx.get(unit).count) return false;
      } else {
        b = testPoint(datum, entry);

        // if we find a miss and we do require intersection return false
        // if we find a match and we don't require intersection return true
        if (intersect ^ b) return b;
      }
    }

    // if intersecting and we made it here, then we saw no misses
    // if not intersecting, then we saw no matches
    // if no active selections, return false
    return n && intersect;
  }
  var bisect = d3Array.bisector($selectionId),
    bisectLeft = bisect.left,
    bisectRight = bisect.right;
  function selectionIdTest(name, datum, op) {
    var data = this.context.data[name],
      entries = data ? data.values.value : [],
      unitIdx = data ? data[UNIT_INDEX] && data[UNIT_INDEX].value : undefined,
      intersect = op === Intersect,
      value = $selectionId(datum),
      index = bisectLeft(entries, value);
    if (index === entries.length) return false;
    if ($selectionId(entries[index]) !== value) return false;
    if (unitIdx && intersect) {
      if (unitIdx.size === 1) return true;
      if (bisectRight(entries, value) - index < unitIdx.size) return false;
    }
    return true;
  }

  /**
   * Maps an array of scene graph items to an array of selection tuples.
   * @param {string} name  - The name of the dataset representing the selection.
   * @param {string} base  - The base object that generated tuples extend.
   *
   * @returns {array} An array of selection entries for the given unit.
   */
  function selectionTuples(array, base) {
    return array.map(function (x) {
      return extend(base.fields ? {
        values: base.fields.map(function (f) {
          return (f.getter || (f.getter = field$1(f.field)))(x.datum);
        })
      } : _defineProperty({}, SelectionId, $selectionId(x.datum)), base);
    });
  }

  /**
   * Resolves selection for use as a scale domain or reads via the API.
   * @param {string} name - The name of the dataset representing the selection
   * @param {string} [op='union'] - The set operation for combining selections.
   *                 One of 'intersect' or 'union' (default).
   * @param {boolean} isMulti - Identifies a "multi" selection to perform more
   *                 expensive resolution computation.
   * @param {boolean} vl5 - With Vega-Lite v5, "multi" selections are now called "point"
   *                 selections, and thus the resolved tuple should reflect this name.
   *                 This parameter allows us to reflect this change without triggering
   *                 a major version bump for Vega.
   * @returns {object} An object of selected fields and values.
   */
  function selectionResolve(name, op, isMulti, vl5) {
    var data = this.context.data[name],
      entries = data ? data.values.value : [],
      resolved = {},
      multiRes = {},
      types = {},
      entry,
      fields,
      values,
      unit,
      field,
      value,
      res,
      resUnit,
      type,
      union,
      n = entries.length,
      i = 0,
      j,
      m;

    // First union all entries within the same unit.
    for (; i < n; ++i) {
      entry = entries[i];
      unit = entry.unit;
      fields = entry.fields;
      values = entry.values;
      if (fields && values) {
        // Intentional selection stores
        for (j = 0, m = fields.length; j < m; ++j) {
          field = fields[j];
          res = resolved[field.field] || (resolved[field.field] = {});
          resUnit = res[unit] || (res[unit] = []);
          types[field.field] = type = field.type.charAt(0);
          union = ops["".concat(type, "_union")];
          res[unit] = union(resUnit, array$2(values[j]));
        }

        // If the same multi-selection is repeated over views and projected over
        // an encoding, it may operate over different fields making it especially
        // tricky to reliably resolve it. At best, we can de-dupe identical entries
        // but doing so may be more computationally expensive than it is worth.
        // Instead, for now, we simply transform our store representation into
        // a more human-friendly one.
        if (isMulti) {
          resUnit = multiRes[unit] || (multiRes[unit] = []);
          resUnit.push(array$2(values).reduce(function (obj, curr, j) {
            return obj[fields[j].field] = curr, obj;
          }, {}));
        }
      } else {
        // Short circuit extensional selectionId stores which hold sorted IDs unique to each unit.
        field = SelectionId;
        value = $selectionId(entry);
        res = resolved[field] || (resolved[field] = {});
        resUnit = res[unit] || (res[unit] = []);
        resUnit.push(value);
        if (isMulti) {
          resUnit = multiRes[unit] || (multiRes[unit] = []);
          resUnit.push(_defineProperty({}, SelectionId, value));
        }
      }
    }

    // Then resolve fields across units as per the op.
    op = op || Union;
    if (resolved[SelectionId]) {
      resolved[SelectionId] = ops["".concat(SelectionId, "_").concat(op)].apply(ops, _toConsumableArray(Object.values(resolved[SelectionId])));
    } else {
      Object.keys(resolved).forEach(function (field) {
        resolved[field] = Object.keys(resolved[field]).map(function (unit) {
          return resolved[field][unit];
        }).reduce(function (acc, curr) {
          return acc === undefined ? curr : ops["".concat(types[field], "_").concat(op)](acc, curr);
        });
      });
    }
    entries = Object.keys(multiRes);
    if (isMulti && entries.length) {
      var key = vl5 ? VlPoint : VlMulti;
      resolved[key] = op === Union ? _defineProperty({}, Or, entries.reduce(function (acc, k) {
        return acc.push.apply(acc, _toConsumableArray(multiRes[k])), acc;
      }, [])) : _defineProperty({}, And, entries.map(function (k) {
        return _defineProperty({}, Or, multiRes[k]);
      }));
    }
    return resolved;
  }
  var ops = (_ops = {}, _defineProperty(_ops, "".concat(SelectionId, "_union"), d3Array.union), _defineProperty(_ops, "".concat(SelectionId, "_intersect"), d3Array.intersection), _defineProperty(_ops, "E_union", function E_union(base, value) {
    if (!base.length) return value;
    var i = 0,
      n = value.length;
    for (; i < n; ++i) if (base.indexOf(value[i]) < 0) base.push(value[i]);
    return base;
  }), _defineProperty(_ops, "E_intersect", function E_intersect(base, value) {
    return !base.length ? value : base.filter(function (v) {
      return value.indexOf(v) >= 0;
    });
  }), _defineProperty(_ops, "R_union", function R_union(base, value) {
    var lo = toNumber(value[0]),
      hi = toNumber(value[1]);
    if (lo > hi) {
      lo = value[1];
      hi = value[0];
    }
    if (!base.length) return [lo, hi];
    if (base[0] > lo) base[0] = lo;
    if (base[1] < hi) base[1] = hi;
    return base;
  }), _defineProperty(_ops, "R_intersect", function R_intersect(base, value) {
    var lo = toNumber(value[0]),
      hi = toNumber(value[1]);
    if (lo > hi) {
      lo = value[1];
      hi = value[0];
    }
    if (!base.length) return [lo, hi];
    if (hi < base[0] || base[1] < lo) {
      return [];
    } else {
      if (base[0] < lo) base[0] = lo;
      if (base[1] > hi) base[1] = hi;
    }
    return base;
  }), _ops);
  var DataPrefix$1 = ':',
    IndexPrefix$1 = '@';
  function selectionVisitor(name, args, scope, params) {
    if (args[0].type !== Literal) error('First argument to selection functions must be a string literal.');
    var data = args[0].value,
      op = args.length >= 2 && peek$1(args).value,
      field = 'unit',
      indexName = IndexPrefix$1 + field,
      dataName = DataPrefix$1 + data;

    // eslint-disable-next-line no-prototype-builtins
    if (op === Intersect && !_has(params, indexName)) {
      params[indexName] = scope.getData(data).indataRef(scope, field);
    }

    // eslint-disable-next-line no-prototype-builtins
    if (!_has(params, dataName)) {
      params[dataName] = scope.getData(data).tuplesRef();
    }
  }

  function data$1(name) {
    var data = this.context.data[name];
    return data ? data.values.value : [];
  }
  function indata(name, field, value) {
    var index = this.context.data[name]['index:' + field],
      entry = index ? index.value.get(value) : undefined;
    return entry ? entry.count : entry;
  }
  function setdata(name, tuples) {
    var df = this.context.dataflow,
      data = this.context.data[name],
      input = data.input;
    df.pulse(input, df.changeset().remove(truthy).insert(tuples));
    return 1;
  }
  function encode(item, name, retval) {
    if (item) {
      var df = this.context.dataflow,
        target = item.mark.source;
      df.pulse(target, df.changeset().encode(item, name));
    }
    return retval !== undefined ? retval : item;
  }
  var wrap = function wrap(method) {
    return function (value, spec) {
      var locale = this.context.dataflow.locale();
      return locale[method](spec)(value);
    };
  };
  var format = wrap('format');
  var timeFormat = wrap('timeFormat');
  var utcFormat = wrap('utcFormat');
  var timeParse = wrap('timeParse');
  var utcParse = wrap('utcParse');
  var dateObj = new Date(2000, 0, 1);
  function time(month, day, specifier) {
    if (!Number.isInteger(month) || !Number.isInteger(day)) return '';
    dateObj.setYear(2000);
    dateObj.setMonth(month);
    dateObj.setDate(day);
    return timeFormat.call(this, dateObj, specifier);
  }
  function monthFormat(month) {
    return time.call(this, month, 1, '%B');
  }
  function monthAbbrevFormat(month) {
    return time.call(this, month, 1, '%b');
  }
  function dayFormat(day) {
    return time.call(this, 0, 2 + day, '%A');
  }
  function dayAbbrevFormat(day) {
    return time.call(this, 0, 2 + day, '%a');
  }
  var DataPrefix = ':';
  var IndexPrefix = '@';
  var ScalePrefix = '%';
  var SignalPrefix = '$';
  function dataVisitor(name, args, scope, params) {
    if (args[0].type !== Literal) {
      error('First argument to data functions must be a string literal.');
    }
    var data = args[0].value,
      dataName = DataPrefix + data;
    if (!_has(dataName, params)) {
      try {
        params[dataName] = scope.getData(data).tuplesRef();
      } catch (err) {
        // if data set does not exist, there's nothing to track
      }
    }
  }
  function indataVisitor(name, args, scope, params) {
    if (args[0].type !== Literal) error('First argument to indata must be a string literal.');
    if (args[1].type !== Literal) error('Second argument to indata must be a string literal.');
    var data = args[0].value,
      field = args[1].value,
      indexName = IndexPrefix + field;
    if (!_has(indexName, params)) {
      params[indexName] = scope.getData(data).indataRef(scope, field);
    }
  }
  function scaleVisitor(name, args, scope, params) {
    if (args[0].type === Literal) {
      // add scale dependency
      addScaleDependency(scope, params, args[0].value);
    } else {
      // indirect scale lookup; add all scales as parameters
      for (name in scope.scales) {
        addScaleDependency(scope, params, name);
      }
    }
  }
  function addScaleDependency(scope, params, name) {
    var scaleName = ScalePrefix + name;
    if (!_has(params, scaleName)) {
      try {
        params[scaleName] = scope.scaleRef(name);
      } catch (err) {
        // TODO: error handling? warning?
      }
    }
  }
  function getScale(nameOrFunction, ctx) {
    if (isFunction(nameOrFunction)) {
      return nameOrFunction;
    }
    if (isString(nameOrFunction)) {
      var maybeScale = ctx.scales[nameOrFunction];
      return maybeScale && isRegisteredScale(maybeScale.value) ? maybeScale.value : undefined;
    }
    return undefined;
  }
  function internalScaleFunctions(codegen, fnctx, visitors) {
    // add helper method to the 'this' expression function context
    fnctx.__bandwidth = function (s) {
      return s && s.bandwidth ? s.bandwidth() : 0;
    };

    // register AST visitors for internal scale functions
    visitors._bandwidth = scaleVisitor;
    visitors._range = scaleVisitor;
    visitors._scale = scaleVisitor;

    // resolve scale reference directly to the signal hash argument
    var ref = function ref(arg) {
      return '_[' + (arg.type === Literal ? $(ScalePrefix + arg.value) : $(ScalePrefix) + '+' + codegen(arg)) + ']';
    };

    // define and return internal scale function code generators
    // these internal functions are called by mark encoders
    return {
      _bandwidth: function _bandwidth(args) {
        return "this.__bandwidth(".concat(ref(args[0]), ")");
      },
      _range: function _range(args) {
        return "".concat(ref(args[0]), ".range()");
      },
      _scale: function _scale(args) {
        return "".concat(ref(args[0]), "(").concat(codegen(args[1]), ")");
      }
    };
  }
  function geoMethod(methodName, globalMethod) {
    return function (projection, geojson, group) {
      if (projection) {
        // projection defined, use it
        var p = getScale(projection, (group || this).context);
        return p && p.path[methodName](geojson);
      } else {
        // projection undefined, use global method
        return globalMethod(geojson);
      }
    };
  }
  var geoArea = geoMethod('area', d3Geo.geoArea);
  var geoBounds = geoMethod('bounds', d3Geo.geoBounds);
  var geoCentroid = geoMethod('centroid', d3Geo.geoCentroid);
  function inScope(item) {
    var group = this.context.group;
    var value = false;
    if (group) while (item) {
      if (item === group) {
        value = true;
        break;
      }
      item = item.mark.group;
    }
    return value;
  }
  function log(df, method, args) {
    try {
      df[method].apply(df, ['EXPRESSION'].concat([].slice.call(args)));
    } catch (err) {
      df.warn(err);
    }
    return args[args.length - 1];
  }
  function warn() {
    return log(this.context.dataflow, 'warn', arguments);
  }
  function info() {
    return log(this.context.dataflow, 'info', arguments);
  }
  function debug() {
    return log(this.context.dataflow, 'debug', arguments);
  }

  // https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
  function channel_luminance_value(channelValue) {
    var val = channelValue / 255;
    if (val <= 0.03928) {
      return val / 12.92;
    }
    return Math.pow((val + 0.055) / 1.055, 2.4);
  }
  function luminance(color) {
    var c = d3Color.rgb(color),
      r = channel_luminance_value(c.r),
      g = channel_luminance_value(c.g),
      b = channel_luminance_value(c.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
  function contrast(color1, color2) {
    var lum1 = luminance(color1),
      lum2 = luminance(color2),
      lumL = Math.max(lum1, lum2),
      lumD = Math.min(lum1, lum2);
    return (lumL + 0.05) / (lumD + 0.05);
  }
  function merge() {
    var args = [].slice.call(arguments);
    args.unshift({});
    return extend.apply(void 0, _toConsumableArray(args));
  }
  function equal(a, b) {
    return a === b || a !== a && b !== b ? true : isArray(a) ? isArray(b) && a.length === b.length ? equalArray(a, b) : false : isObject(a) && isObject(b) ? equalObject(a, b) : false;
  }
  function equalArray(a, b) {
    for (var i = 0, n = a.length; i < n; ++i) {
      if (!equal(a[i], b[i])) return false;
    }
    return true;
  }
  function equalObject(a, b) {
    for (var key in a) {
      if (!equal(a[key], b[key])) return false;
    }
    return true;
  }
  function removePredicate(props) {
    return function (_) {
      return equalObject(props, _);
    };
  }
  function modify(name, insert, remove, toggle, modify, values) {
    var df = this.context.dataflow,
      data = this.context.data[name],
      input = data.input,
      stamp = df.stamp();
    var changes = data.changes,
      predicate,
      key;
    if (df._trigger === false || !(input.value.length || insert || toggle)) {
      // nothing to do!
      return 0;
    }
    if (!changes || changes.stamp < stamp) {
      data.changes = changes = df.changeset();
      changes.stamp = stamp;
      df.runAfter(function () {
        data.modified = true;
        df.pulse(input, changes).run();
      }, true, 1);
    }
    if (remove) {
      predicate = remove === true ? truthy : isArray(remove) || isTuple(remove) ? remove : removePredicate(remove);
      changes.remove(predicate);
    }
    if (insert) {
      changes.insert(insert);
    }
    if (toggle) {
      predicate = removePredicate(toggle);
      if (input.value.some(predicate)) {
        changes.remove(predicate);
      } else {
        changes.insert(toggle);
      }
    }
    if (modify) {
      for (key in values) {
        changes.modify(modify, key, values[key]);
      }
    }
    return 1;
  }
  function pinchDistance(event) {
    var t = event.touches,
      dx = t[0].clientX - t[1].clientX,
      dy = t[0].clientY - t[1].clientY;
    return Math.hypot(dx, dy);
  }
  function pinchAngle(event) {
    var t = event.touches;
    return Math.atan2(t[0].clientY - t[1].clientY, t[0].clientX - t[1].clientX);
  }

  // memoize accessor functions
  var accessors = {};
  function pluck(data, name) {
    var accessor = accessors[name] || (accessors[name] = field$1(name));
    return isArray(data) ? data.map(accessor) : accessor(data);
  }
  function array(seq) {
    return isArray(seq) || ArrayBuffer.isView(seq) ? seq : null;
  }
  function sequence(seq) {
    return array(seq) || (isString(seq) ? seq : null);
  }
  function join(seq) {
    var _array;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return (_array = array(seq)).join.apply(_array, args);
  }
  function indexof(seq) {
    var _sequence;
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return (_sequence = sequence(seq)).indexOf.apply(_sequence, args);
  }
  function lastindexof(seq) {
    var _sequence2;
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return (_sequence2 = sequence(seq)).lastIndexOf.apply(_sequence2, args);
  }
  function slice(seq) {
    var _sequence3;
    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }
    return (_sequence3 = sequence(seq)).slice.apply(_sequence3, args);
  }
  function replace(str, pattern, repl) {
    if (isFunction(repl)) error('Function argument passed to replace.');
    return String(str).replace(pattern, repl);
  }
  function reverse(seq) {
    return array(seq).slice().reverse();
  }
  function bandspace(count, paddingInner, paddingOuter) {
    return bandSpace(count || 0, paddingInner || 0, paddingOuter || 0);
  }
  function bandwidth(name, group) {
    var s = getScale(name, (group || this).context);
    return s && s.bandwidth ? s.bandwidth() : 0;
  }
  function copy(name, group) {
    var s = getScale(name, (group || this).context);
    return s ? s.copy() : undefined;
  }
  function domain(name, group) {
    var s = getScale(name, (group || this).context);
    return s ? s.domain() : [];
  }
  function invert(name, range, group) {
    var s = getScale(name, (group || this).context);
    return !s ? undefined : isArray(range) ? (s.invertRange || s.invert)(range) : (s.invert || s.invertExtent)(range);
  }
  function range$1(name, group) {
    var s = getScale(name, (group || this).context);
    return s && s.range ? s.range() : [];
  }
  function scale$2(name, value, group) {
    var s = getScale(name, (group || this).context);
    return s ? s(value) : undefined;
  }
  function scaleGradient(scale, p0, p1, count, group) {
    scale = getScale(scale, (group || this).context);
    var gradient = Gradient$1(p0, p1);
    var stops = scale.domain(),
      min = stops[0],
      max = peek$1(stops),
      fraction = identity;
    if (!(max - min)) {
      // expand scale if domain has zero span, fix #1479
      scale = (scale.interpolator ? scale$4('sequential')().interpolator(scale.interpolator()) : scale$4('linear')().interpolate(scale.interpolate()).range(scale.range())).domain([min = 0, max = 1]);
    } else {
      fraction = scaleFraction(scale, min, max);
    }
    if (scale.ticks) {
      stops = scale.ticks(+count || 15);
      if (min !== stops[0]) stops.unshift(min);
      if (max !== peek$1(stops)) stops.push(max);
    }
    stops.forEach(function (_) {
      return gradient.stop(fraction(_), scale(_));
    });
    return gradient;
  }
  function geoShape(projection, geojson, group) {
    var p = getScale(projection, (group || this).context);
    return function (context) {
      return p ? p.path.context(context)(geojson) : '';
    };
  }
  function pathShape(path) {
    var p = null;
    return function (context) {
      return context ? pathRender(context, p = p || parse$3(path)) : path;
    };
  }
  var datum = function datum(d) {
    return d.data;
  };
  function treeNodes(name, context) {
    var tree = data$1.call(context, name);
    return tree.root && tree.root.lookup || {};
  }
  function treePath(name, source, target) {
    var nodes = treeNodes(name, this),
      s = nodes[source],
      t = nodes[target];
    return s && t ? s.path(t).map(datum) : undefined;
  }
  function treeAncestors(name, node) {
    var n = treeNodes(name, this)[node];
    return n ? n.ancestors().map(datum) : undefined;
  }
  var _window = function _window() {
    return typeof window !== 'undefined' && window || null;
  };
  function screen() {
    var w = _window();
    return w ? w.screen : {};
  }
  function windowSize() {
    var w = _window();
    return w ? [w.innerWidth, w.innerHeight] : [undefined, undefined];
  }
  function containerSize() {
    var view = this.context.dataflow,
      el = view.container && view.container();
    return el ? [el.clientWidth, el.clientHeight] : [undefined, undefined];
  }
  function intersect(b, opt, group) {
    if (!b) return [];
    var _b = _slicedToArray(b, 2),
      u = _b[0],
      v = _b[1],
      box = new Bounds().set(u[0], u[1], v[0], v[1]),
      scene = group || this.context.dataflow.scenegraph().root;
    return intersect$2(scene, box, filter(opt));
  }
  function filter(opt) {
    var p = null;
    if (opt) {
      var types = array$2(opt.marktype),
        names = array$2(opt.markname);
      p = function p(_) {
        return (!types.length || types.some(function (t) {
          return _.marktype === t;
        })) && (!names.length || names.some(function (s) {
          return _.name === s;
        }));
      };
    }
    return p;
  }

  /**
   * Appends a new point to the lasso
   *
   * @param {*} lasso the lasso in pixel space
   * @param {*} x the x coordinate in pixel space
   * @param {*} y the y coordinate in pixel space
   * @param {*} minDist the minimum distance, in pixels, that thenew point needs to be apart from the last point
   * @returns a new array containing the lasso with the new point
   */
  function lassoAppend(lasso, x, y) {
    var minDist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5;
    lasso = array$2(lasso);
    var last = lasso[lasso.length - 1];

    // Add point to lasso if its the first point or distance to last point exceed minDist
    return last === undefined || Math.hypot(last[0] - x, last[1] - y) > minDist ? [].concat(_toConsumableArray(lasso), [[x, y]]) : lasso;
  }

  /**
   * Generates a svg path command which draws a lasso
   *
   * @param {*} lasso the lasso in pixel space in the form [[x,y], [x,y], ...]
   * @returns the svg path command that draws the lasso
   */
  function lassoPath(lasso) {
    return array$2(lasso).reduce(function (svg, _ref, i) {
      var _ref2 = _slicedToArray(_ref, 2),
        x = _ref2[0],
        y = _ref2[1];
      return svg += i == 0 ? "M ".concat(x, ",").concat(y, " ") : i === lasso.length - 1 ? ' Z' : "L ".concat(x, ",").concat(y, " ");
    }, '');
  }

  /**
   * Inverts the lasso from pixel space to an array of vega scenegraph tuples
   *
   * @param {*} data the dataset
   * @param {*} pixelLasso the lasso in pixel space, [[x,y], [x,y], ...]
   * @param {*} unit the unit where the lasso is defined
   *
   * @returns an array of vega scenegraph tuples
   */
  function intersectLasso(markname, pixelLasso, unit) {
    var x = unit.x,
      y = unit.y,
      mark = unit.mark;
    var bb = new Bounds().set(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

    // Get bounding box around lasso
    var _iterator = _createForOfIteratorHelper(pixelLasso),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          px = _step$value[0],
          py = _step$value[1];
        if (px < bb.x1) bb.x1 = px;
        if (px > bb.x2) bb.x2 = px;
        if (py < bb.y1) bb.y1 = py;
        if (py > bb.y2) bb.y2 = py;
      }

      // Translate bb against unit coordinates
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    bb.translate(x, y);
    var intersection = intersect([[bb.x1, bb.y1], [bb.x2, bb.y2]], markname, mark);

    // Check every point against the lasso
    return intersection.filter(function (tuple) {
      return pointInPolygon(tuple.x, tuple.y, pixelLasso);
    });
  }

  /**
   * Performs a test if a point is inside a polygon based on the idea from
   * https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
   *
   * This method will not need the same start/end point since it wraps around the edges of the array
   *
   * @param {*} test a point to test against
   * @param {*} polygon a polygon in the form [[x,y], [x,y], ...]
   * @returns true if the point lies inside the polygon, false otherwise
   */
  function pointInPolygon(testx, testy, polygon) {
    var intersections = 0;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      var _polygon$j = _slicedToArray(polygon[j], 2),
        prevX = _polygon$j[0],
        prevY = _polygon$j[1];
      var _polygon$i = _slicedToArray(polygon[i], 2),
        x = _polygon$i[0],
        y = _polygon$i[1];

      // count intersections
      if (y > testy != prevY > testy && testx < (prevX - x) * (testy - y) / (prevY - y) + x) {
        intersections++;
      }
    }

    // point is in polygon if intersection count is odd
    return intersections & 1;
  }

  // Expression function context object
  var functionContext = {
    random: function random() {
      return exports.random();
    },
    // override default
    cumulativeNormal: cumulativeNormal,
    cumulativeLogNormal: cumulativeLogNormal,
    cumulativeUniform: cumulativeUniform,
    densityNormal: densityNormal,
    densityLogNormal: densityLogNormal,
    densityUniform: densityUniform,
    quantileNormal: quantileNormal,
    quantileLogNormal: quantileLogNormal,
    quantileUniform: quantileUniform,
    sampleNormal: sampleNormal,
    sampleLogNormal: sampleLogNormal,
    sampleUniform: sampleUniform,
    isArray: isArray,
    isBoolean: isBoolean$1,
    isDate: isDate$1,
    isDefined: function isDefined(_) {
      return _ !== undefined;
    },
    isNumber: isNumber$1,
    isObject: isObject,
    isRegExp: isRegExp,
    isString: isString,
    isTuple: isTuple,
    isValid: function isValid(_) {
      return _ != null && _ === _;
    },
    toBoolean: toBoolean,
    toDate: function toDate$1(_) {
      return toDate(_);
    },
    // suppress extra arguments
    toNumber: toNumber,
    toString: toString,
    indexof: indexof,
    join: join,
    lastindexof: lastindexof,
    replace: replace,
    reverse: reverse,
    slice: slice,
    flush: flush,
    lerp: lerp,
    merge: merge,
    pad: pad,
    peek: peek$1,
    pluck: pluck,
    span: span,
    inrange: inrange,
    truncate: truncate$1,
    rgb: d3Color.rgb,
    lab: d3Color.lab,
    hcl: d3Color.hcl,
    hsl: d3Color.hsl,
    luminance: luminance,
    contrast: contrast,
    sequence: d3Array.range,
    format: format,
    utcFormat: utcFormat,
    utcParse: utcParse,
    utcOffset: utcOffset,
    utcSequence: utcSequence,
    timeFormat: timeFormat,
    timeParse: timeParse,
    timeOffset: timeOffset,
    timeSequence: timeSequence,
    timeUnitSpecifier: timeUnitSpecifier,
    monthFormat: monthFormat,
    monthAbbrevFormat: monthAbbrevFormat,
    dayFormat: dayFormat,
    dayAbbrevFormat: dayAbbrevFormat,
    quarter: quarter,
    utcquarter: utcquarter,
    week: week,
    utcweek: utcweek,
    dayofyear: dayofyear,
    utcdayofyear: utcdayofyear,
    warn: warn,
    info: info,
    debug: debug,
    extent: function extent$1(_) {
      return extent(_);
    },
    // suppress extra arguments
    inScope: inScope,
    intersect: intersect,
    clampRange: clampRange,
    pinchDistance: pinchDistance,
    pinchAngle: pinchAngle,
    screen: screen,
    containerSize: containerSize,
    windowSize: windowSize,
    bandspace: bandspace,
    setdata: setdata,
    pathShape: pathShape,
    panLinear: panLinear,
    panLog: panLog,
    panPow: panPow,
    panSymlog: panSymlog,
    zoomLinear: zoomLinear,
    zoomLog: zoomLog,
    zoomPow: zoomPow,
    zoomSymlog: zoomSymlog,
    encode: encode,
    modify: modify,
    lassoAppend: lassoAppend,
    lassoPath: lassoPath,
    intersectLasso: intersectLasso
  };
  var eventFunctions = ['view', 'item', 'group', 'xy', 'x', 'y'],
    // event functions
    eventPrefix = 'event.vega.',
    // event function prefix
    thisPrefix = 'this.',
    // function context prefix
    astVisitors = {}; // AST visitors for dependency analysis

  // export code generator parameters
  var codegenParams = {
    forbidden: ['_'],
    allowed: ['datum', 'event', 'item'],
    fieldvar: 'datum',
    globalvar: function globalvar(id) {
      return "_[".concat($(SignalPrefix + id), "]");
    },
    functions: buildFunctions,
    constants: Constants,
    visitors: astVisitors
  };

  // export code generator
  var codeGenerator = codegen(codegenParams);

  // Build expression function registry
  function buildFunctions(codegen) {
    var fn = Functions(codegen);
    eventFunctions.forEach(function (name) {
      return fn[name] = eventPrefix + name;
    });
    for (var name in functionContext) {
      fn[name] = thisPrefix + name;
    }
    extend(fn, internalScaleFunctions(codegen, functionContext, astVisitors));
    return fn;
  }

  // Register an expression function
  function expressionFunction(name, fn, visitor) {
    if (arguments.length === 1) {
      return functionContext[name];
    }

    // register with the functionContext
    functionContext[name] = fn;

    // if there is an astVisitor register that, too
    if (visitor) astVisitors[name] = visitor;

    // if the code generator has already been initialized,
    // we need to also register the function with it
    if (codeGenerator) codeGenerator.functions[name] = thisPrefix + name;
    return this;
  }

  // register expression functions with ast visitors
  expressionFunction('bandwidth', bandwidth, scaleVisitor);
  expressionFunction('copy', copy, scaleVisitor);
  expressionFunction('domain', domain, scaleVisitor);
  expressionFunction('range', range$1, scaleVisitor);
  expressionFunction('invert', invert, scaleVisitor);
  expressionFunction('scale', scale$2, scaleVisitor);
  expressionFunction('gradient', scaleGradient, scaleVisitor);
  expressionFunction('geoArea', geoArea, scaleVisitor);
  expressionFunction('geoBounds', geoBounds, scaleVisitor);
  expressionFunction('geoCentroid', geoCentroid, scaleVisitor);
  expressionFunction('geoShape', geoShape, scaleVisitor);
  expressionFunction('indata', indata, indataVisitor);
  expressionFunction('data', data$1, dataVisitor);
  expressionFunction('treePath', treePath, dataVisitor);
  expressionFunction('treeAncestors', treeAncestors, dataVisitor);

  // register Vega-Lite selection functions
  expressionFunction('vlSelectionTest', selectionTest, selectionVisitor);
  expressionFunction('vlSelectionIdTest', selectionIdTest, selectionVisitor);
  expressionFunction('vlSelectionResolve', selectionResolve, selectionVisitor);
  expressionFunction('vlSelectionTuples', selectionTuples);
  function parser(expr, scope) {
    var params = {};

    // parse the expression to an abstract syntax tree (ast)
    var ast;
    try {
      expr = isString(expr) ? expr : $(expr) + '';
      ast = parser$1(expr);
    } catch (err) {
      error('Expression parse error: ' + expr);
    }

    // analyze ast function calls for dependencies
    ast.visit(function (node) {
      if (node.type !== CallExpression) return;
      var name = node.callee.name,
        visit = codegenParams.visitors[name];
      if (visit) visit(name, node.arguments, scope, params);
    });

    // perform code generation
    var gen = codeGenerator(ast);

    // collect signal dependencies
    gen.globals.forEach(function (name) {
      var signalName = SignalPrefix + name;
      if (!_has(params, signalName) && scope.getSignal(name)) {
        params[signalName] = scope.signalRef(name);
      }
    });

    // return generated expression code and dependencies
    return {
      $expr: extend({
        code: gen.code
      }, scope.options.ast ? {
        ast: ast
      } : null),
      $fields: gen.fields,
      $params: params
    };
  }

  /**
   * Parse a serialized dataflow specification.
   */
  function parse$2(spec) {
    var ctx = this,
      operators = spec.operators || [];

    // parse background
    if (spec.background) {
      ctx.background = spec.background;
    }

    // parse event configuration
    if (spec.eventConfig) {
      ctx.eventConfig = spec.eventConfig;
    }

    // parse locale configuration
    if (spec.locale) {
      ctx.locale = spec.locale;
    }

    // parse operators
    operators.forEach(function (entry) {
      return ctx.parseOperator(entry);
    });

    // parse operator parameters
    operators.forEach(function (entry) {
      return ctx.parseOperatorParameters(entry);
    });

    // parse streams
    (spec.streams || []).forEach(function (entry) {
      return ctx.parseStream(entry);
    });

    // parse updates
    (spec.updates || []).forEach(function (entry) {
      return ctx.parseUpdate(entry);
    });
    return ctx.resolve();
  }
  var Skip$2 = toSet(['rule']),
    Swap = toSet(['group', 'image', 'rect']);
  function adjustSpatial(encode, marktype) {
    var code = '';
    if (Skip$2[marktype]) return code;
    if (encode.x2) {
      if (encode.x) {
        if (Swap[marktype]) {
          code += 'if(o.x>o.x2)$=o.x,o.x=o.x2,o.x2=$;';
        }
        code += 'o.width=o.x2-o.x;';
      } else {
        code += 'o.x=o.x2-(o.width||0);';
      }
    }
    if (encode.xc) {
      code += 'o.x=o.xc-(o.width||0)/2;';
    }
    if (encode.y2) {
      if (encode.y) {
        if (Swap[marktype]) {
          code += 'if(o.y>o.y2)$=o.y,o.y=o.y2,o.y2=$;';
        }
        code += 'o.height=o.y2-o.y;';
      } else {
        code += 'o.y=o.y2-(o.height||0);';
      }
    }
    if (encode.yc) {
      code += 'o.y=o.yc-(o.height||0)/2;';
    }
    return code;
  }
  function canonicalType(type) {
    return (type + '').toLowerCase();
  }
  function isOperator(type) {
    return canonicalType(type) === 'operator';
  }
  function isCollect(type) {
    return canonicalType(type) === 'collect';
  }
  function expression(ctx, args, code) {
    // wrap code in return statement if expression does not terminate
    if (!code.endsWith(';')) {
      code = 'return(' + code + ');';
    }
    var fn = Function.apply(void 0, _toConsumableArray(args.concat(code)));
    return ctx && ctx.functions ? fn.bind(ctx.functions) : fn;
  }

  // generate code for comparing a single field
  function _compare(u, v, lt, gt) {
    return "((u = ".concat(u, ") < (v = ").concat(v, ") || u == null) && v != null ? ").concat(lt, "\n  : (u > v || v == null) && u != null ? ").concat(gt, "\n  : ((v = v instanceof Date ? +v : v), (u = u instanceof Date ? +u : u)) !== u && v === v ? ").concat(lt, "\n  : v !== v && u === u ? ").concat(gt, " : ");
  }
  var expressionCodegen = {
    /**
     * Parse an expression used to update an operator value.
     */
    operator: function operator(ctx, expr) {
      return expression(ctx, ['_'], expr.code);
    },
    /**
     * Parse an expression provided as an operator parameter value.
     */
    parameter: function parameter(ctx, expr) {
      return expression(ctx, ['datum', '_'], expr.code);
    },
    /**
     * Parse an expression applied to an event stream.
     */
    event: function event(ctx, expr) {
      return expression(ctx, ['event'], expr.code);
    },
    /**
     * Parse an expression used to handle an event-driven operator update.
     */
    handler: function handler(ctx, expr) {
      var code = "var datum=event.item&&event.item.datum;return ".concat(expr.code, ";");
      return expression(ctx, ['_', 'event'], code);
    },
    /**
     * Parse an expression that performs visual encoding.
     */
    encode: function encode(ctx, _encode) {
      var marktype = _encode.marktype,
        channels = _encode.channels;
      var code = 'var o=item,datum=o.datum,m=0,$;';
      for (var name in channels) {
        var o = 'o[' + $(name) + ']';
        code += "$=".concat(channels[name].code, ";if(").concat(o, "!==$)").concat(o, "=$,m=1;");
      }
      code += adjustSpatial(channels, marktype);
      code += 'return m;';
      return expression(ctx, ['item', '_'], code);
    },
    /**
     * Optimized code generators for access and comparison.
     */
    codegen: {
      get: function get(path) {
        var ref = "[".concat(path.map($).join(']['), "]");
        var get = Function('_', "return _".concat(ref, ";"));
        get.path = ref;
        return get;
      },
      comparator: function comparator(fields, orders) {
        var t;
        var map = function map(f, i) {
          var o = orders[i];
          var u, v;
          if (f.path) {
            u = "a".concat(f.path);
            v = "b".concat(f.path);
          } else {
            (t = t || {})['f' + i] = f;
            u = "this.f".concat(i, "(a)");
            v = "this.f".concat(i, "(b)");
          }
          return _compare(u, v, -o, o);
        };
        var fn = Function('a', 'b', 'var u, v; return ' + fields.map(map).join('') + '0;');
        return t ? fn.bind(t) : fn;
      }
    }
  };

  /**
   * Parse a dataflow operator.
   */
  function parseOperator(spec) {
    var ctx = this;
    if (isOperator(spec.type) || !spec.type) {
      ctx.operator(spec, spec.update ? ctx.operatorExpression(spec.update) : null);
    } else {
      ctx.transform(spec, spec.type);
    }
  }

  /**
   * Parse and assign operator parameters.
   */
  function parseOperatorParameters(spec) {
    var ctx = this;
    if (spec.params) {
      var op = ctx.get(spec.id);
      if (!op) error('Invalid operator id: ' + spec.id);
      ctx.dataflow.connect(op, op.parameters(ctx.parseParameters(spec.params), spec.react, spec.initonly));
    }
  }

  /**
   * Parse a set of operator parameters.
   */
  function parseParameters$1(spec, params) {
    params = params || {};
    var ctx = this;
    for (var _key in spec) {
      var value = spec[_key];
      params[_key] = isArray(value) ? value.map(function (v) {
        return parseParameter$2(v, ctx, params);
      }) : parseParameter$2(value, ctx, params);
    }
    return params;
  }

  /**
   * Parse a single parameter.
   */
  function parseParameter$2(spec, ctx, params) {
    if (!spec || !isObject(spec)) return spec;
    for (var i = 0, n = PARSERS.length, p; i < n; ++i) {
      p = PARSERS[i];
      if (_has(spec, p.key)) {
        return p.parse(spec, ctx, params);
      }
    }
    return spec;
  }

  /** Reference parsers. */
  var PARSERS = [{
    key: '$ref',
    parse: getOperator
  }, {
    key: '$key',
    parse: getKey
  }, {
    key: '$expr',
    parse: getExpression
  }, {
    key: '$field',
    parse: getField
  }, {
    key: '$encode',
    parse: getEncode
  }, {
    key: '$compare',
    parse: getCompare
  }, {
    key: '$context',
    parse: getContext
  }, {
    key: '$subflow',
    parse: getSubflow
  }, {
    key: '$tupleid',
    parse: getTupleId
  }];

  /**
   * Resolve an operator reference.
   */
  function getOperator(_, ctx) {
    return ctx.get(_.$ref) || error('Operator not defined: ' + _.$ref);
  }

  /**
   * Resolve an expression reference.
   */
  function getExpression(_, ctx, params) {
    if (_.$params) {
      // parse expression parameters
      ctx.parseParameters(_.$params, params);
    }
    var k = 'e:' + _.$expr.code;
    return ctx.fn[k] || (ctx.fn[k] = accessor(ctx.parameterExpression(_.$expr), _.$fields));
  }

  /**
   * Resolve a key accessor reference.
   */
  function getKey(_, ctx) {
    var k = 'k:' + _.$key + '_' + !!_.$flat;
    return ctx.fn[k] || (ctx.fn[k] = key$1(_.$key, _.$flat, ctx.expr.codegen));
  }

  /**
   * Resolve a field accessor reference.
   */
  function getField(_, ctx) {
    if (!_.$field) return null;
    var k = 'f:' + _.$field + '_' + _.$name;
    return ctx.fn[k] || (ctx.fn[k] = field$1(_.$field, _.$name, ctx.expr.codegen));
  }

  /**
   * Resolve a comparator function reference.
   */
  function getCompare(_, ctx) {
    // As of Vega 5.5.3, $tupleid sort is no longer used.
    // Keep here for now for backwards compatibility.
    var k = 'c:' + _.$compare + '_' + _.$order,
      c = array$2(_.$compare).map(function (_) {
        return _ && _.$tupleid ? tupleid : _;
      });
    return ctx.fn[k] || (ctx.fn[k] = compare$1(c, _.$order, ctx.expr.codegen));
  }

  /**
   * Resolve an encode operator reference.
   */
  function getEncode(_, ctx) {
    var spec = _.$encode,
      encode = {};
    for (var name in spec) {
      var enc = spec[name];
      encode[name] = accessor(ctx.encodeExpression(enc.$expr), enc.$fields);
      encode[name].output = enc.$output;
    }
    return encode;
  }

  /**
   * Resolve a context reference.
   */
  function getContext(_, ctx) {
    return ctx;
  }

  /**
   * Resolve a recursive subflow specification.
   */
  function getSubflow(_, ctx) {
    var spec = _.$subflow;
    return function (dataflow, key, parent) {
      var subctx = ctx.fork().parse(spec),
        op = subctx.get(spec.operators[0].id),
        p = subctx.signals.parent;
      if (p) p.set(parent);
      op.detachSubflow = function () {
        return ctx.detach(subctx);
      };
      return op;
    };
  }

  /**
   * Resolve a tuple id reference.
   */
  function getTupleId() {
    return tupleid;
  }

  /**
   * Parse an event stream specification.
   */
  function parseStream$2(spec) {
    var ctx = this,
      filter = spec.filter != null ? ctx.eventExpression(spec.filter) : undefined,
      stream = spec.stream != null ? ctx.get(spec.stream) : undefined,
      args;
    if (spec.source) {
      stream = ctx.events(spec.source, spec.type, filter);
    } else if (spec.merge) {
      args = spec.merge.map(function (_) {
        return ctx.get(_);
      });
      stream = args[0].merge.apply(args[0], args.slice(1));
    }
    if (spec.between) {
      args = spec.between.map(function (_) {
        return ctx.get(_);
      });
      stream = stream.between(args[0], args[1]);
    }
    if (spec.filter) {
      stream = stream.filter(filter);
    }
    if (spec.throttle != null) {
      stream = stream.throttle(+spec.throttle);
    }
    if (spec.debounce != null) {
      stream = stream.debounce(+spec.debounce);
    }
    if (stream == null) {
      error('Invalid stream definition: ' + JSON.stringify(spec));
    }
    if (spec.consume) stream.consume(true);
    ctx.stream(spec, stream);
  }

  /**
   * Parse an event-driven operator update.
   */
  function parseUpdate$1(spec) {
    var ctx = this,
      srcid = isObject(srcid = spec.source) ? srcid.$ref : srcid,
      source = ctx.get(srcid),
      target = null,
      update = spec.update,
      params = undefined;
    if (!source) error('Source not defined: ' + spec.source);
    target = spec.target && spec.target.$expr ? ctx.eventExpression(spec.target.$expr) : ctx.get(spec.target);
    if (update && update.$expr) {
      if (update.$params) {
        params = ctx.parseParameters(update.$params);
      }
      update = ctx.handlerExpression(update.$expr);
    }
    ctx.update(spec, source, target, update, params);
  }
  var SKIP = {
    skip: true
  };
  function getState$1(options) {
    var ctx = this,
      state = {};
    if (options.signals) {
      var signals = state.signals = {};
      Object.keys(ctx.signals).forEach(function (key) {
        var op = ctx.signals[key];
        if (options.signals(key, op)) {
          signals[key] = op.value;
        }
      });
    }
    if (options.data) {
      var data = state.data = {};
      Object.keys(ctx.data).forEach(function (key) {
        var dataset = ctx.data[key];
        if (options.data(key, dataset)) {
          data[key] = dataset.input.value;
        }
      });
    }
    if (ctx.subcontext && options.recurse !== false) {
      state.subcontext = ctx.subcontext.map(function (ctx) {
        return ctx.getState(options);
      });
    }
    return state;
  }
  function setState$1(state) {
    var ctx = this,
      df = ctx.dataflow,
      data = state.data,
      signals = state.signals;
    Object.keys(signals || {}).forEach(function (key) {
      df.update(ctx.signals[key], signals[key], SKIP);
    });
    Object.keys(data || {}).forEach(function (key) {
      df.pulse(ctx.data[key].input, df.changeset().remove(truthy).insert(data[key]));
    });
    (state.subcontext || []).forEach(function (substate, i) {
      var subctx = ctx.subcontext[i];
      if (subctx) subctx.setState(substate);
    });
  }

  /**
   * Context objects store the current parse state.
   * Enables lookup of parsed operators, event streams, accessors, etc.
   * Provides a 'fork' method for creating child contexts for subflows.
   */
  function context(df, transforms, functions, expr) {
    return new Context(df, transforms, functions, expr);
  }
  function Context(df, transforms, functions, expr) {
    this.dataflow = df;
    this.transforms = transforms;
    this.events = df.events.bind(df);
    this.expr = expr || expressionCodegen, this.signals = {};
    this.scales = {};
    this.nodes = {};
    this.data = {};
    this.fn = {};
    if (functions) {
      this.functions = Object.create(functions);
      this.functions.context = this;
    }
  }
  function Subcontext(ctx) {
    this.dataflow = ctx.dataflow;
    this.transforms = ctx.transforms;
    this.events = ctx.events;
    this.expr = ctx.expr;
    this.signals = Object.create(ctx.signals);
    this.scales = Object.create(ctx.scales);
    this.nodes = Object.create(ctx.nodes);
    this.data = Object.create(ctx.data);
    this.fn = Object.create(ctx.fn);
    if (ctx.functions) {
      this.functions = Object.create(ctx.functions);
      this.functions.context = this;
    }
  }
  Context.prototype = Subcontext.prototype = {
    fork: function fork() {
      var ctx = new Subcontext(this);
      (this.subcontext || (this.subcontext = [])).push(ctx);
      return ctx;
    },
    detach: function detach(ctx) {
      this.subcontext = this.subcontext.filter(function (c) {
        return c !== ctx;
      });

      // disconnect all nodes in the subcontext
      // wipe out targets first for better efficiency
      var keys = Object.keys(ctx.nodes);
      for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
        var _key2 = _keys[_i];
        ctx.nodes[_key2]._targets = null;
      }
      for (var _i2 = 0, _keys2 = keys; _i2 < _keys2.length; _i2++) {
        var _key3 = _keys2[_i2];
        ctx.nodes[_key3].detach();
      }
      ctx.nodes = null;
    },
    get: function get(id) {
      return this.nodes[id];
    },
    set: function set(id, node) {
      return this.nodes[id] = node;
    },
    add: function add(spec, op) {
      var ctx = this,
        df = ctx.dataflow,
        data = spec.value;
      ctx.set(spec.id, op);
      if (isCollect(spec.type) && data) {
        if (data.$ingest) {
          df.ingest(op, data.$ingest, data.$format);
        } else if (data.$request) {
          df.preload(op, data.$request, data.$format);
        } else {
          df.pulse(op, df.changeset().insert(data));
        }
      }
      if (spec.root) {
        ctx.root = op;
      }
      if (spec.parent) {
        var p = ctx.get(spec.parent.$ref);
        if (p) {
          df.connect(p, [op]);
          op.targets().add(p);
        } else {
          (ctx.unresolved = ctx.unresolved || []).push(function () {
            p = ctx.get(spec.parent.$ref);
            df.connect(p, [op]);
            op.targets().add(p);
          });
        }
      }
      if (spec.signal) {
        ctx.signals[spec.signal] = op;
      }
      if (spec.scale) {
        ctx.scales[spec.scale] = op;
      }
      if (spec.data) {
        var _loop = function _loop() {
          var data = ctx.data[name] || (ctx.data[name] = {});
          spec.data[name].forEach(function (role) {
            return data[role] = op;
          });
        };
        for (var name in spec.data) {
          _loop();
        }
      }
    },
    resolve: function resolve() {
      (this.unresolved || []).forEach(function (fn) {
        return fn();
      });
      delete this.unresolved;
      return this;
    },
    operator: function operator(spec, update) {
      this.add(spec, this.dataflow.add(spec.value, update));
    },
    transform: function transform(spec, type) {
      this.add(spec, this.dataflow.add(this.transforms[canonicalType(type)]));
    },
    stream: function stream(spec, _stream) {
      this.set(spec.id, _stream);
    },
    update: function update(spec, stream, target, _update, params) {
      this.dataflow.on(stream, target, _update, params, spec.options);
    },
    // expression parsing
    operatorExpression: function operatorExpression(expr) {
      return this.expr.operator(this, expr);
    },
    parameterExpression: function parameterExpression(expr) {
      return this.expr.parameter(this, expr);
    },
    eventExpression: function eventExpression(expr) {
      return this.expr.event(this, expr);
    },
    handlerExpression: function handlerExpression(expr) {
      return this.expr.handler(this, expr);
    },
    encodeExpression: function encodeExpression(encode) {
      return this.expr.encode(this, encode);
    },
    // parse methods
    parse: parse$2,
    parseOperator: parseOperator,
    parseOperatorParameters: parseOperatorParameters,
    parseParameters: parseParameters$1,
    parseStream: parseStream$2,
    parseUpdate: parseUpdate$1,
    // state methods
    getState: getState$1,
    setState: setState$1
  };

  // initialize aria role and label attributes
  function initializeAria(view) {
    var el = view.container();
    if (el) {
      el.setAttribute('role', 'graphics-document');
      el.setAttribute('aria-roleDescription', 'visualization');
      ariaLabel(el, view.description());
    }
  }

  // update aria-label if we have a DOM container element
  function ariaLabel(el, desc) {
    if (el) desc == null ? el.removeAttribute('aria-label') : el.setAttribute('aria-label', desc);
  }
  function background(view) {
    // respond to background signal
    view.add(null, function (_) {
      view._background = _.bg;
      view._resize = 1;
      return _.bg;
    }, {
      bg: view._signals.background
    });
  }
  var Default = 'default';
  function cursor(view) {
    // get cursor signal, add to dataflow if needed
    var cursor = view._signals.cursor || (view._signals.cursor = view.add({
      user: Default,
      item: null
    }));

    // evaluate cursor on each mousemove event
    view.on(view.events('view', 'mousemove'), cursor, function (_, event) {
      var value = cursor.value,
        user = value ? isString(value) ? value : value.user : Default,
        item = event.item && event.item.cursor || null;
      return value && user === value.user && item == value.item ? value : {
        user: user,
        item: item
      };
    });

    // when cursor signal updates, set visible cursor
    view.add(null, function (_) {
      var user = _.cursor,
        item = this.value;
      if (!isString(user)) {
        item = user.item;
        user = user.user;
      }
      setCursor(view, user && user !== Default ? user : item || user);
      return item;
    }, {
      cursor: cursor
    });
  }
  function setCursor(view, cursor) {
    var el = view.globalCursor() ? typeof document !== 'undefined' && document.body : view.container();
    if (el) {
      return cursor == null ? el.style.removeProperty('cursor') : el.style.cursor = cursor;
    }
  }
  function dataref(view, name) {
    var data = view._runtime.data;
    if (!_has(data, name)) {
      error('Unrecognized data set: ' + name);
    }
    return data[name];
  }
  function data(name, values) {
    return arguments.length < 2 ? dataref(this, name).values.value : change.call(this, name, changeset().remove(truthy).insert(values));
  }
  function change(name, changes) {
    if (!isChangeSet(changes)) {
      error('Second argument to changes must be a changeset.');
    }
    var dataset = dataref(this, name);
    dataset.modified = true;
    return this.pulse(dataset.input, changes);
  }
  function insert(name, _) {
    return change.call(this, name, changeset().insert(_));
  }
  function remove(name, _) {
    return change.call(this, name, changeset().remove(_));
  }
  function width(view) {
    var padding = view.padding();
    return Math.max(0, view._viewWidth + padding.left + padding.right);
  }
  function height(view) {
    var padding = view.padding();
    return Math.max(0, view._viewHeight + padding.top + padding.bottom);
  }
  function offset(view) {
    var padding = view.padding(),
      origin = view._origin;
    return [padding.left + origin[0], padding.top + origin[1]];
  }
  function resizeRenderer(view) {
    var origin = offset(view),
      w = width(view),
      h = height(view);
    view._renderer.background(view.background());
    view._renderer.resize(w, h, origin);
    view._handler.origin(origin);
    view._resizeListeners.forEach(function (handler) {
      try {
        handler(w, h);
      } catch (error) {
        view.error(error);
      }
    });
  }

  /**
   * Extend an event with additional view-specific methods.
   * Adds a new property ('vega') to an event that provides a number
   * of methods for querying information about the current interaction.
   * The vega object provides the following methods:
   *   view - Returns the backing View instance.
   *   item - Returns the currently active scenegraph item (if any).
   *   group - Returns the currently active scenegraph group (if any).
   *     This method accepts a single string-typed argument indicating the name
   *     of the desired parent group. The scenegraph will be traversed from
   *     the item up towards the root to search for a matching group. If no
   *     argument is provided the enclosing group for the active item is
   *     returned, unless the item it itself a group, in which case it is
   *     returned directly.
   *   xy - Returns a two-element array containing the x and y coordinates for
   *     mouse or touch events. For touch events, this is based on the first
   *     elements in the changedTouches array. This method accepts a single
   *     argument: either an item instance or mark name that should serve as
   *     the reference coordinate system. If no argument is provided the
   *     top-level view coordinate system is assumed.
   *   x - Returns the current x-coordinate, accepts the same arguments as xy.
   *   y - Returns the current y-coordinate, accepts the same arguments as xy.
   * @param {Event} event - The input event to extend.
   * @param {Item} item - The currently active scenegraph item (if any).
   * @return {Event} - The extended input event.
   */
  function eventExtend(view, event, item) {
    var r = view._renderer,
      el = r && r.canvas(),
      p,
      e,
      translate;
    if (el) {
      translate = offset(view);
      e = event.changedTouches ? event.changedTouches[0] : event;
      p = point(e, el);
      p[0] -= translate[0];
      p[1] -= translate[1];
    }
    event.dataflow = view;
    event.item = item;
    event.vega = extension(view, item, p);
    return event;
  }
  function extension(view, item, point) {
    var itemGroup = item ? item.mark.marktype === 'group' ? item : item.mark.group : null;
    function group(name) {
      var g = itemGroup,
        i;
      if (name) for (i = item; i; i = i.mark.group) {
        if (i.mark.name === name) {
          g = i;
          break;
        }
      }
      return g && g.mark && g.mark.interactive ? g : {};
    }
    function xy(item) {
      if (!item) return point;
      if (isString(item)) item = group(item);
      var p = point.slice();
      while (item) {
        p[0] -= item.x || 0;
        p[1] -= item.y || 0;
        item = item.mark && item.mark.group;
      }
      return p;
    }
    return {
      view: constant$1(view),
      item: constant$1(item || {}),
      group: group,
      xy: xy,
      x: function x(item) {
        return xy(item)[0];
      },
      y: function y(item) {
        return xy(item)[1];
      }
    };
  }
  var VIEW$1 = 'view',
    TIMER = 'timer',
    WINDOW = 'window',
    NO_TRAP = {
      trap: false
    };

  /**
   * Initialize event handling configuration.
   * @param {object} config - The configuration settings.
   * @return {object}
   */
  function initializeEventConfig(config) {
    var events = extend({
      defaults: {}
    }, config);
    var unpack = function unpack(obj, keys) {
      keys.forEach(function (k) {
        if (isArray(obj[k])) obj[k] = toSet(obj[k]);
      });
    };
    unpack(events.defaults, ['prevent', 'allow']);
    unpack(events, ['view', 'window', 'selector']);
    return events;
  }
  function trackEventListener(view, sources, type, handler) {
    view._eventListeners.push({
      type: type,
      sources: array$2(sources),
      handler: handler
    });
  }
  function prevent(view, type) {
    var def = view._eventConfig.defaults,
      prevent = def.prevent,
      allow = def.allow;
    return prevent === false || allow === true ? false : prevent === true || allow === false ? true : prevent ? prevent[type] : allow ? !allow[type] : view.preventDefault();
  }
  function permit(view, key, type) {
    var rule = view._eventConfig && view._eventConfig[key];
    if (rule === false || isObject(rule) && !rule[type]) {
      view.warn("Blocked ".concat(key, " ").concat(type, " event listener."));
      return false;
    }
    return true;
  }

  /**
   * Create a new event stream from an event source.
   * @param {object} source - The event source to monitor.
   * @param {string} type - The event type.
   * @param {function(object): boolean} [filter] - Event filter function.
   * @return {EventStream}
   */
  function events(source, type, filter) {
    var view = this,
      s = new EventStream(filter),
      send = function send(e, item) {
        view.runAsync(null, function () {
          if (source === VIEW$1 && prevent(view, type)) {
            e.preventDefault();
          }
          s.receive(eventExtend(view, e, item));
        });
      },
      sources;
    if (source === TIMER) {
      if (permit(view, 'timer', type)) {
        view.timer(send, type);
      }
    } else if (source === VIEW$1) {
      if (permit(view, 'view', type)) {
        // send traps errors, so use {trap: false} option
        view.addEventListener(type, send, NO_TRAP);
      }
    } else {
      if (source === WINDOW) {
        if (permit(view, 'window', type) && typeof window !== 'undefined') {
          sources = [window];
        }
      } else if (typeof document !== 'undefined') {
        if (permit(view, 'selector', type)) {
          sources = Array.from(document.querySelectorAll(source));
        }
      }
      if (!sources) {
        view.warn('Can not resolve event source: ' + source);
      } else {
        for (var i = 0, n = sources.length; i < n; ++i) {
          sources[i].addEventListener(type, send);
        }
        trackEventListener(view, sources, type, send);
      }
    }
    return s;
  }
  function itemFilter(event) {
    return event.item;
  }
  function markTarget(event) {
    // grab upstream collector feeding the mark operator
    return event.item.mark.source;
  }
  function invoke(name) {
    return function (_, event) {
      return event.vega.view().changeset().encode(event.item, name);
    };
  }
  function hover(hoverSet, leaveSet) {
    hoverSet = [hoverSet || 'hover'];
    leaveSet = [leaveSet || 'update', hoverSet[0]];

    // invoke hover set upon mouseover
    this.on(this.events('view', 'mouseover', itemFilter), markTarget, invoke(hoverSet));

    // invoke leave set upon mouseout
    this.on(this.events('view', 'mouseout', itemFilter), markTarget, invoke(leaveSet));
    return this;
  }

  /**
   * Finalize a View instance that is being removed.
   * Cancel any running timers.
   * Remove all external event listeners.
   * Remove any currently displayed tooltip.
   */
  function finalize() {
    var tooltip = this._tooltip,
      timers = this._timers,
      listeners = this._eventListeners,
      n,
      m,
      e;
    n = timers.length;
    while (--n >= 0) {
      timers[n].stop();
    }
    n = listeners.length;
    while (--n >= 0) {
      e = listeners[n];
      m = e.sources.length;
      while (--m >= 0) {
        e.sources[m].removeEventListener(e.type, e.handler);
      }
    }
    if (tooltip) {
      tooltip.call(this, this._handler, null, null, null);
    }
    return this;
  }
  function element(tag, attr, text) {
    var el = document.createElement(tag);
    for (var key in attr) el.setAttribute(key, attr[key]);
    if (text != null) el.textContent = text;
    return el;
  }
  var BindClass = 'vega-bind',
    NameClass = 'vega-bind-name',
    RadioClass = 'vega-bind-radio';

  /**
   * Bind a signal to an external HTML input element. The resulting two-way
   * binding will propagate input changes to signals, and propagate signal
   * changes to the input element state. If this view instance has no parent
   * element, we assume the view is headless and no bindings are created.
   * @param {Element|string} el - The parent DOM element to which the input
   *   element should be appended as a child. If string-valued, this argument
   *   will be treated as a CSS selector. If null or undefined, the parent
   *   element of this view will be used as the element.
   * @param {object} param - The binding parameters which specify the signal
   *   to bind to, the input element type, and type-specific configuration.
   * @return {View} - This view instance.
   */
  function bind(view, el, binding) {
    if (!el) return;
    var param = binding.param;
    var bind = binding.state;
    if (!bind) {
      bind = binding.state = {
        elements: null,
        active: false,
        set: null,
        update: function update(value) {
          if (value != view.signal(param.signal)) {
            view.runAsync(null, function () {
              bind.source = true;
              view.signal(param.signal, value);
            });
          }
        }
      };
      if (param.debounce) {
        bind.update = debounce(param.debounce, bind.update);
      }
    }
    var create = param.input == null && param.element ? target : generate;
    create(bind, el, param, view);
    if (!bind.active) {
      view.on(view._signals[param.signal], null, function () {
        bind.source ? bind.source = false : bind.set(view.signal(param.signal));
      });
      bind.active = true;
    }
    return bind;
  }

  /**
   * Bind the signal to an external EventTarget.
   */
  function target(bind, node, param, view) {
    var type = param.event || 'input';
    var handler = function handler() {
      return bind.update(node.value);
    };

    // initialize signal value to external input value
    view.signal(param.signal, node.value);

    // listen for changes on the element
    node.addEventListener(type, handler);

    // register with view, so we can remove it upon finalization
    trackEventListener(view, node, type, handler);

    // propagate change to element
    bind.set = function (value) {
      node.value = value;
      node.dispatchEvent(event(type));
    };
  }
  function event(type) {
    return typeof Event !== 'undefined' ? new Event(type) : {
      type: type
    };
  }

  /**
   * Generate an HTML input form element and bind it to a signal.
   */
  function generate(bind, el, param, view) {
    var value = view.signal(param.signal);
    var div = element('div', {
      'class': BindClass
    });
    var wrapper = param.input === 'radio' ? div : div.appendChild(element('label'));
    wrapper.appendChild(element('span', {
      'class': NameClass
    }, param.name || param.signal));
    el.appendChild(div);
    var input = form;
    switch (param.input) {
      case 'checkbox':
        input = checkbox;
        break;
      case 'select':
        input = select;
        break;
      case 'radio':
        input = radio;
        break;
      case 'range':
        input = range;
        break;
    }
    input(bind, wrapper, param, value);
  }

  /**
   * Generates an arbitrary input form element.
   * The input type is controlled via user-provided parameters.
   */
  function form(bind, el, param, value) {
    var node = element('input');
    for (var key in param) {
      if (key !== 'signal' && key !== 'element') {
        node.setAttribute(key === 'input' ? 'type' : key, param[key]);
      }
    }
    node.setAttribute('name', param.signal);
    node.value = value;
    el.appendChild(node);
    node.addEventListener('input', function () {
      return bind.update(node.value);
    });
    bind.elements = [node];
    bind.set = function (value) {
      return node.value = value;
    };
  }

  /**
   * Generates a checkbox input element.
   */
  function checkbox(bind, el, param, value) {
    var attr = {
      type: 'checkbox',
      name: param.signal
    };
    if (value) attr.checked = true;
    var node = element('input', attr);
    el.appendChild(node);
    node.addEventListener('change', function () {
      return bind.update(node.checked);
    });
    bind.elements = [node];
    bind.set = function (value) {
      return node.checked = !!value || null;
    };
  }

  /**
   * Generates a selection list input element.
   */
  function select(bind, el, param, value) {
    var node = element('select', {
        name: param.signal
      }),
      labels = param.labels || [];
    param.options.forEach(function (option, i) {
      var attr = {
        value: option
      };
      if (valuesEqual(option, value)) attr.selected = true;
      node.appendChild(element('option', attr, (labels[i] || option) + ''));
    });
    el.appendChild(node);
    node.addEventListener('change', function () {
      bind.update(param.options[node.selectedIndex]);
    });
    bind.elements = [node];
    bind.set = function (value) {
      for (var i = 0, n = param.options.length; i < n; ++i) {
        if (valuesEqual(param.options[i], value)) {
          node.selectedIndex = i;
          return;
        }
      }
    };
  }

  /**
   * Generates a radio button group.
   */
  function radio(bind, el, param, value) {
    var group = element('span', {
        'class': RadioClass
      }),
      labels = param.labels || [];
    el.appendChild(group);
    bind.elements = param.options.map(function (option, i) {
      var attr = {
        type: 'radio',
        name: param.signal,
        value: option
      };
      if (valuesEqual(option, value)) attr.checked = true;
      var input = element('input', attr);
      input.addEventListener('change', function () {
        return bind.update(option);
      });
      var label = element('label', {}, (labels[i] || option) + '');
      label.prepend(input);
      group.appendChild(label);
      return input;
    });
    bind.set = function (value) {
      var nodes = bind.elements,
        n = nodes.length;
      for (var i = 0; i < n; ++i) {
        if (valuesEqual(nodes[i].value, value)) nodes[i].checked = true;
      }
    };
  }

  /**
   * Generates a slider input element.
   */
  function range(bind, el, param, value) {
    value = value !== undefined ? value : (+param.max + +param.min) / 2;
    var max = param.max != null ? param.max : Math.max(100, +value) || 100,
      min = param.min || Math.min(0, max, +value) || 0,
      step = param.step || d3Array.tickStep(min, max, 100);
    var node = element('input', {
      type: 'range',
      name: param.signal,
      min: min,
      max: max,
      step: step
    });
    node.value = value;
    var span = element('span', {}, +value);
    el.appendChild(node);
    el.appendChild(span);
    var update = function update() {
      span.textContent = node.value;
      bind.update(+node.value);
    };

    // subscribe to both input and change
    node.addEventListener('input', update);
    node.addEventListener('change', update);
    bind.elements = [node];
    bind.set = function (value) {
      node.value = value;
      span.textContent = value;
    };
  }
  function valuesEqual(a, b) {
    return a === b || a + '' === b + '';
  }
  function initializeRenderer(view, r, el, constructor, scaleFactor, opt) {
    r = r || new constructor(view.loader());
    return r.initialize(el, width(view), height(view), offset(view), scaleFactor, opt).background(view.background());
  }
  function trap(view, fn) {
    return !fn ? null : function () {
      try {
        fn.apply(this, arguments);
      } catch (error) {
        view.error(error);
      }
    };
  }
  function initializeHandler(view, prevHandler, el, constructor) {
    // instantiate scenegraph handler
    var handler = new constructor(view.loader(), trap(view, view.tooltip())).scene(view.scenegraph().root).initialize(el, offset(view), view);

    // transfer event handlers
    if (prevHandler) {
      prevHandler.handlers().forEach(function (h) {
        handler.on(h.type, h.handler);
      });
    }
    return handler;
  }
  function initialize(el, elBind) {
    var view = this,
      type = view._renderType,
      config = view._eventConfig.bind,
      module = renderModule(type);

    // containing dom element
    el = view._el = el ? lookup$1(view, el, true) : null;

    // initialize aria attributes
    initializeAria(view);

    // select appropriate renderer & handler
    if (!module) view.error('Unrecognized renderer type: ' + type);
    var Handler = module.handler || CanvasHandler,
      Renderer = el ? module.renderer : module.headless;

    // initialize renderer and input handler
    view._renderer = !Renderer ? null : initializeRenderer(view, view._renderer, el, Renderer);
    view._handler = initializeHandler(view, view._handler, el, Handler);
    view._redraw = true;

    // initialize signal bindings
    if (el && config !== 'none') {
      elBind = elBind ? view._elBind = lookup$1(view, elBind, true) : el.appendChild(element('form', {
        'class': 'vega-bindings'
      }));
      view._bind.forEach(function (_) {
        if (_.param.element && config !== 'container') {
          _.element = lookup$1(view, _.param.element, !!_.param.input);
        }
      });
      view._bind.forEach(function (_) {
        bind(view, _.element || elBind, _);
      });
    }
    return view;
  }
  function lookup$1(view, el, clear) {
    if (typeof el === 'string') {
      if (typeof document !== 'undefined') {
        el = document.querySelector(el);
        if (!el) {
          view.error('Signal bind element not found: ' + el);
          return null;
        }
      } else {
        view.error('DOM document instance not found.');
        return null;
      }
    }
    if (el && clear) {
      try {
        el.textContent = '';
      } catch (e) {
        el = null;
        view.error(e);
      }
    }
    return el;
  }
  var number$1 = function number(_) {
    return +_ || 0;
  };
  var paddingObject$1 = function paddingObject(_) {
    return {
      top: _,
      bottom: _,
      left: _,
      right: _
    };
  };
  function _padding(_) {
    return isObject(_) ? {
      top: number$1(_.top),
      bottom: number$1(_.bottom),
      left: number$1(_.left),
      right: number$1(_.right)
    } : paddingObject$1(number$1(_));
  }

  /**
   * Render the current scene in a headless fashion.
   * This method is asynchronous, returning a Promise instance.
   * @return {Promise} - A Promise that resolves to a renderer.
   */
  function renderHeadless(_x, _x2, _x3, _x4) {
    return _renderHeadless.apply(this, arguments);
  }
  /**
   * Produce an image URL for the visualization. Depending on the type
   * parameter, the generated URL contains data for either a PNG or SVG image.
   * The URL can be used (for example) to download images of the visualization.
   * This method is asynchronous, returning a Promise instance.
   * @param {string} type - The image type. One of 'svg', 'png' or 'canvas'.
   *   The 'canvas' and 'png' types are synonyms for a PNG image.
   * @return {Promise} - A promise that resolves to an image URL.
   */
  function _renderHeadless() {
    _renderHeadless = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(view, type, scaleFactor, opt) {
      var module, ctr;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            module = renderModule(type), ctr = module && module.headless;
            if (!ctr) error('Unrecognized renderer type: ' + type);
            _context2.next = 4;
            return view.runAsync();
          case 4:
            return _context2.abrupt("return", initializeRenderer(view, null, null, ctr, scaleFactor, opt).renderAsync(view._scenegraph.root));
          case 5:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return _renderHeadless.apply(this, arguments);
  }
  function renderToImageURL(_x5, _x6) {
    return _renderToImageURL.apply(this, arguments);
  }
  function _renderToImageURL() {
    _renderToImageURL = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(type, scaleFactor) {
      var r;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (type !== RenderType.Canvas && type !== RenderType.SVG && type !== RenderType.PNG) {
              error('Unrecognized image type: ' + type);
            }
            _context3.next = 3;
            return renderHeadless(this, type, scaleFactor);
          case 3:
            r = _context3.sent;
            return _context3.abrupt("return", type === RenderType.SVG ? toBlobURL(r.svg(), 'image/svg+xml') : r.canvas().toDataURL('image/png'));
          case 5:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));
    return _renderToImageURL.apply(this, arguments);
  }
  function toBlobURL(data, mime) {
    var blob = new Blob([data], {
      type: mime
    });
    return window.URL.createObjectURL(blob);
  }

  /**
   * Produce a Canvas instance containing a rendered visualization.
   * This method is asynchronous, returning a Promise instance.
   * @return {Promise} - A promise that resolves to a Canvas instance.
   */
  function renderToCanvas(_x7, _x8) {
    return _renderToCanvas.apply(this, arguments);
  }
  /**
   * Produce a rendered SVG string of the visualization.
   * This method is asynchronous, returning a Promise instance.
   * @return {Promise} - A promise that resolves to an SVG string.
   */
  function _renderToCanvas() {
    _renderToCanvas = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(scaleFactor, opt) {
      var r;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return renderHeadless(this, RenderType.Canvas, scaleFactor, opt);
          case 2:
            r = _context4.sent;
            return _context4.abrupt("return", r.canvas());
          case 4:
          case "end":
            return _context4.stop();
        }
      }, _callee4, this);
    }));
    return _renderToCanvas.apply(this, arguments);
  }
  function renderToSVG(_x9) {
    return _renderToSVG.apply(this, arguments);
  }
  function _renderToSVG() {
    _renderToSVG = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(scaleFactor) {
      var r;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return renderHeadless(this, RenderType.SVG, scaleFactor);
          case 2:
            r = _context5.sent;
            return _context5.abrupt("return", r.svg());
          case 4:
          case "end":
            return _context5.stop();
        }
      }, _callee5, this);
    }));
    return _renderToSVG.apply(this, arguments);
  }
  function runtime(view, spec, expr) {
    return context(view, transforms, functionContext, expr).parse(spec);
  }
  function scale$1(name) {
    var scales = this._runtime.scales;
    if (!_has(scales, name)) {
      error('Unrecognized scale or projection: ' + name);
    }
    return scales[name].value;
  }
  var Width = 'width',
    Height = 'height',
    Padding = 'padding',
    Skip$1 = {
      skip: true
    };
  function viewWidth(view, width) {
    var a = view.autosize(),
      p = view.padding();
    return width - (a && a.contains === Padding ? p.left + p.right : 0);
  }
  function viewHeight(view, height) {
    var a = view.autosize(),
      p = view.padding();
    return height - (a && a.contains === Padding ? p.top + p.bottom : 0);
  }
  function initializeResize(view) {
    var s = view._signals,
      w = s[Width],
      h = s[Height],
      p = s[Padding];
    function resetSize() {
      view._autosize = view._resize = 1;
    }

    // respond to width signal
    view._resizeWidth = view.add(null, function (_) {
      view._width = _.size;
      view._viewWidth = viewWidth(view, _.size);
      resetSize();
    }, {
      size: w
    });

    // respond to height signal
    view._resizeHeight = view.add(null, function (_) {
      view._height = _.size;
      view._viewHeight = viewHeight(view, _.size);
      resetSize();
    }, {
      size: h
    });

    // respond to padding signal
    var resizePadding = view.add(null, resetSize, {
      pad: p
    });

    // set rank to run immediately after source signal
    view._resizeWidth.rank = w.rank + 1;
    view._resizeHeight.rank = h.rank + 1;
    resizePadding.rank = p.rank + 1;
  }
  function resizeView(viewWidth, viewHeight, width, height, origin, auto) {
    this.runAfter(function (view) {
      var rerun = 0;

      // reset autosize flag
      view._autosize = 0;

      // width value changed: update signal, skip resize op
      if (view.width() !== width) {
        rerun = 1;
        view.signal(Width, width, Skip$1); // set width, skip update calc
        view._resizeWidth.skip(true); // skip width resize handler
      }

      // height value changed: update signal, skip resize op
      if (view.height() !== height) {
        rerun = 1;
        view.signal(Height, height, Skip$1); // set height, skip update calc
        view._resizeHeight.skip(true); // skip height resize handler
      }

      // view width changed: update view property, set resize flag
      if (view._viewWidth !== viewWidth) {
        view._resize = 1;
        view._viewWidth = viewWidth;
      }

      // view height changed: update view property, set resize flag
      if (view._viewHeight !== viewHeight) {
        view._resize = 1;
        view._viewHeight = viewHeight;
      }

      // origin changed: update view property, set resize flag
      if (view._origin[0] !== origin[0] || view._origin[1] !== origin[1]) {
        view._resize = 1;
        view._origin = origin;
      }

      // run dataflow on width/height signal change
      if (rerun) view.run('enter');
      if (auto) view.runAfter(function (v) {
        return v.resize();
      });
    }, false, 1);
  }

  /**
   * Get the current view state, consisting of signal values and/or data sets.
   * @param {object} [options] - Options flags indicating which state to export.
   *   If unspecified, all signals and data sets will be exported.
   * @param {function(string, Operator):boolean} [options.signals] - Optional
   *   predicate function for testing if a signal should be included in the
   *   exported state. If unspecified, all signals will be included, except for
   *   those named 'parent' or those which refer to a Transform value.
   * @param {function(string, object):boolean} [options.data] - Optional
   *   predicate function for testing if a data set's input should be included
   *   in the exported state. If unspecified, all data sets that have been
   *   explicitly modified will be included.
   * @param {boolean} [options.recurse=true] - Flag indicating if the exported
   *   state should recursively include state from group mark sub-contexts.
   * @return {object} - An object containing the exported state values.
   */
  function getState(options) {
    return this._runtime.getState(options || {
      data: dataTest,
      signals: signalTest,
      recurse: true
    });
  }
  function dataTest(name, data) {
    return data.modified && isArray(data.input.value) && name.indexOf('_:vega:_');
  }
  function signalTest(name, op) {
    return !(name === 'parent' || op instanceof transforms.proxy);
  }

  /**
   * Sets the current view state and updates the view by invoking run.
   * @param {object} state - A state object containing signal and/or
   *   data set values, following the format used by the getState method.
   * @return {View} - This view instance.
   */
  function setState(state) {
    this.runAsync(null, function (v) {
      v._trigger = false;
      v._runtime.setState(state);
    }, function (v) {
      v._trigger = true;
    });
    return this;
  }
  function timer(callback, delay) {
    function tick(elapsed) {
      callback({
        timestamp: Date.now(),
        elapsed: elapsed
      });
    }
    this._timers.push(d3Timer.interval(tick, delay));
  }
  function defaultTooltip(handler, event, item, value) {
    var el = handler.element();
    if (el) el.setAttribute('title', formatTooltip(value));
  }
  function formatTooltip(value) {
    return value == null ? '' : isArray(value) ? formatArray(value) : isObject(value) && !isDate$1(value) ? formatObject(value) : value + '';
  }
  function formatObject(obj) {
    return Object.keys(obj).map(function (key) {
      var v = obj[key];
      return key + ': ' + (isArray(v) ? formatArray(v) : formatValue(v));
    }).join('\n');
  }
  function formatArray(value) {
    return '[' + value.map(formatValue).join(', ') + ']';
  }
  function formatValue(value) {
    return isArray(value) ? "[\u2026]" : isObject(value) && !isDate$1(value) ? "{\u2026}" : value;
  }

  /**
   * Create a new View instance from a Vega dataflow runtime specification.
   * The generated View will not immediately be ready for display. Callers
   * should also invoke the initialize method (e.g., to set the parent
   * DOM element in browser-based deployment) and then invoke the run
   * method to evaluate the dataflow graph. Rendering will automatically
   * be performed upon dataflow runs.
   * @constructor
   * @param {object} spec - The Vega dataflow runtime specification.
   */
  function View$1(spec, options) {
    var view = this;
    options = options || {};
    Dataflow.call(view);
    if (options.loader) view.loader(options.loader);
    if (options.logger) view.logger(options.logger);
    if (options.logLevel != null) view.logLevel(options.logLevel);
    if (options.locale || spec.locale) {
      var loc = extend({}, spec.locale, options.locale);
      view.locale(locale(loc.number, loc.time));
    }
    view._el = null;
    view._elBind = null;
    view._renderType = options.renderer || RenderType.Canvas;
    view._scenegraph = new Scenegraph();
    var root = view._scenegraph.root;

    // initialize renderer, handler and event management
    view._renderer = null;
    view._tooltip = options.tooltip || defaultTooltip, view._redraw = true;
    view._handler = new CanvasHandler().scene(root);
    view._globalCursor = false;
    view._preventDefault = false;
    view._timers = [];
    view._eventListeners = [];
    view._resizeListeners = [];

    // initialize event configuration
    view._eventConfig = initializeEventConfig(spec.eventConfig);
    view.globalCursor(view._eventConfig.globalCursor);

    // initialize dataflow graph
    var ctx = runtime(view, spec, options.expr);
    view._runtime = ctx;
    view._signals = ctx.signals;
    view._bind = (spec.bindings || []).map(function (_) {
      return {
        state: null,
        param: extend({}, _)
      };
    });

    // initialize scenegraph
    if (ctx.root) ctx.root.set(root);
    root.source = ctx.data.root.input;
    view.pulse(ctx.data.root.input, view.changeset().insert(root.items));

    // initialize view size
    view._width = view.width();
    view._height = view.height();
    view._viewWidth = viewWidth(view, view._width);
    view._viewHeight = viewHeight(view, view._height);
    view._origin = [0, 0];
    view._resize = 0;
    view._autosize = 1;
    initializeResize(view);

    // initialize background color
    background(view);

    // initialize cursor
    cursor(view);

    // initialize view description
    view.description(spec.description);

    // initialize hover proessing, if requested
    if (options.hover) view.hover();

    // initialize DOM container(s) and renderer
    if (options.container) view.initialize(options.container, options.bind);
  }
  function lookupSignal(view, name) {
    return _has(view._signals, name) ? view._signals[name] : error('Unrecognized signal name: ' + $(name));
  }
  function findOperatorHandler(op, handler) {
    var h = (op._targets || []).filter(function (op) {
      return op._update && op._update.handler === handler;
    });
    return h.length ? h[0] : null;
  }
  function addOperatorListener(view, name, op, handler) {
    var h = findOperatorHandler(op, handler);
    if (!h) {
      h = trap(view, function () {
        return handler(name, op.value);
      });
      h.handler = handler;
      view.on(op, null, h);
    }
    return view;
  }
  function removeOperatorListener(view, op, handler) {
    var h = findOperatorHandler(op, handler);
    if (h) op._targets.remove(h);
    return view;
  }
  inherits(View$1, Dataflow, {
    // -- DATAFLOW / RENDERING ----
    evaluate: function evaluate(encode, prerun, postrun) {
      var _this = this;
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return Dataflow.prototype.evaluate.call(_this, encode, prerun);
            case 2:
              if (!(_this._redraw || _this._resize)) {
                _context.next = 14;
                break;
              }
              _context.prev = 3;
              if (!_this._renderer) {
                _context.next = 8;
                break;
              }
              if (_this._resize) {
                _this._resize = 0;
                resizeRenderer(_this);
              }
              _context.next = 8;
              return _this._renderer.renderAsync(_this._scenegraph.root);
            case 8:
              _this._redraw = false;
              _context.next = 14;
              break;
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](3);
              _this.error(_context.t0);
            case 14:
              // evaluate postrun
              if (postrun) asyncCallback(_this, postrun);
              return _context.abrupt("return", _this);
            case 16:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[3, 11]]);
      }))();
    },
    dirty: function dirty(item) {
      this._redraw = true;
      this._renderer && this._renderer.dirty(item);
    },
    // -- GET / SET ----
    description: function description(text) {
      if (arguments.length) {
        var desc = text != null ? text + '' : null;
        if (desc !== this._desc) ariaLabel(this._el, this._desc = desc);
        return this;
      }
      return this._desc;
    },
    container: function container() {
      return this._el;
    },
    scenegraph: function scenegraph() {
      return this._scenegraph;
    },
    origin: function origin() {
      return this._origin.slice();
    },
    signal: function signal(name, value, options) {
      var op = lookupSignal(this, name);
      return arguments.length === 1 ? op.value : this.update(op, value, options);
    },
    width: function width(_) {
      return arguments.length ? this.signal('width', _) : this.signal('width');
    },
    height: function height(_) {
      return arguments.length ? this.signal('height', _) : this.signal('height');
    },
    padding: function padding(_) {
      return arguments.length ? this.signal('padding', _padding(_)) : _padding(this.signal('padding'));
    },
    autosize: function autosize(_) {
      return arguments.length ? this.signal('autosize', _) : this.signal('autosize');
    },
    background: function background(_) {
      return arguments.length ? this.signal('background', _) : this.signal('background');
    },
    renderer: function renderer(type) {
      if (!arguments.length) return this._renderType;
      if (!renderModule(type)) error('Unrecognized renderer type: ' + type);
      if (type !== this._renderType) {
        this._renderType = type;
        this._resetRenderer();
      }
      return this;
    },
    tooltip: function tooltip(handler) {
      if (!arguments.length) return this._tooltip;
      if (handler !== this._tooltip) {
        this._tooltip = handler;
        this._resetRenderer();
      }
      return this;
    },
    loader: function loader(_loader) {
      if (!arguments.length) return this._loader;
      if (_loader !== this._loader) {
        Dataflow.prototype.loader.call(this, _loader);
        this._resetRenderer();
      }
      return this;
    },
    resize: function resize() {
      // set flag to perform autosize
      this._autosize = 1;
      // touch autosize signal to ensure top-level ViewLayout runs
      return this.touch(lookupSignal(this, 'autosize'));
    },
    _resetRenderer: function _resetRenderer() {
      if (this._renderer) {
        this._renderer = null;
        this.initialize(this._el, this._elBind);
      }
    },
    // -- SIZING ----
    _resizeView: resizeView,
    // -- EVENT HANDLING ----
    addEventListener: function addEventListener(type, handler, options) {
      var callback = handler;
      if (!(options && options.trap === false)) {
        // wrap callback in error handler
        callback = trap(this, handler);
        callback.raw = handler;
      }
      this._handler.on(type, callback);
      return this;
    },
    removeEventListener: function removeEventListener(type, handler) {
      var handlers = this._handler.handlers(type),
        i = handlers.length,
        h,
        t;

      // search registered handlers, remove if match found
      while (--i >= 0) {
        t = handlers[i].type;
        h = handlers[i].handler;
        if (type === t && (handler === h || handler === h.raw)) {
          this._handler.off(t, h);
          break;
        }
      }
      return this;
    },
    addResizeListener: function addResizeListener(handler) {
      var l = this._resizeListeners;
      if (l.indexOf(handler) < 0) {
        // add handler if it isn't already registered
        // note: error trapping handled elsewhere, so
        // no need to wrap handlers here
        l.push(handler);
      }
      return this;
    },
    removeResizeListener: function removeResizeListener(handler) {
      var l = this._resizeListeners,
        i = l.indexOf(handler);
      if (i >= 0) {
        l.splice(i, 1);
      }
      return this;
    },
    addSignalListener: function addSignalListener(name, handler) {
      return addOperatorListener(this, name, lookupSignal(this, name), handler);
    },
    removeSignalListener: function removeSignalListener(name, handler) {
      return removeOperatorListener(this, lookupSignal(this, name), handler);
    },
    addDataListener: function addDataListener(name, handler) {
      return addOperatorListener(this, name, dataref(this, name).values, handler);
    },
    removeDataListener: function removeDataListener(name, handler) {
      return removeOperatorListener(this, dataref(this, name).values, handler);
    },
    globalCursor: function globalCursor(_) {
      if (arguments.length) {
        if (this._globalCursor !== !!_) {
          var prev = setCursor(this, null); // clear previous cursor
          this._globalCursor = !!_;
          if (prev) setCursor(this, prev); // swap cursor
        }

        return this;
      } else {
        return this._globalCursor;
      }
    },
    preventDefault: function preventDefault(_) {
      if (arguments.length) {
        this._preventDefault = _;
        return this;
      } else {
        return this._preventDefault;
      }
    },
    timer: timer,
    events: events,
    finalize: finalize,
    hover: hover,
    // -- DATA ----
    data: data,
    change: change,
    insert: insert,
    remove: remove,
    // -- SCALES --
    scale: scale$1,
    // -- INITIALIZATION ----
    initialize: initialize,
    // -- HEADLESS RENDERING ----
    toImageURL: renderToImageURL,
    toCanvas: renderToCanvas,
    toSVG: renderToSVG,
    // -- SAVE / RESTORE STATE ----
    getState: getState,
    setState: setState
  });

  var VIEW = 'view',
    LBRACK = '[',
    RBRACK = ']',
    LBRACE = '{',
    RBRACE = '}',
    COLON = ':',
    COMMA = ',',
    NAME = '@',
    GT = '>',
    ILLEGAL = /[[\]{}]/,
    DEFAULT_MARKS = {
      '*': 1,
      arc: 1,
      area: 1,
      group: 1,
      image: 1,
      line: 1,
      path: 1,
      rect: 1,
      rule: 1,
      shape: 1,
      symbol: 1,
      text: 1,
      trail: 1
    };
  var DEFAULT_SOURCE, MARKS;

  /**
   * Parse an event selector string.
   * Returns an array of event stream definitions.
   */
  function eventSelector(selector, source, marks) {
    DEFAULT_SOURCE = source || VIEW;
    MARKS = marks || DEFAULT_MARKS;
    return parseMerge(selector.trim()).map(parseSelector);
  }
  function isMarkType(type) {
    return MARKS[type];
  }
  function find(s, i, endChar, pushChar, popChar) {
    var n = s.length;
    var count = 0,
      c;
    for (; i < n; ++i) {
      c = s[i];
      if (!count && c === endChar) return i;else if (popChar && popChar.indexOf(c) >= 0) --count;else if (pushChar && pushChar.indexOf(c) >= 0) ++count;
    }
    return i;
  }
  function parseMerge(s) {
    var output = [],
      n = s.length;
    var start = 0,
      i = 0;
    while (i < n) {
      i = find(s, i, COMMA, LBRACK + LBRACE, RBRACK + RBRACE);
      output.push(s.substring(start, i).trim());
      start = ++i;
    }
    if (output.length === 0) {
      throw 'Empty event selector: ' + s;
    }
    return output;
  }
  function parseSelector(s) {
    return s[0] === '[' ? parseBetween(s) : parseStream$1(s);
  }
  function parseBetween(s) {
    var n = s.length;
    var i = 1,
      b;
    i = find(s, i, RBRACK, LBRACK, RBRACK);
    if (i === n) {
      throw 'Empty between selector: ' + s;
    }
    b = parseMerge(s.substring(1, i));
    if (b.length !== 2) {
      throw 'Between selector must have two elements: ' + s;
    }
    s = s.slice(i + 1).trim();
    if (s[0] !== GT) {
      throw 'Expected \'>\' after between selector: ' + s;
    }
    b = b.map(parseSelector);
    var stream = parseSelector(s.slice(1).trim());
    if (stream.between) {
      return {
        between: b,
        stream: stream
      };
    } else {
      stream.between = b;
    }
    return stream;
  }
  function parseStream$1(s) {
    var stream = {
        source: DEFAULT_SOURCE
      },
      source = [];
    var throttle = [0, 0],
      markname = 0,
      start = 0,
      n = s.length,
      i = 0,
      j,
      filter;

    // extract throttle from end
    if (s[n - 1] === RBRACE) {
      i = s.lastIndexOf(LBRACE);
      if (i >= 0) {
        try {
          throttle = parseThrottle(s.substring(i + 1, n - 1));
        } catch (e) {
          throw 'Invalid throttle specification: ' + s;
        }
        s = s.slice(0, i).trim();
        n = s.length;
      } else throw 'Unmatched right brace: ' + s;
      i = 0;
    }
    if (!n) throw s;

    // set name flag based on first char
    if (s[0] === NAME) markname = ++i;

    // extract first part of multi-part stream selector
    j = find(s, i, COLON);
    if (j < n) {
      source.push(s.substring(start, j).trim());
      start = i = ++j;
    }

    // extract remaining part of stream selector
    i = find(s, i, LBRACK);
    if (i === n) {
      source.push(s.substring(start, n).trim());
    } else {
      source.push(s.substring(start, i).trim());
      filter = [];
      start = ++i;
      if (start === n) throw 'Unmatched left bracket: ' + s;
    }

    // extract filters
    while (i < n) {
      i = find(s, i, RBRACK);
      if (i === n) throw 'Unmatched left bracket: ' + s;
      filter.push(s.substring(start, i).trim());
      if (i < n - 1 && s[++i] !== LBRACK) throw 'Expected left bracket: ' + s;
      start = ++i;
    }

    // marshall event stream specification
    if (!(n = source.length) || ILLEGAL.test(source[n - 1])) {
      throw 'Invalid event selector: ' + s;
    }
    if (n > 1) {
      stream.type = source[1];
      if (markname) {
        stream.markname = source[0].slice(1);
      } else if (isMarkType(source[0])) {
        stream.marktype = source[0];
      } else {
        stream.source = source[0];
      }
    } else {
      stream.type = source[0];
    }
    if (stream.type.slice(-1) === '!') {
      stream.consume = true;
      stream.type = stream.type.slice(0, -1);
    }
    if (filter != null) stream.filter = filter;
    if (throttle[0]) stream.throttle = throttle[0];
    if (throttle[1]) stream.debounce = throttle[1];
    return stream;
  }
  function parseThrottle(s) {
    var a = s.split(COMMA);
    if (!s.length || a.length > 2) throw s;
    return a.map(function (_) {
      var x = +_;
      if (x !== x) throw s;
      return x;
    });
  }

  function parseAutosize(spec) {
    return isObject(spec) ? spec : {
      type: spec || 'pad'
    };
  }
  var number = function number(_) {
    return +_ || 0;
  };
  var paddingObject = function paddingObject(_) {
    return {
      top: _,
      bottom: _,
      left: _,
      right: _
    };
  };
  function parsePadding(spec) {
    return !isObject(spec) ? paddingObject(number(spec)) : spec.signal ? spec : {
      top: number(spec.top),
      bottom: number(spec.bottom),
      left: number(spec.left),
      right: number(spec.right)
    };
  }
  var encoder = function encoder(_) {
    return isObject(_) && !isArray(_) ? extend({}, _) : {
      value: _
    };
  };
  function addEncode(object, name, value, set) {
    if (value != null) {
      var isEncoder = isObject(value) && !isArray(value) || isArray(value) && value.length && isObject(value[0]);

      // Always assign signal to update, even if the signal is from the enter block
      if (isEncoder) {
        object.update[name] = value;
      } else {
        object[set || 'enter'][name] = {
          value: value
        };
      }
      return 1;
    } else {
      return 0;
    }
  }
  function addEncoders(object, enter, update) {
    for (var name in enter) {
      addEncode(object, name, enter[name]);
    }
    for (var _name in update) {
      addEncode(object, _name, update[_name], 'update');
    }
  }
  function extendEncode(encode, extra, skip) {
    for (var name in extra) {
      if (skip && _has(skip, name)) continue;
      encode[name] = extend(encode[name] || {}, extra[name]);
    }
    return encode;
  }
  function has(key, encode) {
    return encode && (encode.enter && encode.enter[key] || encode.update && encode.update[key]);
  }
  var MarkRole = 'mark';
  var FrameRole = 'frame';
  var ScopeRole = 'scope';
  var AxisRole = 'axis';
  var AxisDomainRole = 'axis-domain';
  var AxisGridRole = 'axis-grid';
  var AxisLabelRole = 'axis-label';
  var AxisTickRole = 'axis-tick';
  var AxisTitleRole = 'axis-title';
  var LegendRole = 'legend';
  var LegendBandRole = 'legend-band';
  var LegendEntryRole = 'legend-entry';
  var LegendGradientRole = 'legend-gradient';
  var LegendLabelRole = 'legend-label';
  var LegendSymbolRole = 'legend-symbol';
  var LegendTitleRole = 'legend-title';
  var TitleRole = 'title';
  var TitleTextRole = 'title-text';
  var TitleSubtitleRole = 'title-subtitle';
  function applyDefaults(encode, type, role, style, config) {
    var defaults = {},
      enter = {};
    var update, key, skip, props;

    // if text mark, apply global lineBreak settings (#2370)
    key = 'lineBreak';
    if (type === 'text' && config[key] != null && !has(key, encode)) {
      applyDefault(defaults, key, config[key]);
    }

    // ignore legend and axis roles
    if (role == 'legend' || String(role).startsWith('axis')) {
      role = null;
    }

    // resolve mark config
    props = role === FrameRole ? config.group : role === MarkRole ? extend({}, config.mark, config[type]) : null;
    for (key in props) {
      // do not apply defaults if relevant fields are defined
      skip = has(key, encode) || (key === 'fill' || key === 'stroke') && (has('fill', encode) || has('stroke', encode));
      if (!skip) applyDefault(defaults, key, props[key]);
    }

    // resolve styles, apply with increasing precedence
    array$2(style).forEach(function (name) {
      var props = config.style && config.style[name];
      for (var _key in props) {
        if (!has(_key, encode)) {
          applyDefault(defaults, _key, props[_key]);
        }
      }
    });
    encode = extend({}, encode); // defensive copy
    for (key in defaults) {
      props = defaults[key];
      if (props.signal) {
        (update = update || {})[key] = props;
      } else {
        enter[key] = props;
      }
    }
    encode.enter = extend(enter, encode.enter);
    if (update) encode.update = extend(update, encode.update);
    return encode;
  }
  function applyDefault(defaults, key, value) {
    defaults[key] = value && value.signal ? {
      signal: value.signal
    } : {
      value: value
    };
  }
  var scaleRef = function scaleRef(scale) {
    return isString(scale) ? $(scale) : scale.signal ? "(".concat(scale.signal, ")") : field(scale);
  };
  function entry$1(enc) {
    if (enc.gradient != null) {
      return gradient(enc);
    }
    var value = enc.signal ? "(".concat(enc.signal, ")") : enc.color ? color(enc.color) : enc.field != null ? field(enc.field) : enc.value !== undefined ? $(enc.value) : undefined;
    if (enc.scale != null) {
      value = scale(enc, value);
    }
    if (value === undefined) {
      value = null;
    }
    if (enc.exponent != null) {
      value = "pow(".concat(value, ",").concat(property(enc.exponent), ")");
    }
    if (enc.mult != null) {
      value += "*".concat(property(enc.mult));
    }
    if (enc.offset != null) {
      value += "+".concat(property(enc.offset));
    }
    if (enc.round) {
      value = "round(".concat(value, ")");
    }
    return value;
  }
  var _color = function _color(type, x, y, z) {
    return "(".concat(type, "(").concat([x, y, z].map(entry$1).join(','), ")+'')");
  };
  function color(enc) {
    return enc.c ? _color('hcl', enc.h, enc.c, enc.l) : enc.h || enc.s ? _color('hsl', enc.h, enc.s, enc.l) : enc.l || enc.a ? _color('lab', enc.l, enc.a, enc.b) : enc.r || enc.g || enc.b ? _color('rgb', enc.r, enc.g, enc.b) : null;
  }
  function gradient(enc) {
    // map undefined to null; expression lang does not allow undefined
    var args = [enc.start, enc.stop, enc.count].map(function (_) {
      return _ == null ? null : $(_);
    });

    // trim null inputs from the end
    while (args.length && peek$1(args) == null) args.pop();
    args.unshift(scaleRef(enc.gradient));
    return "gradient(".concat(args.join(','), ")");
  }
  function property(property) {
    return isObject(property) ? '(' + entry$1(property) + ')' : property;
  }
  function field(ref) {
    return resolveField(isObject(ref) ? ref : {
      datum: ref
    });
  }
  function resolveField(ref) {
    var object, level, field;
    if (ref.signal) {
      object = 'datum';
      field = ref.signal;
    } else if (ref.group || ref.parent) {
      level = Math.max(1, ref.level || 1);
      object = 'item';
      while (level-- > 0) {
        object += '.mark.group';
      }
      if (ref.parent) {
        field = ref.parent;
        object += '.datum';
      } else {
        field = ref.group;
      }
    } else if (ref.datum) {
      object = 'datum';
      field = ref.datum;
    } else {
      error('Invalid field reference: ' + $(ref));
    }
    if (!ref.signal) {
      field = isString(field) ? splitAccessPath(field).map($).join('][') : resolveField(field);
    }
    return object + '[' + field + ']';
  }
  function scale(enc, value) {
    var scale = scaleRef(enc.scale);
    if (enc.range != null) {
      // pull value from scale range
      value = "lerp(_range(".concat(scale, "), ").concat(+enc.range, ")");
    } else {
      // run value through scale and/or pull scale bandwidth
      if (value !== undefined) value = "_scale(".concat(scale, ", ").concat(value, ")");
      if (enc.band) {
        value = (value ? value + '+' : '') + "_bandwidth(".concat(scale, ")") + (+enc.band === 1 ? '' : '*' + property(enc.band));
        if (enc.extra) {
          // include logic to handle extraneous elements
          value = "(datum.extra ? _scale(".concat(scale, ", datum.extra.value) : ").concat(value, ")");
        }
      }
      if (value == null) value = '0';
    }
    return value;
  }
  function rule(enc) {
    var code = '';
    enc.forEach(function (rule) {
      var value = entry$1(rule);
      code += rule.test ? "(".concat(rule.test, ")?").concat(value, ":") : value;
    });

    // if no else clause, terminate with null (#1366)
    if (peek$1(code) === ':') {
      code += 'null';
    }
    return code;
  }
  function parseEncode(encode, type, role, style, scope, params) {
    var enc = {};
    params = params || {};
    params.encoders = {
      $encode: enc
    };
    encode = applyDefaults(encode, type, role, style, scope.config);
    for (var key in encode) {
      enc[key] = parseBlock(encode[key], type, params, scope);
    }
    return params;
  }
  function parseBlock(block, marktype, params, scope) {
    var channels = {},
      fields = {};
    for (var name in block) {
      if (block[name] != null) {
        // skip any null entries
        channels[name] = parse$1(expr(block[name]), scope, params, fields);
      }
    }
    return {
      $expr: {
        marktype: marktype,
        channels: channels
      },
      $fields: Object.keys(fields),
      $output: Object.keys(block)
    };
  }
  function expr(enc) {
    return isArray(enc) ? rule(enc) : entry$1(enc);
  }
  function parse$1(code, scope, params, fields) {
    var expr = parser(code, scope);
    expr.$fields.forEach(function (name) {
      return fields[name] = 1;
    });
    extend(params, expr.$params);
    return expr.$expr;
  }
  var OUTER = 'outer',
    OUTER_INVALID = ['value', 'update', 'init', 'react', 'bind'];
  function outerError(prefix, name) {
    error(prefix + ' for "outer" push: ' + $(name));
  }
  function parseSignal(signal, scope) {
    var name = signal.name;
    if (signal.push === OUTER) {
      // signal must already be defined, raise error if not
      if (!scope.signals[name]) outerError('No prior signal definition', name);
      // signal push must not use properties reserved for standard definition
      OUTER_INVALID.forEach(function (prop) {
        if (signal[prop] !== undefined) outerError('Invalid property ', prop);
      });
    } else {
      // define a new signal in the current scope
      var op = scope.addSignal(name, signal.value);
      if (signal.react === false) op.react = false;
      if (signal.bind) scope.addBinding(name, signal.bind);
    }
  }
  function Entry(type, value, params, parent) {
    this.id = -1;
    this.type = type;
    this.value = value;
    this.params = params;
    if (parent) this.parent = parent;
  }
  function entry(type, value, params, parent) {
    return new Entry(type, value, params, parent);
  }
  function operator(value, params) {
    return entry('operator', value, params);
  }

  // -----

  function ref(op) {
    var ref = {
      $ref: op.id
    };
    // if operator not yet registered, cache ref to resolve later
    if (op.id < 0) (op.refs = op.refs || []).push(ref);
    return ref;
  }
  function fieldRef$1(field, name) {
    return name ? {
      $field: field,
      $name: name
    } : {
      $field: field
    };
  }
  var keyFieldRef = fieldRef$1('key');
  function _compareRef(fields, orders) {
    return {
      $compare: fields,
      $order: orders
    };
  }
  function _keyRef(fields, flat) {
    var ref = {
      $key: fields
    };
    if (flat) ref.$flat = true;
    return ref;
  }

  // -----

  var Ascending = 'ascending';
  var Descending = 'descending';
  function sortKey(sort) {
    return !isObject(sort) ? '' : (sort.order === Descending ? '-' : '+') + aggrField(sort.op, sort.field);
  }
  function aggrField(op, field) {
    return (op && op.signal ? '$' + op.signal : op || '') + (op && field ? '_' : '') + (field && field.signal ? '$' + field.signal : field || '');
  }

  // -----

  var Scope$1 = 'scope';
  var View = 'view';
  function isSignal(_) {
    return _ && _.signal;
  }
  function isExpr$1(_) {
    return _ && _.expr;
  }
  function hasSignal(_) {
    if (isSignal(_)) return true;
    if (isObject(_)) for (var key in _) {
      if (hasSignal(_[key])) return true;
    }
    return false;
  }
  function value(specValue, defaultValue) {
    return specValue != null ? specValue : defaultValue;
  }
  function deref(v) {
    return v && v.signal || v;
  }
  var Timer = 'timer';
  function parseStream(stream, scope) {
    var method = stream.merge ? mergeStream : stream.stream ? nestedStream : stream.type ? eventStream : error('Invalid stream specification: ' + $(stream));
    return method(stream, scope);
  }
  function eventSource(source) {
    return source === Scope$1 ? View : source || View;
  }
  function mergeStream(stream, scope) {
    var list = stream.merge.map(function (s) {
        return parseStream(s, scope);
      }),
      entry = streamParameters({
        merge: list
      }, stream, scope);
    return scope.addStream(entry).id;
  }
  function nestedStream(stream, scope) {
    var id = parseStream(stream.stream, scope),
      entry = streamParameters({
        stream: id
      }, stream, scope);
    return scope.addStream(entry).id;
  }
  function eventStream(stream, scope) {
    var id;
    if (stream.type === Timer) {
      id = scope.event(Timer, stream.throttle);
      stream = {
        between: stream.between,
        filter: stream.filter
      };
    } else {
      id = scope.event(eventSource(stream.source), stream.type);
    }
    var entry = streamParameters({
      stream: id
    }, stream, scope);
    return Object.keys(entry).length === 1 ? id : scope.addStream(entry).id;
  }
  function streamParameters(entry, stream, scope) {
    var param = stream.between;
    if (param) {
      if (param.length !== 2) {
        error('Stream "between" parameter must have 2 entries: ' + $(stream));
      }
      entry.between = [parseStream(param[0], scope), parseStream(param[1], scope)];
    }
    param = stream.filter ? [].concat(stream.filter) : [];
    if (stream.marktype || stream.markname || stream.markrole) {
      // add filter for mark type, name and/or role
      param.push(filterMark(stream.marktype, stream.markname, stream.markrole));
    }
    if (stream.source === Scope$1) {
      // add filter to limit events from sub-scope only
      param.push('inScope(event.item)');
    }
    if (param.length) {
      entry.filter = parser('(' + param.join(')&&(') + ')', scope).$expr;
    }
    if ((param = stream.throttle) != null) {
      entry.throttle = +param;
    }
    if ((param = stream.debounce) != null) {
      entry.debounce = +param;
    }
    if (stream.consume) {
      entry.consume = true;
    }
    return entry;
  }
  function filterMark(type, name, role) {
    var item = 'event.item';
    return item + (type && type !== '*' ? '&&' + item + '.mark.marktype===\'' + type + '\'' : '') + (role ? '&&' + item + '.mark.role===\'' + role + '\'' : '') + (name ? '&&' + item + '.mark.name===\'' + name + '\'' : '');
  }

  // bypass expression parser for internal operator references
  var OP_VALUE_EXPR = {
    code: '_.$value',
    ast: {
      type: 'Identifier',
      value: 'value'
    }
  };
  function parseUpdate(spec, scope, target) {
    var encode = spec.encode,
      entry = {
        target: target
      };
    var events = spec.events,
      update = spec.update,
      sources = [];
    if (!events) {
      error('Signal update missing events specification.');
    }

    // interpret as an event selector string
    if (isString(events)) {
      events = eventSelector(events, scope.isSubscope() ? Scope$1 : View);
    }

    // separate event streams from signal updates
    events = array$2(events).filter(function (s) {
      return s.signal || s.scale ? (sources.push(s), 0) : 1;
    });

    // merge internal operator listeners
    if (sources.length > 1) {
      sources = [mergeSources(sources)];
    }

    // merge event streams, include as source
    if (events.length) {
      sources.push(events.length > 1 ? {
        merge: events
      } : events[0]);
    }
    if (encode != null) {
      if (update) error('Signal encode and update are mutually exclusive.');
      update = 'encode(item(),' + $(encode) + ')';
    }

    // resolve update value
    entry.update = isString(update) ? parser(update, scope) : update.expr != null ? parser(update.expr, scope) : update.value != null ? update.value : update.signal != null ? {
      $expr: OP_VALUE_EXPR,
      $params: {
        $value: scope.signalRef(update.signal)
      }
    } : error('Invalid signal update specification.');
    if (spec.force) {
      entry.options = {
        force: true
      };
    }
    sources.forEach(function (source) {
      return scope.addUpdate(extend(streamSource(source, scope), entry));
    });
  }
  function streamSource(stream, scope) {
    return {
      source: stream.signal ? scope.signalRef(stream.signal) : stream.scale ? scope.scaleRef(stream.scale) : parseStream(stream, scope)
    };
  }
  function mergeSources(sources) {
    return {
      signal: '[' + sources.map(function (s) {
        return s.scale ? 'scale("' + s.scale + '")' : s.signal;
      }) + ']'
    };
  }
  function parseSignalUpdates(signal, scope) {
    var op = scope.getSignal(signal.name);
    var expr = signal.update;
    if (signal.init) {
      if (expr) {
        error('Signals can not include both init and update expressions.');
      } else {
        expr = signal.init;
        op.initonly = true;
      }
    }
    if (expr) {
      expr = parser(expr, scope);
      op.update = expr.$expr;
      op.params = expr.$params;
    }
    if (signal.on) {
      signal.on.forEach(function (_) {
        return parseUpdate(_, scope, op.id);
      });
    }
  }
  var transform = function transform(name) {
    return function (params, value, parent) {
      return entry(name, value, params || undefined, parent);
    };
  };
  var Aggregate = transform('aggregate');
  var AxisTicks = transform('axisticks');
  var Bound = transform('bound');
  var Collect = transform('collect');
  var Compare = transform('compare');
  var DataJoin = transform('datajoin');
  var Encode = transform('encode');
  var Expression = transform('expression');
  var Facet = transform('facet');
  var Field = transform('field');
  var Key = transform('key');
  var LegendEntries = transform('legendentries');
  var Load = transform('load');
  var Mark = transform('mark');
  var MultiExtent = transform('multiextent');
  var MultiValues = transform('multivalues');
  var Overlap = transform('overlap');
  var Params = transform('params');
  var PreFacet = transform('prefacet');
  var Projection = transform('projection');
  var Proxy = transform('proxy');
  var Relay = transform('relay');
  var Render = transform('render');
  var Scale = transform('scale');
  var Sieve = transform('sieve');
  var SortItems = transform('sortitems');
  var ViewLayout = transform('viewlayout');
  var Values = transform('values');
  var FIELD_REF_ID = 0;
  var MULTIDOMAIN_SORT_OPS = {
    min: 'min',
    max: 'max',
    count: 'sum'
  };
  function initScale(spec, scope) {
    var type = spec.type || 'linear';
    if (!isValidScaleType(type)) {
      error('Unrecognized scale type: ' + $(type));
    }
    scope.addScale(spec.name, {
      type: type,
      domain: undefined
    });
  }
  function parseScale(spec, scope) {
    var params = scope.getScale(spec.name).params;
    var key;
    params.domain = parseScaleDomain(spec.domain, spec, scope);
    if (spec.range != null) {
      params.range = parseScaleRange(spec, scope, params);
    }
    if (spec.interpolate != null) {
      parseScaleInterpolate(spec.interpolate, params);
    }
    if (spec.nice != null) {
      params.nice = parseScaleNice(spec.nice);
    }
    if (spec.bins != null) {
      params.bins = parseScaleBins(spec.bins, scope);
    }
    for (key in spec) {
      if (_has(params, key) || key === 'name') continue;
      params[key] = parseLiteral(spec[key], scope);
    }
  }
  function parseLiteral(v, scope) {
    return !isObject(v) ? v : v.signal ? scope.signalRef(v.signal) : error('Unsupported object: ' + $(v));
  }
  function parseArray(v, scope) {
    return v.signal ? scope.signalRef(v.signal) : v.map(function (v) {
      return parseLiteral(v, scope);
    });
  }
  function dataLookupError(name) {
    error('Can not find data set: ' + $(name));
  }

  // -- SCALE DOMAIN ----

  function parseScaleDomain(domain, spec, scope) {
    if (!domain) {
      if (spec.domainMin != null || spec.domainMax != null) {
        error('No scale domain defined for domainMin/domainMax to override.');
      }
      return; // default domain
    }

    return domain.signal ? scope.signalRef(domain.signal) : (isArray(domain) ? explicitDomain : domain.fields ? multipleDomain : singularDomain)(domain, spec, scope);
  }
  function explicitDomain(domain, spec, scope) {
    return domain.map(function (v) {
      return parseLiteral(v, scope);
    });
  }
  function singularDomain(domain, spec, scope) {
    var data = scope.getData(domain.data);
    if (!data) dataLookupError(domain.data);
    return isDiscrete(spec.type) ? data.valuesRef(scope, domain.field, parseSort(domain.sort, false)) : isQuantile(spec.type) ? data.domainRef(scope, domain.field) : data.extentRef(scope, domain.field);
  }
  function multipleDomain(domain, spec, scope) {
    var data = domain.data,
      fields = domain.fields.reduce(function (dom, d) {
        d = isString(d) ? {
          data: data,
          field: d
        } : isArray(d) || d.signal ? fieldRef(d, scope) : d;
        dom.push(d);
        return dom;
      }, []);
    return (isDiscrete(spec.type) ? ordinalMultipleDomain : isQuantile(spec.type) ? quantileMultipleDomain : numericMultipleDomain)(domain, scope, fields);
  }
  function fieldRef(data, scope) {
    var name = '_:vega:_' + FIELD_REF_ID++,
      coll = Collect({});
    if (isArray(data)) {
      coll.value = {
        $ingest: data
      };
    } else if (data.signal) {
      var code = 'setdata(' + $(name) + ',' + data.signal + ')';
      coll.params.input = scope.signalRef(code);
    }
    scope.addDataPipeline(name, [coll, Sieve({})]);
    return {
      data: name,
      field: 'data'
    };
  }
  function ordinalMultipleDomain(domain, scope, fields) {
    var sort = parseSort(domain.sort, true);
    var a, v;

    // get value counts for each domain field
    var counts = fields.map(function (f) {
      var data = scope.getData(f.data);
      if (!data) dataLookupError(f.data);
      return data.countsRef(scope, f.field, sort);
    });

    // aggregate the results from each domain field
    var p = {
      groupby: keyFieldRef,
      pulse: counts
    };
    if (sort) {
      a = sort.op || 'count';
      v = sort.field ? aggrField(a, sort.field) : 'count';
      p.ops = [MULTIDOMAIN_SORT_OPS[a]];
      p.fields = [scope.fieldRef(v)];
      p.as = [v];
    }
    a = scope.add(Aggregate(p));

    // collect aggregate output
    var c = scope.add(Collect({
      pulse: ref(a)
    }));

    // extract values for combined domain
    v = scope.add(Values({
      field: keyFieldRef,
      sort: scope.sortRef(sort),
      pulse: ref(c)
    }));
    return ref(v);
  }
  function parseSort(sort, multidomain) {
    if (sort) {
      if (!sort.field && !sort.op) {
        if (isObject(sort)) sort.field = 'key';else sort = {
          field: 'key'
        };
      } else if (!sort.field && sort.op !== 'count') {
        error('No field provided for sort aggregate op: ' + sort.op);
      } else if (multidomain && sort.field) {
        if (sort.op && !MULTIDOMAIN_SORT_OPS[sort.op]) {
          error('Multiple domain scales can not be sorted using ' + sort.op);
        }
      }
    }
    return sort;
  }
  function quantileMultipleDomain(domain, scope, fields) {
    // get value arrays for each domain field
    var values = fields.map(function (f) {
      var data = scope.getData(f.data);
      if (!data) dataLookupError(f.data);
      return data.domainRef(scope, f.field);
    });

    // combine value arrays
    return ref(scope.add(MultiValues({
      values: values
    })));
  }
  function numericMultipleDomain(domain, scope, fields) {
    // get extents for each domain field
    var extents = fields.map(function (f) {
      var data = scope.getData(f.data);
      if (!data) dataLookupError(f.data);
      return data.extentRef(scope, f.field);
    });

    // combine extents
    return ref(scope.add(MultiExtent({
      extents: extents
    })));
  }

  // -- SCALE BINS -----

  function parseScaleBins(v, scope) {
    return v.signal || isArray(v) ? parseArray(v, scope) : scope.objectProperty(v);
  }

  // -- SCALE NICE -----

  function parseScaleNice(nice) {
    return isObject(nice) ? {
      interval: parseLiteral(nice.interval),
      step: parseLiteral(nice.step)
    } : parseLiteral(nice);
  }

  // -- SCALE INTERPOLATION -----

  function parseScaleInterpolate(interpolate, params) {
    params.interpolate = parseLiteral(interpolate.type || interpolate);
    if (interpolate.gamma != null) {
      params.interpolateGamma = parseLiteral(interpolate.gamma);
    }
  }

  // -- SCALE RANGE -----

  function parseScaleRange(spec, scope, params) {
    var config = scope.config.range;
    var range = spec.range;
    if (range.signal) {
      return scope.signalRef(range.signal);
    } else if (isString(range)) {
      if (config && _has(config, range)) {
        spec = extend({}, spec, {
          range: config[range]
        });
        return parseScaleRange(spec, scope, params);
      } else if (range === 'width') {
        range = [0, {
          signal: 'width'
        }];
      } else if (range === 'height') {
        range = isDiscrete(spec.type) ? [0, {
          signal: 'height'
        }] : [{
          signal: 'height'
        }, 0];
      } else {
        error('Unrecognized scale range value: ' + $(range));
      }
    } else if (range.scheme) {
      params.scheme = isArray(range.scheme) ? parseArray(range.scheme, scope) : parseLiteral(range.scheme, scope);
      if (range.extent) params.schemeExtent = parseArray(range.extent, scope);
      if (range.count) params.schemeCount = parseLiteral(range.count, scope);
      return;
    } else if (range.step) {
      params.rangeStep = parseLiteral(range.step, scope);
      return;
    } else if (isDiscrete(spec.type) && !isArray(range)) {
      return parseScaleDomain(range, spec, scope);
    } else if (!isArray(range)) {
      error('Unsupported range type: ' + $(range));
    }
    return range.map(function (v) {
      return (isArray(v) ? parseArray : parseLiteral)(v, scope);
    });
  }
  function parseProjection(proj, scope) {
    var config = scope.config.projection || {},
      params = {};
    for (var name in proj) {
      if (name === 'name') continue;
      params[name] = parseParameter$1(proj[name], name, scope);
    }

    // apply projection defaults from config
    for (var _name2 in config) {
      if (params[_name2] == null) {
        params[_name2] = parseParameter$1(config[_name2], _name2, scope);
      }
    }
    scope.addProjection(proj.name, params);
  }
  function parseParameter$1(_, name, scope) {
    return isArray(_) ? _.map(function (_) {
      return parseParameter$1(_, name, scope);
    }) : !isObject(_) ? _ : _.signal ? scope.signalRef(_.signal) : name === 'fit' ? _ : error('Unsupported parameter object: ' + $(_));
  }
  var Top = 'top';
  var Left = 'left';
  var Right = 'right';
  var Bottom = 'bottom';
  var Center = 'center';
  var Vertical = 'vertical';
  var Start = 'start';
  var Middle = 'middle';
  var End = 'end';
  var Index = 'index';
  var Label = 'label';
  var Offset = 'offset';
  var Perc = 'perc';
  var Perc2 = 'perc2';
  var Value = 'value';
  var GuideLabelStyle = 'guide-label';
  var GuideTitleStyle = 'guide-title';
  var GroupTitleStyle = 'group-title';
  var GroupSubtitleStyle = 'group-subtitle';
  var Symbols = 'symbol';
  var Gradient = 'gradient';
  var Discrete = 'discrete';
  var Size = 'size';
  var Shape = 'shape';
  var Fill = 'fill';
  var Stroke = 'stroke';
  var StrokeWidth = 'strokeWidth';
  var StrokeDash = 'strokeDash';
  var Opacity = 'opacity';

  // Encoding channels supported by legends
  // In priority order of 'canonical' scale
  var LegendScales = [Size, Shape, Fill, Stroke, StrokeWidth, StrokeDash, Opacity];
  var Skip = {
    name: 1,
    style: 1,
    interactive: 1
  };
  var zero = {
    value: 0
  };
  var one = {
    value: 1
  };
  var GroupMark = 'group';
  var RectMark = 'rect';
  var RuleMark = 'rule';
  var SymbolMark = 'symbol';
  var TextMark = 'text';
  function guideGroup(mark) {
    mark.type = GroupMark;
    mark.interactive = mark.interactive || false;
    return mark;
  }
  function lookup(spec, config) {
    var _ = function _(name, dflt) {
      return value(spec[name], value(config[name], dflt));
    };
    _.isVertical = function (s) {
      return Vertical === value(spec.direction, config.direction || (s ? config.symbolDirection : config.gradientDirection));
    };
    _.gradientLength = function () {
      return value(spec.gradientLength, config.gradientLength || config.gradientWidth);
    };
    _.gradientThickness = function () {
      return value(spec.gradientThickness, config.gradientThickness || config.gradientHeight);
    };
    _.entryColumns = function () {
      return value(spec.columns, value(config.columns, +_.isVertical(true)));
    };
    return _;
  }
  function getEncoding(name, encode) {
    var v = encode && (encode.update && encode.update[name] || encode.enter && encode.enter[name]);
    return v && v.signal ? v : v ? v.value : null;
  }
  function getStyle(name, scope, style) {
    var s = scope.config.style[style];
    return s && s[name];
  }
  function anchorExpr(s, e, m) {
    return "item.anchor === '".concat(Start, "' ? ").concat(s, " : item.anchor === '").concat(End, "' ? ").concat(e, " : ").concat(m);
  }
  var alignExpr$1 = anchorExpr($(Left), $(Right), $(Center));
  function tickBand(_) {
    var v = _('tickBand');
    var offset = _('tickOffset'),
      band,
      extra;
    if (!v) {
      // if no tick band entry, fall back on other properties
      band = _('bandPosition');
      extra = _('tickExtra');
    } else if (v.signal) {
      // if signal, augment code to interpret values
      band = {
        signal: "(".concat(v.signal, ") === 'extent' ? 1 : 0.5")
      };
      extra = {
        signal: "(".concat(v.signal, ") === 'extent'")
      };
      if (!isObject(offset)) {
        offset = {
          signal: "(".concat(v.signal, ") === 'extent' ? 0 : ").concat(offset)
        };
      }
    } else if (v === 'extent') {
      // if constant, simply set values
      band = 1;
      extra = true;
      offset = 0;
    } else {
      band = 0.5;
      extra = false;
    }
    return {
      extra: extra,
      band: band,
      offset: offset
    };
  }
  function extendOffset(value, offset) {
    return !offset ? value : !value ? offset : !isObject(value) ? {
      value: value,
      offset: offset
    } : Object.assign({}, value, {
      offset: extendOffset(value.offset, offset)
    });
  }
  function guideMark(mark, extras) {
    if (extras) {
      mark.name = extras.name;
      mark.style = extras.style || mark.style;
      mark.interactive = !!extras.interactive;
      mark.encode = extendEncode(mark.encode, extras, Skip);
    } else {
      mark.interactive = false;
    }
    return mark;
  }
  function legendGradient(spec, scale, config, userEncode) {
    var _ = lookup(spec, config),
      vertical = _.isVertical(),
      thickness = _.gradientThickness(),
      length = _.gradientLength();
    var enter, start, stop, width, height;
    if (vertical) {
      start = [0, 1];
      stop = [0, 0];
      width = thickness;
      height = length;
    } else {
      start = [0, 0];
      stop = [1, 0];
      width = length;
      height = thickness;
    }
    var encode = {
      enter: enter = {
        opacity: zero,
        x: zero,
        y: zero,
        width: encoder(width),
        height: encoder(height)
      },
      update: extend({}, enter, {
        opacity: one,
        fill: {
          gradient: scale,
          start: start,
          stop: stop
        }
      }),
      exit: {
        opacity: zero
      }
    };
    addEncoders(encode, {
      stroke: _('gradientStrokeColor'),
      strokeWidth: _('gradientStrokeWidth')
    }, {
      // update
      opacity: _('gradientOpacity')
    });
    return guideMark({
      type: RectMark,
      role: LegendGradientRole,
      encode: encode
    }, userEncode);
  }
  function legendGradientDiscrete(spec, scale, config, userEncode, dataRef) {
    var _ = lookup(spec, config),
      vertical = _.isVertical(),
      thickness = _.gradientThickness(),
      length = _.gradientLength();
    var u,
      v,
      uu,
      vv,
      adjust = '';
    vertical ? (u = 'y', uu = 'y2', v = 'x', vv = 'width', adjust = '1-') : (u = 'x', uu = 'x2', v = 'y', vv = 'height');
    var enter = {
      opacity: zero,
      fill: {
        scale: scale,
        field: Value
      }
    };
    enter[u] = {
      signal: adjust + 'datum.' + Perc,
      mult: length
    };
    enter[v] = zero;
    enter[uu] = {
      signal: adjust + 'datum.' + Perc2,
      mult: length
    };
    enter[vv] = encoder(thickness);
    var encode = {
      enter: enter,
      update: extend({}, enter, {
        opacity: one
      }),
      exit: {
        opacity: zero
      }
    };
    addEncoders(encode, {
      stroke: _('gradientStrokeColor'),
      strokeWidth: _('gradientStrokeWidth')
    }, {
      // update
      opacity: _('gradientOpacity')
    });
    return guideMark({
      type: RectMark,
      role: LegendBandRole,
      key: Value,
      from: dataRef,
      encode: encode
    }, userEncode);
  }
  var alignExpr = "datum.".concat(Perc, "<=0?\"").concat(Left, "\":datum.").concat(Perc, ">=1?\"").concat(Right, "\":\"").concat(Center, "\""),
    baselineExpr = "datum.".concat(Perc, "<=0?\"").concat(Bottom, "\":datum.").concat(Perc, ">=1?\"").concat(Top, "\":\"").concat(Middle, "\"");
  function legendGradientLabels(spec, config, userEncode, dataRef) {
    var _ = lookup(spec, config),
      vertical = _.isVertical(),
      thickness = encoder(_.gradientThickness()),
      length = _.gradientLength();
    var overlap = _('labelOverlap'),
      enter,
      update,
      u,
      v,
      adjust = '';
    var encode = {
      enter: enter = {
        opacity: zero
      },
      update: update = {
        opacity: one,
        text: {
          field: Label
        }
      },
      exit: {
        opacity: zero
      }
    };
    addEncoders(encode, {
      fill: _('labelColor'),
      fillOpacity: _('labelOpacity'),
      font: _('labelFont'),
      fontSize: _('labelFontSize'),
      fontStyle: _('labelFontStyle'),
      fontWeight: _('labelFontWeight'),
      limit: value(spec.labelLimit, config.gradientLabelLimit)
    });
    if (vertical) {
      enter.align = {
        value: 'left'
      };
      enter.baseline = update.baseline = {
        signal: baselineExpr
      };
      u = 'y';
      v = 'x';
      adjust = '1-';
    } else {
      enter.align = update.align = {
        signal: alignExpr
      };
      enter.baseline = {
        value: 'top'
      };
      u = 'x';
      v = 'y';
    }
    enter[u] = update[u] = {
      signal: adjust + 'datum.' + Perc,
      mult: length
    };
    enter[v] = update[v] = thickness;
    thickness.offset = value(spec.labelOffset, config.gradientLabelOffset) || 0;
    overlap = overlap ? {
      separation: _('labelSeparation'),
      method: overlap,
      order: 'datum.' + Index
    } : undefined;

    // type, role, style, key, dataRef, encode, extras
    return guideMark({
      type: TextMark,
      role: LegendLabelRole,
      style: GuideLabelStyle,
      key: Value,
      from: dataRef,
      encode: encode,
      overlap: overlap
    }, userEncode);
  }

  // userEncode is top-level, includes entries, symbols, labels
  function legendSymbolGroups(spec, config, userEncode, dataRef, columns) {
    var _ = lookup(spec, config),
      entries = userEncode.entries,
      interactive = !!(entries && entries.interactive),
      name = entries ? entries.name : undefined,
      height = _('clipHeight'),
      symbolOffset = _('symbolOffset'),
      valueRef = {
        data: 'value'
      },
      xSignal = "(".concat(columns, ") ? datum.").concat(Offset, " : datum.").concat(Size),
      yEncode = height ? encoder(height) : {
        field: Size
      },
      index = "datum.".concat(Index),
      ncols = "max(1, ".concat(columns, ")");
    var encode, enter, update, nrows, sort;
    yEncode.mult = 0.5;

    // -- LEGEND SYMBOLS --
    encode = {
      enter: enter = {
        opacity: zero,
        x: {
          signal: xSignal,
          mult: 0.5,
          offset: symbolOffset
        },
        y: yEncode
      },
      update: update = {
        opacity: one,
        x: enter.x,
        y: enter.y
      },
      exit: {
        opacity: zero
      }
    };
    var baseFill = null,
      baseStroke = null;
    if (!spec.fill) {
      baseFill = config.symbolBaseFillColor;
      baseStroke = config.symbolBaseStrokeColor;
    }
    addEncoders(encode, {
      fill: _('symbolFillColor', baseFill),
      shape: _('symbolType'),
      size: _('symbolSize'),
      stroke: _('symbolStrokeColor', baseStroke),
      strokeDash: _('symbolDash'),
      strokeDashOffset: _('symbolDashOffset'),
      strokeWidth: _('symbolStrokeWidth')
    }, {
      // update
      opacity: _('symbolOpacity')
    });
    LegendScales.forEach(function (scale) {
      if (spec[scale]) {
        update[scale] = enter[scale] = {
          scale: spec[scale],
          field: Value
        };
      }
    });
    var symbols = guideMark({
      type: SymbolMark,
      role: LegendSymbolRole,
      key: Value,
      from: valueRef,
      clip: height ? true : undefined,
      encode: encode
    }, userEncode.symbols);

    // -- LEGEND LABELS --
    var labelOffset = encoder(symbolOffset);
    labelOffset.offset = _('labelOffset');
    encode = {
      enter: enter = {
        opacity: zero,
        x: {
          signal: xSignal,
          offset: labelOffset
        },
        y: yEncode
      },
      update: update = {
        opacity: one,
        text: {
          field: Label
        },
        x: enter.x,
        y: enter.y
      },
      exit: {
        opacity: zero
      }
    };
    addEncoders(encode, {
      align: _('labelAlign'),
      baseline: _('labelBaseline'),
      fill: _('labelColor'),
      fillOpacity: _('labelOpacity'),
      font: _('labelFont'),
      fontSize: _('labelFontSize'),
      fontStyle: _('labelFontStyle'),
      fontWeight: _('labelFontWeight'),
      limit: _('labelLimit')
    });
    var labels = guideMark({
      type: TextMark,
      role: LegendLabelRole,
      style: GuideLabelStyle,
      key: Value,
      from: valueRef,
      encode: encode
    }, userEncode.labels);

    // -- LEGEND ENTRY GROUPS --
    encode = {
      enter: {
        noBound: {
          value: !height
        },
        // ignore width/height in bounds calc
        width: zero,
        height: height ? encoder(height) : zero,
        opacity: zero
      },
      exit: {
        opacity: zero
      },
      update: update = {
        opacity: one,
        row: {
          signal: null
        },
        column: {
          signal: null
        }
      }
    };

    // annotate and sort groups to ensure correct ordering
    if (_.isVertical(true)) {
      nrows = "ceil(item.mark.items.length / ".concat(ncols, ")");
      update.row.signal = "".concat(index, "%").concat(nrows);
      update.column.signal = "floor(".concat(index, " / ").concat(nrows, ")");
      sort = {
        field: ['row', index]
      };
    } else {
      update.row.signal = "floor(".concat(index, " / ").concat(ncols, ")");
      update.column.signal = "".concat(index, " % ").concat(ncols);
      sort = {
        field: index
      };
    }
    // handle zero column case (implies infinite columns)
    update.column.signal = "(".concat(columns, ")?").concat(update.column.signal, ":").concat(index);

    // facet legend entries into sub-groups
    dataRef = {
      facet: {
        data: dataRef,
        name: 'value',
        groupby: Index
      }
    };
    return guideGroup({
      role: ScopeRole,
      from: dataRef,
      encode: extendEncode(encode, entries, Skip),
      marks: [symbols, labels],
      name: name,
      interactive: interactive,
      sort: sort
    });
  }
  function legendSymbolLayout(spec, config) {
    var _ = lookup(spec, config);

    // layout parameters for legend entries
    return {
      align: _('gridAlign'),
      columns: _.entryColumns(),
      center: {
        row: true,
        column: false
      },
      padding: {
        row: _('rowPadding'),
        column: _('columnPadding')
      }
    };
  }

  // expression logic for align, anchor, angle, and baseline calculation
  var isL = 'item.orient === "left"',
    isR = 'item.orient === "right"',
    isLR = "(".concat(isL, " || ").concat(isR, ")"),
    isVG = "datum.vgrad && ".concat(isLR),
    baseline = anchorExpr('"top"', '"bottom"', '"middle"'),
    alignFlip = anchorExpr('"right"', '"left"', '"center"'),
    exprAlign = "datum.vgrad && ".concat(isR, " ? (").concat(alignFlip, ") : (").concat(isLR, " && !(datum.vgrad && ").concat(isL, ")) ? \"left\" : ").concat(alignExpr$1),
    exprAnchor = "item._anchor || (".concat(isLR, " ? \"middle\" : \"start\")"),
    exprAngle = "".concat(isVG, " ? (").concat(isL, " ? -90 : 90) : 0"),
    exprBaseline = "".concat(isLR, " ? (datum.vgrad ? (").concat(isR, " ? \"bottom\" : \"top\") : ").concat(baseline, ") : \"top\"");
  function legendTitle(spec, config, userEncode, dataRef) {
    var _ = lookup(spec, config);
    var encode = {
      enter: {
        opacity: zero
      },
      update: {
        opacity: one,
        x: {
          field: {
            group: 'padding'
          }
        },
        y: {
          field: {
            group: 'padding'
          }
        }
      },
      exit: {
        opacity: zero
      }
    };
    addEncoders(encode, {
      orient: _('titleOrient'),
      _anchor: _('titleAnchor'),
      anchor: {
        signal: exprAnchor
      },
      angle: {
        signal: exprAngle
      },
      align: {
        signal: exprAlign
      },
      baseline: {
        signal: exprBaseline
      },
      text: spec.title,
      fill: _('titleColor'),
      fillOpacity: _('titleOpacity'),
      font: _('titleFont'),
      fontSize: _('titleFontSize'),
      fontStyle: _('titleFontStyle'),
      fontWeight: _('titleFontWeight'),
      limit: _('titleLimit'),
      lineHeight: _('titleLineHeight')
    }, {
      // require update
      align: _('titleAlign'),
      baseline: _('titleBaseline')
    });
    return guideMark({
      type: TextMark,
      role: LegendTitleRole,
      style: GuideTitleStyle,
      from: dataRef,
      encode: encode
    }, userEncode);
  }
  function clip(clip, scope) {
    var expr;
    if (isObject(clip)) {
      if (clip.signal) {
        expr = clip.signal;
      } else if (clip.path) {
        expr = 'pathShape(' + param(clip.path) + ')';
      } else if (clip.sphere) {
        expr = 'geoShape(' + param(clip.sphere) + ', {type: "Sphere"})';
      }
    }
    return expr ? scope.signalRef(expr) : !!clip;
  }
  function param(value) {
    return isObject(value) && value.signal ? value.signal : $(value);
  }
  function getRole(spec) {
    var role = spec.role || '';
    return !role.indexOf('axis') || !role.indexOf('legend') || !role.indexOf('title') ? role : spec.type === GroupMark ? ScopeRole : role || MarkRole;
  }
  function definition(spec) {
    return {
      marktype: spec.type,
      name: spec.name || undefined,
      role: spec.role || getRole(spec),
      zindex: +spec.zindex || undefined,
      aria: spec.aria,
      description: spec.description
    };
  }
  function interactive(spec, scope) {
    return spec && spec.signal ? scope.signalRef(spec.signal) : spec === false ? false : true;
  }

  /**
   * Parse a data transform specification.
   */
  function parseTransform(spec, scope) {
    var def = definition$1(spec.type);
    if (!def) error('Unrecognized transform type: ' + $(spec.type));
    var t = entry(def.type.toLowerCase(), null, parseParameters(def, spec, scope));
    if (spec.signal) scope.addSignal(spec.signal, scope.proxy(t));
    t.metadata = def.metadata || {};
    return t;
  }

  /**
   * Parse all parameters of a data transform.
   */
  function parseParameters(def, spec, scope) {
    var params = {},
      n = def.params.length;
    for (var i = 0; i < n; ++i) {
      var pdef = def.params[i];
      params[pdef.name] = parseParameter(pdef, spec, scope);
    }
    return params;
  }

  /**
   * Parse a data transform parameter.
   */
  function parseParameter(def, spec, scope) {
    var type = def.type,
      value = spec[def.name];
    if (type === 'index') {
      return parseIndexParameter(def, spec, scope);
    } else if (value === undefined) {
      if (def.required) {
        error('Missing required ' + $(spec.type) + ' parameter: ' + $(def.name));
      }
      return;
    } else if (type === 'param') {
      return parseSubParameters(def, spec, scope);
    } else if (type === 'projection') {
      return scope.projectionRef(spec[def.name]);
    }
    return def.array && !isSignal(value) ? value.map(function (v) {
      return parameterValue(def, v, scope);
    }) : parameterValue(def, value, scope);
  }

  /**
   * Parse a single parameter value.
   */
  function parameterValue(def, value, scope) {
    var type = def.type;
    if (isSignal(value)) {
      return isExpr(type) ? error('Expression references can not be signals.') : isField(type) ? scope.fieldRef(value) : isCompare(type) ? scope.compareRef(value) : scope.signalRef(value.signal);
    } else {
      var _expr = def.expr || isField(type);
      return _expr && outerExpr(value) ? scope.exprRef(value.expr, value.as) : _expr && outerField(value) ? fieldRef$1(value.field, value.as) : isExpr(type) ? parser(value, scope) : isData(type) ? ref(scope.getData(value).values) : isField(type) ? fieldRef$1(value) : isCompare(type) ? scope.compareRef(value) : value;
    }
  }

  /**
   * Parse parameter for accessing an index of another data set.
   */
  function parseIndexParameter(def, spec, scope) {
    if (!isString(spec.from)) {
      error('Lookup "from" parameter must be a string literal.');
    }
    return scope.getData(spec.from).lookupRef(scope, spec.key);
  }

  /**
   * Parse a parameter that contains one or more sub-parameter objects.
   */
  function parseSubParameters(def, spec, scope) {
    var value = spec[def.name];
    if (def.array) {
      if (!isArray(value)) {
        // signals not allowed!
        error('Expected an array of sub-parameters. Instead: ' + $(value));
      }
      return value.map(function (v) {
        return parseSubParameter(def, v, scope);
      });
    } else {
      return parseSubParameter(def, value, scope);
    }
  }

  /**
   * Parse a sub-parameter object.
   */
  function parseSubParameter(def, value, scope) {
    var n = def.params.length;
    var pdef;

    // loop over defs to find matching key
    for (var i = 0; i < n; ++i) {
      pdef = def.params[i];
      for (var k in pdef.key) {
        if (pdef.key[k] !== value[k]) {
          pdef = null;
          break;
        }
      }
      if (pdef) break;
    }
    // raise error if matching key not found
    if (!pdef) error('Unsupported parameter: ' + $(value));

    // parse params, create Params transform, return ref
    var params = extend(parseParameters(pdef, value, scope), pdef.key);
    return ref(scope.add(Params(params)));
  }

  // -- Utilities -----

  var outerExpr = function outerExpr(_) {
    return _ && _.expr;
  };
  var outerField = function outerField(_) {
    return _ && _.field;
  };
  var isData = function isData(_) {
    return _ === 'data';
  };
  var isExpr = function isExpr(_) {
    return _ === 'expr';
  };
  var isField = function isField(_) {
    return _ === 'field';
  };
  var isCompare = function isCompare(_) {
    return _ === 'compare';
  };
  function parseData$1(from, group, scope) {
    var facet, key, op, dataRef, parent;

    // if no source data, generate singleton datum
    if (!from) {
      dataRef = ref(scope.add(Collect(null, [{}])));
    }

    // if faceted, process facet specification
    else if (facet = from.facet) {
      if (!group) error('Only group marks can be faceted.');

      // use pre-faceted source data, if available
      if (facet.field != null) {
        dataRef = parent = getDataRef(facet, scope);
      } else {
        // generate facet aggregates if no direct data specification
        if (!from.data) {
          op = parseTransform(extend({
            type: 'aggregate',
            groupby: array$2(facet.groupby)
          }, facet.aggregate), scope);
          op.params.key = scope.keyRef(facet.groupby);
          op.params.pulse = getDataRef(facet, scope);
          dataRef = parent = ref(scope.add(op));
        } else {
          parent = ref(scope.getData(from.data).aggregate);
        }
        key = scope.keyRef(facet.groupby, true);
      }
    }

    // if not yet defined, get source data reference
    if (!dataRef) {
      dataRef = getDataRef(from, scope);
    }
    return {
      key: key,
      pulse: dataRef,
      parent: parent
    };
  }
  function getDataRef(from, scope) {
    return from.$ref ? from : from.data && from.data.$ref ? from.data : ref(scope.getData(from.data).output);
  }
  function DataScope(scope, input, output, values, aggr) {
    this.scope = scope; // parent scope object
    this.input = input; // first operator in pipeline (tuple input)
    this.output = output; // last operator in pipeline (tuple output)
    this.values = values; // operator for accessing tuples (but not tuple flow)

    // last aggregate in transform pipeline
    this.aggregate = aggr;

    // lookup table of field indices
    this.index = {};
  }
  DataScope.fromEntries = function (scope, entries) {
    var n = entries.length,
      values = entries[n - 1],
      output = entries[n - 2];
    var input = entries[0],
      aggr = null,
      i = 1;
    if (input && input.type === 'load') {
      input = entries[1];
    }

    // add operator entries to this scope, wire up pulse chain
    scope.add(entries[0]);
    for (; i < n; ++i) {
      entries[i].params.pulse = ref(entries[i - 1]);
      scope.add(entries[i]);
      if (entries[i].type === 'aggregate') aggr = entries[i];
    }
    return new DataScope(scope, input, output, values, aggr);
  };
  function fieldKey(field) {
    return isString(field) ? field : null;
  }
  function addSortField(scope, p, sort) {
    var as = aggrField(sort.op, sort.field);
    var s;
    if (p.ops) {
      for (var i = 0, n = p.as.length; i < n; ++i) {
        if (p.as[i] === as) return;
      }
    } else {
      p.ops = ['count'];
      p.fields = [null];
      p.as = ['count'];
    }
    if (sort.op) {
      p.ops.push((s = sort.op.signal) ? scope.signalRef(s) : sort.op);
      p.fields.push(scope.fieldRef(sort.field));
      p.as.push(as);
    }
  }
  function cache(scope, ds, name, optype, field, counts, index) {
    var cache = ds[name] || (ds[name] = {}),
      sort = sortKey(counts);
    var k = fieldKey(field),
      v,
      op;
    if (k != null) {
      scope = ds.scope;
      k = k + (sort ? '|' + sort : '');
      v = cache[k];
    }
    if (!v) {
      var params = counts ? {
        field: keyFieldRef,
        pulse: ds.countsRef(scope, field, counts)
      } : {
        field: scope.fieldRef(field),
        pulse: ref(ds.output)
      };
      if (sort) params.sort = scope.sortRef(counts);
      op = scope.add(entry(optype, undefined, params));
      if (index) ds.index[field] = op;
      v = ref(op);
      if (k != null) cache[k] = v;
    }
    return v;
  }
  DataScope.prototype = {
    countsRef: function countsRef(scope, field, sort) {
      var ds = this,
        cache = ds.counts || (ds.counts = {}),
        k = fieldKey(field);
      var v, a, p;
      if (k != null) {
        scope = ds.scope;
        v = cache[k];
      }
      if (!v) {
        p = {
          groupby: scope.fieldRef(field, 'key'),
          pulse: ref(ds.output)
        };
        if (sort && sort.field) addSortField(scope, p, sort);
        a = scope.add(Aggregate(p));
        v = scope.add(Collect({
          pulse: ref(a)
        }));
        v = {
          agg: a,
          ref: ref(v)
        };
        if (k != null) cache[k] = v;
      } else if (sort && sort.field) {
        addSortField(scope, v.agg.params, sort);
      }
      return v.ref;
    },
    tuplesRef: function tuplesRef() {
      return ref(this.values);
    },
    extentRef: function extentRef(scope, field) {
      return cache(scope, this, 'extent', 'extent', field, false);
    },
    domainRef: function domainRef(scope, field) {
      return cache(scope, this, 'domain', 'values', field, false);
    },
    valuesRef: function valuesRef(scope, field, sort) {
      return cache(scope, this, 'vals', 'values', field, sort || true);
    },
    lookupRef: function lookupRef(scope, field) {
      return cache(scope, this, 'lookup', 'tupleindex', field, false);
    },
    indataRef: function indataRef(scope, field) {
      return cache(scope, this, 'indata', 'tupleindex', field, true, true);
    }
  };
  function parseFacet(spec, scope, group) {
    var facet = spec.from.facet,
      name = facet.name,
      data = getDataRef(facet, scope);
    var op;
    if (!facet.name) {
      error('Facet must have a name: ' + $(facet));
    }
    if (!facet.data) {
      error('Facet must reference a data set: ' + $(facet));
    }
    if (facet.field) {
      op = scope.add(PreFacet({
        field: scope.fieldRef(facet.field),
        pulse: data
      }));
    } else if (facet.groupby) {
      op = scope.add(Facet({
        key: scope.keyRef(facet.groupby),
        group: ref(scope.proxy(group.parent)),
        pulse: data
      }));
    } else {
      error('Facet must specify groupby or field: ' + $(facet));
    }

    // initialize facet subscope
    var subscope = scope.fork(),
      source = subscope.add(Collect()),
      values = subscope.add(Sieve({
        pulse: ref(source)
      }));
    subscope.addData(name, new DataScope(subscope, source, source, values));
    subscope.addSignal('parent', null);

    // parse faceted subflow
    op.params.subflow = {
      $subflow: subscope.parse(spec).toRuntime()
    };
  }
  function parseSubflow(spec, scope, input) {
    var op = scope.add(PreFacet({
        pulse: input.pulse
      })),
      subscope = scope.fork();
    subscope.add(Sieve());
    subscope.addSignal('parent', null);

    // parse group mark subflow
    op.params.subflow = {
      $subflow: subscope.parse(spec).toRuntime()
    };
  }
  function parseTrigger(spec, scope, name) {
    var remove = spec.remove,
      insert = spec.insert,
      toggle = spec.toggle,
      modify = spec.modify,
      values = spec.values,
      op = scope.add(operator());
    var update = 'if(' + spec.trigger + ',modify("' + name + '",' + [insert, remove, toggle, modify, values].map(function (_) {
      return _ == null ? 'null' : _;
    }).join(',') + '),0)';
    var expr = parser(update, scope);
    op.update = expr.$expr;
    op.params = expr.$params;
  }
  function parseMark(spec, scope) {
    var role = getRole(spec),
      group = spec.type === GroupMark,
      facet = spec.from && spec.from.facet,
      overlap = spec.overlap;
    var layout = spec.layout || role === ScopeRole || role === FrameRole,
      ops,
      op,
      store,
      enc,
      name,
      layoutRef,
      boundRef;
    var nested = role === MarkRole || layout || facet;

    // resolve input data
    var input = parseData$1(spec.from, group, scope);

    // data join to map tuples to visual items
    op = scope.add(DataJoin({
      key: input.key || (spec.key ? fieldRef$1(spec.key) : undefined),
      pulse: input.pulse,
      clean: !group
    }));
    var joinRef = ref(op);

    // collect visual items
    op = store = scope.add(Collect({
      pulse: joinRef
    }));

    // connect visual items to scenegraph
    op = scope.add(Mark({
      markdef: definition(spec),
      interactive: interactive(spec.interactive, scope),
      clip: clip(spec.clip, scope),
      context: {
        $context: true
      },
      groups: scope.lookup(),
      parent: scope.signals.parent ? scope.signalRef('parent') : null,
      index: scope.markpath(),
      pulse: ref(op)
    }));
    var markRef = ref(op);

    // add visual encoders
    op = enc = scope.add(Encode(parseEncode(spec.encode, spec.type, role, spec.style, scope, {
      mod: false,
      pulse: markRef
    })));

    // monitor parent marks to propagate changes
    op.params.parent = scope.encode();

    // add post-encoding transforms, if defined
    if (spec.transform) {
      spec.transform.forEach(function (_) {
        var tx = parseTransform(_, scope),
          md = tx.metadata;
        if (md.generates || md.changes) {
          error('Mark transforms should not generate new data.');
        }
        if (!md.nomod) enc.params.mod = true; // update encode mod handling
        tx.params.pulse = ref(op);
        scope.add(op = tx);
      });
    }

    // if item sort specified, perform post-encoding
    if (spec.sort) {
      op = scope.add(SortItems({
        sort: scope.compareRef(spec.sort),
        pulse: ref(op)
      }));
    }
    var encodeRef = ref(op);

    // add view layout operator if needed
    if (facet || layout) {
      layout = scope.add(ViewLayout({
        layout: scope.objectProperty(spec.layout),
        legends: scope.legends,
        mark: markRef,
        pulse: encodeRef
      }));
      layoutRef = ref(layout);
    }

    // compute bounding boxes
    var bound = scope.add(Bound({
      mark: markRef,
      pulse: layoutRef || encodeRef
    }));
    boundRef = ref(bound);

    // if group mark, recurse to parse nested content
    if (group) {
      // juggle layout & bounds to ensure they run *after* any faceting transforms
      if (nested) {
        ops = scope.operators;
        ops.pop();
        if (layout) ops.pop();
      }
      scope.pushState(encodeRef, layoutRef || boundRef, joinRef);
      facet ? parseFacet(spec, scope, input) // explicit facet
      : nested ? parseSubflow(spec, scope, input) // standard mark group
      : scope.parse(spec); // guide group, we can avoid nested scopes
      scope.popState();
      if (nested) {
        if (layout) ops.push(layout);
        ops.push(bound);
      }
    }

    // if requested, add overlap removal transform
    if (overlap) {
      boundRef = parseOverlap(overlap, boundRef, scope);
    }

    // render / sieve items
    var render = scope.add(Render({
        pulse: boundRef
      })),
      sieve = scope.add(Sieve({
        pulse: ref(render)
      }, undefined, scope.parent()));

    // if mark is named, make accessible as reactive geometry
    // add trigger updates if defined
    if (spec.name != null) {
      name = spec.name;
      scope.addData(name, new DataScope(scope, store, render, sieve));
      if (spec.on) spec.on.forEach(function (on) {
        if (on.insert || on.remove || on.toggle) {
          error('Marks only support modify triggers.');
        }
        parseTrigger(on, scope, name);
      });
    }
  }
  function parseOverlap(overlap, source, scope) {
    var method = overlap.method,
      bound = overlap.bound,
      sep = overlap.separation;
    var params = {
      separation: isSignal(sep) ? scope.signalRef(sep.signal) : sep,
      method: isSignal(method) ? scope.signalRef(method.signal) : method,
      pulse: source
    };
    if (overlap.order) {
      params.sort = scope.compareRef({
        field: overlap.order
      });
    }
    if (bound) {
      var tol = bound.tolerance;
      params.boundTolerance = isSignal(tol) ? scope.signalRef(tol.signal) : +tol;
      params.boundScale = scope.scaleRef(bound.scale);
      params.boundOrient = bound.orient;
    }
    return ref(scope.add(Overlap(params)));
  }
  function parseLegend(spec, scope) {
    var config = scope.config.legend,
      encode = spec.encode || {},
      _ = lookup(spec, config),
      legendEncode = encode.legend || {},
      name = legendEncode.name || undefined,
      interactive = legendEncode.interactive,
      style = legendEncode.style,
      scales = {};
    var scale = 0,
      entryLayout,
      params,
      children;

    // resolve scales and 'canonical' scale name
    LegendScales.forEach(function (s) {
      return spec[s] ? (scales[s] = spec[s], scale = scale || spec[s]) : 0;
    });
    if (!scale) error('Missing valid scale for legend.');

    // resolve legend type (symbol, gradient, or discrete gradient)
    var type = legendType(spec, scope.scaleType(scale));

    // single-element data source for legend group
    var datum = {
      title: spec.title != null,
      scales: scales,
      type: type,
      vgrad: type !== 'symbol' && _.isVertical()
    };
    var dataRef = ref(scope.add(Collect(null, [datum])));

    // encoding properties for legend entry sub-group
    var entryEncode = {
      enter: {
        x: {
          value: 0
        },
        y: {
          value: 0
        }
      }
    };

    // data source for legend values
    var entryRef = ref(scope.add(LegendEntries(params = {
      type: type,
      scale: scope.scaleRef(scale),
      count: scope.objectProperty(_('tickCount')),
      limit: scope.property(_('symbolLimit')),
      values: scope.objectProperty(spec.values),
      minstep: scope.property(spec.tickMinStep),
      formatType: scope.property(spec.formatType),
      formatSpecifier: scope.property(spec.format)
    })));

    // continuous gradient legend
    if (type === Gradient) {
      children = [legendGradient(spec, scale, config, encode.gradient), legendGradientLabels(spec, config, encode.labels, entryRef)];
      // adjust default tick count based on the gradient length
      params.count = params.count || scope.signalRef("max(2,2*floor((".concat(deref(_.gradientLength()), ")/100))"));
    }

    // discrete gradient legend
    else if (type === Discrete) {
      children = [legendGradientDiscrete(spec, scale, config, encode.gradient, entryRef), legendGradientLabels(spec, config, encode.labels, entryRef)];
    }

    // symbol legend
    else {
      // determine legend symbol group layout
      entryLayout = legendSymbolLayout(spec, config);
      children = [legendSymbolGroups(spec, config, encode, entryRef, deref(entryLayout.columns))];
      // pass symbol size information to legend entry generator
      params.size = sizeExpression(spec, scope, children[0].marks);
    }

    // generate legend marks
    children = [guideGroup({
      role: LegendEntryRole,
      from: dataRef,
      encode: entryEncode,
      marks: children,
      layout: entryLayout,
      interactive: interactive
    })];

    // include legend title if defined
    if (datum.title) {
      children.push(legendTitle(spec, config, encode.title, dataRef));
    }

    // parse legend specification
    return parseMark(guideGroup({
      role: LegendRole,
      from: dataRef,
      encode: extendEncode(buildLegendEncode(_, spec, config), legendEncode, Skip),
      marks: children,
      aria: _('aria'),
      description: _('description'),
      zindex: _('zindex'),
      name: name,
      interactive: interactive,
      style: style
    }), scope);
  }
  function legendType(spec, scaleType) {
    var type = spec.type || Symbols;
    if (!spec.type && scaleCount(spec) === 1 && (spec.fill || spec.stroke)) {
      type = isContinuous(scaleType) ? Gradient : isDiscretizing(scaleType) ? Discrete : Symbols;
    }
    return type !== Gradient ? type : isDiscretizing(scaleType) ? Discrete : Gradient;
  }
  function scaleCount(spec) {
    return LegendScales.reduce(function (count, type) {
      return count + (spec[type] ? 1 : 0);
    }, 0);
  }
  function buildLegendEncode(_, spec, config) {
    var encode = {
      enter: {},
      update: {}
    };
    addEncoders(encode, {
      orient: _('orient'),
      offset: _('offset'),
      padding: _('padding'),
      titlePadding: _('titlePadding'),
      cornerRadius: _('cornerRadius'),
      fill: _('fillColor'),
      stroke: _('strokeColor'),
      strokeWidth: config.strokeWidth,
      strokeDash: config.strokeDash,
      x: _('legendX'),
      y: _('legendY'),
      // accessibility support
      format: spec.format,
      formatType: spec.formatType
    });
    return encode;
  }
  function sizeExpression(spec, scope, marks) {
    var size = deref(getChannel('size', spec, marks)),
      strokeWidth = deref(getChannel('strokeWidth', spec, marks)),
      fontSize = deref(getFontSize(marks[1].encode, scope, GuideLabelStyle));
    return parser("max(ceil(sqrt(".concat(size, ")+").concat(strokeWidth, "),").concat(fontSize, ")"), scope);
  }
  function getChannel(name, spec, marks) {
    return spec[name] ? "scale(\"".concat(spec[name], "\",datum)") : getEncoding(name, marks[0].encode);
  }
  function getFontSize(encode, scope, style) {
    return getEncoding('fontSize', encode) || getStyle('fontSize', scope, style);
  }
  var angleExpr = "item.orient===\"".concat(Left, "\"?-90:item.orient===\"").concat(Right, "\"?90:0");
  function parseTitle(spec, scope) {
    spec = isString(spec) ? {
      text: spec
    } : spec;
    var _ = lookup(spec, scope.config.title),
      encode = spec.encode || {},
      userEncode = encode.group || {},
      name = userEncode.name || undefined,
      interactive = userEncode.interactive,
      style = userEncode.style,
      children = [];

    // single-element data source for group title
    var datum = {},
      dataRef = ref(scope.add(Collect(null, [datum])));

    // include title text
    children.push(buildTitle(spec, _, titleEncode(spec), dataRef));

    // include subtitle text
    if (spec.subtitle) {
      children.push(buildSubTitle(spec, _, encode.subtitle, dataRef));
    }

    // parse title specification
    return parseMark(guideGroup({
      role: TitleRole,
      from: dataRef,
      encode: groupEncode(_, userEncode),
      marks: children,
      aria: _('aria'),
      description: _('description'),
      zindex: _('zindex'),
      name: name,
      interactive: interactive,
      style: style
    }), scope);
  }

  // provide backwards-compatibility for title custom encode;
  // the top-level encode block has been *deprecated*.
  function titleEncode(spec) {
    var encode = spec.encode;
    return encode && encode.title || extend({
      name: spec.name,
      interactive: spec.interactive,
      style: spec.style
    }, encode);
  }
  function groupEncode(_, userEncode) {
    var encode = {
      enter: {},
      update: {}
    };
    addEncoders(encode, {
      orient: _('orient'),
      anchor: _('anchor'),
      align: {
        signal: alignExpr$1
      },
      angle: {
        signal: angleExpr
      },
      limit: _('limit'),
      frame: _('frame'),
      offset: _('offset') || 0,
      padding: _('subtitlePadding')
    });
    return extendEncode(encode, userEncode, Skip);
  }
  function buildTitle(spec, _, userEncode, dataRef) {
    var zero = {
        value: 0
      },
      text = spec.text,
      encode = {
        enter: {
          opacity: zero
        },
        update: {
          opacity: {
            value: 1
          }
        },
        exit: {
          opacity: zero
        }
      };
    addEncoders(encode, {
      text: text,
      align: {
        signal: 'item.mark.group.align'
      },
      angle: {
        signal: 'item.mark.group.angle'
      },
      limit: {
        signal: 'item.mark.group.limit'
      },
      baseline: 'top',
      dx: _('dx'),
      dy: _('dy'),
      fill: _('color'),
      font: _('font'),
      fontSize: _('fontSize'),
      fontStyle: _('fontStyle'),
      fontWeight: _('fontWeight'),
      lineHeight: _('lineHeight')
    }, {
      // update
      align: _('align'),
      angle: _('angle'),
      baseline: _('baseline')
    });
    return guideMark({
      type: TextMark,
      role: TitleTextRole,
      style: GroupTitleStyle,
      from: dataRef,
      encode: encode
    }, userEncode);
  }
  function buildSubTitle(spec, _, userEncode, dataRef) {
    var zero = {
        value: 0
      },
      text = spec.subtitle,
      encode = {
        enter: {
          opacity: zero
        },
        update: {
          opacity: {
            value: 1
          }
        },
        exit: {
          opacity: zero
        }
      };
    addEncoders(encode, {
      text: text,
      align: {
        signal: 'item.mark.group.align'
      },
      angle: {
        signal: 'item.mark.group.angle'
      },
      limit: {
        signal: 'item.mark.group.limit'
      },
      baseline: 'top',
      dx: _('dx'),
      dy: _('dy'),
      fill: _('subtitleColor'),
      font: _('subtitleFont'),
      fontSize: _('subtitleFontSize'),
      fontStyle: _('subtitleFontStyle'),
      fontWeight: _('subtitleFontWeight'),
      lineHeight: _('subtitleLineHeight')
    }, {
      // update
      align: _('align'),
      angle: _('angle'),
      baseline: _('baseline')
    });
    return guideMark({
      type: TextMark,
      role: TitleSubtitleRole,
      style: GroupSubtitleStyle,
      from: dataRef,
      encode: encode
    }, userEncode);
  }
  function parseData(data, scope) {
    var transforms = [];
    if (data.transform) {
      data.transform.forEach(function (tx) {
        transforms.push(parseTransform(tx, scope));
      });
    }
    if (data.on) {
      data.on.forEach(function (on) {
        parseTrigger(on, scope, data.name);
      });
    }
    scope.addDataPipeline(data.name, analyze(data, scope, transforms));
  }

  /**
   * Analyze a data pipeline, add needed operators.
   */
  function analyze(data, scope, ops) {
    var output = [];
    var source = null,
      modify = false,
      generate = false,
      upstream,
      i,
      n,
      t,
      m;
    if (data.values) {
      // hard-wired input data set
      if (isSignal(data.values) || hasSignal(data.format)) {
        // if either values is signal or format has signal, use dynamic loader
        output.push(load(scope, data));
        output.push(source = collect());
      } else {
        // otherwise, ingest upon dataflow init
        output.push(source = collect({
          $ingest: data.values,
          $format: data.format
        }));
      }
    } else if (data.url) {
      // load data from external source
      if (hasSignal(data.url) || hasSignal(data.format)) {
        // if either url or format has signal, use dynamic loader
        output.push(load(scope, data));
        output.push(source = collect());
      } else {
        // otherwise, request load upon dataflow init
        output.push(source = collect({
          $request: data.url,
          $format: data.format
        }));
      }
    } else if (data.source) {
      // derives from one or more other data sets
      source = upstream = array$2(data.source).map(function (d) {
        return ref(scope.getData(d).output);
      });
      output.push(null); // populate later
    }

    // scan data transforms, add collectors as needed
    for (i = 0, n = ops.length; i < n; ++i) {
      t = ops[i];
      m = t.metadata;
      if (!source && !m.source) {
        output.push(source = collect());
      }
      output.push(t);
      if (m.generates) generate = true;
      if (m.modifies && !generate) modify = true;
      if (m.source) source = t;else if (m.changes) source = null;
    }
    if (upstream) {
      n = upstream.length - 1;
      output[0] = Relay({
        derive: modify,
        pulse: n ? upstream : upstream[0]
      });
      if (modify || n) {
        // collect derived and multi-pulse tuples
        output.splice(1, 0, collect());
      }
    }
    if (!source) output.push(collect());
    output.push(Sieve({}));
    return output;
  }
  function collect(values) {
    var s = Collect({}, values);
    s.metadata = {
      source: true
    };
    return s;
  }
  function load(scope, data) {
    return Load({
      url: data.url ? scope.property(data.url) : undefined,
      async: data.async ? scope.property(data.async) : undefined,
      values: data.values ? scope.property(data.values) : undefined,
      format: scope.objectProperty(data.format)
    });
  }
  var isX = function isX(orient) {
    return orient === Bottom || orient === Top;
  };

  // get sign coefficient based on axis orient
  var getSign = function getSign(orient, a, b) {
    return isSignal(orient) ? ifLeftTopExpr(orient.signal, a, b) : orient === Left || orient === Top ? a : b;
  };

  // condition on axis x-direction
  var ifX = function ifX(orient, a, b) {
    return isSignal(orient) ? ifXEnc(orient.signal, a, b) : isX(orient) ? a : b;
  };

  // condition on axis y-direction
  var ifY = function ifY(orient, a, b) {
    return isSignal(orient) ? ifYEnc(orient.signal, a, b) : isX(orient) ? b : a;
  };
  var ifTop = function ifTop(orient, a, b) {
    return isSignal(orient) ? ifTopExpr(orient.signal, a, b) : orient === Top ? {
      value: a
    } : {
      value: b
    };
  };
  var ifRight = function ifRight(orient, a, b) {
    return isSignal(orient) ? ifRightExpr(orient.signal, a, b) : orient === Right ? {
      value: a
    } : {
      value: b
    };
  };
  var ifXEnc = function ifXEnc($orient, a, b) {
    return ifEnc("".concat($orient, " === '").concat(Top, "' || ").concat($orient, " === '").concat(Bottom, "'"), a, b);
  };
  var ifYEnc = function ifYEnc($orient, a, b) {
    return ifEnc("".concat($orient, " !== '").concat(Top, "' && ").concat($orient, " !== '").concat(Bottom, "'"), a, b);
  };
  var ifLeftTopExpr = function ifLeftTopExpr($orient, a, b) {
    return ifExpr("".concat($orient, " === '").concat(Left, "' || ").concat($orient, " === '").concat(Top, "'"), a, b);
  };
  var ifTopExpr = function ifTopExpr($orient, a, b) {
    return ifExpr("".concat($orient, " === '").concat(Top, "'"), a, b);
  };
  var ifRightExpr = function ifRightExpr($orient, a, b) {
    return ifExpr("".concat($orient, " === '").concat(Right, "'"), a, b);
  };
  var ifEnc = function ifEnc(test, a, b) {
    // ensure inputs are encoder objects (or null)
    a = a != null ? encoder(a) : a;
    b = b != null ? encoder(b) : b;
    if (isSimple(a) && isSimple(b)) {
      // if possible generate simple signal expression
      a = a ? a.signal || $(a.value) : null;
      b = b ? b.signal || $(b.value) : null;
      return {
        signal: "".concat(test, " ? (").concat(a, ") : (").concat(b, ")")
      };
    } else {
      // otherwise generate rule set
      return [extend({
        test: test
      }, a)].concat(b || []);
    }
  };
  var isSimple = function isSimple(enc) {
    return enc == null || Object.keys(enc).length === 1;
  };
  var ifExpr = function ifExpr(test, a, b) {
    return {
      signal: "".concat(test, " ? (").concat(toExpr(a), ") : (").concat(toExpr(b), ")")
    };
  };
  var ifOrient = function ifOrient($orient, t, b, l, r) {
    return {
      signal: (l != null ? "".concat($orient, " === '").concat(Left, "' ? (").concat(toExpr(l), ") : ") : '') + (b != null ? "".concat($orient, " === '").concat(Bottom, "' ? (").concat(toExpr(b), ") : ") : '') + (r != null ? "".concat($orient, " === '").concat(Right, "' ? (").concat(toExpr(r), ") : ") : '') + (t != null ? "".concat($orient, " === '").concat(Top, "' ? (").concat(toExpr(t), ") : ") : '') + '(null)'
    };
  };
  var toExpr = function toExpr(v) {
    return isSignal(v) ? v.signal : v == null ? null : $(v);
  };
  var mult = function mult(sign, value) {
    return value === 0 ? 0 : isSignal(sign) ? {
      signal: "(".concat(sign.signal, ") * ").concat(value)
    } : {
      value: sign * value
    };
  };
  var patch = function patch(value, base) {
    var s = value.signal;
    return s && s.endsWith('(null)') ? {
      signal: s.slice(0, -6) + base.signal
    } : value;
  };
  function fallback(prop, config, axisConfig, style) {
    var styleProp;
    if (config && _has(config, prop)) {
      return config[prop];
    } else if (_has(axisConfig, prop)) {
      return axisConfig[prop];
    } else if (prop.startsWith('title')) {
      switch (prop) {
        case 'titleColor':
          styleProp = 'fill';
          break;
        case 'titleFont':
        case 'titleFontSize':
        case 'titleFontWeight':
          styleProp = prop[5].toLowerCase() + prop.slice(6);
      }
      return style[GuideTitleStyle][styleProp];
    } else if (prop.startsWith('label')) {
      switch (prop) {
        case 'labelColor':
          styleProp = 'fill';
          break;
        case 'labelFont':
        case 'labelFontSize':
          styleProp = prop[5].toLowerCase() + prop.slice(6);
      }
      return style[GuideLabelStyle][styleProp];
    }
    return null;
  }
  function keys(objects) {
    var map = {};
    var _iterator = _createForOfIteratorHelper(objects),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var obj = _step.value;
        if (!obj) continue;
        for (var key in obj) map[key] = 1;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return Object.keys(map);
  }
  function axisConfig(spec, scope) {
    var config = scope.config,
      style = config.style,
      axis = config.axis,
      band = scope.scaleType(spec.scale) === 'band' && config.axisBand,
      orient = spec.orient,
      xy,
      or,
      key;
    if (isSignal(orient)) {
      var xyKeys = keys([config.axisX, config.axisY]),
        orientKeys = keys([config.axisTop, config.axisBottom, config.axisLeft, config.axisRight]);
      xy = {};
      var _iterator2 = _createForOfIteratorHelper(xyKeys),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          key = _step2.value;
          xy[key] = ifX(orient, fallback(key, config.axisX, axis, style), fallback(key, config.axisY, axis, style));
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      or = {};
      var _iterator3 = _createForOfIteratorHelper(orientKeys),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          key = _step3.value;
          or[key] = ifOrient(orient.signal, fallback(key, config.axisTop, axis, style), fallback(key, config.axisBottom, axis, style), fallback(key, config.axisLeft, axis, style), fallback(key, config.axisRight, axis, style));
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    } else {
      xy = orient === Top || orient === Bottom ? config.axisX : config.axisY;
      or = config['axis' + orient[0].toUpperCase() + orient.slice(1)];
    }
    var result = xy || or || band ? extend({}, axis, xy, or, band) : axis;
    return result;
  }
  function axisDomain(spec, config, userEncode, dataRef) {
    var _ = lookup(spec, config),
      orient = spec.orient;
    var enter, update;
    var encode = {
      enter: enter = {
        opacity: zero
      },
      update: update = {
        opacity: one
      },
      exit: {
        opacity: zero
      }
    };
    addEncoders(encode, {
      stroke: _('domainColor'),
      strokeCap: _('domainCap'),
      strokeDash: _('domainDash'),
      strokeDashOffset: _('domainDashOffset'),
      strokeWidth: _('domainWidth'),
      strokeOpacity: _('domainOpacity')
    });
    var pos0 = position(spec, 0);
    var pos1 = position(spec, 1);
    enter.x = update.x = ifX(orient, pos0, zero);
    enter.x2 = update.x2 = ifX(orient, pos1);
    enter.y = update.y = ifY(orient, pos0, zero);
    enter.y2 = update.y2 = ifY(orient, pos1);
    return guideMark({
      type: RuleMark,
      role: AxisDomainRole,
      from: dataRef,
      encode: encode
    }, userEncode);
  }
  function position(spec, pos) {
    return {
      scale: spec.scale,
      range: pos
    };
  }
  function axisGrid(spec, config, userEncode, dataRef, band) {
    var _ = lookup(spec, config),
      orient = spec.orient,
      vscale = spec.gridScale,
      sign = getSign(orient, 1, -1),
      offset = offsetValue(spec.offset, sign);
    var enter, exit, update;
    var encode = {
      enter: enter = {
        opacity: zero
      },
      update: update = {
        opacity: one
      },
      exit: exit = {
        opacity: zero
      }
    };
    addEncoders(encode, {
      stroke: _('gridColor'),
      strokeCap: _('gridCap'),
      strokeDash: _('gridDash'),
      strokeDashOffset: _('gridDashOffset'),
      strokeOpacity: _('gridOpacity'),
      strokeWidth: _('gridWidth')
    });
    var tickPos = {
      scale: spec.scale,
      field: Value,
      band: band.band,
      extra: band.extra,
      offset: band.offset,
      round: _('tickRound')
    };
    var sz = ifX(orient, {
      signal: 'height'
    }, {
      signal: 'width'
    });
    var gridStart = vscale ? {
      scale: vscale,
      range: 0,
      mult: sign,
      offset: offset
    } : {
      value: 0,
      offset: offset
    };
    var gridEnd = vscale ? {
      scale: vscale,
      range: 1,
      mult: sign,
      offset: offset
    } : extend(sz, {
      mult: sign,
      offset: offset
    });
    enter.x = update.x = ifX(orient, tickPos, gridStart);
    enter.y = update.y = ifY(orient, tickPos, gridStart);
    enter.x2 = update.x2 = ifY(orient, gridEnd);
    enter.y2 = update.y2 = ifX(orient, gridEnd);
    exit.x = ifX(orient, tickPos);
    exit.y = ifY(orient, tickPos);
    return guideMark({
      type: RuleMark,
      role: AxisGridRole,
      key: Value,
      from: dataRef,
      encode: encode
    }, userEncode);
  }
  function offsetValue(offset, sign) {
    if (sign === 1) ;else if (!isObject(offset)) {
      offset = isSignal(sign) ? {
        signal: "(".concat(sign.signal, ") * (").concat(offset || 0, ")")
      } : sign * (offset || 0);
    } else {
      var _entry = offset = extend({}, offset);
      while (_entry.mult != null) {
        if (!isObject(_entry.mult)) {
          _entry.mult = isSignal(sign) // no offset if sign === 1
          ? {
            signal: "(".concat(_entry.mult, ") * (").concat(sign.signal, ")")
          } : _entry.mult * sign;
          return offset;
        } else {
          _entry = _entry.mult = extend({}, _entry.mult);
        }
      }
      _entry.mult = sign;
    }
    return offset;
  }
  function axisTicks(spec, config, userEncode, dataRef, size, band) {
    var _ = lookup(spec, config),
      orient = spec.orient,
      sign = getSign(orient, -1, 1);
    var enter, exit, update;
    var encode = {
      enter: enter = {
        opacity: zero
      },
      update: update = {
        opacity: one
      },
      exit: exit = {
        opacity: zero
      }
    };
    addEncoders(encode, {
      stroke: _('tickColor'),
      strokeCap: _('tickCap'),
      strokeDash: _('tickDash'),
      strokeDashOffset: _('tickDashOffset'),
      strokeOpacity: _('tickOpacity'),
      strokeWidth: _('tickWidth')
    });
    var tickSize = encoder(size);
    tickSize.mult = sign;
    var tickPos = {
      scale: spec.scale,
      field: Value,
      band: band.band,
      extra: band.extra,
      offset: band.offset,
      round: _('tickRound')
    };
    update.y = enter.y = ifX(orient, zero, tickPos);
    update.y2 = enter.y2 = ifX(orient, tickSize);
    exit.x = ifX(orient, tickPos);
    update.x = enter.x = ifY(orient, zero, tickPos);
    update.x2 = enter.x2 = ifY(orient, tickSize);
    exit.y = ifY(orient, tickPos);
    return guideMark({
      type: RuleMark,
      role: AxisTickRole,
      key: Value,
      from: dataRef,
      encode: encode
    }, userEncode);
  }
  function flushExpr(scale, threshold, a, b, c) {
    return {
      signal: 'flush(range("' + scale + '"), ' + 'scale("' + scale + '", datum.value), ' + threshold + ',' + a + ',' + b + ',' + c + ')'
    };
  }
  function axisLabels(spec, config, userEncode, dataRef, size, band) {
    var _ = lookup(spec, config),
      orient = spec.orient,
      scale = spec.scale,
      sign = getSign(orient, -1, 1),
      flush = deref(_('labelFlush')),
      flushOffset = deref(_('labelFlushOffset')),
      labelAlign = _('labelAlign'),
      labelBaseline = _('labelBaseline');
    var flushOn = flush === 0 || !!flush,
      update;
    var tickSize = encoder(size);
    tickSize.mult = sign;
    tickSize.offset = encoder(_('labelPadding') || 0);
    tickSize.offset.mult = sign;
    var tickPos = {
      scale: scale,
      field: Value,
      band: 0.5,
      offset: extendOffset(band.offset, _('labelOffset'))
    };
    var align = ifX(orient, flushOn ? flushExpr(scale, flush, '"left"', '"right"', '"center"') : {
      value: 'center'
    }, ifRight(orient, 'left', 'right'));
    var baseline = ifX(orient, ifTop(orient, 'bottom', 'top'), flushOn ? flushExpr(scale, flush, '"top"', '"bottom"', '"middle"') : {
      value: 'middle'
    });
    var offsetExpr = flushExpr(scale, flush, "-(".concat(flushOffset, ")"), flushOffset, 0);
    flushOn = flushOn && flushOffset;
    var enter = {
      opacity: zero,
      x: ifX(orient, tickPos, tickSize),
      y: ifY(orient, tickPos, tickSize)
    };
    var encode = {
      enter: enter,
      update: update = {
        opacity: one,
        text: {
          field: Label
        },
        x: enter.x,
        y: enter.y,
        align: align,
        baseline: baseline
      },
      exit: {
        opacity: zero,
        x: enter.x,
        y: enter.y
      }
    };
    addEncoders(encode, {
      dx: !labelAlign && flushOn ? ifX(orient, offsetExpr) : null,
      dy: !labelBaseline && flushOn ? ifY(orient, offsetExpr) : null
    });
    addEncoders(encode, {
      angle: _('labelAngle'),
      fill: _('labelColor'),
      fillOpacity: _('labelOpacity'),
      font: _('labelFont'),
      fontSize: _('labelFontSize'),
      fontWeight: _('labelFontWeight'),
      fontStyle: _('labelFontStyle'),
      limit: _('labelLimit'),
      lineHeight: _('labelLineHeight')
    }, {
      align: labelAlign,
      baseline: labelBaseline
    });
    var bound = _('labelBound');
    var overlap = _('labelOverlap');

    // if overlap method or bound defined, request label overlap removal
    overlap = overlap || bound ? {
      separation: _('labelSeparation'),
      method: overlap,
      order: 'datum.index',
      bound: bound ? {
        scale: scale,
        orient: orient,
        tolerance: bound
      } : null
    } : undefined;
    if (update.align !== align) {
      update.align = patch(update.align, align);
    }
    if (update.baseline !== baseline) {
      update.baseline = patch(update.baseline, baseline);
    }
    return guideMark({
      type: TextMark,
      role: AxisLabelRole,
      style: GuideLabelStyle,
      key: Value,
      from: dataRef,
      encode: encode,
      overlap: overlap
    }, userEncode);
  }
  function axisTitle(spec, config, userEncode, dataRef) {
    var _ = lookup(spec, config),
      orient = spec.orient,
      sign = getSign(orient, -1, 1);
    var enter, update;
    var encode = {
      enter: enter = {
        opacity: zero,
        anchor: encoder(_('titleAnchor', null)),
        align: {
          signal: alignExpr$1
        }
      },
      update: update = extend({}, enter, {
        opacity: one,
        text: encoder(spec.title)
      }),
      exit: {
        opacity: zero
      }
    };
    var titlePos = {
      signal: "lerp(range(\"".concat(spec.scale, "\"), ").concat(anchorExpr(0, 1, 0.5), ")")
    };
    update.x = ifX(orient, titlePos);
    update.y = ifY(orient, titlePos);
    enter.angle = ifX(orient, zero, mult(sign, 90));
    enter.baseline = ifX(orient, ifTop(orient, Bottom, Top), {
      value: Bottom
    });
    update.angle = enter.angle;
    update.baseline = enter.baseline;
    addEncoders(encode, {
      fill: _('titleColor'),
      fillOpacity: _('titleOpacity'),
      font: _('titleFont'),
      fontSize: _('titleFontSize'),
      fontStyle: _('titleFontStyle'),
      fontWeight: _('titleFontWeight'),
      limit: _('titleLimit'),
      lineHeight: _('titleLineHeight')
    }, {
      // require update
      align: _('titleAlign'),
      angle: _('titleAngle'),
      baseline: _('titleBaseline')
    });
    autoLayout(_, orient, encode, userEncode);
    encode.update.align = patch(encode.update.align, enter.align);
    encode.update.angle = patch(encode.update.angle, enter.angle);
    encode.update.baseline = patch(encode.update.baseline, enter.baseline);
    return guideMark({
      type: TextMark,
      role: AxisTitleRole,
      style: GuideTitleStyle,
      from: dataRef,
      encode: encode
    }, userEncode);
  }
  function autoLayout(_, orient, encode, userEncode) {
    var auto = function auto(value, dim) {
      return value != null ? (encode.update[dim] = patch(encoder(value), encode.update[dim]), false) : !has(dim, userEncode) ? true : false;
    };
    var autoY = auto(_('titleX'), 'x'),
      autoX = auto(_('titleY'), 'y');
    encode.enter.auto = autoX === autoY ? encoder(autoX) : ifX(orient, encoder(autoX), encoder(autoY));
  }
  function parseAxis(spec, scope) {
    var config = axisConfig(spec, scope),
      encode = spec.encode || {},
      axisEncode = encode.axis || {},
      name = axisEncode.name || undefined,
      interactive = axisEncode.interactive,
      style = axisEncode.style,
      _ = lookup(spec, config),
      band = tickBand(_);

    // single-element data source for axis group
    var datum = {
      scale: spec.scale,
      ticks: !!_('ticks'),
      labels: !!_('labels'),
      grid: !!_('grid'),
      domain: !!_('domain'),
      title: spec.title != null
    };
    var dataRef = ref(scope.add(Collect({}, [datum])));

    // data source for axis ticks
    var ticksRef = ref(scope.add(AxisTicks({
      scale: scope.scaleRef(spec.scale),
      extra: scope.property(band.extra),
      count: scope.objectProperty(spec.tickCount),
      values: scope.objectProperty(spec.values),
      minstep: scope.property(spec.tickMinStep),
      formatType: scope.property(spec.formatType),
      formatSpecifier: scope.property(spec.format)
    })));

    // generate axis marks
    var children = [];
    var size;

    // include axis gridlines if requested
    if (datum.grid) {
      children.push(axisGrid(spec, config, encode.grid, ticksRef, band));
    }

    // include axis ticks if requested
    if (datum.ticks) {
      size = _('tickSize');
      children.push(axisTicks(spec, config, encode.ticks, ticksRef, size, band));
    }

    // include axis labels if requested
    if (datum.labels) {
      size = datum.ticks ? size : 0;
      children.push(axisLabels(spec, config, encode.labels, ticksRef, size, band));
    }

    // include axis domain path if requested
    if (datum.domain) {
      children.push(axisDomain(spec, config, encode.domain, dataRef));
    }

    // include axis title if defined
    if (datum.title) {
      children.push(axisTitle(spec, config, encode.title, dataRef));
    }

    // parse axis specification
    return parseMark(guideGroup({
      role: AxisRole,
      from: dataRef,
      encode: extendEncode(buildAxisEncode(_, spec), axisEncode, Skip),
      marks: children,
      aria: _('aria'),
      description: _('description'),
      zindex: _('zindex'),
      name: name,
      interactive: interactive,
      style: style
    }), scope);
  }
  function buildAxisEncode(_, spec) {
    var encode = {
      enter: {},
      update: {}
    };
    addEncoders(encode, {
      orient: _('orient'),
      offset: _('offset') || 0,
      position: value(spec.position, 0),
      titlePadding: _('titlePadding'),
      minExtent: _('minExtent'),
      maxExtent: _('maxExtent'),
      range: {
        signal: "abs(span(range(\"".concat(spec.scale, "\")))")
      },
      translate: _('translate'),
      // accessibility support
      format: spec.format,
      formatType: spec.formatType
    });
    return encode;
  }
  function parseScope(spec, scope, preprocessed) {
    var signals = array$2(spec.signals),
      scales = array$2(spec.scales);

    // parse signal definitions, if not already preprocessed
    if (!preprocessed) signals.forEach(function (_) {
      return parseSignal(_, scope);
    });

    // parse cartographic projection definitions
    array$2(spec.projections).forEach(function (_) {
      return parseProjection(_, scope);
    });

    // initialize scale references
    scales.forEach(function (_) {
      return initScale(_, scope);
    });

    // parse data sources
    array$2(spec.data).forEach(function (_) {
      return parseData(_, scope);
    });

    // parse scale definitions
    scales.forEach(function (_) {
      return parseScale(_, scope);
    });

    // parse signal updates
    (preprocessed || signals).forEach(function (_) {
      return parseSignalUpdates(_, scope);
    });

    // parse axis definitions
    array$2(spec.axes).forEach(function (_) {
      return parseAxis(_, scope);
    });

    // parse mark definitions
    array$2(spec.marks).forEach(function (_) {
      return parseMark(_, scope);
    });

    // parse legend definitions
    array$2(spec.legends).forEach(function (_) {
      return parseLegend(_, scope);
    });

    // parse title, if defined
    if (spec.title) parseTitle(spec.title, scope);

    // parse collected lambda (anonymous) expressions
    scope.parseLambdas();
    return scope;
  }
  var rootEncode = function rootEncode(spec) {
    return extendEncode({
      enter: {
        x: {
          value: 0
        },
        y: {
          value: 0
        }
      },
      update: {
        width: {
          signal: 'width'
        },
        height: {
          signal: 'height'
        }
      }
    }, spec);
  };
  function parseView(spec, scope) {
    var config = scope.config;

    // add scenegraph root
    var root = ref(scope.root = scope.add(operator()));

    // parse top-level signal definitions
    var signals = collectSignals(spec, config);
    signals.forEach(function (_) {
      return parseSignal(_, scope);
    });

    // assign description, event, legend, and locale configuration
    scope.description = spec.description || config.description;
    scope.eventConfig = config.events;
    scope.legends = scope.objectProperty(config.legend && config.legend.layout);
    scope.locale = config.locale;

    // store root group item
    var input = scope.add(Collect());

    // encode root group item
    var encode = scope.add(Encode(parseEncode(rootEncode(spec.encode), GroupMark, FrameRole, spec.style, scope, {
      pulse: ref(input)
    })));

    // perform view layout
    var parent = scope.add(ViewLayout({
      layout: scope.objectProperty(spec.layout),
      legends: scope.legends,
      autosize: scope.signalRef('autosize'),
      mark: root,
      pulse: ref(encode)
    }));
    scope.operators.pop();

    // parse remainder of specification
    scope.pushState(ref(encode), ref(parent), null);
    parseScope(spec, scope, signals);
    scope.operators.push(parent);

    // bound / render / sieve root item
    var op = scope.add(Bound({
      mark: root,
      pulse: ref(parent)
    }));
    op = scope.add(Render({
      pulse: ref(op)
    }));
    op = scope.add(Sieve({
      pulse: ref(op)
    }));

    // track metadata for root item
    scope.addData('root', new DataScope(scope, input, input, op));
    return scope;
  }
  function signalObject(name, value) {
    return value && value.signal ? {
      name: name,
      update: value.signal
    } : {
      name: name,
      value: value
    };
  }

  /**
   * Collect top-level signals, merging values as needed. Signals
   * defined in the config signals arrays are added only if that
   * signal is not explicitly defined in the specification.
   * Built-in signals (autosize, background, padding, width, height)
   * receive special treatment. They are initialized using the
   * top-level spec property, or, if undefined in the spec, using
   * the corresponding top-level config property. If this property
   * is a signal reference object, the signal expression maps to the
   * signal 'update' property. If the spec's top-level signal array
   * contains an entry that matches a built-in signal, that entry
   * will be merged with the built-in specification, potentially
   * overwriting existing 'value' or 'update' properties.
   */
  function collectSignals(spec, config) {
    var _ = function _(name) {
        return value(spec[name], config[name]);
      },
      signals = [signalObject('background', _('background')), signalObject('autosize', parseAutosize(_('autosize'))), signalObject('padding', parsePadding(_('padding'))), signalObject('width', _('width') || 0), signalObject('height', _('height') || 0)],
      pre = signals.reduce(function (p, s) {
        return p[s.name] = s, p;
      }, {}),
      map = {};

    // add spec signal array
    array$2(spec.signals).forEach(function (s) {
      if (_has(pre, s.name)) {
        // merge if built-in signal
        s = extend(pre[s.name], s);
      } else {
        // otherwise add to signal list
        signals.push(s);
      }
      map[s.name] = s;
    });

    // add config signal array
    array$2(config.signals).forEach(function (s) {
      if (!_has(map, s.name) && !_has(pre, s.name)) {
        // add to signal list if not already defined
        signals.push(s);
      }
    });
    return signals;
  }
  function Scope(config, options) {
    this.config = config || {};
    this.options = options || {};
    this.bindings = [];
    this.field = {};
    this.signals = {};
    this.lambdas = {};
    this.scales = {};
    this.events = {};
    this.data = {};
    this.streams = [];
    this.updates = [];
    this.operators = [];
    this.eventConfig = null;
    this.locale = null;
    this._id = 0;
    this._subid = 0;
    this._nextsub = [0];
    this._parent = [];
    this._encode = [];
    this._lookup = [];
    this._markpath = [];
  }
  function Subscope(scope) {
    this.config = scope.config;
    this.options = scope.options;
    this.legends = scope.legends;
    this.field = Object.create(scope.field);
    this.signals = Object.create(scope.signals);
    this.lambdas = Object.create(scope.lambdas);
    this.scales = Object.create(scope.scales);
    this.events = Object.create(scope.events);
    this.data = Object.create(scope.data);
    this.streams = [];
    this.updates = [];
    this.operators = [];
    this._id = 0;
    this._subid = ++scope._nextsub[0];
    this._nextsub = scope._nextsub;
    this._parent = scope._parent.slice();
    this._encode = scope._encode.slice();
    this._lookup = scope._lookup.slice();
    this._markpath = scope._markpath;
  }
  Scope.prototype = Subscope.prototype = {
    parse: function parse(spec) {
      return parseScope(spec, this);
    },
    fork: function fork() {
      return new Subscope(this);
    },
    isSubscope: function isSubscope() {
      return this._subid > 0;
    },
    toRuntime: function toRuntime() {
      this.finish();
      return {
        description: this.description,
        operators: this.operators,
        streams: this.streams,
        updates: this.updates,
        bindings: this.bindings,
        eventConfig: this.eventConfig,
        locale: this.locale
      };
    },
    id: function id() {
      return (this._subid ? this._subid + ':' : 0) + this._id++;
    },
    add: function add(op) {
      this.operators.push(op);
      op.id = this.id();
      // if pre-registration references exist, resolve them now
      if (op.refs) {
        op.refs.forEach(function (ref) {
          ref.$ref = op.id;
        });
        op.refs = null;
      }
      return op;
    },
    proxy: function proxy(op) {
      var vref = op instanceof Entry ? ref(op) : op;
      return this.add(Proxy({
        value: vref
      }));
    },
    addStream: function addStream(stream) {
      this.streams.push(stream);
      stream.id = this.id();
      return stream;
    },
    addUpdate: function addUpdate(update) {
      this.updates.push(update);
      return update;
    },
    // Apply metadata
    finish: function finish() {
      var name, ds;

      // annotate root
      if (this.root) this.root.root = true;

      // annotate signals
      for (name in this.signals) {
        this.signals[name].signal = name;
      }

      // annotate scales
      for (name in this.scales) {
        this.scales[name].scale = name;
      }

      // annotate data sets
      function annotate(op, name, type) {
        var data, list;
        if (op) {
          data = op.data || (op.data = {});
          list = data[name] || (data[name] = []);
          list.push(type);
        }
      }
      for (name in this.data) {
        ds = this.data[name];
        annotate(ds.input, name, 'input');
        annotate(ds.output, name, 'output');
        annotate(ds.values, name, 'values');
        for (var _field in ds.index) {
          annotate(ds.index[_field], name, 'index:' + _field);
        }
      }
      return this;
    },
    // ----
    pushState: function pushState(encode, parent, lookup) {
      this._encode.push(ref(this.add(Sieve({
        pulse: encode
      }))));
      this._parent.push(parent);
      this._lookup.push(lookup ? ref(this.proxy(lookup)) : null);
      this._markpath.push(-1);
    },
    popState: function popState() {
      this._encode.pop();
      this._parent.pop();
      this._lookup.pop();
      this._markpath.pop();
    },
    parent: function parent() {
      return peek$1(this._parent);
    },
    encode: function encode() {
      return peek$1(this._encode);
    },
    lookup: function lookup() {
      return peek$1(this._lookup);
    },
    markpath: function markpath() {
      var p = this._markpath;
      return ++p[p.length - 1];
    },
    // ----
    fieldRef: function fieldRef(field, name) {
      if (isString(field)) return fieldRef$1(field, name);
      if (!field.signal) {
        error('Unsupported field reference: ' + $(field));
      }
      var s = field.signal;
      var f = this.field[s];
      if (!f) {
        var params = {
          name: this.signalRef(s)
        };
        if (name) params.as = name;
        this.field[s] = f = ref(this.add(Field(params)));
      }
      return f;
    },
    compareRef: function compareRef(cmp) {
      var _this = this;
      var signal = false;
      var check = function check(_) {
        return isSignal(_) ? (signal = true, _this.signalRef(_.signal)) : isExpr$1(_) ? (signal = true, _this.exprRef(_.expr)) : _;
      };
      var fields = array$2(cmp.field).map(check),
        orders = array$2(cmp.order).map(check);
      return signal ? ref(this.add(Compare({
        fields: fields,
        orders: orders
      }))) : _compareRef(fields, orders);
    },
    keyRef: function keyRef(fields, flat) {
      var signal = false;
      var check = function check(_) {
        return isSignal(_) ? (signal = true, ref(sig[_.signal])) : _;
      };
      var sig = this.signals;
      fields = array$2(fields).map(check);
      return signal ? ref(this.add(Key({
        fields: fields,
        flat: flat
      }))) : _keyRef(fields, flat);
    },
    sortRef: function sortRef(sort) {
      if (!sort) return sort;

      // including id ensures stable sorting
      var a = aggrField(sort.op, sort.field),
        o = sort.order || Ascending;
      return o.signal ? ref(this.add(Compare({
        fields: a,
        orders: this.signalRef(o.signal)
      }))) : _compareRef(a, o);
    },
    // ----
    event: function event(source, type) {
      var key = source + ':' + type;
      if (!this.events[key]) {
        var id = this.id();
        this.streams.push({
          id: id,
          source: source,
          type: type
        });
        this.events[key] = id;
      }
      return this.events[key];
    },
    // ----
    hasOwnSignal: function hasOwnSignal(name) {
      return _has(this.signals, name);
    },
    addSignal: function addSignal(name, value) {
      if (this.hasOwnSignal(name)) {
        error('Duplicate signal name: ' + $(name));
      }
      var op = value instanceof Entry ? value : this.add(operator(value));
      return this.signals[name] = op;
    },
    getSignal: function getSignal(name) {
      if (!this.signals[name]) {
        error('Unrecognized signal name: ' + $(name));
      }
      return this.signals[name];
    },
    signalRef: function signalRef(s) {
      if (this.signals[s]) {
        return ref(this.signals[s]);
      } else if (!_has(this.lambdas, s)) {
        this.lambdas[s] = this.add(operator(null));
      }
      return ref(this.lambdas[s]);
    },
    parseLambdas: function parseLambdas() {
      var code = Object.keys(this.lambdas);
      for (var i = 0, n = code.length; i < n; ++i) {
        var s = code[i],
          e = parser(s, this),
          op = this.lambdas[s];
        op.params = e.$params;
        op.update = e.$expr;
      }
    },
    property: function property(spec) {
      return spec && spec.signal ? this.signalRef(spec.signal) : spec;
    },
    objectProperty: function objectProperty(spec) {
      return !spec || !isObject(spec) ? spec : this.signalRef(spec.signal || propertyLambda(spec));
    },
    exprRef: function exprRef(code, name) {
      var params = {
        expr: parser(code, this)
      };
      if (name) params.expr.$name = name;
      return ref(this.add(Expression(params)));
    },
    addBinding: function addBinding(name, bind) {
      if (!this.bindings) {
        error('Nested signals do not support binding: ' + $(name));
      }
      this.bindings.push(extend({
        signal: name
      }, bind));
    },
    // ----
    addScaleProj: function addScaleProj(name, transform) {
      if (_has(this.scales, name)) {
        error('Duplicate scale or projection name: ' + $(name));
      }
      this.scales[name] = this.add(transform);
    },
    addScale: function addScale(name, params) {
      this.addScaleProj(name, Scale(params));
    },
    addProjection: function addProjection(name, params) {
      this.addScaleProj(name, Projection(params));
    },
    getScale: function getScale(name) {
      if (!this.scales[name]) {
        error('Unrecognized scale name: ' + $(name));
      }
      return this.scales[name];
    },
    scaleRef: function scaleRef(name) {
      return ref(this.getScale(name));
    },
    scaleType: function scaleType(name) {
      return this.getScale(name).params.type;
    },
    projectionRef: function projectionRef(name) {
      return this.scaleRef(name);
    },
    projectionType: function projectionType(name) {
      return this.scaleType(name);
    },
    // ----
    addData: function addData(name, dataScope) {
      if (_has(this.data, name)) {
        error('Duplicate data set name: ' + $(name));
      }
      return this.data[name] = dataScope;
    },
    getData: function getData(name) {
      if (!this.data[name]) {
        error('Undefined data set name: ' + $(name));
      }
      return this.data[name];
    },
    addDataPipeline: function addDataPipeline(name, entries) {
      if (_has(this.data, name)) {
        error('Duplicate data set name: ' + $(name));
      }
      return this.addData(name, DataScope.fromEntries(this, entries));
    }
  };
  function propertyLambda(spec) {
    return (isArray(spec) ? arrayLambda : objectLambda)(spec);
  }
  function arrayLambda(array) {
    var n = array.length;
    var code = '[';
    for (var i = 0; i < n; ++i) {
      var _value = array[i];
      code += (i > 0 ? ',' : '') + (isObject(_value) ? _value.signal || propertyLambda(_value) : $(_value));
    }
    return code + ']';
  }
  function objectLambda(obj) {
    var code = '{',
      i = 0,
      key,
      value;
    for (key in obj) {
      value = obj[key];
      code += (++i > 1 ? ',' : '') + $(key) + ':' + (isObject(value) ? value.signal || propertyLambda(value) : $(value));
    }
    return code + '}';
  }

  /**
   * Standard configuration defaults for Vega specification parsing.
   * Users can provide their own (sub-)set of these default values
   * by passing in a config object to the top-level parse method.
   */
  function defaults() {
    var defaultFont = 'sans-serif',
      defaultSymbolSize = 30,
      defaultStrokeWidth = 2,
      defaultColor = '#4c78a8',
      black = '#000',
      gray = '#888',
      lightGray = '#ddd';
    return {
      // default visualization description
      description: 'Vega visualization',
      // default padding around visualization
      padding: 0,
      // default for automatic sizing; options: 'none', 'pad', 'fit'
      // or provide an object (e.g., {'type': 'pad', 'resize': true})
      autosize: 'pad',
      // default view background color
      // covers the entire view component
      background: null,
      // default event handling configuration
      // preventDefault for view-sourced event types except 'wheel'
      events: {
        defaults: {
          allow: ['wheel']
        }
      },
      // defaults for top-level group marks
      // accepts mark properties (fill, stroke, etc)
      // covers the data rectangle within group width/height
      group: null,
      // defaults for basic mark types
      // each subset accepts mark properties (fill, stroke, etc)
      mark: null,
      arc: {
        fill: defaultColor
      },
      area: {
        fill: defaultColor
      },
      image: null,
      line: {
        stroke: defaultColor,
        strokeWidth: defaultStrokeWidth
      },
      path: {
        stroke: defaultColor
      },
      rect: {
        fill: defaultColor
      },
      rule: {
        stroke: black
      },
      shape: {
        stroke: defaultColor
      },
      symbol: {
        fill: defaultColor,
        size: 64
      },
      text: {
        fill: black,
        font: defaultFont,
        fontSize: 11
      },
      trail: {
        fill: defaultColor,
        size: defaultStrokeWidth
      },
      // style definitions
      style: {
        // axis & legend labels
        'guide-label': {
          fill: black,
          font: defaultFont,
          fontSize: 10
        },
        // axis & legend titles
        'guide-title': {
          fill: black,
          font: defaultFont,
          fontSize: 11,
          fontWeight: 'bold'
        },
        // headers, including chart title
        'group-title': {
          fill: black,
          font: defaultFont,
          fontSize: 13,
          fontWeight: 'bold'
        },
        // chart subtitle
        'group-subtitle': {
          fill: black,
          font: defaultFont,
          fontSize: 12
        },
        // defaults for styled point marks in Vega-Lite
        point: {
          size: defaultSymbolSize,
          strokeWidth: defaultStrokeWidth,
          shape: 'circle'
        },
        circle: {
          size: defaultSymbolSize,
          strokeWidth: defaultStrokeWidth
        },
        square: {
          size: defaultSymbolSize,
          strokeWidth: defaultStrokeWidth,
          shape: 'square'
        },
        // defaults for styled group marks in Vega-Lite
        cell: {
          fill: 'transparent',
          stroke: lightGray
        },
        view: {
          fill: 'transparent'
        }
      },
      // defaults for title
      title: {
        orient: 'top',
        anchor: 'middle',
        offset: 4,
        subtitlePadding: 3
      },
      // defaults for axes
      axis: {
        minExtent: 0,
        maxExtent: 200,
        bandPosition: 0.5,
        domain: true,
        domainWidth: 1,
        domainColor: gray,
        grid: false,
        gridWidth: 1,
        gridColor: lightGray,
        labels: true,
        labelAngle: 0,
        labelLimit: 180,
        labelOffset: 0,
        labelPadding: 2,
        ticks: true,
        tickColor: gray,
        tickOffset: 0,
        tickRound: true,
        tickSize: 5,
        tickWidth: 1,
        titlePadding: 4
      },
      // correction for centering bias
      axisBand: {
        tickOffset: -0.5
      },
      // defaults for cartographic projection
      projection: {
        type: 'mercator'
      },
      // defaults for legends
      legend: {
        orient: 'right',
        padding: 0,
        gridAlign: 'each',
        columnPadding: 10,
        rowPadding: 2,
        symbolDirection: 'vertical',
        gradientDirection: 'vertical',
        gradientLength: 200,
        gradientThickness: 16,
        gradientStrokeColor: lightGray,
        gradientStrokeWidth: 0,
        gradientLabelOffset: 2,
        labelAlign: 'left',
        labelBaseline: 'middle',
        labelLimit: 160,
        labelOffset: 4,
        labelOverlap: true,
        symbolLimit: 30,
        symbolType: 'circle',
        symbolSize: 100,
        symbolOffset: 0,
        symbolStrokeWidth: 1.5,
        symbolBaseFillColor: 'transparent',
        symbolBaseStrokeColor: gray,
        titleLimit: 180,
        titleOrient: 'top',
        titlePadding: 5,
        layout: {
          offset: 18,
          direction: 'horizontal',
          left: {
            direction: 'vertical'
          },
          right: {
            direction: 'vertical'
          }
        }
      },
      // defaults for scale ranges
      range: {
        category: {
          scheme: 'tableau10'
        },
        ordinal: {
          scheme: 'blues'
        },
        heatmap: {
          scheme: 'yellowgreenblue'
        },
        ramp: {
          scheme: 'blues'
        },
        diverging: {
          scheme: 'blueorange',
          extent: [1, 0]
        },
        symbol: ['circle', 'square', 'triangle-up', 'cross', 'diamond', 'triangle-right', 'triangle-down', 'triangle-left']
      }
    };
  }
  function parse(spec, config, options) {
    if (!isObject(spec)) {
      error('Input Vega specification must be an object.');
    }
    config = mergeConfig(defaults(), config, spec.config);
    return parseView(spec, new Scope(config, options)).toRuntime();
  }

  // -- Transforms -----
  extend(transforms, tx, vtx, encode$1, geo, force, label, tree, reg, voronoi, wordcloud, xf);

  Object.defineProperty(exports, 'path', {
    enumerable: true,
    get: function () { return d3Path.path; }
  });
  exports.Bounds = Bounds;
  exports.CanvasHandler = CanvasHandler;
  exports.CanvasRenderer = CanvasRenderer;
  exports.DATE = DATE;
  exports.DAY = DAY;
  exports.DAYOFYEAR = DAYOFYEAR;
  exports.Dataflow = Dataflow;
  exports.Debug = Debug;
  exports.Error = Error$1;
  exports.EventStream = EventStream;
  exports.Gradient = Gradient$1;
  exports.GroupItem = GroupItem;
  exports.HOURS = HOURS;
  exports.Handler = Handler;
  exports.Info = Info;
  exports.Item = Item;
  exports.MILLISECONDS = MILLISECONDS;
  exports.MINUTES = MINUTES;
  exports.MONTH = MONTH;
  exports.Marks = Marks;
  exports.MultiPulse = MultiPulse;
  exports.None = None$2;
  exports.Operator = Operator;
  exports.Parameters = Parameters;
  exports.Pulse = Pulse;
  exports.QUARTER = QUARTER;
  exports.RenderType = RenderType;
  exports.Renderer = Renderer;
  exports.ResourceLoader = ResourceLoader;
  exports.SECONDS = SECONDS;
  exports.SVGHandler = SVGHandler;
  exports.SVGRenderer = SVGRenderer;
  exports.SVGStringRenderer = SVGStringRenderer;
  exports.Scenegraph = Scenegraph;
  exports.TIME_UNITS = TIME_UNITS;
  exports.Transform = Transform;
  exports.View = View$1;
  exports.WEEK = WEEK;
  exports.Warn = Warn;
  exports.YEAR = YEAR;
  exports.accessor = accessor;
  exports.accessorFields = accessorFields;
  exports.accessorName = accessorName;
  exports.array = array$2;
  exports.ascending = ascending$1;
  exports.bandwidthNRD = estimateBandwidth;
  exports.bin = bin;
  exports.bootstrapCI = bootstrapCI;
  exports.boundClip = boundClip;
  exports.boundContext = boundContext;
  exports.boundItem = boundItem$1;
  exports.boundMark = boundMark;
  exports.boundStroke = boundStroke;
  exports.changeset = changeset;
  exports.clampRange = clampRange;
  exports.codegenExpression = codegen;
  exports.compare = compare$1;
  exports.constant = constant$1;
  exports.cumulativeLogNormal = cumulativeLogNormal;
  exports.cumulativeNormal = cumulativeNormal;
  exports.cumulativeUniform = cumulativeUniform;
  exports.dayofyear = dayofyear;
  exports.debounce = debounce;
  exports.defaultLocale = defaultLocale;
  exports.definition = definition$1;
  exports.densityLogNormal = densityLogNormal;
  exports.densityNormal = densityNormal;
  exports.densityUniform = densityUniform;
  exports.domChild = domChild;
  exports.domClear = domClear;
  exports.domCreate = domCreate;
  exports.domFind = domFind;
  exports.dotbin = dotbin;
  exports.error = error;
  exports.expressionFunction = expressionFunction;
  exports.extend = extend;
  exports.extent = extent;
  exports.extentIndex = extentIndex;
  exports.falsy = falsy;
  exports.fastmap = fastmap;
  exports.field = field$1;
  exports.flush = flush;
  exports.font = font;
  exports.fontFamily = fontFamily;
  exports.fontSize = fontSize;
  exports.format = format$2;
  exports.formatLocale = numberFormatDefaultLocale;
  exports.formats = formats$1;
  exports.hasOwnProperty = _has;
  exports.id = id;
  exports.identity = identity;
  exports.inferType = inferType;
  exports.inferTypes = inferTypes;
  exports.ingest = ingest$1;
  exports.inherits = inherits;
  exports.inrange = inrange;
  exports.interpolate = interpolate;
  exports.interpolateColors = interpolateColors;
  exports.interpolateRange = interpolateRange;
  exports.intersect = intersect$2;
  exports.intersectBoxLine = intersectBoxLine;
  exports.intersectPath = intersectPath;
  exports.intersectPoint = intersectPoint;
  exports.intersectRule = intersectRule;
  exports.isArray = isArray;
  exports.isBoolean = isBoolean$1;
  exports.isDate = isDate$1;
  exports.isFunction = isFunction;
  exports.isIterable = isIterable;
  exports.isNumber = isNumber$1;
  exports.isObject = isObject;
  exports.isRegExp = isRegExp;
  exports.isString = isString;
  exports.isTuple = isTuple;
  exports.key = key$1;
  exports.lerp = lerp;
  exports.lineHeight = lineHeight;
  exports.loader = loader;
  exports.locale = locale;
  exports.logger = logger;
  exports.lruCache = lruCache;
  exports.markup = markup;
  exports.merge = merge$2;
  exports.mergeConfig = mergeConfig;
  exports.multiLineOffset = multiLineOffset;
  exports.one = one$1;
  exports.pad = pad;
  exports.panLinear = panLinear;
  exports.panLog = panLog;
  exports.panPow = panPow;
  exports.panSymlog = panSymlog;
  exports.parse = parse;
  exports.parseExpression = parser$1;
  exports.parseSelector = eventSelector;
  exports.pathCurves = curves;
  exports.pathEqual = pathEqual;
  exports.pathParse = parse$3;
  exports.pathRectangle = vg_rect;
  exports.pathRender = pathRender;
  exports.pathSymbols = symbols;
  exports.pathTrail = vg_trail;
  exports.peek = peek$1;
  exports.point = point;
  exports.projection = projection;
  exports.quantileLogNormal = quantileLogNormal;
  exports.quantileNormal = quantileNormal;
  exports.quantileUniform = quantileUniform;
  exports.quantiles = quantiles;
  exports.quantizeInterpolator = quantizeInterpolator;
  exports.quarter = quarter;
  exports.quartiles = quartiles;
  exports.randomInteger = integer;
  exports.randomKDE = kde;
  exports.randomLCG = lcg;
  exports.randomLogNormal = lognormal;
  exports.randomMixture = mixture$1;
  exports.randomNormal = gaussian;
  exports.randomUniform = uniform;
  exports.read = read;
  exports.regressionConstant = constant;
  exports.regressionExp = exp;
  exports.regressionLinear = linear;
  exports.regressionLoess = loess;
  exports.regressionLog = log$1;
  exports.regressionPoly = poly;
  exports.regressionPow = pow;
  exports.regressionQuad = quad;
  exports.renderModule = renderModule;
  exports.repeat = repeat;
  exports.resetDefaultLocale = resetDefaultLocale;
  exports.resetSVGClipId = resetSVGClipId;
  exports.resetSVGDefIds = resetSVGDefIds;
  exports.responseType = responseType;
  exports.runtimeContext = context;
  exports.sampleCurve = sampleCurve;
  exports.sampleLogNormal = sampleLogNormal;
  exports.sampleNormal = sampleNormal;
  exports.sampleUniform = sampleUniform;
  exports.scale = scale$4;
  exports.sceneEqual = sceneEqual;
  exports.sceneFromJSON = sceneFromJSON;
  exports.scenePickVisit = pickVisit;
  exports.sceneToJSON = sceneToJSON;
  exports.sceneVisit = visit;
  exports.sceneZOrder = zorder;
  exports.scheme = scheme;
  exports.serializeXML = serializeXML;
  exports.setRandom = setRandom;
  exports.span = span;
  exports.splitAccessPath = splitAccessPath;
  exports.stringValue = $;
  exports.textMetrics = textMetrics;
  exports.timeBin = bin$1;
  exports.timeFloor = timeFloor;
  exports.timeFormatLocale = timeFormatDefaultLocale;
  exports.timeInterval = timeInterval;
  exports.timeOffset = timeOffset;
  exports.timeSequence = timeSequence;
  exports.timeUnitSpecifier = timeUnitSpecifier;
  exports.timeUnits = timeUnits;
  exports.toBoolean = toBoolean;
  exports.toDate = toDate;
  exports.toNumber = toNumber;
  exports.toSet = toSet;
  exports.toString = toString;
  exports.transform = transform$1;
  exports.transforms = transforms;
  exports.truncate = truncate$1;
  exports.truthy = truthy;
  exports.tupleid = tupleid;
  exports.typeParsers = typeParsers;
  exports.utcFloor = utcFloor;
  exports.utcInterval = utcInterval;
  exports.utcOffset = utcOffset;
  exports.utcSequence = utcSequence;
  exports.utcdayofyear = utcdayofyear;
  exports.utcquarter = utcquarter;
  exports.utcweek = utcweek;
  exports.version = version;
  exports.visitArray = visitArray;
  exports.week = week;
  exports.writeConfig = writeConfig;
  exports.zero = zero$1;
  exports.zoomLinear = zoomLinear;
  exports.zoomLog = zoomLog;
  exports.zoomPow = zoomPow;
  exports.zoomSymlog = zoomSymlog;

}));
