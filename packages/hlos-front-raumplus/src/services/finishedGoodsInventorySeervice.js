/*
 * @module: 成品库存查询
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-24 15:03:30
 * @LastEditTime: 2021-05-24 18:10:00
 * @copyright: Copyright (c) 2020,Hand
 */
import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

/**
 * @description: 获取打印数据
 * @param {*} queryParams
 * @return {*}
 */
export async function getPrintListService(queryParams) {
  return request(`${HLOS_LWMSS}/v1/${organizationId}/raumplus-print/finished`, {
    method: 'POST',
    body: queryParams,
  });
}
