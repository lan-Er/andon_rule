/**
 * @Description: 生产报废 - 明细弹窗
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-07-12 09:53:08
 * @LastEditors: Please set LastEditors
 */

import React from 'react';
import styles from './index.less';

const DetailDrawer = ({
  data: {
    moNum,
    moStatusMeaning,
    moTypeName,
    routingDescription,
    bomDescription,
    uomName,
    moExecuteList = [{}],
  },
}) => {
  return (
    <div className={styles['modal-body']}>
      <div className={styles['mo-info-title']}>
        <div>{moNum}</div>
        <div className={styles.status}>{moStatusMeaning}</div>
      </div>
      <div className={styles['mo-info-other']}>
        <div>
          <div>制单类型</div>
          <div>{moTypeName}</div>
        </div>
        <div>
          <div>工艺路线</div>
          <div>{routingDescription}</div>
        </div>
        <div>
          <div>BOM</div>
          <div>{bomDescription}</div>
        </div>
        <div>
          <div>已完工({uomName})</div>
          <div>{moExecuteList[0].completedQty || 0}</div>
        </div>
        <div>
          <div>已入库({uomName})</div>
          <div>{moExecuteList[0].inventoryQty || 0}</div>
        </div>
        <div>
          <div>已供应({uomName})</div>
          <div>{moExecuteList[0].suppliedQty || 0}</div>
        </div>
        <div>
          <div>报废({uomName})</div>
          <div>{moExecuteList[0].scrappedQty || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;