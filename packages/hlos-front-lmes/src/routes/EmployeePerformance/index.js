/*
 * @Description: 员工实绩
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-05-28 09:49:36
 */
import React, { Fragment, useEffect, useState } from 'react';
import { Header, Content } from 'components/Page';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import ExcelExport from 'components/ExcelExport';
import moment from 'moment';
import {
  DataSet,
  // DateTimePicker,
  Lov,
  Select,
  DatePicker,
  Form,
  Button,
  PerformanceTable,
  Pagination,
  // Table,
} from 'choerodon-ui/pro';
import { getResponse, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { isUndefined } from 'lodash';
import intl from 'utils/intl';

import { queryLovData } from 'hlos-front/lib/services/api';
import { employeeQueryDS } from '@/stores/employeePerformanceDS';
import './index.less';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

const organizationId = getCurrentOrganizationId();
const tableRef = React.createRef();

const queryFactory = () => new DataSet(employeeQueryDS());

const EmployeePerformance = ({ history }) => {
  // const queryDS = new DataSet(employeeQueryDS());
  const queryDS = useDataSet(queryFactory, EmployeePerformance);
  const [showFlag, setShowFlag] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);
  const [summaryConditions, setSummaryConditions] = useState([]);

  useEffect(() => {
    async function queryDefaultSetting() {
      const res = await queryLovData({ lovCode: 'LMDS.ORGANIZATION', defaultFlag: 'Y' });
      if (getResponse(res) && res.content && res.content[0]) {
        queryDS.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationCode: res.content[0].organizationCode,
          organizationName: res.content[0].organizationName,
        });
      }
    }
    queryDefaultSetting();
  }, []);

  useEffect(() => {
    calcTableHeight(0);
  }, []);

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lmes-employer-performance')[0];
    const queryContainer = document.getElementById('employerPerformanceHeaderQuery');
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 50;
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

  function Columns() {
    return [
      {
        title: '组织',
        dataIndex: 'organizationName',
        width:
          (summaryConditions.length > 0 && summaryConditions.includes('ORGANIZATION_ID')) ||
          !summaryConditions.length > 0
            ? 128
            : 0,
        tooltip: 'overflow',
        fixed: true,
        resizable: true,
        render: ({ rowData }) =>
          `${rowData.organizationCode || ''} ${rowData.organizationName || ''}`,
      },
      {
        title: '班组',
        dataIndex: 'workerGroup',
        width:
          (summaryConditions.length > 0 && summaryConditions.includes('WORKER_GROUP_ID')) ||
          !summaryConditions.length > 0
            ? 128
            : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '员工',
        dataIndex: 'workerName',
        width:
          (summaryConditions.length > 0 && summaryConditions.includes('WORKER_ID')) ||
          !summaryConditions.length > 0
            ? 128
            : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '物料',
        dataIndex: 'itemCode',
        width:
          (summaryConditions.length > 0 && summaryConditions.includes('ITEM_ID')) ||
          !summaryConditions.length > 0
            ? 128
            : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '物料描述',
        dataIndex: 'itemDescription',
        width:
          (summaryConditions.length > 0 && summaryConditions.includes('ITEM_ID')) ||
          !summaryConditions.length > 0
            ? 200
            : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '工序',
        dataIndex: 'operation',
        width:
          (summaryConditions.length > 0 && summaryConditions.includes('OPERATION_ID')) ||
          !summaryConditions.length > 0
            ? 128
            : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '生产线',
        dataIndex: 'prodLineName',
        width:
          (summaryConditions.length > 0 && summaryConditions.includes('PROD_LINE_ID')) ||
          !summaryConditions.length > 0
            ? 128
            : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '工位',
        dataIndex: 'workcellName',
        width:
          (summaryConditions.length > 0 && summaryConditions.includes('WORKCELL_ID')) ||
          !summaryConditions.length > 0
            ? 128
            : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '位置',
        dataIndex: 'locationName',
        width:
          (summaryConditions.length > 0 && summaryConditions.includes('LOCATION_ID')) ||
          !summaryConditions.length > 0
            ? 128
            : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '合格数量',
        dataIndex: 'processOkQty',
        width: 82,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '不合格数量',
        dataIndex: 'processNgQty',
        width: 90,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '报废数量',
        dataIndex: 'scrappedQty',
        width: 82,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '返修数量',
        dataIndex: 'reworkQty',
        width: 82,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '一次合格数量',
        dataIndex: 'firstPassQty',
        width: 106,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '一次合格率',
        dataIndex: 'firstPassRate',
        width: !summaryConditions.length > 0 ? 106 : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: 'MO',
        dataIndex: 'moNum',
        width: !summaryConditions.length > 0 ? 128 : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '任务',
        dataIndex: 'taskNum',
        width: !summaryConditions.length > 0 ? 128 : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '标准工时',
        dataIndex: 'standardWorkTime',
        width: 82,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '实际工时',
        dataIndex: 'processedTime',
        width: 82,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '确认数量',
        dataIndex: 'confirmedQty',
        width: 82,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '确认工时',
        dataIndex: 'confirmedTime',
        width: !summaryConditions.length > 0 ? 82 : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '工时单价',
        dataIndex: 'unitPrice',
        width: !summaryConditions.length > 0 ? 82 : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '确认工资',
        dataIndex: 'confirmedWage',
        width: 82,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '实绩确认标识',
        dataIndex: 'confirmedFlagMeaning',
        width: !summaryConditions.length > 0 ? 82 : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: !summaryConditions.length > 0 ? 200 : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '年份',
        dataIndex: 'calendarYear',
        width: !summaryConditions.length > 0 ? 82 : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '月份',
        dataIndex: 'calendarMonth',
        width: !summaryConditions.length > 0 ? 82 : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '周次',
        dataIndex: 'calendarWeek',
        width: !summaryConditions.length > 0 ? 82 : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '日期',
        dataIndex: 'calendarDayStr',
        width: !summaryConditions.length > 0 ? 100 : 0,
        tooltip: 'overflow',
        resizable: true,
      },
      {
        title: '班次',
        dataIndex: 'calendarShiftMeaning',
        width: !summaryConditions.length > 0 ? 82 : 0,
        tooltip: 'overflow',
        resizable: true,
      },
    ];
  }

  /**
   *跳转到确认实绩
   */
  function handleConfirmEmployee(url) {
    history.push(url);
  }
  function QueryField() {
    return [
      <Lov
        name="organizationObj"
        clearButton
        noCache
        onChange={() => {
          queryDS.queryDataSet.current.set('workerGroupObj', null);
          queryDS.queryDataSet.current.set('workerObj', null);
          queryDS.queryDataSet.current.set('itemObj', null);
          queryDS.queryDataSet.current.set('documentObj', null);
        }}
      />,
      <Lov name="workerGroupObj" clearButton noCache />,
      <Lov name="workerObj" clearButton noCache />,
      <Select name="confirmedFlag" key="confirmedFlag" />,
      <DatePicker
        name="calendarYear"
        mode="year"
        onChange={() => {
          queryDS.queryDataSet.current.set('calendarMonth', null);
          queryDS.queryDataSet.current.set('calendarWeek', null);
        }}
      />,
      <DatePicker
        name="calendarMonth"
        mode="month"
        onChange={(value) => {
          if (value) {
            queryDS.queryDataSet.current.set('calendarYear', moment(value.format('YYYY')));
            queryDS.queryDataSet.current.set('calendarWeek', null);
          } else {
            queryDS.queryDataSet.current.set('calendarWeek', null);
          }
        }}
      />,
      <DatePicker
        name="calendarWeek"
        mode="week"
        onChange={(value) => {
          if (value) {
            queryDS.queryDataSet.current.set('calendarYear', moment(value.format('YYYY')));
            queryDS.queryDataSet.current.set('calendarMonth', moment(value.format('YYYY-MM')));
          }
        }}
      />,
      <Select name="calendarShift" key="calendarShift" />,
      <DatePicker name="startDay" />,
      <DatePicker name="endDay" />,
      <Lov name="itemObj" clearButton noCache />,
      <Lov name="documentObj" clearButton noCache />,
      <Select
        name="summaryConditions"
        key="summaryConditions"
        maxTagCount={3}
        maxTagTextLength={0}
        maxTagPlaceholder={(restValues) => `+${restValues.length}...`}
      />,
    ];
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = queryDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  function handleReset() {
    queryDS.queryDataSet.current.reset();
  }

  async function handleSearch(page = currentPage, pageSize = size) {
    const validateValue = await queryDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLoading(true);
    queryDS.queryDataSet.current.set('page', page - 1);
    queryDS.queryDataSet.current.set('size', pageSize);
    const res = await queryDS.query();
    if (getResponse(res) && res.content) {
      setSummaryConditions(queryDS.queryDataSet.current.get('summaryConditions'));
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
    }
    setShowLoading(false);
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

  return (
    <Fragment>
      <Header title="员工实绩">
        <ExcelExport
          requestUrl={`${HLOS_LMES}/v1/${organizationId}/workerPerformance/export`}
          queryParams={getExportQueryParams}
        />
        <Button
          color="primary"
          onClick={() => handleConfirmEmployee('/lmes/employee-performance/confirm')}
        >
          确认实绩
        </Button>
      </Header>
      <Content>
        <div className="lmes-employer-performance" id="employerPerformanceTable">
          <div id="employerPerformanceHeaderQuery" className="header-query">
            <Form dataSet={queryDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
              {!showFlag ? QueryField().slice(0, 4) : QueryField()}
            </Form>
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                marginLeft: 8,
                marginTop: 10,
              }}
            >
              <Button onClick={handleToggle}>
                {!showFlag
                  ? intl.get('hzero.common.button.viewMore').d('更多查询')
                  : intl.get('hzero.common.button.collected').d('收起查询')}
              </Button>
              <Button onClick={handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => handleSearch()}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <PerformanceTable
            virtualized
            data={dataSource}
            ref={tableRef}
            columns={Columns()}
            height={tableHeight}
            loading={showLoading}
          />
          <Pagination
            pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
            total={totalElements}
            onChange={handlePageChange}
            pageSize={size}
            page={currentPage}
          />
          {/* <Table */}
          {/* dataSet={queryDS} */}
          {/* queryFields={QueryField()} */}
          {/* columns={columns()} */}
          {/* queryFieldsLimit={4} */}
          {/* /> */}
        </div>
      </Content>
    </Fragment>
  );
};

export default EmployeePerformance;
