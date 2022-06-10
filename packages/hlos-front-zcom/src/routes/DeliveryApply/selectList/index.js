/**
 * @Description: 发货预约-待发货明细
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-13 15:33:33
 */

import React, { useState, useEffect, Fragment } from 'react';
import { DataSet, Button, Tabs, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { findStrIndex } from '@/utils/renderer';
import { SourceLineDS } from '../store/indexDS';
import { OutSourceLineDS } from '../store/outDS';
import TabPanePermission from '@/components/TabPanePermission';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.deliveryApply';
const organizationId = getCurrentOrganizationId();
const sourceLineDS = (roleType) => new DataSet(SourceLineDS(roleType));
const outSourceLineDS = (roleType) => new DataSet(OutSourceLineDS(roleType));

function ZcomDeliveryApplySelect({ history, location }) {
  const roleType = getRoleType(); // 当前角色类型 客户customer/供应商supplier
  const SourceDS = useDataSet(() => sourceLineDS(roleType));
  const OutSourceDS = useDataSet(() => outSourceLineDS(roleType));

  const [conType, setConType] = useState('');
  const [curTab, setCurTab] = useState('source');

  // 通过截取路由地址的内容获取当前角色类型
  function getRoleType() {
    const { pathname } = location;
    const pIndex = findStrIndex(pathname, '/', 2);
    const nIndex = findStrIndex(pathname, '/', 3);
    return pathname.substring(pIndex + 1, nIndex);
  }

  useEffect(() => {
    if (roleType === 'customer') {
      SourceDS.setQueryParameter('customerTenantId', organizationId);
      SourceDS.setQueryParameter('supplierTenantId', null);
    }
    if (roleType === 'supplier') {
      SourceDS.setQueryParameter('supplierTenantId', organizationId);
      SourceDS.setQueryParameter('customerTenantId', null);
    }
    SourceDS.query();
  }, []);

  function handleSetConType(controllerType) {
    setConType(controllerType);
  }

  function handleCreate() {
    let ds;
    if (curTab === 'source') {
      ds = SourceDS;
    }
    if (curTab === 'outsource') {
      ds = OutSourceDS;
    }
    if (!ds.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }
    let sameFlag = true; // 判断所选行的销售库存组织和采购方库存组织是否一致
    const arr = ds.selected.map((v, index) => {
      if (index + 1 < ds.selected.length) {
        sameFlag =
          sameFlag &&
          v.data.customerInventoryOrgId === ds.selected[index + 1].data.customerInventoryOrgId &&
          v.data.supplierInventoryOrgId === ds.selected[index + 1].data.supplierInventoryOrgId;
      }
      return curTab === 'source' ? v.data.sourceDocLineId : v.data.poOutsourceId;
    });
    if (!sameFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.noSame`)
          .d('客户/供应商组织不一致，无法合并进行发货预约'),
      });
      return;
    }
    history.push({
      pathname:
        curTab === 'source'
          ? `/zcom/delivery-apply/${roleType}/create`
          : `/zcom/delivery-apply/${roleType}/out/create`,
      state: {
        ids: arr,
      },
    });
  }

  function handleTabChange(key) {
    setCurTab(key);
    if (key === 'source') {
      SourceDS.query();
    }
    if (key === 'outsource') {
      OutSourceDS.query();
    }
  }

  const sourceArr = [
    {
      name: 'customerItemDesc',
      width: 150,
      renderer: ({ record }) => (
        <>
          <div>{record.get('customerItemCode')}</div>
          <div>{record.get('customerItemDesc')}</div>
        </>
      ),
    },
    {
      name: 'supplierItemDesc',
      width: 150,
      minWidth: 120,
      renderer: ({ record }) => (
        <>
          <div>{record.get('supplierItemCode')}</div>
          <div>{record.get('supplierItemDesc')}</div>
        </>
      ),
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return value && value.attributeValue1 ? (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('customerItemId')}
            itemDesc={record.get('customerItemDesc')}
            disabled
          />
        ) : null;
      },
    },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum', width: 80 },
  ];

  const sourceColumns =
    roleType === 'customer'
      ? sourceArr.concat([
          { name: 'customerUomName', width: 80 },
          { name: 'customerDemandQty', width: 80 },
          { name: 'customerShippableQty', width: 90 },
          { name: 'customerInventoryOrgName', width: 150 },
          {
            name: 'customerDemandDate',
            width: 150,
            renderer: ({ value }) => {
              return <span>{value ? value.substring(0, 10) : ''}</span>;
            },
          },
          {
            name: 'supplierPromiseDate',
            width: 150,
            renderer: ({ value }) => {
              return <span>{value ? value.substring(0, 10) : ''}</span>;
            },
          },
          { name: 'supplierName', width: 150 },
          { name: 'supplierInventoryOrgName', width: 150 },
        ])
      : sourceArr.concat([
          { name: 'supplierUomName', width: 80 },
          { name: 'supplierDemandQty', width: 80 },
          { name: 'supplierShippableQty', width: 90 },
          { name: 'supplierInventoryOrgName', width: 150 },
          {
            name: 'customerDemandDate',
            width: 150,
            renderer: ({ value }) => {
              return <span>{value ? value.substring(0, 10) : ''}</span>;
            },
          },
          {
            name: 'supplierPromiseDate',
            width: 150,
            renderer: ({ value }) => {
              return <span>{value ? value.substring(0, 10) : ''}</span>;
            },
          },
          { name: 'customerName', width: 150 },
          { name: 'customerInventoryOrgName', width: 150 },
        ]);

  const outSourceArr = [
    {
      name: 'customerItem',
      width: 150,
      renderer: ({ record }) => (
        <>
          <div>{record.get('customerItemCode')}</div>
          <div>{record.get('customerItemDesc')}</div>
        </>
      ),
    },
    {
      name: 'supplierItem',
      width: 150,
      minWidth: 120,
      renderer: ({ record }) => (
        <>
          <div>{record.get('supplierItemCode')}</div>
          <div>{record.get('supplierItemDesc')}</div>
        </>
      ),
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return value && value.attributeValue1 ? (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('customerItemId')}
            itemDesc={record.get('customerItemDesc')}
            disabled
          />
        ) : null;
      },
    },
    { name: 'sourceDocNum', width: 150 },
    { name: 'poOutsourceNum', width: 100 },
  ];

  const outSourceColumns =
    roleType === 'customer'
      ? outSourceArr.concat([
          { name: 'customerUomName', width: 60 },
          { name: 'customerPromiseQty', width: 80 },
          { name: 'customerShippableQty', width: 90 },
          {
            name: 'customerPromiseDate',
            width: 100,
            renderer: ({ value }) => {
              return <span>{value ? value.substring(0, 10) : ''}</span>;
            },
          },
          { name: 'supplierName', width: 150 },
        ])
      : outSourceArr.concat([
          { name: 'supplierUomName', width: 60 },
          { name: 'supplierPromiseQty', width: 80 },
          { name: 'supplierShippableQty', width: 90 },
          {
            name: 'customerPromiseDate',
            width: 100,
            renderer: ({ value }) => {
              return <span>{value ? value.substring(0, 10) : ''}</span>;
            },
          },
          { name: 'customerName', width: 150 },
        ]);

  return (
    <Fragment>
      <Header
        title={
          roleType === 'customer'
            ? intl.get(`${intlPrefix}.view.title.deliveryApplyToSupplier`).d('向供应商发货预约')
            : intl.get(`${intlPrefix}.view.title.deliveryApplyToCustomer`).d('向客户发货预约')
        }
      >
        <Button onClick={handleCreate} color="primary">
          创建发货预约
        </Button>
      </Header>
      <Content className={styles['delivery-apply-select-list-content']}>
        <Tabs defaultActiveKey={curTab} onChange={handleTabChange}>
          <TabPane tab="订单待发货明细" key="source">
            <Table
              dataSet={SourceDS}
              columns={sourceColumns}
              queryFieldsLimit={3}
              rowHeight="auto"
              columnResizable="true"
            />
          </TabPane>
          {conType !== 'hidden' && (
            <TabPanePermission
              tab={conType === '' ? '' : '采购方供料待发货明细'}
              key="outsource"
              permissionList={[
                {
                  code: `hzmc.zcom.ship.delivery.apply.${roleType}.ps.tabpane.outsource`,
                  type: 'button',
                  meaning: '采购方供料待发货明细',
                },
              ]}
              onControllerTyper={handleSetConType}
            >
              <Table
                dataSet={OutSourceDS}
                columns={outSourceColumns}
                queryFieldsLimit={3}
                rowHeight="auto"
                columnResizable="true"
              />
            </TabPanePermission>
          )}
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomDeliveryApplySelect);
