/*
 * @Author: zhang yang
 * @Description: 检验项目组 - ds
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-25 16:53:53
 */

import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { codeValidator, descValidator } from 'hlos-front/lib/utils/utils';
import { CODE_MAX_LENGTH } from 'hlos-front/lib/utils/constants';
import ChildrenDS from './inspectionGroupLineDs';
import codeConfig from '@/common/codeConfig';

const { lmdsInspectionGroup, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.inspectionGroup.model';
const commonCode = 'lmds.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/inspection-groups`;

export default () => ({
  primaryKey: 'inspectionGroupId',
  selection: false,
  transport: {
    read: (config) => {
      return {
        ...config,
        url,
        method: 'GET',
      };
    },
    submit: ({ data, params }) => {
      return {
        url,
        data: data[0],
        params,
        method: 'POST',
      };
    },
  },
  children: {
    inspectionGroupLineList: new DataSet({ ...ChildrenDS() }),
  },
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
    update: ({ name, record }) => {
      if (name === 'organizationObj' && !isEmpty(record.get('inspectionGroupCategory'))) {
        record.set('inspectionGroupCategory', null);
      }
    },
  },
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
      bind: 'organizationObj.organizationName',
    },
    {
      name: 'inspectionGroupCode',
      type: 'string',
      label: intl.get(`${preCode}.inspectionGroup`).d('检验组编码'),
      validator: codeValidator,
      maxLength: CODE_MAX_LENGTH,
      required: true,
    },
    {
      name: 'inspectionGroupName',
      type: 'intl',
      label: intl.get(`${preCode}.inspectionGroupName`).d('检验组名称'),
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
      label: intl.get(`${preCode}.inspectionGroupAlias`).d('检验组简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.inspectionGroupDesc`).d('检验组描述'),
      validator: descValidator,
    },
    {
      name: 'inspectionGroupCategory',
      type: 'object',
      label: intl.get(`${preCode}.inspectionGroupCategory`).d('检验组分类'),
      lovCode: common.categories,
      cascadeMap: { organizationId: 'organizationId' },
      lovPara: { categorySetCode: 'INSPECTION_GROUP' },
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
});
