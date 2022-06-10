/**
 * @Description: 客供料退料单审核详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-02-03 13:30:43
 */

import React, { useState, useEffect, Fragment } from 'react';
import { DataSet, Button, Form, TextField, TextArea, Table, Modal, Tabs } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { downloadFile } from 'services/api';
import {
  returnReviewHeadDS,
  returnReviewLineDS,
  refundBatchListDS,
  refundSerialListDS,
  returnReviewLogisticsDS,
} from '../store/CustomerItemReturnReviewDS';
import { verifyItemRefund } from '@/services/customerItemReturnReviewService';
import styles from './index.less';

const { TabPane } = Tabs;
const batchKey = Modal.key();
const serialKey = Modal.key();
const organizationId = getCurrentOrganizationId();
const intlPrefix = 'zcom.customerItemReturnReview';
const HeadDS = new DataSet(returnReviewHeadDS());
const LineDS = new DataSet(returnReviewLineDS());
const BatchDS = new DataSet(refundBatchListDS());
const SerialDS = new DataSet(refundSerialListDS());
const LogisticsDS = new DataSet(returnReviewLogisticsDS());

function ZcomCustomerItemReturnReviewDetail({ match, history }) {
  const [canEdit, setCanEdit] = useState(true);
  const [curTab, setCurTab] = useState('material');
  const [headFile, setHeadFile] = useState(null);
  const {
    params: { itemRefundId },
  } = match;

  useEffect(() => {
    async function loadData() {
      HeadDS.current.set('approvalOpinion', '');
      HeadDS.setQueryParameter('itemRefundId', itemRefundId);
      LineDS.setQueryParameter('itemRefundId', itemRefundId);
      LogisticsDS.setQueryParameter('itemRefundId', itemRefundId);
      await HeadDS.query();
      setHeadFile(HeadDS.current.get('fileUrl'));
      setCanEdit(HeadDS.current.get('itemRefundStatus') === 'RELEASED');
      LineDS.query();
      LogisticsDS.query();
    }
    loadData();
  }, [itemRefundId]);

  async function handleReview(type) {
    let obj = {
      itemRefundId,
      itemRefundStatus: type,
      objectVersionNumber: HeadDS.current.get('objectVersionNumber'),
    };
    const approvalOpinion = HeadDS.current.get('approvalOpinion');
    if (approvalOpinion) {
      obj = Object.assign({}, obj, {
        approvalOpinion,
      });
    }
    try {
      const res = await verifyItemRefund([obj]);
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        const pathName = `/zcom/customer-item-return-review`;
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

  function handleSearch(record, type) {
    if (type === 'refundBatchList') {
      BatchDS.data = record.toData().refundBatchList;
    }
    if (type === 'refundSerialList') {
      SerialDS.data = record.toData().refundSerialList;
    }
    Modal.open({
      key: type === 'refundBatchList' ? batchKey : serialKey,
      closable: true,
      title: `${type === 'refundBatchList' ? '批次' : '序列号'}查询`,
      children: (
        <div>
          <Table
            dataSet={type === 'refundBatchList' ? BatchDS : SerialDS}
            columns={type === 'refundBatchList' ? batchColumns : serialColumns}
            columnResizable="true"
          />
        </div>
      ),
      okText: '确定',
      className: styles['zcom-customer-item-return-review-modal'],
    });
  }

  function handleTabChange(key) {
    setCurTab(key);
  }

  // 查看附件
  function downloadHeadFile(file) {
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

  const batchColumns = [
    { name: 'itemRefundNum', width: 150, align: 'center' },
    { name: 'refundLineNum', width: 150, align: 'center' },
    { name: 'customerItemCode', width: 150, align: 'center' },
    { name: 'customerItemDescription', width: 150, align: 'center' },
    { name: 'batchQty', width: 150, align: 'center' },
    { name: 'batchNum', width: 150, align: 'center' },
  ];

  const serialColumns = [
    { name: 'itemRefundNum', width: 150, align: 'center' },
    { name: 'refundLineNum', width: 150, align: 'center' },
    { name: 'customerItemCode', width: 150, align: 'center' },
    { name: 'customerItemDescription', width: 150, align: 'center' },
    { name: 'serialQty', width: 150, align: 'center' },
    { name: 'serialNum', width: 150, align: 'center' },
  ];

  const lineColumns = [
    { name: 'refundLineNum', width: 150 },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDescription', width: 150 },
    { name: 'refundQty', width: 150 },
    { name: 'totalReceivedQty', width: 150 },
    { name: 'receiveDate', width: 150 },
    { name: 'lineRemark', width: 150 },
    {
      name: 'sequenceLotControl',
      width: 150,
      align: 'center',
      lock: 'right',
      renderer: ({ record, value }) => {
        return (
          <a disabled={value !== 'LOT'} onClick={() => handleSearch(record, 'refundBatchList')}>
            查询
          </a>
        );
      },
    },
    {
      name: 'tagFlag',
      width: 150,
      align: 'center',
      lock: 'right',
      renderer: ({ record, value }) => {
        return (
          <a
            disabled={value !== 1 && value !== '1'}
            onClick={() => handleSearch(record, 'refundSerialList')}
          >
            查询
          </a>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.customerItemReturnReview`).d('客供料退料审核')}
        backPath="/zcom/customer-item-return-review"
      >
        {headFile && <Button onClick={() => downloadHeadFile(headFile)}>查看附件</Button>}
        {canEdit && (
          <>
            <Button onClick={() => handleReview('CONFIRMEND')}>审核通过</Button>
            <Button onClick={() => handleReview('REFUSED')}>审核拒绝</Button>
          </>
        )}
      </Header>
      <Content>
        <Form dataSet={HeadDS} columns={4}>
          <TextField name="refundWmOuName" key="refundWmOuName" disabled />
          <TextField name="itemRefundNum" key="itemRefundNum" disabled />
          <TextField name="customerName" key="customerName" disabled />
          <TextField name="supplierName" key="supplierName" disabled />
          <TextField name="itemRefundStatusMeaning" key="itemRefundStatusMeaning" disabled />
          <TextField name="itemRefundDate" key="itemRefundDate" disabled />
          <TextField name="refundWarehouseName" key="refundWarehouseName" disabled />
          <TextField name="customerWarehouseName" key="customerWarehouseName" disabled />
          <TextField name="itemRefundAddress" key="itemRefundAddress" disabled />
          <TextField name="remark" key="remark" disabled colSpan={2} />
          <TextArea
            name="approvalOpinion"
            key="approvalOpinion"
            newLine
            colSpan={2}
            rows={8}
            disabled={!canEdit}
          />
        </Form>
        <Tabs defaultActiveKey={curTab} onChange={handleTabChange}>
          <TabPane tab="物料信息" key="material">
            <Table dataSet={LineDS} columns={lineColumns} columnResizable="true" />
          </TabPane>
          <TabPane tab="物流信息" key="logistics">
            <div className={styles['base-line']}>
              <div className={styles['base-line-tag']} />
              <div className={styles['base-line-title']}>基础信息</div>
            </div>
            <Form
              dataSet={LogisticsDS}
              columns={3}
              className={styles['customer-item-return-review-logistics']}
            >
              <TextField name="courierNumber" key="courierNumber" disabled />
              <TextField name="deliveryStaff" key="deliveryStaff" disabled />
              <TextField name="addresseeContact" key="addresseeContact" disabled />
              <TextField name="logisticsCompany" key="logisticsCompany" disabled />
              <TextField name="deliveryContact" key="deliveryContact" disabled />
              <TextField name="freight" key="freight" disabled />
            </Form>
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomCustomerItemReturnReviewDetail {...props} />;
});
