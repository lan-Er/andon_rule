/*
 * @Description: 盘点平台 DS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-26 15:05:50
 * @LastEditors: Please set LastEditors
 */
import { DataSetSelection, FieldIgnore, FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';

import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
// @ts-ignore
import codeConfig from '@/common/codeConfig';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDS, HLOS_LWMS } from 'hlos-front/lib/utils/config';

const { lwmsInventoryPlatform, common } = codeConfig.code;
// @ts-ignore
const organizationId = getCurrentOrganizationId();
const intlPrefix = 'lwms.inventoryPlatform.model';
const commonPrefix = 'lwms.common.model';
const queryHeadUrl = `${HLOS_LWMS}/v1/${organizationId}/counts`;
const queryLineUrl = `${HLOS_LWMS}/v1/${organizationId}/count-lines`;
const queryWMUrl = `${HLOS_LMDS}/v1/${organizationId}/warehouses/organization`;
const queryAreaUrl = `${HLOS_LMDS}/v1/${organizationId}/wm-areas/organization`;
const queryDetailsUrl = `${HLOS_LWMS}/v1/${organizationId}/count-records`;

// 首页头 DS
export const inventoryPlatformHeadDS: () => DataSetProps = () => ({
  queryFields: [
    {
      name: 'organizationObj',
      required: true,
      type: FieldType.object,
      noCache: true,
      lovCode: common.organization,
      ignore: FieldIgnore.always,
      label: intl.get(`${commonPrefix}.model.org`).d('组织'),
    },
    {
      name: 'organizationId',
      type: FieldType.string,
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: FieldType.string,
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: FieldType.string,
      ignore: FieldIgnore.always,
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'countNum',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.countNum`).d('盘点号'),
    },
    {
      name: 'countType',
      type: FieldType.string,
      lookupCode: lwmsInventoryPlatform.countType,
      label: intl.get(`${intlPrefix}.countType`).d('盘点类型'),
    },
    {
      name: 'countStatus',
      type: FieldType.string,
      lookupCode: lwmsInventoryPlatform.countStatus,
      multiple: true,
      defaultValue: ['NEW', 'RELEASED', 'FROZEN', 'COUNTING', 'COMPLETED'],
      label: intl.get(`${intlPrefix}.countStatus`).d('盘点状态'),
    },
    {
      name: 'startPlanDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.startPlanDate`).d('计划日期>='),
    },
    {
      name: 'endPlanDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.endPlanDate`).d('计划日期<='),
    },
    {
      name: 'startCountStartDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.startCountStartDate`).d('开始日期>='),
    },
    {
      name: 'endCountStartDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.endCountStartDate`).d('开始日期<='),
    },
    {
      name: 'startCountEndDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.startCountEndDate`).d('结束日期>='),
    },
    {
      name: 'endCountEndDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.endCountEndDate`).d('结束日期<='),
    },
    {
      name: 'startLastAdjustmentDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.startLastAdjustmentDate`).d('调整日期>='),
    },
    {
      name: 'endLastAdjustmentDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.endLastAdjustmentDate`).d('调整日期<='),
    },
  ],
  fields: [
    {
      name: 'countId',
      type: FieldType.string,
    },
    {
      name: 'organizationObj',
      type: FieldType.object,
      noCache: true,
      ignore: FieldIgnore.always,
      lovCode: common.organization,
      label: intl.get(`${commonPrefix}.model.org`).d('组织'),
    },
    {
      name: 'organizationId',
      type: FieldType.string,
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: FieldType.string,
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: FieldType.string,
      ignore: FieldIgnore.always,
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'countNum',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.countNum`).d('盘点号'),
    },
    {
      name: 'countType',
      type: FieldType.string,
      lookupCode: lwmsInventoryPlatform.countType,
      label: intl.get(`${intlPrefix}.countType`).d('盘点类型'),
    },
    {
      name: 'countMethod',
      type: FieldType.string,
      lookupCode: lwmsInventoryPlatform.countMethod,
      label: intl.get(`${intlPrefix}.countMethod`).d('盘点方法'),
    },
    {
      name: 'countStatus',
      type: FieldType.string,
      lookupCode: lwmsInventoryPlatform.countStatus,
      label: intl.get(`${intlPrefix}.countStatus`).d('盘点状态'),
    },
    {
      name: 'countStatusMeaning',
      type: FieldType.string,
    },
    {
      name: 'planDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.planDate`).d('计划日期'),
    },
    {
      name: 'countStartDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.countStartDate`).d('开始日期'),
    },
    {
      name: 'countEndDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.countEndDate`).d('结束日期'),
    },
    {
      name: 'lastAdjustmentDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.lastAdjustmentDate`).d('调整日期'),
    },
    {
      name: 'frozenDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.frozenDate`).d('冻结日期'),
    },
    {
      name: 'disabledDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.disabledDate`).d('失效日期'),
    },
    {
      name: 'tolerancePositive',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.tolerancePositive`).d('容差正值'),
    },
    {
      name: 'toleranceNegative',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.toleranceNegative`).d('容差负值'),
    },
    {
      name: 'countRuleObj',
      type: FieldType.object,
      noCache: true,
      label: intl.get(`${intlPrefix}.countRule`).d('盘点规则'),
      ignore: FieldIgnore.always,
      lovCode: common.rule,
    },
    {
      name: 'countRuleId',
      type: FieldType.string,
      bind: 'countRuleObj.ruleId',
    },
    {
      name: 'countRule',
      type: FieldType.string,
      bind: 'countRuleObj.ruleName',
    },
    {
      name: 'defaultAdjustAccount',
      type: FieldType.string,
      lovCode: lwmsInventoryPlatform.adjustAccount,
      label: intl.get(`${intlPrefix}.defaultAdjustAccount`).d('默认调整账户'),
    },
    {
      name: 'approvalRuleMeaning',
      label: intl.get(`${commonPrefix}.approvalRuleMeaning`).d('审批策略'),
    },
    {
      name: 'approvalWorkflow',
      label: intl.get(`${commonPrefix}.approvalWorkflow`).d('审批工作流'),
    },
    {
      name: 'remark',
      label: intl.get(`${commonPrefix}.remark`).d('备注'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { countStatus: countStatusList } = data;
      return {
        url: generateUrlWithGetParam(queryHeadUrl, {
          countStatusList,
        }),
        data: {
          ...data,
          countStatus: undefined,
        },
        method: 'GET',
      };
    },
  },
});

