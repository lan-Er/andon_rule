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
import { Card, Icon, Upload, Collapse, Tag, Spin } from 'choerodon-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { downloadFile } from 'services/api';
import uuidv4 from 'uuid/v4';
import { HZERO_FILE } from 'utils/config';
import { Header, Content } from 'components/Page';
import { getFileName } from 'hlos-front/lib/utils/utils';
import { BUCKET_NAME_MDS } from 'hlos-front/lib/utils/config';
import { deleteFile, userSetting } from 'hlos-front/lib/services/api';
import { queryLovData } from '@/services/api';
import { itemBageMain } from '@/services/itemBateService';

import ScmDetail from './ScmDetail';
import MeDetail from './MeDetail';
import ApsDetail from './ApsDetail';
import WmDetail from './WmDetail';
import SopDetail from './SopDetail';

import ItemDetailDS from '../stores/ItemDetailDS';

import './style.less';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const preCode = 'lmds.item';
const organizationId = getCurrentOrganizationId();
const directory = 'item';
const { common } = codeConfig.code;
@connect()
@formatterCollections({
  code: ['lmds.item', 'lmds.common', 'hnlp.basicData'],
})
export default class DetailPage extends Component {
  state = {
    hidden: true,
    fileList: [],
    organizationList: [],
    loading: false,
    selectLovDate: [],
    activeMeOuIndex: 0,
    clickMeOuIndex: 0,
    createHaveMeOuSubmit: false,
    detailDsList: [
      new DataSet({
        ...ItemDetailDS(),
      }),
    ],
  };

