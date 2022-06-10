/**
 * @Description: 仓库看板--service
 * @Author: tw
 * @Date: 2021-05-26 15:35:53
 * @LastEditors: tw
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 仓库看板
export async function getKanban(params) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/tag-thing-print/get-kanban`, {
    method: 'POST',
    body: params,
  });
}
