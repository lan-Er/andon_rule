/**
 * @Description: 备件监控筛选条件
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-04 13:45:00
 * @LastEditors: yu.na
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';

const { common, lmesSparePartsMonitor } = codeConfig.code;

const preCode = 'lmes.sparePartsMonitor.model';
const commonCode = 'lmes.common.model';

const ListDS = () => {
  return {
    selection: false,
    autoCreate: true,
    fields: [
      {
        name: 'organizationObj',
        label: intl.get(`${commonCode}.meOu`).d('工厂'),
        type: 'object',
        lovCode: common.meOu,
        ignore: 'always',
        required: true,
      },
      {
        name: 'organizationId',
        bind: 'organizationObj.meOuId',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.organizationName',
      },
      {
        name: 'period',
        label: intl.get(`${preCode}.period`).d('展示周期'),
        type: 'string',
        lookupCode: lmesSparePartsMonitor.period,
        required: true,
        defaultValue: 'MONTH',
      },
      {
        name: 'effectiveDay',
        type: 'number',
        label: intl.get(`${preCode}.effectiveDay`).d('剩余有效天数'),
        min: 1,
        step: 1,
        defaultValue: 3,
      },
    ],
  };
};

export { ListDS };
