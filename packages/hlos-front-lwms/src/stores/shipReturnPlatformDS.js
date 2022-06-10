/**
 * @Description: 销售退货单平台--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-11-18 10:47:41
 * @LastEditors: yu.na
 */

import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { HLOS_LWMS, HLOS_LSOP } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lwmsShipReturnPlatform } = codeConfig.code;

const preCode = 'lwms.shipReturnPlatform.model';
const commonCode = 'lwms.common.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LWMS}/v1/${organizationId}/ship-returns`;
const lineUrl = `${HLOS_LWMS}/v1/${organizationId}/ship-return-lines`;

const ListDS = () => {
  return {
    primarykey: 'shipReturnId',
    selection: 'multiple',
    pageSize: 100,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${preCode}.receiveOrg`).d('收货组织'),
        lovCode: common.organization,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'shipReturnObj',
        type: 'object',
        label: intl.get(`${preCode}.shipReturnNum`).d('退货单号'),
        lovCode: lwmsShipReturnPlatform.shipReturn,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'shipReturnId',
        bind: 'shipReturnObj.shipReturnId',
      },
      {
        name: 'shipReturnNum',
        bind: 'shipReturnObj.shipReturnNum',
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
        bind: 'customerObj.customerId',
      },
      {
        name: 'customerName',
        bind: 'customerObj.customerName',
        ignore: 'always',
      },
      {
        name: 'shipReturnStatus',
        type: 'string',
        label: intl.get(`${commonCode}.shipReturnStatus`).d('退货单状态'),
        lookupCode: lwmsShipReturnPlatform.shipReturnStatus,
        multiple: true,
        defaultValue: ['NEW', 'RELEASED', 'RECEIVED', 'INSPECTED', 'RECEIVING'],
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${commonCode}.item`).d('物料'),
        lovCode: common.item,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'itemId',
        bind: 'itemObj.itemId',
      },
      {
        name: 'itemCode',
        bind: 'itemObj.itemCode',
        ignore: 'always',
      },
      {
        name: 'soObj',
        type: 'object',
        label: intl.get(`${preCode}.soNum`).d('销售订单号'),
        lovCode: common.soNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'soId',
        bind: 'soObj.soHeaderId',
      },
      {
        name: 'soNum',
        bind: 'soObj.soHeaderNumber',
      },
      {
        name: 'demandObj',
        type: 'object',
        label: intl.get(`${preCode}.demandNum`).d('需求订单号'),
        lovCode: common.demandNum,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'demandId',
        bind: 'demandObj.demandId',
      },
      {
        name: 'demandNum',
        bind: 'demandObj.demandNumber',
      },
      {
        name: 'shipOrderObj',
        type: 'object',
        label: intl.get(`${preCode}.shipOrder`).d('发货单号'),
        lovCode: common.shipOrder,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'shipOrderId',
        bind: 'shipOrderObj.shipOrderId',
      },
      {
        name: 'shipOrderNum',
        bind: 'shipOrderObj.shipOrderNum',
      },
      {
        name: 'expectedArrivalDateStart',
        type: 'date',
        label: intl.get(`${preCode}.expectedArrivalDateStart`).d('预计到达日期>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('expectedArrivalDateEnd')) {
              return 'expectedArrivalDateEnd';
            }
          },
        },
      },
      {
        name: 'expectedArrivalDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.expectedArrivalDateEnd`).d('预计到达日期<='),
        min: 'expectedArrivalDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'actualArrivalTimeStart',
        type: 'date',
        label: intl.get(`${preCode}.actualArrivalTimeStart`).d('接收时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('actualArrivalTimeEnd')) {
              return 'actualArrivalTimeEnd';
            }
          },
        },
      },
      {
        name: 'actualArrivalTimeEnd',
        type: 'date',
        label: intl.get(`${preCode}.actualArrivalTimeEnd`).d('接收时间<='),
        min: 'actualArrivalTimeStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'sopOuObj',
        type: 'object',
        label: intl.get(`${preCode}.sopOu`).d('销售中心'),
        lovCode: common.sopOu,
        ignore: 'always',
      },
      {
        name: 'sopOuId',
        bind: 'sopOuObj.sopOuId',
      },
      {
        name: 'sopOuName',
        bind: 'sopOuObj.sopOuName',
        ignore: 'always',
      },
      {
        name: 'returnTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.shipReturnType`).d('退货单类型'),
        lovCode: common.documentType,
        lovPara: { documentClass: 'SHIP_RETURN' },
        ignore: 'always',
      },
      {
        name: 'shipReturnTypeId',
        bind: 'returnTypeObj.documentTypeId',
      },
      {
        name: 'shipReturnTypeName',
        bind: 'returnTypeObj.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'receiveWarehouseObj',
        label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
        type: 'object',
        lovCode: common.warehouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'receiveWarehouse',
        bind: 'receiveWarehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'receiveWarehouseId',
        bind: 'receiveWarehouseObj.warehouseId',
      },
      {
        name: 'receiveWarehouseCode',
        bind: 'receiveWarehouseObj.warehouseCode',
      },
      {
        name: 'salesmanObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${preCode}.salesman`).d('销售员'),
        // lovPara: { workerType: 'SALESMAN' },
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
            workerType: 'SALESMAN',
          }),
        },
        ignore: 'always',
      },
      {
        name: 'salesmanId',
        bind: 'salesmanObj.workerId',
      },
      {
        name: 'salesmanName',
        bind: 'salesmanObj.workerName',
        ignore: 'always',
      },
      {
        name: 'creatorObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${preCode}.creator`).d('制单人'),
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'creatorId',
        bind: 'creatorObj.workerId',
      },
      {
        name: 'creatornName',
        bind: 'creatorObj.workerName',
        ignore: 'always',
      },
      {
        name: 'createDateStart',
        type: 'date',
        label: intl.get(`${preCode}.createDateStart`).d('制单时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('createDateEnd')) {
              return 'createDateEnd';
            }
          },
        },
      },
      {
        name: 'createDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.createDateEnd`).d('制单时间<='),
        min: 'createDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
    ],
    fields: [
      {
        name: 'organizationCode',
        label: intl.get(`${preCode}.receiveOrg`).d('收货组织'),
        transformResponse: (val, object) => `${val || ''} ${object.organizationName || ''}`,
      },
      {
        name: 'shipReturnNum',
        label: intl.get(`${preCode}.shipReturnNum`).d('退货单号'),
      },
      {
        name: 'shipReturnTypeName',
        label: intl.get(`${preCode}.shipReturnType`).d('退货单类型'),
      },
      {
        name: 'shipReturnStatusMeaning',
        label: intl.get(`${preCode}.shipReturnStatus`).d('退货单状态'),
      },
      {
        name: 'customerName',
        label: intl.get(`${commonCode}.customer`).d('客户'),
      },
      {
        name: 'customerSiteName',
        label: intl.get(`${commonCode}.customerSite`).d('客户地点'),
      },
      {
        name: 'returnSourceTypeMeaning',
        label: intl.get(`${commonCode}.resourceType`).d('来源类型'),
      },
      {
        name: 'soNum',
        label: intl.get(`${preCode}.soNum`).d('销售订单号'),
      },
      {
        name: 'soLineNum',
        label: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
      },
      {
        name: 'demandNum',
        label: intl.get(`${preCode}.demandNum`).d('需求订单号'),
      },
      {
        name: 'shipOrderNum',
        label: intl.get(`${preCode}.shipOrderNum`).d('发货单号'),
      },
      {
        name: 'shipOrderLineNum',
        label: intl.get(`${preCode}.shipOrderLineNum`).d('发货单行号'),
      },
      {
        name: 'customerPo',
        label: intl.get(`${preCode}.customerPo`).d('客户PO'),
      },
      {
        name: 'customerPoLine',
        label: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
      },
      {
        name: 'salesmanName',
        label: intl.get(`${preCode}.salesman`).d('销售员'),
      },
      {
        name: 'freight',
        label: intl.get(`${preCode}.freight`).d('运费'),
      },
      {
        name: 'currencyName',
        label: intl.get(`${preCode}.currency`).d('币种'),
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
        name: 'plateNum',
        label: intl.get(`${preCode}.plateNum`).d('车牌号'),
      },
      {
        name: 'shipReturnGroup',
        label: intl.get(`${preCode}.shipReturnGroup`).d('退货单组'),
      },
      {
        name: 'shipToSite',
        label: intl.get(`${preCode}.shipToSite`).d('客户收货地点'),
      },
      {
        name: 'customerContact',
        label: intl.get(`${preCode}.customerContact`).d('客户联系人'),
      },
      {
        name: 'contactPhone',
        label: intl.get(`${preCode}.contactPhone`).d('联系电话'),
      },
      {
        name: 'contactEmail',
        label: intl.get(`${preCode}.contactEmail`).d('联系邮箱'),
      },
      {
        name: 'customerAddress',
        label: intl.get(`${preCode}.customerAddress`).d('客户地址'),
      },
      {
        name: 'printedDate',
        label: intl.get(`${preCode}.printedDate`).d('打印时间'),
      },
      {
        name: 'printedFlag',
        label: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      },
      {
        name: 'creatorName',
        label: intl.get(`${preCode}.creator`).d('制单人'),
      },
      {
        name: 'creationDate',
        label: intl.get(`${preCode}.creationDate `).d('制单时间'),
      },
      {
        name: 'approvalRule',
        label: intl.get(`${preCode}.approvalRule `).d('审批策略'),
      },
      {
        name: 'approvalWorkflow',
        label: intl.get(`${preCode}.approvalWorkflow `).d('审批工作流'),
      },
      {
        name: 'sourceDocTypeName',
        label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据'),
      },
      {
        name: 'sourceDocLineNum',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      },
      {
        name: 'docProcessRule',
        label: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      },
      {
        name: 'externalId',
        label: intl.get(`${preCode}.externalId`).d('外部系统ID'),
      },
      {
        name: 'externalNum',
        label: intl.get(`${preCode}.externalNum`).d('外部单据号'),
      },
      {
        name: 'remark',
        label: intl.get(`${commonCode}.remark`).d('备注'),
      },
      {
        name: 'sopOuCode',
        label: intl.get(`${preCode}.sopOu`).d('销售中心'),
        transformResponse: (val, object) => `${val || ''} ${object.sopOuName || ''}`,
      },
      {
        name: 'returnShipTicket',
        label: intl.get(`${preCode}.returnShipTicket`).d('发运单号'),
      },
      {
        name: 'returnShippedDate',
        label: intl.get(`${preCode}.returnShippedDate`).d('发运日期'),
      },
      {
        name: 'expectedArrivalDate',
        label: intl.get(`${preCode}.expectedArrivalDate`).d('预计到达日期'),
      },
      {
        name: 'receiveWarehouseCode',
        label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
        transformResponse: (val, object) => `${val || ''} ${object.receiveWarehouseName || ''}`,
      },
      {
        name: 'receiveWmAreaCode',
        label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
        transformResponse: (val, object) => `${val || ''} ${object.receiveWmAreaName || ''}`,
      },
      {
        name: 'receiveWorkerName',
        label: intl.get(`${preCode}.receiver`).d('收货员'),
      },
      {
        name: 'actualArrivalTime',
        label: intl.get(`${preCode}.actualArrivalTime `).d('接收时间'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { shipReturnStatus: statusList } = data;
        return {
          url: generateUrlWithGetParam(url, {
            statusList,
          }),
          params: {
            page: data.page || 0,
            size: data.size || 100,
          },
          data: {
            ...data,
            shipReturnStatus: undefined,
          },
          method: 'GET',
        };
      },
      destroy: () => {
        return {
          url,
          method: 'DELETE',
        };
      },
    },
    // events: {
    //   update: ({ record, name }) => {
    //     debugger
    //     if (name === 'organizationObj') {
    //       record.set('shipReturnObj', null);
    //       record.set('soObj', null);
    //       record.set('demandObj', null);
    //       record.set('shipOrderObj', null);
    //       record.set('salesmanObj', null);
    //       record.set('creatorObj', null);
    //     }
    //   },
    // },
  };
};

const LineDS = () => ({
  primaryKey: 'returnLineId',
  pageSize: 100,
  fields: [
    {
      name: 'returnLineNum',
      label: intl.get(`${commonCode}.lineNum`).d('行号'),
    },
    {
      name: 'itemCode',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
    {
      name: 'itemDescription',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'uomName',
      label: intl.get(`${commonCode}.uom`).d('单位'),
    },
    {
      name: 'applyQty',
      label: intl.get(`${preCode}.applyQty`).d('制单数量'),
    },
    {
      name: 'receivedQty',
      label: intl.get(`${preCode}.receivedQty`).d('接收数量'),
    },
    {
      name: 'returnLineStatusMeaning',
      label: intl.get(`${preCode}.lineStatus`).d('行状态'),
    },
    {
      name: 'soNum',
      label: intl.get(`${preCode}.so`).d('销售订单'),
      transformResponse: (val, object) => `${val || ''}-${object.soLineNum || ''}`,
    },
    {
      name: 'soLineNum',
      label: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
    },
    {
      name: 'demandNum',
      label: intl.get(`${preCode}.demandNum`).d('需求订单号'),
    },
    {
      name: 'shipOrderNum',
      label: intl.get(`${preCode}.shipOrderNum`).d('发货单号'),
    },
    {
      name: 'shipOrderLineNum',
      label: intl.get(`${preCode}.shipOrderLineNum`).d('发货单行号'),
    },
    {
      name: 'customerPo',
      label: intl.get(`${preCode}.customerPo`).d('客户PO'),
    },
    {
      name: 'customerPoLine',
      label: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
    },
    {
      name: 'shipReturnRule',
      label: intl.get(`${preCode}.shipReturnRule`).d('退货规则'),
    },
    {
      name: 'itemControlTypeMeaning',
      label: intl.get(`${preCode}.itemControlType`).d('物料控制类型'),
    },
    {
      name: 'returnReasonName',
      label: intl.get(`${preCode}.returnReason`).d('退货原因'),
    },
    {
      name: 'sourceDocTypeName',
      label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
    },
    {
      name: 'sourceDocNum',
      label: intl.get(`${preCode}.sourceDocNum`).d('来源单据'),
    },
    {
      name: 'sourceDocLineNum',
      label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
    },
    {
      name: 'externalNum',
      label: intl.get(`${preCode}.externalNum`).d('外部单据号'),
    },
    {
      name: 'externalLineNum',
      label: intl.get(`${preCode}.externalLineNum`).d('外部系统行号'),
    },
    {
      name: 'lineRemark',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'receiveWarehouseCode',
      label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
      transformResponse: (val, object) => `${val || ''} ${object.receiveWarehouseName || ''}`,
    },
    {
      name: 'receiveWmAreaCode',
      label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
      transformResponse: (val, object) => `${val || ''} ${object.receiveWmAreaName || ''}`,
    },
    {
      name: 'qcDocNum',
      label: intl.get(`${preCode}.qcDocNum`).d('检验单号'),
    },
    {
      name: 'qcOkQty',
      label: intl.get(`${preCode}.qcOkQty`).d('合格数量'),
    },
    {
      name: 'qcNgQty',
      label: intl.get(`${preCode}.qcNgQty`).d('不合格数量'),
    },
    {
      name: 'receiveWorkerName',
      label: intl.get(`${preCode}.receiver`).d('收货员'),
    },
    {
      name: 'actualArrivalTime',
      label: intl.get(`${preCode}.actualArrivalTime`).d('接收时间'),
    },
    {
      name: 'lotNumber',
      label: intl.get(`${preCode}.lot`).d('指定批次'),
    },
    {
      name: 'tagCode',
      label: intl.get(`${preCode}.tag`).d('指定标签'),
    },
    {
      name: 'packingQty',
      label: intl.get(`${preCode}.packingQty`).d('包装数'),
    },
    {
      name: 'containerQty',
      label: intl.get(`${preCode}.containerQty`).d('装箱数'),
    },
  ],
  transport: {
    read: ({ data }) => ({
      url: lineUrl,
      data: {
        shipReturnId: data.shipReturnId,
      },
      params: {
        page: data.page || 0,
        size: data.size || 100,
      },
      method: 'GET',
    }),
    destroy: () => {
      return {
        url: lineUrl,
        method: 'DELETE',
      };
    },
  },
});

const DetailDS = () => ({
  primaryKey: 'shipReturnId',
  children: {
    lineList: new DataSet(DetailLineDS()),
  },
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.receiveOrg`).d('收货组织'),
      lovCode: common.organization,
      ignore: 'always',
      disabled: true,
    },
    {
      name: 'organizationId',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'returnTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.shipReturnType`).d('退货单类型'),
      lovCode: common.documentType,
      ignore: 'always',
      disabled: true,
    },
    {
      name: 'shipReturnTypeId',
      bind: 'returnTypeObj.documentTypeId',
    },
    {
      name: 'shipReturnTypeName',
      bind: 'returnTypeObj.documentTypeName',
      ignore: 'always',
      disabled: true,
    },
    {
      name: 'shipReturnObj',
      type: 'object',
      label: intl.get(`${preCode}.shipReturnNum`).d('退货单号'),
      lovCode: lwmsShipReturnPlatform.shipReturn,
      ignore: 'always',
      disabled: true,
    },
    {
      name: 'shipReturnId',
      bind: 'shipReturnObj.shipReturnId',
    },
    {
      name: 'shipReturnNum',
      bind: 'shipReturnObj.shipReturnNum',
    },
    {
      name: 'shipReturnStatus',
      type: 'string',
      label: intl.get(`${commonCode}.shipReturnStatus`).d('退货单状态'),
      lookupCode: lwmsShipReturnPlatform.shipReturnStatus,
      disabled: true,
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${commonCode}.customer`).d('客户'),
      lovCode: common.customer,
      ignore: 'always',
      disabled: true,
    },
    {
      name: 'customerId',
      bind: 'customerObj.customerId',
    },
    {
      name: 'customerName',
      bind: 'customerObj.customerName',
      ignore: 'always',
    },
    {
      name: 'partyName',
      bind: 'customerObj.customerName',
      ignore: 'always',
    },
    {
      name: 'receiveWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'receiveWarehouseId',
      bind: 'receiveWarehouseObj.warehouseId',
    },
    {
      name: 'receiveWarehouseCode',
      bind: 'receiveWarehouseObj.warehouseCode',
    },
    {
      name: 'receiveWarehouseName',
      bind: 'receiveWarehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'receiveWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
      lovCode: common.wmArea,
      ignore: 'always',
    },
    {
      name: 'receiveWmAreaId',
      bind: 'receiveWmAreaObj.wmAreaId',
    },
    {
      name: 'receiveWmAreaCode',
      bind: 'receiveWmAreaObj.wmAreaCode',
    },
    {
      name: 'receiveWmAreaName',
      bind: 'receiveWmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'creatorObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${preCode}.creatorWorker`).d('制单员工'),
      ignore: 'always',
      disabled: true,
    },
    {
      name: 'creatorId',
      bind: 'creatorObj.workerId',
    },
    {
      name: 'creatorCode',
      bind: 'creatorObj.workerCode',
    },
    {
      name: 'creatorName',
      bind: 'creatorObj.workerName',
      ignore: 'always',
    },
    {
      name: 'soObj',
      type: 'object',
      label: intl.get(`${preCode}.soNum`).d('销售订单号'),
      lovCode: common.soNum,
      ignore: 'always',
      disabled: true,
    },
    {
      name: 'soId',
      bind: 'soObj.soHeaderId',
    },
    {
      name: 'soNum',
      bind: 'soObj.soHeaderNumber',
    },
    {
      name: 'demandObj',
      type: 'object',
      label: intl.get(`${preCode}.demandNum`).d('需求订单号'),
      lovCode: common.demandNum,
      ignore: 'always',
      disabled: true,
    },
    {
      name: 'demandId',
      bind: 'demandObj.demandId',
    },
    {
      name: 'demandNum',
      bind: 'demandObj.demandNumber',
    },
    {
      name: 'shipOrderObj',
      type: 'object',
      label: intl.get(`${preCode}.shipOrder`).d('发货单号'),
      lovCode: common.shipOrder,
      ignore: 'always',
      disabled: true,
    },
    {
      name: 'shipOrderId',
      bind: 'shipOrderObj.shipOrderId',
    },
    {
      name: 'shipOrderNum',
      bind: 'shipOrderObj.shipOrderNum',
    },
    {
      name: 'returnShipTicket',
      type: 'string',
      label: intl.get(`${preCode}.returnShipTicket`).d('发运单号'),
    },
    {
      name: 'actualArrivalDate',
      type: 'date',
      label: intl.get(`${preCode}.actualArrivalDate`).d('接收时间'),
      disabled: true,
    },
    {
      name: 'receiveWorkerObj',
      type: 'object',
      label: intl.get(`${preCode}.receiveWorker`).d('接收员工'),
      lovCode: common.worker,
      ignore: 'always',
      disabled: true,
    },
    {
      name: 'receiveWorkerId',
      bind: 'receiveWorkerObj.workerId',
    },
    {
      name: 'receiveWorkerName',
      bind: 'receiveWorkerObj.workerName',
    },
    {
      name: 'externalId',
      type: 'string',
      label: intl.get(`${preCode}.externalId`).d('外部系统ID'),
    },
    {
      name: 'externalNum',
      type: 'string',
      label: intl.get(`${preCode}.externalNum`).d('外部单据号'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'peintedDate',
      type: 'date',
      label: intl.get(`${preCode}.peintedDate`).d('打印时间'),
    },
    {
      name: 'peintedFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.peintedFlag`).d('打印标识'),
    },
    // 单据处理规则
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
  },
});

