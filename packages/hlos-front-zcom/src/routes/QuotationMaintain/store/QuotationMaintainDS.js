/**
 * @Description: 报价单维护DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-03-26 10:57:43
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.quotationMaintain.model';
const organizationId = getCurrentOrganizationId();
const { common, quotationMaintain } = codeConfig.code;
const lineUrl = `${HLOS_ZCOM}/v1/${organizationId}/quotation-order-lines`;
const QuotationListDS = () => ({
  autoQuery: false,
  queryFields: [
    // {
    //   name: 'submitDateStart',
    //   type: 'date',
    //   range: ['start', 'end'],
    //   label: intl.get(`${intlPrefix}.submitDate`).d('报价时间'),
    //   transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
    // },
    // {
    //   name: 'submitDateEnd',
    //   type: 'date',
    //   bind: 'submitDateStart.end',
    //   transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    // },
    {
      name: 'quotationOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.quotationOrderNum`).d('报价单号'),
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.customer`).d('客户'),
      lovCode: common.customer,
      ignore: 'always',
      lovPara: {
        cooperationFlag: 1,
      },
    },
    {
      name: 'customerId',
      type: 'string',
      bind: 'customerObj.customerId',
    },
    {
      name: 'quotationOrderStatusList',
      type: 'string',
      lookupCode: quotationMaintain.quotationOrderStatus,
      label: intl.get(`${intlPrefix}.quotationOrderStatus`).d('报价单状态'),
      multiple: true,
    },
    {
      name: 'companyObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.companyObj`).d('公司'),
      lovCode: common.company,
      ignore: 'always',
    },
    {
      name: 'supplierCompanyId',
      type: 'string',
      bind: 'companyObj.companyId',
    },
    {
      name: 'quotationOrderType',
      type: 'string',
      lookupCode: quotationMaintain.quotationOrderType,
      label: intl.get(`${intlPrefix}.quotationOrderType`).d('报价类型'),
    },
    {
      name: 'quotationSourceType',
      type: 'string',
      lookupCode: quotationMaintain.quotationSourceType,
      label: intl.get(`${intlPrefix}.quotationSourceType`).d('来源类型'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单号'),
    },
  ],
  fields: [
    {
      name: 'quotationOrder',
      type: 'string',
      label: intl.get(`${intlPrefix}.quotationOrder`).d('报价单'),
    },
    {
      name: 'sourceChannel',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceChannel`).d('来源渠道'),
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${commonPrefix}.customer`).d('客户'),
    },
    {
      name: 'totalAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.totalAmount`).d('含税总额'),
    },
    {
      name: 'submitDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.submitDate`).d('报价时间'),
    },
    {
      name: 'priceEnabledDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.priceEnabledDate`).d('价格有效期'),
    },
    {
      name: 'operationOpinion',
      type: 'string',
    },
    {
      name: 'quotationOrderStatus',
      type: 'string',
      lookupCode: quotationMaintain.quotationOrderStatus,
      label: intl.get(`${intlPrefix}.quotationOrderStatus`).d('报价状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { quotationOrderStatusList } = data;
      return {
        url: generateUrlWithGetParam(`${HLOS_ZCOM}/v1/${organizationId}/quotation-orders`, {
          quotationOrderStatusList,
        }),
        data: {
          ...data,
          // submitDateStart: data.submitDateStart ? data.submitDateStart.concat(' 00:00:00') : null,
          // submitDateEnd: data.submitDateEnd ? data.submitDateEnd.concat(' 23:59:59') : null,
          quotationOrderStatusList: null,
          supplierTenantId: organizationId,
        },
        method: 'GET',
      };
    },
  },
});

const QuotationHeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'companyObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.companyObj`).d('公司'),
      lovCode: common.company,
      ignore: 'always',
      required: true,
    },
    {
      name: 'supplierCompanyId',
      type: 'string',
      bind: 'companyObj.companyId',
    },
    {
      name: 'supplierCompanyName',
      type: 'string',
      bind: 'companyObj.companyName',
    },
    {
      name: 'quotationOrderType',
      type: 'string',
      lookupCode: quotationMaintain.quotationOrderType,
      label: intl.get(`${intlPrefix}.quotationOrderType`).d('报价类型'),
      defaultValue: 'SINGLE_QUOTATION',
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.customerCompany`).d('客户'),
      lovCode: common.customer,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          companyId: record.get('supplierCompanyId'),
          cooperationFlag: 1,
        }),
      },
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
      name: 'customerTenantId',
      type: 'string',
      bind: 'customerObj.customerTenantId',
    },
    {
      name: 'customerCompanyId',
      type: 'string',
      bind: 'customerObj.customerCompanyId',
    },
    {
      name: 'quotationOrderName',
      type: 'string',
      label: intl.get(`${intlPrefix}.quotationOrderName`).d('报价单标题'),
      required: true,
    },
    {
      name: 'quotationOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.quotationOrderNum`).d('报价单号'),
    },
    {
      name: 'quotationOrderStatus',
      type: 'string',
      lookupCode: quotationMaintain.quotationOrderStatus,
      label: intl.get(`${intlPrefix}.quotationOrderStatus`).d('报价单状态'),
      defaultValue: 'NEW',
    },
    {
      name: 'createdByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
    },
    {
      name: 'currencyObj',
      type: 'object',
      lovCode: common.currency,
      label: intl.get(`${intlPrefix}.currency`).d('币种'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'currencyId',
      type: 'string',
      bind: 'currencyObj.currencyId',
    },
    {
      name: 'currencyCode',
      type: 'string',
      bind: 'currencyObj.currencyCode',
    },
    {
      name: 'productionCycle',
      type: 'string',
      label: intl.get(`${intlPrefix}.productionCycle`).d('生产/备货周期(天)'),
    },
    {
      name: 'quotationSourceType',
      type: 'string',
      lookupCode: quotationMaintain.quotationSourceType,
      label: intl.get(`${intlPrefix}.quotationSourceType`).d('来源类型'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单号'),
    },
    {
      name: 'supplierPromiseDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.supplierPromiseDate`).d('承诺交货日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      min: moment().format(DEFAULT_DATE_FORMAT),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('报价单备注'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { quotationOrderId } = data;
      return {
        data: {
          ...data,
          quotationOrderId: undefined,
        },
        url: `${HLOS_ZCOM}/v1/${organizationId}/quotation-orders/${quotationOrderId}`,
        method: 'GET',
      };
    },
  },
});

const QuotationLineDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'quotationOrderLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.quotationOrderLineNum`).d('行号'),
    },
    {
      name: 'supplierItemObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.supplierItemCode`).d('物料编码'),
      lovCode: quotationMaintain.item,
      ignore: 'always',
      required: true,
    },
    {
      name: 'supplierItemId',
      type: 'string',
      bind: 'supplierItemObj.itemId',
    },
    {
      name: 'supplierItemCode',
      type: 'string',
      bind: 'supplierItemObj.itemCode',
    },
    {
      name: 'supplierUomId',
      type: 'string',
      bind: 'supplierItemObj.uomId',
    },
    {
      name: 'supplierUomCode',
      type: 'string',
      bind: 'supplierItemObj.uomCode',
    },
    {
      name: 'supplierItemDesc',
      type: 'string',
      bind: 'supplierItemObj.itemDesc',
      label: intl.get(`${intlPrefix}.supplierItemDesc`).d('物料说明'),
    },
    {
      name: 'customerItemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerItemCode`).d('客户物料信息'),
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'customerUomCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerUomCode`).d('客户单位'),
    },
    {
      name: 'customerQuotationQty',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.customerQuotationQty`).d('可供数量'),
    },
    {
      name: 'customerPrice',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerPrice`).d('含税单价'),
      required: true,
    },
    {
      name: 'taxRateObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.taxRate`).d('税率(%)'),
      lovCode: common.taxRate,
      textField: 'taxRate',
      ignore: 'always',
      required: true,
    },
    {
      name: 'taxId',
      type: 'string',
      bind: 'taxRateObj.taxId',
    },
    {
      name: 'taxRate',
      type: 'string',
      bind: 'taxRateObj.taxRate',
      transformRequest: (val) => val && (Number(val) > 1 ? val / 100 : val),
      transformResponse: (val) => val && (Number(val) > 1 ? val : val * 100),
    },
    {
      name: 'specification',
      type: 'string',
      label: intl.get(`${intlPrefix}.specification`).d('规格'),
    },
    {
      name: 'processingTechnic',
      type: 'string',
      label: intl.get(`${intlPrefix}.processingTechnic`).d('加工工艺'),
    },
    {
      name: 'customerCounterOfferPrice',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerCounterOfferPrice`).d('还价单价'),
    },
    {
      name: 'counterOfferReason',
      type: 'string',
      label: intl.get(`${intlPrefix}.counterOfferReason`).d('还价理由'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${intlPrefix}.fileUrl`).d('附件'),
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url: lineUrl,
        method: 'GET',
      };
    },
    destroy: ({ data }) => {
      return {
        url: lineUrl,
        data,
        method: 'DELETE',
      };
    },
    update: ({ data }) => {
      return {
        url: lineUrl,
        data,
        method: 'POST',
      };
    },
    create: ({ data }) => {
      return {
        url: lineUrl,
        data,
        method: 'POST',
      };
    },
  },
  events: {
    update: ({ name, record }) => {
      // 计算含税单价 = 不含税单价 *（1 + 税率）
      if (name === 'excludingTaxPrice' || name === 'taxRateObj') {
        const excludingTaxPrice = record.get('excludingTaxPrice');
        const taxRate = record.get('taxRate');
        if (excludingTaxPrice && taxRate) {
          record.set('price', excludingTaxPrice * (1 + taxRate * 0.01));
          return;
        }
        record.set('price', null);
      }
      // 计算行金额（含税）= 含税单价 * 供应数量
      if (name === 'price' || name === 'quotationQty') {
        const price = record.get('price');
        const quotationQty = record.get('quotationQty');
        if (price && quotationQty) {
          record.set('amount', price * quotationQty);
          return;
        }
        record.set('amount', null);
      }

      if (name === 'supplierItemObj') {
        record.set('itemAttr', null);
      }
    },
  },
});

export { QuotationListDS, QuotationHeadDS, QuotationLineDS };
