/*
 * @Description: 副产品产出明细统计报表--ExecuteLineReport
 * @Author: 檀建军 <jianjun.tan@hand-china.com>
 * @Date: 2021-05-02 11:20:42
 */

import React, { Fragment, useEffect, useState } from 'react';
import {
  DataSet,
  PerformanceTable,
  Lov,
  Form,
  Button,
  DatePicker,
  Pagination,
} from 'choerodon-ui/pro';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import { Content, Header } from 'components/Page';
import { queryLovData } from 'hlos-front/lib/services/api';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { isEmpty } from 'lodash';
import { getCurrentOrganizationId, getResponse, filterNullValueObject } from 'utils/utils';

import styles from './index.less';

import executeLineDS from '@/stores/executeLineReportDS';

const organizationId = getCurrentOrganizationId();
const intlPrefix = 'kmjx.executeLine';

export default function ExecuteLineReport() {
  const executeDS = useDataSet(() => new DataSet(executeLineDS()), ExecuteLineReport);
  const [dataSource, setDataSource] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);

  useEffect(() => {
    defaultLovSetting();
  }, []);

  function getColumns() {
    return [
      {
        title: intl.get(`${intlPrefix}.moNum`).d('工单号'),
        dataIndex: 'moNum',
        key: 'moNum',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${intlPrefix}.itemCode`).d('装配件'),
        dataIndex: 'itemCode',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${intlPrefix}.worker`).d('操作工'),
        dataIndex: 'workerName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${intlPrefix}.description`).d('物料名称'),
        dataIndex: 'itemDescription',
        width: 150,
      },

      {
        title: intl.get(`${intlPrefix}.executedQty`).d('报工合格数量'),
        dataIndex: 'executedQty',
      },
      {
        title: intl.get(`${intlPrefix}.scrapQuantity`).d('报工报废数量'),
        dataIndex: 'scrapQuantity',
      },
      {
        title: intl.get(`${intlPrefix}.prodLineName`).d('工作中心'),
        dataIndex: 'prodLineName',
      },
      {
        title: intl.get(`${intlPrefix}.prodLineCode`).d('工作中心编码'),
        dataIndex: 'prodLineCode',
      },
      {
        title: intl.get(`${intlPrefix}.byProduct`).d('副产品货品'),
        dataIndex: 'byProduct',
      },
      {
        title: intl.get(`${intlPrefix}.stipulatedNumber`).d('副产品定额'),
        dataIndex: 'stipulatedNumber',
      },
      {
        title: intl.get(`${intlPrefix}.standardQuantity`).d('标准产出数量'),
        dataIndex: 'standardQuantity',
      },
      {
        title: intl.get(`${intlPrefix}.actualQuantity`).d('实际产出数量'),
        dataIndex: 'actualQuantity',
      },
      {
        title: intl.get(`${intlPrefix}.difference`).d('差额'),
        dataIndex: 'difference',
        flexGrow: 1,
      },
    ];
  }

  async function handleSearch(page = currentPage, pageSize = size) {
    const validateValue = await executeDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setListLoading(true);
    executeDS.queryDataSet.current.set('page', page - 1);
    executeDS.queryDataSet.current.set('size', pageSize);
    const res = await executeDS.query();
    if (getResponse(res)) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
    } else {
      setDataSource([]);
      setTotalElements(0);
      calcTableHeight(0);
    }
    setListLoading(false);
  }

  /**
   *设置默认查询条件
   *
   */
  async function defaultLovSetting() {
    const res = await queryLovData({ lovCode: 'LMDS.SINGLE.ME_OU', defaultFlag: 'Y' });
    if (getResponse(res)) {
      if (!isEmpty(res.content) && executeDS.queryDataSet && executeDS.queryDataSet.current) {
        executeDS.queryDataSet.current.set('organizationObj', {
          meOuId: res.content[0].meOuId,
          meOuName: res.content[0].meOuName,
        });
      }
    }
    handleSearch();
  }

  /**
   * getExportQueryParams - 获取导出字段查询参数
   */
  function getExportQueryParams() {
    const queryDataDs = executeDS && executeDS.queryDataSet && executeDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  function handleReset() {
    executeDS.queryDataSet.current.set('moObj', null);
    executeDS.queryDataSet.current.set('itemObj', null);
    executeDS.queryDataSet.current.set('byProductItemObj', null);
    executeDS.queryDataSet.current.set('prodLineObj', null);
    executeDS.queryDataSet.current.set('workerObj', null);
    executeDS.queryDataSet.current.set('executeTimeFrom', null);
    executeDS.queryDataSet.current.set('executeTimeTo', null);
  }

  // 页码更改
  function handlePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setCurrentPage(pageValue);
    setSize(pageSizeValue);
    handleSearch(pageValue, pageSizeValue);
  }

  /**
   * @description: 查询条件
   * @param {*}
   * @return {*}
   */
  const queryBarList = [
    <Lov name="organizationObj" clearButton noCache />,
    <Lov dataSet={executeDS} name="moObj" clearButton noCache />,
    <Lov name="itemObj" clearButton noCache />,
    <Lov name="byProductItemObj" clearButton noCache />,
    <Lov name="prodLineObj" clearButton noCache />,
    <Lov name="workerObj" clearButton noCache />,
    <DatePicker name="executeTimeFrom" key="executeTimeFrom" />,
    <DatePicker name="executeTimeTo" key="executeTimeTo" />,
  ];

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('execute-line-report')[0];
    const queryContainer = document.getElementById('kmjxExeccuteReportForm');
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 75;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight);
    }
  }

  return (
    <Fragment key="kmjxExeccuteReport">
      <Header>
        <ExcelExport
          requestUrl={`/lmes/v1/${organizationId}/execute-lines/excel-kmjx-by-product`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content className="execute-line-report">
        <div className={styles['kmjx-execcute-report-form']} id="kmjxExeccuteReportForm">
          <Form dataSet={executeDS.queryDataSet} columns={3}>
            {queryBarList.slice(0, queryBarList.length)}
          </Form>
          <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          data={dataSource}
          columns={getColumns()}
          height={tableHeight}
          loading={listLoading}
        />
        <Pagination
          style={{ float: 'right' }}
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
      </Content>
    </Fragment>
  );
}
