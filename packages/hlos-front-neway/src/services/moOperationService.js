import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// 生成任务工序
export async function generateTaskOperation(data) {
  return request(
    `${HLOS_LMESS}/v1/${organizationId}/neway-mo-operations/generate-neway-mo-operation-task`,
    {
      method: 'POST',
      body: data,
    }
  );
}

// 一键生成工序
export async function fastGenerateTaskOperation(data) {
  return request(
    `${HLOS_LMESS}/v1/${organizationId}/neway-mo-operations/generate-neway-mo-operation-task-by-one-key`,
    {
      method: 'POST',
      body: data,
    }
  );
}
