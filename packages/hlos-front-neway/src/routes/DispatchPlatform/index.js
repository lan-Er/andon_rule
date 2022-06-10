/*
 * @Author: 徐雨 <yu.xu02@hand-china.com>
 * @Date: 2021-06-03 15:04:45
 * @LastEditTime: 2021-06-07 14:45:23
 */

import React, { useState, useEffect } from 'react';
import { useLocalStore, useObserver } from 'mobx-react-lite';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import {
  DataSet,
  Button,
  Lov,
  Select,
  PerformanceTable,
  CheckBox,
  Pagination,
  Modal,
  Form,
} from 'choerodon-ui/pro';
import { notification } from 'choerodon-ui';

import { Header, Content } from 'components/Page';
import TableQueryFrom from 'hlos-front/lib/components/TableQueryFrom';
import { userSetting } from 'hlos-front/lib/services/api';
import intl from 'utils/intl';

import { listTableDs, formDs } from '@/stores/dispatchPlatformDs';
import { dispatching, cancel } from '@/services/dispatchOrderService';
import style from './index.module.less';

export default function DispatchPlatform() {
  const dispatchPlatformDs = useDataSet(() => new DataSet(listTableDs()), []);
  const modalFormDs = useDataSet(() => new DataSet(formDs()), []);
  const [checkValues, setCheckValues] = useState([]);

  const modalKey = Modal.key();
  const store = useLocalStore(() => {
    return {
      dataSource: [],
      total: 0,
      currentPage: 0,
      pageSize: 10,
      async handleSearch() {
        console.log(dispatchPlatformDs.queryDataSet.current.get('page'));
        console.log(dispatchPlatformDs.queryDataSet.current.get('size'));

        const result = await dispatchPlatformDs.query();

        this.dataSource = result.content;
        this.total = result.totalElements;
      },
      handlePageChange(_currentPage, _pageSize) {
        this.currentPage = _currentPage;
        this.pageSize = _pageSize;

        dispatchPlatformDs.queryDataSet.current.set('page', _currentPage);
        dispatchPlatformDs.queryDataSet.current.set('size', _pageSize);
        this.handleSearch();
      },
    };
  });

  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });

      if (res && res.content && res.content.length > 0) {
        dispatchPlatformDs.queryDataSet.current.set('organizationObj', {
          meOuName: res.content[0].meOuName,
          meOuId: res.content[0].meOuId,
        });
        dispatchPlatformDs.query();
      }
    }
    getUserInfo();
  }, []);

  const handleCheckAllChange = (value) => {
    if (value) {
      setCheckValues(store.dataSource);
    } else {
      setCheckValues([]);
    }
  };

  const getColumns = () => {
    return [
      {
        title: (
          <CheckBox
            name="controlled"
            checked={checkValues.length > 0 && checkValues.length === store.dataSource.length}
            onChange={handleCheckAllChange}
          />
        ),
        dataIndex: 'moId',
        key: 'moId',
        width: 50,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) =>
          handleCheckCell({ rowData, dataIndex, rowIndex }),
      },
      { dataIndex: 'moNum', title: '工单号', width: 130 },
      { dataIndex: 'documentTypeName', title: '工单类型', width: 150 },
      { dataIndex: 'moStatus', title: '工单状态', width: 120 },
      { dataIndex: 'costCenterName', title: '成本中心', width: 120 },
      { dataIndex: 'sourceDocNum', title: '生产订单', width: 120 },
      { dataIndex: 'organizationName', title: '工厂', width: 120 },
      { dataIndex: 'itemCode', title: '物料', width: 200 },
      { dataIndex: 'attributeString3', title: '总工时', width: 120 },
      { dataIndex: 'remark', title: '备注', width: 120 },
    ];
  };

  const toCancelDispatch = async () => {
    const selectData = checkValues.map((item) => ({
      taskId: item.taskId,
      taskNum: item.taskNum,
    }));
    const res = await cancel(selectData);

    showTips(res);
  };

  const toDispatch = async () => {
    if (checkValues.length !== 1) {
      notification.error({
        message: '请选择一条数据',
      });
      return false;
    }

    const selectData = checkValues.map((item) => ({
      taskId: item.taskId,
      taskNum: item.taskNum,
    }));
    const data = { ...selectData[0] };

    data.workcellId = formDs.queryDataSet.current.get('workcellId');
    // data.workcellCode = formDs.queryDataSet.current.get('workcellCode');

    const res = await dispatching(data);

    showTips(res);
  };

  const showTips = (res) => {
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
  };

  const handleCheckboxChange = (value, rowData) => {
    const newCheckValues = [...checkValues];
    if (value) {
      newCheckValues.push(rowData);
    } else {
      newCheckValues.splice(
        newCheckValues.findIndex((i) => i.moId === rowData.moId),
        1
      );
    }

    setCheckValues(newCheckValues);
  };

  const modalRender = () => {
    return (
      <Form dataSet={modalFormDs}>
        <Lov name="workcellId" />
      </Form>
    );
  };

  const openModal = () => {
    Modal.open({
      key: modalKey,
      title: '生产派工',
      children: modalRender(),
      onOk: toDispatch,
      closable: true,
      className: style['dispatch-platform-modal'],
    });
  };

  const handleCheckCell = ({ rowData, rowIndex }) => {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.moId}
        checked={checkValues.findIndex((i) => i.moId === rowData.moId) !== -1}
        onClick={(e) => e.stopPropagation()}
        onChange={(val) => handleCheckboxChange(val, rowData)}
      />
    );
  };

  return useObserver(() => (
    <>
      <Header title="派工平台">
        <Button onClick={openModal}>派工</Button>
        <Button onClick={toCancelDispatch}>取消派工</Button>
      </Header>
      <Content>
        <TableQueryFrom
          dataSet={dispatchPlatformDs.queryDataSet}
          showNumber={4}
          onClickQueryCallback={store.handleSearch}
        >
          <Lov name="organizationObj" />
          <Lov name="moNumObj" />
          <Lov name="taskLov" />
          <Lov name="operationName" />
          <Select name="taskStatus" />
        </TableQueryFrom>

        <PerformanceTable virtualized data={store.dataSource} columns={getColumns()} />
        <div className={style['dispatch-platform-footer']}>
          <Pagination
            pageSizeOptions={['10', '100', '200', '500', '1000', '5000', '10000']}
            total={store.total}
            pageSize={store.pageSize}
            page={store.currentPage}
            onChange={store.handlePageChange}
          />
        </div>
      </Content>
    </>
  ));
}
