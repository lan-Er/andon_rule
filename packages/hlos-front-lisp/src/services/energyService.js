/*
 * @Description: API Service
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-12-11 9:05:22
 * @Copyright: Copyright(c) 2019, Hand
 * @LastEditors: Please set LastEditors
 */

import request from 'utils/request';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';

/**
 * 百度同步数据
 */
export async function asyncApi(params) {
  return request(`${HLOS_LISP}/v1/${getCurrentOrganizationId()}/be-meter-paras/get-fz-daily-list`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取能耗数据
 */
export async function requestApi(params) {
  return request(
    generateUrlWithGetParam(
      `${HLOS_LISP}/v1/${getCurrentOrganizationId()}/be-meter-paras/get-day`,
      {
        dataTimeStringArray: params.dataTimeStringArray,
      }
    ),
    {
      method: 'GET',
    }
  );
}

/**
 * 获取当前日期能耗数据
 */
export async function requestCurrentApi(params) {
  return request(`${HLOS_LISP}/v1/${getCurrentOrganizationId()}/be-meter-paras`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取七天开动率数据
 */
export async function requestOperationApi(params) {
  return request(
    `${HLOS_LISP}/v1/${getCurrentOrganizationId()}/be-execute-lines/get-utilization-be`,
    {
      method: 'GET',
      query: params,
    }
  );
}
