/**
 * @Description: 送货单维护--根据MO创建送货单
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-22 10:10:27
 */

import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'dva';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { returnMaintainListDS } from '../store/MaintainDS';

const intlPrefix = 'zcom.customerRefund';
const organizationId = getCurrentOrganizationId();
const MaintainListDS = new DataSet(returnMaintainListDS());

function ZcomMoDeliveryMaintain({ dispatch, history }) {
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    MaintainListDS.query();
  }, []);

  function handleCreate() {
    const pathName = `/zcom/customer-return-maintain/create`;
    history.push(pathName);
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
      const itemRefundList = MaintainListDS.selected.map((v) => {
        const { itemRefundId } = v.toData();
        return { itemRefundId };
      });
      dispatch({
        type: 'customerRefund/deleteItemRefunds',
        payload: itemRefundList,
      })
        .then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '删除成功',
            });
            MaintainListDS.query();
          }
          resolve(setDeleteLoading(false));
        })
        .catch(() => {
          resolve(setDeleteLoading(false));
        });
    });
  }

  function handleToDetail(id) {
    const pathName = `/zcom/customer-return-maintain/detail/${id}`;
    history.push(pathName);
  }

  // 获取导出字段查询参数---送货单创建
  const getCreateExportQueryParams = () => {
    const queryDataDs =
      MaintainListDS && MaintainListDS.queryDataSet && MaintainListDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? queryDataDs.toData() : {};
    const {
      itemRefundDateStart,
      itemRefundDateEnd,
      creationDateStart,
      creationDateEnd,
    } = queryDataDsValue;
    return filterNullValueObject({
      tenantId: organizationId,
      ...queryDataDsValue,
      itemRefundDateStart: itemRefundDateStart ? itemRefundDateStart.concat(' 00:00:00') : null,
      itemRefundDateEnd: itemRefundDateEnd ? itemRefundDateEnd.concat(' 59:59:59') : null,
      creationDateStart: creationDateStart ? creationDateStart.concat(' 00:00:00') : null,
      creationDateEnd: creationDateEnd ? creationDateEnd.concat(' 59:59:59') : null,
    });
  };

  const maintainColumns = [
    {
      name: 'itemRefundNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('itemRefundId');
        return <a onClick={() => handleToDetail(id)}>{value || ''}</a>;
      },
    },
    { name: 'itemRefundStatusMeaning', width: 150 },
    { name: 'refundWmOuName', width: 150 },
    { name: 'refundWarehouseName', width: 150 },
    { name: 'remark', width: 150 },
    { name: 'customerName', width: 150 },
    { name: 'customerWarehouseName', width: 150 },
    { name: 'itemRefundAddress', width: 150 },
    {
      name: 'itemRefundDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'creationDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.deliveryMaintain`).d('客供料退料维护')}>
        <>
          <Button icon="delete" onClick={handleDelete} loading={deleteLoading}>
            删除
          </Button>
          <Button color="primary" onClick={handleCreate}>
            新建
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/item-refunds/export`}
            queryParams={getCreateExportQueryParams}
          />
        </>
      </Header>
      <Content>
        <Table
          autoHeight
          dataSet={MaintainListDS}
          columns={maintainColumns}
          columnResizable="true"
          queryFieldsLimit={4}
        />
      </Content>
    </Fragment>
  );
}

export default connect(({ customerRefund: { currentTab } }) => ({ currentTab }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomMoDeliveryMaintain)
);
