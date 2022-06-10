/*
 * config - 前端全局变量配置
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-11-6 11:09:21
 * @LastEditors: TJ
 */
const statusValue = {
  lmds: {
    common: {
      new: 'NEW', // 新建
      edit: 'EDIT', // 编辑
      approved: 'APPROVED', // 已通过
      invalid: 'INVALID', //  作废
    },
    lovPara: {
      warehouse: 'WAREHOUSE', // 仓库
      wmArea: 'WM_AREA', // 货位
      workGroup: 'WORKER_GROUP', // 班组
      worker: 'WORKER', // 操作工
      workcell: 'WORKCELL', // 工作单元
      equipment: 'EQUIPMENT', // 设备
      prodLine: 'PROD_LINE', // 生产线
      resourceGroup: 'RESOURCE_GROUP', // 资源组
      item: 'ITEM', // 物料
      itemMe: 'ITEM_ME', // 物料制造
      itemScm: 'ITEM_SCM', // 物料采购
      itemAps: 'ITEM_APS', // 物料计划
      itemWm: 'ITEM_WM', // 物料仓储
      itemSop: 'ITEM_SOP', // 物料销售
      inspectionGroup: 'INSPECTION_GROUP', // 检验组
      supplier: 'SUPPLIER', // 供应商
      cutter: 'CUTTER', // 刀具
      tool: 'TOOL', // 工装
      gauge: 'GAUGE', // 量具
      operation: 'OPERATION', // 工序
      resource: 'RESOURCE', // 资源
      spareParts: 'SPARE_PARTS', // 备品备件
      apsResource: 'APS_RESOURCE', // 计划资源
      container: 'CONTAINER', // 容器
      die: 'DIE', // 模具
      containerType: 'CONTAINER_TYPE', // 容器类型
      feeder: 'FEEDER', // 飞达
      trolley: 'TROLLEY', // 飞达料车
    },
    privilege: {
      // 权限来源类型快码
      organization: 'ORGANIZATION',
      resource: 'RESOURCE',
      party: 'PARTY',
    },
    qualificationRange: {
      operation: 'OPERATION',
      item: 'ITEM',
      resource: 'RESOURCE',
    },
    qualificationAssign: {
      worker: 'WORKER',
      workerGroup: 'WORKERGROUP',
    },
    andon: {
      closed: 'CLOSED',
    },
    importTemplateCode: {
      itemRouting: 'LMDS.ITEM_ROUTING',
      item: 'LMDS.ITEM',
      routing: 'LMDS.ROUTING',
      wmUnit: 'LMDS.WM.UNIT',
      warehouse: 'LMDS.WAREHOUSE',
      wmArea: 'LMDS.WM.AREA',
      inspectionGroup: 'LMDS_INSPECTION_GROUP',
      customer: 'LMDS.CUSTOMER',
      bom: 'LMDS_BOM',
      catogory: 'LMDS.CATEGORY',
      location: 'LMDS.LOCATION',
      worker: 'LMDS_WORKER',
      workerGroup: 'LMDS_WORKER_GROUP',
      equipment: 'LMDS_EQUIPMENT',
      andon: 'LMDS.ANDON',
      workcell: 'LMDS.WORKCELL',
      itemBom: 'LMDS_ITEM_BOM',
      itemContainer: 'LMDS.CONTAINER.CAPACITY',
      inspectionItem: 'LMDS_INSPECTION_ITEM',
      resourceRelation: 'LMDS.RESOURCE_RELATION',
      inspectionTemplateList: 'LMDS.INSPECTION_TEMPLATE',
      customerItem: 'LMDS.CUSTOMER_ITEM',
      collector: 'LMDS.COLLECTOR',
      exception: 'LMDS.EXCEPTION',
      exceptionGroup: 'LMDS.EXCEPTION_GROUP',
      exceptionAssign: 'LMDS.EXCEPTION_ASSIGN',
      operation: 'LMDS.OPERATION',
      supplier: 'LMDS.SUPPLIER',
    },
  },
};

export default {
  // 快码状态值配置
  statusValue,
};
