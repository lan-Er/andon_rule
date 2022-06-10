/**
 * @Description: 工艺路线详情页面--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 14:06:38
 * @LastEditors: yu.na
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
  DatePicker,
  NumberField,
  Tabs,
} from 'choerodon-ui/pro';
import { Card, Upload, Icon, Divider } from 'choerodon-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile } from 'hlos-front/lib/services/api';

import ResourceList from './ResourceList';
import StepList from './StepList';
import ComponentList from './ComponentList';
import OperationDetailDS from '../stores/OperationDetailDS';
import './style.less';

const preCode = 'lmds.routing';
const { TabPane } = Tabs;
const organizationId = getCurrentOrganizationId();
const directory = 'technology-routing';

@connect()
@formatterCollections({
  code: ['lmds.routing', 'lmds.common'],
})
export default class OperationDetail extends Component {
  state = {
    hidden: true,
    referenceDocument: [],
    processProgram: [],
    copyFlag: false,
  };

  detailDS = new DataSet({
    ...OperationDetailDS(),
  });

  get isCreatePage() {
    const { match } = this.props;
    const { routingOperationId } = match.params;
    return !routingOperationId;
  }

  get tabsArr() {
    const { copyFlag } = this.state;
    return [
      {
        code: 'resource',
        title: '资源',
        component: <ResourceList detailDS={this.detailDS} copyFlag={copyFlag} />,
      },
      {
        code: 'step',
        title: '步骤',
        component: <StepList detailDS={this.detailDS} copyFlag={copyFlag} />,
      },
      {
        code: 'component',
        title: '组件',
        component: <ComponentList detailDS={this.detailDS} copyFlag={copyFlag} />,
      },
    ];
  }

  async componentDidMount() {
    const {
      location: { state },
    } = this.props;
    if (state && state.copyFlag) {
      this.setState({
        copyFlag: true,
      });
    } else {
      this.setState({
        copyFlag: false,
      });
    }
    if (this.isCreatePage) {
      const { routingId } = this.props.match.params;
      this.detailDS.queryParameter = { routingId };
      await this.detailDS.create({});
    } else {
      await this.refreshPage();
    }
  }

  /**
   * 切换显示隐藏
   */
  @Bind()
  handleToggle() {
    const { hidden } = this.state;
    this.setState({
      hidden: !hidden,
    });
  }

  /**
   * 请求数据 刷新页面
   */
  @Bind()
  async refreshPage() {
    const { routingOperationId, routingId } = this.props.match.params;
    this.detailDS.queryParameter = { routingOperationId, routingId };
    await this.detailDS.query().then((res) => {
      if (res.content[0].referenceDocument) {
        this.setState({
          referenceDocument: [
            {
              uid: '1',
              name: getFileName(res.content[0].referenceDocument),
              url: res.content[0].referenceDocument,
            },
          ],
        });
      }
      if (res.content[0].processProgram) {
        this.setState({
          processProgram: [
            {
              uid: '1',
              name: getFileName(res.content[0].processProgram),
              url: res.content[0].processProgram,
            },
          ],
        });
      }
      if (res.content[0].attribute01) {
        this.setState({
          copyFlag: true,
        });
      } else {
        this.setState({
          copyFlag: false,
        });
      }
    });
  }

  /**
   * 文件上传成功
   * @param res 返回response
   * @param file 上传文件信息
   */
  @Bind()
  async handleUploadSuccess(res, file, type) {
    const { current } = this.detailDS;
    const currentFile = file;
    if (res && !res.failed) {
      current.set(type, res);
      if (!current.editing) {
        await this.detailDS.submit();
        notification.success({
          message: '上传成功',
        });
      }
      currentFile.url = res;
      this.setState({
        [`${type}`]: [currentFile],
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
  handleRemove(file, fileName) {
    deleteFile({ file: file.url, directory });
    this.detailDS.current.set(fileName, '');
    this.setState({
      [`${fileName}`]: [],
    });
  }

  /**
   * 下载
   * @param {object} record
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
      directory: 'routing',
    };
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const { dispatch } = this.props;
    const { copyFlag } = this.state;
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
    if (copyFlag) {
      this.refreshPage();
      return;
    }
    if (res && res.content && res.content[0]) {
      // 新建页面创建数据成功后跳转到详情页面
      const pathname = `/lmds/neway/routing/operation/${res.content[0].routingId}/${res.content[0].routingOperationId}`;
      dispatch(
        routerRedux.push({
          pathname,
        })
      );
    } else if (!this.isCreatePage) {
      this.refreshPage();
    }
  }

  render() {
    const {
      match: {
        params: { routingId },
      },
    } = this.props;
    const { referenceDocument, processProgram, hidden, copyFlag } = this.state;
    const commonUploadProps = {
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
      accept: ['*'],
    };
    const uploadReferenceProps = {
      ...commonUploadProps,
      onSuccess: (res, file) => this.handleUploadSuccess(res, file, 'referenceDocument'),
      onRemove: (file) => this.handleRemove(file, 'referenceDocument'),
      onPreview: this.downFile,
      data: this.uploadData,
      fileList: referenceDocument,
    };
    const uploadProgramProps = {
      ...commonUploadProps,
      onSuccess: (res, file) => this.handleUploadSuccess(res, file, 'processProgram'),
      onRemove: (file) => this.handleRemove(file, 'processProgram'),
      onPreview: this.downFile,
      data: this.uploadData,
      fileList: processProgram,
    };
    return (
      <Fragment>
        <Header
          title={
            this.isCreatePage
              ? intl.get(`${preCode}.view.title.operationCreate`).d('新建工序')
              : intl.get(`${preCode}.view.title.operationDetail`).d('工序详情')
          }
          backPath={
            routingId ? `/lmds/neway/routing/detail/${routingId}` : '/lmds/neway/routing/detail'
          }
        >
          <Button icon="save" color="primary" onClick={this.handleSubmit}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content className="routing-operation-content">
          <Card
            key="routing-operation-header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.routingOperation`).d('工艺路线工序')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={4}>
              <TextField name="sequenceNum" disabled={!this.isCreatePage && !copyFlag} />
              <Lov noCache name="operationObj" />
              <IntlField name="operationName" />
              <IntlField name="operationAlias" />
            </Form>
            <Divider>
              <div>
                <span onClick={this.handleToggle} style={{ cursor: 'pointer' }}>
                  {hidden
                    ? `${intl.get('hzero.common.button.expand').d('展开')}`
                    : `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`}
                </span>
                <Icon type={hidden ? 'expand_more' : 'expand_less'} />
              </div>
            </Divider>
            <div style={hidden ? { display: 'none' } : { display: 'block' }}>
              <Form dataSet={this.detailDS} columns={4}>
                <IntlField name="description" />
                <Select name="routingOperationType" />
                <Switch name="keyOperationFlag" disabled />
                <TextField name="preSequenceNum" />
                <TextField name="operationGroup" />
                <TextField name="reworkOperation" />
                <NumberField name="processTime" />
                <NumberField name="standardWorkTime" />
                <Lov noCache name="collectorObj" />
                <TextField name="instruction" />
                <TextField name="downstreamOperation" />
                <Lov noCache name="executeRuleObj" />
                <Lov noCache name="inspectionRuleObj" />
                <Lov noCache name="dispatchRuleObj" />
                <Lov noCache name="packingRuleObj" />
                <Lov noCache name="reworkRuleObj" />
                <NumberField name="externalId" />
                <TextField name="externalNum" />
                <DatePicker name="startDate" />
                <DatePicker name="endDate" />
              </Form>
              <div style={{ margin: '20px 0' }}>
                <Upload {...uploadReferenceProps}>
                  <Button>
                    <Icon type="file_upload" />{' '}
                    {intl.get(`${preCode}.model.uploadReferenceDocument`).d('上传参考文件')}
                  </Button>
                </Upload>
              </div>
              <Upload {...uploadProgramProps}>
                <Button>
                  <Icon type="file_upload" />{' '}
                  {intl.get(`${preCode}.model.uploadProcessProgram`).d('上传加工程序')}
                </Button>
              </Upload>
            </div>
          </Card>
          <Card
            key="routing-operation-list"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <Tabs defaultActiveKey="resource">
              {this.tabsArr.map((tab) => (
                <TabPane
                  tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
                  key={tab.code}
                >
                  {tab.component}
                </TabPane>
              ))}
            </Tabs>
          </Card>
        </Content>
      </Fragment>
    );
  }
}
