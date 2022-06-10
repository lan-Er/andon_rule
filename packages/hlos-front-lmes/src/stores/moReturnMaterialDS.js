/**
 * @Description: MO退料
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-26 14:21:41
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.moReturnMaterial.model';

const ListDS = () => {
  return {
    queryFields: [
      {
        name: 'meOuId',
      },
      {
        name: 'moObj',
        type: 'object',
        lovCode: common.moNum,
        label: 'MO',
        ignore: 'always',
        required: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('meOuId'),
          }),
        },
      },
      {
        name: 'moId',
        bind: 'moObj.moId',
      },
      {
        name: 'moNum',
        bind: 'moObj.moNum',
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mo-components/query-return-mo-item`,
          method: 'GET',
        };
      },
    },
  };
};

const HeaderDS = () => ({
  selection: false,
  paging: false,
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'organizationCode',
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${preCode}.worker`).d('操作工'),
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'workerId',
      bind: 'workerObj.workerId',
    },
    {
      name: 'worker',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'workerName',
      bind: 'workerObj.workerName',
    },
    // {
    //   name: 'workerGroupId',
    //   bind: 'workerObj.workerGroupId',
    // },
    // {
    //   name: 'workerGroup',
    //   bind: 'workerObj.workerGroupCode',
    // },
    {
      name: 'warehouseObj',
      type: 'object',
      lovCode: common.warehouse,
      label: intl.get(`${preCode}.warehouse`).d('仓库'),
      ignore: 'always',
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
      name: 'warehouseCode',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      lovCode: common.wmArea,
      label: intl.get(`${preCode}.wmArea`).d('货位'),
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
    },
    {
      name: 'wmAreaId',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      bind: 'wmAreaObj.wmAreaName',
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

export { ListDS, HeaderDS, LineDS };
