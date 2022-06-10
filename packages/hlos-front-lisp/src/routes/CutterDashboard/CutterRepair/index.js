/*
 * @Descripttion: 刀具维修
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */
import React, { PureComponent } from 'react';
import { Radio } from 'choerodon-ui';
import { Bind } from 'lodash-decorators';
import styles from '../index.less';

export default class CutterRepair extends PureComponent {
  @Bind()
  handleChangeRadio(e) {
    this.props.onChange('activeRepair', e.target.value);
  }

  render() {
    const { data, active = '待维修' } = this.props;
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
              <Radio.Button value="待维修">待维修</Radio.Button>
              <Radio.Button value="维修中">维修中</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={styles.items}>
          {data.map((i, index) => {
            return (
              <div className={`${styles.item}`} keys={index}>
                <div className={styles['item-top']}>
                  <p>{i.attribute3}</p>
                  <p className={styles.status}>
                    {i.duration}
                    <span style={{ fontSize: '12px' }}>min</span>
                  </p>
                </div>
                <div className={styles['item-bottom']}>
                  <p>{i.attribute9 || i.attribute14}</p>
                  <p>{i.attribute5}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
