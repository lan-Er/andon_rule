/*
 * @Description: 送货单详情 - DS
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-15 16:49:19
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-17 17:39:39
 * @Copyright: Copyright (c) 2018, Hand
 */

import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { DataSet } from 'choerodon-ui/pro';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

import codeConfig from '@/common/codeConfig';

const organizationId = getCurrentOrganizationId();
const headUrl = `${HLOS_LWMS}/v1/${organizationId}/delivery-tickets`;
const lineUrl = `${HLOS_LWMS}/v1/${organizationId}/delivery-ticket-lines`;
const lineCreateUrl = `${HLOS_LWMS}/v1/${organizationId}/delivery-tickets/ticket-po-line`;
const preCode = 'lwms.ticket.model';
const commonCode = 'lwms.common.model';
const { common, lwmsTicket } = codeConfig.code;

export const detailHeadDS = () => {
  return {
    autoQuery: false,
    selection: false,
    primaryKey: 'ticketId',
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${preCode}.scmOu`).d('收货组织'),
        lovCode: common.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationCode',
        type: 'string',
        bind: 'organizationObj.organizationCode',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
      },
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${preCode}.supplier`).d('供应商'),
        cascadeMap: {
          organizationId: 'organizationId',
        },
        lovCode: lwmsTicket.party,
        ignore: 'always',
        required: true,
        noCache: true,
      },
      {
        name: 'partyId',
        type: 'string',
        bind: 'supplierObj.partyId',
      },
      {
        name: 'partyName',
        type: 'string',
        bind: 'supplierObj.partyName',
      },
      {
        name: 'partyNumber',
        type: 'string',
        bind: 'supplierObj.partyNumber',
      },
      {
        name: 'partySiteObj',
        type: 'object',
        label: intl.get(`${preCode}.partySite`).d('供应商地点'),
        cascadeMap: {
          partyId: 'partyId',
        },
        lovCode: common.supplierSite,
        ignore: 'always',
        noCache: true,
        dynamicProps: {
          required: ({ record }) => record.get('partyId'),
        },
      },
      {
        name: 'partySiteId',
        type: 'string',
        bind: 'partySiteObj.supplierSiteId',
      },
      {
        name: 'partySiteName',
        type: 'string',
        bind: 'partySiteObj.supplierSiteName',
      },
      {
        name: 'partySiteNumber',
        type: 'string',
        bind: 'partySiteObj.supplierSiteNumber',
      },
      {
        name: 'ticketTypeObj',
        type: 'object',
        lovCode: lwmsTicket.ticketType,
        label: intl.get(`${preCode}.ticketType`).d('送货单类型'),
        lovPara: { documentClass: 'WM_DELIVERY' },
        ignore: 'always',
        required: true,
        noCache: true,
      },
      {
        name: 'ticketTypeId',
        type: 'string',
        bind: 'ticketTypeObj.documentTypeId',
      },
      {
        name: 'ticketTypeCode',
        type: 'string',
        bind: 'ticketTypeObj.documentTypeCode',
      },
      {
        name: 'ticketTypeName',
        type: 'string',
        bind: 'ticketTypeObj.documentTypeName',
      },
      {
        name: 'docProcessRuleId',
        type: 'string',
        label: intl.get(`${preCode}.docProcessRuleId`).d('单据处理规则ID'),
      },
      {
        name: 'docProcessRule',
        type: 'string',
        label: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      },
      {
        name: 'ticketNumObj',
        type: 'object',
        label: intl.get(`${preCode}.ticketNum`).d('送货单号'),
        lovCode: lwmsTicket.ticketNum,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'ticketId',
        type: 'string',
        bind: 'ticketNumObj.ticketId',
      },
      {
        name: 'ticketNum',
        type: 'string',
        bind: 'ticketNumObj.ticketNum',
      },
      {
        name: 'scmOuObj',
        type: 'object',
        label: intl.get(`${preCode}.scmOu`).d('采购中心'),
        lovCode: common.scmOu,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'scmOuId',
        type: 'string',
        bind: 'scmOuObj.scmOuId',
      },
      {
        name: 'scmOu',
        type: 'string',
        bind: 'scmOuObj.scmOuName',
      },
      {
        name: 'scmOuCode',
        type: 'string',
        bind: 'scmOuObj.scmOuCode',
      },
      {
        name: 'poNumObj',
        type: 'object',
        label: intl.get(`${preCode}.poNum`).d('采购订单号'),
        lovCode: lwmsTicket.poNum,
        lovPara: {
          poStatus: 'APPROVED',
        },
        cascadeMap: {
          partyId: 'partyId',
          organizationId: 'organizationId',
        },
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'poId',
        type: 'string',
        bind: 'poNumObj.poId',
      },
      {
        name: 'poNum',
        type: 'string',
        bind: 'poNumObj.poNum',
      },
      {
        name: 'poLineNumObj',
        type: 'object',
        label: intl.get(`${preCode}.poLineNum`).d('采购订单行号'),
        lovCode: lwmsTicket.poLineNum,
        cascadeMap: {
          poId: 'poId',
        },
        lovPara: {
          poLineStatus: 'APPROVED',
        },
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'poLineNum',
        type: 'string',
        bind: 'poLineNumObj.poLineNum',
      },
      {
        name: 'poLineId',
        type: 'string',
        bind: 'poLineNumObj.poLineId',
      },
      {
        name: 'ticketStatus',
        type: 'string',
        lookupCode: lwmsTicket.ticketStatus,
        label: intl.get(`${preCode}.ticketStatus`).d('送货单状态'),
        defaultValue: 'NEW',
      },
      {
        name: 'buyerObj',
        type: 'object',
        label: intl.get(`${preCode}.buyer`).d('采购员'),
        lovCode: common.worker,
        lovPara: {
          workerType: 'BUYER',
        },
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'buyerId',
        type: 'string',
        bind: 'buyerObj.workerId',
      },
      {
        name: 'buyer',
        type: 'string',
        bind: 'buyerObj.workerName',
      },
      {
        name: 'expectedArrivalDate',
        type: 'date',
        label: intl.get(`${preCode}.expectedArrivalDate`).d('预计到达日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'carrier',
        label: intl.get(`${preCode}.carrier`).d('承运人'),
      },
      {
        name: 'carrierContact',
        label: intl.get(`${preCode}.carrierContact`).d('承运人联系方式'),
      },
      {
        name: 'shipTicket',
        label: intl.get(`${preCode}.shipTicket`).d('发运单号'),
      },
      {
        name: 'deliveryArea',
        label: intl.get(`${preCode}.deliveryArea`).d('收货区域'),
      },
      {
        name: 'receiveWarehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'receiveWarehouse',
        type: 'string',
        bind: 'receiveWarehouseObj.warehouseName',
      },
      {
        name: 'receiveWarehouseId',
        type: 'string',
        bind: 'receiveWarehouseObj.warehouseId',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'itemObj.itemId',
      },
      {
        name: 'itemCode',
        type: 'string',
        bind: 'itemObj.itemCode',
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'rules',
        type: 'string',
        label: intl.get(`${commonCode}.rules`).d('规则项'),
      },
    ],
    transport: {
      read: () => ({
        url: headUrl,
        method: 'GET',
      }),
      create: ({ data }) => {
        return {
          url: headUrl,
          data: data[0],
          method: 'POST',
        };
      },
      update: ({ data }) => {
        return {
          url: headUrl,
          data: data[0],
          method: 'PUT',
        };
      },
      destroy: ({ data }) => {
        return {
          url: headUrl,
          data: data[0],
          method: 'DELETE',
        };
      },
    },
  };
};

