/*
 * @module: 德禄缺料报表
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-02-05 14:06:39
 * @LastEditTime: 2021-02-22 10:29:55
 * @copyright: Copyright (c) 2020,Hand
 */
import React, { Fragment, useState, useEffect } from 'react';
import { Table, DataSet, Lov, DatePicker, Form, Button } from 'choerodon-ui/pro';

import notification from 'utils/notification';
import ExcelExport from 'components/ExcelExport';
import { Content, Header } from 'components/Page';
import formHeaderDs from '@/stores/shortageReport';
import { HLOS_LRPT } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import style from './index.module.less';

const headerDs = new DataSet(formHeaderDs('lack'));
const lineDs = new DataSet(formHeaderDs('lack-line'));
const organizationId = getCurrentOrganizationId();
export default function ShortageReport() {
  const [disableExport, setDisableExport] = useState(true);
  const [moreQuery, setMoreQuery] = useState(false);
  const [showLine, setShowLine] = useState(false);
  // const isMoreQuery=
  useEffect(() => {
    headerDs.queryDataSet.addEventListener('update', handleUpade);
    return () => {
      headerDs.queryDataSet.removeEventListener('update', handleUpade);
    };
  }, []);

  async function handleUpade({ record, name }) {
    if (name === 'demandDateStart' || name === 'demandDateEnd') {
      const { demandDateStart, demandDateEnd } = record.toData();
      if (demandDateStart && demandDateEnd) {
        setDisableExport(false);
      } else {
        setDisableExport(true);
      }
    }
  }
  /**
   * @description: 序号渲染
   * @param {*} record
   * @return {*}
   */
  function handleIndex({ record: { index } }) {
    return (
      <Fragment>
        <span>{index + 1}</span>
      </Fragment>
    );
  }
  function myColumns() {
    const column = [
      { header: '序号', renderer: handleIndex, width: 82 },
      { name: 'itemObj', width: 180 },
      { name: 'description', width: 280 },
      { name: 'onhandQuantity' },
      { name: 'demandQty' },
      { name: 'lackQty' },
      { name: 'demandDate', width: 200 },
      { name: 'dataDate', width: 200 },
      // { name: 'attribute' },
    ];
    return column;
  }

  /**
   * 导出
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = headerDs && headerDs.queryDataSet && headerDs.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  /**
   * @description: 头行点击查询子行数据
   * @param {*} record
   * @return {*}
   */
  function handleClickRow({ record }) {
    return {
      onClick: () => handleLineQuery(record),
    };
  }

  async function handleLineQuery(record) {
    const myParams = headerDs.queryDataSet.toJSONData()[0];
    for (const k in myParams) {
      if (Object.prototype.hasOwnProperty.call(myParams, k)) {
        lineDs.queryDataSet.current.set(k, myParams[k]);
      }
    }
    lineDs.queryDataSet.current.set('itemId', record.get('itemId'));
    const res = await lineDs.queryDataSet.validate(false, false);
    if (res) {
      setShowLine(true);
      lineDs.query();
    } else {
      notification.warning({ message: '请输入查询必输项' });
    }
  }

  const queryBarList = [
    <Lov name="itemObj" clearButton noCache />,
    <DatePicker name="demandDateStart" />,
    <DatePicker name="demandDateEnd" />,
    <Lov name="wareHouseObj" clearButton noCache />,
  ];
  function handleReset() {
    headerDs.queryDataSet.current.reset();
    setDisableExport(true);
  }
  async function handleSearch() {
    const allowQuery = await headerDs.queryDataSet.validate(false, false);
    if (allowQuery) {
      setShowLine(false);
      headerDs.query();
    }
  }
  return (
    <Fragment key="shortageReport">
      <Header title="缺料报表">
        <ExcelExport
          requestUrl={`${HLOS_LRPT}/v1/${organizationId}/requests/lack-export`}
          queryParams={getExportQueryParams}
          otherButtonProps={{ disabled: disableExport }}
        />
      </Header>
      <Content>
        <div className={style['shortage-report-form']}>
          <Form dataSet={headerDs.queryDataSet} columns={4}>
            {moreQuery ? queryBarList.slice(0, queryBarList.length) : queryBarList.slice(0, 4)}
          </Form>
          <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
            {queryBarList.length > 4 ? (
              <Button
                onClick={() => {
                  setMoreQuery(!moreQuery);
                }}
              >
                {moreQuery ? '收起查询' : '更多查询'}
              </Button>
            ) : null}
            <Button onClick={handleReset}>重置</Button>
            <Button color="primary" onClick={handleSearch}>
              查询
            </Button>
          </div>
        </div>
        <div className={style['shortage-report-list']}>
          <Table dataSet={headerDs} columns={myColumns()} onRow={handleClickRow} queryBar="null" />
          {showLine ? (
            <div style={{ marginTop: '20px' }}>
              <Table dataSet={lineDs} columns={myColumns()} queryBar="null" />
            </div>
          ) : null}
        </div>
      </Content>
    </Fragment>
  );
}
