/**
 * @Description: 发货单平台--头表
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-09 15:00:19
 * @LastEditors: yiping.liu
 */
import React, { useState, useEffect } from 'react';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import {
  Table,
  Button,
  Tabs,
  Lov,
  Form,
  Select,
  DatePicker,
  CheckBox,
  DataSet,
  Modal,
  Spin,
  TextField,
} from 'choerodon-ui/pro';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
  getResponse,
  getAccessToken,
  getRequestId,
} from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { HZERO_RPT, API_HOST } from 'utils/config';
import { isEmpty } from 'lodash';
import { useDataSet, useDataSetIsSelected } from 'hzero-front/lib/utils/hooks';
import {
  queryLovData,
  queryReportData,
  userSetting,
  queryIndependentValueSet,
} from 'hlos-front/lib/services/api';

import { queryDocumentType } from '@/services/api';
import codeConfig from '@/common/codeConfig';
import { headDS, lineDS, relationModalDS } from '@/stores/shipPlatformDS';

import LineTable from './shipPlatformLine';
// import TypeModal from './TypeModal';
import styles from './index.less';

const organizationId = getCurrentOrganizationId();

const preCode = 'lwms.shipPlatform';
const { common, lwmsShipPlatform } = codeConfig.code;
const { TabPane } = Tabs;
const modalKey = Modal.key();

