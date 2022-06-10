/*
 * @Description: 供应商交货
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-27 13:02:28
 * @LastEditors: Axtlive
 */

import React, { Fragment, useEffect, useState, useMemo, useCallback } from 'react';
import { Button, Modal, DataSet, Table, Form, TextField, Lov } from 'choerodon-ui/pro';

import notification from 'utils/notification';
import { Content, Header } from 'components/Page';
import { surnamesRender, getSerialNum } from '@/utils/renderer';
import { queryList, updateList } from '@/services/api';
import ascIcon from '../../assets/supplierOrder/asc.svg';
import descIcon from '../../assets/supplierOrder/desc.svg';
import customerIcon from '../../assets/supplierOrder/customer.svg';

import { dsConfig, filterDSConfig } from '@/stores/supplierDeliveryDS';
import styles from './index.module.less';

const key = Modal.key();
const filterDS = new DataSet(filterDSConfig());

function handleFilter(ds) {
  Modal.open({
    key,
    title: '筛选',
    drawer: true,
    onOk: () => {
      ds.setQueryParameter('attribute2', filterDS.current?.get('attribute28'));
      ds.setQueryParameter('attribute9', filterDS.current?.get('attribute2'));
      ds.setQueryParameter('attribute4', filterDS.current?.get('attribute25'));
      ds.setQueryParameter('field', null);
      ds.query();
    },
    onCancel: () => setTimeout(() => filterDS.current?.clear(), 500),
    children: (
      <Form dataSet={filterDS}>
        <TextField name="attribute28" />
        <Lov name="attribute2Obj" searchable />
        <Lov name="attribute25Obj" searchable />
      </Form>
    ),
  });
}

async function handleConfirm(ds) {
  if (ds.selected?.length) {
    const changedItems = ds.selected.map((i) => ({
      ...i.toJSONData(),
      attribute20: '已确认',
    }));
    // console.log('changedItems: ', changedItems);
    try {
      await updateList(
        {
          functionType: 'SUPPLIER_CHAIN_OVERALL',
          dataType: 'SHIP_ORDER',
        },
        changedItems
      );
      const orderList = await Promise.all(
        ds.selected.map((rec) =>
          queryList({
            functionType: 'SUPPLIER_CHAIN_OVERALL',
            dataType: 'ORDER',
            attribute28: rec.get('attribute2'),
            attribute1: rec.get('attribute3'),
            attribute4: rec.get('attribute6'),
          })
        )
      );
      // console.log('orderList: ', orderList);
      const updatedOrderList = orderList
        .map((i) => i.content)
        .reduce((acc, val, j) => {
          const order = val?.[0];
          if (order) {
            const sentNum = parseInt(order.attribute41, 0);
            const pendingNum = parseInt(ds.selected[j].get('attribute12'), 0);
            if (!isNaN(sentNum) && !isNaN(pendingNum)) {
              acc.push({
                ...order,
                attribute9: '已发货',
                attribute41: sentNum + pendingNum,
                attribute18: order.attribute14,
              });
            }
          }
          return acc;
        }, []);
      // console.log('updatedOrderList: ', updatedOrderList);
      if (updatedOrderList.length > 0) {
        await updateList(
          {
            functionType: 'SUPPLIER_CHAIN_OVERALL',
            dataType: 'ORDER',
          },
          updatedOrderList
        );
      }
      notification.success({
        message: '提交成功',
      });
      ds.query();
      // eslint-disable-next-line no-empty
    } catch {}
  } else {
    notification.warning({
      message: '请至少选择一条单据',
    });
  }
}

