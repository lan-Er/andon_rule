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
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
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
        name: 'customerObj',
        type: 'object',
        lovCode: common.customer,
        label: intl.get(`${commonPrefix}.supplier`).d('客户'),
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
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
        label: intl.get(`${commonPrefix}.withholdingOrderType`).d('客户扣款单类型'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('客户'),
      },
      {
        name: 'supplierCompanyName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplierCompanyName`).d('公司'),
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
        label: intl.get(`${intlPrefix}.receivingAddress`).d('客户发起日期'),
      },
      {
        name: 'withholdingOrderStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.withholdingOrderStatus`).d('状态'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
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
        label: intl.get(`${intlPrefix}.withholdingOrderType`).d('客户扣款单类型'),
      },
      {
        name: 'withholdingOrderStatus',
        type: 'string',
        lookupCode: withholdingOrderCreate.withholdingOrderStatus,
        label: intl.get(`${intlPrefix}.withholdingOrderStatus`).d('扣款单状态'),
      },
      {
        name: 'supplierCompanyName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierCompanyName`).d('公司'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerName`).d('客户'),
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
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('客户扣款说明'),
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
        const { withholdingOrderId } = data;
        return {
          url,
          data: {
            ...data,
            deliveryApplyDateStart: data.deliveryApplyDateStart
              ? `${data.deliveryApplyDateStart} 00:00:00`
              : null,
            deliveryApplyDateEnd: data.deliveryApplyDateEnd
              ? `${data.deliveryApplyDateEnd} 23:59:59`
              : null,
            arrivalDateStart: data.arrivalDateStart ? `${data.arrivalDateStart} 00:00:00` : null,
            arrivalDateEnd: data.arrivalDateEnd ? `${data.arrivalDateEnd} 23:59:59` : null,
          },
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
        label: intl.get(`${intlPrefix}.externalSourceDocNum`).d('客户外部来源单号'),
      },
      {
        name: 'poObj',
        type: 'object',
        lovCode: withholdingOrderCreate.poLine,
        lovPara: {
          tenantId: organizationId,
          poLineStatus: 'CONFIRMED',
        },
        label: intl.get(`${intlPrefix}.supplierItem`).d('客户采购订单'),
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
        label: intl.get(`${intlPrefix}.itemAttr`).d('客户订单行'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        bind: 'poObj.customerItemCode',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('客户物料信息'),
      },
      {
        name: 'customerItemDesc',
        type: 'string',
        bind: 'poObj.customerItemDesc',
        label: intl.get(`${intlPrefix}.customerItemDesc`).d('客户物料说明'),
      },
      {
        name: 'supplierItemCode',
        type: 'string',
        bind: 'poObj.customerItemCode',
        label: intl.get(`${intlPrefix}.supplierItemCode`).d('供应商物料信息'),
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
      },
      {
        name: 'customerAssociatedCost',
        type: 'number',
        label: intl.get(`${intlPrefix}.customerAssociatedCost`).d('连带材料费用'),
        required: true,
      },
      {
        name: 'customerManualCost',
        type: 'number',
        label: intl.get(`${intlPrefix}.customerManualCost`).d('工时费用'),
        required: true,
      },
      {
        name: 'customerOtherCost',
        type: 'number',
        label: intl.get(`${intlPrefix}.customerOtherCost`).d('其他费用'),
        required: true,
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
    },
    events: {
      update: ({ name, record }) => {
        if (name === 'poObj') {
          const {
            taxRate = '',
            customerUomId = '',
            customerUomCode = '',
            customerUomName = '',
          } = record.get('poObj');
          record.set('taxRateObj', { taxRate });
          record.set('customerUomObj', {
            uomId: customerUomId,
            uomCode: customerUomCode,
            uomName: customerUomName,
          });
        }
      },
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
    },
  };
};

export { DeliveryOrderListDS, DeliveryOrderHeadDS, DeliveryOrderLineDS };
