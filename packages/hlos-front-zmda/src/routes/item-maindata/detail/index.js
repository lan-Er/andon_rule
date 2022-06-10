/**
 * @Description: 基础数据-物料详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-12 14:01:25
 */

import React, { useRef, useState, useEffect, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import {
  DataSet,
  Button,
  Table,
  Form,
  TextField,
  Lov,
  Select,
  Tabs,
  Tooltip,
  CheckBox,
  NumberField,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import {
  ItemDetailDS,
  ItemOrgListDS,
  SupplierItemListDS,
  CustomerItemListDS,
  ItemAttributeDS,
} from '../store/ItemMaindataDS';
import { itemCreate, itemUpdate } from '@/services/itemMaindataService';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zmda.item';
const itemDetailDS = () => new DataSet(ItemDetailDS());
const itemOrgListDS = () => new DataSet(ItemOrgListDS());
const supplierItemListDS = () => new DataSet(SupplierItemListDS());
const customerItemListDS = () => new DataSet(CustomerItemListDS());
const itemAttributeDS = () => new DataSet(ItemAttributeDS());

function ZmdaItemMaindataDetail({ match, history }) {
  const modalNode = useRef(null);
  const DetailDS = useDataSet(itemDetailDS, ZmdaItemMaindataDetail);
  const ItemOrgDS = useDataSet(itemOrgListDS);
  const SupplierItemDS = useDataSet(supplierItemListDS);
  const CustomerItemDS = useDataSet(customerItemListDS);
  const AttributeDS = useDataSet(itemAttributeDS);
  const {
    params: { type, itemId },
  } = match;

  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    DetailDS.setQueryParameter('itemId', null);
    ItemOrgDS.setQueryParameter('itemId', null);
    SupplierItemDS.setQueryParameter('customerItemId', null);
    SupplierItemDS.setQueryParameter('customerTenantId', null);
    CustomerItemDS.setQueryParameter('supplierItemId', null);
    CustomerItemDS.setQueryParameter('supplierTenantId', null);
    DetailDS.data = [];
    DetailDS.create();
    ItemOrgDS.data = [];
    ItemOrgDS.clearCachedSelected();
    SupplierItemDS.data = [];
    SupplierItemDS.clearCachedSelected();
    CustomerItemDS.data = [];
    CustomerItemDS.clearCachedSelected();
    AttributeDS.data = [];
    AttributeDS.clearCachedSelected();
    if (type !== 'create') {
      DetailDS.setQueryParameter('itemId', itemId);
      ItemOrgDS.setQueryParameter('itemId', itemId);
      SupplierItemDS.setQueryParameter('customerItemId', itemId);
      SupplierItemDS.setQueryParameter('customerTenantId', getCurrentOrganizationId());
      CustomerItemDS.setQueryParameter('supplierItemId', itemId);
      CustomerItemDS.setQueryParameter('supplierTenantId', getCurrentOrganizationId());
      AttributeDS.setQueryParameter('itemId', itemId);
      handleSearch();
    }
  }, [itemId]);

  function handleSearch() {
    DetailDS.query();
    ItemOrgDS.query();
    SupplierItemDS.query();
    CustomerItemDS.query();
    AttributeDS.query();
  }

  function handleSave() {
    setSaveLoading(true);
    return new Promise(async (resolve) => {
      const validate = await DetailDS.current.validate(true, false);
      if (!validate) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setSaveLoading(false));
        return false;
      }
      const obj = DetailDS.current.toData();
      const res = type === 'create' ? await itemCreate(obj) : await itemUpdate(obj);
      if (res && !res.failed) {
        notification.success({
          message: '保存成功',
        });
        if (type === 'create') {
          history.push({
            pathname: `/zmda/item-maindata/detail/${res.itemId}`,
          });
        } else {
          DetailDS.query();
        }
      } else {
        notification.error({
          message: res.message,
        });
      }
      resolve(setSaveLoading(false));
    });
  }

  function handleClear() {
    DetailDS.data = [];
    DetailDS.create();
  }

  function handleOrgCreate() {
    ItemOrgDS.create({
      itemId,
      itemCode: DetailDS.current.get('itemCode'),
    });
  }

  function handleOrgDelete() {
    ItemOrgDS.delete(ItemOrgDS.selected);
  }

  function handleSupplierItemCreate() {
    SupplierItemDS.create({
      customerItemId: itemId,
      customerItemCode: DetailDS.current.get('itemCode'),
      customerUomId: DetailDS.current.get('uomId'),
      customerUomCode: DetailDS.current.get('uomCode'),
    });
  }

  function handleSupplierItemDelete() {
    SupplierItemDS.delete(SupplierItemDS.selected);
  }

  function handleCustomerItemCreate() {
    CustomerItemDS.create({
      supplierItemId: itemId,
      supplierItemCode: DetailDS.current.get('itemCode'),
      supplierUomId: DetailDS.current.get('uomId'),
      supplierUomCode: DetailDS.current.get('uomCode'),
    });
  }

  function handleCustomerItemDelete() {
    CustomerItemDS.delete(CustomerItemDS.selected);
  }

  function handleAttributeCreate() {
    AttributeDS.create({
      itemId,
      itemCode: DetailDS.current.get('itemCode'),
    });
  }

  function handleTabChange(key) {
    if (type !== 'create') {
      if (key === 'org') {
        ItemOrgDS.query();
      }
      if (key === 'supplier') {
        SupplierItemDS.query();
      }
      if (key === 'customer') {
        CustomerItemDS.query();
      }
      if (key === 'attribute') {
        AttributeDS.query();
      }
    }
  }

  const orgColumns = [
    {
      name: 'inventoryOrgObj',
      width: 150,
      editor: (record) => (record.status === 'add' ? <Lov /> : null),
    },
    { name: 'inventoryOrgName', width: 250, editor: false },
    {
      name: 'enabledFlag',
      align: 'center',
      width: 100,
      editor: <CheckBox />,
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: ['edit'],
      lock: 'right',
    },
  ];

  const supplierItemColumns = [
    { name: 'companyObj', width: 150, editor: true },
    { name: 'supplierObj', width: 150, editor: true },
    { name: 'supplierName', width: 250, editor: false },
    { name: 'supplierItemCode', width: 150, editor: true },
    { name: 'supplierUomCode', width: 150, editor: true },
    {
      header: () => (
        <Tooltip placement="topRight" title="我方1单位 : 供应商1单位">
          <span>
            单位转换率
            <Icon type="contact_support" />
          </span>
        </Tooltip>
      ),
      name: 'conversionRate',
      width: 160,
      editor: () => (
        <div className={styles['conversion-rate-area']}>
          <NumberField dataSet={SupplierItemDS} name="customerConversionRate" />
          <div className={styles['conversion-rate-area-maohao']}>:</div>
          <NumberField dataSet={SupplierItemDS} name="supplierConversionRate" />
        </div>
      ),
      renderer: ({ record }) =>
        !record.editing ? (
          <span>
            {`${record.get('customerConversionRate')} : ${record.get('supplierConversionRate')}`}
          </span>
        ) : null,
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: ['edit'],
      lock: 'right',
    },
  ];

  const customerItemColumns = [
    { name: 'companyObj', width: 150, editor: true },
    { name: 'customerObj', width: 150, editor: true },
    { name: 'customerName', width: 250, editor: false },
    { name: 'customerItemCode', width: 150, editor: true },
    { name: 'customerUomCode', width: 150, editor: true },
    {
      header: () => (
        <Tooltip placement="topRight" title="我方1单位 : 客户1单位">
          <span>
            单位转换率
            <Icon type="contact_support" />
          </span>
        </Tooltip>
      ),
      name: 'conversionRate',
      width: 160,
      editor: () => (
        <div className={styles['conversion-rate-area']}>
          <NumberField dataSet={CustomerItemDS} name="supplierConversionRate" />
          <div className={styles['conversion-rate-area-maohao']}>:</div>
          <NumberField dataSet={CustomerItemDS} name="customerConversionRate" />
        </div>
      ),
      renderer: ({ record }) =>
        !record.editing ? (
          <span>
            {`${record.get('supplierConversionRate')} : ${record.get('customerConversionRate')}`}
          </span>
        ) : null,
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: ['edit'],
      lock: 'right',
    },
  ];

  async function handleChange() {
    AttributeDS.current.set('checkAll', '0');
  }

  async function handleSelectAll() {
    const arr = [];
    modalNode.current.props.children.props.dataSet.records.forEach((v) => {
      arr.push(v.data);
    });
    AttributeDS.current.set('checkAll', '1');
    AttributeDS.current.set('itemAttributeValueList', arr);
    modalNode.current.props.close();
  }

  const attributeColumns = [
    {
      name: 'attributeObj',
      width: 150,
      editor: true,
    },
    {
      name: 'itemAttributeValueList',
      width: 300,
      editor: () => (
        <Lov
          modalProps={{
            ref: (node) => {
              modalNode.current = node;
            },
            footer: (okBtn, cancelBtn) => (
              <div>
                {cancelBtn}
                <Button color="primary" onClick={handleSelectAll}>
                  全选
                </Button>
                {okBtn}
              </div>
            ),
          }}
          onChange={handleChange}
          className={styles['zmda-lov-multiple']}
        />
      ),
    },
    {
      name: 'enabledFlag',
      align: 'center',
      width: 100,
      editor: <CheckBox />,
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: ['edit'],
      lock: 'right',
    },
  ];

  const AttributeButtons = observer((props) => {
    const isAddDisabled = props.dataSet.data.length === 4;
    return (
      <Button disabled={isAddDisabled} onClick={() => handleAttributeCreate()} color="primary">
        分配属性
      </Button>
    );
  });

  const buttons = [<AttributeButtons dataSet={AttributeDS} />];

  return (
    <Fragment>
      <Header
        title={
          type === 'create'
            ? intl.get(`${intlPrefix}.view.title.itemCreate`).d('新建物料')
            : intl.get(`${intlPrefix}.view.title.itemEdit`).d('编辑物料')
        }
        backPath="/zmda/item-maindata"
      >
        <Button color="primary" onClick={handleSave} loading={saveLoading}>
          保存
        </Button>
        {type === 'create' && <Button onClick={handleClear}>清空</Button>}
      </Header>
      <Content>
        <Form dataSet={DetailDS} columns={4}>
          <TextField name="itemCode" key="itemCode" disabled={type !== 'create'} />
          <TextField name="itemDesc" key="itemDesc" />
          <Lov name="categoryObj" key="categoryObj" clearButton noCache />
          <TextField name="categoryName" key="categoryName" disabled />
          <Lov name="uomObj" key="uomObj" clearButton noCache />
          <Select name="sequenceFlag" key="sequenceFlag" />
          <Select name="batchFlag" key="batchFlag" />
          {/* <TextField name="planner" key="planner" />
          <TextField name="buyer" key="buyer" /> */}
          <Lov name="defaultTaxRateObj" key="defaultTaxRateObj" clearButton noCache />
        </Form>
        <Tabs defaultActiveKey="org" onChange={handleTabChange}>
          <TabPane tab="组织分配" key="org" className={styles['zmda-org-table']}>
            <Table
              dataSet={ItemOrgDS}
              columns={orgColumns}
              columnResizable="true"
              editMode="inline"
              buttons={
                type !== 'create'
                  ? [
                      ['add', { onClick: () => handleOrgCreate() }],
                      ['delete', { onClick: () => handleOrgDelete() }],
                    ]
                  : null
              }
            />
          </TabPane>
          <TabPane tab="供应商物料" key="supplier">
            <Table
              dataSet={SupplierItemDS}
              columns={supplierItemColumns}
              columnResizable="true"
              editMode="inline"
              buttons={
                type !== 'create'
                  ? [
                      ['add', { onClick: () => handleSupplierItemCreate() }],
                      ['delete', { onClick: () => handleSupplierItemDelete() }],
                    ]
                  : null
              }
            />
          </TabPane>
          <TabPane tab="客户物料" key="customer">
            <Table
              dataSet={CustomerItemDS}
              columns={customerItemColumns}
              columnResizable="true"
              editMode="inline"
              buttons={
                type !== 'create'
                  ? [
                      ['add', { onClick: () => handleCustomerItemCreate() }],
                      ['delete', { onClick: () => handleCustomerItemDelete() }],
                    ]
                  : null
              }
            />
          </TabPane>
          <TabPane tab="关键属性分配" key="attribute" className={styles['zmda-attribute-table']}>
            <Table
              dataSet={AttributeDS}
              columns={attributeColumns}
              columnResizable="true"
              editMode="inline"
              buttons={type !== 'create' ? buttons : null}
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZmdaItemMaindataDetail);
