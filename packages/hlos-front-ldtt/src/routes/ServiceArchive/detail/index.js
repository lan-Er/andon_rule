import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { DataSet, Table, Button, Form, Lov, Modal } from 'choerodon-ui/pro';
import { Modal as HModal, Popover } from 'choerodon-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { ServiceArchiveDetailDS, ServiceDeatilCreateFormDS } from '@/stores/serviceArchiveDS';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  addArchivesDetail,
  updateArchivesDetail,
  dataBackupSer,
  revertSer,
  cleanupSer,
  generatorArchiveDeleteSqlSer,
} from '@/services/serviceArchive';
import './index.less';

const key1 = Modal.key();
const preCode = 'ldtt.task';

@connect()
export default class TaskItem extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...ServiceArchiveDetailDS(),
    });
    this.formDS = new DataSet({
      ...ServiceDeatilCreateFormDS(),
    });
  }

  state = {
    archiveId: null,
    archiveVisible: false,
    archiveDeleteMes: [],
  };

  async componentDidMount() {
    await this.formDS.create({});
    if (this.props.location.state) {
      const { archiveId } = this.props.location.state;
      if (archiveId) {
        this.tableDS.setQueryParameter('archiveId', archiveId);
        this.setState({
          archiveId,
        });
      }
    }
    this.tableDS.query();
  }

  get columns() {
    const content = (record) => (
      <div>
        <p className="run-popover-item" onClick={() => this.handleBackup(record)}>
          数据备份
        </p>
        <p className="run-popover-item" onClick={() => this.handleCleanup(record)}>
          数据清空
        </p>
        <p className="run-popover-item" onClick={() => this.handleRevert(record)}>
          数据还原
        </p>
        <p
          className="run-popover-item"
          onClick={() => this.handleGeneratorArchiveDeleteSql(record)}
        >
          清空归档数据报文
        </p>
      </div>
    );
    return [
      { name: 'archiveName', width: 150, align: 'center' },
      { name: 'targetDescription', width: 150, align: 'center' },
      { name: 'targetDatasourceUrl', width: 250, align: 'center' },
      { name: 'targetTenantName', width: 150, align: 'center' },
      {
        name: 'taskProgress',
        align: 'center',
        renderer: ({ value }) => <span>{`${value ? `${value * 100}%` : ''}`}</span>,
      },
      { name: 'taskStatusMeaning', align: 'center' },
      {
        header: '操作',
        width: 190,
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
                marginLeft: '-12px',
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
                  marginLeft: '-12px',
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
        pathname: '/ldtt/service-archive/logs',
        state: {
          taskId: record.data.archiveDetailId,
          archiveId: this.state.archiveId,
        },
      })
    );
  }

  /**
   * 数据备份
   */
  @Bind()
  async handleBackup(record) {
    const { archiveDetailId } = record.data;
    await dataBackupSer({ archiveDetailId });
    this.tableDS.query();
  }

  /**
   * 数据清空
   */
  @Bind()
  async handleCleanup(record) {
    const { archiveDetailId } = record.data;
    await cleanupSer({ archiveDetailId });
    this.tableDS.query();
  }

  /**
   * 数据还原
   */
  @Bind()
  async handleRevert(record) {
    const { archiveDetailId } = record.data;
    await revertSer({ archiveDetailId });
    this.tableDS.query();
  }

  /**
   * 清空归档数据报文
   */
  @Bind()
  async handleGeneratorArchiveDeleteSql(record) {
    const { archiveDetailId } = record.data;
    const res = await generatorArchiveDeleteSqlSer({ archiveDetailId });
    if (res && !res.failed) {
      this.setState({
        archiveVisible: true,
        archiveDeleteMes: res.content.split('\n'),
      });
      this.tableDS.query();
    } else {
      notification.error({
        message: res.message,
      });
    }
  }

  @Bind()
  handleCreate() {
    this.formDS.current.reset();
    this.formDS.current.set('archiveId', this.state.archiveId);

    Modal.open({
      closable: true,
      key: key1,
      title: `${
        this.formDS.current && this.formDS.current.get('archiveDetailId') ? '修改' : '新增'
      }服务归档详情`,
      drawer: true,
      style: {
        width: 500,
      },
      children: (
        <Form dataSet={this.formDS}>
          <Lov name="targetDatasourceObj" />
          <Lov name="targetTenantObj" />
        </Form>
      ),
      onOk: this.handleOk,
    });
  }

  @Bind()
  handleEdit(record) {
    this.formDS.current.set('_token', record.data._token);
    this.formDS.current.set('objectVersionNumber', record.data.objectVersionNumber);
    this.formDS.current.set('archiveId', record.data.archiveId);
    this.formDS.current.set('archiveDetailId', record.data.archiveDetailId);

    this.formDS.current.set('targetDatasourceObj', {
      datasourceId: record.data.targetDatasourceId,
      datasourceCode: record.data.targetDatasourceCode,
      description: record.data.targetDescription,
    });

    this.formDS.current.set('targetTenantObj', {
      tenantId: record.data.targetTenantId,
      tenantNum: record.data.targetTenantNum,
      tenantName: record.data.targetTenantName,
    });

    Modal.open({
      closable: true,
      key: key1,
      title: `${
        this.formDS.current && this.formDS.current.get('archiveDetailId') ? '修改' : '新增'
      }服务归档详情`,
      drawer: true,
      style: {
        width: 500,
      },
      children: (
        <Form dataSet={this.formDS}>
          <Lov name="targetDatasourceObj" />
          <Lov name="targetTenantObj" />
        </Form>
      ),
      onOk: this.handleOk,
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
    const baseObj = {
      archiveId: this.formDS.current.get('archiveId'),
      targetDatasourceId: this.formDS.current.get('targetDatasourceId'),
      targetTenantId: this.formDS.current.get('targetTenantId'),
      tenantId: getCurrentOrganizationId(),
    };
    const archiveDetailId = this.formDS.current.get('archiveDetailId');
    const obj = archiveDetailId
      ? Object.assign({}, baseObj, {
          archiveDetailId,
          _token: this.formDS.current.get('_token'),
          objectVersionNumber: this.formDS.current.get('objectVersionNumber'),
        })
      : baseObj;
    const res = archiveDetailId ? await updateArchivesDetail(obj) : await addArchivesDetail(obj);
    if (res.failed) {
      notification.error({
        message: res.message,
      });
      return;
    }
    notification.success({
      message: '操作成功',
    });
    this.tableDS.query();
  }

  @Bind()
  handleArchiveOk() {
    this.setState({
      archiveVisible: false,
    });
  }

  /**
   * 一键复制
   */
  @Bind()
  handleCopy() {
    const copyDOM = document.querySelector('.copy-item');

    if (copyDOM.innerHTML !== '') {
      const range = document.createRange(); // 创建一个range
      window.getSelection().removeAllRanges(); // 清楚页面中已有的selection
      range.selectNode(copyDOM); // 选中需要复制的节点
      window.getSelection().addRange(range); // 执行选中元素
      const successful = document.execCommand('copy'); // 执行 copy 操作

      if (successful) {
        notification.success({
          message: '复制成功！',
        });
      } else {
        notification.error({
          message: '复制失败，请手动复制！',
        });
      }
      // 移除选中的元素
      window.getSelection().removeAllRanges();
    } else {
      notification.error({
        message: '没有内容',
      });
    }
  }

  render() {
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.taskItem`).d('服务归档详情')}
          backPath="/ldtt/service-archive"
        >
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            新建
          </Button>
        </Header>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} queryFieldsLimit={4} />

          <HModal
            title="清空归档数据报文"
            visible={this.state.archiveVisible}
            onOk={this.handleArchiveOk}
            onCancel={this.handleArchiveOk}
            center
          >
            <Button
              key="update"
              color="primary"
              funcType="flat"
              className="one-copy"
              icon="file_copy-o"
              onClick={this.handleCopy}
            >
              一键复制
            </Button>
            ,
            <div className="copy-item">
              {this.state.archiveDeleteMes &&
                this.state.archiveDeleteMes.map((item) => {
                  return <p>{item}</p>;
                })}
            </div>
          </HModal>
        </Content>
      </Fragment>
    );
  }
}
