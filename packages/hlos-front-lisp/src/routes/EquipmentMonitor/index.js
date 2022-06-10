/**
 * @Description: 设备监控
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-12 10:45:47
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useState } from 'react';
import echarts from 'echarts';
import { Progress } from 'choerodon-ui/pro';
import { Tabs, Divider } from 'choerodon-ui';
import { Content } from 'components/Page';
import { queryList } from '../../services/api';

import RedAndon from './assets/red-andon.svg';
import YellowAndon from './assets/yellow-andon.svg';
import './style.less';

const { TabPane } = Tabs;

export default () => {
  const [statusData, setStatusData] = useState([]);
  const [checkObj, setCheckObj] = useState({});
  const [trigggerData, setTrigggerData] = useState([]);
  const [respData, setRespData] = useState([]);
  const [runArr, setRunArr] = useState([]);
  const [mainArr, setMainArr] = useState([]);
  const [breakArr, setBreakArr] = useState([]);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    const _statusData = [];
    const _lineData = [];
    const _runArr = [0, 0, 0];
    const _mainArr = [0, 0, 0];
    const _breakArr = [0, 0, 0];
    const _trigggerData = [];
    const _respData = [];
    queryList({
      functionType: 'EQUIPMENT',
      dataType: 'EQUIPMENT',
    }).then((res) => {
      if (res && res.content) {
        res.content.forEach((item) => {
          if (_statusData.length && _statusData.filter((i) => i.code === item.attribute5).length) {
            _statusData.forEach((el) => {
              const _el = el;
              if (el.code === item.attribute5) {
                _el.value += 1;
              }
            });
          } else {
            let color = '#FF6B6B';
            if (item.attribute5 === 'BREAKDOWN') {
              color = '#2AC5A9';
            } else if (item.attribute5 === 'RUNNING') {
              color = '#FFA958';
            }
            _statusData.push({
              value: 1,
              code: item.attribute5,
              name: checkStatus(item.attribute5),
              color,
            });
          }
          if (item.attribute5 === 'RUNNING') {
            if (item.attribute4 === '生产设备') {
              _runArr[0] += 1;
            } else if (item.attribute4 === '维修设备') {
              _runArr[1] += 1;
            } else {
              _runArr[2] += 1;
            }
          } else if (item.attribute5 === 'MAINTENANCE') {
            if (item.attribute4 === '生产设备') {
              _mainArr[0] += 1;
            } else if (item.attribute4 === '维修设备') {
              _mainArr[1] += 1;
            } else {
              _mainArr[2] += 1;
            }
          } else if (item.attribute5 === 'BREAKDOWN') {
            if (item.attribute4 === '生产设备') {
              _breakArr[0] += 1;
            } else if (item.attribute4 === '维修设备') {
              _breakArr[1] += 1;
            } else {
              _breakArr[2] += 1;
            }
          }

          if (_lineData.length && _lineData.filter((i) => i.name === item.attribute6).length) {
            _lineData.forEach((el) => {
              // eslint-disable-next-line no-param-reassign
              item.statusName = checkStatus(item.attribute5);
              if (el.name === item.attribute6) {
                el.list.push(item);
              }
            });
          } else {
            _lineData.push({
              name: item.attribute6,
              list: [
                {
                  ...item,
                  statusName: checkStatus(item.attribute5),
                },
              ],
            });
          }
        });

        setStatusData(_statusData);
        setRunArr(_runArr);
        setMainArr(_mainArr);
        setBreakArr(_breakArr);
        setLineData(_lineData);
      }
    });

    let checkedNum = 0;
    queryList({
      functionType: 'EQUIPMENT',
      dataType: 'PERIOD_CHECK_TASK',
    }).then((res) => {
      if (res && res.content) {
        res.content.forEach((item) => {
          if (item.attribute6 === 'COMPLETED') {
            checkedNum += 1;
          }
        });
        setCheckObj({
          checkRate: (checkedNum / res.content.length) * 100,
          checkd: checkedNum,
          uncheck: res.content.length - checkedNum,
        });
      }
    });

    queryList({
      functionType: 'EQUIPMENT',
      dataType: 'ANDON',
    }).then((res) => {
      if (res && res.content) {
        res.content.forEach((item) => {
          if (item.attribute6 === 'TRIGGERED') {
            _trigggerData.push(item);
          } else if (item.attribute6 === 'RESPONSED') {
            _respData.push(item);
          }
        });
        setTrigggerData(_trigggerData);
        setRespData(_respData);
      }
    });

    drawCharts();
  }, []);

  useEffect(() => {
    const statusChart = echarts.init(document.getElementById('status-chart'));
    const option = {
      series: [
        {
          name: '设备当前状态',
          type: 'pie',
          radius: '100%',
          data: statusData,
          labelLine: false,
          roseType: 'radius',
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay() {
            return Math.random() * 200;
          },
          itemStyle: {
            normal: {
              color(params) {
                return params.data.color;
              },
            },
          },
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    statusChart.setOption(option);
  }, [statusData]);

  useEffect(() => {
    const everystatusChart = echarts.init(document.getElementById('every-status-chart'));
    const everyoption = {
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
        data: ['生产设备', '维修设备', '质检设备'],
      },
      series: [
        {
          name: '维护中',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            normal: {
              color: '#FFA958',
            },
          },

          barWidth: 20,
          data: mainArr,
        },
        {
          name: '运行中',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            normal: {
              color: '#2AC5A9',
            },
          },
          data: runArr,
        },
        {
          name: '故障',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            normal: {
              color: '#FF6B6B',
            },
          },
          data: breakArr,
        },
      ],
    };
    everystatusChart.setOption(everyoption);
  }, [mainArr, runArr, breakArr]);

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

  function checkStatus(value) {
    if (value === 'BREAKDOWN') {
      return '故障';
    } else if (value === 'RUNNING') {
      return '运行中';
    } else {
      return '维护中';
    }
  }

  return (
    <Fragment>
      <Content className="isp-equipment-monitor-content">
        <div className="monitor-board">
          <div className="board-item">
            <p className="title">设备当前状态</p>
            <div className="status-chart-warp">
              <div id="status-chart" style={{ width: 200, height: 200 }} />
              <div className="pie-legend">
                {statusData.map((item) => {
                  return (
                    <div>
                      <div className="pie-dot" />
                      <p className="pie-status">{item.name}</p>
                      <p className="pie-number">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div span={8} className="board-item" style={{ margin: '0 8px' }}>
            <p className="title">设备点检进度</p>
            <div className="inspection-progress">
              <Progress
                type="circle"
                percent={checkObj.checkRate}
                width={200}
                gapPosition="bottom"
              />
              <div className="progress-legend">
                <div>
                  <div className="progress-dot" />
                  <p className="progress-status">已点检</p>
                  <p className="progress-number">{checkObj.checkd}</p>
                </div>
                <div>
                  <div className="progress-dot" />
                  <p className="progress-status">未点检</p>
                  <p className="progress-number">{checkObj.uncheck}</p>
                </div>
              </div>
            </div>
          </div>
          <div span={8} className="board-item">
            <p className="title">设备综合效率</p>
            <div id="process-chart" style={{ width: 400, height: 300 }} />
          </div>
        </div>
        <div className="equipment-andon-status">
          <div className="equipment-andon common">
            <Tabs defaultActiveKey="1">
              <TabPane tab="待处理设备安灯" key="1">
                <div className="andons">
                  {trigggerData.map((item) => {
                    return (
                      <div className="andon-item">
                        <div className="icon">
                          <img src={RedAndon} alt="" />
                        </div>
                        <div className="andon-info">
                          <div className="name-location">
                            <p>
                              {item.attribute2}
                              <span>{item.attribute7}</span>
                            </p>
                            <p className="location">{item.attribute4}</p>
                          </div>
                          <div className="datetime">
                            <p>{item.attribute3}</p>
                            <p>{item.attribute5}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabPane>
              <TabPane tab="处理中设备安灯" key="2">
                <div className="andons">
                  {respData.map((item) => {
                    return (
                      <div className="andon-item">
                        <div className="icon">
                          <img src={YellowAndon} alt="" />
                        </div>
                        <div className="andon-info resp">
                          <div className="name-location">
                            <p>
                              {item.attribute2}
                              <span>{item.attribute7}</span>
                            </p>
                            <p className="location">{item.attribute4}</p>
                          </div>
                          <div className="datetime">
                            <p>{item.attribute3}</p>
                            <p>{item.attribute5}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabPane>
            </Tabs>
          </div>
          <div className="equipment-status common">
            <p className="title">各类设备状态</p>
            <div id="every-status-chart" style={{ width: '100%', height: 233 }} />
          </div>
        </div>
        <div className="equipment-map common">
          <p className="title">设备地图</p>
          <div className="map-lines">
            {lineData.map((item) => {
              return (
                <div className="line-item">
                  <div className="dot" />
                  <p className="line-title">{item.name}</p>
                  <div className="items">
                    {item.list.map((i) => {
                      return (
                        <div className={`item ${i.attribute5}`}>
                          <div className="item-top">
                            <p>{i.attribute3}</p>
                            <p className="status">{i.statusName}</p>
                          </div>
                          <div className="item-bottom">
                            <p>{i.attribute7}</p>
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
      </Content>
    </Fragment>
  );
};
