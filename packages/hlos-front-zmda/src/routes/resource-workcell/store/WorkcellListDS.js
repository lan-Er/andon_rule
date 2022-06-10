/*
 * @Author: zilong.wei01@hand-china.com
 * @Date: 2020-09-29 09:44:41
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-29 09:53:09
 * @Description: 制造协同-工作单元
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { zmdaWorkcell, common } = codeConfig.code;

const preCode = 'zmda.workcell.model';
const commonCode = 'zmda.common.model';
const organizationId = getCurrentOrganizationId();

const commonUrl = `${HLOS_ZMDA}/v1/${organizationId}/workcell-views/queryForSupplier`;

export default () => ({
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'supplierObj',
      type: 'object',
      label: intl.get(`${preCode}.supplier`).d('供应商编码'),
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
      label: intl.get(`${preCode}.supplierName`).d('供应商名称'),
    },
    {
      name: 'workcellCode',
      type: 'string',
      label: intl.get(`${preCode}.wkc`).d('工作单元'),
    },
    {
      name: 'workcellName',
      type: 'string',
      label: intl.get(`${preCode}.wkcName`).d('工作单元名称'),
    },
  ],
  fields: [
    {
      name: 'supplierNumber',
      type: 'string',
      label: intl.get(`${preCode}.supplierNumber`).d('供应商编码'),
    },
    {
      name: 'supplierName',
      type: 'string',
      label: intl.get(`${preCode}.supplierName`).d('供应商名称'),
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${commonCode}.org`).d('组织'),
    },
    {
      name: 'workcellCode',
      type: 'string',
      label: intl.get(`${preCode}.wkc`).d('工作单元'),
    },
    {
      name: 'workcellName',
      type: 'intl',
      label: intl.get(`${preCode}.wkcName`).d('工作单元名称'),
    },
    {
      name: 'workcellAlias',
      type: 'intl',
      label: intl.get(`${preCode}.wkcAlias`).d('工作单元简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${preCode}.wkcDesc`).d('工作单元描述'),
    },
    {
      name: 'workcellType',
      type: 'string',
      label: intl.get(`${preCode}.wkcType`).d('工作单元类型'),
      lookupCode: zmdaWorkcell.workcellType,
    },
    {
      name: 'categoryName',
      type: 'string',
      label: intl.get(`${preCode}.wkcCategory`).d('工作单元类别'),
    },
    {
      name: 'proLineName',
      type: 'string',
      label: intl.get(`${preCode}.wkcProdLine`).d('工作单元所属产线'),
    },
    {
      name: 'workerQty',
      type: 'number',
      label: intl.get(`${preCode}.wkcWorkerQty`).d('工人数量'),
    },
    {
      name: 'calendarName',
      type: 'string',
      label: intl.get(`${preCode}.wkcCalendar`).d('工作日历'),
    },
    {
      name: 'positionName',
      type: 'string',
      label: intl.get(`${preCode}.wkcChiefPosition`).d('主管岗位'),
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${preCode}.wkcPicture`).d('图片'),
    },
    {
      name: 'issueWarehouse',
      type: 'string',
      label: intl.get(`${preCode}.issueWm`).d('默认发料仓库'),
    },
    {
      name: 'issueWmArea',
      type: 'string',
      label: intl.get(`${preCode}.issueWmArea`).d('默认发料仓储区域'),
    },
    {
      name: 'completeWarehouse',
      type: 'string',
      label: intl.get(`${preCode}.completeWm`).d('默认完工仓库'),
    },
    {
      name: 'completeWmArea',
      type: 'string',
      label: intl.get(`${preCode}.completeWmArea`).d('默认完工仓储区域'),
    },
    {
      name: 'inventoryWarehouse',
      type: 'string',
      label: intl.get(`${preCode}.invWm`).d('默认入库仓库'),
    },
    {
      name: 'inventoryWmArea',
      type: 'string',
      label: intl.get(`${preCode}.invWmArea`).d('默认入库仓储区域'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${commonCode}.location`).d('地理位置'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${commonCode}.enabledFlag`).d('是否有效'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: commonUrl,
        data,
        method: 'GET',
      };
    },
  },
});
