/*
 * @Description: 检验单平台API
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-20 17:37:48
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 取消
export async function inspectionDocCancel(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/cancelled`, {
    method: 'PUT',
    body: params,
  });
}
