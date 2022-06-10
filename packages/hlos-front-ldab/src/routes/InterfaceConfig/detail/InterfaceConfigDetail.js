/*
 * @Description: 平台接口详情页面
 * @Author: jianjun.tan, <jianjun.tan@hand-china.com>
 * @Date: 2020-06-09 15:58:31
 * @LastEditors: jianjun.tan
 * @LastEditTime: 2020-06-09 16:12:01
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment, useEffect, useState, useMemo } from 'react';
import { Button, DataSet, Form, TextField, Tooltip, Table, Lov } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { Card } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import { Header, Content } from 'components/Page';
import { createprojectInterface } from '@/stores/interfaceCofigDS';
import InterfaceTest from './InterfaceTest';

const preCode = 'ldab.interfaceCofig';
const InterfaceConfigDetail = ({ history, match }) => {
  const headDS = useMemo(() => new DataSet(createprojectInterface()), []);
  const listDS = headDS.children.projectInterface;
  const [loading, setLoading] = useState(true);
  const [visibleTest, setVisibleTest] = useState(false);
  const [requestUrl, setRequestUrl] = useState(null);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line
  }, []);

  /**
   * 接口配置详情
   */
  async function handleSearch() {
    const { interfaceId } = match.params;
    if (interfaceId) {
      headDS.queryParameter = { interfaceId };
      listDS.queryParameter = { interfaceId };
      const restult = await headDS.query();
      setRequestUrl(isEmpty[restult] ? null : restult[0].requestUrl);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  const buttons = ['add', 'delete'];

  function getInterfaceColumns() {
    return [
      {
        name: 'projectObj',
        width: 150,
        editor: <Lov noCache />,
      },
      {
        name: 'projectName',
        width: 180,
        editor: false,
      },
      {
        name: 'domainUrl',
        width: 250,
        editor: false,
      },
      {
        name: 'interfaceUrl',
        width: 200,
        editor: <TextField />,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        command: ({ record }) => {
          return [
            <Tooltip
              key={record}
              placement="bottom"
              title={intl.get('hzero.common.button.cancel').d('取消')}
            >
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => handleCancle(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 取消
   */
  function handleCancle(record) {
    if (record.toData().projectInterfaceId) {
      listDS.current.reset();
    } else {
      listDS.remove(record);
    }
  }

  /**
   * 新增/更新项目数据接口
   */
  async function handleSaveProjectInterface() {
    const dsValid = await Promise.all([
      headDS.validate(false, false),
      listDS.validate(false, false),
    ]);
    if (dsValid.every((valid) => valid === true)) {
      const result = await headDS.submit();
      if (result === undefined) {
        notification.info({
          message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
        });
      } else {
        const { interfaceId } = result?.content[0] || {};
        if (isEmpty(match.params.interfaceId)) {
          history.push({
            pathname: `/ldab/interface-config/detail/${interfaceId}`,
          });
        } else {
          handleSearch();
        }
      }
    } else {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
    }
  }

  /**
   * 开启测试
   */
  function handleTest() {
    setVisibleTest(true);
  }

  /**
   * 隐藏测试
   */
  function handleOnCancel() {
    setVisibleTest(false);
  }

  const testProps = {
    url: requestUrl,
    visibleTest,
    onCancel: handleOnCancel,
  };

  return (
    <Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.interface.config.detail`).d('接口配置详情')}
        backPath="/ldab/interface-config"
        // isChange
      >
        <Button icon="APItest" onClick={handleTest} disabled={isEmpty(requestUrl)}>
          {intl.get('hzero.common.button.test').d('测试')}
        </Button>
        <Button onClick={handleSaveProjectInterface} color="primary" icon="save">
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </Header>
      <Content>
        <Card
          key="interface-header"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
          title={<h3>{intl.get(`${preCode}.view.title.interface.heard`).d('接口')}</h3>}
          loading={loading}
        >
          <Form dataSet={headDS} columns={2}>
            <TextField name="interfaceCode" />
            <TextField name="interfaceName" />
            <TextField name="requestUrl" />
          </Form>
        </Card>
        <Card
          key="project-interface-line"
          bordered={false}
          className={DETAIL_CARD_CLASSNAME}
          title={<h3>{intl.get(`${preCode}.view.title.project`).d('项目')}</h3>}
          loading={loading}
        >
          <Table
            key="projectInterfaceId"
            dataSet={listDS}
            columns={getInterfaceColumns()}
            buttons={buttons}
          />
        </Card>
      </Content>
      {visibleTest && <InterfaceTest {...testProps} />}
    </Fragment>
  );
};

export default InterfaceConfigDetail;
