import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWHS } from 'hlos-front/lib/utils/config';

// 查询分组
export async function groupSearch(params) {
  return request(
    `${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/category/queryCategory?categoryType=${
      params.categoryType
    }&page=${params.page}&size=${params.size}`,
    {
      method: 'POST',
      body: {},
    }
  );
}

// 新增或更新分组
export async function groupOperate(params) {
  return request(`${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/category/insertOrUpdate`, {
    method: 'POST',
    body: params,
  });
}

// 删除分组
export async function groupDelete(params) {
  return request(`${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/category/deleteCategory`, {
    method: 'POST',
    body: params,
  });
}

// 分组排序
export async function groupSort(params) {
  return request(`${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/category/sort`, {
    method: 'POST',
    body: params,
  });
}
