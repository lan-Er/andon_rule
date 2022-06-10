/*
 * @Description: 交期回复
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-08-05 18:30:10
 */

import React, { Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { surnamesRender, getSerialNum } from '@/utils/renderer';
import { Button, Modal, Table, DataSet } from 'choerodon-ui/pro';
import { Tabs } from 'choerodon-ui';

import notification from 'utils/notification';
import { deliveryReplyDS } from '@/stores/deliveryReplyDS';
import { updateList } from '@/services/api';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import './index.less';

import redFlag from '../../assets/icons/red-flag.svg';
import ascIcon from '../../assets/supplierOrder/asc.svg';
import descIcon from '../../assets/supplierOrder/desc.svg';
import hourglass from './assets/hourglass.svg';

const { TabPane } = Tabs;

const drDs = new DataSet(deliveryReplyDS());

class DeliveryReply extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabsList: [
        {
          name: '待回复',
          count: 0,
        },
        {
          name: '已回复',
          count: 0,
        },
      ],
      moneySort: false,
      numberSort: false,
      tabIndex: 0,
    };
  }

  async componentDidMount() {
    const { tabIndex } = this.state;
    drDs.setQueryParameter('tabIndex', 0);
    const res = await drDs.query();
    const list = this.state.tabsList.slice();
    if (res && res.content) {
      list[tabIndex].count = res.totalElements;
      this.setState({
        tabsList: list,
      });
    }
  }

  // table 列
  columns = () => {
    const _this = this;
    return [
      {
        header: 'No.',
        width: 80,
        lock: 'left',
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'attribute5&6',
        value: '销售订单号',
        width: 150,
        lock: 'left',
        renderer({ record }) {
          return (
            <div className="line-cell">
              <span>{record.get('attribute5')}</span>
              <span>{record.get('attribute6')}</span>
            </div>
          );
        },
      },
      {
        name: 'attribute9&10',
        value: '物料',
        width: 150,
        align: 'left',
        renderer({ record }) {
          return (
            <div className="prod">
              <div className="val">{record.get('attribute9')}</div>
              <div className="desc">{record.get('attribute10')}</div>
            </div>
          );
        },
      },
      {
        name: 'attribute3',
        value: '客户',
        width: 90,
        align: 'left',
        // renderer: ({ record, value }) => this.handleCustomerRender(value, record.get('attribute44')),
        renderer: ({ value, record }) => {
          return (
            <Fragment>
              {record.get('attribute41') === '1' && (
                <img src={redFlag} alt="redFlag" style={{ marginRight: '6px' }} />
              )}
              {value}
            </Fragment>
          );
        },
      },
      {
        name: 'attribute14&13',
        value: '数量',
        width: 90,
        align: 'right',
        renderer({ record }) {
          return (
            <div className="line-cell">
              <span>{record.get('attribute14')}</span>
              <span style={{ paddingLeft: '5px' }}>{record.get('attribute13')}</span>
            </div>
          );
        },
      },
      {
        name: 'attribute20&21',
        value: '金额',
        width: 120,
        align: 'right',
        renderer({ record }) {
          return (
            <div className="line-cell">
              <span>{record.get('attribute20')}</span>
              <span>{record.get('attribute21')}</span>
            </div>
          );
        },
        header(dataset, name) {
          const field = dataset.getField(name);
          return (
            <div className="header-cell" onClick={() => _this.handleSort('money')}>
              <span>{field ? field.get('label') : ''}</span>
              <span className="sort">
                <img src={_this.state.moneySort ? descIcon : ascIcon} alt="order" />
              </span>
            </div>
          );
        },
      },
      {
        name: 'attribute17',
        value: '需求日期',
        width: 150,
        align: 'left',
        renderer({ record }) {
          const flag = moment(moment().format(DEFAULT_DATE_FORMAT)).diff(
            moment(moment(record.get('attribute17'))),
            'day'
          );
          return (
            <div className="prod">
              <span>{record.get('attribute17')}</span>
              <span className="ds-jc-around">
                <img src={hourglass} alt="hourglass" />
                <span style={{ marginLeft: '6px', color: flag >= 0 ? '#F96F68' : null }}>
                  {Math.abs(flag)}
                  {' 天'}
                </span>
              </span>
            </div>
          );
        },
        header(dataset, name) {
          const field = dataset.getField(name);
          return (
            <div className="header-cell" onClick={() => _this.handleSort('number')}>
              <span>{field ? field.get('label') : ''}</span>
              <span className="sort">
                <img src={_this.state.numberSort ? descIcon : ascIcon} alt="order" />
              </span>
            </div>
          );
        },
      },
      {
        name: 'attribute18',
        value: '承诺日期',
        align: 'left',
        width: 150,
        editor: true,
      },
      {
        name: 'adviseDate',
        value: '建议交期',
        align: 'left',
        width: 130,
      },
      {
        name: 'attribute31',
        value: '计划完工时间',
        width: 130,
        align: 'left',
        editor: false,
      },
      {
        name: 'attribute19',
        value: '运输时长',
        width: 100,
        align: 'right',
        renderer({ record }) {
          return (
            <div className="line-cell">
              <span>{record.get('attribute19')}</span>
              <span style={{ paddingLeft: '5px' }}>天</span>
            </div>
          );
        },
      },
      {
        name: 'attribute32',
        value: '库存可用量',
        width: 120,
        align: 'right',
      },
      {
        name: 'attribute28&29',
        value: '客户采购订单',
        width: 150,
        align: 'left',
        renderer({ record }) {
          return (
            <div className="line-cell">
              <span>{record.get('attribute28')}</span>
              <span>{record.get('attribute29')}</span>
            </div>
          );
        },
      },
      {
        name: 'attribute11&12',
        value: '客户物料',
        width: 220,
        align: 'left',
        renderer({ record }) {
          return (
            <div className="prod">
              <div className="val">{record.get('attribute11')}</div>
              <div className="desc">{record.get('attribute12')}</div>
            </div>
          );
        },
      },
      {
        name: 'attribute7',
        value: '销售员',
        align: 'left',
        width: 120,
        renderer: ({ value }) => surnamesRender(value),
      },
    ];
  };

  // 排序
  handleSort = async (type) => {
    if (type === 'money') {
      drDs.setQueryParameter('sortFlag', this.state.moneySort);
      drDs.setQueryParameter('field', 'attribute21');
      await drDs.query();
      this.setState({
        moneySort: !this.state.moneySort,
      });
    } else {
      drDs.setQueryParameter('sortFlag', this.state.numberSort);
      drDs.setQueryParameter('field', 'attribute17');
      await drDs.query();
      this.setState({
        numberSort: !this.state.numberSort,
      });
    }
  };

  handleCustomerRender = (upValue, flag) => {
    return (
      <span>
        {flag === '1' && <img src={redFlag} alt="关键客户" />}
        {` ${upValue}`}
      </span>
    );
  };

  /**
   * 筛选弹框
   */
  openSearchBox = () => {
    Modal.open({
      title: '筛选',
      drawer: true,
      // children: searchBoxRender(),
      // onOk: handleSearch,
      // onCancel: handleReset,
      cancelText: '重置',
      closable: true,
      // className: styles['lisp-sales-order'],
    });
  };

  // 页签切换
  handleTabChange = async (key) => {
    // const { tabIndex } = this.state;
    const list = this.state.tabsList.slice();
    const index = Number(key);
    drDs.setQueryParameter('tabIndex', key);
    const res = await drDs.query();
    if (res && res.content) {
      list[index].count = res.totalElements;
      this.setState({
        tabsList: list,
        tabIndex: index,
      });
    }
  };

  // 提交
  submit = async (ds) => {
    const { tabIndex } = this.state;
    if (tabIndex === 1) {
      notification.warning({
        message: '该状态下不可提交',
      });
      return;
    }

    if (ds.selected.length) {
      const changedItems = ds.selected.map((i) => ({
        ...i.toJSONData(),
        attribute8: '已回复',
        attribute18: i.get('attribute18').format('YYYY-MM-DD HH:mm:ss'),
      }));
      try {
        await updateList(
          {
            functionType: 'SUPPLIER_CHAIN',
            dataType: 'SALES_ORDER',
          },
          changedItems
        );
        notification.success({
          message: '提交成功',
        });
        const res = await ds.query();
        const list = this.state.tabsList.slice();
        if (res && res.content) {
          list[tabIndex].count = res.totalElements;
          this.setState({
            tabsList: list,
          });
        }
        // eslint-disable-next-line no-empty
      } catch {}
    } else {
      notification.warning({
        message: '请至少选择一条单据',
      });
    }
  };

  render() {
    const submitButton = (
      <Button
        style={{
          marginBottom: '10px',
          backgroundColor: this.state.tabIndex === 1 ? '#9b9b9b' : '#29bece',
          borderColor: this.state.tabIndex === 1 ? '#9b9b9b' : '#29bece',
        }}
        color="primary"
        onClick={() => this.submit(drDs)}
      >
        提交
      </Button>
    );
    return (
      <Fragment>
        <Header title="交期回复">
          {/* <Button onClick={this.openSearchBox} color="primary" icon="filter2">
            筛选
          </Button> */}
        </Header>
        <Content>
          <Tabs tabBarExtraContent={submitButton} onChange={this.handleTabChange}>
            {this.state.tabsList.map((item) => (
              <TabPane tab={`${item.name}(${item.count})`} key={item.value} />
            ))}
          </Tabs>
          <div className="content">
            <Table
              dataSet={drDs}
              columns={this.columns()}
              border={false}
              columnResizable="true"
              // editMode="inline"
              rowHeight="auto"
            />
          </div>
        </Content>
      </Fragment>
    );
  }
}

export default DeliveryReply;
