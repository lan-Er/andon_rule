/*
 * @Description: IQC质检任务看板-api
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2020-10-30 14:05:22
 * @LastEditors: 那宇
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 检验单看板数量
export async function queryBoardAmount(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/board/amount`, {
    method: 'GET',
    query: params,
  });
}

// 检验单检验人统计
export async function queryBoardInspector(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/board/inspector`, {
    method: 'GET',
    query: params,
  });
}

// 检验单IQC已检情况
export async function queryBoardIqcChecked(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/board/iqc-checked`, {
    method: 'GET',
    query: params,
  });
}

// 检验单IQC待检情况
export async function queryBoardIqcPending(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/board/iqc-pending`, {
    method: 'GET',
    query: params,
  });
}

// 检验单PQC已检情况
export async function queryBoardPqcChecked(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/board/pqc-checked`, {
    method: 'GET',
    query: params,
  });
}

// 检验单PQC待检情况
export async function queryBoardPqcPending(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/board/pqc-pending`, {
    method: 'GET',
    query: params,
  });
}
