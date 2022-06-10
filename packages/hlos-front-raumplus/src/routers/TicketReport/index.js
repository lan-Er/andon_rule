/**
 * @Description:发货单报表--Index
 * @Author: tw
 * @Date: 2020-04-24
 */
import React, { useEffect, useState } from 'react';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { TicketReportDS } from '@/stores/ticketReportDS';
import { shipOrderLists, getDownload } from '@/services/ticketReportService';
import {
  PerformanceTable,
  DataSet,
  Pagination,
  Form,
  Button,
  DatePicker,
  TextField,
  // Select,
} from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
// import { userSetting } from 'hlos-front/lib/services/api';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import './index.less';

const preCode = 'lwms.ticketReport';
const hds = new DataSet(TicketReportDS());
const tId = getCurrentOrganizationId();
const tableRef = React.createRef();

function TicketReport(props) {
  const [showMore, setShowMore] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);

  useEffect(() => {
    calcTableHeight(0);
  }, []);

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName('lwms-ticket-report')[0];
    const queryContainer = document.getElementById('headerQuery');
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
        title: '送货单号',
        dataIndex: 'attributeString2',
        width: 128,
        fixed: true,
        resizable: true,
      },
      { title: '车牌号', dataIndex: 'carPlate', width: 128, fixed: true, resizable: true },
      { title: '发货单号', dataIndex: 'shipOrderNum', width: 200, fixed: true, resizable: true },
      { title: '子订单号', dataIndex: 'documentNum', width: 200, fixed: true, resizable: true },
      { title: '发货时间', dataIndex: 'shipDate', width: 128, resizable: true },
      { title: '包件号', dataIndex: 'tagCode', width: 200, resizable: true },
      { title: '托盘号', dataIndex: 'outerTagCode', width: 128, resizable: true },
      { title: '长*宽*高', dataIndex: 'featureValue', width: 128, resizable: true },
      { title: '体积', dataIndex: 'volume', width: 82, resizable: true },
      { title: '重量', dataIndex: 'grossWeight', resizable: true },
    ];
  }
  /**
   *lov缓存
   *
   * @returns
   */
  function QueryField() {
    return [
      <TextField name="carPlate" key="carPlate" />,
      <TextField name="shipOrderNum" key="shipOrderNum" />,
      <DatePicker name="shipDate" key="shipDate" />,
      <TextField name="documentNum" />,
      <TextField name="attributeString2" key="attributeString2" />,
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
    const res = await shipOrderLists(hds.queryDataSet.current.toJSONData());
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

  async function handleToggle() {
    await setShowMore(!showMore);
    calcTableHeight(dataSource.length);
  }

  function handlePrint() {
    if (!hds.queryDataSet.current.get('attributeString2')) {
      notification.error({
        message: '请先录入送货单号',
      });
      return;
    }

    props.history.push({
      pathname: `/raumplus/ticket-report/print`,
      state: hds.queryDataSet.current.get('attributeString2'),
    });
  }

  async function handleDownload() {
    const deliveryNo = hds.queryDataSet.current.get('attributeString2');
    if (!deliveryNo || deliveryNo === '') {
      return;
    }
    setShowLoading(true);
    const res = await getDownload({ deliveryNo });
    if (getResponse(res) && res.length) {
      res.forEach((photo) => {
        downloadImg(photo.filePath, photo.fileName);
      });
    }
    setShowLoading(false);
  }

  function downloadImg(imgsrc, name) {
    // 强制下载图片
    const image = new Image();
    image.src = imgsrc;
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous');
    // eslint-disable-next-line func-names
    image.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, image.width, image.height);
      const url = canvas.toDataURL('image/png'); // 得到图片的base64编码数据
      const a = document.createElement('a'); // 生成一个a元素
      a.download = name; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性
      a.click();
    };
  }

  return (
    <React.Fragment>
      <Header title={intl.get(`${preCode}.view.title.ticketReport`).d('发货单报表')}>
        <ExcelExport
          requestUrl={`${HLOS_LWMSS}/v1/${tId}/raumplus/ship-order-lists/excel`}
          queryParams={getExportQueryParams}
        />
        <Button onClick={handlePrint}>打印</Button>
        <Button onClick={handleDownload}>下载</Button>
      </Header>
      <Content className="lwms-ticket-report" id="ticketReportTable">
        <div id="headerQuery" className="header-query">
          <Form dataSet={hds.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showMore ? QueryField().slice(0, 4) : QueryField()}
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
              {!showMore
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
  code: [`${preCode}`],
})(TicketReport);
