/*
 * @Description: 事件查询--EventListDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-12-24 09:50:20
 * @LastEditors: 赵敏捷
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import codeConfig from '@/common/codeConfig';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const { lmdsEvent } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lmds.event.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/event-records`;

export default () => ({
  selection: false,
  fields: [
    {
      name: 'objectType',
      type: 'string',
      lookupCode: lmdsEvent.objectType,
      label: intl.get(`${intlPrefix}.objectType`).d('对象类型'),
    },
    {
      name: 'objectId',
      label: intl.get(`${intlPrefix}.objectId`).d('对象ID'),
    },
    {
      name: 'object',
      label: intl.get(`${intlPrefix}.object`).d('对象'),
    },
    {
      name: 'recordType',
      type: 'string',
      lookupCode: lmdsEvent.recordType,
      label: intl.get(`${intlPrefix}.recordType`).d('对象类型'),
    },
    {
      name: 'keyValue',
      label: intl.get(`${intlPrefix}.keyValue`).d('关键值'),
    },
    {
      name: 'snapshotRecord',
      label: intl.get(`${intlPrefix}.snapshotRecord`).d('快照记录'),
    },
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
  },
});
