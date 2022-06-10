/*
 * @Descripttion: 发货单列表DS
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-26 15:15:26
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-29 10:04:23
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
// import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.deliveryOrderCreate.model';
const { common, withholdingOrderCreate } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const url = `${HLOS_ZCOM}/v1/${organizationId}/withholding-orders`;
const lineUrl = `${HLOS_ZCOM}/v1/${organizationId}/withholding-lines`;

const DeliveryOrderListDS = () => {
  return {
    autoQuery: true,
    queryFields: [
      {
        name: 'withholdingOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.withholdingOrderNum`).d('扣款单号'),
      },
      {
        name: 'withholdingOrderStatusList',
        type: 'string',
        lookupCode: withholdingOrderCreate.withholdingOrderStatus,
        multiple: true,
        label: intl.get(`${intlPrefix}.withholding`).d('扣款单状态'),
      },
      {
        name: 'supplierObj',
        type: 'object',
        lovCode: common.supplier,
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        ignore: 'always',
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'withholdingOrderType',
        type: 'string',
        lookupCode: withholdingOrderCreate.withholdingOrderType,
        label: intl.get(`${intlPrefix}.withholdingOrderType`).d('扣款单类型'),
      },
      {
        name: 'companyObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.companyObj`).d('公司'),
        lovCode: common.company,
        ignore: 'always',
      },
      {
        name: 'customerCompanyId',
        type: 'string',
        bind: 'companyObj.companyId',
      },
      {
        name: 'deliveryOrderDate',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${intlPrefix}.deliveryOrderDate`).d('发起日期'),
        required: true,
      },
      {
        name: 'creationDateStart',
        type: 'date',
        bind: 'deliveryOrderDate.start',
        defaultValue: moment().add(-180, 'days').format(DEFAULT_DATE_FORMAT),
      },
      {
        name: 'creationDateEnd',
        type: 'date',
        bind: 'deliveryOrderDate.end',
        defaultValue: moment().format(DEFAULT_DATE_FORMAT),
      },
      {
        name: 'feedbackRequestedDateStart',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${intlPrefix}.arrivalDate`).d('要求反馈日期'),
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'feedbackRequestedDateEnd',
        type: 'date',
        bind: 'feedbackRequestedDateStart.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'overDueFlag',
        type: 'string',
        lookupCode: common.flag,
        label: intl.get(`${intlPrefix}.withholdingOrderType`).d('是否超期未反馈'),
        trueValue: '1',
        falseValue: '0',
      },
    ],
    fields: [
      {
        name: 'withholdingOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.withholdingOrderNum`).d('扣款单号'),
      },
      {
        name: 'withholdingOrderTypeMeaning',
        type: 'string',
        label: intl.get(`${commonPrefix}.withholdingOrderType`).d('扣款单类型'),
      },
      {
        name: 'customerCompanyName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerCompanyName`).d('公司'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'totalAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.totalAmount`).d('扣款总额（含税）'),
      },
      {
        name: 'exTaxAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.exTaxAmount`).d('扣款税额'),
      },
      {
        name: 'currencyCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.currencyCode`).d('币种'),
      },
      {
        name: 'feedbackRequestedDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.feedbackRequestedDate`).d('要求反馈日期'),
      },
      {
        name: 'overDueFlag',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.overDueFlag`).d('是否超期未反馈'),
        trueValue: 1,
        falseValue: 0,
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivingAddress`).d('发起日期'),
      },
      {
        name: 'withholdingOrderStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.withholdingOrderStatus`).d('状态'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { withholdingOrderStatusList } = data;
        return {
          url: generateUrlWithGetParam(url, {
            withholdingOrderStatusList,
          }),
          data: {
            ...data,
            creationDateEnd: data.creationDateEnd
              ? `${data.creationDateEnd.substring(0, 10)} 23:59:59`
              : null,
            feedbackRequestedDateStart: data.feedbackRequestedDateStart
              ? `${data.feedbackRequestedDateStart} 00:00:00`
              : null,
            feedbackRequestedDateEnd: data.feedbackRequestedDateEnd
              ? `${data.feedbackRequestedDateEnd} 23:59:59`
              : null,
            withholdingOrderStatusList: null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const DeliveryOrderHeadDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'withholdingOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.withholdingOrderNum`).d('扣款单号'),
      },
      {
        name: 'withholdingOrderType',
        type: 'string',
        lookupCode: withholdingOrderCreate.withholdingOrderType,
        label: intl.get(`${intlPrefix}.withholdingOrderType`).d('扣款单类型'),
        required: true,
      },
      {
        name: 'withholdingOrderStatus',
        type: 'string',
        lookupCode: withholdingOrderCreate.withholdingOrderStatus,
        label: intl.get(`${intlPrefix}.withholdingOrderStatus`).d('扣款单状态'),
      },
      {
        name: 'companyObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.companyObj`).d('公司'),
        lovCode: common.company,
        ignore: 'always',
        required: true,
      },
      {
        name: 'customerCompanyId',
        type: 'string',
        bind: 'companyObj.companyId',
      },
      {
        name: 'customerCompanyName',
        type: 'string',
        bind: 'companyObj.companyName',
      },
      {
        name: 'supplierObj',
        type: 'object',
        lovCode: common.supplier,
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        ignore: 'always',
        required: true,
        lovPara: {
          cooperationFlag: 1,
        },
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'supplierNumber',
        type: 'string',
        bind: 'supplierObj.supplierNumber',
      },
      {
        name: 'supplierName',
        type: 'string',
        bind: 'supplierObj.supplierName',
      },
      {
        name: 'supplierTenantId',
        type: 'string',
        bind: 'supplierObj.supplierTenantId',
      },
      {
        name: 'supplierCompanyId',
        type: 'string',
        bind: 'supplierObj.supplierCompanyId',
      },
      {
        name: 'totalAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.totalAmount`).d('扣款总额'),
      },
      {
        name: 'exTaxAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.exTaxAmount`).d('扣款税额'),
      },
      {
        name: 'currencyObj',
        type: 'object',
        lovCode: common.currency,
        label: intl.get(`${intlPrefix}.currency`).d('币种'),
        required: true,
        ignore: 'always',
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
        name: 'feedbackRequestedDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.feedbackRequestedDate`).d('要求反馈日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : ''),
        required: true,
        defaultValue: moment().add(14, 'days').format(DEFAULT_DATE_FORMAT),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('扣款说明'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { withholdingOrderId } = data;
        return {
          url: `${url}/${withholdingOrderId}`,
          data: {
            ...data,
            withholdingOrderId: undefined,
          },
          method: 'GET',
          // transformResponse: (value) => {
          //   if (deliveryApplyId) {
          //     return JSON.parse(value);
          //   }
          //   const newValue = JSON.parse(value);
          //   let content;
          //   if (newValue && !newValue.failed && newValue.content) {
          //     content = Object.assign({}, newValue.content[0]);
          //   }
          //   return {
          //     ...content,
          //   };
          // },
        };
      },
      update: ({ data }) => {
        const { withholdingOrderId } = data[0];
        return {
          url,
          data: data[0],
          method: withholdingOrderId ? 'PUT' : 'POST',
        };
      },
      create: ({ data }) => {
        const { withholdingOrderId } = data[0];
        return {
          url,
          data: data[0],
          method: withholdingOrderId ? 'PUT' : 'POST',
        };
      },
    },
  };
};

const DeliveryOrderLineDS = () => {
  return {
    autoQuery: false,
    fields: [
      {
        name: 'withholdingLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.withholdingLineNum`).d('行号'),
      },
      {
        name: 'externalSourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.externalSourceDocNum`).d('外部来源单号'),
        bind: 'poObj.externalSourceDocNum',
      },
      {
        name: 'poObj',
        type: 'object',
        lovCode: withholdingOrderCreate.poLine,
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: organizationId,
            poLineStatus: 'CONFIRMED',
            customerId: record.get('customerId'),
            supplierId: record.get('supplierId'),
            currencyId: record.get('currencyId'),
          }),
        },
        label: intl.get(`${intlPrefix}.supplierItem`).d('采购订单'),
        textField: 'poNum',
      },
      {
        name: 'poId',
        type: 'string',
        bind: 'poObj.poId',
      },
      {
        name: 'poNum',
        type: 'string',
        bind: 'poObj.poNum',
      },
      {
        name: 'poLineId',
        type: 'string',
        bind: 'poObj.poLineId',
      },
      {
        name: 'customerBusinessUnitId',
        type: 'string',
        bind: 'poObj.poBusinessUnitId',
      },
      {
        name: 'customerBusinessUnitCode',
        type: 'string',
        bind: 'poObj.poBusinessUnitCode',
      },
      {
        name: 'supplierBusinessUnitId',
        type: 'string',
        bind: 'poObj.soBusinessUnitId',
      },
      {
        name: 'supplierBusinessUnitCode',
        type: 'string',
        bind: 'poObj.soBusinessUnitCode',
      },
      {
        name: 'customerInventoryOrgId',
        type: 'string',
        bind: 'poObj.poInventoryOrgId',
      },
      {
        name: 'customerInventoryOrgCode',
        type: 'string',
        bind: 'poObj.poInventoryOrgCode',
      },
      {
        name: 'supplierInventoryOrgId',
        type: 'string',
        bind: 'poObj.deliveryInventoryOrgId',
      },
      {
        name: 'supplierInventoryOrgCode',
        type: 'string',
        bind: 'poObj.deliveryInventoryOrgCode',
      },
      {
        name: 'taxId',
        type: 'string',
        bind: 'poObj.taxId',
      },
      {
        name: 'taxRate',
        type: 'string',
        bind: 'poObj.taxRate',
      },
      {
        name: 'poLineNum',
        type: 'string',
        bind: 'poObj.poLineNum',
        label: intl.get(`${intlPrefix}.itemAttr`).d('订单行'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        bind: 'poObj.customerItemCode',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('物料编码'),
      },
      {
        name: 'customerItemDesc',
        type: 'string',
        bind: 'poObj.customerItemDesc',
        label: intl.get(`${intlPrefix}.customerItemDesc`).d('物料说明'),
      },
      {
        name: 'itemAttr',
        type: 'string',
        bind: 'poObj.itemAttr',
        label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
      },
      {
        name: 'taxRateObj',
        type: 'object',
        lovCode: common.taxRate,
        label: intl.get(`${intlPrefix}.taxRate`).d('税率（%）'),
        textField: 'taxRate',
        ignore: 'always',
        required: true,
      },
      {
        name: 'taxRate',
        type: 'string',
        bind: 'taxRateObj.taxRate',
        transformRequest: (val) => val && (Number(val) > 1 ? val / 100 : val),
        transformResponse: (val) => val && (Number(val) > 1 ? val : val * 100),
      },
      {
        name: 'customerDqcQty',
        type: 'number',
        label: intl.get(`${intlPrefix}.customerDqcQty`).d('不良数量'),
        min: 0,
        defaultValue: 0,
      },
      {
        name: 'customerUomObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.uom`).d('单位'),
        lovCode: common.uom,
        ignore: 'always',
      },
      {
        name: 'customerUomId',
        type: 'string',
        bind: 'customerUomObj.uomId',
      },
      {
        name: 'customerUomCode',
        type: 'string',
        bind: 'customerUomObj.uomCode',
      },
      {
        name: 'customerUomName',
        type: 'string',
        bind: 'customerUomObj.uomName',
      },
      {
        name: 'customerMaterialCost',
        type: 'number',
        label: intl.get(`${intlPrefix}.customerMaterialCost`).d('基本材料费用'),
        required: true,
        min: 0,
        defaultValue: 0,
      },
      {
        name: 'customerAssociatedCost',
        type: 'number',
        label: intl.get(`${intlPrefix}.customerAssociatedCost`).d('连带材料费用'),
        required: true,
        min: 0,
        defaultValue: 0,
      },
      {
        name: 'customerManualCost',
        type: 'number',
        label: intl.get(`${intlPrefix}.customerManualCost`).d('工时费用'),
        required: true,
        min: 0,
        defaultValue: 0,
      },
      {
        name: 'customerOtherCost',
        type: 'number',
        label: intl.get(`${intlPrefix}.customerOtherCost`).d('其他费用'),
        required: true,
        min: 0,
        defaultValue: 0,
      },
      {
        name: 'amount',
        type: 'string',
        label: intl.get(`${intlPrefix}.amount`).d('行扣款金额（含税）'),
      },
      {
        name: 'exTaxAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.exTaxAmount`).d('行税额'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('备注说明'),
      },
      {
        name: 'supplierFeedback',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierFeedback`).d('供应商反馈'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          data,
          url: lineUrl,
          method: 'GET',
        };
      },
      update: ({ data }) => {
        return {
          url: lineUrl,
          data: data.map((item) => ({ ...item.poObj, ...item })),
          method: 'PUT',
        };
      },
      create: ({ data }) => {
        return {
          url: lineUrl,
          data: data.map((item) => ({ ...item.poObj, ...item })),
          method: 'POST',
        };
      },
      destroy: ({ data }) => {
        return {
          data,
          url: lineUrl,
          method: 'DELETE',
        };
      },
    },
    events: {
      update: ({ name, record }) => {
        if (name === 'poObj') {
          if (!record.get('poObj')) {
            return;
          }

          const {
            taxRate = '',
            customerUomId = '',
            customerUomCode = '',
            customerUomName = '',
          } = record.get('poObj');
          record.set('taxRateObj', { taxRate: taxRate || '' });
          record.set('customerUomObj', {
            uomId: customerUomId,
            uomCode: customerUomCode,
            uomName: customerUomName,
          });
        }

        // if (name === 'taxRateObj') {
        //   const { taxRate } = record.get('taxRateObj');
        //   const value = Number(taxRate) > 1 ? taxRate / 100 : taxRate;
        //   record.set('taxRateObj', { taxRate: value });
        // }
      },
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
    },
  };
};

export { DeliveryOrderListDS, DeliveryOrderHeadDS, DeliveryOrderLineDS };
