/**
 * @Description: 资质新增  DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-03 14:17:34
 * @LastEditors: yiping.liu
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';

import RangeDetailDS from './RangeDetailDS';
import AssignDetailDS from './AssignDetailDS';

const { lmdsQualification } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.qualification.model';
const commonCode = 'lmds.common.model';

export default () => ({
  primaryKey: 'qualificationId',
  selection: false,
  children: {
    ranges: new DataSet({ ...RangeDetailDS() }),
    assigns: new DataSet({ ...AssignDetailDS() }),
  },
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
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
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
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        data,
        url: `${HLOS_LMDS}/v1/${organizationId}/qualification/${data.qualificationId}`,
        method: 'GET',
      };
    },
    submit: ({ data, params }) => {
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/qualification/save`,
        data: data[0],
        params,
        method: 'POST',
      };
    },
  },
});
