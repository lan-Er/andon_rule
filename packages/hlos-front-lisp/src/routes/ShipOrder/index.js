/*
 * @Descripttion: 发货单创建&确认页面(物流工作台)
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2020-07-24 10:49:34
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2020-08-04 11:33:06
 */
import React, { Component } from 'react';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import { Tag } from 'choerodon-ui';
import { Button as HButton } from 'hzero-ui';
import { connect } from 'dva';
import { openTab } from 'utils/menuTab';
import queryString from 'query-string';
import ExcelExport from 'components/ExcelExport';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import { getSerialNum, surnamesRender } from '@/utils/renderer';
// import { orderStatusRender, surnamesRender, moneyFormat, getSerialNum } from '@/utils/renderer';
import { ListDS } from '@/stores/shipOrderDS';
import styles from './index.less';
import redFlag from '../../assets/icons/red-flag.svg';
import address from '../../assets/icons/address.svg';
// import { initialApi } from '@/services/api';

const dashboardConfig = 'LISP.SHIP_TEMPLATE';
@connect()
class ShipOrder extends Component {
  state = {};

  hds = new DataSet({
    ...ListDS(),
  });

  //  头表
  @Bind()
  get columns() {
    return [
      { header: 'No.', width: 50, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      {
        name: 'attribute1',
        editor: false,
        width: 120,
        lock: 'left',
      },
      {
        name: 'attribute2',
        editor: false,
        width: 150,
        lock: 'left',
      },
      {
        name: 'attribute3',
        editor: false,
        renderer: ({ record, value }) => this.handleCellRender(value, record.get('attribute4')),
        tooltip: 'overflow',
        width: 120,
        lock: 'left',
      },
      {
        name: 'attribute5',
        editor: false,
        width: 120,
        renderer: ({ value }) => this.orderStatusRender(value),
      },
      {
        name: 'attribute6',
        editor: false,
        width: 150,
        renderer: ({ record, value }) => `${value}-${record.get('attribute42')}`,
      },
      // {
      //   name: 'attribute42',
      //   editor: false,
      //   width: 150,
      // },
      {
        name: 'attribute7',
        editor: false,
        width: 120,
        renderer: ({ value }) => surnamesRender(value),
      },
      {
        name: 'attribute8',
        editor: false,
        width: 120,
      },
      {
        name: 'attribute9',
        editor: false,
        width: 120,
      },
      {
        name: 'attribute10',
        editor: false,
        width: 120,
      },
      {
        name: 'attribute11',
        editor: false,
        width: 120,
      },
      {
        name: 'attribute12',
        editor: false,
        width: 150,
      },
      {
        name: 'attribute13',
        editor: false,
        width: 150,
      },
      {
        name: 'attribute14',
        editor: false,
        width: 120,
      },
      {
        name: 'attribute15',
        editor: false,
        width: 120,
      },
      {
        name: 'attribute16',
        editor: false,
        width: 120,
      },
      {
        name: 'attribute17',
        editor: false,
        width: 200,
      },
      {
        name: 'attribute18',
        editor: false,
        width: 200,
      },
      {
        name: 'attribute19',
        editor: false,
        width: 200,
      },
      // {
      //   name: 'attribute20',
      //   editor: false,
      //   width: 200,
      // },
      {
        name: 'attribute21',
        editor: false,
        width: 120,
      },
      // {
      //   name: 'attribute22',
      //   editor: false,
      //   width: 120,
      // },
      {
        name: 'attribute23',
        editor: false,
        width: 120,
      },
      // {
      //   name: 'attribute24',
      //   editor: false,
      //   width: 120,
      // },
      {
        name: 'attribute25',
        editor: false,
        width: 120,
      },
      {
        name: 'attribute26',
        editor: false,
        width: 120,
      },
      {
        name: 'attribute27',
        editor: false,
        width: 120,
      },
      // {
      //   name: 'attribute28',
      //   editor: false,
      //   width: 120,
      // },
    ];
  }

  /**
   * 换行内容渲染
   * @param {*} record 当前行记录
   */
  handleCellRender = (upValue, downValue) => {
    return (
      <>
        <span className={styles['text-customer']}>
          <img src={redFlag} alt="关键客户" />
          {` ${upValue}`}
        </span>
        <br />
        <span className={`${styles['down-font']} ${styles['text-wrap']}`}>
          <img src={address} alt="关键客户" />
          {` ${downValue}`}
        </span>
      </>
    );
  };

  orderStatusRender = (value) => {
    let actionText;
    switch (value) {
      case '新建':
        actionText = (
          <Tag color="#eef9fc">
            <span style={{ color: '#48CAE4' }}>{value}</span>
          </Tag>
        );
        break;
      case '已接收':
        actionText = (
          <Tag color="#f7f9e7">
            <span style={{ color: '#7FB818' }}>{value}</span>
          </Tag>
        );
        break;
      case '已发运':
        actionText = (
          <Tag color="#f3f7e8">
            <span style={{ color: '#ABCC02' }}>{value}</span>
          </Tag>
        );
        break;
      default:
        actionText = value;
    }
    return actionText;
  };

  // 发货确认
  @Bind
  async handleConfirm() {
    const { dispatch } = this.props;
    const { selected } = this.hds;
    const orderNumList = [];
    selected.forEach((element) => {
      orderNumList.push(element.data.attribute2);
    });
    const res = await dispatch({
      type: 'shipOrderModel/confirmApi',
      payload: orderNumList,
    });
    if (res && !res.failed) {
      notification.success({
        message: '确认成功！',
      });
      this.hds.query();
    }
  }

  // 导出
  // handleExport=()=>{

  // }

  // 导入
  handleImport = () => {
    openTab({
      key: `/himp/commentImport/${dashboardConfig}`,
      title: '发货单导入',
      search: queryString.stringify({
        action: '发货单导入',
      }),
    });
  };

  render() {
    return (
      <React.Fragment>
        <Header title="物流工作台">
          <Button onClick={this.handleConfirm} color="primary">
            {' '}
            发货确认{' '}
          </Button>
          <ExcelExport />
          <HButton icon="upload" onClick={this.handleImport}>
            {' '}
            导入{' '}
          </HButton>
        </Header>
        <Content className={styles['ship-order']}>
          <Table
            dataSet={this.hds}
            queryFieldsLimit={3}
            columns={this.columns}
            border={false}
            columnResizable="true"
            editMode="inline"
            rowHeight="auto"
            queryFields={
              {
                // attribute5: <Select name="attribute5" />,
                // attribute3: <Select name="attribute3" />,
                // attribute9: <Select name="attribute9" />,
                // attribute6: <Select name="attribute6" />,
              }
            }
          />
        </Content>
      </React.Fragment>
    );
  }
}
export default ShipOrder;
