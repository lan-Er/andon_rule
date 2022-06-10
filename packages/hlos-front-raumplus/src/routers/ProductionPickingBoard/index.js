/**
 * @Description: 生产领料看板--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-06-12 10:28:08
 * @LastEditors: yu.na
 */

import React, { Fragment, useMemo, useState, useEffect, createRef } from 'react';
import { PerformanceTable, DataSet, Select, Form, Button } from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import uuidv4 from 'uuid/v4';
import { ListDS } from '@/stores/productionPickingBoardDS';
import styles from './index.less';

const tableRef = createRef();
let timer = null;

const ProductionPickingBoard = () => {
  const listDS = useMemo(() => new DataSet(ListDS()), []);

  const [dataSource, setDataSource] = useState([]);
  const [tableHeight, setTableHeight] = useState(120);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleResize() {
      calcTableHeight(dataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource]);

  const columns = [
    {
      header: '拣货完成',
      type: 'ColumnGroup',
      align: 'center',
      children: [
        {
          title: '单据号',
          dataIndex: 'completeExternalNum',
          key: 'completeExternalNum',
          flexGrow: true,
        },
        {
          title: '需求日期',
          dataIndex: 'completePlanDemandDate',
          key: 'completePlanDemandDate',
          flexGrow: true,
        },
      ],
    },
    {
      header: '进行中',
      type: 'ColumnGroup',
      align: 'center',
      children: [
        {
          title: '单据号',
          dataIndex: 'underwayExternalNum',
          key: 'underwayExternalNum',
          flexGrow: true,
        },
        {
          title: '需求日期',
          dataIndex: 'underwayPlanDemandDate',
          key: 'underwayPlanDemandDate',
          flexGrow: true,
        },
      ],
    },
    {
      header: '未开始',
      type: 'ColumnGroup',
      align: 'center',
      children: [
        {
          title: '单据号',
          dataIndex: 'unStartExternalNum',
          key: 'unStartExternalNum',
          flexGrow: true,
        },
        {
          title: '需求日期',
          dataIndex: 'unStartPlanDemandDate',
          key: 'unStartPlanDemandDate',
          flexGrow: true,
        },
      ],
    },
  ];

  const queryFields = () => {
    return [
      <Select name="dashboardType" noCache key="dashboardType" />,
      <Select name="projectNum" noCache key="projectNum" />,
    ];
  };

  const handleReset = () => {
    listDS.queryDataSet.current.reset();
  };

  const handleSearch = async () => {
    const validateVal = await listDS.queryDataSet.validate(false, false);
    if (!validateVal) return;
    setLoading(true);
    const res = await listDS.query();
    setLoading(false);
    if (getResponse(res)) {
      const { pickCompletedList, unStartList, underwayList } = res;
      const newPickCompletedList = pickCompletedList.filter((i) => !isEmpty(i));
      const newUnStartList = unStartList.filter((i) => !isEmpty(i));
      const newUnderwayList = underwayList.filter((i) => !isEmpty(i));
      const maxLength = Math.max(
        newPickCompletedList.length,
        newUnStartList.length,
        newUnderwayList.length
      );
      const resArr = [];
      for (let i = 0; i < maxLength; i++) {
        let obj = {};
        if (newPickCompletedList[i]) {
          const { externalNum, planDemandDate } = newPickCompletedList[i];
          obj = {
            completeExternalNum: externalNum,
            completePlanDemandDate: planDemandDate,
          };
        }
        if (newUnStartList[i]) {
          const { externalNum, planDemandDate } = newUnStartList[i];
          obj = {
            ...obj,
            unStartExternalNum: externalNum,
            unStartPlanDemandDate: planDemandDate,
          };
        }
        if (newUnderwayList[i]) {
          const { externalNum, planDemandDate } = newUnderwayList[i];
          obj = {
            ...obj,
            underwayExternalNum: externalNum,
            underwayPlanDemandDate: planDemandDate,
          };
        }
        resArr.push(obj);
      }
      setDataSource(resArr);
      calcTableHeight(resArr.length);
    }
  };

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(
      styles['raumplus-production-picking-board']
    )[0];
    const queryContainer = document.getElementById('raumplusProdPickBoardHeaderQuery');
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 50;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(120);
    } else if (dataLength * 30 + 92 < maxTableHeight) {
      // } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      // setTableHeight(dataLength * 30 + 33 + 10);
      setTableHeight(dataLength * 30 + 92);
    } else {
      setTableHeight(maxTableHeight);
    }
    if (dataLength * 33 >= maxTableHeight) {
      handleScroll();
    }
  }

  function handleScroll() {
    const node = document.getElementsByClassName('c7n-performance-table-body-row-wrapper')[0];
    timer = setInterval(() => {
      node.scrollTop += 30;
      if (node.scrollTop === 0) {
        tableRef.current.scrollTop(0);
      }
    }, 1000);
  }

  return (
    <Fragment>
      <Header title="生产领料看板" />
      <Content className={styles['raumplus-production-picking-board']}>
        <div
          style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}
          id="raumplusProdPickBoardHeaderQuery"
        >
          <Form dataSet={listDS.queryDataSet} columns={2}>
            {queryFields()}
          </Form>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 8,
            }}
          >
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <PerformanceTable
          virtualized
          ref={tableRef}
          rowKey={uuidv4()}
          data={dataSource}
          columns={columns}
          height={tableHeight}
          headerHeight={80}
          loading={loading}
        />
      </Content>
    </Fragment>
  );
};

export default ProductionPickingBoard;
