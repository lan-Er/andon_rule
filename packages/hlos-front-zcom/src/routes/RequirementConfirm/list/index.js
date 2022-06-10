/**
 * @Description: 需求确认
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-11 11:05:16
 */

import React, { useState, useEffect, Fragment } from 'react';
import { isEmpty } from 'lodash';
import { Tag } from 'choerodon-ui';
import {
  DataSet,
  Button,
  Form,
  TextField,
  Lov,
  Select,
  DatePicker,
  Tabs,
  Table,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { connect } from 'dva';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { queryIndependentValueSet } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import { confirmPoHeader, createSo } from '@/services/requirementConfirm';
import { requirementConfirmListDS } from '../store/RequirementConfirmDS';

import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.requirementConfirm';
const { requirementConfirm } = codeConfig.code;
const ListDS = new DataSet(requirementConfirmListDS());

function ZcomRequirementConfirm({ dispatch, currentTab, history }) {
  const [moreQuery, setMoreQuery] = useState(false);

  // 获取redux中当前tab
  const [curTab, setCurTab] = useState(currentTab);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    if (currentTab === 'unResponse') {
      ListDS.setQueryParameter('curTab', ['RELEASED', 'RETURNED']);
      ListDS.queryDataSet.current.set('poStatus', ['RELEASED', 'RETURNED']);
    } else {
      ListDS.setQueryParameter('curTab', ['CONFIRMED', 'CANCELLED', 'FEEDBACK']);
      ListDS.queryDataSet.current.set('poStatus', ['CONFIRMED', 'CANCELLED', 'FEEDBACK']);
    }
    ListDS.query();
    getStatusData();
  }, []);

  async function getStatusData() {
    const res = await queryIndependentValueSet({ lovCode: requirementConfirm.poStatus });
    if (!isEmpty(res)) {
      setStatusData(res);
    }
  }

  // 获取状态对应的颜色值
  function getColorByStatus(status) {
    let color = '';
    statusData.forEach((v) => {
      if (v.value === status) {
        color = v.tag;
      }
    });
    return color;
  }

  function handleReset() {
    ListDS.queryDataSet.current.reset();
  }

  async function handleSearch() {
    await ListDS.query();
  }

  function handleTabChange(key) {
    setCurTab(key);

    // 更新当前tab到redux
    dispatch({
      type: 'requirementConfirm/updateState',
      payload: {
        currentTab: key,
      },
    });
    if (key === 'unResponse') {
      ListDS.setQueryParameter('curTab', ['RELEASED', 'RETURNED']);
      ListDS.queryDataSet.current.set('poStatus', ['RELEASED', 'RETURNED']);
    } else {
      ListDS.setQueryParameter('curTab', ['CONFIRMED', 'CANCELLED', 'FEEDBACK']);
      ListDS.queryDataSet.current.set('poStatus', ['CONFIRMED', 'CANCELLED', 'FEEDBACK']);
    }
    ListDS.query();
  }

  function handleToDetail(id) {
    const pathName = `/zcom/requirement-confirm/detail/${curTab}/${id}`;
    history.push(pathName);
  }

  async function handleSure() {
    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('请至少选择一条数据'),
      });
      return;
    }
    const arr = [];
    ListDS.selected.forEach((v) => {
      arr.push({
        poHeaderId: v.data.poHeaderId,
        poStatus: v.data.poStatus,
        objectVersionNumber: v.data.objectVersionNumber,
      });
    });
    try {
      const res = await confirmPoHeader(arr);
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        ListDS.query();
      } else {
        notification.error({
          message: res.message,
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  async function handleGenerate() {
    if (!ListDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('请至少选择一条数据'),
      });
      return;
    }
    const arr = [];
    ListDS.selected.forEach((v) => {
      arr.push({
        poHeaderId: v.data.poHeaderId,
        soTypeCode: 'STANDARD_SO',
      });
    });
    try {
      const res = await createSo(arr);
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        ListDS.query();
      } else {
        notification.error({
          message: res.message,
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  const unResponseColumns = [
    {
      name: 'poStatusMeaning',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <Tag color={getColorByStatus(record.get('poStatus'))}>
            <span style={{ color: '#FFFFFF' }}>{value || ''}</span>
          </Tag>
        );
      },
    },
    {
      name: 'poNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('poHeaderId');
        return <a onClick={() => handleToDetail(id)}>{value || ''}</a>;
      },
    },
    { name: 'supplierNumber', width: 150 },
    { name: 'supplierName', width: 150 },
    { name: 'supplierSiteAddress', width: 150 },
    { name: 'poTypeCode', width: 150 },
    { name: 'customerName', width: 150 },
    { name: 'publishDate', width: 150 },
    { name: 'buyerName', width: 150 },
    { name: 'sourceSysName', width: 150 },
  ];

  const releasedColumns = [
    {
      name: 'poStatusMeaning',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <Tag color={getColorByStatus(record.get('poStatus'))}>
            <span style={{ color: '#FFFFFF' }}>{value || ''}</span>
          </Tag>
        );
      },
    },
    {
      name: 'poNum',
      width: 150,
      renderer: ({ record, value }) => {
        const id = record.get('poHeaderId');
        return <a onClick={() => handleToDetail(id)}>{value || ''}</a>;
      },
    },
    { name: 'supplierNumber', width: 150 },
    { name: 'supplierName', width: 150 },
    { name: 'supplierSiteAddress', width: 150 },
    { name: 'poTypeCode', width: 150 },
    { name: 'customerName', width: 150 },
    { name: 'publishDate', width: 150 },
    { name: 'buyerName', width: 150 },
    { name: 'poSoNum', width: 150 },
    { name: 'sourceSysName', width: 150 },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.requirementConfirm`).d('采购需求确认')}>
        <Button onClick={handleGenerate} disabled={curTab !== 'responsed'}>
          销售订单生成
        </Button>
        <Button onClick={handleSure} disabled={curTab !== 'unResponse'}>
          订单确认
        </Button>
      </Header>
      <Content>
        <div className={styles['zcom-requirement-confirm']}>
          <Form dataSet={ListDS.queryDataSet} columns={4}>
            <TextField name="poNum" />
            <Lov name="customerObj" clearButton noCache />
            <Select name="poTypeCode" />
            <Select name="poStatus" />
            {moreQuery && <DatePicker mode="date" name="creationDateStart" />}
            {moreQuery && <DatePicker mode="date" name="creationDateEnd" />}
            {moreQuery && <TextField name="sourceSysName" />}
            {moreQuery && <TextField name="buyerName" />}
            {moreQuery && <DatePicker mode="date" name="publishDateStart" />}
            {moreQuery && <DatePicker mode="date" name="publishDateEnd" />}
          </Form>
          <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
            <Button
              onClick={() => {
                setMoreQuery(!moreQuery);
              }}
            >
              {moreQuery
                ? intl.get('hzero.common.button.collected').d('收起查询')
                : intl.get('hzero.common.button.viewMore').d('更多查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={handleSearch}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        <Tabs defaultActiveKey={curTab} onChange={handleTabChange}>
          <TabPane tab="待回馈" key="unResponse">
            <Table
              dataSet={ListDS}
              columns={unResponseColumns}
              queryBar="none"
              columnResizable="true"
            />
          </TabPane>
          <TabPane tab="已回馈" key="responsed">
            <Table
              dataSet={ListDS}
              columns={releasedColumns}
              queryBar="none"
              columnResizable="true"
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default connect(({ requirementConfirm: { currentTab } }) => ({ currentTab }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomRequirementConfirm)
);
