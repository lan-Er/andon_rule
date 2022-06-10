/**
 * @Description: 对账单审核DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-03-01 13:57:20
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.statementReview.model';
const { common, moStatementReview } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const reviewListDS = () => ({
  autoQuery: false,
  queryFields: [
    {
      name: 'verificationOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationOrderNum`).d('对账单'),
    },
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
    },
    {
      name: 'verificationOrderType',
      type: 'string',
      lookupCode: moStatementReview.verificationOrderType,
      label: intl.get(`${intlPrefix}.verificationOrderType`).d('对账单类型'),
    },
    {
      name: 'verificationOrderStatusList',
      type: 'string',
      lookupCode: moStatementReview.verificationOrderStatus,
      label: intl.get(`${intlPrefix}.verificationOrderStatus`).d('对账单状态'),
      multiple: true,
      dynamicProps: {
        lookupAxiosConfig: () => ({
          transformResponse(data) {
            let newData = [];
            if (data && data.length) {
              data.forEach((item) => {
                if (item.value !== 'NEW') {
                  newData.push(item);
                }
              });
            } else {
              newData = data;
            }
            return newData;
          },
        }),
      },
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
      name: 'verificationOrderStatus',
      type: 'string',
      lookupCode: moStatementReview.verificationOrderStatus,
      label: intl.get(`${intlPrefix}.verificationOrderStatus`).d('对账单状态'),
    },
    {
      name: 'verificationOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationOrderNum`).d('对账单'),
    },
    {
      name: 'verificationOrderType',
      type: 'string',
      lookupCode: moStatementReview.verificationOrderType,
      label: intl.get(`${intlPrefix}.verificationOrderType`).d('对账单类型'),
    },
    {
      name: 'creationDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.creationDate`).d('创建日期'),
    },
    {
      name: 'postingDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.creationDate`).d('过账日期'),
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
    {
      name: 'createdByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { verificationOrderStatusList } = data;
      return {
        url: generateUrlWithGetParam(
          `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/audit-list`,
          {
            verificationOrderStatusList,
          }
        ),
        data: {
          ...data,
          creationDateFrom: data.creationDateFrom
            ? data.creationDateFrom.concat(' 00:00:00')
            : null,
          creationDateTo: data.creationDateTo ? data.creationDateTo.concat(' 23:59:59') : null,
          verificationOrderStatusList: null,
        },
        method: 'GET',
      };
    },
  },
});

const reviewDetailHeadDS = () => ({
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
      lookupCode: moStatementReview.verificationOrderType,
      label: intl.get(`${intlPrefix}.verificationOrderType`).d('对账单类型'),
    },
    {
      name: 'verificationOrderStatus',
      type: 'string',
      lookupCode: moStatementReview.verificationOrderStatus,
      label: intl.get(`${intlPrefix}.verificationOrderStatus`).d('对账单状态'),
    },
    {
      name: 'supplierDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
    },
    {
      name: 'customerDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerName`).d('客户'),
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
      name: 'approvalBy',
      type: 'string',
    },
    {
      name: 'approvalByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.approvalByName`).d('审核人'),
    },
    {
      name: 'postingDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.postingDate`).d('过账时间'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
    {
      name: 'approvalOpinion',
      type: 'string',
      label: intl.get(`${intlPrefix}.approvalOpinion`).d('审批意见'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { verificationOrderId } = data;
      return {
        data: {
          ...data,
          verificationOrderId: undefined,
        },
        url: `${HLOS_ZCOM}/v1/${organizationId}/verification-orders/${verificationOrderId}`,
        method: 'GET',
      };
    },
  },
});

const reviewDetailLineDS = () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'verificationOrderLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationOrderLineNum`).d('行号'),
    },
    {
      name: 'sourceOrderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.mo`).d('MO'),
    },
    {
      name: 'moTypeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.moType`).d('MO类型'),
    },
    {
      name: 'customerItemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
    },
    {
      name: 'customerItemDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemDescription`).d('物料名称'),
    },
    {
      name: 'supplierItemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItemCode`).d('供应商料号'),
    },
    {
      name: 'supplierItemDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItemDescription`).d('供应商料号描述'),
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
      type: 'string',
      label: intl.get(`${intlPrefix}.verificationQty`).d('本次对账数量'),
    },
    {
      name: 'moVerificationTotal',
      type: 'number',
      label: intl.get(`${intlPrefix}.moVerificationTotal`).d('工单对账总数'),
    },
    {
      name: 'verificationUom',
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
      name: 'currencyCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.currencyCode`).d('币种'),
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
    read: (config) => {
      return {
        ...config,
        url: `${HLOS_ZCOM}/v1/${organizationId}/verification-order-lines`,
        method: 'GET',
      };
    },
  },
});

export { reviewListDS, reviewDetailHeadDS, reviewDetailLineDS };
