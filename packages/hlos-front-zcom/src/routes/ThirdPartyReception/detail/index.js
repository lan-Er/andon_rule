/**
 * @Description: 发货申请详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-25 15:38:07
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Form, TextField, Table, Modal } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import notification from 'utils/notification';
import { DeliveryOrderHeadDS, DeliveryOrderLineDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zcom.deliveryApply';
const deliveryOrderHeadDS = () => new DataSet(DeliveryOrderHeadDS());
const deliveryOrderLineDS = () => new DataSet(DeliveryOrderLineDS());

function ZcomDeliveryApplyDetail({ location, dispatch, history }) {
  const HeadDS = useDataSet(deliveryOrderHeadDS, ZcomDeliveryApplyDetail);
  const LineDS = useDataSet(deliveryOrderLineDS);
  const { state } = location;

  useEffect(() => {
    LineDS.setQueryParameter('idList', state.idList);
    HeadDS.setQueryParameter('idList', state.idList);
    HeadDS.data = [];
    HeadDS.create();
    LineDS.data = [];
    LineDS.clearCachedSelected();
    handleSearch();
  }, []);

  async function handleSearch() {
    await HeadDS.query();
    LineDS.query();
  }

  const columns = [
    { name: 'deliveryOrderNum', width: 150, lock: 'left' },
    {
      name: 'deliveryOrderLineNum',
      width: 90,
      lock: 'left',
    },
    {
      name: 'recvItemCode',
      width: 150,
      lock: 'left',
    },
    {
      name: 'recvItemDesc',
      width: 150,
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          value &&
          value.attributeValue1 && (
            <ItemAttributeSelect
              data={value}
              itemId={record.get('supplierItemId')}
              itemDesc={record.get('supplierItemDesc')}
              disabled
            />
          )
        );
      },
    },
    {
      name: 'supplierDeliveryQty',
      renderer: ({ record }) => {
        const { receivingType = '', customerDeliveryQty = '', recvDeliveryQty = '' } = record.data;
        if (receivingType === 'SUB_COMPANY') {
          return customerDeliveryQty;
        }

        if (receivingType === 'THIRD_SUPPLIER') {
          return recvDeliveryQty;
        }

        return '';
      },
    },
    {
      name: 'recvAcceptableQty',
    },
    { name: 'recvExecuteQty', width: 150, align: 'left', editor: true },
    { name: 'executeDate', width: 150, editor: true },
    {
      name: 'recvInventoryOrgName',
      width: 150,
      renderer: ({ record }) => {
        const {
          receivingType = '',
          recvSupplierOrgName = '',
          recvInventoryOrgName = '',
        } = record.data;
        if (receivingType === 'SUB_COMPANY') {
          return recvInventoryOrgName;
        }

        if (receivingType === 'THIRD_SUPPLIER') {
          return recvSupplierOrgName;
        }

        return '';
      },
    },
    {
      name: 'inventoryHouseObj',
      width: 150,
      editor: true,
    },
    { name: 'inventorySeatObj', width: 120, editor: true },
    { name: 'recvUomName' },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum' },
    { name: 'customerName', width: 150 },
    { name: 'supplierName', width: 150 },
    { name: 'executeRemark', width: 120, editor: true },
  ];

  const handleReceipt = async (apiName, validateFlag) => {
    let lineValidateValue = true;
    const validateValue = await HeadDS.current.validate(true, false);
    const validateResult = await Promise.all(lineValidate());
    validateResult.forEach((v) => {
      lineValidateValue = lineValidateValue && v;
    });

    if (!validateValue || !lineValidateValue) {
      notification.warning({
        message: '存在必输字段未填写或字段输入不合法！',
      });
      return;
    }

    if (validateFlag) {
      Modal.confirm({
        children: <p>选中行在本次收货后，将无法再次执行收货动作，请确认！</p>,
        onOk: () => {
          handleReceipt(apiName, false);
        },
      });
      return;
    }

    return new Promise(async (resolve) => {
      const executeLineList = LineDS.map((item) => {
        const {
          deliveryView,
          deliveryOrderNum,
          deliveryOrderId,
          deliveryOrderLineId,
          deliveryOrderLineNum,
          recvCompanyId,
          recvTenantId,
          recvSupplierTenantId,
          recvSupplierCompanyId,
          executeDate,
          receivingType,
        } = item.data;

        return {
          ...item.toData(),
          executeOrderType: 'THIRD_PARTY_ACCEPTANCE',
          executeView: deliveryView,
          // sourceOrderType: '',
          executeSourceType: 'DELIVERY',
          executeDate: `${moment(executeDate).format(DEFAULT_DATETIME_FORMAT)}`,
          sourceDocId: deliveryOrderId,
          sourceDocNum: deliveryOrderNum,
          sourceDocLineId: deliveryOrderLineId,
          sourceDocLineNum: deliveryOrderLineNum,
          executeWorker: HeadDS.current.get('executeWorker'),
          executeTenantId: receivingType === 'SUB_COMPANY' ? recvTenantId : recvSupplierTenantId,
          executeCompanyId: receivingType === 'SUB_COMPANY' ? recvCompanyId : recvSupplierCompanyId,
        };
      });
      dispatch({
        type: `thirdPartyReceptionModel/${apiName}`,
        payload: executeLineList,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          history.push({
            pathname: `/zcom/third-party-reception`,
          });
        }
        resolve();
      });
    });
  };

  const lineValidate = () => {
    const arr = [];
    LineDS.forEach((v) => {
      arr.push(v.validate(true, false));
    });
    return arr;
  };

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.deliveryApplyDetail`).d('第三方供料收货详情')}
        backPath="/zcom/third-party-reception"
      >
        <Button color="primary" onClick={() => handleReceipt('executeLines')}>
          执行收货
        </Button>
        <Button onClick={() => handleReceipt('createAndCloseDeliveryOrder', true)}>
          执行并关闭
        </Button>
      </Header>
      <Content className={styles['zcom-delivery-apply-detail-content']}>
        <Form dataSet={HeadDS} columns={3}>
          <TextField name="customerName" key="customerName" disabled />
          <TextField name="supplierName" key="supplierName" disabled />
          <TextField name="executeWorker" key="executeWorker" />
        </Form>

        <Table dataSet={LineDS} columns={columns} columnResizable="true" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomDeliveryApplyDetail);
