/*
 * @Description: 领料单新建
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2020-08-21 10:14:13
 * @LastEditors: Please set LastEditors
 */
import React, { Fragment, useState, useEffect } from 'react';
import { routerRedux } from 'dva/router';
import { isEmpty } from 'lodash';
import {
  Lov,
  Form,
  Select,
  TextField,
  Button,
  Tabs,
  DateTimePicker,
  DataSet,
} from 'choerodon-ui/pro';
import { Divider, Card, Icon, Tooltip } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { issueRequestDetailDS } from '@/stores/issueRequestDS';
import { queryLovData } from 'hlos-front/lib/services/api';
import { queryDocumentType } from '@/services/api';
import { cancelApi, closeApi } from '@/services/issueRequestService';
import codeConfig from '@/common/codeConfig';

import { MainLineTable, ExecLineTable } from './issueRequestLineTable';

const intlPrefix = 'lwms.issueRequestPlatform';
const commonPrefix = 'lwms.common';
const { common } = codeConfig.code;
const { TabPane } = Tabs;

const detailDS = new DataSet(issueRequestDetailDS());

function IssueRequestDetail(props) {
  const [showFlag, changeShowFlag] = useState(false);
  const [docProcessRule, setDocProcessRule] = useState('');
  const [isDSDirty, setDSDirty] = useState(false);
  const [showFormType, setShowFormType] = useState('COMMON_REQUEST');
  const [applyQtyDisabled, setApplyQtyDisabled] = useState(false);

  const createFlag = () => {
    const { requestId } = props.match.params;
    return !requestId;
  };

  useEffect(() => {
    async function requestDetail(id, myOrg) {
      detailDS.queryParameter = {
        requestId: id,
        organizationId: myOrg,
      };
      const res = await detailDS.query();
      if (res && !res.failed && res.content && res.content[0]) {
        setDocProcessRule(res.content[0].docProcessRule);
        setShowFormType(res.content[0].requestTypeCode);
        if (res.content[0].requestStatus === 'NEW' || res.content[0].requestStatus === 'RELEASED') {
          setApplyQtyDisabled(false);
        } else {
          setApplyQtyDisabled(true);
        }
      }
    }
    async function queryDefaultData() {
      const workerRes = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (workerRes && !workerRes.failed && workerRes.content && workerRes.content[0]) {
        if (detailDS.current) {
          detailDS.current.set('creatorObj', workerRes.content[0]);
        } else {
          detailDS.create(
            {
              creatorObj: workerRes.content[0],
            },
            0
          );
        }
      }

      const typeRes = await queryDocumentType({
        documentClass: 'WM_REQUEST',
        documentTypeCode: 'COMMON_REQUEST',
      });
      if (typeRes && !typeRes.failed && typeRes.content && typeRes.content[0]) {
        if (detailDS.current) {
          detailDS.current.set('requestTypeObj', typeRes.content[0]);
        } else {
          detailDS.create(
            {
              requestTypeObj: typeRes.content[0],
            },
            0
          );
        }
      }
    }
    const { requestId, org } = props.match.params;
    if (requestId && org) {
      requestDetail(requestId, org);
    } else {
      queryDefaultData();
    }

    detailDS.addEventListener('update', () => {
      setDSDirty(true);
    });

    detailDS.children.requestLineList.addEventListener('update', () => {
      setDSDirty(true);
    });

    return () => {
      detailDS.removeEventListener('update');
      detailDS.children.requestLineList.removeEventListener('update');
    };
  }, [props.match.params]);

  /**
   * 跳转详情页面
   * @param record
   */
  const handleCreate = () => {
    const { dispatch } = props;
    detailDS.remove(detailDS.current);
    dispatch(
      routerRedux.push({
        pathname: '/lwms/issue-request-platform/create',
      })
    );
  };

  /**
   * 请求数据 刷新页面
   */
  async function refreshPage() {
    const { requestId } = props.match.params;
    detailDS.queryParameter = { requestId };
    await detailDS.query();
  }

  const handleSave = async () => {
    const { dispatch } = props;
    const validateValue = await detailDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    if (!detailDS.children.requestLineList.selected.length) {
      notification.warning({
        message: '未选中领料单行',
      });
      return;
    }
    const res = await detailDS.submit(false, false);
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else if (res === undefined) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }

    if (!createFlag()) {
      refreshPage();
    } else if (res && res.content && res.content[0]) {
      const pathname = `/lwms/issue-request-platform/detail/${res.content[0].requestId}`;
      dispatch(
        routerRedux.push({
          pathname,
        })
      );
    }
  };

  const handleClose = async () => {
    const res = await closeApi([detailDS.current.data.requestId]);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
    }
  };

  const handleCancel = async () => {
    const res = await cancelApi([detailDS.current.data.requestId]);
    if (res && res.failed) {
      notification.error({
        message: res.message,
      });
    } else if (res && !res.failed) {
      notification.success();
    }
  };

  // render buttons
  const renderFunctionButtons = () => (
    <Fragment>
      <Button onClick={handleSave}>{intl.get('hzero.common.btn.save').d('保存')}</Button>
      <Button onClick={handleClose} disabled={createFlag()}>
        {intl.get('hzero.common.button.close').d('关闭')}
      </Button>
      <Button onClick={handleCancel} disabled={createFlag()}>
        {intl.get('hzero.common.button.cancel').d('取消')}
      </Button>
      <Button onClick={handleCreate} disabled={createFlag()}>
        {intl.get('hzero.common.button.add').d('新增')}
      </Button>
    </Fragment>
  );

  // tab数组
  function tabsArr() {
    return [
      {
        code: 'main',
        title: '主要',
        component: (
          <MainLineTable
            dataSet={detailDS.children.requestLineList}
            applyQtyDisabled={applyQtyDisabled}
          />
        ),
      },
      {
        code: 'exec',
        title: '执行',
        component: <ExecLineTable dataSet={detailDS.children.requestLineList} />,
      },
    ];
  }

  function handleMoveTypeChange(record) {
    detailDS.children.requestLineList.forEach((item) => {
      item.set('wmMoveTypeObj', record);
    });
    if (!isEmpty(record)) {
      detailDS.children.requestLineList.getField('wmMoveTypeObj').set('disabled', true);
      detailDS.children.requestLineList.getField('wmMoveTypeObj').set('required', false);
    } else {
      detailDS.children.requestLineList.getField('wmMoveTypeObj').set('disabled', false);
      detailDS.children.requestLineList.getField('wmMoveTypeObj').set('required', true);
    }
  }

  function handleToWarehouseChange(record) {
    detailDS.children.requestLineList.forEach((item) => {
      item.set('toWarehouseObj', record);
    });
    if (!isEmpty(record)) {
      detailDS.children.requestLineList.getField('toWarehouseObj').set('disabled', true);
    } else {
      detailDS.children.requestLineList.getField('toWarehouseObj').set('disabled', false);
    }
  }

  function handleToWmAreaChange(record) {
    detailDS.children.requestLineList.forEach((item) => {
      item.set('toWmAreaObj', record);
    });
    if (!isEmpty(record)) {
      detailDS.children.requestLineList.getField('toWmAreaObj').set('disabled', true);
      detailDS.children.requestLineList.getField('toWmAreaObj').set('required', false);
    } else {
      detailDS.children.requestLineList.getField('toWmAreaObj').set('disabled', false);
      detailDS.children.requestLineList.getField('toWmAreaObj').set('required', true);
    }
  }

  function handleWarehouseChange(record) {
    detailDS.children.requestLineList.forEach((item) => {
      item.set('warehouseObj', record);
    });
    if (!isEmpty(record)) {
      detailDS.children.requestLineList.getField('warehouseObj').set('disabled', true);
      detailDS.children.requestLineList.getField('warehouseObj').set('required', false);
    } else {
      detailDS.children.requestLineList.getField('warehouseObj').set('disabled', false);
      detailDS.children.requestLineList.getField('warehouseObj').set('required', true);
    }
  }

  function handleWmAreaChange(record) {
    detailDS.children.requestLineList.forEach((item) => {
      item.set('wmAreaObj', record);
    });
    if (!isEmpty(record)) {
      detailDS.children.requestLineList.getField('wmAreaObj').set('disabled', true);
      detailDS.children.requestLineList.getField('wmAreaObj').set('required', false);
    } else {
      detailDS.children.requestLineList.getField('wmAreaObj').set('disabled', false);
      detailDS.children.requestLineList.getField('wmAreaObj').set('required', true);
    }
  }

  function handleWorkcellChange(record) {
    detailDS.children.requestLineList.forEach((item) => {
      item.set('workcellObj', record);
      item.set('toWorkcellObj', record);
    });
  }

  function handleLocationChange(record) {
    detailDS.children.requestLineList.forEach((item) => {
      item.set('locationObj', record);
      item.set('toLocationObj', record);
    });
  }

  // function handleTypeChange(record) {
  //   if (!isEmpty(record)) {
  //     setShowFormType(record.documentTypeCode);
  //   } else {
  //     setShowFormType('');
  //   }
  // }

  function handleMoChange(record) {
    if (!isEmpty(record)) {
      detailDS.current.set('prodLineObj', {
        prodLineId: record.prodLineId,
        prodLineCode: record.prodLineCode,
        prodLineName: record.prodLineName,
      });
      detailDS.current.set('workcellObj', {
        workcellId: record.workcellId,
        workcellCode: record.workcellCode,
        workcellName: record.workcellName,
      });
      detailDS.current.set('locationObj', {
        locationId: record.locationId,
        locationCode: record.locationCode,
        locationName: record.locationName,
      });
    }
  }

  const handleToggle = () => {
    changeShowFlag(!showFlag);
  };

  const handleBack = () => {
    detailDS.remove(detailDS.current);
  };

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.issueRequestPlatform`).d('领料单平台')}
        backPath="/lwms/issue-request-platform/list"
        isChange={isDSDirty}
        onBack={handleBack}
      >
        {renderFunctionButtons()}
      </Header>
      <Content className="lwms-issue-request-content">
        <Card
          key="lwms-issue-request-detail-header"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
        >
          <Fragment key="issue-request-platform-form">
            <Form dataSet={detailDS} columns={4}>
              <Lov name="organizationObj" noCache disabled={!createFlag()} />
              <TextField name="requestNum" disabled={!createFlag()} />
              <Lov name="assemblyItemObj" noCache disabled={!createFlag()} />
              <Lov
                name="wmMoveTypeObj"
                noCache
                onChange={handleMoveTypeChange}
                disabled={!createFlag()}
              />
              <Select name="requestStatus" disabled={!createFlag()} />
              <DateTimePicker name="planDemandDate" disabled={!createFlag()} />
              <Lov name="moNumObj" noCache onChange={handleMoChange} disabled={!createFlag()} />
              <Lov name="prodLineObj" noCache disabled={!createFlag()} />
              <Lov
                name="workcellObj"
                noCache
                onChange={handleWorkcellChange}
                disabled={!createFlag()}
              />
              <Lov
                name="locationObj"
                noCache
                onChange={handleLocationChange}
                disabled={!createFlag()}
              />
              <Lov name="creatorObj" disabled={!createFlag()} />
              <Lov name="toEnterpriseObj" disabled={!createFlag()} />
            </Form>
            <Divider>
              <div>
                <span onClick={handleToggle} style={{ cursor: 'pointer' }}>
                  {!showFlag
                    ? `${intl.get('hzero.common.button.expand').d('展开')}`
                    : `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`}
                </span>
                <Icon type={!showFlag ? 'expand_more' : 'expand_less'} />
              </div>
            </Divider>
            <div style={!showFlag ? { display: 'none' } : { display: 'block' }}>
              <Form dataSet={detailDS} columns={4}>
                <Lov name="toOrganizationObj" disabled={!createFlag()} />
                <Lov
                  name="toWarehouseObj"
                  onChange={handleToWarehouseChange}
                  disabled={!createFlag()}
                />
                <Lov name="toWmAreaObj" onChange={handleToWmAreaChange} disabled={!createFlag()} />
                <Lov name="sourceDocTypeObj" disabled={!createFlag()} />
                <Lov name="sourceDocNumObj" disabled={!createFlag()} />
                <Lov name="sourceDocLineNumObj" disabled={!createFlag()} />
                <Lov name="enterpriseObj" disabled={!createFlag()} />
                <Lov
                  name="warehouseObj"
                  onChange={handleWarehouseChange}
                  disabled={!createFlag()}
                />
                <Lov name="wmAreaObj" onChange={handleWmAreaChange} disabled={!createFlag()} />
                <Lov name="requestDepartmentObj" disabled={!createFlag()} />
                <TextField name="remark" disabled={!createFlag()} />
                <TextField name="requestReason" disabled={!createFlag()} />
              </Form>
              <div
                style={{
                  display: 'inline-block',
                  width: '25%',
                  lineHeight: '50px',
                }}
              >
                <Tooltip placement="top" title={docProcessRule}>
                  <a style={{ marginLeft: '15%' }}>
                    {intl.get(`${intlPrefix}.model.docProcessRule`).d('单据处理规则')}
                  </a>
                </Tooltip>
              </div>
            </div>
          </Fragment>
        </Card>
        {showFormType === 'COMMON_REQUEST' && (
          <Card
            key="lwms-issue-request-detail-line"
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <Tabs defaultActiveKey="main" animated={{ inkBar: true, tabPane: false }}>
              {tabsArr().map((tab) => (
                <TabPane
                  tab={intl.get(`${intlPrefix}.view.title.${tab.code}`).d(tab.title)}
                  key={tab.code}
                >
                  {tab.component}
                </TabPane>
              ))}
            </Tabs>
          </Card>
        )}
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})(IssueRequestDetail);
