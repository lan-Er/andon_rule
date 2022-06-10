/**
 * @Description: 设备监控
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-08-19 16:36:05
 */

import React, { Fragment, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import echarts from 'echarts';
import { connect } from 'dva';
import { Tabs, Divider } from 'choerodon-ui';
import { DataSet, Lov, Progress, Modal } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { queryLovData } from 'hlos-front/lib/services/api';
import { getResponse } from 'hzero-front/lib/utils/utils';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { debounce } from '@/utils/index';
import codeConfig from '@/common/codeConfig';
import './index.less';
import RedAndon from './assets/red-andon.svg';
import YellowAndon from './assets/yellow-andon.svg';
import { equipmentMonitorDSConfig } from '../../stores/equipmentMonitorDS';

const { TabPane } = Tabs;
const modalKey = Modal.key();
const intlPrefix = 'lmes.equipmentMonitor';
const { lmesEquipmentMonitor } = codeConfig.code;

function EquipmentMonitor({ dispatch, filterChange }) {
  const ds = useMemo(() => new DataSet(equipmentMonitorDSConfig()), []);
  const [filterData, setFilterData] = useState({}); // 筛选条件
  const [filterOptionsValid, setFilterOptionsValid] = useState(false); // 筛选是否有效
  const statusChartRef = useRef(null); // 设备当前状态
  const [statusChartInstance, setStatusChartInstance] = useState(null);
  // const [statusData, setStatusData] = useState([]);
  const [checkObj, setCheckObj] = useState({}); // 设备点检进度
  const [tabKey, setTabKey] = useState('TRIGGERED'); // 设备安灯tabKey 默认待处理状态
  const [andonData, setAndonData] = useState([]); // 设备安灯数据
  const variousStatusChartRef = useRef(null); // 各类设备状态
  const [variousStatusChartInstance, setVariousStatusChartInstance] = useState(null);
  const [mapData, setMapData] = useState([]); // 设备地图数据
  // const [loading, setLodaing] = useState(false); // 页面加载

  // 设备综合效率 文档未说明 采用demo值74展示
  function drawCharts() {
    const processChart = echarts.init(document.getElementById('process-chart'));
    const processoption = {
      series: [
        {
          type: 'gauge',
          detail: { formatter: '{value}%' },
          data: [{ value: 74 }],
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    processChart.setOption(processoption);
  }

  useEffect(() => {
    // setLodaing(true);
    // drawCharts();
    async function queryDefaultFactory() {
      const res = await queryLovData({ lovCode: lmesEquipmentMonitor.factory, defaultFlag: 'Y' });
      if (getResponse(res)) {
        if (res.content[0]) {
          ds.current.set('factoryObj', {
            meOuId: res.content[0].meOuId,
            meOuCode: res.content[0].meOuCode,
            meOuName: res.content[0].meOuName,
          });
          handleDSUpdate();
        }
      }
    }
    queryDefaultFactory();
    const handleDSUpdate = debounce(validateDS, 500);
    ds.addEventListener('update', handleDSUpdate);
    return () => {
      ds.removeEventListener('update', handleDSUpdate);
    };
  }, [ds, dispatch, validateDS]);

  useEffect(() => {
    validateDS();
  }, [validateDS]);

  // 校验DS -- 校验筛选条件的必输性
  const validateDS = useCallback(async () => {
    setFilterData(ds.current);
    const dsValid = await ds.validate(false, false);
    setFilterOptionsValid(dsValid);
    if (dsValid) {
      dispatch({
        type: 'equipmentMonitor/toggleFilterChange',
      }).then(() => {
        setTimeout(() => {
          dispatch({
            type: 'equipmentMonitor/toggleFilterChange',
          });
        });
      });
    }
  }, [ds, dispatch]);

  useEffect(() => {
    if (filterChange && filterOptionsValid) {
      // setLodaing(true);
      setTimeout(() => handleQuery());
    }
  }, [filterChange, filterOptionsValid, handleQuery]);

  // 初始化图表
  useEffect(() => {
    let debounceStatusResizeFun;
    let debounceVariousStatusResizeFun;
    const { current: statusChartContainer } = statusChartRef;
    const { current: variousStatusChartContainer } = variousStatusChartRef;
    if (statusChartContainer) {
      const statusChart = echarts.init(statusChartContainer);
      setStatusChartInstance(statusChart);
      debounceStatusResizeFun = debounce(statusChart.resize, 200);
      statusChart.setOption({
        legend: {
          orient: 'vertical',
          top: 100,
          right: 0,
          itemWidth: 8,
          itemHeight: 8,
          icon: 'circle',
          textStyle: {
            rich: {
              display: 'flex',
              a: {
                width: 50,
                fontSize: 12,
                color: '#868FA4',
                padding: [0, 0, 0, 5],
              },
              b: {
                flex: 1,
                display: 'block',
                fontSize: 18,
                color: '#595959',
                padding: [0, 0, 0, 10],
                align: 'right',
                textAlign: 'right',
              },
            },
          },
        },
        series: [
          {
            type: 'pie',
            radius: '70%',
            center: ['36%', '50%'], // 距离左右，上下距离的百分比
            labelLine: false,
            roseType: 'radius',
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay() {
              return Math.random() * 200;
            },
          },
        ],
        color: ['#FF4B4B', '#FBA35C', '#2AC5A9'],
      });
      window.addEventListener('resize', debounceStatusResizeFun);
    }
    if (variousStatusChartContainer) {
      const variousStatusChart = echarts.init(variousStatusChartContainer);
      setVariousStatusChartInstance(variousStatusChart);
      debounceVariousStatusResizeFun = debounce(variousStatusChart.resize, 200);
      variousStatusChart.setOption({
        legend: {
          data: ['运行中', '维护', '故障'],
        },
        grid: {
          left: 16,
          top: 15,
          right: 44,
          bottom: 28,
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          min: 0,
          max: 20,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F0F3F6',
              width: 1,
              type: 'dashed',
            },
          },
          axisLine: false,
          axisLabel: {
            show: true,
            fontSize: 12,
            color: '#868FA4',
          },
        },
        yAxis: {
          type: 'category',
          barWidth: 20,
          splitLine: false,
          axisLine: false,
          axisLabel: {
            show: true,
            fontSize: 14,
            color: '#333',
          },
        },
        series: [
          {
            name: '运行中',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#2AC5A9',
              },
            },
            barWidth: 20,
          },
          {
            name: '维护',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#FBA35C',
              },
            },
            barWidth: 20,
          },
          {
            name: '故障',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#FF4B4B',
              },
            },
            barWidth: 20,
          },
        ],
      });
      window.addEventListener('resize', debounceVariousStatusResizeFun);
    }
    return () => {
      window.removeEventListener('resize', debounceStatusResizeFun);
      window.removeEventListener('resize', debounceVariousStatusResizeFun);
    };
  }, [statusChartRef, variousStatusChartRef]);

  useEffect(() => {
    handleQuery(tabKey);
  }, [handleQuery, tabKey]);

  // 查询
  const handleQuery = useCallback(
    (value) => {
      if (filterOptionsValid === false) {
        return;
      }
      const payload = {
        page: 0,
        size: 10,
        organizationId: filterData.get('meOuId'),
        prodLineId: filterData.get('prodLineId'),
        currentStatus: tabKey,
      };
      if (value) {
        // setLodaing(false);
        _handleQuery('queryEquipmentAndon');
      } else {
        _handleQuery('queryEquipmentStatus');
        _handleQuery('queryEquipmentCheckRate');
        _handleQuery('queryEquipmentAndon');
        _handleQuery('queryEquipmentTypeStatus');
        _handleQuery('queryEquipmentMap');
      }
      async function _handleQuery(actionName) {
        const res = await dispatch({
          type: `equipmentMonitor/${actionName}`,
          payload,
        });
        if (res) {
          if (actionName === 'queryEquipmentCheckRate') {
            setCheckObj(res);
            return;
          }
          if (actionName === 'queryEquipmentAndon') {
            setAndonData(res);
            return;
          }
          if (actionName === 'queryEquipmentMap') {
            const mapArr = [];
            res.forEach((v, index) => {
              if (index === 0) {
                mapArr.push({
                  ...v,
                  equList: [
                    {
                      equipmentId: v.equipmentId,
                      equipmentCode: v.equipmentCode,
                      equipmentName: v.equipmentName,
                      equipmentStatus: v.equipmentStatus,
                      equipmentStatusMeaning: v.equipmentStatusMeaning,
                      creationDate: v.creationDate,
                      workcellName: v.workcellName,
                    },
                  ],
                });
                return;
              }
              let existFlag = false;
              mapArr.forEach((mv, mindex) => {
                if (v.prodLineCode === mv.prodLineCode) {
                  mapArr[mindex].equList.push({
                    equipmentId: v.equipmentId,
                    equipmentCode: v.equipmentCode,
                    equipmentName: v.equipmentName,
                    equipmentStatus: v.equipmentStatus,
                    equipmentStatusMeaning: v.equipmentStatusMeaning,
                    creationDate: v.creationDate,
                    workcellName: v.workcellName,
                  });
                  existFlag = true;
                }
              });
              if (!existFlag) {
                mapArr.push({
                  ...v,
                  equList: [
                    {
                      equipmentId: v.equipmentId,
                      equipmentCode: v.equipmentCode,
                      equipmentName: v.equipmentName,
                      equipmentStatus: v.equipmentStatus,
                      equipmentStatusMeaning: v.equipmentStatusMeaning,
                      creationDate: v.creationDate,
                      workcellName: v.workcellName,
                    },
                  ],
                });
              }
            });
            setMapData(mapArr);
            // setLodaing(false);
            return;
          }
          handleUpdateChart(res, actionName);
        }
      }
    },
    [filterData, tabKey, filterOptionsValid, handleUpdateChart, dispatch]
  );

  // 更新图表
  const handleUpdateChart = useCallback(
    (res, actionName) => {
      if (actionName === 'queryEquipmentStatus') {
        if (Array.isArray(res)) {
          const arr = res.map((i) => ({
            value: i.quantity,
            name: i.equipmentStatusMeaning,
            status: i.equipmentStatus,
          }));
          // setStatusData(arr);
          statusChartInstance.setOption({
            series: [
              {
                data: arr,
              },
            ],
            legend: {
              formatter(name) {
                let target;
                for (let i = 0, l = arr.length; i < l; i++) {
                  if (arr[i].name === name) {
                    target = arr[i].value;
                  }
                }
                const newarr = [`{a|${name}}{b|${target}}`];
                return newarr.join('\n');
              },
            },
          });
        }
      }
      if (actionName === 'queryEquipmentTypeStatus') {
        if (Array.isArray(res)) {
          const categoryData = res.map((i) => i.equipmentTypeMeaning);
          const runningData = res.map((i) => i.runningQty);
          const maintenanceData = res.map((i) => i.maintenanceQty);
          const breakDownData = res.map((i) => i.breakDownQty);
          variousStatusChartInstance.setOption({
            yAxis: {
              data: categoryData,
            },
            series: [
              {
                name: '运行中',
                data: runningData,
              },
              {
                name: '维护',
                data: maintenanceData,
              },
              {
                name: '故障',
                data: breakDownData,
              },
            ],
          });
        }
      }
    },
    [statusChartInstance, variousStatusChartInstance]
  );

  function handleTabChange(key) {
    setTabKey(key);
  }

  async function openMapModal(data) {
    const res = await dispatch({
      type: `equipmentMonitor/queryEquipmentMapModal`,
      payload: {
        equipmentId: data.equipmentId,
      },
    });
    if (!res.length) {
      notification.warning({
        message: '该设备无运行中工单',
      });
      return;
    }
    Modal.open({
      key: modalKey,
      title: '运行中工单',
      maskClosable: true,
      destroyOnClose: true,
      children: (
        <div className="equipment-map-content">
          <div className="one-line">
            <div className="one-line-left">{res[0].taskNum}</div>
            <div className="one-line-right">
              <div className="right-prod-line">{res[0].prodLineName}</div>
              <div className="right-wokercell">{res[0].workcellName}</div>
              <div className="right-time">{res[0].actualStartTime}</div>
            </div>
          </div>
          <div className="item-code">{res[0].productCode}</div>
          <div className="two-line">
            <div className="two-line-left">{res[0].itemDescription}</div>
            <div className="two-line-right">需求数量：{res[0].taskQty}</div>
          </div>
          <div className="name">{res[0].operation}</div>
          <div className="people">
            <div className="people-name">{res[0].workerName}</div>
            <div>{res[0].workerGroupName}</div>
          </div>
          <Progress value={res[0].productSchedule} />
        </div>
      ),
      footer: null,
    });
  }

  return (
    <>
      <Header
        title={
          <>
            <Lov name="factoryObj" dataSet={ds} style={{ marginRight: '16px', fontSize: '12px' }} />
            <Lov name="prodLineObj" dataSet={ds} style={{ fontSize: '12px' }} />
          </>
        }
      />
      <Content className="lmes-equipment-monitor-content">
        <div className="monitor-board">
          <div className="board-item">
            <p className="title">设备当前状态</p>
            <div className="status-chart-warp">
              <div
                id="status-chart"
                style={{ width: 325, height: 285 }}
                ref={(node) => {
                  statusChartRef.current = node;
                }}
              />
              {/* <div className="pie-legend">
                {statusData.map((item) => {
                  return (
                    <div>
                      <div className={`pie-dot pie-dot-${item.status}`} />
                      <p className="pie-status">{item.name}</p>
                      <p className="pie-number">{item.value}</p>
                    </div>
                  );
                })}
              </div> */}
            </div>
          </div>
          <div className="board-item">
            <p className="title">设备点检进度</p>
            <div className="inspection-progress">
              <Progress
                type="circle"
                percent={checkObj.checkRate ? checkObj.checkRate : 0}
                width={200}
                gapPosition="bottom"
              />
              <div className="progress-legend">
                <div>
                  <div className="progress-dot" />
                  <p className="progress-status">已点检</p>
                  <p className="progress-number">{checkObj.checkCompletedQuantity}</p>
                </div>
                <div>
                  <div className="progress-dot" />
                  <p className="progress-status">未点检</p>
                  <p className="progress-number">{checkObj.unCheckQuantity}</p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="board-item">
            <p className="title">设备综合效率</p>
            <div id="process-chart" style={{ width: '100%', height: 300 }} />
          </div> */}
        </div>
        <div className="equipment-andon-status">
          {getCurrentOrganizationId() !== 30 ? (
            <div className="equipment-andon common">
              <Tabs defaultActiveKey={tabKey} onChange={handleTabChange}>
                <TabPane tab="待处理设备安灯" key="TRIGGERED">
                  <div className="andons">
                    {andonData.map((item) => {
                      return (
                        <div className="andon-item">
                          <div className="icon">
                            <img src={RedAndon} alt="" />
                          </div>
                          <div className="andon-info">
                            <div className="name-location">
                              <p>
                                {item.andonName}
                                <span>{item.duration}</span>
                              </p>
                              <p className="location">{item.workcellName}</p>
                            </div>
                            <div className="datetime">
                              <p>{item.equipmentName}</p>
                              <p>{item.lastProcessedTime}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabPane>
                <TabPane tab="处理中设备安灯" key="RESPONSED">
                  <div className="andons">
                    {andonData.map((item) => {
                      return (
                        <div className="andon-item">
                          <div className="icon">
                            <img src={YellowAndon} alt="" />
                          </div>
                          <div className="andon-info resp">
                            <div className="name-location">
                              <p>
                                {item.andonName}
                                <span>{item.duration}</span>
                              </p>
                              <p className="location">{item.workcellName}</p>
                            </div>
                            <div className="datetime">
                              <p>{item.equipmentName}</p>
                              <p>{item.lastProcessedTime}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabPane>
              </Tabs>
            </div>
          ) : null}
          <div
            className={
              getCurrentOrganizationId() === 30
                ? 'hg-equipment-status equipment-status common'
                : 'equipment-status common'
            }
          >
            <p className="title">各类设备状态</p>
            <div
              style={{ width: '100%', height: 233 }}
              ref={(node) => {
                variousStatusChartRef.current = node;
              }}
            />
          </div>
        </div>
        <div className="equipment-map common">
          <p className="title">设备地图</p>
          <div className="map-lines">
            {mapData.map((item) => {
              return (
                <div className="line-item">
                  <div className="dot" />
                  <p className="line-title">{item.prodLineName}</p>
                  <div className="items">
                    {item.equList &&
                      item.equList.map((i) => {
                        return (
                          <div
                            className={`item ${i.equipmentStatus}`}
                            onClick={() => openMapModal(i)}
                          >
                            <div className="item-top">
                              <p>{i.equipmentName}</p>
                              <p className="status">{i.equipmentStatusMeaning}</p>
                            </div>
                            <div className="item-bottom">
                              <p>{i.workcellName}</p>
                              <Divider type="vertical" />
                              <p>{i.creationDate}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* {loading ? (
          <div className="chart-loading">
            <Spin size="large" />
          </div>
        ) : null} */}
      </Content>
    </>
  );
}

export default connect(({ equipmentMonitor }) => ({
  filterChange: equipmentMonitor.filterChange,
}))(formatterCollections({ code: [`${intlPrefix}`] })(EquipmentMonitor));
