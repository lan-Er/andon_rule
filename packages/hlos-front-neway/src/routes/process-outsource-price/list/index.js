/**
 * @Description: 检验项目管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-19 15:01:56
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, Button, CheckBox } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';

import statusConfig from '@/common/statusConfig';
import { HLOS_LMDSS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import listTableDs from '../stores/listTableDs';

const preCode = 'lmds.inspectionItem';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { processOutsourcePrice },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: ['lmds.inspectionItem', 'lmds.common'],
})
export default class InspectionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  tableDS = new DataSet({
    ...listTableDs(),
  });

  get columns() {
    return [
      { name: 'organizationObj', width: 150, editor: (record) => record.status === 'add' },
      { name: 'itemObj', width: 150, editor: (record) => record.status === 'add' },
      { name: 'itemDescription', width: 150, editor: false },
      { name: 'supplier', width: 150, editor: (record) => record.status === 'add' },
      { name: 'operationObj', width: 150, editor: (record) => record.status === 'add' },
      { name: 'SCMGroup', width: 150, editor: (record) => record.status === 'add' },
      {
        name: 'attributeDecimal1',
        width: 100,
        editor: (record) => record.status === 'add' || record.editing,
      },
      {
        name: 'enabledFlag',
        editor: (record) => (record.status === 'add' ? <CheckBox /> : false),
        width: 100,
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
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.tableDS.create({}, 0);
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

  @Bind
  handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${processOutsourcePrice}`,
        title: intl.get(`${preCode}.view.title.processOutsourcePriceImport`).d('工序外协定价导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.processOutsourcePrice`).d('工序外协定价')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDSS}/v1/${organizationId}/neway-work-prices/excel`}
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
