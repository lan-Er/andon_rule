/**
 * @Description: 发货预约列表
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-04-25 12:38:30
 */

import { connect } from 'dva';
import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Tabs,
  Table,
  Form,
  TextField,
  Select,
  DatePicker,
  Lov,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getAccessToken, getRequestId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { queryReportData } from 'hlos-front/lib/services/api';
import { HZERO_RPT, API_HOST } from 'utils/config';
import { findStrIndex } from '@/utils/renderer';
import { DeliveryApplyListDS } from '../store/indexDS';
import LogModal from '@/components/LogModal/index';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.deliveryApply';
const organizationId = getCurrentOrganizationId();
const deliveryApplyListDS = (roleType) => new DataSet(DeliveryApplyListDS(roleType));

function ZcomDeliveryApply({ currentTab, dispatch, history, location }) {
  const roleType = getRoleType(); // 当前角色类型 客户customer/供应商supplier
  const ListDS = useDataSet(() => deliveryApplyListDS(roleType));

  const [curTab, setCurTab] = useState(currentTab);
  const [moreQuery, setMoreQuery] = useState(false);

  // 通过截取路由地址的内容获取当前角色类型
  function getRoleType() {
    const { pathname } = location;
    const pIndex = findStrIndex(pathname, '/', 2);
    const nIndex = findStrIndex(pathname, '/', 3);
    return pathname.substring(pIndex + 1, nIndex);
  }

  useEffect(() => {
    ListDS.queryDataSet.create();
    if (curTab === 'self') {
      ListDS.setQueryParameter('initiator', roleType === 'customer' ? 'CUSTOMER' : 'SUPPLIER');
    }
    if (curTab === 'review') {
      ListDS.setQueryParameter('initiator', roleType === 'customer' ? 'SUPPLIER' : 'CUSTOMER');
    }
    if (roleType === 'customer') {
      ListDS.setQueryParameter('customerTenantId', organizationId);
    }
    if (roleType === 'supplier') {
      ListDS.setQueryParameter('supplierTenantId', organizationId);
    }
    if (currentTab === 'review') {
      ListDS.queryDataSet.current.set(
        'deliveryApplyStatusList',
        roleType === 'customer'
          ? ['CUSTOMER_CONFIRMING', 'CUSTOMER_DECLINED']
          : ['SUPPLIER_CONFIRMING', 'SUPPLIER_DECLINED']
      );
    } else {
      ListDS.queryDataSet.current.set('deliveryApplyStatusList', []);
    }
    ListDS.query();
  }, [currentTab]);

  async function handleCancel() {
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
        const { deliveryApplyStatus } = v.toData();
        if (
          ![
            'NEW',
            'SUPPLIER_CONFIRMING',
            'CUSTOMER_CONFIRMING',
            'SUPPLIER_DECLINED',
            'CUSTOMER_DECLINED',
          ].includes(deliveryApplyStatus)
        ) {
          statusFlag = false;
        }
        return {
          ...v.toData(),
          deliveryApplyStatus: 'CANCELLED',
        };
      });
      if (!statusFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.errStatus`)
            .d(
              '选中的发货预约单有无法取消的发货预约单（已预约/已取消/发货中/发货完成），请检查后选择'
            ),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'deliveryApply/cancelDeliveryApply',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          ListDS.query();
        }
        resolve();
      });
    });
  }

  async function handleSubmit() {
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
        const { deliveryApplyStatus } = v.toData();
        if (!['NEW', 'SUPPLIER_DECLINED', 'CUSTOMER_DECLINED'].includes(deliveryApplyStatus)) {
          statusFlag = false;
        }
        return {
          ...v.toData(),
          deliveryApplyStatus:
            roleType === 'customer' ? 'SUPPLIER_CONFIRMING' : 'CUSTOMER_CONFIRMING',
        };
      });
      if (!statusFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.errStatus`)
            .d(
              '选中的发货预约单有无法提交的发货预约单（待供应商确认/待客户确认/已预约/已取消/发货中/发货完成），请检查后选择'
            ),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'deliveryApply/releaseDeliveryApply',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          ListDS.query();
        }
        resolve();
      });
    });
  }

  async function handleVerify(action) {
    return new Promise(async (resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      let validateFlag = true;
      let applyStatus;
      if (action === 'confirmed') {
        applyStatus = 'APPOINTMENT_CONFIRMED';
      } else {
        applyStatus = roleType === 'customer' ? 'CUSTOMER_DECLINED' : 'SUPPLIER_DECLINED';
      }
      const arr = ListDS.selected.map((v) => {
        const { deliveryApplyStatus } = v.toData();
        if (!['CUSTOMER_CONFIRMING', 'SUPPLIER_CONFIRMING'].includes(deliveryApplyStatus)) {
          validateFlag = false;
        }
        return {
          ...v.toData(),
          deliveryApplyStatus: applyStatus,
        };
      });
      if (!validateFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.errStatus`)
            .d(
              `选中的发货预约单有无法${
                action === 'confirmed' ? '通过' : '驳回'
              }的发货预约单（待预约/供应商已拒绝/客户已拒绝/已预约/已取消/发货中/发货完成），请检查后选择`
            ),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'deliveryApply/verifyDeliveryApply',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          ListDS.query();
        }
        resolve();
      });
    });
  }

  async function handleCreateDelivery() {
    return new Promise(async (resolve) => {
      if (ListDS.selected.length !== 1) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('请选择一条数据'),
        });
        resolve(false);
        return false;
      }
      const {
        deliveryApplyStatus,
        deliveryApplyId,
        deliveryApplyType,
      } = ListDS.selected[0].toData();
      if (roleType === 'supplier' && deliveryApplyType !== 'INBOUND_APPOINTMENT') {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.select`)
            .d('选中的预约单类型不是（入库预约），无法由供应商创建发货单，请重新选择'),
        });
        resolve(false);
        return false;
      }
      if (roleType === 'customer' && deliveryApplyType !== 'CUSTOMER_SUPPLY_APPOINTMENT') {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.select`)
            .d('选中的预约单类型不是（采购方供料预约），无法由采购方创建发货单，请重新选择'),
        });
        resolve(false);
        return false;
      }
      if (!['APPOINTMENT_CONFIRMED', 'DELIVERING'].includes(deliveryApplyStatus)) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.select`)
            .d('不是已预约/发货中的发货预约单不能创建发货！'),
        });
        resolve(false);
        return false;
      }
      dispatch({
        type: 'deliveryApply/createByDeliveryApply',
        payload: { deliveryApplyId },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          ListDS.query();
          history.push({
            pathname:
              roleType === 'supplier'
                ? `/zcom/delivery-order/create/${res.deliveryOrderId}`
                : `/zcom/supply-item-ship/detail/${res.deliveryOrderId}`,
          });
        }
        resolve();
      });
    });
  }

  function handleTabChange(key) {
    setCurTab(key);
    if (key === 'review') {
      ListDS.queryDataSet.current.set(
        'deliveryApplyStatusList',
        roleType === 'customer'
          ? ['CUSTOMER_CONFIRMING', 'CUSTOMER_DECLINED']
          : ['SUPPLIER_CONFIRMING', 'SUPPLIER_DECLINED']
      );
    } else {
      ListDS.queryDataSet.current.set('deliveryApplyStatusList', []);
    }
    dispatch({
      type: 'deliveryApply/updateState',
      payload: {
        currentTab: key,
      },
    });
  }

  function handleReset() {
    ListDS.queryDataSet.current.reset();
    ListDS.queryDataSet.current.set('receiverObj', {});
  }

  function handleSearch() {
    ListDS.query();
  }

  function handleToDetail(record) {
    const { deliveryApplyId, deliveryApplyType } = record.toData();
    let path;
    if (deliveryApplyType === 'INBOUND_APPOINTMENT') {
      path = `/zcom/delivery-apply/${roleType}/detail/${deliveryApplyId}`;
    }
    if (deliveryApplyType === 'CUSTOMER_SUPPLY_APPOINTMENT') {
      path = `/zcom/delivery-apply/${roleType}/out/detail/${deliveryApplyId}`;
    }
    history.push({
      pathname: path,
      state: {
        isReview: curTab === 'review',
      },
    });
  }

  async function handlePrint() {
    if (ListDS.selected.length !== 1) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    return new Promise((resolve) => {
      dispatch({
        type: 'deliveryApply/getPrintrules',
        payload: { printRuleType: 'DELIVERY_APPLY' },
      }).then(async (resData) => {
        if (resData && !resData.failed && resData.content?.length) {
          const { templateCode } = resData.content[0];
          const requestIdString = ListDS.selected[0].data.deliveryApplyNum;
          const res = await queryReportData(templateCode);
          if (res && res.content && res.content.length > 0) {
            const { reportUuid } = res.content[0];
            const url = `${HZERO_RPT}/v1/${getCurrentOrganizationId()}/reports/export/${reportUuid}/PRINT`;
            const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&deliveryApplyNum=${requestIdString}`;
            window.open(requestUrl);
          }
        }
        resolve();
      });
    });
  }

  const listColumns = [
    {
      name: 'deliveryApplyNum',
      width: 150,
      renderer: ({ record, value }) => {
        return <a onClick={() => handleToDetail(record)}>{value}</a>;
      },
      lock: 'left',
    },
    { name: 'deliveryApplyType', width: 120 },
    { name: 'customerName', width: 150 },
    { name: 'supplierName', width: 150 },
    {
      name: 'recvName',
      width: 150,
      renderer: ({ record }) => {
        const { receivingType, recvSupplierName, recvCompanyName } = record.toData();
        return (
          <span>
            {receivingType &&
              (receivingType === 'THIRD_SUPPLIER' ? recvSupplierName : recvCompanyName)}
          </span>
        );
      },
    },
    {
      name: 'deliveryApplyDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'arrivalDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'deliveryApplyStatus', width: 100, lock: 'right' },
    {
      header: '日志',
      width: 90,
      renderer: ({ record }) => {
        return (
          <LogModal id={record.get('deliveryApplyId')}>
            <a>日志</a>
          </LogModal>
        );
      },
      lock: 'right',
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.deliveryApplyList`).d('预约单列表')}>
        {curTab === 'self' && (
          <Button color="primary" onClick={handleSubmit}>
            提交
          </Button>
        )}
        {curTab === 'review' && (
          <Button color="primary" onClick={() => handleVerify('confirmed')}>
            通过
          </Button>
        )}
        <Button onClick={handleCreateDelivery}>创建发货</Button>
        {curTab === 'self' && <Button onClick={handleCancel}>取消</Button>}
        {curTab === 'review' && <Button onClick={() => handleVerify('declined')}>驳回</Button>}
        <Button onClick={handlePrint}>打印</Button>
      </Header>
      <Content className={styles['delivery-apply-list-content']}>
        <div className={styles['zcom-delivey-apply-list-query']}>
          <Form dataSet={ListDS.queryDataSet} columns={3}>
            <TextField name="deliveryApplyNum" />
            <TextField name="sourceDocNum" />
            {roleType === 'customer' && <Lov name="supplierObj" clearButton noCache />}
            {roleType === 'supplier' && <Lov name="customerObj" clearButton noCache />}
            {moreQuery && <Select name="deliveryApplyStatusList" />}
            {moreQuery && <Lov name="receiverObj" clearButton noCache />}
            {moreQuery && <DatePicker mode="date" name="deliveryApplyDateStart" />}
            {moreQuery && <DatePicker mode="date" name="arrivalDateStart" />}
            {moreQuery && <Select name="deliveryApplyType" />}
          </Form>
          <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
            <Button
              onClick={() => {
                setMoreQuery(!moreQuery);
              }}
            >
              {moreQuery
                ? intl.get('hzero.common.button.collected').d('收起查询')
                : intl.get('hzero.common.button.viewMore').d('更多查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Tabs defaultActiveKey={curTab} onChange={handleTabChange}>
          <TabPane tab="我发起的" key="self" />
          <TabPane tab="待我确认" key="review" />
        </Tabs>
        <Table dataSet={ListDS} columns={listColumns} queryBar="none" columnResizable="true" />
      </Content>
    </Fragment>
  );
}

export default connect(({ deliveryApply: { currentTab } }) => ({ currentTab }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomDeliveryApply)
);
