import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Lov,
  Form,
  Button,
  // DatePicker,
  // Switch,
  DateTimePicker,
  TextField,
  Select,
  Modal,
  DataSet,
  CheckBox,
} from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';
import { connect } from 'dva';
import queryString from 'query-string';
import { isUndefined } from 'lodash';
import ExcelExport from 'components/ExcelExport';
// import { ExportButton } from 'hlos-front/lib/components';
// import { HZERO_RPT, API_HOST } from 'utils/config';
import {
  // queryReportData,
  queryLovData,
  userSetting,
} from 'hlos-front/lib/services/api';
import intl from 'utils/intl';
import { openTab } from 'utils/menuTab';
import {
  getResponse,
  getCurrentOrganizationId,
  filterNullValueObject,
  tableScrollWidth,
  // createPagination,
  // getAccessToken,
  // getRequestId,
} from 'utils/utils';
import notification from 'utils/notification';
import withProps from 'utils/withProps';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';
import useChangeWidth from '@/utils/useChangeWidth';
import { MoListDS } from '@/stores/moWorkspaceDS';
import codeConfig from '@/common/codeConfig';
import {
  grwlReleaseMo,
  releaseMo,
  cancelMo,
  closeMo,
  holdMo,
  exploreMo,
  // checkFlowPrintList,
  grwlMergeOrder,
} from '@/services/moWorkspaceService';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';

import MainTable from './MainTable';
import DemandTable from './DemandTable';
import ExecuteTable from './ExecuteTable';
import PlanTable from './PlanTable';
import './style.less';

const { common } = codeConfig.code;
const { TabPane } = Tabs;
const tableRef = React.createRef();

const preCode = 'lmes.moWorkspace';
const organizationId = getCurrentOrganizationId();