export const detailLineDS = () => {
  return {
    autoQuery: false,
    autoCreate: true,
    primaryKey: 'ticketId',
    cacheSelection: true,
    pageSize: 100,
    fields: [
      {
        name: 'poNum',
        type: 'string',
        label: intl.get(`${preCode}.poNum`).d('采购订单号'),
      },
      {
        name: 'poLineNum',
        type: 'string',
        label: intl.get(`${preCode}.poLineNum`).d('采购订单行号'),
      },
      {
        name: 'poId',
        type: 'string',
        bind: 'poHeaderId',
      },
      {
        name: 'poHeaderId',
        type: 'string',
      },
      {
        name: 'itemId',
        type: 'string',
        label: intl.get(`${preCode}.item`).d('物料ID'),
      },
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get(`${preCode}.item`).d('物料'),
      },
      {
        name: 'itemDescription',
        type: 'string',
        label: intl.get(`${preCode}.itemDescription`).d('物料描述'),
      },
      {
        name: 'ticketLineStatus',
        label: intl.get(`${preCode}.ticketLineStatus`).d('送货单状态'),
      },
      {
        name: 'ticketLineStatusMeaning',
        label: intl.get(`${preCode}.ticketLineStatus`).d('送货单状态'),
      },
      {
        name: 'uomId',
        type: 'string',
        label: intl.get(`${preCode}.uomId`).d('单位ID'),
      },
      {
        name: 'uom',
        type: 'string',
        label: intl.get(`${preCode}.uom`).d('单位'),
      },
      {
        name: 'deliveryQty',
        type: 'number',
        label: intl.get(`${preCode}.curDeliveryQty`).d('本次送货数量'),
        min: 0,
        max: 'deliverableQty',
        step: 1,
        required: true,
      },
      {
        name: 'deliverableQty',
        type: 'number',
        label: intl.get(`${preCode}.deliverableQty`).d('可送货数量'),
        ignore: 'always',
      },
      {
        name: 'toBeReceivedQty',
        type: 'number',
        label: intl.get(`${preCode}.toBeReceivedQty`).d('待接收数量'),
      },
      {
        name: 'demandDate',
        type: 'date',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'promiseDate',
        type: 'date',
        label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'demandQty',
        type: 'number',
        label: intl.get(`${preCode}.demandQty`).d('需求数量'),
      },
      {
        name: 'receivedQty',
        type: 'number',
        label: intl.get(`${preCode}.receivedQty`).d('接收数量'),
      },
      {
        name: 'returnedQty',
        type: 'number',
        label: intl.get(`${preCode}.returnedQty`).d('退货数量'),
      },
      {
        name: 'packingQty',
        type: 'number',
        label: intl.get(`${preCode}.packingQty`).d('单位包装数量'),
        min: 0,
        step: 1,
      },
      {
        name: 'containerQty',
        type: 'number',
        label: intl.get(`${preCode}.containerQty`).d('包装数量'),
        min: 0,
        step: 1,
      },
      {
        name: 'lotNumber',
        label: intl.get(`${preCode}.lotNumber`).d('送货批次'),
      },
      {
        name: 'secondUomObj',
        type: 'object',
        noCache: true,
        ignore: 'always',
        lovCode: common.uom,
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      },
      {
        name: 'secondUomId',
        type: 'string',
        bind: 'secondUomObj.uomId',
      },
      {
        name: 'secondUom',
        type: 'string',
        bind: 'uomObj.uomCode',
      },
      {
        name: 'secondDeliveryQty',
        type: 'number',
        label: intl.get(`${preCode}.secondDeliveryQty`).d('辅助单位数量'),
        dynamicProps: {
          required: ({ record }) => !isEmpty(record.get('secondUomId')),
        },
      },
      {
        name: 'receiveToleranceType',
        type: 'string',
        label: intl.get(`${preCode}.receiveToleranceType`).d('允差类型'),
        lookupCode: lwmsTicket.receiveToleranceType,
      },
      {
        name: 'receiveTolerance',
        type: 'string',
        label: intl.get(`${preCode}.receiveTolerance`).d('允差值'),
      },
      {
        name: 'receiveRule',
        type: 'string',
        label: intl.get(`${preCode}.receiveRule`).d('收货类型'),
        lookupCode: lwmsTicket.receiveRule,
      },
      {
        name: 'receiveWarehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
      },
      {
        name: 'receiveWarehouseName',
        type: 'string',
        bind: 'receiveWarehouseObj.warehouseName',
      },
      {
        name: 'receiveWarehouseCode',
        type: 'string',
        bind: 'receiveWarehouseObj.warehouseCode',
      },
      {
        name: 'receiveWarehouseId',
        type: 'string',
        bind: 'receiveWarehouseObj.warehouseId',
      },
      {
        name: 'receiveWmAreaObj',
        label: intl.get(`${preCode}.receiveWmAreaReal`).d('接收货位'),
        type: 'object',
        lovCode: common.wmArea,
        ignore: 'always',
        cascadeMap: {
          warehouseId: 'receiveWarehouseId',
        },
      },
      {
        name: 'receiveWmArea',
        type: 'string',
        bind: 'receiveWmAreaObj.wmAreaName',
      },
      {
        name: 'receiveWmAreaCode',
        type: 'string',
        bind: 'receiveWmAreaObj.wmAreaCode',
      },
      {
        name: 'receiveWmAreaId',
        type: 'string',
        bind: 'receiveWmAreaObj.wmAreaId',
      },
      {
        name: 'inventoryWarehouseObj',
        type: 'object',
        lovCode: common.warehouse,
        label: intl.get(`${preCode}.inventoryWarehouseReal`).d('入库仓库'),
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'inventoryWarehouseId',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseId',
      },
      {
        name: 'inventoryWarehouseCode',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseCode',
      },
      {
        name: 'inventoryWarehouse',
        type: 'string',
        bind: 'inventoryWarehouseObj.warehouseName',
      },
      {
        name: 'inventoryWmAreaObj',
        type: 'object',
        lovCode: common.wmArea,
        label: intl.get(`${preCode}.inventoryWmAreaReal`).d('入库货位'),
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'inventoryWmAreaId',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaId',
      },
      {
        name: 'inventoryWmAreaICode',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaICode',
      },
      {
        name: 'inventoryWmArea',
        type: 'string',
        bind: 'inventoryWmAreaObj.wmAreaName',
      },
    ],
    transport: {
      read: ({ data }) => {
        let url = lineUrl;
        const { queryType, ticketId, queryData } = data;
        if (queryType === 'create') {
          url = lineCreateUrl;
        }
        return {
          url,
          method: 'GET',
          data: { ticketId, ...queryData, showPo: true, poLineStatus: 'APPROVED' },
        };
      },
      destroy: ({ data }) => {
        return {
          url: lineUrl,
          data: data.map((item) => item.ticketLineId),
          method: 'DELETE',
        };
      },
    },
  };
};

