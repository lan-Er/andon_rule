import moment from 'moment';
import intl from 'utils/intl';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { generateUrlWithGetParam, getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZEXE } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';

const { common, zexeProductOrderIOReport } = codeConfig.code;
const preCode = 'zexe.purchaserProductOrderInputOutputReport.model';
const commonCode = 'zexe.common.model';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZEXE}/v1/${organizationId}/report/mo-inputration-purchaser`;

const ListDS = () => {
  return {
    selection: false,
    primaryKey: 'purchaser',
    pageSize: 100,
    transport: {
      read: ({ data }) => {
        const { moStatus } = data;
        return {
          url: generateUrlWithGetParam(url, {
            moStatusList: moStatus,
          }),
          data: {
            ...data,
            moStatus: undefined,
          },
          method: 'GET',
        };
      },
    },
    queryFields: [
      {
        name: 'moObj',
        type: 'object',
        label: intl.get(`${commonCode}.moNum`).d('MO号'),
        lovCode: zexeProductOrderIOReport.supplierMo,
        ignore: 'always',
        lovPara: { documentClass: 'MO' },
        noCache: true,
      },
      {
        name: 'moNum',
        bind: 'moObj.moNum',
      },
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${preCode}.item`).d('物料编码'),
        lovCode: zexeProductOrderIOReport.supplierItem,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'itemCode',
        bind: 'itemObj.itemCode',
      },
      {
        name: 'supplierObj',
        type: 'object',
        label: intl.get(`${preCode}.moStatus`).d('供应商'),
        lovCode: common.supplier,
        required: true,
        ignore: 'always',
      },
      {
        name: 'supplierNumber',
        type: 'string',
        bind: 'supplierObj.supplierNumber',
      },
      {
        name: 'supplierTenantId',
        type: 'string',
        bind: 'supplierObj.supplierTenantId',
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'moTypeObj',
        type: 'object',
        label: intl.get(`${preCode}.moType`).d('MO类型'),
        lovCode: zexeProductOrderIOReport.moType,
        dynamicProps: {
          disabled: ({ record, dataSet }) => {
            const supplierTenantId = record.get('supplierTenantId');
            if (supplierTenantId === undefined) {
              dataSet.current.set('moTypeObj', '');
              return true;
            } else {
              return false;
            }
          },
          lovPara: ({ record }) => ({
            tenantId: record.get('supplierTenantId'),
          }),
        },
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'moTypeCode',
        bind: 'moTypeObj.documentTypeCode',
      },
      {
        name: 'ItemObject',
        type: 'object',
        label: intl.get(`${preCode}.moType`).d('MO组件物料'),
        lovCode: zexeProductOrderIOReport.supplierItem,
        ignore: 'always',
      },
      {
        name: 'componentItemCode',
        bind: 'ItemObject.itemCode',
      },
      {
        name: 'moStatus',
        type: 'string',
        label: intl.get(`${preCode}.moStatus`).d('MO状态'),
        lookupCode: common.moStatus,
        multiple: true,
        defaultValue: ['COMPLETED'],
      },
      {
        name: 'minInputRatio',
        type: 'number',
        label: intl.get(`${preCode}.minInputRation`).d('投入比>=(%)'),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('maxInputRatio')) {
              return 'maxInputRatio';
            }
          },
        },
      },
      {
        name: 'maxInputRatio',
        type: 'number',
        label: intl.get(`${preCode}.maxInputRatio`).d('投入比=<(%)'),
        min: 'minInputRatio',
      },
      {
        name: 'organizationObj',
        type: 'object',
        label: intl.get(`${commonCode}.organzation`).d('组织'),
        lovCode: common.organization,
        lovPara: { organizationClass: 'ME' },
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'organizationCode',
        type: 'string',
        bind: 'organizationObj.organizationCode',
      },
      {
        name: 'minDemandDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.minDemandDate`).d('需求日期从'),
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('maxDemandDate')) {
              return 'maxDemandDate';
            }
          },
        },
      },
      {
        name: 'maxDemandDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.maxDemandDate`).d('需求日期至'),
        min: 'minDemandDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
      {
        name: 'minReleasedDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.minReleasedDate`).d('下达日期从'),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('maxReleasedDate')) {
              return 'maxReleasedDate';
            }
          },
        },
      },
      {
        name: 'maxReleasedDate',
        type: 'dateTime',
        label: intl.get(`${preCode}.maxReleasedDate`).d('下达日期至'),
        min: 'minReleasedDate',
        transformRequest: (val) => (val ? moment(val).format(DEFAULT_DATETIME_FORMAT) : null),
      },
    ],
    fields: [
      {
        name: 'inputRatio',
        label: intl.get(`${preCode}.inputRation`).d('投入比'),
      },
      {
        name: 'ownerOrganizationCode',
        label: intl.get(`${commonCode}.organzation`).d('组织'),
      },
      {
        name: 'moNum',
        label: intl.get(`${commonCode}.moNum`).d('MO号'),
      },
      {
        name: 'itemCode',
        type: 'string',
        label: intl.get(`${preCode}.itemCode`).d('产出物料'),
      },
      {
        name: 'itemDescription',
        type: 'string',
        label: intl.get(`${preCode}.description`).d('产出物料描述'),
      },
      {
        name: 'moDemandQty',
        label: intl.get(`${preCode}.moDemandQty`).d('制造数量'),
      },
      {
        name: 'inventoryQty',
        type: 'string',
        label: intl.get(`${preCode}.inventoryQty`).d('完工入库数量'),
      },
      {
        name: 'moStatus',
        type: 'string',
        label: intl.get(`${preCode}.moStatus`).d('Mo状态'),
      },
      {
        name: 'moTypeCode',
        label: intl.get(`${preCode}.moType`).d('MO类型'),
      },
      {
        name: 'documentTypeName',
        label: intl.get(`${preCode}.moTypeDesc`).d('MO类型描述'),
      },
      {
        name: 'itemUom',
        label: intl.get(`${preCode}.itemUom`).d('物料单位'),
      },
      {
        name: 'inventoryWarehouseCode',
        label: intl.get(`${preCode}.inventoryWarehouseCode`).d('入库仓库'),
      },
      {
        name: 'inOrganizationDescription',
        label: intl.get(`${preCode}.inOrganizationDescription`).d('入库仓库描述'),
      },
      {
        name: 'demandDate',
        label: intl.get(`${preCode}.demandDate`).d('需求日期'),
      },
      {
        name: 'releasedDate',
        label: intl.get(`${preCode}.releasedDate`).d('下达日期'),
      },
      {
        name: 'lineNum',
        label: intl.get(`${preCode}.lineNum`).d('组件行号'),
      },
      {
        name: 'componentItemCode',
        label: intl.get(`${preCode}.componentItemCode`).d('组件物料编码'),
      },
      {
        name: 'moItemDescription',
        label: intl.get(`${preCode}.componentItemDescription`).d('组件物料描述'),
      },
      {
        name: 'componentUom',
        label: intl.get(`${preCode}.componentUom`).d('组件单位'),
      },
      {
        name: 'componentDemandQty',
        label: intl.get(`${preCode}.moDemandQty`).d('需求数量'),
      },
      {
        name: 'componentUsage',
        label: intl.get(`${preCode}.componentUsage`).d('单位用量'),
      },
      {
        name: 'issuedQty',
        label: intl.get(`${preCode}.issuedQty`).d('投料数量'),
      },
      {
        name: 'customerNumber',
        label: intl.get(`${commonCode}.customer`).d('客户'),
      },
      {
        name: 'externalId',
        label: intl.get(`${preCode}.externalId`).d('外部ID'),
      },
      {
        name: 'externalNum',
        label: intl.get(`${preCode}.externalNum`).d('外部编号'),
      },
      {
        name: 'organizationCode',
        label: intl.get(`${preCode}.organizationCode`).d('发料仓库'),
      },
      {
        name: 'outOrganizationDescription',
        label: intl.get(`${preCode}.outOrganizationDescription`).d('发料仓库描述'),
      },
      {
        name: 'issueControlType',
        label: intl.get(`${preCode}.issueControlType`).d('组件投料限制类型'),
      },
      {
        name: 'issueControlValue',
        label: intl.get(`${preCode}.issueControlValue`).d('组件投料限制值'),
      },
      {
        name: 'supplyType',
        label: intl.get(`${preCode}.supplyType`).d('组件供应类型'),
      },
      {
        name: 'substituteGroup',
        label: intl.get(`${preCode}.substituteGroup`).d('替代组'),
      },
    ],
  };
};

