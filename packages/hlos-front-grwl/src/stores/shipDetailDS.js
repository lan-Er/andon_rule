/*
 * @module: 发货单平台详情
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-20 10:28:06
 * @LastEditTime: 2021-04-20 10:28:58
 * @copyright: Copyright (c) 2020,Hand
 */
import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS, HLOS_LSOP } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const preCode = 'lwms.shipPlatform.model';
const commonCode = 'lwms.common.model';
const { common, lwmsShipPlatform } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const headUrl = `${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/ship-order`;
// const lineUrl = `${HLOS_LWMS}/v1/${organizationId}/ship-order-lines`;
const lineCreateUrl = `${HLOS_LSOP}/v1/${organizationId}/so-lines/query-so-line-data`;

const commonHeadFields = [
  {
    name: 'shipOrderTypeObj',
    type: 'object',
    label: intl.get(`${preCode}.shipReturnType`).d('退货单类型'),
    lovCode: common.documentType,
    ignore: 'always',
  },
  {
    name: 'shipOrderTypeId',
    bind: 'shipOrderTypeObj.documentTypeId',
  },
  {
    name: 'shipOrderTypeCode',
    bind: 'shipOrderTypeObj.documentTypeCode',
  },
  {
    name: 'shipOrderTypeName',
    bind: 'shipOrderTypeObj.documentTypeName',
    ignore: 'always',
  },
  {
    name: 'organizationObj',
    type: 'object',
    label: intl.get(`${preCode}.shipOrg`).d('发运组织'),
    lovCode: common.organization,
    ignore: 'always',
    required: true,
    noCache: true,
  },
  {
    name: 'organizationId',
    type: 'string',
    bind: 'organizationObj.organizationId',
  },
  {
    name: 'organizationCode',
    type: 'string',
    bind: 'organizationObj.organizationCode',
  },
  {
    name: 'organizationName',
    type: 'string',
    bind: 'organizationObj.organizationName',
  },
  {
    name: 'warehouseObj',
    type: 'object',
    label: intl.get(`${preCode}.warehouse`).d('发运仓库'),
    lovCode: common.warehouse,
    cascadeMap: {
      organizationId: 'organizationId',
    },
    ignore: 'always',
    noCache: true,
  },
  {
    name: 'warehouseName',
    type: 'string',
    bind: 'warehouseObj.warehouseName',
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
    name: 'wmAreaObj',
    type: 'object',
    label: intl.get(`${preCode}.wmArea`).d('发运货位'),
    lovCode: common.wmArea,
    cascadeMap: {
      warehouseId: 'warehouseId',
    },
    ignore: 'always',
    noCache: true,
  },
  {
    name: 'wmAreaName',
    type: 'string',
    bind: 'wmAreaObj.wmAreaName',
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
    name: 'creatorObj',
    type: 'object',
    label: intl.get(`${preCode}.creator`).d('制单人'),
    lovCode: common.worker,
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('organizationId'),
      }),
    },
    ignore: 'always',
    noCache: true,
  },
  {
    name: 'creatorId',
    type: 'string',
    bind: 'creatorObj.workerId',
  },
  {
    name: 'creator',
    type: 'string',
    bind: 'creatorObj.workerCode',
  },
  {
    name: 'creatorName',
    type: 'string',
    bind: 'creatorObj.workerName',
  },
  {
    name: 'planShipDate',
    type: 'date',
    label: intl.get(`${preCode}.planShippedTime`).d('计划发运时间'),
    transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : ''),
  },
  {
    name: 'shippingMethod',
    type: 'string',
    label: intl.get(`${preCode}.shippingMethod`).d('发运方式'),
    lookupCode: lwmsShipPlatform.shippingMethod,
  },
  {
    name: 'freight',
    type: 'number',
    label: intl.get(`${preCode}.freight`).d('运费'),
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
    name: 'currencyName',
    type: 'string',
    bind: 'currencyObj.currencyName',
  },
  {
    name: 'carrier',
    label: intl.get(`${preCode}.carrier`).d('承运人'),
  },
  {
    name: 'carrierContact',
    label: intl.get(`${preCode}.carrierContact`).d('承运人联系方式'),
  },
];

