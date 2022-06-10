/**
 * @Description: 客户订单详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-19 16:04:56
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Tabs,
  Table,
  Form,
  TextField,
  Lov,
  Modal,
  SelectBox,
  TextArea,
  DatePicker,
  Select,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { WithCustomizeC7N as WithCustomize } from 'components/Customize';

import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import {
  CustomerOrderHeadDS,
  CustomerOrderLineDS,
  CustomerOrderOutsourceLineDS,
  BatchDataDS,
} from '../store/indexDS';
import styles from './index.less';

const { TabPane } = Tabs;
const SOption = Select.Option;
const { Option } = SelectBox;
const refuseKey = Modal.key();
const intlPrefix = 'zcom.customerOrder';
const customerOrderHeadDS = () => new DataSet(CustomerOrderHeadDS());
const customerOrderLineDS = () => new DataSet(CustomerOrderLineDS());
const customerOrderOutsourceLineDS = () => new DataSet(CustomerOrderOutsourceLineDS());
const batchDataDS = () => new DataSet(BatchDataDS());

let refuseReason = ''; // 拒绝原因
let refuseRemark = ''; // 拒绝补充说明

function ZcomCustomerOrderDetail({
  match,
  location,
  dispatch,
  history,
  customizeForm,
  customizeTable,
}) {
  const HeadDS = useDataSet(customerOrderHeadDS, ZcomCustomerOrderDetail);
  const LineDS = useDataSet(customerOrderLineDS);
  const OutsourceLineDS = useDataSet(customerOrderOutsourceLineDS);
  const batchDS = useDataSet(batchDataDS);

  const { state } = location;
  const stateObj = state || {};
  const {
    params: { poId },
  } = match;

  const [canEdit, setCanEdit] = useState(true);
  const [canVerify, setVerify] = useState(true);
  const [batchType, setBatchType] = useState('busi');
  const [textAreaDisabled, setTextAreaDisabled] = useState(false);

  useEffect(() => {
    HeadDS.setQueryParameter('poId', poId);
    LineDS.setQueryParameter('poId', poId);
    OutsourceLineDS.setQueryParameter('poId', poId);
    HeadDS.data = [];
    HeadDS.create();
    LineDS.data = [];
    OutsourceLineDS.data = [];
    batchDS.data = [];
    batchDS.create();
    setCanEdit(['CONFIRMING'].includes(stateObj.poStatus));
    setVerify(['CONFIRMING'].includes(stateObj.poStatus));
    handleSearch();
  }, [poId]);

  async function handleSearch() {
    await HeadDS.query();
    setTextAreaDisabled(true);
    LineDS.query();
  }

  function lineValidate() {
    const arr = [];
    LineDS.data.forEach((v) => {
      arr.push(v.validate(true, false));
    });
    return arr;
  }

  function handleSave() {
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      const validateLineResult = await Promise.all(lineValidate());
      if (!validateHead || validateLineResult.findIndex((v) => !v) !== -1) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(false);
        return false;
      }
      const arr = LineDS.data.map((v) => {
        return {
          ...v.toData(),
          supplierPromiseDate: v.toData().supplierPromiseDate
            ? `${v.toData().supplierPromiseDate} 00:00:00`
            : null,
        };
      });
      await HeadDS.submit();
      HeadDS.query();
      dispatch({
        type: 'customerOrder/lineSave',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          LineDS.query();
          resolve();
        } else {
          resolve(false);
          return false;
        }
      });
    });
  }

  function handleTabChange(key) {
    if (['main', 'delivery', 'other'].includes(key)) {
      LineDS.query();
    }
    if (key === 'outsource') {
      OutsourceLineDS.query();
    }
  }

  function handleConfirm() {
    return new Promise(async (resolve) => {
      const saveRes = await handleSave();
      if (saveRes === false) {
        resolve(false);
        return;
      }
      dispatch({
        type: 'customerOrder/poVerify',
        payload: [
          {
            ...HeadDS.current.toData(),
            poStatus: 'CONFIRMED',
          },
        ],
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '确认成功',
          });
          const pathName = `/zcom/customer-order`;
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  function handleRefuseOk() {
    return new Promise(async (resolve) => {
      if (!refuseReason) {
        notification.warning({
          message: '请选择您拒绝的原因',
        });
        resolve(false);
        return;
      }
      dispatch({
        type: 'customerOrder/poVerify',
        payload: [
          {
            ...HeadDS.current.toData(),
            poStatus: 'REFUSED',
            operationOpinion: `${refuseReason}${refuseRemark ? `:${refuseRemark}` : ''}`,
          },
        ],
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '拒绝成功',
          });
          const pathName = `/zcom/customer-order`;
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  function handleReasonChange(e) {
    let str;
    switch (e) {
      case 'notFinish':
        str = '无法按承诺交付';
        break;
      case 'lower':
        str = '价格过低';
        break;
      case 'other':
        str = '其他';
        break;
      default:
        str = '';
        break;
    }
    refuseReason = str;
  }

  function handleRemarkChange(e) {
    refuseRemark = e;
  }

  function handleRefuse() {
    refuseReason = '';
    refuseRemark = '';
    Modal.open({
      key: refuseKey,
      title: '拒绝客户订单',
      children: (
        <div>
          <div className={styles['refuse-title']}>请选择您拒绝的原因（必选）</div>
          <SelectBox onChange={handleReasonChange}>
            <Option value="notFinish">无法按承诺交付</Option>
            <Option value="lower">价格过低</Option>
            <Option value="other">其他</Option>
          </SelectBox>
          <TextArea placeholder="补充说明" cols={60} onChange={handleRemarkChange} />
        </div>
      ),
      className: styles['zcom-customer-order-detail-refuse'],
      onOk: () => handleRefuseOk(),
    });
  }

  const mainLineColumns = [
    { name: 'poLineNum', width: 60, lock: true },
    {
      name: 'soBusinessUnitObj',
      width: 150,
      editor: canEdit,
      lock: true,
    },
    {
      name: 'deliveryInventoryOrgObj',
      width: 150,
      editor: canEdit,
      lock: true,
    },
    { name: 'supplierItemCode', width: 150, lock: true },
    { name: 'supplierItemDesc', width: 150 },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return value && value.attributeValue1 ? (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('supplierItemId')}
            itemDesc={record.get('supplierItemDesc')}
            disabled
          />
        ) : null;
      },
    },
    { name: 'supplierDemandQty', width: 100 },
    { name: 'supplierUomName', width: 80 },
    { name: 'supplierPrice', width: 100 },
    {
      name: 'customerDemandDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'taxRate',
      width: 90,
      renderer: ({ value }) => <span>{value * 100}</span>,
    },
    { name: 'supplierExTaxPrice', width: 100 },
    { name: 'amount', width: 120, minWidth: 120 },
    { name: 'toleranceType', width: 150 },
    { name: 'supplierToleranceValue', width: 150 },
    // {
    //   name: 'invoiceAddressFrom',
    //   width: 150,
    //   editor: canEdit,
    // },
    { name: 'poLineStatus', width: 150, lock: 'right' },
  ];

  const deliveryColumns = [
    { name: 'poLineNum', width: 60, lock: true },
    {
      name: 'soBusinessUnitObj',
      width: 150,
      editor: canEdit,
      lock: true,
    },
    {
      name: 'deliveryInventoryOrgObj',
      width: 150,
      editor: canEdit,
      lock: true,
    },
    { name: 'supplierItemCode', width: 150, lock: true },
    { name: 'supplierDemandQty', width: 100 },
    { name: 'consigneeName', width: 150 },
    { name: 'consigneePhone', width: 150 },
    { name: 'receivingAddress', width: 150 },
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
      editor: canEdit ? <DatePicker min={new Date()} /> : null,
    },
    { name: 'consignerName', width: 150, editor: canEdit },
    { name: 'consignerPhone', width: 150, editor: canEdit, align: 'left' },
    { name: 'deliveryAddress', width: 150, editor: canEdit },
    { name: 'supplierDeliveryQty', width: 100 },
    { name: 'supplierReceivedQty', width: 120 },
    { name: 'supplierReturnedQty', width: 100 },
    { name: 'supplierDqcQty', width: 120 },
    { name: 'poLineStatus', width: 150, lock: 'right' },
  ];

  const otherColumns = [
    { name: 'poLineNum', width: 60, lock: true },
    {
      name: 'soBusinessUnitObj',
      width: 150,
      editor: canEdit,
      lock: true,
    },
    {
      name: 'deliveryInventoryOrgObj',
      width: 150,
      editor: canEdit,
      lock: true,
    },
    { name: 'supplierItemCode', width: 150, lock: true },
    { name: 'brand', width: 150 },
    { name: 'specification', width: 150 },
    { name: 'model', width: 150 },
    { name: 'process', width: 150 },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDesc', width: 150 },
    { name: 'poLineStatus', width: 150, lock: 'right' },
  ];

  const outsourceColumns = [
    { name: 'poOutsourceNum', width: 60, lock: true },
    { name: 'supplierItemCode', width: 150, lock: true },
    { name: 'supplierItemDesc', width: 150 },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return value && value.attributeValue1 ? (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('supplierItemId')}
            itemDesc={record.get('supplierItemDesc')}
            disabled
          />
        ) : null;
      },
    },
    { name: 'supplierUomName', width: 80 },
    { name: 'supplierPromiseQty', width: 100 },
    {
      name: 'customerPromiseDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'outsrcSupplierName', width: 150 },
    { name: 'outsrcSupplierContacts', width: 150 },
    { name: 'outsrcSupplierPhone', width: 150 },
    { name: 'specification', width: 150 },
    { name: 'model', width: 150 },
    { name: 'remark', width: 150 },
    { name: 'supplierDeliveryQty', width: 150, lock: 'right' },
    { name: 'supplierReceivedQty', width: 150, lock: 'right' },
  ];

  function handleChange(e) {
    setBatchType(e);
    batchDS.data = [];
    batchDS.create();
  }

  async function hanldeBatchOperate() {
    return new Promise(async (resolve) => {
      const {
        soBusinessUnitId,
        deliveryInventoryOrgId,
        supplierPromiseDate,
        consignerName,
        consignerPhone,
        deliveryAddress,
      } = batchDS.current.toData();
      let obj;
      if (batchType === 'busi') {
        if (!soBusinessUnitId) {
          notification.warning({ message: '请先选择业务实体' });
          resolve(false);
          return;
        }
        obj = Object.assign(
          {},
          {
            poId,
            soBusinessUnitId: batchDS.current.toData().soBusinessUnitId,
            soBusinessUnitCode: batchDS.current.toData().soBusinessUnitCode,
          }
        );
      }
      if (batchType === 'org') {
        if (!deliveryInventoryOrgId) {
          notification.warning({ message: '请先选择发货库存组织' });
          resolve(false);
          return;
        }
        obj = Object.assign(
          {},
          {
            poId,
            deliveryInventoryOrgId: batchDS.current.toData().deliveryInventoryOrgId,
            deliveryInventoryOrgCode: batchDS.current.toData().deliveryInventoryOrgCode,
            deliveryInventoryOrgName: batchDS.current.toData().deliveryInventoryOrgName,
            soBusinessUnitId: batchDS.current.toData().deliveryBusinessUnitId,
            soBusinessUnitCode: batchDS.current.toData().deliveryBusinessUnitCode,
            deliveryAddress: batchDS.current.toData().fullAddress,
          }
        );
      }
      if (batchType === 'date') {
        if (!supplierPromiseDate) {
          notification.warning({ message: '请先选择承诺到货日期' });
          resolve(false);
          return;
        }
        obj = Object.assign(
          {},
          {
            poId,
            supplierPromiseDate: `${supplierPromiseDate} 00:00:00`,
          }
        );
      }
      if (batchType === 'people') {
        if (!consignerName) {
          notification.warning({ message: '请先填写发货人' });
          resolve(false);
          return;
        }
        obj = Object.assign(
          {},
          {
            poId,
            consignerName,
          }
        );
      }
      if (batchType === 'phone') {
        if (!consignerPhone) {
          notification.warning({ message: '请先填写发货人联系电话' });
          resolve(false);
          return;
        }
        obj = Object.assign(
          {},
          {
            poId,
            consignerPhone,
          }
        );
      }
      if (batchType === 'address') {
        if (!deliveryAddress) {
          notification.warning({ message: '请先填写发货地点' });
          resolve(false);
          return;
        }
        obj = Object.assign(
          {},
          {
            poId,
            deliveryAddress,
          }
        );
      }
      dispatch({
        type: 'customerOrder/updateAllLine',
        payload: obj,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          LineDS.query();
        }
        resolve();
      });
    });
  }

  function getBatchArea() {
    return (
      <div className={styles['customer-order-batch']}>
        <Select
          label="Select"
          placeholder="请选择"
          allowClear
          style={{ width: 140 }}
          value={batchType}
          onChange={handleChange}
        >
          <SOption value="busi">业务实体</SOption>
          <SOption value="org">发货库存组织</SOption>
          <SOption value="date">承诺到货日期</SOption>
          <SOption value="people">发货人</SOption>
          <SOption value="phone">发货人联系电话</SOption>
          <SOption value="address">发货地点</SOption>
        </Select>
        <div className={styles['batch-maohao']}>:</div>
        <Form dataSet={batchDS} columns={1} labelWidth={0}>
          {batchType === 'busi' && (
            <Lov name="soBusinessUnitObj" key="soBusinessUnitObj" clearButton noCache />
          )}
          {batchType === 'org' && (
            <Lov name="deliveryInventoryOrgObj" key="deliveryInventoryOrgObj" clearButton noCache />
          )}
          {batchType === 'date' && (
            <DatePicker name="supplierPromiseDate" key="supplierPromiseDate" min={new Date()} />
          )}
          {batchType === 'people' && <TextField name="consignerName" key="consignerName" />}
          {batchType === 'phone' && <TextField name="consignerPhone" key="consignerPhone" />}
          {batchType === 'address' && <TextField name="deliveryAddress" key="deliveryAddress" />}
        </Form>
        <Button color="primary" className={styles['batch-btn']} onClick={hanldeBatchOperate}>
          批量维护
        </Button>
      </div>
    );
  }

  return (
    <Fragment>
      <Header title="客户订单详情" backPath="/zcom/customer-order">
        {canVerify && (
          <Button onClick={handleConfirm} color="primary">
            通过
          </Button>
        )}
        {canEdit && <Button onClick={handleSave}>保存</Button>}
        {canVerify && <Button onClick={handleRefuse}>拒绝</Button>}
      </Header>
      <Content className={styles['zcom-customer-order-content']}>
        {customizeForm(
          {
            code: 'ZCOM_CUSTOMER_PO.HEAD.FORM', // 必传，和unitCode一一对应
          },
          <Form dataSet={HeadDS} columns={4} labelWidth={120}>
            <TextField name="customerName" key="customerName" disabled />
            <TextField name="poTypeMeaning" key="poTypeMeaning" disabled />
            <TextField name="poNum" key="poNum" disabled />
            <TextField name="poStatusMeaning" key="poStatusMeaning" disabled />
            <TextField name="currencyCode" key="currencyCode" disabled />
            <TextField name="exTaxAmount" key="exTaxAmount" disabled />
            <TextField name="totalAmount" key="totalAmount" disabled />
            <TextField name="sourceDocNum" key="sourceDocNum" disabled />
            <TextField name="consigneeName" key="consigneeName" disabled />
            <TextField name="consigneePhone" key="consigneePhone" disabled />
            <TextField name="receivingAddress" key="receivingAddress" disabled />
            {/* <TextField name="invoiceAddressTo" key="invoiceAddressTo" disabled /> */}
            {/* <TextField name="buyer" key="buyer" disabled /> */}
            <TextField name="customerContacts" key="customerContacts" disabled={!canEdit} />
            <TextField
              name="customerContactsPhone"
              key="customerContactsPhone"
              disabled={!canEdit}
            />
            <TextField name="supplierContacts" key="supplierContacts" disabled={!canEdit} />
            <TextField
              name="supplierContactsPhone"
              key="supplierContactsPhone"
              disabled={!canEdit}
            />
            {/* <TextField name="saler" key="saler" disabled={!canEdit} /> */}
            {/* <TextField name="invoiceAddressFrom" key="invoiceAddressFrom" disabled={!canEdit} /> */}
            <TextArea
              newLine
              colSpan={2}
              name="remark"
              key="remark"
              disabled={textAreaDisabled}
              resize="both"
              autoSize
            />
          </Form>
        )}
        <Tabs defaultActiveKey="main" onChange={handleTabChange}>
          <TabPane tab="主要" key="main">
            {canEdit && getBatchArea()}
            {customizeTable(
              {
                code: 'ZCOM_CUSTOMER_PO.LINE.TABLE', // 单元编码，必传
              },
              <Table
                dataSet={LineDS}
                columns={mainLineColumns}
                columnResizable="true"
                rowHeight="auto"
              />
            )}
          </TabPane>
          <TabPane tab="发货" key="delivery">
            {canEdit && getBatchArea()}
            <Table dataSet={LineDS} columns={deliveryColumns} columnResizable="true" />
          </TabPane>
          <TabPane tab="外协物料" key="outsource">
            {customizeTable(
              {
                code: 'ZCOM_CUSTOMER_PO.OUTSOURCE.LINE.TABLE', // 单元编码，必传
              },
              <Table
                dataSet={OutsourceLineDS}
                columns={outsourceColumns}
                columnResizable="true"
                rowHeight="auto"
              />
            )}
          </TabPane>
          <TabPane tab="其他" key="other">
            {canEdit && getBatchArea()}
            <Table dataSet={LineDS} columns={otherColumns} columnResizable="true" />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(
  WithCustomize({
    unitCode: [
      'ZCOM_CUSTOMER_PO.HEAD.FORM',
      'ZCOM_CUSTOMER_PO.LINE.TABLE',
      'ZCOM_CUSTOMER_PO.OUTSOURCE.LINE.TABLE',
    ],
  })(ZcomCustomerOrderDetail)
);
