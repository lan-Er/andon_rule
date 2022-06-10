/*
 * @Description: 安灯看板
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-08 16:23:35
 * @LastEditors: 赵敏捷
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'lmes.common.model';
const intlPrefix = 'lmes.andonSignboard.model';
const { common, lmesAndonSignboard } = codeConfig.code;

export default () => ({
  autoCreate: true,
  fields: [
    {
      name: 'meOuObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonPrefix}.meOu`).d('工厂'),
      lovCode: common.meOu,
      required: true,
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuCode',
      type: 'string',
      bind: 'meOuObj.meOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'meOuObj.organizationName',
      ignore: 'always',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonPrefix}.prodLine`).d('生产线'),
      lovCode: common.prodLine,
      cascadeMap: { organizationId: 'meOuId' },
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: 'string',
      bind: 'prodLineObj.prodLineCode',
    },
    {
      name: 'prodLineName',
      type: 'string',
      bind: 'prodLineObj.resourceName',
      ignore: 'always',
    },
    {
      name: 'workcellObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${commonPrefix}.workcell`).d('工位'),
      lovCode: common.workcell,
      ignore: 'always',
      cascadeMap: { organizationId: 'meOuId' },
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellCode',
      type: 'string',
      bind: 'workcellObj.workcellCode',
    },
    {
      name: 'workcellName',
      type: 'string',
      bind: 'workcellObj.workcellName',
      ignore: 'always',
    },
    {
      name: 'andonClassObj',
      type: 'object',
      noCache: true,
      lovCode: common.andonClass,
      label: intl.get(`${commonPrefix}.andonClass`).d('安灯分类'),
      ignore: 'always',
    },
    {
      name: 'andonClassId',
      type: 'string',
      bind: 'andonClassObj.andonClassId',
    },
    {
      name: 'andonClassCode',
      type: 'string',
      bind: 'andonClassObj.andonClassCode',
    },
    {
      name: 'andonClassName',
      type: 'string',
      bind: 'andonClassObj.andonClassName',
      ignore: 'always',
    },
    {
      name: 'signboardPeriod',
      type: 'string',
      lookupCode: lmesAndonSignboard.signboardPeriod,
      label: intl.get(`${intlPrefix}.signboardPeriod`).d('展示周期'),
      defaultValue: 'WEEK',
      required: true,
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'meOuObj') {
        record.set('prodLineObj', null);
        record.set('workcellObj', null);
      } else if (name === 'prodLineObj') {
        record.set('workcellObj', null);
      }
    },
  },
});
