/*
 * @Description: 资源TPM设置--index
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-12-12 15:05:22
 * @Copyright: Copyright(c) 2019, Hand
 * @LastEditors: TJ
 */
import React, { Component, Fragment } from 'react';
import { Table, Button, DataSet, Lov, Select, CheckBox, Icon } from 'choerodon-ui/pro';
import { Upload, Popconfirm, Tag } from 'choerodon-ui';
import ExcelExport from 'components/ExcelExport';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { downloadFile } from 'services/api';
import notification from 'utils/notification';
import { isUndefined, isEmpty } from 'lodash';
import { Content, Header } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getAccessToken, filterNullValueObject } from 'utils/utils';
import { HZERO_FILE } from 'utils/config';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile } from 'hlos-front/lib/services/api';
import { HLOS_LMDS, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import { resourceTpmDS } from '../stores/ResourceTpmDS';

const organizationId = getCurrentOrganizationId();
const directory = 'resource-tpm';

@formatterCollections({
  code: ['lmds.resourceTpm', 'lmds.common'],
})
export default class ResourceTpmList extends Component {
  constructor(props) {
    super(props);
    this.tableDs = new DataSet(resourceTpmDS());
  }

  /**
   *新建
   *
   * @memberof Resource TPM
   */
  @Bind
  handleCreate() {
    this.tableDs.create({}, 0);
  }

  /**
   * 移除文件
   */
  @Bind()
  handleRemove() {
    this.tableDs.current.set('referenceDocument', '');
  }

  /**
   *
   * @param {*} res 文件上传回调
   */
  @Bind()
  async handleSuccess(res) {
    if (res && !res.failed) {
      const { current } = this.tableDs;
      current.set('referenceDocument', res);
      // 对处于编辑状态的单据(包含新建)自动提交
      if (current.toData() && current.toData().tpmSettingId) {
        await this.tableDs.submit();
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
   * getExportQueryParams - 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const formObj = this.tableDs.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
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
   * 删除该文件
   * @param {*} record
   */
  @Bind()
  handleDeleteFile(file) {
    deleteFile({ file, directory });
    this.tableDs.current.set('referenceDocument', '');
    this.tableDs.submit();
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
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: 'left',
      },
      {
        name: 'resourceTpmType',
        width: 100,
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        lock: 'left',
      },
      {
        name: 'resourceObj',
        width: 150,
        editor: (record) =>
          record.status === 'add' ? (
            <Lov noCache disabled={isEmpty(record.get('organizationObj'))} />
          ) : null,
        lock: 'left',
      },
      {
        name: 'tpmTaskTypeObj',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      {
        name: 'inspectionGroupObj',
        width: 150,
        editor: <Lov noCache />,
      },
      { name: 'tpmFrequency', width: 120, editor: <Select /> },
      {
        name: 'nextTpmDate',
        width: 120,
        align: 'center',
        editor: true,
      },
      {
        name: 'nextTpmTime',
        width: 120,
        align: 'center',
        editor: true,
      },
      { name: 'priority', width: 100, editor: true },
      {
        name: 'referenceDocument',
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
      {
        name: 'tpmGroupObj',
        width: 150,
        editor: <Lov noCache />,
      },
      {
        name: 'tpmManObj',
        width: 100,
        editor: <Lov noCache />,
      },
      { name: 'remark', width: 200, editor: true },
      {
        name: 'enabledFlag',
        width: 100,
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
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

  render() {
    const tableProps = {
      columns: this.columns,
      dataSet: this.tableDs,
      queryFieldsLimit: 3,
      editMode: 'inline',
    };
    return (
      <Fragment>
        <Header title={intl.get('lmds.resourceTpm.view.title.resourceTpm').d('资源TPM设置')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/resource-tpm-settings/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table {...tableProps} />
        </Content>
      </Fragment>
    );
  }
}
