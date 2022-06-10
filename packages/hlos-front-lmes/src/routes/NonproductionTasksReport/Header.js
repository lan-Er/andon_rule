/**
 * @Description: 非生产任务报工
 * @Author: liYuan.liu<liu.liyuan@hand-china.com>
 * @Date: 2020-12-24
 * @LastEditors: liYuan.liu
 */

import React from 'react';
import moment from 'moment';
import { Output, TextField } from 'choerodon-ui/pro';

import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import workerGroupIcon from 'hlos-front/lib/assets/icons/worker-group.svg';
import classessIcon from 'hlos-front/lib/assets/icons/classess-gray.svg';
import ScanImg from 'hlos-front/lib/assets/icons/scan.svg';

import styles from './style.less';

export default (props) => {
  const { queryDS, handleSubQuery } = props;
  const { workerName, fileUrl, workerGroupName } = queryDS && queryDS.toData()[0];
  return (
    <div className={styles['sub-header']}>
      <div>
        <div className={styles.worker}>
          <img src={fileUrl} alt="" />
          <span>{workerName}</span>
        </div>
        <div>
          <img src={workerGroupIcon} alt="" />
          <span>{workerGroupName}</span>
        </div>
        <div>
          <img src={classessIcon} alt="" />
          <span>
            {moment(props.date).format(DEFAULT_DATE_FORMAT)}{' '}
            <span style={{ marginLeft: 16 }}>
              <Output dataSet={queryDS} name="calendarShiftCode" />
            </span>
          </span>
        </div>
      </div>
      <div className={styles['task-report-sub-header']}>
        <div className={styles['lov-suffix']}>
          <img className={styles['lock-icon']} src={ScanImg} alt="" />
          <TextField
            className={[`${styles['sub-input']} ${styles['sub-scan']}`]}
            placeholder="请扫描或输入任务号"
            onEnterDown={(event) => handleSubQuery(event)}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};
