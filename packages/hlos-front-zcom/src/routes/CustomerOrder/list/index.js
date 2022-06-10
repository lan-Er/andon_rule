/**
 * @Description: 客户订单列表
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-19 11:39:50
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table, Modal, SelectBox, TextArea } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getAccessToken, getRequestId } from 'utils/utils';
import { queryReportData } from 'hlos-front/lib/services/api';
import { HZERO_RPT, API_HOST } from 'utils/config';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import LogModal from '@/components/LogModal/index';
import { CustomerOrderListDS } from '../store/indexDS';
import styles from './index.less';

const { Option } = SelectBox;
const refuseKey = Modal.key();
const intlPrefix = 'zcom.customerOrder';
const customerOrderListDS = () => new DataSet(CustomerOrderListDS());

let refuseReason = ''; // 拒绝原因
let refuseRemark = ''; // 拒绝补充说明

function ZcomCustomerOrder({ dispatch, history }) {
  const ListDS = useDataSet(customerOrderListDS, ZcomCustomerOrder);

  useEffect(() => {
    ListDS.query();
  }, []);

  function handleToDetail(record) {
    const { poId, poNum, poStatus } = record.toData();
    history.push({
      pathname: `/zcom/customer-order/detail/${poId}`,
      state: {
        poNum,
        poStatus,
      },
    });
  }

  function handleConfirm() {
    return new Promise((resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      let statusFlag = true;
      const arr = ListDS.selected.map((v) => {
        if (!['CONFIRMING'].includes(v.data.poStatus)) {
          statusFlag = false;
        }
        return {
          ...v.data,
          poStatus: 'CONFIRMED',
        };
      });
      if (!statusFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.statusValidate`)
            .d('存在不是待供应商确认的采购订单'),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'customerOrder/poVerify',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '确认成功',
          });
          ListDS.query();
        }
        resolve();
      });
    });
  }

  function handleRefuseOk(arr) {
    return new Promise(async (resolve) => {
      if (!refuseReason) {
        notification.warning({
          message: '请选择您拒绝的原因',
        });
        resolve(false);
        return;
      }
      const data = arr.map((v) => ({
        ...v,
        operationOpinion: `${refuseReason}${refuseRemark ? `:${refuseRemark}` : ''}`,
      }));
      dispatch({
        type: 'customerOrder/poVerify',
        payload: data,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '拒绝成功',
          });
          ListDS.query();
        }
        resolve();
      });
    });
  }

  function handleReasonChange(e) {
    let str;
    switch (e) {
      case 'notFinish':
        str = '无法按承诺交付';
        break;
      case 'lower':
        str = '价格过低';
        break;
      case 'other':
        str = '其他';
        break;
      default:
        str = '';
        break;
    }
    refuseReason = str;
  }

  function handleRemarkChange(e) {
    refuseRemark = e;
  }

  function handleRefuse() {
    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }
    let statusFlag = true;
    const arr = ListDS.selected.map((v) => {
      if (!['CONFIRMING'].includes(v.data.poStatus)) {
        statusFlag = false;
      }
      return {
        ...v.data,
        poStatus: 'REFUSED',
      };
    });
    if (!statusFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.statusValidate`)
          .d('存在不是待供应商确认的采购订单'),
      });
      return;
    }
    refuseReason = '';
    refuseRemark = '';
    Modal.open({
      key: refuseKey,
      title: '拒绝客户订单',
      children: (
        <div>
          <div className={styles['refuse-title']}>请选择您拒绝的原因（必选）</div>
          <SelectBox onChange={handleReasonChange}>
            <Option value="notFinish">无法按承诺交付</Option>
            <Option value="lower">价格过低</Option>
            <Option value="other">其他</Option>
          </SelectBox>
          <TextArea placeholder="补充说明" cols={60} onChange={handleRemarkChange} />
        </div>
      ),
      className: styles['zcom-customer-order-refuse'],
      onOk: () => handleRefuseOk(arr),
    });
  }

  const columns = [
    {
      name: 'poNum',
      width: 150,
      lock: true,
      renderer: ({ record, value }) => (
        <>
          <a onClick={() => handleToDetail(record)}>{value}</a>
        </>
      ),
    },
    { name: 'customerName', width: 150 },
    {
      name: 'totalAmount',
      width: 150,
      renderer: ({ record }) => {
        const { currencyCode, totalAmount } = record.toData();
        return (
          <span>
            {`${currencyCode ? `${currencyCode} ` : ''}${
              totalAmount && totalAmount !== '0' ? totalAmount : '0.00'
            }`}
          </span>
        );
      },
    },
    { name: 'customerContacts', width: 150 },
    { name: 'customerContactsPhone', width: 150 },
    { name: 'supplierContacts', width: 150 },
    { name: 'supplierContactsPhone', width: 150 },
    // { name: 'saler', width: 150 },
    { name: 'deliveryInventoryOrgName', width: 150 },
    { name: 'poTypeMeaning', width: 150 },
    { name: 'consignerName', width: 150 },
    { name: 'consignerPhone', width: 150 },
    { name: 'deliveryAddress', width: 150 },
    // { name: 'invoiceAddressFrom', width: 150 },
    {
      name: 'creationDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'poStatusMeaning', width: 120, lock: 'right' },
    {
      header: '日志',
      width: 80,
      lock: 'right',
      renderer: ({ record }) => {
        return (
          <LogModal id={record.get('poId')}>
            <a>日志</a>
          </LogModal>
        );
      },
    },
  ];

  async function handlePrint() {
    if (ListDS.selected.length !== 1) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    return new Promise((resolve) => {
      dispatch({
        type: 'customerOrder/getPrintrules',
        payload: { printRuleType: 'PO' },
      }).then(async (resData) => {
        if (resData && !resData.failed && resData.content?.length) {
          const { templateCode } = resData.content[0];
          const requestIdString = ListDS.selected[0].data.poNum;
          const res = await queryReportData(templateCode);
          if (res && res.content && res.content.length > 0) {
            const { reportUuid } = res.content[0];
            const url = `${HZERO_RPT}/v1/${getCurrentOrganizationId()}/reports/export/${reportUuid}/PRINT`;
            const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&poNum=${requestIdString}`;
            window.open(requestUrl);
          }
        }
        resolve();
      });
    });
  }

  function getListProps() {
    const props = {
      columns,
      dataSet: ListDS,
      queryFieldsLimit: 3,
      columnResizable: 'true',
    };
    return props;
  }

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.customerOrderList`).d('客户订单列表')}>
        <Button onClick={handleConfirm} color="primary">
          确认
        </Button>
        <Button onClick={handleRefuse}>拒绝</Button>
        <Button onClick={handlePrint}>打印</Button>
      </Header>
      <Content className={styles['zcom-customer-order-content']}>
        <Table {...getListProps()} />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomCustomerOrder);
