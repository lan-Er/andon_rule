/*
 * @Descripttion:
 * @Author: chenyang.liu
 * @Date: 2019-09-26 17:27:10
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-08-20 14:12:17
 */
import React, { PureComponent } from 'react';
import { Collapse } from 'choerodon-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskItemCard from '../TaskItemCard/TaskItemCard';

const { Panel } = Collapse;
const grid = 2;
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'rgba(173, 216, 230, 0.6)' : 'transparent',
  display: 'flex',
  flexWrap: 'wrap',
  padding: grid,
  overflow: 'auto',
  height: '210px',
});
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,
  background: isDragging ? 'lightgreen' : 'transparent',
  ...draggableStyle,
});

@connect(({ lispResourcePlanModel }) => ({
  resourcePlanList: lispResourcePlanModel.resourcePlanList,
  taskList: lispResourcePlanModel.taskList,
}))
/**
 * @param {Array} taskList task列表
 */
class TaskList extends PureComponent {
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
    const { taskList } = this.props;
    return (
      <Collapse defaultActiveKey={['1']}>
        <Panel header="TASK列表" key="1">
          <Droppable
            type="TASK"
            mode="virtual"
            droppableId="task"
            direction="horizontal"
            // renderClone={(
            //   dropProvided,
            //   dropSnapshot,
            //   rubric,
            // ) => (
            //   <div
            //     ref={dropProvided.innerRef}
            //     {...dropProvided.draggableProps}
            //     {...dropProvided.dragHandleProps}
            //     style={getItemStyle(
            //       dropSnapshot.isDragging,
            //       dropProvided.draggableProps.style
            //     )}
            //   >
            //     <TaskItemCard/>
            //   </div>
            // )}
          >
            {(dropProvided, dropSnapshot) => (
              <div ref={dropProvided.innerRef} style={getListStyle(dropSnapshot.isDraggingOver)}>
                {taskList.map((item, index) => (
                  <Draggable key={item.dataId} draggableId={item.dataId} index={index}>
                    {(dropProvidedItem, dropSnapshotItem) => (
                      <div
                        ref={dropProvidedItem.innerRef}
                        {...dropProvidedItem.draggableProps}
                        {...dropProvidedItem.dragHandleProps}
                        style={getItemStyle(
                          dropSnapshotItem.isDragging,
                          dropProvidedItem.draggableProps.style
                        )}
                      >
                        <TaskItemCard
                          item={item}
                          needCheck={false}
                          searchMo={() => this.searchMo(item)}
                          draggingOver={dropSnapshotItem.isDraggingOver}
                          index={index}
                          key={item.dataId}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                <div>{dropProvided.placeholder}</div>
              </div>
            )}
          </Droppable>
        </Panel>
      </Collapse>
    );
  }
}

export default TaskList;
