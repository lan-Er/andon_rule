/*
 * @module: 卡片加载功能
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-07 10:08:44
 * @LastEditTime: 2020-12-07 10:09:02
 * @copyright: Copyright (c) 2020,Hand
 */
import request from 'utils/request';
import { getEnvConfig } from 'utils/iocUtils';
// import { isTenantRoleLevel, getCurrentOrganizationId } from 'utils/utils';

const { HZERO_PLATFORM } = getEnvConfig();

/**
 * 请求API前缀
 * @type {string}
 */
const prefix = `${HZERO_PLATFORM}/v1`;

/**
 * 查询当前布局
 * @param {Object} params - 查询参数
 */
export async function workplaceLayoutQuery(params) {
  return request(`${prefix}/dashboard/layout`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 保存当前布局
 * @param {Object} params - 需保存的数据
 */
export async function workplaceLayoutUpdate(params) {
  return request(`${prefix}/dashboard/layout`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询当前角色 所有的卡片
 */
export async function workplaceCardsQuery(params) {
  return request(`${prefix}/dashboard/layout/role-cards`, {
    method: 'GET',
    query: params,
  });
}
