/*
 * @Description: 生产任务进度报表--Index
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2020-11-05 11:05:22
 * @LastEditors: 那宇
 */

import React, { Fragment, useEffect, useState } from 'react';
import {
  PerformanceTable,
  DataSet,
  Pagination,
  Form,
  Lov,
  Select,
  DateTimePicker,
  Button,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { statusRender } from 'hlos-front/lib/utils/renderer';
import { ExportButton } from 'hlos-front/lib/components';
import { queryLovData } from 'hlos-front/lib/services/api';
import { ListDS } from '@/stores/productTaskProgressReportDS';
import codeConfig from '@/common/codeConfig';
import './index.less';

const { common } = codeConfig.code;
const modelCode = 'ldab.productTaskProgressReport';
const preCode = 'ldab.productionTaskProgressReport.model';
const commonCode = 'ldab.common.model';
const tableRef = React.createRef();

const ProductionTaskProgressReport = () => {
  const [showFlag, setShowFlag] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);

  const listDS = () =>
    new DataSet({
      ...ListDS(),
    });
  const ds = useDataSet(listDS, ProductionTaskProgressReport);

  const columns = [
    {
      title: intl.get(`${commonCode}.organzation`).d('组织'),
      dataIndex: 'organizationName',
      width: 128,
      fixed: true,
      render: ({ rowData }) =>
        `${rowData.organizationCode || ''} ${rowData.organizationName || ''}`,
    },
    {
      title: intl.get(`${commonCode}.taskNum`).d('任务号'),
      dataIndex: 'taskNum',
      width: 128,
      fixed: true,
    },
    {
      title: intl.get(`${commonCode}.item`).d('物料'),
      dataIndex: 'productCode',
      width: 128,
      fixed: true,
    },
    {
      title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      dataIndex: 'productDescription',
      width: 200,
    },
    {
      title: intl.get(`${commonCode}.operation`).d('工序'),
      dataIndex: 'operationName',
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.taskStatus`).d('任务状态'),
      dataIndex: 'taskStatusMeaning',
      width: 90,
      render: ({ rowData }) => statusRender(rowData.taskStatus, rowData.taskStatusMeaning),
    },
    {
      title: intl.get(`${preCode}.completedPercent`).d('完工进度'),
      dataIndex: 'completedPercent',
      width: 90,
    },
    { title: intl.get(`${commonCode}.uom`).d('单位'), dataIndex: 'uomName', width: 80 },
    { title: intl.get(`${preCode}.taskQty`).d('任务数量'), dataIndex: 'taskQty', width: 82 },
    {
      title: intl.get(`${preCode}.executableQty`).d('可执行数量'),
      dataIndex: 'executableQty',
      width: 82,
    },
    { title: intl.get(`${preCode}.okQty`).d('合格数量'), dataIndex: 'processOkQty', width: 82 },
    { title: intl.get(`${preCode}.ngQty`).d('不合格数量'), dataIndex: 'processNgQty', width: 82 },
    {
      title: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
      dataIndex: 'scrappedQty',
      width: 80,
    },
    { title: intl.get(`${preCode}.reworkQty`).d('返修数量'), dataIndex: 'reworkQty', width: 82 },
    {
      title: intl.get(`${preCode}.pendingQty`).d('待处理数量'),
      dataIndex: 'pendingQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.standardWorkTime`).d('标准工时'),
      dataIndex: 'standardWorkTime',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.processedTime`).d('实际工时'),
      dataIndex: 'processedTime',
      width: 82,
    },
    { title: intl.get(`${preCode}.efficiency`).d('工时效率'), dataIndex: 'efficiency', width: 82 },
    { title: intl.get(`${commonCode}.moNum`).d('MO号'), dataIndex: 'documentNum', width: 128 },
    {
      title: intl.get(`${preCode}.planStartTime`).d('计划开始时间'),
      dataIndex: 'planStartTime',
      width: 144,
    },
    {
      title: intl.get(`${preCode}.planEndTime`).d('计划结束时间'),
      dataIndex: 'planEndTime',
      width: 144,
    },
    {
      title: intl.get(`${preCode}.actualStartTime`).d('实际开始时间'),
      dataIndex: 'actualStartTime',
      width: 144,
    },
    {
      title: intl.get(`${preCode}.actualEndTime`).d('实际结束时间'),
      dataIndex: 'actualEndTime',
      width: 144,
    },
    {
      title: intl.get(`${preCode}.supervisor`).d('管理员工'),
      dataIndex: 'supervisorName',
      width: 128,
    },
    {
      title: intl.get(`${commonCode}.prodline`).d('生产线'),
      dataIndex: 'prodLineName',
      width: 128,
    },
    { title: intl.get(`${commonCode}.workcell`).d('工位'), dataIndex: 'workcellName', width: 128 },
    {
      title: intl.get(`${commonCode}.equipment`).d('设备'),
      dataIndex: 'equipmentName',
      width: 128,
    },
    { title: intl.get(`${preCode}.location`).d('位置'), dataIndex: 'locationName', width: 128 },
    { title: intl.get(`${preCode}.worker`).d('员工'), dataIndex: 'workerName', width: 128 },
  ];

  useEffect(() => {
    async function queryDefaultOrg() {
      const res = await queryLovData({
        lovCode: common.organization,
        defaultFlag: 'Y',
      });
      if (getResponse(res) && res && res.content && res.content[0]) {
        const { organizationId, organizationName } = res.content[0];
        if (organizationId && organizationName) {
          ds.queryDataSet.current.set('organizationObj', {
            meOuId: organizationId,
            meOuName: organizationName,
          });
          await ds.query();
        }
      }
    }
    queryDefaultOrg();
  }, []);

  useEffect(() => {
    function handleResize() {
      calcTableHeight(dataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource]);

  function QueryField() {
    return [
      <Lov
        name="organizationObj"
        clearButton
        noCache
        onChange={() => {
          ds.queryDataSet.current.set('equipmentObj', {});
          ds.queryDataSet.current.set('prodLineObj', {});
          ds.queryDataSet.current.set('workcellObj', {});
        }}
      />,
      <Lov name="itemObj" clearButton noCache />,
      <Lov name="moNumObj" clearButton noCache />,
      <Lov name="operationObj" clearButton noCache />,
      <DateTimePicker name="planStartTimeFrom" />,
      <DateTimePicker name="planStartTimeTo" />,
      <DateTimePicker name="planEndTimeFrom" />,
      <DateTimePicker name="planEndTimeTo" />,
      <Lov name="prodLineObj" clearButton noCache />,
      <Lov name="workcellObj" clearButton noCache />,
      <Lov name="equipmentObj" clearButton noCache />,
      <Lov name="workerObj" clearButton noCache />,
      <Lov name="supervisorObj" clearButton noCache />,
      <Lov name="taskObj" clearButton noCache />,
      <Select name="taskStatus" noCache />,
    ];
  }

  async function handleSearch(page = currentPage, pageSize = size) {
    const validateValue = await ds.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLoading(true);
    ds.queryDataSet.current.set('page', page - 1);
    ds.queryDataSet.current.set('size', pageSize);
    // const res = await executeLines(ds.queryDataSet.current.toJSONData());
    const res = await ds.query();
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
    }
    setShowLoading(false);
  }

  function handleReset() {
    ds.queryDataSet.current.reset();
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

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('ldab-product-task-progress')[0];
    const queryContainer = document.getElementById('productTaskProgressHeaderQuery');
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
    <Fragment>
      <Header title={intl.get(`${modelCode}.view.title.index`).d('生产任务进度报表')}>
        <ExportButton
          reportCode={['LMES.TASK_PROGRESS']}
          exportTitle={intl.get(`${modelCode}.buton.export`).d('生产任务进度报表导出')}
        />
      </Header>
      <Content className="ldab-product-task-progress">
        <div id="productTaskProgressHeaderQuery" className="header-query">
          <Form dataSet={ds.queryDataSet} columns={4} style={{ flex: 'auto' }}>
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
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        {/* <Table
          dataSet={ds}
          columns={columns}
          columnResizable="true"
          editMode="inline"
          queryFieldsLimit={4}
        /> */}
        <PerformanceTable
          virtualized
          data={dataSource}
          ref={tableRef}
          columns={columns}
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
      </Content>
    </Fragment>
  );
};

export default formatterCollections({
  code: ['ldab.productionTaskProgressReport', 'ldab.common'],
})(ProductionTaskProgressReport);
