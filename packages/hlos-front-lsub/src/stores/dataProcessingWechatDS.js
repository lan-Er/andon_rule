/**
 * 数据处理DS
 * @since: 2020-07-01 17:51:17
 * @author: wei.zhou05@hand-china.com
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LSUB } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'lsub.dpw.model';
const commonCode = 'lsub.common.model';
const { lsubDataProcessing } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const DpwDS = {
  pageSize: 10,
  autoQuery: false,
  selection: 'multiple',
  primaryKey: 'id',
  transport: {
    read: (config) => {
      return {
        ...config,
        url: `${HLOS_LSUB}/v1/${organizationId}/userData/queryUserDemandData`,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: `${HLOS_LSUB}/v1/${organizationId}/userData/addUserDemandData`,
        data: data[0],
        method: 'POST',
      };
    },
    submit: ({ data }) => {
      return {
        url: `${HLOS_LSUB}/v1/${organizationId}/userData/addUserDemandData`,
        data: Object.assign({}, data[0], {
          status: 'PENDING',
        }),
        method: 'POST',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  queryFields: [
    // {
    //   name: 'status',
    //   type: 'string',
    //   label: intl.get(`${preCode}.status`).d('当前状态'),
    // },
    {
      name: 'sourceType',
      type: 'string',
      label: intl.get(`${preCode}.sourceType`).d('来源平台'),
      lookupCode: lsubDataProcessing.sourceType,
    },
    {
      name: 'dataType',
      type: 'string',
      label: intl.get(`${preCode}.dataType`).d('单据来源'),
      lookupCode: lsubDataProcessing.dataType,
    },
    {
      name: 'companyName',
      type: 'string',
      label: intl.get(`${preCode}.companyName`).d('公司'),
    },
  ],
  fields: [
    {
      name: 'sourceType',
      type: 'string',
      label: intl.get(`${commonCode}.sourceType`).d('来源平台'),
      lookupCode: lsubDataProcessing.sourceType,
      defaultValue: 'manual_input',
    },
    {
      name: 'dataType',
      type: 'string',
      label: intl.get(`${commonCode}.dataType`).d('单据来源'),
      lookupCode: lsubDataProcessing.dataType,
      required: true,
    },
    {
      name: 'realName',
      type: 'string',
      label: intl.get(`${commonCode}.realName`).d('姓名'),
      required: true,
    },
    {
      name: 'companyName',
      type: 'string',
      label: intl.get(`${commonCode}.companyName`).d('公司'),
      required: true,
    },
    {
      name: 'position',
      type: 'string',
      label: intl.get(`${commonCode}.position`).d('职位'),
      required: true,
    },
    {
      name: 'phone',
      type: 'string',
      label: intl.get(`${commonCode}.phone`).d('电话'),
      required: true,
      // validator: (value) => {
      //   console.log(value);
      // },
    },
    {
      name: 'email',
      type: 'string',
      label: intl.get(`${commonCode}.email`).d('公司邮箱'),
      required: true,
      // validator: (value) => {
      //   console.log(value);
      // },
    },
    {
      name: 'targetModuleList',
      type: 'string',
      label: intl.get(`${commonCode}.targetModuleList`).d('功能'),
      lookupCode: lsubDataProcessing.targetModule,
      multiple: true,
    },
    {
      name: 'industry',
      type: 'string',
      label: intl.get(`${commonCode}.industry`).d('行业'),
    },
    {
      name: 'companySize',
      type: 'string',
      label: intl.get(`${commonCode}.companySize`).d('员工数'),
      lookupCode: lsubDataProcessing.companySize,
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
  ],
};

export { DpwDS };
