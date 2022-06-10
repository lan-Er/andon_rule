/**
 * @Description: VMI物料申请平台DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-02-20 12:31:40
 */

import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.vmiMaterialsApply.model';
const { common, vmiMaterialsApply } = codeConfig.code;
const organizationId = getCurrentOrganizationId();

const applyListDS = () => ({
  autoQuery: false,
  queryFields: [
    {
      name: 'vmiApplyNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.vmiApplyNum`).d('VMI申请单号'),
    },
    {
      name: 'vmiWarehouseObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.vmiWarehouse`).d('VMI仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
    },
    {
      name: 'vmiWarehouseId',
      type: 'string',
      bind: 'vmiWarehouseObj.warehouseId',
    },
    {
      name: 'vmiWarehouseCode',
      type: 'string',
      bind: 'vmiWarehouseObj.warehouseCode',
    },
    {
      name: 'createdByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
    },
    {
      name: 'vmiApplyStatus',
      type: 'string',
      lookupCode: vmiMaterialsApply.vmiApplyStatus,
      label: intl.get(`${intlPrefix}.vmiApplyStatus`).d('VMI申请单状态'),
      multiple: true,
    },
    {
      name: 'creationDateStart',
      type: 'date',
      label: intl.get(`${commonPrefix}.creationDateStart`).d('创建日期从'),
      max: 'creationDateEnd',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'creationDateEnd',
      type: 'date',
      label: intl.get(`${commonPrefix}.creationDateEnd`).d('创建日期至'),
      min: 'creationDateStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'approvalDateStart',
      type: 'date',
      label: intl.get(`${intlPrefix}.approvalDateStart`).d('审核日期从'),
      max: 'approvalDateEnd',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'approvalDateEnd',
      type: 'date',
      label: intl.get(`${intlPrefix}.approvalDateEnd`).d('审核日期至'),
      min: 'approvalDateStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'submitDateStart',
      type: 'date',
      label: intl.get(`${intlPrefix}.submitDateStart`).d('提交日期从'),
      max: 'submitDateEnd',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'submitDateEnd',
      type: 'date',
      label: intl.get(`${intlPrefix}.submitDateEnd`).d('提交日期至'),
      min: 'submitDateStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'approvalByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.approvalByName`).d('审核人'),
    },
  ],
  fields: [
    {
      name: 'vmiApplyNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.vmiApplyNum`).d('VMI申请单号'),
    },
    {
      name: 'vmiApplyStatus',
      type: 'string',
      lookupCode: vmiMaterialsApply.vmiApplyStatus,
      label: intl.get(`${intlPrefix}.vmiApplyStatus`).d('VMI申请单状态'),
    },
    {
      name: 'vmiMeOuName',
      type: 'string',
      label: intl.get(`${intlPrefix}.vmiMeOuName`).d('工厂'),
    },
    {
      name: 'vmiWmOuName',
      type: 'string',
      label: intl.get(`${intlPrefix}.vmiWmOuName`).d('仓储中心'),
    },
    {
      name: 'vmiWarehouseName',
      type: 'string',
      label: intl.get(`${intlPrefix}.vmiWarehouseName`).d('VMI仓库'),
    },
    {
      name: 'createdByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
    },
    {
      name: 'creationDate',
      type: 'string',
      label: intl.get(`${commonPrefix}.creationDate`).d('创建日期'),
    },
    {
      name: 'submitDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.submitDate`).d('提交日期'),
    },
    {
      name: 'approvalByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.approvalByName`).d('审核人'),
    },
    {
      name: 'approvalDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.approvalDate`).d('审核日期'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonPrefix}.remark`).d('备注'),
    },
    {
      name: 'approvalOpinion',
      type: 'string',
      label: intl.get(`${intlPrefix}.approvalOpinion`).d('审批意见'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { vmiApplyStatus: statusList } = data;
      return {
        url: generateUrlWithGetParam(`${HLOS_ZCOM}/v1/${organizationId}/vmi-applys`, {
          statusList,
        }),
        data: {
          ...data,
          creationDateStart: data.creationDateStart
            ? data.creationDateStart.concat(' 00:00:00')
            : null,
          creationDateEnd: data.creationDateEnd ? data.creationDateEnd.concat(' 23:59:59') : null,
          approvalDateStart: data.approvalDateStart
            ? data.approvalDateStart.concat(' 00:00:00')
            : null,
          approvalDateEnd: data.approvalDateEnd ? data.approvalDateEnd.concat(' 23:59:59') : null,
          submitDateStart: data.submitDateStart ? data.submitDateStart.concat(' 00:00:00') : null,
          submitDateEnd: data.submitDateEnd ? data.submitDateEnd.concat(' 23:59:59') : null,
          vmiApplyStatus: null,
        },
        method: 'GET',
      };
    },
  },
});

const createHeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'vmiApplyNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.vmiApplyNum`).d('VMI申请单号'),
    },
    {
      name: 'vmiMeOuObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.vmiMeOu`).d('仓储中心'),
      lovCode: common.wmOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'vmiWmOuId',
      type: 'string',
      bind: 'vmiMeOuObj.wmOuId',
    },
    {
      name: 'vmiWmOuCode',
      type: 'string',
      bind: 'vmiMeOuObj.wmOuCode',
    },
    {
      name: 'vmiWmOuName',
      type: 'string',
      bind: 'vmiMeOuObj.wmOuName',
    },
    {
      name: 'vmiMeOuId',
      type: 'string',
      bind: 'vmiMeOuObj.organizationId',
    },
    {
      name: 'vmiMeOuCode',
      type: 'string',
      bind: 'vmiMeOuObj.organizationCode',
    },
    {
      name: 'vmiMeOuName',
      type: 'string',
      bind: 'vmiMeOuObj.organizationName',
    },
    {
      name: 'vmiWarehouseObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.vmiWarehouse`).d('VMI仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      required: true,
    },
    {
      name: 'vmiWarehouseId',
      type: 'string',
      bind: 'vmiWarehouseObj.warehouseId',
    },
    {
      name: 'vmiWarehouseCode',
      type: 'string',
      bind: 'vmiWarehouseObj.warehouseCode',
    },
    {
      name: 'vmiWarehouseName',
      type: 'string',
      bind: 'vmiWarehouseObj.warehouseName',
    },
    {
      name: 'vmiApplyStatus',
      type: 'string',
      lookupCode: vmiMaterialsApply.vmiApplyStatus,
      label: intl.get(`${intlPrefix}.vmiApplyStatus`).d('VMI申请单状态'),
    },
    {
      name: 'creationDate',
      type: 'date',
      label: intl.get(`${commonPrefix}.creationDate`).d('创建日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'createdByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.customer`).d('客户'),
      lovCode: common.customer,
      ignore: 'always',
      required: true,
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
      name: 'approvalOpinion',
      type: 'string',
      label: intl.get(`${commonPrefix}.approvalOpinion`).d('审批意见'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonPrefix}.remark`).d('备注'),
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${commonPrefix}.fileUrl`).d('附件'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { vmiApplyId } = data;
      return {
        data: {
          ...data,
          vmiApplyId: undefined,
        },
        url: `${HLOS_ZCOM}/v1/${organizationId}/vmi-applys/${vmiApplyId}`,
        method: 'GET',
      };
    },
  },
});

const createLineDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'vmiApplyLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.vmiApplyLineNum`).d('VMI申请单行'),
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      lovCode: vmiMaterialsApply.item,
      ignore: 'always',
      required: true,
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
      name: 'uomId',
      type: 'string',
      bind: 'itemObj.uomId',
    },
    {
      name: 'uom',
      type: 'string',
      bind: 'itemObj.uom',
    },
    {
      name: 'itemDescription',
      type: 'string',
      bind: 'itemObj.description',
      label: intl.get(`${intlPrefix}.itemDescription`).d('物料描述'),
    },
    {
      name: 'applyQty',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.applyQty`).d('申请数量'),
      required: true,
    },
    {
      name: 'uomName',
      type: 'string',
      bind: 'itemObj.uomName',
      label: intl.get(`${intlPrefix}.uomName`).d('物料单位'),
    },
    {
      name: 'receiveWarehouseObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.receiveWarehouse`).d('接收仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      required: true,
    },
    {
      name: 'receiveWarehouseId',
      type: 'string',
      bind: 'receiveWarehouseObj.warehouseId',
    },
    {
      name: 'receiveWarehouseCode',
      type: 'string',
      bind: 'receiveWarehouseObj.warehouseCode',
    },
    {
      name: 'receiveWarehouseName',
      type: 'string',
      bind: 'receiveWarehouseObj.warehouseName',
    },
    {
      name: 'applyDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.applyDate`).d('申请到货日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${intlPrefix}.lineRemark`).d('行备注'),
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url: `${HLOS_ZCOM}/v1/${organizationId}/vmi-apply-lines`,
        method: 'GET',
      };
    },
  },
});

const detailHeadDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'vmiApplyNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.vmiApplyNum`).d('VMI申请单号'),
    },
    {
      name: 'vmiMeOuObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.vmiMeOu`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'vmiMeOuId',
      type: 'string',
      bind: 'vmiMeOuObj.meOuId',
    },
    {
      name: 'vmiMeOuCode',
      type: 'string',
      bind: 'vmiMeOuObj.meOuCode',
    },
    {
      name: 'vmiMeOuName',
      type: 'string',
      bind: 'vmiMeOuObj.meOuName',
    },
    {
      name: 'customerObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.customer`).d('客户'),
      lovCode: common.customer,
      ignore: 'always',
      required: true,
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
      name: 'vmiWarehouseObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.vmiWarehouse`).d('VMI仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      required: true,
    },
    {
      name: 'vmiWarehouseId',
      type: 'string',
      bind: 'vmiWarehouseObj.warehouseId',
    },
    {
      name: 'vmiWarehouseCode',
      type: 'string',
      bind: 'vmiWarehouseObj.warehouseCode',
    },
    {
      name: 'vmiWarehouseName',
      type: 'string',
      bind: 'vmiWarehouseObj.warehouseName',
    },
    {
      name: 'vmiApplyStatus',
      type: 'string',
      lookupCode: vmiMaterialsApply.vmiApplyStatus,
      label: intl.get(`${intlPrefix}.vmiApplyStatus`).d('VMI申请单状态'),
    },
    {
      name: 'creationDate',
      type: 'date',
      label: intl.get(`${commonPrefix}.creationDate`).d('创建日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'createdByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.createdByName`).d('创建人'),
    },
    {
      name: 'approvalDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.approvalDate`).d('审核日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'approvalByName',
      type: 'string',
      label: intl.get(`${intlPrefix}.approvalByName`).d('审核人'),
    },
    {
      name: 'submitDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.submitDate`).d('提交日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'approvalOpinion',
      type: 'string',
      label: intl.get(`${commonPrefix}.approvalOpinion`).d('审批意见'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonPrefix}.remark`).d('备注'),
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${commonPrefix}.fileUrl`).d('附件'),
    },
  ],
  transport: {
    read: ({ data }) => {
      const { vmiApplyId } = data;
      return {
        data: {
          ...data,
          vmiApplyId: undefined,
        },
        url: `${HLOS_ZCOM}/v1/${organizationId}/vmi-applys/${vmiApplyId}`,
        method: 'GET',
      };
    },
  },
});

