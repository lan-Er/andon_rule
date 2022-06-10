/**
 * @Description: 需求发布DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-05 11:49:10
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.requirementRelease.model';
const { common, requirementRelease } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const lineUrl = `${HLOS_ZCOM}/v1/${organizationId}/po-lines`;

const requirementReleaseListDS = () => {
  return {
    autoQuery: true,
    queryFields: [
      {
        name: 'poNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poNum`).d('采购订单号'),
      },
      {
        name: 'scmOuName',
        type: 'string',
        label: intl.get(`${intlPrefix}.scmOu`).d('采购中心'),
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
        name: 'supplierNumber',
        type: 'string',
        bind: 'supplierObj.supplierNumber',
      },
      {
        name: 'supplierName',
        type: 'string',
        bind: 'supplierObj.supplierName',
        ignore: 'always',
      },
      {
        name: 'poStatus',
        type: 'string',
        lookupCode: requirementRelease.poStatus,
        label: intl.get(`${intlPrefix}.poStatus`).d('订单状态'),
        multiple: true,
        defaultValue: ['RELEASING', 'FEEDBACK'],
      },
      {
        name: 'buyerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.buyer`).d('采购员'),
      },
      {
        name: 'poTypeCode',
        type: 'string',
        lookupCode: requirementRelease.poType,
        label: intl.get(`${intlPrefix}.poTypeCode`).d('订单类型'),
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
        label: intl.get(`${intlPrefix}.sourceSys`).d('来源系统'),
      },
    ],
    fields: [
      {
        name: 'scmOuName',
        type: 'string',
        label: intl.get(`${intlPrefix}.scmOu`).d('采购中心'),
      },
      {
        name: 'poNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poNum`).d('采购订单号'),
      },
      {
        name: 'poStatus',
        type: 'string',
        lookupCode: requirementRelease.poStatus,
        label: intl.get(`${intlPrefix}.poStatus`).d('订单状态'),
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
        lookupCode: requirementRelease.poType,
        label: intl.get(`${intlPrefix}.poTypeCode`).d('订单类型'),
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.creationDate`).d('创建时间'),
      },
      {
        name: 'buyerName',
        type: 'string',
        label: intl.get(`${intlPrefix}.buyer`).d('采购员'),
      },
      {
        name: 'sourceSysName',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceSys`).d('来源系统'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { poStatus: poStatusList } = data;
        return {
          url: generateUrlWithGetParam(`${HLOS_ZCOM}/v1/${organizationId}/po-headers`, {
            poStatusList,
          }),
          data: {
            ...data,
            poStatus: undefined,
            creationDateStart: data.creationDateStart
              ? data.creationDateStart.concat(' 00:00:00')
              : null,
            creationDateEnd: data.creationDateEnd ? data.creationDateEnd.concat(' 23:59:59') : null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const requirementReleaseDetailDS = () => {
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
        label: intl.get(`${intlPrefix}.poTypeCodeMeaning`).d('订单类型'),
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
        name: 'sourceSysName',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceSysName`).d('来源系统'),
      },
      {
        name: 'creationDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.creationDate`).d('创建日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'totalAmount',
        type: 'number',
        label: intl.get(`${intlPrefix}.totalAmount`).d('含税总价'),
      },
      {
        name: 'excludingTaxAmount',
        type: 'number',
        label: intl.get(`${intlPrefix}.excludingTaxAmount`).d('总净价'),
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

const requirementReleaseLineDS = () => {
  return {
    autoQuery: false,
    selection: false,
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
        label: intl.get(`${commonPrefix}.itemCode`).d('物料编码'),
      },
      {
        name: 'description',
        type: 'string',
        label: intl.get(`${commonPrefix}.description`).d('物料描述'),
      },
      {
        name: 'unitPrice',
        type: 'string',
        label: intl.get(`${intlPrefix}.unitPrice`).d('含税单价'),
      },
      {
        name: 'excludingTaxPrice',
        type: 'string',
        label: intl.get(`${intlPrefix}.excludingTaxPrice`).d('净价'),
      },
      {
        name: 'demandQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandQty`).d('需求数量'),
      },
      {
        name: 'promiseQty',
        type: 'string',
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
        label: intl.get(`${intlPrefix}.lineAmount`).d('含税总价'),
      },
      {
        name: 'excludingTaxAmount',
        type: 'string',
        label: intl.get(`${intlPrefix}.excludingTaxAmount`).d('总净价'),
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
          url: lineUrl,
          method: 'GET',
        };
      },
    },
  };
};

export { requirementReleaseListDS, requirementReleaseDetailDS, requirementReleaseLineDS };
