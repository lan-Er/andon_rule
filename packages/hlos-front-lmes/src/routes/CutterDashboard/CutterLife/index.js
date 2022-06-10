/*
 * @Descripttion: 刀具寿命
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */
import React, { PureComponent } from 'react';
import { chunk } from 'lodash';
import { Progress, Carousel } from 'choerodon-ui';

import styles from '../index.less';

export default class CutterLife extends PureComponent {
  render() {
    const { data } = this.props;
    const showData = chunk(data, 4);
    return (
      <div className={styles['lift-left']}>
        <p className={styles['cutter-common-title']}>刀具寿命预警</p>
        <div className={styles['items-wrapper']}>
          <Carousel dots={false} vertical autoplay speed={1000}>
            {showData.map((group, index) => {
              return (
                <div className={styles.items} keys={index}>
                  {group.map((i, idx) => {
                    return (
                      <div className={`${styles.item}`} keys={idx}>
                        <div className={styles['item-top']}>
                          <p>{i.cutterName}</p>
                          <p className={styles.status}>{i.cutterStatusMeaning || i.cutterStatus}</p>
                        </div>
                        <div className={styles['item-bottom']}>
                          <p className={styles['item-bottom-p']}>
                            {i.prodLineName ||
                              i.warehouseName ||
                              i.locationName ||
                              i.outsideLocation}
                          </p>
                          <p className={styles['item-bottom-border']} />
                          <p>维修次数</p>
                          <div style={{ width: '30%' }}>
                            <Progress
                              percent={(i.cutterUsedCount / i.cutterLifetimeCount) * 100}
                              showInfo={false}
                            />
                          </div>
                          <p>{`${i.cutterUsedCount}/${i.cutterLifetimeCount}`}</p>
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
