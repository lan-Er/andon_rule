/**
 * @Description: 客户订单DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-16 15:09:54
 */

import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { formatnumber } from '@/utils/renderer';

const commonCode = 'zcom.common.model';
const preCode = 'zcom.customerOrder.model';
const { common, poMaintain } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZCOM}/v1/${organizationId}/pos`;
const lineUrl = `${HLOS_ZCOM}/v1/${organizationId}/po-lines`;
const outsrcUrl = `${HLOS_ZCOM}/v1/${organizationId}/po-outsources`; // 外协物料

const CustomerOrderListDS = () => ({
  autoQuery: false,
  queryFields: [
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${preCode}.poNum`).d('订单编号'),
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${commonCode}.customer`).d('客户'),
      lovCode: common.customer,
      ignore: 'always',
    },
    {
      name: 'customerId',
      type: 'string',
      bind: 'customerObj.customerId',
    },
    {
      name: 'poStatusList',
      type: 'string',
      lookupCode: poMaintain.poStatus,
      label: intl.get(`${preCode}.poStatus`).d('订单状态'),
      multiple: true,
      defaultValue: ['CONFIRMING', 'CONFIRMED'],
    },
    {
      name: 'companyObj',
      type: 'object',
      label: intl.get(`${preCode}.company`).d('公司'),
      lovCode: common.company,
      ignore: 'always',
    },
    {
      name: 'supplierCompanyId',
      type: 'string',
      bind: 'companyObj.companyId',
    },
    {
      name: 'soBusinessUnitObj',
      type: 'object',
      label: intl.get(`${commonCode}.businessUnit`).d('业务实体'),
      lovCode: common.businessUnit,
      cascadeMap: { companyId: 'supplierCompanyId' },
      ignore: 'always',
    },
    {
      name: 'soBusinessUnitId',
      type: 'string',
      bind: 'soBusinessUnitObj.businessUnitId',
    },
    {
      name: 'creationDateStart',
      type: 'date',
      range: ['start', 'end'],
      label: intl.get(`${preCode}.creationDate`).d('创建时间'),
      transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'creationDateEnd',
      type: 'date',
      bind: 'creationDateStart.end',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'poSourceType',
      type: 'string',
      lookupCode: poMaintain.poSourceType,
      label: intl.get(`${preCode}.poSourceType`).d('来源类型'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${preCode}.sourceDocNum`).d('来源单号'),
    },
    // {
    //   name: 'buyer',
    //   type: 'string',
    //   label: intl.get(`${preCode}.buyer`).d('采购员'),
    // },
  ],
  fields: [
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${preCode}.poNum`).d('订单编号'),
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${commonCode}.customer`).d('客户'),
    },
    {
      name: 'totalAmount',
      type: 'string',
      label: intl.get(`${preCode}.totalAmount`).d('总金额（含税）'),
    },
    {
      name: 'customerContacts',
      type: 'string',
      label: intl.get(`${commonCode}.customerContacts`).d('客户联系人'),
    },
    {
      name: 'customerContactsPhone',
      type: 'string',
      label: intl.get(`${commonCode}.customerContactsPhone`).d('客户联系电话'),
    },
    {
      name: 'supplierContacts',
      type: 'string',
      label: intl.get(`${preCode}.supplierContacts`).d('供应商联系人'),
    },
    {
      name: 'supplierContactsPhone',
      type: 'string',
      label: intl.get(`${preCode}.supplierContactsPhone`).d('供应商联系电话'),
    },
    // {
    //   name: 'saler',
    //   type: 'string',
    //   label: intl.get(`${preCode}.saler`).d('销售员'),
    // },
    {
      name: 'deliveryInventoryOrgName',
      type: 'string',
      label: intl.get(`${preCode}.deliveryInventoryOrg`).d('发货库存组织'),
    },
    {
      name: 'poTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.poType`).d('订单类型'),
    },
    {
      name: 'consignerName',
      type: 'string',
      label: intl.get(`${preCode}.consignerName`).d('发货人'),
    },
    {
      name: 'consignerPhone',
      type: 'string',
      label: intl.get(`${preCode}.consignerPhone`).d('发货人联系电话'),
    },
    {
      name: 'deliveryAddress',
      type: 'string',
      label: intl.get(`${preCode}.deliveryAddress`).d('发货地点'),
    },
    // {
    //   name: 'invoiceAddressFrom',
    //   type: 'string',
    //   label: intl.get(`${preCode}.invoiceAddressFrom`).d('开票地点'),
    // },
    {
      name: 'creationDate',
      type: 'string',
      label: intl.get(`${preCode}.creationDate`).d('创建时间'),
    },
    {
      name: 'poStatusMeaning',
      type: 'string',
      label: intl.get(`${preCode}.poStatus`).d('状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { poStatusList } = data;
      return {
        url: generateUrlWithGetParam(url, { poStatusList }),
        data: {
          ...data,
          supplierTenantId: organizationId,
          poStatusList: null,
          creationDateStart: data.creationDateStart
            ? data.creationDateStart.concat(' 00:00:00')
            : null,
          creationDateEnd: data.creationDateEnd ? data.creationDateEnd.concat(' 23:59:59') : null,
        },
        method: 'GET',
        // transformResponse: (value) => {
        //   const newValue = JSON.parse(value);
        //   let arr;
        //   if (newValue && !newValue.failed && newValue.content) {
        //     arr = newValue.content.map((v) => ({
        //       ...v,
        //       sourceDocNum: v.sourceDocNum || v.externalSourceDocNum,
        //     }));
        //   }
        //   return arr;
        // },
      };
    },
  },
});

const CustomerOrderHeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'poTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.poType`).d('订单类型'),
    },
    {
      name: 'customerName',
      type: 'string',
      label: intl.get(`${commonCode}.customer`).d('客户'),
    },
    {
      name: 'poStatusMeaning',
      type: 'string',
      label: intl.get(`${preCode}.poStatus`).d('订单状态'),
    },
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${preCode}.poNum`).d('订单编号'),
    },
    {
      name: 'saler',
      type: 'string',
      label: intl.get(`${preCode}.saler`).d('销售员'),
    },
    {
      name: 'customerContacts',
      type: 'string',
      label: intl.get(`${preCode}.customerContacts`).d('客户联系人'),
    },
    {
      name: 'customerContactsPhone',
      type: 'string',
      label: intl.get(`${preCode}.customerContactsPhone`).d('客户联系电话'),
    },
    {
      name: 'supplierContacts',
      type: 'string',
      label: intl.get(`${preCode}.supplierContacts`).d('供应商联系人'),
    },
    {
      name: 'supplierContactsPhone',
      type: 'string',
      label: intl.get(`${preCode}.supplierContactsPhone`).d('供应商联系电话'),
    },
    {
      name: 'consignerName',
      type: 'string',
      label: intl.get(`${preCode}.consignerName`).d('发货人'),
    },
    {
      name: 'consignerPhone',
      type: 'string',
      label: intl.get(`${preCode}.consignerPhone`).d('发货人联系电话'),
    },
    {
      name: 'deliveryAddress',
      type: 'string',
      label: intl.get(`${preCode}.deliveryAddress`).d('发货地点'),
    },
    {
      name: 'currencyCode',
      type: 'string',
      label: intl.get(`${preCode}.currency`).d('币种'),
    },
    {
      name: 'taxRate',
      type: 'string',
      label: intl.get(`${preCode}.taxRate`).d('税率'),
    },
    {
      name: 'poSourceTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.poSourceType`).d('来源类型'),
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: intl.get(`${preCode}.sourceDocNum`).d('来源单号'),
    },
    {
      name: 'operationOpinion',
      type: 'string',
    },
    {
      name: 'exTaxAmount',
      type: 'string',
      label: intl.get(`${preCode}.exTaxAmount`).d('总金额（不含税）'),
    },
    {
      name: 'totalAmount',
      type: 'string',
      label: intl.get(`${preCode}.totalAmount`).d('总金额（含税）'),
    },
    {
      name: 'consigneeName',
      type: 'string',
      label: intl.get(`${preCode}.consigneeName`).d('收货人'),
    },
    {
      name: 'consigneePhone',
      type: 'string',
      label: intl.get(`${preCode}.consigneePhone`).d('收货人联系电话'),
    },
    {
      name: 'receivingAddress',
      type: 'string',
      label: intl.get(`${preCode}.receivingAddress`).d('收货地点'),
    },
    // {
    //   name: 'invoiceAddressTo',
    //   type: 'string',
    //   label: intl.get(`${preCode}.invoiceAddressTo`).d('收票地点'),
    // },
    {
      name: 'buyer',
      type: 'string',
      label: intl.get(`${preCode}.buyer`).d('采购员'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('订单备注'),
    },
  ],
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
    update: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'PUT',
      };
    },
  },
});

