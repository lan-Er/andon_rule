/**
 * @Description: po预检
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-04 11:11:08
 * @LastEditors: leying.yan
 */

import React from 'react';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import operationIcon from 'hlos-front/lib/assets/icons/operation-gray.svg';
import classessIcon from 'hlos-front/lib/assets/icons/classess-gray.svg';
import styles from './index.less';

export default ({ data }) => {
  return (
    <div className={styles['sub-header']}>
      <div className={styles.worker}>
        <img src={data.fileUrl ? data.fileUrl : defaultAvatorImg} alt="" />
        <span>{data.workerName}</span>
      </div>
      <div>
        <img src={operationIcon} alt="" />
        <span>{data.organizationName}</span>
      </div>
      {data.inspectionDocNum ? (
        <div>
          <img src={classessIcon} alt="" />
          <span>{data.inspectionDocNum}</span>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
