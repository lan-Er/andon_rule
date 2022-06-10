/**
 * @Description: 生产入库执行--ListItem
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-05 14:57:08
 * @LastEditors: yu.na
 */

import React, { useMemo, useEffect } from 'react';
import { Lov, NumberField, Tooltip, DataSet } from 'choerodon-ui/pro';
// import { Checkbox } from 'choerodon-ui';
import { LineDS } from '@/stores/productionWarehousingExecutionDS';
import LotImg from 'hlos-front/lib/assets/icons/rec-lot.svg';
import TagImg from 'hlos-front/lib/assets/icons/rec-tag.svg';
import QtyImg from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import styles from './index.less';

export default ({
  record = {},
  headerData = {},
  disabled,
  onIconClick,
  onNumChange,
  onWarehouseChange,
  onWmAreaChange,
}) => {
  const lineDS = useMemo(() => new DataSet(LineDS()), []);

  useEffect(() => {
    if (headerData.organizationId) {
      lineDS.current.set('organizationId', headerData.organizationId);
    }
    if (record.toWarehouseId) {
      lineDS.current.set('warehouseObj', {
        warehouseName: record.toWarehouseName,
        warehouseCode: record.toWarehouseCode,
        warehouseId: record.toWarehouseId,
      });
    } else if (headerData.headerWarehouseId) {
      lineDS.current.set('warehouseObj', {
        warehouseName: headerData.headerWarehouseName,
        warehouseCode: headerData.headerWarehouseCode,
        warehouseId: headerData.headerWarehouseId,
      });
    }
    if (record.toWmAreaId) {
      lineDS.current.set('wmAreaObj', {
        wmAreaName: record.toWmAreaName,
        wmAreaCode: record.toWmAreaCode,
        wmAreaId: record.toWmAreaId,
      });
    } else if (headerData.headerWmAreaId) {
      lineDS.current.set('wmAreaObj', {
        wmAreaName: headerData.headerWmAreaName,
        wmAreaCode: headerData.headerWmAreaCode,
        wmAreaId: headerData.headerWmAreaId,
      });
    }
  }, [headerData]);

  const iconRender = () => {
    if (record.itemControlType === 'LOT') {
      return LotImg;
    } else if (record.itemControlType === 'TAG') {
      return TagImg;
    }
    return QtyImg;
  };

  function handleIconClick() {
    if (record.itemControlType === 'QUANTITY') return;
    onIconClick(record);
  }

  return (
    <div className={styles['list-item']}>
      <div className={styles['item-check']}>
        {/* <Checkbox onChange={(e) => onItemCheck(record, e)} /> */}
        <img src={iconRender()} alt="" onClick={handleIconClick} />
        {record.itemControlType === 'QUANTITY' ? (
          <NumberField
            value={record.receiveQty}
            onChange={(val) => onNumChange(val, record)}
            disabled={disabled}
          />
        ) : (
          <div className={styles.block}>{record.receiveQty}</div>
        )}
        <span className={styles.qty}>{record.applyQty || 0}</span>
        <span className={styles.uom}>{record.uomName}</span>
      </div>
      <div className={styles['item-item']}>
        <div>
          <Tooltip title={record.itemDescription} placement="top">
            {record.itemDescription}
          </Tooltip>
        </div>
        <div>
          <Tooltip title={record.itemCode}>{record.itemCode}</Tooltip>
        </div>
      </div>
      <div className={styles['select-area']}>
        <div className={styles['select-warpper']}>
          <Lov
            dataSet={lineDS}
            name="warehouseObj"
            onChange={(obj) => onWarehouseChange(obj, record)}
          />
        </div>
        <div className={styles['select-warpper']}>
          <Lov dataSet={lineDS} name="wmAreaObj" onChange={(obj) => onWmAreaChange(obj, record)} />
        </div>
      </div>
    </div>
  );
};
