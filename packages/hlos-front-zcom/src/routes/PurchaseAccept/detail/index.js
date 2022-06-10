/**
 * @Description: 采购接收详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-03 14:18:12
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Form, TextField, Table, Modal } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import moment from 'moment';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import { PurchaseAcceptHeadDS, PurchaseAcceptLineDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zcom.purchaseAccept';
const purchaseAcceptHeadDS = () => new DataSet(PurchaseAcceptHeadDS());
const purchaseAcceptLineDS = () => new DataSet(PurchaseAcceptLineDS());

function ZcomPurchaseAcceptDetail({ location, dispatch, history }) {
  const HeadDS = useDataSet(purchaseAcceptHeadDS, ZcomPurchaseAcceptDetail);
  const LineDS = useDataSet(purchaseAcceptLineDS);

  const { state } = location;
  const stateObj = state || {};

  useEffect(() => {
    HeadDS.data = [];
    HeadDS.create();
    HeadDS.current.set('supplierName', stateObj.supplierName);
    LineDS.data = [];
    LineDS.clearCachedSelected();
    LineDS.setQueryParameter('idList', stateObj.idList);
    handleSearch();
  }, []);

  function handleSearch() {
    LineDS.query();
  }

  function lineValidate() {
    const arr = [];
    LineDS.data.forEach((v) => {
      arr.push(v.validate(true, false));
    });
    return arr;
  }

  function selectLineValidate() {
    const arr = [];
    LineDS.selected.forEach((v) => {
      arr.push(v.validate(true, false));
    });
    return arr;
  }

  function handleOperate(apiName, arr) {
    dispatch({
      type: `purchaseAccept/${apiName}`,
      payload: arr,
    }).then((res) => {
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        const pathName = `/zcom/purchase-accept`;
        history.push(pathName);
      }
    });
  }

  async function handleReceive(apiName) {
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      const validateLineResult = await Promise.all(
        LineDS.selected.length ? selectLineValidate() : lineValidate()
      );
      if (!validateHead || validateLineResult.findIndex((v) => !v) !== -1) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(false);
        return false;
      }
      const data = LineDS.selected.length ? LineDS.selected : LineDS.data;
      const arr = data.map((v) => {
        return {
          ...v.toData(),
          executeView: 'CUSTOMER',
          executeSourceType: 'DELIVERY',
          executeOrderType: 'PURCHASE_ACCEPTANCE',
          executeWorker: HeadDS.current.get('executeWorker'),
          sourceDocId: v.toData().deliveryOrderId,
          sourceDocNum: v.toData().deliveryOrderNum,
          sourceDocLineId: v.toData().deliveryOrderLineId,
          sourceDocLineNum: v.toData().deliveryOrderLineNum,
          executeTenantId: v.toData().customerTenantId,
          executeCompanyId: v.toData().customerCompanyId,
          executeDate: v.toData().executeDate
            ? `${v.toData().executeDate} 00:00:00`
            : `${moment(new Date()).format(DEFAULT_DATE_FORMAT)} 00:00:00`,
        };
      });
      if (apiName === 'createAndCloseDeliveryOrder') {
        Modal.confirm({
          children: <p>选中行在本次收货后，将无法再次执行收货动作，请确认！</p>,
          onOk: () => {
            handleOperate(apiName, arr);
          },
        });
      } else {
        handleOperate(apiName, arr);
      }
      resolve();
    });
  }

  const columns = [
    { name: 'deliveryOrderNum', width: 150, lock: 'left' },
    { name: 'deliveryOrderLineNum', width: 70, lock: 'left' },
    { name: 'customerItemCode', width: 150, lock: 'left' },
    { name: 'customerItemDesc', width: 150 },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return value && value.attributeValue1 ? (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('customerItemId')}
            itemDesc={record.get('customerItemDesc')}
            disabled
          />
        ) : null;
      },
    },
    { name: 'customerDeliveryQty', width: 100 },
    { name: 'customerAcceptableQty', width: 100 },
    { name: 'executeDate', width: 150, editor: true },
    { name: 'customerInventoryOrgName', width: 150 },
    { name: 'inventoryHouseObj', width: 150, editor: true },
    { name: 'inventorySeatObj', width: 150, editor: true },
    { name: 'customerUomName', width: 80 },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum', width: 80 },
    { name: 'supplierName', width: 150 },
    { name: 'executeRemark', width: 150, editor: true },
    { name: 'customerExecuteQty', width: 150, editor: true, lock: 'right', align: 'left' },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.purchaseAcceptDetail`).d('采购接收详情')}
        backPath="/zcom/purchase-accept"
      >
        <>
          <Button color="primary" onClick={() => handleReceive('executeLines')}>
            执行收货
          </Button>
          <Button onClick={() => handleReceive('createAndCloseDeliveryOrder')}>执行并关闭</Button>
        </>
      </Header>
      <Content className={styles['zcom-purchase-accept-detail-content']}>
        <Form dataSet={HeadDS} columns={3}>
          <TextField name="supplierName" key="supplierName" disabled />
          <TextField name="executeWorker" key="executeWorker" />
        </Form>
        <Table dataSet={LineDS} columns={columns} columnResizable="true" rowHeight="auto" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomPurchaseAcceptDetail);
