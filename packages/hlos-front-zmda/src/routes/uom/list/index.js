/**
 * @Description: 基础数据-单位
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-12 16:54:59
 */

import { connect } from 'dva';
// import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import React, { Component, Fragment } from 'react';
// import { Button as HButton } from 'hzero-ui';
import { DataSet, Table, CheckBox, TextField, Select, Button } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
// import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
// import { openTab } from 'utils/menuTab';
import formatterCollections from 'utils/intl/formatterCollections';
// import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
// import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import UomListDS from '../store/UomDS';

const preCode = 'zmda.common';
// const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['zmda.uom', 'zmda.common'],
})
export default class ZmdaUom extends Component {
  tableDS = new DataSet({
    ...UomListDS(),
  });

  get columns() {
    return [
      {
        name: 'uomClass',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        lock: true,
      },
      {
        name: 'uomCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'uomName', width: 150, editor: true, lock: true },
      { name: 'description', width: 150, editor: true },
      {
        name: 'primaryFlag',
        width: 150,
        align: 'center',
        editor: <CheckBox dataSet={this.tableDS} name="primaryFlag" />,
      },
      { name: 'conversionRate', width: 150, editor: true },
      { name: 'decimalNumber', width: 150, editor: true },
      { name: 'externalUom', width: 150, editor: true },
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
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.tableDS.create({}, 0);
  }

  /**
   * 获取导出字段查询参数
   */
  // @Bind()
  // getExportQueryParams() {
  //   const formObj = this.tableDS.queryDataSet.current;
  //   const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
  //   return {
  //     ...fieldsValue,
  //   };
  // }

  // @Bind()
  // handleBatchImport() {
  //   openTab({
  //     key: `/himp/commentImport/LMDS.UOM`,
  //     title: '单位导入',
  //   });
  // }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.uom`).d('单位')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          {/* <HButton icon="upload" onClick={this.handleBatchImport}>
            导入
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/uoms/excel`}
            queryParams={this.getExportQueryParams}
          /> */}
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
