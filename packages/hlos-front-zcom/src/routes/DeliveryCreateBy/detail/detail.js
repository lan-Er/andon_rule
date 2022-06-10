/**
 * @Description: 发货申请详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-25 15:38:07
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Form,
  TextField,
  Select,
  DatePicker,
  Tabs,
  Table,
  Modal,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import notification from 'utils/notification';
import {
  DeliveryOrderHeadDS,
  DeliveryOrderLineDS,
  DeliveryDetailLogisticsDS,
} from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zcom.deliveryApply';
const deliveryOrderHeadDS = () => new DataSet(DeliveryOrderHeadDS());
const deliveryOrderLineDS = () => new DataSet(DeliveryOrderLineDS());
const deliveryDetailLogisticsDS = () => new DataSet(DeliveryDetailLogisticsDS());

const { TabPane } = Tabs;

function ZcomDeliveryApplyDetail({ match, dispatch, history, location }) {
  const HeadDS = useDataSet(deliveryOrderHeadDS, ZcomDeliveryApplyDetail);
  const LineDS = useDataSet(deliveryOrderLineDS);
  const LogisticsDS = useDataSet(deliveryDetailLogisticsDS);

  const {
    params: { type, deliveryOrderId },
  } = match;

  const { state } = location;

  const [canEdit, setCanEdit] = useState(true); // 是否可编辑
  const [deliveryShow, setDeliveryShow] = useState(true);
  const [receiveShow, setReceiveShow] = useState(true);
  const [receivingType, setReceivingType] = useState('');

  const [logisticsCanEdit] = useState(true);

  useEffect(() => {
    HeadDS.setQueryParameter('deliveryOrderId', null);
    LineDS.setQueryParameter('deliveryOrderId', null);
    HeadDS.data = [];
    HeadDS.create();
    LineDS.data = [];
    LineDS.clearCachedSelected();
    HeadDS.setQueryParameter('deliveryOrderId', deliveryOrderId);
    LineDS.setQueryParameter('deliveryOrderId', deliveryOrderId);
    LogisticsDS.setQueryParameter('sourceDocId', deliveryOrderId);

    handleSearch();
  }, [deliveryOrderId]);

  async function handleSearch() {
    await HeadDS.query();
    await LineDS.query();
    await LogisticsDS.query();
    setReceivingType(HeadDS.current.get('receivingType'));
    LogisticsDS.current.set('sourceDocId', deliveryOrderId);
    LogisticsDS.current.set('sourceDocNum', HeadDS.current.get('deliveryOrderNum'));
    setCanEdit(HeadDS.current.get('deliveryOrderStatus') === 'NEW');
  }

  const columns = [
    { name: 'deliveryOrderLineNum', width: 60, lock: 'left' },
    {
      name: 'customerItemDesc',
      width: 150,
      renderer: ({ record }) => (
        <>
          <div>{record.get('customerItemCode')}</div>
          <div>{record.get('customerItemDesc')}</div>
        </>
      ),
      lock: 'left',
    },
    {
      name: 'supplierItemDesc',
      width: 150,
      renderer: ({ record }) => (
        <>
          <div>{record.get('supplierItemCode')}</div>
          <div>{record.get('supplierItemDesc')}</div>
        </>
      ),
      lock: 'left',
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          value && (
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
    { name: 'supplierUomName' },
    { name: 'supplierPromiseQty' },
    {
      name: 'supplierShippableQty',
      renderer: ({ value }) => (Number(value) < 0 ? 0 : value),
    },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum' },
    { name: 'relatedDeliveryApplyNum', width: 150 },
    { name: 'customerDemandDate', width: 150 },
    { name: 'supplierPromiseDate', width: 150 },
    { name: 'supplierDeliveryQty', width: 120, lock: 'right', editor: canEdit },
  ];

  function getTitle() {
    if (type === 'create') {
      return intl.get(`${intlPrefix}.view.title.deliveryApplyCreate`).d('新建发货');
    } else {
      return intl.get(`${intlPrefix}.view.title.deliveryApplyDetail`).d('发货详情');
    }
  }

  const handleSave = (apiName, status) => {
    return new Promise(async (resolve) => {
      const headers = HeadDS.current.toData();
      const lines = LineDS.toData();

      const params = {
        ...headers,
        deliveryOrderDate: `${headers.deliveryOrderDate} 00:00:00`,
        arrivalDate: `${headers.arrivalDate} 00:00:00`,
        deliveryOrderStatus: status || headers.deliveryOrderStatus,
        deliveryOrderLineList: lines,
      };

      dispatch({
        type: `deliveryOrder/${apiName}`,
        payload: status === 'NEW' ? params : [params],
      }).then(async (res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          if (apiName === 'updateDeliveryOrders' || apiName === 'submitDeliveryApply') {
            await handleUpdateLogistics();
          }

          if (apiName === 'updateDeliveryOrders') {
            handleSearch();
            resolve();
            return;
          }

          history.push({
            pathname: '/zcom/delivery-order',
          });
        }
        resolve();
      });
    });
  };

  const handleSubmit = (apiName, status) => {
    let validateFlag = false;
    LineDS.forEach((item) => {
      const { supplierDeliveryQty, supplierShippableQty } = item.data;
      if (Number(supplierDeliveryQty) > Number(supplierShippableQty)) {
        validateFlag = true;
      }
    });

    if (validateFlag) {
      Modal.confirm({
        children: <p>本次发货数量大于未发货数量，请确认是否发出大于未发货数量的货物？</p>,
        onOk: () => {
          handleSave(apiName, status);
        },
      });
    } else {
      handleSave(apiName, status);
    }
  };

  const supplierFileds = [
    <TextField name="recvSupplierName" key="recvSupplierName" disabled />,
    <TextField name="recvSupplierOrgName" key="recvSupplierOrgName" disabled />,
  ];

  const subCompanyFileds = [
    <TextField name="recvCompanyName" key="recvCompanyName" disabled />,
    <TextField name="recvSupplierOrgName" key="recvSupplierOrgName" disabled />,
  ];

  const handleUpdateLogistics = async () => {
    await LogisticsDS.submit();
  };

  return (
    <Fragment>
      <Header title={getTitle()} backPath={state || '/zcom/delivery-order'}>
        {canEdit && (
          <>
            <Button
              onClick={() => handleSubmit('submitDeliveryApply', 'DELIVERED')}
              color="primary"
            >
              提交发货
            </Button>
            <Button onClick={() => handleSave('updateDeliveryOrders', 'NEW')}>保存</Button>
          </>
        )}
        <Button onClick={handleUpdateLogistics}>更新物流信息</Button>

        <Button onClick={() => handleSave('cancelDeliveryApply', 'CANCELLED')}>取消</Button>
        {canEdit && <Button onClick={() => handleSave('deleteDeliveryApply')}>删除</Button>}
      </Header>
      <Content className={styles['zcom-delivery-apply-detail-content']}>
        <div className={styles['zcom-delivery-apply-info']}>
          <span>发货信息</span>
          <span
            className={styles['info-toggle']}
            onClick={() => {
              setDeliveryShow(!deliveryShow);
            }}
          >
            {deliveryShow ? '收起' : '展开'}
          </span>
        </div>
        {deliveryShow && (
          <Form dataSet={HeadDS} columns={4}>
            <TextField name="deliveryOrderNum" key="deliveryOrderNum" disabled />
            <Select name="deliveryOrderType" key="deliveryOrderType" disabled={!canEdit} />
            <Select name="deliveryOrderStatus" key="deliveryOrderStatus" disabled />
            <TextField name="supplierName" key="supplierName" disabled />
            <TextField name="supplierInventoryOrgName" key="supplierInventoryOrgName" disabled />
            <TextField name="deliveryAddress" key="deliveryAddress" disabled />
            <TextField name="consignerName" key="consignerName" disabled={!canEdit} />
            <TextField name="consignerPhone" key="consignerPhone" disabled={!canEdit} />
            <TextField name="deliveryWarehouse" key="deliveryWarehouse" disabled={!canEdit} />
            <DatePicker name="deliveryOrderDate" key="deliveryOrderDate" disabled={!canEdit} />
            <DatePicker name="arrivalDate" key="arrivalDate" disabled={!canEdit} />
            {/* <TextField name="relatedDeliveryApplyNum" key="relatedDeliveryApplyNum" disabled /> */}
          </Form>
        )}
        <div className={styles['zcom-delivery-apply-info']}>
          <span>收货信息</span>
          <span
            className={styles['info-toggle']}
            onClick={() => {
              setReceiveShow(!receiveShow);
            }}
          >
            {receiveShow ? '收起' : '展开'}
          </span>
        </div>
        {receiveShow && (
          <Form dataSet={HeadDS} columns={4}>
            <TextField name="customerName" key="customerName" disabled />
            <TextField name="customerInventoryOrgName" key="customerInventoryOrgName" disabled />
            {receivingType === 'THIRD_SUPPLIER' ? supplierFileds.map((i) => i) : null}
            {receivingType === 'SUB_COMPANY' ? subCompanyFileds.map((i) => i) : null}
            <TextField name="receivingAddress" key="receivingAddress" disabled />
            <TextField name="consigneeName" key="consigneeName" disabled />
            <TextField name="consigneePhone" key="consigneePhone" disabled />
            <TextField name="receivingWarehouse" key="receivingWarehouse" disabled />
          </Form>
        )}

        <Tabs defaultActiveKey="material">
          <TabPane tab="基础信息" key="material">
            <Table dataSet={LineDS} columns={columns} columnResizable="true" rowHeight="auto" />
          </TabPane>
          <TabPane tab="物流信息" key="logistics">
            <Form dataSet={LogisticsDS} columns={3} labelWidth={120}>
              <TextField
                name="logisticsCompany"
                key="logisticsCompany"
                disabled={!logisticsCanEdit}
              />
              <TextField
                name="logisticsNumber"
                key="logisticsNumber"
                disabled={!logisticsCanEdit}
              />
              <TextField name="freight" key="freight" disabled={!logisticsCanEdit} restrict="0-9" />
              <TextField name="deliverer" key="deliverer" disabled={!logisticsCanEdit} />
              <TextField name="delivererPhone" key="delivererPhone" disabled={!logisticsCanEdit} />
              <TextField
                name="consigneePhone"
                key="consigneePhone"
                disabled={!logisticsCanEdit}
                restrict="0-9"
              />
            </Form>
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomDeliveryApplyDetail);
