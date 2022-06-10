/**
 * @Description: MO工作台管理信息--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-08 10:28:08
 * @LastEditors: yu.na
 */

import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesMoWorkspace } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.moWorkspace.model';
const commonCode = 'lmes.common.model';

const MoQueryDS = () => {
  return {
    selection: false,
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'ownerOrganizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'moNumObj',
        type: 'object',
        label: intl.get(`${preCode}.moNum`).d('MO号'),
        lovCode: common.moNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
          }),
        },
      },
      {
        name: 'moId',
        type: 'string',
        bind: 'moNumObj.moId',
        ignore: 'always',
      },
      {
        name: 'moNum',
        type: 'string',
        bind: 'moNumObj.moNum',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
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
        ignore: 'always',
      },
      {
        name: 'moStatus',
        type: 'string',
        label: intl.get(`${preCode}.moStatus`).d('MO状态'),
        lookupCode: lmesMoWorkspace.moStatus,
        multiple: true,
        defaultValue: ['NEW', 'RELEASED', 'PLANNED', 'PENDING'],
      },
      {
        name: 'meAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.meArea`).d('车间'),
        lovCode: common.meArea,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
          }),
        },
      },
      {
        name: 'meAreaId',
        type: 'string',
        bind: 'meAreaObj.meAreaId',
      },
      {
        name: 'meAreaName',
        type: 'string',
        bind: 'meAreaObj.meAreaName',
        ignore: 'always',
      },
      {
        name: 'prodLineObj',
        type: 'object',
        label: intl.get(`${preCode}.prodLine`).d('生产线'),
        lovCode: common.prodLine,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
          }),
        },
      },
      {
        name: 'prodLineId',
        type: 'string',
        bind: 'prodLineObj.prodLineId',
      },
      {
        name: 'prodLineName',
        type: 'string',
        bind: 'prodLineObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'equipmentObj',
        type: 'object',
        label: intl.get(`${preCode}.equipment`).d('设备'),
        lovCode: common.equipment,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('ownerOrganizationId'),
          }),
        },
      },
      {
        name: 'equipmentId',
        type: 'string',
        bind: 'equipmentObj.equipmentId',
      },
      {
        name: 'equipmentName',
        type: 'string',
        bind: 'equipmentObj.equipmentName',
        ignore: 'always',
      },
      {
        name: 'moTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.moType`).d('MO类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'MO' },
        ignore: 'always',
      },
      {
        name: 'moTypeId',
        type: 'string',
        bind: 'moTypeObj.documentTypeId',
      },
      {
        name: 'moTypeCode',
        type: 'string',
        bind: 'moTypeObj.documentTypeCode',
        ignore: 'always',
      },
      {
        name: 'soObj',
        type: 'object',
        label: intl.get(`${preCode}.salesOrder`).d('销售订单'),
        lovCode: common.soNum,
        ignore: 'always',
      },
      {
        name: 'soId',
        type: 'string',
        bind: 'soObj.soHeaderId',
      },
      {
        name: 'soNum',
        type: 'string',
        bind: 'soObj.soHeaderNumber',
      },
      {
        name: 'demandObj',
        type: 'object',
        label: intl.get(`${preCode}.demandOrder`).d('需求订单'),
        lovCode: common.demandNum,
        ignore: 'always',
      },
      {
        name: 'demandId',
        type: 'string',
        bind: 'demandObj.demandId',
      },
      {
        name: 'demandNum',
        type: 'string',
        bind: 'demandObj.demandNumber',
      },
      {
        name: 'customerName',
        label: intl.get(`${preCode}.customer`).d('客户'),
      },
      {
        name: 'projectNum',
        label: intl.get(`${preCode}.projectNum`).d('项目号'),
      },
      {
        name: 'sourceDocObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        lovCode: common.document,
        ignore: 'always',
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'sourceDocObj.documentId',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'sourceDocObj.documentNum',
      },
      {
        name: 'externalNum',
        label: intl.get(`${preCode}.externalNum`).d('外部单据号'),
      },
      {
        name: 'categoryObj',
        type: 'object',
        label: intl.get(`${preCode}.category`).d('类别'),
        lovCode: common.categories,
        lovPara: { categorySet: 'ITEM_ME' },
        ignore: 'always',
      },
      {
        name: 'categoryId',
        type: 'string',
        bind: 'categoryObj.categoryId',
      },
      {
        name: 'categoryName',
        type: 'string',
        bind: 'categoryObj.categoryName',
      },
      // {
      //   name: 'mtoExploredFlag',
      //   label: intl.get(`${preCode}.mtoExplored`).d('按单分解'),
      //   defaultValue: 0,
      //   trueValue: 1,
      //   falseValue: 0,
      // },
      {
        name: 'mtoExploredFlag',
        type: 'string',
        label: intl.get(`${preCode}.mtoExplored`).d('按单分解'),
        lookupCode: common.flag,
      },
      {
        name: 'demandDateStart',
        type: 'date',
        label: intl.get(`${preCode}.startDemandDate`).d('需求日期>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('demandDateEnd')) {
              return 'demandDateEnd';
            }
          },
        },
      },
      {
        name: 'demandDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.endDemandDate`).d('需求日期<='),
        min: 'demandDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'topMoNum',
        type: 'string',
        label: intl.get(`${preCode}.topMo`).d('顶层MO'),
      },
      {
        name: 'parentMoNums',
        type: 'string',
        label: intl.get(`${preCode}.parentMos`).d('父MO'),
      },
      {
        name: 'planStartDateLeft',
        type: 'time',
        label: intl.get(`${preCode}.startPlanDate`).d('计划开始时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('planStartDateRight')) {
              return 'planStartDateRight';
            }
          },
        },
      },
      {
        name: 'planStartDateRight',
        type: 'time',
        label: intl.get(`${preCode}.endPlanDate`).d('计划开始时间<='),
        min: 'planStartDateLeft',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'planEndDateLeft',
        type: 'time',
        label: intl.get(`${preCode}.planEndDateLeft`).d('计划结束时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('planEndDateRight')) {
              return 'planEndDateRight';
            }
          },
        },
      },
      {
        name: 'planEndDateRight',
        type: 'time',
        label: intl.get(`${preCode}.planEndDateRight`).d('计划结束时间<='),
        min: 'planEndDateLeft',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
    ],
  };
};

