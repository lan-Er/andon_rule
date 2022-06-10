/**
 * @Description: 对账单维护
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-12-14 16:12:58
 */

import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { DataSet, Button, Tabs, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { findStrIndex } from '@/utils/renderer';
import { statementCreateListDS, statementMaintainListDS } from '../store/StatementMaintainDS';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.statementMaintain';
const organizationId = getCurrentOrganizationId();
const CreateDS = (roleType) => new DataSet(statementCreateListDS(roleType));
const MaintainDS = (roleType) => new DataSet(statementMaintainListDS(roleType));

function ZcomStatementMaintain({ currentTab, dispatch, history, location }) {
  const roleType = getRoleType(); // 当前角色类型 供应商supplier或者核企coreCompany
  const CreateListDS = useDataSet(() => CreateDS(roleType), ZcomStatementMaintain);
  const MaintainListDS = useDataSet(() => MaintainDS(roleType));
  const [curTab, setCurTab] = useState(currentTab);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 通过截取路由地址的内容获取当前角色类型
  function getRoleType() {
    const { pathname } = location;
    const pIndex = findStrIndex(pathname, '/', 2);
    const nIndex = findStrIndex(pathname, '/', 3);
    return pathname.substring(pIndex + 1, nIndex);
  }

  useEffect(() => {
    if (currentTab === 'create') {
      CreateListDS.query();
    }
    if (currentTab === 'maintain') {
      MaintainListDS.query();
    }
  }, [currentTab]);

  function handleTabChange(key) {
    setCurTab(key);
    dispatch({
      type: 'statementMaintain/updateState',
      payload: {
        currentTab: key,
      },
    });
  }

  function handleCreate() {
    if (!CreateListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }
    let poTypeFlag = true; // 判断所选行的采购订单类型是否一致
    let customerFlag = true; // 判断所选行的客户是否是同一个
    let supplierFlag = true; // 判断所选行的供应商是否是同一个
    const arr = [];
    CreateListDS.selected.forEach((v, index) => {
      arr.push(v.data.deliveryOrderLineId);
      if (index + 1 < CreateListDS.selected.length) {
        poTypeFlag =
          poTypeFlag && v.data.poTypeCode === CreateListDS.selected[index + 1].data.poTypeCode;
        customerFlag =
          customerFlag && v.data.customerId === CreateListDS.selected[index + 1].data.customerId;
        supplierFlag =
          supplierFlag && v.data.supplierId === CreateListDS.selected[index + 1].data.supplierId;
      }
    });
    if (!poTypeFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.poTypeSame`)
          .d('所选行数据的采购订单类型必须一致'),
      });
      return;
    }
    if (!customerFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.customerSame`)
          .d('所选行数据的客户必须是同一个'),
      });
      return;
    }
    if (!supplierFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.supplierSame`)
          .d('所选行数据的供应商必须是同一个'),
      });
      return;
    }
    dispatch({
      type: 'statementMaintain/updateState',
      payload: {
        ids: arr,
      },
    });
    const pathName = `/zcom/statement-maintain/${roleType}/create`;
    history.push(pathName);
  }

  function handleSubmit() {
    setSubmitLoading(true);
    return new Promise((resolve) => {
      if (!MaintainListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(setSubmitLoading(false));
        return false;
      }
      const arr = MaintainListDS.selected.map((v) => {
        const obj = Object.assign({}, v.data);
        return obj;
      });
      dispatch({
        type: 'statementMaintain/batchReleaseVerificationOrder',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '提交成功',
          });
          MaintainListDS.query();
        }
        resolve(setSubmitLoading(false));
      });
    });
  }

  function handleDelete() {
    setDeleteLoading(true);
    return new Promise((resolve) => {
      if (!MaintainListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(setDeleteLoading(false));
        return false;
      }
      const arr = MaintainListDS.selected.map((v) => {
        const obj = Object.assign({}, v.data);
        return obj;
      });
      dispatch({
        type: 'statementMaintain/deleteVerificationOrder',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '删除成功',
          });
          MaintainListDS.query();
        }
        resolve(setDeleteLoading(false));
      });
    });
  }

  function handleToDetail(id) {
    const pathName = `/zcom/statement-maintain/${roleType}/detail/${id}`;
    history.push(pathName);
  }

  // 获取导出字段查询参数---对账单创建
  const getCreateExportQueryParams = () => {
    const queryDataDs =
      CreateListDS && CreateListDS.queryDataSet && CreateListDS.queryDataSet.current;
    let queryDataDsValue = {};
    if (queryDataDs) {
      const {
        submitDateStart,
        submitDateEnd,
        actualExecuteTimeStart,
        actualExecuteTimeEnd,
      } = queryDataDs.toData();
      queryDataDsValue = filterNullValueObject({
        ...queryDataDs.toData(),
        submitDateStart: submitDateStart ? submitDateStart.concat(' 00:00:00') : null,
        submitDateEnd: submitDateEnd ? submitDateEnd.concat(' 23:59:59') : null,
        actualExecuteTimeStart: actualExecuteTimeStart
          ? actualExecuteTimeStart.concat(' 00:00:00')
          : null,
        actualExecuteTimeEnd: actualExecuteTimeEnd
          ? actualExecuteTimeEnd.concat(' 23:59:59')
          : null,
      });
    }
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  };

  // 获取导出字段查询参数---对账单维护
  const getMainTainExportQueryParams = () => {
    const queryDataDs =
      MaintainListDS && MaintainListDS.queryDataSet && MaintainListDS.queryDataSet.current;
    let queryDataDsValue = {};
    if (queryDataDs) {
      const { submitDateStart, submitDateEnd } = queryDataDs.toData();
      queryDataDsValue = filterNullValueObject({
        ...queryDataDs.toData(),
        submitDateStart: submitDateStart ? submitDateStart.concat(' 00:00:00') : null,
        submitDateEnd: submitDateEnd ? submitDateEnd.concat(' 23:59:59') : null,
      });
    }
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  };

  const createColumns = [
    { name: 'deliveryOrderNum', width: 150 },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDescription', width: 150 },
    { name: 'supplierItemCode', width: 150 },
    { name: 'supplierItemDescription', width: 150 },
    { name: 'deliveryQty', width: 150 },
    { name: 'receivedQty', width: 150 },
    { name: 'totalVerificationQty', width: 150 },
    {
      name: 'submitDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'beforeExcludingTaxPrice', width: 150 },
    { name: 'beforePrice', width: 150 },
    { name: 'taxRate', width: 150 },
    { name: 'beforeExcludingTaxAmount', width: 150 },
    { name: 'beforeAmount', width: 150 },
    { name: 'currencyCode', width: 150 },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum', width: 150 },
    { name: 'customerNumber', width: 150 },
    { name: 'customerName', width: 150 },
    { name: 'supplierNumber', width: 150 },
    { name: 'supplierName', width: 150 },
  ];

  const maintainColumns = [
    { name: 'verificationOrderStatus', width: 150 },
    {
      name: 'verificationOrderNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('verificationOrderId');
        return <a onClick={() => handleToDetail(id)}>{value || ''}</a>;
      },
    },
    { name: 'verificationOrderType', width: 150 },
    { name: 'customerNumber', width: 150 },
    { name: 'customerName', width: 150 },
    { name: 'supplierNumber', width: 150 },
    { name: 'supplierName', width: 150 },
    { name: 'excludingTaxAmount', width: 150 },
    { name: 'amount', width: 150 },
    { name: 'currencyCode', width: 150 },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.statementMaintain`).d('对账单维护')}>
        {curTab === 'create' ? (
          <>
            <Button color="primary" onClick={handleCreate}>
              对账单创建
            </Button>
            <ExcelExport
              requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/po-lines/excel`}
              queryParams={getCreateExportQueryParams}
            />
          </>
        ) : (
          <>
            <ExcelExport
              requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/po-lines/excel`}
              queryParams={getMainTainExportQueryParams}
            />
            <Button icon="delete" onClick={handleDelete} loading={deleteLoading}>
              对账单删除
            </Button>
            <Button icon="done" onClick={handleSubmit} loading={submitLoading}>
              对账单提交
            </Button>
          </>
        )}
      </Header>
      <Content>
        <Tabs defaultActiveKey={curTab} onChange={handleTabChange}>
          <TabPane tab="对账单创建" key="create">
            <Table
              dataSet={CreateListDS}
              columns={createColumns}
              columnResizable="true"
              queryFieldsLimit={4}
            />
          </TabPane>
          <TabPane tab="对账单维护" key="maintain">
            <Table
              dataSet={MaintainListDS}
              columns={maintainColumns}
              columnResizable="true"
              queryFieldsLimit={4}
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default connect(({ statementMaintain: { currentTab } }) => ({ currentTab }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomStatementMaintain)
);