const DetailLineDS = () => ({
  primaryKey: 'shipReturnId',
  pageSize: 100,
  fields: [
    {
      name: 'returnLineNum',
      label: intl.get(`${commonCode}.lineNum`).d('行号'),
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'itemId',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'itemDescription',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      bind: 'itemObj.description',
    },
    {
      name: 'uomObj',
      type: 'object',
      label: intl.get(`${commonCode}.uom`).d('单位'),
      lovCode: common.uom,
      ignore: 'always',
    },
    {
      name: 'uomId',
      bind: 'uomObj.uomId',
    },
    {
      name: 'uom',
      bind: 'uomObj.uomCode',
    },
    {
      name: 'uomName',
      bind: 'uomObj.uomName',
    },
    {
      name: 'applyQty',
      type: 'number',
      label: intl.get(`${preCode}.applyQty`).d('制单数量'),
    },
    {
      name: 'receivedQty',
      label: intl.get(`${preCode}.receivedQty`).d('接收数量'),
    },
    {
      name: 'returnLineStatusMeaning',
      label: intl.get(`${preCode}.lineStatus`).d('行状态'),
    },
    {
      name: 'soNum',
      label: intl.get(`${preCode}.soNum`).d('销售订单号'),
    },
    {
      name: 'soLineNum',
      label: intl.get(`${preCode}.soLineNum`).d('销售订单行号'),
    },
    {
      name: 'demandNum',
      label: intl.get(`${preCode}.demandNum`).d('需求订单号'),
    },
    {
      name: 'shipOrderNum',
      label: intl.get(`${preCode}.shipOrderNum`).d('发货单号'),
    },
    {
      name: 'shipOrderLineNum',
      label: intl.get(`${preCode}.shipOrderLineNum`).d('发货单行号'),
    },
    {
      name: 'customerPo',
      label: intl.get(`${preCode}.customerPo`).d('客户PO'),
    },
    {
      name: 'customerPoLine',
      label: intl.get(`${preCode}.customerPoLine`).d('客户PO行'),
    },
    {
      name: 'shipReturnRule',
      label: intl.get(`${preCode}.shipReturnRule`).d('退货规则'),
    },
    {
      name: 'itemControlTypeMeaning',
      label: intl.get(`${preCode}.itemControlType`).d('物料控制类型'),
    },
    {
      name: 'returnReasonName',
      type: 'string',
      label: intl.get(`${preCode}.returnReason`).d('退货原因'),
    },
    {
      name: 'sourceDocTypeName',
      label: intl.get(`${preCode}.sourceDocType`).d('来源单据类型'),
    },
    {
      name: 'sourceDocNum',
      label: intl.get(`${preCode}.sourceDocNum`).d('来源单据'),
    },
    {
      name: 'sourceDocLineNum',
      label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
    },
    {
      name: 'externalNum',
      label: intl.get(`${preCode}.externalNum`).d('外部单据号'),
    },
    {
      name: 'externalLineNum',
      label: intl.get(`${preCode}.externalLineNum`).d('外部系统行号'),
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'receiveWarehouseName',
      label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
    },
    {
      name: 'receiveWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
      lovCode: common.wmArea,
      ignore: 'always',
    },
    {
      name: 'receiveWmAreaId',
      bind: 'receiveWmAreaObj.wmAreaId',
    },
    {
      name: 'receiveWmAreaCode',
      bind: 'receiveWmAreaObj.wmAreaCode',
    },
    {
      name: 'receiveWmAreaName',
      bind: 'receiveWmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'qcDocNum',
      label: intl.get(`${preCode}.qcDocNum`).d('检验单号'),
    },
    {
      name: 'qcOkQty',
      label: intl.get(`${preCode}.qcOkQty`).d('合格数量'),
    },
    {
      name: 'qcNgQty',
      label: intl.get(`${preCode}.qcNgQty`).d('不合格品数量'),
    },
    {
      name: 'receiveWorkerName',
      label: intl.get(`${preCode}.receiver`).d('收货员'),
    },
    {
      name: 'actualArrivalTime',
      label: intl.get(`${preCode}.actualArrivalTime`).d('接收时间'),
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${preCode}.lot`).d('指定批次'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tag`).d('指定标签'),
    },
    {
      name: 'packingQty',
      type: 'number',
      label: intl.get(`${preCode}.packingQty`).d('包装数'),
    },
    {
      name: 'containerQty',
      type: 'number',
      label: intl.get(`${preCode}.containerQty`).d('装箱数'),
    },
  ],
  transport: {
    read: () => ({
      url: lineUrl,
      method: 'GET',
    }),
  },
});

