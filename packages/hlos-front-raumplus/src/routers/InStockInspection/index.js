/*
 * @Description: 在库检验
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-22 10:30:28
 */

import React, { Fragment, useState, useEffect } from 'react';
import { Header } from 'components/Page';
import {
  DataSet,
  Lov,
  DateTimePicker,
  Button,
  CheckBox,
  Spin,
  Pagination,
  Icon,
} from 'choerodon-ui/pro';
// import { Row, Col } from 'choerodon-ui';
import { connect } from 'dva';

import uuidv4 from 'uuid/v4';
import notification from 'utils/notification';
import { getResponse } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { inspectionDocSubmit } from '@/services/inStockInspectionService.js';
import { QueryDS, pageDS } from '@/stores/inStockInspectionDS.js';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { userSetting } from 'hlos-front/lib/services/api';
// import SubHeader from './subHeader.js';

import down from 'hlos-front/lib/assets/icons/sort-down.svg';
import up from 'hlos-front/lib/assets/icons/sort-up.svg';
import Card from './card.js';
import style from './index.less';

const preCode = 'lmes.InStockInspectionModel';

const queryFactory = () => new DataSet(QueryDS());
const dataFactory = () => new DataSet(pageDS());

function InStockInspection({ history, dispatch, location, stockInspection }) {
  const queryDS = useDataSet(queryFactory, InStockInspection);
  const dataDS = useDataSet(dataFactory);

  const [timeToggle, setTimeToggle] = useState(false);
  const [itemToggle, setItemToggle] = useState(false);
  const [supplierToggle, setSupplierToggle] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (location?.state?.flag === false && stockInspection && stockInspection.list.length) {
      setList(stockInspection.list);
      setTimeToggle(stockInspection.timeToggle);
      setItemToggle(stockInspection.itemToggle);
      setSupplierToggle(stockInspection.supplierToggle);
      setLoading(stockInspection.loading);
      setTotalCount(stockInspection.totalCount);
      setCurrentPage(stockInspection.currentPage);
      setShowMore(stockInspection.showMore);
      return;
    }
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        if (queryDS.queryDataSet.current) {
          queryDS.queryDataSet.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationCode: res.content[0].organizationCode,
            organizationName: res.content[0].organizationName,
          });
        }
        if (dataDS.current) {
          dataDS.current.set('judgeObj', {
            workerId: res.content[0].workerId,
            workerCode: res.content[0].workerCode,
            workerName: res.content[0].workerName,
          });
          dataDS.current.set('organizationId', res.content[0].organizationId);
        }
      }
      handleQuery();
    }
    getUserInfo();
  }, []);

  useDataSetEvent(queryDS.queryDataSet, 'update', ({ record, name }) => {
    if (name === 'organizationObj') {
      record.set('warehouseObj', null);
      record.set('itemObj', null);
      record.set('workerObj', null);
      if (dataDS.current) {
        dataDS.current.set('judgeObj', null);
        dataDS.current.set('organizationId', record.get('organizationId'));
      }
    }

    if (name === 'warehouseObj') {
      record.set('wmAreaObj', null);
    }
  });

  // 二级头
  function SubHeader() {
    return (
      <div className={style['sub-header']}>
        <div>
          <div style={{ marginRight: '20px' }} onClick={() => handleSortToggle('creationDateSort')}>
            时间
            <img style={{ marginLeft: '8px' }} src={!timeToggle ? down : up} alt="down-up" />
          </div>
          <div style={{ marginRight: '20px' }} onClick={() => handleSortToggle('itemSort')}>
            物料编码
            <img style={{ marginLeft: '8px' }} src={!itemToggle ? down : up} alt="down-up" />
          </div>
          <div style={{ marginRight: '20px' }} onClick={() => handleSortToggle('supplierSort')}>
            供应商
            <img style={{ marginLeft: '8px' }} src={!supplierToggle ? down : up} alt="down-up" />
          </div>
          <div className={style['ds-ai-center']}>
            判定
            <Lov
              style={{ marginLeft: '10px', width: '45%' }}
              dataSet={dataDS}
              name="judgeObj"
              key="judgeObj"
            />
          </div>
        </div>
        <div>
          <CheckBox name="allChecked" dataSet={dataDS} onChange={handleAllChecked}>
            全选
          </CheckBox>
          <Button color="primary" onClick={handleBatchOperation}>
            合格
          </Button>
        </div>
        {/* <Col span={8} offset={8} style={{ textAlign: 'right', paddingRight: '12px' }}>

        </Col> */}
      </div>
    );
  }

  // 卡片内容区域
  function CardContent() {
    const _list = list.slice();
    return _list.map((v, i) => (
      <Card
        key={uuidv4()}
        data={v}
        onChange={(value) => handleSingleChange(value, i)}
        onToDetails={() => handleToDetails(v)}
      />
    ));
  }

  // 卡片选中切换
  function handleSingleChange(value, index) {
    const _list = list.slice();
    _list[index].checked = !_list[index].checked;
    dataDS.current.set(
      'allChecked',
      _list.every((v) => v.checked)
    );
    setList(_list);
  }

  // 点击卡片跳转至执行页面
  function handleToDetails(item) {
    const _data = dataDS.toJSONData() || [];
    history.push({
      pathname: `/pub/raumplus/in-stock-inspection/execute`,
      state: {
        ...item,
        organizationId: queryDS.queryDataSet.current.get('organizationId'),
        ..._data[0],
      },
    });

    dispatch({
      type: 'InStockInspectionModel/updateState',
      payload: {
        stockInspection: {
          list,
          timeToggle,
          itemToggle,
          supplierToggle,
          loading,
          totalCount,
          currentPage,
          showMore,
        },
      },
    });
  }

  // 查询
  async function handleQuery(curPage) {
    setLoading(true);
    queryDS.setQueryParameter('page', curPage ?? currentPage);
    queryDS.setQueryParameter('size', 20);
    queryDS.setQueryParameter('sortField', 'creationDate');
    const res = await queryDS.query();
    if (getResponse(res) && res.content && res.content.length) {
      const _resData = res.content.map((rec) => ({
        ...rec,
        checked: false,
      }));
      setList(_resData);
      setTotalCount(res.totalElements);
    }
    setLoading(false);
  }

  // 升序 倒序切换
  function handleSortToggle(type) {
    if (type === 'creationDateSort') {
      queryDS.setQueryParameter(type, Number(!timeToggle));
      setTimeToggle(!timeToggle);
    } else if (type === 'itemSort') {
      queryDS.setQueryParameter(type, Number(!itemToggle));
      setItemToggle(!itemToggle);
    } else if (type === 'supplierSort') {
      queryDS.setQueryParameter(type, Number(!supplierToggle));
      setSupplierToggle(!supplierToggle);
    }

    handleQuery();
  }

  // 批量合格
  function handleAllChecked() {
    const isAllChecked = dataDS.current.get('allChecked');
    let _list = list.slice();
    _list = _list.map((v) => ({
      ...v,
      checked: isAllChecked,
    }));
    setList(_list);
  }

  // 批量合格判定
  async function handleBatchOperation() {
    const _list = list.slice();
    const _queryData = dataDS.toJSONData();
    let checkedArray = _list.filter((ele) => ele.checked);
    checkedArray = checkedArray.map((ele) => ({
      ...ele,
      qcResult: 'PASS',
      qcOkQty: ele.batchQty || 0,
      qcNgQty: 0,
      qcSecondOkQty: null,
      qcSecondNgQty: null,
      inspectorId: _queryData.workerId,
      inspector: _queryData.workerCode,
      judgedDate: moment().format(DEFAULT_DATETIME_FORMAT),
    }));
    if (checkedArray.length) {
      const res = await inspectionDocSubmit(checkedArray);
      if (getResponse(res)) {
        notification.success({
          message: '提交成功',
        });
        handleQuery();
      }
    } else {
      notification.warning({
        message: '没有勾选项',
      });
    }
  }

  function sizeChangerRenderer({ text }) {
    return `${text} 条/页`;
  }

  function pagerRenderer(page, type) {
    switch (type) {
      case 'first':
        return <Icon type="fast_rewind" />;
      case 'last':
        return <Icon type="fast_forward" />;
      case 'prev':
        return <Icon type="navigate_before" />;
      case 'next':
        return <Icon type="navigate_next" />;
      case 'jump-prev':
      case 'jump-next':
        return '•••';
      default:
        return page;
    }
  }

  // 页码更改
  function handlePageChange(value) {
    setCurrentPage(value - 1);
    handleQuery(value - 1);
  }

  return (
    <Fragment>
      <Header title="在库检验" />
      <div className={style['in-stock-inspection-content']}>
        <div className={style['in-stock-header']}>
          <div className={style['query-fields']}>
            <div className={style['lov-line']}>
              <span className={style['lov-select']}>
                <Lov
                  dataSet={queryDS.queryDataSet}
                  name="organizationObj"
                  key="organizationObj"
                  placeholder="组织"
                />
              </span>
              <span className={style['lov-select']}>
                <Lov
                  dataSet={queryDS.queryDataSet}
                  name="warehouseObj"
                  key="warehouseObj"
                  placeholder="仓库"
                />
              </span>
              <span className={style['lov-select']}>
                <Lov
                  dataSet={queryDS.queryDataSet}
                  name="wmAreaObj"
                  key="wmAreaObj"
                  placeholder="货位"
                />
              </span>
              <span className={style['lov-select']}>
                <Lov
                  dataSet={queryDS.queryDataSet}
                  name="itemObj"
                  key="itemObj"
                  placeholder="物料"
                />
              </span>
            </div>
            {showMore ? (
              <div className={style['lov-line']}>
                <span className={style['lov-select']}>
                  <Lov
                    dataSet={queryDS.queryDataSet}
                    name="workerObj"
                    key="workerObj"
                    placeholder="报检人"
                  />
                </span>
                <span className={style['lov-select']}>
                  <DateTimePicker
                    dataSet={queryDS.queryDataSet}
                    name="createDateMin"
                    key="createDateMin"
                    placeholder="请选择时间"
                  />
                </span>
                <span className={style['lov-select']}>
                  <DateTimePicker
                    dataSet={queryDS.queryDataSet}
                    name="createDateMax"
                    key="createDateMax"
                    placeholder="请选择时间"
                  />
                </span>
              </div>
            ) : null}
          </div>
          <div className={style.buttons}>
            <Button icon="expand_more" onClick={() => setShowMore(!showMore)}>
              更多
            </Button>
            <Button color="primary" style={{ marginLeft: '20px' }} onClick={() => handleQuery()}>
              查询
            </Button>
          </div>
        </div>
        <div className={style['in-stock-sub-header']}>
          <SubHeader />
        </div>
        <div className={style['in-stock-card-list']}>
          <CardContent />
          {loading ? (
            <div className={style['my-loading-yes-no']}>
              <Spin tip="Loading..." />
            </div>
          ) : null}
        </div>
        <div className={style['in-stock-footer']}>
          <Pagination
            showSizeChangerLabel={false}
            showTotal={false}
            showPager
            sizeChangerPosition="center"
            sizeChangerOptionRenderer={sizeChangerRenderer}
            itemRender={pagerRenderer}
            total={totalCount}
            onChange={handlePageChange}
            pageSize={20}
            page={currentPage + 1}
          />
        </div>
      </div>
    </Fragment>
  );
}

export default connect(({ InStockInspectionModel }) => ({
  stockInspection: InStockInspectionModel?.stockInspection || [],
}))(
  formatterCollections({
    code: [`${preCode}`],
  })(InStockInspection)
);
