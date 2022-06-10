/**
 * @Description: 销售订单管理信息--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-01-10 14:18:08
 * @LastEditors: yu.na
 */
import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LSOP } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { common, lsopSalesOrder } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lsop.salesOrder.model';
const commonCode = 'lsop.common.model';

const SalesOrderListDS = () => {
  return {
    primaryKey: 'soHeaderId',
    selection: 'multiple',
    pageSize: 100,
    children: {
      soLineList: new DataSet(SalesOrderLineDS()),
    },
    queryFields: [
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
        name: 'soNumObj',
        type: 'object',
        label: intl.get(`${preCode}.soNum`).d('销售订单号'),
        lovCode: common.soNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            sopOuId: record.get('sopOuId'),
          }),
        },
      },
      {
        name: 'soId',
        type: 'string',
        bind: 'soNumObj.soHeaderId',
        ignore: 'always',
      },
      {
        name: 'soNum',
        type: 'string',
        bind: 'soNumObj.soHeaderNumber',
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
        name: 'soStatus',
        type: 'string',
        lookupCode: lsopSalesOrder.soStatus,
        label: intl.get(`${preCode}.soStatus`).d('订单状态'),
        multiple: true,
        defaultValue: ['NEW', 'APPROVING', 'RELEASED', 'SHIPPING'],
      },
      {
        name: 'shipOrganizationObj',
        type: 'object',
        label: intl.get(`${preCode}.shipOrg`).d('发运组织'),
        lovCode: common.organization,
        ignore: 'always',
      },
      {
        name: 'shipOrganizationId',
        type: 'string',
        bind: 'shipOrganizationObj.organizationId',
      },
      {
        name: 'shipOrganizationName',
        type: 'string',
        bind: 'shipOrganizationObj.organizationName',
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
        name: 'salesmanId',
        type: 'string',
        bind: 'salesmanObj.workerId',
      },
      {
        name: 'salesmanName',
        type: 'string',
        bind: 'salesmanObj.workerName',
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
        name: 'soTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.soType`).d('订单类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'SO' },
        ignore: 'always',
      },
      {
        name: 'soTypeId',
        type: 'string',
        bind: 'soTypeObj.documentTypeId',
      },
      {
        name: 'soTypeCode',
        type: 'string',
        bind: 'soTypeObj.documentTypeCode',
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
        name: 'startDemandDate',
        type: 'date',
        label: intl.get(`${preCode}.demandDateStart`).d('需求日期>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('endDemandDate')) {
              return 'endDemandDate';
            }
          },
        },
      },
      {
        name: 'endDemandDate',
        type: 'date',
        label: intl.get(`${preCode}.demandDateEnd`).d('需求日期<='),
        min: 'startDemandDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'customerOrderedTimeStart',
        type: 'date',
        label: intl.get(`${preCode}.customerOrderedTimeStart`).d('客户下单日期>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('customerOrderedTimeEnd')) {
              return 'customerOrderedTimeEnd';
            }
          },
        },
      },
      {
        name: 'customerOrderedTimeEnd',
        type: 'date',
        label: intl.get(`${preCode}.customerOrderedTimeEnd`).d('客户下单日期<='),
        min: 'customerOrderedTimeStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
    ],
    fields: [
      {
        name: 'sopOu',
        label: intl.get(`${preCode}.sopOu`).d('销售中心'),
      },
      {
        name: 'soNum',
        label: intl.get(`${preCode}.soNum`).d('销售订单号'),
      },
      {
        name: 'soTypeName',
        label: intl.get(`${preCode}.soType`).d('订单类型'),
      },
      {
        name: 'soStatusMeaning',
        label: intl.get(`${preCode}.soStatus`).d('订单状态'),
      },
      {
        name: 'salesmanName',
        label: intl.get(`${preCode}.salesman`).d('销售员'),
      },
      {
        name: 'customerName',
        label: intl.get(`${preCode}.customer`).d('客户'),
      },
      {
        name: 'customerSiteName',
        label: intl.get(`${preCode}.customerSite`).d('客户地点'),
      },
      {
        name: 'customerPo',
        label: intl.get(`${preCode}.customerPo`).d('客户PO'),
      },
      {
        name: 'customerPoLine',
        label: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
      },
      {
        name: 'customerOrderedTime',
        label: intl.get(`${preCode}.customerOrderedTime`).d('客户下单日期'),
      },
      {
        name: 'soConfirmedTime',
        label: intl.get(`${preCode}.soConfirmedTime`).d('订单确认日期'),
      },
      {
        name: 'customerContact',
        label: intl.get(`${preCode}.customerContact`).d('客户联系人'),
      },
      {
        name: 'contactPhone',
        label: intl.get(`${preCode}.contactPhone`).d('联系电话'),
      },
      {
        name: 'contactEmail',
        label: intl.get(`${preCode}.contactEmail`).d('联系邮箱'),
      },
      {
        name: 'receiveAddress',
        label: intl.get(`${preCode}.receiveAddress`).d('收货地址'),
      },
      {
        name: 'currencyName',
        label: intl.get(`${preCode}.currency`).d('币种'),
      },
      {
        name: 'totalAmount',
        label: intl.get(`${preCode}.totalAmount`).d('订单总价'),
      },
      {
        name: 'taxRate',
        label: intl.get(`${preCode}.taxRate`).d('税率'),
      },
      {
        name: 'exchangeRate',
        label: intl.get(`${preCode}.exchangeRate`).d('汇率'),
      },
      {
        name: 'paymentDeadlineMeaning',
        label: intl.get(`${preCode}.paymentDeadline`).d('付款期限'),
      },
      {
        name: 'paymentMethodMeaning',
        label: intl.get(`${preCode}.paymentMethod`).d('付款方式'),
      },
      {
        name: 'soVersion',
        label: intl.get(`${preCode}.soVersion`).d('订单版本'),
      },
      {
        name: 'approvalRuleMeaning',
        label: intl.get(`${preCode}.approvalRule`).d('审批策略'),
      },
      {
        name: 'approvalChart',
        label: intl.get(`${preCode}.approvalChart`).d('审批流程'),
      },
      {
        name: 'docProcessRuleName',
        label: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'externalId',
        label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        label: intl.get(`${preCode}}.externalNum`).d('外部编号'),
      },
      {
        name: 'creator',
        label: intl.get(`${preCode}}.creator`).d('创建人'),
      },
      {
        name: 'creationDate',
        label: intl.get(`${preCode}}.creationDate`).d('创建时间'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { soStatus: soStatusList } = data;
        return {
          url: generateUrlWithGetParam(`${HLOS_LSOP}/v1/${organizationId}/so-headers`, {
            soStatusList,
          }),
          data: {
            ...data,
            soStatus: undefined,
          },
          method: 'GET',
        };
      },
      destroy: () => {
        return {
          url: `${HLOS_LSOP}/v1/${organizationId}/so-headers/delete`,
          method: 'DELETE',
        };
      },
    },
  };
};

