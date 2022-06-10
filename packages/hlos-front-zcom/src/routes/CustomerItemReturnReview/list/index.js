/**
 * @Description: 客供料退料审核
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-02-03 13:30:22
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import formatterCollections from 'utils/intl/formatterCollections';
import { returnReviewListDS } from '../store/CustomerItemReturnReviewDS';
import { verifyItemRefund } from '@/services/customerItemReturnReviewService';
import styles from './index.less';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZCOM}/v1/${organizationId}/item-refunds/export-for-verify`;
const intlPrefix = 'zcom.customerItemReturnReview';
const ListDS = new DataSet(returnReviewListDS());

function ZcomCustomerItemReturnReview({ history }) {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleToDetail(id) {
    const pathName = `/zcom/customer-item-return-review/${id}`;
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
      const obj = {
        itemRefundStatus: type,
        itemRefundId: v.data.itemRefundId,
        objectVersionNumber: v.data.objectVersionNumber,
      };
      arr.push(obj);
      if (v.data.itemRefundStatus !== 'RELEASED') {
        validateFlag = false;
      }
    });
    if (!validateFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.select`)
          .d('存在不是已提交状态的退料单！'),
      });
      return;
    }
    try {
      const res = await verifyItemRefund(arr);
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
    {
      name: 'itemRefundNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('itemRefundId');
        return <a onClick={() => handleToDetail(id)}>{value || ''}</a>;
      },
    },
    { name: 'itemRefundStatusMeaning', width: 150 },
    { name: 'supplierName', width: 150 },
    { name: 'refundWmOuName', width: 150 },
    { name: 'refundWarehouseName', width: 150 },
    { name: 'remark', width: 150 },
    { name: 'customerName', width: 150 },
    { name: 'customerWarehouseName', width: 150 },
    { name: 'itemRefundDate', width: 150 },
    { name: 'creationDate', width: 150 },
    { name: 'approvalOpinion', width: 150 },
  ];

  function getExportQueryParams() {
    const list = ListDS && ListDS.selected;
    const itemRefundNums = list.map((item) => {
      return item.data.itemRefundNum;
    });
    return {
      itemRefundNums,
    };
  }

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.customerItemReturnReview`).d('客供料退料审核')}
      >
        <Button onClick={() => handleReview('CONFIRMEND')}>审核通过</Button>
        <Button onClick={() => handleReview('REFUSED')}>审核拒绝</Button>
        <ExcelExport
          buttonText="导出"
          requestUrl={url}
          queryParams={getExportQueryParams}
          method="GET"
        />
      </Header>
      <Content>
        <div className={styles['zcom-customer-item-return-review-content']}>
          <Table dataSet={ListDS} columns={columns} columnResizable="true" />
        </div>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomCustomerItemReturnReview {...props} />;
});
