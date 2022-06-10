/*
 * @Descripttion: 客户协同总览
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-24 11:25:22
 * @LastEditors: Axtlive
 * @LastEditTime: 2020-07-31 13:28:03
 */

// import { connect } from 'dva';
import React, { Fragment, Component } from 'react';
import { DataSet, Lov, Button, Radio } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { Bind } from 'lodash-decorators';
import { queryList } from '../../services/api';
import './index.less';
import OrderOverview from './components/OrderOverview';
import OrderExecute from './OrderExecute';

export default class CustomerOverview extends Component {
  state = {
    customer: [], // 选中的供应商
    coreSelected: false, // 是否选中核心客户
    bodyType: 'overview',
  };

  ds = new DataSet({
    autoCreate: true,
    fields: [
      {
        name: 'customer',
        type: 'object',
        lovCode: 'LMDS.DEMO_CUSTOMER',
        label: '供应商',
      },
    ],
    events: {
      update: this.handleDataSetChange,
    },
  });

  async componentDidMount() {
    // await this.handleAllCustomer(); // 查询所有供应商
  }

  // 获取核心客户
  @Bind()
  async handleCoreCustomer() {
    await queryList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'CUSTOMER',
      essentialFlag: 1,
    }).then((res) => {
      if (res && res.content && res.content.length) {
        const customer = [];
        res.content.forEach((record) => {
          customer.push(record.attribute1);
        });
        this.setState({
          customer,
          coreSelected: true,
        });
      }
    });
  }

  // 修改客户
  @Bind()
  handleDataSetChange({ record, name, value, oldValue }) {
    console.log(record, name, value, oldValue);
    if (value && value.attribute1) {
      this.setState({
        customer: value.attribute1,
        coreSelected: false,
      });
    } else {
      this.setState({
        customer: '',
        coreSelected: false,
      });
    }
  }

  handleRadioChange = (value) => {
    this.setState({
      bodyType: value,
    });
  };

  render() {
    const { customer, coreSelected, bodyType } = this.state;
    return (
      <Fragment>
        <Header title="客户协同总览">
          <Lov
            dataSet={this.ds}
            name="customer"
            placeholder="筛选"
            noCache
            triggerMode="input"
            tableProps={{ selectionMode: 'rowbox' }}
          />
          <Button
            className={coreSelected ? 'core-selected' : 'core-unselect'}
            style={{ marginRight: '10px' }}
            onClick={this.handleCoreCustomer}
          >
            核心供应商
          </Button>
        </Header>
        <div style={{ margin: '8px 16px' }}>
          <Radio
            mode="button"
            name="type"
            value="overview"
            onChange={this.handleRadioChange}
            defaultChecked
          >
            订单总览
          </Radio>
          <Radio mode="button" name="type" value="execution" onChange={this.handleRadioChange}>
            订单执行
          </Radio>
        </div>
        <Content className="customer-view">
          {bodyType === 'overview' ? (
            <OrderOverview customer={customer} />
          ) : (
            <div style={{ height: '100%' }}>
              <OrderExecute customer={customer} />
            </div>
          )}
        </Content>
      </Fragment>
    );
  }
}
