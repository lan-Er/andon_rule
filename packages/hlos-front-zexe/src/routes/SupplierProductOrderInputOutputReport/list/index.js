import React, { Fragment, useState } from 'react';
import {
  DataSet,
  Button,
  Modal,
  Form,
  PerformanceTable,
  Lov,
  Select,
  NumberField,
  DatePicker,
  Pagination,
} from 'choerodon-ui/pro';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import ExcelExport from 'components/ExcelExport';
import { isUndefined } from 'lodash';
import { filterNullValueObject, getCurrentOrganizationId, getResponse } from 'utils/utils';
import { HLOS_ZEXE } from 'hlos-front/lib/utils/config';

import { ListDS } from '../store/SupplierProductOrderInputOutputReportDS';
import { searchInputration } from '@/services/supplierPOReportService';
import ItemDimension from './ItemSummaryModal';
import './style.less';

const commonCode = 'zexe.common.model';
const preCode = 'zexe.supplierProductOrderInputOutputReport';
const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZEXE}/v1/${organizationId}/report/mo-inputration-supplier`;

const SupplierProductOrderInputOutputReport = () => {
  const [showFlag, setShowFlag] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [size, setSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);

  const listDS = () =>
    new DataSet({
      ...ListDS(),
    });

  const ds = useDataSet(listDS);

  const openModal = React.useCallback(() => {
    Modal.open({
      key: Modal.key(),
      children: <ItemDimension ds={ds} />,
      footer: null,
      closable: true,
      style: { width: 1024, minHeight: 476, overflow: 'auto' },
      destroyOnClose: true,
    });
  }, [Modal]);

  // 导出参数
  function getExportQueryParams() {
    const formObj = ds && ds.queryDataSet && ds.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    const { moStatus: moStatusList } = fieldsValue;
    return {
      ...fieldsValue,
      moStatusList,
      moStatus: undefined,
    };
  }

  // 查询更多
  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  // 重置
  const handleReset = () => {
    ds.queryDataSet.current.reset();
  };

  // 查询
  const handleSearch = async (page = currentPage, pageSize = size) => {
    const validateValue = ds.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLoading(true);
    ds.queryDataSet.current.set('page', page - 1);
    ds.queryDataSet.current.set('size', pageSize);
    const res = await searchInputration(ds.queryDataSet.current.toJSONData());
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
    }
    setShowLoading(false);
  };

  const calcTableHeight = (dataLength) => {
    const pageContainer = document.getElementsByClassName('zexe-supplier-p-o-input-output')[0];
    const queryContainer = document.getElementById('supplierReportHeaderQuery');
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
  };

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

  // 查询头
  function QueryField() {
    return [
      <Lov name="moObj" />,
      <Lov name="itemObj" />,
      <Lov name="moTypeObj" />,
      <Lov name="ItemObject" />,
      <Select name="moStatus" />,
      <Lov name="customerObj" />,
      <NumberField name="minInputRatio" />,
      <NumberField name="maxInputRatio" />,
      <Lov name="organizationObj" />,
      <DatePicker name="minDemandDate" />,
      <DatePicker name="maxDemandDate" />,
      <DatePicker name="minReleasedDate" />,
      <DatePicker name="maxReleasedDate" />,
    ];
  }

  function columns() {
    return [
      {
        dataIndex: 'inputRatio',
        title: intl.get(`${preCode}.inputRation`).d('投入比'),
        fixed: true,
        resizable: true,
        render: ({ rowData }) =>
          rowData.inputRatio ? (
            <Fragment>{`${rowData.inputRatio}%`}</Fragment>
          ) : (
            <Fragment>0%</Fragment>
          ),
      },
      {
        dataIndex: 'ownerOrganizationCode',
        title: intl.get(`${commonCode}.organzation`).d('组织'),
        fixed: true,
        resizable: true,
      },
      {
        dataIndex: 'moNum',
        title: intl.get(`${commonCode}.moNum`).d('MO号'),
        fixed: true,
        resizable: true,
      },
      {
        dataIndex: 'itemCode',
        type: 'string',
        title: intl.get(`${preCode}.itemCode`).d('产出物料'),
        fixed: true,
        resizable: true,
      },
      {
        dataIndex: 'itemDescription',
        type: 'string',
        title: intl.get(`${preCode}.description`).d('产出物料描述'),
        fixed: true,
        resizable: true,
      },
      {
        dataIndex: 'moDemandQty',
        title: intl.get(`${preCode}.moDemandQty`).d('制造数量'),
        fixed: true,
        resizable: true,
      },
      {
        dataIndex: 'inventoryQty',
        type: 'string',
        title: intl.get(`${preCode}.inventoryQty`).d('完工入库数量'),
        fixed: true,
        resizable: true,
      },
      {
        dataIndex: 'moStatus',
        type: 'string',
        title: intl.get(`${preCode}.moStatus`).d('Mo状态'),
        resizable: true,
      },
      {
        dataIndex: 'moTypeCode',
        title: intl.get(`${preCode}.moType`).d('MO类型'),
        resizable: true,
      },
      {
        dataIndex: 'documentTypeName',
        title: intl.get(`${preCode}.moTypeDesc`).d('MO类型描述'),
        resizable: true,
      },
      {
        dataIndex: 'itemUom',
        title: intl.get(`${preCode}.itemUom`).d('物料单位'),
        resizable: true,
      },
      {
        dataIndex: 'inventoryWarehouseCode',
        title: intl.get(`${preCode}.inventoryWarehouseCode`).d('入库仓库'),
        resizable: true,
      },
      {
        dataIndex: 'inOrganizationDescription',
        title: intl.get(`${preCode}.inOrganizationDescription`).d('入库仓库描述'),
        resizable: true,
      },
      {
        dataIndex: 'demandDate',
        title: intl.get(`${preCode}.demandDate`).d('需求日期'),
        resizable: true,
      },
      {
        dataIndex: 'releasedDate',
        title: intl.get(`${preCode}.releasedDate`).d('下达日期'),
        resizable: true,
      },
      {
        dataIndex: 'lineNum',
        title: intl.get(`${preCode}.lineNum`).d('组件行号'),
        resizable: true,
      },
      {
        dataIndex: 'componentItemCode',
        title: intl.get(`${preCode}.componentItemCode`).d('组件物料编码'),
        resizable: true,
      },
      {
        dataIndex: 'moItemDescription',
        title: intl.get(`${preCode}.componentItemDescription`).d('组件物料描述'),
        resizable: true,
      },
      {
        dataIndex: 'componentUom',
        title: intl.get(`${preCode}.componentUom`).d('组件单位'),
        resizable: true,
      },
      {
        dataIndex: 'componentDemandQty',
        title: intl.get(`${preCode}.moDemandQty`).d('需求数量'),
        resizable: true,
      },
      {
        dataIndex: 'componentUsage',
        title: intl.get(`${preCode}.componentUsage`).d('单位用量'),
        resizable: true,
      },
      {
        dataIndex: 'issuedQty',
        title: intl.get(`${preCode}.issuedQty`).d('投料数量'),
        resizable: true,
      },
      {
        dataIndex: 'customerNumber',
        title: intl.get(`${commonCode}.customer`).d('客户'),
        resizable: true,
      },
      {
        dataIndex: 'externalId',
        title: intl.get(`${preCode}.externalId`).d('外部ID'),
        resizable: true,
      },
      {
        dataIndex: 'externalNum',
        title: intl.get(`${preCode}.externalNum`).d('外部编号'),
        resizable: true,
      },
      {
        dataIndex: 'organizationCode',
        title: intl.get(`${preCode}.organizationCode`).d('发料仓库'),
        resizable: true,
      },
      {
        dataIndex: 'outOrganizationDescription',
        title: intl.get(`${preCode}.outOrganizationDescription`).d('发料仓库描述'),
        resizable: true,
      },
      {
        dataIndex: 'issueControlType',
        title: intl.get(`${preCode}.issueControlType`).d('组件投料限制类型'),
        resizable: true,
      },
      {
        dataIndex: 'issueControlValue',
        title: intl.get(`${preCode}.issueControlValue`).d('组件投料限制值'),
        resizable: true,
      },
      {
        dataIndex: 'supplyType',
        title: intl.get(`${preCode}.supplyType`).d('组件供应类型'),
        resizable: true,
      },
      {
        dataIndex: 'substituteGroup',
        title: intl.get(`${preCode}.substituteGroup`).d('替代组'),
        resizable: true,
      },
    ];
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.index`).d('生产订单投入比报表')}>
        <ExcelExport
          buttonText="导出"
          requestUrl={`${url}/excel`}
          queryParams={getExportQueryParams}
          method="GET"
        />
        <Button onClick={openModal}>物料维度汇总</Button>
      </Header>
      <Content className="zexe-supplier-p-o-input-output">
        <div id="supplierReportHeaderQuery" className="header-query">
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
          columns={columns()}
          data={dataSource}
          height={tableHeight}
          loading={showLoading}
        />
        <Pagination
          pageSizeOptions={['10', '20', '50', '100', '200', '500']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
      </Content>
    </Fragment>
  );
};

export default formatterCollections({
  code: [
    'zexe.supplierProductOrderInputOutputReport',
    'zexe.purchaserProductOrderInputOutputReport',
    'zexe.common',
  ],
})(SupplierProductOrderInputOutputReport);
