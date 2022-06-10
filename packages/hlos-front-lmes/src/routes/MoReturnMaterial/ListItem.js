/**
 * @Description: MO退料--listItem
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-25 15:11:08
 * @LastEditors: yu.na
 */

import React, { useMemo, useEffect } from 'react';
import { Lov, CheckBox, DataSet, NumberField } from 'choerodon-ui/pro';
import { Popover } from 'choerodon-ui';
import Icons from 'components/Icons';
import lotImg from 'hlos-front/lib/assets/icons/rec-lot.svg';
import tagImg from 'hlos-front/lib/assets/icons/rec-tag.svg';
import quantityImg from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import { LineDS } from '@/stores/moReturnMaterialDS';
import styles from './index.less';

const ListItem = ({ data, changeFlag, onLineChange, onItemClick, onQtyChange }) => {
  const lineDS = useMemo(() => new DataSet(LineDS()), []);

  useEffect(() => {
    const {
      warehouseId,
      warehouseCode,
      warehouseName,
      wmAreaId,
      wmAreaCode,
      wmAreaName,
      organizationId,
    } = data;
    if (organizationId) {
      lineDS.current.set('organizationId', organizationId);
    }
    lineDS.current.set('warehouseObj', {
      warehouseId,
      warehouseCode,
      warehouseName,
    });
    lineDS.current.set('wmAreaObj', {
      wmAreaId,
      wmAreaCode,
      wmAreaName,
    });
  }, [changeFlag, data]);

  function imgEle() {
    if (data.itemControlType === 'LOT') {
      return <img src={lotImg} alt="" onClick={() => onItemClick(data)} />;
    } else if (data.itemControlType === 'TAG') {
      return <img src={tagImg} alt="" onClick={() => onItemClick(data)} />;
    }
    return <img src={quantityImg} alt="" />;
  }

  function moreContent() {
    return (
      <div className={styles['lmes-mo-return-material-more-modal']}>
        <Lov
          dataSet={lineDS}
          name="wmAreaObj"
          onChange={(rec) => onLineChange(rec, data, 'wmArea')}
        />
      </div>
    );
  }

  return (
    <div className={styles['mo-return-material-list-item']}>
      <div className={styles['list-item-left']}>
        <CheckBox checked={data.checked} onChange={(val) => onLineChange(val, data, 'check')} />
        {imgEle()}
        {data.itemControlType === 'QUANTITY' ? (
          <NumberField
            min={0}
            value={data.returnedOkQty || 0}
            onChange={(val) => onQtyChange(val, data)}
          />
        ) : (
          <div className={styles['input-block']}>{data.returnedOkQty || 0}</div>
        )}
        <div className={styles.block}>{data.issuedQty || 0}</div>
        <div className={styles.uom}>{data.uomName}</div>
      </div>
      <div className={styles['list-item-center']}>
        <div>{data.componentDescription}</div>
        <div>{data.componentItemCode}</div>
      </div>
      <div className={styles['list-item-right']}>
        <Lov
          dataSet={lineDS}
          name="warehouseObj"
          onChange={(rec) => onLineChange(rec, data, 'warehouse')}
        />
        <div className={styles.more}>
          <Popover content={moreContent()} trigger="click" placement="topRight">
            <Icons type="more1" size={32} color="#1c879c" />
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
