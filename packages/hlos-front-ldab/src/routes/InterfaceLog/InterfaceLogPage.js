/*
 * @Description: 平台接口详情页面
 * @Author: jianjun.tan, <jianjun.tan@hand-china.com>
 * @Date: 2020-06-09 15:58:31
 * @LastEditors: jianjun.tan
 * @LastEditTime: 2020-06-09 16:12:01
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { DataSet, Table } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import { deleteInterfaceLogs } from '@/services/api';
import { interfaceLogDS, clearLogsDS } from '@/stores/interfaceLogDS';
import ClearLogsModel from './ClearLogsModel';

const preCode = 'ldab.interfaceLog';

const InterfaceLogPage = () => {
  const listDS = useMemo(() => new DataSet(interfaceLogDS()), []);
  const clearDS = useDataSet(() => new DataSet(clearLogsDS()));
  const [clearLogsVisible, setClearLogsVisible] = useState(false);
  const [clearLogsList, setClearLogsList] = useState([]);
  const [selectValue, setSelectValue] = useState(null);

  useEffect(() => {
    function queryModalData() {
      clearDS.query().then((res) => {
        if (res && !res.failed) {
          setClearLogsList(res.clearTypeList);
        }
      });
    }
    queryModalData();
  }, [clearDS]);

  function getInterfaceLogColumns() {
    return [
      {
        name: 'interfaceCode',
        width: 150,
        editor: false,
      },
      {
        name: 'interfaceUrl',
        width: 180,
        editor: false,
      },
      {
        name: 'creationDate',
        width: 150,
        editor: false,
      },
      {
        name: 'interfaceMessage',
        width: 350,
        editor: false,
      },
    ];
  }

  /**
   * 日志清理
   * @param {object} fieldsValue - 请求参数
   */
  function handleClearLogs() {
    deleteInterfaceLogs({ clearType: selectValue }).then((res) => {
      if (res && !res.failed) {
        notification.success();
        handleClearLogsDrawer(false);
        handleChange(null);
        listDS.query();
      } else {
        notification.error();
      }
    });
  }

  function handleChange(value) {
    setSelectValue(value);
  }

  /**
   *是否打开清除日志模态框
   *
   * @param {boolean} flag
   */
  function handleClearLogsDrawer(flag) {
    setClearLogsVisible(flag);
  }

  const clearProps = {
    title: intl.get(`${preCode}.view.button.clearLogs`).d('日志清理'),
    visible: clearLogsVisible,
    datas: clearLogsList,
    onCancel: () => handleClearLogsDrawer(false),
    onOk: handleClearLogs,
    onChange: handleChange,
  };

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.message.title`).d('接口日志监控')}>
        <ButtonPermission
          icon="delete"
          type="c7n-pro"
          color="primary"
          onClick={() => handleClearLogsDrawer(true)}
          permissionList={[
            {
              code: `${preCode}.button.clearLogs`,
              type: 'button',
              meaning: '接口监控-日志清理',
            },
          ]}
        >
          {intl.get(`${preCode}.view.button.clearLogs`).d('日志清理')}
        </ButtonPermission>
      </Header>
      <Content>
        <Table
          key="interfaceLogId"
          dataSet={listDS}
          selectionMode="click"
          columns={getInterfaceLogColumns()}
        />
      </Content>
      {clearLogsVisible && <ClearLogsModel {...clearProps} />}
    </Fragment>
  );
};

export default InterfaceLogPage;
