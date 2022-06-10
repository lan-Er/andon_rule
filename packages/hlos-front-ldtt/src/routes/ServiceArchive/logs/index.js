/*
 * @Descripttion: 日志查看
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-01-13 15:31:20
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-01-13 16:29:42
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind } from 'lodash-decorators';
import { DataSet, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { TaskLogsDS } from '@/stores/taskLogsDS';

@connect()
export default class TaskLogs extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...TaskLogsDS(),
    });
  }

  state = {
    archiveId: null,
  };

  componentDidMount() {
    if (this.props.location.state) {
      const { taskId, archiveId } = this.props.location.state;
      if (taskId) {
        this.tableDS.setQueryParameter('taskId', taskId);
        this.setState({
          archiveId,
        });
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

  @Bind()
  goTaskItem() {
    const { archiveId } = this.state;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ldtt/service-archive/detail',
        state: {
          archiveId,
        },
      })
    );
  }

  get title() {
    return (
      <div style={{ marginLeft: '-16px' }}>
        <i className="anticon anticon-arrow-left back-btn" onClick={this.goTaskItem} />
        <span style={{ marginLeft: '15px' }}>日志查看</span>
      </div>
    );
  }

  render() {
    return (
      <Fragment>
        <Header title={this.title} />
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} queryFieldsLimit={4} />
        </Content>
      </Fragment>
    );
  }
}
