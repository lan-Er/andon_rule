/*
 * @Description: 检验项行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-19 10:52:58
 */

import React from 'react';
import { NumberField, Tooltip } from 'choerodon-ui/pro';
import style from '../index.less';

export default function InspectionLine({
  qcOkQty,
  qcNgQty,
  batchQty,
  inspectionItemName,
  inspectionItemDescription,
  onQualifiedChange,
  onUnqualifiedChange,
}) {
  return (
    <div className={style['inspection-line']}>
      <span className={style.name}>
        <Tooltip title={inspectionItemDescription}>{inspectionItemName}</Tooltip>
      </span>
      <div>
        <span className={`${style['input-qualified']} ${style['total-span']}`}>
          <NumberField value={qcOkQty} min={0} max={batchQty} onChange={onQualifiedChange} />
        </span>
        <span className={`${style['input-unqualified']} ${style['total-span']}`}>
          <NumberField value={qcNgQty} min={0} max={batchQty} onChange={onUnqualifiedChange} />
        </span>
      </div>
    </div>
  );
}