const MoList = ({ listDS, history, dispatch, taskList, pagination }) => {
  const [showFlag, setShowFlag] = useState(false);
  const showQueryNumber = useChangeWidth();
  const [moListLoading, setMoListLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [selectedData, setSelectedData] = useState([]);
  const [closeLoading, setCloseLoading] = useState(false);
  const [grwlreleaseLoading, setgrwlReleaseLoading] = useState(false);
  const [releaseLoading, setReleaseLoading] = useState(false);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [mergeLoading, setMergeLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const [dataPlanSource, setDataPlanSource] = useState([]);
  const [dataExecuteSource, setDataExecuteSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);
  const [checkValues, setCheckValues] = useState([]);

  useEffect(() => {
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (getResponse(res)) {
        if (res && res.content && res.content[0]) {
          listDS.queryDataSet.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationName: res.content[0].organizationName,
          });
        }
      }
    }

    defaultLovSetting();
  }, [location.pathname]);

  useEffect(() => {
    const myQuery = sessionStorage.getItem('moWorkspaceParentQuery') || false;
    if (location.pathname === '/grwl/mo-workspace/list' && myQuery) {
      handleSearch().then(() => {
        sessionStorage.removeItem('moWorkspaceParentQuery');
      });
    } else {
      setDataSource(taskList);
      const PlanSource = taskList.map((item) => {
        return {
          ...item.moPlanList[0],
          moId: item.moId,
          moStatus: item.moStatus,
          releasedDate: item.releasedDate,
          ownerOrganizationId: item.ownerOrganizationId,
          demandQty: item.demandQty,
          makeQty: item.makeQty,
          demandDate: item.demandDate,
          organization: item.organization,
          moNum: item.moNum,
          itemCode: item.itemCode,
        };
      });
      setDataPlanSource(PlanSource);
      const ExecuteSource = taskList.map((item) => {
        return {
          ...item.moExecuteList[0],
          moId: item.moId,
          moStatus: item.moStatus,
          releasedDate: item.releasedDate,
          ownerOrganizationId: item.ownerOrganizationId,
          demandQty: item.demandQty,
          makeQty: item.makeQty,
          organization: item.organization,
          moNum: item.moNum,
          itemCode: item.itemCode,
        };
      });
      setDataExecuteSource(ExecuteSource);
      setTotalElements(pagination.totalElements || 0);
      setCurrentPage(pagination.currentPage || 1);
      setSize(pagination.size || 100);
      setTableHeight(pagination.tableHeight || 80);
      calcTableHeight(taskList.length);
    }
    return () => {
      sessionStorage.removeItem('moWorkspaceParentQuery');
    };
  }, []);

  useEffect(() => {
    // calcTableHeight(0);
    function handleResize() {
      calcTableHeight(dataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource]);

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lmes-moWorkspace-content')[0];
    const queryContainer = document.getElementById('moWorkspaceHeaderQuery');
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 130;
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
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="moNumObj" noCache key="moNumObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Select name="moStatus" key="moStatus" />,
      <Lov name="apsOuObj" noCache key="apsOuObj" />,
      <Lov name="apsGroupObj" noCache key="apsGroupObj" />,
      <Lov name="apsResourceObj" noCache key="apsResourceObj" />,
      <Lov name="moTypeObj" noCache key="moTypeObj" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="equipmentObj" noCache key="equipmentObj" />,
      <TextField name="topMoNum" key="topMoNum" />,
      <TextField name="parentMoNums" key="parentMoNums" />,
      <Lov name="soObj" noCache key="soObj" />,
      <Lov name="demandObj" noCache key="demandObj" />,
      <TextField name="customerName" key="customerName" />,
      <TextField name="projectNum" key="projectNum" />,
      <Lov name="sourceDocObj" noCache key="sourceDocObj" />,
      <TextField name="externalNum" key="externalNum" />,
      <Lov name="categoryObj" noCache key="categoryObj" />,
      <Select name="mtoExploredFlag" key="mtoExploredFlag" />,
      <Lov name="creatorObj" noCache key="creatorObj" />,
      <DateTimePicker name="creationDateStart" key="creationDateStart" />,
      <DateTimePicker name="creationDateEnd" key="creationDateEnd" />,
      <DateTimePicker name="demandDateStart" key="demandDateStart" />,
      <DateTimePicker name="demandDateEnd" key="demandDateEnd" />,
      <DateTimePicker name="planStartDateLeft" key="planStartDateLeft" />,
      <DateTimePicker name="planStartDateRight" key="planStartDateRight" />,
    ];
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const validateValue = await listDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    handlePagination();
  }

  /**
   * 查询
   */
  async function handlePagination(page = currentPage, pageSize = size) {
    setMoListLoading(true);
    listDS.queryDataSet.current.set('page', page - 1);
    listDS.queryDataSet.current.set('size', pageSize);
    const result = await listDS.query();
    if (getResponse(result) && result.content) {
      setDataSource(result.content);
      const PlanSource = result.content.map((item) => {
        return {
          ...item.moPlanList[0],
          moId: item.moId,
          moStatus: item.moStatus,
          releasedDate: item.releasedDate,
          ownerOrganizationId: item.ownerOrganizationId,
          demandQty: item.demandQty,
          makeQty: item.makeQty,
          demandDate: item.demandDate,
          organization: item.organization,
          moNum: item.moNum,
          itemCode: item.itemCode,
        };
      });
      setDataPlanSource(PlanSource);
      const ExecuteSource = result.content.map((item) => {
        return {
          ...item.moExecuteList[0],
          moId: item.moId,
          moStatus: item.moStatus,
          releasedDate: item.releasedDate,
          ownerOrganizationId: item.ownerOrganizationId,
          demandQty: item.demandQty,
          makeQty: item.makeQty,
          organization: item.organization,
          moNum: item.moNum,
          itemCode: item.itemCode,
        };
      });
      setDataExecuteSource(ExecuteSource);
      setTotalElements(result.totalElements || 0);
      calcTableHeight(result.content.length);
      dispatch({
        type: 'moWorkSpace/updateDataSource',
        payload: {
          taskList: result.content,
          pagination: {
            currentPage: page,
            size: pageSize,
            totalElements: result.totalElements,
            tableHeight,
          },
        },
      });
    }
    // 清空勾选
    // handleSelectRowKeys();
    setSelectedRowKeys([]);
    setCheckValues([]);
    setMoListLoading(false);
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
    handlePagination(pageValue, pageSizeValue);
  }

  /**
   * 重置
   */
  function handleReset() {
    listDS.queryDataSet.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  }

  /**
   *跳转到明细页面
   * @param {*} url
   */
  function handleToDetailPage(url) {
    history.push(url);
  }

  /**
   *广日下达
   */
  function grhandleRelease() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const statusList = ['NEW', 'SCHEDULED'];
    if (checkValues.filter((i) => !statusList.includes(i.moStatus)).length > 0) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.submitLimit`)
          .d('只有新增和已排期状态的MO才允许下达！'),
      });
      return;
    }
    setgrwlReleaseLoading(true);
    grwlReleaseMo(selectedRowKeys).then(async (res) => {
      setgrwlReleaseLoading(false);
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: intl.get(`${preCode}.view.message.releaseOk`).d('下达成功'),
        });
        handlePagination();
      }
    });
  }
  /**
   *下达
   */
  function handleRelease() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const statusList = ['NEW', 'SCHEDULED'];
    if (checkValues.filter((i) => !statusList.includes(i.moStatus)).length > 0) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.submitLimit`)
          .d('只有新增和已排期状态的MO才允许下达！'),
      });
      return;
    }

    setReleaseLoading(true);
    releaseMo(selectedRowKeys).then(async (res) => {
      setReleaseLoading(false);
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: intl.get(`${preCode}.view.message.releaseOk`).d('下达成功'),
        });
        handlePagination();
      }
    });
  }

  /**
   *分解
   */
  function handleExplore() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const statusList = ['NEW', 'SCHEDULED', 'RELEASED'];
    if (checkValues.filter((i) => !statusList.includes(i.moStatus)).length > 0) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.exploreLimit`)
          .d('只有新增、已排期、已下达状态的MO才允许分解！'),
      });
      return;
    }
    setExploreLoading(true);
    exploreMo({
      exploreLevel: 0,
      moIdList: selectedRowKeys,
    }).then(async (res) => {
      setExploreLoading(false);
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success({
          message: intl.get(`${preCode}.view.message.exploreOk`).d('分解成功'),
        });
        handlePagination();
      }
    });
  }

  /**
   *暂挂
   */
  async function handlePending() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const statusList = ['NEW', 'SCHEDULED', 'RELEASED'];
    if (checkValues.filter((i) => !statusList.includes(i.moStatus)).length > 0) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.pendingLimit`)
          .d('只有新增、已排期、已下达状态的MO才允许暂挂！'),
      });
      return;
    }
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.pendingMo`).d('是否暂挂MO？')}</p>,
      onOk: () => {
        setPendingLoading(true);
        holdMo(selectedRowKeys).then(async (res) => {
          setPendingLoading(false);
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            notification.success({
              message: intl.get(`${preCode}.view.message.pendingOk`).d('暂挂成功'),
            });
            handlePagination();
          }
        });
      },
    });
  }

  /**
   *取消
   */
  function handleCancel() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const statusList = ['NEW', 'SCHEDULED', 'RELEASED', 'PENDING'];
    if (checkValues.filter((i) => !statusList.includes(i.moStatus)).length > 0) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.cancelLimit`)
          .d('只有新增、已排期、已下达、已暂挂状态的MO才允许取消！'),
      });
      return;
    }
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.cancelMo`).d('是否取消MO？')}</p>,
      onOk: () => {
        setCancelLoading(true);
        cancelMo(selectedRowKeys).then(async (res) => {
          setCancelLoading(false);
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            notification.success({
              message: intl.get(`${preCode}.view.message.cancelOk`).d('取消成功'),
            });
            handlePagination();
          }
        });
      },
    });
  }

  /**
   *关闭
   */
  function handleClose() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const statusList = ['CANCELLED', 'CLOSED'];
    if (checkValues.filter((i) => statusList.includes(i.moStatus)).length > 0) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.closeLimit`)
          .d('已取消、已关闭状态的MO不允许关闭！'),
      });
    } else if (checkValues.filter((i) => !i.releasedDate).length > 0) {
      notification.error({
        message: intl.get(`${preCode}.view.message.releasedDateLimit`).d('下达时间不能为空！'),
      });
    } else {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.closeMo`).d('是否关闭MO？')}</p>,
        onOk: () => {
          setCloseLoading(true);
          closeMo(selectedRowKeys).then(async (res) => {
            setCloseLoading(false);
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              notification.success({
                message: intl.get(`${preCode}.view.message.closeOk`).d('关闭成功'),
              });
              handlePagination();
            }
          });
        },
      });
    }
  }
  // const handleDocumenrPrint = async () => {
  //   if (selectedRowKeys.length === 0) {
  //     notification.error({
  //       message: intl.get(`lmes.common.message.validation.select`).d('请选择一条数据'),
  //     });
  //     return;
  //   }
  //   const requestIdString = checkValues.map((ele) => ele.moId).toString();
  //   // console.log(requestIdString);
  //   // checkFlowPrintList
  //   const params = {
  //     moIdString: requestIdString,
  //   };
  //   const vaild = await checkFlowPrintList(params);
  //   if (getResponse(vaild)) {
  //     const res = await queryReportData('LWSS.MO_FLOW ');
  //     if (res && res.content && res.content.length > 0) {
  //       const { reportUuid } = res.content[0];
  //       const url = `${HZERO_RPT}/v1/${organizationId}/reports/export/${reportUuid}/PRINT`;
  //       const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&moIdString=${requestIdString}`;
  //       window.open(requestUrl);
  //     }
  //   }
  // };
  function handlePrint() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`lmes.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    if (selectedRowKeys.length > 100) {
      notification.error({
        message: '选择数量不允许超过100行，请重新选择',
      });
      return;
    }
    // const moNumArr = checkValues.map((i) => i.moNum);
    // const moNumStr = moNumArr.toString();
    // history.push({
    //   pathname: `/lmes/mo-workspace/print/LMES.MO_TRANSFER_CARD`,
    //   search: `tenantId=${getCurrentOrganizationId()}&moNum=${moNumStr}`,
    // });
    const moIdArr = checkValues.map((i) => i.moId);
    const moIdStr = moIdArr.toString();
    history.push({
      pathname: `/grwl/mo-workspace/print`,
      search: `tenantId=${getCurrentOrganizationId()}&moId=${moIdStr}`,
    });
  }

  /**
   *显示超链接
   * @returns
   */
  function linkRenderer({ rowData, dataIndex }) {
    return (
      <a
        onClick={() =>
          handleToDetailPage(
            `/grwl/mo-workspace/detail/${rowData.ownerOrganizationId}/${rowData.moId}`
          )
        }
      >
        {rowData[dataIndex]}
      </a>
    );
  }
  /**
   * MO选择操作
   * @param {array<String>} selectedRowKeys - moId唯一标识列表
   */
  // function handleSelectRowKeys(rowKeys = [], records = []) {
  //   setSelectedRowKeys(rowKeys);
  //   setSelectedData(records);
  // }

  function handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: '/himp/commentImport/LMES.MO',
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${preCode}.view.title.moImport`).d('MO导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.moImport`).d('MO导入'),
      }),
    });
  }

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: handleSelectRowKeys,
  // };

  const mainProps = {
    loading: moListLoading,
    dataSource,
    tableScrollWidth,
    handlePagination,
    linkRenderer,
    // rowSelection,
    tableRef,
    currentPage,
    size,
    tableHeight,
    totalElements,
    handlePageChange,
    checkValues,
    onCheckCell: handleCheckCell,
    onCheckAllChange: handleCheckAllChange,
    handleToPage,
  };

  const planProps = {
    loading: moListLoading,
    dataPlanSource,
    tableScrollWidth,
    handlePagination,
    linkRenderer,
    // rowSelection,
    tableRef,
    currentPage,
    size,
    tableHeight,
    totalElements,
    handlePageChange,
    checkValues,
    onCheckCell: handleCheckCell,
    onCheckAllChange: handleCheckAllChange,
  };

  const executeProps = {
    loading: moListLoading,
    dataExecuteSource,
    tableScrollWidth,
    handlePagination,
    linkRenderer,
    // rowSelection,
    tableRef,
    currentPage,
    size,
    tableHeight,
    totalElements,
    handlePageChange,
    checkValues,
    onCheckCell: handleCheckCell,
    onCheckAllChange: handleCheckAllChange,
  };

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.moId}
        checked={checkValues.findIndex((i) => i.moId === rowData.moId) !== -1}
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
    const rowKeys = newCheckValues.map((item) => {
      return item.moId;
    });
    setSelectedRowKeys(rowKeys);
  }

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
      const rowKeys = dataSource.map((item) => {
        return item.moId;
      });
      setSelectedRowKeys(rowKeys);
    } else {
      setCheckValues([]);
    }
  }

  function handleToPage(url, data) {
    history.push({
      pathname: url,
      search: `moNum=${data.moNum}&moId=${data.moId}`,
      data,
    });
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = listDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    // const { moStatus: moStatusList } = fieldsValue;
    return {
      ...fieldsValue,
      // moStatusList,
      moStatusList: fieldsValue?.moStatus?.join(),
      moStatus: undefined,
    };
  }

  async function handleMerge() {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }

    setMergeLoading(true);
    const userInfo = await userSetting({ defaultFlag: 'Y' });

    if (userInfo && userInfo.content) {
      grwlMergeOrder({
        moIdList: selectedRowKeys,
        workerId: userInfo.content[0].workerId,
        workerName: userInfo.content[0].workerName,
      }).then(async (res) => {
        setMergeLoading(false);
        if (res && res.failed && res.message) {
          notification.error({
            message: res.message,
          });
        } else {
          notification.success({
            message: '合并成功',
          });
          handlePagination();
        }
      });
    }
  }

  return (
    <>
      <Header title={intl.get(`${preCode}.view.title.moWorkspace`).d('MO工作台')}>
        <Button
          icon="add"
          color="primary"
          onClick={() => handleToDetailPage('/grwl/mo-workspace/create')}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <HButton icon="upload" onClick={handleBatchImport}>
          {intl.get('lmds.common.button.import').d('导入')}
        </HButton>
        <ExcelExport
          requestUrl={`${HLOS_LMES}/v1/${organizationId}/mos/excel`}
          queryParams={getExportQueryParams}
        />
        <Button loading={closeLoading} onClick={handleClose}>
          {intl.get('hzero.common.button.close').d('关闭')}
        </Button>
        <Button loading={cancelLoading} onClick={handleCancel}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button loading={pendingLoading} onClick={handlePending}>
          {intl.get('lmes.common.button.pending').d('暂挂')}
        </Button>
        <Button loading={exploreLoading} onClick={handleExplore}>
          {intl.get('lmes.common.button.explore').d('分解')}
        </Button>
        <ButtonPermission
          loading={releaseLoading}
          onClick={handleRelease}
          permissionList={[
            {
              code: 'hlos.lmes.mo.workspace.ps.button.release',
              type: 'button',
              meaning: '下达',
            },
          ]}
        >
          {intl.get('lmes.common.button.release').d('下达')}
        </ButtonPermission>
        <ButtonPermission
          loading={grwlreleaseLoading}
          onClick={grhandleRelease}
          permissionList={[
            {
              code: 'hlos.lmes.grwl.mo.workspace.ps.button.grwl.mo.release',
              type: 'button',
              meaning: '广日下达',
            },
          ]}
        >
          {intl.get('grwl.common.button.release').d('广日下达')}
        </ButtonPermission>
        <Button onClick={handlePrint}>
          {intl.get('lmes.moWorkSpace.view.button.print').d('流转卡打印')}
        </Button>
        {/* <Button onClick={handleDocumenrPrint}>流转单打印</Button> */}
        <Button loading={mergeLoading} onClick={handleMerge}>
          工单合并
        </Button>
      </Header>
      <Content className="lmes-moWorkspace-content">
        <div
          id="moWorkspaceHeaderQuery"
          style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}
        >
          <Form dataSet={listDS.queryDataSet} columns={showQueryNumber} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, showQueryNumber) : queryFields()}
          </Form>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginLeft: 8 }}>
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
        <Tabs animated={{ inkBar: true, tabPane: false }} defaultActiveKey="main">
          <TabPane tab={intl.get(`${preCode}.view.title.miain`).d('主要')} key="main">
            <MainTable {...mainProps} />
          </TabPane>
          <TabPane tab={intl.get(`${preCode}.view.title.demand`).d('需求')} key="demand">
            <DemandTable {...mainProps} />
          </TabPane>

          <TabPane tab={intl.get(`${preCode}.view.title.plan`).d('计划')} key="plan">
            <PlanTable {...planProps} />
          </TabPane>
          <TabPane tab={intl.get(`${preCode}.view.title.execute`).d('执行')} key="execute">
            <ExecuteTable {...executeProps} />
          </TabPane>
        </Tabs>
      </Content>
    </>
  );
};

export default connect(({ moWorkSpace }) => ({
  taskList: moWorkSpace?.taskList || [],
  pagination: moWorkSpace?.pagination || {},
}))(
  withProps(
    () => {
      const listDS = new DataSet(MoListDS());
      return { listDS };
    },
    { cacheState: true }
  )(MoList)
);
