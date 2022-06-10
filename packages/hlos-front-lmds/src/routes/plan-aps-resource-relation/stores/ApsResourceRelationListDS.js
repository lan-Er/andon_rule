/*
 * @Author: zhang yang
 * @Description: 计划资源关系
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-10 10:22:29
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty, isArray } from 'lodash';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmdsAPSResourceRelation } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.APSResourceRelation.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/aps-resource-relations`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'resourceName',
      type: 'string',
      label: intl.get(`${preCode}.resource`).d('资源'),
    },
    {
      name: 'relatedResourceName',
      type: 'string',
      label: intl.get(`${preCode}.relatedResource`).d('关联资源'),
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
      name: 'apsOu',
      type: 'string',
      bind: 'apsOuObj.apsOuName',
    },
    {
      name: 'apsOuId',
      type: 'string',
      bind: 'apsOuObj.apsOuId',
    },
    {
      name: 'relationType',
      type: 'string',
      label: intl.get(`${preCode}.relationType`).d('关系类型'),
      lookupCode: lmdsAPSResourceRelation.relationType,
      required: true,
    },
    {
      name: 'resource',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('资源'),
      lovCode: lmdsAPSResourceRelation.resource,
      ignore: 'always',
      required: true,
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('relationType'))) {
          const str = record.get('relationType');
          const matchResult = str.match(/(?<=).+(?=&)/);
          if (isArray(matchResult) && !isEmpty(record.get('apsOuId'))) {
            return {
              lovPara: { resourceType: matchResult[0], apsOuId: record.get('apsOuId')},
            };
          }
        }
      },
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resource.apsResourceId',
    },
    {
      name: 'resourceName',
      type: 'string',
      bind: 'resource.resourceName',
    },
    {
      name: 'relatedResource',
      type: 'object',
      label: intl.get(`${preCode}.relatedResource`).d('关联资源'),
      lovCode: lmdsAPSResourceRelation.resource,
      ignore: 'always',
      required: true,
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('relationType'))) {
          const str = record.get('relationType');
          const matchResult = str.match(/(?<=&).+(?=)/);
          if (isArray(matchResult) && !isEmpty(record.get('apsOuId'))) {
            return {
              lovPara: { resourceType: matchResult[0], apsOuId: record.get('apsOuId')},
            };
          }
        }
      },
    },
    {
      name: 'relatedResourceId',
      type: 'string',
      bind: 'relatedResource.apsResourceId',
    },
    {
      name: 'relatedResourceName',
      type: 'string',
      bind: 'relatedResource.resourceName',
    },
    {
      name: 'category',
      type: 'object',
      label: intl.get(`${preCode}.category`).d('类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: 'ITEM_APS' },
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'category.categoryId',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'category.categoryName',
    },
    {
      name: 'item',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      lovCode: lmdsAPSResourceRelation.item,
      ignore: 'always',
    },
    {
      name: 'itemId',
      type: 'string',
      bind: 'item.itemId',
    },
    {
      name: 'itemCode',
      type: 'string',
      bind: 'item.itemCode',
    },
    {
      name: 'itemDescription',
      type: 'string',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      bind: 'item.description',
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
      if(name === 'apsOuObj' || name === 'relationType' ) {
        record.set('resource', null);
        record.set('relatedResource', null);
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
    destroy: ({ data }) => {
      return {
        url,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
});
