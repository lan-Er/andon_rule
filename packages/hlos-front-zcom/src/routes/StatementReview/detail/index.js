/**
 * @Description: 对账单审核明细
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-12-16 14:22:25
 */

import React, { useState, useEffect, Fragment } from 'react';
import { DataSet, Button, Form, TextField, TextArea, Tabs, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { findStrIndex, getSerialNum } from '@/utils/renderer';
import { verifyVerificationOrder } from '@/services/statementReviewService';
import {
  statementReviewDetailHeadDS,
  statementReviewDetailAmountDS,
  statementReviewDetailLineDS,
  statementReviewOpinionDS,
} from '../store/StatementReviewDS';
import './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.deliveryReview';
const ReviewHeadDS = () => new DataSet(statementReviewDetailHeadDS());
const ReviewLineDS = (roleType) => new DataSet(statementReviewDetailLineDS(roleType));
const ReviewAmountDS = () => new DataSet(statementReviewDetailAmountDS());
const ReviewOpinionDS = () => new DataSet(statementReviewOpinionDS());

function ZcomStatementReviewDetail({ match, history }) {
  const roleType = getRoleType();
  const HeadDS = useDataSet(ReviewHeadDS, ZcomStatementReviewDetail);
  const LineDS = useDataSet(() => ReviewLineDS(roleType));
  const AmountDS = useDataSet(ReviewAmountDS);
  const opinionDS = useDataSet(ReviewOpinionDS);
  const [headShow, setHeadShow] = useState(true);
  const [curTab, setCurTab] = useState('amount');
  const {
    params: { verificationOrderId },
  } = match;

  function getRoleType() {
    const { pathname } = location;
    const pIndex = findStrIndex(pathname, '/', 2);
    const nIndex = findStrIndex(pathname, '/', 3);
    return pathname.substring(pIndex + 1, nIndex);
  }

  useEffect(() => {
    opinionDS.data = [];
    opinionDS.create();
    HeadDS.setQueryParameter('verificationOrderId', verificationOrderId);
    LineDS.setQueryParameter('verificationOrderId', verificationOrderId);
    AmountDS.setQueryParameter('verificationOrderId', verificationOrderId);
    HeadDS.query();
    LineDS.query();
    AmountDS.query();
  }, [verificationOrderId]);

  function handleToggle() {
    setHeadShow(!headShow);
  }

  function handleTabChange(key) {
    setCurTab(key);
  }

  async function handleReview(type) {
    let obj = {
      verificationOrderId,
      verificationOrderStatus: type,
      objectVersionNumber: HeadDS.current.get('objectVersionNumber'),
    };
    const approvalOpinion = opinionDS.current.get('reviewOpinion');
    if (approvalOpinion) {
      obj = Object.assign({}, obj, {
        approvalOpinion,
      });
    }
    try {
      const res = await verifyVerificationOrder([obj]);
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        const pathName = `/zcom/statement-review/${roleType}`;
        history.push(pathName);
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

  const AmountColumns = [
    { name: 'excludingTaxAmount', width: 150 },
    { name: 'amount', width: 150 },
    { name: 'taxAmount', width: 150 },
    { name: 'currencyCode', width: 150 },
    { name: 'afterAmount', width: 150 },
    { name: 'allocationRuleObj', width: 150 },
  ];

  const lineColumns = [
    {
      header: '序号',
      width: 60,
      lock: true,
      renderer: ({ record }) => getSerialNum(record),
    },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDescription', width: 150 },
    { name: 'supplierItemCode', width: 150 },
    { name: 'supplierItemDescription', width: 150 },
    { name: 'deliveryQty', width: 150 },
    { name: 'receivedQty', width: 150 },
    { name: 'totalVerificationQty', width: 150 },
    { name: 'reconcilableQty', width: 150 },
    { name: 'verificationQty', width: 150 },
    { name: 'uomName', width: 150 },
    { name: 'beforeExcludingTaxPrice', width: 150 },
    { name: 'beforeExcludingTaxAmount', width: 150 },
    { name: 'beforePrice', width: 150 },
    { name: 'beforeAmount', width: 150 },
    { name: 'afterAmount', width: 150 },
    { name: 'currencyCode', width: 150 },
    { name: 'taxRate', width: 150 },
    { name: 'lineRemark', width: 150 },
    { name: 'fileUrl', width: 150 },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.statementDetail`).d('对账单明细')}
        backPath={`/zcom/statement-review/${roleType}`}
      >
        <Button onClick={() => handleReview('CONFIRMED')}>审核通过</Button>
        <Button onClick={() => handleReview('REFUSED')}>审核拒绝</Button>
      </Header>
      <Content>
        <Form dataSet={opinionDS} labelLayout="vertical" columns={3} className="form-opinion">
          <TextArea name="reviewOpinion" key="reviewOpinion" colSpan={2} rows={8} />
        </Form>
        <div className="zcom-statement-review-headInfo">
          <span>对账单表头</span>
          <span className="headInfo-toggle" onClick={handleToggle}>
            {headShow ? '收起' : '展开'}
          </span>
        </div>
        {headShow ? (
          <Form dataSet={HeadDS} columns={3} className="statement-review-headInfo">
            <TextField name="verificationOrderNum" key="verificationOrderNum" disabled />
            <TextField name="verificationOrderType" key="verificationOrderType" disabled />
            {roleType === 'coreCompany' && (
              <TextField name="supplierName" key="supplierName" disabled />
            )}
            {roleType === 'supplier' && (
              <TextField name="customerName" key="customerName" disabled />
            )}
            <TextField name="amount" key="amount" disabled />
            <TextField name="submitDate" key="submitDate" disabled />
            <TextField name="createUserName" key="createUserName" disabled />
            <TextField name="remark" key="remark" disabled />
          </Form>
        ) : null}
        <Tabs defaultActiveKey={curTab} onChange={handleTabChange}>
          <TabPane tab="对账总额" key="amount">
            <Table dataSet={AmountDS} columns={AmountColumns} columnResizable="true" />
          </TabPane>
          <TabPane tab="对账明细" key="detail">
            <Table dataSet={LineDS} columns={lineColumns} columnResizable="true" />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomStatementReviewDetail {...props} />;
});
