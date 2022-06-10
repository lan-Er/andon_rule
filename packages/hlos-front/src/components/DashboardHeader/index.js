/*
 * @Description: 看板公用header组件
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2020-10-30 14:05:22
 * @LastEditors: 那宇
 */

import React from 'react';
import headerImg from '../../assets/dashboard-header.png';
import styles from './index.less';

const DashboardHeader = ({ title }) => {
  return (
    <div className={styles['dashboard-header']}>
      <img src={headerImg} alt="" />
      <span>{title}</span>
    </div>
  );
};

export default DashboardHeader;
