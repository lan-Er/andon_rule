/**
 * @Description: ES同步项
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-04 11:28:54
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { Modal, Popover } from 'choerodon-ui';
import { DataSet, Table, Button, Form, TextField, TextArea, Lov } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import {
  EsSyncItemListDS,
  EsSyncItemCreateDS,
  EsSyncItemCreateFormDS,
} from '@/stores/esSyncItemDS';
import {
  generatorEsTask,
  createIndex,
  runTask,
  deleteIndex,
  esTasksCreate,
  esTasksEdit,
} from '@/services/esSyncItem';
import './index.less';

const preCode = 'ldtt.esSyncItem';
const { Sidebar } = Modal;

@connect()
export default class EsSyncItem extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...EsSyncItemListDS(),
    });
    this.createDS = new DataSet({
      ...EsSyncItemCreateDS(),
    });
    this.formDS = new DataSet({
      ...EsSyncItemCreateFormDS(),
    });
  }

  state = {
    createVisible: false,
    visible: false,
  };

  get columns() {
    const content = (record) => (
      <div>
        <p className="run-popover-item" onClick={() => this.createIndex(record)}>
          索引创建
        </p>
        <p className="run-popover-item" onClick={() => this.runTask(record)}>
          同步执行
        </p>
        <p className="run-popover-item" onClick={() => this.deleteIndex(record)}>
          索引删除
        </p>
      </div>
    );
    return [
      { name: 'esTaskName', width: 150, align: 'center' },
      { name: 'sourceDatasourceId', width: 150, align: 'center' },
      { name: 'sourceTable', width: 150, align: 'center' },
      { name: 'sourceCondition', width: 150, align: 'center' },
      { name: 'esIndexName', width: 150, align: 'center' },
      { name: 'esIndexContent', width: 150, align: 'center' },
      { name: 'esPk', width: 150, align: 'center' },
      { name: 'tenantId', width: 150, align: 'center' },
      {
        name: 'taskProgress',
        width: 150,
        align: 'center',
        renderer: ({ value }) => <span>{`${value ? `${value * 100}%` : ''}`}</span>,
      },
      { name: 'taskStatus', width: 150, align: 'center' },
      { name: 'countPerTask', width: 150, align: 'center' },
      { name: 'remark', width: 150, align: 'center' },
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
  handleCreate() {
    this.createDS.current.reset();
    this.setState({
      createVisible: true,
    });
  }

  @Bind()
  async createIndex(record) {
    try {
      const res = await createIndex({ esTaskId: record.data.esTaskId });
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      this.tableDS.query();
    } catch (err) {
      console.log(err);
    }
  }

  @Bind()
  async runTask(record) {
    try {
      const res = await runTask({ esTaskId: record.data.esTaskId });
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      this.tableDS.query();
    } catch (err) {
      console.log(err);
    }
  }

  @Bind()
  async deleteIndex(record) {
    try {
      const res = await deleteIndex({ esTaskId: record.data.esTaskId });
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      this.tableDS.query();
    } catch (err) {
      console.log(err);
    }
  }

  @Bind()
  handleEdit(record) {
    this.setState({
      visible: true,
    });
    this.formDS.current.set('_token', record.data._token);
    this.formDS.current.set('objectVersionNumber', record.data.objectVersionNumber);
    this.formDS.current.set('esTaskId', record.data.esTaskId);
    this.formDS.current.set('esTaskName', record.data.esTaskName);
    this.formDS.current.set('sourceDatasourceObj', {
      datasourceId: record.data.sourceDatasourceId,
      datasourceCode: record.data.sourceDatasourceCode,
      description: record.data.sourceDescription,
    });
    this.formDS.current.set('sourceTable', record.data.sourceTable);
    this.formDS.current.set('sourceCondition', record.data.sourceCondition);
    this.formDS.current.set('esIndexName', record.data.esIndexName);
    this.formDS.current.set('esIndexContent', record.data.esIndexContent);
    this.formDS.current.set('esPk', record.data.esPk);
    this.formDS.current.set('countPerTask', record.data.countPerTask);
    this.formDS.current.set('remark', record.data.remark);
  }

  @Bind()
  handleViewLogs(record) {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ldtt/es-syncitem/logs',
        state: {
          esTaskId: record.data.esTaskId,
        },
      })
    );
  }

  @Bind()
  async handleCreateOk() {
    const validateValue = await this.createDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }
    try {
      const obj = {
        sourceDatasourceId: this.createDS.current.get('sourceDatasourceId'),
        tableName: this.createDS.current.get('sourceTable'),
      };
      const res = await generatorEsTask(obj);
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
        createVisible: false,
      });
      this.formDS.current.reset();
      this.formDS.current.set('esTaskName', res.esTaskName);
      this.formDS.current.set('sourceDatasourceObj', {
        datasourceId: res.sourceDatasourceId,
        datasourceCode: res.sourceDatasourceCode,
        description: res.sourceDescription,
      });
      this.formDS.current.set('sourceTable', res.sourceTable);
      this.formDS.current.set('sourceCondition', res.sourceCondition);
      this.formDS.current.set('esIndexName', res.esIndexName);
      this.formDS.current.set('esIndexContent', res.esIndexContent);
      this.formDS.current.set('esPk', res.esPk);
      this.formDS.current.set('countPerTask', res.countPerTask);
      this.formDS.current.set('remark', res.remark);
      this.formDS.current.set('tenantId', res.tenantId);
      this.formDS.current.set('indexExist', res.indexExist);
      this.setState({
        visible: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  @Bind()
  handleCreateCancel() {
    this.setState({
      createVisible: false,
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
        esTaskName: this.formDS.current.get('esTaskName'),
        sourceDatasourceId: this.formDS.current.get('sourceDatasourceId'),
        sourceTable: this.formDS.current.get('sourceTable'),
        sourceCondition: this.formDS.current.get('sourceCondition'),
        esIndexName: this.formDS.current.get('esIndexName'),
        esIndexContent: this.formDS.current.get('esIndexContent'),
        esPk: this.formDS.current.get('esPk'),
        countPerTask: this.formDS.current.get('countPerTask'),
        remark: this.formDS.current.get('remark'),
        tenantId: this.formDS.current.get('tenantId'),
        indexExist: this.formDS.current.get('indexExist'),
      };
      const esTaskId = this.formDS.current.get('esTaskId');
      const obj = esTaskId
        ? Object.assign({}, baseObj, {
            esTaskId,
            _token: this.formDS.current.get('_token'),
            objectVersionNumber: this.formDS.current.get('objectVersionNumber'),
          })
        : baseObj;
      const res = esTaskId ? await esTasksEdit(obj) : await esTasksCreate(obj);
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
        <Header title={intl.get(`${preCode}.view.title.esSyncItem`).d('ES同步项')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            新建
          </Button>
        </Header>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} queryFieldsLimit={4} />
          <Modal
            title="新建"
            visible={this.state.createVisible}
            onOk={this.handleCreateOk}
            onCancel={this.handleCreateCancel}
            center
            zIndex="999"
            mask={false}
          >
            <Form dataSet={this.createDS}>
              <Lov name="sourceDatasourceObj" />
              <TextField name="sourceTable" />
            </Form>
          </Modal>
          <Sidebar
            title={`${
              this.formDS.current && this.formDS.current.get('esTaskId') ? '修改' : '新增'
            }ES同步项`}
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
              <TextField name="esTaskName" />
              <Lov name="sourceDatasourceObj" />
              <TextField name="sourceTable" />
              <TextField name="sourceCondition" />
              <TextField name="esIndexName" />
              <TextArea name="esIndexContent" rows={10} />
              <TextField name="esPk" />
              <TextField name="countPerTask" />
              <TextField name="remark" />
            </Form>
          </Sidebar>
        </Content>
      </Fragment>
    );
  }
}
