/**
 * @Description: 容器类型--DataSet
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2019-12-10 13:56:59
 * @LastEditors: yiping.liu
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';

const preCode = 'lmds.containerType';
const commonCode = 'lmds.common';
const { lmdsContainerType, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/container-types`;

export default () => ({
  autoQuery: true,
  queryFields: [
    {
      name: 'containerTypeCode',
      type: 'string',
      label: intl.get(`${preCode}.view.title.containerType`).d('容器类型'),
    },
    {
      name: 'containerTypeName',
      type: 'string',
      label: intl.get(`${preCode}.model.containerTypeName`).d('容器类型名称'),
    },
  ],
  fields: [
    {
      name: 'containerClass',
      type: 'string',
      label: intl.get(`${preCode}.model.containerClass`).d('容器大类'),
      lookupCode: lmdsContainerType.containerClass,
      required: true,
    },
    {
      name: 'containerTypeCode',
      type: 'string',
      label: intl.get(`${preCode}.view.title.containerType`).d('容器类型'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'containerTypeName',
      type: 'intl',
      label: intl.get(`${preCode}.model.containerTypeName`).d('容器类型名称'),
      required: true,
    },
    {
      name: 'containerTypeAlias',
      type: 'intl',
      label: intl.get(`${preCode}.model.containerTypeAlias`).d('容器类型简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.model.description`).d('容器类型描述'),
      validator: descValidator,
    },
    {
      name: 'containerTypeCategory',
      type: 'string',
      label: intl.get(`${preCode}.model.containerTypeCategory`).d('类别'),
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}}.model.org`).d('组织'),
      ignore: 'always',
      lovCode: common.organization,
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
      name: 'cycleUseFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.model.cycleUseFlag`).d('循环使用标识'),
    },
    {
      name: 'exclusiveFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.model.exclusiveFlag`).d('专用标识'),
    },
    {
      name: 'length',
      type: 'number',
      label: intl.get(`${preCode}.model.length`).d('长度(米)'),
      defaultValue: 9999,
      min: 0,
      step: 1,
    },
    {
      name: 'width',
      type: 'number',
      label: intl.get(`${preCode}.model.width`).d('宽度(米)'),
      defaultValue: 9999,
      min: 0,
      step: 1,
    },
    {
      name: 'height',
      type: 'number',
      label: intl.get(`${preCode}.model.height`).d('高度(米)'),
      defaultValue: 9999,
      min: 0,
      step: 1,
    },
    {
      name: 'containerWeight',
      type: 'number',
      label: intl.get(`${preCode}.model.containerWeight`).d('容器重量(Kg)'),
      min: 0,
    },
    {
      name: 'maxVolume',
      type: 'number',
      label: intl.get(`${preCode}.model.maxVolume`).d('最大体积(立方米)'),
      defaultValue: 9999,
      min: 0,
      step: 1,
    },
    {
      name: 'maxWeight',
      type: 'number',
      label: intl.get(`${preCode}.model.maxWeight`).d('最大重量(Kg)'),
      defaultValue: 9999,
      min: 0,
      step: 1,
    },
    {
      name: 'maxItemQty',
      type: 'number',
      label: intl.get(`${preCode}.model.maxItemQty`).d('最大物料数量'),
      defaultValue: 9999,
      min: 0,
      step: 1,
    },
    {
      name: 'multiItemEnable',
      type: 'boolean',
      label: intl.get(`${preCode}.model.multiItemEnable`).d('允许物料混放'),
      defaultValue: true,
    },
    {
      name: 'multiLotEnable',
      type: 'boolean',
      label: intl.get(`${preCode}.model.multiLotEnable`).d('允许批次混放'),
      defaultValue: true,
    },
    {
      name: 'loadMethod',
      type: 'string',
      label: intl.get(`${preCode}.model.loadMethod`).d('装载方式'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get('lmds.common.model.enabledFlag').d('是否有效'),
      defaultValue: true,
    },
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
    create: ({ data }) => ({
      url,
      data: data[0],
      method: 'POST',
    }),
    update: ({ data }) => ({
      url,
      data: data[0],
      method: 'PUT',
    }),
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
