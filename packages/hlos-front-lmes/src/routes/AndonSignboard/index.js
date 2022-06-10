/*
 * @Description: 安灯看板
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-08 16:23:35
 * @LastEditors: 赵敏捷
 */

/* eslint-disable no-console */
import echarts from 'echarts';
import { Button, DataSet, Form, Lov, Modal, Select } from 'choerodon-ui/pro';
import React, { useCallback, useEffect, useState, useMemo } from 'react';

import intl from 'utils/intl';
import request from 'utils/request';
import codeConfig from '@/common/codeConfig';
import { Header } from 'components/Page';
import webSocketManager from 'utils/webSoket';
import { getResponse } from 'hzero-front/lib/utils/utils';
import { getCurrentOrganizationId, getCurrentUserId } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';

import { HLOS_LMDS, HLOS_LMES } from 'hlos-front/lib/utils/config';
import andonSignboardDS from '../../stores/andonSignboardDS';
import InfiniteVirtualScrollList from './infiniteVirtualScrollList';
import styles from './index.module.less';

const intlPrefix = 'lmes.andonSignboard';
const modalKey = Modal.key();
let modal = null;
const { common } = codeConfig.code;
const tenantId = getCurrentOrganizationId();
const userId = getCurrentUserId();
const debounce = (fun, timeout = 100) => {
  let timeId;
  return () => {
    if (timeId) clearTimeout(timeId);
    timeId = setTimeout(() => {
      fun();
      timeId = null;
    }, timeout);
  };
};
const ModalContent = ({ ds }) => (
  <Form dataSet={ds} columns={1}>
    <Lov name="meOuObj" />,
    <Lov name="prodLineObj" />,
    <Lov name="workcellObj" />,
    <Lov name="andonClassObj" />,
    <Select name="signboardPeriod" />,
  </Form>
);

