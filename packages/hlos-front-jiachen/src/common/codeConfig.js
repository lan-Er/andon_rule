const code = {
  common: {
    worker: 'LMDS.WORKER', // 员工
    meArea: 'LMDS.ME_AREA', // 车间
    item: 'LMDS.ITEM', // 物料
    area: 'LMDS.ME_AREA', // 事业部
    warehouse: 'LMDS.WAREHOUSE', // 入库仓库
    wmarea: 'LMDS.WM_AREA', // 入库货位
    prodLine: 'LMDS.PRODLINE', // 生产线
    workcell: 'LMDS.WORKCELL', // 工位
    equipment: 'LMDS.EQUIPMENT', // 设备
    workerGroup: 'LMDS.WORKER_GROUP', // 班组
    moOperation: 'LMES.MO_OPERATION', // MO工序
    wmArea: 'LMDS.WM_AREA', // 货位
    mo: 'LMES.MO',
    moComponent: 'LMES.MO_COMPONENT',
  },
  outInInventoryPlatform: {
    documentType: 'JCDQ_LWMS.DOCUMENT_TYPE', // 单据类型
  },
  productionPlans: {
    moExecuteStatus: 'JCDQ_LMES.MO_EXECUTE_STATUS', // mo状态
    kittingStatus: 'JCDQ_LMES.KITTING_STATUS', // 齐套状态
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
