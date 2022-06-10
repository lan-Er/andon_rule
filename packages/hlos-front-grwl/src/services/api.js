/*
 * @module: 广日物流发货单平台
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-20 10:23:46
 * @LastEditTime: 2021-04-21 15:23:09
 * @copyright: Copyright (c) 2020,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 获取物料控制类型
export async function queryItemControlTypeBatch(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/item-wms/get-item-control-type-batch`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取单据类型
 */
export async function queryDocumentType(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/document-types`, {
    method: 'GET',
    query: params,
  });
}
