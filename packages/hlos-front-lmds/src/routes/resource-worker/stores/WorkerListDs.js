/*
 * @Description: 操作工管理信息--WorkerListDs
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2019-11-12 15:05:39
 * @LastEditors: Please set LastEditors
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
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

const { common, lmdsWorker } = codeConfig.code;
const {
  lovPara: { worker },
} = statusConfig.statusValue.lmds;

const intlPrefix = 'lmds.worker';
const commonPrefix = 'lmds.common';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_LMDS}/v1/${organizationId}/workers`;

export default () => ({
  autoQuery: true,
  pageSize: 10,
  primaryKey: 'workerId',
  transport: {
    tls: ({ dataSet, name }) => {
      // TODO: 先使用 dataSet.current 下个版本 c7n 会 把 record 传进来
      const _token = dataSet.current.get('_token');
      const fieldName = convertFieldName(name, 'worker', 'resource');
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
      if (name === 'departmentObj') {
        record.set('chiefPositionObj', null);
      }
    },
  },
  queryFields: [
    {
      name: 'workerCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerNumber`).d('工号'),
    },
    {
      name: 'workerName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerName`).d('操作工名称'),
    },
    {
      name: 'description',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerDesc`).d('操作工描述'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.model.enabledFlag`).d('是否有效'),
      defaultValue: true,
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonPrefix}.model.org`).d('组织'),
      required: true,
      lovCode: common.meOu,
      ignore: 'always',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.organizationName',
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
      name: 'workerCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerNumber`).d('工号'),
      required: true,
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      unique: true,
    },
    {
      name: 'workerName',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.workerName`).d('操作工名称'),
      required: true,
    },
    {
      name: 'workerAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.workerAlias`).d('操作工简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.workerDesc`).d('操作工描述'),
      validator: descValidator,
    },
    {
      name: 'workerType',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerType`).d('操作工类型'),
      required: true,
      lookupCode: lmdsWorker.workerType,
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerPicture`).d('图片'),
    },
    {
      name: 'categoryObj',
      label: intl.get(`${intlPrefix}.model.workerCategory`).d('操作工类别'),
      type: 'object',
      lovCode: common.categories,
      lovPara: { categorySetCode: worker },
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'categoryObj.categoryName',
    },
    {
      name: 'workerCategoryId',
      type: 'string',
      bind: 'categoryObj.categoryId',
    },
    {
      name: 'workerCategoryCode',
      type: 'string',
      bind: 'categoryObj.categoryCode',
    },
    {
      name: 'departmentObj',
      type: 'object',
      lovCode: common.department,
      label: intl.get(`${intlPrefix}.model.workerDepartment`).d('部门'),
      ignore: 'always',
    },
    {
      name: 'departmentName',
      bind: 'departmentObj.departmentName',
    },
    {
      name: 'departmentId',
      bind: 'departmentObj.departmentId',
    },
    {
      name: 'department',
      bind: 'departmentObj.departmentCode',
    },
    {
      name: 'chiefPositionObj',
      type: 'object',
      dynamicProps: ({ record }) => {
        if (record.get('departmentId')) {
          return {
            lovCode: common.position,
            textField: 'positionName',
            valueField: 'positionId',
            lovPara: { departmentId: record.get('departmentId') },
          };
        }
      },
      label: intl.get(`${intlPrefix}.model.workerChiefPosition`).d('主管岗位'),
    },
    {
      name: 'chiefPositionId',
      type: 'string',
      bind: 'chiefPositionObj.positionId',
    },
    {
      name: 'chiefPosition',
      type: 'string',
      bind: 'chiefPositionObj.positionCode',
    },
    {
      name: 'positionName',
      type: 'string',
      bind: 'chiefPositionObj.positionName',
    },
    {
      name: 'workerGroupObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.workerGroup`).d('班组'),
      dynamicProps: ({ record }) => {
        if (record.get('organizationId')) {
          return {
            lovCode: common.workerGroup,
            textField: 'workerGroupName',
            valueField: 'workerGroupId',
            lovPara: { organizationId: record.get('organizationId') },
          };
        }
      },
      ignore: 'always',
    },
    {
      name: 'workerGroupId',
      type: 'string',
      bind: 'workerGroupObj.workerGroupId',
    },
    {
      name: 'workerGroup',
      type: 'string',
      bind: 'workerGroupObj.workerGroupCode',
    },
    {
      name: 'workerGroupName',
      type: 'string',
      bind: 'workerGroupObj.workerGroupName',
    },
    {
      name: 'sex',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerSex`).d('性别'),
      lookupCode: lmdsWorker.workerSex,
    },
    {
      name: 'birthDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.model.workerBirthDate`).d('出生日期'),
      format: DEFAULT_DATE_FORMAT,
    },
    {
      name: 'workerLevel',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerLevel`).d('员工等级'),
      lookupCode: lmdsWorker.workerLevel,
    },
    {
      name: 'entryDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.model.workerEntryDate`).d('入职日期'),
      format: DEFAULT_DATE_FORMAT,
      // max: 'endDate',
    },
    {
      name: 'phoneNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerPhone`).d('电话'),
      validator: (value) => {
        if (value?.length > 60) {
          return intl.get(`${intlPrefix}.view.message.phone.length.error`).d('电话长度不可超过60');
        }
      },
    },
    {
      name: 'phoneAreaCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerPhoneArea`).d('电话区号'),
      validator: (value) => {
        if (value?.length > 10) {
          return intl
            .get(`${intlPrefix}.view.message.phone.area.code.error`)
            .d('电话区号长度不可超过10');
        }
      },
    },
    {
      name: 'email',
      type: 'email',
      label: intl.get(`${intlPrefix}.model.workerEmail`).d('邮箱'),
    },
    {
      name: 'homeAddress',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerAddress`).d('地址'),
    },
    {
      name: 'certificateType',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerCertificateType`).d('证件类型'),
      lookupCode: lmdsWorker.workerCertificateType,
    },
    {
      name: 'certificateId',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.workerCertificateId`).d('证件号'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.model.workerStartDate`).d('生效日期'),
      max: 'endDate',
      format: DEFAULT_DATE_FORMAT,
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${intlPrefix}.model.workerEndDate`).d('失效日期'),
      min: 'startDate',
      format: DEFAULT_DATE_FORMAT,
    },
    {
      name: 'locationObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.location`).d('地理位置'),
      lovCode: common.location,
      lovPara: { tenantId: organizationId },
      ignore: 'always',
    },
    { name: 'locationName', type: 'string', bind: 'locationObj.locationName' },
    { name: 'locationCode', type: 'string', bind: 'locationObj.locationCode' },
    { name: 'locationId', type: 'string', bind: 'locationObj.locationId' },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.model.enabledFlag`).d('是否有效'),
      required: true,
      defaultValue: true,
    },
  ],
});
