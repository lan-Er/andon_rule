/*
 * @Descripttion: 刀具监控
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */

import React, { Fragment, Component } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { Header } from 'components/Page';
import { Bind } from 'lodash-decorators';
import { isEmpty, isArray } from 'lodash';
import { Card } from 'choerodon-ui';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import { OverviewDS, CutterRateDS, SupplierChainDS, CutterMapDS } from '@/stores/cutterDashboardDS';
import { queryList } from '@/services/api';

import styles from './index.less';
import Overview from './Overview';
import EquipmentMap from './EquipmentMap';
import CutterLife from './CutterLife';
import CutterProportion from './CutterProportion';
import CutterRepair from './CutterRepair';
import CutterType from './CutterType';

const overviewDS = new DataSet({ ...OverviewDS() });
const cutterRateDS = new DataSet({ ...CutterRateDS() });
const cutterMapDS = new DataSet({ ...CutterMapDS() });
const supplierChainDS = new DataSet({ ...SupplierChainDS() });
export default class CutterDashboard extends Component {
  state = {
    activeProportion: 'head',
    activeType: 'head',
    activeRepair: '待维修',
    overviewLoading: true, // 刀具总揽加载
    overviewData: {}, // 刀具总揽数据
    typeLoading: true, // 刀具类型加载
    typeOption: {}, // 刀具类型加载
    proportionLoading: true, // 刀具占比加载
    proportionOption: {}, // 刀具占比加载
    status: [], // 刀具类型状态
    cutterMapData: [], // 刀具地图
    cutterMapLoading: true, // 刀具地图加载
    cutterRepairData: [], // 刀具维修
    cutterRepairLoading: true, // 刀具维修加载
    cutterLifeData: [], // 刀具寿命
    cutterLifeLoading: true, // 刀具寿命加载
  };

  async componentDidMount() {
    const res = await queryList({
      functionType: 'CUTTER',
      dataType: 'CUTTER_STATUS',
    });
    if (!isEmpty(res.content)) {
      this.setState({ status: res.content });
    }
    this.handleOverview();
    this.handleCutterType('head');
    this.handleCutterProportion('head');
    this.handleCutterLife();
    this.handleCutterRepair();
    this.handleCutterMap();
  }

  // 监控总揽
  @Bind()
  async handleOverview() {
    const res = await overviewDS.query();
    const overviewData = { q0: 0, q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0 };
    if (isArray(res) && !isEmpty(res)) {
      const json = {
        使用中: 'q1',
        已组装: 'q2',
        已占用: 'q3',
        闲置中: 'q4',
        故障: 'q5',
        维修中: 'q6',
      };
      res.forEach((item) => {
        const { quantity, attribute5 } = item;
        overviewData.q0 += quantity;
        overviewData[json[attribute5]] = quantity;
      });
    }
    this.setState({ overviewLoading: false, overviewData });
  }

  @Bind()
  handleChangeRadio(action, value) {
    if (action === 'activeType') {
      this.handleCutterType(value);
    }
    if (action === 'activeProportion') {
      this.handleCutterProportion(value);
    }
    if (action === 'activeRepair') {
      this.handleCutterRepair(value);
    }
  }

  @Bind()
  handleChangeSelect(value) {
    const { activeType } = this.state;
    this.handleCutterType(activeType, value === '全部' ? '' : value);
  }

