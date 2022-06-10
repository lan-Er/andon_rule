/**
 * @Description：资源关系管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-14 20:55:11
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { common, lmdsResourceRelation } = codeConfig.code;
const {
  lovPara: { itemMe },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.resourceRelation.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/resource-relations`;

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
      name: 'relatedResource',
      type: 'string',
      label: intl.get(`${preCode}.relatedResource`).d('关联资源'),
    },
  ],
  fields: [
    {
      name: 'relationType',
      type: 'string',
      label: intl.get(`${preCode}.relationType`).d('关系类型'),
      lookupCode: lmdsResourceRelation.relationType,
      required: true,
    },
    {
      name: 'resourceObj',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('资源'),
      ignore: 'always',
      lovCode: common.resource,
      required: true,
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('relationType'))) {
          const resourceTypeArr = record.get('relationType').split('&');
          if (resourceTypeArr.length && resourceTypeArr[0]) {
            return {
              lovPara: {
                resourceClass: resourceTypeArr[0],
              },
            };
          }
        }
      },
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resourceObj.resourceId',
    },
    {
      name: 'resourceCode',
      type: 'string',
      bind: 'resourceObj.resourceId',
    },
    {
      name: 'resourceName',
      type: 'string',
      bind: 'resourceObj.resourceName',
    },
    {
      name: 'relatedResourceObj',
      type: 'object',
      label: intl.get(`${preCode}.relatedResource`).d('关联资源'),
      lovCode: common.resource,
      ignore: 'always',
      required: true,
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('relationType'))) {
          const resourceTypeArr = record.get('relationType').split('&');
          if (resourceTypeArr.length && resourceTypeArr[1]) {
            return {
              lovPara: {
                resourceClass: resourceTypeArr[1],
              },
            };
          }
        }
      },
    },
    {
      name: 'relatedResourceId',
      type: 'string',
      bind: 'relatedResourceObj.resourceId',
    },
    {
      name: 'relatedResourceCode',
      type: 'string',
      bind: 'relatedResourceObj.resourceCode',
    },
    {
      name: 'relatedResource',
      type: 'string',
      bind: 'relatedResourceObj.resourceName',
    },
    {
      name: 'thirdResourceObj',
      type: 'object',
      label: intl.get(`${preCode}.resourceThird`).d('第三方资源'),
      lovCode: common.resource,
      ignore: 'always',
    },
    {
      name: 'thirdResourceId',
      type: 'string',
      bind: 'thirdResourceObj.resourceId',
    },
    {
      name: 'thirdResourceCode',
      type: 'string',
      bind: 'thirdResourceObj.resourceCode',
    },
    {
      name: 'thirdResource',
      type: 'string',
      bind: 'thirdResourceObj.resourceName',
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.meOu,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'categoryObj',
      type: 'object',
      label: intl.get(`${preCode}.category`).d('类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: itemMe },
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'categoryCode',
      type: 'string',
      bind: 'categoryObj.categoryCode',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'categoryObj.categoryName',
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
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
      name: 'priority',
      type: 'string',
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
      if (name === 'relationType') {
        record.set('resourceObj', null);
        record.set('relatedResourceObj', null);
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
    destroy: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'DELETE',
      };
    },
  },
});
