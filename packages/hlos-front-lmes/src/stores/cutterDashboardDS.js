/*
 * @Descripttion: 刀具监控DS
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const url = `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/cutters`;

const commonFields = [
  {
    name: 'organizationId',
  },
];

export const CutterRateDS = () => {
  return {
    autoQuery: false,
    transport: {
      read: () => {
        return {
          url: `${url}/count-category`,
          method: 'GET',
        };
      },
    },
  };
};

export const OverviewDS = () => {
  return {
    autoQuery: false,
    fields: commonFields,
    transport: {
      read: () => {
        return {
          url: `${url}/count-status`,
          method: 'GET',
        };
      },
    },
  };
};

export const CutterMapDS = () => {
  return {
    autoQuery: false,
    transport: {
      read: () => {
        return {
          url: `${url}/location-map`,
          method: 'GET',
        };
      },
    },
  };
};

export const SupplierChainDS = () => {
  return {
    autoQuery: false,
    // pageSize: 100,
    transport: {
      read: () => {
        return {
          url: `${url}/life`,
          method: 'GET',
        };
      },
    },
  };
};
export const RepairDS = () => {
  return {
    autoQuery: false,
    // pageSize: 100,
    transport: {
      read: () => {
        return {
          url: `${url}/repair-time`,
          method: 'GET',
        };
      },
    },
  };
};
export const FilterDS = () => {
  return {
    autoQuery: false,
    autoCreate: true,
    fields: [
      {
        name: 'meOuObj',
        type: 'object',
        label: '工厂',
        lovCode: 'LMDS.ME_OU',
        ignore: 'always',
        required: true,
      },
      {
        name: 'meOuId',
        bind: 'meOuObj.meOuId',
      },
      {
        name: 'meOuName',
        bind: 'meOuObj.organizationName',
      },
    ],
  };
};
