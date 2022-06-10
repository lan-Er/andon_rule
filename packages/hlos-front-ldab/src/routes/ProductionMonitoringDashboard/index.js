/*
 * @Description: 生产监控看板
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-06-09 13:57:28
 * @LastEditors: Please set LastEditors
 */
import echarts from 'echarts';
import { Spin } from 'choerodon-ui';
import { withRouter } from 'react-router-dom';
import notification from 'utils/notification';
import React, { useEffect, useState, useMemo, useCallback } from 'react';

import moment from 'moment';
import { connect } from 'dva';
import noticeImg from 'hlos-front/lib/assets/icons/notice.svg';
import amountLeft from 'hlos-front/lib/assets/icons/amount-left.svg';
import amountCenter from 'hlos-front/lib/assets/icons/amount-center.svg';
import amountRight from 'hlos-front/lib/assets/icons/amount-right.svg';
// import logoLeft from 'hlos-front/lib/assets/baidu.png';
// import logoRight from 'hlos-front/lib/assets/onestep.png';
import Time from './components/Time';
import BodyTitle from './components/BodyTitle';
import styles from './index.module.less';
import VirtualScrollList from './components/VirtualScrollList';
import { debounce } from './components/utils';

let uid = 0;

let timer = null;
let timerRight = null;
let timerLeft = null;
let timerTotalAmount = null;
function ProductionMonitoringDashboard(props) {
  const timeComponent = useMemo(() => <Time style={{ fontSize: '14px' }} />, []);
  const [preLoading, setPreLoading] = useState(false);
  const [scaleRatio, setScaleRatio] = useState(1);
  const [pieChartContainer, setPieChartContainer] = useState(null);
  const [lineChartContainer, setLineChartContainer] = useState(null);
  const [pieChartInstance, setPieChartInstance] = useState(null);
  const [lineChartInstance, setLineChartInstance] = useState(null);
  const [resizeFunQueue, setResizeRunQueue] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [totalAmountMonth, setTotalAmountMonth] = useState({ PRODUCT_SUM: 0, mark: '当日' });
  const [activeTotalAmount, setActiveTotalAmount] = useState(0);
  const [productionOverview, setProductionOverview] = useState([]);
  const [productionOverviewActive, setProductionOverviewActive] = useState(0);
  const [andonMonitoring, setAndonMonitoring] = useState([]);
  const [totalAbnormal, setTotalAbnormal] = useState(0);
  const [rightScrollList, setRightScrollList] = useState([]);
  const [rightScrollListPage, setRightScrollListPage] = useState({});
  const [qualityControlList, setQualityControlList] = useState({
    okPercent: 0,
    ngPercent: 0,
    qcOkQty: 0,
    batchQty: 1,
    concessionQty: 0,
    qcNgQty: 0,
    lines: [],
  });
  const [proLineMove, setProLineMove] = useState('WIP');
  const [useLoaclDataList, setUseLocalDataList] = useState(false);
  // 质量监控查询
  function getQualityControl() {
    return new Promise((resolve, reject) => {
      const { dispatch } = props;
      dispatch({
        type: 'productionMonitoringDashboardModel/getQualityControl',
        payload: '',
      })
        .then((res) => {
          if (res?.okPercent) {
            setQualityControlList(res);
          }
          resolve(res);
        })
        .catch((rej) => reject(rej));
    });
  }

  // 产量统计
  function getOutputStatistics() {
    return new Promise((resolve, reject) => {
      const { dispatch } = props;
      dispatch({
        type: 'productionMonitoringDashboardModel/getOutputStatistics',
        payload: '',
      })
        .then((res) => {
          if (res && res[0]) {
            const lineChartDataOld = res;
            const lineChartDataNew = lineChartDataOld.map((item) => [
              moment(item && item.executeTimeStr).format('YYYY-MM-DD'),
              item.completedQty,
            ]);
            setLineChartData(lineChartDataNew);
            resolve(res);
          } else {
            setLineChartData([moment().format('YYYY-MM-DD'), '']);
            resolve([]);
          }
        })
        .catch((err) => reject(err));
    });
  }
  // 当月生产完成总量部分
  function getTotalProductionCompleted() {
    return new Promise((resolve, reject) => {
      const { dispatch } = props;
      dispatch({
        type: 'productionMonitoringDashboardModel/getTotalProductionCompleted',
        payload: { summaryType: 2 },
      })
        .then((res) => {
          if (res) {
            const newTotal = [];
            for (let i = 0; i < res.length; i++) {
              if (i === 0) {
                newTotal.push({ ...res[i], mark: '当日' });
              } else if (i === 1) {
                newTotal.push({ ...res[i], mark: '当周' });
              } else {
                newTotal.push({ ...res[i], mark: '当月' });
              }
            }
            setTotalAmountMonth(newTotal);
          } else {
            setTotalAmountMonth([{ mark: '当日' }]);
          }
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }
  // 生产概况
  function getMosOverView() {
    return new Promise((resolve, reject) => {
      const { dispatch } = props;
      dispatch({
        type: 'productionMonitoringDashboardModel/getMosOverView',
        payload: '',
      })
        .then((res) => {
          setProductionOverview(res);
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  // 安灯异常
  function getAndonsMonitoring() {
    return new Promise((resolve, reject) => {
      const { dispatch } = props;
      dispatch({
        type: 'productionMonitoringDashboardModel/getAndonsMonitoring',
        payload: '',
      })
        .then((res) => {
          if (res) {
            const { CLOSED_ANDON, RESPONSED_ANDON, TRIGGERED_ANDON, TOTAL_ABNORMAL } = res;
            const newAndonMonitoring = [
              {
                name: '已关闭',
                value: CLOSED_ANDON,
                color: '#2AC5A9',
              },
              {
                name: '已响应',
                value: RESPONSED_ANDON,
                color: '#FF4B4B',
              },
              {
                name: '已触发',
                value: TRIGGERED_ANDON,
                color: '#FBA35C',
              },
            ];
            setTotalAbnormal(TOTAL_ABNORMAL);
            setAndonMonitoring(newAndonMonitoring);
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  }

  // 安灯异常-已触发数据
  function getAndonJournalsTriggered(page = 0, size = 50) {
    return new Promise((resolve, reject) => {
      const { dispatch } = props;
      dispatch({
        type: 'productionMonitoringDashboardModel/getAndonJournalsTriggered',
        payload: { page, size },
      })
        .then((res) => {
          const { content } = res;
          const newContent = content.map((item) => Object.assign(item, { key: item.andonId }));
          setRightScrollList(newContent);
          setRightScrollListPage(res);
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }
  const handleResize = useCallback(
    debounce(() => {
      const container = document.getElementsByClassName('ant-layout-content')?.[0];
      if (container) {
        // const { width: containerWidth } = container.getBoundingClientRect();
        const { offsetWidth } = window;
        setScaleRatio(1366 / offsetWidth);
      }
      resizeFunQueue.forEach((fun) => {
        fun();
      });
    }, 500),
    [pieChartInstance, lineChartInstance]
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scaleRatio]);

  function fullScreen() {
    const el = document.documentElement;
    const rfs =
      el.requestFullScreen ||
      el.webkitRequestFullScreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullScreen;

    if (rfs) {
      rfs.call(el);
    } else if (typeof window.ActiveXObject !== 'undefined') {
      const { ActiveXObject } = window;
      const wscript = new ActiveXObject('WScript.Shell');
      if (wscript != null) {
        wscript.SendKeys('{F11}');
      }
    }
  }

  useEffect(() => {
    const localDataList = JSON.parse(localStorage.getItem('ProductionMonitoringDashboardList'));
    if (localDataList) {
      setUseLocalDataList(true);
      clearInterval(timerRight);
      clearInterval(timerLeft);
      setPreLoading(true);
      setQualityControlList(localDataList.qualityControlList);
      setTotalAmountMonth(localDataList.totalAmountMonth);
      setLineChartData(localDataList.lineChartContainer);
      setProductionOverview(localDataList.productionOverviewList);
      const {
        CLOSED_ANDON,
        RESPONSED_ANDON,
        TRIGGERED_ANDON,
        TOTAL_ABNORMAL,
      } = localDataList.anDon;
      const newAndonMonitoring = [
        {
          name: '已关闭',
          value: CLOSED_ANDON,
          color: '#2AC5A9',
        },
        {
          name: '已响应',
          value: RESPONSED_ANDON,
          color: '#FF4B4B',
        },
        {
          name: '已触发',
          value: TRIGGERED_ANDON,
          color: '#FBA35C',
        },
      ];
      setTotalAbnormal(TOTAL_ABNORMAL);
      setAndonMonitoring(newAndonMonitoring);
      setRightScrollList(localDataList.rightScrollList);
      setProLineMove(localDataList.proLineMove);
    } else {
      getDataList();
      setUseLocalDataList(false);
    }
    return () => handleClearList();
  }, []);

  // 当月当周当月
  useEffect(() => {
    clearInterval(timerTotalAmount);
    timerTotalAmount = setInterval(() => {
      if (totalAmountMonth && totalAmountMonth.length > 0) {
        if (activeTotalAmount + 1 >= totalAmountMonth.length) {
          setActiveTotalAmount(0);
          getTotalProductionCompleted();
        } else if (totalAmountMonth.length <= 1) {
          setActiveTotalAmount(0);
        } else {
          setActiveTotalAmount(1 + activeTotalAmount);
        }
      }
    }, 15000);
  }, [totalAmountMonth, activeTotalAmount]);

  useEffect(() => {
    handleSetInterval();
  }, [productionOverviewActive, useLoaclDataList, productionOverview]);

  // 清除副作用
  function handleClearList() {
    clearInterval(timer);
    clearInterval(timerRight);
    clearInterval(timerLeft);
    clearInterval(timerTotalAmount);
    localStorage.removeItem('ProductionMonitoringDashboardList');
  }
  // 定时更新生产概况
  function handleSetInterval() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (useLoaclDataList) {
        if (productionOverview.length === 1) {
          setProductionOverviewActive(0);
        } else if (productionOverviewActive + 1 >= productionOverview.length) {
          setProductionOverviewActive(0);
        } else {
          setProductionOverviewActive(1 + productionOverviewActive);
        }
      } else if (!useLoaclDataList && productionOverview.length > 0) {
        if (
          productionOverviewActive + 1 >= productionOverview.length &&
          productionOverview.length !== 0
        ) {
          getOutputStatistics();
          getMosOverView().then((res) => {
            setProductionOverview(res);
            setProductionOverviewActive(0);
          });
        } else if (productionOverview.length === 1 || productionOverview.length === 0) {
          getOutputStatistics();
          getMosOverView().then((res) => {
            setProductionOverview(res);
            setProductionOverviewActive(0);
          });
        } else {
          setProductionOverviewActive(1 + productionOverviewActive);
        }
      }
    }, 5000);
  }

  // 右侧数据在数据没有超出滚动时候每隔1min刷新一次
  useEffect(() => {
    if (!useLoaclDataList) {
      handleRightDataUpdate();
    } else {
      clearInterval(timerRight);
    }
  }, [rightScrollList, useLoaclDataList]);

  // 右侧没有滚动时候数据请求
  function handleRightDataUpdate() {
    clearInterval(timerRight);
    timerRight = setInterval(() => {
      getAndonJournalsTriggered();
      getAndonsMonitoring();
    }, 60000);
  }

  // 左侧数据在数据没有超出滚动时候每隔1min刷新一次
  useEffect(() => {
    if (!useLoaclDataList) {
      handleLeftDataUpdate();
    } else {
      clearInterval(timerLeft);
    }
  }, [qualityControlList, useLoaclDataList]);

  // 左侧没有滚动时候数据请求
  function handleLeftDataUpdate() {
    clearInterval(timerLeft);
    timerLeft = setInterval(() => {
      getQualityControl();
    }, 60000);
  }

  function getDataList() {
    return Promise.all([
      getQualityControl(),
      getOutputStatistics(),
      getTotalProductionCompleted(),
      getMosOverView(),
      getAndonsMonitoring(),
      getAndonJournalsTriggered(),
    ])
      .then((res) => {
        window.console.log(res, 'all');
        setPreLoading(true);
        notification.success({ message: '加载完成' });
      })
      .catch((err) => {
        window.console.log(err, 'all出错');
      });
  }
  // initial loading resize
  useEffect(() => {
    handleResize();
  }, [handleResize, resizeFunQueue]);

  useEffect(() => {
    if (pieChartContainer && pieChartInstance === null && andonMonitoring.length > 0) {
      const pieChart = echarts.init(pieChartContainer);
      const debounceResizeFun = debounce(pieChart.resize, 200);
      setPieChartInstance(pieChart);
      setResizeRunQueue([...resizeFunQueue, debounceResizeFun]);
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
                  style: {
                    text: totalAbnormal,
                    textAlign: 'center',
                    fill: '#fff',
                    fontSize: 50 * 0.8,
                  },
                },
                {
                  type: 'text',
                  left: 'center',
                  top: 50,
                  style: {
                    text: '总异常',
                    textAlign: 'center',
                    fill: '#fff',
                    fontSize: 14,
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
            radius: ['60%', '80%'],
            center: ['center', 'center'],
            cursor: 'default',
            hoverAnimation: false, // hover 在扇区上的放大动画效果
            hoverOffset: 0,
            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            color: ['#2AC5A9', '#FF4B4B', '#FBA35C'],
            itemStyle: {
              borderWidth: 8,
              borderColor: 'rgb(11, 28, 68)',
            },
            tooltip: {
              show: false,
              trigger: 'none',
            },
            data: andonMonitoring,
          },
        ],
      });
    }
    if (lineChartContainer && lineChartInstance === null && lineChartData.length > 0) {
      const lineChart = echarts.init(lineChartContainer);
      const debounceResizeFun = debounce(lineChart.resize, 200);
      setLineChartInstance(lineChart);
      setResizeRunQueue([...resizeFunQueue, debounceResizeFun]);
      lineChart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#8181A5',
            },
          },
          axisLabel: {
            fontSize: 12,
          },
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '30%'],
          axisLine: {
            lineStyle: {
              color: '#8181A5',
            },
          },
          axisLabel: {
            fontSize: 12,
          },
        },
        grid: {
          left: '15%',
        },
        series: [
          {
            name: '模拟数据',
            type: 'line',
            smooth: true,
            symbolSize: 0,
            // sampling: 'average',
            itemStyle: {
              color: '#8ec6ad',
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(42,197,169,0.05)',
                },
                {
                  offset: 1,
                  color: 'rgba(42,197,169,0.40)',
                },
              ]),
            },
            data: lineChartData,
          },
        ],
      });
    }
  }, [
    pieChartContainer,
    pieChartInstance,
    totalAbnormal,
    andonMonitoring,
    lineChartContainer,
    lineChartData,
    lineChartInstance,
    resizeFunQueue,
    scaleRatio,
  ]);

  function handleGoHome() {
    const { history } = props;
    history.push('/');
    // window.location.reload();
  }

  /**
   *左侧数据到达顶部，发起新请求
   *
   */
  function handleLeftTop() {
    // console.log('左侧到头了');
    if (!useLoaclDataList) {
      getQualityControl();
    }
  }
  function handleRightTop() {
    // console.log('右侧到头了');
    if (!useLoaclDataList) {
      getAndonsMonitoring();
      const { number, totalPages } = rightScrollListPage;
      if (number + 1 > totalPages) {
        getAndonJournalsTriggered(0, 50);
      } else {
        getAndonJournalsTriggered(number + 1, 50);
      }
    }
  }
  return (
    <div className={styles.wrap}>
      <div
        className={styles['production-monitoring-dashboard']}
        style={{
          width: '100%',
          transform: `scale(${scaleRatio})`,
        }}
      >
        <div className={styles.header}>
          <div className={styles['title-block']}>
            {/* <img src={logoLeft} alt="baidu-left" className={styles['logo-left']} /> */}
            <span style={{ cursor: 'pointer' }} onClick={handleGoHome}>
              一步制造云生产监控看板
            </span>
            <span onClick={fullScreen}>{timeComponent}</span>
            {/* <img src={logoRight} alt="logo-right" className={styles['logo-right']} /> */}
          </div>
          <div className={styles['announcement-block']}>
            <div className={styles.announcement}>
              <img alt="announcement" src={noticeImg} />
              &nbsp;&nbsp;
              <span>产线动态：{proLineMove}</span>
            </div>
          </div>
        </div>
        {preLoading ? (
          <div className={styles.body}>
            <div className={styles['body-left']}>
              <BodyTitle title="质量监控" />
              <div className={styles['percent-tab']}>
                <div className={styles.qualified}>
                  <span className={styles.top}>合格：</span>
                  <span className={styles.middle}>
                    {parseFloat(qualityControlList.okPercent * 100).toFixed(1)}%
                  </span>
                  {/* <span className={styles.bottom}>标准：23%</span> */}
                </div>
                <div className={styles.unqualified}>
                  <span className={styles.top}>不合格：</span>
                  <span className={styles.middle}>
                    {parseFloat(qualityControlList.ngPercent * 100).toFixed(1)}%
                  </span>
                  {/* <span className={styles.bottom}>标准：23%</span> */}
                </div>
                <div className={styles.other}>
                  <span className={styles.top}>检验完成率：</span>
                  <span className={styles.middle}>
                    {qualityControlList.completedPercent
                      ? parseFloat(qualityControlList.completedPercent * 100).toFixed(2)
                      : 0}
                    %
                  </span>
                  {/* <span className={styles.bottom}>标准：23%</span> */}
                </div>
              </div>
              <VirtualScrollList
                items={qualityControlList && qualityControlList.lines}
                handleUpdateData={handleLeftTop}
                itemType="productionMonitorDashboardLeftList"
                coordinate="left"
              />
            </div>
            <div className={styles['body-center']}>
              <BodyTitle
                title={`${
                  totalAmountMonth[activeTotalAmount] && totalAmountMonth[activeTotalAmount].mark
                }生产完成总量`}
                right={`计划完成总量：${
                  totalAmountMonth[activeTotalAmount].PLAN_PRODUCT
                    ? totalAmountMonth[activeTotalAmount]?.PLAN_PRODUCT
                    : 0
                }`}
              />
              <div className={styles['body-center-top']}>
                <div className={styles['total-amount']}>
                  {Array.from(
                    `${
                      totalAmountMonth[activeTotalAmount]?.PRODUCT_SUM
                        ? totalAmountMonth[activeTotalAmount].PRODUCT_SUM
                        : 0
                    }`.replace(/(?=(\B)(\d{3})+$)/g, ',')
                  ).map((i) => (
                    <span key={uid++} className={i === ',' ? '' : styles.number}>
                      {i}
                    </span>
                  ))}
                  <span className={styles['my-sum-percentage']}>
                    {Number(
                      totalAmountMonth[activeTotalAmount] &&
                        totalAmountMonth[activeTotalAmount].PLAN_PRODUCT
                    ) !== 0 &&
                    Number(
                      totalAmountMonth[activeTotalAmount] &&
                        totalAmountMonth[activeTotalAmount].PRODUCT_SUM
                    )
                      ? parseFloat(
                          (totalAmountMonth[activeTotalAmount]?.PRODUCT_SUM /
                            totalAmountMonth[activeTotalAmount]?.PLAN_PRODUCT) *
                            100
                        ).toFixed(2)
                      : 0}
                    %
                  </span>
                </div>
                <div className={styles['respectively-amount']}>
                  <div className={styles['left-amount']}>
                    <div className={styles.icon}>
                      <img src={amountLeft} alt="amountLeft" />
                    </div>
                    <div className={styles.count}>
                      {totalAmountMonth[activeTotalAmount]?.NEW_MO_SUM}
                    </div>
                    <div className={styles.desc}>新建订单</div>
                  </div>
                  <span className={styles['split-line']} />
                  <div className={styles['center-amount']}>
                    <div className={styles.icon}>
                      <img src={amountCenter} alt="amountCenter" />
                    </div>
                    <div className={styles.count}>
                      {totalAmountMonth[activeTotalAmount]?.RUNNING_MO_SUM}
                    </div>
                    <div className={styles.desc}>在制订单</div>
                  </div>
                  <span className={styles['split-line']} />
                  <div className={styles['right-amount']}>
                    <div className={styles.icon}>
                      <img src={amountRight} alt="amountRight" />
                    </div>
                    <div className={styles.count}>
                      {totalAmountMonth[activeTotalAmount]?.COMPLETED_MO_SUM}
                    </div>
                    <div className={styles.desc}>完成订单</div>
                  </div>
                </div>
              </div>
              <div className={styles['body-center-bottom']}>
                <div className={styles.left}>
                  <BodyTitle title="产量统计" />
                  <div
                    className={styles['line-chart-container']}
                    ref={(node) => setLineChartContainer(node)}
                  />
                </div>
                <div className={styles.right}>
                  <BodyTitle
                    title="生产概况"
                    right={`第${
                      productionOverview.length > 0
                        ? productionOverviewActive + 1
                        : productionOverviewActive
                    }个 共${productionOverview.length}个`}
                  />
                  <section>
                    <div className={styles.top}>
                      <div className={styles.item}>
                        <div className={styles.key}>物料信息：</div>
                        <div className={styles.value}>
                          {productionOverview
                            ? productionOverview[productionOverviewActive]?.itemCode
                            : null}
                        </div>
                      </div>
                      <div className={styles.item}>
                        <div className={styles.key}>订单：</div>
                        <div className={styles.value}>
                          {productionOverview
                            ? productionOverview[productionOverviewActive]?.moNum
                            : null}
                        </div>
                      </div>
                      <div className={styles.item}>
                        <div className={styles.key}>产线：</div>
                        <div className={styles.value}>
                          {productionOverview
                            ? productionOverview[productionOverviewActive]?.prodLine
                            : null}
                        </div>
                      </div>
                      <div className={styles.item}>
                        <div className={styles.key}>订单数量：</div>
                        <div className={styles.value}>
                          {productionOverview
                            ? productionOverview[productionOverviewActive]?.demandQty
                            : null}
                        </div>
                      </div>
                    </div>
                    <div className={styles.middle}>
                      <div className={styles.item}>
                        <div className={styles.key}>合格数量</div>
                        <div className={styles.indicator} />
                        <div className={styles.value}>
                          {productionOverview
                            ? productionOverview[productionOverviewActive]?.okQty
                            : null}
                        </div>
                      </div>
                      <div className={styles.item}>
                        <div className={styles.key}>报废数量</div>
                        <div className={styles.indicator} />
                        <div className={styles.value}>
                          {productionOverview
                            ? productionOverview[productionOverviewActive]?.scrappedQty
                            : null}
                        </div>
                      </div>
                    </div>
                    <div className={styles.bottom}>
                      <div className={styles.item}>
                        <div className={styles.key}>计划开工：</div>
                        <div className={styles.value}>
                          {productionOverview
                            ? productionOverview[productionOverviewActive]?.planStartDate
                            : null}
                        </div>
                      </div>
                      <div className={styles.item}>
                        <div className={styles.key}>计划完工：</div>
                        <div className={styles.value}>
                          {productionOverview
                            ? productionOverview[productionOverviewActive]?.planEndDate
                            : null}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <div className={styles['body-right']}>
              <BodyTitle title="安灯异常监控" />
              <div className={styles['chart-wrap']}>
                <div
                  className={styles['pie-chart-container']}
                  ref={(node) => setPieChartContainer(node)}
                />
                <div className={styles['emulator-legends']}>
                  {andonMonitoring.map(({ name, value, color }) => (
                    <span className={styles.legend} key={uid++}>
                      <div
                        className={styles['legend-color']}
                        style={{
                          backgroundColor: color,
                        }}
                      />
                      <span className={styles['legend-name']}>{name}</span>
                      <span className={styles['legend-value']}>{value}</span>
                    </span>
                  ))}
                </div>
              </div>
              <VirtualScrollList
                items={rightScrollList}
                handleUpdateData={handleRightTop}
                itemType="productionMonitorDashboardRightList"
                coordinate="right"
              />
            </div>
          </div>
        ) : (
          <div className={styles['production-monitoring-loading']}>
            <Spin size="large" tip="Loading" />
          </div>
        )}
      </div>
    </div>
  );
}

export default connect()(withRouter(ProductionMonitoringDashboard));
