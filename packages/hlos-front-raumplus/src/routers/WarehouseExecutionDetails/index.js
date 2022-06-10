/**
 * @Description:仓库执行明细管理信息--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-05 14:47:41
 * @LastEditors: leying.yan
 */
import React, { useEffect, useState } from 'react';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { WarehouseExecutionDS } from '@/stores/warehouseExecutionDetailsDS';
import { executeLines } from '@/services/warehouseExecutionDetailService';
import {
  PerformanceTable,
  Lov,
  DataSet,
  Pagination,
  Form,
  Button,
  DateTimePicker,
  TextField,
  Select,
} from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { userSetting } from 'hlos-front/lib/services/api';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import './index.less';

const warehouseExecutionCode = 'lwms.warsehouseExecution';
const preCode = 'lwms.warsehouseExecution.model';
const commonCode = 'lwms.common.model';
const hds = new DataSet(WarehouseExecutionDS());
const tId = getCurrentOrganizationId();
const tableRef = React.createRef();

function WarehouseExecution() {
  const [showFlag, setShowFlag] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);

  useEffect(() => {
    async function queryUserSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const { organizationId, organizationName } = res.content[0];
        if (organizationId) {
          hds.queryDataSet.current.set('organizationObj', {
            organizationId,
            organizationName,
          });
        }
      }
    }
    queryUserSetting();
    calcTableHeight(0);
  }, []);

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lwms-warehouse-execution-detail')[0];
    const queryContainer = document.getElementById('warehouseExecutionHeaderQuery');
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

  function Columns() {
    return [
      {
        title: intl.get(`${commonCode}.org`).d('组织'),
        dataIndex: 'organization',
        key: 'organization',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: '执行明细ID',
        dataIndex: 'executeLineId',
        width: 148,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.documentType`).d('单据类型'),
        dataIndex: 'documentTypeName',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.documentNum`).d('单据号'),
        dataIndex: 'documentNum',
        width: 128,
        fixed: true,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.documentLineNum`).d('单据行号'),
        dataIndex: 'documentLineNum',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.executeType`).d('执行类型'),
        dataIndex: 'executeTypeMeaning',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.executeTime`).d('执行时间'),
        dataIndex: 'executedTime',
        width: 136,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.item`).d('物料'),
        dataIndex: 'itemCode',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
        dataIndex: 'description',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.uom`).d('单位'),
        dataIndex: 'uomName',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.executedQty`).d('执行数量'),
        dataIndex: 'executedQty',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.lot`).d('批次'),
        dataIndex: 'lotNumber',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.tag`).d('标签'),
        dataIndex: 'tagCode',
        width: 128,
        resizable: true,
      },
      // {
      //   title: intl.get(`${commonCode}.warehouse`).d('仓库'),
      //   dataIndex: 'warehouse',
      //   width: 128,
      //   resizable: true,
      // },
      {
        title: intl.get(`${commonCode}.warehouseCode`).d('仓库编码'),
        dataIndex: 'warehouseCode',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.warehouseName`).d('仓库名称'),
        dataIndex: 'warehouseName',
        width: 128,
        resizable: true,
      },
      // {
      //   title: intl.get(`${commonCode}.wmArea`).d('货位'),
      //   dataIndex: 'wmArea',
      //   width: 128,
      //   resizable: true,
      // },
      {
        title: intl.get(`${commonCode}.wmAreaCode`).d('货位编码'),
        dataIndex: 'wmAreaCode',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.wmUnit`).d('货格'),
        dataIndex: 'wmUnit',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.workcell`).d('工位'),
        dataIndex: 'workcellName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.location`).d('地点'),
        dataIndex: 'locationName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.toOrganization`).d('目标组织'),
        dataIndex: 'toOrganization',
        width: 128,
        resizable: true,
        // render: ({ value, record }) => formatToOrganization(record.data, value),
      },
      {
        title: intl.get(`${preCode}.toWarehouse`).d('目标仓库'),
        dataIndex: 'toWarehouse',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.toWmArea`).d('目标货位'),
        dataIndex: 'toWmArea',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.toWmUnit`).d('目标货格'),
        dataIndex: 'toWmUnit',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.toWorkcell`).d('目标工位'),
        dataIndex: 'toWorkcellName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.toLocation`).d('目标地点'),
        dataIndex: 'toLocationName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.ownerType`).d('所有者类型'),
        dataIndex: 'ownerType',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.owner`).d('所有者'),
        dataIndex: 'ownerName',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.projectNum`).d('项目号'),
        dataIndex: 'projectNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.featureType`).d('特征值类型'),
        dataIndex: 'featureType',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.featureValue`).d('特征值'),
        dataIndex: 'featureValue',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.sourceNum`).d('来源编号'),
        dataIndex: 'sourceNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.party`).d('商业伙伴'),
        dataIndex: 'partyName',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.partySite`).d('商业伙伴地点'),
        dataIndex: 'partySiteName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.sourceDocTypeId`).d('来源单据类型'),
        dataIndex: 'sourceDocType',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.sourceDocNum`).d('来源单据号'),
        dataIndex: 'sourceDocNum',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.sourceDocLineNum`).d('来源单据行号'),
        dataIndex: 'sourceDocLineNum',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.secondUom`).d('辅助单位'),
        dataIndex: 'secondUom',
        width: 70,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.secondExecutedQty`).d('辅助执行数量'),
        dataIndex: 'secondExecutedQty',
        width: 82,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.toItemCode`).d('目标物料'),
        dataIndex: 'toItemCode',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.toItemDescription`).d('目标物料描述'),
        dataIndex: 'toItemDescription',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.worker`).d('执行员工'),
        dataIndex: 'workerName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.resource`).d('资源'),
        dataIndex: 'resourceName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.costCenter`).d('成本中心'),
        dataIndex: 'costCenter',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.wmMoveType`).d('移动类型'),
        dataIndex: 'wmMoveType',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.executeReason`).d('执行原因'),
        dataIndex: 'executeReason',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.eventType`).d('事件类型'),
        dataIndex: 'eventTypeName',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${commonCode}.eventID`).d('事件ID'),
        dataIndex: 'eventId',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.eventBy`).d('事件提交人'),
        dataIndex: 'eventBy',
        width: 128,
        resizable: true,
      },
      {
        title: '是否已同步',
        dataIndex: 'attributeString1',
        width: 128,
        resizable: true,
      },
      {
        title: '返回消息',
        dataIndex: 'attributeString2',
        width: 128,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.pictures`).d('图片'),
        dataIndex: 'pictures',
        width: 200,
        resizable: true,
      },
      {
        title: intl.get(`${preCode}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 200,
        resizable: true,
      },
    ];
  }
  /**
   *lov缓存
   *
   * @returns
   */
  function QueryField() {
    return [
      <Lov
        name="organizationObj"
        clearButton
        noCache
        onChange={() => {
          hds.queryDataSet.current.set('documentObj', {});
          hds.queryDataSet.current.set('warehouseObj', {});
          hds.queryDataSet.current.set('toWarehouseObj', {});
          hds.queryDataSet.current.set('documentTypeObj', {});
          hds.queryDataSet.current.set('wmAreaObj', {});
          hds.queryDataSet.current.set('toWmAreaObj', {});
        }}
      />,
      <Select name="attributeString1" noCache />,
      <Lov name="documentTypeObj" clearButton noCache />,
      <Lov
        name="documentObj"
        clearButton
        noCache
        onChange={() => {
          hds.queryDataSet.current.set('documentLineObj', {});
        }}
      />,
      <Lov name="documentLineObj" clearButton noCache />,
      <Select name="executeType" noCache />,
      <Lov name="itemObj" clearButton noCache />,
      <DateTimePicker name="minExecutedTime" />,
      <DateTimePicker name="maxExecutedTime" />,
      <Lov
        name="warehouseObj"
        clearButton
        noCache
        onChange={() => {
          hds.queryDataSet.current.set('wmAreaObj', {});
        }}
      />,
      <Lov name="wmAreaObj" clearButton noCache />,
      <Lov
        name="toWarehouseObj"
        clearButton
        noCache
        onChange={() => {
          hds.queryDataSet.current.set('toWmAreaObj', {});
        }}
      />,
      <Lov name="toWmAreaObj" clearButton noCache />,
      <TextField name="lotNumber" />,
      <TextField name="tagCode" />,
      <Lov name="sourceDocNumObj" clearButton noCache />,
      <Lov name="partyObj" clearButton noCache />,
      <TextField name="executeLineId" />,
    ];
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = hds.queryDataSet.current;
    const fieldsValue = !formObj ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  function handleReset() {
    hds.queryDataSet.current.reset();
  }

  async function handleSearch(page = currentPage, pageSize = size) {
    const validateValue = await hds.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLoading(true);
    hds.queryDataSet.current.set('page', page - 1);
    hds.queryDataSet.current.set('size', pageSize);
    const res = await executeLines(hds.queryDataSet.current.toJSONData());
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
    <React.Fragment>
      <Header
        title={intl
          .get(`${warehouseExecutionCode}.view.title.warsehouseExecution`)
          .d('仓库执行明细')}
      >
        {/* requestUrl={`${HLOS_LWMS}/v1/${tId}/execute-lines/excel`} */}
        <ExcelExport
          requestUrl={`${HLOS_LWMSS}/v1/${tId}/raumplus-execute-line/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content className="lwms-warehouse-execution-detail" id="warehouseExecutionTable">
        <div id="warehouseExecutionHeaderQuery" className="header-query">
          <Form dataSet={hds.queryDataSet} columns={4} style={{ flex: 'auto' }}>
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
        {/* <TableList dataSource={dataSource} ds={hds}/> */}
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
    </React.Fragment>
  );
}

export default formatterCollections({
  code: [`${warehouseExecutionCode}`],
})(WarehouseExecution);
