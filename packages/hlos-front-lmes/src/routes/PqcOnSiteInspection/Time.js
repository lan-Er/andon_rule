/*
 * 时间组件
 * date: 2020-07-10
 * author : zhengtao <TAO.ZHENG@HAND-CHINA.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import React, { useState, useEffect } from 'react';

/**
 * @name: 时间格式化
 * @param {type}
 * @return:
 */
const dateFormat = (fmt, date) => {
  let ret;
  let tmpFmt = fmt;
  const opt = {
    'Y+': date.getFullYear().toString(),
    'm+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'H+': date.getHours().toString(),
    'M+': date.getMinutes().toString(),
    'S+': date.getSeconds().toString(),
  };
  for (const k in opt) {
    if (Reflect.ownKeys(opt, k)) {
      ret = new RegExp(`(${k})`).exec(tmpFmt);
      if (ret) {
        tmpFmt = tmpFmt.replace(
          ret[1],
          ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
        );
      }
    }
  }
  return tmpFmt;
};

export default () => {
  const [time, setTime] = useState(dateFormat('YYYY-mm-dd HH:MM:SS', new Date()));
  useEffect(() => {
    let timer = null;
    timer = setInterval(() => {
      setTime(dateFormat('YYYY-mm-dd HH:MM:SS', new Date()));
    }, 1000);
    return () => clearInterval(timer);
  });
  return <span>{time}</span>;
};
