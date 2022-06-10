import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { statusEnable, statusColor } from '@/utils/renderer';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import resourcePlanRemindIcon1 from 'hlos-front/lib/assets/icons/resource-plan-remind1.svg';
import resourcePlanRemindIcon2 from 'hlos-front/lib/assets/icons/resource-plan-remind2.svg';
import resourcePlanRemindIcon3 from 'hlos-front/lib/assets/icons/resource-plan-remind3.svg';
import resourcePlanRemindIcon4 from 'hlos-front/lib/assets/icons/resource-plan-remind4.svg';

import '../index.less';

const remind = {
  '1': resourcePlanRemindIcon1,
  '2': resourcePlanRemindIcon2,
  '3': resourcePlanRemindIcon3,
  '4': resourcePlanRemindIcon4,
};

const Container = styled.div`
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
  border-left: ${(props) => `4px solid ${props.color}`};
  background-color: ${(props) => {
    if (props.isDragDisabled) {
      return '#D3D3D3';
    } else if (props.isDragging) {
      return '#fffae8';
    } else {
      return '#FFFFFF';
    }
  }};
  opacity: ${(props) => (props.statusFlag ? 0.5 : 1)};
`;

export default class Task extends Component {
  @Bind
  handleDemandDate(documentNum) {
    return isEmpty(documentNum) ? '' : documentNum.split(' ')[0];
  }

  render() {
    const {
      index,
      task: {
        taskId,
        taskNum,
        itemCode,
        itemDescription,
        taskStatus,
        documentNum,
        demandDate,
        taskQty,
        uomName,
        taskStatusMeaning,
        operationName,
        taskRank,
      },
    } = this.props;
    const statusFlag = statusEnable(taskStatus);
    const draggableProps = {
      statusFlag,
      color: statusColor(taskStatus),
    };
    return (
      <Draggable draggableId={taskId} index={index} isDragDisabled={statusFlag}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            {...draggableProps}
          >
            <div className="quote-item">
              <div className="item-top">
                <div style={{ float: 'left' }}>
                  <p className="item-top-name">{taskNum}</p>
                  <p style={{ paddingTop: '1px', lineHeight: 'normal' }}>
                    {remind[taskRank] && <img src={remind[taskRank]} alt="remindIcon" />}
                  </p>
                </div>
                <div style={{ float: 'right' }}>
                  <p>
                    <span>{taskQty}</span>
                    <span style={{ paddingLeft: '5px' }}>{uomName}</span>
                  </p>
                </div>
              </div>
              <div className="item-content">
                <p style={{ marginRight: '5px' }}>{itemCode}</p>
                <p>{itemDescription}</p>
              </div>
              <div className="item-content-second">
                <p>{operationName}</p>
                <p>
                  {intl.get('hzero.common.status').d('状态')}: {taskStatusMeaning}
                </p>
              </div>
              <div className="item-bottom">
                <p>{documentNum}</p>
                <p>{this.handleDemandDate(demandDate)}</p>
              </div>
            </div>
          </Container>
        )}
      </Draggable>
    );
  }
}
