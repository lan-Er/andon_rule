/**
 * @Description: 角色分配DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-03-11 10:47:25
 */

import intl from 'utils/intl';
import codeConfig from '@/common/codeConfig';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';

const { common } = codeConfig.code;
const commonCode = 'zmda.common.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/tenant-rel-roles/queryListByTenantRelId`;
const deleteUrl = `${HLOS_ZMDA}/v1/${organizationId}/tenant-rel-roles`;

const roleAssignListDS = () => ({
  fields: [
    {
      name: 'parentRoleObj',
      type: 'object',
      label: intl.get(`${commonCode}.roleCode`).d('角色编码'),
      lovCode: common.iamRole,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: record.get('parentTenantId'),
        }),
      },
      ignore: 'always',
      required: true,
    },
    {
      name: 'parentRoleId',
      type: 'string',
      bind: 'parentRoleObj.ruleId',
    },
    {
      name: 'parentRoleCode',
      type: 'string',
      bind: 'parentRoleObj.ruleCode',
    },
    {
      name: 'parentRoleName',
      type: 'string',
      bind: 'parentRoleObj.ruleName',
      label: intl.get(`${commonCode}.roleName`).d('角色名称'),
    },
    {
      name: 'parentTenantName',
      type: 'string',
      label: intl.get(`${commonCode}.tenantName`).d('所属租户'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url,
        data,
        method: 'GET',
      };
    },
    destroy: () => {
      return {
        url: deleteUrl,
        method: 'DELETE',
      };
    },
  },
  events: {
    update: ({ dataSet, record, name }) => {
      if (name === 'parentRoleObj') {
        const arr = dataSet.toData().map((v) => {
          return v.parentRoleId;
        });
        const repeatFlag = arr.some((item, idx) => {
          return arr.indexOf(item) !== idx;
        });
        if (repeatFlag) {
          record.set('parentRoleObj', null);
          notification.warning({
            message: '角色编码重复，请重新选择',
          });
        }
      }
    },
  },
});

export { roleAssignListDS };
