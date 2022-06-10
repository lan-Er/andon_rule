/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-04-07 15:45:38
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-04-12 16:35:41
 */
import { getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import moment from 'moment';

const organizationId = getCurrentOrganizationId();
const queryUrl = `${HLOS_LWMSS}/v1/${organizationId}/inv-abnormal-documents`;
const ListDS = () => ({
  transport: {
    read: ({ data }) => {
      return {
        url: `${queryUrl}/getInvAbnormalList`,
        data,
        method: 'GET',
      };
    },
    destroy: ({ data }) => {
      return {
        url: `${queryUrl}/batch-remove`,
        data,
        method: 'DELETE',
      };
    },
  },
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: '组织',
      lovCode: 'LMDS.ORGANIZATION',
      required: true,
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
      name: 'invAbnormalNum',
      type: 'string',
      label: '单据号',
    },
    {
      name: 'processCardType',
      type: 'string',
      label: '流程卡类型',
      lookupCode: 'PROCESS_CARD_TYPE',
      // ignore: 'always',
    },
    // {
    //   name: 'processCardTypeId',
    //   type: 'string',
    //   bind: 'processCardTypeObj.processCardTypeId',
    // },
    // {
    //   name: 'processCardTypeCode',
    //   type: 'string',
    //   bind: 'processCardTypeObj.processCardTypeCode',
    // },
    {
      name: 'problemLevel',
      type: 'string',
      label: '问题等级',
      lookupCode: 'PROBLEM_LEVEL',
    },
    {
      name: 'findTimeStart',
      label: '发现时间从',
      format: 'YYYY-MM-DD',
      type: 'date',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'findTimeEnd',
      label: '发现时间至',
      format: 'YYYY-MM-DD',
      type: 'date',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },

    {
      name: 'confirmTimeStart',
      label: '确认时间从',
      format: 'YYYY-MM-DD',
      type: 'date',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'confirmTimeEnd',
      label: '确认时间至',
      format: 'YYYY-MM-DD',
      type: 'date',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
  ],

  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: '组织',
    },
    {
      name: 'invAbnormalNum',
      type: 'string',
      label: '单据号',
    },
    {
      name: 'processCardTypeMeaning',
      type: 'string',
      label: '流程卡类型',
    },
    {
      name: 'exceptiomHandler',
      type: 'string',
      label: '异常处理员',
    },
    {
      name: 'findTime',
      type: 'string',
      label: '发现时间',
    },
    {
      name: 'foundDepartmentName',
      type: 'string',
      label: '发现部门',
    },
    {
      name: 'problemLevelMeaning',
      type: 'string',
      label: '问题等级',
    },
    {
      name: 'discoverProcess',
      type: 'string',
      label: '发现工序',
    },
  ],
});
export { ListDS };
