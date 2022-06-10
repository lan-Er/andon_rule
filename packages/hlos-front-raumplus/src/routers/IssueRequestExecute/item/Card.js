/**
 * @Description: 领料执行--Card
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-10 14:05:15
 * @LastEditors: yu.na
 */

import React from 'react';
import { CheckBox, Button } from 'choerodon-ui/pro';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import OrderImg from 'hlos-front/lib/assets/icons/order.svg';
import DepartmentImg from 'hlos-front/lib/assets/icons/department.svg';
import ClockImg from 'hlos-front/lib/assets/icons/clock.svg';
import defaultAvator from 'hlos-front/lib/assets/img-default-avator.png';

export default (props) => {
  const { item = {}, active } = props;
  return (
    <div className="lwms-issue-request-execute-card">
      <div className="lwms-issue-request-execute-card-head">
        <CheckBox checked={item.checked} onChange={props.handleSingleCheck} />
        <p>{item.requestNum}</p>
        <Button color="primary" onClick={() => props.onToPickPage(item)}>
          {active === 'RELEASED' ? '拣料' : '发料'}
        </Button>
      </div>
      <div
        className="lwms-issue-request-execute-card-content"
        onClick={() => props.onToPickPage(item)}
      >
        <p>
          <img src={OrderImg} alt="" />
          {item.moNum}
        </p>
        <p>
          <img src={DepartmentImg} alt="" />
          {item.prodLineName}
        </p>
        <p>
          <img src={ClockImg} alt="" />
          {moment(item.planDemandDate).format(DEFAULT_DATE_FORMAT)}
        </p>
      </div>
      {active !== 'PICKED' && (
        <div className="lwms-issue-request-execute-card-foot">
          <p>
            <span className="circle">
              <img src={item.imageUrl || defaultAvator} alt="" />
            </span>
            {item.creator}
          </p>
          <p className="right">{item.requestTypeName}</p>
        </div>
      )}
    </div>
  );
};
