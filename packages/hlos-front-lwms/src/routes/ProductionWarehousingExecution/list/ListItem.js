import React from 'react';
import { CheckBox } from 'choerodon-ui/pro';
import Icons from 'components/Icons';
import defaultAvatorImg from 'hlos-front/lib/assets/img-default-avator.png';
import styles from './index.less';

export default ({ record, onToDetail, onItemClick }) => {
  return (
    <div className={styles['list-item']}>
      <div className={styles['item-top']}>
        <div>
          <CheckBox checked={record.checked} onChange={(val) => onItemClick(val, record)} />
        </div>
        <div className={styles['item-top-right']} onClick={() => onToDetail(record)}>
          <div className={styles['item-title']}>
            <div>{record.requestNum}</div>
            <div className={styles['item-status']}>{record.requestStatusMeaning}</div>
          </div>
          <div>
            <Icons type="danju" size="16" color="#999" />
            <span>{record.moNum}</span>
          </div>
          <div>
            <Icons type="wangongcangku" size="16" color="#999" />
            <span>
              {record.warehouseName}
              {record.wmAreaName && <span>-{record.wmAreaName}</span>}
            </span>
          </div>
          <div>
            <Icons type="rukudane" size="16" color="#999" />
            <span>
              {record.toWarehouseName}
              {record.toWmAreaName && <span>-{record.toWmAreaName}</span>}
            </span>
          </div>
          <div>
            <Icons type="shijian" size="16" color="#999" />
            <span>{record.creationDate}</span>
          </div>
        </div>
      </div>
      <div className={styles['item-bottom']}>
        <div>
          <img src={record.imageUrl || defaultAvatorImg} alt="" />
          <span>{record.creator}</span>
        </div>
        <div>{record.requestTypeName}</div>
      </div>
    </div>
  );
};
