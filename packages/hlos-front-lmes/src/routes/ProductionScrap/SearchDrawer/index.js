/**
 * @Description: 生产报废 - 搜索条件弹窗
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-07-12 09:53:08
 * @LastEditors: Please set LastEditors
 */

import React, { useState } from 'react';
import { Lov } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import styles from './index.less';

const SearchDrawer = ({
  queryDS,
  showOperationFlag,
  operationList,
}) => {

  const [currentOperation, setCurrentOperation] = useState({});

  function handleOperationClick(rec) {
    setCurrentOperation(rec);
    queryDS.current.set('operationObj', rec);
  }

  return (
    <div className={styles['modal-body']}>
      {(showOperationFlag && operationList.length )? (
        <div className={styles.operation}>
          <div className={styles['group-title']}>工序</div>
          {operationList.map(i => {
            return (
              <div
                key={i.operationId}
                className={`${styles['operation-item']} ${currentOperation.operationId === i.operationId && styles.active}`}
                onClick={() => handleOperationClick(i)}
              >
                {i.operationName}
              </div>
            );
          })}
        </div>
      ):null}
      <div>
        <div className={styles['group-title']}>仓库</div>
        <Lov dataSet={queryDS} name="warehouseObj" />
      </div>
      <div>
        <div className={styles['group-title']}>货位</div>
        <Lov dataSet={queryDS} name="wmAreaObj" />
      </div>
    </div>
  );
};

export default formatterCollections({ code: ['lmes.productionScrap', 'lmes.common'] })(SearchDrawer);