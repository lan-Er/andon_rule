/*
 * @Description:多工单合并新建领料单
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-12-07 18:30:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-18 17:52:41
 */

import React, { useState, useEffect, useMemo, Fragment } from 'react';
import {
  Lov,
  Form,
  PerformanceTable,
  Modal,
  Select,
  TextField,
  Button,
  Radio,
  Switch,
  DateTimePicker,
  DataSet,
  NumberField,
  CheckBox,
} from 'choerodon-ui/pro';
import { xorBy } from 'lodash';
import CLov from 'components/Lov';
import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import moment from 'moment';
import { Tooltip } from 'choerodon-ui';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { userSetting } from 'hlos-front/lib/services/api';
import SeniorSearch from './seniorSearch';
import { mulTableDS, seniorSearchDS } from '@/stores/issueRequestDS';
import { mulMoQuerySer, mulMoSubmitSer, mulMoSaveSer } from '@/services/issueRequestService';

import styles from '../styles/index.module.less';
import groupBy from '../utils/index';

export default function MulMoCreate(props) {
  const myState = sessionStorage.getItem('initMyState');
  const myRuturnOrderObj = myState ? JSON.parse(myState) && JSON.parse(myState).returnOrderObj : {};
  const { approvalRule, approvalWorkflow, documentTypeId, documentTypeCode } =
    (props.location && props.location.state && props.location.state.returnOrderObj) ||
    myRuturnOrderObj;
  // 表格ds
  const bottomTableDS = useMemo(() => new DataSet(mulTableDS()), []);
  // 高级搜索ds
  const modalTableDS = useMemo(() => new DataSet(seniorSearchDS()), []);
  const [showFlag, changeShowFlag] = useState(false);
  const [checkedValue, setCheckedValue] = useState('TODAY');
  const [isSameCheck, setIsSameCheck] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [checkValues, setCheckValues] = useState([]);
  const [tableHeight, setTableHeight] = useState(80);

  const modalKey = Modal.key();
  const buttons = () => {
    return (
      <Fragment>
        <Button icon="add" color="primary" funcType="flat" onClick={() => bottomTableAdd()}>
          新增
        </Button>
        <Button icon="delete" color="primary" funcType="flat" onClick={() => removeSelectData()}>
          删除
        </Button>
      </Fragment>
    );
  };

  // 列
  const columns = [
    {
      title: (
        <CheckBox
          name="controlled"
          checked={checkValues.length > 0 && checkValues.length === dataSource.length}
          onChange={handleCheckAllChange}
        />
      ),
      dataIndex: 'requestLineNum',
      key: 'requestLineNum',
      width: 50,
      fixed: true,
      render: ({ rowData, dataIndex, rowIndex }) =>
        handleCheckCell({ rowData, dataIndex, rowIndex }),
      resizable: true,
    },
    {
      title: '行号',
      dataIndex: 'requestLineNum',
      key: 'requestLineNum',
      width: 70,
      fixed: true,
      resizable: true,
    },
    {
      title: '物料',
      dataIndex: 'itemObj',
      key: 'itemObj',
      // editor: (record) => (record.get('isAdd') ? <Lov onChange={handleItemChange} /> : false),
      width: 128,
      fixed: true,
      render: ({ rowData }) => {
        if (rowData.isAdd) {
          return (
            <CLov
              className={styles['require-field']}
              value={rowData?.itemId}
              textValue={rowData?.itemCode}
              code="LMDS.ITEM"
              queryParams={{
                organizationId: bottomTableDS.queryDataSet.current.get('ownerOrganizationId'),
              }}
              onChange={(val, item) => handleItemChange(item, rowData)}
            />
          );
        }
        return rowData?.itemCode;
      },
      resizable: true,
    },
    {
      title: '物料描述',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      width: 200,
      resizable: true,
    },
    {
      title: '单位',
      dataIndex: 'uomName',
      key: 'uomName',
      width: 70,
      resizable: true,
    },
    {
      title: '需求数量',
      dataIndex: 'demandQty',
      key: 'demandQty',
      width: 84,
      resizable: true,
    },
    {
      title: '申请数量',
      dataIndex: 'applyQty',
      key: 'applyQty',
      width: 84,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <NumberField
          className={styles['require-field']}
          min={0}
          value={rowData?.applyQty}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: '可用量',
      dataIndex: 'availableQty',
      key: 'availableQty',
      width: 84,
      resizable: true,
    },
    {
      title: '现有量',
      dataIndex: 'onhandQty',
      key: 'onhandQty',
      width: 84,
      resizable: true,
    },
    {
      title: '发出仓库',
      dataIndex: 'fromWarehouseObj',
      key: 'fromWarehouseObj',
      width: 128,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <CLov
          value={rowData?.warehouseId}
          textValue={rowData?.warehouseName}
          code="LMDS.WAREHOUSE"
          queryParams={{
            organizationId: bottomTableDS.queryDataSet.current.get('ownerOrganizationId'),
          }}
          onChange={(val, item) => handleWmChange(item, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: '发出货位',
      dataIndex: 'fromWareAreaObj',
      key: 'fromWareAreaObj',
      width: 128,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <CLov
          value={rowData?.wmAreaId}
          textValue={rowData?.wmAreaName}
          code="LMDS.WM_AREA"
          queryParams={{
            warehouseId: rowData.warehouseId,
          }}
          onChange={(val, item) => handleWmChange(item, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: '目标仓库',
      dataIndex: 'toWarehouseObj',
      key: 'toWarehouseObj',
      width: 128,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <CLov
          value={rowData?.toWarehouseId}
          textValue={rowData?.toWarehouseName}
          code="LMDS.WAREHOUSE"
          queryParams={{
            organizationId: bottomTableDS.queryDataSet.current.get('ownerOrganizationId'),
          }}
          onChange={(val, item) => handleWmChange(item, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: '目标货位',
      dataIndex: 'toWareAreaObj',
      key: 'toWareAreaObj',
      width: 128,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <CLov
          value={rowData?.toWmAreaId}
          textValue={rowData?.toWmAreaName}
          code="LMDS.WM_AREA"
          queryParams={{
            warehouseId: rowData.toWarehouseId,
          }}
          onChange={(val, item) => handleWmChange(item, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: '物料控制类型',
      dataIndex: 'itemControlTypeMeaning',
      key: 'itemControlTypeMeaning',
      width: 84,
      resizable: true,
    },
    {
      title: '申请包装数量',
      dataIndex: 'applyPackQty',
      key: 'applyPackQty',
      width: 84,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <NumberField
          min={0}
          value={rowData?.applyPackQty}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: '申请重量',
      dataIndex: 'applyWeight',
      key: 'applyWeight',
      width: 84,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <NumberField
          min={0}
          value={rowData?.applyWeight}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: '辅助单位',
      dataIndex: 'secondUomName',
      key: 'secondUomName',
      width: 70,
      resizable: true,
    },
    {
      title: '辅助单位数量',
      dataIndex: 'secondApplyQty',
      key: 'secondApplyQty',
      width: 84,
      render: ({ rowData, dataIndex, rowIndex }) => {
        if (rowData.secondUomId) {
          return (
            <NumberField
              min={0}
              value={rowData?.secondApplyQty}
              onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
            />
          );
        }
        return rowData?.secondApplyQty;
      },
      resizable: true,
    },
    {
      title: '指定批次',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 128,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <TextField
          value={rowData?.lotNumber}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: '指定标签',
      dataIndex: 'tagCode',
      key: 'tagCode',
      width: 128,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <TextField
          value={rowData?.tagCode}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: '行备注',
      dataIndex: 'lineRemark',
      key: 'lineRemark',
      width: 200,
      render: ({ rowData, dataIndex, rowIndex }) => (
        <TextField
          value={rowData?.lineRemark}
          onChange={(val) => handleInputChange(val, dataIndex, rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: '拣料规则',
      dataIndex: 'pickRuleObj',
      key: 'pickRuleObj',
      width: 128,
      render: ({ rowData, rowIndex }) => (
        <CLov
          value={rowData?.pickRuleId}
          textValue={rowData?.pickRule}
          code="LMDS.RULE"
          queryParams={{
            ruleType: 'PICK',
          }}
          onChange={(val, item) => handleRuleChange(item, 'pickRule', rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: '预留规则',
      dataIndex: 'reservationRuleObj',
      key: 'reservationRuleObj',
      width: 128,
      render: ({ rowData, rowIndex }) => (
        <CLov
          value={rowData?.reservationRuleId}
          textValue={rowData?.reservationRule}
          code="LMDS.RULE"
          queryParams={{
            ruleType: 'PRESERVE',
          }}
          onChange={(val, item) => handleRuleChange(item, 'reservationRule', rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: 'FIFO规则',
      dataIndex: 'fifoRuleObj',
      key: 'fifoRuleObj',
      width: 128,
      render: ({ rowData, rowIndex }) => (
        <CLov
          value={rowData?.fifoRuleId}
          textValue={rowData?.fifoRule}
          code="LMDS.RULE"
          queryParams={{
            ruleType: 'FIFO',
          }}
          onChange={(val, item) => handleRuleChange(item, 'fifoRule', rowData, rowIndex)}
        />
      ),
      resizable: true,
    },
    {
      title: intl.get('hzero.common.button.action').d('操作'),
      width: 90,
      render: ({ rowData, rowIndex }) => {
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
              onClick={() => removeData(rowData, rowIndex)}
            />
          </Tooltip>,
        ];
      },
      fixed: 'right',
      resizable: true,
    },
  ];

  useEffect(() => {
    function handleResize() {
      calcTableHeight(dataSource.length);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataSource]);

  function handleInputChange(val, type, rec, idx) {
    const cloneData = [...dataSource];
    cloneData.splice(idx, 1, {
      ...rec,
      [`${type}`]: val,
    });
    setDataSource(cloneData);
    setCheckValues(cloneData);
  }

  function handleWmChange(val, type, rec, idx) {
    const cloneData = [...dataSource];
    let params = { ...rec };
    if (type === 'fromWarehouseObj') {
      params = {
        ...params,
        warehouseId: val.warehouseId,
        warehouseCode: val.warehouseCode,
        warehouseName: val.warehouseName,
      };
    } else if (type === 'fromWmAreaObj') {
      params = {
        ...params,
        wmAreaId: val.wmAreaId,
        wmAreaCode: val.wmAreaCode,
        wmAreaName: val.wmAreaName,
      };
    } else if (type === 'toWarehouseObj') {
      params = {
        ...params,
        toWarehouseId: val.warehouseId,
        toWarehouseCode: val.warehouseCode,
        toWarehouseName: val.warehouseName,
      };
    } else if (type === 'toWmAreaObj') {
      params = {
        ...params,
        toWmAreaId: val.wmAreaId,
        toWmAreaCode: val.wmAreaCode,
        toWmAreaName: val.wmAreaName,
      };
    }
    cloneData.splice(idx, 1, params);
    setDataSource(cloneData);
  }

  function handleRuleChange(val, type, rec, idx) {
    const cloneData = [...dataSource];
    cloneData.splice(idx, 1, {
      ...rec,
      [`${type}Id`]: val.ruleId,
      [`${type}`]: val.ruleJson,
    });
    setDataSource(cloneData);
  }

  function handleCheckboxChange(value, rowData) {
    const newCheckValues = [...checkValues];
    if (value) {
      newCheckValues.push(rowData);
    } else {
      newCheckValues.splice(
        newCheckValues.findIndex((i) => i.requestLineNum === rowData.requestLineNum),
        1
      );
    }
    setCheckValues(newCheckValues);
  }

  function handleCheckCell({ rowData, rowIndex }) {
    return (
      <CheckBox
        key={rowIndex}
        name="controlled"
        onClick={(e) => {
          e.stopPropagation();
        }}
        value={rowData.requestLineNum}
        checked={checkValues.findIndex((i) => i.requestLineNum === rowData.requestLineNum) !== -1}
        onChange={(val) => handleCheckboxChange(val, rowData)}
      />
    );
  }

  function handleCheckAllChange(value) {
    if (value) {
      setCheckValues(dataSource);
    } else {
      setCheckValues([]);
    }
  }

  const today = moment().format('YYYY-MM-DD 00:00:00');
  const todayEnd = moment().format('YYYY-MM-DD 23:59:59');
  const tomorrow = moment(new Date()).add(1, 'days').format('YYYY-MM-DD 00:00:00');
  const tomorrowEnd = moment(new Date()).add(1, 'days').format('YYYY-MM-DD 23:59:59');

  const weekStart = moment().startOf('week').format('YYYY-MM-DD 00:00:00');
  const weekEnd = moment().endOf('week').format('YYYY-MM-DD 23:59:59');

  /**
   * 设置默认组织
   */
  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        setUserInfo(res.content[0]);
        bottomTableDS.queryDataSet.current.set('organizationObj', {
          meOuId: res.content[0].meOuId,
          meOuName: res.content[0].meOuName,
          meOuCode: res.content[0].organizationCode,
        });
        bottomTableDS.queryDataSet.current.set('planStartDateLeft', today);
        bottomTableDS.queryDataSet.current.set('planStartDateRight', todayEnd);
      }
    }
    getUserInfo();
  }, []);

  /**
   * @description: 高级搜索打开弹窗
   */
  const openModal = () => {
    Modal.open({
      key: modalKey,
      title: 'MO高级搜索',
      style: {
        width: '100%',
        height: '100%',
        top: 0,
      },
      fullScreen: true,
      mask: true,
      className: styles['my-mo-height-search-list'],
      children: <SeniorSearch ds={modalTableDS} />,
      okText: '确定',
      onOk: onModalOk,
    });
  };

  /**
   * @description: 弹框点击确认
   */
  const onModalOk = () => {
    const modalData = modalTableDS.selected.map((i) => i.toData());
    bottomTableDS.queryDataSet.current.set('moNumObj', modalData);
  };

  /**
   * @description: 行新增
   */
  const bottomTableAdd = () => {
    const { organizationObj } = bottomTableDS.queryDataSet.current.data;
    if (organizationObj && organizationObj.meOuId) {
      const cloneData = [...dataSource];
      const cloneCheckValue = [...checkValues];
      cloneData.unshift({ requestLineNum: dataSource.length + 1, isAdd: true });
      cloneCheckValue.unshift({ requestLineNum: dataSource.length + 1, isAdd: true });
      setDataSource(cloneData);
      setCheckValues(cloneCheckValue);
    } else {
      notification.warning({
        message: '请先选择组织',
      });
    }
  };

  /**
   * @description: 行删除
   * @param {object} record 行记录
   * @param {object} dataSet DS
   */
  function removeData(record, index) {
    const cloneData = [...dataSource];
    const cloneCheckValus = [...checkValues];
    const checkIdx = cloneCheckValus.findIndex((i) => i.requestLineNum === record.requestLineNum);
    cloneData.splice(index, 1);
    cloneCheckValus.splice(checkIdx, 1);
    setDataSource(cloneData);
    setCheckValues(cloneCheckValus);
  }

  function removeSelectData() {
    setDataSource(xorBy(dataSource, checkValues, 'requestLineNum'));
    setCheckValues([]);
  }

  /**
   * @description: 保存 & 提交
   * @param {function} func 方法
   * @param {string} type 提交/保存
   */
  const saveAndSubmit = async (func, type) => {
    const validateValue = checkValues.every(
      (i) => i.itemId && i.applyQty !== null && i.applyQty !== undefined
    );
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    if (!checkValues.length) {
      notification.warning({
        message: '未选中领料单行',
      });
      return;
    }
    const { organizationObj } = bottomTableDS.queryDataSet.current.data;
    const { userName, userId } = userInfo;

    // 只取有发出和目标仓库的行数据
    // 先将有 发出、目标仓库 的数据收集起来
    const hasWarehouseArr = [];
    checkValues.forEach((i) => {
      if (i.warehouseId && i.toWarehouseId) {
        hasWarehouseArr.push(i);
      }
    });
    // 先以发出仓库相同的即 warehouseId 相同的数据 进行分组
    const sameWarehouseArr = groupBy(hasWarehouseArr, 'warehouseId');
    // 再将分组后的数据 sameWarehouseArr 再以 具有相同目标仓库的 即 toWarehouseId 相同 的进行分组
    const sameToWarehouseArr = sameWarehouseArr.map((i) => groupBy(i, 'toWarehouseId'));
    // 最后 具有相同发出和目标仓库的会生成一个对象，附加一些其他参数（操作工、组织、仓库、领料单类型、备注）
    // 对象里面的 requestLineList 就是 具有相同发出和目标仓库的 行数据
    const paramsArr = [];
    sameToWarehouseArr.forEach((outerItem) => {
      outerItem.forEach(async (innerItem) => {
        const { warehouseId, warehouseCode } = innerItem[0];
        // 取 innerItem 里的每个 lineRemark,
        // 进行一次去重，转成字符串， 赋给头备注 （20210505，取消该逻辑 leying.yan@hand-china.com）
        // const RemarkArr = innerItem.map((item) => item.lineRemark);
        // const mulRemark = Array.from(new Set(RemarkArr)).toString();
        const requestTypeId = documentTypeId;
        const requestTypeCode = documentTypeCode;
        const _lineList = [];
        for (let i = 0; i < innerItem.length; i++) {
          _lineList.push({
            ...innerItem[i],
          });
        }
        const name = userName ? userName.split(' ') : null;
        const params = {
          organizationId: organizationObj.meOuId,
          organizationCode: organizationObj.meOuCode,
          warehouseId,
          warehouseCode,
          requestTypeId,
          requestTypeCode,
          approvalRule,
          approvalWorkflow,
          creatorId: userId,
          creator: name === null ? null : name[1],
          remark: '', // mulRemark,
          requestLineList: _lineList,
          _status: 'create',
        };
        paramsArr.push(params);
      });
    });
    if (!paramsArr.length) {
      notification.warning({
        message: `无发出仓库或目标仓库的领料单行不会被${type}`,
      });
      return;
    }
    const res = await func(paramsArr);
    if (!res.failed) {
      notification.success({
        message: res.message || `${type}成功`,
        duration: 3,
      });
      if (type === '提交') {
        props.history.push('/lwms/issue-request-platform/list');
      }
    } else {
      notification.error({
        message: res.message || `${type}失败`,
        duration: 3,
      });
    }
    // }, 1000);
  };

  /**
   * @description: 更多 显影
   */
  const handleToggle = () => {
    changeShowFlag(!showFlag);
  };

  const judgeValeType = (val) => {
    switch (val) {
      case 'TODAY':
        bottomTableDS.queryDataSet.current.set('planStartDateLeft', today);
        bottomTableDS.queryDataSet.current.set('planStartDateRight', todayEnd);
        break;
      case 'TOMORROW':
        bottomTableDS.queryDataSet.current.set('planStartDateLeft', tomorrow);
        bottomTableDS.queryDataSet.current.set('planStartDateRight', tomorrowEnd);
        break;
      case 'WEEK':
        bottomTableDS.queryDataSet.current.set('planStartDateLeft', weekStart);
        bottomTableDS.queryDataSet.current.set('planStartDateRight', weekEnd);
        break;
      default:
        bottomTableDS.queryDataSet.current.set('planStartDateLeft', today);
        bottomTableDS.queryDataSet.current.set('planStartDateRight', todayEnd);
        break;
    }
  };

  /**
   * @description: 日周月切换
   * @param: 选择的值
   */
  const handleRadioChange = (val) => {
    setCheckedValue(val);
    setIsSameCheck(true);
    judgeValeType(val);
  };

  /**
   * @description: 日周月点击设置为空 再点击设置回去
   * @param: e
   */
  const handleRadioClick = (e) => {
    const val = e.target.value;
    if (val === checkedValue && isSameCheck) {
      bottomTableDS.queryDataSet.current.set('planStartDateLeft', null);
      bottomTableDS.queryDataSet.current.set('planStartDateRight', null);
      setIsSameCheck(!isSameCheck);
      setCheckedValue('');
    } else {
      judgeValeType(val);
    }
  };

  /**
   * @description: 日期清空 清空日月周的选中
   */
  const handleDateClear = () => {
    setCheckedValue('');
  };

  /**
   * @description: 查询按钮处理
   * 将查询到的数据塞到行内
   */
  const handleQuery = async () => {
    setDataSource([]);
    const queryDSValidate = await bottomTableDS.queryDataSet.validate(false, false);
    if (!queryDSValidate) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await mulMoQuerySer(bottomTableDS.queryDataSet.toJSONData());
    if (getResponse(res)) {
      if (res.failed) {
        notification.error({
          message: res.message,
        });
      } else if (res.length) {
        res.forEach((i, index) => {
          i.requestLineNum = res.length - index;
          i.itemDisabledFlag = true;
          i.applyQty = i.demandQty;
          i.warehouseId = i.fromWarehouseId;
          i.warehouseCode = i.fromWarehouseCode;
          i.warehouseName = i.fromWarehouseName;
          i.wmAreaId = i.fromWmAreaId;
          i.wmAreaCode = i.fromWmAreaCode;
          i.wmAreaName = i.fromWmAreaName;
          i._status = 'create';
        });
        setDataSource(res);
        setCheckValues(res);
        calcTableHeight(res.length);
      } else {
        notification.warning({
          message: '未找到有效数据',
        });
      }
    }
  };

  function handleItemChange(rec, rowData) {
    if (rec) {
      const idx = dataSource.findIndex((i) => i.requestLineNum === rowData.requestLineNum);
      const cloneData = [...dataSource];
      if (idx > -1) {
        cloneData.splice(idx, 1, {
          ...rowData,
          itemId: rec.itemId,
          itemCode: rec.itemCode,
          itemDescription: rec.description,
          uomId: rec.uomId,
          uomCode: rec.uom,
          uomName: rec.uomName,
          secondUomId: rec.secondUomId,
          secondUom: rec.secondUom,
          secondUomName: rec.secondUomName,
        });
        setDataSource(cloneData);
      }
    }
  }

  function calcTableHeight(dataLength) {
    const pageContainer = document.getElementsByClassName(styles['lwms-issueRequest-content'])[0];
    const queryContainer = document.getElementsByClassName(styles['top-query'])[0];
    const maxTableHeight = pageContainer.offsetHeight - queryContainer.offsetHeight - 75;
    if (dataLength === 0) {
      // 无数据时设置表格高度为80
      setTableHeight(80);
    } else if (dataLength * 33 < maxTableHeight) {
      // 数据量较少时按数据量显示高度 30：行高度，33：表头高度, 10: 滚动条高度
      setTableHeight(dataLength * 30 + 33 + 10);
    } else {
      setTableHeight(maxTableHeight);
    }
  }

  return (
    <div className={styles['mul-mo-create-wrapper']}>
      <Header title="多工单混合领料单新建" backPath="/lwms/issue-request-platform/list">
        <div className={styles['header-search']}>
          <div className={styles['header-search-left']}>
            <Radio
              mode="button"
              name="day"
              value="TODAY"
              checked={checkedValue === 'TODAY'}
              onChange={handleRadioChange}
              onClick={handleRadioClick}
            >
              今日
            </Radio>
            <Radio
              mode="button"
              name="week"
              value="TOMORROW"
              checked={checkedValue === 'TOMORROW'}
              onChange={handleRadioChange}
              onClick={handleRadioClick}
            >
              明日
            </Radio>
            <Radio
              mode="button"
              name="month"
              value="WEEK"
              checked={checkedValue === 'WEEK'}
              onChange={handleRadioChange}
              onClick={handleRadioClick}
            >
              本周
            </Radio>
          </div>
          <div className={styles['header-search-right']}>
            <Button icon="save" onClick={() => saveAndSubmit(mulMoSaveSer, '保存')}>
              保存
            </Button>
            <Button icon="submit" onClick={() => saveAndSubmit(mulMoSubmitSer, '提交')}>
              提交
            </Button>
          </div>
        </div>
      </Header>
      <Content className={styles['lwms-issueRequest-content']}>
        <div className={styles['top-query']}>
          <div className={styles['top-query-left']}>
            <Form dataSet={bottomTableDS.queryDataSet} columns={4}>
              <DateTimePicker name="planStartDateLeft" onClear={handleDateClear} />
              <DateTimePicker name="planStartDateRight" onClear={handleDateClear} />
              <Lov name="fromWarehouse" noCache />
              <Lov name="organizationObj" noCache />
            </Form>
            <div style={!showFlag ? { display: 'none' } : { display: 'block' }}>
              <Form dataSet={bottomTableDS.queryDataSet} columns={4}>
                <Lov name="prodLineObj" noCache />
                <Lov name="meAreaObj" noCache />
                <Lov name="equipmentObj" noCache />
                <TextField name="projectNum" noCache />
                <Lov name="itemObj" noCache colSpan={2} />
                <Select name="itemType" />
                <Lov name="itemCategory" noCache />
                <Lov name="moNumObj" noCache colSpan={2} />
                <Select name="moStatues" />
                <Lov name="targetWarehouseObj" noCache />
                <div className={styles['senior-search']} colSpan={2}>
                  <Tooltip placement="top">
                    <a style={{ marginLeft: '15%' }} onClick={openModal}>
                      高级搜索
                    </a>
                  </Tooltip>
                </div>
                <Switch name="merge" onChange={() => {}} />
              </Form>
            </div>
          </div>
          <div className={styles['top-query-right']}>
            <Button onClick={handleToggle}>{!showFlag ? '更多' : '收起'}</Button>
            <Button
              color="primary"
              // disabled={isCreateLine}
              onClick={handleQuery}
              wait={1000}
              waitType="debounce"
            >
              查询
            </Button>
          </div>
        </div>
        <div className={styles['bottom-table']}>
          {buttons()}
          <PerformanceTable
            virtualized
            data={dataSource}
            columns={columns}
            rowHeight={38}
            height={tableHeight}
            // loading={showLoading}
          />
        </div>
      </Content>
    </div>
  );
}
