import React from 'react';
import { Lov, Button } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import styles from './index.less';

const preCode = 'lwms.productionWarehousingExecution.model';

export default ({ queryDS, headerDS, onSearch, onReset }) => {
  return (
    <div className={styles['input-area']}>
      <div>
        <div>
          <Lov dataSet={queryDS} name="moObj" />
          <Lov
            dataSet={queryDS}
            name="requestObj"
            placeholder={intl.get(`${preCode}.inventoryRequest`).d('入库单号')}
          />
          <Lov
            dataSet={queryDS}
            name="prodLineObj"
            placeholder={intl.get(`${preCode}.completeProdLine`).d('完工产线')}
          />
          <Lov
            dataSet={queryDS}
            name="warehouseObj"
            placeholder={intl.get(`${preCode}.completeWarehouse`).d('完工仓库')}
          />
        </div>
        <div className={styles.btns}>
          <Button onClick={onReset}>{intl.get(`hzero.common.button.reset`).d('重置')}</Button>
          <Button color="primary" onClick={() => onSearch(0, true)}>
            {intl.get(`hzero.common.button.search`).d('查询')}
          </Button>
        </div>
      </div>
      <div>
        <div>
          <Lov
            dataSet={headerDS}
            name="workerObj"
            placeholder={intl.get(`${preCode}.executeWorker`).d('执行员工')}
          />
          <Lov
            dataSet={headerDS}
            name="warehouseObj"
            placeholder={intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库')}
          />
          <Lov
            dataSet={headerDS}
            name="wmAreaObj"
            placeholder={intl.get(`${preCode}.inventoryWmArea`).d('入库货位')}
          />
        </div>
      </div>
    </div>
  );
};
