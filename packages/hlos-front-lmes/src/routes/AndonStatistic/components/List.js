import React, { useState, useEffect, useCallback, Fragment, useMemo } from 'react';
import { Tabs } from 'choerodon-ui';
import { Select } from 'choerodon-ui/pro';
import { connect } from 'dva';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getResponse } from 'hzero-front/lib/utils/utils';
import { queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

import ascIcon from 'hlos-front/lib/assets/icons/asc.svg';
import descIcon from 'hlos-front/lib/assets/icons/desc.svg';
import ListItem from './ListItem';
import ToolTip from './Tooltip';
import { getMaxValueOfKeyInArrayOfObj } from './utils';
import styles from '../index.module.less';

const { TabPane } = Tabs;
const { Option } = Select;
const intlPrefix = 'lmes.andonStatistic';
const { common } = codeConfig.code;
let uid = 0;

function LineChart({
  dispatch,
  filterChange,
  filterData,
  filterOptionsValid,
  setToolTipRec,
  setMouseEnterFlag,
  setMouseAxisData,
}) {
  const [timeTopRef, setTimeTopRef] = useState(null);
  // tab key
  const [tabKey, setTabKey] = useState('CLOSE');
  // all list order
  const [processTimeTopOrder, setProcessTimeTopOrder] = useState('DESC');
  const [responseTimeTopOrder, setResponseTimeTopOrder] = useState('DESC');
  const [triggerTimesTopOrder, setTriggerTimesTopOrder] = useState('DESC');
  const [workCellTriggerTimesTopOrder, setWorkCellTriggerTimesTopOrder] = useState('DESC');
  // container dom ref
  const [triggerTimesRef, setTriggerTimesRef] = useState(null);
  const [workCellTriggerTimesRef, setWorkCellTriggerTimesRef] = useState(null);
  // all andon classes
  const [andonClasses, setAndonClasses] = useState([]);
  // selected andon class
  const [andonClassId, setAndonClassId] = useState({});
  // fetched data && corresponding maxmium value
  const [timeTopData, setTimeTopData] = useState([]);
  const [topCloseTime, setTopCloseTime] = useState(-1);
  const [topResponseTime, setTopResponseTime] = useState(-1);
  const [triggerTimesData, setTriggerTimesData] = useState([]);
  const [topTriggerTime, setTopTriggerTime] = useState(-1);
  const [workCellTriggerTimesData, setWorkCellTriggerTimesData] = useState([]);
  const [topWorkCellTriggerTime, setTopWorkCellTriggerTime] = useState(-1);

  useEffect(() => {
    async function queryAndonClasses() {
      const res = await queryLovData({ lovCode: common.andonClass });
      const content = res?.content;
      if (getResponse(res) && content) {
        setAndonClasses(content);
        setAndonClassId(content[0].andonClassId);
      }
    }
    queryAndonClasses();
  }, []);

  useEffect(() => {
    if (filterChange && filterOptionsValid) {
      resetFilter();
      setTimeout(() => handleQuery('all'), 300);
    }
  }, [filterChange, filterOptionsValid, resetFilter, handleQuery]);

  useEffect(() => {
    handleQuery('queryProcessOrResponseTimeTop');
  }, [tabKey, processTimeTopOrder, responseTimeTopOrder, handleQuery]);

  useEffect(() => {
    handleQuery('queryTriggerTimesRank');
  }, [triggerTimesTopOrder, andonClassId, handleQuery]);

  useEffect(() => {
    handleQuery('queryWorkCellTriggerTimesRank');
  }, [workCellTriggerTimesTopOrder, handleQuery]);

  const resetFilter = useCallback(() => {
    setProcessTimeTopOrder('DESC');
    setResponseTimeTopOrder('DESC');
    setTriggerTimesTopOrder('DESC');
    setWorkCellTriggerTimesTopOrder('DESC');
    setAndonClassId(andonClasses?.[0]?.andonClassId);
    setTabKey('CLOSE');
  }, [andonClasses]);

  const handleQuery = useCallback(
    (actionName) => {
      if (filterOptionsValid === false) {
        return;
      }
      let queryAll = false;
      const payload = {
        page: 0,
        size: 10,
        organizationId: filterData.get('meOuId'),
        prodLineId: filterData.get('prodLineId'),
        period: filterData.get('period'),
        startDate: filterData.get('startDate')?.format(DEFAULT_DATE_FORMAT),
        endDate: filterData.get('endDate')?.format(DEFAULT_DATE_FORMAT),
        // default query paylod for query all
        timeType: 'CLOSE',
        andonClassId: andonClasses?.[0]?.andonClassId,
        direction: 'DESC',
      };
      switch (actionName) {
        case 'queryProcessOrResponseTimeTop':
          payload.timeType = tabKey;
          payload.direction = tabKey === 'CLOSE' ? processTimeTopOrder : responseTimeTopOrder;
          break;
        case 'queryTriggerTimesRank':
          payload.andonClassId = andonClassId;
          payload.direction = triggerTimesTopOrder;
          break;
        case 'queryWorkCellTriggerTimesRank':
          payload.direction = workCellTriggerTimesTopOrder;
          break;
        case 'all':
          queryAll = true;
          break;
        default:
          break;
      }
      if (queryAll) {
        const allActions = [
          'queryProcessOrResponseTimeTop',
          'queryTriggerTimesRank',
          'queryWorkCellTriggerTimesRank',
        ];
        allActions.forEach((action) => {
          dispatch({
            type: `andonStatistic/${action}`,
            payload,
          }).then((res) => {
            handleResponse(action, res);
          });
        });
      } else {
        dispatch({
          type: `andonStatistic/${actionName}`,
          payload,
        }).then((res) => {
          handleResponse(actionName, res);
        });
      }
    },
    [
      dispatch,
      tabKey,
      filterData,
      andonClasses,
      andonClassId,
      processTimeTopOrder,
      responseTimeTopOrder,
      triggerTimesTopOrder,
      workCellTriggerTimesTopOrder,
      filterOptionsValid,
      handleResponse,
    ]
  );

  const handleResponse = useCallback(
    (actionName, res) => {
      function handleProcessOrResponse() {
        setTimeTopData(res);
        if (tabKey === 'CLOSE') {
          setTopCloseTime(getMaxValueOfKeyInArrayOfObj(res, 'closeDuration'));
        } else if (tabKey === 'RESPONSE') {
          setTopResponseTime(getMaxValueOfKeyInArrayOfObj(res, 'responseDuration'));
        }
      }
      function handelTriggerTimesRank() {
        setTriggerTimesData(res || {});
        setTopTriggerTime(getMaxValueOfKeyInArrayOfObj(res.list, 'triggerTimes'));
      }
      function handleWorkCellTriggerTimesRank() {
        setWorkCellTriggerTimesData(res || {});
        setTopWorkCellTriggerTime(getMaxValueOfKeyInArrayOfObj(res.list, 'triggerTimes'));
      }
      switch (actionName) {
        case 'queryProcessOrResponseTimeTop':
          handleProcessOrResponse();
          break;
        case 'queryTriggerTimesRank':
          handelTriggerTimesRank();
          break;
        case 'queryWorkCellTriggerTimesRank':
          handleWorkCellTriggerTimesRank();
          break;
        default:
          break;
      }
    },
    [tabKey]
  );

  function handleOrderChange(orderName) {
    switch (orderName) {
      case 'processTimeTop':
        setProcessTimeTopOrder(processTimeTopOrder === 'DESC' ? 'ASC' : 'DESC');
        break;
      case 'responseTimeTop':
        setResponseTimeTopOrder(responseTimeTopOrder === 'DESC' ? 'ASC' : 'DESC');
        break;
      case 'triggerTimesTop':
        setTriggerTimesTopOrder(triggerTimesTopOrder === 'DESC' ? 'ASC' : 'DESC');
        break;
      case 'workCellTriggerTimesTop':
        setWorkCellTriggerTimesTopOrder(workCellTriggerTimesTopOrder === 'DESC' ? 'ASC' : 'DESC');
        break;
      default:
        break;
    }
  }

  function handleTabClick(key) {
    if (tabKey === key) {
      if (key === 'CLOSE') {
        handleOrderChange('processTimeTop');
      } else if (key === 'RESPONSE') {
        handleOrderChange('responseTimeTop');
      }
    }
  }

  function handleTabChange(key) {
    setTabKey(key);
  }

  function handleTriggerTimeTopSortChange() {
    handleOrderChange('triggerTimesTop');
  }

  function handleWorCellTriggerTimeTopSortChange() {
    handleOrderChange('workCellTriggerTimesTop');
  }

  return (
    <Fragment>
      <div className={styles.listWrap}>
        <div
          className={styles.responseTimeList}
          ref={(node) => {
            setTimeTopRef(node);
          }}
        >
          <Tabs
            activeKey={tabKey}
            onTabClick={(key) => handleTabClick(key)}
            onChange={handleTabChange}
          >
            <TabPane
              tab={
                <Fragment>
                  <span style={{ fontSize: '14px', marginRight: '5px' }}>
                    {intl.get(`${intlPrefix}.view.button.processTimeTop`).d('处理时间TOP')}
                  </span>
                  <img
                    src={processTimeTopOrder === 'DESC' ? descIcon : ascIcon}
                    alt={processTimeTopOrder}
                  />
                </Fragment>
              }
              key="CLOSE"
            >
              {tabKey === 'CLOSE' &&
                timeTopData
                  .slice?.(0, 8)
                  .map?.((rec, index) => (
                    <ListItem
                      key={uid++}
                      color="#29BECE"
                      order={processTimeTopOrder}
                      showProgress={index < 3}
                      text={rec.andonName}
                      value={rec.closeDuration}
                      maxValue={topCloseTime}
                      originalRec={rec}
                      containerRef={timeTopRef}
                      setMouseEnterFlag={setMouseEnterFlag}
                      setMouseAxisData={setMouseAxisData}
                      setToolTipRec={setToolTipRec}
                    />
                  ))}
            </TabPane>
            <TabPane
              tab={
                <Fragment>
                  <span style={{ fontSize: '14px', marginRight: '5px' }}>
                    {intl.get(`${intlPrefix}.view.button.responseTimeTop`).d('响应时间TOP')}
                  </span>
                  <img
                    src={responseTimeTopOrder === 'DESC' ? descIcon : ascIcon}
                    alt={responseTimeTopOrder}
                  />
                </Fragment>
              }
              key="RESPONSE"
            >
              {tabKey === 'RESPONSE' &&
                timeTopData
                  .slice?.(0, 8)
                  .map?.((rec, index) => (
                    <ListItem
                      key={uid++}
                      color="#29BECE"
                      order={responseTimeTopOrder}
                      showProgress={index < 3}
                      text={rec.andonName}
                      value={rec.responseDuration}
                      maxValue={topResponseTime}
                      originalRec={rec}
                      containerRef={timeTopRef}
                      setMouseEnterFlag={setMouseEnterFlag}
                      setMouseAxisData={setMouseAxisData}
                      setToolTipRec={setToolTipRec}
                    />
                  ))}
            </TabPane>
          </Tabs>
        </div>
        <div
          className={styles.triggerTimesList}
          ref={(node) => {
            setTriggerTimesRef(node);
          }}
        >
          <div className={styles.title}>
            <Select
              // defaultActiveFirstOption
              dropdownMatchSelectWidth
              clearButton={false}
              value={andonClassId}
              onChange={(v) => setAndonClassId(v)}
              style={{ maxWidth: '80%' }}
            >
              {andonClasses.map?.((i) => (
                <Option value={i.andonClassId} key={i.andonClassId}>
                  {i.andonClassName}
                </Option>
              ))}
            </Select>
            <img
              src={triggerTimesTopOrder === 'DESC' ? descIcon : ascIcon}
              alt={triggerTimesTopOrder}
              style={{ padding: '0 12px', cursor: 'pointer' }}
              onClick={handleTriggerTimeTopSortChange}
            />
            <span className={styles.titleRight}>
              {triggerTimesData.total
                ? triggerTimesData.total + intl.get(`${intlPrefix}.view.title.times`).d('次')
                : ''}
            </span>
          </div>
          {triggerTimesData.list?.slice?.(0, 8).map?.((rec, index) => (
            <ListItem
              key={uid++}
              color="#FFA958"
              order={triggerTimesTopOrder}
              showProgress={index < 3}
              text={rec.andonName}
              value={rec.triggerTimes}
              maxValue={topTriggerTime}
              containerRef={triggerTimesRef}
              uom={intl.get(`${intlPrefix}.view.title.times`).d('次')}
            />
          ))}
        </div>
        <div
          className={styles.workCellTriggerTimesList}
          ref={(node) => {
            setWorkCellTriggerTimesRef(node);
          }}
        >
          <div className={styles.title}>
            {intl.get(`${intlPrefix}.view.title.triggerTimes`).d('触发次数')}
            <img
              src={workCellTriggerTimesTopOrder === 'DESC' ? descIcon : ascIcon}
              alt={workCellTriggerTimesTopOrder}
              style={{ padding: '0 12px', cursor: 'pointer' }}
              onClick={handleWorCellTriggerTimeTopSortChange}
            />
            <span className={styles.titleRight}>
              {workCellTriggerTimesData.total
                ? workCellTriggerTimesData.total +
                  intl.get(`${intlPrefix}.view.title.times`).d('次')
                : ''}
            </span>
          </div>
          {workCellTriggerTimesData.list?.slice?.(0, 8).map?.((rec, index) => (
            <ListItem
              key={uid++}
              color="#58CC74"
              order={workCellTriggerTimesTopOrder}
              text={rec.workcellName}
              showProgress={index < 3}
              value={rec.triggerTimes}
              maxValue={topWorkCellTriggerTime}
              containerRef={workCellTriggerTimesRef}
              uom={intl.get(`${intlPrefix}.view.title.times`).d('次')}
            />
          ))}
        </div>
      </div>
    </Fragment>
  );
}

function WrappedComponent(props) {
  // tooltip info
  const [toolTipRec, setToolTipRec] = useState({});
  const [mouseEnterFlag, setMouseEnterFlag] = useState(false);
  const [mouseAxisData, setMouseAxisData] = useState({ x: 0, y: 0 });
  const MemorizedLineChart = useMemo(
    () => (
      <LineChart
        setToolTipRec={setToolTipRec}
        setMouseEnterFlag={setMouseEnterFlag}
        setMouseAxisData={setMouseAxisData}
        {...props}
      />
    ),
    [props]
  );
  return (
    <React.Fragment>
      <ToolTip record={toolTipRec} mouseEnterFlag={mouseEnterFlag} mouseAxisData={mouseAxisData} />
      {MemorizedLineChart}
    </React.Fragment>
  );
}

export default connect(({ andonStatistic }) => ({
  filterChange: andonStatistic.filterChange,
}))(formatterCollections({ code: [`${intlPrefix}`] })(WrappedComponent));
