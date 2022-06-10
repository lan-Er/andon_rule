/**
 * 产品文档管理DS
 * @since: 2020-06-29 15:11:32
 * @author: wei.zhou05@hand-china.com
 */

import intl from 'utils/intl';
import { HLOS_LSUB } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import codeConfig from '@/common/codeConfig';

const preCode = 'lsub.pdm.model';
const commonCode = 'lsub.common.model';
const { lsubProductDocManage } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const PdmDS = {
  transport: {
    read: (config) => {
      return {
        ...config,
        url: `${HLOS_LSUB}/v1/${organizationId}/queryProductDoc`,
        method: 'POST',
        data: Object.assign(
          {},
          {
            tenantId: organizationId,
          },
          config.data
        ),
      };
    },
  },
  pageSize: 10,
  selection: 'single',
  autoQuery: true,
  queryFields: [
    {
      name: 'docCode',
      type: 'string',
      label: intl.get(`${preCode}.docCode`).d('产品文档类型'),
      lookupCode: lsubProductDocManage.docCode,
    },
    {
      name: 'docName',
      type: 'string',
      label: intl.get(`${preCode}.docName`).d('文档名称'),
    },
  ],
  fields: [
    {
      name: 'docCodeMeaning',
      type: 'string',
      label: intl.get(`${commonCode}.docCodeMeaning`).d('产品文档类型'),
    },
    {
      name: 'docName',
      type: 'string',
      label: intl.get(`${commonCode}.docName`).d('文档名称'),
    },
    {
      name: 'fileSize',
      type: 'string',
      label: intl.get(`${commonCode}.fileSize`).d('文件大小'),
    },
    {
      name: 'emailMessageTemplateCode',
      type: 'string',
      label: intl.get(`${commonCode}.emailMessageTemplateCode`).d('邮件消息模板编码'),
    },
    {
      name: 'docDownloadUrl',
      type: 'string',
      label: intl.get(`${commonCode}.docDownloadUrl`).d('下载地址'),
    },
  ],
};

export { PdmDS };
