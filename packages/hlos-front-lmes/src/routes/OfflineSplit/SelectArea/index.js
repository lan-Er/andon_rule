/**
 * @Description: 线下拆板
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-23 11:11:08
 * @LastEditors: leying.yan
 */

import React from 'react';
import { Lov, TextField } from 'choerodon-ui/pro';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import orgIcon from 'hlos-front/lib/assets/icons/org.svg';
import styles from './index.less';

export default ({ ds, snData, onSnChange, onBomChange }) => {
  return (
    <div className={styles['select-area']}>
      <div className={`${styles['select-area-left']}`}>
        <TextField
          dataSet={ds}
          name="snCode"
          placeholder="请扫描或输入SN号"
          suffix={<img src={scanIcon} alt="" />}
          onKeyDown={(e) => onSnChange(e)}
        />
        <div className={styles['left-content']}>
          <div className={styles.top}>{snData.itemCode}</div>
          <div className={styles.bottom}>{snData.itemDescription}</div>
        </div>
      </div>
      <div className={styles['select-area-right']}>
        <Lov
          dataSet={ds}
          noCache
          name="bomObj"
          disabled={!ds.current.get('snCode')}
          placeholder="选择bom"
          prefix={<img src={orgIcon} alt="" />}
          onChange={onBomChange}
        />
      </div>
    </div>
  );
};
