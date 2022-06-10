/**
 * @Description: 生产任务详情--头Form
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-04-20 09:58:47
 * @LastEditors: yu.na
 */

import React, { Fragment, useState, useEffect, useMemo } from 'react';
import {
  Lov,
  Form,
  Select,
  TextField,
  NumberField,
  Button,
  Tabs,
  CheckBox,
  DatePicker,
  DateTimePicker,
  Modal,
  DataSet,
} from 'choerodon-ui/pro';
import { Divider, Card, Icon, Tooltip } from 'choerodon-ui';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';
import { ProductionTaskDetailDS } from '@/stores/productionTaskDS';
import { holdTask, cancelTask } from '@/services/taskService';
import TabComponent from './TabComponent';
import './style.less';

const preCode = 'lmes.productionTask';
const tpmCode = 'lmes.tpmTask';
const { TabPane } = Tabs;

export default ({ match }) => {
  const detailDS = useMemo(() => new DataSet(ProductionTaskDetailDS()), []);
  const [showFlag, changeShowFlag] = useState(false);
  const [docProcessRule, setDocProcessRule] = useState('');
  const [dispatchRuleJson, setDispatchRuleJson] = useState(null);
  const [executeRuleJson, setExecuteRuleJson] = useState(null);
  const [inspectionRuleJson, setInspectionRuleJson] = useState(null);
  const [packingRuleJson, setPackingRuleJson] = useState(null);
  const [reworkRuleJson, setReworkRuleJson] = useState(null);

  useEffect(() => {
    const { taskId } = match.params;
    async function requstDetail() {
      detailDS.queryParameter = {
        taskId,
      };
      const res = await detailDS.query();
      if (res && res.failed) {
        notification.error({
          message: res.message,
        });
      } else if (res && !res.failed) {
        if (res.content && res.content[0]) {
          setDocProcessRule(res.content[0].docProcessRule);
          setDispatchRuleJson(res.content[0].dispatchRule);
          setExecuteRuleJson(res.content[0].executeRule);
          setInspectionRuleJson(res.content[0].inspectionRule);
          setPackingRuleJson(res.content[0].packingRule);
          setReworkRuleJson(res.content[0].reworkRule);
        }
      }
    }
    requstDetail();
  }, []);

  /**
   *tab数组
   * @returns
   */
  function tabsArr() {
    return [
      {
        code: 'item',
        title: '物料',
        component: <TabComponent detailDS={detailDS} tabType="item" />,
      },
    ];
  }

  function handleToggle() {
    changeShowFlag(!showFlag);
  }

  /**
   *暂挂
   */
  async function handlePending() {
    if (
      detailDS.current.data.taskStatus !== 'NEW' &&
      detailDS.current.data.taskStatus !== 'DISPATCHED' &&
      detailDS.current.data.taskStatus !== 'RELEASED' &&
      detailDS.current.data.taskStatus !== 'QUEUING' &&
      detailDS.current.data.taskStatus !== 'RUNNING' &&
      detailDS.current.data.taskStatus !== 'PAUSE'
    ) {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.pendingLimit`)
          .d('只有新增、已下达、已分派、排队中、运行中、暂停状态的任务才允许暂挂！'),
      });
      return;
    }
    Modal.confirm({
      children: <p>{intl.get(`${tpmCode}.view.message.pendingTask`).d('是否暂挂任务？')}</p>,
      onOk: () =>
        holdTask([detailDS.current.data]).then(async (res) => {
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            await detailDS.query().then(() => {
              sessionStorage.setItem('productionTaskRefresh', true);
            });
          }
        }),
    });
  }

  /**
   *取消
   */
  function handleCancel() {
    if (
      detailDS.current.data.taskStatus !== 'CANCELLED' &&
      detailDS.current.data.taskStatus !== 'CLOSED' &&
      detailDS.current.data.taskStatus !== 'COMPLETED'
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${tpmCode}.view.message.cancelTask`).d('是否取消任务？')}</p>,
        onOk: () =>
          cancelTask([detailDS.current.data]).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              await detailDS.query().then(() => {
                sessionStorage.setItem('productionTaskRefresh', true);
              });
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.cancelLimit`)
          .d('已完成、已取消、已关闭状态的任务不允许取消！'),
      });
    }
  }

  return (
    <Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.productionTask`).d('生产任务')}
        backPath="/lmes/neway/production-task/list"
      >
        <Button onClick={handleCancel}>{intl.get('hzero.common.button.cancel').d('取消')}</Button>
        <Button onClick={handlePending}>{intl.get('lmes.common.button.pending').d('暂挂')}</Button>
      </Header>
      <Content className="neway-production-task-detail-content">
        <Card
          key="production-task-detail-header"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
        >
          <Form dataSet={detailDS} columns={4}>
            <Lov name="orgObj" disabled />
            <Lov name="taskTypeObj" disabled />
            <Lov name="operationObj" disabled />
            <TextField name="description" disabled />
            <TextField name="taskNum" disabled />
            <Lov name="sourceDocTypeObj" disabled />
            <Lov name="sourceDocObj" disabled />
            <Lov name="sourceDocLineObj" disabled />
            <Lov name="downstreamOperationObj" disabled />
            <Lov name="reworkOperationObj" disabled />
            <CheckBox name="firstOperationFlag" disabled />
            <CheckBox name="lastOperationFlag" disabled />
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
              <Select name="taskStatus" disabled />
              <Lov name="sourceTaskObj" disabled />
              <Lov name="relatedTaskObj" disabled />
              <TextField name="taskGroup" disabled />
              <Lov name="prodLineObj" disabled />
              <Lov name="workcellObj" disabled />
              <Lov name="equipmentObj" disabled />
              <Lov name="workerObj" disabled />
              <Lov name="workerGroupObj" disabled />
              <Lov name="resourceObj" disabled />
              <DatePicker name="calendarDay" disabled />
              <Select name="calendarShiftCode" disabled />
              <NumberField name="standardWorkTime" disabled />
              <DateTimePicker name="planStartTime" disabled />
              <DateTimePicker name="planEndTime" disabled />
              <NumberField name="planProcessTime" disabled />
              <div name="executeRuleObj" key="executeRuleObj">
                <Lov name="executeRuleObj" disabled />
                <Tooltip placement="top" title={executeRuleJson}>
                  <Icon type="contact_support-o" />
                </Tooltip>
              </div>
              <div name="inspectionRuleObj" key="inspectionRuleObj">
                <Lov name="inspectionRuleObj" disabled />
                <Tooltip placement="top" title={inspectionRuleJson}>
                  <Icon type="contact_support-o" />
                </Tooltip>
              </div>
              <div name="dispatchRuleObj" key="dispatchRuleObj">
                <Lov name="dispatchRuleObj" disabled />
                <Tooltip placement="top" title={dispatchRuleJson}>
                  <Icon type="contact_support-o" />
                </Tooltip>
              </div>
              <div className="production-task-rule" name="packingRuleObj" key="packingRuleObj">
                <Lov name="packingRuleObj" disabled />
                <Tooltip placement="top" title={packingRuleJson}>
                  <Icon type="contact_support-o" />
                </Tooltip>
              </div>
              <div name="reworkRuleObj" key="reworkRuleObj">
                <Lov name="reworkRuleObj" disabled />
                <Tooltip placement="top" title={reworkRuleJson}>
                  <Icon type="contact_support-o" />
                </Tooltip>
              </div>
              <NumberField name="priority" disabled />
              <TextField name="externalId" disabled />
              <TextField name="externalNum" disabled />
              <TextField name="remark" colSpan={2} disabled />
            </Form>
            <div
              style={{
                display: 'inline-block',
                width: '25%',
                marginTop: '-50px',
                marginLeft: '50%',
                position: 'absolute',
                lineHeight: '50px',
                paddingLeft: 15,
              }}
            >
              <Tooltip placement="top" title={docProcessRule}>
                <a style={{ marginLeft: '15%' }}>
                  {intl.get(`${preCode}.model.docProcessRule`).d('单据处理规则')}
                </a>
              </Tooltip>
            </div>
          </div>
        </Card>
        <Card
          key="production-task-detail-line"
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        >
          <Tabs defaultActiveKey="item">
            {tabsArr().map((tab) => (
              <TabPane
                tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)}
                key={tab.code}
              >
                {tab.component}
              </TabPane>
            ))}
          </Tabs>
        </Card>
      </Content>
    </Fragment>
  );
};
