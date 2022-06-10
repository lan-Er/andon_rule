/**
 * @Description: MO生产退库--Index
 * @Author: tw
 * @Date: 2021-03-25 16:26:00
 * @LastEditors: tw
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';

const { common, lmesMoProductionDestock } = codeConfig.code;

const currentOrganizationId = getCurrentOrganizationId();
const preCode = 'lmes.moProductionDestock.model';
const commonCode = 'lmes.common.model';

const MoProductionDestockListDS = () => {
  return {
    // primaryKey: 'moOperationId',
    // selection: false,
    // paging: false,
    // pageSize: 100,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: lmesMoProductionDestock.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.meOuId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.meOuName',
        ignore: 'always',
      },
      {
        name: 'moNumObj',
        type: 'object',
        label: intl.get(`${preCode}.moNum`).d('MO'),
        lovCode: lmesMoProductionDestock.moNum,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
        multiple: true,
        required: true,
      },
      {
        name: 'moIds',
        type: 'string',
        bind: 'moNumObj.moId',
      },
      {
        name: 'moNum',
        type: 'string',
        bind: 'moNumObj.moNum',
        ignore: 'always',
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${preCode}.tagCode`).d('标签'),
      },
      {
        name: 'lotNumber',
        type: 'string',
        label: intl.get(`${preCode}.lotNumber`).d('批次'),
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${commonCode}.returnWarehouse`).d('退库仓库'),
        lovCode: common.warehouse,
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
        ignore: 'always',
      },
      {
        name: 'warehouseName',
        bind: 'warehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'wmAreaObj',
        type: 'object',
        lovCode: common.wmArea,
        label: intl.get(`${commonCode}.returnWmArea`).d('退库货位'),
        cascadeMap: { warehouseId: 'warehouseId' },
        dynamicProps: {
          lovPara: ({ record }) => ({
            // warehouseId: record.get('warehouseId'),
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'wmAreaId',
        bind: 'wmAreaObj.wmAreaId',
        ignore: 'always',
      },
      {
        name: 'wmAreaName',
        bind: 'wmAreaObj.wmAreaName',
        ignore: 'always',
      },
      {
        name: 'workerObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${preCode}.worker`).d('作业员'),
        ignore: 'always',
        required: true,
      },
      {
        name: 'workerId',
        bind: 'workerObj.workerId',
        ignore: 'always',
      },
      {
        name: 'worker',
        bind: 'workerObj.workerCode',
        ignore: 'always',
      },
      {
        name: 'workerName',
        bind: 'workerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'returnReason',
        type: 'string',
        label: intl.get(`${preCode}.returnReason`).d('退库原因'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${preCode}.remark`).d('备注'),
      },
    ],
    fields: [
      {
        name: 'organization',
        label: intl.get(`${preCode}.organization`).d('组织'),
      },
      {
        name: 'documentNum',
        label: intl.get(`${preCode}.moNum`).d('MO'),
      },
      {
        name: 'itemCode',
        label: intl.get(`${preCode}.item`).d('物料'),
      },
      {
        name: 'description',
      },
      {
        name: 'uomName',
        label: intl.get(`${preCode}.uomName`).d('单位'),
      },
      {
        name: 'returnQty',
        type: 'number',
        label: intl.get(`${preCode}.returnQty`).d('退库数量'),
        min: 0,
        max: 'executedQty',
        validator: positiveNumberValidator,
      },
      {
        name: 'executedQty',
        type: 'number',
        label: intl.get(`${preCode}.executedQty`).d('入库数量'),
      },
      {
        name: 'secondUomName',
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      },
      {
        name: 'secondReturnQty',
        type: 'number',
        label: intl.get(`${preCode}.secondReturnQty`).d('辅助退库数量'),
        min: 0,
        max: 'secondInventoryQty',
        validator: positiveNumberValidator,
      },
      {
        name: 'secondInventoryQty',
        type: 'number',
        label: intl.get(`${preCode}.secondInventoryQty`).d('辅助入库数量'),
        transformResponse: (val, object) =>
          (object.uomConversionValue * object.executedQty).toFixed(6),
      },
      {
        name: 'uomConversionValue',
        type: 'number',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${commonCode}.returnWarehouse`).d('退库仓库'),
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
        label: intl.get(`${commonCode}.returnWmArea`).d('退库货位'),
        dynamicProps: {
          lovPara: ({ record }) => ({
            warehouseId: record.get('warehouseId'),
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
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
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${preCode}.tagCode`).d('标签'),
      },
      {
        name: 'lotNumber',
        type: 'string',
        label: intl.get(`${preCode}.lotNumber`).d('批次'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { moIds, organizationId, itemId, tagCode, lotNumber } = data;
        let moIdsUrl;
        if (moIds) {
          moIdsUrl = `?moIds=${moIds.join('&moIds=')}`;
        }
        return {
          url: `${HLOS_LWMS}/v1/${currentOrganizationId}/execute-lines/query-mo-inventory${moIdsUrl}`,
          method: 'GET',
          data: { organizationId, itemId, tagCode, lotNumber },
        };
      },
      // read: () => {
      //   return {
      //     url: `${HLOS_LWMS}/v1/${currentOrganizationId}/execute-lines/query-mo-inventory`,
      //     method: 'GET',
      //   };
      // },
    },
    events: {
      update: ({ name, record }) => {
        if (name === 'warehouseObj') {
          record.set('wmAreaObj', null);
        } else if (name === 'secondReturnQty' && record.get('uomConversionValue')) {
          record.set(
            'returnQty',
            (record.get('secondReturnQty') / record.get('uomConversionValue')).toFixed(6)
          );
        }
      },
    },
  };
};

export { MoProductionDestockListDS };
