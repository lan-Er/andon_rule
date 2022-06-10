/**
 * @Description: po预检--左侧
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-04 17:36:08
 * @LastEditors: leying.yan
 */

import React, { useEffect } from 'react';
import { Form, Lov, TextField, NumberField } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import styles from './index.less';

export default ({
  ds,
  bottomData,
  poDisabled,
  lineNumDisabled,
  onPoChange,
  onLineNumChange,
  onBatchQtyChange,
  hasCreated,
}) => {
  useEffect(() => {}, []);

  return (
    <div className={styles['left-content']}>
      <Form
        dataSet={ds}
        className={styles['content-form']}
        columns={2}
        labelWidth={[100, 0, 100, 100]}
      >
        <Lov
          name="poObj"
          noCache
          placeholder="请输入"
          disabled={poDisabled || hasCreated}
          label="PO"
          onChange={(value) => onPoChange(value)}
        />
        <Lov
          name="lineNumObj"
          noCache
          placeholder="请输入行号"
          disabled={lineNumDisabled || hasCreated}
          onChange={onLineNumChange}
        />
        <NumberField
          colSpan={2}
          name="batchQty"
          placeholder="请输入"
          disabled={hasCreated}
          onChange={(value) => onBatchQtyChange(value)}
        />
        <TextField colSpan={2} name="remark" placeholder="请输入" disabled={hasCreated} />
      </Form>
      {bottomData.itemId ? (
        <div className={styles['bottom-content']}>
          <div className={styles.top}>
            <div className={styles['base-content']}>
              <Icons type="item" size="22" className={styles['base-icon']} />
              {bottomData.itemCode} {bottomData.itemDescription}
            </div>
            <div className={styles['base-content']}>
              <Icons type="number-unselect" size="22" className={styles['base-icon']} />{' '}
              {bottomData.demandQty} {bottomData.uom}
            </div>
          </div>
          <div className={styles.bottom}>
            <Icons type="date" size="22" className={styles['base-icon']} /> {bottomData.demandDate}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
