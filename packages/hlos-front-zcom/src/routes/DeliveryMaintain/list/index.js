/**
 * @Description: 送货单维护
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-26 14:02:55
 */

import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { DataSet, Button, Tabs, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { deliveryCreateListDS, deliveryMaintainListDS } from '../store/DeliveryMaintainDS';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.deliveryMaintain';
const organizationId = getCurrentOrganizationId();
let CreateListDS = new DataSet(deliveryCreateListDS());
let MaintainListDS = new DataSet(deliveryMaintainListDS());

function ZcomDeliveryMaintain({ dispatch, currentTab, history }) {
  const [curTab, setCurTab] = useState(currentTab);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (currentTab === 'maintain') {
      MaintainListDS.query();
    } else {
      CreateListDS.query();
    }
    return () => {
      CreateListDS = new DataSet(deliveryCreateListDS());
      MaintainListDS = new DataSet(deliveryMaintainListDS());
    };
  }, [currentTab]);

  function handleTabChange(key) {
    setCurTab(key);
    dispatch({
      type: 'deliveryMaintain/updateState',
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
    let flag = true; // 判断所选行的客户是否是同一个
    let receiveOrgFlag = true; // 判断所选行的收货组织是否一样
    const arr = [];
    CreateListDS.selected.forEach((v, index) => {
      arr.push(v.data.poLineId);
      if (index + 1 < CreateListDS.selected.length) {
        flag = flag && v.data.customerId === CreateListDS.selected[index + 1].data.customerId;
        receiveOrgFlag =
          receiveOrgFlag &&
          v.data.receiveOrgId === CreateListDS.selected[index + 1].data.receiveOrgId;
      }
    });
    if (!flag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.same`)
          .d('所选行数据的客户必须是同一个客户'),
      });
      return;
    }
    if (!receiveOrgFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.orgSame`)
          .d('所选行数据的收货组织必须相同'),
      });
      return;
    }
    dispatch({
      type: 'deliveryMaintain/updateState',
      payload: {
        ids: arr,
      },
    });
    const pathName = `/zcom/delivery-maintain/create`;
    history.push(pathName);
  }

  function handleSubmit() {
    setSubmitLoading(true);
    return new Promise(async (resolve) => {
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
        type: 'deliveryMaintain/batchReleaseDeliveryOrder',
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
    return new Promise(async (resolve) => {
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
        type: 'deliveryMaintain/deleteDeliveryOrder',
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
    const pathName = `/zcom/delivery-maintain/detail/${id}`;
    history.push(pathName);
  }

  // 获取导出字段查询参数---送货单创建
  const getCreateExportQueryParams = () => {
    const queryDataDs =
      CreateListDS && CreateListDS.queryDataSet && CreateListDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? queryDataDs.toData() : {};
    const { demandDateStart, demandDateEnd, promiseDateStart, promiseDateEnd } = queryDataDsValue;
    return filterNullValueObject({
      tenantId: organizationId,
      ...queryDataDsValue,
      demandDateStart: demandDateStart ? demandDateStart.concat(' 00:00:00') : null,
      demandDateEnd: demandDateEnd ? demandDateEnd.concat(' 59:59:59') : null,
      promiseDateStart: promiseDateStart ? promiseDateStart.concat(' 00:00:00') : null,
      promiseDateEnd: promiseDateEnd ? promiseDateEnd.concat(' 59:59:59') : null,
    });
  };

  // 获取导出字段查询参数---送货单维护
  const getMainTainExportQueryParams = () => {
    const queryDataDs =
      MaintainListDS && MaintainListDS.queryDataSet && MaintainListDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? queryDataDs.toData() : {};
    const { creationDateStart, creationDateEnd } = queryDataDsValue;

    return filterNullValueObject({
      tenantId: organizationId,
      ...queryDataDsValue,
      creationDateStart: creationDateStart ? creationDateStart.concat(' 00:00:00') : null,
      creationDateEnd: creationDateEnd ? creationDateEnd.concat(' 59:59:59') : null,
    });
  };

  const createColumns = [
    { name: 'poNum', width: 150 },
    { name: 'poLineNum', width: 150 },
    { name: 'customerName', width: 150 },
    { name: 'itemCode', width: 150 },
    { name: 'itemDescription', width: 150 },
    { name: 'promiseQty', width: 150 },
    { name: 'shippableQty', width: 150 },
    // { name: 'allDeliveryQty', width: 150 },
    { name: 'receivedQty', width: 150 },
    { name: 'uomName', width: 150 },
    {
      name: 'demandDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'promiseDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
  ];

  const maintainColumns = [
    { name: 'deliveryOrderStatus', width: 150 },
    {
      name: 'deliveryOrderNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('deliveryOrderId');
        return <a onClick={() => handleToDetail(id)}>{value || ''}</a>;
      },
    },
    { name: 'deliveryOrderType', width: 150 },
    { name: 'customerName', width: 150 },
    { name: 'organizationName', width: 150 },
    { name: 'receiveAddress', width: 150 },
    { name: 'deliveryQty', width: 150 },
    {
      name: 'creationDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'planDeliveryDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.deliveryMaintain`).d('送货单维护')}>
        {curTab === 'create' ? (
          <>
            <Button color="primary" onClick={handleCreate}>
              送货单创建
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
              送货单删除
            </Button>
            <Button icon="done" onClick={handleSubmit} loading={submitLoading}>
              送货单提交
            </Button>
          </>
        )}
      </Header>
      <Content>
        <Tabs defaultActiveKey={curTab} onChange={handleTabChange}>
          <TabPane tab="送货单创建" key="create">
            <Table
              dataSet={CreateListDS}
              columns={createColumns}
              columnResizable="true"
              queryFieldsLimit={4}
            />
          </TabPane>
          <TabPane tab="送货单维护" key="maintain">
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

export default connect(({ deliveryMaintain: { currentTab } }) => ({ currentTab }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomDeliveryMaintain)
);
