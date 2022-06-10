/*
 * @module: 时间组件
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-10 17:05:13
 * @LastEditTime: 2021-03-11 16:30:25
 * @copyright: Copyright (c) 2020,Hand
 */
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import styles from './index.less';

let timeId = null;

export default function Time(props) {
  const [dateStr, setDateStr] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  useEffect(() => {
    timeId = setInterval(() => {
      setDateStr(moment().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, []);
  return (
    <span className={styles['my-dashboard-time']} {...props}>
      {dateStr}
    </span>
  );
}
