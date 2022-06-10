/**
 * @Description: 送货单审核
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-30 14:28:21
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import { deliveryReviewListDS } from '../store/DeliveryReviewDS';
import { verifyDeliveryOrder } from '@/services/moDeliveryReviewService';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZCOM}/v1/${organizationId}/mo-delivery-orders/export-delivery-order`;
const intlPrefix = 'zcom.deliveryReview';
const ListDS = new DataSet(deliveryReviewListDS());

function ZcomDeliveryReview({ history }) {
  useEffect(() => {
    ListDS.setQueryParameter('deliveryOrderStatus', [
      'RELEASED',
      'CONFIRMED',
      'REFUSED',
      'DELIVERED',
      'RECEIVED',
    ]);
    ListDS.query();
  }, []);

  function handleToDetail(id) {
    const pathName = `/zcom/mo-delivery-review/detail/${id}`;
    history.push(pathName);
  }

  async function handleReview(type) {
    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }

    let validateFlag = true;
    const arr = [];
    ListDS.selected.forEach((v) => {
      const { deliveryOrderStatus } = v.data;
      const obj = {
        deliveryOrderId: v.data.deliveryOrderId,
        objectVersionNumber: v.data.objectVersionNumber,
        deliveryOrderStatus: type,
      };
      arr.push(obj);
      if (deliveryOrderStatus === 'CONFIRMED' || deliveryOrderStatus === 'REFUSED') {
        validateFlag = false;
      }
    });

    if (!validateFlag) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('存在已经审核的送货单！'),
      });
      return;
    }

    try {
      const res = await verifyDeliveryOrder(arr);
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        ListDS.query();
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

  const columns = [
    { name: 'deliveryOrderStatus', width: 150 },
    {
      name: 'deliveryOrderNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('deliveryOrderId');
        return <a onClick={() => handleToDetail(id)}>{value || ''}</a>;
      },
    },
    { name: 'deliveryOrderType', width: 150 },
    { name: 'supplierName', width: 150 },
    { name: 'buyer', width: 150 },
    { name: 'receiveAddress', width: 150 },
    // { name: 'deliveryQty', width: 150 },
    { name: 'creationDate', width: 150 },
    { name: 'planDeliveryDate', width: 150 },
    { name: 'expectedArrivalDate', width: 150 },
  ];

  function getExportQueryParams() {
    const list = ListDS && ListDS.selected;
    const deliveryOrderNums = list.map((item) => {
      return item.data.deliveryOrderNum;
    });
    return {
      deliveryOrderNums,
    };
  }

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.MoDeliveryReview`).d('送货单审核')}>
        <Button onClick={() => handleReview('CONFIRMED')}>审核通过</Button>
        <Button onClick={() => handleReview('REFUSED')}>审核拒绝</Button>
        <ExcelExport
          buttonText="导出"
          requestUrl={url}
          queryParams={getExportQueryParams}
          method="GET"
        />
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
  return <ZcomDeliveryReview {...props} />;
});
