import React from 'react';
import { Tooltip } from 'choerodon-ui';
import deleteIcon from 'hlos-front/lib/assets/icons/delete.svg';
import styles from './index.less';

export default ({ data, packFlag, onDeleteOutTagItem }) => {
  return (
    <div className={styles['list-item']}>
      <div className={`${packFlag ? styles['list-item-pack-left'] : null}`}>
        <div className={styles['list-item-top']}>
          <div>
            <p className={styles['sn-num']}>{data.tagCode}</p>
            <div className={`${styles.status} ${styles[data.wipStatus]}`}>
              {packFlag
                ? data?.wip?.wipStatusMeaning || data?.wip?.wipStatus || '未上线'
                : data.wipStatusMeaning || data.wipStatus || '未上线'}
            </div>
            {packFlag && <p style={{ marginLeft: 16 }}>{data.executeQty}</p>}
          </div>
          <p>{data.moveInTime}</p>
        </div>
        <div className={styles['list-item-bottom']}>
          <div>
            <Tooltip title={data.moNum}>
              <p>{data.moNum}</p>
            </Tooltip>
            <Tooltip title={`${data.itemCode || ''} ${data.itemDescription || ''}`}>
              <p>
                {data.itemCode} {data.itemDescription}
              </p>
            </Tooltip>
          </div>
          <Tooltip title={data.taskNum}>
            <p className={styles.task}>{data.taskNum}</p>
          </Tooltip>
        </div>
      </div>
      {packFlag && (
        <div onClick={() => onDeleteOutTagItem(data)}>
          <img src={deleteIcon} alt="" />
        </div>
      )}
    </div>
  );
};
