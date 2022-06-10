/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-03-23 10:29:09
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// query list
export async function syncInspectionTemplate(params) {
  return request(
    `${HLOS_LMDS}/v1/${organizationId}/inspection-templates/sync-inspection-template`,
    {
      method: 'POST',
      body: params,
    }
  );
}
