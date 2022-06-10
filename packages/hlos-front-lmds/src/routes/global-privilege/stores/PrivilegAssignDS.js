/**
 * @Description: 权限分配管理信息--tableDS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2019-11-21 15:29:27
 * @LastEditors: yu.na
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.privilege.model';
const commonCode = 'lmds.common.model';

const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/privilege-assigns`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'roleName',
      type: 'string',
      label: intl.get(`${preCode}.role`).d('角色'),
    },
    {
      name: 'userName',
      type: 'string',
      label: intl.get(`${preCode}.user`).d('用户'),
    },
  ],
  fields: [
    {
      name: 'roleObj',
      type: 'object',
      label: intl.get(`${preCode}.role`).d('角色'),
      lovCode: common.role,
      ignore: 'always',
      required: true,
    },
    {
      name: 'roleId',
      type: 'string',
      bind: 'roleObj.id',
    },
    {
      name: 'roleName',
      type: 'string',
      bind: 'roleObj.name',
    },
    {
      name: 'userObj',
      type: 'object',
      label: intl.get(`${preCode}.user`).d('用户'),
      lovCode: common.user,
      ignore: 'always',
      required: true,
    },
    {
      name: 'userId',
      type: 'string',
      bind: 'userObj.id',
    },
    {
      name: 'userName',
      type: 'string',
      bind: 'userObj.realName',
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
    update: ({ record }) => {
      if(!isEmpty(record.get('roleObj'))) {
        record.fields.get('userObj').set('required', false);
      } else if(!isEmpty(record.get('userObj'))) {
        record.fields.get('roleObj').set('required', false);
      }
    },
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
