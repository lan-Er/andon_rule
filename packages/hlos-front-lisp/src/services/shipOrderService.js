/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-07-25 10:27:53
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-07-25 10:34:19
 */
import request from 'utils/request';
import querystring from 'querystring';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { getCurrentUser, filterNullValueObject } from 'utils/utils';

const { loginName } = getCurrentUser();

// 发货单确认
export async function orderConfirmApi(params) {
  const queryParams = querystring.stringify(
    filterNullValueObject({
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'SHIP_ORDER',
      user: loginName,
    })
  );
  return request(`${HLOS_LISP}/v1/datas/ship-order?${queryParams}`, {
    method: 'PUT',
    body: params,
  });
}
