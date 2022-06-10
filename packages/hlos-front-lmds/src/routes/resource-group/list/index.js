/**
 * @Description: 资源组管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-08 14:53:29
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, TextField, Lov, Button, Tooltip } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import withProps from 'utils/withProps';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import querystring from 'querystring';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ResourceGroupListDS from '../stores/ResourceGroupListDS';

const preCode = 'lmds.resourceGroup';
const orgId = getCurrentOrganizationId();

@formatterCollections({
  code: ['lmds.resourceGroup', 'lmds.common'],
})
@withProps(
  () => {
    const tableDS = new DataSet({
      ...ResourceGroupListDS(),
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
@connect()
export default class ResourceGroup extends Component {

  get columns() {
    return [
      { name: 'organizationObj', width: 150, editor: record => record.status === 'add' ? <Lov noCache /> : null, lock: true },
      { name: 'resourceGroupType', width: 150, editor: true, lock: true},
      { name: 'resourceGroupCode', width: 150, editor: record => record.status === 'add' ? <TextField /> : null, lock: true },
      { name: 'resourceGroupName', width: 150, editor: true },
      { name: 'resourceGroupAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'categoryObj', width: 150, editor: <Lov noCache /> },
      { name: 'orderByCode', width: 150, editor: true },
      {
        name: 'enabledFlag',
        editor: record => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            'edit',
            <Tooltip placement="bottom" title={intl.get('lmds.common.button.assign').d('分配')}>
              <Button
                key="framework"
                icon="framework"
                color="primary"
                funcType="flat"
                onClick={() => this.handleToAssignPage(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 跳转到资源分配页面
   */
  @Bind()
  handleToAssignPage(record) {
    const { dispatch } = this.props;
    const { resourceGroupId, resourceGroupCode, resourceGroupName, organizationName, organizationId } = record.data;
    const groupData = {
      resourceGroupCode,
      resourceGroupName,
      organizationName,
      organizationId,
    };
    dispatch(
      routerRedux.push({
        pathname: `/lmds/resource-group/detail/${resourceGroupId}`,
        search: record.data &&
          querystring.stringify({
            groupData: encodeURIComponent( JSON.stringify(groupData) ),
          }),
      })
    );
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.props.tableDS.create({}, 0);
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const validateValue = await this.props.tableDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await this.props.tableDS.submit();
    if(res === undefined) {
      notification.warning({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });

    } else if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else {
      await this.props.tableDS.query();
    }
  }

  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const {
      tableDS,
    } = this.props;
    const formObj = tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.resourceGroup`).d('资源组')}>
          <Button
            icon="add"
            color="primary"
            onClick={this.handleAddLine}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${orgId}/resource-groups/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.props.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
