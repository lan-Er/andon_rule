/**
 * @Description: 物料详情页面--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-27 17:04:00
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import {
  DataSet,
  Lov,
  Form,
  Select,
  TextField,
  IntlField,
  Switch,
  Button,
  NumberField,
  Tabs,
} from 'choerodon-ui/pro';
import { Divider, Card, Icon, Upload } from 'choerodon-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { downloadFile } from 'services/api';
import uuidv4 from 'uuid/v4';
import { HZERO_FILE } from 'utils/config';
import { Header, Content } from 'components/Page';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { deleteFile } from 'hlos-front/lib/services/api';

import ScmDetail from './ScmDetail';
import MeDetail from './MeDetail';
import ApsDetail from './ApsDetail';
import WmDetail from './WmDetail';
import SopDetail from './SopDetail';

import ItemDetailDS from '../stores/ItemDetailDS';

import './style.less';

const { TabPane } = Tabs;
const preCode = 'lmds.item';
const organizationId = getCurrentOrganizationId();
const directory = 'item';

@connect()
@formatterCollections({
  code: ['lmds.item', 'lmds.common'],
})
export default class DetailPage extends Component {
  state = {
    hidden: true,
    fileList: [],
  };

  detailDS = new DataSet({
    ...ItemDetailDS(),
  });

  get isCreatePage() {
    const { match } = this.props;
    const { itemId } = match.params;
    return !itemId;
  }

  get tabsArr() {
    return [
      {
        code: 'scm',
        title: '采购',
        component: (
          <ScmDetail
            detailDS={this.detailDS}
            isCreatePage={this.detailDS.children.itemScm.current}
          />
        ),
      },
      { code: 'me', title: '制造', component: <MeDetail detailDS={this.detailDS} /> },
      { code: 'aps', title: '计划', component: <ApsDetail detailDS={this.detailDS} /> },
      { code: 'wm', title: '仓储', component: <WmDetail detailDS={this.detailDS} /> },
      { code: 'sop', title: '销售', component: <SopDetail detailDS={this.detailDS} /> },
    ];
  }

  async componentDidMount() {
    if (this.isCreatePage) {
      await Promise.all([
        this.detailDS.create({}),
        this.detailDS.children.itemAps.create({ enabledFlag: true, planFlag: true }, 0),
        this.detailDS.children.itemScm.create({ enabledFlag: true }, 0),
        this.detailDS.children.itemSop.create({ enabledFlag: true }, 0),
        this.detailDS.children.itemMe.create({ enabledFlag: true }, 0),
        this.detailDS.children.itemWm.create({ enabledFlag: true }, 0),
      ]);
    } else {
      await this.refreshPage();
    }
  }

  /**
   * 刷新页面数据
   */
  @Bind()
  async refreshPage() {
    const { itemId } = this.props.match.params;
    this.detailDS.queryParameter = { itemId };
    await this.detailDS.query().then((res) => {
      if (res.content[0].fileUrl) {
        this.setState({
          fileList: [
            {
              uid: uuidv4(),
              name: getFileName(res.content[0].fileUrl),
              url: res.content[0].fileUrl,
            },
          ],
        });
      }
    });
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

    if (!this.detailDS.children.itemWm.current.get('wmOuId')) {
      notification.error({
        message: intl.get('lmds.item.view.message.valid.WmOu').d('当前选中工厂没有对应的仓储中心'),
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
      // 新建页面创建数据成功后跳转到详情页面
      const pathname = `/lmds/item/detail/${res.content[0].itemId}`;
      dispatch(
        routerRedux.push({
          pathname,
        })
      );
    } else if (!this.isCreatePage) {
      await this.refreshPage();
    }
  }

  /**
   * 监听工厂Lov变化
   * @param lovRecord 选中的Lov数据
   * @param type 仓库类型
   */
  @Bind()
  handleMeOuChange(lovRecord) {
    const {
      current,
      children: { itemAps, itemScm, itemSop, itemWm, itemMe },
    } = this.detailDS;
    if (!isEmpty(lovRecord)) {
      itemAps.current.set('meOuObj', lovRecord);
      itemScm.current.set('meOuObj', lovRecord);
      itemSop.current.set('meOuObj', lovRecord);
      itemWm.current.set('meOuObj', lovRecord);
      itemMe.current.set('meOuObj', lovRecord);
      itemAps.current.set('apsOuName', current.get('meOuObj').apsOu || '');
      itemAps.current.set('apsOuId', current.get('meOuObj').apsOuId || '');
      itemAps.current.set('apsOuCode', current.get('meOuObj').apsOuCode || '');
      itemScm.current.set('scmOuName', current.get('meOuObj').scmOu || '');
      itemScm.current.set('scmOuId', current.get('meOuObj').scmOuId || '');
      itemScm.current.set('scmOuCode', current.get('meOuObj').scmOuCode || '');
      itemWm.current.set('wmOuName', current.get('meOuObj').wmOuName || '');
      itemWm.current.set('wmOuId', current.get('meOuObj').wmOuId || '');
      itemWm.current.set('wmOuCode', current.get('meOuObj').wmOuCode || '');
      itemWm.current.set('organizationObj', {
        organizationId: lovRecord.meOuId,
        organizationCode: lovRecord.meOuCode,
        organizationName: lovRecord.organizationName,
      });
      itemSop.current.set('sopOuName', current.get('meOuObj').sopOu || '');
      itemSop.current.set('sopOuId', current.get('meOuObj').sopOuId || '');
      itemSop.current.set('sopOuCode', current.get('meOuObj').sopOuCode || '');
      itemSop.current.set('apsOuName', current.get('meOuObj').apsOu || '');
      itemSop.current.set('apsOuId', current.get('meOuObj').apsOuId || '');
      itemSop.current.set('apsOuCode', current.get('meOuObj').apsOuCode || '');
    } else {
      itemAps.current.set('meOuObj', null);
      itemScm.current.set('meOuObj', null);
      itemSop.current.set('meOuObj', null);
      itemWm.current.set('meOuObj', null);
      itemMe.current.set('meOuObj', null);
      itemAps.current.set('apsOuName', '');
      itemAps.current.set('apsOuId', '');
      itemAps.current.set('apsOuCode', '');
      itemScm.current.set('scmOuName', '');
      itemScm.current.set('scmOuId', '');
      itemScm.current.set('scmOuCode', '');
      itemWm.current.set('wmOuName', '');
      itemWm.current.set('wmOuId', '');
      itemWm.current.set('wmOuCode', '');
      itemSop.current.set('sopOuName', '');
      itemSop.current.set('sopOuId', '');
      itemSop.current.set('sopOuCode', '');
      itemSop.current.set('apsOuName', '');
      itemSop.current.set('apsOuId', '');
      itemSop.current.set('apsOuCode', '');
    }
  }

  /**
   * 图片上传成功
   * @param res 返回response
   * @param file 上传文件信息
   */
  @Bind()
  async handleUploadSuccess(res, file) {
    const { current } = this.detailDS;
    const currentFile = file;
    if (res && !res.failed) {
      current.set('fileUrl', res);
      if (current.toData() && current.toData().itemId) {
        await this.detailDS.submit();
        notification.success({
          message: '上传成功',
        });
      }
      currentFile.url = res;
      this.setState({
        fileList: [currentFile],
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
  handleRemove() {
    this.detailDS.current.set('fileUrl', '');
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

  /**
   * 清空页面数据
   */
  @Bind()
  handleClean() {
    const {
      current,
      children: { itemAps, itemScm, itemSop, itemWm, itemMe },
    } = this.detailDS;
    current.reset();
    itemAps.current.reset();
    itemScm.current.reset();
    itemSop.current.reset();
    itemWm.current.reset();
    itemMe.current.reset();
  }

  @Bind()
  handleUomChange(rec) {
    if (rec) {
      this.detailDS.children.itemScm.current.set('uomObj', rec);
      this.detailDS.children.itemSop.current.set('uomObj', rec);
      this.detailDS.children.itemWm.current.set('uomObj', rec);
    } else {
      this.detailDS.children.itemScm.current.set('uomObj', null);
      this.detailDS.children.itemSop.current.set('uomObj', null);
      this.detailDS.children.itemWm.current.set('uomObj', null);
    }
  }

  render() {
    const { hidden, fileList } = this.state;
    const uploadProps = {
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
      accept: ['image/*'],
      onSuccess: this.handleUploadSuccess,
      onRemove: this.handleRemove,
      onPreview: this.downFile,
      data: this.uploadData,
      fileList,
    };
    return (
      <Fragment>
        <Header
          title={
            this.isCreatePage
              ? intl.get('hzero.common.status.create').d('创建')
              : intl.get('hzero.common.status.edit').d('编辑')
          }
          backPath="/lmds/item/list"
        >
          <Button icon="save" color="primary" onClick={this.handleSubmit}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          {this.isCreatePage && (
            <Button onClick={this.handleClean}>
              {intl.get('lmds.common.button.clear').d('清空')}
            </Button>
          )}
        </Header>
        <Content className="item-content">
          <Card
            key="item-header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.item`).d('物料')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={4}>
              <Lov
                name="meOuObj"
                onChange={this.handleMeOuChange}
                disabled={!this.isCreatePage}
                noCache
              />
              <TextField name="itemCode" disabled={!this.isCreatePage} />
              <Lov
                name="uomObj"
                disabled={!this.isCreatePage}
                noCache
                onChange={this.handleUomChange}
              />
              <Switch name="enabledFlag" />
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
                <IntlField name="itemAlias" />
                <TextField name="shortCode" />
                <Select name="itemType" />
                <Lov name="mdsCategoryObj" noCache />
                <TextField name="designCode" />
                <TextField name="specification" />
                <Lov name="secondUomObj" noCache />
                <NumberField name="uomConversionValue" />
                <NumberField name="length" />
                <NumberField name="width" />
                <NumberField name="height" />
                <Lov name="uolObj" noCache />
                <NumberField name="area" />
                <Lov name="uoaObj" noCache />
                <NumberField name="volume" />
                <Lov name="uovObj" noCache />
                <NumberField name="unitWeight" />
                <NumberField name="grossWeight" />
                <Lov name="uowObj" noCache />
                <TextField name="itemIdentifyCode" />
                <TextField name="drawingCode" />
                <TextField name="featureCode" />
                <TextField name="featureDesc" />
                <TextField name="packingGroup" />
                <Select name="hazardClass" />
                <TextField name="unNumber" />
                <NumberField name="standardCost" />
                <NumberField name="standardSalesPrice" />
                <Lov name="externalItemCodeObj" noCache />
                <TextField name="externalDescription" disabled />
              </Form>
              <Upload {...uploadProps}>
                <Button>
                  <Icon type="file_upload" />{' '}
                  {intl.get(`${preCode}.button.fileUpload`).d('上传文件')}
                </Button>
              </Upload>
            </div>
          </Card>
          <Card key="item-line" bordered={false} className={DETAIL_CARD_TABLE_CLASSNAME}>
            <Tabs defaultActiveKey="scm" onChange={this.handleTabChange}>
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
