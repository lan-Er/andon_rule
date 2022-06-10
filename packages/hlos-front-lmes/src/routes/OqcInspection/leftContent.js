/* eslint-disable no-nested-ternary */
/*
 * @Description: 执行页左侧区域
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-12 15:32:12
 */

import React from 'react';
import { Tooltip } from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';
import style from './index.less';
import ToPage from './toPage';

export default function LeftContent({
  leftCurPage,
  leftTotalPage,
  leftBeforeClick,
  leftNextClick,
  inspectionList,
  toNumCheck,
  onLineSelected,
  onChangePage,
}) {
  return (
    <div className={style['left-content']}>
      <div>
        {
          inspectionList.map(rec => (
            <div key={uuidv4()} className={rec.checked ? `${style['left-line']} ${style['left-line-active']}` : style['left-line']} onClick={() => onLineSelected(rec)}>
              <span>{rec.sourceDocLineNum}</span>
              <span className={style.item}>
                <Tooltip title={rec.description}>
                  {rec.description}
                </Tooltip>
              </span>
              <span className={rec.qcResultCur === 'PASS' ? `${style['quantity-pass']} ${style.quantity}` : (rec.qcResultCur === 'FAILED' ? `${style['quantity-failed']} ${style.quantity}` : style.quantity)}>{`${rec.batchQty || 0} ${rec.uomName || ''}`}</span>
            </div>
          ))
        }
      </div>
      {
        inspectionList.length ? (
          <ToPage
            curPage={leftCurPage}
            totalPage={leftTotalPage}
            toNumCheck={toNumCheck}
            beforeClick={leftBeforeClick}
            nextClick={leftNextClick}
            onChangePage={onChangePage}
          />
        ) : null
      }
    </div>
  );
}
