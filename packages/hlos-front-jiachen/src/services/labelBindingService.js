import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LMESS, HLOS_LWMS } from 'hlos-front/lib/utils/config';

/**
 * 查询标签
 * @param {*} queryParams
 */
export async function getTagThingByTagCode(queryParams) {
  return request(`${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/tags/get-tag`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 提交
 * @param {*} queryParams
 * @returns
 */
export async function tagSubmit(queryParams) {
  return request(`${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-ferts`, {
    method: 'POST',
    body: queryParams,
  });
}

/**
 * 子码数量查询
 * @param {*} queryParams 参数
 */
export async function querySubQtyByItemID(queryParams) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/lmes-sub-qtys/sub-qty-by-item-code`,
    {
      method: 'GET',
      query: queryParams,
    }
  );
}

/**
 * 成品码查询
 * @param {*} queryParams 参数
 */
export async function queryFert(queryParams) {
  return request(`${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-ferts/detail`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 子码数量查询
 * @param {*} queryParams 参数
 */
export async function queryFertLines(queryParams) {
  return request(`${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-fert-lines/detail`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 下达
 * @param {*} queryParams 参数
 */
export async function fertsSubmit(queryParams) {
  return request(`${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-ferts/submit`, {
    method: 'POST',
    body: queryParams,
  });
}
