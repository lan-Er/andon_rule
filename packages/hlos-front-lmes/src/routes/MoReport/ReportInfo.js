/**
 * @Description: 任务报工--content-left
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
// import { Progress } from 'choerodon-ui/pro';
import { Row, Col } from 'choerodon-ui';
import TimeImg from 'hlos-front/lib/assets/icons/date.svg';
import SupplierImg from 'hlos-front/lib/assets/icons/supplier-card.svg';
import OrderImg from 'hlos-front/lib/assets/icons/odd-number.svg';

export default (props) => {
  const { moInfo = {} } = props;
  const { moExecute = [] } = moInfo;

  return (
    <div className="report-info">
      <div className="info-header">
        <span className="num">{moInfo.moNum}</span>
        <span className="type">({moInfo.moTypeName})</span>
        <span className="status">
          <span>{moInfo.moStatusMeaning}</span>
        </span>
      </div>
      <div className="info-content">
        <div className="content-top">
          <p className="item">{moInfo.itemCode}</p>
          <p className="item">{moInfo.itemDescription}</p>
          <p>
            <img src={TimeImg} alt="" />
            计划时间：{moInfo.planStartDate} ~ {moInfo.planEndDate}
          </p>
          <p>
            <img src={SupplierImg} alt="" />
            {moInfo.customerName}
          </p>
          <p>
            <img src={OrderImg} alt="" />
            项目号：{moInfo.projectNum}
          </p>
          <p>
            <img src={OrderImg} alt="" />
            WBS号：{moInfo.wbsNum}
          </p>
        </div>
        <div className="content-bottom">
          <p>投料进度</p>
          {/* <Progress value={} /> */}
          <div>
            <Row className="progress">
              <Col span={Math.floor(((moExecute.inputQty || 0) * 24) / (moInfo.demandQty || 0))} />
            </Row>
            <p>已完成：{((moExecute.inputQty || 0) * 100) / (moInfo.demandQty || 0)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
