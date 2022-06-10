/**
 * @Description: 工艺路线详情页面--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 14:06:38
 * @LastEditors: yu.na
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import {
  DataSet,
  Form,
  Select,
  TextField,
  IntlField,
  Button,
  Lov,
  DatePicker,
} from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';
import { copyApi } from '../../../services/routingService';
import RoutingOperationList from './RoutingOperationList';
import RoutingDetailDS from '../stores/RoutingDetailDS';

const preCode = 'lmds.routing';

@connect()
@formatterCollections({
  code: ['lmds.routing', 'lmds.common'],
})
export default class DetailPage extends Component {
  state = {
    copyFlag: false,
  };

  detailDS = new DataSet({
    ...RoutingDetailDS(),
  });

  get isCreatePage() {
    const { match } = this.props;
    const { routingId } = match.params;
    return !routingId;
  }

  async componentDidMount() {
    const {
      location: { state },
      dispatch,
    } = this.props;
    if (this.isCreatePage) {
      if (state) {
        if (state.mode === 'copy') {
          dispatch(
            routerRedux.push({
              pathname: `/lmds/neway/routing/detail/${state.routingId}`,
            })
          );
        } else if (state.mode === 'partCopy') {
          await this.detailDS.create(state, 0);
        }
      } else {
        await this.detailDS.create({});
      }
    } else {
      await this.refreshPage();
    }
  }

  /**
   * 请求数据 刷新页面
   */
  @Bind()
  async refreshPage() {
    const { routingId } = this.props.match.params;
    this.detailDS.queryParameter = { routingId };
    await this.detailDS.query().then((res) => {
      if (res && res.content && res.content[0]) {
        if (res.content[0].attribute01) {
          this.setState({
            copyFlag: true,
          });
          this.detailDS.current.set('routingCode', null);
        } else {
          this.setState({
            copyFlag: false,
          });
        }
      }
    });
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const { dispatch } = this.props;
    const { copyFlag } = this.state;
    const validateValue = await this.detailDS.validate(false, false);

    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }

    // 实现保存时传所有行而不是只传修改行
    this.detailDS.children.routingOperationList.forEach((record) => {
      record.set('_status', 'update');
    });

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

    if (copyFlag) {
      this.refreshPage();
      return;
    }
    if (res && res.content && res.content[0]) {
      // 新建页面创建数据成功后跳转到详情页面
      const pathname = `/lmds/neway/routing/detail/${res.content[0].routingId}`;
      dispatch(
        routerRedux.push({
          pathname,
        })
      );
    } else if (!this.isCreatePage) {
      this.refreshPage();
    }
  }

  @Bind()
  handleCopy() {
    copyApi(this.detailDS.current.data.routingId).then((res) => {
      if (res && res.failed) {
        notification.error({
          message: res.message,
        });
      }
      if (res && res.routingId) {
        const pathname = `/lmds/neway/routing/create`;
        this.props.dispatch(
          routerRedux.push({
            pathname,
            state: {
              mode: 'copy',
              routingId: res.routingId,
            },
          })
        );
      }
    });
  }

  @Bind()
  handlePartCopy() {
    const cloneData = this.detailDS.current.toData();
    cloneData.routingId = null;
    cloneData.routingCode = null;
    cloneData.routingOperationList.forEach((item) => {
      const _item = item;
      _item.routingId = null;
      _item.routingCode = null;
      _item.routingOperationId = null;
    });
    this.props.dispatch(
      routerRedux.push({
        pathname: '/lmds/neway/routing/create',
        state: {
          ...cloneData,
          mode: 'partCopy',
        },
      })
    );
  }

  render() {
    const {
      match: {
        params: { routingId },
      },
    } = this.props;
    const { copyFlag } = this.state;
    return (
      <Fragment>
        <Header
          title={
            this.isCreatePage
              ? intl.get(`${preCode}.view.title.createRouting`).d('新建工艺路线')
              : intl.get(`${preCode}.view.title.routingDetail`).d('工艺路线详情')
          }
          backPath="/lmds/neway/routing/list"
        >
          <Button icon="save" color="primary" onClick={this.handleSubmit}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button icon="content_copy" disabled={this.isCreatePage} onClick={this.handleCopy}>
            {intl.get('hzero.common.button.allCopy').d('全部复制')}
          </Button>
          <Button icon="content_copy" disabled={this.isCreatePage} onClick={this.handlePartCopy}>
            {intl.get('hzero.common.button.partCopy').d('部分复制')}
          </Button>
        </Header>
        <Content>
          <Card
            key="routing-header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.routing`).d('工艺路线')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={4}>
              <Select name="routingType" disabled={!this.isCreatePage && !copyFlag} />
              <TextField name="routingCode" disabled={!this.isCreatePage && !copyFlag} />
              <IntlField name="description" />
              <TextField name="routingVersion" />
              <Lov noCache name="organizationObj" />
              <Lov noCache name="itemObj" />
              <TextField name="itemDescription" disabled />
              <TextField name="alternate" />
              <DatePicker name="startDate" />
              <DatePicker name="endDate" />
            </Form>
          </Card>
          <Card
            key="routing-List"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.routingOperation`).d('工艺路线工序')}</h3>}
          >
            <RoutingOperationList detailDS={this.detailDS} routingId={routingId} />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
