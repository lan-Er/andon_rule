/**
 * @Description: 物料关键属性DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-14 15:56:39
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';

const intlPrefix = 'zmda.itemKeyAttribute';
const organizationId = getCurrentOrganizationId();
const attrUrl = `${HLOS_ZMDA}/v1/${organizationId}/attributes`;
const attrValueUrl = `${HLOS_ZMDA}/v1/${organizationId}/attribute-values`;

const ItemKeyAttrListDS = () => ({
  autoQuery: false,
  selection: false,
  queryFields: [
    {
      name: 'attributeCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.attributeCode`).d('属性编码'),
    },
    {
      name: 'attributeDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.attributeDesc`).d('属性说明'),
    },
  ],
  fields: [
    {
      name: 'orderNum',
      type: 'string',
      label: intl.get(`${intlPrefix}.orderNum`).d('序号'),
    },
    {
      name: 'attributeCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.attributeCode`).d('属性编码'),
    },
    {
      name: 'attributeDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.attributeDesc`).d('属性说明'),
    },
    {
      name: 'attributeList',
      type: 'string',
      label: intl.get(`${intlPrefix}.attributeList`).d('可选值'),
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: intl.get(`${intlPrefix}.status`).d('状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: attrUrl,
        data,
        method: 'GET',
      };
    },
  },
});

const ItemKeyAttrDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'attributeCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.attributeCode`).d('属性编码'),
      required: true,
    },
    {
      name: 'attributeDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.attributeDesc`).d('属性说明'),
      required: true,
    },
    {
      name: 'orderNum',
      type: 'number',
      label: intl.get(`${intlPrefix}.orderNum`).d('序号'),
      required: true,
    },
    {
      name: 'enabledFlag',
      type: 'string',
      label: intl.get(`${intlPrefix}.enabledFlag`).d('启用关键属性'),
      trueValue: '1',
      falseValue: '0',
      defaultValue: '1',
    },
  ],
  transport: {
    read: ({ data }) => {
      const { attributeId } = data;
      return {
        data: {
          ...data,
          attributeId: undefined,
        },
        url: `${HLOS_ZMDA}/v1/${organizationId}/attributes/${attributeId}`,
        method: 'GET',
      };
    },
  },
});

const ItemKeyAttrValueListDS = () => ({
  autoQuery: false,
  fields: [
    {
      name: 'attributeValue',
      type: 'string',
      label: intl.get(`${intlPrefix}.attributeValue`).d('可选值'),
      required: true,
    },
    {
      name: 'attributeValueDesc',
      type: 'string',
      label: intl.get(`${intlPrefix}.attributeValueDesc`).d('可选值说明'),
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
        url: attrValueUrl,
        data,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: attrValueUrl,
        data: {
          ...data[0],
        },
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: attrValueUrl,
        data: {
          ...data[0],
        },
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: attrValueUrl,
        data,
        method: 'DELETE',
      };
    },
  },
});

export { ItemKeyAttrListDS, ItemKeyAttrDS, ItemKeyAttrValueListDS };
