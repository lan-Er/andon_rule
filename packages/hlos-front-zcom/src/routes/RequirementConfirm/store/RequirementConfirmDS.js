/**
 * @Description: 需求确认DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-11 14:15:00
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.requirementConfirm.model';
const { requirementConfirm } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const requirementConfirmListDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'poNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerPoNum`).d('客户采购订单号'),
      },
      {
        name: 'customerObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
        lovCode: requirementConfirm.customer,
        ignore: 'always',
      },
      {
        name: 'customerId',
        type: 'string',
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerCode',
        type: 'string',
        bind: 'customerObj.customerCode',
      },
      {
        name: 'customerName',
        type: 'string',
        bind: 'customerObj.customerName',
      },
      {
        name: 'poTypeCode',
        type: 'string',
        lookupCode: requirementConfirm.poType,
        label: intl.get(`${intlPrefix}.poTypeCode`).d('订单类型'),
      },
      {
        name: 'poStatus',
        type: 'string',
        lookupCode: requirementConfirm.poStatus,
        label: intl.get(`${intlPrefix}.poStatus`).d('订单状态'),
        multiple: true,
      },
      {
        name: 'creationDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.creationDateStart`).d('创建时间从'),
        max: 'creationDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'creationDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.creationDateEnd`).d('创建时间至'),
        min: 'creationDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'sourceSysName',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceSysName`).d('来源系统'),
      },
      {
        name: 'buyerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.buyer`).d('采购员'),
      },
      {
        name: 'publishDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.publishDateStart`).d('发布日期从'),
        max: 'publishDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'publishDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.publishDateEnd`).d('发布日期至'),
        min: 'publishDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
    ],
    fields: [
      {
        name: 'poStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.poStatus`).d('订单状态'),
      },
      {
        name: 'poNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerPoNum`).d('客户订单号'),
      },
      {
        name: 'supplierNumber',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplierNumber`).d('供应商编码'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplierName`).d('供应商名称'),
      },
      {
        name: 'supplierSiteAddress',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplierSiteAddress`).d('供应商地点'),
      },
      {
        name: 'poTypeCode',
        type: 'string',
        lookupCode: requirementConfirm.poType,
        label: intl.get(`${intlPrefix}.poType`).d('订单类型'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.customer`).d('客户'),
      },
      {
        name: 'publishDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.publishDate`).d('发布日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'buyerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.buyer`).d('采购员'),
      },
      {
        name: 'poSoNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poSoNum`).d('销售订单号'),
      },
      {
        name: 'sourceSysName',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceSys`).d('来源系统'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { poStatus, curTab } = data;
        let poStatusList = [];
        const existArr = [];
        poStatus.forEach((v) => {
          if (curTab.indexOf(v) !== -1) {
            existArr.push(v);
          }
        });
        if (!poStatus.length) {
          poStatusList = curTab;
        } else {
          poStatusList = existArr.length > 0 ? existArr : ['NULL'];
        }
        return {
          url: generateUrlWithGetParam(
            `${HLOS_ZCOM}/v1/${organizationId}/po-headers/listBySupplier`,
            {
              poStatusList,
            }
          ),
          data: {
            ...data,
            poStatus: undefined,
            curTab: undefined,
            creationDateStart: data.creationDateStart
              ? data.creationDateStart.concat(' 00:00:00')
              : null,
            creationDateEnd: data.creationDateEnd ? data.creationDateEnd.concat(' 23:59:59') : null,
            publishDateStart: data.publishDateStart
              ? data.publishDateStart.concat(' 00:00:00')
              : null,
            publishDateEnd: data.publishDateEnd ? data.publishDateEnd.concat(' 23:59:59') : null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const requirementConfirmDetailDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'poNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poNum`).d('采购订单号'),
      },
      {
        name: 'supplierNumber',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplierName`).d('供应商名称'),
      },
      {
        name: 'supplierSiteAddress',
        type: 'string',
        label: intl.get(`${commonPrefix}.supplierSiteAddress`).d('供应商地点'),
      },
      {
        name: 'poTypeCodeMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.poType`).d('订单类型'),
      },
      {
        name: 'scmOuName',
        type: 'string',
        label: intl.get(`${intlPrefix}.scmOu`).d('采购中心'),
      },
      {
        name: 'buyerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.buyer`).d('采购员'),
      },
      {
        name: 'publishDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.releaseDate`).d('发布日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'totalAmount',
        type: 'number',
        label: intl.get(`${intlPrefix}.totalAmount`).d('订单总价'),
      },
      {
        name: 'taxRate',
        type: 'number',
        label: intl.get(`${intlPrefix}.taxRate`).d('税率'),
      },
      {
        name: 'paymentMethod',
        type: 'string',
        label: intl.get(`${intlPrefix}.paymentMethod`).d('付款条件'),
      },
      {
        name: 'receiveAddress',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveAddress`).d('收货方地址'),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('备注信息'),
      },
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url: `${HLOS_ZCOM}/v1/${organizationId}/po-headers/${config.data.poHeaderId}`,
          method: 'GET',
        };
      },
    },
  };
};

const requirementConfirmLineDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'poHeaderId',
        type: 'string',
      },
    ],
    fields: [
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerItemCode`).d('客户物料编码'),
      },
      {
        name: 'description',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerItemDescription`).d('客户物料描述'),
      },
      {
        name: 'supplierItemCode',
        type: 'string',
        label: intl.get(`${commonPrefix}.itemCode`).d('物料编码'),
      },
      {
        name: 'unitPrice',
        type: 'string',
        label: intl.get(`${intlPrefix}.unitPrice`).d('单价'),
      },
      {
        name: 'demandQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandQty`).d('需求数量'),
      },
      {
        name: 'promiseQty',
        type: 'number',
        validator: positiveNumberValidator,
        label: intl.get(`${intlPrefix}.promiseQty`).d('承诺数量'),
      },
      {
        name: 'uomName',
        type: 'string',
        label: intl.get(`${commonPrefix}.uom`).d('单位'),
      },
      {
        name: 'lineAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.lineAmount`).d('含税价'),
      },
      {
        name: 'taxRate',
        type: 'string',
        label: intl.get(`${intlPrefix}.taxRate`).d('税率(%)'),
      },
      {
        name: 'demandDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.demandDate`).d('需求日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'promiseDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.promiseDate`).d('承诺交期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'receiveOrg',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveOrg`).d('收货组织'),
      },
    ],
    transport: {
      read: (config) => {
        return {
          ...config,
          url: `${HLOS_ZCOM}/v1/${organizationId}/po-lines`,
          method: 'GET',
        };
      },
      update: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/po-lines/confirmPoLine`,
          data: [
            Object.assign(data[0], {
              promiseDate: moment(data[0].promiseDate).format('YYYY-MM-DD HH:mm:ss'),
            }),
          ],
          method: 'PUT',
        };
      },
    },
    events: {
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
    },
  };
};

const promiseDateDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'promiseDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.promiseDateReplys`).d('交期批量回复'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
        required: true,
      },
    ],
  };
};

export {
  requirementConfirmListDS,
  requirementConfirmDetailDS,
  requirementConfirmLineDS,
  promiseDateDS,
};
