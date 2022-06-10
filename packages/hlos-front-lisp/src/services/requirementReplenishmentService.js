/*
 * @Author: zilong.wei01@hand-china.com
 * @Date: 2020-08-25 17:12:37
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-03 15:25:24
 */
import request from 'utils/request';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';

import { getCurrentUser } from 'utils/utils';

const { loginName } = getCurrentUser();

export async function generateAPI(params) {
  const body = [];
  params.forEach((item) => {
    body.push({
      ...item,
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'Check_mangenment_Line',
      user: loginName,
    });
  });
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'POST',
    body,
  });
}

// 更新订单
export async function updateAPI(params) {
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'PUT',
    body: params,
  });
}
