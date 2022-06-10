/*
 * @Descripttion: 刀具维修
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */
import React, { PureComponent } from 'react';
import { Radio } from 'choerodon-ui';
import { chunk } from 'lodash';
import { Bind } from 'lodash-decorators';
import styles from '../index.less';

export default class CutterRepair extends PureComponent {
  @Bind()
  handleChangeRadio(e) {
    this.props.onChange('activeRepair', e.target.value);
  }

  render() {
    const { data, active = 'UNREPAIRED' } = this.props;
    const showData = chunk(data, 4);
    return (
      <div className={styles['repair-right']}>
        <div className={styles['cutter-title']}>
          <div className={styles['title-div']}>
            <p>刀具维修</p>
          </div>
          <div className={styles['title-div']}>
            <Radio.Group
              value={active}
              onChange={this.handleChangeRadio}
              className={styles['title-div-radio']}
            >
              <Radio.Button value="UNREPAIRED">待维修</Radio.Button>
              <Radio.Button value="REPAIRING">维修中</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={styles['items-wrapper']}>
          {showData.map((group, groupIdx) => {
            return (
              <div className={styles.items} keys={groupIdx}>
                {group.map((i, index) => {
                  return (
                    <div className={`${styles.item}`} keys={index}>
                      <div className={styles['item-top']}>
                        <p>{i.cutterName}</p>
                        <p className={styles.status}>
                          {i.repairTime}
                          <span style={{ fontSize: '12px' }}>h</span>
                        </p>
                      </div>
                      <div className={styles['item-bottom']}>
                        <p>
                          {i.prodLineName || i.warehouseName || i.locationName || i.outsideLocation}
                        </p>
                        <p>{i.cutterStatusMeaning}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
