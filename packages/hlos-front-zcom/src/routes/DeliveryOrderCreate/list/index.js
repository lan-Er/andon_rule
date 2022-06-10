/*
 * @Descripttion: 发货列表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-26 15:15:26
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-26 17:03:45
 */

import { connect } from 'dva';
import React, { useEffect, Fragment, useState } from 'react';
import { DataSet, Button, Table, Tabs, Modal } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { getCurrentOrganizationId, getAccessToken, getRequestId } from 'utils/utils';
import { queryReportData } from 'hlos-front/lib/services/api';
import { HZERO_RPT, API_HOST } from 'utils/config';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { Button as ButtonPermission } from 'components/Permission';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import { submitDeliveryApply } from '@/services/deliveryOrderService';

import { DeliveryOrderListDS, DeliveryOrderLineListDS } from '../store/indexDS';
import LogModal from '@/components/LogModal/index';

import styles from './index.less';

const intlPrefix = 'zcom.deliveryApply';
const deliveryOrderListDS = (roleType) => new DataSet(DeliveryOrderListDS(roleType));
const deliveryOrderLineListDS = () => new DataSet(DeliveryOrderLineListDS());

const organizationId = getCurrentOrganizationId();
const { TabPane } = Tabs;

function ZcomDeliveryApply({ history, dispatch }) {
  const ListDS = useDataSet(() => deliveryOrderListDS());
  const LineListDS = useDataSet(() => deliveryOrderLineListDS());
  const [deliveryShow, setDeliveryShow] = useState(true);

  useEffect(() => {
    ListDS.setQueryParameter('supplierTenantId', organizationId);
    LineListDS.setQueryParameter('supplierTenantId', organizationId);
    ListDS.query();
  }, []);

  function handleToDetail(id) {
    history.push({
      pathname: `/zcom/delivery-order/detail/${id}`,
      state: {},
    });
  }

  const listColumns = [
    {
      name: 'deliveryOrderNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('deliveryOrderId');
        return <a onClick={() => handleToDetail(id)}>{value}</a>;
      },
      lock: 'left',
    },
    { name: 'customerName', width: 150 },
    { name: 'supplierName', width: 150 },
    {
      name: 'recvName',
      width: 150,
      renderer: ({ record }) => {
        const { receivingType = '', recvSupplierName = '', recvCompanyName = '' } = record.data;
        if (receivingType === 'SUB_COMPANY') {
          return recvCompanyName;
        }

        if (receivingType === 'THIRD_SUPPLIER') {
          return recvSupplierName;
        }

        return '';
      },
    },
    {
      name: 'deliveryOrderDate',
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
    { name: 'customerInventoryOrgName', width: 150 },
    {
      name: 'recvInventoryOrgName',
      width: 150,
      renderer: ({ record, value }) => {
        const { receivingType = '', recvSupplierOrgName = '' } = record.data;
        if (receivingType === 'SUB_COMPANY') {
          return value;
        }

        if (receivingType === 'THIRD_SUPPLIER') {
          return recvSupplierOrgName;
        }

        return '';
      },
    },
    { name: 'receivingAddress', width: 150 },
    { name: 'consigneeName', width: 150 },
    { name: 'consigneePhone', width: 150 },
    // { name: 'relatedDeliveryApplyNum', width: 150 },
    { name: 'externalStockOutStatusMeaning', lock: 'right' },
    { name: 'deliveryOrderStatusMeaning', lock: 'right' },
    {
      header: '日志',
      // width: 90,
      renderer: ({ record }) => {
        return (
          <LogModal id={record.get('deliveryOrderId')}>
            <a>日志</a>
          </LogModal>
        );
      },
      lock: 'right',
    },
  ];

  const lineColumns = [
    {
      name: 'deliveryOrderNum',
      width: 150,
      lock: 'left',
    },
    { name: 'deliveryOrderLineNum' },
    {
      name: 'customerItemDesc',
      width: 150,
      renderer: ({ record }) => (
        <>
          <div>{record.get('customerItemCode')}</div>
          <div>{record.get('customerItemDesc')}</div>
        </>
      ),
    },
    {
      name: 'supplierItemDesc',
      width: 150,
      renderer: ({ record }) => (
        <>
          <div>{record.get('supplierItemCode')}</div>
          <div>{record.get('supplierItemDesc')}</div>
        </>
      ),
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ value }) => {
        return value && <ItemAttributeSelect data={value} disabled />;
      },
    },
    { name: 'supplierUomName', width: 90 },
    { name: 'supplierDeliveryQty' },
    { name: 'supplierReceivedQty' },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum' },
    { name: 'customerName', width: 150 },
    { name: 'supplierCompanyName', width: 150 },
    {
      name: 'recvName',
      width: 150,
      renderer: ({ record }) => {
        const { receivingType = '', recvSupplierName = '', recvCompanyName = '' } = record.data;
        if (receivingType === 'SUB_COMPANY') {
          return recvCompanyName;
        }

        if (receivingType === 'THIRD_SUPPLIER') {
          return recvSupplierName;
        }

        return '';
      },
    },
    { name: 'deliveryOrderDate', width: 150 },
    { name: 'arrivalDate', width: 150 },
    { name: 'relatedDeliveryApplyNum', width: 150 },
    { name: 'supplierInventoryOrgName', width: 150 },
    { name: 'deliveryAddress', width: 150 },
    { name: 'receivingAddress', width: 150 },
    { name: 'consigneeName', width: 150 },
    { name: 'consigneePhone', width: 150 },
    { name: 'deliveryOrderLineStatusMeaning', lock: 'right' },
  ];

  const handleSave = (apiName, status) => {
    return new Promise(async (resolve) => {
      let validateFlag = true;
      let cancelValidateFlag = true;

      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve();
        return false;
      }

      const params = ListDS.selected.map((item) => {
        if (item.data.deliveryOrderStatus !== 'NEW') {
          validateFlag = false;
        }

        if (item.data.deliveryOrderStatus !== 'DELIVERED') {
          cancelValidateFlag = false;
        }
        return {
          ...item.data,
          deliveryOrderStatus: status,
        };
      });

      if (!validateFlag && apiName === 'deleteDeliveryApply') {
        notification.warning({
          message: '选中的发货单有无法删除的发货单（已发货/已取消/已关闭），请检查后选择!',
        });
        resolve();
        return;
      }

      if (!validateFlag && apiName === 'submitDeliveryApply') {
        notification.warning({
          message: '选中的发货单有无法提交发货的发货单（已发货/已取消/已关闭），请检查后选择!',
        });
        resolve();
        return;
      }

      if (!cancelValidateFlag && apiName === 'cancelDeliveryApply') {
        notification.warning({
          message: '选中的发货单有无法取消发货的发货单（新建/已关闭/已取消），请检查后选择!',
        });
        resolve();
        return;
      }

      dispatch({
        type: `deliveryOrder/${apiName}`,
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

  const handleTabChange = (key) => {
    setDeliveryShow(key === 'head');
    if (key === 'head') {
      ListDS.query();
      return;
    }

    LineListDS.query();
  };

  const handleSubmit = (checkFlag) => {
    return new Promise(async (resolve) => {
      let validateFlag = true;
      const params = ListDS.selected.map((item) => {
        if (item.data.deliveryOrderStatus !== 'NEW') {
          validateFlag = false;
        }

        return {
          ...item.data,
          deliveryOrderStatus: 'DELIVERED',
          checkFlag,
        };
      });

      if (!validateFlag) {
        notification.warning({
          message: '选中的发货单有无法提交发货的发货单（已发货/已取消/已关闭），请检查后选择!',
        });
        resolve();
        return;
      }

      submitDeliveryApply(params).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          ListDS.query();
        } else if (res.failed && res.code === 'hzmc.warn.check.delivery.num') {
          Modal.confirm({
            children: (
              <>
                {res.message &&
                  res.message.split('\n').map((item) => {
                    return <p>{item}</p>;
                  })}
              </>
            ),
            onOk: () => {
              handleSubmit(0);
            },
          });
        } else {
          notification.error({
            message: res.message,
          });
          resolve(false);
          return false;
        }
        resolve();
      });
    });
  };

  async function handlePrint() {
    if (ListDS.selected.length !== 1) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    return new Promise((resolve) => {
      dispatch({
        type: 'deliveryOrder/getPrintrules',
        payload: { printRuleType: 'DELIVERY_ORDER' },
      }).then(async (resData) => {
        if (resData && !resData.failed && resData.content?.length) {
          const { templateCode } = resData.content[0];
          const requestIdString = ListDS.selected[0].data.deliveryOrderNum;
          const res = await queryReportData(templateCode);
          if (res && res.content && res.content.length > 0) {
            const { reportUuid } = res.content[0];
            const url = `${HZERO_RPT}/v1/${getCurrentOrganizationId()}/reports/export/${reportUuid}/PRINT`;
            const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&deliveryOrderNum=${requestIdString}`;
            window.open(requestUrl);
          }
        }
        resolve();
      });
    });
  }

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.deliveryApplyToSupplier`).d('发货单列表')}>
        {deliveryShow && (
          <>
            <Button
              color="primary"
              // onClick={() => handleSave('submitDeliveryApply', 'DELIVERED')}
              onClick={() => handleSubmit(1)}
            >
              提交发货
            </Button>
            <ButtonPermission
              type="c7n-pro"
              permissionList={[
                {
                  code: `hzmc.zcom.ship.delivery.order.ps.button.print`,
                  type: 'button',
                  meaning: '打印',
                },
              ]}
            >
              打印
            </ButtonPermission>
            <ButtonPermission
              type="c7n-pro"
              permissionList={[
                {
                  code: `hzmc.zcom.ship.delivery.order.ps.button.release`,
                  type: 'button',
                  meaning: '重新下发',
                },
              ]}
            >
              重新下发
            </ButtonPermission>
            <Button onClick={() => handleSave('cancelDeliveryApply', 'CANCELLED')}>取消</Button>
            <Button onClick={() => handleSave('deleteDeliveryApply')}>删除</Button>
            <Button onClick={handlePrint}>打印</Button>
          </>
        )}
      </Header>
      <Content className={styles['delivery-order-create-list-content']}>
        <Tabs defaultActiveKey="head" onChange={handleTabChange}>
          <TabPane tab="发货单查询" key="head">
            <Table dataSet={ListDS} columns={listColumns} columnResizable="true" />
          </TabPane>
          <TabPane tab="发货明细查询" key="detail">
            <Table
              dataSet={LineListDS}
              columns={lineColumns}
              columnResizable="true"
              rowHeight="auto"
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default connect()(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomDeliveryApply)
);
