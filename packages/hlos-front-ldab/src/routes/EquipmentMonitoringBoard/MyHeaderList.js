/*
 * @module: 设备监控看板头部组件
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-01-18 15:24:04
 * @LastEditTime: 2021-03-02 14:32:50
 * @copyright: Copyright (c) 2020,Hand
 */
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { Modal, DataSet, Form, Lov, SelectBox, TextField } from 'choerodon-ui/pro';

import Icons from 'components/Icons';
import codeConfig from '@/common/codeConfig';
import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { queryLovData } from 'hlos-front/lib/services/api';

import style from './index.module.less';
import TopBanner from './component/TopBanner';
import MyMaruqee from './component/MyMarquee';
import formDs from '@/stores/equipmentMonitoringBoardDs';

let debounceTimer = null;
const modalKey = Modal.key();
const { Option } = SelectBox;
const { common } = codeConfig.code;
function MyHeaderList({ equipmentMonitoringModel: { quryParams, isQuery }, dispatch }) {
  const queryDs = useDataSet(() => new DataSet(formDs()), MyHeaderList);
  const [headerList, setHeaderList] = useState({
    running: 0,
    standby: 0,
    colsed: 0,
    maintaince: 0,
    breakdown: 0,
  });
  const myQueryparams = useMemo(() => {
    return quryParams;
  }, [quryParams]);
  const updateQuery = useMemo(() => isQuery, [isQuery]);
  useEffect(() => {
    getDefaultData();
    window.addEventListener('resize', handleChangeWindow);
    return () => {
      clearInterval(debounceTimer);
      window.removeEventListener('resize', handleChangeWindow);
    };
  }, []);

  useEffect(() => {
    if (updateQuery) {
      const params = { ...myQueryparams };
      handleQuery(params);
      dispatch({
        type: 'equipmentMonitoringModel/getDetailsList',
        payload: false,
      });
    }
  }, [updateQuery]);

  /**
   * @description: 防抖
   * @param {*} debounce
   * @return {*}
   */
  const debounce = (fn, wait = 300) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fn();
    }, wait);
  };

  function handleUpdate() {
    dispatch({
      type: 'equipmentMonitoringModel/getDetailsList',
      payload: true,
    });
  }

  function handleChangeWindow() {
    debounce(handleUpdate);
  }
  /**
   * @description: 进入页面初始化
   * @param {*}
   * @return {*}
   */
  async function getDefaultData() {
    const organization = await queryLovData({
      defaultFlag: 'Y',
      lovCode: common.singleMeOu,
    });
    const meArea = await queryLovData({
      defaultFlag: 'Y',
      lovCode: common.meArea,
    });
    if (meArea && meArea.content[0] && organization && organization.content[0]) {
      const params = {
        ...meArea.content[0],
        ...organization.content[0],
        organizationId: organization && organization.content[0].meOuId,
        organizationName: organization.content[0].meOuName,
      };
      queryDs.current.set('organizationObj', {
        ...organization.content[0],
        organizationName: organization.content[0].meOuName,
        organizationId: organization.content[0].meOuId,
      });
      queryDs.current.set('meAreaObjs', meArea.content[0]);
      handleQuery(params);
    }
  }

  /**
   * @description: 查询
   * @param {*} params
   * @return {*}
   */
  function handleQuery(params) {
    if (!params.organizationId) {
      notification.warning({ message: '默认组织不存在，请维护后刷新重试' });
      return;
    }
    dispatch({
      type: 'equipmentMonitoringModel/updateQueryParams',
      payload: params,
    });
    dispatch({
      type: 'equipmentMonitoringModel/getEquipmentmonitoringList',
      payload: params,
    }).then((res) => {
      if (res && res.countStatusDtoList) {
        const { countStatusDtoList } = res;
        const newHeader = { running: 0, standby: 0, colsed: 0, maintaince: 0, breakdown: 0 };
        countStatusDtoList.forEach((item) => {
          if (item.equipmentStatus && item.equipmentStatus.toLowerCase()) {
            newHeader[item.equipmentStatus.toLowerCase()] = item.amount;
          }
        });
        setHeaderList({ ...newHeader });
      }
    });
  }
  /**
   * @description: 点击确定
   * @param {*}
   * @return {*}
   */
  async function handleClickOk() {
    const validateResult = await queryDs.current.validate(false, false);
    if (!validateResult) {
      return false;
    }
    const queryList = queryDs.toData();
    const params = queryList[0];
    handleQuery({ ...params, equipmentStatus: params.equipmentStatus.toString() });
  }

  /**
   * @description: 设置弹出框
   * @param {*}
   * @return {*}
   */
  function handleSetQuery() {
    Modal.open({
      key: modalKey,
      title: '设置',
      closable: true,
      width: '100%',
      children: (
        <Form dataSet={queryDs} labelWidth={60}>
          <Lov name="organizationObj" />
          <Lov name="meAreaObjs" />
          <SelectBox name="equipmentStatus">
            <Option value="running">运行</Option>
            <Option value="standby">闲置</Option>
            <Option value="colsed">关机</Option>
            <Option value="maintaince">维修</Option>
            <Option value="breakdown">故障</Option>
          </SelectBox>
          <TextField name="minutes" suffix={<span style={{ color: '#000' }}>min</span>} />
        </Form>
      ),
      okText: '确定',
      onOk: handleClickOk,
      className: style['my-set-list-equipment-monitoring'],
    });
  }
  return (
    <div className={style['equipmnet-minitoring-header']}>
      <section>
        <div>
          <TopBanner>
            <span>运行</span>
            <span>{headerList && headerList.running}</span>
          </TopBanner>
        </div>
        <div>
          <TopBanner leftColor="#05A791" bgColor="rgba(255,255,255,0)">
            <span>闲置</span>
            <span>{headerList && headerList.standby}</span>
          </TopBanner>
        </div>
        <div>
          <TopBanner leftColor="#F4C648" bgColor="rgba(255,255,255,0)">
            <span>维修</span>
            <span>{headerList && headerList.maintaince}</span>
          </TopBanner>
        </div>
        <div>
          <TopBanner leftColor="#D65246" bgColor="rgba(255,255,255,0)">
            <span>故障</span>
            <span>{headerList && headerList.breakdown}</span>
          </TopBanner>
        </div>
        <div>
          <TopBanner leftColor="#0288D1" bgColor="rgba(255,255,255,0)">
            <span>关机</span>
            <span>{headerList && headerList.colsed}</span>
          </TopBanner>
        </div>
        <div>
          <TopBanner
            leftColor="#666"
            bgColor="rgba(255,255,255,0)"
            myWidth="40px"
            leftWidth="1px"
            myJustify="center"
          >
            <span style={{ cursor: 'pointer' }} title="点击设置" onClick={handleSetQuery}>
              <Icons type="ziyuan67" size="20" />
            </span>
          </TopBanner>
        </div>
      </section>
      <section>
        <div>
          <Icons type="Frame" size="20" color="#41F9B7" />
        </div>
        <div>
          <MyMaruqee>
            <span>
              {myQueryparams.organizationName ? myQueryparams.organizationName : '默认组织'}-
              {myQueryparams.meAreaName ? myQueryparams.meAreaName : '默认车间'}
            </span>
          </MyMaruqee>
        </div>
      </section>
    </div>
  );
}
export default connect(({ equipmentMonitoringModel }) => ({ equipmentMonitoringModel }))(
  withRouter(MyHeaderList)
);
