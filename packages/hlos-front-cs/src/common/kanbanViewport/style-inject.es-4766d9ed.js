/* eslint-disable no-console */
/* eslint-disable no-sequences */
/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-void */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-empty */
/* eslint-disable prefer-rest-params */
/* eslint-disable one-var */
/* eslint-disable no-undef */
/* eslint-disable prefer-template */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-return-assign */
function unwrapExports(x) {
  // eslint-disable-next-line dot-notation
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
  // eslint-disable-next-line no-return-assign
  // eslint-disable-next-line no-param-reassign
  return (module = { exports: {} }), fn(module, module.exports), module.exports;
}

const reactIs_production_min = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, '__esModule', { value: !0 });
  // eslint-disable-next-line one-var
  // eslint-disable-next-line yoda
  const b = 'function' === typeof Symbol && Symbol.for,
    c = b ? Symbol.for('react.element') : 60103,
    d = b ? Symbol.for('react.portal') : 60106,
    e = b ? Symbol.for('react.fragment') : 60107,
    f = b ? Symbol.for('react.strict_mode') : 60108,
    g = b ? Symbol.for('react.profiler') : 60114,
    h = b ? Symbol.for('react.provider') : 60109,
    k = b ? Symbol.for('react.context') : 60110,
    l = b ? Symbol.for('react.async_mode') : 60111,
    m = b ? Symbol.for('react.concurrent_mode') : 60111,
    n = b ? Symbol.for('react.forward_ref') : 60112,
    p = b ? Symbol.for('react.suspense') : 60113,
    q = b ? Symbol.for('react.suspense_list') : 60120,
    r = b ? Symbol.for('react.memo') : 60115,
    t = b ? Symbol.for('react.lazy') : 60116,
    v = b ? Symbol.for('react.fundamental') : 60117,
    w = b ? Symbol.for('react.responder') : 60118;
  function x(a) {
    // eslint-disable-next-line yoda
    if ('object' === typeof a && null !== a) {
      const u = a.$$typeof;
      switch (u) {
        case c:
          switch (((a = a.type), a)) {
            case l:
            case m:
            case e:
            case g:
            case f:
            case p:
              return a;
            default:
              switch (((a = a && a.$$typeof), a)) {
                case k:
                case n:
                case h:
                  return a;
                default:
                  return u;
              }
          }
        case t:
        case r:
        case d:
          return u;
      }
    }
  }
  function y(a) {
    return x(a) === m;
  }
  exports.typeOf = x;
  exports.AsyncMode = l;
  exports.ConcurrentMode = m;
  exports.ContextConsumer = k;
  exports.ContextProvider = h;
  exports.Element = c;
  exports.ForwardRef = n;
  exports.Fragment = e;
  exports.Lazy = t;
  exports.Memo = r;
  exports.Portal = d;
  exports.Profiler = g;
  exports.StrictMode = f;
  exports.Suspense = p;
  exports.isValidElementType = function (a) {
    return (
      // eslint-disable-next-line yoda
      'string' === typeof a ||
      // eslint-disable-next-line yoda
      'function' === typeof a ||
      a === e ||
      a === m ||
      a === g ||
      a === f ||
      a === p ||
      a === q ||
      // eslint-disable-next-line yoda
      ('object' === typeof a &&
        // eslint-disable-next-line yoda
        null !== a &&
        (a.$$typeof === t ||
          a.$$typeof === r ||
          a.$$typeof === h ||
          a.$$typeof === k ||
          a.$$typeof === n ||
          a.$$typeof === v ||
          a.$$typeof === w))
    );
  };
  exports.isAsyncMode = function (a) {
    return y(a) || x(a) === l;
  };
  exports.isConcurrentMode = y;
  exports.isContextConsumer = function (a) {
    return x(a) === k;
  };
  exports.isContextProvider = function (a) {
    return x(a) === h;
  };
  exports.isElement = function (a) {
    // eslint-disable-next-line yoda
    return 'object' === typeof a && null !== a && a.$$typeof === c;
  };
  exports.isForwardRef = function (a) {
    return x(a) === n;
  };
  exports.isFragment = function (a) {
    return x(a) === e;
  };
  exports.isLazy = function (a) {
    return x(a) === t;
  };
  exports.isMemo = function (a) {
    return x(a) === r;
  };
  exports.isPortal = function (a) {
    return x(a) === d;
  };
  exports.isProfiler = function (a) {
    return x(a) === g;
  };
  exports.isStrictMode = function (a) {
    return x(a) === f;
  };
  exports.isSuspense = function (a) {
    return x(a) === p;
  };
});

