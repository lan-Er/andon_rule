/**
 * @Description: 权限管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-21 14:32:09
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, Button, Tooltip, Select, TextField } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import withProps from 'utils/withProps';
import notification from 'utils/notification';
import querystring from 'querystring';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import PrivilegeDS from './stores/PrivilegeDS';

const preCode = 'lmds.privilege';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: ['lmds.privilege', 'lmds.common'],
})
@withProps(
  () => {
    const tableDS = new DataSet({
      ...PrivilegeDS(),
    });
    return {
      tableDS,
    };
  },
  { cacheState: true }
)
@connect(({ privilege, loading }) => ({
  privilege,
  syncLoading: loading.effects['privilege/sync'],
}))
export default class Privilege extends Component {


  get columns() {
    return [
      { name: 'privilegeType', width: 200, editor: record => record.status === 'add'? <Select /> : null, lock: true },
      { name: 'privilegeCode', width: 200, editor: record => record.status === 'add'? <TextField /> : null, lock: true },
      { name: 'privilegeName', width: 200, editor: true, lock: true },
      { name: 'description', editor: true },
      {
        name: 'enabledFlag',
        width: 100,
        editor: record => record.editing ? <CheckBox /> : false,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            'edit',
            <Tooltip placement="bottom" title={intl.get(`${preCode}.button.detail`).d('详情')}>
              <Button
                key="format_list_bulleted"
                icon="format_list_bulleted"
                color="primary"
                funcType="flat"
                onClick={() => this.handleToLinePage(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 跳转到详情
   * @param record
   */
  @Bind()
  handleToLinePage(record) {
    const { dispatch } = this.props;
    const { privilegeId, privilegeCode, privilegeName, description } = record.data;
    const privilegeData = {
      privilegeId,
      privilegeCode,
      privilegeName,
      description,
    };
    dispatch(
      routerRedux.push({
        pathname: `/lmds/privilege/line`,
        search: record.data &&
        querystring.stringify({
          privilegeData: encodeURIComponent( JSON.stringify(privilegeData) ),
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


  /**
   * 同步权限
   */
  @Bind()
  handleSync() {
    const { dispatch, tableDS } = this.props;
    if(!tableDS.selected.length) {
      notification.warning({
        message: intl.get('lmds.common.msg.selectFirst').d('请先选择一条数据'),
      });
      return;
    }
    const data = [];
    tableDS.selected.forEach(item => {
      data.push(item.data);
    });

    dispatch({
      type: 'privilege/sync',
      payload: data,
    }).then(res => {
      if(res) {
        notification.success();
      }
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.privilege`).d('权限')}>
          <Button
            icon="add"
            color="primary"
            onClick={this.handleAddLine}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/privileges/excel`}
            queryParams={this.getExportQueryParams}
          />
          <Button
            icon="sync"
            onClick={this.handleSync}
            loading={this.props.syncLoading}
          >
            {intl.get('lmds.common.button.sync').d('同步')}
          </Button>
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