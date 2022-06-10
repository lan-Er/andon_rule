/*
 * @Author: zhang yang
 * @Description: 安灯分类
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-26 09:05:12
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';

const commonCode = 'lmds.common.model';
const preCode = 'lmds.andonClass.model';
const organizationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/andon-classs`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'andonClassCode',
      type: 'string',
      label: intl.get(`${preCode}.andonClass`).d('安灯分类'),
    },
    {
      name: 'andonClassName',
      type: 'string',
      label: intl.get(`${preCode}.andonClassName`).d('安灯分类名称'),
    },
  ],
  fields: [
    {
      name: 'andonClassCode',
      type: 'string',
      label: intl.get(`${preCode}.andonClass`).d('安灯分类'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'andonClassName',
      type: 'intl',
      label: intl.get(`${preCode}.andonClassName`).d('安灯分类名称'),
      required: true,
    },
    {
      name: 'andonClassAlias',
      type: 'intl',
      label: intl.get(`${preCode}.andonClassAlias`).d('安灯分类简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.andonClassDesc`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'orderByCode',
      type: 'string',
      label: intl.get(`${preCode}.orderByCode`).d('排序'),
      required: true,
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
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'PUT',
      };
    },
  },
});
