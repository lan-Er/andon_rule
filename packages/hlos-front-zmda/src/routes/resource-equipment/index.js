/*
 * @Author: zilong.wei01@hand-china.com
 * @Date: 2020-09-29 09:44:41
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-29 09:51:01
 * @Description: 制造协同-设备
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { DataSet, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { downloadFile } from 'services/api';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { BUCKET_NAME_MDS, HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import EquipmentListDS from './store/EquipmentListDS';

const intlPrefix = 'zmda.equipment';
const commonPrefix = 'zmda.common';
const directory = 'resource-equipment';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class ZmdaEquipment extends Component {
  equipmentListDS = new DataSet({
    ...EquipmentListDS(this.props),
  });

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
        name: 'equipmentCode',
        width: 150,
        lock: true,
      },
      { name: 'equipmentName', width: 150, lock: true },
      { name: 'equipmentAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'equipmentType', width: 150 },
      {
        name: 'fileUrl',
        width: 150,
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
      { name: 'categoryName', width: 150 },
      { name: 'prodLineName', width: 150 },
      { name: 'workcellName', width: 150 },
      { name: 'unitName', width: 150 },
      { name: 'chiefPosition', width: 150 },
      { name: 'calendarName', width: 150 },
      { name: 'assetNumber', width: 150 },
      { name: 'equipmentStatus', width: 150 },
      { name: 'purchaseDate', width: 150, align: 'center' },
      { name: 'startUseDate', width: 150, align: 'center' },
      { name: 'supplier', width: 150 },
      { name: 'manufacturer', width: 150 },
      { name: 'nameplateNumber', width: 150 },
      { name: 'servicePhone', width: 150 },
      { name: 'maintenanceInterval', width: 150 },
      { name: 'maintenanceNeedDays', width: 150 },
      { name: 'maintenancedTimes', width: 150 },
      { name: 'lastTpmDate', width: 150 },
      { name: 'lastTpmManName', width: 150 },
      { name: 'nextTpmStartDate', width: 150 },
      { name: 'nextTpmEndDate', width: 150 },
      { name: 'breakdownTimes', width: 150 },
      { name: 'lastBreakdowmDate', width: 150 },
      { name: 'lastRepairedDate', width: 150 },
      { name: 'lastRepairedManName', width: 150 },
      { name: 'bomName', width: 150 },
      { name: 'valueCurrencyName', width: 150 },
      { name: 'initialValue', width: 150 },
      { name: 'currentValue', width: 150 },
      { name: 'locationName', width: 150 },
      { name: 'outsideLocation', width: 150 },
      { name: 'remark', width: 150 },
      {
        name: 'enabledFlag',
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
    ];
  }

  @Bind
  getExportQueryParams() {
    const { equipmentListDS: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      // tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    const { equipmentListDS } = this;
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.equipment`).d('设备')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/equipment-views/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table dataSet={equipmentListDS} pagination columns={this.columns} />
        </Content>
      </Fragment>
    );
  }
}
