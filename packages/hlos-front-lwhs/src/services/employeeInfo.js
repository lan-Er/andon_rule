import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWHS } from 'hlos-front/lib/utils/config';

// 查询员工信息
export async function employeeInfoSearch(params) {
  return request(
    `${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/customerEmployeeInfo/queryCustomerEmployeeInfo`,
    {
      method: 'POST',
      body: params,
    }
  );
}

// 更新员工状态
export async function employeeStatusUpdate(params) {
  return request(
    `${HLOS_LWHS}/v1/${getCurrentOrganizationId()}/customerEmployeeInfo/updateCustomerEmployeeInfo`,
    {
      method: 'POST',
      body: params,
    }
  );
}
