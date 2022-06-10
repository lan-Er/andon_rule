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

// 添加或更新活动
export async function addOrUpdateActivity(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-day-activitys`, {
    method: 'POST',
    body: params,
  });
}

// 删除活动
export async function deleteActivity(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-day-activitys`, {
    method: 'DELETE',
    body: params,
  });
}

// 获取销售实体数据
export async function querySalesEntity(params) {
  const organizationId = getCurrentOrganizationId();
  return request(`${HLOS_ZPLAN}/v1/${organizationId}/plan-sales-entitys`, {
    method: 'GET',
    query: params,
  });
}
