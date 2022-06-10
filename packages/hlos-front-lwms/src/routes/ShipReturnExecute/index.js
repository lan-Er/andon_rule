/**
 * @Description: 销售退货单执行--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-11-26 10:28:08
 * @LastEditors: yu.na
 */

import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { DataSet, Button, Lov, Modal, TextField } from 'choerodon-ui/pro';
import uuidv4 from 'uuid/v4';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { closeTab } from 'utils/menuTab';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import Loading from 'hlos-front/lib/components/Loading';
import { queryLovData } from 'hlos-front/lib/services/api';
import codeConfig from '@/common/codeConfig';
import { HeaderDS, QueryDS } from '@/stores/shipReturnExecuteDS';
import { shipReturnExecuteApi } from '@/services/shipReturnService';
import SubHeader from './SubHeader';
import ListItem from './ListItem';
import ExecuteModal from './ExecuteModal';
import Footer from './Footer';
import styles from './index.less';

const headerFactory = () => new DataSet(HeaderDS());
const queryFactory = () => new DataSet(QueryDS());
const preCode = 'lwms.shipReturnExecute';
const { common } = codeConfig.code;
let modal = null;

const ShipReturnExecute = (props) => {
  const headerDS = useDataSet(headerFactory, ShipReturnExecute);
  const queryDS = useDataSet(queryFactory);

  const [orgLock, setOrgLock] = useState(false);
  const [workerLock, setWorkerLock] = useState(false);
  const [warehouseLock, setWarehouseLock] = useState(false);
  const [currentWorker, setCurrentWorker] = useState({});
  const [list, setList] = useState([]);
  const [allChecked, changeAllChecked] = useState(false);
  const [remark, setRemark] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    async function queryWorker() {
      const workerRes = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (getResponse(workerRes) && workerRes.content && workerRes.content[0]) {
        setCurrentWorker(workerRes.content[0]);
        headerDS.current.set('workerObj', workerRes.content[0]);
      }
    }
    async function queryOrg() {
      const orgRes = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (getResponse(orgRes) && orgRes.content && orgRes.content[0]) {
        headerDS.current.set('organizationObj', orgRes.content[0]);
        queryDS.queryDataSet.current.set('organizationId', orgRes.content[0].organizationId);
      }
    }
    async function queryWarehouse() {
      const warehouseRes = await queryLovData({ lovCode: common.warehouse, defaultFlag: 'Y' });
      if (getResponse(warehouseRes) && warehouseRes.content && warehouseRes.content[0]) {
        headerDS.current.set('warehouseObj', warehouseRes.content[0]);
      }
    }
    async function queryDefaultLovData() {
      const defaultSetting = localStorage.getItem('shipReturnExecute/defaultSetting');
      if (defaultSetting && !isEmpty(JSON.parse(defaultSetting))) {
        const { workerObj, organizationObj, warehouseObj } = JSON.parse(defaultSetting);
        if (!isEmpty(workerObj)) {
          setCurrentWorker(workerObj);
          headerDS.current.set('workerObj', workerObj);
        } else {
          queryWorker();
        }
        if (!isEmpty(organizationObj)) {
          headerDS.current.set('organizationObj', organizationObj);
        } else {
          queryOrg();
        }
        if (!isEmpty(warehouseObj)) {
          headerDS.current.set('warehouseObj', warehouseObj);
        }
      } else {
        queryWorker();
        queryOrg();
      }
      queryWarehouse();
    }
    queryDefaultLovData();
  }, []);

  function handleLockClick(type) {
    if (type === 'Org') {
      setOrgLock(!orgLock);
    } else if (type === 'Worker') {
      setWorkerLock(!workerLock);
    } else if (type === 'Warehouse') {
      setWarehouseLock(!warehouseLock);
    }
  }

  async function handleSearch() {
    const res = await queryDS.query();
    if (Array.isArray(res)) {
      const _res = [];
      res.forEach((i) => {
        const params = {
          ...i,
          maxQty: (i.applyQty || 0) - (i.receivedQty || 0),
          receivedQty1: i.receivedQty,
          receivedQty: (i.applyQty || 0) - (i.receivedQty || 0),
        };
        if (i.itemControlType === 'QUANTITY') {
          _res.push({
            ...params,
            detailList: [
              {
                receivedQty: i.applyQty - (i.receivedQty || 0),
              },
            ],
          });
        } else {
          _res.push(params);
        }
      });
      setList(_res);
    }
  }

  function handleModalClose(flag) {
    if (flag) {
      Modal.confirm({
        key: Modal.key(),
        children: (
          <span>
            {intl.get(`${preCode}.view.message.exit.no.saving`).d('您尚有数据未提交，是否退出?')}
          </span>
        ),
      }).then((button) => {
        if (button === 'ok') {
          modal.close();
        }
      });
    } else {
      modal.close();
    }
  }

  function handleModalSave(qty, modalList, returnLineNum, shipReturnId) {
    const idx = list.findIndex(
      (i) => i.returnLineNum === returnLineNum && i.shipReturnId === shipReturnId
    );
    const _list = list.slice();
    let selectedQty = 0;
    modalList.forEach((i) => {
      if (i.checked) {
        selectedQty += i.receivedQty;
      }
    });
    _list.splice(idx, 1, {
      ..._list[idx],
      detailList: modalList,
      totalQty: qty,
      selectedQty,
      checked: true,
    });
    setList(_list);
    changeAllChecked(_list.every((i) => i.checked));
    modal.close();
  }

  function handleShowModal(data) {
    if (data.itemControlType === 'QUANTITY') return;
    modal = Modal.open({
      key: 'lwms-ship-return-execute-modal',
      className: `${styles['lwms-ship-return-execute-modal']}`,
      title: `添加${data.itemControlType === 'LOT' ? '批次' : '标签'}`,
      children: (
        <ExecuteModal
          type={data.itemControlType}
          itemId={data.itemid}
          qty={data.totalQty}
          shipReturnId={data.shipReturnId}
          shipReturnNum={data.shipReturnNum}
          returnLineNum={data.returnLineNum}
          modalList={data.detailList}
          onModalClose={handleModalClose}
          onModalSave={handleModalSave}
        />
      ),
      footer: null,
      movable: false,
    });
  }

  function handleSelectAll() {
    const _list = list.slice();
    _list.map((i) => {
      const _i = i;
      _i.checked = !_i.checked;
      return _i;
    });
    setList(_list);
    changeAllChecked(!allChecked);
  }

  function setLockData() {
    const { workerObj, organizationObj, warehouseObj } = headerDS.current.data;
    let params = {};
    if (workerLock) {
      params = {
        ...params,
        workerObj,
      };
    }
    if (orgLock) {
      params = {
        ...params,
        organizationObj,
      };
    }
    if (warehouseLock) {
      params = {
        ...params,
        warehouseObj,
      };
    }
    localStorage.setItem('shipReturnExecute/defaultSetting', JSON.stringify(params));
  }

  function handleExit() {
    if (list.length) {
      Modal.confirm({
        key: Modal.key(),
        children: (
          <span>
            {intl.get(`${preCode}.view.message.exit.no.saving`).d('您尚有数据未提交，是否退出?')}
          </span>
        ),
      }).then((button) => {
        if (button === 'ok') {
          setLockData();
          props.history.push('/workplace');
          closeTab('/pub/lwms/ship-return-execute');
        }
      });
    } else {
      setLockData();
      props.history.push('/workplace');
      closeTab('/pub/lwms/ship-return-execute');
    }
  }

  function handleReset() {
    const { workerObj, organizationObj, warehouseObj, organizationId } = headerDS.current.data;
    headerDS.current.reset();
    if (workerLock) {
      headerDS.current.set('workerObj', workerObj);
    }
    if (orgLock) {
      headerDS.current.set('organizationObj', organizationObj);
    }
    if (warehouseLock) {
      headerDS.current.set('warehouseObj', warehouseObj);
    }
    queryDS.queryDataSet.current.reset();
    queryDS.queryDataSet.current.set('organizationId', organizationId);
    setList([]);
  }

  function handlePicture() {}

  function handleShowRemarkModal() {
    Modal.open({
      key: 'lwms-ship-return-execute-modal',
      title: '备注',
      className: `${styles['lwms-ship-return-execute-modal']} ${styles.remark}`,
      movable: false,
      children: (
        <TextField
          dataSet={headerDS}
          name="remark"
          style={{ marginTop: 30, height: 48, width: '100%' }}
        />
      ),
      onOk: () => setRemark(headerDS.current.get('remark')),
      onCancel: () => headerDS.current.set('remark', remark),
    });
  }

  async function handleSubmit() {
    const validateValue = await headerDS.validate(false, false);
    if (!validateValue) return;
    if (!list.length) {
      notification.warning({
        message: '请选择销售订单',
      });
      return;
    }
    const { shipReturnId, shipReturnNum } = queryDS.queryDataSet.current.toJSONData();
    const {
      warehouseId,
      warehouseCode,
      wmAreaId,
      wmAreaCode,
      organizationId,
    } = headerDS.current.toJSONData();
    const lineList = [];
    let params = [];
    const submitList = [];
    list.forEach((i) => {
      if (i.checked) {
        lineList.push({
          ...i,
          detailList:
            i.itemControlType === 'QUANTITY' ? i.detailList : i.detailList.filter((c) => c.checked),
          shipReturnLineId: i.returnLineId,
          shipReturnLineNum: i.returnLineNum,
          warehouseId,
          warehouseCode,
          wmAreaId,
          wmAreaCode,
        });
      }
    });
    if (shipReturnId) {
      params = [
        {
          ...headerDS.current.toJSONData(),
          shipReturnId,
          shipReturnNum,
          lineList,
        },
      ];
    } else {
      lineList.forEach((i) => {
        const idx = submitList.findIndex((s) => s.shipReturnId === i.shipReturnId);
        if (idx !== -1) {
          submitList[idx].lineList.push(i);
        } else {
          submitList.push({
            ...headerDS.current.toJSONData(),
            shipReturnId: i.shipReturnId,
            shipReturnNum: i.shipReturnNum,
            lineList: [i],
          });
        }
      });
      params = submitList;
    }
    setSubmitLoading(true);
    const res = await shipReturnExecuteApi(params);
    if (getResponse(res)) {
      notification.success();
      queryDS.queryDataSet.current.reset();
      queryDS.queryDataSet.current.set('organizationId', organizationId);
      setList([]);
    }
    setSubmitLoading(false);
  }

  function handleQueryChange(record, type) {
    if (record) {
      if (record.shipReturnId) {
        queryDS.queryDataSet.fields.get('customerObj').set('required', false);
      } else if (record.customerId) {
        queryDS.queryDataSet.fields.get('shipReturnObj').set('required', false);
      }
    } else if (type === 'shipReturn') {
      queryDS.queryDataSet.fields.get('customerObj').set('required', true);
    } else if (type === 'customer') {
      queryDS.queryDataSet.fields.get('shipReturnObj').set('required', true);
    }
  }

  function handleNumChange(val, record) {
    const idx = list.findIndex(
      (i) => i.returnLineNum === record.returnLineNum && i.shipReturnId === record.shipReturnId
    );
    const _list = list.slice();
    if (record.maxQty !== undefined && record.maxQty !== null && val > record.maxQty) {
      _list.splice(idx, 1, {
        ...record,
        receivedQty: record.maxQty,
        checked: true,
        detailList: [
          {
            receivedQty: record.maxQty,
          },
        ],
      });
    } else {
      _list.splice(idx, 1, {
        ...record,
        receivedQty: val,
        checked: true,
        detailList: [
          {
            receivedQty: val,
          },
        ],
      });
    }
    setList(_list);
  }

  function handleItemCheck(data, e) {
    const idx = list.findIndex(
      (i) => i.returnLineNum === data.returnLineNum && i.shipReturnId === data.shipReturnId
    );
    const _list = list.slice();
    _list.splice(idx, 1, {
      ...data,
      checked: e.target.checked,
    });
    setList(_list);
  }

  function handleOrgChange(rec) {
    if (rec) {
      queryDS.queryDataSet.current.set('organizationId', rec.organizationId);
    } else {
      queryDS.queryDataSet.current.set('organizationId', null);
    }
  }

  return (
    <div className={styles['lwms-ship-return-execute']}>
      <CommonHeader title="销售退货单执行" />
      <SubHeader
        ds={headerDS}
        orgLock={orgLock}
        workerLock={workerLock}
        warehouseLock={warehouseLock}
        currentWorker={currentWorker}
        onLockClick={handleLockClick}
        onOrgChange={handleOrgChange}
      />
      <div className={styles['lwms-ship-return-execute-content']}>
        <div className={styles['query-area']}>
          <Lov
            dataSet={queryDS.queryDataSet}
            name="shipReturnObj"
            placeholder="销售退货单号"
            onChange={(rec) => handleQueryChange(rec, 'shipReturn')}
          />
          <Lov
            dataSet={queryDS.queryDataSet}
            name="customerObj"
            placeholder="客户"
            onChange={(rec) => handleQueryChange(rec, 'customer')}
          />
          <Lov dataSet={queryDS.queryDataSet} name="itemObj" placeholder="物料" />
          <Button color="primary" onClick={handleSearch}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </div>
        <div className={styles['list-area']}>
          {list.map((i) => {
            return (
              <ListItem
                key={uuidv4()}
                data={i}
                onShowModal={handleShowModal}
                onNumChange={handleNumChange}
                onItemCheck={handleItemCheck}
              />
            );
          })}
        </div>
        <Footer
          onSelectAll={handleSelectAll}
          onPicture={handlePicture}
          onSubmit={handleSubmit}
          onReset={handleReset}
          onRemark={handleShowRemarkModal}
          onExit={handleExit}
        />
        {submitLoading && <Loading title="提交中..." />}
      </div>
    </div>
  );
};

export default ShipReturnExecute;
