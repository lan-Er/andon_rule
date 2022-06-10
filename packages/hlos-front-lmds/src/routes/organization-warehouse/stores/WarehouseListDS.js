/**
 * @Description: 仓库管理信息--TableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-04 17:48:09
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId, getCurrentLanguage } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import {
  codeValidator,
  getTlsRecord,
  convertFieldName,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { common } = codeConfig.code;
const {
  lovPara: { warehouse },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const currentLanguage = getCurrentLanguage();
const preCode = 'lmds.warehouse.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/warehouses`;

export default () => ({
  autoQuery: true,
  pageSize: 10,
  selection: false,
  queryFields: [
    {
      name: 'warehouseCode',
      type: 'string',
      label: intl.get(`${preCode}.wm`).d('仓库'),
    },
    {
      name: 'warehouseName',
      type: 'string',
      label: intl.get(`${preCode}.wmName`).d('仓库名称'),
    },
  ],
  fields: [
    {
      name: 'wmOuObj',
      type: 'object',
      label: intl.get(`${preCode}.wmOu`).d('仓储中心'),
      lovCode: common.wmOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'wmOuId',
      type: 'string',
      bind: 'wmOuObj.wmOuId',
    },
    {
      name: 'wmOuCode',
      type: 'string',
      bind: 'wmOuObj.wmOuCode',
    },
    {
      name: 'wmOuName',
      type: 'string',
      bind: 'wmOuObj.wmOuName',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'wmOuObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'wmOuObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${commonCode}.org`).d('组织'),
      bind: 'wmOuObj.organizationName',
    },
    {
      name: 'warehouseCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.wmCategory`).d('仓库类别'),
      lovCode: common.categories,
      ignore: 'always',
      required: true,
      lovPara: {
        categorySetCode: warehouse,
      },
    },
    {
      name: 'warehouseCategoryId',
      type: 'string',
      bind: 'warehouseCategoryObj.categoryId',
    },
    {
      name: 'warehouseCategoryCode',
      type: 'string',
      bind: 'warehouseCategoryObj.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'warehouseCategoryObj.categoryName',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      label: intl.get(`${preCode}.wm`).d('仓库'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'warehouseName',
      type: 'intl',
      label: intl.get(`${preCode}.wmName`).d('仓库名称'),
      required: true,
    },
    {
      name: 'warehouseAlias',
      type: 'intl',
      label: intl.get(`${preCode}.wmAlias`).d('仓库简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.wmDesc`).d('仓库描述'),
      validator: descValidator,
    },
    {
      name: 'warehouseGroup',
      type: 'string',
      label: intl.get(`${preCode}.warehouseGroup`).d('仓库组'),
    },
    {
      name: 'onhandFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.onhandFlag`).d('启用现有量'),
      required: true,
      defaultValue: true,
    },
    {
      name: 'negativeFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.negativeFlag`).d('允许负库存'),
      trueValue: true,
      falseValue: false,
    },
    {
      name: 'wmAreaFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.wmAreaFlag`).d('启用货位'),
      trueValue: true,
      falseValue: false,
    },
    {
      name: 'wmUnitFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.wmUnitFlag`).d('启用货格'),
      trueValue: true,
      falseValue: false,
    },
    {
      name: 'tagFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.tagFlag`).d('启用条码'),
      trueValue: true,
      falseValue: false,
    },
    {
      name: 'lotFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.lotFlag`).d('启用批次'),
    },
    {
      name: 'planFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.planFlag`).d('计划考虑'),
      defaultValue: true,
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get(`${commonCode}.location`).d('地理位置'),
      lovCode: common.location,
      ignore: 'always',
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'locationObj.locationId',
    },
    {
      name: 'locationCode',
      type: 'string',
      bind: 'locationObj.locationCode',
    },
    {
      name: 'locationName',
      type: 'string',
      bind: 'locationObj.locationName',
    },
    {
      name: 'externalOrganization',
      type: 'string',
      label: intl.get(`${commonCode}.externalOrg`).d('外部关联组织'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'warehouse', 'organization');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: ({ params }) => {
      const url = commonUrl;
      const axiosConfig = {
        url,
        method: 'GET',
        params: {
          languageCode: currentLanguage,
          page: params.page,
          size: params.size,
        },
      };
      return axiosConfig;
    },
    create: ({ data }) => {
      const url = commonUrl;
      const axiosConfig = {
        url,
        method: 'POST',
        params: {
          languageCode: currentLanguage,
        },
        data,
      };
      return axiosConfig;
    },
    update: ({ data }) => {
      const url = commonUrl;
      const axiosConfig = {
        url,
        method: 'PUT',
        params: {
          languageCode: currentLanguage,
        },
        data,
      };
      return axiosConfig;
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
