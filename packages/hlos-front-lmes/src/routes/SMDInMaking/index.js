/*
 * @module: SMD在制
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-03-01 16:31:06
 * @LastEditTime: 2021-07-29 13:50:12
 * @copyright: Copyright (c) 2021,Hand
 */
import React, { Fragment, useEffect, useState } from 'react';
import {
  DataSet,
  Button,
  Modal,
  Form,
  TextField,
  NumberField,
  Lov,
  CheckBox,
  PerformanceTable,
  Pagination,
  Select,
  DatePicker,
} from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';

import { Header, Content } from 'components/Page';
import { ExportButton } from 'hlos-front/lib/components';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { smdStatusRender } from '@/utils/renderer';
import { queryLovData } from 'hlos-front/lib/services/api';
import { getResponse } from 'utils/utils';

import { smdInMakingDS, smdInMakingLineDS, smdTempLineDS } from '@/stores/smdInMakingDS';
import { delLine } from '@/services/smdInMakingService';
import codeConfig from '@/common/codeConfig';
import style from './index.less';

let modal = null;
const { common } = codeConfig.code;
const headDS = new DataSet(smdInMakingDS());
const lineDS = new DataSet(smdInMakingLineDS());
const tempLineDS = new DataSet(smdTempLineDS());
const preCode = 'lwms.single.return.platform';
const intlPrefix = 'lmes.smdMaking.model';
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
        organizationName: res.content[0].organizationName,
      });
    }
  }
}

