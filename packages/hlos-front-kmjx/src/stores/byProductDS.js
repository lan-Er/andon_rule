/*
 * @Description: 副产品报功--ByProductReportPage
 * @Author: 檀建军 <sai.tan@zone-cloud.com>
 * @Date: 2021-04-18 11:20:42
 * @LastEditors: jianjun.tan
 * @Copyright: Copyright (c) 2021, Zone
 */

import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';

const intlPrefix = 'kmjx.byProductReport';
const organizationId = getCurrentOrganizationId();
const { common, byProductReport } = codeConfig.code;

async function handleUserDSLoad({ dataSet }) {
  await dataSet.ready();
  dataSet.records.forEach((rec) => {
    if (rec.get('auditStatus') !== 'PENDING') {
      rec.selectable = false;
    }
  });
}

export const byProductDS = () => {
  return {
    selection: 'multiple',
    primaryKey: 'taskSubmitId',
    autoQuery: false,
    transport: {
      read: () => {
        return {
          url: `/lmes/v1/${organizationId}/kmjx-task-submits`,
          method: 'GET',
        };
      },
    },
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.organizationName`).d('组织'),
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
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'moObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.model.moNum`).d('生产订单号'),
        lovCode: common.mo,
        ignore: 'always',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'moId',
        type: 'string',
        bind: 'moObj.moId',
      },
      {
        name: 'prodLineObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.model.prodLine`).d('生产线'),
        lovCode: common.prodLine,
        ignore: 'always',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'prodLineId',
        type: 'string',
        bind: 'prodLineObj.prodLineId',
      },
      {
        name: 'auditStatus',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.auditStatus`).d('审核状态'),
        lookupCode: byProductReport.auditStatus,
      },

      {
        name: 'submitStatus',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.submitStatus`).d('入库状态'),
        lookupCode: byProductReport.submitStatus,
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.model.dashboard`).d('副产品'),
        lovCode: common.itemWm,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'itemId',
        type: 'string',
        bind: 'itemObj.itemId',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.model.warehouse`).d('入库仓库'),
        lovCode: common.warehouse,
        ignore: 'always',
        noCache: true,
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
        name: 'submitterObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.model.submitterName`).d('提交人'),
        lovCode: common.worker,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'submitterId',
        type: 'string',
        bind: 'submitterObj.workerId',
      },
      {
        name: 'auditorObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.model.auditorName`).d('审核人'),
        lovCode: common.worker,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'auditorId',
        type: 'string',
        bind: 'auditorObj.workerId',
      },
      {
        name: 'submitTimeFrom',
        label: intl.get(`${intlPrefix}.model.submitTimeFrom`).d('提交时间从'),
        format: DEFAULT_DATETIME_FORMAT,
        type: 'dateTime',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : ''),
      },
      {
        name: 'submitTimeTo',
        label: intl.get(`${intlPrefix}.model.submitTimeFrom`).d('提交时间至'),
        format: DEFAULT_DATETIME_FORMAT,
        type: 'dateTime',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : ''),
      },
      {
        name: 'auditTimeFrom',
        label: intl.get(`${intlPrefix}.model.auditTimeFrom`).d('审核时间从'),
        format: DEFAULT_DATETIME_FORMAT,
        type: 'dateTime',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : ''),
      },
      {
        name: 'auditTimeTo',
        label: intl.get(`${intlPrefix}.model.auditTimeTo`).d('审核时间至'),
        format: DEFAULT_DATETIME_FORMAT,
        type: 'dateTime',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : ''),
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.reason`).d('原因'),
        lookupCode: byProductReport.reason,
      },
    ],
    fields: [
      {
        name: 'organizationName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.organizationName`).d('组织'),
      },
      {
        name: 'moNum',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.moNum`).d('生产订单号'),
      },
      {
        name: 'prodLineName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.prodLineName`).d('生产线名称'),
      },
      {
        name: 'auditStatusMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.auditStatus`).d('审核状态'),
      },
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.itemCode`).d('副产品编码'),
      },
      {
        name: 'itemDescription',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.itemDescription`).d('副产品描述'),
      },
      {
        name: 'executeQty',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.executeQty`).d('入库数量'),
      },
      {
        name: 'uomName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.uomName`).d('单位'),
      },
      {
        name: 'lotNumber',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.lotNumber`).d('批次号'),
      },
      {
        name: 'warehouseCodeName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.warehouseCodeName`).d('入库仓库'),
      },
      {
        name: 'wmAreaCodeName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.wmAreaCodeName`).d('入库货位'),
      },
      {
        name: 'submitterName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.submitterName`).d('提交人'),
      },
      {
        name: 'auditorName',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.auditorName`).d('审核人'),
      },
      {
        name: 'submitTime',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.submitTime`).d('提交时间'),
      },
      {
        name: 'auditTime',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.auditTime`).d('审核时间'),
      },
      {
        name: 'remarkMeaning',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.remarkMeaning`).d('原因'),
      },
      {
        name: 'submitStatus',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.submitStatus`).d('入库状态'),
      },
      {
        name: 'submitResultError',
        type: 'string',
        label: intl.get(`${intlPrefix}.model.submitResultError`).d('失败原因'),
      },
    ],
    events: {
      load: handleUserDSLoad,
    },
  };
};
