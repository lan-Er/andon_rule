/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import React, { useLayoutEffect } from 'react';
import { s as styleInject, P as PropTypes } from './style-inject.es-4766d9ed.js';
import './index-8dc41d20.js';
import './_babelHelpers-a63acad8.js';
import { u as useAutoResize } from './autoResize-6a8eac7c.js';

const css =
  '#dv-full-screen-container {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  overflow: hidden;\n  transform-origin: left top;\n  z-index: 999;\n}\n';
styleInject(css);

const FullScreenContainer = function FullScreenContainer(_ref) {
  // eslint-disable-next-line prefer-destructuring
  const children = _ref.children;

  // eslint-disable-next-line prefer-destructuring
  const className = _ref.className;

  // eslint-disable-next-line prefer-destructuring
  const style = _ref.style;

  const _useAutoResize = useAutoResize();

  // eslint-disable-next-line prefer-destructuring
  const domRef = _useAutoResize.domRef;

  // eslint-disable-next-line func-names
  useLayoutEffect(function () {
    const _window$screen = window.screen;
    const _body$clientHight = document.body.offsetHeight;

    // eslint-disable-next-line prefer-destructuring
    const width = _window$screen.width;

    const height = _body$clientHight;

    Object.assign(domRef.current.style, {
      width: `${width}px`,
      height: `${height}px`,
    });

    domRef.current.style.transform = `scale(${document.body.clientWidth / width})`;
  });

  return React.createElement(
    'div',
    {
      id: 'dv-full-screen-container',
      className,
      style,
      ref: domRef,
    },
    children
  );
};

FullScreenContainer.propTypes = {
  // eslint-disable-next-line react/require-default-props
  // eslint-disable-next-line react/no-unused-prop-types
  children: PropTypes.node,
  className: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  style: PropTypes.object,
};

export default FullScreenContainer;
// # sourceMappingURL=index.js.map
