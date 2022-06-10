/**
 * 客户信息管理
 * @since: 2020-07-01 14:56:24
 * @author: wei.zhou05@hand-china.com
 */

import React, { Component, Fragment } from 'react';
import { DataSet, Table, Button, Form, TextField, Switch } from 'choerodon-ui/pro';
import { Modal } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { CimDS } from '@/stores/clientInfoManageDS';
import FormDS from '@/stores/clientFormDS';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import { clientInfoOperate } from '@/services/clientInfo';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const preCode = 'lwhs.clientInfo';
const { Sidebar } = Modal;

export default class ClientInfoManage extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...CimDS,
    });
    this.formDS = new DataSet({
      ...FormDS(),
    });
  }

  state = {
    visible: false,
  };

  async componentDidMount() {
    await this.formDS.create({});
  }

  get columns() {
    return [
      { name: 'companyCode', width: 150, align: 'center' },
      { name: 'companyName', width: 150, align: 'center' },
      { name: 'address', align: 'center' },
      { name: 'contactPerson', width: 150, align: 'center' },
      { name: 'phone', width: 150, align: 'center' },
      { name: 'enableFlag', width: 150, align: 'center', renderer: yesOrNoRender },
    ];
  }

  @Bind()
  async handleCreate() {
    this.formDS.current.reset();
    this.formDS.current.set('enableFlag', false);
    this.setState({
      visible: true,
    });
  }

  @Bind()
  async handleOk() {
    const validateValue = await this.formDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }
    try {
      const baseObj = {
        companyCode: this.formDS.current.get('companyCode'),
        companyName: this.formDS.current.get('companyName'),
        address: this.formDS.current.get('address'),
        contactPerson: this.formDS.current.get('contactPerson'),
        phone: this.formDS.current.get('phone'),
        enableFlag: this.formDS.current.get('enableFlag') ? 1 : 0,
        tenantId: getCurrentOrganizationId(),
      };
      const id = this.formDS.current.get('id');
      const obj = id
        ? Object.assign({}, baseObj, {
            id,
            objectVersionNumber: this.formDS.current.get('objectVersionNumber'),
          })
        : baseObj;
      const res = await clientInfoOperate(obj);
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      notification.success({
        message: '提交成功',
      });
      this.setState({
        visible: false,
      });
      this.tableDS.query();
    } catch (err) {
      console.log(err);
    }
  }

  @Bind()
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  @Bind()
  handleRowClick(record) {
    const that = this;
    return {
      onClick: () => {
        that.setState({
          visible: true,
        });
        that.formDS.current.set('id', record.data.id);
        that.formDS.current.set('objectVersionNumber', record.data.objectVersionNumber);
        that.formDS.current.set('companyCode', record.data.companyCode);
        that.formDS.current.set('companyName', record.data.companyName);
        that.formDS.current.set('address', record.data.address);
        that.formDS.current.set('contactPerson', record.data.contactPerson);
        that.formDS.current.set('phone', record.data.phone);
        that.formDS.current.set('enableFlag', !!record.data.enableFlag);
      },
    };
  }

  @Bind()
  handleGoSearch() {
    if (!this.tableDS.selected.length) {
      notification.warning({
        message: '请先选择需要查询的公司信息',
      });
      return;
    }
    const { companyCode } = this.tableDS.selected[0].data;
    this.props.history.push(`/lwhs/employee-info-manage/${companyCode}`);
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.clientInfo`).d('客户信息')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            新建
          </Button>
          <Button onClick={this.handleGoSearch}>查询用户</Button>
        </Header>
        <Content>
          <Table
            dataSet={this.tableDS}
            columns={this.columns}
            queryFieldsLimit={4}
            onRow={({ record }) => this.handleRowClick(record)}
          />
          <Sidebar
            title={`${
              this.formDS.current && this.formDS.current.get('id') ? '修改' : '新增'
            }客户信息`}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            cancelText="取消"
            okText="确定"
            width={600}
            closable
          >
            <Form dataSet={this.formDS}>
              <TextField name="companyCode" />
              <TextField name="companyName" />
              <TextField name="address" />
              <TextField name="contactPerson" />
              <TextField name="phone" />
              <Switch name="enableFlag" key="enableFlag" />,
            </Form>
          </Sidebar>
        </Content>
      </Fragment>
    );
  }
}
