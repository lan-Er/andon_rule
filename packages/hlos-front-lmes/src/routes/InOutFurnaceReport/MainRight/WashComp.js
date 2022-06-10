/**
 * @Description: 进出炉报工--MainRight-准备
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { TextField, NumberField } from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import deleteIcon from 'hlos-front/lib/assets/icons/delete.svg';
import styles from './index.less';

export default ({ ds, list = [], onTagChange, onTagQtyChange, onDelTagItem }) => {
  return (
    <div className={styles.washOrInspect}>
      <div className={styles.input}>
        <div>
          <TextField
            dataSet={ds}
            name="tagCode"
            placeholder="请录入标签号"
            suffix={<img src={scanIcon} alt="" />}
            onChange={onTagChange}
          />
        </div>
        <div>
          已录入：<span>{list.length}</span>
        </div>
      </div>
      <div className={styles['list-wrapper']}>
        {list.map((i) => {
          return (
            <div key={uuidv4()} className={styles['list-item']}>
              <div className={styles['list-item-left']}>
                <p>{i.tagCode}</p>
                <p>
                  {i.itemCode}
                  <span>{i.itemDescription}</span>
                </p>
              </div>
              <div className={styles['list-item-right']}>
                <NumberField
                  value={i.executeQty || 0}
                  onChange={(val) => onTagQtyChange(val, i)}
                  min={0}
                />
                <span className={styles.uom}>个</span>
                <img src={deleteIcon} alt="" onClick={() => onDelTagItem(i)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