export default function SupplierDeliveryResponse() {
  const [shipmentCountOrder, setShipmentCountOrder] = useState(null);
  const [orderCountOrder, setOrderCountOrder] = useState(null);
  const ds = useMemo(() => new DataSet(dsConfig()), []);

  useEffect(() => {
    if ((shipmentCountOrder && !orderCountOrder) || (!shipmentCountOrder && orderCountOrder)) {
      ds.setQueryParameter('sortFlag', (shipmentCountOrder || orderCountOrder) === 'desc');
      ds.setQueryParameter('field', shipmentCountOrder ? 'attribute7' : 'attribute5');
      ds.query();
    }
  }, [shipmentCountOrder, orderCountOrder, ds]);

  const handleSort = useCallback(
    (type) => {
      const amountType = type === 'shipment';
      const orderName = amountType ? shipmentCountOrder : orderCountOrder;
      const handler = amountType ? setShipmentCountOrder : setOrderCountOrder;
      const resetHandler = amountType ? setOrderCountOrder : setShipmentCountOrder;
      if (orderName === null) {
        handler('desc');
      } else {
        handler(orderName === 'desc' ? 'asc' : 'desc');
      }
      resetHandler(null);
    },
    [orderCountOrder, shipmentCountOrder]
  );

  const getTableColumns = useCallback(() => {
    return [
      {
        name: 'serialNumber',
        key: 'No.',
        editor: false,
        width: 50,
        align: 'center',
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'attribute1',
        key: '发货单号',
        editor: false,
        width: 150,
      },
      {
        name: 'attribute2',
        key: '销售订单号',
        editor: false,
        width: 150,
      },
      {
        name: 'attribute3',
        key: '客户采购订单号',
        editor: false,
        width: 150,
      },
      {
        name: 'attribute4&5',
        key: '产品',
        editor: false,
        width: 150,
        renderer({ record }) {
          return (
            <div className={styles.prod}>
              <div className={styles.val}>{record.get('attribute4')}</div>
              <div className={styles.desc}>{record.get('attribute5')}</div>
            </div>
          );
        },
      },
      {
        name: 'attribute6&7',
        key: '客户物料',
        editor: false,
        width: 150,
        renderer({ record }) {
          return (
            <div className={styles.prod}>
              <div className={styles.val}>{record.get('attribute6')}</div>
              <div className={styles.desc}>{record.get('attribute7')}</div>
            </div>
          );
        },
      },
      {
        name: 'attribute9',
        key: '客户',
        editor: false,
        width: 150,
        renderer: ({ value, record }) => (
          <Fragment>
            {record.get('attribute10') === '1' && (
              <img src={customerIcon} alt="customerIcon" style={{ marginRight: '6px' }} />
            )}
            {value}
          </Fragment>
        ),
      },
      {
        name: 'attribute11&13',
        key: '订单数量',
        editor: false,
        width: 120,
        align: 'right',
        renderer({ record }) {
          const QTY = record.get('attribute11') || '';
          const UOM = record.get('attribute13');
          return <Fragment>{`${QTY} ${UOM}`}</Fragment>;
        },
        header(dataset, name) {
          const field = dataset.getField(name);
          return (
            <div onClick={() => handleSort('order')} className={styles.sort}>
              <span className={styles.label}>{field ? field.get('label') : ''}</span>
              <span className={styles.icon}>
                {orderCountOrder && (
                  <img src={orderCountOrder === 'desc' ? descIcon : ascIcon} alt="order" />
                )}
              </span>
            </div>
          );
        },
      },
      {
        name: 'attribute12&13',
        key: '发货数量',
        editor: false,
        width: 120,
        align: 'right',
        renderer({ record }) {
          const QTY = record.get('attribute12');
          const UOM = record.get('attribute13');
          return <Fragment>{`${QTY} ${UOM}`}</Fragment>;
        },
        header(dataset, name) {
          const field = dataset.getField(name);
          return (
            <div onClick={() => handleSort('shipment')} className={styles.sort}>
              <span className={styles.label}>{field ? field.get('label') : ''}</span>
              <span className={styles.icon}>
                {shipmentCountOrder && (
                  <img src={shipmentCountOrder === 'desc' ? descIcon : ascIcon} alt="order" />
                )}
              </span>
            </div>
          );
        },
      },
      {
        name: 'attribute14',
        key: '发运日期',
        editor: false,
        width: 150,
      },
      {
        name: 'attribute15',
        key: '承诺日期',
        editor: false,
        width: 150,
      },
      {
        name: 'attribute16',
        key: '预计到货时间',
        editor: false,
        width: 200,
      },
      {
        name: 'attribute17',
        key: '销售员',
        editor: false,
        width: 150,
        renderer: ({ value }) => surnamesRender(value),
      },
      {
        name: 'attribute18',
        key: '客户采购员',
        editor: false,
        width: 150,
        renderer: ({ value }) => surnamesRender(value),
      },
      {
        name: 'attribute19',
        key: '采购员联系方式',
        editor: false,
        width: 150,
      },
    ];
  }, [orderCountOrder, shipmentCountOrder, handleSort]);

  return (
    <Fragment>
      <Header title="供应商交货">
        <Button icon="filter2" color="primary" onClick={() => handleFilter(ds)}>
          筛选
        </Button>
      </Header>
      <Content>
        <Button color="primary" onClick={() => handleConfirm(ds)} style={{ marginBottom: '12px' }}>
          发货确认
        </Button>
        <Table dataSet={ds} columns={getTableColumns()} border={false} rowHeight="auto" />
      </Content>
    </Fragment>
  );
}
