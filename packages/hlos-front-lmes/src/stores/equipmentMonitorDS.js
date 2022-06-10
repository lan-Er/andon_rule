/**
 * @Description: 设备监控
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-20 17:20:16
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const commonPrefix = 'lmes.common.model';
const intlPrefix = 'lmes.equipmentMonitor.model';
const { common, lmesEquipmentMonitor } = codeConfig.code;

const clearKeyPairs = {
  factoryObj: ['prodLineObj'],
};

// 顶部筛选条件DS
const equipmentMonitorDSConfig = () => ({
  autoCreate: true,
  events: {
    update({ name, value, record }) {
      console.log(value);
      const keys = clearKeyPairs[name];
      if (keys) {
        keys.forEach((key) => {
          record.set(key, null);
        });
      }
    },
  },
  fields: [
    {
      name: 'factoryObj',
      type: 'object',
      noCache: true,
      label: intl.get(`${intlPrefix}.factory`).d('工厂'),
      lovCode: lmesEquipmentMonitor.factory,
      ignore: 'always',
      required: true,
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'factoryObj.meOuId',
    },
    {
      name: 'meOuCode',
      type: 'string',
      bind: 'factoryObj.meOuCode',
    },
    {
      name: 'meOuName',
      type: 'string',
      bind: 'factoryObj.meOuName',
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
  ],
});

export { equipmentMonitorDSConfig };
