import request from 'utils/request';
import { HLOS_ZMDC } from 'hlos-front/lib/utils/config';

// 下架平台产品
export async function updateProducts(params) {
  return request(`${HLOS_ZMDC}/v1/products`, {
    method: 'PUT',
    body: params,
  });
}

// 保存平台产品
export async function saveProductVersions(params) {
  return request(`${HLOS_ZMDC}/v1/product-versions`, {
    method: 'POST',
    body: params,
  });
}

// 更新平台产品
export async function updateProductVersions(params) {
  return request(`${HLOS_ZMDC}/v1/product-versions`, {
    method: 'PUT',
    body: params,
  });
}

// 升级平台产品
export async function upgradeProductVersions(params) {
  return request(`${HLOS_ZMDC}/v1/product-versions/upgrade`, {
    method: 'POST',
    body: params,
  });
}

// 查看关联角色
export async function getProductVersionRoles(params) {
  return request(`${HLOS_ZMDC}/v1/product-version-roles`, {
    method: 'GET',
    query: params,
  });
}

// 新增关联角色
export async function saveProductVersionRoles(params) {
  return request(`${HLOS_ZMDC}/v1/product-version-roles`, {
    method: 'POST',
    body: params,
  });
}

// 删除关联角色
export async function deleteProductVersionRoles(params) {
  return request(`${HLOS_ZMDC}/v1/product-version-roles`, {
    method: 'DELETE',
    body: params,
  });
}

// 查看关联菜单
export async function getProductVersionMenus(params) {
  return request(`${HLOS_ZMDC}/v1/productMenus/tree`, {
    method: 'GET',
    query: params,
  });
}

// 获取版本信息
export async function getVersionList(params) {
  return request(`${HLOS_ZMDC}/v1/versions/list`, {
    method: 'GET',
    query: params,
  });
}
