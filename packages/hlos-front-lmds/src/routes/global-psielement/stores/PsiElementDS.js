/**
 * @Description: PSI要素管理信息--DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-06 11:36:22
 * @LastEditors: yiping.liu
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const preCode = 'lmds.psiElement';
const { lmdsPSI, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/psi-elements`;

export default () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'displayArea',
      type: 'string',
      label: intl.get(`${preCode}.model.displayArea`).d('显示区域'),
      lookupCode: common.psiDisplayArea,
    },
    {
      name: 'elementCode',
      type: 'string',
      label: intl.get(`${preCode}.model.elementCode`).d('要素编码'),
    },
  ],
  fields: [
    {
      name: 'displayArea',
      type: 'string',
      label: intl.get(`${preCode}.model.displayArea`).d('显示区域'),
      lookupCode: common.psiDisplayArea,
      required: true,
    },
    {
      name: 'elementType',
      type: 'string',
      label: intl.get(`${preCode}.model.elementType`).d('要素类型'),
      lookupCode: lmdsPSI.elementType,
      required: true,
    },
    {
      name: 'elementGroup',
      type: 'string',
      label: intl.get(`${preCode}.model.elementGroup`).d('要素分组'),
      lookupCode: lmdsPSI.elementGroup,
      required: true,
    },
    {
      name: 'elementCode',
      type: 'string',
      label: intl.get(`${preCode}.model.elementCode`).d('要素编码'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'mainCategory',
      type: 'string',
      label: intl.get(`${preCode}.model.main`).d('大类'),
      required: true,
    },
    {
      name: 'subCategory',
      type: 'string',
      label: intl.get(`${preCode}.model.sub`).d('小类'),
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.model.description`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'orderByCode',
      type: 'string',
      label: intl.get(`${preCode}.model.orderBy`).d('显示顺序'),
      required: true,
    },
    {
      name: 'initialFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.model.initialFlag`).d('是否有期初值'),
    },
    {
      name: 'initialStartTime',
      type: 'string',
      label: intl.get(`${preCode}.model.initialStartTime`).d('期初开始时间'),
      lookupCode: common.psiElementStartTime,
    },
    {
      name: 'editFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.model.editFlag`).d('是否可编辑'),
    },
    {
      name: 'editStartTime',
      type: 'string',
      label: intl.get(`${preCode}.model.editStartTime`).d('编辑开始时间'),
      lookupCode: common.psiElementStartTime,
    },
    {
      name: 'deductionFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.model.deductionFlag`).d('是否推演'),
    },
    {
      name: 'deductionRule',
      type: 'string',
      label: intl.get(`${preCode}.model.deductionRule`).d('推演规则'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get('lmds.common.model.enabledFlag').d('是否有效'),
      defaultValue: true,
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
    create: ({ data }) => ({
      url,
      data: data[0],
      method: 'POST',
    }),
    update: ({ data }) => ({
      url,
      data: data[0],
      method: 'PUT',
    }),
  },
});
