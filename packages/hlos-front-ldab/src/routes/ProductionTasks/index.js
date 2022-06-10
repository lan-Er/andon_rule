/*
 * @module-: 生产看板配置页---用于用户自定义显示数据，不用数据库数据
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-10-23 17:42:13
 * @LastEditTime: 2020-11-04 17:16:51
 * @copyright: Copyright (c) 2018,Hand
 */
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { Header, Content } from 'components/Page';
import React, { Component, Fragment } from 'react';
import { Form, TextField, DataSet, Button } from 'choerodon-ui/pro';

import formDs from './stores/fromDs';
import style from './index.less';
// import inspectionOrderDs from './stores/inspectionOrderDs';
import InspectionOrder from './components/inspectionOrder';
import AndonInformation from './components/andonInformation';
import ProductionOverview from './components/productionOverview';

@connect(({ productionTasksModel }) => ({ productionTasksModel }))
export default class ProductionTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inspectionOrder: [1],
      isSubmit: false,
      productionOverview: [1],
      andonList: [1],
    };
    this.myFormDs = new DataSet({
      ...formDs(),
    });
  }

  /**
   *检验单信息添加
   *
   * @memberof ProductionTasks
   */
  @Bind()
  addInspectionOrder() {
    const { inspectionOrder } = this.state;
    const len = inspectionOrder.length + 1;
    const newInspectionOrder = [...inspectionOrder, len];
    this.setState(() => ({ inspectionOrder: newInspectionOrder }));
  }

  /**
   *追加生产概况
   *
   * @memberof ProductionTasks
   */
  @Bind()
  handleProductionOverview() {
    const { productionOverview } = this.state;
    const len = productionOverview.length + 1;
    const newProductionOverview = [...productionOverview, len];
    this.setState(() => ({ productionOverview: newProductionOverview }));
  }

  /**
   *追加安灯
   *
   * @memberof ProductionTasks
   */
  @Bind()
  handleAddAndon() {
    const { andonList } = this.state;
    const len = andonList.length + 1;
    const newAndonList = [...andonList, len];
    this.setState(() => ({ andonList: newAndonList }));
  }

  /**
   *重置
   *
   */
  @Bind()
  handleReset() {
    const { dispatch } = this.props;
    this.myFormDs.current.reset();
    dispatch({
      type: 'productionTasksModel/handleReset',
      payload: { status: true },
    });
    setTimeout(() => {
      dispatch({
        type: 'productionTasksModel/handleReset',
        payload: { status: false },
      });
    }, 600);
  }

  /**
   *生成
   *
   */
  @Bind()
  handleGenerate() {
    this.myFormDs.validate(false, true).then((res) => {
      if (!res) return false;
      const { productionTasksModel } = this.props;
      const { lines, productionOverview, rightScrollList } = productionTasksModel;
      const dataList = this.myFormDs.current && this.myFormDs.current.toData();
      const sendLines = lines ? Object.values(lines) : [];
      const sendProductionOverview = productionOverview ? Object.values(productionOverview) : [];
      const sendRightScrollList = rightScrollList ? Object.values(rightScrollList) : [];
      sendRightScrollList.forEach((item, index) => {
        Object.assign(item, { key: index });
      });
      // 模拟左侧接口数据
      const qualityControlList = {
        okPercent: parseFloat(Number(dataList.okPercent) / 100).toFixed(4),
        ngPercent: parseFloat(Number(dataList.ngPercent) / 100).toFixed(4),
        completedPercent: parseFloat(Number(dataList.completedPercent) / 100).toFixed(4),
        lines: sendLines,
      };
      // 模拟中间当月完成量
      const totalAmountMonth = [
        {
          1: 1,
          PRODUCT_SUM: dataList.MONTH_PRODUCT_SUM_DAY,
          NEW_MO_SUM: dataList.NEW_MO_SUM_DAY,
          RUNNING_MO_SUM: dataList.RUNNING_MO_SUM_DAY,
          COMPLETED_MO_SUM: dataList.COMPLETED_MO_SUM_DAY,
          PLAN_PRODUCT: dataList.PLAN_PRODUCT_DAY,
          mark: '当日',
        },
        {
          2: 2,
          PRODUCT_SUM: dataList.MONTH_PRODUCT_SUM_WEEK,
          NEW_MO_SUM: dataList.NEW_MO_SUM_WEEK,
          RUNNING_MO_SUM: dataList.RUNNING_MO_SUM_WEEK,
          COMPLETED_MO_SUM: dataList.COMPLETED_MO_SUM_WEEK,
          PLAN_PRODUCT: dataList.PLAN_PRODUCT_WEEK,
          mark: '当周',
        },
        {
          3: 3,
          PRODUCT_SUM: dataList.MONTH_PRODUCT_SUM,
          NEW_MO_SUM: dataList.NEW_MO_SUM,
          RUNNING_MO_SUM: dataList.RUNNING_MO_SUM,
          COMPLETED_MO_SUM: dataList.COMPLETED_MO_SUM,
          PLAN_PRODUCT: dataList.PLAN_PRODUCT,
          mark: '当月',
        },
      ];
      // 中间产量统计
      const lineChartContainer = [];
      for (let i = 0; i < 7; i++) {
        const item = `COMPLETED_MO_SUM_${i + 1}`;
        lineChartContainer.push([
          moment()
            .subtract(7 - i, 'days')
            .format('YYYY-MM-DD'),
          dataList[item],
        ]);
      }
      // 右侧安灯异常
      const anDon = {
        CLOSED_ANDON: dataList.CLOSED_ANDON,
        RESPONSED_ANDON: dataList.RESPONSED_ANDON,
        TRIGGERED_ANDON: dataList.TRIGGERED_ANDON,
        TOTAL_ABNORMAL: dataList.totalAbnormal,
      };
      const sendDataList = {
        qualityControlList,
        totalAmountMonth,
        lineChartContainer,
        productionOverviewList: sendProductionOverview,
        anDon,
        rightScrollList: sendRightScrollList,
        proLineMove: dataList.proLineMove,
      };
      localStorage.setItem('ProductionMonitoringDashboardList', JSON.stringify(sendDataList));
      const { history } = this.props;
      const url = '/ldab/production-monitoring-dashboard';
      history.push(url);
    });
  }

  render() {
    const { inspectionOrder, isSubmit, productionOverview, andonList } = this.state;
    return (
      <Fragment>
        <Header title="生产任务">
          <Button color="blue" onClick={this.handleGenerate}>
            生成
          </Button>
          <Button onClick={this.handleReset}>重置</Button>
        </Header>
        <Content>
          <div className={style['production-tasks-my-box']}>
            <section>
              <h3>产线动态</h3>
              <Form dataSet={this.myFormDs} labelWidth={[70]}>
                <TextField name="proLineMove" />
              </Form>
              <h3>质量监控</h3>
              <Form dataSet={this.myFormDs} columns={2} labelWidth={[80, 70]}>
                <TextField name="okPercent" />
                <TextField name="ngPercent" />
                <TextField name="completedPercent" />
              </Form>
              <h3>
                检验单信息 &nbsp;&nbsp;&nbsp;&nbsp;
                <Button color="purple" style={{ float: 'right' }} onClick={this.addInspectionOrder}>
                  添加
                </Button>
              </h3>
              {inspectionOrder.map((item) => (
                <Fragment key={item}>
                  {item !== 1 ? <div className={style['inspection-order-segmentation']} /> : null}
                  <InspectionOrder dataIndex={item} isSubmit={isSubmit} />
                </Fragment>
              ))}
            </section>
            <section>
              <h3>当天生产完成总量</h3>
              <Form dataSet={this.myFormDs} columns={2} labelWidth={[70, 80]}>
                <TextField name="MONTH_PRODUCT_SUM_DAY" />
                <TextField name="PLAN_PRODUCT_DAY" />
                <TextField name="NEW_MO_SUM_DAY" />
                <TextField name="RUNNING_MO_SUM_DAY" />
                <TextField name="COMPLETED_MO_SUM_DAY" />
              </Form>
              <h3>当周生产完成总量</h3>
              <Form dataSet={this.myFormDs} columns={2} labelWidth={[70, 80]}>
                <TextField name="MONTH_PRODUCT_SUM_WEEK" />
                <TextField name="PLAN_PRODUCT_WEEK" />
                <TextField name="NEW_MO_SUM_WEEK" />
                <TextField name="RUNNING_MO_SUM_WEEK" />
                <TextField name="COMPLETED_MO_SUM_WEEK" />
              </Form>
              <h3>当月生产完成总量</h3>
              <Form dataSet={this.myFormDs} columns={2} labelWidth={[70, 80]}>
                <TextField name="MONTH_PRODUCT_SUM" />
                <TextField name="PLAN_PRODUCT" />
                <TextField name="NEW_MO_SUM" />
                <TextField name="RUNNING_MO_SUM" />
                <TextField name="COMPLETED_MO_SUM" />
              </Form>
              <h3>产量统计</h3>
              <Form dataSet={this.myFormDs} columns={2} labelWidth={[70, 70, 70]}>
                <TextField name="COMPLETED_MO_SUM_1" />
                <TextField name="COMPLETED_MO_SUM_2" />
                <TextField name="COMPLETED_MO_SUM_3" />
                <TextField name="COMPLETED_MO_SUM_4" />
                <TextField name="COMPLETED_MO_SUM_5" />
                <TextField name="COMPLETED_MO_SUM_6" />
                <TextField name="COMPLETED_MO_SUM_7" />
              </Form>
              <h3>
                生产概况 &nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                  color="purple"
                  style={{ float: 'right' }}
                  onClick={this.handleProductionOverview}
                >
                  添加
                </Button>
              </h3>
              {productionOverview.map((item) => (
                <Fragment key={item}>
                  {item !== 1 ? <div className={style['inspection-order-segmentation']} /> : null}
                  <ProductionOverview dataIndex={item} isSubmit={isSubmit} />
                </Fragment>
              ))}
            </section>
            <section>
              <h3>安灯异常监控</h3>
              <Form dataSet={this.myFormDs} columns={2} labelWidth={[70, 70]}>
                <TextField name="totalAbnormal" />
                <TextField name="TRIGGERED_ANDON" />
                <TextField name="RESPONSED_ANDON" />
                <TextField name="CLOSED_ANDON" />
              </Form>
              <h3>
                安灯信息 &nbsp;&nbsp;&nbsp;&nbsp;
                <Button color="purple" style={{ float: 'right' }} onClick={this.handleAddAndon}>
                  添加
                </Button>
              </h3>
              {andonList.map((item) => (
                <Fragment key={item}>
                  {item !== 1 ? <div className={style['inspection-order-segmentation']} /> : null}
                  <AndonInformation dataIndex={item} isSubmit={isSubmit} />
                </Fragment>
              ))}
            </section>
          </div>
        </Content>
      </Fragment>
    );
  }
}
