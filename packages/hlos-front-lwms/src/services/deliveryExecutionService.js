import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

export async function queryList(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/sd-ow-query`, {
    method: 'GET',
    query: queryParams,
  });
}

export async function queryDetail(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/ship-order-lines`, {
    method: 'GET',
    query: queryParams,
  });
}

// 直接发出
export async function executeShipOrder(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/execute-ship-order`, {
    method: 'POST',
    body: queryParams,
  });
}

// 拣料执行
export async function pickShipOrder(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/pick-ship-order`, {
    method: 'POST',
    body: queryParams,
  });
}

// 已拣料执行
export async function pickedShipOrder(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/picked-ship-order`, {
    method: 'POST',
    body: queryParams,
  });
}

// 更新发货单执行
export async function updateShipOrder(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/update-ship-order-execute`, {
    method: 'POST',
    body: queryParams,
  });
}
