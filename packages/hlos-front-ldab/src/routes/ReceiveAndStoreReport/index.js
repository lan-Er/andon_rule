/*
 * @Description:收发存统计报表
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-11-23 18:36:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-28 17:42:43
 */
import React, { Fragment, useEffect, useState, useMemo } from 'react';
import { Header, Content } from 'components/Page';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import {
  Lov,
  DataSet,
  Radio,
  Button,
  Form,
  CheckBox,
  DatePicker,
  Select,
  Switch,
  PerformanceTable,
  Pagination,
} from 'choerodon-ui/pro';
import moment from 'moment';
import ExcelExport from 'components/ExcelExport';
import { userSetting } from 'hlos-front/lib/services/api';

import styles from './style/index.module.less';
import { QueryDS, TableDS } from '@/stores/ReceiveAndStoreReportDS';
import { getFirstDayOfWeek, getPrevDate, getPrevMonth } from '@/utils/timeServer';

const url = `${HLOS_LWMS}/v1/${getCurrentOrganizationId()}/onhand-journals/stock-report-excel`;
const tableRef = React.createRef();

export default function IqcStatisticalReport() {
  // const [columns, setColumns] = useState([]);
  const [checkedValue, setCheckedValue] = useState('DAY');
  const [itemCheckVal, setItemCheckVal] = useState(true);
  const [canSeePrise, setCanSeePrise] = useState(false);
  const [priseCheckVal, setPriseCheckVal] = useState(true);
  const queryDS = useMemo(() => new DataSet(QueryDS()), []);
  const bottomTableDS = useMemo(() => new DataSet(TableDS()), []);
  const [showLoading, setShowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(100);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);

  const allColumns = [
    {
      title: '物料',
      resizable: true,
      align: 'left',
      width: 135,
      dataIndex: 'itemCode',
      fixed: 'left',
    },
    {
      title: '物料描述',
      resizable: true,
      align: 'left',
      width: 250,
      dataIndex: 'description',
      fixed: 'left',
    },
    {
      title: '物料类型',
      resizable: true,
      align: 'left',
      width: 95,
      dataIndex: 'itemTypeMeaning',
    },
    {
      title: '物料类别',
      resizable: true,
      align: 'right',
      width: 95,
      dataIndex: 'wmCategoryName',
    },
    {
      title: '仓库',
      resizable: true,
      align: 'left',
      width: !itemCheckVal ? 128 : 0,
      dataIndex: 'warehouseName',
    },
    {
      title: '单位',
      resizable: true,
      align: 'left',
      width: 80,
      dataIndex: 'uomName',
    },
    // 单价原来所在位置  7
    {
      title: '单价',
      resizable: true,
      align: 'right',
      width: canSeePrise ? 90 : 0,
      dataIndex: 'price',
    },
    {
      title: '期初数量',
      resizable: true,
      align: 'right',
      width: 90,
      dataIndex: 'openingQty',
    },
    // 期初金额所在位置  9
    {
      title: '期初金额',
      resizable: true,
      align: 'right',
      width: canSeePrise ? 90 : 0,
      dataIndex: 'openingAccount',
    },
    {
      title: '接收数量',
      resizable: true,
      align: 'right',
      width: 90,
      dataIndex: 'receivedQty',
    },
    // 接收金额所在位置 11
    {
      title: '接收金额',
      resizable: true,
      align: 'right',
      width: canSeePrise ? 90 : 0,
      dataIndex: 'receivedAccount',
    },
    {
      title: '发出数量',
      resizable: true,
      align: 'right',
      width: 90,
      dataIndex: 'shippedQty',
    },
    // 发出金额所在位置 13
    {
      title: '发出金额',
      resizable: true,
      align: 'right',
      width: canSeePrise ? 90 : 0,
      dataIndex: 'shippedAccount',
    },
    {
      title: '期末数量',
      resizable: true,
      align: 'right',
      width: 90,
      dataIndex: 'closingQty',
    },
    // 期末金额所在位置 15
    {
      title: '期末金额',
      resizable: true,
      align: 'right',
      width: canSeePrise ? 90 : 0,
      dataIndex: 'closingAccount',
    },
    {
      title: '期间数量',
      resizable: true,
      align: 'right',
      width: 90,
      dataIndex: 'periodQty',
    },
    // 期间金额所在位置 17
    {
      title: '期间金额',
      resizable: true,
      align: 'right',
      width: canSeePrise ? 90 : 0,
      dataIndex: 'periodAccount',
    },
  ];

  // const initColumns = [
  //   {
  //     title: '物料',
  //     resizable: true,
  //     align: 'left',
  //     width: 135,
  //     dataIndex: 'itemCode',
  //     fixed: 'left',
  //   },
  //   {
  //     title: '物料描述',
  //     resizable: true,
  //     align: 'left',
  //     width: 250,
  //     dataIndex: 'description',
  //     fixed: 'left',
  //   },
  //   {
  //     title: '物料类型',
  //     resizable: true,
  //     align: 'left',
  //     width: 95,
  //     dataIndex: 'itemTypeMeaning',
  //   },
  //   {
  //     title: '物料类别',
  //     resizable: true,
  //     align: 'right',
  //     width: 95,
  //     dataIndex: 'wmCategoryName',
  //   },
  //   {
  //     title: '仓库',
  //     resizable: true,
  //     align: 'left',
  //     width: 128,
  //     dataIndex: 'warehouseName',
  //   },
  //   {
  //     title: '单位',
  //     resizable: true,
  //     align: 'left',
  //     width: 80,
  //     dataIndex: 'uomName',
  //   },
  //   // 单价原来所在位置  7
  //   {
  //     title: '期初数量',
  //     resizable: true,
  //     align: 'right',
  //     width: 90,
  //     dataIndex: 'openingQty',
  //   },
  //   // 期初金额所在位置  9
  //   {
  //     title: '接收数量',
  //     resizable: true,
  //     align: 'right',
  //     width: 90,
  //     dataIndex: 'receivedQty',
  //   },
  //   // 接收金额所在位置 11
  //   {
  //     title: '发出数量',
  //     resizable: true,
  //     align: 'right',
  //     width: 90,
  //     dataIndex: 'shippedQty',
  //   },
  //   // 发出金额所在位置 13
  //   {
  //     title: '期末数量',
  //     resizable: true,
  //     align: 'right',
  //     width: 90,
  //     dataIndex: 'closingQty',
  //   },
  //   // 期末金额所在位置 15
  //   {
  //     title: '期间数量',
  //     resizable: true,
  //     align: 'right',
  //     width: 90,
  //     dataIndex: 'periodQty',
  //   },
  //   // 期间金额所在位置 17
  // ];
  // const price = {
  //   title: '单价',
  //   resizable: true,
  //   align: 'right',
  //   width: 90,
  //   dataIndex: 'price',
  // };
  // const openingAccount = {
  //   title: '期初金额',
  //   resizable: true,
  //   align: 'right',
  //   width: 90,
  //   dataIndex: 'openingAccount',
  // };
  // const receivedAccount = {
  //   title: '接收金额',
  //   resizable: true,
  //   align: 'right',
  //   width: 90,
  //   dataIndex: 'receivedAccount',
  // };
  // const shippedAccount = {
  //   title: '发出金额',
  //   resizable: true,
  //   align: 'right',
  //   width: 90,
  //   dataIndex: 'shippedAccount',
  // };
  // const closingAccount = {
  //   title: '期末金额',
  //   resizable: true,
  //   align: 'right',
  //   width: 90,
  //   dataIndex: 'closingAccount',
  // };
  // const periodAccount = {
  //   title: '期间金额',
  //   resizable: true,
  //   align: 'right',
  //   width: 90,
  //   dataIndex: 'periodAccount',
  // };

  useEffect(() => {
    queryDS.create();
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        queryDS.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationCode: res.content[0].organizationCode,
          organizationName: res.content[0].organizationName,
        });
      }
      handleSearch();
    }
    getUserInfo();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [checkedValue, priseCheckVal]);

  useEffect(() => {
    changeItemAndPrise();
  }, [itemCheckVal, canSeePrise]);

  const changeItemAndPrise = () => {
    handleSearch();
    // const tempColumn = [...initColumns];
    // if (itemCheckVal && canSeePrise) {
    //   // 物料 && 展示金额
    //   tempColumn.splice(4, 1);
    //   tempColumn.splice(5, 0, price);
    //   tempColumn.splice(7, 0, openingAccount);
    //   tempColumn.splice(9, 0, receivedAccount);
    //   tempColumn.splice(11, 0, shippedAccount);
    //   tempColumn.splice(13, 0, closingAccount);
    //   tempColumn.splice(15, 0, periodAccount);
    //   setColumns([...tempColumn]);
    // } else if (itemCheckVal && !canSeePrise) {
    //   // 物料 && 不展示金额
    //   tempColumn.splice(4, 1);
    //   setColumns([...tempColumn]);
    // } else if (!itemCheckVal && canSeePrise) {
    //   // 物料+仓库  && 展示金额
    //   tempColumn.splice(5, 0, price);
    //   tempColumn.splice(7, 0, openingAccount);
    //   tempColumn.splice(9, 0, receivedAccount);
    //   tempColumn.splice(11, 0, shippedAccount);
    //   tempColumn.splice(13, 0, closingAccount);
    //   tempColumn.splice(15, 0, periodAccount);
    //   setColumns([...tempColumn]);
    // } else {
    //   // 物料+仓库  && 不展示金额
    //   setColumns([...initColumns]);
    // }
  };

  const handleRadioChange = (val) => {
    let startTime;
    let endTime;
    setCheckedValue(val);

    if (val === 'DAY') {
      startTime = new Date(new Date(new Date().toLocaleDateString()).getTime());
      endTime = new Date(
        new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
      );
      queryDS.current.set('time', {
        start: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
      });
    } else if (val === 'WEEK') {
      startTime = moment(getFirstDayOfWeek()).format('YYYY-MM-DD');
      endTime = moment(getPrevDate(startTime, -6)).format('YYYY-MM-DD');
      queryDS.current.set('time', {
        start: startTime,
        end: endTime,
      });
    } else if (val === 'MONTH') {
      startTime = moment(new Date()).format('YYYY-MM-01 00:00:00');
      endTime = new Date(
        new Date(moment(getPrevMonth(startTime)).format('YYYY-MM-DD HH:mm:ss')).getTime() - 1
      );
      queryDS.current.set('time', {
        start: startTime,
        end: endTime,
      });
    }
  };

  /**
   * @description: 查询按钮
   */
  const handleSearch = async (page = currentPage, pageSize = size) => {
    const queryDSValidate = await queryDS.validate(false, false);
    if (!queryDSValidate) {
      return;
    }
    let params = {};

    if (queryDS.current && queryDS.current.data) {
      const {
        organizationObj,
        warehouseJournal,
        itemCategory,
        itemObj,
        itemType,
        time,
      } = queryDS.current.data;
      const newParams = {
        organizationId: organizationObj?.organizationId,
        organizationCode: organizationObj?.organizationCode,
        eventTimeStart: time ? moment(time.start).format('YYYY-MM-DD 00:00:00') : undefined,
        eventTimeEnd: time ? moment(time.end).format('YYYY-MM-DD 23:59:59') : undefined,
        warehouseId: warehouseJournal.length
          ? warehouseJournal.map((i) => i.warehouseId)
          : undefined,
        itemId: itemObj?.itemId,
        itemType,
        wmCategoryId: itemCategory?.categoryId,
        item: itemCheckVal,
        salesPrice: priseCheckVal,
        page: page - 1,
        size: pageSize,
      };
      params = newParams;
    }
    bottomTableDS.queryParameter = params;
    setShowLoading(true);
    const resp = await bottomTableDS.query();
    if (getResponse(resp) && resp.content) {
      setDataSource(resp.content);
      setTotalElements(resp.totalElements || 0);
      calcTableHeight(resp.content.length);
    }
    setShowLoading(false);
  };

  const getExportQueryParams = () => {
    const { current } = queryDS || {};
    return current ? filterNullValueObject({ ...current.toData(), salesPrice: priseCheckVal }) : {};
  };

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(styles['content-report'])[0];
    const queryContainer = document.getElementsByClassName(styles['top-search'])[0];
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 75 - 20;
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
      <Header title="收发存报表">
        <Button color="primary" onClick={handleSearch}>
          查询
        </Button>
        <ExcelExport requestUrl={url} queryParams={getExportQueryParams} />
      </Header>
      <Content className={styles['content-report']}>
        <div className={styles['top-search']}>
          <div className={styles['top-search-left']}>
            <Form className={styles['search-left-lineOne']} dataSet={queryDS} columns={3}>
              <Lov name="organizationObj" />
              <DatePicker name="time" placeholder={['开始日期', '结束日期']} />
            </Form>
            <Form className={styles['search-left-lineTwo']} dataSet={queryDS} columns={1}>
              <Lov name="warehouseJournal" />
            </Form>
            <Form className={styles['search-left-lineThree']} dataSet={queryDS} columns={3}>
              <Lov name="itemObj" />
              <Select name="itemType" />
              <Lov name="itemCategory" />
            </Form>
          </div>
          <div className={styles['top-search-right']}>
            <div className={styles['search-right-lineOne']}>
              <div>
                <Radio
                  mode="button"
                  name="day"
                  value="DAY"
                  checked={checkedValue === 'DAY'}
                  onChange={handleRadioChange}
                >
                  今日
                </Radio>
              </div>
              <div>
                <Radio
                  mode="button"
                  name="week"
                  value="WEEK"
                  checked={checkedValue === 'WEEK'}
                  onChange={handleRadioChange}
                >
                  本周
                </Radio>
              </div>
              <div>
                <Radio
                  mode="button"
                  name="month"
                  value="MONTH"
                  checked={checkedValue === 'MONTH'}
                  onChange={handleRadioChange}
                >
                  本月
                </Radio>
              </div>
            </div>
            <div className={styles['search-right-lineTwo']}>
              <span className={styles['lineTwo-span']}>统计维度:</span>
              <div className={styles['lineTwo-div']}>
                <CheckBox checked={itemCheckVal} onChange={() => setItemCheckVal(!itemCheckVal)}>
                  物料
                </CheckBox>
                <CheckBox checked={!itemCheckVal} onChange={() => setItemCheckVal(!itemCheckVal)}>
                  物料+仓库
                </CheckBox>
              </div>
            </div>
            <div className={styles['search-right-lineThree']}>
              <span className={styles['lineThree-span']}>显示金额:</span>
              <div className={styles['lineThree-div']}>
                <div className={styles['lineThree-switch']}>
                  <Switch checked={canSeePrise} onChange={(value) => setCanSeePrise(value)} />
                </div>
                <div style={{ display: canSeePrise ? 'block' : 'none', flex: 2 }}>
                  <CheckBox
                    checked={priseCheckVal}
                    onChange={() => setPriseCheckVal(!priseCheckVal)}
                  >
                    成本价
                  </CheckBox>
                  <CheckBox
                    checked={!priseCheckVal}
                    onChange={() => setPriseCheckVal(!priseCheckVal)}
                  >
                    销售价
                  </CheckBox>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PerformanceTable
          virtualized
          data={dataSource}
          ref={tableRef}
          columns={allColumns}
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
