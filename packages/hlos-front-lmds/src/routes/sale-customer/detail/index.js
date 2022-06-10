/*
 * @Description: 客户管理信息--detail
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-29 13:38:45
 * @LastEditors: 赵敏捷
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  DataSet,
  Table,
  Form,
  Button,
  TextField,
  Switch,
  IntlField,
  Lov,
  Select,
  DatePicker,
  Tooltip,
} from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';

import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

import CustomerDetailDS from '../stores/CustomerDetailDS';

const intlPrefix = 'lmds.party';
const commonPrefix = 'lmds.common';
const commonButtonIntlPrefix = 'hzero.common.button';

@connect()
@formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})
export default class CustomerDetail extends Component {
  state = {
    customerId: null,
  };

  customerDetailDS = new DataSet({
    ...CustomerDetailDS(),
  });

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    const { customerId } = params;
    this.setState({ customerId });
    if (customerId) {
      this.customerDetailDS.setQueryParameter('customerId', customerId);
      this.customerDetailDS.query();
    } else {
      this.customerDetailDS.create({});
    }
  }

  /**
   * 删除
   */
  @Bind()
  async handleDeleteLine(record) {
    try {
      const childDs = this.customerDetailDS.children.customerSiteList;
      const res = await childDs.delete([record]);
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        this.customerDetailDS.query();
      }
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
  }

  /**
   * 保存
   */
  @Bind()
  async handleSubmit() {
    const { dispatch } = this.props;
    const validateValue = await this.customerDetailDS.validate(false, false);

    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await this.customerDetailDS.submit(false, false);
    const { customerId } = res && res.content && res.content[0];
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
    if (customerId) {
      dispatch(
        routerRedux.replace({
          pathname: `/lmds/customer/detail/${customerId}`,
        })
      );
    }
  }

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  @Bind()
  removeData(record) {
    const { customerSiteList } = this.customerDetailDS.children;
    if (record.status !== 'sync') {
      if (record.get('customerSiteNumber')) {
        customerSiteList.current.reset();
      } else {
        customerSiteList.remove(record);
      }
    }
  }

  get columns() {
    return [
      {
        name: 'customerSiteType',
        width: 150,
        editor: (record) => (record.status === 'add' ? <Select /> : null),
      },
      {
        name: 'customerSiteNumber',
        width: 150,
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
      },
      {
        name: 'customerSiteName',
        width: 150,
        editor: true,
      },
      {
        name: 'customerSiteAlias',
        width: 150,
        editor: true,
      },
      {
        name: 'description',
        width: 150,
        editor: true,
      },
      {
        name: 'customerSiteStatus',
        width: 150,
        editor: true,
      },
      {
        name: 'countryRegion',
        width: 150,
        editor: true,
      },
      {
        name: 'provinceState',
        width: 150,
        editor: true,
      },
      {
        name: 'city',
        width: 150,
        editor: true,
      },
      {
        name: 'address',
        width: 150,
        editor: true,
      },
      {
        name: 'zipcode',
        width: 150,
        editor: true,
      },
      {
        name: 'contact',
        width: 150,
        editor: true,
      },
      {
        name: 'phoneNumber',
        width: 150,
        editor: true,
      },
      {
        name: 'email',
        width: 150,
        editor: true,
      },
      {
        name: 'startDate',
        width: 130,
        editor: true,
        align: 'center',
      },
      {
        name: 'endDate',
        width: 130,
        editor: true,
        align: 'center',
      },
      {
        name: 'externalId',
        width: 150,
        editor: true,
      },
      {
        name: 'externalNum',
        width: 150,
        editor: true,
      },
      {
        name: 'enabledFlag',
        width: 100,
        editor: true,
        renderer: yesOrNoRender,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('取消')}>
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => this.removeData(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  render() {
    const customerFlag = !!this.state.customerId;
    return (
      <Fragment>
        <Header
          title={
            customerFlag
              ? intl.get('hzero.common.status.edit').d('编辑')
              : intl.get('hzero.common.status.create').d('创建')
          }
          backPath="/lmds/customer/list"
        >
          <Button icon="save" color="primary" onClick={this.handleSubmit}>
            {intl.get(`${commonButtonIntlPrefix}.save`).d('保存')}
          </Button>
        </Header>
        <Content>
          <Card
            key="party-detail-header"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>{intl.get(`${intlPrefix}.view.title.customer`).d('客户')}</h3>}
          >
            <Form dataSet={this.customerDetailDS} columns={4}>
              <TextField name="customerNumber" disabled={customerFlag} />
              <IntlField name="customerName" />
              <IntlField name="customerAlias" />
              <IntlField name="description" />
              <Lov name="categoryObj" />
              <Lov name="salesmanObj" />
              <TextField name="customerGroup" />
              <TextField name="societyNumber" />
              <Select name="customerRank" />
              <Select name="customerStatus" />
              <Select name="fobType" />
              <Select name="paymentDeadline" />
              <Select name="paymentMethod" />
              <Lov name="currencyObj" />
              <TextField name="taxRate" />
              <TextField name="countryRegion" />
              <TextField name="provinceState" />
              <TextField name="city" />
              <TextField name="address" />
              <TextField name="zipcode" />
              <TextField name="contact" />
              <TextField name="phoneNumber" />
              <TextField name="email" />
              <DatePicker name="startDate" />
              <DatePicker name="endDate" />
              <TextField name="externalId" />
              <TextField name="externalNum" />
              <Switch name="consignFlag" newLine />
              <Switch name="enabledFlag" />
            </Form>
          </Card>
          <Card
            key="party-detail-body"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            title={<h3>{intl.get(`${intlPrefix}.view.title.customerSite`).d('客户地点')}</h3>}
          >
            <Table
              buttons={['add']}
              dataSet={this.customerDetailDS.children.customerSiteList}
              columns={this.columns}
            />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
