import request from 'utils/request';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// 获取日历数据
export async function queryCalendar(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-calendars/query-calender`, {
    method: 'GET',
    query: params,
  });
}

// 获取年份数据
export async function queryYearData(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-years`, {
    method: 'GET',
    query: params,
  });
}

// 添加或更新节日
export async function addOrUpdateFestival(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-day-festivals`, {
    method: 'POST',
    body: params,
  });
}

// 删除节日
export async function deleteFestival(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-day-festivals`, {
    method: 'DELETE',
    body: params,
  });
}
