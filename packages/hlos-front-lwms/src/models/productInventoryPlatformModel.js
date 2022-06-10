export default {
  namespace: 'productInventoryPlatform',
  state: {
    headList: [],
    lineList: [],
    pagination: {},
    linePagination: {},
    headRequestId: null,
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
