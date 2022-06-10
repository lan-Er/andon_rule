/*
 * @Descripttion: 刀具寿命
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */
import React, { PureComponent } from 'react';
import { Progress } from 'choerodon-ui';

import styles from '../index.less';

export default class CutterLife extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <div className={styles['lift-left']}>
        <p className={styles['cutter-common-title']}>刀具寿命预警</p>
        <div className={styles.items}>
          {data.map((i, index) => {
            return (
              <div className={`${styles.item}`} keys={index}>
                <div className={styles['item-top']}>
                  <p>{i.attribute3}</p>
                  <p className={styles.status}>{i.attribute5}</p>
                </div>
                <div className={styles['item-bottom']}>
                  <p className={styles['item-bottom-p']}>
                    {i.attribute12 || i.attribute9}的点点滴滴
                  </p>
                  <p className={styles['item-bottom-border']} />
                  <p>维修次数</p>
                  <p style={{ width: '30%' }}>
                    <Progress percent={(i.attribute20 / i.attribute19) * 100} showInfo={false} />
                  </p>
                  <p>{`${i.attribute20}/${i.attribute19}`}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
