/**
 * @Description: 采购订单DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-19 10:20:40
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { positiveNumberValidator } from 'hlos-front/lib/utils/utils';
import { formatnumber } from '@/utils/renderer';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.poMaintain.model';
const { common, poMaintain } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZCOM}/v1/${organizationId}/pos`; // po头
const lineUrl = `${HLOS_ZCOM}/v1/${organizationId}/po-lines`; // po行
const outsrcUrl = `${HLOS_ZCOM}/v1/${organizationId}/po-outsources`; // 外协物料

const PoListDS = () => ({
  autoQuery: false,
  queryFields: [
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poNum`).d('订单编号'),
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
      name: 'poStatusList',
      type: 'string',
      lookupCode: poMaintain.poStatus,
      label: intl.get(`${intlPrefix}.poStatus`).d('订单状态'),
      multiple: true,
      defaultValue: ['NEW', 'REFUSED'],
    },
    {
      name: 'companyObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.company`).d('公司'),
      lovCode: common.company,
      ignore: 'always',
    },
    {
      name: 'customerCompanyId',
      type: 'string',
      bind: 'companyObj.companyId',
    },
    {
      name: 'poBusinessUnitObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.businessUnit`).d('业务实体'),
      lovCode: common.businessUnit,
      cascadeMap: { companyId: 'customerCompanyId' },
      ignore: 'always',
    },
    {
      name: 'poBusinessUnitId',
      type: 'string',
      bind: 'poBusinessUnitObj.businessUnitId',
    },
    {
      name: 'creationDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${intlPrefix}.creationDate`).d('创建时间'),
      transformRequest: (val) =>
        val ? `${moment(val.start).format(DEFAULT_DATE_FORMAT)} 00:00:00` : null,
    },
    {
      name: 'creationDateEnd',
      type: 'date',
      bind: 'creationDateStart.end',
      transformRequest: (val) =>
        val ? `${moment(val).format(DEFAULT_DATE_FORMAT)} 23:59:59` : null,
    },
    {
      name: 'poSourceType',
      type: 'string',
      lookupCode: poMaintain.poSourceType,
      label: intl.get(`${intlPrefix}.poSourceType`).d('来源类型'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单号'),
    },
    // {
    //   name: 'buyer',
    //   type: 'string',
    //   label: intl.get(`${intlPrefix}.buyer`).d('采购员'),
    // },
  ],
  fields: [
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poNum`).d('订单编号'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
    },
    {
      name: 'poTypeMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.poType`).d('订单类型'),
    },
    {
      name: 'totalAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.totalAmount`).d('总金额（含税）'),
    },
    // {
    //   name: 'buyer',
    //   type: 'string',
    //   label: intl.get(`${intlPrefix}.buyer`).d('采购员'),
    // },
    {
      name: 'customerContacts',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerContacts`).d('客户联系人'),
    },
    {
      name: 'customerContactsPhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerContactsPhone`).d('客户联系电话'),
    },
    {
      name: 'supplierContacts',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierContacts`).d('供应商联系人'),
    },
    {
      name: 'supplierContactsPhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierContactsPhone`).d('供应商联系电话'),
    },
    {
      name: 'consigneeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.consigneeName`).d('收货人'),
    },
    {
      name: 'consigneePhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.consigneePhone`).d('收货人联系电话'),
    },
    {
      name: 'receivingAddress',
      type: 'string',
      label: intl.get(`${intlPrefix}.receivingAddress`).d('收货地点'),
    },
    // {
    //   name: 'invoiceAddressTo',
    //   type: 'string',
    //   label: intl.get(`${intlPrefix}.invoiceAddressTo`).d('收票地点'),
    // },
    {
      name: 'poSourceTypeMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.poSourceType`).d('来源类型'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单号'),
      transformResponse: (val, object) => val || object.externalSourceDocNum,
    },
    {
      name: 'creationDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.creationDate`).d('创建时间'),
    },
    {
      name: 'poStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.poStatus`).d('状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { poStatusList } = data;
      return {
        url: generateUrlWithGetParam(url, { poStatusList }),
        data: {
          ...data,
          poStatusList: null,
          customerTenantId: organizationId,
        },
        method: 'GET',
      };
    },
  },
});

const PoHeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'poBusinessUnitObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.businessUnit`).d('业务实体'),
      lovCode: common.businessUnit,
      ignore: 'always',
      required: true,
    },
    {
      name: 'poBusinessUnitId',
      type: 'string',
      bind: 'poBusinessUnitObj.businessUnitId',
    },
    {
      name: 'poBusinessUnitCode',
      type: 'string',
      bind: 'poBusinessUnitObj.businessUnitCode',
    },
    {
      name: 'poBusinessUnitName',
      type: 'string',
      bind: 'poBusinessUnitObj.businessUnitName',
    },
    {
      name: 'customerCompanyId',
      type: 'string',
      bind: 'poBusinessUnitObj.companyId',
    },
    {
      name: 'poType',
      type: 'string',
      lookupCode: poMaintain.poType,
      label: intl.get(`${intlPrefix}.poType`).d('订单类型'),
      required: true,
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
      lovCode: common.supplier,
      ignore: 'always',
      required: true,
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
      name: 'poStatus',
      type: 'string',
      lookupCode: poMaintain.poStatus,
      label: intl.get(`${intlPrefix}.poStatus`).d('订单状态'),
      defaultValue: 'NEW',
    },
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poNum`).d('订单编号'),
    },
    {
      name: 'poInventoryOrgObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.poInventoryOrg`).d('收货库存组织'),
      lovCode: common.inventoryOrg,
      cascadeMap: { businessUnitId: 'poBusinessUnitId' },
      ignore: 'always',
    },
    {
      name: 'poInventoryOrgId',
      type: 'string',
      bind: 'poInventoryOrgObj.inventoryOrgId',
    },
    {
      name: 'poInventoryOrgCode',
      type: 'string',
      bind: 'poInventoryOrgObj.inventoryOrgCode',
    },
    {
      name: 'poInventoryOrgName',
      type: 'string',
      bind: 'poInventoryOrgObj.inventoryOrgName',
    },
    {
      name: 'buyer',
      type: 'string',
      label: intl.get(`${intlPrefix}.buyer`).d('采购员'),
    },
    {
      name: 'customerContacts',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerContacts`).d('客户联系人'),
    },
    {
      name: 'customerContactsPhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerContactsPhone`).d('客户联系电话'),
    },
    {
      name: 'supplierContacts',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierContacts`).d('供应商联系人'),
    },
    {
      name: 'supplierContactsPhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierContactsPhone`).d('供应商联系电话'),
    },
    {
      name: 'consigneeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.consigneeName`).d('收货人'),
    },
    {
      name: 'consigneePhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.consigneePhone`).d('收货人联系电话'),
    },
    {
      name: 'receivingAddress',
      type: 'string',
      bind: 'poInventoryOrgObj.fullAddress',
      label: intl.get(`${intlPrefix}.receivingAddress`).d('收货地点'),
    },
    // {
    //   name: 'invoiceAddressTo',
    //   type: 'string',
    //   bind: 'poBusinessUnitObj.fullAddress',
    //   label: intl.get(`${intlPrefix}.invoiceAddressTo`).d('收票地点'),
    // },
    {
      name: 'currencyObj',
      type: 'object',
      lovCode: common.currency,
      label: intl.get(`${commonPrefix}.currency`).d('币种'),
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
      name: 'taxRateObj',
      type: 'object',
      lovCode: common.taxRate,
      label: intl.get(`${intlPrefix}.taxRate`).d('税率（%）'),
      textField: 'taxRate',
      ignore: 'always',
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
      name: 'poSourceType',
      type: 'string',
      lookupCode: poMaintain.poSourceType,
      label: intl.get(`${intlPrefix}.poSourceType`).d('来源类型'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.sourceDocNum`).d('来源单号'),
    },
    {
      name: 'exTaxAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.exTaxAmount`).d('总金额（不含税）'),
    },
    {
      name: 'totalAmount',
      type: 'string',
      label: intl.get(`${intlPrefix}.totalAmount`).d('总金额（含税）'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('订单备注'),
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'poBusinessUnitObj') {
        record.set('poInventoryOrgObj', null);
        record.set('receivingAddress', null);
        // if (!record.get('poBusinessUnitId')) {
        //   record.set('invoiceAddressTo', null);
        // }
      }
    },
  },
  transport: {
    read: ({ data }) => {
      const { poId } = data;
      return {
        data: {
          ...data,
          poId: undefined,
        },
        url: `${HLOS_ZCOM}/v1/${organizationId}/pos/${poId}`,
        method: 'GET',
        transformResponse: (value) => {
          const newValue = JSON.parse(value);
          return {
            ...newValue,
            exTaxAmount: newValue.exTaxAmount ? formatnumber(newValue.exTaxAmount, 2) : null,
            totalAmount: newValue.totalAmount ? formatnumber(newValue.totalAmount, 2) : null,
            sourceDocNum: newValue.sourceDocNum || newValue.externalSourceDocNum,
          };
        },
      };
    },
    create: ({ data }) => {
      return {
        url,
        data: {
          ...data[0],
          sourceDocNum: data[0].poSourceType !== 'EXTERNAL_SYSTEM' ? data[0].sourceDocNum : null,
          externalSourceDocNum:
            data[0].poSourceType === 'EXTERNAL_SYSTEM' ? data[0].sourceDocNum : null,
        },
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url,
        data: {
          ...data[0],
          sourceDocNum: data[0].poSourceType !== 'EXTERNAL_SYSTEM' ? data[0].sourceDocNum : null,
          externalSourceDocNum:
            data[0].poSourceType === 'EXTERNAL_SYSTEM' ? data[0].sourceDocNum : null,
        },
        method: 'PUT',
      };
    },
  },
});

const PoLineDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'poLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poLineNum`).d('行号'),
    },
    {
      name: 'poInventoryOrgObj',
      type: 'object',
      lovCode: common.inventoryOrg,
      label: intl.get(`${intlPrefix}.poInventoryOrg`).d('收货库存组织'),
      dynamicProps: {
        lovPara: ({ record }) => ({
          businessUnitId: record.get('poBusinessUnitId'),
        }),
      },
      ignore: 'always',
      required: true,
    },
    {
      name: 'poInventoryOrgId',
      type: 'string',
      bind: 'poInventoryOrgObj.inventoryOrgId',
    },
    {
      name: 'poInventoryOrgCode',
      type: 'string',
      bind: 'poInventoryOrgObj.inventoryOrgCode',
    },
    {
      name: 'poInventoryOrgName',
      type: 'string',
      bind: 'poInventoryOrgObj.inventoryOrgName',
    },
    {
      name: 'customerItemObj',
      type: 'object',
      lovCode: common.itemMaindata,
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      ignore: 'always',
      required: true,
    },
    {
      name: 'customerItemId',
      type: 'string',
      bind: 'customerItemObj.itemId',
    },
    {
      name: 'customerItemCode',
      type: 'string',
      bind: 'customerItemObj.itemCode',
    },
    {
      name: 'customerItemDesc',
      type: 'string',
      bind: 'customerItemObj.itemDesc',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'customerDemandQty',
      type: 'number',
      step: 1,
      validator: positiveNumberValidator,
      label: intl.get(`${intlPrefix}.customerDemandQty`).d('采购数量'),
      required: true,
    },
    {
      name: 'customerUomId',
      type: 'string',
      bind: 'customerItemObj.uomId',
    },
    {
      name: 'customerUomCode',
      type: 'string',
      bind: 'customerItemObj.uomCode',
    },
    {
      name: 'customerUomName',
      type: 'string',
      bind: 'customerItemObj.uomName',
      label: intl.get(`${intlPrefix}.uomName`).d('单位'),
    },
    {
      name: 'customerExTaxPrice',
      type: 'number',
      label: intl.get(`${intlPrefix}.customerExTaxPrice`).d('未税单价'),
      required: true,
    },
    {
      name: 'customerDemandDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.customerDemandDate`).d('期望到货日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      required: true,
    },
    {
      name: 'taxRateObj',
      type: 'object',
      lovCode: common.taxRate,
      label: intl.get(`${intlPrefix}.taxRate`).d('税率（%）'),
      ignore: 'always',
      textField: 'taxRate',
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
      name: 'customerPrice',
      type: 'number',
      label: intl.get(`${intlPrefix}.customerPrice`).d('含税单价'),
      validator: positiveNumberValidator,
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      label: intl.get(`${intlPrefix}.amount`).d('行金额（含税）'),
      required: true,
    },
    {
      name: 'toleranceType',
      type: 'string',
      lookupCode: poMaintain.toleranceType,
      label: intl.get(`${intlPrefix}.toleranceType`).d('允差类型'),
    },
    {
      name: 'customerToleranceValue',
      type: 'number',
      label: intl.get(`${intlPrefix}.toleranceValue`).d('允差值'),
      step: 0.01,
      validator: positiveNumberValidator,
      cascadeMap: { toleranceType: 'toleranceType' },
    },
    {
      name: 'poLineStatus',
      type: 'string',
      lookupCode: poMaintain.poStatus,
      label: intl.get(`${intlPrefix}.poLineStatus`).d('状态'),
      defaultValue: 'NEW',
    },
    {
      name: 'consigneeName',
      type: 'string',
      label: intl.get(`${intlPrefix}.consigneeName`).d('收货人'),
    },
    {
      name: 'consigneePhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.consigneePhone`).d('收货人联系电话'),
    },
    {
      name: 'receivingAddress',
      type: 'string',
      label: intl.get(`${intlPrefix}.receivingAddress`).d('收货地点'),
    },
    {
      name: 'customerDeliveryQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerDeliveryQty`).d('供应商发货数量'),
    },
    {
      name: 'customerReceivedQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerReceivedQty`).d('实收数量'),
    },
    {
      name: 'customerReturnedQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerReturnedQty`).d('退货数量'),
    },
    {
      name: 'customerDqcQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.customerDqcQty`).d('不合格数量'),
      step: 1,
      max: 'customerReceivedQty',
    },
    {
      name: 'supplierPromiseDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierPromiseDate`).d('承诺到货日期'),
    },
    {
      name: 'brand',
      type: 'string',
      label: intl.get(`${intlPrefix}.brand`).d('品牌'),
    },
    {
      name: 'specification',
      type: 'string',
      label: intl.get(`${intlPrefix}.specification`).d('规格'),
    },
    {
      name: 'model',
      type: 'string',
      label: intl.get(`${intlPrefix}.model`).d('型号'),
    },
    {
      name: 'process',
      type: 'string',
      label: intl.get(`${intlPrefix}.process`).d('加工工艺'),
    },
    {
      name: 'supplierItemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItemCode`).d('供应商物料编码'),
    },
    {
      name: 'supplierItemDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierItemDesc`).d('供应商物料说明'),
    },
    {
      name: 'consignerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.consignerName`).d('发货人'),
    },
    {
      name: 'consignerPhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.consignerPhone`).d('发货人联系电话'),
    },
    {
      name: 'deliveryAddress',
      type: 'string',
      label: intl.get(`${intlPrefix}.deliveryAddress`).d('发货地点'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ name, record }) => {
      if (name === 'customerPrice' || name === 'taxRateObj' || name === 'customerDemandQty') {
        const { customerPrice, taxRate, customerDemandQty } = record.toData();
        if (name === 'customerPrice' && customerPrice) {
          record.set('customerPrice', customerPrice.toFixed(6));
        }
        // 计算不含税单价 = 含税单价 /（1 + 税率）
        if (customerPrice && taxRate) {
          record.set('customerExTaxPrice', (customerPrice / (1 + taxRate * 0.01)).toFixed(6));
        } else {
          record.set('customerExTaxPrice', null);
        }
        // 计算行金额（含税）= 含税单价 * 采购数量
        if (customerPrice && customerDemandQty) {
          record.set('amount', (customerPrice.toFixed(6) * customerDemandQty).toFixed(6));
        } else {
          record.set('amount', null);
        }
      }
      if (name === 'customerItemObj') {
        record.set('itemAttr', null);
      }
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: lineUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: lineUrl,
        data: {
          ...data[0],
          customerDemandDate: `${data[0].customerDemandDate} 00:00:00`,
        },
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: lineUrl,
        data: {
          ...data[0],
          customerDemandDate: `${data[0].customerDemandDate} 00:00:00`,
        },
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: lineUrl,
        data,
        method: 'DELETE',
      };
    },
  },
});

const PoOutsourceLineDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'poOutsourceNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.poOutsourceNum`).d('行号'),
    },
    {
      name: 'customerItemObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      lovCode: common.itemMaindata,
      ignore: 'always',
      required: true,
    },
    {
      name: 'customerItemId',
      type: 'string',
      bind: 'customerItemObj.itemId',
    },
    {
      name: 'customerItemCode',
      type: 'string',
      bind: 'customerItemObj.itemCode',
    },
    {
      name: 'customerItemDesc',
      type: 'string',
      bind: 'customerItemObj.itemDesc',
      label: intl.get(`${intlPrefix}.itemDesc`).d('物料说明'),
    },
    {
      name: 'customerUomId',
      type: 'string',
      bind: 'customerItemObj.uomId',
    },
    {
      name: 'customerUomCode',
      type: 'string',
      bind: 'customerItemObj.uomCode',
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemAttr`).d('关键属性'),
    },
    {
      name: 'customerUomName',
      type: 'string',
      bind: 'customerItemObj.uomName',
      label: intl.get(`${intlPrefix}.uomName`).d('单位'),
      required: true,
    },
    {
      name: 'customerPromiseQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.customerPromiseQty`).d('需求数量'),
      step: 1,
      validator: positiveNumberValidator,
      required: true,
    },
    {
      name: 'customerPromiseDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.customerPromiseDate`).d('预计到货日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      min: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
      defaultValue: new Date(),
      required: true,
    },
    {
      name: 'outsrcType',
      type: 'string',
      lookupCode: poMaintain.outsrcType,
      label: intl.get(`${intlPrefix}.outsrcType`).d('供应类型'),
      required: true,
      defaultValue: 'UNSPECIFIED',
    },
    {
      name: 'outsrcSupplierObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.outsrcSupplier`).d('外协料供应商'),
      lovCode: common.supplier,
      ignore: 'always',
    },
    {
      name: 'outsrcSupplierId',
      type: 'string',
      bind: 'outsrcSupplierObj.supplierId',
    },
    {
      name: 'outsrcSupplierNumber',
      type: 'string',
      bind: 'outsrcSupplierObj.supplierNumber',
    },
    {
      name: 'outsrcSupplierName',
      type: 'string',
      bind: 'outsrcSupplierObj.supplierName',
    },
    {
      name: 'outsrcSupplierContacts',
      type: 'string',
      label: intl.get(`${intlPrefix}.outsrcSupplierContacts`).d('联系人'),
    },
    {
      name: 'outsrcSupplierPhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.outsrcSupplierPhone`).d('联系电话'),
    },
    {
      name: 'specification',
      type: 'string',
      label: intl.get(`${intlPrefix}.specification`).d('规格'),
    },
    {
      name: 'model',
      type: 'string',
      label: intl.get(`${intlPrefix}.model`).d('型号'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
    {
      name: 'customerDeliveryQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerDeliveryQty`).d('实发数量'),
    },
    {
      name: 'customerReceivedQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.customerReceivedQty`).d('实收数量'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ name, record }) => {
      if (name === 'customerItemObj') {
        record.set('itemAttr', null);
      }
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url: outsrcUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: outsrcUrl,
        data: {
          ...data[0],
          customerPromiseDate: `${data[0].customerPromiseDate} 00:00:00`,
        },
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: outsrcUrl,
        data: {
          ...data[0],
          customerPromiseDate: `${data[0].customerPromiseDate} 00:00:00`,
        },
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: outsrcUrl,
        data,
        method: 'DELETE',
      };
    },
  },
});

export { PoListDS, PoHeadDS, PoLineDS, PoOutsourceLineDS };
