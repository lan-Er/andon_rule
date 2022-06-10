/*
 * @Description: 检验项行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-10 19:46:04
 */

import React from 'react';
import { NumberField, Tooltip } from 'choerodon-ui/pro';
import style from '../index.less';

export default function InspectionLine({
  qcOkQty,
  qcNgQty,
  batchQty,
  judged,
  inspectionItemName,
  inspectionItemDescription,
  onQualifiedChange,
  onUnqualifiedChange,
  // onSwitchChange,
}) {
  return (
    <div className={style['inspection-line']}>
      <span className={style.name}>
        <Tooltip title={inspectionItemDescription}>
          {inspectionItemName}
        </Tooltip>
      </span>
      <div>
        <span className={`${style['input-qualified']} ${style['total-span']}`}>
          <NumberField
            value={qcOkQty}
            min={0}
            max={batchQty}
            disabled={judged}
            onChange={onQualifiedChange}
          />
        </span>
        <span className={`${style['input-unqualified']} ${style['total-span']}`}>
          <NumberField
            value={qcNgQty}
            min={0}
            max={batchQty}
            disabled={judged}
            onChange={onUnqualifiedChange}
          />
        </span>
      </div>
    </div>
  );
}