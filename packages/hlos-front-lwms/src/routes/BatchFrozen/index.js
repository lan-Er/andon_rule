/*
 * @Description: 批次冻结
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-07-29 10:54:57
 */

import React, { Fragment, useState, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import {
  Button,
  DataSet,
  PerformanceTable,
  Pagination,
  Form,
  Lov,
  DatePicker,
  Select,
  TextField,
  CheckBox,
} from 'choerodon-ui/pro';
import notification from 'utils/notification';

import { queryLovData } from 'hlos-front/lib/services/api';
import { getResponse } from 'utils/utils';
import codeConfig from '@/common/codeConfig';
import { frozenLot, unFrozenLot } from '../../services/batchFrozenService';

import { BatchFrozenDS, lineTableDS } from '../../stores/batchFrozenDS';
import style from './index.less';

const { common } = codeConfig.code;

const headerDS = new DataSet(BatchFrozenDS());
const lineDS = new DataSet(lineTableDS());
const tableRef = React.createRef();

/**
 * 设置默认查询条件
 */
async function setDefaultDSValue(ds) {
  const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
  if (getResponse(res)) {
    if (
      res &&
      Array.isArray(res.content) &&
      res.content.length &&
      ds.queryDataSet &&
      ds.queryDataSet.current
    ) {
      ds.queryDataSet.current.set('organizationObj', {
        organizationId: res.content[0].organizationId,
        organizationCode: res.content[0].organizationCode,
        organizationName: res.content[0].organizationName,
      });
    }
  }
}

function BatchFrozen() {
  const [showFlag, setShowFlag] = useState(false);
  const [lotId, setLotId] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showLineLoading, setShowLineLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [lineDataSource, setLineDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lineCurrentPage, setLineCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [lineSize, setLineSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [lineTotalElements, setLineTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);
  const [lineTableHeight, setLineTableHeight] = useState(80);
  const [checkValues, setCheckValues] = useState([]);
  const [curRowData, setCurRowData] = useState({});

  useEffect(() => {
    headerDS.addEventListener('query', () => setLotId(null));
    if (!headerDS.current) {
      setDefaultDSValue(headerDS);
    }
    return () => {
      headerDS.removeEventListener('query');
    };
  }, []);

  const queryFields = () => {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Lov name="lotObj" noCache key="lotObj" />,
      <Select name="lotStatus" noCache key="lotStatus" />,
      <Lov name="sourceLotObj" noCache key="sourceLotObj" />,
      <Lov name="supplierObj" noCache key="supplierObj" />,
      <TextField name="supplierLotNumber" noCache key="supplierLotNumber" />,
      <DatePicker name="receivedDateLeft" />,
      <DatePicker name="receivedDateRight" />,
      <DatePicker name="expireDateLeft" />,
      <DatePicker name="expireDateRight" />,
    ];
  };

  const headerColumns = () => {
    return [
      {
        title: (
          <CheckBox
            name="controlled"
            checked={dataSource.length && checkValues.length === dataSource.length}
            onChange={handleCheckAllChange}
          />
        ),
        dataIndex: 'lotId',
        key: 'lotId',
        width: 50,
        fixed: true,
        render: ({ rowData, dataIndex, rowIndex }) => checkCell({ rowData, dataIndex, rowIndex }),
      },
      { title: '组织', resizable: true, dataIndex: 'organizationName', width: 128, fixed: true },
      {
        title: '物料描述',
        resizable: true,
        dataIndex: 'itemDescription',
        width: 200,
        fixed: true,
        render: ({ rowData }) =>
          rowData.itemCode && rowData.itemDescription
            ? `${rowData.itemCode}_${rowData.itemDescription}`
            : rowData.itemDescription || rowData.itemCode,
      },
      { title: '批次', resizable: true, dataIndex: 'lotNumber', width: 128, fixed: true },
      { title: '初始数量', resizable: true, dataIndex: 'initialQty', width: 82 },
      {
        title: '单位',
        resizable: true,
        dataIndex: 'uom',
        width: 82,
      },
      {
        title: '批次类型',
        resizable: true,
        dataIndex: 'lotTypeMeaning',
        width: 128,
      },
      {
        title: '批次状态',
        resizable: true,
        dataIndex: 'lotStatusMeaning',
        width: 90,
      },
      {
        title: '来源批次',
        resizable: true,
        dataIndex: 'sourceLotNumber',
        width: 128,
      },
      {
        title: '父批次',
        resizable: true,
        dataIndex: 'parentLotNumber',
        width: 128,
      },
      {
        title: '接收日期',
        resizable: true,
        dataIndex: 'receivedDate',
        width: 144,
      },
      {
        title: '生产日期',
        resizable: true,
        dataIndex: 'madeDate',
        width: 144,
      },
      {
        title: '失效日期',
        resizable: true,
        dataIndex: 'expireDate',
        width: 144,
      },
      {
        title: '供应商',
        resizable: true,
        dataIndex: 'supplierName',
        width: 128,
      },
      {
        title: '供应商批次',
        resizable: true,
        dataIndex: 'supplierLotNumber',
        width: 128,
      },
      {
        title: '材质',
        resizable: true,
        dataIndex: 'material',
        width: 128,
      },
      {
        title: '材料供应商',
        resizable: true,
        dataIndex: 'materialSupplier',
        width: 128,
      },
      {
        title: '材料批次',
        resizable: true,
        dataIndex: 'materialLotNumber',
        width: 128,
      },
      {
        title: '制造商',
        resizable: true,
        dataIndex: 'manufacturer',
        width: 128,
      },
      {
        title: '特征值类型',
        resizable: true,
        dataIndex: 'featureType',
        width: 128,
      },
      {
        title: '特征值',
        resizable: true,
        dataIndex: 'featureValue',
        width: 128,
      },
      {
        title: '备注',
        resizable: true,
        dataIndex: 'remark',
        width: 200,
      },
    ];
  };

  const lineColumns = () => {
    return [
      {
        title: '组织',
        resizable: true,
        dataIndex: 'organizationName',
        width: 128,
        fixed: true,
      },
      {
        title: '物料',
        resizable: true,
        dataIndex: 'itemCode',
        width: 200,
        fixed: true,
        render: ({ rowData }) =>
          rowData.itemDescription && rowData.itemCode
            ? `${rowData.itemCode}_${rowData.itemDescription}`
            : rowData.itemDescription || rowData.itemCode,
      },
      {
        title: '批次',
        resizable: true,
        dataIndex: 'lotNumber',
        width: 128,
        fixed: true,
      },
      {
        title: '现有量',
        resizable: true,
        dataIndex: 'onhandQty',
        width: 82,
      },
      {
        title: '单位',
        resizable: true,
        dataIndex: 'uomName',
        width: 82,
      },
      {
        title: '仓库',
        resizable: true,
        dataIndex: 'warehouseName',
        width: 128,
      },
      {
        title: '货位',
        resizable: true,
        dataIndex: 'wmAreaName',
        width: 128,
      },
      {
        title: '货格',
        resizable: true,
        dataIndex: 'wmUnit',
        width: 128,
      },
      {
        title: '接收日期',
        resizable: true,
        dataIndex: 'receivedDate',
        width: 144,
      },
      {
        title: '失效日期',
        resizable: true,
        dataIndex: 'expireDate',
        width: 144,
      },
    ];
  };

  const handleFrozen = () => {
    submit('frozen');
  };

  const handleUnfrozen = () => {
    submit('unFrozen');
  };

  const submit = async (type) => {
    if (!checkValues.length) {
      notification.error({
        message: '请至少选择一条数据',
      });
      return;
    }
    const params = checkValues.map((v) => ({ lotId: v }));
    let res = null;
    if (type === 'frozen') {
      res = await frozenLot(params);
    } else {
      res = await unFrozenLot(params);
    }
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '提交成功',
      });
      handleSearch();
    }
  };

  const handleSearch = async (page = currentPage, pageSize = size) => {
    const validateValue = await headerDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLoading(true);
    headerDS.queryDataSet.current.set('page', page - 1);
    headerDS.queryDataSet.current.set('size', pageSize);
    const res = await headerDS.query();
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
      setCurrentPage(1);
      setLotId(null);
      setItemId(null);
    }
    setShowLoading(false);
  };

  const handleLineSearch = async (page = currentPage, pageSize = size, rowData = curRowData) => {
    setShowLineLoading(true);
    const params = {
      lotId: rowData.lotId,
      itemId: rowData.itemId,
      page: page - 1,
      size: pageSize,
    };
    lineDS.queryParameter = params;
    const res = await lineDS.query();
    if (getResponse(res) && res.content) {
      setInProgress(false);
      setLineDataSource(res.content);
      setLineTotalElements(res.totalElements || 0);
      calcLineTableHeight(res.content.length);
      calcTableHeight(dataSource.length);
    }
    setShowLineLoading(false);
  };

  const handleCheckAllChange = (value) => {
    if (value) {
      setCheckValues(dataSource.map((i) => i.lotId));
    } else {
      setCheckValues([]);
    }
  };

  const checkCell = ({ rowData, rowIndex }) => {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.lotId}
        checked={checkValues.indexOf(rowData.lotId) !== -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={() => handleCheckBoxChange(rowData)}
      />
    );
  };

  const handleCheckBoxChange = (rowData) => {
    const _checkValues = checkValues.slice();
    if (_checkValues.indexOf(rowData.lotId) === -1) {
      _checkValues.push(rowData.lotId);
    } else {
      _checkValues.splice(_checkValues.indexOf(rowData.lotId), 1);
    }
    setCheckValues(_checkValues);
  };

  const handleHeadRowClick = (rowData) => {
    if (!inProgress) {
      setInProgress(true);
      setLotId(rowData.lotId);
      setItemId(rowData.itemId);
      setCurRowData(rowData);
      handleLineSearch(lineCurrentPage, lineSize, rowData);
    }
  };

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  const handleReset = () => {
    headerDS.queryDataSet.reset();
  };

  const calcTableHeight = (dataLength) => {
    const pageContainer = document.getElementsByClassName(style['lwms-batch-frozen'])[0];
    const queryContainer = document.getElementsByClassName(style['lwms-batch-frozen-query'])[0];
    const lineContent = document.getElementsByClassName(style['lwms-batch-frozen-line'])[0];
    // 两个数字说明 56 - content区域margin+padding; 32 - 页码
    const maxTableHeight =
      pageContainer.offsetHeight -
      queryContainer.offsetHeight -
      lineContent.offsetHeight -
      92 -
      (lineContent.offsetHeight && 40);
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight < 80 ? 80 : maxTableHeight);
    }
  };

  const calcLineTableHeight = (dataLength) => {
    const maxTableHeight = 3 * 30 + 33 + 10;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setLineTableHeight(80);
    } else if (dataLength <= 3) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setLineTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setLineTableHeight(maxTableHeight);
    }
  };

  // 头页码更改
  const handlePageChange = (page, pageSize) => {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setCurrentPage(pageValue);
    setSize(pageSizeValue);
    handleSearch(pageValue, pageSizeValue);
  };

  // 行页码更改
  const handleLinePageChange = (page, pageSize) => {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setLineCurrentPage(pageValue);
    setLineSize(pageSizeValue);
    handleLineSearch(pageValue, pageSizeValue);
  };

  return (
    <Fragment>
      <Header>
        <Button color="primary" onClick={handleFrozen}>
          冻结
        </Button>
        <Button color="primary" onClick={handleUnfrozen}>
          解冻
        </Button>
      </Header>
      <Content className={style['lwms-batch-frozen']}>
        <div className={style['lwms-batch-frozen-query']}>
          <Form dataSet={headerDS.queryDataSet} columns={4}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              marginLeft: 8,
              marginTop: 10,
            }}
          >
            <Button onClick={handleToggle}>{!showFlag ? '更多查询' : '收起查询'}</Button>
            <Button onClick={handleReset}>重置</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              查询
            </Button>
          </div>
        </div>
        <div>
          <PerformanceTable
            virtualized
            rowKey="lotId"
            data={dataSource}
            ref={tableRef}
            columns={headerColumns()}
            height={tableHeight}
            loading={showLoading}
            onRowClick={handleHeadRowClick}
          />
          <Pagination
            pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
            total={totalElements}
            onChange={handlePageChange}
            pageSize={size}
            page={currentPage}
          />
        </div>
        <div className={style['lwms-batch-frozen-line']}>
          {lotId && itemId && (
            <>
              <PerformanceTable
                virtualized
                data={lineDataSource}
                ref={tableRef}
                columns={lineColumns()}
                height={lineTableHeight}
                loading={showLineLoading}
              />
              <Pagination
                pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
                total={lineTotalElements}
                onChange={handleLinePageChange}
                pageSize={lineSize}
                page={lineCurrentPage}
              />
            </>
          )}
        </div>
      </Content>
    </Fragment>
  );
}

export default BatchFrozen;
