/*
 * @Author: zhang yang
 * @Description: 采购订单
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2020-01-07 16:12:32
 */
import intl from 'utils/intl';
import { Button as HButton } from 'hzero-ui';
import React, { useEffect, useState } from 'react';
import {
  Lov,
  Tabs,
  Form,
  Button,
  Select,
  DatePicker,
  DataSet,
  Modal,
  PerformanceTable,
  Pagination,
  CheckBox,
} from 'choerodon-ui/pro';
import moment from 'moment';
import { connect } from 'dva';

import { ExportButton } from 'hlos-front/lib/components';
import { Header, Content } from 'components/Page';
import useChangeWidth from '@/utils/useChangeWidth';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import formatterCollections from 'utils/intl/formatterCollections';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { queryLovData, userSetting } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import { statusRender } from 'hlos-front/lib/utils/renderer';
import { openTab } from 'utils/menuTab';
import {
  releasePoAPI,
  cancelPoAPI,
  closePoAPI,
  deletePoAPI,
  approvePoAPI,
  createSqcDocAPI,
} from '../../../services/posService';
import LineList from './LineList';
import styles from './index.less';
import { ScmPoQtyDS, ScmPoLineDS, ScmWorker } from '@/stores/purchaseOrdersDS';

const { common, lscmPos } = codeConfig.code;
const { TabPane } = Tabs;
const modalKey = Modal.key();
const tableRef = React.createRef();

