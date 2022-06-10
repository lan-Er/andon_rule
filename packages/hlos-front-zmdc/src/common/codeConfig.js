/**
 * @Description: config - 前端全局变量配置
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-27 17:04:33
 */

const code = {
  common: {
    siteUser: 'HIAM.SITE.USER', // 查询用户(平台级调用)
    assignableRole: 'ZMDC.ROLE', // 查询平台角色
    versionum: 'ZMDC.VERSION_LIST', // 版本号
  },
  platformProduct: {
    productStatus: 'ZCNF.PRODUCT_STATUS', // 产品状态
    productVerSionStatus: 'ZCNF.PRODUCT_VERSION_STATUS', // 产品状态
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
