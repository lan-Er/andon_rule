/**
 * @Description: 备件现有量DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-04 13:45:00
 * @LastEditors: yu.na
 */

import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import moment from 'moment';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import codeConfig from '@/common/codeConfig';

const organizationId = getCurrentOrganizationId();

const { common, lmesSpareParts } = codeConfig.code;

const preCode = 'lmes.sparePartsOnhand.model';
const commonCode = 'lmes.common.model';
const url = `${HLOS_LMDS}/v1/${organizationId}/spare-parts/querySparePartResourceOnhand`;

const ListDS = () => {
  return {
    selection: false,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.org`).d('组织'),
        lovCode: common.organization,
        ignore: 'always',
        noCache: true,
        required: true,
      },
      {
        name: 'organizationId',
        bind: 'organizationObj.organizationId',
      },
      {
        name: 'organizationName',
        bind: 'organizationObj.organizationName',
        ignore: 'always',
      },
      {
        name: 'sparePartsObj',
        type: 'object',
        label: intl.get(`${preCode}.spareParts`).d('备件'),
        lovCode: lmesSpareParts.spareParts,
        noCache: true,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'sparePartId',
        bind: 'sparePartsObj.sparePartId',
      },
      {
        name: 'sparePartName',
        bind: 'sparePartsObj.sparePartName',
        ignore: 'always',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.warehouse`).d('仓库'),
        lovCode: common.warehouse,
        noCache: true,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'warehouseId',
        bind: 'warehouseObj.warehouseId',
      },
      {
        name: 'warehouseName',
        bind: 'warehouseObj.warehouseName',
        ignore: 'always',
      },
      {
        name: 'wmAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.wmArea`).d('货位'),
        lovCode: common.wmArea,
        noCache: true,
        ignore: 'always',
        cascadeMap: {
          organizationId: 'organizationId',
          warehouseId: 'warehouseId',
        },
      },
      {
        name: 'wmAreaId',
        bind: 'wmAreaObj.wmAreaId',
      },
      {
        name: 'wmAreaName',
        bind: 'wmAreaObj.wmAreaName',
        ignore: 'always',
      },
      {
        name: 'prodLineObj',
        type: 'object',
        lovCode: common.prodLine,
        label: intl.get(`${commonCode}.prodLine`).d('生产线'),
        noCache: true,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'prodLineId',
        bind: 'prodLineObj.prodLineId',
      },
      {
        name: 'prodLineName',
        bind: 'prodLineObj.resourceName',
        ignore: 'always',
      },
      {
        name: 'equipmentObj',
        type: 'object',
        label: intl.get(`${commonCode}.equipment`).d('设备'),
        lovCode: common.equipment,
        noCache: true,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'equipmentId',
        bind: 'equipmentObj.equipmentId',
      },
      {
        name: 'equipmentName',
        bind: 'equipmentObj.equipmentName',
        ignore: 'always',
      },
      {
        name: 'workcellObj',
        type: 'object',
        label: intl.get(`${commonCode}.workcell`).d('工位'),
        lovCode: common.workcell,
        noCache: true,
        ignore: 'always',
        dynamicProps: {
          lovPara: ({ record }) => ({
            organizationId: record.get('organizationId'),
          }),
        },
      },
      {
        name: 'workcellId',
        bind: 'workcellObj.workcellId',
      },
      {
        name: 'workcellName',
        bind: 'workcellObj.workcellName',
        ignore: 'always',
      },

      {
        name: 'locationObj',
        type: 'object',
        label: intl.get(`${commonCode}.location`).d('地点'),
        lovCode: common.location,
        noCache: true,
        ignore: 'always',
      },
      {
        name: 'locationId',
        bind: 'locationObj.locationId',
      },
      {
        name: 'locationName',
        bind: 'locationObj.locationName',
        ignore: 'always',
      },
      {
        name: 'outsideLocation',
        type: 'string',
        label: intl.get(`${preCode}.outsideLocation`).d('外部地点'),
      },
      {
        name: 'sparePartType',
        type: 'string',
        label: intl.get(`${preCode}.type`).d('类型'),
        lookupCode: lmesSpareParts.sparePartsType,
      },
      {
        name: 'categoryObj',
        type: 'object',
        label: intl.get(`${preCode}.category`).d('分类'),
        lovCode: common.categories,
        lovPara: { categorySetCode: 'SPARE_PARTS' },
        noCache: true,
        ignore: 'always',
      },
      {
        name: 'sparePartCategoryId',
        bind: 'categoryObj.categoryId',
      },
      {
        name: 'sparePartCategoryName',
        bind: 'categoryObj.categoryName',
        ignore: 'always',
      },
      {
        name: 'lotNumber',
        type: 'string',
        label: intl.get(`${preCode}.lot`).d('批次'),
      },
      {
        name: 'receivedDateStart',
        type: 'date',
        label: intl.get(`${preCode}.receivedDateStart`).d('接收日期>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('receivedDateEnd')) {
              return 'receivedDateEnd';
            }
          },
        },
      },
      {
        name: 'receivedDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.receivedDateEnd`).d('接收日期<='),
        min: 'receivedDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      {
        name: 'expireDateStart',
        type: 'date',
        label: intl.get(`${preCode}.expireDateStart`).d('失效日期>='),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('expireDateEnd')) {
              return 'expireDateEnd';
            }
          },
        },
      },
      {
        name: 'expireDateEnd',
        type: 'date',
        label: intl.get(`${preCode}.expireDateEnd`).d('失效日期<='),
        min: 'expireDateStart',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATE_FORMAT) : null),
      },
      // {
      //   name: 'sparePartGroup',
      //   type: 'string',
      //   label: intl.get(`${preCode}.sparePartsGroup`).d('分组'),
      // },
      {
        name: 'minQuantity',
        type: 'number',
        label: intl.get(`${preCode}.minNumber`).d('数量>'),
        defaultValue: 0,
        max: 'maxQuantity',
      },
      {
        name: 'maxQuantity',
        type: 'number',
        label: intl.get(`${preCode}.maxNumber`).d('数量<='),
        min: 'minQuantity',
      },
    ],
    fields: [
      {
        name: 'organization',
        label: intl.get(`${commonCode}.org`).d('组织'),
      },
      {
        name: 'sparePart',
        label: intl.get(`${preCode}.spareParts`).d('备件'),
        transformResponse: (val, object) =>
          `${object.sparePartCode || ''} ${object.sparePartName || ''}`,
      },
      {
        name: 'prodLine',
        label: intl.get(`${commonCode}.prodLine`).d('生产线'),
        transformResponse: (val, object) =>
          `${object.prodLineCode || ''} ${object.prodLineName || ''}`,
      },
      {
        name: 'equipment',
        label: intl.get(`${commonCode}.equipment`).d('设备'),
        transformResponse: (val, object) =>
          `${object.equipmentCode || ''} ${object.equipmentName || ''}`,
      },
      {
        name: 'workcell',
        label: intl.get(`${preCode}.workcell`).d('工位'),
        transformResponse: (val, object) =>
          `${object.workcellCode || ''} ${object.workcellName || ''}`,
      },
      {
        name: 'uomName',
        label: intl.get(`${commonCode}.uom`).d('单位'),
      },
      {
        name: 'warehouse',
        label: intl.get(`${commonCode}.warehouse`).d('仓库'),
        transformResponse: (val, object) =>
          `${object.warehouseCode || ''} ${object.warehouseName || ''}`,
      },
      {
        name: 'wmArea',
        label: intl.get(`${commonCode}.wmArea`).d('货位'),
        transformResponse: (val, object) => `${object.wmAreaCode || ''} ${object.wmAreaName || ''}`,
      },
      {
        name: 'wmUnit',
        label: intl.get(`${commonCode}.wmUnit`).d('货格'),
        transformResponse: (val, object) => `${object.wmUnitCode || ''} ${object.wmUnitName || ''}`,
      },
      {
        name: 'location',
        label: intl.get(`${preCode}.location`).d('地点'),
        transformResponse: (val, object) =>
          `${object.locationCode || ''} ${object.locationName || ''}`,
      },
      {
        name: 'outsideLocation',
        label: intl.get(`${preCode}.outsideLocation`).d('外部地点'),
      },
      {
        name: 'resourceLot',
        label: intl.get(`${commonCode}.lot`).d('批次'),
      },
      {
        name: 'quantity',
        label: intl.get(`${preCode}.quantity`).d('现有量'),
      },
      {
        name: 'sparePartCategoryName',
        label: intl.get(`${preCode}.category`).d('分类'),
      },
      {
        name: 'sparePartTypeMeaning',
        label: intl.get(`${preCode}.type`).d('类型'),
      },
      {
        name: 'sparePartGroup',
        label: intl.get(`${preCode}.group`).d('分组'),
      },
      {
        name: 'safetyStockQty',
        label: intl.get(`${preCode}.safetyStock`).d('安全库存'),
      },
      {
        name: 'minStockQty',
        label: intl.get(`${preCode}.minStockQty`).d('最小库存量'),
      },
      {
        name: 'maxStockQty',
        label: intl.get(`${preCode}.maxStockQty`).d('最大库存量'),
      },
      {
        name: 'receivedDate',
        label: intl.get(`${preCode}.receivedDate`).d('接收日期'),
      },
      {
        name: 'expireDate',
        label: intl.get(`${preCode}.expireDate`).d('失效日期'),
      },
      {
        name: 'fileUrl',
        label: intl.get(`${preCode}.picture`).d('图片'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          params: {
            page: data.page || 0,
            size: data.size || 100,
          },
          method: 'POST',
        };
      },
    },
  };
};

const Store = createContext();

export default Store;

export const SparePartsOnhandProvider = (props) => {
  const { children } = props;
  const listDS = useMemo(() => new DataSet(ListDS()), []);

  const value = {
    ...props,
    listDS,
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
