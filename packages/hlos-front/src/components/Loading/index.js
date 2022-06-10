/**
 * @Description:
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-01-28 19:28:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Progress } from 'choerodon-ui';
import styles from './index.less';

export default ({ title, size = 'large' }) => {
  return (
    <div className={styles.mask}>
      <Progress type="loading" size={size} />
      <p>{title}</p>
    </div>
  );
};
