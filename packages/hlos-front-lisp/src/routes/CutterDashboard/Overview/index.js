/*
 * @Descripttion: 刀具总揽
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */
import React, { Component } from 'react';
import { isEmpty } from 'lodash';

import styles from '../index.less';

export default class Overview extends Component {
  getOverview(value) {
    if (isEmpty(value) && value > 0) {
      const str = value.toString();
      const reg = /\d(?!$)/g;
      return str.replace(reg, function (r, i) {
        // 索引
        if ((str.length - i - 1) % 3 === 0) {
          return `${r},`;
        } else {
          return r;
        }
      });
    } else {
      return value;
    }
  }

  render() {
    const {
      data: { q0, q1, q2, q3, q4, q5, q6 },
    } = this.props;
    return (
      <div className={styles['view-cutter-over']}>
        <p className={styles['cutter-common-title']}>
          <span>监控总览</span>
        </p>
        <div className={styles['item-list']}>
          <div className={styles['cutter-item']}>
            <div className={styles['item-header']}>
              <span>刀具总数</span>
            </div>
            <div className={styles['item-content']}>
              <span>{this.getOverview(q0)}</span>
            </div>
          </div>
          <div className={styles['cutter-item']}>
            <div className={styles['item-header']}>
              <span>使用中</span>
            </div>
            <div className={styles['item-content']}>
              <span>{this.getOverview(q1)}</span>
            </div>
          </div>
          <div className={styles['cutter-item']}>
            <div className={styles['item-header']}>
              <span>已组装</span>
            </div>
            <div className={styles['item-content']}>
              <span>{this.getOverview(q2)}</span>
            </div>
          </div>
          <div className={styles['cutter-item']}>
            <div className={styles['item-header']}>
              <span>已占用</span>
            </div>
            <div className={styles['item-content']}>
              <span>{this.getOverview(q3)}</span>
            </div>
          </div>
          <div className={styles['cutter-item']}>
            <div className={styles['item-header']}>
              <span>闲置中</span>
            </div>
            <div className={styles['item-content']}>
              <span>{this.getOverview(q4)}</span>
            </div>
          </div>
          <div className={styles['cutter-item']}>
            <div className={styles['item-header']}>
              <span>故障</span>
            </div>
            <div className={styles['item-content']}>
              <span>{this.getOverview(q5)}</span>
            </div>
          </div>
          <div className={styles['cutter-item']}>
            <div className={styles['item-header']}>
              <span>维修中</span>
            </div>
            <div className={styles['item-content-right']}>
              <span>{this.getOverview(q6)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
