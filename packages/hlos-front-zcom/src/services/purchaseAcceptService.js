import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 关闭
export async function closeDeliveryOrderLine(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines/close-delivery-order-line`,
    {
      method: 'POST',
      body: params,
    }
  );
}

// 执行收货
export async function executeLines(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/execute-lines`, {
    method: 'POST',
    body: params,
  });
}

// 执行并关闭
export async function createAndCloseDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZCOM}/v1/${organizationId}/execute-lines/create-and-close-delivery-order`,
    {
      method: 'POST',
      body: params,
    }
  );
}
