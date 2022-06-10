/*
 * @Descripttion: 供应总览
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-06-24 11:25:22
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-06-29 16:57:53
 */

// import { connect } from 'dva';
import React, { Fragment, Component } from 'react';
import { DataSet, Button, Lov } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { Bind } from 'lodash-decorators';
import OrderView from './OrderView';
import OrderExecute from './OrderExecute';
import TroubleOrder from './TroubleOrder';
import QualityChart from './QualityChart';
import TimeChart from './TimeChart';
import OrderChart from './OrderChart';
import { queryList } from '../../services/api';
import './index.less';
// import { isBindingElement } from 'typescript';
// const { Option } = Select;

export default class SupplyOverview extends Component {
  state = {
    supplier: [], // 选中的供应商
    coreSelected: false, // 是否选中核心供应商
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

  render() {
    const { supplier, coreSelected } = this.state;
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
        <Content className="supply-view">
          <OrderView supplier={supplier} />
          <div className="chart-content">
            <div className="content-left">
              <OrderExecute supplier={supplier} />
            </div>
            <div className="content-right">
              <TroubleOrder supplier={supplier} />
            </div>
          </div>
          <div className="chart-footer">
            <div className="chart-item">
              <QualityChart supplier={supplier} />
            </div>
            <div className="chart-item">
              <TimeChart supplier={supplier} />
            </div>
            <div className="chart-item">
              <OrderChart supplier={supplier} />
            </div>
          </div>
        </Content>
      </Fragment>
    );
  }
}
