/*
 * @Descripttion: 刀具监控
 * @Author: jianjun.tan@hand-china.com
 * @Date: 2020-08-30 11:25:22
 */

import React, { Fragment, Component } from 'react';
import { DataSet, Button, Modal, Form, Lov } from 'choerodon-ui/pro';
import { Header } from 'components/Page';
import { Bind } from 'lodash-decorators';
import { isEmpty, isArray } from 'lodash';
import { Card } from 'choerodon-ui';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import { queryIndependentValueSet, queryLovData } from 'hlos-front/lib/services/api';
import {
  OverviewDS,
  CutterRateDS,
  SupplierChainDS,
  CutterMapDS,
  RepairDS,
  FilterDS,
} from '@/stores/cutterDashboardDS';
// import { queryList } from '@/services/api';

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
const repairDS = new DataSet({ ...RepairDS() });
const filterDS = new DataSet({ ...FilterDS() });
const modalKey = Modal.key();

export default class CutterDashboard extends Component {
  state = {
    organizationId: null, // 当前用户默认组织
    activeProportion: 'CUTTER_HEAD',
    activeType: 'CUTTER_HEAD',
    activeRepair: 'UNREPAIRED',
    activeMap: 'RESOURCE',
    overviewLoading: true, // 刀具总揽加载
    overviewData: {}, // 刀具总揽数据
    overviewTotal: 0, // 刀具总数
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
    cutterTypeList: [], // 刀具类型
    locationTypeList: [], // 刀具位置类型
  };

  async componentDidMount() {
    const orgRes = await queryLovData({ lovCode: 'LMDS.ORGANIZATION', defaultFlag: 'Y' });
    if (!isEmpty(orgRes) && orgRes.content && orgRes.content[0]) {
      const { organizationName, organizationId } = orgRes.content[0];
      this.setState({
        organizationId,
      });
      filterDS.current.set('meOuObj', {
        meOuId: organizationId,
        organizationName,
      });
    }

    const statusRes = await queryIndependentValueSet({
      lovCode: 'LMDS.CUTTER_STATUS',
    });
    if (!isEmpty(statusRes) && isArray(statusRes)) {
      this.setState({ status: statusRes });
    }
    const typeRes = await queryIndependentValueSet({
      lovCode: 'LMDS.CUTTER_TYPE',
    });
    if (isArray(typeRes) && !isEmpty(typeRes)) {
      this.setState({
        cutterTypeList: typeRes,
      });
    }
    const locationRes = await queryIndependentValueSet({
      lovCode: 'LMDS.TO_LOCATION_TYPE',
    });
    if (isArray(locationRes) && !isEmpty(locationRes)) {
      this.setState({
        locationTypeList: locationRes,
      });
    }
    this.handleOverview();
    this.handleCutterType('CUTTER_HEAD');
    this.handleCutterProportion('CUTTER_HEAD');
    this.handleCutterLife();
    this.handleCutterRepair();
    this.handleCutterMap(orgRes.content[0].organizationId);
  }

  // 监控总揽
  @Bind()
  async handleOverview() {
    overviewDS.queryParameter = {
      organizationId: this.state.organizationId,
    };
    const res = await overviewDS.query();
    if (!isEmpty(res) && isArray(res.detail)) {
      this.setState({ overviewData: res.detail, overviewTotal: res.total });
    }
    this.setState({ overviewLoading: false });
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
    if (action === 'activeMap') {
      this.handleCutterMap(this.state.organizationId, value);
    }
  }

  @Bind()
  handleChangeSelect(value) {
    const { activeType } = this.state;
    this.handleCutterType(activeType, value === 'all' ? '' : value);
  }

  // 刀具类型
  @Bind()
  async handleCutterType(activeType, cutterStatus = '') {
    cutterRateDS.setQueryParameter('organizationId', this.state.organizationId);
    cutterRateDS.setQueryParameter('cutterType', activeType);
    cutterRateDS.setQueryParameter('cutterStatus', cutterStatus);
    const res = await cutterRateDS.query();
    const xAxisData = [];
    let seriesData = [];
    if (!isEmpty(res) && isArray(res.detail)) {
      seriesData = res.detail.map((item) => {
        const { amount, cutterCategoryName } = item;
        xAxisData.push(cutterCategoryName);
        return amount;
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
          barWidth: 60,
          data: seriesData,
        },
      ],
    };
    this.setState({ activeType, typeLoading: false, typeOption });
  }

