/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-08-11 14:31:06
 * @LastEditTime: 2020-10-05 11:26:19
 * @Description:退料单平台
 */
import React, { Fragment, useEffect, useState } from 'react';
import {
  Tabs,
  DataSet,
  PerformanceTable,
  CheckBox,
  Pagination,
  Form,
  Button,
  TextField,
  DateTimePicker,
  Lov,
  Select,
  Modal,
} from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { isUndefined, isEmpty } from 'lodash';
import { connect } from 'dva';
import ExcelExport from 'components/ExcelExport';
// import { ExportButton } from 'hlos-front/lib/components';
import intl from 'utils/intl';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { queryLovData } from 'hlos-front/lib/services/api';
import { getResponse, filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';

import { submitTR } from '@/services/singleReturnService';
import { singleReturnPlatformDS, singleReturnLineDS } from '@/stores/singleReturnPlatformDS';
import SingleReturnLineTable from './SingleReturnLineTable';
import codeConfig from '@/common/codeConfig';
import SingleReturnCreateModal from './createModal';
import styles from './index.less';

let modal = null;
const modalKey = Modal.key();
const intlPrefix = 'lwms.singleReturnPlatform';
const { TabPane } = Tabs;
const { common } = codeConfig.code;
const headDS = new DataSet(singleReturnPlatformDS());
const lineDS = new DataSet(singleReturnLineDS());
// const preCode = 'lwms.single.return.platform';
const organizationId = getCurrentOrganizationId();

const tableRef = React.createRef();
const lineTableRef = React.createRef();
const maxLineShowLength = 3;

/**
 * 设置默认查询条件
 */
async function setDefaultDSValue(ds) {
  const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
  if (getResponse(res)) {
    if (
      res &&
      Array.isArray(res.content) &&
      res.content.length &&
      ds.queryDataSet &&
      ds.queryDataSet.current
    ) {
      ds.queryDataSet.current.set('organizationObj', {
        organizationId: res.content[0].organizationId,
        organizationName: res.content[0].organizationName,
      });
    }
  }
}

const SingleReturnPlatform = ({
  dispatch,
  history,
  headList,
  lineList,
  pagination,
  linePagination,
  headRequestData,
}) => {
  const [headData, setHeadData] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [size, setSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableHeight, setTableHeight] = useState(80);
  const [showFlag, setShowFlag] = useState(false);
  const [lineDataSource, setLineDataSource] = useState([]);
  const [lineTotalElements, setLineTotalElements] = useState(100);
  const [currentLinePage, setLineCurrentPage] = useState(1);
  const [lineSize, setLineSize] = useState(100);
  const [lineLoading, setLineLoading] = useState(false);
  const [lineTableHeight, setLineTableHeight] = useState(80);
  const [checkValues, setCheckValues] = useState([]);

  useEffect(() => {
    if (!headDS.current) {
      setDefaultDSValue(headDS);
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      calcTableHeight(dataSource.length);
      calcLineTableHeight(lineDataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource, lineDataSource]);

  useEffect(() => {
    const { pathname } = history.location;
    if (pathname && pathname.startsWith('/lwms/single-return-platform/list')) {
      const isQuery = sessionStorage.getItem('SingleReturnProdIssueReturnCreate') || false;
      if (isQuery) {
        handleSearch(0, 100, true).then(() => {
          sessionStorage.removeItem('SingleReturnProdIssueReturnCreate');
        });
      } else {
        setDataSource(headList);
        setTotalElements(pagination.totalElements || 0);
        setCurrentPage(pagination.currentPage || 1);
        setSize(pagination.size || 100);
        setTableHeight(pagination.tableHeight || 80);
        setLineDataSource(lineList);
        setLineTotalElements(linePagination.lineTotalElements || 0);
        setLineCurrentPage(linePagination.currentLinePage || 1);
        setLineSize(linePagination.lineSize || 100);
        setLineTableHeight(linePagination.lineTableHeight || 80);
        setHeadData(headRequestData || null);
      }
    }
  }, [history]);

  const lineProps = {
    tableRef: lineTableRef,
    dataSource: lineDataSource,
    totalElements: lineTotalElements,
    currentPage: currentLinePage,
    size: lineSize,
    loading: lineLoading,
    tableHeight: lineTableHeight,
    onPageChange: handleLinePageChange,
  };

  // tab数组
  function tabsArr() {
    return [
      {
        code: 'main',
        title: '主要',
        component: <SingleReturnLineTable {...lineProps} type="main" />,
      },
      {
        code: 'exec',
        title: '执行',
        component: <SingleReturnLineTable {...lineProps} type="exec" />,
      },
    ];
  }
  // 头表行
  const headColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={handleCheckAllChange}
        />
      ),
      dataIndex: 'requestId',
      key: 'requestId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) =>
        handleCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${intlPrefix}.org`).d('组织'),
      dataIndex: 'organization',
      key: 'organization',
      width: 150,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.returnRequest`).d('退料单号'),
      dataIndex: 'requestNum',
      key: 'requestNum',
      width: 150,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.moNum`).d('来源单据'),
      dataIndex: 'moNum',
      key: 'moNum',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.requestTypeName`).d('退料单类型'),
      dataIndex: 'requestTypeName',
      key: 'requestTypeName',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.requestStatus`).d('退料单状态'),
      dataIndex: 'requestStatusMeaning',
      key: 'requestStatusMeaning',
      width: 150,
      render: ({ rowData }) => statusRender(rowData.requestStatus, rowData.requestStatusMeaning),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.fromWareHouseObj`).d('来源仓库'),
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 150,
    },
    {
      title: intl.get(`${intlPrefix}.wmArea`).d('来源货位'),
      dataIndex: 'wmArea',
      key: 'wmArea',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.locationName`).d('来源地点'),
      dataIndex: 'locationName',
      key: 'locationName',
      width: 150,
    },
    {
      title: intl.get(`${intlPrefix}.toWarehouse`).d('目标仓库'),
      dataIndex: 'toWarehouse',
      key: 'toWarehouse',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.toWarehouse`).d('目标货位'),
      dataIndex: 'toWmArea',
      key: 'toWmArea',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.returnedWorker`).d('退料员工'),
      dataIndex: 'returnedWorkerName',
      key: 'returnedWorkerName',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.returnedReason`).d('退料原因'),
      dataIndex: 'requestReason',
      key: 'requestReason',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.returnedTime`).d('退料时间'),
      dataIndex: 'returnedTime',
      key: 'returnedTime',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.returnedTime`).d('打印标识'),
      dataIndex: 'printedFlag',
      key: 'printedFlag',
      width: 100,
      render: yesOrNoRender,
      editor: (record) => (record.editing ? <CheckBox /> : false),
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.printedDate`).d('打印时间'),
      dataIndex: 'printedDate',
      key: 'printedDate',
      width: 180,
      align: 'center',
      resizable: true,
    },
    {
      title: intl.get(`${intlPrefix}.remark`).d('备注'),
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      resizable: true,
    },
  ];

  const handleHeadRowClick = (record) => {
    setHeadData(record);
    handleLineSearch(record);
  };

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="returnRequestObj" noCache key="returnRequestObj" />,
      <Lov name="moObj" noCache key="moObj" />,
      <Lov name="documentTypeObj" noCache key="documentTypeObj" />,
      <Select name="requestStatusList" key="requestStatusList" />,
      <Lov name="fromWareHouseObj" noCache key="fromWareHouseObj" />,
      <Lov name="fromWmAreaObj" noCache key="fromWmAreaObj" />,
      <TextField name="locationName" key="locationName" />,
      <Lov name="toWareHouseObj" noCache key="toWareHouseObj" />,
      <Lov name="toWmAreaObj" noCache key="toWmAreaObj" />,
      <Lov name="workerObj" noCache key="workerObj" />,
      <TextField name="requestReason" key="workerObj" />,
      <DateTimePicker name="returnedTimeStart" key="returnedTimeStart" />,
      <DateTimePicker name="returnedTimeEnd" key="returnedTimeEnd" />,
      <Select name="printedFlag" key="printedFlag" />,
      <DateTimePicker name="printedDateStart" key="printedDateStart" />,
      <DateTimePicker name="printedDateEnd" key="printedDateEnd" />,
    ];
  }

  /**
   * 重置
   */
  function handleReset() {
    headDS.queryDataSet.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  async function handleToggle() {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  }

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.requestId}
        checked={checkValues.findIndex((i) => i.requestId === rowData.requestId) !== -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={(val) => handleCheckboxChange(val, rowData)}
      />
    );
  }

  function handleCheckboxChange(value, rowData) {
    const newCheckValues = [...checkValues];
    if (value) {
      newCheckValues.push(rowData);
    } else {
      newCheckValues.splice(
        newCheckValues.findIndex((i) => i.requestId === rowData.requestId),
        1
      );
    }
    setCheckValues(newCheckValues);
  }

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
    } else {
      setCheckValues([]);
    }
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = headDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
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
    setHeadData({});
    handleSearch(pageValue - 1, pageSizeValue);
  }

  // 页码更改
  function handleLinePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setLineCurrentPage(pageValue);
    setLineSize(pageSizeValue);
    handleLineSearch(headData, pageValue - 1, pageSizeValue);
  }

  /**
   * 查询
   */
  async function handleSearch(page = 0, pageSize = 100, flag) {
    const validateValue = await headDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    setHeadData({});
    if (flag) {
      setCurrentPage(1);
    }
    headDS.queryParameter = {
      ...headDS.queryDataSet.current.toJSONData(),
      page,
      size: pageSize,
    };
    setListLoading(true);
    const res = await headDS.query();
    setListLoading(false);
    if (res && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
    }
  }

  function handleLineSearch(rec, page, pageSize) {
    const params = {
      requestId: !isEmpty(rec) ? rec.requestId : headData.requestId,
      page,
      size: pageSize,
    };
    lineDS.queryParameter = params;
    queryLine();
  }

  async function queryLine() {
    setLineLoading(true);
    const lineRes = await lineDS.query();
    setLineLoading(false);
    if (lineRes && lineRes.content) {
      setLineDataSource(lineRes.content);
      setLineTotalElements(lineRes.totalElements || 0);
      calcLineTableHeight(lineRes.content.length);
      calcTableHeight(dataSource.length);
    }
  }

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(styles['lwms-single-return-content'])[0];
    const queryContainer = document.getElementById('singleReturnHeaderQuery');
    const lineContainer = document.getElementById('single-return-line-table-wrapper');
    const maxTableHeight =
      pageContainer.offsetHeight - queryContainer.offsetHeight - lineContainer.offsetHeight - 75;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight);
    }
  }

  function calcLineTableHeight(dataLength) {
    const maxTableHeight = maxLineShowLength * 30 + 33 + 10;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setLineTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setLineTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setLineTableHeight(maxTableHeight);
    }
  }

  const handleChangePage = () => {
    dispatch({
      type: 'singleReturnPlatform/updateState',
      payload: {
        headList: dataSource,
        pagination: {
          currentPage,
          size,
          totalElements,
          tableHeight,
        },
        lineList: lineDataSource,
        linePagination: {
          currentLinePage,
          lineSize,
          lineTotalElements,
          lineTableHeight,
        },
        headData,
      },
    });
  };

  /**
   * @description: 新建打开弹窗
   */
  const handleCreate = () => {
    modal = Modal.open({
      key: modalKey,
      title: '新建退料单',
      footer: null,
      className: styles['lwms-single-return-modal'],
      closable: true,
      children: (
        <SingleReturnCreateModal history={history} modal={modal} onModalOk={handleChangePage} />
      ),
    });
  };

  /**
   * @description: 提交
   */
  const handleSubmit = async () => {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const ids = checkValues.map((i) => i.requestId);
    const res = await submitTR(ids);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
      await handleSearch(1, 100, true);
    }
  };

  return (
    <Fragment>
      <Header title="退料单平台">
        <Button icon="add" color="primary" onClick={() => handleCreate()}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <Button color="primary" onClick={() => handleSubmit()}>
          {intl.get('hzero.common.button.submit').d('提交')}
        </Button>
        <ExcelExport
          requestUrl={`${HLOS_LWMS}/v1/${organizationId}/request-headers/return-request-header-excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content className={styles['lwms-single-return-content']}>
        <div
          style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}
          id="singleReturnHeaderQuery"
        >
          <Form dataSet={headDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div
            style={{
              marginLeft: 8,
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.1rem 0',
            }}
          >
            <Button onClick={handleToggle} className={styles['more-btn']}>
              {intl.get('hzero.common.button.more').d('更多')}
              <Icon type={!showFlag ? 'expand_more' : 'expand_less'} />
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch(0, size, true)}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          rowKey="requestId"
          data={dataSource}
          ref={tableRef}
          columns={headColumns}
          height={tableHeight}
          loading={listLoading}
          onRowClick={handleHeadRowClick}
        />
        <Pagination
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
        <div id="single-return-line-table-wrapper">
          {!isEmpty(headData) && (
            <Tabs defaultActiveKey="main">
              {tabsArr().map((tab) => (
                <TabPane
                  tab={intl.get(`${intlPrefix}.view.title.${tab.code}`).d(tab.title)}
                  key={tab.code}
                >
                  {tab.component}
                </TabPane>
              ))}
            </Tabs>
          )}
        </div>
      </Content>
    </Fragment>
  );
};

export default connect(({ singleReturnPlatform }) => ({
  headList: singleReturnPlatform?.headList || [],
  lineList: singleReturnPlatform?.lineList || [],
  pagination: singleReturnPlatform?.pagination || {},
  linePagination: singleReturnPlatform?.linePagination || {},
  headRequestData: singleReturnPlatform?.headRequestData || '',
}))(SingleReturnPlatform);
