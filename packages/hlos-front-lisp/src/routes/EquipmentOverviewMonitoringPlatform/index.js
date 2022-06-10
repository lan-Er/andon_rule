/*
 * @Description: 设备总览监控平台
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-07-27 15:20:10
 * @LastEditors: 赵敏捷
 */

import echarts from 'echarts';
import React, { useEffect, useState, useMemo, useCallback, Fragment } from 'react';
import { debounce } from 'lodash';
import uuidv4 from 'uuid/v4';
import { Spin } from 'choerodon-ui/pro';

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LISP } from 'hlos-front/lib/utils/config';
import notification from 'utils/notification';

import Time from './components/Time';
import './style.less';
import ListItem from './components/ListItem';
import prodLineIcon from '../../assets/equipmentOverviewMonitoringPlatform/prodLine.svg';
import workcellIcon from '../../assets/equipmentOverviewMonitoringPlatform/workcell.svg';
import elecIcon from '../../assets/equipmentOverviewMonitoringPlatform/elec.svg';
import closeIcon from '../../assets/equipmentOverviewMonitoringPlatform/close.svg';

const tenantId = getCurrentOrganizationId();

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(0);
  const [standby, setStandby] = useState(0);
  const [breakdown, setBreakdown] = useState(0);
  const [mending, setMending] = useState(0);
  const [selectedRec, setSelectedRec] = useState({});
  const [selectedRecDetail, setSelectedRecDetail] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [fullList, setFullList] = useState([]);
  const [leftOddList, setLeftOddList] = useState([]);
  const [rightEvenList, setRightEvenList] = useState([]);
  const [pieChartContainer, setPieChartContainer] = useState(null);
  const [pieChartInstance, setPieChartInstance] = useState(null);
  const [resizeFunQueue, setResizeRunQueue] = useState([]);

  const time = useMemo(() => <Time className="time" />, []);

  const handleResize = useCallback(
    debounce(() => {
      resizeFunQueue.forEach((fun) => {
        fun();
      });
      const { clientWidth } = document.body;
      pieChartInstance.setOption({
        graphic: {
          elements: [
            {
              type: 'group',
              left: 'center',
              top: 'center',
              children: [
                {
                  type: 'text',
                  top: `{clientWidth / 18}px`,
                  style: {
                    fontSize: clientWidth / 30,
                  },
                },
                {
                  type: 'text',
                  top: `${clientWidth / 20}px`,
                  style: {
                    fontSize: clientWidth / 90,
                  },
                },
              ],
            },
          ],
        },
      });
    }, 500),
    [pieChartInstance]
  );

  const getRecStatusClassName = (rec) => {
    switch (rec?.status) {
      case 'RUNNING':
        return 'item-status-working';
      case 'STANDBY':
        return 'item-status-free';
      case 'BREAKDOWN':
        return 'item-status-down';
      case 'MENDING':
        return 'item-status-repair';
      default:
        return '';
    }
  };

  const handleQueryDetail = useCallback(async () => {
    setLoading(true);
    const { equipmentCode = '' } = selectedRec;
    try {
      await request(`${HLOS_LISP}/v1/${tenantId}/be-equipments/syn-by-manual`, {
        method: 'POST',
      });
    } catch (e) {
      notification.warning({
        message: '数据同步失败',
      });
    }
    const res = await request(`${HLOS_LISP}/v1/${tenantId}/be-equipments/detail`, {
      method: 'GET',
      query: {
        equipmentCode,
        executeLineListFlag: 1,
        parameterLineListFlag: 1,
      },
    });
    setLoading(false);
    // console.log('detail: ', res);
    return res;
  }, [selectedRec]);

  useEffect(() => {
    if (showModal) {
      (async function anonymous() {
        const res = await handleQueryDetail();
        setSelectedRecDetail(res);
      })();
    }
  }, [showModal, handleQueryDetail]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (pieChartContainer && pieChartInstance === null) {
      const pieChart = echarts.init(pieChartContainer);
      const debounceResizeFun = debounce(pieChart.resize, 200);
      setPieChartInstance(pieChart);
      setResizeRunQueue([...resizeFunQueue, debounceResizeFun]);
      const { clientWidth } = document.body;
      pieChart.setOption({
        graphic: {
          elements: [
            {
              type: 'group',
              left: 'center',
              top: 'center',
              children: [
                {
                  type: 'text',
                  left: 'center',
                  top: `{clientWidth / 18}px`,
                  style: {
                    text: '',
                    textAlign: 'center',
                    fill: 'rgb(4, 241, 215)',
                    fontSize: clientWidth / 30,
                    fontFamily: 'LiquidCrystal-ExBold',
                  },
                },
                {
                  type: 'text',
                  left: 'center',
                  top: `${clientWidth / 20}px`,
                  style: {
                    text: '开动率',
                    textAlign: 'center',
                    fill: 'rgba(255,255,255,0.79)',
                    fontSize: clientWidth / 90,
                  },
                },
              ],
            },
          ],
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['70%', '80%'],
            center: ['center', 'center'],
            cursor: 'default',
            hoverAnimation: false, // hover 在扇区上的放大动画效果
            hoverOffset: 0,
            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            color: ['#2AC5A9', '#FF4B4B', '#FBA35C', '#2BC8ED'],
            itemStyle: {
              borderWidth: 8,
              // borderColor: 'rgb(17, 79, 65)',
            },
            tooltip: {
              show: false,
              trigger: 'none',
            },
            data: [
              { value: 32, name: '运行中' },
              { value: 12, name: '故障' },
              { value: 18, name: '维修' },
              { value: 18, name: '空闲' },
            ],
          },
        ],
      });
    }
  }, [pieChartContainer, pieChartInstance, resizeFunQueue]);

  useEffect(() => {
    if (!pieChartInstance) {
      (async function anonymous() {
        setFullList(
          await request(`${HLOS_LISP}/v1/${tenantId}/be-equipments`, {
            method: 'GET',
            query: {
              executeLineListFlag: 1,
              parameterLineListFlag: 1,
            },
          })
        );
      })();
    } else if (fullList?.content?.length) {
      let _running = 0;
      let _standby = 0;
      let _breakdown = 0;
      let _mending = 0;
      // console.log('fullList: ', fullList);
      const seprateList = (fullList?.content || []).reduce(
        (acc, v, i) => {
          switch (v.status) {
            case 'RUNNING':
              _running++;
              break;
            case 'STANDBY':
              _standby++;
              break;
            case 'BREAKDOWN':
              _breakdown++;
              break;
            case 'MENDING':
              _mending++;
              break;
            default:
              break;
          }
          acc[i % 2 === 0 ? 'odd' : 'even'].push(v);
          return acc;
        },
        { odd: [], even: [] }
      );
      const { odd, even } = seprateList;
      setLeftOddList(odd);
      setRightEvenList(even);
      setRunning(_running);
      setStandby(_standby);
      setBreakdown(_breakdown);
      setMending(_mending);
    }
  }, [pieChartInstance, fullList]);

  useEffect(() => {
    if (pieChartInstance) {
      (async function anonymous() {
        const utilizations = await request(
          `${HLOS_LISP}/v1/${tenantId}/be-execute-lines/get-utilization-be`,
          {
            method: 'GET',
          }
        );
        const { utilization = 0 } = utilizations?.[0] || {};
        pieChartInstance.setOption({
          graphic: {
            elements: [
              {
                type: 'group',
                left: 'center',
                top: 'center',
                children: [
                  {
                    type: 'text',
                    left: 'center',
                    style: {
                      // text: '30%',
                      text: `${utilization}%`,
                      // textAlign: 'center',
                      // fill: 'rgb(4, 241, 215)',
                      // // fontSize: 60,
                      // fontFamily: 'LiquidCrystal-ExBold',
                    },
                  },
                  // {
                  //   type: 'text',
                  //   left: 'center',
                  //   top: 80,
                  //   style: {
                  //     text: '开动率',
                  //     textAlign: 'center',
                  //     fill: 'rgba(255,255,255,0.79)',
                  //     // fontSize: 22,
                  //   },
                  // },
                ],
              },
            ],
          },
        });
      })();
    }
  }, [pieChartInstance]);

  return (
    <Fragment>
      <div className={`equipment-overview-monitoring-platform ${showModal ? 'blur' : ''}`}>
        <div className="bg" />
        <div className="wrap">
          <header>
            <span className="title">设备总览监控平台</span>
            <span>{time}</span>
          </header>
          <main className="dashboard-body">
            <div className="dashboard-body-left">
              {leftOddList.map((i) => (
                <ListItem
                  rec={i}
                  key={uuidv4()}
                  onClick={() => {
                    setShowModal(true);
                    setVisibility(true);
                    setSelectedRec(i || {});
                  }}
                />
              ))}
            </div>
            <div className="dashboard-body-center">
              <div className="dashboard-body-center-top">热处理生产车间</div>
              <div
                className="dashboard-body-center-middle"
                ref={(node) => setPieChartContainer(node)}
              />
              <div className="dashboard-body-center-bottom">
                <div className="status-line">
                  <div className="status-line-indicator-working" />
                  <span className="status-line-name">运行中</span>
                  <span className="status-line-value">{running}</span>
                </div>
                <div className="status-line">
                  <div className="status-line-indicator-down" />
                  <span className="status-line-name">故障</span>
                  <span className="status-line-value">{breakdown}</span>
                </div>
                <div className="status-line">
                  <div className="status-line-indicator-repair" />
                  <span className="status-line-name">维修</span>
                  <span className="status-line-value">{mending}</span>
                </div>
                <div className="status-line">
                  <div className="status-line-indicator-free" />
                  <span className="status-line-name">空闲</span>
                  <span className="status-line-value">{standby}</span>
                </div>
              </div>
            </div>
            <div className="dashboard-body-right">
              {rightEvenList.map((i) => (
                <ListItem
                  rec={i}
                  key={uuidv4()}
                  onClick={() => {
                    setShowModal(true);
                    setVisibility(true);
                    setSelectedRec(i || {});
                  }}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
      <div
        className={`modal ${showModal ? 'visible-modal' : 'transparent-modal'} ${
          visibility ? 'modal-visible' : 'modal-hidden'
        } `}
      >
        <div className="modal-content">
          <Spin spinning={loading}>
            <span className="modal-content-title">
              设备详情
              <img
                src={closeIcon}
                alt=""
                onClick={() => {
                  setShowModal(false);
                  setTimeout(() => {
                    setVisibility(false);
                  }, 700);
                }}
              />
            </span>
            <div className="modal-content-wrap">
              <div className="modal-content-wrap-left">
                <div className="item-detail">
                  <span className="item-name">
                    <span>{selectedRecDetail.equipmentName || '-'}</span>
                    <span className={`item-status ${getRecStatusClassName(selectedRec)}`}>
                      {selectedRecDetail.statusMeaning || '-'}
                    </span>
                  </span>
                  <span className="others">
                    <span>WRS-0024X-C</span>
                    <span style={{ color: 'rgb(4, 241, 215)', whiteSpace: 'nowrap' }}>
                      {selectedRecDetail.equipmentType || '-'}
                    </span>
                    <span />
                    <span>
                      <img src={prodLineIcon} alt="" />
                      <span className="other-value">
                        {selectedRecDetail.organizationName || '-'}
                      </span>
                    </span>
                    <span>
                      <img src={workcellIcon} alt="" />
                      <span className="other-value">-</span>
                    </span>
                    <span>
                      <img src={elecIcon} alt="" />
                      <span className="other-value">-</span>
                    </span>
                  </span>
                </div>
                <div className="other-info">
                  <span className="item-name">
                    <span>工艺参数</span>
                  </span>
                  <div className="item-part">
                    {selectedRecDetail?.parameterLineList?.map(
                      ({ parameterDesc, parameterValue }) => (
                        <span className="param-item" key={uuidv4()}>
                          <span className="param-name">{parameterDesc}</span>
                          <span className="param-value">{parameterValue}</span>
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-content-wrap-right" />
            </div>
          </Spin>
        </div>
      </div>
    </Fragment>
  );
}