function ShipPlatform(props) {
  let headDataSet = useDataSet(() => new DataSet(headDS()), ShipPlatform);
  const lineDataSet = useDataSet(() => new DataSet(lineDS()));
  const modalDS = useDataSet(() => new DataSet(relationModalDS()));
  const [loading, setLoading] = useState(false);

  const [moreQuery, setMoreQuery] = useState(false);

  const [shipOrderId, setShipOrderId] = useState(-1);
  const [isDisabled, setIsDisabled] = useState(true);

  const isSelected = useDataSetIsSelected(headDataSet);

  const { dispatch } = props;

  useEffect(() => {
    defaultLovSetting();
    const myQuery = sessionStorage.getItem('shipPlatformParentQuery') || false;
    if (location.pathname === '/raumplus/ship-platform/list' && myQuery) {
      handleSearch().then(() => {
        sessionStorage.removeItem('shipPlatformParentQuery');
      });
    }
    return () => {
      headDataSet = new DataSet(headDS());
      sessionStorage.removeItem('shipPlatformParentQuery');
      sessionStorage.removeItem('shipOrderTypeObj');
    };
  }, []);

  const mainColumns = [
    { name: 'shipOrganization', editor: false, width: 128, lock: 'left' },
    { name: 'attributeString4', editor: false, width: 128, lock: 'left' },
    {
      name: 'shipOrderObj',
      editor: false,
      width: 128,
      lock: 'left',
      renderer: ({ record, value }) => {
        return (
          <a
            onClick={() =>
              handleToDetail({
                ...record.toJSONData(),
                id: record.get('shipOrderId'),
                pageType: 'details',
              })
            }
          >
            {value.shipOrderNum || ''}
          </a>
        );
      },
    },
    { name: 'customerName', editor: false, width: 200 },
    { name: 'customerSiteName', editor: false, width: 128 },
    { name: 'shipOrderTypeObj', editor: false, width: 128 },
    {
      name: 'shipOrderStatusMeaning',
      editor: false,
      width: 82,
      align: 'center',
      renderer: ({ value, record }) => statusRender(record.data.shipOrderStatus, value),
    },
    { name: 'attributeString15', editor: false, width: 128 },
    { name: 'sopOuName', editor: false, width: 128 },
    { name: 'poNum', editor: false, width: 128 },
    { name: 'poLineNum', editor: false, width: 70 },
    { name: 'demandNum', editor: false, width: 128 },
    { name: 'salesman', editor: false, width: 128 },
    {
      name: 'wareHouse',
      editor: false,
      width: 128,
      renderer: ({ record }) => (
        <span>
          {record.get('warehouseCode')} {record.get('wareHouseOrganizationName')}
        </span>
      ),
    },
    {
      name: 'wmArea',
      editor: false,
      width: 128,
      renderer: ({ record }) => (
        <span>
          {record.get('wmAreaCode')} {record.get('wmAreaOrganizationName')}
        </span>
      ),
    },
    { name: 'shipOrderGroup', editor: false, width: 128 },
    { name: 'shipToSite', editor: false, width: 128 },
    { name: 'customerContact', editor: false, width: 128 },
    { name: 'contactPhone', editor: false, width: 128 },
    { name: 'contactEmail', editor: false, width: 128 },
    { name: 'customerAddress', editor: false, width: 200 },
    { name: 'customerPo', editor: false, width: 128 },
    { name: 'customerPoLine', editor: false, width: 70 },
    { name: 'creatorName', editor: false, width: 128 },
    { name: 'approvalRuleMeaning', editor: false, width: 100 },
    { name: 'approvalWorkflow', editor: false, width: 128 },
    { name: 'creationDate', editor: false, width: 136 },
    {
      name: 'printedFlag',
      width: 70,
      renderer: yesOrNoRender,
      editor: (record) => (record.editing ? <CheckBox /> : false),
    },
    { name: 'printedDate', editor: false, width: 136 },
    { name: 'sourceDocType', editor: false, width: 100 },
    { name: 'sourceDocNum', editor: false, width: 128 },
    { name: 'sourceDocLineNum', editor: false, width: 70 },
    { name: 'docProcessRuleName', editor: false, width: 128 },
    { name: 'remark', editor: false, width: 200 },
    { name: 'externalShipType', editor: false, width: 128 },
    { name: 'externalId', editor: false, width: 128 },
    { name: 'externalNum', editor: false, width: 128 },
  ];

  const shipColumns = [
    { name: 'shipOrganization', editor: false, width: 128, lock: 'left' },
    {
      name: 'shipOrderObj',
      editor: false,
      width: 128,
      // renderer: ({ record, value }) => {
      //   const id = record.get('shipOrderId');
      //   return <a onClick={() => handleToDetail(id)}>{value.shipOrderNum || ''}</a>;
      // },
      lock: 'left',
    },
    { name: 'wareHouse', editor: false, width: 128 },
    { name: 'wmArea', editor: false, width: 128 },
    { name: 'shippingMethod', editor: false, width: 128 },
    { name: 'carrier', editor: false, width: 128 },
    { name: 'carrierContact', editor: false, width: 128 },
    { name: 'shipTicket', editor: false, width: 128 },
    { name: 'plateNum', editor: false, width: 128 },
    { name: 'freight', editor: false, width: 82 },
    { name: 'currency', editor: false, width: 82 },
    { name: 'planShipDate', editor: false, width: 136 },
    { name: 'applyShipDate', editor: false, width: 136 },
    { name: 'shippedDate', editor: false, width: 136 },
    { name: 'shipWorker', editor: false, width: 128 },
    { name: 'expectedArrivalDate', editor: false, width: 136 },
    { name: 'arrivedDate', editor: false, width: 136 },
    { name: 'confirmWorker', editor: false, width: 128 },
  ];

  /**
   *重置
   *
   */
  function handleReset() {
    headDataSet.queryDataSet.current.reset();
    setIsDisabled(true);
  }

  /**
   *查询
   *
   * @returns
   */
  async function handleSearch() {
    setShipOrderId(-1);
    const validateValue = await headDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    await headDataSet.query();
  }

  /**
   *行tab
   *
   * @returns
   */
  function tabsArr() {
    return [
      { code: 'main', title: '主要', component: <LineTable tableDS={lineDataSet} value="main" /> },
      { code: 'ship', title: '发货', component: <LineTable tableDS={lineDataSet} value="ship" /> },
    ];
  }

  /**
   *头点击事件
   *
   */
  function handleClick({ record }) {
    return {
      onClick: () => {
        setShipOrderId(record.data.shipOrderId);
        lineDataSet.queryParameter = { shipOrderId: record.data.shipOrderId };
        lineDataSet.query();
      },
    };
  }

  /**
   *导出
   *
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = headDataSet && headDataSet.queryDataSet && headDataSet.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  /**
   *设置默认查询条件
   *
   */
  async function defaultLovSetting() {
    const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
    if (getResponse(res)) {
      if (!isEmpty(res.content) && headDataSet.queryDataSet && headDataSet.queryDataSet.current) {
        headDataSet.queryDataSet.current.set('organizationObj', {
          organizationId: res.content[0].organizationId,
          organizationName: res.content[0].organizationName,
        });
      }
    }
  }

  async function handleShowTypeSelectModal() {
    // modal = Modal.open({
    //   key: 'lwms-ship-return-platform-type-modal',
    //   title: '新建订单',
    //   className: styles['lwms-ship-return-platform-type-modal'],
    //   movable: false,
    //   children: <TypeModal onModalCancel={handleModalCancel} onModalOk={handleModalOk} />,
    //   footer: null,
    // });
    const res = await queryLovData({
      lovCode: 'LMDS.DOCUMENT_TYPE',
      documentTypeCode: 'STANDARD_SHIP_ORDER',
    });
    handleToDetail(res.content[0]);
  }

  // function handleModalCancel() {
  //   modal.close();
  // }

  // function handleModalOk(rec) {
  //   if (!isEmpty(rec)) {
  //     handleToDetail(rec);
  //   }
  //   modal.close();
  // }

  /**
   * 跳转详情页面
   * @param {*} id
   */
  function handleToDetail(param) {
    // let pathname = `/lwms/ship-platform/list`;
    // if (param.documentTypeCode === 'SO_SHIP_ORDER') {
    //   pathname = `/lwms/ship-platform/create/sales`;
    // } else if (param.documentTypeCode === 'STANDARD_SHIP_ORDER') {
    //   pathname = `/lwms/ship-platform/create/normal`;
    // } else {
    //   notification.warning({
    //     message: '当前单据类型不支持',
    //   });
    // }
    let pathname = '';
    if (param.documentTypeCode === 'STANDARD_SHIP_ORDER' || param.id) {
      pathname = `/raumplus/ship-platform/create/normal`;
    }

    props.history.push({
      pathname,
      state: {
        shipOrderTypeObj: param,
      },
    });
  }

  /**
   * 改变头状态 - 取消/关闭
   * @param {*} type 操作状态类型
   */
  function handleHeadStatus(type) {
    Modal.confirm({
      children: <p>是否{type === 'close' ? '关闭' : '取消'}发货单？</p>,
    }).then((button) => {
      if (button === 'ok') {
        setLoading(true);
        return new Promise((resolve) => {
          const lists = headDataSet.selected.map((item) => item.get('shipOrderId'));
          dispatch({
            type: 'ShipPlatform/changeHeadStatus',
            payload: {
              type,
              lists,
            },
          }).then((res) => {
            if (res && !res.failed) {
              notification.success({
                message: '操作成功',
              });
              headDataSet.query();
            }
            resolve(setLoading(false));
          });
        });
      }
    });
  }

  // 删除发货单
  function handleHeadDelete() {
    Modal.confirm({
      children: <p>是否删除发货单？</p>,
    }).then((button) => {
      if (button === 'ok') {
        setLoading(true);
        return new Promise((resolve) => {
          const lists = headDataSet.selected.map((item) => item.get('shipOrderId'));
          dispatch({
            type: 'ShipPlatform/deleteShipOrder',
            payload: {
              lists,
            },
          }).then((res) => {
            if (res && !res.failed) {
              notification.success({
                message: '操作成功',
              });
              headDataSet.query();
            }
            resolve(setLoading(false));
          });
        });
      }
    });
  }

  // 提交发货单
  function handleHeadSubmit() {
    setLoading(true);
    return new Promise((resolve) => {
      const lists = headDataSet.selected.map((item) => item.get('shipOrderId'));
      dispatch({
        type: 'ShipPlatform/submitShipOrder',
        payload: {
          lists,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          headDataSet.query();
        }
        resolve(setLoading(false));
      });
    });
  }

  const handlePrint = async () => {
    if (headDataSet.selected.length === 0) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
      return;
    } else if (headDataSet.selected.length > 1) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.onlyone`).d('只能选择一条数据'),
      });
      return;
    }
    const { shipOrderNum, shipOrderTypeId } = headDataSet.selected[0].toData();
    let reportCode = null;
    if (!isEmpty(shipOrderTypeId)) {
      const documentType = await queryDocumentType({ documentTypeId: shipOrderTypeId });
      if (documentType && documentType.content && documentType.content.length > 0) {
        const { printTemplate } = documentType.content[0] || {};
        reportCode = printTemplate;
      }
    }
    if (isEmpty(reportCode)) {
      notification.error({
        message: intl.get(`${preCode}.message.validation.print`).d('单据类型未关联打印模板'),
      });
      return;
    }
    const res = await queryReportData(reportCode);
    if (res && res.content && res.content[0]) {
      const { reportUuid } = res.content[0];
      const url = `${HZERO_RPT}/v1/${organizationId}/reports/export/${reportUuid}/PRINT`;
      const requestUrl = `${API_HOST}${url}?access_token=${getAccessToken()}&H-Request-Id=${getRequestId()}&shipoNum=${shipOrderNum}`;
      window.open(requestUrl);
    }
  };
  const handleExecute = async () => {
    const shipOrderIdArr = headDataSet.selected.map((i) => i.data.shipOrderId);
    const shipOrderNumArr = headDataSet.selected.map((i) => i.data.shipOrderNum);
    const remarkArr = headDataSet.selected.map((i) => i.data.remark);
    const res = await userSetting({ defaultFlag: 'Y' });
    const params = [];
    for (let i = 0; i < shipOrderIdArr.length; i++) {
      const obj = {
        shipOrderId: shipOrderIdArr[i],
        shipOrderNum: shipOrderNumArr[i],
        remark: remarkArr[i] || null,
        executedWorkerId: res.content[0].workerId,
        executedWorker: res.content[0].workerCode,
        executedTime: moment(new Date()).format(DEFAULT_DATETIME_FORMAT),
      };
      params.push(obj);
    }
    setLoading(true);
    return new Promise((resolve) => {
      const lists = params;
      dispatch({
        type: 'ShipPlatform/relationShipOrder',
        payload: {
          lists,
        },
      }).then((resp) => {
        if (resp && !resp.failed) {
          notification.success({
            message: '操作成功',
          });
          headDataSet.query();
        }
        resolve(setLoading(false));
      });
    });
  };

  function RelationModal() {
    return (
      <Form dataSet={modalDS}>
        <TextField name="consignee" />
        <TextField name="consigneeAddress" />
      </Form>
    );
  }

  // 关联
  const handleRelation = async () => {
    const shipOrderIdArr = headDataSet.selected.map((i) => i.data.shipOrderId);
    Modal.open({
      key: modalKey,
      title: '出货单联系人及地址',
      mask: true,
      children: <RelationModal />,
      okText: '保存',
      onOk: async () => {
        const isValid = await modalDS.validate(false, false);
        if (!isValid) {
          return false;
        }
        const { consignee, consigneeAddress } = modalDS.current.toJSONData();
        setLoading(true);
        return new Promise((resolve) => {
          dispatch({
            type: 'ShipPlatform/relationShipOrder',
            payload: {
              lists: {
                shipOrderIds: shipOrderIdArr,
                consignee,
                consigneeAddress,
              },
            },
          }).then((resp) => {
            if (resp && !resp.failed) {
              notification.success({
                message: '操作成功',
              });
              headDataSet.query();
              modalDS.reset();
            }
            resolve(setLoading(false));
          });
        });
      },
    });
  };

  async function brandChange(e) {
    if (e) {
      setIsDisabled(false);
      const result = await queryIndependentValueSet({ lovCode: lwmsShipPlatform.customerGroup });
      const data = () => {
        for (let i = 0; i < result.length; i++) {
          if (result[i].value === e) {
            return result[i].meaning;
          }
        }
      };
      headDataSet.queryDataSet.getField('customerObj').setLovPara('customerGroupMeaning', data());
    } else {
      setIsDisabled(true);
    }
  }

  return (
    <React.Fragment>
      <Spin spinning={loading}>
        <Header title={intl.get(`${preCode}.view.title.shipPlatform`).d('发货单平台')}>
          <Button icon="add" color="primary" onClick={handleShowTypeSelectModal}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <ExcelExport
            requestUrl={`${HLOS_LWMS}/v1/${organizationId}/ship-order-headers/excel`}
            queryParams={getExportQueryParams}
          />
          <Button onClick={() => handleHeadStatus('close')} disabled={!isSelected}>
            {intl.get('hzero.common.button.close').d('关闭')}
          </Button>
          <Button onClick={() => handleHeadStatus('cancel')} disabled={!isSelected}>
            {intl.get('hzero.common.button.cancel').d('取消')}
          </Button>
          <Button onClick={handleHeadDelete} disabled={!isSelected}>
            {intl.get('hzero.common.btn.delete').d('删除')}
          </Button>
          <Button onClick={handleHeadSubmit} disabled={!isSelected}>
            {intl.get('hzero.common.button.submit').d('提交')}
          </Button>
          <Button onClick={handlePrint} disabled={!isSelected}>
            打印
          </Button>
          <Button onClick={handleExecute} disabled={!isSelected}>
            {intl.get('hzero.common.button.trigger').d('执行')}
          </Button>
          <Button onClick={handleRelation} disabled={!isSelected}>
            {intl.get('hzero.common.button.relation').d('关联')}
          </Button>
        </Header>
        <Content>
          <div className={styles['lwms-ship-platform']}>
            <Form dataSet={headDataSet.queryDataSet} columns={4}>
              <Lov name="organizationObj" clearButton noCache />
              <Lov name="shipOrderObj" clearButton noCache />
              <Lov name="customerObj" clearButton noCache disabled={isDisabled} />
              <Select name="shipOrderStatus" />
              {moreQuery && <Lov name="poNumObj" clearButton noCache />}
              {moreQuery && <Lov name="salesmanObj" clearButton noCache />}
              {moreQuery && <Lov name="itemObj" clearButton noCache />}
              {moreQuery && <Lov name="shipOrderTypeObj" clearButton noCache />}
              {moreQuery && <Lov name="demandNumObj" clearButton noCache />}
              {moreQuery && <Lov name="createWorkerObj" clearButton noCache />}
              {moreQuery && <DatePicker mode="dateTime" name="startDate" />}
              {moreQuery && <DatePicker mode="dateTime" name="endDate" />}
              {moreQuery && <Select name="attributeString1" onChange={(e) => brandChange(e)} />}
              {moreQuery && <Select name="shippingMethod" />}
              {moreQuery && <Select name="attributeString2" />}
              {moreQuery && <DatePicker mode="dateTime" name="planShipDateStart" />}
              {moreQuery && <DatePicker mode="dateTime" name="planShipDateEnd" />}
              {moreQuery && <TextField name="attributeString4" />}
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
              <Button onClick={handleReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button color="primary" onClick={handleSearch}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
          <Tabs defaultActiveKey="main">
            <TabPane tab="主要" key="main">
              <Table
                dataSet={headDataSet}
                border={false}
                columnResizable="true"
                editMode="inline"
                columns={mainColumns}
                queryFieldsLimit={4}
                queryBar="none"
                onRow={(record) => handleClick(record)}
                pagination={{
                  onChange: () => setShipOrderId(-1),
                }}
              />
            </TabPane>
            <TabPane tab="发货" key="ship">
              <Table
                dataSet={headDataSet}
                border={false}
                columnResizable="true"
                editMode="inline"
                columns={shipColumns}
                queryFieldsLimit={4}
                queryBar="none"
                onRow={(record) => handleClick(record)}
                pagination={{
                  onChange: () => setShipOrderId(-1),
                }}
              />
            </TabPane>
          </Tabs>
          {shipOrderId !== -1 && (
            <Tabs defaultActiveKey="main">
              {tabsArr().map((tab) => (
                <TabPane
                  tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
                  key={tab.code}
                >
                  {tab.component}
                </TabPane>
              ))}
            </Tabs>
          )}
        </Content>
      </Spin>
    </React.Fragment>
  );
}

export default formatterCollections({
  code: [`${preCode}`],
})((props) => {
  return <ShipPlatform {...props} />;
});
