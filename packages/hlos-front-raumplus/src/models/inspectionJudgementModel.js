/*
 * @Description: 检验判定
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-18 15:24:55
 */

export default {
  namespace: 'InspectionJudgementModel',
  state: {
    inspectionObj: {
      timeToggle: true,
      type: '',
      totalElements: 0,
      inspectionList: [],
      allChecked: false,
      currentPage: 1, // 当前页
      loading: false,
    },
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
