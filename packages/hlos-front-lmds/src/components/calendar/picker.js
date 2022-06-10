/*
 * @Description: 日历Picker
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-22 15:09:07
 * @LastEditors: 赵敏捷
 */

import * as React from 'react';
import classnames from 'classnames';
import { Icon } from 'choerodon-ui/pro';
import styles from './picker.module.less';


export default class Picker extends React.Component {
  render() {
    const { date, type } = this.props;
    return (
      <div style={{ display: 'inline-block'}}>
        <span
          className={classnames(
            styles['date-btn'],
            styles['date-arrow'],
          )}
          onClick={() =>
            this.props.onMonthChange(
              this.props.date.clone().add(-1, type),
            )
          }
        >
          <Icon type="navigate_before" />
        </span>
        <span
          className={classnames(
            styles['date-btn'],
            styles['date-text-wrapper'],
          )}
        >
          <span className={styles['date-text']} style={{ width: 60 }}>
            {date.get('year')}
          </span>
          {type === 'month' && (
            <React.Fragment>
              <span className={styles['date-separator']}>-</span>
              <span
                className={styles['date-text']}
                style={{ width: 30 }}
              >
                {date.get('month') + 1 >= 10
                  ? date.get('month') + 1
                  : `0${date.get('month') + 1}`}
              </span>
            </React.Fragment>
          )}
        </span>
        <span
          className={classnames(
            styles['date-btn'],
            styles['date-arrow'],
          )}
          onClick={() =>
            this.props.onMonthChange(
              this.props.date.clone().add(1, type),
            )
          }
        >
          <Icon type="navigate_next" />
        </span>
      </div>
    );
  }
}
