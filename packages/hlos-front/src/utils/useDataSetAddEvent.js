/*
 * @Description: dataSet添加事件
 * @Author: 张前领 <qianling.zhang@hand-china.com>
 * @Date: 2021-03-31 16:20:28
 * @LastEditors: Please set LastEditors
 */
import { useEffect } from 'react';

export default function useDataSetAddEvent({
  dataSet,
  dataSet: { events = {} },
  callback,
  eventName,
}) {
  const eventNameCase = eventName.toLowerCase();
  useEffect(() => {
    if (dataSet && events && eventNameCase && callback) {
      events[eventNameCase] = [[(arg) => callback(arg), false]];
    }
  }, [eventNameCase]);
  useEffect(() => {
    return () => {
      delete events[eventNameCase];
    };
  }, []);
}
