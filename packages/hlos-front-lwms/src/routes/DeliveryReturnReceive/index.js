/**
 * @Description: 采购退货发出--Index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-11-29 10:22:15
 * @LastEditors: yu.na
 */

import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { DataSet, Lov, NumberField, Button, Modal } from 'choerodon-ui/pro';
import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import { closeTab } from 'utils/menuTab';
import uuidv4 from 'uuid/v4';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import CommonHeader from 'hlos-front/lib/components/CommonHeader';
import Loading from 'hlos-front/lib/components/Loading';
import { queryLovData } from 'hlos-front/lib/services/api';
// import numberUnSelectIcon from 'hlos-front/lib/assets/icons/number-unselect.svg';
// import numberSelectIcon from 'hlos-front/lib/assets/icons/number-selected.svg';
// import tagUnSelectIcon from 'hlos-front/lib/assets/icons/tag-unselect.svg';
// import tagSelectIcon from 'hlos-front/lib/assets/icons/tag-selected.svg';
// import lotUnSelectIcon from 'hlos-front/lib/assets/icons/lot-unselect.svg';
// import lotSelectIcon from 'hlos-front/lib/assets/icons/lot-selected.svg';

import { HeaderDS, QueryDS, ModalDS } from '@/stores/deliveryReturnDS';
import { deliveryPartyReturnApi } from '@/services/deliveryReturnService';
import { checkControlType } from '@/services/miscellaneousAdjustmentService';
import codeConfig from '@/common/codeConfig';
import SubHeader from './SubHeader';
import ListItem from './ListItem';
import Footer from './Footer';
import ReceiveModal from './ReceiveModal';
import styles from './index.less';

const headerFactory = () => new DataSet(HeaderDS());
const queryFactory = () => new DataSet(QueryDS());
const dsFactory = () => new DataSet(ModalDS());
const { common } = codeConfig.code;
let modal = null;
const tenantId = getCurrentOrganizationId();

