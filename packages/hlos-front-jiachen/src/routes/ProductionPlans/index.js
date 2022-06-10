/**
 * @Description: 生产计划--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-05-07 13:51:08
 * @LastEditors: yu.na
 */
import React, { createRef, Fragment, useEffect, useState } from 'react';
import {
  Button,
  PerformanceTable,
  Pagination,
  CheckBox,
  Form,
  DataSet,
  DatePicker,
  TextField,
  Select,
  Lov,
  Modal,
  Progress,
} from 'choerodon-ui/pro';
import ExcelExport from 'components/ExcelExport';
import { Badge } from 'choerodon-ui';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { statusRender } from 'hlos-front/lib/utils/renderer';
import { userSetting } from 'hlos-front/lib/services/api';
import { Header, Content } from 'components/Page';
import { getResponse, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { QueryDS } from '@/stores/productionPlansDS';
import {
  getPlanLineList,
  inspectionApi,
  releaseApi,
  reservesApi,
  cancelMo,
  releaseMo,
  releaseMoSplit,
  reservesSplit,
  releaseSplit,
  releaseMoSplitNoKitting,
} from '@/services/productionPlansService';
import { getSplitTaskLogs, splitTaskLogs } from '@/services/salesMoCreateService';
import styles from './index.less';

const tableRef = createRef();
const lineTableRef = createRef();
const maxLineShowLength = 8;
const queryFactory = () => new DataSet(QueryDS());

let progressModal = null;
let timer = null;

const ProductionPlans = () => {
  const queryDS = useDataSet(queryFactory, ProductionPlans);

  const [showLine, setShowLine] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);
  const [size, setSize] = useState(100);
  const [lineDataSource, setLineDataSource] = useState([]);
  const [lineTotalElements, setLineTotalElements] = useState(0);
  const [currentLinePage, setLineCurrentPage] = useState(1);
  const [lineSize, setLineSize] = useState(100);
  const [lineLoading, setLineLoading] = useState(false);
  const [lineTableHeight, setLineTableHeight] = useState(80);
  const [checkValues, setCheckValues] = useState([]);
  const [showFlag, setShowFlag] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  const [releaseMoLoading, setReleaseMoLoading] = useState(false);
  // const [exploreLoading, setExploreLoading] = useState(false);
  const [frontRunFlag, setFrontRun] = useState(false);
  const [doneFlag, setDone] = useState(false);

  const [reservesLoading, setReservesLoading] = useState(false);
  const [releaseLoading, setReleaseLoading] = useState(false);

  const [releaseMoSplitNoKittingLoading, setReleaseMoSplitNoKittingLoading] = useState(false);

  useEffect(() => {
    async function queryUserSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        queryDS.queryDataSet.current.set('meOuId', res.content[0].meOuId);
      }
    }
    queryUserSetting();
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
    if (frontRunFlag) {
      setFrontRun(false);
      notification.success();
      handleSearch(0, size);
    }
  }, [doneFlag]);

  const columns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={handleCheckAllChange}
        />
      ),
      dataIndex: 'moId',
      key: 'moId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) =>
        handleCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: '事业部',
      dataIndex: 'meAreaName',
      key: 'meAreaName',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: '计划开工日期',
      dataIndex: 'planStartDate',
      key: 'planStartDate',
      width: 100,
      resizable: true,
      render: ({ rowData, dataIndex }) =>
        rowData[dataIndex] ? moment(rowData[dataIndex]).format(DEFAULT_DATE_FORMAT) : null,
    },
    {
      title: '工单编码',
      dataIndex: 'moNum',
      key: 'moNum',
      width: 128,
      resizable: true,
    },
    {
      title: '物料编码',
      dataIndex: 'itemCode',
      key: 'itemCode',
      width: 128,
      resizable: true,
    },
    {
      title: '物料名称',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      width: 200,
      resizable: true,
    },
    {
      title: '工单状态',
      dataIndex: 'moStatusMeaning',
      key: 'moStatusMeaning',
      width: 100,
      resizable: true,
      render: ({ rowData }) => statusRender(rowData.moStatus, rowData.moStatusMeaning),
    },
    {
      title: '齐套状态',
      dataIndex: 'kittingStatusMeaning',
      key: 'kittingStatusMeaning',
      width: 100,
      resizable: true,
      render: ({ rowData }) =>
        kittingStatusRender(rowData.kittingStatus, rowData.kittingStatusMeaning),
    },
    {
      title: '制造数量',
      dataIndex: 'makeQty',
      key: 'makeQty',
      width: 84,
      resizable: true,
    },
    {
      title: '单位',
      dataIndex: 'uomName',
      key: 'uomName',
      width: 70,
      resizable: true,
    },
    {
      title: '完工数量',
      dataIndex: 'completedQty',
      key: 'completedQty',
      width: 84,
      resizable: true,
    },
    {
      title: '入库数量',
      dataIndex: 'inventoryQty',
      key: 'inventoryQty',
      width: 84,
      resizable: true,
    },
    {
      title: '入库时间',
      dataIndex: 'creationDate',
      key: 'creationDate',
      width: 128,
      resizable: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      resizable: true,
    },
    {
      title: '客户等级',
      dataIndex: 'customerRank',
      key: 'customerRank',
      width: 84,
      resizable: true,
    },
    {
      title: '创建人',
      dataIndex: 'externalCreator',
      key: 'externalCreator',
      width: 128,
      resizable: true,
    },
    {
      title: '上一次更新时间',
      dataIndex: 'externalRemark',
      key: 'externalRemark',
      width: 128,
      resizable: true,
      flexGrow: true,
    },
  ];

  const lineColumns = [
    {
      title: '物料编码',
      dataIndex: 'componentItemCode',
      key: 'componentItemCode',
      width: 128,
      resizable: true,
    },
    {
      title: '物料描述',
      dataIndex: 'componentItemDescription',
      key: 'componentItemDescription',
      flexGrow: true,
    },
    {
      title: '单位',
      dataIndex: 'uomName',
      key: 'uomName',
      width: 70,
      resizable: true,
    },
    {
      title: '单位用量',
      dataIndex: 'componentUsage',
      key: 'componentUsage',
      width: 70,
      resizable: true,
    },
    {
      title: '可用量',
      dataIndex: 'availableQty',
      key: 'availableQty',
      width: 70,
      resizable: true,
    },
    {
      title: '需求量',
      dataIndex: 'demandQty',
      key: 'demandQty',
      width: 70,
      resizable: true,
    },
    {
      title: '剩余需求数',
      dataIndex: 'remainQty',
      key: 'remainQty',
      width: 84,
      resizable: true,
    },
    {
      title: '本次齐套数',
      dataIndex: 'kittingQty',
      key: 'kittingQty',
      width: 84,
      resizable: true,
    },
    {
      title: '欠料数',
      dataIndex: 'oweQty',
      key: 'oweQty',
      width: 84,
      resizable: true,
    },
    {
      title: '本次齐套仓库',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 128,
      resizable: true,
    },
  ];

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.moId}
        checked={checkValues.findIndex((i) => i.moId === rowData.moId) !== -1}
        onClick={(e) => e.stopPropagation()}
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
        newCheckValues.findIndex((i) => i.moId === rowData.moId),
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

  function kittingStatusRender(value, text) {
    const obj = {
      KITTING: 'success',
      PART_KITTING: 'warning',
      NOT_KITTING: 'error',
    };
    const status = obj[value];
    return <Badge status={status} text={text} />;
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   * 头查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="meAreaObj" noCache key="meAreaObj" />,
      <DatePicker name="planStartDateFrom" key="planStartDateFrom" />,
      <DatePicker name="planStartDateTo" key="planStartDateTo" />,
      <TextField name="moNum" key="moNum" />,
      <TextField name="itemCode" key="itemCode" />,
      <Select name="moStatus" key="moStatus" />,
      <Select name="kittingStatus" key="kittingStatus" />,
    ];
  }

  /**
   * 重置
   */
  function handleReset() {
    queryDS.queryDataSet.current.reset();
  }

  /**
   * 查询
   */
  async function handleSearch(page = 0, pageSize = 100) {
    const validateValue = await queryDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLine({});
    queryDS.queryParameter = {
      ...queryDS.queryDataSet.current.toJSONData(),
      page,
      size: pageSize,
    };
    setShowLoading(true);
    const res = await queryDS.query();
    setShowLoading(false);
    if (res && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
    }
  }

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(
      styles['lmes-production-plans-content']
    )[0];
    const queryContainer = document.getElementsByClassName(
      styles['lmes-production-plans-query']
    )[0];
    const lineContainer = document.getElementsByClassName(
      styles['lmes-production-plans-line-table']
    )[0];
    const maxTableHeight =
      pageContainer.offsetHeight - queryContainer.offsetHeight - lineContainer.offsetHeight - 85;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight < 80 ? 80 : maxTableHeight);
    }
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
    setShowLine({});
    handleSearch(pageValue - 1, pageSizeValue);
  }

  async function handleRowChange(rec) {
    setShowLine(rec);
    handleLineSearch(rec);
  }

  function handleLinePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setLineCurrentPage(pageValue);
    setLineSize(pageSizeValue);
    handleLineSearch(showLine, pageValue - 1, pageSizeValue);
  }

  async function handleLineSearch(rec, page = 0, pageSize = 100) {
    const params = {
      moId: !isEmpty(rec) ? rec.moId : showLine.moId,
      eventId: currentEventId,
      page,
      size: pageSize,
    };
    setLineLoading(true);
    const lineRes = await getPlanLineList(params);
    setLineLoading(false);
    if (lineRes && lineRes.content) {
      setLineDataSource(lineRes.content);
      setLineTotalElements(lineRes.totalElements || 0);
      calcLineTableHeight(lineRes.content.length);
      calcTableHeight(dataSource.length);
    }
  }

  function calcLineTableHeight(dataLength) {
    const maxTableHeight = maxLineShowLength * 30 + 30;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setLineTableHeight(80);
    } else if (dataLength * 30 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setLineTableHeight(dataLength * 30 + 30);
    } else {
      setLineTableHeight(maxTableHeight);
    }
  }

  async function handleInspection() {
    if (!isEmpty(checkSelectIds())) {
      const params = checkValues.map((i, index) => ({ moId: i.moId, executePriority: index + 1 }));
      const res = await inspectionApi(params);
      if (getResponse(res)) {
        notification.success();
        setCurrentEventId(res?.eventId);
      }
    }
  }

  async function handleCommonClick(type) {
    const moIds = checkSelectIds();
    if (!isEmpty(moIds)) {
      let res = {};
      if (type === 'cancelMo') {
        res = await cancelMo(moIds);
      } else if (type === 'releaseMo') {
        res = await releaseMo(moIds);
      } else if (type === 'release') {
        res = await releaseApi(moIds);
      } else if (type === 'reserve') {
        res = await reservesApi({ moIds, eventId: currentEventId });
      }
      if (getResponse(res)) {
        if (type === 'reserve') {
          setCurrentEventId(null);
        }
        notification.success();
        handleSearch();
      }
    }
  }

  async function handleReleaseMo() {
    const moIds = checkSelectIds();
    if (moIds.length === 0) {
      return;
    }
    setReleaseMoLoading(true);
    if (moIds.length <= 0) {
      const res = await releaseMo(moIds);
      setReleaseMoLoading(false);
      if (getResponse(res)) {
        notification.success();
        handleSearch();
      }
    } else {
      const res = await releaseMoSplit(moIds);
      if (res && Object.keys(res).indexOf('failed') !== -1 && res.failed) {
        notification.error({
          message: res.message,
        });
        setReleaseMoLoading(false);
      } else if (res) {
        changeProgress(res.toFixed(), 'releaseMo');
      }
    }
  }

  async function handlereleaseMoSplitNoKitting() {
    const moIds = checkSelectIds();
    if (moIds.length === 0) {
      return;
    }
    setReleaseMoSplitNoKittingLoading(true);
    const res = await releaseMoSplitNoKitting(moIds);
    if (res && Object.keys(res).indexOf('failed') !== -1 && res.failed) {
      notification.error({
        message: res.message,
      });
      setReleaseMoSplitNoKittingLoading(false);
    } else if (res) {
      changeProgress(res.toFixed(), 'releaseMoSplitNoKitting');
    }
  }

  async function handleReserves() {
    const moIds = checkSelectIds();
    if (moIds.length === 0) {
      return;
    }
    setReservesLoading(true);
    if (moIds.length <= 0) {
      const res = await reservesApi({ moIds, eventId: currentEventId });
      setReservesLoading(false);
      if (getResponse(res)) {
        setCurrentEventId(null);
        notification.success();
        handleSearch();
      }
    } else {
      const res = await reservesSplit({ moIds, eventId: currentEventId });
      if (res && Object.keys(res).indexOf('failed') !== -1 && res.failed) {
        notification.error({
          message: res.message,
        });
        setReservesLoading(false);
      } else if (res) {
        setCurrentEventId(null);
        changeProgress(res.toFixed(), 'reserve');
      }
    }
  }

  async function handleRelease() {
    const moIds = checkSelectIds();
    if (moIds.length === 0) {
      return;
    }
    setReleaseLoading(true);
    if (moIds.length <= 0) {
      const res = await releaseApi(moIds);
      setReleaseLoading(false);
      if (getResponse(res)) {
        notification.success();
        handleSearch();
      }
    } else {
      const res = await releaseSplit(moIds);
      if (res && Object.keys(res).indexOf('failed') !== -1 && res.failed) {
        notification.error({
          message: res.message,
        });
        setReleaseLoading(false);
      } else if (res) {
        changeProgress(res.toFixed(), 'release');
      }
    }
  }

  function changeProgress(id, status) {
    progressModal = Modal.open({
      title: `提交进度  （批次编号：${id}）`,
      className: styles['lmes-production-plans-progress-modal'],
      children: (
        <div>
          <Progress value={0} type="circle" size="large" />
        </div>
      ),
      okText: '终止操作',
      cancelText: '后台运行',
      onOk: async () => {
        clearInterval(timer);
        const stopRes = await splitTaskLogs({
          status: 'TERMINATION',
        });
        if (getResponse(stopRes)) {
          if (status === 'releaseMo') {
            setReleaseMoLoading(false);
          } else if (status === 'reserve') {
            setReservesLoading(false);
          } else if (status === 'release') {
            setReleaseLoading(false);
          } else if (status === 'releaseMoSplitNoKitting') {
            setReleaseMoSplitNoKittingLoading(false);
          }
          handleSearch(0, size);
        }
      },
    });
    timer = setInterval(async () => {
      const logRes = await getSplitTaskLogs(id);
      if (logRes) {
        const resultArr = logRes.result ? logRes.result.split('\n') : [];
        progressModal.update({
          title: `提交进度  （批次编号：${id}）`,
          className: styles['lmes-production-plans-progress-modal'],
          children: (
            <div>
              <Progress
                strokeColor="#00bf96"
                value={logRes.process * 100}
                type="circle"
                size="large"
                format={(val) => (logRes.process === 1 ? 'Done' : `${val.toFixed()}%`)}
              />
              <ul style={{ position: 'relative', left: 150, top: -110, width: 520 }}>
                {resultArr.map((i) => {
                  return <li key={i}>{i}</li>;
                })}
              </ul>
            </div>
          ),
          okCancel: logRes.process !== 1,
          okText: logRes.process === 1 ? '关闭' : '终止操作',
          cancelText: '后台运行',
          onOk: async () => {
            if (timer) {
              clearInterval(timer);
            }
            progressModal.close();
            const stopRes = await splitTaskLogs({
              ...logRes,
              status: 'TERMINATION',
            });
            if (getResponse(stopRes)) {
              if (status === 'releaseMo') {
                setReleaseMoLoading(false);
              } else if (status === 'reserve') {
                setReservesLoading(false);
              } else if (status === 'release') {
                setReleaseLoading(false);
              } else if (status === 'releaseMoSplitNoKitting') {
                setReleaseMoSplitNoKittingLoading(false);
              }
              handleSearch(0, size);
            }
          },
          onCancel: () => {
            progressModal.close();
            setFrontRun(true);
          },
        });
        if (logRes.process === 1) {
          setFrontRun(true);
          setDone(true);
          if (status === 'releaseMo') {
            setReleaseMoLoading(false);
          } else if (status === 'reserve') {
            setReservesLoading(false);
          } else if (status === 'release') {
            setReleaseLoading(false);
          } else if (status === 'releaseMoSplitNoKitting') {
            setReleaseMoSplitNoKittingLoading(false);
          }
          if (timer) {
            clearInterval(timer);
          }
        }
      }
    }, 500);
  }

  function checkSelectIds() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return [];
    }
    return checkValues.map((i) => i.moId);
  }

  function getExportQueryParams() {
    const queryDataDs = queryDS.queryDataSet?.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toJSONData()) : {};
    const {
      moStatus: moStatusList,
      meAreaCode: meAreaCodeList,
      kittingStatus: kittingStatusList,
    } = queryDataDsValue;
    return {
      ...queryDataDsValue,
      moStatusList,
      meAreaCodeList,
      kittingStatusList,
    };
  }

  return (
    <Fragment>
      <Header title="生产计划">
        <ExcelExport
          requestUrl={`/lmess/v1/${getCurrentOrganizationId()}/jcdq-production-plans/excel`}
          queryParams={getExportQueryParams}
        />
        {/* 原下达 () => handleCommonClick('releaseMo') */}
        <Button color="primary" loading={releaseMoLoading} onClick={handleReleaseMo}>
          按套数下达
        </Button>
        {/* 新增加的下达 */}
        <Button
          color="primary"
          loading={releaseMoSplitNoKittingLoading}
          onClick={handlereleaseMoSplitNoKitting}
        >
          下达
        </Button>
        <Button color="primary" onClick={() => handleCommonClick('cancelMo')}>
          取消下达
        </Button>
        {/* <Button>
           打印
         </Button> */}
        {/* () => handleCommonClick('release') */}
        <Button loading={releaseLoading} onClick={handleRelease}>
          库存释放
        </Button>
        {/*  () => handleCommonClick('reserve') */}
        <Button loading={reservesLoading} onClick={handleReserves}>
          库存保留
        </Button>
        <Button onClick={handleInspection}>齐套检查</Button>
      </Header>
      <Content className={styles['lmes-production-plans-content']}>
        <div className={styles['lmes-production-plans-query']}>
          <Form dataSet={queryDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div className={styles['query-btns']}>
            <Button onClick={handleToggle}>
              {!showFlag
                ? intl.get('hzero.common.button.viewMore').d('')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <div>
          <PerformanceTable
            virtualized
            data={dataSource}
            ref={tableRef}
            columns={columns}
            height={tableHeight}
            loading={showLoading}
            onRowClick={handleRowChange}
            rowClassName={(rowData) => {
              if (showLine.moId && rowData?.moId === showLine.moId) return styles['active-line'];
            }}
          />
          <Pagination
            pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
            total={totalElements}
            onChange={handlePageChange}
            pageSize={size}
            page={currentPage}
          />
        </div>
        <div className={styles['lmes-production-plans-line-table']}>
          {!isEmpty(showLine) && (
            <>
              <PerformanceTable
                virtualized
                data={lineDataSource}
                ref={lineTableRef}
                columns={lineColumns}
                height={lineTableHeight}
                loading={lineLoading}
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

export default ProductionPlans;
