import React from 'react';
// import { isEmpty } from 'lodash';
import { Checkbox } from 'choerodon-ui';
import LotImg from 'hlos-front/lib/assets/icons/rec-lot.svg';
import TagImg from 'hlos-front/lib/assets/icons/rec-tag.svg';
import QtyImg from 'hlos-front/lib/assets/icons/rec-quantity.svg';
import styles from './index.less';

export default ({ onShowModal, data = {}, onItemCheck }) => {
  const iconRender = () => {
    if (data.itemControlType === 'LOT') {
      return LotImg;
    } else if (data.itemControlType === 'TAG') {
      return TagImg;
    }
    return QtyImg;
  };

  return (
    <div className={styles['list-item']}>
      <div className={styles['item-check']}>
        <Checkbox checked={data.checked} onChange={(e) => onItemCheck(data, e)} />
        <img
          src={iconRender()}
          alt=""
          onClick={() => onShowModal(data.itemControlType, false, data)}
        />
        <span className={styles.qty}>{data.returnedQty}</span>
        <span className={styles.uom}>{data.uomName || data.uom}</span>
      </div>
      <div>
        <p>{data.description}</p>
        <p>{data.itemCode}</p>
      </div>
      <div>
        <p>
          {data.returnWarehouseName}-{data.returnWmAreaName}
        </p>
        <p>{data.poNum}</p>
      </div>
      <div>{data.returnReason}</div>
    </div>
  );
};
