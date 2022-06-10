/**
 * @Description: Mo工作台 api
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-16 15:18:08
 * @LastEditors: yu.na
 */

import request from 'utils/request';
import { HLOS_LMES, HLOS_LMDS, HLOS_LRPT } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMES}/v1/${organizationId}/mos`;

/**
 * 获取MO号
 */
export async function requestNum(params) {
  return request(`${commonUrl}/getMoNumber`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 暂挂MO
 */
export async function holdMo(params) {
  return request(`${commonUrl}/hold-mo`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 复原MO
 */
export async function unholdMo(params) {
  return request(`${commonUrl}/un-hold-mo`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 取消MO
 */
export async function cancelMo(params) {
  return request(`${commonUrl}/cancel-mo`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 关闭MO
 */
export async function closeMo(params) {
  return request(`${commonUrl}/close-mo`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 下达MO
 */
export async function releaseMo(params) {
  return request(`${commonUrl}/release-mo`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 下达MO
 */
export async function releaseMoSplit(params) {
  return request(`${commonUrl}/release-mo-split`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 分解MO
 */
export async function exploreMo(params) {
  return request(`${commonUrl}/explorer-mo`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 分解MO
 */
export async function exploreMoSplit(params) {
  return request(`${commonUrl}/explorer-mo-split`, {
    method: 'POST',
    body: params,
  });
}

export async function queryMeOuData(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/me-ous/lovs/data`, {
    method: 'GET',
    query: params,
  });
}

// 获取MO物料属性
export async function getMoItem(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/items/batch-get-mo-item`, {
    method: 'POST',
    body: params,
  });
}

// 获取打印数据
export async function queryMoPrintList(params) {
  return request(`${HLOS_LRPT}/v1/${organizationId}/mos/process-flow-card-print`, {
    method: 'GET',
    query: params,
  });
}

// 检验流转单打印数据
export async function checkFlowPrintList(params) {
  return request(`/lwmss/v1/${organizationId}/mos/valid-mo-flow-print`, {
    method: 'GET',
    query: params,
  });
}
