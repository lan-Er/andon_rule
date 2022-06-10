import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.bom.model';

export default () => ({
  primaryKey: 'id',
  parentField: 'parentId',
  idField: 'id',
  fields: [
    {
      name: 'id',
      type: 'number',
    },
    {
      name: 'parentId',
      type: 'number',
    },
    {
      name: 'bomId',
      type: 'string',
      label: intl.get(`${preCode}.bom`).d('BOM'),
    },
    {
      name: 'chridlenList',
    },
    {
      name: 'itemCodeAndDescription',
      type: 'string',
      label: intl.get(`${preCode}.item`).d('物料'),
    },
  ],
  transport: {
    read: ({ data }) => {
      let params;
      if (data.itemBomId) {
        params = {
          itemBomId: data.itemBomId,
        };
      }
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/bom-components/tree-list`,
        data: params,
        method: 'GET',
      };
    },
  },
});
