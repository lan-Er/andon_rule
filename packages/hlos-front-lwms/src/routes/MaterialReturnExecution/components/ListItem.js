/**
 * @Description: 退料执行--ListItem
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Tooltip } from 'choerodon-ui/pro';
import { Checkbox } from 'choerodon-ui';
import LocationIcon from 'hlos-front/lib/assets/icons/location.svg';
import CommonInput from './CommonInput';

export default ({ onNumChange, tabType = 'NUMBER', data = {}, onCheck }) => {
  function numberColumn() {
    if (tabType === 'NUMBER') return;
    if (tabType === 'LOT') {
      return <p>{data.lotNumber}</p>;
    } else {
      return <p>{data.tagCode}</p>;
    }
  }

  return (
    <div className="list-item">
      <div className="item-check">
        <Checkbox checked={data.checked || false} onChange={(e) => onCheck(data, e)} />
      </div>
      <div className="item-qty-input">
        {tabType !== 'TAG' ? (
          <CommonInput
            step={0.000001}
            value={data.returnedQty}
            record={data}
            onChange={onNumChange}
          />
        ) : (
          <div>{data.quantity}</div>
        )}
        <span className="uom">{data.uomName || data.uom}</span>
        <Tooltip title={data.initialQty || data.quantity}>
          <span className="onhand">{data.initialQty || data.quantity}</span>
        </Tooltip>
      </div>
      {numberColumn()}
      <Tooltip title={data.itemCode}>
        <p>{data.itemCode}</p>
      </Tooltip>
      <Tooltip title={data.itemDescription}>
        <p>{data.itemDescription}</p>
      </Tooltip>
      {tabType === 'NUMBER' &&
        (data.warehouseName ? (
          <Tooltip
            title={`${data.warehouseName || ''}${data.wmAreaName && '-'}${data.wmAreaName || ''}`}
          >
            <p>
              <img src={LocationIcon} alt="" />
              {data.warehouseName}
              {data.warehouseName && data.wmAreaName && `-${data.wmAreaName}`}
            </p>
          </Tooltip>
        ) : (
          <p>
            <img src={LocationIcon} alt="" />
            {data.warehouseName}
            {data.warehouseName && data.wmAreaName && `-${data.wmAreaName}`}
          </p>
        ))}
    </div>
  );
};