unwrapExports(reactIs_production_min);
// eslint-disable-next-line camelcase
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line prefer-const
// eslint-disable-next-line no-unused-vars
const reactIs_production_min_1 = reactIs_production_min.typeOf;
const reactIs_production_min_2 = reactIs_production_min.AsyncMode;
const reactIs_production_min_3 = reactIs_production_min.ConcurrentMode;
const reactIs_production_min_4 = reactIs_production_min.ContextConsumer;
const reactIs_production_min_5 = reactIs_production_min.ContextProvider;
const reactIs_production_min_6 = reactIs_production_min.Element;
const reactIs_production_min_7 = reactIs_production_min.ForwardRef;
const reactIs_production_min_8 = reactIs_production_min.Fragment;
const reactIs_production_min_9 = reactIs_production_min.Lazy;
const reactIs_production_min_10 = reactIs_production_min.Memo;
const reactIs_production_min_11 = reactIs_production_min.Portal;
const reactIs_production_min_12 = reactIs_production_min.Profiler;
const reactIs_production_min_13 = reactIs_production_min.StrictMode;
const reactIs_production_min_14 = reactIs_production_min.Suspense;
const reactIs_production_min_15 = reactIs_production_min.isValidElementType;
const reactIs_production_min_16 = reactIs_production_min.isAsyncMode;
const reactIs_production_min_17 = reactIs_production_min.isConcurrentMode;
const reactIs_production_min_18 = reactIs_production_min.isContextConsumer;
const reactIs_production_min_19 = reactIs_production_min.isContextProvider;
const reactIs_production_min_20 = reactIs_production_min.isElement;
const reactIs_production_min_21 = reactIs_production_min.isForwardRef;
const reactIs_production_min_22 = reactIs_production_min.isFragment;
const reactIs_production_min_23 = reactIs_production_min.isLazy;
const reactIs_production_min_24 = reactIs_production_min.isMemo;
const reactIs_production_min_25 = reactIs_production_min.isPortal;
const reactIs_production_min_26 = reactIs_production_min.isProfiler;
const reactIs_production_min_27 = reactIs_production_min.isStrictMode;
const reactIs_production_min_28 = reactIs_production_min.isSuspense;

