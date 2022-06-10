import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

/**
 * 通过领料单号查询领料执行列表数据
 * @param {*} queryParams 参数
 */
export async function requestByNum(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/issue-by-num`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 查询领料行列表数据
 * @param {*} queryParams 参数
 */
export async function requestLine(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-lines`, {
    method: 'GET',
    query: queryParams,
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
      query: params,
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
      query: params,
    });
  }
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tag-things/item-tag-thing`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 拣料
 * @param {*} queryParams 参数
 */
export async function requestPick(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/pick-request`, {
    method: 'PUT',
    body: queryParams,
  });
}

/**
 * 发出
 * @param {*} queryParams 参数
 */
export async function requestExecute(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/execute-request`, {
    method: 'PUT',
    body: queryParams,
  });
}

/**
 * 已拣料发出
 * @param {*} queryParams 参数
 */
export async function requestPickedExecute(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/request-headers/execute-picked`, {
    method: 'PUT',
    body: queryParams,
  });
}
