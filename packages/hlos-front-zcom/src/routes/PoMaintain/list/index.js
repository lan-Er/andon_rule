/*
 * @Descripttion: 采购订单列表（核企侧）
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-14 15:57:16
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-14 16:02:29
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { getCurrentOrganizationId, getAccessToken, getRequestId } from 'utils/utils';
import { queryReportData } from 'hlos-front/lib/services/api';
import { HZERO_RPT, API_HOST } from 'utils/config';
import LogModal from '@/components/LogModal/index';
import { PoListDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zcom.poMaintain';
const ListDS = () => new DataSet(PoListDS());

function ZcomPoMaintain({ dispatch, history }) {
  const listDS = useDataSet(ListDS, ZcomPoMaintain);

  useEffect(() => {
    listDS.query();
  }, []);

  function handleCreate() {
    const pathName = `/zcom/po-maintain/create`;
    history.push(pathName);
  }

  function handleToDetail(record) {
    const { poId, poNum, poStatus } = record.toData();
    history.push({
      pathname: `/zcom/po-maintain/detail/${poId}`,
      state: {
        poNum,
        poStatus,
      },
    });
  }

  function handleSubmit() {
    return new Promise((resolve) => {
      if (!listDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      let statusFlag = true;
      const arr = listDS.selected.map((v) => {
        if (!['NEW', 'REFUSED'].includes(v.data.poStatus)) {
          statusFlag = false;
        }
        return v.data;
      });
      if (!statusFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.statusValidate`)
            .d('存在不是新建或已拒绝状态的采购订单'),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'poMaintain/poSubmit',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '提交成功',
          });
          listDS.query();
        }
        resolve();
      });
    });
  }

  function handleCancel() {
    return new Promise((resolve) => {
      if (!listDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      let statusFlag = true;
      const arr = listDS.selected.map((v) => {
        if (!['REFUSED', 'CONFIRMING', 'CONFIRMED'].includes(v.data.poStatus)) {
          statusFlag = false;
        }
        return v.data;
      });
      if (!statusFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.statusValidate`)
            .d('选中的订单中有无法取消的订单（新建/已取消/已完结），请检查后选择'),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'poMaintain/poCancel',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '取消成功',
          });
          listDS.query();
        }
        resolve();
      });
    });
  }

  function handleDelete() {
    return new Promise((resolve) => {
      if (!listDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      let statusFlag = true;
      const arr = listDS.selected.map((v) => {
        if (!['NEW', 'REFUSED'].includes(v.data.poStatus)) {
          statusFlag = false;
        }
        return v.data;
      });
      if (!statusFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.statusValidate`)
            .d('存在不是新建或已拒绝状态的采购订单'),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'poMaintain/poDelete',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '删除成功',
          });
          listDS.query();
        }
        resolve();
      });
    });
  }

  async function handlePrint() {
    if (listDS.selected.length !== 1) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    return new Promise((resolve) => {
      dispatch({
        type: 'poMaintain/getPrintrules',
        payload: { printRuleType: 'PO' },
      }).then(async (resData) => {
        if (resData && !resData.failed && resData.content?.length) {
          const { templateCode } = resData.content[0];
          const requestIdString = listDS.selected[0].data.poNum;
          const res = await queryReportData(templateCode);
          if (res && res.content && res.content.length > 0) {
            const { reportUuid } = res.content[0];
            const url = `${HZERO_RPT}/v1/${getCurrentOrganizationId()}/reports/export/${reportUuid}/PRINT`;
            const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&poNum=${requestIdString}`;
            window.open(requestUrl);
          }
        }
        resolve();
      });
    });
  }

  const columns = [
    {
      name: 'poNum',
      width: 150,
      lock: true,
      renderer: ({ record, value }) => (
        <>
          <a onClick={() => handleToDetail(record)}>{value}</a>
        </>
      ),
    },
    { name: 'supplierName', width: 150 },
    { name: 'poTypeMeaning', width: 150 },
    {
      name: 'totalAmount',
      width: 150,
      renderer: ({ record }) => {
        const { currencyCode, totalAmount } = record.toData();
        return (
          <span>
            {`${currencyCode ? `${currencyCode} ` : ''}${
              totalAmount && totalAmount !== '0' ? totalAmount : '0.00'
            }`}
          </span>
        );
      },
    },
    // { name: 'buyer', width: 150 },
    { name: 'customerContacts', width: 150 },
    { name: 'customerContactsPhone', width: 150 },
    { name: 'supplierContacts', width: 150 },
    { name: 'supplierContactsPhone', width: 150 },
    { name: 'consigneeName', width: 150 },
    { name: 'consigneePhone', width: 150 },
    { name: 'receivingAddress', width: 150 },
    // { name: 'invoiceAddressTo', width: 150 },
    { name: 'poSourceTypeMeaning', width: 150 },
    { name: 'sourceDocNum', width: 150 },
    {
      name: 'creationDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'poStatusMeaning', width: 100, lock: 'right' },
    {
      header: '日志',
      width: 80,
      lock: 'right',
      renderer: ({ record }) => {
        return (
          <LogModal id={record.get('poId')}>
            <a>日志</a>
          </LogModal>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.poList`).d('采购订单列表')}>
        <Button color="primary" onClick={handleCreate}>
          新建
        </Button>
        <Button onClick={handleSubmit}>提交</Button>
        <Button onClick={handleCancel}>取消</Button>
        <Button onClick={handleDelete}>删除</Button>
        <Button onClick={handlePrint}>打印</Button>
      </Header>
      <Content className={styles['zcom-po-maintain-content']}>
        <Table
          dataSet={listDS}
          columns={columns}
          queryFieldsLimit={3}
          columnResizable="true"
          customizable
          customizedCode="poMaintain"
          rowDraggable
          columnDraggable
          columnTitleEditable
        />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomPoMaintain);
