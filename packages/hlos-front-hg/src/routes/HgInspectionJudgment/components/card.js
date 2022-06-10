/*
 * @Description: 恒光检验判定-卡片信息
 * @Author: zmt
 * @LastEditTime: 2020-10-16 14:36:08
 */

import React from 'react';
import { Tooltip } from 'choerodon-ui/pro';

import '../index.less';
import partyName from '../../../assets/InspectionJudgment/party-name.svg';
import time from '../../../assets/InspectionJudgment/time.svg';
import order from '../../../assets/InspectionJudgment/order.svg';
import inspectionDocNum from '../../../assets/InspectionJudgment/inspection-number.svg';
import Operation from '../../../assets/InspectionJudgment/procedure.svg';

export default function Card(props) {
  return (
    <div className="hg-inspection-judgement-card">
      <div className="top ds-jc-between">
        <span className="hg-inspection-judgement-title">
          <Tooltip title={props.item}>{props.item}</Tooltip>
        </span>
        <span className="time">{props.duration}</span>
      </div>
      <div className="card-content" onClick={props.handleToDetails}>
        <div className="header-info ds-ai-center">
          <img src={inspectionDocNum} alt="order" />
          <span>{props.inspectionDocNum}</span>
        </div>
        <div className="source-info ds-jc-between">
          <img style={{ marginLeft: '2px', paddingRight: '8px' }} src={order} alt="order" />
          <span style={{ flex: 1 }}>
            {props.sourceDocNum}-{props.sourceDocLineNum}
          </span>
        </div>
        <div className="source-info ds-jc-between">
          <img style={{ paddingRight: '5px' }} src={time} alt="time" />
          <span style={{ flex: 1 }}>{props.createDate}</span>
        </div>
        <div className="bottom ds-jc-between">
          {props.inspectionTemplateType.indexOf('IQC') !== -1 ? (
            <>
              <img style={{ marginLeft: '2px', paddingRight: '5px' }} src={partyName} alt="time" />
              <span style={{ flex: 1 }}>{props.partyName}</span>
            </>
          ) : null}
          {props.inspectionTemplateType.indexOf('PQC') !== -1 ? (
            <>
              <img style={{ marginLeft: '2px', paddingRight: '5px' }} src={Operation} alt="time" />
              <span style={{ flex: 1 }}>{props.operation}</span>
            </>
          ) : null}
          <div className="quantity ds-ai-center">
            <span>数量: </span>
            <span className="value">{props.batchQty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
