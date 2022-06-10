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
import OperationImg from 'hlos-front/lib/assets/icons/org.svg';
import ProdImg from 'hlos-front/lib/assets/icons/prodline.svg';
import ScanImg from 'hlos-front/lib/assets/icons/scan.svg';

import styles from './style.less';

export default (props) => {
  return (
    <div className={styles['task-report-sub-header']}>
      <img src={props.avator} alt="" />
      <div className={styles['lov-suffix']}>
        <img className={styles['left-icon']} src={WorkerImg} alt="" />
        <img
          className={styles['lock-icon']}
          src={props.workerLock ? LockImg : UnlockImg}
          alt=""
          onClick={() => props.onLockChange('worker')}
        />
        <Lov
          dataSet={props.headerDS}
          name="workerObj"
          className={styles['sub-input']}
          placeholder="请选择工号"
          onChange={(record) => props.onQuery('worker', record)}
          disabled={props.workerLock}
          noCache
        />
      </div>
      {props.resourceType && (
        <div className={styles['lov-suffix']}>
          <img className={styles['left-icon']} src={ProdImg} alt="" />
          <img
            className={styles['lock-icon']}
            src={props.prodLineLock ? LockImg : UnlockImg}
            alt=""
            onClick={() => props.onLockChange('prodLine')}
          />
          {props.resourceType === 'prodLine' && (
            <Lov
              dataSet={props.headerDS}
              name="prodLineObj"
              className={styles['sub-input']}
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
              className={styles['sub-input']}
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
              className={styles['sub-input']}
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
              className={styles['sub-input']}
              placeholder="请选择班组"
              onChange={props.onQuery}
              disabled={props.prodLineLock}
              noCache
            />
          )}
        </div>
      )}
      <div className={styles['lov-suffix']}>
        <img className={styles['lock-icon']} src={ScanImg} alt="" />
        <TextField
          dataSet={props.headerDS}
          name="inputNum"
          className={`${styles['sub-input']} ${styles['sub-scan']}`}
          placeholder={`请输入或扫描${props.reportType !== 'MO' ? 'TASK编码' : 'MO编码'}`}
          onChange={props.onQuery}
        />
      </div>
      {props.reportType === 'MO' && (
        <div className={styles['lov-suffix']}>
          <img className={styles['left-icon']} src={OperationImg} alt="" />
          <img
            className={styles['lock-icon']}
            src={props.operationLock ? LockImg : UnlockImg}
            alt=""
            onClick={() => props.onLockChange('operation')}
          />
          <Lov
            name="operationObj"
            dataSet={props.headerDS}
            className={styles['sub-input']}
            placeholder="请选择工序"
            onChange={() => props.onQuery('operation')}
            disabled={props.operationLock}
            noCache
          />
        </div>
      )}
    </div>
  );
};
