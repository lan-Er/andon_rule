/**
 * @Description: 数据分发租户定义
 * @Author: yuchuan.zeng@hand-china.com
 * @Date: 2020-09-02 17:35:14
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { DataSet, Table, Button, Form, TextField, Lov, Switch } from 'choerodon-ui/pro';
import { Modal } from 'choerodon-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { TransferTenantDS, TenantCreateFormDS } from '@/stores/transferTenantDS';
import {
  addTransferTenant,
  editTransferTenant,
  refreshCanal,
  refreshMq,
} from '@/services/transferTenant';
import './index.less';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const preCode = 'ldtt.transfer.tenant';
const { Sidebar } = Modal;

@connect()
export default class TransferTenant extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...TransferTenantDS(),
    });
    this.formDS = new DataSet({
      ...TenantCreateFormDS(),
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
      {
        name: 'tenantName',
        align: 'center',
        renderer: ({ record, value }) => {
          if (record.get('enabledFlag') === 1) {
            const obj = {
              transferTenantId: record.get('transferTenantId'),
              tenantId: record.get('tenantId'),
            };
            return <a onClick={() => this.handleToTransferService(obj)}>{value || ''}</a>;
          } else {
            return value;
          }
        },
      },
      { name: 'remark', align: 'center' },
      { name: 'enabledFlag', width: 150, align: 'center', renderer: yesOrNoRender },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record }) => {
          return [
            <Button key="edit" color="primary" funcType="flat" onClick={() => this.edit(record)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </Button>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   *
   *跳转到详情
   * @param recode
   */
  @Bind()
  edit(record) {
    this.formDS.current.reset();
    this.formDS.current.set('transferTenantId', record.data.transferTenantId);
    this.formDS.current.set('tenantId', record.data.tenantId);
    this.formDS.current.set('tenantName', record.data.tenantName);
    this.formDS.current.set('enabledFlag', record.data.enabledFlag === 1);
    this.formDS.current.set('remark', record.data.remark);
    this.formDS.current.set('_token', record.data._token);
    this.formDS.current.set('objectVersionNumber', record.data.objectVersionNumber);
    this.setState({
      visible: true,
    });
  }

  @Bind()
  handleToTransferService(obj) {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ldtt/transfer-tenant/service/list',
        state: obj,
      })
    );
  }

  @Bind()
  handleCreate() {
    this.formDS.current.reset();
    this.formDS.current.set('enabledFlag', true);
    this.setState({
      visible: true,
    });
  }

  @Bind()
  async refreshCanal() {
    try {
      const res = await refreshCanal();
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      notification.success({
        message: '刷新成功',
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
  async refreshMq() {
    try {
      const res = await refreshMq();
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      notification.success({
        message: '刷新成功',
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
  async handleOk() {
    const validateValue = await this.formDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }
    try {
      const obj = {
        enabledFlag: this.formDS.current.get('enabledFlag') ? 1 : 0,
        transferTenantId: this.formDS.current.get('transferTenantId'),
        tenantId: this.formDS.current.get('tenantId'),
        remark: this.formDS.current.get('remark'),
        _token: this.formDS.current.get('_token'),
        objectVersionNumber: this.formDS.current.get('objectVersionNumber'),
      };
      let res = null;
      if (obj.transferTenantId != null) {
        res = await editTransferTenant(obj);
      } else {
        res = await addTransferTenant(obj);
      }
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      notification.success({
        message: '创建成功',
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

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.taskGroup`).d('数据分发租户定义')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            新建
          </Button>
          <Button icon="save" color="primary" onClick={this.refreshCanal}>
            刷新CanalTask监听线程
          </Button>
          <Button icon="save" color="primary" onClick={this.refreshMq}>
            重启RocketMqTask监听线程
          </Button>
        </Header>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} queryFieldsLimit={4} />
          <Sidebar
            title="新增任务组"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            cancelText="取消"
            okText="确定"
            width={600}
            zIndex="999"
            closable
            mask={false}
          >
            <Form dataSet={this.formDS}>
              <Lov name="tenantObj" />
              <TextField name="remark" />
              <Switch name="enabledFlag" />
            </Form>
          </Sidebar>
        </Content>
      </Fragment>
    );
  }
}