const MoListDS = () => {
  return {
    selection: 'multiple',
    pageSize: 100,
    transport: {
      read: ({ data }) => {
        const { moStatus: moStatusList } = data;
        return {
          url: generateUrlWithGetParam(`${HLOS_LMES}/v1/${organizationId}/mos`, {
            moStatusList,
          }),
          data: {
            ...data,
            moStatus: undefined,
          },
          method: 'GET',
        };
      },
    },
  };
};

const DetailExecuteDS = () => {
  return {
    selection: false,
    fields: [
      { name: 'organizationId' },
      {
        name: 'meOuObj',
        type: 'object',
        label: intl.get(`${preCode}.meOu`).d('工厂'),
        lovCode: common.meOu,
        ignore: 'always',
      },
      {
        name: 'meOuId',
        bind: 'meOuObj.meOuId',
      },
      {
        name: 'meOuCode',
        bind: 'meOuObj.meOuCode',
      },
      {
        name: 'meOuName',
        bind: 'meOuObj.organizationName',
      },
      {
        name: 'meAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.meArea`).d('车间'),
        lovCode: common.meArea,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'meAreaId',
        type: 'string',
        bind: 'meAreaObj.meAreaId',
      },
      {
        name: 'meAreaCode',
        type: 'string',
        bind: 'meAreaObj.meAreaCode',
      },
      {
        name: 'meAreaName',
        type: 'string',
        bind: 'meAreaObj.meAreaName',
      },
      {
        name: 'prodLineObj',
        label: intl.get(`${preCode}.prodLine`).d('生产线'),
        type: 'object',
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
      },
      {
        name: 'equipmentObj',
        type: 'object',
        label: intl.get(`${preCode}.equipment`).d('设备'),
        lovCode: common.equipment,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'equipmentId',
        type: 'string',
        bind: 'equipmentObj.equipmentId',
      },
      {
        name: 'equipmentCode',
        type: 'string',
        bind: 'equipmentObj.equipmentCode',
      },
      {
        name: 'equipmentName',
        type: 'string',
        bind: 'equipmentObj.equipmentName',
      },
      {
        name: 'workcellObj',
        type: 'object',
        label: intl.get(`${preCode}.workcell`).d('工位'),
        lovCode: common.workcell,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
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
      },
      {
        name: 'workerGroupObj',
        type: 'object',
        label: intl.get(`${preCode}.workGroup`).d('班组'),
        lovCode: common.workerGroup,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'workerGroupId',
        type: 'string',
        bind: 'workerGroupObj.workerGroupId',
      },
      {
        name: 'workerGroup',
        type: 'string',
        bind: 'workerGroupObj.workerGroupCode',
      },
      {
        name: 'workerGroupName',
        type: 'string',
        bind: 'workerGroupObj.workerGroupName',
      },
      {
        name: 'workerObj',
        type: 'object',
        label: intl.get(`${preCode}.worker`).d('操作工'),
        lovCode: common.worker,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'workerId',
        type: 'string',
        bind: 'workerObj.workerId',
      },
      {
        name: 'worker',
        type: 'string',
        bind: 'workerObj.workerCode',
      },
      {
        name: 'workerName',
        type: 'string',
        bind: 'workerObj.workerName',
      },
      {
        name: 'executeStatus',
        type: 'string',
        label: intl.get(`${preCode}.executeStatus`).d('执行状态'),
        lookupCode: lmesMoWorkspace.executeStatus,
      },
      {
        name: 'completeWarehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.completeWarehouse`).d('完工仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'completeWarehouseId',
        type: 'string',
        bind: 'completeWarehouseObj.warehouseId',
      },
      {
        name: 'completeWarehouseCode',
        type: 'string',
        bind: 'completeWarehouseObj.warehouseCode',
      },
      {
        name: 'completeWarehouseName',
        type: 'string',
        bind: 'completeWarehouseObj.warehouseName',
      },
      {
        name: 'completeWmAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.completeWmArea`).d('完工货位'),
        lovCode: common.wmArea,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            warehouseId: record.get('completeWarehouseId'),
          }),
        },
      },
      {
        name: 'completeWmAreaId',
        type: 'string',
        bind: 'completeWmAreaObj.wmAreaId',
      },
      {
        name: 'completeWmAreaCode',
        type: 'string',
        bind: 'completeWmAreaObj.wmAreaCode',
      },
      {
        name: 'completeWmAreaName',
        type: 'string',
        bind: 'completeWmAreaObj.wmAreaName',
      },
      {
        name: 'inventoryWarehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.inventoryWarehouse`).d('入库仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'inventoryWarehouseId',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseId',
      },
      {
        name: 'inventoryWarehouseCode',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseCode',
      },
      {
        name: 'inventoryWarehouseName',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseName',
      },
      {
        name: 'inventoryWmAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.inventoryWmArea`).d('入库货位'),
        lovCode: common.wmArea,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            warehouseId: record.get('inventoryWarehouseId'),
          }),
        },
      },
      {
        name: 'inventoryWmAreaId',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaId',
      },
      {
        name: 'inventoryWmAreaCode',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaCode',
      },
      {
        name: 'inventoryWmAreaName',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaName',
      },
      {
        name: 'completedQty',
        label: intl.get(`${preCode}.completedQty`).d('完工数量'),
      },
      {
        name: 'inventoryQty',
        label: intl.get(`${preCode}.inventoryQty`).d('入库数量'),
      },
      {
        name: 'scrappedQty',
        label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      },
      {
        name: 'reworkQty',
        label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      },
      {
        name: 'processNgQty',
        label: intl.get(`${preCode}.processNgQty`).d('不合格数量'),
      },
      {
        name: 'pendingQty',
        label: intl.get(`${preCode}.pendingQty`).d('待定数量'),
      },
      {
        name: 'inputQty',
        label: intl.get(`${preCode}.inputQty`).d('投料数量'),
      },
      {
        name: 'processedTime',
        label: intl.get(`${preCode}.processedTime`).d('加工时长'),
      },
      {
        name: 'actualStartTime',
        label: intl.get(`${preCode}.actualStartTime`).d('实际开始时间'),
      },
      {
        name: 'actualEndTime',
        label: intl.get(`${preCode}.actualEndTime`).d('实际结束时间'),
      },
      {
        name: 'packingRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.packingRule`).d('包装规则'),
        lovCode: common.rule,
        ignore: 'always',
        lovPara: {
          ruleType: 'PACKING',
        },
      },
      {
        name: 'packingRuleId',
        type: 'string',
        bind: 'packingRuleObj.ruleId',
      },
      {
        name: 'packingRuleName',
        type: 'string',
        bind: 'packingRuleObj.ruleName',
      },
      {
        name: 'packingRule',
        type: 'string',
        bind: 'packingRuleObj.ruleJson',
      },
      {
        name: 'packingRuleObject',
        type: 'object',
      },
      {
        name: 'reworkRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.reworkRule`).d('返修规则'),
        lovCode: common.rule,
        ignore: 'always',
        lovPara: {
          ruleType: 'REWORK',
        },
      },
      {
        name: 'reworkRuleId',
        type: 'string',
        bind: 'reworkRuleObj.ruleId',
      },
      {
        name: 'reworkRuleName',
        type: 'string',
        bind: 'reworkRuleObj.ruleName',
      },
      {
        name: 'reworkRule',
        type: 'string',
        bind: 'reworkRuleObj.ruleJson',
      },
      {
        name: 'reworkRuleObject',
        type: 'object',
      },
      {
        name: 'dispatchRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.dispatchRule`).d('派工规则'),
        lovCode: common.rule,
        ignore: 'always',
        lovPara: {
          ruleType: 'DISPATCH',
        },
      },
      {
        name: 'dispatchRuleId',
        type: 'string',
        bind: 'dispatchRuleObj.ruleId',
      },
      {
        name: 'dispatchRuleName',
        type: 'string',
        bind: 'dispatchRuleObj.ruleName',
      },
      {
        name: 'dispatchRule',
        type: 'string',
        bind: 'dispatchRuleObj.ruleJson',
      },
      {
        name: 'dispatchRuleObject',
        type: 'object',
      },
      {
        name: 'executeRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.executeRule`).d('执行规则'),
        lovCode: common.rule,
        ignore: 'always',
        lovPara: {
          ruleType: 'EXECUTE',
        },
      },
      {
        name: 'executeRuleId',
        type: 'string',
        bind: 'executeRuleObj.ruleId',
      },
      {
        name: 'executeRuleName',
        type: 'string',
        bind: 'executeRuleObj.ruleName',
      },
      {
        name: 'executeRule',
        type: 'string',
        bind: 'executeRuleObj.ruleJson',
      },
      {
        name: 'executeRuleObject',
        type: 'object',
      },
      {
        name: 'inspectionRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.inspectionRule`).d('检验规则'),
        lovCode: common.rule,
        ignore: 'always',
        lovPara: {
          ruleType: 'INSPECTION',
        },
      },
      {
        name: 'inspectionRuleId',
        type: 'string',
        bind: 'inspectionRuleObj.ruleId',
      },
      {
        name: 'inspectionRuleName',
        type: 'string',
        bind: 'inspectionRuleObj.ruleName',
      },
      {
        name: 'inspectionRule',
        type: 'string',
        bind: 'inspectionRuleObj.ruleJson',
      },
      {
        name: 'inspectionRuleObject',
        type: 'object',
      },
      {
        name: 'completeControlType',
        type: 'string',
        label: intl.get(`${preCode}.completeControlType`).d('完工限制类型'),
        lookupCode: lmesMoWorkspace.completeControlType,
      },
      {
        name: 'completeControlValue',
        type: 'string',
        label: intl.get(`${preCode}.completeControlValue`).d('完工限制值'),
      },
      {
        name: 'printedFlag',
        type: 'boolean',
        label: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mo-executes`,
          method: 'GET',
        };
      },
    },
    events: {
      update: ({ name, record }) => {
        // const dispatchRuleObj = record.get('dispatchRuleObj');
        // const executeRuleObj = record.get('executeRuleObj');
        // const inspectionRuleObj = record.get('inspectionRuleObj');
        // const packingRuleObj = record.get('packingRuleObj');
        // const reworkRuleObj = record.get('reworkRuleObj');
        if (name === 'completeWarehouseObj') {
          record.set('completeWmAreaObj', null);
        }
        if (name === 'inventoryWarehouseObj') {
          record.set('inventoryWmAreaObj', null);
        }
        if (name === 'meOuObj') {
          record.set('meAreaObj', null);
          record.set('prodLineObj', null);
          record.set('workcellObj', null);
          record.set('equipmentObj', null);
          record.set('workerGroupObj', null);
          record.set('workerObj', null);
          record.set('completeWarehouseObj', null);
          record.set('completeWmAreaObj', null);
          record.set('inventoryWarehouseObj', null);
          record.set('inventoryWmAreaObj', null);
        }
        // if (name === 'dispatchRuleObj' && dispatchRuleObj && dispatchRuleObj.ruleJson) {
        //   record.set('dispatchRuleObject', JSON.parse(dispatchRuleObj.ruleJson));
        // }
        // if (name === 'executeRuleObj' && executeRuleObj && executeRuleObj.ruleJson) {
        //   record.set('executeRuleObject', JSON.parse(executeRuleObj.ruleJson));
        // }
        // if (name === 'inspectionRuleObj' && inspectionRuleObj && inspectionRuleObj.ruleJson) {
        //   record.set('inspectionRuleObject', JSON.parse(inspectionRuleObj.ruleJson));
        // }
        // if (name === 'packingRuleObj' && packingRuleObj && packingRuleObj.ruleJson) {
        //   record.set('packingRuleObject', JSON.parse(packingRuleObj.ruleJson));
        // }
        // if (name === 'reworkRuleObj' && reworkRuleObj && reworkRuleObj.ruleJson) {
        //   record.set('reworkRuleObject', JSON.parse(reworkRuleObj.ruleJson));
        // }
      },
    },
  };
};

const MoDetailDS = () => {
  return {
    selection: false,
    primaryKey: 'moId',
    children: {
      moExecute: new DataSet(DetailExecuteDS()),
    },
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'ownerOrganizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'ownerOrganizationCode',
        type: 'string',
        bind: 'organizationObj.organizationCode',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'moTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.moType`).d('MO类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'MO' },
        ignore: 'always',
        required: true,
      },
      {
        name: 'moTypeId',
        type: 'string',
        bind: 'moTypeObj.documentTypeId',
      },
      {
        name: 'moTypeCode',
        type: 'string',
        bind: 'moTypeObj.documentTypeCode',
      },
      {
        name: 'moTypeName',
        type: 'string',
        bind: 'moTypeObj.documentTypeName',
      },
      {
        name: 'docProcessRuleObject',
        type: 'object',
      },
      {
        name: 'moNum',
        label: intl.get(`${preCode}.moNum`).d('MO号'),
      },
      {
        name: 'moStatus',
        type: 'string',
        label: intl.get(`${preCode}.moStatus`).d('MO状态'),
        lookupCode: lmesMoWorkspace.moStatus,
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
        required: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            meOuId: record.get('ownerOrganizationId'),
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
        name: 'itemDescription',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        bind: 'itemObj.description',
      },
      {
        name: 'uomObj',
        type: 'object',
        label: intl.get(`${preCode}.uom`).d('单位'),
        lovCode: common.uom,
        ignore: 'always',
        required: true,
      },
      {
        name: 'uomId',
        type: 'string',
        bind: 'uomObj.uomId',
      },
      {
        name: 'uom',
        type: 'string',
        bind: 'uomObj.uomCode',
      },
      {
        name: 'uomName',
        type: 'string',
        bind: 'uomObj.uomName',
      },
      {
        name: 'demandQty',
        type: 'number',
        label: intl.get(`${preCode}.demandQty`).d('需求数量'),
        required: true,
      },
      {
        name: 'demandDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        required: true,
      },
      {
        name: 'planStartDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.planStartDate`).d('计划开始时间'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('planEndDate')) {
              return 'planEndDate';
            }
          },
        },
      },
      {
        name: 'planEndDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.planEndDate`).d('计划结束时间'),
        min: 'planStartDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'itemCategoryObj',
        type: 'object',
        label: intl.get(`${preCode}.itemCategory`).d('物料类别'),
        lovCode: common.categories,
        lovPara: { categorySet: 'ITEM_ME' },
        ignore: 'always',
      },
      {
        name: 'itemCategoryId',
        type: 'string',
        bind: 'itemCategoryObj.categoryId',
      },
      {
        name: 'itemCategoryCode',
        type: 'string',
        bind: 'itemCategoryObj.categoryCode',
      },
      {
        name: 'itemCategoryName',
        type: 'string',
        bind: 'itemCategoryObj.categoryName',
      },
      {
        name: 'bomObj',
        type: 'object',
        label: intl.get(`${preCode}.bomVersion`).d('BOM版本'),
        lovCode: common.bom,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            itemId: record.get('itemId'),
          }),
        },
      },
      {
        name: 'bomId',
        type: 'string',
        bind: 'bomObj.bomId',
      },
      {
        name: 'bomVersion',
        type: 'string',
        bind: 'bomObj.bomVersion',
      },
      {
        name: 'routingObj',
        type: 'object',
        label: intl.get(`${preCode}.routingVersion`).d('工艺版本'),
        lovCode: common.routing,
        ignore: 'always',
      },
      {
        name: 'routingId',
        type: 'string',
        bind: 'routingObj.routingId',
      },
      {
        name: 'routingVersion',
        type: 'string',
        bind: 'routingObj.routingVersion',
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${preCode}.customer`).d('客户'),
        lovCode: common.customer,
        textField: 'customerName',
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerNumber',
        type: 'string',
        bind: 'customerObj.customerNumber',
      },
      {
        name: 'customerName',
        type: 'string',
        bind: 'customerObj.customerName',
      },
      {
        name: 'demandObj',
        type: 'object',
        label: intl.get(`${preCode}.demandOrder`).d('需求订单'),
        lovCode: common.demandNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            itemId: record.get('itemId'),
          }),
        },
      },
      {
        name: 'demandId',
        type: 'string',
        bind: 'demandObj.demandId',
      },
      {
        name: 'demandNum',
        type: 'string',
        bind: 'demandObj.demandNumber',
      },
      {
        name: 'soNum',
        type: 'string',
        label: intl.get(`${preCode}.so`).d('销售订单'),
        bind: 'demandObj.soNum',
      },
      {
        name: 'soLineNum',
        type: 'string',
        label: intl.get(`${preCode}.soLine`).d('销售订单行'),
        bind: 'demandObj.soLineNum',
      },
      {
        name: 'demandRank',
        type: 'string',
        label: intl.get(`${preCode}.demandRank`).d('需求等级'),
        lookupCode: lmesMoWorkspace.demandRank,
      },
      {
        name: 'projectNum',
        type: 'string',
        label: intl.get(`${preCode}.projectNum`).d('项目号'),
      },
      {
        name: 'executePriority',
        label: intl.get(`${preCode}.priority`).d('优先级'),
      },
      {
        name: 'wbsNum',
        type: 'string',
        label: intl.get(`${preCode}.wbsNum`).d('WBS号'),
      },
      {
        name: 'moLotNumber',
        type: 'string',
        label: intl.get(`${preCode}.lotNumber`).d('生产批次'),
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${preCode}.tagCode`).d('生产标签'),
      },
      {
        name: 'mtoFlag',
        type: 'boolean',
        label: intl.get(`${preCode}.mto`).d('按单生产'),
      },
      {
        name: 'parentMoNums',
        label: intl.get(`${preCode}.parentMos`).d('父级MO'),
      },
      {
        name: 'topMoNum',
        label: intl.get(`${preCode}.topMo`).d('顶层MO'),
      },
      {
        name: 'mtoExploredFlag',
        label: intl.get(`${preCode}.mtoExplored`).d('按单分解'),
      },
      {
        name: 'releaseInfo',
        type: 'string',
        label: intl.get(`${preCode}.releaseInfo`).d('下达信息'),
        transformResponse: (val, object) =>
          `${object.releasedBy} ${object.releasedDate}`.replace(/undefined/g, ' '),
      },
      {
        name: 'closeInfo',
        type: 'string',
        label: intl.get(`${preCode}.closeInfo`).d('关闭信息'),
        transformResponse: (val, object) =>
          `${object.closedBy} ${object.closedDate}`.replace(/undefined/g, ' '),
      },
      {
        name: 'moWarnningFlag',
        type: 'boolean',
        label: intl.get(`${preCode}.moWarnning`).d('MO警告'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mos`,
          method: 'GET',
        };
      },
      create: ({ data }) => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mos`,
          data: {
            ...data[0],
            moExecute: data[0].moExecute[0] || {},
          },
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/mos`,
          data: {
            ...data[0],
            moExecute: data[0].moExecute[0] || {},
          },
          method: 'PUT',
        };
      },
    },
    events: {
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
      update: ({ name, record }) => {
        const moTypeObj = record.get('moTypeObj');
        if (name === 'moTypeObj' && !isEmpty(moTypeObj) && moTypeObj.docProcessRule) {
          record.set('docProcessRuleObject', JSON.parse(moTypeObj.docProcessRule));
        }
      },
    },
  };
};

const Store = createContext();

export default Store;

export const MoProvider = (props) => {
  const { children } = props;
  const listDS = useMemo(() => new DataSet(MoListDS()), []);
  const queryDS = useMemo(() => new DataSet(MoQueryDS()), []);
  const detailDS = useMemo(() => new DataSet(MoDetailDS()), []);
  const value = {
    ...props,
    listDS,
    queryDS,
    detailDS,
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
