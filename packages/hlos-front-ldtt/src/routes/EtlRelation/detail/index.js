/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-03-03 10:12:20
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-09 15:37:34
 */
import React, { Fragment } from 'react';
import {
  DataSet,
  Table,
  Button,
  Form,
  TextField,
  NumberField,
  Select,
  SelectBox,
  Lov,
  notification,
} from 'choerodon-ui/pro';

import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { HeaderDS, LineDS } from '@/stores/etlRelationDS';
import style from './index.less';

const { Option } = Select;

@connect()
export default class IotMappingRelationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerId: '',
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.setState({
      headerId: params.id,
    });

    this.headerDS.setQueryParameter('headerId', params.id);
    this.lineDS.setQueryParameter('mappingHeaderId', params.id);
    this.headerDS.query();
    this.lineDS.query();
  }

  headerDS = new DataSet(HeaderDS());

  lineDS = new DataSet(LineDS());

  getLineColum() {
    return [
      {
        name: 'cleanField',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        name: 'externalField',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        name: 'description',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        name: 'datasource',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        name: 'defaultValue',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        name: 'primarySqlFlag',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        name: 'cleanUniqueFlag',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        name: 'customizeSql',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        name: 'notNullFlag',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        name: 'lovCode',
        align: 'center',
        width: 150,
        editor: true,
      },
      // {
      //   name: 'importTypeMeaning',
      //   align: 'center',
      //   width: 150,
      //   editor: true,
      // },
      {
        name: 'regexCode',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        name: 'updateFlag',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        name: 'superFieldFlag',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        name: 'apiField',
        align: 'center',
        width: 150,
        editor: true,
      },
      {
        header: '操作',
        lock: 'right',
        align: 'center',
        command: ['edit', 'delete'],
      },
    ];
  }

  tableProps = {
    dataSet: this.lineDS,
    columns: this.getLineColum(),
    columnResizable: true,
    queryFieldsLimit: 4,
    editMode: 'inline',
  };

  @Bind
  async handleSave() {
    const continueFlag = await this.headerDS.validate(false, false);
    if (!continueFlag) {
      notification.warning({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }

    this.headerDS.submit();
  }

  @Bind
  handleCreate() {
    const { headerId } = this.state;
    this.lineDS.create({ mappingHeaderId: headerId }, 0);
  }

  @Bind
  handleLineSave() {
    this.lineDS.submit();
  }

  /**
   * 删除头信息
   * @param {*} record 行记录
   */
  @Bind
  async handleDelhead(record) {
    this.lineDS.delete([record]);
  }

  render() {
    return (
      <Fragment>
        <Header title="ETL关系配置详情" backPath="/ldtt/etl-relation/list">
          <Button onClick={this.handleSave}>保存</Button>
        </Header>
        <Content>
          <div className={style['title-content']}>
            <p>头信息</p>
          </div>

          <Form dataSet={this.headerDS} style={{ flex: '1 1 auto' }} columns={3}>
            <TextField name="mappingCode" disabled />

            <Lov name="service" noCache />

            <TextField name="apiClassPath" />

            <TextField name="cleanTableName" />

            <Select name="mappingType" />
            <NumberField name="mappingLevel" />

            <NumberField name="priority" />

            <Lov name="topMappingObj" noCache />

            <Lov name="parentMappingObj" noCache />
            <TextField name="primarySql" />
            <Select name="importType" />

            {/* <TextField name="isolationFlag" /> */}
            <SelectBox name="isolationFlag">
              <Option value="true">是</Option>
              <Option value="false">否</Option>
            </SelectBox>
            <TextField name="subMappingField" />
            <TextField name="primaryKey" />
            <TextField name="mesTableName" />
            <TextField name="mesPrimaryKey" />
            <Lov name="datasource" noCache />

            {/* <TextArea newLine rowSpan={2} colSpan={2} name="primarySql" style={{ height: 80 }} /> */}
          </Form>

          <div className={style['title-content']}>
            <p>行信息</p>
          </div>

          <Table
            {...this.tableProps}
            buttons={[
              ['add', { onClick: () => this.handleCreate() }],
              ['save', { onClick: () => this.handleLineSave() }],
            ]}
          />
        </Content>
      </Fragment>
    );
  }
}
