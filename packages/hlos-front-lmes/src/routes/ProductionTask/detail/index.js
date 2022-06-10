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
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';
import { ProductionTaskDetailDS } from '@/stores/productionTaskDS';
import {
  releaseTask,
  runTask,
  pauseTask,
  unholdTask,
  holdTask,
  cancelTask,
  closeTask,
} from '@/services/taskService';
import TabComponent from './TabComponent';
import './style.less';

const preCode = 'lmes.productionTask';
const tpmCode = 'lmes.tpmTask';
const { TabPane } = Tabs;

export default ({ match, history }) => {
  const detailDS = useMemo(() => new DataSet(ProductionTaskDetailDS()), []);
  const [showFlag, changeShowFlag] = useState(false);
  const [allDisabled, setAllDisabled] = useState(false);
  const [docProcessRule, setDocProcessRule] = useState('');
  const [numDisabled, setNumDisabled] = useState(true);
  const [dispatchRuleJson, setDispatchRuleJson] = useState(null);
  const [executeRuleJson, setExecuteRuleJson] = useState(null);
  const [inspectionRuleJson, setInspectionRuleJson] = useState(null);
  const [packingRuleJson, setPackingRuleJson] = useState(null);
  const [reworkRuleJson, setReworkRuleJson] = useState(null);

  const createFlag = () => {
    const { taskId } = match.params;
    return !taskId;
  };

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
        checkSoStatus(res);
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
    if (!createFlag()) {
      requstDetail();
    } else {
      detailDS.create({}, 0);
      detailDS.children.taskItems.create(
        {
          itemLineType: 'OUTPUT',
        },
        0
      );
    }
  }, []);

  /*
   **检查当前销售订单状态
   */
  function checkSoStatus(result) {
    if (result && result.content && result.content[0]) {
      if (result.content[0].soStatus === 'CLOSED' || result.content[0].soStatus === 'CANCELLED') {
        setAllDisabled(true);
      }
    }
  }

  /**
   *tab数组
   * @returns
   */
  function tabsArr() {
    return [
      {
        code: 'item',
        title: '物料',
        component: <TabComponent detailDS={detailDS} tabType="item" allDisabled={allDisabled} />,
      },
      {
        code: 'step',
        title: '步骤',
        component: <TabComponent detailDS={detailDS} tabType="step" allDisabled={allDisabled} />,
      },
    ];
  }

  function handleToggle() {
    changeShowFlag(!showFlag);
  }

  function handleCreate() {
    history.push('/lmes/production-task/create');
  }

  /**
   *下达
   */
  function handleRelease() {
    if (detailDS.current.data.taskStatus !== 'NEW') {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.submitLimit`)
          .d('只有新增状态的任务才允许下达！'),
      });
      return;
    }
    releaseTask([detailDS.current.data.taskId]).then(async (res) => {
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        await detailDS.query().then((resp) => {
          checkSoStatus(resp);
          sessionStorage.setItem('productionTaskRefresh', true);
        });
      }
    });
  }

  /**
   *运行
   */
  function handleRun() {
    if (
      detailDS.current.data.taskStatus === 'RELEASED' ||
      detailDS.current.data.taskStatus === 'DISPATCHED' ||
      detailDS.current.data.taskStatus === 'QUEUING' ||
      detailDS.current.data.taskStatus === 'PAUSE'
    ) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.runLimit`)
          .d('只有已下达、已分派、排队中和暂停状态的生产任务才允许运行！'),
      });
      return;
    }
    runTask([detailDS.current.data.taskId]).then(async (res) => {
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        await detailDS.query().then((resp) => {
          checkSoStatus(resp);
          sessionStorage.setItem('productionTaskRefresh', true);
        });
      }
    });
  }

  /**
   *暂停
   */
  function handlePause() {
    if (detailDS.current.data.taskStatus !== 'RUNNING') {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.pauseLimit`)
          .d('只有运行中的生产任务才允许暂停！'),
      });
      return;
    }
    pauseTask([detailDS.current.data.taskId]).then(async (res) => {
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
      } else {
        await detailDS.query().then((resp) => {
          checkSoStatus(resp);
          sessionStorage.setItem('productionTaskRefresh', true);
        });
      }
    });
  }

  /**
   *复原
   */
  function handleRestore() {
    if (detailDS.current.data.taskStatus !== 'PENDING') {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.restoreLimit`)
          .d('只有已暂挂状态的任务才允许复原！'),
      });
      return;
    }
    Modal.confirm({
      children: <p>{intl.get(`${tpmCode}.view.message.restoreTask`).d('是否复原任务？')}</p>,
      onOk: () =>
        unholdTask([detailDS.current.data.taskId]).then(async (res) => {
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            await detailDS.query().then((resp) => {
              checkSoStatus(resp);
              sessionStorage.setItem('productionTaskRefresh', true);
            });
          }
        }),
    });
  }

  /**
   *暂挂
   */
  async function handlePending() {
    if (
      detailDS.current.data.taskStatus === 'NEW' ||
      detailDS.current.data.taskStatus === 'DISPATCHED' ||
      detailDS.current.data.taskStatus === 'RELEASED' ||
      detailDS.current.data.taskStatus === 'QUEUING' ||
      detailDS.current.data.taskStatus === 'RUNNING' ||
      detailDS.current.data.taskStatus === 'PAUSE'
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
        holdTask([detailDS.current.data.taskId]).then(async (res) => {
          if (res && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
          } else {
            await detailDS.query().then((resp) => {
              checkSoStatus(resp);
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
          cancelTask([detailDS.current.data.taskId]).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              await detailDS.query().then((resp) => {
                checkSoStatus(resp);
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

  /**
   *关闭
   */
  function handleClose() {
    if (
      (detailDS.current.data.taskStatus !== 'CANCELLED' &&
        detailDS.current.data.taskStatus !== 'CLOSED') ||
      detailDS.current.data.taskStatus !== 'NEW'
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${tpmCode}.view.message.closeTask`).d('是否关闭任务？')}</p>,
        onOk: () =>
          closeTask([detailDS.current.data.taskId]).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              await detailDS.query().then((resp) => {
                checkSoStatus(resp);
                sessionStorage.setItem('productionTaskRefresh', true);
              });
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${tpmCode}.view.message.closeLimit`)
          .d('新增、已取消、已关闭状态的任务不允许关闭！'),
      });
    }
  }

  async function handleSubmit() {
    const validateValue = await detailDS.validate(false, false);
    if (!validateValue) {
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
    sessionStorage.setItem('productionTaskRefresh', true);
    if (createFlag() && res && res.content && res.content[0]) {
      // 新建页面创建数据成功后跳转到详情页面
      const pathname = `/lmes/production-task/detail/${res.content[0].taskId}`;
      history.push(pathname);
    } else if (!createFlag()) {
      detailDS.queryParameter = {
        taskId: res.content[0].taskId,
      };
      await detailDS.query().then((resp) => {
        checkSoStatus(resp);
      });
    }
  }

  function handleTypeChange(record) {
    if (
      !isEmpty(record.docProcessRule) &&
      JSON.parse(record.docProcessRule).task_num === 'manual'
    ) {
      setDocProcessRule(record.docProcessRule);
      detailDS.fields.get('taskNum').set('required', true);
      setNumDisabled(false);
    } else {
      detailDS.fields.get('taskNum').set('required', false);
      setNumDisabled(true);
    }
  }

  function handleRuleChange(record, ruleType) {
    if (record) {
      if (ruleType === 'Dispatch') {
        setDispatchRuleJson(record.ruleJson);
      }
      if (ruleType === 'Execute') {
        setExecuteRuleJson(record.ruleJson);
      }
      if (ruleType === 'Inspection') {
        setInspectionRuleJson(record.ruleJson);
      }
      if (ruleType === 'Packing') {
        setPackingRuleJson(record.ruleJson);
      }
      if (ruleType === 'Rework') {
        setReworkRuleJson(record.ruleJson);
      }
    }
  }

  return (
    <Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.productionTask`).d('生产任务')}
        backPath="/lmes/production-task/list"
      >
        <Button color="primary" onClick={handleSubmit} disabled={allDisabled}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
        <Button onClick={handleClose} disabled={createFlag() || allDisabled}>
          {intl.get('hzero.common.button.close').d('关闭')}
        </Button>
        <Button onClick={handleCancel} disabled={createFlag() || allDisabled}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button onClick={handleRestore} disabled={createFlag() || allDisabled}>
          {intl.get('lmes.common.button.restore').d('复原')}
        </Button>
        <Button onClick={handlePending} disabled={createFlag() || allDisabled}>
          {intl.get('lmes.common.button.pending').d('暂挂')}
        </Button>
        <Button onClick={handlePause} disabled={createFlag() || allDisabled}>
          {intl.get('lmes.common.button.pause').d('暂停')}
        </Button>
        <Button onClick={handleRun} disabled={createFlag() || allDisabled}>
          {intl.get('lmes.common.button.run').d('运行')}
        </Button>
        <Button onClick={handleRelease} disabled={createFlag() || allDisabled}>
          {intl.get('lmes.common.button.release').d('下达')}
        </Button>
        <Button onClick={handleCreate} disabled={createFlag() || allDisabled}>
          {intl.get('hzero.common.button.add').d('新增')}
        </Button>
      </Header>
      <Content className="lmes-production-task-detail-content">
        <Card
          key="production-task-detail-header"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
        >
          <Form dataSet={detailDS} columns={4}>
            <Lov name="orgObj" noCache disabled={!createFlag() || allDisabled} />
            <Lov
              name="taskTypeObj"
              noCache
              disabled={!createFlag() || allDisabled}
              onChange={handleTypeChange}
            />
            <Lov name="operationObj" noCache disabled={!createFlag() || allDisabled} />
            <TextField name="description" disabled={allDisabled} />
            <TextField name="taskNum" disabled={!createFlag() || allDisabled || numDisabled} />
            <Lov name="sourceDocTypeObj" disabled={!createFlag() || allDisabled} noCache />
            <Lov name="sourceDocObj" disabled={!createFlag() || allDisabled} noCache />
            <Lov name="sourceDocLineObj" disabled={!createFlag() || allDisabled} noCache />
            <Lov name="downstreamOperationObj" disabled={allDisabled} noCache />
            <Lov name="reworkOperationObj" disabled={allDisabled} noCache />
            <CheckBox name="firstOperationFlag" disabled={!createFlag() || allDisabled} />
            <CheckBox name="lastOperationFlag" disabled={!createFlag() || allDisabled} />
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
              <Lov name="sourceTaskObj" disabled={allDisabled} noCache />
              <Lov name="relatedTaskObj" disabled={allDisabled} noCache />
              <TextField name="taskGroup" disabled={allDisabled} />
              <Lov name="prodLineObj" disabled={allDisabled} noCache />
              <Lov name="workcellObj" disabled={allDisabled} noCache />
              <Lov name="equipmentObj" disabled={allDisabled} noCache />
              <Lov name="workerObj" disabled={allDisabled} noCache />
              <Lov name="workerGroupObj" disabled={allDisabled} noCache />
              <Lov name="resourceObj" disabled={allDisabled} noCache />
              <DatePicker name="calendarDay" disabled={allDisabled} />
              <Select name="calendarShiftCode" disabled={allDisabled} />
              <NumberField name="standardWorkTime" disabled={allDisabled} />
              <DateTimePicker name="planStartTime" disabled={allDisabled} />
              <DateTimePicker name="planEndTime" disabled={allDisabled} />
              <NumberField name="planProcessTime" disabled={allDisabled} />
              <div name="executeRuleObj" key="executeRuleObj">
                <Lov
                  name="executeRuleObj"
                  noCache
                  disabled={!createFlag() || allDisabled}
                  onChange={(record) => handleRuleChange(record, 'Execute')}
                />
                <Tooltip placement="top" title={executeRuleJson}>
                  <Icon type="contact_support-o" />
                </Tooltip>
              </div>
              <div name="inspectionRuleObj" key="inspectionRuleObj">
                <Lov
                  name="inspectionRuleObj"
                  noCache
                  disabled={!createFlag() || allDisabled}
                  onChange={(record) => handleRuleChange(record, 'Inspection')}
                />
                <Tooltip placement="top" title={inspectionRuleJson}>
                  <Icon type="contact_support-o" />
                </Tooltip>
              </div>
              <div name="dispatchRuleObj" key="dispatchRuleObj">
                <Lov
                  name="dispatchRuleObj"
                  noCache
                  disabled={!createFlag() || allDisabled}
                  onChange={(record) => handleRuleChange(record, 'Dispatch')}
                />
                <Tooltip placement="top" title={dispatchRuleJson}>
                  <Icon type="contact_support-o" />
                </Tooltip>
              </div>
              <div className="production-task-rule" name="packingRuleObj" key="packingRuleObj">
                <Lov
                  name="packingRuleObj"
                  noCache
                  disabled={!createFlag() || allDisabled}
                  onChange={(record) => handleRuleChange(record, 'Packing')}
                />
                <Tooltip placement="top" title={packingRuleJson}>
                  <Icon type="contact_support-o" />
                </Tooltip>
              </div>
              <div name="reworkRuleObj" key="reworkRuleObj">
                <Lov
                  name="reworkRuleObj"
                  noCache
                  disabled={!createFlag() || allDisabled}
                  onChange={(record) => handleRuleChange(record, 'Rework')}
                />
                <Tooltip placement="top" title={reworkRuleJson}>
                  <Icon type="contact_support-o" />
                </Tooltip>
              </div>
              <NumberField name="priority" disabled={allDisabled} />
              <TextField name="externalId" disabled={allDisabled} />
              <TextField name="externalNum" disabled={allDisabled} />
              <TextField name="remark" colSpan={2} disabled={allDisabled} />
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
