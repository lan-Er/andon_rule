/* eslint-disable prefer-destructuring */
/* eslint-disable object-shorthand */
/* eslint-disable no-var */
/* eslint-disable func-names */
/* eslint-disable prefer-const */
import { useState, useRef, useCallback, useEffect } from 'react';
import { o as observerDomResize, d as debounce } from './index-8dc41d20.js';
import { s as slicedToArray, _ as _extends } from './_babelHelpers-a63acad8.js';

function useAutoResize() {
  // eslint-disable-next-line one-var
  let _useState = useState({ width: 0, height: 0 }),
    _useState2 = slicedToArray(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];

  // eslint-disable-next-line no-var
  var domRef = useRef(null);
  // eslint-disable-next-line no-var
  var domObserverRef = useRef(null);
  // eslint-disable-next-line no-var
  var debounceSetWHFunRef = useRef(null);

  // eslint-disable-next-line no-var
  var setWH = useCallback(function () {
    // eslint-disable-next-line no-var
    // eslint-disable-next-line one-var
    var _domRef$current = domRef.current,
      clientWidth = _domRef$current.clientWidth,
      clientHeight = _domRef$current.clientHeight;

    setState({ width: clientWidth, height: clientHeight });
  }, []);

  var bindDomResizeCallback = useCallback(function () {
    domObserverRef.current = observerDomResize(domRef.current, debounceSetWHFunRef.current);
    if (window.attachEvent) {
      window.addEventListener('onresize', debounceSetWHFunRef.current);
    } else {
      window.addEventListener('resize', debounceSetWHFunRef.current);
    }
  }, []);

  var unbindDomResizeCallback = useCallback(function () {
    var domObserver = domObserverRef.current;

    domObserver.disconnect();
    domObserver.takeRecords();
    domObserverRef.current = null;

    if (window.attachEvent) {
      window.removeEventListener('onresize', debounceSetWHFunRef.current);
    } else {
      window.removeEventListener('resize', debounceSetWHFunRef.current);
    }
  }, []);

  useEffect(function () {
    debounceSetWHFunRef.current = debounce(setWH, 100);

    debounceSetWHFunRef.current();

    bindDomResizeCallback();

    // 组件销毁时，清除事件
    return unbindDomResizeCallback;
  }, []);

  return _extends({}, state, { domRef: domRef });
}

export { useAutoResize as u };
// eslint-disable-next-line spaced-comment
//# sourceMappingURL=autoResize-6a8eac7c.js.map
