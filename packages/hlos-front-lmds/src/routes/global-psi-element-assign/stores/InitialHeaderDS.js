/**
 * @Description: PSI要素初始化管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 13:54:33
 * @LastEditors: yu.na
 */

import intl from 'utils/intl';

import codeConfig from '@/common/codeConfig';

const { lmdsPsiElementAssign } = codeConfig.code;
const preCode = 'lmds.psiElementAssign.model';

export default () => ({
  fields: [
    {
      name: 'assignType',
      type: 'string',
      label: intl.get(`${preCode}.assignType`).d('分配类型'),
      lookupCode: lmdsPsiElementAssign.assignType,
      required: true,
    },
    {
      name: 'sourceObj',
      type: 'object',
      label: intl.get(`${preCode}.source`).d('来源'),
      ignore: "always",
      lovCode: lmdsPsiElementAssign.source,
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          assignType: record.get('assignType'),
        }),
      },
    },
    {
      name: 'sourceId',
      type: 'string',
      bind: 'sourceObj.sourceId',
    },
    {
      name: 'sourceName',
      type: 'string',
      bind: 'sourceObj.sourceName',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if(name === 'assignType') {
        record.set('sourceObj', null);
      }
    },
  },
});
