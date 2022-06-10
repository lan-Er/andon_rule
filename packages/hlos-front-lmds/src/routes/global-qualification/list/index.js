/**
 * @Description: 资质管理信息--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-03 10:32:17
 * @LastEditors: yiping.liu
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { DataSet, Table, CheckBox, Button, Tooltip, Select, TextField } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import QualificationDs from '../stores/QualificationDs';

const preCode = 'lmds.qualification';
const organizationId = getCurrentOrganizationId();
@connect()
@formatterCollections({
  code: ['lmds.qualification', 'lmds.common'],
})
export default class Qualification extends Component {
  tableDS = new DataSet({
    ...QualificationDs(),
  });

  get columns() {
    return [{
      name: 'qualificationType',
      width: 150,
      editor: record => (record.status === 'add' ? <Select /> : null),
      lock: true,
    },
    {
      name: 'qualificationCode',
      width: 150,
      editor: record => record.status === 'add' ? <TextField /> : null,
      lock: true,
    },
    {
      name: 'qualificationName',
      width: 150,
      editor: false,
      lock: true,
    },
    {
      name: 'qualificationAlias',
      width: 150,
      editor: false,
    },
    {
      name: 'description',
      width: 150,
      editor: false,
    },
    {
      name: 'qualificationCategory',
      width: 150,
      editor: false,
    },
    {
      name: 'qualificationLevel',
      width: 150,
      editor: record => (record.status === 'add' ? <Select /> : null),
    },
    {
      name: 'enabledFlag',
      width: 100,
      editor: record => (record.editing ? <CheckBox /> : false),
      align: 'center',
      renderer: yesOrNoRender,
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 120,
      command: ({ record }) => {
        return [
          <Tooltip
            placement="bottom"
            title={intl.get(`${preCode}.view.title.edit`).d('编辑')}
          >
            <Button
              key="mode_edit"
              icon="mode_edit"
              color="primary"
              funcType="flat"
              onClick={() => this.handleToDetailPage('/lmds/qualification/detail', record)}
            />
          </Tooltip>,
        ];
      },
      lock: 'right',
    },
    ];
  }

  /**
  *跳转到新建页面
  *
  * @param {*} url
  * @param {*} e
  * @memberof Qualification
  */
  @Bind()
  handleAddLine(url, e) {
    if (e) e.stopPropagation();
    this.props.dispatch(
      routerRedux.push({
        pathname: url,
      })
    );
  }

  /**
   *
   *跳转到详情
   * @param record
   * @param service
   * @param e
   */
  @Bind()
  handleToDetailPage(url, record, e) {
    if (e) e.stopPropagation();
    this.props.dispatch(
      routerRedux.push({
        pathname: `${url}/${record.get('qualificationId')}`,
      })
    );
  }

  /**
   *导出
   *
   * @returns
   * @memberof Qualification
   */
  @Bind
  getExportQueryParams() {
    const {
      tableDS: ds,
    } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.qualification`).d('资质')}>
          <Button
            icon="add"
            color="primary"
            onClick={() => this.handleAddLine('/lmds/qualification/create')}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/qualification/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}