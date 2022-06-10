/*
 * @Description: 构件工艺 BOM DS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-30 10:33:00
 * @LastEditors: 赵敏捷
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const intlPrefix = 'lmes.componentTechnologyBOM.model';
const organizationId = getCurrentOrganizationId();
const queryUrl = `${HLOS_LMDS}/v1/${organizationId}/import-tmps`;

export const componentTechnologyBOMDS = () => ({
  autoQuery: true,
  selection: false,
  fields: [
    {
      name: 'seqNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.seqNum`).d('序号'),
    },
    {
      name: 'projectNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.projectNum`).d('工程代号'),
    },
    {
      name: 'wbsNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.wbsNum`).d('子项名称'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemCode`).d('构件号'),
    },
    {
      name: 'itemType',
      type: 'string',
      label: intl.get(`${intlPrefix}.itemType`).d('构件类型'),
    },
    {
      name: 'quantity',
      type: 'string',
      label: intl.get(`${intlPrefix}.quantity`).d('数量'),
    },
    {
      name: 'workerGroup',
      type: 'string',
      label: intl.get(`${intlPrefix}.workerGroup`).d('班组'),
    },
    {
      name: 'operationOne',
      type: 'string',
      label: intl.get(`${intlPrefix}.operationOne`).d('工序一'),
    },
    {
      name: 'operationTwo',
      type: 'string',
      label: intl.get(`${intlPrefix}.operationTwo`).d('工序二'),
    },
    {
      name: 'operationThree',
      type: 'string',
      label: intl.get(`${intlPrefix}.operationThree`).d('工序三'),
    },
    {
      name: 'operationFour',
      type: 'string',
      label: intl.get(`${intlPrefix}.operationFour`).d('工序四'),
    },
    {
      name: 'operationFive',
      type: 'string',
      label: intl.get(`${intlPrefix}.operationFive`).d('工序五'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${intlPrefix}.remark`).d('备注'),
    },
  ],
  transport: {
    read: () => ({
      url: queryUrl,
      method: 'get',
    }),
  },
});
