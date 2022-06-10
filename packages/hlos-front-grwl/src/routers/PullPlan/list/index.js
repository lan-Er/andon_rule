/*
 * @module: 拉货计划主页
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-27 14:48:34
 * @LastEditTime: 2021-06-17 15:38:53
 * @copyright: Copyright (c) 2020,Hand
 */
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo } from 'react';
import { Table, DataSet, Button, Lov, Select, TextField, DatePicker } from 'choerodon-ui/pro';

import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';

import fromDs from '../store/index';
import LineTable from '../lineTable';
import lineDs from '../store/lineDs';
import TableQueryFrom from '@/components/TableQueryFrom';

function PullPlanTable({ store, history }) {
  const lineTableDs = new DataSet(lineDs());
  const headerDs = useDataSet(() => new DataSet(fromDs(store)), PullPlanTable);
  const { queryLoading, showLineTable } = store;
  useEffect(() => {
    store.getUserSetting();
  }, []);

  useEffect(() => {
    return () => {
      const {
        location: { pathname = '' },
      } = history;
      if (pathname.includes('/grwl/pull-plans/list')) {
        store.setShowLineTable(false);
        if (headerDs && headerDs.current) {
          headerDs.current.records.clear();
        }
        if (headerDs && headerDs.queryDataSet) {
          headerDs.queryDataSet.reset();
        }
      }
    };
  }, [history]);

  useEffect(() => {
    const needQeury = sessionStorage.getItem('goBackNeedQuery');
    if (needQeury) {
      headerDs.query().then(() => {
        sessionStorage.removeItem('goBackNeedQuery');
      });
    }
  }, []);

  /**
   * @description: 选择
   * @param {*} record
   * @return {*}
   */
  function handleSelect({ record }) {
    const demandQty = record.get('demandQty') || 0;
    const generatedQty = record.get('generatedQty') || 0;
    const pullQty = Number(demandQty) - Number(generatedQty);
    record.set('pullQty', pullQty);
  }
  useDataSetEvent(headerDs, 'select', handleSelect);

  /**
   * @description: 取消选择
   * @param {*} record
   * @return {*}
   */
  function handleUnSelect({ record }) {
    record.reset();
  }
  useDataSetEvent(headerDs, 'unSelect', handleUnSelect);

  /**
   * @description: 全选
   * @param {*} dataSet
   * @return {*}
   */
  function handleSelectAll({ dataSet }) {
    const { records } = dataSet;
    records.forEach((item) => {
      const demandQty = item.get('demandQty') || 0;
      const generatedQty = item.get('generatedQty') || 0;
      const pullQty = Number(demandQty) - Number(generatedQty);
      item.set('pullQty', pullQty);
    });
  }
  useDataSetEvent(headerDs, 'selectAll', handleSelectAll);

  /**
   * @description: 取消全选
   * @param {*} dataSet
   * @return {*}
   */
  function handleUnSelectAll({ dataSet }) {
    const { records } = dataSet;
    records.forEach((item) => {
      item.reset();
    });
  }
  useDataSetEvent(headerDs, 'unSelectAll', handleUnSelectAll);

  const getColumns = useMemo(() => {
    return [
      {
        name: 'planBatchNum',
        lock: 'left',
        align: 'center',
        width: 160,
      },
      { name: 'planNum', lock: 'left', align: 'center', width: 160 },
      { name: 'itemCode', align: 'center', width: 120 },
      { name: 'featureCode', align: 'center' },
      { name: 'itemDescription', align: 'center', width: 200, tooltip: 'overflow' },
      { name: 'demandQty', align: 'center' },
      { name: 'generatedQty', align: 'center' },
      {
        name: 'pullQty',
        align: 'center',
        editor: (record) => {
          const { isSelected } = record;
          return isSelected;
        },
      },
      { name: 'onhandQty', align: 'center' },
      { name: 'demandDate', align: 'center', width: 160 },
      { name: 'planStatusMeaning', align: 'center' },
      { name: 'issueName', align: 'center' },
      { name: 'issueDate', align: 'center', width: 160 },
      { name: 'rejectName', align: 'center' },
      { name: 'rejectDate', align: 'center', width: 160 },
      { name: 'rejectReason', align: 'center', width: 160 },
      { name: 'remark', align: 'center', width: 200 },
    ];
  }, []);

  /**
   * @description: 去往检查页
   * @param {*} record
   * @return {*}
   */
  function handleGoDetails() {
    // event.stopPropagation(); // 防止触发点击某行查询行数据
    const { selected } = headerDs;
    if (selected.length <= 0) {
      notification.warning({ message: '至少选择一条数据' });
      return;
    }
    const planIdList = selected.map((item) => {
      return { planId: item.get('planId'), pullQty: item.get('pullQty') };
    });
    sessionStorage.setItem('grwlPlanIdList', JSON.stringify(planIdList));
    history.push(`/grwl/pull-plans/details`);
  }

  /**
   * @description: 查询
   * @param {*}
   * @return {*}
   */
  function handleQuery() {
    store.setQueryLoading(true);
    headerDs
      .query()
      .then(() => {
        store.setQueryLoading(false);
        store.setShowLineTable(false);
      })
      .catch(() => {
        store.setQueryLoading(false);
      });
  }

  function handleClickRow(record) {
    const pullShipPlanId = record.get('planId');
    return {
      onClick: () => handleQueryLine(pullShipPlanId),
    };
  }

  /**
   * @description: 行查询
   * @param {*} pullShipPlanId
   * @return {*}
   */
  function handleQueryLine(pullShipPlanId) {
    if (!showLineTable) {
      store.setShowLineTable(true);
    }
    lineTableDs.setQueryParameter('pullShipPlanId', pullShipPlanId);
    lineTableDs.query();
  }
  return (
    <Fragment>
      <Header title="拉动发货计划">
        <Button onClick={handleGoDetails}>检查</Button>
      </Header>
      <Content>
        <TableQueryFrom
          dataSet={headerDs.queryDataSet}
          onClickQueryCallback={handleQuery}
          queryLoading={queryLoading}
        >
          <TextField name="planNum" />
          <Select name="planStatusList" noCache />
          <Lov name="itemObj" noCache />
          <TextField name="issueName" />
          <DatePicker name="issueDateStart" />
          <DatePicker name="issueDateEnd" />
        </TableQueryFrom>
        <Table
          dataSet={headerDs}
          columns={getColumns}
          queryBar="none"
          onRow={({ record }) => handleClickRow(record)}
        />
        {showLineTable ? <LineTable dataSet={lineTableDs} /> : null}
      </Content>
    </Fragment>
  );
}
export default inject('store')(withRouter(observer(PullPlanTable)));
