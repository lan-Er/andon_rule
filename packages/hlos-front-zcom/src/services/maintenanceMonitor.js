/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-02-22 15:58:36
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-09 10:13:18
 */
import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 退料删除
export async function deleteRepairsOrders(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/repairs-orders`, {
    method: 'DELETE',
    body: params,
  });
}

// 退料提交
export async function submitRepairsOrders(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/repairs-orders/submit`, {
    method: 'POST',
    body: params,
  });
}

// 重推至极米SAP
export async function repushToSAP(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/repairs-orders/reply`, {
    method: 'POST',
    body: params,
  });
}
