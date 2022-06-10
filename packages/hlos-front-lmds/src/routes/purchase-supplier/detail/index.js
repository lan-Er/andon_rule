/*
 * @Author: zhang yang
 * @Description: 供应商  I
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-28 14:47:29
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import {
  DataSet,
  Lov,
  Form,
  Select,
  TextField,
  IntlField,
  DatePicker,
  Button,
  Switch,
  NumberField,
} from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';

import DetailList from './DetailList';
import DetailDS from '../stores/DetailDS';

const preCode = 'lmds.supplier';

@connect()
@formatterCollections({
  code: ['lmds.supplier'],
})
export default class DetailPage extends Component {
  state = {
    hidden: true,
  };

  detailDS = new DataSet(
    {
      ...DetailDS(),
    },
    { cacheState: false }
  );

  get isCreatePage() {
    const { match } = this.props;
    const { supplierId } = match.params;
    return !supplierId;
  }

  async componentDidMount() {
    if (this.isCreatePage) {
      await this.detailDS.create({});
    } else {
      await this.refreshPage();
    }
  }

  @Bind()
  async refreshPage() {
    const { supplierId } = this.props.match.params;
    this.detailDS.queryParameter = { supplierId };
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
      const pathname = `/lmds/supplier/detail/${res.content[0].supplierId}`;
      dispatch(
        routerRedux.push({
          pathname,
        })
      );
    } else if (!this.isCreatePage) {
      this.refreshPage();
    }
  }

  /**
   *控制显隐
   * @memberof DetailPage
   */
  @Bind()
  handleToggle() {
    const { hidden } = this.state;
    this.setState({
      hidden: !hidden,
    });
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
          backPath="/lmds/supplier/list"
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
            title={<h3>{intl.get(`${preCode}.view.title.supplier`).d('供应商')}</h3>}
          >
            <Form dataSet={this.detailDS} columns={4}>
              <TextField name="supplierNumber" disabled={!this.isCreatePage} />
              <IntlField name="supplierName" />
              <IntlField name="supplierAlias" />
              <IntlField name="description" />
            </Form>
            <Form dataSet={this.detailDS} columns={4}>
              <Lov name="supplierCategory" noCache />
              <Lov name="buyer" noCache />
              <TextField name="supplierGroup" />
              <TextField name="societyNumber" />
              <Select name="supplierRank" />
              <Select name="supplierStatus" />
              <Switch name="consignFlag" />
              <Switch name="vmiFlag" />
              <Select name="paymentDeadline" />
              <Select name="paymentMethod" />
              <Lov name="currencyObj" noCache />
              <NumberField name="taxRate" />
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
              <Switch name="enabledFlag" />
            </Form>
          </Card>
          <Card
            key="line"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            title={<h3>{intl.get(`${preCode}.view.title.supplierContext`).d('供应商明细')}</h3>}
          >
            <DetailList detailDS={this.detailDS} />
          </Card>
        </Content>
      </Fragment>
    );
  }
}
