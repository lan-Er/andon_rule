/*
 * @module: 防抖hooks
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-06-08 15:41:58
 * @LastEditTime: 2021-06-08 15:42:29
 * @copyright: Copyright (c) 2020,Hand
 */
import { useEffect, useState } from 'react';

// 防抖 hooks
function useDebounce(value: any, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
export default useDebounce;
