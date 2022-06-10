/*
 * @Author: zhang yang
 * @Description: 检验项目组 - index
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2019-11-20 14:18:54
 */

import React, { useState, Fragment, useMemo, useEffect } from 'react';
import intl from 'utils/intl';
import { routerRedux } from 'dva/router';
import { Header, Content } from 'components/Page';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import { notification } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet, useDataSetEvent } from 'utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';

import { listTableDs, lineTableDs } from '@/stores/dispatchOrderDs';
import { dispatching, cancel } from '@/services/dispatchOrderService';

const preCode = 'neway.dispatchOrder';

const inspectionGroupList = (props) => {
  const listDs = useDataSet(() => new DataSet(listTableDs()), inspectionGroupList);
  const lineDs = useMemo(() => new DataSet(lineTableDs()), []);
  const [showLine, setShowLine] = useState(false);

  useDataSetEvent(listDs, 'load', ({ dataSet }) => {
    if (dataSet.current) {
      setShowLine(false);
    }
  });

  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        listDs.queryDataSet.current.set('organizationObj', {
          meOuName: res.content[0].meOuName,
          meOuId: res.content[0].meOuId,
        });
        listDs.query();
      }
    }
    getUserInfo();
  }, []);

  const columns = [
    {
      name: 'moNum',
      width: 130,
      renderer: ({ record, value }) => {
        return <a onClick={() => handleToDetail(record)}>{value}</a>;
      },
    },
    { name: 'documentTypeName', width: 150 },
    { name: 'moStatus', width: 120 },
    { name: 'costCenterName', width: 120 },
    {
      name: 'sourceDocNum',
      width: 120,
    },
    { name: 'organizationName', width: 120 },
    {
      name: 'itemCode',
      width: 200,
      renderer: ({ record, value }) => {
        return `${value}-${record.get('description')}`;
      },
    },
    {
      name: 'attributeString3',
      width: 120,
    },
    { name: 'remark', width: 120 },
  ];

  const lineColumns = [
    { name: 'taskNum', width: 120 },
    { name: 'taskStatus', width: 100 },
    { name: 'operation', width: 120 },
    { name: 'resourceName', width: 120 },
    { name: 'attributeString1', width: 120 },
    { name: 'executableProcessedTime', width: 120 },
    { name: 'processedTime', width: 120 },
  ];

  function handleToDetail(record) {
    const moId = record.get('moId');
    props.dispatch(
      routerRedux.push({
        pathname: `/neway/dispatch-order/detail/${moId}`,
      })
    );
  }

  /**
   * 新建
   */
  function handleCreate(url, e) {
    if (e) e.stopPropagation();
    props.dispatch(
      routerRedux.push({
        pathname: url,
      })
    );
  }

  function handleRowChange(record) {
    return {
      onClick: () => {
        setShowLine(true);
        lineDs.setQueryParameter('documentId', record.get('moId'));
        lineDs.query();
      },
    };
  }

  async function handleButton(type) {
    const selectData = listDs.currentSelected.map((item) => item.toData());
    let res;
    try {
      if (type === 'dispatch') {
        res = await dispatching(selectData);
      } else {
        res = await cancel(selectData);
      }
      if (res.failed) {
        notification.error({
          message: intl.get('hzero.common.message.confirm.title').d('提示'),
          description: res.message,
        });
        return false;
      } else {
        notification.success({
          message: intl.get('hzero.common.message.confirm.title').d('提示'),
          description: intl.get('hord.order.submit.success').d('提交成功'),
        });
      }
      listDs.query();
    } catch (e) {
      return false;
    }
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.dispatchOrderSPMS`).d('派工单管理平台')}>
        <Button
          icon="add"
          color="primary"
          onClick={() => handleCreate('/neway/dispatch-order/create')}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <Button onClick={() => handleButton('dispatch')}>
          {intl.get(`${preCode}.button.dispatch`).d('派工')}
        </Button>
        <Button onClick={() => handleButton('cancel')}>
          {intl.get(`hzero.common.button.cancel`).d('取消')}
        </Button>
      </Header>
      <Content>
        <Table
          dataSet={listDs}
          columns={columns}
          onRow={({ record }) => handleRowChange(record)}
          columnResizable="true"
          editMode="inline"
        />
        <div style={!showLine ? { display: 'none' } : { display: 'block', marginTop: '30px' }}>
          <Table dataSet={lineDs} columns={lineColumns} columnResizable="true" editMode="inline" />
        </div>
      </Content>
    </Fragment>
  );
};

export default formatterCollections({ code: 'neway.reworkTaskPlatform' })(inspectionGroupList);
