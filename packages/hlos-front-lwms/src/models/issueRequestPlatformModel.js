export default {
  namespace: 'issueRequestPlatform',
  state: {
    headList: [],
    lineList: [],
    pagination: {},
    linePagination: {},
    headRequestId: '',
  },
  reducers: {
    addData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
