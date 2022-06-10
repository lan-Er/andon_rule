/**
 * @Description: po预检
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-02-04 11:11:08
 * @LastEditors: leying.yan
 */

import React from 'react';
import { Lov } from 'choerodon-ui/pro';
import styles from './index.less';

export default ({ ds, onPartyChange, hasCreated }) => {
  return (
    <div className={styles['select-area']}>
      <div className={`${styles['select-area-left']}`}>
        <Lov
          dataSet={ds}
          name="partyObj"
          placeholder="供应商"
          onChange={onPartyChange}
          disabled={hasCreated}
        />
      </div>
      <div className={styles['select-area-right']}>
        <Lov dataSet={ds} name="inspectionGroupObj" disabled={hasCreated} placeholder="检验组" />
      </div>
    </div>
  );
};
