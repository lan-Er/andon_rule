/*
 * @module-: 工时单价
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-28 11:04:02
 * @LastEditTime: 2021-07-16 10:33:51
 * @copyright: Copyright (c) 2018,Hand
 */
import { Tag } from 'choerodon-ui';
import queryString from 'query-string';
import { Button as HButton } from 'hzero-ui';
import React, { Fragment, useState, useMemo, useEffect } from 'react';
import { Button, Table, DataSet, Form, Lov, Select } from 'choerodon-ui/pro';

import { openTab } from 'utils/menuTab';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import style from './index.module.less';
import tableHeaderDs from './stores/indexHeaderDs';
import tableLineDs from './stores/indexLineDs';
import useChangeWidth from './useChangeWidth';

const organizationId = getCurrentOrganizationId();
export default function UnitPrice({ history, location }) {
  const changeWidthSlice = useChangeWidth();
  const [showLinList, setShowLineList] = useState(false);
  const [MoreQuery, setMoreQuery] = useState(false);
  const isMoreQuery = useMemo(() => MoreQuery, [MoreQuery]);
  const formHeaderDs = useDataSet(() => new DataSet(tableHeaderDs()), UnitPrice);
  const formLineDs = useDataSet(() => new DataSet(tableLineDs()));

  useEffect(() => {
    const myQuery = sessionStorage.getItem('unitPriceParentQuery') || false;
    if (location.pathname === '/lmds/unit-price/list' && myQuery) {
      formHeaderDs.query(formHeaderDs.currentPage).then(() => {
        sessionStorage.removeItem('unitPriceParentQuery');
      });
    }
    return () => {
      sessionStorage.removeItem('unitPriceParentQuery');
    };
  }, [location.pathname]);

  function handleGoToDetails({ record }) {
    const workPriceId = record.get('workPriceId');
    const pathname = `/lmds/unit-price/edit/${workPriceId}`;
    history.push(pathname);
  }
  function column() {
    const columns = [
      { name: 'workPriceType', lock: 'left', width: 140 },
      { name: 'description', lock: 'left', width: 150, tooltip: 'overflow' },
      { name: 'assignRule', width: 150 },
      {
        name: 'productionObj',
        width: 160,
        renderer: ({ record, value }) =>
          value ? `${record.get('productCode')}-${record.get('productName')}` : null,
        tooltip: 'overflow',
      },
      { name: 'categoryObj' },
      {
        name: 'itemObj',
        width: 180,
        renderer: ({ record, value }) =>
          value ? `${record.get('itemCode')}-${record.get('itemName')}` : null,
        tooltip: 'overflow',
      },
      {
        name: 'operationObj',
        tooltip: 'overflow',
        width: 180,
        renderer: ({ record, value }) =>
          value ? `${record.get('operation')}-${record.get('operationName')}` : null,
      },
      {
        name: 'organizationObj',
        tooltip: 'overflow',
        width: 180,
        renderer: ({ record, value }) =>
          value ? `${record.get('organizationCode')}-${record.get('organizationName')}` : null,
      },
      { name: 'departmentObj', tooltip: 'overflow' },
      {
        name: 'partyObj',
        tooltip: 'overflow',
        width: 180,
        renderer: ({ record, value }) =>
          value ? `${record.get('partyNumber')}-${record.get('partyName')}` : null,
      },
      { name: 'projectNum', tooltip: 'overflow' },
      { name: 'wbsNum', tooltip: 'overflow' },
      { name: 'auditWorkflowId', width: 150, tooltip: 'overflow' },
      { name: 'externalId', tooltip: 'overflow' },
      { name: 'externalNum', tooltip: 'overflow' },
      { name: 'enabledFlag', renderer: yesOrNoRender, tooltip: 'overflow' },
      {
        header: '操作',
        lock: 'right',
        renderer: (record) => <a onClick={() => handleGoToDetails(record)}>编辑</a>,
        align: 'center',
      },
    ];
    return columns;
  }

  function lineColumns() {
    const lineColumn = [
      {
        name: 'lineNum',
        renderer: ({ record, dataSet }) => {
          const { totalCount } = dataSet;
          return totalCount - record.index;
        },
        lock: 'left',
      },
      { name: 'workPriceVersion', lock: 'left' },
      { name: 'description', width: 160 },
      {
        name: 'versionStatus',
        width: 160,
        renderer: ({ value, text }) => <Tag color={lineStatusRender(value)}>{text}</Tag>,
      },
      { name: 'unitPrice' },
      { name: 'currencyObj' },
      { name: 'currentVersionFlag' },
      { name: 'startDate' },
      { name: 'endDate' },
      { name: 'auditor' },
      { name: 'issuedDate', width: 160 },
      { name: 'auditWorkflow', width: 180 },
    ];
    return lineColumn;
  }

  function lineStatusRender(value) {
    if (value === 'NEW') {
      return '#2db7f5';
    } else if (value === 'AUDITING') {
      return 'rgba(0, 0, 255, 0.6)';
    } else if (value === 'PASSED') {
      return 'rgba(18, 230, 18, 0.6)';
    } else {
      return 'gray';
    }
  }

  /**
   * @description: 点击行展开行数据
   * @param {*} record
   * @return {*}
   */
  function handleRow(record) {
    return {
      onClick: () => handleRowClick(record),
    };
  }

  /**
   * @description: 点击行处理逻辑
   * @param {*} record
   * @return {*}
   */
  function handleRowClick(record) {
    const { workPriceId } = record.toData();
    formLineDs.setQueryParameter('workPriceId', workPriceId);
    setShowLineList(true);
    formLineDs.query();
  }

  /**
   * @description: 查询条件
   * @param {*}
   * @return {*}
   */
  const queryBarList = [
    <Select name="workPriceType" />,
    <Lov name="productionObj" clearButton noCache />,
    <Lov name="itemObj" clearButton noCache />,
    <Lov name="categoryObj" clearButton noCache />,
    <Lov name="operationObj" clearButton noCache />,
    <Lov name="organizationObj" clearButton noCache />,
    <Lov name="departmentObj" clearButton noCache />,
    <Lov name="partyObj" clearButton noCache />,
  ];

  /**
   * @description: 重置
   * @param {*}
   * @return {*}
   */
  function handleReset() {
    formHeaderDs.queryDataSet.current.reset();
  }

  /**
   * @description: 查询
   * @param {*}
   * @return {*}
   */
  function handleSearch() {
    formHeaderDs.query();
  }

  /**
   * @description: 点击新增按钮
   * @param {*}
   * @return {*}
   */
  function handleAdd() {
    const pathname = '/lmds/unit-price/create';
    history.push(pathname);
  }

  function handleBatchImport() {
    openTab({
      key: `/himp/commentImport/LMDS.WORK_PRICE`,
      title: '工时单价导入',
      search: queryString.stringify({
        action: '工时单价导入',
      }),
    });
  }

  /**
   * @description: 导出
   * @param {*}
   * @return {*}
   */
  function getExportQueryParams() {
    const queryDataDs =
      formHeaderDs && formHeaderDs.queryDataSet && formHeaderDs.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toJSONData()) : {};
    return {
      ...queryDataDsValue,
      _status: undefined,
    };
  }
  return (
    <Fragment key="unit-price-main-list">
      <Header title="工时单价">
        <Button color="primary" onClick={handleAdd}>
          新增
        </Button>
        <HButton icon="upload" onClick={handleBatchImport}>
          导入
        </HButton>
        <ExcelExport
          requestUrl={`${HLOS_LMDS}/v1/${organizationId}/work-prices/export`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content>
        <div className={style['unit-price-table']}>
          <Form dataSet={formHeaderDs.queryDataSet} columns={changeWidthSlice}>
            {isMoreQuery
              ? queryBarList.slice(0, queryBarList.length)
              : queryBarList.slice(0, changeWidthSlice)}
          </Form>
          <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
            <Button
              onClick={() => {
                setMoreQuery(!MoreQuery);
              }}
            >
              {MoreQuery ? '收起查询' : '更多查询'}
            </Button>
            <Button onClick={handleReset}>重置</Button>
            <Button color="primary" onClick={handleSearch}>
              查询
            </Button>
          </div>
        </div>
        <Table
          dataSet={formHeaderDs}
          columns={column()}
          onRow={({ record }) => handleRow(record)}
          queryBar="null"
          editMode="inline"
        />
        <br />
        {showLinList && <Table dataSet={formLineDs} columns={lineColumns()} queryBar="null" />}
      </Content>
    </Fragment>
  );
}
