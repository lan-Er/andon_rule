/**
 * @Description: 对账单维护DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-12-14 14:02:05
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.statementMaintain.model';
const { common, statement } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const statementCreateListDS = (roleType) => {
  const createQueryArr = [
    {
      name: 'sourceDocObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.poNum`).d('采购订单号'),
      lovCode: roleType === 'supplier' ? statement.supplierPo : statement.po,
      ignore: 'always',
    },
    {
      name: 'sourceDocId',
      type: 'string',
      bind: 'sourceDocObj.poHeaderId',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      bind: 'sourceDocObj.poNum',
    },
    {
      name: 'deliveryOrderObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单号'),
      lovCode: roleType === 'supplier' ? statement.supplierDeliveryOrder : statement.deliveryOrder,
      ignore: 'always',
    },
    {
      name: 'deliveryOrderId',
      type: 'string',
      bind: 'deliveryOrderObj.deliveryOrderId',
    },
    {
      name: 'deliveryOrderNum',
      type: 'string',
      bind: 'deliveryOrderObj.deliveryOrderNum',
    },
    {
      name: 'deliveryOrderType',
      type: 'string',
      lookupCode: common.deliveryOrderType,
      label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
    },
    {
      name: 'submitDateStart',
      type: 'date',
      label: intl.get(`${intlPrefix}.submitDateStart`).d('送货单创建日期从'),
      max: 'submitDateEnd',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'submitDateEnd',
      type: 'date',
      label: intl.get(`${intlPrefix}.submitDateEnd`).d('送货单创建日期至'),
      min: 'submitDateStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'actualExecuteTimeStart',
      type: 'date',
      label: intl.get(`${intlPrefix}.actualExecuteTimeStart`).d('送货单实际接收日期从'),
      max: 'actualExecuteTimeEnd',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'actualExecuteTimeEnd',
      type: 'date',
      label: intl.get(`${intlPrefix}.actualExecuteTimeEnd`).d('送货单实际接收日期至'),
      min: 'actualExecuteTimeStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'scmOuName',
      type: 'string',
      label: intl.get(`${intlPrefix}.scmOuName`).d('采购中心'),
    },
    {
      name: 'sourceSysName',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceSysName`).d('来源系统'),
    },
    {
      name: 'buyerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.buyerName`).d('采购员'),
    },
  ];
  const arr = createQueryArr.concat([]);
  if (roleType === 'supplier') {
    arr.splice(
      7,
      0,
      {
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
        lovCode: common.customer,
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
      }
    );
  }
  if (roleType === 'coreCompany') {
    arr.splice(
      7,
      0,
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        lovCode: common.supplier,
        ignore: 'always',
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'supplierName',
        type: 'string',
        bind: 'supplierObj.supplierName',
      }
    );
  }
  return {
    autoQuery: false,
    queryFields: arr,
    fields: [
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单号'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label:
          roleType === 'supplier'
            ? intl.get(`${intlPrefix}.customerItemCode`).d('客户物料编码')
            : intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        label:
          roleType === 'supplier'
            ? intl.get(`${intlPrefix}.customerItemDescription`).d('客户物料描述')
            : intl.get(`${intlPrefix}.itemDescription`).d('物料描述'),
      },
      {
        name: 'supplierItemCode',
        type: 'string',
        label:
          roleType === 'supplier'
            ? intl.get(`${intlPrefix}.itemCode`).d('物料编码')
            : intl.get(`${intlPrefix}.supplierItemCode`).d('供应商料号'),
      },
      {
        name: 'supplierItemDescription',
        type: 'string',
        label:
          roleType === 'supplier'
            ? intl.get(`${intlPrefix}.itemDescription`).d('物料描述')
            : intl.get(`${intlPrefix}.supplierItemDescription`).d('供应商物料描述'),
      },
      {
        name: 'deliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryQty`).d('发货数量'),
      },
      {
        name: 'receivedQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivedQty`).d('接收数量'),
      },
      {
        name: 'totalVerificationQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.totalVerificationQty`).d('已对账数量'),
      },
      {
        name: 'submitDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.submitDate`).d('送货单创建日期'),
      },
      {
        name: 'beforeExcludingTaxPrice',
        type: 'string',
        label: intl.get(`${intlPrefix}.beforeExcludingTaxPrice`).d('净价'),
      },
      {
        name: 'beforePrice',
        type: 'string',
        label: intl.get(`${intlPrefix}.beforePrice`).d('含税价'),
      },
      {
        name: 'taxRate',
        type: 'string',
        label: intl.get(`${intlPrefix}.taxRate`).d('税率'),
      },
      {
        name: 'beforeExcludingTaxAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.beforeExcludingTaxAmount`).d('不含税行金额'),
      },
      {
        name: 'beforeAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.beforeAmount`).d('含税行金额'),
      },
      {
        name: 'currencyCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.currency`).d('币种'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poNum`).d('采购订单号'),
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poLineNum`).d('采购订单行号'),
      },
      {
        name: 'customerNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerNumber`).d('客户编码'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerName`).d('客户描述'),
      },
      {
        name: 'supplierNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierNumber`).d('供应商编码'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierName`).d('供应商描述'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines/${
            roleType === 'supplier' ? 'getBySupplier' : 'getByCustomer'
          }`,
          data: {
            ...data,
            submitDateStart: data.submitDateStart ? data.submitDateStart.concat(' 00:00:00') : null,
            submitDateEnd: data.submitDateEnd ? data.submitDateEnd.concat(' 23:59:59') : null,
            actualExecuteTimeStart: data.actualExecuteTimeStart
              ? data.actualExecuteTimeStart.concat(' 00:00:00')
              : null,
            actualExecuteTimeEnd: data.actualExecuteTimeEnd
              ? data.actualExecuteTimeEnd.concat(' 23:59:59')
              : null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const statementMaintainListDS = (roleType) => {
  const mainTainQueryArr = [
    {
      name: 'verificationOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationOrderNum`).d('对账单号'),
    },
    {
      name: 'deliveryOrderObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单号'),
      lovCode: roleType === 'supplier' ? statement.supplierDeliveryOrder : statement.deliveryOrder,
      ignore: 'always',
    },
    {
      name: 'deliveryOrderId',
      type: 'string',
      bind: 'deliveryOrderObj.deliveryOrderId',
    },
    {
      name: 'deliveryOrderNum',
      type: 'string',
      bind: 'deliveryOrderObj.deliveryOrderNum',
    },
    {
      name: 'sourceDocObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.poNum`).d('采购订单号'),
      lovCode: roleType === 'supplier' ? statement.supplierPo : statement.po,
      ignore: 'always',
    },
    {
      name: 'sourceDocId',
      type: 'string',
      bind: 'sourceDocObj.poHeaderId',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      bind: 'sourceDocObj.poNum',
    },
    {
      name: 'verificationOrderType',
      type: 'string',
      lookupCode: statement.verificationOrderType,
      label: intl.get(`${intlPrefix}.verificationOrderType`).d('对账单类型'),
    },
    {
      name: 'submitDateStart',
      type: 'date',
      label: intl.get(`${intlPrefix}.submitDateStart`).d('创建日期从'),
      max: 'submitDateEnd',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'submitDateEnd',
      type: 'date',
      label: intl.get(`${intlPrefix}.submitDateEnd`).d('创建日期至'),
      min: 'submitDateStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
  ];
  const arr = mainTainQueryArr.concat([]);
  if (roleType === 'supplier') {
    arr.splice(
      1,
      0,
      {
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
        lovCode: common.customer,
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
      }
    );
  }
  if (roleType === 'coreCompany') {
    arr.splice(
      1,
      0,
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        lovCode: common.supplier,
        ignore: 'always',
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'supplierName',
        type: 'string',
        bind: 'supplierObj.supplierName',
      }
    );
  }
  return {
    autoQuery: false,
    queryFields: arr,
    fields: [
      {
        name: 'verificationOrderStatus',
        type: 'string',
        lookupCode: statement.verificationOrderStatus,
        label: intl.get(`${intlPrefix}.verificationOrderStatus`).d('对账单状态'),
      },
      {
        name: 'verificationOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.verificationOrderNum`).d('对账单编号'),
      },
      {
        name: 'verificationOrderType',
        type: 'string',
        lookupCode: statement.verificationOrderType,
        label: intl.get(`${intlPrefix}.verificationOrderType`).d('对账单类型'),
      },
      {
        name: 'customerNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerNumber`).d('客户编码'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerName`).d('客户描述'),
      },
      {
        name: 'supplierNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierNumber`).d('供应商编码'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierName`).d('供应商描述'),
      },
      {
        name: 'excludingTaxAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.excludingTaxAmount`).d('总净价'),
      },
      {
        name: 'amount',
        type: 'string',
        label: intl.get(`${intlPrefix}.amount`).d('含税总额'),
      },
      {
        name: 'currencyCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.currency`).d('币种'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const obj =
          roleType === 'supplier'
            ? {
                supplierTenantId: organizationId,
                tenantId: organizationId,
              }
            : {
                customerTenantId: organizationId,
                tenantId: organizationId,
              };
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/verification-orders`,
          data: {
            ...data,
            ...obj,
            submitDateStart: data.submitDateStart ? data.submitDateStart.concat(' 00:00:00') : null,
            submitDateEnd: data.submitDateEnd ? data.submitDateEnd.concat(' 23:59:59') : null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const statementDetailHeadDS = (roleType) => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'verificationOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.verificationOrderNum`).d('对账单号'),
      },
      {
        name: 'verificationOrderType',
        type: 'string',
        lookupCode: statement.verificationOrderType,
        label: intl.get(`${intlPrefix}.verificationOrderType`).d('对账单类型'),
        required: true,
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerName`).d('客户'),
      },
      {
        name: 'amount',
        type: 'string',
        label: intl.get(`${intlPrefix}.amount`).d('对账含税总金额'),
      },
      {
        name: 'submitDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.submitDate`).d('创建时间'),
      },
      {
        name: 'createUserName',
        type: 'string',
        label: intl.get(`${intlPrefix}.createUserName`).d('创建人'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('备注'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { idList, verificationOrderId } = data;
        return {
          url: verificationOrderId
            ? `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/${verificationOrderId}`
            : generateUrlWithGetParam(
                `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines/${
                  roleType === 'supplier' ? 'getBySupplier' : 'getByCustomer'
                }`,
                {
                  idList,
                }
              ),
          data: {
            ...data,
            idList: undefined,
            verificationOrderId: undefined,
          },
          method: 'GET',
          transformResponse: (value) => {
            if (verificationOrderId) {
              return JSON.parse(value);
            }
            const newValue = JSON.parse(value);
            let content;
            if (newValue && !newValue.failed && newValue.content) {
              content = Object.assign({}, newValue.content[0]);
            }
            return {
              ...content,
              submitDate: null,
            };
          },
        };
      },
    },
  };
};

const statementDetailAmountDS = (roleType) => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'excludingTaxAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.excludingTaxAmount`).d('总净价'),
      },
      {
        name: 'amount',
        type: 'string',
        label: intl.get(`${intlPrefix}.amount`).d('含税总额'),
      },
      {
        name: 'taxAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.taxAmount`).d('税额'),
      },
      {
        name: 'currencyObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.currency`).d('币种'),
        lovCode: common.currency,
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
        name: 'currencyName',
        type: 'string',
        bind: 'currencyObj.currencyName',
      },
      {
        name: 'afterAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.afterAmount`).d('含税总价调整'),
      },
      {
        name: 'allocationRuleObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.allocationRule`).d('分摊规则'),
        lovCode: statement.allocationRule,
        ignore: 'always',
      },
      {
        name: 'allocationRuleId',
        type: 'string',
        bind: 'allocationRuleObj.allocationRuleId',
      },
      {
        name: 'allocationRuleName',
        type: 'string',
        bind: 'allocationRuleObj.allocationRuleName',
      },
    ],
    transport: {
      read: ({ data }) => {
        const { idList, verificationOrderId } = data;
        return {
          url: verificationOrderId
            ? `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/${verificationOrderId}`
            : generateUrlWithGetParam(
                `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines/${
                  roleType === 'supplier' ? 'getBySupplier' : 'getByCustomer'
                }`,
                {
                  idList,
                }
              ),
          data: {
            ...data,
            idList: undefined,
            verificationOrderId: undefined,
          },
          method: 'GET',
          transformResponse: (value) => {
            if (verificationOrderId) {
              return {
                content: [JSON.parse(value)],
                empty: false,
                number: 0,
                numberOfElements: 1,
                size: 10,
                totalElements: 1,
                totalPages: 1,
              };
            }
            const newValue = JSON.parse(value);
            if (newValue && !newValue.failed && newValue.content) {
              return {
                content: [newValue.content[0]],
                empty: false,
                number: 0,
                numberOfElements: 1,
                size: 10,
                totalElements: 1,
                totalPages: 1,
              };
            }
          },
        };
      },
    },
  };
};

const statementDetailLineDS = (roleType) => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'customerItemCode',
        type: 'string',
        label:
          roleType === 'supplier'
            ? intl.get(`${intlPrefix}.customerItemCode`).d('客户物料编码')
            : intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        label:
          roleType === 'supplier'
            ? intl.get(`${intlPrefix}.customerItemDescription`).d('客户物料描述')
            : intl.get(`${intlPrefix}.itemDescription`).d('物料描述'),
      },
      {
        name: 'supplierItemCode',
        type: 'string',
        label:
          roleType === 'supplier'
            ? intl.get(`${intlPrefix}.itemCode`).d('物料编码')
            : intl.get(`${intlPrefix}.supplierItemCode`).d('供应商料号'),
      },
      {
        name: 'supplierItemDescription',
        type: 'string',
        label:
          roleType === 'supplier'
            ? intl.get(`${intlPrefix}.itemDescription`).d('物料描述')
            : intl.get(`${intlPrefix}.supplierItemDescription`).d('供应商物料描述'),
      },
      {
        name: 'deliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryQty`).d('发货数量'),
      },
      {
        name: 'receivedQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivedQty`).d('接收数量'),
      },
      {
        name: 'totalVerificationQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.totalVerificationQty`).d('已对账数量'),
      },
      {
        name: 'reconcilableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.reconcilableQty`).d('可对账数量'),
      },
      {
        name: 'verificationQty',
        type: 'number',
        min: 0,
        max: 'reconcilableQty',
        label: intl.get(`${intlPrefix}.verificationQty`).d('对账数量'),
      },
      {
        name: 'uomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uomName`).d('单位'),
      },
      {
        name: 'beforeExcludingTaxPrice',
        type: 'string',
        label: intl.get(`${intlPrefix}.beforeExcludingTaxPrice`).d('净价'),
      },
      {
        name: 'beforeExcludingTaxAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.beforeExcludingTaxAmount`).d('总净价'),
      },
      {
        name: 'beforePrice',
        type: 'string',
        label: intl.get(`${intlPrefix}.beforePrice`).d('含税单价'),
      },
      {
        name: 'beforeAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.beforeAmount`).d('含税总价'),
      },
      {
        name: 'afterAmount',
        type: 'number',
        min: 0,
        label: intl.get(`${intlPrefix}.afterAmount`).d('含税总价调整'),
      },
      {
        name: 'currencyCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.currency`).d('币种'),
      },
      {
        name: 'taxRate',
        type: 'string',
        label: intl.get(`${intlPrefix}.taxRate`).d('税率'),
      },
      {
        name: 'lineRemark',
        type: 'string',
        label: intl.get(`${intlPrefix}.lineRemark`).d('行备注'),
      },
      {
        name: 'fileUrl',
        type: 'string',
        label: intl.get(`${intlPrefix}.fileUrl`).d('行附件'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { idList, verificationOrderId } = data;
        return {
          url: verificationOrderId
            ? `${HLOS_ZCOM}/v1/${organizationId}/verification-order-lines`
            : generateUrlWithGetParam(
                `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines/${
                  roleType === 'supplier' ? 'getBySupplier' : 'getByCustomer'
                }`,
                {
                  idList,
                }
              ),
          data: {
            ...data,
            idList: undefined,
          },
          method: 'GET',
        };
      },
    },
  };
};

export {
  statementCreateListDS,
  statementMaintainListDS,
  statementDetailHeadDS,
  statementDetailAmountDS,
  statementDetailLineDS,
};
