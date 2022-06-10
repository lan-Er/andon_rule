/*
 * @module-:车间晨会看板
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-11-11 13:50:36
 * @LastEditTime: 2021-01-08 14:52:51
 * @copyright: Copyright (c) 2018,Hand
 */
import { connect } from 'dva';
import { Tabs, Spin } from 'choerodon-ui';
import { withRouter } from 'react-router-dom';
import React, { useEffect, useState, useMemo } from 'react';
import { DataSet, Form, Select, Tooltip, CheckBox } from 'choerodon-ui/pro';

import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import style from './index.module.less';
import codeConfig from '@/common/codeConfig';
import DashbordHeader from '../../common/DashboardHeader';

const codeList = codeConfig();
const TabPane = Tabs && Tabs.TabPane;
let isFirst = true;
function WorkshopMorningMeetingBoard({ history, location, dispatch }) {
  const queryDS = useDataSet(
    () =>
      new DataSet({
        autoCreate: true,
        fields: [
          {
            name: 'department',
            type: 'string',
            lookupCode: `${codeList.ztDepartment}`,
            label: '部门',
            required: true,
          },
          {
            name: 'projectName',
            type: 'string',
            lookupCode: `${codeList.ztOverview}`, // 1未解决， 0已解决
            defaultValue: '1',
            label: '总览',
          },
        ],
        events: {
          update: ({ name, value }) => {
            handleChangeName({ name, value });
          },
        },
      }),
    WorkshopMorningMeetingBoard
  );
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState({ department: '', projectName: '1' });
  const oldParams = useMemo(() => queryParams, [queryParams]);
  const getLocationUpdate = useMemo(() => location, [location]);
  const [safeJson, setSafeJson] = useState([]); // 安全
  const [actionPlan, setActionPlanList] = useState([]); // 行动计划
  const [fiveSJson, setFiveJson] = useState([]); // 5s
  const [qualityJson, setQualityJson] = useState([]); // 质量
  const [productJson, setProductJson] = useState([]); // 生产
  const [efficiencyJson, setEfficiencyJson] = useState([]); // 效率
  const [reasonableAdviceJson, setReasonableAdviceJson] = useState([]); // 合理化建议
  const [signTableJson, setSignTableJsonString] = useState([]); // 签到
  const [incompleteActionPlan, setIncompleteActionPlan] = useState([]); // 未完成行动计划
  const [showAction, setShowAction] = useState(true);

  useEffect(() => {
    const departmentData = localStorage.getItem('meetingBoardDepartment')
      ? JSON.parse(localStorage.getItem('meetingBoardDepartment'))
      : '';
    if (departmentData) {
      queryDS.current.set('department', departmentData.department);
      setQueryParams({
        department: departmentData.department,
        projectName: 1,
      });
      handleQuery({ department: departmentData.department, issueStatus: 1 });
    } else {
      notification.error({ message: '请在配置界面上传EXCEL文件' });
    }
  }, [getLocationUpdate]);

  async function handleQuery({ department, issueStatus }) {
    setLoading(true);
    const res = await dispatch({
      type: 'workshopMorningMeeting/getWorkShopMorningBoard',
      payload: { department, issueStatus },
    });
    if (res) {
      const {
        safeJsonString,
        actionPlanList,
        fiveSJsonString,
        qualityJsonString,
        productJsonString,
        efficiencyJsonString,
        reasonableAdviceJsonString,
        signTableJsonString,
        incompleteActionPlanJsonString,
      } = res;
      const newSafeJson = safeJsonString ? JSON.parse(safeJsonString) : [];
      const newActionPlanList = [...actionPlanList];
      const newFiveSJsonString = fiveSJsonString ? JSON.parse(fiveSJsonString) : [];
      const newQualityJson = qualityJsonString ? JSON.parse(qualityJsonString) : [];
      const newProductJson = productJsonString ? JSON.parse(productJsonString) : [];
      const newEfficiencyJson = efficiencyJsonString ? JSON.parse(efficiencyJsonString) : [];
      const newReasonableAdvice = reasonableAdviceJsonString
        ? JSON.parse(reasonableAdviceJsonString)
        : [];
      const newSignTableJsonString = signTableJsonString ? JSON.parse(signTableJsonString) : [];
      const newIncompleteActionPlan = incompleteActionPlanJsonString
        ? JSON.parse(incompleteActionPlanJsonString)
        : [];
      setSafeJson(newSafeJson);
      setActionPlanList(newActionPlanList);
      setFiveJson(newFiveSJsonString);
      setQualityJson(newQualityJson);
      setProductJson(newProductJson);
      setEfficiencyJson(newEfficiencyJson);
      setReasonableAdviceJson(newReasonableAdvice);
      setSignTableJsonString(newSignTableJsonString);
      setIncompleteActionPlan(newIncompleteActionPlan);
    }
    setLoading(false);
  }
  /**
   *接收ds变化
   *
   * @param {*} propsDs
   */
  function handleChangeName(propsDs) {
    isFirst = false;
    const queryParam = Object.assign(oldParams, { [propsDs.name]: propsDs.value });
    const { department, projectName } = queryParam;
    if (department) {
      queryDS.current.set('department', department);
    } else if (projectName) {
      queryDS.current.set('projectName', Number(projectName));
    }
    setQueryParams({
      department,
      projectName,
    });
    if (!isFirst) {
      handleQuery({ department, issueStatus: projectName });
    }
  }

  /**
   * @description: 切换行动计划和未完成行动计划展示
   * @param {*} action
   * @return {*}
   */
  function handleChangeAction(action) {
    if (action === 'yes') {
      setShowAction(true);
    } else {
      setShowAction(false);
    }
  }
  /**
   * @description: 改变选择框
   * @param {*} value
   * @param {*} id
   * @return {*}
   */
  async function handleChangeSelect(value, id) {
    const { department } = oldParams;
    const issueStatus = value ? 1 : 0;
    const updateStatus = value ? 0 : 1;
    setLoading(true);
    const res = await dispatch({
      type: 'workshopMorningMeeting/updateWorkShopMorningStatus',
      payload: { issueStatus: updateStatus, id },
    });
    setLoading(false);
    if (res) {
      handleQuery({ department, issueStatus });
    }
  }
  return (
    <div className={style['my-work-shop-morning-meeting']}>
      <DashbordHeader
        title="中天宇光SIM2"
        history={history}
        closePath="/cs/workshop-morning-meeting-board/item"
      />
      <div className={style['center-sky-list-left-and-right']}>
        <section className={style['my-content-left']}>
          <div className={style['my-left-top']}>
            <span className={style['my-title-content']}>安全</span>
            <div className={style['safety-list']}>
              <div>
                <span className={style['cumulative-safety-title']}>累计安全生产天数</span>
                <span className={style['cumulative-safety-number']}>
                  {safeJson[2] && Number(safeJson[2]?.targetValue)}
                </span>
              </div>
              <div>
                <table border="1">
                  <tbody>
                    <tr>
                      <td />
                      <td>{safeJson[0]?.accidentType}</td>
                      <td>{safeJson[1]?.accidentType}</td>
                    </tr>
                    <tr>
                      <td>目标值</td>
                      <td>{safeJson[0] && Number(safeJson[0]?.targetValue)}</td>
                      <td>{safeJson[1] && Number(safeJson[1]?.targetValue)}</td>
                    </tr>
                    <tr>
                      <td>实际值</td>
                      <td>{safeJson[0] && Number(safeJson[0]?.realValue)}</td>
                      <td>{safeJson[1] && Number(safeJson[1]?.realValue)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={style['my-left-two']}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ul className={style['my-left-two-banner']}>
                <li onClick={() => handleChangeAction('yes')}>
                  <span>行动计划{showAction ? <i /> : null}</span>
                </li>
                <li onClick={() => handleChangeAction('no')}>
                  <span>未完成的行动计划{!showAction ? <i /> : null}</span>
                </li>
              </ul>
              <Form dataSet={queryDS} columns={2} style={{ flex: '1', lineHeight: '12px' }}>
                <Select name="projectName" />
                <Select name="department" />
              </Form>
            </div>
            <div className={style['my-action-plan-title']}>
              <span>提出人</span>
              <span>提出时间</span>
              <span>问题描述</span>
              <span>行动计划</span>
              <span>负责人</span>
              <span>目标时间</span>
              {showAction ? <span>&nbsp;</span> : null}
            </div>
            <div className={style['my-action-plan-list']}>
              <ul>
                {showAction &&
                  actionPlan &&
                  actionPlan.map((item) => {
                    return (
                      <li key={item.id}>
                        <span>{item.submitWorker}</span>
                        <span>{item.submitDate}</span>
                        <span>{item.description}</span>
                        <span>{item.actionPlan}</span>
                        <span>{item.dutyWorker}</span>
                        <span>{item.targetDate}</span>
                        <span>
                          <CheckBox
                            checked={queryDS.current.get('projectName') !== '1'}
                            onChange={(value) => handleChangeSelect(value, item.id)}
                          />
                        </span>
                      </li>
                    );
                  })}
                {!showAction &&
                  incompleteActionPlan &&
                  incompleteActionPlan.map((item) => {
                    return (
                      <li key={item.id}>
                        <span>{item.submitName}</span>
                        <span>{item.submitDate}</span>
                        <span>{item.issueDescription}</span>
                        <span>{item.actionPlan}</span>
                        <span>{item.dutyWorker}</span>
                        <span>{item.targetDate}</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className={style['my-left-three']}>
            <span className={style['my-title-content']}>5S检查结果公布表</span>
            <div className={style['my-test-result-title']}>
              <span>序号</span>
              <span>车间</span>
              <span>安全</span>
              <span>质量</span>
              <span>现场</span>
              <span>加分</span>
              <span>总得分</span>
            </div>
            <div className={style['my-test-result-list']}>
              <ul>
                {fiveSJson &&
                  fiveSJson.map((item) => {
                    return (
                      <li key={item.num}>
                        <span>{Number(item.num)}</span>
                        <span>{item.workshop}</span>
                        <span>{Number(item.safe)}</span>
                        <span>{Number(item.quality)}</span>
                        <span>{Number(item.site)}</span>
                        <span>{Number(item.addScore)}</span>
                        <span>
                          {Number(item.safe) +
                            Number(item.quality) +
                            Number(item.site) +
                            Number(item.addScore)}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className={style['my-left-bottom']}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="质量" key="1">
                <table border="1" className={style['my-left-bottom-quality']}>
                  <tbody>
                    <tr>
                      <td />
                      {qualityJson &&
                        qualityJson.map((item) => {
                          return <td key={item.workshop}>{item.workshop}</td>;
                        })}
                    </tr>
                    <tr>
                      <td>目标值</td>
                      {qualityJson &&
                        qualityJson.map((item, index) => {
                          return (
                            <td key={index.toString()}>
                              {item.targetValue ? Number(item.targetValue) : 0}
                            </td>
                          );
                        })}
                    </tr>
                    <tr>
                      <td>实际值</td>
                      {qualityJson &&
                        qualityJson.map((item, index) => {
                          return (
                            <td key={index.toString()}>
                              {item.realValue ? Number(item.realValue) : 0}
                            </td>
                          );
                        })}
                    </tr>
                  </tbody>
                </table>
              </TabPane>
              <TabPane tab="生产" key="2">
                <table border="1" className={style['production-table-list']}>
                  <tbody>
                    <tr>
                      <td>车间</td>
                      {productJson &&
                        productJson.map((item, index) =>
                          item.workshop ? <td key={index.toString()}>{item.workshop}</td> : null
                        )}
                    </tr>
                    <tr>
                      <td>在产合同</td>
                      {productJson &&
                        productJson.map((item, index) =>
                          item.workshop ? (
                            <td key={index.toString()}>{Number(item.inProductContract)}</td>
                          ) : null
                        )}
                    </tr>
                    <tr>
                      <td>计划完成</td>
                      {productJson &&
                        productJson.map((item, index) =>
                          item.workshop ? (
                            <td key={index.toString()}>{Number(item.planComplete)}</td>
                          ) : null
                        )}
                    </tr>
                    <tr>
                      <td>实际完成</td>
                      {productJson &&
                        productJson.map((item, index) =>
                          item.workshop ? (
                            <td key={index.toString()}>
                              {Number(item.realComplete).toFixed(3, 10) * 100}%
                            </td>
                          ) : null
                        )}
                    </tr>
                    <tr>
                      <td>完成率</td>
                      {productJson &&
                        productJson.map((item, index) =>
                          item.workshop ? (
                            <td key={index.toString()}>
                              {Number(item.completeRate).toFixed(3, 10) * 100}%
                            </td>
                          ) : null
                        )}
                    </tr>
                  </tbody>
                </table>
              </TabPane>
              <TabPane tab="效率" key="3">
                <table className={style['my-left-bottom-effect']} border="1">
                  <tbody>
                    <tr>
                      <td />
                      {efficiencyJson &&
                        efficiencyJson.map((item, j) => {
                          return <td key={j.toString()}>{item.workshop}</td>;
                        })}
                    </tr>
                    <tr>
                      <td>目标值</td>
                      {efficiencyJson &&
                        efficiencyJson.map((item, j) => {
                          return (
                            <td key={j.toString()}>
                              {Number(item.targetValue).toFixed(3, 10) * 100}%
                            </td>
                          );
                        })}
                    </tr>
                    <tr>
                      <td>实际值</td>
                      {efficiencyJson &&
                        efficiencyJson.map((item, j) => {
                          return (
                            <td key={j.toString()}>
                              {Number(item.realValue).toFixed(3, 10) * 100}%
                            </td>
                          );
                        })}
                    </tr>
                  </tbody>
                </table>
              </TabPane>
            </Tabs>
          </div>
        </section>
        <section className={style['my-content-right']}>
          <div className={style['my-right-top']}>
            <span className={style['my-title-content']}>合理化建议提出名单</span>
            <div className={style['reasonable-suggestion-title']}>
              <span>姓名</span>
              <span>提出车间</span>
              <span>累计条数</span>
              <span>被采纳条数</span>
              <span>合理化建议内容</span>
              <span>采纳结果</span>
              <span>采纳/驳回人</span>
              <span>时间</span>
            </div>
            <div className={style['reasonable-suggestion-list']}>
              <ul>
                {reasonableAdviceJson &&
                  reasonableAdviceJson.map((item, index) => {
                    return (
                      <li key={index.toString()}>
                        <span>{item.name}</span>
                        <span>{item.reportWorkshop}</span>
                        <span>{Number(item.cumulativeNum)}</span>
                        <span>{Number(item.adoptedNum)}</span>
                        <span>
                          <Tooltip title={item.reasonableAdviceContent}>
                            <span>{item.reasonableAdviceContent}</span>
                          </Tooltip>
                        </span>
                        <span>{item.adoptedResult}</span>
                        <span>{item.adopter}</span>
                        <span>{item.time}</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className={style['my-right-bottom']}>
            <span className={style['my-title-content']}>SIM签到表</span>
            <div className={style['my-sim-sign-in']}>
              <table border="1">
                <tbody>
                  <tr>
                    <td>日期/部门</td>
                    {signTableJson &&
                      signTableJson.map((item) => {
                        return <td key={item.dateDepartment}>{Number(item.dateDepartment)}</td>;
                      })}
                  </tr>
                  <tr>
                    <td>质检部</td>
                    {signTableJson &&
                      signTableJson.map((item, index) => {
                        return <td key={index.toString()}>{item.inspectionDepartment}</td>;
                      })}
                  </tr>
                  <tr>
                    <td>办公室</td>
                    {signTableJson &&
                      signTableJson.map((item, index) => {
                        return <td key={index.toString()}>{item.office}</td>;
                      })}
                  </tr>
                  <tr>
                    <td>技术部</td>
                    {signTableJson &&
                      signTableJson.map((item, index) => {
                        return <td key={index.toString()}>{item.techDepartment}</td>;
                      })}
                  </tr>
                  <tr>
                    <td>销售部</td>
                    {signTableJson &&
                      signTableJson.map((item, index) => {
                        return <td key={index.toString()}>{item.saleDepartment}</td>;
                      })}
                  </tr>
                  <tr>
                    <td>采购部</td>
                    {signTableJson &&
                      signTableJson.map((item, index) => {
                        return <td key={index.toString()}>{item.purchaseDepartment}</td>;
                      })}
                  </tr>
                  <tr>
                    <td>仓储部</td>
                    {signTableJson &&
                      signTableJson.map((item, index) => {
                        return <td key={index.toString()}>{item.warehouseDepartment}</td>;
                      })}
                  </tr>
                  <tr>
                    <td>生产部</td>
                    {signTableJson &&
                      signTableJson.map((item, index) => {
                        return <td key={index.toString()}>{item.productDepartment}</td>;
                      })}
                  </tr>
                  <tr>
                    <td>绕线干燥</td>
                    {signTableJson &&
                      signTableJson.map((item, index) => {
                        return <td key={index.toString()}>{item.winding}</td>;
                      })}
                  </tr>
                  <tr>
                    <td>机加铁芯</td>
                    {signTableJson &&
                      signTableJson.map((item, index) => {
                        return <td key={index.toString()}>{item.machining}</td>;
                      })}
                  </tr>
                  <tr>
                    <td>器身总装</td>
                    {signTableJson &&
                      signTableJson.map((item, index) => {
                        return <td key={index.toString()}>{item.finalAssembly}</td>;
                      })}
                  </tr>
                  <tr>
                    <td>加工件</td>
                    {signTableJson &&
                      signTableJson.map((item, index) => {
                        return <td key={index.toString()}>{item.machiningParts}</td>;
                      })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
      {loading ? (
        <div className={style['my-loading-yes-no']}>
          <Spin tip="Loading..." />
        </div>
      ) : null}
    </div>
  );
}
export default connect()(withRouter(WorkshopMorningMeetingBoard));
