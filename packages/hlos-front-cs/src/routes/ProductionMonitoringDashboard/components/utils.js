/*
 * @Description: 生产监控看板 utils
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-09 13:57:28
 * @LastEditors: Please set LastEditors
 */

export const debounce = (fun, timeout = 300) => {
  let timeId;
  return () => {
    if (timeId) clearTimeout(timeId);
    timeId = setTimeout(() => {
      fun();
      timeId = null;
    }, timeout);
  };
};

export const throttle = (fun) => {
  let onProcessing = false;
  return (e) => {
    const {
      target,
      target: { scrollTop },
    } = e;
    if (onProcessing === false) {
      onProcessing = true;
      window.requestAnimationFrame(() => {
        // console.log('scrollTop: ', scrollTop);
        fun(target, scrollTop);
        onProcessing = false;
      });
    }
  };
};
