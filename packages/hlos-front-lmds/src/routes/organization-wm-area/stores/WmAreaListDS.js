/**
 * @Description: 货位管理信息--TableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-04 17:48:09
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
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
  lovPara: { wmArea },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.wmArea.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/wm-areas`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'wmAreaCode',
      type: 'string',
      label: intl.get(`${preCode}.wmArea`).d('货位'),
    },
    {
      name: 'wmAreaName',
      type: 'string',
      label: intl.get(`${preCode}.wmAreaName`).d('货位名称'),
    },
    {
      name: 'warehouseCode',
      type: 'string',
      label: intl.get(`${preCode}.wm`).d('仓库'),
    },
    {
      name: 'warehouseName',
      type: 'string',
      label: intl.get(`${preCode}.warehouseName`).d('仓库名称'),
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
      name: 'wmOuName',
      type: 'string',
      bind: 'wmOuObj.wmOuName',
    },
    {
      name: 'wmOuCode',
      type: 'string',
      bind: 'wmOuObj.wmOuCode',
    },
    {
      name: 'wmOuId',
      type: 'string',
      bind: 'wmOuObj.wmOuId',
    },
    {
      name: 'warehouseObj',
      type: 'object',
      label: intl.get(`${preCode}.wm`).d('仓库'),
      lovCode: common.warehouse,
      textField: 'warehouseCode',
      ignore: 'always',
      required: true,
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('wmOuObj') && record.get('wmOuObj').organizationId) {
            return { organizationId: record.get('wmOuObj').organizationId };
          } else {
            return { organizationId: 'undefined' };
          }
        },
      },
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouseObj.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      label: intl.get(`${preCode}.warehouseName`).d('仓库名称'),
      bind: 'warehouseObj.warehouseName',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouseObj.warehouseId',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'warehouseObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'warehouseObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${commonCode}.org`).d('组织'),
      bind: 'warehouseObj.organizationName',
    },
    {
      name: 'wmAreaCode',
      type: 'string',
      label: intl.get(`${preCode}.wmArea`).d('货位'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
    },
    {
      name: 'wmAreaName',
      type: 'intl',
      label: intl.get(`${preCode}.wmAreaName`).d('货位名称'),
      required: true,
    },
    {
      name: 'wmAreaAlias',
      type: 'intl',
      label: intl.get(`${preCode}.wmAreaAlias`).d('货位简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.wmAreaDesc`).d('货位描述'),
      validator: descValidator,
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.wmAreaCategory`).d('货位类别'),
      lovCode: common.categories,
      ignore: 'always',
      lovPara: { categorySetCode: wmArea },
      required: true,
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'categoryObj.categoryName',
    },
    {
      name: 'categoryCode',
      type: 'string',
      bind: 'categoryObj.categoryCode',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get(`${commonCode}.location`).d('位置'),
      lovCode: common.location,
      ignore: 'always',
    },
    {
      name: 'locationName',
      type: 'string',
      bind: 'locationObj.locationName',
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'locationObj.locationId',
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
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'wmArea', 'organization');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'PUT',
      };
    },
  },
});
