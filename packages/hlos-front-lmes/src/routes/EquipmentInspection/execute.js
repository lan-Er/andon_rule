/*
 * @Description: 设备点检执行页面
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-18 11:21:16
 */

import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, TextArea, TextField, Row, Col } from 'choerodon-ui/pro';
// import uuidv4 from 'uuid/v4';
import { closeTab } from 'utils/menuTab';
import notification from 'utils/notification';
import logo from 'hlos-front/lib/assets/icons/logo.svg';
import code from 'hlos-front/lib/assets/icons/odd-number.svg';
import name from 'hlos-front/lib/assets/icons/item-icon2.svg';
import org from 'hlos-front/lib/assets/icons/org.svg';
import prodline from 'hlos-front/lib/assets/icons/prodline.svg';
import workcell from 'hlos-front/lib/assets/icons/workcell.svg';
import plantime from 'hlos-front/lib/assets/icons/clock.svg';
import insnum from 'hlos-front/lib/assets/icons/quantity.svg';
import group from 'hlos-front/lib/assets/icons/inspection-group.svg';
import { getEquInspectionDetail, equInsQualified } from '@/services/equipmentInspection';
import { Clock } from './clock.js';
import './index.less';

// 头部组件
function Head() {
  return (
    <div className="header">
      <img src={logo} alt="logo" />
      <Clock />
    </div>
  );
}

// 执行页面-点检项判定组件
function InspectionJudge(props) {
  return (
    <>
      <div className="ins-judge-item">
        {props.data.map((item, index) => {
          return item.resultType === 'NUMBER' ? (
            <Row key={item.taskInspectionId} style={{ width: '100%' }} className="item-lines">
              <Col span={1}>{index + 1}.</Col>
              <Col span={5} className="item-name">
                <span>{item.inspectionItemName}</span>
                <span>
                  {item.defaultLclAccept ? '[' : '('}
                  {item.defaultLcl} -- {item.defaultUcl}
                  {item.defaultUclAccept ? ']' : ')'}
                </span>
              </Col>
              <Col span={8} className="item-value">
                <input
                  className={`${props.readOnly ? 'inspection-value-disabled' : ''} ${
                    props.requiredCheck || item.inspectionValue
                      ? 'inspection-value'
                      : 'inspection-value required-item-input-no'
                  }`}
                  required
                  placeholder="请输入检验值"
                  style={{ height: '56px', width: '100%' }}
                  value={item.inspectionValue}
                  disabled={props.readOnly}
                  onChange={(newVal, oldVal) =>
                    props.handleNumberChange(newVal, oldVal, item, index)
                  }
                  onFocus={() => {
                    const inputDom = document.getElementsByClassName('inspection-value')[
                      item.valueIndex
                    ];
                    inputDom.style.boxShadow = '0 0 2px 1px #29bece';
                    inputDom.style.borderColor = '#4fd2db';
                    inputDom.style.backgroundColor = 'rgb(254, 255, 230)';
                  }}
                  onBlur={(e) => {
                    const inputDom = document.getElementsByClassName('inspection-value')[
                      item.valueIndex
                    ];
                    inputDom.style.boxShadow = 'none';
                    inputDom.style.borderColor = 'rgb(203, 204, 184)';
                    inputDom.style.backgroundColor = 'rgb(254, 255, 230)';
                    if (!e.target.value && e.target.value !== 0) {
                      inputDom.style.borderColor = '#d50000';
                      inputDom.style.backgroundColor = 'rgb(252, 235, 235)';
                    }
                  }}
                />
              </Col>
              <Col span={10} style={{ textAlign: 'center' }}>
                <TextField
                  placeholder="请输入备注"
                  style={{
                    width: '90%',
                    height: '56px',
                  }}
                  value={item.inspectionRemark}
                  onChange={(newVal, oldVal) =>
                    props.handleNumberRemark(newVal, oldVal, item, index)
                  }
                  disabled={props.readOnly}
                />
              </Col>
            </Row>
          ) : (
            <Row key={item.taskInspectionId} style={{ width: '100%' }} className="item-lines">
              <Col span={1}>{index + 1}.</Col>
              <Col span={5} className="item-name">
                <span>{item.inspectionItemName}</span>
              </Col>
              <Col
                span={8}
                className={props.readOnly ? 'item-button item-button-disabled' : 'item-button'}
              >
                <Button
                  className={item.itemJudge === 'itemPass' ? 'qualified-active' : 'qualified'}
                  icon="check"
                  onClick={() => props.handleJudgeClick(item, index, 'itemPass')}
                  disabled={props.readOnly}
                >
                  合格
                </Button>
                <Button
                  className={item.itemJudge === 'itemNoPass' ? 'unqualified-active' : 'unqualified'}
                  icon="close"
                  onClick={() => props.handleJudgeClick(item, index, 'itemNoPass')}
                  disabled={props.readOnly}
                >
                  不合格
                </Button>
              </Col>
              <Col span={10} style={{ textAlign: 'center' }}>
                <TextField
                  className={`${
                    props.requiredCheck || item.inspectionRemark ? '' : 'required-item-no'
                  } ${props.readOnly ? 'readonly-input' : ''}`}
                  required={!item.inspectionResult}
                  placeholder="请输入不合格原因"
                  style={
                    item.inspectionResult ? { display: 'none' } : { width: '90%', height: '56px' }
                  }
                  value={item.inspectionRemark}
                  onChange={(newVal, oldVal) =>
                    props.handleJudgeRemark(newVal, oldVal, item, index)
                  }
                  disabled={props.readOnly}
                />
              </Col>
            </Row>
          );
        })}
      </div>
    </>
  );
}

