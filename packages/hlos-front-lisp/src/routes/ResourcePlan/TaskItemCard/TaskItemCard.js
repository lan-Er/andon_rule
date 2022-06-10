/*
 * @Descripttion:
 * @Author: chenyang.liu
 * @Date: 2019-10-24 14:48:31
 * @LastEditors: allen
 * @LastEditTime: 2019-10-30 17:34:11
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Tag } from 'choerodon-ui';
import { Bind } from 'lodash-decorators';
import { CheckBox } from 'choerodon-ui/pro';

import styles from './taskItemCard.less';

/**
 * @param {object} item 单个task对象
 * @param {boolean} needCheck 是否需要勾选框
 */
@connect(({ lispResourcePlanModel }) => ({
  checkArray: lispResourcePlanModel.checkArray,
}))
class TaskItemCard extends Component {
  /**
   * 渲染订单状态
   * @param value 订单状态值
   * @returns
   */
  @Bind()
  orderStatusRender(value) {
    let actionText;
    switch (value) {
      case '运行中':
        actionText = (
          <Tag color="#00CC00">
            <span style={{ color: '#fff' }}>{value}</span>
          </Tag>
        );
        break;
      case '新建':
        actionText = (
          <Tag color="#999999">
            <span style={{ color: '#fff' }}>{value}</span>
          </Tag>
        );
        break;
      case '已排期':
        actionText = (
          <Tag color="#0033FF">
            <span style={{ color: '#fff' }}>{value}</span>
          </Tag>
        );
        break;
      default:
        actionText = value;
    }
    return actionText;
  }

  render() {
    const { needCheck, item, checkArray } = this.props;
    return (
      <div className={styles['task-item']} style={{ background: item.ifLight ? 'lightblue' : '' }}>
        <div className={styles['flex-between-content']}>
          <div>
            {needCheck ? (
              <CheckBox
                disabled={item.attribute7 === '运行中'}
                checked={checkArray.includes(item.dataId)}
                onChange={this.props.checkIt}
              />
            ) : null}
            <span className={styles['task-num']}>{item.attribute3}</span>
          </div>
          {this.orderStatusRender(item.attribute7)}
        </div>
        <div className={styles['task-item-header-bottom']}>
          <span>{item.attribute4}</span>
          <span className={styles['craft-name']}>{item.switchTagMeaning}</span>
        </div>
        <div>
          <div className={styles['flex-between-content']}>
            <span onClick={this.props.searchMo}>{item.attribute2}</span>
            <span>{item.attribute5}</span>
          </div>
          <div className={styles['flex-between-content']}>
            <span>{moment(item.attribute15).format('MM-DD')}</span>
            <span>{moment(item.attribute16).format('MM-DD')}</span>
            <span>
              <span className={styles['craft-name']}>{item.attribute41}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default TaskItemCard;
