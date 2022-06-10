/**
 * @Description: 平台级数据分发
 * @Author: yuchuan.zeng@hand-china.com
 * @Date: 2020-09-02 17:35:14
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { DataSet, Table, Button, Form, Switch, Select } from 'choerodon-ui/pro';
import { Modal } from 'choerodon-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { TransferPlatformDS, PlatformCreateFormDS } from '@/stores/transferPlatformDS';
import {
  addTransferPlatform,
  editTransferPlatform,
  refreshCanal,
  refreshMq,
} from '@/services/transferPlatform';
import './index.less';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';

const preCode = 'ldtt.transfer.platform';
const { Sidebar } = Modal;

@connect()
export default class TransferPlatform extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...TransferPlatformDS(),
    });
    this.formDS = new DataSet({
      ...PlatformCreateFormDS(),
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
        name: 'serviceCode',
        align: 'center',
        renderer: ({ record, value }) => {
          if (record.get('enabledFlag') === 1) {
            const obj = {
              serviceCode: record.get('serviceCode'),
              transferPlatformId: record.get('transferPlatformId'),
            };
            return <a onClick={() => this.handleToTransferDetail(obj)}>{value || ''}</a>;
          } else {
            return value;
          }
        },
      },
      { name: 'serviceName', align: 'center' },
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
    this.formDS.current.set('transferPlatformId', record.data.transferPlatformId);
    this.formDS.current.set('serviceCode', record.data.serviceCode);
    this.formDS.current.set('serviceName', record.data.serviceName);
    this.formDS.current.set('enabledFlag', record.data.enabledFlag === 1);
    this.formDS.current.set('_token', record.data._token);
    this.formDS.current.set('objectVersionNumber', record.data.objectVersionNumber);
    this.setState({
      visible: true,
    });
  }

  @Bind()
  handleToTransferDetail(obj) {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ldtt/transfer-platform/detail/list',
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
        serviceCode: this.formDS.current.get('serviceCode'),
        transferPlatformId: this.formDS.current.get('transferPlatformId'),
        _token: this.formDS.current.get('_token'),
        objectVersionNumber: this.formDS.current.get('objectVersionNumber'),
      };
      let res = null;
      if (obj.transferPlatformId != null) {
        res = await editTransferPlatform(obj);
      } else {
        res = await addTransferPlatform(obj);
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
        <Header title={intl.get(`${preCode}.view.title.taskGroup`).d('平台数据分发定义')}>
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
              <Select name="serviceCode" key="serviceCode" />
              <Switch name="enabledFlag" />
            </Form>
          </Sidebar>
        </Content>
      </Fragment>
    );
  }
}
