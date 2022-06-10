/**
 * 时钟
 * @param {Object} props
 * */

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

function getTime() {
  return moment().format(DEFAULT_DATETIME_FORMAT);
}

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
    <span style={{ color: '#fff', fontSize: '21px' }} {...props}>
      {time}
    </span>
  );
};

export { Clock };
