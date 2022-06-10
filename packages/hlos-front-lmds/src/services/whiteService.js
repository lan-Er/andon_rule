/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-02-24 09:30:27
 */

import request from 'utils/request';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const url = `${HLOS_LMDS}/v1/white-list`;

// 新增
export async function addList(data) {
  const params = {
    ...data.tenantObj,
    whiteListIp: data.whiteListIp.toString(),
    whiteListIps: Array.from(data.whiteListIp),
  };
  return request(`${url}`, {
    method: 'POST',
    body: params,
  });
}
export async function editList(data) {
  const params = {
    ...data,
    whiteListIp: data.whiteListIp.toString(),
    whiteListIps: Array.from(data.whiteListIp),
  };
  return request(`${url}`, {
    method: 'PUT',
    body: params,
  });
}
