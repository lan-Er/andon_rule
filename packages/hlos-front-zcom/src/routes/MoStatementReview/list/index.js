/**
 * @Description: 对账单审核列表
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-03-01 15:09:04
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentUser } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { reviewListDS } from '../store/MoStatementReviewDS';
import { verifyVerificationOrder } from '@/services/moStatementReviewService';
import styles from './index.less';

const intlPrefix = 'zcom.statementReview';
const ReviewListDS = () => new DataSet({ ...reviewListDS() });

function ZcomMoStatementReview({ history }) {
  const ListDS = useDataSet(ReviewListDS, ZcomMoStatementReview);

  useEffect(() => {
    ListDS.query();
  }, []);

  function handleToDetail(id) {
    const pathName = `/zcom/mo-statement-review/detail/${id}`;
    history.push(pathName);
  }

  async function handleReview(type) {
    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }
    // 只有已提交状态可以进行审批操作
    let statusFlag = true;
    const arr = [];
    const { id, realName } = getCurrentUser();
    ListDS.selected.forEach((v) => {
      if (v.data.verificationOrderStatus !== 'RELEASED') {
        statusFlag = false;
      }
      const obj = {
        verificationOrderId: v.data.verificationOrderId,
        objectVersionNumber: v.data.objectVersionNumber,
        verificationOrderStatus: v.data.verificationOrderStatus,
        approvalBy: id,
        approvalByName: realName,
        auditConfirmOrRefuse: type === 'CONFIRMED' ? 1 : 0,
      };
      arr.push(obj);
    });
    if (!statusFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.statusCheck`)
          .d('选中对账单包含已审核通过或已驳回对账单，取消选中后重新审核'),
      });
      return;
    }
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
    {
      name: 'creationDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'postingDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'customerNumber', width: 150 },
    { name: 'customerDescription', width: 150 },
    { name: 'supplierNumber', width: 150 },
    { name: 'supplierDescription', width: 150 },
    { name: 'excludingTaxAmount', width: 150 },
    { name: 'amount', width: 150 },
    { name: 'currencyCode', width: 150 },
    { name: 'createdByName', width: 150 },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.statementReview`).d('对账单审核')}>
        <Button onClick={() => handleReview('CONFIRMED')}>审核通过</Button>
        <Button onClick={() => handleReview('REFUSED')}>审核拒绝</Button>
      </Header>
      <Content className={styles['zcom-mo-statement-review-content']}>
        <Table dataSet={ListDS} columns={columns} columnResizable="true" queryFieldsLimit="4" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomMoStatementReview {...props} />;
});
