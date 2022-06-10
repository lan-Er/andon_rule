/*
 * @Author: zilong.wei01@hand-china.com
 * @Date: 2020-09-29 09:44:41
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-29 10:16:28
 * @Description: 制造协同-生产线
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { Table, DataSet } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { downloadFile } from 'services/api';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { HLOS_ZMDA, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import ProdLineDS from './store/ProdLineDS';

const intlPrefix = 'zmda.prodLine';
const directory = 'resource-prod-line';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${intlPrefix}`, 'zmda.common'],
})
export default class ZmdaProdLine extends Component {
  prodLineDs = new DataSet({
    ...ProdLineDS(),
    autoQuery: true,
  });

  /**
   * 获取导出参数
   * @returns {{tenantId: *}}
   */
  @Bind
  getExportQueryParams() {
    const { prodLineDs: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  /**
   * 下载
   * @param {object} file - 文件
   */
  downloadFile(file) {
    const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: BUCKET_NAME_MDS },
        { name: 'directory', value: directory },
        { name: 'url', value: file },
      ],
    });
  }

  get columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      {
        name: 'organizationName',
        width: 150,
        lock: true,
      },
      {
        name: 'prodLineCode',
        width: 150,
        lock: true,
      },
      { name: 'prodLineName', width: 150, lock: true },
      { name: 'prodLineAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'prodLineType', width: 150 },
      { name: 'categoryName', width: 200 },
      { name: 'partyName', width: 150 },
      { name: 'workerQty', width: 100 },
      { name: 'calendarName', width: 200 },
      { name: 'positionName', width: 200 },
      {
        name: 'fileUrl',
        renderer: (record) => {
          const file = record.value;
          return (
            <div>
              {file ? (
                <span
                  className="action-link"
                  style={{
                    display: 'block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <a
                    style={{ marginLeft: '5px' }}
                    title={intl.get('hzero.common.button.download').d('下载')}
                    onClick={() => this.downloadFile(file)}
                  >
                    {getFileName(file)}
                  </a>
                </span>
              ) : (
                ''
              )}
            </div>
          );
        },
      },
      { name: 'issueWarehouse', width: 200 },
      { name: 'issueWmArea', width: 200 },
      { name: 'completeWarehouse', width: 200 },
      { name: 'completeWmArea', width: 200 },
      { name: 'inventoryWarehouse', width: 200 },
      { name: 'inventoryWmArea', width: 200 },
      { name: 'locationName', width: 200 },
      {
        name: 'enabledFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
    ];
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.prod.line`).d('生产线')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/production-line-views/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table dataSet={this.prodLineDs} columns={this.columns} />
        </Content>
      </Fragment>
    );
  }
}
