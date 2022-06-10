/*
 * @Description: 到货接收API
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-09-14 13:53:04
 */
import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

export async function supplierReceive(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/delivery-tickets/supplier-receive`, {
    method: 'POST',
    body: params,
  });
}
