/**
 * @Description: 销售退货单平台--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-11-18 10:22:15
 * @LastEditors: yu.na
 */

import React, { Fragment, useState, useEffect, createRef } from 'react';
import {
  Button,
  DataSet,
  Tabs,
  Form,
  Lov,
  Select,
  DatePicker,
  DateTimePicker,
  Modal,
  CheckBox,
} from 'choerodon-ui/pro';
import { isEmpty, isUndefined } from 'lodash';
import { connect } from 'dva';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getResponse, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
// import { ExportButton } from 'hlos-front/lib/components';
// import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { ListDS, LineDS } from '@/stores/shipReturnPlatformDS';
import { closeShipReturn, cancelShipReturn, releaseShipReturn } from '@/services/shipReturnService';
import MainTable from './MainTable';
import MainLineTable from './MainLineTable';
import TypeModal from './TypeModal';

import styles from './index.less';

const preCode = 'lwms.shipReturnPlatform';
const organizationId = getCurrentOrganizationId();
const { TabPane } = Tabs;
let modal = null;
const tableRef = createRef();
const lineTableRef = createRef();
const maxLineShowLength = 3;

const listFactory = () => new DataSet(ListDS());
const lineFactory = () => new DataSet(LineDS());

const ShipReturnPlatform = ({
  history,
  dispatch,
  taskList,
  paginations,
  lineList,
  linePaginations,
  currentHeadData,
}) => {
  const listDS = useDataSet(listFactory, ShipReturnPlatform);
  const lineDS = useDataSet(lineFactory);
  const [closeLoading, setCloseLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [headData, setHeadData] = useState({});
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
  const [checkValues, setCheckValues] = useState([]);

  useEffect(() => {
    async function queryUserSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        // const { organizationId, organizationName } = res.content[0];
        if (res.content[0].organizationId) {
          listDS.queryDataSet.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationName: res.content[0].organizationName,
          });
        }
      }
    }
    queryUserSetting();
  }, []);

  useEffect(() => {
    const myQuery = sessionStorage.getItem('shipReturnRefresh') || false;
    if (myQuery) {
      if (listDS.current) {
        listDS.queryParameter = {
          ...listDS.current.toJSONData(),
        };
      }
      listDS.query().then((res) => {
        sessionStorage.removeItem('shipReturnRefresh');
        if (res && res.content) {
          setDataSource(res.content);
          setTotalElements(res.totalElements || 0);
          calcTableHeight(res.content.length);
        }
      });
    } else {
      setDataSource(taskList);
      setTotalElements(paginations.totalElements || 0);
      setCurrentPage(paginations.currentPage || 1);
      setSize(paginations.size || 100);
      setTableHeight(paginations.tableHeight || 80);
      setLineDataSource(lineList);
      setLineTotalElements(linePaginations.lineTotalElements || 0);
      setLineCurrentPage(linePaginations.currentLinePage || 1);
      setLineSize(linePaginations.lineSize || 100);
      setLineTableHeight(linePaginations.lineTableHeight || 80);
      setHeadData(currentHeadData);
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

  const checkSelect = () => {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return false;
    }
    return true;
  };

  const handleClose = async () => {
    Modal.confirm({
      children: <p>确认关闭选中行？</p>,
    }).then(async (button) => {
      if (button === 'ok') {
        const flag = checkSelect();
        if (!flag) return;
        if (
          checkValues.every(
            (i) =>
              i.shipReturnStatus !== 'NEW' &&
              i.shipReturnStatus !== 'CANCELLED' &&
              i.shipReturnStatus !== 'CLOSED'
          )
        ) {
          const ids = checkValues.map((i) => i.shipReturnId);
          setCloseLoading(true);
          const res = await closeShipReturn(ids);
          setCloseLoading(false);
          if (getResponse(res)) {
            actionSuccess();
          }
        } else {
          notification.warning({
            message:
              '仅销售退货单状态不为 “新增NEW”、“已取消CANCELLED”和“已关闭CLOSED”时才可对单据内的数据进行关闭',
          });
        }
      }
    });
  };

  const handleCancel = async () => {
    Modal.confirm({
      children: <p>确认取消选中行？</p>,
    }).then(async (button) => {
      if (button === 'ok') {
        const flag = checkSelect();
        if (!flag) return;
        if (
          checkValues.every(
            (i) => i.shipReturnStatus === 'NEW' || i.shipReturnStatus === 'RELEASED'
          )
        ) {
          const ids = checkValues.map((i) => i.shipReturnId);
          setCancelLoading(true);
          const res = await cancelShipReturn(ids);
          setCancelLoading(false);
          if (getResponse(res)) {
            actionSuccess();
          }
        } else {
          notification.warning({
            message: '仅销售退货单状态为“新增NEW” 和“已提交RELEASED”时才可对单据内的数据进行取消',
          });
        }
      }
    });
  };

  const handleDelete = async () => {
    const flag = checkSelect();
    if (!flag) return;
    if (checkValues.every((i) => i.shipReturnStatus === 'NEW')) {
      setDeleteLoading(true);
      const res = await listDS.delete(checkValues);
      setDeleteLoading(false);
      if (getResponse(res)) {
        actionSuccess();
      }
    } else {
      notification.warning({
        message: '仅销售退货单状态为“新增NEW”时才可对单据内的数据进行删除',
      });
    }
  };

  const handleSubmit = async () => {
    const flag = checkSelect();
    if (!flag) return;
    if (checkValues.every((i) => i.shipReturnStatus === 'NEW')) {
      const ids = checkValues.map((i) => i.shipReturnId);
      setSubmitLoading(true);
      const res = await releaseShipReturn(ids);
      setSubmitLoading(false);
      if (getResponse(res)) {
        actionSuccess();
      }
    } else {
      notification.warning({
        message: '仅销售退货单状态为“新增NEW”时才可对单据内的数据进行提交',
      });
    }
  };

  async function actionSuccess() {
    notification.success();
    headQuery();
  }

  const queryFields = () => {
    return [
      <Lov
        name="organizationObj"
        noCache
        key="organizationObj"
        onChange={() => {
          listDS.queryDataSet.current.set('shipReturnObj', {});
          listDS.queryDataSet.current.set('soObj', {});
          listDS.queryDataSet.current.set('demandObj', {});
          listDS.queryDataSet.current.set('shipOrderObj', {});
          listDS.queryDataSet.current.set('salesmanObj', {});
          listDS.queryDataSet.current.set('creatorObj', {});
        }}
      />,
      <Lov name="shipReturnObj" noCache key="shipReturnObj" />,
      <Lov name="customerObj" noCache key="customerObj" />,
      <Select name="shipReturnStatus" key="shipReturnStatus" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Lov name="soObj" noCache key="soObj" />,
      <Lov name="demandObj" noCache key="demandObj" />,
      <Lov name="shipOrderObj" noCache key="shipOrderObj" />,
      <DatePicker name="expectedArrivalDateStart" key="expectedArrivalDateStart" />,
      <DatePicker name="expectedArrivalDateEnd" key="expectedArrivalDateEnd" />,
      <DateTimePicker name="actualArrivalTimeStart" key="actualArrivalTimeStart" />,
      <DateTimePicker name="actualArrivalTimeEnd" key="actualArrivalTimeEnd" />,
      <Lov name="sopOuObj" noCache key="sopOuObj" />,
      <Lov name="returnTypeObj" noCache key="returnTypeObj" />,
      <Lov name="receiveWarehouseObj" noCache key="receiveWarehouseObj" />,
      <Lov name="salesmanObj" noCache key="salesmanObj" />,
      <Lov name="creatorObj" noCache key="creatorObj" />,
      <DateTimePicker name="createDateStart" key="createDateStart" />,
      <DateTimePicker name="createDateEnd" key="createDateEnd" />,
    ];
  };

  const handleToggle = () => {
    setShowFlag(!showFlag);
  };

  const handleReset = () => {
    listDS.queryDataSet.current.reset();
  };

  const headQuery = async () => {
    setListLoading(true);
    const res = await listDS.query();
    setListLoading(false);
    if (res && res.content) {
      setDataSource(res.content);
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
    }
  };

  const handleSearch = async (page = 0, pageSize = 100, flag) => {
    const validateValue = await listDS.queryDataSet.validate(false, false);
    if (!validateValue) return;
    setHeadData({});
    listDS.queryParameter = {
      ...listDS.queryDataSet.current.toJSONData(),
      page,
      size: pageSize,
    };
    if (flag) {
      setCurrentPage(1);
    }
    headQuery();
  };

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(styles['lwms-ship-return-platform'])[0];
    const queryContainer = document.getElementById('shipReturnHeaderQuery');
    const lineContainer = document.getElementById('ship-return-line-table-wrapper');
    const maxTableHeight =
      pageContainer.offsetHeight - queryContainer.offsetHeight - lineContainer.offsetHeight - 130;
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

  const handleChangePage = (e, flag, param) => {
    if (e) e.stopPropagation();
    dispatch({
      type: 'shipReturn/updateState',
      payload: {
        taskList: dataSource,
        paginations: {
          currentPage,
          size,
          totalElements,
          tableHeight,
        },
        lineList: lineDataSource,
        linePaginations: {
          currentLinePage,
          lineSize,
          lineTotalElements,
          lineTableHeight,
        },
        currentHeadData: headData,
      },
    });
    const pathname = flag
      ? `/lwms/ship-return-platform/detail/${param}`
      : '/lwms/ship-return-platform/create';
    history.push({
      pathname,
      state: {
        returnTypeObj: param,
      },
    });
  };

  const handleRowClick = (record) => {
    setHeadData(record);
    handleLineSearch(record);
  };

  function handleLineSearch(rec, page, pageSize) {
    const params = {
      shipReturnId: !isEmpty(rec) ? rec.shipReturnId : headData.shipReturnId,
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

  const listProps = {
    tableRef,
    dataSource,
    loading: listLoading,
    totalElements,
    size,
    currentPage,
    tableHeight,
    checkValues,
    onCheckCell: handleCheckCell,
    onCheckAllChange: handleCheckAllChange,
    onRowClick: handleRowClick,
    onDetail: handleChangePage,
    onPageChange: handlePageChange,
  };

  const lineProps = {
    tableRef: lineTableRef,
    dataSource: lineDataSource,
    loading: lineLoading,
    totalElements: lineTotalElements,
    size,
    lineSize,
    currentPage,
    currentLinePage,
    tableHeight: lineTableHeight,
    onPageChange: handleLinePageChange,
  };

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

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.shipReturnId}
        onClick={(e) => {
          e.stopPropagation();
        }}
        checked={checkValues.findIndex((i) => i.shipReturnId === rowData.shipReturnId) !== -1}
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
        newCheckValues.findIndex((i) => i.shipReturnId === rowData.shipReturnId),
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

  const handleShowTypeSelectModal = () => {
    modal = Modal.open({
      key: 'lwms-ship-return-platform-type-modal',
      title: '新建订单',
      className: styles['lwms-ship-return-platform-type-modal'],
      movable: false,
      children: <TypeModal onModalCancel={handleModalCancel} onModalOk={handleModalOk} />,
      footer: null,
    });
  };

  const handleModalCancel = () => {
    modal.close();
  };

  const handleModalOk = (e, rec) => {
    if (!isEmpty(rec) && rec.documentTypeCode === 'SO_RETURN') {
      handleChangePage(e, false, rec);
    }
  };

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = listDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
      statusList: fieldsValue?.shipReturnStatus?.join(),
      shipReturnStatus: undefined,
    };
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.shipReturnPlatform`).d('销售退货单平台')}>
        <ButtonPermission
          type="c7n-pro"
          icon="add"
          color="primary"
          onClick={handleShowTypeSelectModal}
          permissionList={[
            {
              code: 'hlos.lwms.ship.return.ps.button.create',
              type: 'button',
              meaning: '新建',
            },
          ]}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </ButtonPermission>
        <ExcelExport
          requestUrl={`${HLOS_LWMS}/v1/${organizationId}/ship-returns/excel`}
          queryParams={getExportQueryParams}
        />
        <ButtonPermission
          type="c7n-pro"
          loading={closeLoading}
          waitType="throttle"
          onClick={handleClose}
          permissionList={[
            {
              code: 'hlos.lwms.ship.return.ps.button.close',
              type: 'button',
              meaning: '关闭',
            },
          ]}
        >
          {intl.get('hzero.common.button.close').d('关闭')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          loading={cancelLoading}
          waitType="throttle"
          onClick={handleCancel}
          permissionList={[
            {
              code: 'hlos.lwms.ship.return.ps.button.cancel',
              type: 'button',
              meaning: '取消',
            },
          ]}
        >
          {intl.get('hzero.common.button.cancel').d('取消')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          loading={deleteLoading}
          waitType="throttle"
          onClick={handleDelete}
          permissionList={[
            {
              code: 'hlos.lwms.ship.return.ps.button.delete',
              type: 'button',
              meaning: '删除',
            },
          ]}
        >
          {intl.get('hzero.common.button.delete').d('删除')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          loading={submitLoading}
          waitType="throttle"
          onClick={handleSubmit}
          permissionList={[
            {
              code: 'hlos.lwms.ship.return.ps.button.submit',
              type: 'button',
              meaning: '提交',
            },
          ]}
        >
          {intl.get('hzero.common.button.submit').d('提交')}
        </ButtonPermission>
      </Header>
      <Content className={styles['lwms-ship-return-platform']}>
        <div
          id="shipReturnHeaderQuery"
          style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}
        >
          <Form dataSet={listDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginLeft: 8 }}>
            <Button onClick={handleToggle}>
              {!showFlag
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch(0, size, true)}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Tabs animated={{ inkBar: true, tabPane: false }} defaultActiveKey="main">
          <TabPane tab={intl.get(`${preCode}.view.title.miain`).d('主要')} key="main">
            <MainTable {...listProps} type="main" />
          </TabPane>
          <TabPane tab={intl.get(`${preCode}.view.title.receive`).d('收货')} key="receive">
            <MainTable {...listProps} type="receive" />
          </TabPane>
        </Tabs>
        <div id="ship-return-line-table-wrapper">
          {!isEmpty(headData) && (
            <Tabs animated={{ inkBar: true, tabPane: false }} defaultActiveKey="main">
              <TabPane tab={intl.get(`${preCode}.view.title.miain`).d('主要')} key="main">
                <MainLineTable {...lineProps} type="main" />
              </TabPane>
              <TabPane tab={intl.get(`${preCode}.view.title.receive`).d('收货')} key="demand">
                <MainLineTable {...lineProps} type="receive" />
              </TabPane>
            </Tabs>
          )}
        </div>
      </Content>
    </Fragment>
  );
};

export default connect(({ shipReturn }) => ({
  taskList: shipReturn?.taskList || [],
  lineList: shipReturn?.lineList || [],
  paginations: shipReturn?.paginations || {},
  linePaginations: shipReturn?.linePaginations || {},
  currentHeadData: shipReturn?.currentHeadData || {},
}))(ShipReturnPlatform);
