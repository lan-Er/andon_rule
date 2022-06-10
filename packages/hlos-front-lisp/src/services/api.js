/*
 * @Description: API Service
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-12-11 9:05:22
 * @Copyright: Copyright(c) 2019, Hand
 * @LastEditors: Please set LastEditors
 */

import request from 'utils/request';
import { getCurrentUser, getCurrentOrganizationId } from 'utils/utils';
// import { HLOS_LISP } from 'hlos-front/lib/utils/config';
const HLOS_LISP = '/lisp';

const { loginName } = getCurrentUser();

/**
 * 方案包基础数据初始化
 */
export async function initialApi() {
  return request(`${HLOS_LISP}/v1/datas/init-data`, {
    method: 'POST',
    body: {
      user: loginName,
    },
  });
}

/**
 * 方案包权限分配
 * @param {json} params
 */
export async function assignApi(params) {
  return request(`${HLOS_LISP}/v1/datas/assign`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 方案包权限清除
 * @param {json} params
 */
export async function clearApi(params) {
  return request(`${HLOS_LISP}/v1/datas/delete-by-users`, {
    method: 'DELETE',
    body: params,
  });
}

/**
 * 方案包权限清除
 * @param {json} params
 */
export async function deleteApi(params) {
  return request(`${HLOS_LISP}/v1/datas/template/functionType`, {
    method: 'DELETE',
    body: params,
  });
}

/**
 * 获取方案包数据
 * @param {json} params
 */
export async function queryApi() {
  return request(`/hpfm/v1/${getCurrentOrganizationId()}/lovs/value?lovCode=LISP.FUNCTION_TYPE`, {
    method: 'GET',
  });
}

/**
 * 获取数据
 */
export async function queryList(params) {
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 按日期范围获取需求感知分析数据
 */
export async function queryListByDateParams(params) {
  return request(`${HLOS_LISP}/v1/datas/data-params`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 按日期范围获取需求工单数据
 */
export async function queryMoDataByDateParams(params) {
  return request(`${HLOS_LISP}/v1/datas/get-mo-data`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 按日期范围获取需求工单数据
 */
export async function queryListNotByUser(params) {
  return request(`${HLOS_LISP}/v1/datas/list-notby-user`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 更新列表数据
 */
export async function updateList(query, body) {
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'PUT',
    query,
    body,
  });
}

/**
 * 删除列表数据
 */
export async function deleteListDatas(body) {
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'DELETE',
    body,
  });
}

/**
 * 按日期获取数据
 */
export async function queryListWithDate(params) {
  return request(`${HLOS_LISP}/v1/datas/solution-pack`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 获取排序数据
 */
export async function querySortList(params) {
  return request(`${HLOS_LISP}/v1/datas/solution-pack`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 订单执行接口
 */
export async function orderExcuteList(params) {
  return request(`${HLOS_LISP}/v1/datas/order-count`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 退货原因环比
 * */
export async function returnDataList(params) {
  return request(`${HLOS_LISP}/v1/datas/return-chain-index`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 退货原因环比
 * */
export async function orderRateList(params) {
  return request(`${HLOS_LISP}/v1/datas/total-order-ci`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取合格率环比
 * */
export async function qualityList(params) {
  return request(`${HLOS_LISP}/v1/datas/quality-rate`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询异常订单数
 * */
export async function getTroubleCount(params) {
  return request(`${HLOS_LISP}/v1/datas/exception-count`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取各状态订单数
 */

export async function getOrderCount(params) {
  return request(`${HLOS_LISP}/v1/datas/query-order-count`, {
    method: 'GET',
    query: params,
  });
}

/**
 *供应生产合格率计算
 */
export async function getSupplierQualityRateApi(params) {
  return request(`${HLOS_LISP}/v1/datas/quality-rate-calculation`, {
    method: 'GET',
    query: params,
  });
}

export async function getSupplierQualityRate(params) {
  return request(`${HLOS_LISP}/v1/datas/quality-rate-calculation`, {
    method: 'GET',
    query: params,
  });
}

/**
 *供应到货及时率率计算
 */
export async function getTimeRateApi(params) {
  return request(`${HLOS_LISP}/v1/datas/customer-pass-rate-calculation`, {
    method: 'GET',
    query: params,
  });
}

export async function getTimeRate(params) {
  return request(`${HLOS_LISP}/v1/datas/customer-pass-rate-calculation`, {
    method: 'GET',
    query: params,
  });
}

/**
 *获取平均交期数据
 */
export async function getDayNumApi(params) {
  return request(`${HLOS_LISP}/v1/datas/average-delivery`, {
    method: 'GET',
    query: params,
  });
}

/**
 *获取平均交期数据
 */
export async function getIqcRateApi(params) {
  return request(`${HLOS_LISP}/v1/datas/delivery-rate-calculation`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 更新列表数据
 */
export async function deleteList(query, body) {
  return request(`${HLOS_LISP}/v1/datas`, {
    method: 'DELETE',
    query,
    body,
  });
}
