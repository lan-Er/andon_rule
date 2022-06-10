import React, { useEffect, useState, Fragment } from 'react';
import intl from 'utils/intl';
import {
  Form,
  Select,
  Button,
  DataSet,
  PerformanceTable,
  Pagination,
  Radio,
  Lov,
  TextField,
  NumberField,
  DatePicker,
} from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import { userSetting } from 'hlos-front/lib/services/api';
import { yesOrNoRender, statusRender } from 'hlos-front/lib/utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId, getResponse } from 'utils/utils';
import { HeadDS, SyTagDS } from '@/stores/tagPrintDS';
import { printTag, insertTag } from '@/services/tagPrintService';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import styles from '../print/index.less';

const syTagDS = new DataSet(SyTagDS());
const headerDS = new DataSet(HeadDS());

const intlPrefix = 'lwms.tagPrint';
const commonPrefix = 'lwms.common';
const commonCode = 'lwms.common.model';
const preCode = 'lwms.tag.model';
const tableRef = React.createRef();

// 生产成本中
// const permissionModalKey = _Modal.key();

function TagPrint(props) {
  const [showFlag, setShowFlag] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);
  const [checkValues, setCheckValues] = useState([]);
  const [moIdVal, setMoIdVal] = useState(true);

  useEffect(() => {
    // 界面初始默认设置
    async function getInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        syTagDS.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
          organizationCode: res.content[0].organizationCode,
        });
        changeDataSet();
      }
    }
    getInfo();
    calcTableHeight(0);
    handleHeadReset();
  }, []);

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(styles['lwms-tag-print'])[0];
    const headerQuery = document.getElementById('tagPrintHeaderQuery');
    const queryContainer = document.getElementById('tagPrintTableHeaderQuery');
    const maxTableHeight =
      pageContainer.offsetHeight - headerQuery.offsetHeight - queryContainer.offsetHeight - 180;
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

  const changeDataSet = async () => {
    const ds = syTagDS;
    setCheckValues([]);
    setShowLoading(true);
    const res = await ds.query();
    if (getResponse(res) && res.content) {
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
    }
    setShowLoading(false);
  };

  function onCheckRadio({ rowData, rowIndex }) {
    const value = rowData.moId;
    let isChecked = false;
    isChecked = checkValues.findIndex((i) => i.moId === rowData.moId) !== -1;
    return (
      <Radio
        key={rowIndex}
        name="controlled"
        value={value}
        checked={isChecked}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={(val) => handleRadioChange(val, rowData)}
      />
    );
  }

  function handleRadioChange(value) {
    const newCheckValues = [];
    dataSource.forEach((item) => {
      if (item.moId === value) {
        newCheckValues.push(item);
        setMoIdVal(false);
        headerDS.current.getField('printYarnBatchObj').setLovPara('moId', item.moId);
      }
    });
    setCheckValues([...newCheckValues]);
  }
  const syItemTagColumns = [
    {
      dataIndex: 'moId',
      key: 'moId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => onCheckRadio({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${commonCode}.tagCode`).d('标签号'),
      dataIndex: 'tagCode',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.moNum`).d('MO号'),
      dataIndex: 'moNum',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.moStatusMeaning`).d('MO状态'),
      dataIndex: 'moStatusMeaning',
      width: 128,
      fixed: true,
      resizable: true,
      render: ({ rowData, dataIndex }) => statusRender(rowData.moStatus, rowData[dataIndex]),
    },
    {
      title: intl.get(`${commonCode}.organizationName`).d('组织'),
      dataIndex: 'organizationName',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.itemCode`).d('物料'),
      dataIndex: 'itemCode',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.itemDesc`).d('物料描述'),
      dataIndex: 'itemDesc',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customerName`).d('客户'),
      dataIndex: 'customerName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.supplierName`).d('供应商'),
      dataIndex: 'supplierName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.makeQty`).d('数量'),
      dataIndex: 'makeQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.featureDesc`).d('颜色'),
      dataIndex: 'featureDesc',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.designCode`).d('门幅'),
      dataIndex: 'designCode',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.specification`).d('规格'),
      dataIndex: 'specification',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.machineNum`).d('机台号'),
      dataIndex: 'machineNum',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${commonCode}.uomDesc`).d('单位'),
      dataIndex: 'uomDesc',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.remark`).d('工艺'),
      dataIndex: 'remark',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.location`).d('位置'),
      dataIndex: 'location',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.madeDate`).d('生产日期'),
      dataIndex: 'madeDate',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.printedFlag`).d('打印标识'),
      dataIndex: 'printedFlag',
      width: 144,
      resizable: true,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.printedDate`).d('打印日期'),
      dataIndex: 'printedDate',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.creationDate`).d('创建时间'),
      dataIndex: 'creationDate',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.createdBy`).d('创建人'),
      dataIndex: 'createdBy',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.contractNum`).d('合约号'),
      dataIndex: 'contractNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.modelNum`).d('款号'),
      dataIndex: 'modelNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planNum`).d('计划单号'),
      dataIndex: 'planNum',
      width: 128,
      resizable: true,
    },
  ];

  const handlePrint = async () => {
    const validate = await headerDS.validate(false, false);
    if (!validate) return;
    if (checkValues.length === 0) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    }
    const tagType = headerDS.current.get('tagType');
    if (checkValues.filter((v) => v.moStatus !== 'RELEASED' && v.moStatus !== 'COMPLETED').length) {
      notification.warning({
        message: '存在工单未下达， 请检查后打印',
      });
      return;
    }
    const tagParams = checkValues.map((i) => ({
      moId: i.moId,
      printQty: headerDS.current.get('printQty') || null,
    }));
    const printYarnBatch = [];
    headerDS.current.get('printYarnBatch').forEach((item, index) => {
      headerDS.current.get('description').forEach((e, i) => {
        if (index === i) {
          printYarnBatch.push(`${item}-${e}`);
        }
      });
    });
    const params = checkValues.map((v) => ({
      ...v,
      printYarnBatch: printYarnBatch.join(';'),
      printClothBatch: headerDS.current.get('printClothBatch') || null,
      printMachineNum: headerDS.current.get('printMachineNum') || null,
      printQty: headerDS.current.get('printQty') || null,
    }));
    const resp = await insertTag(params);
    if (getResponse(resp) && resp.length) {
      const list = resp.map((ele) => ({
        tagCode: ele.tagCode,
        tagId: ele.tagId,
      }));
      const res = await printTag([{ lineList: list }]);
      if (getResponse(res)) {
        props.history.push({
          pathname: `/senyu/tag-print/print/LMES.SY.ITEM_PRINT`,
          search: `tenantId=${getCurrentOrganizationId()}`,
          tagParams,
          tagType,
          backPath: '/senyu/tag-print/list',
        });
      }
    }
  };

  /**
   *tab查询条件
   * @returns
   */
  function QueryField() {
    return [
      <Lov name="organizationObj" clearButton noCache />,
      <TextField name="tagCode" />,
      <Lov name="item" clearButton noCache />,
      <Lov name="moObj" clearButton noCache />,
      <Select name="moStatus" key="moStatus" />,
      <TextField name="createdByName" />,
      <Select name="printedFlag" />,
      <DatePicker name="madeDateLeft" />,
      <DatePicker name="madeDateRight" />,
      <DatePicker name="printedDateFrom" />,
      <DatePicker name="printedDateTo" />,
    ];
  }

  const handleToggle = async () => {
    await setShowFlag(!showFlag);
    calcTableHeight(dataSource.length);
  };

  function handleReset() {
    const ds = syTagDS;
    ds.queryDataSet.current.reset();
  }
  function handleHeadReset() {
    const ds = headerDS;
    ds.current.reset();
  }

  async function handleSearch(page = currentPage, pageSize = size) {
    const ds = syTagDS;
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

  return (
    <Fragment>
      <Header title="标签打印" />
      <Content className={styles['lwms-tag-print']} id="tagPrintTable">
        <Card key="header" title="录入布票信息" bordered={false} className={DETAIL_CARD_CLASSNAME}>
          <div className={styles['header-query']} id="tagPrintHeaderQuery">
            <Form dataSet={headerDS} columns={4} style={{ flex: 'auto' }}>
              <Lov name="printYarnBatchObj" clearButton noCache disabled={moIdVal} />
              <TextField name="printClothBatch" />
              <TextField name="printMachineNum" />
              <NumberField name="printQty" />
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
              <Button onClick={handleHeadReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={handlePrint}>
                {intl.get('lwms.common.view.title.print').d('打印')}
              </Button>
            </div>
          </div>
        </Card>
        <Card key="main" title="布票查询信息" bordered={false} className={DETAIL_CARD_CLASSNAME}>
          <div className={styles['header-query']} id="tagPrintTableHeaderQuery">
            <Form dataSet={syTagDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
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
              <Button onClick={handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={() => handleClickSearch()}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
        </Card>
        <PerformanceTable
          virtualized
          data={dataSource}
          ref={tableRef}
          columns={syItemTagColumns}
          height={tableHeight}
          loading={showLoading}
        />
        <Pagination
          className={styles.Pagination}
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
