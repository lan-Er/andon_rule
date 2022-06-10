/*
 * @Description: 恒光检验判定执行页面
 * @Author: zmt
 * @LastEditTime: 2020-10-22 14:09:40
 */

import React from 'react';
import { connect } from 'dva';
import { Button, Modal, Spin, DataSet } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { routerRedux } from 'dva/router';
import { closeTab } from 'utils/menuTab';
import uuidv4 from 'uuid/v4';
import { queryLovData } from 'hlos-front/lib/services/api';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import defaultAvatarIcon from 'hlos-front/lib/assets/img-default-avator.png';
import {
  queryHgInspectionGroup,
  queryExceptionAssigns,
  handleHgJudgeInspectionDoc,
  startInspection,
  processInspectionNg,
} from '../../services/hgInspectionJudgmentService.js';

import { Clock } from './components/clock.js';
import Inspection from './components/inspection.js';
import Line from './components/line.js';
import Result from './components/result.js';
import PickModal from './components/pickModal.js';
import './index.less';
import logo from '../../assets/InspectionJudgment/logo.svg';
// import avatar from '../../assets/InspectionJudgment/default-header.jpg';
import oddNumber from '../../assets/InspectionJudgment/odd-number.svg';
import quantity from '../../assets/InspectionJudgment/quantity.svg';
import itemDesc from '../../assets/InspectionJudgment/item-desc.svg';
import timeBlue from '../../assets/InspectionJudgment/time-blue.svg';
import operationBlue from '../../assets/InspectionJudgment/operation-blue.svg';
import partyNameBlue from '../../assets/InspectionJudgment/party-blue.svg';

let modal = null;

// 头部组件
function Head() {
  return (
    <div className="header">
      <img src={logo} alt="logo" />
      <Clock />
    </div>
  );
}

