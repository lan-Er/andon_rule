/*
 * @Description: 订单详情 - services
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-25 16:05:37
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-25 16:07:54
 * @Copyright: Copyright (c) 2018, Hand
 */

import request from 'utils/request';
import querystring from 'querystring';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';

import { getCurrentUser, filterNullValueObject } from 'utils/utils';

const { loginName } = getCurrentUser();
// 查询标签数量
export async function queryTabsQtyAPI(params) {
  const queryParams = querystring.stringify(
    filterNullValueObject({
      ...params,
      functionType: 'SUPPLIER_CHAIN_OVERALL',
      dataType: 'ORDER',
      user: loginName,
      page: 0,
      size: 10,
    })
  );
  return request(`${HLOS_LISP}/v1/datas/solution-pack?${queryParams}`, {
    method: 'GET',
  });
}
