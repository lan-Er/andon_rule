/*
 * @Author: zhang yang
 * @Description: 时段 detail
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-09 09:39:45
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { DataSet, Form, Select, TextField, IntlField, Switch, Button, Lov } from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';

import PeriodDetail from './PeriodDetail';
import ContextDetailDS from '../stores/ContextDetailDS';

const preCode = 'lmds.period';

@connect()
@formatterCollections({
  code: ['lmds.period'],
})
export default class PeriodDetailPage extends Component {
  detailDS = new DataSet({
    ...ContextDetailDS(),
  });

  get isCreatePage() {
    const { match } = this.props;
    const { periodId } = match.params;
    return !periodId;
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
    const { periodId } = this.props.match.params;
    this.detailDS.queryParameter = { periodId };
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
      const pathname = `/lmds/period/detail/${res.content[0].periodId}`;
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
              ? intl.get(`${preCode}.view.title.create`).d('新建')
              : intl.get(`${preCode}.view.title.edit`).d('编辑')
          }
          backPath="/lmds/period/list"
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
            title={<h3>{intl.get(`${preCode}.view.title.period`).d('时段')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={4}>
              <Lov name="organizationObj" disabled={!this.isCreatePage} noCache />
              <Select name="periodType" disabled={!this.isCreatePage} />
              <TextField name="periodCode" disabled={!this.isCreatePage} />
              <IntlField name="periodName" />
              <IntlField name="description" />
              <Switch name="enabledFlag" />
            </Form>
          </Card>
          <Card
            key="List"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.periodContext`).d('时段明细')}</h3>}
          >
            <PeriodDetail detailDS={this.detailDS} />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
