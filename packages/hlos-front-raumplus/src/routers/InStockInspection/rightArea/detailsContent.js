/*
 * @Description: 明细tab页签内容
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-26 15:30:09
 */

import React from 'react';
import uuidv4 from 'uuid/v4';
import DetailsLine from './detailsLine.js';
import style from '../index.less';

export default function DetailsContent({
  itemControlType,
  defaultList,
  detailsList,
  onDetailsQualifiedQty,
  onDetailsUnqualifiedQty,
  onSwitchJudge,
  onActiveMode,
  onDetailsRemark,
}) {
  return (
    <div className={style['details-content']}>
      {detailsList && detailsList.length
        ? detailsList.map((v) => (
          <DetailsLine
            key={uuidv4()}
            {...v}
            itemControlType={itemControlType}
            defaultList={defaultList}
            detailsList={detailsList}
            onDetailsQualifiedQty={(value) => onDetailsQualifiedQty(value, v)}
            onDetailsUnqualifiedQty={(value) => onDetailsUnqualifiedQty(value, v)}
            onSwitchJudge={() => onSwitchJudge(v)}
            onActiveMode={(resultRec) => onActiveMode(resultRec, v)}
            onDetailsRemark={() => onDetailsRemark(v)}
          />
          ))
        : null}
    </div>
  );
}
