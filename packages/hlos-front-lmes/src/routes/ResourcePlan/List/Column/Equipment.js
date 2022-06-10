import React, { Component } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { Bind } from 'lodash-decorators';
import { Icon, Spin } from 'choerodon-ui/pro';

import Task from '../Task';
import '../index.less';

const Container = styled.div`
  margin: 8px;
  border: 1px solid #f6f6f6;
  border-radius: 2px;
  width: 258px;
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

export default class Equipment extends Component {
  state = { display: false };

  componentDidMount() {
    const {
      planStartDate,
      onColumn,
      column: { resourceId, resourceClass },
    } = this.props;
    onColumn({ resourceClass, resourceId, planStartDate });
  }

  @Bind()
  handleChangeShow(display) {
    this.setState({ display });
  }

  render() {
    const { display } = this.state;
    const {
      tasksLoading,
      tasks,
      column: {
        resourceId,
        resourceCode,
        resourceName,
        dispatchedAmount = 0,
        otherAmount = 0,
        runningAmount = 0,
        totalAmount = 0,
        standardWorkTime = 0,
      },
      toResourceClassMeaning,
    } = this.props;
    return (
      <Container>
        <div className="column-header-div">
          <div className="column-header-div-left">
            <span onClick={() => this.handleChangeShow(!display)} style={{ cursor: 'pointer' }}>
              <Icon
                style={{ fontSize: '25px' }}
                type={display ? 'baseline-arrow_right' : 'baseline-arrow_drop_down'}
              />
            </span>
          </div>
          <div className="column-header-div-right">
            <div>
              <p className="column-header-p">
                <span>{resourceCode}</span>
                <span className="column-header-p-span">{toResourceClassMeaning}</span>
              </p>
            </div>
            <div style={{ display: display ? 'none' : '' }}>
              <div>
                <p className="column-content-p">
                  <span>{resourceName}</span>
                  <span style={{ paddingRight: '10px', float: 'right', color: '#333' }}>
                    {standardWorkTime}
                  </span>
                </p>
              </div>
              <div className="column-buttom-list">
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
          </div>
        </div>
        {tasksLoading[resourceId] ? (
          <Droppable droppableId={resourceId} type="TASK">
            {(provided, snapshot) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {tasks.map((task, index) => (
                  <Task key={task.taskId} task={task} index={index} />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        ) : (
          <Spin />
        )}
      </Container>
    );
  }
}
