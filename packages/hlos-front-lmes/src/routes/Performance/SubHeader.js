/*
 * @Description: 任务报工-员工实绩-二级头
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-11-24 15:51:22
 */

import React from 'react';
import { Lov, TextField, DatePicker } from 'choerodon-ui/pro';

import workerIcon from 'hlos-front/lib/assets/icons/processor.svg';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import itemIcon from 'hlos-front/lib/assets/icons/item.svg';
import timeIcon from 'hlos-front/lib/assets/icons/date.svg';

const SubHeader = (props) => {
  return (
    <div className="performance-sub-header">
      <div className="lov-suffix">
        <img className="left-icon" src={workerIcon} alt="" />
        <Lov
          dataSet={props.headerDS}
          name="workerObj"
          className="space-left"
          placeholder="操作工"
          onChange={props.onQuery}
          noCache
        />
      </div>
      <div className="lov-suffix">
        <img className="right-icon" src={timeIcon} alt="" />
        <DatePicker
          dataSet={props.headerDS}
          name="executeTime"
          className="space-right"
          placeholder="日期"
          onChange={props.onQuery}
          noCache
        />
      </div>
      <div className="lov-suffix">
        <img className="left-icon" src={itemIcon} alt="" />
        <Lov
          dataSet={props.headerDS}
          name="itemObj"
          className="space-left"
          placeholder="物料"
          onChange={props.onQuery}
          noCache
        />
      </div>
      <div className="lov-suffix">
        <img className="right-icon" src={scanIcon} alt="" />
        <TextField
          dataSet={props.headerDS}
          name="moNum"
          className="space-right"
          placeholder="MO"
          onChange={props.onQuery}
          noCache
        />
      </div>
      <div className="lov-suffix">
        <img className="left-icon" src={timeIcon} alt="" />
        <TextField
          dataSet={props.headerDS}
          name="taskNum"
          className="space-left"
          placeholder="任务"
          onChange={props.onQuery}
          noCache
        />
      </div>
    </div>
  );
};

export default SubHeader;
