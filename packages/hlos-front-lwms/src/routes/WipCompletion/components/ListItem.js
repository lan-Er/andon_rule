/**
 * @Description: 完工入库--ListItem
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-08-25 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Checkbox } from 'choerodon-ui';
import LocationIcon from 'hlos-front/lib/assets/icons/location.svg';
import CommonInput from './CommonInput';

export default ({ onNumChange, tabType = 'QUANTITY', data = {}, onCheck }) => {
  function numberColumn() {
    if (tabType === 'QUANTITY') return;
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
        <CommonInput
          step={0.000001}
          value={data.inventoryQty}
          record={data}
          onChange={onNumChange}
        />
        <span className="uom">{data.uomName || data.uom}</span>
      </div>
      {numberColumn()}
      <p>{data.itemCode}</p>
      <p>{data.description}</p>
      {tabType === 'QUANTITY' && (
        <p>
          <img src={LocationIcon} alt="" />
          {data.warehouseName}-{data.wmAreaName}
        </p>
      )}
    </div>
  );
};
