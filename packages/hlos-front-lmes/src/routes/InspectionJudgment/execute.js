/*
 * @Description: 检验判定执行页面
 * @Author: zmt
 * @LastEditTime: 2021-08-03 22:08:41
 */

import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  DataSet,
  Button,
  TextField,
  Modal,
  Row,
  Col,
  Spin,
  NumberField,
  Switch,
} from 'choerodon-ui/pro';
import { Tabs, Upload, Icon } from 'choerodon-ui';

import Icons from 'components/Icons';
import { BUCKET_NAME_MES } from 'hlos-front/lib/utils/config';
import { getAccessToken, getCurrentOrganizationId, getResponse } from 'utils/utils';
import { HZERO_FILE } from 'utils/config';

import notification from 'utils/notification';
import { closeTab } from 'utils/menuTab';
import uuidv4 from 'uuid/v4';
import defaultAvatarIcon from 'hlos-front/lib/assets/img-default-avator.png';
import scanIcon from 'hlos-front/lib/assets/icons/scan.svg';
import {
  queryInspectionAndJudgment,
  queryJudgeArea,
  queryInspectionDocLines,
  handleInspectionDocLinesDelete,
  handleInspectionDocLinesAdd,
  handleInspectionDocLinesModify,
  inspectionDocSubmit,
  getInspectionDocLot,
  queryExceptionAssigns,
  updateSampleQty,
} from '../../services/inspectionJudgmentService.js';
import { headerJudgeDS, sampleDS } from '../../stores/inspectionJudgmentDS';

import { Clock, getTime } from './clock.js';
import InspectionLine from './inspection-line';
import AbnormalLine from './abnormal-line';
import DetailsLine from './details-line';
// import PickModal from './pickModal';
import Footer from './footer';
import styles from './index.less';

// eslint-disable-next-line prefer-destructuring
const TabPane = Tabs.TabPane;
let poorSampleModal = null;
let modifyModal = null;
// let badReasonModal = null;
const directory = 'inspection-judgement';
let modal = null;
let sampleModal = null;
let quaModal = null;

const defaultList = [
  {
    value: '合格',
    active: true,
    icon: <Icons type="triangle-green" size="12" color="#4CAF50" />,
    color: '#4CAF50',
    judgeResult: 'PASS',
  },
  {
    value: '不合格',
    active: false,
    icon: <Icons type="triangle-green" size="12" color="#F3511F" />,
    color: '#F3511F',
    judgeResult: 'FAILED',
  },
  {
    value: '让步接受',
    active: false,
    icon: <Icons type="triangle-green" size="12" color="#F9A825" />,
    color: '#F9A825',
    judgeResult: 'CONCESSION',
  },
];

// 头部组件
function Head() {
  return (
    <div className={styles.header}>
      <Icons type="logo" size="36" color="#fff" />
      <Clock />
    </div>
  );
}

