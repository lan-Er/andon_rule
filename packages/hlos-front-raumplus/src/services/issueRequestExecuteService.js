import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS, HLOS_LWMSS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

/**
 * 通过领料单号查询领料执行列表数据
 * @param {*} queryParams 参数
 */
export async function requestByNum(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/issue-by-num`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 查询领料行列表数据
 * @param {*} queryParams 参数
 */
export async function requestLine(queryParams) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/raumplus-request-headers/getRequestLineList`, {
    method: 'GET',
    query: {
      ...queryParams,
      attributeString1: '1',
    },
  });
}

/**
 * 查询物料批次列表数据
 * @param {*} queryParams 参数
 */
export async function requestItemLot(queryParams) {
  const { useAdvise, ...params } = queryParams;
  if (useAdvise) {
    return request(`${HLOS_LWMS}/v1/${organizationId}/lots/advise-lots`, {
      method: 'GET',
      query: params,
    });
  }
  return request(`${HLOS_LWMS}/v1/${organizationId}/onhand-quantitys`, {
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
    return request(`${HLOS_LWMS}/v1/${organizationId}/tag-things/advise-tags`, {
      method: 'GET',
      query: params,
    });
  }
  return request(`${HLOS_LWMS}/v1/${organizationId}/tag-things/item-tag-thing`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 拣料
 * @param {*} queryParams 参数
 */
export async function requestPick(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/pick-request`, {
    method: 'PUT',
    body: queryParams,
  });
}

/**
 * 领料发出
 * @param {*} queryParams 参数
 */
export async function requestExecute(queryParams) {
  // return request(`${HLOS_LWMSS}/v1/${organizationId}/raumplus-request-headers/execute-request`, {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/request-headers/execute-request`, {
    method: 'PUT',
    body: queryParams,
  });
}

/**
 * 领料发出
 * @param {*} queryParams 参数
 */
export async function autoExecute(queryParams) {
  // return request(`/lwss/v1/${organizationId}/raumplus-request-headers/issue-direct-request`, {
  return request(
    `${HLOS_LWMSS}/v1/${organizationId}/raumplus-request-headers/issue-direct-request`,
    {
      method: 'PUT',
      body: queryParams,
    }
  );
}

/**
 * 已拣料发出
 * @param {*} queryParams 参数
 */
export async function requestPickedExecute(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/request-headers/execute-picked`, {
    method: 'PUT',
    body: queryParams,
  });
}
