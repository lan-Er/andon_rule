/**
 * @Description: 工艺路线详情--detailDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-12-06 14:30:33
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import moment from 'moment';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDSS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH, NOW_DATE } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import ChildrenDS from './OperationListDS';

const { lmdsRouting, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.routing.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDSS}/v1/${organizationId}/neway-routings`;

export default () => ({
  selection: false,
  primaryKey: 'routingId',
  children: {
    routingOperationList: new DataSet({ ...ChildrenDS() }),
  },
  fields: [
    {
      name: 'routingType',
      type: 'string',
      label: intl.get(`${preCode}.routingType`).d('工艺路线类型'),
      lookupCode: lmdsRouting.routingType,
      required: true,
    },
    {
      name: 'routingCode',
      type: 'string',
      label: intl.get(`${preCode}.routing`).d('工艺路线'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.routingDesc`).d('工艺路线描述'),
      validator: descValidator,
    },
    {
      name: 'routingVersion',
      type: 'string',
      label: intl.get(`${preCode}.routingVersion`).d('版本'),
      required: true,
    },
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
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
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
      name: 'alternate',
      type: 'string',
      label: intl.get(`${preCode}.alternate`).d('替代项'),
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
    submit: ({ data }) => {
      return {
        url: `${HLOS_LMDSS}/v1/${organizationId}/neway-routings/save-routing`,
        data: { ...data[0], tenantId: getCurrentOrganizationId() },
        method: 'post',
      };
    },
  },
});
