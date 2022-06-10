/**
 * @Description: 送货单配置中心DS
 * @Author: yu.yang06@hand-china.com
 * @Date: 2021-04-25 13:58:01
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const commonPrefix = 'zcom.common.model';
const intlPrefix = 'zcom.moDeliveryConfigurationCenter.model';
const { common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZCOM}/v1/${organizationId}/`;

const FoundryRuleDS = () => {
  return {
    autoQuery: true,
    data: [
      {
        supplierObj: '南阳南方智能光电有限公司',
        deliveryOrderTypeObj: '000',
        needReview: true,
        revocable: true,
      },
      {
        supplierObj: '南阳南方智能光电有限公司',
        deliveryOrderTypeObj: '000',
        needReview: true,
        revocable: false,
      },
      {
        supplierObj: '南阳南方智能光电有限公司',
        deliveryOrderTypeObj: '000',
        needReview: false,
        revocable: false,
      },
    ],
    transport: {
      read: () => ({
        url: `${url}`,
        method: 'GET',
      }),
      create({ data }) {
        return {
          url: `${url}`,
          method: 'POST',
          data,
        };
      },
      destroy: ({ data }) => {
        return {
          url: `${url}`,
          method: 'POST',
          data,
        };
      },
    },
    fields: [
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        lovCode: common.supplier,
        ignore: 'always',
        required: true,
      },
      {
        name: 'deliveryOrderTypeObj',
        type: 'object',
        label: intl.get(`${intlPrefix}.deliveryOrderType`).d('送货单类型'),
        lovCode: common.deliveryOrderType,
        ignore: 'always',
        required: true,
      },
      {
        name: 'needReview',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.needReview`).d('需要审批'),
      },
      {
        name: 'revocable',
        type: 'boolean',
        label: intl.get(`${intlPrefix}.revocable`).d('需要审批'),
      },
    ],
  };
};

export { FoundryRuleDS };
