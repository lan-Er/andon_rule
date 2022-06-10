/*
 * @Description: 转移单执行
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-02 18:49:28
 */
import React from 'react';
import { Lov, Button, DataSet, CheckBox, Spin, TextField, SelectBox } from 'choerodon-ui/pro';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { isEmpty } from 'lodash';
import withProps from 'utils/withProps';

import uuidv4 from 'uuid/v4';
import notification from 'utils/notification';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { userSetting } from 'hlos-front/lib/services/api';
import { queryTransferByNum, executePicked } from '@/services/transferOrderExecutionService';
import { headerSearchDSConfig } from '@/stores/transferOrderExecutionDS.js';

import issueIcon from 'hlos-front/lib/assets/icons/issue.svg';
import style from './index.less';
import Card from './components/card.js';

const { Option } = SelectBox;
@withProps(
  () => {
    const trDS = new DataSet(headerSearchDSConfig());
    return {
      trDS,
    };
  },
  { cacheState: true }
)
@connect()
class TransferOrderExecution extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: 'RELEASED',
      headerData: [],
      totalCount: 0,
      allChecked: false,
      loading: false,
      currentPage: 0,
      totalPages: 0,
      searchValue: '',
      defaultInfo: {},
    };
  }

  // trDS = new DataSet(headerSearchDSConfig());

  async componentDidMount() {
    const res = await userSetting({
      defaultFlag: 'Y',
    });
    if (res && Array.isArray(res.content) && res.content[0]) {
      this.setState({
        defaultInfo: res.content[0],
      });
      const { organizationId, organizationName } = res.content[0];
      if (this.props.trDS.queryDataSet.current) {
        this.props.trDS.queryDataSet.current.set('organizationObj', {
          organizationId,
          organizationName,
        });
      } else {
        this.props.trDS.queryDataSet.create({
          organizationObj: {
            organizationId,
            organizationName,
          },
        });
      }
    }
    if (
      window.location.pathname === '/lwms/transfer-order-execution' &&
      !sessionStorage.getItem('wmsTransferOrderExecution')
    ) {
      await this.handleQuery();
    } else {
      sessionStorage.removeItem('wmsTransferOrderExecution');
    }
  }

  // 待拣料, 待转移 页签切换
  handleChangeActive = async (status) => {
    this.setState(() => ({
      active: status,
    }));
    await this.handleQuery(status);
  };

  // 头数据查询
  handleQuery = async (status = this.state.active, page = this.state.currentPage) => {
    this.setState(() => ({ loading: true }));
    this.props.trDS.setQueryParameter(
      'requestStatusList',
      this.props.trDS.queryDataSet.current.get('shipOrderStatus') || status
    );
    if (this.props.trDS.queryDataSet.current.get('shipOrderStatus') === 'EXECUTED') {
      this.props.trDS.setQueryParameter('viaWarehouseFlag', 'Y');
    } else {
      this.props.trDS.setQueryParameter('viaWarehouseFlag', 'N');
    }
    this.props.trDS.setQueryParameter('page', page);
    this.props.trDS.setQueryParameter('showImage', true);
    // this.props.trDS.setQueryParameter('requestNum', this.state.searchValue || '');
    // this.props.trDS.setQueryParameter('type', status === 'RELEASED' ? 'TRAN_PICK' : 'TRAN_TRAN');
    const res = await this.props.trDS.query();
    if (res && res.content) {
      const list = res.content.map((v) => {
        return { ...v, checked: false };
      });
      let headerList = [];
      if (this.state.currentPage === 0) {
        headerList = list;
      } else {
        headerList = [...this.state.headerData, ...list];
      }
      this.setState({
        headerData: headerList,
        totalCount: res.totalElements,
        loading: false,
        totalPages: res.totalPages,
      });
    }
  };

  // 请求下一页数据
  handleNextPage = () => {
    const { currentPage, totalPages } = this.state;
    if (currentPage >= totalPages) {
      return;
    }

    this.setState(
      {
        currentPage: ++this.state.currentPage,
      },
      () => {
        this.handleQuery(this.state.status, this.state.currentPage);
      }
    );
  };

  handleChange = (value) => {
    this.setState(() => ({
      searchValue: value,
    }));
  };

  // 输入框查询
  handleSearch = async () => {
    this.setState(() => ({ loading: true }));
    let list;
    const { headerData } = this.state;
    const res = await queryTransferByNum({
      requestNum: this.state.searchValue,
      showImage: true,
    });
    if (!isEmpty(res)) {
      list = [{ ...res, searchFlag: true, checked: this.state.active === 'PICKED' }];
      if (res.requestStatus === this.state.active) {
        if (res.requestStatus === 'RELEASED') {
          this.handleToDetails(res);
        } else if (headerData.length && headerData[0].searchFlag) {
          const flag = headerData.some((v) => v.requestNum === res.requestNum);
          if (flag) {
            notification.warning({
              message: '单据已扫描',
            });
          } else {
            list = [...headerData, ...list];
          }
        }
      } else {
        notification.warning({
          message: `单据状态为${res.requestStatus}不能在此界面操作`,
        });
      }
      this.setState({
        headerData: list,
        totalCount: res.totalElements,
        totalPages: res.totalPages,
      });
    } else {
      notification.warning({
        message: '该转移单号不存在',
      });
    }
    this.setState({
      loading: false,
    });
  };

  // 全选
  handleAllCheck = () => {
    let list = [];
    const { headerData } = this.state;
    const allChecked = headerData.every((i) => i.checked);

    list = headerData.map((ele) => {
      return { ...ele, checked: !allChecked };
    });
    this.setState({
      allChecked: !allChecked,
      headerData: list,
    });
  };

  // 单选
  handleSingleCheck = (index) => {
    const list = this.state.headerData.slice();
    list[index].checked = !list[index].checked;
    const allChecked = list.every((i) => i.checked);
    this.setState({
      allChecked,
      headerData: list,
    });
  };

  // 一键转移
  handleOneClickTransfer = async () => {
    const headerData = this.state.headerData.slice();
    const checkedArr = headerData.filter((v) => v.checked);
    if (checkedArr.length) {
      const params = [];
      checkedArr.forEach((ele) => {
        params.push({
          executedTime: moment().format(DEFAULT_DATETIME_FORMAT),
          executedWorker: this.state.defaultInfo.workerName,
          executedWorkerId: this.state.defaultInfo.workerId,
          requestId: ele.requestId,
          requestNum: ele.requestNum,
          toWarehouseCode: ele.toWarehouseCode || '',
          toWarehouseId: ele.toWarehouseId || '',
          toWmAreaCode: ele.toWmAreaCode || '',
          toWmAreaId: ele.toWmAreaId || '',
          toWmUnitCode: ele.toWmUnitCode || '',
          toWmUnitId: ele.toWmUnitId || '',
          validateLevel: 5,
        });
      });
      const res = await executePicked(params);
      if (res && res.failed) {
        notification.warning({
          message: res.message,
        });
      } else {
        notification.success({
          message: '转移成功',
        });
      }
    } else {
      notification.warning({
        message: '请选中要发出的转移单',
      });
    }
  };

  // 进入执行页面
  handleToDetails = (item) => {
    const pathname = '/pub/lwms/transfer-order/execute';
    this.props.dispatch(
      routerRedux.push({
        pathname,
        state: { ...item, status: item.requestStatus, defaultInfo: this.state.defaultInfo },
      })
    );
  };

  handleLovChange = (value, oldValue, type) => {
    if (
      type === 'org' &&
      ((value && oldValue && value.organizationId !== oldValue.organizationId) || !value)
    ) {
      this.props.trDS.queryDataSet.current.set('warehouseObj', null);
      this.props.trDS.queryDataSet.current.set('wmAreaObj', null);
    } else if (type === 'warehouse') {
      if ((value && oldValue && value.warehouseId !== oldValue.warehouseId) || !value) {
        this.props.trDS.queryDataSet.current.set('wmAreaObj', null);
      }
    }
  };

  render() {
    return (
      <div className={style['lwms-transfer-order-execution']}>
        <div className={style.header}>
          {/* <div className={style['header-left']}>
            <Button
              className={this.state.active === 'RELEASED' ? style.active : null}
              onClick={() => this.handleChangeActive('RELEASED')}
            >
              待拣料
            </Button>
            <Button
              className={this.state.active === 'PICKED' ? style.active : null}
              onClick={() => this.handleChangeActive('PICKED')}
            >
              待转移
            </Button>
          </div> */}
          <SelectBox
            dataSet={this.props.trDS.queryDataSet}
            mode="button"
            name="shipOrderStatus"
            onChange={(v) => this.handleChangeActive(v)}
          >
            <Option value="RELEASED">待拣料</Option>
            <Option value="PICKED">待转移</Option>
            <Option value="EXECUTED">待接收</Option>
          </SelectBox>
          <div className={style['header-right']}>
            <Lov
              dataSet={this.props.trDS.queryDataSet}
              name="organizationObj"
              key="organizationObj"
              placeholder="发出组织"
              onChange={(value, oldValue) => this.handleLovChange(value, oldValue, 'org')}
            />
            <Lov
              dataSet={this.props.trDS.queryDataSet}
              name="documentTypeObj"
              key="documentTypeObj"
              placeholder="单据类型"
            />
            <Lov
              dataSet={this.props.trDS.queryDataSet}
              name="workerObj"
              key="workerObj"
              placeholder="制单人"
            />
            <Button
              color="primary"
              style={{ marginLeft: '5px' }}
              onClick={() => this.handleQuery(this.state.active)}
            >
              搜索
            </Button>
          </div>
        </div>
        <div className={style['total-number']}>共搜索到{this.state.totalCount}条数据</div>
        <div className={style.content}>
          <div className={style.search}>
            <TextField
              dataSet={this.props.trDS.queryDataSet}
              name="requestNum"
              // value={this.state.searchValue}
              placeholder="请输入转移单号"
              // onChange={this.handleChange}
            />
            <Lov
              dataSet={this.props.trDS.queryDataSet}
              name="warehouseObj"
              key="warehouseObj"
              placeholder="发出仓库"
              onChange={(value, oldValue) => this.handleLovChange(value, oldValue, 'warehouse')}
            />
            <Lov
              dataSet={this.props.trDS.queryDataSet}
              name="wmAreaObj"
              key="wmAreaObj"
              placeholder="发出货位"
            />
            <Lov
              dataSet={this.props.trDS.queryDataSet}
              name="toWarehouseObj"
              key="toWarehouseObj"
              placeholder="目标仓库"
            />
            <Button color="primary" onClick={() => this.handleQuery(this.state.active)}>
              查询
            </Button>
          </div>
          {this.state.active === 'PICKED' ? (
            <div>
              <CheckBox checked={this.state.allChecked} onChange={this.handleAllCheck}>
                全选
              </CheckBox>
              <Button color="primary" onClick={this.handleOneClickTransfer}>
                <img src={issueIcon} alt="" style={{ paddingRight: '10px' }} />
                一键转移
              </Button>
            </div>
          ) : null}
          <Spin spinning={this.state.loading}>
            <div className={style['card-list']}>
              {this.state.headerData.map((item, index) => {
                return (
                  <Card
                    key={uuidv4()}
                    data={item}
                    handleToDetails={() => this.handleToDetails(item)}
                    handleSingleCheck={() => this.handleSingleCheck(index)}
                  />
                );
              })}
            </div>
          </Spin>
          <div className={style['content-more']} onClick={this.handleNextPage}>
            {this.state.currentPage < this.state.totalPages &&
            this.state.currentPage + 1 !== this.state.totalPages
              ? '点击加载更多'
              : '没有更多数据'}
          </div>
        </div>
      </div>
    );
  }
}

export default TransferOrderExecution;
