/*
 * @Description:
 * @Author: tw
 * @LastEditTime: 2021-07-02 10:16:32
 */

import React, { useEffect, useState, Fragment } from 'react';
import intl from 'utils/intl';
import {
  Form,
  Select,
  Button,
  DataSet,
  PerformanceTable,
  Pagination,
  CheckBox,
  Lov,
  TextField,
} from 'choerodon-ui/pro';
import { Tabs } from 'choerodon-ui';
import InputLov from '@/components/InputLov/index';
import { userSetting } from 'hlos-front/lib/services/api';
// import { resultRender } from '@/utils/renderer';
// import { yesOrNoRender, statusRender } from 'hlos-front/lib/utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId, getResponse } from 'utils/utils';
import { HeadDS, ItemTagDS, printLableDS } from '@/stores/tagPrintDS';
import { printTag, unPackTag } from '@/services/tagPrintService';
// import _Modal from 'choerodon-ui/pro/lib/modal';
import '../print/index.less';

const itemTagDS = new DataSet(ItemTagDS());
const lineDS = new DataSet(printLableDS());

const intlPrefix = 'lwms.tagPrint';
const commonPrefix = 'lwms.common';
const commonCode = 'lwms.common.model';
const tableRef = React.createRef();

const headerDS = new DataSet(HeadDS());
const { TabPane } = Tabs;

