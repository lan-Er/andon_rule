/*
 * @Description: 检验判定--DS
 * @Author: zmt
 * @LastEditTime: 2020-10-22 16:34:46
 */

import { HLOS_LMES } from 'hlos-front/lib/utils/config';
// import codeConfig from '@/common/codeConfig';
import { getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const organizationId = getCurrentOrganizationId();
// const { common, lmesInspectionJudge } = codeConfig.code;
const queryInspectionUrl = `${HLOS_LMES}/v1/${organizationId}/inspection-docs/hg-judge-area`;

export const inspectionQueryDS = () => ({
  autoCreate: true,
  pageSize: 20,
  queryFields: [
    {
      name: 'inspectionObj',
      type: 'object',
      noCache: true,
      lovCode: 'LMES.INSPECTION_DOC_NUMBER',
      label: '检验单号',
      ignore: 'always',
    },
    {
      name: 'inspectionDocId',
      type: 'string',
      bind: 'inspectionObj.inspectionDocId',
    },
    {
      name: 'inspectionDocNum',
      type: 'string',
      bind: 'inspectionObj.inspectionDocNum',
      ignore: 'always',
    },
    {
      name: 'documentObj',
      type: 'object',
      noCache: true,
      lovCode: 'LMDS.DOCUMENT',
      label: '来源单据号',
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
      name: 'itemObj',
      type: 'object',
      noCache: true,
      lovCode: 'LMDS.ITEM',
      label: '物料',
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
      ignore: 'always',
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: 'LMDS.WORKER',
      label: '报检人',
      lovPara: {
        workerType: 'DECLARER',
      },
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
    {
      name: 'createDateMin',
      type: 'dateTime',
      max: 'createDateMax',
      format: 'YY-MM-DD',
      label: '报检时间>=',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'createDateMax',
      type: 'dateTime',
      min: 'createDateMin',
      format: 'YY-MM-DD',
      label: '报检时间<=',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ],
  transport: {
    read: ({ params }) => {
      // let url = queryInspectionUrl;
      // if (data.pqcType === '首检') {
      //   url = generateUrlWithGetParam(queryInspectionUrl, {
      //     inspectionTemplateTypeList: ['PQC.FIRST'],
      //   });
      // } else if (data.pqcType === '完工检') {
      //   url = generateUrlWithGetParam(queryInspectionUrl, {
      //     inspectionTemplateTypeList: ['PQC.LAST'],
      //   });
      // }
      return {
        url: queryInspectionUrl,
        method: 'get',
        params: { ...params, size: 100 },
      };
    },
  },
});
