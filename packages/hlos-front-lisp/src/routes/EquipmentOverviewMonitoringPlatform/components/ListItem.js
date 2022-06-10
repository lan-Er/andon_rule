import React from 'react';
import '../style.less';
import prodLineIcon from '../../../assets/equipmentOverviewMonitoringPlatform/prodLine.svg';
import timeIcon from '../../../assets/equipmentOverviewMonitoringPlatform/time.svg';

export default function ListItem({ rec, ...otherProps }) {
  const {
    equipmentName: t = '-',
    status = '-',
    statusMeaning = '-',
    equipmentCode = '-',
    equipmentType: item = '-',
    organizationName: prodLine = '-',
    statusDate: time = '-',
  } = rec;
  function getStausClassName(type) {
    switch (status) {
      case 'RUNNING':
        return type === 'indicator' ? 'list-item-indicator-working' : 'list-item-status-working';
      case 'BREAKDOWN':
        return type === 'indicator' ? 'list-item-indicator-down' : 'list-item-status-down';
      case 'MENDING':
        return type === 'indicator' ? 'list-item-indicator-repair' : 'list-item-status-repair';
      case 'STANDBY':
        return type === 'indicator' ? 'list-item-indicator-free' : 'list-item-status-free';
      default:
        return '';
    }
  }
  return (
    <ul style={{ listStyleType: 'none' }} {...otherProps}>
      <li>
        <div className="list-item">
          <div className="list-item-head">
            <div className={getStausClassName('indicator')} />
            <div className="list-item-title">{t}</div>
            <div className={getStausClassName('status')} style={{ textAlign: 'center' }}>
              {statusMeaning}
            </div>
          </div>
          <div className="list-item-body">
            <div className="list-item-body-line">
              <span>{equipmentCode}</span>
              <span>{item}</span>
            </div>
            <div className="list-item-body-line">
              <div>
                <img src={prodLineIcon} alt="" />
                {prodLine}
              </div>
              <div>
                <img src={timeIcon} alt="" />
                {time}
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
}