@connect()
class Execute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      inspectionDocId: '',
      toggleShow: false,
      headerData: {}, // 检验单头部数据
      loading: false,
      submitLoading: false,
      badReasonList: [],
      sampleList: [], // 样品列表  [样品数量, 新增删除操作, 前端页面更新样品数量(已和产品确定)]
      currentSample: {}, // 当前展示的样品信息
      currentSampleIndex: 0, // 当前展示样品的索引
      sampleTemplate: {}, // 样品模板(数据格式, 需变动--样品名称, 检验项(行id))
      allInspectionData: [], // 已经判定的所有样品的集合
      qualifiedQuantity: 0,
      unqualifiedQuantity: 0,
      beforeClick: false,
      nextClick: false,
      detailList: [], // 明细页面数据
      curBadReason: {},
      isEdit: false,
      editSampleNumber: null,
      flag: false,
      qualifiedSampleQty: 0,
      unqualifiedSampleQty: 0,
      errorRemark: '', // 异常、样品异常备注信息记录
      autoFill: false,
      searchValue: '',
      qcRemark: '',
    };
  }

  hJudgeDS = new DataSet(headerJudgeDS());

  sDS = new DataSet(sampleDS());

  async componentDidMount() {
    const { state } = this.props.location;
    this.setState({
      // organizationId: state.organizationId,
      inspectionDocId: state.inspectionDocId,
      type: state.type,
      loading: true,
    });
    await this.handleQueryInspectionAndJudgment();
    if (this.state.headerData.itemControlType !== 'QUANTITY') {
      await this.handleGetInspectionDocLot();
    }
    await this.handleQueryJudgeArea();
    await this.handleQueryExceptionAssigns();
    await this.handleQueryLineList();
    this.setState({ loading: false });
    // 不合格数量 ≤ BATCH_QTY(batchQty无值的时候去sampleQty)
    this.hJudgeDS.fields.get('unQuantity').set('max', state.batchQty || state.sampleQty);
  }

  componentWillUnmount() {
    this.handleClose(this.state.flag);
  }

  // 检验单头数据
  handleQueryInspectionAndJudgment = async () => {
    const { organizationId, inspectionDocId } = this.props.location.state;
    await queryInspectionAndJudgment({
      organizationId,
      inspectionDocId,
    })
      .then((res) => {
        if (res && res.content && res.content.length) {
          const docRule = JSON.parse(res.content[0].docProcessRule);
          this.setState({
            headerData: { ...res.content[0], docRule },
            editSampleNumber: res.content[0].sampleQty,
          });
        }
      })
      .catch((err) => {
        notification.err({
          message: err.message,
        });
      });
  };

  // 样品列表
  handleQueryJudgeArea = async () => {
    this.setState({ loading: true });
    const { organizationId, inspectionDocId } = this.props.location.state;
    const res = await queryJudgeArea({
      organizationId,
      inspectionDocId,
      page: -1,
    });
    this.setState({ loading: false });
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      let list = res.content;
      list.sort(
        (a, b) =>
          parseInt(a.sampleNumber.substring(a.sampleNumber.length, 1), 10) -
          parseInt(b.sampleNumber.substring(b.sampleNumber.length, 1), 10)
      );
      list = list.map((v, i) => {
        if (i === 0) {
          return { ...v, active: true };
        }
        return { ...v, active: false };
      });
      this.setState({
        sampleList: list,
      });
    }
  };

  // 获取不良原因数据
  handleQueryExceptionAssigns = async () => {
    const res = await queryExceptionAssigns({
      itemId: this.state.headerData.itemId,
      sourceType: this.state.headerData.inspectionTemplateType.split('.')[0],
    });
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else if (res && res.length) {
      const list = res.map((v) => ({ ...v, exceptionQty: 0, active: false, fileList: [] }));
      this.setState({
        badReasonList: list,
      });
    }
  };

  // 获取明细页面数据
  handleGetInspectionDocLot = async () => {
    const res = await getInspectionDocLot({
      inspectionDocId: this.state.inspectionDocId,
    });
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      this.setState({
        detailList: res.map((v) => ({
          ...v,
          detailsQualifiedQuantity: 0,
          detailsUnqualifiedQuantity: 0,
          remark: null,
          show: false,
          defaultList,
          curJudge: defaultList[0],
        })),
      });
    }
  };

  // 自动计算检验单合格/不合格数量
  handleCalculateInspectionQuantity = () => {
    const { headerData } = this.state;
    // headerData.samplingType === 'ALL' && headerData.itemControlType === 'QUANTITY'
    if (headerData.samplingType === 'ALL') {
      const _allInspectionData = this.state.allInspectionData.slice();
      let qualified = 0;
      let unqualified = 0;
      _allInspectionData.forEach((record) => {
        record.inspectionLine.forEach((ele) => {
          if (ele.resultType === 'JUDGE') {
            if (ele.qcJudge) {
              Reflect.set(ele, 'qcResult', 'PASS');
            } else {
              Reflect.set(ele, 'qcResult', 'FAILED');
            }
          } else {
            const lclStatus =
              (ele.lclAccept && Number(ele.qcValue) >= Number(ele.lcl)) ||
              (!ele.lclAccept && Number(ele.qcValue) > Number(ele.lcl));
            const uclStatus =
              (ele.uclAccept && Number(ele.qcValue) <= Number(ele.ucl)) ||
              (!ele.uclAccept && Number(ele.qcValue) < Number(ele.ucl));
            if (lclStatus && uclStatus) {
              Reflect.set(ele, 'qcResult', 'PASS');
            } else {
              Reflect.set(ele, 'qcResult', 'FAILED');
            }
          }
        });
        if (record.inspectionLine.some((v) => v.qcResult === 'FAILED')) {
          unqualified++;
        } else {
          qualified++;
        }
      });
      this.setState({
        qualifiedQuantity: parseFloat(qualified.toFixed(6)) || 0,
        unqualifiedQuantity: parseFloat(unqualified.toFixed(6)) || 0,
      });
    }
  };

  // 自动计算明细页面行内合格/不合格数量 及 检验单合格/不合格数量
  handleCalculateDetailsQuantity = () => {
    const { headerData } = this.state;
    const _allInspectionData = this.state.allInspectionData.slice();
    let _detailList = this.state.detailList.slice();
    if (headerData.samplingType === 'ALL' && headerData.itemControlType !== 'QUANTITY') {
      _allInspectionData.forEach((record) => {
        record.inspectionLine.forEach((ele) => {
          if (ele.resultType === 'JUDGE') {
            if (ele.qcJudge) {
              Reflect.set(ele, 'qcResult', 'PASS');
            } else {
              Reflect.set(ele, 'qcResult', 'FAILED');
            }
          } else {
            const lclStatus =
              (ele.lclAccept && Number(ele.qcValue) >= Number(ele.lcl)) ||
              (!ele.lclAccept && Number(ele.qcValue) > Number(ele.lcl));
            const uclStatus =
              (ele.uclAccept && Number(ele.qcValue) <= Number(ele.ucl)) ||
              (!ele.uclAccept && Number(ele.qcValue) < Number(ele.ucl));
            if (lclStatus && uclStatus) {
              Reflect.set(ele, 'qcResult', 'PASS');
            } else {
              Reflect.set(ele, 'qcResult', 'FAILED');
            }
          }
        });

        if (record.inspectionLine.every((v) => v.qcResult === 'PASS')) {
          Reflect.set(record, 'qcResult', 'PASS');
        } else {
          Reflect.set(record, 'qcResult', 'FAILED');
        }
      });
      _detailList = _detailList.map((details) => {
        const filterList = _allInspectionData.filter(
          (v) => v.inspectionDocLotId === details.inspectionDocLotId
        );
        return {
          ...details,
          detailsQualifiedQuantity: filterList.filter((v) => v.qcResult === 'PASS').length,
          detailsUnqualifiedQuantity: filterList.filter((v) => v.qcResult === 'FAILED').length,
        };
      });
    }
    const _qualifiedQuantity = _detailList.reduce((pre, cur) => {
      return parseFloat(cur.detailsQualifiedQuantity) + pre;
    }, 0);
    const _unqualifiedQuantity = _detailList.reduce((pre, cur) => {
      return parseFloat(cur.detailsUnqualifiedQuantity) + pre;
    }, 0);
    this.setState({
      detailList: _detailList,
      qualifiedQuantity: parseFloat(_qualifiedQuantity.toFixed(6)) || 0,
      unqualifiedQuantity: parseFloat(_unqualifiedQuantity.toFixed(6)) || 0,
    });
  };

  // 样品对应的检验项
  handleQueryLineList = async () => {
    this.setState({ loading: true });
    const { organizationId, inspectionDocId } = this.props.location.state;
    const _sampleList = this.state.sampleList.slice();
    const _badReasonList = this.state.badReasonList.slice();
    await queryInspectionDocLines({
      organizationId,
      inspectionDocId,
      page: -1,
    })
      .then((res) => {
        this.setState({ loading: false });
        if (res && res.content) {
          const array = [];
          const obj = {};
          res.content.forEach((ele) => {
            if (Reflect.has(obj, ele.sampleNumber)) {
              // eslint-disable-next-line no-unused-expressions
              ele.resultType === 'NUMBER'
                ? obj[ele.sampleNumber].push({ ...ele, qcValue: 0 })
                : obj[ele.sampleNumber].push({ ...ele, qcJudge: true });
            } else {
              // eslint-disable-next-line no-unused-expressions
              ele.resultType === 'NUMBER'
                ? (obj[ele.sampleNumber] = [{ ...ele, qcValue: 0 }])
                : (obj[ele.sampleNumber] = [{ ...ele, qcJudge: true }]);
            }
          });
          for (const key in obj) {
            if (Reflect.ownKeys(obj, key)) {
              array.push({
                sampleNumber: key,
                inspectionLine: obj[key],
                activeReasonOptions: [],
                badReasonList: _badReasonList,
              });
            }
          }
          const tempArray = [];
          _sampleList.forEach((ele) => {
            array.forEach((v) => {
              if (ele.sampleNumber === v.sampleNumber) {
                Reflect.set(v, 'inspectionDocLotId', ele.inspectionDocLotId);
                tempArray.push(v); // 使tempArray与_sampleList数据按照"sampleNumber"排序一致
              }
            });
          });
          tempArray.forEach((record) => {
            record.inspectionLine.forEach((ele) => {
              if (ele.resultType === 'JUDGE') {
                if (ele.qcJudge) {
                  Reflect.set(ele, 'qcResult', 'PASS');
                } else {
                  Reflect.set(ele, 'qcResult', 'FAILED');
                }
              } else {
                const lclStatus =
                  (ele.lclAccept && Number(ele.qcValue) >= Number(ele.lcl)) ||
                  (!ele.lclAccept && Number(ele.qcValue) > Number(ele.lcl));
                const uclStatus =
                  (ele.uclAccept && Number(ele.qcValue) <= Number(ele.ucl)) ||
                  (!ele.uclAccept && Number(ele.qcValue) < Number(ele.ucl));
                if (lclStatus && uclStatus) {
                  Reflect.set(ele, 'qcResult', 'PASS');
                } else {
                  Reflect.set(ele, 'qcResult', 'FAILED');
                }
              }
            });
          });
          this.setState(
            {
              allInspectionData: tempArray,
              currentSample: tempArray[0], // 默认显示第一条数据
              currentSampleIndex: 0,
              beforeClick: false,
              nextClick: tempArray.length > 1,
              sampleTemplate: tempArray[0],
            },
            () => {
              this.handleCalculateInspectionQuantity();
              if (this.state.headerData.itemControlType !== 'QUANTITY') {
                this.handleCalculateDetailsQuantity();
              }
            }
          );
        }
      })
      .catch((err) => {
        notification.err({
          message: err.message,
        });
      });
  };

  // 新增/修改样品名称弹框
  handleSampleNameModal = (type) => {
    if (type === 'add') {
      if (this.state.headerData.samplingType === 'ALL') {
        notification.warning({
          message: '全检状态下不可新增',
        });
        return;
      }
      const _allInspectionData = this.state.allInspectionData.slice();
      const maxArray = [];
      let titleString = '';
      let newSampleNumber = '';
      if (_allInspectionData.length) {
        _allInspectionData.forEach((ele) => {
          titleString = ele.sampleNumber.replace(/^[^(1-9)]*(\d+)[^\d]*$/, '$1');
          if (!isNaN(Number(titleString))) {
            maxArray.push(Number(titleString));
          }
        });
        let sampleNumberLength = 0;
        if (maxArray.length) {
          sampleNumberLength = (Math.max(...maxArray) + 1).toString().length;
        } else {
          sampleNumberLength = 0;
        }
        if (sampleNumberLength === 0) {
          newSampleNumber = 'S0001';
        } else if (sampleNumberLength === 1) {
          newSampleNumber = `S000${(Math.max(...maxArray) + 1).toString()}`;
        } else if (sampleNumberLength === 2) {
          newSampleNumber = `S00${(Math.max(...maxArray) + 1).toString()}`;
        } else if (sampleNumberLength === 3) {
          newSampleNumber = `S0${(Math.max(...maxArray) + 1).toString()}`;
        } else {
          newSampleNumber = `S${(Math.max(...maxArray) + 1).toString()}`;
        }
      } else {
        newSampleNumber = 'S0001';
      }

      this.sDS.current.set('sampleNumber', newSampleNumber);
    } else {
      this.sDS.current.set('sampleNumber', this.state.currentSample.sampleNumber);
    }

    modifyModal = Modal.open({
      key: 'lmes-inspection-judgement-modify-sample-modal',
      title: '样品',
      className: styles['lmes-inspection-judgement-modify-sample-modal'],
      children: (
        <div>
          <div className={styles['lov-suffix']}>
            <Icons className={styles['right-icon']} type="scan" size="24" color="#1C879C" />
            <TextField
              dataSet={this.sDS}
              name="sampleNumber"
              className={styles['space-left']}
              placeholder="输入或扫描样品编码"
              noCache
            />
          </div>
          <div className={styles['modal-footer']}>
            <Button onClick={() => modifyModal.close()}>取消</Button>
            <Button color="primary" onClick={() => this.handleSampleConfirm(type)}>
              确认
            </Button>
          </div>
        </div>
      ),
      footer: null,
      closable: true,
    });
  };

  // 样品名称弹框确认按钮
  handleSampleConfirm = (type) => {
    if (type === 'add') {
      this.handleAddSample();
    } else {
      this.handleModify();
    }
    modifyModal.close();
  };

  // 选中不良样品
  handleActiveOption = (i, curRecord) => {
    let _allInspectionData = this.state.allInspectionData.slice();
    let _badReasonList = curRecord.badReasonList.slice();
    let _curSample = {};
    _badReasonList = _badReasonList.map((v, index) => {
      if (i === index) {
        return { ...v, active: !v.active };
      }
      return { ...v };
    });
    _allInspectionData = _allInspectionData.map((v) => {
      if (v.sampleNumber === curRecord.sampleNumber) {
        _curSample = { ...v, badReasonList: _badReasonList };
        return { ..._curSample };
      }
      return { ...v };
    });
    this.setState(
      {
        allInspectionData: _allInspectionData,
        currentSample: _curSample,
      },
      () => {
        const otherItem = this.state.currentSample.badReasonList.find((item) => {
          return item.exceptionName === '其他';
        });
        poorSampleModal.update({
          children: (
            <div>
              <div className={styles['sample-options-list']}>
                {this.state.currentSample.badReasonList.map((v, index) => (
                  <div
                    key={uuidv4()}
                    className={
                      v.active ? `${styles.options} ${styles['active-options']}` : styles.options
                    }
                    onClick={() => this.handleActiveOption(index, this.state.currentSample)}
                  >
                    <span>{v.exceptionName}</span>
                    {/* {v.active && <Icons type="check-circle" size="36" />} */}
                  </div>
                ))}
              </div>
              {otherItem && otherItem.active && (
                <div className={styles['sample-options-input']}>
                  <TextField
                    value={otherItem.exceptionRemark}
                    onChange={(value) => {
                      this.setState({ errorRemark: value });
                    }}
                    name="remark"
                    style={{ marginTop: 30, height: 48, width: '100%', fontSize: 20 }}
                    placeholder="请输入异常备注"
                    noCache
                  />
                </div>
              )}
              <div className={styles['modal-footer']}>
                <Button onClick={() => this.handlePoorSampleCancel()}>取消</Button>
                <Button
                  color="primary"
                  onClick={() => this.handlePoorSampleConfirm(this.state.currentSample)}
                >
                  确认
                </Button>
              </div>
            </div>
          ),
        });
      }
    );
  };

  // 样品不良 取消
  handlePoorSampleCancel = () => {
    this.setState({
      errorRemark: '',
    });
    poorSampleModal.close();
  };

  // 样品不良 确认
  handlePoorSampleConfirm = (curRecord) => {
    let _badReasonList = curRecord.badReasonList.slice();
    const badReasonListTemp = _badReasonList.map((item) => {
      if (item.exceptionName === '其他') {
        return {
          ...item,
          exceptionRemark: this.state.errorRemark,
        };
      }
      return {
        ...item,
      };
    });
    let _allInspectionData = this.state.allInspectionData.slice();
    let curIndex = 0;
    _badReasonList = _badReasonList.filter((v) => v.active).map((v) => v.exceptionName);
    _allInspectionData = _allInspectionData.map((v, i) => {
      if (v.sampleNumber === curRecord.sampleNumber) {
        curIndex = i;
        return { ...v, activeReasonOptions: _badReasonList, badReasonList: badReasonListTemp };
      }
      return { ...v };
    });
    this.setState({
      allInspectionData: _allInspectionData,
      currentSample: _allInspectionData[curIndex],
    });
    poorSampleModal.close();
  };

  // 样品不良options
  handlePoorSampleModal = (curRecord) => {
    const otherItem = curRecord.badReasonList.find((item) => {
      return item.exceptionName === '其他';
    });
    poorSampleModal = Modal.open({
      key: 'lmes-inspection-judgement-poor-sample-modal',
      title: '样品不良',
      className: styles['lmes-inspection-judgement-poor-sample-modal'],
      children: (
        <div>
          <div className={styles['sample-options-list']}>
            {curRecord.badReasonList.map((v, i) => (
              <div
                key={uuidv4()}
                className={
                  v.active ? `${styles.options} ${styles['active-options']}` : styles.options
                }
                onClick={() => this.handleActiveOption(i, curRecord)}
              >
                <span>{v.exceptionName}</span>
              </div>
            ))}
          </div>
          {otherItem && otherItem.active && (
            <div className={styles['sample-options-input']}>
              <TextField
                value={otherItem.exceptionRemark}
                onChange={(value) => {
                  this.setState({ errorRemark: value });
                }}
                name="remark"
                style={{ marginTop: 30, height: 48, width: '100%', fontSize: 20 }}
                placeholder="请输入异常备注"
                noCache
              />
            </div>
          )}
          <div className={styles['modal-footer']}>
            <Button onClick={() => this.handlePoorSampleCancel()}>取消</Button>
            <Button color="primary" onClick={() => this.handlePoorSampleConfirm(curRecord)}>
              确认
            </Button>
          </div>
        </div>
      ),
      footer: null,
      closable: true,
    });
  };

  // "上一个" "下一个"按钮是否可点击
  handleSwitchButton = () => {
    const { sampleList, currentSampleIndex } = this.state;
    if (!sampleList.length) {
      this.setState({
        beforeClick: false,
        nextClick: false,
      });
      return;
    }
    if (currentSampleIndex === 0) {
      this.setState({
        beforeClick: false,
        nextClick: true,
      });
    } else if (currentSampleIndex === sampleList.length - 1) {
      this.setState({
        beforeClick: true,
        nextClick: false,
      });
    } else {
      this.setState({
        beforeClick: true,
        nextClick: true,
      });
    }
  };

  // "上一个" "下一个" 切换
  handleChangeCur = (type) => {
    const {
      beforeClick,
      nextClick,
      currentSampleIndex,
      sampleList,
      allInspectionData,
    } = this.state;
    if (type === 'before') {
      if (!beforeClick) return;

      if (currentSampleIndex > 0) {
        this.setState(
          {
            currentSample: allInspectionData[currentSampleIndex - 1],
            currentSampleIndex: currentSampleIndex - 1,
            sampleList: sampleList.map((v, i) => {
              if (i === currentSampleIndex - 1) {
                return { ...v, active: !v.active };
              }
              return { ...v, active: false };
            }),
          },
          () => this.handleSwitchButton()
        );
      }
    } else {
      if (!nextClick) return;
      if (currentSampleIndex < sampleList.length) {
        this.setState(
          {
            currentSample: allInspectionData[currentSampleIndex + 1],
            currentSampleIndex: currentSampleIndex + 1,
            sampleList: sampleList.map((v, i) => {
              if (i === currentSampleIndex + 1) {
                return { ...v, active: !v.active };
              }
              return { ...v, active: false };
            }),
          },
          () => this.handleSwitchButton()
        );
      }
    }
  };

  // 检验项JUDGE类型是否合格
  handleSwitchChange = (i) => {
    const _allInspectionData = this.state.allInspectionData.slice();
    const _currentSampleIndex = this.state.currentSampleIndex;
    const _inspectionLine = _allInspectionData[_currentSampleIndex].inspectionLine;
    _allInspectionData[_currentSampleIndex].inspectionLine = _inspectionLine.map((v, index) => {
      if (i === index) {
        return { ...v, qcJudge: !v.qcJudge, qcResult: v.qcJudge ? 'FAILED' : 'PASS' };
      }
      return { ...v };
    });
    this.setState(
      {
        allInspectionData: _allInspectionData,
        currentSample: _allInspectionData[_currentSampleIndex],
      },
      () => {
        this.handleCalculateInspectionQuantity();
        if (this.state.headerData.itemControlType !== 'QUANTITY') {
          this.handleCalculateDetailsQuantity();
        }
      }
    );
  };

  // 检验项NUMBER类型更改值
  handleNumberChange = (value, i) => {
    const _allInspectionData = this.state.allInspectionData.slice();
    const _currentSampleIndex = this.state.currentSampleIndex;
    const _inspectionLine = _allInspectionData[_currentSampleIndex].inspectionLine;
    _allInspectionData[_currentSampleIndex].inspectionLine = _inspectionLine.map((v, index) => {
      if (i === index) {
        return { ...v, qcValue: value };
      }
      return { ...v };
    });
    _allInspectionData.forEach((record) => {
      record.inspectionLine.forEach((ele) => {
        if (ele.resultType === 'JUDGE') {
          if (ele.qcJudge) {
            Reflect.set(ele, 'qcResult', 'PASS');
          } else {
            Reflect.set(ele, 'qcResult', 'FAILED');
          }
        } else {
          const lclStatus =
            (ele.lclAccept && Number(ele.qcValue) >= Number(ele.lcl)) ||
            (!ele.lclAccept && Number(ele.qcValue) > Number(ele.lcl));
          const uclStatus =
            (ele.uclAccept && Number(ele.qcValue) <= Number(ele.ucl)) ||
            (!ele.uclAccept && Number(ele.qcValue) < Number(ele.ucl));
          if (lclStatus && uclStatus) {
            Reflect.set(ele, 'qcResult', 'PASS');
          } else {
            Reflect.set(ele, 'qcResult', 'FAILED');
          }
        }
      });
    });
    this.setState(
      {
        allInspectionData: _allInspectionData,
        currentSample: _allInspectionData[_currentSampleIndex],
      },
      () => {
        this.handleCalculateInspectionQuantity();
        if (this.state.headerData.itemControlType !== 'QUANTITY') {
          this.handleCalculateDetailsQuantity();
        }
      }
    );
  };

  // 隐藏
  handleHideSampleList = () => {
    this.setState({
      toggleShow: !this.state.toggleShow,
    });
  };

  // 选中当前要展示的样品
  handleSampleActive = (record) => {
    let _sampleList = this.state.sampleList.slice();
    const _allInspectionData = this.state.allInspectionData.slice();
    let curSample = {};
    let curIndex = null;
    _sampleList = _sampleList.map((v) => {
      if (record.active) {
        return { ...v };
      } else {
        if (v.sampleNumber === record.sampleNumber) {
          return { ...v, active: !v.active };
        }
        return { ...v, active: false };
      }
    });
    _allInspectionData.forEach((v, index) => {
      if (v.sampleNumber === record.sampleNumber) {
        curSample = { ...v };
        curIndex = index;
      }
    });
    this.setState(
      {
        sampleList: _sampleList,
        currentSample: curSample,
        currentSampleIndex: curIndex,
      },
      () => this.handleSwitchButton()
    );
  };

  // 新增样品
  handleAddSample = async () => {
    this.setState({ loading: true });
    const newSampleNumber = this.sDS.current.get('sampleNumber');
    const _allInspectionData = this.state.allInspectionData.slice();
    let _sampleList = this.state.sampleList.slice();
    const { sampleTemplate } = this.state;
    let curIndex = 0;
    const { headerData, inspectionDocId } = this.state;

    const res = await handleInspectionDocLinesAdd({
      inspectionDocId,
      sampleNumber: newSampleNumber,
      templateId: headerData.templateId,
    });
    this.setState({ loading: false });
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      const resp = await updateSampleQty({
        inspectionDocId: headerData.inspectionDocId,
        sampleQty: Number(headerData.sampleQty) + 1,
      });

      if (getResponse(resp)) {
        _allInspectionData.push({
          ...sampleTemplate,
          sampleNumber: newSampleNumber,
          inspectionLine: res.map((v) => {
            if (v.resultType === 'NUMBER') {
              return { ...v, qcValue: 0 };
            }
            return { ...v, qcJudge: true };
          }),
        });
        _sampleList.push({ ...res[0], active: false });
        _sampleList = _sampleList.map((v, i) => {
          if (i === _sampleList.length - 1) {
            return { ...v, active: true };
          }
          return { ...v, active: false };
        });
        _allInspectionData.sort(
          (a, b) =>
            parseInt(a.sampleNumber.substring(a.sampleNumber.length, 1), 10) -
            parseInt(b.sampleNumber.substring(b.sampleNumber.length, 1), 10)
        );
        _sampleList.sort(
          (a, b) =>
            parseInt(a.sampleNumber.substring(a.sampleNumber.length, 1), 10) -
            parseInt(b.sampleNumber.substring(b.sampleNumber.length, 1), 10)
        );
        curIndex = _sampleList.findIndex((v) => v.active);
        this.setState(
          {
            allInspectionData: _allInspectionData,
            sampleList: _sampleList,
            currentSample: _allInspectionData[curIndex],
            currentSampleIndex: curIndex,
            headerData: {
              ...headerData,
              sampleQty: Number(headerData.sampleQty) + 1,
            },
          },
          () => {
            this.handleSwitchButton();
            this.handleCalculateInspectionQuantity();
          }
        );
      }
    }
  };

  // 修改样品名称
  handleModify = async () => {
    this.setState({ loading: true });
    const newSampleNumber = this.sDS.current.get('sampleNumber');
    const { currentSample, currentSampleIndex } = this.state;
    const _allInspectionData = this.state.allInspectionData.slice();
    let _sampleList = this.state.sampleList.slice();

    const res = await handleInspectionDocLinesModify({
      inspectionDocId: this.state.inspectionDocId,
      sampleNumber: this.state.currentSample.sampleNumber,
      newSampleNumber,
      updateSampleQty: 'Y',
    });
    this.setState({ loading: false });
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      _sampleList = _sampleList.map((v) => {
        if (v.sampleNumber === currentSample.sampleNumber) {
          return { ...v, sampleNumber: newSampleNumber };
        }
        return { ...v };
      });
      currentSample.sampleNumber = newSampleNumber;
      _allInspectionData.splice(currentSampleIndex, 1, currentSample);
      this.setState({
        currentSample,
        allInspectionData: _allInspectionData,
        sampleList: _sampleList,
      });
    }
  };

  // 删除选中的样品
  handleDeleteSample = async () => {
    if (this.state.headerData.samplingType === 'ALL') {
      notification.warning({
        message: '全检状态下不可删除',
      });
      return;
    }

    this.setState({ loading: true });
    let _sampleList = this.state.sampleList.slice();
    let _currentSample = this.state.currentSample;
    let _currentSampleIndex = this.state.currentSampleIndex;
    const _allInspectionData = this.state.allInspectionData.slice();
    const activeIndex = _sampleList.findIndex((v) => v.active);
    const res = await handleInspectionDocLinesDelete({
      inspectionDocId: this.state.inspectionDocId,
      sampleNumber: _sampleList[activeIndex].sampleNumber,
    });
    this.setState({ loading: false });
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      // 删除选中的样品列表
      _sampleList.splice(activeIndex, 1);
      _allInspectionData.splice(activeIndex, 1);

      // 更新当前展示的样品及索引
      if (_allInspectionData.length) {
        if (_currentSampleIndex >= _allInspectionData.length - 1) {
          _currentSampleIndex = _allInspectionData.length - 1;
          _currentSample = _allInspectionData[_currentSampleIndex];
        } else {
          _currentSample = _allInspectionData[_currentSampleIndex];
        }
      }

      _sampleList = _sampleList.map((v) => {
        if (_currentSample.sampleNumber === v.sampleNumber) {
          return { ...v, active: true };
        }
        return { ...v, active: false };
      });

      this.setState(
        {
          sampleList: _sampleList,
          allInspectionData: _allInspectionData,
          currentSample: _currentSample,
          currentSampleIndex: _currentSampleIndex,
        },
        () => {
          this.handleSwitchButton();
          this.handleCalculateInspectionQuantity();
        }
      );
    }
  };

  // 明细页面切换行判定结果
  handleSwitchJudge = (detailLine) => {
    let _detailList = this.state.detailList.slice();
    _detailList = _detailList.map((v) => {
      if (v.inspectionDocLotId === detailLine.inspectionDocLotId) {
        return { ...v, show: !v.show };
      }
      return { ...v };
    });
    this.setState({
      detailList: _detailList,
    });
  };

  // 明细页面行判定结果
  handleActiveMode = (activeRec, detailLine) => {
    let _defaultList = detailLine.defaultList.slice();
    _defaultList = _defaultList.map((v) => {
      if (activeRec.value === v.value) {
        return { ...v, active: true };
      }
      return { ...v, active: false };
    });
    let _detailList = this.state.detailList.slice();
    _detailList = _detailList.map((v) => {
      if (v.inspectionDocLotId === detailLine.inspectionDocLotId) {
        Reflect.set(
          v,
          'curJudge',
          _defaultList.find((rec) => rec.active)
        );
        Reflect.set(v, 'defaultList', _defaultList);
      }
      return { ...v };
    });
    this.setState({
      detailList: _detailList,
    });
  };

  // 明细页面行备注
  handleDetailsRemark = (value, detailLine) => {
    let _detailList = this.state.detailList.slice();
    _detailList = _detailList.map((v) => {
      if (v.inspectionDocLotId === detailLine.inspectionDocLotId) {
        return { ...v, remark: value };
      }
      return { ...v };
    });
    this.setState({
      detailList: _detailList,
    });
  };

  // 明细页面 抽样类型为'SAMPLE' 数量更改
  handleDetailsQuantity = (value, type, detailsIndex) => {
    const _detailList = this.state.detailList.slice();
    const record = _detailList[detailsIndex];
    let quantityRec = {};
    if (parseFloat(value) > parseFloat(record.batchQty)) {
      quantityRec = {
        detailsQualifiedQuantity: 0,
        detailsUnqualifiedQuantity: 0,
      };
    } else {
      let { curJudge } = record;
      if (value === record.batchQty) {
        curJudge =
          type === 'qualified'
            ? record.defaultList.find((i) => i.judgeResult === 'PASS')
            : record.defaultList.find((i) => i.judgeResult === 'FAILED');
      }
      quantityRec = {
        curJudge,
        detailsQualifiedQuantity:
          type === 'qualified'
            ? parseFloat(value.toFixed(6))
            : parseFloat((parseFloat(record.batchQty) - parseFloat(value)).toFixed(6)),
        detailsUnqualifiedQuantity:
          type === 'unqualified'
            ? parseFloat(value.toFixed(6))
            : parseFloat((parseFloat(record.batchQty) - parseFloat(value)).toFixed(6)),
      };
    }
    _detailList.splice(detailsIndex, 1, { ...record, ...quantityRec });
    this.setState(
      {
        detailList: _detailList,
      },
      () => this.handleCalculateDetailsQuantity()
    );
  };

  // 检验单合格不合格数量 input
  handleInspectionQuantity = (value, type) => {
    const { headerData } = this.state;
    const _detailList = this.state.detailList.slice();
    let _quantity = 0;
    let _unQuantity = 0;
    if (parseFloat(value) <= parseFloat(headerData.batchQty)) {
      _quantity =
        type === 'qualified'
          ? parseFloat(value.toFixed(6))
          : parseFloat((parseFloat(headerData.batchQty) - parseFloat(value)).toFixed(6));
      _unQuantity =
        type === 'unqualified'
          ? parseFloat(value.toFixed(6))
          : parseFloat((parseFloat(headerData.batchQty) - parseFloat(value)).toFixed(6));
    }
    if (this.state.type === 'SQC') {
      this.setState({
        qualifiedQuantity: parseFloat(_quantity.toFixed(6)),
        unqualifiedQuantity: parseFloat(_unQuantity.toFixed(6)),
        detailList: _detailList.map((v) => ({
          ...v,
          detailsQualifiedQuantity: 0,
          detailsUnqualifiedQuantity: 0,
        })),
      });
    } else {
      this.setState({
        qualifiedQuantity: parseFloat(_quantity.toFixed(6)),
        unqualifiedQuantity: parseFloat(_unQuantity.toFixed(6)),
      });
    }
  };

  // 图纸
  handlePaper = () => {
    if (this.state.headerData.drawingCode) {
      window.open(this.state.headerData.drawingCode);
    } else {
      notification.warning({
        message: '请先在质检模板中维护图纸',
      });
    }
    // Modal.open({
    //   key: 'lmes-inspection-judgement-paper-modal',
    //   title: '图纸',
    //   className: styles['lmes-inspection-judgement-paper-modal'],
    //   children: <img src={this.state.headerData.drawingCode} alt="" />,
    //   footer: null,
    //   closable: true,
    // });
  };

  // 参考文件
  handleReferences = () => {
    if (this.state.headerData.referenceDocument) {
      window.open(this.state.headerData.referenceDocument);
    } else {
      notification.warning({
        message: '请先在质检模板中维护参考文件',
      });
    }
  };

  // 退出当前页
  handleClose = (flag) => {
    const _flag = flag || this.state.flag;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/lmes/inspection-judgment',
        query: {
          type: this.props.location.state.type,
          flag: _flag,
        },
      })
    );
    closeTab('/pub/lmes/inspection-judgment/execute');
  };

  // 判定合格
  handleJudgeQualified = () => {
    const { unqualifiedQuantity, qualifiedQuantity } = this.state;
    if (unqualifiedQuantity || qualifiedQuantity) {
      this.handleSubmitConfirm('OK');
      return;
    }
    quaModal = Modal.open({
      key: 'lmes-inspection-judgement-qualified-modal',
      title: '提示',
      className: styles['lmes-inspection-judgement-qualified-modal'],
      children: (
        <>
          <div className={styles.toast}>有样本待判定，是否直接提交？</div>
          <div className={styles.footer}>
            <Button onClick={() => quaModal.close()}>取消</Button>
            <Button
              className={styles.confirm}
              color="primary"
              onClick={this.handleQualifiedConfirm}
            >
              确定
            </Button>
          </div>
        </>
      ),
      footer: null,
      closable: true,
    });
  };

  handleQualifiedConfirm = () => {
    quaModal.close();
    this.handleSubmitConfirm('OK');
  };

  // 判定不合格
  handleJudgeUnqualified = () => {
    const { unqualifiedQuantity, qualifiedQuantity, headerData } = this.state;
    if (Number(unqualifiedQuantity) <= 0) {
      notification.warning({
        message: '不合格数量必须大于0!',
      });
      return;
    }

    if (Number(qualifiedQuantity) + Number(unqualifiedQuantity) !== Number(headerData.batchQty)) {
      notification.warning({
        message: '合格数量+不合格数量必须等于报检数量！',
      });
      return;
    }
    this.handleSubmitConfirm('NG');
  };

  // 判定让步接受
  judgeGiveIn = () => {
    const { unqualifiedQuantity, qualifiedQuantity, headerData } = this.state;
    if (Number(qualifiedQuantity) + Number(unqualifiedQuantity) !== Number(headerData.batchQty)) {
      notification.warning({
        message: '合格数量+不合格数量必须等于报检数量！',
      });
      return;
    }
    this.handleSubmitConfirm('CONCESSION');
  };

  // 异常页签 数量变化
  handleAbnormalChange = (value, index) => {
    const _badReasonList = this.state.badReasonList.slice();
    // const { batchQty } = this.state.headerData;
    // if (value > batchQty) {
    //   notification.warning({
    //     message: '不可大于批次数量',
    //   });
    //   _badReasonList[index].exceptionQty = 0;
    // } else {
    //   _badReasonList[index].exceptionQty = value;
    // }
    const currentVal = /^\d+(.\d{0,6})?$/.test(value) ? value : value?.toFixed(6) ?? 0;
    _badReasonList[index].exceptionQty = currentVal;
    this.setState({
      badReasonList: _badReasonList,
    });
  };

  handleSubmitConfirm(judgeResult) {
    const { headerData } = this.state;
    if (headerData.docRule && headerData.docRule.operate_confirm === '1') {
      let judgeLabel = '';
      if (judgeResult === 'OK') {
        judgeLabel = '合格';
      } else if (judgeResult === 'NG') {
        judgeLabel = '不合格';
      } else if (judgeResult === 'CONCESSION') {
        judgeLabel = '让步接受';
      }
      Modal.confirm({
        children: <div>是否将检验单判定为：{judgeLabel}？</div>,
        onOk: () => this.handleSubmit(judgeResult),
      });
    } else {
      this.handleSubmit(judgeResult);
    }
  }

  // 提交
  handleSubmit = async (judgeResult) => {
    const {
      headerData,
      qualifiedQuantity,
      unqualifiedQuantity,
      allInspectionData,
      badReasonList,
      detailList,
      qualifiedSampleQty,
      unqualifiedSampleQty,
      qcRemark,
    } = this.state;

    // 校验
    if (badReasonList.some((v) => v.exceptionQty > unqualifiedQuantity)) {
      notification.warning({
        message: '异常数量不可大于不合格数量！',
      });
      return;
    }

    const inspectionDocLineList = [];
    const judgeInspectionDocLotDtoList = detailList.map((v) => {
      let _qcResult = null;
      if (v.curJudge.judgeResult === 'PASS') {
        _qcResult = 'OK';
      } else if (v.curJudge.judgeResult === 'FAILED') {
        _qcResult = 'NG';
      } else {
        _qcResult = 'CONCESSION';
      }
      return {
        ...v,
        qcResult: _qcResult,
        qcOkQty: v.detailsQualifiedQuantity,
        qcNgQty: v.detailsUnqualifiedQuantity,
        qcSecondOkQty: null,
        qcSecondNgQty: null,
        qcNgReasonId: null,
        qcNgReason: null,
        lotRemark: v.remark,
        lotPictures: null,
      };
    });
    const _badReasonList = badReasonList
      .filter((i) => i.exceptionQty)
      .map((v) => {
        const fileUrlList = [];
        v.fileList.forEach((ele) => {
          fileUrlList.push(ele.url);
        });
        return { ...v, fileUrlList };
      });
    const inspectionDocExceptionList = [
      {
        exceptionDocId: headerData.inspectionDocId,
        lineList: _badReasonList.map((v) => ({ ...v, exceptionPictures: v.fileUrlList.join('#') })),
      },
    ];
    allInspectionData.forEach((ele) => {
      ele.inspectionLine.forEach((item) =>
        inspectionDocLineList.push({
          ...item,
          sampleNumber: ele.sampleNumber,
          qcOkQty: item.qcResult === 'PASS' ? '1' : '0',
          qcNgQty: item.qcResult === 'FAILED' ? '1' : '0',
          inspectorId: this.props.location.state.declarerId, // 判定员id
          inspector: this.props.location.state.declarer,
          lastInspectedDate: getTime(),
          lineRemark: null,
          pictures: null,
        })
      );
      let _submitLineList = ele.badReasonList.filter(
        (v) => v.active && ele.activeReasonOptions.indexOf(v.exceptionName) !== -1
      );
      if (_submitLineList.length) {
        _submitLineList = _submitLineList.map((v) => ({
          ...v,
          exceptionQty: null,
        }));
      }
      inspectionDocExceptionList.push({
        exceptionDocId: headerData.inspectionDocId,
        sampleNumber: ele.sampleNumber,
        exceptionDocLotId: ele.inspectionDocLotId,
        lineList: _submitLineList,
      });
    });

    const params = {
      inspectionDocId: headerData.inspectionDocId, // 检验单id 必传
      qcRemark,
      qcResult: judgeResult, // 判定结果 必传
      qcOkQty:
        qualifiedQuantity === 0 && unqualifiedQuantity === 0 && judgeResult === 'OK'
          ? null
          : qualifiedQuantity, // 合格数量
      qcNgQty:
        qualifiedQuantity === 0 && unqualifiedQuantity === 0 && judgeResult === 'OK'
          ? null
          : unqualifiedQuantity, // 不合格数量
      qcSecondOkQty: null,
      qcSecondNgQty: null,
      qcNgReasonId: null,
      qcNgReason: null,
      inspectorId: this.props.location.state.declarerId, // 判定员id
      inspector: this.props.location.state.declarer, // 判定员
      judgedDate: getTime(), // 判定时间
      remark: null,
      batchQty: headerData.batchQty || headerData.sampleQty,
      sampleOkQty: qualifiedSampleQty,
      sampleNgQty: unqualifiedSampleQty,
      _token: headerData._token,
      inspectionDocLineList,
      judgeInspectionDocLotDtoList,
      inspectionDocExceptionList,
    };

    this.setState({ loading: true, submitLoading: true });
    const res = await inspectionDocSubmit(params);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '提交成功',
      });
      this.setState(
        {
          flag: true,
        },
        () => this.handleClose(true)
      );
    }
    this.setState({ loading: false, submitLoading: false });
  };

  uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: BUCKET_NAME_MES,
      directory,
    };
  };

  uploadButton = () => (
    <div>
      <Icons type="add-blue" size={28} color="#999" />
      <div>
        <span>
          <p>点击上传</p>
          <p>最多可上传9张</p>
        </span>
      </div>
    </div>
  );

  // 上传成功
  handleImgSuccess = (res, record) => {
    if (!res) {
      return;
    }
    let _badReasonList = this.state.badReasonList.slice();
    const _fileList = [];
    let curRec = {};
    const fileObj = {
      uid: uuidv4(),
      name: res.split('@')[1],
      status: 'done',
      url: res,
    };
    _fileList.unshift(fileObj);
    _badReasonList = _badReasonList.map((v) => {
      if (v.exceptionId === record.exceptionId) {
        curRec = { ...v, fileList: [..._fileList, ...v.fileList] };
        return curRec;
      }
      return { ...v };
    });
    this.setState(
      {
        badReasonList: _badReasonList,
        curBadReason: curRec,
      },
      () => {
        this.updateModal();
      }
    );
  };

  // 预览图片
  handlePreview = (file) => {
    if (!file.url) return;
    window.open(file.url);
  };

  // 删除图片
  handleRemove = (file, record) => {
    const _badReasonList = this.state.badReasonList.slice();
    const targetIndex = _badReasonList.findIndex((v) => v.exceptionId === record.exceptionId);
    _badReasonList[targetIndex].fileList = _badReasonList[targetIndex].fileList.filter(
      (v) => v.uid !== file.uid
    );
    this.setState(
      {
        badReasonList: _badReasonList,
      },
      () => this.updateModal()
    );
  };

  propsData = (record) => {
    return {
      name: 'file',
      headers: {
        Authorization: `bearer ${getAccessToken()}`,
      },
      action: `${HZERO_FILE}/v1/${getCurrentOrganizationId()}/files/multipart`,
      accept: ['image/*'],
      listType: 'picture-card',
      multiple: true,
      data: this.uploadData,
      onSuccess: (res) => this.handleImgSuccess(res, record),
      onPreview: this.handlePreview,
      onRemove: (res) => this.handleRemove(res, record),
      fileList: this.state.fileList,
    };
  };

  handlePicturesModal = (record, index) => {
    modal = Modal.open({
      key: 'inspection-judgement-pictures-modal',
      title: '图片',
      className: styles['inspection-judgement-pictures-modal'],
      children: (
        <div className={styles.wrapper}>
          <div className={styles['img-list']}>
            <Upload {...this.propsData(record, index)} fileList={record.fileList}>
              {record.fileList.length >= 9 ? null : this.uploadButton()}
            </Upload>
          </div>
          <div className={styles['footer-button']} onClick={this.handleConfirm}>
            <span>确认</span>
          </div>
        </div>
      ),
      footer: null,
      movable: true,
      closable: true,
    });
  };

  /**
   * 备注弹窗
   */
  handleRemark = (record, index) => {
    Modal.open({
      key: 'remark',
      title: '备注',
      className: styles['lmes-task-report-mo-remark-modal'],
      children: (
        <TextField
          value={record.exceptionRemark}
          onChange={(value) => {
            this.setState({ errorRemark: value });
          }}
          name="remark"
          style={{ marginTop: 30, height: 48, width: '100%' }}
          placeholder="请输入异常备注"
          noCache
        />
      ),
      onOk: () => {
        const _badReasonList = this.state.badReasonList.slice();
        _badReasonList[index].exceptionRemark = this.state.errorRemark;
        this.setState({
          badReasonList: _badReasonList,
        });
      },
      onCancel: () => this.setState({ errorRemark: '' }),
    });
  };

  changeErrorRemark = (value) => {
    this.setState({ errorRemark: value });
  };

  handleConfirm = () => {
    modal.close();
  };

  // 弹框更新
  updateModal = () => {
    const { curBadReason } = this.state;
    modal.update({
      children: (
        <div className={styles.wrapper}>
          <div className={styles['img-list']}>
            <Upload {...this.propsData(curBadReason)} fileList={curBadReason.fileList}>
              {curBadReason.fileList.length >= 9 ? null : this.uploadButton()}
            </Upload>
          </div>
          <div className={styles['footer-button']} onClick={this.handleConfirm}>
            <span>确认</span>
          </div>
        </div>
      ),
    });
  };

  // 样品更改
  handleChangeSampleNumber = async () => {
    const { editSampleNumber, headerData, isEdit } = this.state;
    if (!editSampleNumber) {
      return;
    }
    if (isEdit) {
      this.setState({
        isEdit: !this.state.isEdit,
      });
      return;
    }
    const resp = await updateSampleQty({
      inspectionDocId: headerData.inspectionDocId,
      sampleQty: editSampleNumber,
    });
    if (getResponse(resp)) {
      notification.success({
        message: '提交成功',
      });
      this.setState({
        headerData: { ...headerData, sampleQty: resp.sampleQty },
        isEdit: !this.state.isEdit,
      });
      sampleModal.close();
    }
  };

  handleOpenSampleModal = () => {
    const { editSampleNumber, qualifiedSampleQty, unqualifiedSampleQty } = this.state;
    sampleModal = Modal.open({
      key: 'inspection-judgement-sample-modal',
      title: '数量',
      className: styles['inspection-judgement-sample-modal'],
      children: (
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.title}>抽样数量</div>
            <span className={styles['sample-input']}>
              <NumberField
                value={editSampleNumber}
                min={0}
                placeholder="请输入数量"
                onChange={this.handleChangeSampleQty}
              />
            </span>
          </div>
          <div className={styles.content}>
            <div>
              <div className={styles['ds-ai-center']}>
                <span className={styles['qualified-circle']} />
                <span className={styles.title}>合格数量</span>
              </div>
              <NumberField
                value={qualifiedSampleQty}
                min={0}
                placeholder="请输入数量"
                onChange={this.handleQualifiedQty}
              />
            </div>
            <div>
              <div className={styles['ds-ai-center']}>
                <span className={styles['unqualified-circle']} />
                <span className={styles.title}>不合格数量</span>
              </div>
              <NumberField
                value={unqualifiedSampleQty}
                min={0}
                placeholder="请输入数量"
                onChange={this.handleUnqualifiedQty}
              />
            </div>
          </div>
          <div className={styles.footer}>
            <Button onClick={() => sampleModal.close()}>取消</Button>
            <Button
              className={styles.confirm}
              color="primary"
              onClick={this.handleChangeSampleNumber}
            >
              确定
            </Button>
          </div>
        </div>
      ),
      footer: null,
      movable: true,
      closable: true,
    });
  };

  handleChangeSampleQty = (value) => {
    this.setState(
      {
        editSampleNumber: parseFloat(value.toFixed(6)),
        qualifiedSampleQty: 0,
        unqualifiedSampleQty: 0,
      },
      () => this.handleUpdateSample()
    );
  };

  handleQualifiedQty = (value) => {
    const { editSampleNumber } = this.state;
    if (value > editSampleNumber) {
      notification.warning({
        message: '不可大于抽样数量!',
      });
      this.setState(
        {
          qualifiedSampleQty: 0,
          unqualifiedSampleQty: 0,
        },
        () => this.handleUpdateSample()
      );
      return;
    }
    this.setState(
      {
        qualifiedSampleQty: parseFloat(value.toFixed(6)),
        unqualifiedSampleQty: parseFloat(
          (parseFloat(editSampleNumber) - parseFloat(value)).toFixed(6)
        ),
      },
      () => this.handleUpdateSample()
    );
  };

  handleUnqualifiedQty = (value) => {
    const { editSampleNumber } = this.state;
    if (value > editSampleNumber) {
      notification.warning({
        message: '不可大于抽样数量!',
      });
      this.setState(
        {
          qualifiedSampleQty: 0,
          unqualifiedSampleQty: 0,
        },
        () => this.handleUpdateSample()
      );
      return;
    }
    this.setState(
      {
        qualifiedSampleQty: parseFloat(
          (parseFloat(editSampleNumber) - parseFloat(value)).toFixed(6)
        ),
        unqualifiedSampleQty: parseFloat(value.toFixed(6)),
      },
      () => this.handleUpdateSample()
    );
  };

  handleUpdateSample = () => {
    const { editSampleNumber, qualifiedSampleQty, unqualifiedSampleQty } = this.state;
    sampleModal.update({
      children: (
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.title}>抽样数量</div>
            <span className={styles['sample-input']}>
              <NumberField
                value={editSampleNumber}
                placeholder="请输入数量"
                onChange={this.handleChangeSampleQty}
              />
            </span>
          </div>
          <div className={styles.content}>
            <div>
              <div className={styles['ds-ai-center']}>
                <span className={styles['qualified-circle']} />
                <span className={styles.title}>合格数量</span>
              </div>
              <NumberField
                value={qualifiedSampleQty}
                min={0}
                placeholder="请输入数量"
                onChange={this.handleQualifiedQty}
              />
            </div>
            <div>
              <div className={styles['ds-ai-center']}>
                <span className={styles['unqualified-circle']} />
                <span className={styles.title}>不合格数量</span>
              </div>
              <NumberField
                value={unqualifiedSampleQty}
                min={0}
                placeholder="请输入数量"
                onChange={this.handleUnqualifiedQty}
              />
            </div>
          </div>
          <div className={styles.footer}>
            <Button onClick={() => sampleModal.close()}>取消</Button>
            <Button
              className={styles.confirm}
              color="primary"
              onClick={this.handleChangeSampleNumber}
            >
              确定
            </Button>
          </div>
        </div>
      ),
    });
  };

  handleAutoFillChange = (value) => {
    let _detailList = this.state.detailList.slice();
    if (value) {
      _detailList = _detailList.map((v) => {
        if (!v.detailsQualifiedQuantity && !v.detailsUnqualifiedQuantity) {
          return {
            ...v,
            detailsQualifiedQuantity: v.batchQty,
          };
        }
        return {
          ...v,
        };
      });
      this.setState(
        {
          detailList: _detailList,
          autoFill: value,
        },
        () => this.handleCalculateDetailsQuantity()
      );
    } else {
      Modal.confirm({
        children: <div>此操作会清空已录入的数据，是否提交？</div>,
        onOk: () => {
          _detailList = _detailList.map((v) => ({
            ...v,
            detailsQualifiedQuantity: 0,
            detailsUnqualifiedQuantity: 0,
          }));
          this.setState(
            {
              detailList: _detailList,
              autoFill: false,
            },
            () => this.handleCalculateDetailsQuantity()
          );
        },
        onCancel: () => {
          this.setState(
            {
              detailList: _detailList,
              autoFill: true,
            },
            () => this.handleCalculateDetailsQuantity()
          );
        },
      });
    }
  };

  handleCodeChange = (value) => {
    this.setState({
      searchValue: value,
    });
  };

  handleRemarkClick = () => {
    Modal.open({
      key: 'remark',
      title: '备注',
      className: styles['lmes-task-report-mo-remark-modal'],
      children: (
        <TextField
          value={this.state.qcRemark}
          onChange={(value) => {
            this.setState({ qcRemark: value });
          }}
          name="remark"
          style={{ marginTop: 30, height: 48, width: '100%' }}
          placeholder="请输入备注"
          noCache
        />
      ),
      onOk: () => {},
      onCancel: () => this.setState({ qcRemark: '' }),
    });
  };

  render() {
    const {
      loading,
      submitLoading,
      beforeClick,
      nextClick,
      headerData,
      sampleList,
      currentSample,
      qualifiedQuantity,
      unqualifiedQuantity,
      detailList,
      type,
      badReasonList,
      searchValue,
    } = this.state;
    let _detailList = detailList.slice();
    if (searchValue) {
      _detailList = _detailList.filter((v) => v.tagCode.trim() === searchValue.trim());
    } else {
      _detailList = detailList.slice();
    }
    return (
      <div className={styles['container-inspection-judgment']}>
        <Head />
        <div className={styles['execute-content']}>
          <div className={`${styles.left} ${styles['block-content']}`}>
            <div className={styles['worker-info']}>
              <div className={styles.avatar}>
                <img src={headerData.fileUrl || defaultAvatarIcon} alt="avatar" />
              </div>
              <span className={styles.worker}>{headerData.declarer}</span>
              <span className={styles.time}>{headerData.duration}</span>
              {headerData.priority && (
                <span className={styles.priority}>{headerData.priority}</span>
              )}
            </div>
            <div className={styles['inspection-header']}>
              <div className={styles['header-info']}>
                <Icons type="document-grey1" size="26" color="#9b9b9b" />
                <span>{headerData.inspectionDocNum}</span>
                {headerData.samplingType ? (
                  <span className={styles['header-status']}>{headerData.samplingTypeMeaning}</span>
                ) : null}
              </div>
              <div className={`${styles.code} ${styles['header-info']}`}>
                <Icons type="document-grey1" size="26" color="#9b9b9b" />
                <span className={styles.number}>{headerData.sourceDocNum}</span>
                <span>{headerData.sourceDocLineNum}</span>
              </div>
              {type === 'IQC' && (
                <>
                  <div className={styles['header-info']}>
                    <Icons type="document-grey1" size="26" color="#9b9b9b" />
                    <span>{headerData.relatedDocNum}</span>
                    <span>{headerData.relatedDocLineNum}</span>
                  </div>
                  <div className={styles['header-info']}>
                    <Icons type="supplier1" size="26" color="#9b9b9b" />
                    <span>{headerData.partyName}</span>
                  </div>
                </>
              )}
              {type !== 'IQC' && type !== 'RQC' && (
                <div className={styles['header-info']} style={{ marginLeft: '-5px' }}>
                  <Icons type="gongxu" size="30" color="#9b9b9b" />
                  <span>{headerData.operation}</span>
                </div>
              )}
              <div className={styles['header-info']}>
                <Icons type="document-grey1" size="26" color="#9b9b9b" />
                <span>{headerData.itemCode}</span>
              </div>
              <div className={styles['header-info']}>
                <Icons type="banzuguanli1" size="26" color="#9b9b9b" />
                <span>{headerData.description}</span>
              </div>
              <div className={styles['header-info']}>
                <Icons type="number-unselect" size="22" color="#9b9b9b" />
                <span>报检数量: {headerData.batchQty || headerData.sampleQty}</span>
              </div>
              {headerData.docRule && headerData.docRule.sample_update === '1' ? (
                <div className={styles['header-info']}>
                  <Icons type="number-unselect" size="22" color="#9b9b9b" />
                  <div style={{ flex: 1 }} className={styles['ds-ai-center']}>
                    <span>抽样数量: </span>
                    <div style={{ flex: 1 }}>
                      <span>{headerData.sampleQty}</span>
                      <Icons
                        style={{ marginLeft: '10px' }}
                        type="beizhu"
                        size="24"
                        color="#1C879C"
                        onClick={this.handleOpenSampleModal}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles['header-info']}>
                  <Icons type="number-unselect" size="22" color="#9b9b9b" />
                  <span>抽样数量: {headerData.sampleQty}</span>
                </div>
              )}
              <div className={styles['header-info']}>
                <Icons type="inspection-item1" size="26" color="#9b9b9b" />
                <span>检验组: {headerData.inspectionGroupName}</span>
              </div>
            </div>
          </div>
          <div className={`${styles.right} ${styles['block-content']}`}>
            <Tabs defaultActiveKey="1" animated={false} onChange={this.callback}>
              {headerData.samplingType !== 'NONE' && (
                <TabPane
                  tab="样品"
                  key="1"
                  style={
                    this.state.toggleShow
                      ? { padding: '10px 158px 10px 15px' }
                      : { padding: '10px 34px 10px 15px' }
                  }
                >
                  {currentSample && Object.keys(currentSample).length ? (
                    <>
                      <Row className={styles['tab-sample-header']}>
                        <Col span={8}>
                          <span className={styles['sample-name']}>
                            {currentSample.sampleNumber}
                          </span>
                          <Icons
                            type="edit-grey"
                            size="22"
                            color="#9b9b9b"
                            onClick={() => this.handleSampleNameModal('modify')}
                          />
                        </Col>
                        <Col
                          span={10}
                          className={
                            currentSample.activeReasonOptions.length
                              ? `${styles['select-box']} ${styles['select-box-active']}`
                              : styles['select-box']
                          }
                          onClick={() => this.handlePoorSampleModal(currentSample)}
                        >
                          {!currentSample.activeReasonOptions.length ? (
                            <>
                              <span>样品不良</span>
                              <Icons type="select" size="16" color="#4a4a4a" />
                            </>
                          ) : (
                            <>
                              <span>{currentSample.activeReasonOptions.join('，')}</span>
                              <Icons type="select" size="16" color="#F9A825" />
                            </>
                          )}
                        </Col>
                        <Col span={6} className={styles['change-buttons']}>
                          <Button
                            disabled={!beforeClick}
                            onClick={() => this.handleChangeCur('before')}
                          >
                            上一个
                          </Button>
                          <Button
                            disabled={!nextClick}
                            onClick={() => this.handleChangeCur('next')}
                          >
                            下一个
                          </Button>
                        </Col>
                      </Row>
                      <div className={styles['tab-sample-list']}>
                        {currentSample.inspectionLine.length
                          ? currentSample.inspectionLine.map((v, i) => (
                              <InspectionLine
                                key={uuidv4()}
                                {...v}
                                onSwitchChange={() => this.handleSwitchChange(i)}
                                onNumberChange={(value) => this.handleNumberChange(value, i)}
                              />
                            ))
                          : null}
                      </div>
                    </>
                  ) : null}
                  {this.state.toggleShow ? (
                    <div className={styles['sample-list']}>
                      <div className={styles['operation-buttons']}>
                        <Icons
                          type="add-blue"
                          size="30"
                          color="#1C879C"
                          onClick={() => this.handleSampleNameModal('add')}
                        />
                        <Icons
                          type="delete"
                          size="28"
                          color="#1C879C"
                          onClick={this.handleDeleteSample}
                        />
                      </div>
                      <div className={styles['sample-name-list']}>
                        {sampleList.length
                          ? sampleList.map((v) => (
                              <p
                                key={uuidv4()}
                                className={v.active && `${styles['sample-active']}`}
                                onClick={() => this.handleSampleActive(v)}
                              >
                                {v.sampleNumber}
                              </p>
                            ))
                          : null}
                      </div>
                      <div className={styles['show-or-hide']}>
                        <Icons
                          type="hide"
                          size="24"
                          color="#1C879C"
                          onClick={this.handleHideSampleList}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={styles['sample-list-hide']} onClick={this.handleHideSampleList}>
                      <div className={styles['image-block']}>
                        <Icons type="arrow-left-white" size="22" color="#fff" />
                      </div>
                    </div>
                  )}
                </TabPane>
              )}
              {this.state.type !== 'SQC' &&
              this.state.type !== 'ROUTING' &&
              headerData.itemControlType !== 'QUANTITY' ? (
                <TabPane tab="明细" key="2">
                  {detailList.length && headerData.samplingType !== 'ALL' ? (
                    <div className={styles['details-header']}>
                      <div className={styles['lov-suffix']}>
                        <img className={styles['right-icon']} src={scanIcon} alt="" />
                        <TextField
                          value={searchValue}
                          name="tagCode"
                          placeholder="请扫描或输入标签号"
                          onChange={this.handleCodeChange}
                        />
                      </div>
                      <div className={styles['auto-fill']}>
                        <div className={styles.title}>填充合格数量</div>
                        <Switch
                          unCheckedChildren={<Icon type="close" />}
                          checked={this.state.autoFill}
                          onChange={this.handleAutoFillChange}
                        >
                          <Icon type="check" />
                        </Switch>
                      </div>
                    </div>
                  ) : null}
                  {_detailList.map((detailLine, detailsIndex) => (
                    <DetailsLine
                      key={uuidv4()}
                      {...detailLine}
                      headerData={headerData}
                      onSwitchJudge={() => this.handleSwitchJudge(detailLine)}
                      onActiveMode={(activeRec) => this.handleActiveMode(activeRec, detailLine)}
                      onDetailsRemark={(value) => this.handleDetailsRemark(value, detailLine)}
                      onDetailsQuantity={(value, typeValue) =>
                        this.handleDetailsQuantity(value, typeValue, detailsIndex)
                      }
                    />
                  ))}
                </TabPane>
              ) : null}
              <TabPane tab="异常" key="3">
                {badReasonList.length
                  ? badReasonList.map((rec, index) => (
                      <AbnormalLine
                        key={uuidv4()}
                        line={rec}
                        onAbnormalChange={(value) => this.handleAbnormalChange(value, index)}
                        handlePicturesModal={() => this.handlePicturesModal(rec, index)}
                        handleRemark={() => this.handleRemark(rec, index)}
                      />
                    ))
                  : null}
              </TabPane>
            </Tabs>
          </div>
        </div>
        <Footer
          type={this.state.type}
          qualifiedQuantity={qualifiedQuantity}
          unqualifiedQuantity={unqualifiedQuantity}
          headerData={headerData}
          onQualified={this.handleJudgeQualified}
          onUnqualified={this.handleJudgeUnqualified}
          onGiveIn={this.judgeGiveIn}
          // onBadReason={this.handleBadReason}
          onRemarkClick={this.handleRemarkClick}
          onClose={this.handleClose}
          onInspectionQuantity={this.handleInspectionQuantity}
          onPaper={this.handlePaper}
          onReferences={this.handleReferences}
        />
        {loading ? (
          <div
            className={
              submitLoading
                ? `${styles['my-loading-yes-no']} ${styles['loading-mask']}`
                : styles['my-loading-yes-no']
            }
          >
            <Spin tip="Loading..." />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Execute;
