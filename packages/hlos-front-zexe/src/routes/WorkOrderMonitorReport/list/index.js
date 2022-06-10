import React, { Fragment, useState } from 'react';
import { DataSet, Button, Form, PerformanceTable, Pagination } from 'choerodon-ui/pro';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import ExcelExport from 'components/ExcelExport';
import { isUndefined } from 'lodash';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZEXE } from 'hlos-front/lib/utils/config';

import { ListDS } from '../store/WorkOrderMonitorReport';

const preCode = 'zexe.workOrderMonitorReport';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZEXE}/v1/${organizationId}/`;

const WorkOrderMonitorReport = () => {
  const [showFlag, setShowFlag] = useState(false);
  const [tableHeight, setTableHeight] = useState(80);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [size, setSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const listDS = new DataSet(ListDS());
  const ds = useDataSet(listDS);

  const queryField = () => {
    return [];
  };

  // 更多查询
  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight();
  };

  // 重置
  const handleReset = () => {
    ds.queryDataSet.current.reset();
  };

  // 查询
  const handleSearch = async (page = currentPage, pageSize = size) => {
    const validateValue = ds.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLoading(true);
    ds.queryDataSet.current.set('page', page - 1);
    ds.queryDataSet.current.set('size', pageSize);
    // const res = await searchInputration(ds.queryDataSet.current.toJSONData());
    // if (getResponse(res) && res.content) {
    //   setDataSource(res.content);
    //   setTotalElements(res.totalElements || 0);
    //   calcTableHeight(res.content.length);
    // }
    setTotalElements(0);
    setDataSource([]);
    setShowLoading(false);
  };

  // 表格高度
  const calcTableHeight = (dataLength) => {
    const pageContainer = document.getElementsByClassName(
      'zexe-work-order-monitor-report-content'
    )[0];
    const queryContainer = document.getElementById('zexeWorkOrderMonitorReportHeaderQuery');
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
  };

  const handlePageChange = (page, pageSize) => {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setCurrentPage(pageValue);
    setSize(pageSizeValue);
    handleSearch(pageValue, pageSizeValue);
  };

  // 导出参数
  function getExportQueryParams() {
    const formObj = ds && ds.queryDataSet && ds.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    const { moStatus: moStatusList } = fieldsValue;
    return {
      ...fieldsValue,
      moStatusList,
      moStatus: undefined,
    };
  }

  const columns = [];

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.index`).d('生产订单投入比报表')}>
        <ExcelExport
          buttonText="导出"
          requestUrl={`${url}`}
          queryParams={getExportQueryParams}
          method="GET"
        />
      </Header>
      <Content className="zexe-work-order-monitor-report-content">
        <div id="zexeWorkOrderMonitorReportHeaderQuery" className="header-query">
          <Form dataSet={ds.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryField().slice(0, 4) : queryField()}
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
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          columns={columns}
          data={dataSource}
          height={tableHeight}
          loading={showLoading}
        />
        <Pagination
          pageSizeOptions={['10', '20', '50', '100', '200', '500']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
      </Content>
    </Fragment>
  );
};

export default formatterCollections({
  code: ['zexe.workOrderMonitorReport', 'zexe.common'],
})(WorkOrderMonitorReport);
