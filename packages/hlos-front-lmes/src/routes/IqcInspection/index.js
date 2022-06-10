/*
 * @module: IQC检验
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-09 14:16:30
 * @LastEditTime: 2021-04-08 16:17:15
 * @copyright: Copyright (c) 2020,Hand
 */
import { Tabs, Spin } from 'choerodon-ui';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { userSetting } from 'hlos-front/lib/services/api';
import { Table, DataSet, Button, Form, Lov, Select, DateTimePicker } from 'choerodon-ui/pro';
import { getResponse } from 'utils/utils';
import { statusRender } from 'hlos-front/lib/utils/renderer';

// import codeConfig from '@/common/codeConfig';
import { queryIqcMainDS, queryInspectionDS } from '@/stores/iqcInspectionDS';

import style from './index.module.less';
import changeWidth from './changeWidth';

// const { common } = codeConfig.code;
const TabPane = Tabs && Tabs.TabPane;
export default function IqcInspection() {
  const iqcDS = useDataSet(() => new DataSet(queryIqcMainDS()), 'IqcInspection');
  const iqcInspectionDS = useMemo(() => new DataSet(queryInspectionDS()), []);
  const [MoreQuery, setMoreQuery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inspectionLoading, setInspectionLoading] = useState(false);
  const [useWork, setUserWork] = useState({});
  // const [queryInspection, setQueryInspection] = useState(0);
  const [tapActiveKey, setTapActiveKey] = useState('main');
  const isMoreQuery = useMemo(() => MoreQuery, [MoreQuery]);
  const useChange = changeWidth();
  useEffect(() => {
    async function defaultLovSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (getResponse(res)) {
        if (res.content[0] && iqcDS.queryDataSet.current) {
          iqcDS.queryDataSet.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationName: res.content[0].organizationName,
          });
          const { workerId, workerCode } = res.content[0];
          setUserWork({ workerId, workerCode });
        }
      }
      iqcDS.queryDataSet.current.set('ticketLineStatus', ['RECEIVED', 'RECEIVING']);
    }
    defaultLovSetting();
  }, [iqcDS]);

  useEffect(() => {
    return () => {
      if (iqcDS && iqcDS.current) {
        iqcDS.current.records.clear();
      }
      if (iqcDS && iqcDS.queryDataSet && iqcDS.queryDataSet.current) {
        iqcDS.queryDataSet.reset();
      }
    };
  }, []);

  useDataSetEvent(iqcDS.queryDataSet, 'update', handleChangeQuery);

  async function handleChangeQuery({ name, record, value }) {
    if (name === 'organizationObj') {
      record.set('ticketObject', null);
      record.set('documentObject', {});
      record.set('itemObj', null);
      record.set('inspectionDocObj', null);
      record.set('receiveWorkerObj', null);
      record.set('declarerObj', null);
      record.set('inspectorObj', null);
      if (value) {
        const { organizationId } = value;
        const res = await userSetting({ organizationId });
        if (res && res.content && res.content.length > 0) {
          const { workerId, workerCode } = res.content[0];
          setUserWork({ workerId, workerCode });
        }
      }
    }
    handleQueryIqcInspection(name, value);
  }
  /**
   * @description: 重置
   * @param {*}
   * @return {*}
   */
  function handleReset() {
    iqcDS.queryDataSet.current.reset();
    iqcDS.queryDataSet.current.set('documentObject', {});
  }

  async function handleSearch() {
    const validateValue = await iqcDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      notification.warning({
        message: '您有必输项没有输入，请输入后再查询',
      });
      return;
    }
    if (tapActiveKey === 'main') {
      handleQueryIqcInspection();
      await iqcDS.query().then(() => setLoading(false));
    } else {
      handleQueryIqcInspection();
      iqcInspectionDS.query();
    }
  }

  function mainColumns() {
    const colum = [
      {
        name: 'organizationObj',
        width: 144,
        lock: 'left',
        renderer: ({ record }) => (
          <span>
            {record.get('organizationCode')} {record.get('organizationName')}
          </span>
        ),
      },
      {
        name: 'joinTicketNum',
        width: 144,
        lock: 'left',
      },
      {
        name: 'itemObj',
        renderer: ({ record }) => (
          <span>
            {record.get('itemCode')} {record.get('itemDescription')}
          </span>
        ),
        width: 200,
        lock: 'left',
      },
      {
        name: 'ticketLineStatus',
        width: 100,
        align: 'center',
        renderer: ({ value, text }) => statusRender(value, text),
      },
      { name: 'receivedQty', width: 82 },
      { name: 'waitQty', width: 82 },
      {
        name: 'batchQty',
        width: 100,
        editor: (record) => {
          const { isSelected } = record;
          if (isSelected) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: 'samplingType',
        width: 100,
        editor: (record) => {
          const { isSelected } = record;
          const ticketLineStatus = record.get('ticketLineStatus');
          if ((ticketLineStatus === 'RECEIVED' || ticketLineStatus === 'RECEIVING') && isSelected) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: 'sampleQty',
        width: 100,
        editor: (record) => {
          const { isSelected } = record;
          const ticketLineStatus = record.get('ticketLineStatus');
          if ((ticketLineStatus === 'RECEIVED' || ticketLineStatus === 'RECEIVING') && isSelected) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: 'joinInspectionTemplate',
        width: 200,
        renderer: ({ value, record }) =>
          value && record.get('inspectionTemplateTypeMeaning')
            ? `${record.get('inspectionTemplateTypeMeaning')} ${value}`
            : null,
      },
      {
        name: 'priority',
        width: 84,
        editor: (record) => {
          const { isSelected } = record;
          const ticketLineStatus = record.get('ticketLineStatus');
          if ((ticketLineStatus === 'RECEIVED' || ticketLineStatus === 'RECEIVING') && isSelected) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: 'remark',
        width: 200,
        editor: (record) => {
          const { isSelected } = record;
          const ticketLineStatus = record.get('ticketLineStatus');
          if ((ticketLineStatus === 'RECEIVED' || ticketLineStatus === 'RECEIVING') && isSelected) {
            return true;
          } else {
            return false;
          }
        },
      },
      { name: 'qcDocNum', width: 144 },
      { name: 'qcOkQty', width: 82 },
      { name: 'qcNgQty', width: 89 },
      { name: 'supplierName', width: 200 },
      { name: 'joinPoNum', width: 144 },
      { name: 'receiveWorkerName', width: 128 },
      { name: 'actualArrivalTime', width: 136 },
      { name: 'lotNumber', width: 128 },
      { name: 'ticketTypeName', width: 128 },
      { name: 'itemControlType', width: 128 },
      {
        name: 'receiveWarehouseName',
        width: 128,
        renderer: ({ value, record }) => {
          return (
            <span>
              {record.get('receiveWarehouseCode')} {value}
            </span>
          );
        },
        tooltip: 'overflow',
      },
      { name: 'receiveWmAreaName', width: 128 },
      { name: 'lineRemark', width: 128, tooltip: 'overflow' },
    ];
    return colum;
  }

  function handleSetColor(value, text) {
    if (value === 'PASS') {
      return (
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '7px',
              height: '7px',
              marginTop: '15px',
              borderRadius: '4px',
              backgroundColor: '#558B2F',
            }}
          />
          <span style={{ marginLeft: '10px' }}>{text}</span>
        </div>
      );
    } else if (value === 'FAILED') {
      return (
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '7px',
              height: '7px',
              marginTop: '15px',
              borderRadius: '4px',
              backgroundColor: '#E64A19',
            }}
          />
          <span style={{ marginLeft: '10px' }}>{text}</span>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '7px',
              height: '7px',
              marginTop: '15px',
              borderRadius: '4px',
              backgroundColor: '#FF9800',
            }}
          />
          <span style={{ marginLeft: '10px' }}>{text}</span>
        </div>
      );
    }
  }

  /**
   * @description: 检验数据
   * @param {*}
   * @return {*}
   */
  function columns() {
    const colum = [
      {
        name: 'organizationObj',
        lock: 'left',
        width: 144,
        renderer: ({ record }) => (
          <span>
            {record.get('organizationCode')} {record.get('organizationName')}
          </span>
        ),
      },
      { name: 'joinTicketNum', width: 144, lock: 'left' },
      {
        name: 'itemObj',
        renderer: ({ record }) => (
          <span>
            {record.get('itemCode')} {record.get('itemDescription')}
          </span>
        ),
        width: 200,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'qcResult',
        renderer: ({ value, text }) => (value ? handleSetColor(value, text) : ''),
        align: 'center',
        width: 100,
      },
      { name: 'inspectionDocNum', width: 144 },
      { name: 'samplingType', width: 84 },
      { name: 'qcOkQty', width: 82 },
      { name: 'qcNgQty', width: 89 },
      { name: 'declarerName', width: 128 },
      { name: 'inspector', width: 128 },
      {
        name: 'creationDate',
        width: 136,
      },
      { name: 'judgedDate', width: 136 },
      { name: 'remark', width: 200 },
    ];
    return colum;
  }

  /**
   * @description: 切换tab操作
   * @param {*} value
   * @return {*}
   */
  async function handleChangeTab(value) {
    setTapActiveKey(value);
    if (value === 'test') {
      handleQueryIqcInspection();
      // setQueryInspection(1);
    }
  }

  /**
   * @description: 查询检验单
   * @return {*}
   */
  function handleQueryIqcInspection(name, value) {
    const queryParamsList =
      (iqcDS && iqcDS.queryDataSet && iqcDS.queryDataSet.current.toJSONData()) || {};
    if (iqcInspectionDS) {
      iqcInspectionDS.queryParameter = {};
    }
    Object.keys(queryParamsList).forEach((item) => {
      iqcInspectionDS.setQueryParameter(item, queryParamsList[item]);
    });
    if (value == null) {
      iqcInspectionDS.setQueryParameter(name, null);
    }
  }

  /**
   * @description: 切换loading
   * @param {*}
   * @return {*}
   */
  const MyLoading = function handleLoading() {
    return (
      <div className={style['my-loading']}>
        <Spin tip="Loading..." />
      </div>
    );
  };

  function handleDocumentObjectChange(record) {
    iqcDS.queryDataSet.current.set('documentObject', {});
    if (record) {
      iqcDS.queryDataSet.current.set('documentObject', {
        poId: record.poId,
        poNum: record.poNum,
      });
    }
  }

  /**
   * @description: 报检操作
   * @param {*}
   * @return {*}
   */
  async function handleInspection() {
    const { selected } = iqcDS;
    if (selected.length < 1) {
      notification.warning({
        message: '请至少选择一行数据进行编辑',
      });
      return;
    }
    const validateValue = await iqcDS.validate(true, false);
    if (!validateValue) {
      notification.warning({
        message: '您有必输项没有输入，或者输入有误，请输入必输项或者修改有误信息后重新提交',
      });
      return;
    }
    let allowSubmit = true;
    selected.forEach((item) => {
      const samplingType = item.get('samplingType');
      item.set('declarer', useWork.workerCode);
      item.set('declarerId', useWork.workerId);
      item.set('declarerObj', useWork);
      if (!samplingType) {
        allowSubmit = false;
      }
    });
    for (let i = 0; i < selected.length; i++) {
      const ticketLineStatus = selected[i].get('ticketLineStatus');
      if (!(ticketLineStatus === 'RECEIVED' || ticketLineStatus === 'RECEIVING')) {
        notification.warning({
          message: '选中行有已接收和接受中以外状态',
        });
        return;
      }
    }
    if (!allowSubmit) {
      notification.warning({
        message: '选中行有必输字段未输入',
      });
      return;
    }
    setInspectionLoading(true);
    await iqcDS
      .submit()
      .then((res) => {
        if (res) {
          setInspectionLoading(false);
          iqcDS.query(iqcDS.currentPage);
        }
      })
      .catch((err) => {
        setInspectionLoading(false);
        console.log(err);
      });
  }
  const queryBarList = useMemo(() => {
    return [
      <Lov name="organizationObj" clearButton noCache />,
      <Lov name="ticketObject" clearButton noCache />,
      <Select name="ticketLineStatus" />,
      <Lov name="partyObject" clearButton noCache />,
      <Lov name="itemObj" clearButton noCache />,
      <Lov name="documentObject" clearButton noCache onChange={handleDocumentObjectChange} />,
      <DateTimePicker name="receiveDateLeft" />,
      <DateTimePicker name="receiveDateRight" />,
      <Lov name="receiveWorkerObj" clearButton noCache />,
      <Lov name="inspectionDocObj" clearButton noCache />,
      <Select name="qcResult" />,
      <Lov name="declarerObj" clearButton noCache />,
      <Lov name="inspectorObj" clearButton noCache />,
      <Select name="qcFlag" />,
      <DateTimePicker name="creationDateLeft" />,
      <DateTimePicker name="creationDateRight" />,
      <DateTimePicker name="judgeDateLeft" />,
      <DateTimePicker name="judgeDateRight" />,
    ];
  }, []);
  return (
    <Fragment>
      <Header title="IQC检验">
        <Button onClick={handleInspection} loading={inspectionLoading} color="primary">
          报检
        </Button>
      </Header>
      <Content>
        <div className={style['iqc-test-table']}>
          <Form dataSet={iqcDS.queryDataSet} columns={useChange}>
            {isMoreQuery
              ? queryBarList.slice(0, queryBarList.length)
              : queryBarList.slice(0, useChange)}
          </Form>
          <div style={{ display: 'inline-flex', paddingTop: '11px' }}>
            <Button
              onClick={() => {
                setMoreQuery(!MoreQuery);
              }}
            >
              {MoreQuery ? '收起查询' : '更多查询'}
            </Button>
            <Button onClick={handleReset}>重置</Button>
            <Button color="primary" onClick={handleSearch}>
              查询
            </Button>
          </div>
        </div>
        <div className={style['my-table-switch']}>
          <Tabs defaultActiveKey="main" onChange={handleChangeTab}>
            <TabPane tab="收货" key="main">
              {!loading ? (
                <Table dataSet={iqcDS} columns={mainColumns()} queryBar="none" editMode="cell" />
              ) : (
                MyLoading()
              )}
            </TabPane>
            <TabPane tab="检验" key="test">
              {!loading ? (
                <Table
                  dataSet={iqcInspectionDS}
                  columns={columns()}
                  queryBar="none"
                  selectionMode="none"
                />
              ) : (
                MyLoading()
              )}
            </TabPane>
          </Tabs>
        </div>
      </Content>
    </Fragment>
  );
}
