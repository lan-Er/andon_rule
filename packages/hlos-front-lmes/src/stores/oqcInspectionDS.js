/*
 * @Description: OQC检验DS
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-23 11:00:22
 */

import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
const { common } = codeConfig.code;
const url = `${HLOS_LMES}/v1/${organizationId}/inspection-docs/get-inspection-doc-by-group`;

export const oqcQueryDS = () => ({
  autoCreate: true,
  pageSize: 20,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      lovCode: common.organization,
      label: '组织',
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'documentObj',
      type: 'object',
      noCache: true,
      lovCode: common.document,
      label: '来源单据号',
      dynamicProps: {
        lovPara: () => ({
          documentClass: 'WM_SHIP_ORDER',
        }),
      },
      ignore: 'always',
    },
    {
      name: 'sourceDocId',
      type: 'string',
      bind: 'documentObj.documentId',
    },
    {
      name: 'documentTypeName',
      type: 'string',
      bind: 'documentObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'partyObj',
      type: 'object',
      lovCode: common.party,
      label: '客户',
      ignore: 'always',
    },
    {
      name: 'partyId',
      type: 'string',
      bind: 'partyObj.partyId',
    },
    {
      name: 'partyName',
      type: 'string',
      bind: 'partyObj.partyName',
      ignore: 'always',
    },
    {
      name: 'partyNumber',
      type: 'string',
      bind: 'partyObj.partyNumber',
      ignore: 'always',
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: '报检人',
      ignore: 'always',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'workerObj.workerCode',
      ignore: 'always',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'workerObj.workerName',
      ignore: 'always',
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url,
        method: 'get',
        params,
      };
    },
  },
});

export const pageDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'judgeObj',
      type: 'object',
      lovCode: common.worker,
      label: '判定人',
      ignore: 'always',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'judgeObj.workerId',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'judgeObj.workerCode',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'judgeObj.workerName',
    },
    {
      name: 'allChecked',
      type: 'Boolean',
    },
  ],
});