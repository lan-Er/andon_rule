/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-01-29 17:23:57
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-02-04 18:49:29
 */
import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 保存
export async function saveItemRefunds(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/item-refunds`, {
    method: 'POST',
    body: params,
  });
}

// 批量删除头
export async function deleteItemRefunds(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/item-refunds`, {
    method: 'DELETE',
    body: params,
  });
}

// 批量删除行
export async function deleteLineItemRefunds(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/item-refund-lines`, {
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

// 退料单查询打印信息
export async function itemRefundPrint(params) {
  const organizationId = getCurrentOrganizationId();
  return request(
    `${HLOS_ZCOM}/v1/${organizationId}/item-refunds/item-refund-print/${params.itemRefundId}`,
    {
      method: 'GET',
    }
  );
}

// 撤回
export async function revocable(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/item-refund-lines/withdraw`, {
    method: 'POST',
    body: params,
  });
}