export const detailHeadDS = () => {
  return {
    autoCreate: true,
    selection: false,
    primaryKey: 'shipOrderId',
    fields: [
      ...commonHeadFields,
      {
        name: 'soNumObj',
        type: 'object',
        label: intl.get(`${preCode}.so`).d('销售订单'),
        lovCode: lwmsShipPlatform.poNum,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
            shipReturn: 1,
          }),
        },
        ignore: 'always',
        noCache: true,
        required: true,
      },
      {
        name: 'soId',
        type: 'string',
        bind: 'soNumObj.soHeaderId',
      },
      {
        name: 'soNum',
        type: 'string',
        bind: 'soNumObj.soHeaderNumber',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
        noCache: true,
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
        name: 'customerId',
        bind: 'soNumObj.customerId',
      },
      {
        name: 'customerNumber',
        bind: 'soNumObj.customerNumber',
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${preCode}.customer`).d('客户'),
        disabled: true,
        bind: 'soNumObj.partyName',
      },
      {
        name: 'customerSiteId',
        bind: 'soNumObj.customerSiteId',
      },
      {
        name: 'customerSiteNumber',
        bind: 'soNumObj.customerSiteNumber',
      },
      {
        name: 'customerSiteName',
        type: 'string',
        label: intl.get(`${preCode}.customerSite`).d('客户地点'),
        disabled: true,
        bind: 'soNumObj.customerSiteName',
      },
      {
        name: 'customerAddress',
        type: 'string',
        label: intl.get(`${preCode}.receiveAddress`).d('客户地址'),
        bind: 'soNumObj.address',
      },
      {
        name: 'sopOuId',
        bind: 'soNumObj.sopOuId',
      },
      {
        name: 'sopOuCode',
        bind: 'soNumObj.sopOuCode',
      },
      {
        name: 'sopOuName',
        type: 'string',
        label: intl.get(`${preCode}.sopOu`).d('销售中心'),
        bind: 'soNumObj.sopOuName',
        disabled: true,
      },
      {
        name: 'salesmanId',
        bind: 'soNumObj.salesmanId',
      },
      {
        name: 'salesman',
        bind: 'soNumObj.salesman',
      },
      {
        name: 'salesmanName',
        type: 'string',
        label: intl.get(`${preCode}.salesman`).d('销售员'),
        bind: 'soNumObj.salesmanName',
        disabled: true,
      },
      //       k)  发货单组  ：文本框，非必输；
      // l)  审批策略   ：下拉选中，非必输，列表值取自独立值集LMDS.APPROVAL_RULE
      // m)  工作流  ：值列表，非必输，列表值取自值集LMDS.PROCESS_DEFINITION
      {
        name: 'shipOrderGroup',
        label: intl.get(`${preCode}.shipOrderGroup`).d('发货单组'),
      },
      {
        name: 'approvalRule',
        label: intl.get(`${preCode}.approvalRule`).d('审批策略'),
        lookupCode: 'LMDS.APPROVAL_RULE',
      },
      {
        name: 'approvalWorkflow',
        label: intl.get(`${preCode}.approvalWorkflow`).d('审批工作流'),
        // lovCode: lwmsShipPlatform.poNum,
        lovCode: 'LMDS.PROCESS_DEFINITION',
      },
      {
        name: 'customerPoAndLine',
        label: intl.get(`${preCode}.customerPo`).d('客户采购订单'),
        disabled: true,
      },
      {
        name: 'customerPo',
        type: 'string',
        label: intl.get(`${preCode}.customerPo`).d('客户采购订单'),
        bind: 'soNumObj.customerPo',
        disabled: true,
      },
      {
        name: 'customerPoLine',
        bind: 'soNumObj.customerPoLine',
      },
      {
        name: 'customerContact',
        type: 'string',
        label: intl.get(`${preCode}.customerContact`).d('客户联系人'),
        bind: 'soNumObj.customerContact',
      },
      {
        name: 'contactEmail',
        type: 'string',
        label: intl.get(`${preCode}.email`).d('邮箱'),
        bind: 'soNumObj.contactEmail',
      },
      {
        name: 'contactPhone',
        type: 'string',
        label: intl.get(`${preCode}.phone`).d('电话'),
        bind: 'soNumObj.contactPhone',
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
    ],
    transport: {
      read: () => ({
        url: headUrl,
        method: 'GET',
      }),
    },
    events: {
      update: ({ name, record }) => {
        if (name === 'warehouseObj') {
          record.set('wmAreaObj', null);
        }
        const soNumObj = record.get('soNumObj');
        if (name === 'soNumObj' && !isEmpty(soNumObj)) {
          const { customerPo, customerPoLine } = soNumObj;
          if (customerPo && customerPoLine) {
            record.set('customerPoAndLine', `${customerPo}-${customerPoLine}`);
          } else if (customerPo && !customerPoLine) {
            record.set('customerPoAndLine', customerPo);
          }
        }
      },
    },
  };
};

export const detailLineDS = () => {
  return {
    primaryKey: 'shipOrderId',
    pageSize: 100,
    fields: [
      {
        name: 'organizationId',
      },
      {
        name: 'shipLineNum',
        type: 'string',
        label: intl.get(`${preCode}.shipLineNum`).d('行号'),
        disabled: true,
      },
      {
        name: 'soHeaderId',
        type: 'string',
        label: intl.get(`${preCode}.soId`).d('销售订单号ID'),
      },
      {
        name: 'soNum',
        type: 'string',
        label: intl.get(`${preCode}.soNum`).d('销售订单'),
        disabled: true,
      },
      {
        name: 'soLineNum',
        type: 'string',
        label: intl.get(`${preCode}.soLine`).d('销售订单行'),
        disabled: true,
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
        noCache: true,
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
        type: 'string',
        label: intl.get(`${preCode}.itemDescription`).d('物料描述'),
        bind: 'itemObj.description',
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
        name: 'applyQty',
        type: 'number',
        label: intl.get(`${preCode}.applyQty`).d('申请数量'),
        required: true,
      },
      {
        name: 'undoQty',
        type: 'number',
        label: intl.get(`${preCode}.undoQty`).d('未发数量'),
      },
      {
        name: 'shippedQty',
        type: 'number',
      },
      {
        name: 'demandQty',
        type: 'number',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.warehouse`).d('发运仓库'),
        lovCode: common.warehouse,
        cascadeMap: {
          organizationId: 'organizationId',
        },
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'warehouseName',
        type: 'string',
        bind: 'warehouseObj.warehouseName',
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
        name: 'wmAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.wmArea`).d('发运货位'),
        lovCode: common.wmArea,
        cascadeMap: {
          warehouseId: 'warehouseId',
        },
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'wmAreaName',
        type: 'string',
        bind: 'wmAreaObj.wmAreaName',
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
        name: 'promiseShipDate',
        type: 'date',
        label: intl.get(`${preCode}.promiseShipDate`).d('承诺日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'demandDate',
        type: 'date',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'shipRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.shipRule`).d('发运规则'),
        lovCode: common.rule,
        lovPara: {
          ruleType: 'SHIP',
        },
        ignore: 'always',
      },
      {
        name: 'shipRuleId',
        type: 'string',
        bind: 'shipRuleObj.ruleId',
      },
      {
        name: 'shipRuleCode',
        type: 'string',
        bind: 'shipRuleObj.ruleCode',
      },
      {
        name: 'shipRuleName',
        type: 'string',
        bind: 'shipRuleObj.ruleName',
      },
      {
        name: 'shipRule',
        type: 'string',
        bind: 'shipRuleObj.ruleJson',
      },
      {
        name: 'reservationRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.reservationRule`).d('预留规则'),
        lovCode: common.rule,
        lovPara: {
          ruleType: 'RESERVATION',
        },
        ignore: 'always',
      },
      {
        name: 'reservationRuleId',
        type: 'string',
        bind: 'reservationRuleObj.ruleId',
      },
      {
        name: 'reservationRuleCode',
        type: 'string',
        bind: 'reservationRuleObj.ruleCode',
      },
      {
        name: 'reservationRuleName',
        type: 'string',
        bind: 'reservationRuleObj.ruleName',
      },
      {
        name: 'reservationRule',
        type: 'string',
        bind: 'reservationRuleObj.ruleJson',
      },
      {
        name: 'pickRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.pickRule`).d('拣货规则'),
        lovCode: common.rule,
        lovPara: {
          ruleType: 'PICK',
        },
        ignore: 'always',
      },
      {
        name: 'pickRuleId',
        type: 'string',
        bind: 'pickRuleObj.ruleId',
      },
      {
        name: 'pickRuleCode',
        type: 'string',
        bind: 'pickRuleObj.ruleCode',
      },
      {
        name: 'pickRuleName',
        type: 'string',
        bind: 'pickRuleObj.ruleName',
      },
      {
        name: 'pickRule',
        type: 'string',
        bind: 'pickRuleObj.ruleJson',
      },
      {
        name: 'packingRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.packingRule`).d('装箱规则'),
        lovCode: common.rule,
        lovPara: {
          ruleType: 'PACKING',
        },
        ignore: 'always',
      },
      {
        name: 'packingRuleId',
        type: 'string',
        bind: 'packingRuleObj.ruleId',
      },
      {
        name: 'packingRuleCode',
        type: 'string',
        bind: 'packingRuleObj.ruleCode',
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
        name: 'wmInspectRuleObj',
        type: 'object',
        label: intl.get(`${preCode}.wmInspectRule`).d('质检规则'),
        lovCode: common.rule,
        ignore: 'always',
      },
      {
        name: 'wmInspectRuleId',
        type: 'string',
        bind: 'wmInspectRuleObj.ruleId',
      },
      {
        name: 'wmInspectRuleCode',
        type: 'string',
        bind: 'wmInspectRuleObj.ruleCode',
      },
      {
        name: 'wmInspectRuleName',
        type: 'string',
        bind: 'wmInspectRuleObj.ruleName',
      },
      {
        name: 'wmInspectRule',
        type: 'string',
        bind: 'wmInspectRuleObj.ruleJson',
      },
      {
        name: 'fifoRuleObj',
        type: 'object',
        ignore: 'always',
        lovCode: common.rule,
        label: intl.get(`${preCode}.fifoRule`).d('FIFO规则'),
        lovPara: {
          ruleType: 'FIFO',
        },
      },
      {
        name: 'fifoRuleId',
        type: 'string',
        bind: 'fifoRuleObj.ruleId',
      },
      {
        name: 'fifoRuleCode',
        type: 'string',
        bind: 'fifoRuleObj.ruleCode',
      },
      {
        name: 'fifoRuleName',
        type: 'string',
        bind: 'fifoRuleObj.ruleName',
      },
      {
        name: 'fifoRule',
        type: 'string',
        bind: 'fifoRuleObj.ruleJson',
      },
      {
        name: 'packingFormat',
        type: 'string',
        label: intl.get(`${preCode}.packingFormat`).d('包装方式'),
        lookupCode: lwmsShipPlatform.packingFormat,
      },
      {
        name: 'packingQty',
        type: 'number',
        label: intl.get(`${preCode}.packingQty`).d('单位包装数'),
        min: 0,
      },
      {
        name: 'minPackingQty',
        type: 'number',
        label: intl.get(`${preCode}.minPackingQty`).d('最小包装数'),
        min: 0,
      },
      {
        name: 'containerQty',
        type: 'number',
        label: intl.get(`${preCode}.containerQty`).d('箱数'),
        min: 0,
        step: 1,
      },
      {
        name: 'palletContainerQty',
        type: 'number',
        label: intl.get(`${preCode}.palletQty`).d('托盘数'),
        min: 0,
        step: 1,
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
        label: intl.get(`${commonCode}.lotNumber`).d('指定批次'),
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${preCode}.tagCode`).d('指定标签'),
      },
      {
        name: 'customerPo',
        type: 'string',
        label: intl.get(`${preCode}.customerPo`).d('客户PO'),
      },
      {
        name: 'customerPoLine',
        type: 'string',
        label: intl.get(`${preCode}.customerPOLine`).d('客户PO行'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${preCode}.customerItem`).d('客户物料'),
        disabled: true,
      },
      {
        name: 'customerItemDesc',
        type: 'string',
        label: intl.get(`${preCode}.customerItemDesc`).d('客户物料描述'),
        disabled: true,
      },
      {
        name: 'secondUomObj',
        type: 'object',
        noCache: true,
        ignore: 'always',
        lovCode: common.uom,
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      },
      {
        name: 'secondUomId',
        type: 'string',
        bind: 'secondUomObj.uomId',
      },
      {
        name: 'secondUom',
        type: 'string',
        bind: 'secondUomObj.uomCode',
      },
      {
        name: 'secondUomName',
        type: 'string',
        bind: 'secondUomObj.uomName',
      },
      {
        name: 'secondApplyQty',
        type: 'number',
        label: intl.get(`${preCode}.secondUomQty`).d('辅助单位数量'),
      },
      {
        name: 'itemControlType',
        type: 'string',
        lookupCode: common.itemControlType,
        label: intl.get(`${preCode}.itemControlType`).d('物料控制类型'),
      },
      {
        name: 'customerReceiveType',
        type: 'string',
        label: intl.get(`${commonCode}.customerReceiveType`).d('客户接收类型'),
      },
      {
        name: 'customerReceiveOrg',
        type: 'string',
        label: intl.get(`${commonCode}.customerReceiveOrg`).d('客户接收组织'),
      },
      {
        name: 'customerReceiveWm',
        type: 'string',
        label: intl.get(`${commonCode}.customerReceiveWm`).d('客户接收仓库'),
      },
      {
        name: 'customerInventoryWm',
        type: 'string',
        label: intl.get(`${commonCode}.customerInventoryWm`).d('客户入库'),
      },
      {
        name: 'lineRemark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { shipOrderId, queryData } = data;
        return {
          url: lineCreateUrl,
          method: 'GET',
          data: { shipOrderId, ...queryData },
        };
      },
    },
    events: {
      update: ({ name, record }) => {
        if (name === 'warehouseObj') {
          record.set('wmAreaObj', null);
        }
      },
    },
  };
};

