/*
 * @Descripttion:
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-09-08 14:34:51
 * @LastEditors: jianjun.tan
 */

import React, { Component, Fragment } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Icon, Form, DatePicker, Button, Spin } from 'choerodon-ui/pro';
import { Tabs } from 'choerodon-ui';
import intl from 'utils/intl';

import Equipment from '../Column/Equipment';
import Waiting from '../Column/Waiting';
import '../index.less';

const { TabPane } = Tabs;

const Container = styled.div`
  display: flex;
  margin-top: 10px;
  background-color: #fff;
`;

const weekArr = [
  intl.get('hzero.common.week.sunday').d('周日'),
  intl.get('hzero.common.week.monday').d('周一'),
  intl.get('hzero.common.week.tuesday').d('周二'),
  intl.get('hzero.common.week.wednesday').d('周三'),
  intl.get('hzero.common.week.thursday').d('周四'),
  intl.get('hzero.common.week.friday').d('周五'),
  intl.get('hzero.common.week.saturday').d('周六'),
];

export default class Board extends Component {
  renderTabPane = (date) => {
    return (
      <div className="board-column-tab-pane">
        <p>{date}</p>
        <p>{weekArr[new Date(date).getDay()]}</p>
      </div>
    );
  };

  render() {
    const {
      planStartDate,
      planEndDate,
      tasksLoading,
      droppableLoading,
      columnOrder,
      columns,
      tasks,
      organizationName,
      fromResourceClassMeaning,
      toResourceClassMeaning,
      activeDateKey,
      dateAll,
      screenDS,
      planDS,
      onDragEnd,
      onColumn,
      onTabs,
      onSure,
      onState,
    } = this.props;
    const waitingProps = {
      planStartDate,
      planEndDate,
      tasks,
      column: columns.waiting,
      loading: tasksLoading.waiting,
      organizationName,
      fromResourceClassMeaning,
      toResourceClassMeaning,
      dataSet: screenDS,
      onColumn,
      onState,
    };
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          <div className="board-column-div-left">
            <Spin spinning={droppableLoading}>
              <Waiting key="waiting" {...waitingProps} />
            </Spin>
          </div>
          <div className="board-column-div-right">
            <div className="board-column-div-right-top">
              <div className="organization">
                <div className="organization-div-left">
                  <span>{organizationName}</span>
                </div>
                {activeDateKey && (
                  <Fragment>
                    <div className="organization-div-right">
                      <Form dataSet={planDS} columns={2} style={{ flex: 'auto' }}>
                        <DatePicker name="startDate" key="startDate" />
                        <DatePicker name="endDate" key="endDate" />
                      </Form>
                    </div>
                    <div className="organization-div-button">
                      <Button color="primary" onClick={onSure}>
                        {intl.get('hzero.common.button.sure').d('确定')}
                      </Button>
                    </div>
                  </Fragment>
                )}
              </div>
              <div className="waiting-content">
                <div className="waiting-content-dev icon">
                  <Icon type="framework" style={{ fontSize: 16, color: '#79bebb' }} />
                </div>
                <div className="waiting-content-dev">
                  <span>{fromResourceClassMeaning}</span>
                </div>
                <div className="waiting-content-dev trending-flat">
                  <Icon type="trending_flat" style={{ fontSize: 16, color: '#79bebb' }} />
                </div>
                <div className="waiting-content-dev icon">
                  <Icon type="settings-o" style={{ fontSize: 16, color: '#79bebb' }} />
                </div>
                <div className="waiting-content-dev">
                  <span>{toResourceClassMeaning}</span>
                </div>
              </div>
            </div>
            {activeDateKey && (
              <Tabs activeKey={activeDateKey} onChange={onTabs} type="card">
                {dateAll.map((key) => (
                  <TabPane tab={this.renderTabPane(key)} key={key} />
                ))}
              </Tabs>
            )}
            <Spin spinning={droppableLoading}>
              <div className="board-column-equipment" key={activeDateKey}>
                {columnOrder
                  .filter((key) => key !== 'waiting')
                  .map((key) => {
                    const column = columns[key];
                    const tasksList = column.taskIds.map((taskId) => tasks[taskId]);
                    const columProps = {
                      tasksLoading,
                      column,
                      tasks: tasksList,
                      onColumn,
                      planStartDate: activeDateKey,
                      toResourceClassMeaning,
                    };
                    return <Equipment key={column.resourceId} {...columProps} />;
                  })}
              </div>
            </Spin>
          </div>
        </Container>
      </DragDropContext>
    );
  }
}
