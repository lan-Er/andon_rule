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
import { DataSet, Button, Table, Modal } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import { createDeliveryOrders } from '@/services/deliveryCreateByService';
import { DeliveryOrderListDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zcom.deliveryApply';
const deliveryOrderListDS = (roleType) => new DataSet(DeliveryOrderListDS(roleType));

const organizationId = getCurrentOrganizationId();

function ZcomDeliveryApply({ history }) {
  const ListDS = useDataSet(() => deliveryOrderListDS());

  useEffect(() => {
    ListDS.setQueryParameter('supplierTenantId', organizationId);
    ListDS.query();
  }, []);

  const listColumns = [
    {
      name: 'customerItemDesc',
      width: 150,
      renderer: ({ record, value }) => (
        <>
          <div>{record.get('customerItemCode')}</div>
          <div>{value}</div>
        </>
      ),
      lock: 'left',
    },
    {
      name: 'supplierItemDesc',
      width: 150,
      renderer: ({ record, value }) => (
        <>
          <div>{record.get('supplierItemCode')}</div>
          <div>{value}</div>
        </>
      ),
      lock: 'left',
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return value && value.attributeValue1 ? (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('customerItemId')}
            itemDesc={record.get('customerItemDesc')}
            disabled
          />
        ) : null;
      },
      lock: 'left',
    },
    { name: 'relatedDeliveryApplyNum', width: 150 },
    { name: 'relatedApplyLineNum' },
    { name: 'supplierUomName' },
    { name: 'supplierDeliveryQty' },
    { name: 'supplierUnshippedQty', width: 120 },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum' },
    { name: 'supplierPromiseQty' },
    { name: 'supplierPoUnshippedQty', width: 110 },
    { name: 'uncreatedDeliveryQty', width: 120 },
    { name: 'supplierInventoryOrgName', width: 150 },
    { name: 'customerName', width: 150 },
    {
      name: 'receivingType',
      width: 150,
      renderer: ({ record, value }) => {
        let showField;
        if (value === 'THIRD_SUPPLIER') {
          showField = record.get('recvSupplierOrgName');
        }

        if (value === 'SUB_COMPANY') {
          showField = record.get('recvInventoryOrgName');
        }

        return showField || '';
      },
    },
    { name: 'deliveryApplyDate', width: 150 },
    { name: 'arrivalDate', width: 150 },
    { name: 'deliveryAddress', width: 150 },
    { name: 'receivingAddress', width: 150 },
    { name: 'consigneeName', width: 150 },
    { name: 'consigneePhone', width: 150 },
  ];

  const handleSave = (status, checkFlag) => {
    return new Promise(async (resolve) => {
      const lines = ListDS.selected.map((item) => {
        return {
          ...item.toData(),
          checkFlag,
        };
      });
      createDeliveryOrders(lines).then(async (res) => {
        if (res && !res.failed) {
          history.push({
            pathname: `/zcom/delivery-order/detail/${res.deliveryOrderId}`,
          });
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
              handleSave(status, 0);
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

  const handleCreate = () => {
    let validateFlag = true;

    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return false;
    }

    const {
      customerId,
      supplierId,
      recvInventoryOrgId,
      recvSupplierOrgId,
    } = ListDS.selected[0].toData();
    const idList = ListDS.selected.map((item) => {
      if (
        customerId !== item.get('customerId') ||
        supplierId !== item.get('supplierId') ||
        recvInventoryOrgId !== item.get('recvInventoryOrgId') ||
        recvSupplierOrgId !== item.get('recvSupplierOrgId')
      ) {
        validateFlag = false;
      }
      return item.data.relatedApplyLineId;
    });

    if (!validateFlag) {
      notification.warning({
        message: intl
          .get(`zcom.common.message.validation.select`)
          .d('客户/供应商/接收组织不一致，无法合并进行发货!'),
      });
      return false;
    }

    if (!idList.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('选中数据无效，请重新选择!'),
      });
      return false;
    }

    handleSave('NEW', 1);
    // history.push({
    //   pathname: `/zcom/delivery-create-by/create`,
    //   state: { idList },
    // });
  };

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.deliveryApplyToSupplier`).d('发货单创建')}>
        <Button color="primary" onClick={handleCreate}>
          创建发货
        </Button>
      </Header>
      <Content className={styles['delivery-create-by-list-content']}>
        <Table dataSet={ListDS} columns={listColumns} columnResizable="true" rowHeight="auto" />
      </Content>
    </Fragment>
  );
}

export default connect()(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomDeliveryApply)
);