const SummaryDS = () => {
  return {
    // autoQuery: true,
    selection: false,
    transport: {
      read: ({ data }) => {
        const { moStatus } = data;
        return {
          url: generateUrlWithGetParam(`${url}/item`, {
            moStatusList: moStatus,
          }),
          data: {
            ...data,
            moStatus: undefined,
          },
          method: 'GET',
        };
      },
    },
    queryFields: [
      {
        name: 'itemObj',
        type: 'object',
        label: intl.get(`${preCode}.item`).d('物料编码'),
        lovCode: common.itemMe,
        ignore: 'always',
        noCache: true,
      },
      {
        name: 'componentItemCode',
        bind: 'itemObj.itemCode',
      },
      {
        name: 'minInputRatio',
        type: 'number',
        label: intl.get(`${preCode}.inputRatioStart`).d('投入比>=(%)'),
        dynamicProps: {
          max: ({ record }) => {
            if (record.get('maxInputRatio')) {
              return 'maxInputRatio';
            }
          },
        },
      },
      {
        name: 'maxInputRatio',
        type: 'number',
        label: intl.get(`${preCode}.inputRatioEnd`).d('投入比=<(%)'),
        min: 'minInputRatio',
      },
    ],
    fields: [
      {
        name: 'totalInputRatio',
        label: intl.get(`${preCode}.inputRation`).d('投入比'),
      },
      {
        name: 'componentItemCode',
        label: intl.get(`${preCode}.componentItem`).d('组件物料'),
      },
      {
        name: 'componentItemDescription',
        label: intl.get(`${preCode}.componentItemDescription`).d('组件物料描述'),
      },
      {
        name: 'totalDemandQty',
        label: intl.get(`${preCode}.totalDemandQty`).d('累计需求数量'),
      },
      {
        name: 'totalIssuedQty',
        label: intl.get(`${preCode}.totalIssuedQty`).d('累计投入数量'),
      },
      {
        name: 'uom',
        label: intl.get(`${preCode}.uom`).d('组件单位'),
      },
    ],
  };
};

export { ListDS, SummaryDS };
