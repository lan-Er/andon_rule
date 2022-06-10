/**
 * @Description: 完工入库--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-09-17 16:47:41
 * @LastEditors: yu.na
 */

import { DataSet } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common, lwmsWipCompletion } = codeConfig.code;

const preCode = 'lwms.materialReturnExecuteion.model';
const commonCode = 'lwms.common.model';

const QueryDS = () => {
  return {
    selection: false,
    autoCreate: true,
    fields: [
      {
        name: 'orgObj',
        type: 'object',
        label: intl.get(`${commonCode}.meOu`).d('工厂'),
        lovCode: common.singleMeOu,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'orgObj.meOuId',
      },
      {
        name: 'organizationCode',
        type: 'string',
        bind: 'orgObj.meOuCode',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'orgObj.meOuName',
        ignore: 'always',
      },
      {
        name: 'prodLineObj',
        type: 'object',
        label: intl.get(`${common}.prodLine`).d('生产线'),
        lovCode: common.prodLine,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'prodLineId',
        type: 'string',
        bind: 'prodLineObj.prodLineId',
      },
      {
        name: 'prodLineCode',
        type: 'string',
        bind: 'prodLineObj.prodLineCode',
      },
      {
        name: 'prodLineName',
        type: 'string',
        bind: 'prodLineObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'workcellObj',
        type: 'object',
        label: intl.get(`${common}.workcell`).d('工位'),
        lovCode: common.workcell,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
            prodLineId: record.get('prodLineId'),
          }),
        },
      },
      {
        name: 'workcellId',
        type: 'string',
        bind: 'workcellObj.workcellId',
      },
      {
        name: 'workcellCode',
        type: 'string',
        bind: 'workcellObj.workcellCode',
      },
      {
        name: 'workcellName',
        type: 'string',
        bind: 'workcellObj.workcellName',
        ignore: 'always',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        required: true,
        clearButton: false,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'warehouseId',
        type: 'string',
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'warehouseCode',
        type: 'string',
        bind: 'warehouseObj.warehouseCode',
      },
      {
        name: 'warehouseName',
        type: 'string',
        bind: 'warehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'wmAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
        lovCode: common.wmArea,
        ignore: 'always',
        cascadeMap: { warehouseId: 'warehouseId', organizationId: 'organizationId' },
        // dynamicProps: {
        //   lovPara: ({ record }) => ({
        //     warehouseId: record.get('warehouseId'),
        //     organizationId: record.get('organizationId'),
        //   }),
        // },
      },
      {
        name: 'wmAreaId',
        type: 'string',
        bind: 'wmAreaObj.wmAreaId',
      },
      {
        name: 'wmAreaCode',
        type: 'string',
        bind: 'wmAreaObj.wmAreaCode',
      },
      {
        name: 'wmAreaName',
        type: 'string',
        bind: 'wmAreaObj.wmAreaName',
        ignore: 'always',
      },
      {
        name: 'documentClass',
        type: 'string',
        label: intl.get(`${preCode}.documentClass`).d('单据类型'),
        lookupCode: lwmsWipCompletion.documentClass,
        defaultValue: 'MO',
      },
      {
        name: 'documentObj',
        type: 'object',
        label: intl.get(`${preCode}.documentNumber`).d('单据号'),
        ignore: 'always',
        dynamicProps: {
          lovCode: ({ record }) => {
            if (record.get('documentClass') === 'MO') {
              return common.mo;
            } else {
              return common.task;
            }
          },
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'sourceDocId',
        type: 'string',
        dynamicProps: {
          bind: ({ record }) => {
            if (record.get('documentClass') === 'MO') {
              return 'documentObj.moId';
            } else {
              return 'documentObj.taskId';
            }
          },
        },
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        dynamicProps: {
          bind: ({ record }) => {
            if (record.get('documentClass') === 'MO') {
              return 'documentObj.moNum';
            } else {
              return 'documentObj.taskNum';
            }
          },
        },
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        ignore: 'always',
        lovCode: common.itemWm,
        dynamicProps: {
          lovPara: ({ record }) => ({
            itemControlType: record.get('itemControlType'),
          }),
        },
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'itemObj.itemId',
      },
      {
        name: 'itemCode',
        type: 'string',
        bind: 'itemObj.itemCode',
      },
      {
        name: 'description',
        type: 'string',
        bind: 'itemObj.description',
      },
      {
        name: 'uomId',
        type: 'string',
        bind: 'itemObj.uomId',
      },
      {
        name: 'uom',
        type: 'string',
        bind: 'itemObj.uom',
      },
      {
        name: 'uomName',
        type: 'string',
        bind: 'itemObj.uomName',
      },
      {
        name: 'inputNum',
      },
      {
        name: 'defaultOrgId',
      },
      {
        name: 'itemControlType',
        defaultValue: 'QUANTITY',
      },
    ],
    events: {
      update: ({ name, record }) => {
        if (name === 'orgObj') {
          record.set('prodLineObj', null);
          record.set('warehouseObj', null);
        }
        if (name === 'prodLineObj') {
          record.set('workcellObj', null);
        }
        if (name === 'warehouseObj') {
          record.set('wmAreaObj', null);
        }
        if (name === 'documentClass') {
          record.set('documentObj', null);
        }
      },
    },
  };
};
const queryDS = new DataSet(QueryDS());

export { queryDS };
