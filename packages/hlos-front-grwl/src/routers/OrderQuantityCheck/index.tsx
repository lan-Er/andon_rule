/*
 * @module: 订单数据检查
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-12 10:58:03
 * @LastEditTime: 2021-06-08 10:12:34
 * @copyright: Copyright (c) 2020,Hand
 */
import { connect } from 'dva';
import { Table } from 'hzero-ui';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Button, DataSet, TextField, Lov, DateTimePicker, Select, Tooltip } from 'choerodon-ui/pro';

import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import ReactToPrint from 'hlos-front/lib/components/PrintElement';

import formDs from './store/index';
import style from './index.module.less';
import { useDataSet, useClearDataSet } from '../../utils/hook';
import ItemPrint from '../../components/ItemPrint';
import TableQueryFrom from '../../components/TableQueryFrom';

type ExaminationSoLineId = {
  soLineId: string;
};
const tableListData = new Map();
function OrderQuantityCheck({ dispatch, history }) {
  const printNode = useRef(null);
  const tableForm: any = useDataSet(() => new DataSet({ ...formDs() }), 'OrderQuantityCheck');
  const [queryLoading, setQeuryLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [itemPrintLoading, setItemPrintLoading] = useState(false);
  const [itemPrintList, setItemPrintList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [current, setCurrent] = useState(1);
  const getColumns = useMemo(() => {
    return [
      { dataIndex: 'soNum', title: '单据号', width: 130, lock: true, algin: 'center' },
      { dataIndex: 'soLineNum', title: '单据行号', width: 128, lock: true, algin: 'center' },
      { dataIndex: 'soLineStatusMeaning', title: '单据状态', algin: 'center', width: 100 },
      { dataIndex: 'itemCode', title: '物料编码', algin: 'center', width: 130 },
      {
        dataIndex: 'itemDescription',
        title: '物料描述',
        algin: 'center',
        width: 200,
        render: (text: {} | null | undefined) => (
          <Tooltip title={text} placement="topLeft">
            {text}
          </Tooltip>
        ),
      },
      { dataIndex: 'featureDesc', title: '特性值描述', algin: 'center', width: 200 },
      {
        dataIndex: 'itemQrCodePrintedFlag',
        title: '是否打印',
        algin: 'center',
        width: 100,
        render: (value) => (value === '是' ? '是' : '否'),
      },
      { dataIndex: 'demandQty', title: '需求数量', algin: 'center', width: 120 },
      { dataIndex: 'itemTypeMeaning', title: '物料类型', algin: 'center', width: 100 },
      { dataIndex: 'customerPo', title: '客户PO', algin: 'center', width: 100 },
      { dataIndex: 'customerPoLine', title: '客户PO行', algin: 'center', width: 128 },
      { dataIndex: 'customerName', title: '客户', algin: 'center', width: 160 },
    ];
  }, []);

  useEffect(() => {
    if (tableListData && tableListData.has('OrderQuantityCheck')) {
      const tableData = tableListData.get('OrderQuantityCheck');
      const { content, totalElements, size, number } = tableData;
      setTableList(content);
      setTotal(totalElements);
      setPageSize(size);
      setCurrent(number + 1);
    }
  }, []);

  useEffect(() => {
    return () => {
      const {
        location: { pathname = '' },
      } = history;
      if (pathname === '/grwl/order-quantity-check/list') {
        // if (tableForm && tableForm.current) {
        //   tableForm.records.clear();
        //   tableForm.setQueryParameter('page', 0);
        //   tableForm.setQueryParameter('pageSize', 20);
        // }
        // if (tableForm && tableForm.queryDataSet) {
        //   tableForm.queryDataSet.reset();
        // }
        if (tableForm && tableForm.current) {
          useClearDataSet('OrderQuantityCheck');
        }
        sessionStorage.removeItem('orderQuantitySoLineIdList');
      }
    };
  }, []);

  /**
   * @description: 查询
   * @param {*}
   * @return {*}
   */
  function handleQuery(clickQeury: boolean = true): void {
    setQeuryLoading(true);
    if (clickQeury) {
      tableForm.setQueryParameter('page', 0);
      tableForm.setQueryParameter('pageSize', 20);
    }
    console.log('tableForm==', tableForm.queryDataSet.current.data);
    tableForm
      .query()
      .then((res) => {
        if (res && res.content) {
          const { content, totalElements, size, number } = res;
          setTableList(content);
          setTotal(totalElements);
          setPageSize(size);
          setCurrent(number + 1);
          tableListData.set('OrderQuantityCheck', { content, totalElements, size, number });
        }
        setQeuryLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setQeuryLoading(false);
      });
  }

  const rowSelection: object = {
    onChange: (_, row: any) => {
      setSelectedRows(row);
    },
  };

  /**
   * @description: 检查操作
   * @param {*}
   * @return {*}
   */
  function handleExamination(): void {
    if (selectedRows && selectedRows.length <= 0) {
      notification.warning({ message: '请至少选择一行数据' });
    } else {
      const soLineIdList: string[] = selectedRows.map((item: ExaminationSoLineId) => item.soLineId);
      sessionStorage.setItem('orderQuantitySoLineIdList', JSON.stringify(soLineIdList));
      history.push('/grwl/order-quantity-check/examination');
    }
  }

  /**
   * @description: 打印
   * @param {*}
   * @return {*}
   */
  function handleItemPrint() {
    if (selectedRows && selectedRows.length <= 0) {
      notification.warning({ message: '至少选择一行数据' });
      return;
    }
    const soLineIdList = selectedRows.map((item: ExaminationSoLineId) => item.soLineId);
    setItemPrintLoading(true);
    dispatch({
      type: 'orderQuantityCheckModel/handleItemPrint',
      payload: soLineIdList,
    })
      .then((res) => {
        if (res && res.length > 0) {
          setItemPrintList(res);
          ReactToPrint({ content: printNode.current });
        } else {
          notification.warning({ message: '选择数据暂无打印信息' });
        }
        setItemPrintLoading(false);
      })
      .catch((err) => {
        setItemPrintLoading(false);
        console.log(err);
      });
  }

  /**
   * @description: 改变分页触发查询
   * @param {number} page
   * @param {number} pageSizes
   * @return {*}
   */
  function handleChangePage(page: number, pageSizes?: number): void {
    tableForm.setQueryParameter('page', page - 1);
    tableForm.setQueryParameter('size', pageSizes || pageSize);
    handleQuery(false);
  }

  /**
   * @description: 改变分页大小触发查询
   * @param {number} currents
   * @param {number} pageSizes
   * @return {*}
   */
  function handleChangePageSize(currents: number, pageSizes?: number): void {
    if (currents * pageSize >= total) {
      tableForm.setQueryParameter('page', 0);
    } else {
      tableForm.setQueryParameter('page', currents - 1);
    }
    tableForm.setQueryParameter('size', pageSizes || pageSize);
    handleQuery(false);
  }
  return (
    <Fragment>
      <Header title="订单数据检查">
        <Button onClick={handleExamination}>检查</Button>
        <Button onClick={handleItemPrint} loading={itemPrintLoading}>
          物料打印
        </Button>
      </Header>
      <Content>
        <TableQueryFrom
          dataSet={tableForm.queryDataSet}
          onClickQueryCallback={handleQuery}
          queryLoading={queryLoading}
          showNumber={4}
        >
          <TextField name="soNum" />
          <Select name="soLineStatusList" />
          <Lov name="itemObject" noCache />
          <DateTimePicker name="creationDateStart" />
          <DateTimePicker name="creationDateEnd" />
          <DateTimePicker name="demandDateStart" />
          <DateTimePicker name="demandDateEnd" />
          <TextField name="customerPo" />
          <Lov name="customerObject" noCache />
          <Select name="itemQrCodePrintedFlag" />
        </TableQueryFrom>
        <Table
          key="1"
          columns={getColumns}
          dataSource={tableList}
          loading={queryLoading}
          bordered
          rowSelection={rowSelection}
          pagination={{
            total,
            pageSize,
            current,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: handleChangePage,
            onShowSizeChange: handleChangePageSize,
            hideOnSinglePage: true,
          }}
        />
      </Content>
      <div ref={printNode} className={style['ship-plat-form-item-print']}>
        <ItemPrint itemPrintList={itemPrintList} />
      </div>
    </Fragment>
  );
}
export default connect()(OrderQuantityCheck);
