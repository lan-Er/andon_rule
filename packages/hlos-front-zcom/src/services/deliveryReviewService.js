import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 审核送货单
export async function verifyDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders/verifyDeliveryOrder`, {
    method: 'POST',
    body: params,
  });
}
