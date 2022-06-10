/**
 * @Description: 基础数据-单位DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-12 16:55:44
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const preCode = 'zmda.uom.model';
const commonCode = 'zmda.common.model';
const { zmdaUom } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_ZMDA}/v1/${organizationId}/uoms`;

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
      lookupCode: zmdaUom.uomClass,
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
      type: 'string',
      label: intl.get(`${preCode}.uomPrimaryFlag`).d('主单位标识'),
      trueValue: '1',
      falseValue: '0',
      defaultValue: '0',
    },
    {
      name: 'conversionRate',
      type: 'number',
      label: intl.get(`${preCode}.uomConversionRate`).d('主单位换算'),
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
      type: 'number',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      trueValue: 1,
      falseValue: 0,
      defaultValue: 1,
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
        data: {
          ...data[0],
        },
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data: {
          ...data[0],
        },
        method: 'PUT',
      };
    },
  },
});
