/*
 * @Description: 看板公用header组件
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2020-10-30 14:05:22
 * @LastEditors: Please set LastEditors
 */

import React from 'react';
// import { closeTab } from 'utils/menuTab';
import headerImg from '../../assets/dashboard-header.png';
import styles from './index.less';
import Timer from './Timer';

const DashboardHeader = ({ title, history }) => {
  const titleTip = history ? '点击返回主菜单' : '';

  /**
   *退出操作
   *
   */
  function handleExit() {
    if (history) {
      // const meetingBoard = document.getElementById('meetingBoardList');
      // if (meetingBoard) {
      //   document.getElementById('root').removeChild(meetingBoard);
      // }
      const url = '/';
      history.push(url);
    }
  }
  return (
    <div className={styles['dashboard-header']}>
      <img src={headerImg} alt="" />
      <span title={titleTip} onClick={handleExit}>
        {title}
      </span>
      <Timer />
    </div>
  );
};

export default DashboardHeader;