const preCode = 'lscm.pos';
const commonCode = 'lscm.common.model';
const lineDataSet = new DataSet(ScmPoLineDS());
function PosQtyList({ history, dispatch, purchaseOrderModelData }) {
  const headerDs = useDataSet(() => new DataSet(ScmPoQtyDS()), PosQtyList);
  const workerDS = useDataSet(() => new DataSet(ScmWorker()));
  const [ToPoHeaderId, changgeId] = useState(-1);
  const [poHeaderRecord, setPoHeaderRecord] = useState({});
  const [MoreQuery, changgeMoreQuery] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showLineLoading, setShowLineLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [lineDataSource, setLineDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lineCurrentPage, setLineCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [lineSize, setLineSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [lineTotalElements, setLineTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);
  const [lineTableHeight, setLineTableHeight] = useState(80);
  const [checkValues, setCheckValues] = useState([]);
  const [checkRecords, setCheckRecords] = useState([]);
  const [checkLineRecords, setCheckLineRecords] = useState([]);

  const showQueryNumber = useChangeWidth();

  useEffect(() => {
    async function queryDefaultOrg() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const { workerId, workerCode, workerName, organizationId } = res.content[0];
        if (workerDS.current) {
          workerDS.current.set('workerObj', {
            workerId,
            workerCode,
            workerName,
          });
          workerDS.current.set('organizationId', organizationId);
        }
      }
    }
    queryDefaultOrg();
  }, []);

  useEffect(() => {
    async function defaultLovSetting() {
      const res = await Promise.all([
        queryLovData({ lovCode: common.scmOu, defaultFlag: 'Y' }),
        queryLovData({ lovCode: lscmPos.buyer, defaultFlag: 'Y' }),
        queryLovData({ lovCode: common.worker, defaultFlag: 'Y' }),
      ]);
      if (getResponse(res)) {
        if (res[0] && res[0].content && res[0].content[0] && headerDs.queryDataSet.current) {
          headerDs.queryDataSet.current.set('scmOuObj', {
            scmOuId: res[0].content[0].scmOuId,
            scmOuName: res[0].content[0].scmOuName,
          });
        }
        if (
          res[0] &&
          res[1] &&
          res[1].content &&
          res[1].content[0] &&
          headerDs.queryDataSet.current
        ) {
          headerDs.queryDataSet.current.set('buyerObj', {
            buyerId: res[1].content[0].salesmanId,
            buyerName: res[1].content[0].salesmanName,
          });
        }
      }
      handleSearch();
    }
    if (purchaseOrderModelData.queryStatus === 'refresh') {
      defaultLovSetting();
    } else {
      changgeId(purchaseOrderModelData.ToPoHeaderId);
      setPoHeaderRecord(purchaseOrderModelData.poHeaderRecord);
      changgeMoreQuery(purchaseOrderModelData.MoreQuery);
      setShowLoading(purchaseOrderModelData.showLoading);
      setShowLineLoading(purchaseOrderModelData.showLineLoading);
      setDataSource(purchaseOrderModelData.dataSource);
      setLineDataSource(purchaseOrderModelData.lineDataSource);
      setCurrentPage(purchaseOrderModelData.currentPage);
      setLineCurrentPage(purchaseOrderModelData.lineCurrentPage);
      setSize(purchaseOrderModelData.size);
      setLineSize(purchaseOrderModelData.lineSize);
      setTotalElements(purchaseOrderModelData.totalElements);
      setLineTotalElements(purchaseOrderModelData.lineTotalElements);
      setTableHeight(purchaseOrderModelData.tableHeight);
      setLineTableHeight(purchaseOrderModelData.lineTableHeight);
      setCheckValues(purchaseOrderModelData.checkValues);
      setCheckRecords(purchaseOrderModelData.checkRecords);
      setCheckLineRecords(purchaseOrderModelData.checkLineRecords);
    }
  }, []);

  useDataSetEvent(headerDs.queryDataSet, 'update', handleChangeQuery);
  useEffect(() => {
    return () => {
      if (headerDs.current) {
        const {
          location: { pathname },
        } = window;
        if (pathname.startsWith('/lscm/po-qty-list/list')) {
          headerDs.current.records.clear();
        }
      }
    };
  }, []);

  // useEffect(() => {
  //   const isQuery = sessionStorage.getItem('purchaseOrderChange') || false;
  //   if (isQuery && headerDs) {
  //     headerDs.query(headerDs.currentPage).then(() => {
  //       sessionStorage.removeItem('purchaseOrderChange');
  //     });
  //   }
  // }, [history.location]);

  function handleChangeQuery({ name, record }) {
    if (name === 'scmOuObj') {
      record.set('poNumObj', null);
    }
  }
  /**
   *表格
   * @returns
   */
  function columns() {
    return [
      {
        title: (
          <CheckBox
            name="controlled"
            checked={dataSource.length && checkValues.length === dataSource.length}
            onChange={handleCheckAllChange}
          />
        ),
        dataIndex: 'poHeaderId',
        key: 'poHeaderId',
        width: 50,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) => checkCell({ rowData, dataIndex, rowIndex }),
      },
      {
        title: intl.get(`${preCode}.scmOu`).d('采购中心'),
        resizable: true,
        dataIndex: 'scmOu',
        width: 128,
        fixed: true,
      },
      {
        title: intl.get(`${preCode}.poNum`).d('采购订单号'),
        resizable: true,
        dataIndex: 'poNum',
        width: 128,
        render: linkRenderer,
        fixed: true,
      },
      {
        title: intl.get(`${preCode}.poType`).d('订单类型'),
        resizable: true,
        dataIndex: 'poTypeName',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.poStatus`).d('订单状态'),
        resizable: true,
        dataIndex: 'poStatusMeaning',
        width: 84,
        align: 'center',
        render: ({ rowData }) => statusRender(rowData.poStatus, rowData.poStatusMeaning),
      },
      {
        title: intl.get(`${preCode}.buyer`).d('采购员'),
        resizable: true,
        dataIndex: 'buyer',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.supplier`).d('供应商'),
        resizable: true,
        dataIndex: 'supplier',
        width: 200,
      },
      {
        title: intl.get(`${preCode}.supplierSite`).d('供应商地点'),
        resizable: true,
        dataIndex: 'supplierSite',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.supplierContact`).d('供应商联系人'),
        resizable: true,
        dataIndex: 'supplierContact',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.contactPhone`).d('联系电话'),
        resizable: true,
        dataIndex: 'contactPhone',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.contactEmail`).d('联系邮箱'),
        resizable: true,
        dataIndex: 'contactEmail',
        width: 160,
      },
      {
        title: intl.get(`${preCode}.receiveOrg`).d('收货组织'),
        resizable: true,
        dataIndex: 'receiveOrg',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.currency`).d('币种'),
        resizable: true,
        dataIndex: 'currencyName',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.totalAmount`).d('订单总价'),
        resizable: true,
        dataIndex: 'totalAmount',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.taxRate`).d('税率'),
        resizable: true,
        dataIndex: 'taxRate',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.exchangeRate`).d('汇率'),
        resizable: true,
        dataIndex: 'exchangeRate',
        width: 82,
      },
      {
        title: intl.get(`${preCode}.paymentDeadline`).d('付款期限'),
        resizable: true,
        dataIndex: 'paymentDeadlineMeaing',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.paymentMethod`).d('付款方式'),
        resizable: true,
        dataIndex: 'paymentMethodMeaning',
        width: 100,
      },
      {
        title: intl.get(`${preCode}.poVersion`).d('订单版本'),
        resizable: true,
        dataIndex: 'poVersion',
        width: 70,
      },
      {
        title: intl.get(`${preCode}.approvalRule`).d('审批策略'),
        resizable: true,
        dataIndex: 'approvalRuleMeaning',
        width: 84,
      },
      {
        title: intl.get(`${preCode}.approvalChart`).d('审批流程'),
        resizable: true,
        dataIndex: 'approvalChart',
        width: 128,
      },
      {
        title: intl.get(`${preCode}.docProcessRule`).d('单据处理规则'),
        resizable: true,
        dataIndex: 'docProcessRule',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.remark`).d('备注'),
        resizable: true,
        dataIndex: 'remark',
        width: 200,
      },
      {
        title: intl.get(`${commonCode}.externalId`).d('外部ID'),
        resizable: true,
        dataIndex: 'externalId',
        width: 128,
      },
      {
        title: intl.get(`${commonCode}.externalNum`).d('外部单据号'),
        resizable: true,
        dataIndex: 'externalNum',
        width: 128,
      },
    ];
  }

  function linkRenderer({ rowData }) {
    return <a onClick={(e) => handleToDetails(e, rowData)}>{rowData.poNum}</a>;
  }

  function handleToDetails(e, rowData) {
    e.stopPropagation();

    history.push(`/lscm/po-qty-list/detail/${rowData.poHeaderId}`);
    dispatch({
      type: 'PurchaseOrderModel/updateState',
      payload: {
        purchaseOrderModelData: {
          ToPoHeaderId,
          poHeaderRecord,
          MoreQuery,
          showLoading,
          showLineLoading,
          dataSource,
          lineDataSource,
          currentPage,
          lineCurrentPage,
          size,
          lineSize,
          totalElements,
          lineTotalElements,
          tableHeight,
          lineTableHeight,
          checkValues,
          checkRecords,
          checkLineRecords,
          queryStatus: 'normal',
        },
      },
    });
  }

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource.map((i) => i.poHeaderId));
      setCheckRecords(dataSource.map((i) => i));
    } else {
      setCheckValues([]);
      setCheckRecords([]);
    }
  }

  // 行表全选
  function handleLineCheckAllChange(value) {
    if (value) {
      setCheckLineRecords(lineDataSource.map((i) => i));
    } else {
      setCheckLineRecords([]);
    }
  }

  function checkCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.poHeaderId}
        checked={checkValues.indexOf(rowData.poHeaderId) !== -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={() => handleCheckBoxChange(rowData)}
      />
    );
  }

  // 行表
  function checkLineCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.poLineId}
        checked={checkLineRecords.findIndex((v) => v.poLineId === rowData.poLineId) !== -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={() => handleLineCheckBoxChange(rowData)}
      />
    );
  }

  function handleCheckBoxChange(rowData) {
    const _checkValues = checkValues.slice();
    const _checkRecords = checkRecords.slice();
    if (_checkValues.indexOf(rowData.poHeaderId) === -1) {
      _checkValues.push(rowData.poHeaderId);
      _checkRecords.push(rowData);
    } else {
      _checkValues.splice(_checkValues.indexOf(rowData.poHeaderId), 1);
      _checkRecords.splice(
        _checkRecords.findIndex((v) => v.poHeaderId === rowData.poHeaderId),
        1
      );
    }
    setCheckValues(_checkValues);
    setCheckRecords(_checkRecords);
  }

  // 行表复选框change
  function handleLineCheckBoxChange(rowData) {
    const _checkLineRecords = checkLineRecords.slice();
    if (_checkLineRecords.findIndex((v) => v.poLineId === rowData.poLineId) === -1) {
      _checkLineRecords.push(rowData);
    } else {
      _checkLineRecords.splice(
        _checkLineRecords.findIndex((v) => v.poLineId === rowData.poLineId),
        1
      );
    }
    setCheckLineRecords(_checkLineRecords);
  }

  function handleHeadRowClick(rowData) {
    changgeId(1);
    setPoHeaderRecord(rowData);
    handleLineSearch(lineCurrentPage, lineSize, rowData);
  }

  async function handleLineSearch(page = currentPage, pageSize = size, rowData = poHeaderRecord) {
    setShowLineLoading(true);
    const params = {
      poHeaderId: rowData.poHeaderId,
      page: page - 1,
      size: pageSize,
    };
    lineDataSet.queryParameter = params;
    const res = await lineDataSet.query();
    if (getResponse(res) && res.content) {
      setLineDataSource(res.content);
      setLineTotalElements(res.totalElements || 0);
      calcLineTableHeight(res.content.length);
      calcTableHeight(dataSource.length);
    }
    setShowLineLoading(false);
  }

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(styles['lscm-scm-po-content'])[0];
    const queryContainer = document.getElementsByClassName(styles['lscm-scm-po-qty-from'])[0];
    const lineContent = document.getElementsByClassName(styles['lscm-scm-po-line'])[0];
    const maxTableHeight =
      pageContainer?.offsetHeight -
      queryContainer?.offsetHeight -
      (lineContent?.offsetHeight ?? 0) -
      70;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight < 80 ? 80 : maxTableHeight);
    }
  }

  function calcLineTableHeight(dataLength) {
    const maxTableHeight = 3 * 30 + 33 + 10;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setLineTableHeight(80);
    } else if (dataLength * 33 <= maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setLineTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setLineTableHeight(maxTableHeight);
    }
  }

  // 头页码更改
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

  const lineListProps = {
    lineDataSource,
    lineTableHeight,
    showLineLoading,
    lineTotalElements,
    lineSize,
    lineCurrentPage,
    checkLineRecords,
    handleLinePageChange,
    handleLineCheckAllChange,
    checkLineCell,
  };

  function tabsArr() {
    return [
      { code: 'main', title: '主要', component: <LineList {...lineListProps} type="main" /> },
      { code: 'get', title: '收货', component: <LineList {...lineListProps} type="get" /> },
      { code: 'other', title: '其它', component: <LineList {...lineListProps} type="other" /> },
    ];
  }

  /**
   * 重置
   */
  function handleReset() {
    headerDs.queryDataSet.current.reset();
  }

  function handleQuery() {
    setCurrentPage(1);
    changgeId(-1);
    handleSearch();
  }

  /**
   * 查询
   */
  async function handleSearch(page = currentPage, pageSize = size) {
    const validateValue = await headerDs.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLoading(true);
    headerDs.queryDataSet.current.set('page', page - 1);
    headerDs.queryDataSet.current.set('size', pageSize);
    const res = await headerDs.query();
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
      setCheckRecords([]);
    }
    setShowLoading(false);
  }

  // 行页码更改
  function handleLinePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setLineCurrentPage(pageValue);
    setLineSize(pageSizeValue);
    handleLineSearch(pageValue, pageSizeValue);
  }

  /**
   * 新增跳转
   */
  function TurnAdd() {
    history.push(`/lscm/po-qty-list/detail/create`);

    dispatch({
      type: 'PurchaseOrderModel/updateState',
      payload: {
        purchaseOrderModelData: {
          ToPoHeaderId,
          poHeaderRecord,
          MoreQuery,
          showLoading,
          showLineLoading,
          dataSource,
          lineDataSource,
          currentPage,
          lineCurrentPage,
          size,
          lineSize,
          totalElements,
          lineTotalElements,
          tableHeight,
          lineTableHeight,
          checkValues,
          checkRecords,
          checkLineRecords,
        },
      },
    });
  }

  /**
   * 删除
   */
  function handleDelete() {
    if (checkRecords.length) {
      if (checkRecords.every((item) => item.poStatus === 'NEW')) {
        Modal.confirm({
          title: intl.get(`${preCode}.msg.isDelete`).d('是否删除'),
          content: '',
          onOk() {
            deletePoAPI(checkValues).then((res) => {
              if (res && res.failed) {
                notification.error({
                  message: '错误',
                  description: intl.get(`${preCode}.msg.deleteError`).d('删除失败'),
                });
              } else {
                notification.success({
                  message: '成功',
                  description: intl.get(`${preCode}.msg.deleteSuccess`).d('删除成功'),
                });
                changgeId(-1);
                handleSearch();
              }
            });
          },
          onCancel() {},
        });
      } else {
        notification.warning({
          message: '警告',
          description: intl.get(`${preCode}.msg.justNew`).d('只能选择新建状态的数据'),
        });
      }
    } else {
      notification.warning({
        message: '警告',
        description: intl.get(`${preCode}.msg.selectFirst`).d('请先选择一条数据'),
      });
    }
  }

  /**
   * 提交
   */
  async function handleSubmitTo() {
    if (checkRecords.length) {
      if (checkRecords.every((item) => item.poStatus === 'NEW')) {
        Modal.confirm({
          title: intl.get(`${preCode}.msg.isSubmit`).d('是否提交'),
          content: '',
          onOk() {
            releasePoAPI(checkValues).then((res) => {
              if (res && res.failed) {
                notification.error({
                  message: '错误',
                  description: intl.get(`${preCode}.msg.submitError`).d('提交失败'),
                });
              } else {
                notification.success({
                  message: '成功',
                  description: intl.get(`${preCode}.msg.submitSuccess`).d('提交成功'),
                });
                changgeId(-1);
                handleSearch();
              }
            });
          },
          onCancel() {},
        });
      } else {
        notification.warning({
          message: '警告',
          description: intl.get(`${preCode}.msg.justNew`).d('只能选择新建状态的数据'),
        });
      }
    } else {
      notification.warning({
        message: '警告',
        description: intl.get(`${preCode}.msg.selectFirst`).d('请先选择一条数据'),
      });
    }
  }

  /**
   * 报检
   */
  async function handleInspection() {
    if (checkLineRecords.length) {
      Modal.open({
        key: modalKey,
        title: intl.get(`${preCode}.msg.isSubmit`).d('是否报检'),
        children: (
          <Form dataSet={workerDS}>
            <Lov name="workerObj" />
          </Form>
        ),
        async onOk() {
          const { poHeaderId } = poHeaderRecord;
          const lines = checkLineRecords.map((i) => {
            const { poLineId, demandQty, secondDemandQty } = i;
            return {
              poLineId,
              batchQty: demandQty,
              secondBatchQty: secondDemandQty,
              samplingType: null,
              sampleQty: 1,
              itemControlType: null,
              inspectionTemplateType: 'SQC.NORMAL',
              templateId: null,
              sqcDocNum: null,
              priority: null,
            };
          });
          const params = [
            {
              poHeaderId,
              declarerId: workerDS.current.get('workerId'),
              declarer: workerDS.current.get('workerCode'),
              declaredDate: moment().format('YYYY-MM-DD HH:mm:ss'),
              pictures: null,
              remark: null,
              lines,
            },
          ];
          const resp = await createSqcDocAPI(params);
          if (getResponse(resp)) {
            notification.success({
              message: '报检成功',
            });
            changgeId(-1);
            handleSearch();
          }
        },
      });
    } else {
      notification.warning({
        message: '警告',
        description: intl.get(`${preCode}.msg.selectFirst`).d('请先选择一条行数据'),
      });
    }
  }

  /**
   * 取消
   */
  async function handleCancel() {
    if (checkRecords.length) {
      if (
        checkRecords.every(
          (item) =>
            item.poStatus === 'NEW' || item.poStatus === 'APPROVING' || item.poStatus === 'APPROVED'
        )
      ) {
        Modal.confirm({
          title: intl.get(`${preCode}.msg.isCancel`).d('是否取消'),
          content: '',
          onOk() {
            cancelPoAPI(checkValues).then((res) => {
              if (res && res.failed) {
                notification.error({
                  message: '错误',
                  description: intl.get(`${preCode}.msg.cancelError`).d('取消失败'),
                });
              } else {
                notification.success({
                  message: '成功',
                  description: intl.get(`${preCode}.msg.cancelSuccess`).d('取消成功'),
                });
                changgeId(-1);
                handleSearch();
              }
            });
          },
          onCancel() {},
        });
      } else {
        notification.warning({
          message: '警告',
          description: intl.get(`${preCode}.msg.justCancel`).d('只能取消新建、审批状态的数据'),
        });
      }
    } else {
      notification.warning({
        message: '警告',
        description: intl.get(`${preCode}.msg.selectFirst`).d('请先选择一条数据'),
      });
    }
  }

  /**
   * 关闭
   */
  async function handleClose() {
    if (checkRecords.length) {
      if (
        checkRecords.every((item) => item.poStatus === 'CANCELLED' || item.poStatus === 'CLOSED')
      ) {
        notification.warning({
          message: '警告',
          description: intl.get(`${preCode}.msg.justClose`).d('存在不允许关闭的数据'),
        });
      } else {
        Modal.confirm({
          title: intl.get(`${preCode}.msg.isClose`).d('是否关闭'),
          content: '',
          onOk() {
            closePoAPI(checkValues).then((res) => {
              if (res && res.failed) {
                notification.error({
                  message: '错误',
                  description: intl.get(`${preCode}.msg.closeError`).d('关闭失败'),
                });
              } else {
                notification.success({
                  message: '成功',
                  description: intl.get(`${preCode}.msg.closeSuccess`).d('关闭成功'),
                });
                changgeId(-1);
                handleSearch();
              }
            });
          },
          onCancel() {},
        });
      }
    } else {
      notification.warning({
        message: '警告',
        description: intl.get(`${preCode}.msg.selectFirst`).d('请先选择一条数据'),
      });
    }
  }

  // 同意
  async function handleAgree() {
    if (checkRecords.length) {
      Modal.confirm({
        title: '是否同意',
        content: '',
        onOk() {
          const params = {
            executeType: 'APPROVE',
            poHeaderIds: checkValues,
          };

          approvePoAPI(params).then((res) => {
            if (res && res.failed) {
              notification.error({
                message: '错误',
                description: res.message,
              });
            } else {
              notification.success({
                message: '成功',
                description: '同意成功',
              });
              changgeId(-1);
              handleSearch();
            }
          });
        },
        onCancel() {},
      });
    } else {
      notification.warning({
        message: '警告',
        description: intl.get(`${preCode}.msg.selectFirst`).d('请先选择一条数据'),
      });
    }
  }

  // 驳回
  function handleReject() {
    if (checkRecords.length) {
      Modal.confirm({
        title: '是否驳回',
        content: '',
        onOk() {
          const params = {
            executeType: 'REJECT',
            poHeaderIds: checkValues,
          };

          approvePoAPI(params).then((res) => {
            if (res && res.failed) {
              notification.error({
                message: '错误',
                description: res.message,
              });
            } else {
              notification.success({
                message: '成功',
                description: '驳回成功',
              });
              changgeId(-1);
              handleSearch();
            }
          });
        },
        onCancel() {},
      });
    } else {
      notification.warning({
        message: '警告',
        description: intl.get(`${preCode}.msg.selectFirst`).d('请先选择一条数据'),
      });
    }
  }

  function handleBatchImport() {
    openTab({
      key: `/himp/commentImport/LSCM.PO.IMP`,
      title: '采购订单导入',
    });
  }

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="scmOuObj" clearButton noCache />,
      <Lov name="poNumObj" clearButton noCache />,
      <Lov name="supplierObj" clearButton noCache />,
      <Select name="poStatus" />,
      <Lov name="receiveOrgObj" clearButton noCache />,
      <Lov name="buyerObj" clearButton noCache />,
      <Lov name="itemObj" clearButton noCache />,
      <Lov name="poType" clearButton noCache />,
      <Lov name="sourceDocTypeObj" clearButton noCache />,
      <Lov name="sourceDocObj" clearButton noCache />,
      <DatePicker name="demandDateStart" />,
      <DatePicker name="demandDateEnd" />,
    ];
  }

  return (
    <React.Fragment key="posQtyMain">
      <Header title={intl.get(`${preCode}.view.title.scmPo`).d('采购订单')}>
        <Button icon="add" color="primary" onClick={TurnAdd}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <HButton icon="upload" onClick={handleBatchImport}>
          {intl.get('hzero.common.button.import').d('导入')}
        </HButton>
        <ExportButton
          reportCode={['LSCM.PO_HEADER']}
          exportTitle={
            intl.get(`${preCode}.view.title.scmPo`).d('采购订单') +
            intl.get('hzero.common.button.export').d('导出')
          }
        />
        <Button onClick={handleAgree}>同意</Button>
        <Button onClick={handleReject}>驳回</Button>
        <Button onClick={handleClose}>{intl.get('hzero.common.button.close').d('关闭')}</Button>
        <Button onClick={handleCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button onClick={handleDelete}>{intl.get('hzero.common.button.delete').d('删除')}</Button>
        <Button onClick={handleSubmitTo}>{intl.get('hzero.common.button.submit').d('提交')}</Button>
        <Button onClick={handleInspection}>
          {intl.get('hzero.common.button.inspect').d('报检')}
        </Button>
      </Header>
      <Content className={styles['lscm-scm-po-content']}>
        <div className={styles['lscm-scm-po-qty-from']}>
          <Form dataSet={headerDs.queryDataSet} columns={showQueryNumber}>
            {!MoreQuery ? queryFields().slice(0, showQueryNumber) : queryFields()}
          </Form>
          <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
            <Button
              onClick={async () => {
                await changgeMoreQuery(!MoreQuery);
                calcTableHeight(dataSource.length);
              }}
            >
              {MoreQuery
                ? intl.get('hzero.common.button.collected').d('收起查询')
                : intl.get('hzero.common.button.viewMore').d('更多查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleQuery}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <div>
          <PerformanceTable
            virtualized
            rowKey="poHeaderId"
            data={dataSource}
            ref={tableRef}
            columns={columns()}
            height={tableHeight}
            loading={showLoading}
            onRowClick={handleHeadRowClick}
          />
          <Pagination
            pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
            total={totalElements}
            onChange={handlePageChange}
            pageSize={size}
            page={currentPage}
          />
        </div>
        <div className={styles['lscm-scm-po-line']}>
          {ToPoHeaderId !== -1 && (
            <Tabs defaultActiveKey="main">
              {tabsArr().map((tab) => (
                <TabPane
                  tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
                  key={tab.code}
                >
                  {tab.component}
                </TabPane>
              ))}
            </Tabs>
          )}
        </div>
      </Content>
    </React.Fragment>
  );
}

export default connect(({ PurchaseOrderModel }) => ({
  purchaseOrderModelData: PurchaseOrderModel?.purchaseOrderModelData || {},
}))(formatterCollections({ code: ['lscm.pos', 'lscm.common'] })(PosQtyList));
