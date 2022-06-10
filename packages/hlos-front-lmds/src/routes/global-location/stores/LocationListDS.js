/*
 * @Description: 地理位置管理信息--LocationListDs
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-13 15:05:22
 * @LastEditors: 赵敏捷
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsLocation } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/locations`;
const intlPrefix = 'lmds.location';

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
      name: 'locationCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.location`).d('地理位置'),
      required: true,
      order: 'asc',
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'locationName',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.locationName`).d('地理位置名称'),
      required: true,
    },
    {
      name: 'locationAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.locationAlias`).d('地理位置简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.locationDesc`).d('地理位置描述'),
      validator: descValidator,
    },
    {
      name: 'locationType',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.locationType`).d('地理位置类型'),
      lookupCode: lmdsLocation.locationType,
      required: true,
    },
    {
      name: 'gpsInfo',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.gpsInfo`).d('GPS信息'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.model.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  queryFields: [
    {
      name: 'locationCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.location`).d('地理位置'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.locationName`).d('地理位置名称'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
  },
});
