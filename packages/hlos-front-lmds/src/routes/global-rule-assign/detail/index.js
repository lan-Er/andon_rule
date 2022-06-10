/*
 * @Author: zhang yang
 * @Description: 规则分配编辑-index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-26 14:39:55
 */

import * as React from 'react';
import intl from 'utils/intl';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import { DataSet, Lov, Form, Switch, Button } from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import withProps from 'utils/withProps';

import { queryRuleList } from '@/services/api';

import { isEmpty } from 'lodash';
import RuleItem from './RuleItem';
import RuleItemDS from '../stores/RuleItemDS';
import RuleDetailDS from '../stores/RuleDetailDS';

const preCode = 'lmds.ruleAssign';

@formatterCollections({
  code: ['lmds.ruleAssign', 'lmds.common'],
})
@withProps(
  () => {
    const ruleDetailDS = new DataSet({
      ...RuleDetailDS(),
      children: {
        ruleItemDS: new DataSet({ ...RuleItemDS() }),
      },
    });
    return {
      ruleDetailDS,
    };
  },
  { cacheState: false }
)
export default class RuleDetail extends React.Component {

  get isCreatePage() {
    const { match } = this.props;
    const { assignId } = match.params;
    return !assignId;
  }

  async componentDidMount() {
    if (this.isCreatePage) {
      await this.props.ruleDetailDS.create({});
    } else {
      await this.refreshPage();
    }
  }

  @Bind()
  async refreshPage() {
    const { match, ruleDetailDS } = this.props;
    ruleDetailDS.setQueryParameter('assignId', match.params.assignId);
    await ruleDetailDS.query();
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const { dispatch, match, ruleDetailDS } = this.props;
    const validateValue = await ruleDetailDS.validate(false, false);

    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await ruleDetailDS.submit();
    if (res === undefined) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }
    if (isEmpty(match.params.assignId)) {
      if (res && res.content && res.content[0]) {
        // 新建页面创建数据成功后跳转到详情页面
        const pathname = `/lmds/rule-assign/detail/${res.content[0].assignId}`;
        dispatch(
          routerRedux.push({
            pathname,
          })
        );
      }
    }
  }

  /**
   * 修改规则
   * 变更规则项
   */
  @Bind
  async handleRefRuleItem(record) {
    const { ruleDetailDS } = this.props;
    ruleDetailDS.children.ruleItemDS.reset();
    if (record && record.ruleId) {
      const res = await queryRuleList({ ruleId: record.ruleId });
      res.content.map(item => {
        ruleDetailDS.children.ruleItemDS.create({
          ...item,
        });
        return null;
      });
    }
  }

  render() {
    const { ruleDetailDS } = this.props;
    const ruleProps = {
       ruleDetailDS,
       onSubmit: this.handleSubmit,
    };
    return (
      <React.Fragment>
        <Header
          title={
            this.isCreatePage
              ? intl.get(`${preCode}.view.title.create`).d('新建')
              : intl.get(`${preCode}.view.title.edit`).d('编辑')
          }
          backPath="/lmds/rule-assign/list"
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
            title={<h3>{intl.get(`${preCode}.view.title.ruleAssign`).d('规则分配')}</h3>}
          >
            <Form dataSet={ruleDetailDS} columns={4}>
              <Lov
                noCache
                name="ruleObj"
                disabled={!this.isCreatePage}
                onChange={record => this.handleRefRuleItem(record)}
              />
              <Lov name="organization" noCache />
              <Lov name="resource" noCache />
              <Lov name="itemCategory" noCache />
              <Lov name="item" noCache />
              <Lov name="operation" noCache />
              <Switch name="enabledFlag" />
            </Form>
          </Card>
          <Card
            key="line"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.ruleAssignItem`).d('规则项')}</h3>}
          >
            <RuleItem {...ruleProps} />
          </Card>
        </Content>
      </React.Fragment>
    );
  }
}
