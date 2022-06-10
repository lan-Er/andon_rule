/**
 * @Description: 设备监控Model
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-23 14:05:12
 */

import { getResponse } from 'utils/utils';
import {
  queryEquipmentStatus,
  queryEquipmentCheckRate,
  queryEquipmentAndon,
  queryEquipmentTypeStatus,
  queryEquipmentMap,
  queryEquipmentMapModal,
} from '../services/equipmentMonitor';

export default {
  namespace: 'equipmentMonitor',
  state: {
    filterChange: false,
  },
  effects: {
    *toggleFilterChange(_, { put }) {
      yield put({ type: '_toggleFilterChange' });
    },
    // 查询设备当前状态
    *queryEquipmentStatus({ payload }, { call }) {
      return getResponse(yield call(queryEquipmentStatus, payload));
    },
    // 查询设备点检进度
    *queryEquipmentCheckRate({ payload }, { call }) {
      return getResponse(yield call(queryEquipmentCheckRate, payload));
    },
    // 查询设备综合效率--接口暂无，文档还在写
    // *queryProcessOrResponseTimeTop({ payload }, { call }) {
    //   return getResponse(yield call(queryProcessOrResponseTimeTop, payload));
    // },
    // 查询待处理/处理中设备安灯
    *queryEquipmentAndon({ payload }, { call }) {
      return getResponse(yield call(queryEquipmentAndon, payload));
    },
    // 查询各类设备状态
    *queryEquipmentTypeStatus({ payload }, { call }) {
      return getResponse(yield call(queryEquipmentTypeStatus, payload));
    },
    // 查询设备地图
    *queryEquipmentMap({ payload }, { call }) {
      return getResponse(yield call(queryEquipmentMap, payload));
    },
    // 查询设备地图--弹窗
    *queryEquipmentMapModal({ payload }, { call }) {
      return getResponse(yield call(queryEquipmentMapModal, payload));
    },
  },
  reducers: {
    _toggleFilterChange(state) {
      return {
        ...state,
        filterChange: !state.filterChange,
      };
    },
  },
};
