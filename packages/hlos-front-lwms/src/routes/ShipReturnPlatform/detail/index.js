/**
 * @Description: 销售退货单平台详情页面
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-11-18 15:38:08
 * @LastEditors: yu.na
 */

import React, { useState, useEffect } from 'react';
import {
  Lov,
  Form,
  Select,
  TextField,
  Button,
  Modal,
  DatePicker,
  DataSet,
  Switch,
  Tabs,
} from 'choerodon-ui/pro';
import { Divider, Card, Icon, Tooltip } from 'choerodon-ui';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { DetailDS } from '@/stores/shipReturnPlatformDS';
import {
  closeShipReturn,
  cancelShipReturn,
  releaseShipReturn,
  submitShipReturn,
  closeShipReturnLine,
  cancelShipReturnLine,
} from '@/services/shipReturnService';

import MainLineTable from './MainLineTable';
import ReceiveLineTable from './ReceiveLineTable';

const { TabPane } = Tabs;
const preCode = 'lwms.shipReturnPlatform';

const detailFactory = () => new DataSet(DetailDS());

const ShipReturnDetail = (props) => {
  const detailDS = useDataSet(detailFactory, ShipReturnDetail);
  const [docProcessRule, setDocProcessRule] = useState('');
  const [showFlag, changeShowFlag] = useState(false);
  const [allDisabled, setAllDisabled] = useState(false);
  const [cancelLineLoading, setCancelLineLoading] = useState(false);
  const [closeLineLoading, setCloseLineLoading] = useState(false);
  const [deleteLineLoading, setDeleteLineLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isDirty, setDirty] = useState(false);

  useEffect(() => {
    refreshPage();
  }, []);

  useDataSetEvent(detailDS, 'update', ({ dataSet }) => {
    setDirty(dataSet.dirty);
  });

  const refreshPage = async () => {
    const {
      match: {
        params: { shipReturnId },
      },
    } = props;
    detailDS.queryParameter = {
      shipReturnId,
    };
    const res = await detailDS.query();
    if (res && res.content && res.content[0]) {
      const { docProcessRule: rule, shipReturnStatus } = res.content[0];
      if (rule) {
        setDocProcessRule(rule);
      }
      if (
        shipReturnStatus === 'COMPLETED' ||
        shipReturnStatus === 'CLOSED' ||
        shipReturnStatus === 'CANCELLED'
      ) {
        setAllDisabled(true);
      }
    }
  };

  const buttons = () => {
    return [
      <Button
        key="delete"
        funcType="flat"
        loading={deleteLineLoading}
        onClick={handleLineDel}
        disabled={allDisabled}
      >
        {intl.get('hzero.common.button.delete').d('删除')}
      </Button>,
      <Button
        key="cancel"
        funcType="flat"
        loading={cancelLineLoading}
        onClick={handleLineCancel}
        disabled={allDisabled}
      >
        {intl.get('hzero.common.button.cancel').d('取消')}
      </Button>,
      <Button
        key="close"
        funcType="flat"
        loading={closeLineLoading}
        onClick={handleLineClose}
        disabled={allDisabled}
      >
        {intl.get('hzero.common.button.close').d('关闭')}
      </Button>,
    ];
  };

  const checkSelect = () => {
    const selectedList = detailDS.children.lineList.selected;
    if (!selectedList.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return false;
    }
    return true;
  };

  const handleLineDel = async () => {
    const flag = checkSelect();
    if (!flag) return;
    const ds = detailDS.children.lineList;
    if (ds.selected.every((i) => i.data.returnLineStatus === 'NEW')) {
      setDeleteLineLoading(true);
      const res = await ds.delete(ds.selected);
      setDeleteLineLoading(false);
      if (getResponse(res)) {
        sessionStorage.setItem('shipReturnRefresh', true);
        notification.success();
        refreshPage();
      }
    } else {
      notification.warning({
        message: '仅销售退货单状态为“新增NEW”时才可对单据内的数据进行删除',
      });
    }
  };

  const handleLineCancel = async () => {
    Modal.confirm({
      children: <p>确认取消？</p>,
    }).then(async (button) => {
      if (button === 'ok') {
        const flag = checkSelect();
        if (!flag) return;
        const ds = detailDS.children.lineList;
        if (
          ds.selected.every(
            (i) => i.data.returnLineStatus === 'NEW' || i.data.returnLineStatus === 'RELEASED'
          )
        ) {
          const ids = ds.selected.map((i) => i.data.returnLineId);
          setCancelLineLoading(true);
          const res = await cancelShipReturnLine(ids);
          setCancelLineLoading(false);
          if (getResponse(res)) {
            sessionStorage.setItem('shipReturnRefresh', true);
            notification.success();
            refreshPage();
          }
        } else {
          notification.warning({
            message: '仅销售退货单状态为“新增NEW” 和“已提交RELEASED”时才可对单据内的数据进行取消',
          });
        }
      }
    });
  };

  const handleLineClose = async () => {
    Modal.confirm({
      children: <p>确认关闭？</p>,
    }).then(async (button) => {
      if (button === 'ok') {
        const flag = checkSelect();
        if (!flag) return;
        const ds = detailDS.children.lineList;
        if (
          ds.selected.every(
            (i) => i.data.returnLineStatus === 'NEW' || i.data.returnLineStatus === 'RELEASED'
          )
        ) {
          const ids = ds.selected.map((i) => i.data.returnLineId);
          setCloseLineLoading(true);
          const res = await closeShipReturnLine(ids);
          setCloseLineLoading(false);
          if (getResponse(res)) {
            sessionStorage.setItem('shipReturnRefresh', true);
            notification.success();
            refreshPage();
          }
        } else {
          notification.warning({
            message: '仅销售退货单状态为“新增NEW” 和“已提交RELEASED”时才可对单据内的数据进行关闭',
          });
        }
      }
    });
  };

  /**
   * 切换显示隐藏
   */
  const handleToggle = () => {
    changeShowFlag(!showFlag);
  };

  const handleAdd = () => {
    props.history.push({
      pathname: `/lwms/ship-return-platform/create`,
    });
  };

  const lineProps = {
    dataSet: detailDS.children.lineList,
    buttons: buttons(),
  };

  const handleClose = async () => {
    Modal.confirm({
      children: <p>确认关闭？</p>,
    }).then(async (button) => {
      if (button === 'ok') {
        if (
          detailDS.current.data.shipReturnStatus !== 'NEW' &&
          detailDS.current.data.shipReturnStatus !== 'CANCELLED' &&
          detailDS.current.data.shipReturnStatus !== 'CLOSED'
        ) {
          setCloseLoading(true);
          const res = await closeShipReturn([detailDS.current.data.shipReturnId]);
          setCloseLoading(false);
          if (getResponse(res)) {
            sessionStorage.setItem('shipReturnRefresh', true);
            notification.success();
            refreshPage();
          }
        } else {
          notification.warning({
            message:
              '仅销售退货单状态不为 “新增NEW”、“已取消CANCELLED”和“已关闭CLOSED”时才可对单据内的数据进行关闭',
          });
        }
      }
    });
  };
  const handleCancel = async () => {
    Modal.confirm({
      children: <p>确认取消？</p>,
    }).then(async (button) => {
      if (button === 'ok') {
        if (
          detailDS.current.data.shipReturnStatus === 'NEW' ||
          detailDS.current.data.shipReturnStatus === 'RELEASED'
        ) {
          setCancelLoading(true);
          const res = await cancelShipReturn([detailDS.current.data.shipReturnId]);
          setCancelLoading(false);
          if (getResponse(res)) {
            sessionStorage.setItem('shipReturnRefresh', true);
            notification.success();
            refreshPage();
          }
        } else {
          notification.warning({
            message: '仅销售退货单状态为“新增NEW” 和“已提交RELEASED”时才可对单据内的数据进行取消',
          });
        }
      }
    });
  };

  const handleSubmit = async () => {
    if (detailDS.current.data.shipReturnStatus === 'NEW') {
      setSubmitLoading(true);
      const res = await releaseShipReturn([detailDS.current.data.shipReturnId]);
      setSubmitLoading(false);
      if (getResponse(res)) {
        sessionStorage.setItem('shipReturnRefresh', true);
        notification.success();
        refreshPage();
      }
    } else {
      notification.warning({
        message: '仅销售退货单状态为“新增NEW”时才可对单据内的数据进行提交',
      });
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    const res = await submitShipReturn({
      ...detailDS.current.toJSONData(),
      lineList: detailDS.children.lineList.map((i) => i.toJSONData()),
    });
    if (getResponse(res)) {
      sessionStorage.setItem('shipReturnRefresh', true);
      notification.success();
      refreshPage();
    }
  };

  return (
    <>
      <Header
        title={intl.get(`${preCode}.view.title.detail`).d('销售退货单明细')}
        backPath="/lwms/ship-return-platform/list"
        isChange={isDirty}
      >
        <ButtonPermission
          type="c7n-pro"
          icon="add"
          color={allDisabled ? 'default' : 'primary'}
          onClick={handleAdd}
          disabled={allDisabled}
          permissionList={[
            {
              code: 'hlos.lwms.ship.return.ps.button.create',
              type: 'button',
              meaning: '新建',
            },
          ]}
        >
          {intl.get('hzero.common.button.add').d('新增')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={handleClose}
          loading={closeLoading}
          disabled={allDisabled}
          permissionList={[
            {
              code: 'hlos.lwms.ship.return.ps.button.close',
              type: 'button',
              meaning: '关闭',
            },
          ]}
        >
          {intl.get('hzero.common.button.close').d('关闭')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={handleCancel}
          loading={cancelLoading}
          disabled={allDisabled}
          permissionList={[
            {
              code: 'hlos.lwms.ship.return.ps.button.cancel',
              type: 'button',
              meaning: '取消',
            },
          ]}
        >
          {intl.get('hzero.common.button.cancel').d('取消')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={handleSubmit}
          loading={submitLoading}
          disabled={allDisabled}
          permissionList={[
            {
              code: 'hlos.lwms.ship.return.ps.button.submit',
              type: 'button',
              meaning: '提交',
            },
          ]}
        >
          {intl.get('hzero.common.button.submit').d('提交')}
        </ButtonPermission>
        <ButtonPermission
          type="c7n-pro"
          onClick={handleSave}
          loading={saveLoading}
          disabled={allDisabled}
          permissionList={[
            {
              code: 'hlos.lwms.ship.return.ps.button.save',
              type: 'button',
              meaning: '保存',
            },
          ]}
        >
          {intl.get('hzero.common.button.save').d('保存')}
        </ButtonPermission>
      </Header>
      <Content>
        <Card key="ship-return-detail-header" bordered={false} className={DETAIL_CARD_CLASSNAME}>
          <Form dataSet={detailDS} columns={4}>
            <Lov name="organizationObj" disabled={allDisabled} />
            <Lov name="returnTypeObj" disabled={allDisabled} />
            <Lov name="shipReturnObj" disabled={allDisabled} />
            <Select name="shipReturnStatus" disabled={allDisabled} />
            <Lov name="customerObj" />
            <Lov name="receiveWarehouseObj" noCache disabled={allDisabled} />
            <Lov name="receiveWmAreaObj" noCache disabled={allDisabled} />
            <Lov name="creatorObj" disabled={allDisabled} />
            <Lov name="soObj" disabled={allDisabled} />
            <Lov name="demandObj" disabled={allDisabled} />
            <Lov name="shipOrderObj" disabled={allDisabled} />
            <TextField name="returnShipTicket" disabled={allDisabled} />
          </Form>
          <Divider>
            <div>
              <span onClick={handleToggle} style={{ cursor: 'pointer' }}>
                {!showFlag
                  ? `${intl.get('hzero.common.button.expand').d('展开')}`
                  : `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`}
              </span>
              <Icon type={!showFlag ? 'expand_more' : 'expand_less'} />
            </div>
          </Divider>
          <div style={!showFlag ? { display: 'none' } : { display: 'block' }}>
            <Form dataSet={detailDS} columns={4}>
              <DatePicker name="actualArrivalDate" disabled={allDisabled} />
              <Lov name="receiveWorkerObj" disabled={allDisabled} />
              <TextField name="externalId" disabled={allDisabled} />
              <TextField name="externalNum" disabled={allDisabled} />
              <TextField name="remark" colSpan={2} disabled={allDisabled} />
              <DatePicker name="peintedDate" disabled={allDisabled} />
              <Switch name="peintedFlag" disabled={allDisabled} />
            </Form>
            <div
              style={{
                display: 'inline-block',
                width: '25%',
                marginTop: '-50px',
                marginLeft: '90%',
                position: 'absolute',
                lineHeight: '50px',
              }}
            >
              <Tooltip placement="top" title={docProcessRule}>
                <a>{intl.get(`${preCode}.model.docProcessRule`).d('单据处理规则')}</a>
              </Tooltip>
            </div>
          </div>
        </Card>
        <Card
          key="ship-return-detail-line"
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        >
          <Tabs animated={{ inkBar: true, tabPane: false }} defaultActiveKey="main">
            <TabPane tab={intl.get(`${preCode}.view.title.miain`).d('主要')} key="main">
              <MainLineTable {...lineProps} />
            </TabPane>
            <TabPane tab={intl.get(`${preCode}.view.title.receive`).d('收货')} key="demand">
              <ReceiveLineTable {...lineProps} />
            </TabPane>
          </Tabs>
        </Card>
      </Content>
    </>
  );
};

export default ShipReturnDetail;
