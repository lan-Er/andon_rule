import React, { useMemo, useEffect, useState } from 'react';
import { Icon } from 'choerodon-ui';
import echarts from 'echarts';
import moment from 'moment';
import { getResponse } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import Time from './Time.js';
import { asyncApi, requestApi, requestOperationApi } from '@/services/energyService';
import EnergyImg from './assets/energy.png';
import OperatingImg from './assets/operating.png';
import './style.less';

export default () => {
  const timeComponent = useMemo(() => <Time />, []);
  const [valueArr, setValueArr] = useState([]);
  const [rateArr, setRateArr] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentRate, setCurrentRate] = useState(0);

  const dateArr = useMemo(() => {
    const _dateArr = [];
    [0, -1, -2, -3, -4, -5, -6].forEach((item) => {
      _dateArr.unshift(moment().add(item, 'days').format(DEFAULT_DATE_FORMAT));
    });
    return _dateArr;
  }, []);

  useEffect(() => {
    async function request() {
      const res = await asyncApi({
        ak: 'f237a15xxxxxxxea97c1fa163e595ed7',
        meterId: 1001,
        paraCode: '450061',
        startTime: moment().add(-6, 'days').format(DEFAULT_DATE_FORMAT),
        endTime: moment().format(DEFAULT_DATE_FORMAT),
        dataType: 1,
      });
      if (getResponse(res) && res.status === 1) {
        const dateStrArr = [];
        dateArr.forEach((item) => {
          dateStrArr.push(item.split('-').join(''));
        });
        const arrRes = await requestApi({
          dataTimeStringArray: dateStrArr,
        });
        if (getResponse(arrRes) && !arrRes.failed) {
          const _valueArr = [];

          arrRes.forEach((item) => {
            const index = dateArr.findIndex((i) => i.split('-').join('') === item.dataTimeStr);
            _valueArr[index] = item.value || 0;
          });
          setValueArr(_valueArr);
          if (_valueArr[6]) {
            setTotal(_valueArr[6]);
          }
        }
      }
      const rateRes = await requestOperationApi();
      if (getResponse(rateRes) && !rateRes.failed) {
        const _rateArr = [];
        rateRes.forEach((item) => {
          const index = dateArr.findIndex((i) => i === item.date);
          _rateArr[index] = item.utilization;
        });
        setCurrentRate(_rateArr[6] || 0);
        setRateArr(_rateArr);
      }
    }
    request();
  }, [dateArr]);

  useEffect(() => {
    const chart = echarts.init(document.getElementById('energy-chart'));
    const option = {
      grid: {
        left: 43,
        right: 37,
        bottom: 21.3,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            show: true,
            fontSize: 11,
            color: '#fff',
          },
          data: dateArr.slice(0, 6),
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              width: 1,
              type: 'dotted',
            },
          },
          axisLabel: {
            show: true,
            fontSize: 11,
            color: '#fff',
          },
          axisLine: false,
        },
        {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)',
              width: 1,
              type: 'dotted',
            },
          },
          axisLabel: {
            show: true,
            fontSize: 11,
            color: '#fff',
            formatter: '{value}%',
          },
          axisLine: false,
        },
      ],
      series: [
        {
          name: '设备开动率',
          type: 'line',
          yAxisIndex: 1,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(42,197,169,0.40)',
              },
              {
                offset: 0.4,
                color: 'rgba(42,197,169,0.40)',
              },
              {
                offset: 1,
                color: 'rgba(42,197,169,0.05)',
              },
            ]),
          },
          lineStyle: {
            color: '#2AC5A9',
            width: 1,
          },
          smooth: true,
          data: rateArr,
        },
        {
          name: '设备能耗',
          type: 'line',
          lineStyle: {
            color: '#FF4B4B',
            width: 1,
            type: 'dashed',
          },
          smooth: true,
          data: valueArr,
        },
      ],
    };

    chart.setOption(option);
  }, [dateArr, valueArr, rateArr]);

  return (
    <div className="energy-consumption-statistics">
      <div className="header">
        <p className="title">设备能耗统计平台</p>
        {timeComponent}
      </div>
      <div className="wrap" />
      <div className="wrap wrap-right" />

      <div className="main">
        <div className="main-blur" />
        <div className="statistics">
          <div className="statistics-item">
            <img src={EnergyImg} alt="" />
            <div className="sub">
              <p>总电量</p>
              <p className="english">Total electricity</p>
            </div>
            <div className="num">
              {total} <span>kwh</span>
            </div>
          </div>
          <div className="statistics-item">
            <img src={OperatingImg} alt="" />
            <div className="sub">
              <p>设备开动率</p>
              <p className="english">Equipment operating rate</p>
            </div>
            <div className="num">
              {currentRate} <span>%</span>
            </div>
          </div>
        </div>
        <div className="footer-chart">
          <p className="title">
            <Icon type="baseline-arrow_right" style={{ color: '#50CEFF' }} />
            设备总电量分布
            <span>
              <span className="circle" />
              设备开动率
            </span>
            <span>
              <span className="circle red" />
              设备能耗
            </span>
          </p>
          <div id="energy-chart" />
        </div>
      </div>
    </div>
  );
};
