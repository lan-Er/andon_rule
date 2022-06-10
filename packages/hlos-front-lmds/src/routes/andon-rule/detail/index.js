/**
 * @Description: 安灯规则详情页面--Index
 * @Author: wenhao.li<wenhao.li@zone-cloud.com>
 * @Date: 2021-10-25 14:06:38
 * @LastEditors: wenhao.li
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { DataSet, Form, Select, TextField, IntlField, Switch, Button, Lov } from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';

import RuleLineList from './RuleLineList';
import RuleDetailDS from '../stores/RuleDetailDS';

const preCode = 'lmds.andonRule';
const commonCode = 'hzero.common';

@connect()
@formatterCollections({
  code: ['lmds.andonRule', 'lmds.common'],
})
export default class DetailPage extends Component {
  detailDS = new DataSet({
    ...RuleDetailDS(),
  });

  get isCreatePage() {
    const { match } = this.props;
    const { andonRuleId } = match.params;
    return !andonRuleId;
  }

  async componentDidMount() {
    if (this.isCreatePage) {
      await this.detailDS.create({});
    } else {
      await this.refreshPage();
    }
  }

  /**
   * 请求数据 刷新页面
   */
  @Bind()
  async refreshPage() {
    const { andonRuleId } = this.props.match.params;
    this.detailDS.queryParameter = { andonRuleId };
    await this.detailDS.query();
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
      // 新建页面创建数据成功后跳转到详情页面
      const pathname = `/lmds/andon-rule/detail/${res.content[0].andonRuleId}`;
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
    return (
      <Fragment>
        <Header
          title={
            this.isCreatePage
              ? intl.get(`${commonCode}.view.title.create`).d('新建')
              : intl.get(`${commonCode}.view.title.edit`).d('编辑')
          }
          backPath="/lmds/andon-rule/list"
        >
          <Button icon="save" color="primary" onClick={this.handleSubmit}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Card
            key="andon-rule-header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.andonRule`).d('安灯规则')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={4}>
              <Lov noCache name="organizationObj" disabled={!this.isCreatePage} />
              <Select name="andonRuleType" disabled={!this.isCreatePage} />
              <TextField name="andonRuleCode" disabled={!this.isCreatePage} />
              <IntlField name="andonRuleName" />
              <IntlField name="andonRuleAlias" />
              <IntlField name="description" />
              <Switch name="enabledFlag" />
            </Form>
          </Card>
          <Card
            key="andon-rule-List"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.andonRuleKey`).d('安灯规则项')}</h3>}
          >
            <RuleLineList detailDS={this.detailDS} />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
