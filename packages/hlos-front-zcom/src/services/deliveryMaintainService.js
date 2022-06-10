/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-01-20 10:45:27
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-01-28 11:06:55
 */
import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 保存
export async function saveDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders/saveDeliveryOrder`, {
    method: 'POST',
    body: params,
  });
}

// 保存并提交
export async function releaseDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders/releaseDeliveryOrder`, {
    method: 'POST',
    body: params,
  });
}

// 批量提交
export async function batchReleaseDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders/batchReleaseDeliveryOrder`, {
    method: 'POST',
    body: params,
  });
}

// 批量删除
export async function deleteDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-orders`, {
    method: 'DELETE',
    body: params,
  });
}

// 修改物流信息
export async function updateLogisticss(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/delivery-logisticss`, {
    method: 'POST',
    body: params,
  });
}
