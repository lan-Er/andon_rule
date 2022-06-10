/*
 * @Description: 采购退货单执行API
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-12-03 18:58:24
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

// 退货单头查询
export async function deliveryReturnsHeader(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/delivery-returns`, {
    method: 'GET',
    query: params,
  });
}

// 退货单行查询
export async function deliveryReturnsLines(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/delivery-return-lines`, {
    method: 'GET',
    query: params,
  });
}

// 获取标签
export async function getTag(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things`, {
    method: 'GET',
    query: params,
  });
}

// 获取现有量
export async function getQuantity(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-quantitys`, {
    method: 'GET',
    query: params,
  });
}

export async function executeDeliveryReturn(params) {
  return request(
    `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/delivery-returns/execute-delivery-return`,
    {
      method: 'POST',
      body: params,
    }
  );
}
