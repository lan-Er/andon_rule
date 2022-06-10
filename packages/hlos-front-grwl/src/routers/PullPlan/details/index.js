/*
 * @module: 详情页
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-04-27 18:18:37
 * @LastEditTime: 2021-06-17 17:09:58
 * @copyright: Copyright (c) 2020,Hand
 */
import moment from 'moment';
import { Tabs } from 'choerodon-ui';
import React, { Fragment, useEffect, useMemo } from 'react';
import { useObserver, useLocalStore } from 'mobx-react-lite';
import { Button, DataSet, Table } from 'choerodon-ui/pro/lib';

import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { userSetting } from 'hlos-front/lib/services/api';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import detailDs from '../store/detailDs';
import { handleRejectServicec, handleGenerateServicec } from '@/services/pullPlanService';

const TabPane = Tabs && Tabs.TabPane;
export default function Details(props) {
  const detailStore = useLocalStore(() => ({
    rejectLoading: false,
    generateLoading: false,
    organizationId: '',
    orgList: {},
    needQeury: false, // 生成和拒绝时候触发查询
    activeKey: '1',
    setNeedQuery(status) {
      this.needQeury = status;
    },
    setRejectLoading(status) {
      this.rejectLoading = status;
    },
    setGenerateLoading(status) {
      this.generateLoading = status;
    },
    setOrganizatioinId(id) {
      this.organizationId = id;
    },
    setOrganizatioinList(params) {
      this.orgList = params;
    },
    setActiveKey(value) {
      this.activeKey = value;
    },
    get getOrigin() {
      return this.organizationId;
    },
    async handleGenerate(params) {
      const res = await handleGenerateServicec(params);
      if (res) {
        return res;
      }
    },
    async handleReject(params) {
      const res = await handleRejectServicec(params);
      if (res) {
        return res;
      }
    },
  }));
  const fromDs = useDataSet(() => new DataSet(detailDs(detailStore)), Details);

  useEffect(() => {
    async function getOrgId() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content) {
        const { meOuId = '', meOuCode = '', workerId = '', workerName = '' } = res.content[0];
        detailStore.setOrganizatioinId(meOuId);
        detailStore.setOrganizatioinList({ meOuId, meOuCode, workerId, workerName });
      }
    }
    getOrgId();
  }, []);

  useEffect(() => {
    return () => {
      if (fromDs && fromDs.current) {
        fromDs.current.records.clear();
      }
    };
  }, []);

  /**
   * @description: 生成操作
   * @param {*}
   * @return {*}
   */
  function handleOperating(type) {
    const { selected } = fromDs;
    if (selected && selected.length <= 0) {
      notification.warning({ message: '至少选择一行数据' });
      return;
    }
    if (type === 'close') {
      detailStore.setRejectLoading(true);
      handleReject(selected);
    } else {
      detailStore.setGenerateLoading(true);
      handleGeneratecarriedOut(selected);
    }
  }

  /**
   * @description: 校验
   * @param {*} selected
   * @return {*}
   */
  async function handleVaidate(selected) {
    const result = true;
    const res = await Promise.all(selected.map((item) => item.validate(true, false)));
    for (let i = 0; i < res.length; i++) {
      if (res[i] === false) {
        return false;
      }
    }
    return result;
  }

  /**
   * @description: 生成操作验证后提交
   * @param {*}
   * @return {*}
   */
  async function handleGeneratecarriedOut(selected) {
    const validate = await handleVaidate(selected);
    if (!validate) {
      notification.warning({ message: '请输入必输项' });
      detailStore.setGenerateLoading(false);
      return;
    }
    const selectData = selected.map((item) => item.toJSONData());
    const newParams = {
      ...detailStore.orgList,
      generateParams: selectData,
      generateDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    detailStore
      .handleGenerate(newParams)
      .then((res) => {
        if (res && res.failed) {
          detailStore.setGenerateLoading(false);
          notification.warning({ message: res.message });
        } else {
          handleSuccess();
          detailStore.setGenerateLoading(false);
        }
      })
      .catch((err) => {
        console.log(err, '错误信息');
        detailStore.setGenerateLoading(false);
      });
  }

  /**
   * @description: 拒绝
   * @param {*}
   * @return {*}
   */
  async function handleReject(selected) {
    const validate = await handleVaidate(selected);
    if (!validate) {
      notification.warning({ message: '请输入必输项' });
      detailStore.setRejectLoading(false);
      return;
    }
    const params = selected.map((item) => item.toJSONData());
    // 过滤重复的planId并保留第一条
    const filterPlanId = new Map();
    for (let i = 0; i < params.length; i++) {
      const { planId } = params[i];
      if (!filterPlanId.has(planId)) {
        filterPlanId.set(planId, params[i]);
      }
    }
    const resultParams = [];
    filterPlanId.forEach((item) => {
      resultParams.push(item);
    });
    const newParams = {
      ...detailStore.orgList,
      params: resultParams,
      rejectDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    detailStore
      .handleReject(newParams)
      .then((res) => {
        if (res && res.failed) {
          notification.error({ message: res.message });
        } else {
          handleSuccess();
          detailStore.setRejectLoading(false);
        }
      })
      .catch((err) => {
        console.log(err, '错误信息');
        detailStore.setRejectLoading(false);
      });
  }
  const getColumns = useMemo(() => {
    return [
      {
        name: 'planBatchNum',
        lock: 'left',
        align: 'center',
        width: 160,
      },
      { name: 'planNum', lock: 'left', align: 'center', width: 160 },
      { name: 'itemCode', align: 'center', width: 120 },
      { name: 'featureDesc', align: 'center' },
      { name: 'itemDescription', align: 'center', width: 200, tooltip: 'overflow' },
      { name: 'demandQty', align: 'center' },
      { name: 'pullQty', align: 'center' },
      { name: 'soLineDemandQty', align: 'center', width: 140 },
      { name: 'soLineGeneratedQty', align: 'center', width: 150 },
      { name: 'soLineReturnedQty', align: 'center', width: 140 },
      { name: 'customerPoNum', align: 'center' },
      { name: 'customerPoLineNum', align: 'center', width: 160 },
      { name: 'satisfyQty', align: 'center' },
      {
        name: 'expectArrivalDate',
        align: 'center',
        editor: (record) => record.isSelected,
        width: 160,
      },
      {
        name: 'fromWarehouseObj',
        align: 'center',
        width: 200,
        editor: (record) => record.isSelected,
      },
      { name: 'rejectReason', align: 'center', width: 200, editor: (record) => record.isSelected },
    ];
  }, []);

  function handleSuccess() {
    const { history } = props;
    sessionStorage.setItem('goBackNeedQuery', true);
    notification.success({ message: '操作成功' });
    history.push('/grwl/pull-plans');
  }
  useEffect(() => {
    const planIdList = sessionStorage.getItem('grwlPlanIdList')
      ? JSON.parse(sessionStorage.getItem('grwlPlanIdList'))
      : [];
    if (planIdList && planIdList.length > 0) {
      fromDs.setQueryParameter('planIdList', planIdList);
      fromDs.query();
    }
  }, []);

  function handleChangeTabs(newActive) {
    detailStore.setActiveKey(newActive);
  }
  return useObserver(() => (
    <Fragment>
      <Header backPath="/grwl/pull-plans/list" title="检查页">
        <Button
          loading={detailStore.generateLoading}
          onClick={() => handleOperating('generate')}
          icon="done"
          color="primary"
          disabled={detailStore.activeKey === '2'}
        >
          生成
        </Button>
        <Button
          loading={detailStore.rejectLoading}
          onClick={() => handleOperating('close')}
          icon="close"
          disabled={detailStore.activeKey === '1'}
        >
          拒绝
        </Button>
      </Header>
      <Content>
        <Tabs defaultActiveKey="1" onChange={handleChangeTabs}>
          <TabPane tab="生成" key="1">
            <Table
              dataSet={fromDs}
              columns={getColumns.slice(0, getColumns.length - 1)}
              queryBar="none"
            />
          </TabPane>
          <TabPane tab="拒绝" key="2">
            <Table dataSet={fromDs} columns={getColumns} queryBar="none" />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  ));
}
