/**
 * @Description: 需求确认--订单详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-12 17:17:10
 */

import React, { useState, useEffect, Fragment } from 'react';
import { Card } from 'choerodon-ui';
import { DataSet, Form, TextField, Table, Tabs, DatePicker, Button } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import moment from 'moment';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import {
  requirementConfirmDetailDS,
  requirementConfirmLineDS,
  promiseDateDS,
} from '../store/RequirementConfirmDS';
import { getSerialNum } from '@/utils/renderer';
import { confirmPoLine } from '@/services/requirementConfirm';
import './index.less';

const commonPrefix = 'zcom.common';
const intlPrefix = 'zcom.requirementConfirm';
const { TabPane } = Tabs;
const organizationId = getCurrentOrganizationId();
const HeadDS = new DataSet(requirementConfirmDetailDS());
const LineDS = new DataSet(requirementConfirmLineDS());
const DateDS = new DataSet(promiseDateDS());

function ZcomRequirementConfirmDetail(props) {
  const {
    match: {
      params: { tabType, poHeaderId },
    },
  } = props;

  const [curTab, setCurTab] = useState('basic');

  useEffect(() => {
    setCurTab('basic');
    handleSearch(poHeaderId);
  }, [poHeaderId]);

  async function handleSearch() {
    HeadDS.setQueryParameter('poHeaderId', poHeaderId);
    LineDS.setQueryParameter('poHeaderId', poHeaderId);
    await HeadDS.query();
    await LineDS.query();
  }

  async function handleSave() {
    if (!LineDS.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('请至少选择一条数据'),
      });
      return;
    }
    const isDateValid = await DateDS.validate(false, false);
    if (!isDateValid) {
      notification.warning({
        message: intl.get(`${intlPrefix}.view.warn.promiseDateInvalid`).d('交期批量回复未填写'),
      });
      return;
    }
    const isTableValid = await LineDS.validate(false, false);
    if (!isTableValid) {
      return;
    }
    const arr = [];
    LineDS.selected.forEach((v) => {
      arr.push(
        Object.assign({}, v.data, {
          promiseDate: moment(DateDS.current.get('promiseDate')).format('YYYY-MM-DD HH:mm:ss'),
        })
      );
    });
    try {
      const res = await confirmPoLine(arr);
      if (res && !res.failed) {
        notification.success({
          message: '操作成功',
        });
        LineDS.query();
      } else {
        notification.error({
          message: res.message,
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  // 获取导出字段查询参数
  const getExportQueryParams = () => {
    const queryDataDs = LineDS && LineDS.queryDataSet && LineDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      poHeaderId,
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  };

  const commonColums = [
    {
      header: '行号',
      width: 60,
      lock: true,
      renderer: ({ record }) => getSerialNum(record),
      editor: false,
    },
    { name: 'itemCode', width: 150, editor: false },
    { name: 'description', width: 150, editor: false },
    { name: 'supplierItemCode', editor: false },
    { name: 'unitPrice', width: 150, editor: false },
    { name: 'demandQty', width: 150, editor: false },
    { name: 'promiseQty', width: 150, editor: tabType === 'unResponse', align: 'left' },
    { name: 'uomName', width: 150, editor: false },
    { name: 'lineAmount', width: 150, editor: false },
    { name: 'taxRate', width: 150, editor: false },
    { name: 'demandDate', width: 150, editor: false },
    { name: 'promiseDate', width: 150, editor: tabType === 'unResponse' },
    { name: 'receiveOrg', width: 150, editor: false },
  ];

  const columns =
    tabType === 'unResponse'
      ? commonColums.concat([
          {
            header: intl.get('hzero.common.button.action').d('操作'),
            width: 100,
            command: ['edit'],
            lock: 'right',
          },
        ])
      : commonColums;

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.requirementConfirmDetail`).d('需求确认明细')}
        backPath="/zcom/requirement-confirm/list"
      >
        <ExcelExport
          requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/po-lines/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content>
        <Card
          key="zcom-requirement-confirm-detail-header"
          title={intl.get(`${intlPrefix}.view.title.headInfo`).d('抬头信息')}
          bordered={false}
        >
          <Form dataSet={HeadDS} columns={4} className="form-headInfo">
            <TextField name="poNum" disabled />
            <TextField name="supplierNumber" disabled />
            <TextField name="supplierName" disabled />
            <TextField name="supplierSiteAddress" disabled />
            <TextField name="poTypeCodeMeaning" disabled />
            <TextField name="scmOuName" disabled />
            <TextField name="buyerName" disabled />
            <TextField name="publishDate" disabled />
            <TextField name="totalAmount" disabled />
            <TextField name="taxRate" disabled />
            <TextField name="paymentMethod" disabled />
            <TextField name="receiveAddress" disabled />
            <TextField name="remark" disabled />
          </Form>
        </Card>
        <div className="basic-header">
          <Tabs defaultActiveKey="basic" className="basic-tabs">
            <TabPane tab="基础信息" key="basic" />
          </Tabs>
          <div className="date-replys">
            <Form dataSet={DateDS} className="form-date">
              <DatePicker mode="date" name="promiseDate" disabled={tabType !== 'unResponse'} />
            </Form>
            <Button className="form-btn" onClick={handleSave} disabled={tabType !== 'unResponse'}>
              保存
            </Button>
          </div>
        </div>
        {curTab === 'basic' && (
          <Table
            dataSet={LineDS}
            columns={columns}
            columnResizable="true"
            queryBar="none"
            editMode="inline"
          />
        )}
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})((props) => {
  return <ZcomRequirementConfirmDetail {...props} />;
});
