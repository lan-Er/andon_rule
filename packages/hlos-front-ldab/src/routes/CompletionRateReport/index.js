/*
 * @Description: 加工完成率报表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-22 15:44:22
 */

import React, { useState, useMemo, useEffect } from 'react';
import echarts from 'echarts';
import { DatePicker, Radio, Form, Lov, DataSet, Button, Icon, Table } from 'choerodon-ui/pro';
import { Table as HTable } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { tableScrollWidth, getResponse } from 'utils/utils';
import { userSetting } from 'hlos-front/lib/services/api';
import { ListDS, LineDS } from '@/stores/completionRateReportDS';
import styles from './index.less';

const preCode = 'ldab.completionRateReport';

const CompletionRateReport = () => {
  const listDS = useMemo(() => new DataSet(ListDS()), []);
  const lineDS = useMemo(() => new DataSet(LineDS()), []);

  const [chartRef, setChartRef] = useState();
  const [currentDateType, setCurrentDateType] = useState('month');
  const [currentListType, setCurrentListType] = useState('mo');
  const [hidden, setHidden] = useState(true);
  const [loading, setListLoading] = useState(false);
  const [headList, setHeadList] = useState([]);
  const [columns, setHeadColumns] = useState([]);
  const [resData, setResData] = useState([]);
  const [options, setOptions] = useState({});
  const [currentTile, setCurrentTitle] = useState(null);

  useEffect(() => {
    async function queryDefaultOrg() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const { meOuId, meOuName } = res.content[0];
        listDS.queryDataSet.current.set('organizationObj', [
          {
            meOuId,
            meOuName,
          },
        ]);
      }
    }
    queryDefaultOrg();
  }, []);

  useEffect(() => {
    let extraSeries = [];
    if (currentListType === 'mo') {
      extraSeries = [
        {
          name: '按时完工工单数量',
          type: 'bar',
          barWidth: '50%',
          barGap: '-100%',
          data: (() => {
            if (resData.length) {
              return [...resData.map((i) => i.ontimeCompletedCount)];
            }
            return [];
          })(),
          itemStyle: {
            color: 'rgba(0, 179, 169, 0.16)',
          },
        },
      ];
    }
    const _options = {
      color: ['#00B3A9'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter(params) {
          let html = `${params[0].name}<br>`;
          for (let i = 0; i < params.length; i++) {
            const str = `${params[i].marker + params[i].seriesName}: ${params[i].value}`;
            if (_options.series[params[i].seriesIndex].valueType === 'percent') {
              html += `${str}%`;
            } else {
              html += `${str}<br />`;
            }
          }
          return html;
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
          data: (() => {
            if (resData.length) {
              let timeUmo = '月';
              if (currentDateType === 'week') {
                timeUmo = '周';
              }
              return [...resData.map((i) => `${i.title}${timeUmo}`)];
            }
            return [];
          })(),
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ECE9F1',
              width: 1,
            },
          },
          min: 0,
          max: (() => {
            if (resData.length) {
              if (currentListType === 'mo') {
                return Math.max(...resData.map((i) => i.completedCount));
              }
              return Math.max(...resData.map((i) => i.completedQty));
            }
            return [];
          })(),
          interval: (() => {
            if (resData.length) {
              if (currentListType === 'mo') {
                return Math.max(...resData.map((i) => i.completedCount));
              }
              return Math.max(...resData.map((i) => i.completedQty));
            }
            return [];
          })(),
        },
        {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20,
          position: 'right',
          axisLabel: {
            formatter: '{value} %',
          },
        },
      ],
      series: [
        {
          name: currentListType === 'mo' ? '延期完工工单数量' : '完工任务数量',
          type: 'bar',
          barWidth: '50%',
          itemStyle: {
            barBorderRadius: 5,
          },
          data: (() => {
            if (resData.length) {
              return [...resData.map((i) => i.completedQty)];
            }
            return [];
          })(),
        },
        ...extraSeries,
        {
          name: currentListType === 'mo' ? '工单按时完成率' : '工单加工完成率',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: (() => {
            if (resData.length) {
              return [...resData.map((i) => parseFloat(i.rate))];
            }
            return [];
          })(),
          lineStyle: { color: '#87C9FF' },
          itemStyle: {
            color: '#87C9FF',
          },
          valueType: 'percent',
        },
      ],
    };
    setOptions(_options);
  }, [resData]);

  useEffect(() => {
    if (chartRef) {
      const statisticalChart = echarts.init(chartRef);
      window.removeEventListener('resize', statisticalChart.resize);
      window.addEventListener('resize', statisticalChart.resize);
      statisticalChart.setOption(options);
      return () => window.removeEventListener('resize', statisticalChart.resize);
    }
  }, [chartRef, hidden, options]);

  const lineColumns = useMemo(() => {
    return [
      {
        name: 'organizationName',
        width: 128,
      },
      {
        name: 'moNum',
        width: 128,
      },
      {
        name: 'itemName',
        width: 128,
      },
      {
        name: 'customerName',
        width: 128,
      },
      {
        name: 'delayedDays',
        width: 128,
      },
      {
        name: 'demandQty',
        width: 128,
      },
      {
        name: 'demandDate',
        width: 128,
      },
      {
        name: 'planStartDate',
        width: 128,
      },
      {
        name: 'planEndDate',
        width: 128,
      },
      {
        name: 'actualStartDate',
        width: 128,
      },
      {
        name: 'actualEndDate',
        width: 128,
      },
      {
        name: 'topMoNum',
        width: 128,
      },
      {
        name: 'parentMoNums',
        width: 128,
      },
      {
        name: 'moLevel',
        width: 128,
      },
    ];
  }, []);

  const handleRadioChange = (val, type) => {
    if (type === 'list') {
      setCurrentListType(val);
      listDS.queryDataSet.current.set('dimensionType', val);
    } else {
      setCurrentDateType(val);
      listDS.queryDataSet.current.set('dateType', val);
    }
    handleSearch();
  };

  const handleExpendOrHide = () => {
    setHidden(!hidden);
  };

  const handleRateClick = async (title) => {
    setCurrentTitle(title);
    lineDS.queryParameter = {
      ...listDS.queryDataSet.current.toJSONData(),
      title,
    };
    await lineDS.query();
  };

  const handleSearch = async () => {
    const validateValue = await listDS.queryDataSet.validate(false, false);
    if (!validateValue) return;
    setListLoading(true);
    const res = await listDS.query();
    setListLoading(false);
    if (getResponse(res) && Array.isArray(res)) {
      const _columns = [
        {
          title: intl.get(`${preCode}.model.project`).d('项目'),
          dataIndex: 'project',
        },
      ];
      let _headList = [
        {
          key: 'completedCount',
          project: intl.get(`${preCode}.completedCount`).d('完工工单数量'),
        },
        {
          key: 'ontimeCompletedCount',
          project: intl.get(`${preCode}.ontimeCompletedCount`).d('按时完工工单数量'),
        },
        {
          key: 'delayedCompletedCount',
          project: intl.get(`${preCode}.delayedCompletedCount`).d('延期完工工单数量'),
        },
        {
          key: 'rate',
          project: intl.get(`${preCode}.ontimeCompletedRate`).d('工单按时完成率'),
        },
      ];
      if (listDS.queryDataSet.current.get('dimensionType') === 'count') {
        _headList = [
          {
            key: 'completedQty',
            project: intl.get(`${preCode}.completedQty`).d('完工数量'),
          },
          {
            key: 'makeQty',
            project: intl.get(`${preCode}.makeQty`).d('制造数量'),
          },
          {
            key: 'rate',
            project: intl.get(`${preCode}.completedRate`).d('加工完成率'),
          },
        ];
      }
      res.forEach((i) => {
        const columnItem = {
          title: `${i.title}${
            listDS.queryDataSet.current.get('dateType') === 'week'
              ? intl.get(`${preCode}.model.week`).d('周')
              : intl.get(`${preCode}.model.month`).d('月')
          }`,
          dataIndex: `count${i.title}`,
          render: (text, record) => {
            if (record.key === 'rate') {
              return <a onClick={() => handleRateClick(i.title)}>{text}</a>;
            }
            return text;
          },
        };
        _columns.push(columnItem);
        _headList.forEach((j) => {
          const _j = j;
          _j[`count${i.title}`] = i[_j.key];
        });
      });
      setHeadColumns(_columns);
      setHeadList(_headList);
      setResData(res);
    }
  };

  const handleReset = () => {
    listDS.queryDataSet.current.reset();
  };

  return (
    <div className={styles['completion-rate-report']}>
      <Header>
        <div className={styles['header-search']}>
          <Radio
            mode="button"
            name="week"
            value="week"
            checked={currentDateType === 'week'}
            onChange={handleRadioChange}
          >
            {intl.get(`${preCode}.model.byWeek`).d('按周')}
          </Radio>
          <Radio
            mode="button"
            name="month"
            value="month"
            checked={currentDateType === 'month'}
            onChange={handleRadioChange}
          >
            {intl.get(`${preCode}.model.byMonth`).d('按月')}
          </Radio>
          <DatePicker
            dataSet={listDS.queryDataSet}
            name="startDate"
            placeholder={['开始日期', '结束日期']}
          />
        </div>
      </Header>
      <Content>
        <div>
          <Radio
            mode="button"
            name="mo"
            value="mo"
            checked={currentListType === 'mo'}
            onChange={(val) => handleRadioChange(val, 'list')}
          >
            {intl.get(`${preCode}.model.mo`).d('工单')}
          </Radio>
          <Radio
            mode="button"
            name="quantity"
            value="count"
            checked={currentListType === 'count'}
            onChange={(val) => handleRadioChange(val, 'list')}
          >
            {intl.get(`${preCode}.model.quantity`).d('数量')}
          </Radio>
        </div>
        <div className={styles['query-form']}>
          <Form dataSet={listDS.queryDataSet} labelLayout="placeholder" columns={5}>
            <Lov name="organizationObj" />
            <Lov name="prodLineObj" />
            <Lov name="itemMeObj" />
            <Lov name="categoryObj" />
            <Lov name="secondCategoryObj" />
          </Form>
          <div>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <div className={styles['mid-chart']}>
          <div className={styles['expend-or-hide']} onClick={handleExpendOrHide}>
            <Icon type={hidden ? 'expand_less' : 'expand_more'} />
            <span>{intl.get(`${preCode}.model.report`).d('工单按时完成率图表')}</span>
          </div>
          <div
            style={{
              width: '100%',
              height: hidden ? '0' : '350px',
              opacity: hidden ? '0' : '1',
              transition: 'all 0.1s',
            }}
          >
            <div
              ref={(node) => setChartRef(node)}
              style={{
                width: '100%',
                height: '350px',
              }}
            />
          </div>
        </div>
        <div>
          {/* <Table
            dataSet={listDS}
            columns={columns}
            columnResizable="true"
            queryBar="none"
          /> */}
          <HTable
            loading={loading}
            rowKey="moId"
            bordered
            scroll={{ x: tableScrollWidth(columns) }}
            columns={columns}
            dataSource={headList}
          />
        </div>
        {currentListType === 'mo' && currentTile && (
          <div className={styles['line-table']}>
            <div className={styles['line-table-title']}>
              {currentTile}
              {currentListType === 'week' ? `周` : `月`}延期工单详情
            </div>
            <Table dataSet={lineDS} columns={lineColumns} columnResizable="true" />
          </div>
        )}
      </Content>
    </div>
  );
};

export default CompletionRateReport;
