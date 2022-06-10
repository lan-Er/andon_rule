/**
 * @Description: 送货单审核明细
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-30 15:52:19
 */

import React, { useState, useEffect, Fragment } from 'react';
import { DataSet, Button, Form, TextField, TextArea, Tabs, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getSerialNum } from '@/utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import { downloadFile } from 'services/api';
import { HZERO_FILE } from 'utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

import {
  deliveryReviewDetailHeadDS,
  deliveryReviewDetailLineDS,
  deliveryReviewDetailLogisticsDS,
  deliveryReviewOpinionDS,
} from '../store/DeliveryReviewDS';
import { verifyDeliveryOrder } from '@/services/deliveryReviewService';
import './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.deliveryReview';
const HeadDS = new DataSet(deliveryReviewDetailHeadDS());
const LineDS = new DataSet(deliveryReviewDetailLineDS());
const LogisticsDS = new DataSet(deliveryReviewDetailLogisticsDS());
const opinionDS = new DataSet(deliveryReviewOpinionDS());
const organizationId = getCurrentOrganizationId();

function ZcomDeliveryReviewDetail({ match, history }) {
  const [headShow, setHeadShow] = useState(true);
  const [curTab, setCurTab] = useState('material');
  const {
    params: { deliveryOrderId },
  } = match;

  useEffect(() => {
    opinionDS.data = [];
    opinionDS.create();
    HeadDS.setQueryParameter('deliveryOrderId', deliveryOrderId);
    LineDS.setQueryParameter('deliveryOrderId', deliveryOrderId);
    LogisticsDS.setQueryParameter('deliveryOrderId', deliveryOrderId);
    HeadDS.query();
    LineDS.query();
    LogisticsDS.query();
  }, [deliveryOrderId]);

  function handleToggle() {
    setHeadShow(!headShow);
  }

  function handleTabChange(key) {
    setCurTab(key);
  }

  async function handleReview(type) {
    let obj = {
      deliveryOrderId,
      deliveryOrderStatus: type,
      objectVersionNumber: HeadDS.current.get('objectVersionNumber'),
    };
    const approvalOpinion = opinionDS.current.get('reviewOpinion');
    if (approvalOpinion) {
      obj = Object.assign({}, obj, {
        approvalOpinion,
      });
    }
    try {
      const res = await verifyDeliveryOrder([obj]);
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        const pathName = `/zcom/delivery-review`;
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

  // 查看行附件
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
    {
      header: '序号',
      width: 60,
      lock: true,
      renderer: ({ record }) => getSerialNum(record),
    },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDescription', width: 150 },
    { name: 'itemCode', width: 150 },
    { name: 'supplierItemDescription', width: 150 },
    { name: 'promiseQty', width: 150 },
    { name: 'shippableQty', width: 150 },
    { name: 'deliveryQty', width: 150, align: 'left' },
    { name: 'uomName', width: 150 },
    { name: 'customerLotNumber', width: 150 },
    { name: 'serialNumber', width: 150 },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum', width: 150 },
    { name: 'demandDate', width: 150 },
    { name: 'promiseDate', width: 150 },
    { name: 'lineRemark', width: 150 },
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
    // { name: 'lineAttachment', width: 150 },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.deliveryDetail`).d('送货单明细')}
        backPath="/zcom/delivery-review"
      >
        <Button onClick={() => handleReview('CONFIRMED')}>审核通过</Button>
        <Button onClick={() => handleReview('REFUSED')}>审核拒绝</Button>
      </Header>
      <Content>
        <Form dataSet={opinionDS} labelLayout="vertical" columns={3} className="form-opinion">
          <TextArea name="reviewOpinion" key="reviewOpinion" colSpan={2} rows={8} />
        </Form>
        <div className="zcom-delivery-review-headInfo">
          <span>送货单明细</span>
          <span className="headInfo-toggle" onClick={handleToggle}>
            {headShow ? '收起' : '展开'}
          </span>
        </div>
        {headShow ? (
          <Form dataSet={HeadDS} columns={3} className="delivery-review-headInfo">
            <TextField name="deliveryOrderNum" key="deliveryOrderNum" disabled />
            <TextField name="deliveryOrderTypeMeaning" key="deliveryOrderTypeMeaning" disabled />
            <TextField name="supplierName" key="supplierName" disabled />
            <TextField name="receiveOrgName" key="receiveOrgName" disabled />
            <TextField name="receiveAddress" key="receiveAddress" disabled />
            <TextField name="deliveryShipper" key="deliveryShipper" disabled />
            <TextField name="warehouseName" key="warehouseName" disabled />
            <TextField name="planDeliveryDate" key="planDeliveryDate" disabled />
            <TextField name="expectedArrivalDate" key="expectedArrivalDate" disabled />
            <TextField newLine name="remark" key="remark" disabled />
          </Form>
        ) : null}
        <Tabs defaultActiveKey={curTab} onChange={handleTabChange}>
          <TabPane tab="物料信息" key="material">
            <Table dataSet={LineDS} columns={lineColumns} columnResizable="true" />
          </TabPane>
          <TabPane tab="物流信息" key="logistics">
            <div className="base-line">
              <div className="base-line-tag" />
              <div className="base-line-title">基础信息</div>
            </div>
            <Form dataSet={LogisticsDS} columns={3} className="delivery-review-headInfo">
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
  return <ZcomDeliveryReviewDetail {...props} />;
});
