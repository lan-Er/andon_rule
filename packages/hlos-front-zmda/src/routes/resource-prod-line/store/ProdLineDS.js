/*
 * @Author: zilong.wei01@hand-china.com
 * @Date: 2020-09-29 09:59:43
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-29 10:17:58
 * @Description: 制造协同-生产线
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const intlPrefix = 'zmda.prodLine';
const commonCode = 'zmda.common';
const { zmdaProdLine, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/production-line-views/queryForSupplier`;

export default () => ({
  pageSize: 10,
  selection: false,
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
      name: 'prodLineCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLine`).d('生产线'),
    },
    {
      name: 'prodLineName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLineName`).d('生产线名称'),
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
      name: 'prodLineCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLine`).d('生产线'),
      order: 'asc',
    },
    {
      name: 'prodLineName',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.prodLineName`).d('生产线名称'),
    },
    {
      name: 'prodLineAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.prodLineAlias`).d('生产线简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.prodLineDesc`).d('生产线描述'),
    },
    {
      name: 'prodLineType',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLineType`).d('生产线类型'),
      lookupCode: zmdaProdLine.prodLineType,
    },
    {
      name: 'categoryName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLineCategory`).d('生产线类别'),
    },
    {
      name: 'partyName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLineParty`).d('实体'),
    },
    {
      name: 'workerQty',
      type: 'number',
      label: intl.get(`${intlPrefix}.model.prodLineWorkerQty`).d('工人数量'),
    },
    {
      name: 'calendarName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLineCalendar`).d('工作日历'),
    },
    {
      name: 'positionName',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.prodLineChiefPosition`).d('主管岗位'),
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.prodLinePicture`).d('图片'),
    },
    {
      name: 'issueWarehouse',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.issueWm`).d('默认发料仓库'),
    },
    {
      name: 'issueWmArea',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.issueWmArea`).d('默认发料仓储区域'),
    },
    {
      name: 'completeWarehouse',
      type: 'object',
      label: intl.get(`${intlPrefix}.model.completeWm`).d('默认完工仓库'),
    },
    {
      name: 'completeWmArea',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.completeWmArea`).d('默认完工仓储区域'),
    },
    {
      name: 'inventoryWarehouse',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.invWm`).d('默认入库仓库'),
    },
    {
      name: 'inventoryWmArea',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.invWmArea`).d('默认入库仓储区域'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.location`).d('地理位置'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.model.enabledFlag`).d('是否有效'),
    },
  ],
  transport: {
    read: () => ({
      url,
      method: 'GET',
    }),
  },
});
