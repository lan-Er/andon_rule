/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-02-22 15:58:36
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-02-22 16:00:23
 */
import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 退料审核
export async function verifyVmiApply(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/vmi-applys/verify-vmi-apply`, {
    method: 'POST',
    body: params,
  });
}