function TagPrint(props) {
  const [showFlag, setShowFlag] = useState(false);
  const [tagId, setTagId] = useState(null);
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
    // ????????????????????????
    async function getInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        itemTagDS.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
          organizationCode: res.content[0].organizationCode,
        });
        itemTagDS.queryDataSet.current.set('printedFlag', 0);
      }
      headerDS.current.set('printModel', {
        templateCode: 'TF_SR_PRODUCT_TAG',
        templateName: '???????????????????????????',
      });
      setShowLoading(true);
      const rulest = await itemTagDS.query();
      if (getResponse(rulest) && rulest.content) {
        let data = [];
        if (itemTagDS.queryDataSet.current.get('printedFlag') === 0) {
          data = rulest.content.map((v) => {
            return { ...v, checked: true };
          });
          setCheckValues(data);
        }
        setDataSource(data);
        setTotalElements(rulest.totalElements || 0);
        calcTableHeight(data.length);
      }
      setShowLoading(false);
    }
    getInfo();
    calcTableHeight(0);
  }, []);

  useEffect(() => {
    function updateLot({ record, name }) {
      if (name === 'organizationObj') {
        record.set('lotNumberObj', null);
      }
    }
    itemTagDS.queryDataSet.addEventListener('update', updateLot);
    return () => {
      itemTagDS.queryDataSet.removeEventListener('update', updateLot);
    };
  }, []);

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lwms-tag-print')[0];
    const queryContainer = document.getElementById('tagPrintTableHeaderQuery');
    const lineContent = document.getElementsByClassName('tagPrint-line-content')[0];
    const maxTableHeight =
      pageContainer.offsetHeight -
      queryContainer.offsetHeight -
      (lineContent?.offsetHeight || 0) -
      185;
    if (dataLength === 0) {
      // ?????????????????????????????????80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // ?????????????????????????????????????????? 30???????????????33???????????????, 10: ???????????????
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight);
    }
  }

  function calcLineTableHeight(dataLength) {
    const maxTableHeight = 3 * 30 + 33 + 10;
    if (dataLength === 0) {
      // ?????????????????????????????????80
      setLineTableHeight(80);
    } else if (dataLength <= 3) {
      // ?????????????????????????????????????????? 30???????????????33???????????????, 10: ???????????????
      setLineTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setLineTableHeight(maxTableHeight);
    }
  }

  function onCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.tagId}
        checked={checkValues.findIndex((i) => i.tagId === rowData.tagId) !== -1}
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
        newCheckValues.findIndex((i) => i.tagId === rowData.tagId),
        1
      );
    }
    setCheckValues([...newCheckValues]);
  }

  function onCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
    } else {
      setCheckValues([]);
    }
  }

  const notPrintColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          defaultChecked
          onChange={onCheckAllChange}
        />
      ),
      dataIndex: 'tagId',
      key: 'tagId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${commonCode}.tag`).d('??????'),
      dataIndex: 'tagCode',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.itemDesc`).d('????????????'),
      dataIndex: 'itemDescription',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: '?????????',
      dataIndex: 'outerTagCode',
      width: 128,
      resizable: true,
    },
    {
      title: '?????????',
      dataIndex: 'traceNum',
      width: 128,
      resizable: true,
    },
    {
      title: '??????',
      dataIndex: 'num',
      width: 128,
      resizable: true,
    },
    {
      title: '????????????',
      dataIndex: 'dateTime',
      width: 150,
      resizable: true,
    },
    {
      title: '?????????',
      dataIndex: 'workerName',
      width: 128,
      resizable: true,
      flexGrow: 1,
    },
  ];

  const printedColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={onCheckAllChange}
        />
      ),
      dataIndex: 'tagId',
      key: 'tagId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${commonCode}.org`).d('??????'),
      dataIndex: 'organizationName',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.tag`).d('??????'),
      dataIndex: 'tagCode',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.item`).d('??????'),
      dataIndex: 'itemCode',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.itemDesc`).d('????????????'),
      dataIndex: 'itemDescription',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: '?????????',
      dataIndex: 'outerTagCode',
      width: 128,
      resizable: true,
    },
    {
      title: '?????????',
      dataIndex: 'traceNum',
      width: 128,
      resizable: true,
    },
    {
      title: '??????',
      dataIndex: 'num',
      width: 128,
      resizable: true,
    },
    {
      title: '??????',
      dataIndex: 'warehouseName',
      width: 128,
      resizable: true,
    },
    {
      title: '??????',
      dataIndex: 'wmAreaName',
      width: 128,
      resizable: true,
    },
    {
      title: '????????????',
      dataIndex: 'dateTime',
      width: 150,
      resizable: true,
    },
    {
      title: '?????????',
      dataIndex: 'workerName',
      width: 128,
      resizable: true,
    },
    {
      title: '????????????',
      dataIndex: 'printedCount',
      width: 82,
      // render: ({ rowData }) => formatLocation(rowData),
      resizable: true,
    },
    {
      title: '????????????',
      dataIndex: 'printedDate',
      width: 128,
      resizable: true,
    },
    {
      title: '????????????',
      dataIndex: 'printedName',
      width: 128,
      resizable: true,
    },
    {
      title: '????????????',
      dataIndex: 'printedLabel',
      width: 128,
      render: ({ rowData }) => formatPrintedLabel(rowData),
      resizable: true,
      flexGrow: 1,
    },
  ];

  const lineLableColumns = [
    {
      title: '??????',
      dataIndex: 'index',
      width: 300,
      fixed: true,
      resizable: true,
    },
    {
      title: '????????????',
      dataIndex: 'printedDate',
      width: 300,
      resizable: true,
    },
    {
      title: '????????????',
      dataIndex: 'printedName',
      width: 300,
      resizable: true,
      flexGrow: 1,
    },
  ];

  function formatPrintedLabel(data) {
    const item = <a onClick={() => handleHeadRowClick(data)}>????????????</a>;
    return item;
  }

  const handleUnbundling = async () => {
    if (!checkValues.length) {
      notification.warning({
        message: '???????????????????????????',
      });
      return;
    }
    const list = checkValues.map((ele) => ({
      tagId: ele.tagId,
    }));
    const params = {
      innerTags: list,
    };
    const res = await unPackTag(params);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else {
      notification.success({
        message: '????????????',
      });
      handleClickSearch();
    }
  };

  const handlePrint = async () => {
    const validate = await headerDS.validate(false, false);
    if (!validate) return;
    if (checkValues.length === 0) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('?????????????????????'),
      });
      return;
    }
    // ?????????
    const templateCode = headerDS.data[0]?.data?.printModel.templateCode;
    // const templateCode = 'TAG_1U1T_01_2D';
    const tagParams = [];
    const tagType = headerDS.current.get('tagType');
    checkValues.forEach((i) => {
      tagParams.push(i.tagId);
    });
    const list = checkValues.map((ele) => ({
      tagCode: ele.tagCode,
      tagId: ele.tagId,
    }));
    const obj = {
      lineList: list,
    };
    const params = [];
    params.push(obj);
    await printTag(params);
    // ?????????
    const checkValuesList = checkValues.map((ele) => ({
      tagId: ele.tagId,
    }));
    const checkValuesParams = {
      innerTags: checkValuesList,
    };
    // const res = await unPackTag(checkValuesParams);
    // if (res && res.failed) {
    //   notification.error({
    //     message: res.message,
    //   });
    // } else {
    //   notification.success({
    //     message: '????????????',
    //   });
    // }
    props.history.push({
      pathname: `/lwms/tongfu/tag-print/print/${templateCode}`,
      search: `tenantId=${getCurrentOrganizationId()}`,
      tagParams,
      tagType,
      checkValuesParams,
      backPath: '/lwms/tongfu/tag-print/list',
    });
  };

  /**
   *tab????????????
   * @returns
   */
  function QueryField() {
    return [
      // <Lov name="organizationObj" clearButton noCache />,
      <Select name="productLine" noCache />,
      <InputLov name="traceNumObj" textField="traceNum" />,
      <Lov name="facilityObj" clearButton noCache />,
      <TextField name="tagCode" />,
      <Lov name="item" clearButton noCache />,
      <TextField name="outerTagCode" />,
      <Lov name="warehouseObj" clearButton noCache />,
      <Lov name="wmAreaObj" clearButton noCache />,
    ];
  }

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  function handleReset() {
    itemTagDS.queryDataSet.current.reset();
  }

  async function handleSearch(page = currentPage, pageSize = size) {
    const validateValue = await itemTagDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLoading(true);
    itemTagDS.queryDataSet.current.set('page', page - 1);
    itemTagDS.queryDataSet.current.set('size', pageSize);
    const res = await itemTagDS.query();
    if (getResponse(res) && res.content) {
      setCheckValues([]);
      let data = [];
      if (itemTagDS.queryDataSet.current.get('printedFlag') === 0) {
        data = res.content.map((v) => {
          return { ...v, checked: true };
        });
        setCheckValues(data);
      } else {
        data = res.content;
      }
      setDataSource(data);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(data.length);
    }
    setShowLoading(false);
  }

  function handleClickSearch() {
    setCurrentPage(1);
    setTagId(null);
    handleSearch(1, size);
  }

  // ????????????
  function handlePageChange(page, pageSize) {
    // ??????????????????????????????????????????
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setCurrentPage(pageValue);
    setSize(pageSizeValue);
    handleSearch(pageValue, pageSizeValue);
  }

  const handleHeadRowClick = (rowData) => {
    setTagId(rowData.tagId);
    setCurRowData(rowData);
    handleLineSearch(lineCurrentPage, lineSize, rowData);
  };

  const handleLineSearch = async (page = currentPage, pageSize = size, rowData = curRowData) => {
    setShowLineLoading(true);
    const params = {
      tagId: rowData.tagId,
      page: page - 1,
      size: pageSize,
    };
    lineDS.queryParameter = params;
    const res = await lineDS.query();
    if (getResponse(res) && res.content) {
      setLineDataSource(res.content);
      setLineTotalElements(res.totalElements || 0);
      calcLineTableHeight(res.content.length);
      calcTableHeight(dataSource.length);
    }
    setShowLineLoading(false);
  };

  // ???????????????
  function handleLinePageChange(page, pageSize) {
    // ??????????????????????????????????????????
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setLineCurrentPage(pageValue);
    setLineSize(pageSizeValue);
    handleLineSearch(pageValue, pageSizeValue);
  }

  function handleTabChange(key) {
    if (key === 'notPrint') {
      itemTagDS.queryDataSet.current.set('printedFlag', 0);
    } else {
      itemTagDS.queryDataSet.current.set('printedFlag', 1);
    }
    handleClickSearch();
  }

  return (
    <Fragment>
      <Header title="????????????">
        <Button color="primary" onClick={handlePrint}>
          {intl.get('lwms.common.view.title.print').d('??????')}
        </Button>
        <Button onClick={handleUnbundling}>
          {intl.get('lwms.common.button.unbundling').d('??????')}
        </Button>
      </Header>
      <Content className="lwms-tag-print" id="tagPrintTable">
        <div style={{ display: 'flex' }}>
          <Form dataSet={headerDS} columns={4} style={{ flex: 1 }}>
            {/* <Select name="tagType" key="tagType" /> */}
            <Lov name="printModel" noCache />
          </Form>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Button style={{ opacity: 0 }}>????????????</Button>
            <Button style={{ opacity: 0 }}>??????</Button>
            <Button style={{ opacity: 0 }} color="primary">
              ??????
            </Button>
          </div>
        </div>
        <div id="tagPrintTableHeaderQuery" className="header-query">
          <Form dataSet={itemTagDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
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
                ? intl.get('hzero.common.button.viewMore').d('????????????')
                : intl.get('hzero.common.button.collected').d('????????????')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('??????')}</Button>
            <Button color="primary" onClick={() => handleClickSearch()}>
              {intl.get('hzero.common.button.search').d('??????')}
            </Button>
          </div>
        </div>
        <Tabs onChange={handleTabChange}>
          <TabPane tab="?????????" key="notPrint" className="tagPrint-tab-content">
            <PerformanceTable
              virtualized
              data={dataSource}
              ref={tableRef}
              columns={notPrintColumns}
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
          </TabPane>
          <TabPane tab="?????????" key="printed" className="tagPrint-tab-content">
            <PerformanceTable
              virtualized
              data={dataSource}
              ref={tableRef}
              columns={printedColumns}
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
          </TabPane>
        </Tabs>
        {tagId && (
          <div className="tagPrint-line-content">
            <PerformanceTable
              virtualized
              data={lineDataSource}
              ref={tableRef}
              columns={lineLableColumns}
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
          </div>
        )}
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})(TagPrint);
