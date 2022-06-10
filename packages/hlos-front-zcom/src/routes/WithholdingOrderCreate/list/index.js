/*
 * @Descripttion: 发货列表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-26 15:15:26
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-26 17:03:45
 */

import { connect } from 'dva';
import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { DeliveryOrderListDS } from '../store/indexDS';
import styles from './index.less';
import LogModal from '@/components/LogModal/index';

// const { TabPane } = Tabs;
const intlPrefix = 'zcom.deliveryApply';
const deliveryOrderListDS = (roleType) => new DataSet(DeliveryOrderListDS(roleType));
const organizationId = getCurrentOrganizationId();
function ZcomDeliveryApply({ history, dispatch }) {
  const ListDS = useDataSet(() => deliveryOrderListDS());

  useEffect(() => {
    ListDS.setQueryParameter('customerTenantId', organizationId);
    ListDS.query();
  }, []);

  function handleToDetail(id) {
    history.push({
      pathname: `/zcom/withholding-order-create/detail/${id}`,
    });
  }

  function handleCreate() {
    history.push({
      pathname: `/zcom/withholding-order-create/create`,
    });
  }

  const listColumns = [
    {
      name: 'withholdingOrderNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('withholdingOrderId');
        return <a onClick={() => handleToDetail(id)}>{value}</a>;
      },
      lock: 'left',
    },
    { name: 'withholdingOrderTypeMeaning', width: 150 },
    { name: 'customerCompanyName', width: 150 },
    { name: 'supplierName', width: 150 },
    { name: 'totalAmount', width: 150 },
    { name: 'exTaxAmount', width: 150 },
    { name: 'currencyCode', width: 150 },
    {
      name: 'feedbackRequestedDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'overDueFlag',
      width: 150,
      renderer: yesOrNoRender,
    },
    {
      name: 'creationDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'withholdingOrderStatusMeaning', lock: 'right' },
    {
      header: '日志',
      width: 90,
      renderer: ({ record }) => {
        return (
          <LogModal id={record.get('withholdingOrderId')}>
            <a>日志</a>
          </LogModal>
        );
      },
      lock: 'right',
    },
  ];

  const handleSave = (apiName, status) => {
    return new Promise(async (resolve) => {
      let validateFlag = true;
      let cancleValidateFlag = true;
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve();
        return false;
      }

      const params = ListDS.selected.map((item) => {
        if (!['NEW', 'REJECTED'].includes(item.data.withholdingOrderStatus)) {
          validateFlag = false;
        }

        if (
          status === 'CANCELLED' &&
          !['TBCONFIRMED', 'REJECTED'].includes(item.data.withholdingOrderStatus)
        ) {
          cancleValidateFlag = false;
        }
        return {
          ...item.data,
          withholdingOrderStatus: status,
        };
      });

      if (!validateFlag && status !== 'CANCELLED') {
        notification.warning({
          message: '存在不是未提交状态的发货单，请重新选择！',
        });
        resolve();
        return;
      }

      if (!cancleValidateFlag) {
        notification.warning({
          message: '存在扣款单不是“确认中”或“申诉中”状态，请重新选择！',
        });
        resolve();
        return;
      }

      dispatch({
        type: `withholdingOrderModel/${apiName}`,
        payload: params,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
        }
        ListDS.query();
        resolve();
      });
    });
  };

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.deliveryApplyToSupplier`).d('发起的扣款单列表')}
      >
        <>
          <Button onClick={handleCreate}>发起扣款</Button>
          <Button
            color="primary"
            onClick={() => handleSave('submitWithholdingOrder', 'TBCONFIRMED')}
          >
            提交
          </Button>
          <Button onClick={() => handleSave('cancelWithholdingOrder', 'CANCELLED')}>取消</Button>
          <Button onClick={() => handleSave('deleteWithholdingOrder')}>删除</Button>
        </>
      </Header>
      <Content className={styles['zcom-withholding-order-create']}>
        {/* <Tabs defaultActiveKey='all'>
          <TabPane tab="全部" key="all"> */}
        <Table dataSet={ListDS} columns={listColumns} columnResizable="true" />
        {/* </TabPane>
        </Tabs> */}
      </Content>
    </Fragment>
  );
}

export default connect()(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomDeliveryApply)
);
