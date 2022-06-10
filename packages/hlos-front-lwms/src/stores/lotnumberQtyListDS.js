/*
 * @Author: zhang yang
 * @Description: 批次
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-19 14:31:43
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lwmsLotNumberQty } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lwms.lotnumberQty.model';
const commonCode = 'lwms.common.model';

const url = `${HLOS_LWMS}/v1/${organizationId}/lots`;

const lotnumberQtyListDS = {
  selection: false,
  pageSize: 20,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organization',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'item',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'item.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'item.itemCode',
      ignore: 'always',
    },
    {
      name: 'lot',
      type: 'object',
      label: intl.get(`${commonCode}.lot`).d('批次'),
      lovCode: lwmsLotNumberQty.lot,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organization'),
          itemId: record.get('itemId'),
        }),
      },
    },
    {
      name: 'lotNumber',
      type: 'string',
      bind: 'lot.lotNumber',
    },
    {
      name: 'lotId',
      type: 'string',
      bind: 'lot.lotId',
      ignore: 'always',
    },
    {
      name: 'lotStatus',
      type: 'string',
      label: intl.get(`${commonCode}.lotStatus`).d('批次状态'),
      lookupCode: lwmsLotNumberQty.lotStatus,
    },
    {
      name: 'sourceLot',
      type: 'object',
      label: intl.get(`${commonCode}.sourceLot`).d('来源批次'),
      lovCode: lwmsLotNumberQty.lot,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organization'),
        }),
      },
    },
    {
      name: 'sourceLotNumber',
      type: 'string',
      bind: 'sourceLot.lotNumber',
    },
    {
      name: 'sourceLotId',
      type: 'string',
      bind: 'sourceLot.lotId',
      ignore: 'always',
    },
    {
      name: 'supplier',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
      lovCode: lwmsLotNumberQty.supplier,
      ignore: 'always',
    },
    {
      name: 'supplierNumber',
      type: 'string',
      bind: 'supplier.partyName',
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplier.partyId',
    },
    {
      name: 'supplierLotNumber',
      type: 'string',
      label: intl.get(`${preCode}.supplierLotNumber`).d('供应商批次'),
    },
    {
      name: 'receivedDateStart',
      type: 'date',
      label: intl.get(`${preCode}.receivedDateStart`).d('接收日期>='),
    },
    {
      name: 'receivedDateEnd',
      type: 'date',
      label: intl.get(`${preCode}.receivedDateEnd`).d('接收日期<='),
    },
    {
      name: 'expireDateStart',
      type: 'date',
      label: intl.get(`${preCode}.expireDateStart`).d('失效日期>='),
    },
    {
      name: 'expireDateEnd',
      type: 'date',
      label: intl.get(`${preCode}.expireDateEnd`).d('失效日期<='),
    },
  ],
  fields: [
    {
      name: 'organization',
      type: 'string',
      label: intl.get(`${commonCode}.org`).d('组织'),
    },
    {
      name: 'item',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'item.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'item.itemCode',
    },
    // {
    //   name: 'lot',
    //   type: 'object',
    //   label: intl.get(`${preCode}.lot`).d('批次'),
    //   lovCode: lwmsLotNumberQty.lot,
    //   ignore: 'always',
    //   dynamicProps: {
    //     lovPara: ({ record }) => ({
    //       organizationId: record.get('itemId'),
    //     }),
    //   },
    // },
    // {
    //   name: 'lotNumber',
    //   type: 'string',
    //   bind: 'lot.lotNumber',
    // },
    // {
    //   name: 'lotId',
    //   type: 'string',
    //   bind: 'lot.lotId',
    // },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${preCode}.lotNumber`).d('批次'),
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'initialQty',
      type: 'string',
      label: intl.get(`${preCode}.initialQty`).d('初始数量'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${preCode}.uom`).d('单位'),
    },
    {
      name: 'lotTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.lotType`).d('批次类型'),
    },
    {
      name: 'sourceLotNumber',
      type: 'string',
      label: intl.get(`${preCode}.sourceLot`).d('来源批次'),
    },
    {
      name: 'parentLotNumber',
      type: 'string',
      label: intl.get(`${preCode}.parentLotNumber`).d('父批次'),
    },
    {
      name: 'receivedDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.receivedDate`).d('接收日期'),
    },
    {
      name: 'madeDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.madeDate`).d('生产日期'),
    },
    {
      name: 'expireDate',
      type: 'dateTime',
      label: intl.get(`${preCode}.expireDate`).d('失效日期'),
    },
    {
      name: 'supplier',
      type: 'string',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
    },
    {
      name: 'supplierLotNumber',
      type: 'string',
      label: intl.get(`${preCode}.supplierLotNumber`).d('供应商批次'),
    },
    {
      name: 'material',
      type: 'string',
      label: intl.get(`${preCode}.material`).d('材质'),
    },
    {
      name: 'materialSupplier',
      type: 'string',
      label: intl.get(`${preCode}.materialSupplier`).d('材料供应商'),
    },
    {
      name: 'materialLotNumber',
      type: 'string',
      label: intl.get(`${preCode}.materialLotNumber`).d('材料批次'),
    },
    {
      name: 'manufacturer',
      type: 'string',
      label: intl.get(`${preCode}.manufacturer`).d('制造商'),
    },
    {
      name: 'lotStatusMeaning',
      type: 'string',
      label: intl.get(`${preCode}.lotStatus`).d('批次状态'),
    },
    {
      name: 'featureTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.featureType`).d('特征值类型'),
    },
    {
      name: 'featureValue',
      type: 'string',
      label: intl.get(`${preCode}.featureValue`).d('特征值'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('备注'),
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
  },
};

export { lotnumberQtyListDS };
