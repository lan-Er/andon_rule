/**
 * @Description: 规则详情页面--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 14:06:38
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { DataSet, Form, Select, TextField, IntlField, Switch, Button } from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

import RuleKeyList from './RuleKeyList';
import RuleDetailDS from '../stores/RuleDetailDS';

const preCode = 'lmds.rule';
const organizationId = getCurrentOrganizationId();

@connect()
@formatterCollections({
  code: ['lmds.rule'],
})
export default class DetailPage extends Component {
  detailDS = new DataSet(
    {
      ...RuleDetailDS(),
    },
    { cacheState: false }
  );

  get isCreatePage() {
    const { match } = this.props;
    const { ruleId } = match.params;
    return !ruleId;
  }

  async componentDidMount() {
    if (this.isCreatePage) {
      await this.detailDS.create({});
    } else {
      await this.refreshPage();
    }
  }

  /**
   * 刷新页面数据
   */
  @Bind()
  async refreshPage() {
    const { ruleId } = this.props.match.params;
    this.detailDS.queryParameter = { ruleId };
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
      const pathname = `/lmds/rule/detail/${res.content[0].ruleId}`;
      dispatch(
        routerRedux.push({
          pathname,
        })
      );
    } else if (!this.isCreatePage) {
      await this.refreshPage();
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
          backPath="/lmds/rule/list"
        >
          <Button icon="save" color="primary" onClick={this.handleSubmit}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          {this.isCreatePage ? (
            ''
          ) : (
            <ExcelExport
              requestUrl={`${HLOS_LMDS}/v1/${organizationId}/rule-keys/excel`}
              queryParams={{ ruleId: this.props.match.params.ruleId }}
            />
          )}
        </Header>
        <Content>
          <Card
            key="rule-header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.rule`).d('规则')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={4}>
              <Select name="ruleClass" disabled={!this.isCreatePage} />
              <Select name="ruleType" disabled={!this.isCreatePage} />
              <TextField name="ruleCode" disabled={!this.isCreatePage} />
              <IntlField name="ruleName" />
              <IntlField name="ruleAlias" />
              <IntlField name="description" />
              <TextField name="ruleCategory" />
              <Switch name="enabledFlag" />
            </Form>
          </Card>
          <Card
            key="rule-key-list"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.ruleKey`).d('规则项')}</h3>}
          >
            <RuleKeyList detailDS={this.detailDS} />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
