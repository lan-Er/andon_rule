/**
 * @Description: 发货申请详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-25 15:38:07
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Form,
  TextField,
  Select,
  DatePicker,
  Table,
  Lov,
  TextArea,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import notification from 'utils/notification';
import { DeliveryOrderHeadDS, DeliveryOrderLineDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zcom.deliveryApply';
const deliveryOrderHeadDS = () => new DataSet(DeliveryOrderHeadDS());
const deliveryOrderLineDS = () => new DataSet(DeliveryOrderLineDS());

function ZcomDeliveryApplyDetail({ match, dispatch, history, location }) {
  const HeadDS = useDataSet(deliveryOrderHeadDS, ZcomDeliveryApplyDetail);
  const LineDS = useDataSet(deliveryOrderLineDS);

  const {
    params: { type, withholdingOrderId },
  } = match;

  const { state } = location;

  const [canEdit, setCanEdit] = useState(true); // 是否可编辑

  useEffect(() => {
    HeadDS.setQueryParameter('withholdingOrderId', null);
    LineDS.setQueryParameter('withholdingOrderId', null);
    HeadDS.data = [];
    HeadDS.create();
    LineDS.data = [];
    LineDS.clearCachedSelected();

    if (type === 'create') {
      HeadDS.current.set('withholdingOrderStatus', 'NEW');
    } else {
      HeadDS.setQueryParameter('withholdingOrderId', withholdingOrderId);
      LineDS.setQueryParameter('withholdingOrderId', withholdingOrderId);
      handleSearch();
    }
  }, [withholdingOrderId]);

  async function handleSearch() {
    await HeadDS.query();
    await LineDS.query();
    setCanEdit(HeadDS.current.data.withholdingOrderStatus === 'TBCONFIRMED');
  }

  const getcolumns = () => {
    const columns = [
      { name: 'withholdingLineNum', lock: 'left' },
      { name: 'externalSourceDocNum', width: 150 },
      { name: 'poObj', width: 150 },
      { name: 'poLineNum', width: 150 },
      {
        name: 'customerItemCode',
        width: 150,
        renderer: ({ record, value }) => {
          const { customerItemDesc = '' } = record.data;
          return (
            <>
              <div>{value}</div>
              <div>{customerItemDesc}</div>
            </>
          );
        },
      },
      {
        name: 'supplierItemCode',
        width: 150,
        renderer: ({ record, value }) => {
          const { supplierItemDesc = '' } = record.data;
          return (
            <>
              <div>{value}</div>
              <div>{supplierItemDesc}</div>
            </>
          );
        },
      },
      {
        name: 'itemAttr',
        width: 150,
        renderer: ({ record, value }) => {
          return (
            <ItemAttributeSelect
              data={value}
              itemId={record.get('customerItemId')}
              itemDesc={record.get('customerItemCode')}
              disabled
            />
          );
        },
      },
      {
        name: 'taxRateObj',
        width: 150,
      },
      { name: 'customerDqcQty', width: 150, align: 'left' },
      { name: 'customerUomObj', width: 150 },
      { name: 'customerMaterialCost', width: 150, align: 'left' },
      { name: 'customerAssociatedCost', width: 150, align: 'left' },
      { name: 'customerManualCost', width: 150, align: 'left' },
      { name: 'customerOtherCost', width: 120, align: 'left' },
      { name: 'amount', width: 150 },
      { name: 'exTaxAmount', width: 150 },
      { name: 'remark', width: 150 },
      { name: 'supplierFeedback', width: 120, lock: 'right', editor: canEdit },
    ];
    if (canEdit) {
      columns.push({
        header: intl.get('hzero.common.button.action').d('操作'),
        command: ['edit'],
        lock: 'right',
      });
    }

    return columns;
  };

  const handleSave = (status) => {
    return new Promise(async (resolve) => {
      const headers = HeadDS.current.toData();

      dispatch({
        type: `withholdingOrderModel/verifyWithholdingOrder`,
        payload: {
          ...headers,
          withholdingOrderStatus: status,
        },
      }).then(async (res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          history.push({
            pathname: `/zcom/withholding-order-review`,
          });
        }
        resolve();
      });
    });
  };

  return (
    <Fragment>
      <Header title="收到的扣款单详情" backPath={state || '/zcom/withholding-order-review'}>
        {canEdit && (
          <>
            <Button onClick={() => handleSave('CONFIRMED')} color="primary">
              保存并确认
            </Button>
            <Button onClick={() => handleSave('REJECTED')}>保存并申诉</Button>
          </>
        )}
      </Header>
      <Content className={styles['zcom-delivery-apply-detail-content']}>
        <Form dataSet={HeadDS} columns={4}>
          <TextField name="withholdingOrderNum" key="withholdingOrderNum" disabled />
          <Select name="withholdingOrderType" key="withholdingOrderType" disabled />
          <Select name="withholdingOrderStatus" key="withholdingOrderStatus" disabled />
          <TextField name="supplierCompanyName" key="supplierCompanyName" disabled />
          <TextField name="customerName" key="customerName" disabled />
          <TextField name="totalAmount" key="totalAmount" disabled />
          <TextField name="exTaxAmount" key="exTaxAmount" disabled />
          <Lov name="currencyObj" key="currencyObj" noCache disabled />
          <DatePicker name="feedbackRequestedDate" key="feedbackRequestedDate" disabled />
          <TextArea newLine name="remark" key="remark" rowSpan={3} colSpan={4} disabled />
        </Form>
        、
        <Table
          dataSet={LineDS}
          columns={getcolumns()}
          columnResizable="true"
          rowHeight="auto"
          editMode="inline"
        />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomDeliveryApplyDetail);