  // detailDS = new DataSet({
  //   ...ItemDetailDS(),
  // });

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
        component: <ScmDetail detailDS={this.state.detailDsList[this.state.activeMeOuIndex]} />,
        icon: 'shopping_cart',
      },
      {
        code: 'me',
        title: '制造',
        component: <MeDetail detailDS={this.state.detailDsList[this.state.activeMeOuIndex]} />,
        icon: 'build-o',
      },
      {
        code: 'aps',
        title: '计划',
        component: <ApsDetail detailDS={this.state.detailDsList[this.state.activeMeOuIndex]} />,
        icon: 'event_note',
      },
      {
        code: 'wm',
        title: '仓储',
        component: <WmDetail detailDS={this.state.detailDsList[this.state.activeMeOuIndex]} />,
        icon: 'home_work-o',
      },
      {
        code: 'sop',
        title: '销售',
        component: <SopDetail detailDS={this.state.detailDsList[this.state.activeMeOuIndex]} />,
        icon: 'business_center-o',
      },
    ];
  }

  async componentDidMount() {
    const localMeOuObj = sessionStorage.getItem('item-bate-detail-before-meouObj')
      ? JSON.parse(sessionStorage.getItem('item-bate-detail-before-meouObj'))
      : {};
    const lovDate =
      Object.keys(localMeOuObj).length > 0
        ? await queryLovData({ lovCode: common.meOu, ...localMeOuObj, size: 3 })
        : await queryLovData({ lovCode: common.meOu, size: 3 });

    const defUserInfo = await userSetting({ defaultFlag: 'Y' });
    if (lovDate && lovDate.content.length && defUserInfo && defUserInfo.content.length) {
      const data = await queryLovData({
        lovCode: common.meOu,
        organizationName: defUserInfo.content[0].organizationName,
        meOuCode: defUserInfo.content[0].meOuCode,
      });

      if (data && data.content && data.content.length) {
        lovDate.content.splice(0, 1, data.content[0]);
      }
    }

    if (this.isCreatePage) {
      const { detailDsList } = this.state;
      if (detailDsList && detailDsList[0]) {
        detailDsList[0].create({});
      }
      if (detailDsList.length < lovDate.content.length) {
        for (let h = 0; h < lovDate.content.length - detailDsList.length; h++) {
          const ds = new DataSet(ItemDetailDS());
          ds.create({});
          ds.children.itemAps.create({ enabledFlag: true, planFlag: true }, 0);
          ds.children.itemScm.create({ enabledFlag: true }, 0);
          ds.children.itemSop.create({ enabledFlag: true }, 0);
          ds.children.itemMe.create({ enabledFlag: true }, 0);
          ds.children.itemWm.create({ enabledFlag: true }, 0);
          detailDsList.push(ds);
        }
      }
      this.setState(() => ({ detailDsList }));
    } else {
      await this.refreshPage();
    }
    if (lovDate) {
      const { content = [] } = lovDate;
      if (content && content.length > 0) {
        const myLen = this.state.detailDsList.length;
        if (this.isCreatePage) {
          for (let i = 0; i < myLen; i++) {
            this.state.detailDsList[i].current.set('meOuObj', content);
            this.handleMeOuChange(content);
          }
        } else {
          for (let i = 0; i < myLen; i++) {
            const { meOuId } = content[i];
            this.state.detailDsList[i].children.itemAps.setQueryParameter('meOuId', meOuId);
            this.state.detailDsList[i].children.itemScm.setQueryParameter('meOuId', meOuId);
            this.state.detailDsList[i].children.itemSop.setQueryParameter('meOuId', meOuId);
            this.state.detailDsList[i].children.itemMe.setQueryParameter('meOuId', meOuId);
            this.state.detailDsList[i].children.itemWm.setQueryParameter('meOuId', meOuId);
          }
          this.refreshPage();
        }
        const organizationList = [];
        for (let i = 0; i < content.length; i++) {
          const { organizationName, meOuId } = content[i];
          if (i === 0) {
            organizationList.push({ organizationName, meOuId, checked: true });
          } else {
            organizationList.push({ organizationName, meOuId, checked: false });
          }
        }
        this.setState(() => ({
          organizationList,
          selectLovDate: content,
        }));
      } else {
        notification.warning({ message: '暂无默认组织' });
      }
    }
    const myLen = this.state.detailDsList.length;
    for (let i = 0; i < myLen; i++) {
      this.state.detailDsList[i].children.itemAps.addEventListener(
        'load',
        this.handleScmQueryAfter
      );
      this.state.detailDsList[i].children.itemScm.addEventListener(
        'load',
        this.handleScmQueryAfter
      );
      this.state.detailDsList[i].children.itemSop.addEventListener(
        'load',
        this.handleScmQueryAfter
      );
      this.state.detailDsList[i].children.itemMe.addEventListener('load', this.handleScmQueryAfter);
      this.state.detailDsList[i].children.itemWm.addEventListener('load', this.handleScmQueryAfter);
    }
  }

  componentWillUnmount() {
    const myLen = this.state.detailDsList.length;
    for (let i = 0; i < myLen; i++) {
      this.state.detailDsList[i].children.itemAps.removeEventListener(
        'load',
        this.handleScmQueryAfter
      );
      this.state.detailDsList[i].children.itemScm.removeEventListener(
        'load',
        this.handleScmQueryAfter
      );
      this.state.detailDsList[i].children.itemSop.removeEventListener(
        'load',
        this.handleScmQueryAfter
      );
      this.state.detailDsList[i].children.itemMe.removeEventListener(
        'load',
        this.handleScmQueryAfter
      );
      this.state.detailDsList[i].children.itemWm.removeEventListener(
        'load',
        this.handleScmQueryAfter
      );
      this.state.detailDsList[i].removeEventListener('update', this.handleDetailDsUpdate);
    }
    sessionStorage.removeItem('item-bate-detail-before-meouObj');
  }

  @Bind()
  handleDetailDsUpdate({ name, value }) {
    const { detailDsList } = this.state;
    if (detailDsList.length <= 1) return;
    for (let i = 0; i < detailDsList.length; i++) {
      detailDsList[i].current.set(name, value);
    }
    this.setState(() => ({ detailDsList }));
  }

  /**
   * @description: 采购加载完成事件
   * @param {*}
   * @return {*}
   */
  @Bind()
  handleScmQueryAfter() {
    if (this.isCreatePage) {
      this.handleUpdateLov(
        this.state.selectLovDate[this.state.activeMeOuIndex],
        this.state.activeMeOuIndex
      );
    } else {
      this.handleUpdateLov(this.state.selectLovDate[this.state.clickMeOuIndex], 0);
    }
  }

  /**
   * 刷新页面数据
   */
  @Bind()
  refreshPage(index = 0) {
    this.setState(() => ({ loading: true }));
    const { itemId } = this.props.match.params;
    this.state.detailDsList[index].setQueryParameter('itemId', itemId);
    this.state.detailDsList[index]
      .query()
      .then((res) => {
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
        this.setState(() => ({ loading: false }));
      })
      .catch((err) => {
        console.log(err, 'err');
        this.setState(() => ({ loading: false }));
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
    const validateValue = await this.state.detailDsList[this.state.activeMeOuIndex].validate(
      false,
      false
    );

    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    if (
      !(
        this.state.detailDsList[this.state.activeMeOuIndex].children.itemWm.current &&
        this.state.detailDsList[this.state.activeMeOuIndex].children.itemWm.current.get('wmOuId')
      )
    ) {
      notification.error({
        message: intl.get('lmds.item.view.message.valid.WmOu').d('当前选中工厂没有对应的仓储中心'),
      });
      return;
    }
    const res = await this.state.detailDsList[this.state.activeMeOuIndex].submit(false, false);
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
      if (this.isCreatePage) {
        const pathname = `/lmds/item-multiplant/create`;
        dispatch(
          routerRedux.push({
            pathname,
          })
        );
        const resObj = res.content[0];
        for (let i = 0; i < this.state.detailDsList.length; i++) {
          if (i !== this.state.activeMeOuIndex) {
            // 防止一个物料新增提交后不能继续别的物料提交
            this.state.detailDsList[i].current.set('itemId', resObj.itemId);
            this.state.detailDsList[i].current.set('status', 'update');
            this.state.detailDsList[i].current.set(
              'objectVersionNumber',
              resObj.objectVersionNumber
            );
          }
        }
        this.setState(() => ({ createHaveMeOuSubmit: true }));
      } else {
        this.state.detailDsList[0].query();
      }
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
  async handleMeOuChange(lovRecordList) {
    const lovRecord = Array.isArray(lovRecordList) ? lovRecordList : [lovRecordList];
    const { detailDsList } = this.state;
    const len = lovRecord.length - detailDsList.length;
    const myLen = detailDsList.length;
    if (detailDsList.length < lovRecord.length && this.isCreatePage) {
      for (let h = 0; h < len; h++) {
        const ds = new DataSet(ItemDetailDS());
        if (!ds.current) {
          if (detailDsList && detailDsList[0] && detailDsList[0].current) {
            const createInit = detailDsList[0].toData()[0];
            const newCreateInit = {};
            Object.keys(createInit).forEach((item) => {
              if (
                item !== 'itemAps' &&
                item !== 'itemScm' &&
                item !== 'itemSop' &&
                item !== 'itemMe' &&
                item !== 'itemWm'
              ) {
                newCreateInit[item] = createInit[item];
              }
            });
            ds.create(newCreateInit);
          } else {
            ds.create({});
          }
        }
        ds.children.itemAps.create({ enabledFlag: true, planFlag: true }, 0);
        ds.children.itemScm.create({ enabledFlag: true }, 0);
        ds.children.itemSop.create({ enabledFlag: true }, 0);
        ds.children.itemMe.create({ enabledFlag: true }, 0);
        ds.children.itemWm.create({ enabledFlag: true }, 0);
        detailDsList.push(ds);
      }
    }
    this.setState(() => ({
      selectLovDate: lovRecord,
      detailDsList,
      activeMeOuIndex: 0,
      clickMeOuIndex: 0,
    }));
    if (!this.isCreatePage) {
      const { meOuId } = lovRecord[0];
      this.state.detailDsList[0].children.itemAps.setQueryParameter('meOuId', meOuId);
      this.state.detailDsList[0].children.itemScm.setQueryParameter('meOuId', meOuId);
      this.state.detailDsList[0].children.itemSop.setQueryParameter('meOuId', meOuId);
      this.state.detailDsList[0].children.itemMe.setQueryParameter('meOuId', meOuId);
      this.state.detailDsList[0].children.itemWm.setQueryParameter('meOuId', meOuId);
      await this.refreshPage();
    } else {
      for (let j = 0; j < myLen; j++) {
        if (this.state.detailDsList[j].children.itemAps.current) {
          this.state.detailDsList[j].children.itemAps.records.clear();
        }
        if (this.state.detailDsList[j].children.itemScm.current) {
          this.state.detailDsList[j].children.itemScm.records.clear();
        }
        if (this.state.detailDsList[j].children.itemSop.current) {
          this.state.detailDsList[j].children.itemSop.records.clear();
        }
        if (this.state.detailDsList[j].children.itemMe.current) {
          this.state.detailDsList[j].children.itemMe.records.clear();
        }
        if (this.state.detailDsList[j].children.itemWm.current) {
          this.state.detailDsList[j].children.itemWm.records.clear();
        }
      }
    }
    await this.handleUpdateLov(lovRecord[0], 0, lovRecord);
    const organizationList = [];
    for (let i = 0; i < lovRecord.length; i++) {
      const { organizationName, meOuId: meOuids } = lovRecord[i];
      if (i === 0) {
        organizationList.push({ organizationName, meOuId: meOuids, checked: true });
      } else {
        organizationList.push({ organizationName, meOuId: meOuids, checked: false });
      }
    }
    if (this.isCreatePage) {
      for (let s = 0; s < lovRecord.length; s++) {
        this.state.detailDsList[s].current.set('meOuObj', lovRecord);
        this.state.detailDsList[s].children.itemAps.addEventListener(
          'load',
          this.handleScmQueryAfter
        );
        this.state.detailDsList[s].children.itemScm.addEventListener(
          'load',
          this.handleScmQueryAfter
        );
        this.state.detailDsList[s].children.itemSop.addEventListener(
          'load',
          this.handleScmQueryAfter
        );
        this.state.detailDsList[s].children.itemMe.addEventListener(
          'load',
          this.handleScmQueryAfter
        );
        this.state.detailDsList[s].children.itemWm.addEventListener(
          'load',
          this.handleScmQueryAfter
        );
        this.state.detailDsList[s].addEventListener('update', this.handleDetailDsUpdate);
      }
    } else {
      for (let s = 0; s < lovRecord.length; s++) {
        this.state.detailDsList[0].current.set('meOuObj', lovRecord);
        this.state.detailDsList[0].children.itemAps.addEventListener(
          'load',
          this.handleScmQueryAfter
        );
        this.state.detailDsList[0].children.itemScm.addEventListener(
          'load',
          this.handleScmQueryAfter
        );
        this.state.detailDsList[0].children.itemSop.addEventListener(
          'load',
          this.handleScmQueryAfter
        );
        this.state.detailDsList[0].children.itemMe.addEventListener(
          'load',
          this.handleScmQueryAfter
        );
        this.state.detailDsList[0].children.itemWm.addEventListener(
          'load',
          this.handleScmQueryAfter
        );
        this.state.detailDsList[0].addEventListener('update', this.handleDetailDsUpdate);
      }
    }
    this.setState(() => ({ organizationList, selectLovDate: lovRecord }));
  }

  /**
   * @description: 改变Lov后给采购中心等赋值
   * @param {*}
   * @return {*}
   */
  @Bind()
  handleUpdateLov(lovRecord, activeMeOuIndex, lovList = this.state.selectLovDate) {
    if (Object.keys(lovRecord).length < 1) return;
    const {
      current,
      children: { itemAps, itemScm, itemSop, itemWm, itemMe },
    } = this.state.detailDsList[activeMeOuIndex];
    current.set('meOuObj', lovList);
    if (!itemAps.current) {
      itemAps.create({ enabledFlag: true }, 0);
    }
    if (!itemScm.current) {
      itemScm.create({ enabledFlag: true }, 0);
    }
    if (!itemSop.current) {
      itemSop.create({ enabledFlag: true }, 0);
    }
    if (!itemWm.current) {
      itemWm.create({ enabledFlag: true }, 0);
    }
    if (!itemMe.current) {
      itemMe.create({ enabledFlag: true }, 0);
    }
    if (!isEmpty(lovRecord)) {
      itemAps.current.set('meOuObj', lovRecord);
      itemScm.current.set('meOuObj', lovRecord);
      itemSop.current.set('meOuObj', lovRecord);
      itemWm.current.set('meOuObj', lovRecord);
      itemMe.current.set('meOuObj', lovRecord);
      itemAps.current.set('apsOuName', lovRecord.apsOu || '');
      itemAps.current.set('apsOuId', lovRecord.apsOuId || '');
      itemAps.current.set('apsOuCode', lovRecord.apsOuCode || '');
      itemScm.current.set('scmOuName', lovRecord.scmOu || '');
      itemScm.current.set('scmOuId', lovRecord.scmOuId || '');
      itemScm.current.set('scmOuCode', lovRecord.scmOuCode || '');
      itemScm.current.set('organizationObj', {
        organizationId: lovRecord.meOuId,
        organizationCode: lovRecord.meOuCode,
        organizationName: lovRecord.organizationName,
      });
      itemAps.current.set('organizationObj', {
        organizationId: lovRecord.meOuId,
        organizationCode: lovRecord.meOuCode,
        organizationName: lovRecord.organizationName,
      });
      itemWm.current.set('wmOuName', lovRecord.wmOuName || '');
      itemWm.current.set('wmOuId', lovRecord.wmOuId || '');
      itemWm.current.set('wmOuCode', lovRecord.wmOuCode || '');
      itemWm.current.set('organizationObj', {
        organizationId: lovRecord.meOuId,
        organizationCode: lovRecord.meOuCode,
        organizationName: lovRecord.organizationName,
      });
      itemSop.current.set('sopOuName', lovRecord.sopOu || '');
      itemSop.current.set('sopOuId', lovRecord.sopOuId || '');
      itemSop.current.set('sopOuCode', lovRecord.sopOuCode || '');
      itemSop.current.set('apsOuName', lovRecord.apsOu || '');
      itemSop.current.set('apsOuId', lovRecord.apsOuId || '');
      itemSop.current.set('apsOuCode', lovRecord.apsOuCode || '');
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
      this.setState(() => ({
        organizationList: [{ organizationName: '', meOuId: '', checked: true }],
      }));
    }
    if (
      this.isCreatePage &&
      this.state.detailDsList[activeMeOuIndex].current &&
      this.state.detailDsList[activeMeOuIndex].current.get('uomObj')
    ) {
      this.handleUomChange(this.state.detailDsList[activeMeOuIndex].current.get('uomObj'));
    } else if (
      this.state.detailDsList[activeMeOuIndex].current &&
      this.state.detailDsList[activeMeOuIndex].current.get('uomObj')
    ) {
      this.handleUomChange(this.state.detailDsList[0].current.get('uomObj'));
    }
    if (this.isCreatePage) {
      localStorage.setItem('lmds-item-bate-active-meou-index', activeMeOuIndex);
    } else {
      localStorage.setItem('lmds-item-bate-active-meou-index', this.state.clickMeOuIndex);
    }
  }

  /**
   * 图片上传成功
   * @param res 返回response
   * @param file 上传文件信息
   */
  @Bind()
  async handleUploadSuccess(res, file) {
    const { current } = this.state.detailDsList[this.state.activeMeOuIndex];
    const currentFile = file;
    if (res && !res.failed) {
      current.set('fileUrl', res);
      if (current.toData() && current.toData().itemId) {
        await this.state.detailDsList[this.state.activeMeOuIndex].submit();
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
    this.state.detailDsList[this.state.activeMeOuIndex].current.set('fileUrl', '');
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
    const myLen = this.state.detailDsList.length;
    for (let i = 0; i < myLen; i++) {
      const {
        current,
        children: { itemAps, itemScm, itemSop, itemWm, itemMe },
      } = this.state.detailDsList[i];
      current.reset();
      itemAps.current.reset();
      itemScm.current.reset();
      itemSop.current.reset();
      itemWm.current.reset();
      itemMe.current.reset();
    }
  }

  /**
   * @description: 改变单位Lov
   * @param {*}
   * @return {*}
   */
  @Bind()
  handleUomChange(rec) {
    if (!this.isCreatePage) {
      if (rec) {
        this.state.detailDsList[0].children.itemScm.current.set('uomObj', rec);
        this.state.detailDsList[0].children.itemSop.current.set('uomObj', rec);
        this.state.detailDsList[0].children.itemWm.current.set('uomObj', rec);
      } else {
        this.state.detailDsList[0].children.itemScm.current.set('uomObj', null);
        this.state.detailDsList[0].children.itemSop.current.set('uomObj', null);
        this.state.detailDsList[0].children.itemWm.current.set('uomObj', null);
      }
    } else {
      const myLen = this.state.detailDsList.length;
      for (let i = 0; i < myLen; i++) {
        if (!this.state.detailDsList[i]?.children?.itemAps?.current) {
          this.state.detailDsList[i].children.itemAps.create(
            { enabledFlag: true, planFlag: true },
            0
          );
          this.state.detailDsList[i].children.itemScm.create({ enabledFlag: true }, 0);
          this.state.detailDsList[i].children.itemSop.create({ enabledFlag: true }, 0);
          this.state.detailDsList[i].children.itemMe.create({ enabledFlag: true }, 0);
          this.state.detailDsList[i].children.itemWm.create({ enabledFlag: true }, 0);
        }
        if (rec) {
          this.state.detailDsList[i].children.itemScm.current.set('uomObj', rec);
          this.state.detailDsList[i].children.itemSop.current.set('uomObj', rec);
          this.state.detailDsList[i].children.itemWm.current.set('uomObj', rec);
        } else {
          this.state.detailDsList[i].children.itemScm.current.set('uomObj', null);
          this.state.detailDsList[i].children.itemSop.current.set('uomObj', null);
          this.state.detailDsList[i].children.itemWm.current.set('uomObj', null);
        }
      }
    }
  }

  /**
   * @description: 切换选中标签
   * @param {*}
   * @return {*}
   */
  @Bind()
  async handleTagChange(checked, index) {
    if (checked) {
      const organizationList = this.state.organizationList.map((item, j) => {
        if (index === j) {
          return { ...item, checked: true };
        } else {
          return { ...item, checked: false };
        }
      });
      if (!this.isCreatePage) {
        const { meOuId } = this.state.selectLovDate[index];
        this.state.detailDsList[0].children.itemAps.setQueryParameter('meOuId', meOuId);
        this.state.detailDsList[0].children.itemScm.setQueryParameter('meOuId', meOuId);
        this.state.detailDsList[0].children.itemSop.setQueryParameter('meOuId', meOuId);
        this.state.detailDsList[0].children.itemMe.setQueryParameter('meOuId', meOuId);
        this.state.detailDsList[0].children.itemWm.setQueryParameter('meOuId', meOuId);
        await this.refreshPage();
        this.handleUpdateLov(this.state.selectLovDate[index], 0);
        this.setState(() => ({ organizationList, activeMeOuIndex: 0, clickMeOuIndex: index }));
      } else {
        this.handleUpdateLov(this.state.selectLovDate[index], index);
        this.setState(() => ({ organizationList, activeMeOuIndex: index }));
      }
    }
  }

  /**
   * @description: 头部标签渲染
   * @param {*}
   * @return {*}
   */
  @Bind()
  meOuRender() {
    const { organizationList } = this.state;
    return organizationList.map((item, i) => (
      <Tag.CheckableTag
        checked={item.checked || false}
        onChange={(checked) => this.handleTagChange(checked, i)}
      >
        {item.organizationName}
      </Tag.CheckableTag>
    ));
  }

  /**
   * @description: 物料失焦
   * @param {*}
   * @return {*}
   */
  @Bind()
  handleItemBlur() {
    const itemCode =
      (this.state.detailDsList[this.state.activeMeOuIndex] &&
        this.state.detailDsList[this.state.activeMeOuIndex].current &&
        this.state.detailDsList[this.state.activeMeOuIndex].current.get('itemCode')) ||
      '';
    if (itemCode) {
      itemBageMain({ itemCode })
        .then((res) => {
          if (res && res.content && res.content.length > 0) {
            let itemId = '';
            for (let i = 0; i < res.content.length; i++) {
              const { itemCode: itemCodeServe } = res.content[i];
              if (itemCode === itemCodeServe) {
                itemId = res?.content[i]?.itemId;
              }
            }
            if (!itemId) return;
            const { history } = this.props;
            notification.warning({ message: '该物料已经存在，直接进入详情页' });
            history.push(`/lmds/item-multiplant/detail/${itemId}`);
          }
        })
        .catch((err) => console.log(err));
    }
  }

  render() {
    const { organizationList, fileList, loading } = this.state;
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
          backPath="/lmds/item-multiplant/list"
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
        <Content>
          <div className="item-content">
            <div className="item-content-main">
              <section>
                <h2>基础数据</h2>
                <Form
                  dataSet={this.state.detailDsList[this.state.activeMeOuIndex]}
                  columns={1}
                  labelWidth={80}
                  style={{ paddingRight: '16px' }}
                >
                  <TextField
                    name="itemCode"
                    disabled={!this.isCreatePage || this.state.createHaveMeOuSubmit}
                    onBlur={this.handleItemBlur}
                  />
                  <IntlField name="description" />
                  <Lov
                    name="uomObj"
                    disabled={!this.isCreatePage || this.state.createHaveMeOuSubmit}
                    noCache
                    onChange={this.handleUomChange}
                  />
                  <Select name="itemType" />
                  <Lov name="mdsCategoryObj" noCache />
                  <Switch name="enabledFlag" />
                </Form>
                <Collapse bordered={false} className="item-left-list">
                  <Panel header="常规数据" key="1">
                    <Form
                      dataSet={this.state.detailDsList[this.state.activeMeOuIndex]}
                      columns={1}
                      labelWidth={80}
                    >
                      <IntlField name="itemAlias" />
                      <TextField name="shortCode" />
                      <TextField name="designCode" />
                      <TextField name="specification" />
                      <Lov name="secondUomObj" noCache />
                      <NumberField name="uomConversionValue" />
                    </Form>
                  </Panel>
                  <Panel header="规格数据" key="2">
                    <Form
                      dataSet={this.state.detailDsList[this.state.activeMeOuIndex]}
                      columns={1}
                      labelWidth={80}
                    >
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
                    </Form>
                  </Panel>
                  <Panel header="其他数据" key="3">
                    <Form
                      dataSet={this.state.detailDsList[this.state.activeMeOuIndex]}
                      columns={1}
                      labelWidth={80}
                    >
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
                  </Panel>
                </Collapse>
              </section>
              <section>
                <div className="item-right-header">
                  <div>{organizationList && organizationList.length > 0 && this.meOuRender()}</div>
                  <div>
                    <Lov
                      dataSet={this.state.detailDsList[this.state.activeMeOuIndex]}
                      name="meOuObj"
                      onChange={this.handleMeOuChange}
                      // disabled={!this.isCreatePage}
                      mode="button"
                      clearButton={false}
                      icon="swap_vert"
                      funcType="flat"
                      noCache
                      color="green"
                    >
                      切换工厂
                    </Lov>
                  </div>
                </div>
                <Card key="item-line" bordered={false} className={DETAIL_CARD_TABLE_CLASSNAME}>
                  <Tabs defaultActiveKey="scm" onChange={this.handleTabChange} tabPosition="left">
                    {this.tabsArr.map((tab) => (
                      <TabPane
                        tab={
                          <span>
                            <Icon type={tab.icon} />
                            {intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
                          </span>
                        }
                        key={tab.code}
                      >
                        {tab.component}
                      </TabPane>
                    ))}
                  </Tabs>
                </Card>
              </section>
            </div>
            {loading && (
              <div className="bottom-my-spin">
                <Spin />
              </div>
            )}
          </div>
        </Content>
      </Fragment>
    );
  }
}