const commonLineFields = [
  {
    name: 'soLineNum',
    type: 'number',
    label: intl.get(`${preCode}.soLineNum`).d('行号'),
    min: 1,
    step: 1,
  },
  {
    name: 'itemObj',
    type: 'object',
    label: intl.get(`${commonCode}.item`).d('物料'),
    lovCode: common.itemSop,
    ignore: 'always',
    required: true,
  },
  {
    name: 'itemId',
    type: 'string',
    bind: 'itemObj.itemId',
  },
  {
    name: 'itemCode',
    label: intl.get(`${commonCode}.item`).d('物料'),
    type: 'string',
    bind: 'itemObj.itemCode',
  },
  {
    name: 'itemDescription',
    label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    type: 'string',
    bind: 'itemObj.description',
  },
  {
    name: 'featureCode',
    type: 'string',
    label: intl.get(`${preCode}.itemFeature`).d('物料特征值'),
  },
  {
    name: 'featureDesc',
    type: 'string',
    label: intl.get(`${preCode}.featureDesc`).d('特征值描述'),
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
    label: intl.get(`${commonCode}.uom`).d('单位'),
    type: 'string',
    bind: 'uomObj.uomName',
  },
  {
    name: 'demandQty',
    type: 'number',
    min: 0,
    label: intl.get(`${preCode}.demandQty`).d('需求数量'),
    required: true,
  },
  {
    name: 'demandDate',
    type: 'date',
    label: intl.get(`${preCode}.demandDate`).d('需求日期'),
    required: true,
    transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
  },
  {
    name: 'promiseDate',
    type: 'date',
    label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
    transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
  },
  {
    name: 'soLineTypeMeaning',
    label: intl.get(`${preCode}.soLineType`).d('行类型'),
  },
  {
    name: 'soLineType',
    type: 'string',
    label: intl.get(`${preCode}.soLineType`).d('行类型'),
    lookupCode: lsopSalesOrder.soLineType,
    defaultValue: 'SHIP',
    required: true,
  },
  {
    name: 'soLineStatusMeaning',
    label: intl.get(`${preCode}.soLineStatus`).d('行状态'),
  },
  {
    name: 'soLineStatus',
    type: 'string',
    label: intl.get(`${preCode}.soLineStatus`).d('行状态'),
    lookupCode: lsopSalesOrder.soLineStatus,
  },
  {
    name: 'unitPrice',
    type: 'number',
    label: intl.get(`${preCode}.unitPrice`).d('单价'),
    // 和单价一样 通过标准getItemCustomerAttributes API获取默认值
  },
  {
    name: 'lineAmount',
    type: 'number',
    label: intl.get(`${preCode}.lineAmount`).d('行总价'),
  },
  {
    name: 'customerItemCode',
    type: 'string',
    label: intl.get(`${preCode}.customerItem`).d('客户物料'),
    // 和单价一样 通过标准getItemCustomerAttributes API获取默认值
  },
  {
    name: 'customerItemDesc',
    type: 'string',
    label: intl.get(`${preCode}.customerItemDesc`).d('客户物料描述'),
    // 和单价一样 通过标准getItemCustomerAttributes API获取默认值
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
    name: 'secondUomObj',
    type: 'object',
    label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
    lovCode: common.uom,
    ignore: 'always',
    cascadeMap: { uomId: 'uomId' },
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
    label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
    bind: 'secondUomObj.uomName',
  },
  {
    name: 'secondDemandQty',
    type: 'number',
    label: intl.get(`${preCode}.secondDemandQty`).d('辅助单位数量'),
    dynamicProps: {
      disabled: ({ record }) => {
        if (record.get('secondUomId')) {
          return false;
        }
        return true;
      },
      required: ({ record }) => {
        if (record.get('secondUomId')) {
          return true;
        }
        return false;
      },
    },
  },
  {
    name: 'itemCategoryObj',
    type: 'object',
    label: intl.get(`${preCode}.itemCategory`).d('物料销售类别'),
    lovCode: common.categories,
    lovPara: { categorySetCode: 'ITEM_SOP' },
    ignore: 'always',
  },
  {
    name: 'itemCategoryId',
    type: 'string',
    bind: 'itemCategoryObj.categoryId',
  },
  {
    name: 'itemCategoryName',
    label: intl.get(`${preCode}.itemCategory`).d('物料销售类别'),
    type: 'string',
    bind: 'itemCategoryObj.categoryName',
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
    name: 'sourceDocTypeName',
    label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
    type: 'string',
    bind: 'sourceDocTypeObj.documentTypeName',
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
    cascadeMap: { sourceDocNum: 'sourceDocNum' },
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
  {
    name: 'lineRemark',
    type: 'string',
    label: intl.get(`${preCode}.lineRemark`).d('行备注'),
  },
  // add
  {
    name: 'plannedQty',
    type: 'number',
    label: intl.get(`${preCode}.plannedQty`).d('已计划数量'),
  },
  {
    name: 'shippedQty',
    type: 'number',
    label: intl.get(`${preCode}.shippedQty`).d('发货数量'),
  },
  {
    name: 'returnedQty',
    type: 'number',
    label: intl.get(`${preCode}.returnedQty`).d('退货数量'),
  },
  {
    name: 'planShipDate',
    type: 'date',
    label: intl.get(`${preCode}.planShipDate`).d('计划交货日期'),
    transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
  },
  {
    name: 'applyShipDate',
    type: 'date',
    label: intl.get(`${preCode}.applyShipDate`).d('请求发运日期'),
    transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
  },
  {
    name: 'lastShippedDate',
    type: 'date',
    label: intl.get(`${preCode}.lastShippedDate`).d('最近发运日期'),
    transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
  },
  {
    name: 'shipOrgObj',
    type: 'object',
    label: intl.get(`${preCode}.shipOrganization`).d('发运组织'),
    lovCode: common.organization,
    ignore: 'always',
    required: true,
  },
  {
    name: 'shipOrganizationId',
    type: 'string',
    bind: 'shipOrgObj.organizationId',
  },
  {
    name: 'shipOrganizationName',
    type: 'string',
    label: intl.get(`${preCode}.shipOrganization`).d('发运组织'),
    bind: 'shipOrgObj.organizationName',
  },
  // {
  //   name: 'shipOrganizationName',
  //   label: intl.get(`${preCode}.shipOrganization`).d('发运组织'),
  // },
  {
    name: 'warehouseObj',
    type: 'object',
    label: intl.get(`${preCode}.receiveWarehouse`).d('发运仓库'),
    lovCode: common.warehouse,
    ignore: 'always',
    dynamicProps: {
      lovPara: ({ record }) => ({
        organizationId: record.get('shipOrganizationId'),
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
  },
  {
    name: 'warehouse',
    label: intl.get(`${preCode}.receiveWarehouse`).d('发运仓库'),
  },
  {
    name: 'wmAreaObj',
    type: 'object',
    label: intl.get(`${preCode}.receiveWmArea`).d('发运货位'),
    lovCode: common.wmArea,
    ignore: 'always',
    dynamicProps: {
      lovPara: ({ record }) => ({
        warehouseId: record.get('warehouseId'),
      }),
    },
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
  },
  {
    name: 'wmArea',
    label: intl.get(`${preCode}.receiveWmArea`).d('发运货位'),
  },
  {
    name: 'shipSiteObj',
    type: 'object',
    label: intl.get(`${preCode}.shipToSiteName`).d('发运地点'),
    lovCode: common.customerSite,
    ignore: 'always',
  },
  {
    name: 'shipToSiteId',
    type: 'string',
    bind: 'shipSiteObj.customerSiteId',
  },
  {
    name: 'shipToSiteName',
    label: intl.get(`${preCode}.shipToSiteName`).d('发运地点'),
    type: 'string',
    bind: 'shipSiteObj.customerSiteName',
  },
  {
    name: 'customerReceiveOrg',
    type: 'string',
    label: intl.get(`${preCode}.customerReceiveOrg`).d('客户接收组织'),
  },
  {
    name: 'customerReceiveWm',
    type: 'string',
    label: intl.get(`${preCode}.customerReceiveWm`).d('客户接收仓库'),
  },
  {
    name: 'customerInventoryWm',
    type: 'string',
    label: intl.get(`${preCode}.customerInventoryWm`).d('客户入库仓库'),
  },
  {
    name: 'customerReceiveType',
    type: 'string',
    label: intl.get(`${preCode}.customerReceiveType`).d('客户接收类型'),
  },
  {
    name: 'shippingMethod',
    type: 'string',
    label: intl.get(`${preCode}.shippingMethod`).d('发运方式'),
    lookupCode: lsopSalesOrder.shipMethod,
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
    name: 'shipRuleName',
    type: 'string',
    label: intl.get(`${preCode}.shipRule`).d('发运规则'),
    bind: 'shipRuleObj.ruleName',
  },
  {
    name: 'shipRule',
    type: 'string',
    bind: 'shipRuleObj.ruleJson',
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
    name: 'packingRuleName',
    type: 'string',
    label: intl.get(`${preCode}.packingRule`).d('装箱规则'),
    bind: 'packingRuleObj.ruleName',
  },
  {
    name: 'packingRule',
    type: 'string',
    bind: 'packingRuleObj.ruleJson',
  },
  {
    name: 'packingFormat',
    type: 'string',
    label: intl.get(`${preCode}.packingFormat`).d('包装方式'),
    lookupCode: lsopSalesOrder.packingFormat,
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

const SalesOrderLineDS = () => {
  return {
    primaryKey: 'soLineId',
    selection: false,
    pageSize: 100,
    fields: commonLineFields,
    transport: {
      read: () => {
        return {
          url: `${HLOS_LSOP}/v1/${organizationId}/so-lines`,
          method: 'GET',
        };
      },
    },
  };
};

const DetailLineDS = () => {
  return {
    selection: 'multiple',
    pageSize: 100,
    primaryKey: 'soLineId',
    fields: commonLineFields,
    transport: {
      read: () => {
        return {
          url: `${HLOS_LSOP}/v1/${organizationId}/so-lines`,
          method: 'GET',
        };
      },
    },
    events: {
      update: ({ name, record, dataSet }) => {
        if (name === 'uomObj') {
          record.set('secondUomObj', null);
        }
        if (name === 'shipOrgObj') {
          record.set('warehouseObj', null);
          record.set('wmAreaObj', null);
        }
        if (name === 'warehouseObj') {
          record.set('wmAreaObj', null);
        }
        if (name === 'sourceDocTypeObj') {
          record.set('sourceDocObj', null);
          record.set('sourceDocLineObj', null);
        }
        if (name === 'sourceDocObj') {
          record.set('sourceDocLineObj', null);
        }
        if (name === 'demandQty' || name === 'unitPrice') {
          record.set('lineAmount', null);

          const demandQty = record.get('demandQty');
          const unitPrice = record.get('unitPrice');
          if (demandQty && unitPrice) {
            record.set('lineAmount', demandQty * unitPrice);
          }
        }
        if (name === 'lineAmount') {
          const amountArr = dataSet.records.map(
            (r) => r.data.soLineStatus !== 'CANCELLED' && r.data.lineAmount
          );
          dataSet.parent.current.set(
            'totalAmount',
            amountArr.filter((item) => item).reduce((a, b) => a + b, 0)
          );
        }
      },
    },
  };
};

const SoDetailDS = () => {
  return {
    autoCreate: true,
    selection: 'multiple',
    primaryKey: 'soHeaderId',
    pageSize: 10,
    children: {
      soLineList: new DataSet(DetailLineDS()),
    },
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
        name: 'soTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.soType`).d('订单类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'SO' },
        ignore: 'always',
        required: true,
      },
      {
        name: 'soTypeId',
        type: 'string',
        bind: 'soTypeObj.documentTypeId',
      },
      {
        name: 'soTypeCode',
        type: 'string',
        bind: 'soTypeObj.documentTypeCode',
      },
      {
        name: 'soTypeName',
        type: 'string',
        bind: 'soTypeObj.documentTypeName',
      },
      {
        name: 'docProcessRule',
        type: 'string',
        bind: 'soTypeObj.docProcessRule',
      },
      {
        name: 'docProcessRuleId',
        type: 'string',
        bind: 'soTypeObj.docProcessRuleId',
      },
      {
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${preCode}.customerNumber`).d('客户编号'),
        lovCode: common.customer,
        textField: 'customerNumber',
        ignore: 'always',
        required: true,
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
        label: intl.get(`${preCode}.customerName`).d('客户名称'),
        bind: 'customerObj.customerName',
      },
      {
        name: 'customerSiteObj',
        type: 'object',
        label: intl.get(`${preCode}.customerSite`).d('客户地点'),
        lovCode: common.customerSite,
        ignore: 'always',
        disabled: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            customerId: record.get('customerId'),
          }),
        },
        // 单据处理规则 customerSite为enable时必输 否则不可编辑
      },
      {
        name: 'customerSiteId',
        type: 'string',
        bind: 'customerSiteObj.customerSiteId',
      },
      {
        name: 'customerSiteNumber',
        type: 'string',
        bind: 'customerSiteObj.customerSiteNumber',
      },
      {
        name: 'customerSiteName',
        type: 'string',
        bind: 'customerSiteObj.customerSiteName',
      },
      {
        name: 'soNumObj',
        type: 'object',
        label: intl.get(`${preCode}.soNum`).d('销售订单号'),
        lovCode: common.soNum,
        ignore: 'always',
        // 单据处理规则 soNum为manual时必输 否则不可编辑
      },
      {
        name: 'soId',
        type: 'string',
        bind: 'soNumObj.soHeaderId',
      },
      {
        name: 'soNum',
        type: 'string',
        label: intl.get(`${preCode}.soNum`).d('销售订单号'),
        bind: 'soNumObj.soHeaderNumber',
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
        name: 'salesmanId',
        type: 'string',
        bind: 'salesmanObj.workerId',
      },
      {
        name: 'salesman',
        type: 'string',
        bind: 'salesmanObj.workerCode',
      },
      {
        name: 'salesmanName',
        type: 'string',
        bind: 'salesmanObj.workerName',
      },
      {
        name: 'soStatus',
        type: 'string',
        lookupCode: lsopSalesOrder.soStatus,
        label: intl.get(`${preCode}.soStatus`).d('订单状态'),
      },
      {
        name: 'customerContact',
        type: 'string',
        label: intl.get(`${preCode}.customerContact`).d('客户联系人'),
      },
      {
        name: 'contactPhone',
        type: 'string',
        label: intl.get(`${preCode}.contactPhone`).d('联系电话'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'customerPo',
        type: 'string',
        label: intl.get(`${preCode}.customerPo`).d('客户PO'),
      },
      {
        name: 'contactEmail',
        type: 'string',
        label: intl.get(`${preCode}.contactEmail`).d('联系邮箱'),
      },
      {
        name: 'receiveAddress',
        type: 'string',
        label: intl.get(`${preCode}.receiveAddress`).d('收货地址'),
      },
      {
        name: 'customerPoLine',
        type: 'string',
        label: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
      },
      {
        name: 'customerOrderedTime',
        type: 'date',
        label: intl.get(`${preCode}.customerOrderedTime`).d('客户下单日期'),
      },
      {
        name: 'soConfirmedTime',
        type: 'date',
        label: intl.get(`${preCode}.soConfirmedTime`).d('订单确认日期'),
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
        name: 'currency',
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
        name: 'exchangeRate',
        type: 'number',
        label: intl.get(`${preCode}.exchangeRate`).d('汇率'),
        validator: positiveNumberValidator,
      },
      {
        name: 'totalAmount',
        type: 'string',
        label: intl.get(`${preCode}.totalAmount`).d('订单总价'),
        // 根据输入行的行总价自动汇总(不包含已取消状态)
      },
      {
        name: 'paymentDeadline',
        type: 'string',
        label: intl.get(`${preCode}.paymentDeadline`).d('付款期限'),
        lookupCode: lsopSalesOrder.paymentDeadline,
      },
      {
        name: 'paymentMethod',
        type: 'string',
        label: intl.get(`${preCode}.paymentMethod`).d('付款方式'),
        lookupCode: lsopSalesOrder.paymentMethod,
      },
      {
        name: 'taxRate',
        type: 'number',
        min: 0,
        label: intl.get(`${preCode}.taxRate`).d('税率'),
      },
      {
        name: 'soVersion',
        type: 'string',
        label: intl.get(`${preCode}.soVersion`).d('订单版本'),
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
        label: intl.get(`${preCode}.externalNum`).d('外部编号'),
      },
      {
        name: 'approvalRule',
        type: 'string',
        label: intl.get(`${preCode}.approvalRule`).d('审批策略'),
        lookupCode: lsopSalesOrder.approvalRule,
        bind: 'soTypeObj.approvalRule',
      },
      {
        name: 'approvalChart',
        label: intl.get(`${preCode}.approvalChart`).d('审批流程'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LSOP}/v1/${organizationId}/so-headers`,
          method: 'GET',
        };
      },
      submit: ({ data }) => {
        return {
          url: `${HLOS_LSOP}/v1/${organizationId}/so-headers`,
          data: data[0],
          method: 'POST',
        };
      },
    },
    events: {
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
      update: ({ name, record }) => {
        if (name === 'customerObj') {
          record.set('customerSiteObj', null);
        }
        if (name === 'customerPo') {
          record.set('customerPoLine', null);
        }
      },
    },
  };
};

export { SalesOrderListDS, SalesOrderLineDS, SoDetailDS };
