/*
 * @Author: zilong.wei01@hand-china.com
 * @Date: 2020-09-29 09:44:41
 * @LastEditors: zilong.wei01@hand-china.com
 * @LastEditTime: 2020-09-29 09:51:17
 * @Description: 制造协同-设备
 */

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const intlPrefix = 'zmda.equipment';
const commonPrefix = 'zmda.common';
const { zmdaEquipment, common } = codeConfig.code;
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZMDA}/v1/${organizationId}/equipment-views/queryForSupplier`;

export default () => ({
  autoQuery: true,
  selection: false,
  pageSize: 10,
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
      name: 'equipmentCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentNumber`).d('设备编码'),
    },
    {
      name: 'equipmentName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentName`).d('设备名称'),
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
      label: intl.get(`${commonPrefix}.model.org`).d('组织'),
    },
    {
      name: 'equipmentCode',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentNumber`).d('设备编码'),
    },
    {
      name: 'equipmentName',
      type: 'intl',
      required: true,
      label: intl.get(`${intlPrefix}.model.equipmentName`).d('设备名称'),
    },
    {
      name: 'equipmentAlias',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.equipmentAlias`).d('设备简称'),
    },
    {
      name: 'description',
      type: 'intl',
      label: intl.get(`${intlPrefix}.model.equipmentDesc`).d('设备描述'),
    },
    {
      name: 'equipmentType',
      type: 'string',
      lookupCode: zmdaEquipment.equipmentType,
      label: intl.get(`${intlPrefix}.model.equipmentType`).d('设备类型'),
    },
    {
      name: 'fileUrl',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentPicture`).d('图片'),
    },
    {
      name: 'categoryName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentCategory`).d('设备类别'),
    },
    {
      name: 'prodLineName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.ownProdLine`).d('所属生产线'),
    },
    {
      name: 'workcellName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.ownWorkcell`).d('所属工作单元'),
    },
    {
      name: 'unitName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentOwner`).d('所有者'),
    },
    {
      name: 'chiefPosition',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentChiefPosition`).d('主管岗位'),
    },
    {
      name: 'calendarName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentCalendar`).d('工作日历'),
    },
    {
      name: 'assetNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentAssetNum`).d('资产编号'),
    },
    {
      name: 'equipmentStatus',
      type: 'string',
      lookupCode: zmdaEquipment.equipmentStatus,
      label: intl.get(`${intlPrefix}.model.equipmentStatus`).d('设备状态'),
    },
    {
      name: 'purchaseDate',
      type: 'date',
      format: DEFAULT_DATE_FORMAT,
      label: intl.get(`${intlPrefix}.model.equipmentPurchaseDate`).d('设备采购日期'),
    },
    {
      name: 'startUseDate',
      type: 'date',
      format: DEFAULT_DATE_FORMAT,
      label: intl.get(`${intlPrefix}.model.equipmentStartUseDate`).d('开始使用日期'),
    },
    {
      name: 'supplier',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentSupplier`).d('供应商'),
    },
    {
      name: 'manufacturer',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentManufacturer`).d('制造商'),
    },
    {
      name: 'nameplateNumber',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentNameplateNum`).d('设备铭牌号'),
    },
    {
      name: 'servicePhone',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentServicePhone`).d('维修电话'),
    },
    {
      name: 'maintenanceInterval',
      type: 'number',
      label: intl.get(`${intlPrefix}.model.maintenanceInterval`).d('检修周期'),
    },
    {
      name: 'maintenanceNeedDays',
      type: 'number',
      label: intl.get(`${intlPrefix}.model.maintenanceNeedDays`).d('检修所需时间'),
    },
    {
      name: 'maintenancedTimes',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.maintenancedTimes`).d('累计检修次数'),
    },
    {
      name: 'lastTpmDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.lastTpmDate`).d('上次检修时间'),
    },
    {
      name: 'lastTpmManName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.lastTpmMan`).d('上次检修人'),
    },
    {
      name: 'nextTpmStartDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.nextTpmStartDate`).d('下次计划检修开始时间'),
    },
    {
      name: 'nextTpmEndDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.nextTpmEndDate`).d('下次计划检修结束时间'),
    },
    {
      name: 'breakdownTimes',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.breakdownTimes`).d('累计故障次数'),
    },
    {
      name: 'lastBreakdowmDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.lastBreakdownDate`).d('上次故障时间'),
    },
    {
      name: 'lastRepairedDate',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.lastRepairedDate`).d('上次维修时间'),
    },
    {
      name: 'lastRepairedManName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.lastRepairedMan`).d('上次维修人'),
    },
    {
      name: 'bomName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentBom`).d('设备BOM'),
    },
    {
      name: 'valueCurrencyName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.equipmentValueCurrency`).d('估值货币'),
    },
    {
      name: 'initialValue',
      type: 'number',
      label: intl.get(`${intlPrefix}.model.equipmentInitialValue`).d('初始价值'),
    },
    {
      name: 'currentValue',
      type: 'number',
      label: intl.get(`${intlPrefix}.model.equipmentCurrentValue`).d('当前价值'),
    },
    {
      name: 'locationName',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.location`).d('地理位置'),
    },
    {
      name: 'outsideLocation',
      type: 'string',
      label: intl.get(`${intlPrefix}.model.outSideLocation`).d('外部地点'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get(`${commonPrefix}.model.remark`).d('备注'),
    },
    {
      name: 'enabledFlag',
      type: 'boolean',
      label: intl.get(`${intlPrefix}.model.enabledFlag`).d('是否有效'),
    },
  ],
  transport: {
    read: () => {
      return {
        url,
        method: 'GET',
      };
    },
  },
});
