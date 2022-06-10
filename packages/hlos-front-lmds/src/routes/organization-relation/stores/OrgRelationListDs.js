import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isArray } from 'lodash';

import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/organization-relations`;
const commonCode = 'lmds.common.model';
const preCode = 'lmds.orgRelation.model';

const { common, lmdsOrgAndRelation } = codeConfig.code;

export default () => ({
  autoQuery: true,
  transport: {
    read: () => ({
      url,
      method: 'get',
    }),
    create: () => ({
      url,
      method: 'post',
    }),
    submit: () => ({
      url,
      method: 'put',
    }),
  },
  fields: [
    {
      name: 'relationType',
      type: 'string',
      lookupCode: lmdsOrgAndRelation.orgRelationType,
      label: intl.get(`${preCode}.relationType`).d('关系类型'),
      required: true,
    },
    {
      name: 'organization',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      dynamicProps: ({ record }) => {
        if (record.get('relationType') && !record.get('relationId')) {
          const str = record.get('relationType');
          // const matchResult = str.match(/(?<=).+(?=&)/);
          const matchResult = str.split('&');
          if (isArray(matchResult)) {
            return {
              lovPara: { organizationType: matchResult[0] },
              ovCode: common.organization,
            };
          }
        }
      },
      lovCode: common.organization,
      required: true,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organization.organizationId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organization.organizationName',
    },
    {
      name: 'organizationDesc',
      type: 'string',
      label: intl.get(`${preCode}.organizationDesc`).d('组织描述'),
      bind: 'organization.description',
    },
    {
      name: 'relatedOrganization',
      type: 'object',
      label: intl.get(`${preCode}.relatedOrganization`).d('关联组织'),
      dynamicProps: ({ record }) => {
        if (record.get('relationType') && !record.get('relationId')) {
          const str = record.get('relationType');
          // const matchResult = str.match(/(?<=).+(?=&)/);
          const matchResult = str.split('&');
          if (isArray(matchResult)) {
            return {
              lovPara: { organizationType: matchResult[1] },
              ovCode: common.organization,
            };
          }
        }
      },
      lovCode: common.organization,
      required: true,
      ignore: 'always',
    },
    {
      name: 'relatedOrganizationDesc',
      type: 'string',
      label: intl.get(`${preCode}.relatedOrganizationDesc`).d('关联组织描述'),
      bind: 'relatedOrganization.description',
    },
    {
      name: 'relatedOrganizationName',
      type: 'string',
      bind: 'relatedOrganization.organizationName',
    },
    {
      name: 'relatedOrganizationId',
      type: 'string',
      bind: 'relatedOrganization.organizationId',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
  ],
  queryFields: [
    { name: 'organizationName', type: 'string', label: intl.get(`${commonCode}.org`).d('组织') },
    {
      name: 'relatedOrganizationName',
      type: 'string',
      label: intl.get(`${preCode}.relatedOrganization`).d('关联组织'),
    },
  ],
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
  },
});
