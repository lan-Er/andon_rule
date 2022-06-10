/*
 * @Description:生产报表
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-11-05 11:18:43
 * @LastEditors: Axtlive
 * @LastEditTime: 2020-12-11 16:43:16
 */

import React, { Fragment, useEffect, useState, useMemo, useCallback } from 'react';

import moment from 'moment';
import echarts from 'echarts';
import { Header, Content } from 'components/Page';
import { userSetting } from 'hlos-front/lib/services/api';
import {
  Lov,
  DataSet,
  Radio,
  Table,
  Icon,
  DatePicker,
  WeekPicker,
  MonthPicker,
} from 'choerodon-ui/pro';

import styles from './style/index.module.less';

import iconSrc from 'hlos-front/lib/assets/icons/icon_production line.png';

import { queryOverview, queryProdLine } from '@/services/productionReportService';

import { QueryDS, TableDS } from '@/stores/ProductionReportDS';

export default function RateOfFinishedProducts() {
  const [hidden, setHidden] = useState(false);
  const [graphOne, setGraphOne] = useState([1, 1, 1, 1, 0, 0, 0]);
  const [graphThree, setGraphThree] = useState([1, 1, 1, 1, 1, 1, 0]);
  const [graphTwoRef, setGraphTwoRef] = useState();
  const [graphFourRef, setGraphFourRef] = useState();
  const [graphFiveRef, setGraphFiveRef] = useState();
  const [checkedValue, setCheckedValue] = useState('DAY');

  const bottomTableDS = useMemo(() => new DataSet(TableDS()), []);
  const queryDS = useMemo(() => new DataSet(QueryDS()), []);

  const [overViewResData, setOverViewResData] = useState({
    productYield: 0,
    productOkPercent: 0,
    semiFinishedYield: 0,
    semiFinishedOkPercent: 0,
    attendance: 0,
  });
  const [lineResData, setLineResData] = useState([]);

  // 表格列
  const initColumns = [
    {
      align: 'left',
      width: 130,
      name: 'itemCode',
    },
    {
      align: 'left',
      width: 330,
      name: 'itemDescription',
    },
    {
      align: 'left',
      width: 130,
      name: 'itemType',
    },
    {
      align: 'left',
      width: 130,
      name: 'itemCategoryName',
    },
    {
      align: 'left',
      width: 62,
      name: 'uomName',
    },
    {
      align: 'right',
      width: 80,
      name: 'executeQty',
    },
    {
      align: 'right',
      width: 92,
      name: 'executeNgQty',
    },
    {
      align: 'right',
      width: 80,
      name: 'scrappedQty',
    },
    {
      align: 'right',
      width: 80,
      name: 'reworkQty',
    },
    {
      align: 'right',
      width: 80,
      name: 'pendingQty',
    },
    {
      align: 'right',
      width: 68,
      name: 'okPercent',
      renderer: ({ record }) => `${record.get('okPercent')}%`,
    },
  ];
  // 表格参数
  const tableProps = {
    dataSet: bottomTableDS,
    columns: initColumns,
    columnResizable: true,
    editMode: 'inline',
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const graphTwoOptions = {
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        labelLine: {
          show: false,
        },
        data: [
          {
            value: (() => {
              if (overViewResData.productOkPercent) {
                return 100 - overViewResData.productOkPercent;
              }
              return 1;
            })(),
            itemStyle: { color: '#f5f5f5' },
          },
          {
            value: (() => {
              if (overViewResData.productOkPercent) {
                return overViewResData.productOkPercent;
              }
              return 0;
            })(),
            itemStyle: { color: '#00B3A9' },
          },
        ],
      },
    ],
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const graphFourOptions = {
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        labelLine: {
          show: false,
        },
        data: [
          {
            value: (() => {
              if (overViewResData.semiFinishedOkPercent) {
                return 100 - overViewResData.semiFinishedOkPercent;
              }
              return 1;
            })(),
            itemStyle: { color: '#f5f5f5' },
          },
          {
            value: (() => {
              if (overViewResData.semiFinishedOkPercent) {
                return overViewResData.semiFinishedOkPercent;
              }
              return 0;
            })(),
            itemStyle: { color: '#00B3A9' },
          },
        ],
      },
    ],
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const graphFiveOptions = {
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        labelLine: {
          show: false,
        },
        data: [
          {
            value: (() => {
              if (overViewResData.attendance) {
                return 100 - overViewResData.attendance;
              }
              return 1;
            })(),
            itemStyle: { color: '#f5f5f5' },
          },
          {
            value: (() => {
              if (overViewResData.attendance) {
                return overViewResData.attendance;
              }
              return 0;
            })(),
            itemStyle: { color: '#F0A45C' },
          },
        ],
      },
    ],
  };

  useEffect(() => {
    if (graphTwoRef && graphFourRef && graphFiveRef) {
      const graphTwo = echarts.init(graphTwoRef);
      const graphFour = echarts.init(graphFourRef);
      const graphFive = echarts.init(graphFiveRef);
      graphTwo.setOption(graphTwoOptions);
      graphFour.setOption(graphFourOptions);
      graphFive.setOption(graphFiveOptions);
    }
  }, [
    graphTwoRef,
    graphFourRef,
    graphFiveRef,
    graphTwoOptions,
    graphFourOptions,
    graphFiveOptions,
  ]);

  useEffect(() => {
    queryDS.create();
    initQueryFunc();
  }, []);

  useEffect(() => {
    if (!hidden && lineResData.length) {
      tableQuery(lineResData[0].prodLineId);
    } else {
      tableQuery();
    }
  }, [hidden]);

  useEffect(() => {
    queryDS.removeEventListener('update', updateBindFn);
    queryDS.addEventListener('update', updateBindFn);
    return () => queryDS.removeEventListener('update', updateBindFn);
  }, [queryDS, updateBindFn, checkedValue]);

  useEffect(() => {
    const dayStart = moment().add(-1, 'days').format('YYYY-MM-DD');
    // 本周
    const weekStart = moment().startOf('week').format('YYYY-MM-DD');
    // 本月
    const monthStart = moment().startOf('month').format('YYYY-MM-DD');
    if (checkedValue === 'DAY') {
      queryDS.current.set('time', dayStart);
    } else if (checkedValue === 'WEEK') {
      queryDS.current.set('time', weekStart);
    } else if (checkedValue === 'MONTH') {
      queryDS.current.set('time', monthStart);
    }
    getOverViewAndLine();
  }, [checkedValue]);

  /**
   * @description: 时间类型|组织|时间变更 绑定函数
   * @param {*} name
   */
  const updateBindFn = useCallback(
    async ({ name }) => {
      if (name === 'time' || name === 'organizationObj') {
        await getOverViewAndLine();
      }
    },
    [getOverViewAndLine, checkedValue]
  );

  /**
   * @description: 进入页面后需要执行的函数
   */
  const initQueryFunc = useCallback(async () => {
    await getUserInfo();
    await getOverViewAndLine();
    await tableQuery();
  }, [getUserInfo, getOverViewAndLine, tableQuery]);

  /**
   * @description: 获取当前用户的默认组织并设置
   */
  const getUserInfo = useCallback(async () => {
    const res = await userSetting({ defaultFlag: 'Y' });
    if (res && res.content && res.content.length) {
      queryDS.current.set('organizationObj', {
        meOuId: res.content[0].meOuId,
        meOuName: res.content[0].organizationName,
      });
    }
  }, [queryDS]);

  /**
   * @description: 获取基础的查询条件
   */
  const getBasicQueryParams = useCallback(() => {
    if (queryDS.current && queryDS.current.data) {
      const { organizationObj } = queryDS.current.data;
      let time = moment().format('YYYY-MM-DD');
      if (queryDS.current.data.time) {
        time = moment(queryDS.current.data.time).format('YYYY-MM-DD');
      }
      const params = {
        timeLimitType: checkedValue,
        startDate: time,
        organizationId: organizationObj?.meOuId ? organizationObj.meOuId : undefined,
      };
      return params;
    }
    return {};
  }, [checkedValue, queryDS]);

  /**
   * @description: 年月日切换
   * @param {*}  选中的 checkedValue
   */
  const handleRadioChange = (val) => {
    if (val) setCheckedValue(val);
  };

  /**
   * @description: 查询 总览 和 产线
   */
  const getOverViewAndLine = useCallback(async () => {
    tempSetGraphOne();
    tempSetGraphThree();
    const params = getBasicQueryParams();
    const res = await Promise.all([queryOverview(params), queryProdLine(params)]);
    setOverViewResData(res[0]);
    setLineResData(res[1]);
    const param = res[1][0]?.prodLineId;
    if (param) {
      await tableQuery(param);
    } else {
      await tableQuery();
    }
  }, [getBasicQueryParams, tableQuery]);

  /**
   * @description: 表格底部表格的查询
   */
  const tableQuery = useCallback(
    async (prodLineId) => {
      const params = getBasicQueryParams();
      const tableQueryParam = {
        ...params,
        prodLineId,
      };
      bottomTableDS.queryParameter = tableQueryParam;
      bottomTableDS.query();
    },
    [bottomTableDS, getBasicQueryParams]
  );

  /**
   * @description: 产线某ITEM点击
   */
  const handleLineClick = (prodLineId) => {
    tableQuery(prodLineId);
  };

  const tempSetGraphOne = () => {
    const arr = [0, 0, 0, 0, 0, 0, 0];
    let res = (Math.random() * 10).toFixed(0);
    if (res > 7) res -= 7;
    for (let i = 0; i < res; i++) {
      arr[i] = 1;
    }
    setGraphOne(arr);
  };
  const tempSetGraphThree = () => {
    const arr1 = [0, 0, 0, 0, 0, 0, 0];
    let res1 = (Math.random() * 10).toFixed(0);
    if (res1 > 7) res1 -= 7;
    for (let i = 0; i < res1; i++) {
      arr1[i] = 1;
    }
    setGraphThree(arr1);
  };

  /**
   * @description: 渲染图一和图三的图形背景色
   * @param {*} 图一和图三对应的数据 data
   */
  const renderColor = (data) => {
    return data ? '#5181F3' : '#f5f5f5';
  };

  /**
   * @description: 渲染出图一和图三
   * @param {*} 图一和图三对应的数据 data
   */
  const renderGraph = (data) => (
    <div
      style={{
        width: '70%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '7px',
          height: '28px',
          backgroundColor: renderColor(data[0]),
        }}
      />
      <div
        style={{
          width: '7px',
          height: '28px',
          backgroundColor: renderColor(data[1]),
        }}
      />
      <div
        style={{
          width: '7px',
          height: '28px',
          backgroundColor: renderColor(data[2]),
        }}
      />
      <div
        style={{
          width: '7px',
          height: '28px',
          backgroundColor: renderColor(data[3]),
        }}
      />
      <div
        style={{
          width: '7px',
          height: '28px',
          backgroundColor: renderColor(data[4]),
        }}
      />
      <div
        style={{
          width: '7px',
          height: '28px',
          backgroundColor: renderColor(data[5]),
        }}
      />
      <div
        style={{
          width: '7px',
          height: '28px',
          backgroundColor: renderColor(data[6]),
        }}
      />
    </div>
  );

  /**
   * @description: 渲染日期维度（日|周|月）
   */
  const renderTimePicker = () => {
    if (checkedValue === 'DAY') {
      return <DatePicker dataSet={queryDS} name="time" placeholder="请选择日期" />;
    }
    if (checkedValue === 'WEEK') {
      return <WeekPicker dataSet={queryDS} name="time" placeholder="请选择周" />;
    }
    return <MonthPicker dataSet={queryDS} name="time" placeholder="请选择月" />;
  };

  /**
   * @description: 渲染产线
   */
  const renderProdLine = () => {
    if (lineResData.length) {
      return lineResData.map((item) => (
        <div
          className={styles['mid-content-item']}
          onClick={() => handleLineClick(item.prodLineId)}
        >
          <div className={styles['item-left']}>
            <img src={iconSrc} alt="" />
            <span>{item.prodLineName || '未知产线'}</span>
          </div>
          <div className={styles['item-right']}>
            <span>总产量</span>
            <span>{item.yield || 0}</span>
            <span>合格率</span>
            <span>{item.okPercent || 0}%</span>
          </div>
        </div>
      ));
    }
  };

  /**
   * @description: 收起展开产线
   */
  const iconClick = () => {
    setHidden(!hidden);
  };

  return (
    <Fragment>
      <div
        className={styles['Production-report']}
        style={{
          width: '100%',
        }}
      >
        <Header>
          <div className={styles['header-search']}>
            <div className={styles['header-search-left']}>
              <div className={styles['header-search-first']}>
                <Radio
                  mode="button"
                  name="day"
                  value="DAY"
                  checked={checkedValue === 'DAY'}
                  onChange={handleRadioChange}
                >
                  日报表
                </Radio>
                <Radio
                  mode="button"
                  name="week"
                  value="WEEK"
                  checked={checkedValue === 'WEEK'}
                  onChange={handleRadioChange}
                >
                  周报表
                </Radio>
                <Radio
                  mode="button"
                  name="month"
                  value="MONTH"
                  checked={checkedValue === 'MONTH'}
                  onChange={handleRadioChange}
                >
                  月报表
                </Radio>
              </div>
            </div>
            <div className={styles['header-search-right']}>
              <Lov dataSet={queryDS} name="organizationObj" placeholder="组织" noCache />
            </div>
          </div>
        </Header>
        <Content>
          <div className={styles['search-title-content']}>{renderTimePicker()}</div>
          <div className={styles['top-info-list']}>
            {/* graphOne */}
            <div className={styles['top-info-list-item']}>
              <div className={styles['list-item-text']}>
                <div className={styles['item-text-title']}>成品产量</div>
                <div className={styles['item-text-number']}>
                  <span>{overViewResData.productYield || 0}</span>
                  <span>/{overViewResData.planProductQty || 0}</span>
                </div>
              </div>
              <div className={styles['finished-product-graph']}>{renderGraph(graphOne)}</div>
            </div>
            {/* graphTwo */}
            <div className={styles['top-info-list-item']}>
              <div className={styles['list-item-text']}>
                <div className={styles['item-text-title']}>成品合格率</div>
                <div className={styles['item-text-number']}>
                  <span>{`${overViewResData.productOkPercent || 0}%`}</span>
                </div>
              </div>
              <div
                className={styles['finished-product-graph']}
                ref={(node) => setGraphTwoRef(node)}
              />
            </div>
            {/* graphThree */}
            <div className={styles['top-info-list-item']}>
              <div className={styles['list-item-text']}>
                <div className={styles['item-text-title']}>半成品产量</div>
                <div className={styles['item-text-number']}>
                  <span>{overViewResData.semiFinishedYield || 0}</span>
                  <span>/{overViewResData.planSemiFinishedQty || 0}</span>
                </div>
              </div>
              <div className={styles['finished-product-graph']}>{renderGraph(graphThree)}</div>
            </div>
            {/* graphFour */}
            <div className={styles['top-info-list-item']}>
              <div className={styles['list-item-text']}>
                <div className={styles['item-text-title']}>半成品合格率</div>
                <div className={styles['item-text-number']}>
                  <span>{`${overViewResData.semiFinishedOkPercent || 0}%`}</span>
                </div>
              </div>
              <div
                className={styles['finished-product-graph']}
                ref={(node) => setGraphFourRef(node)}
              />
            </div>
            {/* graphFive */}
            <div className={styles['top-info-list-item']}>
              <div className={styles['list-item-text']}>
                <div className={styles['item-text-title']}>出勤率</div>
                <div className={styles['item-text-number']}>
                  <span>{`${overViewResData.attendance || 0}%`}</span>
                </div>
              </div>
              <div
                className={styles['finished-product-graph']}
                ref={(node) => setGraphFiveRef(node)}
              />
            </div>
          </div>
          <div className={styles['mid-content']}>
            <div className={styles['expend-or-hide']} onClick={iconClick}>
              <Icon type={hidden ? 'expand_less' : 'expand_more'} />
              <span>产线</span>
            </div>
            <div
              style={{
                width: '100%',
                height: hidden ? '0' : '100px',
                opacity: hidden ? '0' : '1',
                transition: 'all 0.2s',
              }}
            >
              <div className={styles['mid-content-main']}>
                <div className={styles['mid-content-lineOne']}>{renderProdLine()}</div>
                {/* <div className={styles['mid-content-lineTwo']}></div> */}
              </div>
            </div>
          </div>
          <div className={styles['bottom-table']}>
            <Table {...tableProps} />
          </div>
        </Content>
      </div>
    </Fragment>
  );
}
