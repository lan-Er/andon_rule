/**
 * @Description: 需求工作台管理信息
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-03 15:58:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useState, useMemo } from 'react';
import {
  Tabs,
  Lov,
  Form,
  Button,
  DatePicker,
  DataSet,
  TextField,
  Select,
  Modal,
  CheckBox,
} from 'choerodon-ui/pro';
import { connect } from 'dva';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { Button as HButton } from 'hzero-ui';
import notification from 'utils/notification';
import queryString from 'query-string';
import { openTab } from 'utils/menuTab';
import { getResponse, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { DemandOrderListDS, DemandOrderQueryDS } from '@/stores/demandOrderDS';
import { queryLovData } from 'hlos-front/lib/services/api';
import { HLOS_LSOP } from 'hlos-front/lib/utils/config';
import codeConfig from '@/common/codeConfig';
import {
  releaseDemand,
  cancelDemand,
  closeDemand,
  deleteDemand,
  exploreDemand,
} from '@/services/demandOrderService';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import TabComponent from './TabComponent';
import './style.less';

const organizationId = getCurrentOrganizationId();
const { common } = codeConfig.code;
const { TabPane } = Tabs;

const preCode = 'lsop.demandOrder';
const demandCode = 'LSOP.DEMAND';

const QueryDS = () => new DataSet(DemandOrderQueryDS());

const DemandOrderList = ({ history, dispatch, demandList, paginations, queryStatus }) => {
  const queryDS = useDataSet(QueryDS, DemandOrderList);
  const listDS = useMemo(() => new DataSet(DemandOrderListDS()), []);

  const [showFlag, setShowFlag] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);
  const [size, setSize] = useState(100);
  const [checkValues, setCheckValues] = useState([]);

  useEffect(() => {
    /**
     *设置默认查询条件
     */
    // defaultLovSetting();
  }, []);

  useEffect(() => {
    const statusArr = ['init', 'refresh'];
    async function defaultLovSetting() {
      const res = await Promise.all([
        queryLovData({ lovCode: common.sopOu, defaultFlag: 'Y' }),
        queryLovData({ lovCode: common.worker, defaultFlag: 'Y', workerType: 'SALESMAN' }),
      ]);

      if (getResponse(res)) {
        if (res[0] && res[0].content && res[0].content[0]) {
          queryDS.current.set('sopOuObj', {
            sopOuId: res[0].content[0].sopOuId,
            sopOuName: res[0].content[0].sopOuName,
          });
        }
        if (res[1] && res[1].content && res[1].content[0]) {
          queryDS.current.set('salesmanObj', {
            salesmanId: res[1].content[0].workerId,
            salesmanName: res[1].content[0].workerName,
          });
        }
      }
      queryDS.current.set('demandStatus', ['NEW', 'RELEASED', 'PLANNED']);
      handleSearch();
    }
    if (statusArr.includes(queryStatus)) {
      defaultLovSetting();
    } else {
      setDataSource(demandList);
      setTotalElements(paginations.totalElements || 0);
      setCurrentPage(paginations.currentPage || 1);
      setSize(paginations.size || 100);
      setTableHeight(paginations.tableHeight || 80);
    }
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

  const tabProps = {
    dataSource,
    tableHeight,
    showLoading,
    totalElements,
    size,
    currentPage,
    checkValues,
    onToDetailPage: handleToDetailPage,
    onPageChange: handlePageChange,
    onCheckAllChange: handleCheckAllChange,
    onCheckCell: handleCheckCell,
  };

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.demandId}
        checked={checkValues.findIndex((i) => i.demandId === rowData.demandId) !== -1}
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
        newCheckValues.findIndex((i) => i.demandId === rowData.demandId),
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
    handleSearch(pageValue - 1, pageSizeValue);
  }

  /**
   *tab数组
   * @returns
   */
  function tabsArr() {
    return [
      {
        code: 'main',
        title: '主要',
        component: <TabComponent {...tabProps} tabType="main" />,
      },
      {
        code: 'sale',
        title: '销售',
        component: <TabComponent {...tabProps} tabType="sale" />,
      },
      {
        code: 'plan',
        title: '计划',
        component: <TabComponent {...tabProps} tabType="plan" />,
      },
      {
        code: 'ship',
        title: '发运',
        component: <TabComponent {...tabProps} tabType="ship" />,
      },
    ];
  }

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="sopOuObj" noCache key="sopOuObj" />,
      <Lov name="demandNumObj" noCache key="demandNumObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Select name="demandStatus" key="demandStatus" />,
      <Lov name="customerObj" noCache key="customerObj" />,
      <Lov name="salesmanObj" noCache key="salesmanObj" />,
      <TextField name="soNum" key="soNum" />,
      <Lov name="demandTypeObj" noCache key="demandTypeObj" />,
      <TextField name="customerPo" key="customerPo" />,
      <TextField name="customerItemCode" key="customerItemCode" />,
      <DatePicker name="startDate" key="startDate" />,
      <DatePicker name="endDate" key="endDate" />,
    ];
  }
  /**
   * 查询
   */
  async function handleSearch(page = 0, pageSize = 100, flag) {
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    if (flag) {
      setCurrentPage(1);
    }
    listDS.queryParameter = {
      ...queryDS.current.toJSONData(),
      page,
      size: pageSize,
    };
    setShowLoading(true);
    const res = await listDS.query();
    setShowLoading(false);
    if (res && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
    }
  }

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lsop-demandOrder-content')[0];
    const queryContainer = document.getElementById('demandOrderHeaderQuery');
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 130;
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

  /**
   * 重置
   */
  function handleReset() {
    queryDS.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   *跳转到明细页面
   * @param {*} url
   */
  function handleToDetailPage(url) {
    dispatch({
      type: 'demandOrder/updateState',
      payload: {
        demandList: dataSource,
        paginations: {
          currentPage,
          size,
          totalElements,
          tableHeight,
        },
        queryStatus: 'normal',
      },
    });
    history.push(url);
  }

  /**
   *提交
   */
  function handleSubmit() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (!checkValues.every((item) => item.demandStatus === 'NEW')) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.submitLimit`)
          .d('只有新建状态的需求订单才允许提交！'),
      });
      return;
    }
    releaseDemand(checkValues).then(async (res) => {
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success();
        handleSearch(0, size, true);
      }
    });
  }

  /**
   *删除
   */
  async function handleDelete() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (!checkValues.every((item) => item.demandStatus === 'NEW')) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.delLimit`)
          .d('只有新建状态的需求订单才允许删除！'),
      });
      return;
    }
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.delDemand`).d('是否删除需求订单？')}</p>,
      onOk: () =>
        deleteDemand(checkValues).then(async (res) => {
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            notification.success();
            handleSearch(0, size, true);
          }
        }),
    });
  }

  /**
   *取消
   */
  function handleCancel() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      !checkValues.every(
        (item) =>
          item.demandStatus === 'NEW' ||
          item.demandStatus === 'PLANNED' ||
          item.demandStatus === 'RELEASED'
      )
    ) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.cancelLimit`)
          .d('只有新建、已提交、已计划状态的需求订单才允许取消！'),
      });
      return;
    }
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.cancelDemand`).d('是否取消需求订单？')}</p>,
      onOk: () =>
        cancelDemand(checkValues).then(async (res) => {
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            notification.success();
            handleSearch(0, size, true);
          }
        }),
    });
  }

  /**
   *关闭
   */
  function handleClose() {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      checkValues.every(
        (item) => item.demandStatus !== 'CANCELLED' && item.demandStatus !== 'CLOSED'
      )
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.closeDemand`).d('是否关闭需求订单？')}</p>,
        onOk: () =>
          closeDemand(checkValues).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              notification.success();
              handleSearch(0, size, true);
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.closeLimit`)
          .d('已取消、已关闭状态的需求订单不允许关闭！'),
      });
    }
  }

  /**
   *分解
   */
  function handleExplore() {
    const ids = checkValues.map((item) => item.demandId);
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      checkValues.every(
        (item) =>
          item.demandStatus === 'NEW' ||
          item.demandStatus === 'COMPLETED' ||
          item.demandStatus === 'CANCELLED' ||
          item.demandStatus === 'CLOSED'
      )
    ) {
      notification.error({
        message: '新建、已完成、已取消和已关闭状态的需求订单不允许分解!',
      });
      return;
    }
    exploreDemand({
      // createMoRule, // 创建MO规则
      // economicLotSize, // 经济批量
      // planQty, // 需求订单计划数量
      demandIds: ids,
    }).then(async (res) => {
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        notification.success();
        handleSearch(0, size, true);
      }
    });
  }

  function handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${demandCode}`,
        title: intl.get(`${preCode}.view.title.demandWorkspace`).d('需求工作台导入'),
        search: queryString.stringify({
          action: intl.get(`${preCode}.view.title.demandWorkspace`).d('需求工作台导入'),
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  function getExportQueryParams() {
    const queryDataDs = queryDS && queryDS.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      // tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.demandWorkspace`).d('需求工作台')}>
        <Button
          icon="add"
          color="primary"
          onClick={() => handleToDetailPage('/lsop/demand-order/create')}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <HButton icon="upload" onClick={handleBatchExport}>
          {intl.get('hzero.common.button.import').d('导入')}
        </HButton>
        <ExcelExport
          requestUrl={`${HLOS_LSOP}/v1/${organizationId}/lsop-demands/excel`}
          queryParams={getExportQueryParams}
        />
        <Button onClick={handleClose}>{intl.get('hzero.common.button.close').d('关闭')}</Button>
        <Button onClick={handleCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button onClick={handleDelete}>{intl.get('hzero.common.button.delete').d('删除')}</Button>
        <Button onClick={handleExplore}>{intl.get('lsop.common.button.explore').d('分解')}</Button>
        <Button onClick={handleSubmit}>{intl.get('hzero.common.button.submit').d('提交')}</Button>
      </Header>
      <Content className="lsop-demandOrder-content">
        <div
          id="demandOrderHeaderQuery"
          style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}
        >
          <Form dataSet={queryDS} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div style={{ marginLeft: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
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
      </Content>
    </Fragment>
  );
};

export default connect(({ demandOrder }) => ({
  demandList: demandOrder?.demandList || [],
  paginations: demandOrder?.paginations || {},
  queryStatus: demandOrder?.queryStatus || 'init',
}))(DemandOrderList);
