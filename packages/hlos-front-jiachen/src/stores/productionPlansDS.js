/**
 * @Description: 生产任务管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 09:54:36
 * @LastEditors: yu.na
 */

import moment from 'moment';
import { getCurrentOrganizationId, generateUrlWithGetParam } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LMESS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { productionPlans, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmes.productionPlans.model';
const url = `${HLOS_LMESS}/v1/${organizationId}/jcdq-production-plans/header-list`;

const QueryDS = () => {
  return {
    selection: false,
    autoCreate: true,
    queryFields: [
      {
        name: 'meOuId',
        ignore: 'always',
      },
      {
        name: 'planStartDateFrom',
        type: 'date',
        label: intl.get(`${preCode}.planStartDateFrom`).d('计划开工日期从'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('planStartDateTo')) {
              return 'planStartDateTo';
            }
          },
        },
      },
      {
        name: 'planStartDateTo',
        type: 'date',
        label: intl.get(`${preCode}.planStartDateTo`).d('计划开工日期至'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        min: 'planStartDateFrom',
      },
      {
        name: 'moNum',
        type: 'string',
        label: intl.get(`${preCode}.moNum`).d('工单编码'),
      },
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get(`${preCode}.itemCode`).d('物料编码'),
      },
      {
        name: 'moStatus',
        type: 'string',
        label: intl.get(`${preCode}.moStatus`).d('工单状态'),
        lookupCode: productionPlans.moExecuteStatus,
        multiple: true,
      },
      {
        name: 'kittingStatus',
        type: 'string',
        label: intl.get(`${preCode}.kittingStatus`).d('齐套状态'),
        lookupCode: productionPlans.kittingStatus,
        multiple: true,
      },
      {
        name: 'meAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.meArea`).d('事业部'),
        lovCode: common.meArea,
        multiple: true,
        ignore: 'always',
        noCache: true,
        required: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            meOuId: record.get('meOuId'),
          }),
        },
      },
      {
        name: 'meAreaCode',
        type: 'string',
        bind: 'meAreaObj.meAreaCode',
      },
    ],
    transport: {
      read: ({ data }) => {
        const {
          moStatus: moStatusList,
          meAreaCode: meAreaCodeList,
          kittingStatus: kittingStatusList,
        } = data;
        return {
          url: generateUrlWithGetParam(url, {
            moStatusList,
            meAreaCodeList,
            kittingStatusList,
          }),
          data: {
            ...data,
            moStatus: undefined,
            meAreaCode: undefined,
          },
          params: {
            page: data.page || 0,
            size: data.size || 100,
          },
          method: 'GET',
        };
      },
    },
  };
};

export { QueryDS };
