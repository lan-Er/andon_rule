export default {
  namespace: 'singleReturnPlatform',
  state: {
    headList: [],
    lineList: [],
    pagination: {},
    linePagination: {},
    headRequestId: '',
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
