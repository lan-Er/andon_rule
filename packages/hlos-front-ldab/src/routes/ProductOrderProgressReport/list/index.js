/*
 * @Description: 生产订单进度报表--list
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2020-11-05 11:05:22
 * @LastEditors: 那宇
 */

import React, { useEffect, useState } from 'react';
import {
  PerformanceTable,
  Lov,
  DateTimePicker,
  NumberField,
  Select,
  Form,
  Button,
  DataSet,
  Pagination,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';
import { statusRender } from 'hlos-front/lib/utils/renderer';
import { ListDS } from '@/stores/productOrderProgressReportDS';
import './index.less';

const preCode = 'ldab.productOrderProgressReport';
const commonCode = 'ldab.common.model';
const tableRef = React.createRef();

// const listDS = new DataSet(ListDS());

const ProductionTaskProgressReport = (props) => {
  const listDS = () =>
    new DataSet({
      ...ListDS(),
    });
  const ds = useDataSet(listDS, ProductionTaskProgressReport);
  const [showFlag, setShowFlag] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);

  useEffect(() => {
    async function queryDefaultOrg() {
      const res = await userSetting({
        defaultFlag: 'Y',
      });
      if (getResponse(res) && res && res.content && res.content[0]) {
        const { meOuId, meOuName } = res.content[0];
        ds.queryDataSet.current.set('organizationObj', {
          organizationId: meOuId,
          organizationName: meOuName,
        });
      }
    }
    queryDefaultOrg();
    calcTableHeight(0);
  }, []);

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('ldab-product-order-progress-report')[0];
    const queryContainer = document.getElementById('productOrderProgressReport');
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 75;
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

  const linkRender = ({ rowData, dataIndex }) => {
    return <a onClick={() => handleToDetailPage(rowData.moId)}>{rowData[dataIndex]}</a>;
  };

  const delayRender = ({ rowData, dataIndex }) => {
    return <span style={rowData[dataIndex] > 0 ? { color: 'red' } : {}}>{rowData[dataIndex]}</span>;
  };

  function Columns() {
    return [
      {
        title: intl.get(`${commonCode}.organzation`).d('组织'),
        dataIndex: 'ownerOrganizationName',
        key: 'ownerOrganizationName',
        width: 128,
        fixed: true,
        resizable: true,
        render: ({ rowData }) => {
          return `${rowData.ownerOrganizationCode || ''} ${rowData.ownerOrganizationName || ''}`;
        },
      },
      {
        title: intl.get(`${commonCode}.moNum`).d('MO号'),
        dataIndex: 'moNum',
        key: 'moNum',
        width: 128,
        fixed: true,
        resizable: true,
        render: linkRender,
      },
      {
        title: intl.get(`${commonCode}.item`).d('物料'),
        dataIndex: 'itemCode',
        key: 'itemCode',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        dataIndex: 'description',
        key: 'description',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.customer`).d('客户'),
        dataIndex: 'customerName',
        key: 'customerName',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.status`).d('状态'),
        dataIndex: 'moStatusMeaning',
        key: 'moStatusMeaning',
        width: 90,
        // render: ({ value, record }) => orderStatusRender(record.data.moStatus, value),
        render: ({ rowData, dataIndex }) => statusRender(rowData.moStatus, rowData[dataIndex]),
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.completedPercent`).d('完工进度'),
        dataIndex: 'completedPercent',
        key: 'completedPercent',
        width: 90,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.demandDate`).d('需求时间'),
        dataIndex: 'demandDate',
        key: 'demandDate',
        width: 144,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.delayDays`).d('延期天数'),
        dataIndex: 'delayDays',
        key: 'delayDays',
        width: 90,
        align: 'right',
        render: delayRender,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.uom`).d('单位'),
        dataIndex: 'uomName',
        key: 'uomName',
        width: 80,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.demandQty`).d('需求数量'),
        dataIndex: 'demandQty',
        key: 'demandQty',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.demandQty`).d('制造数量'),
        dataIndex: 'makeQty',
        key: 'makeQty',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.okQty`).d('合格数量'),
        dataIndex: 'completedQty',
        key: 'completedQty',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.ngQty`).d('不合格数量'),
        dataIndex: 'processNgQty',
        key: 'processNgQty',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.reworkQty`).d('返修数量'),
        dataIndex: 'reworkQty',
        key: 'reworkQty',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.scrappedQty`).d('报废数量'),
        dataIndex: 'scrappedQty',
        key: 'scrappedQty',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.pendingQty`).d('待定数量'),
        dataIndex: 'pendingQty',
        key: 'pendingQty',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.wipQty`).d('在制数量'),
        dataIndex: 'wipQty',
        key: 'wipQty',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inventoryQty`).d('入库数量'),
        dataIndex: 'inventoryQty',
        key: 'inventoryQty',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.suppliedQty`).d('已供应数量'),
        dataIndex: 'suppliedQty',
        key: 'suppliedQty',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.inputQty`).d('关键投入'),
        dataIndex: 'inputQty',
        key: 'inputQty',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.issuedQty`).d('投料套数'),
        dataIndex: 'issuedSuit',
        key: 'issuedSuit',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.maxIssuedQty`).d('最大投入'),
        dataIndex: 'maxIssuedQty',
        key: 'maxIssuedQty',
        width: 82,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.salesOrder`).d('销售订单'),
        dataIndex: 'so',
        key: 'so',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.demandOrder`).d('需求订单'),
        dataIndex: 'demandNum',
        key: 'demandNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.moType`).d('MO类型'),
        dataIndex: 'moTypeName',
        key: 'moTypeName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.itemCategory`).d('物料类别'),
        dataIndex: 'itemCategoryName',
        key: 'itemCategoryName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.promiseDate`).d('承诺时间'),
        dataIndex: 'promiseDate',
        key: 'promiseDate',
        width: 144,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.planStartTime`).d('计划开始时间'),
        dataIndex: 'planStartTime',
        key: 'planStartTime',
        width: 144,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.planEndTime`).d('计划结束时间'),
        dataIndex: 'planEndTime',
        key: 'planEndTime',
        width: 144,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.actualStartTime`).d('实际开始时间'),
        dataIndex: 'actualStartDate',
        key: 'actualStartDate',
        width: 144,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.actualEndTime`).d('实际结束时间'),
        dataIndex: 'actualEndDate',
        key: 'actualEndDate',
        width: 144,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.topMo`).d('顶层MO'),
        dataIndex: 'topMoNum',
        key: 'topMoNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.parentMo`).d('父MO'),
        dataIndex: 'parentMoNums',
        key: 'parentMoNums',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.moLevel`).d('MO层级'),
        dataIndex: 'moLevel',
        key: 'moLevel',
        width: 80,
        align: 'right',
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.prodline`).d('生产线'),
        dataIndex: 'prodline',
        key: 'prodline',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.workcell`).d('工位'),
        dataIndex: 'workcell',
        key: 'workcell',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.equipment`).d('设备'),
        dataIndex: 'equipment',
        key: 'equipment',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.location`).d('位置'),
        dataIndex: 'location',
        key: 'location',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.worker`).d('操作工'),
        dataIndex: 'worker',
        key: 'worker',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.workerGroup`).d('班组'),
        dataIndex: 'workerGroup',
        key: 'workerGroup',
        width: 128,
        resizable: true,
      },
    ];
  }

  function QueryField() {
    return [
      <Lov name="organizationObj" key="organizationObj" clearButton noCache />,
      <Lov name="itemObj" clearButton noCache />,
      <Lov name="customerObj" clearButton noCache />,
      <Select name="moStatus" noCache />,
      <Lov name="moTypeObj" clearButton noCache />,
      <Lov name="categoryObj" clearButton noCache />,
      <Lov name="moObj" clearButton noCache />,
      <Lov name="soObj" clearButton noCache />,
      <Lov name="demandObj" clearButton noCache />,
      <DateTimePicker name="demandDateStart" />,
      <DateTimePicker name="demandDateEnd" />,
      <NumberField name="delayDaysStart" />,
      <NumberField name="delayDaysEnd" />,
    ];
  }

  const handleToDetailPage = (val) => {
    props.history.push({
      pathname: `/ldab/production-order-progress-report/detail/${val}`,
      state: ds.current.toJSONData(),
    });
  };

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  function handleReset() {
    ds.queryDataSet.current.reset();
  }

  async function handleSearch(page = currentPage, pageSize = size) {
    const validateValue = await ds.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLoading(true);
    ds.queryDataSet.current.set('page', page - 1);
    ds.queryDataSet.current.set('size', pageSize);
    const res = await ds.query();
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
    }
    setShowLoading(false);
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
    handleSearch(pageValue, pageSizeValue);
  }

  return (
    <div className="ldab-product-order-progress">
      <Header title={intl.get(`${preCode}.view.title.index`).d('生产订单进度报表')} />
      <Content className="ldab-product-order-progress-report" id="productOrderProgressReportTable">
        <div id="productOrderProgressReport" className="header-query">
          <Form dataSet={ds.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? QueryField().slice(0, 4) : QueryField()}
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
            <Button onClick={handleToggle}>
              {!showFlag
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          data={dataSource}
          ref={tableRef}
          columns={Columns()}
          height={tableHeight}
          loading={showLoading}
        />
        <Pagination
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
      </Content>
    </div>
  );
};

export default formatterCollections({
  code: ['ldab.productionTaskProgressReport', 'ldab.common'],
})(ProductionTaskProgressReport);
