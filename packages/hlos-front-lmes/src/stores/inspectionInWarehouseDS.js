/**
 * @Description: 在库检报检--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-17 09:55:08
 * @LastEditors: yu.na
 */

import moment from 'moment';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';

const { common, lmesInspectionInWarehouse } = codeConfig.code;
const preCode = 'lmes.inspectionInWarehouse.model';
const organizationId = getCurrentOrganizationId();

const ListDS = () => ({
  selection: 'multiple',
  transport: {
    read: ({ data }) => {
      const { warehouseId: warehouseIdList } = data;
      return {
        url: generateUrlWithGetParam(
          `${HLOS_LWMS}/v1/${organizationId}/tags/inspection-in-warehouse`,
          {
            warehouseIdList,
          }
        ),
        data: {
          ...data,
          warehouseId: undefined,
        },
        method: 'GET',
      };
    },
  },
  queryFields: [
    {
      name: 'queryDimension',
      type: 'string',
      label: intl.get(`${preCode}.queryDimension`).d('查询维度'),
      lookupCode: lmesInspectionInWarehouse.queryDimension,
      required: true,
      defaultValue: 'TAG',
    },
    {
      name: 'workerObj',
      type: 'object',
      lovCode: common.worker,
      label: intl.get(`${preCode}.inspector`).d('报检人'),
      ignore: 'always',
      noCache: true,
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'declarerId',
      type: 'string',
      bind: 'workerObj.workerId',
    },
    {
      name: 'declarer',
      type: 'string',
      bind: 'workerObj.workerCode',
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${preCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      noCache: true,
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
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.warehouse`).d('仓库'),
      lovCode: common.warehouse,
      ignore: 'always',
      noCache: true,
      required: true,
      multiple: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'warehouseId',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'wmAreaObj',
      type: 'object',
      label: intl.get(`${preCode}.wmArea`).d('货位'),
      lovCode: common.wmArea,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          warehouseId: record.get('warehouseId'),
        }),
      },
    },
    {
      name: 'wmAreaId',
      type: 'string',
      bind: 'wmAreaObj.wmAreaId',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
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
      name: 'tagObj',
      type: 'object',
      label: intl.get(`${preCode}.tag`).d('标签'),
      lovCode: common.tag,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'tagId',
      type: 'string',
      bind: 'tagObj.tagId',
    },
    {
      name: 'tagCode',
      type: 'string',
      bind: 'tagObj.tagCode',
    },
    {
      name: 'lotObj',
      type: 'object',
      label: intl.get(`${preCode}.lot`).d('批次'),
      lovCode: common.lot,
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'lotNumber',
      type: 'string',
      bind: 'lotObj.lotNumber',
    },
    {
      name: 'lotId',
      type: 'string',
      bind: 'lotObj.lotId',
    },
    {
      name: 'documentObj',
      type: 'object',
      lovCode: common.document,
      label: '来源单据号',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
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
      lovCode: common.documentLine,
      label: '关联单据行号',
      cascadeMap: { documentId: 'documentId' },
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
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
      lovCode: common.supplier,
      noCache: true,
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.partyId',
    },
    {
      name: 'lotStatus',
      type: 'string',
      label: intl.get(`${preCode}.lotStatus`).d('批次状态'),
      lookupCode: lmesInspectionInWarehouse.lotStatus,
    },
    {
      name: 'receivedDateStart',
      type: 'date',
      label: intl.get(`${preCode}.receivedDateStart`).d('接收日期>='),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('receivedDateEnd')) {
            return 'receivedDateEnd';
          }
        },
      },
    },
    {
      name: 'receivedDateEnd',
      type: 'date',
      label: intl.get(`${preCode}.receivedDateEnd`).d('接收日期<='),
      min: 'receivedDateStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'madeDateStart',
      type: 'date',
      label: intl.get(`${preCode}.madeDateStart`).d('生产日期>='),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('madeDateEnd')) {
            return 'madeDateEnd';
          }
        },
      },
    },
    {
      name: 'madeDateEnd',
      type: 'date',
      label: intl.get(`${preCode}.madeDateEnd`).d('生产日期<='),
      min: 'madeDateStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'expireDateStart',
      type: 'date',
      label: intl.get(`${preCode}.expireDateStart`).d('失效日期>='),
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('expireDateEnd')) {
            return 'expireDateEnd';
          }
        },
      },
    },
    {
      name: 'expireDateEnd',
      type: 'date',
      label: intl.get(`${preCode}.expireDateEnd`).d('失效日期<='),
      min: 'expireDateStart',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ],
  fields: [
    {
      name: 'organization',
      type: 'string',
      label: intl.get(`${preCode}.org`).d('组织'),
    },
    {
      name: 'warehouse',
      type: 'string',
      label: intl.get(`${preCode}.warehouse`).d('仓库'),
    },
    {
      name: 'wmArea',
      type: 'string',
      label: intl.get(`${preCode}.wmArea`).d('货位'),
    },
    {
      name: 'wmUnitCode',
      type: 'string',
      label: intl.get(`${preCode}.wmUnit`).d('货格'),
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
      name: 'tagCode',
      type: 'string',
      label: intl.get(`${preCode}.tag`).d('标签'),
    },
    {
      name: 'lotNumber',
      type: 'string',
      label: intl.get(`${preCode}.lot`).d('批次'),
    },
    {
      name: 'documentId',
      type: 'string',
    },
    {
      name: 'documentNum',
      type: 'string',
      label: intl.get(`${preCode}.documentNum`).d('来源单据号'),
    },
    {
      name: 'documentTypeId',
      type: 'string',
    },
    {
      name: 'documentTypeCode',
      type: 'string',
    },
    {
      name: 'documentLineId',
      type: 'string',
    },
    {
      name: 'documentLineNum',
      type: 'string',
      label: intl.get(`${preCode}.documentLineNum`).d('来源单据行号'),
    },
    {
      name: 'quantity',
      type: 'string',
      label: intl.get(`${preCode}.quantity`).d('数量'),
    },
    {
      name: 'uomName',
      type: 'string',
      label: intl.get(`${preCode}.uom`).d('单位'),
    },
    {
      name: 'batchQty',
      type: 'number',
      label: intl.get(`${preCode}.inspectionQty`).d('报检数量'),
      required: true,
      transformResponse: (val, object) => object.quantity,
    },
    {
      name: 'samplingType',
      type: 'string',
      label: intl.get(`${preCode}.samplingType`).d('抽样类型'),
      lookupCode: lmesInspectionInWarehouse.samplingType,
    },
    {
      name: 'sampleQty',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'inspectionTemplateType',
      type: 'string',
      label: intl.get(`${preCode}.inspectionTemplate`).d('质检模板'),
      lookupCode: lmesInspectionInWarehouse.inspectionTemplateType,
    },
    {
      name: 'receivedDate',
      type: 'date',
      label: intl.get(`${preCode}.receiveDate`).d('接收日期'),
    },
    {
      name: 'madeDate',
      type: 'date',
      label: intl.get(`${preCode}.madeDate`).d('生产日期'),
    },
    {
      name: 'expireDate',
      type: 'date',
      label: intl.get(`${preCode}.expireDate`).d('失效日期'),
    },
    {
      name: 'lotStatus',
      type: 'string',
      label: intl.get(`${preCode}.lotStatus`).d('批次状态'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${preCode}.supplier`).d('供应商'),
    },
    {
      name: 'supplierLotNumber',
      type: 'string',
      label: intl.get(`${preCode}.supplierLotNumber`).d('供应商批次'),
    },
    {
      name: 'materialSupplier',
      type: 'string',
      label: intl.get(`${preCode}.materialSupplier`).d('材料供应商'),
    },
    {
      name: 'manufacturer',
      type: 'string',
      label: intl.get(`${preCode}.manufacturer`).d('制造商'),
    },
  ],
});

export { ListDS };
