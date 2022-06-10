import React from 'react';
import { Button, TextField, Spin, Tooltip } from 'choerodon-ui/pro';

import { closeTab } from 'utils/menuTab';
import notification from 'utils/notification';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import uuidv4 from 'uuid/v4';
import {
  queryHgInspectionGroup,
  handleHgJudgeInspectionDoc,
  startInspection,
} from '@/services/hgModelInsecptionService';

import Head from './components/head.js';
import Line from './components/line.js';
import Footer from './components/footer.js';
import Inspection from './components/inspection.js';
import oddNumber from '../../assets/InspectionJudgment/odd-number.svg';
import oddNumber2 from './assets/odd-number2.svg';
import department from './assets/department.svg';
import worker from './assets/worker.svg';
import itemDesc from '../../assets/InspectionJudgment/item-desc.svg';
import timeBlue from '../../assets/InspectionJudgment/time-blue.svg';
import './index.less';

class HgExecute extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      headerData: {},
      startJudge: false,
      loading: false,
      inspectionList: [],
      processRemark: null,
      processResult: null,
    };
  }

  async componentDidMount() {
    this.setState({
      headerData: this.props.location.state,
    });
    await this.handleQueryHgInspectionGroup();
  }

  // 试模检行查询
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
            badRemark: null,
            lineResult: null,
          })),
        });
      }
      this.setState({
        loading: false,
      });
    });
  };

  // 试模检验判定
  handleJudge = (lineJudge, index) => {
    const inspectionList = this.state.inspectionList.slice();
    const { headerData } = this.state;
    if (!this.state.startJudge && headerData.qcStatus === 'NEW') {
      notification.warning({
        message: '请先开始检验!',
      });
      return;
    }

    inspectionList[index].lineResult = lineJudge;
    this.setState({
      inspectionList,
    });
  };

  // 行 --- 不合格备注
  handleRemarkChange = (value, index) => {
    const inspectionList = this.state.inspectionList.slice();
    inspectionList[index].badRemark = value;
    this.setState({
      inspectionList,
    });
  };

  // 处理结果 - 接收/退回
  handleProcess = (result) => {
    const { headerData } = this.state;
    if (headerData.qcStatus !== 'ONGOING') {
      notification.warning({
        message: '当前状态不可进行处理!',
      });
      return;
    }

    this.setState({
      processResult: result,
    });
  };

  // 处理结果 --- 备注
  handleProcessRemark = (value) => {
    this.setState({
      processRemark: value,
    });
  };

  // 退出
  handleClose = () => {
    closeTab('/pub/hg/hg-model-inspection/execute');
  };

  // 开始检验
  handleStart = async () => {
    const { headerData } = this.state;

    if (headerData.qcStatus === 'ONGOING') {
      return;
    }

    const params = {
      inspectionDocIds: [headerData.inspectionDocId],
      inspector: headerData.workerName,
      inspectorId: headerData.workerId,
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
        startJudge: true,
        headerData: { ...this.state.headerData, qcStatus: 'ONGOING' },
      });
    }
  };

  // 重置
  handleReset = () => {
    const inspectionList = this.state.inspectionList.slice();
    this.setState({
      inspectionList: inspectionList.map((v) => ({ ...v, badRemark: null, lineResult: null })),
      processRemark: null,
    });
  };

  // 提交
  handleSubmit = () => {
    let params;
    const { headerData, inspectionList, processRemark, processResult } = this.state;
    if (headerData.qcStatus === 'ONGOING' && inspectionList.every((v) => v.lineResult)) {
      const inspectionDocLineList = []; // 检验项判定

      inspectionList.forEach((ele) => {
        inspectionDocLineList.push({
          inspectionDocLineId: ele.inspectionDocLineId,
          sampleNumber: 'S001',
          resultType: 'JUDGE',
          qcResult: ele.lineResult,
          inspectorId: headerData.workerId,
          inspector: headerData.workerName,
          lineRemark: ele.badRemark,
          _token: ele._token,
        });
      });

      params = {
        inspectionDoc: {
          inspectionDocId: headerData.inspectionDocId,
          qcResult: processResult === 'accept' ? 'PASS' : 'FAILED',
          qcOkQty: processResult === 'accept' ? 1 : 0,
          qcNgQty: processResult === 'return' ? 1 : 0,
          inspectorId: headerData.workerId,
          inspector: headerData.workerName,
          judgedDate: moment().format(DEFAULT_DATETIME_FORMAT),
          remark: processRemark,
          qcStatus: headerData.qcStatus,
          inspectionDocLineList,
        },
      };
      this.submit(params);
    } else {
      notification.warning({
        message: '不满足提交条件',
      });
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
      this.handleClose();
    }
  };

  render() {
    const { headerData, loading, processResult, processRemark } = this.state;
    return (
      <div className="hg-model-execute-container">
        <Head />
        <div className="execute-content">
          <div className="left block-content">
            <div className="worker-info">
              <Tooltip title={headerData.inspectionDocNum}>
                <span className="worker">{headerData.inspectionDocNum}</span>
              </Tooltip>
              <span className="time">{headerData.qcStatusMeaning}</span>
            </div>
            <div className="inspection-header">
              <div className="header-content">
                <div className="header-info">
                  <img src={oddNumber} alt="oddNumber" />
                  <span>{headerData.sourceDocNum}</span>
                </div>
                <div className="header-info">
                  <img src={oddNumber2} alt="oddNumber2" />
                  <span>{headerData.itemCode}</span>
                </div>
                <div className="header-info">
                  <img src={itemDesc} alt="itemDesc" />
                  <span>{headerData.description}</span>
                </div>
                <div className="header-info">
                  <img src={department} alt="department" />
                  <span>{headerData.organizationName}</span>
                </div>
                <div className="header-info">
                  <img src={worker} alt="worker" />
                  <span>{headerData.declarer}</span>
                </div>
                <div className="header-info time-kinds">
                  <img src={timeBlue} alt="timeBlue" />
                  <span>{headerData.createDate}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right block-content">
            <div className="right-content">
              <Inspection title="试模检验">
                <Spin spinning={loading}>
                  {this.state.inspectionList.map((item, index) => {
                    return (
                      <Line
                        key={uuidv4()}
                        {...item}
                        index={index}
                        status={headerData.qcStatus}
                        startInspect={this.state.startJudge}
                        handleJudge={(lineJudge) => this.handleJudge(lineJudge, index)}
                        handleRemarkChange={(value) => this.handleRemarkChange(value, index)}
                      />
                    );
                  })}
                </Spin>
              </Inspection>
              <Inspection title="判定结果">
                <div className="handle-result">
                  <div className="submit">
                    <Button
                      className={processResult === 'accept' ? 'active-button' : 'result-button'}
                      type="default"
                      icon="check"
                      onClick={() => this.handleProcess('accept')}
                    >
                      接收OK
                    </Button>
                    <Button
                      className={processResult === 'return' ? 'active-button' : 'result-button'}
                      type="default"
                      icon="keyboard_return"
                      onClick={() => this.handleProcess('return')}
                    >
                      退回NG
                    </Button>
                  </div>
                  <div className="remark">
                    <TextField
                      value={processRemark}
                      disabled={headerData.qcStatus === 'NEW'}
                      placeholder="请输入备注"
                      onChange={this.handleProcessRemark}
                    />
                  </div>
                </div>
              </Inspection>
            </div>
          </div>
        </div>
        <div className="footer-buttons">
          <Footer
            onClose={this.handleClose}
            onStart={this.handleStart}
            onReset={this.handleReset}
            onSubmit={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}

export default HgExecute;
