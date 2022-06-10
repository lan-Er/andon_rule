/*
 * @Description: 资源管理信息--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-08 16:47:30
 * @LastEditors: Please set LastEditors
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import { DataSet, Table, CheckBox, TextField, Lov, Icon, Button } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { Upload, Tag, Popconfirm } from 'choerodon-ui';
import { getCurrentOrganizationId, filterNullValueObject, getAccessToken } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import { CustBoxC7N as CustButton, WithCustomizeC7N as WithCustomize } from 'components/Customize';

import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile } from 'hlos-front/lib/services/api';
import { HLOS_LMDS, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';
import EquipmentListDS from '../store/EquipmentListDS';

const intlPrefix = 'lmds.equipment';
const commonPrefix = 'lmds.common';
const directory = 'resource-equipment';
const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';
const {
  importTemplateCode: { equipment },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
@WithCustomize({
  unitCode: ['LMDS.EQUIPMENT.FROM', 'LMDS.EQUIPMENT.TABLE'],
})
export default class Equipment extends Component {
  equipmentListDS = new DataSet({
    ...EquipmentListDS(this.props),
  });

  /**
   * 文件上传回调
   * @param res
   * @returns {Promise<void>}
   */
  @Bind()
  async handleSuccess(res, type) {
    if (res && !res.failed) {
      const { current } = this.equipmentListDS;
      current.set(`${type}`, res);
      // 对处于编辑状态的单据(包含新建)自动提交
      if (!current.editing) {
        await this.equipmentListDS.submit();
        notification.success({
          message: '上传成功',
        });
      }
    } else {
      notification.error({
        message: '上传失败',
      });
    }
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

  /**
   * 删除该文件
   * @param {*} file 待删除文件
   */
  @Bind()
  handleDeleteFile(file, type) {
    deleteFile({ file, directory });
    this.equipmentListDS.current.set(`${type}`, '');
    this.equipmentListDS.submit();
  }

  @Bind()
  uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory,
    };
  }

  @Bind()
  uploadProps(type) {
    return {
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      accept: type === 'fileUrl' ? 'image/*' : '*',
      action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
      data: this.uploadData,
      showUploadList: false,
      onSuccess: (res) => this.handleSuccess(res, type),
      beforeUpload(file) {
        if (!file.type.startsWith('image') && type === 'fileUrl') {
          notification.warning({
            message: intl
              .get('lmds.common.view.message.only.image.attachment.support')
              .d('附件只支持图片类型'),
          });
          return false;
        }
      },
    };
  }

  get columns() {
    return [
      {
        name: 'organizationObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 150,
        lock: true,
      },
      {
        name: 'equipmentCode',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        width: 150,
        lock: true,
      },
      { name: 'equipmentName', editor: true, width: 150, lock: true },
      { name: 'equipmentAlias', editor: true, width: 150 },
      { name: 'description', editor: true, width: 150 },
      { name: 'equipmentType', editor: true, width: 150 },
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
                  <Popconfirm
                    okText={intl.get('hzero.common.button.sure').d('确定')}
                    cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                    title={intl
                      .get('lmds.common.view.message.confirm.remove')
                      .d('是否删除此条记录？')}
                    onConfirm={() => this.handleDeleteFile(file, 'fileUrl')}
                  >
                    <a>
                      <Icon type="delete" />
                    </a>
                  </Popconfirm>
                  <a
                    style={{ marginLeft: '5px' }}
                    title={intl.get('hzero.common.button.download').d('下载')}
                    onClick={() => this.downloadFile(file)}
                  >
                    {getFileName(file)}
                  </a>
                </span>
              ) : (
                <Tag title="选择本地图片上传">
                  <Upload {...this.uploadProps('fileUrl')}>
                    <a>{intl.get('hzero.common.button.upload').d('上传')}</a>
                  </Upload>
                </Tag>
              )}
            </div>
          );
        },
      },
      { name: 'equipmentCategoryObj', editor: <Lov noCache />, width: 150 },
      { name: 'prodLineObj', editor: <Lov noCache />, width: 150 },
      { name: 'workcellObj', editor: <Lov noCache />, width: 150 },
      { name: 'workerGroupObj', editor: <Lov noCache />, width: 150 },
      { name: 'workerObj', editor: <Lov noCache />, width: 150 },
      { name: 'tpmGroupObj', editor: <Lov noCache />, width: 150 },
      { name: 'tpmWorkerObj', editor: <Lov noCache />, width: 150 },
      { name: 'ownerObj', editor: <Lov noCache />, width: 150 },
      { name: 'chiefPositionObj', editor: <Lov noCache />, width: 150 },
      { name: 'departmentObj', editor: <Lov noCache />, width: 150 },
      { name: 'supervisorObj', editor: <Lov noCache placeholder="责任人" />, width: 150 },
      { name: 'calendarObj', editor: <Lov noCache />, width: 150 },
      { name: 'assetNumber', editor: true, width: 150 },
      { name: 'equipmentStatus', editor: true, width: 150 },
      { name: 'purchaseDate', editor: true, width: 150, align: 'center' },
      { name: 'startUseDate', editor: true, width: 150, align: 'center' },
      { name: 'supplier', editor: true, width: 150 },
      { name: 'manufacturer', editor: true, width: 150 },
      { name: 'nameplateNumber', editor: true, width: 150 },
      { name: 'servicePhone', editor: true, width: 150 },
      { name: 'maintenanceInterval', editor: true, width: 150 },
      { name: 'maintenanceNeedDays', editor: true, width: 150 },
      { name: 'maintenancedTimes', width: 150 },
      { name: 'lastTpmDate', width: 150 },
      { name: 'lastTpmManName', width: 150 },
      { name: 'nextTpmStartDate', width: 150 },
      { name: 'nextTpmEndDate', width: 150 },
      { name: 'breakdownTimes', width: 150 },
      { name: 'lastBreakdowmDate', width: 150 },
      { name: 'lastRepairedDate', width: 150 },
      { name: 'lastRepairedManName', width: 150 },
      { name: 'bomObj', editor: <Lov noCache />, width: 150 },
      { name: 'valueCurrencyObj', editor: <Lov noCache />, width: 150 },
      { name: 'initialValue', editor: true, width: 150 },
      { name: 'currentValue', editor: true, width: 150 },
      { name: 'locationObj', editor: <Lov noCache />, width: 150 },
      { name: 'outsideLocation', editor: true, width: 150 },
      { name: 'remark', editor: true, width: 150 },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'referenceDocument',
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
                  <Popconfirm
                    okText={intl.get('hzero.common.button.sure').d('确定')}
                    cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                    title={intl
                      .get('lmds.common.view.message.confirm.remove')
                      .d('是否删除此条记录？')}
                    onConfirm={() => this.handleDeleteFile(file, 'referenceDocument')}
                  >
                    <a>
                      <Icon type="delete" />
                    </a>
                  </Popconfirm>
                  <a
                    style={{ marginLeft: '5px' }}
                    title={intl.get('hzero.common.button.download').d('下载')}
                    onClick={() => this.downloadFile(file)}
                  >
                    {getFileName(file)}
                  </a>
                </span>
              ) : (
                <Tag title="选择本地图片上传">
                  <Upload {...this.uploadProps('referenceDocument')}>
                    <a>{intl.get('hzero.common.button.upload').d('上传')}</a>
                  </Upload>
                </Tag>
              )}
            </div>
          );
        },
      },
      { name: 'instruction', editor: true, width: 150 },
      {
        name: 'drawingCode',
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
                  <Popconfirm
                    okText={intl.get('hzero.common.button.sure').d('确定')}
                    cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                    title={intl
                      .get('lmds.common.view.message.confirm.remove')
                      .d('是否删除此条记录？')}
                    onConfirm={() => this.handleDeleteFile(file, 'drawingCode')}
                  >
                    <a>
                      <Icon type="delete" />
                    </a>
                  </Popconfirm>
                  <a
                    style={{ marginLeft: '5px' }}
                    title={intl.get('hzero.common.button.download').d('下载')}
                    onClick={() => this.downloadFile(file)}
                  >
                    {getFileName(file)}
                  </a>
                </span>
              ) : (
                <Tag title="选择本地图片上传">
                  <Upload {...this.uploadProps('drawingCode')}>
                    <a>{intl.get('hzero.common.button.upload').d('上传')}</a>
                  </Upload>
                </Tag>
              )}
            </div>
          );
        },
      },
      {
        header: intl.get(`${commonButtonIntlPrefix}.action`).d('操作'),
        command: ['edit'],
        lock: 'right',
        width: 120,
        align: 'center',
      },
    ];
  }

  @Bind
  handleCreate() {
    this.equipmentListDS.create({}, 0);
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

  @Bind
  handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${equipment}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${intlPrefix}.view.title.equipmentImport`).d('设备导入'),
      search: queryString.stringify({
        action: intl.get(`${intlPrefix}.view.title.equipmentImport`).d('设备导入'),
      }),
    });
  }

  render() {
    const { equipmentListDS } = this;
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.equipment`).d('设备')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get(`${commonButtonIntlPrefix}.import`).d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/equipments/excel`}
            queryParams={this.getExportQueryParams}
          />
          <CustButton
            unit={[
              {
                code: 'LMDS.EQUIPMENT.FROM', // 单元编码，必传
              },
              {
                code: 'LMDS.EQUIPMENT.TABLE', // 单元编码，必传
              },
            ]}
          />
        </Header>
        <Content>
          {this.props.customizeTable(
            {
              code: 'LMDS.EQUIPMENT.TABLE', // 单元编码，必传
              filterCode: 'LMDS.EQUIPMENT.FROM',
            },
            <Table
              dataSet={equipmentListDS}
              // queryFieldsLimit={2}
              pagination
              editMode="inline"
              selectionMode="click"
              columns={this.columns}
            />
          )}
        </Content>
      </Fragment>
    );
  }
}
