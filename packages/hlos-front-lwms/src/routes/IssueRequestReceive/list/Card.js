/**
 * @Description: 领料执行--Card
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-10 14:05:15
 * @LastEditors: yu.na
 */

import React from 'react';
import moment from 'moment';
import { Checkbox } from 'choerodon-ui';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import OrderImg from 'hlos-front/lib/assets/icons/order.svg';
import DepartmentImg from 'hlos-front/lib/assets/icons/department.svg';
import ClockImg from 'hlos-front/lib/assets/icons/clock-gray.svg';

export default (props) => {
  const {
    issueRequest,
    issueRequest: {
      requestNum,
      moNum,
      executedWorker,
      planDemandDate,
      requestTypeName,
      prodLineName,
    },
    onDetail,
    onItemReceive,
    onItemSelect,
  } = props;
  return (
    <div className="lwms-issue-request-receive-card">
      <Checkbox
        checked={issueRequest.checked || false}
        onChange={(e) => onItemSelect(issueRequest, e)}
      />
      <a onClick={() => onDetail(issueRequest)}>
        <div className="lwms-issue-request-receive-card-content">
          <p className="request-num">
            {requestNum}
            <span>{requestTypeName}</span>
          </p>
          <p>
            <img src={OrderImg} alt="" />
            {moNum}
          </p>
          <p>
            <img src={ClockImg} alt="" />
            {moment(planDemandDate).format(DEFAULT_DATE_FORMAT)}
          </p>
          <p>
            <img src={DepartmentImg} alt="" />
            {prodLineName}
          </p>
        </div>
        <div className="lwms-issue-request-receive-card-foot">
          <p>
            <span className="circle">{executedWorker && executedWorker.slice(0, 1)}</span>
            {executedWorker}
          </p>
          <p className="receive-btn" onClick={onItemReceive}>
            接收
          </p>
        </div>
      </a>
    </div>
  );
};
