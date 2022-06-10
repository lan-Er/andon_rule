/*
 * @Descripttion:VMI申请单审核
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-02-22 09:46:34
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-07 21:27:31
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.quotationReview.model';
const { common, quotationMaintain, quotationReview } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const listDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'quotationOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.quotationOrderNum`).d('报价单号'),
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
        name: 'quotationOrderStatusList',
        type: 'string',
        lookupCode: quotationMaintain.quotationOrderStatus,
        label: intl.get(`${intlPrefix}.quotationOrderStatus`).d('报价单状态'),
        multiple: true,
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
        name: 'quotationOrderType',
        type: 'string',
        lookupCode: quotationMaintain.quotationOrderType,
        label: intl.get(`${intlPrefix}.quotationOrderType`).d('报价类型'),
      },
      {
        name: 'quotationSourceType',
        type: 'string',
        lookupCode: quotationReview.quotationSourceType,
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
        name: 'quotationOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.quotationOrderNum`).d('报价单'),
      },
      {
        name: 'quotationSourceTypeMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.quotationSourceTypeMeaning`).d('来源渠道'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'totalAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.totalAmount`).d('含税总额'),
      },
      {
        name: 'quotationOrderStatusMeaning',
        type: 'string',
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
            quotationOrderStatusList: null,
            customerTenantId: organizationId,
          },
          method: 'GET',
        };
      },
    },
  };
};

const headDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'customerCompanyName',
        type: 'string',
        label: intl.get(`${commonPrefix}.company`).d('公司'),
      },
      {
        name: 'quotationOrderTypeMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.quotationOrderType`).d('报价类型'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'quotationOrderName',
        type: 'string',
        label: intl.get(`${intlPrefix}.quotationOrderName`).d('报价单标题'),
      },
      {
        name: 'quotationOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.quotationOrderNum`).d('报价单号'),
      },
      {
        name: 'quotationOrderStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.quotationOrderStatus`).d('报价单状态'),
      },
      {
        name: 'currencyCode',
        type: 'string',
        label: intl.get(`${commonPrefix}.currency`).d('币种'),
      },
      {
        name: 'productionCycle',
        type: 'string',
        label: intl.get(`${intlPrefix}.productionCycle`).d('生产/备货周期(天)'),
      },
      {
        name: 'supplierPromiseDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.supplierPromiseDate`).d('承诺交货日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'quotationSourceTypeMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.quotationSourceType`).d('来源类型'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单号'),
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
  };
};

const lineDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'quotationOrderLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.quotationOrderLineNum`).d('行号'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
      },
      {
        name: 'customerItemDesc',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItem`).d('客户物料信息'),
      },
      {
        name: 'supplierItemCode',
        type: 'string',
      },
      {
        name: 'supplierItemDesc',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierItem`).d('供应商物料信息'),
      },
      {
        name: 'itemAttr',
        type: 'object',
        label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
      },
      {
        name: 'customerUomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerUomName`).d('单位'),
      },
      {
        name: 'customerQuotationQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerQuotationQty`).d('可供数量'),
      },
      {
        name: 'customerPrice',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerPrice`).d('含税单价'),
      },
      {
        name: 'customerCounterOfferPrice',
        type: 'number',
        label: intl.get(`${intlPrefix}.customerCounterOfferPrice`).d('还价单价'),
      },
      {
        name: 'counterOfferReason',
        type: 'string',
        label: intl.get(`${intlPrefix}.counterOfferReason`).d('还价理由'),
      },
      {
        name: 'taxRate',
        type: 'string',
        label: intl.get(`${intlPrefix}.taxRate`).d('税率（%）'),
      },
      {
        name: 'customerExTaxPrice',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerExTaxPrice`).d('未税单价'),
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
        name: 'fileUrl',
        type: 'string',
        label: intl.get(`${intlPrefix}.fileUrl`).d('附件'),
      },
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url: `${HLOS_ZCOM}/v1/${organizationId}/quotation-order-lines`,
          method: 'GET',
        };
      },
    },
  };
};

export { listDS, headDS, lineDS };
