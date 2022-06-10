/*
 * @Author: zhang yang
 * @Description: 销售组-- dataset
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-18 13:46:21
 */

import { getCurrentOrganizationId } from 'hzero-front/lib/utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdssopGroup, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/sop-groups`;
const commonCode = 'lmds.common.model';
const preCode = 'lmds.sopGroup.model';

export default () => ({
  selection: false,
  autoQuery: true,
  transport: {
    read: () => ({
      url,
      method: 'get',
    }),
    create: () => ({
      url,
      method: 'post',
    }),
    submit: () => ({
      url,
      method: 'put',
    }),
  },
  fields: [
    {
      name: 'sopOu',
      type: 'object',
      lovCode: lmdssopGroup.sopOu,
      label: intl.get(`${preCode}.sopOu`).d('销售中心'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'sopOuId',
      type: 'string',
      bind: 'sopOu.sopOuId',
    },
    {
      name: 'sopOuCode',
      type: 'string',
      bind: 'sopOu.sopOuCode',
    },
    {
      name: 'sopOuName',
      type: 'string',
      bind: 'sopOu.sopOuName',
    },
    {
      name: 'sopGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.sopGroup`).d('销售组'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
    },
    {
      name: 'sopGroupName',
      type: 'intl',
      label: intl.get(`${preCode}.sopGroupName`).d('销售组名称'),
      required: true,
    },
    {
      name: 'sopGroupAlias',
      type: 'intl',
      label: intl.get(`${preCode}.sopGroupAlias`).d('销售组简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.sopGroupDesc`).d('销售组描述'),
      validator: descValidator,
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get(`${commonCode}.location`).d('地理位置'),
      lovCode: common.location,
      ignore: 'always',
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'locationObj.locationId',
    },
    {
      name: 'locationCode',
      type: 'string',
      bind: 'locationObj.locationCode',
    },
    {
      name: 'locationName',
      type: 'string',
      bind: 'locationObj.locationName',
    },
    {
      name: 'externalOrganization',
      type: 'string',
      label: intl.get(`${commonCode}.externalOrg`).d('外部关联组织'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
  ],
  queryFields: [
    { name: 'sopGroupCode', type: 'string', label: intl.get(`${preCode}.sopGroup`).d('销售组') },
    {
      name: 'sopGroupName',
      type: 'string',
      label: intl.get(`${preCode}.sopGroupName`).d('销售组名称'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
  },
});
