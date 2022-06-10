/*
 * @Description: 二级头
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-23 14:06:01
 */

import React from 'react';
import Icons from 'components/Icons';
import styles from './index.less';

export default function SubHeader({
  equipmentCode,
  equipmentName,
  categoryName,
  equipmentStatusMeaning,
  equipmentTypeMeaning,
  description,
  prodLineName,
  workcellName,
  locationName,
  outsideLocation,
  fileUrl,
}) {
  return (
    <div className={styles['equipment-sub-header']}>
      {fileUrl ? (
        <div className={styles['equipment-picture']}>
          <img src={fileUrl} alt="" />
        </div>
      ) : null}
      <div className={styles.content}>
        <div className={styles.top}>
          <span className={styles.title}>{`${equipmentCode} ${equipmentName}`}</span>
          {equipmentStatusMeaning ? (
            <span className={styles.status}>{equipmentStatusMeaning}</span>
          ) : null}
        </div>
        <div className={styles.bottom}>
          <div className={styles['line-info']}>
            <div className={styles.first}>
              <Icons type="more-btn" size="20" color="#CACCD0" />
              <span>分类：{categoryName}</span>
            </div>
            <div className={styles.last}>
              <Icons type="item" size="20" color="#CACCD0" />
              <span>类型：{equipmentTypeMeaning}</span>
            </div>
          </div>
          <div className={styles['line-info']}>
            <div className={styles.first}>
              <Icons type="Frame" size="20" color="#CACCD0" />
              <span>
                所在位置：
                {`${prodLineName || ''}` +
                  `${workcellName || ''}` +
                  `${locationName || ''}` +
                  `${outsideLocation || ''}`}
              </span>
            </div>
            <div className={styles.last}>
              <Icons type="beizhu" size="20" color="#CACCD0" />
              <span>设备描述：{description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
