/**
 * @Description: Mo工序管理信息--头表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-09 10:23:01
 * @LastEditors: yu.na
 */

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { Table, Tabs, Lov, Form, Button, TextField, Select, DataSet } from 'choerodon-ui/pro';
import { Divider, Icon } from 'choerodon-ui';
import { isUndefined, isEmpty } from 'lodash';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';

// import { queryLovData } from 'hlos-front/lib/services/api';
import { HLOS_LMES } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { MoOperationListDS } from '@/stores/moOperationDS';
// import codeConfig from '@/common/codeConfig';

import LineList from './MoOperationLine';
import './index.less';

const organizationId = getCurrentOrganizationId();

// const { common } = codeConfig.code;
const { TabPane } = Tabs;

const preCode = 'lmes.moOperation';

const moOperation = ({ history, location }) => {
  const listDS = useMemo(() => new DataSet(MoOperationListDS()), []);
  const [showFlag, setShowFlag] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   *设置默认查询条件
   */
  useEffect(() => {
    async function paramSetting() {
      if (location) {
        const { search = {}, data = {} } = location;
        const params = search ? queryString.parse(search) : {};
        if (!listDS.queryDataSet.current) {
          listDS.queryDataSet.create({});
        }
        if (data.ownerOrganizationId) {
          listDS.queryDataSet.current.set('organizationObj', {
            organizationId: data.ownerOrganizationId,
            organizationCode: data.ownerOrganizationCode,
            organizationName: data.organizationName,
          });
        }
        if (params.moId) {
          listDS.queryDataSet.current.set('moNumObj', {
            moId: params.moId,
            moNum: params.moNum,
          });
          listDS.queryDataSet.current.set('item', data.item);
          listDS.queryDataSet.current.set('demandDate', data.demandDate);
          listDS.queryDataSet.current.set('demandQty', data.demandQty);
          listDS.queryDataSet.current.set('makeQty', data.makeQty);
          listDS.queryDataSet.current.set('moStatus', data.moStatus);
          listDS.queryDataSet.current.set('planStartDate', data.planStartDate);
          listDS.queryDataSet.current.set('planEndDate', data.planEndDate);
          listDS.queryDataSet.current.set('routingVersion', data.routingVersion);
          listDS.queryDataSet.current.set('moTypeName', data.moTypeName);
          handleSearch();
        }
      }
    }
    paramSetting();
  }, [listDS, location]);

  /**
   *tab数组
   * @returns
   */
  function tabsArr() {
    return [
      {
        code: 'resource',
        title: '资源',
        component: <LineList tableDS={listDS.children.resourceLineDS} tabType="resource" />,
      },
      {
        code: 'step',
        title: '步骤',
        component: <LineList tableDS={listDS.children.stepLineDS} tabType="step" />,
      },
      {
        code: 'component',
        title: '组件',
        component: <LineList tableDS={listDS.children.componentLineDS} tabType="component" />,
      },
    ];
  }

  /**
   *table列
   * @returns
   */
  function columns() {
    return [
      { name: 'sequenceNum', width: 150, lock: true },
      { name: 'operationCode', width: 150, lock: true },
      { name: 'operationName', width: 150, lock: true },
      { name: 'operationAlias', width: 150 },
      { name: 'description', width: 150 },
      { name: 'operationTypeMeaning', width: 150 },
      {
        name: 'keyOperationFlag',
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      { name: 'preSequenceNum', width: 150 },
      { name: 'operationGroup', width: 150 },
      { name: 'reworkOperation', width: 150 },
      { name: 'processTime', width: 150 },
      { name: 'standardWorkTime', width: 150 },
      { name: 'referenceDocument', width: 150 },
      { name: 'processProgram', width: 150 },
      { name: 'collector', width: 150 },
      { name: 'instruction', width: 150 },
      { name: 'downstreamOperation', width: 150 },
      { name: 'executeRule', width: 150 },
      { name: 'inspectionRule', width: 150 },
      { name: 'dispatchRule', width: 150 },
      { name: 'packingRule', width: 150 },
      { name: 'reworkRule', width: 150 },
      {
        name: 'releasedTaskFlag',
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      { name: 'remark', width: 150 },
      {
        name: 'enabledFlag',
        align: 'center',
        width: 100,
        renderer: yesOrNoRender,
      },
      { name: 'externalId', width: 150 },
      { name: 'externalNum', width: 150 },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => {
          return [
            <ButtonPermission
              type="c7n-pro"
              color="primary"
              funcType="flat"
              onClick={() =>
                handleToOtherPage(`/lmes/mo-operation/detail/${record.data.moOperationId}`)
              }
              permissionList={[
                {
                  code: 'hlos.lmes.mo.operation.ps.button.update',
                  type: 'button',
                  meaning: '更新',
                },
              ]}
            >
              {intl.get(`${preCode}.view.button.update`).d('更新')}
            </ButtonPermission>,
            <Button
              color="primary"
              funcType="flat"
              onClick={() => handleToOtherPage('/lmes/production-task')}
            >
              {intl.get(`${preCode}.view.button.task`).d('任务')}
            </Button>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  function handleToOtherPage(url) {
    history.push(url);
  }

  function handleRowChange() {
    return {
      onClick: () => {
        setShowLine(true);
      },
    };
  }

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov
        name="organizationObj"
        noCache
        onChange={(record, oldRecord) => handleOrgChange(record, oldRecord)}
        key="organizationObj"
      />,
      <Lov
        name="moNumObj"
        noCache
        onChange={(record, oldRecord) => handleMoChange(record, oldRecord)}
        key="moNumObj"
      />,
      <TextField name="item" disabled colSpan={2} key="item" />,
      <TextField name="demandDate" disabled key="demandDate" />,
      <TextField name="demandQty" disabled key="demandQty" />,
      <TextField name="makeQty" disabled key="makeQty" />,
      <Select name="moStatus" disabled key="moStatus" />,
      <TextField name="planStartDate" disabled key="planStartDate" />,
      <TextField name="planEndDate" disabled key="planEndDate" />,
      <TextField name="routingVersion" disabled key="routingVersion" />,
      <TextField name="moTypeName" disabled key="moTypeName" />,
    ];
  }

  function handleMoChange(record) {
    if (!isEmpty(record)) {
      listDS.queryDataSet.current.set('item', record.item);
      listDS.queryDataSet.current.set('demandDate', record.demandDate);
      listDS.queryDataSet.current.set('demandQty', record.demandQty);
      listDS.queryDataSet.current.set('makeQty', record.makeQty);
      listDS.queryDataSet.current.set('moStatus', record.moStatus);
      listDS.queryDataSet.current.set('planStartDate', record.planStartDate);
      listDS.queryDataSet.current.set('planEndDate', record.planEndDate);
      listDS.queryDataSet.current.set('routingVersion', record.routingVersion);
      listDS.queryDataSet.current.set('moTypeName', record.moTypeName);
    } else {
      listDS.queryDataSet.current.set('item', null);
      listDS.queryDataSet.current.set('demandDate', null);
      listDS.queryDataSet.current.set('demandQty', null);
      listDS.queryDataSet.current.set('makeQty', null);
      listDS.queryDataSet.current.set('moStatus', null);
      listDS.queryDataSet.current.set('planStartDate', null);
      listDS.queryDataSet.current.set('planEndDate', null);
      listDS.queryDataSet.current.set('routingVersion', null);
      listDS.queryDataSet.current.set('moTypeName', null);
    }
  }

  function handleOrgChange(record, oldRecord) {
    if (!oldRecord || (record && record.organizationId !== oldRecord.organizationId)) {
      listDS.queryDataSet.current.reset();
      listDS.queryDataSet.current.set('organizationObj', {
        organizationId: record.organizationId,
        organizationName: record.organizationName,
      });
    }
  }

  /**
   *导出字段
   * @returns
   */
  function getExportQueryParams() {
    const formObj = listDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toJSONData());
    return {
      ...fieldsValue,
    };
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const validateValue = await listDS.validate(false, false);
    if (!validateValue) {
      return;
    }

    await listDS.query();
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

  /**
   * 切换显示隐藏
   */
  function handleLineToggle() {
    setShowLine(!showLine);
  }

  /**
   * 分页变化
   */
  function handlePageChange(page) {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }

  /**
   *渲染表格查询条件
   * @returns
   */
  function renderBar(queryDataSet) {
    return (
      <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
        <Form dataSet={queryDataSet} columns={4} style={{ flex: 'auto' }}>
          {!showFlag ? queryFields().slice(0, 3) : queryFields()}
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
    );
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.moOperation`).d('MO工序')}>
        <ButtonPermission
          type="c7n-pro"
          icon="add"
          color="primary"
          onClick={() => handleToOtherPage('/lmes/mo-operation/create')}
          permissionList={[
            {
              code: 'hlos.lmes.mo.operation.ps.button.create',
              type: 'button',
              meaning: '新建',
            },
          ]}
        >
          {intl.get('hzero.common.button.create').d('新建')}
        </ButtonPermission>
        <ExcelExport
          requestUrl={`${HLOS_LMES}/v1/${organizationId}/mo-operations/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content className="lmes-moOperation-content">
        <Table
          dataSet={listDS}
          columns={columns()}
          border={false}
          columnResizable="true"
          editMode="inline"
          queryBar={({ queryDataSet }) => renderBar(queryDataSet)}
          onRow={(record) => handleRowChange(record)}
          pagination={{
            onChange: (page) => handlePageChange(page),
          }}
        />
        <Divider>
          <div>
            <span onClick={handleLineToggle} style={{ cursor: 'pointer' }}>
              {intl.get(`${preCode}.view.title.operationDetail`).d('工序明细')}
            </span>
            <Icon type={!showLine ? 'expand_more' : 'expand_less'} />
          </div>
        </Divider>
        <div style={!showLine ? { display: 'none' } : { display: 'block' }}>
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
        </div>
      </Content>
    </Fragment>
  );
};

export default connect()(withRouter(moOperation));