function AndonSignBoard() {
  const ds = useMemo(() => new DataSet(andonSignboardDS()), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultMeOu, setDefaultMeOu] = useState(null);
  const [websocketInit, setWebSocketInit] = useState(false);
  const [averageTimes, setAverageTimes] = useState(null);
  const [pendingList, setPendingList] = useState([]);
  const [processingList, setProcessingList] = useState([]);
  const [pieChartInstance, setPieChartInstance] = useState(null);
  const [lineChartInstance, setLineChartInstance] = useState(null);

  const handleSendFilterParams = useCallback(
    async (params) => {
      const res = request(`${HLOS_LMES}/v1/${tenantId}/andon-journals/socket`, {
        method: 'POST',
        body: params || {
          organizationId: defaultMeOu && defaultMeOu.meOuId,
          period: 'WEEK',
          userId,
        },
      });
      getResponse(res, () => {
        notification.error({
          message: intl.get(`${intlPrefix}.view.warning.failedToSendMessage`).d('数据发送失败'),
        });
      });
    },
    [defaultMeOu]
  );

  async function handleSearch() {
    const res = await ds.validate(false, false);
    if (res) {
      const { current: record } = ds;
      const meOuId = record.get('meOuId');
      const prodLineId = record.get('prodLineId');
      const workcellId = record.get('workcellId');
      const andonClassId = record.get('andonClassId');
      const signboardPeriod = record.get('signboardPeriod');
      handleSendFilterParams({
        organizationId: meOuId,
        prodLineId,
        workcellId,
        andonClassId,
        period: signboardPeriod,
        userId,
      });
      if (modal) {
        modal.close();
      }
    }
  }

  function handleReset() {
    ds.reset();
    ds.current.set('meOuObj', defaultMeOu);
  }

  function handleFilter() {
    setModalOpen(true);
    modal = Modal.open({
      key: modalKey,
      closable: true,
      title: intl.get('hzero.c7nUI.Table.filterTitle').d('筛选'),
      children: <ModalContent ds={ds} />,
      footer: (
        <div>
          <Button onClick={handleReset}>{intl.get('hzero.common.status.reset').d('重置')}</Button>
          <Button color="primary" onClick={handleSearch}>
            {intl.get('hzero.common.status.search').d('查询')}
          </Button>
        </div>
      ),
      afterClose: () => {
        setModalOpen(false);
      },
    });
  }

  const handleStatusUpdate = useCallback(
    (messageData) => {
      const { message } = messageData;
      try {
        if (message) {
          const _message = JSON.parse(message);
          const { detail } = _message;
          if (Array.isArray(detail)) {
            pieChartInstance.setOption({
              legend: {
                data: detail.map((i) => ({
                  name: i.currentStatusMeaning,
                  icon: 'circle',
                })),
              },
              series: [
                {
                  data: detail
                    .filter((i) => i.amount > 0)
                    .map((i) => ({
                      value: i.amount,
                      name: i.currentStatusMeaning,
                    })),
                },
              ],
            });
          }
        }
      } catch (e) {
        console.error('failed to parse socket data: ', e.message);
      }
    },
    [pieChartInstance]
  );

  const handlePolyLineUpdate = useCallback(
    (messageData) => {
      const { message } = messageData;
      try {
        if (message) {
          const _message = JSON.parse(message);
          const { polyLineDots, averageTimes: avgTimes } = _message;
          if (Array.isArray(polyLineDots)) {
            lineChartInstance.setOption({
              series: [
                {
                  data: polyLineDots.map((i) => i.triggerTimes),
                },
              ],
              xAxis: {
                data: polyLineDots.map((i) => i.date),
              },
            });
          }
          setAverageTimes(avgTimes);
        }
      } catch (e) {
        console.error('failed to parse socket data: ', e.message);
      }
    },
    [lineChartInstance]
  );

  const handleTriggeredUpdate = (messageData) => {
    const { message } = messageData;
    try {
      if (message) {
        const _message = JSON.parse(message);
        setPendingList(_message || []);
      }
    } catch (e) {
      console.error('failed to parse socket data: ', e.message);
    }
  };

  const handleRespondedUpdate = (messageData) => {
    const { message } = messageData;
    try {
      if (message) {
        const _message = JSON.parse(message);
        setProcessingList(_message || []);
      }
    } catch (e) {
      console.error('failed to parse socket data: ', e.message);
    }
  };

  // 初始化 webSocket
  useEffect(() => {
    webSocketManager.initWebSocket();
    return () => {
      webSocketManager.destroyWebSocket();
      request(`${HLOS_LMES}/v1/${tenantId}/andon-journals/socket/${userId}`, {
        method: 'DELETE',
      });
    };
  }, []);

  // socket 绑定事件监听
  useEffect(() => {
    webSocketManager.addListener('HLOS_MES:ANDON_BOARD_STATUS', handleStatusUpdate);
    webSocketManager.addListener('HLOS_MES:ANDON_BOARD_POLYLINE', handlePolyLineUpdate);
    webSocketManager.addListener('HLOS_MES:ANDON_BOARD_TRIGGERED', handleTriggeredUpdate);
    webSocketManager.addListener('HLOS_MES:ANDON_BOARD_RESPONSED', handleRespondedUpdate);
    webSocketManager.socket.onopen = () => {
      console.log('websocket init');
      setWebSocketInit(true);
    };
    webSocketManager.socket.onerror = (e) => {
      console.error('socket error: ', e.message);
    };
    return () => {
      webSocketManager.removeListener('HLOS_MES:ANDON_BOARD_STATUS', handleStatusUpdate);
      webSocketManager.removeListener('HLOS_MES:ANDON_BOARD_POLYLINE', handlePolyLineUpdate);
      webSocketManager.removeListener('HLOS_MES:ANDON_BOARD_TRIGGERED', handleTriggeredUpdate);
      webSocketManager.removeListener('HLOS_MES:ANDON_BOARD_RESPONSED', handleRespondedUpdate);
    };
  }, [handleStatusUpdate, handlePolyLineUpdate]);

  // socket 建立成功之后 根据是否含有默认 meOuId 来做默认筛选数据发送
  useEffect(() => {
    if (websocketInit && defaultMeOu) {
      handleSendFilterParams();
    }
  }, [defaultMeOu, websocketInit, handleSendFilterParams]);

  // 初始化默认组织和绘图
  useEffect(() => {
    let _defaultMeOu = {};

    // set Default meou
    async function queryDefaultMeOu() {
      const res = await request(`${HLOS_LMDS}/v1/${tenantId}/me-ous/lovs/data`, {
        method: 'GET',
        query: { lovCode: common.meOu, defaultFlag: 'Y' },
      });
      if (getResponse(res)) {
        if (res.content[0]) {
          _defaultMeOu = {
            meOuId: res.content[0].meOuId,
            meOuCode: res.content[0].meOuCode,
            organizationName: res.content[0].organizationName,
          };
          setDefaultMeOu(_defaultMeOu);
          ds.current.set('meOuObj', _defaultMeOu);
        }
      }
    }

    queryDefaultMeOu();
    // paint
    const pieChartContainer = document.getElementById('andonPieSignBoard');
    const lineChartContainer = document.getElementById('andonLineSignBoard');
    let _pieChartResize;
    let _lineChartResize;
    if (pieChartContainer) {
      const pieChart = echarts.init(pieChartContainer);
      setPieChartInstance(pieChart);
      const debounceResizeFun = debounce(pieChart.resize, 200);
      _pieChartResize = debounceResizeFun;
      pieChart.setOption({
        color: ['#29BECE', '#F1963A', '#F16549'],
        legend: {
          itemHeight: 6, // 改变圆圈大小
          bottom: '5%',
        },
        label: {
          formatter: '{b}\n{c} - {d}%',
        },
        tooltip: {
          trigger: 'item',
          formatter(params) {
            return `${params.marker}${params.name}${'&nbsp'.repeat(6)}${params.data.value}<br>`;
          },
        },
        series: [
          {
            type: 'pie',
            radius: '55%',
            center: ['50%', '40%'], // 可能需要动态设置
          },
        ],
      });
      window.addEventListener('resize', debounceResizeFun);
    }
    if (lineChartContainer) {
      const lineChart = echarts.init(lineChartContainer);
      setLineChartInstance(lineChart);
      const debounceResizeFun = debounce(lineChart.resize, 200);
      _lineChartResize = debounceResizeFun;
      lineChart.setOption({
        color: ['#29BECE'],
        tooltip: {
          trigger: 'axis',
          formatter({ 0: param }) {
            return `${param.name}<br>${param.marker}${
              param.value === 0
                ? '&nbsp'.repeat(13)
                : '&nbsp'.repeat(13 - param.value.toString().length)
            }${param.value}`;
          },
        },
        grid: {
          x: 60,
          x2: 40,
          y: 20,
          y2: 40,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          // data: generateDateArr('month'),
          axisLine: {
            lineStyle: {
              color: '#DDD',
              width: 2,
            },
          },
          axisLabel: {
            textStyle: {
              color: '#666',
            },
          },
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#DDD',
              width: 2,
            },
          },
          axisLabel: {
            textStyle: {
              color: '#666',
            },
          },
        },
        series: [
          {
            type: 'line',
            symbol: 'circle',
          },
        ],
      });
      window.addEventListener('resize', debounceResizeFun);
    }
    return () => {
      window.removeEventListener('resize', _pieChartResize);
      window.removeEventListener('resize', _lineChartResize);
    };
  }, [ds]);
  return (
    <React.Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.signboard`).d('安灯看板')}>
        <Button icon="filter2" color="primary" onClick={handleFilter}>
          {intl.get('hzero.c7nUI.Table.filterTitle').d('筛选')}
        </Button>
      </Header>
      <div className={styles.wrapper}>
        <div className={styles.andonPieSignBoardWrap}>
          <span className={styles.title}>
            {intl.get(`${intlPrefix}.view.title.signboard.status`).d('安灯当前状态')}
          </span>
          <div className={styles.andonPieSignBoard} id="andonPieSignBoard" />
        </div>
        <div className={styles.andonLineSignBoardWrap}>
          <span className={styles.title}>
            <span className={styles.left}>
              {intl.get(`${intlPrefix}.view.title.triggerStatistic`).d('安灯触发统计')}
            </span>
            <span>
              平均次数：{(averageTimes && Number.parseFloat(averageTimes).toFixed(2)) || '0.00'}
            </span>
          </span>
          <div className={styles.andonLineSignBoard} id="andonLineSignBoard" />
        </div>
        <div className={styles.andonSignBoardPending}>
          <div className={styles.title}>
            {intl.get(`${intlPrefix}.view.title.pending`).d('待处理')}
          </div>
          <InfiniteVirtualScrollList modalOpen={modalOpen} itemType="pending" items={pendingList} />
        </div>
        <div className={styles.andonSignBoardProcessing}>
          <div className={styles.title}>
            {intl.get(`${intlPrefix}.view.title.processing`).d('处理中')}
          </div>
          <InfiniteVirtualScrollList
            modalOpen={modalOpen}
            itemType="processing"
            items={processingList}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default formatterCollections({ code: [`${intlPrefix}`] })(AndonSignBoard);
