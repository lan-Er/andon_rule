/**
 * @Description: 安灯灯箱管理信息--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-26 11:21:19
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { lmdsAndonBin, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.andonBin.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/andon-bins`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'andonBinCode',
      type: 'string',
      label: intl.get(`${preCode}.andonBin`).d('安灯灯箱'),
    },
    {
      name: 'andonBinName',
      type: 'string',
      label: intl.get(`${preCode}.andonBinName`).d('安灯灯箱名称'),
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
      name: 'andonBinType',
      type: 'string',
      label: intl.get(`${preCode}.andonBinType`).d('安灯灯箱类型'),
      lookupCode: lmdsAndonBin.andonBinType,
      required: true,
    },
    {
      name: 'andonBinCode',
      type: 'string',
      label: intl.get(`${preCode}.andonBin`).d('安灯灯箱'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'andonBinName',
      type: 'intl',
      label: intl.get(`${preCode}.andonBinName`).d('安灯灯箱名称'),
      required: true,
    },
    {
      name: 'andonBinAlias',
      type: 'intl',
      label: intl.get(`${preCode}.andonBinAlias`).d('安灯灯箱简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.andonBinDesc`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'equipmentObj',
      type: 'object',
      label: intl.get(`${commonCode}.equipment`).d('设备'),
      lovCode: common.equipment,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId:
            record.get('organizationObj') && record.get('organizationObj').organizationId,
        }),
      },
    },
    {
      name: 'equipmentId',
      type: 'string',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'equipmentName',
      type: 'string',
      bind: 'equipmentObj.equipmentName',
    },
    {
      name: 'workcellObj',
      type: 'object',
      label: intl.get(`${commonCode}.workcell`).d('工位'),
      lovCode: common.workcell,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId:
            record.get('organizationObj') && record.get('organizationObj').organizationId,
        }),
      },
    },
    {
      name: 'workcellId',
      type: 'string',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellName',
      type: 'string',
      bind: 'workcellObj.workcellName',
    },
    {
      name: 'prodLineObj',
      type: 'object',
      label: intl.get(`${commonCode}.prodLine`).d('产线'),
      lovCode: common.prodLine,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId:
            record.get('organizationObj') && record.get('organizationObj').organizationId,
        }),
      },
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineName',
      type: 'string',
      bind: 'prodLineObj.resourceName',
    },
    {
      name: 'macAddress',
      type: 'string',
      label: intl.get(`${preCode}.macAddress`).d('MAC地址'),
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
      name: 'locationName',
      type: 'string',
      bind: 'locationObj.locationName',
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
      if (name === 'organizationObj') {
        record.set('equipmentObj', null);
        record.set('workcellObj', null);
        record.set('prodLineObj', null);
      }
    },
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
