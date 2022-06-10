/**
 * @Description: 仓库执行明细--DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-05 14:48:53
 * @LastEditors: yiping.liu
 */
import { isEmpty } from 'lodash';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

import codeConfig from '@/common/codeConfig';

const { common, lwmsWarehouseExecution } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lwms.warehouseExecution.model';
const commonCode = 'lwms.common.model';

const WarehouseExecutionDS = () => {
  return {
    selection: false,
    pageSize: 100,
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
        name: 'organizationId',
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
        name: 'documentTypeObj',
        type: 'object',
        label: intl.get(`${commonCode}.documentType`).d('单据类型'),
        lovCode: common.documentType,
        ignore: 'always',
      },
      {
        name: 'documentTypeId',
        type: 'string',
        bind: 'documentTypeObj.documentTypeId',
      },
      {
        name: 'documentTypeCode',
        type: 'string',
        bind: 'documentTypeObj.documentTypeCode',
        ignore: 'always',
      },
      {
        name: 'documentTypeName',
        type: 'string',
        bind: 'documentTypeObj.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'documentObj',
        type: 'object',
        label: intl.get(`${commonCode}.documentNum`).d('单据号'),
        lovCode: common.document,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'documentId',
        type: 'string',
        bind: 'documentObj.documentId',
      },
      {
        name: 'documentNum',
        type: 'string',
        bind: 'documentObj.documentNum',
        ignore: 'always',
      },
      {
        name: 'documentLineObj',
        type: 'object',
        label: intl.get(`${commonCode}.documentLineNum`).d('单据行号'),
        lovCode: lwmsWarehouseExecution.documentLine,
        dynamicProps: {
          lovPara: ({ record }) => ({
            documentId: record.get('documentId'),
          }),
        },
        cascadeMap: {
          documentId: 'documentId',
        },
        ignore: 'always',
      },
      {
        name: 'documentLineId',
        type: 'string',
        bind: 'documentLineObj.documentLineId',
      },
      {
        name: 'documentLineNum',
        type: 'string',
        bind: 'documentLineObj.documentLineNum',
        ignore: 'always',
      },
      {
        name: 'executeType',
        type: 'string',
        label: intl.get(`${preCode}.executeType`).d('执行类型'),
        lookupCode: lwmsWarehouseExecution.executeType,
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
        name: 'minExecutedTime',
        type: 'dateTime',
        label: intl.get(`${preCode}.executeTimeBig`).d('执行时间>='),
        dynamicProps: {
          max: ({ record }) => {
            if (!isEmpty(record.get('maxExecutedTime'))) {
              return 'maxExecutedTime';
            }
          },
        },
      },
      {
        name: 'maxExecutedTime',
        type: 'dateTime',
        label: intl.get(`${preCode}.executeTimeSmall`).d('执行时间<='),
        min: 'minExecutedTime',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${commonCode}.warehouse`).d('仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'warehouseId',
        type: 'string',
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'wmAreaObj',
        type: 'object',
        label: intl.get(`${commonCode}.wmArea`).d('货位'),
        lovCode: common.wmArea,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            warehouseId: record.get('warehouseId'),
            organizationId: record.get('organizationId'),
          }),
        },
        cascadeMap: {
          warehouseId: 'warehouseId',
        },
      },
      {
        name: 'wmAreaId',
        type: 'string',
        bind: 'wmAreaObj.wmAreaId',
      },
      {
        name: 'toWarehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.toWarehouse`).d('目标仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'toWarehouseId',
        type: 'string',
        bind: 'toWarehouseObj.warehouseId',
      },
      {
        name: 'toWmAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.wmArea`).d('目标货位'),
        lovCode: common.wmArea,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            warehouseId: record.get('toWarehouseId'),
            organizationId: record.get('organizationId'),
          }),
        },
        cascadeMap: {
          toWarehouseId: 'toWarehouseId',
        },
      },
      {
        name: 'toWmAreaId',
        type: 'string',
        bind: 'toWmAreaObj.wmAreaId',
      },
      {
        name: 'lotNumber',
        type: 'string',
        label: intl.get(`${commonCode}.lot`).d('批次'),
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${commonCode}.tag`).d('标签'),
      },
      {
        name: 'sourceDocNumObj',
        type: 'object',
        label: intl.get(`${commonCode}.sourceDocNum`).d('来源单据'),
        lovCode: common.document,
        ignore: 'always',
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'sourceDocNumObj.documentId',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'sourceDocNumObj.documentNum',
        ignore: 'always',
      },
      {
        name: 'partyObj',
        type: 'object',
        label: intl.get(`${preCode}.party`).d('商业伙伴'),
        lovCode: common.party,
        ignore: 'always',
      },
      {
        name: 'partyId',
        type: 'string',
        bind: 'partyObj.partyId',
      },
      {
        name: 'partyName',
        type: 'string',
        label: intl.get(`${preCode}.party`).d('商业伙伴'),
        bind: 'partyObj.partyName',
        ignore: 'always',
      },
    ],
    fields: [
      {
        name: 'organizationObj',
        type: 'object',
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
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'organization',
        type: 'string',
        label: intl.get(`${commonCode}.org`).d('组织'),
      },
      {
        name: 'documentTypeObj',
        type: 'object',
        label: intl.get(`${commonCode}.documentType`).d('单据类型'),
        lovCode: common.documentType,
        ignore: 'always',
      },
      {
        name: 'documentTypeId',
        type: 'string',
        bind: 'documentTypeObj.documentTypeId',
      },
      {
        name: 'documentTypeCode',
        type: 'string',
        bind: 'documentTypeObj.documentTypeCode',
      },
      {
        name: 'documentTypeName',
        type: 'string',
        bind: 'documentTypeObj.documentTypeName',
        ignore: 'always',
      },
      {
        name: 'documentObj',
        type: 'object',
        label: intl.get(`${commonCode}.documentNum`).d('单据号'),
        lovCode: common.document,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            documentTypeId:
              record.get('documentTypeObj') && record.get('documentTypeObj').documentTypeId,
          }),
        },
      },
      {
        name: 'documentId',
        type: 'string',
        bind: 'documentObj.documentId',
      },
      {
        name: 'documentNum',
        type: 'string',
        bind: 'documentObj.documentNum',
        ignore: 'always',
      },
      {
        name: 'documentLineObj',
        type: 'object',
        label: intl.get(`${commonCode}.documentLineNum`).d('单据行号'),
        lovCode: lwmsWarehouseExecution.documentLine,
        ignore: 'always',
      },
      {
        name: 'documentLineId',
        type: 'string',
        bind: 'documentLineObj.documentLineId',
      },
      {
        name: 'documentLineNum',
        type: 'string',
        bind: 'documentLineObj.documentLineNum',
        ignore: 'always',
      },
      {
        name: 'executeTypeMeaning',
        type: 'string',
        label: intl.get(`${commonCode}.executeType`).d('执行类型'),
      },
      {
        name: 'executedTime',
        type: 'dateTime',
        label: intl.get(`${preCode}.executeTime`).d('执行时间'),
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
        label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      },
      {
        name: 'uomName',
        type: 'string',
        label: intl.get(`${commonCode}.uom`).d('单位'),
      },
      {
        name: 'executedQty',
        type: 'string',
        label: intl.get(`${preCode}.executedQty`).d('执行数量'),
      },
      {
        name: 'lotNumber',
        type: 'string',
        label: intl.get(`${commonCode}.lot`).d('批次'),
      },
      {
        name: 'tagCode',
        type: 'string',
        label: intl.get(`${commonCode}.tag`).d('标签'),
      },
      {
        name: 'warehouse',
        type: 'string',
        label: intl.get(`${commonCode}.warehouse`).d('仓库'),
      },
      {
        name: 'wmArea',
        type: 'string',
        label: intl.get(`${commonCode}.wmArea`).d('货位'),
      },
      {
        name: 'wmUnit',
        type: 'string',
        label: intl.get(`${commonCode}.wmUnit`).d('货格'),
      },
      {
        name: 'workcellName',
        type: 'string',
        label: intl.get(`${preCode}.workcell`).d('工位'),
      },
      {
        name: 'locationName',
        type: 'string',
        label: intl.get(`${commonCode}.location`).d('地点'),
      },
      {
        name: 'toOrganization',
        type: 'string',
        label: intl.get(`${preCode}.toOrganization`).d('目标组织'),
      },
      {
        name: 'toOrganizationName',
        type: 'string',
      },
      {
        name: 'toWarehouse',
        type: 'string',
        label: intl.get(`${preCode}.toWarehouse`).d('目标仓库'),
      },
      {
        name: 'toWmArea',
        type: 'string',
        label: intl.get(`${preCode}.toWmArea`).d('目标货位'),
      },
      {
        name: 'toWmUnit',
        type: 'string',
        label: intl.get(`${preCode}.toWmUnit`).d('目标货格'),
      },
      {
        name: 'toWorkcellName',
        type: 'string',
        label: intl.get(`${preCode}.toWorkcell`).d('目标工位'),
      },
      {
        name: 'toLocationName',
        type: 'string',
        label: intl.get(`${preCode}.toLocation`).d('目标地点'),
      },
      {
        name: 'ownerType',
        type: 'string',
        label: intl.get(`${commonCode}.ownerType`).d('所有者类型'),
      },
      {
        name: 'ownerName',
        type: 'string',
        label: intl.get(`${commonCode}.owner`).d('所有者'),
      },
      {
        name: 'projectNum',
        type: 'string',
        label: intl.get(`${preCode}.projectNum`).d('项目号'),
      },
      {
        name: 'featureType',
        type: 'string',
        label: intl.get(`${preCode}.featureType`).d('特征值类型'),
      },
      {
        name: 'featureValue',
        type: 'string',
        label: intl.get(`${preCode}.featureValue`).d('特征值'),
      },
      {
        name: 'sourceNum',
        type: 'string',
        label: intl.get(`${preCode}.sourceNum`).d('来源编号'),
      },

      {
        name: 'partyName',
        type: 'string',
        label: intl.get(`${preCode}.party`).d('商业伙伴'),
      },
      {
        name: 'partySiteName',
        type: 'string',
        label: intl.get(`${preCode}.partySite`).d('商业伙伴地点'),
      },
      {
        name: 'sourceDocType',
        type: 'string',
        label: intl.get(`${preCode}.sourceDocTypeId`).d('来源单据类型'),
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      },
      {
        name: 'sourceDocLineNum',
        type: 'string',
        label: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
      },
      {
        name: 'secondUom',
        type: 'string',
        label: intl.get(`${preCode}.secondUom`).d('辅助单位'),
      },
      {
        name: 'secondExecutedQty',
        type: 'string',
        label: intl.get(`${preCode}.secondExecutedQty`).d('辅助执行数量'),
      },
      {
        name: 'toItemCode',
        type: 'string',
        label: intl.get(`${preCode}.toItemCode`).d('目标物料'),
      },
      {
        name: 'toItemDescription',
        type: 'string',
        label: intl.get(`${preCode}.toItemDescription`).d('目标物料描述'),
      },
      {
        name: 'workerName',
        type: 'string',
        label: intl.get(`${preCode}.worker`).d('执行员工'),
      },
      {
        name: 'resourceName',
        type: 'string',
        label: intl.get(`${commonCode}.resource`).d('资源'),
      },
      {
        name: 'costCenter',
        type: 'string',
        label: intl.get(`${preCode}.costCenter`).d('成本中心'),
      },
      {
        name: 'wmMoveType',
        type: 'string',
        label: intl.get(`${preCode}.wmMoveType`).d('移动类型'),
      },
      {
        name: 'executeReason',
        type: 'string',
        label: intl.get(`${preCode}.executeReason`).d('执行原因'),
      },
      {
        name: 'eventTypeName',
        type: 'string',
        label: intl.get(`${commonCode}.eventType`).d('事件类型'),
      },
      {
        name: 'eventId',
        type: 'string',
        label: intl.get(`${commonCode}.eventID`).d('事件ID'),
      },
      {
        name: 'eventBy',
        type: 'string',
        label: intl.get(`${preCode}.eventBy`).d('事件提交人'),
      },
      {
        name: 'pictures',
        type: 'string',
        label: intl.get(`${preCode}.pictures`).d('图片'),
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
          url: `${HLOS_LWMS}/v1/${organizationId}/execute-lines`,
          method: 'GET',
        };
      },
    },
  };
};

export { WarehouseExecutionDS };
