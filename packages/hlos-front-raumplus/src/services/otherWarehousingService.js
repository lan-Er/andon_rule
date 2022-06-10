/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-06-02 20:09:39
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-06-09 17:34:57
 */
/**
 * @Description: 其他出入库平台 service
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMSS, HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 创建其他出入库
export async function createOtherWarehousing(payload) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers`, {
    method: 'POST',
    body: payload,
  });
}
// 删除其他出入库
export async function deleteOtherWarehousing(payload) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers`, {
    method: 'DELETE',
    body: payload,
  });
}

// 其他出入库变更状态
export async function changeOtherWarehousing(payload) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers`, {
    method: 'PUT',
    body: payload,
  });
}

// 批量删除其他出入库
export async function batchDeleteOtherWarehousing(payload) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers/batch-remove`, {
    method: 'DELETE',
    body: payload,
  });
}

// 其他出入库批量变更状态
export async function batchChangeOtherWarehousing(payload) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers/batch-update`, {
    method: 'PUT',
    body: payload,
  });
}

// 其他出入库行创建
export async function createOtherWarehousingRow(payload) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-lines/batch-create`, {
    method: 'POST',
    body: payload,
  });
}

// 其他出入库行批量变更状态
export async function batchChangeOtherWarehousingRow(payload) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-lines/batchUpdate`, {
    method: 'PUT',
    body: payload,
  });
}

// 其他出入库行获取物料仓储类别
export async function getItemWarehouseTypeApi(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/item-wms`, {
    method: 'GET',
    query: params,
  });
}

// 其他出入库行打印数据
export async function getReportData(payload) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/inv-transaction-headers/report`, {
    method: 'POST',
    body: payload,
  });
}
