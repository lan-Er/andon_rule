/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-10-14 10:07:15
 * @LastEditTime: 2020-10-23 16:07:27
 * @Description: 添加员工
 */
import React, { useEffect } from 'react';
import { DataSet, Lov, Button, Form } from 'choerodon-ui/pro';

const workerDs = new DataSet({
  fields: [
    {
      name: 'addWorkerObj',
      type: 'object',
      lovCode: 'LMDS.WORKER',
      nocache: false,
    },
    {
      name: 'workerId',
      type: 'string',
      bind: 'addWorkerObj.workerId',
    },
    {
      name: 'workerName',
      type: 'string',
      bind: 'addWorkerObj.workerName',
    },
    {
      name: 'workerCode',
      type: 'string',
      bind: 'addWorkerObj.workerCode',
    },
  ],
});

export default (props) => {
  const { workerGroupId } = props;
  useEffect(() => {
    workerDs.create({});
    workerDs.fields.get('addWorkerObj').setLovPara('notWorkerGroupId', workerGroupId);
  }, [workerGroupId]);

  // 添加员工
  const onAddworkerClick = () => {
    props.onAddworkerClick(workerDs.current.get('addWorkerObj'));
  };

  return (
    <Form dataSet={workerDs} className="login" labelLayout="placeholder">
      <Lov name="addWorkerObj" placeholder="请输入员工" />
      <Button className="btn" onClick={onAddworkerClick}>
        确认
      </Button>
    </Form>
  );
};
