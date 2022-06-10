/*
 * @Author: zhang yang
 * @Description: 数据收集项 详情 Index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:00
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { DataSet, Form, Select, TextField, IntlField, Switch, Button } from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';

import ContextDetail from './ContextDetail';
import CollectorDetailDS from '../stores/CollectorDetailDS';

const preCode = 'lmds.collector';

@connect()
@formatterCollections({ code: ['lmds.collector'] })
export default class CollectorDetailPage extends Component {
  detailDS = new DataSet({
    ...CollectorDetailDS(),
  });

  get isCreatePage() {
    const { match } = this.props;
    const { collectorId } = match.params;
    return !collectorId;
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
    const { collectorId } = this.props.match.params;
    this.detailDS.queryParameter = { collectorId };
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
      const pathname = `/lmds/collector/detail/${res.content[0].collectorId}`;
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
          backPath="/lmds/collector/list"
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
            title={<h3>{intl.get(`${preCode}.view.title.collector`).d('数据收集项')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={4}>
              <Select name="collectorType" disabled={!this.isCreatePage} />
              <TextField name="collectorCode" disabled={!this.isCreatePage} />
              <IntlField name="collectorName" />
              <IntlField name="collectorAlias" />
              <IntlField name="description" />
              <Select name="collectorRule" />
              <Switch name="enabledFlag" />
            </Form>
          </Card>
          <Card
            key="List"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.collectorContext`).d('收集项明细')}</h3>}
          >
            <ContextDetail detailDS={this.detailDS} />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
