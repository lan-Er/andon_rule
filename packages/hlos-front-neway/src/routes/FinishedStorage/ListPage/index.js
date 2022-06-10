/**
 * 完工入库单- 列表
 * @since：2021/6/2
 * @author：jxy <xiaoyan.jin@hand-china.com>
 * @copyright Copyright (c) 2021,Hand
 */
import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import {
  DataSet,
  Button,
  Lov,
  Select,
  PerformanceTable,
  Form,
  CheckBox,
  Pagination,
} from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import axios from 'axios';
import notification from 'utils/notification';
import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';

import { finishedListDS } from '@/stores/FinishedStorageDS';
import './style.less';

const preCode = 'newway.finishedStorage';
const organizationId = getCurrentOrganizationId();

const FinishedStorageList = ({ history, dispatch, taskList, pagination }) => {
  const listDS = useDataSet(() => new DataSet(finishedListDS()), FinishedStorageList);
  const [dataSource, setDataSource] = useState([]);
  const [checkValues, setCheckValues] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [size, setSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableHeight, setTableHeight] = useState(80);

  useEffect(() => {
    const isQuery = sessionStorage.getItem('finishedStorageCreate') || false;
    if (!listDS.current) {
      setDefaultDSValue(listDS);
    } else if (location.pathname === '/neway/finished-storage/list' && isQuery) {
      handleSearch().then(() => {
        sessionStorage.removeItem('finishedStorageCreate');
      });
    } else {
      setDataSource(taskList);
      setTotalElements(pagination.totalElements || 0);
      setCurrentPage(pagination.currentPage || 1);
      setSize(pagination.size || 100);
      setTableHeight(pagination.tableHeight || 80);
      calcTableHeight(taskList.length);
    }
    return () => {
      sessionStorage.removeItem('finishedStorageCreate');
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      calcTableHeight(dataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource]);

  async function setDefaultDSValue(ds) {
    const res = await userSetting({ defaultFlag: 'Y' });
    if (res && res.content && res.content.length && ds.queryDataSet && ds.queryDataSet.current) {
      ds.queryDataSet.current.set('organizationLov', {
        meOuName: res.content[0].meOuName,
        meOuId: res.content[0].meOuId,
      });
      handleSearch();
    }
  }

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('newway-finished-storage-content')[0];
    const queryContainer = document.getElementById('finishedStorageQuery');
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 130;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight);
    }
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const validateValue = await listDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    handlePagination();
  }

  /**
   * 查询
   */
  async function handlePagination(page = currentPage, pageSize = size) {
    setListLoading(true);
    listDS.queryDataSet.current.set('page', page - 1);
    listDS.queryDataSet.current.set('size', pageSize);
    const result = await listDS.query();
    if (getResponse(result) && result.content) {
      setDataSource(result.content);
      setTotalElements(result.totalElements || 0);
      calcTableHeight(result.content.length);
      dispatch({
        type: 'finishedStorage/updateState',
        payload: {
          taskList: result.content,
          pagination: {
            currentPage: page,
            size: pageSize,
            totalElements: result.totalElements,
            tableHeight,
          },
        },
      });
    }
    // 清空勾选
    setCheckValues([]);
    setListLoading(false);
  }

  // 页码更改
  function handlePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setCurrentPage(pageValue);
    setSize(pageSizeValue);
    handlePagination(pageValue, pageSizeValue);
  }

  /**
   * 重置
   */
  function handleReset() {
    listDS.queryDataSet.current.reset();
  }

  /**
   * 打印单据
   */
  function handlePrint() {
    console.log('打印');
  }

  /**
   * 新建单据
   */
  function handleCreate() {
    history.push({
      pathname: `/neway/finished-storage/create`,
    });
  }

  /**
   * 取消单据
   */
  async function handleCancel() {
    const url = `${HLOS_LWMSS}/v1/${organizationId}/neway-product-wm/cancelNewayProductWm`;
    const rowKeys = checkValues.map((item) => {
      return item.requestId;
    });
    try {
      const res = await axios({
        url,
        method: 'PUT',
        data: { requestIds: rowKeys.join(',') },
      });
      if (res && !res.failed) {
        notification.success();
        handleSearch();
      } else {
        notification.error({ message: res.message });
      }
    } catch (error) {
      notification.error({ message: error.message });
    }
  }

  /**
   *table查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationLov" noCache key="organizationLov" />,
      <Lov name="shipInNumLov" noCache key="shipInNumLov" />,
      <Lov name="moNumLov" noCache key="moNumLov" />,
      <Select name="requestStatus" key="requestStatus" />,
    ];
  }

  // render buttons
  const renderFunctionButtons = () => (
    <Fragment>
      <Button color="primary" onClick={handleCreate}>
        {intl.get('hzero.common.button.create').d('新建')}
      </Button>
      <Button disabled={checkValues.length === 0} onClick={handlePrint}>
        打印
      </Button>
      <Button disabled={checkValues.length === 0} onClick={handleCancel}>
        {intl.get('hzero.common.button.cancel').d('取消')}
      </Button>
    </Fragment>
  );

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        onClick={(e) => {
          e.stopPropagation();
        }}
        value={rowData.requestId}
        checked={checkValues.findIndex((i) => i.requestId === rowData.requestId) !== -1}
        onChange={(val) => handleCheckboxChange(val, rowData)}
      />
    );
  }

  function handleCheckboxChange(value, rowData) {
    const newCheckValues = [...checkValues];
    if (value) {
      newCheckValues.push(rowData);
    } else {
      newCheckValues.splice(
        newCheckValues.findIndex((i) => i.requestId === rowData.requestId),
        1
      );
    }
    setCheckValues(newCheckValues);
  }

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
    } else {
      setCheckValues([]);
    }
  }

  const columns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={handleCheckAllChange}
        />
      ),
      dataIndex: 'requestId',
      key: 'requestId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) =>
        handleCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.meOu`).d('工厂'),
      dataIndex: 'organizationName',
      width: 128,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.requestNum`).d('入库单号'),
      dataIndex: 'requestNum',
      width: 144,
      fixed: 'left',
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.requestType`).d('入库单类型'),
      dataIndex: 'requestTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.requestStatus`).d('入库单状态'),
      dataIndex: 'requestStatus',
      width: 90,
      render: ({ rowData }) => statusRender(rowData.requestStatus, rowData.requestStatusMeaning),
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.moNum`).d('生产订单号'),
      dataIndex: 'moNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.item`).d('物料'),
      dataIndex: 'itemCode',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.itemDesc`).d('物料描述'),
      dataIndex: 'itemDescription',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocNum`).d('销售订单号'),
      dataIndex: 'sourceDocNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sourceDocLineNum`).d('销售订单行号'),
      dataIndex: 'sourceDocLineNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.applyQty`).d('入库数量'),
      dataIndex: 'applyQty',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.uomName`).d('单位'),
      dataIndex: 'uomName',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.tagCode`).d('序列号'),
      dataIndex: 'tagCode',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.completedWorkerCenter`).d('完工工位'),
      dataIndex: 'completedWorkerCenter',
      width: 70,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inWarehouse`).d('入库仓库'),
      dataIndex: 'inWarehouse',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.inWmArea`).d('入库库位'),
      dataIndex: 'inWmArea',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      dataIndex: 'printedFlag',
      width: 150,
      resizable: true,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.printedDate`).d('打印时间'),
      dataIndex: 'printedDate',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.creationDate`).d('制单时间'),
      dataIndex: 'creationDate',
      width: 150,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.creator`).d('制单人'),
      dataIndex: 'creator',
      width: 128,
      resizable: true,
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.finishedStorage`).d('完工入库单')}>
        {renderFunctionButtons()}
      </Header>
      <Content className="newway-finished-storage-content">
        <div
          style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}
          id="finishedStorageQuery"
        >
          <Form dataSet={listDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {queryFields()}
          </Form>
          <div
            style={{
              marginLeft: 8,
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.1rem 0',
            }}
          >
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          rowKey="requestId"
          data={dataSource}
          height={tableHeight}
          columns={columns}
          loading={listLoading}
        />
        <Pagination
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
      </Content>
    </Fragment>
  );
};

export default connect(({ finishedStorage }) => ({
  taskList: finishedStorage?.taskList || [],
  pagination: finishedStorage?.pagination || {},
}))(
  formatterCollections({
    code: [`${preCode}`],
  })(FinishedStorageList)
);