const CustomerOrderLineDS = () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'poLineNum',
      type: 'string',
      label: intl.get(`${preCode}.poLineNum`).d('行号'),
    },
    {
      name: 'soBusinessUnitObj',
      type: 'object',
      lovCode: common.businessUnit,
      label: intl.get(`${commonCode}.businessUnit`).d('业务实体'),
      required: true,
      ignore: 'always',
    },
    {
      name: 'soBusinessUnitId',
      type: 'string',
      bind: 'soBusinessUnitObj.businessUnitId',
    },
    {
      name: 'soBusinessUnitCode',
      type: 'string',
      bind: 'soBusinessUnitObj.businessUnitCode',
    },
    {
      name: 'soBusinessUnitName',
      type: 'string',
      bind: 'soBusinessUnitObj.businessUnitName',
    },
    // {
    //   name: 'invoiceAddressFrom',
    //   type: 'string',
    //   bind: 'soBusinessUnitObj.fullAddress',
    //   label: intl.get(`${preCode}.invoiceAddressFrom`).d('开票地点'),
    // },
    {
      name: 'deliveryInventoryOrgObj',
      type: 'object',
      lovCode: common.inventoryOrg,
      label: intl.get(`${preCode}.deliveryInventoryOrg`).d('发货库存组织'),
      cascadeMap: { businessUnitId: 'soBusinessUnitId' },
      required: true,
      ignore: 'always',
    },
    {
      name: 'deliveryInventoryOrgId',
      type: 'string',
      bind: 'deliveryInventoryOrgObj.inventoryOrgId',
    },
    {
      name: 'deliveryInventoryOrgCode',
      type: 'string',
      bind: 'deliveryInventoryOrgObj.inventoryOrgCode',
    },
    {
      name: 'deliveryInventoryOrgName',
      type: 'string',
      bind: 'deliveryInventoryOrgObj.inventoryOrgName',
    },
    {
      name: 'supplierItemCode',
      type: 'string',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
    },
    {
      name: 'supplierItemDesc',
      type: 'string',
      label: intl.get(`${preCode}.itemDesc`).d('物料说明'),
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${preCode}.itemAttr`).d('关键属性'),
    },
    {
      name: 'supplierDemandQty',
      type: 'string',
      label: intl.get(`${preCode}.supplierDemandQty`).d('销售数量'),
    },
    {
      name: 'supplierUomName',
      type: 'string',
      label: intl.get(`${preCode}.uomName`).d('单位'),
    },
    {
      name: 'supplierExTaxPrice',
      type: 'string',
      label: intl.get(`${preCode}.supplierExTaxPrice`).d('未税单价'),
    },
    {
      name: 'customerDemandDate',
      type: 'string',
      label: intl.get(`${preCode}.customerDemandDate`).d('期望到货日期'),
    },
    {
      name: 'taxRate',
      type: 'string',
      label: intl.get(`${preCode}.taxRate`).d('税率（%）'),
    },
    {
      name: 'supplierPrice',
      type: 'string',
      label: intl.get(`${preCode}.supplierPrice`).d('含税单价'),
    },
    {
      name: 'amount',
      type: 'string',
      label: intl.get(`${preCode}.amount`).d('行金额（含税）'),
    },
    {
      name: 'toleranceType',
      type: 'string',
      lookupCode: poMaintain.toleranceType,
      label: intl.get(`${preCode}.toleranceType`).d('允差类型'),
    },
    {
      name: 'supplierToleranceValue',
      type: 'string',
      label: intl.get(`${preCode}.toleranceValue`).d('允差值'),
    },
    {
      name: 'poLineStatus',
      type: 'string',
      lookupCode: poMaintain.poStatus,
      label: intl.get(`${preCode}.poLineStatus`).d('状态'),
    },
    {
      name: 'supplierPromiseDate',
      type: 'date',
      label: intl.get(`${preCode}.supplierPromiseDate`).d('承诺到货日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'consignerName',
      type: 'string',
      label: intl.get(`${preCode}.consignerName`).d('发货人'),
    },
    {
      name: 'consignerPhone',
      type: 'string',
      label: intl.get(`${preCode}.consignerPhone`).d('发货人联系电话'),
    },
    {
      name: 'deliveryAddress',
      type: 'string',
      bind: 'deliveryInventoryOrgObj.fullAddress',
      label: intl.get(`${preCode}.deliveryAddress`).d('发货地点'),
    },
    {
      name: 'supplierDeliveryQty',
      type: 'string',
      label: intl.get(`${preCode}.supplierDeliveryQty`).d('发货数量'),
    },
    {
      name: 'supplierReceivedQty',
      type: 'string',
      label: intl.get(`${preCode}.supplierReceivedQty`).d('客户收货数量'),
    },
    {
      name: 'supplierReturnedQty',
      type: 'string',
      label: intl.get(`${preCode}.supplierReturnedQty`).d('退货数量'),
    },
    {
      name: 'supplierDqcQty',
      type: 'string',
      label: intl.get(`${preCode}.supplierDqcQty`).d('不合格数量'),
    },
    {
      name: 'brand',
      type: 'string',
      label: intl.get(`${preCode}.brand`).d('品牌'),
    },
    {
      name: 'specification',
      type: 'string',
      label: intl.get(`${preCode}.specification`).d('规格'),
    },
    {
      name: 'model',
      type: 'string',
      label: intl.get(`${preCode}.model`).d('型号'),
    },
    {
      name: 'process',
      type: 'string',
      label: intl.get(`${preCode}.process`).d('加工工艺'),
    },
    {
      name: 'customerItemCode',
      type: 'string',
      label: intl.get(`${preCode}.customerItemCode`).d('客户物料编码'),
    },
    {
      name: 'customerItemDesc',
      type: 'string',
      label: intl.get(`${preCode}.customerItemDesc`).d('客户物料说明'),
    },
    {
      name: 'consigneeName',
      type: 'string',
      label: intl.get(`${preCode}.consigneeName`).d('收货人'),
    },
    {
      name: 'consigneePhone',
      type: 'string',
      label: intl.get(`${preCode}.consigneePhone`).d('收货人联系电话'),
    },
    {
      name: 'receivingAddress',
      type: 'string',
      label: intl.get(`${preCode}.receivingAddress`).d('收货地点'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
    update: ({ name, record }) => {
      if (name === 'soBusinessUnitObj') {
        record.set('deliveryInventoryOrgObj', null);
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
    update: ({ data }) => {
      return {
        url: lineUrl,
        data: {
          ...data[0],
          supplierPromiseDate: data[0].supplierPromiseDate
            ? `${data[0].supplierPromiseDate} 00:00:00`
            : null,
        },
        method: 'PUT',
      };
    },
  },
});

const CustomerOrderOutsourceLineDS = () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'poOutsourceNum',
      type: 'string',
      label: intl.get(`${preCode}.poOutsourceNum`).d('行号'),
    },
    {
      name: 'supplierItemCode',
      type: 'string',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
    },
    {
      name: 'supplierItemDesc',
      type: 'string',
      label: intl.get(`${preCode}.itemDesc`).d('物料说明'),
    },
    {
      name: 'itemAttr',
      type: 'object',
      label: intl.get(`${preCode}.itemAttr`).d('关键属性'),
    },
    {
      name: 'supplierUomName',
      type: 'string',
      label: intl.get(`${preCode}.uom`).d('单位'),
    },
    {
      name: 'supplierPromiseQty',
      type: 'string',
      label: intl.get(`${preCode}.supplierPromiseQty`).d('需求数量'),
    },
    {
      name: 'customerPromiseDate',
      type: 'string',
      label: intl.get(`${preCode}.customerPromiseDate`).d('预计到货日期'),
    },
    {
      name: 'outsrcSupplierName',
      type: 'string',
      label: intl.get(`${preCode}.outsrcSupplierName`).d('外协料供应商'),
    },
    {
      name: 'outsrcSupplierContacts',
      type: 'string',
      label: intl.get(`${preCode}.outsrcSupplierContacts`).d('联系人'),
    },
    {
      name: 'outsrcSupplierPhone',
      type: 'string',
      label: intl.get(`${preCode}.outsrcSupplierPhone`).d('联系电话'),
    },
    {
      name: 'specification',
      type: 'string',
      label: intl.get(`${preCode}.specification`).d('规格'),
    },
    {
      name: 'model',
      type: 'string',
      label: intl.get(`${preCode}.model`).d('型号'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('备注'),
    },
    {
      name: 'supplierDeliveryQty',
      type: 'string',
      label: intl.get(`${preCode}.supplierDeliveryQty`).d('实发数量'),
    },
    {
      name: 'supplierReceivedQty',
      type: 'string',
      label: intl.get(`${preCode}.supplierReceivedQty`).d('实收数量'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: outsrcUrl,
        data,
        method: 'GET',
      };
    },
  },
});

const BatchDataDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'soBusinessUnitObj',
      type: 'object',
      lovCode: common.businessUnit,
      label: intl.get(`${commonCode}.businessUnit`).d('业务实体'),
      ignore: 'always',
    },
    {
      name: 'soBusinessUnitId',
      type: 'string',
      bind: 'soBusinessUnitObj.businessUnitId',
    },
    {
      name: 'soBusinessUnitCode',
      type: 'string',
      bind: 'soBusinessUnitObj.businessUnitCode',
    },
    {
      name: 'soBusinessUnitName',
      type: 'string',
      bind: 'soBusinessUnitObj.businessUnitName',
    },
    {
      name: 'deliveryInventoryOrgObj',
      type: 'object',
      lovCode: common.inventoryOrg,
      label: intl.get(`${preCode}.deliveryInventoryOrg`).d('发货库存组织'),
      ignore: 'always',
    },
    {
      name: 'deliveryInventoryOrgId',
      type: 'string',
      bind: 'deliveryInventoryOrgObj.inventoryOrgId',
    },
    {
      name: 'deliveryInventoryOrgCode',
      type: 'string',
      bind: 'deliveryInventoryOrgObj.inventoryOrgCode',
    },
    {
      name: 'deliveryInventoryOrgName',
      type: 'string',
      bind: 'deliveryInventoryOrgObj.inventoryOrgName',
    },
    {
      name: 'deliveryBusinessUnitId',
      type: 'string',
      bind: 'deliveryInventoryOrgObj.businessUnitId',
    },
    {
      name: 'deliveryBusinessUnitCode',
      type: 'string',
      bind: 'deliveryInventoryOrgObj.businessUnitCode',
    },
    {
      name: 'fullAddress',
      type: 'string',
      bind: 'deliveryInventoryOrgObj.fullAddress',
    },
    {
      name: 'supplierPromiseDate',
      type: 'date',
      label: intl.get(`${preCode}.supplierPromiseDate`).d('承诺到货日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'consignerName',
      type: 'string',
      label: intl.get(`${preCode}.consignerName`).d('发货人'),
    },
    {
      name: 'consignerPhone',
      type: 'string',
      label: intl.get(`${preCode}.consignerPhone`).d('发货人联系电话'),
    },
    {
      name: 'deliveryAddress',
      type: 'string',
      label: intl.get(`${preCode}.deliveryAddress`).d('发货地点'),
    },
  ],
});

export {
  CustomerOrderListDS,
  CustomerOrderHeadDS,
  CustomerOrderLineDS,
  CustomerOrderOutsourceLineDS,
  BatchDataDS,
};
