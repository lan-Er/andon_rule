/*
 * @Author: zilong.wei01@hand-china.com
 * @Date: 2020-09-28 10:34:00
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-28 17:20:53
 * @Description: 制造协同-工作单元
 */

import React, { Component, Fragment } from 'react';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import { DataSet, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { downloadFile } from 'services/api';
import { BUCKET_NAME_MDS, HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { getFileName } from 'hlos-front/lib/utils/utils';
import WorkcellListDS from './store/WorkcellListDS';

const preCode = 'zmda.workcell';
const directory = 'resource-workcell';
const organizationId = getCurrentOrganizationId();

export default class ZmdaWorkcell extends Component {
  tableDS = new DataSet({
    ...WorkcellListDS(),
  });

  /**
   * 下载
   * @param {object} record - 参考文档
   */
  downFile(file) {
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
        name: 'workcellCode',
        width: 150,
        lock: true,
      },
      { name: 'workcellName', width: 150, lock: true },
      { name: 'workcellAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'workcellType', width: 150 },
      { name: 'categoryName', width: 150 },
      { name: 'proLineName', width: 150 },
      { name: 'workerQty', width: 150 },
      { name: 'calendarName', width: 150 },
      { name: 'positionName', width: 150 },
      {
        name: 'fileUrl',
        width: 150,
        renderer: (record) => {
          const file = record.value;
          return (
            <div>
              {file ? (
                <span className="action-link">
                  <a
                    style={{ marginLeft: '5px' }}
                    title={intl.get('hzero.common.button.download').d('下载')}
                    onClick={() => this.downFile(file)}
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
      { name: 'issueWarehouse', width: 150 },
      { name: 'issueWmArea', width: 150 },
      { name: 'completeWarehouse', width: 150 },
      { name: 'completeWmArea', width: 150 },
      { name: 'inventoryWarehouse', width: 150 },
      { name: 'inventoryWmArea', width: 150 },
      { name: 'locationName', width: 150 },
      {
        name: 'enabledFlag',
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
    ];
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.wkc`).d('工作单元')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/workcell-views/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} columnResizable="true" />
        </Content>
      </Fragment>
    );
  }
}
