import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
// import codeConfig from '@/common/codeConfig';

// const { lmdsBom, common } = codeConfig.code;

const organizationId = getCurrentOrganizationId();
const preCode = 'lmds.bom.model';

export default () => ({
  selection: false,
  fields: [
    {
      name: 'bomLineNum',
      type: 'string',
      label: intl.get(`${preCode}.NO`).d('行号'),
    },
    {
      name: 'organizationName',
      type: 'string',
      label: intl.get(`${preCode}.organization`).d('组织'),
    },
    {
      name: 'componentItemCode',
      type: 'string',
      label: intl.get(`${preCode}.component`).d('组件'),
    },
    {
      name: 'componentItemDescription',
      label: intl.get(`${preCode}.itemDesc`).d('物料描述'),
    },
    {
      name: 'bomUsage',
      label: intl.get(`${preCode}.bomUsage`).d('BOM用量'),
    },
    {
      name: 'uomName',
      label: intl.get(`${preCode}.uom`).d('单位'),
    },
    {
      name: 'componentShrinkage',
      label: intl.get(`${preCode}.shrinkage`).d('损耗率'),
    },
    {
      name: 'operation',
      label: intl.get(`${preCode}.operation`).d('工序'),
    },
    {
      name: 'makeBuyCodeMeaning',
      label: intl.get(`${preCode}.makeBuy`).d('自制外购'),
    },
    {
      name: 'supplyTypeMeaning',
      label: intl.get(`${preCode}.supplyType`).d('供应类型'),
    },
    {
      name: 'wmSite',
      label: intl.get(`${preCode}.wmSite`).d('供应库位'),
    },
    {
      name: 'supplyWarehouseName',
      label: intl.get(`${preCode}.warehouseName`).d('仓库'),
    },
    {
      name: 'supplyWmAreaName',
      label: intl.get(`${preCode}.wmAreaName`).d('库位'),
    },
    {
      name: 'ecnNum',
      label: intl.get(`${preCode}.ecnNum`).d('ECN编号'),
    },
    {
      name: 'substitute',
      label: intl.get(`${preCode}.substitute`).d('替代设置'),
    },
    {
      name: 'remark',
      label: intl.get(`${preCode}.remark`).d('备注'),
    },
    {
      name: 'startDate',
      type: 'date',
      label: intl.get(`${preCode}.startDate`).d('开始日期'),
    },
    {
      name: 'endDate',
      type: 'date',
      label: intl.get(`${preCode}.endDate`).d('结束日期'),
    },
  ],
  transport: {
    read: ({ data }) => {
      let params;
      if (data.bomId) {
        params = {
          bomId: data.bomId,
        };
      }
      return {
        url: `${HLOS_LMDS}/v1/${organizationId}/bom-components`,
        data: params,
        method: 'GET',
      };
    },
  },
});
