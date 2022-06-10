/**
 * @Description: 不合格品处理--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-06 10:28:08
 * @LastEditors: yu.na
 */

import moment from 'moment';
import intl from 'utils/intl';
import { getCurrentOrganizationId, generateUrlWithGetParam, isTenantRoleLevel } from 'utils/utils';
import { getEnvConfig } from 'utils/iocUtils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { HLOS_LMES, HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesNonConformingProcessing } = codeConfig.code;

const preCode = 'lmes.nonconformingProcessing.model';
const commonCode = 'lmes.common.model';
const organizationId = getCurrentOrganizationId();
const HeaderDS = () => ({
  selection: false,
  autoCreate: true,
  queryFields: [
    {
      name: 'organizationId',
    },
    {
      name: 'documentTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.documentType`).d('单据类型'),
      lovCode: lmesNonConformingProcessing.documentType,
      ignore: 'always',
      // required: true,
      dynamicProps: {
        lovQueryAxiosConfig: () => {
          const { API_HOST } = getEnvConfig();
          const url = `${API_HOST}${HLOS_LMDS}/v1/${
            isTenantRoleLevel() ? `${getCurrentOrganizationId()}/` : ''
          }document-types/query-document-type-lov?lovCode=${
            lmesNonConformingProcessing.documentType
          }`;
          return {
            url: generateUrlWithGetParam(url, {
              documentClassList: ['TASK', 'WM_DELIVERY', 'MES.INSPECTION'],
            }),
            method: 'GET',
          };
        },
      },
    },
    {
      name: 'sourceDocTypeId',
      bind: 'documentTypeObj.documentTypeId',
    },
    {
      name: 'sourceDocTypeCode',
      bind: 'documentTypeObj.documentTypeCode',
      ignore: 'always',
    },
    {
      name: 'sourceDocTypeName',
      bind: 'documentTypeObj.documentTypeName',
      ignore: 'always',
    },
    {
      name: 'documentObj',
      type: 'object',
      label: intl.get(`${preCode}.document`).d('单据号'),
      lovCode: common.document,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          sourceDocTypeId: record.get('sourceDocTypeId'),
        }),
      },
    },
    {
      name: 'sourceDocId',
      bind: 'documentObj.documentId',
    },
    {
      name: 'sourceDocNum',
      bind: 'documentObj.documentNum',
    },
    {
      name: 'inspectionDocumentObj',
      type: 'object',
      label: intl.get(`${preCode}.inspectionDocument`).d('检验单号'),
      lovCode: common.inspectionNum,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
      ignore: 'always',
    },
    {
      name: 'inspectionDocId',
      bind: 'inspectionDocumentObj.inspectionDocId',
    },
    {
      name: 'inspectionDocNum',
      bind: 'inspectionDocumentObj.inspectionDocNum',
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
      name: 'declarerObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${preCode}.declarer`).d('报检人'),
      lovCode: common.worker,
      ignore: 'always',
    },
    {
      name: 'declarerId',
      bind: 'declarerObj.workerId',
    },
    {
      name: 'declarer',
      bind: 'declarerObj.workerCode',
    },
    {
      name: 'declarerName',
      bind: 'declarerObj.workerName',
      ignore: 'always',
    },
    {
      name: 'createDateMin',
      type: 'date',
      range: ['start', 'end'],
      // label: intl.get(`${preCode}.inspectionDate`).d('报检时间'),
      // dynamicProps: {
      //   max: ({ record }) => {
      //     if (record.get('createDateMax')) {
      //       return 'createDateMax';
      //     }
      //   },
      // },
      transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'createDateMax',
      type: 'date',
      label: intl.get(`${preCode}.inspectionDate`).d('报检时间<='),
      bind: 'createDateMin.end',
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
    },
    {
      name: 'itemCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.category`).d('物料类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: 'ITEM_WM' },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'itemCategoryId',
      bind: 'itemCategoryObj.categoryId',
    },
    {
      name: 'itemCategoryName',
      bind: 'itemCategoryObj.categoryName',
      ignore: 'always',
    },
    {
      name: 'supplierCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.supplierCategory`).d('供应商类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: 'SUPPLIER' },
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'supplierCategoryId',
      bind: 'supplierCategoryObj.categoryId',
    },
    {
      name: 'supplierCategoryName',
      bind: 'supplierCategoryObj.categoryName',
      ignore: 'always',
    },
    {
      name: 'inspectionTemplateTypeList',
      type: 'string',
      label: intl.get(`${preCode}.inspectionType`).d('检验类型'),
      lookupCode: lmesNonConformingProcessing.inspectionType,
    },
    {
      name: 'relatedDocObj',
      type: 'object',
      label: intl.get(`${preCode}.relatedDocId`).d('关联单据'),
      lovCode: lmesNonConformingProcessing.document,
      ignore: 'always',
      noCache: true,
    },
    {
      name: 'relatedDocId',
      bind: 'relatedDocObj.documentId',
    },
    {
      name: 'relatedDocNum',
      bind: 'relatedDocObj.documentNum',
      ignore: 'always',
    },
  ],
  fields: [
    {
      name: 'inspectionDocId',
      label: intl.get(`${preCode}.inspectionDocId`).d('检验单ID'),
    },
    {
      name: 'inspectionDocNum',
      label: intl.get(`${preCode}.inspectionDocNum`).d('检验单号'),
    },
    {
      name: 'sampleQty',
      label: intl.get(`${preCode}.sampleQty`).d('样品数量'),
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
      name: 'itemCode',
      label: intl.get(`${preCode}.itemCode`).d('物料编码'),
    },
    {
      name: 'itemDescription',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'sourceDocNum',
      label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
    },
    {
      name: 'declarer',
      label: intl.get(`${preCode}.declarer`).d('报检人'),
    },
    {
      name: 'creationDate',
      label: intl.get(`${preCode}.creationDate`).d('报检时间'),
    },
    {
      name: 'inspector',
      label: intl.get(`${preCode}.inspector`).d('判定人'),
    },
    {
      name: 'judgedDate',
      label: intl.get(`${preCode}.judgedDate`).d('判定时间'),
    },
    {
      name: 'concessionQty',
      type: 'number',
      label: intl.get(`${preCode}.concessionQty`).d('让步接收数量'),
      min: 0,
      step: 1,
    },
    {
      name: 'returnedQty',
      type: 'number',
      label: intl.get(`${preCode}.returnedQty`).d('退回数量'),
      min: 0,
      step: 1,
    },
    {
      name: 'reworkQty',
      type: 'number',
      label: intl.get(`${preCode}.reworkQty`).d('返修数量'),
      min: 0,
      step: 1,
    },
    {
      name: 'scrappedQty',
      type: 'number',
      label: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      min: 0,
      step: 1,
    },
    {
      name: 'processRemark',
      type: 'string',
      label: intl.get(`${preCode}.processRemark`).d('处理备注'),
    },
  ],
  transport: {
    read: ({ data }) => ({
      url: `${HLOS_LMES}/v1/${organizationId}/inspection-docs/inspectionDoc`,
      data: {
        ...data,
        page: -1,
        ngProcessedFlag: 0,
        qcNgQtyNotNull: 'Y',
        qcStatusList: 'COMPLETED',
        sort: 'inspectionDocNum,asc',
      },
      method: 'GET',
    }),
  },
});

const ProcessorDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
    },
    {
      name: 'processorObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${preCode}.processor`).d('处理人'),
      lovCode: common.worker,
      dynamicProps: {
        lovPara: ({ record }) => ({
          workerType: 'PRIN',
          organizationId: record.get('organizationId'),
        }),
      },
      // dynamicProps: {
      //   lovQueryAxiosConfig: ({ record }) => {
      //     const { API_HOST } = getEnvConfig();
      //     const url = `${API_HOST}${HLOS_LMDS}/v1/lovs/sql/data?lovCode=${common.worker}`;
      //     return {
      //       url: generateUrlWithGetParam(url, {
      //         organizationId: record.get('organizationId'),
      //         workerType: ['PROCESSOR', 'INSPECTOR'],
      //       }),
      //       method: 'GET',
      //     };
      //   },
      // },
      ignore: 'always',
      required: true,
    },
    {
      name: 'processorId',
      bind: 'processorObj.workerId',
    },
    {
      name: 'processor',
      bind: 'processorObj.workerCode',
    },
    {
      name: 'processorName',
      bind: 'processorObj.workerName',
      ignore: 'always',
    },
  ],
});

export { HeaderDS, ProcessorDS };
