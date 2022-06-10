/*
 * @Description: 样品tab页签内容
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-19 10:58:28
 */

import React from 'react';
import uuidv4 from 'uuid/v4';
import style from '../index.less';
import InspectionLine from './inspectionLine';

export default function InspectionContent({
  inspectionList,
  onQualifiedChange,
  onUnqualifiedChange,
}) {
  return (
    <div className={style['inspection-content']}>
      {inspectionList && inspectionList.length
        ? inspectionList.map((v) => (
          <InspectionLine
            key={uuidv4()}
            {...v}
            onQualifiedChange={(value) => onQualifiedChange(value, v)}
            onUnqualifiedChange={(value) => onUnqualifiedChange(value, v)}
          />
          ))
        : null}
    </div>
  );
}
