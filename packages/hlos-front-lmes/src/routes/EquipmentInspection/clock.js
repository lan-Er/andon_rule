/*
 * @Description: 时钟相关
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-18 11:21:16
 */

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

function getTime() {
  return moment().format(DEFAULT_DATETIME_FORMAT);
}

/**
 * 时钟
 * @param {Object} props
 * */
const Clock = (props) => {
  const [time, setTime] = useState(getTime());
  useEffect(() => {
    const timeId = setInterval(() => {
      setTime(getTime());
    }, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, []);
  return (
    <span style={{ fontSize: '22px', color: '#fff' }} {...props}>
      {time}
    </span>
  );
};

export { Clock, getTime };
