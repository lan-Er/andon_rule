import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();

// query list
export async function queryCalendar({ month }) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/calendars?month=${month}`, {
    method: 'get',
  });
}

// query detail
export async function queryCalendarDetail({ month, calendarId }) {
  return request(
    `${HLOS_LMDS}/v1/${organizationId}/calendars/detail?month=${month}&calendarId=${calendarId}`,
    {
      method: 'get',
    }
  );
}

// query year detail
export async function queryCalendarYearDetail({ year, calendarId }) {
  return request(
    `${HLOS_LMDS}/v1/${organizationId}/calendars/detail/year?year=${year}&calendarId=${calendarId}`,
    {
      method: 'GET',
    }
  );
}

export async function copyCalendar(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/calendars/copy`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteCalendar(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/calendars`, {
    method: 'DELETE',
    body: params,
  });
}

export async function initializeShift(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/calendar-shifts/init`, {
    method: 'POST',
    body: params,
  });
}

export async function copyCalendarDate(params) {
  return request(`${HLOS_LMDS}/v1/${organizationId}/calendars/copy-date`, {
    method: 'POST',
    body: params,
  });
}
