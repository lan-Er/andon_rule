/*
 * @module-: 安灯信息
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-10-29 09:47:50
 * @LastEditTime: 2020-10-30 17:39:36
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'dva';
import { Form, TextField, DateTimePicker, DataSet } from 'choerodon-ui/pro';

import { Bind } from 'lodash-decorators';

import formDs from '../stores/fromDs';

@connect(({ productionTasksModel }) => ({ productionTasksModel }))
class AndonInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addProductionMonitorAndon: [],
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
    const { addProductionMonitorAndon } = this.state;
    const { dispatch } = this.props;
    if (addProductionMonitorAndon.length < 1) {
      addProductionMonitorAndon.push({ [name]: value, id: this.props.dataIndex });
    } else {
      addProductionMonitorAndon.forEach((item) => {
        if (item.id === this.props.dataIndex) {
          Object.assign(item, { [name]: value });
        } else {
          addProductionMonitorAndon.push({ [name]: value, id: this.props.dataIndex });
        }
      });
    }
    this.setState(
      () => ({ addProductionMonitorAndon }),
      () => {
        dispatch({
          type: 'productionTasksModel/addProductionMonitorAndon',
          payload: { addProductionMonitorAndon: addProductionMonitorAndon[0] },
        });
      }
    );
    // console.log(
    //   name,
    //   value,
    //   this.props.dataIndex,
    //   addProductionMonitorAndon,
    //   { [name]: value },
    //   '值改变'
    // );
  }

  render() {
    return (
      <Fragment>
        <Form columns={2} labelWidth={[80, 70]} dataSet={this.myFormDs}>
          <TextField
            name="andonCode"
            label="安灯"
            onChange={(value) => this.handleChangeInput('andonCode', value)}
          />
          <TextField
            name="andonName"
            label="安灯名称"
            onChange={(value) => this.handleChangeInput('andonName', value)}
          />
          <DateTimePicker
            name="triggeredTime"
            label="触发时间"
            onChange={(value) =>
              this.handleChangeInput('triggeredTime', value.format('YYYY-MM-DD HH:mm:ss'))
            }
          />
          <TextField
            name="andonClassName"
            label="关联资源"
            onChange={(value) => this.handleChangeInput('andonClassName', value)}
          />
          <TextField
            name="prodLineName"
            label="所在位置"
            onChange={(value) => this.handleChangeInput('prodLineName', value)}
          />
          <TextField
            name="andonRelTypeMeaning"
            label="安灯类型"
            onChange={(value) => this.handleChangeInput('andonRelTypeMeaning', value)}
          />
          <TextField
            name="triggeredDuration"
            label="触发时长"
            placeholder="单位min"
            onChange={(value) => this.handleChangeInput('triggeredDuration', value)}
          />
        </Form>
      </Fragment>
    );
  }
}
export default withRouter(AndonInformation);
