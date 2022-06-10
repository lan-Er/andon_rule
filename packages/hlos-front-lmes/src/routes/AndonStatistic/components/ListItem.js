import React, { useRef, useState, useLayoutEffect } from 'react';

import styles from '../index.module.less';

export default function ListItem(props) {
  const {
    value,
    maxValue,
    originalRec = {},
    text,
    color,
    order,
    showProgress,
    containerRef,
    setMouseEnterFlag,
    setMouseAxisData,
    setToolTipRec,
    uom = 'min',
  } = props;
  const textRef = useRef(null);
  const [fontWidth, setFontWidth] = useState(0);
  const [textOverflow, setTextOverflow] = useState(false);

  useLayoutEffect(() => {
    const { current } = textRef;
    if (current && showProgress) {
      const _fontWidth = current.getBoundingClientRect().width;
      setFontWidth(_fontWidth);
    }
  }, [textRef, showProgress]);

  useLayoutEffect(() => {
    if (showProgress && fontWidth && containerRef && maxValue !== -1) {
      const containerWidth = containerRef.getBoundingClientRect().width;
      if (value === 0) {
        setTextOverflow(true);
      } else {
        const ratio = value / maxValue;
        setTextOverflow(isNaN(ratio) ? true : containerWidth * 0.7 * ratio < fontWidth);
      }
    }
  }, [containerRef, fontWidth, value, maxValue, order, showProgress]);

  const otherProps = {};
  if (setMouseEnterFlag && setToolTipRec) {
    otherProps.onMouseEnter = () => {
      setMouseEnterFlag(true);
      setToolTipRec(originalRec);
    };
  }
  if (setMouseEnterFlag) {
    otherProps.onMouseLeave = () => setMouseEnterFlag(false);
  }
  if (setMouseAxisData) {
    otherProps.onMouseMove = (e) => setMouseAxisData({ x: e.clientX, y: e.clientY });
  }
  return (
    <div
      className={styles.progressBar}
      style={{
        color: showProgress ? '#FFF' : '#000',
        marginTop: showProgress ? '12px' : '9px',
      }}
      {...otherProps}
    >
      <div
        className={styles.bar}
        style={{
          height: showProgress ? '23px' : '18px',
          lineHeight: showProgress ? '23px' : '18px',
        }}
      >
        <span
          className={styles.colorBar}
          style={{
            color: showProgress ? '#FFF' : '#000',
            fontSize: showProgress ? '14px' : '12px',
            backgroundColor: showProgress ? color : '#FFF',
            flexBasis: `${(value / maxValue || 0.01) * 100}%`,
          }}
        />
        <span
          className={styles.content}
          style={{
            textShadow: textOverflow ? '1px 1px 1px grey' : 'none',
          }}
          ref={(node) => {
            textRef.current = node;
          }}
        >
          {text}
        </span>
      </div>
      <div className={styles.value}>
        <span
          className={styles.value}
          style={{
            fontSize: showProgress ? '16px' : '12px',
            color: showProgress ? color : '#000',
          }}
        >
          {`${value || 0}${uom}`}
        </span>
      </div>
    </div>
  );
}
