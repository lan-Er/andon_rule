/*
 * @Description: 班组管理信息--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-11 19:59:45
 * @LastEditors: Please set LastEditors
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import formatterCollections from 'utils/intl/formatterCollections';
import { Table, DataSet, TextField, CheckBox, Button, Lov, Icon } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { Upload, Tag, Popconfirm } from 'choerodon-ui';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';

import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile } from 'hlos-front/lib/services/api';
import { HLOS_LMDS, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { getCurrentOrganizationId, filterNullValueObject, getAccessToken } from 'utils/utils';
import statusConfig from '@/common/statusConfig';
import WorkerGroupListDS from '../stores/WorkerGroupListDS';

const intlPrefix = 'lmds.workerGroup';
const commonPrefix = 'lmds.common';
const directory = 'resource-worker-group';
const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';
const {
  importTemplateCode: { workerGroup },
} = statusConfig.statusValue.lmds;

@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class Worker extends Component {
  workerGroupListDS = new DataSet({
    ...WorkerGroupListDS(),
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

  /**
   * 删除该文件
   * @param {*} file 待删除文件
   */
  @Bind()
  handleDeleteFile(file) {
    deleteFile({ file, directory });
    this.workerGroupListDS.current.set('fileUrl', '');
    this.workerGroupListDS.submit();
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

  /**
   * 文件上传回调
   * @param res
   * @returns {Promise<void>}
   */
  @Bind()
  async handleSuccess(res) {
    if (res && !res.failed) {
      const { current } = this.workerGroupListDS;
      current.set('fileUrl', res);
      // 对处于编辑状态的单据(包含新建)自动提交
      if (!current.editing) {
        await this.workerGroupListDS.submit();
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

  get columns() {
    const uploadProps = {
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
        // editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        editor: true,
        width: 200,
        lock: true,
      },
      {
        name: 'workerGroupCode',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
        width: 150,
      },
      { name: 'workerGroupName', editor: true, width: 150, lock: true },
      { name: 'workerGroupAlias', editor: true, width: 150 },
      { name: 'description', editor: true, width: 150 },
      { name: 'workerGroupType', editor: true, width: 150 },
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
                    onConfirm={() => this.handleDeleteFile(file)}
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
                  <Upload {...uploadProps}>
                    <a>{intl.get('hzero.common.button.upload').d('上传')}</a>
                  </Upload>
                </Tag>
              )}
            </div>
          );
        },
      },
      { name: 'workerGroupCategoryObj', editor: true, width: 200 },
      { name: 'departmentObj', editor: <Lov noCache />, width: 200 },
      { name: 'supervisorObj', editor: <Lov noCache />, width: 200 },
      { name: 'chiefPositionObj', editor: <Lov noCache />, width: 200 },
      { name: 'calendarObj', editor: <Lov noCache />, width: 200 },
      { name: 'workerNumber', editor: true, width: 120 },
      { name: 'workerMaxNumber', editor: true, width: 120 },
      { name: 'manageRuleObj', editor: <Lov noCache />, width: 120 },
      { name: 'locationObj', editor: <Lov noCache />, width: 200 },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : null),
        width: 100,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        header: intl.get(`${commonButtonIntlPrefix}.edit`).d('编辑'),
        command: () => ['edit'],
        lock: 'right',
        width: 120,
      },
    ];
  }

  @Bind
  handleCreate() {
    this.workerGroupListDS.create({}, 0);
  }

  @Bind
  getExportQueryParams() {
    const { workerGroupListDS: ds } = this;
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
      key: `/himp/commentImport/${workerGroup}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${intlPrefix}.view.title.workerGroupImport`).d('班组导入'),
      search: queryString.stringify({
        action: intl.get(`${intlPrefix}.view.title.workerGroupImport`).d('班组导入'),
      }),
    });
  }

  render() {
    return (
      <React.Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.workerGroup`).d('班组')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get(`${commonButtonIntlPrefix}.import`).d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/worker-groups/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.workerGroupListDS}
            columns={this.columns}
            editMode="inline"
            columnResizable="true"
            selectionMode="click"
          />
        </Content>
      </React.Fragment>
    );
  }
}