const newDetailLineDS = () => ({
  pageSize: 100,
  selection: false,
  transport: {
    read: ({ data }) => ({
      url: lineUrl,
      method: 'GET',
      data: { ...data, showPo: true, poLineStatus: 'APPROVED' },
    }),
  },
  fields: [
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${preCode}.item`).d('物料'),
      transformResponse: (val, object) => `${val || ''}  ${object.itemDescription || ''}`,
    },
    {
      name: 'poNum',
      type: 'string',
      label: intl.get(`${preCode}.po`).d('采购订单'),
      transformResponse: (val, object) => `${val || ''}  ${object.poLineNum || ''}`,
    },
    {
      name: 'ticketLineStatusMeaning',
      type: 'string',
      label: intl.get(`${preCode}.lineStatus`).d('行状态'),
    },
    {
      name: 'uom',
      type: 'string',
      label: intl.get(`${preCode}.uom`).d('单位'),
    },
    {
      name: 'deliveryQty',
      type: 'number',
      label: intl.get(`${preCode}.deliveryQty`).d('送货数量'),
    },
    {
      name: 'receivedQty',
      type: 'number',
      label: intl.get(`${preCode}.receivedQty`).d('实收数量'),
    },
    {
      name: 'inventoryQty',
      type: 'number',
      label: intl.get(`${preCode}.inventoryQty`).d('入库数量'),
    },
    {
      name: 'qcOkQty',
      type: 'number',
      label: intl.get(`${preCode}.qcOkQty`).d('检验合格数量'),
    },
    {
      name: 'qcNgQty',
      type: 'number',
      label: intl.get(`${preCode}.qcNgQty`).d('检验不合格数量'),
    },
    {
      name: 'returnedQty',
      type: 'number',
      label: intl.get(`${preCode}.returnedQty`).d('退货数量'),
    },
    {
      name: 'secondUomName',
      type: 'string',
      label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
    },
    {
      name: 'secondDeliveryQty',
      type: 'number',
      label: intl.get(`${preCode}.secondUom`).d('辅助单位数量'),
    },
    {
      name: 'demandDate',
      type: 'date',
      label: intl.get(`${preCode}.demandDate`).d('需求日期'),
    },
    {
      name: 'promiseDate',
      type: 'date',
      label: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
    },
    {
      name: 'inspect',
      type: 'string',
      label: intl.get(`${preCode}.inspect`).d('检验'),
      transformResponse: (val, object) =>
        `${object.qcDocNum || ''}  ${object.inspectorName || ''}  ${object.inspectedTime || ''}`,
    },
    {
      name: 'qcNgReason',
      type: 'string',
      label: intl.get(`${preCode}.qcNgReason`).d('不良原因'),
    },
    {
      name: 'receiveInfo',
      type: 'string',
      label: intl.get(`${preCode}.receiveInfo`).d('接收信息'),
      transformResponse: (val, object) =>
        `${object.receiveWorkerName || ''}  ${object.actualArrivalTime || ''}`,
    },
    {
      name: 'receiveWm',
      type: 'string',
      label: intl.get(`${preCode}.receiveWm`).d('接收库位'),
      transformResponse: (val, object) =>
        `${object.receiveWarehouseName || ''}  ${object.receiveWmAreaName || ''}`,
    },
    {
      name: 'inventoryInfo',
      type: 'string',
      label: intl.get(`${preCode}.inventoryInfo`).d('入库信息'),
      transformResponse: (val, object) =>
        `${object.inventoryWorkerName || ''}  ${object.inventoryTime || ''}`,
    },
    {
      name: 'inventoryWm',
      type: 'string',
      label: intl.get(`${preCode}.inventoryWm`).d('入库库位'),
      transformResponse: (val, object) =>
        `${object.inventoryWarehouseName || ''}  ${object.inventoryWmAreaName || ''}`,
    },
    {
      name: 'recieveRuleMeaning',
      type: 'string',
      label: intl.get(`${preCode}.receiveRule`).d('收货类型'),
    },
    {
      name: 'tolerance',
      type: 'string',
      label: intl.get(`${preCode}.tolerance`).d('允差'),
      transformResponse: (val, object) =>
        `${object.receiveToleranceTypeMeaning || ''}  ${object.receiveTolerance || ''}`,
    },
    {
      name: 'partyLotNumber',
      type: 'string',
      label: intl.get(`${preCode}.partyLotNumber`).d('供应商批次'),
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${preCode}.lotNumber`).d('指定批次'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tagCode`).d('指定标签'),
    },
    {
      name: 'packingQty',
      type: 'number',
      label: intl.get(`${preCode}.packingQty`).d('单位包装数量'),
    },
    {
      name: 'containerQty',
      type: 'number',
      label: intl.get(`${preCode}.containerQty`).d('包装数量'),
    },
    {
      name: 'sourceDoc',
      type: 'string',
      label: intl.get(`${preCode}.sourceDoc`).d('来源单据'),
      transformResponse: (val, object) =>
        `${object.sourceDocNum || ''}  ${object.sourceDocLineNum || ''}  ${
          object.sourceDocTypeName || ''
        }`,
    },
    {
      name: 'externalDoc',
      type: 'string',
      label: intl.get(`${preCode}.externalDoc`).d('外部单据'),
      transformResponse: (val, object) =>
        `${object.externalNum ? `(NUM)${object.externalNum}` : ''}  ${
          object.externalLineNum || ''
        }  ${object.externalId ? `(ID)${object.externalId}` : ''}  ${object.externalLineId || ''}`,
    },
    {
      name: 'itemControlTypeMeaning',
      type: 'string',
      label: intl.get(`${preCode}.itemControlType`).d('物料控制类型'),
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${preCode}.lineRemark`).d('行备注'),
    },
  ],
});

export const newDetailHeadDS = () => ({
  primaryKey: 'ticketId',
  children: {
    lineDS: new DataSet(newDetailLineDS()),
  },
  transport: {
    read: () => ({
      url: headUrl,
      method: 'GET',
    }),
  },
});
