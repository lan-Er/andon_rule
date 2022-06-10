/*
 * @module: 其他出入库平台DS
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-05-07 14:31:06
 * @LastEditTime: 2021-05-07 14:31:06
 * @copyright: Copyright (c) 2021,Hand
 */
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

import codeConfig from '@/common/codeConfig';

const { common, outInInventoryPlatform } = codeConfig.code;
const intlPrefix = 'lwms.otherOutInInventoryPlatform.model';

const otherOutInInventoryPlatformDS = () => ({
  queryFields: [
    {
      name: 'requestNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.org`).d('单据编号'),
    },
    {
      name: 'documentType',
      type: 'string',
      label: intl.get(`${intlPrefix}.documentType`).d('单据类型'),
      lookupCode: outInInventoryPlatform.documentType,
    },
    {
      name: 'creatorObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.worker`).d('创建人'),
      lovCode: common.worker,
    },
    {
      name: 'creator',
      type: 'string',
      bind: 'creatorObj.workerId',
    },
    {
      name: 'creatorCode',
      type: 'string',
      bind: 'creatorObj.workerCode',
    },
    {
      name: 'creatorName',
      type: 'string',
      bind: 'creatorObj.workerName',
      ignore: 'always',
    },
    {
      name: 'excutorObj',
      type: 'object',
      noCache: true,
      ignore: 'always',
      label: intl.get(`${intlPrefix}.worker`).d('执行人'),
      lovCode: common.worker,
    },
    {
      name: 'excutor',
      type: 'string',
      bind: 'excutorObj.workerId',
    },
    {
      name: 'excutorCode',
      type: 'string',
      bind: 'excutorObj.workerCode',
    },
    {
      name: 'excutorName',
      type: 'string',
      bind: 'excutorObj.workerName',
      ignore: 'always',
    },
    {
      name: 'startCreateTime',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.startTime`).d('创建时间从'),
      format: DEFAULT_DATE_FORMAT,
      dynamicProps: {
        max: ({ record }) => {
          if (record.get('endCreateTime')) {
            return 'endCreateTime';
          }
        },
      },
    },
    {
      name: 'endCreateTime',
      type: 'dateTime',
      label: intl.get(`${intlPrefix}.endTime`).d('创建时间至'),
      format: DEFAULT_DATE_FORMAT,
      dynamicProps: {
        min: ({ record }) => {
          if (record.get('startCreateTime')) {
            return 'startCreateTime';
          }
        },
      },
    },
  ],
});

export { otherOutInInventoryPlatformDS };
