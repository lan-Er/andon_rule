/*
 * config - 前端全局变量配置
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-11-6 11:09:21
 * @LastEditors: Please set LastEditors
 */
const code = {
  common: {
    organization: 'LMDS.ORGANIZATION', // 组织
    mo: 'LMES.MO', // MO
    prodLine: 'LMDS.PRODLINE', // 生产线
    itemWm: 'LMDS.ITEM_WM', // 仓储物料
    warehouse: 'LMDS.WAREHOUSE', // 仓库
    wmArea: 'LMDS.WM_AREA', // 货位
    worker: 'LMDS.WORKER', // 操作工
    equipment: 'LMDS.EQUIPMENT', // 设备
    workcell: 'LMDS.WORKCELL', // 工位
    moOperation: 'LMES.MO_OPERATION', // MO工序
    workerGroup: 'LMDS.WORKER_GROUP', // 班组
    rule: 'LMDS.RULE', // 规则
  },
  byProductReport: {
    auditStatus: 'KMJX.LMES.BYPRODUCT_IN_STATUS', // 审核状态
    submitStatus: 'KMJX.LMES.BYPRODUCT_STATUS', // 入库状态
    reason: 'KMJX.LMES.BYPRODUCT_REASON', // 原因
  },
  lmesTaskReport: {
    taskItem: 'LMES.TASK_ITEM',
    qcType: 'LMES.TAG_TYPE',
    inspectType: 'LMES.INSPECT_TYPE',
  },
};

export default {
  // 快码配置
  code,
};
