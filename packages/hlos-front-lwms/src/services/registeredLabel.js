/**
 * @Description: 注册标签 service
 * @Author: hongming。zhang@hand-china.com
 * @Date: 2020-12-27 14:08:30
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 提交注册标签
export async function submitRegisteredLabel(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/tags`, {
    method: 'POST',
    body: payload,
  });
}

// 提交注册标签
export async function queryRegisteredLabel(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/lots/get-lot-numbers`, {
    method: 'GET',
    query: payload,
  });
}