/*
 * @Descripttion:
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-09-08 14:34:51
 * @LastEditors: jianjun.tan
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Button, DataSet, Spin } from 'choerodon-ui/pro';
import { routerRedux } from 'dva/router';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { getResponse } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { updatePreScheduleTask } from '@/services/resourcePlanService';
import { ScreenFormDS, PlanDateDS } from '@/stores/resourcePlanDS';
import notification from 'utils/notification';

import './index.less';
import Board from './Board';

const promptCode = 'lmes.resourcePlan';

@connect(({ resourcePlan }) => ({
  resourcePlan,
}))
@formatterCollections({ code: promptCode })
export default class ResourcePlan extends Component {
  state = {
    planStartDate: null,
    planEndDate: null,
  };

  componentDidMount() {
    this.handleUserScheduleConfigs();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'resourcePlan/reset',
    });
  }

  screenFormDS = new DataSet(ScreenFormDS());

  planDateDS = new DataSet(PlanDateDS());

  @Bind()
  async handleDragEnd(result) {
    const { destination, source, draggableId } = result;
    // dropped nowhere
    if (!destination) {
      return;
    }
    const { droppableId: sDroppableId, index: sIndex } = source;
    const { droppableId: dDroppableId, index: dIndex } = destination;
    // did not move anywhere - can bail early
    if (sDroppableId === dDroppableId && sIndex === dIndex) {
      return;
    }
    // get namespace
    const {
      resourcePlan: { organizationId, columns, activeDateKey },
    } = this.props;
    // 当前泳道
    const sColumn = columns[sDroppableId];
    const current = sColumn.taskIds;
    // 当前列拖动
    if (sDroppableId === dDroppableId) {
      if (sDroppableId === 'waiting') {
        return;
      }
      const newTaskIds = Array.from(current);
      newTaskIds.splice(sIndex, 1);
      newTaskIds.splice(dIndex, 0, draggableId);

      columns[sDroppableId].taskIds = newTaskIds;
      this.handleUpdateState({ columns, droppableLoading: true });
      getResponse(
        await this.handleUpdateTask(
          organizationId,
          current[sIndex],
          dIndex,
          sColumn,
          sColumn,
          activeDateKey
        )
      );
      this.handleRefreshTasksSwimLane(sColumn, activeDateKey);
      this.handleUpdateState({ droppableLoading: false });
      return;
    }

    // 列之间拖动
    const dColumn = columns[dDroppableId];
    const next = dColumn.taskIds;
    const startTaskIds = Array.from(current);
    startTaskIds.splice(sIndex, 1);
    columns[sDroppableId].taskIds = startTaskIds;

    const finishTaskIds = Array.from(next);
    finishTaskIds.splice(dIndex, 0, draggableId);
    columns[dDroppableId].taskIds = finishTaskIds;
    this.handleUpdateState({ columns, droppableLoading: true });
    // 跨列拖动更新接口
    getResponse(
      await this.handleUpdateTask(
        organizationId,
        current[sIndex],
        dIndex,
        sColumn,
        dColumn,
        activeDateKey
      )
    );
    this.handleRefreshTasksSwimLane(sColumn, activeDateKey);
    this.handleRefreshTasksSwimLane(dColumn, activeDateKey);
    this.handleUpdateState({ droppableLoading: false });
  }

  /**
   * 拖拉更新失败后重新刷新
   * @param {json} column
   */
  @Bind()
  handleRefreshTasksSwimLane(column, planStartDate) {
    const { resourceClass, resourceId, fromResourceId } = column;
    const payload = { resourceClass, resourceId };
    if (resourceId === 'waiting') {
      const { planStartDate: startDate, planEndDate: endDate } = this.state;
      payload.keyType = 'waiting';
      payload.resourceId = fromResourceId;
      payload.planStartDate = startDate;
      payload.planEndDate = endDate;
    } else {
      payload.planStartDate = planStartDate;
    }
    this.handleTasksSwimLane(payload);
  }

  @Bind()
  async handleUpdateTask(
    organizationId,
    taskId,
    priority,
    source = {},
    target = {},
    planStartDate
  ) {
    const payload = {
      organizationId,
      priority,
      sourceResourceClass: source.resourceClass,
      sourceResourceCode: source.resourceCode,
      sourceResourceId: source.resourceId === 'waiting' ? null : source.resourceId,
      targetResourceClass: target.resourceClass,
      targetResourceCode: target.resourceCode,
      targetResourceId: target.resourceId === 'waiting' ? target.fromResourceId : target.resourceId,
      planStartDate:
        target.resourceId === 'waiting' || isEmpty(planStartDate)
          ? null
          : `${planStartDate} 00:00:00`,
      taskId,
    };
    const result = await updatePreScheduleTask(payload);
    return result;
  }

  @Bind()
  handleUpdateState(payload = {}) {
    this.props.dispatch({
      type: 'resourcePlan/updateState',
      payload: { ...payload },
    });
  }

  @Bind()
  async handleUserScheduleConfigs() {
    await this.props.dispatch({ type: 'resourcePlan/fetchScheduleUserConfigs' });
  }

  @Bind()
  handleTasksSwimLane(payload = {}) {
    const {
      dispatch,
      resourcePlan: { organizationId },
    } = this.props;
    let params = {};
    if (payload.keyType === 'waiting') {
      const { operationObj, operationName, ...other } = this.screenFormDS.toData()[0] || {};
      params = other;
    }
    dispatch({
      type: 'resourcePlan/fetchTasksSwimLane',
      payload: {
        ...params,
        ...payload,
        organizationId,
      },
    });
  }

  /**
   * 资源计划编辑配置
   */
  @Bind()
  handleResourcePlanConfig() {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/lmes/resource-plan/config',
      })
    );
  }

  /**
   * 切换排产日期
   */
  @Bind()
  handelChangeTabs(activeDateKey) {
    this.handleUpdateState({ activeDateKey, tasksLoading: { waiting: true } });
  }

  /**
   * 确定按照日期间隔查询
   */
  @Bind()
  handleSureSearch() {
    const dateList = this.planDateDS.toData();
    if (!isEmpty(dateList)) {
      const { startDate, endDate } = dateList[0];
      const {
        resourcePlan: { activeDateKey },
      } = this.props;
      if (isEmpty(startDate)) {
        notification.warning({ message: '请选择开始时间' });
        return;
      }
      if (isEmpty(endDate)) {
        notification.warning({ message: '请选择结束时间' });
        return;
      }
      const dateAll = this.getYearAndMonthAndDay(startDate, endDate);
      const uspdateStatePayload = { dateAll, activeDateKey: startDate };
      if (startDate !== activeDateKey) {
        uspdateStatePayload.tasksLoading = { waiting: true };
      }
      this.handleUpdateState(uspdateStatePayload);
    } else {
      notification.warning({ message: '请选择时间' });
    }
  }

  @Bind()
  handleState(planStartDate, planEndDate) {
    this.setState({ planStartDate, planEndDate });
  }

  /**
   * 获取一段时间集合
   * @param {} start
   * @param {*} end
   */
  @Bind()
  getYearAndMonthAndDay(start, end) {
    let i = 0;
    const dateAll = [];
    const startTime = this.getDate(start);
    const endTime = this.getDate(end);
    while (endTime.getTime() - startTime.getTime() >= 0) {
      const year = startTime.getFullYear();
      const month =
        (startTime.getMonth() + 1).toString().length === 1
          ? `0${(startTime.getMonth() + 1).toString()}`
          : (startTime.getMonth() + 1).toString();
      const day =
        startTime.getDate().toString().length === 1
          ? `0${startTime.getDate()}`
          : startTime.getDate();
      dateAll[i] = `${year}-${month}-${day}`;
      startTime.setDate(startTime.getDate() + 1);
      i += 1;
    }
    return dateAll;
  }

  /**
   * 字符串日期转成date格式
   * @param {*} datestr
   */
  @Bind()
  getDate(datestr) {
    const temp = datestr.split('-');
    return new Date(temp[0], temp[1] - 1, temp[2]);
  }

  render() {
    const {
      resourcePlan: {
        tasksLoading,
        columnOrder,
        columns,
        tasks,
        organizationName,
        fromResourceClassMeaning,
        toResourceClassMeaning,
        activeDateKey,
        dateAll,
        resourcePlanLoading,
        droppableLoading,
      },
    } = this.props;
    const { planStartDate, planEndDate } = this.state;
    const boardProps = {
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
      screenDS: this.screenFormDS,
      planDS: this.planDateDS,
      onDragEnd: this.handleDragEnd,
      onColumn: this.handleTasksSwimLane,
      onTabs: this.handelChangeTabs,
      onSure: this.handleSureSearch,
      onState: this.handleState,
    };
    return (
      <div className="resource-plan-page-content">
        <div className="resource-plan-config">
          <Button onClick={this.handleResourcePlanConfig}>
            {intl.get(`${promptCode}.button.resource.plan.config`).d('资源设置')}
          </Button>
        </div>
        {resourcePlanLoading ? (
          !isEmpty(columnOrder) && <Board {...boardProps} />
        ) : (
          <div className="resource-plan-loading">
            <Spin />
          </div>
        )}
      </div>
    );
  }
}
