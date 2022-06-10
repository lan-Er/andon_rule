/**
 * @Description: Mo生产退库 api
 * @Author: tw
 */

import request from 'utils/request';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

// mo生产退库
export async function moInventoryReturn(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/execute-lines/mo-inventory-return`, {
    method: 'POST',
    body: params,
  });
}
