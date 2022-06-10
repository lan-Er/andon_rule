/**
 * @Description: Bom详情页面--childrenDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-22 12:10:48
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import moment from 'moment';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsBom, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.bom.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/bom-components`;

export default () => ({
  selection: false,
  fields: [
    {
      name: 'bomLineNum',
      type: 'string',
      label: intl.get(`${preCode}.lineNumber`).d('行号'),
      min: 1,
      step: 1,
      required: true,
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.meOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'componentObj',
      type: 'object',
      label: intl.get(`${preCode}.component`).d('组件'),
      lovCode: common.itemMe,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          meOuId: record.get('organizationObj') && record.get('organizationObj').meOuId,
        }),
      },
      required: true,
    },
    {
      name: 'componentItemId',
      type: 'string',
      bind: 'componentObj.itemId',
    },
    {
      name: 'componentItemCode',
      type: 'string',
      bind: 'componentObj.itemCode',
    },
    {
      name: 'componentItemDescription',
      type: 'string',
      label: intl.get(`${preCode}.componentDesc`).d('组件描述'),
      bind: 'componentObj.itemDescription',
    },
    {
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${commonCode}.uom`).d('单位'),
      lovCode: common.uom,
      ignore: 'always',
    },
    {
      name: 'uomId',
      bind: 'uomObj.uomId',
    },
    {
      name: 'uom',
      bind: 'uomObj.uomCode',
    },
    {
      name: 'uomName',
      bind: 'uomObj.uomName',
      ignore: 'always',
    },
    {
      name: 'bomUsage',
      type: 'number',
      label: intl.get(`${preCode}.bomUsage`).d('BOM用量'),
      required: true,
      validator: (value) => {
        // 非零数字 可以为负数
        if (value !== 0) {
          return true;
        } else {
          return intl.get(`${commonCode}.validation.notZero`).d('请输入非0数字');
        }
      },
    },
    {
      name: 'componentShrinkage',
      type: 'number',
      label: intl.get(`${preCode}.shrinkage`).d('损耗率'),
      validator: positiveNumberValidator,
    },
    {
      name: 'operation',
      type: 'string',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'supplyType',
      type: 'string',
      label: intl.get(`${preCode}.supplyType`).d('供应类型'),
      lookupCode: common.supplyType,
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.supplyWarehouse`).d('供应仓库'),
      lovCode: common.warehouse,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'supplyWarehouseName',
      type: 'string',
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'supplyWarehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'supplyWarehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.supplyWmArea`).d('供应货位'),
      lovCode: common.wmArea,
      cascadeMap: { warehouseId: 'supplyWarehouseId' },
      ignore: 'always',
    },
    {
      name: 'supplyWmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'supplyWmAreaCode',
      type: 'string',
      bind: 'wmAreaObj.wmAreaCode',
    },
    {
      name: 'supplyWmAreaName',
      type: 'string',
      bind: 'wmAreaObj.wmAreaName',
    },
    {
      name: 'ecnNum',
      type: 'string',
      label: intl.get(`${preCode}.ecnNum`).d('ECN编号'),
    },
    {
      name: 'substitutePolicy',
      type: 'string',
      label: intl.get(`${preCode}.subPolicy`).d('替代策略'),
      lookupCode: lmdsBom.subPolicy,
    },
    {
      name: 'substituteGroup',
      type: 'string',
      label: intl.get(`${preCode}.subGroup`).d('替代组'),
    },
    {
      name: 'substitutePriority',
      type: 'number',
      label: intl.get(`${preCode}.subPriority`).d('替代优先级'),
      validator: positiveNumberValidator,
    },
    {
      name: 'substitutePercent',
      type: 'number',
      label: intl.get(`${preCode}.subPercent`).d('替代百分比'),
      validator: positiveNumberValidator,
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${commonCode}.startDate`).d('开始日期'),
      required: true,
      defaultValue: NOW_DATE,
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      dynamicProps: ({ record }) => {
        if (record.get('endDate')) {
          return {
            max: 'endDate',
          };
        }
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${commonCode}.endDate`).d('结束日期'),
      min: 'startDate',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
    destroy: ({ data }) => {
      return {
        url,
        data,
        method: 'DELETE',
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      if (name === 'organizationObj') {
        record.set('componentObj', null);
      }
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
      if (name === 'componentObj') {
        record.set('supplyType', record.get('componentObj')?.supplyType);
        record.set('warehouseObj', {
          warehouseName: record.get('componentObj')?.supplyWarehouseName,
          warehouseId: record.get('componentObj')?.supplyWarehouseId,
          warehouseCode: record.get('componentObj')?.supplyWarehouseCode,
        });
        record.set('wmAreaObj', {
          wmAreaName: record.get('componentObj')?.supplyWmAreaName,
          wmAreaId: record.get('componentObj')?.supplyWmAreaId,
          wmAreaCode: record.get('componentObj')?.supplyWmAreaCode,
        });
      }
    },
  },
});