  // 刀具类型
  @Bind()
  async handleCutterType(activeType, attribute5 = '') {
    const attribute4 = activeType === 'head' ? '刀头' : '刀体';
    cutterRateDS.setQueryParameter('attribute4', attribute4);
    cutterRateDS.setQueryParameter('attribute5', attribute5);
    const res = await cutterRateDS.query();
    const xAxisData = [];
    let seriesData = [];
    if (isArray(res) && !isEmpty(res)) {
      seriesData = res.map((item) => {
        const { quantity, attribute6 } = item;
        xAxisData.push(attribute6);
        return quantity;
      });
    }
    const typeOption = {
      color: ['#2AC5A9'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '',
          type: 'bar',
          barWidth: '60%',
          data: seriesData,
        },
      ],
    };
    this.setState({ activeType, typeLoading: false, typeOption });
  }

  // 刀具占用比
  @Bind()
  async handleCutterProportion(activeProportion) {
    const attribute4 = activeProportion === 'head' ? '刀头' : '刀体';
    cutterRateDS.setQueryParameter('attribute4', attribute4);
    cutterRateDS.setQueryParameter('attribute5', '');
    const legendData = [];
    let seriesData = [];
    const res = await cutterRateDS.query();
    if (isArray(res) && !isEmpty(res)) {
      seriesData = res.map((item) => {
        const { quantity, attribute6 } = item;
        legendData.push(attribute6);
        return { value: quantity, name: attribute6 };
      });
    }
    const proportionOption = {
      title: {
        text: '',
        subtext: '',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        // orient: 'vertical',
        // top: 'middle',
        bottom: 10,
        left: 'center',
        data: legendData,
      },
      series: [
        {
          name: activeProportion === 'head' ? '刀头占比情况' : '刀体占比情况',
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    this.setState({ activeProportion, proportionLoading: false, proportionOption });
  }

  @Bind()
  async handleCutterMap() {
    const res = await cutterMapDS.query();
    const json = {};
    res.forEach((item) => {
      const {
        attribute12,
        attribute9,
        attribute3,
        attribute5,
        attribute13,
        attribute10,
        attribute14,
        attribute11,
        attribute8,
      } = item;
      const value = attribute12 || attribute9 || '其他';
      if (json[value] === undefined) {
        json[value] = [];
      }
      const att1 = attribute13 || attribute10;
      const att2 = attribute14 || attribute11;
      json[value].push({ attribute3, attribute5, att1, att2, attribute8 });
    });
    const cutterMapData = [];
    Object.keys(json).forEach((jsonKey) => {
      cutterMapData.push({ name: jsonKey, childrens: json[jsonKey] });
    });
    this.setState({ cutterMapLoading: false, cutterMapData });
  }

  @Bind()
  async handleCutterRepair(activeRepair = '待维修') {
    supplierChainDS.setQueryParameter('cutterRepair', 1);
    supplierChainDS.setQueryParameter('cutterAge', '');
    supplierChainDS.setQueryParameter('attribute5', activeRepair);
    const res = await supplierChainDS.query();
    let cutterRepairData = [];
    if (isArray(res.content) && !isEmpty(res.content)) {
      cutterRepairData = res.content;
    }
    this.setState({ cutterRepairLoading: false, activeRepair, cutterRepairData });
  }

  @Bind()
  async handleCutterLife() {
    supplierChainDS.setQueryParameter('cutterRepair', '');
    supplierChainDS.setQueryParameter('cutterAge', 1);
    supplierChainDS.setQueryParameter('attribute5', '');
    const res = await supplierChainDS.query();
    let cutterLifeData = [];
    if (isArray(res.content) && !isEmpty(res.content)) {
      cutterLifeData = res.content;
    }
    this.setState({ cutterLifeLoading: false, cutterLifeData });
  }

  render() {
    const {
      activeProportion,
      activeType,
      activeRepair,
      overviewLoading,
      overviewData,
      proportionLoading,
      proportionOption,
      typeLoading,
      typeOption,
      status,
      cutterMapLoading,
      cutterMapData,
      cutterRepairLoading,
      cutterRepairData,
      cutterLifeLoading,
      cutterLifeData,
    } = this.state;
    const overviewProps = {
      data: overviewData,
    };
    const proportionProps = {
      active: activeProportion,
      option: proportionOption,
      onChange: this.handleChangeRadio,
    };
    const typeProps = {
      status,
      active: activeType,
      option: typeOption,
      onChange: this.handleChangeRadio,
      onChangeSelect: this.handleChangeSelect,
    };
    const lifeProps = {
      data: cutterLifeData,
    };
    const cutterRepairProps = {
      data: cutterRepairData,
      active: activeRepair,
      onChange: this.handleChangeRadio,
    };
    const mapProps = {
      data: cutterMapData,
    };
    return (
      <Fragment>
        <Header title="刀具监控" />
        <div className={styles['cutter-page-content']}>
          <Card
            key="overview"
            bordered={false}
            className={DETAIL_CARD_CLASSNAME}
            loading={overviewLoading}
          >
            <Overview {...overviewProps} />
          </Card>
          <div className={styles['cutter-type-proportion']}>
            <div className={styles['type-proportion-left']}>
              <Card
                key="type"
                bordered={false}
                className={DETAIL_CARD_CLASSNAME}
                loading={typeLoading}
              >
                <CutterType {...typeProps} />
              </Card>
            </div>
            <div className={styles['type-proportion-right']}>
              <Card
                key="proportion"
                bordered={false}
                className={DETAIL_CARD_CLASSNAME}
                loading={proportionLoading}
              >
                <CutterProportion {...proportionProps} />
              </Card>
            </div>
          </div>
          <div className={styles['cutter-life-repair']}>
            <div className={styles['life-repair-div']}>
              <Card
                key="life"
                bordered={false}
                className={DETAIL_CARD_CLASSNAME}
                loading={cutterLifeLoading}
              >
                <CutterLife {...lifeProps} />
              </Card>
            </div>
            <div className={`${styles['life-repair-div']} ${styles['div-rignt']}`}>
              <Card
                key="repair"
                bordered={false}
                className={DETAIL_CARD_CLASSNAME}
                loading={cutterRepairLoading}
              >
                <CutterRepair {...cutterRepairProps} />
              </Card>
            </div>
          </div>
          <div className={styles['cutter-equipment-map-content']}>
            <Card
              key="map"
              bordered={false}
              className={DETAIL_CARD_CLASSNAME}
              loading={cutterMapLoading}
            >
              <EquipmentMap {...mapProps} />
            </Card>
          </div>
        </div>
      </Fragment>
    );
  }
}