  // 刀具占用比
  @Bind()
  async handleCutterProportion(activeProportion) {
    const { cutterTypeList } = this.state;
    const activeObj = cutterTypeList.find((i) => i.value === activeProportion);
    const meaning = !isEmpty(activeObj) ? activeObj.meaning : '';
    cutterRateDS.setQueryParameter('cutterType', activeProportion);
    cutterRateDS.setQueryParameter('cutterStatus', '');
    const legendData = [];
    let seriesData = [];
    const res = await cutterRateDS.query();
    if (!isEmpty(res) && isArray(res.detail)) {
      seriesData = res.detail.map((item) => {
        const { amount, cutterCategoryName } = item;
        legendData.push(cutterCategoryName);
        return { value: amount, name: cutterCategoryName };
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
          name: `${meaning}占比情况`,
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
  async handleCutterMap(organizationId, locationType = 'RESOURCE') {
    cutterMapDS.queryParameter = {
      locationType,
      organizationId,
    };
    const res = await cutterMapDS.query();
    this.setState({ cutterMapLoading: false, cutterMapData: res, activeMap: locationType });
  }

  @Bind()
  async handleCutterRepair(activeRepair = 'UNREPAIRED') {
    repairDS.setQueryParameter('organizationId', this.state.organizationId);
    repairDS.setQueryParameter('cutterStatus', activeRepair);
    const res = await repairDS.query();
    let cutterRepairData = [];
    if (isArray(res) && !isEmpty(res)) {
      cutterRepairData = res;
    }
    this.setState({ cutterRepairLoading: false, activeRepair, cutterRepairData });
  }

  @Bind()
  async handleCutterLife() {
    supplierChainDS.setQueryParameter('organizationId', this.state.organizationId);
    const res = await supplierChainDS.query();
    let cutterLifeData = [];
    if (res && isArray(res)) {
      cutterLifeData = res;
    }
    this.setState({ cutterLifeLoading: false, cutterLifeData });
  }

  @Bind()
  handleShowFilterModal() {
    Modal.open({
      key: modalKey,
      title: '筛选',
      className: 'cutter-dashboard-filter-modal',
      drawer: true,
      drawerTransitionName: 'slide-right',
      closable: true,
      children: (
        <Form dataSet={filterDS}>
          <Lov name="meOuObj" noCache onChange={this.handleOrgChange} clearButton={false} />
        </Form>
      ),
      onOk: () => this.modalOk(),
    });
  }

  @Bind()
  handleOrgChange(rec) {
    this.setState({
      organizationId: rec.organizationId,
    });
  }

  @Bind()
  async modalOk() {
    const validateValue = await filterDS.validate(false, false);
    if (!validateValue) return false;
    const { meOuId } = filterDS.current.toJSONData();
    this.handleOverview();
    this.handleCutterType('CUTTER_HEAD');
    this.handleCutterProportion('CUTTER_HEAD');
    this.handleCutterLife();
    this.handleCutterRepair();
    this.handleCutterMap(meOuId);
  }

  render() {
    const {
      activeProportion,
      activeType,
      activeRepair,
      activeMap,
      overviewLoading,
      overviewData,
      overviewTotal,
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
      cutterTypeList,
      locationTypeList,
    } = this.state;
    const overviewProps = {
      data: overviewData,
      total: overviewTotal,
    };
    const proportionProps = {
      active: activeProportion,
      option: proportionOption,
      cutterTypeList,
      onChange: this.handleChangeRadio,
    };
    const typeProps = {
      status,
      active: activeType,
      option: typeOption,
      cutterTypeList,
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
      active: activeMap,
      locationTypeList,
      onChange: this.handleChangeRadio,
    };
    return (
      <Fragment>
        <Header title="刀具监控">
          <Button icon="filter2" color="primary" onClick={this.handleShowFilterModal}>
            筛选
          </Button>
        </Header>
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
