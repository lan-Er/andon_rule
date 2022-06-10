/*
 * @Description: 批次冻结API
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-11-23 14:55:11
 */
import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 冻结
export async function frozenLot(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tag-things/frozen-lot`, {
    method: 'POST',
    body: params,
  });
}

// 解冻
export async function unFrozenLot(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tag-things/un-frozen-lot`, {
    method: 'POST',
    body: params,
  });
}
