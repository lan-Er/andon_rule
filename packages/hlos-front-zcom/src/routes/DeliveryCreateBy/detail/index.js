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
// import InputLov from '@/components/InputLov/index';

import notification from 'utils/notification';
import { createDeliveryOrders } from '@/services/deliveryCreateByService';

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

function ZcomDeliveryApplyDetail({ match, history }) {
  const HeadDS = useDataSet(deliveryOrderHeadDS, ZcomDeliveryApplyDetail);
  const LineDS = useDataSet(deliveryOrderLineDS);
  const LogisticsDS = useDataSet(deliveryDetailLogisticsDS);

  // const { state } = location;
  const {
    params: { deliveryOrderId },
  } = match;

  const [canEdit] = useState(true); // 是否可编辑
  const [deliveryShow, setDeliveryShow] = useState(true);
  const [receiveShow, setReceiveShow] = useState(true);
  const [receivingType, setReceivingType] = useState('');

  const [logisticsCanEdit] = useState(true);

  useEffect(() => {
    // LineDS.setQueryParameter('idList', state.idList);
    // HeadDS.setQueryParameter('idList', state.idList);
    HeadDS.setQueryParameter('deliveryOrderId', null);
    LineDS.setQueryParameter('deliveryOrderId', null);
    HeadDS.data = [];
    HeadDS.create();
    LineDS.data = [];
    LineDS.clearCachedSelected();
    handleSearch();
  }, [deliveryOrderId]);

  async function handleSearch() {
    HeadDS.setQueryParameter('deliveryOrderId', deliveryOrderId);
    LineDS.setQueryParameter('deliveryOrderId', deliveryOrderId);
    LogisticsDS.setQueryParameter('sourceDocId', deliveryOrderId);
    await HeadDS.query();
    await LineDS.query();
    await LogisticsDS.query();
    LogisticsDS.current.set('sourceDocId', deliveryOrderId);
    LogisticsDS.current.set('sourceDocNum', HeadDS.current.get('deliveryOrderNum'));
    setReceivingType(HeadDS.current.get('receivingType'));
  }

  const columns = [
    { name: 'deliveryApplyLineNum', width: 60, lock: 'left' },
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
          <ItemAttributeSelect
            data={value}
            itemId={record.get('supplierItemId')}
            itemDesc={record.get('supplierItemDesc')}
            disabled
          />
        );
      },
    },
    { name: 'supplierUomName' },
    { name: 'supplierPromiseQty' },
    {
      name: 'supplierShippableQty',
      width: 120,
      renderer: ({ value }) => (Number(value) < 0 ? 0 : value),
    },
    {
      name: 'supplierUnshippedQty',
      width: 120,
    },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum' },
    { name: 'relatedDeliveryApplyNum', width: 150 },
    { name: 'customerDemandDate', width: 150 },
    { name: 'supplierPromiseDate', width: 150 },
    { name: 'supplierDeliveryQty', width: 120, lock: 'right', editor: canEdit },
  ];

  function getTitle() {
    return intl.get(`${intlPrefix}.view.title.deliveryApplyCreate`).d('发货单新建');
  }

  function lineValidate() {
    const arr = [];
    LineDS.data.forEach((v) => {
      arr.push(v.validate(true, false));
    });
    return arr;
  }

  const handleSave = async (status, checkFlag) => {
    const validateValue = await HeadDS.validate(false, false);
    const validateLineValue = await Promise.all(lineValidate());

    if (!validateValue || validateLineValue.findIndex((v) => !v) !== -1) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }

    return new Promise(async (resolve) => {
      const {
        deliveryOrderType,
        consignerName,
        consignerPhone,
        deliveryWarehouse,
        deliveryOrderDate,
        arrivalDate,
      } = HeadDS.current.toData();

      const lines = LineDS.map((item) => {
        return {
          ...item.toData(),
          deliveryOrderStatus: status,
          deliveryOrderType,
          consignerName,
          consignerPhone,
          deliveryWarehouse,
          deliveryOrderDate: `${deliveryOrderDate} 00:00:00`,
          arrivalDate: `${arrivalDate} 00:00:00`,
          checkFlag,
        };
      });

      createDeliveryOrders(lines).then(async (res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          LogisticsDS.current.set('sourceDocId', res.deliveryOrderId);
          LogisticsDS.current.set('sourceDocNum', res.deliveryOrderNum);
          await LogisticsDS.submit();
          if (status === 'NEW') {
            handleSearch();
          } else {
            history.push({
              pathname: `/zcom/delivery-create-by`,
            });
          }
        } else if (res.failed && res.code === 'hzmc.warn.check.delivery.num') {
          Modal.confirm({
            children: (
              <>
                {res.message &&
                  res.message.split('\n').map((item) => {
                    return <p>{item}</p>;
                  })}
              </>
            ),
            onOk: () => {
              handleSave(status, 0);
            },
          });
        } else {
          notification.error({
            message: res.message,
          });
          resolve(false);
          return false;
        }
        resolve();
      });
    });
  };

  const supplierFileds = [
    <TextField name="recvSupplierName" key="recvSupplierName" disabled />,
    <TextField name="recvSupplierOrgName" key="recvSupplierOrgName" disabled />,
  ];

  const subCompanyFileds = [
    <TextField name="recvCompanyName" key="recvCompanyName" disabled />,
    <TextField name="recvInventoryOrgName" key="recvInventoryOrgName" disabled />,
  ];

  return (
    <Fragment>
      <Header title={getTitle()} backPath="/zcom/delivery-create-by">
        {canEdit && (
          <>
            <Button onClick={() => handleSave('NEW', 1)} color="primary">
              保存
            </Button>
            <Button onClick={() => handleSave('DELIVERED', 1)} color="primary">
              提交发货
            </Button>
          </>
        )}
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
            {/* <InputLov dataSet={HeadDS} name="itemObj" textField="itemDesc" disabled /> */}
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
