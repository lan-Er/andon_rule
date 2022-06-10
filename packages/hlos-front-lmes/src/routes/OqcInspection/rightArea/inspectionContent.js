/*
 * @Description: 检验项tab页签内容
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-13 22:22:14
 */

import React from 'react';
import uuidv4 from 'uuid/v4';
import style from '../index.less';
import InspectionLine from './inspectionLine';
import ToPage from '../toPage';

export default function InspectionContent({
  data,
  onQualifiedChange,
  onUnqualifiedChange,
  onSwitchChange,
  toNumCheck,
  onChangePage,
}) {
  return (
    <div className={style['inspection-content']}>
      <div className={style['inspection-list']}>
        {data.lineList && data.lineList.length
          ? data.lineList
              .slice(5 * (data.curLinePage - 1), 5 * data.curLinePage)
              .map((v) => (
                <InspectionLine
                  key={uuidv4()}
                  {...v}
                  batchQty={data.batchQty}
                  judged={data.judged}
                  onQualifiedChange={(value) => onQualifiedChange(value, data.inspectionDocId, v)}
                  onUnqualifiedChange={(value) =>
                    onUnqualifiedChange(value, data.inspectionDocId, v)
                  }
                  onSwitchChange={(value) => onSwitchChange(value, data.inspectionDocId, v)}
                />
              ))
          : null}
      </div>
      <ToPage
        curPage={data.curLinePage}
        totalPage={data.totalLinePage}
        beforeClick={data.beforeLineClick}
        nextClick={data.nextLineClick}
        onChangePage={onChangePage}
        toNumCheck={(value) => toNumCheck(value, data)}
      />
    </div>
  );
}
