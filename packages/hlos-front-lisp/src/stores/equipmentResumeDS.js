/**
 * @Description: 设备履历
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-09 09:45:02
 * @LastEditors: yu.na
 */

import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';

const preCode = 'lisp.equipmentResume.model';
const url = `${HLOS_LISP}/v1/datas`;
const { loginName } = getCurrentUser();

export const ListDS = () => {
  return {
    autoQuery: true,
    selection: 'single',
    queryFields: [
      {
        name: 'attribute2',
        type: 'string',
        label: intl.get(`${preCode}.equipmentCode`).d('设备编码'),
      },
      {
        name: 'attribute3',
        type: 'string',
        label: intl.get(`${preCode}.equipmentName`).d('设备名称'),
      },
    ],
    fields: [
      {
        name: 'attribute2',
        label: intl.get(`${preCode}.equipmentCode`).d('设备编码'),
      },
      {
        name: 'attribute3',
        label: intl.get(`${preCode}.equipmentName`).d('设备名称'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            functionType: 'EQUIPMENT',
            dataType: 'EQUIPMENT',
            user: loginName,
          },
          method: 'GET',
        };
      },
    },
  };
};
