/**
 * @Description: 生产领料看板--ds
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-06-12 10:28:08
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { raumplusProductionPickingBoard } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'raumplus.productionPickingBoard.model';

const url = `${HLOS_LWMSS}/v1/${organizationId}/raumplus-request-headers/request-dashboard`;

const ListDS = () => ({
  selection: false,
  queryFields: [
    {
      name: 'dashboardType',
      type: 'string',
      label: intl.get(`${preCode}.dashboardType`).d('单据维度'),
      lookupCode: raumplusProductionPickingBoard.kanbanType,
      required: true,
    },
    {
      name: 'projectNum',
      type: 'string',
      label: intl.get(`${preCode}.dlScheme`).d('方案类型'),
      lookupCode: raumplusProductionPickingBoard.dlScheme,
      multiple: true,
      required: true,
      valueField: 'description',
      textField: 'description',
    },
  ],
  fields: [
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${preCode}.documentNum`).d('单据号'),
    },
    {
      name: 'planDemandDate',
      type: 'date',
      label: intl.get(`${preCode}.demandDate`).d('需求日期'),
    },
    {
      name: 'externalNumIng',
      type: 'string',
      label: intl.get(`${preCode}.documentNum`).d('单据号'),
    },
    {
      name: 'planDemandDateIng',
      type: 'date',
      label: intl.get(`${preCode}.demandDate`).d('需求日期'),
    },
    {
      name: 'externalNumEd',
      type: 'string',
      label: intl.get(`${preCode}.documentNum`).d('单据号'),
    },
    {
      name: 'planDemandDateEd',
      type: 'date',
      label: intl.get(`${preCode}.demandDate`).d('需求日期'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { projectNum } = data;
      return {
        url: generateUrlWithGetParam(url, {
          projectNum,
        }),
        data: {
          ...data,
          projectNum: null,
        },
        method: 'GET',
      };
    },
  },
});

export { ListDS };