// 行 DS
export const inventoryPlatformLineDS: (needQueryFields?: boolean) => DataSetProps = (
  needQueryFields = false
) => {
  const dsProps: DataSetProps = {
    selection: false,
    fields: [
      {
        name: 'countLineNum',
        type: FieldType.string,
        label: intl.get(`${commonPrefix}.lineNum`).d('行号'),
      },
      {
        name: 'warehouseObj',
        type: FieldType.object,
        label: intl.get(`${commonPrefix}.warehouse`).d('仓库'),
        lovCode: common.warehouse,
        ignore: FieldIgnore.always,
        required: true,
        dynamicProps: {
          lovPara: ({ dataSet }) => {
            const { current = null } = dataSet?.parent || {};
            if (current) {
              return {
                organizationId: current.get('organizationId'),
              };
            }
          },
        },
      },
      {
        name: 'warehouseId',
        type: FieldType.string,
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'warehouseCode',
        type: FieldType.string,
        bind: 'warehouseObj.warehouseCode',
      },
      {
        name: 'warehouseName',
        type: FieldType.string,
        bind: 'warehouseObj.warehouseName',
        ignore: FieldIgnore.always,
      },
      {
        name: 'wmAreaObj',
        type: FieldType.object,
        label: intl.get(`${commonPrefix}.wmArea`).d('货位'),
        lovCode: common.wmArea,
        ignore: FieldIgnore.always,
        cascadeMap: { warehouseId: 'warehouseId' },
      },
      {
        name: 'wmAreaId',
        type: FieldType.string,
        bind: 'wmAreaObj.wmAreaId',
      },
      {
        name: 'wmAreaCode',
        type: FieldType.string,
        bind: 'wmAreaObj.wmAreaCode',
      },
      {
        name: 'wmAreaName',
        type: FieldType.string,
        bind: 'wmAreaObj.wmAreaName',
        ignore: FieldIgnore.always,
      },
      {
        name: 'wmUnitObj',
        type: FieldType.object,
        label: intl.get(`${commonPrefix}.wmUnit`).d('货格'),
        lovCode: common.wmUnit,
        ignore: FieldIgnore.always,
        cascadeMap: { wmAreaId: 'wmAreaId' },
      },
      {
        name: 'wmUnitId',
        type: FieldType.string,
        bind: 'wmUnitObj.wmUnitId',
      },
      {
        name: 'wmUnitCode',
        type: FieldType.string,
        bind: 'wmUnitObj.wmUnitCode',
      },
      {
        name: 'itemType',
        type: FieldType.string,
        label: intl.get(`${commonPrefix}.itemType`).d('物料类型'),
        lookupCode: lwmsInventoryPlatform.itemType,
      },
      {
        name: 'categoryObj',
        type: FieldType.object,
        ignore: FieldIgnore.always,
        lovCode: common.categories,
        lovPara: { categorySetCode: 'ITEM_WM' },
        label: intl.get(`${commonPrefix}.category`).d('物料类别'),
      },
      {
        name: 'itemCategoryId',
        type: FieldType.string,
        bind: 'categoryObj.categoryId',
      },
      {
        name: 'itemCategoryCode',
        type: FieldType.string,
        bind: 'categoryObj.categoryCode',
      },
      {
        name: 'itemCategoryName',
        type: FieldType.string,
        ignore: FieldIgnore.always,
        bind: 'categoryObj.categoryName',
      },
      {
        name: 'itemObj',
        type: FieldType.object,
        ignore: FieldIgnore.always,
        lovCode: common.item,
        label: intl.get(`${commonPrefix}.item`).d('物料'),
        // cascadeMap: { itemType: 'itemType' },
        // required: true,
        dynamicProps: {
          lovPara: ({ dataSet }) => {
            const { current = null } = dataSet?.parent || {};
            if (current) {
              return {
                meOuId: current.get('organizationId'),
              };
            }
          },
        },
      },
      {
        name: 'itemId',
        type: FieldType.string,
        bind: 'itemObj.itemId',
      },
      {
        name: 'itemCode',
        type: FieldType.string,
        bind: 'itemObj.itemCode',
      },
      {
        name: 'itemName',
        type: FieldType.string,
        bind: 'itemObj.itemName',
      },
      {
        name: 'itemDescription',
        type: FieldType.string,
        bind: 'itemObj.itemDescription',
      },
      {
        name: 'description',
        type: FieldType.string,
        bind: 'itemObj.description',
      },
      {
        name: 'formattedItem',
        type: FieldType.string,
        label: intl.get(`${commonPrefix}.item`).d('物料'),
      },
      {
        name: 'lineRemark',
        type: FieldType.string,
        label: intl.get(`${commonPrefix}.remark`).d('备注'),
      },
      {
        name: 'enabledFlag',
        type: FieldType.boolean,
        label: intl.get(`${commonPrefix}.enabledFlag`).d('是否有效'),
        required: true,
        defaultValue: true,
      },
    ],
    transport: {
      read: () => ({
        url: queryLineUrl,
        method: 'GET',
        transformResponse: (responseData) => {
          const { content, failed, message, ...otherProps } = JSON.parse(responseData);
          if (failed) {
            notification.error(message);
            return;
          }
          return {
            ...otherProps,
            content: content.map((record) => {
              const { itemCode = '', itemDescription = '' } = record;
              return {
                ...record,
                formattedItem: `${itemCode} ${itemDescription}`,
              };
            }),
          };
        },
      }),
    },
    events: {
      update({ record, name, value, oldValue }) {
        if (name === 'warehouseObj' && value?.warehouseId !== oldValue?.warehouseId) {
          record.set('wmAreaObj', null);
          record.set('wmUnitObj', null);
        } else if (name === 'wmAreaObj') {
          record.set('wmUnitObj', null);
        } else if (name === 'itemType') {
          record.set('itemObj', null);
        }
      },
    },
  };
  if (needQueryFields) {
    dsProps.queryFields = [
      {
        name: 'itemLike',
        type: FieldType.string,
        label: intl.get(`${commonPrefix}.item`).d('物料'),
      },
      {
        name: 'warehouseLike',
        type: FieldType.string,
        label: intl.get(`${commonPrefix}.warehouse`).d('仓库'),
      },
      {
        name: 'wmAreaLike',
        type: FieldType.string,
        label: intl.get(`${commonPrefix}.wmArea`).d('货位'),
      },
      {
        name: 'onlyDifference',
        type: FieldType.boolean,
        label: intl.get(`${intlPrefix}.onlyDifference`).d('仅差异'),
      },
      {
        name: 'onlyNonAdjust',
        type: FieldType.boolean,
        label: intl.get(`${intlPrefix}.onlyNonAdjust`).d('仅未调整'),
      },
      {
        name: 'restrictedType',
        type: FieldType.string,
        lookupCode: lwmsInventoryPlatform.restrictedType,
        label: intl.get(`${intlPrefix}.restrictedType`).d('差异限定'),
      },
      {
        name: 'startDeference',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.startDeference`).d('差异值>'),
      },
      {
        name: 'endDeference',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.endDeference`).d('差异值<'),
      },
      {
        name: 'countFlag',
        type: FieldType.string,
        lookupCode: common.flag,
        label: intl.get(`${intlPrefix}.countFlag`).d('是否盘点'),
      },
      {
        name: 'startCountDate',
        type: FieldType.dateTime,
        label: intl.get(`${intlPrefix}.startCountDate`).d('盘点日期>='),
      },
      {
        name: 'endCountDate',
        type: FieldType.dateTime,
        label: intl.get(`${intlPrefix}.endCountDate`).d('盘点日期<='),
      },
      {
        name: 'startAdjustDate',
        type: FieldType.dateTime,
        label: intl.get(`${intlPrefix}.startAdjustDate`).d('调整日期>='),
      },
      {
        name: 'endAdjustDate',
        type: FieldType.dateTime,
        label: intl.get(`${intlPrefix}.endAdjustDate`).d('调整日期<='),
      },
    ];
    return dsProps;
  } else {
    return dsProps;
  }
};

