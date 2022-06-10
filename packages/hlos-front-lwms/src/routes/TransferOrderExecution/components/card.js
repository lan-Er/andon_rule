/*
 * @Description: 卡片信息
 * @Author: zmt
 * @LastEditTime: 2021-03-05 09:35:17
 */

import React from 'react';
import { CheckBox } from 'choerodon-ui/pro';

import location from 'hlos-front/lib/assets/icons/location-gray.svg';
import time from 'hlos-front/lib/assets/icons/clock-gray.svg';
import backups from 'hlos-front/lib/assets/icons/order.svg';
import style from '../index.less';

export default function Card(props) {
  return (
    <div className={style.card}>
      <div className={`${style['ds-jc-between']} ${style.top}`}>
        {props.data.requestStatus === 'PICKED' ? (
          <CheckBox checked={props.data.checked} onChange={props.handleSingleCheck} />
        ) : (
          <span style={{ display: 'inline-block', width: '16px' }} />
        )}
        <span className={style['transfer-title']}>{props.data.requestNum}</span>
        <span className={style.type}>转移</span>
      </div>
      <div className={style['card-content']} onClick={props.handleToDetails}>
        <div className={`${style['ds-ai-center']} ${style.quantity}`}>
          <img src={backups} alt="passNumber" />
          <span>{props.data.organizationName}</span>
        </div>
        <div className={`${style['ds-ai-center']} ${style.procedure}`}>
          <img src={location} alt="procedure" />
          {props.data.warehouseName && props.data.toWarehouseName
            ? `${props.data.warehouseName}-${props.data.toWarehouseName}`
            : `${props.data.warehouseName || '' || props.data.toWarehouseName || ''}`}
        </div>
        <div className={`${style['ds-ai-center']} ${style.date}`}>
          <img src={time} alt="time" />
          {props.data.creationDate}
        </div>
      </div>
      <div className={`${style['ds-jc-between']} ${style.bottom}`}>
        <div className={style['transfer-name']}>
          <span>{props.data.creator?.substring(0, 1)}</span>
          <span>{props.data.creator}</span>
        </div>
        <div className={style['request-type']}>{props.data.requestTypeName}</div>
      </div>
    </div>
  );
}
