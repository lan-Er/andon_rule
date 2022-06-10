/**
 * @Description: 采购退货单 service
 * @Author: yu.na@hand-china.com
 * @Date: 2020-08-27 14:08:30
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
// 获取现有量
export async function getQuantity(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/onhand-quantitys`, {
    method: 'GET',
    query: params,
  });
}

// 获取标签
export async function getTag(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tag-things`, {
    method: 'GET',
    query: params,
  });
}

// 采购退货发出
export async function deliveryPartyReturnApi(params) {
  return request(
    `${HLOS_LWMS}/v1/${organizationId}/delivery-returns/execute-party-delivery-return`,
    {
      method: 'POST',
      body: params,
    }
  );
}
