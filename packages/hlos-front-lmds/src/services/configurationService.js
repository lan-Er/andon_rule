/*
 * @Description: 个性化配置 - services
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-09 17:41:38
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-09 17:42:37
 * @Copyright: Copyright (c) 2018, Hand
 */

import request from 'utils/request';
import querystring from 'querystring';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 保存模版
export async function saveTemplate(params) {
  const { data, method } = params;
  return request(`${HLOS_LMDS}/v1/${organizationId}/customization-templates`, {
    method,
    body: data,
  });
}

// 查询分配详情行
export async function queryAssignLine(params) {
  const queryParams = querystring.stringify(params);
  return request(
    `${HLOS_LMDS}/v1/${organizationId}/category-pages/template-detail?${queryParams}`,
    {
      method: 'GET',
    }
  );
}

// 保存分配详情
export async function saveAssignDetail(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/category-pages`, {
    method: 'POST',
    body: params,
  });
}
