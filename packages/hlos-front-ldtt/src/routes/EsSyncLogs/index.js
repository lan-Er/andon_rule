/**
 * @Description: ES同步-日志查看
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-05 13:39:52
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
// import { Bind } from 'lodash-decorators';
import { DataSet, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { EsSyncLogsDS } from '@/stores/esSyncLogsDS';

@connect()
export default class EsSyncLogs extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...EsSyncLogsDS(),
    });
  }

  componentDidMount() {
    if (this.props.location.state) {
      const { esTaskId } = this.props.location.state;
      if (esTaskId) {
        this.tableDS.setQueryParameter('taskId', esTaskId);
      }
    }
    this.tableDS.query();
  }

  get columns() {
    return [
      { name: 'taskName', align: 'center' },
      { name: 'taskStatusMeaning', align: 'center' },
      { name: 'resultMessage', align: 'center' },
      { name: 'errorMessage', align: 'center' },
      { name: 'taskTime', align: 'center' },
    ];
  }

  render() {
    return (
      <Fragment>
        <Header title="日志查看" backPath="/ldtt/es-syncitem/list" />
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} queryFieldsLimit={4} />
        </Content>
      </Fragment>
    );
  }
}
