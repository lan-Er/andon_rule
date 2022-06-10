/*
 * @Description: 销售订单执行 - 供应商侧
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-25 13:23:39
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-25 13:24:57
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment, useState, useEffect } from 'react';
import { Tabs, Table, Button, DataSet } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import { getCurrentUser } from 'utils/utils';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import { getSerialNum } from '@/utils/renderer';
import { listDS } from '@/stores/purchaseReceiptConfirmationDS';

import styles from './index.less';

const { TabPane } = Tabs;
const { loginName } = getCurrentUser();

const tabsList = [
  {
    name: '待接收',
    value: '已发运',
    count: 0,
  },
  {
    name: '已接收',
    value: '已接收',
    count: 0,
  },
];

const PurchaseReceiptConfirmation = (props) => {
  const todoListDataSetFactory = () =>
    new DataSet({
      ...listDS(),
    });
  const ListDS = useDataSet(todoListDataSetFactory, PurchaseReceiptConfirmation);

  const [tabsInfo, setTabsInfo] = useState(tabsList);
  const [curTab, setCurTab] = useState(tabsList[0].name);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { dispatch } = props;

  useEffect(() => {
    ListDS.setQueryParameter('attribute5', tabsInfo[0].value);
    ListDS.query();
    queryTabsQty();
  }, []);

  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { header: 'No.', width: 50, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      {
        name: 'attribute12',
        lock: 'left',
        width: 150,
        tooltip: 'overflow',
        renderer: ({ record, value }) => (
          <span className={styles['text-wrap']}>{`${value} ${record.get('attribute13')}`}</span>
        ),
      },
      {
        name: 'attribute29',
        lock: 'left',
        width: 150,
        tooltip: 'overflow',
        renderer: ({ value }) => <span className={styles['text-wrap']}>{value}</span>,
      },
      {
        name: 'attribute21',
        tooltip: 'overflow',
        lock: 'left',
        width: 150,
        renderer: ({ record, value }) => handleCellRender(value, record.get('attribute22')),
      },
      {
        name: 'attribute2',
        tooltip: 'overflow',
        width: 150,
        renderer: ({ value }) => <span className={styles['text-wrap']}>{value}</span>,
      },
      {
        name: 'attribute38',
        tooltip: 'overflow',
        renderer: ({ record, value }) => (
          <span className={styles['text-wrap']}>{`${value} ${record.get('attribute25')}`}</span>
        ),
      },
      { name: 'attribute39', tooltip: 'overflow' },
      { name: 'attribute33', tooltip: 'overflow' },
      { name: 'attribute18', tooltip: 'overflow' },
      { name: 'attribute19', tooltip: 'overflow' },
      { name: 'attribute15', tooltip: 'overflow' },
      {
        name: 'attribute27',
        lock: 'right',
        tooltip: 'overflow',
        renderer: ({ record, value }) => (
          <span className={styles['text-wrap']}>{`${value} ${record.get('attribute25')}`}</span>
        ),
      },
      { name: 'attribute28', lock: 'right', tooltip: 'overflow', editor: curTab === '待接收' },
    ];
  }

  /**
   * 换行内容渲染
   * @param {*} record 当前行记录
   */
  function handleCellRender(upValue, downValue) {
    return (
      <>
        <span className={styles['text-wrap']}>{upValue}</span>
        <br />
        <span className={`${styles['down-font']} ${styles['text-wrap']}`}>{downValue}</span>
      </>
    );
  }

  /**
   * 页签切换查询
   * @param {string} key 页签标识
   */
  function handleTabChange(key) {
    const [value, name] = key.split('-');
    ListDS.setQueryParameter('attribute5', value);
    ListDS.query();
    queryTabsQty(name);
    setCurTab(name);
  }

  /**
   * 查询标签数量
   */
  async function queryTabsQty() {
    if (!ListDS.queryDataSet.current) {
      ListDS.queryDataSet.create();
    }
    const queryParams = ListDS.queryDataSet.current.toData();
    const promises = tabsInfo.map((item) => {
      const attribute5 = item.value;
      return dispatch({
        type: 'purchaseReceiptConfirmationModel/queryTabsQty',
        payload: { ...queryParams, attribute5, page: 0, size: 1 },
      });
    });
    const res = await Promise.all(promises);
    const datalist = res.map((item) => {
      if (item && item.content && item.totalElements) {
        return item.totalElements;
      }
      return 0;
    });
    const newTabsInfo = tabsInfo.map((item, index) => ({
      ...item,
      count: datalist[index],
    }));
    setTabsInfo(newTabsInfo);
  }

  /**
   * 确认订单
   */
  function handleSubmit() {
    return new Promise((resolve) => {
      const { selected } = ListDS;
      if (isEmpty(selected)) {
        notification.warning({
          message: '请先选择具体采购订单',
        });
        resolve(setConfirmLoading(false));
        return false;
      }
      const data = selected.map((item) => ({
        ...item.toData(),
        attribute5: '已接收',
        functionType: 'SUPPLIER_CHAIN',
        dataType: 'SHIP_ORDER',
        user: loginName,
      }));
      dispatch({
        type: 'purchaseReceiptConfirmationModel/submit',
        payload: data,
      }).then((res) => {
        if (res && !res.failed) {
          notification.warning({
            message: '提交成功',
          });
          ListDS.query();
          queryTabsQty();
        }
        resolve(setConfirmLoading(false));
      });
    });
  }

  return (
    <Fragment>
      <Header title="采购接收确认">
        <Button
          onClick={() => handleSubmit()}
          loading={confirmLoading}
          color="primary"
          disabled={curTab === '已接收'}
        >
          提交
        </Button>
      </Header>
      <Content className={styles['lisp-purchase-receipt']}>
        <Tabs defaultActiveKey="已发运-待接收" onChange={handleTabChange}>
          {tabsInfo.map((item) => (
            <TabPane tab={`${item.name}(${item.count})`} key={`${item.value}-${item.name}`} />
          ))}
        </Tabs>
        <div className={styles.content}>
          <Table
            dataSet={ListDS}
            columns={columns()}
            border={false}
            columnResizable="true"
            rowHeight="auto"
            style={{ height: 550 }}
          />
        </div>
      </Content>
    </Fragment>
  );
};

export default PurchaseReceiptConfirmation;
