/**
 * @Description: 对账单审核详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-03-01 15:09:22
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Form,
  TextField,
  TextArea,
  Tabs,
  Table,
  DatePicker,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getCurrentUser } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { downloadFile } from 'services/api';
import { verifyVerificationOrder } from '@/services/moStatementReviewService';
import { reviewDetailHeadDS, reviewDetailLineDS } from '../store/MoStatementReviewDS';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.statementReview';
const ReviewHeadDS = () => new DataSet(reviewDetailHeadDS());
const ReviewLineDS = () => new DataSet(reviewDetailLineDS());
const organizationId = getCurrentOrganizationId();

function ZcomMoStatementReviewDetail({ match, history }) {
  const HeadDS = useDataSet(ReviewHeadDS, ZcomMoStatementReviewDetail);
  const LineDS = useDataSet(ReviewLineDS);
  const [headShow, setHeadShow] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [headFile, setHeadFile] = useState(null);
  const {
    params: { verificationOrderId },
  } = match;

  useEffect(() => {
    HeadDS.data = [];
    HeadDS.create();
    HeadDS.setQueryParameter('verificationOrderId', verificationOrderId);
    LineDS.setQueryParameter('verificationOrderId', verificationOrderId);
    initData();
  }, [verificationOrderId]);

  async function initData() {
    await HeadDS.query();
    setHeadFile(HeadDS.current.get('fileUrl'));
    setCanReview(HeadDS.current.get('verificationOrderStatus') === 'RELEASED');
    const { id, realName } = getCurrentUser();
    HeadDS.current.set('approvalBy', id);
    HeadDS.current.set('approvalByName', realName);
    LineDS.query();
  }

  function handleToggle() {
    setHeadShow(!headShow);
  }

  async function handleReview(type) {
    let obj = {
      verificationOrderId,
      verificationOrderStatus: HeadDS.current.get('verificationOrderStatus'),
      objectVersionNumber: HeadDS.current.get('objectVersionNumber'),
      approvalBy: HeadDS.current.get('approvalBy'),
      approvalByName: HeadDS.current.get('approvalByName'),
      auditConfirmOrRefuse: type === 'CONFIRMED' ? 1 : 0,
    };
    const approvalOpinion = HeadDS.current.get('approvalOpinion');
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
        const pathName = `/zcom/mo-statement-review`;
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

  function downloadLineFile(file) {
    const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: 'zcom' },
        { name: 'directory', value: 'zcom' },
        { name: 'url', value: file },
      ],
    });
  }

  const lineColumns = [
    { name: 'verificationOrderLineNum', width: 60, lock: true },
    { name: 'sourceOrderNum', width: 150 },
    { name: 'moTypeName', width: 150 },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDescription', width: 150 },
    { name: 'supplierItemCode', width: 150 },
    { name: 'supplierItemDescription', width: 150 },
    { name: 'sourceOrderQty', width: 150 },
    { name: 'completionQty', width: 150 },
    { name: 'verificationQty', width: 150 },
    { name: 'moVerificationTotal', width: 150 },
    { name: 'verificationUom', width: 150 },
    { name: 'beforeExcludingTaxPrice', width: 150 },
    { name: 'beforeExcludingTaxAmount', width: 150 },
    { name: 'currencyCode', width: 150 },
    { name: 'taxRate', width: 150 },
    { name: 'externalOrderNum', width: 150 },
    { name: 'externalOrderLineNum', width: 150 },
    { name: 'attributeString1', width: 150 },
    { name: 'remark', width: 150 },
    {
      name: 'fileUrl',
      width: 150,
      renderer: ({ value }) => {
        return (
          <span
            style={{ cursor: 'pointer', color: '#29bece' }}
            onClick={() => downloadLineFile(value)}
          >
            {value ? '查看附件' : ''}
          </span>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.statementDetail`).d('对账单明细')}
        backPath="/zcom/mo-statement-review"
      >
        {canReview && (
          <>
            <Button onClick={() => handleReview('CONFIRMED')}>审核通过</Button>
            <Button onClick={() => handleReview('REFUSED')}>审核拒绝</Button>
          </>
        )}
        {headFile && <Button onClick={() => downloadLineFile(headFile)}>查看附件</Button>}
      </Header>
      <Content className={styles['mo-statement-review-content']}>
        <Form
          dataSet={HeadDS}
          labelLayout="vertical"
          columns={3}
          className={styles['form-opinion']}
        >
          <TextArea
            name="approvalOpinion"
            key="approvalOpinion"
            colSpan={2}
            rows={8}
            disabled={!canReview}
          />
        </Form>
        <div className={styles['review-headInfo']}>
          <span>对账单表头</span>
          <span className={styles['headInfo-toggle']} onClick={handleToggle}>
            {headShow ? '收起' : '展开'}
          </span>
        </div>
        {headShow ? (
          <Form dataSet={HeadDS} columns={3} className={styles['statement-review-headInfo']}>
            <TextField name="verificationOrderNum" key="verificationOrderNum" disabled />
            <TextField name="verificationOrderType" key="verificationOrderType" disabled />
            <TextField name="verificationOrderStatus" key="verificationOrderStatus" disabled />
            <TextField name="supplierDescription" key="supplierDescription" disabled />
            <TextField name="customerDescription" key="customerDescription" disabled />
            <TextField name="amount" key="amount" disabled />
            <TextField name="excludingTaxAmount" key="excludingTaxAmount" disabled />
            <TextField name="creationDate" key="creationDate" disabled />
            <TextField name="createdByName" key="createdByName" disabled />
            <TextField name="approvalByName" key="approvalByName" disabled />
            <DatePicker name="postingDate" key="postingDate" disabled />
            <TextArea name="remark" key="remark" disabled newLine colSpan={2} rows={3} />
          </Form>
        ) : null}
        <Tabs defaultActiveKey="detail">
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
  return <ZcomMoStatementReviewDetail {...props} />;
});
