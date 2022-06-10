/*
 * @Description: 返修任务平台-index
 * @Author: yu.na@hand-china.com
 * @Date: 2021-01-11 10:01:51
 * @LastEditors: Please set LastEditors
 */
import { Header, Content } from 'components/Page';
import { Button, Table, DataSet, CheckBox } from 'choerodon-ui/pro';
import React, { Fragment, useMemo, useCallback } from 'react';

import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
// import { queryLovData } from 'hlos-front/lib/services/api';
import { yesOrNoRender, orderStatusRender } from 'hlos-front/lib/utils/renderer';

// import codeConfig from '@/common/codeConfig';
import { ListDS } from '@/stores/reworkPlatformDS';
import { createReworkTaskEasy, createReworkTask } from '@/services/taskService';

// const { common } = codeConfig.code;

const preCode = 'lmes.reworkPlatform';

const listFactory = () => new DataSet(ListDS());

const ReworkPlatform = ({ history }) => {
  const listDS = useDataSet(listFactory, ReworkPlatform);

  const columns = useMemo(() => {
    return [
      { name: 'organizationName', width: 128, lock: true },
      { name: 'taskNum', width: 144, lock: true },
      { name: 'productCode', width: 128, lock: true },
      { name: 'productDescription', width: 200, lock: true },
      { name: 'operation', width: 128, lock: true },
      { name: 'uomName', width: 70 },
      { name: 'reworkQty', width: 82 },
      { name: 'taskQty', width: 82 },
      { name: 'reworkOperation', width: 128 },
      { name: 'reworkRule', width: 128 },
      { name: 'taskDescription', width: 128 },
      { name: 'documentNum', width: 144 },
      { name: 'documentLineNum', width: 82 },
      { name: 'documentTypeName', width: 128 },
      { name: 'sourceTaskNum', width: 144 },
      { name: 'relatedTask', width: 144 },
      {
        name: 'taskStatusMeaning',
        width: 90,
        renderer: ({ record, text }) => orderStatusRender(record.get('taskStatus'), text),
      },
      {
        name: 'firstOperationFlag',
        width: 70,
        renderer: yesOrNoRender,
        editor: (record) => (record.editing ? <CheckBox /> : false),
      },
      {
        name: 'lastOperationFlag',
        width: 70,
        renderer: yesOrNoRender,
        editor: (record) => (record.editing ? <CheckBox /> : false),
      },
      { name: 'taskTypeName', width: 128 },
      { name: 'prodLineName', width: 128 },
      { name: 'equipmentName', width: 128 },
      { name: 'workcellName', width: 128 },
      { name: 'workerGroupName', width: 128 },
      { name: 'workerName', width: 82 },
      { name: 'actualStartTime', width: 144 },
      { name: 'actualEndTime', width: 144 },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        command: ({ record }) => {
          return [
            <Button onClick={() => handleToReworkOperation(record.data)}>
              {intl.get(`${preCode}.button.reworkCreate`).d('创建返修')}
            </Button>,
          ];
        },
        lock: 'right',
      },
    ];
  }, []);

  const lineColumns = useMemo(() => {
    return [
      { name: 'organizationName', width: 128, lock: true },
      { name: 'taskNum', width: 144, lock: true },
      { name: 'productCode', width: 128, lock: true },
      { name: 'productDescription', width: 200, lock: true },
      { name: 'operation', width: 128, lock: true },
      {
        name: 'taskStatusMeaning',
        width: 90,
        renderer: ({ record, text }) => orderStatusRender(record.get('taskStatus'), text),
      },
      { name: 'uomName', width: 70 },
      { name: 'taskQty', width: 82 },
      { name: 'executableQty', width: 82 },
      { name: 'processOkQty', width: 82 },
      { name: 'processNgQty', width: 82 },
      { name: 'reworkQty', width: 82 },
      { name: 'scrappedQty', width: 82 },
      { name: 'pendingQty', width: 82 },
      { name: 'wipQty', width: 82 },
      { name: 'executeRule', width: 128 },
      { name: 'reworkRule', width: 128 },
      { name: 'dispatchRule', width: 128 },
      { name: 'packingRule', width: 128 },
      {
        name: 'firstOperationFlag',
        width: 70,
        renderer: yesOrNoRender,
        editor: (record) => (record.editing ? <CheckBox /> : false),
      },
      {
        name: 'lastOperationFlag',
        width: 70,
        renderer: yesOrNoRender,
        editor: (record) => (record.editing ? <CheckBox /> : false),
      },
      { name: 'relatedTask', width: 144 },
      { name: 'prodLineName', width: 128 },
      { name: 'equipmentName', width: 128 },
      { name: 'workcellName', width: 128 },
      { name: 'workerGroupName', width: 128 },
      { name: 'workerName', width: 82 },
      { name: 'resourceName', width: 128 },
      { name: 'locationName', width: 128 },
      { name: 'calendarDay', width: 100 },
      { name: 'calendarShiftCode', width: 82 },
      { name: 'planStartTime', width: 144 },
      { name: 'planEndTime', width: 144 },
      { name: 'actualStartTime', width: 144 },
      { name: 'actualEndTime', width: 144 },
      { name: 'standardWorkTime', width: 82 },
      { name: 'planProcessTime', width: 82 },
      { name: 'processedTime', width: 82 },
      { name: 'transactionTime', width: 82 },
      { name: 'priority', width: 70 },
    ];
  }, []);

  // useEffect(() => {
  //   async function queryDefaultOrg() {
  //     const res = await queryLovData({
  //       lovCode: common.organization,
  //       defaultFlag: 'Y',
  //     });
  //     if (res && res.content && res.content[0] && listDS.queryDataSet) {
  //       listDS.queryDataSet.current.set('organizationObj', res.content[0]);
  //     }
  //   }
  //   queryDefaultOrg();
  // }, []);

  const handleToReworkOperation = useCallback((data) => {
    const { taskId, itemId, reworkQty, documentNum, organizationId } = data;
    history.push({
      pathname: `/lmes/rework-platform/create`,
      state: {
        sourceTaskId: taskId,
        sourceItemId: itemId,
        reworkQty,
        moNum: documentNum,
        organizationId,
      },
    });
  }, []);

  const handleEasyCreate = useCallback(async () => {
    if (!listDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const arr = [];
    listDS.selected.forEach((i) => {
      const { taskId, itemId, reworkOperation } = i.data;
      arr.push({
        sourceTaskId: taskId,
        sourceItemId: itemId,
        reworkOperation,
      });
    });
    const res = await createReworkTaskEasy(arr);
    if (getResponse(res)) {
      notification.success();
      listDS.query();
    }
  }, []);

  const handleCreateRework = useCallback(async () => {
    if (!listDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const arr = [];
    listDS.selected.forEach((i) => {
      arr.push({
        sourceTaskId: i.data.taskId,
        sourceItemId: i.data.itemId,
        createReworkTaskLineDTOList: [
          {
            ...i.toJSONData(),
          },
        ],
      });
    });
    const res = await createReworkTask(arr);
    if (getResponse(res)) {
      notification.success();
      await listDS.query();
    }
  }, []);

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.index`).d('返修任务平台')}>
        <Button onClick={handleEasyCreate}>
          {intl.get(`${preCode}.button.quickCreate`).d('快速创建')}
        </Button>
        <Button onClick={handleCreateRework}>
          {intl.get(`${preCode}.button.operationRework`).d('本序返修')}
        </Button>
      </Header>
      <Content>
        <Table
          dataSet={listDS}
          columns={columns}
          columnResizable="true"
          editMode="inline"
          queryFieldsLimit={4}
        />
        <Table
          dataSet={listDS.children.lineList}
          columns={lineColumns}
          columnResizable="true"
          editMode="inline"
        />
      </Content>
    </Fragment>
  );
};

export default ReworkPlatform;
