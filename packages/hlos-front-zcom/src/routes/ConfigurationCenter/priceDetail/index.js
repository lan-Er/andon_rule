/*
 * @Descripttion: 无需对账供应商列表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2020-12-21 11:03:18
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-01-04 17:32:53
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Form, Table, Button, Modal, Lov, Switch, Select } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import codeConfig from '@/common/codeConfig';
import { isEmpty } from 'lodash';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import { getCurrentOrganizationId } from 'utils/utils';
import { PriceListDS } from '../store/DetailDS';

const commonPrefix = 'zcom.common';
const intlPrefix = 'zcom.configurationCenter';

const key1 = Modal.key();

const { common, configurationCenter } = codeConfig.code;
const lineDS = () => new DataSet({ ...PriceListDS() });

function ZcomRequirementReleaseDetail(props) {
  const priceListDS = useDataSet(lineDS);

  const {
    match: {
      params: { orderConfigId },
    },
  } = props;

  useEffect(() => {
    handleSearch();
  }, [orderConfigId]);

  async function handleSearch() {
    priceListDS.setQueryParameter('orderConfigId', orderConfigId);
    await priceListDS.query();
  }

  const columns = [
    { name: 'supplierNumber', align: 'center' },
    { name: 'supplierDescription', align: 'center' },
    {
      name: 'orderPriceFlag',
      align: 'center',
      editor: (record) => record.get('linePirceFlag') !== 1,
    },
    {
      name: 'allocationRule',
      align: 'center',
      editor: (record) => record.get('orderPriceFlag') === 1,
    },
    {
      name: 'linePirceFlag',
      align: 'center',
      editor: (record) => record.get('orderPriceFlag') !== 1,
    },
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
      {
        name: 'orderPriceFlag',
        label: intl.get(`${commonPrefix}.customerVerificationFlag`).d('整单调价'),
        type: 'boolean',
        defaultValue: 0,
        trueValue: 1,
        falseValue: 0,
        dynamicProps: {
          disabled: ({ record }) => {
            if (record.get('linePirceFlag') === 1) {
              return true;
            }
          },
        },
      },
      {
        name: 'allocationRule',
        label: intl.get(`${commonPrefix}.supplierVerificationFlag`).d('分摊规则'),
        type: 'string',
        lookupCode: configurationCenter.allocationRule,
        dynamicProps: {
          disabled: ({ record }) => {
            if (record.get('orderPriceFlag') !== 1) {
              return true;
            }
          },
          required: ({ record }) => {
            if (record.get('orderPriceFlag') === 1) {
              return true;
            }
          },
        },
      },
      {
        name: 'linePirceFlag',
        label: intl.get(`${commonPrefix}.auditFlag`).d('单行调价'),
        type: 'boolean',
        defaultValue: 0,
        trueValue: 1,
        falseValue: 0,
        dynamicProps: {
          disabled: ({ record }) => {
            if (record.get('orderPriceFlag') === 1) {
              return true;
            }
          },
        },
      },
    ],
  });

  const handleCreate = () => {
    modalDS.reset();

    Modal.open({
      closable: true,
      key: key1,
      title: '新建供应商',
      drawer: true,
      style: {
        width: 400,
      },
      children: (
        <div>
          <Form dataSet={modalDS} columns={1}>
            <Lov name="supplierObj" noCache />
            <Switch name="orderPriceFlag" />
            <Select name="allocationRule" />
            <Switch name="linePirceFlag" />
          </Form>
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
  const handleDelhead = async () => {
    const { selected } = priceListDS;
    if (!selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const res = await priceListDS.delete(selected);
    if (!isEmpty(res) && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
    } else {
      priceListDS.query();
    }
  };

  const comfirm = async () => {
    const continueFlag = await modalDS.validate(false, false);
    if (!continueFlag) {
      return;
    }

    const {
      supplierId,
      supplierNumber,
      description,
      orderPriceFlag,
      allocationRule,
      linePirceFlag,
    } = modalDS.current.toData();

    const params = {
      tenantId: getCurrentOrganizationId(),
      supplierId,
      supplierNumber,
      supplierDescription: description,
      orderConfigId,
      orderPriceFlag,
      allocationRule,
      linePirceFlag,
    };

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
        title={intl.get(`${intlPrefix}.view.title.configurationCenter`).d('供应商列表')}
        backPath="/zcom/configuration-center/price-list"
      >
        <Button onClick={handleCreate}>新建</Button>
        <Button onClick={handleDelhead}>删除</Button>
      </Header>
      <Content>
        <Table
          dataSet={priceListDS}
          columns={columns}
          columnResizable="true"
          queryFieldsLimit={4}
          editMode="inline"
        />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})((props) => {
  return <ZcomRequirementReleaseDetail {...props} />;
});
