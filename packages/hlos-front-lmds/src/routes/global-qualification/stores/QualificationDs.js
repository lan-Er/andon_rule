/**
 * @Description: 资质管理信息--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-03 10:50:04
 * @LastEditors: yiping.liu
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsQualification, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.qualification.model';
const commonCode = 'lmds.common.model';

const url = `${HLOS_LMDS}/v1/${organizationId}/qualification/page`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'qualificationCode',
      type: 'string',
      label: intl.get(`${preCode}.qualificationCode`).d('资质'),
    },
    {
      name: 'qualificationName',
      type: 'string',
      label: intl.get(`${preCode}.qualificationName`).d('资质名称'),
    },
    {
      name: 'qualificationType',
      type: 'string',
      label: intl.get(`${preCode}.qualificationType`).d('资质类型'),
      lookupCode: lmdsQualification.qualificationType,
    },
    {
      name: 'resource',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('资源'),
      lovCode: common.resource,
      ignore: 'always',
    },
    {
      name: 'assignSourceId',
      type: 'string',
      bind: 'resource.resourceId',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      defaultValue: true,
      label: intl.get(`${preCode}.enabledFlag`).d('是否有效'),
    },
  ],
  fields: [
    {
      name: 'qualificationType',
      type: 'string',
      label: intl.get(`${preCode}.qualificationType`).d('资质类型'),
      lookupCode: lmdsQualification.qualificationType,
      required: true,
    },
    {
      name: 'qualificationCode',
      type: 'string',
      label: intl.get(`${preCode}.qualificationCode`).d('资质'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'qualificationName',
      type: 'intl',
      label: intl.get(`${preCode}.qualificationName`).d('资质名称'),
      required: true,
    },
    {
      name: 'qualificationAlias',
      type: 'intl',
      label: intl.get(`${preCode}.qualificationAlias`).d('资质简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.description`).d('资质描述'),
      validator: descValidator,
    },
    {
      name: 'qualificationCategory',
      type: 'string',
      label: intl.get(`${preCode}.qualificationCategory`).d('分类'),
    },
    {
      name: 'qualificationLevel',
      type: 'string',
      label: intl.get(`${preCode}.qualificationLevel`).d('资质等级'),
      lookupCode: lmdsQualification.qualificationLevel,
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabled`).d('是否有效'),
      required: true,
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
  },
});
