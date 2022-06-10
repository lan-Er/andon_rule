/*
 * @Description: 转移单执行页面
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-03-31 14:03:03
 */
import React from 'react';
import { DataSet, TextField, Modal, Spin, Lov } from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import notification from 'utils/notification';
import { closeTab } from 'utils/menuTab';
import Icons from 'components/Icons';
import {
  queryRequestLines,
  pickRequest,
  executeRequest,
  executePicked,
} from '@/services/transferOrderExecutionService';
import {
  lineDSConfig,
  warehouseDSConfig,
  modalTableDSConfig,
} from '@/stores/transferOrderExecutionDS.js';
import avatar from 'hlos-front/lib/assets/img-default-avator.png';
// import document from 'hlos-front/lib/assets/icons/odd-number.svg';
// import place from 'hlos-front/lib/assets/icons/location.svg';
// import date from 'hlos-front/lib/assets/icons/date.svg';
import Header from './components/header.js';
import Line from './components/line.js';
import PickModal from './pickModal.js';
import Footer from './components/footer.js';
import style from './index.less';

let modal = null;

class Execute extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      arr: [
        {
          key: 1,
          title: '已提交',
          completed: true,
        },
        {
          key: 2,
          title: '待挑库',
          completed: false,
          ongoing: true,
        },
        {
          key: 3,
          title: '待转移',
          completed: false,
        },
        {
          key: 4,
          title: '待接收',
          completed: false,
        },
      ],
      headerInfo: {},
      requestLines: [], // 行数据
      searchValue: '',
      loading: false,
      submitLoading: false,
      isExpand: false,
    };
  }

  lineDS = new DataSet(lineDSConfig());

  modalTableDS = new DataSet(modalTableDSConfig());

  warehouseDS = new DataSet(warehouseDSConfig());

  async componentDidMount() {
    this.checkTitleArr(this.props.location.state.requestStatus);
    this.setState({
      headerInfo: this.props.location.state,
    });
    if (this.props.location.state.organizationId) {
      this.warehouseDS.current.set('organizationId', this.props.location.state.organizationId);
    }
    await this.handleSearch();
  }

  componentWillUnmount() {
    closeTab('/pub/lwms/transfer-order/execute');
  }

  setItemCode = (value) => {
    this.setState({
      searchValue: value,
    });
  };

  // 更新转移单状态路径
  checkTitleArr = (status) => {
    const arr = this.state.arr.slice();
    if (status === 'RELEASED') {
      return;
    }
    if (status === 'PICKED') {
      arr[1].completed = true;
      arr[1].ongoing = false;
      arr[2].completed = false;
      arr[2].ongoing = true;
    }
    if (status === 'EXECUTED') {
      arr[1].completed = true;
      arr[1].ongoing = false;
      arr[2].completed = true;
      arr[2].ongoing = false;
      arr[3].completed = false;
      arr[3].ongoing = true;
    }
    this.setState({
      arr,
    });
  };

  // 根据物料查询
  handleSearch = async () => {
    this.setState(() => ({ loading: true }));
    let lineList = [];
    const res = await queryRequestLines({
      page: -1,
      size: 100,
      requestId: this.props.location.state.requestId,
      itemCode: this.state.searchValue,
      warehouseId: this.warehouseDS.current.get('warehouseId'),
      // requestLineStatus: this.props.location.state.requestStatus,
    });
    if (res && res.content) {
      lineList = res.content.map((v) => ({ ...v, defaultNumber: 0 }));
      this.setState({
        requestLines: lineList,
      });
      if (this.state.searchValue && lineList[0].itemControlType !== 'QUANTITY') {
        modal.open();
      }
    } else if (this.state.searchValue) {
      notification.warning({
        message: '输入物料编码有误',
      });
    }
    this.setState({
      loading: false,
    });
  };

  // 弹框 == 确认
  handleModalConfirm = (checkedList, lineIndex) => {
    let requestLines = this.state.requestLines.slice();
    let total = 0;
    checkedList.forEach((ele) => {
      const _ele = ele.toJSONData();
      if (requestLines[lineIndex].itemControlType === 'LOT') {
        ele.set('pickedQty', _ele.pickedQty || _ele.advisedQty || 0);
        total += _ele.pickedQty || _ele.advisedQty || 0;
      } else {
        ele.set('pickedQty', _ele.quantity || 0);
        total += _ele.quantity || 0;
      }
    });
    requestLines = requestLines.map((v, i) => {
      if (i === lineIndex) {
        return {
          ...v,
          defaultNumber: total,
          // pickedQty: total,
          requestPickDetailList: checkedList.map((j) => j.toJSONData()),
          // list,
        };
      }
      return { ...v };
    });
    this.setState({
      requestLines,
    });
    this.handleCloseModal();
  };

  // 弹框 -- 关闭
  handleCloseModal = () => {
    modal.close();
  };

  // 数量类型加减
  handleUpdateCount = (type, index) => {
    if (this.state.headerInfo.status === 'PICKED') return;

    const lineList = this.state.requestLines.slice();
    if (
      this.state.headerInfo.status === 'RELEASED' &&
      lineList[index].applyQty === lineList[index].pickedQty
    ) {
      return;
    }

    if (type === 'add') {
      if (
        parseFloat(lineList[index].defaultNumber) >=
        lineList[index].applyQty - lineList[index].pickedQty
      ) {
        notification.warning({
          message: '数量不可大于可申请数量',
        });
        return;
      }
      lineList[index].defaultNumber++;
    } else {
      if (parseFloat(lineList[index].defaultNumber) <= 0) {
        notification.warning({
          message: '数量不可小于0',
        });
        return;
      }
      lineList[index].defaultNumber--;
    }
    lineList[index].requestPickDetailList = [
      {
        pickedQty: lineList[index].defaultNumber,
      },
    ];
    // lineList[index].pickedQty = lineList[index].defaultNumber;
    this.setState({
      requestLines: lineList,
    });
  };

  // 行仓库值更改
  handleWarehouseChange = (record, index) => {
    const lineList = this.state.requestLines.slice();
    lineList[index].warehouseId = record.warehouseId;
    lineList[index].warehouseCode = record.warehouseCode;
    lineList[index].warehouseName = record.warehouseName;
    lineList[index].wmAreaId = null;
    lineList[index].wmAreaCode = null;
    lineList[index].wmAreaName = null;
    this.setState({
      requestLines: lineList,
    });
  };

  // 行货位值更改
  handleWmAreaChange = (record, index) => {
    const lineList = this.state.requestLines.slice();
    lineList[index].wmAreaId = record.wmAreaId;
    lineList[index].wmAreaCode = record.wmAreaCode;
    lineList[index].wmAreaName = record.wmAreaName;
    this.setState({
      requestLines: lineList,
    });
  };

  // 输入框更改数量
  handleInput = (value, index) => {
    let curVal = 0;
    if (value) {
      curVal = value;
    }
    const lineList = this.state.requestLines.slice();
    if (curVal > (lineList[index].applyQty || 0) - (lineList[index].pickedQty || 0)) {
      notification.warning({
        message: '数量不可大于申请数量',
      });
      lineList[index].defaultNumber = 0;
    } else {
      lineList[index].defaultNumber = curVal; // curVal.toFixed(6);
    }
    lineList[index].requestPickDetailList = [
      {
        pickedQty: lineList[index].defaultNumber,
      },
    ];
    // lineList[index].pickedQty = value;
    this.setState({
      requestLines: lineList,
    });
  };

  handleModal = (record, lineIndex) => {
    if (record.itemControlType === 'QUANTITY' || this.state.headerInfo.status !== 'RELEASED') {
      return;
    }
    modal = Modal.open({
      key: 'lot-pick',
      title: record.itemControlType === 'TAG' ? '标签拣料' : '批次拣料',
      className: `${style['lwms-transfer-order-execution-pick-modal']}`,
      children: (
        <PickModal
          type={record.itemControlType}
          modalTableDS={this.modalTableDS}
          headerInfo={this.state.headerInfo}
          data={record}
          modalConfirm={(checkedList) => this.handleModalConfirm(checkedList, lineIndex)}
          handleCloseModal={this.handleCloseModal}
        />
      ),
      style: {
        top: 10,
      },
      footer: null,
      movable: false,
      closable: true,
      onClose: () => {
        this.modalTableDS.loadData([]);
      },
    });
  };

  // 退出
  handleClose = () => {
    sessionStorage.setItem('wmsTransferOrderExecution', true);
    this.props.history.push('/lwms/transfer-order-execution');
    closeTab('/pub/lwms/transfer-order/execute');
  };

  // 重置
  handleReset = async () => {
    await this.handleSearch();
  };

  // 拣料
  handlePick = async () => {
    this.setState({ submitLoading: true });
    const { headerInfo, requestLines } = this.state;
    const submitList = cloneDeep(requestLines.filter((v) => v.defaultNumber));
    const pickLineList = [];
    if (submitList.length) {
      submitList.forEach((v) => {
        if (v.itemControlType === 'QUANTITY') {
          pickLineList.push({
            ...v,
            pickedQty: v.defaultNumber,
          });
        } else {
          v.requestPickDetailList.forEach((ele) => {
            let total = 0;
            if (v.itemControlType === 'LOT') {
              total += ele.pickedQty;
            } else {
              total += ele.quantity;
            }
            // 取拣料明细行上的仓库、货位、货格
            if (ele.warehouseId) {
              v.warehouseId = ele.warehouseId;
              v.warehouseCode = ele.warehouseCode;
              v.warehouseName = ele.warehouseName;
            } else {
              v.warehouseId = null;
              v.warehouseCode = null;
              v.warehouseName = null;
            }
            if (ele.wmAreaId) {
              v.wmAreaId = ele.wmAreaId;
              v.wmAreaCode = ele.wmAreaCode;
              v.wmAreaName = ele.wmAreaName;
            } else {
              v.wmAreaId = null;
              v.wmAreaCode = null;
              v.wmAreaName = null;
            }
            if (ele.wmUnitId) {
              v.wmUnitId = ele.wmUnitId;
              v.wmUnitCode = ele.wmUnitCode;
              v.wmUnitName = ele.wmUnitName;
            } else {
              v.wmUnitId = null;
              v.wmUnitCode = null;
              v.wmUnitName = null;
            }
            pickLineList.push({
              ...v,
              requestPickDetailList: [ele],
              pickedQty: total,
            });
          });
          // return {
          //   ...v,
          //   pickedQty: total,
          // };
        }
      });
    }
    const params = {
      pickedTime: moment().format(DEFAULT_DATETIME_FORMAT),
      pickedWorker: headerInfo.defaultInfo.workerName,
      pickedWorkerId: headerInfo.defaultInfo.workerId,
      requestId: headerInfo.requestId,
      requestNum: headerInfo.requestNum,
      requestPickLineList: pickLineList,
      validateLevel: 5,
    };
    const res = await pickRequest(params);
    if (res && res.failed) {
      notification.warning({
        message: res.message,
      });
    } else if (res && !res.failed) {
      this.checkTitleArr('PICKED');
      notification.success({
        message: '拣料成功',
      });
      this.setState({
        headerInfo: { ...headerInfo, status: 'PICKED' },
        requestLines: this.state.requestLines,
      });
      await this.handleSearch();
    }
    this.setState({ submitLoading: false });
  };

  // 撤销
  handleCancel = () => {};

  // 转移
  handleTransfer = async () => {
    this.setState({ submitLoading: true });
    const { headerInfo, requestLines } = this.state;
    if (headerInfo.status === 'RELEASED') {
      const line = [];
      requestLines.forEach((ele) => {
        if (ele.requestPickDetailList && ele.requestPickDetailList.length) {
          ele.requestPickDetailList.forEach((v) => {
            if (v.warehouseId) {
              ele.warehouseId = v.warehouseId;
              ele.warehouseCode = v.warehouseCode;
              ele.warehouseName = v.warehouseName;
            } else {
              ele.warehouseId = null;
              ele.warehouseCode = null;
              ele.warehouseName = null;
            }
            if (v.wmAreaId) {
              ele.wmAreaId = v.wmAreaId;
              ele.wmAreaCode = v.wmAreaCode;
              ele.wmAreaName = v.wmAreaName;
            } else {
              ele.wmAreaId = null;
              ele.wmAreaCode = null;
              ele.wmAreaName = null;
            }
            if (v.wmUnitId) {
              ele.wmUnitId = v.wmUnitId;
              ele.wmUnitCode = v.wmUnitCode;
              ele.wmUnitName = v.wmUnitName;
            } else {
              ele.wmUnitId = null;
              ele.wmUnitCode = null;
              ele.wmUnitName = null;
            }
            line.push({
              ...v,
              requestPickDetailList: [v],
              executedQty: v.pickedQty,
            });
          });
        }
      });
      const params = {
        executedTime: moment().format(DEFAULT_DATETIME_FORMAT),
        executedWorker: headerInfo.defaultInfo.workerName,
        executedWorkerId: headerInfo.defaultInfo.workerId,
        requestExecuteLineList: line,
        requestId: headerInfo.requestId,
        requestNum: headerInfo.requestNum,
        validateLevel: 5,
      };
      const res = await executeRequest(params);
      if (res && res.failed) {
        notification.warning({
          message: res.message,
        });
      } else if (res && !res.failed) {
        notification.success({
          message: '转移成功',
        });
      }
    } else if (headerInfo.status === 'PICKED') {
      const params = [
        {
          executedTime: moment().format(DEFAULT_DATETIME_FORMAT),
          executedWorker: headerInfo.defaultInfo.workerName,
          executedWorkerId: headerInfo.defaultInfo.workerId,
          requestId: headerInfo.requestId,
          requestNum: headerInfo.requestNum,
          toWarehouseCode: headerInfo.toWarehouseCode || null,
          toWarehouseId: headerInfo.toWarehouseId || null,
          toWmAreaCode: headerInfo.toWmAreaCode || null,
          toWmAreaId: headerInfo.toWmAreaId || null,
          toWmUnitCode: headerInfo.toWmUnitCode || null,
          toWmUnitId: headerInfo.toWmUnitId || null,
          validateLevel: 5,
        },
      ];
      const res = await executePicked(params);
      if (res && res.failed) {
        notification.warning({
          message: res.message,
        });
      } else if (res && !res.failed) {
        notification.success({
          message: '转移成功',
        });
      }
    }
    this.setState({ submitLoading: false });
    this.handleSearch();
  };

  handleChangeExpand = () => {
    this.setState({
      isExpand: !this.state.isExpand,
    });
  };

  render() {
    const { isExpand } = this.state;
    return (
      <div className={style['lwms-transfer-order-execution-container']}>
        <Header />
        <div className={style['status-progress']}>
          {this.state.arr.map((el, index) => (
            <div key={el.key}>
              <div
                className={`${style.circle} ${!el.completed && !el.ongoing ? style.gray : null}`}
              >
                {el.completed ? <span /> : index + 1}
              </div>
              <div
                className={`${style['status-progress-title']} ${
                  !el.completed && !el.ongoing ? style.gray : null
                }`}
              >
                {el.title}
              </div>
              {index !== this.state.arr.length - 1 && (
                <div
                  className={`${style.line} ${el.completed && !el.ongoing ? null : style.gray}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className={style.content}>
          <div className={style.top}>
            <div className={style['worker-info']}>
              <img
                src={
                  (this.state.headerInfo.defaultInfo &&
                    this.state.headerInfo.defaultInfo.fileUrl) ||
                  avatar
                }
                alt="avatar"
              />
              <span className={style.worker}>{this.state.headerInfo.creator}</span>
              <span className={style['doc-number']}>{this.state.headerInfo.requestNum}</span>
              <span className={style.type}>{this.state.headerInfo.requestTypeName}</span>
            </div>
            <div className={style['search-field']}>
              <Lov dataSet={this.warehouseDS} name="warehouseObj" placeholder="请选择发出仓库" />
              <TextField placeholder="请输入物料号" onChange={(v) => this.setItemCode(v)} />
              <button className={style.button} type="button" onClick={this.handleSearch}>
                查询
              </button>
            </div>
          </div>
          <div className={style.main}>
            {isExpand ? (
              <div className={`${style['left-part']} ${style['block-content']}`}>
                <div className={style['inspection-header']}>
                  <div className={style['header-content']}>
                    <div className={`${style['header-info']} ${style.code}`}>
                      {/* <img src={document} alt="document" /> */}
                      <Icons type="operation" size="32" color="#999" />
                      <span className={style.number}>{this.state.headerInfo.organizationName}</span>
                    </div>
                    <div className={style['header-info']}>
                      {/* <img src={place} alt="place" /> */}
                      <Icons type="location" size="32" color="#999" />
                      <span>
                        {this.state.headerInfo.warehouseName && this.state.headerInfo.wmAreaName
                          ? `${this.state.headerInfo.warehouseName}-${this.state.headerInfo.wmAreaName}`
                          : `${
                              this.state.headerInfo.warehouseName ||
                              '' ||
                              this.state.headerInfo.wmAreaName ||
                              ''
                            }`}
                      </span>
                    </div>
                    <div className={style['header-info']}>
                      {/* <img style={{ margin: '0 5px' }} src={date} alt="date" /> */}
                      <Icons type="tubiao_gongyingshangbeifen5" size="32" color="#999" />
                      <span>{this.state.headerInfo.creationDate}</span>
                    </div>
                  </div>
                </div>
                <div className={style['expand-icon']} onClick={this.handleChangeExpand}>
                  {'<<'}
                </div>
              </div>
            ) : (
              <div className={style['left-hide']} onClick={this.handleChangeExpand}>
                <Icon type="navigate_next" />
              </div>
            )}
            <div className={`${style['right-part']} ${style['block-content']}`}>
              <Spin spinning={this.state.loading}>
                <div className={style['table-line']}>
                  {this.state.requestLines.map((line, index) => (
                    <Line
                      {...line}
                      status={this.state.headerInfo.status}
                      organizationId={this.state.headerInfo.organizationId}
                      onWarehouseChange={(record) => this.handleWarehouseChange(record, index)}
                      onWmAreaChange={(record) => this.handleWmAreaChange(record, index)}
                      handleInput={(value) => this.handleInput(value, index)}
                      handleModal={() => this.handleModal(line, index)}
                      handleUpdateCount={(type) => this.handleUpdateCount(type, index)}
                    />
                  ))}
                </div>
              </Spin>
            </div>
          </div>
        </div>
        <div className={style['footer-buttons']}>
          <Footer
            status={this.state.headerInfo.status}
            onClose={this.handleClose}
            onReset={this.handleReset}
            onPick={this.handlePick}
            onCancel={this.handleCancel}
            onTransfer={this.handleTransfer}
          />
        </div>
        {this.state.submitLoading ? (
          <div className={style['my-loading-yes-no']}>
            <Spin loading={this.state.submitLoading} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Execute;
