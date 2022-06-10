/**
 * @Description: 领料执行--捡料ModaltableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-13 14:21:41
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import moment from 'moment';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const commonCode = 'lwms.common.model';

const queryDS = () => {
  return {
    selection: false,
    paging: false,
    queryFields: [
      {
        name: 'organizationId',
      },
      {
        name: 'planDemandDateStart',
        type: 'dateTime',
        format: 'YYYY-MM-DD HH:mm:ss',
        label: '需求日期从',
        transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      },
      {
        name: 'planDemandDateEnd',
        type: 'dateTime',
        format: 'YYYY-MM-DD HH:mm:ss',
        label: '需求日期从至',
        transformRequest: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
      },
      {
        name: 'requestTypeObj',
        type: 'object',
        lovCode: common.documentType,
        lovPara: {
          documentClass: 'WM_REQUEST',
        },
        label: intl.get(`${commonCode}.documentType`).d('单据类型'),
        ignore: 'always',
      },
      {
        name: 'requestTypeId',
        bind: 'requestTypeObj.documentTypeId',
      },
      {
        name: 'requestTypeName',
        bind: 'requestTypeObj.documentTypeName',
      },
      {
        name: 'prodLineObj',
        type: 'object',
        lovCode: common.prodLine,
        label: intl.get(`${commonCode}.prodLine`).d('申领地点'),
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'prodLineId',
        bind: 'prodLineObj.prodLineId',
      },
      {
        name: 'prodLineName',
        bind: 'prodLineObj.resourceName',
      },
      {
        name: 'creatorObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${commonCode}.worker`).d('制单人'),
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'creatorId',
        bind: 'creatorObj.workerId',
      },
      {
        name: 'creatorName',
        bind: 'creatorObj.workerName',
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LWMSS}/v1/${organizationId}/raumplus-request-headers/issue/execute`,
          method: 'GET',
        };
      },
    },
  };
};

const LineDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseId',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'warehouseName',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
    },
    {
      name: 'wmAreaId',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaName',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
    },
  },
});

const DefaultDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: 'LMDS.WM_AREA',
      // ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          categoryCode: 'LC',
          organizationId: record.get('organizationId'),
        }),
      },
    },
    // {
    //   name: 'warehouseId',
    //   bind: 'warehouseObj.warehouseId',
    // },
    // {
    //   name: 'warehouseName',
    //   bind: 'warehouseObj.warehouseName',
    // },
  ],
});

export { queryDS, LineDS, DefaultDS };
