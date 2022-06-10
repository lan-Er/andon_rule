/**
 * @Description: 仓库执行明细--DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-05 14:48:53
 * @LastEditors: yiping.liu
 */
import { isEmpty } from 'lodash';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_ZEXE } from 'hlos-front/lib/utils/config';

import codeConfig from '@/common/codeConfig';

const { common, zexeWarehouseExecution } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'zexe.warehouseExecution.model';
const commonCode = 'zexe.common.model';

const WarehouseExecutionDS = () => {
  return {
    selection: false,
    pageSize: 100,
    queryFields: [
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${commonCode}.supplier`).d('供应商编码'),
        lovCode: common.supplier,
        textField: 'supplierNumber',
        ignore: 'always',
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'supplierNumber',
        type: 'string',
        bind: 'supplierObj.supplierNumber',
        ignore: 'always',
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonCode}.supplierName`).d('供应商名称'),
      },
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
        lovCode: zexeWarehouseExecution.documentLine,
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
        lookupCode: zexeWarehouseExecution.executeType,
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
        type: 'date',
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
        type: 'date',
        label: intl.get(`${preCode}.executeTimeSmall`).d('执行时间<='),
        min: 'minExecutedTime',
      },
    ],
    fields: [
      {
        name: 'supplierNumber',
        type: 'string',
        label: intl.get(`${commonCode}.supplierNumber`).d('供应商编码'),
      },
      {
        name: 'supplierName',
        type: 'string',
        label: intl.get(`${commonCode}.supplierName`).d('供应商名称'),
      },
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
        lovCode: zexeWarehouseExecution.documentLine,
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
        type: 'date',
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
        name: 'eventTypeName',
        type: 'string',
        label: intl.get(`${commonCode}.eventType`).d('事件类型'),
      },
      {
        name: 'eventId',
        type: 'string',
        label: intl.get(`${commonCode}.eventID`).d('事件ID'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_ZEXE}/v1/${organizationId}/report/execute-lines`,
          method: 'GET',
        };
      },
    },
  };
};

export { WarehouseExecutionDS };
