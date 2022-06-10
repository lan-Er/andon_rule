import request from 'utils/request';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 保存、提交物料申请单
export async function vmiApplySave(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/vmi-applys`, {
    method: 'POST',
    body: params,
  });
}

// 批量提交物料申请单
export async function vmiApplysSubmit(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/vmi-applys/batch-release-vmi-apply`, {
    method: 'POST',
    body: params,
  });
}

// 删除物料申请单
export async function vmiApplysDelete(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/vmi-applys`, {
    method: 'DELETE',
    body: params,
  });
}

// 删除物料申请单行
export async function vmiApplyLinesDelete(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/vmi-apply-lines`, {
    method: 'DELETE',
    body: params,
  });
}

// 物料接收
export async function vmiApplyReceive(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZCOM}/v1/${organizationId}/vmi-apply-executes`, {
    method: 'POST',
    body: params,
  });
}
