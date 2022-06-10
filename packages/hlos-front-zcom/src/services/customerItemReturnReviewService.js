import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 退料审核
export async function verifyItemRefund(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/item-refunds/verify-item-refund`, {
    method: 'POST',
    body: params,
  });
}
