/**
 * @Description: 检验单平台--DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-02 19:06:22
 * @LastEditors: yu.na
 */

import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const preCode = 'hg.inspectionDoc.model';

const InspectionDocListDS = () => {
  return {
    selection: false,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${preCode}.org`).d('组织'),
        lovCode: 'LMDS.ORGANIZATION',
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
        name: 'inspectionDocObj',
        type: 'object',
        label: intl.get(`${preCode}.inspectionDocNum`).d('检验单号'),
        lovCode: 'LMES.INSPECTION_DOC_NUMBER',
        cascadeMap: { organizationId: 'organizationId' },
        ignore: 'always',
      },
      {
        name: 'inspectionDocId',
        type: 'string',
        bind: 'inspectionDocObj.inspectionDocId',
      },
      {
        name: 'inspectionDocNum',
        type: 'string',
        bind: 'inspectionDocObj.inspectionDocNum',
      },
      {
        name: 'inspectionTemplateType',
        type: 'string',
        lookupCode: 'HG.LMDS.INSPECTION_TYPE',
        label: intl.get(`${preCode}.inspectionTemplateType`).d('检验类型'),
        multiple: true,
        defaultValue: ['IQC.NORMAL', 'PQC.FINISH', 'FQC.NORMAL'],
      },
      {
        name: 'qcStatus',
        type: 'string',
        lookupCode: 'LMES.QC_STATUS',
        label: intl.get(`${preCode}.qcStatus`).d('检验单状态'),
        multiple: true,
        defaultValue: ['NEW', 'ONGOING', 'COMPLETED', 'CANCELLED'],
      },
      {
        name: 'sourceDocObj',
        type: 'object',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        lovCode: 'LMDS.DOCUMENT',
        ignore: 'always',
      },
      {
        name: 'sourceDocId',
        type: 'string',
        bind: 'sourceDocObj.documentId',
      },
      {
        name: 'sourceDocNum',
        type: 'string',
        bind: 'sourceDocObj.documentNum',
        ignore: 'always',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${preCode}.item`).d('物料'),
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
        name: 'partyObj',
        type: 'object',
        label: intl.get(`${preCode}.supplier`).d('供应商'),
        lovCode: 'LMDS.SUPPLIER',
        ignore: 'always',
      },
      {
        name: 'partyId',
        type: 'string',
        bind: 'partyObj.supplierId',
      },
      {
        name: 'partyName',
        type: 'string',
        bind: 'partyObj.supplierName',
        ignore: 'always',
      },
      {
        name: 'declarerObj',
        type: 'object',
        label: intl.get(`${preCode}.declarer`).d('报检员'),
        lovCode: 'LMDS.WORKER',
        // lovPara: { workerType: 'DECLARER' },
        ignore: 'always',
      },
      {
        name: 'declarerId',
        type: 'string',
        bind: 'declarerObj.workerId',
      },
      {
        name: 'declarerName',
        type: 'string',
        bind: 'declarerObj.workerName',
      },
      {
        name: 'createDateMin',
        type: 'date',
        label: intl.get(`${preCode}.createDateMin`).d('报检时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('createDateMax')) {
              return 'createDateMax';
            }
          },
        },
      },
      {
        name: 'createDateMax',
        type: 'date',
        label: intl.get(`${preCode}.createDateMax`).d('报检时间<='),
        min: 'createDateMin',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'judgedDateMin',
        type: 'time',
        label: intl.get(`${preCode}.judgedDateMin`).d('判定时间>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('judgedDateMax')) {
              return 'judgedDateMax';
            }
          },
        },
      },
      {
        name: 'judgedDateMax',
        type: 'time',
        label: intl.get(`${preCode}.judgedDateMax`).d('判定时间<='),
        min: 'judgedDateMin',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'operationObj',
        type: 'object',
        label: intl.get(`${preCode}.operation`).d('工序'),
        lovCode: 'LMDS.OPERATION',
        ignore: 'always',
      },
      {
        name: 'operationId',
        bind: 'operationObj.operationId',
      },

      {
        name: 'operationName',
        bind: 'operationObj.operationName',
      },
    ],
    fields: [
      {
        name: 'organization',
        label: intl.get(`${preCode}.org`).d('组织'),
      },
      {
        name: 'inspectionDocNum',
        label: intl.get(`${preCode}.inspectionDocNum`).d('检验单号'),
      },
      {
        name: 'inspectionTemplateTypeMeaning',
        label: intl.get(`${preCode}.inspectionTemplateType`).d('检验类型'),
      },
      {
        name: 'qcStatusMeaning',
        label: intl.get(`${preCode}.qcStatus`).d('状态'),
      },
      {
        name: 'party',
        label: intl.get(`${preCode}.party`).d('供应商'),
      },
      {
        name: 'operation',
        label: intl.get(`${preCode}.operation`).d('工序'),
      },
      {
        name: 'itemCode',
        label: intl.get(`${preCode}.物料`).d('物料'),
      },
      {
        name: 'description',
        label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      },
      {
        name: 'batchQty',
        label: intl.get(`${preCode}.batchQty`).d('批次数量'),
      },
      {
        name: 'qcOkQty',
        label: intl.get(`${preCode}.qcOkQty`).d('合格接收'),
      },
      {
        name: 'concessionQty',
        label: intl.get(`${preCode}.concessionQty`).d('让步接收'),
      },
      {
        name: 'returnedQty',
        label: intl.get(`${preCode}.returnedQty`).d('退回数量'),
      },
      {
        name: 'declarer',
        label: intl.get(`${preCode}.declarer`).d('报检员'),
      },
      {
        name: 'startDate',
        label: intl.get(`${preCode}.startDate`).d('开始判定时间'),
      },
      {
        name: 'judgedDate',
        label: intl.get(`${preCode}.judgedDate`).d('判定时间'),
      },
      {
        name: 'duration',
        label: intl.get(`${preCode}.duration`).d('检验时长'),
        // transformResponse: (val, object) => {
        //   // JUDGED_DATE减去START_DATE，展示时长，格式为：“24h”，大于24h时展示格式：“*天24h”
        //   if (object.judgedDate && object.startDate) {
        //     const judgedHour = new Date(object.judgedDate).getTime() / 1000 / 60 / 60;
        //     const startHour = new Date(object.startDate).getTime() / 1000 / 60 / 60;
        //     const between = Math.floor(judgedHour - startHour);
        //     if (between > 24) {
        //       const integer = Math.floor(between / 24, 10);
        //       const remainder = between % 24;
        //       return `${integer}天${remainder}h`;
        //     } else {
        //       return `${between}h`;
        //     }
        //   }
        // },
      },
      {
        name: 'inspector',
        label: intl.get(`${preCode}.inspector`).d('判定员'),
        transformResponse: (val) => {
          if (val) {
            return val.split(',').join('、');
          }
          return '';
        },
      },
      {
        name: 'createDate',
        label: intl.get(`${preCode}.createDate`).d('报检时间'),
      },
      {
        name: 'sourceDocNum',
        label: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
      },
      {
        name: 'inspectionGroupName',
        label: intl.get(`${preCode}.inspectionGroup`).d('检验项目组'),
      },
      {
        name: 'remark',
        label: intl.get(`${preCode}.remark`).d('判定备注'),
      },
      {
        name: 'processRemark',
        label: intl.get(`${preCode}.processRemark`).d('处理备注'),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { qcStatus: qcStatusList, inspectionTemplateType: inspectionTemplateTypeList } = data;
        return {
          url: generateUrlWithGetParam(
            `${HLOS_LMES}/v1/${organizationId}/inspection-docs/hg-inspection-doc`,
            {
              qcStatusList,
              inspectionTemplateTypeList,
            }
          ),
          data: {
            ...data,
            qcStatus: undefined,
            inspectionTemplateType: undefined,
          },
          method: 'GET',
        };
      },
    },
  };
};

const InspectionDocLineDS = () => {
  return {
    selection: false,
    pageSize: 100,
    fields: [
      {
        name: 'inspectionItem',
        label: intl.get(`${preCode}.inspectionItem`).d('检验项目'),
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
        name: 'exceptionCode',
        label: intl.get(`${preCode}.exceptionCode`).d('不良原因'),
      },
      {
        name: 'exceptionQty',
        label: intl.get(`${preCode}.exceptionQty`).d('数量'),
      },
    ],
    transport: {
      read: () => {
        return {
          url: `${HLOS_LMES}/v1/${organizationId}/inspection-doc-lines/hg-inspection-doc-line`,
          method: 'GET',
        };
      },
    },
  };
};

const Store = createContext();

export default Store;

export const InspectionDocProvider = (props) => {
  const { children } = props;
  const listDS = useMemo(() => new DataSet(InspectionDocListDS()), []);
  const lineDS = useMemo(() => new DataSet(InspectionDocLineDS()), []);

  const value = {
    ...props,
    listDS,
    lineDS,
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
