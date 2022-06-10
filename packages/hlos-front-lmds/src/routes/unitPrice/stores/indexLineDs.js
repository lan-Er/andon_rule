/*
 * @module-: 工时单价主界面行DS
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-28 13:51:41
 * @LastEditTime: 2021-01-18 11:29:06
 * @copyright: Copyright (c) 2018,Hand
 */
import intl from 'utils/intl';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.unitPrice';
const url = `${HLOS_LMDS}/v1/${organizationId}/work-price-versions`;
export default () => ({
  autoQuery: false,
  selection: false,
  pageSize: 100,
  fields: [
    {
      name: 'lineNum',
      type: 'string',
      label: intl.get(`${preCode}.lineNum`).d('行号'),
    },
    {
      name: 'workPriceVersion',
      type: 'string',
      label: intl.get(`${preCode}.workPriceVersion`).d('版本'),
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.description`).d('版本描述'),
    },
    {
      name: 'versionStatus',
      type: 'string',
      label: intl.get(`${preCode}.versionStatus`).d('版本状态'),
      lookupCode: common.workPriceVersionStatus,
      required: true,
    },
    {
      name: 'unitPrice',
      type: 'number',
      label: intl.get(`${preCode}.unitPrice`).d('单价'),
      required: true,
      min: 0.0001,
      step: 0.0001,
    },
    {
      name: 'currencyObj',
      type: 'object',
      label: intl.get(`${preCode}.currency`).d('币种'),
      lovCode: common.currency,
      textField: 'currencyName',
      ignore: 'always',
    },
    {
      name: 'currency',
      type: 'string',
      bind: 'currencyObj.currencyCode',
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'currencyObj.currencyId',
    },
    {
      name: 'currencyName',
      type: 'string',
      bind: 'currencyObj.currencyName',
    },
    {
      name: 'currentVersionFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.currentVersionFlag`).d('最新版本'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('生效日期'),
      defaultValue: moment().format('YYYY-MM-DD'),
      min: moment().format('YYYY-MM-DD'),
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('失效日期'),
      min: 'startDate',
    },
    {
      name: 'auditor',
      type: 'string',
      label: intl.get(`${preCode}.auditor`).d('审核人'),
    },
    {
      name: 'issuedDate',
      type: 'date',
      label: intl.get(`${preCode}.issuedDate`).d('签发日期'),
    },
    {
      name: 'auditWorkflow',
      type: 'object',
      lovCode: common.processDefintion,
      label: intl.get(`${preCode}.auditWorkflow`).d('审核流程'),
      lovPara: {
        PROCESS_CATEGORY: 'WORK_PRICE',
      },
    },
    {
      name: 'name',
      type: 'string',
      bind: 'auditWorkflow.name',
    },
    {
      name: 'auditWorkflowId',
      type: 'string',
      bind: 'auditWorkflow.id',
    },
    {
      name: 'key',
      type: 'string',
      bind: 'auditWorkflow.key',
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
  },
  // events: {
  //   load: ({dataSet})=>{
  //     if(dataSet.current){
  //       const oldData=dataSet.current.data;
  //       oldData.forEach((item, index)=>{
  //         return Object.assign(item, {lineNum:index});
  //       });
  //       console.log(oldData);
  //     }
  //   },
  // },
});