// 创建 & 编辑页面 DS
export const inventoryPlatformEditDS: () => DataSetProps = () => ({
  name: 'createAndEditDs',
  selection: false,
  autoCreate: true,
  primaryKey: 'countId',
  children: {
    // @ts-ignore
    lineDS: new DataSet(inventoryPlatformLineDS()),
  },
  fields: [
    {
      name: 'organizationObj',
      type: FieldType.object,
      noCache: true,
      ignore: FieldIgnore.always,
      lovCode: common.organization,
      label: intl.get(`${commonPrefix}.model.org`).d('组织'),
      required: true,
    },
    {
      name: 'organizationId',
      type: FieldType.string,
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: FieldType.string,
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: FieldType.string,
      ignore: FieldIgnore.always,
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'countNum',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.countNum`).d('盘点号'),
    },
    {
      name: 'countType',
      type: FieldType.string,
      lookupCode: lwmsInventoryPlatform.countType,
      label: intl.get(`${intlPrefix}.countType`).d('盘点类型'),
      required: true,
    },
    {
      name: 'countMethod',
      type: FieldType.string,
      lookupCode: lwmsInventoryPlatform.countMethod,
      label: intl.get(`${intlPrefix}.countMethod`).d('盘点方法'),
      required: true,
    },
    {
      name: 'countStatus',
      type: FieldType.string,
      lookupCode: lwmsInventoryPlatform.countStatus,
      label: intl.get(`${intlPrefix}.countStatus`).d('盘点状态'),
      defaultValue: 'NEW',
    },
    {
      name: 'countRuleObj',
      type: FieldType.object,
      noCache: true,
      ignore: FieldIgnore.always,
      lovCode: common.rule,
      lovPara: {
        ruleType: 'WM_COUNT',
      },
      label: intl.get(`${intlPrefix}.countRule`).d('盘点规则'),
    },
    {
      name: 'countRuleId',
      type: FieldType.string,
      bind: 'countRuleObj.ruleId',
    },
    {
      name: 'countRule',
      type: FieldType.string,
      bind: 'countRuleObj.ruleName',
    },
    {
      name: 'tolerancePositive',
      type: FieldType.number,
      label: intl.get(`${intlPrefix}.tolerancePositive`).d('容差正值'),
    },
    {
      name: 'toleranceNegative',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.toleranceNegative`).d('容差负值'),
    },
    {
      name: 'planDate',
      type: FieldType.dateTime,
      format: DEFAULT_DATETIME_FORMAT,
      label: intl.get(`${intlPrefix}.planDate`).d('计划日期'),
    },
    {
      name: 'defaultAdjustAccount',
      type: FieldType.object,
      lovCode: lwmsInventoryPlatform.costCenter,
      label: intl.get(`${intlPrefix}.defaultAdjustAccount`).d('默认调整账户'),
      ignore: FieldIgnore.always,
    },
    {
      name: 'costCenterId',
      type: FieldType.string,
      bind: 'defaultAdjustAccount.costCenterId',
    },
    {
      name: 'costCenterCode',
      type: FieldType.string,
      bind: 'defaultAdjustAccount.costCenterCode',
    },
    {
      name: 'approvalRule',
      type: FieldType.string,
      lookupCode: lwmsInventoryPlatform.approval,
      label: intl.get(`${intlPrefix}.approvalRule`).d('审批策略'),
    },
    {
      name: 'approvalWorkFlowObj',
      type: FieldType.object,
      lovCode: lwmsInventoryPlatform.flow,
      label: intl.get(`${intlPrefix}.approvalWorkFlowObj`).d('审批工作流'),
      ignore: FieldIgnore.always,
    },
    {
      name: 'approvalWorkflow',
      type: FieldType.string,
      bind: 'approvalWorkFlowObj.key',
    },
    {
      name: 'approvalWorkflowName',
      type: FieldType.string,
      bind: 'approvalWorkFlowObj.name',
    },
    {
      name: 'remark',
      label: intl.get(`${commonPrefix}.remark`).d('备注'),
    },
  ],
  transport: {
    read: () => ({
      url: queryHeadUrl,
      method: 'GET',
    }),
    update: ({ data }) => {
      const lineData = data[0].lineDS;
      const finalData = {
        ...data[0],
        updateWmCountLineDetailDtoList: lineData,
      };
      return {
        url: `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/counts/update-wm-count`,
        method: 'POST',
        data: finalData,
      };
    },
    create: ({ data }) => {
      const lineData = data[0].lineDS;
      const finalData = [
        {
          ...data[0],
          createWmCountDTOList: lineData,
        },
      ];
      return {
        url: `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/counts/create-wm-count`,
        method: 'POST',
        data: finalData,
      };
    },
  },
});

