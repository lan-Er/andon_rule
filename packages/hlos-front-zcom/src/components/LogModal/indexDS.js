/*
 * @Descripttion: 日志DS
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-27 14:01:17
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-27 14:02:55
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.deliveryOrderCreate.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZCOM}/v1/${organizationId}/operation-records`;

const logListDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'operationUserName',
        type: 'string',
        label: intl.get(`${intlPrefix}.operationUserName`).d('操作人'),
      },
      {
        name: 'operationDate',
        type: 'string',
        label: intl.get(`${commonPrefix}.operationDate`).d('操作时间'),
      },
      {
        name: 'beforeStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.beforeStatusMeaning`).d('修改前状态'),
      },
      {
        name: 'statusMeaning',
        type: 'string',
        label: intl.get(`${commonPrefix}.statusMeaning`).d('修改后状态'),
      },
      {
        name: 'operationOpinion',
        type: 'string',
        label: intl.get(`${commonPrefix}.operationOpinion`).d('操作原因'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data,
          method: 'GET',
        };
      },
    },
  };
};

export { logListDS };
