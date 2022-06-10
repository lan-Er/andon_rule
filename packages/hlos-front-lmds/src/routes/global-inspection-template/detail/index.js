/*
 * @Description: 质检模板编辑/创建 -- Index
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-12-11 9:05:22
 * @Copyright: Copyright(c) 2019, Hand
 * @LastEditors: Please set LastEditors
 */
import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import {
  Form,
  TextField,
  Button,
  DataSet,
  Lov,
  Select,
  Switch,
  NumberField,
} from 'choerodon-ui/pro';
import { Card, Upload, Icon } from 'choerodon-ui';
import uuidv4 from 'uuid/v4';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getAccessToken, getResponse } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { deleteFile, queryLovData } from 'hlos-front/lib/services/api';
import { HLOS_LMDS, BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { queryInspectionGroupLines } from '@/services/api';
import codeConfig from '@/common/codeConfig';
import InspectionTemLine from './InspectionTemLine';
import { syncInspectionTemplate } from '../../../services/inspectionTemplateService';
import { inspectionTemDetailDS, inspectionTemLineDS } from '../stores/InspectionTemplateDS';
import styles from './index.less';

const organizationId = getCurrentOrganizationId();
const directory = 'global-inspection-template';
const { common } = codeConfig.code;

@formatterCollections({
  code: ['lmds.inspectionTemplate', 'lmds.common'],
})
export default class InspectionTemplateDetail extends Component {
  constructor(props) {
    super(props);
    this.detailFormDS = new DataSet({
      ...inspectionTemDetailDS(),
      children: {
        inspectionTemplateLineList: new DataSet(inspectionTemLineDS()),
      },
    });
    this.state = {
      templateId: props.match.params.templateId,
      referenceDocumentList: [],
      drawingCodeList: [],
    };
  }

  componentDidMount() {
    if (this.props.match.params.templateId) {
      this.refreshPage();
    } else {
      this.queryDefaultOrg();
    }
  }

  @Bind()
  async queryDefaultOrg() {
    const res = await queryLovData({
      lovCode: common.organization,
      defaultFlag: 'Y',
    });
    if (res && res.content && res.content[0]) {
      this.detailFormDS.create({ organizationObj: res.content[0] });
    }
  }

  /**
   * 重新加载
   */
  @Bind()
  refreshPage() {
    const { templateId } = this.props.match.params;
    this.detailFormDS.queryParameter = { templateId };
    this.detailFormDS.query().then((res) => {
      if (res.content[0].referenceDocument) {
        this.setState({
          referenceDocumentList: [
            {
              uid: uuidv4(),
              name: getFileName(res.content[0].referenceDocument),
              url: res.content[0].referenceDocument,
            },
          ],
        });
      }
      if (res.content[0].drawingCode) {
        this.setState({
          drawingCodeList: [
            {
              uid: uuidv4(),
              name: getFileName(res.content[0].drawingCode),
              url: res.content[0].drawingCode,
            },
          ],
        });
      }
    });
  }

  /**
   * 处理保存事件
   */
  @Bind()
  async handleSave() {
    const { state, detailFormDS: ds } = this;
    const detailValidate = await ds.validate(false, false);
    if (!detailValidate) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const {
      itemObj,
      itemCategoryObj,
      operationObj,
      routingOperationObj,
      inspectionTemplateType,
    } = ds.current.toData();
    if (
      inspectionTemplateType.substr(-4, 4) !== '.ALL' &&
      isEmpty(itemObj) &&
      isEmpty(itemCategoryObj) &&
      isEmpty(operationObj) &&
      isEmpty(routingOperationObj)
    ) {
      notification.error({
        message: intl
          .get('lmds.inspectionTemplate.view.message.valid.error')
          .d('物料编码、物料类别、工序、工艺路线工序至少其中一个有值'),
      });
      return;
    }
    const res = await ds.submit();
    if (res === undefined) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }
    if (getResponse(res)) {
      sessionStorage.setItem('globalInspectionTemplate', true);
    }
    if (!state.templateId) {
      if (res && res.content && res.content[0]) {
        // 新建页面创建数据成功后跳转到详情页面
        const pathname = `${HLOS_LMDS}/inspection-template/detail/${res.content[0].templateId}`;
        this.props.dispatch(
          routerRedux.push({
            pathname,
          })
        );
      }
    }
  }

  /**
   * 处理同步事件
   */
  @Bind()
  async handleSync() {
    const obj = {
      organizationId: this.detailFormDS.current.get('organizationId'),
      templateId: this.detailFormDS.current.get('templateId'),
      inspectionGroupId: this.detailFormDS.current.get('inspectionGroupId'),
    };
    const params = [];
    params.push(obj);
    const res = await syncInspectionTemplate(params);
    if (getResponse(res)) {
      notification.success({
        message: '同步成功',
      });
      sessionStorage.setItem('globalInspectionTemplate', true);
      this.detailFormDS.query();
    }
  }

  /**
   * 修改规则
   * 变更规则项
   */
  @Bind
  async handleInspectionGroup(record) {
    const { inspectionTemplateLineList } = this.detailFormDS.children;
    inspectionTemplateLineList.reset();
    if (record && record.inspectionGroupId) {
      const { inspectionGroupId } = record;
      const res = await queryInspectionGroupLines({ inspectionGroupId, page: -1 });
      if (getResponse(res)) {
        res.content.map((item) => {
          const {
            inspectionItemId,
            inspectionItemName,
            resultType,
            resultTypeMeaning,
            inspectionResourceId,
            inspectionResource,
            defaultUcl: ucl,
            defaultUclAccept: uclAccept,
            defaultLcl: lcl,
            defaultLclAccept: lclAccept,
            orderByCode,
            enabledFlag,
            necessaryFlag,
          } = item;
          inspectionTemplateLineList.create({
            inspectionItemId,
            inspectionItemName,
            resultType,
            resultTypeMeaning,
            inspectionResourceId,
            inspectionResource,
            ucl,
            uclAccept,
            lcl,
            lclAccept,
            orderByCode,
            enabledFlag,
            necessaryFlag,
          });
          return null;
        });
      }
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

  @Bind()
  beforeUpload(file) {
    const isImg = file.type.indexOf('image') !== -1;
    const isPdf = file.type.indexOf('pdf') !== -1;
    if (!isImg && !isPdf) {
      notification.warning({
        message: intl
          .get('lmds.common.view.message.upload.selectImage')
          .d('请选择图片格式或pdf文件上传'),
      });
    }
    if (isImg) {
      return isImg;
    }
    if (isPdf) {
      return isPdf;
    }
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
  async handleSuccess(res, file, type) {
    if (res && !res.failed) {
      const { current } = this.detailFormDS;
      const currentFile = file;
      current.set(`${type}`, res);
      // 对处于编辑状态的单据(包含新建)自动提交
      if (current.toData() && current.toData().templateId) {
        await this.detailFormDS.submit();
        notification.success({
          message: '上传成功',
        });
      }
      currentFile.url = res;
      this.setState({
        [`${type}List`]: [currentFile],
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
  handleRemove(type) {
    this.detailFormDS.current.set(`${type}`, '');
    deleteFile({ file: this.state[`${type}List`][0].url, directory });
    this.setState({
      [`${type}List`]: [],
    });
  }

  /**
   * 下载
   * @param {object} record - 参考文档
   */
  @Bind()
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

  render() {
    const { templateId, referenceDocumentList, drawingCodeList } = this.state;
    const uploadProps = {
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      accept: '*',
      action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
      onPreview: this.downFile,
      data: this.uploadData,
      beforeUpload: this.beforeUpload,
    };
    return (
      <Fragment>
        <Header
          title={
            templateId
              ? intl.get('hzero.common.status.edit').d('编辑')
              : intl.get('hzero.common.status.create').d('创建')
          }
          backPath="/lmds/inspection-template/list"
        >
          <Button onClick={this.handleSave} icon="save" color="primary">
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          {templateId && (
            <Button icon="sync" onClick={this.handleSync}>
              {intl.get('lmds.inspectionTemplate.button.sync').d('同步')}
            </Button>
          )}
        </Header>
        <Content>
          <Card
            key="inspection-template-header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={
              <h3>
                {intl.get('lmds.inspectionTemplate.view.title.inspecti.template').d('质检模板')}
              </h3>
            }
          >
            <Form dataSet={this.detailFormDS} columns={4}>
              <Lov name="organizationObj" noCache disabled={!!templateId} />
              <Lov
                noCache
                name="inspectionGroupObj"
                disabled={!!templateId}
                onChange={(record) => this.handleInspectionGroup(record)}
              />
              <Select name="inspectionTemplateType" disabled={!!templateId} />
              <Lov name="itemObj" noCache disabled={!!templateId} />
              <TextField name="itemDescription" disabled />
              <Lov name="itemCategoryObj" noCache disabled={!!templateId} />
              <Lov name="operationObj" noCache disabled={!!templateId} />
              <Lov name="routingOperationObj" noCache disabled={!!templateId} />
              <Lov name="partyObj" noCache disabled={!!templateId} />
              <Lov name="resourceObj" noCache disabled={!!templateId} />
              <Lov name="inspectorGroupObj" noCache />
              <Lov name="inspectorObj" noCache />
              <TextField name="inspectionStandard" />
              <Select name="samplingType" />
              <Select name="samplingStandard" />
              <NumberField name="sampleValue" />
              <Select name="sampleJudgeMode" />
              <Select name="frequencyType" />
              <NumberField name="frequencyValue" />
              <NumberField name="standardInspectTime" />
              <Lov name="docProcessRuleObj" noCache />
              <TextField name="instruction" colSpan={3} />
              <Switch name="autoFeedbackResult" />
              <Switch name="syncFlag" />
              <Switch name="autoJudgeFlag" />
              <Switch name="enabledFlag" />
            </Form>
            <div className={styles['upload-area']}>
              <Upload
                {...uploadProps}
                onSuccess={(res, file) => this.handleSuccess(res, file, 'referenceDocument')}
                onRemove={() => this.handleRemove('referenceDocument')}
                fileList={referenceDocumentList}
              >
                <Button>
                  <Icon type="file_upload" />{' '}
                  {intl.get('lmds.inspectionTemplate.view.title.referenceDocument').d('参考文件')}
                </Button>
              </Upload>
              <Upload
                {...uploadProps}
                onSuccess={(res, file) => this.handleSuccess(res, file, 'drawingCode')}
                onRemove={() => this.handleRemove('drawingCode')}
                fileList={drawingCodeList}
              >
                <Button>
                  <Icon type="file_upload" />{' '}
                  {intl.get('lmds.inspectionTemplate.view.title.drawingCode').d('参考图纸')}
                </Button>
              </Upload>
            </div>
          </Card>
          <Card
            key="inspection-template-line"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={
              <h3>{intl.get('lmds.inspectionTemplate.view.title.inspectionItem').d('检验项')}</h3>
            }
          >
            <InspectionTemLine ds={this.detailFormDS} />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
