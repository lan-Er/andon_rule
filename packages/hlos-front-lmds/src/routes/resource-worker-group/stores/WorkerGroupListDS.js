/*
 * @Description: 班组管理信息--WorkerGroupDS
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-11 19:59:45
 * @LastEditors: Please set LastEditors
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS, LMDS_LANGUAGE_URL } from 'hlos-front/lib/utils/config';
import {
  codeValidator,
  getTlsRecord,
  convertFieldName,
  descValidator,
} from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const intlPrefix = 'lmds.workerGroup';
const commonPrefix = 'lmds.common';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/worker-groups`;
const { common, lmdsWorkerGroup } = codeConfig.code;
const {
  lovPara: { workGroup },
} = statusConfig.statusValue.lmds;

export default () => ({
  autoQuery: true,
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'workerGroup', 'resource');
      return {
        url: `${LMDS_LANGUAGE_URL}`,
        method: 'GET',
        params: { _token, fieldName },
        transformResponse: (data) => {
          return getTlsRecord(data, name);
        },
      };
    },
    read: () => ({
      url,
      method: 'GET',
    }),
    update: () => ({
      url,
      method: 'PUT',
    }),
    create: () => ({
      url,
      method: 'POST',
    }),
  },
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
    update: ({ record, name }) => {
      if (name === 'organization') {
        record.set('locationObj', null);
        record.set('supervisorObj', null);
      }
    },
  },
  queryFields: [
    {
      name: 'workerGroupCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerGroup`).d('班组'),
    },
    {
      name: 'workerGroupName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerGroupName`).d('班组名称'),
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.model.org`).d('组织'),
      lovCode: common.meOu,
      required: true,
      ignore: 'always',
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationCode',
      type: 'string',
      bind: 'organizationObj.meOuCode',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'workerGroupCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerGroup`).d('班组'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'workerGroupName',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.workerGroupName`).d('班组名称'),
      required: true,
    },
    {
      name: 'workerGroupAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.workerGroupAlias`).d('班组简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.workerGroupDesc`).d('班组描述'),
      validator: descValidator,
    },
    {
      name: 'workerGroupType',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerGroupType`).d('班组类型'),
      lookupCode: lmdsWorkerGroup.workerGroupType,
      required: true,
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerGroupPicture`).d('图片'),
    },
    {
      name: 'workerGroupCategoryObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.workerGroupCategory`).d('班组类别'),
      lovCode: common.categories,
      lovPara: { categorySetCode: workGroup },
      noCache: true,
      ignore: 'always',
      // lovPara: {
      //   CATEGORY_SET: 'WORKER_GROUP_SET',
      // },
    },
    {
      name: 'workerGroupCategoryId',
      type: 'string',
      bind: 'workerGroupCategoryObj.categoryId',
    },
    {
      name: 'workerGroupCategoryCode',
      type: 'string',
      bind: 'workerGroupCategoryObj.categoryCode',
    },
    {
      name: 'workerGroupCategoryName',
      type: 'string',
      bind: 'workerGroupCategoryObj.categoryName',
    },
    {
      name: 'departmentObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.workerGroupDepartment`).d('部门'),
      lovCode: common.department,
      noCache: true,
      ignore: 'always',
    },
    {
      name: 'departmentName',
      bind: 'departmentObj.departmentName',
    },
    {
      name: 'department',
      bind: 'departmentObj.departmentCode',
    },
    {
      name: 'departmentId',
      bind: 'departmentObj.departmentId',
    },
    {
      name: 'supervisorObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.workerGroupSupervisor`).d('主管'),
      lovCode: common.worker,
      noCache: true,
      ignore: 'always',
      multiple: true,
      cascadeMap: { organizationId: 'organizationId' },
    },
    {
      name: 'supervisorNames',
      type: 'string',
      bind: 'supervisorObj.workerName',
    },
    {
      name: 'supervisors',
      type: 'string',
      bind: 'supervisorObj.workerCode',
    },
    {
      name: 'supervisorIds',
      type: 'string',
      bind: 'supervisorObj.workerId',
    },
    {
      name: 'chiefPositionObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.workerGroupChiefPosition`).d('主管岗位'),
      lovCode: common.position,
      lovPara: { supervisorFlag: 1 },
      noCache: true,
      ignore: 'always',
    },
    {
      name: 'chiefPositionName',
      bind: 'chiefPositionObj.positionName',
    },
    {
      name: 'chiefPosition',
      bind: 'chiefPositionObj.positionCode',
    },
    {
      name: 'chiefPositionId',
      bind: 'chiefPositionObj.positionId',
    },
    {
      name: 'calendarObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.workerGroupCalendar`).d('工作日历'),
      lovCode: common.calendar,
      dynamicProps: {
        lovPara: ({ record }) => ({
          resourceId: record.get('workerGroupId'),
          organizationId: record.get('organizationId'),
        }),
      },
      noCache: true,
      ignore: 'always',
    },
    {
      name: 'calendarId',
      type: 'string',
      bind: 'calendarObj.calendarId',
    },
    {
      name: 'calendarCode',
      type: 'string',
      bind: 'calendarObj.calendarCode',
    },
    {
      name: 'calendarName',
      type: 'string',
      bind: 'calendarObj.calendarName',
    },
    {
      name: 'workerNumber',
      type: 'number',
      label: '员工数量',
      min: 1,
      step: 1,
    },
    {
      name: 'workerMaxNumber',
      type: 'number',
      label: '员工上限',
      min: 1,
      step: 1,
    },
    {
      name: 'manageRuleObj',
      type: 'object',
      label: '管理规则',
      lovCode: common.rule,
      ignore: 'always',
      lovPara: {
        ruleClass: 'WORKER_GROUP',
      },
    },
    {
      name: 'manageRuleId',
      type: 'string',
      bind: 'manageRuleObj.ruleId',
    },
    {
      name: 'manageRule',
      type: 'string',
      bind: 'manageRuleObj.ruleJson',
    },
    {
      name: 'ruleName',
      type: 'string',
      bind: 'manageRuleObj.ruleName',
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.location`).d('地理位置'),
      noCache: true,
      lovCode: common.location,
      lovPara: { tenantId: organizationId },
      ignore: 'always',
    },
    {
      name: 'locationName',
      type: 'object',
      bind: 'locationObj.locationName',
    },
    {
      name: 'locationCode',
      type: 'object',
      bind: 'locationObj.locationCode',
    },
    {
      name: 'locationId',
      type: 'string',
      bind: 'locationObj.locationId',
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonPrefix}.enabledFlag`).d('是否有效'),
      defaultValue: true,
      require: true,
    },
  ],
});
