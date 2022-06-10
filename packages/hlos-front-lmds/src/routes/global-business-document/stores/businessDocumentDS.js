/**
 * @Description: 业务单据--DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-11 13:17:31
 * @LastEditors: yiping.liu
 */
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import codeConfig from '@/common/codeConfig';

const { common, lmdsBusinessDocument } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.businessDocument.model';
const commonCode = 'lmds.common.model';

const headDS = () => {
  return {
    selection: false,
    paging: false,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'documentNumObj',
        type: 'object',
        label: intl.get(`${preCode}.documentNum`).d('单据号'),
        lovCode: lmdsBusinessDocument.documentNum,
        ignore: 'always',
        textField: 'documentTypeName',
      },
      {
        name: 'documentId',
        type: 'string',
        bind: 'documentNumObj.documentId',
      },
      {
        name: 'documentNum',
        type: 'string',
        bind: 'documentNumObj.documentNum',
        ignore: 'always',
      },
      {
        name: 'documentTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.documentType`).d('单据类型'),
        lovCode: lmdsBusinessDocument.documentType,
        ignore: 'always',
      },
      {
        name: 'documentTypeId',
        type: 'string',
        bind: 'documentTypeObj.documentTypeId',
      },
      {
        name: 'documentTypeCode',
        type: 'string',
        bind: 'documentTypeObj.documentTypeCode',
        ignore: 'always',
      },
      {
        name: 'sourceDocTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
        lovCode: lmdsBusinessDocument.documentType,
        ignore: 'always',
      },
      {
        name: 'sourceDocTypeId',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeId',
      },
      {
        name: 'sourceDocTypeCode',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeCode',
        ignore: 'always',
      },
      {
        name: 'sourceDocNumObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        lovCode: lmdsBusinessDocument.documentNum,
        ignore: 'always',
        textField: 'documentTypeName',
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'sourceDocNumObj.documentId',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'sourceDocNumObj.documentNum',
        ignore: 'always',
      },
      {
        name: 'documentStatus',
        type: 'string',
        label: intl.get(`${preCode}.documentStatus`).d('单据状态'),
        lookupCode: lmdsBusinessDocument.documentStatus,
      },
    ],
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
        lovCode: common.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'organization',
        type: 'string',
        label: intl.get(`${commonCode}.org`).d('组织'),
      },
      {
        name: 'documentNumObj',
        type: 'object',
        label: intl.get(`${preCode}.documentNum`).d('单据号'),
        lovCode: lmdsBusinessDocument.documentNum,
        ignore: 'always',
      },
      {
        name: 'documentId',
        type: 'string',
        bind: 'documentNumObj.documentId',
      },
      {
        name: 'documentNum',
        type: 'string',
        bind: 'documentNumObj.documentNumber',
        ignore: 'always',
      },
      {
        name: 'documentTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.documentType`).d('单据类型'),
        lovCode: lmdsBusinessDocument.documentType,
        ignore: 'always',
      },
      {
        name: 'documentTypeId',
        type: 'string',
        bind: 'documentTypeObj.documentTypeId',
      },
      {
        name: 'documentType',
        type: 'string',
        bind: 'documentTypeObj.documentTypeCode',
        ignore: 'always',
      },
      {
        name: 'sourceDocTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
        lovCode: lmdsBusinessDocument.documentType,
        ignore: 'always',
      },
      {
        name: 'sourceDocTypeId',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeId',
      },
      {
        name: 'sourceDocType',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeCode',
        ignore: 'always',
      },
      {
        name: 'sourceDocNumObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        lovCode: lmdsBusinessDocument.documentNum,
        ignore: 'always',
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'sourceDocNumObj.documentId',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'sourceDocNumObj.documentNum',
        ignore: 'always',
      },
      {
        name: 'documentStatusMeaning',
        type: 'string',
        label: intl.get(`${preCode}.documentStatus`).d('单据状态'),
        lookupCode: lmdsBusinessDocument.documentStatus,
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMDS}/v1/${organizationId}/documents`,
          method: 'GET',
        };
      },
    },
  };
};

const lineDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: [
      {
        name: 'documentLineNum',
        type: 'string',
        label: intl.get(`${preCode}.no`).d('行号'),
      },
      {
        name: 'documentLineStatusMeaning',
        type: 'string',
        label: intl.get(`${preCode}.lineStatus`).d('行状态'),
      },
      {
        name: 'organization',
        type: 'string',
        label: intl.get(`${commonCode}.org`).d('组织'),
      },
      {
        name: 'sourceDocType',
        type: 'string',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_LMDS}/v1/${organizationId}/document-lines/${data.documentId}`,
          method: 'GET',
        };
      },
    },
  };
};

export { headDS, lineDS };
