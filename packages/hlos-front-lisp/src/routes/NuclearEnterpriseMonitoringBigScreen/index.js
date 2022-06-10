/*
 * @module-: 核企监控大屏
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-25 14:35:37
 * @LastEditTime: 2020-07-27 15:23:39
 * @copyright: Copyright (c) 2018,Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';

import style from './index.less';
import MyHeader from './MyHeader/index';
import MyContent from './MyContent/index';
import FullScreenContainer from './components/fullScreenContainer';

@connect()
export default class NuclearEnterpriseMonitoringBigScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dynamicStyle: {},
    };
  }

  /**
   *根据屏幕宽度自适应
   *
   * @memberof NuclearEnterpriseMonitoringBigScreen
   */
  @Bind()
  changeSize() {
    const ratio = window.screen.width / 1366;
    const dynamicStyle = {
      width: '1366px',
      transform: `scale(${ratio})`,
      transformOrigin: 'left top',
      height: `${document.body.offsetHeight / ratio}px`,
    };
    this.setState({ dynamicStyle });
  }

  componentWillMount() {
    this.changeSize();
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.changeSize();
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => {
      this.changeSize();
    });
  }

  render() {
    const { dynamicStyle } = this.state;
    return (
      <FullScreenContainer>
        <div className={style['nuclear-enterprise-monitoringBig-screen']} style={dynamicStyle}>
          <MyHeader />
          <MyContent />
        </div>
      </FullScreenContainer>
    );
  }
}
