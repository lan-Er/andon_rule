import React from 'react';
import { Form, Modal } from 'choerodon-ui';
import { Select } from 'choerodon-ui/pro';

const { Option } = Select;

const ClearLogsModel = (props) => {
  const { title, visible, datas, onCancel, onOk, onChange } = props;
  return (
    <Modal
      closable
      destroyOnClose
      title={title}
      onCancel={onCancel}
      onOk={onOk}
      visible={visible}
      key="clear-log"
    >
      <Form>
        <Select name="clearType" onChange={onChange} style={{ width: '100%' }}>
          {datas.map((item) => {
            const { value = '', meaning } = item;
            return (
              <Option key={value} value={value}>
                {meaning}
              </Option>
            );
          })}
        </Select>
      </Form>
    </Modal>
  );
};

const WrappedDynamicFieldSet = Form.create()(ClearLogsModel);
export default WrappedDynamicFieldSet;
