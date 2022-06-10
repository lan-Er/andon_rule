/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-03-03 14:55:44
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-08 11:23:32
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';

// 创建映射头
export async function createEtlHeader(params) {
  return request(`/letl/v1/${getCurrentOrganizationId()}/mapping-config/change-mapping-header`, {
    method: 'POST',
    body: params,
  });
}
