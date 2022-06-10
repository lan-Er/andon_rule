/**
 * @Description: 送货单维护DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-26 15:44:19
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.deliveryMaintain.model';
const { common, deliveryMaintain } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const deliveryCreateListDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'poObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.poNum`).d('订单号'),
        lovCode: deliveryMaintain.supplierPo,
        ignore: 'always',
      },
      {
        name: 'poHeaderId',
        type: 'string',
        bind: 'poObj.poHeaderId',
      },
      {
        name: 'poNum',
        type: 'string',
        bind: 'poObj.poNum',
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
        name: 'customerNumber',
        type: 'string',
        bind: 'customerObj.customerNumber',
      },
      {
        name: 'customerName',
        type: 'string',
        bind: 'customerObj.customerName',
      },
      {
        name: 'poTypeCode',
        type: 'string',
        lookupCode: common.poType,
        label: intl.get(`${intlPrefix}.poType`).d('订单类型'),
      },
      {
        name: 'demandDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.demandDateStart`).d('需求日期从'),
        max: 'demandDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'demandDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.demandDateEnd`).d('需求日期至'),
        min: 'demandDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'promiseDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.promiseDateStart`).d('承诺日期从'),
        max: 'promiseDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'promiseDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.promiseDateEnd`).d('承诺日期至'),
        min: 'promiseDateStart',
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
    ],
    fields: [
      {
        name: 'poNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poNum`).d('订单号'),
      },
      {
        name: 'poLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.poLineNum`).d('行号'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerName`).d('客户名称'),
      },
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('客户物料编码'),
      },
      {
        name: 'itemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemDescription`).d('客户物料名称'),
      },
      {
        name: 'promiseQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseQty`).d('订单数量'),
      },
      {
        name: 'shippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('订单可发货数量'),
      },
      {
        name: 'allDeliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.allDeliveryQty`).d('累计发货数量'),
      },
      {
        name: 'receivedQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivedQty`).d('净接收数量'),
      },
      {
        name: 'uomName',
        type: 'string',
        label: intl.get(`${commonPrefix}.uom`).d('单位'),
      },
      {
        name: 'demandDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandDate`).d('需求日期'),
      },
      {
        name: 'promiseDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseDate`).d('承诺日期'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/po-lines/selectPoLineForDelivery`,
          data: {
            ...data,
            demandDateStart: data.demandDateStart ? data.demandDateStart.concat(' 00:00:00') : null,
            demandDateEnd: data.demandDateEnd ? data.demandDateEnd.concat(' 23:59:59') : null,
            promiseDateStart: data.promiseDateStart
              ? data.promiseDateStart.concat(' 00:00:00')
              : null,
            promiseDateEnd: data.promiseDateEnd ? data.promiseDateEnd.concat(' 23:59:59') : null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const deliveryMaintainListDS = () => {
  return {
    autoQuery: true,
    queryFields: [
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单号'),
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
        name: 'poObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.poNum`).d('订单号'),
        lovCode: deliveryMaintain.supplierPo,
        ignore: 'always',
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'poObj.poHeaderId',
      },
      {
        name: 'creationDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.creationDateStart`).d('创建日期从'),
        max: 'creationDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'creationDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.creationDateEnd`).d('创建日期至'),
        min: 'creationDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'deliveryOrderType',
        type: 'string',
        lookupCode: deliveryMaintain.deliveryOrderType,
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
      },
    ],
    fields: [
      {
        name: 'deliveryOrderStatus',
        type: 'string',
        lookupCode: deliveryMaintain.deliveryOrderStatus,
        label: intl.get(`${intlPrefix}.deliveryOrderStatus`).d('送货单状态'),
      },
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单订单号'),
      },
      {
        name: 'deliveryOrderType',
        type: 'string',
        lookupCode: deliveryMaintain.deliveryOrderType,
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customerName`).d('客户名称'),
      },
      {
        name: 'organizationName',
        type: 'string',
        label: intl.get(`${intlPrefix}.organizationName`).d('收货组织'),
      },
      {
        name: 'receiveAddress',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveAddress`).d('收货地址'),
      },
      {
        name: 'deliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryQty`).d('累计发货数量'),
      },
      {
        name: 'creationDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.creationDate`).d('创建日期'),
      },
      {
        name: 'planDeliveryDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.planDeliveryDate`).d('发货日期'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/delivery-orders`,
          data: {
            ...data,
            sourceOrderType: 'PO',
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

const deliveryDetailHeadDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单号'),
      },
      {
        name: 'deliveryOrderType',
        type: 'string',
        lookupCode: deliveryMaintain.deliveryOrderType,
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
        required: true,
      },
      {
        name: 'customerName',
        type: 'string',
        label: intl.get(`${commonPrefix}.customer`).d('客户'),
      },
      {
        name: 'receiveOrgObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.receiveOrg`).d('收货组织'),
        lovCode: common.customerOrganization,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            tenantId: organizationId,
            customerId: record.get('customerId'),
          }),
        },
      },
      {
        name: 'receiveOrgId',
        type: 'string',
        bind: 'receiveOrgObj.organizationId',
      },
      {
        name: 'receiveOrgCode',
        type: 'string',
        bind: 'receiveOrgObj.organizationCode',
      },
      {
        name: 'receiveOrgName',
        type: 'string',
        bind: 'receiveOrgObj.organizationName',
      },
      {
        name: 'receiveAddress',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveAddress`).d('收货地址'),
        required: true,
      },
      {
        name: 'deliveryShipper',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryShipper`).d('送货方'),
        required: true,
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.warehouse`).d('发货仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        required: true,
      },
      {
        name: 'warehouseId',
        type: 'string',
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'warehouseCode',
        type: 'string',
        bind: 'warehouseObj.warehouseCode',
      },
      {
        name: 'warehouseName',
        type: 'string',
        bind: 'warehouseObj.warehouseName',
      },
      {
        name: 'planDeliveryDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.planDeliveryDate`).d('发货日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
        required: true,
      },
      {
        name: 'expectedArrivalDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.expectedArrivalDate`).d('预计到货时间'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
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
        const { idList, deliveryOrderId } = data;
        return {
          url: deliveryOrderId
            ? `${HLOS_ZCOM}/v1/${organizationId}/delivery-orders/${deliveryOrderId}`
            : generateUrlWithGetParam(
                `${HLOS_ZCOM}/v1/${organizationId}/po-lines/selectPoLineForDelivery`,
                {
                  idList,
                }
              ),
          data: {
            ...data,
            idList: undefined,
            deliveryOrderId: undefined,
          },
          method: 'GET',
          transformResponse: (value) => {
            if (deliveryOrderId) {
              return JSON.parse(value);
            }
            const newValue = JSON.parse(value);
            let content;
            if (newValue && !newValue.failed && newValue.content) {
              content = Object.assign({}, newValue.content[0]);
            }
            return { ...content };
          },
        };
      },
    },
  };
};

const deliveryDetailLineDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('物料编码'),
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemDescription`).d('物料名称'),
      },
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCode`).d('供应商料号'),
      },
      {
        name: 'supplierItemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierItemDescription`).d('供应商料号描述'),
      },
      {
        name: 'promiseQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseQty`).d('数量'),
      },
      {
        name: 'shippableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.shippableQty`).d('可发货数量'),
      },
      {
        name: 'deliveryQty',
        type: 'number',
        min: 0,
        max: 'shippableQty',
        label: intl.get(`${intlPrefix}.deliveryQty`).d('本次发货数量'),
      },
      {
        name: 'uomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uomName`).d('单位'),
      },
      {
        name: 'customerLotNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.lotNumber`).d('批次'),
      },
      {
        name: 'serialNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.serialNumber`).d('序列号'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocNum`).d('订单号'),
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceDocLineNum`).d('行号'),
      },
      {
        name: 'demandDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.demandDate`).d('需求日期'),
      },
      {
        name: 'promiseDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseDate`).d('承诺日期'),
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
        const { idList, deliveryOrderId } = data;
        return {
          url: deliveryOrderId
            ? `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines`
            : generateUrlWithGetParam(
                `${HLOS_ZCOM}/v1/${organizationId}/po-lines/selectPoLineForDelivery`,
                {
                  idList,
                }
              ),
          data: {
            ...data,
            idList: undefined,
          },
          method: 'GET',
          transformResponse: (value) => {
            if (deliveryOrderId) {
              return JSON.parse(value);
            }
            const newValue = JSON.parse(value);
            let content;
            if (newValue && !newValue.failed && newValue.content) {
              content = newValue.content.map((item) => ({
                ...item,
                customerItemId: item.itemId,
                customerItemCode: item.itemCode,
                customerItemDescription: item.itemDescription,
                itemId: item.supplierItemId,
                itemCode: item.supplierItemCode,
                sourceDocId: item.poHeaderId,
                sourceDocNum: item.poNum,
                sourceDocLineId: item.poLineId,
                sourceDocLineNum: item.poLineNum,
              }));
            }
            return { ...value, content };
          },
        };
      },
    },
  };
};

const deliveryDetailLogisticsDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'courierNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.courierNumber`).d('快递单号'),
      },
      {
        name: 'deliveryStaff',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryStaff`).d('配送人员'),
      },
      {
        name: 'addresseeContact',
        type: 'string',
        label: intl.get(`${intlPrefix}.addresseeContact`).d('收件人手机后四位'),
      },
      {
        name: 'logisticsCompany',
        type: 'string',
        label: intl.get(`${intlPrefix}.logisticsCompany`).d('物流公司'),
      },
      {
        name: 'deliveryContact',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryContact`).d('联系方式'),
      },
      {
        name: 'freight',
        type: 'string',
        label: intl.get(`${intlPrefix}.freight`).d('物流费用'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { deliveryOrderId } = data;
        return {
          data: {
            ...data,
            deliveryOrderId: undefined,
          },
          url: `${HLOS_ZCOM}/v1/${organizationId}/delivery-logisticss/getByDeliveryOrderId/${deliveryOrderId}`,
          method: 'GET',
        };
      },
    },
  };
};

export {
  deliveryCreateListDS,
  deliveryMaintainListDS,
  deliveryDetailHeadDS,
  deliveryDetailLineDS,
  deliveryDetailLogisticsDS,
};
