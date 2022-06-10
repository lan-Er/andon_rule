/*
 * @Descripttion:
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-09-08 14:34:51
 * @LastEditors: jianjun.tan
 */

import React, { Component } from 'react';
import { Icon, Spin } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { DatePicker } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

import ScreenForm from './ScreenForm';
import Task from '../Task';
import '../index.less';

const { RangePicker } = DatePicker;

const Container = styled.div`
  margin: 8px;
  border: 1px solid #f6f6f6;
  border-radius: 2px;
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
`;

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'lightgrey' : '#F6F6F6')}
  flex-grow: 1;
  min-height: 100px;
`;

export default class Waiting extends Component {
  state = { display: false, selectVisible: false };

  componentDidMount() {
    const {
      onColumn,
      column: { fromResourceId, resourceClass },
    } = this.props;

    onColumn({ resourceClass, resourceId: fromResourceId, keyType: 'waiting' });
  }

  @Bind()
  handleChangeShow(display) {
    this.setState({ display });
  }

  @Bind()
  handleSelectTask(selectVisible) {
    this.setState({ selectVisible });
  }

  @Bind()
  handleScreenOK(flag = true, startDate, endDate) {
    const {
      dataSet,
      onColumn,
      column: { fromResourceId, resourceClass },
    } = this.props;
    let { planStartDate, planEndDate } = this.props;
    if (!flag) {
      planStartDate = startDate;
      planEndDate = endDate;
    }
    const { operationObj, operationName, ...other } = dataSet.toData()[0] || {};
    onColumn({
      resourceClass,
      resourceId: fromResourceId,
      keyType: 'waiting',
      ...other,
      planStartDate,
      planEndDate,
    });
    if (flag) {
      this.handleSelectTask(!this.state.selectVisible);
    }
  }

  handleChangeRangePicker = (value) => {
    let planStartDate = null;
    let planEndDate = null;
    if (!isEmpty(value)) {
      const [startTime, endTime] = value;
      planStartDate = startTime.format().split('T')[0]; // incorrect
      planEndDate = endTime.format().split('T')[0]; // incorrect
      this.props.onState(planStartDate, planEndDate);
    }
    this.handleScreenOK(false, planStartDate, planEndDate);
  };

  render() {
    const { display, selectVisible } = this.state;
    const {
      loading,
      tasks,
      column = {},
      fromResourceClassMeaning,
      toResourceClassMeaning,
      dataSet,
    } = this.props;
    const { dispatchedAmount = 0, otherAmount = 0, runningAmount = 0, totalAmount = 0 } = column;
    const screenProps = {
      visible: selectVisible,
      ds: dataSet,
      onOK: this.handleScreenOK,
      onCancel: this.handleSelectTask,
    };
    return (
      <Container>
        <div className="column-waiting-div">
          <div className="waiting-header">
            <div className="waiting-header-left" style={{ display: display ? 'none' : '' }}>
              <div className="waiting-header-div header1">待排区</div>
              <div className="waiting-header-div header2">
                <a onClick={() => this.handleSelectTask(!selectVisible)}>筛选</a>
              </div>
            </div>
            <div className="waiting-header-right">
              <span onClick={() => this.handleChangeShow(!display)} style={{ cursor: 'pointer' }}>
                <Icon type={display ? 'format_indent_increase' : 'format_indent_decrease'} />
              </span>
            </div>
          </div>
          <div className="column-waiting-range-picker" style={{ display: display ? 'none' : '' }}>
            <RangePicker
              onChange={this.handleChangeRangePicker}
              format={DEFAULT_DATE_FORMAT}
              style={{ backgroundColor: 'white' }}
            />
          </div>
          <div className="waiting-content" style={{ display: display ? 'none' : '' }}>
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
          <div className="column-buttom-list" style={{ display: display ? 'none' : '' }}>
            <div className="column-buttom-item">
              <div className="column-buttom-header">
                <span>总数</span>
              </div>
              <div className="column-buttom-content">
                <span>{totalAmount}</span>
              </div>
            </div>
            <div className="column-buttom-item">
              <div className="column-buttom-header">
                <span>已分派</span>
              </div>
              <div className="column-buttom-content">
                <span>{dispatchedAmount}</span>
              </div>
            </div>
            <div className="column-buttom-item">
              <div className="column-buttom-header">
                <span>运行中</span>
              </div>
              <div className="column-buttom-content">
                <span>{runningAmount}</span>
              </div>
            </div>
            <div className="column-buttom-item">
              <div className="column-buttom-header">
                <span>其他</span>
              </div>
              <div className="column-buttom-content-right">
                <span>{otherAmount}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: '256px', display: display ? 'none' : '' }}>
          {loading ? (
            <Droppable droppableId="waiting" type="TASK">
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {column.taskIds.map((taskId, index) => (
                    <Task key={taskId} task={tasks[taskId]} index={index} />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Spin />
            </div>
          )}
        </div>
        {selectVisible && <ScreenForm {...screenProps} />}
      </Container>
    );
  }
}
