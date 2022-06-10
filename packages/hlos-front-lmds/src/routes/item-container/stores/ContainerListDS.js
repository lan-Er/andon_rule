/**
 * @Description: 物料容器管理信息--TableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-04 17:48:09
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.itemContainer.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/container-capacitys`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'containerType',
      type: 'string',
      label: intl.get(`${preCode}.containerType`).d('容器类型'),
    },
    {
      name: 'container',
      type: 'string',
      label: intl.get(`${preCode}.container`).d('容器'),
    },
    {
      name: 'itemCode',
      type: 'string',
      label: intl.get(`${commonCode}.item`).d('物料'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: "always",
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
      name: 'containerTypeObj',
      type: 'object',
      label: intl.get(`${preCode}.containerType`).d('容器类型'),
      lovCode: common.containerType,
      ignore: 'always',
      required: true,
    },
    {
      name: 'containerTypeId',
      type: 'string',
      bind: 'containerTypeObj.containerTypeId',
    },
    {
      name: 'containerType',
      type: 'string',
      bind: 'containerTypeObj.containerType',
    },
    {
      name: 'containerObj',
      type: 'object',
      label: intl.get(`${preCode}.container`).d('容器'),
      lovCode: common.container,
      ignore: 'always',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          organizationId: record.get('organizationId'),
        }),
      },
    },
    {
      name: 'containerId',
      type: 'string',
      bind: 'containerObj.containerId',
    },
    {
      name: 'container',
      type: 'string',
      bind: 'containerObj.containerName',
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.category`).d('物料类别'),
      lovCode: common.category,
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'itemCategory',
      type: 'string',
      bind: 'categoryObj.categoryName',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${commonCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'itemObj.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'itemObj.itemCode',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      bind: 'itemObj.description',
    },
    {
      name: 'minQty',
      type: 'number',
      min: 0,
      label: intl.get(`${preCode}.minQty`).d('最小装载量'),
    },
    {
      name: 'maxQty',
      type: 'number',
      min: 'minQty',
      label: intl.get(`${preCode}.maxQty`).d('最大装载量'),
    },
    {
      name: 'suggestQty',
      type: 'number',
      min: 'minQty',
      max: 'maxQty',
      label: intl.get(`${preCode}.suggestQty`).d('建议装载量'),
    },
    {
      name: 'primaryFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.primaryFlag`).d('主要标识'),
      required: true,
      defaultValue: true,
    },
    {
      name: 'priority',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get(`${preCode}.priority`).d('优先级'),
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
      if(name ==='organizationObj') {
        record.set('containerObj', null);
      }
      if(!isEmpty(record.get('containerTypeObj'))) {
        record.fields.get('containerObj').set('required', false);
      } else if(!isEmpty(record.get('containerObj'))) {
        record.fields.get('containerTypeObj').set('required', false);
      } else {
        record.fields.get('containerObj').set('required', true);
        record.fields.get('containerTypeObj').set('required', true);
      }
    },
  },
  transport: {
    read: ({ data }) => {
      return {
        url,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'PUT',
      };
    },
  },
});
