/*
 * @Description: API Service
 * @Author: Sai <jianjun.tan@hand-china.com>
 * @Date: 2020-06-23 9:05:22
 * @Copyright: Copyright(c) 2020, Hand
 * @LastEditors: Sai
 */

import request from 'utils/request';
import { HLOS_LDAB } from 'hlos-front/lib/utils/config';

/**
 * 接口同步
 * @param {json} body
 * @param {string} url
 */
export async function asyncInterface(params) {
  const { body, url } = params;
  return request(`${HLOS_LDAB}/v1/${url}`, {
    method: 'POST',
    body,
  });
}

/**
 * 清除日志
 * @param {json} params
 */
export async function deleteInterfaceLogs(params) {
  return request(`${HLOS_LDAB}/v1/interface/interface-log`, {
    method: 'DELETE',
    query: params,
  });
}
