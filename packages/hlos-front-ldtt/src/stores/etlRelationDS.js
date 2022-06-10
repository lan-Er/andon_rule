/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-03-03 10:08:48
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-15 10:55:58
 */
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LETL } from 'hlos-front/lib/utils/config';

const url = `${HLOS_LETL}/v1/${getCurrentOrganizationId()}/mapping-config`;

const TableDS = () => ({
  autoQuery: true,
  transport: {
    read: (params) => {
      return {
        url: `${url}/get-mapping-header`,
        param: params.data,
        method: 'GET',
      };
    },
    update: ({ data }) => {
      if (data[0] && data[0]._status === 'create') {
        // 新增
        return {
          url: `${url}/change-mapping-header`,
          data,
          method: 'POST',
        };
      }
      return {
        // 更新
        url: `${url}/change-mapping-header`,
        data,
        method: 'POST',
      };
    },
    create: ({ data }) => {
      return {
        url: `${url}/change-mapping-header`,
        data,
        method: 'POST',
      };
    },
    destroy: ({ data }) => {
      return {
        url: `${url}/delete-mapping-header`,
        data: data[0],
        method: 'POST',
      };
    },
  },
  queryFields: [
    {
      name: 'mappingCode',
      label: '映射编码',
      type: 'string',
    },
    {
      name: 'apiClassPath',
      label: 'API路径',
      type: 'string',
    },
    {
      name: 'cleanTableName',
      label: '清洗表名',
      type: 'string',
    },
    {
      name: 'topMapping',
      label: '顶层编码',
      type: 'object',
      lovCode: 'HPFM.ETL_MAPPING_HEADER',
      ignore: 'always',
      lovPara: {
        topFlag: true,
      },
    },
    {
      name: 'topHeaderId',
      type: 'string',
      bind: 'topMapping.headerId',
    },
    {
      name: 'parentMapping',
      label: '父层编码',
      type: 'object',
      lovCode: 'HPFM.ETL_MAPPING_HEADER',
      ignore: 'always',
      lovPara: {
        parentFlag: true,
      },
    },
    {
      name: 'parentHeaderId',
      type: 'string',
      bind: 'parentMapping.headerId',
    },
  ],
  fields: [
    {
      name: 'mappingCode',
      label: '映射编码',
      type: 'string',
      required: true,
    },
    {
      name: 'service',
      label: '服务编码',
      type: 'object',
      lovCode: 'HADM.SERVICE_ROUTE',
      ignore: 'always',
      required: true,
    },
    {
      name: 'serviceCode',
      label: '服务编码',
      type: 'string',
      bind: 'service.serviceCode',
    },
    {
      name: 'apiClassPath',
      label: 'API路径',
      type: 'string',
      required: true,
    },
    {
      name: 'cleanTableName',
      label: '清洗库表名',
      type: 'string',
      required: true,
    },
    {
      name: 'mappingTypeMeaning',
      label: '分发数据类型',
      type: 'string',
    },
    {
      name: 'mappingLevel',
      label: '数据级别',
      type: 'string',
    },
    {
      name: 'priority',
      label: '优先级',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'topMappingCode',
      label: '顶层表名',
      type: 'string',
      ignore: 'always',
    },
    {
      name: 'parentMappingCode',
      label: '父层表名',
      type: 'string',
      ignore: 'always',
    },
    {
      name: 'primarySql',
      label: '主SQL',
      type: 'string',
    },
    {
      name: 'importTypeMeaning',
      label: '导入类型',
      type: 'string',
    },
    {
      name: 'isolationFlag',
      label: '层级是否隔离',
      type: 'string',
    },
    {
      name: 'subMappingField',
      label: '子层级字段',
      type: 'string',
    },
    {
      name: 'primaryKey',
      label: '层级间关联字段',
      type: 'string',
    },
    {
      name: 'mesTableName',
      label: '云mes表名',
      type: 'string',
      required: true,
    },
    {
      name: 'mesPrimaryKey',
      label: '云mes主键',
      type: 'string',
      required: true,
    },
    {
      name: 'datasourceCode',
      label: '主SQL数据源',
      type: 'string',
    },
  ],
});

