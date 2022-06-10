/*
 * @module-: 追加组件
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-10-27 18:10:01
 * @LastEditTime: 2020-10-30 17:39:25
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, TextField, DataSet, DateTimePicker } from 'choerodon-ui/pro';

import { Bind } from 'lodash-decorators';
import formDs from '../stores/fromDs';

@connect(({ productionTasksModel }) => ({ productionTasksModel }))
class InspectionOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      resetStatus: false,
    };
  }

  myFormDs = new DataSet(formDs());

  static getDerivedStateFromProps(nextProps, nextState) {
    const {
      productionTasksModel: { resetStatus },
    } = nextProps;
    if (resetStatus !== nextState.resetStatus) {
      return { resetStatus };
    }
  }

  componentDidUpdate() {
    const { resetStatus } = this.state;
    if (resetStatus) {
      this.myFormDs.current.reset();
    }
  }

  /**
   *追加数据
   *
   * @param {*} name
   * @param {*} value
   * @memberof InspectionOrder
   */
  @Bind()
  handleChangeInput(name, value) {
    const { lines } = this.state;
    const { dispatch } = this.props;
    if (lines.length < 1) {
      lines.push({ [name]: value, id: this.props.dataIndex });
    } else {
      lines.forEach((item) => {
        if (item.id === this.props.dataIndex) {
          Object.assign(item, { [name]: value });
        } else {
          lines.push({ [name]: value, id: this.props.dataIndex });
        }
      });
    }
    this.setState(
      () => ({ lines }),
      () => {
        dispatch({
          type: 'productionTasksModel/inspectionOrderInformation',
          payload: { lines: lines[0] },
        });
      }
    );
  }

  render() {
    return (
      <Fragment>
        <Form columns={2} labelWidth={[80, 70]} dataSet={this.myFormDs}>
          <TextField
            name="itemCode"
            label="物料"
            onChange={(value) => this.handleChangeInput('itemCode', value)}
          />
          <TextField
            name="itemName"
            label="物料描述"
            onChange={(value) => this.handleChangeInput('itemName', value)}
          />
          <TextField
            name="inspector"
            label="判定人员"
            onChange={(value) => this.handleChangeInput('inspector', value)}
          />
          <DateTimePicker
            name="judgedDate"
            label="判定时间"
            onChange={(value) =>
              this.handleChangeInput('judgedDate', value.format('YYYY-MM-DD HH:mm:ss'))
            }
          />
          <TextField
            name="sourceDocNum"
            label="来源单据号"
            onChange={(value) => this.handleChangeInput('sourceDocNum', value)}
          />
          <TextField
            name="inspectionDocNum"
            label="检验单号"
            onChange={(value) => this.handleChangeInput('inspectionDocNum', value)}
          />
        </Form>
      </Fragment>
    );
  }
}
export default InspectionOrder;
