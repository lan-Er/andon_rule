/*
 * @Descripttion: 刀具总揽
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */
import React, { Component } from 'react';
import { isEmpty, chunk } from 'lodash';
import { Carousel } from 'choerodon-ui';
import uuidv4 from 'uuid/v4';

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
    const { data, total } = this.props;
    const showData = chunk(data, 6);
    return (
      <div className={styles['view-cutter-over']}>
        <p className={styles['cutter-common-title']}>
          <span>监控总览</span>
        </p>
        <div className={styles['item-list']}>
          <div className={styles['cutter-item-left']}>
            <div className={styles['cutter-item']}>
              <div className={styles['item-header']}>
                <span>刀具总数</span>
              </div>
              <div className={styles['item-content']}>
                <span>{total}</span>
              </div>
            </div>
          </div>
          <Carousel>
            {showData.map((i) => {
              return (
                <div className={styles['cutter-item-right']} key={uuidv4()}>
                  {i.map((record) => {
                    return (
                      <div className={styles['cutter-item']} key={record.cutterStatus}>
                        <div className={styles['item-header']}>
                          <span>{record.cutterStatusMeaning}</span>
                        </div>
                        <div className={styles['item-content']}>
                          <span>{record.amount}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    );
  }
}
