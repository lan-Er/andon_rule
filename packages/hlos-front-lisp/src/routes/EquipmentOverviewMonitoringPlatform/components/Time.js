/*
 * @Description: 头部时钟组件
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-27 15:34:28
 * @LastEditors: 赵敏捷
 */

import React, { useEffect, useState } from 'react';

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
  return <span {...props}>{dateStr}</span>;
}
