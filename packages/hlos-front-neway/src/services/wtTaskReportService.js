import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 确认报工
export async function confirmReport(data) {
  const { keyOperationFlag, ...other } = data;
  const url = keyOperationFlag
    ? 'neway-tasks/submit'
    : 'neway-tasks/non-critical/operations/submit';
  return request(`${HLOS_LMESS}/v1/${organizationId}/${url}`, {
    method: 'POST',
    body: other,
  });
}

// 取消报工
export async function cancelReport(data) {
  const { keyOperationFlag, ...other } = data;
  const url = keyOperationFlag
    ? 'neway-tasks/cancel'
    : 'neway-tasks/non-critical/operations/cancel';
  return request(`${HLOS_LMESS}/v1/${organizationId}/${url}`, {
    method: 'POST',
    body: other,
  });
}
