/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-04-07 17:48:41
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-04-09 17:22:20
 */
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import moment from 'moment';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LWMSS}/v1/${organizationId}/inv-abnormal-documents`;

const detailDS = () => ({
  // autoCreate: true,
  primaryKey: 'programId',
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: '组织',
      lovCode: 'LMDS.ORGANIZATION',
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
    },
    {
      name: 'exceptiomHandler',
      type: 'string',
      label: '异常处理员',
    },
    {
      name: 'findTime',
      label: '发现时间',
      format: 'YYYY-MM-DD HH:mm:ss',
      type: 'dateTime',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      name: 'invAbnormalNum',
      type: 'string',
      label: '单据号',
    },
    {
      name: 'foundDepartmentObj',
      type: 'object',
      label: '部门',
      lovCode: 'LMDS.DEPARTMENT',
      ignore: 'always',
    },
    {
      name: 'departmentId',
      type: 'string',
      bind: 'foundDepartmentObj.departmentId',
    },
    {
      name: 'foundDepartment',
      type: 'string',
      bind: 'foundDepartmentObj.departmentCode',
    },
    {
      name: 'departmentName',
      type: 'string',
      bind: 'foundDepartmentObj.departmentName',
    },
    {
      name: 'processGroupLeader',
      type: 'string',
      label: '工序组长',
    },
    {
      name: 'problemProcessSupervisor',
      type: 'string',
      label: '问题工序主管',
    },
    {
      name: 'problemLevel',
      type: 'string',
      lookupCode: 'PROBLEM_LEVEL',
      label: '问题等级',
    },
    {
      name: 'discoverProcess',
      type: 'string',
      label: '发现工序',
    },
    {
      name: 'findStaff',
      type: 'string',
      label: '发现员工',
    },
    {
      name: 'confirmTime',
      label: '确认时间',
      format: 'YYYY-MM-DD HH:mm:ss',
      type: 'dateTime',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      name: 'soObj',
      type: 'object',
      label: '子订单号',
      lovCode: 'LMDS.SO',
      ignore: 'always',
    },
    {
      name: 'soNum',
      type: 'string',
      bind: 'soObj.soHeaderNumber',
    },
    {
      name: 'soId',
      type: 'string',
      bind: 'soObj.soHeaderId',
    },
    {
      name: 'withoutDutyReasons',
      type: 'string',
      label: '无责理由',
    },
    {
      name: 'processCardType',
      type: 'string',
      lookupCode: 'PROCESS_CARD_TYPE',
      label: '流程卡类型',
    },
    {
      name: 'completionTime',
      label: '完成时间',
      format: 'YYYY-MM-DD HH:mm:ss',
      type: 'dateTime',
      transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      name: 'theLength',
      type: 'string',
      label: '用时',
    },
    {
      name: 'showHow',
      type: 'string',
      label: '情况说明',
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${url}/invAbnormal-detail`,
        method: 'GET',
      };
    },

    create: ({ data }) => {
      return {
        url,
        method: 'POST',
        data: {
          tenantId: organizationId,
          ...data[0],
        },
      };
    },

    update: ({ data }) => {
      return {
        url,
        method: 'PUT',
        data: {
          tenantId: organizationId,
          ...data[0],
        },
      };
    },
  },
});

export { detailDS };