@connect()
class Execute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerData: {}, // 检验单头部数据
      inspectionList: [], // 检验项
      startInspect: false, // 是否开始检验
      inspectResult: false,
      loading: false,
      badReasonList: [], // 不良原因
      remark: '', // 判定结果 - 备注
      ongoingRemark: '', // 处理结果 - 备注
      defaultWorker: {},
      judgeResults: [
        {
          color: '#2D9558',
          title: '合格',
          type: 'number',
          value: null,
          placeholder: '请输入数量',
        },
        {
          color: '#DF5630',
          title: '不合格',
          type: 'number',
          value: null,
          placeholder: '请输入数量',
        },
        {
          color: null,
          title: '判定人',
          type: 'lov',
          value: null,
          placeholder: '请输入判定人',
        },
      ],
      results: [
        {
          color: '#2D9558',
          title: '合格接收',
          type: 'number',
          value: null,
          placeholder: '请输入数量',
        },
        {
          color: '#F7B500',
          title: '让步接收',
          type: 'number',
          value: null,
          placeholder: '请输入数量',
        },
        {
          color: 'BFBFBF',
          title: '退回',
          type: 'number',
          value: null,
          placeholder: '请输入数量',
        },
      ],
    };
  }

  lovDs = new DataSet({
    autoCreate: true,
    selection: 'multiple',
    fields: [
      {
        name: 'workerObj',
        type: 'object',
        lovCode: 'LMDS.WORKER',
        label: '判定人',
        multiple: true,
        ignore: 'always',
      },
      {
        name: 'workerId',
        type: 'string',
        bind: 'workerObj.workerId',
      },
      {
        name: 'workerCode',
        type: 'string',
        bind: 'workerObj.workerCode',
      },
      {
        name: 'workerName',
        type: 'string',
        bind: 'workerObj.workerName',
      },
    ],
  });

  async componentDidMount() {
    const { state } = this.props.location;
    const { judgeResults, results } = this.state;
    const { remark } = state;
    let defaultWorker = {};
    const res = await queryLovData({
      lovCode: 'LMDS.WORKER',
      defaultFlag: 'Y',
      showOrganization: 'Y',
    });
    if (res && Array.isArray(res.content) && res.content.length) {
      this.lovDs.current.set('workerObj', res.content[0]);
      this.lovDs.current.set('workerId', res.content[0].workerId);
      this.lovDs.current.set('workerName', res.content[0].workerName);
      defaultWorker = { ...res.content[0] };
    }

    if (state.qcStatus === 'ONGOING') {
      this.setState({
        startInspect: true,
      });
    }

    if (state.qcStatus === 'COMPLETED') {
      judgeResults[0].value = state.qcOkQty;
      judgeResults[1].value = state.qcNgQty;
      results[0].value = state.qcOkQty;
      this.lovDs.current.set('workerName', state.inspector.split(','));
    }

    this.setState({
      headerData: state,
      remark,
      judgeResults,
      defaultWorker,
    });
    await this.handleQueryHgInspectionGroup();
    await this.handleQueryExceptionAssigns();
  }

  handleJudge = () => {
    const { inspectionList } = this.state;

    if (!inspectionList.length) {
      return;
    }
    const allQualified = this.state.inspectionList.every(
      (v) => v.lineQualifiedNum !== null && v.lineQualifiedNum > -1
    );
    const allUnqualified = this.state.inspectionList.every(
      (v) => v.lineUnqualifiedNum !== null && v.lineUnqualifiedNum > -1
    );

    if (allQualified && allUnqualified) {
      this.setState({
        inspectResult: true,
      });
    }
  };

  handleQueryHgInspectionGroup = async () => {
    this.setState(() => ({ loading: true }));
    const { inspectionDocId } = this.props.location.state;
    await queryHgInspectionGroup({
      inspectionDocId,
    }).then((res) => {
      if (res && res.length) {
        this.setState({
          inspectionList: res.map((v) => ({
            ...v,
            lineQualifiedNum: null,
            lineUnqualifiedNum: null,
          })),
        });
      }
      this.setState({
        loading: false,
      });
    });
  };

  handleQueryExceptionAssigns = async () => {
    const res = await queryExceptionAssigns({ size: -1 });
    if (res && res.content && res.content.length) {
      const list = res.content.map((v) => ({ ...v, exceptionQty: 0 }));
      this.setState({
        badReasonList: list,
      });
    }
  };

  // 开始检验
  handleStartInspect = async () => {
    const { headerData, inspectionList } = this.state;
    if (headerData.qcStatus !== 'NEW') {
      return;
    }

    if (!inspectionList.length) {
      notification.warning({
        message: '暂无检验项',
      });
      return;
    }
    const params = {
      inspectionDocIds: [headerData.inspectionDocId],
      inspector: headerData.declarerName,
      inspectorId: headerData.declarerId,
      startDate: moment().format(DEFAULT_DATETIME_FORMAT),
    };

    const res = await startInspection(params);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '当前检验单已开始检验!',
      });
      this.setState({
        startInspect: true,
        headerData: { ...this.state.headerData, qcStatus: 'ONGOING' },
      });
    }
  };

  // 弹框 --- 取消
  handleCloseModal = () => {
    modal.close();

    const list = this.state.badReasonList.slice();
    this.setState({
      badReasonList: list.map((v) => ({ ...v, exceptionQty: 0 })),
    });
  };

  // 弹框 --- 加减数量
  handleUpdateCount = (type, index, itemIndex) => {
    const badReasonList = this.state.badReasonList.slice();
    if (type === 'add') {
      badReasonList[index].exceptionQty++;
    } else {
      badReasonList[index].exceptionQty--;
    }
    if (badReasonList[index].exceptionQty < 0) {
      return;
    }
    this.setState(
      {
        badReasonList,
      },
      () => {
        modal.update({
          children: (
            <PickModal
              itemIndex={itemIndex}
              reasons={this.state.badReasonList}
              handleUpdateCount={this.handleUpdateCount}
              handleChange={(value, index1) => this.handleChange(value, index1)}
              handleCloseModal={this.handleCloseModal}
              handleConfirm={() => this.handleConfirm(itemIndex)}
            />
          ),
        });
      }
    );
  };

  // 弹框 --- 数量
  handleChange = (value, index) => {
    const list = this.state.badReasonList.slice();
    list.splice(index, 1, { ...list[index], exceptionQty: value });
    this.setState({
      badReasonList: list,
    });
  };

  // 弹框 --- 确认 不合格数量计算
  handleConfirm = (itemIndex) => {
    modal.close();

    const { badReasonList, inspectionList, headerData } = this.state;
    let lineUnqualifiedNum = null;

    badReasonList.forEach((v) => {
      lineUnqualifiedNum += v.exceptionQty;
    });

    this.setState(
      {
        badReasonList: badReasonList.map((v) => ({
          ...v,
          inspectionDocId: headerData.inspectionDocId,
        })),
        inspectionList: inspectionList.map((v, i) => {
          if (i === itemIndex) {
            return {
              ...v,
              lineUnqualifiedNum,
              // badReasonList: badReasonList.map((ele) => ({
              //   ...ele,
              //   inspectionDocLineId: inspectionList[itemIndex].inspectionDocLineId,
              // })),
            };
          }
          return v;
        }),
      },
      () => {
        this.handleJudge();
      }
    );
  };

  // 检验项 --- 合格数量
  handleQualified = (value, itemIndex) => {
    const { inspectionList, headerData } = this.state;
    if (value > headerData.batchQty) {
      notification.warning({
        message: '填写的数量与报检数量不一致，请确认!',
      });
      this.setState({
        inspectionList: inspectionList.map((v, i) => {
          if (i === itemIndex) {
            return { ...v, lineQualifiedNum: null };
          }
          return v;
        }),
      });
    } else {
      this.setState(
        {
          inspectionList: inspectionList.map((v, i) => {
            if (i === itemIndex) {
              return {
                ...v,
                lineQualifiedNum: value,
                lineUnqualifiedNum: Number(headerData.batchQty) - Number(value),
              };
            }
            return v;
          }),
        },
        () => {
          this.handleJudge();
        }
      );
    }
  };

  // 检验项 --- 不合格 打开弹窗
  handleUnqualified = (itemIndex) => {
    if (!this.state.inspectResult && this.state.headerData.qcStatus === 'ONGOING') {
      notification.warning({
        message: '请先完成检验项',
      });
      return;
    }

    if (this.state.headerData.qcStatus === 'COMPLETED') {
      notification.warning({
        message: '当前状态不可录入不良原因',
      });
      return;
    }

    modal = Modal.open({
      key: 'hg-inspection-judgement-modal',
      title: '不良原因数量',
      className: 'hg-inspection-judgement-modal',
      children: (
        <PickModal
          itemIndex={itemIndex}
          reasons={this.state.badReasonList}
          handleUpdateCount={this.handleUpdateCount}
          handleChange={(value, index) => this.handleChange(value, index)}
          handleCloseModal={this.handleCloseModal}
          handleConfirm={() => this.handleConfirm(itemIndex)}
        />
      ),
      footer: null,
      movable: false,
      closable: true,
    });
  };

  // 判定结果 -- 判定人
  handleOnChange = (value) => {
    const { judgeResults } = this.state;
    judgeResults[2].value = value;
    this.setState({
      judgeResults,
    });
  };

  // 判定结果 -- 合格/不合格
  handleResultChange = (value, title) => {
    const { judgeResults, results, headerData } = this.state;
    switch (title) {
      case '合格':
        if (value <= headerData.batchQty) {
          judgeResults[0].value = value;
          judgeResults[1].value = headerData.batchQty - value;
        }
        break;
      case '不合格':
        if (value <= headerData.batchQty) {
          judgeResults[0].value = headerData.batchQty - value;
          judgeResults[1].value = value;
        }
        break;
      case '合格接收':
        results[0].value = value;
        break;
      case '让步接收':
        if (headerData.qcStatus === 'COMPLETED' && value <= headerData.qcNgQty) {
          results[1].value = value;
          results[2].value = headerData.qcNgQty - value;
        }
        break;
      case '退回':
        if (headerData.qcStatus === 'COMPLETED' && value <= headerData.qcNgQty) {
          results[1].value = headerData.qcNgQty - value;
          results[2].value = value;
        }
        break;
      default:
        break;
    }
    this.setState({
      judgeResults,
      results,
    });
  };

  // 判定结果 -- 备注
  handleRemark = (value, type) => {
    if (type === '判定结果') {
      this.setState({
        remark: value,
      });
    } else {
      this.setState({
        ongoingRemark: value,
      });
    }
  };

  // 返回上一页
  handleBack = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/hg/hg-inspection-judgment',
        query: {
          type: this.props.location.state.type,
        },
      })
    );
    closeTab('/pub/hg/hg-inspection-judgment/execute');
  };

  // 重置
  handleReset = () => {
    const { headerData, inspectionList, judgeResults, results } = this.state;
    if (headerData.qcStatus === 'ONGOING') {
      this.setState({
        inspectionList: inspectionList.map((v) => ({
          ...v,
          lineQualifiedNum: null,
          lineUnqualifiedNum: null,
        })),
        judgeResults: judgeResults.map((v) => ({
          ...v,
          value: null,
        })),
        inspectResult: false,
        remark: '',
      });
    } else if (headerData.qcStatus === 'COMPLETED') {
      this.setState({
        results: results.map((v) => {
          if (v.title === '合格接收') {
            return { ...v };
          }
          return { ...v, value: null };
        }),
        ongoingRemark: '',
      });
    }
  };

  // 提交
  handleSubmit = async () => {
    let params;
    const {
      badReasonList,
      inspectionList,
      headerData,
      judgeResults,
      results,
      remark,
      ongoingRemark,
      inspectResult,
      defaultWorker,
    } = this.state;

    if (!Object.keys(defaultWorker).length) {
      notification.warning({
        message: '请先维护默认员工!',
      });
      return;
    }

    if (
      headerData.qcStatus === 'ONGOING' &&
      inspectResult &&
      judgeResults[0].value !== null &&
      judgeResults[1].value !== null &&
      this.lovDs.current.get('workerName').length
    ) {
      const inspectionDocLineList = []; // 检验项判定

      inspectionList.forEach((ele) => {
        inspectionDocLineList.push({
          inspectionDocLineId: ele.inspectionDocLineId,
          sampleNumber: 'S001',
          resultType: 'JUDGE',
          qcOkQty: ele.lineQualifiedNum,
          qcNgQty: ele.lineUnqualifiedNum,
          inspectorId: headerData.declarerId,
          inspector: headerData.declarer,
          _token: ele._token,
        });
      });

      params = {
        inspectionDoc: {
          inspectionDocId: headerData.inspectionDocId,
          qcResult: 'PASS',
          qcOkQty: judgeResults[0].value,
          qcNgQty: judgeResults[1].value,
          inspector: this.lovDs.current.get('workerName').join(','),
          judgedDate: moment().format(DEFAULT_DATETIME_FORMAT),
          remark,
          qcStatus: headerData.qcStatus,
          // qcNgReasonId: '',
          // qcReason: '',
          inspectionDocLineList,
        },
      };
      const flag = badReasonList.every((v) => Boolean(v.exceptionQty) === false);
      if (!flag) {
        params.inspectionExceptionVoList = badReasonList.filter((v) => Boolean(v.exceptionQty));
      }
      this.submit(params);
    } else if (headerData.qcStatus === 'COMPLETED' && results.every((v) => v.value !== null)) {
      params = [
        {
          inspectionDocId: headerData.inspectionDocId,
          concessionQty: results[1].value, // 让步接收数量
          returnedQty: results[2].value, // 退回数量
          processedDate: moment().format(DEFAULT_DATETIME_FORMAT),
          processorId: headerData.declarerId,
          processor: headerData.declarer,
          processResult: 'accept',
          processRemark: ongoingRemark,
          qcStatus: headerData.qcStatus,
        },
      ];
      this.process(params);
    }
  };

  // 判定检验单
  submit = async (params) => {
    const res = await handleHgJudgeInspectionDoc(params);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '提交成功',
      });
      this.handleBack();
    }
  };

  // 处理检验单
  process = async (params) => {
    const res = await processInspectionNg(params);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '提交成功',
      });
      this.handleBack();
    }
  };

  render() {
    return (
      <div className="hg-inspection-judgement-container">
        <Head />
        <div className="execute-content">
          <div className="left block-content">
            <div className="worker-info">
              <img src={this.state.headerData.fileUrl || defaultAvatarIcon} alt="avatar" />
              <span className="worker">{this.state.headerData.declarerName}</span>
              <span className="time">{this.state.headerData.duration}</span>
            </div>
            <div className="inspection-header">
              <div className="doc-number">
                <span>{this.state.headerData.inspectionDocNum}</span>
              </div>
              <div className="header-content">
                <div className="header-info code">
                  <img src={oddNumber} alt="oddNumber" />
                  <span className="number">
                    {this.state.headerData.sourceDocNum}-{this.state.headerData.sourceDocLineNum}
                  </span>
                </div>
                <div className="header-info">
                  <img src={oddNumber} alt="oddNumber" />
                  <span>{this.state.headerData.itemCode}</span>
                </div>
                <div className="header-info">
                  <img src={itemDesc} alt="itemDesc" />
                  <span>{this.state.headerData.description}</span>
                </div>
                <div className="header-info quantity">
                  <img src={quantity} alt="quantity" />
                  <span>检验数量：{this.state.headerData.batchQty}</span>
                </div>
                {this.state.headerData.type === 'PQC' ? (
                  <div className="header-info">
                    <img src={operationBlue} alt="quantity" />
                    <span>{this.state.headerData.operation}</span>
                  </div>
                ) : (
                  <div className="header-info">
                    <img src={partyNameBlue} alt="quantity" />
                    <span>{this.state.headerData.partyName}</span>
                  </div>
                )}
                <div className="header-info">
                  <img src={timeBlue} alt="timeBlue" />
                  <span>{this.state.headerData.createDate}</span>
                </div>
              </div>
            </div>
            <div className="submit">
              <Button type="default" onClick={this.handleStartInspect}>
                开始检验
              </Button>
            </div>
          </div>
          <div className="right block-content">
            <div className="right-content">
              <Inspection title="检验项判定">
                <Spin spinning={this.state.loading}>
                  {this.state.inspectionList.map((item, index) => {
                    return (
                      <Line
                        key={uuidv4()}
                        {...item}
                        index={index}
                        qcStatus={this.state.headerData.qcStatus}
                        startInspect={this.state.startInspect}
                        handleQualified={(value) => this.handleQualified(value, index)}
                      />
                    );
                  })}
                </Spin>
              </Inspection>
              <Inspection title="判定结果">
                <Result
                  title="判定结果"
                  {...this.state.headerData}
                  lovDs={this.lovDs}
                  remark={this.state.remark}
                  inspectResult={this.state.inspectResult}
                  result={this.state.judgeResults}
                  handleOnChange={this.handleOnChange}
                  handleResultChange={this.handleResultChange}
                  handleRemark={(value) => this.handleRemark(value, '判定结果')}
                  handleBadReason={this.handleUnqualified}
                />
              </Inspection>
              {this.state.headerData.qcStatus === 'COMPLETED' ? (
                <Inspection title="处理结果">
                  <Result
                    title="处理结果"
                    inspectResult={this.state.headerData.qcStatus === 'COMPLETED'}
                    remark={this.state.ongoingRemark}
                    result={this.state.results}
                    handleResultChange={this.handleResultChange}
                    handleRemark={(value) => this.handleRemark(value, '处理结果')}
                  />
                </Inspection>
              ) : null}
            </div>
            <div className="submit">
              <Button type="default" onClick={this.handleBack}>
                退出
              </Button>
              <Button type="default" onClick={this.handleReset}>
                重置
              </Button>
              <Button type="default" onClick={this.handleSubmit}>
                提交
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Execute;
