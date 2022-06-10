/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-01-25 10:04:39
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-02 11:00:06
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.deliveryMaintain.model';
const { common, customerItemReceive } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const customerItemRevDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'itemCertHeadText',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCertHeadText`).d('发货单编码'),
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
        name: 'customerItemObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.customerItem`).d('物料编码'),
        lovCode: customerItemReceive.item,
        ignore: 'always',
      },
      {
        name: 'customerItemCode',
        type: 'string',
        bind: 'customerItemObj.itemCode',
      },
      {
        name: 'moveType',
        type: 'string',
        // lookupCode: common.poType,
        label: intl.get(`${intlPrefix}.poType`).d('移动类型'),
      },
      {
        name: 'itemCertNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.sourceSysName`).d('物料凭证编码'),
      },
      {
        name: 'storageStatus',
        type: 'string',
        lookupCode: customerItemReceive.storageStatus,
        label: intl.get(`${intlPrefix}.poType`).d('接收状态'),
      },
      {
        name: 'itemCertPostDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.itemCertPostDateStart`).d('发货日期从'),
        max: 'itemCertPostDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'itemCertPostDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.itemCertPostDateEnd`).d('发货日期至'),
        min: 'itemCertPostDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
    ],
    fields: [
      {
        name: 'itemCertId',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivedQty`).d('客供料凭证表头ID'),
      },
      {
        name: 'certLineId',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivedQty`).d('客供料行ID'),
      },
      {
        name: 'itemCertHeadText',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCertHeadText`).d('发货单编码'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('客户物料编码'),
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemDescription`).d('客户物料描述'),
      },
      {
        name: 'deliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryQty`).d('出货数量'),
      },
      {
        name: 'acceptableQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.acceptableQty`).d('可接收数量'),
      },
      {
        name: 'receivedQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivedQty`).d('已接收数量'),
      },
      {
        name: 'storageQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivedQty`).d('本次实收数量'),
        required: true,
        min: 0,
        max: 'acceptableQty',
      },
      {
        name: 'operatorName',
        type: 'string',
        label: intl.get(`${intlPrefix}.operatorName`).d('接收人'),
      },
      {
        name: 'lineRemark',
        type: 'string',
        label: intl.get(`${intlPrefix}.receivedQty`).d('备注'),
      },
      {
        name: 'meOuObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.meOu`).d('接收工厂'),
        lovCode: common.meOu,
        ignore: 'always',
        required: true,
      },
      {
        name: 'meOuId',
        type: 'string',
        bind: 'meOuObj.meOuId',
      },
      {
        name: 'meOuCode',
        type: 'string',
        bind: 'meOuObj.meOuCode',
      },
      {
        name: 'meOuName',
        type: 'string',
        bind: 'meOuObj.organizationName',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'meOuObj.meOuName',
        ignore: 'always',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.receiveWarehouse`).d('接收仓库'),
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
        name: 'storageDate',
        type: 'date',
        label: intl.get(`${intlPrefix}.itemCertPostDate`).d('接收日期'),
        required: true,
      },
      {
        name: 'shipmentNo',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseDate`).d('运单号码'),
      },
      {
        name: 'storageStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseDate`).d('接收状态'),
      },
      {
        name: 'itemCertPostDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseDate`).d('发货日期'),
      },
      {
        name: 'itemCertNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseDate`).d('物料凭证'),
      },
      {
        name: 'projectNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseDate`).d('凭证行'),
      },
      {
        name: 'moveType',
        type: 'string',
        label: intl.get(`${intlPrefix}.promiseDate`).d('移动类型'),
      },
      {
        name: 'sequenceLotControl',
        type: 'string',
        label: intl.get(`${intlPrefix}.lotNumber`).d('批次'),
      },
      {
        name: 'tagFlag',
        type: 'number',
        label: intl.get(`${intlPrefix}.serialNum`).d('序列号'),
      },
      {
        name: 'storageBatchList',
        type: 'object',
        label: intl.get(`${intlPrefix}.storageBatchList`).d('批次'),
        dynamicProps: {
          required: ({ record }) => {
            if (record.get('sequenceLotControl') === 'LOT') {
              return true;
            }
          },
        },
      },
      {
        name: 'storageSerialList',
        type: 'object',
        label: intl.get(`${intlPrefix}.storageSerialList`).d('序列号'),
        dynamicProps: {
          required: ({ record }) => {
            if (record.get('tagFlag')) {
              return true;
            }
          },
        },
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/item-cert-lines/selectForReceive`,
          data: {
            ...data,
            itemCertPostDateStart: data.itemCertPostDateStart
              ? data.itemCertPostDateStart.concat(' 00:00:00')
              : null,
            itemCertPostDateEnd: data.itemCertPostDateEnd
              ? data.itemCertPostDateEnd.concat(' 23:59:59')
              : null,
          },
          method: 'GET',
          transformResponse: (value) => {
            let content;
            let newValue;
            if (typeof value === 'string' && value.indexOf('PERMISSION_NOT_PASS') === -1) {
              if (typeof JSON.parse(value) === 'object') {
                newValue = JSON.parse(value);
                content =
                  newValue.content?.length &&
                  newValue.content.map((item) => ({
                    ...item,
                    storageDate: moment().format(DEFAULT_DATETIME_FORMAT),
                  }));
              }
            } else {
              newValue = value;
            }

            return { ...newValue, content };
          },
        };
      },
    },
  };
};

const batchDS = () => {
  return {
    autoQuery: false,
    autoCreate: true,
    fields: [
      {
        name: 'itemCertHeadText',
        type: 'string',
        label: intl.get(`${intlPrefix}.poNum`).d('发货单'),
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
        name: 'batchQty',
        type: 'number',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('数量'),
        required: true,
      },
      {
        name: 'batchNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemDescription`).d('批次'),
        required: true,
      },
    ],
  };
};

