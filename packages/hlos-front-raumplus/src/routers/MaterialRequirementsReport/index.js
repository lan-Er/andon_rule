/*
 * @module: 物料需求报表
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-02-09 21:00:50
 * @LastEditTime: 2021-02-23 10:33:05
 * @copyright: Copyright (c) 2020,Hand
 */
import React, { Fragment, useState } from 'react';
import { Table, DataSet, Lov, Form, Button } from 'choerodon-ui/pro';

import ExcelExport from 'components/ExcelExport';
import { Content, Header } from 'components/Page';
import formHeaderDs from '@/stores/materialRequirementsReport';
import { HLOS_LRPT } from 'hlos-front/lib/utils/config';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import style from './index.module.less';

const organizationId = getCurrentOrganizationId();
export default function MaterialRequirementsReport() {
  const [moreQuery, setMoreQuery] = useState(false);
  const headerDs = useDataSet(() => new DataSet(formHeaderDs()), MaterialRequirementsReport);
  function myColumns() {
    const column = [
      { name: 'itemObj', width: 180 },
      { name: 'description', width: 280, tooltip: 'overflow' },
      { name: 'demandQty' },
      { name: 'onhandQuantity' },
      { name: 'lackQty', width: 200 },
      { name: 'storedQty' },
      { name: 'warehousingQty' },
    ];
    return column;
  }

  /**
   * 导出
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = headerDs && headerDs.queryDataSet && headerDs.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toJSONData()) : {};
    return { ...queryDataDsValue };
  }

  const queryBarList = [
    <Lov name="itemObj" clearButton noCache />,
    // <Lov name="wareHouseObj" clearButton noCache />,
  ];
  function handleReset() {
    headerDs.queryDataSet.current.reset();
  }
  async function handleSearch() {
    const allowQuery = await headerDs.queryDataSet.validate(false, false);
    if (allowQuery) {
      headerDs.query();
    }
  }
  return (
    <Fragment key="shortageReport">
      <Header title="物料需求状况报表">
        <ExcelExport
          requestUrl={`${HLOS_LRPT}/v1/${organizationId}/requests/item-demand-export`}
          queryParams={getExportQueryParams}
          method="GET"
        />
      </Header>
      <Content>
        <div className={style['shortage-report-form']}>
          <Form dataSet={headerDs.queryDataSet} columns={4}>
            {queryBarList.slice(0, queryBarList.length)}
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
          <Table dataSet={headerDs} columns={myColumns()} queryBar="null" />
        </div>
      </Content>
    </Fragment>
  );
}
