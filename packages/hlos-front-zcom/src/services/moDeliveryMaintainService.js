/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-01-29 17:23:57
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-02-04 18:44:10
 */
import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 保存
export async function saveDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-orders/saveMoDeliveryOrder`, {
    method: 'POST',
    body: params,
  });
}

// 保存并提交
export async function releaseDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-orders/releaseMoDeliveryOrder`, {
    method: 'POST',
    body: params,
  });
}

// 批量提交
export async function batchReleaseDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-orders/batchReleaseMoDeliveryOrder`,
    {
      method: 'POST',
      body: params,
    }
  );
}

// 批量删除
export async function deleteDeliveryOrder(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-orders/deleteMoDeliveryOrder`, {
    method: 'DELETE',
    body: params,
  });
}

// 修改物流信息
export async function updateLogisticss(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/order-logisticss`, {
    method: 'POST',
    body: params,
  });
}

// 送货单查询打印信息
export async function moDeliveryPrint(params) {
  const organizationId = getCurrentOrganizationId(); // GET /v1/{organizationId}/mo-delivery-orders/moDeliveryPrint/{deliveryOrderId}
  return request(
    `${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-orders/moDeliveryPrint/${params.deliveryOrderId}`,
    {
      method: 'GET',
    }
  );
}

// 撤回
export async function revocable(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/`, {
    method: 'POST',
    body: params,
  });
}
