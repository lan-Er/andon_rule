/*
 * @Description: 采购退货单平台API
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-12-01 19:17:19
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS, HLOS_LWMSS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

export async function createDeliveryReturn(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/delivery-returns`, {
    method: 'POST',
    body: payload,
  });
}

export async function submitDeliveryReturn(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/delivery-returns/operation/RELEASED`, {
    method: 'POST',
    body: payload,
  });
}

export async function cancelDeliveryReturn(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/delivery-returns/operation/CANCELLED`, {
    method: 'POST',
    body: payload,
  });
}

export async function closeDeliveryReturn(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/delivery-returns/operation/CLOSED`, {
    method: 'POST',
    body: payload,
  });
}

export async function printDeliveryReturn(payload) {
  return request(
    `${HLOS_LWMSS}/v1/${organizationId}/raumplus-delivery-return/print-delivery-return`,
    {
      method: 'POST',
      body: payload,
    }
  );
}
