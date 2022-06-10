/*
 * @Descripttion: 刀具总揽
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */
import React, { Component } from 'react';
import styles from '../index.less';

const referToColor = {
  维修中: 'MAPF6BD16',
  使用中: 'MAP5AD8A6',
  已占用: 'MAP6DC8EC',
  已组装: 'MAP9270CA',
  闲置中: 'MAPC2C8D5',
  故障: 'MAPFF9D4D',
};
export default class EquipmentMap extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className={styles['cutter-equipment-map']}>
        <p className={styles['cutter-common-title']}>设备地图</p>
        <div className={styles['map-lines']}>
          {data.map((item) => {
            return (
              <div className={styles['line-item']}>
                <div className={styles.dot} />
                <p className={styles['line-title']}>{item.name}</p>
                <div className={styles.items}>
                  {item.childrens.map((i) => {
                    return (
                      <div className={`${styles.item} ${styles[`${referToColor[i.attribute5]}`]}`}>
                        <div className={styles['item-top']}>
                          <p>{i.attribute3}</p>
                          <p className={styles.status}>{i.attribute5}</p>
                        </div>
                        <div className={styles['item-bottom']}>
                          <p>{i.att1}</p>
                          <p className={styles['item-bottom-border']} />
                          <p>{i.att2}</p>
                          <p className={styles['item-bottom-border']} />
                          <p>{i.attribute8}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
