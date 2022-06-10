/*
 * @module:改变宽度改变显示查询条件个数
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-29 13:56:41
 * @LastEditTime: 2020-12-29 13:57:36
 * @copyright: Copyright (c) 2020,Hand
 */
import { useEffect, useState } from 'react';

let timer = null;
export default () => {
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
};
