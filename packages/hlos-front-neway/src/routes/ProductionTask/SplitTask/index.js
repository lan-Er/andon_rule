/**
 *  生产任务 - 任务拆分
 * @since：2021/6/4
 * @author：jxy <xiaoyan.jin@hand-china.com>
 * @copyright Copyright (c) 2021,Hand
 */
import React, { useEffect, useMemo, useState, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { Divider, Row, Col } from 'choerodon-ui';
import { DataSet, Form, Table, Button, TextField, NumberField, Modal } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import axios from 'axios';
import { getCurrentOrganizationId } from 'utils/utils';

import { HLOS_LMESS } from 'hlos-front/lib/utils/config';

import { TaskSplitFormDS, TaskSplitListDS } from '@/stores/productionTaskDS';

const preCode = 'newway.productionTask';
const organizationId = getCurrentOrganizationId();

const SplitTask = ({ match }) => {
  const splitDetailDs = useMemo(() => new DataSet(TaskSplitFormDS()), []);
  const splitListDs = useMemo(() => new DataSet(TaskSplitListDS()), []);
  const [createCount, setCreateCount] = useState(1);
  const [formData, setFormData] = useState([]);
  const [splitModal, setSplitModal] = useState(null);

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    const preFormData = createCount === 1 ? [] : formData;
    const temp = { name: `attrField${createCount}`, value: null };
    preFormData.push(temp);
    setFormData(preFormData);
    if (createCount !== 1) {
      handleUpdateSplitModal();
    }
  }, [createCount]);

  async function handleSearch() {
    const { taskId } = match.params;
    splitDetailDs.setQueryParameter('taskId', taskId);
    splitListDs.setQueryParameter('taskId', taskId);
    await Promise.all([splitDetailDs.query(), splitListDs.query()]);
  }

  function handleSplit() {
    if (splitDetailDs.current.get('splittableQty') === 0) {
      notification.error({
        message: intl.get(`${preCode}.view.message.splitError`).d('可拆分数量为0，不可拆分!'),
      });
      return;
    }
    handleShowSplitModal();
  }

  /**
   * 监听拆分数量变化
   * @param value
   * @param index
   */
  function handleQtyChange(value, index) {
    const tempData = formData;
    tempData[index].value = value;
    setFormData(tempData);
  }

  /**
   * 任务拆分弹窗
   */
  function handleShowSplitModal() {
    const splittableQty = splitDetailDs.current.get('splittableQty');
    const modal = Modal.open({
      key: 'splitTask',
      maskClosable: true, // 点击蒙层是否允许关闭
      keyboardClosable: true, // 按 esc 键是否允许关闭
      destroyOnClose: true, // 关闭时是否销毁
      style: {
        width: 300,
      },
      title: intl.get(`${preCode}.view.modal.splitTitle`).d('生产任务拆分'),
      okText: intl.get(`hzero.common.button.confirm`).d('确定'),
      cancelText: intl.get(`hzero.common.button.cancel`).d('取消'),
      children: (
        <Fragment>
          <Row style={{ marginBottom: 10 }}>
            <Col span={8}>{intl.get(`${preCode}.splittableQty`).d('可拆分数量')}：</Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              {splittableQty}
            </Col>
          </Row>
          {formData &&
            formData.map((item, index) => {
              return (
                <Row style={{ marginBottom: 10 }} key={item.name}>
                  <Col span={8}>{intl.get(`${preCode}.taskQty`).d('拆分数量')}：</Col>
                  <Col span={16} style={{ textAlign: 'right' }}>
                    <NumberField
                      value={item.value}
                      min={0}
                      required
                      onChange={(value) => handleQtyChange(value, index)}
                    />
                  </Col>
                </Row>
              );
            })}
          <div style={{ textAlign: 'center' }}>
            <Button funcType="flat" color="dark" onClick={handleAddSplitLine}>
              + {intl.get(`${preCode}.button.addNext`).d('继续添加')}
            </Button>
          </div>
        </Fragment>
      ),
      onOk: async () => {
        const result = await handleValidateSplitQty();
        if (result) {
          await handleDoSplit();
        } else {
          notification.error({ message: '请输入拆分数量!' });
          return false;
        }
      },
      onCancel: () => {
        modal.close();
        setCreateCount(1);
      },
    });
    setSplitModal(modal);
  }

  /**
   * 更新Modal数据
   */
  function handleUpdateSplitModal() {
    const splittableQty = splitDetailDs.current.get('splittableQty');
    splitModal.update({
      children: (
        <Fragment>
          <Row style={{ marginBottom: 10 }}>
            <Col span={8}>{intl.get(`${preCode}.splittableQty`).d('可拆分数量')}：</Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              {splittableQty}
            </Col>
          </Row>
          {formData &&
            formData.map((item, index) => {
              return (
                <Row style={{ marginBottom: 10 }} key={item.name}>
                  <Col span={8}>{intl.get(`${preCode}.taskQty`).d('拆分数量')}：</Col>
                  <Col span={16} style={{ textAlign: 'right' }}>
                    <NumberField
                      value={item.value}
                      min={0}
                      required
                      onChange={(value) => handleQtyChange(value, index)}
                    />
                  </Col>
                </Row>
              );
            })}
          <div style={{ textAlign: 'center' }}>
            <Button funcType="flat" color="dark" onClick={handleAddSplitLine}>
              + {intl.get(`${preCode}.button.addNext`).d('继续添加')}
            </Button>
          </div>
        </Fragment>
      ),
    });
  }

  /**
   * 点击 继续添加
   */
  function handleAddSplitLine() {
    setCreateCount(createCount + 1);
  }

  /**
   * 验证 是否输入拆分数量
   * @returns {boolean}
   */
  function handleValidateSplitQty() {
    const temp = formData.filter((item) => item.value === null || item.value === '');
    return !temp.length > 0;
  }

  /**
   * 执行任务拆分
   * @returns {Promise<void>}
   */
  async function handleDoSplit() {
    const { taskId } = match.params;
    const url = `${HLOS_LMESS}/v1/${organizationId}/neway-productive-tasks/${taskId}/save-split-task`;
    const submitData = formData.map((item) => {
      return { taskQty: item.value };
    });
    const res = await axios({
      url,
      data: submitData,
      method: 'POST',
    });
    if (res && res.failed) {
      return false;
    }
    notification.success();
    setCreateCount(1);
    handleSearch();
  }

  const columns = [
    { name: 'organizationName', width: 128 },
    { name: 'taskTypeName', width: 128 },
    { name: 'taskNum', width: 128 },
    { name: 'productName', width: 128 },
    { name: 'operation', width: 128 },
    { name: 'sourceTaskNum', width: 128 },
    { name: 'taskStatusMeaning' },
    { name: 'taskQty', width: 128 },
    { name: 'pitStopQty', width: 128 },
    { name: 'processOkQty', width: 128 },
    { name: 'scrappedQty', width: 128 },
    { name: 'reworkQty', width: 128 },
    { name: 'wipQty', width: 128 },
    { name: 'pendingQty', width: 128 },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.splitTask`).d('生产任务拆分')}
        backPath="/lmes/neway/production-task/list"
      >
        <Button onClick={handleSplit}>{intl.get(`${preCode}.button.split`).d('拆分')}</Button>
      </Header>
      <Content>
        <Form dataSet={splitDetailDs} columns={4}>
          <TextField name="organizationName" />
          <TextField name="taskTypeName" />
          <TextField name="operation" />
          <TextField name="productName" />
          <TextField name="taskNum" />
          <TextField name="documentTypeName" />
          <TextField name="documentNum" />
          <TextField name="taskStatusMeaning" />
          <NumberField name="taskQty" />
          <NumberField name="splittableQty" />
        </Form>
        <Divider />
        <h3 style={{ marginBottom: 10 }}>
          {intl.get(`${preCode}.view.title.splitTaskDetail`).d('已拆分任务信息')}
        </h3>
        <Table dataSet={splitListDs} columns={columns} />
      </Content>
    </Fragment>
  );
};

export default formatterCollections({ code: [`${preCode}`] })(SplitTask);
