/*
 * @Description: 商业实体管理信息--list
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-27 15:57:22
 * @LastEditors: 赵敏捷
 */


import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, Button, Tooltip } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender, partyStatusRender } from 'hlos-front/lib/utils/renderer';
import PartyDS from '../stores/PartyDS';

const intlPrefix = 'lmds.party';
const commonPrefix = 'lmds.common';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class PartyList extends Component {
  partyDS = new DataSet({
    ...PartyDS(this.props),
  });

  componentDidMount() {
    this.partyDS.query();
  }

  get columns() {
    return [
      {
        name: 'partyType',
        width: 150,
        lock: true,
      },
      {
        name: 'partyNumber',
        width: 150,
        lock: true,
      },
      {
        name: 'partyName',
        width: 150,
        lock: true,
      },
      {
        name: 'partyAlias',
        width: 150,
      },
      {
        name: 'description',
        width: 150,
      },
      {
        name: 'societyNumber',
        width: 150,
      },
      {
        name: 'partyStatus',
        width: 120,
        align: 'center',
        renderer: partyStatusRender,
      },
      {
        name: 'provinceState',
        width: 150,
      },
      {
        name: 'city',
        width: 150,
      },
      {
        name: 'address',
        width: 150,
      },
      {
        name: 'zipcode',
        width: 150,
      },
      {
        name: 'contact',
        width: 150,
      },
      {
        name: 'phoneNumber',
        width: 150,
      },
      {
        name: 'email',
        width: 150,
      },
      {
        name: 'startDate',
        width: 150,
        align: 'center',
      },
      {
        name: 'endDate',
        width: 150,
        align: 'center',
      },
      {
        name: 'externalId',
        width: 150,
      },
      {
        name: 'externalNum',
        width: 150,
      },
      {
        name: 'enabledFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get('lmds.common.button.detail').d('详情')}>
              <Button
                color="primary"
                funcType="flat"
                onClick={() => this.handleGoDetail(record)}
              >
                { intl.get('lmds.common.button.detail').d('详情') }
              </Button>
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  @Bind()
  handleGoDetail(record) {
    const { dispatch } = this.props;
    const { partyId } = record.data;
    dispatch(
      routerRedux.push({
        pathname: `/lmds/party/detail/${partyId}`,
      })
    );
  }

  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const formObj = this.partyDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.party`).d('商业实体')}>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/parties/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.partyDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
