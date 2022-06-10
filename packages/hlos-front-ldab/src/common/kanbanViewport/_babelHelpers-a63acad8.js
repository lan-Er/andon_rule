/* eslint-disable no-param-reassign */
/* eslint-disable prefer-rest-params */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable block-scoped-var */
/* eslint-disable no-unsafe-finally */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable prefer-const */
/* eslint-disable func-names */
// eslint-disable-next-line import/no-mutable-exports
let _extends =
  Object.assign ||
  function (target) {
    for (let i = 1; i < arguments.length; i++) {
      let source = arguments[i];

      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

// eslint-disable-next-line import/no-mutable-exports
let slicedToArray = (function () {
  function sliceIterator(arr, i) {
    let _arr = [];
    let _n = true;
    let _d = false;
    // eslint-disable-next-line no-undef-init
    let _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        // eslint-disable-next-line dot-notation
        if (!_n && _i['return']) _i['return']();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError('Invalid attempt to destructure non-iterable instance');
    }
  };
})();

let toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

export { _extends as _, slicedToArray as s, toConsumableArray as t };
// eslint-disable-next-line spaced-comment
//# sourceMappingURL=_babelHelpers-a63acad8.js.map
