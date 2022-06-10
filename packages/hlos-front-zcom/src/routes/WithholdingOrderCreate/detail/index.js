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
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { getResponse } from 'utils/utils';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import notification from 'utils/notification';
import { DeliveryOrderHeadDS, DeliveryOrderLineDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zcom.deliveryApply';
const deliveryOrderHeadDS = () => new DataSet(DeliveryOrderHeadDS());
const deliveryOrderLineDS = () => new DataSet(DeliveryOrderLineDS());

function ZcomDeliveryApplyDetail({ match, dispatch, history }) {
  const HeadDS = useDataSet(deliveryOrderHeadDS, ZcomDeliveryApplyDetail);
  const LineDS = useDataSet(deliveryOrderLineDS);

  const {
    params: { type, withholdingOrderId },
  } = match;

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

  useDataSetEvent(LineDS, 'submitSuccess', () => {
    HeadDS.query();
  });

  useDataSetEvent(LineDS, 'update', ({ name }) => {
    if (name === 'poObj' && LineDS && LineDS.current) {
      setTimeout(() => {
        LineDS.current.editing = false;
        LineDS.current.editing = true;
      });
    }
  });

  async function handleSearch() {
    await HeadDS.query();
    await LineDS.query();
    setCanEdit(['NEW', 'REJECTED'].includes(HeadDS.current.get('withholdingOrderStatus')));
  }

  const columns = [
    { name: 'withholdingLineNum', lock: 'left' },
    { name: 'externalSourceDocNum', width: 150 },
    { name: 'poObj', width: 150, editor: canEdit },
    { name: 'poLineNum', width: 150 },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDesc', width: 150 },
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
      editor: (record) => !record.get('poId'),
    },
    { name: 'customerDqcQty', width: 150, editor: canEdit, align: 'left' },
    { name: 'customerUomObj', width: 150, editor: (record) => !record.get('poId') },
    { name: 'customerMaterialCost', width: 150, editor: canEdit, align: 'left' },
    { name: 'customerAssociatedCost', width: 150, editor: canEdit, align: 'left' },
    { name: 'customerManualCost', width: 150, editor: canEdit, align: 'left' },
    { name: 'customerOtherCost', width: 120, editor: canEdit, align: 'left' },
    { name: 'amount', width: 150 },
    { name: 'exTaxAmount', width: 150 },
    { name: 'remark', width: 150, editor: canEdit },
    { name: 'supplierFeedback', width: 120, lock: 'right' },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      command: ['edit'],
      lock: 'right',
    },
  ];

  const handleSubmit = async (apiName, status) => {
    const validateValue = await HeadDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }

    if (!LineDS.length) {
      notification.error({
        message: '存在扣款单没有行数据，不能提交！',
      });
      return;
    }

    return new Promise(async (resolve) => {
      const headers = HeadDS.current.toData();

      dispatch({
        type: `withholdingOrderModel/${apiName}`,
        payload: [
          {
            ...headers,
            withholdingOrderStatus: status,
          },
        ],
      }).then(async (res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          history.push({
            pathname: `/zcom/withholding-order-create`,
          });
        }
        resolve();
      });
    });
  };

  const handleSave = async () => {
    const validateValue = await HeadDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }

    const res = await HeadDS.submit();
    if (getResponse(res) && res.content && res.content[0]) {
      history.push({
        pathname: `/zcom/withholding-order-create/detail/${res.content[0].withholdingOrderId}`,
      });
    }
  };

  const handleCreate = () => {
    const {
      withholdingOrderNum,
      tenantId,
      currencyId,
      currencyCode,
      supplierId,
      customerId,
    } = HeadDS.current.toData();
    LineDS.create(
      {
        withholdingOrderId,
        withholdingOrderNum,
        tenantId,
        currencyId,
        currencyCode,
        supplierId,
        customerId,
      },
      0
    );
  };

  const handClear = () => {
    HeadDS.current.reset();
  };

  return (
    <Fragment>
      <Header title="发起的扣款单详情" backPath="/zcom/withholding-order-create">
        {canEdit && (
          <>
            <Button
              onClick={() => handleSubmit('submitWithholdingOrder', 'TBCONFIRMED')}
              color="primary"
            >
              保存并提交
            </Button>
            <Button onClick={() => handleSave('submitDeliveryApply', 'DELIVERED')}>保存</Button>
          </>
        )}

        {canEdit && type === 'create' && <Button onClick={handClear}>清空</Button>}
      </Header>
      <Content className={styles['zcom-delivery-apply-detail-content']}>
        <Form dataSet={HeadDS} columns={4}>
          <TextField name="withholdingOrderNum" key="withholdingOrderNum" disabled />
          <Select name="withholdingOrderType" key="withholdingOrderType" disabled={!canEdit} />
          <Select name="withholdingOrderStatus" key="withholdingOrderStatus" disabled />
          <Lov name="companyObj" key="companyObj" noCache disabled={type !== 'create'} />
          <Lov name="supplierObj" key="supplierObj" noCache disabled={type !== 'create'} />
          <TextField name="totalAmount" key="totalAmount" disabled />
          <TextField name="exTaxAmount" key="exTaxAmount" disabled />
          <Lov name="currencyObj" key="currencyObj" noCache disabled={type !== 'create'} />
          <DatePicker
            name="feedbackRequestedDate"
            key="feedbackRequestedDate"
            disabled={!canEdit}
          />
          <TextArea
            newLine
            name="remark"
            key="remark"
            rowSpan={3}
            colSpan={4}
            disabled={!canEdit}
          />
        </Form>

        <Table
          dataSet={LineDS}
          columns={columns}
          columnResizable="true"
          rowHeight="auto"
          buttons={
            canEdit && withholdingOrderId
              ? [['add', { onClick: () => handleCreate() }], 'delete']
              : []
          }
          editMode="inline"
        />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomDeliveryApplyDetail);
