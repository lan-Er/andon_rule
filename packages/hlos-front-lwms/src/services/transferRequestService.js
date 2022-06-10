/*
 * @Module: 转移单
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-03-09 19:39:48
 * @LastEditors: Please set LastEditors
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

export async function createAndUpdateTR(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/transfer`, {
    method: 'POST',
    body: payload,
  });
}

export async function cancelTR(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/cancel`, {
    method: 'PUT',
    body: payload,
  });
}

export async function submitTR(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/release`, {
    method: 'PUT',
    body: payload,
  });
}

export async function closeTR(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/close`, {
    method: 'PUT',
    body: payload,
  });
}

export async function deleteTR(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/delete`, {
    method: 'DELETE',
    body: payload,
  });
}

export async function executeByRequestTR(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/execute-by-request`, {
    method: 'POST',
    body: payload,
  });
}

export async function deleteTRLine(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-lines/delete`, {
    method: 'DELETE',
    body: payload,
  });
}

export async function cancelTRLine(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-lines/cancel`, {
    method: 'PUT',
    body: payload,
  });
}

export async function closeTRLine(payload) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-lines/close`, {
    method: 'PUT',
    body: payload,
  });
}

/**
 * 获取可用量
 */
export async function getAvailableQty(params) {
  return request(
    `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-quantitys/get-available-qty`,
    {
      method: 'GET',
      query: params,
    }
  );
}

/**
 * 获取现有量
 */
export async function getOnhandQty(params) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-quantitys/get-onhand-qty`, {
    method: 'GET',
    query: params,
  });
}
