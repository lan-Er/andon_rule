/*
 * @Description: 采购需求发布与确认 - service
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-24 16:03:43
 * @LastEditors: liangkun
 * @LastEditTime: 2020-07-24 16:05:38
 * @Copyright: Copyright (c) 2018, Hand
 */

import request from 'utils/request';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';

// 新建采购订单
export async function createSoAPI(params) {
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'POST',
    body: params,
  });
}

// 发布
export async function releaseAPI(params) {
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'PUT',
    body: params,
  });
}

// 确认订单
export async function confirmAPI(params) {
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'PUT',
    body: params,
  });
}
