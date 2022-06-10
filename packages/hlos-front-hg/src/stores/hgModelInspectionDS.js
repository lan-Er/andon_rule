/*
 * @Description: 恒光试模检--DS
 * @Author: zmt
 * @LastEditTime: 2020-10-22 16:47:51
 */

import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const organizationId = getCurrentOrganizationId();
const queryInspectionUrl = `${HLOS_LMES}/v1/${organizationId}/inspection-docs/smj-inspection-doc`;

export const inspectionQueryDS = () => ({
  autoCreate: true,
  pageSize: 100,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      noCache: true,
      lovCode: 'LMDS.ME_OU',
      label: '组织',
      ignore: 'always',
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
      // if (data.qcStatus === 'NEW') {
      //   url = generateUrlWithGetParam(queryInspectionUrl, {
      //     qcStatusList: ['NEW', 'ONGOING'],
      //   });
      // } else if (data.qcStatus === 'ONGOING') {
      //   url = generateUrlWithGetParam(queryInspectionUrl, {
      //     qcStatusList: ['COMPLETED'],
      //   });
      // }
      return {
        url: generateUrlWithGetParam(queryInspectionUrl, {
          qcStatusList: ['NEW', 'ONGOING'],
        }),
        method: 'get',
        params: { ...params, qcStatus: null },
      };
    },
  },
});
