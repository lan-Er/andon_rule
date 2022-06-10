/**
 * @Description: 工序外协平台--头table
 * @Author: leying.yan<leying.yan@hand-china.com>
 * @Date: 2021-01-20 10:15:47
 * @LastEditors: leying.yan
 */

import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  Lov,
  Form,
  Button,
  DatePicker,
  DateTimePicker,
  TextField,
  Select,
  Modal,
  Tabs,
} from 'choerodon-ui/pro';
import { isUndefined } from 'lodash';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import notification from 'utils/notification';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { queryLovData } from 'hlos-front/lib/services/api';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import Store from '@/stores/processOutsourcePlatformDS';
import codeConfig from '@/common/codeConfig';
import {
  submitOutsource,
  cancelOutsource,
  closeOutsource,
  deleteOutsource,
} from '@/services/outsourceService';
import TabComponent from './TabComponent';
import LineList from './LineList';
import './style.less';

const organizationId = getCurrentOrganizationId();

const { common } = codeConfig.code;

const preCode = 'lmes.processOutsourcePlatform';
const { TabPane } = Tabs;

export default () => {
  const { listDS, queryDS, history } = useContext(Store);
  const [showFlag, setShowFlag] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   *设置默认查询条件
   */
  useEffect(() => {
    queryDS.create({}, 0);
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });

      if (getResponse(res)) {
        if (res && res.content && res.content[0]) {
          queryDS.current.set('organizationObj', {
            organizationId: res.content[0].organizationId,
            organizationCode: res.content[0].organizationCode,
            organizationName: res.content[0].organizationName,
          });
        }
      }
    }
    defaultLovSetting();
  }, [queryDS]);

  /**
   *查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="outsourceObj" noCache key="outsourceObj" />,
      <Lov name="moNumObj" noCache key="moNumObj" />,
      <Lov name="partyObj" noCache key="partyObj" />,
      <Lov name="itemObj" noCache key="itemObj" />,
      <TextField name="operation" key="operation" />,
      <Lov name="taskObj" noCache key="taskObj" />,
      <Select name="outsourceStatus" key="outsourceStatus" />,
      <DatePicker name="demandDateLeft" key="demandDateLeft" />,
      <DatePicker name="demandDateRight" key="demandDateRight" />,
      <TextField name="projectNum" key="projectNum" />,
      <Lov name="outsourceTypeObj" noCache key="outsourceTypeObj" />,
      <DateTimePicker name="shippedDateLeft" key="shippedDateLeft" />,
      <DateTimePicker name="shippedDateRight" key="shippedDateRight" />,
      <DateTimePicker name="actualArrivalTimeLeft" key="actualArrivalTimeLeft" />,
      <DateTimePicker name="actualArrivalTimeRight" key="actualArrivalTimeRight" />,
    ];
  }

  /**
   *外协头tab数组
   * @returns
   */
  function tabsArr() {
    return [
      {
        code: 'main',
        title: '主要',
        component: (
          <TabComponent
            tableDS={listDS}
            tabType="main"
            onToDetailPage={handleToDetailPage}
            onPageChange={handlePageChange}
            setShowLine={setShowLine}
          />
        ),
      },
      {
        code: 'execute',
        title: '执行',
        component: (
          <TabComponent
            tableDS={listDS}
            tabType="execute"
            onToDetailPage={handleToDetailPage}
            onPageChange={handlePageChange}
            setShowLine={setShowLine}
          />
        ),
      },
    ];
  }
  /**
   *外协行tab数组
   * @returns
   */
  function lineTabsArr() {
    return [
      {
        code: 'main',
        title: '主要',
        component: <LineList tableDS={listDS.children.mainLine} tabType="main" />,
      },
      {
        code: 'execute',
        title: '执行',
        component: <LineList tableDS={listDS.children.executeLine} tabType="execute" />,
      },
    ];
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = queryDS.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const validateValue = await queryDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    setShowLine(false);
    listDS.queryParameter = queryDS.current.toJSONData();
    await listDS.query();
  }

  /**
   * 重置
   */
  function handleReset() {
    queryDS.current.reset();
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   *跳转到明细页面
   * @param {*} url
   */
  function handleToDetailPage(url, params = {}) {
    history.push({
      pathname: url,
      state: params,
    });
  }

  /**
   *提交
   */
  async function handleSubmit() {
    const ids = listDS.selected.map((item) => item.data.outsourceId);
    if (!listDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (listDS.selected.every((item) => item.data.outsourceStatus === 'NEW')) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.submitTask`).d('是否提交外协单？')}</p>,
        onOk: () =>
          submitOutsource({ outsourceIds: ids }).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              await listDS.query();
            }
          }),
      });
    } else {
      notification.error({
        message: intl.get(`${preCode}.view.message.submitLimit`).d('新增状态的外协单才允许提交！'),
      });
    }
  }

  /**
   *删除
   */
  async function handleDelete() {
    const ids = listDS.selected.map((item) => item.data.outsourceId);
    if (!listDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (listDS.selected.every((item) => item.data.outsourceStatus === 'NEW')) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.deleteTask`).d('是否删除外协单？')}</p>,
        onOk: () =>
          deleteOutsource({ outsourceIds: ids }).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              await listDS.query();
            }
          }),
      });
    } else {
      notification.error({
        message: intl.get(`${preCode}.view.message.deleteLimit`).d('新增状态的外协单才允许删除！'),
      });
    }
  }

  /**
   *取消
   */
  function handleCancel() {
    const ids = listDS.selected.map((item) => item.data.outsourceId);
    if (!listDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      listDS.selected.every(
        (item) => item.data.outsourceStatus === 'RELEASED' || item.data.outsourceStatus === 'NEW'
      )
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.cancelTask`).d('是否取消外协单？')}</p>,
        onOk: () =>
          cancelOutsource({ outsourceIds: ids }).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              await listDS.query();
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.cancelLimit`)
          .d('新增、已提交状态的外协单才允许取消！'),
      });
    }
  }

  /**
   *关闭
   */
  function handleClose() {
    const ids = listDS.selected.map((item) => item.data.outsourceId);
    if (!listDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      listDS.selected.every(
        (item) =>
          item.data.outsourceStatus !== 'NEW' &&
          item.data.outsourceStatus !== 'CANCELLED' &&
          item.data.outsourceStatus !== 'CLOSED'
      )
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.closeTask`).d('是否关闭外协单？')}</p>,
        onOk: () =>
          closeOutsource({ outsourceIds: ids }).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              await listDS.query();
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.closeLimit`)
          .d('新建、已取消、已关闭状态的外协单不允许关闭！'),
      });
    }
  }

  /**
   * 分页变化
   */
  function handlePageChange(page) {
    if (page !== currentPage) {
      setCurrentPage(page);
      setShowLine(false);
    }
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.outsourcePlatform`).d('工序外协平台')}>
        <Button
          icon="add"
          color="primary"
          onClick={() => handleToDetailPage('/lmes/process-outsource-platform/create')}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
        <ExcelExport
          requestUrl={`${HLOS_LMES}/v1/${organizationId}/tasks/produce/excel`}
          queryParams={getExportQueryParams}
        />
        <Button onClick={handleSubmit}>{intl.get('hzero.common.button.submit').d('提交')}</Button>
        <Button onClick={handleDelete}>{intl.get('lmes.common.button.delete').d('删除')}</Button>
        <Button onClick={handleCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button onClick={handleClose}>{intl.get('lmes.common.button.close').d('关闭')}</Button>
      </Header>
      <Content className="lmes-production-task-content">
        <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
          <Form dataSet={queryDS} columns={4} style={{ flex: 'auto' }}>
            {!showFlag ? queryFields().slice(0, 4) : queryFields()}
          </Form>
          <div style={{ marginLeft: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Button onClick={handleToggle}>
              {!showFlag
                ? intl.get('hzero.common.button.viewMore').d('更多查询')
                : intl.get('hzero.common.button.collected').d('收起查询')}
            </Button>
            <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
            <Button color="primary" onClick={() => handleSearch()}>
              {intl.get('hzero.common.button.search').d('查询')}
            </Button>
          </div>
        </div>
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
        {showLine && (
          <Tabs defaultActiveKey="main">
            {lineTabsArr().map((tab) => (
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
    </Fragment>
  );
};
