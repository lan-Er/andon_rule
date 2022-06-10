/**
 * @Description: 方案包基础数据
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-09 09:45:02
 * @LastEditors: yu.na
 */

import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';

const preCode = 'lisp.solutionPackage.model';
const url = `${HLOS_LISP}/v1/datas`;

const fields = [
  {
    name: 'user',
    label: intl.get(`${preCode}.user`).d('用户'),
  },
  {
    name: 'functionType',
    label: intl.get(`${preCode}.functionType`).d('方案包'),
  },
  {
    name: 'dataType',
    label: intl.get(`${preCode}.dataType`).d('数据类型'),
  },
  {
    name: 'attribute1',
    label: intl.get(`${preCode}.attribute1`).d('字段1'),
  },
  {
    name: 'attribute2',
    label: intl.get(`${preCode}.attribute2`).d('字段2'),
  },
  {
    name: 'attribute3',
    label: intl.get(`${preCode}.attribute3`).d('字段3'),
  },
  {
    name: 'attribute4',
    label: intl.get(`${preCode}.attribute4`).d('字段4'),
  },
  {
    name: 'attribute5',
    label: intl.get(`${preCode}.attribute5`).d('字段5'),
  },
  {
    name: 'attribute6',
    label: intl.get(`${preCode}.attribute6`).d('字段6'),
  },
  {
    name: 'attribute7',
    label: intl.get(`${preCode}.attribute7`).d('字段7'),
  },
  {
    name: 'attribute8',
    label: intl.get(`${preCode}.attribute8`).d('字段8'),
  },
  {
    name: 'attribute9',
    label: intl.get(`${preCode}.attribute9`).d('字段9'),
  },
  {
    name: 'attribute10',
    label: intl.get(`${preCode}.attribute10`).d('字段10'),
  },
  {
    name: 'attribute11',
    label: intl.get(`${preCode}.attribute11`).d('字段11'),
  },
  {
    name: 'attribute12',
    label: intl.get(`${preCode}.attribute12`).d('字段12'),
  },
  {
    name: 'attribute13',
    label: intl.get(`${preCode}.attribute13`).d('字段13'),
  },
  {
    name: 'attribute14',
    label: intl.get(`${preCode}.attribute14`).d('字段14'),
  },
  {
    name: 'attribute15',
    label: intl.get(`${preCode}.attribute15`).d('字段15'),
  },
  {
    name: 'attribute16',
    label: intl.get(`${preCode}.attribute16`).d('字段16'),
  },
  {
    name: 'attribute17',
    label: intl.get(`${preCode}.attribute17`).d('字段17'),
  },
  {
    name: 'attribute18',
    label: intl.get(`${preCode}.attribute18`).d('字段18'),
  },
  {
    name: 'attribute19',
    label: intl.get(`${preCode}.attribute19`).d('字段19'),
  },
  {
    name: 'attribute20',
    label: intl.get(`${preCode}.attribute20`).d('字段20'),
  },
  {
    name: 'attribute21',
    label: intl.get(`${preCode}.attribute21`).d('字段21'),
  },
  {
    name: 'attribute22',
    label: intl.get(`${preCode}.attribute22`).d('字段22'),
  },
  {
    name: 'attribute23',
    label: intl.get(`${preCode}.attribute23`).d('字段23'),
  },
  {
    name: 'attribute24',
    label: intl.get(`${preCode}.attribute24`).d('字段24'),
  },
  {
    name: 'attribute25',
    label: intl.get(`${preCode}.attribute25`).d('字段25'),
  },
  {
    name: 'attribute26',
    label: intl.get(`${preCode}.attribute26`).d('字段26'),
  },
  {
    name: 'attribute27',
    label: intl.get(`${preCode}.attribute27`).d('字段27'),
  },
  {
    name: 'attribute28',
    label: intl.get(`${preCode}.attribute28`).d('字段28'),
  },
  {
    name: 'attribute29',
    label: intl.get(`${preCode}.attribute29`).d('字段29'),
  },
  {
    name: 'attribute30',
    label: intl.get(`${preCode}.attribute30`).d('字段30'),
  },
  {
    name: 'attribute31',
    label: intl.get(`${preCode}.attribute31`).d('字段31'),
  },
  {
    name: 'attribute32',
    label: intl.get(`${preCode}.attribute32`).d('字段32'),
  },
  {
    name: 'attribute33',
    label: intl.get(`${preCode}.attribute33`).d('字段33'),
  },
  {
    name: 'attribute34',
    label: intl.get(`${preCode}.attribute34`).d('字段35'),
  },
  {
    name: 'attribute36',
    label: intl.get(`${preCode}.attribute36`).d('attribute36'),
  },
  {
    name: 'attribute37',
    label: intl.get(`${preCode}.attribute37`).d('字段37'),
  },
  {
    name: 'attribute38',
    label: intl.get(`${preCode}.attribute38`).d('字段38'),
  },
  {
    name: 'attribute39',
    label: intl.get(`${preCode}.attribute39`).d('字段39'),
  },
  {
    name: 'attribute40',
    label: intl.get(`${preCode}.attribute40`).d('字段40'),
  },
  {
    name: 'attribute41',
    label: intl.get(`${preCode}.attribute41`).d('字段41'),
  },
  {
    name: 'attribute42',
    label: intl.get(`${preCode}.attribute42`).d('字段42'),
  },
  {
    name: 'attribute43',
    label: intl.get(`${preCode}.attribute43`).d('字段43'),
  },
  {
    name: 'attribute44',
    label: intl.get(`${preCode}.attribute44`).d('字段44'),
  },
  {
    name: 'attribute45',
    label: intl.get(`${preCode}.attribute45`).d('字段45'),
  },
  {
    name: 'attribute46',
    label: intl.get(`${preCode}.attribute46`).d('字段46'),
  },
  {
    name: 'attribute47',
    label: intl.get(`${preCode}.attribute47`).d('字段47'),
  },
  {
    name: 'attribute48',
    label: intl.get(`${preCode}.attribute48`).d('字段48'),
  },
  {
    name: 'attribute49',
    label: intl.get(`${preCode}.attribute49`).d('字段49'),
  },
  {
    name: 'attribute50',
    label: intl.get(`${preCode}.attribute50`).d('字段50'),
  },
];

const ListDS = () => {
  return {
    autoQuery: true,
    selection: false,
    queryFields: [
      {
        name: 'user',
        type: 'string',
        label: intl.get(`${preCode}.user`).d('用户'),
      },
      {
        name: 'functionType',
        type: 'string',
        label: intl.get(`${preCode}.functionType`).d('方案包'),
        lookupCode: 'LISP.FUNCTION_TYPE',
      },
      {
        name: 'dataType',
        type: 'string',
        label: intl.get(`${preCode}.dataType`).d('数据类型'),
      },
    ],
    fields,
    transport: {
      read: () => {
        return {
          url,
          method: 'GET',
        };
      },
    },
  };
};

const Store = createContext();

export default Store;

export const SolutionPackageProvider = (props) => {
  const { children } = props;
  const listDS = useMemo(() => new DataSet(ListDS()), []);

  const value = {
    ...props,
    listDS,
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
