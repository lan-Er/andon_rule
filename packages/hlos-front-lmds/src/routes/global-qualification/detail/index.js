/**
 * @Description: 资质详情页--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-03 11:25:13
 * @LastEditors: yiping.liu
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { DataSet, Button, Select, TextField, IntlField, Switch, Form } from 'choerodon-ui/pro';
import { Card, Tabs } from 'choerodon-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { routerRedux } from 'dva/router';

import QualificationDetail from '../stores/QualificationDetail';
import RangeDetail from './RangeDetail';
import AssignDetail from './AssignDetail';

const preCode = 'lmds.qualification';

@connect()
@formatterCollections({
  code: ['lmds.common', 'lmds.qualification', 'lmds.privilege'],
})
export default class QualificationDetails extends Component {
  get isCreatePage() {
    const { match } = this.props;
    const { qualificationId } = match.params;
    return !qualificationId;
  }

  tabKey = 'range';

  detailDS = new DataSet({
    ...QualificationDetail(),
  });

  /**
   * 监听标签页变化
   *
   * @param {*} key
   * @memberof QualificationDetails
   */
  @Bind()
  handleTabChange(key) {
    if (key === 'range') {
      this.tabKey = 'range';
    }
    if (key === 'assign') {
      this.tabKey = 'assign';
    }
  }

  async componentDidMount() {
    if (this.isCreatePage) {
      await this.detailDS.create({});
    } else {
      await this.refreshPage();
    }
  }

  /**
   * 刷新
   *
   * @memberof QualificationDetails
   */
  @Bind()
  async refreshPage() {
    const { qualificationId } = this.props.match.params;
    this.detailDS.queryParameter = { qualificationId };
    await this.detailDS.query();
    await this.detailDS.children.ranges.query();
    await this.detailDS.children.assigns.query();
  }

  /**
   *新增
   *
   * @memberof QualificationDetails
   */
  @Bind()
  async handleAddLine() {
    if (this.tabKey === 'range') {
      this.detailDS.children.ranges.create({}, 0);
    }
    if (this.tabKey === 'assign') {
      this.detailDS.children.assigns.create({}, 0);
    }
  }

  /**
   *
   * 保存
   * @returns
   * @memberof QualificationDetails
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
      const pathname = `/lmds/qualification/detail/${res.content[0].qualificationId}`;
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
          backPath="/lmds/qualification/list"
        >
          <Button icon="save" color="primary" onClick={this.handleSubmit}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Card
            key="header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.qualification`).d('资质')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={4}>
              <Select name="qualificationType" disabled={!this.isCreatePage} />
              <TextField name="qualificationCode" disabled={!this.isCreatePage} />
              <IntlField name="qualificationName" />
              <IntlField name="qualificationAlias" />
              <IntlField name="description" />
              <TextField name="qualificationCategory" />
              <Select name="qualificationLevel" />
              <Switch name="enabledFlag" />
            </Form>
          </Card>
          <Card
            key="List"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.qualificationRange`).d('资质明细')}</h3>}
          >
            <Button
              key="playlist_add"
              icon="playlist_add"
              funcType="flat"
              color="primary"
              onClick={this.handleAddLine}
            >
              {intl.get('hzero.common.button.create').d('新增')}
            </Button>
            <Tabs defaultActiveKey="range" onChange={this.handleTabChange}>
              <Tabs.TabPane tab={intl.get(`${preCode}.view.title.range`).d('明细范围')} key="range">
                <RangeDetail detailDS={this.detailDS} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={intl.get(`${preCode}.view.title.assign`).d('资质分配')}
                key="assign"
              >
                <AssignDetail detailDS={this.detailDS} />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Content>
      </Fragment>
    );
  }
}
