/*
 * @Description: 生产线管理信息--Index
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-11 19:59:45
 * @LastEditors: 赵敏捷
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { Table, DataSet, TextField, CheckBox, Lov, Button, Icon } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { Popconfirm, Tag, Upload } from 'choerodon-ui';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject, getAccessToken } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';

import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile } from 'hlos-front/lib/services/api';
import { HLOS_LMDS, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import ProdLineDS from '../stores/ProdLineDS';

const intlPrefix = 'lmds.prodLine';
const directory = 'resource-prod-line';
const organizationId = getCurrentOrganizationId();

@formatterCollections({
  code: [`${intlPrefix}`, 'lmds.common'],
})
export default class ProdLine extends Component {
  prodLineDs = new DataSet({
    ...ProdLineDS(),
    autoQuery: true,
  });

  /**
   * 创建
   */
  @Bind
  handleCreate() {
    this.prodLineDs.create({}, 0);
  }

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

  @Bind
  handleBatchExport() {
    try {
      openTab({
        // 编码是后端给出的
        key: `/himp/commentImport/LMDS.PROD_LINE`,
        // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
        title: intl.get(`${intlPrefix}.view.title.prodLineImport`).d('生产线导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
          // tenantId: getCurrentOrganizationId(),
          // prefixPath: '/limp',
          // templateType: 'C',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
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
    this.prodLineDs.current.set('fileUrl', '');
    this.prodLineDs.submit();
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
      const { current } = this.prodLineDs;
      current.set('fileUrl', res);
      // 对处于编辑状态的单据(包含新建)自动提交
      if (!current.editing) {
        await this.prodLineDs.submit();
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
        width: 150,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'prodLineCode',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        lock: true,
      },
      { name: 'prodLineName', width: 150, editor: true, lock: true },
      { name: 'prodLineAlias', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'prodLineType', width: 150, editor: true },
      { name: 'categoryObj', width: 200, editor: <Lov noCache /> },
      { name: 'partyObj', width: 150, editor: <Lov noCache /> },
      { name: 'workerQty', width: 100, editor: true },
      { name: 'calendarObj', width: 200, editor: <Lov noCache /> },
      { name: 'chiefPositionObj', width: 200, editor: <Lov noCache /> },
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
      { name: 'issueWarehouseObj', width: 200, editor: <Lov noCache /> },
      { name: 'issueWmAreaObj', width: 200, editor: <Lov noCache /> },
      { name: 'completeWarehouseObj', width: 200, editor: <Lov noCache /> },
      { name: 'completeWmAreaObj', width: 200, editor: <Lov noCache /> },
      { name: 'inventoryWarehouseObj', width: 200, editor: <Lov noCache /> },
      { name: 'inventoryWmAreaObj', width: 200, editor: <Lov noCache /> },
      { name: 'locationNameObj', width: 200, editor: <Lov noCache /> },
      {
        name: 'enabledFlag',
        width: 100,
        align: 'center',
        editor: (record) => (record.editing ? <CheckBox /> : null),
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
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.prod.line`).d('生产线')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/production-lines/excel`}
            queryParams={this.getExportQueryParams}
          />
        </Header>
        <Content>
          <Table
            dataSet={this.prodLineDs}
            columns={this.columns}
            selectionMode="click"
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
