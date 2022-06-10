/**
 * @Description: 需求工作台 api
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-28 15:18:08
 * @LastEditors: yu.na
 */

import request from 'utils/request';
import { HLOS_LSOP } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const commonUrl = `${HLOS_LSOP}/v1/${getCurrentOrganizationId()}/lsop-demands`;

/**
 * 获取需求订单号
 */
export async function requestNum(params) {
  return request(`${commonUrl}/getDemandNumber`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 取消需求订单
 */
export async function deleteDemand(params) {
  return request(`${commonUrl}/deleteDemand`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 取消需求订单
 */
export async function cancelDemand(params) {
  return request(`${commonUrl}/cancelDemand`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 关闭需求订单
 */
export async function closeDemand(params) {
  return request(`${commonUrl}/closeDemand`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 提交需求订单
 */
export async function releaseDemand(params) {
  return request(`${commonUrl}/releaseDemand`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 分解需求订单
 */
export async function exploreDemand(params) {
  return request(`${commonUrl}/explore-demand`, {
    method: 'POST',
    body: params,
  });
}