const serialDS = () => {
  return {
    autoQuery: false,
    autoCreate: true,
    fields: [
      {
        name: 'itemCertHeadText',
        type: 'string',
        label: intl.get(`${intlPrefix}.poNum`).d('发货单'),
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
        name: 'serialQty',
        type: 'number',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('数量'),
        required: true,
      },
      {
        name: 'serialNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemDescription`).d('序列号'),
        required: true,
      },
    ],
  };
};

const customerItemReceivedListDS = () => {
  return {
    autoQuery: false,
    queryFields: [
      {
        name: 'certStorageNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.certStorageNum`).d('入库单编码'),
      },
      {
        name: 'itemCertHeadText',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCertHeadText`).d('发货单编码'),
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
        ignore: 'always',
      },
      {
        name: 'customerName',
        type: 'string',
        bind: 'customerObj.customerName',
        ignore: 'always',
      },
      {
        name: 'customerItemObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.itemCode`).d('物料编码'),
        lovCode: customerItemReceive.item,
        ignore: 'always',
      },
      {
        name: 'customerItemCode',
        type: 'string',
        bind: 'customerItemObj.itemCode',
      },
      {
        name: 'itemCertObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.itemCertNum`).d('物料凭证编码'),
        lovCode: customerItemReceive.supplierItemCert,
        ignore: 'always',
      },
      {
        name: 'itemCertId',
        type: 'string',
        bind: 'itemCertObj.itemCertId',
      },
      {
        name: 'itemCertNum',
        type: 'string',
        bind: 'itemCertObj.itemCertNum',
      },
      {
        name: 'itemCertPostDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.itemCertPostDateStart`).d('发货日期从'),
        max: 'itemCertPostDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'itemCertPostDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.itemCertPostDateEnd`).d('发货日期至'),
        min: 'itemCertPostDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'moveType',
        type: 'string',
        label: intl.get(`${intlPrefix}.moveType`).d('移动类型'),
      },
      {
        name: 'storageDateStart',
        type: 'date',
        label: intl.get(`${intlPrefix}.storageDateStart`).d('接收日期从'),
        max: 'storageDateEnd',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'storageDateEnd',
        type: 'date',
        label: intl.get(`${intlPrefix}.storageDateEnd`).d('接收日期至'),
        min: 'storageDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'storageStatus',
        type: 'string',
        lookupCode: customerItemReceive.storageStatus,
        label: intl.get(`${intlPrefix}.poType`).d('接收状态'),
      },
    ],
    fields: [
      {
        name: 'certStorageNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.certStorageNum`).d('入库单编码'),
      },
      {
        name: 'storageLineNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.storageLineNum`).d('入库单行号'),
      },
      {
        name: 'itemCertHeadText',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCertHeadText`).d('发货单编码'),
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemCode`).d('客户物料编码'),
      },
      {
        name: 'customerItemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.customerItemDescription`).d('客户物料描述'),
      },
      {
        name: 'deliveryQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.deliveryQty`).d('出库数量'),
      },
      {
        name: 'storageQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.storageQty`).d('已接收数量'),
      },
      {
        name: 'operatorName',
        type: 'string',
        label: intl.get(`${intlPrefix}.operatorName`).d('接收人'),
      },
      {
        name: 'lineRemark',
        type: 'string',
        label: intl.get(`${intlPrefix}.lineRemark`).d('备注'),
      },
      {
        name: 'meOuName',
        type: 'string',
        label: intl.get(`${intlPrefix}.meOuName`).d('接收工厂'),
      },
      {
        name: 'warehouseName',
        type: 'string',
        label: intl.get(`${intlPrefix}.warehouseName`).d('接收仓库'),
      },
      {
        name: 'storageDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCertPostDate`).d('接收日期'),
      },
      {
        name: 'shipMentNo',
        type: 'string',
        label: intl.get(`${intlPrefix}.shipMentNo`).d('运单编码'),
      },
      {
        name: 'storageStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.storageStatus`).d('接收状态'),
      },
      {
        name: 'itemCertPostDate',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCertPostDate`).d('发货日期'),
      },
      {
        name: 'itemCertNum1',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCertNum1`).d('接收凭证'),
      },
      {
        name: 'projectNum1',
        type: 'string',
        label: intl.get(`${intlPrefix}.projectNum1`).d('接收凭证行'),
      },
      {
        name: 'itemCertNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCertNum`).d('物料凭证'),
      },
      {
        name: 'projectNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.projectNum`).d('凭证行'),
      },
      {
        name: 'moveType',
        type: 'string',
        label: intl.get(`${intlPrefix}.moveType`).d('移动类型'),
      },
      {
        name: 'sequenceLotControl',
        type: 'string',
        label: intl.get(`${intlPrefix}.lotNumber`).d('批次'),
      },
      {
        name: 'tagFlag',
        type: 'number',
        label: intl.get(`${intlPrefix}.serialNum`).d('序列号'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url: `${HLOS_ZCOM}/v1/${organizationId}/cert-storage-lines`,
          data: {
            ...data,
            itemCertPostDateStart: data.itemCertPostDateStart
              ? data.itemCertPostDateStart.concat(' 00:00:00')
              : null,
            itemCertPostDateEnd: data.itemCertPostDateEnd
              ? data.itemCertPostDateEnd.concat(' 23:59:59')
              : null,
            storageDateStart: data.storageDateStart
              ? data.storageDateStart.concat(' 00:00:00')
              : null,
            storageDateEnd: data.storageDateEnd ? data.storageDateEnd.concat(' 23:59:59') : null,
          },
          method: 'GET',
        };
      },
    },
  };
};

const lotNumberListDS = () => {
  return {
    autoQuery: false,
    selection: false,
    paging: false,
    fields: [
      {
        name: 'itemCertHeadText',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCertHeadText`).d('发货单'), // 待确定
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      },
      {
        name: 'batchQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.batchQty`).d('数量'),
      },
      {
        name: 'batchNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.batchNum`).d('批次编码'),
      },
    ],
  };
};

const serialNumListDS = () => {
  return {
    autoQuery: false,
    selection: false,
    paging: false,
    fields: [
      {
        name: 'itemCertHeadText',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCertHeadText`).d('发货单'), // 待确定
      },
      {
        name: 'customerItemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      },
      {
        name: 'serialQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.serialQty`).d('数量'),
      },
      {
        name: 'serialNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.serialNum`).d('序列号编码'),
      },
    ],
  };
};

export {
  customerItemRevDS,
  batchDS,
  serialDS,
  customerItemReceivedListDS,
  lotNumberListDS,
  serialNumListDS,
};