// Modal 筛选条件用 DS
export const inventoryModalFilterDS: () => DataSetProps = () => ({
  autoCreate: true,
  fields: [
    // 通过暂存当前组织ID，来给物料LOV传参
    {
      name: 'organizationId',
      type: FieldType.string,
    },
    {
      name: 'inventoryMode',
      type: FieldType.string,
      defaultValue: 'repo',
    },
    {
      name: 'repoOrAreaInfo',
      type: FieldType.string,
    },
    {
      name: 'itemObj',
      type: FieldType.object,
      noCache: true,
      ignore: FieldIgnore.always,
      lovCode: common.item,
      dynamicProps: {
        lovPara: ({ record }) => ({
          meOuId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'itemId',
      type: FieldType.string,
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      type: FieldType.string,
      bind: 'itemObj.itemCode',
    },
    {
      name: 'itemName',
      type: FieldType.string,
      bind: 'itemObj.itemName',
    },
  ],
});

// 批量新增弹框首页按仓库 DS
export const inventoryModalWMDS: () => DataSetProps = () => ({
  primaryKey: 'warehouseId',
  cacheSelection: true,
  fields: [
    {
      name: 'displayWarehouse',
      type: FieldType.string,
      label: intl.get(`${commonPrefix}.warehouse`).d('仓库'),
    },
    {
      name: 'warehouseId',
      type: FieldType.string,
    },
    {
      name: 'warehouseCode',
      type: FieldType.string,
    },
    {
      name: 'warehouseName',
      type: FieldType.string,
    },
  ],
  transport: {
    read: () => ({
      url: queryWMUrl,
      method: 'GET',
    }),
  },
});

// 批量新增弹框首页按货位 DS
export const inventoryModalAreaDS: () => DataSetProps = () => ({
  primaryKey: 'wmAreaId',
  cacheSelection: true,
  fields: [
    {
      name: 'displayWarehouse',
      type: FieldType.string,
      label: intl.get(`${commonPrefix}.warehouse`).d('仓库'),
    },
    {
      name: 'displayWmArea',
      type: FieldType.string,
      label: intl.get(`${commonPrefix}.wmArea`).d('货位'),
    },
    {
      name: 'wmAreaId',
      type: FieldType.string,
    },
    {
      name: 'wmAreaCode',
      type: FieldType.string,
    },
    {
      name: 'wmAreaName',
      type: FieldType.string,
    },
    {
      name: 'warehouseId',
      type: FieldType.string,
    },
    {
      name: 'warehouseCode',
      type: FieldType.string,
    },
    {
      name: 'warehouseName',
      type: FieldType.string,
    },
  ],
  transport: {
    read: () => ({
      url: queryAreaUrl,
      method: 'GET',
    }),
  },
});

// 批量新增弹框限制物料 DS
export const inventoryModalItemDS: () => DataSetProps = () => ({
  primaryKey: 'itemId',
  selection: false,
  fields: [
    {
      name: 'itemId',
      type: FieldType.string,
    },
    {
      name: 'itemCode',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.model.itemCode`).d('物料编码'),
    },
    {
      name: 'description',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.model.description`).d('描述'),
    },
  ],
});

// 调整顶部 Form DS
export const inventoryAdjustmentFormDS: () => DataSetProps = () => ({
  autoCreate: true,
  fields: [
    // 默认组织 ID 用于控制调整人
    {
      name: 'organizationId',
      type: FieldType.string,
    },
    {
      name: 'adjustByObj',
      type: FieldType.object,
      lovCode: common.worker,
      required: true,
      ignore: FieldIgnore.always,
      label: intl.get(`${intlPrefix}.adjustBy`).d('调整人'),
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'adjustMan',
      type: FieldType.string,
      bind: 'adjustByObj.workerName',
    },
    {
      name: 'adjustBy',
      type: FieldType.string,
      bind: 'adjustByObj.workerId',
    },
    {
      name: 'adjustMan',
      type: FieldType.string,
      bind: 'adjustByObj.workerCode',
    },
    {
      name: 'adjustAccountObj',
      type: FieldType.object,
      required: true,
      lovCode: lwmsInventoryPlatform.adjustAccount,
      label: intl.get(`${intlPrefix}.adjustAccount`).d('调整账户'),
    },
    {
      name: 'adjustAccountId',
      type: FieldType.string,
      bind: 'adjustAccountObj.costCenterId',
    },
    {
      name: 'adjustAccount',
      type: FieldType.string,
      bind: 'adjustAccountObj.costCenterCode',
    },
    {
      name: 'adjustReason',
      type: FieldType.string,
      required: true,
      label: intl.get(`${intlPrefix}.adjustReason`).d('调整原因'),
    },
    {
      name: 'adjustRemark',
      type: FieldType.string,
      label: intl.get(`${intlPrefix}.adjustRemark`).d('调整备注'),
    },
  ],
});

// 盘点明细 & 调整 DS
export const inventoryDetailAndAdjustmentDS: (props?: {
  queryFields?: boolean;
  selectable?: boolean;
  defaultOrg?: any;
}) => DataSetProps = (props) => {
  const { queryFields = true, selectable = false, defaultOrg = {} } = props || {};
  const datasetProps = {
    fields: [
      {
        name: 'formattedItem',
        type: FieldType.string,
        label: intl.get(`${commonPrefix}.item`).d('物料'),
      },
      {
        name: 'itemObj',
        type: FieldType.object,
        ignore: FieldIgnore.always,
        lovCode: common.item,
        label: intl.get(`${commonPrefix}.item`).d('物料'),
      },
      {
        name: 'itemId',
        type: FieldType.string,
        bind: 'itemObj.itemId',
      },
      {
        name: 'itemCode',
        type: FieldType.string,
        bind: 'itemObj.itemCode',
      },
      {
        name: 'itemDescription',
        type: FieldType.string,
        bind: 'itemObj.itemName',
      },
      {
        name: 'warehouseObj',
        type: FieldType.object,
        label: intl.get(`${commonPrefix}.warehouse`).d('仓库'),
        lovCode: common.warehouse,
        ignore: FieldIgnore.always,
      },
      {
        name: 'warehouseId',
        type: FieldType.string,
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'warehouseCode',
        type: FieldType.string,
        bind: 'warehouseObj.warehouseCode',
      },
      {
        name: 'warehouseName',
        type: FieldType.string,
        bind: 'warehouseObj.warehouseName',
        ignore: FieldIgnore.always,
      },
      {
        name: 'wmAreaObj',
        type: FieldType.object,
        label: intl.get(`${commonPrefix}.wmArea`).d('货位'),
        lovCode: common.wmArea,
        ignore: FieldIgnore.always,
      },
      {
        name: 'wmAreaId',
        type: FieldType.string,
        bind: 'wmAreaObj.wmAreaId',
      },
      {
        name: 'wmAreaCode',
        type: FieldType.string,
        bind: 'wmAreaObj.wmAreaCode',
      },
      {
        name: 'wmAreaName',
        type: FieldType.string,
        bind: 'wmAreaObj.wmAreaName',
        ignore: FieldIgnore.always,
      },
      {
        name: 'wmUnitObj',
        type: FieldType.object,
        label: intl.get(`${commonPrefix}.wmUnit`).d('货格'),
        lovCode: common.wmUnit,
        ignore: FieldIgnore.always,
      },
      {
        name: 'wmUnitId',
        type: FieldType.string,
        bind: 'wmUnitObj.wmUnitId',
      },
      {
        name: 'wmUnitCode',
        type: FieldType.string,
        bind: 'wmUnitObj.wmUnitCode',
      },
      {
        name: 'uomName',
        type: FieldType.string,
        lookupCode: common.uom,
        label: intl.get(`${commonPrefix}.uom`).d('单位'),
      },
      {
        name: 'tagCode',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.tagCode`).d('标签'),
      },
      {
        name: 'lotId',
        type: FieldType.string,
      },
      {
        name: 'lotNumber',
        type: FieldType.string,
        label: intl.get(`${commonPrefix}.lot`).d('批次'),
      },
      {
        name: 'ownerType',
        type: FieldType.string,
        lookupCode: lwmsInventoryPlatform.ownerType,
        label: intl.get(`${intlPrefix}.ownerType`).d('所有者类型'),
      },
      {
        name: 'owner',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.owner`).d('所有者'),
      },
      {
        name: 'featureType',
        type: FieldType.string,
        lookupCode: lwmsInventoryPlatform.featureType,
        label: intl.get(`${intlPrefix}.featureType`).d('特征类型'),
      },
      {
        name: 'featureValue',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.featureValue`).d('特征值'),
      },
      {
        name: 'projectNum',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.projectNum`).d('项目号'),
      },
      {
        name: 'sourceNum',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.sourceNum`).d('关联单据'),
      },
      {
        name: 'snapshotQty',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.snapshotQty`).d('快照数量'),
      },
      {
        name: 'countQty',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.countQty`).d('盘点数量'),
      },
      {
        name: 'auditQty',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.auditQty`).d('复盘数量'),
      },
      {
        name: 'varianceQty',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.varianceQty`).d('差异值'),
      },
      {
        name: 'variancePercent',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.variancePercent`).d('差异百分比'),
      },
      {
        name: 'adjustQty',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.adjustQty`).d('调整数量'),
      },
      {
        name: 'secondUomName',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.secondUom`).d('辅单位'),
      },
      {
        name: 'snapshotSecondQty',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.snapshotSecondQty`).d('辅单位快照数量'),
      },
      {
        name: 'secondCountQty',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.secondCountQty`).d('辅助盘点数量'),
      },
      {
        name: 'secondAdjustQty',
        type: FieldType.number,
        label: intl.get(`${intlPrefix}.secondAdjustQty`).d('辅助复盘数量'),
      },
      {
        name: 'adjustAccountObj',
        type: FieldType.object,
        ignore: FieldIgnore.always,
        lovCode: lwmsInventoryPlatform.adjustAccount,
        label: intl.get(`${intlPrefix}.adjustAccountObj`).d('调整账户'),
      },
      {
        name: 'adjustAccountId',
        type: FieldType.string,
        bind: 'adjustAccountObj.costCenterId',
      },
      {
        name: 'adjustAccount',
        type: FieldType.string,
        bind: 'adjustAccountObj.costCenterCode',
      },
      {
        name: 'countDate',
        type: FieldType.dateTime,
        format: DEFAULT_DATETIME_FORMAT,
        label: intl.get(`${intlPrefix}.countDate`).d('盘点日期'),
      },
      {
        name: 'countManName',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.countManName`).d('盘点人'),
      },
      {
        name: 'countRemark',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.countRemark`).d('盘点备注'),
      },
      {
        name: 'auditDate',
        type: FieldType.dateTime,
        format: DEFAULT_DATETIME_FORMAT,
        label: intl.get(`${intlPrefix}.auditDate`).d('复盘日期'),
      },
      {
        name: 'auditManName',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.auditManName`).d('复盘人'),
      },
      {
        name: 'auditRemark',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.auditRemark`).d('复盘备注'),
      },
      {
        name: 'adjustByObj',
        type: FieldType.object,
        lovCode: common.worker,
        ignore: FieldIgnore.always,
        label: intl.get(`${intlPrefix}.adjustBy`).d('调整人'),
        dynamicProps: {
          lovPara() {
            return {
              organizationId: defaultOrg.organizationId || undefined,
            };
          },
        },
      },
      // {
      //   name: 'adjustMan',
      //   type: FieldType.string,
      //   bind: 'adjustByObj.workerName',
      // },
      {
        name: 'adjustBy',
        type: FieldType.string,
        bind: 'adjustByObj.workerId',
      },
      {
        name: 'adjustMan',
        type: FieldType.string,
        bind: 'adjustByObj.workerCode',
      },
      {
        name: 'adjustManName',
        type: FieldType.string,
        bind: 'adjustByObj.workerName',
      },
      {
        name: 'adjustDate',
        type: FieldType.dateTime,
        label: intl.get(`${intlPrefix}.adjustDate`).d('调整日期'),
      },
      {
        name: 'adjustReason',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.adjustReason`).d('调整原因'),
      },
      {
        name: 'adjustRemark',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.adjustRemark`).d('调整备注'),
      },
      {
        name: 'recordTypeMeaning',
        type: FieldType.string,
        label: intl.get(`${intlPrefix}.recordTypeMeaning`).d('数据来源'),
      },
      {
        name: 'countFlag',
        type: FieldType.boolean,
        label: intl.get(`${intlPrefix}.countFlag`).d('是否盘点'),
      },
    ],
    transport: {
      read: () => ({
        url: queryDetailsUrl,
        method: 'GET' as any,
        transformResponse: (responseData) => {
          const { content, failed, message, ...otherProps } = JSON.parse(responseData);
          if (failed) {
            notification.error(message);
            return;
          }
          return {
            ...otherProps,
            content: content.map((record) => {
              const { itemCode = '', itemDescription = '', varianceQty = 0 } = record;
              return {
                ...record,
                formattedItem: `${itemCode} ${itemDescription}`,
                adjustQty: varianceQty,
              };
            }),
          };
        },
      }),
    },
  };
  if (queryFields) {
    return {
      ...datasetProps,
      selection: selectable ? DataSetSelection.single : false,
      queryFields: [
        {
          name: 'itemLike',
          type: FieldType.string,
          label: intl.get(`${commonPrefix}.item`).d('物料'),
        },
        {
          name: 'warehouseObj',
          type: FieldType.object,
          label: intl.get(`${commonPrefix}.warehouse`).d('仓库'),
          lovCode: common.warehouse,
          // cascadeMap: {organizationId: 'organizationId'},
          ignore: FieldIgnore.always,
        },
        {
          name: 'warehouseId',
          type: FieldType.string,
          bind: 'warehouseObj.warehouseId',
        },
        {
          name: 'warehouseCode',
          type: FieldType.string,
          bind: 'warehouseObj.warehouseCode',
        },
        {
          name: 'warehouseName',
          type: FieldType.string,
          bind: 'warehouseObj.warehouseName',
          ignore: FieldIgnore.always,
        },
        {
          name: 'wmAreaObj',
          type: FieldType.object,
          label: intl.get(`${commonPrefix}.wmArea`).d('货位'),
          lovCode: common.wmArea,
          cascadeMap: { warehouseId: 'warehouseId' },
          ignore: FieldIgnore.always,
        },
        {
          name: 'wmAreaId',
          type: FieldType.string,
          bind: 'wmAreaObj.wmAreaId',
        },
        {
          name: 'wmAreaCode',
          type: FieldType.string,
          bind: 'wmAreaObj.wmAreaCode',
        },
        {
          name: 'wmAreaName',
          type: FieldType.string,
          bind: 'wmAreaObj.wmAreaName',
          ignore: FieldIgnore.always,
        },
        {
          name: 'onlyDifference',
          type: FieldType.boolean,
          label: intl.get(`${intlPrefix}.onlyDifference`).d('仅差异'),
          defaultValue: true,
        },
        {
          name: 'restrictedType',
          type: FieldType.string,
          lookupCode: lwmsInventoryPlatform.restrictedType,
          label: intl.get(`${intlPrefix}.restrictedType`).d('差异限定'),
        },
        {
          name: 'startDeference',
          type: FieldType.number,
          label: intl.get(`${intlPrefix}.startDeference`).d('差异值>'),
        },
        {
          name: 'endDeference',
          type: FieldType.number,
          label: intl.get(`${intlPrefix}.endDeference`).d('差异值<'),
        },
        {
          name: 'onlyNonAdjust',
          type: FieldType.boolean,
          label: intl.get(`${intlPrefix}.onlyNonAdjust`).d('仅未调整'),
          // defaultValue: true,
        },
        {
          name: 'startCountDate',
          type: FieldType.dateTime,
          format: DEFAULT_DATETIME_FORMAT,
          label: intl.get(`${intlPrefix}.startCountDate`).d('盘点日期>='),
        },
        {
          name: 'endCountDate',
          type: FieldType.dateTime,
          format: DEFAULT_DATETIME_FORMAT,
          label: intl.get(`${intlPrefix}.endCountDate`).d('盘点日期<='),
        },
        {
          name: 'startLastAdjustmentDate',
          type: FieldType.dateTime,
          format: DEFAULT_DATETIME_FORMAT,
          label: intl.get(`${intlPrefix}.startLastAdjustmentDate`).d('调整日期>='),
        },
        {
          name: 'endLastAdjustmentDate',
          type: FieldType.dateTime,
          format: DEFAULT_DATETIME_FORMAT,
          label: intl.get(`${intlPrefix}.endLastAdjustmentDate`).d('调整日期<='),
        },
        {
          name: 'countFlag',
          type: FieldType.string,
          lookupCode: common.flag,
          label: intl.get(`${intlPrefix}.countFlag`).d('是否盘点'),
          defaultValue: 'true',
        },
      ],
    };
  }
  return datasetProps;
};
