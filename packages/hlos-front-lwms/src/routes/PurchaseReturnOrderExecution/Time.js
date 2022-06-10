/*
 * @Description: 生产监控看板 - 头部时钟组件
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-09 13:57:28
 * @LastEditors: Please set LastEditors
 */

import React, { useEffect, useState } from 'react';
import styles from './index.less';

let timeId = null;

const formatInstance = new Intl.DateTimeFormat('zh-Hans-CN', {
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

function getFormattedTime(date) {
  return formatInstance.format(date).replace(/\//g, '-');
}

export default function Time(props) {
  const [dateStr, setDateStr] = useState(getFormattedTime(new Date()));
  useEffect(() => {
    timeId = setInterval(() => {
      setDateStr(getFormattedTime(new Date()));
    }, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, []);
  return (
    <span className={styles.time} {...props}>
      {' '}
      {dateStr}
    </span>
  );
}