const reactIs_development = createCommonjsModule(function (module, exports) {
  if (process.env.NODE_ENV !== 'production') {
    (function () {
      Object.defineProperty(exports, '__esModule', { value: true });

      // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
      // nor polyfill, then a plain number is used for performance.
      const hasSymbol = typeof Symbol === 'function' && Symbol.for;

      const REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
      const REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
      const REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
      const REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
      const REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
      const REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
      const REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
      // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
      // (unstable) APIs that have been removed. Can we remove the symbols?
      const REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
      const REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
      const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
      const REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
      const REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
      const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
      const REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
      const REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
      const REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;

      function isValidElementType(type) {
        return (
          typeof type === 'string' ||
          typeof type === 'function' ||
          // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
          type === REACT_FRAGMENT_TYPE ||
          type === REACT_CONCURRENT_MODE_TYPE ||
          type === REACT_PROFILER_TYPE ||
          type === REACT_STRICT_MODE_TYPE ||
          type === REACT_SUSPENSE_TYPE ||
          type === REACT_SUSPENSE_LIST_TYPE ||
          (typeof type === 'object' &&
            type !== null &&
            (type.$$typeof === REACT_LAZY_TYPE ||
              type.$$typeof === REACT_MEMO_TYPE ||
              type.$$typeof === REACT_PROVIDER_TYPE ||
              type.$$typeof === REACT_CONTEXT_TYPE ||
              type.$$typeof === REACT_FORWARD_REF_TYPE ||
              type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
              type.$$typeof === REACT_RESPONDER_TYPE))
        );
      }

      /**
       * Forked from fbjs/warning:
       * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
       *
       * Only change is we use console.warn instead of console.error,
       * and do nothing when 'console' is not supported.
       * This really simplifies the code.
       * ---
       * Similar to inletiant but only logs a warning if the condition is not met.
       * This can be used to log issues in development environments in critical
       * paths. Removing the logging code for production environments will keep the
       * same logic and follow the same code paths.
       */

      let lowPriorityWarning = function () {};

      {
        const printWarning = function (format) {
          for (
            let _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1;
            _key < _len;
            _key++
          ) {
            args[_key - 1] = arguments[_key];
          }

          let argIndex = 0;
          const message =
            'Warning: ' +
            format.replace(/%s/g, function () {
              return args[argIndex++];
            });
          if (typeof console !== 'undefined') {
            console.warn(message);
          }
          try {
            // --- Welcome to debugging React ---
            // This error was thrown as a convenience so that you can use this stack
            // to find the callsite that caused this warning to fire.
            throw new Error(message);
          } catch (x) {}
        };

        lowPriorityWarning = function (condition, format) {
          if (format === undefined) {
            throw new Error(
              '`lowPriorityWarning(condition, format, ...args)` requires a warning ' +
                'message argument'
            );
          }
          if (!condition) {
            for (
              let _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2;
              _key2 < _len2;
              _key2++
            ) {
              // eslint-disable-next-line prefer-rest-params
              args[_key2 - 2] = arguments[_key2];
            }

            // eslint-disable-next-line prefer-spread
            printWarning.apply(undefined, [format].concat(args));
          }
        };
      }

      const lowPriorityWarning$1 = lowPriorityWarning;

      function typeOf(object) {
        if (typeof object === 'object' && object !== null) {
          const $$typeof = object.$$typeof;
          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              const type = object.type;

              switch (type) {
                case REACT_ASYNC_MODE_TYPE:
                case REACT_CONCURRENT_MODE_TYPE:
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                  return type;
                default:
                  const $$typeofType = type && type.$$typeof;

                  switch ($$typeofType) {
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;
                    default:
                      return $$typeof;
                  }
              }
            case REACT_LAZY_TYPE:
            case REACT_MEMO_TYPE:
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }

        return undefined;
      }

      // AsyncMode is deprecated along with isAsyncMode
      const AsyncMode = REACT_ASYNC_MODE_TYPE;
      const ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
      const ContextConsumer = REACT_CONTEXT_TYPE;
      const ContextProvider = REACT_PROVIDER_TYPE;
      const Element = REACT_ELEMENT_TYPE;
      const ForwardRef = REACT_FORWARD_REF_TYPE;
      const Fragment = REACT_FRAGMENT_TYPE;
      const Lazy = REACT_LAZY_TYPE;
      const Memo = REACT_MEMO_TYPE;
      const Portal = REACT_PORTAL_TYPE;
      const Profiler = REACT_PROFILER_TYPE;
      const StrictMode = REACT_STRICT_MODE_TYPE;
      const Suspense = REACT_SUSPENSE_TYPE;

      let hasWarnedAboutDeprecatedIsAsyncMode = false;

      // AsyncMode should be deprecated
      function isAsyncMode(object) {
        // eslint-disable-next-line no-lone-blocks
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true;
            lowPriorityWarning$1(
              false,
              'The ReactIs.isAsyncMode() alias has been deprecated, ' +
                'and will be removed in React 17+. Update your code to use ' +
                'ReactIs.isConcurrentMode() instead. It has the exact same API.'
            );
          }
        }
        return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
      }
      function isConcurrentMode(object) {
        return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
      }
      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }
      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }
      function isElement(object) {
        return (
          typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE
        );
      }
      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }
      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }
      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }
      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }
      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }
      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }
      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }
      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }

      exports.typeOf = typeOf;
      exports.AsyncMode = AsyncMode;
      exports.ConcurrentMode = ConcurrentMode;
      exports.ContextConsumer = ContextConsumer;
      exports.ContextProvider = ContextProvider;
      exports.Element = Element;
      exports.ForwardRef = ForwardRef;
      exports.Fragment = Fragment;
      exports.Lazy = Lazy;
      // eslint-disable-next-line no-param-reassign
      exports.Memo = Memo;
      exports.Portal = Portal;
      exports.Profiler = Profiler;
      exports.StrictMode = StrictMode;
      exports.Suspense = Suspense;
      exports.isValidElementType = isValidElementType;
      exports.isAsyncMode = isAsyncMode;
      exports.isConcurrentMode = isConcurrentMode;
      exports.isContextConsumer = isContextConsumer;
      exports.isContextProvider = isContextProvider;
      exports.isElement = isElement;
      exports.isForwardRef = isForwardRef;
      exports.isFragment = isFragment;
      exports.isLazy = isLazy;
      exports.isMemo = isMemo;
      exports.isPortal = isPortal;
      exports.isProfiler = isProfiler;
      exports.isStrictMode = isStrictMode;
      exports.isSuspense = isSuspense;
    })();
  }
});

