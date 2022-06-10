/*
 * @Author: zhang yang
 * @Description: 工装 index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 20:07:57
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { DataSet, Table, CheckBox, Lov, Button, TextField, Icon } from 'choerodon-ui/pro';
import { Upload, Tag, Popconfirm } from 'choerodon-ui';
import { Button as HButton } from 'hzero-ui';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject, getAccessToken } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { openTab } from 'utils/menuTab';
import queryString from 'query-string';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { downloadFile } from 'services/api';
import { deleteFile } from 'hlos-front/lib/services/api';
import { HZERO_FILE } from 'utils/config';

import { HLOS_LMDS, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { getFileName } from 'hlos-front/lib/utils/utils';
import ToolsListDS from '../stores/ToolsListDS';

const preCode = 'lmds.tool';
const organizationId = getCurrentOrganizationId();
const directory = 'resource-tool';

@connect()
@formatterCollections({
  code: ['lmds.tool', 'lmds.common'],
})
export default class ToolsList extends Component {
  tableDS = new DataSet({
    ...ToolsListDS(),
  });

  @Bind()
  async handleSuccess(res) {
    if (res && !res.failed) {
      const { current } = this.tableDS;
      current.set('fileUrl', res);
      if (current.toData() && current.toData().toolId) {
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
        name: 'organization',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'toolCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'toolName', width: 150, editor: true },
      { name: 'toolAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'toolType', width: 150, editor: true },
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
      { name: 'category', width: 150, editor: <Lov noCache /> },
      { name: 'toolGroup', width: 150, editor: true },
      { name: 'ownerType', width: 150, editor: true },
      { name: 'owner', width: 150, editor: <Lov noCache /> },
      { name: 'chiefPositionObj', width: 150, editor: <Lov noCache /> },
      { name: 'toolStatus', width: 150, editor: true },
      {
        name: 'exclusiveFlag',
        editor: true,
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      { name: 'purchaseDate', width: 150, editor: true, align: 'center' },
      { name: 'startUseDate', width: 150, editor: true, align: 'center' },
      { name: 'expiredDate', width: 150, editor: true, align: 'center' },
      { name: 'supplier', width: 150, editor: true },
      { name: 'manufacturer', width: 150, editor: true },
      { name: 'servicePhone', width: 150, editor: true },
      { name: 'BOM', width: 150, editor: <Lov noCache /> },
      { name: 'valueCurrency', width: 150, editor: <Lov noCache /> },
      { name: 'initialValue', width: 150, editor: true },
      { name: 'currentValue', width: 150, editor: true },
      { name: 'prodLine', width: 150, editor: <Lov noCache /> },
      { name: 'equipment', width: 150, editor: <Lov noCache /> },
      { name: 'workcell', width: 150, editor: <Lov noCache /> },
      { name: 'warehouse', width: 150, editor: <Lov noCache /> },
      { name: 'wmArea', width: 150, editor: <Lov noCache /> },
      { name: 'wmUnit', width: 150, editor: <Lov noCache /> },
      { name: 'location', width: 150, editor: <Lov noCache /> },
      { name: 'outsideLocation', width: 150, editor: true },
      { name: 'cycleCount', width: 150, editor: true },
      { name: 'usedCount', width: 150, editor: true },
      { name: 'nextPlanCount', width: 150, editor: true },
      { name: 'nextUsedCount', width: 150, editor: true },
      { name: 'maintenancedTimes', width: 150, editor: true },
      { name: 'lastTpmDate', width: 150, editor: true, align: 'center' },
      { name: 'lastTpmMan', width: 150, editor: true },
      { name: 'remark', width: 150, editor: true },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
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

  /**
   * 新建
   */
  @Bind()
  handleBatchImport() {
    openTab({
      key: `/himp/commentImport/LMDS_TOOL`,
      title: intl.get(`${preCode}.view.title.import`).d('导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.import`).d('导入'),
      }),
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

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.tool`).d('工装')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/toolss/excel`}
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
