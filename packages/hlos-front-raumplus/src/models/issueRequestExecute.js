/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-04-25 19:40:54
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-04-25 23:36:14
 */

export default {
  namespace: 'issueRequestExecute',
  state: {
    defaultWarehouseObj: {},
  },
  reducers: {
    updateDefaultWarehouseObj(state, action) {
      console.log('修改了', action.payload);
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects: {},
};
