/*
 * @Description:送货单详情
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-15 16:28:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-17 17:37:27
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { useState, useEffect } from 'react';
import {
  Icon,
  Table,
  Button,
  DataSet,
  Form,
  TextField,
  Select,
  Spin,
  DatePicker,
  Lov,
  Output,
  Tooltip,
} from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { Divider } from 'choerodon-ui';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { queryLovData } from 'hlos-front/lib/services/api';
import { filterNullValueObject, getResponse } from 'utils/utils';
import { orderStatusRender } from 'hlos-front/lib/utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet, useDataSetIsSelected, useDataSetEvent } from 'hzero-front/lib/utils/hooks';

import codeConfig from '@/common/codeConfig';
import { detailLineDS, detailHeadDS } from '@/stores/ticketDetailDS';

const { common, lwmsTicket } = codeConfig.code;
const preCode = 'lwms.ticket.model';

const todoLineDataSetFactory = () => new DataSet({ ...detailLineDS() });
const todoHeadDataSetFactory = () => new DataSet({ ...detailHeadDS() });

const TicketCreate = (props) => {
  const HeadDS = useDataSet(todoHeadDataSetFactory, TicketCreate);
  const LineDS = useDataSet(todoLineDataSetFactory);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // “收货组织”和“送货单类型”为空是不可编辑
  const [moreDetail, setMoreDetail] = useState(false);
  const [dsDirty, setDSDirty] = useState(false);
  const [prohibitOperation, setProhibitOperation] = useState(false); // 禁止编辑和功能按钮
  const isSelected = useDataSetIsSelected(LineDS);

  const {
    dispatch,
    match: {
      params: { ticketId },
    },
    location: { pathname },
  } = props;

  useEffect(() => {
    HeadDS.setQueryParameter(ticketId, '');
    if (pathname.includes('create')) {
      HeadDS.data = [];
      LineDS.data = [];
      HeadDS.create();
      LineDS.clearCachedSelected();
      defaultLovSetting();
    } else if (pathname.includes('copy')) {
      setIsEdit(true);
      setIsDisabled(false);
      handleSearch(ticketId);
    } else {
      setIsDisabled(true);
      handleSearch(ticketId);
    }
  }, [ticketId]);

  useDataSetEvent(HeadDS, 'update', ({ record, name }) => {
    const { organizationObj, ticketTypeObj } = record.toData();
    if (name === 'organizationObj' || name === 'ticketTypeObj') {
      if (!isEmpty(organizationObj) && !isEmpty(ticketTypeObj)) {
        setIsEdit(true);
      } else {
        setIsEdit(false);
      }
      record.set({
        supplierObj: null,
        partySiteObj: null,
        ticketNumObj: null,
        scmOuObj: null,
        poNumObj: null,
        poLineNumObj: null,
        ticketStatus: null,
        buyerObj: null,
        expectedArrivalDate: null,
        carrier: null,
        carrierContact: null,
        shipTicket: null,
        deliveryArea: null,
        receiveWarehouseObj: null,
        itemObj: null,
        remark: null,
      });
      LineDS.data = [];
      LineDS.clearCachedSelected();
    }
    if (name === 'supplierObj') {
      record.set({
        partySiteObj: null,
        ticketNumObj: null,
        scmOuObj: null,
        poNumObj: null,
        poLineNumObj: null,
        ticketStatus: null,
        buyerObj: null,
        expectedArrivalDate: null,
        carrier: null,
        carrierContact: null,
        shipTicket: null,
        deliveryArea: null,
        receiveWarehouseObj: null,
        itemObj: null,
        remark: null,
      });
      LineDS.data = [];
      LineDS.clearCachedSelected();
    }
    if (name === 'poNumObj') {
      record.set({
        ticketNumObj: null,
        poLineNumObj: null,
        ticketStatus: null,
        expectedArrivalDate: null,
        carrier: null,
        carrierContact: null,
        shipTicket: null,
        deliveryArea: null,
        receiveWarehouseObj: null,
        itemObj: null,
        remark: null,
      });
      LineDS.data = [];
      LineDS.clearCachedSelected();
    }
  });

  useDataSetEvent(LineDS, 'update', ({ dataSet, record, name }) => {
    setDSDirty(dataSet.dirty);
    if (name === 'inventoryWarehouseObj') {
      record.set('inventoryWmAreaObj', null);
    }
    if (name === 'receiveWarehouseObj') {
      record.set('receiveWmAreaObj', null);
    }
    if (record.get('deliveryQty') > 0) {
      LineDS.select(record);
    } else {
      LineDS.unSelect(record);
    }
  });

  useDataSetEvent(HeadDS, 'update', ({ dataSet }) => {
    setDSDirty(dataSet.dirty);
  });

  /**
   *设置默认值
   */
  async function defaultLovSetting() {
    const res = await Promise.all([
      queryLovData({ lovCode: common.organization, defaultFlag: 'Y' }),
      queryLovData({
        lovCode: lwmsTicket.ticketType,
        defaultFlag: 'Y',
        documentClass: 'WM_DELIVERY',
        documentTypeCode: 'PO_DELIVERY_TICKET',
      }),
      queryLovData({ lovCode: lwmsTicket.buyer, defaultFlag: 'Y', workerType: 'BUYER' }),
    ]);

    if (getResponse(res)) {
      if (res[0] && res[0].content && res[0].content[0]) {
        HeadDS.current.set('organizationObj', {
          organizationId: res[0].content[0].organizationId,
          organizationCode: res[0].content[0].organizationCode,
          organizationName: res[0].content[0].organizationName,
        });
      }
      if (res[1] && res[1].content && res[1].content[0]) {
        HeadDS.current.set('ticketTypeObj', {
          documentTypeId: res[1].content[0].documentTypeId,
          documentTypeCode: res[1].content[0].documentTypeCode,
          documentTypeName: res[1].content[0].documentTypeName,
        });
      }
      if (res[2] && res[2].content && res[2].content[0]) {
        HeadDS.current.set('buyerObj', {
          workerId: res[2].content[0].workerId,
          workerName: res[2].content[0].workerName,
        });
      }
    }
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const status = ['COMPLETED', 'CLOSED', 'CANCELLED'];
    HeadDS.setQueryParameter('ticketId', ticketId);
    LineDS.setQueryParameter('ticketId', ticketId);
    LineDS.clearCachedSelected();
    await HeadDS.query().then((res) => {
      if (res && !res.failed && res.content[0]) {
        let { ticketStatus } = res.content[0];
        if (pathname.includes('copy')) {
          ticketStatus = 'NEW';
          HeadDS.current.set({ ticketNumObj: null, ticketStatus });
          setProhibitOperation(false);
          return;
        }
        if (status.includes(ticketStatus)) setProhibitOperation(true);
      }
    });
    await LineDS.query().then((res) => {
      if (res && !res.failed && pathname.includes('copy')) {
        LineDS.map((record) =>
          record.set({
            ticketId: null,
            ticketLineId: null,
            ticketLineStatusMeaning: null,
          })
        );
        LineDS.selectAll();
      }
    });
  }

  /**
   * 获取行序号
   * @param {*} record 当前行记录
   */
  function getSerialNum(record) {
    const {
      dataSet: { currentPage, pageSize },
      index,
    } = record;
    return (currentPage - 1) * pageSize + index + 1;
  }

  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { header: '序号', width: 70, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      { name: 'poNum', width: 150, lock: 'left', tooltip: 'overflow', editor: !isDisabled },
      { name: 'poLineNum', width: 150, lock: 'left', tooltip: 'overflow', editor: !isDisabled },
      { name: 'itemCode', width: 150, lock: 'left', tooltip: 'overflow', editor: !isDisabled },
      { name: 'itemDescription', tooltip: 'overflow', editor: !isDisabled },
      {
        name: 'ticketLineStatusMeaning',
        tooltip: 'overflow',
        align: 'center',
        hidden: pathname.includes('create') || pathname.includes('copy'),
        renderer: ({ value, record }) => orderStatusRender(record.get('ticketLineStatus'), value),
      },
      { name: 'uom', tooltip: 'overflow', editor: !isDisabled },
      { name: 'deliveryQty', tooltip: 'overflow', editor: !isDisabled },
      { name: 'deliverableQty', tooltip: 'overflow' },
      { name: 'toBeReceivedQty', tooltip: 'overflow' },
      { name: 'demandDate', width: 120, tooltip: 'overflow', editor: !isDisabled },
      { name: 'promiseDate', width: 120, tooltip: 'overflow', editor: !isDisabled },
      { name: 'demandQty', tooltip: 'overflow' },
      { name: 'receivedQty', tooltip: 'overflow' },
      { name: 'returnedQty', tooltip: 'overflow' },
      { name: 'packingQty', tooltip: 'overflow', editor: !isDisabled },
      { name: 'containerQty', tooltip: 'overflow', editor: !isDisabled },
      { name: 'lotNumber', tooltip: 'overflow', editor: !isDisabled },
      { name: 'secondUomObj', tooltip: 'overflow', editor: !isDisabled },
      { name: 'secondDeliveryQty', tooltip: 'overflow' },
      { name: 'receiveToleranceType', tooltip: 'overflow', editor: !isDisabled },
      { name: 'receiveTolerance', tooltip: 'overflow', editor: !isDisabled },
      { name: 'receiveRule', tooltip: 'overflow', editor: !isDisabled },
      { name: 'receiveWarehouseObj', width: 150, tooltip: 'overflow', editor: !isDisabled },
      { name: 'receiveWmAreaObj', width: 150, tooltip: 'overflow', editor: !isDisabled },
      { name: 'inventoryWarehouseObj', width: 150, tooltip: 'overflow', editor: !isDisabled },
      { name: 'inventoryWmAreaObj', width: 150, tooltip: 'overflow', editor: !isDisabled },
      // { header: '操作', command: ['edit'], width: 150, lock: 'right', hidden: isDisabled },
    ];
  }

  /**
   * 跳转编辑详情界面
   * @param {*} id 行id
   */
  function handleToEditPage(id) {
    setDSDirty(false);
    HeadDS.data = [];
    LineDS.data = [];
    LineDS.queryParameter = {};
    const pathName = `/lwms/ticket-platform/detail/${id}`;
    props.history.push(pathName);
  }

  /**
   * 保存
   */
  function handleSave() {
    setLoading(true);
    setSaveLoading(true);
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.validate(false, false);
      const validateLine = await LineDS.validate(true, false);
      const hasEmptyDeliveryQty = LineDS.selected.findIndex((item) => {
        const deliveryQty = item.get('deliveryQty');
        return deliveryQty === undefined || deliveryQty === null;
      });
      if (!validateHead || !validateLine || hasEmptyDeliveryQty !== -1) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setLoading(false));
        resolve(setSaveLoading(false));
        return false;
      }
      const headData = HeadDS.toJSONData()[0];
      const lineList = LineDS.selected.map((item) => item.toData());
      if (lineList.length === 0) {
        notification.warning({
          message: '请至少选择一条行数据',
        });
        resolve(setLoading(false));
        resolve(setSaveLoading(false));
        return false;
      }
      dispatch({
        type: 'TicketPlatform/createAndUpdate',
        payload: {
          lineList,
          ...headData,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          sessionStorage.setItem('ticketPlatform/refreshFlag', true);
          handleToEditPage(res.ticketId);
        }
        resolve(setLoading(false));
        resolve(setSaveLoading(false));
      });
    });
  }

  /**
   * 单据处理规则查看
   */
  function handleShowDocProcessRule(docProcessRule) {
    return (
      <Tooltip placement="top" title={docProcessRule}>
        <a>{intl.get(`${preCode}.model.docProcessRule`).d('单据处理规则')}</a>
      </Tooltip>
    );
  }

  /**
   * 查询送货单行
   */
  async function handleSearchLine() {
    const validate = await HeadDS.validate();
    if (!validate) {
      notification.warning({
        message: '数据校验未通过',
      });
      return false;
    }
    const {
      organizationId,
      partyId,
      scmOuId,
      poId,
      poLineId,
      buyerId,
      itemId,
    } = HeadDS.toData()[0];
    const params = filterNullValueObject({
      organizationId,
      partyId,
      scmOuId,
      poHeaderId: poId,
      poLineId,
      buyerId,
      itemId,
    });
    LineDS.setQueryParameter('queryData', params);
    LineDS.setQueryParameter('queryType', 'create');
    LineDS.query();
  }

  /**
   * 改变行状态 - 取消/关闭
   * @param {*} type 操作状态类型
   */
  function handleLineStatus(type) {
    setLoading(true);
    return new Promise(() => {
      const ticketLineIds = LineDS.selected.map((item) => item.get('ticketLineId'));
      dispatch({
        type: 'TicketPlatform/changeLineStatus',
        payload: {
          type,
          ticketLineIds,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          LineDS.query();
        }
        setLoading(false);
      });
    });
  }

  /**
   * 行表操作按钮
   */
  function getLineButtons() {
    let operationFlag = true;
    if (isDisabled && isSelected) {
      operationFlag = false;
    }
    return [
      ['add', { onClick: () => handleSearchLine(), disabled: isDisabled }],
      ['delete', { disabled: operationFlag }],
      <Button
        key="cancel"
        icon="cancel"
        loading={false}
        onClick={() => handleLineStatus('cancel')}
        disabled={operationFlag}
      >
        取消
      </Button>,
      <Button
        key="close"
        icon="close"
        loading={false}
        onClick={() => handleLineStatus('close')}
        disabled={operationFlag}
      >
        关闭
      </Button>,
    ];
  }

  return (
    <Spin spinning={loading}>
      <Header title="创建送货单" backPath="/lwms/ticket-platform" isChange={dsDirty}>
        {!isDisabled && (
          <>
            <Button
              onClick={handleSave}
              loading={saveLoading}
              icon="save"
              color="primary"
              disabled={prohibitOperation}
            >
              保存
            </Button>
          </>
        )}
      </Header>
      <Content>
        <Form dataSet={HeadDS} columns={4} header="送货单头信息">
          <Lov name="organizationObj" key="organizationObj" disabled={isDisabled} />
          <Lov name="supplierObj" key="supplierObj" disabled={!isEdit || isDisabled} />
          <Lov name="partySiteObj" key="partySiteObj" disabled={!isEdit || isDisabled} />
          <Lov name="ticketTypeObj" key="ticketTypeObj" disabled={isDisabled} />
          <Lov name="ticketNumObj" key="ticketNumObj" disabled />
          <Lov name="scmOuObj" key="scmOuObj" disabled={!isEdit || isDisabled} />
          <Lov name="poNumObj" key="poNumObj" disabled={!isEdit || isDisabled} />
          <Lov name="poLineNumObj" key="poLineNumObj" disabled={!isEdit || isDisabled} />
          <Select name="ticketStatus" key="ticketStatus" disabled />
          <Lov name="buyerObj" key="buyerObj" disabled={!isEdit || isDisabled} />
          <DatePicker
            name="expectedArrivalDate"
            key="expectedArrivalDate"
            disabled={!isEdit || isDisabled}
          />
          <TextField name="carrier" key="carrier" disabled={!isEdit || isDisabled} />
          {moreDetail && (
            <TextField
              name="carrierContact"
              key="carrierContact"
              disabled={!isEdit || isDisabled}
            />
          )}
          {moreDetail && (
            <TextField name="shipTicket" key="shipTicket" disabled={!isEdit || isDisabled} />
          )}
          {moreDetail && (
            <TextField name="deliveryArea" key="deliveryArea" disabled={!isEdit || isDisabled} />
          )}
          {moreDetail && (
            <Lov
              name="receiveWarehouseObj"
              key="receiveWarehouseObj"
              disabled={!isEdit || isDisabled}
            />
          )}
          {moreDetail && <Lov name="itemObj" key="itemObj" disabled={!isEdit || isDisabled} />}
          {moreDetail && (
            <TextField name="remark" key="remark" colSpan={2} disabled={!isEdit || isDisabled} />
          )}
          {moreDetail && (
            <Output name="rules" renderer={({ value }) => handleShowDocProcessRule(value)} />
          )}
        </Form>
        <Divider>
          <div>
            <span onClick={() => setMoreDetail(!moreDetail)} style={{ cursor: 'pointer' }}>
              {!moreDetail
                ? `${intl.get('hzero.common.button.expand').d('展开')}`
                : `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`}
            </span>
            <Icon type={moreDetail ? 'expand_less' : 'expand_more'} />
          </div>
        </Divider>
        <Table
          dataSet={LineDS}
          columns={columns()}
          columnResizable="true"
          queryBar="none"
          editMode="cell"
          buttons={getLineButtons()}
          header="送货单行信息"
        />
      </Content>
    </Spin>
  );
};

export default formatterCollections({
  code: ['lwms.ticket', 'lwms.common'],
})((props) => {
  return <TicketCreate {...props} />;
});
