import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 确认报工
export async function confirmReport(data) {
  return request(`${HLOS_LMESS}/v1/${organizationId}/neway-tasks/submit`, {
    method: 'POST',
    body: data,
  });
}

// 取消报工
export async function cancelReport(data) {
  return request(`${HLOS_LMESS}/v1/${organizationId}/neway-tasks/cancel`, {
    method: 'POST',
    body: data,
  });
}
