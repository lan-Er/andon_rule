/*
 * @module: 创建销售发货单平台
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-03-22 16:35:57
 * @LastEditTime: 2021-06-10 16:15:32
 * @copyright: Copyright (c) 2020,Hand
 */
import { connect } from 'dva';
import React, { useState, Fragment, useMemo, useEffect, useCallback } from 'react';
import {
  Form,
  Lov,
  Select,
  Button,
  DataSet,
  TextField,
  CheckBox,
  DatePicker,
} from 'choerodon-ui/pro';

import notification from 'utils/notification';
import { Content, Header } from 'components/Page';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { queryIndependentValueSet } from 'hlos-front/lib/services/api';

import formDs from './stores/index';
import style from './index.module.less';
import lovCodeList from '@/common/index';
import MyTable from './component/MyTable';

function CreateSalesInvoicePlatform({ dispatch }) {
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const myFormDs = useDataSet(() => new DataSet(formDs()), CreateSalesInvoicePlatform);

  useEffect(() => {
    queryIndependentValueSet({ lovCode: lovCodeList.soLineFlag }).then((res) => {
      if (res && res.length > 0) {
        sessionStorage.setItem('customerReceiveTypeList', JSON.stringify(res));
      }
    });
    return () => {
      sessionStorage.removeItem('customerReceiveTypeList');
    };
  }, []);

  useEffect(() => {
    return () => {
      if (myFormDs && myFormDs.current) {
        myFormDs.current.records.clear();
        handleReset();
      }
    };
  }, []);

  /**
   * @description: 自动填充预计到达时间
   * @param {*} name
   * @param {*} dataSet
   * @param {*} value
   * @return {*}
   */
  function handleUpdate({ name, dataSet, value }) {
    if (name === 'expectedArrivalDate') {
      const { selected } = dataSet;
      selected.forEach((item) => {
        item.set('expectedArrivalDate', value);
      });
    }
  }
  useDataSetEvent(myFormDs, 'update', handleUpdate);

  /**
   * @description: 取消选择重置
   * @param {*} record
   * @return {*}
   */
  function handleUnSelect({ record }) {
    record.reset();
  }
  useDataSetEvent(myFormDs, 'unSelect', handleUnSelect);

  /**
   * @description: 部分选择
   * @param {*} record
   * @param {*} dataSet
   * @return {*}
   */
  function handleSelect({ record, dataSet }) {
    const { selected } = dataSet;
    for (let i = 0; i < selected.length; i++) {
      if (selected[i].get('expectedArrivalDate')) {
        record.set('expectedArrivalDate', selected[i].get('expectedArrivalDate'));
        return;
      }
    }
  }
  useDataSetEvent(myFormDs, 'select', handleSelect);

  /**
   * @description: 全选
   * @param {*} dataSet
   * @return {*}
   */
  function handleUnSelectAll({ dataSet }) {
    dataSet.reset();
  }
  useDataSetEvent(myFormDs, 'unSelectAll', handleUnSelectAll);

  /**
   * @description: 取消全选
   * @param {*} dataSet
   * @return {*}
   */
  function handleSelectAll({ dataSet }) {
    const { selected } = dataSet;
    let expectedArrivalDate = '';
    for (let i = 0; i < selected.length; i++) {
      if (selected[i].get('expectedArrivalDate')) {
        expectedArrivalDate = selected[i].get('expectedArrivalDate');
        break;
      }
    }
    selected.forEach((item) => {
      item.set('expectedArrivalDate', expectedArrivalDate);
    });
  }
  useDataSetEvent(myFormDs, 'selectAll', handleSelectAll);

  /**
   * @description: 查询条件重置
   * @param {*}
   * @return {*}
   */
  function handleReset() {
    myFormDs.queryDataSet.current.reset();
  }

  /**
   * @description: 查询
   * @param {*}
   * @return {*}
   */
  async function handleQuery() {
    setLoading(true);
    try {
      const res = await myFormDs.query();
      if (res) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      window.console.log(err);
    }
  }

  /**
   * @description: 选中编辑
   * @param {*} record
   * @return {*}
   */
  function isEditor(record) {
    const { isSelected } = record;
    if (isSelected) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @description: 获取lookupcode汉语意思
   * @param {*} value
   * @return {*}
   */
  function getCustomerMeaning(value) {
    if (value == null) return '';
    const valueMeaningList = sessionStorage.getItem('customerReceiveTypeList');
    const valueMeaning = valueMeaningList ? JSON.parse(valueMeaningList) : [];
    for (let i = 0; i < valueMeaning.length; i++) {
      if (value === valueMeaning[i].value) {
        return valueMeaning[i].meaning;
      }
    }
    return value;
  }

  const getCustomerMean = useCallback((data) => getCustomerMeaning(data), []);
  const tableColumns = useMemo(
    () => [
      {
        name: 'shipOrganizationName',
        lock: true,
        width: 144,
      },
      { name: 'soNum', lock: true, width: 144 },
      {
        name: 'itemDisplay',
        lock: true,
        width: 200,
      },
      { name: 'uomName', width: 82 },
      { name: 'demandQty', width: 82 },
      {
        name: 'planQty',
        width: 110,
        editor: (record) => isEditor(record),
      },
      {
        name: 'expectedArrivalDate',
        width: 140,
        editor: (record) => isEditor(record),
      },
      {
        name: 'issueWarehouse',
        width: 120,
        editor: (record) => isEditor(record),
      },
      { name: 'plannedQty', width: 82 },
      { name: 'receivedQty', width: 82 },
      { name: 'onHandQty', width: 82 },
      { name: 'customerReceiveType', width: 82, renderer: ({ value }) => getCustomerMean(value) },
      {
        name: 'customerInventoryWm',
        width: 110,
      },
      { name: 'customerName', width: 128 },
      { name: 'demandDate', width: 100 },
      { name: 'promiseDate', width: 100 },
      { name: 'customerItemDisplay', width: 200 },
      { name: 'customerPoDisplay', width: 144 },
      { name: 'sopOuName', width: 128 },
      { name: 'salesmanName', width: 84 },
      { name: 'itemCategoryName', width: 128 },
      { name: 'secondUomName', width: 82 },
      { name: 'packingRuleName', width: 128 },
      {
        name: 'packingFormatMeaning',
        width: 128,
      },
      { name: 'packingMaterial', width: 82 },
      { name: 'minPackingQty', width: 82 },
      { name: 'packingQty', width: 82 },
      { name: 'containerQty', width: 82 },
      { name: 'palletContainerQty', width: 82 },
      { name: 'packageNum', width: 128 },
      { name: 'tagTemplate', width: 128 },
      { name: 'lotNumber', width: 128 },
      { name: 'tagCode', width: 128 },
      { name: 'soTypeName', width: 128 },
      { name: 'soStatusMeaning', width: 90 },
      { name: 'soLineType', width: 128 },
      { name: 'soLineStatusMeaning', width: 90 },
      { name: 'remark', width: 200 },
      { name: 'lineRemark', width: 200 },
    ],
    []
  );

  async function myVailDate(selected) {
    return Promise.all(selected.map((item) => item.validate(true, false)));
  }
  /**
   * @description: 提交
   * @param {*}
   * @return {*}
   */
  function handleSubmit() {
    const { selected } = myFormDs;
    if (selected && selected.length <= 0) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }
    setSubmitLoading(true);
    setTimeout(() => {
      mySubmit(selected);
    }, 0);
  }

  async function mySubmit(selected) {
    const validateValue = await myVailDate(selected);
    let result = true;
    for (let i = 0; i < validateValue.length; i++) {
      if (validateValue[i] === false) {
        result = false;
      }
    }
    if (!result) {
      notification.warning({
        message: '您有必输项没有输入，或者输入有误，请输入必输项或者修改有误信息后重新提交',
      });
      setSubmitLoading(false);
      return;
    }
    try {
      const params = selected.map((item) => {
        // 处理lovbind值失效问题，toJSondata后bind字段被过滤掉，但是，接口返回的的有，因此将返回数据和处理后数据合并
        const obj = Object.assign(item.data, item.toJSONData());
        const newObj = {};
        Object.keys(obj).forEach((h) => {
          if (typeof obj[h] !== 'object') {
            newObj[h] = obj[h];
          }
        });
        return newObj;
      });
      const res = await dispatch({
        type: 'createSalesInvoiceModel/createShipOrder',
        payload: params,
      });
      if (res && res.length > 0) {
        notification.success({
          message: '提交成功',
        });
        myFormDs.query().then(() => {
          setSubmitLoading(false);
        });
      } else {
        selected.forEach((item) => {
          item.reset();
        });
        setSubmitLoading(false);
      }
    } catch (err) {
      setSubmitLoading(false);
    }
  }

  const talbeConfig = {
    dataSet: myFormDs,
    columns: tableColumns,
    queryBar: 'none',
  };
  return (
    <Fragment>
      <Header title="创建销售发货单">
        <Button color="primary" onClick={handleSubmit} loading={submitLoading}>
          提交
        </Button>
      </Header>
      <Content>
        <div className={style['create-sales-invoice-platform-left']}>
          <div>
            <Form columns={4} dataSet={myFormDs.queryDataSet}>
              <Lov name="organizationObj" noCache />
              <Lov name="soObj" noCache />
              <Lov name="customerObj" noCache />
              <Select name="soLineStatusList" noCache />
              {showMore ? <Lov name="itemObj" noCache /> : null}
              {showMore ? <TextField name="customerItemDesc" /> : null}
              {showMore ? <TextField name="customerPo" /> : null}
              {showMore ? <TextField name="salesmanName" /> : null}
              {showMore ? <DatePicker name="demandDateFrom" /> : null}
              {showMore ? <DatePicker name="demandDateTo" /> : null}
              {showMore ? <Lov name="documentTypeObj" noCache /> : null}
              {showMore ? <CheckBox name="uncompletedFlag" /> : null}
              {showMore ? <Select name="customerReceiveType" /> : null}
              {showMore ? <TextField name="customerInventoryWm" /> : null}
            </Form>
          </div>
          <div className={style['create-sales-invoice-platform-query']}>
            <Button onClick={() => setShowMore(!showMore)}>
              {showMore ? '收起查询' : '更多查询'}
            </Button>
            <Button onClick={handleReset}>重置</Button>
            <Button color="primary" onClick={handleQuery} loading={loading}>
              查询
            </Button>
          </div>
        </div>
        <MyTable talbeConfig={{ ...talbeConfig }} />
      </Content>
    </Fragment>
  );
}
export default connect()(CreateSalesInvoicePlatform);
