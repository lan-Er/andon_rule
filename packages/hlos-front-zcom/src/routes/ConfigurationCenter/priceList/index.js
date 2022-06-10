/*
 * @Descripttion: 配置中心
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2020-12-21 11:03:18
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2020-12-25 11:29:59
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentUser } from 'utils/utils';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';

import { PriceListDS } from '../store/AccountRuleDS';
import './index.less';

const intlPrefix = 'zcom.configurationCenter';
const priceListDS = new DataSet(PriceListDS());

function ZcomConfigurationCenter(props) {
  useEffect(() => {
    priceListDS.query();
  }, []);

  const columns = [
    {
      name: 'poTypeCode',
      editor: true,
      align: 'center',
    },
    {
      name: 'customerTenantName',
      editor: false,
      align: 'center',
    },
    {
      name: 'supplierNumber',
      align: 'center',
      renderer: ({ record }) => {
        const id = record.get('orderConfigId');
        return <a onClick={() => handleToDetail(id)}>查看供应商列表</a>;
      },
    },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      command: ['edit'],
      lock: 'right',
    },
  ];

  const handleCreate = () => {
    const { tenantId, tenantName } = getCurrentUser();
    const params = {
      customerTenantId: tenantId,
      customerTenantName: tenantName,
      tenantId,
      orderConfigType: 'ADJUST_PRICE',
    };
    priceListDS.create(params, 0);
  };

  // const getOrderConfig = async()=> {
  //   const res = await queryIndependentValueSet({ lovCode: 'ZCOM.ORDER_CONFIG_TYPE' });
  //   setOrderConfigTypeList(res)
  // }

  const handleToDetail = (id) => {
    if (!id) {
      return;
    }
    const pathName = `/zcom/configuration-center/price-detail/${id}`;
    props.history.push(pathName);
  };

  /**
   * 删除头信息
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

  return (
    <Fragment>
      <Header
        backPath="/zcom/configuration-center/entrance"
        title={intl.get(`${intlPrefix}.view.title.configurationCenter`).d('价格列表')}
      >
        <Button onClick={handleCreate}>新建</Button>
        <Button onClick={handleDelhead}>删除</Button>
      </Header>

      <Content className="zcom-requirement-release">
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
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomConfigurationCenter {...props} />;
});