const CreateQueryDS = () => ({
  queryFields: [
    {
      name: 'limitOrganizationId',
    },
    {
      name: 'sopOuObj',
      type: 'object',
      label: intl.get(`${preCode}.sopOu`).d('销售中心'),
      lovCode: common.sopOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'sopOuId',
      bind: 'sopOuObj.sopOuId',
    },
    {
      name: 'sopOuCode',
      bind: 'sopOuObj.sopOuCode',
    },
    {
      name: 'sopOuName',
      bind: 'sopOuObj.sopOuName',
      ignore: 'always',
    },
    {
      name: 'soObj',
      type: 'object',
      label: intl.get(`${preCode}.soNum`).d('销售订单号'),
      lovCode: common.soNum,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('limitOrganizationId'),
          sopOuId: record.get('sopOuId'),
          shipReturn: true,
          customerId: record.get('customerId'),
        }),
        required: ({ record }) => {
          if (record.get('customerId')) {
            return false;
          }
          return true;
        },
      },
    },
    {
      name: 'soHeaderId',
      bind: 'soObj.soHeaderId',
    },
    {
      name: 'soHeaderNumber',
      bind: 'soObj.soHeaderNumber',
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${commonCode}.customer`).d('客户'),
      lovCode: common.customer,
      ignore: 'always',
      dynamicProps: {
        required: ({ record }) => {
          if (record.get('soHeaderId')) {
            return false;
          }
          return true;
        },
      },
    },
    {
      name: 'customerId',
      bind: 'customerObj.customerId',
    },
    {
      name: 'customerName',
      bind: 'customerObj.customerName',
      ignore: 'always',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('limitOrganizationId'),
        }),
      },
    },
    {
      name: 'itemId',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      bind: 'itemObj.itemCode',
      ignore: 'always',
    },
    {
      name: 'shioOrganizationObj',
      type: 'object',
      label: intl.get(`${preCode}.shipOrg`).d('发运组织'),
      lovCode: common.organization,
      ignore: 'always',
    },
    {
      name: 'shipOrganizationId',
      bind: 'shioOrganizationObj.organizationId',
    },
    {
      name: 'shipOrganizationName',
      bind: 'shioOrganizationObj.organizationName',
      ignore: 'always',
    },
    // 销售员的组织限制
    {
      name: 'receiveOrgId',
    },
    {
      name: 'salesmanObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${preCode}.salesman`).d('销售员'),
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('receiveOrgId'),
          workerType: 'SALESMAN',
        }),
      },
    },
    {
      name: 'salesmanId',
      bind: 'salesmanObj.workerId',
    },
    {
      name: 'salesmanName',
      bind: 'salesmanObj.workerName',
      ignore: 'always',
    },
    {
      name: 'demandDateStart',
      type: 'date',
      label: intl.get(`${preCode}.demandDateStart`).d('需求日期>='),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('demandDateEnd')) {
            return 'demandDateEnd';
          }
        },
      },
    },
    {
      name: 'demandDateEnd',
      type: 'date',
      label: intl.get(`${preCode}.demandDateEnd`).d('需求日期<='),
      min: 'demandDateStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ],
  fields: [
    {
      name: 'soNum',
      label: intl.get(`${preCode}.soNum`).d('销售订单号'),
      // transformResponse: (val, object) => `${val || ''}-${object.soLineNum || ''}`,
    },
    {
      name: 'itemCode',
      label: intl.get(`${commonCode}.item`).d('物料'),
      // transformResponse: (val, object) => `${val || ''}-${object.itemDescription || ''}`,
    },
    {
      name: 'shippedQty',
      label: intl.get(`${preCode}.shippedQty`).d('发货数量'),
    },
    {
      name: 'returnedQty',
      label: intl.get(`${preCode}.returnedQty`).d('已退货数量'),
    },
    {
      name: 'customerName',
      label: intl.get(`${preCode}.customer`).d('客户'),
    },
    {
      name: 'shipOrganization',
      label: intl.get(`${preCode}.shipOrg`).d('发运组织'),
    },
    {
      name: 'salesmanName',
      label: intl.get(`${preCode}.salesman`).d('销售员'),
    },
    {
      name: 'demandDate',
      label: intl.get(`${preCode}.demandDate`).d('需求日期'),
    },
  ],
  transport: {
    read: () => ({
      url: `${HLOS_LSOP}/v1/${organizationId}/so-headers`,
      method: 'GET',
    }),
  },
});

