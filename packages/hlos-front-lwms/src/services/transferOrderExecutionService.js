/*
 * @Description: 转移单执行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-02 18:27:21
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 根据转移单号查询
export async function queryTransferByNum(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/transfer`, {
    method: 'GET',
    query: params,
  });
}

// 行数据查询
export async function queryRequestLines(params) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-lines`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询物料批次列表数据
 * @param {*} queryParams 参数
 */
export async function requestItemLot(queryParams) {
  const { useAdvise, ...params } = queryParams;
  if (useAdvise) {
    return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/lots/advise-lots`, {
      method: 'GET',
      query: queryParams,
    });
  }
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-quantitys`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询物料标签列表数据
 * @param {*} queryParams 参数
 */
export async function requestItemTag(queryParams) {
  const { useAdvise, ...params } = queryParams;
  if (useAdvise) {
    return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/advise-tags`, {
      method: 'GET',
      query: queryParams,
    });
  }
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/item-tag-thing`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 领料单拣料
 * @param {*} queryParams 参数
 */
export async function pickRequest(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/pick-request`, {
    method: 'PUT',
    body: queryParams,
  });
}

/**
 * 领料单直接发出 -- 转移
 * @param {*} queryParams 参数
 */
export async function executeRequest(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/execute-request`, {
    method: 'PUT',
    body: queryParams,
  });
}

/**
 * 领料单直接发出 -- 转移
 * @param {*} queryParams 参数
 */
export async function executePicked(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/execute-picked`, {
    method: 'PUT',
    body: queryParams,
  });
}
