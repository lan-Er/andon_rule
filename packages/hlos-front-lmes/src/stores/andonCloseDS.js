/*
 * @Descripttion: 安灯触发DS
 * @Author: yu.na@hand-china.com
 * @Date: 2020-11-11 17:40:22
 */
import moment from 'moment';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const commonCode = 'lmes.common.model';
const preCode = 'lmes.andonClose.model';
const { common } = codeConfig.code;

const url = `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/andon-journals/response-close-pc`;

export const QueryDS = () => {
  return {
    autoCreate: true,
    queryFields: [
      {
        name: 'organizationId',
      },
      {
        name: 'workerObj',
        type: 'object',
        lovCode: common.worker,
        label: intl.get(`${commonCode}.worker`).d('操作工'),
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'workerId',
        bind: 'workerObj.workerId',
        ignore: 'always',
      },
      {
        name: 'workerName',
        bind: 'workerObj.workerName',
        ignore: 'always',
      },
    ],
    transport: {
      read: () => ({
        url,
        method: 'GET',
      }),
    },
  };
};

export const DetailDS = () => {
  return {
    autoCreate: true,
    queryFields: [
      {
        name: 'andonJournalId',
      },
    ],
    transport: {
      read: () => ({
        url: `${HLOS_LMES}/v1/${getCurrentOrganizationId()}/andon-journals/detail`,
        method: 'GET',
      }),
    },
  };
};

export const FilterDS = () => {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'organizationId',
        type: 'string',
      },
      {
        name: 'startTriggeredDate',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${preCode}.triggeredTime`).d('触发日期'),
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'endTriggeredDate',
        type: 'date',
        bind: 'startTriggeredDate.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'startResponsedDate',
        type: 'date',
        range: ['start', 'end'],
        label: intl.get(`${preCode}.triggeredTime`).d('响应日期'),
        transformRequest: (val) => (val ? moment(val.start).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'endResponsedDate',
        type: 'date',
        bind: 'startResponsedDate.end',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'workcellObj',
        type: 'object',
        noCache: true,
        label: intl.get(`${commonCode}.workcell`).d('工位'),
        lovCode: common.workcell,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'workcellId',
        bind: 'workcellObj.workcellId',
      },
      {
        name: 'workcellName',
        bind: 'workcellObj.workcellName',
        ignore: 'always',
      },
      {
        name: 'prodLineObj',
        type: 'object',
        label: intl.get(`${commonCode}.prodLine`).d('生产线'),
        lovCode: common.prodLine,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
        ignore: 'always',
      },
      {
        name: 'prodLineId',
        bind: 'prodLineObj.prodLineId',
      },
      {
        name: 'prodLineName',
        bind: 'prodLineObj.resourceName',
        ignore: 'always',
      },
    ],
  };
};
