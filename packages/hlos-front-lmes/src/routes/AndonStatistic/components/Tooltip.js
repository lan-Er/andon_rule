import React from 'react';

import intl from 'utils/intl';

import styles from '../index.module.less';

const intlPrefix = 'lmes.andonStatistic';
const commonPrefix = 'lmes.common';

export default function ToolTip({ record = {}, mouseEnterFlag, mouseAxisData }) {
  const { x, y } = mouseAxisData;
  const { innerWidth, innerHeight } = window;
  let axisX = x + 20;
  let axisY = y + 20;
  if (axisX + 220 > innerWidth) {
    axisX -= 220;
  }
  if (axisY + 130 > innerHeight) {
    axisY -= 130;
  }
  return (
    <div
      className={styles.tooltip}
      style={{
        display: mouseEnterFlag ? 'flex' : 'none',
        transform: `translateX(${axisX}px) translateY(${axisY}px)`,
      }}
    >
      <div className={styles.title}>
        <span>{intl.get(`${commonPrefix}.model.org`).d('组织')}</span>
        <span>{intl.get(`${commonPrefix}.model.prodLine`).d('生产线')}</span>
        <span>{intl.get(`${commonPrefix}.model.workcell`).d('工位')}</span>
        <span>{intl.get(`${commonPrefix}.model.equipment`).d('设备')}</span>
        <span>{intl.get(`${intlPrefix}.view.message.triggeredTime`).d('触发时间')}</span>
      </div>
      <div className={styles.value}>
        <span>{record.organizationName || ''}</span>
        <span>{record.prodLineName || ''}</span>
        <span>{record.workcellName || ''}</span>
        <span>{record.equipmentName || ''}</span>
        <span>{record.triggeredTime || ''}</span>
      </div>
    </div>
  );
}
