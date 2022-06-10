/*
 * @Description: 采购接收确认 - service
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-24 16:03:43
 * @LastEditors: liangkun
 * @LastEditTime: 2020-07-24 16:05:38
 * @Copyright: Copyright (c) 2018, Hand
 */

import request from 'utils/request';
import querystring from 'querystring';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { getCurrentUser, filterNullValueObject } from 'utils/utils';

const { loginName } = getCurrentUser();

// 提交
export async function submitAPI(params) {
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'PUT',
    body: params,
  });
}

// 查询标签数量
export async function queryTabsQtyAPI(params) {
  const queryParams = querystring.stringify(
    filterNullValueObject({
      ...params,
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'SHIP_ORDER',
      user: loginName,
      page: 0,
      size: 1,
    })
  );
  return request(`${HLOS_LISP}/v1/datas/solution-pack?${queryParams}`, {
    method: 'GET',
  });
}
