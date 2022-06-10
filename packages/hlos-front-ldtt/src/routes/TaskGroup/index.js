/**
 * @Description: 任务组
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-02 17:35:14
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { DataSet, Table, Button, Form, TextField, Lov } from 'choerodon-ui/pro';
import { Modal, Popover } from 'choerodon-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { TaskGroupDS, TaskCreateFormDS } from '@/stores/taskGroupDS';
import {
  addTaskGroup,
  runAllTaskCreateTable,
  runAllTaskRecord,
  runAllTaskRecordSecurity,
} from '@/services/taskGroup';
import './index.less';

const preCode = 'ldtt.task';
const { Sidebar } = Modal;

@connect()
export default class TaskGroup extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...TaskGroupDS(),
    });
    this.formDS = new DataSet({
      ...TaskCreateFormDS(),
    });
  }

  state = {
    visible: false,
  };

  async componentDidMount() {
    await this.formDS.create({});
  }

  get columns() {
    const content = (record) => (
      <div>
        <p className="run-popover-item" onClick={() => this.runAllTaskCreateTable(record)}>
          表结构全组同步
        </p>
        <p className="run-popover-item" onClick={() => this.runAllTaskRecord(record)}>
          数据全组同步
        </p>
        <p className="run-popover-item" onClick={() => this.runAllTaskRecordSecurity(record)}>
          数据全组同步-安全模式
        </p>
      </div>
    );
    return [
      {
        name: 'groupName',
        align: 'center',
        renderer: ({ record, value }) => {
          const obj = {
            groupId: record.get('groupId'),
            tenantId: record.get('tenantId'),
            groupName: record.get('groupName'),
          };
          return <a onClick={() => this.handleToTaskItem(obj)}>{value || ''}</a>;
        },
      },
      { name: 'tenantName', align: 'center' },
      { name: 'remark', align: 'center' },
      {
        header: '操作',
        width: 250,
        command: ({ record }) => {
          return [
            <Popover content={content(record)} placement="bottom">
              <Button
                key="running"
                color="primary"
                funcType="flat"
                style={{
                  display: 'inline-block',
                  marginTop: '-6px',
                }}
              >
                运行
                <i className="anticon anticon-down" />
              </Button>
            </Popover>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  @Bind()
  async runAllTaskCreateTable(record) {
    await runAllTaskCreateTable({ groupId: record.data.groupId });
    this.tableDS.query();
  }

  @Bind()
  async runAllTaskRecord(record) {
    await runAllTaskRecord({ groupId: record.data.groupId });
    this.tableDS.query();
  }

  @Bind()
  async runAllTaskRecordSecurity(record) {
    await runAllTaskRecordSecurity({ groupId: record.data.groupId });
    this.tableDS.query();
  }

  @Bind()
  handleToTaskItem(obj) {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ldtt/task-group/task-item',
        state: obj,
      })
    );
  }

  @Bind()
  handleCreate() {
    this.formDS.current.reset();
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
      const obj = {
        groupName: this.formDS.current.get('groupName'),
        tenantId: this.formDS.current.get('tenantId'),
        remark: this.formDS.current.get('remark'),
      };
      const res = await addTaskGroup(obj);
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
        <Header title={intl.get(`${preCode}.view.title.taskGroup`).d('任务组')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            新建
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
              <TextField name="groupName" />
              <Lov name="tenantObj" />
              <TextField name="remark" />
            </Form>
          </Sidebar>
        </Content>
      </Fragment>
    );
  }
}
