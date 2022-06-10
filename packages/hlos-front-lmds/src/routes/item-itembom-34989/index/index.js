import { Table, DataSet, Button, Lov } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import ItemBom from '../store/FormDS';
import { openTab } from 'utils/menuTab';
import queryString from 'query-string';
import statusConfig from '@/common/statusConfig';

const organizationId = getCurrentOrganizationId();
const excelUrl = `${HLOS_LMDS}/v1/${organizationId}/item-boms/excel`;
const preCode = 'lmds.itemBom';
const {
  importTemplateCode: { itemBom },
} = statusConfig.statusValue.lmds;

class itemBoms extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formDS = new DataSet({
    ...ItemBom(),
    autoQuery: true,
  });

  columns = [
    {
      name: 'organizationObj',
      width: 128,
      editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
    },
    {
      name: 'item',
      width: 100,
      editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
    },
    { name: 'itemDescription', width: 100 },
    {
      name: 'itemCategory',
      width: 100,
      editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
    },
    {
      name: 'bom',
      width: 100,
      editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
    },
    { name: 'bomDescription', width: 100 },
    { name: 'primaryFlag', width: 100, editor: true },
    { name: 'startDate', width: 100, editor: true },
    { name: 'endDate', width: 100, editor: true },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 120,
      command: ['edit'],
      lock: 'right',
      align: 'center',
    },
  ];

  /**
   * 导出接口获取查询参数
   * @return 查询参数
   */
  @Bind()
  getExportQueryParams() {
    console.log(this);
    const formObj = this.formDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    console.log(fieldsValue);
    return {
      ...fieldsValue,
    };
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.formDS.create({}, 0);
  }

  /**
   * 导入
   */
  @Bind
  handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${itemBom}`,
        title: intl.get(`${preCode}.view.title.itemBomImport`).d('物料BOM导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
        }),
      });
    } catch (e) {
      console.error(e.message);
    }
  }

  render() {
    return (
      <div>
        <Fragment>
          <Header title="物料BOM">
            <Button icon="add" color="primary" onClick={this.handleAddLine}>
              {intl.get('hzero.common.button.create').d('新建')}
            </Button>
            <ExcelExport requestUrl={excelUrl} queryParams={this.getExportQueryParams} />
            <Button icon="upload" onClick={this.handleBatchExport}>
              {intl.get('lmds.common.button.import').d('导入')}
            </Button>
          </Header>
          <Content>
            <Table
              dataSet={this.formDS}
              columnDraggable
              columns={this.columns}
              bordered
              queryFieldsLimit={3}
              editMode="inline"
            />
          </Content>
        </Fragment>
      </div>
    );
  }
}
export default itemBoms;
