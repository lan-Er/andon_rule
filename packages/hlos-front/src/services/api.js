/*
 * @Description: API Service
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-12-11 9:05:22
 * @Copyright: Copyright(c) 2019, Hand
 * @LastEditors: mingbo.zhang@hand-china.com
 */

import request from 'utils/request';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, getCurrentUserId } from 'utils/utils';
import { HZERO_HFLE } from 'utils/config';

const organizationId = getCurrentOrganizationId();
const userId = getCurrentUserId();

/**
 * 查询Lov数据
 * @param {json} params
 */
export async function queryLovData(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/lovs/sql/data`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 文件删除统一接口
 * @param {long} organizationId
 * @param {string} fileKey
 */
export async function deleteFile(params = {}) {
  const { file, directory } = params;
  const fileKey = file.substr(file.indexOf(directory));
  return request(`${HZERO_HFLE}/v1/${organizationId}/files/delete-by-key`, {
    method: 'DELETE',
    query: {
      fileKey,
      ...params,
    },
  });
}

/**
 * 查询报表相关信息
 * @param {string} reportCode - 报表 Code
 * @param {Object} query - 查询参数
 */
export async function queryReportData(reportCode, query = {}) {
  if (reportCode) {
    return request(`/hrpt/v1/${organizationId}/reports`, {
      method: 'GET',
      query: {
        page: 0,
        size: 10,
        reportCode,
        ...query,
      },
    });
  }
}

/**
 * 查询当前用户默认信息
 */
export async function userSetting(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/user-settings`, {
    method: 'GET',
    query: {
      ...params,
      userId,
      queryCodeFlag: 'Y',
    },
  });
}

/**
 * 查询独立值集
 */
export async function queryIndependentValueSet(params) {
  return request(`/hpfm/v1/${organizationId}/lovs/data`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取默认工厂
 */
export async function queryDefaultMeOu(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/me-ous/lovs/data`, {
    method: 'GET',
    query: params,
  });
}
// 通过目录获取文件
export async function queryFileByDirectory(params) {
  return request(`${HZERO_HFLE}/v1/${organizationId}/files/summary`, {
    method: 'GET',
    query: params,
  });
}
