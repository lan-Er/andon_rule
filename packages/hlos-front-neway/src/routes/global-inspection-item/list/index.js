/**
 * @Description: 检验项目管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-19 15:01:56
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { Upload, Popconfirm, Tag } from 'choerodon-ui';
import { DataSet, Table, CheckBox, TextField, Button, Lov, Icon } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { getCurrentOrganizationId, filterNullValueObject, getAccessToken } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import notification from 'utils/notification';
import { HZERO_FILE } from 'utils/config';
import { downloadFile } from 'services/api';
import { deleteFile } from 'hlos-front/lib/services/api';

import statusConfig from '@/common/statusConfig';
import { HLOS_LMDSS, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { getFileName } from 'hlos-front/lib/utils/utils';

import InspectionItemListDS from '../stores/InspectionItemListDS';

const preCode = 'lmds.inspectionItem';
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { inspectionItem },
} = statusConfig.statusValue.lmds;

@connect()
@formatterCollections({
  code: ['lmds.inspectionItem', 'lmds.common'],
})
export default class InspectionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  tableDS = new DataSet({
    ...InspectionItemListDS(),
  });

  /**
   * 文件上传回调
   * @param res
   * @returns {Promise<void>}
   */
  @Bind()
  async handleSuccess(res) {
    if (res && !res.failed) {
      const { current } = this.tableDS;
      current.set('drawingCode', res);
      // 对处于编辑状态的单据(包含新建)自动提交
      if (!current.editing) {
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
   * @param {object} file - 文件
   */
  downloadFile(file) {
    const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: BUCKET_NAME_MDS },
        { name: 'directory', value: 'global-inspection-item' },
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
    deleteFile({ file, directory: 'global-inspection-item' });
    this.tableDS.current.set('drawingCode', '');
    this.tableDS.submit();
  }

  uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory: 'global-inspection-item',
    };
  };

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
      beforeUpload(file) {
        if (!file.type.startsWith('image')) {
          notification.warning({
            message: intl
              .get('lmds.common.view.message.only.image.attachment.support')
              .d('附件只支持图片类型'),
          });
          return false;
        }
      },
    };
    return [
      {
        name: 'organizationObj',
        width: 150,
        editor: (record) => {
          if (record.status === 'add') {
            return <Lov noCache />;
          }
          return false;
        },
        lock: true,
      },
      { name: 'inspectionItemCode', width: 150, editor: this.editorRenderer, lock: true },
      { name: 'inspectionItemName', width: 150, editor: true },
      { name: 'description', width: 150, editor: true },
      { name: 'instruction', width: 130, editor: true },
      {
        name: 'drawingCode',
        width: 150,
        renderer: (record) => {
          const file = record.value;
          return (
            <>
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
            </>
          );
        },
      },
      { name: 'inspectionItemAlias', width: 150, editor: true },
      { name: 'inspectionClass', width: 150, editor: true },
      { name: 'standardValue2', width: 150, editor: true },
      { name: 'standardValue3', width: 150, editor: true },
      { name: 'inspectionType', width: 150, editor: true },
      { name: 'inspectionResourceObj', width: 150, editor: <Lov noCache /> },
      { name: 'resultType', width: 150, editor: true },
      { name: 'defaultUcl', width: 150, editor: true },
      {
        name: 'defaultUclAccept',
        width: 150,
        editor: (record) => (record.editing ? <CheckBox /> : false),
        align: 'center',
        renderer: yesOrNoRender,
      },
      { name: 'defaultLcl', width: 150, editor: true },
      {
        name: 'defaultLclAccept',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 150,
        align: 'center',
        renderer: yesOrNoRender,
      },
      {
        name: 'enabledFlag',
        editor: (record) => (record.editing ? <CheckBox /> : false),
        width: 100,
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

  /**
   * 判断是否为新建，新建可编辑
   * @param {*} record
   */
  editorRenderer(record) {
    return record.status === 'add' ? <TextField /> : null;
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.tableDS.create({}, 0);
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

  @Bind
  handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${inspectionItem}`,
        title: intl.get(`${preCode}.view.title.inspectionItemImport`).d('检验项目导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.inspectionItem`).d('检验项目')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchExport}>
            {intl.get('lmds.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDSS}/v1/${organizationId}/neway-inspection-items/excel`}
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
