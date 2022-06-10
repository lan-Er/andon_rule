/*
 * @Description: 海马汇 API 配置
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-13 17:02:44
 * @LastEditors: liangkun
 * @LastEditTime: 2020-07-13 17:15:43
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment } from 'react';
import {
  DataSet,
  Table,
  Button,
  Modal,
  UrlField,
  NumberField,
  IntlField,
  Select,
  Row,
  Col,
} from 'choerodon-ui/pro';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import styles from './index.less';
import EnvironmentDS from '../stores/EnvironmentDS';

const { Option } = Select;
const modalKey = Modal.key();
const preCode = 'lmds.andonRank';

export default function EnvironmentPage() {
  const todoTableDataSetFactory = () => new DataSet({ ...EnvironmentDS() });
  const todoFormDataSetFactory = () => new DataSet({ ...EnvironmentDS(), autoQuery: false });
  const tableDS = useDataSet(todoTableDataSetFactory, EnvironmentPage);
  const formDS = useDataSet(todoFormDataSetFactory);

  function getColumns() {
    return [
      {
        name: 'serialNumber',
        width: 90,
        align: 'center',
        editor: (record) => record.status === 'add',
        lock: true,
      },
      {
        name: 'environmentName',
        width: 150,
        editor: (record) => record.status === 'add',
        lock: true,
      },
      { name: 'environmentApi', editor: (record) => record.status === 'add', lock: true },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 120,
        command: ({ record }) => [
          ['edit', { onClick: () => handleOpenModal(record) }],
          ['delete', { color: 'red' }],
        ],
        lock: 'right',
      },
    ];
  }

  /**
   * 弹框新建
   */
  function handleOpenModal(record) {
    if (record) {
      const data = record.toData();
      formDS.data = [data];
    } else {
      formDS.create();
    }
    Modal.open({
      key: modalKey,
      title: '新增API配置',
      drawer: true,
      children: (
        <Fragment>
          <Row>
            <Col span={5} className="c7n-pro-field-label c7n-pro-field-label-right">
              序号
            </Col>
            <Col span={19} className="c7n-pro-field-wrapper">
              <NumberField dataSet={formDS} name="serialNumber" className={styles['max-width']} />
            </Col>
          </Row>
          <Row>
            <Col span={5} className="c7n-pro-field-label c7n-pro-field-label-right">
              环境名称
            </Col>
            <Col span={19} className="c7n-pro-field-wrapper">
              <IntlField dataSet={formDS} name="environmentName" className={styles['max-width']} />
            </Col>
          </Row>
          <Row>
            <Col span={5} className="c7n-pro-field-label c7n-pro-field-label-right">
              环境地址
            </Col>
            <Col span={5} className="c7n-pro-field-wrapper">
              <Select dataSet={formDS} name="addonBefore">
                <Option value="http://">http://</Option>
                <Option value="https://">https://</Option>
              </Select>
            </Col>
            <Col span={14} className="c7n-pro-field-wrapper">
              <UrlField dataSet={formDS} name="addonAfter" className={styles['max-width']} />
            </Col>
          </Row>
        </Fragment>
      ),
      onOk: handleSubmit,
    });
  }

  /**
   * 保存
   */
  async function handleSubmit() {
    const validateValue = await formDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return false;
    }
    const res = await formDS.submit();
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
    } else {
      await tableDS.query();
    }
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.apiConfig`).d('API配置')}>
        <Button icon="add" color="primary" onClick={() => handleOpenModal()}>
          {intl.get('hzero.common.button.create').d('新建')}
        </Button>
      </Header>
      <Content>
        <Table dataSet={tableDS} columns={getColumns()} columnResizable="true" editMode="inline" />
      </Content>
    </Fragment>
  );
}
