/*
 * @Descripttion: 资源计划model
 * @Author: chenyang.liu
 * @Date: 2019-10-16 19:48:26
 * @LastEditors: allen
 * @LastEditTime: 2019-10-31 19:00:51
 */
import { getResponse } from 'utils/utils';
import {
  getResourcePlanListApi,
  getTaskListApi,
  dragBackApi,
  assignTaskApi,
} from '@/services/resourcePlanService';

export default {
  namespace: 'lispResourcePlanModel', // model名称
  state: {
    taskDescriptionList: [], // 设备标签列表
    resourcePlanList: [],
    checkArray: [], // 选中的task列表
    taskList: [],
    operationList: [], // 工序列表
  },
  effects: {
    // 获取所有设备组的task
    *getResourcePlanList({ payload }, { call, put }) {
      const result = yield call(getResourcePlanListApi, payload);
      if (getResponse(result)) {
        yield put({
          type: 'updateState',
          payload: {
            resourcePlanList: result.content,
          },
        });
      }
    },

    // 获取（查询）task列表
    *getTaskList({ payload }, { call, put }) {
      const result = yield call(getTaskListApi, payload);
      if (getResponse(result)) {
        yield put({
          type: 'updateState',
          payload: {
            taskList: result.content,
          },
        });
      }
    },

    // 将task从设备拖回task列表（设备置空，状态置为NEW）
    *dragBack({ payload }, { call }) {
      return getResponse(yield call(dragBackApi, payload));
    },

    // 下达task
    *assignTask({ payload }, { call }) {
      return getResponse(yield call(assignTaskApi, payload));
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
