/**
 * @Description: 备件现有量DS
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-04 13:45:00
 * @LastEditors: yu.na
 */

import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';

const { loginName } = getCurrentUser();

const preCode = 'lisp.sparePartsOnhand.model';
const url = `${HLOS_LISP}/v1/datas`;

const ListDS = () => {
  return {
    selection: false,
    queryFields: [
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${preCode}.org`).d('组织'),
        lovCode: 'LISP.SPARE_PARTS_ORGANIZATION',
        ignore: 'always',
        required: true,
      },
      {
        name: 'attribute1',
        bind: 'organizationObj.attribute2',
      },
      {
        name: 'sparePartsObj',
        type: 'object',
        label: intl.get(`${preCode}.spareParts`).d('备件'),
        lovCode: 'LISP.SPARE_PARTS',
        ignore: 'always',
      },
      {
        name: 'attribute6',
        bind: 'sparePartsObj.attribute1',
      },
      {
        name: 'warehouseObj',
        type: 'object',
        label: intl.get(`${preCode}.warehouse`).d('仓库'),
        lovCode: 'LISP.SPARE_PARTS_WAREHOUSE',
        ignore: 'always',
      },
      {
        name: 'attribute2',
        bind: 'warehouseObj.attribute1',
      },
      {
        name: 'wmAreaObj',
        type: 'object',
        label: intl.get(`${preCode}.wmArea`).d('货位'),
        lovCode: 'LISP.SPARE_PARTS_AREA',
        ignore: 'always',
      },
      {
        name: 'attribute4',
        bind: 'wmAreaObj.attribute1',
      },
      {
        name: 'attribute11',
        type: 'string',
        label: intl.get(`${preCode}.type`).d('类型'),
        dynamicProps: {
          lookupAxiosConfig: () => ({
            url,
            method: 'GET',
            params: {
              functionType: 'SPARE_PARTS',
              dataType: 'SPARE_PARTS_TYPE',
              user: loginName,
            },
            transformResponse(data) {
              let newData = [];
              if (typeof data === 'string' && data.indexOf('PERMISSION_NOT_PASS') === -1) {
                if (typeof JSON.parse(data) === 'object' && JSON.parse(data).content) {
                  JSON.parse(data).content.forEach((item) => {
                    newData.push({
                      value: item.attribute2,
                      meaning: item.attribute2,
                    });
                  });
                }
              } else {
                newData = data;
              }
              return newData;
            },
          }),
        },
      },
      {
        name: 'categoryObj',
        type: 'object',
        label: intl.get(`${preCode}.category`).d('分类'),
        lovCode: 'LISP.SPARE_PARTS_CATEGORY',
        ignore: 'always',
      },
      {
        name: 'attribute12',
        bind: 'categoryObj.attribute2',
      },
      {
        name: 'resourceObj',
        type: 'object',
        label: intl.get(`${preCode}.resource`).d('资源'),
        lovCode: 'LISP.SPARE_PARTS_RESOURCE',
        ignore: 'always',
      },
      {
        name: 'attribute14',
        bind: 'resourceObj.attribute2',
      },
      {
        name: 'attribute13',
        type: 'string',
        label: intl.get(`${preCode}.group`).d('分组'),
      },
    ],
    fields: [
      {
        name: 'attribute1',
        label: intl.get(`${preCode}.org`).d('组织'),
      },
      {
        name: 'attribute2',
        label: intl.get(`${preCode}.warehouse`).d('仓库'),
        transformResponse: (val, object) =>
          `${object.attribute2}-${object.attribute3}`.replace(/undefined/g, ' '),
      },
      {
        name: 'attribute4',
        label: intl.get(`${preCode}.wmArea`).d('货位'),
        transformResponse: (val, object) =>
          `${object.attribute4}-${object.attribute5}`.replace(/undefined/g, ' '),
      },
      {
        name: 'attribute6',
        label: intl.get(`${preCode}.spareParts`).d('备件'),
      },
      {
        name: 'attribute7',
        label: intl.get(`${preCode}.sparePartsName`).d('备件名称'),
      },
      {
        name: 'attribute8',
        label: intl.get(`${preCode}.lot`).d('批次'),
      },
      {
        name: 'attribute9',
        label: intl.get(`${preCode}.quantity`).d('现有量'),
      },
      {
        name: 'attribute10',
        label: intl.get(`${preCode}.uom`).d('单位'),
      },
      {
        name: 'attribute11',
        label: intl.get(`${preCode}.type`).d('类型'),
      },
      {
        name: 'attribute12',
        label: intl.get(`${preCode}.category`).d('分类'),
      },
      {
        name: 'attribute13',
        label: intl.get(`${preCode}.group`).d('分组'),
      },
      {
        name: 'attribute14',
        label: intl.get(`${preCode}.resource`).d('指定资源'),
      },
      {
        name: 'attribute15',
        label: intl.get(`${preCode}.safetyStock`).d('安全库存'),
      },
      {
        name: 'attribute16',
        label: intl.get(`${preCode}.minStockQty`).d('最小库存量'),
      },
      {
        name: 'attribute17',
        label: intl.get(`${preCode}.maxStockQty`).d('最大库存量'),
      },
      {
        name: 'attribute18',
        label: intl.get(`${preCode}.receivedDate`).d('接收日期'),
      },
      {
        name: 'attribute19',
        label: intl.get(`${preCode}.expireDate`).d('失效日期'),
      },
      {
        name: 'attribute20',
        label: intl.get(`${preCode}.picture`).d('图片'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            functionType: 'SPARE_PARTS',
            dataType: 'SPARE_PARTS_ONHAND',
          },
          method: 'GET',
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
