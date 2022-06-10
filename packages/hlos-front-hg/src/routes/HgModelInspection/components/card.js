/*
 * @Description: 卡片信息
 * @Author: zmt
 * @LastEditTime: 2020-10-21 14:38:54
 */

import React from 'react';
import { Tooltip } from 'choerodon-ui/pro';

import '../index.less';
import order from '../assets/order.svg';
import model from '../assets/model.svg';
import time from '../assets/time.svg';

export default function Card(props) {
  let bgColor = null;
  switch (props.qcStatus) {
    case 'NEW':
      bgColor = '#ff6b6b';
      break;
    case 'ONGOING':
      bgColor = '#1c879c';
      break;
    default:
      bgColor = '#2d9558';
      break;
  }

  return (
    <div className="hg-model-card">
      <div className="top ds-jc-between">
        <Tooltip title={props.item}>
          <span className="hg-model-title">{props.item}</span>
        </Tooltip>
        <span className="time" style={{ backgroundColor: bgColor }}>
          {props.qcStatusMeaning}
        </span>
      </div>
      <div className="card-content" onClick={props.handleToDetails}>
        <div className="header-info">
          <img src={order} alt="order" />
          <span style={{ flex: 1 }}>{props.inspectionDocNum}</span>
        </div>
        <div className="date ds-ai-center">
          <img src={time} alt="time" />
          <span>{props.createDate}</span>
        </div>
        <div className="model ds-ai-center">
          <img src={model} alt="model" />
          <span>{props.item}</span>
        </div>
      </div>
      <div className="bottom ds-jc-between">
        <div className="name">
          <span>{props.declarer && props.declarer.slice(0, 1)}</span>
          <span>{props.declarer}</span>
        </div>
      </div>
    </div>
  );
}
