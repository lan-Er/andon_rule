/*
 * @Descripttion: 类别集管理信息--tableDS
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-16 09:26:56
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-16 10:04:43
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import {
  SEGMENT_NUMBER_MIN,
  SEGMENT_NUMBER_MAX,
  CODE_MAX_LENGTH,
} from 'hlos-front/lib/utils/constants';

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.category.model';
const commonCode = 'lmds.common.model';

const url = `${HLOS_ZMDA}/v1/${organizationId}/category-sets`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'categorySetCode',
      type: 'string',
      label: intl.get(`${preCode}.categorySet`).d('类别集'),
    },
    {
      name: 'categorySetName',
      type: 'string',
      label: intl.get(`${preCode}.categorySetName`).d('类别集名称'),
    },
  ],
  fields: [
    {
      name: 'categorySetCode',
      type: 'string',
      label: intl.get(`${preCode}.categorySet`).d('类别集'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'categorySetName',
      type: 'intl',
      label: intl.get(`${preCode}.categorySetName`).d('类别集名称'),
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.categorySetDesc`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'segmentNum',
      type: 'number',
      label: intl.get(`${preCode}.categorySetSegmentNum`).d('段数'),
      min: SEGMENT_NUMBER_MIN,
      max: SEGMENT_NUMBER_MAX,
      step: 1,
      required: true,
    },
    {
      name: 'segmentLimitFlag',
      type: 'number',
      label: intl.get(`${preCode}.categorySetSegmentLimit`).d('段数限定'),
      required: true,
      defaultValue: 1,
      trueValue: 1,
      falsevalue: 0,
    },
    {
      name: 'enabledFlag',
      type: 'number',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: 1,
      trueValue: 1,
      falsevalue: 0,
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
        url,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'PUT',
      };
    },
  },
});
