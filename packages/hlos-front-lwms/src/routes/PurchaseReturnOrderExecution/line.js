/*
 * @Description: 采购退货单行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-02-01 18:19:01
 */

import React from 'react';
import { NumberField, CheckBox } from 'choerodon-ui/pro';
import { Tooltip } from 'choerodon-ui';

import TagImg from 'hlos-front/lib/assets/icons/rec-tag.svg';
import LotImg from 'hlos-front/lib/assets/icons/rec-lot.svg';
import QuantityImg from 'hlos-front/lib/assets/icons/rec-quantity.svg';

import style from './index.less';

function PurchaseLine(props) {
  const iconImg = () => {
    let img = TagImg;
    if (props.itemControlType === 'TAG') {
      img = TagImg;
    } else if (props.itemControlType === 'LOT') {
      img = LotImg;
    } else if (props.itemControlType === 'QUANTITY') {
      img = QuantityImg;
    }
    return img;
  };

  return (
    <div className={style['purchase-line']}>
      <span>
        <CheckBox checked={props.checked} onChange={props.onLineCheckChange} />
      </span>
      <img src={iconImg()} alt="" onClick={props.onOpen} />
      <div className={style['custom-counter']}>
        {props.itemControlType === 'QUANTITY' && (
          <span
            className={style['counter-button']}
            onClick={() => props.handleUpdateCount('minus')}
          >
            -
          </span>
        )}
        <NumberField
          className={style['counter-content']}
          min={0}
          step={0.01}
          value={props.inputQty || 0}
          onChange={props.handleQuantityInput}
          disabled={props.itemControlType !== 'QUANTITY'}
        />
        {props.itemControlType === 'QUANTITY' && (
          <span className={style['counter-button']} onClick={() => props.handleUpdateCount('add')}>
            +
          </span>
        )}
      </div>
      <div className={style['details-info']}>
        <span>{props.uomName}</span>
        <span />
      </div>
      <div className={style['details-info']}>
        <Tooltip title={props.itemCode || ''}>{props.itemCode || ''}</Tooltip>
        <Tooltip title={props.itemName || ''}>{props.itemName || ''}</Tooltip>
      </div>
      <div className={style['details-info']}>
        <Tooltip title={`${props.returnWarehouseName || ''} - ${props.returnWmAreaName || ''}`}>
          {props.returnWarehouseName || ''}
          {props.returnWmAreaName ? `- ${props.returnWmAreaName}` : ''}
        </Tooltip>
        <Tooltip title={`${props.poNum || ''} - ${props.poLineNum || ''}`}>
          {`${props.poNum || ''} - ${props.poLineNum || ''}`}
        </Tooltip>
      </div>
      <div className={style['details-info']}>
        <Tooltip title={props.returnReason || ''}>{props.returnReason || ''}</Tooltip>
        <Tooltip title={`${props.tagCode || ''} - ${props.lotNumber || ''}`}>
          {props.tagCode || ''}
          {props.lotNumber ? `- ${props.lotNumber}` : ''}
        </Tooltip>
      </div>
    </div>
  );
}

export default PurchaseLine;
