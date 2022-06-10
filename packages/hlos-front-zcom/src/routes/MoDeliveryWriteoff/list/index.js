/**
 * @Description: 送货单冲销
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-12-01 15:24:32
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getSerialNum } from '@/utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import { deliveryWriteoffListDS } from '../store/DeliveryWriteoffDS';

const intlPrefix = 'zcom.deliveryWriteoff';
let ListDS = new DataSet(deliveryWriteoffListDS());

function ZcomDeliveryWriteoff({ dispatch, history }) {
  useEffect(() => {
    ListDS.query();
    return () => {
      ListDS = new DataSet(deliveryWriteoffListDS());
    };
  }, []);

  function handleWriteoffPreview() {
    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }
    const arr = [];
    ListDS.selected.forEach((v) => {
      arr.push(v.data.deliveryExecuteId);
    });
    dispatch({
      type: 'deliveryWriteoff/updateState',
      payload: {
        ids: arr,
      },
    });
    const pathName = `/zcom/delivery-writeoff/detail`;
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
    { name: 'cancelableQty', width: 150 },
    { name: 'uomName', width: 150 },
    { name: 'expectedArrivalDate', width: 150 },
    { name: 'receiveOrgName', width: 150 },
    { name: 'executeWarehouseName', width: 150 },
    { name: 'receiveAddress', width: 150 },
    { name: 'supplierName', width: 150 },
    { name: 'submitDate', width: 150 },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.MoDeliveryWriteoff`).d('送货单冲销')}>
        <Button color="primary" onClick={handleWriteoffPreview}>
          冲销预览
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
  return <ZcomDeliveryWriteoff {...props} />;
});
