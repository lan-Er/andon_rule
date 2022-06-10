/**
 * @Description: 制造协同-资源DS
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-10-14 14:32:14
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const intlPrefix = 'zmda.resource';
const { common } = codeConfig.code;
const url = `${HLOS_ZMDA}/v1/${getCurrentOrganizationId()}/resource-views`;

export default () => ({
  autoQuery: true,
  selection: false,
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
  },
  queryFields: [
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${intlPrefix}.supplier`).d('供应商编码'),
      lovCode: common.supplier,
      textField: 'supplierNumber',
      ignore: 'always',
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplierObj.supplierId',
    },
    {
      name: 'supplierNumber',
      type: 'string',
      bind: 'supplierObj.supplierNumber',
      ignore: 'always',
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
    },
    {
      name: 'resourceCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resource`).d('资源编码'),
    },
    {
      name: 'resourceName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceName`).d('资源名称'),
    },
  ],
  fields: [
    {
      name: 'supplierNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierNumber`).d('供应商编码'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${intlPrefix}.supplierName`).d('供应商名称'),
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get('lmds.common.model.org').d('组织'),
    },
    {
      name: 'resourceCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resource`).d('资源编码'),
    },
    {
      name: 'resourceName',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.resourceName`).d('资源名称'),
    },
    {
      name: 'resourceAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.resourceAlias`).d('资源简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.resourceDesc`).d('资源描述'),
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourcePicture`).d('图片'),
    },
    {
      name: 'resourceClassMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceClass`).d('资源分类'),
    },
    {
      name: 'resourceTypeMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceType`).d('资源类型'),
    },
    {
      name: 'categoryName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceCategory`).d('资源类别'),
    },
    {
      name: 'chiefPositionName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceChiefPosition`).d('主管岗位'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.location`).d('资源地点'),
    },
    {
      name: 'resourceStatusMeaning',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.resourceStatus`).d('资源状态'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.model.enabledFlag`).d('是否有效'),
    },
  ],
});
