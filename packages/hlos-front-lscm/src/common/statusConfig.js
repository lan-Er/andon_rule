/*
 * config - 前端全局变量配置
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-11-6 11:09:21
 * @LastEditors: TJ
 */
const statusValue = {
  lmds: {
    organizationStatus: {
      // 主数据自审批状态快码
      new: 'NEW', // 新建
      approved: 'APPROVED', // 已通过
      invalid: 'INVALID', //  作废
    },
  },
};

export default {
  // 快码状态值配置
  statusValue,
};
