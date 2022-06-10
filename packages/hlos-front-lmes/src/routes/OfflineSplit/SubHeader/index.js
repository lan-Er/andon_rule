/**
 * @Description: 线下拆板
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-23 11:11:08
 * @LastEditors: leying.yan
 */

import React from 'react';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import Icons from 'components/Icons';
import styles from './index.less';

export default ({ data }) => {
  return (
    <div className={styles['sub-header']}>
      <div className={styles.worker}>
        <img src={data.fileUrl ? data.fileUrl : defaultAvatorImg} alt="" />
        <span>{data.workerName}</span>
      </div>
      <div className={styles['icon-parent']}>
        <Icons type="warehouse" size="25" color="#9E9E9E" />
        <span>{data.warehouseName}</span>
      </div>
      <div className={styles['icon-parent']}>
        <Icons type="prodline" size="25" color="#9E9E9E" />
        <span>{data.wmAreaName}</span>
      </div>
    </div>
  );
};
