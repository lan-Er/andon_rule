/**
 * @Description: 模具管理信息--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-04 14:05:01
 * @LastEditors: yiping.liu
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { Table, Button, Lov, DataSet, TextField, CheckBox, Icon } from 'choerodon-ui/pro';
import { Upload, Tag, Popconfirm } from 'choerodon-ui';
import ExcelExport from 'components/ExcelExport';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject, getAccessToken } from 'utils/utils';
import notification from 'utils/notification';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { HLOS_LMDS, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { deleteFile } from 'hlos-front/lib/services/api';
import { getFileName } from 'hlos-front/lib/utils/utils';

import MouldListDS from '../stores/MouldListDS';

const preCode = 'lmds.mould';
const commonCode = 'hzero.common.button';
const organizationId = getCurrentOrganizationId();
const directory = 'resource-mould';

@formatterCollections({
  code: [`${preCode}`, 'lmds.common'],
})
export default class Mould extends React.Component {
  MouldListDS = new DataSet({
    ...MouldListDS(),
  });

  /**
   *
   * 新建
   * @memberof Mould
   */
  @Bind
  handleCreate() {
    this.MouldListDS.create({}, 0);
  }

  /**
   *
   * 导出
   * @returns
   * @memberof Mould
   */
  @Bind
  getExportQueryParams() {
    const { MouldListDS: ds } = this;
    const queryDataDs = ds && ds.queryDataSet && ds.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  /**
   *
   * 上传成功
   * @param {*} res
   * @memberof Mould
   */
  @Bind()
  async handleSuccess(res) {
    if (res && !res.failed) {
      const { current } = this.MouldListDS;
      current.set('fileUrl', res);
      // 对处于编辑状态的单据(包含新建)自动提交
      if (current.toData() && current.toData().dieId) {
        await this.MouldListDS.submit();
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
   * 删除该图片
   * @param {*} record
   */
  handleDeletePhoto(file) {
    deleteFile({ file, directory });
    this.MouldListDS.current.set('fileUrl', '');
    this.MouldListDS.submit();
  }

  /**
   *
   *下载
   * @param {*} file
   * @memberof Mould
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

  @Bind()
  beforeUpload(file) {
    const isImg = file.type.indexOf('image') !== -1;
    if (!isImg) {
      notification.warning({
        message: intl
          .get('lmds.common.view.message.upload.selectImage')
          .d('请选择图片格式文件上传'),
      });
    }
    return isImg;
  }

  @Bind()
  uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory,
    };
  }

  get columns() {
    const uploadProps = {
      name: 'file',
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      accept: ['image/*'],
      action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
      data: this.uploadData,
      showUploadList: false,
      onSuccess: this.handleSuccess,
      beforeUpload: this.beforeUpload,
    };
    return [
      {
        name: 'organizationObj',
        editor: (record) => {
          return record.status === 'add' ? <Lov noCache /> : null;
        },
        width: 200,
        lock: 'left',
      },
      {
        name: 'dieCode',
        editor: (record) => {
          return record.status === 'add' ? <TextField /> : null;
        },
        width: 150,
        lock: 'left',
      },
      { name: 'dieName', editor: true, width: 150, lock: true },
      { name: 'dieAlias', editor: true, width: 150 },
      { name: 'description', editor: true, width: 150 },
      { name: 'dieType', editor: true, width: 150 },
      {
        name: 'fileUrl',
        width: 150,
        renderer: (record) => {
          return (
            <div>
              {record.value ? (
                <React.Fragment>
                  <Popconfirm
                    okText={intl.get('hzero.common.button.sure').d('确定')}
                    cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                    title={intl
                      .get('lmds.common.view.message.confirm.remove')
                      .d('是否删除此条记录？')}
                    onConfirm={() => this.handleDeletePhoto(record.value)}
                  >
                    <a>
                      <Icon type="delete" />
                    </a>
                  </Popconfirm>
                  <a
                    style={{ marginLeft: '5px' }}
                    title={intl.get('hzero.common.button.download').d('下载')}
                    onClick={() => this.downFile(record.value)}
                  >
                    {getFileName(record.value)}
                  </a>
                </React.Fragment>
              ) : (
                <Tag title="选择本地图片上传">
                  <Upload {...uploadProps}>
                    <a>{intl.get('hzero.common.button.upload').d('上传')}</a>
                  </Upload>
                </Tag>
              )}
            </div>
          );
        },
      },
      { name: 'dieCategoryObj', editor: <Lov noCache />, width: 150 },
      { name: 'dieGroup', editor: true, width: 150 },
      { name: 'ownerObj', editor: <Lov noCache />, width: 150 },
      { name: 'chiefPositionObj', editor: <Lov noCache />, width: 150 },
      { name: 'assetNumber', editor: true, width: 150 },
      { name: 'dieStatus', editor: true, width: 150 },
      { name: 'purchaseDate', editor: true, align: 'center', width: 150 },
      { name: 'startUseDate', editor: true, align: 'center', width: 150 },
      { name: 'supplier', editor: true, width: 150 },
      { name: 'manufacturer', editor: true, width: 150 },
      { name: 'servicePhone', editor: true, width: 150 },
      { name: 'bomObj', editor: <Lov noCache />, width: 150 },
      { name: 'valueCurrencyObj', editor: <Lov noCache />, width: 150 },
      { name: 'initialValue', editor: true, width: 150 },
      { name: 'currentValue', editor: true, width: 150 },
      { name: 'prodLineObj', editor: <Lov noCache />, width: 150 },
      { name: 'equipmentObj', editor: <Lov noCache />, width: 150 },
      { name: 'workCellObj', editor: <Lov noCache />, width: 150 },
      { name: 'warehouseObj', editor: <Lov noCache />, width: 150 },
      { name: 'wmAreaObj', editor: <Lov noCache />, width: 150 },
      { name: 'wmUnitObj', editor: <Lov noCache />, width: 150 },
      { name: 'locationObj', editor: <Lov noCache />, width: 150 },
      { name: 'outsideLocation', editor: true, width: 150 },
      { name: 'dieLifetimeCount', editor: true, width: 150 },
      { name: 'dieUsedCount', editor: true, width: 150 },
      { name: 'planRepairTimes', editor: true, width: 150 },
      { name: 'repairedTimes', editor: true, width: 150 },
      { name: 'nextPlanCount', editor: true, width: 150 },
      { name: 'nextUsedCount', editor: true, width: 150 },
      { name: 'lastRepairedDate', editor: true, align: 'center', width: 150 },
      { name: 'lastRepairedMan', editor: true, width: 150 },
      { name: 'remark', editor: true, width: 150 },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : null),
        width: 150,
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
        <Header title={intl.get(`${preCode}.view.title.mould`).d('模具')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonCode}.create`).d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/dies/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.MouldListDS}
            columns={this.columns}
            editMode="inline"
            selectionMode="click"
          />
        </Content>
      </React.Fragment>
    );
  }
}
