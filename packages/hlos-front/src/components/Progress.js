/*
 * @Description: 文字进度条组件
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-13 14:39:28
 * @LastEditors: 赵敏捷
 */
import React from 'react';
import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';
import styles from './index.less';

/**
 * 文字进度条组件
 * @param {Object} props
 * @param {string[][]} props.progressName - 各状态下进度名称，内外层数组长度均可表示总进度长度
 * @param {number} props.currentProgress
 * @param {string} props.todoColor
 * @param {string} props.doneColor
 */

export function Progress({
  progressName,
  currentProgress = 1,
  todoColor,
  doneColor,
  ...otherProps
}) {
  return (
    <div className={styles.progress} {...otherProps}>
      {progressName[currentProgress - 1].map((names, index) => {
        const last = index === progressName.length - 1;
        return (
          <div className={styles['progress-item']} key={uuidv4()}>
            <div
              className={styles.indicator}
              style={{
                border: `1px solid ${index < currentProgress ? doneColor : todoColor}`,
                color: index < currentProgress ? doneColor : todoColor,
              }}
            >
              {index + 1 < currentProgress ? '\u2713' : index + 1}
            </div>
            <div className={styles['indicator-text']} style={{ marginRight: last ? '0' : '21px' }}>
              {names}
            </div>
            {!last && (
              <div
                className={styles['progress-line']}
                style={{
                  border: `.5px solid ${index + 1 < currentProgress ? doneColor : todoColor}`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

Progress.propTypes = {
  progressName: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  currentProgress: PropTypes.number.isRequired,
  todoColor: PropTypes.string,
  doneColor: PropTypes.string,
};

Progress.defaultProps = {
  todoColor: '#999',
  doneColor: '#1C879C',
};
