/**
 * @Description: config - 前端全局变量配置
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-27 17:04:33
 */

const code = {
  common: {
    category: 'ZMDA.CATEGORY', // 类别
    categorySet: 'ZMDA.CATEGORY_SET', // 类别集
    item: 'ZMDA.ITEM', // 物料
    causalType: 'PLAN.CAUSAL_TYPE', // 因子类别
    salesEntity: 'PLAN.SALES_ENTITY', // 销售实体
    divisor: 'PLAN.DIVISOR', // 因子
    calendar: 'PLAN.CALENDAR', // 日历
    festival: 'PLAN.FESTIVAL', // 节日
    activity: 'PLAN.ACTIVITY', // 活动
    userOrg: 'HIAM.USER.ORG', // 租户级获取用户列表
  },
  saleTemplate: {
    saleTemplateStatus: 'PLAN.SALE_TEMPLATE_STATUS', // 模板状态
    lifecycleUom: 'PLAN.LIFECYCLE_UOM', // 预测周期维度（天/月/周/年）
  },
  saleResult: {
    saleResultStatus: 'PLAN.SALE_RESULT_STATUS', // 模板结果状态
    lifecycleUom: 'PLAN.LIFECYCLE_UOM', // 预测周期维度（天/月/周/年）
  },
  saleRecord: {
    saleRecordStatus: 'PLAN.SALE_RECORD_STATUS', // 模板状态
  },
  planSaleSummary: {
    saleSummaryStatus: 'PLAN.SALE_SUMMARY_STATUS', // 预测汇总状态
    saleSummaryRule: 'PLAN.SALE_SUMMARY_RULE',
    userOrg: 'HIAM.USER.ORG', // 租户级获取用户列表
    cleaningStatus: 'PLAN.CLEANING_STATUS', // 清洗状态
    saleTemplateStatus: 'PLAN.SALE_TEMPLATE_STATUS', // 模板状态
    saleTemplateType: 'PLAN.SALE_TEMPLATE_TYPE', // 模板类型
    saleVersionStatus: 'PLAN.SALE_VERSION_STATUS', // 版本状态
  },
  predictionVersion: {
    saleVersionStatus: 'PLAN.SALE_VERSION_STATUS', // 版本状态
    saleTemplateType: 'PLAN.SALE_TEMPLATE_TYPE', // 预测类型
    planTemplate: 'PLAN.TEMPLATE', // 预测任务
  },
  saleTask: {
    predictionType: 'PLAN.SALE_TEMPLATE_TYPE', // 预测类型
    predictionStatus: 'PLAN.SALE_TEMPLATE_STATUS', // 预测状态
  },
};

const uploadAcceptTypeIndex = {
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.csv': '.csv',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.bmp': 'image/bmp',
};

export default {
  // 快码配置
  code,
  // 允许上传文件格式配置
  uploadAcceptTypeIndex,
};
