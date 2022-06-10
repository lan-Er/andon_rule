/*
 * @module-: 改变窗口大小动态改变查询条件显示个数
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-09-27 10:47:52
 * @LastEditTime: 2020-09-27 11:49:21
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
