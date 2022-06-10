/**
 * @Description: 物料制造详情信息
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 10:35:43
 * @LastEditors: yu.na
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Select, TextField, NumberField, Form, Lov, Switch, Button, Icon } from 'choerodon-ui/pro';
import { Upload, Collapse } from 'choerodon-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { downloadFile } from 'services/api';
import uuidv4 from 'uuid/v4';
import { HZERO_FILE } from 'utils/config';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile } from 'hlos-front/lib/services/api';

const organizationId = getCurrentOrganizationId();
const directory = 'item';

const { Panel } = Collapse;
@connect((state) => state)
@formatterCollections({
  code: ['lmds.item', 'lmds.common'],
})
export default class MeDetail extends PureComponent {
  state = {
    fileList: [],
  };

  componentDidMount() {
    const { current } = this.props.detailDS.children.itemMe;
    if (current) {
      const { referenceDocument } = current.data;
      if (referenceDocument) {
        this.setState({
          fileList: [
            {
              uid: uuidv4(),
              name: getFileName(referenceDocument),
              url: referenceDocument,
            },
          ],
        });
      }
    }
  }

  /**
   * 文件上传成功
   * @param res 返回response
   * @param file 上传文件信息
   */
  @Bind()
  async handleUploadSuccess(res, file) {
    const { detailDS } = this.props;
    const currentFile = file;
    if (res && !res.failed) {
      detailDS.children.itemMe.current.set('referenceDocument', res);
      if (detailDS.current.toData() && detailDS.current.toData().itemId) {
        await this.props.detailDS.submit();
        notification.success({
          message: '上传成功',
        });
        currentFile.url = res;
        this.setState({
          fileList: [currentFile],
        });
      }
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  }

  /**
   * 移除文件
   */
  @Bind()
  handleRemove() {
    this.props.detailDS.current.set('referenceDocument', '');
    deleteFile({ file: this.state.fileList[0].url, directory });
    this.setState({
      fileList: [],
    });
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
        { name: 'url', value: file.url },
      ],
    });
  }

  @Bind()
  uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory,
    };
  }

  render() {
    const { detailDS } = this.props;
    const { fileList } = this.state;
    const uploadProps = {
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
      accept: ['*'],
      data: this.uploadData,
      onSuccess: this.handleUploadSuccess,
      onRemove: this.handleRemove,
      onPreview: this.downFile,
      fileList,
    };
    return (
      <Fragment>
        <Collapse bordered={false} className="item-left-list" defaultActiveKey={['1', '2', '3']}>
          <Panel header="常规数据" key="1">
            <Form dataSet={detailDS.children.itemMe} columns={3}>
              <Select name="itemMeType" />
              <Lov name="meCategoryObj" noCache />
              <Select name="makeBuyCode" />
              <Select name="supplyType" />
              <Switch name="outsourcingFlag" />
              <Switch name="enabledFlag" />
            </Form>
          </Panel>
          <Panel header="执行相关" key="2">
            <Form dataSet={detailDS.children.itemMe} columns={3}>
              <TextField name="tagTemplate" />
              <Lov name="executeRuleObj" noCache />
              <Lov name="inspectionRuleObj" noCache />
              <Lov name="dispatchRuleObj" noCache />
              <Lov name="packingRuleObj" noCache />
              <Lov name="reworkRuleObj" noCache />
              <Select name="lotControlType" />
              <Lov name="numberRuleObj" noCache />
              <Select name="issueControlType" />
              <NumberField name="issueControlValue" />
              <Select name="completeControlType" />
              <NumberField name="completeControlValue" />
            </Form>
          </Panel>
          <Panel header="库位设置" key="3">
            <Form dataSet={detailDS.children.itemMe} columns={3}>
              <Lov name="supplyWarehouseObj" noCache />
              <Lov name="supplyWmAreaObj" noCache />
              <Lov name="issueWarehouseObj" noCache />
              <Lov name="issueWmAreaObj" noCache />
              <Lov name="completeWarehouseObj" noCache />
              <Lov name="completeWmAreaObj" noCache />
              <Lov name="inventoryWarehouseObj" noCache />
              <Lov name="inventoryWmAreaObj" noCache />
            </Form>
            <Upload {...uploadProps}>
              <Button>
                <Icon type="file_upload" /> 上传文件
              </Button>
            </Upload>
          </Panel>
        </Collapse>
      </Fragment>
    );
  }
}
