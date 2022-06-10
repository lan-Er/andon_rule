/**
 * @Description: PSI要素初始化管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 13:54:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { descValidator } from 'hlos-front/lib/utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.psiElementAssign.model';
const commonCode = 'lmds.common.model';

export default () => ({
  autoQuery: true,
  paging: false,
  queryFields: [
    {
      name: 'displayArea',
      type: 'string',
      label: intl.get(`${preCode}.displayArea`).d('显示区域'),
      lookupCode: common.psiDisplayArea,
    },
  ],
  fields: [
    {
      name: 'elementCode',
      type: 'string',
      label: intl.get(`${preCode}.elementCode`).d('要素编码'),
    },
    {
      name: 'displayAreaMeaning',
      type: 'string',
      label: intl.get(`${preCode}.displayArea`).d('显示区域'),
    },
    {
      name: 'mainCategory',
      type: 'string',
      label: intl.get(`${preCode}.mainCategory`).d('大类'),
    },
    {
      name: 'subCategory',
      type: 'string',
      label: intl.get(`${preCode}.subCategory`).d('小类'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${preCode}.description`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'orderByCode',
      type: 'string',
      label: intl.get(`${preCode}.orderByCode`).d('显示顺序'),
    },
    {
      name: 'displayFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.displayFlag`).d('是否显示'),
      required: true,
      defaultValue: true,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/psi-elements`,
        method: 'get',
      };
    },
    submit: ({ data }) => {
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/psi-element-assigns/${data[0].sourceId}`,
        data,
        method: 'post',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
