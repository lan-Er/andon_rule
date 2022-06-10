/*
 * @Descripttion: 待收货列表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-26 15:15:26
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-26 17:03:45
 */

import { connect } from 'dva';
import React, { useState, useEffect, Fragment } from 'react';
import { DataSet, Button, Table, Form, Lov, TextField, DatePicker, Select } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
import { Button as ButtonPermission } from 'components/Permission';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import { DeliveryOrderListDS } from '../store/indexDS';

const intlPrefix = 'zcom.deliveryApply';
const deliveryOrderListDS = (roleType) => new DataSet(DeliveryOrderListDS(roleType));

function ZcomDeliveryApply({ history }) {
  const ListDS = useDataSet(() => deliveryOrderListDS(), ZcomDeliveryApply);
  const [hidden, setHidden] = useState(true);
  const [queryFieldList, setQueryFieldList] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    handleReceiptTypeChange();
  }, []);

  function handleToDetail(id, deliveryView) {
    if (deliveryView === 'TO_SUPPLIER') {
      history.push({
        pathname: `/zcom/delivery-to-receipt/supply/${id}`,
        state: {},
      });
      return;
    }

    history.push({
      pathname: `/zcom/delivery-to-receipt/detail/${id}`,
      state: {},
    });
  }

  const listColumns = [
    {
      name: 'deliveryOrderNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('deliveryOrderId');
        const deliveryView = record.get('deliveryView');

        return <a onClick={() => handleToDetail(id, deliveryView)}>{value}</a>;
      },
      lock: 'left',
    },
    { name: 'supplierName', width: 150 },
    {
      name: 'recvName',
      width: 150,
      renderer: ({ record }) => {
        const { receivingType = '', recvSupplierName = '', recvCompanyName = '' } = record.data;
        if (receivingType === 'SUB_COMPANY') {
          return recvCompanyName;
        }

        if (receivingType === 'THIRD_SUPPLIER') {
          return recvSupplierName;
        }

        return '';
      },
    },
    { name: 'deliveryOrderDate', width: 150 },
    { name: 'arrivalDate', width: 150 },
    { name: 'customerInventoryOrgName', width: 150 },
    { name: 'recvInventoryOrgName', width: 150 },
    { name: 'consignerName', width: 150 },
    { name: 'consignerPhone', width: 150 },
    { name: 'receivingAddress', width: 150 },
    { name: 'consigneeName', width: 150 },
    { name: 'consigneePhone', width: 150 },
    // { name: 'relatedDeliveryApplyNum', width: 150 },
    { name: 'externalStockInStatusMeaning', lock: 'right' },
    { name: 'deliveryOrderStatusMeaning', lock: 'right' },
  ];

  const handleReceiptTypeChange = () => {
    const cloneCommonQuery = commonQuery.slice();
    const cloneListColumns = listColumns.slice();
    clearTenantId();
    const thirdReceive = [
      <Select name="receiptSource" key="receiptSource" onChange={handleReceiptSourceChange} />,
      <Lov name="customerObj" noCache key="customerObj" />,
    ];

    const receiptType =
      ListDS.queryDataSet &&
      ListDS.queryDataSet.current &&
      ListDS.queryDataSet.current.get('receiptType');

    ListDS.queryDataSet.fields.get('receiptSource').set('required', false);

    if (receiptType === 'THIRD_PARTY_ACCEPTANCE') {
      cloneCommonQuery.splice(1, 0, ...thirdReceive);
      cloneListColumns.splice(1, 0, { name: 'customerName', width: 150 });
      ListDS.queryDataSet.fields.get('receiptSource').set('required', true);
      ListDS.setQueryParameter('deliveryView', 'TO_THRID_PARTY');
    }

    if (receiptType === 'PURCHASE_ACCEPTANCE') {
      ListDS.setQueryParameter('customerTenantId', getCurrentOrganizationId());
      ListDS.setQueryParameter('deliveryView', 'TO_CUSTOMER');
    }

    if (receiptType === 'CUSTOMER_SUPPLY_ACCEPTANCE') {
      cloneCommonQuery.splice(1, 1, <Lov name="customerObj" noCache key="customerObj" />);
      cloneListColumns.splice(2, 1);
      cloneListColumns.splice(5, 1);
      cloneListColumns.splice(7, 0, { name: 'supplierInventoryOrgName', width: 150 });

      ListDS.setQueryParameter('supplierTenantId', getCurrentOrganizationId());
      ListDS.setQueryParameter('deliveryView', 'TO_SUPPLIER');
    }

    setQueryFieldList(cloneCommonQuery);
    setColumns(cloneListColumns);
  };

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
    ListDS.setQueryParameter('supplierTenantId', null);
  };

  const commonQuery = [
    <Select name="receiptType" key="receiptType" onChange={handleReceiptTypeChange} />,
    <Lov name="supplierObj" key="supplierObj" noCache />,
    <Lov name="companyObj" key="companyObj" noCache />,
    <TextField name="deliveryOrderNum" key="deliveryOrderNum" />,
    <TextField name="sourceDocNum" key="sourceDocNum" />,
    <Select name="deliveryOrderType" key="deliveryOrderType" />,
    // <Select name="deliveryOrderStatusList" key="deliveryOrderStatusList" />,
    <Select name="externalStockInStatus" key="externalStockInStatus" />,
    <DatePicker name="deliveryOrderDateStart" key="deliveryOrderDateStart" />,
    <DatePicker name="arrivalDateStart" key="arrivalDateStart" />,
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

  /**
   * 重置
   */
  const handleReset = () => {
    ListDS.queryDataSet.current.reset();
  };

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.deliveryApplyToSupplier`).d('待收货列表')}>
        <>
          <ButtonPermission
            type="c7n-pro"
            permissionList={[
              {
                code: `hzmc.zcom.receipt.delivery.ps.button.release`,
                type: 'button',
                meaning: '重新下发',
              },
            ]}
          >
            重新下发
          </ButtonPermission>
        </>
      </Header>
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
        <Table dataSet={ListDS} columns={columns} columnResizable="true" queryBar="none" />
      </Content>
    </Fragment>
  );
}

export default connect()(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomDeliveryApply)
);
