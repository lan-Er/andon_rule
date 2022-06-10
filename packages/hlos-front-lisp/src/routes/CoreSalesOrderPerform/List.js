/*
 * @Description: 销售订单执行 - 核企侧
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
  DatePicker,
  Switch,
} from 'choerodon-ui/pro';
import moment from 'moment';
import { Row, Col } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import { orderStatusRender, surnamesRender, moneyFormat, getSerialNum } from '@/utils/renderer';
import { coreListDS } from '@/stores/soPerformDS';

import styles from './index.less';
import redFlag from '../../assets/icons/red-flag.svg';

const { TabPane } = Tabs;

const initDate = {
  confirmedDateFrom: '',
  confirmedDateTo: '',
  receivedDateFrom: '',
  receivedDateTo: '',
  releasedDateFrom: '',
  releasedDateTo: '',
  reportDateFrom: '',
  reportDateTo: '',
  shipDateFrom: '',
  shipDateTo: '',
};

const tabsList = [
  {
    name: '已确认',
    label: '确认时间',
    value: 'attribute14',
    count: 0,
  },
  {
    name: '已下达',
    label: '下达时间',
    value: 'attribute15',
    count: 0,
  },
  {
    name: '已完工',
    label: '完工时间',
    value: 'attribute17',
    count: 0,
  },
  {
    name: '已发运',
    label: '发运时间',
    value: 'attribute18',
    count: 0,
  },
  {
    name: '已接收',
    label: '接收时间',
    value: 'attribute19',
    count: 0,
  },
];

const CoreSalesOrderPerform = (props) => {
  const todoListDataSetFactory = () =>
    new DataSet({
      ...coreListDS(),
    });
  const ListDS = useDataSet(todoListDataSetFactory, CoreSalesOrderPerform);

  const [status, setStatus] = useState('已确认');
  const [tabsInfo, setTabsInfo] = useState(tabsList);

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
      { name: 'attribute1', width: 150, lock: 'left' },
      {
        name: 'attribute4',
        width: 150,
        lock: 'left',
        renderer: ({ record, value }) => handleCellRender(value, record.get('attribute26')),
        tooltip: 'overflow',
      },
      {
        name: 'attribute3',
        tooltip: 'overflow',
        renderer: ({ record, value }) => handleCustomerRender(value, record.get('attribute44')),
      },
      {
        name: 'attribute24',
        tooltip: 'overflow',
        renderer: ({ value }) => surnamesRender(value),
      },
      {
        name: 'attribute27',
        tooltip: 'overflow',
      },
      {
        name: 'attribute37',
        tooltip: 'overflow',
        hidden: status !== '已确认',
        sortable: true,
        renderer: ({ record, value }) => handleConcatRender(value, record.get('attribute6')),
      },
      {
        name: 'attribute38',
        tooltip: 'overflow',
        hidden: status !== '已下达',
        sortable: true,
        renderer: ({ record, value }) => handleConcatRender(value, record.get('attribute6')),
      },
      {
        name: 'attribute40',
        tooltip: 'overflow',
        hidden: status !== '已完工',
        sortable: true,
        renderer: ({ record, value }) => handleConcatRender(value, record.get('attribute6')),
      },
      {
        name: 'attribute41',
        tooltip: 'overflow',
        hidden: status !== '已发运',
        sortable: true,
        renderer: ({ record, value }) => handleConcatRender(value, record.get('attribute6')),
      },
      {
        name: 'attribute31',
        tooltip: 'overflow',
        hidden: status !== '已接收',
        sortable: true,
        renderer: ({ record, value }) => handleConcatRender(value, record.get('attribute6')),
      },
      {
        name: 'attribute7',
        width: 130,
        tooltip: 'overflow',
        sortable: true,
        renderer: ({ record, value }) => `${record.get('attribute8')} ${moneyFormat(value)}`,
      },
      {
        name: 'attribute9',
        tooltip: 'overflow',
        renderer: ({ value }) => orderStatusRender(value),
      },
      {
        name: 'attribute14',
        sortable: true,
        width: 160,
        tooltip: 'overflow',
        hidden: status !== '已确认',
      },
      {
        name: 'attribute15',
        sortable: true,
        width: 160,
        tooltip: 'overflow',
        hidden: status !== '已下达',
      },
      {
        name: 'attribute17',
        sortable: true,
        width: 160,
        tooltip: 'overflow',
        hidden: status !== '已完工',
      },
      {
        name: 'attribute18',
        sortable: true,
        width: 160,
        tooltip: 'overflow',
        hidden: status !== '已发运',
      },
      {
        name: 'attribute19',
        sortable: true,
        width: 160,
        tooltip: 'overflow',
        hidden: status !== '已接收',
      },
      { name: 'attribute12', sortable: true, width: 120, tooltip: 'overflow' },
      { name: 'attribute11', sortable: true, width: 120, tooltip: 'overflow' },
      {
        name: 'attribute33',
        width: 150,
        tooltip: 'overflow',
        renderer: ({ value, record }) => handleCellRender(record.get('attribute25'), value),
      },
      {
        name: 'attribute28',
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
   * 拼接渲染
   * @param {*} record 当前行记录
   */
  function handleConcatRender(beforeValue, afterValue) {
    return beforeValue && `${beforeValue} ${afterValue}`;
  }

  /**
   * 获取查询条件时间名
   */
  function getDateLabel() {
    const tabItemInfo = tabsList.find((item) => item.name === status);
    return tabItemInfo.label;
  }

  /**
   * 搜索框内容
   */
  function searchBoxRender() {
    return (
      <Fragment>
        <Row>
          <Col span={5} className="c7n-pro-field-label c7n-pro-field-label-right">
            供应商
          </Col>
          <Col span={19} className="c7n-pro-field-wrapper">
            <Lov
              name="attribute3"
              noCache
              colSpan={2}
              dataSet={ListDS.queryDataSet}
              className={styles['max-width']}
            />
          </Col>
        </Row>
        <Row>
          <Col span={5} className="c7n-pro-field-label c7n-pro-field-label-right">
            采购员
          </Col>
          <Col span={19} className="c7n-pro-field-wrapper">
            <Lov
              name="attribute24"
              noCache
              colSpan={2}
              dataSet={ListDS.queryDataSet}
              className={styles['max-width']}
            />
          </Col>
        </Row>
        <Row>
          <Col span={5} className="c7n-pro-field-label c7n-pro-field-label-right">
            物料
          </Col>
          <Col span={19} className="c7n-pro-field-wrapper">
            <Lov
              name="attribute4"
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
            {getDateLabel()}
          </Col>
          <Col span={9} className="c7n-pro-field-wrapper">
            <DatePicker
              dataSet={ListDS.queryDataSet}
              name="startDate"
              className={styles['max-width']}
              value={ListDS.queryDataSet.current.getState('startDate')}
            />
          </Col>
          <Col span={1} className={`c7n-pro-field-wrapper ${styles['field-concat']}`}>
            ~
          </Col>
          <Col span={9} className="c7n-pro-field-wrapper">
            <DatePicker
              dataSet={ListDS.queryDataSet}
              name="endDate"
              className={styles['max-width']}
              value={ListDS.queryDataSet.current.getState('endDate')}
            />
          </Col>
        </Row>
        <Row>
          <Col span={5} className="c7n-pro-field-label c7n-pro-field-label-right">
            是否关键供应商
          </Col>
          <Col span={19} className="c7n-pro-field-wrapper">
            <Switch name="attribute44" dataSet={ListDS.queryDataSet} />
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
    handleDateChange();
  }

  /**
   * 页签切换查询
   * @param {string} key 页签标识
   */
  function handleTabChange(key) {
    const [value, name] = key.split('-');
    setStatus(name);
    ListDS.queryDataSet.current.set('fieldDate', value);
    handleDateChange('', true, name);
  }

  /**
   * 查询标签数量
   */
  async function queryTabsQty() {
    if (!ListDS.queryDataSet.current) {
      ListDS.queryDataSet.create();
    }
    let queryParams = ListDS.queryDataSet.current.toData();
    const { startDate, endDate } = queryParams;
    const promises = tabsInfo.map((item) => {
      const fieldDate = item.value;
      switch (item.value) {
        case 'attribute14':
          queryParams = {
            ...queryParams,
            ...initDate,
            confirmedDateFrom: startDate,
            confirmedDateTo: endDate,
          };
          break;
        case 'attribute15':
          queryParams = {
            ...queryParams,
            ...initDate,
            releasedDateFrom: startDate,
            releasedDateTo: endDate,
          };
          break;
        case 'attribute17':
          queryParams = {
            ...queryParams,
            ...initDate,
            reportDateFrom: startDate,
            reportDateTo: endDate,
          };
          break;
        case 'attribute18':
          queryParams = {
            ...queryParams,
            ...initDate,
            shipDateFrom: startDate,
            shipDateTo: endDate,
          };
          break;
        case 'attribute19':
          queryParams = {
            ...queryParams,
            ...initDate,
            receivedDateFrom: startDate,
            receivedDateTo: endDate,
          };
          break;
        default:
      }
      return dispatch({
        type: 'SalesOrderPerformModel/queryTabsQty',
        payload: { ...queryParams, fieldDate, startDate: '', endDate: '', page: 0, size: 1 },
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
   * 日期选择
   * @param {string} type 日期类型
   * @param {boolean} tabsChange 是否为标签切换
   * @param {string} tabStatus 标签状态
   */
  function handleDateChange(type, tabsChange, tabStatus = status) {
    if (!ListDS.queryDataSet.current) {
      ListDS.queryDataSet.create();
    }

    const totalPriceFrom = ListDS.queryDataSet.current.get('totalPriceFrom');
    const totalPriceTo = ListDS.queryDataSet.current.get('totalPriceTo');
    if (totalPriceFrom > totalPriceTo) {
      ListDS.queryDataSet.current.set({
        totalPriceFrom: '',
        totalPriceTo: '',
      });
    }
    let startDate = ListDS.queryDataSet.current.get('startDate');
    let endDate = ListDS.queryDataSet.current.get('endDate');
    if (!tabsChange) {
      switch (type) {
        case 'month':
          startDate = moment().startOf('month').format('YYYY-MM-DD');
          endDate = moment().format('YYYY-MM-DD');
          break;
        case 'week':
          startDate = moment().startOf('weeks').format('YYYY-MM-DD');
          endDate = moment().format('YYYY-MM-DD');
          break;
        case 'day':
          startDate = moment().startOf('days').format('YYYY-MM-DD');
          endDate = moment().format('YYYY-MM-DD');
          break;
        default:
      }
    }
    ListDS.queryDataSet.current.set({
      startDate,
      endDate,
      confirmedDateFrom: null,
      confirmedDateTo: null,
      releasedDateFrom: null,
      releasedDateTo: null,
      reportDateFrom: null,
      reportDateTo: null,
      shipDateFrom: null,
      shipDateTo: null,
      receivedDateFrom: null,
      receivedDateTo: null,
      returnDateFrom: null,
      returnDateTo: null,
    });
    switch (tabStatus) {
      case '已确认':
        ListDS.queryDataSet.current.set({
          confirmedDateFrom: startDate,
          confirmedDateTo: endDate,
        });
        break;
      case '已下达':
        ListDS.queryDataSet.current.set({
          releasedDateFrom: startDate,
          releasedDateTo: endDate,
        });
        break;
      case '已完工':
        ListDS.queryDataSet.current.set({
          reportDateFrom: startDate,
          reportDateTo: endDate,
        });
        break;
      case '已发运':
        ListDS.queryDataSet.current.set({
          shipDateFrom: startDate,
          shipDateTo: endDate,
        });
        break;
      case '已接收':
        ListDS.queryDataSet.current.set({
          receivedDateFrom: startDate,
          receivedDateTo: endDate,
        });
        break;
      default:
    }
    ListDS.query();
    if (!tabsChange) {
      queryTabsQty();
    }
  }

  return (
    <Fragment>
      <Header title="订单执行">
        <Button onClick={() => openSearchBox()} color="primary" icon="filter2">
          筛选
        </Button>
        <Button onClick={() => handleDateChange('month')}>当月</Button>
        <Button onClick={() => handleDateChange('week')}>当周</Button>
        <Button onClick={() => handleDateChange('day')}>当日</Button>
      </Header>
      <Content className={styles['lisp-sales-order']}>
        <Tabs defaultActiveKey="attribute14" onChange={handleTabChange}>
          {tabsInfo.map((item) => (
            <TabPane tab={`${item.name}(${item.count})`} key={`${item.value}-${item.name}`} />
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

export default CoreSalesOrderPerform;
