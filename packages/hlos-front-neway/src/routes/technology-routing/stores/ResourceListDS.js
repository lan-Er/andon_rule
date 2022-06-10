/**
 * @Description: 工艺路线工序详情--资源tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-06 14:30:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import moment from 'moment';
import { NOW_DATE } from 'hlos-front/lib/utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { common } = codeConfig.code;
const {
  lovPara: { resource },
} = statusConfig.statusValue.lmds;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.routing.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/operation-resources`;

export default () => ({
  selection: false,
  fields: [
    {
      name: 'resourceCategoryObj',
      type: 'object',
      label: intl.get(`${preCode}.resourceCategory`).d('资源类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: resource },
      ignore: 'always',
    },
    {
      name: 'resourceCategoryId',
      type: 'string',
      bind: 'resourceCategoryObj.categoryId',
    },
    {
      name: 'resourceCategoryName',
      type: 'string',
      bind: 'resourceCategoryObj.categoryName',
    },
    {
      name: 'resourceGroupObj',
      type: 'object',
      label: intl.get(`${preCode}.resourceGroup`).d('资源组'),
      lovCode: common.resourceGroup,
      ignore: 'always',
    },
    {
      name: 'resourceGroupId',
      type: 'string',
      bind: 'resourceGroupObj.resourceGroupId',
    },
    {
      name: 'resourceGroupName',
      type: 'string',
      bind: 'resourceGroupObj.resourceGroupName',
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
      name: 'resourceName',
      type: 'string',
      bind: 'resourceObj.resourceName',
    },
    {
      name: 'preferredFlag',
      type: 'boolean',
      label: intl.get(`${preCode}.preferredFlag`).d('优选标识'),
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
      label: intl.get(`${commonCode}.startDate`).d('开始日期'),
      required: true,
      defaultValue: NOW_DATE,
      dynamicProps: ({ record }) => {
        if (record.get('endDate')) {
          return {
            max: 'endDate',
          };
        }
      },
      transformRequest: (val) => moment(val).format(DEFAULT_DATE_FORMAT),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${commonCode}.endDate`).d('结束日期'),
      min: 'startDate',
      transformRequest: (val) => val && moment(val).format(DEFAULT_DATE_FORMAT),
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'get',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => {
      dataSet.query();
    },
  },
});
