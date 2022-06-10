/*
 * @Descripttion: 无需对账/对账规则供应商列表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2020-12-21 11:03:18
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-01-04 17:06:28
 */

import React, { useEffect, useState, Fragment } from 'react';
import { DataSet, Form, Table, Button, Modal, Lov, Switch } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import codeConfig from '@/common/codeConfig';
import { isEmpty } from 'lodash';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';

import { getCurrentOrganizationId } from 'utils/utils';
import { NoReconcileListDS, ReconcileListDS } from '../store/DetailDS';

const commonPrefix = 'zcom.common';
const intlPrefix = 'zcom.requirementRelease';

const noLineDS = () => new DataSet({ ...NoReconcileListDS() });
const lineDS = () => new DataSet({ ...ReconcileListDS() });

const key1 = Modal.key();
const reconcileKey = Modal.key();

const { common } = codeConfig.code;

function ZcomRequirementReleaseDetail(props) {
  const noReconcileListDS = useDataSet(noLineDS);
  const reconcileListDS = useDataSet(lineDS);

  const [currentTab, setCurrentTab] = useState('');

  const {
    match: {
      params: { tabType, orderConfigId },
    },
  } = props;

  useEffect(() => {
    handleSearch();
  }, [orderConfigId]);

  useDataSetEvent(reconcileListDS, 'update', ({ record, name, value }) => {
    const newValue = value === 1 ? 0 : 1;
    if (name === 'customerVerificationFlag') {
      record.set({
        supplierVerificationFlag: newValue,
      });
    }

    if (name === 'supplierVerificationFlag') {
      record.set({
        customerVerificationFlag: newValue,
      });
    }
  });
  const handleSearch = async () => {
    setCurrentTab(tabType);
    if (tabType === 'NO_RECONCILIATION') {
      noReconcileListDS.setQueryParameter('orderConfigId', orderConfigId);
      await noReconcileListDS.query();
    } else {
      reconcileListDS.setQueryParameter('orderConfigId', orderConfigId);
      await reconcileListDS.query();
    }
  };

  const columns = [
    { name: 'supplierNumber', align: 'center' },
    { name: 'supplierDescription', align: 'center' },
  ];

  const reconcileColumns = [
    { name: 'supplierNumber', align: 'center' },
    { name: 'supplierDescription', align: 'center' },
    {
      name: 'customerVerificationFlag',
      align: 'center',
      editor: true,
    },
    {
      name: 'supplierVerificationFlag',
      align: 'center',
      editor: true,
    },
    { name: 'auditFlag', align: 'center', editor: true },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      command: ['edit'],
    },
  ];

  const modalDS = new DataSet({
    autoCreate: true,
    fields: [
      {
        name: 'supplierObj',
        type: 'object',
        lovCode: common.supplier,
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        ignore: 'always',
        required: true,
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'supplierNumber',
        type: 'string',
        bind: 'supplierObj.supplierNumber',
      },
      {
        name: 'description',
        type: 'string',
        bind: 'supplierObj.description',
      },
    ],
  });

  const noReconcileModalDS = new DataSet({
    autoCreate: true,
    fields: [
      {
        name: 'supplierObj',
        type: 'object',
        lovCode: common.supplier,
        label: intl.get(`${commonPrefix}.supplier`).d('供应商'),
        ignore: 'always',
        required: true,
      },
      {
        name: 'supplierId',
        type: 'string',
        bind: 'supplierObj.supplierId',
      },
      {
        name: 'supplierNumber',
        type: 'string',
        bind: 'supplierObj.supplierNumber',
      },
      {
        name: 'description',
        type: 'string',
        bind: 'supplierObj.description',
      },
      {
        name: 'customerVerificationFlag',
        label: intl.get(`${commonPrefix}.customerVerificationFlag`).d('核企触发对账'),
        type: 'boolean',
        defaultValue: 1,
        trueValue: 1,
        falseValue: 0,
      },
      {
        name: 'supplierVerificationFlag',
        label: intl.get(`${commonPrefix}.supplierVerificationFlag`).d('供应商触发对账'),
        type: 'boolean',
        defaultValue: 0,
        trueValue: 1,
        falseValue: 0,
      },
      {
        name: 'auditFlag',
        label: intl.get(`${commonPrefix}.auditFlag`).d('是否需要审核'),
        type: 'boolean',
        defaultValue: 0,
        trueValue: 1,
        falseValue: 0,
      },
    ],
  });

  const handleSwitchChange = (name, value) => {
    const newValue = value === 1 ? 0 : 1;
    noReconcileModalDS.current.set(name, newValue);
  };

  const handleCreate = () => {
    modalDS.reset();
    noReconcileModalDS.reset();

    Modal.open({
      closable: true,
      key: currentTab === 'NO_RECONCILIATION' ? key1 : reconcileKey,
      title: '新建供应商',
      drawer: true,
      style: {
        width: 400,
      },
      children: (
        <div>
          {currentTab === 'NO_RECONCILIATION' ? (
            <Form dataSet={modalDS} columns={1}>
              <Lov name="supplierObj" noCache />
            </Form>
          ) : (
            <Form dataSet={noReconcileModalDS} columns={1}>
              <Lov name="supplierObj" noCache />
              <Switch
                name="customerVerificationFlag"
                onChange={(value) => handleSwitchChange('supplierVerificationFlag', value)}
              />
              <Switch
                name="supplierVerificationFlag"
                onChange={(value) => handleSwitchChange('customerVerificationFlag', value)}
              />
              <Switch name="auditFlag" />
            </Form>
          )}
        </div>
      ),
      onOk: () => {
        comfirm();
      },
    });
  };

  /**
   * 删除行信息
   * @param {*} record 行记录
   */
  const handleDelhead = async (ds) => {
    const { selected } = ds;
    if (!selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const res = await ds.delete(selected);
    if (!isEmpty(res) && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
    } else {
      ds.query();
    }
  };

  const comfirm = async () => {
    let params;

    if (currentTab === 'NO_RECONCILIATION') {
      const continueFlag = await modalDS.validate(false, false);
      if (!continueFlag) {
        return;
      }

      const { supplierId, supplierNumber, description } = modalDS.current.toData();
      params = {
        tenantId: getCurrentOrganizationId(),
        supplierId,
        supplierNumber,
        supplierDescription: description,
        orderConfigId,
      };
    } else {
      const continueFlag = await noReconcileModalDS.validate(false, false);
      if (!continueFlag) {
        return;
      }

      const {
        supplierId,
        supplierNumber,
        description,
        customerVerificationFlag,
        supplierVerificationFlag,
        auditFlag,
      } = noReconcileModalDS.current.toData();

      params = {
        tenantId: getCurrentOrganizationId(),
        supplierId,
        supplierNumber,
        supplierDescription: description,
        orderConfigId,
        customerVerificationFlag,
        supplierVerificationFlag,
        auditFlag,
      };
    }

    props
      .dispatch({
        type: 'configurationCenterModel/orderConfigDetails',
        payload: [params],
      })
      .then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          handleSearch(orderConfigId);
        }
      });
  };

  return (
    <Fragment>
      <Header
        title={
          currentTab === 'NO_RECONCILIATION'
            ? intl.get(`${intlPrefix}.view.title.configurationCenter`).d('无需对账供应商列表')
            : intl.get(`${intlPrefix}.view.title.configurationCenter`).d('对账规则供应商列表')
        }
        backPath="/zcom/configuration-center/list"
      >
        <Button onClick={handleCreate}>新建</Button>
        <Button
          onClick={() =>
            handleDelhead(currentTab === 'NO_RECONCILIATION' ? noReconcileListDS : reconcileListDS)
          }
        >
          删除
        </Button>
      </Header>
      <Content>
        {currentTab === 'NO_RECONCILIATION' ? (
          <Table
            dataSet={noReconcileListDS}
            columns={columns}
            columnResizable="true"
            queryFieldsLimit={4}
          />
        ) : (
          <Table
            dataSet={reconcileListDS}
            columns={reconcileColumns}
            columnResizable="true"
            queryFieldsLimit={4}
            editMode="inline"
          />
        )}
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})((props) => {
  return <ZcomRequirementReleaseDetail {...props} />;
});
