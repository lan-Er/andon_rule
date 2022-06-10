/**
 * @Description: 配置中心-发货管理
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-11 17:32:15
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Form, Switch } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { DeliveryConfigDS } from '../store/indexDS';
import { deliveryConfigCreate, deliveryConfigUpdate } from '@/services/configurationCenterService';
import styles from './index.less';

const intlPrefix = 'zmda.configurationCenter';
const deliveryConfigDS = () => new DataSet(DeliveryConfigDS());

function ZmdaDeliveryConfiguration() {
  const deliveryDS = useDataSet(deliveryConfigDS);

  useEffect(() => {
    handleSearch();
  }, []);

  async function handleSearch() {
    await deliveryDS.query();
  }

  function handleSave() {
    return new Promise((resolve) => {
      const {
        deliveryRuleId,
        autoDeliveryFlag,
        syncSupplierSystemFlag,
      } = deliveryDS.current.toData();
      const obj = deliveryRuleId
        ? {
            ...deliveryDS.current.toData(),
          }
        : {
            tenantId: getCurrentOrganizationId(),
            autoDeliveryFlag: autoDeliveryFlag || '0',
            syncSupplierSystemFlag: syncSupplierSystemFlag || '0',
          };
      if (deliveryRuleId) {
        deliveryConfigUpdate(obj).then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '操作成功',
            });
            deliveryDS.query();
          } else {
            notification.error({
              message: res.message,
            });
            resolve(false);
            return;
          }
          resolve();
        });
      } else {
        deliveryConfigCreate(obj).then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '操作成功',
            });
            deliveryDS.query();
          } else {
            notification.error({
              message: res.message,
            });
            resolve(false);
            return;
          }
          resolve();
        });
      }
    });
  }

  return (
    <Fragment>
      <div className={styles['delivery-config']}>
        <div className={styles['delivery-config-header']}>
          <div>{intl.get(`${intlPrefix}.view.title.deliveryConfiguration`).d('发货规则配置')}</div>
          <Button color="primary" onClick={handleSave}>
            保存
          </Button>
        </div>
        <div className={styles['delivery-config-content']}>
          <Form dataSet={deliveryDS} labelWidth={300}>
            <Switch name="autoDeliveryFlag" key="autoDeliveryFlag" />,
          </Form>
          <div className={styles['delivery-config-content-desc']}>
            <div>
              选择是，则预约单状态变更为已预约后，会根据发货预约单的信息，自动创建预约单记录的供应商的租户下的发货单，状态为“新建”
            </div>
            <div>选择否，则不会触发自动创建发货单的操作。需要供应商自己人为操作</div>
          </div>
          {/* <Form dataSet={deliveryDS} labelWidth={300}>
            <Switch name="syncSupplierSystemFlag" key="syncSupplierSystemFlag" />,
          </Form>
          <div className={styles['delivery-config-content-desc']}>
            <div>
              选择是，表明该租户有对接外部出入库执行系统，则前端“提交发货”按钮隐藏，显示“重新下发”按钮
            </div>
            <div>
              选择否，则前端“提交发货”的按钮显示，隐藏“重新下发”按钮
            </div>
          </div> */}
        </div>
      </div>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZmdaDeliveryConfiguration);
