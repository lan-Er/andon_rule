/*
 * @Author: zhang yang
 * @Description: 物料bom - Index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-20 16:38:03
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { DataSet, Table, CheckBox, Lov, Button } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';

import statusConfig from '@/common/statusConfig';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

import BomListDs from '../stores/BomListDs';

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.itemBom';
const {
  importTemplateCode: { itemBom },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: ['lmds.itemBom', 'lmds.common'],
})
export default class ItemBomList extends Component {
  tableDS = new DataSet({
    ...BomListDs(),
  });

  get columns() {
    return [
      {
        name: 'organization',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      {
        name: 'item',
        width: 150,
        editor: (record) =>
          record.status === 'add' ? (
            <Lov noCache disabled={isEmpty(record.get('organization'))} />
          ) : null,
      },
      { name: 'itemDescription', width: 150, editor: false },
      {
        name: 'itemCategory',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      {
        name: 'bom',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      { name: 'bomDescription', width: 150, editor: false },
      {
        name: 'primaryFlag',
        align: 'center',
        width: 100,
        editor: (record) => (record.editing ? <CheckBox /> : false),
        renderer: yesOrNoRender,
      },
      {
        name: 'startDate',
        editor: true,
        width: 150,
        align: 'center',
      },
      { name: 'endDate', width: 150, editor: true, align: 'center' },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
        align: 'center',
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

  @Bind
  handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${itemBom}`,
        title: intl.get(`${preCode}.view.title.itemBomImport`).d('物料BOM导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  @Bind
  getExportQueryParams() {
    const { tableDS: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      // tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.itemBom`).d('物料BOM')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/item-boms/excel`}
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
