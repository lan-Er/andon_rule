/**
 * @Description: 送货单冲销DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-12-01 15:26:06
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.deliveryWriteoff.model';
const { common, deliveryWriteoff } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const deliveryWriteoffListDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单号'),
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
        name: 'supplierName',
        type: 'string',
        bind: 'supplierObj.supplierName',
      },
      {
        name: 'poObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.poNum`).d('订单号'),
        lovCode: deliveryWriteoff.po,
        ignore: 'always',
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'poObj.poHeaderId',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'poObj.poNum',
      },
      {
        name: 'expectedArrivalDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.expectedArrivalDateStart`).d('预计到货日期从'),
        max: 'expectedArrivalDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'expectedArrivalDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.expectedArrivalDateEnd`).d('预计到货日期至'),
        min: 'expectedArrivalDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'deliveryOrderType',
        type: 'string',
        lookupCode: deliveryWriteoff.deliveryOrderType,
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
      },
      {
        name: 'receiveOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveOrg`).d('收货组织'),
      },
      {
        name: 'executeWarehouseObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.executeWarehouse`).d('收货库房'),
        lovCode: deliveryWriteoff.executeWarehouse,
        ignore: 'always',
      },
      {
        name: 'executeWarehouseId',
        type: 'string',
        bind: 'executeWarehouseObj.warehouseId',
      },
      {
        name: 'executeWarehouseCode',
        type: 'string',
        bind: 'executeWarehouseObj.warehouseCode',
      },
      {
        name: 'executeWarehouseName',
        type: 'string',
        bind: 'executeWarehouseObj.warehouseName',
      },
      {
        name: 'deliveryOrderStatus',
        type: 'string',
        lookupCode: deliveryWriteoff.deliveryOrderStatus,
        label: intl.get(`${intlPrefix}.deliveryOrderStatus`).d('送货单状态'),
      },
    ],
    fields: [
      {
        name: 'deliveryOrderStatus',
        type: 'string',
        lookupCode: deliveryWriteoff.deliveryOrderStatus,
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
        lookupCode: deliveryWriteoff.deliveryOrderType,
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
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
        name: 'deliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryQty`).d('发货数量'),
      },
      {
        name: 'cancelableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.cancelableQty`).d('可冲销数量'),
      },
      {
        name: 'uomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uomName`).d('单位'),
      },
      {
        name: 'expectedArrivalDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.expectedArrivalDate`).d('预计到货时间'),
      },
      {
        name: 'receiveOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveOrg`).d('收货组织'),
      },
      {
        name: 'executeWarehouseName',
        type: 'string',
        label: intl.get(`${intlPrefix}.executeWarehouseName`).d('收货库房'),
      },
      {
        name: 'receiveAddress',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveAddress`).d('收货地址'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
      },
      {
        name: 'submitDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.submitDate`).d('创建日期'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines/getCancelLine`,
          data: {
            ...data,
            expectedArrivalDateStart: data.expectedArrivalDateStart
              ? data.expectedArrivalDateStart.concat(' 00:00:00')
              : null,
            expectedArrivalDateEnd: data.expectedArrivalDateEnd
              ? data.expectedArrivalDateEnd.concat(' 23:59:59')
              : null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const deliveryWriteoffFormDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'executeWorker',
        type: 'string',
        label: intl.get(`${intlPrefix}.executeWorker`).d('操作人'),
      },
      {
        name: 'actualExecuteWorker',
        type: 'string',
        label: intl.get(`${intlPrefix}.actualExecuteWorker`).d('实际操作人'),
        required: true,
      },
    ],
  };
};

const deliveryWriteoffLineDS = () => {
  return {
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'deliveryOrderNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryOrderNum`).d('送货单订单号'),
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
        name: 'deliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryQty`).d('发货数量'),
      },
      {
        name: 'acceptableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.acceptableQty`).d('可接收数量'),
      },
      {
        name: 'cancelableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.cancelableQty`).d('接收数量'),
      },
      {
        name: 'executeQty',
        type: 'number',
        min: 0,
        max: 'cancelableQty',
        label: intl.get(`${intlPrefix}.executeQty`).d('冲销数量'),
        required: true,
      },
      {
        name: 'actualExecuteTime',
        type: 'date',
        label: intl.get(`${intlPrefix}.actualExecuteTime`).d('冲销日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'receiveOrgName',
        type: 'string',
        label: intl.get(`${intlPrefix}.receiveOrg`).d('收货组织'),
      },
      {
        name: 'executeWarehouseObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.executeWarehouse`).d('收货库房'),
        lovCode: deliveryWriteoff.executeWarehouse,
        ignore: 'always',
      },
      {
        name: 'executeWarehouseId',
        type: 'string',
        bind: 'executeWarehouseObj.warehouseId',
      },
      {
        name: 'executeWarehouseCode',
        type: 'string',
        bind: 'executeWarehouseObj.warehouseCode',
      },
      {
        name: 'executeWarehouseName',
        type: 'string',
        bind: 'executeWarehouseObj.warehouseName',
      },
      {
        name: 'executeWmAreaObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.executeWmArea`).d('收货库位'),
        lovCode: deliveryWriteoff.executeWmArea,
        ignore: 'always',
      },
      {
        name: 'executeWmAreaId',
        type: 'string',
        bind: 'executeWmAreaObj.wmAreaId',
      },
      {
        name: 'receiveWmAreaCode',
        type: 'string',
        bind: 'executeWmAreaObj.wmAreaCode',
      },
      {
        name: 'receiveWmAreaName',
        type: 'string',
        bind: 'executeWmAreaObj.wmAreaName',
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
        name: 'uomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.uomName`).d('单位'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
      },
      {
        name: 'promiseDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseDate`).d('交货日期'),
      },
      {
        name: 'executeRemark',
        type: 'string',
        label: intl.get(`${intlPrefix}.remark`).d('备注'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { idList } = data;
        return {
          url: generateUrlWithGetParam(
            `${HLOS_ZCOM}/v1/${organizationId}/delivery-order-lines/getCancelLine`,
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

export { deliveryWriteoffListDS, deliveryWriteoffFormDS, deliveryWriteoffLineDS };
