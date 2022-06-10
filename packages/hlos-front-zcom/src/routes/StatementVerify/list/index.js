/**
 * @Description: 收到的对账单列表（供应商）
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-10 22:28:19
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

const intlPrefix = 'zcom.statementVerify';
const statementListDS = () => new DataSet(StatementListDS());

function ZcomStatementVerify({ history, dispatch }) {
  const ListDS = useDataSet(statementListDS, ZcomStatementVerify);

  useEffect(() => {
    ListDS.query();
  }, []);

  function handleVerify(type) {
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
        if (!['TBCONFIRMED'].includes(v.data.verificationOrderStatus)) {
          statusFlag = false;
        }
        return {
          ...v.toData(),
          verificationOrderStatus: type,
        };
      });
      if (!statusFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.statusValidate`)
            .d('存在不是待确认的对账单，请检查后选择'),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'statementVerify/verifyVerificationOrder',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          ListDS.query();
        }
        resolve();
      });
    });
  }

  function handleToDetail(record) {
    const { verificationOrderId } = record.toData();
    history.push({
      pathname: `/zcom/statement-verify/detail/${verificationOrderId}`,
    });
  }

  const columns = [
    {
      name: 'verificationOrderNum',
      width: 150,
      lock: true,
      renderer: ({ record, value }) => <a onClick={() => handleToDetail(record)}>{value}</a>,
    },
    { name: 'supplierCompanyName', width: 160 },
    { name: 'customerName', width: 160 },
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
      <Header title={intl.get(`${intlPrefix}.view.title.statementReceived`).d('收到的对账单列表')}>
        <Button color="primary" onClick={() => handleVerify('CONFIRMED')}>
          确认
        </Button>
        <Button onClick={() => handleVerify('REJECTED')}>退回</Button>
      </Header>
      <Content className={styles['zcom-statement-verify-content']}>
        <Table dataSet={ListDS} columns={columns} queryFieldsLimit={3} columnResizable="true" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomStatementVerify);
