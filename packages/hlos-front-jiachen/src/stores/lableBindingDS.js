/**
 * @Description: 标签绑定--DS
 * @Author: tw
 * @Date: 2021-05-11 16:28:08
 * @LastEditors: tw
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { getEnvConfig } from 'utils/iocUtils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const preCode = 'jiachen.labelBinding';
const organizationId = getCurrentOrganizationId();

const HeaderDS = () => ({
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
      // dynamicProps: {
      //   lovPara: ({ record }) => ({
      //     organizationId: record.get('organizationId'),
      //   }),
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
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.model.item`).d('物料'),
      lovCode: common.item,
      textField: 'textField',
      ignore: 'always',
      required: true,
      dynamicProps: {
        // textField: ({ dataSet, record, name }) => {
        //   if (record.textField) {
        //     return 'textField'
        //   }
        //   return 'itemCode'
        // },
        lovQueryAxiosConfig: () => {
          const { API_HOST } = getEnvConfig();
          return {
            url: `${API_HOST}${HLOS_LMDS}/v1/${organizationId}/lovs/sql/data?lovCode=${common.item}`,
            method: 'GET',
            transformResponse: (data, headers) => {
              const queryData = JSON.parse(data).content;
              const newData = [];
              queryData.forEach((i) => {
                newData.push({
                  ...i,
                  textField: i.itemCode,
                });
              });
              return {
                content: newData,
                headers,
              };
            },
          };
        },
      },
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'textField',
      type: 'string',
      bind: 'itemObj.textField',
    },
    {
      name: 'itemName',
      type: 'string',
      bind: 'itemObj.itemName',
    },
    {
      name: 'fertCode',
      type: 'string',
      label: intl.get(`${preCode}.finishCode`).d('成品码'),
    },
    {
      name: 'subCode',
      type: 'string',
      label: intl.get(`${preCode}.subCode`).d('子码'),
    },
  ],
});

export { HeaderDS };