const detailLineDS = (showSelect) => ({
  autoQuery: false,
  selection: showSelect ? 'multiple' : false,
  fields: [
    {
      name: 'vmiApplyLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.vmiApplyLineNum`).d('VMI申请单行'),
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
      lovCode: vmiMaterialsApply.item,
      ignore: 'always',
      required: true,
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
      name: 'uomId',
      type: 'string',
      bind: 'itemObj.uomId',
    },
    {
      name: 'uom',
      type: 'string',
      bind: 'itemObj.uom',
    },
    {
      name: 'itemDescription',
      type: 'string',
      bind: 'itemObj.description',
      label: intl.get(`${intlPrefix}.itemDescription`).d('物料描述'),
    },
    {
      name: 'applyQty',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.applyQty`).d('申请数量'),
      required: true,
    },
    {
      name: 'applyDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.applyDate`).d('申请到货日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
    },
    {
      name: 'uomName',
      type: 'string',
      bind: 'itemObj.uomName',
      label: intl.get(`${intlPrefix}.uomName`).d('物料单位'),
    },
    {
      name: 'promiseQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.promiseQty`).d('审批实发数量'),
    },
    {
      name: 'promiseDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.promiseDate`).d('审批实发日期'),
    },
    {
      name: 'totalReceivedQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.totalReceivedQty`).d('累计接收数量'),
    },
    {
      name: 'receiveWarehouseObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.receiveWarehouse`).d('VMI接收仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      required: true,
    },
    {
      name: 'receiveWarehouseId',
      type: 'string',
      bind: 'receiveWarehouseObj.warehouseId',
    },
    {
      name: 'receiveWarehouseCode',
      type: 'string',
      bind: 'receiveWarehouseObj.warehouseCode',
    },
    {
      name: 'receiveWarehouseName',
      type: 'string',
      bind: 'receiveWarehouseObj.warehouseName',
    },
    {
      name: 'executeQty',
      type: 'number',
      min: 0,
      label: intl.get(`${intlPrefix}.executeQty`).d('本次接收数量'),
      required: true,
    },
    {
      name: 'executeDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.executeDate`).d('本次接收日期'),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      required: true,
    },
    {
      name: 'executeWorker',
      type: 'string',
      label: intl.get(`${intlPrefix}.executeWorker`).d('接收人'),
      required: true,
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.lotNumber`).d('批次'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.tagCode`).d('序列号'),
    },
    {
      name: 'lineRemark',
      type: 'string',
      label: intl.get(`${intlPrefix}.lineRemark`).d('行备注'),
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url: `${HLOS_ZCOM}/v1/${organizationId}/vmi-apply-lines`,
        method: 'GET',
      };
    },
  },
});

