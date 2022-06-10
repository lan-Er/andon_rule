/*
 * @Descripttion:
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-03-01 09:53:01
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-03-16 16:29:37
 */

import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { DataSet, Button, Tabs, Table, Form } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { statementCreateListDS, statementMaintainListDS } from '../store/StatementMaintainDS';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.statementMaintain';
const organizationId = getCurrentOrganizationId();
const CreateDS = () => new DataSet(statementCreateListDS());
const MaintainDS = () => new DataSet(statementMaintainListDS());

function ZcomStatementMaintain({ currentTab, dispatch, history }) {
  const CreateListDS = useDataSet(() => CreateDS(), ZcomStatementMaintain);
  const MaintainListDS = useDataSet(() => MaintainDS());
  const [curTab, setCurTab] = useState(currentTab);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // useEffect(() => {
  //   const {setCurrentTab} = location.state || '';
  //   if(setCurrentTab === 'maintain') {
  //     setCurTab(setCurrentTab);
  //     MaintainListDS.query();
  //   }
  // }, []);

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
      type: 'moStatementMaintain/updateState',
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
    let supplierFlag = true; // 判断所选行的供应商是否是同一个
    const arr = [];
    CreateListDS.selected.forEach((v, index) => {
      arr.push(v.data.executeLineId);
      if (index + 1 < CreateListDS.selected.length) {
        supplierFlag =
          supplierFlag && v.data.supplierId === CreateListDS.selected[index + 1].data.supplierId;
      }
    });

    if (!supplierFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.supplierSame`)
          .d('不允许多家供应商合并对账，请拆分创建！'),
      });
      return;
    }

    dispatch({
      type: 'moStatementMaintain/updateState',
      payload: {
        ids: arr,
      },
    });

    const pathname = `/zcom/mo-statement-maintain/create`;
    const { receiveDateTo } = CreateListDS.queryDataSet.current.toData();
    history.push({
      pathname,
      state: {
        arr,
        receiveDateTo,
      },
    });
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
      let validateFlag = true;
      const arr = MaintainListDS.selected.map((v) => {
        if (['NEW', 'RELEASED', 'CONFIRMED'].includes(v.toData().verificationOrderStatus)) {
          validateFlag = false;
        }
        const obj = Object.assign({}, v.data);
        return obj;
      });

      if (!validateFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.select`)
            .d('选中对账单包含已提交/新建/已审核对账单，取消选中后重新提交！'),
        });
        resolve(setSubmitLoading(false));
        return;
      }

      dispatch({
        type: 'moStatementMaintain/submitVerificationOrder',
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
      let validateFlag = true;

      const arr = MaintainListDS.selected.map((v) => {
        if (
          v.toData().verificationOrderStatus === 'RELEASED' ||
          v.toData().verificationOrderStatus === 'CONFIRMED'
        ) {
          validateFlag = false;
        }
        const obj = Object.assign({}, v.data);
        return obj;
      });

      if (!validateFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.select`)
            .d('对账单状态不为新建或审核拒绝，校验失败！'),
        });
        resolve(setSubmitLoading(false));
        return;
      }

      dispatch({
        type: 'moStatementMaintain/deleteVerificationOrder',
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
    const pathName = `/zcom/mo-statement-maintain/detail/${id}`;
    history.push(pathName);
  }

  // 获取导出字段查询参数---对账单创建
  const getCreateExportQueryParams = () => {
    const queryDataDs =
      CreateListDS && CreateListDS.queryDataSet && CreateListDS.queryDataSet.current;
    let queryDataDsValue = {};
    if (queryDataDs) {
      const { receiveDateFrom, receiveDateTo } = queryDataDs.toData();
      queryDataDsValue = filterNullValueObject({
        ...queryDataDs.toData(),
        receiveDateFrom: receiveDateFrom ? receiveDateFrom.concat(' 00:00:00') : null,
        receiveDateTo: receiveDateTo ? receiveDateTo.concat(' 59:59:59') : null,
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
      const { creationDateFrom, creationDateTo } = queryDataDs.toData();
      queryDataDsValue = filterNullValueObject({
        ...queryDataDs.toData(),
        creationDateFrom: creationDateFrom ? creationDateFrom.concat(' 00:00:00') : null,
        creationDateTo: creationDateTo ? creationDateTo.concat(' 00:00:00') : null,
      });
    }
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  };

  const createColumns = [
    { name: 'organizationName', width: 150 },
    { name: 'supplierDescription', width: 150 },
    { name: 'sourceOrderNum', width: 150, lock: 'left' },
    { name: 'moTypeName', width: 150 },
    {
      name: 'receiveDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'supplierItemCode', width: 150 },
    { name: 'supplierItemDescription', width: 150 },
    { name: 'sourceOrderQty', width: 150 },
    { name: 'completionQty', width: 150 },
    { name: 'uom', width: 150 },
    { name: 'warehouseDescription', width: 150 },
  ];

  const maintainColumns = [
    { name: 'verificationOrderStatusMeaning', width: 150 },
    {
      name: 'verificationOrderNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('verificationOrderId');
        return <a onClick={() => handleToDetail(id)}>{value || ''}</a>;
      },
    },
    { name: 'verificationOrderTypeMeaning', width: 150 },
    {
      name: 'creationDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'customerNumber', width: 150 },
    { name: 'customerDescription', width: 150 },
    { name: 'supplierNumber', width: 150 },
    { name: 'supplierDescription', width: 150 },
    { name: 'createdByName', width: 150 },
    { name: 'excludingTaxAmount', width: 150 },
    { name: 'amount', width: 150 },
    { name: 'currencyCode', width: 150 },
  ];

  const renderBar = (props) => {
    const { queryFields, queryDataSet, queryFieldsLimit, dataSet } = props;
    if (queryDataSet) {
      return (
        <>
          <Form columns={queryFieldsLimit} dataSet={queryDataSet}>
            {queryFields}
            <div colSpan={2} style={{ textAlign: 'right' }}>
              <Button onClick={() => queryDataSet.reset()}>重置</Button>
              <Button
                type="primary"
                onClick={() => {
                  dataSet.query();
                }}
              >
                查询
              </Button>
            </div>
          </Form>
        </>
      );
    }
  };

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.statementMaintain`).d('对账单维护')}>
        {curTab === 'create' ? (
          <>
            <Button color="primary" onClick={handleCreate}>
              对账单创建
            </Button>
            <ExcelExport
              requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/verification-orders/query_to-create-export`}
              queryParams={getCreateExportQueryParams}
            />
          </>
        ) : (
          <>
            <ExcelExport
              requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/verification-orders/export`}
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
              queryBar={renderBar}
            />
          </TabPane>
          <TabPane tab="对账单维护" key="maintain">
            <Table
              dataSet={MaintainListDS}
              columns={maintainColumns}
              columnResizable="true"
              queryFieldsLimit={4}
              queryBar={renderBar}
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default connect(({ moStatementMaintain: { currentTab } }) => ({ currentTab }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomStatementMaintain)
);
