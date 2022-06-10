/**
 * @Description: 对账单发起DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-06 15:50:42
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.statementInitiate.model';
const { common, statements } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const dateStart = moment().add(-180, 'days').format(DEFAULT_DATE_FORMAT);

const StatementListDS = () => ({
  autoQuery: false,
  queryFields: [
    {
      name: 'verificationOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationOrderNum`).d('对账单号'),
    },
    {
      name: 'verificationOrderStatusList',
      type: 'string',
      lookupCode: statements.verificationOrderStatus,
      label: intl.get(`${intlPrefix}.verificationOrderStatus`).d('对账单状态'),
      multiple: true,
    },
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
      name: 'companyObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.company`).d('公司'),
      lovCode: common.company,
      ignore: 'always',
    },
    {
      name: 'customerCompanyId',
      type: 'string',
      bind: 'companyObj.companyId',
    },
    {
      name: 'creationDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.creationDate`).d('发起日期'),
      transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      required: true,
      defaultValue: { start: dateStart, end: new Date() },
    },
    {
      name: 'creationDateEnd',
      type: 'date',
      bind: 'creationDateStart.end',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ],
  fields: [
    {
      name: 'verificationOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationOrderNum`).d('对账单号'),
    },
    {
      name: 'customerCompanyName',
      type: 'string',
      label: intl.get(`${commonPrefix}.company`).d('公司'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
    },
    {
      name: 'totalAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.totalAmount`).d('对账单总额'),
    },
    {
      name: 'taxAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.taxAmount`).d('对账单税额'),
    },
    {
      name: 'currencyCode',
      type: 'string',
      label: intl.get(`${commonPrefix}.currency`).d('货币'),
    },
    {
      name: 'creationDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.creationDate`).d('发起日期'),
    },
    {
      name: 'verificationOrderStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.status`).d('状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { verificationOrderStatusList } = data;
      return {
        url: generateUrlWithGetParam(`${HLOS_ZCOM}/v1/${organizationId}/verification-orders`, {
          verificationOrderStatusList,
        }),
        data: {
          ...data,
          verificationOrderStatusList: null,
          creationDateStart: data.creationDateStart ? `${data.creationDateStart} 00:00:00` : null,
          creationDateEnd: data.creationDateEnd ? `${data.creationDateEnd} 23:59:59` : null,
          customerTenantId: organizationId,
        },
        method: 'GET',
      };
    },
  },
});

const DocumentLineDS = () => ({
  autoQuery: false,
  queryFields: [
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
      name: 'externalSourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalSourceDocNum`).d('外部来源单号'),
    },
    {
      name: 'customerItemCode',
      type: 'string',
      label: intl.get(`${commonPrefix}.itemCode`).d('物料编码'),
    },
    {
      name: 'companyObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.company`).d('公司'),
      lovCode: common.company,
      ignore: 'always',
    },
    {
      name: 'customerCompanyId',
      type: 'string',
      bind: 'companyObj.companyId',
    },
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poNum`).d('采购订单'),
    },
    {
      name: 'verificationSourceType',
      type: 'string',
      lookupCode: statements.verificationSourceType,
      label: intl.get(`${intlPrefix}.documentType`).d('业务单据类型'),
    },
    {
      name: 'creationDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.documentDate`).d('业务单据日期'),
      transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
      required: true,
      defaultValue: { start: dateStart, end: new Date() },
    },
    {
      name: 'creationDateEnd',
      type: 'date',
      bind: 'creationDateStart.end',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ],
  fields: [
    {
      name: 'verificationSourceType',
      type: 'string',
      lookupCode: statements.verificationSourceType,
      label: intl.get(`${intlPrefix}.documentType`).d('业务单据类型'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.documentNum`).d('单据编号'),
    },
    {
      name: 'sourceDocLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.documentLineNum`).d('单据行号'),
    },
    {
      name: 'customerCompanyName',
      type: 'string',
      label: intl.get(`${commonPrefix}.company`).d('公司'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
    },
    {
      name: 'externalSourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalSourceDocNum`).d('外部来源单号'),
    },
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poNum`).d('采购订单'),
    },
    {
      name: 'poLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poLineNum`).d('采购订单行'),
    },
    {
      name: 'customerItemCode',
      type: 'string',
      label: intl.get(`${commonPrefix}.itemCode`).d('物料编码'),
    },
    {
      name: 'customerItemDesc',
      type: 'string',
      label: intl.get(`${commonPrefix}.itemDesc`).d('物料说明'),
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${commonPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'customerVerificationQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.quantity`).d('数量'),
    },
    {
      name: 'customerUomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
    },
    {
      name: 'customerPrice',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerPrice`).d('订单含税单价'),
    },
    {
      name: 'taxRate',
      type: 'string',
      label: intl.get(`${intlPrefix}.taxRate`).d('税率'),
    },
    {
      name: 'beforeAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.beforeAmount`).d('含税金额'),
    },
    {
      name: 'taxAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.taxAmount`).d('税额'),
    },
    {
      name: 'creationDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.documentDate`).d('单据日期'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/query-create-data`,
        data: {
          ...data,
          creationDateStart: data.creationDateStart ? `${data.creationDateStart} 00:00:00` : null,
          creationDateEnd: data.creationDateEnd ? `${data.creationDateEnd} 23:59:59` : null,
        },
        method: 'GET',
      };
    },
  },
});

const StatementHeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'verificationOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationOrderNum`).d('对账单号'),
    },
    {
      name: 'verificationOrderStatus',
      type: 'string',
      lookupCode: statements.verificationOrderStatus,
      label: intl.get(`${intlPrefix}.verificationOrderStatus`).d('对账单状态'),
    },
    {
      name: 'customerCompanyName',
      type: 'string',
      label: intl.get(`${commonPrefix}.company`).d('公司'),
    },
    {
      name: 'creationDate',
      type: 'date',
      label: intl.get(`${commonPrefix}.creationDate`).d('发起日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
    },
    {
      name: 'totalAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.totalAmount`).d('对账单总额'),
    },
    {
      name: 'taxAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.taxAmount`).d('对账单税额'),
    },
    {
      name: 'currencyCode',
      type: 'string',
      label: intl.get(`${commonPrefix}.currency`).d('币种'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { verificationOrderId } = data;
      return {
        url: `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/${verificationOrderId}`,
        data: {
          ...data,
          verificationOrderId: null,
        },
        method: 'GET',
      };
    },
  },
});

const StatementSummaryLineDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'verificationSummaryNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationSummaryNum`).d('行号'),
    },
    {
      name: 'externalSourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalSourceDocNum`).d('外部来源单号'),
    },
    {
      name: 'customerItemCode',
      type: 'string',
    },
    {
      name: 'customerItemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemInfo`).d('物料信息'),
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${commonPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'customerVerificationQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationQty`).d('对账数量'),
    },
    {
      name: 'customerUomName',
      type: 'string',
      label: intl.get(`${commonPrefix}.uom`).d('单位'),
    },
    {
      name: 'beforeAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.beforeAmount`).d('原始对账金额'),
    },
    {
      name: 'taxRate',
      type: 'string',
      label: intl.get(`${intlPrefix}.taxRate`).d('税率'),
    },
    {
      name: 'withholdingOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.withholdingOrderNum`).d('扣款单号'),
    },
    {
      name: 'withholdingLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.withholdingLineNum`).d('扣款单行'),
    },
    {
      name: 'customerFeedback',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerFeedback`).d('调整说明'),
    },
    {
      name: 'supplierFeedback',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierFeedback`).d('供应商反馈'),
    },
    {
      name: 'taxAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.taxAmount`).d('对账税额'),
      transformResponse: (val, object) => (object.afterAmount - object.afterExTaxAmount).toFixed(6),
    },
    {
      name: 'difference',
      type: 'string',
      label: intl.get(`${intlPrefix}.difference`).d('对账金额差异'),
      transformResponse: (val, object) => object.afterAmount - object.beforeAmount,
    },
    {
      name: 'afterAmount',
      type: 'number',
      label: intl.get(`${intlPrefix}.afterAmount`).d('调后对账金额'),
      required: true,
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'afterAmount') {
        const { afterAmount, beforeAmount } = record.toData();
        if (afterAmount && beforeAmount) {
          record.set('difference', afterAmount - beforeAmount);
        }
      }
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZCOM}/v1/${organizationId}/verification-summarys`,
        data,
        method: 'GET',
      };
    },
  },
});

const StatementDetailLineDS = () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'verificationSourceType',
      type: 'string',
      lookupCode: statements.verificationSourceType,
      label: intl.get(`${intlPrefix}.documentType`).d('业务单据类型'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.documentNum`).d('单据编号'),
    },
    {
      name: 'sourceDocLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.documentLineNum`).d('单据行号'),
    },
    {
      name: 'externalSourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.externalSourceDocNum`).d('外部来源单号'),
    },
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poNum`).d('采购订单'),
    },
    {
      name: 'poLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poLineNum`).d('采购订单行'),
    },
    {
      name: 'customerItemCode',
      type: 'string',
      label: intl.get(`${commonPrefix}.itemCode`).d('物料编码'),
    },
    {
      name: 'customerItemDesc',
      type: 'string',
      label: intl.get(`${commonPrefix}.itemDesc`).d('物料说明'),
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${commonPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'customerVerificationQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.quantity`).d('数量'),
    },
    {
      name: 'customerUomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
    },
    {
      name: 'customerPrice',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerPrice`).d('订单含税单价'),
    },
    {
      name: 'taxRate',
      type: 'string',
      label: intl.get(`${intlPrefix}.taxRate`).d('税率'),
    },
    {
      name: 'beforeAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.beforeAmount`).d('含税金额'),
    },
    {
      name: 'taxAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.taxAmount`).d('税额'),
    },
    {
      name: 'creationDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.documentDate`).d('单据日期'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZCOM}/v1/${organizationId}/verification-lines`,
        data,
        method: 'GET',
      };
    },
  },
});

export {
  StatementListDS,
  DocumentLineDS,
  StatementHeadDS,
  StatementSummaryLineDS,
  StatementDetailLineDS,
};
