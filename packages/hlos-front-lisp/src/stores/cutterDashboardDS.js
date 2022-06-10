/*
 * @Descripttion: 刀具监控DS
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import { getCurrentUser } from 'utils/utils';

const url = `${HLOS_LISP}/v1`;
const { loginName } = getCurrentUser();

export const CutterRateDS = () => {
  return {
    autoQuery: false,
    transport: {
      read: ({ data }) => {
        return {
          url: `${url}/datas/cutter-rate`,
          data: {
            ...data,
            user: loginName,
          },
          method: 'GET',
        };
      },
    },
  };
};

export const OverviewDS = () => {
  return {
    autoQuery: false,
    transport: {
      read: () => {
        return {
          url: `${url}/datas/cutter-status`,
          data: { user: loginName },
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
          url: `${url}/datas/cutter-map`,
          data: { user: loginName },
          method: 'GET',
        };
      },
    },
  };
};

export const SupplierChainDS = () => {
  return {
    autoQuery: false,
    pageSize: 100,
    transport: {
      read: ({ data }) => {
        return {
          url: `${url}/datas/supplier-chain`,
          data: {
            ...data,
            user: loginName,
            functionType: 'CUTTER',
            dataType: 'CUTTER',
          },
          method: 'GET',
        };
      },
    },
  };
};