const CreateDS = () => ({
  autoCreate: true,
  children: {
    lineList: new DataSet(CreateLineDS()),
  },
  fields: [
    {
      name: 'returnTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.shipReturnType`).d('退货单类型'),
      lovCode: common.documentType,
      lovPara: { documentClass: 'SHIP_RETURN' },
      ignore: 'always',
      required: true,
    },
    {
      name: 'shipReturnTypeId',
      bind: 'returnTypeObj.documentTypeId',
    },
    {
      name: 'shipReturnTypeCode',
      bind: 'returnTypeObj.documentTypeCode',
    },
    {
      name: 'shipReturnTypeName',
      bind: 'returnTypeObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'limitOrganizationId',
    },
    {
      name: 'shipReturnNum',
      label: intl.get(`${preCode}.shipReturnNum`).d('退货单号'),
      disabled: true,
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.receiveOrg`).d('收货组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'receiveWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'receiveWarehouseId',
      bind: 'receiveWarehouseObj.warehouseId',
    },
    {
      name: 'receiveWarehouseCode',
      bind: 'receiveWarehouseObj.warehouseCode',
    },
    {
      name: 'receiveWarehouseName',
      bind: 'receiveWarehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'receiveWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      cascadeMap: { warehouseId: 'receiveWarehouseId' },
      // dynamicProps: {
      //   lovPara: ({ record }) => ({
      //     warehouseId: record.get('receiveWarehouseId'),
      //   }),
      // },
    },
    {
      name: 'receiveWmAreaId',
      bind: 'receiveWmAreaObj.wmAreaId',
    },
    {
      name: 'receiveWmAreaCode',
      bind: 'receiveWmAreaObj.wmAreaCode',
    },
    {
      name: 'receiveWmAreaName',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'shipReturnStatus',
      type: 'string',
      label: intl.get(`${commonCode}.shipReturnStatus`).d('退货单状态'),
      lookupCode: lwmsShipReturnPlatform.shipReturnStatus,
      disabled: true,
      defaultValue: 'NEW',
    },
    {
      name: 'returnShipTicket',
      type: 'string',
      label: intl.get(`${preCode}.returnShipTicketObj`).d('退货发运单号'),
    },
    {
      name: 'returnReasonObj',
      type: 'object',
      label: intl.get(`${preCode}.returnReason`).d('退货原因'),
      lovCode: lwmsShipReturnPlatform.returnReason,
      lovPara: { exceptionClass: 'SALES_RETURN' },
      ignore: 'always',
    },
    {
      name: 'returnReasonId',
      bind: 'returnReasonObj.exceptionId',
    },
    {
      name: 'returnReason',
      bind: 'returnReasonObj.exceptionCode',
    },
    {
      name: 'returnReasonName',
      bind: 'returnReasonObj.exceptionName',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonCode}.remark`).d('备注'),
    },
    {
      name: 'customerPo',
      type: 'string',
      label: intl.get(`${preCode}.customerPo`).d('客户PO'),
    },
    {
      name: 'freight',
      type: 'string',
      label: intl.get(`${preCode}.freight`).d('运费'),
    },
    {
      name: 'currencyObj',
      type: 'object',
      label: intl.get(`${preCode}.currency`).d('币种'),
      lovCode: common.currency,
      textField: 'currencyName',
      ignore: 'always',
    },
    {
      name: 'currencyCode',
      bind: 'currencyObj.currencyCode',
    },
    {
      name: 'currencyId',
      bind: 'currencyObj.currencyId',
    },
    {
      name: 'currencyName',
      bind: 'currencyObj.currencyName',
      ignore: 'always',
    },
    {
      name: 'carrier',
      type: 'string',
      label: intl.get(`${preCode}.carrier`).d('承运人'),
    },
    {
      name: 'carrierContact',
      type: 'string',
      label: intl.get(`${preCode}.carrierContact`).d('承运人联系方式'),
    },
    {
      name: 'plateNum',
      type: 'string',
      label: intl.get(`${preCode}.plateNum`).d('车牌号'),
    },
    {
      name: 'docProcessRule',
      type: 'string',
      label: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
      bind: 'returnTypeObj.docProcessRule',
    },
    {
      name: 'docProcessRuleId',
      type: 'string',
      bind: 'returnTypeObj.docProcessRuleId',
    },
  ],
  events: {
    update: ({ name, record, dataSet }) => {
      if (name === 'receiveWarehouseObj') {
        record.set('receiveWmAreaObj', null);
      }
      if (name === 'organizationObj') {
        record.set('receiveWarehouseObj', null);
        record.set('receiveWmAreaObj', null);
        dataSet.children.lineList.forEach((i) => {
          i.set('receiveWarehouseObj', null);
          i.set('receiveWmAreaObj', null);
        });
      }
    },
  },
});

