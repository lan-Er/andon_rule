/**
 * @Description: 销售发货单新建
 * @Author: yu.na@hand-china.com
 * @Date: 2020-08-26 10:32:33
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
  DateTimePicker,
} from 'choerodon-ui/pro';
import { Divider, Icon } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { filterNullValueObject, getResponse } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';
import { detailHeadDS, detailLineDS } from '@/stores/shipDetailDS';
import { createShipOrder } from '@/services/shipPlatformService';

// const preCode = 'lwms.ship.model';
const todoHeadDataSetFactory = () => new DataSet({ ...detailHeadDS() });
const todoLineDataSetFactory = () => new DataSet({ ...detailLineDS() });

const ShipDetail = (props) => {
  const [moreDetail, setMoreDetail] = useState(false);
  const HeadDS = useDataSet(todoHeadDataSetFactory, ShipDetail);
  const LineDS = useDataSet(todoLineDataSetFactory);
  // const HeadDS = useDataSet(() => new DataSet(detailHeadDS()), ShipDetail);
  // const LineDS = useDataSet(() => new DataSet(detailLineDS()));
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [warehouseDisabled, setWarehouseDisabled] = useState(false);
  const [wmAreaDisbled, setWmAreaDisabled] = useState(false);

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
    } else if (!state) {
      if (HeadDS.current) {
        HeadDS.current.set('shipOrderTypeObj', sessionStorage.getItem('shipOrderTypeObj'));
        HeadDS.current.set('approvalRule', sessionStorage.getItem('shipOrderTypeObj').approvalRule);
        HeadDS.current.set(
          'approvalWorkflow',
          sessionStorage.getItem('shipOrderTypeObj').approvalWorkflow
        );
        HeadDS.current.set(
          'docProcessRule',
          sessionStorage.getItem('shipOrderTypeObj').docProcessRule
        );
        HeadDS.current.set(
          'docProcessRuleId',
          sessionStorage.getItem('shipOrderTypeObj').docProcessRuleId
        );
      } else {
        HeadDS.create(
          {
            shipOrderTypeObj: sessionStorage.getItem('shipOrderTypeObj'),
            approvalRule: sessionStorage.getItem('shipOrderTypeObj').approvalRule,
            approvalWorkflow: sessionStorage.getItem('shipOrderTypeObj').approvalWorkflow,
            docProcessRule: sessionStorage.getItem('shipOrderTypeObj').docProcessRule,
            docProcessRuleId: sessionStorage.getItem('shipOrderTypeObj').docProcessRuleId,
          },
          0
        );
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
    const { organizationObj, soNumObj } = record.toData();
    if (name === 'organizationObj' || name === 'soNumObj') {
      if (!isEmpty(organizationObj) && !isEmpty(soNumObj)) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
      record.set({
        warehouseObj: null,
        wmAreaObj: null,
        itemObj: null,
        planShipDate: null,
        // creatorObj: null,
        shippingMethod: null,
        freight: null,
        currencyObj: null,
        carrier: null,
        carrierContact: null,
        remark: null,
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
      } = res.content[0];
      HeadDS.current.set('organizationObj', {
        organizationId,
        organizationCode,
        organizationName,
      });
      HeadDS.current.set('creatorObj', {
        workerId,
        workerCode,
        workerName,
      });
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
    return (currentPage - 1) * pageSize + index + 1;
  }

  /**
   * 保存
   */
  async function handleSave() {
    const validateArr = await Promise.all([
      HeadDS.validate(false, false),
      LineDS.validate(true, false),
    ]);
    if (validateArr.some((i) => !i)) {
      notification.warning({
        message: '数据校验不通过',
      });
      return;
    }
    if (!LineDS.selected.length) {
      notification.warning({
        message: '未选中发货单行',
      });
      return;
    }
    const shipOrderLineList = [];
    LineDS.selected.forEach((i) => {
      const obj = {
        ...i.toJSONData(),
        soId: i.toJSONData().soHeaderId,
        shippedQty: null,
        _status: 'create',
      };
      shipOrderLineList.push(filterNullValueObject(obj));
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
   * 查询发货单行
   */
  async function handleSearchLine() {
    const validate = await HeadDS.validate();
    if (!validate) {
      notification.warning({
        message: '数据校验不通过',
      });
      return;
    }
    const {
      organizationId,
      soNum,
      itemId,
      warehouseId,
      warehouseCode,
      warehouseName,
      wmAreaId,
      wmAreaCode,
      wmAreaName,
    } = HeadDS.current.toJSONData();
    const params = filterNullValueObject({
      shipOrganizationId: organizationId,
      soNum,
      itemId,
    });
    LineDS.setQueryParameter('queryData', params);
    const result = await LineDS.query();
    const data = filterNullValueObject({
      organizationId,
      warehouseId,
      warehouseCode,
      warehouseName,
      wmAreaId,
      wmAreaCode,
      wmAreaName,
    });
    if (getResponse(result) && !isEmpty(result.content)) {
      LineDS.forEach((record) => {
        record.set({
          ...data,
          promiseShipDate: record.data.promiseDate,
          shipLineNum: getSerialNum(record),
          undoQty: (record.data.demandQty || 0) - (record.data.shippedQty || 0),
          applyQty: (record.data.demandQty || 0) - (record.data.shippedQty || 0),
          customerReceiveType: data.customerReceiveType,
          customerReceiveOrg: data.customerReceiveOrg,
          customerReceiveWm: data.customerReceiveWm,
          customerInventoryWm: data.customerInventoryWm,
        });
      });
      LineDS.records.forEach((record) => {
        // eslint-disable-next-line no-param-reassign
        record.isSelected = true;
      });
    }
  }

  // function handleItemChange(rec) {
  //   if (rec) {
  //     const { secondUomId, secondUom, secondUomName } = rec;
  //     if (secondUomId) {
  //       LineDS.current.set('secondUomObj', {
  //         uomId: secondUomId,
  //         uomCode: secondUom,
  //         uomName: secondUomName,
  //       });
  //     }
  //   }
  // }

  /**
   * table列
   */
  function columns() {
    return [
      { name: 'shipLineNum', width: 70, lock: 'left', key: 'shipLineNum' },
      { name: 'soNum', width: 144, lock: 'left', key: 'soNum', renderer: soRender },
      {
        name: 'itemObj',
        width: 128,
        lock: 'left',
        key: 'itemObj',
        editor: false,
        // editor: <Lov onChange={handleItemChange} />,
      },
      { name: 'itemDescription', width: 200, key: 'itemDescription' },
      { name: 'uomObj', width: 70, key: 'uomObj' },
      {
        name: 'applyQty',
        width: 100,
        key: 'applyQty',
        editor: <NumberField onChange={handleQtyChange} />,
      },
      { name: 'undoQty', width: 84, key: 'undoQty' },
      { name: 'warehouseObj', width: 144, key: 'warehouseObj', editor: !warehouseDisabled },
      { name: 'wmAreaObj', width: 144, key: 'wmAreaObj', editor: !wmAreaDisbled },
      { name: 'promiseShipDate', width: 100, key: 'promiseShipDate', editor: false },
      { name: 'demandDate', width: 100, key: 'demandDate' },
      { name: 'secondUomObj', width: 70, key: 'secondUomObj', editor: false },
      { name: 'secondApplyQty', width: 100, key: 'secondApplyQty', editor: editorRenderer },
      { name: 'shipRuleObj', width: 144, key: 'shipRuleObj', editor: true },
      { name: 'reservationRuleObj', width: 144, key: 'reservationRuleObj', editor: true },
      { name: 'pickRuleObj', width: 144, key: 'pickRuleObj', editor: true },
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
      { name: 'customerPo', width: 128, key: 'customerPo' },
      { name: 'customerPoLine', width: 70, key: 'customerPoLine' },
      { name: 'customerItemCode', width: 128, key: 'customerItemCode' },
      { name: 'customerItemDesc', width: 200, key: 'customerItemDesc' },
      { name: 'customerReceiveType', width: 84, key: 'customerReceiveType', editor: true },
      { name: 'customerReceiveOrg', width: 144, key: 'customerReceiveOrg', editor: true },
      { name: 'customerReceiveWm', width: 144, key: 'customerReceiveWm', editor: true },
      { name: 'customerInventoryWm', width: 144, key: 'customerInventoryWm', editor: true },
      // { name: 'itemControlType', width: 100, key: 'itemControlType', editor: true },
      { name: 'lineRemark', width: 200, key: 'lineRemark', editor: true },
    ];
  }

  /**
   * 判断是否可编辑
   * @param {*} record
   */
  function editorRenderer(record) {
    return !!record.get('secondUomId');
  }

  function handleQtyChange() {
    LineDS.select(LineDS.current);
  }

  function soRender({ value, record }) {
    return (
      <span>
        {' '}
        {value || ''}
        <span>{record.data.soLineNum && `-${record.data.soLineNum}`}</span>
      </span>
    );
  }

  // function handleSoNumChange(record) {
  //   const { address } = record;
  //   if (record) {
  //     HeadDS.current.set('receiveAddress', address);
  //   }
  // }

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
      <Button key="search" onClick={handleSearchLine} disabled={isDisabled}>
        查询
      </Button>,
    ];
  }

  return (
    <Spin spinning={loading}>
      <Header title="创建销售发货单" backPath="/grwl/ship-platform/list">
        <Button icon="save" color="primary" onClick={handleSave} loading={saveLoading}>
          保存
        </Button>
        <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
      </Header>
      <Content>
        <Form dataSet={HeadDS} columns={4}>
          <Lov name="organizationObj" key="organizationObj" />
          <Lov name="soNumObj" key="soNumObj" />
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
          <Lov name="itemObj" key="sopOuObj" disabled={isDisabled} />
          <DateTimePicker name="planShipDate" key="planShipDate" disabled={isDisabled} />
          <Lov name="creatorObj" key="creatorObj" disabled={isDisabled} />
          <TextField name="customerName" key="customerName" />
          <TextField name="customerSiteName" key="customerSiteName" />
          <TextField name="customerAddress" key="customerAddress" disabled={isDisabled} />
          <TextField name="sopOuName" key="sopOuName" />
          <TextField name="salesmanName" key="salesmanName" />
          // add
          {moreDetail && <TextField name="shipOrderGroup" key="shipOrderGroup" />}
          {moreDetail && <TextField name="customerPoAndLine" key="customerPoAndLine" />}
          {moreDetail && (
            <TextField name="customerContact" key="customerContact" disabled={isDisabled} />
          )}
          {moreDetail && <TextField name="contactEmail" key="contactEmail" disabled={isDisabled} />}
          {moreDetail && <TextField name="contactPhone" key="contactPhone" disabled={isDisabled} />}
          {moreDetail && (
            <Select name="shippingMethod" key="shippingMethod" disabled={isDisabled} />
          )}
          {moreDetail && <NumberField name="freight" key="freight" disabled={isDisabled} />}
          {moreDetail && <Lov name="currencyObj" key="currencyObj" disabled={isDisabled} />}
          {moreDetail && <TextField name="carrier" key="carrier" disabled={isDisabled} />}
          {moreDetail && (
            <TextField name="carrierContact" key="carrierContact" disabled={isDisabled} />
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
})(ShipDetail);
