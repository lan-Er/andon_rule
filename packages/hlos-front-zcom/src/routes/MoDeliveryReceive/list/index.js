/**
 * @Description: 送货单接收
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-30 16:28:50
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getSerialNum } from '@/utils/renderer';
import { deliveryReceiveListDS } from '../store/DeliveryReceiveDS';

const intlPrefix = 'zcom.deliveryReceive';
let ListDS = new DataSet(deliveryReceiveListDS());

function ZcomDeliveryReceive({ dispatch, history }) {
  useEffect(() => {
    ListDS.query();
    return () => {
      ListDS = new DataSet(deliveryReceiveListDS());
    };
  }, []);

  function handleReceivePreview() {
    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }
    const arr = [];
    ListDS.selected.forEach((v) => {
      arr.push(v.data.deliveryOrderLineId);
    });
    dispatch({
      type: 'deliveryReceive/updateState',
      payload: {
        ids: arr,
      },
    });
    const pathName = `/zcom/delivery-receive/detail`;
    history.push(pathName);
  }

  const columns = [
    {
      header: '序号',
      width: 60,
      lock: true,
      renderer: ({ record }) => getSerialNum(record),
    },
    { name: 'deliveryOrderStatus', width: 150 },
    { name: 'deliveryOrderNum', width: 150 },
    { name: 'deliveryOrderType', width: 150 },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDescription', width: 150 },
    { name: 'deliveryQty', width: 150 },
    { name: 'acceptableQty', width: 150 },
    { name: 'uomName', width: 150 },
    { name: 'expectedArrivalDate', width: 150 },
    { name: 'receiveOrgName', width: 150 },
    { name: 'receiveAddress', width: 150 },
    { name: 'supplierName', width: 150 },
    { name: 'submitDate', width: 150 },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.MoDeliveryReceive`).d('送货单接收')}>
        <Button color="primary" onClick={handleReceivePreview}>
          接收预览
        </Button>
      </Header>
      <Content>
        <Table autoHeight dataSet={ListDS} columns={columns} columnResizable="true" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomDeliveryReceive {...props} />;
});
