/*
 * @Author: zhang yang
 * @Description: 工序 详情 Index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:00
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import {
  DataSet,
  Form,
  Select,
  TextField,
  IntlField,
  Switch,
  Button,
  Lov,
  NumberField,
  Icon,
} from 'choerodon-ui/pro';
import { Card, Upload } from 'choerodon-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import intl from 'utils/intl';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';

import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile } from 'hlos-front/lib/services/api';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';

import ContextDetail from './detailList';
import OperationDetailDS from '../stores/OperationDetailDS';

import './style.less';

const preCode = 'lmds.operation';
const organizationId = getCurrentOrganizationId();
const directory = 'technology-operation';

@connect()
@formatterCollections({
  code: ['lmds.operation'],
})
export default class OperationDetailPage extends Component {
  state = {
    referenceDocumentList: [],
    processProgramList: [],
  };

  detailDS = new DataSet({
    ...OperationDetailDS(),
  });

  async componentDidMount() {
    if (this.isCreatePage) {
      await this.detailDS.create({});
    } else {
      await this.refreshPage();
    }
  }

  get isCreatePage() {
    const { match } = this.props;
    const { operationId } = match.params;
    return !operationId;
  }

  /**
   * 请求数据 刷新页面
   */
  @Bind()
  async refreshPage() {
    const { operationId } = this.props.match.params;
    this.detailDS.queryParameter = { operationId };
    await this.detailDS.query().then((res) => {
      if (res.content[0].referenceDocument) {
        this.setState({
          referenceDocumentList: [
            {
              uid: '-1',
              name: getFileName(res.content[0].referenceDocument),
              url: res.content[0].referenceDocument,
            },
          ],
        });
      }
      if (res.content[0].processProgram) {
        this.setState({
          processProgramList: [
            {
              uid: '-2',
              name: getFileName(res.content[0].processProgram),
              url: res.content[0].processProgram,
            },
          ],
        });
      }
    });
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const { dispatch } = this.props;
    const validateValue = await this.detailDS.validate(false, false);

    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await this.detailDS.submit(false, false);
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else if (res === undefined) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }

    if (res && res.content && res.content[0]) {
      const pathname = `/lmds/operation/detail/${res.content[0].operationId}`;
      dispatch(
        routerRedux.push({
          pathname,
        })
      );
    } else if (!this.isCreatePage) {
      this.refreshPage();
    }
  }

  /**
   * 文件上传成功
   * @param res 返回response
   * @param file 上传文件信息
   */
  @Bind()
  async handleUploadSuccess(str, res, file) {
    const currentFile = file;
    if (res && !res.failed) {
      this.detailDS.current.set(str, res);
      if (!this.detailDS.current.editing) {
        await this.detailDS.submit();
        notification.success({
          message: '上传成功',
        });
      }
      currentFile.url = res;
      this.setState({
        [`${str}List`]: [currentFile],
      });
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
  handleRemove(str, file) {
    deleteFile({ file: file.url, directory });
    this.detailDS.current.set(str, '');
    this.setState({
      [`${str}List`]: [],
    });
  }

  /**
   * 下载文件
   * @param file 文件对象
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
  uploadData(file) {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MDS,
      directory: '1',
    };
  }

  render() {
    const { referenceDocumentList, processProgramList } = this.state;
    const uploadProps = {
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
      onSuccess: (res, file) => this.handleUploadSuccess('referenceDocument', res, file),
      onRemove: (file) => this.handleRemove('referenceDocument', file),
      onPreview: this.downFile,
      data: this.uploadData,
      fileList: referenceDocumentList,
    };
    const uploadPropsOther = {
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
      onSuccess: (res, file) => this.handleUploadSuccess('processProgram', res, file),
      onRemove: (file) => this.handleRemove('processProgram', file),
      onPreview: this.downFile,
      data: this.uploadData,
      fileList: processProgramList,
    };
    return (
      <Fragment>
        <Header
          title={
            this.isCreatePage
              ? intl.get(`${preCode}.view.title.create`).d('新建')
              : intl.get(`${preCode}.view.title.edit`).d('编辑')
          }
          backPath="/lmds/operation/list"
        >
          <Button icon="save" color="primary" onClick={this.handleSubmit}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Card
            key="header"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.operation`).d('工序')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={4}>
              <TextField name="operationCode" disabled={!this.isCreatePage} />
              <IntlField name="operationName" />
              <IntlField name="operationAlias" />
              <IntlField name="description" />
              <Lov name="operationCategory" noCache />
              <Select name="operationType" />
              <Lov name="organization" noCache />
              <Lov name="item" noCache />
              <TextField name="itemDescription" disabled />
              <NumberField name="processTime" />
              <NumberField name="standardWorkTime" />
              <Lov name="collector" noCache />
              <TextField name="instruction" />
              <TextField name="downstreamOperation" />
              <Lov name="executeRule" noCache />
              <Lov name="inspectionRule" noCache />
              <Lov name="dispatchRule" noCache />
              <Lov name="packingRule" noCache />
              <Lov name="reworkRule" noCache />
              <TextField name="externalId" />
              <Switch name="keyOperationFlag" newLine />
              <Switch name="enabledFlag" />
            </Form>
            <div className="item-content-OperationDetailPage">
              <Upload {...uploadProps}>
                <Button>
                  <Icon type="file_upload" />
                  {intl.get(`${preCode}.model.uploadReferenceDocument`).d('上传参考文件')}
                </Button>
              </Upload>
              <Upload {...uploadPropsOther}>
                <Button>
                  <Icon type="file_upload" />
                  {intl.get(`${preCode}.model.uploadProcessProgram`).d('上传加工程序')}
                </Button>
              </Upload>
            </div>
          </Card>
          <Card
            key="List"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.operationContext`).d('工序明细')}</h3>}
          >
            <ContextDetail detailDS={this.detailDS} />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
