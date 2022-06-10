/*
 * @module: 值集视图编码
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-03-22 17:20:44
 * @LastEditTime: 2021-06-24 13:09:04
 * @copyright: Copyright (c) 2020,Hand
 */
export default {
  organization: 'LMDS.ORGANIZATION', // 发运组织
  so: 'LSOP.SO', // 销售单号
  customer: 'LMDS.CUSTOMER', // 客户
  lineStatus: 'LSOP.SO_LINE_STATUS', // 行状态
  item: 'LMDS.ITEM', // 物料
  documentType: 'LMDS.DOCUMENT_TYPE', // 订单类型
  soLineFlag: 'XSH.LWMS.INSPECT_RULE', // 是否免疫
  wareHouse: 'LMDS.WAREHOUSE', // 发出仓库
  supplier: 'LMDS.SUPPLIER', // 供应商
  pullDeliveryStatus: 'GRWL.LWMS.PULL_SHIP_PLAN_STATUS', // 拉动状态
  flagInt: 'LMDS.FLAG_INT', // 是否
};
export const myModule = {
  lwmss: '/lwmss',
  lmdss: '/lmdss',
  lsops: '/lsops',
  lmess: '/lmess',
};
