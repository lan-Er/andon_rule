import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';

/**
 * 保存按钮
 * @param {*} params
 * @returns
 */
export async function changeButton(params) {
  return request(
    `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/jcdq-return-exchange/change-button`,
    {
      method: 'POST',
      body: params,
    }
  );
}

/**
 * 关闭按钮
 * @param {*} params
 * @returns
 */
export async function closeButton(params) {
  return request(
    `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/jcdq-return-exchange/close-button`,
    {
      method: 'PUT',
      body: params,
    }
  );
}

/**
 * 删除按钮
 * @param {*} params
 * @returns
 */
export async function deleteButton(params) {
  return request(
    `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/jcdq-return-exchange/delete-button`,
    {
      method: 'DELETE',
      body: params,
    }
  );
}

/**
 * 质量审核按钮
 * @param {*} params
 * @returns
 */
export async function qualityAuditButton(params) {
  return request(
    `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/jcdq-return-exchange/quality-audit-button`,
    {
      method: 'PUT',
      body: params,
    }
  );
}

/**
 * 仓库执行按钮
 * @param {*} params
 * @returns
 */
export async function warehouseExecuteButton(params) {
  return request(
    `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/jcdq-return-exchange/warehouse-execute-button`,
    {
      method: 'POST',
      body: params,
    }
  );
}

/**
 * 车间执行按钮
 * @param {*} params
 * @returns
 */
export async function workshopExecuteButton(params) {
  return request(
    `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/jcdq-return-exchange/workshop-execute-button`,
    {
      method: 'POST',
      body: params,
    }
  );
}

/**
 * 新增编辑 删除行数据
 * @param {*} params
 * @returns
 */
export async function deleteLineButton(params) {
  return request(
    `${HLOS_LWMSS}/v1/${getCurrentOrganizationId()}/jcdq-return-exchange/delete-line-button`,
    {
      method: 'DELETE',
      body: params,
    }
  );
}
