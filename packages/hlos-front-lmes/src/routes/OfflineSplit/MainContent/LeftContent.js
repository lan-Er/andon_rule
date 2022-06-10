/**
 * @Description: 线下拆板
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-23 14:04:08
 * @LastEditors: leying.yan
 */

import React from 'react';
import { NumberField, TextField } from 'choerodon-ui/pro';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import styles from './index.less';

export default ({
  splitQuantity,
  completedQuantity,
  paneIndex,
  componentItemCode,
  componentItemDescription,
  onQtyChange,
  onChildSnChange,
  onChildSnInput,
  bomUsage,
  fileUrl,
  quantity = 1,
  currentSnCode,
}) => {
  return (
    <div className={styles['mo-info']}>
      <div className={styles['select-info']}>
        <NumberField
          placeholder="数量"
          value={quantity}
          width="64px"
          onChange={(e) => onQtyChange(e, paneIndex)}
        />
        <TextField
          value={currentSnCode}
          placeholder="请扫描或录入子件SN号"
          suffix={<img src={scanIcon} alt="" />}
          onChange={onChildSnInput}
          onKeyDown={(e) => onChildSnChange(e, paneIndex)}
        />
      </div>
      <div className={styles['item-info']}>
        <div>
          <p>{componentItemCode}</p>
          <p>{componentItemDescription}</p>
        </div>
        <div>
          <img src={fileUrl} alt="" />
        </div>
      </div>
      {bomUsage ? (
        <div className={styles['progress-info']}>
          <p className={styles.remark}>完成进度</p>
          <div className={styles['progress-wrapper']}>
            <div className={styles.progress}>
              <div
                style={{ width: `${(completedQuantity * 100) / (bomUsage * splitQuantity)}%` }}
              />
            </div>
            <span>
              {completedQuantity}/{(bomUsage || 0) * (splitQuantity || 0) }
            </span>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
