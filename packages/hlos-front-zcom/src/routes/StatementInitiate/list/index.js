/**
 * @Description: 发起的对账单列表（客户）
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-07 10:05:15
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import LogModal from '@/components/LogModal/index';
import { StatementListDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zcom.statementInitiate';
const statementListDS = () => new DataSet(StatementListDS());

function ZcomStatementInitiate({ history, dispatch }) {
  const ListDS = useDataSet(statementListDS, ZcomStatementInitiate);

  useEffect(() => {
    ListDS.query();
  }, []);

  function handleDelete() {
    return new Promise((resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      let statusFlag = true;
      const arr = ListDS.selected.map((v) => {
        if (!['NEW'].includes(v.data.verificationOrderStatus)) {
          statusFlag = false;
        }
        return v.toData();
      });
      if (!statusFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.statusValidate`)
            .d('选中的对账单中有无法删除的订单（待确认/已退回/已确认/已取消），请检查后选择'),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'statementInitiate/deleteVerificationOrder',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '删除成功',
          });
          ListDS.query();
        }
        resolve();
      });
    });
  }

  function handleCancel() {
    return new Promise((resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      let statusFlag = true;
      const arr = ListDS.selected.map((v) => {
        if (['NEW', 'CONFIRMED', 'CANCELLED'].includes(v.data.verificationOrderStatus)) {
          statusFlag = false;
        }
        return {
          ...v.toData(),
          verificationOrderStatus: 'CANCELLED',
        };
      });
      if (!statusFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.statusValidate`)
            .d('选中的对账单中有无法取消的订单（未提交/已确认/已取消），请检查后选择'),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'statementInitiate/cancelVerificationOrder',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '取消成功',
          });
          ListDS.query();
        }
        resolve();
      });
    });
  }

  function handleSubmit() {
    return new Promise((resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      let statusFlag = true;
      const arr = ListDS.selected.map((v) => {
        if (!['NEW', 'REJECTED'].includes(v.data.verificationOrderStatus)) {
          statusFlag = false;
        }
        return {
          ...v.toData(),
          verificationOrderStatus: 'TBCONFIRMED',
        };
      });
      if (!statusFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.statusValidate`)
            .d('选中的对账单中有无法提交的订单（待确认/已确认/已取消），请检查后选择'),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'statementInitiate/submitVerificationOrder',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '提交成功',
          });
          ListDS.query();
        }
        resolve();
      });
    });
  }

  function handleInitiateStatement() {
    history.push({ pathname: '/zcom/statement-select-document' });
  }

  function handleToDetail(record) {
    const { verificationOrderId } = record.toData();
    history.push({
      pathname: `/zcom/statement-initiate/detail/${verificationOrderId}`,
    });
  }

  const columns = [
    {
      name: 'verificationOrderNum',
      width: 150,
      lock: true,
      renderer: ({ record, value }) => <a onClick={() => handleToDetail(record)}>{value}</a>,
    },
    { name: 'customerCompanyName', width: 160 },
    { name: 'supplierName', width: 160 },
    { name: 'totalAmount', width: 120 },
    { name: 'taxAmount', width: 120 },
    { name: 'currencyCode', width: 80 },
    {
      name: 'creationDate',
      width: 120,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'verificationOrderStatusMeaning', width: 100, lock: 'right' },
    {
      header: '日志',
      width: 80,
      lock: 'right',
      renderer: ({ record }) => {
        return (
          <LogModal id={record.get('verificationOrderId')}>
            <a>日志</a>
          </LogModal>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.statementInitiate`).d('发起的对账单列表')}>
        <Button color="primary" onClick={handleSubmit}>
          提交
        </Button>
        <Button onClick={handleInitiateStatement}>发起对账</Button>
        <Button onClick={handleCancel}>取消</Button>
        <Button onClick={handleDelete}>删除</Button>
      </Header>
      <Content className={styles['zcom-statement-initiate-content']}>
        <Table dataSet={ListDS} columns={columns} queryFieldsLimit={3} columnResizable="true" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomStatementInitiate);
