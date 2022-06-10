/*
 * @Author: zhang yang
 * @Description:  详情 DataSet
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-12-02 14:04:10
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH, NOW_DATE } from 'hlos-front/lib/utils/constants';
import LineBomListDS from './LineBomListDS';

const { lmdsResourceBom, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.resourceBom.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/resource-boms`;

export default () => ({
  primaryKey: 'resourceBomId',
  selection: false,
  children: {
    lineList: new DataSet({ ...LineBomListDS() }),
  },
  fields: [
    {
      name: 'resourceBomType',
      type: 'string',
      label: intl.get(`${preCode}.resourceBomType`).d('BOM类型'),
      lookupCode: lmdsResourceBom.resourceBomType,
      required: true,
    },
    {
      name: 'resourceBomCode',
      type: 'string',
      label: intl.get(`${preCode}.resourceBom`).d('资源BOM'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      dynamicProps: ({ record }) => {
        if (record.status === 'add') {
          return {
            required: true,
          };
        }
      },
    },
    {
      name: 'resourceBomName',
      type: 'intl',
      label: intl.get(`${preCode}.resourceBomName`).d('BOM名称'),
      required: true,
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.periodDesc`).d('描述'),
      validator: descValidator,
    },
    {
      name: 'resourceBomVersion',
      type: 'string',
      label: intl.get(`${preCode}.resourceBomVersion`).d('版本'),
      required: true,
    },
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.organization,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.organizationCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'resource',
      type: 'object',
      label: intl.get(`${preCode}.resource`).d('资源'),
      lovCode: lmdsResourceBom.resource,
      dynamicProps: ({ record }) => {
        if (!isEmpty(record.get('organizationObj'))) {
          return {
            lovPara: { organizationId: record.get('organizationId') },
          };
        }
      },
      ignore: 'always',
    },
    {
      name: 'resourceId',
      type: 'string',
      bind: 'resource.resourceId',
    },
    {
      name: 'resourceCode',
      type: 'string',
      bind: 'resource.resourceCode',
    },
    {
      name: 'resourceName',
      type: 'string',
      bind: 'resource.resourceName',
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
      max: 'endDate',
      required: true,
      defaultValue: NOW_DATE,
      format: DEFAULT_DATE_FORMAT,
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      dynamicProps: ({ record }) => {
        if (record.get('endDate')) {
          return {
            max: 'endDate',
          };
        }
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('结束日期'),
      min: 'startDate',
      format: DEFAULT_DATE_FORMAT,
      transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
    },
  ],
  events: {
    update: ({ name, record }) => {
      if (name === 'organizationObj') {
        record.set('resource', null);
      }
    },
  },
  transport: {
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
    submit: ({ data, params }) => {
      return {
        url,
        data: data[0],
        params,
        method: 'POST',
      };
    },
  },
});