@connect()
export default class EquInsExecute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inspectionData: {}, // 点检任务详情数据
      equipmentInsItems: [], // 点检项数据
      totalElements: 0, // 点检项目数量
      buttonActive: true, // 合格/不合格按钮是否选择
      inspectionRemark: '', // 点检备注
      readOnly: false, // 是否只读
      requiredCheck: true, // 必填校验是否通过
    };
  }

  async componentDidMount() {
    await this.getDetailData();
  }

  getDetailData = async () => {
    const { state } = this.props.location;
    const resp = await getEquInspectionDetail({ taskId: state.taskId });
    const arr = [];
    if (resp.taskInspectionList) {
      let indexNum = -1;
      resp.taskInspectionList.forEach((v) => {
        if (v.resultType !== 'NUMBER') {
          arr.push({
            ...v,
            // itemJudge: v.inspectionResult ? 'itemPass' : 'itemNoPass',
            itemJudge: 'itemPass',
            inspectionResult: v.inspectionResult,
          });
        } else {
          const index = v.inspectionValue ? v.inspectionValue.indexOf('.') : 0;
          indexNum += 1;
          arr.push({
            ...v,
            inspectionValue: v.inspectionValue
              ? v.inspectionValue.slice(0, index + 7)
              : v.inspectionValue,
            valueIndex: indexNum,
          });
        }
      });
    }
    this.setState({
      inspectionData: resp,
      equipmentInsItems: arr,
      totalElements: arr.length,
      readOnly: resp.taskStatus === 'COMPLETED',
      buttonActive: resp.inspectedResult || this.state.buttonActive,
    });
  };

  handleChangeClass = () => {
    this.setState({
      buttonActive: !this.state.buttonActive,
    });
  };

  handleRemarkChange = (newVal) => {
    this.setState({
      inspectionRemark: newVal,
    });
  };

  handleNumberChange = (newVal, oldVal, record, listIndex) => {
    let { value } = newVal.target;
    value = value.replace(/[\u4e00-\u9fa5]+/g, '');
    value = value.replace(/[^\d.-]/g, '');
    value = value.replace(/^\./g, '');
    value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    // eslint-disable-next-line
    value = value.replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-');
    value = value.replace(/([0-9]+\.[0-9]{6})[0-9]*/, '$1');
    const equipmentInsItems = this.state.equipmentInsItems.slice();
    let inspectionResult = true; // 合格
    if (
      (!record.defaultLclAccept && value === parseFloat(record.defaultLcl)) ||
      (!record.defaultUclAccept && value === parseFloat(record.defaultUcl)) ||
      value < record.defaultLcl ||
      value > record.defaultUcl
    ) {
      inspectionResult = false;
    }
    const lineParams = {
      inspectionValue: value,
      inspectionResult,
    };
    equipmentInsItems[listIndex] = {
      ...equipmentInsItems[listIndex],
      ...lineParams,
    };
    this.setState({
      equipmentInsItems,
    });
  };

  handleNumberRemark = (newVal, oldVal, record, listIndex) => {
    const equipmentInsItems = this.state.equipmentInsItems.slice();
    const lineParams = {
      inspectionRemark: newVal,
    };
    equipmentInsItems[listIndex] = {
      ...equipmentInsItems[listIndex],
      ...lineParams,
    };
    this.setState({
      equipmentInsItems,
    });
  };

  // Judge类型 选择是否合格
  handleJudgeClick = (record, listIndex, type) => {
    const equipmentInsItems = this.state.equipmentInsItems.slice();
    const lineParams = {
      itemJudge: type,
      inspectionResult: type === 'itemPass',
    };
    equipmentInsItems[listIndex] = {
      ...equipmentInsItems[listIndex],
      ...lineParams,
    };
    this.setState({
      equipmentInsItems,
    });
  };

  // Judge类型 备注
  handleJudgeRemark = (newVal, oldVal, record, listIndex) => {
    this.handleNumberRemark(newVal, oldVal, record, listIndex);
  };

  handleBack = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/lmes/equipment-inspection/list',
      })
    );
    closeTab('/pub/lmes/equipment-inspection/execute');
  };

  handleSubmit = async () => {
    const { inspectionData, equipmentInsItems, inspectionRemark, buttonActive } = this.state;
    const arr = [];
    equipmentInsItems.forEach((v) => {
      arr.push({ ...v, remark: v.inspectionRemark });
    });
    let flag = true;
    arr.forEach((v) => {
      if (v.resultType === 'NUMBER') {
        if (!v.inspectionValue && v.inspectionValue !== 0) {
          flag = false;
        }
      }
      if (v.resultType === '1' || v.resultType === 'JUDGE') {
        if (!v.inspectionResult && !v.inspectionRemark) {
          flag = false;
        }
      }
    });
    this.setState({ requiredCheck: flag });
    if (!flag) {
      notification.warning({
        message: '有必填项未填写',
      });
      return;
    }
    const params = {
      taskId: this.props.location.state.taskId,
      workerId: this.props.location.state.worker.workerId,
      inspectedResult: buttonActive,
      remark: inspectionRemark,
      _token: inspectionData._token,
      objectVersionNumber: inspectionData.objectVersionNumber,
      taskInspectionList: arr,
    };
    const res = await equInsQualified(params);
    if (res.taskId) {
      notification.success({
        message: '提交成功',
      });
      this.handleBack();
    }
  };

  render() {
    return (
      <div className="equins-execute-container">
        <Head />
        <div className="execute-content">
          <div className="left block-content">
            <div className="ins-info">
              <span className="num">{this.state.inspectionData.taskNum}</span>
              <span className="status">{this.state.inspectionData.taskStatusMeaning}</span>
            </div>
            <div className="inspection-header">
              <div className="header-content">
                <div className="header-info">
                  <img src={code} alt="code" />
                  <span>{this.state.inspectionData.resourceCode}</span>
                </div>
                <div className="header-info">
                  <img src={name} alt="name" />
                  <span>{this.state.inspectionData.resourceName}</span>
                </div>
                <div className="header-info">
                  <img src={org} alt="org" />
                  <span>{this.state.inspectionData.equipmentOrganizationName}</span>
                </div>
                <div className="header-info">
                  <img src={prodline} alt="prodline" />
                  <span>{this.state.inspectionData.produceLineName}</span>
                </div>
                <div className="header-info">
                  <img src={workcell} alt="workcell" />
                  <span>{this.state.inspectionData.workcellName}</span>
                </div>
                <div className="header-info">
                  <img src={plantime} alt="plantime" />
                  <span>{this.state.inspectionData.creationDate}</span>
                </div>
              </div>
              <div
                className={
                  this.state.readOnly
                    ? 'left-header-button left-header-button-disabled'
                    : 'left-header-button'
                }
              >
                <Button
                  className={this.state.buttonActive ? 'qualified-active' : 'qualified'}
                  icon="check"
                  onClick={this.handleChangeClass}
                  disabled={this.state.readOnly}
                >
                  合格
                </Button>
                <Button
                  className={!this.state.buttonActive ? 'unqualified-active' : 'unqualified'}
                  icon="close"
                  onClick={this.handleChangeClass}
                  disabled={this.state.readOnly}
                >
                  不合格
                </Button>
              </div>
              <div className="header-input">
                <TextArea
                  style={{ marginTop: '10px' }}
                  placeholder="请输入备注"
                  onChange={this.handleRemarkChange}
                  value={this.state.inspectionData.remark}
                  disabled={this.state.readOnly}
                />
              </div>
            </div>
          </div>
          <div className="right block-content">
            <div className="sample-header">
              <div className="sample-quantity sample-header-info">
                <img src={insnum} alt="insnum" />
                <span className="title">点检项目数:</span>
                <span className="value">{this.state.totalElements}</span>
              </div>
              <div className="inspection-group sample-header-info">
                <img src={group} alt="group" />
                <span className="title">检验组:</span>
                <span className="value">
                  {this.state.equipmentInsItems[0]
                    ? this.state.equipmentInsItems[0].inspectionGroupCode
                    : ''}
                </span>
              </div>
            </div>
            <div className="right-content">
              {
                <InspectionJudge
                  // key={uuidv4()}
                  data={this.state.equipmentInsItems}
                  readOnly={this.state.readOnly}
                  requiredCheck={this.state.requiredCheck}
                  handleNumberChange={(newVal, oldVal, record, listIndex) =>
                    this.handleNumberChange(newVal, oldVal, record, listIndex)
                  }
                  handleNumberRemark={(newVal, oldVal, record, listIndex) =>
                    this.handleNumberRemark(newVal, oldVal, record, listIndex)
                  }
                  handleJudgeClick={(record, listIndex, type) =>
                    this.handleJudgeClick(record, listIndex, type)
                  }
                  handleJudgeRemark={(newVal, oldVal, record, listIndex) =>
                    this.handleJudgeRemark(newVal, oldVal, record, listIndex)
                  }
                />
              }
              <div className="submit">
                <Button onClick={this.handleBack}>退出</Button>
                {!this.state.readOnly && <Button onClick={this.handleSubmit}>提交</Button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
