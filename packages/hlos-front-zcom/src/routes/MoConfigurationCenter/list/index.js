/**
 * @Description: 代工业务对账规则配置
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-03-01 10:39:48
 */

import React, { Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { FoundryRuleDS } from '../store/MoConfigurationCenterDS';

const intlPrefix = 'zcom.configurationCenter';

function ZcomFoundryConfiguration() {
  const foundryRuleDS = new DataSet(FoundryRuleDS());

  const columns = [
    { name: 'supplierObj', editor: true, align: 'center' },
    { name: 'supplierDocumentTypeObj', editor: true, align: 'center' },
    { name: 'supplierDocumentTypeName', editor: false, align: 'center' },
    { name: 'verificationFlag', editor: true, align: 'center' },
    { name: 'pricingCode', editor: true, align: 'center' },
    { name: 'itemPrefix', editor: true, align: 'center' },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      command: ['edit'],
      lock: 'right',
    },
  ];

  const handleCreate = () => {
    foundryRuleDS.create({}, 0);
  };

  const handleDelete = async () => {
    if (!foundryRuleDS.selected.length) {
      notification.warning({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const res = await foundryRuleDS.delete(foundryRuleDS.selected);
    if (!isEmpty(res) && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
    } else {
      foundryRuleDS.query();
    }
  };

  return (
    <Fragment>
      <Header
        backPath="/zcom/mo-configuration-center/entrance"
        title={intl
          .get(`${intlPrefix}.view.title.configurationCenter`)
          .d('代工业务对账规则配置列表')}
      >
        <Button onClick={handleCreate}>新建</Button>
        <Button onClick={handleDelete}>删除</Button>
      </Header>
      <Content>
        <Table dataSet={foundryRuleDS} columns={columns} columnResizable="true" editMode="inline" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZcomFoundryConfiguration {...props} />;
});
