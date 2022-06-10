/* eslint-disable no-nested-ternary */
/**
 * @Description: 供应商异常订单
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-25 10:00:00
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  DataSet,
  Button,
  TextField,
  Form,
  DatePicker,
  Select,
  Modal,
} from 'choerodon-ui/pro';
import { Tabs } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
import { ListDS } from '@/stores/supplyAbnormalOrderDS';
// import upIcon from './assets/up.svg';
// import downIcon from './assets/down.svg';
import qiIcon from './assets/qi.svg';
import './style.less';

const preCode = 'lisp.abnormalOrder';
const { TabPane } = Tabs;
// const { Sidebar } = Modal;
const store = () => new DataSet(ListDS());

const AbnormalOrder = (props) => {
  const listDS = useDataSet(store, AbnormalOrder);
  const [activeKey, setActiveKey] = useState('');
  const [urgentNum, setUrgentNum] = useState(0);
  const [changeNum, setChangeNum] = useState(0);
  const [cancelNum, setCancelNum] = useState(0);
  const [delayNum, setDelayNum] = useState(0);
  const [shortageNum, setShortageNum] = useState(0);
  const [unstandardNum, setUnstandardNum] = useState(0);

  useEffect(() => {
    const {
      match: { params },
      location: { search },
    } = props;
    const typeArr = ['urgent', 'change', 'cancel', 'delay', 'shortage', 'unstandard'];
    if (params.type && typeArr.indexOf(params.type) !== -1) {
      setActiveKey(params.type);
    } else {
      setActiveKey('urgent');
    }
    checkType(params.type);
    const searchStr = new URLSearchParams(search).get('numObj');
    if (searchStr) {
      const numObj = JSON.parse(decodeURIComponent(searchStr));
      if (numObj.urgentNum) {
        setUrgentNum(numObj.urgentNum);
      }
      if (numObj.changeNum) {
        setChangeNum(numObj.changeNum);
      }
      if (numObj.cancelNum) {
        setCancelNum(numObj.cancelNum);
      }
      if (numObj.delayNum) {
        setDelayNum(numObj.delayNum);
      }
      if (numObj.shortageNum) {
        setShortageNum(numObj.shortageNum);
      }
      if (numObj.unstandardNum) {
        setUnstandardNum(numObj.unstandardNum);
      }
    }
  }, [props]);

  /**
   *tab数组
   * @returns
   */
  function tabsArr() {
    return [
      {
        code: 'urgent',
        title: `加急订单(${urgentNum})`,
        columns: [
          {
            name: 'order',
            editor: false,
            width: 70,
            align: 'center',
            lock: true,
            renderer: ({ record }) => {
              return <span>{record.index + 1}</span>;
            },
          },
          {
            name: 'attribute4',
            editor: false,
            width: 150,
            lock: true,
            renderer: ({ value, record }) => {
              return (
                <div>
                  <p>{value}</p>
                  <p>{record.data.attribute26}</p>
                </div>
              );
            },
          },
          {
            name: 'attribute2',
            editor: false,
            width: 150,
            lock: true,
            renderer: ({ value }) => {
              return (
                <span>
                  <img src={qiIcon} alt="" style={{ marginRight: 6 }} />
                  {value}
                </span>
              );
            },
          },
          {
            name: 'attribute23',
            editor: false,
            width: 150,
            renderer: ({ value }) => {
              if (value) {
                const firstName = value.substring(0, 1);
                const name = checkClassName(firstName);
                return (
                  <span>
                    {firstName && <span className={`first-name ${name}`}>{firstName}</span>}
                    {value}
                  </span>
                );
              }
            },
          },
          {
            name: 'attribute5',
            editor: false,
            width: 150,
            renderer: ({ record, value }) => {
              return (
                <div>
                  <p>
                    交货：{record.data.attribute31}
                    <span style={{ marginLeft: 5 }}>{record.data.attribute6}</span>
                  </p>
                  <p>
                    总量：{value}
                    <span style={{ marginLeft: 5 }}>{record.data.attribute6}</span>
                  </p>
                </div>
              );
            },
          },
          { name: 'attribute27', editor: false, width: 150 },
          { name: 'attribute11', editor: false, width: 150 },
          { name: 'attribute12', editor: false, width: 150 },
          { name: 'playDate', editor: false, width: 150 },
          { name: 'attribute1', editor: false, width: 150 },
          { name: 'price', editor: false, width: 150 },
        ],
      },
      {
        code: 'change',
        title: `变更订单(${changeNum})`,
        columns: [
          {
            name: 'order',
            editor: false,
            width: 70,
            align: 'center',
            lock: true,
            renderer: ({ record }) => {
              return <span>{record.index + 1}</span>;
            },
          },
          {
            name: 'attribute4',
            editor: false,
            width: 150,
            lock: true,
            renderer: ({ value, record }) => {
              return (
                <div>
                  <p>{value}</p>
                  <p>{record.data.attribute26}</p>
                </div>
              );
            },
          },
          {
            name: 'attribute2',
            editor: false,
            width: 150,
            lock: true,
            renderer: ({ value }) => {
              return (
                <span>
                  <img src={qiIcon} alt="" style={{ marginRight: 6 }} />
                  {value}
                </span>
              );
            },
          },
          {
            name: 'attribute23',
            editor: false,
            width: 150,
            renderer: ({ value }) => {
              if (value) {
                const firstName = value.substring(0, 1);
                const name = checkClassName(firstName);
                return (
                  <span>
                    {firstName && <span className={`first-name ${name}`}>{firstName}</span>}
                    {value}
                  </span>
                );
              }
            },
          },
          {
            name: 'attribute5',
            editor: false,
            width: 150,
            renderer: ({ record, value }) => {
              return (
                <div>
                  <p>
                    交货：{record.data.attribute31}
                    <span style={{ marginLeft: 5 }}>{record.data.attribute6}</span>
                  </p>
                  <p>
                    总量：
                    <span>
                      {value}
                      <span style={{ marginLeft: 5 }}>{record.data.attribute6}</span>
                    </span>
                    {Number(record.data.attribute34) > 0 ? (
                      <span style={{ color: '#52C41A', margin: '0 5px' }}>
                        {/* <img src={upIcon} alt="" style={{ margin: '0 5px ' }} /> */}+
                        {Math.abs(Number(record.data.attribute34))}
                      </span>
                    ) : Number(record.data.attribute34) < 0 ? (
                      <span style={{ color: '#FF6B6B', margin: '0 5px' }}>
                        {/* <img src={downIcon} alt="" style={{ margin: '0 5px' }} /> */}-
                        {Math.abs(Number(record.data.attribute34))}
                      </span>
                    ) : null}
                  </p>
                </div>
              );
            },
          },
          // { name: 'receiveQty', editor: false, width: 150 },
          { name: 'attribute27', editor: false, width: 150 },
          {
            name: 'attribute11',
            editor: false,
            width: 150,
            renderer: ({ record, value }) => {
              return (
                <span>
                  <span>{value}</span>
                  {Number(record.data.attribute35) > 0 ? (
                    <span style={{ color: '#52C41A', margin: '0 5px' }}>
                      {/* <img src={upIcon} alt="" style={{ margin: '0 5px ' }} /> */}+
                      {Math.abs(Number(record.data.attribute35))}天
                    </span>
                  ) : Number(record.data.attribute35) < 0 ? (
                    <span style={{ color: '#FF6B6B', margin: '0 5px' }}>
                      {/* <img src={downIcon} alt="" style={{ margin: '0 5px ' }} /> */}-
                      {Math.abs(Number(record.data.attribute35))}天
                    </span>
                  ) : null}
                </span>
              );
            },
          },
          { name: 'attribute12', editor: false, width: 150 },
          { name: 'playDate', editor: false, width: 150 },
          { name: 'attribute1', editor: false, width: 150 },
          { name: 'price', editor: false, width: 150 },
        ],
      },
      {
        code: 'cancel',
        title: `取消订单(${cancelNum})`,
        columns: [
          {
            name: 'order',
            editor: false,
            width: 70,
            align: 'center',
            lock: true,
            renderer: ({ record }) => {
              return <span>{record.index + 1}</span>;
            },
          },
          {
            name: 'attribute4',
            editor: false,
            width: 150,
            lock: true,
            renderer: ({ value, record }) => {
              return (
                <div>
                  <p>{value}</p>
                  <p>{record.data.attribute26}</p>
                </div>
              );
            },
          },
          {
            name: 'attribute2',
            editor: false,
            width: 150,
            lock: true,
            renderer: ({ value }) => {
              return (
                <span>
                  <img src={qiIcon} alt="" style={{ marginRight: 6 }} />
                  {value}
                </span>
              );
            },
          },
          {
            name: 'attribute23',
            editor: false,
            width: 150,
            renderer: ({ value }) => {
              if (value) {
                const firstName = value.substring(0, 1);
                const name = checkClassName(firstName);
                return (
                  <span>
                    {firstName && <span className={`first-name ${name}`}>{firstName}</span>}
                    {value}
                  </span>
                );
              }
            },
          },
          {
            name: 'attribute5',
            editor: false,
            width: 150,
            renderer: ({ record, value }) => {
              return (
                <div>
                  <p>
                    交货：{record.data.attribute31}
                    <span style={{ marginLeft: 5 }}>{record.data.attribute6}</span>
                  </p>
                  <p>
                    总量：{value}
                    <span style={{ marginLeft: 5 }}>{record.data.attribute6}</span>
                  </p>
                </div>
              );
            },
          },
          // {
          //   name: 'qty',
          //   editor: false,
          //   width: 150,
          // },
          // {
          //   name: 'receiveQty',
          //   editor: false,
          //   width: 150,
          // },
          { name: 'attribute27', editor: false, width: 150 },
          { name: 'attribute11', editor: false, width: 150 },
          { name: 'attribute12', editor: false, width: 150 },
          { name: 'playDate', editor: false, width: 150 },
          { name: 'attribute1', editor: false, width: 150 },
          { name: 'price', editor: false, width: 150 },
        ],
      },
      {
        code: 'delay',
        title: `延交订单(${delayNum})`,
        columns: [
          {
            name: 'order',
            editor: false,
            width: 70,
            align: 'center',
            lock: true,
            renderer: ({ record }) => {
              return <span>{record.index + 1}</span>;
            },
          },
          {
            name: 'attribute4',
            editor: false,
            width: 150,
            lock: true,
            renderer: ({ record, value }) => {
              return (
                <div>
                  <p>{value}</p>
                  <p>{record.data.attribute26}</p>
                </div>
              );
            },
          },
          {
            name: 'attribute2',
            editor: false,
            width: 150,
            lock: true,
            renderer: ({ value }) => {
              return (
                <span>
                  <img src={qiIcon} alt="" style={{ marginRight: 6 }} />
                  {value}
                </span>
              );
            },
          },
          {
            name: 'attribute23',
            editor: false,
            width: 150,
            renderer: ({ value }) => {
              if (value) {
                const firstName = value.substring(0, 1);
                const name = checkClassName(firstName);
                return (
                  <span>
                    {firstName && <span className={`first-name ${name}`}>{firstName}</span>}
                    {value}
                  </span>
                );
              }
            },
          },
          {
            name: 'attribute5',
            editor: false,
            width: 150,
            renderer: ({ record, value }) => {
              return (
                <div>
                  <p>
                    延交：{record.data.attribute31}
                    <span style={{ marginLeft: 5 }}>{record.data.attribute6}</span>
                  </p>
                  <p>
                    总量：{value}
                    <span style={{ marginLeft: 5 }}>{record.data.attribute6}</span>
                  </p>
                </div>
              );
            },
          },
          { name: 'attribute27', editor: false, width: 150 },
          { name: 'attribute11', editor: false, width: 150 },
          { name: 'attribute12', editor: false, width: 150 },
          { name: 'playDate', editor: false, width: 150 },
          { name: 'attribute1', editor: false, width: 150 },
          { name: 'price', editor: false, width: 150 },
        ],
      },
      {
        code: 'shortage',
        title: `欠料订单(${shortageNum})`,
        columns: [
          {
            name: 'order',
            editor: false,
            width: 70,
            align: 'center',
            lock: true,
            renderer: ({ record }) => {
              return <span>{record.index + 1}</span>;
            },
          },
          {
            name: 'attribute4',
            editor: false,
            width: 150,
            lock: true,
            renderer: ({ value, record }) => {
              return (
                <div>
                  <p>{value}</p>
                  <p>{record.data.attribute26}</p>
                </div>
              );
            },
          },
          {
            name: 'attribute2',
            editor: false,
            width: 150,
            lock: true,
            renderer: ({ value }) => {
              return (
                <span>
                  <img src={qiIcon} alt="" style={{ marginRight: 6 }} />
                  {value}
                </span>
              );
            },
          },
          {
            name: 'attribute23',
            editor: false,
            width: 150,
            renderer: ({ value }) => {
              if (value) {
                const firstName = value.substring(0, 1);
                const name = checkClassName(firstName);
                return (
                  <span>
                    {firstName && <span className={`first-name ${name}`}>{firstName}</span>}
                    {value}
                  </span>
                );
              }
            },
          },
          {
            name: 'attribute5',
            editor: false,
            width: 150,
            renderer: ({ record, value }) => {
              return (
                <div>
                  <p>
                    欠料：{record.data.attribute31}
                    <span style={{ marginLeft: 5 }}>{record.data.attribute6}</span>
                  </p>
                  <p>
                    总量：{value}
                    <span style={{ marginLeft: 5 }}>{record.data.attribute6}</span>
                  </p>
                </div>
              );
            },
          },
          { name: 'attribute27', editor: false, width: 150 },
          { name: 'attribute11', editor: false, width: 150 },
          { name: 'attribute12', editor: false, width: 150 },
          { name: 'playDate', editor: false, width: 150 },
          { name: 'attribute1', editor: false, width: 150 },
          { name: 'price', editor: false, width: 150 },
        ],
      },
      {
        code: 'unstandard',
        title: `不合格订单(${unstandardNum})`,
        columns: [
          {
            name: 'order',
            editor: false,
            width: 70,
            align: 'center',
            lock: true,
            renderer: ({ record }) => {
              return <span>{record.index + 1}</span>;
            },
          },
          {
            name: 'attribute4',
            editor: false,
            width: 150,
            lock: true,
            renderer: ({ value, record }) => {
              return (
                <div>
                  <p>{value}</p>
                  <p>{record.data.attribute26}</p>
                </div>
              );
            },
          },
          {
            name: 'attribute2',
            editor: false,
            width: 150,
            lock: true,
            renderer: ({ value }) => {
              return (
                <span>
                  <img src={qiIcon} alt="" style={{ marginRight: 6 }} />
                  {value}
                </span>
              );
            },
          },
          {
            name: 'attribute23',
            editor: false,
            width: 150,
            renderer: ({ value }) => {
              if (value) {
                const firstName = value.substring(0, 1);
                const name = checkClassName(firstName);
                return (
                  <span>
                    {firstName && <span className={`first-name ${name}`}>{firstName}</span>}
                    {value}
                  </span>
                );
              }
            },
          },
          {
            name: 'attribute5',
            editor: false,
            width: 150,
            renderer: ({ record, value }) => {
              return (
                <div>
                  <p>
                    不合格：{record.data.attribute31}
                    <span style={{ marginLeft: 5 }}>{record.data.attribute6}</span>
                  </p>
                  <p>
                    总量：{value}
                    <span style={{ marginLeft: 5 }}>{record.data.attribute6}</span>
                  </p>
                </div>
              );
            },
          },
          { name: 'attribute36', editor: false, width: 150 },
          { name: 'attribute27', editor: false, width: 150 },
          { name: 'attribute11', editor: false, width: 150 },
          { name: 'attribute12', editor: false, width: 150 },
          { name: 'playDate', editor: false, width: 150 },
          { name: 'attribute1', editor: false, width: 150 },
          { name: 'price', editor: false, width: 150 },
        ],
      },
    ];
  }

  function handleTabsChange(newActiveKey) {
    setActiveKey(newActiveKey);
    checkType(newActiveKey);
  }

  function handleFilter() {
    Modal.open({
      title: '筛选',
      drawer: true,
      children: formRender(),
      onOk: handleSearch,
      onCancel: handleReset,
      cancelText: intl.get('hzero.common.button.reset').d('重置'),
      okText: intl.get('hzero.common.button.search').d('查询'),
      closable: true,
    });
  }

  function formRender() {
    return (
      <Form dataSet={listDS.queryDataSet} columns={1}>
        <TextField name="attribute1" key="attribute1" />
        <Select name="attribute2" key="attribute2" />
        <TextField name="attribute25" key="attribute25" />
        <DatePicker name="orderDate" key="orderDate" />
      </Form>
    );
  }

  function handleReset() {
    listDS.queryDataSet.current.reset();
    return false;
  }

  function handleSearch() {
    listDS.query();
  }

  function checkType(type) {
    let attribute10 = '加急';
    if (type === 'change') {
      attribute10 = '变更';
    } else if (type === 'cancel') {
      attribute10 = '取消';
    } else if (type === 'delay') {
      attribute10 = '延交';
    } else if (type === 'shortage') {
      attribute10 = '欠料';
    } else if (type === 'unstandard') {
      attribute10 = '不合格';
    }
    listDS.queryParameter = {
      attribute10,
    };
    listDS.query().then((res) => {
      if (res && res.totalElements) {
        if (type === 'urgent' && res.totalElements !== urgentNum) {
          setUrgentNum(res.totalElements);
        } else if (type === 'change' && res.totalElements !== changeNum) {
          setChangeNum(res.totalElements);
        } else if (type === 'cancel' && res.totalElements !== cancelNum) {
          setCancelNum(res.totalElements);
        } else if (type === 'delay' && res.totalElements !== delayNum) {
          setDelayNum(res.totalElements);
        } else if (type === 'shortage' && res.totalElements !== shortageNum) {
          setShortageNum(res.totalElements);
        } else if (type === 'unstandard' && res.totalElements !== unstandardNum) {
          setUnstandardNum(res.totalElements);
        }
      }
    });
  }

  function checkClassName(text) {
    if (text === '陈') {
      return 'chen';
    } else if (text === '唐') {
      return 'tang';
    } else if (text === '方') {
      return 'fang';
    } else if (text === '黄') {
      return 'huang';
    }
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.abnormalOrder`).d('异常订单')}>
        <Button color="primary" icon="filter2" onClick={handleFilter}>
          {intl.get(`hzero.c7nUI.Table.filterTitle`).d('筛选')}
        </Button>
      </Header>
      <Content className="isp-abnormal-order">
        <Tabs activeKey={activeKey} onChange={handleTabsChange}>
          {tabsArr().map((tab) => (
            <TabPane
              tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
              key={tab.code}
            >
              <Table
                dataSet={listDS}
                bordered="false"
                columns={tab.columns}
                columnResizable="true"
                editMode="inline"
                queryBar="none"
              />
            </TabPane>
          ))}
        </Tabs>
      </Content>
    </Fragment>
  );
};

export default AbnormalOrder;
