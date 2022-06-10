/**
 * @Description: 不合格品处理--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-06 10:28:08
 * @LastEditors: yu.na
 */
import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
// import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesNonConformingProcessing } = codeConfig.code;

const preCode = 'lmes.nonconformingProcessing.model';
const commonCode = 'lmes.common.model';
const organizationId = getCurrentOrganizationId();

const HeaderDS = () => ({
  selection: false,
  autoCreate: true,
  primaryKey: 'inspectionDocId',
  queryFields: [
    {
      name: 'organizationId',
    },
    {
      name: 'poObj',
      type: 'object',
      label: intl.get(`${preCode}.document`).d('采购单号'),
      lovCode: common.po,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'poId',
      bind: 'poObj.poId',
      ignore: 'always',
    },
    {
      name: 'relatedDocNum',
      bind: 'poObj.poNum',
    },
    {
      name: 'inspectionDocumentObj',
      type: 'object',
      label: intl.get(`${preCode}.inspectionDocument`).d('检验单号'),
      lovCode: lmesNonConformingProcessing.inspectionNum,
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
  ],
  transport: {
    read: ({ data }) => ({
      url: `/lmess/v1/${organizationId}/raumplus/inspection-docs/inspectionDoc`,
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

const LeftTableDS = () => ({
  paging: false,
  selection: false,
  children: {
    detailLine: new DataSet(RightTableDS()),
  },
  transport: {
    read: () => {
      return {
        // url: `${HLOS_LMES}/v1/${organizationId}/inspection-doc-lots/getInspectionDocLot`,
        url: `/lmess/v1/${organizationId}/raumplus/inspection-doc-lots/get-ng-inspection-doc-lot`,
        method: 'POST',
      };
    },
  },
  fields: [
    {
      name: 'lotOrTag',
      type: 'string',
      label: intl.get(`${preCode}.lotOrTag`).d('批次/标签号'),
    },
    {
      name: 'qcNgQty',
      type: 'string',
      label: intl.get(`${preCode}.ngQty`).d('不合格品数量'),
    },
  ],
});

const RightTableDS = () => ({
  paging: false,
  selection: 'multiple',
  fields: [
    {
      name: 'exceptionObj',
      type: 'object',
      label: intl.get(`${preCode}.exceptionDesc`).d('异常描述'),
      lovCode: lmesNonConformingProcessing.exception,
      ignore: 'always',
      noCache: true,
      required: true,
    },
    {
      name: 'exceptionId',
      type: 'string',
      bind: 'exceptionObj.exceptionId',
    },
    {
      name: 'exceptionCode',
      type: 'string',
      bind: 'exceptionObj.exceptionCode',
    },
    // {
    //   name: 'exceptionGroupId',
    //   type: 'string',
    //   bind: 'exceptionObj.exceptionClass',
    // },
    {
      name: 'exceptionName',
      type: 'string',
      bind: 'exceptionObj.exceptionName',
    },
    {
      name: 'delayWay',
      type: 'string',
      label: intl.get(`${preCode}.delayWay`).d('处理方式'),
      lookupCode: lmesNonConformingProcessing.delayWay,
      required: true,
    },
    {
      name: 'delayQty',
      type: 'number',
      label: intl.get(`${preCode}.delayQty`).d('处理数量'),
      required: true,
      min: 0,
      step: 1,
    },
    {
      name: 'exceptionPictures',
      type: 'url',
      multiple: true,
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${preCode}.remark`).d('备注'),
    },
  ],
});

export { HeaderDS, ProcessorDS, LeftTableDS };
