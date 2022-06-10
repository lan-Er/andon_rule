/*
 * @Description: 生产监控看板 - 头部时钟组件
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-09 13:57:28
 * @LastEditors: 赵敏捷
 */

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

let timeId = null;

export default function Time(props) {
  const [dateStr, setDateStr] = useState(moment().format(DEFAULT_DATETIME_FORMAT));
  useEffect(() => {
    timeId = setInterval(() => {
      setDateStr(moment().format(DEFAULT_DATETIME_FORMAT));
    }, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, []);
  return <span {...props}> {dateStr}</span>;
}
