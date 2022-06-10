/*
 * @Description: 接口测试
 * @Author: jianjun.tan, <jianjun.tan@hand-china.com>
 * @Date: 2020-06-22 15:58:31
 * @LastEditors: jianjun.tan
 * @LastEditTime: 2020-06-22 16:12:01
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { useState } from 'react';
import intl from 'utils/intl';
import { Modal, Form, Icon, Input } from 'choerodon-ui';
import { Row, Col, Button } from 'choerodon-ui/pro';
import { isArray, isEmpty } from 'lodash';
import notification from 'utils/notification';
import { getResponse } from 'utils/utils';
import { asyncInterface } from '@/services/api';

const preCode = 'ldab.interfaceCofig';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

let uuid = 0;
const InterfaceTest = (props) => {
  const [loading, setLoading] = useState(false);

  function remove(k) {
    const { form } = props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter((key) => key !== k),
    });
  }

  function add() {
    const { form } = props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    const { form, url } = props;
    form.validateFields((err, values) => {
      if (!err) {
        const body = {};
        const { key, value } = values;
        if (isArray(key) && !isEmpty(key)) {
          key.forEach((k, i) => {
            body[k] = value[i];
          });
        }
        asyncInterface({ body, url }).then((res) => {
          getResponse(res);
          notification.success();
          setLoading(false);
        });
      }
    });
  }

  const { getFieldDecorator, getFieldValue } = props.form;
  getFieldDecorator('keys', { initialValue: [] });
  const keys = getFieldValue('keys');
  const formItems = keys.map((k, index) => {
    return (
      <Row gutter={16} key={`row${k}`}>
        <Col span={11}>
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? 'Passengers' : ''}
            required={false}
            key={`key${k}`}
          >
            {getFieldDecorator(`key[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input key',
                },
              ],
            })(<Input placeholder="key" />)}
          </FormItem>
        </Col>
        <Col span={11}>
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? 'value' : ''}
            required={false}
            key={`value${k}`}
          >
            {getFieldDecorator(`value[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input value',
                },
              ],
            })(<Input placeholder="value" />)}
          </FormItem>
        </Col>
        <Col span={2}>
          {keys.length > 1 ? (
            <Icon
              style={{ lineHeight: 3 }}
              className="dynamic-delete-button"
              type="cancle_b"
              disabled={keys.length === 1}
              onClick={() => remove(k)}
            />
          ) : null}
        </Col>
      </Row>
    );
  });

  const { onCancel, visibleTest } = props;
  return (
    <Modal
      key="test-interface"
      title={intl.get(`${preCode}.view.title.interface.test.param`).d('请求接口参数')}
      visible={visibleTest}
      footer={null}
      onCancel={onCancel}
      width={500}
      closable
      destroyOnClose
    >
      <Form>
        {formItems}
        <Row gutter={16}>
          <Col span={22}>
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button icon="add" onClick={add} style={{ width: '100%' }}>
                {intl.get(`${preCode}.view.title.interface.test.add.param`).d('新增参数')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button color="primary" onClick={(e) => handleSubmit(e)} loading={loading}>
                {intl.get(`${preCode}.view.title.interface.test.begin`).d('开始测试')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
const WrappedDynamicFieldSet = Form.create()(InterfaceTest);
export default WrappedDynamicFieldSet;
