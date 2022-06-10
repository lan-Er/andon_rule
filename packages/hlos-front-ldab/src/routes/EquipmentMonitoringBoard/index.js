/*
 * @module: 设备监控看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-01-18 14:46:56
 * @LastEditTime: 2021-01-25 14:43:26
 * @copyright: Copyright (c) 2020,Hand
 */
import React from 'react';
import DashboardHeader from '@/common/DashboardHeader';

import MyModal from './MyModal';
import MyFooter from './MyFooter';
import MyHeaderList from './MyHeaderList';

export default function EquipmentMonitoringBoard(props) {
  return (
    <MyModal {...props}>
      <DashboardHeader title="设备监控看板" history={props.history} bgColor="transparent" />
      <MyHeaderList />
      <MyFooter />
    </MyModal>
  );
}
