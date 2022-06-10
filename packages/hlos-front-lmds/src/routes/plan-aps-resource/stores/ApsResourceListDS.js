/**
 * @Description: 计划资源管理信息--TableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-04 17:48:09
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import {
  positiveNumberValidator,
  codeValidator,
  convertFieldName,
  getTlsRecord,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { common, lmdsApsResource } = codeConfig.code;
const {
  lovPara: { apsResource },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.apsResource.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/aps-resources`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'apsResourceCode',
      type: 'string',
      label: intl.get(`${preCode}.apsResource`).d('计划资源'),
    },
    {
      name: 'apsResourceName',
      type: 'string',
      label: intl.get(`${preCode}.apsResourceName`).d('计划资源名称'),
    },
  ],
  fields: [
    {
      name: 'apsOuObj',
      type: 'object',
      label: intl.get(`${commonCode}.apsOu`).d('计划中心'),
      lovCode: common.apsOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'apsOuName',
      type: 'string',
      bind: 'apsOuObj.apsOuName',
    },
    {
      name: 'apsOuId',
      type: 'string',
      bind: 'apsOuObj.apsOuId',
    },
    {
      name: 'apsResourceCode',
      type: 'string',
      label: intl.get(`${preCode}.apsResource`).d('计划资源'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'apsResourceName',
      type: 'intl',
      label: intl.get(`${preCode}.apsResourceName`).d('计划资源名称'),
      required: true,
    },
    {
      name: 'apsResourceAlias',
      type: 'intl',
      label: intl.get(`${preCode}.apsResourceAlias`).d('计划资源简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.description`).d('计划资源描述'),
      validator: descValidator,
    },
    {
      name: 'apsGroupObj',
      type: 'object',
      label: intl.get(`${preCode}.apsGroup`).d('计划组'),
      lovCode: lmdsApsResource.apsGroup,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          apsOuId: record.get('apsOuId'),
        }),
      },
    },
    {
      name: 'apsGroupId',
      type: 'string',
      bind: 'apsGroupObj.groupId',
    },
    {
      name: 'apsGroupName',
      type: 'string',
      bind: 'apsGroupObj.groupName',
    },
    {
      name: 'apsResourceType',
      type: 'string',
      label: intl.get(`${preCode}.apsResourceType`).d('计划资源类型'),
      lookupCode: lmdsApsResource.apsResourceType,
      required: true,
    },
    {
      name: 'apsResourceCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.apsResourceCategory`).d('计划资源类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: apsResource },
      ignore: 'always',
    },
    {
      name: 'apsResourceCategoryId',
      type: 'string',
      bind: 'apsResourceCategoryObj.categoryId',
    },
    {
      name: 'apsResourceCategoryName',
      type: 'string',
      bind: 'apsResourceCategoryObj.categoryName',
    },
    {
      name: 'apsMainFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.apsMainFlag`).d('主资源'),
      required: true,
      defaultValue: true,
    },
    {
      name: 'partyObj',
      type: 'object',
      label: intl.get(`${preCode}.party`).d('商业实体'),
      lovCode: common.party,
      ignore: 'always',
    },
    {
      name: 'partyId',
      type: 'string',
      bind: 'partyObj.partyId',
    },
    {
      name: 'partyName',
      type: 'string',
      bind: 'partyObj.partyName',
    },
    {
      name: 'plannerObj',
      type: 'object',
      label: intl.get(`${preCode}.planner`).d('计划员'),
      lovCode: common.user,
      ignore: 'always',
    },
    {
      name: 'plannerId',
      type: 'string',
      bind: 'plannerObj.id',
    },
    {
      name: 'plannerName',
      type: 'string',
      bind: 'plannerObj.realName',
    },
    {
      name: 'calendarObj',
      type: 'object',
      label: intl.get(`${preCode}.calendar`).d('日历'),
      lovCode: common.calendar,
      ignore: 'always',
    },
    {
      name: 'calendarId',
      type: 'string',
      bind: 'calendarObj.calendarId',
    },
    {
      name: 'calendarName',
      type: 'string',
      bind: 'calendarObj.calendarName',
    },
    {
      name: 'orderByCode',
      type: 'string',
      label: intl.get(`${preCode}.orderByCode`).d('显示顺序'),
    },
    {
      name: 'resourceQty',
      type: 'number',
      label: intl.get(`${preCode}.resourceQty`).d('资源数量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'meanwhileUseQty',
      type: 'number',
      label: intl.get(`${preCode}.meanwhileUseQty`).d('同时使用数量'),
      validator: positiveNumberValidator,
    },
    {
      name: 'capacityType',
      type: 'string',
      label: intl.get(`${preCode}.capacityType`).d('能力类型'),
      lookupCode: common.capacityType,
    },
    {
      name: 'capacityValue',
      type: 'number',
      label: intl.get(`${preCode}.capacityValue`).d('能力值'),
      validator: positiveNumberValidator,
    },
    {
      name: 'activity',
      type: 'number',
      label: intl.get(`${preCode}.activity`).d('开动率(%)'),
      validator: positiveNumberValidator,
    },
    {
      name: 'fixTimeFence',
      type: 'number',
      label: intl.get(`${preCode}.fixTF`).d('固定时间栏(天)'),
      validator: positiveNumberValidator,
    },
    {
      name: 'frozenTimeFence',
      type: 'number',
      label: intl.get(`${preCode}.frozenTF`).d('冻结时间栏(天)'),
      validator: positiveNumberValidator,
    },
    {
      name: 'forwardPlanTimeFence',
      type: 'number',
      label: intl.get(`${preCode}.forwardPlanTF`).d('顺排时间栏(天)'),
      validator: positiveNumberValidator,
    },
    {
      name: 'releaseTimeFence',
      type: 'number',
      label: intl.get(`${preCode}.releaseTF`).d('下达时间栏(天)'),
      validator: positiveNumberValidator,
    },
    {
      name: 'orderTimeFence',
      type: 'number',
      label: intl.get(`${preCode}.orderTF`).d('订单时间栏(天)'),
      validator: positiveNumberValidator,
    },
    {
      name: 'meOuObj',
      type: 'object',
      label: intl.get(`${preCode}.meOu`).d('工厂'),
      lovCode: common.meOu,
      ignore: 'always',
    },
    {
      name: 'meOuId',
      type: 'string',
      bind: 'meOuObj.meOuId',
    },
    {
      name: 'meOuName',
      type: 'string',
      bind: 'meOuObj.organizationName',
    },
    {
      name: 'meResourceObj',
      type: 'object',
      label: intl.get(`${preCode}.meResource`).d('工厂资源'),
      lovCode: common.resource,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('meOuId'),
        }),
      },
    },
    {
      name: 'meResourceId',
      type: 'string',
      bind: 'meResourceObj.resourceId',
    },
    {
      name: 'meResourceName',
      type: 'string',
      bind: 'meResourceObj.resourceName',
    },
    {
      name: 'externalCode',
      type: 'string',
      label: intl.get(`${commonCode}.externalCode`).d('外部编码'),
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${commonCode}.externalId`).d('外部ID'),
      min: 1,
      step: 1,
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
    update: ({ name, record }) => {
      if (name === 'apsOuObj') {
        record.set('apsGroupObj', null);
      }
      if (name === 'meOuObj') {
        record.set('meResourceObj', null);
      }
      if (!isEmpty(record.get('fromCategoryObj'))) {
        record.fields.get('fromItemObj').set('required', false);
      } else if (!isEmpty(record.get('fromItemObj'))) {
        record.fields.get('fromCategoryObj').set('required', false);
      }
      if (!isEmpty(record.get('toCategoryObj'))) {
        record.fields.get('toItemObj').set('required', false);
      } else if (!isEmpty(record.get('toItemObj'))) {
        record.fields.get('toCategoryObj').set('required', false);
      }
    },
  },
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'apsResource', 'resource');
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
        url,
        data,
        method: 'GET',
      };
    },
    submit: ({ data }) => {
      return {
        url,
        data,
        method: 'POST',
      };
    },
  },
});
