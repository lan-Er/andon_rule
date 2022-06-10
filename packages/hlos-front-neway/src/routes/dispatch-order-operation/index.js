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
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import { listTableDs } from '@/stores/dispatchOrderOperationDs';

const preCode = 'neway.dispatchOrderOperation';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { dispatchOrderOperation },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: ['neway.dispatchOrderOperation', 'lmds.common'],
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
      { name: 'documentTypeObj', width: 150, editor: (record) => record.status === 'add' },
      { name: 'costCenterObj', width: 150, editor: (record) => record.status === 'add' },
      { name: 'machineCategoryObj', width: 150, editor: (record) => record.status === 'add' },
      { name: 'caliber', width: 120, editor: (record) => record.status === 'add' },
      {
        name: 'itemObj',
        width: 200,
        editor: (record) => record.status === 'add',
      },
      { name: 'operation', width: 150, editor: (record) => record.status === 'add' },
      {
        name: 'standardWorkTime',
        width: 150,
        editor: (record) => record.status === 'add' || record.editing,
      },
      {
        name: 'enabledFlag',
        editor: (record) => (record.status === 'add' || record.editing ? <CheckBox /> : false),
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
        key: `/himp/commentImport/${dispatchOrderOperation}`,
        title: intl.get(`${preCode}.view.title.dispatchOrderOperationImport`).d('派工单工序导入'),
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
        <Header title={intl.get(`${preCode}.view.title.dispatchOrderOperation`).d('派工单工序')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMESS}/v1/${organizationId}/neway-non-product-worker-times/export`}
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
