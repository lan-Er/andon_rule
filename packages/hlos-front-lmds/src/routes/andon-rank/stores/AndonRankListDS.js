/**
 * @Description: 安灯等级管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-25 18:36:47
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsAndonRank, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.andonRank.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/andon-ranks`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'andonRankCode',
      type: 'string',
      label: intl.get(`${preCode}.andonRank`).d('安灯等级'),
    },
    {
      name: 'andonRankName',
      type: 'string',
      label: intl.get(`${preCode}.andonRankName`).d('安灯等级名称'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'andonRankType',
      type: 'string',
      label: intl.get(`${preCode}.andonRankType`).d('安灯等级类型'),
      lookupCode: lmdsAndonRank.adonRankType,
      required: true,
    },
    {
      name: 'andonRankCode',
      type: 'string',
      label: intl.get(`${preCode}.andonRank`).d('安灯等级'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'andonRankName',
      type: 'intl',
      label: intl.get(`${preCode}.andonRankName`).d('安灯等级名称'),
      required: true,
    },
    {
      name: 'andonRankAlias',
      type: 'intl',
      label: intl.get(`${preCode}.andonRankAlias`).d('安灯等级简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.andonRankDesc`).d('安灯等级描述'),
      validator: descValidator,
    },
    {
      name: 'valueFrom',
      type: 'number',
      label: intl.get(`${preCode}.valueFrom`).d('等级值从'),
      min: 0,
      required: true,
    },
    {
      name: 'valueTo',
      type: 'number',
      label: intl.get(`${preCode}.valueTo`).d('等级值至'),
      required: true,
      validator: (value, name, record) => {
        if (value > record.get('valueFrom')) {
          return true;
        } else {
          return intl.get(`lmds.andonRank.validation.bigger`).d('必须大于valueFrom的值');
        }
      },
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
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'PUT',
      };
    },
  },
});
