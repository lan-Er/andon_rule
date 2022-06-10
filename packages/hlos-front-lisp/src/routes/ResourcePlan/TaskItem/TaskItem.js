/*
 * @Descripttion:
 * @Author: chenyang.liu
 * @Date: 2019-09-24 15:54:40
 * @LastEditors: allen
 * @LastEditTime: 2019-10-31 18:46:57
 */
import React from 'react';
import { connect } from 'dva';
import { Draggable } from 'react-beautiful-dnd';
import { Bind } from 'lodash-decorators';

import TaskItemCard from '../TaskItemCard/TaskItemCard';

const grid = 2;
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,
  background: isDragging ? 'lightgreen' : 'transparent',
  ...draggableStyle,
});

/**
 * @param {*} taskArray task列表数据
 */
@connect(({ lispResourcePlanModel }) => ({
  checkArray: lispResourcePlanModel.checkArray,
  resourcePlanList: lispResourcePlanModel.resourcePlanList,
  taskList: lispResourcePlanModel.taskList,
}))
class TaskItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      taskArray: [],
    };
  }

  componentDidMount() {
    this.setState({
      taskArray: this.props.taskArray,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.taskArray !== this.props.taskArray) {
      this.setState({ taskArray: nextProps.taskArray });
    }
  }

  /**
   * 勾选task操作
   * @param {object} item 选中的task
   * @param {number} index task的索引
   */
  @Bind
  checkIt(item, index) {
    const { checkArray, dispatch } = this.props;
    const taskArray = Array.from(this.state.taskArray);
    if (checkArray.includes(item.dataId)) {
      checkArray.splice(checkArray.indexOf(item.dataId), 1);
    } else {
      checkArray.push(item.dataId);
    }
    taskArray[index] = item;
    this.setState({ taskArray });
    dispatch({
      type: 'lispResourcePlanModel/updateState',
      payload: {
        checkArray,
      },
    });
  }

  /**
   * 点击task
   * @param {object} record 点击的task
   */
  @Bind
  searchMo(record) {
    const { taskList, dispatch } = this.props;
    const resourcePlanList = Array.from(this.props.resourcePlanList);
    taskList.forEach((item, index) => {
      taskList[index].ifLight = item.attribute2 === record.attribute2;
    });
    resourcePlanList.forEach((equipmentGroup, equipmentGroupIndex) => {
      equipmentGroup.resourcePlanLineFeignDtoList.forEach((equipment, equipmentIndex) => {
        equipment.taskList.forEach((task, taskIndex) => {
          resourcePlanList[equipmentGroupIndex].resourcePlanLineFeignDtoList[
            equipmentIndex
          ].taskList[taskIndex].ifLight = task.attribute2 === record.attribute2;
        });
      });
    });
    dispatch({
      type: 'lispResourcePlanModel/updateState',
      payload: {
        resourcePlanList,
        taskList,
      },
    });
  }

  render() {
    const { taskArray } = this.state;
    return taskArray.map((item, index) => (
      <Draggable
        key={item.dataId}
        draggableId={item.dataId}
        index={index}
        isDragDisabled={item.attribute7 === '运行中'}
      >
        {(dropProvided, dropSnapshot) => (
          <div
            ref={dropProvided.innerRef}
            {...dropProvided.draggableProps}
            {...dropProvided.dragHandleProps}
            style={getItemStyle(dropSnapshot.isDragging, dropProvided.draggableProps.style)}
          >
            <TaskItemCard
              item={item}
              needCheck
              searchMo={() => this.searchMo(item)}
              checkIt={() => this.checkIt(item, index)}
              key={item.dataId}
            />
            {dropProvided.placeholder}
          </div>
        )}
      </Draggable>
    ));
  }
}

export default TaskItem;
