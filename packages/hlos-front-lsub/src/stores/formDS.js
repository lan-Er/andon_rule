/**
 * 产品文档新增表单DS
 * @since: 2020-07-03 15:58:38
 * @author: wei.zhou05@hand-china.com
 */

import codeConfig from '@/common/codeConfig';

const { lsubProductDocManage } = codeConfig.code;

export default () => ({
  fields: [
    {
      name: 'id',
      label: '文档ID',
      required: false,
    },
    {
      name: 'objectVersionNumber',
      label: '版本号',
      required: false,
    },
    {
      name: 'docName',
      label: '文档名称',
      labelWidth: 150,
      required: true,
    },
    {
      name: 'docCode',
      label: '产品文档类型',
      labelWidth: 150,
      lookupCode: lsubProductDocManage.docCode,
      required: true,
    },
    {
      name: 'docDownloadUrl',
      label: '下载地址',
      labelWidth: 150,
      required: true,
    },
    {
      name: 'fileSize',
      label: '文件大小',
      labelWidth: 150,
      required: true,
    },
    {
      name: 'emailMessageTemplateCode',
      label: '邮件消息模板编码',
      labelWidth: 150,
      required: true,
    },
  ],
});
