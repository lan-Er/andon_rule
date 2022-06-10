import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';

/**
 * 行查询
 * @param {*} queryParams 参数
 */
export async function getPlanLineList(queryParams) {
  return request(`${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-production-plans/line-list`, {
    method: 'GET',
    query: queryParams,
  });
}

/**
 * 齐套检查
 * @param {*} queryParams 参数
 */
export async function inspectionApi(queryParams) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-production-plans/inspection`,
    {
      method: 'POST',
      body: queryParams,
    }
  );
}

/**
 * 库存释放
 * @param {*} queryParams 参数
 */
export async function releaseApi(queryParams) {
  return request(`${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-production-plans/release`, {
    method: 'POST',
    body: queryParams,
  });
}

/**
 * 库存保留
 * @param {*} queryParams 参数
 */
export async function reservesApi(queryParams) {
  return request(`${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-production-plans/reserves`, {
    method: 'POST',
    body: queryParams,
  });
}

/**
 * 取消下达
 * @param {*} queryParams 参数
 */
export async function cancelMo(queryParams) {
  return request(`${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-mos/cancel-mo`, {
    method: 'POST',
    body: queryParams,
  });
}

/**
 * 下达
 * @param {*} queryParams 参数
 */
export async function releaseMo(queryParams) {
  return request(`${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-mos/release-mo`, {
    method: 'POST',
    body: queryParams,
  });
}

/**
 * 下达 新 -- 按套数下达
 * @param {*} queryParams
 * @returns
 */
export async function releaseMoSplit(queryParams) {
  return request(`${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-mos/release-mo-split`, {
    method: 'POST',
    body: queryParams,
  });
}

/**
 * 下达
 * @param {*} queryParams
 * @returns
 */
export async function releaseMoSplitNoKitting(queryParams) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-mos/release-mo-split-no-kitting`,
    {
      method: 'POST',
      body: queryParams,
    }
  );
}

/**
 * 库存保留 新
 * @param {*} queryParams
 * @returns
 */
export async function reservesSplit(queryParams) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-production-plans/reserves-split`,
    {
      method: 'POST',
      body: queryParams,
    }
  );
}

/**
 * 库存释放 新
 * @param {*} queryParams
 * @returns
 */
export async function releaseSplit(queryParams) {
  return request(
    `${HLOS_LMESS}/v1/${getCurrentOrganizationId()}/jcdq-production-plans/release-split`,
    {
      method: 'POST',
      body: queryParams,
    }
  );
}
