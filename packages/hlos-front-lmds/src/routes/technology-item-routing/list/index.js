/*
 * @Author: 梁春艳 <chunyan.liang@hand-china.com>
 * @Date: 2019-12-03 10:20:35
 * @LastEditTime: 2019-12-04 20:36:32
 * @Description: 产品工艺路线--Index
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import { Button, Table, DataSet, Lov, CheckBox } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import { isUndefined } from 'lodash';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';
import ItemRoutingListDS from '../stores/ItemRoutingListDS';

const organizationId = getCurrentOrganizationId();
const intlPrefix = `lmds.common`;
const {
  importTemplateCode: { itemRouting },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: [`${intlPrefix}`, 'lmds.itemRouting'],
})
export default class ItemRouting extends React.Component {
  tableDS = new DataSet({
    ...ItemRoutingListDS(),
  });

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.tableDS.create({}, 0);
  }

  /**
   * 导出
   */
  @Bind
  getExportQueryParams() {
    const formObj = this.tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  get columns() {
    return [
      {
        name: 'organizationObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'itemObj',
        width: 150,
        editor: (record) =>
          record.status === 'add' ? <Lov disabled={!record.get('organizationId')} noCache /> : null,
        lock: true,
      },
      { name: 'itemDescription', width: 150 },
      {
        name: 'itemCategoryObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      {
        name: 'routingObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      { name: 'routingDescription', width: 150 },
      {
        name: 'primaryFlag',
        width: 100,
        renderer: yesOrNoRender,
        editor: (record) => (record.editing ? <CheckBox /> : false),
      },
      { name: 'startDate', width: 130, editor: true, align: 'center' },
      { name: 'endDate', width: 130, editor: true, align: 'center' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  @Bind
  handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${itemRouting}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`lmds.itemRouting.view.title.itemRoutingImport`).d('产品工艺路线导入'),
      search: queryString.stringify({
        action: intl.get(`lmds.itemRouting.view.title.itemRoutingImport`).d('产品工艺路线导入'),
      }),
    });
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`lmds.itemRouting.view.title.itemRouting`).d('产品工艺路线')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/item-routings/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} editMode="inline" />
        </Content>
      </Fragment>
    );
  }
}
