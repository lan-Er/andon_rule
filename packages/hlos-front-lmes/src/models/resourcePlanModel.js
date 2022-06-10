/*
 * @Descripttion: 资源计划Model
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-09-08 14:34:51
 * @LastEditors: jianjun.tan
 */
import { getResponse } from 'utils/utils';
import {
  queryUserConfigs,
  queryTasksSwimLane,
  updateScheduleTaskOrder,
} from '@/services/resourcePlanService';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

function columnsMap(listForm, listTo, fromResourceClass) {
  const tasksLoading = { waiting: false };
  const columnOrder = ['waiting'];
  const columns = {
    waiting: {
      resourceId: 'waiting',
      fromResourceId: isEmpty(listForm) ? null : listForm[0].resourceId,
      resourceClass: fromResourceClass,
      taskIds: [],
    },
  };
  if (isEmpty(listTo)) {
    return { tasksLoading, columns, columnOrder, tasks: {} };
  }
  listTo.forEach((record) => {
    const { resourceCode, resourceClass, resourceId, resourceName } = record;
    columns[resourceId] = {
      resourceCode,
      resourceClass,
      resourceId,
      resourceName,
      taskIds: [],
    };
    columnOrder.push(resourceId);
    tasksLoading[resourceId] = false;
  });
  return { tasksLoading, columns, columnOrder, tasks: {} };
}

function tasksMap(state, payload) {
  const {
    key,
    result: {
      taskSwimLaneCards,
      dispatchedAmount,
      otherAmount,
      runningAmount,
      totalAmount,
      standardWorkTime,
    },
  } = payload;
  const { tasksLoading, columns, tasks = {} } = state;
  const updateTaskPriority = [];
  const priorityData = {};
  if (!isEmpty(taskSwimLaneCards)) {
    const taskIds = taskSwimLaneCards.map((record, index) => {
      const { taskId, priority } = record;
      tasks[taskId] = record;
      updateTaskPriority.push({ taskId, priority: index });
      if (priority !== undefined) {
        priorityData[priority] = priority;
      }
      return taskId;
    });
    columns[key].taskIds = taskIds;
  } else {
    columns[key].taskIds = [];
  }
  columns[key].dispatchedAmount = dispatchedAmount;
  columns[key].otherAmount = otherAmount;
  columns[key].runningAmount = runningAmount;
  columns[key].totalAmount = totalAmount;
  columns[key].standardWorkTime = standardWorkTime;
  tasksLoading[key] = true;

  if (Object.keys(priorityData).length !== updateTaskPriority.length && key !== 'waiting') {
    updateScheduleTaskOrder(updateTaskPriority);
  }
  return { ...state, ...{ tasks } };
}

const currentDate = moment(new Date()).format(DEFAULT_DATE_FORMAT); // 日期

export default {
  namespace: 'resourcePlan', // model名称
  state: {
    tasks: {}, // 任务
    columns: {}, // 泳道
    columnOrder: [], // 泳道order集合
    tasksLoading: {}, // 任务加载
    organizationId: null, // 组织ID
    organizationName: null, // 组织NAME
    fromResourceClassMeaning: null,
    toResourceClassMeaning: null,
    activeDateKey: null, // 当前日期
    dateAll: [], // 日期集合
    resourcePlanLoading: false, // 页面加载Loading
    droppableLoading: false, // 页面加载Loading
  },
  effects: {
    *fetchScheduleUserConfigs(_, { call, put }) {
      const resFrom = getResponse(yield call(queryUserConfigs, { swimType: 'FROM' }));
      const resTo = getResponse(yield call(queryUserConfigs, { swimType: 'TO' }));
      if (resFrom && resTo) {
        const {
          organizationId,
          organizationName,
          fromResourceClassMeaning,
          toResourceClassMeaning,
          fromResourceClass,
        } = resFrom;
        const dateScheduled = resTo.dateScheduledControl
          ? { activeDateKey: currentDate, dateAll: [currentDate] }
          : { activeDateKey: null, dateAll: [] };
        yield put({
          type: 'updateState',
          payload: {
            resourcePlanLoading: true,
            organizationId,
            organizationName,
            fromResourceClassMeaning,
            toResourceClassMeaning,
            ...dateScheduled,
            ...columnsMap(resFrom.lineList, resTo.lineList, fromResourceClass),
          },
        });
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          resourcePlanLoading: true,
        },
      });
    },

    *fetchTasksSwimLane({ payload }, { call, put }) {
      const { keyType, ...other } = payload;
      const key = keyType === 'waiting' ? keyType : other.resourceId;
      const res = getResponse(yield call(queryTasksSwimLane, other));
      if (res) {
        yield put({
          type: 'updateTaskState',
          payload: {
            key,
            result: res,
          },
        });
      } else {
        yield put({
          type: 'updateStateTasksLoading',
          payload: { key },
        });
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateTaskState(state, { payload }) {
      return {
        ...tasksMap(state, payload),
      };
    },
    updateStateTasksLoading(state, { payload }) {
      const { tasksLoading } = state;
      tasksLoading[payload.key] = true;
      return {
        ...state,
      };
    },
    reset() {
      return {
        tasks: {}, // 任务
        columns: {}, // 泳道
        columnOrder: [], // 泳道order集合
        tasksLoading: {}, // 任务加载
        organizationId: null, // 组织ID
        organizationName: null, // 组织NAME
        fromResourceClassMeaning: null,
        toResourceClassMeaning: null,
        activeDateKey: null, // 当前日期
        dateAll: [], // 日期集合
        resourcePlanLoading: false, // 页面加载Loading
        droppableLoading: false,
      };
    },
  },
};
