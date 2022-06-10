/*
 * @Descripttion:日志弹框
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-04 15:04:29
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-04 16:53:38
 */

import React from 'react';
import { Lov, TextField, Icon } from 'choerodon-ui/pro';
import styles from './index.less';

export default ({ dataSet, name, textField = '', disabled = false }) => {
  return (
    <div className={styles['zcom-input-lov']}>
      <TextField dataSet={dataSet} name={textField} key={textField} disabled={disabled} />
      <Lov
        dataSet={dataSet}
        name={name}
        mode="button"
        clearButton={false}
        className={styles['zcom-input-lov-button']}
        disabled={disabled}
      >
        <Icon type="search" width={12} height={12} />
      </Lov>
    </div>
  );
};
