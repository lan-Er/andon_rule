/**
 * @Description: 类别集管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-14 10:52:46
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import {
  SEGMENT_NUMBER_MIN,
  SEGMENT_NUMBER_MAX,
  CODE_MAX_LENGTH,
} from 'hlos-front/lib/utils/constants';

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.category.model';
const commonCode = 'lmds.common.model';

const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/category-sets`;

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
      type: 'boolean',
      label: intl.get(`${preCode}.categorySetSegmentLimit`).d('段数限定'),
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
