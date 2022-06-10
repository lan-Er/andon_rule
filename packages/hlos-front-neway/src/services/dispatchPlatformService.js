/*
 * @Author: 徐雨 <yu.xu02@hand-china.com>
 * @Date: 2021-06-07 09:54:16
 * @LastEditTime: 2021-06-07 09:55:59
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
// 派工
export async function dispatching(data) {
  return request(`${HLOS_LMESS}/v1/${organizationId}/neway-tasks/neway-task-dispatch`, {
    method: 'POST',
    body: data,
  });
}

// 取消派工
export async function cancel(data) {
  return request(`${HLOS_LMESS}/v1/${organizationId}/neway-tasks/neway-cancel-task-dispatchl`, {
    method: 'POST',
    body: data,
  });
}
