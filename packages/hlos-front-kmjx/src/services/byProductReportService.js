/*
 * @Description: 检验判定 API
 * @Author: zmt
 * @LastEditTime: 2020-10-19 15:42:38
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

// 同意
export async function approveOrRefuseByProduct(params) {
  return request(`/lmes/v1/${organizationId}/kmjx-task-submits/audit`, {
    method: 'POST',
    body: params,
  });
}
