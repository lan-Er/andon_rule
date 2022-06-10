/*
 * @Descripttion: 刀具类型
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */
import React, { PureComponent } from 'react';
import { Radio, Select } from 'choerodon-ui';
import ReactEcharts from 'echarts-for-react';
import { Bind } from 'lodash-decorators';

import styles from '../index.less';

const { Option } = Select;
export default class CutterType extends PureComponent {
  @Bind()
  handleChangeRadio(e) {
    this.props.onChange('activeType', e.target.value);
  }

  @Bind()
  handleChangeSelect(value) {
    this.props.onChangeSelect(value);
  }

  render() {
    const { active, option: options, status } = this.props;
    return (
      <div className={styles['type-left']}>
        <div className={styles['cutter-title']}>
          <div className={styles['title-div']}>
            <div className={styles['title-div-p']}>
              <p>刀具类型</p>
            </div>
            <div className={styles['title-div-select']}>
              <Select
                defaultValue="全部"
                onChange={this.handleChangeSelect}
                style={{ width: '50%' }}
              >
                <Option value="全部" key="全部">
                  {'全部'}
                </Option>
                {status.map((statu) => {
                  const { attribute2 } = statu;
                  return (
                    <Option value={attribute2} key={attribute2}>
                      {attribute2}
                    </Option>
                  );
                })}
              </Select>
            </div>
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
        <div className={styles['type-content-left-img']}>
          <ReactEcharts option={options} opts={{ renderer: 'canvas' }} />
        </div>
      </div>
    );
  }
}
