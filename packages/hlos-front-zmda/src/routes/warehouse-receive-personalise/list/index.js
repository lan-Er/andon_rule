/**
 * @Description: 仓库收货信息维护个性化
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-02-05 13:49:14
 */

import React, { Component, Fragment } from 'react';
import { isUndefined } from 'lodash';
import { Bind } from 'lodash-decorators';
import { Modal } from 'choerodon-ui';
import { DataSet, Table, Button, Form, TextField } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { HLOS_ZMDA } from 'hlos-front/lib/utils/config';
// import withCustomize from 'components/Customize';
import { CustBoxC7N as CustButton, WithCustomizeC7N as WithCustomize } from 'components/Customize';
import { WarehouseReceiveDS, createFormDS } from '../store/WarehouseReceivePersonaliseDS';
import { create } from '@/services/warehouseReceivePersonaliseService';

const { Sidebar } = Modal;
const preCode = 'zmda.warehouseReceive';
const organizationId = getCurrentOrganizationId();

@WithCustomize({
  unitCode: [
    'ZMDA.WAREHOUSE_RECEIVE.GRID',
    'ZMDA.WAREHOUSE_RECEIVE.CREATE',
    'ZMDA.WAREHOUSE_RECEIVE.FILTER',
  ],
})
export default class ZmdaWarehouseReceivePersonalise extends Component {
  tableDS = new DataSet({
    ...WarehouseReceiveDS(),
  });

  formDS = new DataSet({
    ...createFormDS(),
  });

  state = {
    visible: false,
  };

  get columns() {
    return [
      // {
      //   name: 'wmOuObj',
      //   width: 150,
      //   editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      // },
      // { name: 'organizationName', width: 150, editor: false },
      // {
      //   name: 'warehouseObj',
      //   width: 150,
      //   editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
      // },
      // { name: 'warehouseName', width: 150, editor: false },
      // { name: 'contactName', width: 150, editor: true },
      // { name: 'contactPhone', width: 150, editor: true },
      // { name: 'warehouseAddress', width: 150, editor: true },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ['edit'],
        lock: 'right',
      },
    ];
  }

  /**
   * 新建
   */
  @Bind()
  async handleAddLine() {
    this.tableDS.create({}, 0);
  }

  @Bind()
  async handleCreate() {
    this.formDS.current.reset();
    this.setState({
      visible: true,
    });
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
        wmOuId: this.formDS.current.get('wmOuId'),
        wmOuCode: this.formDS.current.get('wmOuCode'),
        wmOuName: this.formDS.current.get('wmOuName'),
        organizationId: this.formDS.current.get('organizationId'),
        organizationCode: this.formDS.current.get('organizationCode'),
        organizationName: this.formDS.current.get('organizationName'),
        warehouseId: this.formDS.current.get('warehouseId'),
        warehouseCode: this.formDS.current.get('warehouseCode'),
        warehouseName: this.formDS.current.get('warehouseName'),
        contactName: this.formDS.current.get('contactName'),
        contactPhone: this.formDS.current.get('contactPhone'),
        warehouseAddress: this.formDS.current.get('warehouseAddress'),
      };
      const res = await create(obj);
      if (res.failed) {
        notification.error({
          message: res.message,
        });
        return;
      }
      notification.success({
        message: '创建成功',
      });
      this.setState({
        visible: false,
      });
      this.tableDS.query();
    } catch (err) {
      console.log(err);
    }
  }

  @Bind()
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const formObj = this.tableDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  render() {
    console.log('this.props.customizeTable', this.props.customizeTable);
    return (
      <Fragment>
        <Header
          title={intl.get(`${preCode}.view.title.warehouseReceive`).d('仓库收货信息维护个性化')}
        >
          <Button icon="add" color="primary" onClick={this.handleAddLine}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button icon="add" color="primary" onClick={this.handleCreate}>
            {intl.get('hzero.common.button.create1').d('新建（侧边栏方式）')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_ZMDA}/v1/${organizationId}/warehouse-contacts/excel`}
            queryParams={this.getExportQueryParams}
          />
          <CustButton
            unit={[
              {
                code: 'ZMDA.WAREHOUSE_RECEIVE.GRID', // 单元编码，必传
                filterCode: 'ZMDA.WAREHOUSE_RECEIVE.FILTER',
              },
            ]}
          />
          <CustButton
            unit={[
              {
                code: 'ZMDA.WAREHOUSE_RECEIVE.CREATE', // 单元编码，必传
              },
            ]}
          />
        </Header>
        <Content>
          {this.props.customizeTable(
            {
              code: 'ZMDA.WAREHOUSE_RECEIVE.GRID', // 单元编码，必传
              filterCode: 'ZMDA.WAREHOUSE_RECEIVE.FILTER',
            },
            <Table
              dataSet={this.tableDS}
              columns={this.columns}
              columnResizable="true"
              editMode="inline"
            />
          )}
          <Sidebar
            title="新增"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            cancelText="取消"
            okText="确定"
            width={600}
            closable
            zIndex="99"
          >
            {this.props.customizeForm(
              {
                code: 'ZMDA.WAREHOUSE_RECEIVE.CREATE', // 必传，和unitCode一一对应
              },
              <Form dataSet={this.formDS}>
                <TextField name="organizationName" disabled />
                <TextField name="warehouseName" disabled />
              </Form>
            )}
          </Sidebar>
          {/* <Form dataSet={this.formDS}>
            <Lov name="wmOuObj" />
            <TextField name="organizationName" disabled />
            <Lov name="warehouseObj" />
            <TextField name="warehouseName" disabled />
            <TextField name="contactName" />
            <TextField name="contactPhone" />
            <TextField name="warehouseAddress" />
          </Form> */}
        </Content>
      </Fragment>
    );
  }
}
