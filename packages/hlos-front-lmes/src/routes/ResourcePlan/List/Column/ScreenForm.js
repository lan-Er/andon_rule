import React from 'react';
import { Form, Lov, TextField } from 'choerodon-ui/pro';
import { Modal } from 'choerodon-ui';

import '../index.less';

const ScreenForm = (props) => {
  const { visible, onOK, onCancel } = props;
  return (
    <Modal
      title="任务查询"
      visible={visible}
      onOk={onOK}
      onCancel={() => onCancel(!visible)}
      width={450}
      closable
      destroyOnClose
    >
      <Form dataSet={props.ds} columns={1} style={{ flex: 'auto' }}>
        <TextField name="taskNum" key="taskNum" />
        <TextField name="itemCode" key="itemCode" />
        <TextField name="documentNum" key="documentNum" />
        <Lov name="operationObj" noCache />
      </Form>
    </Modal>
  );
};
export default ScreenForm;
