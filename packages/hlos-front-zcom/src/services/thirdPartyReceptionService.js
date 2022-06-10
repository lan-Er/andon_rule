import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 创建执行单明细
export async function executeLines(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/execute-lines`, {
    method: 'POST',
    body: params,
  });
}

// 创建执行单明细并关闭发货单行
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

// 关闭发货单行
export async function closeDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines/close-delivery-order-line`,
    {
      method: 'POST',
      body: params,
    }
  );
}
