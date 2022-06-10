/**
 * @Description: 容器类型管理信息--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-10 13:56:05
 * @LastEditors: yiping.liu
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { Button, Table, Select, CheckBox, DataSet, TextField } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ContainerTypeDS from '../stores/ContainerTypeDS';

const preCode = 'lmds.containerType';
const commonCode = 'hzero.common.button';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${preCode}`, 'lmds.common'],
})
export default class ContainerType extends React.Component {
  containerTypeDS = new DataSet({
    ...ContainerTypeDS(),
  });

  /**
   *新建
   *
   * @memberof ResourceCapacity
   */
  @Bind
  handleCreate() {
    this.containerTypeDS.create({}, 0);
  }

  /**
   *导出
   *
   * @returns
   * @memberof ResourceCapacity
   */
  @Bind
  getExportQueryParams() {
    const { containerTypeDS: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  get columns() {
    return [
      {
        name: 'containerClass',
        editor: record => {
          return record.status === 'add' ? <Select /> : null;
        },
        width: 200,
        lock: 'left',
      },
      {
        name: 'containerTypeCode',
        editor: record => {
          return record.status === 'add' ? <TextField noCache /> : null;
        },
        width: 200,
        lock: 'left',
      },
      {
        name: 'containerTypeName',
        editor: true,
        width: 150,
        lock: 'left',
      },
      {
        name: 'containerTypeAlias',
        editor: true,
        width: 150,
      },
      {
        name: 'description',
        editor: true,
        width: 200,
      },
      {
        name: 'containerTypeCategory',
        editor: true,
        width: 150,
      },
      {
        name: 'organizationObj',
        editor: true,
        width: 200,
      },
      {
        name: 'cycleUseFlag',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'exclusiveFlag',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'length',
        editor: true,
        width: 100,
      },
      {
        name: 'width',
        editor: true,
        width: 100,
      },
      {
        name: 'height',
        editor: true,
        width: 100,
      },
      {
        name: 'containerWeight',
        editor: true,
        width: 100,
      },
      {
        name: 'maxVolume',
        editor: true,
        width: 100,
      },
      {
        name: 'maxWeight',
        editor: true,
        width: 100,
      },
      {
        name: 'maxItemQty',
        editor: true,
        width: 100,
      },
      {
        name: 'multiItemEnable',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'multiLotEnable',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'loadMethod',
        editor: true,
        width: 150,
      },
      {
        name: 'enabledFlag',
        editor: record => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        header: intl.get(`${commonCode}.action`).d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  render() {
    return (
      <React.Fragment>
        <Header title={intl.get(`${preCode}.view.title.containerType`).d('容器类型')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonCode}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/container-types/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.containerTypeDS}
            columns={this.columns}
            editMode="inline"
            selectionMode="click"
          />
        </Content>
      </React.Fragment>
    );
  }
}
