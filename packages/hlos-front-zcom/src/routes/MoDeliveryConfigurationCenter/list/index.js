/**
 * @Description: 送货单审核配置规则
 * @Author: yu.yang06@hand-china.com
 * @Date: 2021-04-25 15:39:48
 */

import React, { Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { isEmpty } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import { FoundryRuleDS } from '../store/MoDeliveryConfigurationCenterDS';

const intlPrefix = 'zcom.moDeliveryConfigurationCenter';

function ZcomMoDeliveryConfigurationCenterList() {
  const foundryRuleDS = new DataSet(FoundryRuleDS());

  // 新建
  const hanleCreate = () => {
    foundryRuleDS.create({}, 0);
  };

  // 删除
  const handleDelete = () => {
    if (!foundryRuleDS.selected.length) {
      notification.warning({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const records = foundryRuleDS.selected;
    const res = foundryRuleDS.delete(records);
    if (!isEmpty(res) && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
    } else {
      foundryRuleDS.query();
    }
  };

  const columns = [
    { name: 'supplierObj', editor: true },
    { name: 'deliveryOrderTypeObj', editor: true },
    { name: 'needReview', editor: true },
    { name: 'revocable', editor: true },
    {
      header: '操作',
      command: () => ['edit'],
    },
  ];

  return (
    <Fragment>
      <Header
        backPath="/zcom/mo-delivery-configuration-center/entrance"
        title={intl
          .get(`${intlPrefix}.view.title.moDeliveryConfigurationCenter`)
          .d('送货单审核配置规则')}
      >
        <Button onClick={hanleCreate}>新建</Button>
        <Button onClick={handleDelete}>删除</Button>
      </Header>
      <Content>
        <Table dataSet={foundryRuleDS} editMode="inline" columns={columns} />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomMoDeliveryConfigurationCenterList {...props} />;
});
