/*
 * @module: 防抖减少触发次数
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-04 10:50:16
 * @LastEditTime: 2021-04-04 11:30:34
 * @copyright: Copyright (c) 2020,Hand
 */
export default function debounce(fn, ms = 500) {
  let timeoutId = null;
  return function callBack() {
    const self = this;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    timeoutId = setTimeout(() => {
      fn.apply(self);
      timeoutId = null;
    }, ms);
  };
}
