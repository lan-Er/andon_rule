import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, lmesEquipmentInspection } = codeConfig.code;

// 创建表单DS
const CreateFormDS = {
  autoCreate: true,
  fields: [
    {
      name: 'organizationId',
      type: 'string',
      ignore: 'always',
    },
    {
      name: 'taskNum',
      type: 'string',
      label: '点检单号',
      disabled: true,
    },
    {
      name: 'equipmentObj',
      type: 'object',
      label: '设备',
      noCache: true,
      lovCode: common.equipment,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: getCurrentOrganizationId(),
          organizationId: record.get('organizationId'),
        }),
      },
      required: true,
      ignore: 'always',
    },
    {
      name: 'equipmentId',
      type: 'string',
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'equipmentCode',
      type: 'string',
      bind: 'equipmentObj.equipmentCode',
    },
    {
      name: 'equipmentName',
      type: 'string',
      bind: 'equipmentObj.equipmentName',
      ignore: 'always',
    },
    {
      name: 'prodLineId',
      type: 'string',
      bind: 'equipmentObj.prodLineId',
    },
    {
      name: 'inspectionGroupObj',
      type: 'object',
      label: '点检组',
      noCache: true,
      lovCode: lmesEquipmentInspection.inspectionGroup,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: getCurrentOrganizationId(),
          organizationId: record.get('organizationId'),
        }),
      },
      required: true,
      ignore: 'always',
    },
    {
      name: 'inspectionGroupId',
      type: 'string',
      bind: 'inspectionGroupObj.inspectionGroupId',
    },
    {
      name: 'inspectionGroupCode',
      type: 'string',
      bind: 'inspectionGroupObj.inspectionGroupCode',
    },
    {
      name: 'inspectionGroupName',
      type: 'string',
      bind: 'inspectionGroupObj.inspectionGroupName',
      ignore: 'always',
    },
    {
      name: 'remark',
      type: 'string',
      label: '备注',
    },
  ],
};

// 创建表格DS
const CreateTableDS = {
  // autoCreate: true,
  pageSize: 10,
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'inspectionItemName',
      type: 'string',
      label: '点检项目',
    },
    {
      name: 'inspectionItemAlias',
      type: 'string',
      label: '检验项目简称',
    },
    {
      name: 'inspectionItemDescription',
      type: 'string',
      label: '检验项目描述',
    },
    {
      name: 'inspectionClassMeaning',
      type: 'string',
      label: '检验大类',
    },
    {
      name: 'inspectionResource',
      type: 'string',
      label: '检验设备',
    },
    {
      name: 'resultType',
      type: 'string',
      label: '检验结果类型',
      lookupCode: 'LMDS.INSPECTION_RESULT_TYPE',
    },
    {
      name: 'defaultLcl',
      type: 'string',
      label: '最小参考值',
    },
    {
      name: 'defaultUcl',
      type: 'string',
      label: '最大参考值',
    },
  ],
  transport: {
    read: (config) => {
      return {
        ...config,
        url: `${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/inspection-groups/query-inspection-item-page`,
        method: 'GET',
      };
    },
  },
};

export { CreateFormDS, CreateTableDS };
