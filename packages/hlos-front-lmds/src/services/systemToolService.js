/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-03-30 16:04:43
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

const url = `${HLOS_LMDS}/v1/${organizationId}/common/common-init-redis`;
export async function updateCache(dataCode) {
  return request(`${url}?dataCode=${dataCode}`, {
    method: 'get',
  });
}
