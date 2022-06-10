/*
 * @Description: 供应商订单确认
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-26 09:57:28
 * @LastEditors: Please set LastEditors
 */

import moment from 'moment';
import React, { Fragment, useEffect, useState, useMemo, useCallback } from 'react';
import { Button, Modal, DataSet, Table, Form, TextField, Lov } from 'choerodon-ui/pro';

import { Content, Header } from 'components/Page';
import notification from 'utils/notification';
import { moneyFormat, surnamesRender, getSerialNum } from '@/utils/renderer';
import { updateList } from '@/services/api';

import ascIcon from '../../assets/supplierOrder/asc.svg';
import descIcon from '../../assets/supplierOrder/desc.svg';
import customerIcon from '../../assets/supplierOrder/customer.svg';

import {
  SupplierOrderConfirmationDSConfig,
  filterDSConfig,
} from '@/stores/supplierOrderConfirmationDS';
import styles from './index.module.less';

const key = Modal.key();
const filterDS = new DataSet(filterDSConfig());

function handleFilter(ds) {
  Modal.open({
    key,
    title: '筛选',
    drawer: true,
    onOk: () => {
      ds.setQueryParameter('attribute28', filterDS.current?.get('attribute28'));
      ds.setQueryParameter('attribute2', filterDS.current?.get('attribute2'));
      ds.setQueryParameter('attribute25', filterDS.current?.get('attribute25'));
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
      attribute9: '已确认',
      attribute14: moment().format('YYYY-MM-DD HH:mm:ss'),
    }));
    try {
      await updateList(
        {
          functionType: 'SUPPLIER_CHAIN_OVERALL',
          dataType: 'ORDER',
        },
        changedItems
      );
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

export default () => {
  // 金额排序
  const [amountOrder, setAmountOrder] = useState(null);
  const [numberOrder, setNumberOrder] = useState(null);
  const ds = useMemo(() => new DataSet(SupplierOrderConfirmationDSConfig()), []);

  useEffect(() => {
    async function query() {
      ds.query();
      await ds.ready();
      ds.records.forEach((rec) => {
        if (rec.get('attribute9' === '已确认')) {
          // eslint-disable-next-line no-param-reassign
          rec.selectable = false;
        }
      });
    }
    query();
  }, [ds]);

  useEffect(() => {
    if ((amountOrder && !numberOrder) || (!amountOrder && numberOrder)) {
      ds.setQueryParameter('sortFlag', (amountOrder || numberOrder) === 'desc');
      ds.setQueryParameter('field', amountOrder ? 'attribute7' : 'attribute5');
      ds.query();
    }
  }, [amountOrder, numberOrder, ds]);

  const handleSort = useCallback(
    (type) => {
      const amountType = type === 'amount';
      const orderName = amountType ? amountOrder : numberOrder;
      const handler = amountType ? setAmountOrder : setNumberOrder;
      const resetHandler = amountType ? setNumberOrder : setAmountOrder;
      if (orderName === null) {
        handler('desc');
      } else {
        handler(orderName === 'desc' ? 'asc' : 'desc');
      }
      resetHandler(null);
    },
    [numberOrder, amountOrder]
  );

  const getTableColumns = useCallback(() => {
    return [
      {
        name: 'serialNumber',
        key: 'serialNumber',
        editor: false,
        width: 50,
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'attribute28',
        key: '销售订单号',
        editor: false,
        width: 150,
      },
      {
        name: 'attribute25&33',
        key: '产品',
        editor: false,
        width: 150,
        renderer({ record }) {
          return (
            <div className={styles.prod}>
              <div className={styles.val}>{record.get('attribute25')}</div>
              <div className={styles.desc}>{record.get('attribute33')}</div>
            </div>
          );
        },
      },
      {
        name: 'attribute2',
        key: '客户',
        editor: false,
        width: 150,
        renderer: ({ value, record }) => (
          <Fragment>
            {record.get('attribute43') === '1' && (
              <img src={customerIcon} alt="customerIcon" style={{ marginRight: '6px' }} />
            )}
            {value}
          </Fragment>
        ),
      },
      {
        name: 'attribute24',
        key: '销售员',
        editor: false,
        width: 150,
        renderer: ({ value }) => surnamesRender(value),
      },
      {
        name: 'attribute5&6',
        key: '数量',
        editor: false,
        width: 120,
        align: 'right',
        renderer({ record }) {
          const QTY = record.get('attribute5') || '';
          const UOM = record.get('attribute6');
          return <Fragment>{`${QTY} ${UOM}`}</Fragment>;
        },
        header(dataset, name) {
          const field = dataset.getField(name);
          return (
            <div onClick={() => handleSort('number')} className={styles.sort}>
              <span className={styles.label}>{field ? field.get('label') : ''}</span>
              <span className={styles.icon}>
                {numberOrder && (
                  <img src={numberOrder === 'desc' ? descIcon : ascIcon} alt="order" />
                )}
              </span>
            </div>
          );
        },
      },
      {
        name: 'attribute8&7',
        key: '金额',
        editor: false,
        // width: 120,
        align: 'right',
        renderer({ record }) {
          const CURRENCY = record.get('attribute8');
          const TOTAL_PRICE = record.get('attribute7') || '';
          return <span>{`${CURRENCY} ${moneyFormat(TOTAL_PRICE)}`}</span>;
        },
        header(dataset, name) {
          const field = dataset.getField(name);
          return (
            <div onClick={() => handleSort('amount')} className={styles.sort}>
              <span className={styles.label}>{field ? field.get('label') : ''}</span>
              <span className={styles.icon}>
                {amountOrder && (
                  <img src={amountOrder === 'desc' ? descIcon : ascIcon} alt="order" />
                )}
              </span>
            </div>
          );
        },
      },
    ];
  }, [numberOrder, amountOrder, handleSort]);

  return (
    <Fragment>
      <Header title="供应商订单确认">
        <Button icon="filter2" color="primary" onClick={() => handleFilter(ds)}>
          筛选
        </Button>
      </Header>
      <Content>
        <Button color="primary" onClick={() => handleConfirm(ds)} style={{ marginBottom: '12px' }}>
          订单确认
        </Button>
        <Table
          dataSet={ds}
          columns={getTableColumns()}
          border={false}
          rowHeight="auto"
          onRow={({ record }) => {
            if (record.get('attribute9') === '已确认') {
              return {
                style: {
                  filter: 'grayscale(100%)',
                },
              };
            }
          }}
        />
      </Content>
    </Fragment>
  );
};
