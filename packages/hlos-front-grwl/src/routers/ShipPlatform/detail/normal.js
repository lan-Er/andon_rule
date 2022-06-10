/**
 * @Description: 普通发货单新建
 * @Author: yu.na@hand-china.com
 * @Date: 2021-01-06 10:32:33
 */

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  DataSet,
  Form,
  TextField,
  Select,
  Spin,
  Lov,
  NumberField,
  DatePicker,
  Tooltip,
} from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import { Divider, Icon } from 'choerodon-ui';
import notification from 'utils/notification';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';
import { normalHeadDS, normalLineDS } from '@/stores/shipDetailDS';
import { createShipOrder, getItemWmRule } from '@/services/shipPlatformService';

// const preCode = 'lwms.ship.model';
const todoHeadDataSetFactory = () => new DataSet({ ...normalHeadDS() });
const todoLineDataSetFactory = () => new DataSet({ ...normalLineDS() });

const ShipNormalDetail = (props) => {
  const [moreDetail, setMoreDetail] = useState(false);
  const HeadDS = useDataSet(todoHeadDataSetFactory, ShipNormalDetail);
  const LineDS = useDataSet(todoLineDataSetFactory);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [warehouseDisabled, setWarehouseDisabled] = useState(false);
  const [wmAreaDisbled, setWmAreaDisabled] = useState(false);
  const [secondDemandQtyDisabled, setsecondDemandQtyDisabled] = useState(true);

  useEffect(() => {
    const {
      location: { state },
    } = props;
    if (state && state.shipOrderTypeObj) {
      sessionStorage.setItem('shipOrderTypeObj', JSON.stringify(state.shipOrderTypeObj));
      if (HeadDS.current) {
        HeadDS.current.set('shipOrderTypeObj', state.shipOrderTypeObj);
        HeadDS.current.set('approvalRule', state.shipOrderTypeObj.approvalRule);
        HeadDS.current.set('approvalWorkflow', state.shipOrderTypeObj.approvalWorkflow);
        HeadDS.current.set('docProcessRule', state.shipOrderTypeObj.docProcessRule);
        HeadDS.current.set('docProcessRuleId', state.shipOrderTypeObj.docProcessRuleId);
      } else {
        HeadDS.create(
          {
            shipOrderTypeObj: state.shipOrderTypeObj,
            approvalRule: state.shipOrderTypeObj.approvalRule,
            approvalWorkflow: state.shipOrderTypeObj.approvalWorkflow,
            docProcessRule: state.shipOrderTypeObj.docProcessRule,
            docProcessRuleId: state.shipOrderTypeObj.docProcessRuleId,
          },
          0
        );
      }
      if (state.shipOrderTypeObj.docProcessRule) {
        const docNum =
          JSON.parse(state.shipOrderTypeObj.docProcessRule) &&
          JSON.parse(state.shipOrderTypeObj.docProcessRule).docNum;
        if (docNum === 'manual') {
          HeadDS.fields.get('shipOrderNum').set('disabled', false);
          HeadDS.fields.get('shipOrderNum').set('required', true);
        }
      }
    } else if (!state) {
      const shipOrderTypeObj = JSON.parse(sessionStorage.getItem('shipOrderTypeObj'));
      if (HeadDS.current) {
        HeadDS.current.set('shipOrderTypeObj', shipOrderTypeObj);
        HeadDS.current.set('approvalRule', shipOrderTypeObj.approvalRule);
        HeadDS.current.set('approvalWorkflow', shipOrderTypeObj.approvalWorkflow);
        HeadDS.current.set('docProcessRule', shipOrderTypeObj.docProcessRule);
        HeadDS.current.set('docProcessRuleId', shipOrderTypeObj.docProcessRuleId);
      } else {
        HeadDS.create(
          {
            shipOrderTypeObj,
            approvalRule: shipOrderTypeObj.approvalRule,
            approvalWorkflow: shipOrderTypeObj.approvalWorkflow,
            docProcessRule: shipOrderTypeObj.docProcessRule,
            docProcessRuleId: shipOrderTypeObj.docProcessRuleId,
          },
          0
        );
      }
      if (shipOrderTypeObj.docProcessRule) {
        const docNum =
          JSON.parse(shipOrderTypeObj.docProcessRule) &&
          JSON.parse(shipOrderTypeObj.docProcessRule).docNum;
        if (docNum === 'manual') {
          HeadDS.fields.get('shipOrderNum').set('disabled', false);
          HeadDS.fields.get('shipOrderNum').set('required', true);
        }
      }
    }

    defaultLovSetting();

    return () => {
      if (HeadDS.current) {
        HeadDS.remove(HeadDS.current);
      }
    };
  }, []);

  useDataSetEvent(HeadDS, 'update', ({ record, name }) => {
    setIsDirty(true);
    const { organizationObj } = record.toData();
    if (name === 'organizationObj') {
      if (!isEmpty(organizationObj)) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
      record.set({
        sopOuObj: null,
        shippingMethod: null,
        shipOrderNum: null,
        customerObj: null,
        customerSiteObj: null,
        customerName: null,
        customerAddress: null,
        warehouseObj: null,
        wmAreaObj: null,
        creatorObj: null,
        customerContact: null,
        contactPhone: null,
        contactEmail: null,
        salesmanObj: null,
        freight: null,
        currencyObj: null,
        carrier: null,
        carrierContact: null,
        plateNum: null,
        shipTicket: null,
        expectedArrivalDate: null,
        planShipDate: null,
      });
      LineDS.data = [];
    }
  });

  /**
   *设置默认值
   */
  async function defaultLovSetting() {
    const res = await userSetting({ defaultFlag: 'Y' });
    if (getResponse(res) && res.content && res.content[0]) {
      const {
        organizationId,
        organizationCode,
        organizationName,
        workerId,
        workerCode,
        workerName,
        warehouseId,
        warehouseCode,
        warehouseName,
        wmAreaId,
        wmAreaCode,
        wmAreaName,
      } = res.content[0];
      if (organizationId) {
        HeadDS.current.set('organizationObj', {
          organizationId,
          organizationCode,
          organizationName,
        });
        setIsDisabled(false);
      }
      if (workerId) {
        HeadDS.current.set('creatorObj', {
          workerId,
          workerCode,
          workerName,
        });
      }
      if (warehouseId) {
        HeadDS.current.set('warehouseObj', {
          warehouseId,
          warehouseCode,
          warehouseName,
        });
        setWarehouseDisabled(true);
      }
      if (wmAreaId) {
        HeadDS.current.set('wmAreaObj', {
          wmAreaId,
          wmAreaCode,
          wmAreaName,
        });
      }
    }
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
    record.set('shipLineNum', (currentPage - 1) * pageSize + index + 1);
    return (currentPage - 1) * pageSize + index + 1;
  }

  /**
   * 保存
   */
  async function handleSave() {
    const validateArr = await Promise.all([
      HeadDS.validate(false, false),
      LineDS.validate(false, false),
    ]);
    if (validateArr.some((i) => !i)) {
      notification.warning({
        message: '数据校验不通过',
      });
      return;
    }
    const shipOrderLineList = [];
    LineDS.forEach((i) => {
      shipOrderLineList.push(i.toJSONData());
    });
    const params = {
      ...HeadDS.current.toJSONData(),
      shipOrderLineList,
    };
    setLoading(true);
    setSaveLoading(true);
    const res = await createShipOrder(params);
    setLoading(false);
    setSaveLoading(false);
    if (getResponse(res)) {
      notification.success({
        message: `发货单${res.shipOrderNum}创建成功`,
      });
      HeadDS.current.reset();
      LineDS.data = [];
      defaultLovSetting();
      setIsDirty(false);
      sessionStorage.setItem('shipPlatformParentQuery', true);
    }
  }

  /**
   *重置
   *
   */
  function handleReset() {
    HeadDS.current.reset();
    LineDS.data = [];
    defaultLovSetting();
  }

  /**
   * 新增发货单行
   */
  async function handleAddLine() {
    setIsDirty(true);
    const {
      organizationId,
      warehouseId,
      warehouseCode,
      warehouseName,
      wmAreaId,
      wmAreaCode,
      wmAreaName,
    } = HeadDS.current.toJSONData();
    await LineDS.create(
      {
        organizationId: organizationId || null,
        warehouseId: warehouseId || null,
        warehouseCode: warehouseCode || null,
        warehouseName: warehouseName || null,
        wmAreaId: wmAreaId || null,
        wmAreaCode: wmAreaCode || null,
        wmAreaName: wmAreaName || null,
      },
      0
    );
  }

  /**
   * table列
   */
  function columns() {
    return [
      {
        name: 'shipLineNum',
        width: 70,
        lock: 'left',
        key: 'shipLineNum',
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'itemObj',
        width: 144,
        lock: 'left',
        key: 'itemObj',
        editor: <Lov onChange={handleItemChange} />,
      },
      { name: 'itemDescription', width: 200, key: 'itemDescription' },
      { name: 'uomObj', width: 70, key: 'uomObj' },
      { name: 'applyQty', width: 100, key: 'applyQty', editor: true },
      { name: 'warehouseObj', width: 144, key: 'warehouseObj', editor: !warehouseDisabled },
      { name: 'wmAreaObj', width: 144, key: 'wmAreaObj', editor: !wmAreaDisbled },
      { name: 'toWarehouseObj', width: 144, key: 'toWarehouseObj', editor: true },
      { name: 'toWmAreaObj', width: 144, key: 'toWmAreaObj', editor: true },
      { name: 'soNum', width: 144, key: 'soNum', editor: true },
      { name: 'soLineNum', width: 82, key: 'soLineNum', editor: true },
      { name: 'customerItemCode', width: 144, key: 'customerItemCode', editor: true },
      { name: 'customerItemDesc', width: 200, key: 'customerItemDesc', editor: true },
      { name: 'customerPo', width: 144, key: 'customerPo', editor: true },
      { name: 'customerPoLine', width: 82, key: 'customerPoLine', editor: true },
      { name: 'secondUomObj', width: 70, key: 'secondUomObj', editor: false },
      {
        name: 'secondApplyQty',
        width: 100,
        key: 'secondApplyQty',
        editor: !secondDemandQtyDisabled,
      },
      { name: 'shipRuleObj', width: 144, key: 'shipRuleObj', editor: true },
      { name: 'pickRuleObj', width: 144, key: 'pickRuleObj', editor: true },
      { name: 'reservationRuleObj', width: 144, key: 'reservationRuleObj', editor: true },
      { name: 'packingRuleObj', width: 144, key: 'packingRuleObj', editor: true },
      { name: 'wmInspectRuleObj', width: 144, key: 'wmInspectRuleObj', editor: true },
      { name: 'fifoRuleObj', width: 144, key: 'fifoRuleObj', editor: true },
      { name: 'packingFormat', width: 128, key: 'packingFormat', editor: true },
      { name: 'packingQty', width: 100, key: 'packingQty', editor: true },
      { name: 'minPackingQty', width: 100, key: 'minPackingQty', editor: true },
      { name: 'containerQty', width: 100, key: 'containerQty', editor: true },
      { name: 'palletContainerQty', width: 100, key: 'palletContainerQty', editor: true },
      { name: 'packageNum', width: 144, key: 'packageNum', editor: true },
      { name: 'tagTemplate', width: 144, key: 'tagTemplate', editor: true },
      { name: 'lotNumber', width: 144, key: 'lotNumber', editor: true },
      { name: 'tagCode', width: 144, key: 'tagCode', editor: true },
      // { name: 'itemControlType', width: 100, key: 'itemControlType', editor: true },
      { name: 'lineRemark', width: 200, key: 'lineRemark', editor: true },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record, dataSet }) => {
          return [
            <Tooltip
              key="cancel"
              placement="bottom"
              title={intl.get('hzero.common.button.cancel').d('取消')}
            >
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => removeData(record, dataSet)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  function removeData(record, dataSet) {
    dataSet.remove(record);
  }

  async function handleItemChange(rec) {
    if (rec) {
      const { itemId, itemCode, uomId, uom, uomName, secondUomId, secondUom, secondUomName } = rec;
      if (uomId) {
        LineDS.current.set('uomObj', {
          uomId,
          uomCode: uom,
          uomName,
        });
      }
      LineDS.current.set('secondUomObj', null);
      if (secondUomId) {
        LineDS.current.set('secondUomObj', {
          uomId: secondUomId,
          uomCode: secondUom,
          uomName: secondUomName,
        });
        setsecondDemandQtyDisabled(false);
      } else {
        setsecondDemandQtyDisabled(true);
      }
      // 获取 拣料规则，装箱规则，FIFO规则，预留规则，仓库质检规则
      const ruleRes = await getItemWmRule([
        {
          organizationId: HeadDS.current.get('organizationId'),
          itemId,
          itemCode,
        },
      ]);
      if (ruleRes && ruleRes[0]) {
        const {
          pickRule,
          pickRuleId,
          pickRuleName,
          reservationRule,
          reservationRuleId,
          reservationRuleName,
          packingRuleId,
          packingRuleName,
          packingRule,
          wmInspectRule,
          wmInspectRuleId,
          wmInspectRuleName,
          fifoRule,
          fifoRuleId,
          fifoRuleName,
        } = ruleRes[0];
        LineDS.current.set(
          'pickRuleObj',
          pickRuleId ? { ruleId: pickRuleId, ruleName: pickRuleName, ruleJson: pickRule } : null
        );
        LineDS.current.set(
          'reservationRuleObj',
          reservationRuleId
            ? {
                ruleId: reservationRuleId,
                ruleName: reservationRuleName,
                ruleJson: reservationRule,
              }
            : null
        );
        LineDS.current.set(
          'packingRuleObj',
          packingRuleId
            ? { ruleId: packingRuleId, ruleName: packingRuleName, ruleJson: packingRule }
            : null
        );
        LineDS.current.set(
          'fifoRuleObj',
          fifoRuleId ? { ruleId: fifoRuleId, ruleName: fifoRuleName, ruleJson: fifoRule } : null
        );
        LineDS.current.set(
          'wmInspectRuleObj',
          wmInspectRuleId
            ? { ruleId: wmInspectRuleId, ruleName: wmInspectRuleName, ruleJson: wmInspectRule }
            : null
        );
      }
    } else {
      LineDS.current.set('uomObj', null);
      LineDS.current.set('secondUomObj', null);
    }
  }

  function handleWarehouseChange(record) {
    if (record) {
      setWarehouseDisabled(true);
    } else {
      setWarehouseDisabled(false);
    }
    if (LineDS.length) {
      LineDS.forEach((i) => {
        i.set({
          warehouseId: isEmpty(record) ? null : record.warehouseId,
          warehouseCode: isEmpty(record) ? null : record.warehouseCode,
          warehouseName: isEmpty(record) ? null : record.warehouseName,
        });
        i.set('wmAreaObj', null);
      });
    }
  }

  function handleWmAreaChange(record) {
    if (record) {
      setWmAreaDisabled(true);
    } else {
      setWmAreaDisabled(false);
    }
    if (LineDS.length) {
      LineDS.forEach((i) => {
        i.set({
          wmAreaId: isEmpty(record) ? null : record.wmAreaId,
          wmAreaCode: isEmpty(record) ? null : record.wmAreaCode,
          wmAreaName: isEmpty(record) ? null : record.wmAreaName,
        });
      });
    }
  }

  function lineButton() {
    return [
      <Button key="add" disabled={isDisabled} onClick={handleAddLine}>
        新增
      </Button>,
    ];
  }

  function handleSopOuChange(rec) {
    if (rec) {
      HeadDS.current.set('customerSiteObj', {
        customerSiteId: rec.customerSiteId,
        customerSiteNumber: rec.customerSiteNumber,
        customerSiteName: rec.customerSiteName,
      });
      HeadDS.current.set('customerAddress', rec.customerAddress);
    }
  }

  function handleCustomer(rec) {
    if (rec) {
      HeadDS.current.set('customerName', rec.customerName);
    }
  }

  return (
    <Spin spinning={loading}>
      <Header title="创建普通发货单" backPath="/grwl/ship-platform/list" isChange={isDirty}>
        <Button icon="save" color="primary" onClick={handleSave} loading={saveLoading}>
          保存
        </Button>
        <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
      </Header>
      <Content>
        <Form dataSet={HeadDS} columns={4}>
          <Lov name="organizationObj" key="organizationObj" />
          <Lov name="sopOuObj" key="sopOuObj" disabled={isDisabled} onChange={handleSopOuChange} />
          <Select name="shippingMethod" key="shippingMethod" disabled={isDisabled} />
          <TextField name="shipOrderNum" key="shipOrderNum" disabled={isDisabled} />
          <Lov
            name="customerObj"
            key="customerObj"
            disabled={isDisabled}
            onChange={handleCustomer}
          />
          <Lov name="customerSiteObj" key="customerSiteObj" disabled={isDisabled} />
          <TextField name="customerName" key="customerName" disabled={isDisabled} />
          <TextField name="customerAddress" key="customerAddress" disabled={isDisabled} />
          <Lov
            name="warehouseObj"
            key="warehouseObj"
            disabled={isDisabled}
            onChange={handleWarehouseChange}
          />
          <Lov
            name="wmAreaObj"
            key="wmAreaObj"
            disabled={isDisabled}
            onChange={handleWmAreaChange}
          />
          <Lov name="creatorObj" key="creatorObj" disabled={isDisabled} />
          <TextField name="customerContact" key="customerContact" disabled={isDisabled} />
          {moreDetail && <TextField name="contactPhone" key="contactPhone" disabled={isDisabled} />}
          {moreDetail && <TextField name="contactEmail" key="contactEmail" disabled={isDisabled} />}
          {moreDetail && <Lov name="salesmanObj" key="salesmanObj" disabled={isDisabled} />}
          {moreDetail && <TextField name="shipOrderGroup" key="shipOrderGroup" />}
          {moreDetail && <NumberField name="freight" key="freight" disabled={isDisabled} />}
          {moreDetail && <Lov name="currencyObj" key="currencyObj" disabled={isDisabled} />}
          {moreDetail && <TextField name="carrier" key="carrier" disabled={isDisabled} />}
          {moreDetail && (
            <TextField name="carrierContact" key="carrierContact" disabled={isDisabled} />
          )}
          {moreDetail && <TextField name="plateNum" key="plateNum" disabled={isDisabled} />}
          {moreDetail && <TextField name="shipTicket" key="shipTicket" disabled={isDisabled} />}
          {moreDetail && (
            <DatePicker
              name="expectedArrivalDate"
              key="expectedArrivalDate"
              disabled={isDisabled}
            />
          )}
          {moreDetail && (
            <DatePicker name="planShipDate" key="planShipDate" disabled={isDisabled} />
          )}
          {moreDetail && <TextField name="remark" key="remark" colSpan={2} disabled={isDisabled} />}
        </Form>
        <Divider>
          <div onClick={() => setMoreDetail(!moreDetail)}>
            <span>
              {moreDetail
                ? `${intl.get('hzero.common.button.hidden').d('隐藏')}`
                : `${intl.get('hzero.common.button.expand').d('展开')}`}
              <Icon type={!moreDetail ? 'expand_more' : 'expand_less'} />
            </span>
          </div>
        </Divider>
        <Table
          dataSet={LineDS}
          columns={columns()}
          columnResizable="true"
          queryBar="none"
          buttons={lineButton()}
        />
      </Content>
    </Spin>
  );
};

export default formatterCollections({
  code: ['lwms.ship', 'lwms.common'],
})(ShipNormalDetail);
