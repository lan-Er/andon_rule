/**
 * @Description: 生产入库执行--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-05 14:57:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { CheckBox, Button, DataSet, Spin, notification } from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import moment from 'moment';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getResponse } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import sortDown from 'hlos-front/lib/assets/icons/sort-down.svg';
import sortUp from 'hlos-front/lib/assets/icons/sort-up.svg';
import { userSetting } from 'hlos-front/lib//services/api';
import { confirmProductionWm } from '@/services/productionWarehousingExecutionService';
import { ListDS, HeaderDS } from '@/stores/productionWarehousingExecutionDS';
import InputArea from './InputArea';
import ListItem from './ListItem';
import styles from './index.less';

const preCode = 'lwms.productionWarehousingExecution';

const ListFactory = () => new DataSet(ListDS());
const HeaderFactory = () => new DataSet(HeaderDS());

const ProductionWarehousingExecution = ({
  history,
  location,
  dispatch,
  indexList,
  queryData,
  otherData,
  headerData,
}) => {
  const listDS = useDataSet(ListFactory, ProductionWarehousingExecution);
  const headerDS = useDataSet(HeaderFactory);
  const [listLoading, setListLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pageDisabled, changePageDisabled] = useState(true);
  const [currentPage, changeCurrentPage] = useState(0);
  const [list, setList] = useState([]);
  const [allChecked, changeAllChecked] = useState(false);
  const [defaultWorker, setDefaultWorker] = useState({});
  const [timeSort, setTimeSort] = useState(true);

  useEffect(() => {
    const { state: { _back } = {} } = location;
    async function queryDefault() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const { organizationId, workerId, workerCode, workerName, fileUrl } = res.content[0];
        if (organizationId) {
          headerDS.current.set('organizationId', organizationId);
          listDS.queryDataSet.current.set('organizationId', organizationId);
          handleSearch();
          setDefaultWorker({
            workerId,
            workerCode,
            workerName,
            fileUrl,
          });
        }
      }
    }
    if (_back !== -1 || !indexList.length) {
      queryDefault();
    } else {
      setList(indexList);
      changePageDisabled(otherData?.pageDisabled);
      changeCurrentPage(otherData?.currentPage);
      changeAllChecked(otherData?.allChecked);
      setDefaultWorker(otherData?.defaultWorker);
      setTimeSort(otherData?.setTimeSort);
      listDS.queryDataSet.current = queryData;
      headerDS.current.set('organizationId', headerData?.organizationId);
      headerDS.current.set('workerObj', headerData?.workerObj);
      headerDS.current.set('warehouseObj', headerData?.warehouseObj);
      headerDS.current.set('wmAreaObj', headerData?.wmAreaObj);
    }
  }, []);

  async function handleSearch(page, refreshFlag) {
    listDS.queryParameter = {
      page: page || 0,
    };
    setListLoading(true);
    const res = await listDS.query();
    setListLoading(false);
    if (res && res.content) {
      if (refreshFlag) {
        setList(res.content);
      } else {
        setList(list.concat(...res.content));
      }
      if (res.totalPages === (page || 0) + 1) {
        changePageDisabled(true);
      } else {
        changePageDisabled(false);
      }
    }
  }

  function handlePaginationChange() {
    changeCurrentPage(currentPage + 1);
    handleSearch(currentPage + 1);
  }

  function handleToDetail(record) {
    dispatch({
      type: 'productionWarehousingExecution/updateState',
      payload: {
        indexList: list,
        queryData: listDS.queryDataSet.current,
        headerData: headerDS.current.data,
        otherData: {
          pageDisabled,
          currentPage,
          allChecked,
          defaultWorker,
          timeSort,
        },
      },
    });
    history.push({
      pathname: '/pub/lwms/production-warehousing-execution/detail',
      state: {
        ...record,
        workerId: headerDS.get('workerId') || defaultWorker.workerId,
        worker: headerDS.get('worker') || defaultWorker.workerCode,
        workerName: headerDS.get('workerName') || defaultWorker.workerName,
        fileUrl: headerDS.get('fileUrl') || defaultWorker.fileUrl,
        headerWarehouseId: headerDS.get('warehouseId'),
        headerWarehouseCode: headerDS.get('warehouseCode'),
        headerWarehouseName: headerDS.get('warehouseName'),
        headerWmAreaId: headerDS.get('wmAreaId'),
        headerWmAreaCode: headerDS.get('wmAreaCode'),
        headerWmAreaName: headerDS.get('wmAreaName'),
      },
    });
  }

  function handleItemClick(val, record) {
    const idx = list.findIndex((i) => i.requestId === record.requestId);
    const cloneList = [...list];
    if (idx >= 0) {
      cloneList.splice(idx, 1, {
        ...record,
        checked: val,
      });
      setList(cloneList);
      changeAllChecked(cloneList.every((i) => i.checked));
    }
  }

  function handleAllCheck(val) {
    changeAllChecked(val);
    const cloneList = [...list];
    cloneList.forEach((i) => {
      const _i = i;
      _i.checked = val;
    });
    setList(cloneList);
  }

  async function handleReceive() {
    const validateValue = await headerDS.validate(false, false);
    if (!validateValue) return;
    const checkedList = list.filter((i) => i.checked);
    const submitList = [];
    checkedList.forEach((i) => {
      submitList.push({
        requestId: i.requestId,
        requestNum: i.requestNum,
        executedWorkerId: defaultWorker?.workerId,
        executedWorker: defaultWorker?.workerCode,
        executedTime: moment().format(DEFAULT_DATETIME_FORMAT),
        toWarehouseId: headerDS.current.get('warehouseId') || i.warehouseId,
        toWarehouseCode: headerDS.current.get('warehouseCode') || i.warehouseCode,
        toWmAreaId: headerDS.current.get('wmAreaId') || i.wmAreaId,
        toWmAreaCode: headerDS.current.get('wmAreaCode') || i.wmAreaCode,
      });
    });
    setSubmitLoading(true);
    const res = await confirmProductionWm(submitList);
    if (getResponse(res)) {
      notification.success();
      handleSearch(0, true);
    }
    setSubmitLoading(false);
  }

  function handleTimeSort() {
    listDS.queryDataSet.current.set('sortFlag', timeSort ? 'N' : 'Y');
    setTimeSort(!timeSort);
    handleSearch(0, true);
  }

  function handleReset() {
    listDS.queryDataSet.current.set('moObj', null);
    listDS.queryDataSet.current.set('requestObj', null);
    listDS.queryDataSet.current.set('prodLineObj', null);
    listDS.queryDataSet.current.set('warehouseObj', null);
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.index`).d('入库执行')} />
      <Spin spinning={submitLoading}>
        <Content className={styles['lwms-production-warehousing-execution-content']}>
          <InputArea
            queryDS={listDS.queryDataSet}
            headerDS={headerDS}
            onSearch={handleSearch}
            onReset={handleReset}
          />
          <div className={styles['func-btn']}>
            <div className={styles.sort} onClick={handleTimeSort}>
              <span>{intl.get(`${preCode}.model.time`).d('时间')}</span>
              {timeSort ? <img src={sortDown} alt="" /> : <img src={sortUp} alt="" />}
            </div>
            <div>
              <span>
                <CheckBox checked={allChecked} onChange={handleAllCheck} />
                <span className={styles['select-btn']}>
                  {intl.get('hzero.c7nUI.Select.selectAll').d('全选')}
                </span>
              </span>
              <Button color="primary" onClick={handleReceive}>
                <Icon type="check" style={{ marginRight: 8 }} />
                {intl.get(`${preCode}.button.receive`).d('接收确认')}
              </Button>
            </div>
          </div>
          <div className={styles['list-wrapper']}>
            <Spin spinning={listLoading}>
              <div className={styles.list}>
                {list.map((i) => {
                  return (
                    <ListItem
                      key={i.requestId}
                      record={i}
                      onToDetail={handleToDetail}
                      onItemClick={handleItemClick}
                    />
                  );
                })}
              </div>
            </Spin>
          </div>
          <div
            className={styles['list-pagination']}
            onClick={!pageDisabled ? handlePaginationChange : () => {}}
          >
            {!pageDisabled ? '点击加载更多' : '暂无更多数据'}
          </div>
        </Content>
      </Spin>
    </Fragment>
  );
};
export default connect(({ productionWarehousingExecution }) => ({
  indexList: productionWarehousingExecution?.indexList || [],
  queryData: productionWarehousingExecution?.queryData || {},
  otherData: productionWarehousingExecution?.otherData || {},
  headerData: productionWarehousingExecution?.headerData || {},
}))(
  formatterCollections({
    code: [`${preCode}`],
  })(ProductionWarehousingExecution)
);
