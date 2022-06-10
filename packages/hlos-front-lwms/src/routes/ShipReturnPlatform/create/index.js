/**
 * @Description: 销售退货单平台新建页面
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-11-19 09:38:08
 * @LastEditors: yu.na
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Button,
  Form,
  DataSet,
  Lov,
  DatePicker,
  Modal,
  TextField,
  Table,
  Select,
} from 'choerodon-ui/pro';
import { Divider, Icon, Tooltip } from 'choerodon-ui';
import { Table as HTable } from 'hzero-ui';
import { isEmpty, xorBy } from 'lodash';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';
import notification from 'utils/notification';
import { tableScrollWidth, getResponse } from 'utils/utils';
import { useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { userSetting, queryLovData } from 'hlos-front/lib/services/api';
import { CreateQueryDS, CreateDS } from '@/stores/shipReturnPlatformDS';
import { submitShipReturn } from '@/services/shipReturnService';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import codeConfig from '@/common/codeConfig';
import styles from './index.less';

const { common } = codeConfig.code;

const preCode = 'lwms.shipReturnPlatform';
const commonCode = 'lwms.common';

const ShipReturnCreate = ({ dispatch, location, salesOrderList }) => {
  const queryDS = useMemo(() => new DataSet(CreateQueryDS()), []);
  const createDS = useMemo(() => new DataSet(CreateDS()), []);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showQueryFlag, changeShowQueryFlag] = useState(false);
  const [showHeaderFlag, changeShowHeaderFlag] = useState(false);
  const [docProcessRule, setDocProcessRule] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [concatFlag, changeConcatFlag] = useState(true);
  const [hideLeftColumn, setHideLeftColumn] = useState(false);
  const [currentWorker, setWorker] = useState({});
  const [isDirty, setDirty] = useState(false);

  useEffect(() => {
    async function queryUserSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const {
          organizationId,
          organizationCode,
          organizationName,
          workerId,
          workerName,
        } = res.content[0];
        if (organizationId) {
          queryDS.queryDataSet.current.set('limitOrganizationId', organizationId);
          createDS.current.set('limitOrganizationId', organizationId);
          createDS.current.set('organizationObj', {
            organizationId,
            organizationCode,
            organizationName,
          });
        }
        setWorker({
          workerId,
          workerName,
        });
      }

      const sopRes = await queryLovData({ lovCode: common.sopOu, defaultFlag: 'Y' });
      if (sopRes && sopRes.content && sopRes.content[0]) {
        const { sopOuId, sopOuCode, sopOuName } = sopRes.content[0];
        queryDS.queryDataSet.current.set('sopOuObj', {
          sopOuId,
          sopOuCode,
          sopOuName,
        });
      }
    }
    queryUserSetting();
    const { state } = location;
    if (!isEmpty(state) && state.returnTypeObj) {
      createDS.current.set('returnTypeObj', state.returnTypeObj);
      setDocProcessRule(state.returnTypeObj.docProcessRule);
    }
    dispatch({
      type: 'shipReturn/initialSalesOrder',
    });
  }, []);

  useDataSetEvent(createDS, 'update', ({ dataSet, name, value }) => {
    if (name !== 'organizationObj' && name !== 'limitOrganizationId') {
      setDirty(dataSet.dirty);
    }
    if (name === 'organizationObj') {
      queryDS.queryDataSet.current.set('receiveOrgId', value.organizationId);
    }
  });

  useDataSetEvent(queryDS.queryDataSet, 'update', ({ dataSet, name }) => {
    if (name !== 'sopOuObj' && name !== 'limitOrganizationId') {
      setDirty(dataSet.dirty);
    }
  });

  /**
   * 获取行序号
   * @param {*} record 当前行记录
   */
  const getSerialNum = (record) => {
    const { index } = record;
    record.set('returnLineNum', index + 1);
    return index + 1;
  };

  const handleSubmit = async () => {
    const validateValue = await createDS.validate(false, false);
    if (!validateValue) {
      notification.warning({
        message: '有必输项未输入，请检查！',
      });
      return;
    }
    if (!createDS.children.lineList.selected.length) {
      notification.warning({
        message: '请至少选中一条行数据！',
      });
      return;
    }

    setSubmitLoading(true);
    const lineList = [];
    createDS.children.lineList.selected.forEach((i) => {
      lineList.push({
        ...i.toJSONData(),
        soId: i.toJSONData().soHeaderId,
      });
    });
    const result = await submitShipReturn({
      ...createDS.current.toJSONData(),
      customerId: createDS.children.lineList.selected[0].data.customerId,
      customerNumber: createDS.children.lineList.selected[0].data.customerNumber,
      sopOuId: queryDS.queryDataSet.current.get('sopOuId'),
      sopOuCode: queryDS.queryDataSet.current.get('sopOuCode'),
      creatorName: currentWorker.workerName,
      creator: currentWorker.workerCode,
      creatorId: currentWorker.workerId,
      lineList,
    });
    setSubmitLoading(false);
    sessionStorage.setItem('shipReturnRefresh', true);
    if (getResponse(result) && result.shipReturnId) {
      handleReset();
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const {
          organizationId,
          organizationCode,
          organizationName,
          workerId,
          workerName,
        } = res.content[0];
        if (organizationId) {
          queryDS.queryDataSet.current.set('limitOrganizationId', organizationId);
          createDS.current.set('limitOrganizationId', organizationId);
          createDS.current.set('organizationObj', {
            organizationId,
            organizationCode,
            organizationName,
          });
        }
        setWorker({
          workerId,
          workerName,
        });
      }
      const sopRes = await queryLovData({ lovCode: common.sopOu, defaultFlag: 'Y' });
      if (sopRes && sopRes.content && sopRes.content[0]) {
        const { sopOuId, sopOuCode, sopOuName } = sopRes.content[0];
        queryDS.queryDataSet.current.set('sopOuObj', {
          sopOuId,
          sopOuCode,
          sopOuName,
        });
      }
      const { state } = location;
      if (!isEmpty(state) && state.returnTypeObj) {
        createDS.current.set('returnTypeObj', state.returnTypeObj);
        setDocProcessRule(state.returnTypeObj.docProcessRule);
      }
    }
  };

  const handleQueryToggle = () => {
    changeShowQueryFlag(!showQueryFlag);
  };

  const handleHeaderToggle = () => {
    changeShowHeaderFlag(!showHeaderFlag);
  };

  const itemRender = ({ value, record }) => {
    return `${value}-${record.data.itemDescription}`;
  };

  const soRender = ({ value, record }) => {
    return `${value}-${record.data.soLineNum}`;
  };

  const leftColumns = [
    {
      title: intl.get(`${preCode}.model.soNum`).d('销售订单号'),
      dataIndex: 'soNum',
      key: 'soNum',
      width: 144,
      render: (value, record) => {
        return (
          <span>
            {value}-{record.soLineNum}
          </span>
        );
      },
    },
  ];
  const extraLeftColumn = [
    {
      title: intl.get(`${commonCode}.model.item`).d('物料'),
      dataIndex: 'itemCode',
      key: 'itemCode',
      width: 128,
      render: (value, record) => {
        return (
          <span>
            {value}-{record.itemDescription}
          </span>
        );
      },
    },
    {
      title: intl.get(`${preCode}.shippedQty`).d('发货数量'),
      dataIndex: 'shippedQty',
      key: 'shippedQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.returnedQty`).d('已退货数量'),
      dataIndex: 'returnedQty',
      key: 'returnedQty',
      width: 82,
    },
    {
      title: intl.get(`${preCode}.customer`).d('客户'),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
    },
    {
      title: intl.get(`${preCode}.shipOrg`).d('发运组织'),
      dataIndex: 'shipOrganization',
      key: 'shipOrganization',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.salesman`).d('销售员'),
      dataIndex: 'salesmanName',
      key: 'salesmanName',
      width: 128,
    },
    {
      title: intl.get(`${preCode}.demandDate`).d('需求日期'),
      dataIndex: 'demandDate',
      key: 'demandDate',
      width: 100,
    },
  ];

  const rightColumns = useCallback(() => {
    return [
      {
        name: 'returnLineNum',
        key: 'returnLineNum',
        width: 82,
        lock: true,
        renderer: ({ record }) => getSerialNum(record),
      },
      { name: 'soNum', key: 'soNum', width: 144, lock: true, renderer: soRender },
      { name: 'itemCode', key: 'itemCode', width: 128, renderer: itemRender },
      { name: 'applyQty', key: 'applyQty', editor: true, width: 82 },
      {
        name: 'receiveWarehouseObj',
        key: 'receiveWarehouseObj',
        editor: <Lov onChange={handleLineWarehouseChange} />,
        width: 128,
      },
      {
        name: 'receiveWmAreaObj',
        key: 'receiveWmAreaObj',
        editor: <Lov onChange={handleLineWmAreaChange} />,
        width: 128,
      },
      { name: 'returnReasonObj', key: 'returnReasonObj', editor: true, width: 200 },
      { name: 'shipReturnRule', key: 'shipReturnRule', editor: true, width: 150 },
      { name: 'packingQty', key: 'packingQty', editor: true, width: 82 },
      { name: 'containerQty', key: 'containerQty', editor: true, width: 82 },
      { name: 'lotNumber', key: 'lotNumber', editor: true, width: 128 },
      { name: 'tagCode', key: 'tagCode', editor: true, width: 128 },
      { name: 'lineRemark', key: 'lineRemark', editor: true, width: 200 },
    ];
  }, []);

  const handleLineWarehouseChange = () => {
    createDS.current.set('receiveWarehouseObj', null);
    createDS.children.lineList.forEach((i) => {
      i.set('receiveWmAreaObj', null);
      if (i.data.returnLineNum === createDS.children.lineList.current.get('returnLineNum')) return;
      i.set('receiveWarehouseObj', null);
    });
  };

  const handleLineWmAreaChange = () => {
    createDS.current.set('receiveWmAreaObj', null);
    createDS.children.lineList.forEach((i) => {
      if (i.data.returnLineNum === createDS.children.lineList.current.get('returnLineNum')) return;
      i.set('receiveWmAreaObj', null);
    });
  };

  const handleTransfer = () => {
    if (selectedData.length) {
      const { receiveWarehouseObj, receiveWmAreaObj } = createDS.current.data;
      selectedData.forEach((i) => {
        createDS.children.lineList.create({
          ...i,
          receiveWarehouseObj,
          receiveWmAreaObj,
          applyQty: i.shippedQty - i.returnedQty,
        });
        createDS.children.lineList.select(createDS.children.lineList.current);
      });
      dispatch({
        type: 'shipReturn/updateSalesOrder',
        payload: xorBy(salesOrderList, selectedData),
      });
      setSelectedData([]);
      setSelectedRowKeys([]);
    } else {
      notification.warning({
        message: '请至少选中一条行数据！',
      });
    }
  };

  const handleCancel = () => {
    if (!createDS.children.lineList.selected.length) {
      notification.warning({
        message: '请至少选中一条行数据！',
      });
      return;
    }
    dispatch({
      type: 'shipReturn/updateSalesOrder',
      payload: createDS.children.lineList.selected.map((i) => i.data).concat(...salesOrderList),
    });
    createDS.children.lineList.selected.forEach((i) => {
      createDS.children.lineList.remove(i);
    });
  };

  const handleSearch = async () => {
    const valdateValue = await queryDS.queryDataSet.validate(false, false);
    if (!valdateValue) return;
    setSearchLoading(true);
    dispatch({
      type: 'shipReturn/querySalesOrder',
      payload: {
        ...queryDS.queryDataSet.current.toJSONData(),
        page: -1,
        concatFlag,
        soLineIds: createDS.children.lineList.map((i) => i.data.soLineId).join(','),
        _salesOrderList: createDS.children.lineList.selected
          .map((i) => i.data)
          .concat(...salesOrderList),
      },
    });

    setSearchLoading(false);
    queryDS.queryDataSet.current.set('soObj', null);
    changeConcatFlag(false);
  };

  const handleButtonReset = async () => {
    Modal.confirm({
      children: <p>确认重置？</p>,
    }).then(async (button) => {
      if (button === 'ok') {
        setResetLoading(true);
        await handleReset();
        const res = await userSetting({ defaultFlag: 'Y' });
        if (res && res.content && res.content[0]) {
          const {
            organizationId,
            organizationCode,
            organizationName,
            workerId,
            workerName,
          } = res.content[0];
          if (organizationId) {
            queryDS.queryDataSet.current.set('limitOrganizationId', organizationId);
            createDS.current.set('limitOrganizationId', organizationId);
            createDS.current.set('organizationObj', {
              organizationId,
              organizationCode,
              organizationName,
            });
          }
          setWorker({
            workerId,
            workerName,
          });
        }
        const sopRes = await queryLovData({ lovCode: common.sopOu, defaultFlag: 'Y' });
        if (sopRes && sopRes.content && sopRes.content[0]) {
          const { sopOuId, sopOuCode, sopOuName } = sopRes.content[0];
          queryDS.queryDataSet.current.set('sopOuObj', {
            sopOuId,
            sopOuCode,
            sopOuName,
          });
        }
        const { state } = location;
        if (!isEmpty(state) && state.returnTypeObj) {
          createDS.current.set('returnTypeObj', state.returnTypeObj);
          setDocProcessRule(state.returnTypeObj.docProcessRule);
        }
        setResetLoading(false);
      }
    });
  };

  const handleSoChange = (record) => {
    changeConcatFlag(true);
    if (record) {
      const { customerId, customerName, partyName } = record;
      if (customerId) {
        queryDS.queryDataSet.current.set('customerObj', {
          customerId,
          customerName: customerName || partyName,
        });
      }
    }
  };

  const handleSelectRowKeys = (rowKeys = [], records = []) => {
    setSelectedRowKeys(rowKeys);
    setSelectedData(records);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectRowKeys,
  };

  const handleCustomerChange = (record, oldRecord) => {
    if (oldRecord) {
      const { sopOuObj } = queryDS.queryDataSet.current.data;
      // const { returnTypeObj } = createDS.current.data;
      handleReset();
      if (!isEmpty(sopOuObj)) {
        queryDS.queryDataSet.current.set('sopOuObj', sopOuObj);
      }
      // if (!isEmpty(returnTypeObj)) {
      //   createDS.current.set('returnTypeObj', returnTypeObj);
      // }
      if (!isEmpty(record)) {
        queryDS.queryDataSet.current.set('customerObj', record);
      }
    }
  };

  const handleHideLeftColumn = () => {
    setHideLeftColumn(!hideLeftColumn);
  };

  const handleWarehouseChange = (record) => {
    createDS.children.lineList.forEach((i) => {
      i.set('receiveWarehouseObj', record);
      i.set('receiveWmAreaObj', null);
    });
  };

  const handleWmAreaChange = (record) => {
    createDS.children.lineList.forEach((i) => {
      i.set('receiveWmAreaObj', record);
    });
  };

  const handleReasonChange = (record) => {
    createDS.children.lineList.forEach((i) => {
      i.set('returnReasonObj', record);
    });
  };

  // const handleTypeChange = (record) => {
  //   const { organizationObj } = createDS.current.data;
  //   const { sopOuObj } = queryDS.queryDataSet.current.data;

  //   handleReset();
  //   if (record) {
  //     setDocProcessRule(record.docProcessRule);
  //     createDS.current.set('returnTypeObj', record);
  //   } else {
  //     setDocProcessRule(null);
  //   }
  //   if (!isEmpty(sopOuObj)) {
  //     queryDS.queryDataSet.current.set('sopOuObj', sopOuObj);
  //   }
  //   if (!isEmpty(organizationObj)) {
  //     createDS.current.set('organizationObj', organizationObj);
  //   }
  // };

  const handleSopChange = (record, oldRecord) => {
    if (oldRecord) {
      const { organizationObj } = createDS.current.data;
      handleReset();
      if (record) {
        queryDS.queryDataSet.current.set('sopOuObj', record);
      }
      // if (!isEmpty(returnTypeObj)) {
      //   createDS.current.set('returnTypeObj', returnTypeObj);
      // }
      if (!isEmpty(organizationObj)) {
        createDS.current.set('organizationObj', organizationObj);
      }
    }
  };

  const handleReset = () => {
    queryDS.queryDataSet.current.reset();
    createDS.current.reset();

    createDS.children.lineList.forEach((i) => {
      createDS.children.lineList.remove(i);
    });
    dispatch({
      type: 'shipReturn/initialSalesOrder',
    });
  };

  return (
    <>
      <Header
        title={intl.get(`${preCode}.view.title。create`).d('新建销售退货单')}
        backPath="/lwms/ship-return-platform/list"
        isChange={isDirty}
      >
        <ButtonPermission
          type="c7n-pro"
          onClick={handleSubmit}
          loading={submitLoading}
          permissionList={[
            {
              code: 'hlos.lwms.ship.return.ps.button.submit',
              type: 'button',
              meaning: '提交',
            },
          ]}
        >
          {intl.get('hzero.common.button.save').d('保存')}
        </ButtonPermission>
        <Button onClick={handleSearch} loading={searchLoading}>
          {intl.get('hzero.common.button.search').d('查询')}
        </Button>
        <Button onClick={handleButtonReset} loading={resetLoading}>
          {intl.get('hzero.common.button.reset').d('重置')}
        </Button>
      </Header>
      <Content className={styles['lwms-ship-return-create']}>
        {/* <Lov dataSet={createDS} name="returnTypeObj" noCache onChange={handleTypeChange} /> */}
        <div>
          <Form dataSet={queryDS.queryDataSet} columns={4}>
            <Lov name="sopOuObj" noCache onChange={handleSopChange} />
            <Lov name="soObj" noCache onChange={handleSoChange} />
            <Lov name="customerObj" noCache onChange={handleCustomerChange} />
            <Lov name="itemObj" noCache />
          </Form>
          <Divider>
            <div>
              <span onClick={handleQueryToggle} style={{ cursor: 'pointer' }}>
                {!showQueryFlag
                  ? `${intl.get('hzero.common.button.expand').d('展开')}`
                  : `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`}
              </span>
              <Icon type={!showQueryFlag ? 'expand_more' : 'expand_less'} />
            </div>
          </Divider>
          <div style={!showQueryFlag ? { display: 'none' } : { display: 'block' }}>
            <Form dataSet={queryDS.queryDataSet} columns={4}>
              <Lov name="shioOrganizationObj" noCache />
              <Lov name="salesmanObj" noCache />
              <DatePicker name="demandDateStart" />
              <DatePicker name="demandDateEnd" />
            </Form>
          </div>
        </div>
        <div>
          <Form dataSet={createDS} columns={4}>
            <TextField name="shipReturnNum" />
            <Lov name="organizationObj" noCache />
            <Lov name="receiveWarehouseObj" noCache onChange={handleWarehouseChange} />
            <Lov name="receiveWmAreaObj" noCache onChange={handleWmAreaChange} />
          </Form>
          <Divider>
            <div>
              <span onClick={handleHeaderToggle} style={{ cursor: 'pointer' }}>
                {!showHeaderFlag
                  ? `${intl.get('hzero.common.button.expand').d('展开')}`
                  : `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`}
              </span>
              <Icon type={!showHeaderFlag ? 'expand_more' : 'expand_less'} />
            </div>
          </Divider>
          <div
            className={styles['rule-line']}
            style={!showHeaderFlag ? { display: 'none' } : { display: 'block' }}
          >
            <Form dataSet={createDS} columns={4}>
              <Select name="shipReturnStatus" />
              <TextField name="returnShipTicket" noCache />
              <Lov name="returnReasonObj" noCache onChange={handleReasonChange} />
              <TextField name="remark" />
              <TextField name="customerPo" />
              <TextField name="freight" />
              <Lov name="currencyObj" noCache />
              <TextField name="carrier" />
              <TextField name="carrierContact" />
              <TextField name="plateNum" />
            </Form>
            <div
              style={{
                display: 'inline-block',
                width: '25%',
                marginTop: '-50px',
                marginLeft: '60%',
                position: 'absolute',
                lineHeight: '50px',
              }}
            >
              <Tooltip placement="top" title={docProcessRule}>
                <a>{intl.get(`${preCode}.model.docProcessRule`).d('单据处理规则')}</a>
              </Tooltip>
            </div>
          </div>
        </div>
        <div>
          <div className={styles['table-wrapper']}>
            <div
              className={`${styles['table-item']} ${hideLeftColumn && styles['table-item-hide']}`}
            >
              <div>
                <h3>获取销售订单行</h3>
                <div>
                  <Button key="sure" onClick={handleTransfer}>
                    {intl.get('lwms.common.button.sure').d('确认')}
                  </Button>
                  <Icon
                    type={hideLeftColumn ? 'navigate_next' : 'navigate_before'}
                    onClick={handleHideLeftColumn}
                  />
                </div>
              </div>
              <HTable
                loading={searchLoading}
                rowKey="soLineId"
                bordered
                scroll={{
                  x: tableScrollWidth(
                    hideLeftColumn ? leftColumns : leftColumns.concat(extraLeftColumn)
                  ),
                }}
                columns={hideLeftColumn ? leftColumns : leftColumns.concat(extraLeftColumn)}
                dataSource={salesOrderList}
                pagination={false}
                rowSelection={isEmpty(salesOrderList) ? null : rowSelection}
              />
            </div>
            <div
              className={`${styles['table-item']} ${hideLeftColumn && styles['table-item-hide']}`}
            >
              <div>
                <h3>创建退货单行</h3>
                <div>
                  <Button key="cancel" onClick={handleCancel}>
                    {intl.get('hzero.common.button.cancel').d('取消')}
                  </Button>
                </div>
              </div>
              <Table
                dataSet={createDS.children.lineList}
                columnResizable="true"
                columns={rightColumns()}
                queryBar="none"
              />
            </div>
          </div>
        </div>
      </Content>
    </>
  );
};

export default connect(({ shipReturn }) => ({
  salesOrderList: shipReturn?.salesOrderList || [],
}))(
  formatterCollections({
    code: ['lwms.shipReturnPlatform', 'lwms.common'],
  })(ShipReturnCreate)
);
