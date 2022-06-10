/*
 * @module-:晨会看板配置
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-16 16:21:54
 * @LastEditTime: 2020-11-16 16:47:54
 * @copyright: Copyright (c) 2018,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LCSV } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
// 提交晨会看板图片
export async function saveDashboardImg(params) {
  return request(`${HLOS_LCSV}/v1/${organizationId}/dashboard/save-image`, {
    method: 'POST',
    body: params,
  });
}
