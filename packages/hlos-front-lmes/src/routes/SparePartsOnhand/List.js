/**
 * @Description: 备件现有量List
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-06-04 13:45:47
 * @LastEditors: yu.na
 */

import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  Form,
  Lov,
  NumberField,
  Button,
  PerformanceTable,
  Pagination,
  TextField,
  DatePicker,
  Select,
} from 'choerodon-ui/pro';
import queryString from 'query-string';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';
import { openTab } from 'utils/menuTab';
import { Button as HButton } from 'hzero-ui';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { userSetting } from '@/services/api';
import statusConfig from '@/common/statusConfig';

import Store from '@/stores/sparePartsOnhandDS';
import './index.less';

const {
  importTemplateCode: { sparePartsOnhand },
} = statusConfig.statusValue.lmes;

const preCode = 'lmes.sparePartsOnhand.model';
const spareCode = 'lmes.sparePartsOnhand';
const commonCode = 'lmes.common.model';
const tId = getCurrentOrganizationId();

export default () => {
  const { listDS } = useContext(Store);
  const [showFlag, setShowFlag] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);

  useEffect(() => {
    async function queryDefaultOrg() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (getResponse(res) && res.content && res.content[0]) {
        const { meOuId, meOuName } = res.content[0];
        listDS.queryDataSet.current.set('organizationObj', {
          organizationId: meOuId,
          organizationName: meOuName,
        });
      }
    }
    queryDefaultOrg();
  }, [listDS]);

  useEffect(() => {
    function handleResize() {
      calcTableHeight(dataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource]);

  function queryFields() {
    return [
      <Lov
        name="organizationObj"
        clearButton
        noCache
        onChange={() => {
          listDS.queryDataSet.current.set('sparePartsObj', {});
          listDS.queryDataSet.current.set('prodLineObj', {});
          listDS.queryDataSet.current.set('equipmentObj', {});
          listDS.queryDataSet.current.set('workcellObj', {});
          listDS.queryDataSet.current.set('warehouseObj', {});
          listDS.queryDataSet.current.set('wmAreaObj', {});
          listDS.queryDataSet.current.set('resourceObj', {});
        }}
      />,
      <Lov name="sparePartsObj" clearButton noCache />,
      <Lov
        name="warehouseObj"
        clearButton
        noCache
        onChange={() => {
          listDS.queryDataSet.current.set('wmAreaObj', {});
        }}
      />,
      <Lov name="wmAreaObj" clearButton noCache />,
      <Lov name="prodLineObj" clearButton noCache />,
      <Lov name="equipmentObj" clearButton noCache />,
      <Lov name="workcellObj" clearButton noCache />,
      <Lov name="locationObj" clearButton noCache />,
      <TextField name="outsideLocation" clearButton noCache />,
      <Select name="sparePartType" />,
      <Lov name="categoryObj" clearButton noCache />,
      <TextField name="lotNumber" />,
      <DatePicker name="receivedDateStart" />,
      <DatePicker name="receivedDateEnd" />,
      <DatePicker name="expireDateStart" />,
      <DatePicker name="expireDateEnd" />,
      <NumberField
        name="minQuantity"
        onFocus={() => {
          if (listDS.queryDataSet.current.get('minQuantity') === 0) {
            listDS.queryDataSet.current.set('minQuantity', '');
          }
        }}
      />,
      <NumberField name="maxQuantity" />,
    ];
  }
  /**
   *table列
   * @returns
   */
  function columns() {
    return [
      {
        title: intl.get(`${commonCode}.org`).d('组织'),
        dataIndex: 'organization',
        width: 128,
        resizable: true,
        fixed: true,
      },
      {
        title: intl.get(`${preCode}.spareParts`).d('备件'),
        dataIndex: 'sparePart',
        width: 144,
        resizable: true,
        fixed: true,
        render: ({ rowData }) => `${rowData.sparePartCode || ''} ${rowData.sparePartName || ''}`,
      },
      {
        title: intl.get(`${commonCode}.warehouse`).d('仓库'),
        dataIndex: 'warehouse',
        resizable: true,
        width: 200,
        render: ({ rowData }) => `${rowData.warehouseCode || ''} ${rowData.warehouseName || ''}`,
      },
      {
        title: intl.get(`${commonCode}.wmArea`).d('货位'),
        dataIndex: 'wmArea',
        resizable: true,
        width: 200,
        render: ({ rowData }) => `${rowData.wmAreaCode || ''} ${rowData.wmAreaName || ''}`,
      },
      {
        title: intl.get(`${commonCode}.wmUnit`).d('货格'),
        dataIndex: 'wmUnit',
        resizable: true,
        width: 200,
        render: ({ rowData }) => `${rowData.wmUnitCode || ''} ${rowData.wmUnitName || ''}`,
      },
      {
        title: intl.get(`${commonCode}.lot`).d('批次'),
        dataIndex: 'resourceLot',
        resizable: true,
        width: 128,
      },
      {
        title: intl.get(`${preCode}.quantity`).d('现有量'),
        dataIndex: 'quantity',
        resizable: true,
        width: 82,
      },
      {
        title: intl.get(`${commonCode}.uom`).d('单位'),
        dataIndex: 'uomName',
        resizable: true,
        width: 70,
      },
      {
        title: intl.get(`${preCode}.safetyStock`).d('安全库存'),
        dataIndex: 'safetyStockQty',
        resizable: true,
        width: 82,
      },
      {
        title: intl.get(`${preCode}.minStockQty`).d('最小库存量'),
        dataIndex: 'minStockQty',
        resizable: true,
        width: 82,
      },
      {
        title: intl.get(`${preCode}.maxStockQty`).d('最大库存量'),
        dataIndex: 'maxStockQty',
        resizable: true,
        width: 82,
      },
      {
        title: intl.get(`${preCode}.receivedDate`).d('接收日期'),
        dataIndex: 'receivedDate',
        resizable: true,
        width: 100,
      },
      {
        title: intl.get(`${preCode}.expireDate`).d('失效日期'),
        dataIndex: 'expireDate',
        resizable: true,
        width: 100,
      },
      {
        title: intl.get(`${commonCode}.prodLine`).d('生产线'),
        dataIndex: 'prodLineName',
        resizable: true,
        width: 200,
      },
      {
        title: intl.get(`${commonCode}.equipment`).d('设备'),
        dataIndex: 'equipmentName',
        resizable: true,
        width: 200,
      },
      {
        title: intl.get(`${preCode}.workcell`).d('工位'),
        dataIndex: 'workcellName',
        resizable: true,
        width: 200,
      },
      {
        title: intl.get(`${preCode}.location`).d('地点'),
        dataIndex: 'location',
        resizable: true,
        width: 200,
        render: ({ rowData }) => `${rowData.locationCode || ''} ${rowData.locationName || ''}`,
      },
      {
        title: intl.get(`${preCode}.outsideLocation`).d('外部地点'),
        dataIndex: 'outsideLocation',
        resizable: true,
        width: 200,
      },
      {
        title: intl.get(`${preCode}.category`).d('分类'),
        dataIndex: 'sparePartCategoryName',
        resizable: true,
        width: 84,
      },
      {
        title: intl.get(`${preCode}.type`).d('类型'),
        dataIndex: 'sparePartTypeMeaning',
        resizable: true,
        width: 84,
      },
      {
        title: intl.get(`${preCode}.group`).d('分组'),
        dataIndex: 'sparePartGroup',
        resizable: true,
        width: 128,
      },
      {
        title: intl.get(`${preCode}.picture`).d('图片'),
        dataIndex: 'fileUrl',
        width: 150,
        render: ({ rowData }) => {
          return (
            <a
              onClick={() => {
                window.open(rowData.fileUrl);
              }}
            >
              {rowData.fileUrl}
            </a>
          );
        },
      },
    ];
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = listDS.queryDataSet.current;
    const fieldsValue = !formObj ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  /**
   * 导入
   */
  function handleBatchImport() {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/${sparePartsOnhand}`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: '导入', // intl.get('hzero.common.button.import').d('导入'),
      search: queryString.stringify({
        action: '导入', // intl.get('hzero.common.button.import').d('导入'),
      }),
    });
  }

  function handleReset() {
    listDS.queryDataSet.current.reset();
  }

  async function handleSearch(page = currentPage, pageSize = size, flag) {
    const validateValue = await listDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    if (flag) {
      setCurrentPage(1);
      setSize(100);
    }
    setShowLoading(true);
    listDS.queryDataSet.current.set('page', flag ? 0 : page - 1);
    listDS.queryDataSet.current.set('size', flag ? 100 : pageSize);
    const res = await listDS.query();
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
    }
    setShowLoading(false);
  }

  // 计算表格高度
  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lmes-sparepart-onhand-content')[0];
    const queryContainer = document.getElementsByClassName('lmes-sparepart-onhand-query')[0];
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 40;
    if (dataLength === 0 || maxTableHeight < 80) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight);
    }
  }

  // 更多查询
  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
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

  return (
    <Fragment>
      <Header title={intl.get(`${spareCode}.view.title.sparePartsOnhand`).d('备件现有量')}>
        <ExcelExport
          requestUrl={`${HLOS_LMDS}/v1/${tId}/spare-parts/export-excel`}
          queryParams={getExportQueryParams}
        />
        <HButton icon="download" onClick={handleBatchImport}>
          {intl.get('hzero.common.button.import').d('导入')}
        </HButton>
      </Header>
      <Content>
        <div className="lmes-sparepart-onhand-content">
          <div className="lmes-sparepart-onhand-query">
            <Form dataSet={listDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
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
              <Button onClick={handleToggle}>
                {!showFlag
                  ? intl.get('hzero.common.button.viewMore').d('更多查询')
                  : intl.get('hzero.common.button.collected').d('收起查询')}
              </Button>
              <Button onClick={handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => handleSearch(1, 100, true)}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <PerformanceTable
            virtualized
            data={dataSource}
            columns={columns()}
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
          {/* <Table
            dataSet={listDS}
            columns={columns()}
            border={false}
            columnResizable="true"
            editMode="inline"
            queryFields={queryFields()}
            queryFieldsLimit={4}
          /> */}
        </div>
      </Content>
    </Fragment>
  );
};
