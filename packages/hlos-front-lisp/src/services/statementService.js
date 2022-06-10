/**
 * @Description: 对账单创建- service
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-23  16:58:00
 * @LastEditors: yu.na
 */

import request from 'utils/request';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';

import { getCurrentUser } from 'utils/utils';

const { loginName } = getCurrentUser();

// 生成对账单
export async function generateStatementApi(params) {
  const body = [];
  params.forEach((item) => {
    body.push({
      ...item,
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'STATEMENT_ORDER',
      user: loginName,
    });
  });
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'POST',
    body,
  });
}

// 更新对账单
export async function updateStatementApi(params) {
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'PUT',
    body: params,
  });
}

// 删除对账单
export async function deleteStatementApi(params) {
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'DELETE',
    body: params,
  });
}
