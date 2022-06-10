/**
 * @Description: 采购方供料发货单详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-06-08 17:48:19
 */

import React, { useEffect, useState, Fragment } from 'react';
import {
  DataSet,
  Button,
  Form,
  Lov,
  TextField,
  Select,
  DatePicker,
  Tabs,
  Table,
  Modal,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import { submitDeliveryOrder } from '@/services/supplyItemShipService';
import { ShipOrderHeadDS, ShipOrderLineDS } from '../store/indexDS';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.supplyItemShip';
const shipOrderHeadDS = () => new DataSet(ShipOrderHeadDS());
const shipOrderLineDS = () => new DataSet(ShipOrderLineDS());

function ZcomSupplyItemShipDetail({ match, dispatch, history }) {
  const HeadDS = useDataSet(shipOrderHeadDS, ZcomSupplyItemShipDetail);
  const LineDS = useDataSet(shipOrderLineDS);

  const {
    params: { deliveryOrderId },
  } = match;

  const [canEdit, setCanEdit] = useState(false); // 是否可编辑
  const [deliveryShow, setDeliveryShow] = useState(true);
  const [receiveShow, setReceiveShow] = useState(true);

  useEffect(() => {
    HeadDS.data = [];
    LineDS.data = [];
    HeadDS.create();
    HeadDS.setQueryParameter('deliveryOrderId', deliveryOrderId);
    LineDS.setQueryParameter('deliveryOrderId', deliveryOrderId);
    handleSearch();
  }, [deliveryOrderId]);

  async function handleSearch() {
    await HeadDS.query();
    setCanEdit(HeadDS.current.get('deliveryOrderStatus') === 'NEW');
    await LineDS.query();
  }

  const handleOperate = (apiName, status) => {
    return new Promise(async (resolve) => {
      if (apiName === 'updateDeliveryOrders') {
        const validateHead = await HeadDS.current.validate(true, false);
        if (!validateHead) {
          notification.warning({
            message: '数据校验不通过',
          });
          resolve(false);
          return false;
        }
      }
      const headers = HeadDS.current.toData();
      const lines = LineDS.toData();
      const params = {
        ...headers,
        deliveryOrderStatus: status || headers.deliveryOrderStatus,
        deliveryOrderLineList: lines,
      };
      dispatch({
        type: `supplyItemShip/${apiName}`,
        payload: status === 'NEW' ? params : [params],
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          if (apiName === 'updateDeliveryOrders') {
            handleSearch();
            resolve();
            return;
          }
          history.push({
            pathname: '/zcom/supply-item-ship',
          });
        }
        resolve();
      });
    });
  };

  const handleSubmit = (checkFlag) => {
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      if (!validateHead) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(false);
        return false;
      }
      const headers = HeadDS.current.toData();
      const lines = LineDS.toData().map((i) => ({ ...i, checkFlag }));
      const params = {
        ...headers,
        deliveryOrderStatus: 'DELIVERED',
        deliveryOrderLineList: lines,
        checkFlag,
      };
      submitDeliveryOrder([params]).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          history.push({
            pathname: '/zcom/supply-item-ship',
          });
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
              handleSubmit(0);
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

  const columns = [
    { name: 'deliveryOrderLineNum', width: 60, lock: 'left' },
    {
      name: 'customerItem',
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
      name: 'supplierItem',
      width: 150,
      minWidth: 120,
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
    { name: 'customerUomName', width: 80 },
    { name: 'customerDemandQty', width: 100 },
    {
      name: 'customerShippableQty',
      width: 100,
      renderer: ({ value }) => (Number(value) < 0 ? 0 : value),
    },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum', width: 80 },
    { name: 'customerDeliveryQty', width: 120, lock: 'right', editor: canEdit, align: 'left' },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.deliveryOrderDetail`).d('发货单详情')}
        backPath="/zcom/supply-item-ship"
      >
        {canEdit && (
          <>
            <Button onClick={() => handleOperate('updateDeliveryOrders', 'NEW')} color="primary">
              保存
            </Button>
            <Button onClick={() => handleSubmit(1)}>提交发货</Button>
          </>
        )}
        <Button onClick={() => handleOperate('cancelDeliveryOrder', 'CANCELLED')}>取消</Button>
        {canEdit && <Button onClick={() => handleOperate('deleteDeliveryOrder')}>删除</Button>}
      </Header>
      <Content className={styles['zcom-supply-item-ship-detail-content']}>
        <div className={styles['zcom-content-info']}>
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
            <Select name="deliveryOrderType" key="deliveryOrderType" disabled />
            <Select name="deliveryOrderStatus" key="deliveryOrderStatus" disabled />
            <TextField name="customerName" key="customerName" disabled />
            <Lov name="customerInventoryOrgObj" key="customerInventoryOrgObj" disabled={!canEdit} />
            <TextField name="deliveryAddress" key="deliveryAddress" disabled={!canEdit} />
            <TextField name="consignerName" key="consignerName" disabled={!canEdit} />
            <TextField name="consignerPhone" key="consignerPhone" disabled={!canEdit} />
            <TextField name="deliveryWarehouse" key="deliveryWarehouse" disabled={!canEdit} />
            <DatePicker name="deliveryOrderDate" key="deliveryOrderDate" disabled={!canEdit} />
            <DatePicker name="arrivalDate" key="arrivalDate" disabled={!canEdit} />
          </Form>
        )}
        <div className={styles['zcom-content-info']}>
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
            <TextField name="supplierName" key="supplierName" disabled />
            <Lov name="supplierInventoryOrgObj" key="supplierInventoryOrgObj" disabled={!canEdit} />
            <TextField name="receivingAddress" key="receivingAddress" disabled={!canEdit} />
            <TextField name="consigneeName" key="consigneeName" disabled={!canEdit} />
            <TextField name="consigneePhone" key="consigneePhone" disabled={!canEdit} />
            <TextField name="receivingWarehouse" key="receivingWarehouse" disabled={!canEdit} />
          </Form>
        )}
        <Tabs defaultActiveKey="basic">
          <TabPane tab="基础信息" key="basic">
            <Table dataSet={LineDS} columns={columns} columnResizable="true" rowHeight="auto" />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomSupplyItemShipDetail);
