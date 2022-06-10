import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 对账单审核
export async function verifyVerificationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/verify-verification-order`,
    {
      method: 'POST',
      body: params,
    }
  );
}
