/*
 * @module-:
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-07-27 16:21:41
 * @LastEditTime: 2020-08-03 17:17:25
 * @copyright: Copyright (c) 2018,Hand
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import chinaJson from 'echarts/map/json/china.json';

import { Bind } from 'lodash-decorators';
import { queryList } from '@/services/api';

import style from './index.less';
import unfinishedDemand from '../../../assets/images/unfinished-demand2.svg';
import returnToday from '../../../assets/images/return-today2.svg';
import pickingToday from '../../../assets/images/picking-today2.svg';
import todayDemand from '../../../assets/images/today-demand2.svg';

echarts.registerMap('china', chinaJson);
@connect(({ CreativeDataLargeScreenModel }) => ({
  CreativeDataLargeScreenModel,
}))
export default class MyContentCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geoCoordMap: {
        上海: [121.4648, 31.2891],
        东莞: [113.8953, 22.901],
        东营: [118.7073, 37.5513],
        中山: [113.4229, 22.478],
        临汾: [111.4783, 36.1615],
        临沂: [118.3118, 35.2936],
        丹东: [124.541, 40.4242],
        丽水: [119.5642, 28.1854],
        乌鲁木齐: [87.9236, 43.5883],
        佛山: [112.8955, 23.1097],
        保定: [115.0488, 39.0948],
        兰州: [103.5901, 36.3043],
        包头: [110.3467, 41.4899],
        北京: [116.4551, 40.2539],
        北海: [109.314, 21.6211],
        南京: [118.8062, 31.9208],
        南宁: [108.479, 23.1152],
        南昌: [116.0046, 28.6633],
        南通: [121.1023, 32.1625],
        厦门: [118.1689, 24.6478],
        台州: [121.1353, 28.6688],
        合肥: [117.29, 32.0581],
        呼和浩特: [111.4124, 40.4901],
        咸阳: [108.4131, 34.8706],
        哈尔滨: [127.9688, 45.368],
        唐山: [118.4766, 39.6826],
        嘉兴: [120.9155, 30.6354],
        大同: [113.7854, 39.8035],
        大连: [122.2229, 39.4409],
        天津: [117.4219, 39.4189],
        太原: [112.3352, 37.9413],
        威海: [121.9482, 37.1393],
        宁波: [121.5967, 29.6466],
        宝鸡: [107.1826, 34.3433],
        宿迁: [118.5535, 33.7775],
        常州: [119.4543, 31.5582],
        广州: [113.5107, 23.2196],
        廊坊: [116.521, 39.0509],
        延安: [109.1052, 36.4252],
        张家口: [115.1477, 40.8527],
        徐州: [117.5208, 34.3268],
        德州: [116.6858, 37.2107],
        惠州: [114.6204, 23.1647],
        成都: [103.9526, 30.7617],
        扬州: [119.4653, 32.8162],
        承德: [117.5757, 41.4075],
        拉萨: [91.1865, 30.1465],
        无锡: [120.3442, 31.5527],
        日照: [119.2786, 35.5023],
        昆明: [102.9199, 25.4663],
        杭州: [119.5313, 29.8773],
        枣庄: [117.323, 34.8926],
        柳州: [109.3799, 24.9774],
        株洲: [113.5327, 27.0319],
        武汉: [114.3896, 30.6628],
        汕头: [117.1692, 23.3405],
        江门: [112.6318, 22.1484],
        沈阳: [123.1238, 42.1216],
        沧州: [116.8286, 38.2104],
        河源: [114.917, 23.9722],
        泉州: [118.3228, 25.1147],
        泰安: [117.0264, 36.0516],
        泰州: [120.0586, 32.5525],
        济南: [117.1582, 36.8701],
        济宁: [116.8286, 35.3375],
        海口: [110.3893, 19.8516],
        淄博: [118.0371, 36.6064],
        淮安: [118.927, 33.4039],
        深圳: [114.5435, 22.5439],
        清远: [112.9175, 24.3292],
        温州: [120.498, 27.8119],
        渭南: [109.7864, 35.0299],
        湖州: [119.8608, 30.7782],
        湘潭: [112.5439, 27.7075],
        滨州: [117.8174, 37.4963],
        潍坊: [119.0918, 36.524],
        烟台: [120.7397, 37.5128],
        玉溪: [101.9312, 23.8898],
        珠海: [113.7305, 22.1155],
        盐城: [120.2234, 33.5577],
        盘锦: [121.9482, 41.0449],
        石家庄: [114.4995, 38.1006],
        福州: [119.4543, 25.9222],
        秦皇岛: [119.2126, 40.0232],
        绍兴: [120.564, 29.7565],
        聊城: [115.9167, 36.4032],
        肇庆: [112.1265, 23.5822],
        舟山: [122.2559, 30.2234],
        苏州: [120.6519, 31.3989],
        莱芜: [117.6526, 36.2714],
        菏泽: [115.6201, 35.2057],
        营口: [122.4316, 40.4297],
        葫芦岛: [120.1575, 40.578],
        衡水: [115.8838, 37.7161],
        衢州: [118.6853, 28.8666],
        西宁: [101.4038, 36.8207],
        西安: [109.1162, 34.2004],
        贵阳: [106.6992, 26.7682],
        连云港: [119.1248, 34.552],
        邢台: [114.8071, 37.2821],
        邯郸: [114.4775, 36.535],
        郑州: [113.4668, 34.6234],
        鄂尔多斯: [108.9734, 39.2487],
        重庆: [107.7539, 30.1904],
        金华: [120.0037, 29.1028],
        铜川: [109.0393, 35.1947],
        银川: [106.3586, 38.1775],
        镇江: [119.4763, 31.9702],
        长春: [125.8154, 44.2584],
        长沙: [113.0823, 28.2568],
        长治: [112.8625, 36.4746],
        阳泉: [113.4778, 38.0951],
        青岛: [120.4651, 36.3373],
        韶关: [113.7964, 24.7028],
      },
      statisticsList: {
        todayDemand: 0, // 今日需求
        pickingToday: 0, // 今日领料
        returnToday: 0, // 今日退货
        unfinishedDemand: 0, // 未完需求
      },
      supplierList: [],
      coordinate: { attribute2: '' },
    };
  }

  componentDidMount() {
    queryList({
      functionType: 'SUPPLIER_CHAIN',
      dataType: 'BOARD-CUSTOMER',
      page: 0,
      size: 100,
    }).then((res) => {
      const { content } = res ?? { content: [] };
      if (content.length > 0) {
        this.setState({
          coordinate: content[0],
        });
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    const { informationSummary, supplierList } = nextProps.CreativeDataLargeScreenModel;
    if (informationSummary !== this.state.statisticsList) {
      const supplier = [];
      supplierList.forEach((item) => {
        const name = item.attribute12;
        const value = Math.floor(Math.random() * 20);
        supplier.push({ name, value });
      });
      this.setState(() => ({
        statisticsList: informationSummary,
        supplierList: supplier,
      }));
      return true;
    } else {
      return false;
    }
  }

  /**
   *地图
   *
   * @returns
   * @memberof MyContentCenter
   */
  @Bind()
  getOption() {
    const { geoCoordMap, supplierList, coordinate } = this.state;
    const dataT = supplierList;
    const { features } = chinaJson;
    let coordinateActive = [];
    features.forEach((item) => {
      if (item.properties.name === coordinate.attribute2) {
        coordinateActive = item.properties.cp;
      }
    });
    geoCoordMap[`${coordinate.attribute1}`] =
      coordinateActive.length > 0 ? coordinateActive : [121.4648, 31.2896];
    const GZData = [];
    const positions = coordinate?.attribute1 ?? '北京';
    const tempData = [positions, GZData];

    dataT.forEach((item) => {
      const arr = [];
      arr.push(item);
      arr.push({
        name: positions,
      });
      GZData.push(arr);
    });

    const convertData = function (data) {
      const res = [];
      for (let i = 0; i < data.length; i++) {
        const dataItem = data[i];
        const fromCoord = geoCoordMap[dataItem[0].name];
        const toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
          res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoord, toCoord],
            value: dataItem[0].value,
          });
        }
      }
      return res;
    };

    const color = [
      'rgb(4,185,255)',
      'rgb(4,185,255)',
      'rgb(4,185,255)',
      'rgb(4,185,255)',
      'rgb(4,185,255)',
    ];
    const series = [
      {
        type: 'map',
        map: 'china',
        //  width: '100%',
        geoIndex: 1,
        zlevel: 1,
        //  aspectScale: 0.75, //长宽比
        showLegendSymbol: false, // 存在legend时显示
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
            textStyle: {
              color: '#fff',
            },
          },
        },
        roam: false,
        itemStyle: {
          normal: {
            areaColor: 'rgba(128, 128, 128, 0)',
            borderColor: '#49a7d5', // 省市边界线00fcff 516a89
          },
          emphasis: {
            areaColor: 'rgba(128, 128, 128, 0)',
          },
        },
        data: [
          {
            name: '南海诸岛',
            value: 0,
            itemStyle: {
              normal: {
                opacity: 0,
                label: {
                  show: false,
                },
              },
            },
          },
        ],
      },
    ];

    series.push(
      {
        name: tempData[0],
        type: 'lines',
        zlevel: 2,
        symbol: ['none', 'circle'],
        effect: {
          show: true,
          period: 3, // 箭头指向速度，值越小速度越快
          trailLength: 0.01, // 特效尾迹长度[0,1]值越大，尾迹越长重
          symbolSize: 4, // 图标大小
          symbol: 'arrow',
        },
        lineStyle: {
          normal: {
            opacity: 1,
            width: 1,
            curveness: 0.4, // 曲线的弯曲程度
            color: '#609fd4',
          },
        },
        data: convertData(tempData[1]),
      },
      {
        name: tempData[0],
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          brushType: 'stroke',
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            formatter: '{b}',
          },
        },
        symbolSize(val) {
          return val[2] / 2;
        },
        itemStyle: {
          normal: {
            //  fontSize: 80,
          },
        },
        data: tempData[1].map(function (dataItem) {
          const geoData = geoCoordMap[dataItem[0].name]
            ? geoCoordMap[dataItem[0].name]
            : [116.4551, 40.2539];
          return {
            name: dataItem[0].name,
            value: geoData.concat([dataItem[0].value]),
          };
        }),
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        symbolSize: 20,
        label: {
          normal: {
            show: true,
            position: 'center',
            formatter: '{b}',

            color: 'white',
          },
        },
        itemStyle: {
          normal: {
            color: 'rgb(4,185,255)',
          },
        },
        rippleEffect: {
          scale: 4,
          brushType: 'stroke',
        },
        data: [
          {
            name: tempData[0],
            value: geoCoordMap[tempData[0]],
            visualMap: false,
          },
        ],
      },
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        symbolSize: 20,
        symbol: 'pin',
        itemStyle: {
          normal: {
            color: 'white',
          },
        },
        data: [
          {
            name: tempData[0],
            value: geoCoordMap[tempData[0]],
            visualMap: false,
          },
        ],
      }
    );

    const option = {
      tooltip: {
        trigger: 'item',
        formatter(params) {
          if (params.seriesType === 'scatter' && params.name !== tempData[0]) {
            return `<br>${params.data.name} ---> ${params.seriesName}<br />数量：${params.data.value[2]}`;
          } else if (params.seriesType === 'lines') {
            return `<br>${params.data.fromName} ---> ${params.data.toName}<br />数量：${params.data.value}`;
          } else {
            return params.name;
          }
        },
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        color,
        //            textStyle: {
        //                color: '#fff',
        //            },
        show: false,
      },
      geo: {
        map: 'china',
        zoom: 1.25,
        zlevel: 2,
        label: {
          emphasis: {
            show: false,
          },
        },
        roam: false, // 是否允许缩放
        itemStyle: {
          normal: {
            areaColor: '#01245F',
            borderColor: '#00fcff', // 省市边界线00fcff 516a89
          },
          emphasis: {
            color: '#112246', // 悬浮背景
          },
        },
      },
      series,
    };
    return option;
  }

  render() {
    const { statisticsList } = this.state;
    return (
      <div className={style['my-content-center-position']}>
        <div className={style['my-content-center-map']}>
          <ReactEcharts option={this.getOption()} style={{ height: '391px', width: '100%' }} />
        </div>
        <div className={style['my-content-map-bottom-list']}>
          <div className={style['my-content-map-bottom-all']}>
            <div>
              <img src={todayDemand} alt="今日需求" />
            </div>
            <div>
              <div>今日需求</div>
              <span>{statisticsList.todayDemand}</span>
            </div>
          </div>
          <div className={style['my-content-map-bottom-all']}>
            <div>
              <img src={pickingToday} alt="今日领料" />
            </div>
            <div>
              <div>今日领料</div>
              <span>{statisticsList.pickingToday}</span>
            </div>
          </div>
          <div className={style['my-content-map-bottom-all']}>
            <div>
              <img src={returnToday} alt="今日退货" />
            </div>
            <div>
              <div>今日退货</div>
              <span>{statisticsList.returnToday}</span>
            </div>
          </div>
          <div className={style['my-content-map-bottom-all']}>
            <div>
              <img src={unfinishedDemand} alt="未完需求" />
            </div>
            <div>
              <div>未完需求</div>
              <span>{statisticsList.unfinishedDemand}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}