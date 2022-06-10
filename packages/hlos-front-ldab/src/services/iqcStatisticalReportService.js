import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const url = `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/inspection-docs/qc-qualification-rate-statistics-report-bar`;

export async function queryChartData(params) {
  return request(url, {
    method: 'GET',
    query: params,
  });
}
