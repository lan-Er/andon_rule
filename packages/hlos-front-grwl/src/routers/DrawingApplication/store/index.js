/*
 * @module: 图纸申请
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-29 16:41:40
 * @LastEditTime: 2021-05-11 17:01:01
 * @copyright: Copyright (c) 2020,Hand
 */
import codeList, { myModule } from '@/common/index';
import lovCodeConfig from '@/common/codeConfig';

import { getCurrentOrganizationId } from 'utils/utils';

const {
  code: { common },
} = lovCodeConfig;
export default () => {
  return {
    queryFields: [
      {
        name: 'itemObject',
        type: 'object',
        label: '物料',
        lovCode: codeList.item,
        ignore: 'always',
      },
      {
        name: 'itemId',
        bind: 'itemObject.itemId',
      },
      { name: 'designCode', type: 'string', label: '产品图纸编号' },
      { name: 'applyFlag', type: 'type', label: '是否申请', lookupCode: codeList.flagInt },
      {
        name: 'workerObj',
        type: 'object',
        label: '申请人',
        lovCode: common.worker,
        ignore: 'always',
      },
      {
        name: 'workerId',
        bind: 'workerObj.workerId',
      },
      { name: 'applyTimeStart', type: 'date', label: '申请时间>=' },
      { name: 'applyTimeEnd', type: 'date', label: '申请时间<=' },
    ],
    transport: {
      read: () => {
        return {
          url: `${myModule.lmdss}/v1/${getCurrentOrganizationId()}/grwl-item-drawings/items`,
          method: 'GET',
        };
      },
    },
  };
};
