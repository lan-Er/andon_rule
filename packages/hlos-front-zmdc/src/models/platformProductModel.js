import { getResponse } from 'utils/utils';
import {
  updateProducts,
  saveProductVersions,
  updateProductVersions,
  upgradeProductVersions,
  getProductVersionRoles,
  saveProductVersionRoles,
  deleteProductVersionRoles,
  getProductVersionMenus,
  getVersionList,
} from '@/services/platformProductService';

export default {
  namespace: 'platformProductModel',
  state: {},
  effects: {
    *updateProducts({ payload }, { call }) {
      return getResponse(yield call(updateProducts, payload));
    },
    // 保存平台产品
    *saveProductVersions({ payload }, { call }) {
      return getResponse(yield call(saveProductVersions, payload));
    },
    // 更新平台产品
    *updateProductVersions({ payload }, { call }) {
      return getResponse(yield call(updateProductVersions, payload));
    },
    // 升级平台产品
    *upgradeProductVersions({ payload }, { call }) {
      return getResponse(yield call(upgradeProductVersions, payload));
    },
    // 查看关联角色
    *getProductVersionRoles({ payload }, { call }) {
      return getResponse(yield call(getProductVersionRoles, payload));
    },
    // 新增关联角色
    *saveProductVersionRoles({ payload }, { call }) {
      return getResponse(yield call(saveProductVersionRoles, payload));
    },
    // 删除关联角色
    *deleteProductVersionRoles({ payload }, { call }) {
      return getResponse(yield call(deleteProductVersionRoles, payload));
    },
    // 查看关联菜单
    *getProductVersionMenus({ payload }, { call }) {
      return getResponse(yield call(getProductVersionMenus, payload));
    },
    // 获取版本信息
    *getVersionList({ payload }, { call }) {
      return getResponse(yield call(getVersionList, payload));
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
