/*
 * @Descripttion: 收货记录
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-26 15:15:26
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-26 17:03:45
 */

import { connect } from 'dva';
import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Table,
  Form,
  Lov,
  TextField,
  DatePicker,
  Select,
  Tabs,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
// import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';

import { getCurrentOrganizationId } from 'utils/utils';
import { ReceiptListDS } from '../store/indexDS';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.deliveryApply';
const receiptListDS = (roleType) => new DataSet(ReceiptListDS(roleType));
const organizationId = getCurrentOrganizationId();
function ZcomDeliveryApply() {
  const ListDS = useDataSet(() => receiptListDS());
  const [hidden, setHidden] = useState(true);
  const [queryFieldList, setQueryFieldList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [relationColumns, setRelationColumns] = useState([]);

  useEffect(() => {
    handleTypeChange();
    setColumns(listColumns);
  }, []);

  const listColumns = [
    {
      name: 'executeOrderNum',
      width: 150,
      lock: 'left',
    },
    { name: 'executeLineNum', lock: 'left' },
    { name: 'executeOrderTypeMeaning', width: 150 },
    {
      header: '物料信息',
      name: 'itemCode',
      width: 150,
      renderer: ({ record }) => {
        const {
          receivingType = '',
          recvItemCode = '',
          recvItemDesc = '',
          customerItemDesc = '',
          customerItemCode = '',
          executeOrderType = '',
          supplierItemCode = '',
          supplierItemDesc = '',
        } = record.data;
        if (receivingType === 'SUB_COMPANY' || receivingType === 'THIRD_SUPPLIER') {
          return (
            <>
              <div>{recvItemCode}</div>
              <div>{recvItemDesc}</div>
            </>
          );
        }

        if (executeOrderType === 'CUSTOMER_SUPPLY_ACCEPTANCE') {
          return (
            <>
              <div>{supplierItemCode}</div>
              <div>{supplierItemDesc}</div>
            </>
          );
        }

        return (
          <>
            <div>{customerItemCode}</div>
            <div>{customerItemDesc}</div>
          </>
        );
      },
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          value &&
          value.attributeValue1 && (
            <ItemAttributeSelect
              data={value}
              itemId={record.get('supplierItemId')}
              itemDesc={record.get('supplierItemDesc')}
              disabled
            />
          )
        );
      },
    },
    {
      name: 'recvExecuteQty',
      renderer: ({ record }) => {
        const {
          executeOrderType = '',
          recvExecuteQty = '',
          customerExecuteQty = '',
          supplierExecuteQty = '',
        } = record.data;
        if (executeOrderType === 'THIRD_PARTY_ACCEPTANCE') {
          return recvExecuteQty;
        }

        if (executeOrderType === 'CUSTOMER_SUPPLY_ACCEPTANCE') {
          return supplierExecuteQty;
        }

        return customerExecuteQty;
      },
    },
    { name: 'executeDate', width: 150 },
    {
      name: 'customerBusinessUnitName',
      width: 150,
      renderer: ({ record, value }) => {
        const {
          receivingType = '',
          recvBusinessUnitName = '',
          recvSupplierBuName = '',
          executeOrderType = '',
          supplierBusinessUnitName = '',
        } = record.data;
        if (receivingType === 'SUB_COMPANY') {
          return recvBusinessUnitName;
        }
        if (receivingType === 'THIRD_SUPPLIER') {
          return recvSupplierBuName;
        }

        if (executeOrderType === 'CUSTOMER_SUPPLY_ACCEPTANCE') {
          return supplierBusinessUnitName;
        }

        return value;
      },
    },
    {
      name: 'customerInventoryOrgName',
      width: 150,
      renderer: ({ record, value }) => {
        const {
          receivingType = '',
          recvInventoryOrgName = '',
          recvSupplierOrgName = '',
          executeOrderType = '',
          supplierInventoryOrgName = '',
        } = record.data;
        if (receivingType === 'SUB_COMPANY') {
          return recvInventoryOrgName;
        }
        if (receivingType === 'THIRD_SUPPLIER') {
          return recvSupplierOrgName;
        }

        if (executeOrderType === 'CUSTOMER_SUPPLY_ACCEPTANCE') {
          return supplierInventoryOrgName;
        }

        return value;
      },
    },
    { name: 'executeWorker', width: 150 },
  ];

  const relationListColumns = [
    {
      name: 'executeOrderNum',
      width: 150,
      lock: 'left',
    },
    { name: 'executeLineNum', lock: 'left' },
    { name: 'poNum', width: 150 },
    { name: 'poLineNum', width: 130 },
  ];

  const handleReceiptSourceChange = () => {
    clearTenantId();
    const receiptSource =
      ListDS.queryDataSet &&
      ListDS.queryDataSet.current &&
      ListDS.queryDataSet.current.get('receiptSource');

    if (receiptSource === 'CUSTOMER_SUPPLY') {
      // ListDS.setQueryParameter('recvSupplierTenantId', getCurrentOrganizationId());
      ListDS.queryDataSet.fields.get('customerObj').set('lovCode', 'ZMDA.CUSTOMER');
    }

    if (receiptSource === 'BRANCH_CO_SUPPLY') {
      // ListDS.setQueryParameter('recvTenantId', getCurrentOrganizationId());
      ListDS.queryDataSet.fields.get('customerObj').set('lovCode', 'ZMDA.COMPANY');
    }
  };

  const clearTenantId = () => {
    ListDS.setQueryParameter('customerTenantId', null);
    // ListDS.setQueryParameter('recvSupplierTenantId', null);
    // ListDS.setQueryParameter('recvTenantId', null);
    ListDS.setQueryParameter('recvCompanyId', null);
    ListDS.setQueryParameter('customerId', null);
  };

  const handleTypeChange = () => {
    clearTenantId();
    const cloneCommonQuery = commonQuery.slice();
    let cloneListColumns = listColumns.slice();
    let cloneRelationListColumns = relationListColumns.slice();
    const thirdReceive = [
      <Select name="receiptSource" key="receiptSource" onChange={handleReceiptSourceChange} />,
      <Lov name="customerObj" noCache key="customerObj" />,
    ];

    const customerQuery = [
      <Lov name="supplierInventoryOrgObj" noCache key="supplierInventoryOrgObj" />,
      <TextField name="executeWorker" key="executeWorker" />,
    ];

    const thirdRelationColums = [
      { name: 'customerName', width: 150 },
      {
        name: 'customerItemCode',
        width: 150,
        renderer: ({ record }) => {
          const { customerItemCode = '', customerItemDesc = '' } = record.data;
          return (
            <>
              <div>{customerItemCode}</div>
              <div>{customerItemDesc}</div>
            </>
          );
        },
      },
      {
        name: 'itemAttr',
        width: 150,
        renderer: ({ record, value }) => {
          return (
            <ItemAttributeSelect
              data={value}
              itemId={record.get('supplierItemId')}
              itemDesc={record.get('supplierItemDesc')}
              disabled
            />
          );
        },
      },
      { name: 'customerExecuteQty' },
      {
        name: 'inventoryOrgName',
        width: 150,
        renderer: ({ record }) => {
          return record.get('customerInventoryOrgName');
        },
      },
    ];

    const supplyRelationColums = [
      { name: 'customerName', width: 150 },
      {
        name: 'customerItemCode',
        width: 150,
        renderer: ({ record }) => {
          const { customerItemCode = '', customerItemDesc = '' } = record.data;
          return (
            <>
              <div>{customerItemCode}</div>
              <div>{customerItemDesc}</div>
            </>
          );
        },
      },
      {
        name: 'itemAttr',
        width: 150,
        renderer: ({ record, value }) => {
          return (
            <ItemAttributeSelect
              data={value}
              itemId={record.get('supplierItemId')}
              itemDesc={record.get('supplierItemDesc')}
              disabled
            />
          );
        },
      },
      { name: 'customerExecuteQty' },
      {
        name: 'inventoryOrgName',
        width: 150,
        renderer: ({ record }) => {
          return record.get('customerInventoryOrgName');
        },
      },
    ];

    const purchaseRelationColums = [
      { name: 'sourceDocNum', width: 150 },
      { name: 'sourceDocLineNum' },
      { name: 'supplierName', width: 150 },
      {
        name: 'supplierItemCode',
        width: 150,
        renderer: ({ record }) => {
          const { supplierItemCode = '', supplierItemDesc = '' } = record.data;
          return (
            <>
              <div>{supplierItemCode}</div>
              <div>{supplierItemDesc}</div>
            </>
          );
        },
      },
    ];

    const executeOrderType =
      ListDS.queryDataSet &&
      ListDS.queryDataSet.current &&
      ListDS.queryDataSet.current.get('executeOrderType') &&
      ListDS.queryDataSet.current.get('executeOrderType');

    if (executeOrderType === 'THIRD_PARTY_ACCEPTANCE') {
      cloneCommonQuery.splice(1, 0, ...thirdReceive);
      cloneListColumns = cloneListColumns.concat([
        { name: 'sourceDocNum', width: 150 },
        { name: 'sourceDocLineNum' },
      ]);

      cloneRelationListColumns = cloneRelationListColumns.concat(thirdRelationColums);

      cloneListColumns[3].header = '接收方物料信息';

      ListDS.queryDataSet.fields.get('receiptSource').set('required', true);
    } else {
      cloneRelationListColumns = cloneRelationListColumns.concat(purchaseRelationColums);
      ListDS.queryDataSet.fields.get('receiptSource').set('required', false);
    }

    if (executeOrderType === 'PURCHASE_ACCEPTANCE') {
      cloneCommonQuery.splice(6, 0, ...customerQuery);
      ListDS.setQueryParameter('customerTenantId', organizationId);
    }

    if (executeOrderType === 'CUSTOMER_SUPPLY_ACCEPTANCE') {
      ListDS.queryDataSet.fields.get('customerObj').set('lovCode', 'ZMDA.CUSTOMER');
      cloneCommonQuery.splice(1, 0, <Lov name="companyObj" noCache key="companyObj" />);
      cloneCommonQuery.splice(2, 1, <Lov name="customerObj" noCache key="customerObj" />);

      cloneListColumns = cloneListColumns.concat([
        { name: 'sourceDocNum', width: 150 },
        { name: 'sourceDocLineNum' },
      ]);

      cloneRelationListColumns = cloneRelationListColumns.concat(supplyRelationColums);
      cloneRelationListColumns.splice(11, 1);
      cloneRelationListColumns[3].header = '关联订单外协行号';
    }

    setQueryFieldList(cloneCommonQuery);
    setColumns(cloneListColumns);
    setRelationColumns(cloneRelationListColumns);
  };

  const commonQuery = [
    <Select name="executeOrderType" key="executeOrderType" onChange={handleTypeChange} />,
    <Lov name="supplierObj" noCache key="supplierObj" />,
    <TextField name="executeOrderNum" key="executeOrderNum" />,
    <TextField name="sourceDocNum" key="sourceDocNum" />,
    <TextField name="poNum" key="poNum" />,
    <Lov name="businessUnitObj" noCache key="businessUnitObj" />,
    <DatePicker name="executeDateStart" key="executeDateStart" />,
  ];

  /**
   * 切换显示隐藏
   */
  const handleToggle = () => {
    setHidden(!hidden);
  };

  /**
   * 查询
   */
  const handleSearch = async () => {
    ListDS.query();
  };

  const handleTabChange = () => {};

  /**
   * 重置
   */
  const handleReset = () => {
    ListDS.queryDataSet.current.reset();
  };

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.deliveryApplyToSupplier`).d('收货记录')} />
      <Content>
        <div style={{ display: 'flex', marginBottom: 10, alignItems: 'flex-start' }}>
          <Form dataSet={ListDS.queryDataSet} columns={3} style={{ flex: '1 1 auto' }}>
            {hidden ? queryFieldList.slice(0, 3) : queryFieldList}
          </Form>
          <div
            style={{
              marginLeft: 8,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              paddingTop: '10px',
            }}
          >
            <Button onClick={handleToggle}>
              {hidden
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Tabs defaultActiveKey="willReceive" onChange={handleTabChange}>
          <TabPane tab="收货信息" key="willReceive">
            <Table
              dataSet={ListDS}
              columns={columns}
              columnResizable="true"
              queryBar="none"
              rowHeight="auto"
            />
          </TabPane>
          <TabPane tab="关联信息" key="maintain">
            <Table
              dataSet={ListDS}
              columns={relationColumns}
              columnResizable="true"
              queryBar="none"
              rowHeight="auto"
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default connect()(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomDeliveryApply)
);
