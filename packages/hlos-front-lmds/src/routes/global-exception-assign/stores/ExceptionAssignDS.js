/**
 * @Description: 异常分配管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-20 10:01:32
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmdsExceptionAssign } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.exceptionAssign.model';
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/exception-assigns`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'exceptionName',
      type: 'string',
      label: intl.get(`${preCode}.exception`).d('异常'),
    },
    {
      name: 'exceptionGroupName',
      type: 'string',
      label: intl.get(`${preCode}.exceptionGroup`).d('异常组'),
    },
  ],
  fields: [
    {
      name: 'assignType',
      type: 'string',
      label: intl.get(`${preCode}.AssignType`).d('分配类型'),
      lookupCode: lmdsExceptionAssign.exceptionAssignType,
      required: true,
    },
    {
      name: 'itemObj',
      type: 'object',
      label: intl.get(`${preCode}.item`).d('物料'),
      lovCode: common.item,
      ignore: 'always',
    },
    {
      name: 'resourceObj',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('资源'),
      lovCode: common.resource,
      ignore: 'always',
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resourceObj.resourceId',
    },
    {
      name: 'resourceCode',
      type: 'string',
      bind: 'resourceObj.resourceCode',
    },
    {
      name: 'operationObj',
      type: 'object',
      label: intl.get(`${preCode}.operation`).d('工序'),
      lovCode: common.operation,
      ignore: 'always',
    },
    {
      name: 'categoriesObj',
      type: 'object',
      label: intl.get(`${preCode}.categories`).d('类别'),
      lovCode: common.categories,
      ignore: 'always',
    },
    {
      name: 'sourceObj',
      type: 'object',
      label: intl.get(`${preCode}.sourceCode`).d('来源编码'),
      ignore: 'always',
      dynamicProps: {
        lovCode: ({ record }) => {
          if (record.get('assignType') === 'RESOURCE') {
            return common.resource;
          } else if (record.get('assignType') === 'OPERATION') {
            return common.operation;
          } else if (record.get('assignType') === 'ITEM') {
            return common.item;
          } else if (record.get('assignType') === 'CATEGORY') {
            return common.categories;
          }
        },
        textField: ({ record }) => {
          if (record.get('assignType') === 'RESOURCE') {
            return 'resourceCode';
          } else if (record.get('assignType') === 'OPERATION') {
            return 'operationCode';
          } else if (record.get('assignType') === 'ITEM') {
            return 'itemCode';
          } else if (record.get('assignType') === 'CATEGORY') {
            return 'categoryCode';
          }
        },
      },
    },
    {
      name: 'sourceCode',
      type: 'string',
      dynamicProps: {
        bind: ({ record }) => {
          if (record.get('assignType') === 'RESOURCE') {
            return 'sourceObj.resourceCode';
          } else if (record.get('assignType') === 'OPERATION') {
            return 'sourceObj.operationCode';
          } else if (record.get('assignType') === 'ITEM') {
            return 'sourceObj.itemCode';
          } else if (record.get('assignType') === 'CATEGORY') {
            return 'sourceObj.categoryCode';
          }
        },
      },
    },
    {
      name: 'sourceId',
      type: 'string',
      dynamicProps: {
        bind: ({ record }) => {
          if (record.get('assignType') === 'RESOURCE') {
            return 'sourceObj.resourceId';
          } else if (record.get('assignType') === 'OPERATION') {
            return 'sourceObj.operationId';
          } else if (record.get('assignType') === 'ITEM') {
            return 'sourceObj.itemId';
          } else if (record.get('assignType') === 'CATEGORY') {
            return 'sourceObj.categoryId';
          }
        },
      },
    },
    {
      name: 'sourceName',
      type: 'string',
      label: intl.get(`${preCode}.sourceName`).d('来源名称'),
      dynamicProps: {
        bind: ({ record }) => {
          if (record.get('assignType') === 'RESOURCE') {
            return 'sourceObj.resourceName';
          } else if (record.get('assignType') === 'OPERATION') {
            return 'sourceObj.operationName';
          } else if (record.get('assignType') === 'ITEM') {
            return 'sourceObj.description';
          } else if (record.get('assignType') === 'CATEGORY') {
            return 'sourceObj.categoryName';
          }
        },
      },
    },
    {
      name: 'exceptionObj',
      type: 'object',
      label: intl.get(`${preCode}.exception`).d('异常'),
      lovCode: common.exception,
      ignore: 'always',
      required: true,
    },
    {
      name: 'exceptionId',
      type: 'string',
      bind: 'exceptionObj.exceptionId',
    },
    {
      name: 'exceptionName',
      type: 'string',
      bind: 'exceptionObj.exceptionName',
    },
    {
      name: 'exceptionGroupObj',
      type: 'object',
      label: intl.get(`${preCode}.exceptionGroup`).d('异常组'),
      lovCode: common.exceptionGroup,
      ignore: 'always',
      required: true,
    },
    {
      name: 'exceptionGroupId',
      type: 'string',
      bind: 'exceptionGroupObj.exceptionGroupId',
    },
    {
      name: 'exceptionGroupName',
      type: 'string',
      bind: 'exceptionGroupObj.exceptionGroupName',
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (!isEmpty(record.get('exceptionObj'))) {
        record.fields.get('exceptionGroupObj').set('required', false);
      } else if (!isEmpty(record.get('exceptionGroupObj'))) {
        record.fields.get('exceptionObj').set('required', false);
      }

      if (name === 'assignType') {
        record.set('sourceObj', null);
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
