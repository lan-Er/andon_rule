/*
 * @module: 图纸申请
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-29 16:24:24
 * @LastEditTime: 2021-06-21 10:44:35
 * @copyright: Copyright (c) 2020,Hand
 */
import moment from 'moment';
import { Table, Tooltip } from 'hzero-ui';
import React, { Fragment, useEffect, useMemo } from 'react';
import { useLocalStore, useObserver } from 'mobx-react-lite';
import { Button, DataSet, TextField, DateTimePicker, Select, Lov } from 'choerodon-ui/pro/lib';

import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { userSetting } from 'hlos-front/lib/services/api';

import fromDs from './store';
import TableQueryFrom from '@/components/TableQueryFrom';
import { applicationServices, handleQeuryServices } from '@/services/drawingApplication';

export default function DrawingApplication() {
  const store = useLocalStore(() => {
    return {
      tableDs: new DataSet(fromDs()),
      queryLoading: false,
      application: false,
      workerId: '',
      dataSource: [],
      total: 0,
      page: 1,
      pageSize: 20,
      selectedRows: [],
      setTotal(number) {
        this.total = number;
      },
      setPage(number) {
        this.page = number;
      },
      setPageSize(number) {
        this.pageSize = number;
      },
      setQueryLoading(status) {
        this.queryLoading = status;
      },
      setApplication(status) {
        this.application = status;
      },

      setWorkerId(workerId) {
        this.workerId = workerId;
      },
      handleApplication(params) {
        return applicationServices(params);
      },
      getTableDataSource(params) {
        return handleQeuryServices(params);
      },
      getDataSource(dataList) {
        this.dataSource = dataList;
      },
      setSelectedRows(selectList) {
        this.selectedRows = selectList;
      },
    };
  });
  useEffect(() => {
    async function getUser() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content) {
        const { workerId } = res.content[0];
        store.setWorkerId(workerId);
      }
    }
    getUser();
  }, []);

  const getColumns = useMemo(() => {
    return [
      { dataIndex: 'meOu', width: 180, fixed: 'left', align: 'center', title: '工厂' },
      { dataIndex: 'itemCode', width: 140, fixed: 'left', align: 'center', title: '物料编码' },
      {
        dataIndex: 'itemDescription',
        align: 'center',
        width: 200,
        title: '物料描述',
        render: (value) => (
          <Tooltip placement="topLeft" title={value}>
            {value}
          </Tooltip>
        ),
      },
      { dataIndex: 'itemAlias', align: 'center', title: '物料别名' },
      { dataIndex: 'itemType', align: 'center', title: '物料类型' },
      { dataIndex: 'specification', align: 'center', title: '型号', width: 140 },
      { dataIndex: 'drawingCode', align: 'center', title: '产品图纸编号' },
      {
        dataIndex: 'fileUrlDtoList',
        align: 'center',
        width: 200,
        title: '下载地址',
        render: (text) => renderFileUrl(text),
      },
      { dataIndex: 'applyFlag', align: 'center', title: '是否申请' },
      { dataIndex: 'applyName', align: 'center', title: '申请人' },
      { dataIndex: 'applyTime', align: 'center', width: 160, title: '申请时间' },
    ];
  }, []);

  /**
   * @description: 图纸下载查出显示
   * @param {*} text
   * @return {*}
   */
  function renderFileUrlToolTip(text) {
    return (
      text &&
      text.map((item, index) => (
        <Fragment key={index.toString()}>
          <a href={item.fileUrl ? item.fileUrl : 'javascript;'} target="_black">
            {item.fileName}
          </a>
          <br />
        </Fragment>
      ))
    );
  }

  /**
   * @description: 图纸下载单元格渲染
   * @param {*} text
   * @return {*}
   */
  function renderFileUrl(text) {
    return (
      <Tooltip title={renderFileUrlToolTip(text)} placement="bottomLeft">
        {text &&
          text.map((item, index) => (
            <a
              href={item.fileUrl ? item.fileUrl : 'javascript;'}
              key={index.toString()}
              target="_black"
              style={{ marginLeft: '10px' }}
            >
              {item.fileName}
            </a>
          ))}
      </Tooltip>
    );
  }
  /**
   * @description: 查询操作
   * @param {*} isButton
   * @return {*}
   */
  function handleQuery(isButton) {
    store.setQueryLoading(true);
    if (isButton === 'button') {
      store.setPage(1);
    }
    const params = store.tableDs.queryDataSet.toJSONData()[0];
    store
      .getTableDataSource({
        ...params,
        page: store.page - 1,
        size: store.pageSize,
        _status: undefined,
        __id: undefined,
      })
      .then((res) => {
        const { content, totalElements, number } = res;
        store.getDataSource(content);
        store.setQueryLoading(false);
        store.setTotal(totalElements);
        store.setPage(1 + number);
      })
      .catch(() => {
        store.setQueryLoading(false);
      });
  }

  /**
   * @description: 申请操作
   * @param {*}
   * @return {*}
   */
  function handleAppliceation() {
    const selected = store.selectedRows;
    if (selected.length <= 0) {
      notification.warning({ message: '至少选择一条数据' });
      return;
    }
    store.setApplication(true);
    const itemIdList = selected.map((item) => item.itemId);
    const params = {
      applyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      workerId: store.workerId,
      itemIdList,
    };
    store
      .handleApplication(params)
      .then((res) => {
        if (res && res.failed) {
          store.setApplication(false);
          notification.error({ message: res.message });
        } else {
          store.setApplication(false);
          notification.success({ message: '申请成功' });
          store.tableDs.query();
        }
      })
      .catch(() => {
        store.setApplication(false);
      });
  }

  /**
   * @description: 选择操作
   * @param {*}
   * @return {*}
   */
  const rowSelection = {
    onChange: (_, selectedRows) => {
      store.setSelectedRows(selectedRows);
    },
  };

  /**
   * @description: 改变页数
   * @param {*} page
   * @param {*} pageSize
   * @return {*}
   */
  function handleChangePage(page, pageSize) {
    store.setPageSize(pageSize);
    store.setPage(page);
    handleQuery();
  }

  /**
   * @description: 改变分页大小
   * @param {*} _
   * @param {*} size
   * @return {*}
   */
  function handleChangePageSize(_, size) {
    store.setPage(1);
    store.setPageSize(size);
    handleQuery();
  }
  return useObserver(() => (
    <Fragment>
      <Header title="图纸申请">
        <Button loading={store.application} color="primary" onClick={handleAppliceation}>
          申请
        </Button>
      </Header>
      <Content>
        <TableQueryFrom
          dataSet={store.tableDs.queryDataSet}
          onClickQueryCallback={() => handleQuery('button')}
          showNumber={4}
          queryLoading={store.queryLoading}
        >
          <Lov name="itemObject" noCache />
          <TextField name="designCode" />
          <Select name="applyFlag" />
          <Lov name="workerObj" noCache />
          <DateTimePicker name="applyTimeStart" />
          <DateTimePicker name="applyTimeEnd" />
        </TableQueryFrom>
        <Table
          columns={getColumns}
          bordered
          loading={store.queryLoading}
          dataSource={store.dataSource}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          pagination={{
            total: store.total,
            page: store.page,
            pageSize: store.pageSize,
            current: store.page,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100, 200, 300],
            onChange: handleChangePage,
            onShowSizeChange: handleChangePageSize,
          }}
        />
      </Content>
    </Fragment>
  ));
}
