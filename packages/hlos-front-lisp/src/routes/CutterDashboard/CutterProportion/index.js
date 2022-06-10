/*
 * @Descripttion: 刀具占比
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */
import React, { PureComponent } from 'react';
import { Radio } from 'choerodon-ui';
import ReactEcharts from 'echarts-for-react';
import { Bind } from 'lodash-decorators';

import styles from '../index.less';

export default class CutterProportion extends PureComponent {
  @Bind()
  handleChangeRadio(e) {
    this.props.onChange('activeProportion', e.target.value);
  }

  render() {
    const { option, active } = this.props;
    return (
      <div className={styles['proportion-right']}>
        <div className={styles['cutter-title']}>
          <div className={styles['title-div']}>
            <p>刀具占比</p>
          </div>
          <div className={styles['title-div']}>
            <Radio.Group
              value={active}
              onChange={this.handleChangeRadio}
              className={styles['title-div-radio']}
            >
              <Radio.Button value="head">刀头</Radio.Button>
              <Radio.Button value="handle">刀体</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={styles['proportion-content-right-img']}>
          <ReactEcharts option={option} opts={{ renderer: 'canvas' }} />
        </div>
      </div>
    );
  }
}