unwrapExports(reactIs_development);
const reactIs_development_1 = reactIs_development.typeOf;
const reactIs_development_2 = reactIs_development.AsyncMode;
const reactIs_development_3 = reactIs_development.ConcurrentMode;
const reactIs_development_4 = reactIs_development.ContextConsumer;
const reactIs_development_5 = reactIs_development.ContextProvider;
const reactIs_development_6 = reactIs_development.Element;
const reactIs_development_7 = reactIs_development.ForwardRef;
const reactIs_development_8 = reactIs_development.Fragment;
const reactIs_development_9 = reactIs_development.Lazy;
const reactIs_development_10 = reactIs_development.Memo;
const reactIs_development_11 = reactIs_development.Portal;
const reactIs_development_12 = reactIs_development.Profiler;
const reactIs_development_13 = reactIs_development.StrictMode;
const reactIs_development_14 = reactIs_development.Suspense;
const reactIs_development_15 = reactIs_development.isValidElementType;
const reactIs_development_16 = reactIs_development.isAsyncMode;
const reactIs_development_17 = reactIs_development.isConcurrentMode;
const reactIs_development_18 = reactIs_development.isContextConsumer;
const reactIs_development_19 = reactIs_development.isContextProvider;
const reactIs_development_20 = reactIs_development.isElement;
const reactIs_development_21 = reactIs_development.isForwardRef;
const reactIs_development_22 = reactIs_development.isFragment;
const reactIs_development_23 = reactIs_development.isLazy;
const reactIs_development_24 = reactIs_development.isMemo;
const reactIs_development_25 = reactIs_development.isPortal;
const reactIs_development_26 = reactIs_development.isProfiler;
const reactIs_development_27 = reactIs_development.isStrictMode;
const reactIs_development_28 = reactIs_development.isSuspense;

const reactIs = createCommonjsModule(function (module) {
  if (process.env.NODE_ENV === 'production') {
    module.exports = reactIs_production_min;
  } else {
    module.exports = reactIs_development;
  }
});

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-lets */
const getOwnPropertySymbols = Object.getOwnPropertySymbols;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    }

    // Detect buggy property enumeration order in older V8 versions.

    // https://bugs.chromium.org/p/v8/issues/detail?id=4118
    const test1 = new String('abc'); // eslint-disable-line no-new-wrappers
    test1[5] = 'de';
    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    const test2 = {};
    for (let i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }
    const order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });
    if (order2.join('') !== '0123456789') {
      return false;
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    const test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });
    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