const HeaderDS = () => ({
  autoQuery: false,
  selection: false,
  autoCreate: true,
  fields: [
    {
      name: 'mappingCode',
      label: '映射编码',
      type: 'string',
      required: true,
    },
    {
      name: 'service',
      label: '服务编码',
      type: 'object',
      lovCode: 'HADM.SERVICE_ROUTE',
      ignore: 'always',
      required: true,
    },
    {
      name: 'serviceCode',
      type: 'string',
      bind: 'service.serviceCode',
    },
    {
      name: 'serviceRouteId',
      type: 'string',
      bind: 'service.serviceRouteId',
    },
    {
      name: 'name',
      type: 'string',
      bind: 'service.name',
    },
    {
      name: 'apiClassPath',
      label: 'API路径',
      type: 'string',
      required: true,
    },
    {
      name: 'cleanTableName',
      label: '清洗库表名',
      type: 'string',
      required: true,
    },
    {
      name: 'mappingType',
      label: '分发数据类型',
      lookupCode: 'HPFM.ETL_MAPPING_TYPE',
      type: 'string',
      required: true,
    },
    {
      name: 'mappingLevel',
      label: '数据级别',
      type: 'number',
      required: true,
    },
    {
      name: 'priority',
      label: '优先级',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'topMappingObj',
      label: '顶层表名',
      type: 'object',
      lovCode: 'HPFM.ETL_MAPPING_HEADER',
      ignore: 'always',
      required: true,
      lovPara: {
        topFlag: true,
      },
    },
    {
      name: 'topMappingCode',
      type: 'string',
      bind: 'topMappingObj.mappingCode',
    },
    {
      name: 'topHeaderId',
      type: 'string',
      bind: 'topMapping.headerId',
    },
    {
      name: 'parentMappingObj',
      label: '父层表名',
      type: 'object',
      lovCode: 'HPFM.ETL_MAPPING_HEADER',
      ignore: 'always',
      required: true,
      lovPara: {
        parentFlag: true,
      },
    },
    {
      name: 'parentMappingCode',
      type: 'string',
      bind: 'parentMappingObj.mappingCode',
    },
    {
      name: 'parentHeaderId',
      type: 'string',
      bind: 'parentMapping.headerId',
    },
    {
      name: 'primarySql',
      label: '主SQL',
      type: 'string',
    },
    {
      name: 'importType',
      label: '导入类型',
      lookupCode: 'HPFM.ETL_IMPORT_TYPE',
      type: 'string',
      required: true,
    },
    {
      name: 'isolationFlag',
      label: '层级是否隔离',
      type: 'string',
    },
    {
      name: 'subMappingField',
      label: '子层级字段',
      type: 'string',
    },
    {
      name: 'primaryKey',
      label: '层级间关联字段',
      type: 'string',
    },
    {
      name: 'mesTableName',
      label: '云mes表名',
      type: 'string',
      required: true,
    },
    {
      name: 'mesPrimaryKey',
      label: '云mes主键',
      type: 'string',
      required: true,
    },
    {
      name: 'datasource',
      label: '清洗数据源',
      type: 'object',
      lovCode: 'LETL.DATASOURCE_VIEW',
      ignore: 'always',
      textField: 'datasourceCode',
      required: true,
    },
    {
      name: 'datasourceCode',
      type: 'string',
      bind: 'datasource.datasourceCode',
    },
    {
      name: 'datasourceId',
      type: 'string',
      bind: 'datasource.datasourceId',
    },
  ],
  transport: {
    read: (params) => {
      return {
        url: `${url}/get-mapping-header`,
        param: params.data,
        method: 'GET',
      };
    },
    submit: ({ data }) => {
      return {
        url: `${url}/change-mapping-header`,
        data: data[0],
        method: 'POST',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
  },
});

const LineDS = () => ({
  autoQuery: false,
  selection: false,
  queryFields: [
    {
      name: 'cleanField',
      label: '清洗字段',
      type: 'string',
    },
    {
      name: 'externalField',
      label: '外部系统字段',
      type: 'string',
    },
  ],
  fields: [
    {
      name: 'cleanField',
      label: '清洗字段',
      type: 'string',
      required: true,
    },
    {
      name: 'externalField',
      label: '外部系统字段',
      type: 'string',
    },
    {
      name: 'description',
      label: '字段描述',
      type: 'string',
    },
    {
      name: 'datasource',
      label: '清洗数据源',
      type: 'object',
      lovCode: 'LETL.DATASOURCE_VIEW',
      ignore: 'always',
      textField: 'datasourceCode',
      required: true,
    },
    {
      name: 'datasourceCode',
      type: 'string',
      bind: 'datasource.datasourceCode',
    },
    {
      name: 'datasourceId',
      type: 'string',
      bind: 'datasource.datasourceId',
    },
    {
      name: 'defaultValue',
      label: '默认值',
      type: 'string',
    },
    {
      name: 'primarySqlFlag',
      label: '是否主SQL取值',
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'cleanUniqueFlag',
      label: '是否唯一性字段',
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'customizeSql',
      label: '自定义SQL',
      type: 'string',
    },
    {
      name: 'notNullFlag',
      label: '是否必输',
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'lovCode',
      label: 'lov',
      type: 'string',
    },
    {
      name: 'regexCode',
      label: '正则表达式',
      type: 'string',
    },
    {
      name: 'updateFlag',
      label: '是否需要更新',
      type: 'boolean',
      defaultValue: true,
    },
    {
      name: 'superFieldFlag',
      label: '是否来源与上层数据',
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'apiField',
      label: '数据分发对应字段',
      type: 'string',
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${url}/get-mapping-line`,
        method: 'GET',
      };
    },
    create: ({ data }) => {
      return {
        url: `${url}/change-mapping-line`,
        data: data[0],
        method: 'POST',
      };
    },
    update: ({ data }) => {
      return {
        url: `${url}/change-mapping-line`,
        data: data[0],
        method: 'POST',
      };
    },
    destroy: ({ data }) => {
      return {
        url: `${url}/delete-mapping-line`,
        data: data[0],
        method: 'POST',
      };
    },
  },
  events: {
    submitSuccess: ({ dataSet }) => dataSet.query(),
  },
});

export { TableDS, HeaderDS, LineDS };
