/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-03-04 10:06:58
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-09 10:03:08
 */
/**
 * @Description: config - 前端全局变量配置
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-27 17:05:45
 */

const statusValue = {
  zcom: {
    importTemplateCode: {
      requirementReleaseImport: 'ZCOM.PO',
      configurationCenterImport: 'ZCOM.PO',
      itemRefundImport: 'ZCOM.ITEM_REFUND',
      itemRefundLotTagImport: 'ZCOM.ITEM_REFUND_LOT_TAG',
      maintenanceMonitorImport: 'ZCOM.REPAIRS_ORDER',
      quotationMaintainImport: 'ZCOM.REPAIRS_ORDER',
    },
  },
};

export default {
  // 快码状态值配置
  statusValue,
};
