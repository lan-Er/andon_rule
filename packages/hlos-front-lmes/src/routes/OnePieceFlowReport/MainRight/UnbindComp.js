/**
 * @Description: 单件流报工--MainRight-解绑
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-01-12 11:34:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { TextField, Lov, CheckBox, NumberField } from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';
import Icons from 'components/Icons';
import styles from './index.less';

export default ({ ds, list, onUnbindInputChange, onUnbindItemChange, onUnbindLineChange }) => {
  // T202104211406
  return (
    <div className={styles.unbind}>
      <div className={styles['unbind-input-area']}>
        <div>
          <TextField
            dataSet={ds}
            name="tagCode"
            placeholder="请输入标签"
            suffix={<Icons type="scan" color="#0C6B7E" size="24" />}
            onKeyDown={(e) => onUnbindInputChange(e, 'tagCode')}
          />
        </div>
        <div>
          <TextField
            dataSet={ds}
            name="lotNumber"
            placeholder="请输入批次"
            suffix={<Icons type="scan" color="#0C6B7E" size="24" />}
            onKeyDown={(e) => onUnbindInputChange(e, 'lotNumber')}
          />
        </div>
        <div>
          <Lov dataSet={ds} name="itemObj" placeholder="请选择物料" onChange={onUnbindItemChange} />
        </div>
      </div>
      <div className={styles['unbind-list']}>
        {list.map((i, idx) => {
          return (
            <div key={uuidv4()} className={styles['unbind-list-item']}>
              <div className={styles['unbind-list-item-top']}>
                <div>
                  <CheckBox
                    checked={i.checked}
                    onChange={(val) => onUnbindLineChange(val, idx, 'checked')}
                  />
                  <div className={styles.code}>{i.itemCode}</div>
                  <div className={styles.operation}>{i.operation}</div>
                </div>
                <div className={styles.qty}>
                  {!i.tagId ? (
                    <NumberField
                      value={i.returnedOkQty}
                      onChange={(val) => onUnbindLineChange(val, idx, 'returnedOkQty')}
                    />
                  ) : (
                    i.executeQty
                  )}
                </div>
              </div>
              <div className={styles['unbind-list-item-bottom']}>
                <div>{i.itemDescription}</div>
                <div>{i.tagCode}</div>
                <div>{i.lotNumber}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
