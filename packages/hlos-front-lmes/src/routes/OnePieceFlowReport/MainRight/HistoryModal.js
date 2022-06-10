/**
 * @Description: 单件流报工--MainRight-历史投料Modal
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-12-15 18:54:08
 * @LastEditors: yu.na
 */

import React from 'react';
import { Tooltip } from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';
import styles from './index.less';

export default ({ list }) => {
  return (
    <div className={styles.history}>
      {list.map((i) => {
        return (
          <div className={styles['history-item']} key={uuidv4()}>
            <span>
              <Tooltip title={i.itemCode}>{i.itemCode}</Tooltip>
            </span>

            <span>
              <Tooltip title={i.itemDescription}>{i.itemDescription}</Tooltip>
            </span>
            <span>
              <Tooltip title={i.tagCode || i.lotNumber}>{i.tagCode || i.lotNumber}</Tooltip>
            </span>
            <span className={styles.num}>{i.executeQty}</span>
            <span>
              <Tooltip
                title={`${i.prodLine}${i.workcell && `-${i.workcell}`}${
                  i.equipment && `-${i.equipment}`
                }`}
              >
                {i.prodLine}
                {i.workcell && <Tooltip>-{i.workcell}</Tooltip>}
                {i.equipment && <Tooltip>-{i.equipment}</Tooltip>}
              </Tooltip>
            </span>
            <span>{i.worker}</span>
            <span>{i.executeTime}</span>
          </div>
        );
      })}
    </div>
  );
};
