/*
 * @Author: zhang yang
 * @Description: file content
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-21 11:12:39
 */

import React, { Component, Fragment } from 'react';
import intl from 'utils/intl';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { Card } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { DataSet, Lov, Form, Switch, TextField, IntlField, Button, Select } from 'choerodon-ui/pro';

import DetailList from './DetailItem';
import detailDs from '../stores/detailDs';

const preCode = 'lmds.inspectionGroup';

@formatterCollections({
  code: ['lmds.inspectionGroup'],
})
@connect()
export default class InspectionGroupLine extends Component {
  detailDs = new DataSet({
    ...detailDs(),
  });

  get isCreatePage() {
    const { match } = this.props;
    const { inspectionGroupId } = match.params;
    return !inspectionGroupId;
  }

  async componentDidMount() {
    if (this.isCreatePage) {
      await this.detailDs.create({});
    } else {
      await this.refreshPage();
    }
  }

  @Bind()
  async refreshPage() {
    const { inspectionGroupId } = this.props.match.params;
    this.detailDs.queryParameter = { inspectionGroupId };
    await this.detailDs.query();
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const { dispatch } = this.props;
    const validateValue = await this.detailDs.validate(false, false);

    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await this.detailDs.submit(false, false);
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
      const pathname = `/lmds/inspection-group/detail/${res.content[0].inspectionGroupId}`;
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
          backPath="/lmds/inspection-group/list"
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
            title={<h3>{intl.get(`${preCode}.view.title.inspectionGroup`).d('检验项目组')}</h3>}
          >
            <Form dataSet={this.detailDs} columns={4}>
              <Lov name="organizationObj" noCache disabled={!this.isCreatePage} />
              <TextField name="inspectionGroupCode" disabled={!this.isCreatePage} />
              <IntlField name="inspectionGroupName" />
              <IntlField name="inspectionGroupAlias" />
              <IntlField name="description" />
              <Select name="inspectionGroupType" disabled={!this.isCreatePage} />
              <Lov name="inspectionGroupCategory" noCache />
              <Switch name="enabledFlag" />
            </Form>
          </Card>
          <Card
            key="line"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.inspectionItem`).d('检验项')}</h3>}
          >
            <DetailList detailDs={this.detailDs} />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
