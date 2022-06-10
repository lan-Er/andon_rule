/*
 * @Author: 梁春艳 <chunyan.liang@hand-china.com>
 * @Date: 2019-12-03 10:20:35
 * @LastEditTime: 2019-12-04 20:20:14
 * @LastEditors: yu.na
 * @Description: 量具--Index
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import { Button, Table, DataSet, Lov, TextField, CheckBox, Icon } from 'choerodon-ui/pro';
import { Upload, Tag, Popconfirm } from 'choerodon-ui';
import { openTab } from 'utils/menuTab';
import { Button as HButton } from 'hzero-ui';
import notification from 'utils/notification';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import ExcelExport from 'components/ExcelExport';
import queryString from 'query-string';
import { getCurrentOrganizationId, filterNullValueObject, getAccessToken } from 'utils/utils';
import { downloadFile } from 'services/api';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { HZERO_FILE } from 'utils/config';

import { HLOS_LMDS, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile } from 'hlos-front/lib/services/api';
import GaugeListDs from '../stores/GaugeListDS';

const preCode = `lmds.gauge`;
const organizationId = getCurrentOrganizationId();
const directory = 'resource-gauge';

@connect()
@formatterCollections({
  code: ['lmds.gauge', 'lmds.common'],
})
export default class Gauge extends React.Component {
  tableDS = new DataSet({
    ...GaugeListDs(),
  });

  @Bind()
  async handleSuccess(res) {
    if (res && !res.failed) {
      const { current } = this.tableDS;
      current.set('fileUrl', res);
      if (current.toData() && current.toData().gaugeId) {
        await this.tableDS.submit();
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
   * 删除该图片
   * @param {*} record
   */
  handleDeleteFile(file) {
    deleteFile({ file, directory });
    this.tableDS.current.set('fileUrl', '');
    this.tableDS.submit();
  }

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
  @Bind()
  getExportQueryParams() {
    const formObj = this.tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
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
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      accept: ['image/*'],
      action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
      showUploadList: false,
      data: this.uploadData,
      onSuccess: this.handleSuccess,
      beforeUpload: this.beforeUpload,
    };
    return [
      {
        name: 'organizationObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : false),
        lock: true,
      },
      {
        name: 'gaugeCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : false),
        lock: true,
      },
      { name: 'gaugeName', width: 150, editor: true, lock: true },
      { name: 'gaugeAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'gaugeType', width: 150, editor: true },
      {
        name: 'fileUrl',
        width: 150,
        renderer: (record) => {
          const file = record.value;
          return (
            <div>
              {file ? (
                <span className="action-link">
                  <Popconfirm
                    okText={intl.get('hzero.common.button.sure').d('确定')}
                    cancelText={intl.get('hzero.common.button.cancel').d('取消')}
                    title={intl
                      .get('lmds.common.view.message.confirm.remove')
                      .d('是否删除此条记录？')}
                    onConfirm={() => this.handleDeleteFile(file)}
                  >
                    <a>
                      <Icon type="delete" />
                    </a>
                  </Popconfirm>
                  <a
                    style={{ marginLeft: '5px' }}
                    title={intl.get('hzero.common.button.download').d('下载')}
                    onClick={() => this.downFile(file)}
                  >
                    {getFileName(file)}
                  </a>
                </span>
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
      { name: 'gaugeCategoryObj', width: 150, editor: <Lov noCache /> },
      { name: 'gaugeGroup', width: 150, editor: true },
      { name: 'ownerObj', width: 150, editor: <Lov noCache /> },
      { name: 'chiefPositionObj', width: 150, editor: <Lov noCache /> },
      { name: 'assetNumber', width: 150, editor: true },
      { name: 'gaugeStatus', width: 150, editor: true },
      { name: 'purchaseDate', width: 150, editor: true, align: 'center' },
      { name: 'startUseDate', width: 150, editor: true, align: 'center' },
      { name: 'expiredDate', width: 150, editor: true, align: 'center' },
      { name: 'supplier', width: 150, editor: true },
      { name: 'manufacturer', width: 150, editor: true },
      { name: 'servicePhone', width: 150, editor: true },
      { name: 'bomObj', width: 150, editor: <Lov noCache /> },
      { name: 'valueCurrencyObj', width: 150, editor: <Lov noCache /> },
      { name: 'initialValue', width: 150, editor: true },
      { name: 'currentValue', width: 150, editor: true },
      { name: 'prodLineObj', width: 150, editor: <Lov noCache /> },
      { name: 'equipmentObj', width: 150, editor: <Lov noCache /> },
      { name: 'workcellObj', width: 150, editor: <Lov noCache /> },
      { name: 'warehouseObj', width: 150, editor: <Lov noCache /> },
      { name: 'wmAreaObj', width: 150, editor: <Lov noCache /> },
      { name: 'wmUnitObj', width: 150, editor: <Lov noCache /> },
      { name: 'locationObj', width: 150, editor: <Lov noCache /> },
      { name: 'outsideLocation', width: 150, editor: true },
      { name: 'calibrateOrganization', width: 150, editor: true },
      { name: 'gaugeLifetime', width: 150, editor: true },
      { name: 'planCalibrateTimes', width: 150, editor: true },
      { name: 'calibratedTimes', width: 150, editor: true },
      { name: 'calibrateInterval', width: 150, editor: true },
      { name: 'lastCalibratedDate', width: 150, editor: true, align: 'center' },
      { name: 'nextCalibrateDate', width: 150, editor: true, align: 'center' },
      { name: 'lastCalibratedMan', width: 150, editor: true, align: 'center' },
      { name: 'remark', width: 150, editor: true },
      {
        name: 'enabledFlag',
        width: 100,
        renderer: yesOrNoRender,
        editor: (record) => (record.editing ? <CheckBox /> : false),
      },
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
      key: `/himp/commentImport/LMDS_GAUGE`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${preCode}.view.title.equipmentImport`).d('量具导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.equipmentImport`).d('量具导入'),
      }),
    });
  }

  render() {
    const { columns, tableDS } = this;
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.gauge`).d('量具')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/gauges/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table dataSet={tableDS} columns={columns} columnResizable="true" editMode="inline" />
        </Content>
      </Fragment>
    );
  }
}
