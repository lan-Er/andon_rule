/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-05-10 20:20:13
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-05-10 20:26:43
 */
import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';

/**
 * 查询
 * @param {*} queryParams 参数
 */
export async function shipOrderLists(queryParams) {
  return request(`${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/raumplus/ship-order-lists`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 查询
 * @param {*} queryParams 参数
 */
export async function queryPrintData(queryParams) {
  return request(
    `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/raumplus/ship-order-lists/get-print`,
    {
      method: 'GET',
      query: queryParams,
    }
  );
}

// /raumplus/ship-order-list-file/get-file-list
/**
 * 查询
 * @param {*} queryParams 参数
 */
export async function getDownload(queryParams) {
  return request(
    `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/raumplus/ship-order-list-file/get-file-list`,
    {
      method: 'GET',
      query: queryParams,
    }
  );
}
