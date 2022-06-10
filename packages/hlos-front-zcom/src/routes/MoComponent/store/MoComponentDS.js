/**
 * @Description: MO组件DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-27 15:12:25
 */

import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'zcom.moComponent.model';
const commonCode = 'zcom.common.model';
const { moComponent } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const MoComponentDS = () => {
  return {
    selection: false,
    pageSize: 100,
    queryFields: [
      {
        name: 'organzationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: moComponent.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organzationObj.organizationId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organzationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'organizationCode',
        type: 'string',
        bind: 'organzationObj.organizationCode',
        ignore: 'always',
      },
      {
        name: 'moNumObj',
        type: 'object',
        label: intl.get(`${preCode}.moNum`).d('MO号'),
        lovCode: moComponent.moNum,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
        required: true,
      },
      {
        name: 'moId',
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
        name: 'item',
        type: 'string',
        label: intl.get(`${commonCode}.item`).d('物料'),
        bind: 'moNumObj.item',
        ignore: 'always',
      },
      {
        name: 'demandDate',
        type: 'string',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
        bind: 'moNumObj.demandDate',
        ignore: 'always',
      },
      {
        name: 'demandQty',
        type: 'number',
        label: intl.get(`${preCode}.demandQty`).d('需求数量'),
        bind: 'moNumObj.demandQty',
        ignore: 'always',
      },
      {
        name: 'makeQty',
        type: 'number',
        label: intl.get(`${preCode}.makeQty`).d('制造数量'),
        bind: 'moNumObj.makeQty',
        ignore: 'always',
      },
      {
        name: 'moStatus',
        type: 'string',
        label: intl.get(`${preCode}.moStatus`).d('MO状态'),
        lookupCode: moComponent.moStatus,
        bind: 'moNumObj.moStatus',
        ignore: 'always',
      },
      {
        name: 'planStartDate',
        type: 'string',
        label: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
        bind: 'moNumObj.planStartDate',
        ignore: 'always',
      },
      {
        name: 'planEndDate',
        type: 'string',
        label: intl.get(`${preCode}.planEndDate`).d('计划结束时间'),
        bind: 'moNumObj.planEndDate',
        ignore: 'always',
      },
      {
        name: 'bomVersion',
        type: 'string',
        label: intl.get(`${preCode}.bomVersion`).d('BOM版本'),
        bind: 'moNumObj.bomVersion',
        ignore: 'always',
      },
      {
        name: 'moTypeName',
        type: 'object',
        label: intl.get(`${preCode}.moType`).d('MO类型'),
        bind: 'moNumObj.moTypeName',
        ignore: 'always',
      },
      {
        name: 'moFixedStatus',
        type: 'string',
        label: intl.get(`${preCode}.moFixedStatus`).d('维修类型'),
        lookupCode: moComponent.moFixedStatus,
      },
      {
        name: 'moComponentStatusMeaning',
        type: 'string',
        label: intl.get(`${preCode}.moComponentStatusMeaning`).d('维修状态'),
      },
      {
        name: 'componentItemObj',
        type: 'object',
        label: intl.get(`${preCode}.componentItem`).d('组件'),
        lovCode: moComponent.item,
        ignore: 'always',
      },
      {
        name: 'componentItemId',
        type: 'string',
        bind: 'componentItemObj.itemId',
      },
      {
        name: 'componentItemCode',
        type: 'string',
        bind: 'componentItemObj.itemCode',
      },
      {
        name: 'componentDescription',
        type: 'string',
        label: intl.get(`${preCode}.componentDesc`).d('组件描述'),
      },
      {
        name: 'approvalOpinion',
        type: 'string',
        label: intl.get(`${preCode}.approvalOpinion`).d('审批意见'),
      },
    ],
    fields: [
      {
        name: 'moId',
        type: 'string',
      },
      {
        name: 'moNum',
        type: 'string',
      },
      {
        name: 'lineNum',
        type: 'number',
        label: intl.get(`${preCode}.lineNum`).d('行号'),
      },
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.organization`).d('组织'),
        lovCode: moComponent.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organzationObj.organizationId',
      },
      {
        name: 'organizationCode',
        type: 'string',
        bind: 'organzationObj.organizationCode',
      },
      {
        name: 'organization',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'componentItemObj',
        type: 'object',
        label: intl.get(`${preCode}.componentItem`).d('组件'),
        lovCode: moComponent.item,
        ignore: 'always',
        required: true,
      },
      {
        name: 'componentItemId',
        type: 'string',
        bind: 'componentItemObj.itemId',
      },
      {
        name: 'componentItemCode',
        type: 'string',
        bind: 'componentItemObj.itemCode',
      },
      {
        name: 'componentDescription',
        type: 'string',
        bind: 'componentItemObj.description',
        label: intl.get(`${preCode}.componentDesc`).d('组件描述'),
      },
      {
        name: 'operation',
        type: 'string',
        label: intl.get(`${preCode}.operation`).d('工序'),
      },
      {
        name: 'uomName',
        type: 'string',
        label: intl.get(`${preCode}.uomId`).d('单位'),
        bind: 'componentItemObj.uomName',
        ignore: 'always',
      },
      {
        name: 'uomId',
        type: 'string',
        bind: 'componentItemObj.uomId',
      },
      {
        name: 'uom',
        type: 'string',
        bind: 'componentItemObj.uom',
      },
      {
        name: 'demandQty',
        type: 'number',
        label: intl.get(`${preCode}.demandQty`).d('需求数量'),
        required: true,
      },
      {
        name: 'price',
        type: 'number',
        label: intl.get(`${preCode}.price`).d('维修单价'),
      },
      {
        name: 'moFixedStatus',
        type: 'string',
        label: intl.get(`${preCode}.moFixedStatus`).d('维修类型'),
        lookupCode: moComponent.moFixedStatus,
      },
      // {
      //   name: 'approvalOpinion',
      //   type: 'string',
      //   label: intl.get(`${preCode}.approvalOpinion`).d('审批意见'),
      // },
      {
        name: 'demandDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
        format: 'YYYY-MM-DD HH:mm:ss',
        defaultValue: new Date(),
        required: true,
      },
      {
        name: 'componentUsage',
        type: 'string',
        label: intl.get(`${preCode}.usage`).d('单位用量'),
        bind: 'bomUsage',
      },
      {
        name: 'bomUsage',
        type: 'number',
        label: intl.get(`${preCode}.bomUsage`).d('BOM用量'),
        required: true,
        min: 0,
        validator: (value) => {
          if (value === 0) {
            return '请输入不等于0的正数';
          }
        },
      },
      {
        name: 'issuedQty',
        type: 'string',
        label: intl.get(`${preCode}.issuedQty`).d('投料数量'),
      },
      {
        name: 'componentNgQty',
        type: 'string',
        label: intl.get(`${preCode}.componentNgQty`).d('材料不合格'),
      },
      {
        name: 'processScrapedQty',
        type: 'string',
        label: intl.get(`${preCode}.processScrapedQty`).d('加工报废'),
      },
      {
        name: 'backflushQty',
        type: 'string',
        label: intl.get(`${preCode}.backflushQty`).d('倒冲数量'),
      },
      {
        name: 'keyComponentFlag',
        type: 'boolean',
        label: intl.get(`${preCode}.keyComponentFlag`).d('关键标识'),
      },
      {
        name: 'supplyType',
        type: 'string',
        label: intl.get(`${preCode}.supplyType`).d('供应类型'),
        lookupCode: moComponent.supplyType,
      },
      {
        name: 'supplyWarehouseObj',
        label: intl.get(`${preCode}.supplyWarehouse`).d('供应仓库'),
        type: 'object',
        lovCode: moComponent.warehouse,
        ignore: 'always',
        dynamicProps: ({ record }) => {
          if (!isEmpty(record.get('organizationObj'))) {
            return {
              lovPara: {
                organizationId: record.get('organizationObj').organizationId,
              },
            };
          }
        },
      },
      {
        name: 'supplyWarehouse',
        type: 'string',
        bind: 'supplyWarehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'supplyWarehouseCode',
        type: 'string',
        bind: 'supplyWarehouseObj.warehouseCode',
      },
      {
        name: 'supplyWarehouseId',
        type: 'string',
        bind: 'supplyWarehouseObj.warehouseId',
      },
      {
        name: 'supplyWmAreaObj',
        label: intl.get(`${preCode}.supplyWmArea`).d('供应货位'),
        type: 'object',
        lovCode: moComponent.wmArea,
        ignore: 'always',
        dynamicProps: ({ record }) => {
          if (!isEmpty(record.get('supplyWarehouseObj'))) {
            return {
              lovPara: {
                warehouseId: record.get('supplyWarehouseObj').warehouseId,
              },
            };
          }
        },
      },
      {
        name: 'supplyWmArea',
        type: 'string',
        bind: 'supplyWmAreaObj.wmAreaName',
        ignore: 'always',
      },
      {
        name: 'supplyWmAreaCode',
        type: 'string',
        bind: 'supplyWmAreaObj.wmAreaCode',
      },
      {
        name: 'supplyWmAreaId',
        type: 'string',
        bind: 'supplyWmAreaObj.wmAreaId',
      },
      {
        name: 'substitutePolicy',
        type: 'string',
        label: intl.get(`${preCode}.substitutePolicy`).d('替代策略'),
        lookupCode: moComponent.substitutePolicy,
      },
      {
        name: 'substituteGroup',
        type: 'string',
        label: intl.get(`${preCode}.substituteGroup`).d('替代组'),
      },
      {
        name: 'substitutePriority',
        type: 'number',
        label: intl.get(`${preCode}.substitutePriority`).d('替代优先级'),
        min: 0,
        validator: (value) => {
          if (value === 0) {
            return '请输入不等于0的正数';
          }
        },
      },
      {
        name: 'substitutePercent',
        type: 'number',
        label: intl.get(`${preCode}.substitutePercent`).d('替代百分比'),
        min: 0,
        validator: (value) => {
          if (value === 0) {
            return '请输入不等于0的正数';
          }
        },
      },
      {
        name: 'departmentObj',
        label: intl.get(`${preCode}.departmentId`).d('部门'),
        type: 'object',
        lovCode: moComponent.department,
        ignore: 'always',
      },
      {
        name: 'departmentName',
        type: 'string',
        bind: 'departmentObj.departmentName',
        ignore: 'always',
      },
      {
        name: 'departmentId',
        type: 'string',
        bind: 'departmentObj.departmentId',
      },
      {
        name: 'ecnNum',
        type: 'string',
        label: intl.get(`${preCode}.ecnNum`).d('ECN'),
      },
      {
        name: 'specifySupplierObj',
        label: intl.get(`${preCode}.specifySupplier`).d('指定供应商'),
        type: 'object',
        lovCode: moComponent.supplier,
        ignore: 'always',
      },
      {
        name: 'specifySupplierName',
        type: 'string',
        bind: 'specifySupplierObj.partyName',
        ignore: 'always',
      },
      {
        name: 'specifySupplierId',
        type: 'string',
        bind: 'specifySupplierObj.partyId',
      },
      {
        name: 'specifyLotNumber',
        type: 'string',
        label: intl.get(`${preCode}.specifyLotNumber`).d('指定批次'),
      },
      {
        name: 'specifyTagCode',
        type: 'string',
        label: intl.get(`${preCode}.specifyTagCode`).d('指定标签'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
    ],
    events: {
      submitSuccess: ({ dataSet }) => {
        setTimeout(() => {
          dataSet.query();
        }, 1000);
      },
      update: ({ name, record, dataSet }) => {
        if (name === 'demandQty') {
          if (record.get('demandQty') !== null) {
            const make = dataSet.queryDataSet.current.get('makeQty');
            if (make !== null && make !== undefined) {
              const demand = record.get('demandQty');
              const usageFlag = demand / make;
              const usage = Math.round(usageFlag * 1000000) / 1000000;
              record.set('componentUsage', usage);
            } else record.set('componentUsage', null);
          } else record.set('componentUsage', null);
        }
        if (name === 'supplyWarehouseObj') {
          record.set('supplyWmAreaObj', null);
        }
        if (name === 'organizationObj') {
          record.set('componentItemObj', null);
          record.set('operation', null);
          record.set('demandQty', null);
          record.set('demandDate', null);
          record.set('bomUsage', null);
          record.set('issuedQty', null);
          record.set('componentNgQty', null);
          record.set('processScrapedQty', null);
          record.set('backflushQty', null);
          record.set('keyComponentFlag', null);
          record.set('supplyType', null);
          record.set('supplyWarehouseObj', null);
          record.set('substitutePolicy', null);
          record.set('substituteGroup', null);
          record.set('substitutePriority', null);
          record.set('substitutePercent', null);
          record.set('departmentObj', null);
          record.set('ecnNum', null);
          record.set('specifySupplierObj', null);
          record.set('specifyLotNumber', null);
          record.set('specifyTagCode', null);
          record.set('remark', null);
        }
        const {
          supplyType,
          supplyWarehouseId,
          supplyWarehouseCode,
          supplyWarehouseName,
          supplyWmAreaId,
          supplyWmAreaCode,
          supplyWmAreaName,
        } = record.get('componentItemObj') || {};
        if (name === 'componentItemObj') {
          record.set('operation', null);
          record.set('demandQty', null);
          record.set('bomUsage', null);
          record.set('issuedQty', null);
          record.set('componentNgQty', null);
          record.set('processScrapedQty', null);
          record.set('backflushQty', null);
          record.set('keyComponentFlag', null);
          record.set('supplyType', supplyType);
          record.set('supplyWarehouseObj', {
            warehouseId: supplyWarehouseId,
            warehouseCode: supplyWarehouseCode,
            warehouseName: supplyWarehouseName,
          });
          record.set('supplyWmAreaObj', {
            wmAreaId: supplyWmAreaId,
            wmAreaCode: supplyWmAreaCode,
            wmAreaName: supplyWmAreaName,
          });
          record.set('substitutePolicy', null);
          record.set('substituteGroup', null);
          record.set('substitutePriority', null);
          record.set('substitutePercent', null);
          record.set('departmentObj', null);
          record.set('ecnNum', null);
          record.set('specifySupplierObj', null);
          record.set('specifyLotNumber', null);
          record.set('specifyTagCode', null);
          record.set('remark', null);
        }
      },
    },
    transport: {
      read: () => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/mo-components`,
          method: 'GET',
        };
      },
      destroy: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/mo-components`,
          data: data[0],
          method: 'DELETE',
        };
      },
      create: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/mo-components`,
          data: data[0],
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/mo-components`,
          data: {
            ...data[0],
            moFixedStatus: data[0].moFixedStatus || 'MAKE_LOSS',
          },
          method: 'PUT',
        };
      },
    },
  };
};

const Store = createContext();

export default Store;

export const MoComponentProvider = (props) => {
  const { children } = props;
  const dataSet = useMemo(() => new DataSet(MoComponentDS()), []);
  const value = {
    ...props,
    dataSet,
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
