/**
 * @Description: 计划切换时间管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-04 19:15:08
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, Select, Button, Lov } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ApsSwitchTimeDS from '../stores/ApsSwithTimeDS';

const preCode = 'lmds.apsSwitchTime';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['lmds.apsSwitchTime', 'lmds.common'],
})

export default class ApsSwitchTime extends Component {
  tableDS = new DataSet({
    ...ApsSwitchTimeDS(),
  });

  get columns() {
    return [
      { name: 'apsOuObj', width: 150, editor: record => record.status === 'add'? <Lov noCache />: null },
      { name: 'switchType', width: 150, editor: record => record.status === 'add'? <Select />: null },
      { name: 'fromCategoryObj', width: 150, editor: record => record.status === 'add'? <Lov noCache />: null },
      { name: 'fromItemObj', width: 150, editor: record => record.status === 'add'? <Lov noCache />: null },
      { name: 'fromItemDescription', width: 150 },
      { name: 'toCategoryObj', width: 150, editor: record => record.status === 'add'? <Lov noCache />: null },
      { name: 'toItemObj', width: 150, editor: record => record.status === 'add'? <Lov noCache />: null },
      { name: 'toItemDescription', width: 150 },
      { name: 'resourceObj', width: 150, editor: record => record.status === 'add'? <Lov noCache />: null },
      { name: 'switchTime', width: 150, editor: true},
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
        command: ['edit', 'delete'],
        lock: 'right',
      },
    ];
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.tableDS.create({}, 0);
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const validateValue = await this.tableDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await this.tableDS.submit();
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
      await this.tableDS.query();
    }
  }

  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const formObj = this.tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.apsSwitchTime`).d('计划切换时间')}>
          <Button
            icon="add"
            color="primary"
            onClick={this.handleAddLine}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/aps-switch-times/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.tableDS}
            columns={this.columns}
            columnResizable="true"
            editMode="inline"
            queryFieldsLimit={4}
          />
        </Content>
      </Fragment>
    );
  }
}