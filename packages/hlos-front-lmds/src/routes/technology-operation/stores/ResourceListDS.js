/*
 * @Author: zhang yang
 * @Description: 工序 明细 resource DataSet
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:03:46
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { lmdsOperation, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.operation.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/operation-resources`;

export default () => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'resourceCategory',
      type: 'object',
      label: intl.get(`${preCode}.resourceCategory`).d('资源类别'),
      lovCode: common.categories,
      ignore: 'always',
    },
    {
      name: 'resourceCategoryId',
      type: 'string',
      bind: 'resourceCategory.categoryId',
    },
    {
      name: 'resourceCategoryName',
      type: 'string',
      bind: 'resourceCategory.categoryName',
    },
    {
      name: 'resourceGroup',
      type: 'object',
      label: intl.get(`${preCode}.resourceGroup`).d('资源组'),
      lovCode: lmdsOperation.resourceGroup,
      ignore: 'always',
    },
    {
      name: 'resourceGroupId',
      type: 'string',
      bind: 'resourceGroup.resourceGroupId',
    },
    {
      name: 'resourceGroupName',
      type: 'string',
      bind: 'resourceGroup.resourceGroupName',
    },
    {
      name: 'resource',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('资源'),
      lovCode: lmdsOperation.resource,
      ignore: 'always',
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resource.resourceId',
    },
    {
      name: 'resourceName',
      type: 'string',
      bind: 'resource.resourceName',
    },
    {
      name: 'resourceCode',
      type: 'string',
      bind: 'resource.resourceCode',
    },
    {
      name: 'preferredFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.preferredFlag`).d('优选标识'),
      defaultValue: true,
    },
    {
      name: 'externalId',
      type: 'number',
      label: intl.get(`${preCode}.externalId`).d('外部ID'),
      min: 1,
      step: 1,
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
      dynamicProps: {
        max: ({ record }) => {
          if (!isEmpty(record.get('endDate'))) {
            return 'endDate';
          }
        },
      },
      required: true,
      defaultValue: NOW_DATE,
      format: DEFAULT_DATE_FORMAT,
      transformRequest: val => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('结束日期'),
      min: 'startDate',
      format: DEFAULT_DATE_FORMAT,
      transformRequest: val => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ],
  transport: {
    read: config => {
      return {
        ...config,
        url,
        method: 'GET',
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
