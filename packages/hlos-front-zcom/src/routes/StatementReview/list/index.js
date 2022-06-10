/**
 * @Description: 对账单审核
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-12-16 14:19:46
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { findStrIndex } from '@/utils/renderer';
import { statementReviewListDS } from '../store/StatementReviewDS';
import { verifyVerificationOrder } from '@/services/statementReviewService';

const intlPrefix = 'zcom.statementReview';
const ReviewListDS = (roleType) => new DataSet(statementReviewListDS(roleType));

function ZcomStatementReview({ history }) {
  const roleType = getRoleType();
  const ListDS = useDataSet(() => ReviewListDS(roleType), ZcomStatementReview);

  useEffect(() => {
    ListDS.setQueryParameter('verificationOrderStatus', 'RELEASED');
    ListDS.query();
  }, []);

  function getRoleType() {
    const { pathname } = location;
    const pIndex = findStrIndex(pathname, '/', 2);
    const nIndex = findStrIndex(pathname, '/', 3);
    return pathname.substring(pIndex + 1, nIndex);
  }

  function handleToDetail(id) {
    const pathName = `/zcom/statement-review/${roleType}/detail/${id}`;
    history.push(pathName);
  }

  async function handleReview(type) {
    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }
    const arr = [];
    ListDS.selected.forEach((v) => {
      const obj = {
        verificationOrderId: v.data.verificationOrderId,
        objectVersionNumber: v.data.objectVersionNumber,
        verificationOrderStatus: type,
      };
      arr.push(obj);
    });
    try {
      const res = await verifyVerificationOrder(arr);
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        ListDS.query();
      } else {
        notification.error({
          message: res.message,
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  const columns = [
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
      <Header title={intl.get(`${intlPrefix}.view.title.statementReview`).d('对账单审核')}>
        <Button onClick={() => handleReview('CONFIRMED')}>审核通过</Button>
        <Button onClick={() => handleReview('REFUSED')}>审核拒绝</Button>
      </Header>
      <Content>
        <Table dataSet={ListDS} columns={columns} columnResizable="true" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomStatementReview {...props} />;
});