const CreateLineDS = () => ({
  paging: false,
  fields: [
    {
      name: 'returnLineNum',
      label: intl.get(`${preCode}.lineNum`).d('行号'),
    },
    {
      name: 'soNum',
      label: intl.get(`${preCode}.soNum`).d('销售订单号'),
      // transformResponse: (val, object) => `${val || ''}-${object.soLineNum || ''}`,
    },
    {
      name: 'itemCode',
      label: intl.get(`${commonCode}.item`).d('物料'),
      // transformResponse: (val, object) => `${val || ''}-${object.itemDescription || ''}`,
    },
    {
      name: 'shippedQty',
      label: intl.get(`${preCode}.shippedQty`).d('发货数量'),
    },
    {
      name: 'returnedQty',
      label: intl.get(`${preCode}.returnedQty`).d('已退货数量'),
    },
    {
      name: 'applyQty',
      type: 'number',
      label: intl.get(`${preCode}.returnedQty`).d('本次退货数量'),
      required: true,
      min: 1,
      step: 1,
      dynamicProps: {
        max: ({ record }) => {
          return record.get('shippedQty') - record.get('returnedQty');
        },
      },
    },
    {
      name: 'receiveWarehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.receiveWarehouse`).d('接收仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ dataSet }) => {
          if (dataSet.parent.current.get('organizationId')) {
            return { organizationId: dataSet.parent.current.get('organizationId') };
          }
        },
      },
    },
    {
      name: 'receiveWarehouseId',
      bind: 'receiveWarehouseObj.warehouseId',
    },
    {
      name: 'receiveWarehouseCode',
      bind: 'receiveWarehouseObj.warehouseCode',
    },
    {
      name: 'receiveWarehouseName',
      bind: 'receiveWarehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'receiveWmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.receiveWmArea`).d('接收货位'),
      lovCode: common.wmArea,
      cascadeMap: { warehouseId: 'receiveWarehouseId' },
      ignore: 'always',
    },
    {
      name: 'receiveWmAreaId',
      bind: 'receiveWmAreaObj.wmAreaId',
    },
    {
      name: 'receiveWmAreaCode',
      bind: 'receiveWmAreaObj.wmAreaCode',
    },
    {
      name: 'receiveWmAreaName',
      bind: 'wmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'returnReasonObj',
      type: 'object',
      label: intl.get(`${preCode}.returnReason`).d('退货原因'),
      lovCode: lwmsShipReturnPlatform.returnReason,
      lovPara: { exceptionClass: 'SALES_RETURN' },
      ignore: 'always',
    },
    {
      name: 'returnReasonId',
      bind: 'returnReasonObj.exceptionId',
    },
    {
      name: 'returnReasonName',
      bind: 'returnReasonObj.exceptionName',
    },
    {
      name: 'shipReturnRule',
      type: 'string',
      label: intl.get(`${preCode}.shipReturnRule`).d('退货规则'),
      lookupCode: lwmsShipReturnPlatform.rule,
      // lovPara: { ruleClass: 'MES' },
      ignore: 'always',
    },
    {
      name: 'shipReturnRuleId',
      bind: 'shipReturnRuleObj.ruleId',
    },
    {
      name: 'shipReturnRuleName',
      bind: 'shipReturnRuleObj.ruleName',
    },
    {
      name: 'packingQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.packingQty`).d('包装数'),
    },
    {
      name: 'containerQty',
      type: 'number',
      min: 1,
      label: intl.get(`${preCode}.containerQty`).d('装箱数'),
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${preCode}.lot`).d('指定批次'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tag`).d('指定标签'),
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${preCode}.lineRemark`).d('行备注'),
    },
  ],
});

export { ListDS, LineDS, DetailDS, CreateQueryDS, CreateDS };
