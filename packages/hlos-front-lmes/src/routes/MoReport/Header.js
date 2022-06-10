/**
 * @Description: 任务报工--Header
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-02 10:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Lov, TextField } from 'choerodon-ui/pro';
import WorkerImg from 'hlos-front/lib/assets/icons/processor.svg';
import LockImg from 'hlos-front/lib/assets/icons/lock.svg';
import UnlockImg from 'hlos-front/lib/assets/icons/un-lock.svg';
import ProdImg from 'hlos-front/lib/assets/icons/prodline.svg';
import ScanImg from 'hlos-front/lib/assets/icons/scan.svg';

export default (props) => {
  return (
    <div className="sub-header">
      <img src={props.avator} alt="" />
      <div className="lov-suffix">
        <img className="left-icon" src={WorkerImg} alt="" />
        <img
          className="lock-icon"
          src={props.workerLock ? LockImg : UnlockImg}
          alt=""
          onClick={() => props.onLockChange('worker')}
        />
        <Lov
          dataSet={props.headerDS}
          name="workerObj"
          className="sub-input"
          placeholder="请选择工号"
          onChange={props.onQuery}
          disabled={props.workerLock}
          noCache
        />
      </div>
      <div className="lov-suffix">
        <img className="left-icon" src={ProdImg} alt="" />
        <img
          className="lock-icon"
          src={props.prodLineLock ? LockImg : UnlockImg}
          alt=""
          onClick={() => props.onLockChange('prodLine')}
        />
        {props.resourceType === 'prodLine' && (
          <Lov
            dataSet={props.headerDS}
            name="prodLineObj"
            className="sub-input"
            placeholder="请选择产线"
            onChange={props.onQuery}
            disabled={props.prodLineLock}
            noCache
          />
        )}
        {props.resourceType === 'workcell' && (
          <Lov
            dataSet={props.headerDS}
            name="workcellObj"
            className="sub-input"
            placeholder="请选择工位"
            onChange={props.onQuery}
            disabled={props.prodLineLock}
            noCache
          />
        )}
        {props.resourceType === 'equipment' && (
          <Lov
            dataSet={props.headerDS}
            name="equipmentObj"
            className="sub-input"
            placeholder="请选择设备"
            onChange={props.onQuery}
            disabled={props.prodLineLock}
            noCache
          />
        )}
        {props.resourceType === 'workerGroup' && (
          <Lov
            dataSet={props.headerDS}
            name="workerGroupObj"
            className="sub-input"
            placeholder="请选择班组"
            onChange={props.onQuery}
            disabled={props.prodLineLock}
            noCache
          />
        )}
      </div>
      <div className="lov-suffix text">
        <img className="lock-icon" src={ScanImg} alt="" />
        <span className="require-icon">*</span>
        <TextField
          dataSet={props.headerDS}
          name="inputNum"
          className="sub-input sub-scan"
          placeholder="请输入或扫描MO编码"
          onChange={props.onQuery}
        />
      </div>
    </div>
  );
};
