/**
 * @Description: 权限明细管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-21 14:52:18
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { common, lmdsPrivilege } = codeConfig.code;
const { lmds: { privilege } } = statusConfig.statusValue;
const organizationId = getCurrentOrganizationId();

const preCode = 'lmds.privilege.model';
const commonCode = 'lmds.common.model';

const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/privilege-lines`;

export default () => ({
  selection: false,
  fields: [
    {
      name: 'sourceType',
      type: 'string',
      label: intl.get(`${preCode}.sourceType`).d('来源类型'),
      lookupCode: lmdsPrivilege.sourceType,
      required: true,
    },
    {
      name: 'sourceObj',
      type: 'object',
      label: intl.get(`${preCode}.sourceName`).d('来源名称'),
      ignore: 'always',
      required: true,
      dynamicProps: ({ record }) => {
        const type = record.get('sourceType');
        if (type === privilege.organization) {
          return {
            lovCode: common.organization,
            textField: 'organizationName',
            valueField: 'organizationId',
          };
        } else if(type === privilege.resource) {
          return {
            lovCode: common.resource,
            textField: 'resourceName',
            valueField: 'resourceId',
          };
        } else if(type === privilege.party) {
          return {
            lovCode: common.party,
            textField: 'partyName',
            valueField: 'partyId',
          };
        }
      },
    },
    {
      name: 'sourceId',
      type: 'string',
      dynamicProps: ({ record }) => {
        const type = record.get('sourceType');
        if (type === privilege.organization) {
          return {
            bind: 'sourceObj.organizationId',
          };
        } else if(type === privilege.resource) {
          return {
            bind: 'sourceObj.resourceId',
          };
        } else if(type === privilege.party) {
          return {
            bind: 'sourceObj.partyId',
          };
        }
      },
    },
    {
      name: 'sourceName',
      type: 'string',
      dynamicProps: ({ record }) => {
        const type = record.get('sourceType');
        if (type === privilege.organization) {
          return {
            bind: 'sourceObj.organizationName',
          };
        } else if(type === privilege.resource) {
          return {
            bind: 'sourceObj.resourceName',
          };
        } else if(type === privilege.party) {
          return {
            bind: 'sourceObj.partyName',
          };
        }
      },
    },
    {
      name: 'privilegeAction',
      type: 'string',
      label: intl.get(`${preCode}.privilegeAction`).d('权限操作'),
      lookupCode: lmdsPrivilege.privilegeAction,
    },
    {
      name: 'orderByCode',
      type: 'string',
      label: intl.get(`${preCode}.orderBy`).d('排序'),
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
    submit: ({ dataSet, data }) => {
      data.map(item => {
        const dataItem = item;
        dataItem.privilegeId = dataSet.queryParameter.privilegeId;
        return dataItem;
      });
    },
    submitSuccess: ({dataSet}) => {
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
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'PUT',
      };
    },
    destroy: ({ data }) => {
      return {
        url: commonUrl,
        data: data[0],
        method: 'DELETE',
      };
    },
  },
});
