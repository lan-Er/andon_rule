/**
 * @Description: 制造协同-物料主数据
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-09-29 14:51:36
 */

import React, { Component, Fragment } from 'react';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { Modal } from 'choerodon-ui';
import { DataSet, Table, Button, Form, Lov, TextField } from 'choerodon-ui/pro';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
import ItemListDS from './store/ItemListDS';
import ItemCreateDS from './store/ItemCreateDS';
import { itemMappingCreate, itemMappingsDelete, itemMappings } from '@/services/item';

const preCode = 'zmda.item';
const { Sidebar } = Modal;
const organizationId = getCurrentOrganizationId();

export default class ZmdaItem extends Component {
  constructor(props) {
    super(props);
    this.tableDS = new DataSet({
      ...ItemListDS(),
    });
    this.formDS = new DataSet({
      ...ItemCreateDS(),
    });
  }

  state = {
    visible: false,
  };

  async componentDidMount() {
    await this.formDS.create({});
  }

  get columns() {
    return [
      { name: 'organizationName', width: 150, lock: true },
      { name: 'meOuName', width: 150, lock: true },
      { name: 'itemCode', width: 150, lock: true },
      { name: 'description', width: 150, lock: true },
      { name: 'itemAlias', width: 150 },
      { name: 'shortCode', width: 150 },
      { name: 'itemType', width: 150 },
      { name: 'designCode', width: 150 },
      { name: 'specification', width: 150 },
      { name: 'uomName', width: 150 },
      { name: 'supplierObj', editor: true, width: 150 },
      { name: 'supplierItemObj', editor: true, width: 150 },
      { name: 'supplierItemDescription', width: 150 },
      { name: 'supplierItemUom', width: 150 },
      { name: 'mappingStatus', width: 150 },
    ];
  }

  @Bind()
  handleCreate() {
    this.formDS.current.reset();
    this.setState({
      visible: true,
    });
  }

  @Bind()
  handleCancel() {
    this.setState({ visible: false });
  }

  @Bind()
  async handleOk() {
    const validateValue = await this.formDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }
    try {
      const obj = {
        enterpriseId: this.formDS.current.get('enterpriseId'),
        itemId: this.formDS.current.get('itemId'),
        supplierId: this.formDS.current.get('supplierId'),
        supplierItemId: this.formDS.current.get('supplierItemId'),
      };
      const res = await itemMappingCreate([obj]);
      if (res.failed) {
        throw res;
      } else {
        notification.success({
          message: '新建成功',
        });
        this.setState({
          visible: false,
        });
        this.tableDS.query();
      }
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
  }

  lineValidate() {
    const arr = [];
    this.tableDS.selected.forEach((v) => {
      arr.push(v.validate(true, false));
    });
    return arr;
  }

  @Bind()
  async handleMappings() {
    if (!this.tableDS.selected.length) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }
    let flag = true;
    const validateResult = await Promise.all(this.lineValidate());
    validateResult.forEach((v) => {
      flag = flag && v;
    });
    if (!flag) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }
    const arr = [];
    this.tableDS.selected.forEach((v) => {
      const obj = filterNullValueObject({
        itemId: v.data.itemId,
        itemMappingId: v.data.itemMappingId,
        _token: v.data._token,
        objectVersionNumber: v.data.objectVersionNumber,
        supplierId: (v.data.supplierObj && v.data.supplierObj.supplierId) || v.data.supplierId,
        supplierItemId:
          (v.data.supplierItemObj && v.data.supplierItemObj.itemId) || v.data.supplierItemId,
      });
      arr.push(obj);
    });
    try {
      const res = await itemMappings(arr);
      if (!isEmpty(res) && res.failed && res.message) {
        throw res;
      } else {
        notification.success({
          message: '操作成功',
        });
        this.tableDS.query();
      }
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
  }

  @Bind()
  async handleDelete() {
    if (!this.tableDS.selected.length) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }
    const arr = [];
    this.tableDS.selected.forEach((v) => {
      if (v.data.itemMappingId) {
        const obj = {
          itemId: v.data.itemId,
          itemMappingId: v.data.itemMappingId,
          _token: v.data._token,
          objectVersionNumber: v.data.objectVersionNumber,
          supplierId: (v.data.supplierObj && v.data.supplierObj.supplierId) || v.data.supplierId,
          supplierItemId:
            (v.data.supplierItemObj && v.data.supplierItemObj.itemId) || v.data.supplierItemId,
        };
        arr.push(obj);
      }
    });
    try {
      const res = await itemMappingsDelete(arr);
      if (!isEmpty(res) && res.failed && res.message) {
        throw res;
      } else {
        notification.success({
          message: '删除成功',
        });
        this.tableDS.query();
      }
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
  }

  @Bind()
  getExportQueryParams() {
    const { tableDS } = this;
    const queryDataDs = tableDS && tableDS.queryDataSet && tableDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  render() {
    return (
      <Fragment>
        <Header title={intl.get(`${preCode}.view.title.item`).d('物料')}>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/item-views/excel`}
            queryParams={this.getExportQueryParams}
          />
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          {/* <Button>{intl.get('hzero.common.button.save').d('保存')}</Button> */}
          <Button onClick={this.handleDelete}>
            {intl.get('hzero.common.button.deleteMap').d('删除映射')}
          </Button>
          <Button onClick={this.handleMappings}>
            {intl.get('hzero.common.button.bulkMap').d('批量映射')}
          </Button>
        </Header>
        <Content>
          <Table dataSet={this.tableDS} columns={this.columns} columnResizable="true" />
          <Sidebar
            title="新增物料映射"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            cancelText="取消"
            okText="确定"
            width={600}
            closable
            zIndex="999"
            mask={false}
          >
            <Form dataSet={this.formDS}>
              <Lov name="enterpriseObj" />
              <Lov name="itemObj" />
              <TextField name="description" disabled />
              <Lov name="supplierObj" />
              <Lov name="supplierItemObj" />
              <TextField name="supplierItemDescription" disabled />
            </Form>
          </Sidebar>
        </Content>
      </Fragment>
    );
  }
}
