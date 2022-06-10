/*
 * @Description: 客户管理信息--list
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-29 13:38:45
 * @LastEditors: 赵敏捷
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { DataSet, Table, Button, Tooltip } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender, enableRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';
import CustomerListDS from '../stores/CustomerListDS';

const intlPrefix = 'lmds.party';
const commonPrefix = 'lmds.common';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { customer },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class CustomerList extends Component {
  customerListDS = new DataSet({
    ...CustomerListDS(this.props),
  });

  componentDidMount() {
    this.customerListDS.query();
  }

  get columns() {
    return [
      {
        name: 'customerNumber',
        width: 150,
        editor: false,
        lock: true,
      },
      {
        name: 'customerName',
        width: 150,
        editor: false,
        lock: true,
      },
      {
        name: 'customerAlias',
        width: 150,
        editor: false,
      },
      {
        name: 'description',
        width: 150,
        editor: false,
      },
      {
        name: 'category',
        width: 150,
        editor: false,
      },
      {
        name: 'salesman',
        width: 150,
        editor: false,
      },
      {
        name: 'customerGroup',
        width: 150,
        editor: false,
      },
      {
        name: 'societyNumber',
        width: 150,
        editor: false,
      },
      {
        name: 'customerRank',
        width: 150,
        editor: false,
      },
      {
        name: 'customerStatus',
        width: 150,
        align: 'center',
        editor: false,
        renderer: enableRender,
      },
      {
        name: 'consignFlag',
        width: 150,
        editor: false,
      },
      {
        name: 'fobType',
        width: 150,
        editor: false,
      },
      {
        name: 'paymentDeadline',
        width: 150,
        editor: false,
      },
      {
        name: 'paymentMethod',
        width: 150,
        editor: false,
      },
      {
        name: 'currency',
        width: 150,
        editor: false,
      },
      {
        name: 'taxRate',
        width: 150,
        editor: false,
      },
      {
        name: 'countryRegion',
        width: 150,
        editor: false,
      },
      {
        name: 'provinceState',
        width: 150,
        editor: false,
      },
      {
        name: 'city',
        width: 150,
        editor: false,
      },
      {
        name: 'address',
        width: 150,
        editor: false,
      },
      {
        name: 'zipcode',
        width: 150,
        editor: false,
      },
      {
        name: 'contact',
        width: 150,
        editor: false,
      },
      {
        name: 'phoneNumber',
        width: 150,
        editor: false,
      },
      {
        name: 'email',
        width: 150,
        editor: false,
      },
      {
        name: 'startDate',
        width: 130,
        editor: false,
        align: 'center',
      },
      {
        name: 'endDate',
        width: 130,
        editor: false,
        align: 'center',
      },
      {
        name: 'externalId',
        width: 150,
        editor: false,
      },
      {
        name: 'externalNum',
        width: 150,
        editor: false,
      },
      {
        name: 'enabledFlag',
        width: 100,
        editor: false,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get('hzero.common.status.edit').d('编辑')}>
              <Button
                key="framework"
                color="primary"
                funcType="flat"
                onClick={() => this.handleGoDetail(record)}
              >
                {intl.get('hzero.common.status.edit').d('编辑')}
              </Button>
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 跳转详情页面
   * @param record
   */
  @Bind
  handleGoDetail(record) {
    const { dispatch } = this.props;
    const { customerId } = record.data;
    dispatch(
      routerRedux.push({
        pathname: `/lmds/customer/detail/${customerId}`,
      })
    );
  }

  /**
   * 新建单据
   */
  @Bind
  handleCreateCustomer() {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/lmds/customer/create',
      })
    );
  }

  /**
   * getExportQueryParams - 获取导出字段查询参数
   */
  @Bind
  getExportQueryParams() {
    const { customerListDS: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  @Bind
  handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${customer}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${intlPrefix}.view.title.customerImport`).d('客户导入'),
      search: queryString.stringify({
        action: intl.get(`${intlPrefix}.view.title.customerImport`).d('客户导入'),
      }),
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.customer`).d('客户')}>
          <Button icon="add" color="primary" onClick={this.handleCreateCustomer}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/customers/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.customerListDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
