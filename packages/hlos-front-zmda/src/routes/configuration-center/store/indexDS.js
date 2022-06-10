/**
 * @Description: 配置中心DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-11 17:28:54
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';

const intlPrefix = 'zmda.configurationCenter.model';
const organizationId = getCurrentOrganizationId();

const DeliveryConfigDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'autoDeliveryFlag',
      type: 'string',
      label: intl.get(`${intlPrefix}.autoDeliveryFlag`).d('预约完成是否自动创建发货'),
      trueValue: '1',
      falseValue: '0',
      defaultValue: '0',
    },
    // {
    //   name: 'syncSupplierSystemFlag',
    //   type: 'string',
    //   label: intl.get(`${intlPrefix}.syncSupplierSystemFlag`).d('发货单是否同步外部系统'),
    //   trueValue: '1',
    //   falseValue: '0',
    //   defaultValue: '0',
    // },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${HLOS_ZCOM}/v1/${organizationId}/delivery-rules`,
        data,
        method: 'GET',
        transformResponse: (value) => {
          const newValue = JSON.parse(value);
          let obj;
          if (newValue && !newValue.failed && newValue.content) {
            obj = Object.assign({}, newValue.content[0]);
          }
          return obj;
        },
      };
    },
  },
});

export { DeliveryConfigDS };
