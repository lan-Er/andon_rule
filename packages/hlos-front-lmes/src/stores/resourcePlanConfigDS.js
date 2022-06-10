/**
 * @Description: 资源计划设置--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 09:54:36
 * @LastEditors: yu.na
 */

import { DataSet } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import { getCurrentOrganizationId, getCurrentUser } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { codeValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';

const { common, lmesResourcePlan } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const { id, loginName } = getCurrentUser();
const preCode = 'lmes.resourcePlan.model';
const commonCode = 'lmes.common.model';

const commonUrl = `${HLOS_LMES}/v1/${organizationId}/user-schedule-configs`;
const commonLineUrl = `${HLOS_LMES}/v1/${organizationId}/user-schedule-config-lines`;

const commonFields = (type) => {
  return [
    {
      name: 'resourceObj',
      type: 'object',
      label: intl.get(`${preCode}.resourceCode`).d('资源编码'),
      lovCode: common.resource,
      textField: 'resourceCode',
      noCache: true,
      required: true,
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ dataSet }) => {
          const { current } = dataSet.parent;
          let resourceClass = '';
          if (current && !isEmpty(current.data)) {
            if (type === 'FROM') {
              resourceClass = current.data.fromResourceClass;
            } else if (type === 'TO') {
              resourceClass = current.data.toResourceClass;
            }
          }
          return {
            resourceClass,
            organizationId: current.data.organizationId,
          };
        },
      },
    },
    {
      name: 'resourceId',
      bind: 'resourceObj.resourceId',
    },
    {
      name: 'resourceCode',
      bind: 'resourceObj.resourceCode',
    },
    {
      name: 'resourceName',
      label: intl.get(`${preCode}.resourceName`).d('资源名称'),
      bind: 'resourceObj.resourceName',
    },
    {
      name: 'resourceClass',
    },
    {
      name: 'sequence',
      label: intl.get(`${preCode}.sequence`).d('序列'),
      type: 'number',
      min: 1,
      step: 1,
      required: true,
    },
    {
      name: 'lineType',
      defaultValue: type,
    },
  ];
};

const HeaderDS = () => ({
  primaryKey: 'configId',
  children: {
    fromList: new DataSet(FromListDS()),
    toList: new DataSet(ToListDS()),
  },
  fields: [
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
      bind: 'organizationObj.organizationId',
    },
    {
      name: 'organizationName',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'configCode',
      type: 'string',
      label: intl.get(`${preCode}.configCode`).d('设置编码'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
      required: true,
    },
    {
      name: 'fromResourceClass',
      type: 'string',
      label: intl.get(`${preCode}.fromResourceClass`).d('来源分类'),
      lookupCode: lmesResourcePlan.fromResourceClass,
      required: true,
    },
    {
      name: 'toResourceClass',
      type: 'string',
      label: intl.get(`${preCode}.toResourceClass`).d('目标分类'),
      lookupCode: lmesResourcePlan.toResourceClass,
      required: true,
    },
    {
      name: 'dateScheduledControl',
      type: 'boolean',
      label: intl.get(`${preCode}.dateScheduledControl`).d('时间排程'),
      trueValue: true,
      falseValue: false,
      defaultValue: true,
    },
  ],
  transport: {
    read: ({ data }) => ({
      url: `${commonUrl}/detail`,
      data: {
        ...data,
        userId: id,
        defaultFlag: 1,
      },
      method: 'GET',
    }),
    submit: ({ data }) => {
      return {
        url: `${commonUrl}/mutation`,
        data: {
          ...data[0],
          lineList: data[0].fromList.concat(...data[0].toList),
          fromList: null,
          toList: null,
          userId: id,
          userCode: loginName,
          defaultFlag: 1,
        },
        method: 'POST',
      };
    },
  },
  events: {
    load: ({ dataSet }) => {
      const ds = dataSet;
      ds.children.fromList.queryParameter = {
        resourceClass: ds.current.data.fromResourceClass,
      };
      ds.children.toList.queryParameter = {
        resourceClass: ds.current.data.toResourceClass,
      };
    },
  },
});

const FromListDS = () => ({
  fields: commonFields('FROM'),
  transport: {
    read: ({ data }) => ({
      url: commonLineUrl,
      data: {
        ...data,
        lineType: 'FROM',
      },
      method: 'GET',
    }),
    destroy: () => ({
      url: `${commonLineUrl}/delete`,
      method: 'DELETE',
    }),
  },
});

const ToListDS = () => ({
  fields: commonFields('TO'),
  transport: {
    read: ({ data }) => {
      return {
        url: commonLineUrl,
        data: {
          ...data,
          lineType: 'TO',
        },
        method: 'GET',
      };
    },
    destroy: () => ({
      url: `${commonLineUrl}/delete`,
      method: 'DELETE',
    }),
  },
});

export { HeaderDS };
