/**
 * @Description: 需求工作台管理信息--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-03 15:58:08
 * @LastEditors: yu.na
 */

// import React, { createContext, useMemo } from 'react';
// import { DataSet } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LSOP } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { common, lsopDemandOrder } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lsop.demandOrder.model';
const commonCode = 'lsop.common.model';

const DemandOrderQueryDS = () => {
  return {
    selection: false,
    autoCreate: true,
    fields: [
      {
        name: 'sopOuObj',
        type: 'object',
        label: intl.get(`${commonCode}.sopOu`).d('销售中心'),
        lovCode: common.sopOu,
        ignore: 'always',
        required: true,
      },
      {
        name: 'sopOuId',
        type: 'string',
        bind: 'sopOuObj.sopOuId',
      },
      {
        name: 'sopOuName',
        type: 'string',
        bind: 'sopOuObj.sopOuName',
        ignore: 'always',
      },
      {
        name: 'demandNumObj',
        type: 'object',
        label: intl.get(`${preCode}.demandNum`).d('需求订单号'),
        lovCode: lsopDemandOrder.demandNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            sopOuId: record.get('sopOuId'),
          }),
        },
      },
      {
        name: 'demandId',
        type: 'string',
        bind: 'demandNumObj.demandId',
      },
      {
        name: 'demandNum',
        type: 'string',
        bind: 'demandNumObj.demandNumber',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
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
        name: 'demandStatus',
        type: 'string',
        label: intl.get(`${preCode}.demandStatus`).d('需求状态'),
        lookupCode: lsopDemandOrder.demandStatus,
        multiple: true,
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
        name: 'customerName',
        type: 'string',
        bind: 'customerObj.customerName',
        ignore: 'always',
      },
      {
        name: 'salesmanObj',
        type: 'object',
        label: intl.get(`${preCode}.salesman`).d('销售员'),
        lovCode: common.worker,
        lovPara: { workerType: 'SALESMAN' },
        ignore: 'always',
      },
      {
        name: 'salesManId',
        type: 'string',
        bind: 'salesmanObj.workerId',
      },
      {
        name: 'salesManCode',
        type: 'string',
        bind: 'salesmanObj.workerCode',
      },
      {
        name: 'salesMan',
        type: 'string',
        bind: 'salesmanObj.workerName',
        ignore: 'always',
      },
      {
        name: 'soNum',
        type: 'string',
        label: intl.get(`${preCode}.salesOrder`).d('销售订单'),
      },
      // {
      //   name: 'soObj',
      //   type: 'object',
      //   label: intl.get(`${preCode}.salesOrder`).d('销售订单'),
      //   lovCode: common.soNum,
      //   ignore: 'always',
      // },
      // {
      //   name: 'soId',
      //   type: 'string',
      //   bind: 'soObj.soHeaderId',
      //   ignore: 'always',
      // },
      // {
      //   name: 'soNum',
      //   type: 'string',
      //   bind: 'soObj.soHeaderNumber',
      // },
      {
        name: 'demandTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.demandType`).d('需求类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'DEMAND' },
        ignore: 'always',
      },
      {
        name: 'demandTypeId',
        type: 'string',
        bind: 'demandTypeObj.documentTypeId',
      },
      {
        name: 'demandTypeCode',
        type: 'string',
        bind: 'demandTypeObj.documentTypeCode',
      },
      {
        name: 'demandType',
        type: 'string',
        bind: 'demandTypeObj.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'customerPo',
        type: 'string',
        label: intl.get(`${preCode}.customerPo`).d('客户PO'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${preCode}.customerItem`).d('客户物料'),
      },
      {
        name: 'startDate',
        type: 'date',
        label: intl.get(`${preCode}.demandDateStart`).d('需求日期>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('endDate')) {
              return 'endDate';
            }
          },
        },
      },
      {
        name: 'endDate',
        type: 'date',
        label: intl.get(`${preCode}.demandDateEnd`).d('需求日期<='),
        min: 'startDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
    ],
  };
};

const commonFields = [
  {
    name: 'sopOuObj',
    type: 'object',
    label: intl.get(`${commonCode}.sopOu`).d('销售中心'),
    lovCode: common.sopOu,
    ignore: 'always',
    required: true,
  },
  {
    name: 'sopOuId',
    type: 'string',
    bind: 'sopOuObj.sopOuId',
  },
  {
    name: 'sopOuCode',
    type: 'string',
    bind: 'sopOuObj.sopOuCode',
  },
  {
    name: 'sopOuName',
    type: 'string',
    bind: 'sopOuObj.sopOuName',
  },
  {
    name: 'sopOu',
    label: intl.get(`${commonCode}.sopOu`).d('销售中心'),
  },
  {
    name: 'demandNum',
    label: intl.get(`${preCode}.demandNum`).d('需求订单号'),
  },
  {
    name: 'demandQty',
    label: intl.get(`${preCode}.demandQty`).d('需求数量'),
  },
  {
    name: 'secondDemandQty',
    min: 0,
    label: intl.get(`${preCode}.secondDemandQty`).d('辅助单位数量'),
  },
  {
    name: 'demandDate',
    label: intl.get(`${preCode}.demandDate`).d('需求日期'),
  },
  {
    name: 'demandStatusMeaning',
    label: intl.get(`${preCode}.demandStatus`).d('需求状态'),
  },
  {
    name: 'specification',
    label: intl.get(`${preCode}.specification`).d('规格'),
  },
  {
    name: 'demandRankMeaning',
    label: intl.get(`${preCode}.demandRank`).d('需求等级'),
  },
  {
    name: 'priority',
    label: intl.get(`${preCode}.priority`).d('优先级'),
  },
  {
    name: 'promiseDate',
    label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
  },
  {
    name: 'deadlineDate',
    label: intl.get(`${preCode}.deadlineDate`).d('截止日期'),
  },
  {
    name: 'demandPeriod',
    label: intl.get(`${preCode}.demandPeriod`).d('需求时段'),
  },
  {
    name: 'projectNum',
    label: intl.get(`${preCode}.projectNum`).d('项目号'),
  },
  {
    name: 'wbsNum',
    label: intl.get(`${preCode}.wbsNum`).d('WBS号'),
  },
  {
    name: 'completedQty',
    label: intl.get(`${preCode}.completedQty`).d('完工数量'),
  },
  {
    name: 'shippedQty',
    label: intl.get(`${preCode}.shippedQty`).d('发运数量'),
  },
  {
    name: 'demandVersion',
    label: intl.get(`${preCode}.demandVersion`).d('需求版本'),
  },
  {
    name: 'docProcessRule',
    label: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
  },
  {
    name: 'sourceDocType',
    label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
  },
  {
    name: 'sourceDocNum',
    label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
  },
  {
    name: 'sourceDocLineNum',
    label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
  },
  {
    name: 'externalId',
    label: intl.get(`${commonCode}.externalId`).d('外部ID'),
  },
  {
    name: 'externalNum',
    label: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
  },
  {
    name: 'remark',
    label: intl.get(`${commonCode}.remark`).d('备注'),
  },
  {
    name: 'salesmanObj',
    type: 'object',
    label: intl.get(`${preCode}.salesman`).d('销售员'),
    lovCode: common.worker,
    lovPara: { workerType: 'SALESMAN' },
    ignore: 'always',
  },
  {
    name: 'salesManId',
    type: 'string',
    bind: 'salesmanObj.workerId',
  },
  {
    name: 'salesManName',
    type: 'string',
    bind: 'salesmanObj.workerName',
    ignore: 'always',
  },
  {
    name: 'salesMan',
    label: intl.get(`${preCode}.salesman`).d('销售员'),
    bind: 'salesmanObj.workerCode',
  },
  {
    name: 'soNum',
    type: 'string',
    label: intl.get(`${preCode}.soNum`).d('销售订单号'),
  },
  // {
  //   name: 'soObj',
  //   type: 'object',
  //   label: intl.get(`${preCode}.salesOrder`).d('销售订单'),
  //   lovCode: common.soNum,
  //   ignore: 'always',
  //   dynamicProps: {
  //     lovPara: ({ record }) => ({
  //       sopOuId: record.get('sopOuId'),
  //     }),
  //   },
  // },
  // {
  //   name: 'soId',
  //   type: 'string',
  //   bind: 'soObj.soHeaderId',
  //   ignore: 'always',
  // },
  // {
  //   name: 'soNum',
  //   type: 'string',
  //   bind: 'soObj.soHeaderNumber',
  // },
  {
    name: 'soLineNum',
    type: 'string',
    label: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
  },
  // {
  //   name: 'soLineObj',
  //   type: 'object',
  //   label: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
  //   lovCode: common.soLine,
  //   ignore: 'always',
  //   dynamicProps: {
  //     lovPara: ({ record }) => ({
  //       soId: record.get('soId'),
  //     }),
  //   },
  // },
  // {
  //   name: 'soLineNum',
  //   bind: 'soLineObj.soLineNumber',
  // },
  // {
  //   name: 'soLineId',
  //   bind: 'soLineObj.soLineId',
  // },
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
    name: 'customerName',
    type: 'string',
    label: intl.get(`${preCode}.customer`).d('客户'),
    bind: 'customerObj.customerName',
  },
  {
    name: 'customerNumber',
    type: 'string',
    bind: 'customerObj.customerNumber',
  },
  {
    name: 'customerId',
    type: 'string',
    bind: 'customerObj.customerId',
  },
  {
    name: 'customerSiteObj',
    type: 'object',
    label: intl.get(`${preCode}.customerSite`).d('客户地点'),
    lovCode: common.customerSite,
    dynamicProps: {
      lovPara: ({ record }) => ({
        customerId: record.get('customerId'),
      }),
    },
    ignore: 'always',
    // 单据处理规则 customerSite为enable时必输 否则不可编辑
  },
  {
    name: 'customerSiteId',
    type: 'string',
    bind: 'customerSiteObj.customerSiteId',
  },
  {
    name: 'customerSite',
    type: 'string',
    label: intl.get(`${preCode}.customerSite`).d('客户地点'),
    bind: 'customerSiteObj.customerSiteName',
  },
  {
    name: 'customerSiteNumber',
    type: 'string',
    bind: 'customerSiteObj.customerSiteNumber',
  },
  {
    name: 'customerItemCode',
    type: 'string',
    label: intl.get(`${preCode}.customerItem`).d('客户物料'),
  },
  {
    name: 'customerItemDesc',
    type: 'string',
    label: intl.get(`${preCode}.customerItemDesc`).d('客户物料描述'),
  },
  {
    name: 'customerPo',
    type: 'string',
    label: intl.get(`${preCode}.customerPo`).d('客户PO'),
  },
  {
    name: 'customerPoLine',
    type: 'string',
    label: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
  },
  {
    name: 'customerDemandDate',
    type: 'date',
    label: intl.get(`${preCode}.customerDemandDate`).d('客户需求日期'),
    transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
  },
  {
    name: 'salesChannel',
    type: 'string',
    label: intl.get(`${preCode}.salesChannel`).d('销售渠道'),
    lookupCode: lsopDemandOrder.salesChannel,
  },
  {
    name: 'salesChannelMeaning',
    label: intl.get(`${preCode}.salesChannel`).d('销售渠道'),
  },
  {
    name: 'salesBrand',
    type: 'string',
    label: intl.get(`${preCode}.salesbrand`).d('销售商标'),
    lookupCode: lsopDemandOrder.salesBrand,
  },
  {
    name: 'salesBrandMeaning',
    label: intl.get(`${preCode}.salesbrand`).d('销售商标'),
  },
  {
    name: 'currencyObj',
    type: 'object',
    label: intl.get(`${preCode}.currency`).d('币种'),
    lovCode: common.currency,
    textField: 'currencyName',
    ignore: 'always',
  },
  {
    name: 'currencyCode',
    type: 'string',
    bind: 'currencyObj.currencyCode',
  },
  {
    name: 'currencyId',
    type: 'string',
    bind: 'currencyObj.currencyId',
  },
  {
    name: 'currency',
    type: 'string',
    label: intl.get(`${preCode}.currency`).d('币种'),
    bind: 'currencyObj.currencyName',
  },
  {
    name: 'unitPrice',
    type: 'number',
    label: intl.get(`${preCode}.unitPrice`).d('单价'),
  },
  {
    name: 'contractAmount',
    type: 'number',
    label: intl.get(`${preCode}.totalAmount`).d('总价'),
  },
  {
    name: 'customerAddress',
    type: 'string',
    label: intl.get(`${preCode}.customerAddress`).d('客户地址'),
    dynamicProps: {
      bind: ({ record }) => {
        if (!isEmpty(record.get('customerSiteObj'))) {
          return 'customerSiteObj.address';
        } else {
          return 'customerObj.address';
        }
      },
    },
  },
  {
    name: 'apsOuObj',
    type: 'object',
    label: intl.get(`${preCode}.apsOu`).d('计划中心'),
    lovCode: common.apsOu,
    ignore: 'always',
  },
  {
    name: 'apsOuId',
    type: 'string',
    bind: 'apsOuObj.apsOuId',
  },
  {
    name: 'apsOuCode',
    type: 'string',
    bind: 'apsOuObj.apsOuCode',
  },
  {
    name: 'apsOuName',
    type: 'string',
    bind: 'apsOuObj.apsOuName',
  },
  {
    name: 'apsOu',
    label: intl.get(`${preCode}.apsOu`).d('计划中心'),
  },
  {
    name: 'meOuObj',
    type: 'object',
    label: intl.get(`${preCode}.meOu`).d('工厂'),
    lovCode: common.meOu,
    ignore: 'always',
  },
  {
    name: 'meOuId',
    type: 'string',
    bind: 'meOuObj.meOuId',
  },
  {
    name: 'meOuCode',
    type: 'string',
    bind: 'meOuObj.meOuCode',
  },
  {
    name: 'meOuName',
    type: 'string',
    bind: 'meOuObj.organizationName',
  },
  {
    name: 'meOu',
    label: intl.get(`${preCode}.meOu`).d('工厂'),
  },
  {
    name: 'resourceObj',
    type: 'object',
    label: intl.get(`${preCode}.resource`).d('资源'),
    lovCode: common.resource,
    ignore: 'always',
  },
  {
    name: 'resourceId',
    type: 'string',
    bind: 'resourceObj.resourceId',
  },
  {
    name: 'resourceCode',
    type: 'string',
    bind: 'resourceObj.resourceCode',
  },
  {
    name: 'resource',
    label: intl.get(`${preCode}.resource`).d('资源'),
    type: 'string',
    bind: 'resourceObj.resourceName',
    ignore: 'always',
  },
  {
    name: 'plannedQty',
    label: intl.get(`${preCode}.plannedQty`).d('已计划数量'),
  },
  {
    name: 'planType',
    type: 'string',
    label: intl.get(`${preCode}.planType`).d('计划类型'),
    lookupCode: lsopDemandOrder.planType,
  },
  {
    name: 'planTypeMeaning',
    label: intl.get(`${preCode}.planType`).d('计划类型'),
  },
  {
    name: 'mtoFlag',
    type: 'boolean',
    label: intl.get(`${preCode}.mtoFlag`).d('是否按单'),
    // 根据物料、计划中心获取物料计划中心的mtoFlag
  },
  {
    name: 'mtoFlagMeaning',
    label: intl.get(`${preCode}.mtoFlag`).d('是否按单'),
  },
  {
    name: 'validateStatus',
    type: 'string',
    label: intl.get(`${preCode}.validateStatus`).d('校验状态'),
    lookupCode: lsopDemandOrder.validateStatus,
  },
  {
    name: 'validateStatusMeaning',
    label: intl.get(`${preCode}.validateStatus`).d('校验状态'),
  },
  {
    name: 'shippingMethod',
    type: 'string',
    label: intl.get(`${preCode}.shippingMethod`).d('发运方式'),
    lookupCode: lsopDemandOrder.shippingMethod,
  },
  {
    name: 'shippingMethodMeaning',
    label: intl.get(`${preCode}.shippingMethod`).d('发运方式'),
  },
  {
    name: 'shipRuleObj',
    type: 'object',
    label: intl.get(`${preCode}.shipRule`).d('发运规则'),
    lovCode: common.rule,
    lovPara: { ruleType: 'SHIP' },
    ignore: 'always',
  },
  {
    name: 'shipRuleId',
    type: 'string',
    bind: 'shipRuleObj.ruleId',
  },
  {
    name: 'shipRule',
    type: 'string',
    bind: 'shipRuleObj.ruleJson',
  },
  {
    name: 'shipRuleName',
    label: intl.get(`${preCode}.shipRule`).d('发运规则'),
    type: 'string',
    bind: 'shipRuleObj.ruleName',
  },
  {
    name: 'packingRuleObj',
    type: 'object',
    label: intl.get(`${preCode}.packingRule`).d('装箱规则'),
    lovCode: common.rule,
    lovPara: { ruleType: 'PACKING' },
    ignore: 'always',
  },
  {
    name: 'packingRuleId',
    type: 'string',
    bind: 'packingRuleObj.ruleId',
  },
  {
    name: 'packingRule',
    type: 'string',
    bind: 'packingRuleObj.ruleJson',
  },
  {
    name: 'packingRuleName',
    label: intl.get(`${preCode}.packingRule`).d('装箱规则'),
    type: 'string',
    bind: 'packingRuleObj.ruleName',
  },
  {
    name: 'packingFormat',
    type: 'string',
    label: intl.get(`${preCode}.packingFormat`).d('包装方式'),
    lookupCode: lsopDemandOrder.packingFormat,
  },
  {
    name: 'packingFormatMeaning',
    label: intl.get(`${preCode}.packingFormat`).d('包装方式'),
  },
  {
    name: 'packingMaterial',
    type: 'string',
    label: intl.get(`${preCode}.packingMaterial`).d('包装材料'),
  },
  {
    name: 'minPackingQty',
    type: 'number',
    min: 0,
    label: intl.get(`${preCode}.minPackingQty`).d('最小包装数'),
  },
  {
    name: 'packingQty',
    type: 'number',
    validator: positiveNumberValidator,
    label: intl.get(`${preCode}.packingQty`).d('单位包装数'),
  },
  {
    name: 'containerQty',
    type: 'number',
    validator: positiveNumberValidator,
    label: intl.get(`${preCode}.containerQty`).d('箱数'),
  },
  {
    name: 'palletContainerQty',
    type: 'number',
    validator: positiveNumberValidator,
    label: intl.get(`${preCode}.palletQty`).d('托盘数'),
  },
  {
    name: 'packageNum',
    type: 'string',
    label: intl.get(`${preCode}.packageNum`).d('包装编号'),
  },
  {
    name: 'tagTemplate',
    type: 'string',
    label: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
  },
  {
    name: 'lotNumber',
    type: 'string',
    label: intl.get(`${preCode}.lotNumber`).d('指定批次'),
  },
  {
    name: 'tagCode',
    type: 'string',
    label: intl.get(`${preCode}.tagCode`).d('指定标签'),
  },
];

const DemandOrderListDS = () => {
  return {
    selection: 'multiple',
    pageSize: 100,
    fields: [
      ...commonFields,
      {
        name: 'itemCode',
        label: intl.get(`${commonCode}.item`).d('物料'),
      },
      {
        name: 'itemDescription',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      },
      {
        name: 'uomName',
        label: intl.get(`${preCode}.uom`).d('单位'),
      },
      {
        name: 'demandType',
        label: intl.get(`${preCode}.demandType`).d('需求类型'),
      },
      {
        name: 'secondUomName',
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { demandStatus: statusList } = data;
        return {
          url: generateUrlWithGetParam(`${HLOS_LSOP}/v1/${organizationId}/lsop-demands`, {
            statusList,
          }),
          data: {
            ...data,
            demandStatus: undefined,
          },
          params: {
            page: data.page || 0,
            size: data.size || 100,
          },
          method: 'GET',
        };
      },
    },
  };
};

const DemandDetailDS = () => {
  return {
    fields: [
      ...commonFields,
      {
        name: 'demandTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.demandType`).d('需求类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'DEMAND' },
        ignore: 'always',
        required: true,
      },
      {
        name: 'demandTypeId',
        type: 'string',
        bind: 'demandTypeObj.documentTypeId',
      },
      {
        name: 'demandTypeCode',
        type: 'string',
        bind: 'demandTypeObj.documentTypeCode',
      },
      {
        name: 'demandType',
        type: 'string',
        ignore: 'always',
        bind: 'demandTypeObj.documentTypeName',
      },
      {
        name: 'docProcessRule',
        type: 'string',
        bind: 'demandTypeObj.docProcessRule',
      },
      {
        name: 'demandNum',
        type: 'string',
        label: intl.get(`${preCode}.demandNum`).d('需求订单号'),
      },
      {
        name: 'demandStatus',
        type: 'string',
        label: intl.get(`${preCode}.demandStatus`).d('需求状态'),
        lookupCode: lsopDemandOrder.demandStatus,
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.itemSop,
        ignore: 'always',
        required: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            sopOuId: record.get('sopOuId'),
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
        name: 'uomObj',
        type: 'object',
        label: intl.get(`${preCode}.uom`).d('单位'),
        lovCode: common.uom,
        ignore: 'always',
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
        name: 'itemDescription',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        type: 'string',
        bind: 'itemObj.description',
      },
      {
        name: 'demandQty',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.demandQty`).d('需求数量'),
        required: true,
      },
      {
        name: 'secondUomObj',
        type: 'object',
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
        lovCode: common.uom,
        ignore: 'always',
      },
      {
        name: 'secondUomId',
        type: 'string',
        bind: 'secondUomObj.uomId',
      },
      {
        name: 'secondUomCode',
        type: 'string',
        bind: 'secondUomObj.uomCode',
      },
      {
        name: 'secondUomName',
        type: 'string',
        bind: 'secondUomObj.uomName',
      },
      {
        name: 'itemDescription',
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        type: 'string',
        bind: 'itemObj.description',
      },
      {
        name: 'demandDate',
        type: 'date',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
        required: true,
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'promiseDate',
        type: 'date',
        label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'deadlineDate',
        type: 'date',
        label: intl.get(`${preCode}.deadlineDate`).d('截止日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'specification',
        type: 'string',
        label: intl.get(`${preCode}.specification`).d('规格'),
      },
      {
        name: 'demandRank',
        type: 'string',
        label: intl.get(`${preCode}.demandRank`).d('需求等级'),
        lookupCode: lsopDemandOrder.demandRank,
      },
      {
        name: 'projectNum',
        type: 'string',
        label: intl.get(`${preCode}.projectNum`).d('项目号'),
      },
      {
        name: 'wbsNum',
        type: 'string',
        label: intl.get(`${preCode}.wbsNum`).d('WBS号'),
      },
      {
        name: 'demandPeriod',
        type: 'string',
        label: intl.get(`${preCode}.demandPeriod`).d('需求时段'),
      },
      {
        name: 'priority',
        type: 'number',
        label: intl.get(`${preCode}.priority`).d('优先级'),
      },
      {
        name: 'sourceDocTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
        lovCode: common.documentType,
        ignore: 'always',
      },
      {
        name: 'sourceDocTypeId',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeId',
      },
      {
        name: 'sourceDocTypeCode',
        type: 'string',
        bind: 'sourceDocTypeObj.documentTypeCode',
      },
      {
        name: 'sourceDocObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        lovCode: common.document,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            sourceDocTypeId: record.get('sourceDocTypeId'),
          }),
        },
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'sourceDocObj.documentId',
      },
      {
        name: 'sourceDocNum',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        type: 'string',
        bind: 'sourceDocObj.documentNum',
      },
      {
        name: 'sourceDocLineObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
        lovCode: common.documentLine,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            sourceDocNum: record.get('sourceDocNum'),
          }),
        },
      },
      {
        name: 'sourceDocLineId',
        type: 'string',
        bind: 'sourceDocLineObj.documentLineId',
      },
      {
        name: 'sourceDocLineNum',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
        type: 'string',
        bind: 'sourceDocLineObj.documentLineNum',
      },
      {
        name: 'demandVersion',
        type: 'string',
        label: intl.get(`${preCode}.demandVersion`).d('需求版本'),
      },
      {
        name: 'externalId',
        type: 'number',
        min: 0,
        step: 1,
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        type: 'string',
        label: intl.get(`${preCode}}.externalNum`).d('外部编号'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LSOP}/v1/${organizationId}/lsop-demands`,
          method: 'GET',
        };
      },
      create: ({ data }) => {
        return {
          url: `${HLOS_LSOP}/v1/${organizationId}/lsop-demands/createDemand`,
          data: data[0],
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          url: `${HLOS_LSOP}/v1/${organizationId}/lsop-demands/updateDemand`,
          data: data[0],
          method: 'PUT',
        };
      },
    },
    events: {
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
      update: ({ name, record }) => {
        const customerObj = record.get('customerObj');
        const customerSiteObj = record.get('customerSiteObj');
        const itemObj = record.get('itemObj');
        if (name === 'customerObj') {
          record.set('customerSiteObj', null);
          if (!isEmpty(customerObj)) {
            const { currencyId, currency, currencyName } = customerObj;
            if (currencyId && currency && currencyName) {
              record.set('currencyObj', {
                currencyId,
                currencyName,
                currency,
              });
            }
          }
        }
        if (name === 'customerSiteObj') {
          if (customerSiteObj) {
            if (customerSiteObj.address) {
              record.set('customerAddress', customerSiteObj.address);
            }
          }
        }
        if (name === 'demandQty' || name === 'unitPrice') {
          record.set('contractAmount', null);

          const demandQty = record.get('demandQty');
          const unitPrice = record.get('unitPrice');
          if (demandQty && unitPrice) {
            record.set('contractAmount', demandQty * unitPrice);
          }
        }
        if (name === 'itemObj') {
          if (!isEmpty(itemObj)) {
            const { uomId, uom, uomName, secondUomId, secondUom, secondUomName } = itemObj;
            if (uomId && uom && uomName) {
              record.set('uomObj', {
                uomId,
                uomName,
                uomCode: uom,
              });
            }
            if (secondUomId && secondUom && secondUomName) {
              record.set('secondUomObj', {
                uomId: secondUomId,
                uomName: secondUomName,
                uomCode: secondUom,
              });
            }
            if (secondUomId) {
              record.fields.get('secondDemandQty').set('disabled', false);
            } else {
              record.fields.get('secondDemandQty').set('disabled', true);
            }
          }
        }
        if (name === 'sourceDocTypeObj') {
          record.set('sourceDocObj', null);
          record.set('sourceDocLineObj', null);
        }
        if (name === 'sourceDocObj') {
          record.set('sourceDocLineObj', null);
        }
        if (name === 'soLineNum') {
          if (!isEmpty(record.get('soLineNum'))) {
            record.fields.get('soNum').set('required', true);
          } else {
            record.fields.get('soNum').set('required', false);
          }
        }
        if (name === 'customerLinePo') {
          if (!isEmpty(record.get('customerLinePo'))) {
            record.fields.get('customerPo').set('required', true);
          } else {
            record.fields.get('customerPo').set('required', false);
          }
        }
        if (name === 'sourceDocTypeObj') {
          if (!isEmpty(record.get('sourceDocTypeObj'))) {
            record.fields.get('sourceDocObj').set('required', true);
          } else {
            record.fields.get('sourceDocObj').set('required', false);
          }
        }
      },
    },
  };
};

export { DemandOrderQueryDS, DemandOrderListDS, DemandDetailDS };
