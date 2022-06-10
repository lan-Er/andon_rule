/*
 * @Descripttion: ETL关系配置
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-03-03 10:06:13
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-09 15:41:04
 */
import React, { Fragment } from 'react';
import {
  DataSet,
  Table,
  Button,
  Modal,
  Form,
  TextField,
  SelectBox,
  NumberField,
  Select,
  Lov,
  notification,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { createEtlHeader } from '../../services/etlrelation';
import { TableDS } from '@/stores/etlRelationDS';

const key1 = Modal.key();
const { Option } = Select;
@connect()
export default class EtlRelation extends React.Component {
  tableDS = new DataSet(TableDS());

  tableColumns() {
    return [
      {
        name: 'mappingCode',
        align: 'center',
        width: 150,
      },
      {
        name: 'serviceCode',
        align: 'center',
        width: 150,
      },
      {
        name: 'apiClassPath',
        align: 'center',
        width: 150,
      },
      {
        name: 'cleanTableName',
        align: 'center',
        width: 150,
      },
      {
        name: 'mappingTypeMeaning',
        align: 'center',
        width: 150,
      },
      {
        name: 'mappingLevel',
        align: 'center',
        width: 150,
      },
      {
        name: 'priority',
        align: 'center',
        width: 150,
      },
      {
        name: 'topMappingCode',
        align: 'center',
        width: 150,
      },
      {
        name: 'parentMappingCode',
        align: 'center',
        width: 150,
      },
      {
        name: 'primarySql',
        align: 'center',
        width: 150,
      },
      {
        name: 'importTypeMeaning',
        align: 'center',
        width: 150,
      },
      {
        name: 'isolationFlag',
        align: 'center',
        width: 150,
      },
      {
        name: 'subMappingField',
        align: 'center',
        width: 150,
      },
      {
        name: 'primaryKey',
        align: 'center',
        width: 150,
      },
      {
        name: 'mesTableName',
        align: 'center',
        width: 150,
      },
      {
        name: 'mesPrimaryKey',
        align: 'center',
        width: 150,
      },
      {
        name: 'datasourceCode',
        align: 'center',
        width: 150,
      },
      {
        header: '操作',
        width: 150,
        lock: 'right',
        command: ({ record }) => {
          return [
            <a onClick={() => this.handleToDetailPage(record)}>详情</a>,
            <Button onClick={() => this.handleDelhead(record)}>删除</Button>,
          ];
        },
      },
    ];
  }

  tableProps = {
    dataSet: this.tableDS,
    columns: this.tableColumns(),
    columnResizable: true,
    queryFieldsLimit: 4,
    editMode: 'inline',
  };

  headerDS = new DataSet({
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
        name: 'topMapping',
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
        bind: 'topMapping.mappingCode',
      },
      {
        name: 'topHeaderId',
        type: 'string',
        bind: 'topMapping.headerId',
      },
      {
        name: 'parentMapping',
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
        bind: 'parentMapping.mappingCode',
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
        name: 'dataType',
        label: '数据类型',
        lookupCode: 'HPFM.ETL_DATA_TYPE',
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
        label: '主SQL数据源',
        type: 'object',
        lovCode: 'LETL.DATASOURCE',
        textField: 'dataSourceCode',
        required: true,
        ignore: 'always',
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
  });

  @Bind
  handleCreat() {
    this.headerDS.reset();

    Modal.open({
      closable: true,
      key: key1,
      title: '新增ETL关系配置',
      drawer: true,
      style: {
        width: 500,
      },
      children: (
        <Form dataSet={this.headerDS}>
          <TextField name="mappingCode" />

          <Lov name="service" />

          <TextField name="apiClassPath" />

          <TextField name="cleanTableName" />

          <Select name="mappingType" />

          <NumberField name="mappingLevel" />

          <NumberField name="priority" />

          <Lov name="topMapping" />
          <Lov name="parentMapping" />
          <TextField name="primarySql" />

          <Select name="dataType" />
          <Select name="importType" />

          <SelectBox name="isolationFlag">
            <Option value="true">是</Option>
            <Option value="false">否</Option>
          </SelectBox>
          <TextField name="subMappingField" />
          <TextField name="primaryKey" />
          <TextField name="mesTableName" />
          <TextField name="mesPrimaryKey" />

          <Lov name="datasource" />
        </Form>
      ),
      onOk: this.handleComfirm,
    });
  }

  @Bind
  async handleComfirm() {
    const continueFlag = await this.headerDS.validate(false, false);
    if (!continueFlag) {
      notification.warning({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }

    await createEtlHeader(this.headerDS.current.toData()).then((res) => {
      if (!res || !res.failed) {
        notification.success({
          message: '保存成功',
        });
        this.tableDS.query();
      }
    });
  }

  /**
   * 跳转历史界面
   * @param {*} record 行记录
   */
  @Bind
  handleToDetailPage(record) {
    const { data } = record;
    const pathname = `/ldtt/etl-relation/detail/${data.headerId}`;
    this.props.history.push({
      pathname,
    });
  }

  /**
   * 删除头信息
   * @param {*} record 行记录
   */
  @Bind
  async handleDelhead(record) {
    this.tableDS.delete([record]);
  }

  render() {
    return (
      <Fragment>
        <Header title="ETL关系配置">
          <Button onClick={this.handleCreat}>新建</Button>
        </Header>
        <Content>
          <Table {...this.tableProps} />
        </Content>
      </Fragment>
    );
  }
}
