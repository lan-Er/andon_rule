/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-03-02 16:06:56
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-11 11:11:41
 */
import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 保存对账单
export async function saveVerificationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/verification-orders/save`, {
    method: 'POST',
    body: params,
  });
}

// 保存对账单
export async function saveCreatePo(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/verification-orders/save-and-create-po`, {
    method: 'POST',
    body: params,
  });
}

// 提交对账单
export async function submitVerificationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/verification-orders/submit`, {
    method: 'POST',
    body: params,
  });
}

// 批量删除对账单
export async function deleteVerificationOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/verification-orders`, {
    method: 'DELETE',
    body: params,
  });
}