const SMDInMaking = () => {
  const [onProcess, toggleOnProcess] = useState(false);
  const [headId, setHeadId] = useState(null);

  const [showFlag, setShowFlag] = useState(false);
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
  const [lineCheckValues, setLineCheckValues] = useState([]);
  const [curRowData, setCurRowData] = useState({});

  useEffect(() => {
    headDS.addEventListener('query', () => setHeadId(null));
    if (!headDS.current) {
      setDefaultDSValue(headDS);
    }
    return () => {
      headDS.removeEventListener('query');
    };
  }, []);

  const handleCheckAllChange = (value) => {
    if (value) {
      setCheckValues(dataSource.map((i) => i));
    } else {
      setCheckValues([]);
    }
  };
  const handleLineCheckAllChange = (value) => {
    if (value) {
      setLineCheckValues(lineDataSource.map((i) => i));
    } else {
      setLineCheckValues([]);
    }
  };

  const checkCell = ({ rowData, rowIndex }) => {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.smdWipId}
        checked={checkValues.findIndex((v) => v.smdWipId === rowData.smdWipId) !== -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={() => handleCheckBoxChange(rowData)}
      />
    );
  };

  const handleCheckBoxChange = (rowData) => {
    const _checkValues = checkValues.slice();
    const _index = _checkValues.findIndex((v) => v.smdWipId === rowData.smdWipId);
    if (_index === -1) {
      _checkValues.push(rowData);
    } else {
      _checkValues.splice(_index, 1);
    }
    setCheckValues(_checkValues);
  };

  const handleHeadRowClick = (rowData) => {
    if (!onProcess && rowData.smdWipId !== headId) {
      toggleOnProcess(true);
      const { smdWipId } = rowData;
      setHeadId(smdWipId);
      setCurRowData(rowData);
      handleLineSearch(lineCurrentPage, lineSize, rowData);
    }
  };

  // 临时站位弹窗
  const handleTempLine = () => {
    if (!checkValues.length) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    } else if (checkValues.length > 1) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('只能选择一条数据'),
      });
      return;
    }
    tempLineDS.reset();
    const smdHeadData = checkValues[0];
    tempLineDS.current.set('organizationId', smdHeadData.organizationId);
    tempLineDS.current.set('smdWipId', smdHeadData.smdWipId);
    modal = Modal.open({
      key: 'lwms-smd-temp-line',
      title: 'SMD临时站位',
      className: style['lwms-smd-temp-line'],
      closable: true,
      children: (
        <Fragment>
          <Header>
            <Button onClick={handleCreate}>
              {intl.get('hzero.common.button.tempLine').d('新增')}
            </Button>
            <Button onClick={handleReset}>
              {intl.get('hzero.common.button.tempLine').d('重置')}
            </Button>
            <Button onClick={handleSave}>
              {intl.get('hzero.common.button.tempLine').d('保存')}
            </Button>
          </Header>
          <Content>
            <div className={style['smd-header']}>
              <div className={style['header-top']}>
                <span>
                  {smdHeadData.moNum}
                  <span style={{ marginLeft: '10%' }}>{smdHeadData.organizationName}</span>
                </span>
                <span>
                  {smdHeadData.pcbMountSideMeaning}{' '}
                  <span style={{ marginLeft: '50px' }}>{smdHeadData.smdWipStatusMeaning}</span>
                </span>
              </div>
              <div>
                <span>
                  {smdHeadData.itemCode} {smdHeadData.itemDescription}
                </span>
                <span>{smdHeadData.makeQty}</span>
              </div>
              <div>
                <span>
                  {smdHeadData.prodLineName} {smdHeadData.equipmentName} {smdHeadData.workcellName}
                </span>
                <span>{smdHeadData.loadedTime}</span>
              </div>
            </div>
            <Form dataSet={tempLineDS} columns={3}>
              <Lov
                name="deviceItemObj"
                noCache
                colSpan={2}
                onChange={(value) => handleDeviceItemObjChange(value)}
              />
              <TextField name="loadSeat" />
              <NumberField name="deviceUsage" />
              <TextField name="pcbMountPosition" colSpan={2} />
              <NumberField name="deviceWarningQty" />
              <TextField name="deviceSubstituteGroup" />
              <CheckBox name="deviceSubstituteFlag" />
              <Lov name="feederCategoryObj" noCache />
              <TextField name="feederLayLength" />
              <TextField name="remark" />
            </Form>
          </Content>
        </Fragment>
      ),
      footer: null,
    });
  };

  // 贴片元件变化
  const handleDeviceItemObjChange = (value) => {
    if (value) {
      tempLineDS.current.set('deviceItemObj', {
        itemId: value.itemId,
        itemCode: value.itemCode,
        itemDescription: `${value.itemCode} ${value.itemDescription}`.replace(/undefined/g, ' '),
      });
    }
  };

  // 新建临时站位
  const handleCreate = () => {
    if (detectDirty()) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.saveData`).d('是否保存当前数据？')}</p>,
        okText: intl.get('hzero.common.status.yes').d('是'),
        cancelText: intl.get('hzero.common.status.no').d('否'),
        onOk: () => handleSave('create'),
        onCancel: handleReset,
      });
    }
  };

  // 重置临时站位
  const handleReset = () => {
    tempLineDS.current.reset();
    tempLineDS.current.set('organizationId', headDS.selected[0].get('organizationId'));
    tempLineDS.current.set('smdWipId', headDS.selected[0].get('smdWipId'));
  };

  // 保存临时站位
  const handleSave = async (type) => {
    const tempLineValid = await tempLineDS.validate();
    if (!tempLineValid) {
      return;
    }
    tempLineDS.submit().then(() => {
      if (type !== 'create') {
        modal.close();
        lineDS.setQueryParameter('smdWipId', headDS.selected[0].get('smdWipId'));
        lineDS.query().then(() => toggleOnProcess(false));
      }
      tempLineDS.reset();
      setHeadId(headDS.selected[0].get('smdWipId'));
    });
  };

  // 脏数据检测
  const detectDirty = () => {
    if (
      !isEmpty(tempLineDS.current.get('deviceItemObj')) ||
      !isEmpty(tempLineDS.current.get('loadSeat')) ||
      !isEmpty(tempLineDS.current.get('deviceUsage')) ||
      !isEmpty(tempLineDS.current.get('pcbMountPosition')) ||
      !isEmpty(tempLineDS.current.get('deviceWarningQty')) ||
      !isEmpty(tempLineDS.current.get('feederCategoryObj')) ||
      !isEmpty(tempLineDS.current.get('feederLayLength')) ||
      !isEmpty(tempLineDS.current.get('deviceSubstituteGroup')) ||
      tempLineDS.current.get('deviceSubstituteFlag') === '1' ||
      !isEmpty(tempLineDS.current.get('remark'))
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  const calcTableHeight = (dataLength) => {
    const pageContainer = document.getElementsByClassName(style['lmes-smd-making-content'])[0];
    const queryContainer = document.getElementsByClassName(style['lmes-smd-making-query'])[0];
    const lineContent = document.getElementsByClassName(style['lmes-smd-making-line'])[0];
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

  const handleSearch = async (page = currentPage, pageSize = size) => {
    const validateValue = await headDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLoading(true);
    headDS.queryDataSet.current.set('page', page - 1);
    headDS.queryDataSet.current.set('size', pageSize);
    const res = await headDS.query();
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
      setCurrentPage(1);
      setHeadId(null);
    }
    setShowLoading(false);
  };

  const handleLineSearch = async (page = currentPage, pageSize = size, rowData = curRowData) => {
    setShowLineLoading(true);
    const params = {
      smdWipId: rowData.smdWipId,
      page: page - 1,
      size: pageSize,
    };
    lineDS.queryParameter = params;
    const res = await lineDS.query();
    if (getResponse(res) && res.content) {
      toggleOnProcess(false);
      setLineDataSource(res.content);
      setLineTotalElements(res.totalElements || 0);
      calcLineTableHeight(res.content.length);
      calcTableHeight(dataSource.length);
    }
    setShowLineLoading(false);
  };

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

  const handleHeaderReset = () => {
    headDS.queryDataSet.reset();
    setDataSource([]);
    setTotalElements(0);
    calcTableHeight(0);
    setCheckValues([]);
    setCurrentPage(1);
    setHeadId(null);
  };

  // 头表行
  const headColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={dataSource.length && checkValues.length === dataSource.length}
          onChange={handleCheckAllChange}
        />
      ),
      dataIndex: 'smdWipId',
      key: 'smdWipId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => checkCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${intlPrefix}.org`).d('组织'),
      dataIndex: 'organizationName',
      width: 128,
      editor: false,
      fixed: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.itemCode`).d('物料'),
      dataIndex: 'itemCode',
      width: 128,
      editor: false,
      fixed: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.itemDescription`).d('物料描述'),
      dataIndex: 'itemDescription',
      width: 200,
    },
    {
      title: intl.get(`${intlPrefix}.moNum`).d('MO'),
      dataIndex: 'moNum',
      width: 144,
    },
    {
      title: intl.get(`${intlPrefix}.makeQty`).d('制造数量'),
      dataIndex: 'makeQty',
      width: 82,
      align: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.smdWipStatusMeaning`).d('在制状态'),
      dataIndex: 'smdWipStatusMeaning',
      width: 84,
      render: ({ rowData }) => smdStatusRender(rowData.smdWipStatus, rowData.smdWipStatusMeaning),
    },
    {
      title: intl.get(`${intlPrefix}.pcbMountSideMeaning`).d('贴片面'),
      dataIndex: 'pcbMountSideMeaning',
      width: 82,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.prodLineName`).d('生产线'),
      dataIndex: 'prodLineName',
      width: 128,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.equipmentName`).d('贴片设备'),
      dataIndex: 'equipmentName',
      width: 128,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.workcellName`).d('工位'),
      dataIndex: 'workcellName',
      width: 128,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.location`).d('地点'),
      dataIndex: 'location',
      width: 128,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.mounterPositionMeaning`).d('设备方位'),
      dataIndex: 'mounterPositionMeaning',
      width: 82,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.mounterGroup`).d('设备组'),
      dataIndex: 'mounterGroup',
      width: 82,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.mounterCategoryName`).d('设备类别'),
      dataIndex: 'mounterCategoryName',
      width: 128,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.trolleyName`).d('料车'),
      dataIndex: 'trolleyName',
      width: 128,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.trolleyCategoryName`).d('料车类别'),
      dataIndex: 'trolleyCategoryName',
      width: 128,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.product`).d('产品'),
      dataIndex: 'product',
      width: 200,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.partyName`).d('客户'),
      dataIndex: 'partyName',
      width: 200,
      editor: false,
      // renderer: yesOrNoRender,
    },
    {
      title: intl.get(`${intlPrefix}.pcbProductQty`).d('单板产出'),
      dataIndex: 'pcbProductQty',
      width: 82,
      align: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.deviceSumQty`).d('元件总数'),
      dataIndex: 'deviceSumQty',
      width: 82,
      editor: false,
      align: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.mountMethodMeaning`).d('贴片方式'),
      dataIndex: 'mountMethodMeaning',
      width: 82,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.prepareMethodMeaning`).d('备料方式'),
      dataIndex: 'prepareMethodMeaning',
      width: 82,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.smdVersion`).d('版本'),
      dataIndex: 'smdVersion',
      width: 128,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.smtProgram`).d('程序名'),
      dataIndex: 'smtProgram',
      width: 128,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.errorProofingRuleName`).d('防错规则'),
      dataIndex: 'errorProofingRuleName',
      width: 128,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.loadedWorkerName`).d('上料员工'),
      dataIndex: 'loadedWorkerName',
      width: 100,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.loadedTime`).d('上料时间'),
      dataIndex: 'loadedTime',
      width: 136,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.moRemark`).d('MO备注'),
      dataIndex: 'moRemark',
      width: 200,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.remark`).d('备注'),
      dataIndex: 'remark',
      width: 200,
      editor: false,
    },
  ];

  const lineColumns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={lineCheckValues.length > 0 && lineCheckValues.length === lineDataSource.length}
          onChange={handleLineCheckAllChange}
        />
      ),
      dataIndex: 'smdLineId',
      key: 'smdLineId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) =>
        handleLineCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${intlPrefix}.smdLineNum`).d('行号'),
      dataIndex: 'smdLineNum',
      width: 70,
      editor: false,
      fixed: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.org`).d('组织'),
      dataIndex: 'organizationName',
      width: 128,
      editor: false,
      fixed: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.deviceItemCode`).d('贴片元件'),
      dataIndex: 'deviceItemCode',
      width: 128,
      editor: false,
      fixed: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.deviceItemDescription`).d('元件描述'),
      dataIndex: 'deviceItemDescription',
      width: 200,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.loadSeat`).d('给料站位'),
      dataIndex: 'loadSeat',
      width: 82,
      editor: false,
      align: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.deviceUsage`).d('元件用量'),
      dataIndex: 'deviceUsage',
      width: 82,
      editor: false,
      align: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.tagCode`).d('标签'),
      dataIndex: 'tagCode',
      width: 144,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.lotNumber`).d('批次'),
      dataIndex: 'lotNumber',
      width: 144,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.applyPackQty`).d('数量'),
      dataIndex: 'deviceOnhandQty',
      width: 82,
      editor: false,
      align: 'left',
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.deviceWarningQty`).d('警告数量'),
      dataIndex: 'deviceWarningQty',
      width: 82,
      editor: false,
      align: 'left',
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.supplierName`).d('供应商'),
      dataIndex: 'supplierName',
      width: 200,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.supplierLotNumber`).d('供应商批次'),
      dataIndex: 'supplierLotNumber',
      width: 144,
      editor: false,
      align: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.pcbMountPosition`).d('贴片点位'),
      dataIndex: 'pcbMountPosition',
      width: 200,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.deviceSubstituteGroup`).d('替代组'),
      dataIndex: 'deviceSubstituteGroup',
      width: 82,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.deviceSubstituteFlag`).d('替代标识'),
      dataIndex: 'deviceSubstituteFlag',
      width: 82,
      editor: false,
      align: 'left',
    },
    {
      title: intl.get(`${intlPrefix}.feederName`).d('飞达'),
      dataIndex: 'feederName',
      width: 128,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.feederCategoryName`).d('飞达类别'),
      dataIndex: 'feederCategoryName',
      width: 128,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.feederLayLength`).d('飞达绞距'),
      dataIndex: 'feederLayLength',
      width: 128,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.loadedFlag`).d('上料标识'),
      dataIndex: 'loadedFlag',
      width: 82,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.preparedWorkerName`).d('备料员工'),
      dataIndex: 'preparedWorkerName',
      width: 100,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.preparedTime`).d('备料时间'),
      dataIndex: 'preparedTime',
      width: 136,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.checkedFlag`).d('复核标识'),
      dataIndex: 'checkedFlag',
      width: 82,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.checkedWorkerName`).d('复核员工'),
      dataIndex: 'checkedWorkerName',
      width: 100,
      editor: false,
    },
    {
      title: intl.get(`${intlPrefix}.checkedTime`).d('复核时间'),
      dataIndex: 'checkedTime',
      width: 136,
      editor: false,
      tooltip: 'overflow',
    },
    {
      title: intl.get(`${intlPrefix}.remark`).d('备注'),
      dataIndex: 'remark',
      width: 200,
      editor: false,
    },
  ];

  const queryFields = () => {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <Lov name="moObj" noCache key="moObj" />,
      <Lov name="equipmentObj" noCache key="equipmentObj" />,
      <Select name="pcbMountSide" noCache key="pcbMountSide" />,
      <Lov name="prodLineObj" noCache key="prodLineObj" />,
      <Lov name="workcellObj" noCache key="workcellObj" />,
      <Lov name="trolleyObj" noCache key="trolleyObj" />,
      <DatePicker name="loadedTimeFrom" />,
      <DatePicker name="loadedTimeTo" />,
      <Lov name="loadedWorkerObj" noCache key="loadedWorkerObj" />,
      <Select name="smdWipStatus" noCache key="smdWipStatus" />,
    ];
  };

  function handleLineCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        onClick={(e) => {
          e.stopPropagation();
        }}
        value={rowData.smdWipLineId}
        checked={lineCheckValues.findIndex((i) => i.smdWipLineId === rowData.smdWipLineId) !== -1}
        onChange={(val) => handleLineCheckboxChange(val, rowData)}
      />
    );
  }

  function handleLineCheckboxChange(value, rowData) {
    const newLineCheckValues = [...lineCheckValues];
    if (value) {
      newLineCheckValues.push(rowData);
    } else {
      newLineCheckValues.splice(
        newLineCheckValues.findIndex((i) => i.smdWipLineId === rowData.smdWipLineId),
        1
      );
    }
    setLineCheckValues(newLineCheckValues);
  }

  const handleLineDel = async () => {
    if (lineCheckValues.length) return;
    const res = await delLine(lineCheckValues);
    if (getResponse(res)) {
      notification.success();
      handleLineSearch(1, 100);
    }
  };

  return (
    <Fragment>
      <Header title="SMD在制">
        <ExportButton
          reportCode={['LMES.LMES_SMD_WIP_HEADER']}
          exportTitle={
            intl.get(`${preCode}.view.title.singleReturnPlatform`).d('SMD在制') +
            intl.get('hzero.common.button.export').d('导出')
          }
        />
        <Button onClick={handleTempLine}>
          {intl.get('hzero.common.button.tempLine').d('临时站位')}
        </Button>
      </Header>
      <Content className={style['lmes-smd-making-content']}>
        <div className={style['lmes-smd-making-query']}>
          <Form dataSet={headDS.queryDataSet} columns={4}>
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
            <Button onClick={handleHeaderReset}>重置</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              查询
            </Button>
          </div>
        </div>
        <div>
          <PerformanceTable
            virtualized
            rowKey="smdWipId"
            data={dataSource}
            ref={tableRef}
            columns={headColumns}
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
        <div className={style['lmes-smd-making-line']}>
          {headId && (
            <>
              <Button
                icon="delete"
                color="primary"
                funcType="flat"
                onClick={handleLineDel}
                style={{ marginBottom: 10 }}
              >
                删除
              </Button>
              <PerformanceTable
                virtualized
                data={lineDataSource}
                ref={tableRef}
                columns={lineColumns}
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
};

export default SMDInMaking;
