/*
 * @module-: 生产概况添加
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-10-28 17:46:22
 * @LastEditTime: 2020-10-29 14:39:13
 * @copyright: Copyright (c) 2018,Hand
 */
import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'dva';
import { Form, TextField, DateTimePicker, DataSet } from 'choerodon-ui/pro';

import { Bind } from 'lodash-decorators';

import formDs from '../stores/fromDs';

@connect(({ productionTasksModel }) => ({ productionTasksModel }))
class InspectionOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      productionOverview: [],
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
    const { productionOverview } = this.state;
    const { dispatch } = this.props;
    if (productionOverview.length < 1) {
      productionOverview.push({ [name]: value, id: this.props.dataIndex });
    } else {
      productionOverview.forEach((item) => {
        if (item.id === this.props.dataIndex) {
          Object.assign(item, { [name]: value });
        } else {
          productionOverview.push({ [name]: value, id: this.props.dataIndex });
        }
      });
    }
    this.setState(
      () => ({ productionOverview }),
      () => {
        dispatch({
          type: 'productionTasksModel/addProductionOverview',
          payload: { productionOverview: productionOverview[0] },
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
            name="moNum"
            label="订单"
            onChange={(value) => this.handleChangeInput('moNum', value)}
          />
          <TextField
            name="prodLine"
            label="产线"
            onChange={(value) => this.handleChangeInput('prodLine', value)}
          />
          <TextField
            name="demandQty"
            label="订单数量"
            onChange={(value) => this.handleChangeInput('demandQty', value)}
          />
          <TextField
            name="okQty"
            label="合格数量"
            onChange={(value) => this.handleChangeInput('okQty', value)}
          />
          <TextField
            name="scrappedQty"
            label="报废数量"
            onChange={(value) => this.handleChangeInput('scrappedQty', value)}
          />
          <DateTimePicker
            name="planStartDate"
            label="计划开工"
            onChange={(value) =>
              this.handleChangeInput('planStartDate', value.format('YYYY-MM-DD HH:mm:ss'))
            }
          />
          <DateTimePicker
            name="planEndDate"
            label="计划完工"
            onChange={(value) =>
              this.handleChangeInput('planEndDate', value.format('YYYY-MM-DD HH:mm:ss'))
            }
          />
        </Form>
      </Fragment>
    );
  }
}
export default withRouter(InspectionOrder);
