/* eslint-disable react/jsx-no-duplicate-props */
/**
 * @Description: 用户设置详情页--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-10 16:52:11
 * @LastEditors: yiping.liu
 */
import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Button, Form, DataSet, Lov, TextField } from 'choerodon-ui/pro';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import { Card } from 'choerodon-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { routerRedux } from 'dva/router';

import UserDS from '../stores/UserDS';
import './style.less';

const preCode = 'lmds.userSetting';
const commonCode = 'lmds.common';

@formatterCollections({
  code: [`${preCode}`],
})
export default class UserSettingDetails extends Component {
  get isCreatePage() {
    const { match } = this.props;
    const { settingId } = match.params;
    return !settingId;
  }

  detailDS = new DataSet({
    ...UserDS(),
  });

  async componentDidMount() {
    if (this.isCreatePage) {
      await this.detailDS.create({});
    } else {
      await this.refreshPage();
    }
  }

  /**
   *刷新
   *
   * @memberof UserSettingDetails
   */
  @Bind()
  async refreshPage() {
    const { settingId } = this.props.match.params;
    this.detailDS.queryParameter = { settingId };
    await this.detailDS.query().then((res) => {
      let itemCodes;
      let itemIds;
      if (res.content[0].commonItems) {
        itemCodes = res.content[0].commonItems.split('#');
      }
      if (res.content[0].ids) {
        itemIds = res.content[0].ids.split('-');
      }
      const result = itemIds.map((itemId, i) => ({ itemId, itemCode: itemCodes[i] }));
      this.detailDS.current.set('itemObj', result);
      const userName = res.content[0].userName.split(' ');
      const user = { id: res.content[0].userId, loginName: userName[1] };
      this.detailDS.current.set('userObj', user);
      this.detailDS.current.set('realName', userName[0]);
    });
  }

  /**
   *保存
   *
   * @returns
   * @memberof UserSettingDetails
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
      const pathname = `/lmds/user-setting/detail/${res.content[0].settingId}`;
      dispatch(
        routerRedux.push({
          pathname,
        })
      );
      if (!this.isCreatePage) {
        this.refreshPage();
      }
    }
  }

  render() {
    return (
      <Fragment>
        <Header
          title={
            this.isCreatePage
              ? intl.get(`${preCode}.view.title.create`).d('新建')
              : intl.get(`${preCode}.view.title.edit`).d('编辑')
          }
          backPath="/lmds/user-setting/list"
        >
          <Button icon="save" color="primary" onClick={this.handleSubmit}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Card key="header" bordered={false} className={DETAIL_CARD_CLASSNAME}>
            <Form dataSet={this.detailDS} className="realName" columns={3}>
              <Lov name="userObj" disabled={!this.isCreatePage} />
              <TextField name="realName" disabled />
            </Form>
          </Card>
          <Card
            key="header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>{intl.get(`${commonCode}.model.org`).d('组织')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={3}>
              <Lov name="meOuObj" />
              <Lov name="apsOuObj" />
              <Lov name="scmOuObj" />
              <Lov name="sopOuObj" />
              <Lov name="wmOuObj" />
              <Lov name="warehouseObj" />
              <Lov name="organizationObj" />
            </Form>
          </Card>
          <Card
            key="header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.model.me`).d('制造属性')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={3}>
              <Lov name="prodLineObj" />
              <Lov name="workcellObj" />
              <Lov name="workerObj" />
              <Lov name="ruleObj" />
            </Form>
          </Card>
          <Card
            key="header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.model.aps`).d('计划属性')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={2}>
              <TextField name="planStartDateFrom" />
              <TextField name="planStartDateTo" />
              <TextField name="planEndDateFrom" />
              <TextField name="planEndDateTo" />
            </Form>
          </Card>
          <Card
            key="header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.model.other`).d('其他属性')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={2}>
              <Lov name="itemObj" />
              <Lov name="soTypeObj" />
              <Lov name="demandTypeObj" />
              <Lov name="poTypeObj" />
              <Lov name="moTypeObj" />
            </Form>
          </Card>
        </Content>
      </Fragment>
    );
  }
}
