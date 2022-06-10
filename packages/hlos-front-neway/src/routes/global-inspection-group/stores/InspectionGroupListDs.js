/*
 * @Author: zhang yang
 * @Description: 检验项目 - list-dataset
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-20 14:19:20
 */
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDSS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import codeConfig from '@/common/codeConfig';
import statusConfig from '@/common/statusConfig';

const { lmdsInspectionGroup, common } = codeConfig.code;
const {
  lovPara: { inspectionGroup },
} = statusConfig.statusValue.lmds;
const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.inspectionGroup.model';
const commonCode = 'lmds.common.model';
const commonUrl = `${HLOS_LMDSS}/v1/${organizationId}/neway-inspection-groups`;

export default () => ({
  autoQuery: false,
  selection: false,
  pageSize: 10,
  queryFields: [
    {
      name: 'inspectionGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.inspectionGroupCode`).d('检验项目组编码'),
    },
    {
      name: 'inspectionGroupName',
      type: 'string',
      label: intl.get(`${preCode}.inspectionGroupName`).d('检验项目组名称'),
    },
    {
      name: 'inspectionGroupType',
      type: 'string',
      label: intl.get(`${preCode}.inspectionGroupType`).d('检验组类型'),
      lookupCode: 'LMDS.INSPECTION_GROUP_TYPE',
    },
  ],
  fields: [
    {
      name: 'organizationObj',
      type: 'object',
      label: intl.get(`${commonCode}.org`).d('组织'),
      lovCode: common.meOu,
      ignore: 'always',
      required: true,
    },
    {
      name: 'organizationId',
      type: 'string',
      bind: 'organizationObj.meOuId',
    },
    {
      name: 'organizationName',
      type: 'string',
      bind: 'organizationObj.meOuName',
    },
    {
      name: 'inspectionGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.inspectionGroup`).d('检验项目组编码'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      required: true,
    },
    {
      name: 'inspectionGroupName',
      type: 'intl',
      label: intl.get(`${preCode}.inspectionGroupName`).d('检验项目组名称'),
      required: true,
    },
    {
      name: 'inspectionGroupType',
      type: 'string',
      label: intl.get(`${preCode}.inspectionGroupType`).d('检验组类型'),
      required: true,
      lookupCode: lmdsInspectionGroup.inspectionGroupType,
    },
    {
      name: 'inspectionGroupAlias',
      type: 'intl',
      label: intl.get(`${preCode}.inspectionGroupAlias`).d('检验项目组简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.inspectionGroupDesc`).d('检验项目组描述'),
      validator: descValidator,
    },
    {
      name: 'inspectionGroupCategory',
      type: 'object',
      label: intl.get(`${preCode}.inspectionGroupCategory`).d('检验项目组分类'),
      lovCode: common.categories,
      lovPara: { categorySetCode: inspectionGroup },
      ignore: 'always',
    },
    {
      name: 'categoryId',
      type: 'string',
      bind: 'inspectionGroupCategory.categoryId',
    },
    {
      name: 'categoryName',
      type: 'string',
      bind: 'inspectionGroupCategory.categoryName',
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
    submitSuccess: ({ dataSet }) => {
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
    create: () => {
      return {
        commonUrl,
        method: 'post',
      };
    },
    update: () => {
      return {
        commonUrl,
        method: 'put',
      };
    },
    submit: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'POST',
      };
    },
  },
});
