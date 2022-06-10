/*
 * @module: 新增页和编辑页
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2020-12-29 14:23:33
 * @LastEditTime: 2021-03-01 15:10:26
 * @copyright: Copyright (c) 2020,Hand
 */
import React, { Fragment, useEffect, useMemo } from 'react';
import { Button, Form, Lov, TextField, Switch, Select, DataSet } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { getResponse } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';

import detailDsForm from '../stores/detailDs';
import LineList from './LineList';

function UnitPriceDetails({ history, match, history: { location } }) {
  const unitPriceDetailsDs = useDataSet(() => new DataSet(detailDsForm()), UnitPriceDetails);
  const allowEditor = useMemo(() => {
    const { params } = match;
    if (params.workPriceId) {
      return false;
    } else {
      return true;
    }
  }, []);

  useEffect(() => {
    const { params } = match;
    unitPriceDetailsDs.create({});
    if (params.workPriceId) {
      refreshPage(params.workPriceId);
    }
    return () => {
      if (unitPriceDetailsDs.current) {
        unitPriceDetailsDs.remove(unitPriceDetailsDs.current);
      }
    };
  }, [location]);

  /**
   * @description: 进入详情页查询
   * @param {*} workPriceId
   * @return {*}
   */
  function refreshPage(workPriceId) {
    unitPriceDetailsDs.queryParameter = {
      workPriceId,
    };
    unitPriceDetailsDs.query();
  }

  /**
   * @description: 保存
   * @param {*}
   * @return {*}
   */
  async function handleSave() {
    const validateValue = await unitPriceDetailsDs.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await unitPriceDetailsDs.submit(false, false);
    if (res === undefined) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }
    if (getResponse(res)) {
      const { params } = match;
      sessionStorage.setItem('unitPriceParentQuery', true);
      if (params && params.workPriceId) {
        history.push(`/lmds/unit-price/edit/${res.content[0].workPriceId}`);
      } else {
        refreshPage(res.content[0].workPriceId);
      }
    }
  }

  return (
    <Fragment key="unit-price-details">
      <Header title="工时单价" backPath="/lmds/unit-price/list">
        <Button onClick={handleSave} color="primary">
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </Header>
      <Content>
        <Form dataSet={unitPriceDetailsDs} columns={4}>
          <Select name="workPriceType" disabled={!allowEditor} />
          <Lov name="assignRuleObj" />
          <TextField name="description" colSpan={2} />
          <Lov name="productionObj" />
          <Lov name="itemObj" />
          <Lov name="categoryObj" />
          <Lov name="operationObj" />
          <Lov name="organizationObj" />
          <Lov name="departmentObj" />
          <Lov name="partyObj" />
          <TextField name="projectNum" />
          <TextField name="wbsNum" />
          <TextField name="auditWorkflowId" />
          <TextField name="externalId" />
          <TextField name="externalNum" />
          <Switch name="enabledFlag" />
        </Form>
        <div>
          <LineList mylineDs={unitPriceDetailsDs} />
        </div>
      </Content>
    </Fragment>
  );
}

export default UnitPriceDetails;
