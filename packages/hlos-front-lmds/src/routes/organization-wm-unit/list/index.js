/**
 * @Description: 货格管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-06 14:32:10
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, TextField, Button, Lov } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';
import WareUnitListDS from '../stores/WareUnitListDS';

const preCode = 'lmds.common';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { wmUnit },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: ['lmds.wmUnit', 'lmds.common'],
})
export default class WmUnit extends Component {
  tableDS = new DataSet({
    ...WareUnitListDS(),
  });

  get columns() {
    return [
      {
        name: 'wmOuObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'warehouseObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      { name: 'wmAreaObj', width: 150, editor: <Lov noCache />, lock: true },
      { name: 'wmUnitCode', width: 150, lock: true },
      { name: 'wmUnitType', width: 150, editor: true },
      {
        name: 'segment01',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      {
        name: 'segment02',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      {
        name: 'segment03',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      {
        name: 'segment04',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      {
        name: 'segment05',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      {
        name: 'multiItemEnable',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        name: 'multiLotEnable',
        width: 100,
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        renderer: yesOrNoRender,
      },
      { name: 'length', width: 150, editor: true },
      { name: 'width', width: 150, editor: true },
      { name: 'height', width: 150, editor: true },
      { name: 'maxVolume', width: 150, editor: true },
      { name: 'maxWeight', width: 150, editor: true },
      { name: 'maxItemQty', width: 150, editor: true },
      { name: 'maxContainerQty', width: 150, editor: true },
      { name: 'maxPalletQty', width: 150, editor: true },
      { name: 'remark', width: 150, editor: true },
      { name: 'locationObj', width: 150, editor: <Lov noCache /> },
      {
        name: 'enabledFlag',
        width: 100,
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
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
   * @param {*} record 判断是否为新建，新建可编辑
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

  @Bind()
  handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${wmUnit}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${preCode}.view.title.wmUnitImport`).d('货格导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.wmUnitImport`).d('货格导入'),
      }),
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.`).d('货格')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/wm-units/excel`}
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
