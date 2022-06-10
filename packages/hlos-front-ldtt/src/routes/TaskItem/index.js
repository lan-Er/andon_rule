/**
 * @Description: 任务项
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-03 17:26:32
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
import { TaskItemDS, TaskItemCreateFormDS } from '@/stores/taskItemDS';
import {
  addTaskItem,
  updateTaskItem,
  createTable,
  runTask,
  runTaskSecurity,
} from '@/services/taskItem';
import './index.less';

const preCode = 'ldtt.task';
const { Sidebar } = Modal;

@connect()
export default class TaskItem extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...TaskItemDS(),
    });
    this.formDS = new DataSet({
      ...TaskItemCreateFormDS(),
    });
  }

  state = {
    visible: false,
    groupId: null,
    groupName: '',
  };

  async componentDidMount() {
    await this.formDS.create({});
    if (this.props.location.state) {
      const { groupId, groupName, tenantId } = this.props.location.state;
      if (groupId) {
        this.tableDS.setQueryParameter('groupId', groupId);
        this.setState({
          groupId,
          groupName,
          tenantId,
        });
      }
    }
    this.tableDS.query();
  }

  get columns() {
    const content = (record) => (
      <div>
        <p className="run-popover-item" onClick={() => this.createTable(record)}>
          表结构同步
        </p>
        <p className="run-popover-item" onClick={() => this.handleRunTask(record)}>
          快速模式
        </p>
        <p className="run-popover-item" onClick={() => this.handleRunTaskSecurity(record)}>
          安全模式
        </p>
      </div>
    );
    return [
      { name: 'taskName', width: 150, align: 'center' },
      { name: 'sourceDescription', width: 150, align: 'center' },
      { name: 'sourceTable', width: 150, align: 'center' },
      { name: 'sourceDatasourceUrl', width: 150, align: 'center' },
      { name: 'sourceCondition', width: 150, align: 'center' },
      { name: 'targetDescription', width: 150, align: 'center' },
      { name: 'targetTable', width: 150, align: 'center' },
      { name: 'targetDatasourceUrl', width: 150, align: 'center' },
      { name: 'targetPreSql', width: 150, align: 'center' },
      { name: 'targetColumn', width: 150, align: 'center' },
      { name: 'tenantName', width: 150, align: 'center' },
      { name: 'groupName', width: 150, align: 'center' },
      {
        name: 'taskProgress',
        width: 150,
        align: 'center',
        renderer: ({ value }) => <span>{`${value ? `${value * 100}%` : ''}`}</span>,
      },
      { name: 'taskStatusMeaning', width: 150, align: 'center' },
      { name: 'remark', align: 'center' },
      {
        header: '操作',
        width: 250,
        command: ({ record }) => {
          return [
            <Button
              key="update"
              color="primary"
              funcType="flat"
              onClick={() => this.handleEdit(record)}
              style={{
                display: 'inline-block',
                marginTop: '-6px',
              }}
            >
              编辑
            </Button>,
            <Button
              key="view"
              color="primary"
              funcType="flat"
              onClick={() => this.handleViewLogs(record)}
              style={{
                display: 'inline-block',
                marginTop: '-6px',
              }}
            >
              查看日志
            </Button>,
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
  handleViewLogs(record) {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ldtt/task-group/task-logs',
        state: {
          taskId: record.data.taskId,
          groupId: this.state.groupId,
          groupName: this.state.groupName,
        },
      })
    );
  }

  @Bind()
  async createTable(record) {
    await createTable({ taskId: record.data.taskId });
    this.tableDS.query();
  }

  @Bind()
  async handleRunTask(record) {
    await runTask({ taskId: record.data.taskId });
    this.tableDS.query();
  }

  @Bind()
  async handleRunTaskSecurity(record) {
    await runTaskSecurity({ taskId: record.data.taskId });
    this.tableDS.query();
  }

  @Bind()
  handleCreate() {
    this.formDS.current.reset();
    this.formDS.current.set('groupId', this.state.groupId);
    this.formDS.current.set('tenantId', this.state.tenantId);
    this.formDS.current.set('groupName', this.state.groupName);
    this.setState({
      visible: true,
    });
  }

  @Bind()
  handleEdit(record) {
    this.setState({
      visible: true,
    });
    this.formDS.current.set('_token', record.data._token);
    this.formDS.current.set('objectVersionNumber', record.data.objectVersionNumber);
    this.formDS.current.set('taskId', record.data.taskId);
    this.formDS.current.set('taskName', record.data.taskName);
    this.formDS.current.set('groupId', record.data.groupId);
    this.formDS.current.set('groupName', record.data.groupName);
    this.formDS.current.set('sourceDatasourceObj', {
      datasourceId: record.data.sourceDatasourceId,
      datasourceCode: record.data.sourceDatasourceCode,
      description: record.data.sourceDescription,
    });
    this.formDS.current.set('sourceTable', record.data.sourceTable);
    this.formDS.current.set('targetDatasourceObj', {
      datasourceId: record.data.targetDatasourceId,
      datasourceCode: record.data.targetDatasourceCode,
      description: record.data.targetDescription,
    });
    this.formDS.current.set('targetTable', record.data.targetTable);
    this.formDS.current.set('sourceCondition', record.data.sourceCondition);
    this.formDS.current.set('targetPreSql', record.data.targetPreSql);
    this.formDS.current.set('targetColumn', record.data.targetColumn);
    this.formDS.current.set('tenantId', record.data.tenantId);
    this.formDS.current.set('remark', record.data.remark);
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
        taskName: this.formDS.current.get('taskName'),
        groupId: this.formDS.current.get('groupId'),
        sourceDatasourceId: this.formDS.current.get('sourceDatasourceId'),
        sourceTable: this.formDS.current.get('sourceTable'),
        targetDatasourceId: this.formDS.current.get('targetDatasourceId'),
        targetTable: this.formDS.current.get('targetTable'),
        sourceCondition: this.formDS.current.get('sourceCondition'),
        targetPreSql: this.formDS.current.get('targetPreSql'),
        targetColumn: this.formDS.current.get('targetColumn'),
        tenantId: this.formDS.current.get('tenantId'),
        remark: this.formDS.current.get('remark'),
      };
      const taskId = this.formDS.current.get('taskId');
      const obj = taskId
        ? Object.assign({}, baseObj, {
            taskId,
            _token: this.formDS.current.get('_token'),
            objectVersionNumber: this.formDS.current.get('objectVersionNumber'),
          })
        : baseObj;
      const res = taskId ? await updateTaskItem(obj) : await addTaskItem(obj);
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      notification.success({
        message: '操作成功',
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
        <Header
          title={intl.get(`${preCode}.view.title.taskItem`).d('任务项')}
          backPath="/ldtt/task-group"
        >
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            新建
          </Button>
        </Header>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} queryFieldsLimit={4} />
          <Sidebar
            title={`${
              this.formDS.current && this.formDS.current.get('taskId') ? '修改' : '新增'
            }任务项`}
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
              <TextField name="taskName" />
              <TextField name="groupName" disabled />
              <Lov name="sourceDatasourceObj" />
              <TextField name="sourceTable" />
              <TextField name="sourceCondition" />
              <Lov name="targetDatasourceObj" />
              <TextField name="targetTable" />
              <TextField name="targetPreSql" />
              <TextField name="targetColumn" />
              <TextField name="remark" />
            </Form>
          </Sidebar>
        </Content>
      </Fragment>
    );
  }
}
