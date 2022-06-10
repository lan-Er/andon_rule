/*
 * @Description: 资源TPM设置--DS
 * @Author: TJ <jianjun.tan@hand-china.com>
 * @Date: 2019-12-12 15:05:22
 * @Copyright: Copyright(c) 2019, Hand
 * @LastEditors: Please set LastEditors
 */
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from 'utils/constants';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { descValidator } from 'hlos-front/lib/utils/utils';
import codeConfig from '@/common/codeConfig';

const { common, resourceTpm } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const commonUrl = `${HLOS_LMDS}/v1/${organizationId}/resource-tpm-settings`;
const commonCode = 'lmds.common.model';

const resourceTpmDS = () => {
  return {
    selection: false,
    primaryKey: 'tpmSettingId',
    name: 'resourceTpmSetting',
    autoQuery: true,
    transport: {
      read: ({ config }) => {
        return {
          ...config,
          url: commonUrl,
          method: 'get',
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
    },
    queryFields: [
      {
        name: 'resourceId',
        type: 'string',
        bind: 'resourceObj.resourceId',
      },
      {
        name: 'resourceName',
        type: 'string',
        label: intl.get('lmds.resourceTpm.model.resource').d('资源'),
      },
      {
        name: 'inspectionGroupName',
        type: 'string',
        label: intl.get('lmds.resourceTpm.model.inspectionGroup').d('检验组'),
      },
    ],
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
        type: 'string',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        type: 'string',
        bind: 'organizationObj.organizationName',
      },
      {
        name: 'resourceTpmType',
        type: 'string',
        // label: intl.get('lmds.resourceTpm.model.resourceTpmType').d('TPM类型'),
        label: intl.get('lmds.resourceTpm.model.resourceTpmType').d('TPM类型111'),
        lookupCode: resourceTpm.resourceTpmType,
        required: true,
      },
      {
        name: 'resourceObj',
        type: 'object',
        label: intl.get('lmds.resourceTpm.model.resource').d('资源'),
        ignore: 'always',
        lovCode: common.resource,
        required: true,
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
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
        name: 'tpmTaskTypeObj',
        type: 'object',
        label: intl.get('lmds.resourceTpm.model.tpmTaskType').d('TPM任务类型'),
        ignore: 'always',
        lovCode: resourceTpm.documentType,
        required: true,
        dynamicProps: {
          lovPara: () => ({
            documentClass: 'TPM_TASK',
          }),
        },
      },
      {
        name: 'tpmTaskTypeId',
        type: 'string',
        bind: 'tpmTaskTypeObj.documentTypeId',
      },
      {
        name: 'tpmTaskTypeName',
        type: 'string',
        bind: 'tpmTaskTypeObj.documentTypeName',
      },
      {
        name: 'tpmTaskTypeCode',
        type: 'string',
        bind: 'tpmTaskTypeObj.documentTypeCode',
      },
      {
        name: 'inspectionGroupObj',
        type: 'object',
        label: intl.get('lmds.resourceTpm.model.inspectionGroup').d('检验组'),
        lovCode: common.inspectionGroup,
        ignore: 'always',
        required: true,
      },
      {
        name: 'inspectionGroupId',
        type: 'string',
        bind: 'inspectionGroupObj.inspectionGroupId',
      },
      {
        name: 'inspectionGroupName',
        type: 'string',
        bind: 'inspectionGroupObj.inspectionGroupName',
      },
      {
        name: 'tpmFrequency',
        type: 'string',
        label: intl.get('lmds.resourceTpm.model.tpmFrequency').d('TPM频率'),
        lookupCode: resourceTpm.tpmFrequency,
      },
      {
        name: 'nextTpmDate',
        type: 'date',
        label: intl.get('lmds.resourceTpm.model.nextTpmDate').d('下次日期'),
        format: DEFAULT_DATE_FORMAT,
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'nextTpmTime',
        type: 'time',
        label: intl.get('lmds.resourceTpm.model.nextTpmTime').d('下次时间'),
        transformResponse: (val) => (val ? moment(val, DEFAULT_TIME_FORMAT) : null),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_TIME_FORMAT) : null),
      },
      {
        name: 'priority',
        type: 'number',
        label: intl.get('lmds.resourceTpm.model.priority').d('优先级'),
        min: 1,
        max: 9999,
        step: 1,
      },
      {
        name: 'referenceDocument',
        type: 'string',
        label: intl.get('lmds.resourceTpm.model.referenceDocument').d('参考文档'),
      },
      {
        name: 'tpmGroupObj',
        type: 'object',
        label: intl.get(`${commonCode}.workerGroup`).d('班组'),
        ignore: 'always',
        lovCode: common.workerGroup,
      },
      {
        name: 'tpmGroupId',
        type: 'string',
        bind: 'tpmGroupObj.workerGroupId',
      },
      {
        name: 'tpmGroupName',
        type: 'string',
        bind: 'tpmGroupObj.workerGroupName',
      },
      {
        name: 'tpmManObj',
        type: 'object',
        label: intl.get(`${commonCode}.worker`).d('操作工'),
        ignore: 'always',
        lovCode: common.worker,
      },
      {
        name: 'tpmManId',
        type: 'string',
        bind: 'tpmManObj.workerId',
      },
      {
        name: 'tpmManName',
        type: 'string',
        bind: 'tpmManObj.workerName',
      },
      {
        name: 'remark',
        type: 'string',
        label: intl.get(`${commonCode}.remark`).d('备注'),
        validator: descValidator,
      },
      {
        label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
        name: 'enabledFlag',
        type: 'boolean',
        defaultValue: true,
      },
    ],
    events: {
      update: ({ name, record }) => {
        if (name === 'organizationObj') {
          record.set('resourceObj', null);
        }
      },
      submitSuccess: ({ dataSet }) => {
        dataSet.query();
      },
    },
  };
};

export {
  resourceTpmDS, // 资源TPM设置
};
