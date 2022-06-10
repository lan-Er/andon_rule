/*
 * @Description: 操作工管理信息--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-12 15:05:39
 * @LastEditors: Please set LastEditors
 */

import React from 'react';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getAccessToken, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Table, DataSet, TextField, CheckBox, Lov, Button, Icon } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { Upload, Tag, Popconfirm } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile } from 'hlos-front/lib/services/api';
import { HLOS_LMDS, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import statusConfig from '@/common/statusConfig';
import WorkerListDs from '../stores/WorkerListDs';

const intlPrefix = 'lmds.worker';
const commonPrefix = 'lmds.common';
const directory = 'resource-worker';
const organizationId = getCurrentOrganizationId();
const commonButtonIntlPrefix = 'hzero.common.button';
const {
  importTemplateCode: { worker },
} = statusConfig.statusValue.lmds;

@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class Worker extends React.Component {
  workerListDs = new DataSet({
    ...WorkerListDs(),
  });

  @Bind
  handlePositionLovClick(record) {
    if (!isEmpty(record.get('departmentObj'))) {
      return true;
    } else {
      return <Lov onClick={() => notification.warning({ message: '请先选择部门' })} />;
    }
  }

  @Bind
  handleWorkerGroupLovClick(record) {
    if (!isEmpty(record.get('organizationId'))) {
      return true;
    } else {
      return <Lov onClick={() => notification.warning({ message: '请先选择组织' })} noCache />;
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
  handleDeleteFile(file) {
    deleteFile({ file, directory });
    this.workerListDs.current.set('fileUrl', '');
    this.workerListDs.submit();
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
      const { current } = this.workerListDs;
      current.set('fileUrl', res);
      // 对处于编辑状态的单据(包含新建)自动提交
      if (!current.editing) {
        await this.workerListDs.submit();
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
        // editor: (record) => {
        //   return record.status === 'add' ? <Lov noCache /> : null;
        // },
        editor: true,
        width: 200,
        lock: true,
      },
      {
        name: 'workerCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'workerName', editor: true, width: 150, lock: true },
      { name: 'workerAlias', editor: true, width: 150 },
      { name: 'description', editor: true, width: 150 },
      { name: 'workerType', editor: true, width: 150 },
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
      { name: 'categoryObj', editor: <Lov noCache />, width: 200 },
      { name: 'departmentObj', editor: <Lov noCache />, width: 200 },
      { name: 'chiefPositionObj', editor: this.handlePositionLovClick, width: 200 },
      { name: 'workerGroupObj', editor: this.handleWorkerGroupLovClick, width: 200 },
      { name: 'sex', editor: true, width: 150 },
      { name: 'birthDate', editor: true, width: 130, align: 'center' },
      { name: 'workerLevel', editor: true, width: 150 },
      { name: 'entryDate', editor: true, width: 130, align: 'center' },
      { name: 'phoneNumber', editor: true, width: 150 },
      { name: 'phoneAreaCode', editor: true, width: 150 },
      { name: 'email', editor: true, width: 150 },
      { name: 'homeAddress', editor: true, width: 150 },
      { name: 'certificateType', editor: true, width: 150 },
      { name: 'certificateId', editor: true, width: 150 },
      { name: 'startDate', editor: true, width: 130, align: 'center' },
      { name: 'endDate', editor: true, width: 130, align: 'center' },
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
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  @Bind
  handleCreate() {
    this.workerListDs.create({}, 0);
  }

  @Bind
  getExportQueryParams() {
    const { workerListDs: ds } = this;
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
      key: `/himp/commentImport/${worker}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${intlPrefix}.view.title.workerImport`).d('操作工导入'),
      search: queryString.stringify({
        action: intl.get(`${intlPrefix}.view.title.workerImport`).d('操作工导入'),
      }),
    });
  }

  render() {
    return (
      <React.Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.worker`).d('操作工')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get(`${commonButtonIntlPrefix}.create`).d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get(`${commonButtonIntlPrefix}.button.import`).d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/workers/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.workerListDs}
            columns={this.columns}
            editMode="inline"
            selectionMode="click"
            autoHeight
          />
        </Content>
      </React.Fragment>
    );
  }
}
