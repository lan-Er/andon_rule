/**
 * @Description: 事务查询管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-17 12:22:15
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Lov, Form, TextField, Tabs, DateTimePicker, Button } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';

import TransactionHeaderDS from '../stores/TransactionHeaderDS';
import TransactionListDS from '../stores/TransactionListDS';
import MainList from './MainList';
import WmList from './WmList';
import ProductList from './ProductList';
import OtherList from './OtherList';
import './style.less';

const preCode = 'lmds.transaction';
const organizationId = getCurrentOrganizationId();
const { TabPane } = Tabs;
const { common } = codeConfig.code;

@connect()
@formatterCollections({
  code: ['lmds.transaction', 'lmds.common'],
})
export default class Transaction extends Component {
  state = {
    hidden: true,
  };

  headerDS = new DataSet({
    ...TransactionHeaderDS(),
  });

  tableDS = new DataSet({
    ...TransactionListDS(),
  });

  async componentDidMount() {
    await this.headerDS.create({}, 0);

    const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
    if (getResponse(res)) {
      if (res.content[0]) {
        this.headerDS.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
        });
      }
    }
  }

  get tabsArr() {
    return [
      { code: 'main', title: '主要', component: <MainList tableDS={this.tableDS} /> },
      { code: 'wm', title: '仓储', component: <WmList tableDS={this.tableDS} /> },
      { code: 'product', title: '生产', component: <ProductList tableDS={this.tableDS} /> },
      { code: 'other', title: '其他', component: <OtherList tableDS={this.tableDS} /> },
    ];
  }

  get queryFields() {
    return [
      <Lov name="organizationObj" noCache />,
      <DateTimePicker name="minTransactionTime" />,
      <DateTimePicker name="maxTransactionTime" />,
      <Lov name="transactionTypeObj" noCache />,
      <Lov name="itemObj" noCache />,
      <Lov name="warehouseObj" noCache />,
      <Lov name="wmAreaObj" noCache />,
      <Lov name="documentObj" noCache />,
      <TextField name="featureCode" />,
      <Lov name="toWarehouseObj" noCache />,
      <Lov name="toWmAreaObj" noCache />,
      <Lov name="sourceDocObj" noCache />,
      <TextField name="lotNumber" />,
      <TextField name="tagCode" />,
      <TextField name="operation" />,
      <Lov name="partyObj" noCache />,
      <Lov name="prodLineObj" noCache />,
      <Lov name="workcellObj" noCache />,
      <Lov name="workerObj" noCache />,
      <Lov name="workerGroupObj" noCache />,
    ];
  }

  /**
   * 切换显示隐藏
   */
  @Bind()
  handleToggle() {
    const { hidden } = this.state;
    this.setState({
      hidden: !hidden,
    });
  }

  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const formObj = this.headerDS.current.toJSONData();
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj);
    return {
      ...fieldsValue,
    };
  }

  /**
   * 查询
   */
  @Bind()
  async handleSearch() {
    const validateValue = await this.headerDS.validate(false, false);
    if (!validateValue) {
      return;
    }

    this.tableDS.queryParameter = this.headerDS.current.toJSONData();
    await this.tableDS.query();
  }

  /**
   * 重置
   */
  @Bind()
  handleReset() {
    this.headerDS.current.clear();
  }

  render() {
    const { hidden } = this.state;
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.transaction`).d('事务查询')}>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/transactions/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content className="lmds-global-transaction-query">
          <div style={{ display: 'flex', marginBottom: 10, alignItems: 'flex-start' }}>
            <Form dataSet={this.headerDS} columns={3} style={{ flex: '1 1 auto' }}>
              {hidden ? this.queryFields.slice(0, 3) : this.queryFields}
            </Form>
            <div style={{ marginLeft: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <Button onClick={this.handleToggle}>
                {hidden
                  ? intl.get('hzero.common.button.viewMore').d('更多查询')
                  : intl.get('hzero.common.button.collected').d('收起查询')}
              </Button>
              <Button onClick={this.handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={this.handleSearch}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <Tabs defaultActiveKey="main">
            {this.tabsArr.map((tab) => (
              <TabPane
                tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
                key={tab.code}
              >
                {tab.component}
              </TabPane>
            ))}
          </Tabs>
        </Content>
      </Fragment>
    );
  }
}
