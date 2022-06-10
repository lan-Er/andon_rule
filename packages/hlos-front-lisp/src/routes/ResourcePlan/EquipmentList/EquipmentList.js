/*
 * @Descripttion:
 * @Author: chenyang.liu
 * @Date: 2019-09-25 20:55:35
 * @LastEditors: allen
 * @LastEditTime: 2019-10-31 09:53:10
 */
import React, { PureComponent } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Collapse } from 'choerodon-ui';

import TaskItem from '../TaskItem/TaskItem';
import EquipmentItem from '../EquipmentItem/EquipmentItem';
import styles from './equipmentList.less';

const { Panel } = Collapse;
const grid = 2;

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'rgba(173, 216, 230, 0.6)' : 'transparent',
  display: 'flex',
  padding: grid,
  overflow: 'auto',
  flex: 1,
});

/**
 * @param {object} equipmentGroup 设备组所有字段
 */
class EquipmentList extends PureComponent {
  render() {
    const { attribute3, attribute2, resourcePlanLineFeignDtoList } = this.props.equipmentGroup;
    return (
      <Collapse defaultActiveKey={['1']}>
        <Panel header={attribute2} key="1">
          {resourcePlanLineFeignDtoList &&
            resourcePlanLineFeignDtoList.map((item) => (
              <div className={styles['equipment-row']} key={item.attribute10}>
                <div style={{ marginRight: '10' }}>
                  <EquipmentItem equipment={item} />
                </div>
                <Droppable
                  droppableId={`${attribute3}_${item.attribute10}_${item.dataId}`}
                  type="TASK"
                  direction="horizontal"
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                      {...provided.droppableProps}
                    >
                      <TaskItem taskArray={item.taskList} />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
        </Panel>
      </Collapse>
    );
  }
}

export default EquipmentList;