export const normalHeadDS = () => ({
  autoCreate: true,
  selection: false,
  primaryKey: 'shipOrderId',
  children: {
    shipOrderLineList: new DataSet(normalLineDS()),
  },
  fields: [
    ...commonHeadFields,
    {
      name: 'shipOrderNum',
      type: 'string',
      label: intl.get(`${preCode}.shipOrderNum`).d('发运单号'),
      disabled: true,
    },
    {
      name: 'sopOuObj',
      type: 'object',
      label: intl.get(`${preCode}.soOrg`).d('销售组织'),
      lovCode: common.sopOu,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'sopOuId',
      bind: 'sopOuObj.sopOuId',
    },
    {
      name: 'sopOuCode',
      bind: 'sopOuObj.sopOuCode',
    },
    {
      name: 'sopOuName',
      bind: 'sopOuObj.sopOuName',
      ignore: 'always',
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${preCode}.customer`).d('客户'),
      lovCode: lwmsShipPlatform.customer,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        required: ({ record }) => {
          if (record.get('customerName')) {
            return false;
          }
          return true;
        },
      },
    },
    {
      name: 'customerId',
      bind: 'customerObj.customerId',
    },
    {
      name: 'customerNumber',
      bind: 'customerObj.customerNumber',
    },
    {
      name: 'customer',
      bind: 'customerObj.customerName',
      ignore: 'always',
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${preCode}.customerName`).d('客户名称'),
      dynamicProps: {
        required: ({ record }) => {
          if (record.get('customerId')) {
            return false;
          }
          return true;
        },
      },
    },
    {
      name: 'customerSiteObj',
      type: 'object',
      label: intl.get(`${preCode}.customerSite`).d('客户地点'),
      lovCode: common.customerSite,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          customerId: record.get('customerId'),
        }),
      },
    },
    {
      name: 'customerSiteId',
      bind: 'customerSiteObj.customerSiteId',
    },
    {
      name: 'customerSiteNumber',
      bind: 'customerSiteObj.customerSiteNumber',
    },
    {
      name: 'customerSiteName',
      bind: 'customerSiteObj.customerSiteName',
    },
    {
      name: 'customerAddress',
      type: 'string',
      label: intl.get(`${preCode}.customerAddress`).d('客户地址'),
    },
    {
      name: 'customerContact',
      type: 'string',
      label: intl.get(`${preCode}.customerContact`).d('客户联系人'),
    },
    {
      name: 'contactPhone',
      type: 'string',
      label: intl.get(`${preCode}.contactPhone`).d('联系人电话'),
    },
    {
      name: 'contactEmail',
      type: 'string',
      label: intl.get(`${preCode}.contactEmail`).d('联系人邮箱'),
    },
    {
      name: 'salesmanObj',
      type: 'object',
      label: intl.get(`${preCode}.salesman`).d('销售员'),
      lovCode: common.worker,
      ignore: 'always',
      lovPara: { workerType: 'SALESMAN' },
    },
    {
      name: 'salesmanId',
      bind: 'salesmanObj.workerId',
    },
    {
      name: 'salesman',
      bind: 'salesmanObj.workerCode',
    },
    {
      name: 'salesman',
      bind: 'salesmanObj.workerName',
      ignore: 'always',
    },
    {
      name: 'shipOrderGroup',
      label: intl.get(`${preCode}.shipOrderGroup`).d('发货单组'),
    },
    {
      name: 'approvalRule',
      label: intl.get(`${preCode}.approvalRule`).d('审批策略'),
      lookupCode: 'LMDS.APPROVAL_RULE',
    },
    {
      name: 'approvalWorkflow',
      label: intl.get(`${preCode}.approvalWorkflow`).d('审批工作流'),
      lovCode: 'LMDS.PROCESS_DEFINITION',
    },
    {
      name: 'plateNum',
      type: 'string',
      label: intl.get(`${preCode}.plateNum`).d('车牌号'),
    },
    {
      name: 'shipTicket',
      type: 'string',
      label: intl.get(`${preCode}.shipTicket`).d('快递单号'),
    },
    {
      name: 'expectedArrivalDate',
      type: 'date',
      label: intl.get(`${preCode}.expectedArrivalDate`).d('预计到达时间'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
      if (name === 'customerObj') {
        if (record.get('customerObj') && !record.get('customerSiteObj')) {
          record.set('customerAddress', record.get('customerObj').address);
          record.set('customerContact', record.get('customerObj').contact);
          record.set('contactPhone', record.get('customerObj').phoneNumber);
          record.set('contactEmail', record.get('customerObj').email);
        }
      }
      if (name === 'customerSiteObj') {
        if (record.get('customerSiteObj')) {
          record.set('customerAddress', record.get('customerSiteObj').address);
          record.set('customerContact', record.get('customerSiteObj').contact);
          record.set('contactPhone', record.get('customerSiteObj').phoneNumber);
          record.set('contactEmail', record.get('customerSiteObj').email);
        }
      }
    },
  },
});

