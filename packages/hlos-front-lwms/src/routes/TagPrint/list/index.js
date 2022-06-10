/*
 * @Description:
 * @Author: Zhong Kailong
 * @LastEditTime: 2021-04-23 10:16:32
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
  // Table,
  Lov,
  TextField,
  NumberField,
  DatePicker,
  DateTimePicker,
} from 'choerodon-ui/pro';
import Preview from 'hzero-front-hrpt/lib/routes/LabelTemplate/Preview';
import _Modal from 'choerodon-ui/pro/lib/modal';
import { userSetting, queryReportData } from 'hlos-front/lib/services/api';
import { yesOrNoRender, statusRender } from 'hlos-front/lib/utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import { HZERO_RPT, API_HOST } from 'utils/config';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';
import { getCurrentOrganizationId, getResponse, getAccessToken, getRequestId } from 'utils/utils';
import { resultRender } from '@/utils/renderer';
import { HeadDS, ItemTagDS, ContainerTagDS, ModalDS } from '@/stores/tagPrintDS';
import { printTag } from '@/services/tagPrintService';
import '../print/index.less';

const itemTagDS = new DataSet(ItemTagDS());
const templateDS = new DataSet(ItemTagDS());
const containerTagDS = new DataSet(ContainerTagDS());

const intlPrefix = 'lwms.tagPrint';
const commonPrefix = 'lwms.common';
const commonCode = 'lwms.common.model';
const tableRef = React.createRef();

const organizationId = getCurrentOrganizationId();
const headerDS = new DataSet(HeadDS());
const modalDS = new DataSet(ModalDS());
// 生产成本中
// const permissionModalKey = _Modal.key();

const printModalKey = _Modal.key();

function TagPrint(props) {
  const [dataSet, setDataSet] = useState(itemTagDS);
  const [showFlag, setShowFlag] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);
  const [checkValues, setCheckValues] = useState([]);
  // const printCodeRef = useRef();

  useEffect(() => {
    // 界面初始默认设置
    async function getInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        itemTagDS.queryDataSet.current.set('loadThingFlag', 1);
        itemTagDS.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
          organizationCode: res.content[0].organizationCode,
        });
        templateDS.queryDataSet.current.set('loadThingFlag', 1);
        templateDS.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
          organizationCode: res.content[0].organizationCode,
        });
        containerTagDS.queryDataSet.current.set('loadThingFlag', 1);
        containerTagDS.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
          organizationCode: res.content[0].organizationCode,
        });
      }
      setShowLoading(true);
      const rulest = await itemTagDS.query();
      if (getResponse(rulest) && rulest.content) {
        setDataSource(rulest.content);
        setTotalElements(rulest.totalElements || 0);
        calcTableHeight(rulest.content.length);
      } else {
        calcTableHeight(0);
      }
      setShowLoading(false);
    }
    getInfo();
  }, []);

  useEffect(() => {
    function updateLot({ record, name }) {
      if (name === 'organizationObj') {
        record.set('lotNumberObj', null);
      }
    }
    dataSet.queryDataSet.addEventListener('update', updateLot);
    return () => {
      dataSet.queryDataSet.removeEventListener('update', updateLot);
    };
  }, []);

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lwms-tag-print')[0];
    const queryContainer = document.getElementById('tagPrintTableHeaderQuery');
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 125;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + +50 + 10);
    } else {
      setTableHeight(maxTableHeight);
    }
  }

  const changeTagType = (value) => {
    changeDataSet(value);
  };

  const changeDataSet = async (tagType) => {
    // const tagType = headerDS.current.get('tagType')?.value;
    let ds = itemTagDS;
    switch (tagType) {
      case 'CONTAINER_TAG':
        ds = containerTagDS;
        setDataSet(containerTagDS);
        // setColumns(containerTagColumns());
        break;
      case 'ITEM_TAG':
        ds = templateDS;
        setDataSet(templateDS);
        // setColumns(itemTagColumns());
        break;
      default:
        // 实物标签与模板标签所用dataset一致
        ds = itemTagDS;
        setDataSet(itemTagDS);
      // setColumns(itemTagColumns());
    }
    setCheckValues([]);
    const res = await ds.query();
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
    }
  };

  function formatLocation(data) {
    // 拼接位置字段
    const location = `${data.warehouseName ? data.warehouseName : ''} ${
      data.wmAreaName ? `${'-'}${data.wmAreaName}` : ''
    } ${data.wmUnitName ? `${'-'}${data.wmUnitName}` : ''}`;
    return location;
  }

  function formatItem(data) {
    // 拼接位置字段
    const item = `${data.itemCode ? data.itemCode : ''} ${
      data.itemDescription ? `${'-'}${data.itemDescription}` : ''
    }`;
    return item;
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

  const itemTagColumns = [
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
      title: intl.get(`${commonCode}.org`).d('组织'),
      dataIndex: 'organizationName',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.tag`).d('标签'),
      dataIndex: 'tagCode',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.item`).d('物料'),
      dataIndex: 'item',
      width: 200,
      render: ({ rowData }) => formatItem(rowData),
      fixed: true,
      resizable: true,
    },
    {
      title: '单位',
      dataIndex: 'uomName',
      width: 70,
      resizable: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 84,
      align: 'right',
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.lot`).d('批次'),
      dataIndex: 'lotNumber',
      width: 150,
      resizable: true,
    },
    {
      title: '是否装载',
      dataIndex: 'loadThingFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: '关联单据类型',
      dataIndex: 'documentTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: '关联单据',
      dataIndex: 'documentNum',
      width: 136,
      resizable: true,
    },
    {
      title: '位置',
      dataIndex: 'location',
      width: 200,
      // render: ({ record }) => formatLocation(record.data),
      render: ({ rowData }) => formatLocation(rowData),
      resizable: true,
    },
    {
      title: '工序',
      dataIndex: 'operation',
      width: 128,
      resizable: true,
    },
    {
      title: '资源',
      dataIndex: 'resource',
      width: 128,
      resizable: true,
    },
    {
      title: '所有者',
      dataIndex: 'owner',
      width: 128,
      resizable: true,
    },
    {
      title: '特征值',
      dataIndex: 'featureValue',
      width: 100,
      resizable: true,
    },
    {
      title: '项目号',
      dataIndex: 'projectNum',
      width: 128,
      resizable: true,
    },
    {
      title: '来源编号',
      dataIndex: 'sourceNum',
      width: 128,
      resizable: true,
    },
    {
      title: '质量状态',
      dataIndex: 'qcStatusMeaning',
      width: 100,
      // renderer: ({ value, record }) => resultRender(record.data.qcStatus, value),
      render: ({ rowData, dataIndex }) => resultRender(rowData.qcStatus, rowData[dataIndex]),
      resizable: true,
    },
    {
      title: '生产日期',
      dataIndex: 'madeDate',
      width: 100,
      resizable: true,
    },

    {
      title: '接收日期',
      dataIndex: 'receiveDate',
      width: 100,
      resizable: true,
    },
    {
      title: '赋值日期',
      dataIndex: 'assignedTime',
      width: 100,
      resizable: true,
    },
    {
      title: '失效日期',
      dataIndex: 'expireDate',
      width: 100,
      resizable: true,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      width: 200,
      resizable: true,
    },
    {
      title: '供应商分类',
      dataIndex: 'supplierCategoryName',
      width: 128,
      resizable: true,
    },
    {
      title: '供应商批次',
      dataIndex: 'supplierLotNumber',
      width: 128,
      resizable: true,
    },
    {
      title: '标签类型',
      dataIndex: 'tagTypeMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: '标签类别',
      dataIndex: 'tagCategoryName',
      width: 128,
      resizable: true,
    },
    {
      title: '标签状态',
      dataIndex: 'tagStatusMeaning',
      width: 100,
      align: 'center',
      // renderer: ({ value, record }) => statusRender(record.data.tagStatus, value),
      render: ({ rowData, dataIndex }) => statusRender(rowData.tagStatus, rowData[dataIndex]),
      resizable: true,
    },
    {
      title: '打印标识',
      dataIndex: 'printedFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: '打印日期',
      dataIndex: 'printedDate',
      width: 128,
      resizable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'creationDate',
      width: 150,
      resizable: true,
    },
    {
      title: '创建人',
      dataIndex: 'createdByName',
      width: 100,
      resizable: true,
    },
  ];

  const containerTagColumns = [
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
      title: intl.get(`${commonCode}.org`).d('组织'),
      dataIndex: 'organizationName',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.tag`).d('标签'),
      dataIndex: 'tagCode',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: '容器',
      dataIndex: 'container',
      width: 136,
      fixed: true,
      resizable: true,
    },
    {
      title: '容器类型',
      dataIndex: 'containerType',
      width: 100,
      align: 'left',
      resizable: true,
    },
    {
      title: '容器所有者',
      dataIndex: 'containerOwner',
      width: 128,
      resizable: true,
    },
    {
      title: '是否装载',
      dataIndex: 'loadThingFlag',
      width: 70,
      render: yesOrNoRender,
      resizable: true,
    },
    {
      title: '关联单据类型',
      dataIndex: 'documentTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: '关联单据',
      dataIndex: 'documentNum',
      width: 136,
      resizable: true,
    },
    {
      title: '位置',
      dataIndex: 'location',
      width: 200,
      resizable: true,
    },
    {
      title: '工序',
      dataIndex: 'operation',
      width: 128,
      resizable: true,
    },
    {
      title: '资源',
      dataIndex: 'resource',
      width: 128,
      resizable: true,
    },
    {
      title: '标签类型',
      dataIndex: 'tagType',
      width: 128,
      resizable: true,
    },
    {
      title: '标签类别',
      dataIndex: 'tagTypeMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: '状态',
      dataIndex: 'tagStatusMeaning',
      width: 100,
      resizable: true,
      flexGrow: 1,
    },
  ];

  const handlePreview = () => {
    if (headerDS.data[0]?.data?.printModel === undefined) {
      if (!templateCode) {
        notification.error({
          message: '请选择打印模板',
        });
      }
      return;
    }
    const templateCode = headerDS.data[0]?.data?.printModel.templateCode;
    _Modal.open({
      key: printModalKey,
      title: '预览',
      children: /* #__PURE__ */ React.createElement(Preview, {
        labelTemplateCode: templateCode,
        tenantId: 0,
      }),
      drawer: true,
      style: {
        width: 1000,
      },
      footer: function footer(okBtn) {
        return okBtn;
      },
    });
  };

  const handlePrint = async () => {
    const validate = await headerDS.validate(false, false);
    if (!validate) return;
    if (checkValues.length === 0) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    const templateCode = headerDS.data[0]?.data?.printModel.templateCode;
    // const templateCode = 'TAG_1U1T_01_2D';
    const tagParams = [];
    const tagType = headerDS.current.get('tagType');
    switch (tagType) {
      case 'CONTAINER_TAG':
        checkValues.forEach((i) => {
          tagParams.push(i);
        });
        break;
      case 'TEMPLATE_TAG':
        checkValues.forEach((i) => {
          tagParams.push(i.tagThingId);
        });
        break;
      default:
        checkValues.forEach((i) => {
          tagParams.push(i);
        });
    }
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
    props.history.push({
      pathname: `/lwms/tag-print/print/${templateCode}`,
      search: `tenantId=${getCurrentOrganizationId()}`,
      tagParams,
      tagType,
      backPath: '/lwms/tag-print/list',
    });
  };

  /**
   *tab查询条件
   * @returns
   */
  function QueryField() {
    if (headerDS.current.get('tagType') === 'CONTAINER_TAG') {
      return [
        <Lov name="organizationObj" clearButton noCache />,
        <TextField name="tagCode" />,
        <Select name="containerType" noCache />,
        <Select name="tagType" noCache />,
        <Lov name="tagCategoryObj" clearButton noCache />,
        <NumberField name="loadThingFlag" />,
        <TextField name="documentNum" />,
        <DatePicker name="madeDateLeft" />,
        <DatePicker name="madeDateRight" />,
        <DatePicker name="expireDateLeft" />,
        <DatePicker name="expireDateRight" />,
      ];
    } else {
      return [
        <Lov name="organizationObj" clearButton noCache />,
        <TextField name="tagCode" />,
        <Lov name="item" clearButton noCache />,
        <Lov name="lotNumberObj" clearButton noCache />,
        <Select name="tagType" noCache />,
        <Lov name="tagCategoryObj" clearButton noCache />,
        <Lov name="elatedDocTypeObj" clearButton noCache />,
        <TextField name="documentNum" />,
        <DatePicker name="madeDateLeft" />,
        <DatePicker name="madeDateRight" />,
        <DatePicker name="expireDateLeft" />,
        <DatePicker name="expireDateRight" />,
        <DateTimePicker name="creationDateLeft" />,
        <DateTimePicker name="creationDateRight" />,
        <Select name="qcStatusList" noCache />,
        <Select name="loadThingFlag" noCache />,
        <Select name="printedFlag" noCache />,
        <Lov name="supplierObj" clearButton noCache />,
        <Lov name="supplierCategoryObj" clearButton noCache />,
        <TextField name="supplierLotNumber" />,
        <TextField name="createdByName" />,
        <TextField name="poNum" />,
      ];
    }
  }

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  function handleReset() {
    let ds = itemTagDS;
    switch (headerDS.current.get('tagType')) {
      case 'CONTAINER_TAG':
        ds = containerTagDS;
        break;
      case 'ITEM_TAG':
        ds = templateDS;
        break;
      default:
        // 实物标签与模板标签所用dataset一致
        ds = itemTagDS;
    }
    ds.queryDataSet.current.reset();
  }

  async function handleSearch(page = currentPage, pageSize = size) {
    let ds = itemTagDS;
    switch (headerDS.current.get('tagType')) {
      case 'CONTAINER_TAG':
        ds = containerTagDS;
        break;
      case 'ITEM_TAG':
        ds = templateDS;
        break;
      default:
        // 实物标签与模板标签所用dataset一致
        ds = itemTagDS;
    }
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
      setCheckValues([]);
    }
    setShowLoading(false);
  }

  function handleClickSearch() {
    setCurrentPage(1);
    handleSearch(1, size);
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

  // function handleTextChange(value) {
  //   printCodeRef.current = value;
  // }

  async function handleOkPrint() {
    const tagCodeStr = checkValues.map((item) => item.tagCode).toString();
    const res = await queryReportData(modalDS.current.get('boxPrintCode'));
    if (res && res.content && res.content[0]) {
      const { reportUuid } = res.content[0];
      const url = `${HZERO_RPT}/v1/${organizationId}/reports/export/${reportUuid}/PRINT`;
      const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&tagCode=${tagCodeStr}`;
      window.open(requestUrl);
    }
  }

  function handleBoxPrint() {
    if (checkValues.length === 0) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    _Modal.open({
      key: printModalKey,
      title: intl.get('hzero.common.button.export').d('箱码打印'),
      children: (
        <React.Fragment>
          <div>
            <span>模板编码：</span>
            <Lov dataSet={modalDS} name="boxPrintObj" noCache />
          </div>
        </React.Fragment>
      ),
      onOk: handleOkPrint,
      closable: true,
    });
  }

  return (
    <Fragment>
      <Header title="标签打印">
        <ButtonPermission
          waitType="throttle"
          onClick={handleBoxPrint}
          permissionList={[
            {
              code: 'hlos.lwms.wm.management.tag.printing.ps.button.reportprint',
              type: 'button',
              meaning: '箱码打印',
            },
          ]}
        >
          {intl.get('lwms.tag.print.button.print').d('箱码打印')}
        </ButtonPermission>
        <Button color="primary" onClick={handlePrint}>
          {intl.get('lwms.common.view.title.print').d('打印')}
        </Button>
        <Button onClick={handlePreview}>{intl.get('hzero.common.button.preview').d('预览')}</Button>
      </Header>
      <Content className="lwms-tag-print" id="tagPrintTable">
        <div style={{ display: 'flex' }}>
          <Form dataSet={headerDS} columns={4} style={{ flex: 1 }}>
            <Select name="tagType" key="tagType" onChange={changeTagType} />
            <Lov name="printModel" noCache />
          </Form>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Button style={{ opacity: 0 }}>更多查询</Button>
            <Button style={{ opacity: 0 }}>重置</Button>
            <Button style={{ opacity: 0 }} color="primary">
              查询
            </Button>
          </div>
        </div>
        <div id="tagPrintTableHeaderQuery" className="header-query">
          <Form dataSet={dataSet.queryDataSet} columns={4} style={{ flex: 'auto' }}>
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
            <Button color="primary" onClick={() => handleClickSearch()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          data={dataSource}
          ref={tableRef}
          columns={
            headerDS.current.get('tagType') === 'CONTAINER_TAG'
              ? containerTagColumns
              : itemTagColumns
          }
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
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})(TagPrint);
