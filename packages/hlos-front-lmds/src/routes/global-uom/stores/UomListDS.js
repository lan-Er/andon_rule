/**
 * @Description: 单位管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-11 13:47:36
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { lmdsUom } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.uom.model';
const commonCode = 'lmds.common.model';

const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/uoms`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'uomCode',
      type: 'string',
      label: intl.get(`${preCode}.uom`).d('单位'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${preCode}.uomName`).d('单位名称'),
    },
  ],
  fields: [
    {
      name: 'uomClass',
      type: 'string',
      label: intl.get(`${preCode}.uomClass`).d('单位类别'),
      lookupCode: lmdsUom.uomType,
      required: true,
    },
    {
      name: 'uomCode',
      type: 'string',
      label: intl.get(`${preCode}.uom`).d('单位'),
      required: true,
      validator: codeValidator,
      maxLength: 10,
      unique: true,
    },
    {
      name: 'uomName',
      type: 'intl',
      label: intl.get(`${preCode}.uomName`).d('单位名称'),
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.uomDesc`).d('单位描述'),
      validator: descValidator,
    },
    {
      name: 'primaryFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.uomPrimaryFlag`).d('主单位标识'),
      defaultValue: false,
    },
    {
      name: 'conversionValue',
      type: 'number',
      label: intl.get(`${preCode}.uomConversionValue`).d('主单位换算'),
      required: true,
    },
    {
      name: 'decimalNumber',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.uomDecimalNum`).d('保留小数位'),
      required: true,
    },
    {
      name: 'externalUom',
      type: 'string',
      label: intl.get(`${preCode}.externalUom`).d('外部单位'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'PUT',
      };
    },
  },
});
