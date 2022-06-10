import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { queryLovData } from 'hlos-front/lib/services/api';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
// @ts-ignore
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

export async function queryDefaultOrg() {
  try {
    const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
    // @ts-ignore
    if (getResponse(res) && res.content[0]) {
      return {
        organizationId: res.content[0].organizationId,
        organizationCode: res.content[0].organizationCode,
        organizationName: res.content[0].organizationName,
      };
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('failed to get default org info: ', e.message);
  }
}

export async function fetchLineNumber(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/count-lines/max-line-num`, {
    method: 'GET',
    query: queryParams,
  });
}

// 新建
export async function createWmCountSer(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/counts/create-wm-count`, {
    method: 'POST',
    body: queryParams,
  });
}

// 关闭
export async function closeWmCountSer(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/counts/close-wm-count`, {
    method: 'POST',
    body: queryParams,
  });
}

// 取消
export async function cancelWmCountSer(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/counts/cancel-wm-count`, {
    method: 'POST',
    body: queryParams,
  });
}

// 快照
export async function snapshotWmCountSer(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/counts/snapshot-wm-count`, {
    method: 'POST',
    body: queryParams,
  });
}

// 删除
export async function deleteWmCountSer(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/counts/delete-wm-count`, {
    method: 'POST',
    body: queryParams,
  });
}

// 完成
export async function completeWmCountSer(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/counts/complete-wm-count`, {
    method: 'POST',
    body: queryParams,
  });
}

// 调整
export async function adjustWmCountSer(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/count-records/adjust-wm-count-variance`, {
    method: 'POST',
    body: queryParams,
  });
}

/**
 * @param queryParams
 * @returns
 */
export async function queryCounts(queryParams) {
  return request(`${HLOS_LWMS}/v1/${organizationId}/counts`, {
    method: 'GET',
    query: queryParams,
  });
}
