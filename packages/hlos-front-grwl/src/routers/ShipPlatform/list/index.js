/**
 * @Description: 发货单平台--头表
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-09 15:00:19
 * @LastEditors: yiping.liu
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import {
  Button,
  Tabs,
  Lov,
  TextField,
  Select,
  DatePicker,
  DataSet,
  Modal,
  CheckBox,
} from 'choerodon-ui/pro';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import moment from 'moment';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { isEmpty } from 'lodash';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { queryLovData, userSetting } from 'hlos-front/lib/services/api';

import codeConfig from '@/common/codeConfig';
import BigDataTable from '@/components/BigDataTable';
import { headDS, lineDS } from '@/stores/shipPlatformDS';
import TableQueryFrom from '@src/components/TableQueryFrom';
import ReactToPrint from 'hlos-front/lib/components/PrintElement';

import LineTable from './shipPlatformLine';
import TypeModal from './TypeModal';
import styles from './index.less';
import ItemPrint from '@/components/ItemPrint';

const organizationId = getCurrentOrganizationId();

const preCode = 'lwms.shipPlatform';
const { common } = codeConfig.code;
const { TabPane } = Tabs;
let modal = null;
const cacheDate = new Map();
function ShipPlatform(props) {
  let headDataSet = useDataSet(() => new DataSet(headDS()), ShipPlatform);
  const lineDataSet = useDataSet(() => new DataSet(lineDS()));
  const [loading, setLoading] = useState(false);

  const [shipOrderId, setShipOrderId] = useState(-1);

  const [isSelected, setIsSelect] = useState(false);
  const [checkValues, setCheckValues] = useState([]);

  const { dispatch } = props;
  const printNode = useRef();
  const [data, setData] = useState([]);
  const [itemPrintList, setItemPrintList] = useState([]);
  const [itemPrintLoading, setItemPrintLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selfPage, setSelfPage] = useState(1);
  const [selfPageSize, setSelfPageSize] = useState(20);
  const pageConfig = useMemo(() => {
    return {
      total,
      page: selfPage,
      pageSize: selfPageSize,
    };
  }, [total, selfPage, selfPageSize]);

  const mainColumns = () => [
    {
      resizable: true,
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length === data.length}
          onChange={handleCheckAllChange}
        />
      ),
      dataIndex: 'shipOrderId',
      key: 'shipOrderId',
      width: 60,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) => CheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      resizable: true,
      title: '发货组织',
      key: 'shipOrganization',
      dataIndex: 'shipOrganization',
      width: 128,
      lock: 'left',
    },
    {
      resizable: true,
      title: '发货单号',
      key: 'shipOrderNum',
      dataIndex: 'shipOrderNum',
      width: 128,
      lock: 'left',
    },
    {
      resizable: true,
      title: '客户送货单号',
      key: 'externalNum',
      dataIndex: 'externalNum',
      width: 128,
    },
    {
      resizable: true,
      title: '打印标识',
      key: 'printedFlag',
      dataIndex: 'printedFlag',
      width: 128,
      render: yesOrNoRender,
    },
    { resizable: true, title: '客户', key: 'customer', dataIndex: 'customer', width: 200 },
    {
      resizable: true,
      title: '发货单类型',
      key: 'shipOrderType',
      dataIndex: 'shipOrderType',
      width: 128,
    },
    {
      resizable: true,
      title: '发货单状态',
      key: 'shipOrderStatusMeaning',
      dataIndex: 'shipOrderStatusMeaning',
      width: 82,
      align: 'center',
      render: ({ rowData }) =>
        statusRender(rowData?.shipOrderStatus, rowData?.shipOrderStatusMeaning),
    },
    { resizable: true, title: '销售订单号', key: 'soNum', dataIndex: 'soNum', width: 128 },
    {
      resizable: true,
      title: '客户地址',
      key: 'customerAddress',
      dataIndex: 'customerAddress',
      width: 128,
    },
    { resizable: true, title: '制单人', key: 'creator', dataIndex: 'creator', width: 70 },
    {
      resizable: true,
      title: '制单时间',
      key: 'creationDate',
      dataIndex: 'creationDate',
      width: 128,
    },
    {
      resizable: true,
      title: '来源单据类型',
      key: 'sourceDocType',
      dataIndex: 'sourceDocType',
      width: 128,
    },
    {
      resizable: true,
      title: '来源单据号',
      key: 'sourceDocNum',
      dataIndex: 'sourceDocNum',
      width: 128,
    },
    {
      resizable: true,
      title: '是否传给SRM',
      key: 'srmFlag',
      dataIndex: 'srmFlag',
      width: 128,
    },
    {
      resizable: true,
      title: '发出仓库',
      key: 'fromWarehouseName',
      dataIndex: 'fromWarehouseName',
      width: 128,
    },
    {
      resizable: true,
      title: '请求发货时间',
      key: 'applyShipDate',
      dataIndex: 'applyShipDate',
      width: 128,
    },
    {
      resizable: true,
      title: '发出时间',
      key: 'shippedDate',
      dataIndex: 'shippedDate',
      width: 128,
    },
    { resizable: true, title: '发出员工', key: 'shipWorker', dataIndex: 'shipWorker', width: 128 },
    {
      resizable: true,
      title: '预计到达时间',
      key: 'expectedArrivalDate',
      dataIndex: 'expectedArrivalDate',
      width: 128,
    },
  ];

  useEffect(() => {
    if (checkValues.length > 0) {
      setIsSelect(true);
    } else {
      setIsSelect(false);
    }
  }, [checkValues]);

  useEffect(() => {
    if (cacheDate.size !== 0) {
      setData(cacheDate.get('content'));
      setTotal(cacheDate.get('total'));
      setSelfPage(cacheDate.get('selfPage'));
      setSelfPageSize(cacheDate.get('selfPageSize'));
    }
    return () => {
      const {
        history: {
          location: { pathname },
        },
      } = props;
      if (pathname === '/grwl/ship-platform/list') {
        cacheDate.clear();
      }
    };
  }, []);

  function CheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.shipOrderId}
        checked={checkValues.indexOf(rowData.shipOrderId) !== -1}
        onChange={handleChange}
        onClick={(event) => event.stopPropagation()}
      />
    );
  }

  const config = useMemo(() => {
    return { columns: mainColumns(), data, loading, pageChange: changePage, showPage: true };
  }, [data, checkValues, loading]);

  /**
   * @description: 选择
   * @param {*} useCallback
   * @param {*} oldValue
   * @return {*}
   */
  const handleChange = useCallback(
    (value, oldValue) => {
      const newSelect = [...checkValues];
      if (value) {
        newSelect.push(value);
      } else {
        newSelect.splice(newSelect.indexOf(oldValue), 1);
      }
      setCheckValues(newSelect);
    },
    [checkValues]
  );

  /**
   * @description: 全选
   * @param {*} value
   * @return {*}
   */
  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(data.map((i) => i.shipOrderId));
    } else {
      setCheckValues([]);
    }
  }
  useEffect(() => {
    defaultLovSetting();
    const myQuery = sessionStorage.getItem('shipPlatformParentQuery') || false;
    if (location.pathname === '/grwl/ship-platform/list' && myQuery) {
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

  /**
   * @description: 改变页码
   * @param {*} page
   * @param {*} sizes
   * @return {*}
   */
  function changePage(page, sizes) {
    headDataSet.setQueryParameter('page', page - 1);
    headDataSet.setQueryParameter('size', sizes);
    handleSearch();
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
    setLoading(true);
    await headDataSet
      .query()
      .then((res) => {
        if (res && !res.failed) {
          const { content, totalElements, size, number } = res;
          setData(content);
          setTotal(totalElements);
          setSelfPage(number + 1);
          setSelfPageSize(size);
          cacheDate.set('content', content);
          cacheDate.set('selfPage', number + 1);
          cacheDate.set('selfPageSize', size);
          cacheDate.set('total', totalElements);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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
  function handleClick(rowDate) {
    setShipOrderId(rowDate.shipOrderId);
    lineDataSet.queryParameter = { shipOrderId: rowDate.shipOrderId };
    lineDataSet.query();
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
      shipOrderStatus: queryDataDsValue?.shipOrderStatus?.join(),
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

  function handleShowTypeSelectModal() {
    modal = Modal.open({
      key: 'lwms-ship-return-platform-type-modal',
      title: '新建订单',
      className: styles['lwms-ship-return-platform-type-modal'],
      movable: false,
      children: <TypeModal onModalCancel={handleModalCancel} onModalOk={handleModalOk} />,
      footer: null,
    });
  }

  function handleModalCancel() {
    modal.close();
  }

  function handleModalOk(rec) {
    if (!isEmpty(rec)) {
      handleToDetail(rec);
    }
    modal.close();
  }

  /**
   * 跳转详情页面
   * @param {*} id
   */
  function handleToDetail(param) {
    let pathname = `/grwl/ship-platform/list`;
    if (param.documentTypeCode === 'SO_SHIP_ORDER') {
      pathname = `/grwl/ship-platform/create/sales`;
    } else if (param.documentTypeCode === 'STANDARD_SHIP_ORDER') {
      pathname = `/grwl/ship-platform/create/normal`;
    } else {
      notification.warning({
        message: '当前单据类型不支持',
      });
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
          const lists = [...checkValues];
          dispatch({
            type: 'grwlShipPlatformModel/changeHeadStatus',
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
          const lists = [...checkValues];
          dispatch({
            type: 'grwlShipPlatformModel/deleteShipOrder',
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
      const lists = [...checkValues];
      dispatch({
        type: 'grwlShipPlatformModel/submitShipOrder',
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

  /**
   * @description: 打印
   * @param {*} async
   * @return {*}
   */
  const handlePrint = async () => {
    if (checkValues.length <= 0) {
      notification.error({
        message: intl.get(`lwms.common.message.validation.select`).d('请选择一条数据'),
      });
    } else {
      const { history } = props;
      const shipOrderIdArray = [...checkValues];
      history.push(`/grwl/ship-platform/print?shipOrderId=${shipOrderIdArray.join(',')}`);
    }
  };

  const handleExecute = async () => {
    const shipOrderIdArr = [...checkValues];
    const res = await userSetting({ defaultFlag: 'Y' });
    const { workerId = '', workerCode = '' } = res && res.content && res.content[0];
    setLoading(true);
    return new Promise((resolve) => {
      const lists = {
        shipOrderIdList: shipOrderIdArr,
        workerId,
        workerCode,
        executeDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      dispatch({
        type: 'grwlShipPlatformModel/executeShipOrder',
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

  const handlecancelExecute = async () => {
    const shipOrderIdArr = [...checkValues];
    setLoading(true);
    return new Promise((resolve) => {
      dispatch({
        type: 'grwlShipPlatformModel/cancelexecuteShipOrder',
        payload: shipOrderIdArr,
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

  /**
   * @description: 物料打印
   * @param {*}
   * @return {*}
   */
  function handleItemPrint() {
    if (checkValues && checkValues.length <= 0) {
      notification.warning({ message: '至少选择一行数据' });
    }
    const shipOrderIdList = [...checkValues];
    setItemPrintLoading(true);
    dispatch({
      type: 'grwlShipPlatformModel/getItemPrintList',
      payload: { shipOrderIdList },
    })
      .then((res) => {
        if (res && res.length > 0) {
          setItemPrintList(res);
          ReactToPrint({ content: printNode.current });
        } else {
          notification.warning({ message: '选择数据暂无打印信息' });
        }
        setItemPrintLoading(false);
      })
      .catch((err) => {
        setItemPrintLoading(false);
        console.log(err);
      });
  }
  return (
    <React.Fragment>
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
          {intl.get('lwms.common.view.title.print').d('打印')}
        </Button>
        <Button onClick={handlecancelExecute} disabled={!isSelected}>
          {intl.get('lwms.common.button.cancel.execution').d('取消执行')}
        </Button>
        <Button onClick={handleExecute} disabled={!isSelected}>
          {intl.get('hzero.common.button.trigger').d('执行')}
        </Button>
        <Button onClick={handleItemPrint} disabled={!isSelected} loading={itemPrintLoading}>
          物料打印
        </Button>
      </Header>
      <Content>
        <div className={styles['lwms-ship-platform']}>
          <TableQueryFrom
            dataSet={headDataSet.queryDataSet}
            onClickQueryCallback={handleSearch}
            queryLoading={loading}
          >
            <Lov name="organizationObj" clearButton noCache />
            <Lov name="shipOrderObj" clearButton noCache />
            <Lov name="customerObj" clearButton noCache />
            <Select name="shipOrderStatus" />
            <Lov name="poNumObj" clearButton noCache />
            <Lov name="salesmanObj" clearButton noCache />
            <Lov name="itemObj" clearButton noCache />
            <Lov name="shipOrderTypeObj" clearButton noCache />
            <Lov name="demandNumObj" clearButton noCache />
            <Lov name="createWorkerObj" clearButton noCache />
            <DatePicker mode="dateTime" name="creationDateStart" />
            <DatePicker mode="dateTime" name="creationDateEnd" />
            <TextField name="customerPoNum" key="customerPoNum" />
            <Lov name="warehouseObj" clearButton noCache />
            <DatePicker mode="dateTime" name="shippedDateStart" />
            <DatePicker mode="dateTime" name="shippedDateStart" />
            <TextField name="customerReceiveType" key="customerReceiveType" />
            <TextField name="customerReceiveOrg" key="customerReceiveOrg" />
            <TextField name="customerReceiveWm" key="customerReceiveWm" />
            <TextField name="customerInventoryWm" key="customerInventoryWm" />
            <TextField name="customerDeliveryTicketNum" />
            <Select name="srmFlag" noCache />
            <Select name="printedFlag" noCache />
          </TableQueryFrom>
          <div className={styles['big-date-table']}>
            <BigDataTable
              config={{ ...config, onRowClick: (rowData) => handleClick(rowData) }}
              pageConfig={pageConfig}
            />
          </div>
        </div>
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
      <div
        ref={(node) => {
          printNode.current = node;
        }}
        className={styles['ship-plat-form-item-print']}
      >
        <ItemPrint itemPrintList={itemPrintList} />
      </div>
    </React.Fragment>
  );
}

export default formatterCollections({
  code: [`${preCode}`],
})((props) => {
  return <ShipPlatform {...props} />;
});
