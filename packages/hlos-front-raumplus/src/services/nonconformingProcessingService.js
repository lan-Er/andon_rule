/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-04-12 14:16:01
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-04-16 17:10:21
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
// import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 不合格品处理
// export async function nonconformingProcessApi(params) {
//   // return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/process-inspection-ng`, {
//   return request(`/lmess/v1/${organizationId}/raumplus/inspection-docs/process-inspection-ng`, {
//     method: 'POST',
//     body: params,
//   });
// }

// 获取检验单批次
export async function getInspectionDocLot(params) {
  return request(
    `/lmess/v1/${organizationId}/raumplus/inspection-doc-lots/get-ng-inspection-doc-lot`,
    {
      method: 'POST',
      body: params,
    }
  );
}

// 不合格品提交
export async function submitApi(params) {
  return request(`/lmess/v1/${organizationId}/raumplus/inspection-docs/process-inspection-ng`, {
    method: 'POST',
    body: params,
  });
}
