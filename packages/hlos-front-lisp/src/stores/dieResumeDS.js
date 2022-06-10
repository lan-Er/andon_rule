/**
 * @Description: 模具履历
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-09 09:45:02
 * @LastEditors: yu.na
 */

import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';

const preCode = 'lisp.dieResume.model';
const url = `${HLOS_LISP}/v1/datas`;
const { loginName } = getCurrentUser();

export const ListDS = () => {
  return {
    autoQuery: true,
    selection: 'single',
    queryFields: [
      {
        name: 'attribute1',
        type: 'string',
        label: intl.get(`${preCode}.dieCode`).d('模具编码'),
      },
      {
        name: 'attribute2',
        type: 'string',
        label: intl.get(`${preCode}.dieName`).d('模具名称'),
      },
    ],
    fields: [
      {
        name: 'attribute1',
        label: intl.get(`${preCode}.dieCode`).d('模具编码'),
      },
      {
        name: 'attribute2',
        label: intl.get(`${preCode}.dieName`).d('模具名称'),
      },
    ],
    transport: {
      read: ({ data }) => {
        return {
          url,
          data: {
            ...data,
            functionType: 'DIE',
            dataType: 'DIE',
            user: loginName,
          },
          method: 'GET',
        };
      },
    },
  };
};
