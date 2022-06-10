/*
 * @module: mobx中间状态管理
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-27 14:38:04
 * @LastEditTime: 2021-05-07 09:54:31
 * @copyright: Copyright (c) 2020,Hand
 */
import { decorate, observable, action } from 'mobx';

import { userSetting } from 'hlos-front/lib/services/api';

class Store {
  queryLoading = false;

  showMore = false;

  showLineTable = false;

  organizationObj = {};

  setQueryLoading(status) {
    this.queryLoading = status;
  }

  setMoreQeuryParams(status) {
    this.showMore = status;
  }

  setShowLineTable(status) {
    this.showLineTable = status;
  }

  async getUserSetting() {
    const res = await userSetting({ defaultFlag: 'Y' });
    if (res && res.content) {
      this.organizationObj = res && res.content[0];
      return res;
    }
  }
}

decorate(Store, {
  queryLoading: observable,
  setQueryLoading: action,
  showMore: observable,
  setMoreQeuryParams: action,
  showLineTable: observable,
  setShowLineTable: action,
  organizationObj: observable,
  getUserSetting: action,
});

const myStore = new Store();
export default myStore;
