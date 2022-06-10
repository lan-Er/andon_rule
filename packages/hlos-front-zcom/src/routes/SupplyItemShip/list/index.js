/**
 * @Description: 采购方供料发货
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-06-08 17:47:27
 */

import React, { useEffect, useState, Fragment } from 'react';
import { DataSet, Button, Tabs, Table, Modal } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import LogModal from '@/components/LogModal/index';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import { submitDeliveryOrder } from '@/services/supplyItemShipService';
import {
  SupplyItemToShipDetailLineDS,
  ShipOrderListDS,
  reserveDetailLineDS,
} from '../store/indexDS';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.supplyItemShip';
const supplyItemToShipDetailLineDS = () => new DataSet(SupplyItemToShipDetailLineDS());
const shipOrderListDS = () => new DataSet(ShipOrderListDS());
const cloneReserveDetailLineDS = () => new DataSet(reserveDetailLineDS());

function ZcomSupplyItemShip({ history, dispatch }) {
  const DetailLineDS = useDataSet(() => supplyItemToShipDetailLineDS());
  const DeliveryListDS = useDataSet(() => shipOrderListDS());
  const ReserveDetailLineDS = useDataSet(() => cloneReserveDetailLineDS());

  const [curTab, setCurTab] = useState('detailLine');

  useEffect(() => {
    DetailLineDS.query();
  }, []);

  function handleCreateShip() {
    return new Promise((resolve) => {
      if (!DetailLineDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      const arr = DetailLineDS.selected.map((v) => ({
        ...v.toData(),
      }));
      dispatch({
        type: 'supplyItemShip/createOutDeliveryOrder',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          const pathName = `/zcom/supply-item-ship/detail/${res.deliveryOrderId}`;
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  function handleCreateReserve() {
    return new Promise((resolve) => {
      if (!ReserveDetailLineDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      const arr = ReserveDetailLineDS.selected.map((v) => ({
        ...v.toData(),
      }));
      dispatch({
        type: 'supplyItemShip/createDeliveryOrders',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          const pathName = `/zcom/supply-item-ship/detail/${res.deliveryOrderId}`;
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  const handleOperate = (apiName, status) => {
    return new Promise(async (resolve) => {
      let validateFlag = true;
      let cancelValidateFlag = true;
      if (!DeliveryListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      const params = DeliveryListDS.selected.map((item) => {
        if (item.data.deliveryOrderStatus !== 'NEW') {
          validateFlag = false;
        }
        if (item.data.deliveryOrderStatus !== 'DELIVERED') {
          cancelValidateFlag = false;
        }
        return {
          ...item.data,
          deliveryOrderStatus: status,
        };
      });
      if (!validateFlag && apiName === 'deleteDeliveryOrder') {
        notification.warning({
          message: '选中的发货单有无法删除的发货单（已发货/已取消/已关闭），请检查后选择!',
        });
        resolve(false);
        return false;
      }
      if (!validateFlag && apiName === 'submitDeliveryOrder') {
        notification.warning({
          message: '选中的发货单有无法提交发货的发货单（已发货/已取消/已关闭），请检查后选择!',
        });
        resolve(false);
        return false;
      }
      if (!cancelValidateFlag && apiName === 'cancelDeliveryOrder') {
        notification.warning({
          message: '选中的发货单有无法取消发货的发货单（新建/已关闭/已取消），请检查后选择!',
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: `supplyItemShip/${apiName}`,
        payload: params,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          DeliveryListDS.query();
        }
        resolve();
      });
    });
  };

  const handleSubmit = (checkFlag) => {
    return new Promise(async (resolve) => {
      let validateFlag = true;
      const params = DeliveryListDS.selected.map((item) => {
        if (item.data.deliveryOrderStatus !== 'NEW') {
          validateFlag = false;
        }

        return {
          ...item.data,
          deliveryOrderStatus: 'DELIVERED',
          checkFlag,
        };
      });

      if (!validateFlag) {
        notification.warning({
          message: '选中的发货单有无法提交发货的发货单（已发货/已取消/已关闭），请检查后选择!',
        });
        resolve();
        return;
      }

      submitDeliveryOrder(params).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          DeliveryListDS.query();
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

  const handleTabChange = (key) => {
    setCurTab(key);
    if (key === 'deliveryList') {
      DeliveryListDS.query();
      return;
    }

    if (key === 'reserveDetailLine') {
      ReserveDetailLineDS.query();
      return;
    }
    DetailLineDS.query();
  };

  function handleToDetail(id) {
    history.push({
      pathname: `/zcom/supply-item-ship/detail/${id}`,
    });
  }

  const listColumns = [
    {
      name: 'deliveryOrderNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('deliveryOrderId');
        return <a onClick={() => handleToDetail(id)}>{value}</a>;
      },
      lock: 'left',
    },
    { name: 'customerName', width: 150 },
    { name: 'supplierName', width: 150 },
    {
      name: 'deliveryOrderDate',
      width: 100,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'arrivalDate',
      width: 120,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'customerInventoryOrgName', width: 150 },
    { name: 'supplierInventoryOrgName', width: 150 },
    { name: 'receivingAddress', width: 150 },
    { name: 'consigneeName', width: 150 },
    { name: 'consigneePhone', width: 150 },
    { name: 'externalStockOutStatusMeaning', width: 100, lock: 'right' },
    { name: 'deliveryOrderStatus', width: 90, lock: 'right' },
    {
      header: '日志',
      width: 80,
      renderer: ({ record }) => {
        return (
          <LogModal id={record.get('deliveryOrderId')}>
            <a>日志</a>
          </LogModal>
        );
      },
      lock: 'right',
    },
  ];

  const lineColumns = [
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
      lock: 'left',
    },
    { name: 'poNum', width: 150 },
    { name: 'poOutsourceNum', width: 90 },
    { name: 'customerUomName', width: 60 },
    { name: 'customerPromiseQty', width: 100 },
    { name: 'customerUnshipped', width: 100 },
    {
      name: 'customerPromiseDate',
      width: 120,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
  ];

  const reserveLineColumns = [
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
      lock: 'left',
    },
    { name: 'relatedDeliveryApplyNum', width: 150 },
    { name: 'relatedApplyLineNum', width: 90 },
    { name: 'customerUomName', width: 70 },
    { name: 'customerDeliveryQty', width: 80 },
    { name: 'customerUnshippedQty', minWidth: 150 },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum', width: 100 },
    { name: 'customerPromiseQty', width: 80 },
    { name: 'customerShippableQty', minWidth: 90 },
    { name: 'customerUncreatedDeliveryQty', minWidth: 90 },
    { name: 'customerInventoryOrgName', width: 120 },
    { name: 'supplierName', width: 150 },
    { name: 'deliveryOrderDate', width: 120 },
    {
      name: 'arrivalDate',
      width: 120,
    },
    { name: 'consignerName', width: 100 },
    { name: 'receivingAddress', width: 150 },
    { name: 'consigneeName', width: 100 },
    { name: 'consigneePhone', minWidth: 150 },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.supplyItemShip`).d('采购方供料发货')}>
        {curTab === 'detailLine' && <Button onClick={handleCreateShip}>创建发货</Button>}
        {curTab === 'deliveryList' && (
          <>
            <Button
              color="primary"
              // onClick={() => handleOperate('submitDeliveryOrder', 'DELIVERED')}
              onClick={() => handleSubmit(1)}
            >
              提交发货
            </Button>
            <Button onClick={() => handleOperate('deleteDeliveryOrder')}>删除</Button>
            <Button onClick={() => handleOperate('cancelDeliveryOrder', 'CANCELLED')}>取消</Button>
          </>
        )}
        {curTab === 'reserveDetailLine' && <Button onClick={handleCreateReserve}>创建发货</Button>}
      </Header>
      <Content className={styles['supply-item-ship-content']}>
        <Tabs defaultActiveKey="detailLine" onChange={handleTabChange}>
          <TabPane tab="订单待发货明细" key="detailLine">
            <Table
              dataSet={DetailLineDS}
              columns={lineColumns}
              columnResizable="true"
              rowHeight="auto"
            />
          </TabPane>
          <TabPane tab="已预约待发货明细" key="reserveDetailLine">
            <Table
              dataSet={ReserveDetailLineDS}
              columns={reserveLineColumns}
              columnResizable="true"
              rowHeight="auto"
            />
          </TabPane>
          <TabPane tab="发货单列表" key="deliveryList">
            <Table
              dataSet={DeliveryListDS}
              columns={listColumns}
              columnResizable="true"
              rowHeight="auto"
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomSupplyItemShip);
