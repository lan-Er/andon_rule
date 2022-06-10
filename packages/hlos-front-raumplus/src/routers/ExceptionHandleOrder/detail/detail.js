/*
 * @Descripttion: 异常处理订单编辑页
 * @version: 1.0.0
 * @Author: mingbo.zhang@hand-china.com
 * @Date: 2021-04-07 15:45:06
 * @LastEditors: mingbo.zhang@hand-china.com
 * @LastEditTime: 2021-04-13 09:41:38
 */
import React, { Fragment, useEffect, useState } from 'react';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { Button, DataSet, Form, TextField, Lov, Select, DateTimePicker } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { userSetting } from 'hlos-front/lib/services/api';
import { detailDS } from './detailDS';

const DetailDS = new DataSet(detailDS());

function DrawingEdit(props) {
  // console.log('props.params', props.match.params);
  const [changePage, setChangePage] = useState(false);

  useEffect(() => {
    const { invAbnormalId } =
      props.history && props.history.location && props.history.location.state;
    if (invAbnormalId) {
      setChangePage(true);
      refreshPage(invAbnormalId);
    } else {
      queryDefaultOrg();
    }
    return () => {
      if (DetailDS.current) {
        DetailDS.remove(DetailDS.current);
      }
    };
  }, []);

  const queryDefaultOrg = async () => {
    DetailDS.create({});
    const res = await userSetting({ defaultFlag: 'Y' });
    if (res && res.content && res.content[0]) {
      const { meOuId, meOuCode, meOuName } = res.content[0];
      DetailDS.current.set('organizationObj', {
        organizationId: meOuId,
        organizationCode: meOuCode,
        organizationName: meOuName,
      });
    }
  };

  const renderForm = () => {
    return (
      <Form dataSet={DetailDS} columns={4}>
        <Lov name="organizationObj" required disabled={changePage} />
        <TextField name="exceptiomHandler" />
        <DateTimePicker name="findTime" />
        <TextField name="invAbnormalNum" required disabled={changePage} />
        <Lov name="foundDepartmentObj" />
        <TextField name="processGroupLeader" />
        <TextField name="problemProcessSupervisor" />
        <Select name="problemLevel" />
        <TextField name="discoverProcess" />
        <TextField name="findStaff" />
        <DateTimePicker name="confirmTime" />
        <Lov name="soObj" />
        <TextField name="withoutDutyReasons" />
        <Select name="processCardType" />
        <DateTimePicker name="completionTime" />
        <TextField name="theLength" />
        <TextField name="showHow" />
      </Form>
    );
  };

  const handleSave = async () => {
    if (!DetailDS.current.get('organizationId')) {
      return notification.error({
        message: '组织不能为空！',
      });
    }
    if (!DetailDS.current.get('invAbnormalNum')) {
      return notification.error({
        message: '单据号不能为空！',
      });
    }
    const res = await DetailDS.submit();
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      return new Error(res);
    }
    props.history.push({
      pathname: `/raumplus/exception-handle-order/list`,
    });
  };

  // 根据id查询单据详情
  const refreshPage = async (invAbnormalId) => {
    DetailDS.setQueryParameter('invAbnormalId', invAbnormalId);
    await DetailDS.query().then((res) => {
      if (res && res !== '') {
        DetailDS.current.set('organizationObj', {
          organizationId: res.organizationId,
          organizationCode: res.organizationCode,
          organizationName: res.organizationName,
        });
        DetailDS.current.set('foundDepartmentObj', {
          // foundDepartmentId: res.foundDepartmentId,
          // foundDepartment: res.foundDepartment,
          // foundDepartmentName: res.foundDepartmentName,
          departmentId: res.foundDepartmentId,
          departmentCode: res.foundDepartment,
          departmentName: res.foundDepartmentName,
        });
      }
    });
  };

  return (
    <Fragment>
      <Header title="异常处理工单编辑" backPath="/raumplus/exception-handle-order/list">
        <Button color="primary" onClick={handleSave}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </Header>
      <Content>{renderForm()}</Content>
    </Fragment>
  );
}

export default DrawingEdit;