export const normalLineDS = () => ({
  primaryKey: 'shipOrderId',
  pageSize: 100,
  selection: false,
  fields: [
    {
      name: 'shipLineNum',
      type: 'string',
      label: intl.get(`${preCode}.shipLineNum`).d('行号'),
      disabled: true,
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
      noCache: true,
      required: true,
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
      type: 'string',
      label: intl.get(`${preCode}.itemDescription`).d('物料描述'),
      bind: 'itemObj.description',
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
      name: 'applyQty',
      type: 'number',
      label: intl.get(`${preCode}.shippedQty`).d('申请数量'),
      required: true,
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.warehouse`).d('发运仓库'),
      lovCode: common.warehouse,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'warehouseName',
      bind: 'warehouseObj.warehouseName',
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
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.wmArea`).d('发运货位'),
      lovCode: common.wmArea,
      cascadeMap: {
        warehouseId: 'warehouseId',
      },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'wmAreaName',
      bind: 'wmAreaObj.wmAreaName',
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
      name: 'toWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.toWarehouse`).d('目标仓库'),
      lovCode: common.warehouse,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'toWarehouseName',
      bind: 'toWarehouseObj.warehouseName',
    },
    {
      name: 'toWarehouseId',
      bind: 'toWarehouseObj.warehouseId',
    },
    {
      name: 'toWarehouseCode',
      bind: 'toWarehouseObj.warehouseCode',
    },
    {
      name: 'toWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.toWmArea`).d('目标货位'),
      lovCode: common.wmArea,
      cascadeMap: {
        warehouseId: 'toWarehouseId',
      },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'toWmAreaName',
      bind: 'toWmAreaObj.wmAreaName',
    },
    {
      name: 'toWmAreaId',
      bind: 'toWmAreaObj.wmAreaId',
    },
    {
      name: 'toWmAreaCode',
      bind: 'toWmAreaObj.wmAreaCode',
    },
    {
      name: 'soNum',
      type: 'string',
      label: intl.get(`${preCode}.soNum`).d('销售订单号'),
    },
    {
      name: 'soLineNum',
      type: 'number',
      min: 1,
      step: 1,
      label: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
    },
    {
      name: 'customerItemCode',
      type: 'string',
      label: intl.get(`${preCode}.customerItemCode`).d('客户物料'),
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
      name: 'secondApplyQty',
      type: 'number',
      label: intl.get(`${preCode}.secondUomQty`).d('辅助单位数量'),
    },
    {
      name: 'secondUomObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      lovCode: common.uom,
      label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
    },
    {
      name: 'secondUomId',
      bind: 'secondUomObj.uomId',
    },
    {
      name: 'secondUom',
      bind: 'secondUomObj.uomName',
    },
    {
      name: 'shipRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.shipRule`).d('发运规则'),
      lovCode: common.rule,
      lovPara: {
        ruleType: 'SHIP',
      },
      ignore: 'always',
    },
    {
      name: 'shipRuleId',
      bind: 'shipRuleObj.ruleId',
    },
    {
      name: 'shipRuleCode',
      bind: 'shipRuleObj.ruleCode',
    },
    {
      name: 'shipRuleName',
      type: 'string',
      bind: 'shipRuleObj.ruleName',
    },
    {
      name: 'shipRule',
      type: 'string',
      bind: 'shipRuleObj.ruleJson',
    },
    {
      name: 'pickRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.pickRule`).d('拣货规则'),
      lovCode: common.rule,
      lovPara: {
        ruleType: 'PICK',
      },
      ignore: 'always',
    },
    {
      name: 'pickRuleId',
      bind: 'pickRuleObj.ruleId',
    },
    {
      name: 'pickRuleCode',
      bind: 'pickRuleObj.ruleCode',
    },
    {
      name: 'pickRuleName',
      bind: 'pickRuleObj.ruleName',
    },
    {
      name: 'pickRule',
      type: 'string',
      bind: 'pickRuleObj.ruleJson',
    },
    {
      name: 'reservationRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.reservationRule`).d('预留规则'),
      lovCode: common.rule,
      lovPara: {
        ruleType: 'RESERVATION',
      },
      ignore: 'always',
    },
    {
      name: 'reservationRuleId',
      bind: 'reservationRuleObj.ruleId',
    },
    {
      name: 'reservationRuleCode',
      bind: 'reservationRuleObj.ruleCode',
    },
    {
      name: 'reservationRuleName',
      type: 'string',
      bind: 'reservationRuleObj.ruleName',
    },
    {
      name: 'reservationRule',
      type: 'string',
      bind: 'reservationRuleObj.ruleJson',
    },
    {
      name: 'packingRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.packingRule`).d('装箱规则'),
      lovCode: common.rule,
      lovPara: {
        ruleType: 'PACKING',
      },
      ignore: 'always',
    },
    {
      name: 'packingRuleId',
      bind: 'packingRuleObj.ruleId',
    },
    {
      name: 'packingRuleCode',
      bind: 'packingRuleObj.ruleCode',
    },
    {
      name: 'packingRuleName',
      bind: 'packingRuleObj.ruleName',
    },
    {
      name: 'packingRule',
      type: 'string',
      bind: 'packingRuleObj.ruleJson',
    },
    // add
    {
      name: 'wmInspectRuleObj',
      type: 'object',
      label: intl.get(`${preCode}.wmInspectRule`).d('质检规则'),
      lovCode: common.rule,
      ignore: 'always',
    },
    {
      name: 'wmInspectRuleId',
      type: 'string',
      bind: 'wmInspectRuleObj.ruleId',
    },
    {
      name: 'wmInspectRuleCode',
      type: 'string',
      bind: 'wmInspectRuleObj.ruleCode',
    },
    {
      name: 'wmInspectRuleName',
      type: 'string',
      bind: 'wmInspectRuleObj.ruleName',
    },
    {
      name: 'wmInspectRule',
      type: 'string',
      bind: 'wmInspectRuleObj.ruleJson',
    },
    {
      name: 'fifoRuleObj',
      type: 'object',
      ignore: 'always',
      lovCode: common.rule,
      label: intl.get(`${preCode}.fifoRule`).d('FIFO规则'),
      lovPara: {
        ruleType: 'FIFO',
      },
    },
    {
      name: 'fifoRuleId',
      type: 'string',
      bind: 'fifoRuleObj.ruleId',
    },
    {
      name: 'fifoRuleCode',
      type: 'string',
      bind: 'fifoRuleObj.ruleCode',
    },
    {
      name: 'fifoRuleName',
      type: 'string',
      bind: 'fifoRuleObj.ruleName',
    },
    {
      name: 'fifoRule',
      type: 'string',
      bind: 'fifoRuleObj.ruleJson',
    },
    {
      name: 'packingFormat',
      type: 'string',
      label: intl.get(`${preCode}.packingFormat`).d('包装方式'),
      lookupCode: lwmsShipPlatform.packingFormat,
    },
    {
      name: 'packingQty',
      type: 'number',
      label: intl.get(`${preCode}.packingQty`).d('单位包装数'),
      min: 0,
    },
    {
      name: 'minPackingQty',
      type: 'number',
      label: intl.get(`${preCode}.minPackingQty`).d('最小包装数'),
      min: 0,
    },
    {
      name: 'containerQty',
      type: 'number',
      label: intl.get(`${preCode}.containerQty`).d('箱数'),
      min: 0,
      step: 1,
    },
    {
      name: 'palletContainerQty',
      type: 'number',
      label: intl.get(`${preCode}.palletQty`).d('托盘数'),
      min: 0,
      step: 1,
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
      label: intl.get(`${commonCode}.lotNumber`).d('指定批次'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tagCode`).d('指定标签'),
    },
    {
      name: 'itemControlType',
      type: 'string',
      lookupCode: common.itemControlType,
      label: intl.get(`${preCode}.itemControlType`).d('物料控制类型'),
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'warehouseObj') {
        record.set('wmAreaObj', null);
      }
      if (name === 'toWarehouseObj') {
        record.set('toWmAreaObj', null);
      }
      if (name === 'itemObj') {
        record.set('pickRule', record.get('itemObj').pickRule);
        record.set('pickRuleId', record.get('itemObj').pickRuleId);
        record.set('pickRuleName', record.get('itemObj').pickRuleName);
        record.set('shipRule', record.get('itemObj').shipRule);
        record.set('shipRuleId', record.get('itemObj').shipRuleId);
        record.set('shipRuleName', record.get('itemObj').shipRuleName);
        record.set('reservationRule', record.get('itemObj').reservationRule);
        record.set('reservationRuleId', record.get('itemObj').reservationRuleId);
        record.set('reservationRuleName', record.get('itemObj').reservationRuleName);
        record.set('packingRule', record.get('itemObj').packingRule);
        record.set('packingRuleId', record.get('itemObj').packingRuleId);
        record.set('packingRuleName', record.get('itemObj').packingRuleName);
        record.set('wmInspectRule', record.get('itemObj').wmInspectRule);
        record.set('wmInspectRuleId', record.get('itemObj').wmInspectRuleId);
        record.set('wmInspectRuleName', record.get('itemObj').wmInspectRuleName);
        record.set('fifoRule', record.get('itemObj').fifoRule);
        record.set('fifoRuleId', record.get('itemObj').fifoRuleId);
        record.set('fifoRuleName', record.get('itemObj').fifoRuleName);
      }
    },
  },
});
