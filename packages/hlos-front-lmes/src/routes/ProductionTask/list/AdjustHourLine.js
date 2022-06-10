/*
 * @Description: 工时调整行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-08-02 15:59:01
 */

import React from 'react';
import {
  NumberField,
  Tooltip,
} from 'choerodon-ui/pro';

import './style.less';

export default function AdjustHourLine({
  taskNum,
  productCode,
  itemDescription,
  operation,
  processedTime,
  changedHour,
  onModifyHour,
}) {
  return (
    <div className="adjust-hour-line">
      <Tooltip title={taskNum}>{taskNum}</Tooltip>
      <Tooltip title={`${productCode || ''} ${itemDescription || ''}`}>
        {
          `${productCode || ''} ${itemDescription || ''}`
        }
      </Tooltip>
      <Tooltip title={operation}>{operation || ' '}</Tooltip>
      <Tooltip title={`实际工时 ${processedTime || ''} h`}>{`实际工时 ${processedTime || ''} h`}</Tooltip>
      <NumberField value={changedHour || null} placeholder="修改工时" onChange={onModifyHour} />
    </div>
  );
}