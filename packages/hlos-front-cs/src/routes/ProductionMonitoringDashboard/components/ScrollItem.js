/*
 * @Description: 生产监控看板
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-09 13:57:28
 * @LastEditors: Please set LastEditors
 */
import React, { Fragment } from 'react';
import styles from '../index.module.less';

export default function ScrollItem({ item, type }) {
  const {
    // 安灯数据
    andonCode = '暂无',
    andonName = '暂无',
    // showValue = false,
    triggeredDuration = '0',
    andonRelTypeMeaning = '暂无',
    andonClassName = '暂无',
    prodLineName = '',
    equipmentName = '',
    workcellName = '',
    triggeredTime = '暂无',
    // 质量监控数据
    itemCode = '',
    itemName = '',
    inspector = '',
    judgedDate = '',
    sourceDocNum = '',
    inspectionDocNum = '',
  } = item;
  return (
    <div className={styles['scroll-item']}>
      {type === 'productionMonitorDashboardLeftList' ? (
        <Fragment>
          <div className={styles['body-top']}>
            <div className={styles.titleName}>
              {itemCode}-{itemName}
            </div>
          </div>
          <div className={styles['body-center-line']} />
          <div className={styles['body-bottom']}>
            <div className={styles.item}>
              <div className={styles.key}>{sourceDocNum}</div>
              <div className={styles.value}>{inspector}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.key}>{inspectionDocNum}</div>
              <div className={styles.gray}>{judgedDate}</div>
            </div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className={styles['body-top']}>
            <div className={styles.title}>
              {andonCode}-{andonName}
            </div>
            <div className={styles.value}>{triggeredDuration}min</div>
          </div>
          <div className={styles['body-center-line']} />
          <div className={styles['body-bottom']}>
            <div className={styles.item}>
              <div className={styles.key}>{andonRelTypeMeaning}</div>
              <div className={styles.value}>{andonClassName}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.key}>
                {prodLineName}
                {equipmentName ? `-${equipmentName}` : ''}
                {workcellName ? `-${workcellName}` : ''}
              </div>
              <div className={styles.gray}>{triggeredTime}</div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
