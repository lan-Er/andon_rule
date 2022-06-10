/*
 * @module: 防抖
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-01-25 17:30:27
 * @LastEditTime: 2021-01-25 17:36:03
 * @copyright: Copyright (c) 2020,Hand
 */
let debounceTimer = null;
export default function debounce(fn, wait = 200) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fn();
  }, wait);
}
