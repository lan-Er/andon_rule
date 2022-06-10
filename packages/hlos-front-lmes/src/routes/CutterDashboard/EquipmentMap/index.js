/*
 * @Descripttion: 刀具总揽
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */
import React, { Component } from 'react';
import { Radio } from 'choerodon-ui';
import { Bind } from 'lodash-decorators';
import styles from '../index.less';

const referToColor = {
  可用: '#1890FF',
  不可用: '#F5222D',
  闲置: '#69C0FF',
  已组装: '#95DE64',
  使用中: '#52C41A',
  试用: '#73D13D',
  待检: '#87E8DE',
  检验中: '#36CFC9',
  待维修: '#FFEC3D',
  维修中: '#FADB14',
  检修: '#FFF566',
  冻结: '#FFF566',
  报废: '#BFBFBF',
  借用: '#722ED1',
  封存: '#8C8C8C',
};
export default class EquipmentMap extends Component {
  @Bind()
  handleChangeRadio(e) {
    this.props.onChange('activeMap', e.target.value);
  }

  render() {
    const { data, locationTypeList, active } = this.props;
    return (
      <div className={styles['cutter-equipment-map']}>
        <div className={styles['cutter-title']}>
          <div className={styles['title-div']}>
            <p>刀具地图</p>
          </div>
          <div className={styles['title-div']}>
            <Radio.Group
              value={active}
              onChange={this.handleChangeRadio}
              className={styles['title-div-radio']}
            >
              {locationTypeList.map((i) => {
                return (
                  <Radio.Button value={i.value} key={i.value}>
                    {i.meaning}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </div>
        </div>
        <div className={styles['map-lines']}>
          {data.map((item) => {
            const { prodLineName, warehouseName, locationName, outsideLocation } = item;
            const name = prodLineName || warehouseName || locationName || outsideLocation;
            return (
              <div className={styles['line-item']}>
                <div className={styles.dot} />
                <p className={styles['line-title']}>{name}</p>
                <div className={styles.items}>
                  {item.cutterList.map((i) => {
                    return (
                      <div
                        key={i.cutterId}
                        className={`${styles.item}`}
                        style={{
                          borderLeft: `4px solid ${referToColor[i.cutterStatusMeaning]}`,
                        }}
                      >
                        <div className={styles['item-top']}>
                          <p>{i.cutterName}</p>
                          <p className={styles.status}>{i.cutterStatusMeaning}</p>
                        </div>
                        <div className={styles['item-bottom']}>
                          <p>{i.workcellName || i.wmAreaName}</p>
                          <p className={styles['item-bottom-border']} />
                          <p>{i.equipmentName}</p>
                          <p className={styles['item-bottom-border']} />
                          <p>{i.cutterBodyName}</p>
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
