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
import { DataSet, Lov, Form, IntlField, Button, TextField } from 'choerodon-ui/pro';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';

import OrderOperation from './OrderOperation';
import OperationAssign from './OperationAssign';
import { detailDs, orderOperationDS, operationAssignDs } from '@/stores/dispatchOrderDs';
import { queryValueSet, cancel } from '@/services/dispatchOrderService';

const preCode = 'neway.dispatchOrder';

@formatterCollections({
  code: ['neway.dispatchOrder'],
})
@connect()
export default class DispatchOrderDetail extends Component {
  constructor(props) {
    super(props);
    this.detailDs = new DataSet({
      ...detailDs(),
      children: {
        taskList: new DataSet({ ...orderOperationDS() }),
        assignList: new DataSet({ ...operationAssignDs() }),
      },
    });
    this.state = {
      valueIncludeMoType: false, // 工单类型是否属于值集：LMES.NOOP_MO_TYPE
    };
  }

  get isCreatePage() {
    const { match } = this.props;
    const { moId } = match.params;
    return !moId;
  }

  componentDidMount() {
    if (this.isCreatePage) {
      this.detailDs.create({});
    } else {
      this.refreshPage();
    }
  }

  @Bind()
  async refreshPage() {
    const { moId } = this.props.match.params;
    this.detailDs.setQueryParameter('moId', moId);
    await this.detailDs.query();
    const res = await queryValueSet();
    const valueArr = res.map((item) => item.value) || [];

    this.setState(
      {
        valueIncludeMoType: valueArr.includes(this.detailDs.current.get('moTypeCode')),
      },
      () => {
        const { valueIncludeMoType } = this.state;
        if (valueIncludeMoType && this.detailDs.children.taskList.toData().length === 0) {
          this.detailDs.children.taskList.addEventListener('load', ({ dataSet }) => {
            dataSet.create(
              {
                operationObj: {
                  operation: '无工序',
                },
                itemId: this.detailDs.current.get('itemId'),
              },
              0
            );
          });
        }
      }
    );
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const { dispatch } = this.props;
    const validateValue = await this.detailDs.validate(false, false);
    if (!validateValue) {
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

    if (this.isCreatePage && res && res.content && res.content[0]) {
      // 新建页面创建数据成功后跳转到详情页面
      const pathname = `/neway/dispatch-order/detail/${res.content[0].moId}`;
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
  async handleCancel() {
    const moId = this.detailDs.current.get('moId');
    const res = await cancel(moId);
    if (res.failed) {
      notification.error({
        message: intl.get('hzero.common.message.confirm.title').d('提示'),
        description: res.message,
      });
    } else {
      notification.success({
        message: intl.get('hzero.common.message.confirm.title').d('提示'),
        description: intl.get('hord.order.submit.success').d('提交成功'),
      });
    }
    this.refreshPage();
  }

  render() {
    return (
      <Fragment>
        <Header
          title={
            this.isCreatePage
              ? intl.get(`${preCode}.view.title.orderCreate`).d('工时订单新增')
              : intl.get(`${preCode}.view.title.orderEdit`).d('工时订单编辑')
          }
          backPath="/neway/dispatch-order/list"
        >
          {this.isCreatePage && (
            <Button icon="save" color="primary" onClick={this.handleSubmit}>
              {intl.get('hzero.common.button.save').d('保存')}
            </Button>
          )}
          {!this.isCreatePage && (
            <Button onClick={this.handleCancel}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </Button>
          )}
        </Header>
        <Content>
          <Form dataSet={this.detailDs} columns={4} disabled={!this.isCreatePage}>
            <Lov name="organizationObj" />
            <Lov name="moTypeObj" />
            <TextField name="moNum" />
            <IntlField name="moStatus" disabled />
            <Lov name="costCenterObj" />
            <Lov name="sourceDocNumObj" />
            <Lov name="itemObj" noCache />
            <IntlField name="attributeString6" />
            <TextField name="standardWorkTime" />
            <IntlField name="remark" colSpan={2} />
          </Form>
          {!this.isCreatePage && (
            <>
              <Card
                key="line"
                bordered={false}
                className={DETAIL_CARD_TABLE_CLASSNAME}
                title={
                  <h3>
                    {intl.get(`${preCode}.view.title.workHourOrderOperation`).d('工时订单工序')}
                  </h3>
                }
              >
                <OrderOperation
                  detailDs={this.detailDs}
                  valueIncludeMoType={this.state.valueIncludeMoType}
                />
              </Card>
              <Card
                key="line"
                bordered={false}
                className={DETAIL_CARD_TABLE_CLASSNAME}
                title={<h3>{intl.get(`${preCode}.view.title.operationAssign`).d('工序分配')}</h3>}
              >
                <OperationAssign detailDs={this.detailDs} />
              </Card>
            </>
          )}
        </Content>
      </Fragment>
    );
  }
}
