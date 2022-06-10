/*
 * @Description: 副产品产出明细统计报表--ExecuteLineReport
 * @Author: 檀建军 <jianjun.tan@hand-china.com>
 * @Date: 2021-05-02 11:20:42
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

const intlPrefix = 'kmjx.executeLine';
const organizationId = getCurrentOrganizationId();

export default function executeLineDS() {
  return {
    pageSize: 100,
    autoQuery: false,
    selection: false,
    cacheSelection: true,
    autoCreate: true,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.organizationName`).d('组织'),
        lovCode: 'LMDS.SINGLE.ME_OU',
        ignore: 'always',
        noCache: true,
        required: true,
      },
      {
        name: 'organizationId',
        type: 'string',
        bind: 'organizationObj.meOuId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.meOuName',
        ignore: 'always',
      },
      {
        name: 'moObj',
        type: 'object',
        noCache: true,
        multiple: true,
        ignore: 'always',
        label: intl.get(`${intlPrefix}.mo`).d('MO'),
        lovCode: 'LMES.MO',
        dynamicProps: ({ record }) => {
          if (record.get('organizationId')) {
            return {
              lovCode: 'LMES.MO',
              lovPara: {
                organizationId: record.get('organizationId'),
              },
            };
          }
        },
      },
      {
        name: 'moNum',
        type: 'string',
        bind: 'moObj.moNum',
        ignore: 'always',
      },
      {
        name: 'moId',
        type: 'string',
        bind: 'moObj.moId',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.deviceItem`).d('装配件编码'),
        ignore: 'always',
        noCache: true,
        multiple: true,
        lovCode: 'LMDS.ITEM_ME',
        dynamicProps: ({ record }) => {
          if (record.get('organizationId')) {
            return {
              lovCode: 'LMDS.ITEM_ME',
              issueControlTypeFlag: 0,
              lovPara: {
                organizationId: record.get('organizationId'),
              },
            };
          }
        },
      },
      {
        name: 'itemId',
        bind: 'itemObj.itemId',
      },
      {
        name: 'itemCode',
        bind: 'itemObj.itemCode',
        ignore: 'always',
      },
      {
        name: 'byProductItemObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.byProductItem`).d('副产品货品'),
        lovCode: 'LMDS.ITEM_ME',
        ignore: 'always',
        noCache: true,
        multiple: true,
        dynamicProps: ({ record }) => {
          if (record.get('organizationId')) {
            return {
              lovCode: 'LMDS.ITEM_ME',
              issueControlTypeFlag: 1,
              lovPara: {
                organizationId: record.get('organizationId'),
              },
            };
          }
        },
      },
      {
        name: 'byProductItemId',
        bind: 'byProductItemObj.itemId',
      },
      {
        name: 'byProductItemCode',
        bind: 'byProductItemObj.itemCode',
        ignore: 'always',
      },
      {
        name: 'prodLineObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.prodLine`).d('工作中心'),
        ignore: 'always',
        lovCode: 'LMDS.PRODLINE',
        multiple: true,
        noCache: true,
        dynamicProps: ({ record }) => {
          if (record.get('organizationId')) {
            return {
              lovCode: 'LMDS.PRODLINE',
              lovPara: {
                organizationId: record.get('organizationId'),
              },
            };
          }
        },
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
      {
        name: 'workerObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.worker`).d('操作工'),
        ignore: 'always',
        lovCode: 'LMDS.WORKER',
        multiple: true,
        noCache: true,
        dynamicProps: ({ record }) => {
          if (record.get('organizationId')) {
            return {
              lovPara: {
                organizationId: record.get('organizationId'),
              },
            };
          }
        },
      },
      {
        name: 'workerId',
        bind: 'workerObj.workerId',
      },
      {
        name: 'workerName',
        bind: 'workerObj.workerName',
        ignore: 'always',
      },
      {
        name: 'executeTimeFrom',
        label: intl.get(`${intlPrefix}.model.executeTimeFrom`).d('入库日期从'),
        format: DEFAULT_DATE_FORMAT,
        type: 'dateTime',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
      {
        name: 'executeTimeTo',
        label: intl.get(`${intlPrefix}.model.executeTimeTo`).d('入库日期至'),
        format: DEFAULT_DATE_FORMAT,
        type: 'dateTime',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : ''),
      },
    ],
    transport: {
      read: ({ data }) => {
        const { moId, itemId, byProductItemId, prodLineId, workerId, ...other } = data;
        return {
          url: generateUrlWithGetParam(
            `/lmes/v1/${organizationId}/execute-lines/get-kmjx-by-product`,
            {
              moId,
              itemId,
              byProductItemId,
              prodLineId,
              workerId,
            }
          ),
          data: {
            ...other,
          },
          method: 'GET',
        };
      },
    },
  };
}