const detailReceivedListDS = () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'vmiApplyLineNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.vmiApplyLineNum`).d('VMI申请单行'),
    },
    {
      name: 'vmiApplyExecuteNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.vmiApplyExecuteNum`).d('接收执行编号'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemCode`).d('物料编码'),
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemDescription`).d('物料描述'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.uomName`).d('物料单位'),
    },
    {
      name: 'executeWarehouseName',
      type: 'string',
      label: intl.get(`${intlPrefix}.executeWarehouseName`).d('VMI接收仓库'),
    },
    {
      name: 'executeQty',
      type: 'string',
      label: intl.get(`${intlPrefix}.executeQty`).d('接收数量'),
    },
    {
      name: 'executeDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.executeDate`).d('接收日期'),
    },
    {
      name: 'executeWorker',
      type: 'string',
      label: intl.get(`${intlPrefix}.executeWorker`).d('接收人'),
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.lotNumber`).d('批次'),
    },
    {
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.tagCode`).d('序列号'),
    },
    {
      name: 'executeRemark',
      type: 'string',
      label: intl.get(`${intlPrefix}.lineRemark`).d('本次接收备注'),
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url: `${HLOS_ZCOM}/v1/${organizationId}/vmi-apply-executes`,
        method: 'GET',
      };
    },
  },
});

export {
  applyListDS,
  createHeadDS,
  createLineDS,
  detailHeadDS,
  detailLineDS,
  detailReceivedListDS,
};
