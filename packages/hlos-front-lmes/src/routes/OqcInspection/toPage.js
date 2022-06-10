/*
 * @Description: 页码跳转
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-10 17:14:52
 */

import React from 'react';
import { NumberField } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import style from './index.less';

export default function ToPage({
  beforeClick,
  nextClick,
  curPage,
  totalPage,
  toNumCheck,
  onChangePage,
}) {
  return (
    <div className={style['to-page']}>
      <div onClick={() => onChangePage('before')}>
        {beforeClick && (
          <Icons style={{cursor: 'pointer'}} type="arrow-left-white" size="22" color="#1C879C" />
        )}
        {!beforeClick && (
          <Icons style={{cursor: 'not-allowed'}} type="arrow-left-white" size="22" color="rgba(28, 135, 156, 0.2)" />
        )}
      </div>
      <div className={style.page}>
        <span>
          {/* <input
            value={curPage}
            type="text"
            onChange={(e) => toNumCheck(e.target.value)}
          /> */}
          <NumberField
            value={curPage}
            onChange={toNumCheck}
          />
        </span>
        <span>/</span>
        <span>{ totalPage }</span>
      </div>
      <div onClick={() => onChangePage('next')}>
        {nextClick && (
          <Icons style={{cursor: 'pointer'}} type="arrow-right-white" size="22" color="#1C879C" />
        )}
        {!nextClick && (
          <Icons style={{cursor: 'not-allowed'}} type="arrow-right-white" size="22" color="rgba(28, 135, 156, 0.2)" />
        )}
      </div>
    </div>
  );
}
