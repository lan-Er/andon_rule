/**
 * @Description: 前端全局变量配置
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-02 16:25:49
 */

const code = {
  ldttTaskGroup: {
    tenant: 'HPFM.TENANT',
  },
  ldttTransferTenant: {
    tenant: 'HPFM.TENANT',
  },
  ldttTransferService: {
    tenant: 'HPFM.TENANT',
    serviceCode: 'LDTF.CANAL_INSTANCE',
    filterMode: 'LDTF.FILTER_MODE',
    datasource: 'LETL.DATASOURCE_VIEW',
  },
  ldttTaskItem: {
    sourceDatasource: 'LETL.DATASOURCE_VIEW',
    targetDatasource: 'LETL.DATASOURCE_VIEW',
    tenant: 'HPFM.TENANT',
  },
  serviceArchive: {
    sourceDatasource: 'LETL.DATASOURCE_VIEW',
    targetDatasource: 'LETL.DATASOURCE_VIEW',
    tenant: 'HPFM.TENANT_DISABLE',
  },
  ldttEsSyncItem: {
    sourceDatasource: 'LETL.DATASOURCE_VIEW',
    tenant: 'HPFM.TENANT',
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
