/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-03-01 09:53:01
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-19 09:34:54
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam, getCurrentUser } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.statementMaintain.model';
const { common, moStatement } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const statementCreateListDS = () => ({
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
      name: 'supplierNumber',
      type: 'string',
      bind: 'supplierObj.supplierNumber',
    },
    {
      name: 'supplierTenantId',
      type: 'string',
      bind: 'supplierObj.supplierTenantId',
    },
    {
      name: 'sourceOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceOrderNum`).d('MO'),
    },
    {
      name: 'sourceOrder',
      type: 'object',
      label: intl.get(`${commonPrefix}.supplier`).d('MO'),
      lovCode: 'ZCOM.SUPPLIER_MO',
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: organizationId,
          supplierTenantId: record.get('supplierTenantId'),
        }),
      },
    },
    {
      name: 'sourceOrderNum',
      type: 'string',
      bind: 'sourceOrder.moNum',
    },
    {
      name: 'sourceOrderId',
      type: 'string',
      bind: 'sourceOrder.moId',
    },
    {
      name: 'documentTypeObj',
      type: 'object',
      lovCode: moStatement.documentType,
      textField: 'documentTypeName',
      label: intl.get(`${intlPrefix}.documentTypeObj`).d('MO类型'),
      dynamicProps: {
        lovPara: ({ record }) => ({
          documentClass: 'MO',
          tenantId: record.get('supplierTenantId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'moTypeCode',
      type: 'string',
      bind: 'documentTypeObj.documentTypeCode',
    },
    {
      name: 'moTypeId',
      type: 'string',
      bind: 'documentTypeObj.documentTypeId',
    },
    {
      name: 'supplierItemObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.supplierItemObj`).d('物料编码'),
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'supplierItemCode',
      type: 'string',
      bind: 'supplierItemObj.itemCode',
    },
    {
      name: 'supplierItemId',
      type: 'string',
      bind: 'supplierItemObj.itemId',
    },
    {
      name: 'receiveDateFrom',
      type: 'date',
      label: intl.get(`${intlPrefix}.receiveDateFrom`).d('入库日期从'),
      max: 'receiveDateTo',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      defaultValue: getMonthStartAndEnd()[0],
    },
    {
      name: 'receiveDateTo',
      type: 'date',
      label: intl.get(`${intlPrefix}.receiveDateTo`).d('入库日期至'),
      min: 'receiveDateFrom',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      defaultValue: getMonthStartAndEnd()[1],
    },
  ],
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.organizationName`).d('组织'),
    },
    {
      name: 'supplierDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierDescription`).d('供应商'),
    },
    {
      name: 'sourceOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceOrderNum`).d('MO'),
    },
    {
      name: 'moTypeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.moTypeName`).d('MO类型'),
    },
    {
      name: 'receiveDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.moTypeName`).d('入库日期'),
    },
    {
      name: 'supplierItemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItemCode`).d('物料'),
    },
    {
      name: 'supplierItemDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItemDescription`).d('物料描述'),
    },
    {
      name: 'sourceOrderQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceOrderQty`).d('工单数量'),
    },
    {
      name: 'completionQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.completionQty`).d('完工数量'),
    },
    {
      name: 'uom',
      type: 'string',
      label: intl.get(`${intlPrefix}.uom`).d('单位'),
    },
    {
      name: 'warehouseDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.warehouseDescription`).d('入库仓库'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: generateUrlWithGetParam(
          `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/query-to-create-order`
        ),
        data: {
          ...data,
          receiveDateFrom: data.receiveDateFrom ? data.receiveDateFrom.concat(' 00:00:00') : null,
          receiveDateTo: data.receiveDateTo ? data.receiveDateTo.concat(' 23:59:59') : null,
        },
        method: 'GET',
      };
    },
  },
});

