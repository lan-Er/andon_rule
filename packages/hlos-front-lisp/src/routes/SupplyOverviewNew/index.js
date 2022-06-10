/*
 * @Descripttion: 供应总览
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-07-30 15:59:21
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-07-30 20:20:32
 */

import React, { Fragment, Component } from 'react';
import { DataSet, Button, Lov, Radio } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { Bind } from 'lodash-decorators';
import OrderExecute from './SupplyOrderExecute';
import SupplierOverView from './SupplierOverView';
import { queryList } from '../../services/api';

export default class SupplyOverviewNew extends Component {
  state = {
    supplier: [], // 选中的供应商
    coreSelected: false, // 是否选中核心供应商
    bodyType: 'overview',
  };

  ds = new DataSet({
    autoCreate: true,
    fields: [
      {
        name: 'supplier',
        type: 'object',
        lovCode: 'LMDS.DEMO_SUPPLIER',
        label: '供应商',
      },
    ],
    events: {
      update: this.handleDataSetChange,
    },
  });

  // 获取核心供应商
  @Bind()
  async handleCoreSupplier() {
    await queryList({
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'SUPPLIER',
      essentialFlag: 1,
    }).then((res) => {
      if (res && res.content && res.content.length) {
        const supplier = [];
        res.content.forEach((record) => {
          supplier.push(record.attribute1);
        });
        this.setState({
          supplier,
          coreSelected: true,
        });
      }
    });
  }

  @Bind()
  handleDataSetChange({ record, name, value, oldValue }) {
    console.log(record, name, value, oldValue);
    if (value && value.attribute1) {
      this.setState({
        supplier: value.attribute1,
        coreSelected: false,
      });
    } else {
      this.setState({
        supplier: '',
        coreSelected: false,
      });
    }
  }

  @Bind()
  handleRadioChange = (value) => {
    this.setState({
      bodyType: value,
    });
  };

  render() {
    const { supplier, coreSelected, bodyType } = this.state;
    return (
      <Fragment>
        <Header title="供应总览">
          <Lov
            dataSet={this.ds}
            name="supplier"
            placeholder="筛选"
            noCache
            triggerMode="input"
            tableProps={{ selectionMode: 'rowbox' }}
          />
          <Button
            className={coreSelected ? 'core-selected' : 'core-unselect'}
            style={{ marginRight: '10px' }}
            onClick={this.handleCoreSupplier}
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
        <Content className="supply-view-new">
          {/* <Tabs defaultActiveKey="wait" animated={false}>
            {this.tabsArr().map((tab) => (
              <TabPane supplier={supplier} tab={tab.title} key={tab.code}>
                {tab.component}
              </TabPane>
            ))}
          </Tabs> */}
          {bodyType === 'overview' ? (
            <SupplierOverView supplier={supplier} />
          ) : (
            <OrderExecute supplier={supplier} />
          )}
        </Content>
      </Fragment>
    );
  }
}
