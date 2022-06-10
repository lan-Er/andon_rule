/*
 * @Description: 销售订单详情 - 供应商侧
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-06-25 13:23:39
 * @LastEditors: liangkun
 * @LastEditTime: 2020-06-25 13:24:57
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment, useState, useEffect } from 'react';
import {
  Table,
  Button,
  DataSet,
  Modal,
  Lov,
  Tabs,
  NumberField,
  Progress,
  Switch,
} from 'choerodon-ui/pro';
import { Row, Col } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import { orderStatusRender, surnamesRender, moneyFormat, getSerialNum } from '@/utils/renderer';
import { supplierListDS } from '@/stores/soDetailsDS';

import styles from './index.less';
import redFlag from '../../assets/icons/red-flag.svg';
import shipment from '../../assets/icons/shipment.svg';
import product from '../../assets/icons/product.svg';

const { TabPane } = Tabs;
const tabsList = [
  {
    name: '待确认',
    value: '新建',
    count: 0,
  },
  {
    name: '待回复',
    value: '已确认',
    count: 0,
  },
  {
    name: '待计划',
    value: '已回复',
    count: 0,
  },
  {
    name: '待下达',
    value: '已计划',
    count: 0,
  },
  {
    name: '运行中',
    value: '运行中',
    count: 0,
  },
  {
    name: '发运中',
    value: '发运中',
    count: 0,
  },
];

const SupplierSalesOrderDetails = (props) => {
  const todoListDataSetFactory = () =>
    new DataSet({
      ...supplierListDS(),
    });
  const ListDS = useDataSet(todoListDataSetFactory, SupplierSalesOrderDetails);

  const [tabsInfo, setTabsInfo] = useState(tabsList);
  const [status, setStatus] = useState('新建');

  const { dispatch } = props;

  useEffect(() => {
    handleSearch();
  }, []);

  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { header: 'No.', width: 50, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      { name: 'attribute28', lock: 'left', width: 150 },
      {
        name: 'attribute25',
        lock: 'left',
        width: 150,
        renderer: ({ record, value }) => handleCellRender(value, record.get('attribute33')),
        tooltip: 'overflow',
      },
      {
        name: 'attribute2',
        tooltip: 'overflow',
        width: 120,
        renderer: ({ record, value }) => handleCustomerRender(value, record.get('attribute43')),
      },
      {
        name: 'attribute23',
        tooltip: 'overflow',
        width: 120,
        renderer: ({ value }) => surnamesRender(value),
      },
      {
        name: 'attribute5',
        tooltip: 'overflow',
        width: 150,
        renderer: ({ record, value }) => (
          <span className={styles['text-wrap']}>{`${value} ${record.get('attribute6')}`}</span>
        ),
      },
      {
        name: 'attribute7',
        tooltip: 'overflow',
        sortable: true,
        width: 130,
        renderer: ({ record, value }) => (
          <span className={styles['text-wrap']}>
            {`${record.get('attribute8')} ${moneyFormat(value)}`}
          </span>
        ),
      },
      {
        name: 'attribute9',
        tooltip: 'overflow',
        renderer: ({ value }) => orderStatusRender(value),
      },
      { name: 'attribute12', tooltip: 'overflow', sortable: true, width: 120 },
      {
        name: 'attribute29',
        width: 200,
        tooltip: 'overflow',
        hidden:
          status === '新建' || status === '已确认' || status === '已回复' || status === '已计划',
        renderer: ({ record, value }) => handleProcessRender(value, record.get('attribute30')),
      },
      {
        name: 'attribute4',
        width: 150,
        tooltip: 'overflow',
        renderer: ({ record, value }) => handleCellRender(value, record.get('attribute26')),
      },
      {
        name: 'attribute1',
        width: 150,
        tooltip: 'overflow',
        renderer: ({ value }) => <span className={styles['text-wrap']}>{value}</span>,
      },
    ];
  }

  /**
   * 关键客户渲染
   * @param {*} record 当前行记录
   */
  function handleCustomerRender(upValue, flag) {
    return (
      <span>
        {flag === '1' && <img src={redFlag} alt="关键客户" />}
        {` ${upValue}`}
      </span>
    );
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
   * 进度条渲染
   * @param {*} record 当前行记录
   */
  function handleProcessRender(upValue, downValue) {
    const prodProgress = upValue ? Number(upValue) : 0;
    const shipProgress = downValue ? Number(downValue) : 0;
    return (
      <>
        <div className={styles['progress-box']}>
          <div className={styles['progress-header']}>
            <img src={shipment} alt="生产" />
            <span className={styles['progress-title']}>生产</span>
          </div>
          <Progress value={Number(prodProgress)} />
        </div>
        <div className={styles['progress-box']}>
          <div className={styles['progress-header']}>
            <img src={product} alt="发运" />
            <span className={styles['progress-title']}>发运</span>
          </div>
          <Progress value={Number(shipProgress)} />
        </div>
      </>
    );
  }

  /**
   * 搜索框内容
   */
  function searchBoxRender() {
    return (
      <Fragment>
        <Row>
          <Col span={5} className="c7n-pro-field-label c7n-pro-field-label-right">
            客户
          </Col>
          <Col span={19} className="c7n-pro-field-wrapper">
            <Lov
              name="attribute2"
              noCache
              colSpan={2}
              dataSet={ListDS.queryDataSet}
              className={styles['max-width']}
            />
          </Col>
        </Row>
        <Row>
          <Col span={5} className="c7n-pro-field-label c7n-pro-field-label-right">
            销售员
          </Col>
          <Col span={19} className="c7n-pro-field-wrapper">
            <Lov
              name="attribute23"
              noCache
              colSpan={2}
              dataSet={ListDS.queryDataSet}
              className={styles['max-width']}
            />
          </Col>
        </Row>
        <Row>
          <Col span={5} className="c7n-pro-field-label c7n-pro-field-label-right">
            产品
          </Col>
          <Col span={19} className="c7n-pro-field-wrapper">
            <Lov
              name="attribute25"
              noCache
              colSpan={2}
              dataSet={ListDS.queryDataSet}
              className={styles['max-width']}
            />
          </Col>
        </Row>
        <Row>
          <Col span={5} className="c7n-pro-field-label c7n-pro-field-label-right">
            金额
          </Col>
          <Col span={9} className="c7n-pro-field-wrapper">
            <NumberField
              name="totalPriceFrom"
              dataSet={ListDS.queryDataSet}
              className={styles['max-width']}
            />
          </Col>
          <Col span={1} className={`c7n-pro-field-wrapper ${styles['field-concat']}`}>
            ~
          </Col>
          <Col span={9} className="c7n-pro-field-wrapper">
            <NumberField
              name="totalPriceTo"
              dataSet={ListDS.queryDataSet}
              className={styles['max-width']}
            />
          </Col>
        </Row>
        <Row>
          <Col span={5} className="c7n-pro-field-label c7n-pro-field-label-right">
            是否关键客户
          </Col>
          <Col span={19} className="c7n-pro-field-wrapper">
            <Switch name="attribute43" dataSet={ListDS.queryDataSet} />
          </Col>
        </Row>
      </Fragment>
    );
  }

  /**
   * 筛选弹框
   */
  function openSearchBox() {
    Modal.open({
      title: '筛选',
      drawer: true,
      children: searchBoxRender(),
      onOk: handleSearch,
      onCancel: handleReset,
      cancelText: '重置',
      closable: true,
      className: styles['lisp-sales-order'],
    });
  }

  /**
   * 重置
   */
  function handleReset() {
    ListDS.queryDataSet.current.reset();
    return false;
  }

  /**
   * 筛选
   */
  function handleSearch() {
    if (ListDS.queryDataSet.current) {
      const totalPriceFrom = ListDS.queryDataSet.current.get('totalPriceFrom');
      const totalPriceTo = ListDS.queryDataSet.current.get('totalPriceTo');
      if (totalPriceFrom > totalPriceTo) return false;
    }
    ListDS.query();
    queryTabsQty();
  }

  /**
   * 页签切换查询
   * @param {string} key 页签标识
   */
  function handleTabChange(key) {
    const totalPriceFrom = ListDS.queryDataSet.current.get('totalPriceFrom');
    const totalPriceTo = ListDS.queryDataSet.current.get('totalPriceTo');
    if (totalPriceFrom > totalPriceTo) {
      ListDS.queryDataSet.current.set({
        totalPriceFrom: '',
        totalPriceTo: '',
      });
    }
    setStatus(key);
    ListDS.queryDataSet.current.set('attribute9', key);
    ListDS.query();
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
      return dispatch({
        type: 'SalesOrderDetailsModel/queryTabsQty',
        payload: {
          ...queryParams,
          attribute9: item.value,
        },
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

  return (
    <Fragment>
      <Header title="订单详情">
        <Button onClick={() => openSearchBox()} color="primary" icon="filter2">
          筛选
        </Button>
      </Header>
      <Content className={styles['lisp-sales-order']}>
        <Tabs defaultActiveKey="新建" onChange={handleTabChange}>
          {tabsInfo.map((item) => (
            <TabPane tab={`${item.name}(${item.count})`} key={`${item.value}`} />
          ))}
        </Tabs>
        <Table
          dataSet={ListDS}
          columns={columns()}
          border={false}
          columnResizable="true"
          editMode="inline"
          queryBar="none"
          rowHeight="auto"
          style={{ height: 550 }}
        />
      </Content>
    </Fragment>
  );
};

export default SupplierSalesOrderDetails;
