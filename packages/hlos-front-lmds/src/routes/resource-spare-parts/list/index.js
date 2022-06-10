/**
 * @Description: 备品备件管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-05 19:16:12
 * @LastEditors: yu.na
 */

import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import { Button, Table, DataSet, Lov, TextField, CheckBox, Icon } from 'choerodon-ui/pro';
import { Upload, Tag, Popconfirm } from 'choerodon-ui';
import notification from 'utils/notification';
import { openTab } from 'utils/menuTab';
import queryString from 'query-string';
import intl from 'utils/intl';
import { Button as HButton } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject, getAccessToken } from 'utils/utils';
import { downloadFile } from 'services/api';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { HZERO_FILE } from 'utils/config';

import { HLOS_LMDS, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile } from 'hlos-front/lib/services/api';
import SparePartsListDS from '../stores/SparePartsListDS';

const preCode = `lmds.sparePart`;
const organizationId = getCurrentOrganizationId();
const directory = 'resource-spare-part';

@connect()
@formatterCollections({
  code: ['lmds.sparePart', 'lmds.common'],
})
export default class SpareParts extends React.Component {
  tableDS = new DataSet({
    ...SparePartsListDS(),
  });

  @Bind()
  async handleSuccess(res) {
    if (res && !res.failed) {
      const { current } = this.tableDS;
      current.set('fileUrl', res);
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
      directory: 'sparePart',
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
        width: 128,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        lock: true,
      },
      {
        name: 'sparePartCode',
        width: 128,
        editor: (record) => (record.status === 'add' ? <TextField /> : false),
        lock: true,
      },
      { name: 'sparePartName', width: 128, editor: true },
      { name: 'sparePartAlias', width: 128, editor: true },
      { name: 'description', width: 200, editor: true },
      { name: 'sparePartType', width: 106, editor: true },
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
      { name: 'sparePartCategoryObj', width: 84, editor: <Lov noCache /> },
      { name: 'sparePartGroup', width: 128, editor: true },
      { name: 'chiefPositionObj', width: 128, editor: <Lov noCache /> },
      { name: 'departmentObj', width: 128, editor: <Lov noCache /> },
      { name: 'supervisorObj', width: 128, editor: <Lov noCache /> },
      { name: 'resourceObj', width: 128, editor: <Lov noCache /> },
      { name: 'lotControlType', width: 106, editor: true },
      { name: 'itemObj', width: 128, editor: <Lov noCache /> },
      { name: 'itemDescription', width: 128 },
      { name: 'scmOuObj', width: 128, editor: <Lov noCache /> },
      { name: 'sparePartPlanRule', width: 128, editor: true },
      { name: 'supplierObj', width: 150, editor: <Lov noCache /> },
      { name: 'manufacturer', width: 150, editor: true },
      { name: 'servicePhone', width: 120, editor: true, align: 'left' },
      {
        name: 'uomObj',
        width: 70,
        editor: (record) => (record.status === 'add' ? <Lov /> : false),
      },
      { name: 'minStockQty', width: 88, editor: true, align: 'left' },
      { name: 'maxStockQty', width: 88, editor: true, align: 'left' },
      { name: 'safetyStockQty', width: 88, editor: true, align: 'left' },
      { name: 'roundQty', width: 82, editor: true, align: 'left' },
      { name: 'minOrderQty', width: 88, editor: true, align: 'left' },
      { name: 'maxOrderQty', width: 88, editor: true, align: 'left' },

      {
        name: 'fixedLotFlag',
        width: 106,
        renderer: yesOrNoRender,
        editor: (record) => (record.editing ? <CheckBox /> : false),
      },
      { name: 'fixedOrderQty', width: 88, editor: true, align: 'left' },
      { name: 'marketPrice', width: 82, editor: true, align: 'left' },
      { name: 'purchasePrice', width: 82, editor: true, align: 'left' },
      { name: 'currencyObj', width: 82, editor: <Lov noCache /> },
      { name: 'leadTime', width: 112, editor: true, align: 'left' },
      { name: 'warehouseObj', width: 128, editor: <Lov noCache /> },
      { name: 'wmAreaObj', width: 128, editor: <Lov noCache /> },
      { name: 'wmUnitObj', width: 128, editor: <Lov noCache /> },
      { name: 'expireAlertDays', width: 106, editor: true },
      { name: 'alertRuleObj', width: 128, editor: <Lov noCache /> },
      { name: 'tpmInterval', width: 92, editor: true, align: 'left' },
      { name: 'tpmNeedDays', width: 106, editor: true, align: 'left' },
      { name: 'tpmTimes', width: 92, editor: true, align: 'left' },
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

  @Bind()
  handleBatchImport() {
    openTab({
      key: `/himp/commentImport/LMDS.SPARE_PARTS`,
      title: intl.get(`${preCode}.view.title.import`).d('导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.import`).d('导入'),
      }),
    });
  }

  render() {
    const { columns, tableDS } = this;
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.sparePart`).d('备品备件')}>
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <HButton icon="upload" onClick={this.handleBatchImport}>
            {intl.get('hzero.common.button.import').d('导入')}
          </HButton>
          <ExcelExport
            requestUrl={`${HLOS_LMDS}/v1/${organizationId}/spare-parts/excel`}
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
