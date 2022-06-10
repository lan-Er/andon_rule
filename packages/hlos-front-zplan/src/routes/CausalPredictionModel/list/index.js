/*
 * @Descripttion: 销售预测模型 - 时间序列预测模型
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';

// import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { listDS } from '../store/indexDS';

const intlPrefix = 'zplan.timePredictionModel';
const ListDS = new DataSet(listDS());
const organizationId = getCurrentOrganizationId();

function ZplanTimePredictionModel() {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleCreate() {
    ListDS.create(
      {
        tenantId: organizationId,
      },
      0
    );
  }

  function handleDelete() {
    if (!ListDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    ListDS.delete(ListDS.selected);
  }

  function handleSure(obj) {
    ListDS.current.set('itemAttr', {
      ...ListDS.current.toData(),
      ...obj,
      itemId: ListDS.current.get('itemId'),
      itemCode: ListDS.current.get('itemCode'),
    });
  }

  const columns = [
    {
      name: 'salesEntityObj',
      width: 150,
      editor: true,
    },
    {
      name: 'categorySetName',
      width: 150,
    },
    {
      name: 'categoryObj',
      width: 150,
      editor: true,
    },
    {
      name: 'categoryName',
      width: 150,
    },
    {
      name: 'itemObj',
      width: 150,
      editor: true,
    },
    {
      name: 'itemDesc',
      width: 150,
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <ItemAttributeSelect
            data={value}
            handleSure={handleSure}
            ds={ListDS}
            itemId={record.get('itemId')}
            itemDesc={record.get('itemDesc')}
            disabled={!record.editing}
          />
        );
      },
    },
    {
      name: 'causalTypeName',
      width: 150,
    },
    {
      name: 'divisorObj',
      width: 150,
      editor: true,
    },
    {
      name: 'causalValue',
      width: 150,
      editor: true,
      align: 'left',
    },
    {
      name: 'startDate',
      width: 150,
      editor: true,
    },
    {
      name: 'endDate',
      width: 150,
      editor: true,
    },
    {
      header: '操作',
      lock: 'right',
      align: 'center',
      width: 120,
      command: ['edit'],
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.timePredictionModel`).d('因果预测模型')}>
        <Button color="primary" onClick={handleCreate} icon="add">
          新建
        </Button>
        <Button onClick={handleDelete}>删除</Button>
      </Header>
      <Content>
        <Table dataSet={ListDS} columns={columns} editMode="inline" rowHeight="auto" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZplanTimePredictionModel {...props} />;
});
