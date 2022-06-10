/*
 * @Description: 看板公用header组件
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2020-10-30 14:05:22
 * @LastEditors: Please set LastEditors
 */

import React from 'react';
import headerImg from 'hlos-front/lib/assets/dashboard-header.png';
import styles from './index.less';

const DashboardHeader = ({ title, history, bgColor = '#182534' }) => {
  const titleTip = history ? '点击返回主菜单' : '';

  /**
   *退出操作
   *
   */
  function handleExit() {
    const url = '/';
    history.push(url);
  }
  return (
    <div className={styles['dashboard-header']} style={{ background: bgColor }}>
      <img src={headerImg} alt="" />
      <span title={titleTip} onClick={handleExit}>
        {title}
      </span>
    </div>
  );
};

export default DashboardHeader;
