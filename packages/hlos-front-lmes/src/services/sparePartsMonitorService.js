/*
 * @Description: API Service
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-12-11 9:05:22
 * @Copyright: Copyright(c) 2019, Hand
 * @LastEditors: TJ
 */

import request from 'utils/request';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

/**
 * 备件监控统计（仓库，车间，其他
 */
export async function countSparePartForMonitor(params) {
  return request(
    `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/spare-parts/countSparePartForMonitor`,
    {
      method: 'POST',
      body: params,
    }
  );
}

/**
 * 备件监控-报废统计
 */
export async function countScrapSparePart(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/spare-parts/countScrapSparePart`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 备件监控-备件类型统计
 */
export async function countSparePartType(params) {
  return request(`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/spare-parts/countSparePartType`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 备件监控-有效日期预警
 */
export async function countSparePartQuantityForEffectiveDay(params) {
  return request(
    `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/spare-parts/countSparePartQuantityForEffectiveDay`,
    {
      method: 'POST',
      body: params,
    }
  );
}

/**
 * 备件监控-数量库存预警
 */
export async function countSparePartQuantityForInventoryWarn(params) {
  return request(
    `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/spare-parts/countSparePartQuantityForInventoryWarn`,
    {
      method: 'POST',
      body: params,
    }
  );
}
