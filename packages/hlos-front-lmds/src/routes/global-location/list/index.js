/*
 * @Description: 地理位置管理信息--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-13 15:05:22
 * @LastEditors: 赵敏捷
 */
import * as React from 'react';
import { DataSet, Table, TextField, Button, CheckBox } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';
import LocationListDS from '../stores/LocationListDS';

const intlPrefix = 'lmds.location';
const commonPrefix = 'lmds.common';
const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';
const {
  importTemplateCode: { location },
} = statusConfig.statusValue.lmds;

@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class MeOuList extends React.Component {
  locationListDS = new DataSet({
    ...LocationListDS(),
  });

  get columns() {
    return [
      {
        name: 'locationCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'locationName', width: 150, editor: true, lock: true },
      { name: 'locationAlias', width: 150, editor: true, lock: true },
      { name: 'description', width: 150, editor: true },
      { name: 'locationType', width: 150, editor: true },
      { name: 'gpsInfo', width: 150, editor: true },
      {
        name: 'enabledFlag',
        width: 100,
        editor: (record) => (record.editing ? <CheckBox /> : null),
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        header: intl.get(`${commonButtonIntlPrefix}.action`).d('操作'),
        width: 120,
        command: () => ['edit'],
        lock: 'right',
      },
    ];
  }

  @Bind
  handleCreate() {
    this.locationListDS.create({}, 0);
  }

  @Bind
  getExportQueryParams() {
    const { locationListDS: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  @Bind
  handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${location}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${intlPrefix}.view.title.locationImport`).d('地理位置导入'),
      search: queryString.stringify({
        action: intl.get(`${intlPrefix}.view.title.locationImport`).d('地理位置导入'),
      }),
    });
  }

  render() {
    const { locationListDS } = this;
    return (
      <React.Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.location`).d('地理位置')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/locations/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            editMode="inline"
            key="enemy"
            columns={this.columns}
            dataSet={locationListDS}
            columnResizable
          />
        </Content>
      </React.Fragment>
    );
  }
}