const DeliveryReturnReceive = (props) => {
  const headerDS = useDataSet(headerFactory, DeliveryReturnReceive);
  const queryDS = useDataSet(queryFactory);
  const modalDS = useDataSet(dsFactory);

  const [currentWorker, setCurrentWorker] = useState({});
  const [activeKey, setActiveKey] = useState('QUANTITY');
  const [list, setList] = useState([]);
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
        queryDS.current.set('organizationId', orgRes.content[0].organizationId);
      }
    }
    async function queryDefaultLovData() {
      queryWorker();
      queryOrg();
    }
    queryDefaultLovData();
    setList([]);
  }, []);

  function handleSelectAll() {
    const _list = [];
    if (list.every((item) => item.checked)) {
      list.forEach((item) => {
        _list.push({
          ...item,
          checked: false,
        });
      });
    } else {
      list.forEach((item) => {
        _list.push({
          ...item,
          checked: true,
        });
      });
    }
    setList(_list);
  }

  function handleExit() {
    props.history.push('/workplace');
    closeTab('/pub/lwms/delivery-return');
  }

  function handleReset() {
    queryDS.current.reset();
    headerDS.current.reset();
    setList([]);
  }

  async function handleSubmit() {
    const validateValue = await headerDS.validate(false, false);
    if (!validateValue) return;
    if (!list.length) {
      notification.warning({
        message: '请选择采购退货单',
      });
      return;
    }
    const checkedList = [];
    list.forEach((i) => {
      if (i.checked) {
        checkedList.push(i);
      }
    });
    if (!checkedList.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const params = {
      ...headerDS.current.toJSONData(),
      lineList: checkedList,
    };
    setSubmitLoading(true);
    const res = await deliveryPartyReturnApi([params]);
    if (getResponse(res)) {
      notification.success();
      setList([]);
    }
    setSubmitLoading(false);
  }

  async function handleShowModal(controlType, flag, rec) {
    let data = {};
    if (flag) {
      const validate = await queryDS.validate(false, false);
      if (!validate) return;
      data = { ...queryDS.current.toJSONData() };
    }
    let _warehouseObj = headerDS.current.get('warehouseObj');
    if (!isEmpty(rec)) {
      data = rec;
      const {
        returnWarehouseId,
        returnWarehouseCode,
        returnWarehouseName,
        returnWmAreaId,
        returnWmAreaCode,
        returnWmAreaName,
        poNum,
        returnReason,
      } = rec;
      _warehouseObj = {
        warehouseId: returnWarehouseId,
        warehouseCode: returnWarehouseCode,
        warehouseName: returnWarehouseName,
      };
      modalDS.current.set('poNum', poNum);
      modalDS.current.set('returnReason', returnReason);
      modalDS.current.set('warehouseObj', _warehouseObj);
      modalDS.current.set('wmAreaObj', {
        wmAreaId: returnWmAreaId,
        wmAreaCode: returnWmAreaCode,
        wmAreaName: returnWmAreaName,
      });
    }
    let title = '数量';
    if (controlType === 'LOT') {
      title = '批次退货';
    } else if (controlType === 'TAG') {
      title = '标签退货';
    }
    modal = Modal.open({
      key: 'lwms-delivery-return-receice-modal',
      className: `${styles['lwms-delivery-return-receive-modal']} ${
        controlType === 'QUANTITY' && styles.quantity
      }`,
      title,
      children: (
        <ReceiveModal
          ds={modalDS}
          type={data.itemControlType || activeKey}
          record={data}
          modalList={data.receiveList}
          qty={data.totalQty}
          selectQty={data.returnedQty}
          organizationId={headerDS.current.get('organizationId')}
          warehouseObj={_warehouseObj}
          onModalSave={handleModalSave}
          onModalCancel={handleModalCancel}
        />
      ),
      destroyOnClose: true,
      footer: null,
    });
  }

  async function handleModalSave(record, modalList, totalQty, returnedQty) {
    const validateValue = await modalDS.validate(false, false);
    if (!validateValue) return;
    const _list = list.slice();
    const type = record.itemControlType || activeKey;
    const idx = _list.findIndex((i) => i.uuid === record.uuid);
    if (idx !== -1) {
      _list.splice(idx, 1, {
        ..._list[idx],
        ...record,
        checked: true,
        returnedQty: type === 'QUANTITY' ? record.returnedQty : returnedQty,
        totalQty,
        receiveList: type === 'QUANTITY' ? [{ returnedQty: record.returnedQty }] : modalList,
      });
    } else {
      _list.push({
        ...record,
        uuid: uuidv4(),
        checked: true,
        itemControlType: activeKey,
        returnedQty: type === 'QUANTITY' ? record.returnedQty : returnedQty,
        totalQty,
        receiveList: type === 'QUANTITY' ? [{ returnedQty: record.returnedQty }] : modalList,
      });
    }
    setList(_list);

    queryDS.current.reset();
    modalDS.current.reset();
    modal.close();
  }

  function handleModalCancel() {
    modalDS.current.reset();
    modal.close();
  }

  function handleItemCheck(data, e) {
    const idx = list.findIndex((i) => i.uuid === data.uuid);
    const _list = list.slice();
    _list.splice(idx, 1, {
      ...data,
      checked: e.target.checked,
    });
    setList(_list);
  }

  function handleOrgChange(rec) {
    if (rec) {
      queryDS.current.set('organzationId', rec.organzationId);
    } else {
      queryDS.current.set('organzationId', null);
    }
  }

  function handleWorkerChange(rec) {
    setCurrentWorker(rec);
  }

  async function handleItemChange(rec) {
    const res = await checkControlType([
      {
        organizationId: queryDS.get('organizationId'),
        warehouseId: queryDS.get('warehouseId'),
        itemId: rec.itemId,
        tenantId,
        groupId: '2021', // 传入的值不做参考
      },
    ]);
    if (getResponse(res) && res[0]) {
      setActiveKey(res[0].itemControlType);
      queryDS.current.set('activeKey', res[0].itemControlType);
      if (res[0].itemControlType !== 'QUANTITY') {
        queryDS.fields.get('returnedQty').set('required', false);
      } else {
        queryDS.fields.get('returnedQty').set('required', true);
      }
    }
  }

  return (
    <div className={styles['lwms-delivery-return-receive']}>
      <CommonHeader title="采购退货发出" />
      <SubHeader
        ds={headerDS}
        currentWorker={currentWorker}
        onOrgChange={handleOrgChange}
        onWorkerChange={handleWorkerChange}
      />
      <div className={styles['lwms-delivery-return-receive-content']}>
        <div className={styles['query-area']}>
          {/* <div
            className={`${styles['tab-btn']} ${activeKey === 'QUANTITY' && styles.active}`}
            onClick={() => handleTabChange('QUANTITY')}
          >
            {activeKey === 'QUANTITY' ? (
              <img src={numberSelectIcon} alt="" />
            ) : (
              <img src={numberUnSelectIcon} alt="" />
            )}
            <span>数量</span>
          </div>
          <div
            className={`${styles['tab-btn']} ${activeKey === 'LOT' && styles.active}`}
            onClick={() => handleTabChange('LOT')}
          >
            {activeKey === 'LOT' ? (
              <img src={lotSelectIcon} alt="" />
            ) : (
              <img src={lotUnSelectIcon} alt="" />
            )}
            <span>批次</span>
          </div>
          <div
            className={`${styles['tab-btn']} ${activeKey === 'TAG' && styles.active}`}
            onClick={() => handleTabChange('TAG')}
          >
            {activeKey === 'TAG' ? (
              <img src={tagSelectIcon} alt="" />
            ) : (
              <img src={tagUnSelectIcon} alt="" />
            )}
            <span>标签</span>
          </div> */}
          <div>
            <Lov dataSet={queryDS} name="itemObj" noCache onChange={handleItemChange} />
          </div>
          <div>
            <NumberField dataSet={queryDS} name="returnedQty" disabled={activeKey !== 'QUANTITY'} />
          </div>
          <Button color="primary" onClick={() => handleShowModal(activeKey, true)}>
            添加
          </Button>
        </div>
        <div className={styles['list-area']}>
          {list.map((i) => {
            return (
              <ListItem
                key={i.uuid}
                data={i}
                type={activeKey}
                onShowModal={handleShowModal}
                onItemCheck={handleItemCheck}
              />
            );
          })}
        </div>
      </div>
      <Footer
        onSelectAll={handleSelectAll}
        onSubmit={handleSubmit}
        onReset={handleReset}
        onExit={handleExit}
      />
      {submitLoading && <Loading title="提交中..." />}
    </div>
  );
};

export default DeliveryReturnReceive;
