import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { DataSet, Table, Button, Form, TextField, Lov, Modal } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId } from 'utils/utils';
import { ServiceArchiveDS, ServiceCreateFormDS } from '@/stores/serviceArchiveDS';
import { addArchives } from '@/services/serviceArchive';
import './index.less';

const key1 = Modal.key();
const preCode = 'ldtt.task';

@connect()
export default class ServiceArchive extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...ServiceArchiveDS(),
    });
    this.formDS = new DataSet({
      ...ServiceCreateFormDS(),
    });
  }

  async componentDidMount() {
    await this.formDS.create({});
  }

  get columns() {
    return [
      {
        name: 'archiveName',
        align: 'center',
        editor: true,
        renderer: ({ record, value }) => {
          const obj = {
            archiveId: record.get('archiveId'),
          };
          return <a onClick={() => this.handleToTaskItem(obj)}>{value || ''}</a>;
        },
      },
      { name: 'sourceDatasourceObj', align: 'center', editor: true },
      { name: 'sourceDatasourceUrl', align: 'center', width: 300 },
      { name: 'remark', align: 'center', editor: true },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  @Bind()
  handleToTaskItem(obj) {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ldtt/service-archive/detail',
        state: obj,
      })
    );
  }

  @Bind
  handleCreate() {
    this.formDS.reset();

    Modal.open({
      closable: true,
      key: key1,
      title: '新增服务归档',
      drawer: true,
      style: {
        width: 500,
      },
      children: (
        <Form dataSet={this.formDS}>
          <TextField name="archiveName" />
          <Lov name="sourceDatasourceObj" />
          <TextField name="remark" />
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
    const obj = {
      archiveName: this.formDS.current.get('archiveName'),
      sourceDatasourceId: this.formDS.current.get('sourceDatasourceId'),
      tenantId: getCurrentOrganizationId(),
      remark: this.formDS.current.get('remark'),
    };
    const res = await addArchives(obj);
    if (res.failed) {
      notification.error({
        message: res.message,
      });
      return;
    }
    notification.success({
      message: '创建成功',
    });
    this.tableDS.query();
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.serviceArchive`).d('服务归档')}>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            新建
          </Button>
        </Header>
        <Content>
          <Table
            dataSet={this.tableDS}
            columns={this.columns}
            queryFieldsLimit={4}
            editMode="inline"
          />
        </Content>
      </Fragment>
    );
  }
}
