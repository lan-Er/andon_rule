/*
 * @Description: 租户站点白名单
 * @Author: 檀建军 <jianjun.tan@hand-china.com>
 * @Date: 2020-12-31 13:38:45
 */

import React, { Component, Fragment } from 'react';
// import { Modal } from 'choerodon-ui';
import { DataSet, Table, Button, Lov, TextField, Form, Modal } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { addList, editList } from '../../services/whiteService';

import WhiteListDS from './stores/WhiteListDS';
import ToolDS from './stores/ToolDS';
import styles from './index.less';

// const { Sidebar } = Modal;
const intlPrefix = 'lmds.whiteList';
const modalKey = Modal.key();
let modal = null;

export default class WhiteList extends Component {
  state = {
    // visible: false,
    type: 'add',
  };

  whiteListDS = new DataSet({
    ...WhiteListDS(),
  });

  toolDS = new DataSet({
    ...ToolDS(),
  });

  get columns() {
    return [
      {
        name: 'tenantObj',
        width: 200,
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      },
      {
        name: 'tenantNum',
        width: 200,
      },
      {
        name: 'whiteListIp',
        width: 500,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 150,
        command: ({ record }) => {
          return [
            <Button
              key="edit"
              color="primary"
              funcType="flat"
              onClick={() => this.handleEdit(record)}
            >
              {intl.get('hzero.common.button.edit').d('编辑')}
            </Button>,
            <Button
              key="delete"
              color="primary"
              funcType="flat"
              onClick={() => this.handleDelete(record)}
            >
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  handleCreateWhiteList = () => {
    // this.WhiteListDS.current.reset();
    this.setState(
      {
        // visible: true,
        type: 'add',
        record: {},
      },
      () => {
        this.showModal();
      }
    );
  };

  handleEdit = (record) => {
    this.setState(
      {
        // visible: true,
        type: 'edit',
        record,
      },
      () => {
        this.showModal();
      }
    );
  };

  handleDelete = (record) => {
    this.whiteListDS.delete([record]);
  };

  showModal = () => {
    modal = Modal.open({
      key: modalKey,
      title: '配置IP白名单',
      drawer: true,
      drawerTransitionName: 'slide-right',
      closable: true,
      width: 400,
      children: (
        <div>
          <div className={styles['white-texts']}>
            <p>
              1、支持配置IP地址和IP&掩码格式的网段，黑名单最多支持配置100个，白名单最多支持配置50个，一行一个。
            </p>
            <p>2、网段表示形式仅支持IP/8，IP/16，IP/24，IP/32四种。</p>
            <p>3、网段“IP/掩码”中的IP必须是该网段IP区间首个主机IP地址。</p>
            <p>4、输入的IPv4格式的地址不能包含在其他已输入的网段之中。</p>
            <p>5、不支持带通配符的地址，如192.168.0.*。</p>
          </div>
          <div className={styles['white-form-style']}>
            {this.state.type === 'edit' && (
              <Form dataSet={this.whiteListDS}>
                <Lov name="tenantObj" />
                <TextField name="tenantNum" />
                <TextField name="whiteListIp" />
              </Form>
            )}
            {this.state.type === 'add' && (
              <Form dataSet={this.toolDS}>
                <Lov name="tenantObj" />
                <TextField name="tenantNum" />
                <TextField name="whiteListIp" />
              </Form>
            )}
          </div>
        </div>
      ),
      onOk: this.handleOk,
      onCancel: this.handleCancel,
    });
  };

  handleOk = async () => {
    if (this.state.type === 'edit') {
      const res = await editList(this.state.record.data);
      if (res && res.failed) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: `修改成功`,
        });
      }
      // editList(this.state.record.data);
      this.whiteListDS.query();
    } else {
      // const res = addList(this.toolDS.data[0].data);

      const res = await addList(this.toolDS.data[0].data);
      if (res && res.failed) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: `新增成功`,
        });
      }
      this.toolDS.current.reset();
      this.whiteListDS.query();
    }
    // this.setState({
    //   visible: false,
    // });
  };

  handleCancel = () => {
    // this.setState({
    //   visible: false,
    // });
    modal.close();
  };

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${intlPrefix}.view.title.whiteList`).d('租户站点白名单')}>
          <Button icon="add" color="primary" onClick={this.handleCreateWhiteList}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <Table dataSet={this.whiteListDS} columns={this.columns} columnResizable="true" />
        </Content>
      </Fragment>
    );
  }
}
