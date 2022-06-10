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
import { DataSet, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { DeliveryOrderListDS } from '../store/indexDS';
import styles from './index.less';
import LogModal from '@/components/LogModal/index';

// const { TabPane } = Tabs;
const intlPrefix = 'zcom.deliveryApply';
const deliveryOrderListDS = (roleType) => new DataSet(DeliveryOrderListDS(roleType));
const organizationId = getCurrentOrganizationId();
function ZcomDeliveryApply({ history }) {
  const ListDS = useDataSet(() => deliveryOrderListDS());

  useEffect(() => {
    ListDS.setQueryParameter('supplierTenantId', organizationId);
    ListDS.query();
  }, []);

  function handleToDetail(id) {
    history.push({
      pathname: `/zcom/withholding-order-review/detail/${id}`,
      state: {},
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
    { name: 'customerName', width: 150 },
    { name: 'supplierCompanyName', width: 150 },
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

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.deliveryApplyToSupplier`).d('收到的扣款单列表')}
      />
      <Content className={styles['zcom-withholding-order-review']}>
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
