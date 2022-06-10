/**
 * @Description: 车间管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-05 16:42:59
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, TextField, Button, Lov } from 'choerodon-ui/pro';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { userSetting } from 'hlos-front/lib/services/api';

import meAreaListDS from '../stores/meAreaListDS';

const preCode = 'lmds.meArea';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['lmds.meArea', 'lmds.common'],
})
export default class meArea extends Component {
  tableDS = new DataSet({
    ...meAreaListDS(),
  });

  async componentDidMount() {
    const res = await userSetting({ defaultFlag: 'Y' });
    if (res && res.content) {
      const organizationIdUser = res.content[0].organizationId;
      this.tableDS.getField('issueWarehouseObj').setLovPara('organizationId', organizationIdUser);
      this.tableDS
        .getField('completeWarehouseObj')
        .setLovPara('organizationId', organizationIdUser);
      this.tableDS
        .getField('inventoryWarehouseObj')
        .setLovPara('organizationId', organizationIdUser);
    }
  }

  get columns() {
    return [
      { name: 'meAreaCode', width: 150, editor: this.editorRenderer, lock: true },
      { name: 'meAreaName', width: 150, editor: true, lock: true },
      { name: 'meAreaAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'meOuObj', width: 150, editor: <Lov noCache /> },
      { name: 'issueWarehouseObj', width: 150, editor: <Lov noCache /> },
      { name: 'issueWmAreaObj', width: 150, editor: <Lov noCache /> },
      { name: 'completeWarehouseObj', width: 150, editor: <Lov noCache /> },
      { name: 'completeWmAreaObj', width: 150, editor: <Lov noCache /> },
      { name: 'inventoryWarehouseObj', width: 150, editor: <Lov noCache /> },
      { name: 'inventoryWmAreaObj', width: 150, editor: <Lov noCache /> },
      { name: 'locationObj', width: 150, editor: <Lov noCache /> },
      { name: 'externalOrganization', width: 150, editor: true },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  /**
   * 判断是否为新建，新建可编辑
   * @param {*} record
   */
  editorRenderer(record) {
    return record.status === 'add' ? <TextField /> : null;
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
    if (res === undefined) {
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
        <Header title={intl.get(`${preCode}.view.title.meArea`).d('车间')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/me-areas/excel`}
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
