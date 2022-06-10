/*
 * @module: 改变宽度动态变更查询个数
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-14 16:30:06
 * @LastEditTime: 2020-12-14 17:21:34
 * @copyright: Copyright (c) 2020,Hand
 */
import { useEffect, useState } from 'react';

let timer = null;
export default function ChangeWidth() {
  const [initSlice, setInitSlice] = useState(4);
  const debounce = (fn, wait = 50) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn();
    }, wait);
  };
  useEffect(() => {
    handleChange();
    window.addEventListener('resize', handleChange);
    return () => {
      window.removeEventListener('resize', handleChange);
    };
  }, []);
  function handleChange() {
    debounce(handleChangeWidht, 60);
  }

  function handleChangeWidht() {
    const client = window.innerWidth;
    if (client > 1300) {
      setInitSlice(4);
    }
    if (client <= 1300 && client >= 1100) {
      setInitSlice(3);
    } else if (client < 1100 && client > 900) {
      setInitSlice(2);
    } else if (client <= 900) {
      setInitSlice(1);
    }
  }
  return initSlice;
}
