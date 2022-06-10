/*
 * @Description: API Service
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-12-11 9:05:22
 * @Copyright: Copyright(c) 2019, Hand
 * @LastEditors: Please set LastEditors
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { HZERO_HFLE } from 'utils/config';

const organizationId = getCurrentOrganizationId();

/**
 * 查询质检模板项
 * @param {json} params
 * @param {long} templateId
 */
export async function queryInspectionGroupLines(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/inspection-group-lines`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 规则分配列表信息
 * @param {json} params
 * @param {long} ruleId
 */
export async function queryRuleList(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/rule-assign-values`, {
    method: 'GET',
    query: params,
  });
}

// 待接口确认
export async function queryList(params) {
  return request(`${HZERO_HFLE}/v1/${organizationId}/files/summary`, {
    method: 'GET',
    query: params,
  });
}

export async function queryLovData(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/me-ous/lovs/data`, {
    method: 'GET',
    query: params,
  });
}
