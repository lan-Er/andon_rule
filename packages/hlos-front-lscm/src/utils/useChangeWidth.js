/*
 * @module-: 动态改变屏幕宽度改变查询条件个数
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-09-27 16:01:17
 * @LastEditTime: 2020-09-27 16:01:42
 * @copyright: Copyright (c) 2018,Hand
 */
import { useEffect, useState } from 'react';

function useChangeWidth() {
  const [showQueryNumber, setShowQueryNumber] = useState(4);
  useEffect(() => {
    handleChangeWidth();
    window.addEventListener('resize', handleChangeWidth);
    return () => {
      window.removeEventListener('resize', handleChangeWidth);
    };
  }, []);

  function handleChangeWidth() {
    const detailWidth = window.innerWidth || document.body.clientWidth;
    if (detailWidth > 1200) {
      setShowQueryNumber(4);
    } else if (detailWidth > 1040) {
      setShowQueryNumber(3);
    } else if (detailWidth > 830) {
      setShowQueryNumber(2);
    } else {
      setShowQueryNumber(1);
    }
  }
  return showQueryNumber;
}
export default useChangeWidth;