const objectAssign = shouldUseNative()
  ? Object.assign
  : function (target, source) {
      let from;
      const to = toObject(target);
      let symbols;

      for (let s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);

        for (const key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }

        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (let i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }

      return to;
    };

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

const ReactPropTypesSecret_1 = ReactPropTypesSecret;

let printWarning = function () {};

if (process.env.NODE_ENV !== 'production') {
  const ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  const loggedTypeFailures = {};
  const has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function (text) {
    const message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (const typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        let error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an inletiant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            const err = Error(
              (componentName || 'React class') +
                ': ' +
                location +
                ' type `' +
                typeSpecName +
                '` is invalid; ' +
                'it must be a function, usually from the `prop-types` package, but received `' +
                typeof typeSpecs[typeSpecName] +
                '`.'
            );
            err.name = 'Inletiant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](
            values,
            typeSpecName,
            componentName,
            location,
            null,
            ReactPropTypesSecret$1
          );
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') +
              ': type specification of ' +
              location +
              ' `' +
              typeSpecName +
              '` is invalid; the type checker ' +
              'function must return `null` or an `Error` but returned a ' +
              typeof error +
              '. ' +
              'You may have forgotten to pass an argument to the type checker ' +
              'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
              'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          const stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function () {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
};

const checkPropTypes_1 = checkPropTypes;

const has$1 = Function.call.bind(Object.prototype.hasOwnProperty);
let printWarning$1 = function () {};

if (process.env.NODE_ENV !== 'production') {
  printWarning$1 = function (text) {
    const message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

const factoryWithTypeCheckers = function (isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  const ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  const FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     let iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       let iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    const iteratorFn =
      maybeIterable &&
      ((ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL]) || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   let Props = require('ReactPropTypes');
   *   let MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  let MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        let propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  const ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  const ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  // eslint-disable-next-line spaced-comment
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  // eslint-disable-next-line spaced-comment
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      const manualPropTypeCallCache = {};
      const manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          const err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
              'Use `PropTypes.checkPropTypes()` to call them. ' +
              'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Inletiant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          const cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning$1(
              'You are manually calling a React.PropTypes validation ' +
                'function for the `' +
                propFullName +
                '` prop on `' +
                componentName +
                '`. This is deprecated ' +
                'and will throw in the standalone `prop-types` package. ' +
                'You may be seeing this warning due to a third-party PropTypes ' +
                'library. See https://fb.me/react-warning-dont-call-proptypes ' +
                'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError(
              'The ' +
                location +
                ' `' +
                propFullName +
                '` is marked as required ' +
                ('in `' + componentName + '`, but its value is `null`.')
            );
          }
          return new PropTypeError(
            'The ' +
              location +
              ' `' +
              propFullName +
              '` is marked as required in ' +
              ('`' + componentName + '`, but its value is `undefined`.')
          );
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    const chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      const propValue = props[propName];
      const propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        const preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') +
            ('`' + expectedType + '`.')
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError(
          'Property `' +
            propFullName +
            '` of component `' +
            componentName +
            '` has invalid PropType notation inside arrayOf.'
        );
      }
      const propValue = props[propName];
      if (!Array.isArray(propValue)) {
        const propType = getPropType(propValue);
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' + propType + '` supplied to `' + componentName + '`, expected an array.')
        );
      }
      for (let i = 0; i < propValue.length; i++) {
        const error = typeChecker(
          propValue,
          i,
          componentName,
          location,
          propFullName + '[' + i + ']',
          ReactPropTypesSecret_1
        );
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      const propValue = props[propName];
      if (!isValidElement(propValue)) {
        const propType = getPropType(propValue);
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              propType +
              '` supplied to `' +
              componentName +
              '`, expected a single ReactElement.')
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      const propValue = props[propName];
      if (!reactIs.isValidElementType(propValue)) {
        const propType = getPropType(propValue);
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' +
              propType +
              '` supplied to `' +
              componentName +
              '`, expected a single ReactElement type.')
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        const expectedClassName = expectedClass.name || ANONYMOUS;
        const actualClassName = getClassName(props[propName]);
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') +
            ('instance of `' + expectedClassName + '`.')
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning$1(
            'Invalid arguments supplied to oneOf, expected an array, got ' +
              arguments.length +
              ' arguments. ' +
              'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning$1('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      const propValue = props[propName];
      for (let i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      const valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        const type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError(
        'Invalid ' +
          location +
          ' `' +
          propFullName +
          '` of value `' +
          String(propValue) +
          '` ' +
          ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.')
      );
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError(
          'Property `' +
            propFullName +
            '` of component `' +
            componentName +
            '` has invalid PropType notation inside objectOf.'
        );
      }
      const propValue = props[propName];
      const propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type ' +
            ('`' + propType + '` supplied to `' + componentName + '`, expected an object.')
        );
      }
      for (const key in propValue) {
        if (has$1(propValue, key)) {
          const error = typeChecker(
            propValue,
            key,
            componentName,
            location,
            propFullName + '.' + key,
            ReactPropTypesSecret_1
          );
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production'
        ? printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.')
        : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (let i = 0; i < arrayOfTypeCheckers.length; i++) {
      const checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning$1(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
            'received ' +
            getPostfixForTypeWarning(checker) +
            ' at index ' +
            i +
            '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (let i = 0; i < arrayOfTypeCheckers.length; i++) {
        const checker = arrayOfTypeCheckers[i];
        if (
          checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) ==
          null
        ) {
          return null;
        }
      }

      return new PropTypeError(
        'Invalid ' +
          location +
          ' `' +
          propFullName +
          '` supplied to ' +
          ('`' + componentName + '`.')
      );
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` supplied to ' +
            ('`' + componentName + '`, expected a ReactNode.')
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      const propValue = props[propName];
      const propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type `' +
            propType +
            '` ' +
            ('supplied to `' + componentName + '`, expected `object`.')
        );
      }
      for (const key in shapeTypes) {
        const checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        const error = checker(
          propValue,
          key,
          componentName,
          location,
          propFullName + '.' + key,
          ReactPropTypesSecret_1
        );
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      const propValue = props[propName];
      const propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError(
          'Invalid ' +
            location +
            ' `' +
            propFullName +
            '` of type `' +
            propType +
            '` ' +
            ('supplied to `' + componentName + '`, expected `object`.')
        );
      }
      // We need to check all keys in case some are required but missing from
      // props.
      const allKeys = objectAssign({}, props[propName], shapeTypes);
      for (const key in allKeys) {
        const checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' +
              location +
              ' `' +
              propFullName +
              '` key `' +
              key +
              '` supplied to `' +
              componentName +
              '`.' +
              '\nBad object: ' +
              JSON.stringify(props[propName], null, '  ') +
              '\nValid keys: ' +
              JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        const error = checker(
          propValue,
          key,
          componentName,
          location,
          propFullName + '.' + key,
          ReactPropTypesSecret_1
        );
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        const iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          const iterator = iteratorFn.call(propValue);
          let step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              const entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    const propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    const propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    const type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

const factoryWithThrowingShims = function () {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    const err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
        'Use PropTypes.checkPropTypes() to call them. ' +
        'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Inletiant Violation';
    throw err;
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  } // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  const ReactPropTypes = {
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
    resetWarningCache: emptyFunction,
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

const propTypes = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  if (process.env.NODE_ENV !== 'production') {
    const ReactIs = reactIs;

    // By explicitly using `prop-types` you are opting into new development behavior.
    // http://fb.me/prop-types-in-prod
    const throwOnDirectAccess = true;
    module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
  } else {
    // By explicitly using `prop-types` you are opting into new production behavior.
    // http://fb.me/prop-types-in-prod
    module.exports = factoryWithThrowingShims();
  }
});

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  const insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

export { propTypes as P, createCommonjsModule as c, styleInject as s, unwrapExports as u };
// eslint-disable-next-line spaced-comment
//# sourceMappingURL=style-inject.es-4766d9ed.js.map
