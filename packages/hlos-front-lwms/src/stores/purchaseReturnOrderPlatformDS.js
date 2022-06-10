/*
 * @Description: 采购退货单平台
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-05-08 16:34:07
 */

import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_LWMS, HLOS_LSCM } from 'hlos-front/lib/utils/config';
import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LWMS}/v1/${organizationId}/delivery-returns`;
const lineUrl = `${HLOS_LWMS}/v1/${organizationId}/delivery-return-lines`;
const createLineUrl = `${HLOS_LSCM}/v1/${organizationId}/po-lines`;

const PurchaseDS = () => ({
  autoCreate: true,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: '组织',
      lovCode: 'LMDS.ORGANIZATION',
      required: true,
      ignore: 'always',
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
      ignore: 'always',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'deliveryReturnObj',
      type: 'object',
      label: '采购退货单号',
      lovCode: 'LWMS.DELIVERY_RETURN',
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    {
      name: 'deliveryReturnId',
      type: 'string',
      bind: 'deliveryReturnObj.deliveryReturnId',
    },
    {
      name: 'deliveryReturnNum',
      type: 'string',
      bind: 'deliveryReturnObj.deliveryReturnNum',
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: '供应商',
      lovCode: 'LMDS.SUPPLIER',
      ignore: 'always',
    },
    {
      name: 'partyId',
      type: 'string',
      bind: 'supplierObj.partyId',
    },
    {
      name: 'partyNumber',
      type: 'string',
      bind: 'supplierObj.partyNumber',
      ignore: 'always',
    },
    {
      name: 'partyName',
      type: 'string',
      bind: 'supplierObj.partyName',
      ignore: 'always',
    },
    {
      name: 'deliveryStatus',
      label: '采购退货单状态',
      multiple: true,
      lookupCode: 'LWMS.DELIVERY_RETURN_STATUS',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: '物料',
      lovCode: 'LMDS.ITEM',
      ignore: 'always',
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
      ignore: 'always',
    },
    {
      name: 'description',
      type: 'string',
      bind: 'itemObj.description',
      ignore: 'always',
    },
    {
      name: 'documentObj',
      type: 'object',
      label: '采购订单号',
      lovCode: 'LMDS.DOCUMENT',
      lovPara: {
        documentClass: 'PO',
      },
      ignore: 'always',
    },
    {
      name: 'poId',
      type: 'string',
      bind: 'documentObj.documentId',
      ignore: 'always',
    },
    {
      name: 'poNum',
      type: 'string',
      bind: 'documentObj.documentNum',
    },
    {
      name: 'documentTypeName',
      type: 'string',
      bind: 'documentObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'deliveryObj',
      type: 'object',
      label: '送货单号',
      lovCode: 'LMDS.DOCUMENT',
      lovPara: {
        documentClass: 'WM_DELIVERY',
      },
      ignore: 'always',
    },
    {
      name: 'documentId',
      type: 'string',
      bind: 'deliveryObj.documentId',
    },
    {
      name: 'documentNum',
      type: 'string',
      bind: 'deliveryObj.documentNum',
      ignore: 'always',
    },
    {
      name: 'documentTypeName',
      type: 'string',
      bind: 'deliveryObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'returnOrderObj',
      type: 'object',
      label: '退货单类型',
      lovCode: 'LMDS.DOCUMENT_TYPE',
      lovPara: {
        documentTypeClass: 'DELIVERY_RETURN',
      },
      ignore: 'always',
    },
    {
      name: 'deliveryReturnTypeId',
      type: 'string',
      bind: 'returnOrderObj.documentTypeId',
    },
    {
      name: 'documentTypeCode',
      type: 'string',
      bind: 'returnOrderObj.documentTypeCode',
      ignore: 'always',
    },
    {
      name: 'documentTypeName',
      type: 'string',
      bind: 'returnOrderObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'buyerObj',
      type: 'object',
      label: '采购员',
      lovCode: 'LMDS.WORKER',
      lovPara: {
        workerType: 'SALESMAN',
      },
      ignore: 'always',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'buyerObj.workerId',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'buyerObj.workerCode',
      ignore: 'always',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'buyerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'makeObj',
      type: 'object',
      label: '制单员',
      lovCode: 'LMDS.WORKER',
      ignore: 'always',
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'makeObj.workerId',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'makeObj.workerCode',
      ignore: 'always',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'makeObj.workerName',
      ignore: 'always',
    },
    {
      name: 'returnedTimeFrom',
      label: '退货时间>=',
      type: 'dateTime',
      max: 'returnedTimeTo',
    },
    {
      name: 'returnedTimeTo',
      label: '退货时间<=',
      type: 'dateTime',
      min: 'returnedTimeFrom',
    },
  ],
  fields: [
    {
      name: 'organizationName',
      type: 'string',
      label: '退货组织',
    },
    {
      name: 'deliveryReturnId',
      type: 'string',
    },
    {
      name: 'deliveryReturnNum',
      type: 'string',
      label: '退货单号',
    },
    {
      name: 'deliveryReturnTypeName',
      type: 'string',
      label: '退货单类型',
    },
    {
      name: 'deliveryReturnStatusMeaning',
      type: 'string',
      label: '状态',
    },
    {
      name: 'partyName',
      type: 'string',
      label: '供应商',
    },
    {
      name: 'poNum',
      type: 'string',
      label: '采购订单',
    },
    {
      name: 'poLineNum',
      type: 'string',
      label: '采购订单行',
    },
    {
      name: 'deliveryTicketNum',
      type: 'string',
      label: '送货单',
    },
    {
      name: 'deliveryTicketLineNum',
      type: 'string',
      label: '送货单行',
    },
    {
      name: 'buyerName',
      type: 'string',
      label: '采购员',
    },
    {
      name: 'creatorName',
      type: 'string',
      label: '制单人',
    },
    {
      name: 'docProcessRuleName',
      type: 'string',
      label: '单据处理规则',
    },
    {
      name: 'partySiteName',
      type: 'string',
      label: '供应商地点',
    },
    {
      name: 'partyContact',
      type: 'string',
      label: '联系人',
    },
    {
      name: 'contactPhone',
      type: 'string',
      label: '电话',
    },
    {
      name: 'contactEmail',
      type: 'string',
      label: '邮箱',
    },
    {
      name: 'sourceDocTypeMeaning',
      type: 'string',
      label: '来源单据类型',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: '来源单据',
    },
    {
      name: 'sourceDocLineNum',
      type: 'string',
      label: '来源单据行',
    },
    {
      name: 'printFlag',
      type: 'string',
      label: '打印标识',
    },
    {
      name: 'printCount',
      type: 'string',
      label: '打印次数',
    },
    {
      name: 'remark',
      type: 'string',
      label: '备注',
    },
    // 以下退货展示
    {
      name: 'returnWarehouseName',
      type: 'string',
      label: '退货仓库',
    },
    {
      name: 'returnWmAreaName',
      type: 'string',
      label: '退货货位',
    },
    {
      name: 'returnWorkerName',
      type: 'string',
      label: '退货员',
    },
    {
      name: 'returnTime',
      type: 'string',
      label: '退货时间',
    },
    {
      name: 'returnShipTicket',
      type: 'string',
      label: '退货发运单',
    },
    {
      name: 'freight',
      type: 'string',
      label: '运费',
    },
    {
      name: 'currency',
      type: 'string',
      label: '币种',
    },
    {
      name: 'carrier',
      type: 'string',
      label: '承运人',
    },
    {
      name: 'carrierContact',
      type: 'string',
      label: '承运人电话',
    },
    {
      name: 'plateNum',
      type: 'string',
      label: '车牌号',
    },
  ],
  transport: {
    read: ({ data }) => {
      const { deliveryStatus } = data;
      return {
        url: generateUrlWithGetParam(url, {
          deliveryStatusArray: deliveryStatus,
        }),
        method: 'GET',
        data: { ...data, tenantId: organizationId, deliveryStatus: undefined },
      };
    },
  },
});

const PurchaseLineDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'returnLineNum',
      type: 'string',
      label: '行号',
      order: 'asc',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: '物料',
    },
    {
      name: 'itemName',
      type: 'string',
      label: '描述',
    },
    {
      name: 'uomName',
      type: 'string',
      label: '单位',
    },
    {
      name: 'applyQty',
      type: 'string',
      label: '制单数量',
    },
    {
      name: 'returnedQty',
      type: 'string',
      label: '退货数量',
    },
    {
      name: 'deliveryReturnStatusMeaning',
      type: 'string',
      label: '行状态',
    },
    {
      name: 'poNum',
      type: 'string',
      label: '采购订单',
    },
    {
      name: 'poLineNum',
      type: 'string',
      label: '采购订单行',
    },
    {
      name: 'deliveryTicketNum',
      type: 'string',
      label: '送货单',
    },
    {
      name: 'deliveryTicketLineNum',
      type: 'string',
      label: '送货单行',
    },
    {
      name: 'sourceDocType',
      type: 'string',
      label: '来源单据类型',
    },
    {
      name: 'sourceDocNum',
      type: 'string',
      label: '来源单据',
    },
    {
      name: 'sourceDocLineNum',
      type: 'string',
      label: '来源单据行',
    },
    {
      name: 'itemControlTypeMeaning',
      type: 'string',
      label: '物料控制类型',
    },
    {
      name: 'returnReason',
      type: 'string',
      label: '退货原因',
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: '备注',
    },
    {
      name: 'pickedFlag',
      type: 'string',
      label: '拣料标识',
    },
    {
      name: 'pickedQty',
      type: 'string',
      label: '拣料数量',
    },
    {
      name: 'returnWarehouseName',
      type: 'string',
      label: '退货仓库',
    },
    {
      name: 'returnWmAreaName',
      type: 'string',
      label: '退货货位',
    },
    {
      name: 'returnTime',
      type: 'string',
      label: '退货时间',
    },
    {
      name: 'returnWorkerName',
      type: 'string',
      label: '退货员',
    },
    {
      name: 'pickedWorkerName',
      type: 'string',
      label: '拣料员',
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: '批次',
    },
    {
      name: 'tagCode',
      type: 'string',
      label: '标签',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: lineUrl,
        method: 'GET',
        data: { ...data, tenantId: organizationId },
      };
    },
  },
});

const CreatePageDS = () => ({
  paging: false,
  queryFields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: '组织',
      lovCode: 'LMDS.ORGANIZATION',
      required: true,
      ignore: 'always',
    },
    {
      name: 'receiveOrgId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
      ignore: 'always',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'scmObj',
      type: 'object',
      label: '采购订单号',
      lovCode: 'LSCM.PO',
      cascadeMap: { organizationId: 'receiveOrgId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          partyId: record.get('supplierId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'poHeaderId',
      type: 'string',
      bind: 'scmObj.poId',
    },
    {
      name: 'poNum',
      type: 'string',
      bind: 'scmObj.poNum',
      ignore: 'always',
    },
    {
      name: 'scmOuId',
      type: 'string',
      bind: 'scmObj.scmOuId',
      ignore: 'always',
    },
    {
      name: 'scmOuName',
      type: 'string',
      bind: 'scmObj.scmOuName',
      ignore: 'always',
    },
    {
      name: 'supplierObj',
      type: 'object',
      label: '供应商',
      lovCode: 'LMDS.SUPPLIER',
      ignore: 'always',
      required: true,
      // dynamicProps: {
      //   required: ({ record }) => {
      //     if (record.get('poHeaderId')) {
      //       return false;
      //     }
      //     return true;
      //   },
      // },
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.partyId',
    },
    {
      name: 'partyNumber',
      type: 'string',
      bind: 'supplierObj.partyNumber',
      ignore: 'always',
    },
    {
      name: 'partyName',
      type: 'string',
      bind: 'supplierObj.partyName',
      ignore: 'always',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: '物料',
      lovCode: 'LMDS.ITEM',
      ignore: 'always',
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
      ignore: 'always',
    },
    {
      name: 'description',
      type: 'string',
      bind: 'itemObj.description',
      ignore: 'always',
    },
    {
      name: 'buyerObj',
      type: 'object',
      label: '采购员',
      lovCode: 'LMDS.WORKER',
      lovPara: {
        workerType: 'SALESMAN',
      },
      ignore: 'always',
    },
    {
      name: 'buyerId',
      type: 'string',
      bind: 'buyerObj.workerId',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'buyerObj.workerCode',
      ignore: 'always',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'buyerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'demandDateStart',
      label: '需求时间>=',
      type: 'dateTime',
      max: 'demandDateEnd',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'demandDateEnd',
      label: '需求时间<=',
      type: 'dateTime',
      min: 'demandDateStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
  ],
  fields: [
    {
      name: 'poNum',
      type: 'string',
      order: 'asc',
    },
    {
      name: 'poLineNum',
      type: 'string',
      order: 'asc',
    },
    {
      name: 'scmPoNum',
      type: 'string',
      label: '采购订单号',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: '物料',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: '描述',
    },
    {
      name: 'uomName',
      type: 'string',
      label: '单位',
    },
    {
      name: 'receivedQty',
      type: 'string',
      label: '已接收',
    },
    {
      name: 'returnedQty',
      type: 'string',
      label: '已退货',
    },
    {
      name: 'qcNgQty',
      type: 'string',
      label: '不合格数量',
    },
    {
      name: 'supplierItemDesc',
      type: 'string',
      label: '供应商',
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: createLineUrl,
        method: 'GET',
        data: { ...data, page: -1, itemControlTypeFlag: 1 },
      };
    },
  },
});

const CreateReturnDS = () => ({
  autoCreate: true,
  children: {
    lineList: new DataSet(CreateReturnLineDS()),
  },
  fields: [
    {
      name: 'organizationId',
      type: 'string',
    },
    {
      name: 'returnWarehouseObj',
      type: 'object',
      label: '退货仓库',
      lovCode: 'LMDS.WAREHOUSE',
      cascadeMap: { organizationId: 'organizationId' },
      ignore: 'always',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'returnWarehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'returnWarehouseObj.warehouseCode',
      ignore: 'always',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'returnWarehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'returnWmAreaObj',
      type: 'object',
      label: '退货货位',
      lovCode: 'LMDS.WM_AREA',
      cascadeMap: { warehouseId: 'warehouseId' },
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'returnWmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'returnWmAreaObj.wmAreaCode',
      ignore: 'always',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'returnWmAreaObj.wmAreaName',
      ignore: 'always',
    },
    {
      name: 'returnDocNum',
      label: '退货单号',
      // required: true,
      // 必输；文本输入，不可输入；若单据处理规则doc_num为manual，可手动输入
    },
    {
      name: 'returnReason',
      label: '退货原因',
    },
    {
      name: 'remark',
      label: '备注',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'returnWarehouseObj') {
        record.set('returnWmAreaObj', null);
      }
    },
  },
});

const CreateReturnLineDS = () => ({
  paging: false,
  fields: [
    {
      name: 'lineNum',
      type: 'string',
      label: '行号',
    },
    {
      name: 'scmPoNum',
      type: 'string',
      label: '采购订单号',
    },
    {
      name: 'secondUomName',
      type: 'string',
      label: '辅单位',
    },
    {
      name: 'secondApplyQty',
      type: 'string',
      label: '辅单位数量',
      dynamicProps: {
        required: ({ record }) => {
          if (record.get('secondUomName')) {
            return true;
          }
          return false;
        },
      },
    },
    {
      name: 'returnItemCode',
      type: 'string',
      label: '物料',
    },
    {
      name: 'returnItemDescription',
      type: 'string',
      label: '物料描述',
    },
    {
      name: 'returnUomName',
      type: 'string',
      label: '单位',
    },
    {
      name: 'returnQty',
      type: 'string',
      label: '本次退货数量',
      required: true,
    },
    {
      name: 'returnWarehouseObj',
      type: 'object',
      label: '退货仓库',
      lovCode: 'LMDS.WAREHOUSE',
      ignore: 'always',
      dynamicProps: {
        disabled: ({ dataSet }) => {
          if (
            dataSet.parent.current.get('returnWarehouseObj') &&
            dataSet.parent.current.get('returnWarehouseObj').warehouseId
          ) {
            return true;
          }
          return false;
        },
        lovPara: ({ dataSet }) => {
          if (dataSet.parent.current.get('organizationId')) {
            return { organizationId: dataSet.parent.current.get('organizationId') };
          }
        },
      },
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'returnWarehouseObj.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'returnWarehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'returnWarehouseObj.warehouseName',
      ignore: 'always',
    },
    {
      name: 'returnWmAreaObj',
      type: 'object',
      label: '退货货位',
      lovCode: 'LMDS.WM_AREA',
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
      dynamicProps: {
        disabled: ({ dataSet }) => {
          if (
            dataSet.parent.current.get('returnWmAreaObj') &&
            dataSet.parent.current.get('returnWmAreaObj').wmAreaId
          ) {
            return true;
          }
          return false;
        },
      },
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'returnWmAreaObj.wmAreaId',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      bind: 'returnWmAreaObj.wmAreaCode',
    },
    {
      name: 'wmAreaName',
      type: 'string',
      bind: 'returnWmAreaObj.wmAreaName',
    },
    // {
    //   name: 'purchaseLineNum',
    //   type: 'string',
    //   label: '采购订单号',
    // },
    {
      name: 'returnReason',
      type: 'string',
      label: '退货原因',
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: '批次',
    },
    {
      name: 'tagCode',
      type: 'string',
      label: '标签',
    },
    {
      name: 'packingQty',
      type: 'string',
      label: '包装数量',
    },
    {
      name: 'containerQty',
      type: 'string',
      label: '装箱数',
    },
  ],
  events: {
    update: ({ record, name }) => {
      if (name === 'returnWarehouseObj') {
        record.set('returnWmAreaObj', null);
      }
    },
  },
});

export { PurchaseDS, PurchaseLineDS, CreatePageDS, CreateReturnDS };
