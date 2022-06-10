/*
 * @Description: 创建销售MO-index
 * @Author: yu.na@hand-china.com
 * @Date: 2021-01-11 15:37:51
 * @LastEditors: Please set LastEditors
 */
import React, { Fragment, useEffect, useState, createRef } from 'react';
import {
  Button,
  PerformanceTable,
  DataSet,
  Form,
  Pagination,
  Lov,
  Select,
  TextField,
  DatePicker,
  Switch,
  CheckBox,
  NumberField,
  Modal,
  Progress,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { queryLovData } from 'hlos-front/lib/services/api';
import { statusRender, yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { HLOS_LSOP } from 'hlos-front/lib/utils/config';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import intl from 'utils/intl';
import { getResponse, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import codeConfig from '@/common/codeConfig';
import notification from 'utils/notification';
import { ListDS } from '@/stores/salesMoCreateDS';
import {
  createSalesMo,
  createSalesMoSplit,
  getSplitTaskLogs,
  splitTaskLogs,
} from '@/services/salesMoCreateService';

import styles from './index.less';

const { common } = codeConfig.code;
const preCode = 'lmes.salesMoCreate';
const organizationId = getCurrentOrganizationId();
let progressModal = null;
let timer = null;
const tableRef = createRef();

const listFactory = () => new DataSet(ListDS());

const SalesMoCreate = () => {
  const listDS = useDataSet(listFactory, SalesMoCreate);

  const [showFlag, setShowFlag] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoading, setShowLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [tableHeight, setTableHeight] = useState(80);
  const [size, setSize] = useState(100);
  const [checkValues, setCheckValues] = useState([]);
  const [frontRunFlag, setFrontRun] = useState(false);
  const [doneFlag, setDone] = useState(false);

  const columns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={handleCheckAllChange}
        />
      ),
      dataIndex: 'soLineId',
      key: 'soLineId',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) =>
        handleCheckCell({ rowData, dataIndex, rowIndex }),
    },
    {
      title: intl.get(`${preCode}.shipOrg`).d('发运组织'),
      dataIndex: 'shipOrganizationName',
      key: 'shipOrganizationName',
      width: 128,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.soNum`).d('销售订单'),
      dataIndex: 'soLineNum',
      key: 'soLineNum',
      width: 144,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.item`).d('物料'),
      dataIndex: 'item',
      key: 'item',
      width: 200,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.uom`).d('单位'),
      dataIndex: 'uomName',
      key: 'uomName',
      width: 70,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.demandQty`).d('需求数量'),
      dataIndex: 'demandQty',
      key: 'demandQty',
      width: 82,
      fixed: true,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.planQty`).d('本次计划数量'),
      dataIndex: 'planQty',
      key: 'planQty',
      width: 82,
      fixed: true,
      resizable: true,
      render: ({ rowData, rowIndex }) => (
        <NumberField
          className={styles['require-field']}
          min={0}
          value={rowData.planQty || 0}
          onChange={(val) => handleInputChange(val, rowData, rowIndex)}
        />
      ),
    },
    {
      title: intl.get(`${preCode}.plannedQty`).d('已计划数量'),
      dataIndex: 'plannedQty',
      key: 'plannedQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.mtoFlag`).d('按单分解'),
      dataIndex: 'mtoFlag',
      key: 'mtoFlag',
      width: 82,
      resizable: true,
      render: yesOrNoRender,
    },
    {
      title: intl.get(`${preCode}.onhandQty`).d('现有量'),
      dataIndex: 'onhandQty',
      key: 'onhandQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customer`).d('客户'),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.demandDate`).d('需求日期'),
      dataIndex: 'demandDate',
      key: 'demandDate',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.promiseDate`).d('承诺日期'),
      dataIndex: 'promiseDate',
      key: 'promiseDate',
      width: 100,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customerItem `).d('客户物料'),
      dataIndex: 'customerItem',
      key: 'customerItem',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.customerPo`).d('客户PO'),
      dataIndex: 'customerPo',
      key: 'customerPo',
      width: 144,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.sopOu`).d('销售中心'),
      dataIndex: 'sopOuName',
      key: 'sopOuName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.salesman`).d('销售员'),
      dataIndex: 'salesManName',
      key: 'salesManName',
      width: 84,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.itemCategory`).d('物料销售类别'),
      dataIndex: 'itemCategoryName',
      key: 'itemCategoryName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.secondUomQty`).d('辅助单位数量'),
      dataIndex: 'secondDemandQtyAndUom',
      key: 'secondDemandQtyAndUom',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.packingRule`).d('装箱规则'),
      dataIndex: 'packingRuleName',
      key: 'packingRuleName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.packingFormat`).d('包装方式'),
      dataIndex: 'packingFormatMeaning',
      key: 'packingFormatMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.packingMaterial`).d('包装材料'),
      dataIndex: 'packingMaterial',
      key: 'packingMaterial',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.minPackingQty`).d('最小包装数'),
      dataIndex: 'minPackingQty',
      key: 'minPackingQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.packingQty`).d('单位包装数'),
      dataIndex: 'packingQty',
      key: 'packingQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.containerQty`).d('箱数'),
      dataIndex: 'containerQty',
      key: 'containerQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.palletContainerQty`).d('托盘数'),
      dataIndex: 'palletContainerQty',
      key: 'palletContainerQty',
      width: 82,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.packageNum`).d('包装编号'),
      dataIndex: 'packageNum',
      key: 'packageNum',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.tagTemplate`).d('标签模板'),
      dataIndex: 'tagTemplate',
      key: 'tagTemplate',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.lotNumber`).d('指定批次'),
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.tagCode`).d('指定标签'),
      dataIndex: 'tagCode',
      key: 'tagCode',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.orderType`).d('订单类型'),
      dataIndex: 'soTypeName',
      key: 'soTypeName',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.soStatus`).d('订单状态'),
      dataIndex: 'soStatusMeaning',
      key: 'soStatusMeaning',
      width: 90,
      resizable: true,
      render: ({ rowData, dataIndex }) => statusRender(rowData.soStatus, rowData[dataIndex]),
    },
    {
      title: intl.get(`${preCode}.soLineType`).d('行类型'),
      dataIndex: 'soLineTypeMeaning',
      key: 'soLineTypeMeaning',
      width: 128,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.soLineStatus`).d('行状态'),
      dataIndex: 'soLineStatusMeaning',
      key: 'soLineStatusMeaning',
      width: 90,
      resizable: true,
      render: ({ rowData, dataIndex }) => statusRender(rowData.soLineStatus, rowData[dataIndex]),
    },
    {
      title: intl.get(`${preCode}.remark`).d('订单备注'),
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      resizable: true,
    },
    {
      title: intl.get(`${preCode}.lineRemark`).d('订单行备注'),
      dataIndex: 'lineRemark',
      key: 'lineRemark',
      width: 200,
      resizable: true,
    },
  ];

  useEffect(() => {
    async function queryDefaultOrg() {
      const res = await queryLovData({
        lovCode: common.organization,
        defaultFlag: 'Y',
      });
      if (
        res &&
        res.content &&
        res.content[0] &&
        listDS.queryDataSet &&
        listDS.queryDataSet.current
      ) {
        listDS.queryDataSet.current.set('organizationObj', res.content[0]);
      }
      if (listDS.queryDataSet && listDS.queryDataSet.current) {
        listDS.queryDataSet.current.set('lineStatus', ['RELEASED', 'PLANNED']);
        handleSearch();
      }
    }
    queryDefaultOrg();
  }, []);

  useEffect(() => {
    function handleResize() {
      calcTableHeight(dataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource]);

  useEffect(() => {
    if (frontRunFlag) {
      setFrontRun(false);
      notification.success();
      handleSearch();
    }
  }, [doneFlag]);

  function handleInputChange(val, rec, idx) {
    const cloneData = [...dataSource];
    cloneData.splice(idx, 1, {
      ...rec,
      planQty: val,
    });
    setDataSource(cloneData);
    const checkIdx = checkValues.findIndex((i) => i.soLineId === rec.soLineId);
    const newRec = {
      ...rec,
      planQty: val,
    };
    if (checkIdx > -1) {
      const cloneCheckValues = [...checkValues];
      cloneCheckValues.splice(checkIdx, 1, newRec);
      setCheckValues(cloneCheckValues);
    } else {
      setCheckValues(checkValues.concat(newRec));
    }
  }

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        value={rowData.soLineId}
        checked={checkValues.findIndex((i) => i.soLineId === rowData.soLineId) !== -1}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={(val) => handleCheckboxChange(val, rowData)}
      />
    );
  }

  function handleCheckboxChange(value, rowData) {
    const newCheckValues = [...checkValues];
    if (value) {
      newCheckValues.push(rowData);
    } else {
      newCheckValues.splice(
        newCheckValues.findIndex((i) => i.soLineId === rowData.soLineId),
        1
      );
    }
    setCheckValues(newCheckValues);
  }

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
    } else {
      setCheckValues([]);
    }
  }

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="soObj" noCache key="soObj" />,
      <Lov name="customerObj" noCache key="customerObj" />,
      <Select name="lineStatus" key="lineStatus" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <TextField name="customerItemCode" key="customerItemCode" />,
      <TextField name="customerPo" key="customerPo" />,
      <Lov name="salesmanObj" key="salesmanObj" noCache />,
      <DatePicker name="demandDateStart" key="demandDateStart" />,
      <DatePicker name="demandDateEnd" key="demandDateEnd" />,
      <Lov name="documentTypeObj" key="documentTypeObj" noCache />,
      <Switch name="unCompleted" key="unCompleted" />,
      <Select name="mtoFlag" key="mtoFlag" />,
    ];
  }

  /**
   * 查询
   */
  async function handleSearch(page = 0, pageSize = 100, flag) {
    const validateValue = await listDS.queryDataSet.validate(false, false);
    if (!validateValue) {
      return;
    }
    listDS.queryParameter = {
      ...listDS.queryDataSet.current.toJSONData(),
      page,
      size: pageSize,
    };
    if (flag) {
      setCurrentPage(1);
    }
    setShowLoading(true);
    const res = await listDS.query();
    setShowLoading(false);
    if (res && res.content) {
      res.content.forEach((i) => {
        i.planQty = (i.demandQty || 0) - (i.plannedQty || 0);
      });
      setDataSource(res.content);
      setTotalElements(res.totalElements || 0);
      calcTableHeight(res.content.length);
      setCheckValues([]);
    }
  }

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(styles['lmes-sales-mo-create'])[0];
    const queryContainer = document.getElementsByClassName(styles['lmes-sales-mo-create-query'])[0];
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 75;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表格高度, 10: 滚动条高度
      setTableHeight(dataLength * 38 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight < 80 ? 80 : maxTableHeight);
    }
  }

  // 页码更改
  function handlePageChange(page, pageSize) {
    // 当切换展示数量时，回到第一页
    let pageValue = page;
    const pageSizeValue = pageSize;
    if (pageSize !== size) {
      pageValue = 1;
    }
    setCurrentPage(pageValue);
    setSize(pageSizeValue);
    handleSearch(pageValue - 1, pageSizeValue);
  }

  /**
   * 重置
   */
  function handleReset() {
    listDS.queryDataSet.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  async function handleSubmit() {
    if (checkValues.length < 1) {
      notification.warning({
        message: '请至少选择一行数据进行编辑',
      });
      return;
    }
    const validateValue = await listDS.validate(true, false);

    if (!validateValue) return;
    const submitData = [];
    checkValues.forEach((i) => {
      const { soHeaderId, soLineId, planQty, soLineNum } = i;
      const soNum = soLineNum ? soLineNum.split('-')[0] : null;
      const idx = submitData.findIndex((s) => s.soId === soHeaderId);
      if (idx !== -1) {
        submitData.splice(idx, 1, {
          ...submitData[idx],
          lines: submitData[idx].lines.concat({
            soLineId,
            planQty,
          }),
        });
      } else {
        submitData.push({
          soId: soHeaderId,
          soNum,
          lines: [
            {
              soLineId,
              planQty,
            },
          ],
        });
      }
    });
    if (checkValues.length > 20) {
      const res = await createSalesMoSplit(submitData);
      if (res) {
        changeProgress(res.toFixed());
      }
    } else {
      const res = await createSalesMo(submitData);
      if (getResponse(res)) {
        notification.success();
        handleSearch(0, size, true);
      }
    }
  }

  function changeProgress(id) {
    progressModal = Modal.open({
      title: '提交进度',
      className: styles['lmes-sales-mo-create-progress-modal'],
      children: (
        <div>
          <Progress value={0} type="circle" size="large" />
        </div>
      ),
      okText: '终止操作',
      cancelText: '后台运行',
      onOk: async () => {
        clearInterval(timer);
        const stopRes = await splitTaskLogs({
          status: 'TERMINATION',
        });
        if (getResponse(stopRes)) {
          notification.success({
            message: '终止操作成功',
          });
          handleSearch(0, size, true);
        }
      },
    });
    timer = setInterval(async () => {
      const logRes = await getSplitTaskLogs(id);
      if (logRes) {
        const resultArr = logRes.result ? logRes.result.split('\n') : [];
        progressModal.update({
          title: '提交进度',
          className: styles['lmes-sales-mo-create-progress-modal'],
          children: (
            <div>
              <Progress
                strokeColor="#00bf96"
                value={logRes.process * 100}
                type="circle"
                size="large"
                format={(val) => (logRes.process === 1 ? 'Done' : `${val.toFixed()}%`)}
              />
              <ul style={{ position: 'relative', left: 150, top: -110, width: 520 }}>
                {resultArr.map((i, index) => {
                  const style = {
                    listStyleType: index % 2 === 0 ? 'disc' : 'circle',
                    color: i.includes('错误') ? 'red' : '#333',
                  };
                  return (
                    <li key={i} style={style}>
                      {i}
                    </li>
                  );
                })}
              </ul>
            </div>
          ),
          okCancel: logRes.process !== 1,
          okText: logRes.process === 1 ? '关闭' : '终止操作',
          cancelText: '后台运行',
          onOk: async () => {
            if (timer) {
              clearInterval(timer);
            }
            progressModal.close();
            const stopRes = await splitTaskLogs({
              ...logRes,
              status: 'TERMINATION',
            });
            if (getResponse(stopRes)) {
              handleSearch(0, size, true);
            }
          },
          onCancel: () => {
            progressModal.close();
            setFrontRun(true);
          },
        });
        if (logRes.process === 1) {
          setDone(true);
          if (timer) {
            clearInterval(timer);
          }
        }
      }
    }, 500);
  }

  /**
   *导出
   *
   * @returns
   */
  function getExportQueryParams() {
    const formObj = listDS.queryDataSet.current;
    const fieldsValue = !formObj ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.index`).d('创建销售MO')}>
        <Button color="primary" onClick={handleSubmit} loading={frontRunFlag && !doneFlag}>
          {intl.get('hzero.common.button.submit').d('提交')}
        </Button>
        <ExcelExport
          requestUrl={`${HLOS_LSOP}/v1/${organizationId}/so-headers/so-create-mo-excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content className={styles['lmes-sales-mo-create']}>
        <div className={styles['lmes-sales-mo-create-query']}>
          <Form dataSet={listDS.queryDataSet} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div className={styles['right-btns']}>
            <Button onClick={handleToggle}>
              {!showFlag
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch(0, size, true)}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
        {/* <Table dataSet={listDS} columns={columns} columnResizable="true" queryFieldsLimit={4} /> */}
        <PerformanceTable
          virtualized
          data={dataSource}
          ref={tableRef}
          columns={columns}
          height={tableHeight}
          rowHeight={38}
          loading={showLoading}
        />
        <Pagination
          pageSizeOptions={['100', '200', '500', '1000', '5000', '10000']}
          total={totalElements}
          onChange={handlePageChange}
          pageSize={size}
          page={currentPage}
        />
      </Content>
    </Fragment>
  );
};

export default SalesMoCreate;