const statementMaintainListDS = () => ({
  autoQuery: false,
  queryFields: [
    {
      name: 'verificationOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationOrderNum`).d('对账单'),
    },
    // {
    //   name: 'customerObj',
    //   type: 'object',
    //   label: intl.get(`${commonPrefix}.customer`).d('客户'),
    //   lovCode: common.customer,
    //   ignore: 'always',
    // },
    // {
    //   name: 'customerId',
    //   type: 'string',
    //   bind: 'customerObj.customerId',
    // },
    // {
    //   name: 'customerName',
    //   type: 'string',
    //   bind: 'customerObj.customerName',
    // },
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
      name: 'supplierNumber',
      type: 'string',
      bind: 'supplierObj.supplierNumber',
    },
    {
      name: 'verificationOrderType',
      type: 'string',
      lookupCode: moStatement.verificationOrderType,
      label: intl.get(`${intlPrefix}.verificationOrderType`).d('对账单类型'),
    },
    {
      name: 'creationDateFrom',
      type: 'date',
      label: intl.get(`${intlPrefix}.creationDateFrom`).d('创建日期从'),
      max: 'creationDateTo',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'creationDateTo',
      type: 'date',
      label: intl.get(`${intlPrefix}.creationDateTo`).d('创建日期至'),
      min: 'creationDateFrom',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'createdByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
    },
  ],
  fields: [
    {
      name: 'verificationOrderStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.organizationName`).d('对账单状态'),
    },
    {
      name: 'verificationOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationOrderNum`).d('对账单'),
    },
    {
      name: 'verificationOrderTypeMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationOrderTypeMeaning`).d('对账单类型'),
    },
    {
      name: 'creationDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.creationDate`).d('创建日期'),
    },
    {
      name: 'customerNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerNumber`).d('客户编码'),
    },
    {
      name: 'customerDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerDescription`).d('客户描述'),
    },
    {
      name: 'supplierNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierNumber`).d('供应商编码'),
    },
    {
      name: 'supplierDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierDescription`).d('供应商描述'),
    },
    {
      name: 'createdByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
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
      return {
        url: generateUrlWithGetParam(`${HLOS_ZCOM}/v1/${organizationId}/verification-orders`),
        data: {
          ...data,
          creationDateFrom: data.creationDateFrom
            ? data.creationDateFrom.concat(' 00:00:00')
            : null,
          creationDateTo: data.creationDateTo ? data.creationDateTo.concat(' 23:59:59') : null,
        },
        method: 'GET',
      };
    },
  },
});

const statementDetailHeadDS = () => {
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
        lookupCode: moStatement.verificationOrderType,
        label: intl.get(`${intlPrefix}.verificationOrderType`).d('对账单类型'),
        required: true,
        defaultValue: 'STANDARD_ORDER',
      },
      {
        name: 'supplierDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierDescription`).d('供应商'),
      },
      {
        name: 'customerDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerDescription`).d('客户'),
      },
      {
        name: 'amount',
        type: 'string',
        label: intl.get(`${intlPrefix}.amount`).d('对账含税总金额'),
      },
      {
        name: 'excludingTaxAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.excludingTaxAmount`).d('对账单总净价'),
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.creationDate`).d('创建时间'),
      },
      {
        name: 'createdByName',
        type: 'string',
        label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
      },
      {
        name: 'postingDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.postingDate`).d('过账时间'),
        required: true,
        transformRequest: (val) => {
          return val ? moment(val).format(DEFAULT_DATE_FORMAT) : '';
        },
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('备注'),
      },
      {
        name: 'fileUrl',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('头附件'),
      },
      {
        name: 'approvalOpinion',
        type: 'string',
        label: intl.get(`${intlPrefix}.approvalOpinion`).d('审批意见'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { verificationOrderId, executeLineIdList } = data;
        return {
          url: verificationOrderId
            ? `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/${verificationOrderId}`
            : generateUrlWithGetParam(
                `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/query-to-create-order`,
                {
                  executeLineIdList,
                }
              ),
          data: {
            ...data,
            executeLineIdList: undefined,
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
              verificationOrderType: 'STANDARD_ORDER',
              creationDate: moment().format(DEFAULT_DATE_FORMAT),
              createdByName: getCurrentUser().realName,
            };
          },
        };
      },
    },
  };
};

const statementDetailLineDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'sourceOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceOrderNum`).d('MO'),
      },
      {
        name: 'moTypeName',
        type: 'string',
        label: intl.get(`${intlPrefix}.moTypeName`).d('MO类型'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('物料编码'),
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemDescription`).d('物料描述'),
      },
      {
        name: 'supplierItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierItemCode`).d('供应商物料编码'),
      },
      {
        name: 'supplierItemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierItemDescription`).d('供应商物料描述'),
      },
      {
        name: 'sourceOrderQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceOrderQty`).d('工单数量'),
      },
      {
        name: 'completionQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.completionQty`).d('完工数量'),
      },
      {
        name: 'verificationQty',
        type: 'number',
        min: 0,
        max: 'reconcilableQty',
        label: intl.get(`${intlPrefix}.verificationQty`).d('对账数量'),
      },
      {
        name: 'moVerificationTotal',
        type: 'number',
        label: intl.get(`${intlPrefix}.moVerificationTotal`).d('工单对账总数'),
      },
      {
        name: 'uom',
        type: 'string',
        label: intl.get(`${intlPrefix}.uom`).d('单位'),
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
        name: 'externalOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.externalOrderNum`).d('采购订单'),
      },
      {
        name: 'externalOrderLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.externalOrderLineNum`).d('采购订单项目'),
      },
      {
        name: 'attributeString1',
        type: 'string',
        label: intl.get(`${intlPrefix}.attributeString1`).d('物料凭证编码'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('行备注'),
      },
      {
        name: 'fileUrl',
        type: 'string',
        label: intl.get(`${intlPrefix}.fileUrl`).d('行附件'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { executeLineIdList, verificationOrderId } = data;
        return {
          url: verificationOrderId
            ? `${HLOS_ZCOM}/v1/${organizationId}/verification-order-lines`
            : generateUrlWithGetParam(
                `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/query-to-create-order`,
                {
                  executeLineIdList,
                }
              ),
          data: {
            ...data,
            executeLineIdList: undefined,
          },
          method: 'GET',
        };
      },
    },
  };
};

/**
 * 获得相对当月AddMonthCount个月的起止日期
 * AddMonthCount为0 代表当月 为-1代表上一个月  为1代表下一个月 以此类推
 * ** */
const getMonthStartAndEnd = (AddMonthCount = 0) => {
  // 起止日期数组
  const startStop = [];
  // 获取当前时间
  let currentDate = new Date();
  let month = currentDate.getMonth() + AddMonthCount;
  if (month < 0) {
    // eslint-disable-next-line
    const n = parseInt(-month / 12);
    month += n * 12;
    currentDate.setFullYear(currentDate.getFullYear() - n);
  }
  currentDate = new Date(currentDate.setMonth(month));
  // 获得当前月份0-11
  const currentMonth = currentDate.getMonth();
  // 获得当前年份4位年
  const currentYear = currentDate.getFullYear();
  // 获得上一个月的第一天
  const currentMonthFirstDay = new Date(currentYear, currentMonth, 1);
  // 获得上一月的最后一天
  const currentMonthLastDay = new Date(currentYear, currentMonth + 1, 0);
  // 添加至数组
  startStop.push(moment(currentMonthFirstDay).format(DEFAULT_DATE_FORMAT));
  startStop.push(moment(currentMonthLastDay).format(DEFAULT_DATE_FORMAT));

  // 返回
  return startStop;
};

export {
  statementCreateListDS,
  statementMaintainListDS,
  statementDetailHeadDS,
  statementDetailLineDS,
};
