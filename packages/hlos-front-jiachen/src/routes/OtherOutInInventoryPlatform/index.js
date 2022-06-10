/*
 * @module: 其他出入库平台
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-05-07 14:31:06
 * @LastEditTime: 2021-05-07 14:31:06
 * @copyright: Copyright (c) 2021,Hand
 */
import React, { Fragment, useEffect, useState } from 'react';
import {
  DataSet,
  PerformanceTable,
  Button,
  Lov,
  Select,
  TextField,
  Form,
  DatePicker,
  Pagination,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { statusRender } from 'hlos-front/lib/utils/renderer';
import { getResponse } from 'utils/utils';
import { queryHeadApi, queryLineApi } from '@/services/otherOutInInventoryPlatformService';
import { otherOutInInventoryPlatformDS } from '@/stores/otherOutInInventoryPlatformDS';
import './index.less';

const intlPrefix = 'lwms.otherOutInInventoryPlatform';
const headDS = new DataSet(otherOutInInventoryPlatformDS());

const OtherOutInInventoryPlatform = () => {
  const [onProcess, toggleOnProcess] = useState(false);
  const [headId, setHeadId] = useState(null);
  const [showFlag, setShowFlag] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [size, setSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableHeight, setTableHeight] = useState(80);
  const [lineDataSource, setLineDataSource] = useState([]);
  const [lineTotalElements, setLineTotalElements] = useState(100);
  const [currentLinePage, setLineCurrentPage] = useState(1);
  const [lineSize, setLineSize] = useState(100);
  const [lineLoading, setLineLoading] = useState(false);
  const [lineTableHeight, setLineTableHeight] = useState(80);
  const maxLineShowLength = 3;

  useEffect(() => {
    headDS.addEventListener('query', () => setHeadId(null));
    headDS.queryDataSet.addEventListener('reset', handleReset);
    return () => {
      headDS.reset();
      headDS.removeEventListener('query');
      headDS.queryDataSet.removeEventListener('reset');
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      calcLineTableHeight(lineDataSource.length);
      calcTableHeight(dataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource, lineDataSource]);

  // 头表行
  const headColumns = [
    {
      title: intl.get(`${intlPrefix}.organization`).d('单据类型'),
      dataIndex: 'documentTypeMeaning',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('来源单据类型'),
      dataIndex: 'documentTypeName',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('单号'),
      dataIndex: 'requestNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.issueRequestStatus`).d('单据状态'),
      dataIndex: 'requestStatus',
      width: 84,
      align: 'center',
      resizable: true,
      render: ({ rowData }) => statusRender(rowData.requestStatus, rowData.requestStatusMeaning),
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('执行仓库'),
      dataIndex: 'organizationName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('商业实体'),
      dataIndex: 'partyName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('部门'),
      dataIndex: 'requestDepartmentMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('备注'),
      dataIndex: 'remark',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('创建人'),
      dataIndex: 'creatorName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('创建时间'),
      dataIndex: 'creationDate',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('执行人'),
      dataIndex: 'executorName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('执行时间'),
      dataIndex: 'executedTime',
      flexGrow: 1,
    },
  ];

  const lineColumns = [
    {
      title: intl.get(`${intlPrefix}.organization`).d('行号'),
      dataIndex: 'requestLineNum',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('物料编码'),
      dataIndex: 'itemCode',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('物料名称'),
      dataIndex: 'description',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('单位'),
      dataIndex: 'uomName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.issueRequestStatus`).d('行状态'),
      dataIndex: 'requestLineStatus',
      width: 84,
      align: 'center',
      resizable: true,
      render: ({ rowData }) =>
        statusRender(rowData.requestLineStatus, rowData.requestLineStatusMeaning),
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('数量'),
      dataIndex: 'applyQty',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('批次号'),
      dataIndex: 'lotNumber',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('备注'),
      dataIndex: 'lineRemark',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.organization`).d('来源单据号'),
      dataIndex: 'sourceDocNum',
      flexGrow: 1,
    },
  ];

  const handleHeadRowClick = (record) => {
    if (!onProcess) {
      toggleOnProcess(true);
      const curClickHeadId = record.requestId;
      setHeadId(curClickHeadId);
      handleLineSearch(curClickHeadId);
    }
  };

  function handleReset() {
    headDS.queryDataSet.current.reset();
  }

  /**
   * 计算头表高度
   * @param {*} dataLength 表格当前查询数据量
   */
  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('jc-other-out-in-inventory-platform')[0];
    const queryContainer = document.getElementById('outInInventoryHeaderQuery');
    const lineContainer = document.getElementById('lineTableWrapper');
    const maxTableHeight =
      pageContainer.offsetHeight - queryContainer.offsetHeight - lineContainer.offsetHeight - 75;
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

  /**
   * 计算行表格高度
   * @param {*} dataLength
   */
  function calcLineTableHeight(dataLength) {
    const maxTableHeight = maxLineShowLength * 30 + 33 + 10;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setLineTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setLineTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setLineTableHeight(maxTableHeight);
    }
  }

  /**
   * 头查询
   */
  async function handleSearch(page = currentPage, pageSize = size) {
    const validateValue = await headDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    headDS.queryParameter = {
      ...headDS.queryDataSet.current.toJSONData(),
      page: page - 1,
      size: pageSize,
    };
    setListLoading(true);
    // const res = await headDS.query();
    const res = await queryHeadApi(headDS.queryParameter);
    setListLoading(false);
    if (res && res.content) {
      setHeadId(null);
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
    }
  }

  /**
   * 行查询
   * @param {*} rec
   * @param {*} page
   * @param {*} pageSize
   */
  function handleLineSearch(requestId = headId, page = currentLinePage, pageSize = lineSize) {
    const params = {
      requestId,
      page: page - 1,
      size: pageSize,
    };
    // lineDS.queryParameter = params;
    queryLine(params);
  }

  async function queryLine(params) {
    setLineLoading(true);
    // const lineRes = await lineDS.query();
    const lineRes = await queryLineApi(params);
    setLineLoading(false);
    toggleOnProcess(false);
    if (getResponse(lineRes) && lineRes.content && lineRes.content.length) {
      await setLineDataSource(lineRes.content);
      await setLineTotalElements(lineRes.totalElements || 0);
      calcLineTableHeight(lineRes.content.length);
      calcTableHeight(dataSource.length);
    }
  }

  const queryFields = () => {
    return [
      <TextField name="requestNum" noCache key="requestNum" />,
      <Select name="documentType" noCache key="documentType" />,
      <Lov name="creatorObj" noCache key="creatorObj" />,
      <Lov name="excutorObj" noCache key="excutorObj" />,
      <DatePicker name="startCreateTime" key="startCreateTime" />,
      <DatePicker name="endCreateTime" key="endCreateTime" />,
    ];
  };

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  // 头表格页码更改
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

  // 行表格页码更改
  function handleLinePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setLineCurrentPage(pageValue);
    setLineSize(pageSizeValue);
    handleLineSearch(headId, pageValue, pageSizeValue);
  }

  return (
    <Fragment>
      <Header title="其他出入库平台" />
      <Content className="jc-other-out-in-inventory-platform">
        <div
          style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}
          id="outInInventoryHeaderQuery"
        >
          <Form dataSet={headDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
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
          data={dataSource}
          columns={headColumns}
          height={tableHeight}
          loading={listLoading}
          onRowClick={handleHeadRowClick}
          minHeight={80}
        />
        <Pagination
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
        <div id="lineTableWrapper">
          {headId && (
            <>
              <PerformanceTable
                data={lineDataSource}
                columns={lineColumns}
                height={lineTableHeight}
                loading={lineLoading}
                minHeight={80}
              />
              <Pagination
                pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
                total={lineTotalElements}
                onChange={handleLinePageChange}
                pageSize={lineSize}
                page={currentLinePage}
              />
            </>
          )}
        </div>
      </Content>
    </Fragment>
  );
};

export default OtherOutInInventoryPlatform;
