/**
 * @Description: 工艺路线--service
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-16 15:35:53
 * @LastEditors: yu.na
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 复制
export async function copyApi(routingId) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/routings/copy?routingId=${routingId}`, {
    method: 'POST',
  });
}
