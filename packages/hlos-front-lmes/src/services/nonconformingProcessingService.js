import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 不合格品处理
export async function nonconformingProcessApi(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-docs/process-inspection-ng`, {
    method: 'POST',
    body: params,
  });
}

// 获取检验单批次
export async function getInspectionDocLot(params) {
  return request(`${HLOS_LMES}/v1/${organizationId}/inspection-doc-lots/getInspectionDocLot`, {
    method: 'POST',
    body: params,
  });
}
