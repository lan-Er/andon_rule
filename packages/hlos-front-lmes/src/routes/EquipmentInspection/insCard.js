/**
 * @Description: 设备点检-卡片信息
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-17 17:22:06
 */

import React from 'react';
import { CheckBox } from 'choerodon-ui/pro';
import './index.less';
import equipment from 'hlos-front/lib/assets/icons/cube.svg';
import time from 'hlos-front/lib/assets/icons/clock-gray.svg';

export default function InsCard(props) {
  return (
    <div className="equipment-ins-card">
      <div className="ins-card-top ds-jc-between">
        <CheckBox
          disabled={props.data.taskStatus === 'COMPLETED'}
          checked={props.data.checked}
          onChange={props.handleSingleCheck}
        />
        <span className="task-number">{props.data.taskNum}</span>
        <span className="prod-line">{props.data.prodLineName}</span>
      </div>
      <div className="ins-card-content" onClick={() => props.handleToDetails()}>
        <div className="equipment ds-ai-center">
          <img src={equipment} alt="equipment" />
          <span>{`${props.data.resourceCode}-${props.data.resourceName}`}</span>
        </div>
        <div className="date ds-ai-center">
          <img src={time} alt="time" />
          <span>{props.data.creationDate}</span>
        </div>
        <div className="status ds-ai-center">
          <span className="task-status">状态:</span>
          <span>{props.data.taskStatusMeaning}</span>
        </div>
      </div>
      <div className="ins-card-bottom ds-jc-between">
        <div className="name" style={props.data.workerName ? {} : { display: 'none' }}>
          <span>{props.data.workerName ? props.data.workerName.slice(0, 1) : null}</span>
          <span>{props.data.workerName}</span>
        </div>
        <div
          className={`${
            props.data.inspectedResultMeaning === '合格' ? 'result-pass' : 'result-no'
          } inspection-result`}
          style={!props.data.inspectedResultMeaning ? { backgroundColor: '#fff' } : {}}
        >
          {props.data.inspectedResultMeaning}
        </div>
      </div>
    </div>
  );
}
