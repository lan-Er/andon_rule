/*
 * @Description: 转移单执行界面行组件
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-02-01 10:52:38
 */

import React from 'react';
import { NumberField, Tooltip } from 'choerodon-ui/pro';
import { Progress } from 'choerodon-ui';

import quantityIcon from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import lotIcon from 'hlos-front/lib/assets/icons/rec-lot.svg';
import tagIcon from 'hlos-front/lib/assets/icons/rec-tag.svg';

import styles from '../style.less';

export default function TableLine(props) {
  let iconPath = tagIcon;
  let percent = 0;
  switch (props.itemControlType) {
    case 'QUANTITY':
      iconPath = quantityIcon;
      break;
    case 'LOT':
      iconPath = lotIcon;
      break;
    case 'TAG':
      iconPath = tagIcon;
      break;
    default:
      break;
  }
  if (props.processOkQty >= props.taskQty) {
    percent = 100;
  } else {
    percent = ((props.processOkQty || 0) / props.taskQty) * 100;
  }

  function handleDetailsModal() {
    props.handleDetailsModal();
  }

  return (
    <div className={styles.lines} onClick={handleDetailsModal}>
      <div className={styles.logo}>
        <img src={iconPath} alt="tagIcon" />
      </div>
      <div className={styles.item}>
        <span className={styles['item-code']}>
          <Tooltip title={props.itemCode}>{props.itemCode}</Tooltip>
        </span>
        <span className={styles['item-name']}>
          <Tooltip title={props.itemDescription}>{props.itemDescription}</Tooltip>
          {props.itemControlType === 'QUANTITY' && <span>现有量: {props.onhandQty}</span>}
        </span>
      </div>
      <div className={styles['custom-counter']}>
        {props.itemControlType === 'QUANTITY' && (
          <span
            className={styles['counter-button']}
            onClick={() => props.handleUpdateCount('minus')}
          >
            -
          </span>
        )}
        <NumberField
          className={styles['counter-content']}
          min={0}
          max={
            props.itemControlType === 'QUANTITY' && props.supplyType === 'PUSH'
              ? props.onhandQty
              : null
          }
          step={0.000001}
          value={props.supplyType === 'PULL' ? props.taskQty : props.issuedOkQty || 0}
          onChange={props.handleInput}
          disabled={props.itemControlType !== 'QUANTITY' || props.supplyType === 'PULL'}
        />
        {props.itemControlType === 'QUANTITY' && (
          <span className={styles['counter-button']} onClick={() => props.handleUpdateCount('add')}>
            +
          </span>
        )}
      </div>
      <div className={styles['status-time']}>
        <Progress strokeColor="#22AF72" showInfo={false} percent={percent} />
        <span>
          已投料：{props.processOkQty || 0} / {props.taskQty} {props.uomName}
        </span>
      </div>
    </div>
  );
}
